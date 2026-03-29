'use client';

import React, { useState, useRef } from 'react';
import { Network, Check, X, Upload, ChevronDown } from 'lucide-react';
import { Handle, Position } from '@xyflow/react';

export function ImportContractNode() {
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
