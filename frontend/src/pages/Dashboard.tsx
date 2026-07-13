import { useEffect, useState } from 'react';
import { BarChart3, Database, Link as LinkIcon, Hash } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, delay }: { title: string, value: string | number, icon: any, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="glass-panel p-6 rounded-2xl relative overflow-hidden group"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className="text-muted-foreground font-medium">{title}</div>
      <div className="p-2 bg-white/5 rounded-lg text-primary">
        <Icon size={20} />
      </div>
    </div>
    <div className="text-3xl font-bold text-white relative z-10">{value}</div>
  </motion.div>
);

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUploads: 0,
    knowledgeConnections: 0,
    keywordsExtracted: 0,
    processedDocuments: 0
  });

  useEffect(() => {
    // In a real app, fetch from backend /api/analytics
    // Mocking for now before connecting API
    setTimeout(() => {
      setStats({
        totalUploads: 124,
        knowledgeConnections: 892,
        keywordsExtracted: 3450,
        processedDocuments: 124
      });
    }, 1000);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Overview</h2>
        <p className="text-muted-foreground">Welcome to the brain. Here is your knowledge summary.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard delay={0.1} title="Total Documents" value={stats.totalUploads} icon={Database} />
        <StatCard delay={0.2} title="Processed" value={stats.processedDocuments} icon={BarChart3} />
        <StatCard delay={0.3} title="Connections" value={stats.knowledgeConnections} icon={LinkIcon} />
        <StatCard delay={0.4} title="Keywords Extracted" value={stats.keywordsExtracted} icon={Hash} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="glass-panel rounded-2xl p-6 lg:col-span-2 h-[400px] flex flex-col"
        >
          <h3 className="text-xl font-semibold mb-4">Knowledge Growth</h3>
          <div className="flex-1 flex items-center justify-center text-muted-foreground/50 border border-dashed border-card-border rounded-xl">
            [Chart Area: Recharts Integration Pending]
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="glass-panel rounded-2xl p-6 h-[400px] flex flex-col"
        >
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="flex-1 flex items-center justify-center text-muted-foreground/50 border border-dashed border-card-border rounded-xl">
            [Activity Timeline]
          </div>
        </motion.div>
      </div>
    </div>
  );
};
