// ========== ДАННЫЕ РЕГИОНОВ ==========
const regions = [
    { id: 1, name: 'Москва' },
    { id: 2, name: 'Санкт-Петербург' },
    { id: 3, name: 'Казань' },
    { id: 4, name: 'Новосибирск' },
    { id: 5, name: 'Екатеринбург' },
    { id: 6, name: 'Нижний Новгород' },
    { id: 7, name: 'Сочи' },
    { id: 8, name: 'Краснодар' },
    { id: 9, name: 'Красноярск' },
    { id: 10, name: 'Владивосток' },
    { id: 11, name: 'Ростов-на-Дону' },
    { id: 12, name: 'Уфа' },
    { id: 13, name: 'Пермь' },
    { id: 14, name: 'Воронеж' },
    { id: 15, name: 'Волгоград' },
    { id: 16, name: 'Омск' },
    { id: 17, name: 'Челябинск' },
    { id: 18, name: 'Кемерово' },
    { id: 19, name: 'Архангельск' },
    { id: 20, name: 'Калининград' },
    { id: 21, name: 'Сокол' }
];

// ========== DOM ==========
const modal = document.getElementById('cityModal');
const regionsList = document.getElementById('regionsList');
const regionSearch = document.getElementById('regionSearch');
const selectedRegionDisplay = document.getElementById('selectedRegionDisplay');
const modalSubmit = document.getElementById('modalSubmit');
const modalClose = document.getElementById('modalClose');
const heroCityBtn = document.getElementById('heroCityBtn');
const floatingCityBtn = document.getElementById('floatingCityBtn');
const floatingHeader = document.getElementById('floatingHeader');
const hero = document.getElementById('hero');
const heroLogo = document.getElementById('heroLogo');
const fhBurger = document.getElementById('fhBurger');
const glassMenu = document.getElementById('glassMenu');
const scrollTopBtn = document.getElementById('scrollTopBtn');

let selectedRegion = null;

// ========== МОДАЛЬ ==========
function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    regionSearch.value = '';
    renderRegions(regions);
    selectedRegion = null;
    modalSubmit.disabled = true;
    selectedRegionDisplay.textContent = 'Выберите регион из списка';
    regionSearch.focus();
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function renderRegions(filteredRegions) {
    regionsList.innerHTML = '';
    if (filteredRegions.length === 0) {
        regionsList.innerHTML = '<div style="padding:20px;text-align:center;color:#999;">Ничего не найдено</div>';
        return;
    }
    filteredRegions.forEach(function (region) {
        const btn = document.createElement('button');
        btn.className = 'region-item';
        if (selectedRegion && selectedRegion.id === region.id) btn.classList.add('selected');
        btn.innerHTML = '<span class="region-name">' + region.name + '</span><span class="region-check">✓</span>';
        btn.addEventListener('click', function () { selectRegion(region); });
        regionsList.appendChild(btn);
    });
}

function selectRegion(region) {
    selectedRegion = region;
    selectedRegionDisplay.innerHTML = 'Выбран: <strong>' + region.name + '</strong>';
    modalSubmit.disabled = false;
    document.querySelectorAll('.region-item').forEach(function (item) { item.classList.remove('selected'); });
    var items = document.querySelectorAll('.region-item');
    var index = -1;
    for (var i = 0; i < regions.length; i++) {
        if (regions[i].id === region.id) { index = i; break; }
    }
    if (index >= 0 && items[index]) items[index].classList.add('selected');
}

regionSearch.addEventListener('input', function () {
    var query = this.value.toLowerCase().trim();
    if (query === '') { renderRegions(regions); return; }
    renderRegions(regions.filter(function (r) { return r.name.toLowerCase().indexOf(query) !== -1; }));
});

modalSubmit.addEventListener('click', function () {
    if (!selectedRegion) return;
    if (selectedRegion.name === 'Сокол') {
        localStorage.setItem('selectedRegion', 'Сокол');
        window.location.href = 'sokol.html';
    } else {
        alert('Данное расположение временно не поддерживается');
        selectedRegion = null;
        modalSubmit.disabled = true;
        selectedRegionDisplay.textContent = 'Выберите регион из списка';
        document.querySelectorAll('.region-item').forEach(function (item) { item.classList.remove('selected'); });
    }
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

heroCityBtn.addEventListener('click', openModal);
floatingCityBtn.addEventListener('click', openModal);

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

    var aboutSection = document.getElementById('about');
    if (aboutSection && scrollTopBtn) {
        if (aboutSection.getBoundingClientRect().top < window.innerHeight) {
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
        var target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});