// ========== DOM ==========
const floatingHeader = document.getElementById('floatingHeader');
const hero = document.getElementById('hero');
const heroLogo = document.getElementById('heroLogo');
const fhBurger = document.getElementById('fhBurger');
const glassMenu = document.getElementById('glassMenu');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const footerAdminLink = document.getElementById('footerAdminLink');
const adminModal = document.getElementById('adminModal');
const adminModalClose = document.getElementById('adminModalClose');
const adminSubmit = document.getElementById('adminSubmit');

// ========== КНОПКА НАВЕРХ ==========
scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========== ХЕДЕР + ЛОГО + КНОПКА НАВЕРХ ==========
window.addEventListener('scroll', function () {
    var heroHeight = hero.offsetHeight;
    var scrollPos = window.scrollY;

    if (scrollPos >= heroHeight) {
        floatingHeader.classList.add('visible');
    } else {
        floatingHeader.classList.remove('visible');
    }

    if (heroLogo) {
        if (scrollPos > heroHeight * 0.3) {
            heroLogo.classList.add('fade-out');
        } else {
            heroLogo.classList.remove('fade-out');
        }
    }

    var mapSection = document.getElementById('map');
    if (mapSection && scrollTopBtn) {
        if (mapSection.getBoundingClientRect().top < window.innerHeight) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }
});

// ========== БУРГЕР ==========
fhBurger.addEventListener('mouseenter', function () { glassMenu.classList.add('open'); });
glassMenu.addEventListener('mouseenter', function () { glassMenu.classList.add('open'); });
glassMenu.addEventListener('mouseleave', function () { glassMenu.classList.remove('open'); });

glassMenu.querySelectorAll('.glass-menu-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        glassMenu.classList.remove('open');
        var href = this.getAttribute('href');
        if (href === 'index.html') {
            window.location.href = 'index.html';
        } else {
            var target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ========== МОДАЛКА АДМИНА ==========
footerAdminLink.addEventListener('click', function (e) {
    e.preventDefault();
    adminModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

adminModalClose.addEventListener('click', function () {
    adminModal.classList.remove('active');
    document.body.style.overflow = '';
});

adminModal.addEventListener('click', function (e) {
    if (e.target === adminModal) {
        adminModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

adminSubmit.addEventListener('click', function () {
    var login = document.getElementById('adminLogin').value.trim();
    var password = document.getElementById('adminPassword').value.trim();
    var errorEl = document.getElementById('adminError');
    
    if (!login || !password) {
        errorEl.textContent = 'Введите логин и пароль';
        errorEl.style.display = 'block';
        return;
    }
    
    if (login === 'admin' && password === 'admin') {
        errorEl.style.display = 'none';
        window.location.href = 'admin.html';
    } else {
        errorEl.textContent = 'Неверный логин или пароль';
        errorEl.style.display = 'block';
    }
});