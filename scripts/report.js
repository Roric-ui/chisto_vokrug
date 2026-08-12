// === Глобальные переменные ===
let attachedFile = null;
let attachedFileDataURL = null;
let successTimeout = null;
let markers = [];
let markerIdCounter = 0;
let isImageLoaded = false;

// === Константы диапазонов ===
const RANGE_X_MIN = 54.525914;
const RANGE_X_MAX = 54.527187;
const RANGE_Y_MIN = 36.165240;
const RANGE_Y_MAX = 36.169950;

// === DOM ===
const topicInput = document.getElementById('topicInput');
const textarea = document.getElementById('textInput');
const fileInput = document.getElementById('fileInput');
const fileDropZone = document.getElementById('fileDropZone');
const filePreview = document.getElementById('filePreview');
const previewImage = document.getElementById('previewImage');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const removeFileBtn = document.getElementById('removeFileBtn');
const readBtn = document.getElementById('readBtn');
const statusText = document.getElementById('statusText');
const successMessage = document.getElementById('successMessage');
const successSub = document.getElementById('successSub');
const imageWrapper = document.getElementById('imageWrapper');
const markersContainer = document.getElementById('markersContainer');
const mainImage = document.getElementById('mainImage');
const clearMarkersBtn = document.querySelector('.btn-clear');

// === Конвертация ===
function convertToRangeX(percent) {
    return RANGE_X_MIN + (percent / 100) * (RANGE_X_MAX - RANGE_X_MIN);
}

function convertToRangeY(percent) {
    return RANGE_Y_MIN + (percent / 100) * (RANGE_Y_MAX - RANGE_Y_MIN);
}

// === Метки (ограничение — 1) ===
function addMarker(x, y) {
    if (markers.length >= 1) {
        markers = [];
        markerIdCounter = 0;
    }
    const id = ++markerIdCounter;
    markers.push({ id, x, y, xConverted: convertToRangeX(x), yConverted: convertToRangeY(y) });
    renderMarkers();
}

function removeMarker(id) {
    markers = markers.filter(m => m.id !== id);
    renderMarkers();
    if (markers.length === 0) markerIdCounter = 0;
}

function clearMarkers() {
    markers = [];
    renderMarkers();
    markerIdCounter = 0;
}

function renderMarkers() {
    markersContainer.innerHTML = '';
    markers.forEach(marker => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.left = marker.x + '%';
        el.style.top = marker.y + '%';
        const removeBtn = document.createElement('span');
        removeBtn.className = 'marker-remove';
        removeBtn.textContent = '✕';
        removeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            removeMarker(marker.id);
        });
        el.appendChild(removeBtn);
        el.addEventListener('click', function(e) {
            e.stopPropagation();
            if (!e.target.closest('.marker-remove')) removeMarker(marker.id);
        });
        markersContainer.appendChild(el);
    });
}

imageWrapper.addEventListener('click', function(e) {
    if (e.target.closest('.marker')) return;
    if (!isImageLoaded) return;
    const rect = this.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));
    addMarker(x, y);
});

clearMarkersBtn.addEventListener('click', clearMarkers);

// === Файлы ===
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

function sanitizeFilename(name) {
    return name.replace(/[<>:"/\\|?*]/g, '_').trim() || 'file';
}

function generateBaseName() {
    return sanitizeFilename(topicInput.value.trim() || 'заявка');
}

function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) {
        alert('Выберите изображение');
        resetFilePreview();
        return;
    }
    attachedFile = file;
    const reader = new FileReader();
    reader.onload = function(e) {
        attachedFileDataURL = e.target.result;
        previewImage.src = attachedFileDataURL;
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        filePreview.classList.remove('hidden');
        statusText.textContent = 'Файл готов: ' + file.name;
        statusText.className = 'status-text';
        fileDropZone.classList.remove('error');
    };
    reader.readAsDataURL(file);
}

function resetFilePreview() {
    attachedFile = null;
    attachedFileDataURL = null;
    filePreview.classList.add('hidden');
    previewImage.src = '#';
    fileName.textContent = '';
    fileSize.textContent = '';
    fileInput.value = '';
    statusText.textContent = '';
    statusText.className = 'status-text';
    fileDropZone.classList.remove('error');
}

function showSuccessMessageWithTimeout(text) {
    if (successTimeout) clearTimeout(successTimeout);
    successMessage.classList.add('show');
    successSub.textContent = text;
    successTimeout = setTimeout(() => successMessage.classList.remove('show'), 3000);
}

// === Отправка (без скачивания файлов) ===
async function readText() {
    const text = textarea.value.trim();

    textarea.classList.remove('error');
    topicInput.classList.remove('error');
    fileDropZone.classList.remove('error');
    statusText.className = 'status-text';
    if (successTimeout) { clearTimeout(successTimeout); successTimeout = null; }
    successMessage.classList.remove('show');

    if (!attachedFile) {
        statusText.textContent = 'Прикрепите изображение';
        statusText.className = 'status-text error';
        fileDropZone.classList.add('error');
        fileDropZone.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    if (!topicInput.value.trim()) {
        statusText.textContent = 'Введите тему заявки';
        statusText.className = 'status-text error';
        topicInput.classList.add('error');
        topicInput.focus();
        return;
    }
    if (markers.length === 0) {
        statusText.textContent = 'Поставьте метку на карте';
        statusText.className = 'status-text error';
        imageWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    readBtn.disabled = true;
    readBtn.textContent = 'Отправка...';
    statusText.textContent = 'Отправка заявки...';
    statusText.className = 'status-text';

    try {
        // Сохраняем заявку в localStorage
        var issues = JSON.parse(localStorage.getItem('issues') || '[]');
        issues.push({
            id: Date.now(),
            topic: topicInput.value.trim(),
            description: textarea.value.trim(),
            image: attachedFileDataURL,
            coordinates: markers.length > 0 ? {
                x: markers[0].xConverted.toFixed(6),
                y: markers[0].yConverted.toFixed(6)
            } : null,
            date: new Date().toLocaleString('ru-RU'),
            status: 'Новая'
        });
        localStorage.setItem('issues', JSON.stringify(issues));

        showSuccessMessageWithTimeout('Тема: ' + topicInput.value.trim() + ' | Заявка сохранена');
        statusText.textContent = 'Заявка отправлена!';
        statusText.className = 'status-text success';
        textarea.value = '';
        topicInput.value = '';
        resetFilePreview();
        clearMarkers();
        markerIdCounter = 0;
    } catch (error) {
        alert('Ошибка: ' + error.message);
        statusText.textContent = 'Ошибка';
        statusText.className = 'status-text error';
    }
    readBtn.disabled = false;
    readBtn.textContent = 'Отправить';
}

// === События ===
readBtn.addEventListener('click', readText);
fileInput.addEventListener('change', function() { handleFile(this.files[0] || null); });
fileDropZone.addEventListener('dragover', e => { e.preventDefault(); fileDropZone.classList.add('dragover'); });
fileDropZone.addEventListener('dragleave', () => fileDropZone.classList.remove('dragover'));
fileDropZone.addEventListener('drop', function(e) {
    e.preventDefault();
    fileDropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
        const dt = new DataTransfer();
        dt.items.add(e.dataTransfer.files[0]);
        fileInput.files = dt.files;
        handleFile(e.dataTransfer.files[0]);
    }
});
removeFileBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    resetFilePreview();
    statusText.textContent = 'Файл удалён';
    statusText.className = 'status-text error';
});
textarea.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) readText();
});
textarea.addEventListener('input', function() { if (this.value.trim()) this.classList.remove('error'); });
topicInput.addEventListener('input', function() { if (this.value.trim()) this.classList.remove('error'); });

function initImage() {
    if (mainImage.complete) isImageLoaded = true;
    else mainImage.onload = () => { isImageLoaded = true; };
}
initImage();
