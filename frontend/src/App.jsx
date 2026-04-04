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
  .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
  .login-card { position: relative; width: 440px; background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 48px; animation: slideUp 0.5s ease; box-shadow: 0 8px 40px rgba(0,0,0,0.15); }
  @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
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
  .app { display: flex; min-height: 100vh; }
  .main { flex: 1; overflow-y: auto; background: var(--bg); min-width: 0; }
  .sidebar { width: var(--sidebar-w); background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; flex-shrink: 0; position: sticky; top: 0; height: 100vh; overflow-y: auto; box-shadow: 2px 0 8px rgba(0,0,0,0.04); z-index: 200; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; font-size: 14px; color: var(--text2); cursor: pointer; transition: all 0.15s; font-weight: 600; border: none; background: none; width: 100%; text-align: left; font-family: 'Nunito', sans-serif; }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: rgba(37,99,235,0.08); color: var(--blue); }
  .page-header { padding: 28px 32px 0; display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; gap: 16px; }
  .page-title { font-family: 'Nunito', 'Calibri Light', Calibri, sans-serif; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; color: var(--text); }
  .page-sub { color: var(--text2); font-size: 14px; margin-top: 4px; font-weight: 500; }
  .page-content { padding: 0 32px 32px; }
  .page-actions { display: flex; gap: 10px; flex-wrap: wrap; flex-shrink: 0; }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
  .card-header { padding: 18px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
  .card-title { font-family: 'Nunito', 'Calibri Light', Calibri, sans-serif; font-size: 15px; font-weight: 800; color: var(--text); }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 18px; border-radius: 8px; font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; border: none; transition: all 0.2s; white-space: nowrap; }
  .btn-success { background: var(--green); color: #fff; } .btn-success:hover { background: #047857; }
  .btn-blue { background: var(--blue); color: #fff; } .btn-blue:hover { background: #1d4ed8; }
  .btn-ghost { background: transparent; color: var(--text2); border: 1px solid var(--border); } .btn-ghost:hover { background: var(--surface2); color: var(--text); }
  .btn-danger { background: rgba(220,38,38,0.07); color: var(--red); border: 1px solid rgba(220,38,38,0.15); }
  .btn-sm { padding: 6px 12px; font-size: 12px; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 300; padding: 20px; backdrop-filter: blur(2px); }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; width: 100%; max-width: 480px; animation: slideUp 0.2s ease; box-shadow: 0 8px 40px rgba(0,0,0,0.12); max-height: 90vh; display: flex; flex-direction: column; }
  .modal-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
  .modal-title { font-family: 'Nunito', 'Calibri Light', Calibri, sans-serif; font-size: 18px; font-weight: 800; color: var(--text); }
  .modal-body { padding: 24px; overflow-y: auto; flex: 1; }
  .modal-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; gap: 10px; justify-content: flex-end; background: var(--surface2); border-radius: 0 0 16px 16px; flex-shrink: 0; flex-wrap: wrap; }
  .table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .table { width: 100%; border-collapse: collapse; min-width: 500px; }
  .table th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 800; color: var(--text3); text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid var(--border); background: var(--surface2); font-family: 'Nunito', sans-serif; white-space: nowrap; }
  .table td { padding: 14px 16px; font-size: 14px; border-bottom: 1px solid var(--border); color: var(--text); font-family: 'Nunito', sans-serif; }
  .table tr:last-child td { border: none; }
  .table tr:hover td { background: var(--surface2); }
  .tab-bar { display: flex; gap: 4px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 4px; flex-wrap: wrap; }
  .tab-btn { display: flex; align-items: center; gap: 8px; padding: 8px 18px; border-radius: 8px; border: none; font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
  .mobile-topbar { display: none; }
  .desktop-logo { display: flex; }
  .sidebar-overlay { display: none; }
  @media (max-width: 768px) {
    .app { flex-direction: column; }
    .main { margin-top: 56px; }
    .sidebar { position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 56px; overflow: hidden; flex-direction: column; border-right: none; border-bottom: 1px solid var(--border); box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: height 0.3s ease; }
    .sidebar.open { height: 100vh; overflow-y: auto; }
    .sidebar-overlay { display: block; position: fixed; inset: 0; top: 56px; background: rgba(0,0,0,0.35); z-index: 199; }
    .mobile-topbar { display: flex; }
    .desktop-logo { display: none !important; }
    .page-header { padding: 16px 16px 0; flex-wrap: wrap; }
    .page-content { padding: 0 16px 80px; }
    .page-title { font-size: 20px; }
    .page-actions { width: 100%; }
    .form-row { grid-template-columns: 1fr; gap: 12px; }
    .form-input { font-size: 16px; }
    .modal-overlay { padding: 0; align-items: flex-end; }
    .modal { max-width: 100%; border-radius: 20px 20px 0 0; max-height: 92vh; }
    .hide-mobile { display: none !important; }
  }
`

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
const ROLE_CONFIG = {
  manager: { color: '#2563eb', bg: 'rgba(37,99,235,0.1)', label: 'Manager' },
  supervisor: { color: '#7c3aed', bg: 'rgba(124,58,237,0.1)', label: 'Supervisor' },
  mechanic: { color: '#059669', bg: 'rgba(5,150,105,0.1)', label: 'Mechanic' },
  viewer: { color: '#0891b2', bg: 'rgba(8,145,178,0.1)', label: 'Viewer' },
}

const X = ({ onClick }) => (
  <button onClick={onClick} style={{ background:'none', border:'none', color:'var(--text2)', fontSize:22, cursor:'pointer', lineHeight:1, padding:'0 4px', flexShrink:0 }}>×</button>
)

const PAGES = ['Vehicles','Fuel Logs','Expenses','Inventory','Alerts']
const ACTIONS = ['view','add','edit','delete']
const defaultPerms = () => {
  const p = {}
  PAGES.forEach(pg => { p[pg] = {view:false,add:false,edit:false,delete:false} })
  return p
}
const parsePerms = (permStr) => {
  try { return permStr ? JSON.parse(permStr) : defaultPerms() } catch { return defaultPerms() }
}
const hasPerm = (user, page, action) => {
  if(!user) return false
  if(user.role === 'manager') return true
  const perms = parsePerms(user.permissions)
  return perms[page]?.[action] === true
}

const onlyLetters = (e) => { if(!/^[a-zA-Z\s]$/.test(e.key) && !['Backspace','Delete','ArrowLeft','ArrowRight','Tab'].includes(e.key)) e.preventDefault() }
const onlyNumbers = (e) => { if(!/^[0-9]$/.test(e.key) && !['Backspace','Delete','ArrowLeft','ArrowRight','Tab','.'].includes(e.key)) e.preventDefault() }
const onlyPlate = (e) => { if(!/^[a-zA-Z0-9]$/.test(e.key) && !['Backspace','Delete','ArrowLeft','ArrowRight','Tab',' '].includes(e.key)) e.preventDefault() }


const logAudit = async (user, action, module, details) => {
  try {
    await fetch('https://garage-eri-production.up.railway.app/api/audit', {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${localStorage.getItem('token')}`},
      body:JSON.stringify({ userName:user?.name||'Unknown', userRole:user?.role||'unknown', action, moduleName:module, details, timestamp:new Date().toISOString() })
    })
  } catch(e) { console.error('Audit log failed:',e) }
}

const viewFile = (base64, name='document') => {
  if(!base64) return
  const win = window.open('', '_blank')
  if(base64.startsWith('data:image')) {
    win.document.write(`<img src="${base64}" style="max-width:100%;height:auto;" title="${name}"/>`)
  } else {
    win.document.write(`<iframe src="${base64}" style="width:100%;height:100vh;border:none;" title="${name}"></iframe>`)
  }
  win.document.title = name
}

const compressFile = (file, maxSizeKB=800) => new Promise((resolve) => {
  if(file.type === 'application/pdf'){
    const reader = new FileReader()
    reader.onload = () => resolve({ data: reader.result, name: file.name, size: file.size })
    reader.readAsDataURL(file)
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      let w = img.width, h = img.height
      const MAX = 1200
      if(w > MAX || h > MAX){ const r = Math.min(MAX/w, MAX/h); w = Math.round(w*r); h = Math.round(h*r) }
      const canvas = document.createElement('canvas')
      canvas.width = w; canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      let quality = 0.75
      let data = canvas.toDataURL('image/jpeg', quality)
      while(data.length > maxSizeKB * 1024 * 1.37 && quality > 0.3){
        quality -= 0.1
        data = canvas.toDataURL('image/jpeg', quality)
      }
      resolve({ data, name: file.name.replace(/\.[^.]+$/, '.jpg'), size: Math.round(data.length * 0.75) })
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
})

function getDaysUntil(dateStr) {
  if (!dateStr) return null
  return Math.ceil((new Date(dateStr) - new Date()) / (1000*60*60*24))
}
function getExpiryAlerts(fleet, warningDays=7) {
  const alerts = []
  fleet.forEach(v => {
    const docs = [
      { key:'ins',  type:'Insurance',      expiry: v.insuranceExpiry },
      { key:'insp', type:'Inspection',     expiry: v.inspectionExpiry },
      { key:'spd',  type:'Speed Governor', expiry: v.speedGovernorExpiry },
      { key:'lic',  type:'Driver License', expiry: v.driverLicenseExpiry },
    ]
    docs.forEach(doc => {
      const days = getDaysUntil(doc.expiry)
      if(days !== null && days <= warningDays)
        alerts.push({ id:`${doc.key}-${v.id}`, plate:v.plate, type:doc.type, expiry:doc.expiry, days, expired:days<0, vehicle:v })
    })
  })
  return alerts
}


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
      <div style={{ position:'relative', zIndex:2, display:'flex', alignItems:'center', justifyContent:'center', width:'100%', maxWidth:1200, padding:'16px' }}>
        <div className="login-card" style={{ background:'rgba(255,255,255,0.5)', backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)', border:'1px solid rgba(255,255,255,0.5)', width:320, padding:28, maxWidth:'calc(100vw - 32px)' }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:22 }}>
            <div style={{ width:60, height:60, borderRadius:14, overflow:'hidden', marginBottom:12 }}>
              <img src="/canvas.png" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            </div>
            <div style={{ fontFamily:'Nunito,sans-serif', fontSize:17, fontWeight:800, color:'var(--text)', textAlign:'center' }}>
              ERI-RWANDA<br/><span style={{ color:'var(--blue)', fontSize:13 }}>Fleet Management System</span>
            </div>
          </div>
          {error && <div className="error-msg">{error}</div>}
          <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="you@garage.com" value={email} onChange={e=>{setEmail(e.target.value);setError('')}}/></div>
          <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e=>{setPassword(e.target.value);setError('')}} onKeyDown={e=>e.key==='Enter'&&handleLogin()}/></div>
          <button className="btn-primary" onClick={handleLogin} disabled={loading}>{loading?'Signing in...':'Sign In'}</button>
        </div>
      </div>
    </div>
  )
}


function Sidebar({ user, activeTab, setActiveTab, onLogout, alertCount, menuOpen, setMenuOpen }) {
  const rc = ROLE_CONFIG[user.role]
  const initials = user.name.split(' ').map(n=>n[0]).join('')
  const N = (key, label, badge) => (
    <button key={key} className={`nav-item ${activeTab===key?'active':''}`} onClick={()=>setActiveTab(key)}>
      <span style={{flex:1}}>{label}</span>
      {badge>0&&<span style={{background:'#dc2626',color:'#fff',borderRadius:20,fontSize:10,fontWeight:800,padding:'2px 7px'}}>{badge}</span>}
    </button>
  )
  return (
    <>
      <div className={`sidebar${menuOpen?' open':''}`}>
        <div className="mobile-topbar" style={{alignItems:'center',justifyContent:'space-between',padding:'0 16px',height:56,flexShrink:0,width:'100%',borderBottom:menuOpen?'1px solid var(--border)':'none'}}>
          <button onClick={()=>setMenuOpen(o=>!o)} style={{background:'none',border:'none',cursor:'pointer',fontSize:26,color:'var(--text2)',padding:4,lineHeight:1}}>
            {menuOpen ? '✕' : '☰'}
          </button>
          <div style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer'}} onClick={()=>{setActiveTab(user.role==='manager'?'dashboard':'alerts');setMenuOpen(false)}}>
            <div style={{fontFamily:'Nunito,sans-serif',fontSize:14,fontWeight:800,color:'var(--text)'}}>ERI-RWANDA</div>
            <div style={{width:34,height:34,borderRadius:10,overflow:'hidden',border:'1px solid var(--border)',flexShrink:0}}>
              <img src="/canvas.png" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
            </div>
          </div>
        </div>
        <div className="desktop-logo" style={{padding:'24px 16px 20px',borderBottom:'1px solid var(--border)',flexDirection:'column',alignItems:'center',gap:12,background:'#fff',cursor:'pointer'}} onClick={()=>setActiveTab(user.role==='manager'?'dashboard':'alerts')}>
          <div style={{width:80,height:80,borderRadius:18,overflow:'hidden',border:'2px solid var(--border)',flexShrink:0}}>
            <img src="/canvas.png" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
          </div>
          <div style={{textAlign:'center'}}>
            <div style={{fontFamily:'Nunito,sans-serif',fontSize:15,fontWeight:800,color:'var(--text)'}}>ERI-RWANDA</div>
            <div style={{fontSize:11,fontWeight:600,color:'var(--text2)'}}>Fleet Management</div>
          </div>
        </div>
        <nav style={{flex:1,padding:'16px 10px',display:'flex',flexDirection:'column',gap:2}}>
          <div style={{padding:'8px 12px 6px',fontSize:10,fontWeight:800,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.1em'}}>Main</div>
          {user.role==='manager'&&N('dashboard','Dashboard',alertCount)}
          {(user.role==='manager'||hasPerm(user,'Alerts','view'))&&N('alerts','Alerts',alertCount)}
          {(user.role==='manager'||hasPerm(user,'Vehicles','view'))&&N('vehicles','Vehicles')}
          {(user.role==='manager'||hasPerm(user,'Fuel Logs','view'))&&N('fuel','Fuel Logs')}
          {(user.role==='manager'||hasPerm(user,'Inventory','view'))&&N('inventory','Inventory')}
          {user.role==='manager'&&N('staff','Staff')}
          {(user.role==='manager'||hasPerm(user,'Expenses','view'))&&N('expenses','Expenses')}
          {user.role==='manager'&&N('audit','Audit Log')}
          {user.role==='manager'&&N('reports','Reports')}
        </nav>
        <div style={{padding:16,borderTop:'1px solid var(--border)'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,padding:10,background:'var(--surface2)',borderRadius:10,marginBottom:10}}>
            <div style={{width:34,height:34,borderRadius:'50%',background:rc.color,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Nunito,sans-serif',fontWeight:800,fontSize:13,color:'#fff',flexShrink:0}}>{initials}</div>
            <div style={{minWidth:0}}>
              <div style={{fontSize:13,fontWeight:700,color:'var(--text)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{user.name}</div>
              <div style={{fontSize:11,color:'var(--text2)'}}>{rc.label}</div>
            </div>
          </div>
          <button onClick={onLogout} style={{width:'100%',background:'transparent',border:'1px solid var(--border)',color:'var(--text2)',borderRadius:8,padding:10,fontSize:13,cursor:'pointer',fontFamily:'Nunito,sans-serif',fontWeight:600}}>Sign Out</button>
        </div>
      </div>
      {menuOpen&&<div className="sidebar-overlay" onClick={()=>setMenuOpen(false)}/>}
    </>
  )
}


function AlertsDashboard({ onAlertsChange, onNavigate, onEditVehicle }) {
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
  const AlertRow = ({a,i,total,bg,borderColor}) => (
    <div key={a.id} onClick={()=>onEditVehicle&&onEditVehicle(a.vehicle)}
      style={{padding:'14px 16px',borderBottom:i<total-1?`1px solid ${borderColor}`:'none',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,background:bg,flexWrap:'wrap',cursor:'pointer'}}
      onMouseEnter={e=>e.currentTarget.style.filter='brightness(0.97)'}
      onMouseLeave={e=>e.currentTarget.style.filter=''}>
      <div style={{display:'flex',alignItems:'center',gap:12,minWidth:0}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:2,flexWrap:'wrap'}}>
            <span style={{fontFamily:'DM Mono,monospace',fontSize:14,fontWeight:800,color:'var(--blue)'}}>{a.plate}</span>
            <span style={{fontSize:11,fontWeight:700,background:'var(--surface2)',color:'var(--text2)',borderRadius:6,padding:'2px 7px'}}>{a.type}</span>
          </div>
          <div style={{fontSize:12,color:'var(--text3)'}}>{a.expired?'Expired on':'Expires on'}: <strong>{a.expiry}</strong></div>
        </div>
      </div>
      <span style={{fontSize:12,fontWeight:800,borderRadius:20,padding:'5px 12px',background:a.expired?'#fee2e2':a.days===0?'#fee2e2':'#fef3c7',color:a.expired?'#dc2626':a.days===0?'#dc2626':'#92400e',flexShrink:0}}>
        {a.expired?`Expired ${Math.abs(a.days)}d ago`:a.days===0?'TODAY':`${a.days}d left`}
      </span>
    </div>
  )
  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Alerts</div><div className="page-sub">Click any alert to view the vehicle</div></div>
        {alerts.length>0&&<span style={{background:'#fee2e2',color:'#dc2626',borderRadius:20,fontSize:13,fontWeight:800,padding:'6px 14px',border:'1px solid #fca5a5',flexShrink:0}}>{alerts.length} alert{alerts.length>1?'s':''}</span>}
      </div>
      <div className="page-content">
        {alerts.length===0?(
          <div className="card" style={{padding:64,textAlign:'center'}}>
            <div style={{fontSize:18,fontWeight:800,marginBottom:8}}>All documents are valid</div>
            <div style={{fontSize:14,color:'var(--text2)'}}>No expiries within 7 days</div>
          </div>
        ):(
          <>
            {expired.length>0&&(
              <div style={{marginBottom:20}}>
                <div style={{fontSize:12,fontWeight:800,color:'#dc2626',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:10}}>Already Expired ({expired.length})</div>
                <div className="card" style={{borderColor:'#fca5a5'}}>
                  {expired.map((a,i)=><AlertRow key={a.id} a={a} i={i} total={expired.length} bg="#fff5f5" borderColor="#fee2e2"/>)}
                </div>
              </div>
            )}
            {upcoming.length>0&&(
              <div>
                <div style={{fontSize:12,fontWeight:800,color:'#92400e',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:10}}>Expiring Soon ({upcoming.length})</div>
                <div className="card" style={{borderColor:'#fcd34d'}}>
                  {upcoming.map((a,i)=><AlertRow key={a.id} a={a} i={i} total={upcoming.length} bg="#fffbeb" borderColor="#fef3c7"/>)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}


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
  const [search, setSearch] = useState('')
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const empty = {date:'',plate:'',receivedBy:'',reason:'',amount:''}
  const [form, setForm] = useState(empty)
  const sf = (k,v) => setForm(f=>({...f,[k]:v}))
  useEffect(()=>{fetchExpenses()},[])
  const fetchExpenses = async () => {
    try{const r=await api.get('/expenses');setExpenses(Array.isArray(r.data)?r.data:[])}catch(e){console.error(e)}
  }
  const handleSave = async () => {
    if(!form.date||!form.reason||!form.amount){alert('Date, Reason and Amount are required');return}
    try{
      if(editing){
        await api.put(`/expenses/${editing.id}`,{...form,assignment:form.receivedBy,amount:parseInt(form.amount)||0})
        await logAudit(user,'EDIT','Expenses',`Edited expense: ${form.reason}`)
      } else {
        await api.post('/expenses',{...form,assignment:form.receivedBy,amount:parseInt(form.amount)||0})
        await logAudit(user,'ADD','Expenses',`Added expense: ${form.reason}`)
      }
      fetchExpenses();setShowAdd(false);setEditing(null);setForm(empty)
    }catch{alert('Failed to save expense')}
  }
  const openEdit = (exp) => {
    setEditing(exp)
    setForm({date:exp.date||'',plate:exp.plate||'',receivedBy:exp.assignment||exp.receivedBy||'',reason:exp.reason||'',amount:exp.amount||''})
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
      const sheetName=wb.SheetNames.find(s=>s.toUpperCase()===selectedMonth.toUpperCase())||wb.SheetNames[0]
      const ws=wb.Sheets[sheetName]
      const rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:''})
      let success=0,failed=0,skipped=0,errors=[]
      const selectedMonthIndex=MONTHS.indexOf(selectedMonth)+1
      const SKIP_KEYS=['date','recharge','garage','january','february','march','april','may','june','july','august','september','october','november','december','balance']
      for(const row of rows){
        const rawDate=row[0];const plate=String(row[1]||'').trim();const reason=String(row[2]||'').trim()
        const amount=(parseFloat(row[3])||0)>0?parseFloat(row[3]):(parseFloat(row[6])||0)
        const receivedBy=String(row[4]||'').trim()
        if(!rawDate||!reason){skipped++;continue}
        if(SKIP_KEYS.some(k=>String(rawDate).toLowerCase().includes(k)||reason.toLowerCase()===k)){skipped++;continue}
        if(!(rawDate instanceof Date)){skipped++;continue}
        if(!amount||amount<=0){skipped++;continue}
        const y=rawDate.getFullYear();const mo=String(rawDate.getMonth()+1).padStart(2,'0');const dy=String(rawDate.getDate()).padStart(2,'0')
        const dateStr=`${y}-${mo}-${dy}`
        if(rawDate.getMonth()+1!==selectedMonthIndex){skipped++;continue}
        try{await api.post('/expenses',{date:dateStr,plate,assignment:receivedBy,reason,amount:Math.round(amount)});success++}
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
    const searchMatch=!q||e.plate?.toLowerCase().includes(q)||e.reason?.toLowerCase().includes(q)||(e.assignment||e.receivedBy)?.toLowerCase().includes(q)
    return monthMatch&&searchMatch
  })
  const totalAmount=filtered.reduce((s,e)=>s+(e.amount||0),0)
  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Garage Expenses</div><div className="page-sub">Daily expense records</div></div>
        <div className="page-actions">
          {user?.role==='manager'&&<button className="btn btn-danger btn-sm" onClick={()=>{setShowDeleteModal(true);setDeleteMonth('')}}>Delete Month</button>}
          {(user?.role==='manager'||hasPerm(user,'Expenses','add'))&&<button className="btn btn-ghost btn-sm" onClick={()=>{setShowImportModal(true);setImportResult(null)}} disabled={importing}>{importing?'Importing...':'Import Excel'}</button>}
          {(user?.role==='manager'||hasPerm(user,'Expenses','add'))&&<button className="btn btn-success btn-sm" onClick={()=>{setForm(empty);setEditing(null);setShowAdd(true)}}>+ Add</button>}
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
            <button onClick={()=>setImportResult(null)} style={{background:'none',border:'none',cursor:'pointer',fontSize:18,color:'#9096ab'}}>×</button>
          </div>
        )}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
          <div className="stat-card"><div style={{fontSize:11,color:'var(--text2)',marginBottom:4,fontWeight:600}}>Total Amount</div><div style={{fontSize:22,fontWeight:800,color:'var(--red)'}}>{totalAmount.toLocaleString()}</div><div style={{fontSize:10,color:'var(--text3)'}}>RWF</div></div>
          <div className="stat-card"><div style={{fontSize:11,color:'var(--text2)',marginBottom:4,fontWeight:600}}>Records</div><div style={{fontSize:22,fontWeight:800,color:'var(--blue)'}}>{filtered.length}</div><div style={{fontSize:10,color:'var(--text3)'}}>entries</div></div>
        </div>
        <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap'}}>
          <input className="form-input" style={{flex:1,minWidth:160}} placeholder="Search plate, reason, received by..." value={search} onChange={e=>setSearch(e.target.value)}/>
          <select className="form-input" style={{width:160,appearance:'auto'}} value={filterMonth} onChange={e=>setFilterMonth(e.target.value)}>
            <option value="ALL">All Months</option>{MONTHS.map(m=><option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Expense Records</div><span style={{fontFamily:'DM Mono,monospace',fontSize:13,color:'var(--red)',fontWeight:700}}>{totalAmount.toLocaleString()} RWF</span></div>
          {filtered.length===0?<div style={{padding:48,textAlign:'center',color:'var(--text3)'}}>No records found</div>:(
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Date</th><th>Plate</th><th>Reason</th><th>Received By</th><th>Amount (RWF)</th><th>Actions</th></tr></thead>
                <tbody>{filtered.map(e=>(
                  <tr key={e.id}>
                    <td style={{color:'var(--text2)',whiteSpace:'nowrap'}}>{e.date}</td>
                    <td style={{fontFamily:'DM Mono,monospace',color:'var(--blue)',fontWeight:700}}>{e.plate||'—'}</td>
                    <td style={{fontWeight:600}}>{e.reason}</td>
                    <td style={{color:'var(--text2)'}}>{e.assignment||e.receivedBy||'—'}</td>
                    <td style={{fontFamily:'DM Mono,monospace',fontWeight:700,color:'var(--red)',whiteSpace:'nowrap'}}>{(e.amount||0).toLocaleString()}</td>
                    <td><div style={{display:'flex',gap:4}}>
                      {(user?.role==='manager'||hasPerm(user,'Expenses','edit'))&&<button className="btn btn-ghost btn-sm" onClick={()=>openEdit(e)}>Edit</button>}
                      {(user?.role==='manager'||hasPerm(user,'Expenses','delete'))&&<button className="btn btn-danger btn-sm" onClick={()=>handleDelete(e.id)}>Del</button>}
                    </div></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {showAdd&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowAdd(false)}>
          <div className="modal" style={{maxWidth:460}}>
            <div className="modal-header"><div className="modal-title">{editing?'Edit Expense':'Add Expense'}</div><X onClick={()=>{setShowAdd(false);setEditing(null)}}/></div>
            <div className="modal-body">
              <div className="form-row" style={{marginBottom:14}}>
                <div><label className="form-label">Date *</label><input className="form-input" type="date" value={form.date} onChange={e=>sf('date',e.target.value)}/></div>
                <div><label className="form-label">Plate</label><input className="form-input" value={form.plate} onChange={e=>sf('plate',e.target.value.toUpperCase())} placeholder="RAG510W"/></div>
              </div>
              <div className="form-group"><label className="form-label">Reason *</label><input className="form-input" value={form.reason} onChange={e=>sf('reason',e.target.value)} placeholder="e.g. REPAIR TIRES"/></div>
              <div className="form-group"><label className="form-label">Received By</label><input className="form-input" value={form.receivedBy} onChange={e=>sf('receivedBy',e.target.value)} placeholder="Name"/></div>
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
                <label className="form-label">Select Month *</label>
                <select className="form-input" style={{appearance:'auto'}} value={selectedMonth} onChange={e=>setSelectedMonth(e.target.value)}>
                  <option value="">— Select a month —</option>
                  {MONTHS.map(m=><option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div style={{background:'var(--surface2)',borderRadius:10,padding:'12px 14px',fontSize:13,color:'var(--text2)'}}>
                <strong>Excel format:</strong> DATE | PLATE | REASON | AMOUNT | RECEIVED BY
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
              <label className="form-label">Select Month *</label>
              <select className="form-input" style={{appearance:'auto',marginBottom:12}} value={deleteMonth} onChange={e=>setDeleteMonth(e.target.value)}>
                <option value="">— Select a month —</option>
                {MONTHS.map(m=>{const idx=MONTHS.indexOf(m)+1;const count=expenses.filter(e=>e.date&&new Date(e.date).getMonth()+1===idx).length;return<option key={m} value={m}>{m} {count>0?`(${count} records)`:'(no records)'}</option>})}
              </select>
              <div style={{background:'#fff5f5',border:'1px solid #fca5a5',borderRadius:10,padding:'12px 14px',fontSize:13,color:'#dc2626'}}>This action cannot be undone.</div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setShowDeleteModal(false)}>Cancel</button>
              <button className="btn" style={{background:'var(--red)',color:'#fff',opacity:deleteMonth?1:0.5}} onClick={handleDeleteMonth} disabled={!deleteMonth||deleting}>{deleting?'Deleting...':'Delete All'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


function InventoryPage({ user }) {
  const [items, setItems] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('ALL')
  const canAdd = user.role==='manager' || hasPerm(user,'Inventory','add')
  const canEdit = user.role==='manager' || hasPerm(user,'Inventory','edit')
  const canDelete = user.role==='manager' || hasPerm(user,'Inventory','delete')
  const empty={name:'',category:'PART',description:'',quantity:0,minQuantity:5,unitPrice:0,unit:'pcs',supplier:'',location:''}
  const [form, setForm] = useState(empty)
  const sf=(k,v)=>setForm(f=>({...f,[k]:v}))
  useEffect(()=>{fetchItems()},[])
  const fetchItems=async()=>{try{const r=await api.get('/inventory');setItems(r.data)}catch(e){console.error(e)}}
  const handleSave=async()=>{
    if(!form.name){alert('Item name required');return}
    try{
      if(editing){await api.put(`/inventory/${editing.id}`,form);await logAudit(user,'EDIT','Inventory',`Edited: ${form.name}`)}
      else{await api.post('/inventory',form);await logAudit(user,'ADD','Inventory',`Added: ${form.name}`)}
      fetchItems();setShowAdd(false);setEditing(null);setForm(empty)
    }catch{alert('Failed to save')}
  }
  const handleDelete=async(id)=>{
    if(!window.confirm('Delete this item?'))return
    try{const item=items.find(i=>i.id===id);await api.delete(`/inventory/${id}`);await logAudit(user,'DELETE','Inventory',`Deleted: ${item?.name||id}`);fetchItems()}catch{alert('Failed to delete')}
  }
  const filtered=items.filter(i=>{const q=search.toLowerCase();return(catFilter==='ALL'||i.category===catFilter)&&(!q||i.name?.toLowerCase().includes(q)||i.supplier?.toLowerCase().includes(q))})
  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Inventory</div><div className="page-sub">Parts, tools and consumables</div></div>
        {canAdd&&<div className="page-actions"><button className="btn btn-success btn-sm" onClick={()=>{setForm(empty);setEditing(null);setShowAdd(true)}}>+ Add Item</button></div>}
      </div>
      <div className="page-content">
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
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
                <thead><tr><th>Item</th><th className="hide-mobile">Category</th><th>Qty</th><th className="hide-mobile">Unit Price</th><th>Status</th>{(canEdit||canDelete)&&<th>Actions</th>}</tr></thead>
                <tbody>{filtered.map(item=>{const st=INV_STATUS[item.status]||INV_STATUS['In_Stock'];return(
                  <tr key={item.id}>
                    <td><div style={{fontWeight:600}}>{item.name}</div>{item.supplier&&<div style={{fontSize:11,color:'var(--text3)'}}>{item.supplier}</div>}</td>
                    <td className="hide-mobile"><span style={{fontSize:11,background:'var(--surface2)',color:'var(--text2)',borderRadius:6,padding:'3px 8px',fontWeight:600}}>{item.category}</span></td>
                    <td style={{fontFamily:'DM Mono,monospace',fontWeight:600}}>{item.quantity} {item.unit}</td>
                    <td className="hide-mobile" style={{fontFamily:'DM Mono,monospace',color:'var(--green)'}}>{(item.unitPrice||0).toLocaleString()} RWF</td>
                    <td><span style={{fontSize:11,fontWeight:700,borderRadius:20,padding:'3px 8px',background:st.bg,color:st.color}}>{item.status?.replace('_',' ')}</span></td>
                    {(canEdit||canDelete)&&<td><div style={{display:'flex',gap:4}}>
                      {canEdit&&<button className="btn btn-ghost btn-sm" onClick={()=>{setForm({...item});setEditing(item);setShowAdd(true)}}>Edit</button>}
                      {canDelete&&<button className="btn btn-danger btn-sm" onClick={()=>handleDelete(item.id)}>Del</button>}
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
            <div className="modal-header"><div className="modal-title">{editing?'Edit Item':'Add Item'}</div><X onClick={()=>{setShowAdd(false);setEditing(null)}}/></div>
            <div className="modal-body">
              <div className="form-row" style={{marginBottom:14}}>
                <div><label className="form-label">Name *</label><input className="form-input" value={form.name} onChange={e=>sf('name',e.target.value)} placeholder="Oil Filter"/></div>
                <div><label className="form-label">Category</label><select className="form-input" style={{appearance:'auto'}} value={form.category} onChange={e=>sf('category',e.target.value)}><option value="PART">Part</option><option value="TOOL">Tool</option><option value="CONSUMABLE">Consumable</option></select></div>
              </div>
              <div className="form-row" style={{marginBottom:14}}>
                <div><label className="form-label">Quantity</label><input className="form-input" type="number" value={form.quantity} onChange={e=>sf('quantity',parseInt(e.target.value)||0)}/></div>
                <div><label className="form-label">Unit</label><select className="form-input" style={{appearance:'auto'}} value={form.unit} onChange={e=>sf('unit',e.target.value)}>{['pcs','liters','kg','meters','boxes','sets'].map(u=><option key={u}>{u}</option>)}</select></div>
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


function FuelLogsPage({ user }) {
  const [logs, setLogs] = useState([])
  const [fleet, setFleet] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [filterVehicle, setFilterVehicle] = useState('all')
  const [filterFuelType, setFilterFuelType] = useState('ALL')
  const [fuelSearch, setFuelSearch] = useState('')
  const [filterMonth, setFilterMonth] = useState('ALL')
  const [showImportModal, setShowImportModal] = useState(false)
  const [pendingFuelType, setPendingFuelType] = useState('DIESEL')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteMonth, setDeleteMonth] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [dieselPrice, setDieselPrice] = useState(0)
  const [petrolPrice, setPetrolPrice] = useState(0)
  const [dieselFrom, setDieselFrom] = useState('')
  const [petrolFrom, setPetrolFrom] = useState('')
  const [priceForm, setPriceForm] = useState({diesel:'',petrol:'',effectiveFrom:new Date().toISOString().split('T')[0]})
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const emptyForm = { fleetVehicleId:'', date:'', liters:'', totalCost:'', station:'', filledBy:'', fuelType:'DIESEL' }
  const [form, setForm] = useState(emptyForm)
  const sf = (k,v) => setForm(f=>({...f,[k]:v}))

  const canAddFuel   = user.role==='manager' || hasPerm(user,'Fuel Logs','add')
  const canEditFuel  = user.role==='manager' || hasPerm(user,'Fuel Logs','edit')
  const canDeleteFuel= user.role==='manager' || hasPerm(user,'Fuel Logs','delete')

  useEffect(()=>{ fetchPrices(); fetchData() },[])

  const fetchPrices = async () => {
    try {
      const r = await api.get('/fuel-prices/current')
      setDieselPrice(r.data.diesel||0); setPetrolPrice(r.data.petrol||0)
      setDieselFrom(r.data.dieselFrom||''); setPetrolFrom(r.data.petrolFrom||'')
    } catch(e){ console.error(e) }
  }
  const savePrices = async () => {
    try {
      if(priceForm.diesel&&parseInt(priceForm.diesel)!==dieselPrice)
        await api.post('/fuel-prices',{fuelType:'DIESEL',pricePerLiter:parseInt(priceForm.diesel),effectiveFrom:priceForm.effectiveFrom})
      if(priceForm.petrol&&parseInt(priceForm.petrol)!==petrolPrice)
        await api.post('/fuel-prices',{fuelType:'PETROL',pricePerLiter:parseInt(priceForm.petrol),effectiveFrom:priceForm.effectiveFrom})
      await fetchPrices(); setShowPriceModal(false)
    } catch{ alert('Failed to save prices') }
  }
  const getPriceForDate = async (fuelType, date) => {
    try { const r = await api.get(`/fuel-prices/on-date?fuelType=${fuelType}&date=${date}`); return r.data.price||0 } catch { return 0 }
  }
  const fetchData = async () => {
    try {
      const [l,f] = await Promise.all([api.get('/fleet/fuel/all'),api.get('/fleet')])
      setLogs(Array.isArray(l.data)?l.data:[])
      const fd = Array.isArray(f.data)?f.data:[]
      setFleet(fd)
      if(fd.length>0) setForm(fr=>({...fr,fleetVehicleId:fd[0].id}))
    } catch(e){ console.error(e) }
  }
  const getFuelType = (log) => {
    if(log.filledBy?.startsWith('PETROL:')) return 'PETROL'
    if(log.filledBy?.startsWith('DIESEL:')) return 'DIESEL'
    return log.fuelType||'DIESEL'
  }
  const getDept = (log) => {
    const fb=log.filledBy||''
    if(fb.startsWith('PETROL:')||fb.startsWith('DIESEL:')) return fb.split(':').slice(1).join(':')
    return fb
  }
  const openEdit = (log) => {
    setEditing(log)
    setForm({fleetVehicleId:log.fleetVehicle?.id||'',date:log.date||'',liters:log.liters||'',totalCost:log.totalCost||'',station:log.station||'',filledBy:getDept(log),fuelType:getFuelType(log)})
    setShowAdd(true)
  }
  const handleSave = async () => {
    if(!form.fleetVehicleId||!form.liters||!form.date){alert('Vehicle, date and liters required');return}
    const payload={fleetVehicleId:form.fleetVehicleId,date:form.date,liters:parseFloat(form.liters),costPerLiter:form.totalCost&&form.liters?Math.round(parseFloat(form.totalCost)/parseFloat(form.liters)):0,totalCost:parseInt(form.totalCost)||0,mileageAtFill:0,station:form.station,filledBy:`${form.fuelType}:${form.filledBy||''}`,fuelType:form.fuelType}
    try{
      if(editing){await api.put(`/fleet/${form.fleetVehicleId}/fuel/${editing.id}`,payload);await logAudit(user,'EDIT','Fuel Logs',`Edited fuel log`)}
      else{await api.post(`/fleet/${form.fleetVehicleId}/fuel`,payload);await logAudit(user,'ADD','Fuel Logs',`Added ${form.fuelType}: ${payload.liters}L`)}
      fetchData();setShowAdd(false);setEditing(null);setForm(emptyForm)
    }catch{alert('Failed to save fuel log')}
  }
  const handleDelete = async (log) => {
    if(!window.confirm('Delete this fuel log?'))return
    try{await api.delete(`/fleet/${log.fleetVehicle?.id}/fuel/${log.id}`);await logAudit(user,'DELETE','Fuel Logs',`Deleted ${log.liters}L on ${log.date}`);fetchData()}
    catch{alert('Failed to delete')}
  }
  const handleDeleteMonth = async () => {
    if(!deleteMonth)return
    const mi=MONTHS.indexOf(deleteMonth)+1
    const toDelete=logs.filter(l=>l.date&&new Date(l.date).getMonth()+1===mi)
    if(toDelete.length===0){alert(`No fuel logs for ${deleteMonth}`);return}
    if(!window.confirm(`Delete all ${toDelete.length} entries for ${deleteMonth}?`))return
    setDeleting(true)
    let ok=0
    for(const log of toDelete){try{await api.delete(`/fleet/${log.fleetVehicle?.id}/fuel/${log.id}`);ok++}catch{}}
    setDeleting(false);setShowDeleteModal(false);setDeleteMonth('');fetchData()
    alert(`Deleted ${ok} of ${toDelete.length} records`)
  }
  const extractPlate = (particulars) => {
    if(!particulars) return null
    return particulars.split(' - ')[0].split('(')[0].trim().replace(/[\s\-]/g,'').toUpperCase()
  }
  const handleImportExcel = async (e, fuelType) => {
    const file=e.target.files[0];if(!file)return
    setImporting(true);setImportResult(null)
    try{
      const XLSX=await import('https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs')
      const data=await file.arrayBuffer()
      const wb=XLSX.read(data,{cellDates:true})
      const sheetName=(wb.SheetNames[0]||'').toLowerCase()
      const detectedType=sheetName.includes('petrol')||sheetName.includes('super')?'PETROL':sheetName.includes('diesel')?'DIESEL':null
      if(detectedType&&detectedType!==fuelType){
        setImporting(false);setImportResult({wrongFile:true,expected:fuelType,got:detectedType,sheetName:wb.SheetNames[0]});e.target.value='';return
      }
      const resolvedType=detectedType||fuelType
      const ws=wb.Sheets[wb.SheetNames[0]]
      const rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:''})
      const SKIP=['opening balance','totals','closing balance','particulars','stock item','eri-rwanda','fuel -','date','plate number']
      let success=0,failed=0,skipped=0,errors=[]
      for(const row of rows){
        const rawDate=row[0];const particulars=String(row[1]||'').trim()
        const quantity=parseFloat(row[4])||0;const value=parseFloat(row[5])||0
        const vchNo=String(row[3]||'').trim()
        if(!rawDate||!particulars||!quantity){skipped++;continue}
        if(SKIP.some(k=>particulars.toLowerCase().includes(k))){skipped++;continue}
        let dateStr=''
        if(rawDate instanceof Date){
          const y=rawDate.getFullYear();const mo=String(rawDate.getMonth()+1).padStart(2,'0');const dy=String(rawDate.getDate()).padStart(2,'0')
          dateStr=`${y}-${mo}-${dy}`
          if(rawDate.getMonth()!==MONTHS.indexOf(selectedMonth)){skipped++;continue}
        }else{skipped++;continue}
        const plateNorm=extractPlate(particulars)
        if(!plateNorm||plateNorm.length<5){skipped++;continue}
        const vehicle=fleet.find(v=>v.plate?.replace(/[\s\-]/g,'').toUpperCase()===plateNorm)
        if(!vehicle){failed++;if(errors.length<8)errors.push(`Plate not in fleet: "${particulars}"`);continue}
        const dept=vehicle.companyDepartment&&vehicle.companyDepartment!=='--Please Select--'?vehicle.companyDepartment:''
        try{
          const pricePerL=await getPriceForDate(resolvedType,dateStr)
          const computedCost=pricePerL>0?Math.round(quantity*pricePerL):Math.round(value)
          const computedCPL=pricePerL>0?pricePerL:(quantity>0?Math.round(value/quantity):0)
          await api.post(`/fleet/${vehicle.id}/fuel`,{date:dateStr,liters:quantity,costPerLiter:computedCPL,totalCost:computedCost,mileageAtFill:0,station:vchNo,filledBy:`${resolvedType}:${dept}`,fuelType:resolvedType})
          success++
        }catch{failed++;if(errors.length<8)errors.push(`Save failed: ${particulars} on ${dateStr}`)}
      }
      setImportResult({success,failed,skipped,errors,fuelType:resolvedType})
      if(success>0)fetchData()
    }catch(err){setImportResult({success:0,failed:1,skipped:0,errors:['Failed to read: '+err.message],fuelType})}
    setImporting(false);e.target.value=''
  }

  const filtered=logs
    .filter(l=>filterMonth==='ALL'||(l.date&&new Date(l.date).getMonth()===MONTHS.indexOf(filterMonth)))
    .filter(l=>filterVehicle==='all'||l.fleetVehicle?.id===parseInt(filterVehicle))
    .filter(l=>filterFuelType==='ALL'||getFuelType(l)===filterFuelType)
    .filter(l=>!fuelSearch||l.fleetVehicle?.plate?.toLowerCase().includes(fuelSearch.toLowerCase())||(l.station||'').toLowerCase().includes(fuelSearch.toLowerCase()))

  const statLogs=filterMonth==='ALL'?logs:logs.filter(l=>l.date&&new Date(l.date).getMonth()===MONTHS.indexOf(filterMonth))
  const dieselLogs=statLogs.filter(l=>getFuelType(l)==='DIESEL')
  const petrolLogs=statLogs.filter(l=>getFuelType(l)==='PETROL')
  const totalDieselL=dieselLogs.reduce((s,l)=>s+(l.liters||0),0)
  const totalDieselC=dieselLogs.reduce((s,l)=>s+(l.totalCost||0),0)
  const totalPetrolL=petrolLogs.reduce((s,l)=>s+(l.liters||0),0)
  const totalPetrolC=petrolLogs.reduce((s,l)=>s+(l.totalCost||0),0)
  const FUEL_STYLE={DIESEL:{bg:'#fef3c7',color:'#92400e'},PETROL:{bg:'#dbeafe',color:'#1e40af'}}

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Fuel Logs</div><div className="page-sub">Diesel & Petrol tracking</div></div>
        <div className="page-actions">
          {user.role==='manager'&&(
            <button className="btn btn-ghost btn-sm" style={{borderColor:'#f59e0b',color:'#92400e'}} onClick={()=>{setPriceForm({diesel:dieselPrice||'',petrol:petrolPrice||'',effectiveFrom:new Date().toISOString().split('T')[0]});setShowPriceModal(true)}}>
              Set Prices
            </button>
          )}
          {canAddFuel&&<>
            {user.role==='manager'&&<button className="btn btn-danger btn-sm" onClick={()=>{setShowDeleteModal(true);setDeleteMonth('')}}>Delete Month</button>}
            <button className="btn btn-ghost btn-sm" style={{borderColor:'#f59e0b',color:'#92400e'}} onClick={()=>{setPendingFuelType('DIESEL');setSelectedMonth('');setShowImportModal(true);setImportResult(null)}} disabled={importing}>Import Diesel</button>
            <button className="btn btn-ghost btn-sm" style={{borderColor:'#2563eb',color:'#1e40af'}} onClick={()=>{setPendingFuelType('PETROL');setSelectedMonth('');setShowImportModal(true);setImportResult(null)}} disabled={importing}>Import Petrol</button>
            <button className="btn btn-blue btn-sm" onClick={()=>{setEditing(null);setForm(emptyForm);setShowAdd(true)}}>+ Log Fill</button>
          </>}
        </div>
      </div>
      <div className="page-content">
        {importResult&&(
          <div style={{marginBottom:16,padding:'14px 16px',borderRadius:12,background:importResult.wrongFile?'#fff5f5':importResult.failed===0?'#f0fdf4':'#fff5f5',border:`1px solid ${importResult.wrongFile?'#fca5a5':importResult.failed===0?'#86efac':'#fca5a5'}`,display:'flex',gap:12,alignItems:'flex-start'}}>
            <div style={{flex:1}}>
              {importResult.wrongFile?(
                <div><div style={{fontWeight:800,fontSize:14,color:'#dc2626',marginBottom:6}}>Wrong File — Import Blocked</div><div style={{fontSize:13,color:'#7f1d1d'}}>You clicked <strong>Import {importResult.expected}</strong> but selected a <strong>{importResult.got}</strong> file ({importResult.sheetName}).</div></div>
              ):(
                <div><div style={{fontWeight:800,fontSize:14,color:importResult.failed===0?'#166534':'#dc2626',marginBottom:4}}>{importResult.fuelType} Import — {importResult.success} imported{importResult.failed>0?`, ${importResult.failed} failed`:''}{importResult.skipped>0?`, ${importResult.skipped} skipped`:''}</div>
                {importResult.errors?.length>0&&<div style={{fontSize:12,color:'#dc2626'}}>{importResult.errors.map((err,i)=><div key={i}>• {err}</div>)}</div>}</div>
              )}
            </div>
            <button onClick={()=>setImportResult(null)} style={{background:'none',border:'none',cursor:'pointer',fontSize:20,color:'#9096ab',lineHeight:1}}>×</button>
          </div>
        )}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:16}}>
          <div className="stat-card" style={{borderLeft:'3px solid #f59e0b'}}><div style={{fontSize:11,fontWeight:700,color:'var(--text2)',textTransform:'uppercase',marginBottom:4}}>Diesel Liters</div><div style={{fontSize:22,fontWeight:800,color:'#92400e'}}>{totalDieselL.toFixed(1)} L</div><div style={{fontSize:11,color:'var(--text3)'}}>{dieselLogs.length} fills</div></div>
          <div className="stat-card" style={{borderLeft:'3px solid #f59e0b',cursor:user.role==='manager'?'pointer':'default'}} onClick={()=>user.role==='manager'&&(setPriceForm({diesel:dieselPrice||'',petrol:petrolPrice||'',effectiveFrom:new Date().toISOString().split('T')[0]}),setShowPriceModal(true))}>
            <div style={{fontSize:11,fontWeight:700,color:'var(--text2)',textTransform:'uppercase',marginBottom:4}}>Diesel Price/L</div>
            <div style={{fontSize:22,fontWeight:800,color:'#92400e'}}>{dieselPrice>0?dieselPrice.toLocaleString():'—'}</div>
            <div style={{fontSize:11,color:'var(--text3)'}}>{dieselPrice>0?'RWF/L':user.role==='manager'?'Click to set':''}</div>
          </div>
          <div className="stat-card" style={{borderLeft:'3px solid #f59e0b'}}><div style={{fontSize:11,fontWeight:700,color:'var(--text2)',textTransform:'uppercase',marginBottom:4}}>Total Diesel Cost</div><div style={{fontSize:22,fontWeight:800,color:'#92400e'}}>{totalDieselC.toLocaleString()}</div><div style={{fontSize:11,color:'var(--text3)'}}>RWF</div></div>
          <div className="stat-card" style={{borderLeft:'3px solid #2563eb'}}><div style={{fontSize:11,fontWeight:700,color:'var(--text2)',textTransform:'uppercase',marginBottom:4}}>Petrol Liters</div><div style={{fontSize:22,fontWeight:800,color:'#1e40af'}}>{totalPetrolL.toFixed(1)} L</div><div style={{fontSize:11,color:'var(--text3)'}}>{petrolLogs.length} fills</div></div>
          <div className="stat-card" style={{borderLeft:'3px solid #2563eb'}}><div style={{fontSize:11,fontWeight:700,color:'var(--text2)',textTransform:'uppercase',marginBottom:4}}>Petrol Price/L</div><div style={{fontSize:22,fontWeight:800,color:'#1e40af'}}>{petrolPrice>0?petrolPrice.toLocaleString():'—'}</div><div style={{fontSize:11,color:'var(--text3)'}}>{petrolPrice>0?'RWF/L':''}</div></div>
          <div className="stat-card" style={{borderLeft:'3px solid #2563eb'}}><div style={{fontSize:11,fontWeight:700,color:'var(--text2)',textTransform:'uppercase',marginBottom:4}}>Total Petrol Cost</div><div style={{fontSize:22,fontWeight:800,color:'#1e40af'}}>{totalPetrolC.toLocaleString()}</div><div style={{fontSize:11,color:'var(--text3)'}}>RWF</div></div>
        </div>
        <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap',alignItems:'center'}}>
          <select className="form-input" style={{width:160,appearance:'auto'}} value={filterMonth} onChange={e=>setFilterMonth(e.target.value)}>
            <option value="ALL">All Months</option>{MONTHS.map(m=><option key={m} value={m}>{m}</option>)}
          </select>
          <input className="form-input" style={{width:190}} placeholder="Search plate..." value={fuelSearch} onChange={e=>setFuelSearch(e.target.value)}/>
          <select className="form-input" style={{maxWidth:200,appearance:'auto'}} value={filterVehicle} onChange={e=>setFilterVehicle(e.target.value)}>
            <option value="all">All Fleet Vehicles</option>{fleet.map(v=><option key={v.id} value={v.id}>{v.plate} — {v.make} {v.model}</option>)}
          </select>
          <div className="tab-bar" style={{width:'auto'}}>
            {[['ALL','All'],['DIESEL','Diesel'],['PETROL','Petrol']].map(([val,label])=>(
              <button key={val} className="tab-btn" onClick={()=>setFilterFuelType(val)} style={{background:filterFuelType===val?'var(--blue)':'transparent',color:filterFuelType===val?'#fff':'var(--text2)',padding:'7px 14px'}}>{label}</button>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Fuel History</div><span style={{fontSize:12,color:'var(--text2)',fontWeight:600}}>{filtered.length} entries</span></div>
          {filtered.length===0?<div style={{padding:48,textAlign:'center',color:'var(--text3)'}}>No fuel logs yet</div>:(
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Date</th><th>Plate</th><th>Type</th><th>Dept</th><th className="hide-mobile">Vch No.</th><th>Liters</th><th>Value (RWF)</th>{(canEditFuel||canDeleteFuel)&&<th>Actions</th>}</tr></thead>
                <tbody>
                  {[...filtered].reverse().map(l=>{
                    const ft=getFuelType(l);const dept=getDept(l);const fs=FUEL_STYLE[ft]||FUEL_STYLE.DIESEL
                    return(
                      <tr key={l.id}>
                        <td style={{color:'var(--text2)',whiteSpace:'nowrap'}}>{l.date}</td>
                        <td style={{fontFamily:'DM Mono,monospace',color:'var(--blue)',fontWeight:700}}>{l.fleetVehicle?.plate||'—'}</td>
                        <td><span style={{fontSize:11,fontWeight:800,borderRadius:20,padding:'3px 9px',background:fs.bg,color:fs.color}}>{ft}</span></td>
                        <td style={{fontSize:13,color:'var(--text2)'}}>{dept||'—'}</td>
                        <td className="hide-mobile" style={{fontFamily:'DM Mono,monospace',fontSize:12,color:'var(--text3)'}}>{l.station||'—'}</td>
                        <td style={{fontWeight:700}}>{l.liters}L</td>
                        <td style={{fontFamily:'DM Mono,monospace',color:'var(--green)',fontWeight:700}}>{(l.totalCost||0).toLocaleString()}</td>
                        {(canEditFuel||canDeleteFuel)&&<td><div style={{display:'flex',gap:4}}>
                          {canEditFuel&&<button className="btn btn-ghost btn-sm" onClick={()=>openEdit(l)}>Edit</button>}
                          {canDeleteFuel&&<button className="btn btn-danger btn-sm" onClick={()=>handleDelete(l)}>Del</button>}
                        </div></td>}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {showDeleteModal&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowDeleteModal(false)}>
          <div className="modal" style={{maxWidth:420}}>
            <div className="modal-header"><div className="modal-title" style={{color:'var(--red)'}}>Delete by Month</div><X onClick={()=>setShowDeleteModal(false)}/></div>
            <div className="modal-body">
              <label className="form-label">Select Month *</label>
              <select className="form-input" style={{appearance:'auto',marginBottom:12}} value={deleteMonth} onChange={e=>setDeleteMonth(e.target.value)}>
                <option value="">— Select a month —</option>
                {MONTHS.map(m=>{const idx=MONTHS.indexOf(m)+1;const count=logs.filter(l=>l.date&&new Date(l.date).getMonth()+1===idx).length;return<option key={m} value={m}>{m} {count>0?`(${count})`:'(none)'}</option>})}
              </select>
              <div style={{background:'#fff5f5',border:'1px solid #fca5a5',borderRadius:10,padding:'12px 14px',fontSize:13,color:'#dc2626'}}>This cannot be undone.</div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setShowDeleteModal(false)}>Cancel</button>
              <button className="btn" style={{background:'var(--red)',color:'#fff',opacity:deleteMonth?1:0.5}} onClick={handleDeleteMonth} disabled={!deleteMonth||deleting}>{deleting?'Deleting...':'Delete All'}</button>
            </div>
          </div>
        </div>
      )}
      {showImportModal&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowImportModal(false)}>
          <div className="modal" style={{maxWidth:440}}>
            <div className="modal-header"><div className="modal-title" style={{color:pendingFuelType==='PETROL'?'#1e40af':'#92400e'}}>Import {pendingFuelType==='PETROL'?'Petrol':'Diesel'} Excel</div><X onClick={()=>setShowImportModal(false)}/></div>
            <div className="modal-body">
              <div style={{marginBottom:16}}>
                <label className="form-label">Select Month *</label>
                <select className="form-input" style={{appearance:'auto'}} value={selectedMonth} onChange={e=>setSelectedMonth(e.target.value)}>
                  <option value="">— Select a month —</option>{MONTHS.map(m=><option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setShowImportModal(false)}>Cancel</button>
              <label className="btn btn-blue" style={{cursor:selectedMonth?'pointer':'not-allowed',opacity:selectedMonth?1:0.5,position:'relative'}}>
                Choose File & Import
                <input type="file" accept=".xlsx,.xls" style={{position:'absolute',inset:0,opacity:0,cursor:selectedMonth?'pointer':'not-allowed'}} disabled={!selectedMonth||importing}
                  onChange={e=>{if(!selectedMonth)return;const ft=pendingFuelType;setShowImportModal(false);handleImportExcel(e,ft)}}/>
              </label>
            </div>
          </div>
        </div>
      )}
      {showAdd&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowAdd(false)}>
          <div className="modal" style={{maxWidth:500}}>
            <div className="modal-header"><div className="modal-title">{editing?'Edit Fuel Log':'Log Fuel Fill'}</div><X onClick={()=>{setShowAdd(false);setEditing(null)}}/></div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Fleet Vehicle *</label>
                <select className="form-input" style={{appearance:'auto'}} value={form.fleetVehicleId}
                  onChange={e=>{const vid=e.target.value;const veh=fleet.find(v=>String(v.id)===String(vid));const dept=veh?.companyDepartment&&veh.companyDepartment!=='--Please Select--'?veh.companyDepartment:'';setForm(f=>({...f,fleetVehicleId:vid,filledBy:dept}))}}>
                  {fleet.map(v=><option key={v.id} value={v.id}>{v.plate} — {v.make} {v.model}</option>)}
                </select>
              </div>
              <div className="form-row" style={{marginBottom:14}}>
                <div><label className="form-label">Fuel Type</label><select className="form-input" style={{appearance:'auto'}} value={form.fuelType} onChange={e=>sf('fuelType',e.target.value)}><option value="DIESEL">Diesel</option><option value="PETROL">Petrol</option></select></div>
                <div><label className="form-label">Date *</label><input className="form-input" type="date" value={form.date} onChange={e=>sf('date',e.target.value)}/></div>
              </div>
              <div className="form-row" style={{marginBottom:14}}>
                <div><label className="form-label">Liters *</label><input className="form-input" type="number" placeholder="175.5" value={form.liters} onChange={e=>sf('liters',e.target.value)}/></div>
                <div><label className="form-label">Value (RWF)</label><input className="form-input" type="number" placeholder="333450" value={form.totalCost} onChange={e=>sf('totalCost',e.target.value)}/></div>
              </div>
              <div className="form-row">
                <div><label className="form-label">Vch No.</label><input className="form-input" placeholder="DIAOF/4301636" value={form.station} onChange={e=>sf('station',e.target.value)}/></div>
                <div><label className="form-label">Department</label><input className="form-input" placeholder="Auto-filled" value={form.filledBy} onChange={e=>sf('filledBy',e.target.value)}/></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>{setShowAdd(false);setEditing(null)}}>Cancel</button>
              <button className="btn btn-blue" onClick={handleSave}>{editing?'Save Changes':'Log Fill'}</button>
            </div>
          </div>
        </div>
      )}
      {showPriceModal&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowPriceModal(false)}>
          <div className="modal" style={{maxWidth:420}}>
            <div className="modal-header"><div className="modal-title">Set RURA Price per Liter</div><X onClick={()=>setShowPriceModal(false)}/></div>
            <div className="modal-body">
              <div className="form-group"><label className="form-label">Effective From</label><input className="form-input" type="date" value={priceForm.effectiveFrom} onChange={e=>setPriceForm(f=>({...f,effectiveFrom:e.target.value}))}/></div>
              <div className="form-row">
                <div><label className="form-label">Diesel Price (RWF/L)</label><input className="form-input" type="number" placeholder="Leave blank if unchanged" value={priceForm.diesel} onChange={e=>setPriceForm(f=>({...f,diesel:e.target.value}))}/></div>
                <div><label className="form-label">Petrol Price (RWF/L)</label><input className="form-input" type="number" placeholder="Leave blank if unchanged" value={priceForm.petrol} onChange={e=>setPriceForm(f=>({...f,petrol:e.target.value}))}/></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setShowPriceModal(false)}>Cancel</button>
              <button className="btn btn-success" onClick={savePrices}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


function StaffPage() {
  const [staff, setStaff] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null)
  const [addForm, setAddForm] = useState({name:'',email:'',password:''})
  const [addPerms, setAddPerms] = useState(defaultPerms())
  const [editForm, setEditForm] = useState({name:'',email:'',newPassword:''})
  const [editPerms, setEditPerms] = useState(defaultPerms())
  const [addError, setAddError] = useState('')
  const [editError, setEditError] = useState('')
  const [loading, setLoading] = useState(false)
  useEffect(()=>{fetchStaff()},[])
  const fetchStaff=async()=>{try{const r=await api.get('/auth/users');setStaff(r.data)}catch{setStaff([])}}
  const togglePerm=(perms,setPerms,page,action)=>{
    const updated={...perms,[page]:{...perms[page],[action]:!perms[page][action]}}
    if(action!=='view'&&updated[page][action]) updated[page].view=true
    if(action==='view'&&!updated[page].view) updated[page]={view:false,add:false,edit:false,delete:false}
    setPerms(updated)
  }
  const PermTable = ({perms,setPerms}) => (
    <div style={{marginTop:12}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr repeat(4,auto)',gap:'4px 12px',alignItems:'center'}}>
        <div style={{fontSize:11,fontWeight:800,color:'var(--text3)',textTransform:'uppercase'}}>Page</div>
        {ACTIONS.map(a=><div key={a} style={{fontSize:11,fontWeight:800,color:'var(--text3)',textTransform:'uppercase',textAlign:'center'}}>{a}</div>)}
        {PAGES.map(pg=>(
          <>{<div key={pg} style={{fontSize:13,fontWeight:600,padding:'6px 0',borderTop:'1px solid var(--border)'}}>{pg}</div>}
            {ACTIONS.map(action=>(
              <div key={pg+action} style={{display:'flex',justifyContent:'center',borderTop:'1px solid var(--border)',padding:'6px 0'}}>
                <input type="checkbox" checked={perms[pg]?.[action]||false} onChange={()=>togglePerm(perms,setPerms,pg,action)} style={{width:16,height:16,cursor:'pointer',accentColor:'var(--blue)'}}/>
              </div>
            ))}
          </>
        ))}
      </div>
    </div>
  )
  const handleCreate=async()=>{
    if(!addForm.name||!addForm.email||!addForm.password){setAddError('All fields required');return}
    setLoading(true);setAddError('')
    try{
      await api.post('/auth/register',{name:addForm.name,email:addForm.email,password:addForm.password,role:'viewer',permissions:JSON.stringify(addPerms)})
      setAddForm({name:'',email:'',password:''});setAddPerms(defaultPerms());setShowAddModal(false);fetchStaff()
    }catch(e){
      const msg=e?.response?.data?.error||e?.response?.data?.message||''
      setAddError(msg.toLowerCase().includes('email')?'Email already exists.':'Failed to create. Try again.')
    }
    setLoading(false)
  }
  const openEdit=(s)=>{setEditingStaff(s);setEditForm({name:s.name,email:s.email,newPassword:''});setEditPerms(parsePerms(s.permissions));setEditError('');setShowEditModal(true)}
  const handleEdit=async()=>{
    if(!editForm.name||!editForm.email){setEditError('Name and email required');return}
    setLoading(true);setEditError('')
    try{
      const payload={name:editForm.name,email:editForm.email,role:'viewer',permissions:JSON.stringify(editPerms)}
      if(editForm.newPassword.trim())payload.password=editForm.newPassword.trim()
      await api.put(`/auth/users/${editingStaff.id}`,payload)
      setShowEditModal(false);fetchStaff()
    }catch{setEditError('Failed to update.')}
    setLoading(false)
  }
  const handleDelete=async(id)=>{if(!window.confirm('Remove this staff member?'))return;try{await api.delete(`/auth/users/${id}`);fetchStaff()}catch{alert('Failed')}}
  const getPermSummary=(s)=>{
    if(s.role==='manager') return 'Full Access'
    const perms=parsePerms(s.permissions)
    const pages=PAGES.filter(pg=>perms[pg]?.view)
    return pages.length>0?pages.join(', '):'No access'
  }
  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Staff Management</div><div className="page-sub">Manage team accounts and permissions</div></div>
        <div className="page-actions"><button className="btn btn-success btn-sm" onClick={()=>{setAddForm({name:'',email:'',password:''});setAddPerms(defaultPerms());setShowAddModal(true)}}>+ Add Staff</button></div>
      </div>
      <div className="page-content">
        <div className="card">
          <div className="card-header"><div className="card-title">Team Members</div><span style={{fontSize:12,color:'var(--text2)',fontWeight:600}}>{staff.length} members</span></div>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Name</th><th className="hide-mobile">Email</th><th>Page Access</th><th>Actions</th></tr></thead>
              <tbody>{staff.map(s=>(
                <tr key={s.id}>
                  <td style={{fontWeight:600}}>{s.name}</td>
                  <td className="hide-mobile" style={{color:'var(--text2)',fontFamily:'DM Mono,monospace',fontSize:13}}>{s.email}</td>
                  <td><span style={{fontSize:12,color:s.role==='manager'?'var(--green)':'var(--blue)',fontWeight:600}}>{getPermSummary(s)}</span></td>
                  <td><div style={{display:'flex',gap:4}}>
                    {s.role!=='manager'&&<button className="btn btn-ghost btn-sm" onClick={()=>openEdit(s)}>Edit</button>}
                    {s.role!=='manager'&&<button className="btn btn-danger btn-sm" onClick={()=>handleDelete(s.id)}>Remove</button>}
                  </div></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </div>
      {showAddModal&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowAddModal(false)}>
          <div className="modal" style={{maxWidth:520}}>
            <div className="modal-header"><div className="modal-title">Add Staff Member</div><X onClick={()=>setShowAddModal(false)}/></div>
            <div className="modal-body">
              {addError&&<div className="error-msg">{addError}</div>}
              <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" value={addForm.name} onChange={e=>setAddForm(f=>({...f,name:e.target.value}))} onKeyDown={onlyLetters}/></div>
              <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" value={addForm.email} onChange={e=>setAddForm(f=>({...f,email:e.target.value}))}/></div>
              <div className="form-group"><label className="form-label">Password *</label><input className="form-input" type="password" value={addForm.password} onChange={e=>setAddForm(f=>({...f,password:e.target.value}))}/></div>
              <div style={{fontSize:12,fontWeight:800,color:'var(--text2)',textTransform:'uppercase',letterSpacing:'0.06em',marginTop:16,marginBottom:4}}>Page Permissions</div>
              <PermTable perms={addPerms} setPerms={setAddPerms}/>
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
          <div className="modal" style={{maxWidth:520}}>
            <div className="modal-header"><div className="modal-title">Edit — {editingStaff.name}</div><X onClick={()=>setShowEditModal(false)}/></div>
            <div className="modal-body">
              {editError&&<div className="error-msg">{editError}</div>}
              <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" value={editForm.name} onChange={e=>setEditForm(f=>({...f,name:e.target.value}))}/></div>
              <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" value={editForm.email} onChange={e=>setEditForm(f=>({...f,email:e.target.value}))}/></div>
              <div className="form-group"><label className="form-label">New Password</label><input className="form-input" type="password" placeholder="Leave blank to keep current" value={editForm.newPassword} onChange={e=>setEditForm(f=>({...f,newPassword:e.target.value}))}/></div>
              <div style={{fontSize:12,fontWeight:800,color:'var(--text2)',textTransform:'uppercase',letterSpacing:'0.06em',marginTop:16,marginBottom:4}}>Page Permissions</div>
              <PermTable perms={editPerms} setPerms={setEditPerms}/>
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


function AuditLogPage() {
  const [logs, setLogs] = useState([])
  const [search, setSearch] = useState('')
  const [filterModule, setFilterModule] = useState('ALL')
  const [filterAction, setFilterAction] = useState('ALL')
  const MODULES=['ALL','Expenses','Fleet Vehicles','Garage Vehicles','Inventory','Fuel Logs']
  const AFILTERS=['ALL','ADD','EDIT','DELETE']
  const ACTION_STYLE={'ADD':{bg:'#d1fae5',color:'#065f46'},'EDIT':{bg:'#dbeafe',color:'#1e40af'},'DELETE':{bg:'#fee2e2',color:'#991b1b'}}
  useEffect(()=>{api.get('/audit').then(r=>setLogs(Array.isArray(r.data)?r.data:[])).catch(e=>console.error(e))},[])
  const filtered=logs.filter(l=>{
    const q=search.toLowerCase()
    return(filterModule==='ALL'||l.moduleName===filterModule)&&(filterAction==='ALL'||l.action===filterAction)&&(!q||l.userName?.toLowerCase().includes(q)||l.details?.toLowerCase().includes(q)||l.moduleName?.toLowerCase().includes(q))
  })
  const formatTime=(ts)=>{if(!ts)return'—';const d=new Date(ts);return d.toLocaleDateString('en-GB')+' '+d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}
  return (
    <>
      <div className="page-header"><div><div className="page-title">Audit Log</div><div className="page-sub">Track who did what and when</div></div></div>
      <div className="page-content">
        <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap'}}>
          <input className="form-input" style={{flex:1,minWidth:160}} placeholder="Search user, module, details..." value={search} onChange={e=>setSearch(e.target.value)}/>
          <select className="form-input" style={{width:160,appearance:'auto'}} value={filterModule} onChange={e=>setFilterModule(e.target.value)}>
            {MODULES.map(m=><option key={m} value={m}>{m==='ALL'?'All Modules':m}</option>)}
          </select>
          <select className="form-input" style={{width:130,appearance:'auto'}} value={filterAction} onChange={e=>setFilterAction(e.target.value)}>
            {AFILTERS.map(a=><option key={a} value={a}>{a==='ALL'?'All Actions':a}</option>)}
          </select>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Activity History</div><span style={{fontSize:12,color:'var(--text2)',fontWeight:600}}>{filtered.length} records</span></div>
          {filtered.length===0?<div style={{padding:48,textAlign:'center',color:'var(--text3)'}}>No records found</div>:(
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
  const q=search.toLowerCase()
  const filteredFleet=data.fleet.filter(v=>!q||v.plate?.toLowerCase().includes(q)||v.make?.toLowerCase().includes(q)||v.driverName?.toLowerCase().includes(q))
  const filteredGarage=data.vehicles.filter(v=>!q||v.plate?.toLowerCase().includes(q)||v.make?.toLowerCase().includes(q)||v.ownerName?.toLowerCase().includes(q))
  const filteredFuel=data.fuel.filter(f=>!q||f.fleetVehicle?.plate?.toLowerCase().includes(q))
  const filteredInventory=data.inventory.filter(i=>!q||i.name?.toLowerCase().includes(q)||i.category?.toLowerCase().includes(q))
  const filteredStaff=data.staff.filter(s=>!q||s.name?.toLowerCase().includes(q)||s.email?.toLowerCase().includes(q))
  const filteredExpenses=data.expenses.filter(e=>!q||e.plate?.toLowerCase().includes(q)||e.reason?.toLowerCase().includes(q))
  const exportCSV=(rows,headers,filename)=>{
    const csv=[headers,...rows].map(r=>r.map(c=>`"${c??''}"`).join(',')).join('\n')
    const blob=new Blob([csv],{type:'text/csv'});const url=URL.createObjectURL(blob)
    const a=document.createElement('a');a.href=url;a.download=`${filename}-${new Date().toISOString().split('T')[0]}.csv`;a.click();URL.revokeObjectURL(url)
  }
  const exportPDF=(title,headers,rows)=>{
    const tableRows=rows.map(r=>`<tr>${r.map(c=>`<td>${c??'—'}</td>`).join('')}</tr>`).join('')
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title><style>body{font-family:Calibri,sans-serif;padding:30px}h1{font-size:20px}table{width:100%;border-collapse:collapse;margin-top:16px;font-size:12px}th{background:#2563eb;color:#fff;padding:8px;text-align:left}td{padding:7px 8px;border-bottom:1px solid #eee}</style></head><body><h1>${title}</h1><p>Generated: ${new Date().toLocaleString()}</p><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${tableRows}</tbody></table></body></html>`
    const w=window.open('','_blank');w.document.write(html);w.document.close();w.print()
  }
  const handleExportCSV=()=>{
    if(activeReport==='fleet')exportCSV(filteredFleet.map(v=>[v.plate,v.make,v.model,v.year,v.status,v.driverName,v.driverPhone,v.mileage,v.insuranceExpiry]),['Plate','Make','Model','Year','Status','Driver','Phone','Mileage','Ins. Expiry'],'fleet')
    else if(activeReport==='garage')exportCSV(filteredGarage.map(v=>[v.plate,v.make,v.model,v.year,v.status,v.ownerName,v.ownerPhone,v.mileage]),['Plate','Make','Model','Year','Status','Owner','Phone','Mileage'],'garage')
    else if(activeReport==='fuel')exportCSV(filteredFuel.map(f=>[f.fleetVehicle?.plate,f.date,f.liters,f.totalCost,f.station]),['Vehicle','Date','Liters','Total Cost','Vch No.'],'fuel')
    else if(activeReport==='inventory')exportCSV(filteredInventory.map(i=>[i.name,i.category,i.quantity,i.unit,i.unitPrice,i.status]),['Name','Category','Qty','Unit','Price','Status'],'inventory')
    else if(activeReport==='staff')exportCSV(filteredStaff.map(s=>[s.name,s.email,s.role]),['Name','Email','Role'],'staff')
    else if(activeReport==='expenses')exportCSV(filteredExpenses.map(e=>[e.date,e.plate,e.reason,e.assignment||e.receivedBy||'',e.amount]),['Date','Plate','Reason','Received By','Amount'],'expenses')
  }
  const handleExportPDF=()=>{
    if(activeReport==='fleet')exportPDF('Fleet Vehicles Report',['Plate','Make','Model','Year','Status','Driver','Mileage','Ins. Expiry'],filteredFleet.map(v=>[v.plate,v.make,v.model,v.year,v.status,v.driverName,v.mileage,v.insuranceExpiry]))
    else if(activeReport==='garage')exportPDF('Garage Vehicles Report',['Plate','Make','Model','Year','Status','Owner','Phone','Mileage'],filteredGarage.map(v=>[v.plate,v.make,v.model,v.year,v.status,v.ownerName,v.ownerPhone,v.mileage]))
    else if(activeReport==='fuel')exportPDF('Fuel Logs Report',['Vehicle','Date','Liters','Total Cost (RWF)','Vch No.'],filteredFuel.map(f=>[f.fleetVehicle?.plate,f.date,f.liters,f.totalCost,f.station]))
    else if(activeReport==='inventory')exportPDF('Inventory Report',['Name','Category','Qty','Unit Price','Status'],filteredInventory.map(i=>[i.name,i.category,`${i.quantity} ${i.unit}`,i.unitPrice,i.status]))
    else if(activeReport==='staff')exportPDF('Staff Report',['Name','Email','Role'],filteredStaff.map(s=>[s.name,s.email,s.role]))
    else if(activeReport==='expenses')exportPDF('Expenses Report',['Date','Plate','Reason','Received By','Amount (RWF)'],filteredExpenses.map(e=>[e.date,e.plate||'—',e.reason,e.assignment||e.receivedBy||'—',(e.amount||0).toLocaleString()]))
  }
  const reportTabs=[{key:'fleet',label:'Fleet'},{key:'garage',label:'Garage'},{key:'fuel',label:'Fuel'},{key:'inventory',label:'Inventory'},{key:'staff',label:'Staff'},{key:'expenses',label:'Expenses'}]
  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Reports</div><div className="page-sub">Generate and export reports</div></div>
        <div className="page-actions">
          <button className="btn btn-ghost btn-sm" onClick={handleExportCSV}>Export CSV</button>
          <button className="btn btn-blue btn-sm" onClick={handleExportPDF}>Export PDF</button>
        </div>
      </div>
      <div className="page-content">
        <div className="tab-bar" style={{marginBottom:16}}>
          {reportTabs.map(t=>(
            <button key={t.key} className="tab-btn" onClick={()=>{setActiveReport(t.key);setSearch('')}} style={{background:activeReport===t.key?'var(--blue)':'transparent',color:activeReport===t.key?'#fff':'var(--text2)'}}>{t.label}</button>
          ))}
        </div>
        <div style={{marginBottom:16,display:'flex',gap:10}}>
          <input className="form-input" style={{flex:1}} placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <div className="card">
          {activeReport==='fleet'&&(filteredFleet.length===0?<div style={{padding:48,textAlign:'center',color:'var(--text3)'}}>No fleet vehicles</div>:(
            <div className="table-wrap"><table className="table">
              <thead><tr><th>Plate</th><th>Make/Model</th><th>Status</th><th className="hide-mobile">Driver</th><th className="hide-mobile">Ins. Expiry</th></tr></thead>
              <tbody>{filteredFleet.map(v=>{const ss=FLEET_STATUS[v.status]||FLEET_STATUS['Active'];return(
                <tr key={v.id}>
                  <td style={{fontFamily:'DM Mono,monospace',color:'var(--blue)',fontWeight:700}}>{v.plate}</td>
                  <td style={{fontWeight:600}}>{v.make} {v.model}</td>
                  <td><span style={{fontSize:11,fontWeight:700,borderRadius:20,padding:'3px 8px',background:ss.bg,color:ss.color}}>{v.status?.replace('_',' ')}</span></td>
                  <td className="hide-mobile">{v.driverName||'—'}</td>
                  <td className="hide-mobile" style={{color:v.insuranceExpiry&&new Date(v.insuranceExpiry)<new Date()?'var(--red)':'var(--text2)'}}>{v.insuranceExpiry||'—'}</td>
                </tr>
              )})}</tbody>
            </table></div>
          ))}
          {activeReport==='garage'&&(filteredGarage.length===0?<div style={{padding:48,textAlign:'center',color:'var(--text3)'}}>No garage vehicles</div>:(
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
          ))}
          {activeReport==='fuel'&&(filteredFuel.length===0?<div style={{padding:48,textAlign:'center',color:'var(--text3)'}}>No fuel logs</div>:(
            <div className="table-wrap"><table className="table">
              <thead><tr><th>Date</th><th>Plate</th><th>Liters</th><th>Value (RWF)</th><th className="hide-mobile">Vch No.</th></tr></thead>
              <tbody>{[...filteredFuel].reverse().map(l=>(
                <tr key={l.id}>
                  <td style={{color:'var(--text2)'}}>{l.date}</td>
                  <td style={{fontFamily:'DM Mono,monospace',color:'var(--blue)',fontWeight:700}}>{l.fleetVehicle?.plate||'—'}</td>
                  <td style={{fontWeight:700}}>{l.liters}L</td>
                  <td style={{fontFamily:'DM Mono,monospace',color:'var(--green)',fontWeight:700}}>{(l.totalCost||0).toLocaleString()}</td>
                  <td className="hide-mobile" style={{color:'var(--text2)'}}>{l.station||'—'}</td>
                </tr>
              ))}</tbody>
            </table></div>
          ))}
          {activeReport==='inventory'&&(filteredInventory.length===0?<div style={{padding:48,textAlign:'center',color:'var(--text3)'}}>No items</div>:(
            <div className="table-wrap"><table className="table">
              <thead><tr><th>Name</th><th className="hide-mobile">Category</th><th>Qty</th><th className="hide-mobile">Price</th><th>Status</th></tr></thead>
              <tbody>{filteredInventory.map(i=>{const st=INV_STATUS[i.status]||INV_STATUS['In_Stock'];return(
                <tr key={i.id}>
                  <td style={{fontWeight:600}}>{i.name}</td>
                  <td className="hide-mobile"><span style={{fontSize:11,background:'var(--surface2)',color:'var(--text2)',borderRadius:6,padding:'3px 8px'}}>{i.category}</span></td>
                  <td>{i.quantity} {i.unit}</td>
                  <td className="hide-mobile" style={{fontFamily:'DM Mono,monospace',color:'var(--green)'}}>{(i.unitPrice||0).toLocaleString()} RWF</td>
                  <td><span style={{fontSize:11,fontWeight:700,borderRadius:20,padding:'3px 8px',background:st.bg,color:st.color}}>{i.status?.replace('_',' ')}</span></td>
                </tr>
              )})}</tbody>
            </table></div>
          ))}
          {activeReport==='staff'&&(filteredStaff.length===0?<div style={{padding:48,textAlign:'center',color:'var(--text3)'}}>No staff</div>:(
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
          ))}
          {activeReport==='expenses'&&(filteredExpenses.length===0?<div style={{padding:48,textAlign:'center',color:'var(--text3)'}}>No expenses</div>:(
            <div className="table-wrap"><table className="table">
              <thead><tr><th>Date</th><th>Plate</th><th>Reason</th><th className="hide-mobile">Received By</th><th>Amount (RWF)</th></tr></thead>
              <tbody>{filteredExpenses.map(e=>(
                <tr key={e.id}>
                  <td style={{color:'var(--text2)'}}>{e.date}</td>
                  <td style={{fontFamily:'DM Mono,monospace',color:'var(--blue)',fontWeight:700}}>{e.plate||'—'}</td>
                  <td style={{fontWeight:600}}>{e.reason}</td>
                  <td className="hide-mobile" style={{color:'var(--text2)'}}>{e.assignment||e.receivedBy||'—'}</td>
                  <td style={{fontFamily:'DM Mono,monospace',fontWeight:700,color:'var(--red)'}}>{(e.amount||0).toLocaleString()}</td>
                </tr>
              ))}</tbody>
            </table></div>
          ))}
        </div>
      </div>
    </>
  )
}


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
          <div className="form-group"><label className="form-label">Parts Used (comma separated)</label><input className="form-input" value={form.parts} onChange={e=>s('parts',e.target.value)} placeholder="Oil Filter, Brake Pads..."/></div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-blue" onClick={()=>{if(!form.description){alert('Description required');return}onSave({...form,cost:parseInt(form.cost)||0,parts:form.parts?form.parts.split(',').map(p=>p.trim()).filter(Boolean):[]})}}>Log Service</button>
        </div>
      </div>
    </div>
  )
}

function VehicleModal({ vehicle, onSave, onClose }) {
  const empty={plate:'',make:'',model:'',year:new Date().getFullYear(),color:'',vin:'',type:'Sedan',ownerName:'',ownerPhone:'',status:'Ready',mileage:0,driverName:'',driverPhone:'',driverLicense:''}
  const [form, setForm] = useState(vehicle||empty)
  const [fleet, setFleet] = useState([])
  const [selectedFleetId, setSelectedFleetId] = useState('')
  const s=(k,v)=>setForm(f=>({...f,[k]:v}))
  useEffect(()=>{if(!vehicle)api.get('/fleet').then(r=>setFleet(Array.isArray(r.data)?r.data:r.data?.content||[])).catch(()=>{})},[])
  const handleFleetSelect=(id)=>{
    setSelectedFleetId(id);if(!id){setForm(empty);return}
    const fv=fleet.find(f=>String(f.id)===String(id))
    if(fv)setForm(f=>({...f,plate:fv.plate||'',make:fv.make||'',model:fv.model||'',year:fv.year||new Date().getFullYear(),color:fv.color||'',type:fv.type||'Sedan',mileage:fv.mileage||0,driverName:fv.driverName||'',driverPhone:fv.driverPhone||''}))
  }
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{maxWidth:560}}>
        <div className="modal-header"><div className="modal-title">{vehicle?'Edit Vehicle':'Register New Vehicle'}</div><X onClick={onClose}/></div>
        <div className="modal-body">
          {!vehicle&&fleet.length>0&&(
            <div className="form-group" style={{marginBottom:20}}>
              <label className="form-label" style={{color:'var(--blue)'}}>Pre-fill from Fleet (optional)</label>
              <select className="form-input" style={{appearance:'auto'}} value={selectedFleetId} onChange={e=>handleFleetSelect(e.target.value)}>
                <option value="">— Type manually —</option>
                {fleet.map(v=><option key={v.id} value={v.id}>{v.plate} — {v.make} {v.model}</option>)}
              </select>
            </div>
          )}
          <div className="form-row" style={{marginBottom:14}}>
            <div><label className="form-label">Plate *</label><input className="form-input" value={form.plate} onChange={e=>s('plate',e.target.value.toUpperCase())} onKeyDown={onlyPlate} placeholder="KCA 123A"/></div>
            <div><label className="form-label">Status</label><select className="form-input" style={{appearance:'auto'}} value={form.status} onChange={e=>s('status',e.target.value)}>{['Ready','In_Service','Awaiting_Parts','Completed'].map(x=><option key={x}>{x}</option>)}</select></div>
          </div>
          <div className="form-row" style={{marginBottom:14}}>
            <div><label className="form-label">Make *</label><input className="form-input" value={form.make} onChange={e=>s('make',e.target.value)} onKeyDown={onlyLetters} placeholder="Toyota"/></div>
            <div><label className="form-label">Model *</label><input className="form-input" value={form.model} onChange={e=>s('model',e.target.value)} placeholder="Hilux"/></div>
          </div>
          <div className="form-row" style={{marginBottom:14}}>
            <div><label className="form-label">Year</label><input className="form-input" type="number" value={form.year} onChange={e=>s('year',e.target.value)} onKeyDown={onlyNumbers}/></div>
            <div><label className="form-label">Color</label><input className="form-input" value={form.color} onChange={e=>s('color',e.target.value)} onKeyDown={onlyLetters} placeholder="White"/></div>
          </div>
          <div className="form-row" style={{marginBottom:14}}>
            <div><label className="form-label">Type</label><select className="form-input" style={{appearance:'auto'}} value={form.type} onChange={e=>s('type',e.target.value)}>{['Sedan','SUV','Pickup Truck','Van','Minibus','Truck','Motorcycle'].map(t=><option key={t}>{t}</option>)}</select></div>
            <div><label className="form-label">Mileage (km)</label><input className="form-input" type="number" value={form.mileage} onChange={e=>s('mileage',e.target.value)}/></div>
          </div>
          <div className="form-row">
            <div><label className="form-label">Driver Name *</label><input className="form-input" value={form.driverName} onChange={e=>s('driverName',e.target.value)} onKeyDown={onlyLetters} placeholder="Full name"/></div>
            <div><label className="form-label">Driver Phone *</label><input className="form-input" value={form.driverPhone} onChange={e=>s('driverPhone',e.target.value)} onKeyDown={onlyNumbers} placeholder="0788000000"/></div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-success" onClick={()=>{
            if(!form.plate||!form.make||!form.model||(!vehicle&&(!form.driverName||!form.driverPhone))){alert('Required fields missing');return}
            onSave(form)
          }}>{vehicle?'Save Changes':'Register Vehicle'}</button>
        </div>
      </div>
    </div>
  )
}


function FleetModal({ vehicle, onSave, onClose }) {
  const empty={plate:'',make:'',model:'',cardNumber:'',year:new Date().getFullYear(),color:'',type:'Sedan',mileage:0,driverName:'',driverPhone:'',companyDepartment:'--Please Select--',insuranceCompany:'',insuranceNumber:'',insuranceExpiry:'',inspectionIssuedDate:'',inspectionExpiry:'',speedGovernorExpiry:'',driverLicenseExpiry:'',status:'Active'}
  const [form, setForm] = useState(vehicle||empty)
  const s=(k,v)=>setForm(f=>({...f,[k]:v}))
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{maxWidth:580}}>
        <div className="modal-header"><div className="modal-title">{vehicle?'Edit Fleet Vehicle':'Add Fleet Vehicle'}</div><X onClick={onClose}/></div>
        <div className="modal-body">
          <div className="form-row" style={{marginBottom:14}}>
            <div><label className="form-label">Plate *</label><input className="form-input" value={form.plate} onChange={e=>s('plate',e.target.value.toUpperCase())} onKeyDown={onlyPlate} placeholder="RAA 001A"/></div>
            <div><label className="form-label">Status</label><select className="form-input" style={{appearance:'auto'}} value={form.status} onChange={e=>s('status',e.target.value)}>{['Active','In_Maintenance','Out_of_Service'].map(x=><option key={x}>{x}</option>)}</select></div>
          </div>
          <div className="form-row" style={{marginBottom:14}}>
            <div><label className="form-label">Make *</label><input className="form-input" value={form.make} onChange={e=>s('make',e.target.value)} onKeyDown={onlyLetters} placeholder="Toyota"/></div>
            <div><label className="form-label">Model *</label><input className="form-input" value={form.model} onChange={e=>s('model',e.target.value)} placeholder="Hilux"/></div>
          </div>
          <div className="form-row" style={{marginBottom:14}}>
            <div><label className="form-label">Card Number *</label><input className="form-input" value={form.cardNumber} onChange={e=>s('cardNumber',e.target.value.toUpperCase())} style={{fontFamily:'DM Mono,monospace'}}/></div>
            <div><label className="form-label">Department *</label><select className="form-input" style={{appearance:'auto'}} value={form.companyDepartment} onChange={e=>s('companyDepartment',e.target.value)}>{['--Please Select--','Blue_Band','Colgate','OXI','Nestle','Indomie','Delivery','Kenafrica','Hardware','Phantom','Evy_baby','Wine & Spirit','Private'].map(x=><option key={x}>{x}</option>)}</select></div>
          </div>
          <div className="form-row" style={{marginBottom:14}}>
            <div><label className="form-label">Year</label><input className="form-input" type="number" value={form.year} onChange={e=>s('year',e.target.value)}/></div>
            <div><label className="form-label">Color</label><input className="form-input" value={form.color} onChange={e=>s('color',e.target.value)} onKeyDown={onlyLetters} placeholder="White"/></div>
          </div>
          <div className="form-row" style={{marginBottom:14}}>
            <div><label className="form-label">Driver Name *</label><input className="form-input" value={form.driverName} onChange={e=>s('driverName',e.target.value)} onKeyDown={onlyLetters} placeholder="Full name"/></div>
            <div><label className="form-label">Driver Phone *</label><input className="form-input" value={form.driverPhone} onChange={e=>s('driverPhone',e.target.value)} onKeyDown={onlyNumbers} placeholder="0788000000"/></div>
          </div>
          <div style={{fontSize:11,fontWeight:800,color:'var(--text3)',textTransform:'uppercase',margin:'18px 0 12px',paddingBottom:8,borderBottom:'1px solid var(--border)'}}>Documents</div>
          <div className="form-row" style={{marginBottom:14}}>
            <div><label className="form-label">Insurance Company *</label><input className="form-input" value={form.insuranceCompany} onChange={e=>s('insuranceCompany',e.target.value)}/></div>
            <div><label className="form-label">Insurance Number *</label><input className="form-input" value={form.insuranceNumber} onChange={e=>s('insuranceNumber',e.target.value)}/></div>
          </div>
          {[
            {label:'Insurance Expiry *',key:'insuranceExpiry'},
            {label:'Inspection Expiry *',key:'inspectionExpiry'},
            {label:'Speed Governor Expiry *',key:'speedGovernorExpiry'},
            {label:'Driver License Expiry *',key:'driverLicenseExpiry'},
          ].map(doc=>(
            <div key={doc.key} style={{marginBottom:12}}>
              <label className="form-label">{doc.label}</label>
              <input className="form-input" type="date" value={form[doc.key]||''} onChange={e=>s(doc.key,e.target.value)}/>
            </div>
          ))}
          {[
            {label:'Insurance File',fileKey:'insuranceFile'},
            {label:'Inspection File',fileKey:'inspectionFile'},
            {label:'Speed Governor File',fileKey:'speedGovernorFile'},
            {label:'Driver License File',fileKey:'driverLicenseFile'},
            {label:'Yellow Card File',fileKey:'yellowCardFile'},
          ].map(doc=>(
            <div key={doc.fileKey} style={{marginBottom:12,display:'flex',alignItems:'center',gap:10}}>
              <label style={{display:'inline-flex',alignItems:'center',gap:8,padding:'8px 14px',background:form[doc.fileKey]?'#f0fdf4':'var(--blue)',color:form[doc.fileKey]?'var(--green)':'#fff',border:form[doc.fileKey]?'1px solid #86efac':'none',borderRadius:8,cursor:'pointer',fontSize:12,fontWeight:700,whiteSpace:'nowrap',flexShrink:0}}>
                {form[doc.fileKey]?`✓ ${doc.label}`:`+ ${doc.label}`}
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{display:'none'}} onChange={async e=>{const file=e.target.files[0];if(!file)return;const c=await compressFile(file);s(doc.fileKey,c.data);s(doc.fileKey+'Name',c.name)}}/>
              </label>
              {form[doc.fileKey]&&<button onClick={()=>viewFile(form[doc.fileKey],doc.label)} style={{fontSize:12,color:'var(--blue)',background:'none',border:'none',cursor:'pointer',fontWeight:700,textDecoration:'underline'}}>View</button>}
              {form[doc.fileKey]&&<button onClick={()=>{s(doc.fileKey,'');s(doc.fileKey+'Name','')}} style={{fontSize:12,color:'var(--red)',background:'none',border:'none',cursor:'pointer',fontWeight:700}}>✕</button>}
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-blue" onClick={()=>{
            if(!form.plate||!form.make||!form.model||!form.cardNumber||!form.driverName||!form.driverPhone||!form.insuranceExpiry||!form.inspectionExpiry||!form.speedGovernorExpiry||!form.driverLicenseExpiry){alert('Please fill all required fields');return}
            if(!form.companyDepartment||form.companyDepartment==='--Please Select--'){alert('Select a department');return}
            onSave(form)
          }}>{vehicle?'Save Changes':'Add Vehicle'}</button>
        </div>
      </div>
    </div>
  )
}


function VehicleDetail({ vehicle, user, onBack, onUpdate }) {
  const [showService, setShowService] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [history, setHistory] = useState([])
  const ss=STATUS_STYLE[vehicle.status]||STATUS_STYLE['Ready']
  const canEdit=user.role==='manager'||user.role==='supervisor'||hasPerm(user,'Vehicles','edit')
  const totalSpend=history.reduce((s,h)=>s+(h.cost||0),0)
  useEffect(()=>{api.get(`/vehicles/${vehicle.id}/history`).then(r=>setHistory(Array.isArray(r.data)?r.data:[]))},[vehicle.id])
  const addService=async(entry)=>{
    try{await api.post(`/vehicles/${vehicle.id}/history`,entry);const r=await api.get(`/vehicles/${vehicle.id}`);const h=await api.get(`/vehicles/${vehicle.id}/history`);onUpdate({...r.data,serviceHistory:h.data});setShowService(false)}
    catch{alert('Failed to log service')}
  }
  const saveEdit=async(data)=>{
    try{const r=await api.put(`/vehicles/${vehicle.id}`,data);await logAudit(user,'EDIT','Garage Vehicles',`Edited: ${data.plate}`);onUpdate(r.data);setShowEdit(false)}
    catch{alert('Failed to update')}
  }
  const deleteVehicle=async()=>{
    if(!window.confirm('Delete this vehicle?'))return
    try{await api.delete(`/vehicles/${vehicle.id}`);await logAudit(user,'DELETE','Garage Vehicles',`Deleted: ${vehicle.plate}`);onBack()}catch{alert('Failed to delete')}
  }
  return (
    <>
      <div className="page-header">
        <div>
          <button onClick={onBack} style={{background:'none',border:'none',color:'var(--text2)',cursor:'pointer',fontFamily:'Nunito,sans-serif',fontSize:14,marginBottom:10,padding:0,fontWeight:600}}>← Back</button>
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
          {user.role==='manager'&&<button className="btn btn-sm" style={{background:'var(--red)',color:'#fff',border:'none'}} onClick={deleteVehicle}>Delete</button>}
          {(user.role==='manager'||hasPerm(user,'Vehicles','add'))&&<button className="btn btn-blue btn-sm" onClick={()=>setShowService(true)}>+ Log Service</button>}
        </div>
      </div>
      <div className="page-content">
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
          {[['Services',history.length,'All time'],['Spend',totalSpend.toLocaleString(),'RWF'],['Mileage',Number(vehicle.mileage||0).toLocaleString(),'km'],['Year',vehicle.year,vehicle.color]].map(([l,v,sub])=>(
            <div key={l} className="card" style={{padding:16}}>
              <div style={{fontSize:12,color:'var(--text2)',marginBottom:6,fontWeight:600}}>{l}</div>
              <div style={{fontSize:20,fontWeight:800}}>{v}</div>
              <div style={{fontSize:11,color:'var(--text3)',marginTop:3}}>{sub}</div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Service History</div><span style={{fontSize:12,color:'var(--text2)',fontWeight:600}}>{history.length} records</span></div>
          {history.length===0?<div style={{padding:48,textAlign:'center',color:'var(--text3)'}}>No service records yet</div>
            :[...history].reverse().map(h=>(
              <div key={h.id} style={{padding:'14px 20px',borderBottom:'1px solid var(--border)',display:'flex',gap:14}}>
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


function VehiclesPage({ user, initialEditVehicle, onInitialEditDone, initialSelectedVehicle, onInitialSelectedDone }) {
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
  const [docsVehicle, setDocsVehicle] = useState(null)
  const [showInspModal, setShowInspModal] = useState(false)
  const [inspVehicle, setInspVehicle] = useState(null)
  const [inspForm, setInspForm] = useState({inspectionIssuedDate:'',inspectionExpiry:''})
  const [showInsuranceModal, setShowInsuranceModal] = useState(false)
  const [insuranceVehicle, setInsuranceVehicle] = useState(null)
  const [insuranceForm, setInsuranceForm] = useState({insuranceCompany:'',insuranceNumber:'',insuranceExpiry:''})
  const [showDriverModal, setShowDriverModal] = useState(false)
  const [driverVehicle, setDriverVehicle] = useState(null)
  const [driverForm, setDriverForm] = useState({driverName:'',driverPhone:''})

  const canAdd=user.role==='manager'||hasPerm(user,'Vehicles','add')
  const canEdit=user.role==='manager'||hasPerm(user,'Vehicles','edit')

  useEffect(()=>{fetchVehicles();fetchFleet()},[])
  useEffect(()=>{ if(initialEditVehicle&&fleet.length>0){ setTab('fleet'); setEditFleet(initialEditVehicle); setShowAddFleet(true); if(onInitialEditDone)onInitialEditDone() } },[initialEditVehicle,fleet])
  useEffect(()=>{ if(initialSelectedVehicle&&vehicles.length>0){ setTab('garage'); setSelected(initialSelectedVehicle); if(onInitialSelectedDone)onInitialSelectedDone() } },[initialSelectedVehicle,vehicles])
  const fetchVehicles=async()=>{try{const r=await api.get('/vehicles');setVehicles(Array.isArray(r.data)?r.data:r.data?.content||[])}catch{alert('Failed to load vehicles')}setLoading(false)}
  const fetchFleet=async()=>{try{const r=await api.get('/fleet');setFleet(Array.isArray(r.data)?r.data:r.data?.content||[])}catch(e){console.error(e)}}
  const addVehicle=async(data)=>{try{await api.post('/vehicles',data);await logAudit(user,'ADD','Garage Vehicles',`Registered: ${data.plate}`);fetchVehicles();setShowAdd(false)}catch{alert('Failed')}}
  const addFleetVehicle=async(data)=>{
    try{
      const norm=data.plate?.replace(/[\s\-]/g,'').toUpperCase()
      const dup=fleet.find(v=>{if(editFleet&&v.id===editFleet.id)return false;return v.plate?.replace(/[\s\-]/g,'').toUpperCase()===norm})
      if(dup){alert(`Plate "${data.plate}" already in fleet.`);return}
      if(editFleet){await api.put(`/fleet/${editFleet.id}`,data);await logAudit(user,'EDIT','Fleet Vehicles',`Edited: ${data.plate}`)}
      else{await api.post('/fleet',data);await logAudit(user,'ADD','Fleet Vehicles',`Added: ${data.plate}`)}
      fetchFleet();setShowAddFleet(false);setEditFleet(null)
    }catch(err){alert('Failed to save: '+(err?.response?.data?.message||err?.message||'Unknown error'))}
  }
  const updateVehicle=(u)=>{setVehicles(p=>p.map(v=>v.id===u.id?u:v));setSelected(u)}
  const openInsuranceModal=(v)=>{setInsuranceVehicle(v);setInsuranceForm({insuranceCompany:v.insuranceCompany||'',insuranceNumber:v.insuranceNumber||'',insuranceExpiry:v.insuranceExpiry||''});setShowInsuranceModal(true)}
  const handleUpdateInsurance=async()=>{
    if(!insuranceVehicle||!insuranceForm.insuranceExpiry){alert('Insurance Expiry required');return}
    try{await api.put(`/fleet/${insuranceVehicle.id}`,{...insuranceVehicle,...insuranceForm});await logAudit(user,'EDIT','Fleet Vehicles',`Updated insurance: ${insuranceVehicle.plate}`);fetchFleet();setShowInsuranceModal(false)}
    catch{alert('Failed to update insurance')}
  }
  const openInspModal=(v)=>{setInspVehicle(v);setInspForm({inspectionIssuedDate:v.inspectionIssuedDate||'',inspectionExpiry:v.inspectionExpiry||''});setShowInspModal(true)}
  const handleUpdateInspection=async()=>{
    if(!inspVehicle)return
    try{await api.put(`/fleet/${inspVehicle.id}`,{...inspVehicle,...inspForm});await logAudit(user,'EDIT','Fleet Vehicles',`Updated inspection: ${inspVehicle.plate}`);fetchFleet();setShowInspModal(false)}
    catch{alert('Failed to update inspection')}
  }
  const openDriverModal=(v)=>{setDriverVehicle(v);setDriverForm({driverName:v.driverName||'',driverPhone:v.driverPhone||''});setShowDriverModal(true)}
  const handleUpdateDriver=async()=>{
    if(!driverVehicle||!driverForm.driverName||!driverForm.driverPhone){alert('Driver Name and Phone required');return}
    try{
      await api.put(`/fleet/${driverVehicle.id}`,{...driverVehicle,driverName:driverForm.driverName,driverPhone:driverForm.driverPhone})
      await logAudit(user,'EDIT','Fleet Vehicles',`Updated driver: ${driverVehicle.plate}`)
      fetchFleet();setShowDriverModal(false)
    }catch{alert('Failed to update driver')}
  }
  const filtered=(vehicles||[]).filter(v=>{const q=search.toLowerCase();return(filter==='All'||v.status===filter)&&(!q||v.plate?.toLowerCase().includes(q)||v.make?.toLowerCase().includes(q)||v.model?.toLowerCase().includes(q))})

  if(selected) return <VehicleDetail vehicle={selected} user={user} onBack={()=>setSelected(null)} onUpdate={updateVehicle}/>

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Vehicles</div><div className="page-sub">{tab==='garage'?`${vehicles.length} garage vehicles`:`${fleet.length} fleet vehicles`}</div></div>
        <div className="page-actions">
          {tab==='garage'&&canAdd&&<button className="btn btn-success btn-sm" onClick={()=>setShowAdd(true)}>+ Register</button>}
          {tab==='fleet'&&canAdd&&<button className="btn btn-blue btn-sm" onClick={()=>{setEditFleet(null);setShowAddFleet(true)}}>+ Add Fleet</button>}
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
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:16}}>
              {Object.entries(STATUS_STYLE).map(([status,ss])=>(
                <div key={status} className="card" style={{padding:'12px 14px',cursor:'pointer',borderColor:filter===status?ss.dot:undefined}} onClick={()=>setFilter(filter===status?'All':status)}>
                  <div style={{fontSize:11,color:'var(--text2)',marginBottom:4,fontWeight:600}}>{status.replace('_',' ')}</div>
                  <div style={{fontSize:22,fontWeight:800,color:ss.dot}}>{vehicles.filter(v=>v.status===status).length}</div>
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap'}}>
              <input className="form-input" style={{flex:1,minWidth:160}} placeholder="Search plate, make..." value={search} onChange={e=>setSearch(e.target.value)}/>
              <select className="form-input" style={{width:150,appearance:'auto'}} value={filter} onChange={e=>setFilter(e.target.value)}>
                <option value="All">All Status</option>{Object.keys(STATUS_STYLE).map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            {loading?<div style={{textAlign:'center',padding:48,color:'var(--text3)'}}>Loading...</div>:filtered.length===0?<div className="card" style={{padding:48,textAlign:'center',color:'var(--text3)'}}>No vehicles found</div>:(
              <div className="card">
                <div className="card-header"><div className="card-title">Garage Vehicles</div><span style={{fontSize:12,color:'var(--text2)',fontWeight:600}}>{filtered.length} vehicles</span></div>
                <div className="table-wrap">
                  <table className="table">
                    <thead><tr><th>Plate</th><th>Make / Model</th><th className="hide-mobile">Year</th><th>Status</th><th className="hide-mobile">Services</th><th>Actions</th></tr></thead>
                    <tbody>
                      {filtered.map(v=>{const ss=STATUS_STYLE[v.status]||STATUS_STYLE['Ready'];return(
                        <tr key={v.id} style={{cursor:'pointer'}} onClick={()=>setSelected(v)}>
                          <td style={{fontFamily:'DM Mono,monospace',color:'var(--blue)',fontWeight:700}}>{v.plate}</td>
                          <td><div style={{fontWeight:700,fontSize:13}}>{v.make} {v.model}</div></td>
                          <td className="hide-mobile">{v.year}</td>
                          <td><span style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:11,fontWeight:700,borderRadius:20,padding:'3px 9px',background:ss.bg,color:ss.color}}><span style={{width:5,height:5,borderRadius:'50%',background:ss.dot,display:'inline-block'}}/>{v.status?.replace('_',' ')}</span></td>
                          <td className="hide-mobile">{(v.serviceHistory||[]).length}</td>
                          <td onClick={e=>e.stopPropagation()}><button className="btn btn-ghost btn-sm" onClick={()=>setSelected(v)}>View</button></td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
        {tab==='fleet'&&(()=>{
          const fq=fleetSearch.toLowerCase()
          const filteredFleet=fleet.filter(v=>!fq||v.plate?.toLowerCase().includes(fq)||v.driverName?.toLowerCase().includes(fq)||v.make?.toLowerCase().includes(fq))
          return(
            <>
              <div style={{marginBottom:16}}><input className="form-input" placeholder="Search plate or driver..." value={fleetSearch} onChange={e=>setFleetSearch(e.target.value)} style={{maxWidth:420}}/></div>
              {filteredFleet.length===0?<div className="card" style={{padding:48,textAlign:'center',color:'var(--text3)'}}>No fleet vehicles</div>:(
                <div className="card">
                  <div className="card-header"><div className="card-title">Fleet Vehicles</div><span style={{fontSize:12,color:'var(--text2)',fontWeight:600}}>{filteredFleet.length} vehicles</span></div>
                  <div className="table-wrap">
                    <table className="table">
                      <thead><tr><th>Plate</th><th>Make/Model</th><th>Status</th><th>Driver</th><th className="hide-mobile">Ins. Expiry</th><th>Actions</th></tr></thead>
                      <tbody>
                        {filteredFleet.map(v=>{
                          const ss=FLEET_STATUS[v.status]||FLEET_STATUS['Active']
                          const insExpired=v.insuranceExpiry&&new Date(v.insuranceExpiry)<new Date()
                          return(
                            <tr key={v.id}>
                              <td style={{fontFamily:'DM Mono,monospace',color:'var(--blue)',fontWeight:700}}>{v.plate}</td>
                              <td style={{fontWeight:600}}>{v.make} {v.model}</td>
                              <td><span style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:11,fontWeight:700,borderRadius:20,padding:'3px 9px',background:ss.bg,color:ss.color}}><span style={{width:5,height:5,borderRadius:'50%',background:ss.dot,display:'inline-block'}}/>{v.status?.replace('_',' ')}</span></td>
                              <td style={{fontWeight:600,fontSize:13}}>{v.driverName||'—'}</td>
                              <td className="hide-mobile" style={{color:insExpired?'var(--red)':'var(--text2)',fontWeight:insExpired?700:400}}>{v.insuranceExpiry||'—'}</td>
                              <td><div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                                {canEdit&&<><button className="btn btn-ghost btn-sm" style={{color:'var(--blue)',borderColor:'var(--blue)'}} onClick={e=>{e.stopPropagation();openInsuranceModal(v)}}>Ins.</button>
                                <button className="btn btn-ghost btn-sm" style={{color:'var(--green)',borderColor:'var(--green)'}} onClick={e=>{e.stopPropagation();openInspModal(v)}}>Insp.</button>
                                <button className="btn btn-ghost btn-sm" style={{color:'#7c3aed',borderColor:'#7c3aed'}} onClick={e=>{e.stopPropagation();openDriverModal(v)}}>Driver</button></>}
                                <button className="btn btn-ghost btn-sm" style={{color:'#0891b2',borderColor:'#0891b2'}} onClick={e=>{e.stopPropagation();setDocsVehicle(v)}}>Docs</button>
                                {canEdit&&<button className="btn btn-ghost btn-sm" onClick={e=>{e.stopPropagation();setEditFleet(v);setShowAddFleet(true)}}>Edit</button>}
                                {user.role==='manager'&&<button className="btn btn-danger btn-sm" onClick={async e=>{e.stopPropagation();if(!window.confirm('Delete this fleet vehicle?'))return;try{await api.delete(`/fleet/${v.id}`);await logAudit(user,'DELETE','Fleet Vehicles',`Deleted: ${v.plate}`);fetchFleet()}catch{alert('Failed')}}}>Del</button>}
                              </div></td>
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
        })()}
      </div>
      {showAdd&&<VehicleModal onSave={addVehicle} onClose={()=>setShowAdd(false)}/>}
      {showAddFleet&&<FleetModal vehicle={editFleet} onSave={addFleetVehicle} onClose={()=>{setShowAddFleet(false);setEditFleet(null)}}/>}
      {docsVehicle&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setDocsVehicle(null)}>
          <div className="modal" style={{maxWidth:500}}>
            <div className="modal-header"><div><div className="modal-title">Documents — {docsVehicle.plate}</div><div style={{fontSize:12,color:'var(--text2)',marginTop:2}}>{docsVehicle.make} {docsVehicle.model}</div></div><X onClick={()=>setDocsVehicle(null)}/></div>
            <div className="modal-body">
              {[
                {label:'Insurance',file:docsVehicle.insuranceFile,expiry:docsVehicle.insuranceExpiry},
                {label:'Inspection',file:docsVehicle.inspectionFile,expiry:docsVehicle.inspectionExpiry},
                {label:'Speed Governor',file:docsVehicle.speedGovernorFile,expiry:docsVehicle.speedGovernorExpiry},
                {label:'Driver License',file:docsVehicle.driverLicenseFile,expiry:docsVehicle.driverLicenseExpiry},
                {label:'Yellow Card',file:docsVehicle.yellowCardFile,expiry:null},
              ].map(doc=>{
                const days=doc.expiry?getDaysUntil(doc.expiry):null
                const isExpired=days!==null&&days<0;const isWarning=days!==null&&days<=7&&days>=0
                return(
                  <div key={doc.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid var(--border)',gap:12,flexWrap:'wrap'}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:700}}>{doc.label}</div>
                      {doc.expiry&&<div style={{fontSize:11,color:isExpired?'var(--red)':isWarning?'#92400e':'var(--text3)',fontWeight:isExpired||isWarning?700:400,marginTop:2}}>Expires: {doc.expiry} {isExpired?`(Expired)`:isWarning?`(${days}d left)`:''}</div>}
                    </div>
                    {doc.file?(<button className="btn btn-blue btn-sm" onClick={()=>viewFile(doc.file,doc.label)}>View</button>):(<span style={{fontSize:12,color:'var(--text3)',fontStyle:'italic'}}>No file</span>)}
                  </div>
                )
              })}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setDocsVehicle(null)}>Close</button>
              {canEdit&&<button className="btn btn-blue" onClick={()=>{setDocsVehicle(null);setEditFleet(docsVehicle);setShowAddFleet(true)}}>Edit Vehicle</button>}
            </div>
          </div>
        </div>
      )}
      {showInspModal&&inspVehicle&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowInspModal(false)}>
          <div className="modal" style={{maxWidth:420}}>
            <div className="modal-header"><div><div className="modal-title">Update Inspection</div><div style={{fontSize:12,color:'var(--text2)'}}>{inspVehicle.plate}</div></div><X onClick={()=>setShowInspModal(false)}/></div>
            <div className="modal-body">
              <div className="form-row">
                <div><label className="form-label">Issued Date</label><input className="form-input" type="date" value={inspForm.inspectionIssuedDate} onChange={e=>setInspForm(f=>({...f,inspectionIssuedDate:e.target.value}))}/></div>
                <div><label className="form-label">New Expiry *</label><input className="form-input" type="date" value={inspForm.inspectionExpiry} onChange={e=>setInspForm(f=>({...f,inspectionExpiry:e.target.value}))}/></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setShowInspModal(false)}>Cancel</button>
              <button className="btn btn-success" onClick={handleUpdateInspection} disabled={!inspForm.inspectionExpiry}>Save</button>
            </div>
          </div>
        </div>
      )}
      {showInsuranceModal&&insuranceVehicle&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowInsuranceModal(false)}>
          <div className="modal" style={{maxWidth:420}}>
            <div className="modal-header"><div><div className="modal-title">Update Insurance</div><div style={{fontSize:12,color:'var(--text2)'}}>{insuranceVehicle.plate}</div></div><X onClick={()=>setShowInsuranceModal(false)}/></div>
            <div className="modal-body">
              <div className="form-group"><label className="form-label">Insurance Company</label><input className="form-input" value={insuranceForm.insuranceCompany} onChange={e=>setInsuranceForm(f=>({...f,insuranceCompany:e.target.value}))}/></div>
              <div className="form-group"><label className="form-label">Insurance Number</label><input className="form-input" value={insuranceForm.insuranceNumber} onChange={e=>setInsuranceForm(f=>({...f,insuranceNumber:e.target.value}))}/></div>
              <div className="form-row">
                <div><label className="form-label">Issued Date</label><input className="form-input" type="date" value={insuranceForm.insuranceIssuedDate||''} onChange={e=>setInsuranceForm(f=>({...f,insuranceIssuedDate:e.target.value}))}/></div>
                <div><label className="form-label">New Expiry *</label><input className="form-input" type="date" value={insuranceForm.insuranceExpiry} onChange={e=>setInsuranceForm(f=>({...f,insuranceExpiry:e.target.value}))}/></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setShowInsuranceModal(false)}>Cancel</button>
              <button className="btn btn-blue" onClick={handleUpdateInsurance} disabled={!insuranceForm.insuranceExpiry}>Save</button>
            </div>
          </div>
        </div>
      )}
      {showDriverModal&&driverVehicle&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowDriverModal(false)}>
          <div className="modal" style={{maxWidth:420}}>
            <div className="modal-header"><div><div className="modal-title">Update Driver</div><div style={{fontSize:12,color:'var(--text2)'}}>{driverVehicle.plate}</div></div><X onClick={()=>setShowDriverModal(false)}/></div>
            <div className="modal-body">
              <div className="form-group"><label className="form-label">Driver Name *</label><input className="form-input" value={driverForm.driverName} onChange={e=>setDriverForm(f=>({...f,driverName:e.target.value}))} onKeyDown={onlyLetters} placeholder="Full name"/></div>
              <div className="form-group"><label className="form-label">Driver Phone *</label><input className="form-input" value={driverForm.driverPhone} onChange={e=>setDriverForm(f=>({...f,driverPhone:e.target.value}))} onKeyDown={onlyNumbers} placeholder="0788000000"/></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setShowDriverModal(false)}>Cancel</button>
              <button className="btn" style={{background:'#7c3aed',color:'#fff'}} onClick={handleUpdateDriver} disabled={!driverForm.driverName||!driverForm.driverPhone}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


export default function App() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [alertCount, setAlertCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [alertEditVehicle, setAlertEditVehicle] = useState(null)
  const [selectedGarageVehicle, setSelectedGarageVehicle] = useState(null)

  useEffect(()=>{
    const stored=localStorage.getItem('user')
    const token=localStorage.getItem('token')
    if(stored&&token){
      try{
        const parsedUser=JSON.parse(stored)
        setUser(parsedUser)
        fetch('https://garage-eri-production.up.railway.app/api/auth/me',{headers:{'Authorization':'Bearer '+token}})
          .then(r=>{if(r.ok)return r.json();throw new Error('me failed')})
          .then(data=>{if(data&&data.id){setUser(data);localStorage.setItem('user',JSON.stringify(data))}})
          .catch(()=>{})
      }catch(e){localStorage.removeItem('user');localStorage.removeItem('token')}
    }
  },[])

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
            {activeTab==='alerts'&&<AlertsDashboard onAlertsChange={setAlertCount} onNavigate={handleTabChange} onEditVehicle={v=>{setAlertEditVehicle(v);handleTabChange('vehicles')}}/>}
            {activeTab==='vehicles'&&(user.role==='manager'||hasPerm(user,'Vehicles','view'))&&<VehiclesPage user={user} initialEditVehicle={alertEditVehicle} onInitialEditDone={()=>setAlertEditVehicle(null)} initialSelectedVehicle={selectedGarageVehicle} onInitialSelectedDone={()=>setSelectedGarageVehicle(null)}/>}
            {activeTab==='fuel'&&(user.role==='manager'||hasPerm(user,'Fuel Logs','view'))&&<FuelLogsPage user={user}/>}
            {activeTab==='inventory'&&(user.role==='manager'||hasPerm(user,'Inventory','view'))&&<InventoryPage user={user}/>}
            {activeTab==='staff'&&user.role==='manager'&&<StaffPage/>}
            {activeTab==='expenses'&&(user.role==='manager'||hasPerm(user,'Expenses','view'))&&<ExpensesPage user={user}/>}
            {activeTab==='audit'&&user.role==='manager'&&<AuditLogPage/>}
            {activeTab==='reports'&&user.role==='manager'&&<ReportsPage/>}
          </div>
        </div>
      )}
    </>
  )
}