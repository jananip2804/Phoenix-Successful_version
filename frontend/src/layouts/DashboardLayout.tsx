import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Share2, Search, BarChart3, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, path, active }) => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate(path)}
      className={cn(
        "flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-all duration-300",
        active ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-white"
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </div>
  );
};

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 glass-panel border-r border-card-border flex flex-col z-10">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gradient tracking-tight flex items-center gap-2">
            <span className="text-primary">✦</span> Phoenix
          </h1>
        </div>
        
        <div className="flex-1 px-4 py-4 space-y-2">
          <SidebarItem icon={BarChart3} label="Dashboard" path="/dashboard" active={window.location.pathname === '/dashboard'} />
          <SidebarItem icon={Upload} label="Upload" path="/upload" active={window.location.pathname === '/upload'} />
          <SidebarItem icon={FileText} label="Documents" path="/documents" active={window.location.pathname.startsWith('/documents')} />
          <SidebarItem icon={Search} label="Semantic Search" path="/search" active={window.location.pathname === '/search'} />
          <SidebarItem icon={Share2} label="Knowledge Graph" path="/graph" active={window.location.pathname === '/graph'} />
        </div>
        
        <div className="p-4 border-t border-card-border/50">
          <SidebarItem icon={Settings} label="Settings" path="/settings" />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] translate-x-1/4 translate-y-1/4 pointer-events-none" />
        
        {/* Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto z-10 relative">
          <div className="p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
