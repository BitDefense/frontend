import { Lock, Network, Box } from 'lucide-react';

export function Protocols() {
  const protocols = [
    {
      icon: <Lock className="w-5 h-5 text-white mb-12" strokeWidth={1.5} />,
      title: 'Permissionless',
      desc: 'No KYC. No sales calls. No gatekeeping. Kinetic Vault is accessible to any protocol or user through direct smart contract interaction.',
      status: 'Access_Granted_'
    },
    {
      icon: <Network className="w-5 h-5 text-white mb-12" strokeWidth={1.5} />,
      title: 'Decentralized',
      desc: 'No single point of failure. Security analysis is distributed across a global network of independent miners ensuring censorship resistance.',
      status: 'Network_Distributed_'
    },
    {
      icon: <Box className="w-5 h-5 text-white mb-12" strokeWidth={1.5} />,
      title: 'Incentivized',
      desc: 'Leveraging the Bittensor incentive structure to reward the most accurate and fastest security analysis providers in the ecosystem.',
      status: 'Reward_Cycle_Active_'
    }
  ];

  return (
    <section className="px-6 py-24 md:px-12 md:py-32 max-w-[1600px] mx-auto">
      <h2 className="text-4xl md:text-6xl font-black leading-[0.9] tracking-[-0.03em] uppercase mb-16">
        Core Protocols
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {protocols.map((protocol, i) => (
          <div key={i} className="bg-[#1b1b1b] p-10 flex flex-col h-[400px] group hover:bg-[#222222] transition-colors">
            {protocol.icon}
            <h3 className="text-xl font-bold uppercase tracking-tight mb-4">{protocol.title}</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              {protocol.desc}
            </p>
            <div className="mt-auto pt-8 font-mono text-[10px] tracking-[0.2em] text-neutral-600 uppercase group-hover:text-neutral-400 transition-colors">
              {protocol.status}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
