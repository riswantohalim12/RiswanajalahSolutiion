document.addEventListener('DOMContentLoaded', () => {

    // Smooth Scrolling untuk anchor links
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"], .footer-links a[href^="#"], .hero-buttons a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 70;
                const offsetTop = targetElement.offsetTop - navbarHeight;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Close mobile menu if open after clicking a link
                if (navToggle && navToggle.classList.contains('active')) { 
                    navToggle.classList.remove('active');
                    mainNav.classList.remove('active'); // Ensure mainNav is defined or query it here
                }
            }
        });
    });

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.nav-links'); // Defined here for use in smooth scroll too

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active'); 
            mainNav.classList.toggle('active'); 
        });
    }

    // Active link highlighting on scroll
    const sections = document.querySelectorAll('main section[id]');
    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 70; 

    function onScroll() {
        let scrollY = window.pageYOffset;
        let activeFound = false;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - navbarHeight - 10; 
            let sectionId = current.getAttribute('id');
            const linkToActivate = document.querySelector('.nav-links a[href="#' + sectionId + '"]');

            if (linkToActivate) { 
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    document.querySelectorAll('.nav-links a.active').forEach(link => link.classList.remove('active'));
                    linkToActivate.classList.add('active');
                    activeFound = true;
                } else {
                    linkToActivate.classList.remove('active'); // Remove if not in range
                }
            }
        });
        
        // Special handling for "Beranda" link if no other section is active (e.g., at the very top)
        const berandaLink = document.querySelector('.nav-links a[href="#beranda"]');
        if (berandaLink) {
            if (!activeFound && scrollY < (sections[0]?.offsetTop - navbarHeight - 10)) {
                 document.querySelectorAll('.nav-links a.active').forEach(link => link.classList.remove('active'));
                 berandaLink.classList.add('active');
            } else if (!activeFound && sections.length > 0 && scrollY >= (sections[sections.length -1].offsetTop + sections[sections.length -1].offsetHeight - window.innerHeight) ) {
                // If at the very bottom and last section is fully scrolled past, keep last section active.
                // This case is usually handled by the loop setting the last one.
                // But if not, explicitly activate the link for the last section
                const lastSectionId = sections[sections.length-1].getAttribute('id');
                const lastLinkToActivate = document.querySelector('.nav-links a[href="#' + lastSectionId + '"]');
                if(lastLinkToActivate) {
                    document.querySelectorAll('.nav-links a.active').forEach(link => link.classList.remove('active'));
                    lastLinkToActivate.classList.add('active');
                }
            }
        }
    }
    window.addEventListener('scroll', onScroll);
    onScroll(); 

    // Product Tabs Filter
    const tabButtons = document.querySelectorAll('.tab-button');
    const productCards = document.querySelectorAll('.product-card');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.getAttribute('data-tab');

            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (filter === 'semua' || cardCategory === filter) {
                    card.style.display = 'flex'; 
                    card.style.animation = 'none'; // Reset animation
                    card.offsetHeight; // Trigger reflow
                    card.style.animation = 'fadeInUp 0.5s ease-out forwards'; 
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    productCards.forEach(card => { // Initial animation for visible cards
        if (card.style.display !== 'none') { 
            card.style.opacity = '0'; 
            card.style.animation = 'fadeInUp 0.5s ease-out 0.2s forwards';
        }
    });


    // Form Submission
    const contactForm = document.getElementById('mainContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const nama = document.getElementById('namaLengkap').value;
            const email = document.getElementById('email').value;
            const pesan = document.getElementById('pesanAnda').value;

            if (nama.trim() === '' || email.trim() === '' || pesan.trim() === '') {
                alert('Harap isi semua field yang wajib diisi.');
                return;
            }
            alert(`Terima kasih, ${nama}! Pesan Anda telah "dikirim". (Ini hanya simulasi frontend)`);
            contactForm.reset();
        });
    }

    // Update Tahun di Footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Typewriter effect for hero title
    const heroTitle = document.querySelector('.hero-section h1');
    if (heroTitle && heroTitle.textContent.length > 0) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = ''; 
        let i = 0;
        function typeWriter() {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 70); 
            }
        }
        setTimeout(typeWriter, 500); 
    }


    // Lazy loading for images
    const lazyImages = document.querySelectorAll('img[data-src]');
    if ("IntersectionObserver" in window) {
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.removeAttribute('data-src');
                    lazyImage.classList.add('loaded'); 
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(img => {
            lazyImageObserver.observe(img);
        });
    } else {
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }

    // Fade-in animation for sections on scroll
    const scrollFadeElements = document.querySelectorAll('section'); 
    if ("IntersectionObserver" in window) {
        const fadeInObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0'; 
                    entry.target.style.animation = `fadeInUp 0.8s ${entry.target.dataset.delay || '0s'} ease-out forwards`;
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 }); 

        scrollFadeElements.forEach((el, index) => {
            // el.dataset.delay = `${index * 0.1}s`; // Stagger delay slightly if needed for multiple elements
            fadeInObserver.observe(el);
        });
    }
});