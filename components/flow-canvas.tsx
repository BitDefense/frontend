'use client';

import React, { useCallback, useState, useMemo, useEffect } from 'react';
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
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { api } from '@/lib/api';
import { AddNewContractNode } from '@/components/nodes/add-new-contract-node';
import { InvariantNode } from '@/components/nodes/invariant-node';
import { DefenseActionNode } from '@/components/nodes/defense-action-node';
import { ContextMenu } from '@/components/flow/context-menu';

const DEFAULT_NODES: Node[] = [
  { id: 'node-1', type: 'addNewContract', position: { x: 100, y: 200 }, data: {} },
];

const DEFAULT_EDGES: Edge[] = [];

/**
 * Helper to transform backend data structure into React Flow nodes and edges.
 * Optimized with Maps for O(N) performance.
 */
function transformInitialData(initialData: any) {
  if (!initialData || (!initialData.contracts?.length && !initialData.invariants?.length && !initialData.defense_actions?.length)) {
    return { nodes: DEFAULT_NODES, edges: DEFAULT_EDGES };
  }

  const newNodes: Node[] = [];
  const newEdges: Edge[] = [];

  // Create lookup maps for performance
  const invariantsMap = new Map(initialData.invariants?.map((inv: any) => [inv.id, inv]));
  const defenseActionsMap = new Map(initialData.defense_actions?.map((da: any) => [da.id, da]));

  // Map Contracts
  initialData.contracts?.forEach((c: any, i: number) => {
    const nodeId = `contract-${c.id}`;
    
    // Transform backend variables (mappings) to frontend variables list
    const frontendVariables = Object.entries(c.variables || {}).map(([name, val]) => ({
      name,
      type: 'uint256' // Default type for display
    }));

    newNodes.push({
      id: nodeId,
      type: 'addNewContract',
      position: { x: 100, y: 100 + i * 400 },
      data: { 
        ...c, 
        backendId: c.id, 
        step: 'SAVED',
        mappings: c.variables || {},
        variables: frontendVariables
      }
    });

    // Map Invariants for this contract
    c.invariant_ids?.forEach((invId: number, j: number) => {
      const inv = invariantsMap.get(invId);
      if (!inv) return;

      const invNodeId = `invariant-${inv.id}`;
      newNodes.push({
        id: invNodeId,
        type: 'invariant',
        position: { x: 550, y: 100 + i * 400 + j * 150 },
        data: { 
          ...inv, 
          backendId: inv.id, 
          step: 'SAVED',
          selectedVar: inv.target,
          operator: inv.type,
          threshold: inv.target,
          selectedVarType: inv.slot_type
        }
      });
      
      newEdges.push({
        id: `e-${nodeId}-${invNodeId}`,
        source: nodeId,
        target: invNodeId,
        animated: true,
        style: { stroke: '#fff', strokeWidth: 2 }
      });

      // Map Defense Actions for this invariant
      inv.defense_action_ids?.forEach((daId: number, k: number) => {
        const da = defenseActionsMap.get(daId);
        if (!da) return;

        const daNodeId = `da-${da.id}`;
        newNodes.push({
          id: daNodeId,
          type: 'defenseAction',
          position: { x: 1000, y: 100 + i * 400 + j * 150 + k * 100 },
          data: { 
            ...da, 
            backendId: da.id, 
            step: 'SAVED',
            actionType: da.type,
            params: {
              botToken: da.tg_api_key,
              chatId: da.tg_chat_id,
              roleAddress: da.role_id,
              functionHex: da.function_sig,
              args: da.calldata
            }
          }
        });
        
        newEdges.push({
          id: `e-${invNodeId}-${daNodeId}`,
          source: invNodeId,
          target: daNodeId,
          animated: true,
          style: { stroke: '#fff', strokeWidth: 2 }
        });
      });
    });
  });

  return { nodes: newNodes, edges: newEdges };
}

function FlowCanvasInner({ initialData }: { initialData?: any }) {
  // Compute initial state from data to avoid hydration flickers
  const transformedInitial = useMemo(() => transformInitialData(initialData), [initialData]);

  const [nodes, setNodes, onNodesChange] = useNodesState(transformedInitial.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(transformedInitial.edges);
  const [menu, setMenu] = useState<{ x: number; y: number; filter: 'canvas' | 'contract' | 'invariant' } | null>(null);
  const [connectingNode, setConnectingNode] = useState<string | null>(null);

  const { screenToFlowPosition, getNode, getEdges } = useReactFlow();

  // Sync state if initialData changes after mount
  useEffect(() => {
    if (initialData) {
      const { nodes: newNodes, edges: newEdges } = transformInitialData(initialData);
      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [initialData, setNodes, setEdges]);

  const handleLinkNodes = useCallback(async (sourceId: string, targetId: string, overrideBackendId?: { id: string, backendId: number }) => {
    const sourceNode = getNode(sourceId);
    const targetNode = getNode(targetId);
    if (!sourceNode || !targetNode) return;

    const sourceBackendId = overrideBackendId?.id === sourceId ? overrideBackendId.backendId : sourceNode.data?.backendId;
    const targetBackendId = overrideBackendId?.id === targetId ? overrideBackendId.backendId : targetNode.data?.backendId;

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
          variables: data.mappings || {},
        }, backendId);

        if (!backendId && result?.id) {
          await api.linkDashboardContract(1, result.id);
        }
      } else if (node.type === 'invariant') {
        const parentEdge = getEdges().find(e => e.target === nodeId);
        const parentNode = parentEdge ? getNode(parentEdge.source) : null;
        
        const contractAddress = parentNode?.data?.address || '0x0';
        const storageSlot = parentNode?.data?.mappings?.[data.selectedVar] || '0x0';

        result = await api.saveInvariant({
          contract: contractAddress,
          type: data.operator,
          target: data.threshold,
          storage: storageSlot,
          slot_type: data.selectedVarType,
          network: 'ethereum'
        }, backendId);
      } else if (node.type === 'defenseAction') {
        result = await api.saveDefenseAction({
          type: data.actionType,
          network: 'ethereum',
          tg_api_key: data.params.botToken || null,
          tg_chat_id: data.params.chatId || null,
          role_id: data.params.roleAddress || null,
          function_sig: data.params.functionHex || null,
          calldata: data.params.args || null,
        }, backendId);
      }

      if (result?.id) {
        setNodes((nds) => nds.map((n) => n.id === nodeId ? { ...n, data: { ...n.data, backendId: result.id } } : n));
        
        const connectedEdges = getEdges().filter(edge => edge.source === nodeId || edge.target === nodeId);
        connectedEdges.forEach(edge => {
          handleLinkNodes(edge.source, edge.target, { id: nodeId, backendId: result.id });
        });
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error';
      console.error(`Failed to save node ${nodeId}:`, errorMessage);
      throw e;
    }
  }, [getNode, getEdges, setNodes, handleLinkNodes]);

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

  const onNodesDelete = useCallback(async (deletedNodes: Node[]) => {
    for (const node of deletedNodes) {
      const backendId = (node.data as any)?.backendId;
      if (!backendId) continue;

      try {
        if (node.type === 'addNewContract') {
          await api.deleteContract(backendId);
        } else if (node.type === 'invariant') {
          await api.deleteInvariant(backendId);
        } else if (node.type === 'defenseAction') {
          await api.deleteDefenseAction(backendId);
        }
      } catch (e) {
        console.error(`Failed to delete node ${node.id} (Backend ID: ${backendId}):`, e);
      }
    }
  }, []);

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

      const newNode: Node = {
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
    <div className="absolute inset-0 z-0" aria-label="Defensive Flow Canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgesDelete={onEdgesDelete}
        onNodesDelete={onNodesDelete}
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

export function FlowCanvas({ initialData }: { initialData?: any }) {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner initialData={initialData} />
    </ReactFlowProvider>
  );
}

