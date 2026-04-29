import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ShieldAlert, Users, Activity, Database, Trash2, Shield, Eye } from 'lucide-react';
import { useTheme } from '../App';
import { getAdminStats, getAdminUsers, getAdminPredictions, deleteAdminUser } from '../utils/api';

export function AdminDashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [stats, setStats] = useState({ totalUsers: 0, totalPredictions: 0, systemStatus: 'Loading', latency: '0ms' });
  const [users, setUsers] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'predictions'>('users');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [s, u, p] = await Promise.all([getAdminStats(), getAdminUsers(), getAdminPredictions()]);
    if (s.data) setStats(s.data);
    if (u.data) setUsers(u.data.users);
    if (p.data) setPredictions(p.data.predictions);
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('TERMINATE USER AND ALL DATA? This is irreversible.')) {
      await deleteAdminUser(id);
      fetchData();
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 400 / 400, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(400, 400);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasRef.current.appendChild(renderer.domElement);

    const geo = new THREE.IcosahedronGeometry(2.5, 2);
    const mat = new THREE.MeshBasicMaterial({ color: 0xd946ef, wireframe: true, transparent: true, opacity: 0.3 });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    const pGeo = new THREE.BufferGeometry();
    const pCount = 1000;
    const pos = new Float32Array(pCount * 3);
    for(let i=0; i<pCount*3; i++) pos[i] = (Math.random() - 0.5) * 10;
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0x00e5ff, size: 0.05, transparent: true, opacity: 0.6 });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    let id: number;
    const animate = () => {
      id = requestAnimationFrame(animate);
      mesh.rotation.y += 0.005;
      mesh.rotation.x += 0.002;
      points.rotation.y -= 0.002;
      renderer.render(scene, camera);
    };
    animate();

    const ctx = gsap.context(() => {
      gsap.fromTo('.admin-panel', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'expo.out' });
    }, containerRef);

    return () => {
      cancelAnimationFrame(id);
      ctx.revert();
      if(canvasRef.current) canvasRef.current.removeChild(renderer.domElement);
      geo.dispose(); mat.dispose(); pGeo.dispose(); pMat.dispose(); renderer.dispose();
    };
  }, []);

  const tCard = isDark ? 'rgba(15,15,25,0.8)' : 'rgba(255,255,255,0.9)';
  const tBdr = isDark ? 'rgba(217,70,239,0.3)' : 'rgba(217,70,239,0.4)';
  const tTxt = isDark ? '#fff' : '#000';
  const tMuted = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';

  return (
    <div ref={containerRef} className="space-y-8 relative">
      <div className="absolute top-0 right-0 pointer-events-none opacity-50 flex items-center justify-center">
        <div ref={canvasRef} />
      </div>

      <div className="relative z-10 flex items-center gap-4 admin-panel">
        <div className="p-4 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/50">
          <ShieldAlert className="w-8 h-8 text-fuchsia-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-widest text-fuchsia-500" style={{ fontFamily: "'Michroma', sans-serif" }}>Overwatch Protocol</h1>
          <p className="text-sm font-bold uppercase tracking-widest" style={{ color: tMuted }}>Global Administrator Terminal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 admin-panel relative z-10">
        {[
          { icon: Users, label: 'Identities', val: stats.totalUsers },
          { icon: Database, label: 'Data Logs', val: stats.totalPredictions },
          { icon: Activity, label: 'Network', val: stats.systemStatus },
          { icon: Shield, label: 'Latency', val: stats.latency }
        ].map((s, i) => (
          <div key={i} className="p-6 rounded-2xl backdrop-blur-md" style={{ background: tCard, border: `1px solid ${tBdr}` }}>
            <s.icon className="w-6 h-6 text-fuchsia-500 mb-4" />
            <div className="text-3xl font-bold" style={{ color: tTxt }}>{s.val}</div>
            <div className="text-xs uppercase tracking-widest mt-1 font-bold" style={{ color: tMuted }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="admin-panel relative z-10 p-6 rounded-2xl backdrop-blur-md" style={{ background: tCard, border: `1px solid ${tBdr}` }}>
        <div className="flex gap-4 mb-6 border-b border-fuchsia-500/20 pb-4">
          <button onClick={() => setActiveTab('users')} className={`px-6 py-2 rounded-lg font-bold uppercase tracking-widest text-sm transition-all ${activeTab === 'users' ? 'bg-fuchsia-500 text-white' : 'bg-transparent text-fuchsia-500'}`}>Identities</button>
          <button onClick={() => setActiveTab('predictions')} className={`px-6 py-2 rounded-lg font-bold uppercase tracking-widest text-sm transition-all ${activeTab === 'predictions' ? 'bg-fuchsia-500 text-white' : 'bg-transparent text-fuchsia-500'}`}>Data Logs</button>
        </div>

        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-fuchsia-500/20" style={{ color: tMuted }}>
                  <th className="pb-3 px-4 font-bold uppercase tracking-widest">ID</th>
                  <th className="pb-3 px-4 font-bold uppercase tracking-widest">Handle</th>
                  <th className="pb-3 px-4 font-bold uppercase tracking-widest">Contact</th>
                  <th className="pb-3 px-4 font-bold uppercase tracking-widest">Clearance</th>
                  <th className="pb-3 px-4 font-bold uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody style={{ color: tTxt }}>
                {users.map(u => (
                  <tr key={u._id} className="border-b border-fuchsia-500/10 hover:bg-fuchsia-500/5 transition-colors">
                    <td className="py-4 px-4 font-mono text-xs opacity-50">{u._id}</td>
                    <td className="py-4 px-4 font-bold">{u.name}</td>
                    <td className="py-4 px-4 opacity-80">{u.email}</td>
                    <td className="py-4 px-4"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-fuchsia-500/20 text-fuchsia-500' : 'bg-cyan-500/20 text-cyan-500'}`}>{u.role}</span></td>
                    <td className="py-4 px-4">
                      {u.role !== 'admin' && (
                        <button onClick={() => handleDeleteUser(u._id)} className="p-2 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'predictions' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-fuchsia-500/20" style={{ color: tMuted }}>
                  <th className="pb-3 px-4 font-bold uppercase tracking-widest">Log ID</th>
                  <th className="pb-3 px-4 font-bold uppercase tracking-widest">Identity</th>
                  <th className="pb-3 px-4 font-bold uppercase tracking-widest">Type</th>
                  <th className="pb-3 px-4 font-bold uppercase tracking-widest">Output</th>
                </tr>
              </thead>
              <tbody style={{ color: tTxt }}>
                {predictions.map(p => (
                  <tr key={p._id} className="border-b border-fuchsia-500/10 hover:bg-fuchsia-500/5 transition-colors">
                    <td className="py-4 px-4 font-mono text-xs opacity-50">{p._id}</td>
                    <td className="py-4 px-4 font-bold">{p.userId?.name || 'TERMINATED'}</td>
                    <td className="py-4 px-4 uppercase font-bold text-xs opacity-70">{p.type}</td>
                    <td className="py-4 px-4"><div className="truncate max-w-xs">{p.diagnosis}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}