
import { 
  ReactFlow, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  MiniMap
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  { id: 'doc_1', position: { x: 250, y: 100 }, data: { label: 'Q3 Financial Report.pdf' }, type: 'default', style: { background: 'rgba(59, 130, 246, 0.2)', color: 'white', border: '1px solid #3b82f6', borderRadius: '8px', padding: '10px' } },
  { id: 'doc_2', position: { x: 550, y: 150 }, data: { label: 'Climate Study 2025.csv' }, style: { background: 'rgba(59, 130, 246, 0.2)', color: 'white', border: '1px solid #3b82f6', borderRadius: '8px', padding: '10px' } },
  { id: 'kw_1', position: { x: 400, y: 250 }, data: { label: '#Revenue' }, style: { background: 'rgba(168, 85, 247, 0.2)', color: 'white', border: '1px solid #a855f7', borderRadius: '20px', padding: '8px 16px' } },
  { id: 'kw_2', position: { x: 300, y: 350 }, data: { label: '#Renewable Energy' }, style: { background: 'rgba(168, 85, 247, 0.2)', color: 'white', border: '1px solid #a855f7', borderRadius: '20px', padding: '8px 16px' } },
];

const initialEdges = [
  { id: 'e1-k1', source: 'doc_1', target: 'kw_1', animated: true, style: { stroke: '#60a5fa' } },
  { id: 'e1-k2', source: 'doc_1', target: 'kw_2', animated: true, style: { stroke: '#60a5fa' } },
  { id: 'e2-k2', source: 'doc_2', target: 'kw_2', animated: true, style: { stroke: '#c084fc' } },
];

export const KnowledgeGraph = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="h-[800px] w-full glass-panel rounded-3xl overflow-hidden border border-card-border relative">
      <div className="absolute top-6 left-6 z-10">
        <h2 className="text-2xl font-bold text-white mb-1">Knowledge Graph</h2>
        <p className="text-muted-foreground text-sm">Interactive view of document relationships</p>
      </div>
      
      <div className="absolute bottom-6 left-6 z-10 flex gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-sm text-white">Documents</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-sm text-white">Keywords</span>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        className="bg-background/50"
      >
        <Background color="#333" gap={20} size={1} />
        <Controls className="bg-white/10 fill-white text-white border-white/20" />
        <MiniMap 
          nodeColor={(node) => {
            if (node.id.startsWith('doc')) return '#3b82f6';
            return '#a855f7';
          }}
          maskColor="rgba(0,0,0,0.5)"
          className="bg-black/50 border border-white/10 rounded-xl"
        />
      </ReactFlow>
    </div>
  );
};
