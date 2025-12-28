
import React from 'react';
import { Restaurant } from '../types';

interface RestaurantTableProps {
  restaurants: Restaurant[];
  isLoading: boolean;
  onToggleCall: (id: string) => void;
  onSave: (restaurant: Restaurant) => void;
  onRemove: (id: string) => void;
  isLeadView: boolean;
  onUpdateNotes: (id: string, notes: string) => void;
}

const RestaurantTable: React.FC<RestaurantTableProps> = ({
  restaurants,
  isLoading,
  onToggleCall,
  onSave,
  onRemove,
  isLeadView,
  onUpdateNotes
}) => {
  if (isLoading) {
    return (
      <div className="p-16 text-center">
        <div className="relative inline-block mb-6">
          <div className="animate-ping absolute inset-0 rounded-full h-12 w-12 bg-blue-400 opacity-20"></div>
          <div className="relative rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent animate-spin"></div>
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">Scanning Web Records...</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          We are analyzing Google Search results to find businesses without websites. This deep scan takes a few seconds.
        </p>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="p-16 text-center">
        <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fa-solid fa-store-slash text-slate-300 text-3xl"></i>
        </div>
        <h3 className="text-slate-800 text-lg font-bold mb-2">No prospects found in this area</h3>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">
          Try a different neighborhood or be more specific with the city name.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead className="bg-slate-50/50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-16 text-center">Call Status</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Business Detail</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Info</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verification</th>
            {isLeadView && <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">CRM Notes</th>}
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {restaurants.map((resto) => (
            <tr key={resto.id} className={`transition-colors group ${resto.called ? 'bg-green-50/30' : 'hover:bg-blue-50/30'}`}>
              <td className="px-6 py-5 text-center">
                <button
                  onClick={() => onToggleCall(resto.id)}
                  className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all transform active:scale-95 shadow-sm ${
                    resto.called 
                      ? 'bg-green-600 border-green-600 text-white' 
                      : 'bg-white border-slate-200 hover:border-blue-400 text-slate-300'
                  }`}
                  title={resto.called ? "Mark as Pending" : "Mark as Completed"}
                >
                  <i className={`fa-solid ${resto.called ? 'fa-check' : 'fa-phone-volume'} text-sm`}></i>
                </button>
              </td>
              <td className="px-6 py-5">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 text-sm group-hover:text-blue-700 transition-colors">
                    {resto.name}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-slate-100 text-slate-500 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                      {resto.cuisine || 'Restaurant'}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-red-500 font-semibold">
                      <i className="fa-solid fa-globe text-[8px]"></i>
                      No Website Found
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="space-y-1">
                  <a 
                    href={`tel:${resto.phone}`} 
                    className="text-slate-700 hover:text-blue-600 text-sm font-bold flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-[10px]">
                       <i className="fa-solid fa-phone"></i>
                    </div>
                    {resto.phone}
                  </a>
                  <div className="flex items-start gap-2 text-slate-500 text-[10px] leading-tight">
                    <i className="fa-solid fa-location-dot mt-0.5 opacity-50"></i>
                    <span className="max-w-[180px]">{resto.address}</span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5">
                <a
                  href={resto.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md text-slate-700 rounded-lg text-xs font-semibold transition-all group/btn"
                >
                  <i className="fa-solid fa-map-location-dot text-blue-500 group-hover/btn:scale-110 transition-transform"></i>
                  Verify on Maps
                </a>
              </td>
              {isLeadView && (
                <td className="px-6 py-5">
                  <div className="relative">
                    <textarea
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all resize-none min-h-[60px]"
                      placeholder="Enter follow-up details..."
                      value={resto.notes}
                      onChange={(e) => onUpdateNotes(resto.id, e.target.value)}
                    />
                    <i className="fa-solid fa-pen absolute top-3 right-3 text-[10px] text-slate-300 pointer-events-none"></i>
                  </div>
                </td>
              )}
              <td className="px-6 py-5 text-right">
                {isLeadView ? (
                  <button
                    onClick={() => onRemove(resto.id)}
                    className="w-8 h-8 rounded-full hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all flex items-center justify-center"
                    title="Remove Lead"
                  >
                    <i className="fa-solid fa-trash-can text-sm"></i>
                  </button>
                ) : (
                  <button
                    onClick={() => onSave(resto)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-blue-200 flex items-center gap-2 ml-auto"
                  >
                    <i className="fa-solid fa-thumbtack"></i>
                    Grab Lead
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RestaurantTable;
