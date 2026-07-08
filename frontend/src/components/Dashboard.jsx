import React, { useState } from 'react';
import TravelForm from './TravelForm';
import ChatHub from './ChatHub';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lastSubmittedData, setLastSubmittedData] = useState(null);

  const handleFormSubmit = (data) => {
    console.log("Form submitted with parameters:", data);
    setLastSubmittedData(data);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'chat', label: 'Collaborative Hub', icon: '💬' },
    { id: 'flights', label: 'Flights GDS', icon: '✈️' },
    { id: 'hotels', label: 'Boutique Stays', icon: '🏨' },
    { id: 'packing', label: 'Nomad Packing', icon: '🎒' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800/80 flex flex-col justify-between p-6 flex-shrink-0">
        <div>
          {/* Logo / Title */}
          <div className="flex items-center gap-3 mb-8">
            <span className="text-2xl">✨</span>
            <div>
              <h1 className="text-md font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">AI Travel Planner</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Nomad Edition</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                  activeTab === item.id
                    ? 'bg-indigo-600/10 border border-indigo-500/20 text-indigo-400'
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Footer info */}
        <div className="hidden md:block mt-8 pt-6 border-t border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
              AG
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-300">AVINASH GK</p>
              <p className="text-[10px] text-emerald-500 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Active Session
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-slate-900/40 border-b border-slate-800/50 py-4 px-6 md:px-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4 flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-white">Workspace Board</h2>
            <p className="text-xs text-slate-400">Coordinating preferences across 4 members</p>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-center">
            <span className="bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-full border border-slate-700 font-medium">
              📁 Repository Connected
            </span>
            <span className="bg-indigo-500/10 text-indigo-400 text-xs px-3 py-1.5 rounded-full border border-indigo-500/20 font-medium">
              🤖 AI Agent Ready
            </span>
          </div>
        </header>

        {/* Scrollable Dashboard Grid */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-8">
          {/* Main Grid: Form & Chat */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form */}
            <div className="lg:col-span-5">
              <TravelForm onSubmit={handleFormSubmit} />
            </div>

            {/* Chat Hub */}
            <div className="lg:col-span-7">
              <ChatHub />
            </div>
          </div>

          {/* Submission Feedback (Card) */}
          {lastSubmittedData && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl animate-fade-in">
              <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-3">Form Submitted (React State Verified)</h4>
              <pre className="bg-slate-950 p-4 rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto border border-slate-800">
                {JSON.stringify(lastSubmittedData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
