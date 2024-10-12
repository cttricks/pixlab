const handleImageDrop = (files) => {

    // Check if no file was dropped of selected
    if (files.length < 0) return;

    console.log('images dropped', files);
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