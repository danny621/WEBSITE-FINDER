
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-8 shrink-0">
      <div className="flex items-center gap-4 md:hidden">
        <div className="bg-blue-600 p-1.5 rounded-lg text-white">
          <i className="fa-solid fa-bolt"></i>
        </div>
        <span className="font-bold text-slate-900">RestoFinder</span>
      </div>

      <div className="hidden md:flex items-center gap-2 text-slate-500 text-sm">
        <i className="fa-solid fa-circle-info text-blue-500"></i>
        <span>Find businesses without digital presence to offer your services.</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-medium text-slate-600">
          <i className="fa-solid fa-key"></i>
          API Live
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-500">
          <i className="fa-solid fa-user text-sm"></i>
        </div>
      </div>
    </header>
  );
};

export default Header;
