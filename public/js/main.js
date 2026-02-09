// ==================== COUNTDOWN TIMER ====================
function updateCountdown() {
    const weddingDate = new Date('2026-02-12T12:30:00').getTime();
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');

    if (distance < 0) {
        document.getElementById('countdown').innerHTML = '<h3>Свадьба началась! 🎉</h3>';
    }
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown();

// ==================== MAP TOGGLE ====================
function toggleMap(mapId) {
    const mapContainer = document.getElementById(mapId);
    const button = event.target.closest('.map-toggle-btn');
    
    if (mapContainer.style.display === 'none' || mapContainer.style.display === '') {
        mapContainer.style.display = 'block';
        button.querySelector('.btn-text').textContent = 'Скрыть карту';
    } else {
        mapContainer.style.display = 'none';
        button.querySelector('.btn-text').textContent = 'Как добраться';
    }
}

// ==================== RSVP FORM HANDLING ====================
document.getElementById('rsvpForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        attendance: document.querySelector('input[name="attendance"]:checked').value,
        drinks: document.getElementById('drinks').value,
        food: document.getElementById('food').value
    };

    const submitBtn = this.querySelector('.submit-btn');
    const messageDiv = document.getElementById('formMessage');
    
    // Disable button during submission
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    try {
        const response = await fetch('/submit-rsvp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            messageDiv.textContent = result.message;
            messageDiv.className = 'form-message success';
            messageDiv.style.display = 'block';
            
            // Reset form
            this.reset();
            
            // Hide message after 5 seconds
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        messageDiv.textContent = 'Произошла ошибка. Пожалуйста, попробуйте позже.';
        messageDiv.className = 'form-message error';
        messageDiv.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Отправить</span><div class="btn-shine"></div>';
    }
});

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== SCROLL ANIMATIONS (AOS) ====================
// Simple AOS-like scroll animation observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, observerOptions);

// Observe all elements with data-aos attribute
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(el => observer.observe(el));
});

// ==================== PARALLAX EFFECT ON SCROLL ====================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroOverlay = document.querySelector('.hero-overlay');
    
    if (heroOverlay) {
        heroOverlay.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ==================== PHOTO HOVER EFFECT ====================
document.querySelectorAll('.photo-wrapper').forEach(photo => {
    photo.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    
    photo.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

// ==================== CALENDAR ANIMATION ====================
document.addEventListener('DOMContentLoaded', () => {
    const calendarDays = document.querySelectorAll('.calendar-days .day:not(.empty)');
    
    calendarDays.forEach((day, index) => {
        setTimeout(() => {
            day.style.opacity = '0';
            day.style.transform = 'scale(0.8)';
            day.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                day.style.opacity = '1';
                day.style.transform = 'scale(1)';
            }, 50);
        }, index * 30);
    });
});

// ==================== FORM VALIDATION ====================
const form = document.getElementById('rsvpForm');
const inputs = form.querySelectorAll('input, textarea');

inputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value) {
            this.style.borderColor = '#dc3545';
        } else {
            this.style.borderColor = '';
        }
    });
    
    input.addEventListener('input', function() {
        if (this.value) {
            this.style.borderColor = '';
        }
    });
});

// ==================== PRELOAD IMAGES ====================
window.addEventListener('load', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.complete) {
            img.style.opacity = '0';
            img.addEventListener('load', function() {
                this.style.transition = 'opacity 0.5s ease';
                this.style.opacity = '1';
            });
        }
    });
});

// ==================== RESPONSIVE MENU (if needed) ====================
const mediaQuery = window.matchMedia('(max-width: 768px)');

function handleResponsive(e) {
    if (e.matches) {
        // Mobile view adjustments
        console.log('Mobile view activated');
    } else {
        // Desktop view
        console.log('Desktop view activated');
    }
}

mediaQuery.addListener(handleResponsive);
handleResponsive(mediaQuery);

// ==================== PREVENT FORM DOUBLE SUBMISSION ====================
let isSubmitting = false;

document.getElementById('rsvpForm').addEventListener('submit', function(e) {
    if (isSubmitting) {
        e.preventDefault();
        return false;
    }
    isSubmitting = true;
    
    setTimeout(() => {
        isSubmitting = false;
    }, 3000);
});

// ==================== EASTER EGG - CONFETTI ON WEDDING DATE CLICK ====================
const weddingDayElement = document.querySelector('.wedding-day');
if (weddingDayElement) {
    weddingDayElement.addEventListener('click', function() {
        createConfetti();
    });
}

function createConfetti() {
    const colors = ['#C8A882', '#E8DCC4', '#8B7355', '#4A4A4A'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.opacity = '1';
        confetti.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
        confetti.style.transition = 'all 3s ease-out';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.style.top = '100vh';
            confetti.style.opacity = '0';
            confetti.style.transform = 'rotate(' + (Math.random() * 720) + 'deg)';
        }, 50);
        
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

// ==================== LOADING ANIMATION ====================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

console.log('🎉 Wedding Invitation Loaded Successfully! 💍');

// ==================== ТАЙМЕР ОБРАТНОГО ОТСЧЕТА ====================
function updateCountdown() {
    const weddingDate = new Date('2026-02-12T12:30:00').getTime();
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
        document.getElementById('countdown').innerHTML = "<h3>Этот счастливый день настал!</h3>";
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

setInterval(updateCountdown, 1000);
updateCountdown();

// ==================== КАРТЫ ====================
function toggleMap(id) {
    const map = document.getElementById(id);
    map.style.display = (map.style.display === "none" || map.style.display === "") ? "block" : "none";
}

// ==================== RSVP ОБРАБОТКА (БЭКЕНД ЛОГИКА) ====================
const rsvpForm = document.getElementById('rsvpForm');
if (rsvpForm) {
    rsvpForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.submit-btn');
        const messageDiv = document.getElementById('formMessage');
        
        // Сбор данных (соответствует вашему fetch-запросу)
        const formData = {
            name: document.getElementById('name').value,
            attendance: document.querySelector('input[name="attendance"]:checked').value,
            drinks: document.getElementById('drinks').value,
            food: document.getElementById('food').value
        };

        submitBtn.disabled = true;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerText = 'Отправка...';

        try {
            const response = await fetch('/submit-rsvp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                messageDiv.textContent = result.message || 'Спасибо! Ваша анкета отправлена.';
                messageDiv.className = 'form-message success';
                this.reset();
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            messageDiv.textContent = 'Ошибка отправки. Попробуйте позже.';
            messageDiv.className = 'form-message error';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            setTimeout(() => { messageDiv.style.display = 'none'; }, 5000);
        }
    });
}


document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));