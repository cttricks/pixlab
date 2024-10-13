let selectedFiles = {};
let resizedImages = {};

// Populate selected images and show formatting-form

function showSelectedImage() {

    selectedImageContainer.find('div.image-preview').remove();
    if (Object.keys(selectedFiles).length < 1) {
        document.getElementById('formatting-form').style.display = 'none';
        document.getElementById('formatted-images').style.display = 'none';
        document.getElementById('imageDropArea').style.display = 'flex';
        return;
    }

    document.getElementById('imageDropArea').style.display = 'none';
    document.getElementById('formatted-images').style.display = 'none';
    document.getElementById('formatting-form').style.display = 'block';

    Object.entries(selectedFiles).forEach(([key, value]) => {
        const template = $('#selected-images')[0].content.cloneNode(true);
        $(template).find('i').prop('id', key);
        $(template).find('img').prop('src', value.src);
        $(template).find('h4').html(value.name);
        $(template).find('h5').html(`${value.width} x ${value.width} px`);
        $(template).find('p').html(value.size);
        $('#formatting-form div.border-dashed').append(template);
    })
}

// Format file size
async function formatFileSize(size) {
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
                resolve({ width: img.naturalWidth, height: img.naturalHeight, src: img.src });
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

function showImageImportErrorLogs(log = []) {

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
        selectedFiles[fileId] = await getImageDimensions(files[i]);
        selectedFiles[fileId]['name'] = files[i].name;
        selectedFiles[fileId]['size'] = await formatFileSize(files[i].size);

    }

    if (log.length > 0) showImageImportErrorLogs(log);
    showSelectedImage();

}

const imageDropArea = $('#imageDropArea');
const imageDropAreaPS = $('#formatting-form div.border-dashed');
const selectedImageContainer = $('#formatting-form div.border-dashed');

// Handel image removal from selected images container
selectedImageContainer.on('click', (e) => {
    if (e.target.tagName !== 'I') return;

    delete selectedFiles[e.target.id];
    showSelectedImage();

});

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

imageDropAreaPS.on('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

imageDropAreaPS.on('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

imageDropAreaPS.on('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.originalEvent.dataTransfer.files;
    handleImageDrop(files);
});

$('#choose-images').on('change', (e) => {
    handleImageDrop(e.target.files);
});

$('label.btn-solid-error').on('click', (e) => {
    selectedFiles = {};
    showSelectedImage();
    document.querySelector('#formatting-form form').reset();
});

$('#imageDropArea div.z-10').on('click', () => {
    $('#choose-images').click();
})

function applyBgColorChange(value){
    value = (value === '#ffffff') ? '#000000' : value;
    document.querySelector('div[data-color] label').style.color = value;
}

const canvasBg = $('#bg-color-picker');
canvasBg.on('change', (e) => {
    applyBgColorChange(e.target.value);
});

$('div[data-color]').on('click' , (e) => {
    let target = e.target;
    
    if(target.tagName === 'LABEL') target = e.target.parentElement;
    if(target.tagName === 'INPUT') return;

    $('div[data-color]').removeClass('border-purple-600');
    $(target).addClass('border-purple-600');
    $(canvasBg).val($(target).attr('data-color'));
    applyBgColorChange($(canvasBg).val());
});

$('#lockWidthAndHeight').on('click', (e) => {
    if ($(e.target).hasClass('ri-lock-fill')){
        $(e.target).toggleClass('ri-lock-fill');
        $(e.target).addClass('ri-lock-unlock-fill');
        return;
    }
    
    $(e.target).toggleClass('ri-lock-unlock-fill');
    $(e.target).addClass('ri-lock-fill');

    // Once the H&W are locked set height = width
    $('input[name=height]').val($('input[name=width]').val());
});

$('input[name=width]').on('keyup', (e) => {
    if (!$('#lockWidthAndHeight').hasClass('ri-lock-fill')) return;
    $('input[name=height]').val(e.target.value);
});

$('input[name=height]').on('keyup', (e) => {
    if (!$('#lockWidthAndHeight').hasClass('ri-lock-fill')) return;
    $('input[name=width]').val(e.target.value);
});

$('#formatting-form form').on('submit', (e) => {
    e.preventDefault();
    let form = new FormData(e.target);
    let payload = Object.fromEntries(form);

    if(payload.width.length < 1 || parseInt(payload.width) < 1){
        toast.error(`Width must be greater then 0`);
        return;   
    }

    if(payload.height.length < 1 || parseInt(payload.height) < 1){
        toast.error(`Height must be greater then 0`);
        return;
    }

    resizedImages = {};
    resizeImage(payload);
});

async function resizeImage(changes){
    
    // Setup Canvas
    const pica = window.pica();
    const outputCanvas = document.createElement('canvas');

    // Apply setting
    outputCanvas.width = parseInt(changes.width);
    outputCanvas.height = parseInt(changes.height);

    // Run a loop for all file changes
    Object.entries(selectedFiles).forEach( async ([key, value]) => {
        
        const image = new Image();
        image.src = value.src;
        image.onload = async function() {

            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0);

            const finalImage = await pica.resize(canvas, outputCanvas, {
                quality: 3,
                alpha: true
            }).then(result => {
                
                if (changes.format !== 'png') {
                    return pica.toBlob(result, 'image/jpeg', (parseInt(changes.quality)/100))
                }

                return pica.toBlob(result, 'image/png')
                
            });

            let imageId = crypto.randomUUID()
            resizedImages[imageId] = await getImageDimensions(finalImage);
            resizedImages[imageId]['blob'] = finalImage;
            resizedImages[imageId]['name'] = `PixLab-${value.name.split('.')[0]}.${changes.format}`;
            resizedImages[imageId]['size'] = await formatFileSize(finalImage.size);

            // Render resized images container
            showAllResizedImage();

        };
    });

}

function showAllResizedImage(){

    $('#formatted-images').find('div.image-preview').remove();
    document.getElementById('formatted-images').style.display = 'block';

    Object.entries(resizedImages).forEach(([key, value]) => {
        const template = $('#resizedImageTemplate')[0].content.cloneNode(true);
        $(template).find('button').prop('id', key);
        $(template).find('img').prop('src', value.src);
        $(template).find('h4').html(value.name);
        $(template).find('h5').html(`${value.width} x ${value.width} px`);
        $(template).find('p').html(value.size);
        $('#formatted-images div.border-double').append(template);
    })
}

$('#formatted-images').on('click', async (e) => {

    e.preventDefault();
    if (e.target.tagName !== 'BUTTON') return;

    // Handel individual image download
    if (e.target.id !== 'download-all') {
        let image = resizedImages[e.target.id];
        saveAs(image.blob, image.name);
        return;
    }

    // Handle download all - Case only one file
    if(Object.keys(resizedImages).length < 2){
        let image = resizedImages[Object.keys(resizedImages)[0]];
        saveAs(image.blob, image.name);
        return;
    }

    // Handle download all as zip for multiple files
    const zip = new JSZip();

    // Loop through each fileData object and add it to the ZIP
    Object.entries(resizedImages).forEach(async ([key, value]) => {
        zip.file(value.name, value.blob);
    });

    // Generate the ZIP file
    zip.generateAsync({ type: 'blob' }).then(function(content) {
        saveAs(content, 'PixLab.zip');
    });

});