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
            nav.style.backgroundColor = 'rgba(45, 52, 54, 0.97)';
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

    // وظيفة البحث
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });
    
    function performSearch() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm.length < 2) {
            showToast('الرجاء إدخال كلمة بحث مكونة من حرفين على الأقل', 'error');
            return;
        }
        
        // عرض حالة التحميل
        searchButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        searchButton.disabled = true;
        
        // محاكاة طلب البحث (في التطبيق الحقيقي سيتم استبدالها بطلب AJAX)
        setTimeout(() => {
            searchButton.innerHTML = '<i class="fas fa-search"></i>';
            searchButton.disabled = false;
            
            if (searchTerm.toLowerCase().includes('خطأ')) {
                showToast('حدث خطأ أثناء البحث، يرجى المحاولة لاحقاً', 'error');
            } else {
                showToast(`تم العثور على 5 نتائج لـ "${searchTerm}"`, 'success');
                // window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
            }
        }, 1500);
    }

    // تحميل المزيد من الأسئلة عند التمرير للأسفل
    let isLoading = false;
    window.addEventListener('scroll', function() {
        if (isLoading) return;
        
        const scrollPosition = window.innerHeight + window.scrollY;
        const pageHeight = document.body.offsetHeight - 300;
        
        if (scrollPosition >= pageHeight) {
            loadMoreQuestions();
        }
    });

    function loadMoreQuestions() {
        isLoading = true;
        const loader = document.createElement('div');
        loader.className = 'questions-loader';
        loader.innerHTML = `
            <div class="loading-content">
                <i class="fas fa-spinner fa-spin"></i>
                <span>جاري تحميل المزيد من الأسئلة...</span>
            </div>
        `;
        document.querySelector('.questions-grid').after(loader);
        
        // محاكاة طلب AJAX (في التطبيق الحقيقي سيتم استبدالها بطلب فعلي)
        setTimeout(() => {
            const newQuestions = [
                {
                    title: 'كيف تتخلص من التوتر قبل الامتحانات؟',
                    desc: 'نصائح علمية لتقليل القلق وتحسين الأداء في الامتحانات',
                    img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                    category: 'تعليم'
                },
                {
                    title: 'ما هي أفضل التطبيقات لإدارة الوقت؟',
                    desc: 'قائمة بأفضل أدوات تنظيم الوقت لزيادة الإنتاجية',
                    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                    category: 'تكنولوجيا'
                }
            ];
            
            newQuestions.forEach(question => {
                const questionCard = document.createElement('div');
                questionCard.className = 'question-card';
                questionCard.innerHTML = `
                    <img src="${question.img}" alt="${question.category}">
                    <div class="question-content">
                        <h3>${question.title}</h3>
                        <p>${question.desc}</p>
                        <a href="article.html" class="read-more">اقرأ المزيد</a>
                    </div>
                `;
                document.querySelector('.questions-grid').appendChild(questionCard);
            });
            
            loader.remove();
            isLoading = false;
            showToast('تم تحميل المزيد من الأسئلة بنجاح', 'success');
            
            // إضافة تأثير للأسئلة الجديدة
            const newCards = document.querySelectorAll('.question-card');
            newCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.transition = 'all 0.5s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 200);
            });
        }, 2000);
    }

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
            
            // محاكاة المشاركة (في التطبيق الحقيقي سيتم استخدام واجهات برمجة التطبيقات الخاصة بكل منصة)
            showToast(`سيتم مشاركة المقال على ${platform}`, 'info');
            
            // مثال لمشاركة حقيقية على فيسبوك:
            // if (platform === 'Facebook') {
            //     window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
            // }
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
            
            // محاكاة إرسال البيانات (في التطبيق الحقيقي سيتم استبدالها بطلب AJAX)
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

    // إضافة أزرار التنسيق للمحتوى (للوحة التحكم إذا وجدت)
    if (document.querySelector('.editor-toolbar')) {
        initEditor();
    }
}

// وظيفة محرر النصوص (للوحة التحكم)
function initEditor() {
    const buttons = document.querySelectorAll('.editor-toolbar button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const command = this.getAttribute('data-command');
            
            if (command === 'h1' || command === 'h2' || command === 'h3') {
                document.execCommand('formatBlock', false, command);
            } else if (command === 'image') {
                const url = prompt('أدخل رابط الصورة:');
                if (url) document.execCommand('insertImage', false, url);
            } else {
                document.execCommand(command, false, null);
            }
            
            this.classList.toggle('active');
            setTimeout(() => this.classList.toggle('active'), 200);
        });
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
    
    .questions-loader {
        text-align: center;
        padding: 20px;
        color: #636e72;
    }
    
    .questions-loader .loading-content {
        display: inline-flex;
        align-items: center;
        gap: 10px;
    }
    
    .questions-loader i {
        font-size: 1.2rem;
    }
`;
document.head.appendChild(dynamicStyles);
// أضف هذا في نهاية الملف الأصلي
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

// استدعاء الدالة عند التحميل وعند تغيير حجم النافذة
window.addEventListener('load', adjustLayout);
window.addEventListener('resize', adjustLayout);
// أضف في ملف JavaScript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}