import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  HardHat, 
  Briefcase, 
  ClipboardCheck, 
  Truck, 
  MessageSquare, 
  FileText, 
  Users, 
  Plus, 
  Search, 
  Bell, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Download,
  Share2,
  Menu,
  Wifi,
  WifiOff,
  TrendingUp,
  MapPin,
  IndianRupee,
  ShieldCheck,
  History
} from 'lucide-react';

// --- STYLING CONSTANTS ---
const COLORS = {
  primary: '#0B3C5D', // Deep Blue
  accent: '#F97316',  // Safety Orange
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  neutral: '#F3F4F6'
};

// --- MOCK DATA ---
const INITIAL_PROJECTS = [
  {
    id: 'p1',
    name: 'Skyline Residency',
    location: 'Worli, Mumbai',
    budgetSlab: '₹20+ Lakh',
    trustScore: 88,
    progress: 65,
    code: 'SETU-MUM-001',
    status: 'Active',
    engineers: ['eng-101'],
    totalSpend: 1250000,
    attendanceRate: 92,
    delayedTasks: 2,
    createdAt: '2023-10-15'
  },
  {
    id: 'p2',
    name: 'Green Valley Villas',
    location: 'Sector 45, Gurgaon',
    budgetSlab: '₹5–20 Lakh',
    trustScore: 72,
    progress: 30,
    code: 'SETU-GUR-042',
    status: 'Active',
    engineers: ['eng-102'],
    totalSpend: 450000,
    attendanceRate: 78,
    delayedTasks: 5,
    createdAt: '2023-11-20'
  }
];

const ENGINEERS = [
  { id: 'eng-101', name: 'Arjun Mehta', project: 'Skyline Residency', status: 'Active', phone: '+91 98765 43210' },
  { id: 'eng-102', name: 'Suresh Kumar', project: 'Green Valley Villas', status: 'Pending', phone: '+91 91234 56789' }
];

const MATERIAL_REQUESTS = [
  { id: 'mr-1', projectId: 'p1', item: 'OPC 53 Grade Cement', qty: '200 Bags', urgency: 'High', engineer: 'Arjun Mehta', status: 'Pending', reason: 'Foundations for Wing B' },
  { id: 'mr-2', projectId: 'p2', item: 'TMT Steel 12mm', qty: '5 Tons', urgency: 'Medium', engineer: 'Suresh Kumar', status: 'Approved', reason: 'Slab reinforcement' }
];

const AUDIT_LOGS = [
  { id: 'a1', action: 'Approved Material Request', user: 'Owner', target: 'MR-002', time: '2 hours ago', project: 'Green Valley' },
  { id: 'a2', action: 'New Engineer Invited', user: 'Owner', target: 'Suresh Kumar', time: '1 day ago', project: 'System' },
  { id: 'a3', action: 'DPR Submitted', user: 'Arjun Mehta', target: 'Oct 24 Report', time: '3 hours ago', project: 'Skyline Residency' }
];

// --- COMPONENTS ---

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold mt-1 text-slate-800">{value}</h3>
      {trend && <p className={`text-xs mt-2 font-medium ${trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
      </p>}
    </div>
    <div className={`p-3 rounded-lg bg-opacity-10`} style={{ backgroundColor: color + '20', color: color }}>
      <Icon size={20} />
    </div>
  </div>
);

const TrustScoreBadge = ({ score }) => {
  const getColor = (s) => {
    if (s > 80) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (s > 60) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-rose-600 bg-rose-50 border-rose-100';
  };
  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-bold ${getColor(score)}`}>
      <ShieldCheck size={12} />
      {score}/100
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [showAddProject, setShowAddProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Simulate Offline/Sync UX
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isOffline) {
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), 2000);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [isOffline]);

  const toggleOffline = () => setIsOffline(!isOffline);

  // Views
  const DashboardView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Projects" value={projects.length} icon={Briefcase} color={COLORS.primary} />
        <StatCard title="Total Spend" value={`₹${(projects.reduce((acc, p) => acc + p.totalSpend, 0) / 100000).toFixed(1)}L`} icon={IndianRupee} color={COLORS.success} trend={12} />
        <StatCard title="Pending Approvals" value={MATERIAL_REQUESTS.filter(r => r.status === 'Pending').length} icon={Clock} color={COLORS.warning} />
        <StatCard title="Avg. Attendance" value="85%" icon={Users} color={COLORS.accent} trend={-2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800">Recent Projects</h3>
            <button onClick={() => setActiveTab('projects')} className="text-sm text-blue-600 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {projects.map(project => (
              <div key={project.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => {setSelectedProject(project); setActiveTab('project-detail')}}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                    <HardHat size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{project.name}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={10} /> {project.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="hidden md:block">
                    <p className="text-[10px] text-gray-400 uppercase font-bold text-right">Progress</p>
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-orange-500" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>
                  <TrustScoreBadge score={project.trustScore} />
                  <ChevronRight size={18} className="text-gray-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <History size={18} className="text-gray-400" />
            Audit Trail
          </h3>
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-100"></div>
            <div className="space-y-6 relative">
              {AUDIT_LOGS.map(log => (
                <div key={log.id} className="flex gap-4 pl-8 relative">
                  <div className="absolute left-1.5 top-1 w-3 h-3 rounded-full bg-white border-2 border-slate-400"></div>
                  <div>
                    <p className="text-sm text-slate-700 font-medium">{log.action}</p>
                    <p className="text-xs text-slate-400">{log.user} • {log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ProjectsView = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Project Management</h2>
        <button 
          onClick={() => setShowAddProject(true)}
          className="flex items-center justify-center gap-2 bg-[#0B3C5D] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all shadow-md"
        >
          <Plus size={18} /> Add New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-5 border-b border-gray-50 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded uppercase tracking-wider">{p.status}</span>
                <h3 className="text-lg font-bold text-slate-800 mt-2">{p.name}</h3>
                <p className="text-sm text-slate-500">{p.location}</p>
              </div>
              <TrustScoreBadge score={p.trustScore} />
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Budget Slab:</span>
                <span className="font-semibold text-slate-700">{p.budgetSlab}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Project Code:</span>
                <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded select-all cursor-pointer">{p.code}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-500">Completion</span>
                  <span className="text-slate-800">{p.progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0B3C5D]" style={{ width: `${p.progress}%` }}></div>
                </div>
              </div>
            </div>
            <div className="px-5 py-4 bg-gray-50 flex gap-2">
              <button 
                onClick={() => {setSelectedProject(p); setActiveTab('project-detail')}}
                className="flex-1 text-sm font-semibold text-[#0B3C5D] py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-100"
              >
                View Details
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 bg-white border border-gray-200 rounded-lg">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const MaterialsView = () => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-slate-800">Material Requests</h2>
        <p className="text-sm text-slate-500">Review and approve site resource requirements</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-gray-100">
              <th className="px-6 py-4">Item & Qty</th>
              <th className="px-6 py-4">Project / Site Engineer</th>
              <th className="px-6 py-4">Urgency</th>
              <th className="px-6 py-4">Reason</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {MATERIAL_REQUESTS.map(req => (
              <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-5">
                  <p className="font-bold text-slate-800">{req.item}</p>
                  <p className="text-xs text-slate-500">Qty: {req.qty}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm font-medium text-slate-700">{req.projectId === 'p1' ? 'Skyline Residency' : 'Green Valley'}</p>
                  <p className="text-xs text-slate-500">By {req.engineer}</p>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${req.urgency === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                    {req.urgency.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-5 text-sm text-slate-600 max-w-[200px] truncate">{req.reason}</td>
                <td className="px-6 py-5">
                  {req.status === 'Pending' ? (
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100" title="Approve">
                        <CheckCircle2 size={18} />
                      </button>
                      <button className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100" title="Reject">
                        <XCircle size={18} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-emerald-500 flex items-center gap-1 text-sm font-bold">
                      <CheckCircle2 size={16} /> Approved
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const PaperworkView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { title: 'Project Reports', desc: 'Summary of work, labor and materials', icon: ClipboardCheck },
        { title: 'GST Invoices', desc: 'Mock format for site vendor billing', icon: FileText },
        { title: 'Material POs', desc: 'Standard Purchase Orders for suppliers', icon: Truck },
        { title: 'Quotations', desc: 'Estimate documents for client updates', icon: IndianRupee },
        { title: 'Work Certificates', desc: 'Handover and completion proofs', icon: CheckCircle2 },
      ].map((doc, idx) => (
        <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 group hover:border-orange-200 transition-all cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <doc.icon size={24} />
          </div>
          <h3 className="font-bold text-slate-800 text-lg mb-1">{doc.title}</h3>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">{doc.desc}</p>
          <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-[#0B3C5D] border border-[#0B3C5D] rounded-lg hover:bg-slate-50">
            <Download size={16} /> Generate & Download
          </button>
        </div>
      ))}
    </div>
  );

  const ChatView = () => (
    <div className="bg-white rounded-xl border border-gray-200 h-[calc(100vh-200px)] flex flex-col md:flex-row overflow-hidden">
      <div className="w-full md:w-80 border-r border-gray-100 bg-slate-50 hidden md:block">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-bold text-slate-800">Project Chats</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {projects.map(p => (
            <div key={p.id} className="p-4 hover:bg-white cursor-pointer transition-colors border-l-4 border-transparent hover:border-orange-500">
              <h4 className="text-sm font-bold text-slate-800">{p.name}</h4>
              <p className="text-xs text-slate-500 truncate mt-1">Eng. {ENGINEERS.find(e => e.project === p.name)?.name}: Slabs done...</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">AM</div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Skyline Residency Site Chat</h4>
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Online
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-[#F8FAFC]">
          <div className="max-w-[80%] bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 text-sm">
            <p className="text-xs font-bold text-orange-500 mb-1">Arjun Mehta (Site Engineer)</p>
            Good morning sir, 5 tons of steel received. Unloading now. Will update DPR by evening.
            <p className="text-[10px] text-slate-400 mt-1 text-right italic">09:45 AM</p>
          </div>
          <div className="max-w-[80%] ml-auto bg-[#0B3C5D] text-white p-3 rounded-2xl rounded-tr-none shadow-sm text-sm">
            Please check the gauge quality before finalizing the GRN. I've heard issues with this batch.
            <p className="text-[10px] text-white/60 mt-1 text-right italic">10:12 AM</p>
          </div>
        </div>
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Type message to site engineer..." 
              className="flex-1 bg-slate-100 border-none rounded-lg px-4 text-sm focus:ring-2 focus:ring-[#0B3C5D]"
            />
            <button className="bg-[#0B3C5D] text-white p-2 rounded-lg">
              <MessageSquare size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800 font-sans">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0B3C5D] text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center font-black text-xl italic shadow-lg">S</div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">SiteSetu</h1>
              <p className="text-[10px] text-slate-300 uppercase tracking-widest font-bold">Owner Terminal</p>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'projects', label: 'Projects', icon: Briefcase },
              { id: 'engineers', label: 'Site Engineers', icon: HardHat },
              { id: 'materials', label: 'Material Approvals', icon: Truck },
              { id: 'chat', label: 'Site Comms', icon: MessageSquare },
              { id: 'paperwork', label: 'Paperwork Center', icon: FileText },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id ? 'bg-white/10 text-orange-400 border-r-4 border-orange-500' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-[#072c44]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center font-bold text-[#0B3C5D]">VR</div>
            <div>
              <p className="text-sm font-bold">Vivek Rathore</p>
              <p className="text-[10px] text-slate-400">Owner Account</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 hover:bg-gray-100 rounded" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              All sites operational
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleOffline}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${isOffline ? 'bg-rose-50 text-rose-600' : isSyncing ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}
            >
              {isOffline ? <WifiOff size={14} /> : <Wifi size={14} />}
              {isOffline ? 'OFFLINE MODE' : isSyncing ? 'SYNCING...' : 'ONLINE'}
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'projects' && <ProjectsView />}
          {activeTab === 'materials' && <MaterialsView />}
          {activeTab === 'paperwork' && <PaperworkView />}
          {activeTab === 'chat' && <ChatView />}
          
          {/* Simple Detail View for Project */}
          {activeTab === 'project-detail' && selectedProject && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <button onClick={() => setActiveTab('projects')} className="p-2 hover:bg-white rounded-full"><ChevronRight size={20} className="rotate-180" /></button>
                <h2 className="text-2xl font-bold text-slate-800">{selectedProject.name}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  {/* Daily Progress Section */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-bold mb-4 flex items-center justify-between">
                      Daily Progress Reports
                      <button className="text-sm text-blue-600">Export All</button>
                    </h3>
                    <div className="space-y-6">
                      {[
                        { date: 'Today, Oct 24', work: 'Column casting for 4th floor. 40 cubic meters poured.', labor: 18, delay: 'None' },
                        { date: 'Yesterday, Oct 23', work: 'Rebar binding for 4th floor columns. Inspection completed.', labor: 15, delay: '2 hrs (Material arrival delay)' }
                      ].map((dpr, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-bold text-slate-800 text-sm">{dpr.date}</p>
                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">SUBMITTED</span>
                          </div>
                          <p className="text-sm text-slate-600 mb-3">{dpr.work}</p>
                          <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-400">
                            <span className="flex items-center gap-1"><Users size={14} /> {dpr.labor} Workers Present</span>
                            <span className="flex items-center gap-1"><Clock size={14} /> Delay: {dpr.delay}</span>
                          </div>
                          <div className="mt-4 flex gap-2">
                            {[1, 2, 3].map(img => (
                              <div key={img} className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center text-[10px] text-slate-400 border border-slate-300">Photo {img}</div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Attendance Summary */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-bold mb-4">Attendance Summary</h3>
                    <div className="space-y-3">
                      {['Manoj Yadav', 'Prakash Singh', 'Amit Kumar', 'Rohit Das'].map(worker => (
                        <div key={worker} className="flex justify-between items-center text-sm py-2 border-b border-gray-50 last:border-0">
                          <span className="font-medium text-slate-700">{worker}</span>
                          <span className="text-emerald-500 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">P (08:30 AM)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trust Score Breakdown */}
                  <div className="bg-[#0B3C5D] rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold">Trust Score Breakdown</h3>
                      <ShieldCheck size={20} className="text-orange-400" />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-300">DPR Consistency</span>
                          <span className="font-bold">95%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full"><div className="h-full bg-emerald-400 w-[95%]"></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-300">Material Accuracy</span>
                          <span className="font-bold">82%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full"><div className="h-full bg-orange-400 w-[82%]"></div></div>
                      </div>
                    </div>
                    <p className="text-[10px] mt-6 text-slate-400 leading-relaxed italic">
                      Calculated automatically based on site activity, daily reports, and material handling accuracy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Project Modal Mock */}
      {showAddProject && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Initiate New Project</h3>
              <button onClick={() => setShowAddProject(false)} className="text-slate-400 hover:text-slate-600"><XCircle size={24} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Project Name</label>
                <input type="text" placeholder="e.g. Skyline Tower" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0B3C5D]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Location</label>
                  <input type="text" placeholder="Mumbai, IN" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Budget Slab</label>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                    <option>Below ₹5 Lakh</option>
                    <option>₹5–20 Lakh</option>
                    <option>₹20+ Lakh</option>
                  </select>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-3">
                <p className="text-xs text-blue-700 font-medium">On creation, we'll generate a secure Site Engineer invite link.</p>
                <div className="flex gap-2">
                   <div className="flex-1 bg-white border border-blue-200 px-3 py-2 rounded text-xs font-mono text-blue-800 flex items-center">SETU-TEMP-XXXXX</div>
                   <button className="bg-blue-600 text-white px-3 py-2 rounded text-xs font-bold flex items-center gap-1"><Plus size={14}/> Generate</button>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowAddProject(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg font-bold text-slate-600 hover:bg-white">Cancel</button>
              <button onClick={() => setShowAddProject(false)} className="flex-1 px-4 py-2 bg-[#0B3C5D] text-white rounded-lg font-bold shadow-lg shadow-blue-900/20">Launch Project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}