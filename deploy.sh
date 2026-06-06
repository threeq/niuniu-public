#!/usr/bin/env bash
# deploy.sh -- deploy niuniu official website (www.niu6ai.com)
#
# Quick reference:
#   bash deploy.sh                      # build + deploy the website
#   bash deploy.sh --skip-build         # skip Astro build, use existing dist/
#   bash deploy.sh --dry-run            # print plan, do nothing
#
# Options:
#   --skip-build        Skip Astro build (use existing website/dist/).
#   --target-host=HOST  Override TARGET_HOST.
#   --dry-run           Print the plan; no remote mutations.
#   -y, --yes           Skip the 5-second confirmation countdown.
#   -h, --help          Show this help.
#
# Env overrides (all optional; defaults baked for the niu6ai.com production host):
#   TARGET_HOST           default 47.85.135.141
#   SSH_USER              default ecs-user
#   SSH_PORT              default 22
#   WEBSITE_REMOTE_DIR    default apps/niuniu-website
#   WEBSITE_DOMAIN        default www.niu6ai.com
#   WEBSITE_APEX_DOMAIN   default niu6ai.com

set -euo pipefail

TARGET_HOST="${TARGET_HOST:-47.85.135.141}"
SSH_USER="${SSH_USER:-ecs-user}"
SSH_PORT="${SSH_PORT:-22}"
WEBSITE_REMOTE_DIR="${WEBSITE_REMOTE_DIR:-apps/niuniu-website}"
WEBSITE_DOMAIN="${WEBSITE_DOMAIN:-www.niu6ai.com}"
WEBSITE_APEX_DOMAIN="${WEBSITE_APEX_DOMAIN:-niu6ai.com}"

SKIP_BUILD=0
DRY_RUN=0
ASSUME_YES=0

usage() {
  sed -n '1,/^set -euo/p' "${BASH_SOURCE[0]}" | sed -e '/^set -euo/d' -e 's/^# \{0,1\}//'
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-build)        SKIP_BUILD=1; shift ;;
    --target-host=*)     TARGET_HOST="${1#*=}"; shift ;;
    --dry-run)           DRY_RUN=1; shift ;;
    -y|--yes)            ASSUME_YES=1; shift ;;
    -h|--help)           usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; echo "Run with --help for usage." >&2; exit 2 ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$SCRIPT_DIR"
SSH_OPTS=(-p "$SSH_PORT" -o StrictHostKeyChecking=accept-new -o ServerAliveInterval=30 -o ServerAliveCountMax=20)
SSH_TARGET="${SSH_USER}@${TARGET_HOST}"

ssh_run()     { ssh "${SSH_OPTS[@]}" "$SSH_TARGET" "$@"; }
ssh_pipe_in() { ssh "${SSH_OPTS[@]}" "$SSH_TARGET" "$@"; }

bold()    { printf '\033[1m%s\033[0m\n' "$*"; }
section() { printf '\n\033[1;34m==> %s\033[0m\n' "$*"; }
warn()    { printf '\033[33m!! %s\033[0m\n' "$*" >&2; }
fail()    { printf '\033[1;31m!! %s\033[0m\n' "$*" >&2; exit 1; }

bold "Deploy plan"
echo "  Target:         $SSH_TARGET (port $SSH_PORT)"
echo "  Website dir:    \$HOME/$WEBSITE_REMOTE_DIR"
echo "  Domain:         $WEBSITE_DOMAIN (apex: $WEBSITE_APEX_DOMAIN)"
echo "  Flags:          skip-build=$SKIP_BUILD"
[[ "$DRY_RUN" == "1" ]] && echo "  Mode:           DRY-RUN (no remote mutations)"

if [[ "$DRY_RUN" != "1" && "$ASSUME_YES" != "1" ]]; then
  echo
  echo "Starting in 5s. Ctrl+C to abort."
  for i in 5 4 3 2 1; do printf "  %d..." "$i"; sleep 1; done
  echo
fi

if [[ "$DRY_RUN" == "1" ]]; then
  bold "Dry-run requested; exiting before any remote mutation."
  exit 0
fi

# =============================================================================
# Website: build -> rsync -> verify
# =============================================================================

section "Website: build -> rsync -> verify"

if [[ "$SKIP_BUILD" != "1" ]]; then
  echo "  building website (pnpm)..."
  (cd "$REPO_ROOT/website" && pnpm install --frozen-lockfile && pnpm build)
fi

echo "  sanity-checking dist/..."
for f in dist/index.html dist/en/index.html dist/pagefind/pagefind.js dist/sitemap-index.xml; do
  [[ -f "$REPO_ROOT/website/$f" ]] || fail "website/$f missing -- abort."
done

echo "  syncing dist/ -> \$HOME/$WEBSITE_REMOTE_DIR/dist/..."
ssh_run "mkdir -p \"\$HOME/$WEBSITE_REMOTE_DIR/dist\" \"\$HOME/$WEBSITE_REMOTE_DIR/.dist.staging\""
if command -v rsync >/dev/null 2>&1; then
  rsync -avz --delete \
    -e "ssh ${SSH_OPTS[*]}" \
    "$REPO_ROOT/website/dist/" "$SSH_TARGET:\$HOME/$WEBSITE_REMOTE_DIR/dist/"
else
  ssh_run "rm -rf \"\$HOME/$WEBSITE_REMOTE_DIR/.dist.staging\" && mkdir -p \"\$HOME/$WEBSITE_REMOTE_DIR/.dist.staging\""
  tar -C "$REPO_ROOT/website/dist" -cf - . | ssh_pipe_in "tar -C \"\$HOME/$WEBSITE_REMOTE_DIR/.dist.staging\" -xf -"
  ssh_run "rsync -a --delete \"\$HOME/$WEBSITE_REMOTE_DIR/.dist.staging/\" \"\$HOME/$WEBSITE_REMOTE_DIR/dist/\" && rm -rf \"\$HOME/$WEBSITE_REMOTE_DIR/.dist.staging\""
fi

echo "  verifying public URLs..."
verify_url() {
  local url="$1" expected="${2:-200}" actual
  actual=$(curl -sS --max-time 15 -o /dev/null -w '%{http_code}' "$url" 2>/dev/null || echo 000)
  if [[ "$actual" == "$expected" ]]; then
    echo "    $url -> $actual"
  else
    fail "$url returned $actual (expected $expected)"
  fi
}
verify_url "https://${WEBSITE_DOMAIN}/"                       200
verify_url "https://${WEBSITE_DOMAIN}/en"                     200
verify_url "https://${WEBSITE_DOMAIN}/docs/intro"             200
verify_url "https://${WEBSITE_DOMAIN}/pricing"                200
verify_url "https://${WEBSITE_DOMAIN}/pagefind/pagefind.js"   200

apex_status=$(curl -sS --max-time 10 -o /dev/null -w '%{http_code}' "https://${WEBSITE_APEX_DOMAIN}/" 2>/dev/null || echo 000)
if [[ "$apex_status" != "301" && "$apex_status" != "308" ]]; then
  warn "https://${WEBSITE_APEX_DOMAIN}/ returned $apex_status (expected 301/308 redirect)"
else
  echo "    https://${WEBSITE_APEX_DOMAIN}/ -> $apex_status (redirect)"
fi

echo
bold "==> Deploy complete."
echo "    Website:  https://${WEBSITE_DOMAIN}"
exit 0
