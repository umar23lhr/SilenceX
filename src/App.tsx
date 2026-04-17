/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Settings2, 
  Zap, 
  FileAudio, 
  Trash2, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  FileCode,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Adobe Spectrum-inspired Theme Constants
const COLORS = {
  bg: '#1b1b1b', // Darkest background
  surface: '#252525', // Surface 1
  accent: '#1473e6', // Adobe Blue
  accentHover: '#0d66d0',
  text: '#e1e1e1',
  textSecondary: '#999999',
  border: '#333333',
  danger: '#d32f2f',
  success: '#12805c'
};

export default function App() {
  const [threshold, setThreshold] = useState(-30);
  const [duration, setDuration] = useState(500);
  const [padding, setPadding] = useState(100);
  const [isScanning, setIsScanning] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [segmentsFound, setSegmentsFound] = useState<number>(0);
  const [scannerPos, setScannerPos] = useState(0);
  const [logs, setLogs] = useState<string[]>([
    "[System] initializing SilenceX engine...",
    "[ExtendScript] host connection established.",
  ]);

  // Handle scanner animation
  useEffect(() => {
    let interval: any;
    if (isScanning) {
      interval = setInterval(() => {
        setScannerPos(prev => (prev >= 100 ? 0 : prev + 1));
      }, 50);
    } else {
      setScannerPos(0);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  const handleScanAndRemove = async () => {
    setIsScanning(true);
    setError(null);
    setSegmentsFound(0);
    setLogs(prev => [...prev, "[Shell] manual trigger: ffmpeg silencedetect sequence_01"]);
    setStatus('Exporting Master Audio...');

    try {
      await new Promise(r => setTimeout(r, 1200));
      setLogs(prev => [...prev, "[IO] temporary wav created successfully."]);
      setStatus('Scanning Waves...');

      await new Promise(r => setTimeout(r, 2500));
      const simulatedSegments = 14;
      setSegmentsFound(simulatedSegments);
      setLogs(prev => [
        ...prev, 
        `[Parser] detected silence at T+45.2s`,
        `[Parser] detected silence at T+112.9s`,
        `[Engine] analysis complete: ${simulatedSegments} regions found.`
      ]);
      setStatus('Performing Ripple Cuts...');

      await new Promise(r => setTimeout(r, 1500));
      setLogs(prev => [...prev, "[ExtendScript] timeline synchronized."]);
      
      setStatus('Sequence Cleaned!');
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      setError('Connection Lost to Premiere Host');
      setLogs(prev => [...prev, "[FATAL] process aborted internally."]);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="h-screen bg-bg-base flex flex-col overflow-hidden select-none relative">
      <div className="scanline"></div>
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-purple rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-blue rounded-full blur-[120px] animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="h-[50px] bg-bg-panel/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-accent-blue neon-glow animate-ping"></div>
          <h1 
            className="text-[14px] font-black tracking-widest uppercase glitch-text" 
            data-text="SilenceX by Umar"
          >
            SilenceX <span className="text-accent-blue">by Umar</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <div className={`w-1.5 h-1.5 rounded-full ${isScanning ? 'bg-accent-blue animate-pulse' : 'bg-white/20'}`}></div>
            <span className="text-[9px] font-mono tracking-tighter text-white/40 uppercase">
              {isScanning ? 'Active Node' : 'Standby Mode'}
            </span>
          </div>
          <Settings2 size={14} className="text-white/20 cursor-pointer hover:text-accent-blue transition-colors" />
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 grid grid-cols-[300px_1fr] overflow-hidden z-10">
        
        {/* Left Control Panel */}
        <aside className="bg-bg-panel/40 backdrop-blur-sm p-6 flex flex-col gap-8 border-r border-white/5">
          
          <div className="space-y-6">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[2px]">Db Threshold</label>
                <span className="font-mono text-[12px] text-accent-blue font-bold tracking-tighter">{threshold} dB</span>
              </div>
              <input 
                type="range" 
                min="-60" 
                max="-20" 
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value))}
                className="w-full h-[6px] bg-bg-input rounded-full appearance-none cursor-pointer accent-accent-blue border border-white/5"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[2px]">Min Clip (ms)</label>
              <div className="relative group">
                <input 
                  type="number" 
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full bg-bg-input border border-white/5 text-white px-4 py-3 rounded-xl text-[14px] font-mono outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/20 transition-all font-bold"
                />
                <Zap size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-accent-blue transition-colors" />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[2px]">Fade Buffer (ms)</label>
              <div className="relative group">
                <input 
                  type="number" 
                  value={padding}
                  onChange={(e) => setPadding(parseInt(e.target.value))}
                  className="w-full bg-bg-input border border-white/5 text-white px-4 py-3 rounded-xl text-[14px] font-mono outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/20 transition-all font-bold"
                />
                <Info size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-accent-blue transition-colors" />
              </div>
            </div>
          </div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="mt-auto bg-gradient-to-br from-accent-purple/10 to-accent-blue/10 border border-white/5 rounded-2xl p-5 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <p className="text-[10px] text-white/40 leading-relaxed font-medium relative z-10 italic">
               &ldquo;Silence detection is performed via local FFmpeg shell context. Ensure your sequence handles ripple edits correctly.&rdquo;
            </p>
          </motion.div>
        </aside>

        {/* Right Execution Space */}
        <section className="p-8 flex flex-col gap-8 bg-black/20">
          
          {/* Visual Overview */}
          <div className="grid grid-cols-3 gap-6">
            <StatCard label="Seq Time" value="04:12" icon={FileAudio} />
            <StatCard label="Gap Count" value={segmentsFound > 0 ? `${segmentsFound}` : "0"} icon={Trash2} active={segmentsFound > 0} />
            <StatCard label="Save Est" value={segmentsFound > 0 ? `${(segmentsFound * 1.6).toFixed(1)}s` : "0s"} icon={CheckCircle2} active={segmentsFound > 0} />
          </div>

          {/* Improved Audio Timeline Preview */}
          <div className="flex-1 min-h-0 bg-bg-panel/60 backdrop-blur-md border border-white/5 rounded-3xl p-8 flex flex-col relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-[4px]">Waveform Analysis</label>
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-accent-blue/20" />
                ))}
              </div>
            </div>
            
            {/* Timeline View */}
            <div className="h-[160px] bg-black/40 border border-white/5 rounded-2xl mb-8 relative flex items-end justify-between px-6 pb-4 overflow-hidden shadow-inner">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex justify-between px-6 pointer-events-none opacity-5">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="w-px h-full bg-white" />
                ))}
              </div>

              {/* Dynamic Wave Bars */}
              {[45, 65, 30, 85, 20, 95, 40, 50, 15, 80, 55, 60, 25, 70, 35, 90, 40, 60, 10, 85, 45, 75, 20, 90, 30, 65, 50, 80].map((h, i) => (
                <motion.div 
                  key={i} 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.02, duration: 0.5 }}
                  className="w-[4px] bg-white/10 rounded-full relative group-hover:bg-accent-blue/30 transition-colors"
                >
                   {/* Neon Core for Active Waves */}
                   {h > 40 && (
                     <div className="absolute inset-0 bg-accent-blue/40 blur-[4px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   )}
                </motion.div>
              ))}
              
              {/* Silence Zones */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-0 h-full bg-red-500/10 border-x border-red-500/20 shadow-[inset_0_0_20px_rgba(239,68,68,0.1)]" 
                style={{ left: '22%', width: '12%' }} 
              />
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-0 h-full bg-red-500/10 border-x border-red-500/20 shadow-[inset_0_0_20px_rgba(239,68,68,0.1)]" 
                style={{ left: '62%', width: '8%' }} 
              />

              {/* Scanner Line */}
              {isScanning && (
                <motion.div 
                  initial={{ left: 0 }}
                  animate={{ left: '100%' }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute top-0 h-full w-[2px] bg-accent-blue shadow-[0_0_15px_#00f2ff] z-20"
                />
              )}
            </div>

            {/* Matrix Style Logs */}
            <div className="flex-1 bg-black/60 rounded-2xl p-6 font-mono text-[11px] leading-relaxed text-white/40 overflow-y-auto custom-scrollbar border border-white/5 shadow-2xl">
              {logs.map((log, idx) => {
                const isHighlight = log.includes("[Engine]") || log.includes("[COMPLETE]");
                return (
                  <div key={idx} className={`mb-1 flex gap-3 ${isHighlight ? "text-status-green" : ""}`}>
                    <span className="opacity-20">{String(idx + 1).padStart(3, '0')}</span>
                    <span>{log}</span>
                  </div>
                );
              })}
              <AnimatePresence>
                {status && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-accent-blue flex items-center gap-2 mt-2"
                  >
                    <div className="w-1 h-1 bg-accent-blue rounded-full animate-ping"></div>
                    {status}
                  </motion.div>
                )}
                {error && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-red-400 bg-red-400/10 p-2 rounded mt-2 border border-red-400/20 flex items-center gap-2"
                  >
                    <AlertCircle size={14} />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </main>

      {/* Modern Action Bar */}
      <footer className="h-[80px] bg-bg-panel/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-between px-10 z-10">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => {
              setThreshold(-30);
              setDuration(500);
              setPadding(100);
              setLogs(prev => [...prev, "[System] memory buffer cleared."]);
            }}
            className="text-[10px] font-bold text-white/30 hover:text-white uppercase tracking-[2px] transition-colors flex items-center gap-2"
          >
            <Download size={14} className="rotate-180" />
            Reset State
          </button>
          <div className="h-4 w-px bg-white/10"></div>
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[1px]">Build 26.04.17_Umar</p>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleScanAndRemove}
          disabled={isScanning}
          className={`relative group px-10 py-4 rounded-2xl overflow-hidden transition-all shadow-2xl ${
            isScanning ? 'bg-white/5 cursor-not-allowed' : 'bg-transparent border border-accent-blue/30'
          }`}
        >
          {!isScanning && (
            <div className="absolute inset-0 bg-accent-blue opacity-10 group-hover:opacity-20 transition-opacity"></div>
          )}
          <div className="relative flex items-center gap-4">
            {isScanning ? (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              >
                <Settings2 size={18} className="text-accent-blue" />
              </motion.div>
            ) : (
              <Zap size={18} className="text-accent-blue fill-accent-blue/20" />
            )}
            <span className={`text-[13px] font-black uppercase tracking-[3px] ${isScanning ? 'text-white/20' : 'text-accent-blue'}`}>
              {isScanning ? "Processing Stream" : "Execute Scan"}
            </span>
          </div>
        </motion.button>
      </footer>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, active = false }: { label: string, value: string, icon: any, active?: boolean }) {
  return (
    <div className={`bg-bg-panel/40 backdrop-blur-sm p-5 px-6 rounded-3xl border border-white/5 transition-all flex items-center gap-5 ${active ? 'neon-glow border-accent-blue/20' : ''}`}>
      <div className={`p-3 rounded-2xl ${active ? 'bg-accent-blue/20 text-accent-blue' : 'bg-white/5 text-white/20'}`}>
        <Icon size={18} />
      </div>
      <div>
        <div className="text-[9px] text-white/30 uppercase font-black tracking-[2px]">{label}</div>
        <div className={`text-[20px] font-bold font-mono tracking-tighter ${active ? 'text-white' : 'text-white/60'}`}>{value}</div>
      </div>
    </div>
  );
}



