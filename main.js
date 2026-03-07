document.addEventListener('DOMContentLoaded', () => {
    // Reveal animation on scroll
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        reveals.forEach(reveal => {
            const revealTop = reveal.getBoundingClientRect().top;
            const revealPoint = 150;

            if (revealTop < windowHeight - revealPoint) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger initial check

    // Smooth scroll for nav links (Internal links only)
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            // Only prevent default and smooth scroll if it's an internal # link
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Simple typing effect for hero
    const textElement = document.getElementById('typing-text');
    const texts = ['Full-Stack Developer', 'Software Engineer'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            textElement.textContent = currentText.substring(0, charIndex--);
            typeSpeed = 50;
        } else {
            textElement.textContent = currentText.substring(0, charIndex++);
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length + 1) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type();

    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            formStatus.style.display = 'block';
            formStatus.style.color = 'var(--text-dim)';
            formStatus.textContent = '⏳ Sending message...';

            const formData = new FormData(contactForm);

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: formData.get('name'),
                        email: formData.get('email'),
                        subject: formData.get('subject'),
                        message: formData.get('message')
                    })
                });

                if (response.ok) {
                    formStatus.style.color = '#4ade80'; // Success green
                    formStatus.textContent = '🚀 Message sent successfully! I\'ll get back to you soon.';
                    contactForm.reset();
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                    }, 5000);
                } else {
                    const data = await response.json();
                    formStatus.style.color = '#f87171'; // Error red
                    if (data.errors) {
                        formStatus.textContent = '❌ ' + data.errors.map(error => error.message).join(', ');
                    } else {
                        formStatus.textContent = '❌ Error: Formspree ID not set or invalid.';
                    }
                }
            } catch (error) {
                console.error('Submission error:', error);
                formStatus.style.color = '#f87171';
                formStatus.textContent = '⚠️ Connection error. Please try again later.';
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});
