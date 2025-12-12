import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const teamColors = {
  infrastructure: '#22c55e',
  cli: '#3b82f6',
  cloud: '#a855f7',
  redpanda: '#f97316'
};

const commitData = [
  { name: 'Patrick M.', commits: 1727, team: 'infrastructure' },
  { name: 'Steve P.', commits: 1147, team: 'infrastructure' },
  { name: 'Szymon', commits: 509, team: 'infrastructure' },
  { name: 'Louie W.', commits: 468, team: 'cloud' },
  { name: 'Altan S.', commits: 389, team: 'redpanda' },
  { name: 'Max K.', commits: 380, team: 'cli' },
  { name: 'Rares M.', commits: 353, team: 'cloud' },
  { name: 'Chau T.', commits: 348, team: 'cloud' },
  { name: 'Colum F.', commits: 347, team: 'cli' },
  { name: 'Jason J.', commits: 337, team: 'cli' },
  { name: 'James H.', commits: 318, team: 'redpanda' },
  { name: 'Jack H.', commits: 299, team: 'cli' },
  { name: 'Jon C.', commits: 280, team: 'redpanda' },
  { name: 'Leosvel P.', commits: 259, team: 'cli' },
  { name: 'Ben C.', commits: 257, team: 'redpanda' },
  { name: 'Mark L.', commits: 183, team: 'redpanda' },
  { name: 'Victor S.', commits: 156, team: 'redpanda' },
  { name: 'Craigory C.', commits: 132, team: 'cli' },
  { name: 'Nicole O.', commits: 104, team: 'cloud' },
  { name: 'Dillon', commits: 71, team: 'cloud' },
];

const projectData = [
  { name: 'Infrastructure', value: 40, color: teamColors.infrastructure },
  { name: 'CLI', value: 19, color: teamColors.cli },
  { name: 'Orca', value: 17, color: teamColors.cloud },
  { name: 'RedPanda', value: 4, color: teamColors.redpanda },
];

const frameworkReleases = [
  { name: 'Angular 21 (soon)', icon: '🅰️' },
  { name: 'Next 16', icon: '▲' },
  { name: 'Expo 54', icon: '📱' },
  { name: 'Nuxt 4', icon: '💚' },
  { name: 'Vitest 4', icon: '⚡' },
  { name: 'Storybook 10', icon: '📖' },
  { name: 'Cypress 15', icon: '🌲' },
  { name: 'Node 24', icon: '💚' },
];

const cloudHighlights = [
  { name: 'Onboarding Flow', icon: '🚀' },
  { name: 'Enterprise Usage UI', icon: '📊' },
  { name: 'Flaky Task Analytics', icon: '🔍' },
  { name: 'Graph UX Improvements', icon: '🕸️' },
  { name: 'Artifact Downloads', icon: '📦' },
  { name: 'EU Pro Support', icon: '🇪🇺' },
  { name: 'CI Stability', icon: '🛡️' },
  { name: 'A/B Testing', icon: '🧪' },
];

const infraHighlights = [
  { name: 'Docker Layer Caching', icon: '🐳' },
  { name: 'Azure Single Tenant', icon: '☁️' },
  { name: 'Distributed Tracing', icon: '🔬' },
  { name: 'Grafana Dashboards', icon: '📉' },
  { name: 'Helm Chart v1', icon: '⎈' },
  { name: 'SOC2 Compliance', icon: '🔒' },
  { name: 'MongoDB Upgrade', icon: '🍃' },
  { name: 'Valkey Migration', icon: '⚡' },
];

const redpandaHighlights = [
  { name: 'Self-Healing CI', icon: '🩹' },
  { name: 'GitHub Integration', icon: '🐙' },
  { name: 'GitLab Integration', icon: '🦊' },
  { name: 'Azure DevOps', icon: '🔷' },
  { name: 'Time-to-Green', icon: '⏱️' },
  { name: 'Polygraph', icon: '📐' },
];

const allProjects = [
  // Infrastructure
  { name: 'Docker Layer Caching', team: 'infrastructure' },
  { name: 'Azure Single Tenant', team: 'infrastructure' },
  { name: 'SOC2 DR/BC Exercise', team: 'infrastructure' },
  { name: 'Distributed Tracing', team: 'infrastructure' },
  { name: 'Helm Chart v1', team: 'infrastructure' },
  { name: 'MongoDB Upgrade', team: 'infrastructure' },
  { name: 'Grafana Dashboards', team: 'infrastructure' },
  { name: 'Observability Stack', team: 'infrastructure' },
  { name: 'Valkey Migration', team: 'infrastructure' },
  { name: 'Trivy Scanner', team: 'infrastructure' },
  { name: 'Cost Reporting', team: 'infrastructure' },
  { name: 'AWS CloudTrail', team: 'infrastructure' },
  // CLI
  { name: 'Terminal UI', team: 'cli' },
  { name: 'Expo 54 Support', team: 'cli' },
  { name: 'Vitest 4 Support', team: 'cli' },
  { name: 'Nuxt 4 Support', team: 'cli' },
  { name: 'Next 16 Support', team: 'cli' },
  { name: 'Cypress 15 Support', team: 'cli' },
  { name: 'Node 24 Support', team: 'cli' },
  { name: 'Storybook 10 Support', team: 'cli' },
  { name: 'Pnpm Catalog Support', team: 'cli' },
  { name: 'AI Code Generation', team: 'cli' },
  { name: 'Angular RSPack', team: 'cli' },
  { name: '.NET Plugin', team: 'cli' },
  // Cloud
  { name: 'Agent Resource Usage', team: 'cloud' },
  { name: 'Onboarding Flow', team: 'cloud' },
  { name: 'Enterprise Usage UI', team: 'cloud' },
  { name: 'Flaky Task Analytics', team: 'cloud' },
  { name: 'Graph UX Improvements', team: 'cloud' },
  { name: 'Agent Pod Debugging', team: 'cloud' },
  { name: 'Artifact Downloads', team: 'cloud' },
  { name: 'EU Pro Support', team: 'cloud' },
  // RedPanda
  { name: 'Self-Healing CI', team: 'redpanda' },
  { name: 'GitHub Integration', team: 'redpanda' },
  { name: 'GitLab Integration', team: 'redpanda' },
  { name: 'Azure DevOps Integration', team: 'redpanda' },
  { name: 'Time-to-Green Analytics', team: 'redpanda' },
  { name: 'Polygraph Conformance', team: 'redpanda' },
];

const RocketLaunch = ({ isActive }) => {
  const [phase, setPhase] = useState('idle'); // idle, shake, launch
  const [smokeParticles, setSmokeParticles] = useState([]);

  useEffect(() => {
    if (!isActive) {
      setPhase('idle');
      setSmokeParticles([]);
      return;
    }

    setPhase('shake');

    // Generate smoke during shake phase
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
      {/* Smoke particles */}
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

      {/* Stars that appear */}
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

      {/* Rocket */}
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
        {/* Exhaust flames */}
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

const NumbersRain = ({ isActive }) => {
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

const Confetti = ({ active }) => {
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

const ProjectsShowcase = ({ isActive }) => {
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

const teamPhotos = [
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
];

const AnimatedNumber = ({ value, duration = 2000, isActive }) => {
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

const Section = ({ children, className = '' }) => (
  <div className={`h-screen flex flex-col items-center justify-center p-8 shrink-0 ${className}`}>
    {children}
  </div>
);

const TeamCard = ({ name, lead, color, accomplishments, members, delay = 0, wiggleDelay = 0 }) => (
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

export default function EngWrapped() {
  const [activeSection, setActiveSection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = React.useRef(null);
  const animationRef = React.useRef(null);
  const targetSectionRef = React.useRef(0);
  const autoPlayRef = React.useRef(null);
  const audioRef = React.useRef(null);

  // Start audio on first user interaction
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const startAudio = () => {
      audio.play().catch(() => {});
      window.removeEventListener('click', startAudio);
      window.removeEventListener('keydown', startAudio);
    };

    window.addEventListener('click', startAudio);
    window.addEventListener('keydown', startAudio);

    return () => {
      window.removeEventListener('click', startAudio);
      window.removeEventListener('keydown', startAudio);
    };
  }, []);

  // Sync mute state with audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = isMuted;
  }, [isMuted]);
  const sectionCount = 26;

  // Slide durations in ms
  const slideDurations = [
    2800,  // 0: Hero
    3000,  // 1: Big Numbers
    3500,  // 2: Team Shakeup Intro
    4000,  // 3: RedPanda Team Formation
    3000,  // 4: Orca Introduction
    5200,  // 5: Meet the Teams
    3000,  // 6: Big Features Intro
    2300,  // 7: Self-Healing CI
    2300,  // 8: Terminal UI
    2300,  // 9: .NET + Maven
    2300,  // 10: AI Code Generation
    2300,  // 11: CPU/Memory Tracking
    2300,  // 12: Flaky Task Analytics
    2300,  // 13: Onboarding Flow
    2300,  // 14: Azure Single Tenant
    2300,  // 15: Helm Chart
    2300,  // 16: Observability
    2600,  // 17: Framework Support
    2600,  // 18: Orca Highlights
    2600,  // 19: Infrastructure Highlights
    2600,  // 20: RedPanda Highlights
    3000,  // 21: Stats Intro
    6000,  // 22: Projects Showcase (animated)
    3000,  // 23: Projects Breakdown
    4000,  // 24: Top Contributors Chart
    3000,  // 25: Closing
  ];

  // Progress bar - use ref to avoid re-renders during auto-play
  const progressRef = React.useRef(null);
  const progressIntervalRef = React.useRef(null);

  // Track section visits to re-trigger animations
  const [sectionVisits, setSectionVisits] = useState({});
  useEffect(() => {
    setSectionVisits(prev => ({
      ...prev,
      [activeSection]: (prev[activeSection] || 0) + 1
    }));
    // Update hash URL
    window.history.replaceState(null, '', `#${activeSection}`);
  }, [activeSection]);

  // Shared scroll function used by manual navigation AND auto-play
  const scrollToSection = React.useCallback((newSection, fast = false) => {
    const container = containerRef.current;
    if (!container) return;
    if (newSection < 0 || newSection >= sectionCount) return;
    if (newSection === targetSectionRef.current && animationRef.current) return;

    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    targetSectionRef.current = newSection;
    setActiveSection(newSection);

    const targetScroll = newSection * window.innerHeight;
    const startScroll = container.scrollTop;
    const distance = targetScroll - startScroll;
    const duration = fast ? 400 : 800;
    let startTime = null;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animateScroll = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      container.scrollTop = startScroll + distance * easeOutCubic(progress);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateScroll);
      } else {
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animateScroll);
  }, []);

  // Handle initial hash on load
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const section = parseInt(hash, 10);
      if (!isNaN(section) && section >= 0 && section < sectionCount) {
        targetSectionRef.current = section;
        setActiveSection(section);
        const container = containerRef.current;
        if (container) {
          container.scrollTop = section * window.innerHeight;
        }
      }
    }
  }, []);

  // Handle wheel and keyboard events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();
      setIsPlaying(false); // Pause auto-play on scroll

      const direction = e.deltaY > 0 ? 1 : -1;
      const isInterrupting = animationRef.current !== null;
      const newSection = Math.max(0, Math.min(sectionCount - 1, targetSectionRef.current + direction));
      scrollToSection(newSection, isInterrupting);
    };

    const handleKeyDown = (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(prev => !prev); // Toggle play/pause
      } else if (['ArrowDown', 'ArrowRight', 'PageDown', 'j'].includes(e.key)) {
        e.preventDefault();
        setIsPlaying(false); // Pause auto-play on key press
        const isInterrupting = animationRef.current !== null;
        const newSection = Math.min(sectionCount - 1, targetSectionRef.current + 1);
        scrollToSection(newSection, isInterrupting);
      } else if (['ArrowUp', 'ArrowLeft', 'PageUp', 'k'].includes(e.key)) {
        e.preventDefault();
        setIsPlaying(false); // Pause auto-play on key press
        const isInterrupting = animationRef.current !== null;
        const newSection = Math.max(0, targetSectionRef.current - 1);
        scrollToSection(newSection, isInterrupting);
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setIsMuted(prev => !prev);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [scrollToSection]);

  // Auto-play effect with progress bar
  useEffect(() => {
    if (!isPlaying) {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
        autoPlayRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      return;
    }

    const currentSection = targetSectionRef.current;
    if (currentSection >= sectionCount - 1) {
      setIsPlaying(false);
      return;
    }

    const duration = slideDurations[currentSection] || 4000;
    const startTime = Date.now();

    // Update progress bar directly via ref to avoid re-renders
    if (progressRef.current) {
      progressRef.current.style.width = '0%';
    }

    // Update progress bar every 50ms using DOM directly
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      if (progressRef.current) {
        progressRef.current.style.width = `${newProgress}%`;
      }
    }, 50);

    autoPlayRef.current = setTimeout(() => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      // Use the SAME scrollToSection function as manual navigation
      const newSection = targetSectionRef.current + 1;
      scrollToSection(newSection);
    }, duration);

    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, activeSection, scrollToSection]);

  return (
    <div ref={containerRef} className="bg-zinc-950 text-white h-screen overflow-hidden relative">
      {/* Background music */}
      <audio ref={audioRef} src="running-night-393139.mp3" loop />

      {/* Progress bar at top */}
      {isPlaying && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-zinc-800">
          <div
            ref={progressRef}
            className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 transition-all duration-100 ease-linear"
            style={{ width: '0%' }}
          />
        </div>
      )}

      {/* Progress dots */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
        {Array.from({ length: sectionCount }).map((_, i) => (
          <button
            key={i}
            onClick={() => {
              if (i === targetSectionRef.current) return;
              setIsPlaying(false); // Pause auto-play on dot click

              // Cancel any ongoing animation
              if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
              }

              targetSectionRef.current = i;
              setActiveSection(i);

              const container = containerRef.current;
              const targetScroll = i * window.innerHeight;
              const startScroll = container.scrollTop;
              const distance = targetScroll - startScroll;
              const duration = 800;
              let startTime = null;
              const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
              const animateScroll = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                container.scrollTop = startScroll + distance * easeOutCubic(progress);
                if (progress < 1) {
                  animationRef.current = requestAnimationFrame(animateScroll);
                } else {
                  animationRef.current = null;
                }
              };
              animationRef.current = requestAnimationFrame(animateScroll);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeSection === i ? 'bg-white scale-125' : 'bg-zinc-600 hover:bg-zinc-400'
            }`}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
        {/* Mute/Unmute button */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="flex items-center justify-center w-10 h-10 bg-zinc-800/80 hover:bg-zinc-700/80 backdrop-blur-sm rounded-full transition-all duration-300 border border-zinc-700"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12A4.5 4.5 0 0014 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          )}
        </button>

        {/* Play/Pause button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800/80 hover:bg-zinc-700/80 backdrop-blur-sm rounded-full transition-all duration-300 border border-zinc-700"
        >
          {isPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
          <span className="text-sm text-zinc-300">{isPlaying ? 'Pause' : 'Play'}</span>
        </button>
      </div>

      {/* Hero */}
      <Section className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        <div className="text-center max-w-2xl">
          <p className="text-zinc-500 uppercase tracking-[0.3em] text-sm mb-4">Nx Engineering</p>
          <h1
            className="text-6xl font-black mb-4 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #22c55e, #3b82f6, #a855f7, #22c55e)',
              backgroundSize: '200% 100%',
              animation: 'gradientShift 3s ease-in-out infinite',
            }}
          >
            2025 Wrapped
          </h1>
          <style>{`
            @keyframes gradientShift {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }
          `}</style>
          <p className="text-zinc-400 text-lg">A year of shipping, solving, and scaling.</p>
        </div>
      </Section>

      {/* Big Numbers */}
      <Section className="bg-zinc-950">
        <div className="grid grid-cols-3 gap-12 text-center max-w-4xl">
          <div>
            <p className="text-6xl font-black text-green-400">
              <AnimatedNumber value={7000} isActive={activeSection === 1} />+
            </p>
            <p className="text-zinc-500 mt-2 uppercase tracking-wider text-sm">Commits</p>
          </div>
          <div>
            <p className="text-6xl font-black text-blue-400">
              <AnimatedNumber value={80} isActive={activeSection === 1} />+
            </p>
            <p className="text-zinc-500 mt-2 uppercase tracking-wider text-sm">Projects Shipped</p>
          </div>
          <div>
            <p className="text-6xl font-black text-purple-400">
              4
            </p>
            <p className="text-zinc-500 mt-2 uppercase tracking-wider text-sm">Teams</p>
          </div>
        </div>
      </Section>

      {/* Team Shakeup Intro */}
      <Section className="bg-zinc-900">
        <div className="text-center max-w-3xl relative">
          <p className="text-zinc-400 text-sm uppercase tracking-wider mb-4">Meanwhile...</p>
          <h2 className="text-5xl font-bold mb-8">Teams Were Shuffling</h2>
          <div className="relative h-48 mb-8">
            {/* Musical chairs animation */}
            {['👨‍💻', '👩‍💻', '🧑‍💻', '👨‍💼'].map((emoji, i) => (
              <div
                key={i}
                className="absolute text-5xl"
                style={{
                  left: '50%',
                  top: '50%',
                  animation: `orbit ${3 + i * 0.5}s linear infinite`,
                  animationDelay: `${i * 0.75}s`,
                }}
              >
                {emoji}
              </div>
            ))}
            {/* Center element */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div
                className="text-6xl"
                style={{ animation: 'pulse 2s ease-in-out infinite' }}
              >
                🔀
              </div>
            </div>
            {/* Floating question marks */}
            {[...Array(6)].map((_, i) => (
              <div
                key={`q-${i}`}
                className="absolute text-2xl text-zinc-600"
                style={{
                  left: `${15 + i * 14}%`,
                  top: `${20 + (i % 2) * 60}%`,
                  animation: `float ${2 + i * 0.3}s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              >
                ?
              </div>
            ))}
          </div>
          <p className="text-zinc-400 text-lg">New teams, new missions, new energy</p>
          <style>{`
            @keyframes orbit {
              0% { transform: translate(-50%, -50%) rotate(0deg) translateX(80px) rotate(0deg); }
              100% { transform: translate(-50%, -50%) rotate(360deg) translateX(80px) rotate(-360deg); }
            }
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 0.8; }
              50% { transform: scale(1.2); opacity: 1; }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0); opacity: 0.4; }
              50% { transform: translateY(-15px); opacity: 0.7; }
            }
          `}</style>
        </div>
      </Section>

      {/* RedPanda Team Formation */}
      <Section className="bg-zinc-950">
        <div className="text-center max-w-4xl">
          <p className="text-zinc-400 text-sm uppercase tracking-wider mb-2">New in 2025</p>
          <h2 className="text-4xl font-bold mb-8">
            <span className="text-orange-400">🐼 RedPanda</span> Team Formed
          </h2>
          <div className="flex items-center justify-center gap-12 mb-8">
            <div className="text-center">
              <p className="text-zinc-500 text-sm mb-3">From CLI</p>
              <div className="flex gap-3">
                <div className="bg-zinc-800 rounded-xl p-3 border border-blue-500/30">
                  <img src="https://nx.dev/images/team/jonathan-cammisuli.avif" alt="Jon" className="w-12 h-12 rounded-full mb-2 mx-auto" />
                  <p className="text-sm font-medium">Jon</p>
                </div>
                <div className="bg-zinc-800 rounded-xl p-3 border border-blue-500/30">
                  <img src="https://nx.dev/images/team/james-henry.avif" alt="James" className="w-12 h-12 rounded-full mb-2 mx-auto" />
                  <p className="text-sm font-medium">James</p>
                </div>
              </div>
            </div>
            <div className="text-4xl text-orange-400">→</div>
            <img
              src="redpanda.png"
              alt="RedPanda team"
              className="w-64 rounded-xl shadow-2xl border border-orange-500/50"
            />
            <div className="text-4xl text-orange-400">←</div>
            <div className="text-center">
              <p className="text-zinc-500 text-sm mb-3">From Orca</p>
              <div className="flex gap-3">
                <div className="bg-zinc-800 rounded-xl p-3 border border-purple-500/30">
                  <img src="https://nx.dev/images/team/altan-stalker.avif" alt="Altan" className="w-12 h-12 rounded-full mb-2 mx-auto" />
                  <p className="text-sm font-medium">Altan</p>
                </div>
                <div className="bg-zinc-800 rounded-xl p-3 border border-purple-500/30">
                  <img src="https://nx.dev/images/team/mark-lindsey.avif" alt="Mark" className="w-12 h-12 rounded-full mb-2 mx-auto" />
                  <p className="text-sm font-medium">Mark</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-zinc-400">A new team focused on Self-Healing CI</p>
        </div>
      </Section>

      {/* Orca Introduction */}
      <Section className="bg-zinc-900">
        <div className="text-center max-w-4xl">
          <p className="text-zinc-400 text-sm uppercase tracking-wider mb-2">Also in 2025...</p>
          <h2 className="text-4xl font-bold mb-4">
            Nx Cloud became{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(90deg, #7c3aed, #c084fc, #e9d5ff, #7c3aed)',
                backgroundSize: '200% 100%',
                animation: 'gradientShift 3s ease-in-out infinite',
              }}
            >
              Orca
            </span>
          </h2>
          <p className="text-zinc-400 text-lg mb-8">A new name. The same powerful cloud CI platform.</p>
          <img
            src="orca.png"
            alt="Go Team Orca!"
            className="mx-auto max-w-lg rounded-xl shadow-2xl"
            style={{
              animation: 'float 3s ease-in-out infinite',
            }}
          />
          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
          `}</style>
        </div>
      </Section>

      {/* Meet the Teams */}
      <Section className="bg-zinc-950">
        <div className="max-w-4xl w-full">
          <h2 className="text-3xl font-bold mb-6 text-center">Meet the Teams</h2>
          <div className="grid grid-cols-2 gap-4">
            <TeamCard
              name="Infrastructure"
              lead="Steve Pentland"
              color={teamColors.infrastructure}
              delay={0}
              wiggleDelay={0}
              accomplishments={[
                'Azure & GCP single-tenant hosting',
                'Docker Layer Caching',
                'Helm Chart v1 migration',
                'Grafana observability stack',
                'SOC2 compliance & DR exercises',
                'MongoDB 7.0 upgrade',
                '...'
              ]}
              members={['Patrick Mariglia', 'Szymon']}
            />
            <TeamCard
              name="Nx CLI"
              lead="Jason Jean"
              color={teamColors.cli}
              delay={0.15}
              wiggleDelay={0.75}
              accomplishments={[
                'Terminal UI for task execution',
                'Gradle, Maven, .NET plugins',
                'Every major ecosystem release',
                'AI/MCP code generation',
                'Nx Console IDE extension',
                'Pnpm catalog support',
                '...'
              ]}
              members={['Colum Ferry', 'Leosvel Pérez', 'Jack Hsu', 'Max Kless', 'Craigory Coppola']}
            />
            <TeamCard
              name="Orca"
              lead="Nicole Oliver"
              color={teamColors.cloud}
              delay={0.3}
              wiggleDelay={1.5}
              accomplishments={[
                'Streamlined onboarding flow',
                'Agent resource usage tracking',
                'Flaky task analytics',
                'Enterprise usage UI',
                'Graph UX improvements',
                'Artifact downloads',
                '...'
              ]}
              members={['Chau Tran', 'Louie Weng', 'Rares Matei', 'Dillon']}
            />
            <TeamCard
              name="RedPanda"
              lead="Victor Savkin"
              color={teamColors.redpanda}
              delay={0.45}
              wiggleDelay={2.25}
              accomplishments={[
                'Self-Healing CI → Production',
                'GitHub, GitLab, Azure DevOps',
                'Time-to-Green analytics',
                'Polygraph conformance',
                'Enterprise customer rollouts',
                'Flaky task auto-retry',
                '...'
              ]}
              members={['Jon Cammisuli', 'James Henry', 'Altan Stalker', 'Mark Lindsey', 'Ben Cabanes']}
            />
          </div>
        </div>
      </Section>

      {/* Big Features Intro */}
      <Section className="bg-zinc-950">
        <div className="text-center max-w-2xl">
          <RocketLaunch isActive={activeSection === 6} />
          <h2 className="text-5xl font-black mb-4">Big Features</h2>
          <p className="text-zinc-400 text-xl">A few highlights from the year</p>
        </div>
      </Section>

      {/* Self-Healing CI - RedPanda */}
      <Section className="bg-zinc-900">
        <div className="text-center max-w-5xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.redpanda }} />
            <p className="text-zinc-300 uppercase tracking-wider text-sm">RedPanda</p>
          </div>
          <h2 className="text-4xl font-bold mb-4">Self-Healing CI</h2>
          <p className="text-zinc-400 text-lg mb-8">AI that fixes your failing CI automatically</p>
          <div className="flex justify-center mb-8">
            <img
              src="self-healing-ci.webp"
              alt="Self-Healing CI workflow: Submit PR → CI fails → AI fix → Verify → Approve"
              className="max-w-3xl w-full"
            />
          </div>
          <div className="flex justify-center gap-8 text-sm">
            <div className="text-zinc-400">
              <span className="text-orange-400 font-bold">GitHub</span> + GitLab + Azure DevOps
            </div>
            <div className="text-zinc-400">
              <span className="text-green-400 font-bold">Verified</span> before applying
            </div>
            <div className="text-zinc-400">
              <span className="text-purple-400 font-bold">Enterprise</span> customers live
            </div>
          </div>
        </div>
      </Section>

      {/* Terminal UI - CLI */}
      <Section className="bg-zinc-950">
        <div className="text-center max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.cli }} />
            <p className="text-zinc-300 uppercase tracking-wider text-sm">Nx CLI</p>
          </div>
          <h2 className="text-4xl font-bold mb-4">Terminal UI</h2>
          <p className="text-zinc-400 text-lg mb-8">A modern interface for running Nx tasks</p>
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-zinc-500 text-sm ml-2 font-mono">nx run-many -t e2e</span>
            </div>
            <div className="text-left font-mono text-sm space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-blue-400 font-bold">NX</span>
                <span className="text-zinc-300">Running 1 e2e task, and 5 others</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1">
                  <div className="text-zinc-500 flex items-center gap-2">
                    <span className="text-green-400">✓</span> @org/shop:build
                    <span className="text-zinc-600">28ms</span>
                  </div>
                  <div className="text-zinc-500 flex items-center gap-2">
                    <span className="text-green-400">✓</span> @org/api-products:build
                    <span className="text-zinc-600">32ms</span>
                  </div>
                  <div className="text-zinc-500 flex items-center gap-2">
                    <span className="text-green-400">✓</span> @org/api:build:production
                    <span className="text-zinc-600">4ms</span>
                  </div>
                  <div className="text-zinc-400 flex items-center gap-2">
                    <span className="text-yellow-400 animate-pulse">●</span> @org/shop-e2e:e2e
                    <span className="text-zinc-600">31.4s</span>
                  </div>
                </div>
                <div className="bg-zinc-800/50 rounded p-3 border border-zinc-700">
                  <div className="text-green-400 text-xs mb-2">✓ @org/shop:build</div>
                  <div className="text-zinc-500 text-xs">&gt; vite build</div>
                  <div className="text-zinc-400 text-xs mt-2">✓ 54 modules transformed</div>
                  <div className="text-zinc-400 text-xs">✓ built in 557ms</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-8 mt-6 text-sm">
            <div className="text-zinc-400">
              <span className="text-green-400 font-bold">Real-time</span> task output
            </div>
            <div className="text-zinc-400">
              <span className="text-blue-400 font-bold">Keyboard</span> navigation
            </div>
            <div className="text-zinc-400">
              <span className="text-purple-400 font-bold">Windows</span> support
            </div>
          </div>
        </div>
      </Section>

      {/* .NET + Maven - CLI */}
      <Section className="bg-zinc-900">
        <div className="text-center max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.cli }} />
            <p className="text-zinc-300 uppercase tracking-wider text-sm">Nx CLI</p>
          </div>
          <h2 className="text-4xl font-bold mb-4">New Ecosystems</h2>
          <p className="text-zinc-400 text-lg mb-8">Nx now supports .NET and Maven monorepos</p>
          <div className="flex justify-center gap-8">
            <div className="bg-zinc-950 rounded-xl p-8 border border-zinc-800 text-center w-52">
              <img src="dotnet-logo.png" alt=".NET" className="h-16 mx-auto mb-4 object-contain" />
              <h3 className="text-2xl font-bold mb-2">.NET Plugin</h3>
              <p className="text-zinc-400">C#, F#, VB.NET projects</p>
              <p className="text-zinc-500 text-sm mt-2">Build, test, publish</p>
            </div>
            <div className="bg-zinc-950 rounded-xl p-8 border border-zinc-800 text-center w-52">
              <img src="maven-logo.png" alt="Maven" className="h-16 mx-auto mb-4 object-contain" />
              <h3 className="text-2xl font-bold mb-2">Maven Support</h3>
              <p className="text-zinc-400">Java & Kotlin projects</p>
              <p className="text-zinc-500 text-sm mt-2">Gradle already supported</p>
            </div>
          </div>
        </div>
      </Section>

      {/* AI Code Generation - CLI */}
      <Section className="bg-zinc-950">
        <div className="text-center max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.cli }} />
            <p className="text-zinc-300 uppercase tracking-wider text-sm">Nx CLI</p>
          </div>
          <h2 className="text-4xl font-bold mb-4">AI Code Generation</h2>
          <p className="text-zinc-400 text-lg mb-8">Enhance AI tools with workspace context</p>
          <div className="bg-zinc-950 rounded-xl p-6 border border-zinc-800">
            <div className="text-left font-mono text-sm space-y-3">
              <div className="text-zinc-500"># Configure AI agents to understand your workspace</div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">$</span>
                <span className="text-zinc-300">npx nx configure-ai-agents</span>
              </div>
              <div className="text-zinc-400 pl-4 border-l-2 border-zinc-700 mt-2">
                <div>Generating workspace context for AI tools...</div>
                <div className="text-green-400">✓ Claude Code configured</div>
                <div className="text-green-400">✓ Cursor configured</div>
                <div className="text-green-400">✓ Copilot configured</div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-8 mt-6 text-sm">
            <div className="text-zinc-400">
              <span className="text-blue-400 font-bold">MCP</span> server support
            </div>
            <div className="text-zinc-400">
              <span className="text-green-400 font-bold">Context</span> for AI assistants
            </div>
            <div className="text-zinc-400">
              <span className="text-purple-400 font-bold">Smarter</span> code generation
            </div>
          </div>
        </div>
      </Section>

      {/* CPU/Memory Tracking - Orca */}
      <Section className="bg-zinc-900">
        <div className="text-center max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.cloud }} />
            <p className="text-zinc-300 uppercase tracking-wider text-sm">Orca</p>
          </div>
          <h2 className="text-4xl font-bold mb-4">Agent Resource Usage</h2>
          <p className="text-zinc-400 text-lg mb-6">Finally see what's happening inside your CI agents</p>
          <div className="flex justify-center">
            <div className="rounded-xl overflow-hidden border border-zinc-800 shadow-2xl" style={{ maxWidth: '630px' }}>
              <img
                src="agent-resource-usage.avif"
                alt="Agent Resource Usage - Memory and CPU tracking"
                className="w-full"
              />
            </div>
          </div>
          <div className="flex justify-center gap-8 mt-6 text-sm">
            <div className="text-zinc-400">
              <span className="text-pink-400 font-bold">Identify</span> OOM errors
            </div>
            <div className="text-zinc-400">
              <span className="text-cyan-400 font-bold">Optimize</span> agent sizing
            </div>
            <div className="text-zinc-400">
              <span className="text-green-400 font-bold">Debug</span> slow tasks
            </div>
          </div>
        </div>
      </Section>

      {/* Flaky Task Analytics - Orca */}
      <Section className="bg-zinc-950">
        <div className="text-center max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.cloud }} />
            <p className="text-zinc-300 uppercase tracking-wider text-sm">Orca</p>
          </div>
          <h2 className="text-4xl font-bold mb-4">Flaky Task Analytics</h2>
          <p className="text-zinc-400 text-lg mb-8">Find and fix unreliable tests before they slow you down</p>
          <div className="bg-zinc-950 rounded-xl p-6 border border-zinc-800">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-yellow-400">⚠️</span>
                  <span className="text-zinc-300">e2e-checkout.spec.ts</span>
                </div>
                <div className="text-right">
                  <span className="text-red-400 font-bold">23%</span>
                  <span className="text-zinc-500 text-sm ml-2">flake rate</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-yellow-400">⚠️</span>
                  <span className="text-zinc-300">api-integration.spec.ts</span>
                </div>
                <div className="text-right">
                  <span className="text-orange-400 font-bold">12%</span>
                  <span className="text-zinc-500 text-sm ml-2">flake rate</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span className="text-zinc-300">unit-tests.spec.ts</span>
                </div>
                <div className="text-right">
                  <span className="text-green-400 font-bold">0%</span>
                  <span className="text-zinc-500 text-sm ml-2">flake rate</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-8 mt-6 text-sm">
            <div className="text-zinc-400">
              <span className="text-yellow-400 font-bold">Track</span> flaky tests
            </div>
            <div className="text-zinc-400">
              <span className="text-blue-400 font-bold">Analyze</span> failure patterns
            </div>
            <div className="text-zinc-400">
              <span className="text-green-400 font-bold">Auto-retry</span> on failure
            </div>
          </div>
        </div>
      </Section>

      {/* Onboarding Flow - Orca */}
      <Section className="bg-zinc-900">
        <div className="text-center max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.cloud }} />
            <p className="text-zinc-300 uppercase tracking-wider text-sm">Orca</p>
          </div>
          <h2 className="text-4xl font-bold mb-4">Streamlined Onboarding</h2>
          <p className="text-zinc-400 text-lg mb-8">Connect your workspace in under a minute</p>
          <div className="flex justify-center gap-6">
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 text-center flex-1 max-w-xs">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-400 text-xl">1</span>
              </div>
              <h3 className="font-bold mb-2">Connect VCS</h3>
              <p className="text-zinc-400 text-sm">GitHub, GitLab, or Bitbucket</p>
            </div>
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 text-center flex-1 max-w-xs">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-400 text-xl">2</span>
              </div>
              <h3 className="font-bold mb-2">Select Repo</h3>
              <p className="text-zinc-400 text-sm">Auto-detect Nx workspace</p>
            </div>
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 text-center flex-1 max-w-xs">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-400 text-xl">✓</span>
              </div>
              <h3 className="font-bold mb-2">You're Live</h3>
              <p className="text-zinc-400 text-sm">Remote caching enabled</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Azure Single Tenant - Infrastructure */}
      <Section className="bg-zinc-950">
        <div className="text-center max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.infrastructure }} />
            <p className="text-zinc-300 uppercase tracking-wider text-sm">Infrastructure</p>
          </div>
          <h2 className="text-4xl font-bold mb-4">Azure Single Tenant</h2>
          <p className="text-zinc-400 text-lg mb-8">Enterprise cloud expansion for Azure customers</p>
          <div className="flex justify-center gap-8">
            <div className="bg-zinc-950 rounded-xl p-8 border border-zinc-800 text-center w-48">
              <img src="aws-logo.webp" alt="AWS" className="h-12 mx-auto mb-4 object-contain" />
              <p className="text-green-400 text-sm">Supported</p>
            </div>
            <div className="bg-zinc-950 rounded-xl p-8 border border-zinc-800 text-center w-48 ring-2 ring-green-500">
              <img src="azure-logo.png" alt="Azure" className="h-12 mx-auto mb-4 object-contain" />
              <p className="text-green-400 text-sm">New in 2025</p>
            </div>
            <div className="bg-zinc-950 rounded-xl p-8 border border-zinc-800 text-center w-48">
              <img src="gcp-logo.jpg" alt="GCP" className="h-12 mx-auto mb-4 object-contain" />
              <p className="text-green-400 text-sm">Supported</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Helm Chart v1 - Infrastructure */}
      <Section className="bg-zinc-900">
        <div className="text-center max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.infrastructure }} />
            <p className="text-zinc-300 uppercase tracking-wider text-sm">Infrastructure</p>
          </div>
          <h2 className="text-4xl font-bold mb-4">Helm Chart v1</h2>
          <p className="text-zinc-400 text-lg mb-8">Migrated multi-tenant from Kustomize to Helm</p>
          <div className="flex justify-center gap-6">
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 text-center">
              <p className="text-3xl mb-3">⎈</p>
              <h3 className="font-bold mb-1">Kustomize → Helm</h3>
              <p className="text-zinc-500 text-sm">Unified deployment model</p>
            </div>
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 text-center">
              <p className="text-3xl mb-3">🔄</p>
              <h3 className="font-bold mb-1">ArgoCD AppSets</h3>
              <p className="text-zinc-500 text-sm">GCP & AWS deployments</p>
            </div>
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 text-center">
              <p className="text-3xl mb-3">📦</p>
              <h3 className="font-bold mb-1">Single Chart</h3>
              <p className="text-zinc-500 text-sm">All components included</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Observability - Infrastructure */}
      <Section className="bg-zinc-950">
        <div className="text-center max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.infrastructure }} />
            <p className="text-zinc-300 uppercase tracking-wider text-sm">Infrastructure</p>
          </div>
          <h2 className="text-4xl font-bold mb-4">Full Observability</h2>
          <p className="text-zinc-400 text-lg mb-6">Metrics, tracing, and dashboards across the stack</p>
          <div className="flex justify-center">
            <div className="rounded-xl overflow-hidden border border-zinc-800 shadow-2xl" style={{ maxWidth: '900px' }}>
              <img
                src="grafana-dashboard.png"
                alt="Grafana dashboard showing MongoDB Atlas cluster metrics"
                className="w-full"
              />
            </div>
          </div>
          <div className="flex justify-center gap-8 mt-6 text-sm">
            <div className="text-zinc-400">
              <span className="text-green-400 font-bold">Grafana</span> dashboards
            </div>
            <div className="text-zinc-400">
              <span className="text-blue-400 font-bold">Distributed</span> tracing
            </div>
            <div className="text-zinc-400">
              <span className="text-purple-400 font-bold">Proactive</span> alerting
            </div>
          </div>
        </div>
      </Section>

      {/* Framework Support - CLI */}
      <Section className="bg-zinc-950">
        <div className="text-center max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.cli }} />
            <p className="text-zinc-300 uppercase tracking-wider text-sm">Nx CLI</p>
          </div>
          <h2
            className="text-4xl font-bold mb-8 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #1d4ed8, #60a5fa, #bfdbfe, #1d4ed8)',
              backgroundSize: '200% 100%',
              animation: 'gradientShift 3s ease-in-out infinite',
            }}
          >
            Every Major Release
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {frameworkReleases.map((fw, i) => (
              <div key={i} className="bg-zinc-800/50 rounded-xl p-4 text-center hover:bg-zinc-800 transition-colors border border-zinc-700/50">
                <span className="text-2xl mb-2 block">{fw.icon}</span>
                <p className="text-sm font-medium">{fw.name}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Orca Highlights */}
      <Section className="bg-zinc-900">
        <div className="text-center max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.cloud }} />
            <p className="text-zinc-300 uppercase tracking-wider text-sm">Orca</p>
          </div>
          <h2
            className="text-4xl font-bold mb-8 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #7c3aed, #c084fc, #e9d5ff, #7c3aed)',
              backgroundSize: '200% 100%',
              animation: 'gradientShift 3s ease-in-out infinite',
            }}
          >
            Smarter & Easier to Use
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {cloudHighlights.map((item, i) => (
              <div key={i} className="bg-zinc-800/50 rounded-xl p-4 text-center hover:bg-zinc-800 transition-colors border border-zinc-700/50">
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <p className="text-sm font-medium">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Infrastructure Highlights */}
      <Section className="bg-zinc-950">
        <div className="text-center max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.infrastructure }} />
            <p className="text-zinc-300 uppercase tracking-wider text-sm">Infrastructure</p>
          </div>
          <h2
            className="text-4xl font-bold mb-8 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #64748b, #e2e8f0, #ffffff, #64748b)',
              backgroundSize: '200% 100%',
              animation: 'gradientShift 3s ease-in-out infinite',
            }}
          >
            Any Cloud • Any Scale • Always On
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {infraHighlights.map((item, i) => (
              <div key={i} className="bg-zinc-800/50 rounded-xl p-4 text-center hover:bg-zinc-800 transition-colors border border-zinc-700/50">
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <p className="text-sm font-medium">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* RedPanda Highlights */}
      <Section className="bg-zinc-900">
        <div className="text-center max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.redpanda }} />
            <p className="text-zinc-300 uppercase tracking-wider text-sm">RedPanda</p>
          </div>
          <h2
            className="text-4xl font-bold mb-8 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #15803d, #4ade80, #bbf7d0, #15803d)',
              backgroundSize: '200% 100%',
              animation: 'gradientShift 3s ease-in-out infinite',
            }}
          >
            Get to Green PRs Faster
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {redpandaHighlights.map((item, i) => (
              <div key={i} className="bg-zinc-800/50 rounded-xl p-4 text-center hover:bg-zinc-800 transition-colors border border-zinc-700/50">
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <p className="text-sm font-medium">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Stats Intro */}
      <Section className="bg-zinc-950 relative overflow-hidden">
        <NumbersRain isActive={activeSection === 21} />
        <div className="text-center max-w-2xl relative z-10">
          <p className="text-6xl mb-6">📊</p>
          <h2 className="text-5xl font-black mb-4">By the Numbers</h2>
          <p className="text-zinc-400 text-xl">Let's count it up</p>
        </div>
      </Section>

      {/* Projects Showcase */}
      <Section className="bg-zinc-900">
        <ProjectsShowcase isActive={activeSection === 22} />
      </Section>

      {/* Projects Breakdown */}
      <Section className="bg-zinc-950">
        <div className="max-w-4xl w-full">
          <h2 className="text-4xl font-bold mb-8 text-center">Projects by Team</h2>
          <div className="flex items-center justify-center gap-12">
            <div style={{ width: 250, height: 250 }}>
              {activeSection === 23 && (
                <ResponsiveContainer width={250} height={250}>
                  <PieChart>
                    <Pie
                      data={projectData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      isAnimationActive={true}
                      animationBegin={0}
                      animationDuration={800}
                    >
                      {projectData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="space-y-3">
              {projectData.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                  <span className="text-zinc-300 w-28">{item.name}</span>
                  <span className="text-2xl font-bold">{item.value}+</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Top Contributors Chart */}
      <Section className="bg-zinc-900">
        <div className="w-full max-w-3xl">
          <p className="text-zinc-300 uppercase tracking-wider text-sm mb-2 text-center">Everyone's Contributions</p>
          <h2 className="text-4xl font-bold mb-2 text-center">Commit Volume</h2>
          <p className="text-zinc-500 text-sm mb-8 text-center">Commits aren't everything—but we sure shipped a lot of code</p>
          <div style={{ height: 500 }}>
            {activeSection === 24 && (
              <ResponsiveContainer width="100%" height={500}>
                <BarChart data={commitData} layout="vertical" margin={{ left: 20, right: 40 }}>
                  <XAxis type="number" scale="log" domain={[50, 2000]} hide />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 12 }} width={90} />
                  <Bar dataKey="commits" radius={[0, 8, 8, 0]} isAnimationActive={true} animationBegin={0} animationDuration={800}>
                    {commitData.map((entry, index) => (
                      <Cell key={index} fill={teamColors[entry.team]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {Object.entries(teamColors).map(([team, color]) => (
              <div key={team} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-zinc-400 text-sm capitalize">{team === 'redpanda' ? 'RedPanda' : team === 'cli' ? 'CLI' : team === 'cloud' ? 'Orca' : 'Infra'}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Closing */}
      <Section className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        <div className="text-center max-w-4xl">
          <h2 className="text-5xl font-black mb-6">Thanks for everything.</h2>
          <div className="flex flex-col gap-8 mb-8">
            <div className="flex justify-center gap-3">
              {teamPhotos.slice(0, 12).map((person, i) => (
                <div key={i} className="group relative hover:z-10">
                  <img
                    src={person.photo}
                    alt={person.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-zinc-700 hover:border-zinc-400 transition-all hover:scale-110"
                  />
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs text-zinc-400 pointer-events-none">
                    {person.name}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-3">
              {teamPhotos.slice(12).map((person, i) => (
                <div key={i} className="group relative hover:z-10">
                  <img
                    src={person.photo}
                    alt={person.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-zinc-700 hover:border-zinc-400 transition-all hover:scale-110"
                  />
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs text-zinc-400 pointer-events-none">
                    {person.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-zinc-400 text-xl mb-8">See you in 2026.</p>
          <div className="flex justify-center gap-2">
            {Object.values(teamColors).map((color, i) => (
              <div key={i} className="w-16 h-2 rounded-full" style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
