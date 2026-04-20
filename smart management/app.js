document.addEventListener('DOMContentLoaded', () => {
    // Heatmap Simulation
    const heroMap = document.getElementById('heroMapAnim');
    const numDots = 40;

    for (let i = 0; i < numDots; i++) {
        createDot(heroMap);
    }

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 15, 24, 0.95)';
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
        } else {
            navbar.style.background = 'rgba(10, 15, 24, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Sector Interactivity
    const sectors = document.querySelectorAll('.sector');
    sectors.forEach(sector => {
        sector.addEventListener('mouseover', () => {
            sectors.forEach(s => s.classList.remove('active'));
            sector.classList.add('active');
        });
    });

    // Hero Actions
    const heroArBtn = document.querySelector('.hero-actions .btn-glow');
    const heroMapBtn = document.querySelector('.hero-actions .btn-secondary');
    if(heroArBtn) heroArBtn.addEventListener('click', () => document.getElementById('ar-nav').scrollIntoView({behavior: 'smooth'}));
    if(heroMapBtn) heroMapBtn.addEventListener('click', () => document.getElementById('heatmap').scrollIntoView({behavior: 'smooth'}));

    // Smooth Scrolling for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    // Voice Toggle
    const voiceToggleBtn = document.getElementById('voiceToggleBtn');
    if (voiceToggleBtn) {
        let voiceEnabled = false;
        voiceToggleBtn.addEventListener('click', () => {
            voiceEnabled = !voiceEnabled;
            voiceToggleBtn.textContent = voiceEnabled ? 'Enabled' : 'Disabled';
            if(voiceEnabled) {
                voiceToggleBtn.classList.remove('btn-secondary');
                voiceToggleBtn.classList.add('btn-primary');
            } else {
                voiceToggleBtn.classList.add('btn-secondary');
                voiceToggleBtn.classList.remove('btn-primary');
            }
        });
    }

    // Photo Booth
    const photoBoothBtn = document.getElementById('photoBoothBtn');
    if (photoBoothBtn) {
        let pbActive = false;
        const idleState = document.getElementById('photoBoothIdle');
        const activeState = document.getElementById('photoBoothActive');
        photoBoothBtn.addEventListener('click', () => {
            pbActive = !pbActive;
            if(pbActive) {
                idleState.style.display = 'none';
                activeState.style.display = 'block';
            } else {
                idleState.style.display = 'block';
                activeState.style.display = 'none';
            }
        });
    }
    // Incident Simulation
    const incidentBtn = document.getElementById('incidentBtn');
    let incidentActive = false;
    if (incidentBtn) {
        incidentBtn.addEventListener('click', () => {
            incidentActive = !incidentActive;
            incidentBtn.textContent = incidentActive ? 'Clear Incident' : 'Simulate Incident';
            incidentBtn.classList.toggle('btn-primary', incidentActive);
            incidentBtn.classList.toggle('btn-secondary', !incidentActive);
            incidentBtn.style.borderColor = incidentActive ? 'var(--danger)' : '';
            if (incidentActive) {
                const map = document.getElementById('heroMapAnim');
                const pulse = document.createElement('div');
                pulse.className = 'incident-pulse';
                pulse.id = 'incidentPulse';
                map.appendChild(pulse);
            } else {
                const pulse = document.getElementById('incidentPulse');
                if (pulse) pulse.remove();
            }
        });
    }

    // Trivia Game
    const playTriviaBtn = document.getElementById('playTriviaBtn');
    const triviaGameBox = document.getElementById('triviaGameBox');
    const triviaResultBox = document.getElementById('triviaResultBox');
    const queuePosVal = document.getElementById('queuePosVal');
    const queueWaitVal = document.getElementById('queueWaitVal');
    let currentPos = 24;

    if (playTriviaBtn) {
        playTriviaBtn.addEventListener('click', () => {
            playTriviaBtn.style.display = 'none';
            triviaGameBox.style.display = 'block';
        });

        document.querySelectorAll('.trivia-ans').forEach(btn => {
            btn.addEventListener('click', (e) => {
                triviaGameBox.style.display = 'none';
                triviaResultBox.style.display = 'flex';
                if (e.target.dataset.correct) {
                    triviaResultBox.className = 'alert-banner success text-center fade-in';
                    triviaResultBox.innerHTML = '<span>✅</span> Correct! You skipped 3 spots!';
                    currentPos = Math.max(1, currentPos - 3);
                    queuePosVal.textContent = currentPos;
                    queueWaitVal.innerHTML = `${Math.ceil(currentPos * 0.5)}<small>min</small>`;
                } else {
                    triviaResultBox.className = 'alert-banner danger text-center fade-in';
                    triviaResultBox.innerHTML = '<span>❌</span> Incorrect. Better luck next time!';
                }
                setTimeout(() => {
                    triviaResultBox.style.display = 'none';
                    playTriviaBtn.style.display = 'block';
                }, 3000);
            });
        });
    }

    // AR Navigation
    const arDestBtns = document.querySelectorAll('.ar-dest-btn');
    const arArrow = document.getElementById('arArrow');
    const arPoiText = document.getElementById('arPoiText');
    if (arDestBtns.length > 0) {
        arDestBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                arDestBtns.forEach(b => {
                    b.classList.remove('btn-primary');
                    b.classList.add('btn-secondary');
                });
                btn.classList.remove('btn-secondary');
                btn.classList.add('btn-primary');
                
                const deg = btn.dataset.deg;
                const name = btn.dataset.name;
                const dist = btn.dataset.dist;
                const icon = btn.textContent.split(' ')[0];
                
                arArrow.style.transform = `rotate(${deg}deg)`;
                arPoiText.innerHTML = `${icon}<br>${name}<br><span class="accent">${dist}</span>`;
            });
        });
    }

    // Sustainability
    let greenScore = 840;
    const scoreVal = document.getElementById('greenScoreVal');
    const scoreFill = document.getElementById('greenScoreFill');
    const ecoActions = document.querySelectorAll('.eco-action');
    
    ecoActions.forEach(action => {
        action.addEventListener('click', () => {
            if (!action.classList.contains('done')) {
                action.classList.add('done');
                const points = parseInt(action.dataset.points);
                greenScore += points;
                scoreVal.textContent = `${greenScore} pts`;
                scoreFill.style.width = `${Math.min(100, (greenScore/1500)*100)}%`;
                action.querySelector('.check-indicator').innerHTML = '<span>✅</span>';
            }
        });
    });
});

function createDot(container) {
    const dot = document.createElement('div');
    dot.style.position = 'absolute';
    dot.style.width = '6px';
    dot.style.height = '6px';
    dot.style.borderRadius = '50%';
    dot.style.background = getRandomColor();
    dot.dataset.origColor = dot.style.background;
    dot.style.boxShadow = `0 0 10px ${dot.style.background}`;
    
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    
    dot.style.left = `${startX}%`;
    dot.style.top = `${startY}%`;
    
    container.appendChild(dot);
    animateDot(dot);
}

function getRandomColor() {
    const colors = ['#00e5ff', '#00e676', '#ffb300', '#ff1744', '#7000ff'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function animateDot(dot) {
    const newX = Math.max(0, Math.min(100, parseFloat(dot.style.left) + (Math.random() - 0.5) * 20));
    const newY = Math.max(0, Math.min(100, parseFloat(dot.style.top) + (Math.random() - 0.5) * 20));
    
    // Check if incident is active to repel dots from center
    const incidentBtn = document.getElementById('incidentBtn');
    let finalX = newX;
    let finalY = newY;
    
    if (incidentBtn && incidentBtn.textContent === 'Clear Incident') {
        const dx = newX - 50;
        const dy = newY - 50;
        finalX += dx > 0 ? 5 : -5;
        finalY += dy > 0 ? 5 : -5;
        finalX = Math.max(0, Math.min(100, finalX));
        finalY = Math.max(0, Math.min(100, finalY));
        dot.style.background = '#ff1744';
        dot.style.boxShadow = `0 0 10px #ff1744`;
    } else if (dot.dataset.origColor) {
        dot.style.background = dot.dataset.origColor;
        dot.style.boxShadow = `0 0 10px ${dot.dataset.origColor}`;
    }

    dot.style.transition = 'all 2s ease-in-out';
    dot.style.left = `${finalX}%`;
    dot.style.top = `${finalY}%`;
    
    setTimeout(() => animateDot(dot), 2000 + Math.random() * 1000);
}
