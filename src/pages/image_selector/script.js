document.addEventListener('DOMContentLoaded', () => {
    const imageItems = document.querySelectorAll('.image-item');
    const selectionCount = document.getElementById('selection-count');
    const submitButton = document.querySelector('.submit-button');
    
    let selectedImages = new Set();
    
    imageItems.forEach(item => {
        item.addEventListener('click', () => {
            const imageId = item.dataset.imageId;
            
            if (selectedImages.has(imageId)) {
                selectedImages.delete(imageId);
                item.classList.remove('selected');
            } else {
                selectedImages.add(imageId);
                item.classList.add('selected');
            }
            
            updateUI();
        });
    });
    
    function updateUI() {
        selectionCount.textContent = selectedImages.size;
        submitButton.disabled = selectedImages.size === 0;
    }
    
    submitButton.addEventListener('click', () => {
        if (selectedImages.size > 0) {
            const selectedArray = Array.from(selectedImages);
            console.log('選択された画像ID:', selectedArray);
            alert(`${selectedArray.length}個の画像が選択されました。\n選択ID: ${selectedArray.join(', ')}`);
        }
    });
});