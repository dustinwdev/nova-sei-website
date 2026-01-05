(function() {
    'use strict';

    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const button = item.querySelector('.faq-question');
        if (!button) return;

        button.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all other items
            faqItems.forEach(other => {
                if (other !== item) {
                    other.classList.remove('open');
                    other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current item
            item.classList.toggle('open', !isOpen);
            button.setAttribute('aria-expanded', !isOpen);
        });
    });
})();
