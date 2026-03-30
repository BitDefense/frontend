'use client';

import React, { useCallback, useState, useMemo } from 'react';
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

import { api } from '@/lib/api';
import { AddNewContractNode } from '@/components/nodes/add-new-contract-node';
import { InvariantNode } from '@/components/nodes/invariant-node';
import { DefenseActionNode } from '@/components/nodes/defense-action-node';
import { ContextMenu } from '@/components/flow/context-menu';

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

  const handleLinkNodes = useCallback(async (sourceId: string, targetId: string) => {
    const sourceNode = getNode(sourceId);
    const targetNode = getNode(targetId);
    if (!sourceNode || !targetNode) return;

    const sourceBackendId = sourceNode.data?.backendId;
    const targetBackendId = targetNode.data?.backendId;

    if (!sourceBackendId || !targetBackendId) return;

    try {
      if (sourceNode.type === 'addNewContract' && targetNode.type === 'invariant') {
        await api.linkContractInvariant(sourceBackendId, targetBackendId);
      } else if (sourceNode.type === 'invariant' && targetNode.type === 'defenseAction') {
        await api.linkInvariantAction(sourceBackendId, targetBackendId);
      }
    } catch (e) {
      console.error('Failed to link nodes:', e);
    }
  }, [getNode]);

  const handleUnlinkNodes = useCallback(async (sourceId: string, targetId: string) => {
    const sourceNode = getNode(sourceId);
    const targetNode = getNode(targetId);
    if (!sourceNode || !targetNode) return;

    const sourceBackendId = sourceNode.data?.backendId;
    const targetBackendId = targetNode.data?.backendId;

    if (!sourceBackendId || !targetBackendId) return;

    try {
      if (sourceNode.type === 'addNewContract' && targetNode.type === 'invariant') {
        await api.unlinkContractInvariant(sourceBackendId, targetBackendId);
      } else if (sourceNode.type === 'invariant' && targetNode.type === 'defenseAction') {
        await api.unlinkInvariantAction(sourceBackendId, targetBackendId);
      }
    } catch (e) {
      console.error('Failed to unlink nodes:', e);
    }
  }, [getNode]);

  const onNodeSave = useCallback(async (nodeId: string, data: any) => {
    const node = getNode(nodeId);
    if (!node) return;

    let result;
    const backendId = node.data?.backendId;

    try {
      if (node.type === 'addNewContract') {
        result = await api.saveContract({
          address: data.address,
          network: data.network,
          variables: data.variables.reduce((acc: any, v: any) => ({ ...acc, [v.name]: v.type }), {}),
        }, backendId);

        if (!backendId && result?.id) {
          await api.linkDashboardContract(1, result.id);
        }
      } else if (node.type === 'invariant') {
        result = await api.saveInvariant({
          contract: data.selectedVar, // Placeholder mapping
          type: 'threshold',
          target: data.selectedVar,
          storage: '0x0', // Placeholder
          slot_type: data.selectedVarType,
          network: 'ethereum'
        }, backendId);
      } else if (node.type === 'defenseAction') {
        result = await api.saveDefenseAction({
          type: data.actionType,
          network: 'ethereum',
          tg_api_key: data.params.botToken,
          tg_chat_id: data.params.chatId,
        }, backendId);
      }

      if (result?.id) {
        setNodes((nds) => nds.map((n) => n.id === nodeId ? { ...n, data: { ...n.data, backendId: result.id } } : n));
      }
    } catch (e) {
      console.error(`Failed to save node ${nodeId}:`, e);
      throw e; // Re-throw to let the node handle UI state if needed
    }
  }, [getNode, setNodes]);

  const nodeTypes = useMemo(() => ({
    addNewContract: (props: any) => <AddNewContractNode {...props} onSave={(data: any) => onNodeSave(props.id, data)} />,
    invariant: (props: any) => <InvariantNode {...props} onSave={(data: any) => onNodeSave(props.id, data)} />,
    defenseAction: (props: any) => <DefenseActionNode {...props} onSave={(data: any) => onNodeSave(props.id, data)} />,
  }), [onNodeSave]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#fff', strokeWidth: 2 } }, eds));
      setConnectingNode(null);
      if (params.source && params.target) {
        handleLinkNodes(params.source, params.target);
      }
    },
    [setEdges, handleLinkNodes],
  );

  const onEdgesDelete = useCallback((deletedEdges: Edge[]) => {
    deletedEdges.forEach(edge => {
      handleUnlinkNodes(edge.source, edge.target);
    });
  }, [handleUnlinkNodes]);

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
        handleLinkNodes(connectingNode, id);
      }

      setMenu(null);
      setConnectingNode(null);
    },
    [menu, connectingNode, screenToFlowPosition, setNodes, setEdges, handleLinkNodes],
  );

  return (
    <div className="absolute inset-0 z-0">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgesDelete={onEdgesDelete}
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
