/*===== HEADER: scrolled state =====*/
const header = document.getElementById('header');

function updateHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

/*===== MOBILE MENU =====*/
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

function setMenu(open) {
    navMenu.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.innerHTML = open ? "<i class='bx bx-x'></i>" : "<i class='bx bx-menu'></i>";
}

navToggle.addEventListener('click', () => setMenu(!navMenu.classList.contains('is-open')));
navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') setMenu(false);
});

/*===== SCROLLSPY =====*/
const navLinks = document.querySelectorAll('.nav__link');
const spyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
        });
    });
}, { rootMargin: '-45% 0px -50% 0px' });

document.querySelectorAll('main section[id]').forEach(section => spyObserver.observe(section));

/*===== REVEAL ON SCROLL =====*/
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
    });
}, { rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/*===== CAROUSELS (scroll-snap + buttons + dots) =====*/
document.querySelectorAll('[data-carousel]').forEach(carousel => {
    const container = carousel.closest('.feature__media, .project__media');
    const track = carousel.querySelector('.carousel__track');
    const slides = track.querySelectorAll('img');
    const dotsWrap = container.querySelector('.carousel__dots');

    const dots = Array.from(slides, (_, i) => {
        const dot = document.createElement('button');
        dot.className = 'carousel__dot';
        dot.setAttribute('aria-label', `Screenshot ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
        return dot;
    });

    const current = () => Math.round(track.scrollLeft / track.clientWidth);

    function goTo(index) {
        const i = (index + slides.length) % slides.length;
        track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
    }

    function updateDots() {
        const i = current();
        dots.forEach((dot, d) => dot.classList.toggle('is-active', d === i));
    }

    container.querySelectorAll('.carousel__btn').forEach(btn => {
        btn.addEventListener('click', () => goTo(current() + Number(btn.dataset.dir)));
    });

    track.addEventListener('scroll', updateDots, { passive: true });
    updateDots();
});

/*===== CLICK-TO-LOAD YOUTUBE =====*/
document.querySelectorAll('.video[data-yt]').forEach(btn => {
    btn.addEventListener('click', () => {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube-nocookie.com/embed/${btn.dataset.yt}?autoplay=1&rel=0`;
        iframe.title = btn.getAttribute('aria-label').replace(/^Play /, '');
        iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;

        const player = document.createElement('div');
        player.className = 'video';
        player.appendChild(iframe);
        btn.replaceWith(player);
    });
});

/*===== FOOTER YEAR =====*/
document.getElementById('year').textContent = new Date().getFullYear();
