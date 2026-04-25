import { useState, useEffect, useRef } from 'react';
import { User, History, Settings, LogOut, X, Cloud, ShieldAlert } from 'lucide-react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useTheme } from '../App';

interface UserProfileProps {
  predictionsCount: number;
  onNavigate: (tab: string) => void;
  onLogout: () => void;
}

interface UserData {
  name: string;
  email: string;
  role: string;
}

export function UserProfile({ predictionsCount, onNavigate, onLogout }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<UserData>({ name: 'User', email: '', role: 'user' });
  const menuRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const stored = localStorage.getItem('curasense_user');
    if (stored) {
      setUserData(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(60, 60);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasRef.current.appendChild(renderer.domElement);

    const geo = new THREE.TorusKnotGeometry(1.2, 0.4, 100, 16);
    const mat = new THREE.MeshBasicMaterial({ 
      color: userData.role === 'admin' ? 0xd946ef : (isDark ? 0x00e5ff : 0x8b5cf6), 
      wireframe: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      mesh.rotation.x += 0.015;
      mesh.rotation.y += 0.025;
      renderer.render(scene, camera);
    };
    animate();

    gsap.fromTo(menuRef.current, 
      { opacity: 0, y: -20, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.5)' }
    );

    return () => {
      cancelAnimationFrame(animationId);
      if (canvasRef.current && renderer.domElement) {
         canvasRef.current.removeChild(renderer.domElement);
      }
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, [isOpen, isDark, userData.role]);

  const handleNavigation = (tab: string) => {
    onNavigate(tab);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105"
        style={{ 
          background: isOpen ? 'var(--nav-active-bg)' : 'var(--bg-surface)', 
          color: isOpen ? 'var(--accent-violet)' : 'var(--text-secondary)', 
          border: '1px solid var(--border-color)' 
        }}
      >
        <User className="w-4 h-4" />
        {userData.name.split(' ')[0]}
      </button>

      {isOpen && (
        <div 
          ref={menuRef}
          className="absolute right-0 mt-4 w-80 rounded-2xl overflow-hidden z-50 origin-top-right"
          style={{ 
            background: 'var(--bg-card)', 
            border: '1px solid var(--border-color)', 
            boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.6)' : '0 10px 40px rgba(0,0,0,0.1)', 
            backdropFilter: 'blur(24px)' 
          }}
        >
          <div className="p-5 border-b relative overflow-hidden" style={{ borderColor: 'var(--border-color)', background: userData.role === 'admin' ? 'rgba(217,70,239,0.05)' : 'rgba(139,92,246,0.05)' }}>
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2 pointer-events-none ${userData.role === 'admin' ? 'bg-fuchsia-500' : 'bg-purple-500'}`} />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div ref={canvasRef} className="rounded-full overflow-hidden" style={{ width: '60px', height: '60px', background: 'var(--bg-base)', border: '1px solid var(--border-color)' }} />
              <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-white/10 transition-colors" style={{ color: 'var(--text-muted)' }}>
                 <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-lg font-bold tracking-wide flex items-center gap-2" style={{ color: 'var(--text-primary)', fontFamily: "'Michroma', sans-serif" }}>
                {userData.name}
                {userData.role === 'admin' && <ShieldAlert className="w-4 h-4 text-fuchsia-500" />}
              </h3>
              <p className="text-xs mt-1.5 flex items-center gap-1.5 font-medium" style={{ color: 'var(--text-secondary)' }}>
                <Cloud className="w-3.5 h-3.5" /> {userData.email}
              </p>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                <div className="text-2xl font-bold" style={{ color: 'var(--accent-cyan)' }}>{predictionsCount}</div>
                <div className="text-[10px] uppercase tracking-widest mt-1 font-bold" style={{ color: 'var(--text-muted)' }}>Analyses</div>
              </div>
              <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                <div className="text-2xl font-bold uppercase" style={{ color: userData.role === 'admin' ? '#d946ef' : 'var(--accent-violet)' }}>{userData.role}</div>
                <div className="text-[10px] uppercase tracking-widest mt-1 font-bold" style={{ color: 'var(--text-muted)' }}>Status</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <button 
                onClick={() => handleNavigation('history')} 
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:translate-x-1" 
                style={{ color: 'var(--text-secondary)', background: 'var(--bg-surface)' }}
              >
                <History className="w-4 h-4" /> View Full History
              </button>
              <button 
                onClick={() => handleNavigation('settings')} 
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:translate-x-1" 
                style={{ color: 'var(--text-secondary)', background: 'var(--bg-surface)' }}
              >
                <Settings className="w-4 h-4" /> Account Settings
              </button>
              <button 
                onClick={onLogout} 
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:translate-x-1 hover:bg-red-500/10 text-red-400"
              >
                <LogOut className="w-4 h-4" /> Secure Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}