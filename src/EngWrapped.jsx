import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import {
  teamColors, commitData, projectData, frameworkReleases,
  cloudHighlights, infraHighlights, redpandaHighlights, slideDurations, sectionCount
} from './data';
import {
  RocketLaunch, NumbersRain, ProjectsShowcase, teamPhotos,
  AnimatedNumber, AnimatedTeamCount, Section, TeamCard
} from './components';
import './keyframes.css';

export default function EngWrapped() {
  const [activeSection, setActiveSection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = React.useRef(null);
  const animationRef = React.useRef(null);
  const targetSectionRef = React.useRef(0);
  const autoPlayRef = React.useRef(null);
  const audioRef = React.useRef(null);
  const pendingPlayRef = React.useRef(false);

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

    // Handle pending play after loop-back scroll completes
    if (pendingPlayRef.current && activeSection === 0) {
      pendingPlayRef.current = false;
      setIsPlaying(true);
    }
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
        // If on last section and not playing, loop back to beginning
        if (!isPlaying && targetSectionRef.current >= sectionCount - 1) {
          pendingPlayRef.current = true;
          scrollToSection(0);
        } else {
          setIsPlaying(prev => !prev);
        }
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
      } else if (e.key >= '1' && e.key <= '8') {
        e.preventDefault();
        setIsPlaying(false);
        const targetSection = parseInt(e.key) - 1; // 1 -> 0, 2 -> 1, etc.
        scrollToSection(targetSection, true);
      } else if (e.key === '9') {
        e.preventDefault();
        setIsPlaying(false);
        scrollToSection(sectionCount - 1, true); // Go to last section
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [scrollToSection, isPlaying]);

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
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center transition-all duration-500 ${activeSection === 0 ? 'gap-20' : 'gap-2'}`}>
        {/* Mute/Unmute button */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`flex items-center justify-center w-10 h-10 bg-zinc-800/80 hover:bg-zinc-700/80 backdrop-blur-sm rounded-full transition-all duration-500 border border-zinc-700 ${activeSection === 0 ? 'scale-[2]' : 'scale-100'}`}
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
          onClick={() => {
            if (!isPlaying && activeSection >= sectionCount - 1) {
              // If on last section and pressing play, loop back to first section
              pendingPlayRef.current = true;
              scrollToSection(0);
            } else {
              setIsPlaying(!isPlaying);
            }
          }}
          className={`flex items-center gap-2 px-4 py-2 bg-zinc-800/80 hover:bg-zinc-700/80 backdrop-blur-sm rounded-full transition-all duration-500 border border-zinc-700 ${activeSection === 0 ? 'scale-[2]' : 'scale-100'} ${!isPlaying ? 'animate-pulse-glow' : ''}`}
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
          
          <p className="text-zinc-400 text-lg">A year of shipping, solving, and scaling.</p>
        </div>
      </Section>

      {/* Big Numbers */}
      <Section className="bg-zinc-950">
        <div className="flex justify-center text-center">
          <div
            className="transform mr-16"
            style={{
              animation: activeSection === 1 ? 'bounceIn 0.6s ease-out 0s both, snakeFloat1 3s ease-in-out 0.6s infinite' : 'none',
            }}
          >
            <p className="text-5xl font-black text-green-400">
              <AnimatedNumber value={7000} isActive={activeSection === 1} />+
            </p>
            <p className="text-zinc-500 mt-2 uppercase tracking-wider text-sm">Commits</p>
          </div>
          <div
            className="transform mr-20"
            style={{
              animation: activeSection === 1 ? 'bounceIn 0.6s ease-out 0.15s both, snakeFloat2 3s ease-in-out 0.6s infinite' : 'none',
            }}
          >
            <p className="text-5xl font-black text-cyan-400">
              <AnimatedNumber value={4454661} isActive={activeSection === 1} />
            </p>
            <p className="text-zinc-500 mt-2 uppercase tracking-wider text-sm">LOC Changed</p>
          </div>
          <div
            className="transform mr-10"
            style={{
              animation: activeSection === 1 ? 'bounceIn 0.6s ease-out 0.3s both, snakeFloat1 3s ease-in-out 0.6s infinite' : 'none',
            }}
          >
            <p className="text-5xl font-black text-blue-400">
              <AnimatedNumber value={80} isActive={activeSection === 1} />+
            </p>
            <p className="text-zinc-500 mt-2 uppercase tracking-wider text-sm">Projects Shipped</p>
          </div>
          <div
            className="transform"
            style={{
              animation: activeSection === 1 ? 'bounceIn 0.6s ease-out 0.45s both, snakeFloat2 3s ease-in-out 0.6s infinite' : 'none',
            }}
          >
            <p className="text-5xl font-black text-purple-400">
              <AnimatedTeamCount isActive={activeSection === 1} />
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
          
        </div>
      </Section>

      {/* RedPanda Team Formation */}
      <Section className="bg-zinc-950">
        <div className="text-center max-w-4xl">
          <p
            className="text-zinc-400 text-sm uppercase tracking-wider mb-2"
            style={{ animation: activeSection === 3 ? 'fadeInDown 0.5s ease-out both' : 'none' }}
          >New in 2025</p>
          <h2
            className="text-4xl font-bold mb-8"
            style={{ animation: activeSection === 3 ? 'fadeInDown 0.5s ease-out 0.1s both' : 'none' }}
          >
            <span className="text-orange-400">🐼 RedPanda</span> Team Formed
          </h2>
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="flex items-center justify-center gap-8">
              <div
                className="text-center flex-shrink-0"
                style={{ animation: activeSection === 3 ? 'slideInLeft 0.6s ease-out 0.2s both' : 'none' }}
              >
                <p className="text-zinc-500 text-sm mb-3">From Nx CLI</p>
                <div className="flex gap-3">
                  <div
                    className="bg-zinc-800 rounded-xl p-3 border border-blue-500/30"
                    style={{ animation: activeSection === 3 ? 'personPop 0.4s ease-out 0.4s both' : 'none' }}
                  >
                    <img src="https://nx.dev/images/team/jonathan-cammisuli.avif" alt="Jon" className="w-12 h-12 rounded-full mb-2 mx-auto object-cover" />
                    <p className="text-sm font-medium">Jon</p>
                  </div>
                  <div
                    className="bg-zinc-800 rounded-xl p-3 border border-blue-500/30"
                    style={{ animation: activeSection === 3 ? 'personPop 0.4s ease-out 0.5s both' : 'none' }}
                  >
                    <img src="https://nx.dev/images/team/james-henry.avif" alt="James" className="w-12 h-12 rounded-full mb-2 mx-auto object-cover" />
                    <p className="text-sm font-medium">James</p>
                  </div>
                </div>
              </div>
              <div
                className="text-4xl text-orange-400 flex-shrink-0"
                style={{ animation: activeSection === 3 ? 'arrowPulse 0.5s ease-out 0.6s both, arrowBounce 1s ease-in-out 1.1s infinite' : 'none' }}
              >→</div>
              <img
                src="redpanda.png"
                alt="RedPanda team"
                className="w-72 rounded-xl shadow-2xl border border-orange-500/50 flex-shrink-0"
                style={{ animation: activeSection === 3 ? 'centerPop 0.6s ease-out 0.3s both, glowPulse 2s ease-in-out 0.9s infinite' : 'none' }}
              />
              <div
                className="text-4xl text-orange-400 flex-shrink-0"
                style={{ animation: activeSection === 3 ? 'arrowPulse 0.5s ease-out 0.6s both, arrowBounce 1s ease-in-out 1.1s infinite' : 'none' }}
              >←</div>
              <div
                className="text-center flex-shrink-0"
                style={{ animation: activeSection === 3 ? 'slideInRight 0.6s ease-out 0.2s both' : 'none' }}
              >
                <p className="text-zinc-500 text-sm mb-3">From Nx Cloud</p>
                <div className="flex gap-3">
                  <div
                    className="bg-zinc-800 rounded-xl p-3 border border-purple-500/30"
                    style={{ animation: activeSection === 3 ? 'personPop 0.4s ease-out 0.4s both' : 'none' }}
                  >
                    <img src="https://nx.dev/images/team/altan-stalker.avif" alt="Altan" className="w-12 h-12 rounded-full mb-2 mx-auto object-cover" />
                    <p className="text-sm font-medium">Altan</p>
                  </div>
                  <div
                    className="bg-zinc-800 rounded-xl p-3 border border-purple-500/30"
                    style={{ animation: activeSection === 3 ? 'personPop 0.4s ease-out 0.5s both' : 'none' }}
                  >
                    <img src="https://nx.dev/images/team/mark-lindsey.avif" alt="Mark" className="w-12 h-12 rounded-full mb-2 mx-auto object-cover" />
                    <p className="text-sm font-medium">Mark</p>
                  </div>
                  <div
                    className="bg-zinc-800 rounded-xl p-3 border border-purple-500/30"
                    style={{ animation: activeSection === 3 ? 'personPop 0.4s ease-out 0.6s both' : 'none' }}
                  >
                    <img src="https://nx.dev/images/team/benjamin-cabanes.avif" alt="Ben" className="w-12 h-12 rounded-full mb-2 mx-auto object-cover" />
                    <p className="text-sm font-medium">Ben</p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="text-4xl text-orange-400"
              style={{ animation: activeSection === 3 ? 'arrowPulse 0.5s ease-out 0.7s both, arrowBounceVertical 1s ease-in-out 1.2s infinite' : 'none' }}
            >↑</div>
            <div
              className="text-center"
              style={{ animation: activeSection === 3 ? 'slideInUp 0.6s ease-out 0.3s both' : 'none' }}
            >
              <div
                className="bg-zinc-800 rounded-xl p-3 border border-orange-500/30"
                style={{ animation: activeSection === 3 ? 'personPop 0.4s ease-out 0.8s both' : 'none' }}
              >
                <img src="https://nx.dev/images/team/victor-savkin.avif" alt="Victor" className="w-12 h-12 rounded-full mb-2 mx-auto" />
                <p className="text-sm font-medium">Victor</p>
              </div>
              <p className="text-zinc-500 text-sm mt-2">Leading the charge</p>
            </div>
          </div>
          <p
            className="text-zinc-400"
            style={{ animation: activeSection === 3 ? 'fadeInUp 0.5s ease-out 0.9s both' : 'none' }}
          >A new team focused on Self-Healing CI</p>
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
          
        </div>
      </Section>

      {/* Meet the Teams */}
      <Section className="bg-zinc-950">
        <div className="max-w-5xl w-full">
          <h2
            className="text-3xl font-bold mb-8 text-center"
            style={{ animation: activeSection === 5 ? 'titleReveal 0.6s ease-out both' : 'none' }}
          >Meet the Teams</h2>
          <div className="grid grid-cols-2 gap-6">
            {/* Infrastructure */}
            <div
              className="bg-zinc-900 rounded-2xl p-5 border-l-4 hover:scale-[1.02] transition-transform"
              style={{
                borderColor: teamColors.infrastructure,
                animation: activeSection === 5 ? 'cardFlipIn 0.5s ease-out 0.1s both' : 'none',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: teamColors.infrastructure,
                    animation: activeSection === 5 ? 'dotPing 0.4s ease-out 0.4s both' : 'none'
                  }}
                />
                <h3 className="text-lg font-bold">Infrastructure</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  { name: 'Steve', photo: 'https://nx.dev/images/team/steve-pentland.avif' },
                  { name: 'Patrick', photo: 'https://nx.dev/images/team/patrick-mariglia.avif' },
                  { name: 'Szymon', photo: 'https://nx.dev/images/team/szymon-wojciechowski.avif' },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center"
                    style={{ animation: activeSection === 5 ? `photoPopIn 0.4s ease-out ${0.5 + i * 0.1}s both` : 'none' }}
                  >
                    <img src={p.photo} alt={p.name} className="w-12 h-12 rounded-full object-cover border-2 border-zinc-700 hover:border-green-500 transition-colors" />
                    <span className="text-xs text-zinc-400 mt-1">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nx CLI */}
            <div
              className="bg-zinc-900 rounded-2xl p-5 border-l-4 hover:scale-[1.02] transition-transform"
              style={{
                borderColor: teamColors.cli,
                animation: activeSection === 5 ? 'cardFlipIn 0.5s ease-out 0.2s both' : 'none',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: teamColors.cli,
                    animation: activeSection === 5 ? 'dotPing 0.4s ease-out 0.5s both' : 'none'
                  }}
                />
                <h3 className="text-lg font-bold">Nx CLI</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  { name: 'Jason', photo: 'https://nx.dev/images/team/jason-jean.avif' },
                  { name: 'Colum', photo: 'https://nx.dev/images/team/colum-ferry.avif' },
                  { name: 'Leosvel', photo: 'https://nx.dev/images/team/leosvel-perez-espinosa.avif' },
                  { name: 'Jack', photo: 'https://nx.dev/images/team/jack-hsu.avif' },
                  { name: 'Max', photo: 'https://nx.dev/images/team/max-kless.avif' },
                  { name: 'Craigory', photo: 'https://nx.dev/images/team/craigory-coppola.avif' },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center"
                    style={{ animation: activeSection === 5 ? `photoPopIn 0.4s ease-out ${0.6 + i * 0.08}s both` : 'none' }}
                  >
                    <img src={p.photo} alt={p.name} className="w-12 h-12 rounded-full object-cover border-2 border-zinc-700 hover:border-blue-500 transition-colors" />
                    <span className="text-xs text-zinc-400 mt-1">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Orca */}
            <div
              className="bg-zinc-900 rounded-2xl p-5 border-l-4 hover:scale-[1.02] transition-transform"
              style={{
                borderColor: teamColors.cloud,
                animation: activeSection === 5 ? 'cardFlipIn 0.5s ease-out 0.3s both' : 'none',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: teamColors.cloud,
                    animation: activeSection === 5 ? 'dotPing 0.4s ease-out 0.6s both' : 'none'
                  }}
                />
                <h3 className="text-lg font-bold">Orca</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  { name: 'Nicole', photo: 'https://nx.dev/images/team/nicole-oliver.avif' },
                  { name: 'Chau', photo: 'https://nx.dev/images/team/chau-tran.avif' },
                  { name: 'Louie', photo: 'https://nx.dev/images/team/louie-weng.avif' },
                  { name: 'Rares', photo: 'https://nx.dev/images/team/rares-matei.avif' },
                  { name: 'Dillon', photo: 'https://nx.dev/images/team/dillon-chanis.avif' },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center"
                    style={{ animation: activeSection === 5 ? `photoPopIn 0.4s ease-out ${0.7 + i * 0.08}s both` : 'none' }}
                  >
                    <img src={p.photo} alt={p.name} className="w-12 h-12 rounded-full object-cover border-2 border-zinc-700 hover:border-purple-500 transition-colors" />
                    <span className="text-xs text-zinc-400 mt-1">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RedPanda */}
            <div
              className="bg-zinc-900 rounded-2xl p-5 border-l-4 hover:scale-[1.02] transition-transform"
              style={{
                borderColor: teamColors.redpanda,
                animation: activeSection === 5 ? 'cardFlipIn 0.5s ease-out 0.4s both' : 'none',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: teamColors.redpanda,
                    animation: activeSection === 5 ? 'dotPing 0.4s ease-out 0.7s both' : 'none'
                  }}
                />
                <h3 className="text-lg font-bold">RedPanda</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  { name: 'Victor', photo: 'https://nx.dev/images/team/victor-savkin.avif' },
                  { name: 'Jon', photo: 'https://nx.dev/images/team/jonathan-cammisuli.avif' },
                  { name: 'James', photo: 'https://nx.dev/images/team/james-henry.avif' },
                  { name: 'Altan', photo: 'https://nx.dev/images/team/altan-stalker.avif' },
                  { name: 'Mark', photo: 'https://nx.dev/images/team/mark-lindsey.avif' },
                  { name: 'Ben', photo: 'https://nx.dev/images/team/benjamin-cabanes.avif' },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center"
                    style={{ animation: activeSection === 5 ? `photoPopIn 0.4s ease-out ${0.8 + i * 0.08}s both` : 'none' }}
                  >
                    <img src={p.photo} alt={p.name} className="w-12 h-12 rounded-full object-cover border-2 border-zinc-700 hover:border-orange-500 transition-colors" />
                    <span className="text-xs text-zinc-400 mt-1">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Documentation */}
            <div
              className="bg-zinc-900 rounded-2xl p-5 border-l-4 hover:scale-[1.02] transition-transform col-span-2 justify-self-center w-1/2"
              style={{
                borderColor: teamColors.docs,
                animation: activeSection === 5 ? 'cardFlipIn 0.5s ease-out 1.7s both' : 'none',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: teamColors.docs,
                    animation: activeSection === 5 ? 'dotPing 0.4s ease-out 2.0s both' : 'none'
                  }}
                />
                <h3 className="text-lg font-bold">Documentation</h3>
                <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">part-time</span>
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                {[
                  { name: 'Jack', photo: 'https://nx.dev/images/team/jack-hsu.avif' },
                  { name: 'Caleb', photo: 'https://nx.dev/images/team/caleb-ukle.avif' },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center"
                    style={{ animation: activeSection === 5 ? `photoPopIn 0.4s ease-out ${2.1 + i * 0.1}s both` : 'none' }}
                  >
                    <img src={p.photo} alt={p.name} className="w-12 h-12 rounded-full object-cover border-2 border-zinc-700 hover:border-pink-500 transition-colors" />
                    <span className="text-xs text-zinc-400 mt-1">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
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
          <h2
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #f97316, #4ade80, #86efac, #f97316)',
              backgroundSize: '200% 100%',
              animation: 'gradientShift 3s ease-in-out infinite',
            }}
          >AI-Powered Self-Healing CI</h2>
          <p className="text-zinc-400 text-lg mb-8">Get to green faster with automatic fixes</p>
          <div
            className="flex justify-center mb-8"
            style={{ animation: activeSection === 7 ? 'healingImageZoom 0.6s ease-out 0.1s both' : 'none' }}
          >
            <img
              src="self-healing-ci.webp"
              alt="Self-Healing CI workflow: Submit PR → CI fails → AI fix → Verify → Approve"
              className="max-w-3xl w-full rounded-xl"
              style={{ animation: activeSection === 7 ? 'healingGlow 2s ease-in-out 0.5s infinite' : 'none' }}
            />
          </div>
          <div className="flex justify-center gap-8 text-sm">
            <div className="text-zinc-400" style={{ animation: activeSection === 7 ? 'healingBadge 0.4s ease-out 0.6s both' : 'none' }}>
              <span className="text-orange-400 font-bold">GitHub</span> + GitLab + Azure DevOps
            </div>
            <div className="text-zinc-400" style={{ animation: activeSection === 7 ? 'healingBadge 0.4s ease-out 0.8s both' : 'none' }}>
              <span className="text-green-400 font-bold">Verified</span> before applying
            </div>
            <div className="text-zinc-400" style={{ animation: activeSection === 7 ? 'healingBadge 0.4s ease-out 1.0s both' : 'none' }}>
              <span className="text-purple-400 font-bold">Enterprise</span> customers live
            </div>
          </div>
          <p className="text-zinc-500 text-sm mt-6">Jon • James • Victor • Ben • Altan</p>
        </div>
        
      </Section>

      {/* Terminal UI - CLI */}
      <Section className="bg-zinc-950">
        <div className="text-center max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.cli }} />
            <p className="text-zinc-300 uppercase tracking-wider text-sm">Nx CLI</p>
          </div>
          <h2
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #3b82f6, #60a5fa, #93c5fd, #3b82f6)',
              backgroundSize: '200% 100%',
              animation: 'gradientShift 3s ease-in-out infinite',
            }}
          >Terminal UI</h2>
          <p className="text-zinc-400 text-lg mb-8">A modern interface for running Nx tasks</p>
          <div
            className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-2xl"
            style={{ animation: activeSection === 8 ? 'terminalWindowPop 0.5s ease-out 0.1s both' : 'none' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" style={{ animation: activeSection === 8 ? 'terminalDot 0.3s ease-out 0.3s both' : 'none' }} />
              <div className="w-3 h-3 rounded-full bg-yellow-500" style={{ animation: activeSection === 8 ? 'terminalDot 0.3s ease-out 0.4s both' : 'none' }} />
              <div className="w-3 h-3 rounded-full bg-green-500" style={{ animation: activeSection === 8 ? 'terminalDot 0.3s ease-out 0.5s both' : 'none' }} />
              <span className="text-zinc-500 text-sm ml-2 font-mono" style={{ animation: activeSection === 8 ? 'terminalType 0.6s ease-out 0.6s both' : 'none' }}>nx run-many -t e2e</span>
            </div>
            <div className="text-left font-mono text-sm space-y-2">
              <div className="flex items-center gap-3" style={{ animation: activeSection === 8 ? 'terminalLine 0.4s ease-out 0.8s both' : 'none' }}>
                <span className="text-blue-400 font-bold">NX</span>
                <span className="text-zinc-300">Running 1 e2e task, and 5 others</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1">
                  <div className="text-zinc-500 flex items-center gap-2" style={{ animation: activeSection === 8 ? 'terminalLine 0.3s ease-out 1.0s both' : 'none' }}>
                    <span className="text-green-400">✓</span> @org/shop:build
                    <span className="text-zinc-600">28ms</span>
                  </div>
                  <div className="text-zinc-500 flex items-center gap-2" style={{ animation: activeSection === 8 ? 'terminalLine 0.3s ease-out 1.1s both' : 'none' }}>
                    <span className="text-green-400">✓</span> @org/api-products:build
                    <span className="text-zinc-600">32ms</span>
                  </div>
                  <div className="text-zinc-500 flex items-center gap-2" style={{ animation: activeSection === 8 ? 'terminalLine 0.3s ease-out 1.2s both' : 'none' }}>
                    <span className="text-green-400">✓</span> @org/api:build:production
                    <span className="text-zinc-600">4ms</span>
                  </div>
                  <div className="text-zinc-400 flex items-center gap-2" style={{ animation: activeSection === 8 ? 'terminalLine 0.3s ease-out 1.3s both' : 'none' }}>
                    <span className="text-yellow-400 animate-pulse">●</span> @org/shop-e2e:e2e
                    <span className="text-zinc-600">31.4s</span>
                  </div>
                </div>
                <div className="bg-zinc-800/50 rounded p-3 border border-zinc-700" style={{ animation: activeSection === 8 ? 'terminalPanelSlide 0.5s ease-out 1.0s both' : 'none' }}>
                  <div className="text-green-400 text-xs mb-2">✓ @org/shop:build</div>
                  <div className="text-zinc-500 text-xs">&gt; vite build</div>
                  <div className="text-zinc-400 text-xs mt-2">✓ 54 modules transformed</div>
                  <div className="text-zinc-400 text-xs">✓ built in 557ms</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-8 mt-6 text-sm">
            <div className="text-zinc-400" style={{ animation: activeSection === 8 ? 'terminalBadge 0.3s ease-out 0.6s both' : 'none' }}>
              <span className="text-green-400 font-bold">Real-time</span> task output
            </div>
            <div className="text-zinc-400" style={{ animation: activeSection === 8 ? 'terminalBadge 0.3s ease-out 0.7s both' : 'none' }}>
              <span className="text-blue-400 font-bold">Keyboard</span> navigation
            </div>
            <div className="text-zinc-400" style={{ animation: activeSection === 8 ? 'terminalBadge 0.3s ease-out 0.8s both' : 'none' }}>
              <span className="text-purple-400 font-bold">Windows</span> support
            </div>
          </div>
          <p className="text-zinc-500 text-sm mt-6">Craigory • James • Leosvel • Jason</p>
        </div>
        
      </Section>

      {/* Migrate UI - CLI */}
      <Section className="bg-zinc-950">
        <div className="text-center max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.cli }} />
            <p className="text-zinc-300 uppercase tracking-wider text-sm">Nx CLI</p>
          </div>
          <h2
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #3b82f6, #60a5fa, #93c5fd, #3b82f6)',
              backgroundSize: '200% 100%',
              animation: 'gradientShift 3s ease-in-out infinite',
            }}
          >Migrate UI</h2>
          <p className="text-zinc-400 text-lg mb-8">Visual migrations in Nx Console</p>
          <div className="flex justify-center gap-4">
            <img
              src="https://img.youtube.com/vi/5xe9ziAV3zg/maxresdefault.jpg"
              alt="Migrate UI video thumbnail"
              className="w-1/2 rounded-xl border border-zinc-800 shadow-2xl"
              style={{ animation: activeSection === 9 ? 'migrateImagePop 0.5s ease-out 0.1s both' : 'none' }}
            />
            <img
              src="migrate-ui-approve.avif"
              alt="Migrate UI approve screen"
              className="w-1/2 rounded-xl border border-zinc-800 shadow-2xl"
              style={{ animation: activeSection === 9 ? 'migrateImagePop 0.5s ease-out 0.3s both' : 'none' }}
            />
          </div>
          <div className="flex justify-center gap-8 mt-6 text-sm">
            <div className="text-zinc-400" style={{ animation: activeSection === 9 ? 'migrateBadge 0.3s ease-out 0.5s both' : 'none' }}>
              <span className="text-blue-400 font-bold">Step-by-step</span> control
            </div>
            <div className="text-zinc-400" style={{ animation: activeSection === 9 ? 'migrateBadge 0.3s ease-out 0.6s both' : 'none' }}>
              <span className="text-green-400 font-bold">File changes</span> preview
            </div>
            <div className="text-zinc-400" style={{ animation: activeSection === 9 ? 'migrateBadge 0.3s ease-out 0.7s both' : 'none' }}>
              <span className="text-purple-400 font-bold">Squash</span> or preserve
            </div>
          </div>
          <p className="text-zinc-500 text-sm mt-6">Max • Jack</p>
        </div>
        
      </Section>

      {/* Improved Nx Graph - Orca */}
      <Section className="bg-zinc-950">
        <div className="text-center max-w-5xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.cloud }} />
            <p className="text-zinc-300 uppercase tracking-wider text-sm">Orca</p>
          </div>
          <h2
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #a855f7, #c084fc, #e879f9, #a855f7)',
              backgroundSize: '200% 100%',
              animation: 'gradientShift 3s ease-in-out infinite',
            }}
          >Improved Nx Graph</h2>
          <p className="text-zinc-400 text-lg mb-8">Handles repos of any size + enterprise visualization</p>
          <div className="flex justify-center gap-4 items-stretch">
            <div className="w-1/2 flex flex-col">
              <div
                className="flex-1 rounded-xl border border-zinc-800 shadow-2xl overflow-hidden"
                style={{ animation: activeSection === 10 ? 'graphSlideLeft 0.5s ease-out 0.1s both' : 'none' }}
              >
                <img
                  src="new-graph.avif"
                  alt="Nx Graph in CLI/Console"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <p className="text-zinc-500 text-xs mt-2">Composite mode in Nx Console</p>
            </div>
            <div className="w-1/2 flex flex-col">
              <div
                className="flex-1 rounded-xl border border-zinc-800 shadow-2xl overflow-hidden"
                style={{ animation: activeSection === 10 ? 'graphSlideRight 0.5s ease-out 0.3s both' : 'none' }}
              >
                <img
                  src="workspace-graph.avif"
                  alt="Polygraph Enterprise Visualization"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <p className="text-zinc-500 text-xs mt-2">Polygraph cross-repo view</p>
            </div>
          </div>
          <div className="flex justify-center gap-8 mt-6 text-sm">
            <div className="text-zinc-400" style={{ animation: activeSection === 10 ? 'graphBadge 0.3s ease-out 0.5s both' : 'none' }}>
              <span className="text-purple-400 font-bold">Composite</span> rendering
            </div>
            <div className="text-zinc-400" style={{ animation: activeSection === 10 ? 'graphBadge 0.3s ease-out 0.6s both' : 'none' }}>
              <span className="text-blue-400 font-bold">Cross-repo</span> visibility
            </div>
            <div className="text-zinc-400" style={{ animation: activeSection === 10 ? 'graphBadge 0.3s ease-out 0.7s both' : 'none' }}>
              <span className="text-green-400 font-bold">Impact</span> analysis
            </div>
          </div>
          <p className="text-zinc-500 text-sm mt-6">Chau</p>
        </div>
        
      </Section>

      {/* Continuous Tasks - CLI/Cloud */}
      <Section className="bg-zinc-950">
        <div className="text-center max-w-5xl">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.cli }} />
              <p className="text-zinc-300 uppercase tracking-wider text-sm">Nx CLI</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.cloud }} />
              <p className="text-zinc-300 uppercase tracking-wider text-sm">Orca</p>
            </div>
          </div>
          <h2
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #3b82f6, #a855f7, #c084fc, #3b82f6)',
              backgroundSize: '200% 100%',
              animation: 'gradientShift 3s ease-in-out infinite',
            }}
          >Continuous Tasks</h2>
          <p className="text-zinc-400 text-lg mb-8">Chain tasks that depend on long-running processes</p>
          <div className="flex justify-center gap-6 mb-6">
            <img
              src="https://img.youtube.com/vi/AD51BKJtDBk/maxresdefault.jpg"
              alt="Continuous Tasks in Nx 21"
              className="w-1/2 rounded-xl border border-zinc-800"
              style={{ animation: activeSection === 11 ? 'contVideoSlide 0.5s ease-out 0.1s both' : 'none' }}
            />
            <div
              className="w-1/2 bg-zinc-900 rounded-xl p-5 border border-zinc-800 text-left font-mono text-sm"
              style={{ animation: activeSection === 11 ? 'contCodeSlide 0.5s ease-out 0.3s both' : 'none' }}
            >
              <div className="text-zinc-500 mb-2" style={{ animation: activeSection === 11 ? 'contCodeLine 0.3s ease-out 0.5s both' : 'none' }}>// e2e → frontend → backend</div>
              <div className="text-zinc-300" style={{ animation: activeSection === 11 ? 'contCodeLine 0.3s ease-out 0.6s both' : 'none' }}>{`"backend": { `}<span className="text-green-400">"continuous": true</span>{` },`}</div>
              <div className="text-zinc-300 mt-2" style={{ animation: activeSection === 11 ? 'contCodeLine 0.3s ease-out 0.7s both' : 'none' }}>{`"frontend": {`}</div>
              <div className="text-zinc-300 pl-4" style={{ animation: activeSection === 11 ? 'contCodeLine 0.3s ease-out 0.8s both' : 'none' }}><span className="text-green-400">"continuous": true</span>,</div>
              <div className="text-zinc-300 pl-4" style={{ animation: activeSection === 11 ? 'contCodeLine 0.3s ease-out 0.9s both' : 'none' }}>{`"dependsOn": [`}<span className="text-cyan-400">"backend"</span>{`]`}</div>
              <div className="text-zinc-300" style={{ animation: activeSection === 11 ? 'contCodeLine 0.3s ease-out 1.0s both' : 'none' }}>{`},`}</div>
              <div className="text-zinc-300 mt-2" style={{ animation: activeSection === 11 ? 'contCodeLine 0.3s ease-out 1.1s both' : 'none' }}>{`"e2e": {`}</div>
              <div className="text-zinc-300 pl-4" style={{ animation: activeSection === 11 ? 'contCodeLine 0.3s ease-out 1.2s both' : 'none' }}>{`"dependsOn": [`}<span className="text-cyan-400">"frontend"</span>{`]`}</div>
              <div className="text-zinc-300" style={{ animation: activeSection === 11 ? 'contCodeLine 0.3s ease-out 1.3s both' : 'none' }}>{`}`}</div>
            </div>
          </div>
          <div className="flex justify-center gap-8 text-sm">
            <div className="text-zinc-400" style={{ animation: activeSection === 11 ? 'contBadge 0.3s ease-out 0.6s both' : 'none' }}>
              <span className="text-green-400 font-bold">Chains</span> of dependencies
            </div>
            <div className="text-zinc-400" style={{ animation: activeSection === 11 ? 'contBadge 0.3s ease-out 0.7s both' : 'none' }}>
              <span className="text-blue-400 font-bold">Waits</span> for ready signal
            </div>
            <div className="text-zinc-400" style={{ animation: activeSection === 11 ? 'contBadge 0.3s ease-out 0.8s both' : 'none' }}>
              <span className="text-purple-400 font-bold">Cleans up</span> on completion
            </div>
          </div>
          <p className="text-zinc-500 text-sm mt-6">Jason • Altan • Leosvel • Craigory</p>
        </div>
        
      </Section>

      {/* .NET + Maven - CLI */}
      <Section className="bg-zinc-900">
        <div className="text-center max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.cli }} />
            <p className="text-zinc-300 uppercase tracking-wider text-sm">Nx CLI</p>
          </div>
          <h2
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #3b82f6, #60a5fa, #93c5fd, #3b82f6)',
              backgroundSize: '200% 100%',
              animation: 'gradientShift 3s ease-in-out infinite',
            }}
          >New Ecosystems</h2>
          <p className="text-zinc-400 text-lg mb-8">Nx now supports .NET and Maven monorepos</p>
          <div className="flex justify-center gap-8">
            <div
              className="bg-zinc-950 rounded-xl p-8 border border-zinc-800 text-center w-52"
              style={{ animation: activeSection === 12 ? 'cardSlideUp 0.5s ease-out 0.1s both' : 'none' }}
            >
              <img
                src="dotnet-logo.png"
                alt=".NET"
                className="h-16 mx-auto mb-4 object-contain"
                style={{ animation: activeSection === 12 ? 'logoBounce 0.6s ease-out 0.3s both' : 'none' }}
              />
              <p className="text-zinc-400">C#, F#, VB.NET projects</p>
              <p className="text-zinc-500 text-sm mt-2">Build, test, publish</p>
            </div>
            <div
              className="bg-zinc-950 rounded-xl p-8 border border-zinc-800 text-center w-52"
              style={{ animation: activeSection === 12 ? 'cardSlideUp 0.5s ease-out 0.25s both' : 'none' }}
            >
              <img
                src="maven-logo.png"
                alt="Maven"
                className="h-16 mx-auto mb-4 object-contain invert brightness-200"
                style={{ animation: activeSection === 12 ? 'logoBounce 0.6s ease-out 0.45s both' : 'none' }}
              />
              <p className="text-zinc-400">Java & Kotlin projects</p>
              <p className="text-zinc-500 text-sm mt-2">Gradle already supported</p>
            </div>
          </div>
          <p className="text-zinc-500 text-sm mt-6">Craigory • Jason • Louie • Max</p>
        </div>
        
      </Section>

      {/* AI Code Generation - CLI */}
      <Section className="bg-zinc-950">
        <div className="text-center max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.cli }} />
            <p className="text-zinc-300 uppercase tracking-wider text-sm">Nx CLI</p>
          </div>
          <h2
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #3b82f6, #22d3ee, #67e8f9, #3b82f6)',
              backgroundSize: '200% 100%',
              animation: 'gradientShift 3s ease-in-out infinite',
            }}
          >AI Code Generation</h2>
          <p className="text-zinc-400 text-lg mb-8">Enhance AI tools with workspace context</p>
          <div
            className="bg-zinc-950 rounded-xl p-6 border border-zinc-800"
            style={{ animation: activeSection === 13 ? 'terminalSlideIn 0.5s ease-out 0.1s both' : 'none' }}
          >
            <div className="text-left font-mono text-sm space-y-3">
              <div className="text-zinc-500"># Configure AI agents to understand your workspace</div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">$</span>
                <span
                  className="text-zinc-300"
                  style={{ animation: activeSection === 13 ? 'typeCommand 0.8s steps(24) 0.4s both' : 'none' }}
                >npx nx configure-ai-agents</span>
              </div>
              <div className="text-zinc-400 pl-4 border-l-2 border-zinc-700 mt-2">
                <div style={{ animation: activeSection === 13 ? 'outputFade 0.3s ease-out 0.9s both' : 'none' }}>Generating workspace context for AI tools...</div>
                <div className="text-green-400" style={{ animation: activeSection === 13 ? 'checkPop 0.4s ease-out 1.2s both' : 'none' }}>✓ Claude Code configured</div>
                <div className="text-green-400" style={{ animation: activeSection === 13 ? 'checkPop 0.4s ease-out 1.4s both' : 'none' }}>✓ Cursor configured</div>
                <div className="text-green-400" style={{ animation: activeSection === 13 ? 'checkPop 0.4s ease-out 1.6s both' : 'none' }}>✓ Copilot configured</div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-8 mt-6 text-sm">
            <div className="text-zinc-400" style={{ animation: activeSection === 13 ? 'badgeFade 0.3s ease-out 0.6s both' : 'none' }}>
              <span className="text-blue-400 font-bold">MCP</span> server support
            </div>
            <div className="text-zinc-400" style={{ animation: activeSection === 13 ? 'badgeFade 0.3s ease-out 0.7s both' : 'none' }}>
              <span className="text-green-400 font-bold">Context</span> for AI assistants
            </div>
            <div className="text-zinc-400" style={{ animation: activeSection === 13 ? 'badgeFade 0.3s ease-out 0.8s both' : 'none' }}>
              <span className="text-purple-400 font-bold">Smarter</span> code generation
            </div>
          </div>
          <p className="text-zinc-500 text-sm mt-6">Max</p>
        </div>
        
      </Section>

      {/* CPU/Memory Tracking - Orca */}
      <Section className="bg-zinc-900">
        <div className="text-center max-w-4xl">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.cloud }} />
              <p className="text-zinc-300 uppercase tracking-wider text-sm">Orca</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.cli }} />
              <p className="text-zinc-300 uppercase tracking-wider text-sm">Nx CLI</p>
            </div>
          </div>
          <h2
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #a855f7, #3b82f6, #60a5fa, #a855f7)',
              backgroundSize: '200% 100%',
              animation: 'gradientShift 3s ease-in-out infinite',
            }}
          >Agent Resource Usage</h2>
          <p className="text-zinc-400 text-lg mb-6">Finally see what's happening inside your CI agents</p>
          <div className="flex justify-center items-stretch gap-6">
            <div
              className="rounded-xl overflow-hidden border border-zinc-800 shadow-2xl"
              style={{
                maxWidth: '480px',
                animation: activeSection === 14 ? 'slideFromLeft 0.6s ease-out 0.1s both, dashboardGlow 2s ease-in-out 0.7s infinite' : 'none',
              }}
            >
              <img
                src="agent-resource-usage.avif"
                alt="Agent Resource Usage - Memory and CPU tracking"
                className="w-full"
              />
            </div>
            <div
              className="rounded-xl overflow-hidden border border-zinc-800 shadow-2xl bg-white flex items-center"
              style={{
                maxWidth: '480px',
                animation: activeSection === 14 ? 'slideFromRight 0.6s ease-out 0.3s both, dashboardGlowCyan 2s ease-in-out 0.9s infinite' : 'none',
              }}
            >
              <img
                src="usage.png"
                alt="Agent Resource Usage - Detailed view"
                className="w-full"
              />
            </div>
          </div>
          <div className="flex justify-center gap-8 mt-6 text-sm">
            <div className="text-zinc-400" style={{ animation: activeSection === 14 ? 'metricSlide 0.4s ease-out 0.5s both' : 'none' }}>
              <span className="text-pink-400 font-bold">Identify</span> OOM errors
            </div>
            <div className="text-zinc-400" style={{ animation: activeSection === 14 ? 'metricSlide 0.4s ease-out 0.7s both' : 'none' }}>
              <span className="text-cyan-400 font-bold">Optimize</span> agent sizing
            </div>
            <div className="text-zinc-400" style={{ animation: activeSection === 14 ? 'metricSlide 0.4s ease-out 0.9s both' : 'none' }}>
              <span className="text-green-400 font-bold">Debug</span> slow tasks
            </div>
          </div>
          <p className="text-zinc-500 text-sm mt-6">Leosvel • Chau • Louie</p>
        </div>
        
      </Section>

      {/* Flaky Task Analytics - Orca */}
      <Section className="bg-zinc-950">
        <div className="text-center max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.cloud }} />
            <p className="text-zinc-300 uppercase tracking-wider text-sm">Orca</p>
          </div>
          <h2
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #a855f7, #c084fc, #e9d5ff, #a855f7)',
              backgroundSize: '200% 100%',
              animation: 'gradientShift 3s ease-in-out infinite',
            }}
          >Flaky Task Analytics</h2>
          <p className="text-zinc-400 text-lg mb-8">Find and fix unreliable tests before they slow you down</p>
          <div
            className="bg-zinc-950 rounded-xl p-6 border border-zinc-800"
            style={{ animation: activeSection === 15 ? 'listContainerFade 0.4s ease-out 0.1s both' : 'none' }}
          >
            <div className="space-y-4">
              <div
                className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg"
                style={{ animation: activeSection === 15 ? 'flakeRowSlide 0.5s ease-out 0.2s both' : 'none' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-yellow-400" style={{ animation: activeSection === 15 ? 'warningPulse 0.6s ease-out 0.4s both' : 'none' }}>⚠️</span>
                  <span className="text-zinc-300">e2e-checkout.spec.ts</span>
                </div>
                <div className="text-right">
                  <span className="text-red-400 font-bold" style={{ animation: activeSection === 15 ? 'percentPop 0.4s ease-out 0.5s both' : 'none' }}>23%</span>
                  <span className="text-zinc-500 text-sm ml-2">flake rate</span>
                </div>
              </div>
              <div
                className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg"
                style={{ animation: activeSection === 15 ? 'flakeRowSlide 0.5s ease-out 0.4s both' : 'none' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-yellow-400" style={{ animation: activeSection === 15 ? 'warningPulse 0.6s ease-out 0.6s both' : 'none' }}>⚠️</span>
                  <span className="text-zinc-300">api-integration.spec.ts</span>
                </div>
                <div className="text-right">
                  <span className="text-orange-400 font-bold" style={{ animation: activeSection === 15 ? 'percentPop 0.4s ease-out 0.7s both' : 'none' }}>12%</span>
                  <span className="text-zinc-500 text-sm ml-2">flake rate</span>
                </div>
              </div>
              <div
                className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg"
                style={{ animation: activeSection === 15 ? 'flakeRowSlide 0.5s ease-out 0.6s both' : 'none' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-green-400" style={{ animation: activeSection === 15 ? 'checkBounce 0.5s ease-out 0.8s both' : 'none' }}>✓</span>
                  <span className="text-zinc-300">unit-tests.spec.ts</span>
                </div>
                <div className="text-right">
                  <span className="text-green-400 font-bold" style={{ animation: activeSection === 15 ? 'percentPop 0.4s ease-out 0.9s both' : 'none' }}>0%</span>
                  <span className="text-zinc-500 text-sm ml-2">flake rate</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-8 mt-6 text-sm">
            <div className="text-zinc-400" style={{ animation: activeSection === 15 ? 'featureFade 0.3s ease-out 0.5s both' : 'none' }}>
              <span className="text-yellow-400 font-bold">Track</span> flaky tests
            </div>
            <div className="text-zinc-400" style={{ animation: activeSection === 15 ? 'featureFade 0.3s ease-out 0.6s both' : 'none' }}>
              <span className="text-blue-400 font-bold">Analyze</span> failure patterns
            </div>
            <div className="text-zinc-400" style={{ animation: activeSection === 15 ? 'featureFade 0.3s ease-out 0.7s both' : 'none' }}>
              <span className="text-green-400 font-bold">Auto-retry</span> on failure
            </div>
          </div>
          <p className="text-zinc-500 text-sm mt-6">Dillon • Nicole • Louie</p>
        </div>
        
      </Section>

      {/* Onboarding Flow - Orca */}
      <Section className="bg-zinc-900">
        <div className="text-center max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.cloud }} />
            <p className="text-zinc-300 uppercase tracking-wider text-sm">Orca</p>
          </div>
          <h2
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #a855f7, #c084fc, #e9d5ff, #a855f7)',
              backgroundSize: '200% 100%',
              animation: 'gradientShift 3s ease-in-out infinite',
            }}
          >Streamlined Onboarding</h2>
          <p className="text-zinc-400 text-lg mb-8">Connect your workspace in under a minute</p>
          <div className="flex justify-center gap-6 relative">
            {/* Connecting line animation */}
            <div
              className="absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-purple-500 via-purple-400 to-green-500"
              style={{
                animation: activeSection === 16 ? 'lineGrow 1s ease-out 0.5s both' : 'none',
                transformOrigin: 'left',
              }}
            />
            <div
              className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 text-center flex-1 max-w-xs"
              style={{ animation: activeSection === 16 ? 'stepSlideIn 0.5s ease-out 0.1s both' : 'none' }}
            >
              <div
                className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ animation: activeSection === 16 ? 'numberPop 0.4s ease-out 0.3s both' : 'none' }}
              >
                <span className="text-purple-400 text-xl">1</span>
              </div>
              <h3 className="font-bold mb-2">Connect VCS</h3>
              <p className="text-zinc-400 text-sm">GitHub, GitLab, or Bitbucket</p>
            </div>
            <div
              className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 text-center flex-1 max-w-xs"
              style={{ animation: activeSection === 16 ? 'stepSlideIn 0.5s ease-out 0.3s both' : 'none' }}
            >
              <div
                className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ animation: activeSection === 16 ? 'numberPop 0.4s ease-out 0.5s both' : 'none' }}
              >
                <span className="text-purple-400 text-xl">2</span>
              </div>
              <h3 className="font-bold mb-2">Select Repo</h3>
              <p className="text-zinc-400 text-sm">Auto-detect Nx workspace</p>
            </div>
            <div
              className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 text-center flex-1 max-w-xs"
              style={{ animation: activeSection === 16 ? 'stepSlideIn 0.5s ease-out 0.5s both' : 'none' }}
            >
              <div
                className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ animation: activeSection === 16 ? 'checkmarkPop 0.5s ease-out 0.7s both' : 'none' }}
              >
                <span className="text-green-400 text-xl">✓</span>
              </div>
              <h3 className="font-bold mb-2">You're Live</h3>
              <p className="text-zinc-400 text-sm">Remote caching enabled</p>
            </div>
          </div>
          <p className="text-zinc-500 text-sm mt-6">Nicole • Dillon • Mark • Chau</p>
        </div>
        
      </Section>

      {/* Azure Single Tenant - Infrastructure */}
      <Section className="bg-zinc-950">
        <div className="text-center max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.infrastructure }} />
            <p className="text-zinc-300 uppercase tracking-wider text-sm">Infrastructure</p>
          </div>
          <h2
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #64748b, #94a3b8, #e2e8f0, #64748b)',
              backgroundSize: '200% 100%',
              animation: 'gradientShift 3s ease-in-out infinite',
            }}
          >Azure Single Tenant</h2>
          <p className="text-zinc-400 text-lg mb-8">Enterprise cloud expansion for Azure customers</p>
          <div className="flex justify-center gap-8">
            <div
              className="bg-zinc-950 rounded-xl p-8 border border-zinc-800 text-center w-48"
              style={{ animation: activeSection === 17 ? 'cloudFloat 0.6s ease-out 0.1s both' : 'none' }}
            >
              <img src="aws-logo.webp" alt="AWS" className="h-12 mx-auto mb-4 object-contain" />
              <p className="text-green-400 text-sm">Supported</p>
            </div>
            <div
              className="bg-zinc-950 rounded-xl p-8 border border-zinc-800 text-center w-48 ring-2 ring-green-500"
              style={{ animation: activeSection === 17 ? 'cloudFloat 0.6s ease-out 0.2s both, azurePulse 2s ease-in-out 0.8s infinite' : 'none' }}
            >
              <img src="azure-logo.png" alt="Azure" className="h-12 mx-auto mb-4 object-contain" />
              <p className="text-green-400 text-sm">New in 2025</p>
            </div>
            <div
              className="bg-zinc-950 rounded-xl p-8 border border-zinc-800 text-center w-48"
              style={{ animation: activeSection === 17 ? 'cloudFloat 0.6s ease-out 0.3s both' : 'none' }}
            >
              <img src="gcp-logo.jpg" alt="GCP" className="h-12 mx-auto mb-4 object-contain" />
              <p className="text-green-400 text-sm">Supported</p>
            </div>
          </div>
          <p className="text-zinc-500 text-sm mt-6">Steve</p>
        </div>
        
      </Section>

      {/* Helm Chart v1 - Infrastructure */}
      <Section className="bg-zinc-900">
        <div className="text-center max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.infrastructure }} />
            <p className="text-zinc-300 uppercase tracking-wider text-sm">Infrastructure</p>
          </div>
          <h2
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #64748b, #94a3b8, #e2e8f0, #64748b)',
              backgroundSize: '200% 100%',
              animation: 'gradientShift 3s ease-in-out infinite',
            }}
          >Helm Chart v1</h2>
          <p className="text-zinc-400 text-lg mb-8">Migrated multi-tenant from Kustomize to Helm</p>
          <div className="flex justify-center gap-6">
            <div
              className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 text-center"
              style={{ animation: activeSection === 18 ? 'helmSpin 0.6s ease-out 0.1s both' : 'none' }}
            >
              <p className="text-3xl mb-3" style={{ animation: activeSection === 18 ? 'iconRotate 0.8s ease-out 0.3s both' : 'none' }}>⎈</p>
              <h3 className="font-bold mb-1">Kustomize → Helm</h3>
              <p className="text-zinc-500 text-sm">Unified deployment model</p>
            </div>
            <div
              className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 text-center"
              style={{ animation: activeSection === 18 ? 'helmSpin 0.6s ease-out 0.2s both' : 'none' }}
            >
              <p className="text-3xl mb-3" style={{ animation: activeSection === 18 ? 'iconRotate 0.8s ease-out 0.4s both' : 'none' }}>🔄</p>
              <h3 className="font-bold mb-1">ArgoCD AppSets</h3>
              <p className="text-zinc-500 text-sm">GCP & AWS deployments</p>
            </div>
            <div
              className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 text-center"
              style={{ animation: activeSection === 18 ? 'helmSpin 0.6s ease-out 0.3s both' : 'none' }}
            >
              <p className="text-3xl mb-3" style={{ animation: activeSection === 18 ? 'iconRotate 0.8s ease-out 0.5s both' : 'none' }}>📦</p>
              <h3 className="font-bold mb-1">Single Chart</h3>
              <p className="text-zinc-500 text-sm">All components included</p>
            </div>
          </div>
          <p className="text-zinc-500 text-sm mt-6">Szymon</p>
        </div>
        
      </Section>

      {/* Observability - Infrastructure */}
      <Section className="bg-zinc-950">
        <div className="text-center max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.infrastructure }} />
            <p className="text-zinc-300 uppercase tracking-wider text-sm">Infrastructure</p>
          </div>
          <h2
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #64748b, #94a3b8, #e2e8f0, #64748b)',
              backgroundSize: '200% 100%',
              animation: 'gradientShift 3s ease-in-out infinite',
            }}
          >Full Observability</h2>
          <p className="text-zinc-400 text-lg mb-6">Metrics, tracing, and dashboards across the stack</p>
          <div className="flex justify-center">
            <div
              className="rounded-xl overflow-hidden border border-zinc-800 shadow-2xl"
              style={{
                maxWidth: '900px',
                animation: activeSection === 19 ? 'dashboardReveal 0.8s ease-out 0.2s both' : 'none'
              }}
            >
              <img
                src="grafana-dashboard.png"
                alt="Grafana dashboard showing MongoDB Atlas cluster metrics"
                className="w-full"
              />
            </div>
          </div>
          <div className="flex justify-center gap-8 mt-6 text-sm">
            <div className="text-zinc-400" style={{ animation: activeSection === 19 ? 'tagFadeIn 0.4s ease-out 0.6s both' : 'none' }}>
              <span className="text-green-400 font-bold">Grafana</span> dashboards
            </div>
            <div className="text-zinc-400" style={{ animation: activeSection === 19 ? 'tagFadeIn 0.4s ease-out 0.7s both' : 'none' }}>
              <span className="text-blue-400 font-bold">Distributed</span> tracing
            </div>
            <div className="text-zinc-400" style={{ animation: activeSection === 19 ? 'tagFadeIn 0.4s ease-out 0.8s both' : 'none' }}>
              <span className="text-purple-400 font-bold">Proactive</span> alerting
            </div>
          </div>
          <p className="text-zinc-500 text-sm mt-6">Patrick • Steve</p>
        </div>
        
      </Section>

      {/* Docker + Nx Release - CLI */}
      <Section className="bg-zinc-900">
        <div className="text-center max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.cli }} />
            <p className="text-zinc-300 uppercase tracking-wider text-sm">Nx CLI</p>
          </div>
          <h2
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #3b82f6, #60a5fa, #93c5fd, #3b82f6)',
              backgroundSize: '200% 100%',
              animation: 'gradientShift 3s ease-in-out infinite',
            }}
          >Docker + Nx Release</h2>
          <p className="text-zinc-400 text-lg mb-8">From build to deploy, all in one workflow</p>
          <div className="flex justify-center gap-6">
            <div
              className="bg-zinc-950 rounded-xl p-6 border border-zinc-800 text-center flex-1 max-w-xs"
              style={{ animation: activeSection === 20 ? 'dockerSlide 0.5s ease-out 0.1s both' : 'none' }}
            >
              <p className="text-4xl mb-4" style={{ animation: activeSection === 20 ? 'iconWobble 0.6s ease-out 0.3s both' : 'none' }}>🐳</p>
              <h3 className="font-bold mb-2">Docker Plugin</h3>
              <p className="text-zinc-400 text-sm">Build and push container images</p>
              <p className="text-zinc-500 text-xs mt-2">Inferred targets • Multi-stage builds</p>
            </div>
            <div
              className="bg-zinc-950 rounded-xl p-6 border border-zinc-800 text-center flex-1 max-w-xs"
              style={{ animation: activeSection === 20 ? 'dockerSlide 0.5s ease-out 0.25s both' : 'none' }}
            >
              <p className="text-4xl mb-4" style={{ animation: activeSection === 20 ? 'iconWobble 0.6s ease-out 0.45s both' : 'none' }}>📦</p>
              <h3 className="font-bold mb-2">Nx Release</h3>
              <p className="text-zinc-400 text-sm">Versioning, changelogs, publishing</p>
              <p className="text-zinc-500 text-xs mt-2">GitLab releases • Monorepo-aware</p>
            </div>
          </div>
          <p className="text-zinc-500 text-sm mt-6">Colum • James</p>
        </div>
        
      </Section>

      {/* GitHub Templates - CLI + Cloud */}
      <Section className="bg-zinc-900">
        <div className="text-center max-w-5xl">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.cli }} />
              <p className="text-zinc-300 uppercase tracking-wider text-sm">Nx CLI</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.cloud }} />
              <p className="text-zinc-300 uppercase tracking-wider text-sm">Orca</p>
            </div>
          </div>
          <h2
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #3b82f6, #a855f7, #c084fc, #3b82f6)',
              backgroundSize: '200% 100%',
              animation: 'gradientShift 3s ease-in-out infinite',
            }}
          >GitHub Template Onboarding</h2>
          <p className="text-zinc-400 text-lg mb-8">Same great starting points in CLI and Cloud</p>
          <div className="flex justify-center gap-6">
            <div
              className="flex-1 bg-zinc-950 rounded-xl p-6 border border-zinc-800"
              style={{ animation: activeSection === 21 ? 'panelSlideLeft 0.5s ease-out 0.1s both' : 'none' }}
            >
              <p className="text-zinc-400 text-sm mb-3 font-medium">create-nx-workspace</p>
              <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm text-left">
                <div className="text-zinc-400" style={{ animation: activeSection === 21 ? 'typeIn 0.3s ease-out 0.4s both' : 'none' }}>? Which starter do you want to use? …</div>
                <div className="text-yellow-300 underline" style={{ animation: activeSection === 21 ? 'typeIn 0.3s ease-out 0.5s both' : 'none' }}>TypeScript</div>
                <div className="text-zinc-500" style={{ animation: activeSection === 21 ? 'typeIn 0.3s ease-out 0.55s both' : 'none' }}>NPM Packages</div>
                <div className="text-zinc-500" style={{ animation: activeSection === 21 ? 'typeIn 0.3s ease-out 0.6s both' : 'none' }}>React</div>
                <div className="text-zinc-500" style={{ animation: activeSection === 21 ? 'typeIn 0.3s ease-out 0.65s both' : 'none' }}>Angular</div>
                <div className="text-zinc-500" style={{ animation: activeSection === 21 ? 'typeIn 0.3s ease-out 0.7s both' : 'none' }}>Custom</div>
              </div>
            </div>
            <div
              className="flex-1 rounded-xl border border-zinc-800 overflow-hidden"
              style={{ animation: activeSection === 21 ? 'panelSlideRight 0.5s ease-out 0.2s both' : 'none' }}
            >
              <p className="text-zinc-400 text-sm py-3 font-medium bg-zinc-950">Nx Cloud UI</p>
              <img
                src="cloud-templates.png"
                alt="Nx Cloud template selection UI"
                className="w-full"
              />
            </div>
          </div>
          <p className="text-zinc-500 text-sm mt-6">Jack • Nicole • Colum • Dillon</p>
        </div>
        
      </Section>

      {/* Node 24 - CLI */}
      <Section className="bg-zinc-950">
        <div className="text-center max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.cli }} />
            <p className="text-zinc-300 uppercase tracking-wider text-sm">Nx CLI</p>
          </div>
          <h2
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #22c55e, #4ade80, #86efac, #22c55e)',
              backgroundSize: '200% 100%',
              animation: 'gradientShift 3s ease-in-out infinite',
            }}
          >Node 24 LTS Support</h2>
          <p className="text-zinc-400 text-lg mb-8">Ready when Node 24 entered LTS</p>
          <div className="flex justify-center gap-6">
            <div
              className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 flex-1 max-w-xs"
              style={{ animation: activeSection === 22 ? 'nodePopIn 0.5s ease-out 0.1s both' : 'none' }}
            >
              <p className="text-4xl mb-3" style={{ animation: activeSection === 22 ? 'nodePulse 0.6s ease-out 0.3s both' : 'none' }}>💚</p>
              <h3 className="text-lg font-bold mb-2">Node 24 LTS</h3>
              <p className="text-zinc-400 text-sm">Full compatibility testing</p>
              <p className="text-zinc-400 text-sm">across all Nx plugins</p>
            </div>
            <div
              className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 flex-1 max-w-xs"
              style={{ animation: activeSection === 22 ? 'nodePopIn 0.5s ease-out 0.25s both' : 'none' }}
            >
              <p className="text-4xl mb-3" style={{ animation: activeSection === 22 ? 'nodePulse 0.6s ease-out 0.45s both' : 'none' }}>🔷</p>
              <h3 className="text-lg font-bold mb-2">TypeScript Native</h3>
              <p className="text-zinc-400 text-sm">Compatible with Node's</p>
              <p className="text-zinc-400 text-sm">type stripping (22.12+)</p>
            </div>
          </div>
          <p className="text-zinc-500 text-sm mt-6">Jack</p>
        </div>
        
      </Section>

      {/* Nx & Ocean CI Stability - Cloud/Infra */}
      <Section className="bg-zinc-950">
        <div className="text-center max-w-4xl">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.cloud }} />
              <p className="text-zinc-300 uppercase tracking-wider text-sm">Orca</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.infrastructure }} />
              <p className="text-zinc-300 uppercase tracking-wider text-sm">Infrastructure</p>
            </div>
          </div>
          <h2
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #a855f7, #64748b, #94a3b8, #a855f7)',
              backgroundSize: '200% 100%',
              animation: 'gradientShift 3s ease-in-out infinite',
            }}
          >Nx & Ocean CI Stability</h2>
          <p className="text-zinc-400 text-lg mb-8">Making our own CI rock solid</p>
          <div className="flex justify-center gap-6">
            <div
              className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 text-center flex-1 max-w-xs"
              style={{ animation: activeSection === 23 ? 'stabilitySlide 0.5s ease-out 0.1s both' : 'none' }}
            >
              <p className="text-4xl mb-4" style={{ animation: activeSection === 23 ? 'shieldPulse 0.8s ease-out 0.3s both' : 'none' }}>🛡️</p>
              <h3 className="font-bold mb-2">Nx CI Stability</h3>
              <p className="text-zinc-400 text-sm">Reliable builds for the</p>
              <p className="text-zinc-400 text-sm">nrwl/nx monorepo</p>
            </div>
            <div
              className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 text-center flex-1 max-w-xs"
              style={{ animation: activeSection === 23 ? 'stabilitySlide 0.5s ease-out 0.25s both' : 'none' }}
            >
              <p className="text-4xl mb-4" style={{ animation: activeSection === 23 ? 'shieldPulse 0.8s ease-out 0.45s both' : 'none' }}>🐋</p>
              <h3 className="font-bold mb-2">Ocean CI Stability</h3>
              <p className="text-zinc-400 text-sm">Keeping Nx Cloud's own</p>
              <p className="text-zinc-400 text-sm">workspace green</p>
            </div>
          </div>
          <p className="text-zinc-500 text-sm mt-6">Rares</p>
        </div>
        
      </Section>

      {/* Docs Migration to Astro Starlight - Docs */}
      <Section className="bg-zinc-900">
        <div className="text-center max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors.docs }} />
            <p className="text-zinc-300 uppercase tracking-wider text-sm">Documentation</p>
          </div>
          <h2
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #ec4899, #f472b6, #fbcfe8, #ec4899)',
              backgroundSize: '200% 100%',
              animation: 'gradientShift 3s ease-in-out infinite',
            }}
          >Docs Migration to Astro Starlight</h2>
          <p className="text-zinc-400 text-lg mb-8">Better authoring experience, more standard tooling</p>
          <div className="flex justify-center gap-6">
            <div className="bg-zinc-950 rounded-xl p-6 border border-zinc-800 text-center flex-1 max-w-xs">
              <p className="text-4xl mb-4">✍️</p>
              <h3 className="font-bold mb-2">Better Authoring</h3>
              <p className="text-zinc-400 text-sm">Markdown-first experience</p>
              <p className="text-zinc-400 text-sm">with modern tooling</p>
            </div>
            <div className="bg-zinc-950 rounded-xl p-6 border border-zinc-800 text-center flex-1 max-w-xs">
              <p className="text-4xl mb-4">⭐</p>
              <h3 className="font-bold mb-2">Starlight Framework</h3>
              <p className="text-zinc-400 text-sm">Industry-standard docs</p>
              <p className="text-zinc-400 text-sm">built on Astro</p>
            </div>
            <div className="bg-zinc-950 rounded-xl p-6 border border-zinc-800 text-center flex-1 max-w-xs">
              <p className="text-4xl mb-4">🚀</p>
              <h3 className="font-bold mb-2">Faster & Lighter</h3>
              <p className="text-zinc-400 text-sm">Static-first architecture</p>
              <p className="text-zinc-400 text-sm">for blazing speed</p>
            </div>
          </div>
          <p className="text-zinc-500 text-sm mt-6">Jack • Caleb</p>
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
            Every Major Ecosystem Release
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {frameworkReleases.map((fw, i) => (
              <div
                key={i}
                className="bg-zinc-800/50 rounded-xl p-4 text-center hover:bg-zinc-800 hover:scale-105 transition-all border border-zinc-700/50"
                style={{
                  animation: activeSection === 25 ? `gridItemPop 0.4s ease-out ${0.1 + i * 0.08}s both` : 'none',
                }}
              >
                <span
                  className="text-2xl mb-2 block"
                  style={{ animation: activeSection === 25 ? `iconBounce 0.5s ease-out ${0.3 + i * 0.08}s both` : 'none' }}
                >{fw.icon}</span>
                <p className="text-sm font-medium">{fw.name}</p>
              </div>
            ))}
          </div>
          <p className="text-zinc-500 text-sm mt-6">Colum • Leosvel</p>
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
            Smarter, Easier & More Experimentation
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {cloudHighlights.map((item, i) => (
              <div
                key={i}
                className="bg-zinc-800/50 rounded-xl p-4 text-center hover:bg-zinc-800 hover:scale-105 transition-all border border-zinc-700/50"
                style={{
                  animation: activeSection === 26 ? `orcaGridPop 0.4s ease-out ${0.1 + i * 0.08}s both` : 'none',
                }}
              >
                <span
                  className="text-2xl mb-2 block"
                  style={{ animation: activeSection === 26 ? `orcaIconWiggle 0.6s ease-out ${0.3 + i * 0.08}s both` : 'none' }}
                >{item.icon}</span>
                <p className="text-sm font-medium">{item.name}</p>
              </div>
            ))}
          </div>
          <p className="text-zinc-500 text-sm mt-6">Nicole • Chau • Louie • Dillon</p>
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
              <div
                key={i}
                className="bg-zinc-800/50 rounded-xl p-4 text-center hover:bg-zinc-800 hover:scale-105 transition-all border border-zinc-700/50"
                style={{
                  animation: activeSection === 27 ? `infraSlideUp 0.5s ease-out ${0.1 + i * 0.07}s both` : 'none',
                }}
              >
                <span
                  className="text-2xl mb-2 block"
                  style={{ animation: activeSection === 27 ? `infraIconGrow 0.4s ease-out ${0.25 + i * 0.07}s both` : 'none' }}
                >{item.icon}</span>
                <p className="text-sm font-medium">{item.name}</p>
              </div>
            ))}
          </div>
          <p className="text-zinc-500 text-sm mt-6">Steve • Patrick • Szymon</p>
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
              <div
                key={i}
                className="bg-zinc-800/50 rounded-xl p-4 text-center hover:bg-zinc-800 hover:scale-105 transition-all border border-zinc-700/50"
                style={{
                  animation: activeSection === 28 ? `pandaFlipIn 0.5s ease-out ${0.1 + i * 0.1}s both` : 'none',
                }}
              >
                <span
                  className="text-2xl mb-2 block"
                  style={{ animation: activeSection === 28 ? `pandaIconSpin 0.6s ease-out ${0.3 + i * 0.1}s both` : 'none' }}
                >{item.icon}</span>
                <p className="text-sm font-medium">{item.name}</p>
              </div>
            ))}
          </div>
          <p className="text-zinc-500 text-sm mt-6">Victor • Jon • James • Altan • Mark • Ben</p>
        </div>
        
      </Section>

      {/* Stats Intro */}
      <Section className="bg-zinc-950 relative overflow-hidden">
        <NumbersRain isActive={activeSection === 29} />
        <div className="text-center max-w-2xl relative z-10">
          <p className="text-6xl mb-6">📊</p>
          <h2 className="text-5xl font-black mb-4">By the Numbers</h2>
          <p className="text-zinc-400 text-xl">Let's count it up</p>
        </div>
      </Section>

      {/* Projects Showcase */}
      <Section className="bg-zinc-900">
        <ProjectsShowcase isActive={activeSection === 30} />
      </Section>

      {/* Projects Breakdown */}
      <Section className="bg-zinc-950">
        <div className="max-w-4xl w-full">
          <h2
            className="text-4xl font-bold mb-8 text-center"
            style={{ animation: activeSection === 31 ? 'titleDrop 0.5s ease-out both' : 'none' }}
          >Projects by Team</h2>
          <div className="flex items-center justify-center gap-12">
            <div
              style={{
                width: 250,
                height: 250,
                animation: activeSection === 31 ? 'chartSpin 0.8s ease-out both' : 'none',
              }}
            >
              {activeSection === 31 && (
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
                <div
                  key={i}
                  className="flex items-center gap-3"
                  style={{ animation: activeSection === 31 ? `legendSlide 0.4s ease-out ${0.3 + i * 0.15}s both` : 'none' }}
                >
                  <div
                    className="w-4 h-4 rounded"
                    style={{
                      backgroundColor: item.color,
                      animation: activeSection === 31 ? `colorPop 0.3s ease-out ${0.5 + i * 0.15}s both` : 'none',
                    }}
                  />
                  <span className="text-zinc-300 w-28">{item.name}</span>
                  <span
                    className="text-2xl font-bold"
                    style={{ animation: activeSection === 31 ? `numberBounce 0.4s ease-out ${0.6 + i * 0.15}s both` : 'none' }}
                  >{item.value}+</span>
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
            {activeSection === 32 && (
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
            {Object.entries(teamColors).filter(([team]) => team !== 'docs').map(([team, color]) => (
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
          <h2
            className="text-5xl font-black mb-6"
            style={{
              animation: activeSection === 33 ? 'thankYouReveal 0.8s ease-out both' : 'none',
            }}
          >Thanks for everything.</h2>
          <div className="flex flex-col gap-8 mb-8">
            <div className="flex justify-center gap-3">
              {teamPhotos.slice(0, 7).map((person, i) => (
                <div
                  key={i}
                  className="group relative hover:z-10"
                  style={{
                    animation: activeSection === 33 ? `photoWaveIn 0.5s ease-out ${0.2 + i * 0.05}s both` : 'none',
                  }}
                >
                  <img
                    src={person.photo}
                    alt={person.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-zinc-700 hover:border-zinc-400 transition-all hover:scale-110"
                    style={{
                      animation: activeSection === 33 ? `photoGlow 2s ease-in-out ${1.5 + i * 0.1}s infinite` : 'none',
                    }}
                  />
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs text-zinc-400 pointer-events-none">
                    {person.name}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-3">
              {teamPhotos.slice(7, 14).map((person, i) => (
                <div
                  key={i}
                  className="group relative hover:z-10"
                  style={{
                    animation: activeSection === 33 ? `photoWaveIn 0.5s ease-out ${0.5 + i * 0.05}s both` : 'none',
                  }}
                >
                  <img
                    src={person.photo}
                    alt={person.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-zinc-700 hover:border-zinc-400 transition-all hover:scale-110"
                    style={{
                      animation: activeSection === 33 ? `photoGlow 2s ease-in-out ${1.8 + i * 0.1}s infinite` : 'none',
                    }}
                  />
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs text-zinc-400 pointer-events-none">
                    {person.name}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-3">
              {teamPhotos.slice(14, 21).map((person, i) => (
                <div
                  key={i}
                  className="group relative hover:z-10"
                  style={{
                    animation: activeSection === 33 ? `photoWaveIn 0.5s ease-out ${0.8 + i * 0.05}s both` : 'none',
                  }}
                >
                  <img
                    src={person.photo}
                    alt={person.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-zinc-700 hover:border-zinc-400 transition-all hover:scale-110"
                    style={{
                      animation: activeSection === 33 ? `photoGlow 2s ease-in-out ${2.1 + i * 0.1}s infinite` : 'none',
                    }}
                  />
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs text-zinc-400 pointer-events-none">
                    {person.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p
            className="text-zinc-400 text-xl mb-8"
            style={{
              animation: activeSection === 33 ? 'fadeInUp 0.6s ease-out 1.2s both' : 'none',
            }}
          >See you in 2026.</p>
          <div className="flex justify-center gap-2">
            {Object.values(teamColors).map((color, i) => (
              <div
                key={i}
                className="w-16 h-2 rounded-full"
                style={{
                  backgroundColor: color,
                  animation: activeSection === 33 ? `barGrow 0.4s ease-out ${1.4 + i * 0.1}s both, barPulse 2s ease-in-out ${2 + i * 0.2}s infinite` : 'none',
                }}
              />
            ))}
          </div>
        </div>
        
      </Section>
    </div>
  );
}
