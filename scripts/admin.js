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
        var statusEl = card.querySelector('.issue-status');

        doneBtn.addEventListener('click', function() {
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
        });

        grid.appendChild(card);

        // Открытие фото в модалке
var issueImage = card.querySelector('.issue-image');
if (issueImage) {
    issueImage.style.cursor = 'pointer';
    issueImage.addEventListener('click', function() {
        var modal = document.getElementById('imageModal');
        var modalImg = document.getElementById('modalImage');
        modal.style.display = 'flex';
        modalImg.src = issue.image;
        modalImg.classList.remove('zoomed');
    });
}
    });
}

// ========== МОДАЛКА ФОТО ==========
var imageModal = document.getElementById('imageModal');
var modalImage = document.getElementById('modalImage');
var scale = 1;

modalImage.addEventListener('wheel', function(e) {
    e.preventDefault();
    if (e.deltaY < 0) {
        scale = Math.min(scale + 0.2, 4);
    } else {
        scale = Math.max(scale - 0.2, 1);
    }
    modalImage.style.transform = 'scale(' + scale + ')';
    if (scale > 1) {
        modalImage.classList.add('zoomed');
        modalImage.style.cursor = 'zoom-out';
    } else {
        modalImage.classList.remove('zoomed');
        modalImage.style.cursor = 'zoom-in';
    }
});

imageModal.addEventListener('click', function(e) {
    if (e.target === imageModal) {
        imageModal.style.display = 'none';
        scale = 1;
        modalImage.style.transform = 'scale(1)';
        modalImage.classList.remove('zoomed');
    }
});

modalImage.addEventListener('click', function(e) {
    e.stopPropagation();
    if (scale > 1) {
        scale = 1;
        modalImage.style.transform = 'scale(1)';
        modalImage.classList.remove('zoomed');
        modalImage.style.cursor = 'zoom-in';
    } else {
        scale = 2;
        modalImage.style.transform = 'scale(2)';
        modalImage.classList.add('zoomed');
        modalImage.style.cursor = 'zoom-out';
    }
});
