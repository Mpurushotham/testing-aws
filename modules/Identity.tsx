import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, FileJson, CheckCircle, ArrowRight, Activity, Filter, Users, Shield, GitBranch, Lock, Smartphone, Ban, Server, RefreshCw, AlertOctagon, Layers, FileWarning } from 'lucide-react';

export const Identity: React.FC = () => {
  return (
    <div className="space-y-12 max-w-6xl mx-auto">
       <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-medium border border-purple-500/20">
          Domain: Identity & Access Management
        </div>
        <h2 className="text-4xl font-bold text-white tracking-tight">Identity: The New Perimeter</h2>
        <p className="text-slate-400 text-lg max-w-3xl">
          In the cloud, network perimeters are permeable. Identity is the only absolute control. 
          Master IAM Policies, Roles, and the evaluation logic to secure your environment.
        </p>
      </header>

      <IamVisualizer />
      <CrossAccountSimulation />
      <OrganizationsVisualizer />
      <CognitoVisualizer />
      
      {/* Identity Center Section */}
      <section className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Users className="text-blue-500" />
          IAM Identity Center (Successor to SSO)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
             <div className="text-blue-400 font-bold mb-2">1. Centralize</div>
             <p className="text-sm text-slate-400">Connect to Microsoft Entra ID (Azure AD), Okta, or generic SAML 2.0 IdP to manage workforce identities in one place.</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
             <div className="text-blue-400 font-bold mb-2">2. Assign</div>
             <p className="text-sm text-slate-400">Map groups (e.g., "Developers") to Permission Sets (e.g., "PowerUserAccess") across multi-account environments.</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
             <div className="text-blue-400 font-bold mb-2">3. Access</div>
             <p className="text-sm text-slate-400">Users sign in once via the AWS access portal and federate into specific AWS accounts with temporary credentials.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

const IamVisualizer: React.FC = () => {
  // Configuration State
  const [config, setConfig] = useState({
    explicitDeny: false,
    scpAllow: true,
    boundaryAllow: true,
    identityAllow: true
  });

  const [simulation, setSimulation] = useState<{
    status: 'idle' | 'running' | 'complete';
    step: number; // 0: Start, 1: Deny Check, 2: SCP, 3: Boundary, 4: Identity, 5: Result
    result: 'allowed' | 'denied';
    failReason: string | null;
  }>({
    status: 'idle',
    step: 0,
    result: 'denied',
    failReason: null
  });

  const runSimulation = () => {
    if (simulation.status === 'running') return;

    setSimulation({ status: 'running', step: 0, result: 'denied', failReason: null });

    // Step 0 -> 1: Explicit Deny Check
    setTimeout(() => {
        setSimulation(prev => ({ ...prev, step: 1 }));
        
        setTimeout(() => {
            if (config.explicitDeny) {
                setSimulation({ status: 'complete', step: 1, result: 'denied', failReason: 'Explicit Deny found in policy tree' });
                return;
            }

            // Step 1 -> 2: SCP Check
            setSimulation(prev => ({ ...prev, step: 2 }));
            setTimeout(() => {
                if (!config.scpAllow) {
                    setSimulation({ status: 'complete', step: 2, result: 'denied', failReason: 'Blocked by Organization SCP' });
                    return;
                }

                // Step 2 -> 3: Boundary Check
                setSimulation(prev => ({ ...prev, step: 3 }));
                setTimeout(() => {
                    if (!config.boundaryAllow) {
                        setSimulation({ status: 'complete', step: 3, result: 'denied', failReason: 'Blocked by Permissions Boundary' });
                        return;
                    }

                    // Step 3 -> 4: Identity Check
                    setSimulation(prev => ({ ...prev, step: 4 }));
                    setTimeout(() => {
                        if (!config.identityAllow) {
                            setSimulation({ status: 'complete', step: 4, result: 'denied', failReason: 'Implicit Deny (No Allow statement)' });
                            return;
                        }

                        // Step 4 -> 5: Final Result
                        setSimulation({ status: 'complete', step: 5, result: 'allowed', failReason: null });
                    }, 800);
                }, 800);
            }, 800);
        }, 800);
    }, 500);
  };

  const EvaluationNode = ({ stepIndex, label, icon: Icon, colorClass, description }: any) => {
      const isActive = simulation.step === stepIndex && simulation.status === 'running';
      const isPassed = simulation.step > stepIndex || (simulation.step === stepIndex && simulation.result === 'allowed' && simulation.status === 'complete');
      const isFailed = simulation.step === stepIndex && simulation.result === 'denied' && simulation.status === 'complete';
      const isPending = simulation.step < stepIndex;

      return (
        <div className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-500 w-full md:w-40 z-10 
            ${isActive ? `bg-slate-800 ${colorClass} scale-105 shadow-lg` : ''}
            ${isPassed ? `bg-slate-900 ${colorClass} opacity-100` : ''}
            ${isFailed ? 'bg-red-900/20 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : ''}
            ${isPending ? 'bg-slate-900 border-slate-800 opacity-40' : ''}
        `}>
            {/* Status Indicator */}
            <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-950 border ${isFailed ? 'border-red-500 text-red-500' : isPassed ? 'border-green-500 text-green-500' : 'border-slate-700 text-slate-500'}`}>
                {isFailed ? 'BLOCK' : isPassed ? 'PASS' : isActive ? 'EVAL...' : 'WAIT'}
            </div>

            <div className={`mb-2 ${isFailed ? 'text-red-500' : isActive ? 'text-white' : 'text-slate-400'}`}>
                <Icon size={24} />
            </div>
            <div className="font-bold text-white text-xs text-center mb-1">{label}</div>
            <div className="text-[10px] text-slate-400 text-center leading-tight">{description}</div>
        </div>
      );
  };

  const Connector = ({ active }: { active: boolean }) => (
      <div className="hidden md:flex flex-1 items-center justify-center relative -mx-2 z-0">
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                 className="h-full bg-blue-500"
                 initial={{ width: '0%' }}
                 animate={{ width: active ? '100%' : '0%' }}
                 transition={{ duration: 0.5 }}
              />
          </div>
          <ArrowRight className={`absolute text-slate-600 ${active ? 'text-blue-500' : ''}`} size={16} />
      </div>
  );

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="text-purple-500" />
            Policy Evaluation Logic
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Visualizing the decision flow: Deny &gt; SCP &gt; Boundary &gt; Identity.
          </p>
        </div>
        <button 
            onClick={runSimulation}
            disabled={simulation.status === 'running'}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2"
        >
            <Activity size={18} className={simulation.status === 'running' ? 'animate-spin' : ''} />
            {simulation.status === 'running' ? 'Evaluating...' : 'Evaluate Access'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
         {/* Configuration Controls */}
         <div className="lg:col-span-1 space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                <Filter size={14} /> Policy Configuration
            </h4>
            
            <Toggle 
                label="Explicit Deny?" 
                value={config.explicitDeny} 
                onChange={(v: boolean) => setConfig({...config, explicitDeny: v})} 
                type="deny"
                desc="Is there a 'Deny' statement anywhere?"
            />
            <Toggle 
                label="SCP Allows?" 
                value={config.scpAllow} 
                onChange={(v: boolean) => setConfig({...config, scpAllow: v})}
                desc="Organization Service Control Policy"
            />
            <Toggle 
                label="Boundary Allows?" 
                value={config.boundaryAllow} 
                onChange={(v: boolean) => setConfig({...config, boundaryAllow: v})}
                desc="IAM Permissions Boundary"
            />
            <Toggle 
                label="Identity Allows?" 
                value={config.identityAllow} 
                onChange={(v: boolean) => setConfig({...config, identityAllow: v})}
                desc="Role/User Policy Statement"
            />
         </div>

         {/* Visualization Pipeline */}
         <div className="lg:col-span-3 flex flex-col justify-center">
             <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 relative">
                
                {/* 1. Explicit Deny */}
                <EvaluationNode 
                    stepIndex={1} 
                    label="1. Deny Check" 
                    icon={FileWarning} 
                    colorClass="border-red-500/50" 
                    description="Overrides ALL Allows"
                />
                
                <Connector active={simulation.step > 1} />

                {/* 2. SCP */}
                <EvaluationNode 
                    stepIndex={2} 
                    label="2. SCP" 
                    icon={GitBranch} 
                    colorClass="border-orange-500/50" 
                    description="Organization Guardrail"
                />

                <Connector active={simulation.step > 2} />

                {/* 3. Boundary */}
                <EvaluationNode 
                    stepIndex={3} 
                    label="3. Boundary" 
                    icon={AlertOctagon} 
                    colorClass="border-purple-500/50" 
                    description="Max Permissions"
                />

                <Connector active={simulation.step > 3} />

                {/* 4. Identity */}
                <EvaluationNode 
                    stepIndex={4} 
                    label="4. Identity" 
                    icon={FileJson} 
                    colorClass="border-blue-500/50" 
                    description="Granting Policy"
                />
             </div>
             
             {/* Result Display */}
             <div className="mt-8 flex justify-center">
                <AnimatePresence mode="wait">
                    {simulation.status === 'complete' && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`px-8 py-4 rounded-xl border-2 shadow-2xl flex flex-col items-center ${
                                simulation.result === 'allowed' 
                                    ? 'bg-green-900/20 border-green-500 text-green-400' 
                                    : 'bg-red-900/20 border-red-500 text-red-400'
                            }`}
                        >
                            <div className="flex items-center gap-3 text-xl font-bold mb-1">
                                {simulation.result === 'allowed' ? <CheckCircle size={28} /> : <Ban size={28} />}
                                {simulation.result === 'allowed' ? 'ACCESS ALLOWED' : 'ACCESS DENIED'}
                            </div>
                            {simulation.failReason && (
                                <div className="text-sm opacity-90 font-mono">Reason: {simulation.failReason}</div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
             </div>
         </div>
      </div>
      
      <div className="mt-4 bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs text-slate-400 font-mono">
          <span className="text-blue-400 font-bold">Evaluation Rule:</span> Effective Permissions = (Identity <span className="text-orange-500">∩ SCP</span> <span className="text-purple-500">∩ Boundary</span>). An explicit DENY in any policy overrides everything.
      </div>
    </div>
  );
};

const Toggle = ({ label, value, onChange, type = 'allow', desc }: any) => (
    <div className="space-y-1">
        <button 
            onClick={() => onChange(!value)}
            className={`flex items-center justify-between w-full p-2.5 rounded-lg border transition-all ${
                value 
                    ? (type === 'deny' ? 'bg-red-900/30 border-red-500 text-red-100' : 'bg-green-900/30 border-green-500 text-green-100')
                    : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-600'
            }`}
        >
            <span className="text-sm font-bold">{label}</span>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${
                value 
                    ? (type === 'deny' ? 'bg-red-500' : 'bg-green-500')
                    : 'bg-slate-700'
            }`}>
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${value ? 'left-6' : 'left-1'}`} />
            </div>
        </button>
        <div className="text-[10px] text-slate-500 px-1">{desc}</div>
    </div>
);

const CrossAccountSimulation: React.FC = () => {
  const [step, setStep] = useState(0);

  const startSimulation = () => {
    if (step !== 0) return;
    setStep(1);
    setTimeout(() => setStep(2), 2000); // Token issued
    setTimeout(() => setStep(3), 4000); // Accessing Resource
    setTimeout(() => setStep(0), 7000); // Reset
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 relative overflow-hidden">
      <div className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <RefreshCw className="text-orange-500" />
            Simulation: Cross-Account Role Assumption
          </h3>
          <p className="text-slate-400 text-sm mt-1">Real-world scenario: Developer in "Dev" account accessing S3 in "Prod".</p>
        </div>
        <button
          onClick={startSimulation}
          disabled={step !== 0}
          className={`px-4 py-2 rounded font-bold transition-all ${
            step === 0 ? 'bg-orange-600 hover:bg-orange-500 text-white' : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          {step === 0 ? 'Start Simulation' : 'Running...'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center relative z-10 gap-4 mt-8">
        
        {/* Account A */}
        <div className="flex-1 w-full bg-slate-800 border border-slate-700 p-6 rounded-xl flex flex-col items-center relative">
           <span className="absolute -top-3 left-4 bg-slate-700 px-2 py-0.5 text-xs text-slate-300 rounded font-mono">Account A (Dev)</span>
           <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center border border-blue-500 mb-2">
             <Users size={32} className="text-blue-400" />
           </div>
           <span className="text-sm font-bold text-white">Developer</span>
           <span className="text-xs text-slate-500 mt-1">Principal</span>
        </div>

        {/* Flow Animation */}
        <div className="flex-1 w-full flex flex-col items-center relative h-32 justify-center">
            {/* STS Service */}
            <div className="absolute top-0 bg-slate-800 border border-slate-600 px-3 py-1 rounded-full text-xs font-bold text-yellow-500 flex items-center gap-1 z-20">
               <Key size={12} /> AWS STS
            </div>

            {/* Request Line */}
            <div className="w-full h-1 bg-slate-800 relative rounded-full overflow-hidden">
               {step === 1 && (
                  <motion.div 
                    layoutId="req"
                    className="absolute top-0 left-0 h-full bg-blue-500 w-1/2"
                    initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 1.5, ease: "linear" }}
                  />
               )}
               {step === 2 && (
                  <motion.div 
                    layoutId="resp"
                    className="absolute top-0 left-0 h-full bg-green-500 w-1/2"
                    initial={{ x: '100%' }} animate={{ x: '-100%' }} transition={{ duration: 1.5, ease: "linear" }}
                  />
               )}
                {step === 3 && (
                  <motion.div 
                    layoutId="access"
                    className="absolute top-0 left-0 h-full bg-orange-500 w-1/2"
                    initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 1.5, ease: "linear" }}
                  />
               )}
            </div>

            {/* Status Text */}
            <div className="mt-4 text-xs font-mono text-center h-4">
              {step === 1 && <span className="text-blue-400">1. sts:AssumeRole(RoleArn)</span>}
              {step === 2 && <span className="text-green-400">2. Returns: AccessKey, SecretKey, Token</span>}
              {step === 3 && <span className="text-orange-400">3. Access Resource with Temp Creds</span>}
            </div>
        </div>

        {/* Account B */}
        <div className="flex-1 w-full bg-slate-800 border border-slate-700 p-6 rounded-xl flex flex-col items-center relative">
           <span className="absolute -top-3 right-4 bg-slate-700 px-2 py-0.5 text-xs text-slate-300 rounded font-mono">Account B (Prod)</span>
           <div className={`w-16 h-16 rounded-full flex items-center justify-center border mb-2 transition-colors ${step === 3 ? 'bg-green-900/30 border-green-500' : 'bg-slate-900 border-slate-600'}`}>
             <Server size={32} className={step === 3 ? 'text-green-400' : 'text-slate-500'} />
           </div>
           <span className="text-sm font-bold text-white">Prod S3 Bucket</span>
           <span className="text-xs text-slate-500 mt-1">Resource</span>
           
           <div className="mt-4 p-2 bg-slate-900 rounded border border-slate-700 w-full">
              <div className="text-[10px] text-slate-400 font-mono mb-1">Trust Policy:</div>
              <div className="text-[10px] text-green-400 font-mono leading-tight">
                Allow Principal: Account A<br/>
                Action: sts:AssumeRole
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

const OrganizationsVisualizer: React.FC = () => {
  const [scpApplied, setScpApplied] = useState(false);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 relative overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <GitBranch className="text-orange-500" />
            AWS Organizations & SCPs
          </h3>
          <p className="text-slate-400 text-sm mt-1">Central governance. Service Control Policies (SCPs) act as "Guardrails" for accounts.</p>
        </div>
        <button
          onClick={() => setScpApplied(!scpApplied)}
          className={`flex items-center gap-2 px-4 py-2 rounded font-bold transition-all ${
            scpApplied ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'bg-slate-800 text-slate-400 border border-slate-600'
          }`}
        >
          {scpApplied ? <Lock size={16} /> : <Ban size={16} />}
          {scpApplied ? 'Remove Guardrail' : 'Apply SCP: Deny S3 Public'}
        </button>
      </div>

      <div className="flex flex-col items-center gap-8 relative z-10">
        {/* Root */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-800 border-2 border-slate-600 rounded-lg flex items-center justify-center relative">
            <Shield size={32} className="text-slate-400" />
            <span className="absolute -bottom-6 text-xs text-slate-500 font-mono">Root</span>
          </div>
          <div className="h-8 w-0.5 bg-slate-700"></div>
        </div>

        {/* OUs */}
        <div className="flex gap-16">
          {/* Prod OU */}
          <div className="flex flex-col items-center">
            <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg flex flex-col items-center w-40">
              <span className="text-xs text-slate-400 font-bold mb-2 uppercase">Prod OU</span>
              <div className="p-2 bg-slate-900 rounded border border-slate-700 w-full text-center mb-2">
                 <span className="text-xs text-green-500">Account A</span>
              </div>
              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                 <CheckCircle size={10} className="text-green-500"/> S3 Public Allowed
              </div>
            </div>
          </div>

          {/* Dev OU (Target of SCP) */}
          <div className="flex flex-col items-center relative">
            <div className={`p-4 rounded-lg flex flex-col items-center w-40 transition-all duration-500 border ${
              scpApplied ? 'bg-red-900/20 border-red-500' : 'bg-slate-800 border-slate-700'
            }`}>
              <div className="flex justify-between w-full items-center mb-2">
                 <span className="text-xs text-slate-400 font-bold uppercase">Dev OU</span>
                 {scpApplied && <Lock size={12} className="text-red-500" />}
              </div>
              
              <div className="p-2 bg-slate-900 rounded border border-slate-700 w-full text-center mb-2">
                 <span className="text-xs text-blue-400">Account B</span>
              </div>
              
              <div className={`text-[10px] flex items-center gap-1 transition-colors ${scpApplied ? 'text-red-400' : 'text-slate-500'}`}>
                 {scpApplied ? <Ban size={10} /> : <CheckCircle size={10} className="text-green-500" />}
                 {scpApplied ? 'S3 Public DENIED' : 'S3 Public Allowed'}
              </div>
            </div>
            
            {/* SCP Card Overlay */}
            <AnimatePresence>
              {scpApplied && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="absolute -right-32 top-0 bg-red-600 text-white p-2 rounded shadow-xl w-32 text-[10px] font-mono z-20"
                >
                  Effect: Deny<br/>
                  Action: s3:PutBucketAcl<br/>
                  Resource: *
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const CognitoVisualizer: React.FC = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => (s + 1) % 5);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    { label: "User App", desc: "User enters credentials" },
    { label: "User Pool", desc: "Authenticates & returns JWT Token" },
    { label: "Identity Pool", desc: "Exchanges Token for AWS Creds" },
    { label: "STS", desc: "Issues Temp Access Key/Secret" },
    { label: "AWS Resource", desc: "App accesses S3/DynamoDB" }
  ];

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Smartphone className="text-blue-500" />
        Amazon Cognito: AuthN vs AuthZ
      </h3>

      <div className="relative">
        <div className="flex flex-wrap md:flex-nowrap justify-between items-start gap-4 mt-10">
          {steps.map((s, idx) => (
            <div key={idx} className={`relative flex-1 p-4 rounded-xl border transition-all duration-500 ${
              step === idx ? 'bg-blue-900/20 border-blue-500 scale-105 shadow-lg shadow-blue-900/20' : 'bg-slate-800 border-slate-700 opacity-60'
            }`}>
              <div className="text-xs font-bold text-slate-500 uppercase mb-1">Step {idx + 1}</div>
              <div className="font-bold text-white mb-1">{s.label}</div>
              <div className="text-[10px] text-slate-400">{s.desc}</div>
              
              {/* Connector */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-6 -translate-y-1/2 text-slate-600">
                  <ArrowRight size={20} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="p-4 bg-slate-800 rounded border border-slate-700">
            <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2"><Users size={16} className="text-blue-400"/> User Pools</h4>
            <p className="text-xs text-slate-400">The <strong>Identity Provider (IdP)</strong>. Handles sign-up, sign-in, and groups. Stores user profiles. Think "Authentication".</p>
         </div>
         <div className="p-4 bg-slate-800 rounded border border-slate-700">
            <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2"><Shield size={16} className="text-purple-400"/> Identity Pools</h4>
            <p className="text-xs text-slate-400">The <strong>Federation Service</strong>. Trades tokens (from User Pools, Facebook, Google) for temporary AWS credentials (IAM Roles). Think "Authorization".</p>
         </div>
      </div>
    </div>
  );
};