let selectedFiles = {};

// Format file size
function formatFileSize(size) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0;
    while (size >= 1024 && i < units.length - 1) {
        size /= 1024;
        i++;
    }
    return size.toFixed(2) + ' ' + units[i];
}

// Check if the file size is less than 10 MB
function isFileSizeValid(size) {
    const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB in bytes
    return size < maxSizeInBytes;
}

// Check if the file type is an image and only PNG, JPG, or JPEG
function isImageFile(type) {
    return ['image/png', 'image/jpeg', 'image/jpg'].includes(type);
}

// Get image dimensions
function getImageDimensions(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = function (event) {
            img.src = event.target.result; // Set image source to file data URL
            img.onload = function () {
                resolve({ width: img.naturalWidth, height: img.naturalHeight });
            };
            img.onerror = function () {
                reject('Error loading image');
            };
        };

        reader.onerror = function () {
            reject('Error reading file');
        };

        reader.readAsDataURL(file); // Read the file as a data URL
    });
}

function showImageImportErrorLogs(log = []){

    $('div.images-error-logs').html('');

    log.forEach(item => {
        item = item.split(' | ');
        let elm = document.createElement('div');
        elm.classList.value = 'bg-rose-50 p-4 rounded-md mt-2';
        elm.innerHTML = `<div class="text-rose-600 text-sm">${item[0]}</div><div class="text-gray-800 mt-1">${item[1]}</div>`;
        $('div.images-error-logs').append(elm);
    });

    $('#image-import-log').prop('checked', true);
}

const handleImageDrop = async (files) => {

    // Check if no file was dropped of selected
    if (files.length < 0) return;

    // List all image files
    selectedFiles = {};
    let log = [];
    for (let i = 0; i < files.length; i++) {
        
        if (!isImageFile(files[i].type)) {
            log.push(`${files[i].name} | Unsupported FileType ${files[i].type}, Only png/jpg/jpeg allowed`);
            continue;
        }
        if (!isFileSizeValid(files[i].size)) {
            log.push(`${files[i].name} | Unsupported FileSize ${files[i].size}, it must be less ten 10MB`);
            continue;
        }

        let fileId = crypto.randomUUID();
        selectedFiles[fileId] = {
            name: files[i].name,
            file: files[i],
            size: formatFileSize(files[i].size),
            dimensions: await getImageDimensions(files[i])
        };

    }

    if (log.length > 0) showImageImportErrorLogs(log);
    console.log(selectedFiles);

}

const imageDropArea = $('#imageDropArea');

imageDropArea.on('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

imageDropArea.on('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

imageDropArea.on('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.originalEvent.dataTransfer.files;
    handleImageDrop(files);
});

$('#choose-images').on('change', (e) => {
    handleImageDrop(e.target.files);
});

console.log('resizer');