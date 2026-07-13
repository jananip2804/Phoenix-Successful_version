
import { useEffect, useState } from 'react';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  MiniMap
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ref, onValue } from 'firebase/database';
import { rtdb } from '../services/firebase';

export const KnowledgeGraph = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const graphRef = ref(rtdb, 'graph/main');
    const unsubscribe = onValue(graphRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data.nodes) {
          setNodes(data.nodes.map((n: any) => ({
            id: n.id,
            position: n.position || { x: Math.random() * 500, y: Math.random() * 500 },
            data: { label: n.label || n.data?.label || 'Node' },
            type: n.type || 'default',
            style: n.style || (n.id.startsWith('doc') 
              ? { background: 'rgba(59, 130, 246, 0.2)', color: 'white', border: '1px solid #3b82f6', borderRadius: '8px', padding: '10px' }
              : { background: 'rgba(168, 85, 247, 0.2)', color: 'white', border: '1px solid #a855f7', borderRadius: '20px', padding: '8px 16px' })
          })));
        }
        if (data.edges) {
          setEdges(data.edges.map((e: any) => ({
            id: e.id,
            source: e.source,
            target: e.target,
            animated: e.animated !== undefined ? e.animated : true,
            style: e.style || { stroke: '#60a5fa' }
          })));
        }
      }
    });

    return () => unsubscribe();
  }, [setNodes, setEdges]);

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
