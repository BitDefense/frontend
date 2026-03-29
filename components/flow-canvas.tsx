'use client';

import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { AddNewContractNode } from '@/components/nodes/add-new-contract-node';
import { InvariantNode } from '@/components/nodes/invariant-node';
import { DefenseActionNode } from '@/components/nodes/defense-action-node';
import { ContextMenu } from '@/components/flow/context-menu';

const nodeTypes = {
  addNewContract: AddNewContractNode,
  invariant: InvariantNode,
  defenseAction: DefenseActionNode,
};

const initialNodes = [
  { id: 'node-1', type: 'addNewContract', position: { x: 100, y: 200 }, data: {} },
];

const initialEdges: Edge[] = [];

function FlowCanvasInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [menu, setMenu] = useState<{ x: number; y: number; filter: 'canvas' | 'contract' | 'invariant' } | null>(null);
  const [connectingNode, setConnectingNode] = useState<string | null>(null);
  const { screenToFlowPosition, getNode } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#fff', strokeWidth: 2 } }, eds));
      setConnectingNode(null);
    },
    [setEdges],
  );

  const onPaneContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      setMenu({
        x: event.clientX,
        y: event.clientY,
        filter: 'canvas',
      });
      setConnectingNode(null);
    },
    [],
  );

  const onConnectStart = useCallback((_: any, { nodeId }: { nodeId: string | null }) => {
    setConnectingNode(nodeId);
  }, []);

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!connectingNode) return;

      const targetIsPane = (event.target as Element).classList.contains('react-flow__pane');

      if (targetIsPane) {
        const { clientX, clientY } = 'clientX' in event ? event : event.touches[0];
        const node = getNode(connectingNode);

        // Determine filter based on source node type
        let filter: 'canvas' | 'contract' | 'invariant' = 'contract';
        if (node?.type === 'invariant') {
          filter = 'invariant';
        }

        setMenu({
          x: clientX,
          y: clientY,
          filter,
        });
      }
    },
    [connectingNode, getNode],
  );

  const addNode = useCallback(
    (type: string) => {
      if (!menu) return;

      const id = `${type}-${Date.now()}`;
      const position = screenToFlowPosition({
        x: menu.x,
        y: menu.y,
      });

      const newNode = {
        id,
        type,
        position,
        data: { label: `New ${type}` },
      };

      setNodes((nds) => nds.concat(newNode));

      if (connectingNode) {
        const edge: Edge = {
          id: `e-${connectingNode}-${id}`,
          source: connectingNode,
          target: id,
          animated: true,
          style: { stroke: '#fff', strokeWidth: 2 },
        };
        setEdges((eds) => addEdge(edge, eds));
      }

      setMenu(null);
      setConnectingNode(null);
    },
    [menu, connectingNode, screenToFlowPosition, setNodes, setEdges],
  );

  return (
    <div className="absolute inset-0 z-0">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onPaneContextMenu={onPaneContextMenu}
        nodeTypes={nodeTypes}
        fitView={false}
        className="bg-[#131313]"
      >
        <Background color="rgba(255, 255, 255, 0.05)" gap={40} size={1} />
      </ReactFlow>

      {menu && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          filter={menu.filter}
          onClose={() => {
            setMenu(null);
            setConnectingNode(null);
          }}
          onSelect={addNode}
        />
      )}
    </div>
  );
}

export function FlowCanvas() {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner />
    </ReactFlowProvider>
  );
}
