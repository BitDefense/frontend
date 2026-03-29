'use client';

import React, { useCallback } from 'react';
import { ReactFlow, addEdge, Background, useNodesState, useEdgesState, Connection, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ImportContractNode } from '@/components/nodes/import-contract-node';
import { ActionNode } from '@/components/nodes/action-node';

const nodeTypes = {
  importContract: ImportContractNode,
  action: ActionNode,
};

const initialNodes = [
  { id: 'node-1', type: 'importContract', position: { x: 100, y: 200 }, data: {} },
  { id: 'node-2', type: 'action', position: { x: 600, y: 250 }, data: {} },
];

const initialEdges: Edge[] = [];

export function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#fff', strokeWidth: 2 } }, eds)),
    [setEdges],
  );

  return (
    <div className="absolute inset-0 z-0">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-[#131313]"
      >
        <Background color="rgba(255, 255, 255, 0.05)" gap={40} size={1} />
      </ReactFlow>
    </div>
  );
}
