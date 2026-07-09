import React, { useState, useEffect } from 'react';
import TravelForm from './TravelForm';
import ChatHub from './ChatHub';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [itineraryResult, setItineraryResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});

  const mockGroupPreferences = [
    { name: "Alice", budget: "low", pace: "slow", activityTypes: ["relaxation", "culture"] },
    { name: "Bob", budget: "moderate", pace: "moderate", activityTypes: ["sightseeing", "foodie"] },
    { name: "Charlie", budget: "luxury", pace: "fast", activityTypes: ["adventure", "nightlife"] }
  ];

  const handleFormSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    setItineraryResult(null);
    setCheckedItems({}); // reset packing checklist

    const preferences = [
      ...mockGroupPreferences,
      { name: "You (AVINASH)", budget: data.budget, pace: "moderate", activityTypes: ["sightseeing", "relaxation"] }
    ];

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/generate-itinerary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: data.destination,
          startDate: data.startDate,
          endDate: data.endDate,
          budget: data.budget,
          preferences: preferences
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setItineraryResult(result);
    } catch (err) {
      console.error("Error fetching itinerary:", err);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      setError(err.message || `Failed to connect to the backend server. Make sure the Node server is running on ${apiUrl}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleItem = (itemName) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'flights', label: 'Flights GDS', icon: '✈️' },
    { id: 'hotels', label: 'Boutique Stays', icon: '🏨' },
    { id: 'packing', label: 'Nomad Packing', icon: '🎒' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800/80 flex flex-col justify-between p-6 flex-shrink-0">
        <div>
          {/* Logo */}
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

        {/* User Info Footer */}
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

      {/* Main Content */}
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

        {/* Main Workspace Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-8">
          
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Form & Chat Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-5">
                  <TravelForm onSubmit={handleFormSubmit} />
                </div>
                <div className="lg:col-span-7">
                  <ChatHub />
                </div>
              </div>

              {/* Loader */}
              {isLoading && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center shadow-xl flex flex-col items-center justify-center gap-4">
                  <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <h4 className="text-lg font-semibold text-white">Querying AI Travel Agents...</h4>
                  <p className="text-sm text-slate-400 max-w-md">Resolving group preferences, checking weather forecasts, searching stays & flights, and generating your custom digital nomad itinerary.</p>
                </div>
              )}

              {/* Error Alert */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl p-5 shadow-xl flex gap-3 items-start">
                  <span className="text-lg">⚠️</span>
                  <div>
                    <h4 className="font-semibold text-sm">Integration Connection Error</h4>
                    <p className="text-xs text-red-300/80 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Results Display */}
              {itineraryResult && (
                <div className="space-y-8 animate-fade-in">
                  
                  {/* Summary row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Weather Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Weather Forecast</span>
                        <span className="text-2xl">🌦️</span>
                      </div>
                      <div className="mt-4">
                        <h4 className="text-2xl font-bold text-white">{itineraryResult.weather.temperature}°C</h4>
                        <p className="text-sm text-slate-300 mt-1 font-medium">{itineraryResult.weather.condition}</p>
                        <p className="text-xs text-slate-500 mt-1">Based on seasonal averages for {itineraryResult.weather.month}</p>
                      </div>
                    </div>

                    {/* Consensus Vibe Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between md:col-span-2">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Weighted Group Consensus</span>
                        <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-md border border-indigo-500/20">Resolved Vibe</span>
                      </div>
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-400">Preferences Summary</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-xs bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 capitalize">
                              💰 Budget: {itineraryResult.consensus.consensus.budget}
                            </span>
                            <span className="text-xs bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 capitalize">
                              ⚡ Pace: {itineraryResult.consensus.consensus.pace}
                            </span>
                          </div>
                          <div className="mt-3">
                            <p className="text-xs text-slate-400">Top Activities</p>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {itineraryResult.consensus.consensus.topActivities.map((act, i) => (
                                <span key={i} className="text-[10px] bg-indigo-600/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20 capitalize">
                                  {act}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Conflicts warning */}
                        <div className="border-t sm:border-t-0 sm:border-l border-slate-800/80 sm:pl-4">
                          <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                            Identified Group Conflicts
                          </p>
                          {itineraryResult.consensus.conflicts.length > 0 ? (
                            <ul className="mt-2 space-y-1.5 text-[11px] text-slate-300">
                              {itineraryResult.consensus.conflicts.map((c, i) => (
                                <li key={i} className="list-disc list-inside leading-normal">{c}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-slate-500 mt-2">No preference conflicts identified! Complete alignment.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Curated Itinerary text block */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-800/80 pb-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <span>🗓️</span> Curated Day-by-Day Itinerary
                      </h3>
                      <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium">
                        Ollama Optimized
                      </span>
                    </div>
                    <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                      {itineraryResult.itinerary}
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* TAB: FLIGHTS */}
          {activeTab === 'flights' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Flight GDS Options</h3>
                <p className="text-xs text-slate-400 mt-1">Simulated flight search based on consensus dates and budget constraints.</p>
              </div>

              {!itineraryResult ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center text-slate-400">
                  ⚠️ Please submit the trip parameters on the main dashboard to load flight options.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {itineraryResult.flights.map((flight) => (
                    <div key={flight.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start border-b border-slate-800 pb-3 mb-4">
                          <div>
                            <h4 className="font-bold text-white">{flight.airline}</h4>
                            <p className="text-xs text-slate-500">Flight: {flight.flightNumber} • Class: {flight.class}</p>
                          </div>
                          <span className="text-xl font-black text-indigo-400">${flight.price}</span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Route</span>
                            <span className="text-slate-300 font-medium">{flight.searchParams.origin} → {flight.searchParams.destination}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Duration</span>
                            <span className="text-slate-300 font-medium">{flight.duration}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Stops</span>
                            <span className={`font-semibold ${flight.stops === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {flight.stops === 0 ? 'Direct (Non-stop)' : `${flight.stops} Stop(s)`}
                            </span>
                          </div>
                          {flight.stops > 0 && (
                            <div className="text-[11px] bg-slate-950 p-2 rounded text-slate-400 border border-slate-800">
                              ℹ️ Layover: {flight.layover}
                            </div>
                          )}
                        </div>
                      </div>
                      <button className="w-full mt-6 bg-slate-950 border border-slate-800 hover:border-indigo-500 text-slate-300 hover:text-white transition-all text-xs font-semibold py-2.5 rounded-lg">
                        Select Flight Option
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: HOTELS */}
          {activeTab === 'hotels' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Boutique Stays Options</h3>
                <p className="text-xs text-slate-400 mt-1">Simulated hotel engine searches based on consensus constraints.</p>
              </div>

              {!itineraryResult ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center text-slate-400">
                  ⚠️ Please submit the trip parameters on the main dashboard to load hotel options.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {itineraryResult.hotels.map((hotel) => (
                    <div key={hotel.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start border-b border-slate-800 pb-3 mb-4">
                          <div>
                            <h4 className="font-bold text-white">{hotel.name}</h4>
                            <p className="text-xs text-slate-500">{hotel.type} • ⭐ {hotel.rating}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-black text-indigo-400">${hotel.pricePerNight}</span>
                            <span className="text-[10px] text-slate-500 block">/ night</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Location</span>
                            <span className="text-slate-300 font-medium">{hotel.location}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Room Selected</span>
                            <span className="text-slate-300 font-medium">{hotel.roomType}</span>
                          </div>
                          <div>
                            <span className="text-xs text-slate-500">Amenities included:</span>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {hotel.amenities.map((amenity, idx) => (
                                <span key={idx} className="text-[10px] bg-slate-950 text-slate-300 border border-slate-800 px-2 py-0.5 rounded">
                                  ✓ {amenity}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <button className="w-full mt-6 bg-slate-950 border border-slate-800 hover:border-indigo-500 text-slate-300 hover:text-white transition-all text-xs font-semibold py-2.5 rounded-lg">
                        Select Stay Option
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: PACKING */}
          {activeTab === 'packing' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Nomad Packing List</h3>
                <p className="text-xs text-slate-400 mt-1">Categorized checklist tailored for professionals and digital nomads based on destination weather.</p>
              </div>

              {!itineraryResult ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center text-slate-400">
                  ⚠️ Please submit the trip parameters on the main dashboard to generate your custom packing checklist.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {Object.entries(itineraryResult.packingList.packingList).map(([category, items]) => (
                    <div key={category} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
                      <h4 className="font-bold text-white capitalize text-sm border-b border-slate-800 pb-2.5 mb-4 flex items-center justify-between">
                        <span>💼 {category}</span>
                        <span className="text-[10px] text-indigo-400 font-normal bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                          {items.length} items
                        </span>
                      </h4>
                      <div className="space-y-3">
                        {items.map((item, idx) => {
                          const itemKey = `${category}-${item.item}-${idx}`;
                          const isChecked = checkedItems[itemKey] || false;
                          return (
                            <div
                              key={idx}
                              onClick={() => toggleItem(itemKey)}
                              className="flex items-center gap-3 cursor-pointer select-none group py-1"
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
                                isChecked
                                  ? 'bg-indigo-600 border-indigo-500 text-white'
                                  : 'border-slate-700 bg-slate-950 group-hover:border-slate-500'
                              }`}>
                                {isChecked && <span className="text-[10px]">✓</span>}
                              </div>
                              <span className={`text-xs transition-all ${
                                isChecked ? 'line-through text-slate-500' : 'text-slate-200'
                              }`}>
                                {item.item} <span className="text-slate-500 text-[10px]">x{item.quantity}</span>
                                {item.essential && <span className="text-[9px] text-amber-500/80 bg-amber-500/10 px-1 py-0.5 rounded ml-1.5">Req</span>}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
