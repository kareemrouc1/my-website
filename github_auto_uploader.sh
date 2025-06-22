#!/data/data/com.termux/files/usr/bin/bash

WORKDIR="/storage/emulated/0/1"
TOKEN_FILE="$WORKDIR/.git_token"
LOG_FILE="$WORKDIR/git_uploader.log"

log() {
    echo "🔔 [$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "═══════════════════════════════════════"
log "بدء التنفيذ"

if ! command -v git &> /dev/null; then
    log "❌ git غير مثبت"
    termux-notification --title "فشل الرفع" --content "Git غير مثبت" --priority high
    exit 1
fi

if [ ! -f "$TOKEN_FILE" ]; then
    log "❌ ملف التوكين غير موجود"
    termux-notification --title "GitHub AutoUploader" --content "ملف التوكين مفقود" --priority high
    exit 1
fi

TOKEN=$(cat "$TOKEN_FILE")
cd "$WORKDIR" || exit 1
git config --global --add safe.directory "$WORKDIR"

CHANGES=$(git status --porcelain)
if [ -z "$CHANGES" ]; then
    log "📂 لا توجد تغييرات لرفعها"
    termux-notification --title "GitHub AutoUploader" --content "لا توجد تغييرات" --priority low
    exit 0
fi

log "🔄 تغييرات مكتشفة:"
echo "$CHANGES" | tee -a "$LOG_FILE"

git add .
git commit -m "تحديث تلقائي: $(date '+%Y-%m-%d %H:%M:%S')"
log "✔ تم حفظ التغييرات"

REMOTE_URL="github.com/kareemrouc1/my-website.git"
PUSH_OUTPUT=$(git push "https://${TOKEN}@${REMOTE_URL}" 2>&1)

if echo "$PUSH_OUTPUT" | grep -q "fatal\|error"; then
    log "❌ فشل في الرفع"
    echo "$PUSH_OUTPUT" | tee -a "$LOG_FILE"
    termux-notification --title "فشل الرفع" --content "راجع السجل أو التوكين" --priority high
else
    HASH=$(git rev-parse --short HEAD)
    log "✅ تم الرفع بنجاح"
    log "$HASH - تحديث تلقائي"
    termux-notification --title "تم الرفع ✅" --content "كود: $HASH" --priority high
fi

log "🕒 انتهى التنفيذ"
log "═══════════════════════════════════════"
