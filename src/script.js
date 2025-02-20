function openModal(icon) {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalAuthor = document.getElementById('modal-author');
    const downloadLink = document.getElementById('download-link');

    modalImage.src = icon.path;
    modalTitle.textContent = icon.name;
    modalAuthor.textContent = icon.author;
    modalAuthor.href = icon["author-website"];
    downloadLink.href = icon.path;

    // Show modal
    modal.style.display = 'block';
    // Force reflow
    modal.offsetHeight;
    // Add active class for animation
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('modal');
    // Remove active class
    modal.classList.remove('active');
    // Hide after animation completes
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
});
