import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MessageSquare, 
  Camera, 
  Wifi, 
  WifiOff, 
  MapPin, 
  AlertTriangle, 
  Plus, 
  ChevronRight, 
  X,
  Send,
  FileText,
  CloudRain,
  Sun,
  Cloud,
  Check,
  RotateCcw,
  Navigation
} from 'lucide-react';

// --- MOCK DATABASE (Project Execution Data) ---
const INITIAL_TASKS = [
  { id: 't1', title: 'Column Casting - 4th Floor', status: 'In Progress', priority: 'High', deadline: 'Today' },
  { id: 't2', title: 'Electrical Conduit Layout', status: 'Pending', priority: 'Medium', deadline: 'Today' },
  { id: 't3', title: 'Plastering - Wing A', status: 'Pending', priority: 'Low', deadline: 'Tomorrow' }
];

const INITIAL_MATERIALS = [
  { id: 'm1', item: 'OPC 53 Cement', qty: '200 Bags', status: 'Pending', reason: 'Slab Work' },
  { id: 'm2', item: 'TMT 12mm Steel', qty: '2 Tons', status: 'Approved', reason: 'Column reinforcement' },
  { id: 'm3', item: 'Sand (Fine)', qty: '3 Brass', status: 'Rejected', reason: 'High moisture', comment: 'Re-request with dry batch' }
];

const DOCS_DB = [
  { id: 'd1', type: 'Purchase Order', name: 'PO-2024-081', date: '22 Oct' },
  { id: 'd2', type: 'GST Invoice', name: 'INV-SS-992', date: '20 Oct' },
  { id: 'd3', type: 'Quotation', name: 'QUO-SKY-001', date: '15 Oct' }
];

export default function App() {
  // --- CORE STATES ---
  const [activeTab, setActiveTab] = useState('home');
  const [isOffline, setIsOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState('Just now');
  const [syncQueue, setSyncQueue] = useState([]); // Mock local storage queue
  
  // --- SITE DATA ---
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [materials, setMaterials] = useState(INITIAL_MATERIALS);
  const [attendance, setAttendance] = useState({ self: false, workers: 0, absent: 0 });
  const [dprSubmitted, setDprSubmitted] = useState(false);

  // --- MODALS ---
  const [showDprModal, setShowDprModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);

  // --- OFFLINE & SYNC LOGIC ---
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isOffline && syncQueue.length > 0) {
        setIsSyncing(true);
        setTimeout(() => {
          setSyncQueue([]);
          setIsSyncing(false);
          setLastSynced('Just now');
        }, 2000);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [isOffline, syncQueue]);

  const addToSyncQueue = (action) => {
    if (isOffline) {
      setSyncQueue(prev => [...prev, action]);
    } else {
      setIsSyncing(true);
      setTimeout(() => {
        setIsSyncing(false);
        setLastSynced('Just now');
      }, 800);
    }
  };

  // --- VIEWS ---

  const Header = () => (
    <div className="bg-[#0B3C5D] text-white p-4 sticky top-0 z-50 shadow-lg">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-black tracking-tight flex items-center gap-2">
            <span className="bg-orange-500 p-1 rounded italic text-sm">SS</span> Skyline Residency
          </h1>
          <p className="text-[10px] text-slate-300 flex items-center gap-1 font-bold uppercase tracking-widest mt-0.5">
            <MapPin size={10} className="text-orange-400" /> Worli, Mumbai
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <button 
            onClick={() => setIsOffline(!isOffline)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black border transition-all ${isOffline ? 'bg-rose-500 border-rose-600 animate-pulse' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}
          >
            {isOffline ? <WifiOff size={12} /> : <Wifi size={12} />}
            {isOffline ? 'OFFLINE' : 'ONLINE'}
          </button>
          <span className="text-[8px] text-slate-400 font-medium">Synced: {lastSynced}</span>
        </div>
      </div>
      {isSyncing && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 animate-pulse"></div>
      )}
    </div>
  );

  const HomeView = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      {/* Attendance Module */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex justify-between">
          Site Attendance <span>{new Date().toLocaleDateString('en-IN')}</span>
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => { setAttendance({...attendance, self: !attendance.self}); addToSyncQueue('attendance'); }}
            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${attendance.self ? 'bg-emerald-50 border-emerald-500' : 'bg-slate-50 border-slate-100'}`}
          >
            <CheckCircle2 className={attendance.self ? 'text-emerald-500' : 'text-slate-300'} />
            <span className="text-[10px] font-black uppercase text-slate-700">Self Check-in</span>
          </button>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center">
             <span className="text-2xl font-black text-[#0B3C5D]">{attendance.workers}</span>
             <span className="text-[9px] font-bold text-slate-500 uppercase">Workers Present</span>
          </div>
        </div>
        {!attendance.self && (
          <p className="mt-3 text-[10px] text-orange-600 bg-orange-50 p-2 rounded flex items-center gap-2 font-bold">
            <AlertTriangle size={12} /> Mark your attendance to unlock DPR
          </p>
        )}
      </div>

      {/* Task Summary */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Today's Execution</h2>
          <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{tasks.filter(t => t.status !== 'Completed').length} Pending</span>
        </div>
        <div className="space-y-3">
          {tasks.slice(0, 2).map(task => (
            <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-slate-400" />
                <div>
                  <p className="text-xs font-bold text-slate-800">{task.title}</p>
                  <p className="text-[9px] font-medium text-rose-500 uppercase">{task.priority} Priority</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </div>
          ))}
          <button onClick={() => setActiveTab('tasks')} className="w-full py-2 text-xs font-black text-blue-600 uppercase">View All Tasks</button>
        </div>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          disabled={!attendance.self || dprSubmitted}
          onClick={() => setShowDprModal(true)}
          className={`p-5 rounded-2xl border flex flex-col items-center gap-2 transition-all ${dprSubmitted ? 'bg-emerald-50 border-emerald-100 opacity-50' : 'bg-white border-slate-100 shadow-sm active:scale-95'}`}
        >
          <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center">
            {dprSubmitted ? <Check size={20} /> : <Camera size={20} />}
          </div>
          <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">
            {dprSubmitted ? 'DPR Submitted' : 'Submit DPR'}
          </span>
        </button>
        <button 
          onClick={() => setShowMaterialModal(true)}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center gap-2 active:scale-95 transition-all"
        >
          <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
            <Plus size={20} />
          </div>
          <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">Req. Material</span>
        </button>
      </div>
    </div>
  );

  const TasksView = () => (
    <div className="space-y-3 pb-24 animate-in slide-in-from-right-4 duration-300">
      <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-4">Pending Executions</h2>
      {tasks.map(task => (
        <div key={task.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-1.5 h-1.5 rounded-full ${task.priority === 'High' ? 'bg-rose-500' : 'bg-amber-400'}`}></span>
              <h4 className="text-sm font-bold text-slate-800">{task.title}</h4>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
              <span>Status: {task.status}</span>
              <span>•</span>
              <span>Due: {task.deadline}</span>
            </div>
          </div>
          <div className="flex gap-2">
             <button className="p-2 bg-slate-100 rounded-lg text-slate-500"><Plus size={16} /></button>
             <button 
              onClick={() => {
                setTasks(tasks.map(t => t.id === task.id ? {...t, status: 'Completed'} : t));
                addToSyncQueue('task-update');
              }}
              className="px-3 py-2 bg-emerald-500 text-white text-[10px] font-black rounded-lg uppercase"
             >
               Done
             </button>
          </div>
        </div>
      ))}
    </div>
  );

  const MaterialsView = () => (
    <div className="space-y-4 pb-24 animate-in slide-in-from-right-4">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-black text-slate-800 uppercase">My Requests</h2>
        <button onClick={() => setShowMaterialModal(true)} className="bg-[#0B3C5D] text-white p-2 rounded-lg"><Plus size={18} /></button>
      </div>
      {materials.map(m => (
        <div key={m.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-bold text-slate-800">{m.item}</h4>
              <p className="text-xs text-slate-500">Qty: {m.qty}</p>
            </div>
            <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase ${m.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : m.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
              {m.status}
            </span>
          </div>
          {m.comment && <p className="text-[10px] bg-rose-50 text-rose-600 p-2 rounded mt-2 border border-rose-100 italic">" {m.comment} "</p>}
        </div>
      ))}
    </div>
  );

  const DocsView = () => (
    <div className="space-y-3 pb-24 animate-in fade-in">
       <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-4">Site Documents (Read-Only)</h2>
       {DOCS_DB.map(doc => (
         <div key={doc.id} className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between group active:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400"><FileText size={20} /></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{doc.type}</p>
                <p className="text-sm font-bold text-slate-800">{doc.name}</p>
              </div>
            </div>
            <div className="text-right">
               <p className="text-[10px] text-slate-400 mb-1">{doc.date}</p>
               <button className="text-[10px] font-black text-blue-600 uppercase">View PDF</button>
            </div>
         </div>
       ))}
    </div>
  );

  const ChatView = () => (
    <div className="flex flex-col h-[calc(100vh-160px)] animate-in fade-in pb-20">
      <div className="flex-1 bg-slate-50/50 rounded-2xl border border-slate-100 p-4 space-y-4 overflow-y-auto mb-4">
        <div className="flex flex-col gap-1">
          <div className="max-w-[80%] bg-white p-3 rounded-2xl rounded-tl-none text-xs border border-slate-100 shadow-sm">
            <p className="text-[9px] font-black text-orange-500 uppercase mb-1">Vivek Rathore (Owner)</p>
            Arjun, start columns for the 4th floor only after checking rebar grade. 
            <p className="text-[8px] text-slate-400 mt-1 text-right italic">09:12 AM</p>
          </div>
        </div>
        {syncQueue.filter(q => q === 'chat').map((_, i) => (
          <div key={i} className="flex justify-end gap-1 opacity-50">
            <div className="max-w-[80%] bg-[#0B3C5D] text-white p-3 rounded-2xl rounded-tr-none text-xs">
              Sending... <Clock size={10} className="inline ml-1 animate-spin" />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white p-3 rounded-2xl border border-slate-200 flex gap-2 shadow-lg">
        <button className="p-2 text-slate-400"><Camera size={20} /></button>
        <input type="text" placeholder="Site updates..." className="flex-1 text-sm bg-transparent border-none focus:ring-0" />
        <button 
          onClick={() => { setSyncQueue(prev => [...prev, 'chat']); }}
          className="bg-orange-500 text-white p-2 rounded-xl"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col max-w-md mx-auto relative border-x border-slate-100">
      <Header />

      {/* Offline Alert Bar */}
      {isOffline && (
        <div className="bg-amber-500 text-white text-[10px] font-black py-1.5 px-4 flex items-center justify-center gap-2 uppercase tracking-widest z-40">
          <WifiOff size={12} /> Working Offline • Changes queued
        </div>
      )}

      <main className="flex-1 p-4 overflow-y-auto overflow-x-hidden">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'tasks' && <TasksView />}
        {activeTab === 'materials' && <MaterialsView />}
        {activeTab === 'docs' && <DocsView />}
        {activeTab === 'chat' && <ChatView />}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-100 h-16 flex items-center justify-around z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        {[
          { id: 'home', icon: Home, label: 'Execution' },
          { id: 'tasks', icon: CheckCircle2, label: 'Tasks' },
          { id: 'materials', icon: Truck, label: 'Material' },
          { id: 'chat', icon: MessageSquare, label: 'Chat' },
          { id: 'docs', icon: FileText, label: 'Docs' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all ${activeTab === item.id ? 'text-[#0B3C5D]' : 'text-slate-300'}`}
          >
            <item.icon size={20} className={activeTab === item.id ? 'scale-110' : ''} />
            <span className="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* DPR MODAL (Simplified Data Entry) */}
      {showDprModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex flex-col animate-in fade-in">
          <div className="mt-auto bg-white rounded-t-3xl p-6 pb-12 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Daily Progress Report</h3>
              <button onClick={() => setShowDprModal(false)} className="text-slate-400"><X /></button>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                 <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <label className="text-[8px] font-black text-slate-400 uppercase">Worker Count</label>
                    <input 
                      type="number" 
                      onChange={(e) => setAttendance({...attendance, workers: e.target.value})}
                      placeholder="Total present" 
                      className="w-full bg-transparent border-none p-0 text-sm font-bold focus:ring-0" 
                    />
                 </div>
                 <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <label className="text-[8px] font-black text-slate-400 uppercase">Weather</label>
                    <div className="flex gap-2 mt-1">
                      <Sun size={16} className="text-orange-400" />
                      <Cloud size={16} className="text-slate-300" />
                      <CloudRain size={16} className="text-slate-300" />
                    </div>
                 </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Work Accomplished</label>
                <textarea 
                  rows="3" 
                  placeholder="Concrete poured, rebar bound, etc..." 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#0B3C5D] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                 {[1, 2].map(i => (
                   <div key={i} className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-1 active:bg-slate-100 cursor-pointer">
                      <Camera size={20} />
                      <span className="text-[8px] font-bold uppercase">Photo {i}</span>
                   </div>
                 ))}
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
                 <Navigation size={18} className="text-blue-500" />
                 <div>
                    <p className="text-[10px] font-black text-blue-700 uppercase">GPS Verification</p>
                    <p className="text-[9px] text-blue-600">Location captured: 18.995, 72.822</p>
                 </div>
              </div>
            </div>

            <button 
              onClick={() => { setDprSubmitted(true); setShowDprModal(false); addToSyncQueue('dpr'); }}
              className="w-full py-4 bg-[#0B3C5D] text-white rounded-xl font-black shadow-xl uppercase tracking-widest text-sm"
            >
              Submit Report {isOffline ? '(Queue)' : ''}
            </button>
          </div>
        </div>
      )}

      {/* MATERIAL MODAL */}
      {showMaterialModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex flex-col animate-in fade-in">
          <div className="mt-auto bg-white rounded-t-3xl p-6 pb-12 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Material Indent</h3>
              <button onClick={() => setShowMaterialModal(false)} className="text-slate-400"><X /></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Item Name</label>
                <input type="text" placeholder="e.g. Bricks (Red)" className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Quantity</label>
                  <input type="text" placeholder="e.g. 5000" className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Urgency</label>
                  <select className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm font-bold">
                    <option>Normal</option>
                    <option>Urgent</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Reason for Indent</label>
                <input type="text" placeholder="e.g. Parapet wall work" className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm font-bold" />
              </div>
            </div>
            <button 
              onClick={() => { setShowMaterialModal(false); addToSyncQueue('material-request'); }}
              className="w-full py-4 bg-orange-500 text-white rounded-xl font-black shadow-xl uppercase tracking-widest text-sm"
            >
              Send Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
}