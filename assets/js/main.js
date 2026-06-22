/*===== DYNAMIC SECTION LOADER =====*/
async function loadSection(containerId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const html = await response.text();
        document.getElementById(containerId).innerHTML = html;
    } catch (e) {
        console.error(`Error loading section ${filePath}:`, e);
    }
}

async function initSite() {
    // Load all HTML components in parallel
    await Promise.all([
        loadSection('header-container', 'sections/header.html'),
        loadSection('home-container', 'sections/home.html'),
        loadSection('about-container', 'sections/about.html'),
        loadSection('skills-container', 'sections/skills.html'),
        loadSection('games-container', 'sections/games.html'),
        loadSection('experience-container', 'sections/experience.html'),
        loadSection('education-container', 'sections/education.html'),
        loadSection('contact-container', 'sections/contact.html'),
        loadSection('footer-container', 'sections/footer.html')
    ]);

    // All elements are successfully injected into the DOM. Bind events:

    /*===== MENU TOGGLE LOGIC =====*/
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show-menu');
        });
    }

    // Close menu when navigation links are clicked (Mobile view)
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) {
                navMenu.classList.remove('show-menu');
            }
        });
    });

    /*===== SCROLLSPY ACTIVE NAVIGATION LINK HIGHLIGHT =====*/
    const sections = document.querySelectorAll('section[id]');
    
    function scrollActive() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 58;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav__menu a[href*=${sectionId}]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active-link');
                } else {
                    navLink.classList.remove('active-link');
                }
            }
        });
    }
    window.addEventListener('scroll', scrollActive);
    scrollActive(); // Execute once to set initial active nav link

    /*===== SCROLL REVEAL ANIMATIONS =====*/
    if (typeof ScrollReveal !== 'undefined') {
        const sr = ScrollReveal({
            origin: 'top',
            distance: '60px',
            duration: 1200,
            delay: 100,
            reset: false
        });

        sr.reveal('.home__data', { delay: 100 });
        sr.reveal('.home__social', { delay: 200, origin: 'bottom' });
        
        sr.reveal('.about__img', { delay: 100, origin: 'left' });
        sr.reveal('.about__subtitle', { delay: 100, origin: 'right' });
        sr.reveal('.about__text', { delay: 200, origin: 'right' });

        sr.reveal('.skills__box', { interval: 80 });

        sr.reveal('.projects__subtitle', { delay: 100 });
        sr.reveal('.games__item', { interval: 80 });

        sr.reveal('.experience__item', { interval: 100, origin: 'left' });
        sr.reveal('.education__item', { interval: 100, origin: 'right' });
        
        sr.reveal('.contact__details-box', { delay: 100, scale: 0.95 });
    }
}

// Start fetching and binding after main DOM has finished parsing
document.addEventListener("DOMContentLoaded", initSite);

/*===== CAROUSEL SLIDE NAVIGATION (GLOBALLY EXPOSED) =====*/
function changeSlide(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
    const slides = carousel.querySelectorAll('.carousel__slide');
    let activeIndex = 0;

    slides.forEach((slide, i) => {
        if (slide.classList.contains('carousel__slide--active')) {
            activeIndex = i;
        }
    });

    slides[activeIndex].classList.remove('carousel__slide--active');

    let newIndex = activeIndex + direction;
    if (newIndex < 0) newIndex = slides.length - 1;
    if (newIndex >= slides.length) newIndex = 0;

    slides[newIndex].classList.add('carousel__slide--active');
}
