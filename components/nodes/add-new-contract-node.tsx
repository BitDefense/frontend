'use client';

import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Network, Search, Upload, Check, X, ChevronDown, ArrowRight, ArrowLeft, Plus } from 'lucide-react';
import { parseSolidityVariables } from '@/lib/solidity-parser';

export type WizardStep = 'SOURCE' | 'INPUT' | 'MAPPING' | 'SAVED';

export interface ContractData {
  address: string;
  network: string;
  source: 'etherscan' | 'file' | null;
  code: string;
  variables: string[];
  mappings: Record<string, string>;
}

export function AddNewContractNode() {
  const [step, setStep] = useState<WizardStep>('SOURCE');
  const [isDragging, setIsDragging] = useState(false);
  const [data, setData] = useState<ContractData>({
    address: '',
    network: 'ethereum',
    source: null,
    code: '',
    variables: [],
    mappings: {}
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.sol')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const vars = parseSolidityVariables(content);
        setData(prev => ({
          ...prev,
          source: 'file',
          code: content,
          variables: vars,
          address: prev.address || file.name
        }));
      };
      reader.readAsText(file);
    }
  };

  const renderSourceStep = () => (
    <div className="p-6 space-y-4">
      <div className="text-[10px] uppercase tracking-[0.2em] text-[#919191] mb-2">Select Source</div>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => { setData(prev => ({ ...prev, source: 'etherscan' })); setStep('INPUT'); }}
          className="flex flex-col items-center gap-3 p-6 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors w-full"
        >
          <Search className="w-5 h-5 text-white" />
          <span className="text-[9px] font-mono uppercase tracking-widest text-white">Etherscan</span>
        </button>
        <button
          onClick={() => { setData(prev => ({ ...prev, source: 'file' })); setStep('INPUT'); }}
          className="flex flex-col items-center gap-3 p-6 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors w-full"
        >
          <Upload className="w-5 h-5 text-white" />
          <span className="text-[9px] font-mono uppercase tracking-widest text-white">Local File</span>
        </button>
      </div>
    </div>
  );

  const renderInputStep = () => {
    const isInputValid = data.address.trim() !== '' && (data.source === 'etherscan' || !!data.code);
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#919191]">
          <button onClick={() => setStep('SOURCE')}><ArrowLeft className="w-3 h-3" /></button>
          {data.source === 'etherscan' ? 'Etherscan Details' : 'Local File Details'}
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Contract Address"
            className="w-full bg-black/40 border border-white/5 p-3 text-[11px] font-mono text-white focus:outline-none focus:border-white/20"
            value={data.address}
            onChange={(e) => setData(prev => ({ ...prev, address: e.target.value }))}
          />
          <select
            className="w-full bg-black/40 border border-white/5 p-3 text-[11px] font-mono text-white appearance-none"
            value={data.network}
            onChange={(e) => setData(prev => ({ ...prev, network: e.target.value }))}
          >
            <option value="ethereum">Ethereum Mainnet</option>
          </select>
        </div>

        {data.source === 'file' ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border border-dashed p-8 text-[10px] text-center uppercase tracking-widest transition-all ${isDragging
              ? 'border-white/40 bg-white/5 text-white'
              : data.code
                ? 'border-green-500/30 bg-green-500/5 text-white'
                : 'border-white/10 text-[#919191]'
              }`}
          >
            {data.code ? (
              <div className="flex flex-col items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-white">File Loaded</span>
              </div>
            ) : (
              isDragging ? 'Drop to upload' : 'Drag & Drop .sol'
            )}
          </div>
        ) : null}

        <button
          disabled={!isInputValid}
          onClick={() => {
            if (data.source === 'etherscan') {
              // Simulated fetch of Example contract
              const exampleCode = `contract Example { public uint256 totalSupply; constructor() { totalSupply = 1 ether; } }`;
              const vars = parseSolidityVariables(exampleCode);
              setData(prev => ({ ...prev, code: exampleCode, variables: vars }));
            }
            setStep('MAPPING');
          }}
          className="w-full bg-white text-black py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {data.source === 'etherscan' ? 'Download & Parse' : 'Continue to Mapping'}
        </button>
      </div>
    );
  };

  const renderMappingStep = () => (
    <div className="p-6 space-y-6">
      <div className="text-[10px] uppercase tracking-widest text-[#919191]">Map Storage Variables</div>
      <div className="max-h-48 overflow-y-auto space-y-3 scrollbar-hide">
        {data.variables.length === 0 ? (
          <div className="text-[10px] text-[#919191] italic py-4 text-center">No variables detected in source code.</div>
        ) : (
          data.variables.map(v => (
            <div key={v} className="flex items-center gap-4 bg-black/20 p-3 border border-white/5">
              <div className="text-[10px] font-mono text-white flex-1 truncate">{v}</div>
              <input
                placeholder="0x Hash"
                className="w-32 bg-black/60 border border-white/10 p-1.5 text-[9px] font-mono text-white focus:border-white/30 outline-none"
                value={data.mappings[v] || ''}
                onChange={(e) => setData(prev => ({
                  ...prev,
                  mappings: { ...prev.mappings, [v]: e.target.value }
                }))}
              />
            </div>
          ))
        )}
      </div>
      <button
        onClick={() => setStep('SAVED')}
        className="w-full bg-white text-black py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-200"
      >
        Save Contract
      </button>
    </div>
  );

  const renderSavedStep = () => (
    <>
      <div className="bg-green-500/10 p-4 border-b border-green-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Check className="w-4 h-4 text-green-400" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">Contract Added</span>
        </div>
        <button onClick={() => setStep('MAPPING')} className="text-[9px] text-[#919191] hover:text-white uppercase">Edit</button>
      </div>
      <div className="p-6">
        <div className="font-mono text-[11px] text-white/60 mb-1">
          {data.address ? `${data.address.slice(0, 10)}...${data.address.slice(-8)}` : 'No Address Provided'}
        </div>
        <div className="text-[9px] uppercase tracking-widest text-neutral-500">
          {Object.keys(data.mappings).length} Variables Mapped
        </div>
      </div>
    </>
  );

  const renderHeader = () => {
    if (step === 'SAVED') return null;
    return (
      <div className="bg-[#353535]/50 p-4 flex items-center border-b border-white/10">
        <div className="flex items-center gap-3">
          <Plus className="w-4 h-4 text-white" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">ADD NEW CONTRACT</span>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-96 bg-[#1b1b1b]/90 backdrop-blur-md border border-white/10 shadow-2xl rounded-none group">
      {renderHeader()}
      {step === 'SOURCE' && renderSourceStep()}
      {step === 'INPUT' && renderInputStep()}
      {step === 'MAPPING' && renderMappingStep()}
      {step === 'SAVED' && renderSavedStep()}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-[#131313] border border-white !rounded-none hover:bg-white hover:scale-150 transition-all right-[-6px]"
      />
    </div>
  );
}
