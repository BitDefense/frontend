'use client';

import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Network, Search, Radio, Terminal, ChevronDown, ZoomIn, ZoomOut, Maximize, Play, Upload, X, Cpu, Check } from 'lucide-react';
import { Sora, JetBrains_Mono } from 'next/font/google';
import { ReactFlow, addEdge, Background, useNodesState, useEdgesState, Handle, Position, Connection, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

// --- Custom Nodes ---

function ImportContractNode({ data }: any) {
  const [abiFileName, setAbiFileName] = useState<string | null>(null);
  const [contractAddress, setContractAddress] = useState('');
  const [network, setNetwork] = useState('ethereum');
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFormValid = abiFileName !== null && contractAddress.trim() !== '' && network !== '';

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAbiFileName(file.name);
      setIsSaved(false);
    }
  };

  return (
    <div className="relative w-96 bg-[#1b1b1b]/90 backdrop-blur-md border border-white/10 shadow-2xl group rounded-none">
      <div className="bg-[#353535]/50 p-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <Network className="w-4 h-4 text-white" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">Import Contract</span>
        </div>
        <button 
          onClick={() => setIsSaved(true)}
          disabled={!isFormValid}
          className={`text-[9px] font-mono uppercase tracking-widest px-3 py-1 transition-colors flex items-center gap-1.5 ${
            isSaved
              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
              : isFormValid 
                ? 'bg-white text-black hover:bg-white/90' 
                : 'bg-white/10 text-[#919191] cursor-not-allowed'
          }`}
        >
          {isSaved && <Check className="w-3 h-3" />}
          {isSaved ? 'Saved' : 'Save'}
        </button>
      </div>
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-[#919191]">Contract ABI</label>
          <input
            type="file"
            accept=".json"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          {abiFileName ? (
            <div className="flex items-center justify-between bg-black/40 border border-white/5 px-3 py-2">
              <span className="font-mono text-[11px] text-white/90 truncate mr-2">{abiFileName}</span>
              <button onClick={() => { setAbiFileName(null); setIsSaved(false); }} className="text-[#919191] hover:text-white transition-colors">
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 border-dashed px-3 py-4 flex flex-col items-center justify-center gap-2 transition-colors"
            >
              <Upload className="w-4 h-4 text-[#919191]" />
              <span className="text-[9px] font-mono uppercase text-[#919191] tracking-widest">Upload ABI JSON</span>
            </button>
          )}
        </div>

        <div className="space-y-2 pt-4 border-t border-white/10">
          <label className="text-[10px] uppercase tracking-widest text-[#919191]">Contract Address</label>
          <input 
            type="text"
            value={contractAddress}
            onChange={(e) => { setContractAddress(e.target.value); setIsSaved(false); }}
            placeholder="paste contract address"
            className="bg-black/40 border border-white/5 px-3 py-2 font-mono text-[11px] text-white/90 w-full focus:outline-none focus:border-white/20 placeholder:text-[#919191]/50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-[#919191]">Network</label>
          <div className="relative">
            <select 
              value={network}
              onChange={(e) => { setNetwork(e.target.value); setIsSaved(false); }}
              className="bg-black/40 border border-white/5 px-3 py-2 font-mono text-[11px] text-white/90 w-full focus:outline-none focus:border-white/20 appearance-none cursor-pointer"
            >
              <option value="ethereum">Ethereum</option>
            </select>
            <ChevronDown className="w-3 h-3 text-[#919191] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
      {/* Output Port */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 bg-[#131313] border border-white !rounded-none hover:bg-white hover:scale-150 transition-all right-[-6px]" 
      />
    </div>
  );
}

function ActionNode({ data }: any) {
  return (
    <div className="relative w-72 bg-[#1b1b1b]/90 backdrop-blur-md border border-white/10 shadow-2xl group rounded-none">
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3 bg-[#131313] border border-white !rounded-none hover:bg-white hover:scale-150 transition-all left-[-6px]" 
      />
      <div className="bg-[#353535]/50 p-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <Cpu className="w-4 h-4 text-white" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">Execute Method</span>
        </div>
      </div>
      <div className="p-6">
        <div className="text-[10px] uppercase tracking-widest text-[#919191] border border-white/5 bg-black/40 p-4 text-center border-dashed">
          Awaiting Contract Input...
        </div>
      </div>
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 bg-[#131313] border border-white !rounded-none hover:bg-white hover:scale-150 transition-all right-[-6px]" 
      />
    </div>
  );
}

const nodeTypes = {
  importContract: ImportContractNode,
  action: ActionNode,
};

const initialNodes = [
  { id: 'node-1', type: 'importContract', position: { x: 100, y: 200 }, data: {} },
  { id: 'node-2', type: 'action', position: { x: 600, y: 250 }, data: {} },
];

const initialEdges: Edge[] = [];

// --- Main Dashboard Component ---

export default function Dashboard() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#fff', strokeWidth: 2 } }, eds)),
    [setEdges],
  );

  return (
    <div className={`${sora.variable} ${mono.variable} font-sans bg-[#131313] text-[#e2e2e2] h-screen w-full overflow-hidden selection:bg-white selection:text-black`}>
      
      {/* React Flow Canvas */}
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

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-8 pointer-events-none flex justify-between items-start">
        <div className="pointer-events-auto flex flex-col gap-1">
          <div className="text-2xl font-bold tracking-tighter text-white uppercase">VAULT_PROTOCOL</div>
          <div className="flex gap-6 mt-2">
            <Link href="/dashboard" className="text-[10px] font-bold uppercase tracking-widest text-white border-b border-white pb-1">Dashboard</Link>
            <Link href="/" className="text-[10px] font-medium uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Home</Link>
            <Link href="#" className="text-[10px] font-medium uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Github</Link>
            <Link href="#" className="text-[10px] font-medium uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Whitepaper</Link>
          </div>
        </div>
        <div className="flex items-center gap-6 pointer-events-auto">
          <div className="flex items-center bg-[#1b1b1b]/80 backdrop-blur-md border border-white/10 px-4 py-2 gap-3">
            <Search className="w-4 h-4 text-[#919191]" />
            <input className="bg-transparent border-none focus:outline-none focus:ring-0 text-[10px] font-mono uppercase tracking-[0.2em] w-40 placeholder:text-gray-600 p-0 text-white" placeholder="QUERY_SYSTEM..." type="text" />
          </div>
          <div className="flex items-center gap-1">
            <button className="w-10 h-10 flex items-center justify-center bg-[#1b1b1b]/80 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
              <Radio className="w-4 h-4 text-white" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-[#1b1b1b]/80 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
              <Terminal className="w-4 h-4 text-white" />
            </button>
            <div className="w-10 h-10 bg-[#1b1b1b]/80 backdrop-blur-md border border-white/10 p-1 relative">
              <Image 
                alt="Security Operator" 
                fill
                className="object-cover grayscale" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAF0lvmAkNSJGbFMg09zSc_G0lUNcdw7Gv5I_YPUwLcksTXtjV7-xWTPiRvGZqNqnsF2CfcZPBCtpEkIlzE-XKYGKmYyw9WuGpsyxtDhv5bfssMBxcqDKSh0u3P_p8bmpia8wqq5B_Sx_7-KCicykpsX8orS11FrEjRI_hkK_0JyW7uOWdl42OdbLNQjl6waatLwpkBz2shvY3VJiTK_Etbyi5DlNRV47Q1Uo6A4O-ManJDGYseQalD-lUzzTQx0KFnrD9shpX3OPAG" 
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-8 flex justify-between items-end pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-[#1b1b1b]/80 backdrop-blur-md border border-white/10 p-1 flex items-center">
            <button className="w-10 h-10 flex items-center justify-center hover:bg-white/10 transition-colors">
              <ZoomIn className="w-4 h-4 text-white" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center hover:bg-white/10 transition-colors">
              <ZoomOut className="w-4 h-4 text-white" />
            </button>
            <div className="w-px h-6 bg-white/10 mx-2" />
            <button className="w-10 h-10 flex items-center justify-center hover:bg-white/10 transition-colors">
              <Maximize className="w-4 h-4 text-white" />
            </button>
          </div>
          <button className="pointer-events-auto bg-white text-black h-12 px-8 flex items-center gap-3 hover:bg-white/90 active:scale-95 transition-all">
            <Play className="w-3 h-3 fill-black" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Execute Flow</span>
          </button>
        </div>
        <div className="flex flex-col items-end gap-2 pointer-events-auto text-[10px] uppercase tracking-[0.2em]">
          <div className="flex items-center gap-6 text-gray-400">
            <span>© 2024 TACTICAL_VAULT_SECURITY_PROTOCOL</span>
            <span className="text-white">V2.0.4-LATEST</span>
          </div>
          <div className="flex items-center gap-3 text-[#919191]">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Status: <span className="text-white">Encrypted</span>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .react-flow__edge-path {
          stroke: rgba(255, 255, 255, 0.5);
          stroke-width: 2;
        }
        .react-flow__edge.animated path {
          stroke-dasharray: 5;
          animation: dashdraw 0.5s linear infinite;
        }
        @keyframes dashdraw {
          from { stroke-dashoffset: 10; }
        }
      `}} />
    </div>
  );
}
