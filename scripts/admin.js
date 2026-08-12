// ========== ЗАГРУЗКА ЗАЯВОК ==========
var region = localStorage.getItem('selectedRegion') || 'Сокол';
document.getElementById('adminTitle').textContent = 'Заявки — ' + region;

var issues = JSON.parse(localStorage.getItem('issues') || '[]');

// Показываем только необработанные
var activeIssues = issues.filter(function(issue) {
    return issue.status !== 'Обработана';
});

var grid = document.getElementById('issuesGrid');

if (activeIssues.length === 0) {
    grid.innerHTML = '<div class="empty-state">Пока нет заявок. Позже они появятся здесь</div>';
} else {
    activeIssues.reverse().forEach(function(issue) {
        var card = document.createElement('div');
        card.className = 'issue-card';

        card.innerHTML = `
            ${issue.image ? '<img src="' + issue.image + '" class="issue-image" alt="Фото">' : ''}
            <div class="issue-topic">${issue.topic}</div>
            <div class="issue-desc">${issue.description || 'Без описания'}</div>
            <div class="issue-meta">
                <span>${issue.date}</span>
                ${issue.coordinates ? '<span>📍 ' + issue.coordinates.x + ', ' + issue.coordinates.y + '</span>' : ''}
                <span class="issue-status status-new">${issue.status}</span>
            </div>
            <div class="issue-actions">
                <button class="btn-done">Заявка обработана</button>
            </div>
        `;

        var doneBtn = card.querySelector('.btn-done');

        doneBtn.onclick = function() {
            var allIssues = JSON.parse(localStorage.getItem('issues') || '[]');
            var found = allIssues.find(function(i) { return i.id === issue.id; });
            if (found) {
                found.status = 'Обработана';
                localStorage.setItem('issues', JSON.stringify(allIssues));
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                card.style.transition = 'opacity 0.3s, transform 0.3s';
                setTimeout(function() {
                    card.remove();
                    if (grid.children.length === 0) {
                        grid.innerHTML = '<div class="empty-state">Все заявки обработаны!</div>';
                    }
                }, 300);
            }
        };

        grid.appendChild(card);

        // ОТКРЫТИЕ ФОТО В МОДАЛКЕ
        var issueImage = card.querySelector('.issue-image');
        if (issueImage) {
            issueImage.style.cursor = 'pointer';
            issueImage.onclick = function() {
                var modal = document.getElementById('imageModal');
                var modalImg = document.getElementById('modalImage');
                
                modal.style.display = 'flex';
                modalImg.src = issue.image;
                
                // Сбрасываем зум при открытии новой картинки
                scale = 1;
                modalImg.style.transform = 'scale(1)';
                modalImg.style.cursor = 'zoom-in';
            };
        }
    });
}

// ========== МОДАЛКА ФОТО (ЗУМ И ЗАКРЫТИЕ) ==========
var imageModal = document.getElementById('imageModal');
var modalImage = document.getElementById('modalImage');
var modalCloseBtn = document.getElementById('modalImageClose');
var scale = 1;

// 1. ФУНКЦИЯ ЗАКРЫТИЯ (чтобы не дублировать код)
function closeImageModal() {
    imageModal.style.display = 'none';
    scale = 1;
    modalImage.style.transform = 'scale(1)';
    modalImage.style.cursor = 'zoom-in';
}

// 2. КНОПКА ЗАКРЫТИЯ (КРЕСТИК)
if (modalCloseBtn) {
    modalCloseBtn.onclick = function(e) {
        e.stopPropagation(); // Не даем клику уйти на фон
        closeImageModal();
    };
}

// 3. ЗАКРЫТИЕ ПО КЛИКУ НА ЗАТЕМНЕНИЕ
imageModal.onclick = function(e) {
    if (e.target === imageModal) {
        closeImageModal();
    }
};

// 4. ЗАКРЫТИЕ ПО КЛАВИШЕ ESC
document.onkeydown = function(e) {
    if (e.key === 'Escape' && imageModal.style.display === 'flex') {
        closeImageModal();
    }
};

// 5. ЗУМ КОЛЕСИКОМ МЫШИ
modalImage.onwheel = function(e) {
    e.preventDefault();
    if (e.deltaY < 0) {
        scale = Math.min(scale + 0.2, 4);
    } else {
        scale = Math.max(scale - 0.2, 1);
    }
    modalImage.style.transform = 'scale(' + scale + ')';
    modalImage.style.cursor = scale > 1 ? 'zoom-out' : 'zoom-in';
};

// 6. КЛИК ПО САМОМУ ФОТО (УВЕЛИЧИТЬ ИЛИ СБРОСИТЬ)
modalImage.onclick = function(e) {
    e.stopPropagation();
    if (scale > 1) {
        // Если уже увеличено - сбрасываем
        scale = 1;
        modalImage.style.transform = 'scale(1)';
        modalImage.style.cursor = 'zoom-in';
    } else {
        // Если не увеличено - увеличиваем в 2 раза
        scale = 2;
        modalImage.style.transform = 'scale(2)';
        modalImage.style.cursor = 'zoom-out';
    }
};
