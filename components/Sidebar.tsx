
import React from 'react';

interface SidebarProps {
  activeTab: 'search' | 'leads';
  setActiveTab: (tab: 'search' | 'leads') => void;
  leadsCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, leadsCount }) => {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col border-r border-slate-800">
      <div className="p-6">
        <div className="flex items-center gap-3 text-white mb-8">
          <div className="bg-blue-600 p-2 rounded-lg">
            <i className="fa-solid fa-bolt text-lg"></i>
          </div>
          <span className="text-xl font-bold tracking-tight">RestoFinder</span>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('search')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'search' 
                ? 'bg-slate-800 text-white shadow-lg' 
                : 'hover:bg-slate-800/50 hover:text-slate-100'
            }`}
          >
            <i className="fa-solid fa-magnifying-glass w-5"></i>
            <span className="font-medium">Prospect Search</span>
          </button>
          
          <button
            onClick={() => setActiveTab('leads')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
              activeTab === 'leads' 
                ? 'bg-slate-800 text-white shadow-lg' 
                : 'hover:bg-slate-800/50 hover:text-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-address-book w-5"></i>
              <span className="font-medium">Saved Leads</span>
            </div>
            {leadsCount > 0 && (
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {leadsCount}
              </span>
            )}
          </button>
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">System Status</h4>
          <div className="flex items-center gap-2 text-xs text-green-400">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Gemini API Connected
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
