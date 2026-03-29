'use client';

import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Network, Search, Upload, Check, X, ChevronDown, ArrowRight, ArrowLeft } from 'lucide-react';

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
  const [data, setData] = useState<ContractData>({
    address: '',
    network: 'ethereum',
    source: null,
    code: '',
    variables: [],
    mappings: {}
  });

  return (
    <div className="relative w-96 bg-[#1b1b1b]/90 backdrop-blur-md border border-white/10 shadow-2xl rounded-none overflow-hidden">
      {/* Step rendering will go here */}
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-[#131313] border border-white !rounded-none" />
    </div>
  );
}
