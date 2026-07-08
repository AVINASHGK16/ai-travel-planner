import React, { useState } from 'react';

export default function TravelForm({ onSubmit }) {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('moderate');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!destination || !startDate || !endDate) {
      alert("Please fill in all details.");
      return;
    }
    
    setIsSubmitting(true);
    if (onSubmit) {
      onSubmit({ destination, startDate, endDate, budget });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-6 shadow-2xl backdrop-blur-md">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <span className="text-indigo-500">🗺️</span> Trip Parameters
      </h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-2">
            Destination
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. Tokyo, Japan"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-3">
            Budget Tier
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['budget', 'moderate', 'luxury'].map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setBudget(tier)}
                className={`py-3 px-4 rounded-lg capitalize font-medium transition-all text-sm border ${
                  budget === tier
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-medium py-3.5 px-4 rounded-lg shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Processing...</span>
          ) : (
            <>
              <span>Generate Consensus Plan</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
