document.addEventListener('DOMContentLoaded', function() {
    // تأثير التحميل الأولي
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading';
    loadingScreen.innerHTML = '<div class="spinner"></div>';
    document.body.prepend(loadingScreen);
    
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => loadingScreen.remove(), 500);
    }, 1500);

    // التمرير السلس للروابط الداخلية
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // إضافة تأثير للعنصر المستهدف
                targetElement.style.animation = 'highlight 1.5s ease';
                setTimeout(() => targetElement.style.animation = '', 1500);
            }
        });
    });

     // تغيير لون شريط التنقل عند التمرير
const nav = document.querySelector('nav');
window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
        nav.style.backgroundColor = 'rgba(45, 52, 54, 0.85)'; // زيادة الشفافية هنا (0.85 بدلاً من 0.97)
        nav.style.backdropFilter = 'blur(5px)';
        nav.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.2)';
    } else {
        nav.style.backgroundColor = '#2d3436';
        nav.style.backdropFilter = 'none';
        nav.style.boxShadow = 'none';
    }
    
    // إظهار/إخفاء زر العودة للأعلى
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('active');
    } else {
        scrollTopBtn.classList.remove('active');
    }
});
    // زر العودة للأعلى
    const scrollTopBtn = document.createElement('div');
    scrollTopBtn.className = 'scroll-top';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollTopBtn);
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // عرض رسائل Toast
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // تفعيل وظائف الصفحة الداخلية إذا كانت موجودة
    if (document.querySelector('.article-container')) {
        initArticlePage();
    }

    // ضبط التخطيط عند التحميل وعند تغيير الحجم
    window.addEventListener('load', adjustLayout);
    window.addEventListener('resize', adjustLayout);

    // تسجيل Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js');
    }
});

// وظائف خاصة بالصفحة الداخلية للمقال
function initArticlePage() {
    // تأثيرات الظهور التدريجي للصور والمحتوى
    const articleContent = document.querySelector('.article-content');
    const images = document.querySelectorAll('.article-body img');
    const paragraphs = document.querySelectorAll('.article-body p, .article-body h2, .article-body h3');
    
    // إعداد العناصر للظهور التدريجي
    [articleContent, ...images, ...paragraphs].forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
    });
    
    // ظهور التدريجي عند التمرير
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    [articleContent, ...images, ...paragraphs].forEach(el => observer.observe(el));

    // مشاركة المقال على وسائل التواصل
    const shareButtons = document.querySelectorAll('.share-buttons a');
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.classList.contains('fa-facebook') ? 'Facebook' : 
                           this.classList.contains('fa-twitter') ? 'Twitter' :
                           this.classList.contains('fa-whatsapp') ? 'WhatsApp' : 'Telegram';
            
            showToast(`سيتم مشاركة المقال على ${platform}`, 'info');
        });
    });

    // الاشتراك في النشرة البريدية
    const newsletterForm = document.querySelector('.newsletter form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input');
            const email = emailInput.value.trim();
            
            if (!validateEmail(email)) {
                showToast('الرجاء إدخال بريد إلكتروني صحيح', 'error');
                emailInput.focus();
                return;
            }
            
            const submitBtn = this.querySelector('button');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> تم الاشتراك!';
                showToast(`شكراً على اشتراكك! سيصلك جديدنا على ${email}`, 'success');
                emailInput.value = '';
                
                setTimeout(() => {
                    submitBtn.innerHTML = 'اشتراك';
                    submitBtn.disabled = false;
                }, 2000);
            }, 1500);
        });
    }

    // وظيفة التحقق من صحة البريد الإلكتروني
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}

// ضبط التخطيط العام للصفحة
function adjustLayout() {
    // ضبط حجم الصور
    const images = document.querySelectorAll('.featured-image img');
    images.forEach(img => {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
    });
    
    // تحسين وضوح النص
    const cards = document.querySelectorAll('.question-card');
    cards.forEach(card => {
        const content = card.querySelector('.question-content');
        if (content) {
            content.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        }
    });
}

// إضافة أنماط CSS ديناميكية للرسائل والتأثيرات
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes highlight {
        0% { background-color: rgba(110, 142, 251, 0.1); }
        100% { background-color: transparent; }
    }
    
    .toast {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background-color: #2d3436;
        color: white;
        padding: 12px 25px;
        border-radius: 30px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        transition: all 0.3s ease;
    }
    
    .toast.show {
        transform: translateX(-50%) translateY(0);
    }
    
    .toast.success {
        background-color: #00b894;
    }
    
    .toast.error {
        background-color: #d63031;
    }
    
    .toast.info {
        background-color: #0984e3;
    }
`;
document.head.appendChild(dynamicStyles);