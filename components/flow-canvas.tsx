'use client';

import React, { useCallback } from 'react';
import { ReactFlow, addEdge, Background, useNodesState, useEdgesState, Connection, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { AddNewContractNode } from '@/components/nodes/add-new-contract-node';
import { ActionNode } from '@/components/nodes/action-node';
import { InvariantNode } from '@/components/nodes/invariant-node';

const nodeTypes = {
  addNewContract: AddNewContractNode,
  action: ActionNode,
  invariant: InvariantNode,
};

const initialNodes = [
  { id: 'node-1', type: 'addNewContract', position: { x: 100, y: 200 }, data: {} },
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
        fitView={false}
        className="bg-[#131313]"
      >
        <Background color="rgba(255, 255, 255, 0.05)" gap={40} size={1} />
      </ReactFlow>
    </div >
  );
}
