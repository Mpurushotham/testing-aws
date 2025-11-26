import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Shield, Globe, Lock, Server, ArrowDown, AlertTriangle, ArrowRight, XCircle, Sliders } from 'lucide-react';

export const Infrastructure: React.FC = () => {
  const [activeThreat, setActiveThreat] = useState<'none' | 'ddos' | 'sqli'>('none');

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20">
          Domain: Infrastructure Protection
        </div>
        <h2 className="text-4xl font-bold text-white tracking-tight">Defense in Depth</h2>
        <p className="text-slate-400 text-lg max-w-3xl">
          Secure your network at the Edge, the VPC boundary, and the Instance level. 
          Layered controls ensure that if one fails, others stand guard.
        </p>
      </header>

      {/* Network Defense Visualizer */}
      <section className="bg-slate-900 border border-slate-700 rounded-2xl p-8 relative overflow-hidden">
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <Network className="text-indigo-500" />
              Traffic Flow & Controls
            </h3>
            <p className="text-slate-400 text-sm mt-1">Simulate traffic entering your VPC from the internet.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveThreat('none')}
              className={`px-4 py-2 rounded text-xs font-bold transition-colors ${activeThreat === 'none' ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-500'}`}
            >
              Normal Traffic
            </button>
            <button 
              onClick={() => setActiveThreat('ddos')}
              className={`px-4 py-2 rounded text-xs font-bold transition-colors ${activeThreat === 'ddos' ? 'bg-red-900/50 text-red-200 border border-red-800' : 'bg-slate-800 text-slate-500'}`}
            >
              Simulate DDoS
            </button>
            <button 
              onClick={() => setActiveThreat('sqli')}
              className={`px-4 py-2 rounded text-xs font-bold transition-colors ${activeThreat === 'sqli' ? 'bg-orange-900/50 text-orange-200 border border-orange-800' : 'bg-slate-800 text-slate-500'}`}
            >
              Simulate SQL Injection
            </button>
          </div>
        </div>

        <div className="relative z-10 space-y-2">
           {/* Layer 1: Edge (WAF & Shield) */}
           <div className={`p-4 border-2 rounded-xl flex items-center justify-between transition-all duration-500 ${activeThreat === 'ddos' ? 'bg-red-900/20 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : activeThreat === 'sqli' ? 'bg-orange-900/20 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'bg-slate-800 border-indigo-500/30'}`}>
              <div className="flex items-center gap-4">
                 <div className="bg-slate-900 p-3 rounded-lg"><Globe size={24} className="text-slate-400"/></div>
                 <div>
                   <h4 className="font-bold text-white">Edge Location (CloudFront / ALB)</h4>
                   <div className="flex gap-2 text-xs mt-1">
                     <span className="px-2 py-0.5 rounded bg-blue-900/50 text-blue-300 border border-blue-800">AWS Shield</span>
                     <span className="px-2 py-0.5 rounded bg-purple-900/50 text-purple-300 border border-purple-800">AWS WAF</span>
                   </div>
                 </div>
              </div>
              <div className="text-right">
                {activeThreat === 'ddos' && <span className="text-red-400 font-bold animate-pulse flex items-center gap-1"><Shield size={14}/> BLOCKED (Volumetric)</span>}
                {activeThreat === 'sqli' && <span className="text-orange-400 font-bold animate-pulse flex items-center gap-1"><Shield size={14}/> BLOCKED (Layer 7 Rule)</span>}
                {activeThreat === 'none' && <span className="text-green-400 font-bold text-xs">PASS</span>}
              </div>
           </div>

           <div className="flex justify-center"><ArrowDown className={`text-slate-600 ${activeThreat !== 'none' ? 'opacity-20' : 'opacity-100'}`} /></div>

           {/* Layer 2: VPC Boundary (NACL) */}
           <div className={`p-4 border-2 rounded-xl flex items-center justify-between bg-slate-800 border-slate-700 ${activeThreat !== 'none' ? 'opacity-50' : 'opacity-100'}`}>
              <div className="flex items-center gap-4">
                 <div className="bg-slate-900 p-3 rounded-lg"><Network size={24} className="text-slate-400"/></div>
                 <div>
                   <h4 className="font-bold text-white">Subnet Boundary (NACL)</h4>
                   <div className="flex gap-2 text-xs mt-1">
                     <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-300">Stateless Firewall</span>
                   </div>
                 </div>
              </div>
              <div className="text-right">
                <span className="text-slate-500 text-xs">Allow 443 Inbound</span>
              </div>
           </div>

           <div className="flex justify-center"><ArrowDown className={`text-slate-600 ${activeThreat !== 'none' ? 'opacity-20' : 'opacity-100'}`} /></div>

           {/* Layer 3: Instance (Security Group) */}
           <div className={`p-4 border-2 rounded-xl flex items-center justify-between bg-slate-800 border-slate-700 ${activeThreat !== 'none' ? 'opacity-50' : 'opacity-100'}`}>
              <div className="flex items-center gap-4">
                 <div className="bg-slate-900 p-3 rounded-lg"><Server size={24} className="text-slate-400"/></div>
                 <div>
                   <h4 className="font-bold text-white">EC2 / ENI (Security Group)</h4>
                   <div className="flex gap-2 text-xs mt-1">
                     <span className="px-2 py-0.5 rounded bg-green-900/50 text-green-300 border border-green-800">Stateful Firewall</span>
                   </div>
                 </div>
              </div>
               <div className="text-right">
                <span className="text-green-500 font-bold text-xs">ACCEPTED</span>
              </div>
           </div>
        </div>
      </section>

      <WafSimulation />
      <NetworkFirewallVisualizer />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h4 className="font-bold text-white mb-2 flex items-center gap-2"><AlertTriangle className="text-yellow-500" size={18} /> Network Firewall vs WAF</h4>
          <p className="text-sm text-slate-400 mb-4">Common confusion point. Know the difference.</p>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex gap-2"><span className="text-blue-400 font-bold w-12">WAF:</span> Layer 7 (HTTP/S). Blocks SQLi, XSS, Bots. Attached to CloudFront/ALB.</li>
            <li className="flex gap-2"><span className="text-blue-400 font-bold w-12">NetFW:</span> Layer 3-7. Deep Packet Inspection (IPS/IDS) for all VPC traffic.</li>
          </ul>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h4 className="font-bold text-white mb-2 flex items-center gap-2"><Lock className="text-green-500" size={18} /> VPC Endpoints (PrivateLink)</h4>
          <p className="text-sm text-slate-400 mb-4">Keep traffic off the public internet.</p>
          <div className="bg-slate-900 p-3 rounded border border-slate-800 text-xs text-slate-300 font-mono">
            EC2 Instance --[Private Network]--&gt; S3 Endpoint --[AWS Backbone]--&gt; S3 Bucket
          </div>
          <p className="text-xs text-slate-500 mt-2">Never use an Internet Gateway for S3/DynamoDB access if you don't have to.</p>
        </div>
      </div>
    </div>
  );
};

const WafSimulation: React.FC = () => {
  const [activeRule, setActiveRule] = useState<'allow_all' | 'block_sqli' | 'rate_limit'>('allow_all');
  const [trafficType, setTrafficType] = useState<'normal' | 'sqli' | 'bot'>('normal');
  const [simState, setSimState] = useState<'idle' | 'running' | 'blocked' | 'passed'>('idle');

  const runSim = () => {
    setSimState('running');
    setTimeout(() => {
       if (activeRule === 'allow_all') setSimState('passed');
       else if (activeRule === 'block_sqli' && trafficType === 'sqli') setSimState('blocked');
       else if (activeRule === 'rate_limit' && trafficType === 'bot') setSimState('blocked');
       else setSimState('passed');
       
       setTimeout(() => setSimState('idle'), 2000);
    }, 1500);
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sliders className="text-purple-500" />
            WAF Rule Tuner
          </h3>
          <p className="text-slate-400 text-sm mt-1">Configure Web ACLs and test them against simulated traffic.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Configuration Panel */}
         <div className="space-y-6">
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
               <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">1. Select WAF Rule</h4>
               <div className="space-y-2">
                  <button onClick={() => setActiveRule('allow_all')} className={`w-full text-left p-2 rounded text-sm border ${activeRule === 'allow_all' ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>Allow All (Default)</button>
                  <button onClick={() => setActiveRule('block_sqli')} className={`w-full text-left p-2 rounded text-sm border ${activeRule === 'block_sqli' ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>Block SQL Injection (AWS Managed)</button>
                  <button onClick={() => setActiveRule('rate_limit')} className={`w-full text-left p-2 rounded text-sm border ${activeRule === 'rate_limit' ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>Rate Limit (2000 req/5min)</button>
               </div>
            </div>

            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
               <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">2. Generate Traffic</h4>
               <div className="space-y-2">
                  <button onClick={() => setTrafficType('normal')} className={`w-full text-left p-2 rounded text-sm border ${trafficType === 'normal' ? 'bg-green-900/20 border-green-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>Normal User Requests</button>
                  <button onClick={() => setTrafficType('sqli')} className={`w-full text-left p-2 rounded text-sm border ${trafficType === 'sqli' ? 'bg-orange-900/20 border-orange-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>Malicious Payload: ' OR 1=1</button>
                  <button onClick={() => setTrafficType('bot')} className={`w-full text-left p-2 rounded text-sm border ${trafficType === 'bot' ? 'bg-red-900/20 border-red-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>High Volume Bot (5000 req/s)</button>
               </div>
            </div>

            <button onClick={runSim} disabled={simState !== 'idle'} className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors">
              {simState === 'idle' ? 'Run Simulation' : 'Testing...'}
            </button>
         </div>

         {/* Animation Viewport */}
         <div className="lg:col-span-2 bg-slate-950 rounded-xl border border-slate-800 p-8 relative flex items-center justify-between">
            {/* User/Attacker */}
            <div className="flex flex-col items-center z-10">
               <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 mb-2 ${trafficType === 'normal' ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'}`}>
                  {trafficType === 'normal' && <Globe size={32} className="text-green-500" />}
                  {trafficType !== 'normal' && <AlertTriangle size={32} className="text-red-500" />}
               </div>
               <span className="text-xs text-slate-400">{trafficType.toUpperCase()}</span>
            </div>

            {/* WAF Gate */}
            <div className="flex flex-col items-center z-10 w-32">
               <div className={`h-32 w-2 rounded-full ${activeRule === 'allow_all' ? 'bg-slate-700' : 'bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]'} transition-all duration-500`}></div>
               <span className="text-xs text-purple-400 mt-2 font-bold">AWS WAF</span>
            </div>

            {/* Application */}
            <div className="flex flex-col items-center z-10">
               <div className="w-16 h-16 bg-blue-900/20 rounded-lg border border-blue-500 flex items-center justify-center mb-2">
                  <Server size={32} className="text-blue-500" />
               </div>
               <span className="text-xs text-slate-400">Web App</span>
            </div>

            {/* Packets */}
            {simState !== 'idle' && (
              <motion.div 
                className={`absolute left-20 w-4 h-4 rounded-full z-20 ${trafficType === 'normal' ? 'bg-green-500' : 'bg-red-500'}`}
                initial={{ left: '15%', opacity: 1 }}
                animate={{ 
                   left: simState === 'blocked' ? '50%' : '85%',
                   opacity: simState === 'blocked' ? 0 : 1
                }}
                transition={{ duration: 1 }}
              />
            )}
            
            {/* Result Text */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-bold text-sm">
               {simState === 'blocked' && <span className="text-red-500 flex items-center gap-2"><XCircle/> REQUEST BLOCKED (403 Forbidden)</span>}
               {simState === 'passed' && <span className="text-green-500 flex items-center gap-2"><CheckCircle/> REQUEST ALLOWED (200 OK)</span>}
            </div>
         </div>
      </div>
    </div>
  );
};

const NetworkFirewallVisualizer: React.FC = () => {
  const [packetStatus, setPacketStatus] = useState<'flowing' | 'blocked'>('flowing');

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="text-red-500" />
            AWS Network Firewall Architecture
          </h3>
          <p className="text-slate-400 text-sm mt-1">Inspection VPC Pattern. Traffic is routed through a dedicated Firewall Subnet.</p>
        </div>
        <button
          onClick={() => setPacketStatus(prev => prev === 'flowing' ? 'blocked' : 'flowing')}
          className={`px-4 py-2 rounded text-xs font-bold transition-colors ${packetStatus === 'blocked' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-600'}`}
        >
          {packetStatus === 'blocked' ? 'Rule Active: DROP' : 'Rule: PASS ALL'}
        </button>
      </div>

      <div className="relative p-6 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
         {/* VPC Box */}
         <div className="absolute top-2 left-2 text-xs text-slate-500 font-mono border border-slate-800 px-2 rounded">VPC</div>

         <div className="flex justify-between items-center relative z-10 gap-4">
            {/* Internet Gateway */}
            <div className="flex flex-col items-center">
               <Globe className="text-blue-400 mb-2" size={32} />
               <span className="text-xs text-slate-400">Internet Gateway</span>
            </div>

            <ArrowRight className="text-slate-700" />

            {/* Firewall Subnet */}
            <div className="bg-slate-900 p-4 rounded-lg border border-red-500/30 w-48 text-center relative">
               <span className="text-[10px] text-red-400 absolute top-1 right-2">Firewall Subnet</span>
               <div className="p-3 bg-red-900/20 rounded border border-red-900/50 flex flex-col items-center gap-2">
                  <Shield size={24} className="text-red-500" />
                  <span className="text-xs font-bold text-white">Firewall Endpoint</span>
                  {packetStatus === 'blocked' && (
                    <motion.div initial={{scale: 0}} animate={{scale: 1}} className="absolute inset-0 bg-red-900/80 backdrop-blur-sm flex items-center justify-center rounded">
                       <XCircle className="text-white" size={32} />
                    </motion.div>
                  )}
               </div>
            </div>

            <ArrowRight className="text-slate-700" />

            {/* NAT Gateway / TGW */}
            <div className="flex flex-col items-center opacity-50">
               <div className="w-12 h-12 bg-slate-800 rounded flex items-center justify-center border border-slate-700 mb-2">
                  <span className="text-xs font-bold text-slate-500">NAT GW</span>
               </div>
            </div>

            <ArrowRight className="text-slate-700" />

            {/* Workload Subnet */}
            <div className={`bg-slate-900 p-4 rounded-lg border border-indigo-500/30 w-40 text-center transition-opacity ${packetStatus === 'blocked' ? 'opacity-30' : 'opacity-100'}`}>
               <span className="text-[10px] text-indigo-400 absolute top-1 right-2">Private Subnet</span>
               <div className="p-3 bg-indigo-900/20 rounded border border-indigo-900/50 flex flex-col items-center gap-2">
                  <Server size={24} className="text-indigo-400" />
                  <span className="text-xs font-bold text-white">EC2 Workload</span>
               </div>
            </div>
         </div>

         {/* Packet Animation */}
         {packetStatus === 'flowing' && (
           <motion.div 
             className="absolute top-1/2 left-[10%] w-4 h-4 bg-blue-500 rounded-full blur-[2px] z-20"
             animate={{ left: '85%' }}
             transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
           />
         )}
         {packetStatus === 'blocked' && (
           <motion.div 
             className="absolute top-1/2 left-[10%] w-4 h-4 bg-red-500 rounded-full blur-[2px] z-20"
             animate={{ left: '45%', opacity: [1, 0] }}
             transition={{ duration: 1, repeat: Infinity }}
           />
         )}

      </div>
    </div>
  );
};
const CheckCircle = ({size=16}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;