#!/usr/bin/env bash
# deploy.sh -- deploy niuniu official website (www.niu6ai.com)
#
# Quick reference:
#   bash deploy.sh                      # build locally + rsync dist/ to the server
#   bash deploy.sh --remote-build       # build ON the server (git pull + pnpm build) and publish
#   bash deploy.sh --remote-build --install-cron   # publish now + wire up auto-publish cron
#   bash deploy.sh --install-cron       # only (re)install the auto-publish cron
#   bash deploy.sh --skip-build         # skip Astro build, use existing dist/
#   bash deploy.sh --dry-run            # print plan, do nothing
#
# Options:
#   --remote-build      Build on the server over SSH (no local toolchain needed):
#                       fetch REMOTE_REF, pnpm build, atomic-swap into dist/. Best
#                       for routine publishes such as picking up a new GitHub
#                       release on /changelog. Ignores --skip-build.
#   --install-cron      Install/refresh a crontab entry on the server that runs the
#                       server-side build on a schedule, so a new GitHub release
#                       reaches /changelog automatically. Combine with --remote-build
#                       to also publish immediately. Override timing with --cron-schedule.
#   --cron-schedule=CRON  Cron expression for --install-cron (default '17 * * * *', hourly).
#   --skip-build        Skip Astro build (use existing website/dist/). Local mode only.
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
#   REMOTE_REPO_DIR       default $WEBSITE_REMOTE_DIR/repo  (server-side checkout)
#   REMOTE_REF            default main                      (branch/tag to build)
#   REPO_URL              default https://github.com/threeq/niuniu-public.git

set -euo pipefail

TARGET_HOST="${TARGET_HOST:-47.85.135.141}"
SSH_USER="${SSH_USER:-ecs-user}"
SSH_PORT="${SSH_PORT:-22}"
WEBSITE_REMOTE_DIR="${WEBSITE_REMOTE_DIR:-apps/niuniu-website}"
WEBSITE_DOMAIN="${WEBSITE_DOMAIN:-www.niu6ai.com}"
WEBSITE_APEX_DOMAIN="${WEBSITE_APEX_DOMAIN:-niu6ai.com}"
REMOTE_REPO_DIR="${REMOTE_REPO_DIR:-$WEBSITE_REMOTE_DIR/repo}"
REMOTE_REF="${REMOTE_REF:-main}"
REPO_URL="${REPO_URL:-https://github.com/threeq/niuniu-public.git}"

SKIP_BUILD=0
REMOTE_BUILD=0
INSTALL_CRON=0
CRON_SCHEDULE="${CRON_SCHEDULE:-17 * * * *}"
DRY_RUN=0
ASSUME_YES=0

usage() {
  sed -n '1,/^set -euo/p' "${BASH_SOURCE[0]}" | sed -e '/^set -euo/d' -e 's/^# \{0,1\}//'
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-build)        SKIP_BUILD=1; shift ;;
    --remote-build|--remote) REMOTE_BUILD=1; shift ;;
    --install-cron)      INSTALL_CRON=1; shift ;;
    --cron-schedule=*)   CRON_SCHEDULE="${1#*=}"; shift ;;
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
if [[ "$REMOTE_BUILD" == "1" ]]; then
  echo "  Mode:           REMOTE-BUILD (build on server)"
  echo "  Server repo:    \$HOME/$REMOTE_REPO_DIR @ $REMOTE_REF"
elif [[ "$INSTALL_CRON" == "1" ]]; then
  echo "  Mode:           INSTALL-CRON only (no immediate publish)"
  echo "  Server repo:    \$HOME/$REMOTE_REPO_DIR @ $REMOTE_REF"
else
  echo "  Mode:           LOCAL-BUILD (build here, rsync dist/)"
  echo "  Flags:          skip-build=$SKIP_BUILD"
fi
[[ "$INSTALL_CRON" == "1" ]] && echo "  Auto-publish:   cron '$CRON_SCHEDULE'"
[[ "$DRY_RUN" == "1" ]] && echo "  Dry-run:        on (no remote mutations)"

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

# Server-side build is driven by scripts/server-build.sh -- one source of truth
# shared by --remote-build (run once now) and the auto-publish cron (run on a
# schedule). Install it to a stable path OUTSIDE the repo checkout so a later
# `git reset --hard` cannot disturb a running build.
REMOTE_SCRIPT="$WEBSITE_REMOTE_DIR/remote-build.sh"
REMOTE_ENV="REMOTE_REF='$REMOTE_REF' REMOTE_REPO_DIR='$REMOTE_REPO_DIR' REPO_URL='$REPO_URL' WEBSITE_REMOTE_DIR='$WEBSITE_REMOTE_DIR'"
install_remote_script() {
  echo "  installing server-build.sh -> \$HOME/$REMOTE_SCRIPT ..."
  ssh_run "mkdir -p \"\$HOME/$WEBSITE_REMOTE_DIR\" && cat > \"\$HOME/$REMOTE_SCRIPT\" && chmod +x \"\$HOME/$REMOTE_SCRIPT\"" < "$REPO_ROOT/scripts/server-build.sh"
}

DID_BUILD=0
if [[ "$REMOTE_BUILD" == "1" || "$INSTALL_CRON" == "1" ]]; then
  install_remote_script
fi

if [[ "$REMOTE_BUILD" == "1" ]]; then
  # Remote build: run the installed script now (FORCE=1 -> always rebuild, since
  # an explicit deploy should publish even when the signature looks unchanged).
  section "Website: remote build -> swap -> verify"
  echo "  building on $SSH_TARGET ($REMOTE_REPO_DIR @ $REMOTE_REF)..."
  ssh_run "FORCE=1 $REMOTE_ENV bash \"\$HOME/$REMOTE_SCRIPT\""
  DID_BUILD=1
elif [[ "$INSTALL_CRON" != "1" ]]; then
  # Local build: build here, then rsync dist/ to the server.
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
  DID_BUILD=1
fi

# Auto-publish cron: run the installed server script on a schedule so a new
# GitHub release reaches /changelog without anyone running deploy.sh by hand.
# The script skips the rebuild when nothing changed, so a frequent tick is cheap.
if [[ "$INSTALL_CRON" == "1" ]]; then
  section "Auto-publish cron"
  CRON_MARK="# niuniu-website-autopublish"
  CRON_LINE="$CRON_SCHEDULE $REMOTE_ENV bash \$HOME/$REMOTE_SCRIPT >> \$HOME/$WEBSITE_REMOTE_DIR/build.log 2>&1 $CRON_MARK"
  echo "  schedule: '$CRON_SCHEDULE' -> \$HOME/$REMOTE_SCRIPT (log: \$HOME/$WEBSITE_REMOTE_DIR/build.log)"
  ssh_run "( crontab -l 2>/dev/null | grep -vF '$CRON_MARK'; echo \"$CRON_LINE\" ) | crontab -"
  echo "  installed crontab entry:"
  ssh_run "crontab -l | grep -F '$CRON_MARK'" | sed 's/^/    /'
fi

if [[ "$DID_BUILD" == "1" ]]; then
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
fi

echo
bold "==> Deploy complete."
echo "    Website:  https://${WEBSITE_DOMAIN}"
exit 0
