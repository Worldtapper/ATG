document.addEventListener("DOMContentLoaded", function() {
    // Check if the preloader exists
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    // Add a class to the body to prevent scrolling while the preloader is active
    document.body.classList.add('preloader-locked');

    // Wait for the animation to finish (roughly 3 seconds for the blueprint animation)
    setTimeout(() => {
        preloader.classList.add('is-exiting');
        document.body.classList.remove('preloader-locked');
        
        // Remove from DOM after exit transition (1.2s transition set in CSS)
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 1200);
    }, 3200);
});
