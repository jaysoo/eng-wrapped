import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import {
  teamColors, commitData, projectData,
  cloudHighlights, infraHighlights, redpandaHighlights
} from './data';
import { NumbersRain, ProjectsShowcase, Section, teamPhotos } from './components';

export function OrcaHighlights({ activeSection }) {
  return (
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
  );
}

export function InfraHighlights({ activeSection }) {
  return (
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
  );
}

export function RedPandaHighlights({ activeSection }) {
  return (
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
  );
}

export function StatsIntro({ activeSection }) {
  return (
    <Section className="bg-zinc-950 relative overflow-hidden">
      <NumbersRain isActive={activeSection === 29} />
      <div className="text-center max-w-2xl relative z-10">
        <p className="text-6xl mb-6">📊</p>
        <h2 className="text-5xl font-black mb-4">By the Numbers</h2>
        <p className="text-zinc-400 text-xl">Let's count it up</p>
      </div>
    </Section>
  );
}

export function ProjectsShowcaseSection({ activeSection }) {
  return (
    <Section className="bg-zinc-900">
      <ProjectsShowcase isActive={activeSection === 30} />
    </Section>
  );
}

export function ProjectsBreakdown({ activeSection }) {
  return (
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
  );
}

export function TopContributors({ activeSection }) {
  return (
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
  );
}

export function Closing({ activeSection }) {
  return (
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
                animation: activeSection === 33 ? `closingBarGrow 0.4s ease-out ${1.4 + i * 0.1}s both, barPulse 2s ease-in-out ${2 + i * 0.2}s infinite` : 'none',
              }}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
