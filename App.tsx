
import React, { useState, useEffect, useCallback } from 'react';
import { Restaurant, SearchState } from './types';
import { searchRestaurantsWithoutWebsites } from './services/geminiService';
import Sidebar from './components/Sidebar';
import RestaurantTable from './components/RestaurantTable';
import Header from './components/Header';

const App: React.FC = () => {
  const [searchState, setSearchState] = useState<SearchState>({
    isLoading: false,
    error: null,
    results: [],
  });
  const [location, setLocation] = useState('');
  const [savedLeads, setSavedLeads] = useState<Restaurant[]>(() => {
    const saved = localStorage.getItem('resto_leads');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTab, setActiveTab] = useState<'search' | 'leads'>('search');

  useEffect(() => {
    localStorage.setItem('resto_leads', JSON.stringify(savedLeads));
  }, [savedLeads]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;

    setSearchState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      // The service now uses Gemini 3 Pro for an exhaustive search
      const results = await searchRestaurantsWithoutWebsites(location);
      setSearchState({
        isLoading: false,
        error: null,
        results,
      });
      setActiveTab('search');
    } catch (err: any) {
      setSearchState({
        isLoading: false,
        error: err.message || 'An unexpected error occurred during the deep scan.',
        results: [],
      });
    }
  };

  const toggleCallStatus = (id: string, fromLeads: boolean = false) => {
    const updater = (list: Restaurant[]) =>
      list.map(item => (item.id === id ? { ...item, called: !item.called } : item));

    if (fromLeads) {
      setSavedLeads(updater);
    } else {
      setSearchState(prev => ({
        ...prev,
        results: updater(prev.results)
      }));
    }
  };

  const saveLead = (restaurant: Restaurant) => {
    if (!savedLeads.find(l => l.name === restaurant.name && l.phone === restaurant.phone)) {
      setSavedLeads(prev => [restaurant, ...prev]);
    }
  };

  const removeLead = (id: string) => {
    setSavedLeads(prev => prev.filter(l => l.id !== id));
  };

  const updateLeadNotes = (id: string, notes: string) => {
    setSavedLeads(prev => prev.map(l => l.id === id ? { ...l, notes } : l));
  };

  const exportToCSV = () => {
    const headers = ["Name", "Phone", "Address", "Cuisine", "Called", "Notes", "Location", "Google Maps Link"];
    const rows = savedLeads.map(l => [
      l.name,
      l.phone,
      l.address,
      l.cuisine,
      l.called ? "Yes" : "No",
      l.notes.replace(/,/g, ';'),
      l.location,
      l.mapsUrl
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `restaurant_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-screen bg-[#FDFDFD] overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        leadsCount={savedLeads.length} 
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Search Section */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                    {activeTab === 'search' ? 'Global Prospect Radar' : 'Leads Dashboard'}
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    {activeTab === 'search' 
                      ? 'Identify businesses operating without a website in any location.' 
                      : 'Manage your high-intent prospects and track outreach progress.'}
                  </p>
                </div>
                {activeTab === 'leads' && savedLeads.length > 0 && (
                  <button
                    onClick={exportToCSV}
                    className="bg-slate-900 text-white hover:bg-slate-800 px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-slate-200"
                  >
                    <i className="fa-solid fa-download"></i>
                    Export Full Report
                  </button>
                )}
              </div>
              
              {activeTab === 'search' && (
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                      <i className="fa-solid fa-map-location-dot text-lg"></i>
                    </div>
                    <input
                      type="text"
                      placeholder="Search City, ZIP, or Area (e.g. Santa Monica, CA)"
                      className="w-full pl-14 pr-6 py-4 rounded-xl border-2 border-slate-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-700 bg-slate-50/50"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <button
                    disabled={searchState.isLoading}
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black px-10 py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 active:scale-95"
                  >
                    {searchState.isLoading ? (
                      <i className="fa-solid fa-circle-notch fa-spin"></i>
                    ) : (
                      <i className="fa-solid fa-radar"></i>
                    )}
                    {searchState.isLoading ? 'Processing...' : 'Deep Scan Area'}
                  </button>
                </form>
              )}
            </div>

            {/* Results Section */}
            {searchState.error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-5 rounded-xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                <div className="bg-red-100 p-2 rounded-full text-red-600">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
                <div className="flex-1">
                  <p className="font-bold">Search Interrupted</p>
                  <p className="text-xs opacity-80">{searchState.error}</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {activeTab === 'search' ? (
                <RestaurantTable 
                  restaurants={searchState.results}
                  isLoading={searchState.isLoading}
                  onToggleCall={(id) => toggleCallStatus(id, false)}
                  onSave={saveLead}
                  onRemove={() => {}}
                  isLeadView={false}
                  onUpdateNotes={() => {}}
                />
              ) : (
                <RestaurantTable 
                  restaurants={savedLeads}
                  isLoading={false}
                  onToggleCall={(id) => toggleCallStatus(id, true)}
                  onSave={() => {}}
                  onRemove={removeLead}
                  isLeadView={true}
                  onUpdateNotes={updateLeadNotes}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
