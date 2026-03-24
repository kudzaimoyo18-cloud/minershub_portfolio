"use client";

import { MetalButton, LiquidButton } from "@/components/ui/liquid-glass-button";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Globe } from "@/components/ui/globe";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'hydro' | 'air' | 'immersion'>('hydro');

  return (
    <AuroraBackground>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-mh-gold rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                <span className="text-black font-bold text-xl">MH</span>
              </div>
              <span className="text-white font-bold text-xl">Miners Hub</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-gray-300 hover:text-white transition">About</a>
              <a href="#asics" className="text-gray-300 hover:text-white transition">ASIC Miners</a>
              <a href="#cooling" className="text-gray-300 hover:text-white transition">Cooling Solutions</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition">Contact</a>
            </div>
            <LiquidButton size="sm" className="text-mh-gold">Get Started</LiquidButton>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-mh-gold/10 border border-mh-gold/20 rounded-full mb-6">
                <span className="w-2 h-2 bg-mh-gold rounded-full animate-pulse"></span>
                <span className="text-mh-gold text-sm font-medium">Operating in UAE & Oman</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Premium
                <span className="bg-gradient-to-r from-mh-gold to-mh-blue bg-clip-text text-transparent">
                  {" "}Crypto Mining{" "}
                </span>
                Solutions
              </h1>
              <p className="text-xl text-gray-400 mb-8 max-w-lg">
                Access to 40MW of mining capacity with state-of-the-art facilities across the UAE and Oman.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <MetalButton variant="gold" className="text-lg px-8 py-6">
                  Start Mining Today
                </MetalButton>
                <LiquidButton size="xxl" className="text-mh-gold">
                  Book a Tour
                </LiquidButton>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                <div>
                  <div className="text-3xl font-bold text-white">40MW</div>
                  <div className="text-gray-400 text-sm">Total Capacity</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">15K+</div>
                  <div className="text-gray-400 text-sm">Miners Online</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">99.9%</div>
                  <div className="text-gray-400 text-sm">Uptime</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-gray-400 text-sm">Support</div>
                </div>
              </div>
            </div>
            <div className="relative z-10 flex items-center justify-center">
              <Globe />
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: "Scale Your Operations", desc: "From 50kW to multi-MW deployments tailored to your needs" },
              { title: "Expert Management", desc: "Complete portfolio management by experienced professionals" },
              { title: "Advanced Cooling", desc: "State-of-the-art immersion, hydro, and air cooling systems" },
              { title: "Sustainable Mining", desc: "Energy-efficient practices aligned with UAE sustainability goals" },
            ].map((item, i) => (
              <div key={i} className="p-6 bg-slate-800/30 border border-slate-700 rounded-xl hover:border-mh-gold/50 transition-all">
                <div className="w-12 h-12 bg-mh-gold/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-mh-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ASIC Miners Section */}
      <section id="asics" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Premium ASIC Miners</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Industry-leading cryptocurrency mining hardware from Bitmain - the gold standard in crypto mining
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* L9 Miner */}
            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl p-6 hover:border-mh-gold/50 transition-all">
              <div className="aspect-video bg-slate-800 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                <img
                  src="/miners/l9.jpg"
                  alt="Bitmain Antminer L9"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="text-mh-gold text-sm font-medium mb-1">Bitmain</div>
              <h3 className="text-white font-bold text-xl mb-2">Antminer L9</h3>
              <p className="text-gray-400 text-sm mb-4">Next-generation Litecoin mining machine</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm bg-slate-900/50 p-2 rounded">
                  <span className="text-gray-400">Hashrate</span>
                  <span className="text-white font-semibold">16.8 GH/s</span>
                </div>
                <div className="flex justify-between text-sm bg-slate-900/50 p-2 rounded">
                  <span className="text-gray-400">Power</span>
                  <span className="text-white font-semibold">3360W</span>
                </div>
                <div className="flex justify-between text-sm bg-slate-900/50 p-2 rounded">
                  <span className="text-gray-400">Efficiency</span>
                  <span className="text-white font-semibold">0.20 J/MH</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700">
                <span className="text-xs text-mh-gold font-medium">Air Cooled</span>
              </div>
            </div>

            {/* S21 Pro Miner */}
            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl p-6 hover:border-mh-gold/50 transition-all">
              <div className="aspect-video bg-slate-800 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                <img
                  src="/miners/s21pro.jpg"
                  alt="Bitmain Antminer S21 Pro"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="text-mh-gold text-sm font-medium mb-1">Bitmain</div>
              <h3 className="text-white font-bold text-xl mb-2">Antminer S21 Pro</h3>
              <p className="text-gray-400 text-sm mb-4">Most powerful Bitcoin miner ever released</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm bg-slate-900/50 p-2 rounded">
                  <span className="text-gray-400">Hashrate</span>
                  <span className="text-white font-semibold">234 TH/s</span>
                </div>
                <div className="flex justify-between text-sm bg-slate-900/50 p-2 rounded">
                  <span className="text-gray-400">Power</span>
                  <span className="text-white font-semibold">3650W</span>
                </div>
                <div className="flex justify-between text-sm bg-slate-900/50 p-2 rounded">
                  <span className="text-gray-400">Efficiency</span>
                  <span className="text-white font-semibold">15.6 J/TH</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700">
                <span className="text-xs text-mh-gold font-medium">Air Cooled</span>
              </div>
            </div>

            {/* S19 Hyd Miner */}
            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl p-6 hover:border-mh-gold/50 transition-all">
              <div className="aspect-video bg-slate-800 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                <img
                  src="/miners/s19hyd.jpg"
                  alt="Bitmain Antminer S19 Hyd"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="text-mh-gold text-sm font-medium mb-1">Bitmain</div>
              <h3 className="text-white font-bold text-xl mb-2">Antminer S19 Hyd</h3>
              <p className="text-gray-400 text-sm mb-4">High-efficiency water-cooled Bitcoin miner</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm bg-slate-900/50 p-2 rounded">
                  <span className="text-gray-400">Hashrate</span>
                  <span className="text-white font-semibold">184 TH/s</span>
                </div>
                <div className="flex justify-between text-sm bg-slate-900/50 p-2 rounded">
                  <span className="text-gray-400">Power</span>
                  <span className="text-white font-semibold">5348W</span>
                </div>
                <div className="flex justify-between text-sm bg-slate-900/50 p-2 rounded">
                  <span className="text-gray-400">Efficiency</span>
                  <span className="text-white font-semibold">29 J/TH</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700">
                <span className="text-xs text-blue-400 font-medium">Hydro Cooled</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cooling Solutions with Videos */}
      <section id="cooling" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Advanced Cooling Solutions</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Maximizing efficiency and equipment lifespan with cutting-edge cooling technologies
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-2 mb-12">
            {['hydro', 'air', 'immersion'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-800 text-gray-400 hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Cooling
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="bg-slate-800/30 border border-slate-700 rounded-2xl overflow-hidden">
            <div className="aspect-video bg-slate-900 relative">
              <video
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                poster={
                  activeTab === 'hydro'
                    ? '/water-cooled-poster.jpg'
                    : activeTab === 'air'
                    ? '/air-cooled-poster.jpg'
                    : '/emmersion-poster.jpg'
                }
                onError={(e) => {
                  // Fallback to poster image if video fails to load
                  const target = e.target as HTMLVideoElement;
                  target.style.display = 'none';
                }}
              >
                <source
                  src={
                    activeTab === 'hydro'
                      ? '/water-cooled.MOV'
                      : activeTab === 'air'
                      ? '/air-cooled.MOV'
                      : '/emmersion.MOV'
                  }
                  type="video/mp4"
                />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            </div>

            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                {activeTab === 'hydro' && 'Hydro Cooling System'}
                {activeTab === 'air' && 'Air Cooling System'}
                {activeTab === 'immersion' && 'Immersion Cooling System'}
              </h3>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Key Features</h4>
                  <ul className="space-y-2">
                    {activeTab === 'hydro' && [
                      'Water-based cooling for maximum heat dissipation',
                      'Compatible with hydro-cooled ASIC miners (S19 Hyd, S21 Hydro)',
                      'Reduces operating temperatures by 40-60%',
                      'Extends equipment lifespan by 2-3x',
                      '25-35% lower energy consumption compared to air cooling',
                      'Ideal for high-density mining operations',
                      'Quiet operation compared to air cooling',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-300">
                        <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}

                    {activeTab === 'air' && [
                      'Industrial-grade HVAC systems optimized for mining',
                      'Optimized airflow design for maximum efficiency',
                      'Easy maintenance and accessibility',
                      'Cost-effective solution for large-scale operations',
                      'Advanced filtration for clean operation',
                      'Suitable for L9 and S21 Pro air-cooled miners',
                      'Quick deployment and scaling',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-300">
                        <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}

                    {activeTab === 'immersion' && [
                      'Submerging miners in dielectric fluid',
                      'Superior heat dissipation efficiency',
                      'Reduces noise levels by 90%',
                      'Up to 50% reduction in energy costs',
                      'Extends hardware lifespan by 2-3x',
                      'Carbon-neutral mining aligned with UAE sustainability goals',
                      'Enables overclocking for higher hashrates',
                      'No dust or humidity-related issues',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-300">
                        <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Benefits</h4>
                  <div className="space-y-4">
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-blue-400 font-semibold mb-1">
                        {activeTab === 'hydro' && '30-40%'}
                        {activeTab === 'air' && '20-30%'}
                        {activeTab === 'immersion' && '40-50%'}
                      </div>
                      <div className="text-gray-400 text-sm">Energy efficiency improvement</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-purple-400 font-semibold mb-1">
                        {activeTab === 'hydro' && '2-3x'}
                        {activeTab === 'air' && '1.5-2x'}
                        {activeTab === 'immersion' && '3-4x'}
                      </div>
                      <div className="text-gray-400 text-sm">Equipment lifespan extension</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-green-400 font-semibold mb-1">Optimal</div>
                      <div className="text-gray-400 text-sm">Operating temperature 24/7</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Mining?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join the leading cryptocurrency mining solution provider in the UAE and MENA region
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MetalButton variant="gold" className="text-lg px-8 py-6">
              Get a Free Consultation
            </MetalButton>
            <LiquidButton size="xxl" className="text-white border-white/30">
              Call +971 58 862 2898
            </LiquidButton>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Get In Touch</h2>
              <p className="text-gray-400 text-lg mb-8">
                Our team of experts is ready to help you start your crypto mining journey
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-semibold mb-1">WhatsApp (24/7)</div>
                    <div className="text-gray-400">+971 58 862 2898</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-semibold mb-1">Phone</div>
                    <div className="text-gray-400">+971 58 862 2898</div>
                    <div className="text-gray-400">+971 56 266 3665</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-semibold mb-1">Email</div>
                    <div className="text-gray-400">team@minershub.ae</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-semibold mb-1">Location</div>
                    <div className="text-gray-400">Abu Dhabi, United Arab Emirates</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-mh-gold/10 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-mh-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-semibold mb-1">Website</div>
                    <a href="https://www.minershub.ae" target="_blank" rel="noopener noreferrer" className="text-mh-gold hover:underline">www.minershub.ae</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-mh-gold rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                  <span className="text-black font-bold text-xl">MH</span>
                </div>
                <span className="text-white font-bold text-xl">Miners Hub</span>
              </div>
              <p className="text-gray-400 text-sm">
                The #1 cryptocurrency mining solution provider in UAE and MENA region
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>ASIC Miner Sales</li>
                <li>Hosting Services</li>
                <li>Repair & Maintenance</li>
                <li>Cooling Solutions</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Blog</li>
                <li>Contact</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/minershub_ae"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-mh-gold/20 transition-colors group"
                  title="Instagram: @minershub_ae"
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-mh-gold transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@minershub_ae"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-mh-gold/20 transition-colors group"
                  title="TikTok: @minershub_ae"
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-mh-gold transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/miners-hub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-mh-gold/20 transition-colors group"
                  title="LinkedIn: Miners Hub"
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-mh-gold transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a
                  href="https://twitter.com/Minershub_ae"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-mh-gold/20 transition-colors group"
                  title="Twitter/X: @Minershub_ae"
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-mh-gold transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/minershub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-mh-gold/20 transition-colors group"
                  title="Facebook: Miners Hub"
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-mh-gold transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://www.pinterest.com/minershub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-mh-gold/20 transition-colors group"
                  title="Pinterest: minershub"
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-mh-gold transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-4.904 0-2.152-1.552-3.667-3.762-3.667-2.75 0-4.36 2.063-4.36 4.191 0 2.827 1.787 5.04 4.043 5.04 2.336 0 4.042-1.842 4.042-4.518 0-2.876-1.733-4.517-4.221-4.517-3.045 0-5.482 2.755-5.482 5.931 0 1.073.193 2.117.541 3.095.06.124.071.263.039.392l-.739 2.875c-.116.453-.467.553-.658.337-2.428-2.85-3.527-6.473-3.527-10.338C1.732 6.094 6.358 1.48 12.017 1.48c5.66 0 10.286 4.614 10.286 10.307 0 5.704-4.626 10.38-10.286 10.38z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 Miners Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </AuroraBackground>
  );
}
