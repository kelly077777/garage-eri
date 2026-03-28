import { useState, useEffect } from 'react'
import api from './api/client'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #f4f5f7; --surface: #ffffff; --surface2: #f0f1f4; --surface3: #e8eaef;
    --border: #e2e4ea; --text: #111318; --text2: #5a5f72; --text3: #9096ab;
    --accent: #0a0909; --accent2: #f5a623; --blue: #2563eb; --green: #059669; --red: #dc2626;
    --sidebar-w: 240px;
  }
  body { background: var(--bg); color: var(--text); font-family: 'Nunito', 'Calibri Light', Calibri, sans-serif; min-height: 100vh; }

  /*  LOGIN  */
  .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
  .login-card { position: relative; width: 440px; background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 48px; animation: slideUp 0.5s ease; box-shadow: 0 8px 40px rgba(0,0,0,0.15); }
  @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

  /*  FORMS  */
  .form-label { display: block; font-size: 12px; font-weight: 700; color: var(--text2); letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 8px; }
  .form-input { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 12px 14px; color: var(--text); font-family: 'Nunito', sans-serif; font-size: 14px; outline: none; transition: border-color 0.2s; }
  .form-input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
  .form-input::placeholder { color: var(--text3); }
  .btn-primary { background: var(--blue); color: #fff; width: 100%; padding: 14px; font-size: 15px; font-weight: 700; border: none; border-radius: 8px; cursor: pointer; transition: all 0.2s; font-family: 'Nunito', sans-serif; }
  .btn-primary:hover { background: #1d4ed8; }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  .error-msg { background: rgba(220,38,38,0.07); border: 1px solid rgba(220,38,38,0.2); border-radius: 8px; padding: 10px 14px; color: #b91c1c; font-size: 13px; margin-bottom: 16px; }
  .form-group { margin-bottom: 16px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  /*  LAYOUT  */
  .app { display: flex; min-height: 100vh; }
  .main { flex: 1; overflow-y: auto; background: var(--bg); min-width: 0; }

  /*  SIDEBAR  */
  .sidebar {
    width: var(--sidebar-w);
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    box-shadow: 2px 0 8px rgba(0,0,0,0.04);
    z-index: 200;
  }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; font-size: 14px; color: var(--text2); cursor: pointer; transition: all 0.15s; font-weight: 600; border: none; background: none; width: 100%; text-align: left; font-family: 'Nunito', sans-serif; }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: rgba(37,99,235,0.08); color: var(--blue); }

  /*  PAGE  */
  .page-header { padding: 28px 32px 0; display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; gap: 16px; }
  .page-title { font-family: 'Nunito', 'Calibri Light', Calibri, sans-serif; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; color: var(--text); }
  .page-sub { color: var(--text2); font-size: 14px; margin-top: 4px; font-weight: 500; }
  .page-content { padding: 0 32px 32px; }
  .page-actions { display: flex; gap: 10px; flex-wrap: wrap; flex-shrink: 0; }

  /*  CARDS  */
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
  .card-header { padding: 18px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
  .card-title { font-family: 'Nunito', 'Calibri Light', Calibri, sans-serif; font-size: 15px; font-weight: 800; color: var(--text); }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }

  /*  BUTTONS  */
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 18px; border-radius: 8px; font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; border: none; transition: all 0.2s; white-space: nowrap; }
  .btn-success { background: var(--green); color: #fff; } .btn-success:hover { background: #047857; }
  .btn-blue { background: var(--blue); color: #fff; } .btn-blue:hover { background: #1d4ed8; }
  .btn-accent { background: var(--accent); color: #fff; } .btn-accent:hover { background: #333; }
  .btn-ghost { background: transparent; color: var(--text2); border: 1px solid var(--border); } .btn-ghost:hover { background: var(--surface2); color: var(--text); }
  .btn-danger { background: rgba(220,38,38,0.07); color: var(--red); border: 1px solid rgba(220,38,38,0.15); }
  .btn-sm { padding: 6px 12px; font-size: 12px; }

  /*  MODALS  */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 300; padding: 20px; backdrop-filter: blur(2px); }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; width: 100%; max-width: 480px; animation: slideUp 0.2s ease; box-shadow: 0 8px 40px rgba(0,0,0,0.12); max-height: 90vh; display: flex; flex-direction: column; }
  .modal-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
  .modal-title { font-family: 'Nunito', 'Calibri Light', Calibri, sans-serif; font-size: 18px; font-weight: 800; color: var(--text); }
  .modal-body { padding: 24px; overflow-y: auto; flex: 1; }
  .modal-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; gap: 10px; justify-content: flex-end; background: var(--surface2); border-radius: 0 0 16px 16px; flex-shrink: 0; flex-wrap: wrap; }

  /*  TABLES  */
  .table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .table { width: 100%; border-collapse: collapse; min-width: 500px; }
  .table th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 800; color: var(--text3); text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid var(--border); background: var(--surface2); font-family: 'Nunito', sans-serif; white-space: nowrap; }
  .table td { padding: 14px 16px; font-size: 14px; border-bottom: 1px solid var(--border); color: var(--text); font-family: 'Nunito', sans-serif; }
  .table tr:last-child td { border: none; }
  .table tr:hover td { background: var(--surface2); }

  /*  TABS  */
  .tab-bar { display: flex; gap: 4px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 4px; flex-wrap: wrap; }
  .tab-btn { display: flex; align-items: center; gap: 8px; padding: 8px 18px; border-radius: 8px; border: none; font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; white-space: nowrap; }

  /*  MOBILE TOPBAR (hidden on desktop)  */
  .mobile-topbar { display: none; }

  /*  DESKTOP LOGO (hidden on mobile)  */
  .desktop-logo { display: flex; }

  /*  OVERLAY for mobile menu  */
  .sidebar-overlay { display: none; }

  /* 
     RESPONSIVE — Tablet (≤900px)
   */
  @media (max-width: 900px) {
    .form-row { grid-template-columns: 1fr 1fr; }
    .page-header { padding: 20px 20px 0; }
    .page-content { padding: 0 20px 24px; }
  }

  /* 
     RESPONSIVE — Mobile (≤768px)
   */
  @media (max-width: 768px) {
    /* Layout */
    .app { flex-direction: column; }
    .main { margin-top: 56px; }

    /* Sidebar becomes a full-screen overlay drawer */
    .sidebar {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      width: 100%;
      height: 56px;
      overflow: hidden;
      flex-direction: column;
      border-right: none;
      border-bottom: 1px solid var(--border);
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      transition: height 0.3s ease;
    }
    .sidebar.open {
      height: 100vh;
      overflow-y: auto;
    }

    /* Dim overlay when menu open */
    .sidebar-overlay {
      display: block;
      position: fixed;
      inset: 0;
      top: 56px;
      background: rgba(0,0,0,0.35);
      z-index: 199;
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }

    /* Show/hide topbars */
    .mobile-topbar { display: flex; }
    .desktop-logo { display: none !important; }

    /* Page spacing */
    .page-header { padding: 16px 16px 0; flex-wrap: wrap; }
    .page-content { padding: 0 16px 80px; }
    .page-title { font-size: 20px; }
    .page-actions { width: 100%; }
    .page-actions .btn { flex: 1; justify-content: center; font-size: 13px; padding: 10px 12px; }

    /* Forms */
    .form-row { grid-template-columns: 1fr; gap: 12px; }
    .form-input { font-size: 16px; } /* prevents iOS zoom */

    /* Modals — slide up from bottom on mobile */
    .modal-overlay { padding: 0; align-items: flex-end; background: rgba(0,0,0,0.5); }
    .modal {
      max-width: 100%;
      border-radius: 20px 20px 0 0;
      max-height: 92vh;
      animation: slideUpModal 0.3s ease;
    }
    @keyframes slideUpModal { from { transform: translateY(100%); } to { transform: translateY(0); } }
    .modal-footer { flex-direction: row; }
    .modal-footer .btn { flex: 1; justify-content: center; }

    /* Cards / Stats */
    .stat-card { padding: 14px 16px; }
    .card-header { padding: 14px 16px; }

    /* Tables */
    .table th, .table td { padding: 10px 12px; font-size: 12px; }
    .table { min-width: 480px; }

    /* Nav items */
    .nav-item { padding: 14px 16px; font-size: 15px; border-radius: 10px; }

    /* Login */
    .login-card { width: calc(100vw - 32px) !important; max-width: 380px !important; padding: 28px 20px !important; }

    /* Tab bar */
    .tab-bar { width: 100%; overflow-x: auto; flex-wrap: nowrap; }
    .tab-btn { font-size: 13px; padding: 8px 14px; }

    /* Stat grids */
    .stat-grid-2 { grid-template-columns: 1fr 1fr !important; }
    .stat-grid-3 { grid-template-columns: 1fr 1fr !important; }
    .stat-grid-4 { grid-template-columns: 1fr 1fr !important; }
    .stat-grid-5 { grid-template-columns: 1fr 1fr !important; }

    /* Dashboard two-col → one-col */
    .dash-two-col { grid-template-columns: 1fr !important; }

    /* Vehicle cards */
    .vehicle-grid { grid-template-columns: 1fr !important; }

    /* Hide less important table columns on small screens */
    .hide-mobile { display: none !important; }
  }

  /* 
     RESPONSIVE — Small phones (≤480px)
   */
  @media (max-width: 480px) {
    .stat-grid-4 { grid-template-columns: 1fr 1fr !important; }
    .stat-grid-3 { grid-template-columns: 1fr !important; }
    .page-title { font-size: 18px; }
    .tab-btn { font-size: 12px; padding: 7px 10px; }
    .btn { font-size: 12px; padding: 9px 10px; }
    .table th, .table td { padding: 8px 10px; font-size: 11px; }
  }
`

const ROLE_CONFIG = {
  manager: { color: '#2563eb', bg: 'rgba(37,99,235,0.1)', label: 'Manager' },
  supervisor: { color: '#7c3aed', bg: 'rgba(124,58,237,0.1)', label: 'Supervisor' },
  mechanic: { color: '#059669', bg: 'rgba(5,150,105,0.1)', label: 'Mechanic' },
}
const STATUS_STYLE = {
  'Ready': { bg: '#d1fae5', color: '#065f46', dot: '#10b981' },
  'In_Service': { bg: '#fef3c7', color: '#92400e', dot: '#f59e0b' },
  'Awaiting_Parts': { bg: '#fee2e2', color: '#991b1b', dot: '#ef4444' },
  'Completed': { bg: '#e0e7ff', color: '#3730a3', dot: '#6366f1' },
}
const FLEET_STATUS = {
  'Active': { bg: '#d1fae5', color: '#065f46', dot: '#10b981' },
  'In_Maintenance': { bg: '#fef3c7', color: '#92400e', dot: '#f59e0b' },
  'Out_of_Service': { bg: '#fee2e2', color: '#991b1b', dot: '#ef4444' },
}
const INV_STATUS = {
  'In_Stock': { bg: '#d1fae5', color: '#065f46' },
  'Low_Stock': { bg: '#fef3c7', color: '#92400e' },
  'Out_of_Stock': { bg: '#fee2e2', color: '#991b1b' },
}

const X = ({ onClick }) => (
  <button onClick={onClick} style={{ background:'none', border:'none', color:'var(--text2)', fontSize:22, cursor:'pointer', lineHeight:1, padding:'0 4px', flexShrink:0 }}>×</button>
)

//  LOGIN 
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const handleLogin = async () => {
    if (!email || !password) { setError('Please enter email and password'); return }
    setLoading(true); setError('')
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      onLogin(res.data.user)
    } catch { setError('Invalid email or password.') }
    setLoading(false)
  }
  return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', width:'100%', position:'relative', overflow:'hidden' }}>
      <video autoPlay muted loop playsInline style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', zIndex:0 }}>
        <source src="/bg.mp4" type="video/mp4"/>
      </video>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.15)', zIndex:1 }} />
      <div style={{ position:'relative', zIndex:2, display:'flex', alignItems:'center', justifyContent:'center', width:'100%', maxWidth:1200, padding:'16px', gap:32, flexWrap:'wrap' }}>
        <div style={{ flex:1, minWidth:0 }}/>
        <div className="login-card" style={{ background:'rgba(255,255,255,0.5)', backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)', border:'1px solid rgba(255,255,255,0.5)', boxShadow:'0 8px 40px rgba(0,0,0,0.18)', flexShrink:0, width:320, padding:28, maxWidth:'calc(100vw - 32px)' }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:22 }}>
            <div style={{ width:60, height:60, borderRadius:14, overflow:'hidden', marginBottom:12, boxShadow:'0 4px 20px rgba(0,0,0,0.18)', border:'3px solid rgba(255,255,255,0.15)' }}>
              <img src="/canvas.png" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            </div>
            <div style={{ fontFamily:'Nunito,sans-serif', fontSize:17, fontWeight:800, color:'var(--text)', textAlign:'center', letterSpacing:'-0.3px', lineHeight:1.3 }}>
              ERI-RWANDA<br/><span style={{ color:'var(--blue)', fontSize:13 }}>Fleet Management System</span>
            </div>
          </div>
          {error && <div className="error-msg">{error}</div>}
          <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="you@garage.com" value={email} onChange={e=>{setEmail(e.target.value);setError('')}}/></div>
          <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e=>{setPassword(e.target.value);setError('')}} onKeyDown={e=>e.key==='Enter'&&handleLogin()}/></div>
          <button className="btn-primary" onClick={handleLogin} disabled={loading}>{loading?'Signing in...':'Sign In'}</button>
        </div>
        <div style={{ flex:1, textAlign:'right', maxWidth:260, display:'flex', flexDirection:'column', alignItems:'flex-end' }}>
          <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.7)', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:10, textShadow:'0 1px 6px rgba(0,0,0,0.4)' }}>ERI-RWANDA LTD</div>
          <div style={{ fontSize:28, fontWeight:800, color:'#fff', lineHeight:1.25, textShadow:'0 2px 12px rgba(0,0,0,0.5)', marginBottom:14, fontFamily:'Nunito,sans-serif' }}>Your Trusted<br/>Importer &<br/>Distributor</div>
          <div style={{ width:50, height:3, background:'#2563eb', borderRadius:2, marginBottom:14 }}/>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.85)', lineHeight:1.8, textShadow:'0 1px 6px rgba(0,0,0,0.4)', fontFamily:'Nunito,sans-serif' }}>Bringing quality products<br/>across Rwanda with a<br/>reliable fleet since day one.</div>
        </div>
      </div>
    </div>
  )
}

//  EXPIRY HELPERS 
function getDaysUntil(dateStr) {
  if (!dateStr) return null
  return Math.ceil((new Date(dateStr) - new Date()) / (1000*60*60*24))
}
function getExpiryAlerts(fleet, warningDays=7) {
  const alerts = []
  fleet.forEach(v => {
    const docs = [
      { key:'ins',   type:'Insurance',       expiry: v.insuranceExpiry },
      { key:'insp',  type:'Inspection',      expiry: v.inspectionExpiry },
      { key:'spd',   type:'Speed Governor',  expiry: v.speedGovernorExpiry },
      { key:'lic',   type:'Driver License',  expiry: v.driverLicenseExpiry },
      { key:'yc',    type:'Yellow Card',     expiry: v.yellowCardExpiry },
    ]
    docs.forEach(doc => {
      const days = getDaysUntil(doc.expiry)
      if(days !== null && days <= warningDays)
        alerts.push({ id:`${doc.key}-${v.id}`, plate:v.plate, type:doc.type, expiry:doc.expiry, days, expired:days<0 })
    })
  })
  return alerts
}

//  AUDIT LOG HELPER 
const logAudit = async (user, action, module, details) => {
  try {
    await fetch('https://garage-eri-production.up.railway.app/api/audit', {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${localStorage.getItem('token')}`},
      body:JSON.stringify({ userName:user?.name||'Unknown', userRole:user?.role||'unknown', action, moduleName:module, details, timestamp:new Date().toISOString() })
    })
  } catch(e) { console.error('Audit log failed:',e) }
}

//  SIDEBAR 
function Sidebar({ user, activeTab, setActiveTab, onLogout, alertCount, menuOpen, setMenuOpen }) {
  const rc = ROLE_CONFIG[user.role]
  const initials = user.name.split(' ').map(n=>n[0]).join('')
  const N = (key, label, badge) => (
    <button key={key} className={`nav-item ${activeTab===key?'active':''}`} onClick={()=>setActiveTab(key)}>
      <span style={{flex:1}}>{label}</span>
      {badge>0&&<span style={{background:'#dc2626',color:'#fff',borderRadius:20,fontSize:10,fontWeight:800,padding:'2px 7px',minWidth:18,textAlign:'center'}}>{badge}</span>}
    </button>
  )
  return (
    <>
      <div className={`sidebar${menuOpen?' open':''}`}>
        {/*  MOBILE TOP BAR  */}
        <div className="mobile-topbar" style={{alignItems:'center',justifyContent:'space-between',padding:'0 16px',height:56,flexShrink:0,width:'100%',borderBottom:menuOpen?'1px solid var(--border)':'none'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:34,height:34,borderRadius:10,overflow:'hidden',border:'1px solid var(--border)',flexShrink:0}}>
              <img src="/canvas.png" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
            </div>
            <div style={{fontFamily:'Nunito,sans-serif',fontSize:14,fontWeight:800,color:'var(--text)'}}>ERI-RWANDA</div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            {alertCount>0&&!menuOpen&&(
              <span style={{background:'#dc2626',color:'#fff',borderRadius:20,fontSize:11,fontWeight:800,padding:'3px 9px'}}>{alertCount}</span>
            )}
            <button onClick={()=>setMenuOpen(o=>!o)} style={{background:'none',border:'none',cursor:'pointer',fontSize:26,color:'var(--text2)',padding:4,lineHeight:1}}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/*  DESKTOP LOGO  */}
        <div className="desktop-logo" style={{padding:'24px 16px 20px',borderBottom:'1px solid var(--border)',flexDirection:'column',alignItems:'center',gap:12,background:'#fff'}}>
          <div style={{width:80,height:80,borderRadius:18,overflow:'hidden',border:'2px solid var(--border)',boxShadow:'0 2px 12px rgba(0,0,0,0.10)',flexShrink:0}}>
            <img src="/canvas.png" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
          </div>
          <div style={{textAlign:'center',lineHeight:1.4}}>
            <div style={{fontFamily:'Nunito,Calibri Light,Calibri,sans-serif',fontSize:15,fontWeight:800,color:'var(--text)'}}>ERI-RWANDA</div>
            <div style={{fontSize:11,fontWeight:600,color:'var(--text2)'}}>Fleet Management</div>
          </div>
        </div>

        {/*  NAV  */}
        <nav style={{flex:1,padding:'16px 10px',display:'flex',flexDirection:'column',gap:2}}>
          <div style={{padding:'8px 12px 6px',fontSize:10,fontWeight:800,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.1em'}}>Main</div>
          {user.role==='manager'&&N('dashboard','Dashboard',alertCount)}
          {(user.role==='supervisor'||user.role==='mechanic')&&N('alerts','Alerts',alertCount)}
          {N('vehicles','Vehicles')}
          {user.role==='manager'&&N('fuel','Fuel Logs')}
          {N('inventory','Inventory')}
          {user.role==='manager'&&N('staff','Staff')}
          {(user.role==='manager'||user.role==='supervisor')&&N('expenses','Expenses')}
          {user.role==='manager'&&N('audit','Audit Log')}
          {user.role==='manager'&&N('reports','Reports')}
        </nav>

        {/*  USER  */}
        <div style={{padding:16,borderTop:'1px solid var(--border)'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,padding:10,background:'var(--surface2)',borderRadius:10,marginBottom:10}}>
            <div style={{width:34,height:34,borderRadius:'50%',background:rc.color,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Nunito,sans-serif',fontWeight:800,fontSize:13,color:'#fff',flexShrink:0}}>{initials}</div>
            <div style={{minWidth:0}}>
              <div style={{fontSize:13,fontWeight:700,color:'var(--text)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{user.name}</div>
              <div style={{fontSize:11,color:'var(--text2)'}}>{rc.label}</div>
            </div>
          </div>
          <button onClick={onLogout} style={{width:'100%',background:'transparent',border:'1px solid var(--border)',color:'var(--text2)',borderRadius:8,padding:10,fontSize:13,cursor:'pointer',fontFamily:'Nunito,sans-serif',fontWeight:600}}>Sign Out →</button>
        </div>
      </div>
      {/* Dim overlay when menu open on mobile */}
      {menuOpen&&<div className="sidebar-overlay" onClick={()=>setMenuOpen(false)}/>}
    </>
  )
}

//  DASHBOARD 
function DashboardPage({ onAlertsChange }) {
  const [d, setD] = useState({ vehicles:[], fleet:[], fuel:[], inventory:[], staff:[] })
  useEffect(() => {
    Promise.all([api.get('/vehicles'),api.get('/fleet'),api.get('/fleet/fuel/all'),api.get('/inventory'),api.get('/auth/users')])
      .then(([v,f,fuel,inv,s]) => {
        const fleetData = Array.isArray(f.data)?f.data:f.data?.content||[]
        setD({
          vehicles:Array.isArray(v.data)?v.data:v.data?.content||[],
          fleet:fleetData,
          fuel:Array.isArray(fuel.data)?fuel.data:fuel.data?.content||[],
          inventory:Array.isArray(inv.data)?inv.data:inv.data?.content||[],
          staff:Array.isArray(s.data)?s.data:s.data?.content||[]
        })
        if (onAlertsChange) onAlertsChange(getExpiryAlerts(fleetData).length)
      }).catch(e=>console.error(e))
  },[])
  const totalFuelCost = (d.fuel||[]).reduce((s,f)=>s+(f.totalCost||0),0)
  const lowStock = (d.inventory||[]).filter(i=>i.status==='Low_Stock'||i.status==='Out_of_Stock')
  const expiryAlerts = getExpiryAlerts(d.fleet)
  const stats = [
    {label:'Garage Vehicles',value:d.vehicles.length,sub:`${d.vehicles.filter(v=>v.status==='In_Service').length} in service`,color:'var(--blue)'},
    {label:'Fleet Vehicles',value:d.fleet.length,sub:`${d.fleet.filter(f=>f.status==='Active').length} active`,color:'var(--blue)'},
    {label:'Fuel Cost',value:totalFuelCost.toLocaleString()+'RWF',sub:'All time',color:'var(--green)'},
    {label:'Staff',value:d.staff.length,sub:`${d.staff.filter(s=>s.role==='mechanic').length} mechanics`,color:'var(--text)'},
    {label:'Inventory',value:d.inventory.length,sub:`${lowStock.length} low/out`,color:lowStock.length>0?'var(--red)':'var(--text)'},
  ]
  return (
    <>
      <div className="page-header"><div><div className="page-title">Dashboard</div><div className="page-sub">Overview of garage operations</div></div></div>
      <div className="page-content">
        <div className="stat-grid-5" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:20}}>
          {stats.map(s=>(
            <div key={s.label} className="stat-card">
              <div style={{fontSize:12,color:'var(--text2)',marginBottom:6,fontWeight:600}}>{s.label}</div>
              <div style={{fontFamily:'Nunito,sans-serif',fontSize:22,fontWeight:800,color:s.color,lineHeight:1.2}}>{s.value}</div>
              <div style={{fontSize:11,color:'var(--text3)',marginTop:4}}>{s.sub}</div>
            </div>
          ))}
        </div>

        {expiryAlerts.length>0&&(
          <div className="card" style={{marginBottom:16,borderColor:'#fca5a5'}}>
            <div className="card-header" style={{background:'#fff7f7'}}>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:18}}></span>
                <div className="card-title" style={{color:'#dc2626'}}>Document Expiry Alerts</div>
              </div>
              <span style={{fontSize:12,fontWeight:700,color:'#dc2626',background:'#fee2e2',borderRadius:20,padding:'3px 10px'}}>{expiryAlerts.length} alert{expiryAlerts.length>1?'s':''}</span>
            </div>
            <div>
              {expiryAlerts.map(a=>(
                <div key={a.id} style={{padding:'12px 16px',borderBottom:'1px solid #fee2e2',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,background:a.expired?'#fff5f5':'#fffbeb',flexWrap:'wrap'}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,minWidth:0}}>
                    <span style={{fontSize:16,flexShrink:0}}>{a.type==='Insurance'?'':''}</span>
                    <div style={{minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:700}}>
                        <span style={{fontFamily:'DM Mono,monospace',color:'var(--blue)'}}>{a.plate}</span>
                        <span style={{color:'var(--text2)',marginLeft:6}}>— {a.type}</span>
                      </div>
                      <div style={{fontSize:11,color:'var(--text3)',marginTop:1}}>Expires: {a.expiry}</div>
                    </div>
                  </div>
                  <span style={{fontSize:12,fontWeight:800,borderRadius:20,padding:'4px 10px',background:a.expired?'#fee2e2':'#fef3c7',color:a.expired?'#dc2626':'#92400e',flexShrink:0}}>
                    {a.expired?`Expired ${Math.abs(a.days)}d ago`:a.days===0?'TODAY':`${a.days}d left`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="dash-two-col" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
          <div className="card">
            <div className="card-header"><div className="card-title">Garage Vehicle Status</div></div>
            <div style={{padding:20}}>
              {Object.entries(STATUS_STYLE).map(([status,ss])=>{
                const count=d.vehicles.filter(v=>v.status===status).length
                const pct=d.vehicles.length?Math.round(count/d.vehicles.length*100):0
                return (
                  <div key={status} style={{marginBottom:14}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                      <span style={{fontSize:13,color:'var(--text2)',fontWeight:600}}>{status.replace('_',' ')}</span>
                      <span style={{fontSize:13,fontWeight:700}}>{count}</span>
                    </div>
                    <div style={{height:6,background:'var(--surface2)',borderRadius:3}}>
                      <div style={{height:'100%',width:`${pct}%`,background:ss.dot,borderRadius:3,transition:'width 0.5s'}}/>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">Stock Alerts</div><span style={{fontSize:12,color:lowStock.length>0?'#dc2626':'var(--text2)',fontWeight:600}}>{lowStock.length} items</span></div>
            {lowStock.length===0?(
              <div style={{padding:32,textAlign:'center',color:'var(--text3)'}}><div style={{fontSize:28,marginBottom:8}}></div><div>All items well stocked</div></div>
            ):(
              <div style={{maxHeight:220,overflowY:'auto'}}>
                {lowStock.map(item=>(
                  <div key={item.id} style={{padding:'10px 16px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
                    <div style={{minWidth:0}}><div style={{fontSize:13,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.name}</div><div style={{fontSize:11,color:'var(--text3)'}}>{item.category}</div></div>
                    <span style={{fontSize:11,fontWeight:700,borderRadius:20,padding:'3px 8px',background:INV_STATUS[item.status]?.bg,color:INV_STATUS[item.status]?.color,flexShrink:0}}>{item.quantity} {item.unit}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Recent Fuel Logs</div><span style={{fontSize:12,color:'var(--text2)'}}>{d.fuel.length} total</span></div>
          {d.fuel.length===0?<div style={{padding:32,textAlign:'center',color:'var(--text3)'}}>No fuel logs yet</div>:(
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Vehicle</th><th>Date</th><th>Liters</th><th>Total Cost</th><th className="hide-mobile">Station</th></tr></thead>
                <tbody>
                  {[...d.fuel].reverse().slice(0,8).map(f=>(
                    <tr key={f.id}>
                      <td style={{fontFamily:'DM Mono,monospace',color:'var(--blue)',fontSize:13,fontWeight:700}}>{f.fleetVehicle?.plate||'—'}</td>
                      <td style={{color:'var(--text2)'}}>{f.date}</td>
                      <td style={{fontWeight:600}}>{f.liters}L</td>
                      <td style={{fontFamily:'DM Mono,monospace',color:'var(--green)',fontWeight:700}}>{(f.totalCost||0).toLocaleString()} RWF</td>
                      <td className="hide-mobile" style={{color:'var(--text2)'}}>{f.station||'—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

//  ALERTS DASHBOARD 
function AlertsDashboard({ onAlertsChange }) {
  const [fleet, setFleet] = useState([])
  useEffect(()=>{
    api.get('/fleet').then(r=>{
      const data=Array.isArray(r.data)?r.data:r.data?.content||[]
      setFleet(data)
      if(onAlertsChange) onAlertsChange(getExpiryAlerts(data).length)
    }).catch(e=>console.error(e))
  },[])
  const alerts=getExpiryAlerts(fleet)
  const expired=alerts.filter(a=>a.expired)
  const upcoming=alerts.filter(a=>!a.expired)
  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Alerts</div><div className="page-sub">Document expiry alerts for fleet vehicles</div></div>
        {alerts.length>0&&<span style={{background:'#fee2e2',color:'#dc2626',borderRadius:20,fontSize:13,fontWeight:800,padding:'6px 14px',border:'1px solid #fca5a5',flexShrink:0}}>{alerts.length} alert{alerts.length>1?'s':''}</span>}
      </div>
      <div className="page-content">
        {alerts.length===0?(
          <div className="card" style={{padding:64,textAlign:'center'}}>
            <div style={{fontSize:48,marginBottom:16}}></div>
            <div style={{fontSize:18,fontWeight:800,marginBottom:8}}>All documents are valid</div>
            <div style={{fontSize:14,color:'var(--text2)'}}>No insurance or inspection expiring within 7 days</div>
          </div>
        ):(
          <>
            {expired.length>0&&(
              <div style={{marginBottom:20}}>
                <div style={{fontSize:12,fontWeight:800,color:'#dc2626',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:10}}>Already Expired ({expired.length})</div>
                <div className="card" style={{borderColor:'#fca5a5'}}>
                  {expired.map((a,i)=>(
                    <div key={a.id} style={{padding:'14px 16px',borderBottom:i<expired.length-1?'1px solid #fee2e2':'none',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,background:'#fff5f5',flexWrap:'wrap'}}>
                      <div style={{display:'flex',alignItems:'center',gap:12,minWidth:0}}>
                        <div style={{width:40,height:40,borderRadius:10,background:'#fee2e2',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>{a.type==='Insurance'?'':''}</div>
                        <div>
                          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:2,flexWrap:'wrap'}}>
                            <span style={{fontFamily:'DM Mono,monospace',fontSize:14,fontWeight:800,color:'var(--blue)'}}>{a.plate}</span>
                            <span style={{fontSize:11,fontWeight:700,background:'var(--surface2)',color:'var(--text2)',borderRadius:6,padding:'2px 7px'}}>{a.type}</span>
                          </div>
                          <div style={{fontSize:12,color:'var(--text3)'}}>Expired on: <strong>{a.expiry}</strong></div>
                        </div>
                      </div>
                      <span style={{fontSize:12,fontWeight:800,borderRadius:20,padding:'5px 12px',background:'#fee2e2',color:'#dc2626',border:'1px solid #fca5a5',flexShrink:0}}>Expired {Math.abs(a.days)}d ago</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {upcoming.length>0&&(
              <div>
                <div style={{fontSize:12,fontWeight:800,color:'#92400e',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:10}}>Expiring Within 7 Days ({upcoming.length})</div>
                <div className="card" style={{borderColor:'#fcd34d'}}>
                  {upcoming.map((a,i)=>(
                    <div key={a.id} style={{padding:'14px 16px',borderBottom:i<upcoming.length-1?'1px solid #fef3c7':'none',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,background:'#fffbeb',flexWrap:'wrap'}}>
                      <div style={{display:'flex',alignItems:'center',gap:12,minWidth:0}}>
                        <div style={{width:40,height:40,borderRadius:10,background:'#fef3c7',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>{a.type==='Insurance'?'':''}</div>
                        <div>
                          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:2,flexWrap:'wrap'}}>
                            <span style={{fontFamily:'DM Mono,monospace',fontSize:14,fontWeight:800,color:'var(--blue)'}}>{a.plate}</span>
                            <span style={{fontSize:11,fontWeight:700,background:'var(--surface2)',color:'var(--text2)',borderRadius:6,padding:'2px 7px'}}>{a.type}</span>
                          </div>
                          <div style={{fontSize:12,color:'var(--text3)'}}>Expires on: <strong>{a.expiry}</strong></div>
                        </div>
                      </div>
                      <span style={{fontSize:12,fontWeight:800,borderRadius:20,padding:'5px 12px',background:a.days===0?'#fee2e2':'#fef3c7',color:a.days===0?'#dc2626':'#92400e',border:a.days===0?'1px solid #fca5a5':'1px solid #fcd34d',flexShrink:0}}>
                        {a.days===0?'Expires TODAY':`${a.days}d left`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

//  EXPENSES PAGE 
function ExpensesPage({ user }) {
  const [expenses, setExpenses] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [importing, setImporting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState('')
  const [deleteMonth, setDeleteMonth] = useState('')
  const [filterMonth, setFilterMonth] = useState('ALL')
  const [filterDomain, setFilterDomain] = useState('ALL')
  const [search, setSearch] = useState('')
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const DOMAINS = ['GENERAL','TYRE','TRANSPORT','PARKING','WIREMAN','MODIFICATION']
  const DOMAIN_STYLE = {
    'GENERAL':{bg:'#eff6ff',color:'#1d4ed8'},'TYRE':{bg:'#fef3c7',color:'#92400e'},'TIYRE':{bg:'#fef3c7',color:'#92400e'},
    'TRANSPORT':{bg:'#f0fdf4',color:'#166534'},'PARKING':{bg:'#f5f3ff',color:'#6d28d9'},
    'WIREMAN':{bg:'#fff7ed',color:'#c2410c'},'MODIFICATION':{bg:'#fdf2f8',color:'#9d174d'},
  }
  const empty = {date:'',plate:'',assignment:'',reason:'',domain:'GENERAL',amount:''}
  const [form, setForm] = useState(empty)
  const sf = (k,v) => setForm(f=>({...f,[k]:v}))

  useEffect(()=>{fetchExpenses()},[])
  const fetchExpenses = async () => {
    try{const r=await api.get('/expenses');setExpenses(Array.isArray(r.data)?r.data:[])}catch(e){console.error(e)}
  }
  const handleSave = async () => {
    if(!form.date||!form.reason||!form.amount){alert('Date, Reason and Amount are required');return}
    try{
      if(editing){await api.put(`/expenses/${editing.id}`,{...form,amount:parseInt(form.amount)||0});await logAudit(user,'EDIT','Expenses',`Edited expense: ${form.reason}`)}
      else{await api.post('/expenses',{...form,amount:parseInt(form.amount)||0});await logAudit(user,'ADD','Expenses',`Added expense: ${form.reason}`)}
      fetchExpenses();setShowAdd(false);setEditing(null);setForm(empty)
    }catch{alert('Failed to save expense')}
  }
  const openEdit = (exp) => {
    setEditing(exp)
    setForm({date:exp.date||'',plate:exp.plate||'',assignment:exp.assignment||'',reason:exp.reason||'',domain:exp.domain||'GENERAL',amount:exp.amount||''})
    setShowAdd(true)
  }
  const handleDelete = async (id) => {
    if(!window.confirm('Delete this expense?'))return
    try{await api.delete(`/expenses/${id}`);await logAudit(user,'DELETE','Expenses',`Deleted expense ID: ${id}`);fetchExpenses()}catch{alert('Failed to delete')}
  }
  const handleDeleteMonth = async () => {
    if(!deleteMonth)return
    const monthIndex=MONTHS.indexOf(deleteMonth)+1
    const toDelete=expenses.filter(e=>e.date&&new Date(e.date).getMonth()+1===monthIndex)
    if(toDelete.length===0){alert(`No expenses found for ${deleteMonth}`);return}
    if(!window.confirm(`Delete all ${toDelete.length} expense records for ${deleteMonth}?`))return
    setDeleting(true)
    let success=0
    for(const exp of toDelete){try{await api.delete(`/expenses/${exp.id}`);success++}catch{}}
    setDeleting(false);setShowDeleteModal(false);setDeleteMonth('');fetchExpenses()
    alert(`Deleted ${success} of ${toDelete.length} records for ${deleteMonth}`)
  }
  const handleImportExcel = async (e) => {
    const file=e.target.files[0];if(!file)return
    setImporting(true);setImportResult(null)
    try{
      const XLSX=await import('https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs')
      const data=await file.arrayBuffer()
      const wb=XLSX.read(data,{cellDates:true})
      const ws=wb.Sheets[wb.SheetNames[0]]
      const rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:''})
      let success=0,failed=0,skipped=0,errors=[]
      const selectedMonthIndex=MONTHS.indexOf(selectedMonth)+1
      for(const row of rows){
        const rawDate=row[0];const plate=String(row[1]||'').trim();const assignment=String(row[2]||'').trim()
        const reason=String(row[3]||'').trim();const domain=String(row[4]||'').trim().toUpperCase();const amount=parseFloat(row[5])||0
        if(!rawDate){skipped++;continue}
        if(String(rawDate).toUpperCase()==='DATE'){skipped++;continue}
        if(!amount){skipped++;continue}
        let dateStr=''
        if(rawDate instanceof Date){const y=rawDate.getFullYear();const m=String(rawDate.getMonth()+1).padStart(2,'0');const d=String(rawDate.getDate()).padStart(2,'0');dateStr=`${y}-${m}-${d}`}
        else if(typeof rawDate==='string'&&rawDate.trim()){const raw=rawDate.trim();if(raw.includes('/')){const parts=raw.split('/');if(parts.length===3){const day=parts[0].padStart(2,'0');const month=parts[1].padStart(2,'0');const year=parts[2].length===2?'20'+parts[2]:parts[2];dateStr=`${year}-${month}-${day}`}}else if(raw.match(/^\d{4}-\d{2}-\d{2}$/)){dateStr=raw}}
        if(!dateStr||isNaN(new Date(dateStr).getTime())){skipped++;continue}
        const cleanAmount=typeof amount==='string'&&amount.startsWith('=')?0:parseFloat(amount)||0
        if(!cleanAmount){skipped++;continue}
        const rowMonth=new Date(dateStr).getMonth()+1
        if(rowMonth!==selectedMonthIndex){skipped++;continue}
        try{await api.post('/expenses',{date:dateStr,plate,assignment,reason,domain:domain||'GENERAL',amount:Math.round(cleanAmount)});success++}
        catch{failed++;if(errors.length<8)errors.push(`Failed: ${reason} on ${dateStr}`)}
      }
      setImportResult({success,failed,skipped,errors})
      if(success>0)fetchExpenses()
    }catch(err){setImportResult({success:0,failed:1,skipped:0,errors:['Failed to read file: '+err.message]})}
    setImporting(false);e.target.value=''
  }
  const filtered=expenses.filter(e=>{
    const q=search.toLowerCase()
    const monthMatch=filterMonth==='ALL'||(e.date&&new Date(e.date).getMonth()===MONTHS.indexOf(filterMonth))
    const domainMatch=filterDomain==='ALL'||e.domain===filterDomain
    const searchMatch=!q||e.plate?.toLowerCase().includes(q)||e.reason?.toLowerCase().includes(q)||e.assignment?.toLowerCase().includes(q)
    return monthMatch&&domainMatch&&searchMatch
  })
  const totalAmount=filtered.reduce((s,e)=>s+(e.amount||0),0)
  const byDomain={}
  filtered.forEach(e=>{const d=e.domain||'GENERAL';byDomain[d]=(byDomain[d]||0)+(e.amount||0)})

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Garage Expenses</div><div className="page-sub">Daily expense records</div></div>
        <div className="page-actions">
          {user?.role==='manager'&&<button className="btn btn-danger btn-sm" onClick={()=>{setShowDeleteModal(true);setDeleteMonth('')}}>Delete Month</button>}
          <button className="btn btn-ghost btn-sm" onClick={()=>{setShowImportModal(true);setImportResult(null)}} disabled={importing}>{importing?'Importing...':'Import Excel'}</button>
          <button className="btn btn-success btn-sm" onClick={()=>{setForm(empty);setEditing(null);setShowAdd(true)}}>+ Add</button>
        </div>
      </div>
      <div className="page-content">
        {importResult&&(
          <div style={{marginBottom:16,padding:'14px 16px',borderRadius:12,border:`1px solid ${importResult.failed===0?'#86efac':'#fca5a5'}`,background:importResult.failed===0?'#f0fdf4':'#fff5f5',display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12}}>
            <div style={{flex:1}}>
              <div style={{fontWeight:800,fontSize:14,color:importResult.failed===0?'#166534':'#dc2626',marginBottom:4}}>
                Import Complete — {importResult.success} imported{importResult.failed>0?`, ${importResult.failed} failed`:''}{importResult.skipped>0?`, ${importResult.skipped} skipped`:''}
              </div>
              {importResult.errors.length>0&&<div style={{fontSize:12,color:'#dc2626'}}>{importResult.errors.map((e,i)=><div key={i}>• {e}</div>)}</div>}
            </div>
            <button onClick={()=>setImportResult(null)} style={{background:'none',border:'none',cursor:'pointer',fontSize:18,color:'#9096ab',flexShrink:0}}></button>
          </div>
        )}

        <div className="stat-grid-4" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
          <div className="stat-card"><div style={{fontSize:11,color:'var(--text2)',marginBottom:4,fontWeight:600}}>Total</div><div style={{fontSize:18,fontWeight:800,color:'var(--red)'}}>{totalAmount.toLocaleString()}</div><div style={{fontSize:10,color:'var(--text3)'}}>RWF</div></div>
          <div className="stat-card"><div style={{fontSize:11,color:'var(--text2)',marginBottom:4,fontWeight:600}}>Records</div><div style={{fontSize:18,fontWeight:800,color:'var(--blue)'}}>{filtered.length}</div><div style={{fontSize:10,color:'var(--text3)'}}>entries</div></div>
          <div className="stat-card"><div style={{fontSize:11,color:'var(--text2)',marginBottom:4,fontWeight:600}}>General</div><div style={{fontSize:18,fontWeight:800,color:'#1d4ed8'}}>{(byDomain['GENERAL']||0).toLocaleString()}</div><div style={{fontSize:10,color:'var(--text3)'}}>RWF</div></div>
          <div className="stat-card"><div style={{fontSize:11,color:'var(--text2)',marginBottom:4,fontWeight:600}}>Transport</div><div style={{fontSize:18,fontWeight:800,color:'#166534'}}>{(byDomain['TRANSPORT']||0).toLocaleString()}</div><div style={{fontSize:10,color:'var(--text3)'}}>RWF</div></div>
        </div>

        <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap'}}>
          <input className="form-input" style={{flex:1,minWidth:160}} placeholder="Search plate, reason..." value={search} onChange={e=>setSearch(e.target.value)}/>
          <select className="form-input" style={{width:140,appearance:'auto'}} value={filterMonth} onChange={e=>setFilterMonth(e.target.value)}>
            <option value="ALL">All Months</option>{MONTHS.map(m=><option key={m} value={m}>{m}</option>)}
          </select>
          <select className="form-input" style={{width:140,appearance:'auto'}} value={filterDomain} onChange={e=>setFilterDomain(e.target.value)}>
            <option value="ALL">All Categories</option>{DOMAINS.map(d=><option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Expense Records</div>
            <span style={{fontFamily:'DM Mono,monospace',fontSize:13,color:'var(--red)',fontWeight:700}}>{totalAmount.toLocaleString()} RWF</span>
          </div>
          {filtered.length===0?(
            <div style={{padding:48,textAlign:'center',color:'var(--text3)'}}>No expense records found</div>
          ):(
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Date</th><th>Plate</th><th className="hide-mobile">Assignment</th><th>Reason</th><th className="hide-mobile">Category</th><th>Amount</th><th>Actions</th></tr></thead>
                <tbody>{filtered.map(e=>{
                  const ds=DOMAIN_STYLE[e.domain]||DOMAIN_STYLE['GENERAL']
                  return(
                    <tr key={e.id}>
                      <td style={{color:'var(--text2)',whiteSpace:'nowrap'}}>{e.date}</td>
                      <td style={{fontFamily:'DM Mono,monospace',color:'var(--blue)',fontWeight:700}}>{e.plate||'—'}</td>
                      <td className="hide-mobile" style={{color:'var(--text2)'}}>{e.assignment||'—'}</td>
                      <td style={{fontWeight:600}}>{e.reason}</td>
                      <td className="hide-mobile"><span style={{fontSize:11,fontWeight:700,borderRadius:20,padding:'3px 10px',background:ds.bg,color:ds.color}}>{e.domain}</span></td>
                      <td style={{fontFamily:'DM Mono,monospace',fontWeight:700,color:'var(--red)',whiteSpace:'nowrap'}}>{(e.amount||0).toLocaleString()}</td>
                      <td>
                        <div style={{display:'flex',gap:4}}>
                          <button className="btn btn-ghost btn-sm" onClick={()=>openEdit(e)}>Edit</button>
                          {user?.role==='manager'&&<button className="btn btn-danger btn-sm" onClick={()=>handleDelete(e.id)}>Del</button>}
                        </div>
                      </td>
                    </tr>
                  )
                })}</tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showAdd&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowAdd(false)}>
          <div className="modal" style={{maxWidth:520}}>
            <div className="modal-header"><div className="modal-title">{editing?'Edit Expense':'Add Expense'}</div><X onClick={()=>{setShowAdd(false);setEditing(null)}}/></div>
            <div className="modal-body">
              <div className="form-row" style={{marginBottom:14}}>
                <div><label className="form-label">Date *</label><input className="form-input" type="date" value={form.date} onChange={e=>sf('date',e.target.value)}/></div>
                <div><label className="form-label">Plate</label><input className="form-input" value={form.plate} onChange={e=>sf('plate',e.target.value.toUpperCase())} placeholder="RAG510W"/></div>
              </div>
              <div className="form-row" style={{marginBottom:14}}>
                <div><label className="form-label">Assignment</label><input className="form-input" value={form.assignment} onChange={e=>sf('assignment',e.target.value)} placeholder="COLGATE, DELIVERY"/></div>
                <div><label className="form-label">Category *</label>
                  <select className="form-input" style={{appearance:'auto'}} value={form.domain} onChange={e=>sf('domain',e.target.value)}>
                    {[...DOMAINS,'TIYRE'].map(d=><option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group"><label className="form-label">Reason *</label><input className="form-input" value={form.reason} onChange={e=>sf('reason',e.target.value)} placeholder="REPAIR TIRES"/></div>
              <div className="form-group"><label className="form-label">Amount (RWF) *</label><input className="form-input" type="number" value={form.amount} onChange={e=>sf('amount',e.target.value)} placeholder="15000"/></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>{setShowAdd(false);setEditing(null)}}>Cancel</button>
              <button className="btn btn-success" onClick={handleSave}>{editing?'Save Changes':'Save Expense'}</button>
            </div>
          </div>
        </div>
      )}

      {showImportModal&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowImportModal(false)}>
          <div className="modal" style={{maxWidth:420}}>
            <div className="modal-header"><div className="modal-title">Import Expenses Excel</div><X onClick={()=>setShowImportModal(false)}/></div>
            <div className="modal-body">
              <div style={{marginBottom:20}}>
                <label className="form-label">Select Month to Import *</label>
                <select className="form-input" style={{appearance:'auto'}} value={selectedMonth} onChange={e=>setSelectedMonth(e.target.value)}>
                  <option value="">— Select a month —</option>
                  {MONTHS.map(m=><option key={m} value={m}>{m}</option>)}
                </select>
                {selectedMonth&&<div style={{fontSize:11,color:'var(--blue)',marginTop:6,fontWeight:600}}>Only {selectedMonth} records will be imported</div>}
              </div>
              <div style={{background:'var(--surface2)',borderRadius:10,padding:'12px 14px',fontSize:13,color:'var(--text2)',lineHeight:1.6}}>
                <strong style={{color:'var(--text)'}}>Excel format:</strong><br/>DATE | PLATE | ASSIGNMENT | REASON | DOMAIN | AMOUNT
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setShowImportModal(false)}>Cancel</button>
              <label className="btn btn-blue" style={{cursor:selectedMonth?'pointer':'not-allowed',opacity:selectedMonth?1:0.5,position:'relative'}}>
                Choose File & Import
                <input type="file" accept=".xlsx,.xls" onChange={e=>{if(selectedMonth){setShowImportModal(false);handleImportExcel(e)}}} style={{position:'absolute',inset:0,opacity:0,cursor:selectedMonth?'pointer':'not-allowed'}} disabled={!selectedMonth||importing}/>
              </label>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowDeleteModal(false)}>
          <div className="modal" style={{maxWidth:420}}>
            <div className="modal-header"><div className="modal-title" style={{color:'var(--red)'}}>Delete by Month</div><X onClick={()=>setShowDeleteModal(false)}/></div>
            <div className="modal-body">
              <div style={{marginBottom:20}}>
                <label className="form-label">Select Month *</label>
                <select className="form-input" style={{appearance:'auto'}} value={deleteMonth} onChange={e=>setDeleteMonth(e.target.value)}>
                  <option value="">— Select a month —</option>
                  {MONTHS.map(m=>{const idx=MONTHS.indexOf(m)+1;const count=expenses.filter(e=>e.date&&new Date(e.date).getMonth()+1===idx).length;return<option key={m} value={m}>{m} {count>0?`(${count} records)`:'(no records)'}</option>})}
                </select>
                {deleteMonth&&(()=>{const idx=MONTHS.indexOf(deleteMonth)+1;const count=expenses.filter(e=>e.date&&new Date(e.date).getMonth()+1===idx).length;return<div style={{fontSize:11,color:'#dc2626',marginTop:6,fontWeight:600}}>Will permanently delete {count} record{count!==1?'s':''} for {deleteMonth}</div>})()}
              </div>
              <div style={{background:'#fff5f5',border:'1px solid #fca5a5',borderRadius:10,padding:'12px 14px',fontSize:13,color:'#dc2626'}}>This action cannot be undone.</div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setShowDeleteModal(false)}>Cancel</button>
              <button className="btn" style={{background:'var(--red)',color:'#fff',opacity:deleteMonth?1:0.5}} onClick={handleDeleteMonth} disabled={!deleteMonth||deleting}>{deleting?'Deleting...':'Delete All Records'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

//  AUDIT LOG 
function AuditLogPage() {
  const [logs, setLogs] = useState([])
  const [search, setSearch] = useState('')
  const [filterModule, setFilterModule] = useState('ALL')
  const [filterAction, setFilterAction] = useState('ALL')
  const MODULES=['ALL','Expenses','Fleet Vehicles','Garage Vehicles','Inventory','Fuel Logs']
  const ACTIONS=['ALL','ADD','EDIT','DELETE']
  const ACTION_STYLE={'ADD':{bg:'#d1fae5',color:'#065f46'},'EDIT':{bg:'#dbeafe',color:'#1e40af'},'DELETE':{bg:'#fee2e2',color:'#991b1b'}}
  useEffect(()=>{api.get('/audit').then(r=>setLogs(Array.isArray(r.data)?r.data:[])).catch(e=>console.error(e))},[])
  const filtered=logs.filter(l=>{
    const q=search.toLowerCase()
    return(filterModule==='ALL'||l.moduleName===filterModule)&&(filterAction==='ALL'||l.action===filterAction)&&(!q||l.userName?.toLowerCase().includes(q)||l.details?.toLowerCase().includes(q)||l.moduleName?.toLowerCase().includes(q))
  })
  const formatTime=(ts)=>{if(!ts)return'—';const d=new Date(ts);return d.toLocaleDateString('en-GB')+' '+d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}
  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Audit Log</div><div className="page-sub">Track who did what and when</div></div>
        <span style={{fontSize:13,color:'var(--text2)',fontWeight:600,alignSelf:'flex-end'}}>{filtered.length} records</span>
      </div>
      <div className="page-content">
        <div className="stat-grid-3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:16}}>
          {[['Total Actions',logs.length,'var(--blue)'],['This Month',logs.filter(l=>{const d=new Date(l.timestamp);const n=new Date();return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear()}).length,'var(--green)'],['Deletions',logs.filter(l=>l.action==='DELETE').length,'var(--red)']].map(([label,val,color])=>(
            <div key={label} className="stat-card"><div style={{fontSize:12,color:'var(--text2)',marginBottom:4,fontWeight:600}}>{label}</div><div style={{fontSize:22,fontWeight:800,color}}>{val}</div></div>
          ))}
        </div>
        <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap'}}>
          <input className="form-input" style={{flex:1,minWidth:160}} placeholder="Search user, module, details..." value={search} onChange={e=>setSearch(e.target.value)}/>
          <select className="form-input" style={{width:160,appearance:'auto'}} value={filterModule} onChange={e=>setFilterModule(e.target.value)}>
            {MODULES.map(m=><option key={m} value={m}>{m==='ALL'?'All Modules':m}</option>)}
          </select>
          <select className="form-input" style={{width:130,appearance:'auto'}} value={filterAction} onChange={e=>setFilterAction(e.target.value)}>
            {ACTIONS.map(a=><option key={a} value={a}>{a==='ALL'?'All Actions':a}</option>)}
          </select>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Activity History</div></div>
          {filtered.length===0?<div style={{padding:48,textAlign:'center',color:'var(--text3)'}}>No audit records found</div>:(
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Time</th><th>User</th><th className="hide-mobile">Role</th><th>Action</th><th className="hide-mobile">Module</th><th>Details</th></tr></thead>
                <tbody>{[...filtered].reverse().map((l,i)=>{
                  const as=ACTION_STYLE[l.action]||ACTION_STYLE['ADD'];const rc=ROLE_CONFIG[l.userRole]
                  return(
                    <tr key={i}>
                      <td style={{color:'var(--text2)',fontSize:11,whiteSpace:'nowrap'}}>{formatTime(l.timestamp)}</td>
                      <td style={{fontWeight:700}}>{l.userName}</td>
                      <td className="hide-mobile"><span style={{fontSize:11,fontWeight:700,borderRadius:20,padding:'3px 10px',background:rc?.bg||'var(--surface2)',color:rc?.color||'var(--text2)'}}>{l.userRole}</span></td>
                      <td><span style={{fontSize:11,fontWeight:800,borderRadius:20,padding:'3px 10px',background:as.bg,color:as.color}}>{l.action}</span></td>
                      <td className="hide-mobile" style={{fontSize:13,color:'var(--text2)',fontWeight:600}}>{l.moduleName}</td>
                      <td style={{fontSize:12,color:'var(--text2)',maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{l.details}</td>
                    </tr>
                  )
                })}</tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

//  REPORTS PAGE 
function ReportsPage() {
  const [activeReport, setActiveReport] = useState('fleet')
  const [search, setSearch] = useState('')
  const [data, setData] = useState({vehicles:[],fleet:[],fuel:[],inventory:[],staff:[],expenses:[]})
  useEffect(()=>{
    Promise.all([api.get('/vehicles'),api.get('/fleet'),api.get('/fleet/fuel/all'),api.get('/inventory'),api.get('/auth/users'),api.get('/expenses')])
      .then(([v,f,fuel,inv,s,exp])=>setData({
        vehicles:Array.isArray(v.data)?v.data:v.data?.content||[],
        fleet:Array.isArray(f.data)?f.data:f.data?.content||[],
        fuel:Array.isArray(fuel.data)?fuel.data:fuel.data?.content||[],
        inventory:Array.isArray(inv.data)?inv.data:inv.data?.content||[],
        staff:Array.isArray(s.data)?s.data:s.data?.content||[],
        expenses:Array.isArray(exp.data)?exp.data:[]
      })).catch(e=>console.error(e))
  },[])
  const reportTabs=[{key:'fleet',label:'Fleet'},{key:'garage',label:'Garage'},{key:'fuel',label:'Fuel'},{key:'inventory',label:'Inventory'},{key:'staff',label:'Staff'},{key:'expenses',label:'Expenses'}]
  const q=search.toLowerCase()
  const filteredFleet=data.fleet.filter(v=>!q||v.plate?.toLowerCase().includes(q)||v.make?.toLowerCase().includes(q)||v.driverName?.toLowerCase().includes(q))
  const filteredGarage=data.vehicles.filter(v=>!q||v.plate?.toLowerCase().includes(q)||v.make?.toLowerCase().includes(q)||v.ownerName?.toLowerCase().includes(q))
  const filteredFuel=data.fuel.filter(f=>!q||f.fleetVehicle?.plate?.toLowerCase().includes(q)||f.station?.toLowerCase().includes(q))
  const filteredInventory=data.inventory.filter(i=>!q||i.name?.toLowerCase().includes(q)||i.category?.toLowerCase().includes(q))
  const filteredStaff=data.staff.filter(s=>!q||s.name?.toLowerCase().includes(q)||s.email?.toLowerCase().includes(q))
  const filteredExpenses=data.expenses.filter(e=>!q||e.plate?.toLowerCase().includes(q)||e.reason?.toLowerCase().includes(q)||e.domain?.toLowerCase().includes(q))
  const exportCSV=(rows,headers,filename)=>{
    const csv=[headers,...rows].map(r=>r.map(c=>`"${c??''}"`).join(',')).join('\n')
    const blob=new Blob([csv],{type:'text/csv'});const url=URL.createObjectURL(blob)
    const a=document.createElement('a');a.href=url;a.download=`${filename}-${new Date().toISOString().split('T')[0]}.csv`;a.click();URL.revokeObjectURL(url)
  }
  const exportPDF=(title,headers,rows)=>{
    const tableRows=rows.map(r=>`<tr>${r.map(c=>`<td>${c??'—'}</td>`).join('')}</tr>`).join('')
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title><style>body{font-family:Calibri,sans-serif;padding:30px;color:#111}h1{font-size:20px;margin-bottom:4px}p{color:#555;font-size:12px;margin:2px 0}table{width:100%;border-collapse:collapse;margin-top:16px;font-size:12px}th{background:#2563eb;color:#fff;padding:8px;text-align:left}td{padding:7px 8px;border-bottom:1px solid #eee}tr:nth-child(even) td{background:#f8faff}</style></head><body><h1>${title}</h1><p>Generated: ${new Date().toLocaleString()}</p><p>Total Records: ${rows.length}</p><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${tableRows}</tbody></table></body></html>`
    const w=window.open('','_blank');w.document.write(html);w.document.close();w.print()
  }
  const handleExportCSV=()=>{
    if(activeReport==='fleet')exportCSV(filteredFleet.map(v=>[v.plate,v.make,v.model,v.year,v.status,v.driverName,v.driverPhone,v.mileage,v.insuranceExpiry]),['Plate','Make','Model','Year','Status','Driver','Phone','Mileage','Ins. Expiry'],'fleet')
    else if(activeReport==='garage')exportCSV(filteredGarage.map(v=>[v.plate,v.make,v.model,v.year,v.status,v.ownerName,v.ownerPhone,v.mileage]),['Plate','Make','Model','Year','Status','Owner','Phone','Mileage'],'garage')
    else if(activeReport==='fuel')exportCSV(filteredFuel.map(f=>[f.fleetVehicle?.plate,f.date,f.liters,f.totalCost,f.station,f.filledBy]),['Vehicle','Date','Liters','Total Cost','Station','Filled By'],'fuel')
    else if(activeReport==='inventory')exportCSV(filteredInventory.map(i=>[i.name,i.category,i.quantity,i.unit,i.unitPrice,i.status,i.supplier]),['Name','Category','Qty','Unit','Price','Status','Supplier'],'inventory')
    else if(activeReport==='staff')exportCSV(filteredStaff.map(s=>[s.name,s.email,s.role]),['Name','Email','Role'],'staff')
    else if(activeReport==='expenses')exportCSV(filteredExpenses.map(e=>[e.date,e.plate,e.assignment,e.reason,e.domain,e.amount]),['Date','Plate','Assignment','Reason','Domain','Amount'],'expenses')
  }
  const handleExportPDF=()=>{
    if(activeReport==='fleet')exportPDF('Fleet Vehicles Report',['Plate','Make','Model','Year','Status','Driver','Mileage','Ins. Expiry'],filteredFleet.map(v=>[v.plate,v.make,v.model,v.year,v.status,v.driverName,v.mileage,v.insuranceExpiry]))
    else if(activeReport==='garage')exportPDF('Garage Vehicles Report',['Plate','Make','Model','Year','Status','Owner','Phone','Mileage'],filteredGarage.map(v=>[v.plate,v.make,v.model,v.year,v.status,v.ownerName,v.ownerPhone,v.mileage]))
    else if(activeReport==='fuel')exportPDF('Fuel Logs Report',['Vehicle','Date','Liters','Total Cost (RWF)','Station','Filled By'],filteredFuel.map(f=>[f.fleetVehicle?.plate,f.date,f.liters,f.totalCost,f.station,f.filledBy]))
    else if(activeReport==='inventory')exportPDF('Inventory Report',['Name','Category','Qty','Unit Price','Status','Supplier'],filteredInventory.map(i=>[i.name,i.category,`${i.quantity} ${i.unit}`,i.unitPrice,i.status,i.supplier]))
    else if(activeReport==='staff')exportPDF('Staff Report',['Name','Email','Role'],filteredStaff.map(s=>[s.name,s.email,s.role]))
    else if(activeReport==='expenses')exportPDF('Expenses Report',['Date','Plate','Assignment','Reason','Domain','Amount (RWF)'],filteredExpenses.map(e=>[e.date,e.plate||'—',e.assignment||'—',e.reason,e.domain,(e.amount||0).toLocaleString()]))
  }
  const currentCount={fleet:filteredFleet.length,garage:filteredGarage.length,fuel:filteredFuel.length,inventory:filteredInventory.length,staff:filteredStaff.length,expenses:filteredExpenses.length}[activeReport]
  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Reports</div><div className="page-sub">Generate and export reports</div></div>
        <div className="page-actions">
          <button className="btn btn-ghost btn-sm" onClick={handleExportCSV}>CSV</button>
          <button className="btn btn-blue btn-sm" onClick={handleExportPDF}>PDF</button>
        </div>
      </div>
      <div className="page-content">
        <div className="tab-bar" style={{marginBottom:16}}>
          {reportTabs.map(t=>(
            <button key={t.key} className="tab-btn" onClick={()=>{setActiveReport(t.key);setSearch('')}} style={{background:activeReport===t.key?'var(--blue)':'transparent',color:activeReport===t.key?'#fff':'var(--text2)'}}>{t.label}</button>
          ))}
        </div>
        <div style={{marginBottom:16,display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
          <input className="form-input" style={{flex:1,minWidth:160}} placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}/>
          {search&&<button className="btn btn-ghost btn-sm" onClick={()=>setSearch('')}></button>}
          <span style={{fontSize:13,color:'var(--text2)',fontWeight:600,whiteSpace:'nowrap'}}>{currentCount} records</span>
        </div>
        <div className="card">
          {activeReport==='fleet'&&(
            filteredFleet.length===0?<div style={{padding:48,textAlign:'center',color:'var(--text3)'}}>No fleet vehicles found</div>:(
              <div className="table-wrap"><table className="table">
                <thead><tr><th>Plate</th><th>Make/Model</th><th className="hide-mobile">Year</th><th>Status</th><th className="hide-mobile">Driver</th><th className="hide-mobile">Ins. Expiry</th></tr></thead>
                <tbody>{filteredFleet.map(v=>{const ss=FLEET_STATUS[v.status]||FLEET_STATUS['Active'];return(
                  <tr key={v.id}>
                    <td style={{fontFamily:'DM Mono,monospace',color:'var(--blue)',fontWeight:700}}>{v.plate}</td>
                    <td style={{fontWeight:600}}>{v.make} {v.model}</td>
                    <td className="hide-mobile">{v.year}</td>
                    <td><span style={{fontSize:11,fontWeight:700,borderRadius:20,padding:'3px 8px',background:ss.bg,color:ss.color}}>{v.status?.replace('_',' ')}</span></td>
                    <td className="hide-mobile">{v.driverName||'—'}</td>
                    <td className="hide-mobile" style={{color:v.insuranceExpiry&&new Date(v.insuranceExpiry)<new Date()?'var(--red)':'var(--text2)'}}>{v.insuranceExpiry||'—'}</td>
                  </tr>
                )})}</tbody>
              </table></div>
            )
          )}
          {activeReport==='garage'&&(
            filteredGarage.length===0?<div style={{padding:48,textAlign:'center',color:'var(--text3)'}}>No garage vehicles found</div>:(
              <div className="table-wrap"><table className="table">
                <thead><tr><th>Plate</th><th>Make/Model</th><th>Status</th><th className="hide-mobile">Owner</th><th className="hide-mobile">Mileage</th></tr></thead>
                <tbody>{filteredGarage.map(v=>{const ss=STATUS_STYLE[v.status]||STATUS_STYLE['Ready'];return(
                  <tr key={v.id}>
                    <td style={{fontFamily:'DM Mono,monospace',color:'var(--blue)',fontWeight:700}}>{v.plate}</td>
                    <td style={{fontWeight:600}}>{v.make} {v.model}</td>
                    <td><span style={{fontSize:11,fontWeight:700,borderRadius:20,padding:'3px 8px',background:ss.bg,color:ss.color}}>{v.status?.replace('_',' ')}</span></td>
                    <td className="hide-mobile">{v.ownerName||'—'}</td>
                    <td className="hide-mobile">{v.mileage?`${Number(v.mileage).toLocaleString()} km`:'—'}</td>
                  </tr>
                )})}</tbody>
              </table></div>
            )
          )}
          {activeReport==='fuel'&&(
            filteredFuel.length===0?<div style={{padding:48,textAlign:'center',color:'var(--text3)'}}>No fuel logs found</div>:(
              <div className="table-wrap"><table className="table">
                <thead><tr><th>Vehicle</th><th>Date</th><th>Liters</th><th>Total Cost</th><th className="hide-mobile">Station</th></tr></thead>
                <tbody>{[...filteredFuel].reverse().map(f=>(
                  <tr key={f.id}>
                    <td style={{fontFamily:'DM Mono,monospace',color:'var(--blue)',fontWeight:700}}>{f.fleetVehicle?.plate||'—'}</td>
                    <td style={{color:'var(--text2)'}}>{f.date}</td>
                    <td style={{fontWeight:600}}>{f.liters}L</td>
                    <td style={{fontFamily:'DM Mono,monospace',color:'var(--green)',fontWeight:700}}>{(f.totalCost||0).toLocaleString()} RWF</td>
                    <td className="hide-mobile">{f.station||'—'}</td>
                  </tr>
                ))}</tbody>
              </table></div>
            )
          )}
          {activeReport==='inventory'&&(
            filteredInventory.length===0?<div style={{padding:48,textAlign:'center',color:'var(--text3)'}}>No inventory items</div>:(
              <div className="table-wrap"><table className="table">
                <thead><tr><th>Name</th><th className="hide-mobile">Category</th><th>Qty</th><th className="hide-mobile">Unit Price</th><th>Status</th></tr></thead>
                <tbody>{filteredInventory.map(i=>{const st=INV_STATUS[i.status]||INV_STATUS['In_Stock'];return(
                  <tr key={i.id}>
                    <td style={{fontWeight:600}}>{i.name}</td>
                    <td className="hide-mobile"><span style={{fontSize:11,background:'var(--surface2)',color:'var(--text2)',borderRadius:6,padding:'3px 8px',fontWeight:600}}>{i.category}</span></td>
                    <td style={{fontFamily:'DM Mono,monospace',fontWeight:600}}>{i.quantity} {i.unit}</td>
                    <td className="hide-mobile" style={{fontFamily:'DM Mono,monospace',color:'var(--green)'}}>{(i.unitPrice||0).toLocaleString()} RWF</td>
                    <td><span style={{fontSize:11,fontWeight:700,borderRadius:20,padding:'3px 8px',background:st.bg,color:st.color}}>{i.status?.replace('_',' ')}</span></td>
                  </tr>
                )})}</tbody>
              </table></div>
            )
          )}
          {activeReport==='staff'&&(
            filteredStaff.length===0?<div style={{padding:48,textAlign:'center',color:'var(--text3)'}}>No staff found</div>:(
              <div className="table-wrap"><table className="table">
                <thead><tr><th>Name</th><th className="hide-mobile">Email</th><th>Role</th></tr></thead>
                <tbody>{filteredStaff.map(s=>{const rc=ROLE_CONFIG[s.role];return(
                  <tr key={s.id}>
                    <td style={{fontWeight:600}}>{s.name}</td>
                    <td className="hide-mobile" style={{fontFamily:'DM Mono,monospace',color:'var(--text2)',fontSize:13}}>{s.email}</td>
                    <td><span style={{fontSize:12,fontWeight:700,borderRadius:20,padding:'3px 10px',background:rc?.bg,color:rc?.color}}>{rc?.label}</span></td>
                  </tr>
                )})}</tbody>
              </table></div>
            )
          )}
          {activeReport==='expenses'&&(
            filteredExpenses.length===0?<div style={{padding:48,textAlign:'center',color:'var(--text3)'}}>No expense records</div>:(
              <div className="table-wrap"><table className="table">
                <thead><tr><th>Date</th><th>Plate</th><th className="hide-mobile">Reason</th><th className="hide-mobile">Category</th><th>Amount</th></tr></thead>
                <tbody>{filteredExpenses.map(e=>(
                  <tr key={e.id}>
                    <td style={{color:'var(--text2)',whiteSpace:'nowrap'}}>{e.date}</td>
                    <td style={{fontFamily:'DM Mono,monospace',color:'var(--blue)',fontWeight:700}}>{e.plate||'—'}</td>
                    <td className="hide-mobile" style={{fontWeight:600}}>{e.reason}</td>
                    <td className="hide-mobile"><span style={{fontSize:11,fontWeight:700,borderRadius:20,padding:'3px 8px',background:'#eff6ff',color:'#1d4ed8'}}>{e.domain}</span></td>
                    <td style={{fontFamily:'DM Mono,monospace',fontWeight:700,color:'var(--red)',whiteSpace:'nowrap'}}>{(e.amount||0).toLocaleString()}</td>
                  </tr>
                ))}</tbody>
              </table></div>
            )
          )}
        </div>
      </div>
    </>
  )
}

//  FUEL LOGS 
function FuelLogsPage({ user }) {
  const [logs, setLogs] = useState([])
  const [fleet, setFleet] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [filterVehicle, setFilterVehicle] = useState('all')
  const [filterFuelType, setFilterFuelType] = useState('ALL')
  const [showImportModal, setShowImportModal] = useState(false)
  const [pendingFuelType, setPendingFuelType] = useState('DIESEL')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteMonth, setDeleteMonth] = useState('')
  const [deleting, setDeleting] = useState(false)
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const emptyForm = { fleetVehicleId:'', date:'', liters:'', totalCost:'', station:'', filledBy:'', fuelType:'DIESEL' }
  const [form, setForm] = useState(emptyForm)
  const sf = (k,v) => setForm(f=>({...f,[k]:v}))

  useEffect(()=>{ fetchData() },[])

  const fetchData = async () => {
    try {
      const [l, f] = await Promise.all([api.get('/fleet/fuel/all'), api.get('/fleet')])
      setLogs(Array.isArray(l.data) ? l.data : [])
      const fd = Array.isArray(f.data) ? f.data : []
      setFleet(fd)
      if(fd.length > 0) setForm(fr=>({...fr, fleetVehicleId: fd[0].id}))
    } catch(e){ console.error(e) }
  }

  // Get fuel type from a log record — reads from filledBy prefix OR fuelType field
  const getFuelType = (log) => {
    if(log.filledBy?.startsWith('PETROL:')) return 'PETROL'
    if(log.filledBy?.startsWith('DIESEL:')) return 'DIESEL'
    if(log.fuelType === 'PETROL') return 'PETROL'
    if(log.fuelType === 'DIESEL') return 'DIESEL'
    return 'DIESEL' // default for old records
  }

  // Get clean department name without any prefix
  const getDept = (log) => {
    const fb = log.filledBy || ''
    if(fb.startsWith('PETROL:') || fb.startsWith('DIESEL:')) return fb.split(':').slice(1).join(':')
    return fb
  }

  const openEdit = (log) => {
    setEditing(log)
    setForm({
      fleetVehicleId: log.fleetVehicle?.id || '',
      date: log.date || '',
      liters: log.liters || '',
      totalCost: log.totalCost || '',
      station: log.station || '',
      filledBy: getDept(log),
      fuelType: getFuelType(log)
    })
    setShowAdd(true)
  }

  const handleSave = async () => {
    if(!form.fleetVehicleId || !form.liters || !form.date){ alert('Vehicle, date and liters required'); return }
    const payload = {
      fleetVehicleId: form.fleetVehicleId,
      date: form.date,
      liters: parseFloat(form.liters),
      costPerLiter: form.totalCost && form.liters ? Math.round(parseFloat(form.totalCost)/parseFloat(form.liters)) : 0,
      totalCost: parseInt(form.totalCost) || 0,
      mileageAtFill: 0,
      station: form.station,
      filledBy: `${form.fuelType}:${form.filledBy || ''}`,
      fuelType: form.fuelType
    }
    try {
      if(editing){
        await api.put(`/fleet/${form.fleetVehicleId}/fuel/${editing.id}`, payload)
        await logAudit(user, 'EDIT', 'Fuel Logs', `Edited fuel log`)
      } else {
        await api.post(`/fleet/${form.fleetVehicleId}/fuel`, payload)
        await logAudit(user, 'ADD', 'Fuel Logs', `Added ${form.fuelType} log: ${payload.liters}L`)
      }
      fetchData(); setShowAdd(false); setEditing(null); setForm(emptyForm)
    } catch { alert('Failed to save fuel log') }
  }

  const handleDelete = async (log) => {
    if(!window.confirm('Delete this fuel log entry?')) return
    try {
      await api.delete(`/fleet/${log.fleetVehicle?.id}/fuel/${log.id}`)
      await logAudit(user, 'DELETE', 'Fuel Logs', `Deleted fuel log: ${log.liters}L on ${log.date}`)
      fetchData()
    } catch { alert('Failed to delete') }
  }

  const handleDeleteMonth = async () => {
    if(!deleteMonth) return
    const mi = MONTHS.indexOf(deleteMonth) + 1
    const toDelete = logs.filter(l => l.date && new Date(l.date).getMonth()+1 === mi)
    if(toDelete.length === 0){ alert(`No fuel logs for ${deleteMonth}`); return }
    if(!window.confirm(`Delete all ${toDelete.length} entries for ${deleteMonth}?`)) return
    setDeleting(true)
    let ok = 0
    for(const log of toDelete){
      try{ await api.delete(`/fleet/${log.fleetVehicle?.id}/fuel/${log.id}`); ok++ } catch{}
    }
    setDeleting(false); setShowDeleteModal(false); setDeleteMonth(''); fetchData()
    alert(`Deleted ${ok} of ${toDelete.length} records`)
  }

  const extractPlate = (particulars) => {
    if(!particulars) return null
    return particulars.split(' - ')[0].split('(')[0].trim().replace(/[\s\-]/g,'').toUpperCase()
  }

  const handleImportExcel = async (e, fuelType) => {
    const file = e.target.files[0]; if(!file) return
    setImporting(true); setImportResult(null)
    try {
      const XLSX = await import('https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs')
      const data = await file.arrayBuffer()
      const wb = XLSX.read(data, { cellDates: true })
      const sheetName = (wb.SheetNames[0] || '').toLowerCase()

      // Detect fuel type from the sheet name
      const detectedType = sheetName.includes('petrol') || sheetName.includes('super') ? 'PETROL'
                         : sheetName.includes('diesel') ? 'DIESEL'
                         : null

      // Block if wrong file
      if(detectedType && detectedType !== fuelType) {
        setImporting(false)
        setImportResult({ wrongFile: true, expected: fuelType, got: detectedType, sheetName: wb.SheetNames[0] })
        e.target.value = ''
        return
      }

      const resolvedType = detectedType || fuelType
      const ws = wb.Sheets[wb.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json(ws, { header:1, defval:'' })

      const SKIP = ['opening balance','totals','closing balance','particulars','stock item','eri-rwanda','fuel -','date','plate number']
      let success=0, failed=0, skipped=0, errors=[]

      for(const row of rows){
        const rawDate = row[0]
        const particulars = String(row[1] || '').trim()
        const quantity = parseFloat(row[4]) || 0
        const value = parseFloat(row[5]) || 0
        const vchNo = String(row[3] || '').trim()

        if(!rawDate || !particulars || !quantity){ skipped++; continue }
        if(SKIP.some(k => particulars.toLowerCase().includes(k))){ skipped++; continue }

        // Parse date using LOCAL parts to avoid UTC timezone shift
        let dateStr = ''
        if(rawDate instanceof Date){
          const y = rawDate.getFullYear()
          const mo = String(rawDate.getMonth()+1).padStart(2,'0')
          const dy = String(rawDate.getDate()).padStart(2,'0')
          dateStr = `${y}-${mo}-${dy}`
          // Month filter
          if(rawDate.getMonth() !== MONTHS.indexOf(selectedMonth)){ skipped++; continue }
        } else { skipped++; continue }

        // Extract plate
        const plateNorm = extractPlate(particulars)
        if(!plateNorm || plateNorm.length < 5){ skipped++; continue }

        // Match fleet vehicle
        const vehicle = fleet.find(v => v.plate?.replace(/[\s\-]/g,'').toUpperCase() === plateNorm)
        if(!vehicle){
          failed++
          if(errors.length < 8) errors.push(`Plate not in fleet: "${particulars}"`)
          continue
        }

        // Department from fleet vehicle registration
        const dept = vehicle.companyDepartment && vehicle.companyDepartment !== '--Please Select--'
          ? vehicle.companyDepartment : ''

        try {
          await api.post(`/fleet/${vehicle.id}/fuel`, {
            date: dateStr,
            liters: quantity,
            costPerLiter: quantity > 0 ? Math.round(value / quantity) : 0,
            totalCost: Math.round(value),
            mileageAtFill: 0,
            station: vchNo,
            filledBy: `${resolvedType}:${dept}`,
            fuelType: resolvedType
          })
          success++
        } catch {
          failed++
          if(errors.length < 8) errors.push(`Save failed: ${particulars} on ${dateStr}`)
        }
      }

      setImportResult({ success, failed, skipped, errors, fuelType: resolvedType })
      if(success > 0) fetchData()
    } catch(err) {
      setImportResult({ success:0, failed:1, skipped:0, errors:['Failed to read file: '+err.message], fuelType })
    }
    setImporting(false); e.target.value = ''
  }

  // Filtered list
  const filtered = logs
    .filter(l => filterVehicle === 'all' || l.fleetVehicle?.id === parseInt(filterVehicle))
    .filter(l => filterFuelType === 'ALL' || getFuelType(l) === filterFuelType)

  // Stats
  const dieselLogs = logs.filter(l => getFuelType(l) === 'DIESEL')
  const petrolLogs = logs.filter(l => getFuelType(l) === 'PETROL')
  const totalDieselL = dieselLogs.reduce((s,l) => s+(l.liters||0), 0)
  const totalDieselC = dieselLogs.reduce((s,l) => s+(l.totalCost||0), 0)
  const totalPetrolL = petrolLogs.reduce((s,l) => s+(l.liters||0), 0)
  const totalPetrolC = petrolLogs.reduce((s,l) => s+(l.totalCost||0), 0)
  const totalL = totalDieselL + totalPetrolL
  const totalC = totalDieselC + totalPetrolC

  const FUEL_STYLE = {
    DIESEL: { bg:'#fef3c7', color:'#92400e', border:'#f59e0b' },
    PETROL: { bg:'#dbeafe', color:'#1e40af', border:'#2563eb' }
  }

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Fuel Logs</div><div className="page-sub">Diesel &amp; Petrol consumption tracking</div></div>
        <div className="page-actions">
          <button className="btn btn-danger btn-sm" onClick={()=>{ setShowDeleteModal(true); setDeleteMonth('') }}>Delete Month</button>
          <button className="btn btn-ghost btn-sm" style={{borderColor:'#f59e0b',color:'#92400e'}}
            onClick={()=>{ setPendingFuelType('DIESEL'); setSelectedMonth(''); setShowImportModal(true); setImportResult(null) }}
            disabled={importing}>Import Diesel</button>
          <button className="btn btn-ghost btn-sm" style={{borderColor:'#2563eb',color:'#1e40af'}}
            onClick={()=>{ setPendingFuelType('PETROL'); setSelectedMonth(''); setShowImportModal(true); setImportResult(null) }}
            disabled={importing}>Import Petrol</button>
          <button className="btn btn-blue btn-sm" onClick={()=>{ setEditing(null); setForm(emptyForm); setShowAdd(true) }}>+ Log Fill</button>
        </div>
      </div>

      <div className="page-content">

        {/* Import result banner */}
        {importResult && (
          <div style={{marginBottom:16,padding:'14px 16px',borderRadius:12,
            background: importResult.wrongFile ? '#fff5f5' : importResult.failed===0 ? '#f0fdf4' : '#fff5f5',
            border: `1px solid ${importResult.wrongFile ? '#fca5a5' : importResult.failed===0 ? '#86efac' : '#fca5a5'}`,
            display:'flex',gap:12,alignItems:'flex-start'}}>
            <div style={{flex:1}}>
              {importResult.wrongFile ? (
                <div>
                  <div style={{fontWeight:800,fontSize:14,color:'#dc2626',marginBottom:6}}>Wrong File — Import Blocked</div>
                  <div style={{fontSize:13,color:'#7f1d1d'}}>
                    You clicked <strong>Import {importResult.expected}</strong> but selected a <strong>{importResult.got}</strong> file
                    ({importResult.sheetName}). Please choose the correct {importResult.expected} Excel file.
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{fontWeight:800,fontSize:14,color:importResult.failed===0?'#166534':'#dc2626',marginBottom:4}}>
                    {importResult.fuelType} Import — {importResult.success} imported
                    {importResult.failed>0 ? `, ${importResult.failed} failed` : ''}
                    {importResult.skipped>0 ? `, ${importResult.skipped} skipped` : ''}
                  </div>
                  {importResult.errors?.length>0 && (
                    <div style={{fontSize:12,color:'#dc2626'}}>
                      {importResult.errors.map((err,i)=><div key={i}>• {err}</div>)}
                    </div>
                  )}
                </div>
              )}
            </div>
            <button onClick={()=>setImportResult(null)} style={{background:'none',border:'none',cursor:'pointer',fontSize:20,color:'#9096ab',flexShrink:0,lineHeight:1}}>×</button>
          </div>
        )}

        {/* Stats — 6 cards */}
        <div className="stat-grid-3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:16}}>
          <div className="stat-card" style={{borderLeft:`3px solid #f59e0b`}}>
            <div style={{fontSize:11,fontWeight:700,color:'var(--text2)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>Diesel Liters</div>
            <div style={{fontSize:22,fontWeight:800,color:'#92400e'}}>{totalDieselL.toFixed(1)} L</div>
            <div style={{fontSize:11,color:'var(--text3)',marginTop:2}}>{dieselLogs.length} fills</div>
          </div>
          <div className="stat-card" style={{borderLeft:`3px solid #f59e0b`}}>
            <div style={{fontSize:11,fontWeight:700,color:'var(--text2)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>Diesel Cost</div>
            <div style={{fontSize:22,fontWeight:800,color:'#92400e'}}>{totalDieselC.toLocaleString()}</div>
            <div style={{fontSize:11,color:'var(--text3)',marginTop:2}}>RWF</div>
          </div>
          <div className="stat-card" style={{borderLeft:`3px solid #2563eb`}}>
            <div style={{fontSize:11,fontWeight:700,color:'var(--text2)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>Petrol Liters</div>
            <div style={{fontSize:22,fontWeight:800,color:'#1e40af'}}>{totalPetrolL.toFixed(1)} L</div>
            <div style={{fontSize:11,color:'var(--text3)',marginTop:2}}>{petrolLogs.length} fills</div>
          </div>
          <div className="stat-card" style={{borderLeft:`3px solid #2563eb`}}>
            <div style={{fontSize:11,fontWeight:700,color:'var(--text2)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>Petrol Cost</div>
            <div style={{fontSize:22,fontWeight:800,color:'#1e40af'}}>{totalPetrolC.toLocaleString()}</div>
            <div style={{fontSize:11,color:'var(--text3)',marginTop:2}}>RWF</div>
          </div>
          <div className="stat-card" style={{borderLeft:`3px solid #059669`}}>
            <div style={{fontSize:11,fontWeight:700,color:'var(--text2)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>Total Liters</div>
            <div style={{fontSize:22,fontWeight:800,color:'var(--green)'}}>{totalL.toFixed(1)} L</div>
            <div style={{fontSize:11,color:'var(--text3)',marginTop:2}}>All fuel</div>
          </div>
          <div className="stat-card" style={{borderLeft:`3px solid #059669`}}>
            <div style={{fontSize:11,fontWeight:700,color:'var(--text2)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>Total Cost</div>
            <div style={{fontSize:22,fontWeight:800,color:'var(--green)'}}>{totalC.toLocaleString()}</div>
            <div style={{fontSize:11,color:'var(--text3)',marginTop:2}}>RWF</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap',alignItems:'center'}}>
          <select className="form-input" style={{maxWidth:260,appearance:'auto'}} value={filterVehicle} onChange={e=>setFilterVehicle(e.target.value)}>
            <option value="all">All Fleet Vehicles</option>
            {fleet.map(v=><option key={v.id} value={v.id}>{v.plate} — {v.make} {v.model}</option>)}
          </select>
          <div className="tab-bar" style={{width:'auto'}}>
            {[['ALL','All'],['DIESEL','Diesel'],['PETROL','Petrol']].map(([val,label])=>(
              <button key={val} className="tab-btn" onClick={()=>setFilterFuelType(val)}
                style={{background:filterFuelType===val?'var(--blue)':'transparent',color:filterFuelType===val?'#fff':'var(--text2)',padding:'7px 14px'}}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Fuel History</div>
            <span style={{fontSize:12,color:'var(--text2)',fontWeight:600}}>{filtered.length} entries</span>
          </div>
          {filtered.length === 0 ? (
            <div style={{padding:48,textAlign:'center',color:'var(--text3)'}}>No fuel logs yet</div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Plate</th>
                    <th>Type</th>
                    <th>Department</th>
                    <th className="hide-mobile">Vch No.</th>
                    <th>Liters</th>
                    <th>Value (RWF)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...filtered].reverse().map(l => {
                    const ft = getFuelType(l)
                    const dept = getDept(l)
                    const fs = FUEL_STYLE[ft] || FUEL_STYLE.DIESEL
                    return (
                      <tr key={l.id}>
                        <td style={{color:'var(--text2)',whiteSpace:'nowrap'}}>{l.date}</td>
                        <td style={{fontFamily:'DM Mono,monospace',color:'var(--blue)',fontWeight:700}}>{l.fleetVehicle?.plate||'—'}</td>
                        <td>
                          <span style={{fontSize:11,fontWeight:800,borderRadius:20,padding:'3px 9px',background:fs.bg,color:fs.color,whiteSpace:'nowrap'}}>
                            {ft}
                          </span>
                        </td>
                        <td style={{fontSize:13,fontWeight:600,color:'var(--text2)'}}>{dept||'—'}</td>
                        <td className="hide-mobile" style={{fontFamily:'DM Mono,monospace',fontSize:12,color:'var(--text3)'}}>{l.station||'—'}</td>
                        <td style={{fontWeight:700}}>{l.liters}L</td>
                        <td style={{fontFamily:'DM Mono,monospace',color:'var(--green)',fontWeight:700}}>{(l.totalCost||0).toLocaleString()}</td>
                        <td>
                          <div style={{display:'flex',gap:4}}>
                            <button className="btn btn-ghost btn-sm" onClick={()=>openEdit(l)}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={()=>handleDelete(l)}>Del</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Month Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowDeleteModal(false)}>
          <div className="modal" style={{maxWidth:420}}>
            <div className="modal-header"><div className="modal-title" style={{color:'var(--red)'}}>Delete by Month</div><X onClick={()=>setShowDeleteModal(false)}/></div>
            <div className="modal-body">
              <label className="form-label">Select Month *</label>
              <select className="form-input" style={{appearance:'auto',marginBottom:12}} value={deleteMonth} onChange={e=>setDeleteMonth(e.target.value)}>
                <option value="">— Select a month —</option>
                {MONTHS.map(m => {
                  const idx = MONTHS.indexOf(m)+1
                  const count = logs.filter(l=>l.date&&new Date(l.date).getMonth()+1===idx).length
                  return <option key={m} value={m}>{m} {count>0?`(${count} records)`:'(no records)'}</option>
                })}
              </select>
              {deleteMonth && (()=>{
                const idx = MONTHS.indexOf(deleteMonth)+1
                const count = logs.filter(l=>l.date&&new Date(l.date).getMonth()+1===idx).length
                return <div style={{fontSize:11,color:'#dc2626',marginBottom:12,fontWeight:600}}>Will permanently delete {count} record{count!==1?'s':''} for {deleteMonth}</div>
              })()}
              <div style={{background:'#fff5f5',border:'1px solid #fca5a5',borderRadius:10,padding:'12px 14px',fontSize:13,color:'#dc2626'}}>This action cannot be undone.</div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setShowDeleteModal(false)}>Cancel</button>
              <button className="btn" style={{background:'var(--red)',color:'#fff',opacity:deleteMonth?1:0.5}} onClick={handleDeleteMonth} disabled={!deleteMonth||deleting}>
                {deleting ? 'Deleting...' : 'Delete All'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowImportModal(false)}>
          <div className="modal" style={{maxWidth:440}}>
            <div className="modal-header">
              <div>
                <div className="modal-title" style={{color: pendingFuelType==='PETROL' ? '#1e40af' : '#92400e'}}>
                  Import {pendingFuelType === 'PETROL' ? 'Petrol (Super)' : 'Diesel'} Tally Excel
                </div>
                <div style={{fontSize:12,color:'var(--text2)',marginTop:3}}>
                  File must be: {pendingFuelType==='PETROL' ? 'Fuel-Petrol (Super)' : 'Fuel-Diesel'} sheet
                </div>
              </div>
              <X onClick={()=>setShowImportModal(false)}/>
            </div>
            <div className="modal-body">
              <div style={{marginBottom:16}}>
                <label className="form-label">Select Month *</label>
                <select className="form-input" style={{appearance:'auto'}} value={selectedMonth} onChange={e=>setSelectedMonth(e.target.value)}>
                  <option value="">— Select a month —</option>
                  {MONTHS.map(m=><option key={m} value={m}>{m}</option>)}
                </select>
                {selectedMonth && <div style={{fontSize:11,color:'var(--blue)',marginTop:6,fontWeight:600}}>Only {selectedMonth} records will be imported</div>}
              </div>
              <div style={{
                background: pendingFuelType==='PETROL' ? '#eff6ff' : '#fffbeb',
                border: `1px solid ${pendingFuelType==='PETROL' ? '#93c5fd' : '#fcd34d'}`,
                borderRadius:10,padding:'12px 14px',fontSize:13,lineHeight:1.7
              }}>
                <strong>Tally format expected:</strong><br/>
                DATE | Particulars (Plate) | Vch Type | Vch No. | Quantity | Value
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setShowImportModal(false)}>Cancel</button>
              <label className="btn btn-blue" style={{cursor:selectedMonth?'pointer':'not-allowed',opacity:selectedMonth?1:0.5,position:'relative'}}>
                Choose File & Import
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  style={{position:'absolute',inset:0,opacity:0,cursor:selectedMonth?'pointer':'not-allowed'}}
                  disabled={!selectedMonth||importing}
                  onChange={e => {
                    if(!selectedMonth) return
                    const ft = pendingFuelType  // capture NOW before any state change
                    setShowImportModal(false)
                    handleImportExcel(e, ft)
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowAdd(false)}>
          <div className="modal" style={{maxWidth:500}}>
            <div className="modal-header">
              <div className="modal-title">{editing ? 'Edit Fuel Log' : 'Log Fuel Fill'}</div>
              <X onClick={()=>{ setShowAdd(false); setEditing(null) }}/>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Fleet Vehicle *</label>
                <select className="form-input" style={{appearance:'auto'}} value={form.fleetVehicleId}
                  onChange={e=>{
                    const vid = e.target.value
                    const veh = fleet.find(v=>String(v.id)===String(vid))
                    const dept = veh?.companyDepartment && veh.companyDepartment!=='--Please Select--' ? veh.companyDepartment : ''
                    setForm(f=>({...f, fleetVehicleId:vid, filledBy:dept}))
                  }}>
                  {fleet.map(v=>(
                    <option key={v.id} value={v.id}>
                      {v.plate} — {v.make} {v.model}
                      {v.companyDepartment && v.companyDepartment!=='--Please Select--' ? ` (${v.companyDepartment})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row" style={{marginBottom:14}}>
                <div>
                  <label className="form-label">Fuel Type *</label>
                  <select className="form-input" style={{appearance:'auto'}} value={form.fuelType} onChange={e=>sf('fuelType',e.target.value)}>
                    <option value="DIESEL">Diesel</option>
                    <option value="PETROL">Petrol (Super)</option>
                  </select>
                </div>
                <div><label className="form-label">Date *</label><input className="form-input" type="date" value={form.date} onChange={e=>sf('date',e.target.value)}/></div>
              </div>
              <div className="form-row" style={{marginBottom:14}}>
                <div><label className="form-label">Quantity (Liters) *</label><input className="form-input" type="number" placeholder="175.5" value={form.liters} onChange={e=>sf('liters',e.target.value)}/></div>
                <div><label className="form-label">Value (RWF) *</label><input className="form-input" type="number" placeholder="333450" value={form.totalCost} onChange={e=>sf('totalCost',e.target.value)}/></div>
              </div>
              <div className="form-row">
                <div><label className="form-label">Vch No.</label><input className="form-input" placeholder="DIAOF/4301636" value={form.station} onChange={e=>sf('station',e.target.value)}/></div>
                <div><label className="form-label">Department</label><input className="form-input" placeholder="Auto-filled from vehicle" value={form.filledBy} onChange={e=>sf('filledBy',e.target.value)}/></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>{ setShowAdd(false); setEditing(null) }}>Cancel</button>
              <button className="btn btn-blue" onClick={handleSave}>{editing ? 'Save Changes' : 'Log Fill'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


//  INVENTORY 
function InventoryPage({ user }) {
  const [items, setItems] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('ALL')
  const canEdit=user.role==='manager'||user.role==='supervisor'
  const empty={name:'',category:'PART',description:'',quantity:0,minQuantity:5,unitPrice:0,unit:'pcs',supplier:'',location:''}
  const [form, setForm] = useState(empty)
  const sf=(k,v)=>setForm(f=>({...f,[k]:v}))
  useEffect(()=>{fetchItems()},[])
  const fetchItems=async()=>{try{const r=await api.get('/inventory');setItems(r.data)}catch(e){console.error(e)}}
  const handleSave=async()=>{
    if(!form.name){alert('Item name required');return}
    try{
      if(editing){await api.put(`/inventory/${editing.id}`,form);await logAudit(user,'EDIT','Inventory',`Edited item: ${form.name}`)}
      else{await api.post('/inventory',form);await logAudit(user,'ADD','Inventory',`Added item: ${form.name}`)}
      fetchItems();setShowAdd(false);setEditing(null);setForm(empty)
    }catch{alert('Failed to save item')}
  }
  const handleDelete=async(id)=>{
    if(!window.confirm('Delete this item?'))return
    try{const item=items.find(i=>i.id===id);await api.delete(`/inventory/${id}`);await logAudit(user,'DELETE','Inventory',`Deleted item: ${item?.name||id}`);fetchItems()}catch{alert('Failed to delete')}
  }
  const filtered=items.filter(i=>{const q=search.toLowerCase();return(catFilter==='ALL'||i.category===catFilter)&&(!q||i.name?.toLowerCase().includes(q)||i.supplier?.toLowerCase().includes(q))})
  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Inventory</div><div className="page-sub">Parts, tools and consumables</div></div>
        {canEdit&&<div className="page-actions"><button className="btn btn-success btn-sm" onClick={()=>{setForm(empty);setEditing(null);setShowAdd(true)}}>+ Add Item</button></div>}
      </div>
      <div className="page-content">
        <div className="stat-grid-4" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
          {[['Total',items.length,'var(--blue)'],['In Stock',items.filter(i=>i.status==='In_Stock').length,'var(--green)'],['Low Stock',items.filter(i=>i.status==='Low_Stock').length,'#f59e0b'],['Out of Stock',items.filter(i=>i.status==='Out_of_Stock').length,'var(--red)']].map(([l,v,c])=>(
            <div key={l} className="stat-card" style={{padding:'14px 16px'}}><div style={{fontSize:11,color:'var(--text2)',marginBottom:4,fontWeight:600}}>{l}</div><div style={{fontSize:22,fontWeight:800,color:c}}>{v}</div></div>
          ))}
        </div>
        <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap'}}>
          <input className="form-input" style={{flex:1,minWidth:160}} placeholder="Search items..." value={search} onChange={e=>setSearch(e.target.value)}/>
          <div className="tab-bar" style={{width:'auto'}}>
            {['ALL','PART','TOOL','CONSUMABLE'].map(c=>(
              <button key={c} className="tab-btn" onClick={()=>setCatFilter(c)} style={{background:catFilter===c?'var(--blue)':'transparent',color:catFilter===c?'#fff':'var(--text2)',padding:'7px 12px'}}>{c}</button>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Stock List</div><span style={{fontSize:12,color:'var(--text2)',fontWeight:600}}>{filtered.length} items</span></div>
          {filtered.length===0?<div style={{padding:48,textAlign:'center',color:'var(--text3)'}}>No items found</div>:(
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Item</th><th className="hide-mobile">Category</th><th>Qty</th><th className="hide-mobile">Unit Price</th><th>Status</th>{canEdit&&<th>Actions</th>}</tr></thead>
                <tbody>{filtered.map(item=>{const st=INV_STATUS[item.status]||INV_STATUS['In_Stock'];return(
                  <tr key={item.id}>
                    <td><div style={{fontWeight:600}}>{item.name}</div>{item.supplier&&<div style={{fontSize:11,color:'var(--text3)'}}>{item.supplier}</div>}</td>
                    <td className="hide-mobile"><span style={{fontSize:11,background:'var(--surface2)',color:'var(--text2)',borderRadius:6,padding:'3px 8px',fontWeight:600}}>{item.category}</span></td>
                    <td style={{fontFamily:'DM Mono,monospace',fontWeight:600,whiteSpace:'nowrap'}}>{item.quantity} {item.unit}</td>
                    <td className="hide-mobile" style={{fontFamily:'DM Mono,monospace',color:'var(--green)'}}>{(item.unitPrice||0).toLocaleString()} RWF</td>
                    <td><span style={{fontSize:11,fontWeight:700,borderRadius:20,padding:'3px 8px',background:st.bg,color:st.color,whiteSpace:'nowrap'}}>{item.status?.replace('_',' ')}</span></td>
                    {canEdit&&<td><div style={{display:'flex',gap:4}}>
                      <button className="btn btn-ghost btn-sm" onClick={()=>{setForm({...item});setEditing(item);setShowAdd(true)}}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={()=>handleDelete(item.id)}>Del</button>
                    </div></td>}
                  </tr>
                )})}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {showAdd&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowAdd(false)}>
          <div className="modal" style={{maxWidth:540}}>
            <div className="modal-header"><div className="modal-title">{editing?'Edit Item':'Add Inventory Item'}</div><X onClick={()=>{setShowAdd(false);setEditing(null)}}/></div>
            <div className="modal-body">
              <div className="form-row" style={{marginBottom:14}}>
                <div><label className="form-label">Item Name *</label><input className="form-input" value={form.name} onChange={e=>sf('name',e.target.value)} placeholder="Oil Filter"/></div>
                <div><label className="form-label">Category *</label>
                  <select className="form-input" style={{appearance:'auto'}} value={form.category} onChange={e=>sf('category',e.target.value)}>
                    <option value="PART">Part</option><option value="TOOL">Tool</option><option value="CONSUMABLE">Consumable</option>
                  </select>
                </div>
              </div>
              <div className="form-row" style={{marginBottom:14}}>
                <div><label className="form-label">Quantity *</label><input className="form-input" type="number" value={form.quantity} onChange={e=>sf('quantity',parseInt(e.target.value)||0)}/></div>
                <div><label className="form-label">Unit *</label>
                  <select className="form-input" style={{appearance:'auto'}} value={form.unit} onChange={e=>sf('unit',e.target.value)}>
                    {['pcs','liters','kg','meters','boxes','sets'].map(u=><option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row" style={{marginBottom:14}}>
                <div><label className="form-label">Min Qty</label><input className="form-input" type="number" value={form.minQuantity} onChange={e=>sf('minQuantity',parseInt(e.target.value)||0)}/></div>
                <div><label className="form-label">Price (RWF)</label><input className="form-input" type="number" value={form.unitPrice} onChange={e=>sf('unitPrice',parseInt(e.target.value)||0)}/></div>
              </div>
              <div className="form-row">
                <div><label className="form-label">Supplier</label><input className="form-input" value={form.supplier} onChange={e=>sf('supplier',e.target.value)} placeholder="Supplier name"/></div>
                <div><label className="form-label">Location</label><input className="form-input" value={form.location} onChange={e=>sf('location',e.target.value)} placeholder="Shelf A-3"/></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>{setShowAdd(false);setEditing(null)}}>Cancel</button>
              <button className="btn btn-success" onClick={handleSave}>{editing?'Save Changes':'Add Item'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

//  STAFF 
function StaffPage() {
  const [staff, setStaff] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null)
  const [addForm, setAddForm] = useState({name:'',email:'',password:'',role:'mechanic'})
  const [editForm, setEditForm] = useState({name:'',email:'',newPassword:'',role:'mechanic'})
  const [addError, setAddError] = useState('')
  const [editError, setEditError] = useState('')
  const [loading, setLoading] = useState(false)
  useEffect(()=>{fetchStaff()},[])
  const fetchStaff=async()=>{try{const r=await api.get('/auth/users');setStaff(r.data)}catch{setStaff([])}}
  const handleCreate=async()=>{
    if(!addForm.name||!addForm.email||!addForm.password){setAddError('All fields required');return}
    setLoading(true);setAddError('')
    try{await api.post('/auth/register',addForm);setAddForm({name:'',email:'',password:'',role:'mechanic'});setShowAddModal(false);fetchStaff()}
    catch{setAddError('Failed. Email may already exist.')}
    setLoading(false)
  }
  const openEdit=(s)=>{setEditingStaff(s);setEditForm({name:s.name,email:s.email,newPassword:'',role:s.role});setEditError('');setShowEditModal(true)}
  const handleEdit=async()=>{
    if(!editForm.name||!editForm.email){setEditError('Name and email required');return}
    setLoading(true);setEditError('')
    try{
      const payload={name:editForm.name,email:editForm.email,role:editForm.role}
      if(editForm.newPassword.trim())payload.password=editForm.newPassword.trim()
      await api.put(`/auth/users/${editingStaff.id}`,payload);setShowEditModal(false);fetchStaff()
    }catch{setEditError('Failed to update. Try again.')}
    setLoading(false)
  }
  const handleDelete=async(id)=>{if(!window.confirm('Remove this staff member?'))return;try{await api.delete(`/auth/users/${id}`);fetchStaff()}catch{alert('Failed')}}
  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Staff Management</div><div className="page-sub">Manage team accounts</div></div>
        <div className="page-actions"><button className="btn btn-success btn-sm" onClick={()=>setShowAddModal(true)}>+ Add Staff</button></div>
      </div>
      <div className="page-content">
        <div className="card">
          <div className="card-header"><div className="card-title">Team Members</div><span style={{fontSize:12,color:'var(--text2)',fontWeight:600}}>{staff.length} members</span></div>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Name</th><th className="hide-mobile">Email</th><th>Role</th><th>Actions</th></tr></thead>
              <tbody>{staff.map(s=>{const rc=ROLE_CONFIG[s.role];return(
                <tr key={s.id}>
                  <td style={{fontWeight:600}}>{s.name}</td>
                  <td className="hide-mobile" style={{color:'var(--text2)',fontFamily:'DM Mono,monospace',fontSize:13}}>{s.email}</td>
                  <td><span style={{display:'inline-flex',alignItems:'center',padding:'3px 10px',borderRadius:20,fontSize:12,fontWeight:700,background:rc?.bg,color:rc?.color}}>{rc?.label}</span></td>
                  <td><div style={{display:'flex',gap:4}}>
                    <button className="btn btn-ghost btn-sm" onClick={()=>openEdit(s)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={()=>handleDelete(s.id)}>Remove</button>
                  </div></td>
                </tr>
              )})}</tbody>
            </table>
          </div>
        </div>
      </div>
      {showAddModal&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowAddModal(false)}>
          <div className="modal">
            <div className="modal-header"><div className="modal-title">Add Staff Member</div><X onClick={()=>setShowAddModal(false)}/></div>
            <div className="modal-body">
              {addError&&<div className="error-msg">{addError}</div>}
              <div className="form-row" style={{marginBottom:14}}>
                <div><label className="form-label">Full Name</label><input className="form-input" value={addForm.name} onChange={e=>setAddForm(f=>({...f,name:e.target.value}))}/></div>
                <div><label className="form-label">Role</label>
                  <select className="form-input" style={{appearance:'auto'}} value={addForm.role} onChange={e=>setAddForm(f=>({...f,role:e.target.value}))}>
                    <option value="mechanic">Mechanic</option><option value="supervisor">Supervisor</option><option value="manager">Manager</option>
                  </select>
                </div>
              </div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={addForm.email} onChange={e=>setAddForm(f=>({...f,email:e.target.value}))}/></div>
              <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" value={addForm.password} onChange={e=>setAddForm(f=>({...f,password:e.target.value}))}/></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-success" onClick={handleCreate} disabled={loading}>{loading?'Creating...':'Create'}</button>
            </div>
          </div>
        </div>
      )}
      {showEditModal&&editingStaff&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowEditModal(false)}>
          <div className="modal">
            <div className="modal-header"><div className="modal-title">Edit Staff Member</div><X onClick={()=>setShowEditModal(false)}/></div>
            <div className="modal-body">
              {editError&&<div className="error-msg">{editError}</div>}
              <div style={{background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:10,padding:'12px 16px',marginBottom:20,display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:40,height:40,borderRadius:'50%',background:ROLE_CONFIG[editingStaff.role]?.color||'var(--blue)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:16,flexShrink:0}}>{editingStaff.name?.split(' ').map(n=>n[0]).join('')}</div>
                <div><div style={{fontSize:14,fontWeight:700}}>{editingStaff.name}</div><div style={{fontSize:12,color:'var(--text2)'}}>Editing account details</div></div>
              </div>
              <div className="form-row" style={{marginBottom:14}}>
                <div><label className="form-label">Full Name</label><input className="form-input" value={editForm.name} onChange={e=>setEditForm(f=>({...f,name:e.target.value}))}/></div>
                <div><label className="form-label">Role</label>
                  <select className="form-input" style={{appearance:'auto'}} value={editForm.role} onChange={e=>setEditForm(f=>({...f,role:e.target.value}))}>
                    <option value="mechanic">Mechanic</option><option value="supervisor">Supervisor</option><option value="manager">Manager</option>
                  </select>
                </div>
              </div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={editForm.email} onChange={e=>setEditForm(f=>({...f,email:e.target.value}))}/></div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input className="form-input" type="password" placeholder="Leave blank to keep current" value={editForm.newPassword} onChange={e=>setEditForm(f=>({...f,newPassword:e.target.value}))}/>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setShowEditModal(false)}>Cancel</button>
              <button className="btn btn-blue" onClick={handleEdit} disabled={loading}>{loading?'Saving...':'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

//  VEHICLE MODAL 
function VehicleModal({ vehicle, onSave, onClose }) {
  const empty={plate:'',make:'',model:'',year:new Date().getFullYear(),color:'',vin:'',type:'Sedan',ownerName:'',ownerPhone:'',ownerEmail:'',ownerCompany:'',status:'Ready',mileage:0,driverName:'',driverPhone:'',driverLicense:''}
  const [form, setForm] = useState(vehicle||empty)
  const [fleet, setFleet] = useState([])
  const [selectedFleetId, setSelectedFleetId] = useState('')
  const s=(k,v)=>setForm(f=>({...f,[k]:v}))
  useEffect(()=>{if(!vehicle)api.get('/fleet').then(r=>setFleet(Array.isArray(r.data)?r.data:r.data?.content||[])).catch(()=>{})},[])
  const handleFleetSelect=(id)=>{
    setSelectedFleetId(id);if(!id){setForm(empty);return}
    const fv=fleet.find(f=>String(f.id)===String(id))
    if(fv)setForm(f=>({...f,plate:fv.plate||'',make:fv.make||'',model:fv.model||'',year:fv.year||new Date().getFullYear(),color:fv.color||'',type:fv.type||'Sedan',mileage:fv.mileage||0,vin:fv.vin||'',driverName:fv.driverName||'',driverPhone:fv.driverPhone||'',driverLicense:fv.driverLicense||''}))
  }
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{maxWidth:560}}>
        <div className="modal-header"><div className="modal-title">{vehicle?'Edit Vehicle':'Register New Vehicle'}</div><X onClick={onClose}/></div>
        <div className="modal-body">
          {!vehicle&&fleet.length>0&&(
            <div className="form-group" style={{marginBottom:20}}>
              <label className="form-label" style={{color:'var(--blue)'}}>Pre-fill from Fleet Vehicle (optional)</label>
              <select className="form-input" style={{appearance:'auto'}} value={selectedFleetId} onChange={e=>handleFleetSelect(e.target.value)}>
                <option value="">— Type manually —</option>
                {fleet.map(v=><option key={v.id} value={v.id}>{v.plate} — {v.make} {v.model}</option>)}
              </select>
            </div>
          )}
          <div style={{fontSize:11,fontWeight:800,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:12,paddingBottom:8,borderBottom:'1px solid var(--border)'}}>Vehicle Details</div>
          <div className="form-row" style={{marginBottom:14}}>
            <div><label className="form-label">Plate *</label><input className="form-input" value={form.plate} onChange={e=>s('plate',e.target.value.toUpperCase())} placeholder="KCA 123A"/></div>
            <div><label className="form-label">Status *</label><select className="form-input" style={{appearance:'auto'}} value={form.status} onChange={e=>s('status',e.target.value)}>{['Ready','In_Service','Awaiting_Parts','Completed'].map(x=><option key={x}>{x}</option>)}</select></div>
          </div>
          <div className="form-row" style={{marginBottom:14}}>
            <div><label className="form-label">Make *</label><input className="form-input" value={form.make} onChange={e=>s('make',e.target.value)} placeholder="Toyota"/></div>
            <div><label className="form-label">Model *</label><input className="form-input" value={form.model} onChange={e=>s('model',e.target.value)} placeholder="Hilux"/></div>
          </div>
          <div className="form-row" style={{marginBottom:14}}>
            <div><label className="form-label">Year *</label><input className="form-input" type="number" value={form.year} onChange={e=>s('year',e.target.value)}/></div>
            <div><label className="form-label">Color *</label><input className="form-input" value={form.color} onChange={e=>s('color',e.target.value)} placeholder="White"/></div>
          </div>
          <div className="form-row" style={{marginBottom:14}}>
            <div><label className="form-label">Type *</label><select className="form-input" style={{appearance:'auto'}} value={form.type} onChange={e=>s('type',e.target.value)}>{['Sedan','SUV','Pickup Truck','Van','Minibus','Truck','Motorcycle'].map(t=><option key={t}>{t}</option>)}</select></div>
            <div><label className="form-label">Mileage (km) *</label><input className="form-input" type="number" value={form.mileage} onChange={e=>s('mileage',e.target.value)}/></div>
          </div>
          <div style={{fontSize:11,fontWeight:800,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.08em',margin:'18px 0 12px',paddingBottom:8,borderBottom:'1px solid var(--border)'}}>Driver Information</div>
          <div className="form-row">
            <div><label className="form-label">Driver Name *</label><input className="form-input" value={form.driverName} onChange={e=>s('driverName',e.target.value)}/></div>
            <div><label className="form-label">Driver Phone *</label><input className="form-input" value={form.driverPhone} onChange={e=>s('driverPhone',e.target.value)}/></div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-success" onClick={()=>{
            const missing=[]
            if(!form.plate)missing.push('Plate');if(!form.make)missing.push('Make');if(!form.model)missing.push('Model')
            if(!form.driverName)missing.push('Driver Name');if(!form.driverPhone)missing.push('Driver Phone')
            if(missing.length>0){alert('Required fields missing:\n• '+missing.join('\n• '));return}
            onSave(form)
          }}>{vehicle?'Save Changes':'Register Vehicle'}</button>
        </div>
      </div>
    </div>
  )
}

//  SERVICE MODAL 
function ServiceModal({ onSave, onClose, currentUser }) {
  const [form, setForm] = useState({date:new Date().toISOString().split('T')[0],type:'Oil Change',description:'',cost:'',mechanic:currentUser.name,parts:''})
  const s=(k,v)=>setForm(f=>({...f,[k]:v}))
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-header"><div className="modal-title">Log Service / Repair</div><X onClick={onClose}/></div>
        <div className="modal-body">
          <div className="form-row" style={{marginBottom:14}}>
            <div><label className="form-label">Service Type</label><select className="form-input" style={{appearance:'auto'}} value={form.type} onChange={e=>s('type',e.target.value)}>{['Oil Change','Brake Service','Engine Repair','Transmission','Tire Service','Electrical','Body Work','Engine Diagnostic','Suspension','Other'].map(t=><option key={t}>{t}</option>)}</select></div>
            <div><label className="form-label">Date</label><input className="form-input" type="date" value={form.date} onChange={e=>s('date',e.target.value)}/></div>
          </div>
          <div className="form-group"><label className="form-label">Description *</label><textarea className="form-input" rows={3} value={form.description} onChange={e=>s('description',e.target.value)} placeholder="Describe the work done..." style={{resize:'vertical'}}/></div>
          <div className="form-row" style={{marginBottom:14}}>
            <div><label className="form-label">Cost (RWF)</label><input className="form-input" type="number" value={form.cost} onChange={e=>s('cost',e.target.value)}/></div>
            <div><label className="form-label">Mechanic</label><input className="form-input" value={form.mechanic} onChange={e=>s('mechanic',e.target.value)}/></div>
          </div>
          <div className="form-group"><label className="form-label">Parts Used (comma separated)</label><input className="form-input" value={form.parts} onChange={e=>s('parts',e.target.value)} placeholder="Oil Filter, Brake Pads x2..."/></div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-blue" onClick={()=>{if(!form.description){alert('Description required');return}onSave({...form,cost:parseInt(form.cost)||0,parts:form.parts?form.parts.split(',').map(p=>p.trim()).filter(Boolean):[]})}}>Log Service</button>
        </div>
      </div>
    </div>
  )
}

//  FLEET MODAL 
function FleetModal({ vehicle, onSave, onClose }) {
  const empty={plate:'',make:'',model:'',cardNumber:'',year:new Date().getFullYear(),color:'',vin:'',type:'Sedan',mileage:0,driverName:'',driverPhone:'',driverLicense:'',insuranceCompany:'',insuranceNumber:'',insuranceExpiry:'',inspectionIssuedDate:'',inspectionExpiry:'',speedGovernorExpiry:'',driverLicenseExpiry:'',yellowCardExpiry:'',status:'Active'}
  const [form, setForm] = useState(vehicle||empty)
  const s=(k,v)=>setForm(f=>({...f,[k]:v}))
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{maxWidth:580}}>
        <div className="modal-header"><div className="modal-title">{vehicle?'Edit Fleet Vehicle':'Add Fleet Vehicle'}</div><X onClick={onClose}/></div>
        <div className="modal-body">
          <div style={{fontSize:11,fontWeight:800,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:12,paddingBottom:8,borderBottom:'1px solid var(--border)'}}>Vehicle Details</div>
          <div className="form-row" style={{marginBottom:14}}>
            <div><label className="form-label">Plate *</label><input className="form-input" value={form.plate} onChange={e=>s('plate',e.target.value.toUpperCase())} placeholder="RAA 001A"/></div>
            <div><label className="form-label">Status *</label><select className="form-input" style={{appearance:'auto'}} value={form.status} onChange={e=>s('status',e.target.value)}>{['Active','In_Maintenance','Out_of_Service'].map(x=><option key={x}>{x}</option>)}</select></div>
          </div>
          <div className="form-row" style={{marginBottom:14}}>
            <div><label className="form-label">Make *</label><input className="form-input" value={form.make} onChange={e=>s('make',e.target.value)}/></div>
            <div><label className="form-label">Model *</label><input className="form-input" value={form.model} onChange={e=>s('model',e.target.value)}/></div>
          </div>
          <div className="form-row" style={{marginBottom:14}}>
            <div><label className="form-label">Card Number *</label><input className="form-input" value={form.cardNumber} onChange={e=>s('cardNumber',e.target.value.toUpperCase())} style={{fontFamily:'DM Mono,monospace'}}/></div>
            <div><label className="form-label">Department *</label><select className="form-input" style={{appearance:'auto'}} value={form.companyDepartment} onChange={e=>s('companyDepartment',e.target.value)}>{['--Please Select--','Blue_Band','Colgate','OXI','Nestle','Indomie'].map(x=><option key={x}>{x}</option>)}</select></div>
          </div>
          <div className="form-row" style={{marginBottom:14}}>
            <div><label className="form-label">Year *</label><input className="form-input" type="number" value={form.year} onChange={e=>s('year',e.target.value)}/></div>
            <div><label className="form-label">Color *</label><input className="form-input" value={form.color} onChange={e=>s('color',e.target.value)}/></div>
          </div>
          <div className="form-row" style={{marginBottom:14}}>
            <div><label className="form-label">Type *</label><select className="form-input" style={{appearance:'auto'}} value={form.type} onChange={e=>s('type',e.target.value)}>{['Sedan','SUV','Pickup Truck','Van','Minibus','Truck','Motorcycle'].map(t=><option key={t}>{t}</option>)}</select></div>
            <div><label className="form-label">Mileage (km) *</label><input className="form-input" type="number" value={form.mileage} onChange={e=>s('mileage',e.target.value)}/></div>
          </div>
          <div style={{fontSize:11,fontWeight:800,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.08em',margin:'18px 0 12px',paddingBottom:8,borderBottom:'1px solid var(--border)'}}>Assigned Driver</div>
          <div className="form-row" style={{marginBottom:14}}>
            <div><label className="form-label">Driver Name *</label><input className="form-input" value={form.driverName} onChange={e=>s('driverName',e.target.value)}/></div>
            <div><label className="form-label">Driver Phone *</label><input className="form-input" value={form.driverPhone} onChange={e=>s('driverPhone',e.target.value)}/></div>
          </div>
          <div className="form-group"><label className="form-label">License ID *</label><input className="form-input" value={form.driverLicense} onChange={e=>s('driverLicense',e.target.value)}/></div>
          <div style={{fontSize:11,fontWeight:800,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.08em',margin:'18px 0 12px',paddingBottom:8,borderBottom:'1px solid var(--border)'}}>Insurance & Documents</div>
          <div className="form-row" style={{marginBottom:14}}>
            <div><label className="form-label">Insurance Company *</label><input className="form-input" value={form.insuranceCompany} onChange={e=>s('insuranceCompany',e.target.value)}/></div>
            <div><label className="form-label">Insurance Number *</label><input className="form-input" value={form.insuranceNumber} onChange={e=>s('insuranceNumber',e.target.value)}/></div>
          </div>
          {/* Documents with Issued + Expiry dates */}
          {[
            {label:'Insurance',      issuedKey:'insuranceIssuedDate',   expiryKey:'insuranceExpiry',      fileKey:'insuranceFile'},
            {label:'Inspection',     issuedKey:'inspectionIssuedDate',  expiryKey:'inspectionExpiry',     fileKey:'inspectionFile'},
            {label:'Speed Governor', issuedKey:'speedGovernorIssuedDate',expiryKey:'speedGovernorExpiry', fileKey:'speedGovernorFile'},
          ].map(doc=>(
            <div key={doc.label} style={{marginBottom:16,padding:'12px 14px',background:'var(--surface2)',borderRadius:10,border:'1px solid var(--border)'}}>
              <div style={{fontSize:11,fontWeight:800,color:'var(--blue)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:10}}>{doc.label}</div>
              <div className="form-row" style={{marginBottom:10}}>
                <div><label className="form-label">Issued Date</label><input className="form-input" type="date" value={form[doc.issuedKey]||''} onChange={e=>s(doc.issuedKey,e.target.value)}/></div>
                <div><label className="form-label">Expiry Date *</label><input className="form-input" type="date" value={form[doc.expiryKey]||''} onChange={e=>s(doc.expiryKey,e.target.value)}/></div>
              </div>
              <div>
                <label className="form-label">Document File (PDF / JPG / PNG)</label>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <label style={{
                    display:'inline-flex',alignItems:'center',gap:8,
                    padding:'9px 16px',
                    background: form[doc.fileKey] ? '#f0fdf4' : 'var(--blue)',
                    color: form[doc.fileKey] ? 'var(--green)' : '#fff',
                    border: form[doc.fileKey] ? '1px solid #86efac' : 'none',
                    borderRadius:8,cursor:'pointer',fontSize:13,fontWeight:700,
                    whiteSpace:'nowrap',flexShrink:0
                  }}>
                    {form[doc.fileKey] ? '✓ Uploaded' : '+ Upload File'}
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{display:'none'}}
                      onChange={e=>{
                        const file=e.target.files[0]; if(!file) return
                        const reader=new FileReader()
                        reader.onload=()=>{
                          s(doc.fileKey, reader.result)
                          s(doc.fileKey+'Name', file.name)
                        }
                        reader.readAsDataURL(file)
                      }}
                    />
                  </label>
                  {form[doc.fileKey] ? (
                    <div style={{display:'flex',alignItems:'center',gap:8,minWidth:0}}>
                      <span style={{fontSize:12,color:'var(--green)',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{form[doc.fileKey+'Name']||'document'}</span>
                      <button onClick={()=>{s(doc.fileKey,'');s(doc.fileKey+'Name','')}} style={{fontSize:12,color:'var(--red)',background:'none',border:'none',cursor:'pointer',fontWeight:700,flexShrink:0}}>✕</button>
                    </div>
                  ) : (
                    <span style={{fontSize:12,color:'var(--text3)'}}>No file chosen</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Driver License and Yellow Card — upload only, no dates */}
          {[
            {label:'Driver License', fileKey:'driverLicenseFile'},
            {label:'Yellow Card',    fileKey:'yellowCardFile'},
          ].map(doc=>(
            <div key={doc.label} style={{marginBottom:16,padding:'12px 14px',background:'var(--surface2)',borderRadius:10,border:'1px solid var(--border)'}}>
              <div style={{fontSize:11,fontWeight:800,color:'var(--blue)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:10}}>{doc.label}</div>
              <div>
                <label className="form-label">Document File (PDF / JPG / PNG)</label>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <label style={{
                    display:'inline-flex',alignItems:'center',gap:8,
                    padding:'9px 16px',
                    background: form[doc.fileKey] ? '#f0fdf4' : 'var(--blue)',
                    color: form[doc.fileKey] ? 'var(--green)' : '#fff',
                    border: form[doc.fileKey] ? '1px solid #86efac' : 'none',
                    borderRadius:8,cursor:'pointer',fontSize:13,fontWeight:700,
                    whiteSpace:'nowrap',flexShrink:0
                  }}>
                    {form[doc.fileKey] ? '✓ Uploaded' : '+ Upload File'}
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{display:'none'}}
                      onChange={e=>{
                        const file=e.target.files[0]; if(!file) return
                        const reader=new FileReader()
                        reader.onload=()=>{
                          s(doc.fileKey, reader.result)
                          s(doc.fileKey+'Name', file.name)
                        }
                        reader.readAsDataURL(file)
                      }}
                    />
                  </label>
                  {form[doc.fileKey] ? (
                    <div style={{display:'flex',alignItems:'center',gap:8,minWidth:0}}>
                      <span style={{fontSize:12,color:'var(--green)',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{form[doc.fileKey+'Name']||'document'}</span>
                      <button onClick={()=>{s(doc.fileKey,'');s(doc.fileKey+'Name','')}} style={{fontSize:12,color:'var(--red)',background:'none',border:'none',cursor:'pointer',fontWeight:700,flexShrink:0}}>✕</button>
                    </div>
                  ) : (
                    <span style={{fontSize:12,color:'var(--text3)'}}>No file chosen</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-blue" onClick={()=>{
            const missing=[]
            if(!form.plate)missing.push('Plate')
            if(!form.make)missing.push('Make')
            if(!form.model)missing.push('Model')
            if(!form.color)missing.push('Color')
            if(!form.mileage)missing.push('Mileage')
            if(!form.cardNumber)missing.push('Card Number')
            if(!form.companyDepartment||form.companyDepartment==='--Please Select--')missing.push('Department')
            if(!form.driverName)missing.push('Driver Name')
            if(!form.driverPhone)missing.push('Driver Phone')
            if(!form.driverLicense)missing.push('License ID')
            if(!form.insuranceCompany)missing.push('Insurance Company')
            if(!form.insuranceNumber)missing.push('Insurance Number')
            if(!form.insuranceExpiry)missing.push('Insurance Expiry')
            if(!form.inspectionExpiry)missing.push('Inspection Expiry')
            if(!form.speedGovernorExpiry)missing.push('Speed Governor Expiry')

            if(missing.length>0){alert('Required fields missing:\n• '+missing.join('\n• '));return}
            onSave(form)
          }}>{vehicle?'Save Changes':'Add Vehicle'}</button>
        </div>
      </div>
    </div>
  )
}

//  VEHICLE DETAIL 
function VehicleDetail({ vehicle, user, onBack, onUpdate }) {
  const [showService, setShowService] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [history, setHistory] = useState([])
  const ss=STATUS_STYLE[vehicle.status]||STATUS_STYLE['Ready']
  const canEdit=user.role==='manager'||user.role==='supervisor'
  const totalSpend=history.reduce((s,h)=>s+(h.cost||0),0)
  useEffect(()=>{api.get(`/vehicles/${vehicle.id}/history`).then(r=>setHistory(Array.isArray(r.data)?r.data:[]))},[vehicle.id])
  const addService=async(entry)=>{
    try{await api.post(`/vehicles/${vehicle.id}/history`,entry);const r=await api.get(`/vehicles/${vehicle.id}`);const h=await api.get(`/vehicles/${vehicle.id}/history`);onUpdate({...r.data,serviceHistory:h.data});setShowService(false)}
    catch{alert('Failed to log service')}
  }
  const saveEdit=async(data)=>{
    try{const r=await api.put(`/vehicles/${vehicle.id}`,data);await logAudit(user,'EDIT','Garage Vehicles',`Edited vehicle: ${data.plate}`);onUpdate(r.data);setShowEdit(false)}
    catch{alert('Failed to update')}
  }
  const deleteVehicle=async()=>{
    if(!window.confirm('Delete this vehicle?'))return
    try{await api.delete(`/vehicles/${vehicle.id}`);await logAudit(user,'DELETE','Garage Vehicles',`Deleted vehicle: ${vehicle.plate}`);onBack()}catch{alert('Failed to delete')}
  }
  return (
    <>
      <div className="page-header">
        <div>
          <button onClick={onBack} style={{background:'none',border:'none',color:'var(--text2)',cursor:'pointer',fontFamily:'Nunito,sans-serif',fontSize:14,marginBottom:10,padding:0,fontWeight:600}}>← Back to Vehicles</button>
          <div className="page-title">{vehicle.make} {vehicle.model}</div>
          <div style={{display:'flex',alignItems:'center',gap:10,marginTop:8,flexWrap:'wrap'}}>
            <span style={{fontFamily:'DM Mono,monospace',color:'var(--blue)',fontSize:15,fontWeight:700}}>{vehicle.plate}</span>
            <span style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:12,fontWeight:700,borderRadius:20,padding:'4px 10px',background:ss.bg,color:ss.color}}>
              <span style={{width:6,height:6,borderRadius:'50%',background:ss.dot,display:'inline-block'}}/>{vehicle.status?.replace('_',' ')}
            </span>
          </div>
        </div>
        <div className="page-actions">
          {canEdit&&<button className="btn btn-ghost btn-sm" onClick={()=>setShowEdit(true)}>Edit</button>}
          {canEdit&&<button className="btn btn-sm" style={{background:'var(--red)',color:'#fff',border:'none'}} onClick={deleteVehicle}>Delete</button>}
          <button className="btn btn-blue btn-sm" onClick={()=>setShowService(true)}>+ Log Service</button>
        </div>
      </div>
      <div className="page-content">
        <div className="stat-grid-4" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
          {[['Services',history.length,'All time'],['Spend',totalSpend.toLocaleString(),'RWF'],['Mileage',Number(vehicle.mileage||0).toLocaleString(),'km'],['Year',vehicle.year,vehicle.color]].map(([l,v,s])=>(
            <div key={l} className="card" style={{padding:'16px'}}>
              <div style={{fontSize:12,color:'var(--text2)',marginBottom:6,fontWeight:600}}>{l}</div>
              <div style={{fontSize:20,fontWeight:800,color:'var(--text)',lineHeight:1.2}}>{v}</div>
              <div style={{fontSize:11,color:'var(--text3)',marginTop:3}}>{s}</div>
            </div>
          ))}
        </div>
        <div style={{marginBottom:16}}>
          <div className="card">
            <div className="card-header"><div className="card-title">Vehicle Info</div></div>
            <div style={{padding:'0 20px'}}>
              {[['Make',vehicle.make],['Model',vehicle.model],['Year',vehicle.year],['Color',vehicle.color],['Type',vehicle.type],['Plate',vehicle.plate],['Mileage',`${Number(vehicle.mileage||0).toLocaleString()} km`]].map(([k,v])=>(
                <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid var(--border)'}}>
                  <span style={{fontSize:13,color:'var(--text2)',fontWeight:600}}>{k}</span><span style={{fontSize:13,fontWeight:600}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Service & Repair History</div><span style={{fontSize:12,color:'var(--text2)',fontWeight:600}}>{history.length} records</span></div>
          {history.length===0?<div style={{padding:48,textAlign:'center',color:'var(--text3)'}}>No service records yet</div>
            :[...history].reverse().map(h=>(
              <div key={h.id} style={{padding:'14px 20px',borderBottom:'1px solid var(--border)',display:'flex',gap:14}}>
                <div style={{width:34,height:34,borderRadius:'50%',background:'var(--surface2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,flexShrink:0}}></div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:2}}>{h.type}</div>
                  <div style={{fontSize:13,color:'var(--text2)',marginBottom:4}}>{h.description}</div>
                  {h.parts?.length>0&&<div style={{display:'flex',gap:4,flexWrap:'wrap'}}>{h.parts.map((p,i)=><span key={i} style={{fontSize:11,background:'var(--surface2)',color:'var(--text3)',borderRadius:4,padding:'2px 7px'}}>{p}</span>)}</div>}
                  <div style={{fontSize:11,color:'var(--text3)',marginTop:5}}>by {h.mechanic} · {h.date}</div>
                </div>
                <div style={{textAlign:'right',flexShrink:0}}>
                  <div style={{fontFamily:'DM Mono,monospace',fontSize:14,color:'var(--green)',fontWeight:700}}>{(h.cost||0).toLocaleString()} RWF</div>
                </div>
              </div>
            ))}
        </div>
      </div>
      {showService&&<ServiceModal currentUser={user} onSave={addService} onClose={()=>setShowService(false)}/>}
      {showEdit&&<VehicleModal vehicle={vehicle} onSave={saveEdit} onClose={()=>setShowEdit(false)}/>}
    </>
  )
}

//  VEHICLES PAGE 
function VehiclesPage({ user }) {
  const [tab, setTab] = useState('garage')
  const [vehicles, setVehicles] = useState([])
  const [fleet, setFleet] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [fleetSearch, setFleetSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [showAddFleet, setShowAddFleet] = useState(false)
  const [editFleet, setEditFleet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showInspModal, setShowInspModal] = useState(false)
  const [inspVehicle, setInspVehicle] = useState(null)
  const [inspForm, setInspForm] = useState({inspectionIssuedDate:'',inspectionExpiry:''})
  const [showInsuranceModal, setShowInsuranceModal] = useState(false)
  const [insuranceVehicle, setInsuranceVehicle] = useState(null)
  const [insuranceForm, setInsuranceForm] = useState({insuranceCompany:'',insuranceNumber:'',insuranceExpiry:''})
  const [showDriverModal, setShowDriverModal] = useState(false)
  const [driverVehicle, setDriverVehicle] = useState(null)
  const [driverForm, setDriverForm] = useState({driverName:'',driverPhone:'',driverLicense:''})
  const canAdd=user.role==='manager'||user.role==='supervisor'

  useEffect(()=>{fetchVehicles();fetchFleet()},[])
  const fetchVehicles=async()=>{try{const r=await api.get('/vehicles');setVehicles(Array.isArray(r.data)?r.data:r.data?.content||[])}catch{alert('Failed to load vehicles')}setLoading(false)}
  const fetchFleet=async()=>{try{const r=await api.get('/fleet');setFleet(Array.isArray(r.data)?r.data:r.data?.content||[])}catch(e){console.error(e)}}
  const addVehicle=async(data)=>{try{await api.post('/vehicles',data);await logAudit(user,'ADD','Garage Vehicles',`Registered vehicle: ${data.plate}`);fetchVehicles();setShowAdd(false)}catch{alert('Failed')}}
  const addFleetVehicle=async(data)=>{
    try{
      const normalizedNew=data.plate?.replace(/[\s\-]/g,'').toUpperCase()
      const duplicate=fleet.find(v=>{if(editFleet&&v.id===editFleet.id)return false;return v.plate?.replace(/[\s\-]/g,'').toUpperCase()===normalizedNew})
      if(duplicate){alert(`Plate "${data.plate}" already registered in fleet.`);return}
      if(editFleet){await api.put(`/fleet/${editFleet.id}`,data);await logAudit(user,'EDIT','Fleet Vehicles',`Edited fleet vehicle: ${data.plate}`)}
      else{await api.post('/fleet',data);await logAudit(user,'ADD','Fleet Vehicles',`Added fleet vehicle: ${data.plate}`)}
      fetchFleet();setShowAddFleet(false);setEditFleet(null)
    }catch{alert('Failed')}
  }
  const updateVehicle=(u)=>{setVehicles(p=>p.map(v=>v.id===u.id?u:v));setSelected(u)}

  const openInsuranceModal=(v)=>{setInsuranceVehicle(v);setInsuranceForm({insuranceCompany:v.insuranceCompany||'',insuranceNumber:v.insuranceNumber||'',insuranceExpiry:v.insuranceExpiry||''});setShowInsuranceModal(true)}
  const handleUpdateInsurance=async()=>{
    if(!insuranceVehicle||!insuranceForm.insuranceExpiry){alert('Insurance Expiry is required');return}
    try{await api.put(`/fleet/${insuranceVehicle.id}`,{...insuranceVehicle,...insuranceForm});await logAudit(user,'EDIT','Fleet Vehicles',`Updated insurance for: ${insuranceVehicle.plate}`);fetchFleet();setShowInsuranceModal(false);setInsuranceVehicle(null)}
    catch{alert('Failed to update insurance')}
  }
  const openInspModal=(v)=>{setInspVehicle(v);setInspForm({inspectionIssuedDate:v.inspectionIssuedDate||'',inspectionExpiry:v.inspectionExpiry||''});setShowInspModal(true)}
  const openDriverModal=(v)=>{setDriverVehicle(v);setDriverForm({driverName:v.driverName||'',driverPhone:v.driverPhone||'',driverLicense:v.driverLicense||''});setShowDriverModal(true)}
  const handleUpdateDriver=async()=>{
    if(!driverVehicle||!driverForm.driverName||!driverForm.driverPhone){alert('Driver Name and Phone are required');return}
    try{
      await api.put(`/fleet/${driverVehicle.id}`,{...driverVehicle,...driverForm})
      await logAudit(user,'EDIT','Fleet Vehicles',`Updated driver for: ${driverVehicle.plate} → ${driverForm.driverName}`)
      fetchFleet();setShowDriverModal(false);setDriverVehicle(null)
    }catch{alert('Failed to update driver')}
  }
  const handleUpdateInspection=async()=>{
    if(!inspVehicle)return
    try{await api.put(`/fleet/${inspVehicle.id}`,{...inspVehicle,...inspForm});await logAudit(user,'EDIT','Fleet Vehicles',`Updated inspection for: ${inspVehicle.plate}`);fetchFleet();setShowInspModal(false);setInspVehicle(null)}
    catch{alert('Failed to update inspection')}
  }

  const filtered=(vehicles||[]).filter(v=>{const q=search.toLowerCase();return(filter==='All'||v.status===filter)&&(!q||v.plate?.toLowerCase().includes(q)||v.make?.toLowerCase().includes(q)||v.model?.toLowerCase().includes(q)||v.ownerName?.toLowerCase().includes(q))})
  const renderFleetTab = () => {
    const fq = fleetSearch.toLowerCase()
    const filteredFleetList = fleet.filter(v =>
      !fq ||
      v.plate?.toLowerCase().includes(fq) ||
      v.driverName?.toLowerCase().includes(fq) ||
      v.make?.toLowerCase().includes(fq) ||
      v.model?.toLowerCase().includes(fq)
    )
    return (
      <>
        <div style={{marginBottom:16}}>
          <input
            className="form-input"
            placeholder="Search by plate number or driver name..."
            value={fleetSearch}
            onChange={e=>setFleetSearch(e.target.value)}
            style={{maxWidth:420}}
          />
        </div>
        {filteredFleetList.length===0 ? (
          <div className="card" style={{padding:48,textAlign:'center',color:'var(--text3)'}}>
            {fleetSearch ? `No vehicles matching "${fleetSearch}"` : 'No fleet vehicles yet'}
          </div>
        ) : (
          <div className="card">
            <div className="card-header">
              <div className="card-title">Fleet Vehicles</div>
              <span style={{fontSize:12,color:'var(--text2)',fontWeight:600}}>
                {filteredFleetList.length}{fleetSearch && fleet.length !== filteredFleetList.length ? ` of ${fleet.length}` : ''} vehicles
              </span>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Plate</th>
                    <th>Make / Model</th>
                    <th className="hide-mobile">Year</th>
                    <th className="hide-mobile">Type</th>
                    <th>Status</th>
                    <th>Driver</th>
                    <th className="hide-mobile">Phone</th>
                    <th className="hide-mobile">Mileage</th>
                    <th className="hide-mobile">Ins. Expiry</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFleetList.map(v => {
                    const ss = FLEET_STATUS[v.status] || FLEET_STATUS['Active']
                    const insExpired = v.insuranceExpiry && new Date(v.insuranceExpiry) < new Date()
                    return (
                      <tr key={v.id}>
                        <td style={{fontFamily:'DM Mono,monospace',color:'var(--blue)',fontWeight:700,whiteSpace:'nowrap'}}>{v.plate}</td>
                        <td><div style={{fontWeight:700,fontSize:13}}>{v.make} {v.model}</div></td>
                        <td className="hide-mobile" style={{color:'var(--text2)'}}>{v.year}</td>
                        <td className="hide-mobile"><span style={{fontSize:11,background:'var(--surface2)',color:'var(--text2)',borderRadius:6,padding:'2px 8px',fontWeight:600}}>{v.type}</span></td>
                        <td><span style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:11,fontWeight:700,borderRadius:20,padding:'3px 9px',background:ss.bg,color:ss.color,whiteSpace:'nowrap'}}><span style={{width:5,height:5,borderRadius:'50%',background:ss.dot,display:'inline-block'}}/>{v.status?.replace('_',' ')}</span></td>
                        <td style={{fontWeight:600,fontSize:13}}>{v.driverName||'—'}</td>
                        <td className="hide-mobile" style={{color:'var(--text2)',fontSize:13}}>{v.driverPhone||'—'}</td>
                        <td className="hide-mobile" style={{fontFamily:'DM Mono,monospace',fontSize:13}}>{v.mileage ? `${Number(v.mileage).toLocaleString()} km` : '—'}</td>
                        <td className="hide-mobile" style={{color:insExpired?'var(--red)':'var(--text2)',fontWeight:insExpired?700:400,fontSize:13}}>{v.insuranceExpiry||'—'}</td>
                        <td>
                          <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                            <button className="btn btn-ghost btn-sm" style={{color:'var(--blue)',borderColor:'var(--blue)'}} onClick={e=>{e.stopPropagation();openInsuranceModal(v)}}>Insurance</button>
                            <button className="btn btn-ghost btn-sm" style={{color:'var(--green)',borderColor:'var(--green)'}} onClick={e=>{e.stopPropagation();openInspModal(v)}}>Inspection</button>
                            <button className="btn btn-ghost btn-sm" style={{color:'#7c3aed',borderColor:'#7c3aed'}} onClick={e=>{e.stopPropagation();openDriverModal(v)}}>Driver</button>
                            <button className="btn btn-ghost btn-sm" onClick={e=>{e.stopPropagation();setEditFleet(v);setShowAddFleet(true)}}>Edit</button>
                            {user.role==='manager' && (
                              <button className="btn btn-danger btn-sm" onClick={async e=>{
                                e.stopPropagation()
                                if(!window.confirm('Delete this fleet vehicle?')) return
                                try { await api.delete(`/fleet/${v.id}`); await logAudit(user,'DELETE','Fleet Vehicles',`Deleted fleet vehicle: ${v.plate}`); fetchFleet() }
                                catch { alert('Failed to delete') }
                              }}>Del</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>
    )
  }

  if(selected)return <VehicleDetail vehicle={selected} user={user} onBack={()=>setSelected(null)} onUpdate={updateVehicle}/>

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Vehicles</div><div className="page-sub">{tab==='garage'?`${vehicles.length} garage vehicles`:`${fleet.length} fleet vehicles`}</div></div>
        <div className="page-actions">
          {tab==='garage'&&<button className="btn btn-success btn-sm" onClick={()=>setShowAdd(true)}>+ Register</button>}
          {canAdd&&tab==='fleet'&&<button className="btn btn-blue btn-sm" onClick={()=>{setEditFleet(null);setShowAddFleet(true)}}>+ Add Fleet</button>}
        </div>
      </div>
      <div className="page-content">
        <div className="tab-bar" style={{marginBottom:16,width:'fit-content'}}>
          {[['garage','Garage'],['fleet','Fleet']].map(([key,label])=>(
            <button key={key} className="tab-btn" onClick={()=>setTab(key)} style={{background:tab===key?'var(--blue)':'transparent',color:tab===key?'#fff':'var(--text2)'}}>{label}</button>
          ))}
        </div>

        {tab==='garage'&&(
          <>
            <div className="stat-grid-4" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:16}}>
              {Object.entries(STATUS_STYLE).map(([status,ss])=>(
                <div key={status} className="card" style={{padding:'12px 14px',cursor:'pointer',borderColor:filter===status?ss.dot:undefined}} onClick={()=>setFilter(filter===status?'All':status)}>
                  <div style={{fontSize:11,color:'var(--text2)',marginBottom:4,fontWeight:600}}>{status.replace('_',' ')}</div>
                  <div style={{fontSize:22,fontWeight:800,color:ss.dot}}>{vehicles.filter(v=>v.status===status).length}</div>
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap'}}>
              <input className="form-input" style={{flex:1,minWidth:160}} placeholder="Search plate, make, owner..." value={search} onChange={e=>setSearch(e.target.value)}/>
              <select className="form-input" style={{width:150,appearance:'auto'}} value={filter} onChange={e=>setFilter(e.target.value)}>
                <option value="All">All Status</option>{Object.keys(STATUS_STYLE).map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            {loading?<div style={{textAlign:'center',padding:48,color:'var(--text3)'}}>Loading...</div>:
              filtered.length===0?<div className="card" style={{padding:48,textAlign:'center',color:'var(--text3)'}}>No vehicles found</div>:(
              <div className="card">
                <div className="card-header">
                  <div className="card-title">Garage Vehicles</div>
                  <span style={{fontSize:12,color:'var(--text2)',fontWeight:600}}>{filtered.length} vehicles</span>
                </div>
                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Plate</th>
                        <th>Make / Model</th>
                        <th className="hide-mobile">Year</th>
                        <th className="hide-mobile">Type</th>
                        <th className="hide-mobile">Color</th>
                        <th>Status</th>
                        <th className="hide-mobile">Services</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(v=>{
                        const ss=STATUS_STYLE[v.status]||STATUS_STYLE['Ready']
                        return(
                          <tr key={v.id} style={{cursor:'pointer'}} onClick={()=>setSelected(v)}>
                            <td style={{fontFamily:'DM Mono,monospace',color:'var(--blue)',fontWeight:700,whiteSpace:'nowrap'}}>{v.plate}</td>
                            <td><div style={{fontWeight:700,fontSize:13}}>{v.make} {v.model}</div></td>
                            <td className="hide-mobile" style={{color:'var(--text2)'}}>{v.year}</td>
                            <td className="hide-mobile"><span style={{fontSize:11,background:'var(--surface2)',color:'var(--text2)',borderRadius:6,padding:'2px 8px',fontWeight:600}}>{v.type}</span></td>
                            <td className="hide-mobile" style={{color:'var(--text2)'}}>{v.color}</td>
                            <td><span style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:11,fontWeight:700,borderRadius:20,padding:'3px 9px',background:ss.bg,color:ss.color,whiteSpace:'nowrap'}}><span style={{width:5,height:5,borderRadius:'50%',background:ss.dot,display:'inline-block'}}/>{v.status?.replace('_',' ')}</span></td>
                            <td className="hide-mobile" style={{color:'var(--text2)',fontSize:13}}>{(v.serviceHistory||[]).length}</td>
                            <td onClick={e=>e.stopPropagation()}>
                              <button className="btn btn-ghost btn-sm" onClick={()=>setSelected(v)}>View</button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {tab==='fleet'&&renderFleetTab()}
      </div>

      {showAdd&&<VehicleModal onSave={addVehicle} onClose={()=>setShowAdd(false)}/>}
      {showAddFleet&&<FleetModal vehicle={editFleet} onSave={addFleetVehicle} onClose={()=>{setShowAddFleet(false);setEditFleet(null)}}/>}

      {showInspModal&&inspVehicle&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowInspModal(false)}>
          <div className="modal" style={{maxWidth:420}}>
            <div className="modal-header">
              <div><div className="modal-title">Update Inspection</div><div style={{fontSize:12,color:'var(--text2)',marginTop:2}}>{inspVehicle.plate} — {inspVehicle.make} {inspVehicle.model}</div></div>
              <X onClick={()=>setShowInspModal(false)}/>
            </div>
            <div className="modal-body">
              <div style={{background:'#f0fdf4',border:'1px solid #86efac',borderRadius:10,padding:'12px 14px',marginBottom:16,fontSize:13,color:'#166534'}}>Update inspection dates after the vehicle has been inspected.</div>
              <div className="form-group"><label className="form-label">Current Inspection Expiry</label><div style={{fontSize:13,fontWeight:700,color:inspVehicle.inspectionExpiry&&new Date(inspVehicle.inspectionExpiry)<new Date()?'var(--red)':'var(--text2)',padding:'8px 0'}}>{inspVehicle.inspectionExpiry||'Not set'}</div></div>
              <div className="form-row" style={{marginBottom:14}}>
                <div><label className="form-label">Issued Date</label><input className="form-input" type="date" value={inspForm.inspectionIssuedDate} onChange={e=>setInspForm(f=>({...f,inspectionIssuedDate:e.target.value}))}/></div>
                <div><label className="form-label">New Expiry Date *</label><input className="form-input" type="date" value={inspForm.inspectionExpiry} onChange={e=>setInspForm(f=>({...f,inspectionExpiry:e.target.value}))}/></div>
              </div>
              <div className="form-group">
                <label className="form-label">Upload Inspection Document (PDF / JPG / PNG)</label>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <label style={{display:'inline-flex',alignItems:'center',gap:8,padding:'9px 16px',background:inspForm.inspectionFile?'#f0fdf4':'var(--blue)',color:inspForm.inspectionFile?'var(--green)':'#fff',border:inspForm.inspectionFile?'1px solid #86efac':'none',borderRadius:8,cursor:'pointer',fontSize:13,fontWeight:700,whiteSpace:'nowrap',flexShrink:0}}>
                    {inspForm.inspectionFile?'✓ Uploaded':'+ Upload File'}
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{display:'none'}}
                      onChange={e=>{
                        const file=e.target.files[0]; if(!file) return
                        const reader=new FileReader()
                        reader.onload=()=>setInspForm(f=>({...f,inspectionFile:reader.result,inspectionFileName:file.name}))
                        reader.readAsDataURL(file)
                      }}
                    />
                  </label>
                  {inspForm.inspectionFile?(
                    <div style={{display:'flex',alignItems:'center',gap:8,minWidth:0}}>
                      <span style={{fontSize:12,color:'var(--green)',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{inspForm.inspectionFileName||'document'}</span>
                      <button onClick={()=>setInspForm(f=>({...f,inspectionFile:'',inspectionFileName:''}))} style={{fontSize:12,color:'var(--red)',background:'none',border:'none',cursor:'pointer',fontWeight:700,flexShrink:0}}>✕</button>
                    </div>
                  ):(
                    <span style={{fontSize:12,color:'var(--text3)'}}>No file chosen</span>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setShowInspModal(false)}>Cancel</button>
              <button className="btn btn-success" onClick={handleUpdateInspection} disabled={!inspForm.inspectionExpiry}>Save Inspection</button>
            </div>
          </div>
        </div>
      )}

      {showInsuranceModal&&insuranceVehicle&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowInsuranceModal(false)}>
          <div className="modal" style={{maxWidth:420}}>
            <div className="modal-header">
              <div><div className="modal-title">Update Insurance</div><div style={{fontSize:12,color:'var(--text2)',marginTop:2}}>{insuranceVehicle.plate} — {insuranceVehicle.make} {insuranceVehicle.model}</div></div>
              <X onClick={()=>setShowInsuranceModal(false)}/>
            </div>
            <div className="modal-body">
              <div style={{background:'#eff6ff',border:'1px solid #93c5fd',borderRadius:10,padding:'12px 14px',marginBottom:16,fontSize:13,color:'#1e40af'}}>Update insurance details after renewal.</div>
              <div className="form-group"><label className="form-label">Current Expiry</label><div style={{fontSize:13,fontWeight:700,color:insuranceVehicle.insuranceExpiry&&new Date(insuranceVehicle.insuranceExpiry)<new Date()?'var(--red)':'var(--text2)',padding:'8px 0'}}>{insuranceVehicle.insuranceExpiry||'Not set'}</div></div>
              <div className="form-group"><label className="form-label">Insurance Company</label><input className="form-input" value={insuranceForm.insuranceCompany} onChange={e=>setInsuranceForm(f=>({...f,insuranceCompany:e.target.value}))} placeholder="e.g. SONARWA"/></div>
              <div className="form-group"><label className="form-label">Insurance Number</label><input className="form-input" value={insuranceForm.insuranceNumber} onChange={e=>setInsuranceForm(f=>({...f,insuranceNumber:e.target.value}))} placeholder="e.g. INS-2026-001"/></div>
              <div className="form-row" style={{marginBottom:14}}>
                <div><label className="form-label">Issued Date</label><input className="form-input" type="date" value={insuranceForm.insuranceIssuedDate||''} onChange={e=>setInsuranceForm(f=>({...f,insuranceIssuedDate:e.target.value}))}/></div>
                <div><label className="form-label">New Expiry Date *</label><input className="form-input" type="date" value={insuranceForm.insuranceExpiry} onChange={e=>setInsuranceForm(f=>({...f,insuranceExpiry:e.target.value}))}/></div>
              </div>
              <div className="form-group">
                <label className="form-label">Upload Insurance Document (PDF / JPG / PNG)</label>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <label style={{display:'inline-flex',alignItems:'center',gap:8,padding:'9px 16px',background:insuranceForm.insuranceFile?'#f0fdf4':'var(--blue)',color:insuranceForm.insuranceFile?'var(--green)':'#fff',border:insuranceForm.insuranceFile?'1px solid #86efac':'none',borderRadius:8,cursor:'pointer',fontSize:13,fontWeight:700,whiteSpace:'nowrap',flexShrink:0}}>
                    {insuranceForm.insuranceFile?'✓ Uploaded':'+ Upload File'}
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{display:'none'}}
                      onChange={e=>{
                        const file=e.target.files[0]; if(!file) return
                        const reader=new FileReader()
                        reader.onload=()=>setInsuranceForm(f=>({...f,insuranceFile:reader.result,insuranceFileName:file.name}))
                        reader.readAsDataURL(file)
                      }}
                    />
                  </label>
                  {insuranceForm.insuranceFile?(
                    <div style={{display:'flex',alignItems:'center',gap:8,minWidth:0}}>
                      <span style={{fontSize:12,color:'var(--green)',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{insuranceForm.insuranceFileName||'document'}</span>
                      <button onClick={()=>setInsuranceForm(f=>({...f,insuranceFile:'',insuranceFileName:''}))} style={{fontSize:12,color:'var(--red)',background:'none',border:'none',cursor:'pointer',fontWeight:700,flexShrink:0}}>✕</button>
                    </div>
                  ):(
                    <span style={{fontSize:12,color:'var(--text3)'}}>No file chosen</span>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setShowInsuranceModal(false)}>Cancel</button>
              <button className="btn btn-blue" onClick={handleUpdateInsurance} disabled={!insuranceForm.insuranceExpiry}>Save Insurance</button>
            </div>
          </div>
        </div>
      )}
      {/* Update Driver Modal */}
      {showDriverModal&&driverVehicle&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowDriverModal(false)}>
          <div className="modal" style={{maxWidth:420}}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Update Driver</div>
                <div style={{fontSize:12,color:'var(--text2)',marginTop:2}}>{driverVehicle.plate} — {driverVehicle.make} {driverVehicle.model}</div>
              </div>
              <X onClick={()=>setShowDriverModal(false)}/>
            </div>
            <div className="modal-body">
              <div style={{background:'#f5f3ff',border:'1px solid #c4b5fd',borderRadius:10,padding:'12px 14px',marginBottom:16,fontSize:13,color:'#6d28d9'}}>
                Assign a new driver to this vehicle.
              </div>
              <div className="form-group">
                <label className="form-label">Current Driver</label>
                <div style={{fontSize:13,fontWeight:700,color:'var(--text2)',padding:'8px 0'}}>{driverVehicle.driverName||'Not assigned'} {driverVehicle.driverPhone?`— ${driverVehicle.driverPhone}`:''}</div>
              </div>
              <div className="form-group"><label className="form-label">New Driver Name *</label><input className="form-input" value={driverForm.driverName} onChange={e=>setDriverForm(f=>({...f,driverName:e.target.value}))} placeholder="Full name"/></div>
              <div className="form-group"><label className="form-label">Driver Phone *</label><input className="form-input" value={driverForm.driverPhone} onChange={e=>setDriverForm(f=>({...f,driverPhone:e.target.value}))} placeholder="+250 788 000 000"/></div>
              <div className="form-group"><label className="form-label">License ID</label><input className="form-input" value={driverForm.driverLicense} onChange={e=>setDriverForm(f=>({...f,driverLicense:e.target.value}))} placeholder="License number"/></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setShowDriverModal(false)}>Cancel</button>
              <button className="btn" style={{background:'#7c3aed',color:'#fff'}} onClick={handleUpdateDriver} disabled={!driverForm.driverName||!driverForm.driverPhone}>Save Driver</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

//  APP 
export default function App() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [alertCount, setAlertCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(()=>{
    const s=localStorage.getItem('user')
    if(s){const u=JSON.parse(s);setUser(u);if(u.role!=='manager')setActiveTab('alerts')}
  },[])
  const handleLogin=(u)=>{setUser(u);setActiveTab(u.role==='manager'?'dashboard':'alerts')}
  const handleLogout=()=>{localStorage.removeItem('token');localStorage.removeItem('user');setUser(null);setActiveTab('dashboard')}
  const handleTabChange=(tab)=>{setActiveTab(tab);setMenuOpen(false)}
  return (
    <>
      <style>{styles}</style>
      {!user?<LoginPage onLogin={handleLogin}/>:(
        <div className="app">
          <Sidebar user={user} activeTab={activeTab} setActiveTab={handleTabChange} onLogout={handleLogout} alertCount={alertCount} menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
          <div className="main">
            {activeTab==='dashboard'&&user.role==='manager'&&<DashboardPage onAlertsChange={setAlertCount}/>}
            {activeTab==='alerts'&&(user.role==='supervisor'||user.role==='mechanic')&&<AlertsDashboard onAlertsChange={setAlertCount}/>}
            {activeTab==='vehicles'&&<VehiclesPage user={user}/>}
            {activeTab==='fuel'&&<FuelLogsPage user={user}/>}
            {activeTab==='inventory'&&<InventoryPage user={user}/>}
            {activeTab==='staff'&&user.role==='manager'&&<StaffPage/>}
            {activeTab==='expenses'&&(user.role==='manager'||user.role==='supervisor')&&<ExpensesPage user={user}/>}
            {activeTab==='audit'&&user.role==='manager'&&<AuditLogPage/>}
            {activeTab==='reports'&&user.role==='manager'&&<ReportsPage/>}
          </div>
        </div>
      )}
    </>
  )
}