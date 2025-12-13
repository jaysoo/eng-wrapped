import React, { useState, useEffect } from 'react';
import { teamColors, allProjects } from './data';

// Starfield background for Hero section
export const Starfield = ({ isActive }) => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    if (!isActive) return;

    const newStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      duration: 2 + Math.random() * 4,
      delay: Math.random() * 2,
      color: ['#22c55e', '#3b82f6', '#a855f7', '#ffffff'][Math.floor(Math.random() * 4)],
    }));
    setStars(newStars);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            backgroundColor: star.color,
            animation: `particleFloat ${star.duration}s ease-in-out ${star.delay}s infinite`,
            boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
          }}
        />
      ))}
    </div>
  );
};

// Fireworks for Closing section
export const Fireworks = ({ isActive }) => {
  const [bursts, setBursts] = useState([]);

  useEffect(() => {
    if (!isActive) {
      setBursts([]);
      return;
    }

    const colors = ['#22c55e', '#3b82f6', '#a855f7', '#f97316', '#eab308', '#ec4899', '#14b8a6'];
    const createBurst = () => {
      const id = Date.now() + Math.random();
      const x = 20 + Math.random() * 60;
      const y = 20 + Math.random() * 40;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const particles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        angle: (i * 30) * (Math.PI / 180),
        distance: 40 + Math.random() * 60,
      }));
      return { id, x, y, color, particles };
    };

    // Initial bursts
    setBursts([createBurst(), createBurst(), createBurst()]);

    // Continuous bursts
    const interval = setInterval(() => {
      setBursts(prev => [...prev.slice(-6), createBurst()]);
    }, 400);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bursts.map((burst) => (
        <div
          key={burst.id}
          className="absolute"
          style={{ left: `${burst.x}%`, top: `${burst.y}%` }}
        >
          {burst.particles.map((p) => (
            <div
              key={p.id}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: burst.color,
                boxShadow: `0 0 6px ${burst.color}, 0 0 12px ${burst.color}`,
                animation: 'fireworkBurst 1s ease-out forwards',
                '--tx': `${Math.cos(p.angle) * p.distance}px`,
                '--ty': `${Math.sin(p.angle) * p.distance}px`,
                transform: `translate(${Math.cos(p.angle) * p.distance}px, ${Math.sin(p.angle) * p.distance}px)`,
              }}
            />
          ))}
          {/* Center glow */}
          <div
            className="absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{
              backgroundColor: burst.color,
              boxShadow: `0 0 20px ${burst.color}, 0 0 40px ${burst.color}`,
              animation: 'fireworkBurst 0.5s ease-out forwards',
            }}
          />
        </div>
      ))}
      <style>{`
        @keyframes fireworkBurst {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx, 0), var(--ty, 0)) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// Healing wave effect for Self-Healing CI
export const HealingWave = ({ isActive }) => {
  const [waves, setWaves] = useState([]);

  useEffect(() => {
    if (!isActive) {
      setWaves([]);
      return;
    }

    const createWave = () => ({ id: Date.now(), delay: 0 });
    setWaves([createWave()]);

    const interval = setInterval(() => {
      setWaves(prev => [...prev.slice(-3), createWave()]);
    }, 800);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {waves.map((wave) => (
        <div
          key={wave.id}
          className="absolute rounded-full border-2 border-green-400"
          style={{
            width: '100%',
            height: '100%',
            animation: 'healingWave 2s ease-out forwards',
          }}
        />
      ))}
    </div>
  );
};

// Flying code symbols for LOC Stats
export const FlyingCode = ({ isActive }) => {
  const [symbols, setSymbols] = useState([]);

  useEffect(() => {
    if (!isActive) {
      setSymbols([]);
      return;
    }

    const createSymbols = () => {
      return Array.from({ length: 30 }, (_, i) => ({
        id: i,
        symbol: i % 2 === 0 ? '+' : '-',
        color: i % 2 === 0 ? '#4ade80' : '#f87171',
        y: 10 + Math.random() * 80,
        size: 16 + Math.random() * 24,
        duration: 3 + Math.random() * 3,
        delay: Math.random() * 2,
        direction: i % 3 === 0 ? 'left' : 'right',
      }));
    };

    setSymbols(createSymbols());
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {symbols.map((s) => (
        <div
          key={s.id}
          className="absolute font-mono font-bold"
          style={{
            top: `${s.y}%`,
            left: s.direction === 'left' ? '-50px' : 'auto',
            right: s.direction === 'right' ? '-50px' : 'auto',
            color: s.color,
            fontSize: s.size,
            textShadow: `0 0 10px ${s.color}`,
            animation: `flyCode${s.direction === 'left' ? 'Left' : 'Right'} ${s.duration}s linear ${s.delay}s infinite`,
            '--start-y': `${Math.random() * 20 - 10}px`,
            '--end-y': `${Math.random() * 20 - 10}px`,
          }}
        >
          {s.symbol}
        </div>
      ))}
    </div>
  );
};

// CRT Scanline overlay for Terminal UI
export const CRTOverlay = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
      {/* Scanline */}
      <div
        className="absolute left-0 right-0 h-1 bg-gradient-to-b from-transparent via-green-400/10 to-transparent"
        style={{ animation: 'scanline 3s linear infinite' }}
      />
      {/* CRT lines overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }}
      />
      {/* Corner vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%)',
        }}
      />
    </div>
  );
};

// Blinking cursor
export const BlinkingCursor = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <span
      className="inline-block w-2 h-5 bg-green-400 ml-1"
      style={{ animation: 'cursorBlink 1s step-end infinite' }}
    />
  );
};

// Pulse rings for Big Numbers
export const PulseRings = ({ color, isActive }) => {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[0, 0.5, 1].map((delay) => (
        <div
          key={delay}
          className="absolute w-full h-full rounded-full"
          style={{
            border: `2px solid ${color}`,
            animation: `pulseRing 2s ease-out ${delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

// Confetti cannon for celebrations
export const ConfettiCannon = ({ isActive }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      return;
    }

    const colors = ['#22c55e', '#3b82f6', '#a855f7', '#f97316', '#eab308', '#ec4899'];
    const newParticles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      tx: (Math.random() - 0.5) * 400,
      ty: -100 - Math.random() * 300,
      rotation: Math.random() * 720,
      size: 6 + Math.random() * 8,
      delay: Math.random() * 0.3,
      duration: 1.5 + Math.random() * 1,
    }));
    setParticles(newParticles);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            bottom: '20%',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `confettiCannon ${p.duration}s ease-out ${p.delay}s forwards`,
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
          }}
        />
      ))}
    </div>
  );
};

export const RocketLaunch = ({ isActive }) => {
  const [phase, setPhase] = useState('idle');
  const [smokeParticles, setSmokeParticles] = useState([]);

  useEffect(() => {
    if (!isActive) {
      setPhase('idle');
      setSmokeParticles([]);
      return;
    }

    setPhase('shake');

    const smokeInterval = setInterval(() => {
      setSmokeParticles(prev => [
        ...prev.slice(-20),
        {
          id: Date.now(),
          x: 50 + (Math.random() - 0.5) * 30,
          size: 20 + Math.random() * 40,
          duration: 1 + Math.random() * 1,
        }
      ]);
    }, 100);

    const launchTimer = setTimeout(() => {
      setPhase('launch');
      clearInterval(smokeInterval);
    }, 1200);

    return () => {
      clearTimeout(launchTimer);
      clearInterval(smokeInterval);
    };
  }, [isActive]);

  return (
    <div className="relative h-56 mb-8">
      {smokeParticles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: '15%',
            width: p.size,
            height: p.size,
            background: 'radial-gradient(circle, rgba(156,163,175,0.6) 0%, rgba(156,163,175,0) 70%)',
            animation: `smokeRise ${p.duration}s ease-out forwards`,
          }}
        />
      ))}

      {phase === 'launch' && (
        <div className="absolute inset-0">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${5 + Math.random() * 90}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${1.5 + Math.random() * 2}rem`,
                animation: `twinkle 0.6s ease-out ${i * 0.03}s forwards`,
                opacity: 0,
              }}
            >
              ✨
            </div>
          ))}
        </div>
      )}

      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          fontSize: '10rem',
          filter: 'drop-shadow(0 0 20px rgba(251,146,60,0.5))',
          animation: phase === 'shake'
            ? 'rocketShake 0.06s ease-in-out infinite'
            : phase === 'launch'
            ? 'rocketLaunch 0.6s ease-in forwards'
            : 'none',
          top: '45%',
          transform: 'translateX(-50%) translateY(-50%)',
        }}
      >
        🚀
        {(phase === 'shake' || phase === 'launch') && (
          <>
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                fontSize: '5rem',
                top: '85%',
                animation: phase === 'launch' ? 'exhaustGrow 0.3s ease-out forwards' : 'exhaustFlicker 0.08s ease-in-out infinite',
              }}
            >
              🔥
            </div>
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                fontSize: '3rem',
                top: '115%',
                opacity: 0.7,
                animation: phase === 'launch' ? 'exhaustGrow 0.4s ease-out forwards' : 'exhaustFlicker 0.1s ease-in-out infinite',
              }}
            >
              🔥
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes rocketShake {
          0%, 100% { transform: translateX(-50%) translateY(-50%) rotate(-4deg) scale(1); }
          25% { transform: translateX(-50%) translateY(-50%) rotate(4deg) scale(1.02); }
          50% { transform: translateX(-50%) translateY(-50%) rotate(-3deg) scale(1); }
          75% { transform: translateX(-50%) translateY(-50%) rotate(3deg) scale(1.01); }
        }
        @keyframes rocketLaunch {
          0% { transform: translateX(-50%) translateY(-50%) rotate(0deg); filter: drop-shadow(0 0 30px rgba(251,146,60,0.8)); }
          50% { filter: drop-shadow(0 0 60px rgba(251,146,60,1)); }
          100% { transform: translateX(-50%) translateY(-700px) rotate(0deg); opacity: 0; }
        }
        @keyframes exhaustFlicker {
          0%, 100% { opacity: 0.9; transform: translateX(-50%) scale(1); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.5); }
        }
        @keyframes exhaustGrow {
          0% { transform: translateX(-50%) scale(1); opacity: 1; }
          100% { transform: translateX(-50%) scale(3); opacity: 0; }
        }
        @keyframes twinkle {
          0% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1.4); }
          100% { opacity: 0.9; transform: scale(1); }
        }
        @keyframes smokeRise {
          0% { transform: translateY(0) scale(1); opacity: 0.6; }
          100% { transform: translateY(-150px) scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export const NumbersRain = ({ isActive }) => {
  const [numbers, setNumbers] = useState([]);

  useEffect(() => {
    if (!isActive) {
      setNumbers([]);
      return;
    }

    const newNumbers = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      value: Math.floor(Math.random() * 10),
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 4,
      size: 16 + Math.random() * 24,
      opacity: 0.1 + Math.random() * 0.2,
    }));
    setNumbers(newNumbers);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {numbers.map((n) => (
        <div
          key={n.id}
          className="absolute font-mono font-bold text-zinc-600"
          style={{
            left: `${n.x}%`,
            top: -50,
            fontSize: n.size,
            opacity: n.opacity,
            animation: `numberFall ${n.duration}s linear ${n.delay}s infinite`,
          }}
        >
          {n.value}
        </div>
      ))}
      <style>{`
        @keyframes numberFall {
          0% { transform: translateY(0); }
          100% { transform: translateY(calc(100vh + 100px)); }
        }
      `}</style>
    </div>
  );
};

export const Confetti = ({ active }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!active) return;

    const colors = ['#22c55e', '#3b82f6', '#a855f7', '#f97316', '#eab308', '#ec4899'];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 8,
    }));
    setParticles(newParticles);
  }, [active]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-fall"
          style={{
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `fall ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export const ProjectsShowcase = ({ isActive }) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setVisibleCount(0);
      setShowConfetti(false);
      return;
    }

    const timer = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= allProjects.length) {
          clearInterval(timer);
          setShowConfetti(true);
          return prev;
        }
        return prev + 1;
      });
    }, 80);

    return () => clearInterval(timer);
  }, [isActive]);

  return (
    <div className="text-center max-w-5xl relative">
      <Confetti active={showConfetti} />
      <p className="text-zinc-300 uppercase tracking-wider text-sm mb-2">Everything we shipped</p>
      <h2 className="text-4xl font-bold mb-6">80+ Projects</h2>
      <div className="flex flex-wrap justify-center gap-2 max-h-[60vh] overflow-hidden">
        {allProjects.slice(0, visibleCount).map((project, i) => (
          <div
            key={i}
            className="px-3 py-1.5 rounded-full text-sm font-medium text-white transition-all duration-300"
            style={{
              backgroundColor: teamColors[project.team],
              animation: 'popIn 0.3s ease-out',
            }}
          >
            {project.name}
          </div>
        ))}
      </div>
      <p
        className="text-zinc-500 text-sm mt-6"
        style={{ animation: isActive ? 'fadeInUp 0.5s ease-out 2.8s both' : 'none' }}
      >...and many more contributions across the teams</p>
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export const teamPhotos = [
  { name: 'Patrick Mariglia', photo: 'https://nx.dev/images/team/patrick-mariglia.avif' },
  { name: 'Steve Pentland', photo: 'https://nx.dev/images/team/steve-pentland.avif' },
  { name: 'Szymon', photo: 'https://nx.dev/images/team/szymon-wojciechowski.avif' },
  { name: 'Louie Weng', photo: 'https://nx.dev/images/team/louie-weng.avif' },
  { name: 'Altan Stalker', photo: 'https://nx.dev/images/team/altan-stalker.avif' },
  { name: 'Max Kless', photo: 'https://nx.dev/images/team/max-kless.avif' },
  { name: 'Rares Matei', photo: 'https://nx.dev/images/team/rares-matei.avif' },
  { name: 'Chau Tran', photo: 'https://nx.dev/images/team/chau-tran.avif' },
  { name: 'Colum Ferry', photo: 'https://nx.dev/images/team/colum-ferry.avif' },
  { name: 'Jason Jean', photo: 'https://nx.dev/images/team/jason-jean.avif' },
  { name: 'James Henry', photo: 'https://nx.dev/images/team/james-henry.avif' },
  { name: 'Jack Hsu', photo: 'https://nx.dev/images/team/jack-hsu.avif' },
  { name: 'Jon Cammisuli', photo: 'https://nx.dev/images/team/jonathan-cammisuli.avif' },
  { name: 'Leosvel Pérez', photo: 'https://nx.dev/images/team/leosvel-perez-espinosa.avif' },
  { name: 'Ben Cabanes', photo: 'https://nx.dev/images/team/benjamin-cabanes.avif' },
  { name: 'Mark Lindsey', photo: 'https://nx.dev/images/team/mark-lindsey.avif' },
  { name: 'Victor Savkin', photo: 'https://nx.dev/images/team/victor-savkin.avif' },
  { name: 'Craigory Coppola', photo: 'https://nx.dev/images/team/craigory-coppola.avif' },
  { name: 'Nicole Oliver', photo: 'https://nx.dev/images/team/nicole-oliver.avif' },
  { name: 'Dillon', photo: 'https://nx.dev/images/team/dillon-chanis.avif' },
  { name: 'Caleb Ukle', photo: 'https://nx.dev/images/team/caleb-ukle.avif' },
];

export const AnimatedNumber = ({ value, duration = 2000, isActive }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setCurrent(0);
      return;
    }

    const steps = 60;
    const increment = value / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setCurrent(Math.min(Math.floor(increment * step), value));
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, duration, isActive]);

  return <span>{current.toLocaleString()}</span>;
};

export const AnimatedTeamCount = ({ isActive }) => {
  const [showHalf, setShowHalf] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setShowHalf(false);
      return;
    }

    const halfTimer = setTimeout(() => {
      setShowHalf(true);
    }, 2000);

    return () => clearTimeout(halfTimer);
  }, [isActive]);

  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline' }}>
      4
      <span
        style={{
          opacity: showHalf ? 1 : 0,
          transform: showHalf ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.5)',
          transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
          fontSize: '0.7em',
          marginLeft: '2px',
        }}
      >
        .5
      </span>
    </span>
  );
};

export const Section = ({ children, className = '' }) => (
  <div className={`h-dvh flex flex-col items-center p-4 md:p-8 shrink-0 overflow-y-auto ${className}`}>
    <div className="m-auto w-full flex flex-col items-center">
      {children}
    </div>
  </div>
);

export const TeamCard = ({ name, lead, color, accomplishments, members, delay = 0, wiggleDelay = 0 }) => (
  <div
    className="bg-zinc-900 rounded-2xl p-5 border-l-4 transition-all duration-300 hover:shadow-xl group"
    style={{
      borderColor: color,
      animation: `slideInUp 0.6s ease-out ${delay}s both, wiggle 3s ease-in-out ${wiggleDelay}s infinite`
    }}
  >
    <div className="flex items-center gap-3 mb-3">
      <div
        className="w-3 h-3 rounded-full animate-pulse"
        style={{ backgroundColor: color, animationDuration: '2s' }}
      />
      <h3 className="text-lg font-bold text-white">{name}</h3>
    </div>
    <p className="text-zinc-400 text-sm mb-3">Led by <span className="text-white font-medium">{lead}</span></p>
    <ul className="space-y-1">
      {accomplishments.map((item, i) => (
        <li
          key={i}
          className="text-zinc-300 text-sm flex gap-2"
          style={{ animation: `fadeIn 0.4s ease-out ${delay + 0.1 * (i + 1)}s both` }}
        >
          <span style={{ color }}>→</span> {item}
        </li>
      ))}
    </ul>
    {members && (
      <div className="mt-3 pt-3 border-t border-zinc-800">
        <div className="flex flex-wrap gap-1">
          {members.map((m, i) => (
            <span
              key={i}
              className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full hover:scale-110 transition-transform cursor-default"
              style={{ animation: `popIn 0.3s ease-out ${delay + 0.5 + 0.05 * i}s both` }}
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    )}
    <style>{`
      @keyframes slideInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateX(-10px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes wiggle {
        0%, 100% { transform: rotate(-0.5deg) scale(1); }
        25% { transform: rotate(0.5deg) scale(1.01); }
        50% { transform: rotate(-0.3deg) scale(1); }
        75% { transform: rotate(0.4deg) scale(1.005); }
      }
      .group:hover {
        animation-play-state: paused !important;
        transform: rotate(0deg) scale(1.02) !important;
      }
    `}</style>
  </div>
);
