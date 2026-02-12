
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
  const [constituencies] = useState<Constituency[]>(MOCK_CONSTITUENCIES);
  const [aiAnalysis, setAiAnalysis] = useState<string>('লোডিং হচ্ছে...');
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadAnalysis = async () => {
      try {
        const analysis = await getElectionAnalysis(PARTIES, constituencies);
        if (isMounted) {
          setAiAnalysis(analysis || "এই মুহূর্তে বিশ্লেষণ করা সম্ভব হচ্ছে না।");
        }
      } catch (err) {
        if (isMounted) setAiAnalysis("AI ফিড লোড করতে সমস্যা হয়েছে।");
      }
    };
    loadAnalysis();
    return () => { isMounted = false; };
  }, [constituencies]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date().toLocaleTimeString());
      setIsRefreshing(false);
    }, 800);
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
            <div className="bg-white p-1 rounded-full shadow-inner">
               <ShieldCheck className="h-6 w-6 text-emerald-700" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight leading-none">ElectionWatchBD</h1>
              <p className="text-[10px] text-emerald-100 font-medium opacity-80 mt-1">Developed by কুয়াশা</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-4">
              <a href="#" className="hover:bg-emerald-600 px-3 py-2 rounded-md transition text-sm font-medium">ড্যাশবোর্ড</a>
              <a href="#" className="hover:bg-emerald-600 px-3 py-2 rounded-md transition text-sm font-medium">ম্যাপ</a>
              <a href="#" className="hover:bg-emerald-600 px-3 py-2 rounded-md transition text-sm font-medium">দলসমূহ</a>
            </nav>
            <div className="flex items-center space-x-2 text-xs bg-emerald-800 px-3 py-1.5 rounded-full border border-emerald-600/30">
              <Clock className="h-3 w-3 text-emerald-300" />
              <span>আপডেট: {lastUpdated}</span>
            </div>
          </div>
          <button 
            onClick={handleRefresh}
            className={`p-2 rounded-full hover:bg-emerald-600 transition-all active:scale-95 ${isRefreshing ? 'animate-spin text-emerald-300' : ''}`}
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
            label="মোট আসন" 
            value="৩০০" 
            icon={<MapPin className="text-blue-600" />} 
            colorClass="border-blue-500" 
          />
          <StatsCard 
            label="ঘোষিত ফলাফল" 
            value={totalWon} 
            icon={<ShieldCheck className="text-emerald-600" />} 
            colorClass="border-emerald-500" 
          />
          <StatsCard 
            label="এগিয়ে আছে" 
            value={totalLeading} 
            icon={<TrendingUp className="text-amber-600" />} 
            colorClass="border-amber-500" 
          />
          <StatsCard 
            label="ভোটের হার" 
            value="৭২.৪%" 
            icon={<Users className="text-purple-600" />} 
            colorClass="border-purple-500" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* AI Insight Box */}
            <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded-2xl p-6 relative overflow-hidden shadow-sm">
               <div className="flex items-center space-x-2 mb-4">
                 <div className="bg-emerald-600 p-2 rounded-lg shadow-md">
                   <BarChart3 className="h-4 w-4 text-white" />
                 </div>
                 <h2 className="text-sm font-bold text-emerald-900 uppercase tracking-widest">AI বিশ্লেষণ</h2>
               </div>
               <p className="text-emerald-800 leading-relaxed font-medium text-lg italic relative z-10">
                 "{aiAnalysis}"
               </p>
               <div className="absolute -bottom-6 -right-6 opacity-5 pointer-events-none">
                 <ShieldCheck className="h-48 w-48 text-emerald-900" />
               </div>
            </div>

            {/* Party Chart Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-900">দলাভিত্তিক আসন বিন্যাস</h3>
                <div className="flex items-center space-x-4 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                  <span className="flex items-center"><div className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-1.5 shadow-sm"></div> বিজয়ী</span>
                  <span className="flex items-center"><div className="w-2.5 h-2.5 bg-amber-500 rounded-full mr-1.5 shadow-sm"></div> এগিয়ে</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <PartyChart data={PARTIES} />
              </div>
              
              <div className="mt-8 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                      <th className="px-2 py-4">রাজনৈতিক দল</th>
                      <th className="px-2 py-4">বিজয়ী</th>
                      <th className="px-2 py-4">এগিয়ে</th>
                      <th className="px-2 py-4 text-right pr-4">মোট আসন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {PARTIES.map((party) => (
                      <tr key={party.shortName} className="hover:bg-emerald-50/30 transition-colors group">
                        <td className="px-2 py-5 flex items-center space-x-4">
                          <div className="w-3 h-3 rounded-full ring-2 ring-offset-2 ring-transparent group-hover:ring-emerald-200 transition-all" style={{ backgroundColor: party.color }}></div>
                          <div>
                            <span className="font-bold text-gray-900 block leading-none mb-1">{party.shortName}</span>
                            <p className="text-[10px] text-gray-400 font-medium truncate max-w-[200px]">{party.name}</p>
                          </div>
                        </td>
                        <td className="px-2 py-5 font-bold text-emerald-600">{party.seatsWon}</td>
                        <td className="px-2 py-5 font-bold text-amber-500">{party.seatsLeading}</td>
                        <td className="px-2 py-5 font-black text-gray-900 text-right pr-4">{party.seatsWon + party.seatsLeading}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-5">নির্বাচনী এলাকা খুঁজুন</h3>
              <div className="relative mb-6 group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="এলাকা বা কোড দিয়ে খুঁজুন..."
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-inner"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-4 max-h-[650px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredConstituencies.length > 0 ? (
                  filteredConstituencies.map((c) => (
                    <div key={c.id} className="border border-gray-100 rounded-2xl p-4 hover:border-emerald-100 hover:shadow-lg transition-all duration-300 group bg-white relative overflow-hidden">
                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <div>
                          <p className="text-[10px] font-black text-emerald-600 mb-0.5 tracking-tighter">{c.code}</p>
                          <h4 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{c.name}</h4>
                        </div>
                        <span className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest shadow-sm ${
                          c.status === ElectionStatus.WON ? 'bg-emerald-500 text-white' : 
                          c.status === ElectionStatus.LEADING ? 'bg-amber-400 text-white' : 
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      
                      <div className="space-y-4 relative z-10">
                        {c.candidates.slice(0, 2).map((cand, idx) => (
                          <div key={cand.id} className="relative">
                            <div className="flex justify-between text-[11px] mb-1.5 font-bold">
                              <span className="text-gray-700 truncate max-w-[140px]">
                                {idx === 0 ? '🥇 ' : '🥈 '}{cand.name}
                              </span>
                              <span className="text-gray-400">{(cand.votes / c.countedVotes * 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden shadow-inner ring-1 ring-gray-100">
                              <div 
                                className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm" 
                                style={{ 
                                  width: `${(cand.votes / c.countedVotes * 100)}%`,
                                  backgroundColor: cand.color 
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-5 pt-3 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        <span>মোট ভোট: {c.totalVotes.toLocaleString()}</span>
                        <ChevronRight className="h-4 w-4 text-gray-200 group-hover:text-emerald-500 transition-all group-hover:translate-x-1" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <AlertCircle className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium text-sm">কোন তথ্য খুঁজে পাওয়া যায়নি</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Help */}
            <div className="bg-emerald-900 text-white rounded-2xl p-6 shadow-xl shadow-emerald-900/20 relative overflow-hidden">
               <div className="flex items-center space-x-3 mb-6 relative z-10">
                 <div className="bg-emerald-500/20 p-2 rounded-lg">
                   <AlertCircle className="h-5 w-5 text-emerald-300" />
                 </div>
                 <h4 className="font-bold tracking-tight">জরুরি তথ্য</h4>
               </div>
               <ul className="text-sm space-y-4 relative z-10">
                 <li className="flex items-center space-x-3 group cursor-pointer hover:bg-emerald-800/50 p-2 -m-2 rounded-xl transition-all">
                   <div className="w-2 h-2 bg-emerald-400 rounded-full group-hover:scale-125 shadow-emerald-400/50 shadow-md transition-all"></div>
                   <span className="opacity-90 group-hover:opacity-100 font-medium transition-all">আপনার ভোটকেন্দ্র খুঁজে নিন</span>
                 </li>
                 <li className="flex items-center space-x-3 group cursor-pointer hover:bg-emerald-800/50 p-2 -m-2 rounded-xl transition-all">
                   <div className="w-2 h-2 bg-emerald-400 rounded-full group-hover:scale-125 shadow-emerald-400/50 shadow-md transition-all"></div>
                   <span className="opacity-90 group-hover:opacity-100 font-medium transition-all">ফলাফল দেখার নির্দেশিকা</span>
                 </li>
                 <li className="flex items-center space-x-3 group cursor-pointer hover:bg-emerald-800/50 p-2 -m-2 rounded-xl transition-all">
                   <div className="w-2 h-2 bg-emerald-400 rounded-full group-hover:scale-125 shadow-emerald-400/50 shadow-md transition-all"></div>
                   <span className="opacity-90 group-hover:opacity-100 font-medium transition-all">অনিয়ম রিপোর্ট করুন</span>
                 </li>
               </ul>
               <div className="absolute top-0 right-0 opacity-10 -mr-10 -mt-10">
                 <Users className="h-40 w-40" />
               </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
            <div className="flex flex-col space-y-3 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2">
                 <ShieldCheck className="h-5 w-5 text-emerald-600" />
                 <span className="font-black text-gray-900 tracking-tighter">ElectionWatchBD</span>
              </div>
              <p className="text-gray-400 text-xs font-medium">
                © ২০২৪ সর্বস্বত্ব সংরক্ষিত। ডিজাইন ও ডেভেলপমেন্টে <span className="text-emerald-600 font-bold underline decoration-emerald-100 decoration-2 underline-offset-4">কুয়াশা</span>
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end space-y-5">
              <div className="flex space-x-8 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                <a href="#" className="hover:text-emerald-600 transition-colors">গোপনীয়তা নীতি</a>
                <a href="#" className="hover:text-emerald-600 transition-colors">শর্তাবলী</a>
                <a href="#" className="hover:text-emerald-600 transition-colors">যোগাযোগ</a>
              </div>
              <div className="flex items-center space-x-2.5 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
                <Code2 className="h-4 w-4 text-emerald-600" />
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Crafted by কুয়াশা with Excellence</span>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <p className="text-[10px] text-gray-300 font-medium uppercase tracking-[0.2em] max-w-2xl mx-auto leading-relaxed">
              সতর্কবার্তা: এটি একটি বেসরকারি ড্যাশবোর্ড। সরকারি গেজেট প্রকাশিত হওয়ার আগ পর্যন্ত এই ফলাফলকে চূড়ান্ত হিসেবে গণ্য করবেন না।
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
