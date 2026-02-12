
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  MapPin, 
  Clock, 
  Search, 
  BarChart3, 
  ChevronRight, 
  TrendingUp,
  RefreshCcw,
  ShieldCheck,
  AlertCircle,
  Code2
} from 'lucide-react';
import { MOCK_CONSTITUENCIES, PARTIES } from './constants';
import { Constituency, ElectionStatus } from './types';
import StatsCard from './components/StatsCard';
import PartyChart from './components/PartyChart';
import { getElectionAnalysis } from './services/geminiService';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [constituencies, setConstituencies] = useState<Constituency[]>(MOCK_CONSTITUENCIES);
  const [aiAnalysis, setAiAnalysis] = useState<string>('Loading AI insights...');
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const loadAnalysis = async () => {
      const analysis = await getElectionAnalysis(PARTIES, constituencies);
      setAiAnalysis(analysis || "Analysis currently unavailable.");
    };
    loadAnalysis();
  }, [constituencies]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date().toLocaleTimeString());
      setIsRefreshing(false);
    }, 1000);
  };

  const filteredConstituencies = useMemo(() => {
    return constituencies.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, constituencies]);

  const totalWon = PARTIES.reduce((acc, p) => acc + p.seatsWon, 0);
  const totalLeading = PARTIES.reduce((acc, p) => acc + p.seatsLeading, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-emerald-700 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-1 rounded-full">
               <ShieldCheck className="h-6 w-6 text-emerald-700" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight leading-none">ElectionWatchBD</h1>
              <p className="text-[10px] text-emerald-100 font-medium opacity-80 mt-1">Developed by কুয়াশা</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-4">
              <a href="#" className="hover:bg-emerald-600 px-3 py-2 rounded-md transition text-sm font-medium">Dashboard</a>
              <a href="#" className="hover:bg-emerald-600 px-3 py-2 rounded-md transition text-sm font-medium">Maps</a>
              <a href="#" className="hover:bg-emerald-600 px-3 py-2 rounded-md transition text-sm font-medium">Parties</a>
            </nav>
            <div className="flex items-center space-x-2 text-xs bg-emerald-800 px-3 py-1.5 rounded-full border border-emerald-600/30">
              <Clock className="h-3 w-3" />
              <span>Updated: {lastUpdated}</span>
            </div>
          </div>
          <button 
            onClick={handleRefresh}
            className={`p-2 rounded-full hover:bg-emerald-600 transition ${isRefreshing ? 'animate-spin' : ''}`}
            title="Refresh Data"
          >
            <RefreshCcw className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard 
            label="Total Seats" 
            value="300" 
            icon={<MapPin className="text-blue-600" />} 
            colorClass="border-blue-500" 
          />
          <StatsCard 
            label="Results Announced" 
            value={totalWon} 
            icon={<ShieldCheck className="text-emerald-600" />} 
            colorClass="border-emerald-500" 
          />
          <StatsCard 
            label="Leading Now" 
            value={totalLeading} 
            icon={<TrendingUp className="text-amber-600" />} 
            colorClass="border-amber-500" 
          />
          <StatsCard 
            label="Voter Turnout" 
            value="72.4%" 
            icon={<Users className="text-purple-600" />} 
            colorClass="border-purple-500" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Charts and AI Insights */}
          <div className="lg:col-span-2 space-y-8">
            {/* AI Insight Box */}
            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6 relative overflow-hidden shadow-sm">
               <div className="flex items-center space-x-2 mb-3">
                 <div className="bg-emerald-600 p-1.5 rounded-md shadow-inner">
                   <BarChart3 className="h-4 w-4 text-white" />
                 </div>
                 <h2 className="text-lg font-bold text-emerald-900 uppercase tracking-wider text-sm">AI Trend Analysis</h2>
               </div>
               <p className="text-emerald-800 leading-relaxed italic relative z-10">
                 "{aiAnalysis}"
               </p>
               <div className="absolute top-0 right-0 p-2 opacity-5">
                 <RefreshCcw className="h-24 w-24 text-emerald-900" />
               </div>
            </div>

            {/* Party Chart Container */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Seat Distribution</h3>
                <div className="flex items-center space-x-2 text-xs font-medium text-gray-500">
                  <span className="flex items-center"><div className="w-3 h-3 bg-emerald-500 rounded-sm mr-1"></div> Won</span>
                  <span className="flex items-center"><div className="w-3 h-3 bg-amber-500 rounded-sm mr-1"></div> Leading</span>
                </div>
              </div>
              <PartyChart data={PARTIES} />
              
              <div className="mt-8 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
                      <th className="px-2 py-3">Party</th>
                      <th className="px-2 py-3">Won</th>
                      <th className="px-2 py-3">Leading</th>
                      <th className="px-2 py-3 text-right pr-4">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {PARTIES.map((party) => (
                      <tr key={party.shortName} className="hover:bg-gray-50 transition">
                        <td className="px-2 py-4 flex items-center space-x-3">
                          <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: party.color }}></div>
                          <div>
                            <span className="font-bold text-gray-900">{party.shortName}</span>
                            <p className="text-[10px] text-gray-500 truncate max-w-[150px]">{party.name}</p>
                          </div>
                        </td>
                        <td className="px-2 py-4 font-semibold text-emerald-600">{party.seatsWon}</td>
                        <td className="px-2 py-4 font-semibold text-amber-600">{party.seatsLeading}</td>
                        <td className="px-2 py-4 font-bold text-gray-900 text-right pr-4">{party.seatsWon + party.seatsLeading}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Constituency Search & List */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Constituency Search</h3>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input 
                  type="text" 
                  placeholder="Search by area or code (e.g. Dhaka-1)"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredConstituencies.length > 0 ? (
                  filteredConstituencies.map((c) => (
                    <div key={c.id} className="border border-gray-100 rounded-lg p-4 hover:border-emerald-200 hover:shadow-md transition group cursor-pointer bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-xs font-bold text-emerald-600 mb-0.5">{c.code}</p>
                          <h4 className="font-bold text-gray-900 group-hover:text-emerald-700 transition">{c.name}</h4>
                        </div>
                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase shadow-sm ${
                          c.status === ElectionStatus.WON ? 'bg-emerald-100 text-emerald-700' : 
                          c.status === ElectionStatus.LEADING ? 'bg-amber-100 text-amber-700' : 
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        {c.candidates.slice(0, 2).map((cand, idx) => (
                          <div key={cand.id} className="relative">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-semibold text-gray-700 truncate max-w-[150px]">
                                {idx === 0 ? '🏆 ' : ''}{cand.name} ({cand.party})
                              </span>
                              <span className="text-gray-500 font-medium">{(cand.votes / c.countedVotes * 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden shadow-inner">
                              <div 
                                className="h-full transition-all duration-1000 ease-out" 
                                style={{ 
                                  width: `${(cand.votes / c.countedVotes * 100)}%`,
                                  backgroundColor: cand.color 
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-400 font-medium">
                        <span>Total Votes: {c.totalVotes.toLocaleString()}</span>
                        <ChevronRight className="h-3 w-3 text-gray-300 group-hover:text-emerald-500 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <AlertCircle className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No constituencies found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Information Footer/Widgets */}
            <div className="bg-emerald-900 text-white rounded-xl p-6 shadow-lg shadow-emerald-900/20">
               <div className="flex items-center space-x-2 mb-4">
                 <AlertCircle className="h-5 w-5 text-emerald-400" />
                 <h4 className="font-bold">Election Quick Help</h4>
               </div>
               <ul className="text-sm space-y-3 opacity-90">
                 <li className="flex items-center space-x-3 group cursor-pointer">
                   <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full group-hover:scale-150 transition"></div>
                   <span className="group-hover:translate-x-1 transition">Find your polling station</span>
                 </li>
                 <li className="flex items-center space-x-3 group cursor-pointer">
                   <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full group-hover:scale-150 transition"></div>
                   <span className="group-hover:translate-x-1 transition">How to read result charts</span>
                 </li>
                 <li className="flex items-center space-x-3 group cursor-pointer">
                   <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full group-hover:scale-150 transition"></div>
                   <span className="group-hover:translate-x-1 transition">Report an irregularity</span>
                 </li>
               </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex flex-col space-y-2 text-center md:text-left">
              <p className="text-gray-500 text-xs">
                © 2024 ElectionWatchBD. Developed by <span className="font-bold text-emerald-700">কুয়াশা</span>
              </p>
              <p className="text-gray-400 text-[10px] max-w-sm">
                Data provided for informational purposes only. Results are unofficial until gazetted by the Election Commission of Bangladesh.
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end space-y-3">
              <div className="flex space-x-6 text-xs font-semibold text-gray-500">
                <a href="#" className="hover:text-emerald-700 transition">Privacy Policy</a>
                <a href="#" className="hover:text-emerald-700 transition">Terms</a>
                <a href="#" className="hover:text-emerald-700 transition">Contact</a>
              </div>
              <div className="flex items-center space-x-1.5 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                <Code2 className="h-3 w-3 text-emerald-600" />
                <span className="text-[10px] text-gray-400 font-medium">Crafted with care by কুয়াশা</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
