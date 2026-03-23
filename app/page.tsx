"use client";

import { Globe } from "@/components/ui/globe";
import { MetalButton, LiquidButton } from "@/components/ui/liquid-glass-button";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'hydro' | 'air' | 'immersion'>('hydro');

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">MH</span>
              </div>
              <span className="text-white font-bold text-xl">Miners Hub</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-gray-300 hover:text-white transition">About</a>
              <a href="#asics" className="text-gray-300 hover:text-white transition">ASIC Miners</a>
              <a href="#cooling" className="text-gray-300 hover:text-white transition">Cooling Solutions</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition">Contact</a>
            </div>
            <LiquidButton size="sm" className="text-blue-400">Get Started</LiquidButton>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                <span className="text-blue-400 text-sm font-medium">Operating in UAE & Oman</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Premium
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  {" "}Crypto Mining{" "}
                </span>
                Solutions
              </h1>
              <p className="text-xl text-gray-400 mb-8 max-w-lg">
                Access to 40MW of mining capacity with state-of-the-art facilities across the UAE and Oman.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <MetalButton variant="primary" className="text-lg px-8 py-6">
                  Start Mining Today
                </MetalButton>
                <LiquidButton size="xxl" className="text-blue-400">
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

            {/* Globe */}
            <div className="relative h-[600px] flex items-center justify-center">
              <Globe />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
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
              <div key={i} className="p-6 bg-slate-800/30 border border-slate-700 rounded-xl hover:border-blue-500/50 transition-all">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Advanced ASIC Miners</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Industry-leading cryptocurrency mining hardware from top manufacturers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Antminer S21", brand: "Bitmain", hash: "200 TH/s", power: "3550W" },
              { name: "Whatsminer M53", brand: "MicroBT", hash: "230 TH/s", power: "3204W" },
              { name: "KS3", brand: "IceRiver", hash: "9.5 TH/s", power: "3400W" },
            ].map((miner, i) => (
              <div key={i} className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
                <div className="aspect-video bg-slate-800 rounded-xl mb-4 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-600 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <div className="text-blue-400 text-sm font-medium mb-1">{miner.brand}</div>
                <h3 className="text-white font-bold text-xl mb-2">{miner.name}</h3>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Hashrate</span>
                    <span className="text-white">{miner.hash}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Power</span>
                    <span className="text-white">{miner.power}</span>
                  </div>
                </div>
              </div>
            ))}
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
                      'Compatible with hydro-cooled ASIC miners',
                      'Reduces operating temperatures by 40-60%',
                      'Extends equipment lifespan significantly',
                      'Lower energy consumption compared to air cooling',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-300">
                        <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}

                    {activeTab === 'air' && [
                      'Industrial-grade HVAC systems',
                      'Optimized airflow design for maximum efficiency',
                      'Easy maintenance and accessibility',
                      'Cost-effective solution for large-scale operations',
                      'Advanced filtration for clean operation',
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
                      'Carbon-neutral mining aligned with sustainability goals',
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
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Send Us a Message</h3>
              <form className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Name</label>
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Email</label>
                  <input
                    type="email"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Message</label>
                  <textarea
                    rows={4}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition resize-none"
                    placeholder="Tell us about your mining goals..."
                  />
                </div>
                <MetalButton variant="primary" className="w-full">
                  Send Message
                </MetalButton>
              </form>
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
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">MH</span>
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
                <li><a href="#" className="hover:text-white transition">ASIC Miner Sales</a></li>
                <li><a href="#" className="hover:text-white transition">Hosting Services</a></li>
                <li><a href="#" className="hover:text-white transition">Repair & Maintenance</a></li>
                <li><a href="#" className="hover:text-white transition">Cooling Solutions</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                {['Instagram', 'TikTok', 'LinkedIn', 'Twitter'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-500 transition"
                  >
                    <span className="text-gray-400 hover:text-white text-xs">{social[0]}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 Miners Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
