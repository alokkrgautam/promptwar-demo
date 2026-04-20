import React, { useState, useEffect } from 'react';
import { Menu, X, LocateFixed, Activity, Leaf, ShieldAlert, Navigation, Utensils, DoorOpen, CheckCircle, TrainFront, Coffee, Ticket, Gamepad2, AlertTriangle, Volume2, Languages, Accessibility, Camera, Star } from 'lucide-react';
import './index.css';

// Reusable Dot Map Component
const DotMap = ({ incidentZone }) => {
  const [dots, setDots] = useState([]);
  
  useEffect(() => {
    const initialDots = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: ['#00e5ff', '#00e676', '#ffb300', '#ff1744', '#7000ff'][Math.floor(Math.random() * 5)]
    }));
    setDots(initialDots);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prevDots => prevDots.map(dot => {
        let targetX = dot.x + (Math.random() - 0.5) * 15;
        let targetY = dot.y + (Math.random() - 0.5) * 15;

        // If an incident occurs, dots move away from the center
        if (incidentZone) {
          const dx = dot.x - 50;
          const dy = dot.y - 50;
          targetX += dx > 0 ? 5 : -5;
          targetY += dy > 0 ? 5 : -5;
        }

        return {
          ...dot,
          x: Math.max(0, Math.min(100, targetX)),
          y: Math.max(0, Math.min(100, targetY))
        };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [incidentZone]);

  return (
    <div className="mockup-map">
      {incidentZone && <div className="incident-pulse"></div>}
      {dots.map(dot => (
        <div
          key={dot.id}
          style={{
            position: 'absolute',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: incidentZone ? '#ff1744' : dot.color, // Turn red during incident
            boxShadow: `0 0 10px ${incidentZone ? '#ff1744' : dot.color}`,
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            transition: 'all 2s ease-in-out'
          }}
        />
      ))}
    </div>
  );
};

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Interactive States
  const [activeSector, setActiveSector] = useState(0);
  const [incidentActive, setIncidentActive] = useState(false);

  // Queue & Gamification States
  const [queuePos, setQueuePos] = useState(24);
  const [triviaState, setTriviaState] = useState('idle'); // idle, playing, won, lost

  // AR States
  const [arTarget, setArTarget] = useState({ name: 'Section 304', dist: '150m', icon: <Ticket />, deg: 0 });

  // Sustainability States
  const [greenScore, setGreenScore] = useState(840);
  const [actionsDone, setActionsDone] = useState({ train: false, vegan: false, cup: false });

  // Accessibility States
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  // Engagement States
  const [photoBoothActive, setPhotoBoothActive] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(1250);

  // Auth States
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if(el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  const handleTriviaAnswer = (correct) => {
    if (correct) {
      setTriviaState('won');
      setQueuePos(p => Math.max(1, p - 3)); // Jump 3 spots!
    } else {
      setTriviaState('lost');
    }
    setTimeout(() => setTriviaState('idle'), 3000);
  };

  const handleEcoAction = (key, points) => {
    if (!actionsDone[key]) {
      setActionsDone(prev => ({ ...prev, [key]: true }));
      setGreenScore(prev => prev + points);
    }
  };

  const sectors = [
    { name: 'Zone A (High)', intensity: '80%', color: 'var(--danger)' },
    { name: 'Zone B (Low)', intensity: '30%', color: 'var(--success)' },
    { name: 'Zone C (Medium)', intensity: '55%', color: 'var(--warning)' },
    { name: 'Gates (Critical)', intensity: '90%', color: 'var(--danger)' },
  ];

  const arDestinations = [
    { name: 'Section 304', dist: '150m', icon: <Ticket size={20} />, deg: 0 },
    { name: 'Restroom', dist: '45m', icon: <DoorOpen size={20} />, deg: 45 },
    { name: 'Food Court', dist: '80m', icon: <Utensils size={20} />, deg: -30 },
    { name: 'Exit', dist: '200m', icon: <DoorOpen size={20} />, deg: 180 },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-content container">
          <div className="logo">
            <span className="logo-icon">🏟️</span>
            <h1>Smart Event Flow<span className="accent">+</span></h1>
          </div>
          
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>

          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <li><a href="#heatmap" onClick={(e) => { e.preventDefault(); scrollTo('heatmap'); }}>Heatmap</a></li>
            <li><a href="#queues" onClick={(e) => { e.preventDefault(); scrollTo('queues'); }}>Queues</a></li>
            <li><a href="#ar-nav" onClick={(e) => { e.preventDefault(); scrollTo('ar-nav'); }}>AR Navigation</a></li>
            <li><a href="#accessibility" onClick={(e) => { e.preventDefault(); scrollTo('accessibility'); }}>Accessibility</a></li>
            <li><a href="#engagement" onClick={(e) => { e.preventDefault(); scrollTo('engagement'); }}>Rewards</a></li>
            <li><a href="#sustainability" onClick={(e) => { e.preventDefault(); scrollTo('sustainability'); }}>Eco</a></li>
          </ul>
          {!isLoggedIn ? (
            <button className="btn btn-primary" onClick={() => setShowLoginModal(true)}>Organizer Login</button>
          ) : (
            <button className="btn btn-primary" onClick={() => setIsLoggedIn(false)}>Sign Out</button>
          )}
        </div>
      </nav>

      {showLoginModal && (
        <div className="modal-overlay" style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.8)', zIndex:2000, display:'flex', justifyContent:'center', alignItems:'center'}}>
          <div className="auth-card fade-in">
            <h2 style={{marginBottom:'1rem'}}>Organizer Access</h2>
            <p className="text-secondary" style={{marginBottom:'2rem'}}>Sign in to the Smart Event Flow+ dashboard.</p>
            <button className="btn btn-glow w-100" onClick={() => { setIsLoggedIn(true); setShowLoginModal(false); }}>
              Sign In with Google (OAuth 2.0)
            </button>
            <button className="btn btn-secondary w-100 mt-1" onClick={() => setShowLoginModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <header className="hero">
        <div className="hero-bg-glow"></div>
        <div className="container hero-content">
          <div className="hero-text">
            <div className="badge">Powered by Google ARCore & Gemini AI</div>
            <h2 className="hero-title">Experience Events,<br/>Without the Chaos.</h2>
            <p className="hero-subtitle">Smart Event Flow+ uses predictive AI and AR to eliminate queues, optimize crowd movement, and revolutionize stadium experiences.</p>
            <div className="hero-actions">
              <button className="btn btn-glow" onClick={() => scrollTo('ar-nav')}>Try AR Navigation</button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="glass-panel main-dashboard-mockup">
              <div className="panel-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                Live Stadium Congestion
                <button 
                  className={`btn ${incidentActive ? 'btn-primary' : 'btn-secondary'}`} 
                  style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderColor: incidentActive ? 'var(--danger)' : ''}}
                  onClick={() => setIncidentActive(!incidentActive)}
                >
                  {incidentActive ? 'Clear Incident' : 'Simulate Incident'}
                </button>
              </div>
              <DotMap incidentZone={incidentActive} />
              {incidentActive && (
                <div className="alert-banner mt-1">
                  <AlertTriangle size={16} /> Incident detected! Rerouting crowds automatically.
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Crowd Movement */}
        <section id="heatmap" className="section">
          <div className="container section-grid">
            <div className="section-content">
              <span className="section-label">Predictive Intelligence</span>
              <h3>Interactive Crowd Control</h3>
              <p>Hover or tap on the zones below to view detailed congestion metrics. Simulate an incident above to see our AI reroute the crowd in real-time.</p>
              <ul className="feature-list">
                <li><LocateFixed size={18} className="accent" /> Real-time dynamic updates</li>
                <li><Activity size={18} className="accent" /> Gemini AI forecasting</li>
                <li><ShieldAlert size={18} className="accent" /> Automated incident response</li>
              </ul>
            </div>
            <div className="section-visual glass-panel">
              <h4 style={{marginBottom: '1rem'}}>Tap a Sector for Analysis</h4>
              <div className="heatmap-demo">
                {sectors.map((sec, idx) => (
                  <div 
                    key={idx} 
                    className={`sector ${activeSector === idx ? 'active' : ''}`}
                    style={{ '--intensity': sec.intensity, borderColor: activeSector === idx ? sec.color : 'transparent' }}
                    onClick={() => setActiveSector(idx)}
                  >
                    {sec.name}
                    {activeSector === idx && (
                      <div className="sector-details fade-in">
                        <small>Density: {sec.intensity}</small><br/>
                        <small>Flow: Normal</small>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Queues */}
        <section id="queues" className="section section-dark">
          <div className="container section-grid reverse">
            <div className="section-content">
              <span className="section-label">Zero Waiting</span>
              <h3>Gamified Virtual Queues</h3>
              <p>Join queues virtually and play interactive mini-games to fast-track your position.</p>
              <div className="queue-card interactive-card">
                <div className="q-header">
                  <h4>🍔 Mega Burger Stall 4</h4>
                  <span className="status live">Live</span>
                </div>
                <div className="q-details" style={{justifyContent: 'space-around'}}>
                  <div className="q-stat text-center">
                    <span className="q-val">{Math.ceil(queuePos * 0.5)}<small>min</small></span>
                    <span className="q-lbl">Est. Wait</span>
                  </div>
                  <div className="q-stat text-center">
                    <span className="q-val accent">{queuePos}</span>
                    <span className="q-lbl">Your Position</span>
                  </div>
                </div>
                
                <div className="trivia-section mt-2">
                  {triviaState === 'idle' && (
                    <button className="btn btn-glow w-100" onClick={() => setTriviaState('playing')}>
                      <Gamepad2 size={18} style={{display:'inline', verticalAlign:'middle', marginRight:'8px'}}/> 
                      Play Trivia to Skip 3 Spots!
                    </button>
                  )}
                  {triviaState === 'playing' && (
                    <div className="trivia-box fade-in">
                      <p style={{fontWeight: 600, marginBottom: '1rem'}}>Which team won the championship in 2024?</p>
                      <div style={{display:'flex', gap:'0.5rem', flexDirection:'column'}}>
                        <button className="btn btn-secondary w-100" onClick={() => handleTriviaAnswer(false)}>The Eagles</button>
                        <button className="btn btn-secondary w-100" onClick={() => handleTriviaAnswer(true)}>The Tigers</button>
                        <button className="btn btn-secondary w-100" onClick={() => handleTriviaAnswer(false)}>The Panthers</button>
                      </div>
                    </div>
                  )}
                  {triviaState === 'won' && (
                    <div className="alert-banner success text-center fade-in">
                      <CheckCircle size={18} /> Correct! You skipped 3 spots!
                    </div>
                  )}
                  {triviaState === 'lost' && (
                    <div className="alert-banner danger text-center fade-in">
                      <X size={18} /> Incorrect. Better luck next time!
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="section-visual">
              <div className="glass-panel wait-recommendations">
                <h4>Alternative Options</h4>
                <div className="alt-option interactive-hover" onClick={() => setQueuePos(1)}>
                  <span>🌭 HotDog Stand 2</span>
                  <span className="wait-time green">Switch Queue (No Wait)</span>
                </div>
                <div className="alt-option interactive-hover" onClick={() => setQueuePos(5)}>
                  <span>🍺 Drink Express</span>
                  <span className="wait-time text-secondary">Switch Queue (5 in line)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AR Navigation */}
        <section id="ar-nav" className="section">
          <div className="container text-center">
            <span className="section-label">Immersive Wayfinding</span>
            <h3>Interactive AR Navigation</h3>
            <p className="max-w-m mx-auto">Select a destination below to see how the AR interface dynamically guides you through the venue.</p>
            
            <div className="ar-controls mt-2" style={{display:'flex', justifyContent:'center', gap:'1rem', flexWrap:'wrap'}}>
              {arDestinations.map((dest, i) => (
                <button 
                  key={i} 
                  className={`btn ${arTarget.name === dest.name ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setArTarget(dest)}
                >
                  {dest.icon} <span style={{marginLeft:'8px'}}>{dest.name}</span>
                </button>
              ))}
            </div>

            <div className="ar-demo-container mt-2">
              <div className="phone-mockup interactive-phone">
                <div className="ar-view">
                  <div className="ar-arrow" style={{transform: `rotate(${arTarget.deg}deg)`, transition: 'transform 0.5s ease'}}>
                    <Navigation size={100} fill="var(--accent-glow)" color="var(--accent-glow)" />
                  </div>
                  <div className="ar-poi fade-in" key={arTarget.name}>
                    {arTarget.icon}<br/>
                    {arTarget.name}<br/>
                    <span className="accent">{arTarget.dist}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Real-Time Coordination */}
        <section id="coordination" className="section section-dark">
          <div className="container section-grid">
            <div className="section-content">
              <span className="section-label">Command Center</span>
              <h3>Real-Time Coordination</h3>
              <p>Empower organizers with a unified dashboard. Instantly push alerts to attendees' smartphones and smartwatches during emergencies or schedule changes.</p>
              <ul className="feature-list">
                <li><ShieldAlert size={18} className="accent" /> Emergency evacuation protocols</li>
                <li><Activity size={18} className="accent" /> Push notifications & smartwatch sync</li>
                <li><LocateFixed size={18} className="accent" /> Live AI alerts on organizer dashboard</li>
              </ul>
            </div>
            <div className="section-visual glass-panel">
              <div className="alert-banner danger mt-1 mb-2" style={{marginBottom: '1rem'}}>
                <AlertTriangle size={16} style={{minWidth: '16px'}}/> [Demo Alert] Severe Weather Warning: Please proceed to indoor concourses.
              </div>
              <div className="alert-banner success">
                <CheckCircle size={16} style={{minWidth: '16px'}}/> [Demo Update] Match resuming in 15 minutes.
              </div>
            </div>
          </div>
        </section>

        {/* Accessibility & Inclusivity */}
        <section id="accessibility" className="section">
          <div className="container section-grid reverse">
            <div className="section-content">
              <span className="section-label">For Everyone</span>
              <h3>Accessibility & Inclusivity</h3>
              <p>We ensure every fan has a seamless experience. Toggle voice guidance, haptic feedback, and choose your preferred language via Google Translate APIs.</p>
              <div className="interactive-card mt-2 p-1 border-radius" style={{background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                  <span style={{fontWeight: 600}}><Volume2 size={18} style={{verticalAlign: 'middle', marginRight: '8px'}}/> Voice Guidance</span>
                  <button className={`btn ${voiceEnabled ? 'btn-primary' : 'btn-secondary'}`} style={{padding: '0.4rem 0.8rem'}} onClick={() => setVoiceEnabled(!voiceEnabled)}>
                    {voiceEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontWeight: 600}}><Languages size={18} style={{verticalAlign: 'middle', marginRight: '8px'}}/> Language</span>
                  <select 
                    className="form-control" 
                    style={{width: 'auto', padding: '0.4rem', background: 'var(--bg-secondary)', color: 'white', border: '1px solid var(--glass-border)'}}
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                  >
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>Mandarin</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="section-visual text-center">
              <Accessibility size={120} color="var(--accent-glow)" style={{filter: 'drop-shadow(0 0 20px var(--accent-glow))'}} />
            </div>
          </div>
        </section>

        {/* Engagement & Enjoyment */}
        <section id="engagement" className="section bg-gradient">
          <div className="container section-grid">
            <div className="section-content">
              <span className="section-label" style={{color: 'var(--warning)'}}>Fan Experience</span>
              <h3>Engagement & Enjoyment</h3>
              <p>Capture the moment with AR photo booths, earn loyalty points for purchases, and unlock personalized seat upgrades.</p>
              <div className="impact-meter mt-2">
                <div className="meter-lbl" style={{display:'flex', justifyContent:'space-between'}}>
                  <span>Loyalty Points</span>
                  <span style={{color: 'var(--warning)', fontSize:'1.2rem', fontWeight: 800}}>{loyaltyPoints} pts</span>
                </div>
                <div className="meter-bar">
                  <div className="meter-fill" style={{ width: '83%', background: 'var(--warning)', boxShadow: '0 0 10px var(--warning)' }}></div>
                </div>
                <small className="text-secondary mt-1" style={{display:'block'}}>Unlock VIP access at 1500 pts!</small>
              </div>
            </div>
            <div className="section-visual">
               <div className="glass-panel text-center interactive-hover" onClick={() => setPhotoBoothActive(!photoBoothActive)} style={{cursor: 'pointer', padding: '3rem 2rem'}}>
                 {photoBoothActive ? (
                   <div className="fade-in">
                     <Camera size={48} color="var(--accent-glow)" />
                     <h4 className="mt-1">AR Filter Active!</h4>
                     <p className="text-secondary">Taking photo in 3... 2... 1...</p>
                   </div>
                 ) : (
                   <div>
                     <Star size={48} color="var(--warning)" />
                     <h4 className="mt-1">Launch AR Photo Booth</h4>
                     <p className="text-secondary">Tap to capture a magical moment with team mascots!</p>
                   </div>
                 )}
               </div>
            </div>
          </div>
        </section>

        {/* Sustainability */}
        <section id="sustainability" className="section bg-gradient">
          <div className="container section-grid">
            <div className="section-content">
              <span className="section-label eco">Eco-Impact</span>
              <h3>Earn Rewards for Sustainability</h3>
              <p>Check off the eco-friendly actions you've taken today and watch your Green Score rise!</p>
              
              <div className="impact-meter mt-2">
                <div className="meter-lbl" style={{display:'flex', justifyContent:'space-between'}}>
                  <span>Your Green Score</span>
                  <span className="eco-val" style={{fontSize:'1.2rem', fontWeight: 800}}>{greenScore} pts</span>
                </div>
                <div className="meter-bar">
                  <div className="meter-fill" style={{ width: `${Math.min(100, (greenScore/1500)*100)}%` }}></div>
                </div>
                <small className="text-secondary mt-1" style={{display:'block'}}>Reach 1000 pts for a free drink voucher!</small>
              </div>
            </div>
            
            <div className="section-visual">
              <div className="glass-panel stats-panel interactive-stats">
                <div 
                  className={`stat-box checkable ${actionsDone.train ? 'done' : ''}`}
                  onClick={() => handleEcoAction('train', 500)}
                >
                  <div className="stat-icon"><TrainFront /></div>
                  <div className="stat-info">
                    <strong>Took Public Transport</strong>
                    <span>+500 points</span>
                  </div>
                  <div className="check-indicator">{actionsDone.train ? <CheckCircle color="var(--success)"/> : <div className="circle-empty"></div>}</div>
                </div>
                
                <div 
                  className={`stat-box checkable ${actionsDone.vegan ? 'done' : ''}`}
                  onClick={() => handleEcoAction('vegan', 200)}
                >
                  <div className="stat-icon"><Leaf /></div>
                  <div className="stat-info">
                    <strong>Ate a Vegan Meal</strong>
                    <span>+200 points</span>
                  </div>
                  <div className="check-indicator">{actionsDone.vegan ? <CheckCircle color="var(--success)"/> : <div className="circle-empty"></div>}</div>
                </div>

                <div 
                  className={`stat-box checkable ${actionsDone.cup ? 'done' : ''}`}
                  onClick={() => handleEcoAction('cup', 150)}
                >
                  <div className="stat-icon"><Coffee /></div>
                  <div className="stat-info">
                    <strong>Used Reusable Cup</strong>
                    <span>+150 points</span>
                  </div>
                  <div className="check-indicator">{actionsDone.cup ? <CheckCircle color="var(--success)"/> : <div className="circle-empty"></div>}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <p style={{ padding: '2rem 0', color: 'var(--text-secondary)' }}>&copy; 2026 Smart Event Flow+. Powered by Google Cloud & Gemini.</p>
        </div>
      </footer>
    </>
  );
}
