#!/usr/bin/env bash
# server-build.sh -- build the niuniu website ON the production server and
# atomic-swap it into the live dist/. Single source of truth, used by both:
#   - deploy.sh --remote-build   (installs this file to a stable path, then runs it)
#   - the auto-publish cron job   (runs the installed copy on a schedule)
#
# Why this exists: /changelog is generated at BUILD time (Astro fetches the
# GitHub Releases API once per build and bakes it into static HTML). The site is
# static with no runtime fetch, so a new release only shows up after a rebuild.
# This script is the rebuild -- run it from cron and the changelog auto-updates.
#
# It rebuilds only when something actually changed -- the latest GitHub release
# tag (drives /changelog) or the git ref HEAD -- unless FORCE=1. That keeps a
# frequent cron cheap while still picking up new releases automatically.
#
# Env (all optional; defaults baked for niu6ai.com):
#   REMOTE_REF           branch/tag to build              default main
#   WEBSITE_REMOTE_DIR   base dir under $HOME             default apps/niuniu-website
#   REMOTE_REPO_DIR      repo checkout dir under $HOME    default $WEBSITE_REMOTE_DIR/repo
#   REPO_URL             git remote                       default https://github.com/threeq/niuniu-public.git
#   RELEASES_API         GitHub releases API (signature)  default .../releases/latest
#   FORCE                rebuild even if unchanged        default 0
set -euo pipefail

REMOTE_REF="${REMOTE_REF:-main}"
WEBSITE_REMOTE_DIR="${WEBSITE_REMOTE_DIR:-apps/niuniu-website}"
REMOTE_REPO_DIR="${REMOTE_REPO_DIR:-$WEBSITE_REMOTE_DIR/repo}"
REPO_URL="${REPO_URL:-https://github.com/threeq/niuniu-public.git}"
RELEASES_API="${RELEASES_API:-https://api.github.com/repos/threeq/niuniu-public/releases/latest}"
FORCE="${FORCE:-0}"

BASE="$HOME/$WEBSITE_REMOTE_DIR"
REPO="$HOME/$REMOTE_REPO_DIR"
LIVE="$BASE/dist"
SIG_FILE="$BASE/.last-build.sig"
LOCK="$BASE/.build.lock"
mkdir -p "$BASE"

log() { printf '%s %s\n' "$(date '+%F %T')" "$*"; }

# Serialize: a slow build must not overlap the next cron tick.
exec 9>"$LOCK"
if ! flock -n 9; then log "another build is running; skip."; exit 0; fi

export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1090
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" || { log "!! nvm not found on server"; exit 1; }
corepack enable pnpm >/dev/null 2>&1 || true

# Build signature: newest release tag (drives /changelog) + git ref sha. When
# both are unchanged since the last successful build there is nothing to do.
tag="$(curl -fsS -m 20 -H 'Accept: application/vnd.github+json' "$RELEASES_API" 2>/dev/null \
        | grep -m1 '"tag_name"' | sed -E 's/.*"tag_name":[[:space:]]*"([^"]+)".*/\1/' || true)"
# Pin the exact ref: a bare pattern tail-matches every */REMOTE_REF branch.
sha="$(git ls-remote "$REPO_URL" "refs/heads/$REMOTE_REF" "refs/tags/$REMOTE_REF" 2>/dev/null | awk 'NR==1{print $1}')"
sig="ref=$REMOTE_REF tag=${tag:-?} sha=${sha:-?}"

if [ "$FORCE" != "1" ] && [ -d "$LIVE" ] && [ -f "$SIG_FILE" ] && [ "$(cat "$SIG_FILE")" = "$sig" ]; then
  log "no change ($sig); nothing to publish."
  exit 0
fi
log "building: $sig (force=$FORCE)"

if [ ! -d "$REPO/.git" ]; then
  log "cloning $REPO_URL ..."
  git clone --depth 1 --branch "$REMOTE_REF" "$REPO_URL" "$REPO"
else
  git -C "$REPO" fetch --depth 1 origin "$REMOTE_REF"
  git -C "$REPO" reset --hard FETCH_HEAD
fi
log "HEAD: $(git -C "$REPO" log --oneline -1)"

cd "$REPO/website"
log "pnpm install ..."; pnpm install --frozen-lockfile
log "pnpm build ...";   pnpm build

# Build into the repo's dist first; only swap into LIVE after sanity checks pass,
# so a broken build never takes the live site down.
for f in dist/index.html dist/en/index.html dist/changelog/index.html dist/pagefind/pagefind.js dist/sitemap-index.xml; do
  [ -f "$f" ] || { log "!! website/$f missing -- abort, live dist untouched."; exit 1; }
done
mkdir -p "$LIVE"
rsync -a --delete "$REPO/website/dist/" "$LIVE/"
printf '%s\n' "$sig" > "$SIG_FILE"
log "published OK -> $LIVE"
