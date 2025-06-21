document.addEventListener('DOMContentLoaded', () => {

    // --- All custom cursor logic has been removed from here ---

    // --- INTERACTIVE CONSTELLATION BACKGROUND ---
    const canvas = document.getElementById('constellation-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const mouse = { x: null, y: null, radius: 150 };

    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (event) => { mouse.x = event.x; mouse.y = event.y; });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY;
            this.size = size; this.color = color;
        }
        draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false); ctx.fillStyle = this.color; ctx.fill(); }
        update() { if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX; if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY; this.x += this.directionX; this.y += this.directionY; this.draw(); }
    }

    function initConstellation() {
        particles = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = Math.random() + 1;
            let x = Math.random() * (innerWidth - size * 2) + size;
            let y = Math.random() * (innerHeight - size * 2) + size;
            let directionX = (Math.random() - 0.5) * 0.2;
            let directionY = (Math.random() - 0.5) * 0.2;
            particles.push(new Particle(x, y, directionX, directionY, size, 'rgba(255,255,255,0.1)'));
        }
    }

    function connect() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let distance = Math.sqrt(((particles[a].x - particles[b].x) ** 2) + ((particles[a].y - particles[b].y) ** 2));
                if (distance < 90) { ctx.strokeStyle = `rgba(255,255,255,${0.2 - distance / 900})`; ctx.lineWidth = 0.3; ctx.beginPath(); ctx.moveTo(particles[a].x, particles[a].y); ctx.lineTo(particles[b].x, particles[b].y); ctx.stroke(); }
            }
            let mouseDistance = Math.sqrt(((particles[a].x - mouse.x) ** 2) + ((particles[a].y - mouse.y) ** 2));
            if (mouseDistance < mouse.radius) {
                const accentRGB = getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb');
                ctx.strokeStyle = `rgba(${accentRGB}, ${1 - mouseDistance / mouse.radius})`;
                ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(particles[a].x, particles[a].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
            }
        }
    }
    
    function animateConstellation() { requestAnimationFrame(animateConstellation); ctx.clearRect(0, 0, innerWidth, innerHeight); for (let i = 0; i < particles.length; i++) { particles[i].update(); } connect(); }
    initConstellation();
    animateConstellation();

    // --- POLYPHONIC AUDIO SETUP ---
    function playSound(src, volume = 0.5) { const sound = new Audio(src); sound.volume = volume; sound.play(); }
    document.querySelectorAll('a, .skill-card, .project-card').forEach(elem => {
        elem.addEventListener('mouseenter', () => playSound('assets/sounds/hover.mp3', 0.3));
        elem.addEventListener('click', () => playSound('assets/sounds/select.mp3', 0.5));
    });

    // --- GSAP ANIMATIONS ---
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(".hero-title span", { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.2, ease: "power2.out" });
    document.querySelectorAll('.section-title').forEach(title => {
        gsap.fromTo(title.querySelectorAll('span'), 
            { opacity: 0, y: 20, filter: 'blur(5px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: { amount: 0.3, from: "random" },
                scrollTrigger: { trigger: title, start: "top 85%", toggleActions: "play none none none" }
            }
        );
    });
    gsap.utils.toArray('.skill-card, .project-card, #about p, .contact-subtitle, .btn-large').forEach(elem => {
        gsap.from(elem, {
            opacity: 0, y: 40, duration: 0.8, ease: "power2.out",
            scrollTrigger: { trigger: elem, start: "top 90%", toggleActions: "play none none none" }
        });
    });
});