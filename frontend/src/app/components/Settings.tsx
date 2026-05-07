import { useState, useEffect, useRef } from 'react';
import { User, Mail, ShieldAlert, MapPin, Calendar, Shield, Bell, Zap, Key, CheckCircle, AlertCircle, Eye, EyeOff, Save, Loader2, Sparkles } from 'lucide-react';
import { useTheme } from '../App';
import gsap from 'gsap';

export function Settings() {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [showPassword, setShowPassword] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'valid' | 'invalid' | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, push: false, sms: false });
  const [userData, setUserData] = useState({ name: '', email: '', role: 'user' });
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* Avatar handlers — image is read as a base64 data URL and stored in
     localStorage. Capped at 2 MB so we don't blow out the storage quota. */
  const handlePhotoChange = (e: any) => {
    const file: File | undefined = e?.target?.files?.[0];
    if (!file) return;
    setAvatarError(null);
    if (!file.type.startsWith('image/')) {
      setAvatarError('Please choose an image file (PNG, JPG, GIF, WebP).');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError('Image is over 2 MB. Please pick a smaller one.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatar(dataUrl);
      localStorage.setItem('curasense_avatar', dataUrl);
      // Notify the rest of the app (UserProfile etc.) — both same-tab and cross-tab.
      window.dispatchEvent(new CustomEvent('curasense:avatar', { detail: dataUrl }));
    };
    reader.onerror = () => setAvatarError('Could not read that file.');
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatar(null);
    localStorage.removeItem('curasense_avatar');
    window.dispatchEvent(new CustomEvent('curasense:avatar', { detail: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('curasense_user');
    if (storedUser) setUserData(JSON.parse(storedUser));

    const storedAvatar = localStorage.getItem('curasense_avatar');
    if (storedAvatar) setAvatar(storedAvatar);

    const savedKey = localStorage.getItem('hf_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setApiKeyStatus('valid');
    }

    const ctx = gsap.context(() => {
      gsap.fromTo('.set-card',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'expo.out' }
      );
    }, ref);
    return () => ctx.revert();
  }, [theme]);

  const handleVerifyApiKey = async () => {
    if (!apiKey.trim()) return;
    setApiKeyStatus('checking');
    
    setTimeout(() => {
      const isValid = apiKey.startsWith('hf_') && apiKey.length > 20;
      setApiKeyStatus(isValid ? 'valid' : 'invalid');
      
      if (isValid) {
        localStorage.setItem('hf_api_key', apiKey);
      } else {
        localStorage.removeItem('hf_api_key');
      }
    }, 1500);
  };

  const T = isDark ? {
    cardBg: 'rgba(12,12,26,0.78)', cardBdr: 'rgba(255,255,255,0.10)', shadow: '0 8px 32px rgba(0,0,0,0.5)',
    head: '#ffffff', sub: 'rgba(255,255,255,0.50)', text: '#ffffff', muted: 'rgba(255,255,255,0.45)',
    inpBg: 'rgba(255,255,255,0.06)', rowHov: 'rgba(255,255,255,0.06)', rowBg: 'rgba(255,255,255,0.03)',
    divider: 'rgba(255,255,255,0.06)',
    btnBg: 'linear-gradient(135deg,#6366f1,#8b5cf6)', btnSh: '0 4px 14px rgba(99,102,241,0.4)',
    aiBg: 'rgba(139,92,246,0.06)', aiBdr: 'rgba(139,92,246,0.3)',
    succBg: 'rgba(16,185,129,0.1)', succTxt: '#34d399',
    errBg: 'rgba(239,68,68,0.1)', errTxt: '#f87171',
    infoBg: 'rgba(14,165,233,0.1)', infoTxt: '#38bdf8',
    warnBg: 'rgba(245,158,11,0.1)', warnTxt: '#fbbf24',
  } : {
    cardBg: 'rgba(255,255,255,0.97)', cardBdr: 'rgba(0,0,0,0.08)', shadow: '0 4px 20px rgba(0,0,0,0.07)',
    head: '#0a0a1a', sub: 'rgba(10,10,26,0.50)', text: '#0a0a1a', muted: 'rgba(10,10,26,0.45)',
    inpBg: 'rgba(0,0,0,0.03)', rowHov: 'rgba(0,0,0,0.04)', rowBg: 'rgba(0,0,0,0.02)',
    divider: 'rgba(0,0,0,0.06)',
    btnBg: 'linear-gradient(135deg,#6366f1,#8b5cf6)', btnSh: '0 4px 12px rgba(99,102,241,0.25)',
    aiBg: 'rgba(139,92,246,0.04)', aiBdr: 'rgba(139,92,246,0.25)',
    succBg: 'rgba(16,185,129,0.08)', succTxt: '#059669',
    errBg: 'rgba(239,68,68,0.08)', errTxt: '#dc2626',
    infoBg: 'rgba(14,165,233,0.08)', infoTxt: '#0284c7',
    warnBg: 'rgba(245,158,11,0.08)', warnTxt: '#d97706',
  };

  const S = "'Michroma', sans-serif";
  const I = "'Inter', sans-serif";
  const glass = { background: T.cardBg, border: `1px solid ${T.cardBdr}`, boxShadow: T.shadow, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderRadius: '20px', padding: '1.75rem' };
  const inputStyle = { width: '100%', padding: '0.65rem 1rem', background: T.inpBg, border: `1px solid ${T.cardBdr}`, borderRadius: '12px', color: T.text, fontSize: '0.85rem', outline: 'none' };
  const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: T.head, marginBottom: '0.4rem', fontFamily: I };

  return (
    <div ref={ref} style={{ fontFamily: I, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {userData.role === 'admin' && (
        <div className="set-card" style={{ ...glass, background: T.aiBg, border: `1px solid ${T.aiBdr}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontFamily: S, fontWeight: 700, fontSize: '1.1rem', color: T.head, display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Sparkles className="w-5 h-5 text-fuchsia-500" /> Admin Global Controls
              </h3>
              <p style={{ fontSize: '0.82rem', color: T.sub, marginTop: '2px' }}>Configure system-wide AI models and API integrations</p>
            </div>
            <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, fontFamily: S, background: 'linear-gradient(135deg,#d946ef,#8b5cf6)', color: '#fff', letterSpacing: '0.05em' }}>ADMIN ONLY</span>
          </div>

          <div style={{ padding: '1rem', background: T.rowBg, borderRadius: '12px', border: `1px dashed ${T.cardBdr}`, marginBottom: '1.25rem', display: 'flex', gap: '12px' }}>
            <div style={{ padding: '8px', background: 'rgba(139,92,246,0.15)', borderRadius: '8px', flexShrink: 0, alignSelf: 'flex-start' }}><Zap className="w-5 h-5 text-purple-500" /></div>
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: T.head, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Model Pipeline Status
                {apiKeyStatus === 'valid' && <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '0.65rem', background: T.succBg, color: T.succTxt, display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle className="w-3 h-3" /> Online</span>}
              </h4>
              <p style={{ fontSize: '0.75rem', color: T.muted, marginBottom: '2px' }}><strong style={{ color: T.succTxt }}>Without API key:</strong> Uses local edge models.</p>
              <p style={{ fontSize: '0.75rem', color: T.muted }}><strong style={{ color: '#a855f7' }}>With API key:</strong> Uses cloud Hugging Face resources.</p>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}><Key className="w-4 h-4 inline mr-1" style={{ verticalAlign: '-3px' }}/> Hugging Face API Key</label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input type={showApiKey ? 'text' : 'password'} value={apiKey} onChange={e => { setApiKey(e.target.value); setApiKeyStatus(null); }} placeholder="hf_••••••••••••••••••••" style={{ ...inputStyle, paddingRight: '2.5rem', borderColor: apiKeyStatus === 'valid' ? T.succTxt : apiKeyStatus === 'invalid' ? T.errTxt : T.cardBdr }} />
                <button onClick={() => setShowApiKey(!showApiKey)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: T.muted, cursor: 'pointer' }}>
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button onClick={handleVerifyApiKey} disabled={!apiKey.trim() || apiKeyStatus === 'checking'} style={{ padding: '0 1.25rem', borderRadius: '12px', background: T.btnBg, color: '#fff', fontWeight: 600, fontSize: '0.85rem', cursor: apiKey.trim() ? 'pointer' : 'not-allowed', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', opacity: apiKey.trim() ? 1 : 0.6 }}>
                {apiKeyStatus === 'checking' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} Verify & Save
              </button>
            </div>
            {apiKeyStatus === 'invalid' && <p style={{ fontSize: '0.75rem', color: T.errTxt, marginTop: '8px', display: 'flex', gap: '4px' }}><AlertCircle className="w-4 h-4" /> Invalid key. Must start with hf_ and be &gt;20 chars.</p>}
          </div>
        </div>
      )}

      <div className="set-card" style={glass}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontFamily: S, fontWeight: 700, fontSize: '1.1rem', color: T.head, display: 'flex', gap: '8px', alignItems: 'center' }}>
            <User className="w-5 h-5 text-blue-500" /> Identity Information
          </h3>
          <p style={{ fontSize: '0.82rem', color: T.sub, marginTop: '2px' }}>Manage your verified system identity</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Avatar — shows the uploaded photo when present, otherwise
              the user's initials on the role-tinted gradient. */}
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            overflow: 'hidden',
            background: userData.role === 'admin'
              ? 'linear-gradient(135deg,#d946ef,#8b5cf6)'
              : 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '1.75rem', fontWeight: 800, fontFamily: S,
            border: '2px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}>
            {avatar ? (
              <img
                src={avatar}
                alt="Profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              userData.name.substring(0, 2).toUpperCase() || 'US'
            )}
          </div>

          <div>
            {/* Hidden file input — clicked programmatically by the button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
            />
            <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: T.btnBg,
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: T.btnSh,
                }}
              >
                {avatar ? 'Change Photo' : 'Upload Photo'}
              </button>
              {avatar && (
                <button
                  onClick={handleRemovePhoto}
                  style={{
                    padding: '0.5rem 0.85rem',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    background: 'transparent',
                    border: `1px solid ${T.cardBdr}`,
                    color: T.muted,
                    cursor: 'pointer',
                  }}
                >
                  Remove
                </button>
              )}
            </div>
            {avatarError ? (
              <p style={{ fontSize: '0.7rem', color: '#f87171' }}>{avatarError}</p>
            ) : (
              <p style={{ fontSize: '0.7rem', color: T.muted }}>
                Verified clearance: {userData.role.toUpperCase()} · PNG/JPG up to 2 MB
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginBottom: '1rem' }}>
          <div><label style={labelStyle}>Full Name / Handle</label><input defaultValue={userData.name} style={inputStyle} disabled={userData.role !== 'admin'} /></div>
          <div>
            <label style={labelStyle}>System Email</label>
            <div style={{ position: 'relative' }}><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: T.muted }}/><input type="email" defaultValue={userData.email} style={{ ...inputStyle, paddingLeft: '2.5rem' }} disabled /></div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button style={{ padding: '0.65rem 1.25rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, background: T.btnBg, color: '#fff', border: 'none', boxShadow: T.btnSh, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><Save className="w-4 h-4" /> Save Configuration</button>
        </div>
      </div>

      <div className="set-card" style={glass}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontFamily: S, fontWeight: 700, fontSize: '1.1rem', color: T.head, display: 'flex', gap: '8px', alignItems: 'center' }}><Shield className="w-5 h-5 text-green-500" /> Security & Privacy</h3>
          <p style={{ fontSize: '0.82rem', color: T.sub, marginTop: '2px' }}>Manage your encryption keys and passwords</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginBottom: '1.5rem' }}>
          <div>
            <label style={labelStyle}>Current Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? "text" : "password"} placeholder="••••••••" style={{ ...inputStyle, paddingRight: '2.5rem' }} />
              <button onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: T.muted, cursor: 'pointer' }}>{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
            </div>
          </div>
          <div><label style={labelStyle}>New Password</label><input type="password" placeholder="••••••••" style={inputStyle} /></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button style={{ padding: '0.65rem 1.25rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, background: T.btnBg, color: '#fff', border: 'none', boxShadow: T.btnSh, cursor: 'pointer' }}>Update Encryption</button>
        </div>
      </div>
    </div>
  );
}