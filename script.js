// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Supabase Configuration
const SUPABASE_URL = 'https://yeluzuphrbptxhlgpugx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllbHV6dXBocmJwdHhobGdwdWd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MzkyMjQsImV4cCI6MjA4NzQxNTIyNH0.QByaeSt41Z-xiiQOkQ327O5Mh36vJVtun0IO9T9WkHo';
const INVITATION_ID = 'bambang-leni';
let _supabase;

try {
    _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} catch (e) {
    console.error("Supabase failed to initialize:", e);
}

// URL Parameter Parsing
const urlParams = new URLSearchParams(window.location.search);
const guestName = urlParams.get('to') || 'Nama Tamu';
const guestDisplay = document.getElementById('guest-name-display');
if (guestDisplay) guestDisplay.innerText = guestName;

// Loader & Cover Logic
window.addEventListener('load', () => {
    const tl = gsap.timeline();

    tl.to('.loader-line', {
        width: '100%',
        duration: 0.5,
        ease: 'power2.inOut'
    })
        .to('.loader-wrapper', {
            y: '-100%',
            duration: 1,
            ease: 'expo.inOut',
            delay: 0.2
        })
        .from('.anime-cover', {
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
        });
});

// Open Invitation Interaction
const openBtn = document.getElementById('open-invitation');
const cover = document.getElementById('cover');

if (openBtn) {
    openBtn.addEventListener('click', () => {
        // Play Music
        if (!isPlaying) {
            audio.play().catch(e => console.log("Audio play failed:", e));
            musicIcon.classList.replace('fa-play', 'fa-pause');
            musicBtn.classList.add('playing');
            isPlaying = true;
        }

        // Animate Cover Out
        gsap.to(cover, {
            y: '-100%',
            duration: 1.5,
            ease: 'expo.inOut',
            onComplete: () => {
                cover.style.display = 'none';
                initAnimations(); // Start main content animations here
            }
        });

        // Enable scroll (if disabled)
        document.body.style.overflow = 'auto';
    });
}

// Disable scroll initially
document.body.style.overflow = 'hidden';

function initAnimations() {
    // Hero Entrance
    const heroTl = gsap.timeline();

    heroTl.from('.anime-init', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power4.out',
        clearProps: "all"
    })
        .from('.parallax-layer', {
            scale: 1.5,
            opacity: 0,
            duration: 2,
            ease: 'expo.out'
        }, '-=1');

    // Parallax.js Initialization (Wagerfield Logic)
    const stage = document.getElementById('parallax-stage');
    if (stage) {
        new Parallax(stage, {
            relativeInput: true,
            hoverOnly: true,
            pointerEvents: true,
            frictionX: 0.1,
            frictionY: 0.1
        });
    }

    // Scroll-based parallax for stage container
    gsap.to('#parallax-stage', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: 150
    });

    // Marquee / Scroll Text
    gsap.to('#marquee', {
        scrollTrigger: {
            trigger: '.section-couple',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        },
        x: -500
    });

    // Reveal Up Animations
    const reveals = document.querySelectorAll('.reveal-up');
    reveals.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
            },
            y: 80,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out'
        });
    });

    // Story Parallax Background
    gsap.to('#story-parallax-bg', {
        scrollTrigger: {
            trigger: '.parallax-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        },
        y: '20%'
    });

    // Scattered Gallery Parallax
    const scatterItems = document.querySelectorAll('.p-item');
    scatterItems.forEach(item => {
        const speed = item.getAttribute('data-speed');
        gsap.to(item, {
            scrollTrigger: {
                trigger: '.section-gallery',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            },
            y: -200 * speed,
            ease: 'none'
        });
    });

    loadWishes();
}

// Music Control
const musicBtn = document.getElementById('music-btn');
const audio = document.getElementById('bg-audio');
const musicIcon = musicBtn.querySelector('i');
let isPlaying = false;

musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        musicIcon.classList.replace('fa-pause', 'fa-play');
        musicBtn.classList.remove('playing');
    } else {
        audio.play().catch(e => console.log("Audio play failed:", e));
        musicIcon.classList.replace('fa-play', 'fa-pause');
        musicBtn.classList.add('playing');
    }
    isPlaying = !isPlaying;
});

// Copy to Clipboard
function copyValue(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = btn.innerText;
        btn.innerText = 'Tersalin!';
        btn.style.background = 'var(--accent-gold)';
        btn.style.color = '#fff';

        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = 'transparent';
            btn.style.color = 'var(--accent-gold)';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// Form Submission
document.getElementById('rsvp-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    const name = document.getElementById('guest-name-input').value;
    const presence = document.getElementById('guest-rsvp-input').value;
    const msg = document.getElementById('guest-message-input').value;

    const fullMessage = `[${presence}] ${msg}`;

    if (_supabase) {
        btn.disabled = true;
        btn.innerText = 'Sending...';

        const { error } = await _supabase
            .from('guest_wishes')
            .insert([{
                name: name,
                message: fullMessage,
                invitation_id: INVITATION_ID
            }]);

        if (error) {
            alert("Error sending message: " + error.message);
            btn.disabled = false;
            btn.innerText = 'Send Message';
        } else {
            appendWish(name, fullMessage, true);
            this.reset();
            btn.innerText = 'Thank You!';
            setTimeout(() => {
                btn.disabled = false;
                btn.innerText = 'Send Message';
            }, 3000);
        }
    }
});

// Supabase Wishes Logic
async function loadWishes() {
    if (!_supabase) return;

    const { data, error } = await _supabase
        .from('guest_wishes')
        .select('*')
        .eq('invitation_id', INVITATION_ID)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error loading wishes:", error);
        return;
    }

    const container = document.getElementById('wishes-list');
    if (container) {
        container.innerHTML = '';
        if (data) {
            data.forEach(wish => appendWish(wish.name, wish.message));
        }
    }
}

function appendWish(name, message, prepend = false) {
    const container = document.getElementById('wishes-list');
    if (!container) return;

    const item = document.createElement('div');
    item.className = 'wish-item-simple';
    item.style.marginBottom = '20px';
    item.style.padding = '20px';
    item.style.borderBottom = '1px solid rgba(140, 112, 79, 0.2)';
    item.innerHTML = `
        <h4 style="font-family: var(--font-serif); color: var(--accent-gold); margin-bottom: 5px;">${name}</h4>
        <p style="font-size: 0.95rem; opacity: 0.8;">${message}</p>
    `;

    if (prepend) {
        container.prepend(item);
        gsap.from(item, { opacity: 0, x: -20, duration: 0.6 });
    } else {
        container.appendChild(item);
    }
}

// Countdown Timer Logic
function updateCountdown() {
    const weddingDate = new Date('October 22, 2026 09:00:00').getTime();
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
        clearInterval(countdownInterval);
        document.querySelector('.hero-countdown').innerHTML = "HARI BAHAGIA TELAH TIBA";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = days.toString().padStart(2, '0');
    document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
    document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
}

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();
