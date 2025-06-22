#!/bin/bash

# ==============================================
#  GitHub Auto-Uploader Pro v2.0
# ==============================================
# مميزات الكود:
# 1. تحديث تلقائي آمن باستخدام Token
# 2. تسجيل كامل للعمليات في ملف log
# 3. دعم كامل لـ crontab
# 4. معالجة ذكية للأخطاء
# 5. تأمين الملفات الحساسة
# 6. دعم اللغة العربية
# ==============================================

# 🔧 الإعدادات الأساسية
TOKEN_FILE="/storage/emulated/0/1/.git_token"
PROJECT_DIR="/storage/emulated/0/1"
REPO_URL="https://github.com/kareemrouc1/my-website.git"
LOG_FILE="/storage/emulated/0/1/git_uploader.log"

# 📁 إنشاء ملف السجل إذا لم يكن موجوداً
[ ! -f "$LOG_FILE" ] && touch "$LOG_FILE"

# ⏰ تسجيل وقت البدء
echo -e "\n🔔 [$(date +'%Y-%m-%d %H:%M:%S')] بدء التنفيذ" >> "$LOG_FILE"

# 🔒 التحقق من Token
if [ ! -f "$TOKEN_FILE" ]; then
    echo -e "❌ خطأ: ملف التوكين غير موجود\nالرجاء تشغيل الإصدار الأولي لإنشاء التوكين" >> "$LOG_FILE"
    exit 1
fi

# 📂 الانتقال للمسار
cd "$PROJECT_DIR" || {
    echo "❌ فشل في الوصول إلى $PROJECT_DIR" >> "$LOG_FILE"
    exit 1
}

# 🔄 معالجة Git
GIT_TOKEN=$(cat "$TOKEN_FILE")
CHANGES=$(git status --porcelain)

if [ -n "$CHANGES" ]; then
    echo "🔄 يوجد تغييرات جديدة:" >> "$LOG_FILE"
    echo "$CHANGES" >> "$LOG_FILE"
    
    # ✅ إضافة الملفات
    git add . >> "$LOG_FILE" 2>&1
    
    # 💾 حفظ التغييرات
    if git commit -m "تحديث تلقائي: $(date +'%Y-%m-%d %H:%M:%S')" >> "$LOG_FILE" 2>&1; then
        echo "✔ تم حفظ التغييرات" >> "$LOG_FILE"
        
        # 🚀 رفع التغييرات
        if git push "https://$GIT_TOKEN@$REPO_URL" master >> "$LOG_FILE" 2>&1; then
            echo -e "✅ تم الرفع بنجاح\n$(git log -1 --pretty='%h - %s (%cr)')" >> "$LOG_FILE"
        else
            echo "❌ فشل في الرفع إلى GitHub" >> "$LOG_FILE"
            echo "🔍 الأسباب المحتملة:" >> "$LOG_FILE"
            echo "1. Token منتهي الصلاحية" >> "$LOG_FILE"
            echo "2. مشكلة في الاتصال بالإنترنت" >> "$LOG_FILE"
            exit 1
        fi
    else
        echo "❌ فشل في حفظ التغييرات" >> "$LOG_FILE"
        exit 1
    fi
else
    echo "✔ لا يوجد تغييرات جديدة" >> "$LOG_FILE"
    
    # 🔄 مزامنة أي تغييرات من الخادم
    git fetch origin >> "$LOG_FILE" 2>&1
fi

# 🎉 إنهاء العملية
echo -e "🕒 [$(date +'%Y-%m-%d %H:%M:%S')] انتهى التنفيذ بنجاح\n══════════════════════════════════════" >> "$LOG_FILE"
