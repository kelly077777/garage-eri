import { useState, useEffect } from 'react'
import api from './api/client'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #f4f5f7; --surface: #ffffff; --surface2: #f0f1f4; --surface3: #e8eaef;
    --border: #e2e4ea; --text: #111318; --text2: #5a5f72; --text3: #9096ab;
    --accent: #0a0909; --accent2: #f5a623; --blue: #2563eb; --green: #059669; --red: #dc2626;
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
  .app { display: flex; min-height: 100vh; }
  .sidebar { width: 240px; background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; flex-shrink: 0; position: sticky; top: 0; height: 100vh; overflow-y: auto; box-shadow: 2px 0 8px rgba(0,0,0,0.04); }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; font-size: 14px; color: var(--text2); cursor: pointer; transition: all 0.15s; font-weight: 600; border: none; background: none; width: 100%; text-align: left; font-family: 'Nunito', sans-serif; }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: rgba(37,99,235,0.08); color: var(--blue); }
  .main { flex: 1; overflow-y: auto; background: var(--bg); }
  .page-header { padding: 28px 32px 0; display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
  .page-title { font-family: 'Nunito', 'Calibri Light', Calibri, sans-serif; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; color: var(--text); }
  .page-sub { color: var(--text2); font-size: 14px; margin-top: 4px; font-weight: 500; }
  .page-content { padding: 0 32px 32px; }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
  .card-header { padding: 18px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .card-title { font-family: 'Nunito', 'Calibri Light', Calibri, sans-serif; font-size: 15px; font-weight: 800; color: var(--text); }
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 18px; border-radius: 8px; font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; border: none; transition: all 0.2s; }
  .btn-success { background: var(--green); color: #fff; } .btn-success:hover { background: #047857; }
  .btn-blue { background: var(--blue); color: #fff; } .btn-blue:hover { background: #1d4ed8; }
  .btn-accent { background: var(--accent); color: #fff; } .btn-accent:hover { background: #333; }
  .btn-ghost { background: transparent; color: var(--text2); border: 1px solid var(--border); } .btn-ghost:hover { background: var(--surface2); color: var(--text); }
  .btn-danger { background: rgba(220,38,38,0.07); color: var(--red); border: 1px solid rgba(220,38,38,0.15); }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; backdrop-filter: blur(2px); }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; width: 100%; max-width: 480px; animation: slideUp 0.2s ease; box-shadow: 0 8px 40px rgba(0,0,0,0.12); }
  .modal-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .modal-title { font-family: 'Nunito', 'Calibri Light', Calibri, sans-serif; font-size: 18px; font-weight: 800; color: var(--text); }
  .modal-body { padding: 24px; }
  .modal-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; gap: 10px; justify-content: flex-end; background: var(--surface2); border-radius: 0 0 16px 16px; }
  .table { width: 100%; border-collapse: collapse; }
  .table th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 800; color: var(--text3); text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid var(--border); background: var(--surface2); font-family: 'Nunito', sans-serif; }
  .table td { padding: 14px 16px; font-size: 14px; border-bottom: 1px solid var(--border); color: var(--text); font-family: 'Nunito', sans-serif; }
  .table tr:last-child td { border: none; }
  .table tr:hover td { background: var(--surface2); }
  .form-group { margin-bottom: 16px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
  .tab-btn { display: flex; align-items: center; gap: 8px; padding: 8px 18px; border-radius: 8px; border: none; font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
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

const X = ({ onClick }) => <button onClick={onClick} style={{ background: 'none', border: 'none', color: 'var(--text2)', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>×</button>

// ─── LOGIN ────────────────────────────────────────────────────────────────────
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
    } catch (err) { setError('Invalid email or password.') }
    setLoading(false)
  }
  return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', width:'100%', backgroundImage:'url(/Page.jpg)', backgroundSize:'cover', backgroundPosition:'center', position:'relative' }}>
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(10,15,30,0.82) 0%, rgba(20,30,60,0.75) 100%)', backdropFilter:'blur(1px)' }} />
      <div className="login-card" style={{ position:'relative', zIndex:1 }}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:36 }}>
          <div style={{ width:96, height:96, borderRadius:20, overflow:'hidden', marginBottom:18, boxShadow:'0 4px 20px rgba(0,0,0,0.18)', border:'3px solid rgba(255,255,255,0.15)', flexShrink:0 }}>
            <img src="/canvas.png" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          </div>
          <div style={{ fontFamily:'Nunito, Calibri Light, Calibri, sans-serif', fontSize:22, fontWeight:800, color:'var(--text)', textAlign:'center', letterSpacing:'-0.3px', lineHeight:1.3 }}>
            ERI-RWANDA<br/>
            <span style={{ color:'var(--blue)', fontSize:18 }}>Fleet Management System</span>
          </div>
        </div>
        {error && <div className="error-msg">{error}</div>}
        <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="you@garage.com" value={email} onChange={e => { setEmail(e.target.value); setError('') }} /></div>
        <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e => { setPassword(e.target.value); setError('') }} onKeyDown={e => e.key === 'Enter' && handleLogin()} /></div>
        <button className="btn-primary" onClick={handleLogin} disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
      </div>
    </div>
  )
}

// ─── EXPIRY HELPERS ───────────────────────────────────────────────────────────
function getDaysUntil(dateStr) {
  if (!dateStr) return null
  const diff = new Date(dateStr) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}
function getExpiryAlerts(fleet, warningDays = 7) {
  const alerts = []
  fleet.forEach(v => {
    const insDays = getDaysUntil(v.insuranceExpiry)
    const inspDays = getDaysUntil(v.inspectionExpiry)
    if (insDays !== null && insDays <= warningDays) {
      alerts.push({ id:`ins-${v.id}`, plate: v.plate, type:'Insurance', expiry: v.insuranceExpiry, days: insDays, expired: insDays < 0 })
    }
    if (inspDays !== null && inspDays <= warningDays) {
      alerts.push({ id:`insp-${v.id}`, plate: v.plate, type:'Inspection', expiry: v.inspectionExpiry, days: inspDays, expired: inspDays < 0 })
    }
  })
  return alerts
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ user, activeTab, setActiveTab, onLogout, alertCount }) {
  const rc = ROLE_CONFIG[user.role]
  const initials = user.name.split(' ').map(n => n[0]).join('')
  const N = (key, icon, label, badge) => (
    <button key={key} className={`nav-item ${activeTab === key ? 'active' : ''}`} onClick={() => setActiveTab(key)}>
      <span>{icon}</span> <span style={{ flex:1 }}>{label}</span>
      {badge > 0 && <span style={{ background:'#dc2626', color:'#fff', borderRadius:20, fontSize:10, fontWeight:800, padding:'2px 7px', minWidth:18, textAlign:'center' }}>{badge}</span>}
    </button>
  )
  return (
    <div className="sidebar">
      <div style={{ padding:'24px 16px 20px', borderBottom:'1px solid var(--border)', display:'flex', flexDirection:'column', alignItems:'center', gap:12, background:'#ffffff' }}>
        <div style={{ width:80, height:80, borderRadius:18, overflow:'hidden', border:'2px solid var(--border)', boxShadow:'0 2px 12px rgba(0,0,0,0.10)', flexShrink:0 }}>
          <img src="/canvas.png" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        </div>
        <div style={{ textAlign:'center', lineHeight:1.4 }}>
          <div style={{ fontFamily:'Nunito, Calibri Light, Calibri, sans-serif', fontSize:15, fontWeight:800, color:'var(--text)', letterSpacing:'0.01em' }}>ERI-RWANDA</div>
          <div style={{ fontSize:11, fontWeight:600, color:'var(--text2)' }}>Fleet Management</div>
        </div>
      </div>
      <nav style={{ flex:1, padding:'16px 10px', display:'flex', flexDirection:'column', gap:2 }}>
        <div style={{ padding:'8px 12px 6px', fontSize:10, fontWeight:800, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Main</div>
        {user.role === 'manager' && N('dashboard','📊','Dashboard', alertCount)}
        {(user.role === 'supervisor' || user.role === 'mechanic') && N('alerts','🔔','Alerts', alertCount)}
        {N('vehicles','🚗','Vehicles')}
        {user.role === 'manager' && N('fuel','⛽','Fuel Logs')}
        {N('inventory','📦','Inventory')}
        {user.role === 'manager' && N('staff','👥','Staff')}
        {user.role === 'manager' && N('expenses','💰','Expenses')}
        {user.role === 'manager' && N('reports','📋','Reports')}
      </nav>
      <div style={{ padding:16, borderTop:'1px solid var(--border)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:10, background:'var(--surface2)', borderRadius:10, marginBottom:10 }}>
          <div style={{ width:34, height:34, borderRadius:'50%', background:rc.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:13, color:'#fff', flexShrink:0 }}>{initials}</div>
          <div style={{ minWidth:0 }}><div style={{ fontSize:13, fontWeight:700, color:'var(--text)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user.name}</div><div style={{ fontSize:11, color:'var(--text2)' }}>{rc.label}</div></div>
        </div>
        <button onClick={onLogout} style={{ width:'100%', background:'transparent', border:'1px solid var(--border)', color:'var(--text2)', borderRadius:8, padding:8, fontSize:13, cursor:'pointer', fontFamily:'Nunito,sans-serif', fontWeight:600 }}>Sign Out →</button>
      </div>
    </div>
  )
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardPage({ onAlertsChange }) {
  const [d, setD] = useState({ vehicles:[], fleet:[], fuel:[], inventory:[], staff:[] })
  useEffect(() => {
    Promise.all([api.get('/vehicles'), api.get('/fleet'), api.get('/fleet/fuel/all'), api.get('/inventory'), api.get('/auth/users')])
      .then(([v,f,fuel,inv,s]) => {
        const fleetData = Array.isArray(f.data) ? f.data : f.data?.content || []
        setD({
          vehicles: Array.isArray(v.data) ? v.data : v.data?.content || [],
          fleet: fleetData,
          fuel: Array.isArray(fuel.data) ? fuel.data : fuel.data?.content || [],
          inventory: Array.isArray(inv.data) ? inv.data : inv.data?.content || [],
          staff: Array.isArray(s.data) ? s.data : s.data?.content || []
        })
        if (onAlertsChange) onAlertsChange(getExpiryAlerts(fleetData).length)
      }).catch(e => console.error(e))
  }, [])
  const totalFuelCost = (d.fuel||[]).reduce((s,f) => s+(f.totalCost||0), 0)
  const lowStock = (d.inventory||[]).filter(i => i.status==='Low_Stock'||i.status==='Out_of_Stock')
  const expiryAlerts = getExpiryAlerts(d.fleet)
  const stats = [
    { label:'Garage Vehicles', value:d.vehicles.length, sub:`${d.vehicles.filter(v=>v.status==='In_Service').length} in service`, color:'var(--blue)' },
    { label:'Fleet Vehicles', value:d.fleet.length, sub:`${d.fleet.filter(f=>f.status==='Active').length} active`, color:'var(--blue)' },
    { label:'Fuel Consumption', value:totalFuelCost.toLocaleString()+' RWF', sub:'All time', color:'var(--green)' },
    { label:'Staff Members', value:d.staff.length, sub:`${d.staff.filter(s=>s.role==='mechanic').length} mechanics`, color:'var(--text)' },
    { label:'Inventory Items', value:d.inventory.length, sub:`${lowStock.length} low/out of stock`, color:lowStock.length>0?'var(--red)':'var(--text)' },
  ]
  return (
    <>
      <div className="page-header"><div><div className="page-title">Dashboard</div><div className="page-sub">Overview of your garage operations</div></div></div>
      <div className="page-content">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24 }}>
          {stats.map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize:13, color:'var(--text2)', marginBottom:8, fontWeight:600 }}>{s.label}</div>
              <div style={{ fontFamily:'Nunito, Calibri Light, Calibri, sans-serif', fontSize:26, fontWeight:800, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:12, color:'var(--text3)', marginTop:4 }}>{s.sub}</div>
            </div>
          ))}
        </div>
        {expiryAlerts.length > 0 && (
          <div className="card" style={{ marginBottom:16, borderColor:'#fca5a5', borderWidth:1 }}>
            <div className="card-header" style={{ background:'#fff7f7' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:20 }}>🚨</span>
                <div className="card-title" style={{ color:'#dc2626' }}>Document Expiry Alerts</div>
              </div>
              <span style={{ fontSize:12, fontWeight:700, color:'#dc2626', background:'#fee2e2', borderRadius:20, padding:'3px 10px' }}>{expiryAlerts.length} alert{expiryAlerts.length>1?'s':''}</span>
            </div>
            <div>
              {expiryAlerts.map(a => (
                <div key={a.id} style={{ padding:'12px 20px', borderBottom:'1px solid #fee2e2', display:'flex', alignItems:'center', justifyContent:'space-between', background: a.expired ? '#fff5f5' : '#fffbeb' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <span style={{ fontSize:18 }}>{a.type==='Insurance' ? '🛡️' : '🔍'}</span>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700 }}>
                        <span style={{ fontFamily:'DM Mono,monospace', color:'var(--blue)' }}>{a.plate}</span>
                        <span style={{ color:'var(--text2)', marginLeft:8 }}>— {a.type}</span>
                      </div>
                      <div style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>Expires: {a.expiry}</div>
                    </div>
                  </div>
                  <span style={{ fontSize:12, fontWeight:800, borderRadius:20, padding:'4px 12px',
                    background: a.expired ? '#fee2e2' : '#fef3c7',
                    color: a.expired ? '#dc2626' : '#92400e' }}>
                    {a.expired ? `Expired ${Math.abs(a.days)}d ago` : a.days === 0 ? 'Expires TODAY' : `${a.days}d left`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
          <div className="card">
            <div className="card-header"><div className="card-title">Garage Vehicle Status</div></div>
            <div style={{ padding:20 }}>
              {Object.entries(STATUS_STYLE).map(([status, ss]) => {
                const count = d.vehicles.filter(v=>v.status===status).length
                const pct = d.vehicles.length ? Math.round(count/d.vehicles.length*100) : 0
                return (
                  <div key={status} style={{ marginBottom:14 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                      <span style={{ fontSize:13, color:'var(--text2)', fontWeight:600 }}>{status.replace('_',' ')}</span>
                      <span style={{ fontSize:13, fontWeight:700 }}>{count}</span>
                    </div>
                    <div style={{ height:6, background:'var(--surface2)', borderRadius:3 }}>
                      <div style={{ height:'100%', width:`${pct}%`, background:ss.dot, borderRadius:3, transition:'width 0.5s' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">Stock Alerts</div><span style={{ fontSize:12, color:lowStock.length>0?'#dc2626':'var(--text2)', fontWeight:600 }}>{lowStock.length} items need attention</span></div>
            {lowStock.length===0 ? (
              <div style={{ padding:32, textAlign:'center', color:'var(--text3)' }}><div style={{ fontSize:28, marginBottom:8 }}>✅</div><div>All items well stocked</div></div>
            ) : (
              <div style={{ maxHeight:220, overflowY:'auto' }}>
                {lowStock.map(item => (
                  <div key={item.id} style={{ padding:'12px 20px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div><div style={{ fontSize:13, fontWeight:600 }}>{item.name}</div><div style={{ fontSize:11, color:'var(--text3)' }}>{item.category}</div></div>
                    <span style={{ fontSize:11, fontWeight:700, borderRadius:20, padding:'3px 8px', background:INV_STATUS[item.status]?.bg, color:INV_STATUS[item.status]?.color }}>{item.quantity} {item.unit} left</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Recent Fuel Logs</div><span style={{ fontSize:12, color:'var(--text2)' }}>{d.fuel.length} total</span></div>
          {d.fuel.length===0 ? <div style={{ padding:32, textAlign:'center', color:'var(--text3)' }}>No fuel logs yet</div> : (
            <table className="table">
              <thead><tr><th>Vehicle</th><th>Date</th><th>Liters</th><th>Total Cost</th><th>Station</th></tr></thead>
              <tbody>
                {[...d.fuel].reverse().slice(0,8).map(f => (
                  <tr key={f.id}>
                    <td style={{ fontFamily:'DM Mono,monospace', color:'var(--blue)', fontSize:13 }}>{f.fleetVehicle?.plate||'—'}</td>
                    <td style={{ color:'var(--text2)' }}>{f.date}</td>
                    <td style={{ fontWeight:600 }}>{f.liters}L</td>
                    <td style={{ fontFamily:'DM Mono,monospace', color:'var(--green)' }}>{(f.totalCost||0).toLocaleString()} RWF</td>
                    <td style={{ color:'var(--text2)' }}>{f.station||'—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}

// ─── ALERTS DASHBOARD (Supervisor & Mechanic) ─────────────────────────────────
function AlertsDashboard({ onAlertsChange }) {
  const [fleet, setFleet] = useState([])
  useEffect(() => {
    api.get('/fleet').then(r => {
      const data = Array.isArray(r.data) ? r.data : r.data?.content || []
      setFleet(data)
      if (onAlertsChange) onAlertsChange(getExpiryAlerts(data).length)
    }).catch(e => console.error(e))
  }, [])
  const alerts = getExpiryAlerts(fleet)
  const expired = alerts.filter(a => a.expired)
  const upcoming = alerts.filter(a => !a.expired)
  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Alerts</div>
          <div className="page-sub">Document expiry alerts for fleet vehicles</div>
        </div>
        {alerts.length > 0 && (
          <span style={{ background:'#fee2e2', color:'#dc2626', borderRadius:20, fontSize:13, fontWeight:800, padding:'6px 16px', border:'1px solid #fca5a5' }}>
            {alerts.length} alert{alerts.length>1?'s':''}
          </span>
        )}
      </div>
      <div className="page-content">
        {alerts.length === 0 ? (
          <div className="card" style={{ padding:64, textAlign:'center' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
            <div style={{ fontSize:18, fontWeight:800, color:'var(--text)', marginBottom:8 }}>All documents are valid</div>
            <div style={{ fontSize:14, color:'var(--text2)' }}>No insurance or inspection expiring within 7 days</div>
          </div>
        ) : (
          <>
            {expired.length > 0 && (
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:12, fontWeight:800, color:'#dc2626', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10, display:'flex', alignItems:'center', gap:8 }}>
                  Already Expired ({expired.length})
                </div>
                <div className="card" style={{ borderColor:'#fca5a5' }}>
                  {expired.map((a, i) => (
                    <div key={a.id} style={{ padding:'16px 20px', borderBottom: i < expired.length-1 ? '1px solid #fee2e2' : 'none', display:'flex', alignItems:'center', justifyContent:'space-between', background:'#fff5f5' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                        <div style={{ width:44, height:44, borderRadius:12, background:'#fee2e2', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
                          {a.type==='Insurance' ? '🛡️' : '🔍'}
                        </div>
                        <div>
                          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                            <span style={{ fontFamily:'DM Mono,monospace', fontSize:15, fontWeight:800, color:'var(--blue)' }}>{a.plate}</span>
                            <span style={{ fontSize:12, fontWeight:700, background:'var(--surface2)', color:'var(--text2)', borderRadius:6, padding:'2px 8px' }}>{a.type}</span>
                          </div>
                          <div style={{ fontSize:12, color:'var(--text3)' }}>Expired on: <strong>{a.expiry}</strong></div>
                        </div>
                      </div>
                      <span style={{ fontSize:13, fontWeight:800, borderRadius:20, padding:'6px 14px', background:'#fee2e2', color:'#dc2626', border:'1px solid #fca5a5' }}>
                        Expired {Math.abs(a.days)}d ago
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {upcoming.length > 0 && (
              <div>
                <div style={{ fontSize:12, fontWeight:800, color:'#92400e', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10, display:'flex', alignItems:'center', gap:8 }}>
                  Expiring Within 7 Days ({upcoming.length})
                </div>
                <div className="card" style={{ borderColor:'#fcd34d' }}>
                  {upcoming.map((a, i) => (
                    <div key={a.id} style={{ padding:'16px 20px', borderBottom: i < upcoming.length-1 ? '1px solid #fef3c7' : 'none', display:'flex', alignItems:'center', justifyContent:'space-between', background:'#fffbeb' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                        <div style={{ width:44, height:44, borderRadius:12, background:'#fef3c7', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
                          {a.type==='Insurance' ? '🛡️' : '🔍'}
                        </div>
                        <div>
                          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                            <span style={{ fontFamily:'DM Mono,monospace', fontSize:15, fontWeight:800, color:'var(--blue)' }}>{a.plate}</span>
                            <span style={{ fontSize:12, fontWeight:700, background:'var(--surface2)', color:'var(--text2)', borderRadius:6, padding:'2px 8px' }}>{a.type}</span>
                          </div>
                          <div style={{ fontSize:12, color:'var(--text3)' }}>Expires on: <strong>{a.expiry}</strong></div>
                        </div>
                      </div>
                      <span style={{ fontSize:13, fontWeight:800, borderRadius:20, padding:'6px 14px',
                        background: a.days === 0 ? '#fee2e2' : '#fef3c7',
                        color: a.days === 0 ? '#dc2626' : '#92400e',
                        border: a.days === 0 ? '1px solid #fca5a5' : '1px solid #fcd34d' }}>
                        {a.days === 0 ? 'Expires TODAY' : `${a.days}d left`}
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


// ─── EXPENSES PAGE ────────────────────────────────────────────────────────────
function ExpensesPage() {
  const [expenses, setExpenses] = useState([])
  const [showAdd, setShowAdd] = useState(false)
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
    'GENERAL': { bg:'#eff6ff', color:'#1d4ed8' },
    'TYRE': { bg:'#fef3c7', color:'#92400e' },
    'TIYRE': { bg:'#fef3c7', color:'#92400e' },
    'TRANSPORT': { bg:'#f0fdf4', color:'#166534' },
    'PARKING': { bg:'#f5f3ff', color:'#6d28d9' },
    'WIREMAN': { bg:'#fff7ed', color:'#c2410c' },
    'MODIFICATION': { bg:'#fdf2f8', color:'#9d174d' },
  }
  const empty = { date:'', plate:'', assignment:'', reason:'', domain:'GENERAL', amount:'' }
  const [form, setForm] = useState(empty)
  const sf = (k,v) => setForm(f=>({...f,[k]:v}))

  useEffect(() => { fetchExpenses() }, [])
  const fetchExpenses = async () => {
    try { const r = await api.get('/expenses'); setExpenses(Array.isArray(r.data) ? r.data : []) }
    catch(e) { console.error(e) }
  }

  const handleSave = async () => {
    if (!form.date || !form.reason || !form.amount) { alert('Date, Reason and Amount are required'); return }
    try {
      await api.post('/expenses', { ...form, amount: parseInt(form.amount)||0 })
      fetchExpenses(); setShowAdd(false); setForm(empty)
    } catch { alert('Failed to save expense') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return
    try { await api.delete(`/expenses/${id}`); fetchExpenses() }
    catch { alert('Failed to delete') }
  }

  const handleDeleteMonth = async () => {
    if (!deleteMonth) return
    const monthIndex = MONTHS.indexOf(deleteMonth) + 1
    const toDelete = expenses.filter(e => e.date && new Date(e.date).getMonth() + 1 === monthIndex)
    if (toDelete.length === 0) { alert(`No expenses found for ${deleteMonth}`); return }
    if (!window.confirm(`Delete all ${toDelete.length} expense records for ${deleteMonth}? This cannot be undone.`)) return
    setDeleting(true)
    let success = 0
    for (const exp of toDelete) {
      try { await api.delete(`/expenses/${exp.id}`); success++ } catch {}
    }
    setDeleting(false); setShowDeleteModal(false); setDeleteMonth('')
    fetchExpenses()
    alert(`Deleted ${success} of ${toDelete.length} records for ${deleteMonth}`)
  }

  const handleImportExcel = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImporting(true); setImportResult(null)
    try {
      const XLSX = await import('https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs')
      const data = await file.arrayBuffer()
      const wb = XLSX.read(data, { cellDates: true })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json(ws, { header:1, defval:'' })
      let success = 0, failed = 0, skipped = 0, errors = []
      const selectedMonthIndex = MONTHS.indexOf(selectedMonth) + 1

      for (const row of rows) {
        const rawDate = row[0]
        const plate = String(row[1] || '').trim()
        const assignment = String(row[2] || '').trim()
        const reason = String(row[3] || '').trim()
        const domain = String(row[4] || '').trim().toUpperCase()
        const amount = parseFloat(row[5]) || 0

        // Skip only truly empty rows or header rows
        if (!rawDate) { skipped++; continue }
        if (String(rawDate).toUpperCase() === 'DATE' || String(reason).toUpperCase() === 'REASON') { skipped++; continue }
        if (!reason && !amount) { skipped++; continue }

        // Parse date — handles both Date objects and strings like "13/2/2026" or "28/2/2026"
        let dateStr = ''
        if (rawDate instanceof Date) {
          dateStr = rawDate.toISOString().split('T')[0]
        } else if (typeof rawDate === 'string' && rawDate.trim()) {
          const raw = rawDate.trim()
          if (raw.includes('/')) {
            // Format: DD/MM/YYYY or D/M/YYYY
            const parts = raw.split('/')
            if (parts.length === 3) {
              const day = parts[0].padStart(2,'0')
              const month = parts[1].padStart(2,'0')
              // Handle 2-digit year e.g. 23/2/2023 — keep as is, 4-digit year
              const year = parts[2].length === 2 ? '20' + parts[2] : parts[2]
              dateStr = `${year}-${month}-${day}`
            }
          } else if (raw.match(/^\d{4}-\d{2}-\d{2}$/)) {
            dateStr = raw
          }
        }
        if (!dateStr || isNaN(new Date(dateStr).getTime())) { skipped++; continue }

        // Filter by selected month
        const rowMonth = new Date(dateStr).getMonth() + 1
        if (rowMonth !== selectedMonthIndex) { skipped++; continue }

        try {
          await api.post('/expenses', { date:dateStr, plate, assignment, reason, domain: domain || 'GENERAL', amount: Math.round(amount) })
          success++
        } catch { failed++; if (errors.length < 8) errors.push(`Failed: ${reason} on ${dateStr}`) }
      }
      setImportResult({ success, failed, skipped, errors })
      if (success > 0) fetchExpenses()
    } catch(err) {
      setImportResult({ success:0, failed:1, skipped:0, errors:['Failed to read file: ' + err.message] })
    }
    setImporting(false); e.target.value = ''
  }

  // Filtered expenses
  const filtered = expenses.filter(e => {
    const q = search.toLowerCase()
    const monthMatch = filterMonth === 'ALL' || (e.date && new Date(e.date).getMonth() === MONTHS.indexOf(filterMonth))
    const domainMatch = filterDomain === 'ALL' || e.domain === filterDomain
    const searchMatch = !q || e.plate?.toLowerCase().includes(q) || e.reason?.toLowerCase().includes(q) || e.assignment?.toLowerCase().includes(q)
    return monthMatch && domainMatch && searchMatch
  })

  const totalAmount = filtered.reduce((s,e) => s+(e.amount||0), 0)

  // Stats by domain
  const byDomain = {}
  filtered.forEach(e => { const d=e.domain||'GENERAL'; byDomain[d]=(byDomain[d]||0)+(e.amount||0) })

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Garage Expenses</div><div className="page-sub">Daily expense records — Manager only</div></div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn btn-danger" style={{ fontSize:13 }} onClick={()=>{ setShowDeleteModal(true); setDeleteMonth('') }}>🗑 Delete by Month</button>
          <button className="btn btn-ghost" onClick={()=>{ setShowImportModal(true); setImportResult(null) }} disabled={importing}>
            {importing ? '⏳ Importing...' : '⬆ Import Excel'}
          </button>
          <button className="btn btn-success" onClick={()=>{ setForm(empty); setShowAdd(true) }}>+ Add Expense</button>
        </div>
      </div>
      <div className="page-content">

        {/* Import result banner */}
        {importResult && (
          <div style={{ marginBottom:16, padding:'14px 18px', borderRadius:12, border:`1px solid ${importResult.failed===0?'#86efac':'#fca5a5'}`, background: importResult.failed===0?'#f0fdf4':'#fff5f5', display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:800, fontSize:14, color: importResult.failed===0?'#166534':'#dc2626', marginBottom:4 }}>
                {importResult.failed===0?'✅':'⚠️'} Import Complete — {importResult.success} imported{importResult.failed>0?`, ${importResult.failed} failed`:''}{importResult.skipped>0?`, ${importResult.skipped} skipped`:''}
              </div>
              {importResult.errors.length>0 && <div style={{ fontSize:12, color:'#dc2626' }}>{importResult.errors.map((e,i)=><div key={i}>• {e}</div>)}</div>}
            </div>
            <button onClick={()=>setImportResult(null)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:18, color:'#9096ab' }}>✕</button>
          </div>
        )}

        {/* Stat cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
          <div className="stat-card"><div style={{ fontSize:12, color:'var(--text2)', marginBottom:6, fontWeight:600 }}>Total Expenses</div><div style={{ fontSize:22, fontWeight:800, color:'var(--red)' }}>{totalAmount.toLocaleString()}</div><div style={{ fontSize:11, color:'var(--text3)' }}>RWF</div></div>
          <div className="stat-card"><div style={{ fontSize:12, color:'var(--text2)', marginBottom:6, fontWeight:600 }}>Records</div><div style={{ fontSize:22, fontWeight:800, color:'var(--blue)' }}>{filtered.length}</div><div style={{ fontSize:11, color:'var(--text3)' }}>entries</div></div>
          <div className="stat-card"><div style={{ fontSize:12, color:'var(--text2)', marginBottom:6, fontWeight:600 }}>General Repairs</div><div style={{ fontSize:22, fontWeight:800, color:'#1d4ed8' }}>{(byDomain['GENERAL']||0).toLocaleString()}</div><div style={{ fontSize:11, color:'var(--text3)' }}>RWF</div></div>
          <div className="stat-card"><div style={{ fontSize:12, color:'var(--text2)', marginBottom:6, fontWeight:600 }}>Transport</div><div style={{ fontSize:22, fontWeight:800, color:'#166534' }}>{(byDomain['TRANSPORT']||0).toLocaleString()}</div><div style={{ fontSize:11, color:'var(--text3)' }}>RWF</div></div>
        </div>

        {/* Filters */}
        <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
          <input className="form-input" style={{ flex:1, minWidth:200 }} placeholder="Search plate, reason, assignment..." value={search} onChange={e=>setSearch(e.target.value)}/>
          <select className="form-input" style={{ width:160, appearance:'auto' }} value={filterMonth} onChange={e=>setFilterMonth(e.target.value)}>
            <option value="ALL">All Months</option>
            {MONTHS.map(m=><option key={m} value={m}>{m}</option>)}
          </select>
          <select className="form-input" style={{ width:160, appearance:'auto' }} value={filterDomain} onChange={e=>setFilterDomain(e.target.value)}>
            <option value="ALL">All Categories</option>
            {DOMAINS.map(d=><option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Expense Records</div>
            <span style={{ fontFamily:'DM Mono,monospace', fontSize:13, color:'var(--red)', fontWeight:700 }}>Total: {totalAmount.toLocaleString()} RWF</span>
          </div>
          {filtered.length===0 ? (
            <div style={{ padding:48, textAlign:'center', color:'var(--text3)' }}>
              <div style={{ fontSize:36, marginBottom:12 }}>💰</div>
              <div>No expense records found</div>
            </div>
          ) : (
            <div style={{ overflowX:'auto' }}>
              <table className="table">
                <thead><tr><th>Date</th><th>Plate</th><th>Assignment</th><th>Reason</th><th>Category</th><th>Amount (RWF)</th><th>Actions</th></tr></thead>
                <tbody>{filtered.map(e => {
                  const ds = DOMAIN_STYLE[e.domain] || DOMAIN_STYLE['GENERAL']
                  return (
                    <tr key={e.id}>
                      <td style={{ color:'var(--text2)' }}>{e.date}</td>
                      <td style={{ fontFamily:'DM Mono,monospace', color:'var(--blue)', fontWeight:700 }}>{e.plate||'—'}</td>
                      <td style={{ color:'var(--text2)' }}>{e.assignment||'—'}</td>
                      <td style={{ fontWeight:600 }}>{e.reason}</td>
                      <td><span style={{ fontSize:11, fontWeight:700, borderRadius:20, padding:'3px 10px', background:ds.bg, color:ds.color }}>{e.domain}</span></td>
                      <td style={{ fontFamily:'DM Mono,monospace', fontWeight:700, color:'var(--red)' }}>{(e.amount||0).toLocaleString()}</td>
                      <td><button className="btn btn-danger" style={{ padding:'5px 10px', fontSize:12 }} onClick={()=>handleDelete(e.id)}>Del</button></td>
                    </tr>
                  )
                })}</tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Add Expense Modal ── */}
      {showAdd && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowAdd(false)}>
          <div className="modal" style={{ maxWidth:520 }}>
            <div className="modal-header"><div className="modal-title">Add Expense</div><X onClick={()=>setShowAdd(false)}/></div>
            <div className="modal-body">
              <div style={{ fontSize:11, fontWeight:800, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:14, paddingBottom:8, borderBottom:'1px solid var(--border)' }}>Same format as Excel — DATE, PLATE, ASSIGNMENT, REASON, DOMAIN, AMOUNT</div>
              <div className="form-row" style={{ marginBottom:14 }}>
                <div><label className="form-label">Date *</label><input className="form-input" type="date" value={form.date} onChange={e=>sf('date',e.target.value)}/></div>
                <div><label className="form-label">Plate</label><input className="form-input" value={form.plate} onChange={e=>sf('plate',e.target.value.toUpperCase())} placeholder="e.g. RAG510W"/></div>
              </div>
              <div className="form-row" style={{ marginBottom:14 }}>
                <div><label className="form-label">Assignment</label><input className="form-input" value={form.assignment} onChange={e=>sf('assignment',e.target.value)} placeholder="e.g. COLGATE, DELIVERY"/></div>
                <div><label className="form-label">Domain / Category *</label>
                  <select className="form-input" style={{ appearance:'auto' }} value={form.domain} onChange={e=>sf('domain',e.target.value)}>
                    {[...DOMAINS,'TIYRE'].map(d=><option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group"><label className="form-label">Reason *</label><input className="form-input" value={form.reason} onChange={e=>sf('reason',e.target.value)} placeholder="e.g. REPAIR TIRES"/></div>
              <div className="form-group"><label className="form-label">Amount (RWF) *</label><input className="form-input" type="number" value={form.amount} onChange={e=>sf('amount',e.target.value)} placeholder="e.g. 15000"/></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setShowAdd(false)}>Cancel</button>
              <button className="btn btn-success" onClick={handleSave}>Save Expense</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Import Month Modal ── */}
      {showImportModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowImportModal(false)}>
          <div className="modal" style={{ maxWidth:420 }}>
            <div className="modal-header"><div className="modal-title">Import Expenses Excel</div><X onClick={()=>setShowImportModal(false)}/></div>
            <div className="modal-body">
              <div style={{ marginBottom:20 }}>
                <label className="form-label">Select Month to Import *</label>
                <select className="form-input" style={{ appearance:'auto' }} value={selectedMonth} onChange={e=>setSelectedMonth(e.target.value)}>
                  <option value="">— Select a month —</option>
                  {MONTHS.map(m=><option key={m} value={m}>{m}</option>)}
                </select>
                {selectedMonth && <div style={{ fontSize:11, color:'var(--blue)', marginTop:6, fontWeight:600 }}>Only {selectedMonth} records will be imported from the file</div>}
              </div>
              <div style={{ background:'var(--surface2)', borderRadius:10, padding:'12px 14px', fontSize:13, color:'var(--text2)', lineHeight:1.6 }}>
                <strong style={{ color:'var(--text)' }}>Excel format expected:</strong><br/>
                DATE | PLATE | ASSIGNMENT | REASON | DOMAIN | AMOUNT
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setShowImportModal(false)}>Cancel</button>
              <label className="btn btn-blue" style={{ cursor: selectedMonth?'pointer':'not-allowed', opacity: selectedMonth?1:0.5, position:'relative' }}>
                Choose File & Import
                <input type="file" accept=".xlsx,.xls" onChange={e=>{ if(selectedMonth){ setShowImportModal(false); handleImportExcel(e) } }} style={{ position:'absolute', inset:0, opacity:0, cursor: selectedMonth?'pointer':'not-allowed' }} disabled={!selectedMonth||importing}/>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete by Month Modal ── */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowDeleteModal(false)}>
          <div className="modal" style={{ maxWidth:420 }}>
            <div className="modal-header"><div className="modal-title" style={{ color:'var(--red)' }}>Delete by Month</div><X onClick={()=>setShowDeleteModal(false)}/></div>
            <div className="modal-body">
              <div style={{ marginBottom:20 }}>
                <label className="form-label">Select Month to Delete *</label>
                <select className="form-input" style={{ appearance:'auto' }} value={deleteMonth} onChange={e=>setDeleteMonth(e.target.value)}>
                  <option value="">— Select a month —</option>
                  {MONTHS.map(m => {
                    const idx = MONTHS.indexOf(m) + 1
                    const count = expenses.filter(e => e.date && new Date(e.date).getMonth()+1 === idx).length
                    return <option key={m} value={m}>{m} {count>0?`(${count} records)`:'(no records)'}</option>
                  })}
                </select>
                {deleteMonth && (()=>{ const idx=MONTHS.indexOf(deleteMonth)+1; const count=expenses.filter(e=>e.date&&new Date(e.date).getMonth()+1===idx).length; return <div style={{ fontSize:11, color:'#dc2626', marginTop:6, fontWeight:600 }}>⚠️ This will permanently delete {count} expense record{count!==1?'s':''} for {deleteMonth}</div> })()}
              </div>
              <div style={{ background:'#fff5f5', border:'1px solid #fca5a5', borderRadius:10, padding:'12px 14px', fontSize:13, color:'#dc2626' }}>
                This action cannot be undone.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setShowDeleteModal(false)}>Cancel</button>
              <button className="btn" style={{ background:'var(--red)', color:'#fff', opacity:deleteMonth?1:0.5 }} onClick={handleDeleteMonth} disabled={!deleteMonth||deleting}>
                {deleting?'Deleting...':'Delete All Records'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ─── REPORTS PAGE ─────────────────────────────────────────────────────────────
function ReportsPage() {
  const [activeReport, setActiveReport] = useState('fleet')
  const [search, setSearch] = useState('')
  const [data, setData] = useState({ vehicles:[], fleet:[], fuel:[], inventory:[], staff:[] })
  useEffect(() => {
    Promise.all([api.get('/vehicles'), api.get('/fleet'), api.get('/fleet/fuel/all'), api.get('/inventory'), api.get('/auth/users')])
      .then(([v,f,fuel,inv,s]) => setData({
        vehicles: Array.isArray(v.data) ? v.data : v.data?.content || [],
        fleet: Array.isArray(f.data) ? f.data : f.data?.content || [],
        fuel: Array.isArray(fuel.data) ? fuel.data : fuel.data?.content || [],
        inventory: Array.isArray(inv.data) ? inv.data : inv.data?.content || [],
        staff: Array.isArray(s.data) ? s.data : s.data?.content || []
      })).catch(e => console.error(e))
  }, [])
  const reportTabs = [
    { key:'fleet', label:'Fleet Vehicles', icon:'🚛' },
    { key:'garage', label:'Garage Vehicles', icon:'🚗' },
    { key:'fuel', label:'Fuel Logs', icon:'⛽' },
    { key:'inventory', label:'Inventory', icon:'📦' },
    { key:'staff', label:'Staff', icon:'👥' },
  ]
  const q = search.toLowerCase()
  const filteredFleet = data.fleet.filter(v => !q || v.plate?.toLowerCase().includes(q) || v.make?.toLowerCase().includes(q) || v.model?.toLowerCase().includes(q) || v.driverName?.toLowerCase().includes(q))
  const filteredGarage = data.vehicles.filter(v => !q || v.plate?.toLowerCase().includes(q) || v.make?.toLowerCase().includes(q) || v.model?.toLowerCase().includes(q) || v.ownerName?.toLowerCase().includes(q))
  const filteredFuel = data.fuel.filter(f => !q || f.fleetVehicle?.plate?.toLowerCase().includes(q) || f.station?.toLowerCase().includes(q) || f.filledBy?.toLowerCase().includes(q))
  const filteredInventory = data.inventory.filter(i => !q || i.name?.toLowerCase().includes(q) || i.category?.toLowerCase().includes(q) || i.supplier?.toLowerCase().includes(q))
  const filteredStaff = data.staff.filter(s => !q || s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q) || s.role?.toLowerCase().includes(q))
  const exportCSV = (rows, headers, filename) => {
    const csv = [headers, ...rows].map(r => r.map(c => `"${c??''}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type:'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href=url; a.download=`${filename}-${new Date().toISOString().split('T')[0]}.csv`; a.click()
    URL.revokeObjectURL(url)
  }
  const exportPDF = (title, headers, rows) => {
    const tableRows = rows.map(r => `<tr>${r.map(c=>`<td>${c??'—'}</td>`).join('')}</tr>`).join('')
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
    <style>body{font-family:Calibri,sans-serif;padding:30px;color:#111}h1{font-size:20px;margin-bottom:4px}p{color:#555;font-size:12px;margin:2px 0}table{width:100%;border-collapse:collapse;margin-top:16px;font-size:12px}th{background:#2563eb;color:#fff;padding:8px;text-align:left}td{padding:7px 8px;border-bottom:1px solid #eee}tr:nth-child(even) td{background:#f8faff}.footer{margin-top:16px;font-size:11px;color:#888}</style>
    </head><body><h1>📋 ${title}</h1><p>Generated: ${new Date().toLocaleString()}</p><p>Total Records: ${rows.length}</p>
    <table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${tableRows}</tbody></table>
    <div class="footer">ERI-RWANDA Fleet Management System</div></body></html>`
    const w = window.open('','_blank'); w.document.write(html); w.document.close(); w.print()
  }
  const handleExportCSV = () => {
    if (activeReport==='fleet') exportCSV(filteredFleet.map(v=>[v.plate,v.make,v.model,v.year,v.color,v.type,v.status,v.driverName,v.driverPhone,v.mileage,v.insuranceCompany,v.insuranceExpiry]),['Plate','Make','Model','Year','Color','Type','Status','Driver','Phone','Mileage','Insurance Co.','Ins. Expiry'],'fleet-vehicles')
    else if (activeReport==='garage') exportCSV(filteredGarage.map(v=>[v.plate,v.make,v.model,v.year,v.color,v.type,v.status,v.ownerName,v.ownerPhone,v.ownerEmail,v.mileage]),['Plate','Make','Model','Year','Color','Type','Status','Owner','Phone','Email','Mileage'],'garage-vehicles')
    else if (activeReport==='fuel') exportCSV(filteredFuel.map(f=>[f.fleetVehicle?.plate,f.date,f.liters,f.costPerLiter,f.totalCost,f.mileageAtFill,f.station,f.filledBy]),['Vehicle','Date','Liters','Cost/L','Total Cost','Mileage','Station','Filled By'],'fuel-logs')
    else if (activeReport==='inventory') exportCSV(filteredInventory.map(i=>[i.name,i.category,i.quantity,i.unit,i.minQuantity,i.unitPrice,i.status,i.supplier,i.location]),['Name','Category','Qty','Unit','Min Qty','Unit Price','Status','Supplier','Location'],'inventory')
    else if (activeReport==='staff') exportCSV(filteredStaff.map(s=>[s.name,s.email,s.role]),['Name','Email','Role'],'staff')
  }
  const handleExportPDF = () => {
    if (activeReport==='fleet') exportPDF('Fleet Vehicles Report',['Plate','Make','Model','Year','Status','Driver','Phone','Mileage','Ins. Expiry'],filteredFleet.map(v=>[v.plate,v.make,v.model,v.year,v.status,v.driverName,v.driverPhone,v.mileage,v.insuranceExpiry]))
    else if (activeReport==='garage') exportPDF('Garage Vehicles Report',['Plate','Make','Model','Year','Status','Owner','Phone','Mileage'],filteredGarage.map(v=>[v.plate,v.make,v.model,v.year,v.status,v.ownerName,v.ownerPhone,v.mileage]))
    else if (activeReport==='fuel') exportPDF('Fuel Logs Report',['Vehicle','Date','Liters','Cost/L (RWF)','Total Cost (RWF)','Station','Filled By'],filteredFuel.map(f=>[f.fleetVehicle?.plate,f.date,f.liters,f.costPerLiter,f.totalCost,f.station,f.filledBy]))
    else if (activeReport==='inventory') exportPDF('Inventory Report',['Name','Category','Qty','Unit Price (RWF)','Status','Supplier','Location'],filteredInventory.map(i=>[i.name,i.category,`${i.quantity} ${i.unit}`,i.unitPrice,i.status,i.supplier,i.location]))
    else if (activeReport==='staff') exportPDF('Staff Report',['Name','Email','Role'],filteredStaff.map(s=>[s.name,s.email,s.role]))
  }
  const currentCount = {fleet:filteredFleet.length,garage:filteredGarage.length,fuel:filteredFuel.length,inventory:filteredInventory.length,staff:filteredStaff.length}[activeReport]
  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Reports</div><div className="page-sub">Generate and export reports — Manager only</div></div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn btn-ghost" onClick={handleExportCSV}>📥 Export CSV</button>
          <button className="btn btn-blue" onClick={handleExportPDF}>📄 Export PDF</button>
        </div>
      </div>
      <div className="page-content">
        <div style={{ display:'flex', gap:4, marginBottom:20, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, padding:4, width:'fit-content', flexWrap:'wrap' }}>
          {reportTabs.map(t => (
            <button key={t.key} className="tab-btn" onClick={()=>{ setActiveReport(t.key); setSearch('') }}
              style={{ background:activeReport===t.key?'var(--blue)':'transparent', color:activeReport===t.key?'#fff':'var(--text2)', padding:'8px 16px' }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
        <div style={{ marginBottom:16, display:'flex', gap:10, alignItems:'center' }}>
          <div style={{ position:'relative', flex:1, maxWidth:400 }}>
            <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text3)', fontSize:16 }}>🔍</span>
            <input className="form-input" style={{ paddingLeft:38 }} placeholder="Search by plate number, name..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          {search && <button className="btn btn-ghost" style={{ padding:'10px 14px' }} onClick={()=>setSearch('')}>✕ Clear</button>}
          <span style={{ fontSize:13, color:'var(--text2)', fontWeight:600 }}>{currentCount} records found</span>
        </div>
        {activeReport==='fleet' && (
          <div className="card">
            <div className="card-header"><div className="card-title">Fleet Vehicles</div></div>
            {filteredFleet.length===0 ? <div style={{ padding:48, textAlign:'center', color:'var(--text3)' }}>No fleet vehicles found</div> : (
              <div style={{ overflowX:'auto' }}>
                <table className="table">
                  <thead><tr><th>Plate</th><th>Make / Model</th><th>Year</th><th>Type</th><th>Status</th><th>Driver</th><th>Phone</th><th>Mileage</th><th>Ins. Expiry</th></tr></thead>
                  <tbody>{filteredFleet.map(v=>{ const ss=FLEET_STATUS[v.status]||FLEET_STATUS['Active']; return (
                    <tr key={v.id}>
                      <td style={{ fontFamily:'DM Mono,monospace', color:'var(--blue)', fontWeight:700 }}>{v.plate}</td>
                      <td style={{ fontWeight:600 }}>{v.make} {v.model}</td>
                      <td>{v.year}</td>
                      <td><span style={{ fontSize:11, background:'var(--surface2)', color:'var(--text2)', borderRadius:6, padding:'3px 8px', fontWeight:600 }}>{v.type}</span></td>
                      <td><span style={{ fontSize:11, fontWeight:700, borderRadius:20, padding:'3px 10px', background:ss.bg, color:ss.color }}>{v.status?.replace('_',' ')}</span></td>
                      <td>{v.driverName||'—'}</td>
                      <td style={{ color:'var(--text2)' }}>{v.driverPhone||'—'}</td>
                      <td style={{ fontFamily:'DM Mono,monospace' }}>{v.mileage?`${Number(v.mileage).toLocaleString()} km`:'—'}</td>
                      <td style={{ color:v.insuranceExpiry&&new Date(v.insuranceExpiry)<new Date()?'var(--red)':'var(--text2)' }}>{v.insuranceExpiry||'—'}</td>
                    </tr>
                  )})}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {activeReport==='garage' && (
          <div className="card">
            <div className="card-header"><div className="card-title">Garage Vehicles</div></div>
            {filteredGarage.length===0 ? <div style={{ padding:48, textAlign:'center', color:'var(--text3)' }}>No garage vehicles found</div> : (
              <div style={{ overflowX:'auto' }}>
                <table className="table">
                  <thead><tr><th>Plate</th><th>Make / Model</th><th>Year</th><th>Type</th><th>Status</th><th>Owner</th><th>Phone</th><th>Company</th><th>Mileage</th></tr></thead>
                  <tbody>{filteredGarage.map(v=>{ const ss=STATUS_STYLE[v.status]||STATUS_STYLE['Ready']; return (
                    <tr key={v.id}>
                      <td style={{ fontFamily:'DM Mono,monospace', color:'var(--blue)', fontWeight:700 }}>{v.plate}</td>
                      <td style={{ fontWeight:600 }}>{v.make} {v.model}</td>
                      <td>{v.year}</td>
                      <td><span style={{ fontSize:11, background:'var(--surface2)', color:'var(--text2)', borderRadius:6, padding:'3px 8px', fontWeight:600 }}>{v.type}</span></td>
                      <td><span style={{ fontSize:11, fontWeight:700, borderRadius:20, padding:'3px 10px', background:ss.bg, color:ss.color }}>{v.status?.replace('_',' ')}</span></td>
                      <td style={{ fontWeight:600 }}>{v.ownerName||'—'}</td>
                      <td style={{ color:'var(--text2)' }}>{v.ownerPhone||'—'}</td>
                      <td style={{ color:'var(--text2)' }}>{v.ownerCompany||'—'}</td>
                      <td style={{ fontFamily:'DM Mono,monospace' }}>{v.mileage?`${Number(v.mileage).toLocaleString()} km`:'—'}</td>
                    </tr>
                  )})}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {activeReport==='fuel' && (
          <div className="card">
            <div className="card-header">
              <div className="card-title">Fuel Logs</div>
              <span style={{ fontFamily:'DM Mono,monospace', fontSize:13, color:'var(--green)', fontWeight:700 }}>Total: {filteredFuel.reduce((s,f)=>s+(f.totalCost||0),0).toLocaleString()} RWF</span>
            </div>
            {filteredFuel.length===0 ? <div style={{ padding:48, textAlign:'center', color:'var(--text3)' }}>No fuel logs found</div> : (
              <div style={{ overflowX:'auto' }}>
                <table className="table">
                  <thead><tr><th>Vehicle</th><th>Date</th><th>Liters</th><th>Cost/L</th><th>Total Cost</th><th>Mileage</th><th>Station</th><th>Filled By</th></tr></thead>
                  <tbody>{[...filteredFuel].reverse().map(f=>(
                    <tr key={f.id}>
                      <td style={{ fontFamily:'DM Mono,monospace', color:'var(--blue)', fontWeight:700 }}>{f.fleetVehicle?.plate||'—'}</td>
                      <td style={{ color:'var(--text2)' }}>{f.date}</td>
                      <td style={{ fontWeight:600 }}>{f.liters}L</td>
                      <td style={{ color:'var(--text2)' }}>{f.costPerLiter?`${f.costPerLiter} RWF`:'—'}</td>
                      <td style={{ fontFamily:'DM Mono,monospace', color:'var(--green)', fontWeight:700 }}>{(f.totalCost||0).toLocaleString()} RWF</td>
                      <td style={{ color:'var(--text2)' }}>{f.mileageAtFill?`${f.mileageAtFill.toLocaleString()} km`:'—'}</td>
                      <td>{f.station||'—'}</td>
                      <td style={{ color:'var(--text2)' }}>{f.filledBy||'—'}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {activeReport==='inventory' && (
          <div className="card">
            <div className="card-header"><div className="card-title">Inventory</div></div>
            {filteredInventory.length===0 ? <div style={{ padding:48, textAlign:'center', color:'var(--text3)' }}>No inventory items found</div> : (
              <div style={{ overflowX:'auto' }}>
                <table className="table">
                  <thead><tr><th>Name</th><th>Category</th><th>Qty</th><th>Unit Price</th><th>Min Qty</th><th>Status</th><th>Supplier</th><th>Location</th></tr></thead>
                  <tbody>{filteredInventory.map(i=>{ const st=INV_STATUS[i.status]||INV_STATUS['In_Stock']; return (
                    <tr key={i.id}>
                      <td style={{ fontWeight:600 }}>{i.name}</td>
                      <td><span style={{ fontSize:11, background:'var(--surface2)', color:'var(--text2)', borderRadius:6, padding:'3px 8px', fontWeight:600 }}>{i.category}</span></td>
                      <td style={{ fontFamily:'DM Mono,monospace', fontWeight:600 }}>{i.quantity} {i.unit}</td>
                      <td style={{ fontFamily:'DM Mono,monospace', color:'var(--green)' }}>{(i.unitPrice||0).toLocaleString()} RWF</td>
                      <td style={{ color:'var(--text2)' }}>{i.minQuantity}</td>
                      <td><span style={{ fontSize:11, fontWeight:700, borderRadius:20, padding:'3px 10px', background:st.bg, color:st.color }}>{i.status?.replace('_',' ')}</span></td>
                      <td style={{ color:'var(--text2)' }}>{i.supplier||'—'}</td>
                      <td style={{ color:'var(--text2)' }}>{i.location||'—'}</td>
                    </tr>
                  )})}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {activeReport==='staff' && (
          <div className="card">
            <div className="card-header"><div className="card-title">Staff Members</div></div>
            {filteredStaff.length===0 ? <div style={{ padding:48, textAlign:'center', color:'var(--text3)' }}>No staff found</div> : (
              <div style={{ overflowX:'auto' }}>
                <table className="table">
                  <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
                  <tbody>{filteredStaff.map(s=>{ const rc=ROLE_CONFIG[s.role]; return (
                    <tr key={s.id}>
                      <td style={{ fontWeight:600 }}>{s.name}</td>
                      <td style={{ fontFamily:'DM Mono,monospace', color:'var(--text2)', fontSize:13 }}>{s.email}</td>
                      <td><span style={{ display:'inline-flex', alignItems:'center', padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:700, background:rc?.bg, color:rc?.color }}>{rc?.label}</span></td>
                    </tr>
                  )})}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

// ─── FUEL LOGS ────────────────────────────────────────────────────────────────
function FuelLogsPage({ user }) {
  const [logs, setLogs] = useState([])
  const [fleet, setFleet] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [filterVehicle, setFilterVehicle] = useState('all')
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteMonth, setDeleteMonth] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState('')
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const emptyForm = { fleetVehicleId:'', date:'', liters:'', costPerLiter:'', totalCost:'', mileageAtFill:'', filledBy:'', station:'' }
  const [form, setForm] = useState(emptyForm)
  const sf = (k,v) => setForm(f=>({...f,[k]:v}))

  useEffect(() => { fetchData() }, [])
  const fetchData = async () => {
    try {
      const [l,f] = await Promise.all([api.get('/fleet/fuel/all'), api.get('/fleet')])
      setLogs(Array.isArray(l.data) ? l.data : [])
      const fleetData = Array.isArray(f.data) ? f.data : []
      setFleet(fleetData)
      if (fleetData.length > 0) setForm(fr => ({...fr, fleetVehicleId: fleetData[0].id}))
    } catch(e) { console.error(e) }
  }

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowAdd(true) }
  const openEdit = (log) => {
    setEditing(log)
    setForm({
      fleetVehicleId: log.fleetVehicle?.id || '',
      date: log.date || '',
      liters: log.liters || '',
      costPerLiter: log.costPerLiter || '',
      totalCost: log.totalCost || '',
      mileageAtFill: log.mileageAtFill || '',
      filledBy: log.filledBy || user.name,
      station: log.station || ''
    })
    setShowAdd(true)
  }

  const handleSave = async () => {
    if (!form.fleetVehicleId || !form.liters || !form.date) { alert('Vehicle, date and liters required'); return }
    const payload = { ...form, liters: parseFloat(form.liters), costPerLiter: parseInt(form.costPerLiter)||0, totalCost: parseInt(form.totalCost)||0, mileageAtFill: parseInt(form.mileageAtFill)||0 }
    try {
      if (editing) await api.put(`/fleet/${form.fleetVehicleId}/fuel/${editing.id}`, payload)
      else await api.post(`/fleet/${form.fleetVehicleId}/fuel`, payload)
      fetchData(); setShowAdd(false); setEditing(null)
    } catch { alert('Failed to save fuel log') }
  }

  const handleDelete = async (log) => {
    if (!window.confirm('Delete this fuel log entry?')) return
    try { await api.delete(`/fleet/${log.fleetVehicle?.id}/fuel/${log.id}`); fetchData() }
    catch { alert('Failed to delete fuel log') }
  }

  // ── Delete by Month ──
  const handleDeleteMonth = async () => {
    if (!deleteMonth) return
    const monthIndex = MONTHS.indexOf(deleteMonth) + 1
    const toDelete = logs.filter(l => {
      if (!l.date) return false
      const m = new Date(l.date).getMonth() + 1
      return m === monthIndex
    })
    if (toDelete.length === 0) { alert(`No fuel logs found for ${deleteMonth}`); return }
    if (!window.confirm(`Delete all ${toDelete.length} fuel log entries for ${deleteMonth}? This cannot be undone.`)) return
    setDeleting(true)
    let success = 0
    for (const log of toDelete) {
      try {
        await api.delete(`/fleet/${log.fleetVehicle?.id}/fuel/${log.id}`)
        success++
      } catch { console.error('Failed to delete', log.id) }
    }
    setDeleting(false)
    setShowDeleteModal(false)
    setDeleteMonth('')
    fetchData()
    alert(`Deleted ${success} of ${toDelete.length} records for ${deleteMonth}`)
  }

  // ── Tally Excel Import ──
  const extractPlate = (particulars) => {
    if (!particulars) return null
    let raw = particulars.split(' - ')[0].split('(')[0].trim()
    return raw.replace(/[\s\-]/g, '').toUpperCase()
  }

  const handleImportExcel = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImporting(true)
    setImportResult(null)
    try {
      const XLSX = await import('https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs')
      const data = await file.arrayBuffer()
      const wb = XLSX.read(data, { cellDates: true })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })

      let success = 0, failed = 0, skipped = 0
      const errors = []
      const SKIP_KEYWORDS = ['opening balance', 'totals', 'closing balance', 'particulars', 'stock item', 'eri-rwanda', 'fuel -', 'date', 'plate number']

      for (const row of rows) {
        const rawDate = row[0]
        const particulars = String(row[1] || '').trim()
        const quantity = parseFloat(row[4]) || 0
        const value = parseFloat(row[5]) || 0
        const vchNo = String(row[3] || '').trim()

        // Skip header/summary/empty rows
        if (!rawDate || !particulars || !quantity) { skipped++; continue }
        const lp = particulars.toLowerCase()
        if (SKIP_KEYWORDS.some(k => lp.includes(k))) { skipped++; continue }

        // Parse date
        let dateStr = ''
        if (rawDate instanceof Date) {
          dateStr = rawDate.toISOString().split('T')[0]
        } else if (typeof rawDate === 'string' && rawDate.match(/\d{4}-\d{2}-\d{2}/)) {
          dateStr = rawDate
        } else { skipped++; continue }

        // Filter by selected month
        const rowMonth = new Date(dateStr).getMonth() // 0-indexed
        const selectedMonthIndex = MONTHS.indexOf(selectedMonth)
        if (rowMonth !== selectedMonthIndex) { skipped++; continue }

        // Extract plate and assignment label
        const plateNorm = extractPlate(particulars)
        const assignment = particulars.includes(' - ') ? particulars.split(' - ').slice(1).join(' - ').trim() : ''

        if (!plateNorm || plateNorm.length < 5) { skipped++; continue }

        // Match fleet vehicle — normalize both sides
        const vehicle = fleet.find(v => v.plate?.replace(/[\s\-]/g, '').toUpperCase() === plateNorm)
        if (!vehicle) {
          failed++
          if (errors.length < 8) errors.push(`Plate not in fleet: "${particulars}"`)
          continue
        }

        // Cost per liter = value / quantity
        const costPerLiter = quantity > 0 ? Math.round(value / quantity) : 0

        try {
          await api.post(`/fleet/${vehicle.id}/fuel`, {
            date: dateStr,
            liters: quantity,
            costPerLiter,
            totalCost: Math.round(value),
            mileageAtFill: 0,
            station: vchNo || '',
            filledBy: assignment || 'Tally Import'
          })
          success++
        } catch {
          failed++
          if (errors.length < 8) errors.push(`Save failed: ${particulars} on ${dateStr}`)
        }
      }

      setImportResult({ success, failed, skipped, errors })
      if (success > 0) fetchData()
    } catch(err) {
      setImportResult({ success:0, failed:1, skipped:0, errors:['Failed to read file: ' + err.message] })
    }
    setImporting(false)
    e.target.value = ''
  }

  const filtered = filterVehicle==='all' ? logs : logs.filter(l=>l.fleetVehicle?.id===parseInt(filterVehicle))
  const totalL = filtered.reduce((s,l)=>s+(l.liters||0),0)
  const totalC = filtered.reduce((s,l)=>s+(l.totalCost||0),0)

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Fuel Logs</div><div className="page-sub">Track fuel consumption for fleet vehicles</div></div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn btn-danger" style={{ fontSize:13 }} onClick={()=>{ setShowDeleteModal(true); setDeleteMonth('') }}>
            🗑 Delete by Month
          </button>
          <button className="btn btn-ghost" onClick={()=>{ setShowImportModal(true); setImportResult(null) }} disabled={importing}>
            {importing ? '⏳ Importing...' : '⬆ Import Tally Excel'}
          </button>
          <button className="btn btn-blue" onClick={openAdd}>+ Log Fuel Fill</button>
        </div>
      </div>
      <div className="page-content">
        {/* Import result banner */}
        {importResult && (
          <div style={{ marginBottom:16, padding:'14px 18px', borderRadius:12, border:`1px solid ${importResult.failed===0?'#86efac':'#fca5a5'}`, background: importResult.failed===0 ? '#f0fdf4':'#fff5f5', display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:800, fontSize:14, color: importResult.failed===0?'#166534':'#dc2626', marginBottom:6 }}>
                {importResult.failed===0 ? '✅' : '⚠️'} Import Complete — {importResult.success} imported{importResult.failed>0?`, ${importResult.failed} failed`:''}{importResult.skipped>0?`, ${importResult.skipped} skipped`:''}
              </div>
              {importResult.errors.length>0 && (
                <div style={{ fontSize:12, color:'#dc2626', marginBottom:4 }}>
                  {importResult.errors.map((e,i)=><div key={i}>• {e}</div>)}
                </div>
              )}
              {importResult.failed>0 && (
                <div style={{ fontSize:11, color:'#92400e', marginTop:4 }}>
                  Tip: Make sure the fleet vehicle plates in the Excel match what is registered in the system. The importer normalizes spaces and dashes automatically.
                </div>
              )}
            </div>
            <button onClick={()=>setImportResult(null)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:18, color:'#9096ab', flexShrink:0 }}>✕</button>
          </div>
        )}

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:20 }}>
          {[['Total Fills',filtered.length,'Log entries','var(--blue)'],['Total Liters',totalL.toFixed(1)+'L','Consumed','var(--green)'],['Total Cost',totalC.toLocaleString()+' RWF','Expenditure','var(--text)']].map(([l,v,s,c])=>(
            <div key={l} className="stat-card"><div style={{ fontSize:13, color:'var(--text2)', marginBottom:8, fontWeight:600 }}>{l}</div><div style={{ fontFamily:'Nunito,sans-serif', fontSize:24, fontWeight:800, color:c }}>{v}</div><div style={{ fontSize:12, color:'var(--text3)', marginTop:4 }}>{s}</div></div>
          ))}
        </div>
        <div style={{ marginBottom:16 }}>
          <select className="form-input" style={{ maxWidth:260, appearance:'auto' }} value={filterVehicle} onChange={e=>setFilterVehicle(e.target.value)}>
            <option value="all">All Fleet Vehicles</option>
            {fleet.map(v=><option key={v.id} value={v.id}>{v.plate} — {v.make} {v.model}</option>)}
          </select>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Fuel History</div><span style={{ fontSize:12, color:'var(--text2)', fontWeight:600 }}>{filtered.length} entries</span></div>
          {filtered.length===0 ? <div style={{ padding:48, textAlign:'center', color:'var(--text3)' }}><div style={{ fontSize:36, marginBottom:12 }}>⛽</div><div>No fuel logs yet</div></div> : (
            <table className="table">
              <thead><tr><th>Date</th><th>Particulars (Plate)</th><th>Vch Type</th><th>Vch No.</th><th>Quantity (L)</th><th>Value (RWF)</th><th>Actions</th></tr></thead>
              <tbody>{[...filtered].reverse().map(l=>(
                <tr key={l.id}>
                  <td style={{ color:'var(--text2)' }}>{l.date}</td>
                  <td style={{ fontFamily:'DM Mono,monospace', color:'var(--blue)', fontWeight:700 }}>{l.fleetVehicle?.plate||'—'}{l.filledBy&&l.filledBy!=='Tally Import'?<span style={{ fontFamily:'Nunito,sans-serif', color:'var(--text2)', fontWeight:500, marginLeft:6 }}>— {l.filledBy}</span>:null}</td>
                  <td style={{ color:'var(--text2)', fontSize:12 }}>Consumption (Usage)</td>
                  <td style={{ fontFamily:'DM Mono,monospace', fontSize:12, color:'var(--text3)' }}>{l.station||'—'}</td>
                  <td style={{ fontWeight:700 }}>{l.liters}L</td>
                  <td style={{ fontFamily:'DM Mono,monospace', color:'var(--green)', fontWeight:700 }}>{(l.totalCost||0).toLocaleString()}</td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="btn btn-ghost" style={{ padding:'5px 10px', fontSize:12 }} onClick={() => openEdit(l)}>Edit</button>
                      <button className="btn btn-danger" style={{ padding:'5px 10px', fontSize:12 }} onClick={() => handleDelete(l)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </div>
      </div>
      {/* ── Delete by Month Modal ── */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowDeleteModal(false)}>
          <div className="modal" style={{ maxWidth:420 }}>
            <div className="modal-header">
              <div className="modal-title" style={{ color:'var(--red)' }}>Delete by Month</div>
              <X onClick={()=>setShowDeleteModal(false)}/>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom:20 }}>
                <label className="form-label">Select Month to Delete *</label>
                <select className="form-input" style={{ appearance:'auto' }} value={deleteMonth} onChange={e=>setDeleteMonth(e.target.value)}>
                  <option value="">— Select a month —</option>
                  {MONTHS.map(m => {
                    const monthIndex = MONTHS.indexOf(m) + 1
                    const count = logs.filter(l => l.date && new Date(l.date).getMonth() + 1 === monthIndex).length
                    return <option key={m} value={m}>{m} {count > 0 ? `(${count} records)` : '(no records)'}</option>
                  })}
                </select>
                {deleteMonth && (() => {
                  const monthIndex = MONTHS.indexOf(deleteMonth) + 1
                  const count = logs.filter(l => l.date && new Date(l.date).getMonth() + 1 === monthIndex).length
                  return <div style={{ fontSize:11, color:'#dc2626', marginTop:6, fontWeight:600 }}>
                    ⚠️ This will permanently delete {count} fuel log record{count !== 1 ? 's' : ''} for {deleteMonth}
                  </div>
                })()}
              </div>
              <div style={{ background:'#fff5f5', border:'1px solid #fca5a5', borderRadius:10, padding:'12px 14px', fontSize:13, color:'#dc2626' }}>
                This action cannot be undone. All fuel log entries for the selected month will be permanently deleted.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setShowDeleteModal(false)}>Cancel</button>
              <button className="btn" style={{ background:'var(--red)', color:'#fff', opacity: deleteMonth?1:0.5 }} onClick={handleDeleteMonth} disabled={!deleteMonth || deleting}>
                {deleting ? 'Deleting...' : 'Delete All Records'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Import Month Modal ── */}
      {showImportModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowImportModal(false)}>
          <div className="modal" style={{ maxWidth:420 }}>
            <div className="modal-header">
              <div className="modal-title">Import Tally Excel</div>
              <X onClick={()=>setShowImportModal(false)}/>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom:20 }}>
                <label className="form-label">Select Month to Import *</label>
                <select className="form-input" style={{ appearance:'auto' }} value={selectedMonth} onChange={e=>setSelectedMonth(e.target.value)}>
                  <option value="">— Select a month —</option>
                  {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                {selectedMonth && <div style={{ fontSize:11, color:'var(--blue)', marginTop:6, fontWeight:600 }}>Only {selectedMonth} records will be imported from the file</div>}
              </div>
              <div style={{ background:'var(--surface2)', borderRadius:10, padding:'12px 14px', fontSize:13, color:'var(--text2)', lineHeight:1.6 }}>
                <strong style={{ color:'var(--text)' }}>How it works:</strong><br/>
                1. Select the month above<br/>
                2. Click "Choose File" and pick your Tally Excel<br/>
                3. Only records from that month will be imported
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setShowImportModal(false)}>Cancel</button>
              <label className="btn btn-blue" style={{ cursor: selectedMonth ? 'pointer' : 'not-allowed', opacity: selectedMonth ? 1 : 0.5, position:'relative' }}>
                Choose File & Import
                <input type="file" accept=".xlsx,.xls" onChange={e=>{ if(selectedMonth){ setShowImportModal(false); handleImportExcel(e) } }} style={{ position:'absolute', inset:0, opacity:0, cursor: selectedMonth?'pointer':'not-allowed' }} disabled={!selectedMonth || importing}/>
              </label>
            </div>
          </div>
        </div>
      )}

      {showAdd && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowAdd(false)}>
          <div className="modal" style={{ maxWidth:520 }}>
            <div className="modal-header">
              <div className="modal-title">{editing ? 'Edit Fuel Log' : 'Log Fuel Fill'}</div>
              <X onClick={()=>{ setShowAdd(false); setEditing(null) }}/>
            </div>
            <div className="modal-body">
              <div style={{ fontSize:11, fontWeight:800, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:14, paddingBottom:8, borderBottom:'1px solid var(--border)' }}>Same format as Tally Excel</div>
              <div className="form-group"><label className="form-label">Particulars (Fleet Vehicle) *</label>
                <select className="form-input" style={{ appearance:'auto' }} value={form.fleetVehicleId} onChange={e=>sf('fleetVehicleId',e.target.value)}>
                  {fleet.map(v=><option key={v.id} value={v.id}>{v.plate} — {v.make} {v.model}</option>)}
                </select>
              </div>
              <div className="form-row" style={{ marginBottom:14 }}>
                <div><label className="form-label">Date *</label><input className="form-input" type="date" value={form.date} onChange={e=>sf('date',e.target.value)}/></div>
                <div><label className="form-label">Vch No.</label><input className="form-input" placeholder="e.g. DIAOF/4301636" value={form.station} onChange={e=>sf('station',e.target.value)}/></div>
              </div>
              <div className="form-row" style={{ marginBottom:14 }}>
                <div><label className="form-label">Quantity / Outwards (Liters) *</label><input className="form-input" type="number" placeholder="e.g. 175.5" value={form.liters} onChange={e=>sf('liters',e.target.value)}/></div>
                <div><label className="form-label">Value (RWF) *</label><input className="form-input" type="number" placeholder="e.g. 333450" value={form.totalCost} onChange={e=>sf('totalCost',e.target.value)}/></div>
              </div>
              <div className="form-group"><label className="form-label">Assignment (e.g. OXI, BLUEBAND)</label><input className="form-input" placeholder="Department or client" value={form.filledBy} onChange={e=>sf('filledBy',e.target.value)}/></div>
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

// ─── INVENTORY ────────────────────────────────────────────────────────────────
function InventoryPage({ user }) {
  const [items, setItems] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('ALL')
  const canEdit = user.role==='manager'||user.role==='supervisor'
  const empty = { name:'', category:'PART', description:'', quantity:0, minQuantity:5, unitPrice:0, unit:'pcs', supplier:'', location:'' }
  const [form, setForm] = useState(empty)
  const sf = (k,v) => setForm(f=>({...f,[k]:v}))
  useEffect(()=>{ fetchItems() },[])
  const fetchItems = async () => { try { const r=await api.get('/inventory'); setItems(r.data) } catch(e){console.error(e)} }
  const handleSave = async () => {
    if (!form.name) { alert('Item name required'); return }
    try {
      if (editing) await api.put(`/inventory/${editing.id}`, form)
      else await api.post('/inventory', form)
      fetchItems(); setShowAdd(false); setEditing(null); setForm(empty)
    } catch { alert('Failed to save item') }
  }
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return
    try { await api.delete(`/inventory/${id}`); fetchItems() } catch { alert('Failed to delete') }
  }
  const filtered = items.filter(i => {
    const q=search.toLowerCase()
    return (catFilter==='ALL'||i.category===catFilter) && (!q||i.name?.toLowerCase().includes(q)||i.supplier?.toLowerCase().includes(q))
  })
  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Inventory</div><div className="page-sub">Parts, tools and consumables</div></div>
        {canEdit && <button className="btn btn-success" onClick={()=>{ setForm(empty); setEditing(null); setShowAdd(true) }}>+ Add Item</button>}
      </div>
      <div className="page-content">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
          {[['Total',items.length,'var(--blue)'],['In Stock',items.filter(i=>i.status==='In_Stock').length,'var(--green)'],['Low Stock',items.filter(i=>i.status==='Low_Stock').length,'#f59e0b'],['Out of Stock',items.filter(i=>i.status==='Out_of_Stock').length,'var(--red)']].map(([l,v,c])=>(
            <div key={l} className="stat-card" style={{ padding:'16px 18px' }}><div style={{ fontSize:12, color:'var(--text2)', marginBottom:6, fontWeight:600 }}>{l}</div><div style={{ fontFamily:'Nunito,sans-serif', fontSize:26, fontWeight:800, color:c }}>{v}</div></div>
          ))}
        </div>
        <div style={{ display:'flex', gap:10, marginBottom:16 }}>
          <input className="form-input" style={{ flex:1 }} placeholder="Search items..." value={search} onChange={e=>setSearch(e.target.value)}/>
          <div style={{ display:'flex', gap:4, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, padding:4 }}>
            {['ALL','PART','TOOL','CONSUMABLE'].map(c=>(
              <button key={c} className="tab-btn" onClick={()=>setCatFilter(c)}
                style={{ background:catFilter===c?'var(--blue)':'transparent', color:catFilter===c?'#fff':'var(--text2)', padding:'6px 14px' }}>{c}</button>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Stock List</div><span style={{ fontSize:12, color:'var(--text2)', fontWeight:600 }}>{filtered.length} items</span></div>
          {filtered.length===0 ? <div style={{ padding:48, textAlign:'center', color:'var(--text3)' }}><div style={{ fontSize:36, marginBottom:12 }}>📦</div><div>No items found</div></div> : (
            <table className="table">
              <thead><tr><th>Item</th><th>Category</th><th>Qty</th><th>Unit Price</th><th>Location</th><th>Status</th>{canEdit&&<th>Actions</th>}</tr></thead>
              <tbody>{filtered.map(item=>{ const st=INV_STATUS[item.status]||INV_STATUS['In_Stock']; return (
                <tr key={item.id}>
                  <td><div style={{ fontWeight:600 }}>{item.name}</div>{item.supplier&&<div style={{ fontSize:11, color:'var(--text3)' }}>{item.supplier}</div>}</td>
                  <td><span style={{ fontSize:11, background:'var(--surface2)', color:'var(--text2)', borderRadius:6, padding:'3px 8px', fontWeight:600 }}>{item.category}</span></td>
                  <td style={{ fontFamily:'DM Mono,monospace', fontWeight:600 }}>{item.quantity} {item.unit}</td>
                  <td style={{ fontFamily:'DM Mono,monospace', color:'var(--green)' }}>{(item.unitPrice||0).toLocaleString()} RWF</td>
                  <td style={{ color:'var(--text2)', fontSize:13 }}>{item.location||'—'}</td>
                  <td><span style={{ fontSize:11, fontWeight:700, borderRadius:20, padding:'3px 10px', background:st.bg, color:st.color }}>{item.status?.replace('_',' ')}</span></td>
                  {canEdit&&<td><div style={{ display:'flex', gap:6 }}>
                    <button className="btn btn-ghost" style={{ padding:'5px 10px', fontSize:12 }} onClick={()=>{ setForm({...item}); setEditing(item); setShowAdd(true) }}>Edit</button>
                    <button className="btn btn-danger" style={{ padding:'5px 10px', fontSize:12 }} onClick={()=>handleDelete(item.id)}>Del</button>
                  </div></td>}
                </tr>
              )})}
              </tbody>
            </table>
          )}
        </div>
      </div>


      {showAdd && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowAdd(false)}>
          <div className="modal" style={{ maxWidth:540, maxHeight:'90vh', overflowY:'auto' }}>
            <div className="modal-header"><div className="modal-title">{editing?'Edit Item':'Add Inventory Item'}</div><X onClick={()=>{ setShowAdd(false); setEditing(null) }}/></div>
            <div className="modal-body">
              <div className="form-row" style={{ marginBottom:14 }}>
                <div><label className="form-label">Item Name *</label><input className="form-input" value={form.name} onChange={e=>sf('name',e.target.value)} placeholder="e.g. Oil Filter"/></div>
                <div><label className="form-label">Category *</label>
                  <select className="form-input" style={{ appearance:'auto' }} value={form.category} onChange={e=>sf('category',e.target.value)}>
                    <option value="PART">Part</option><option value="TOOL">Tool</option><option value="CONSUMABLE">Consumable</option>
                  </select>
                </div>
              </div>
              <div className="form-group"><label className="form-label">Description</label><input className="form-input" value={form.description} onChange={e=>sf('description',e.target.value)} placeholder="Optional"/></div>
              <div className="form-row" style={{ marginBottom:14 }}>
                <div><label className="form-label">Quantity *</label><input className="form-input" type="text" value={form.quantity} onChange={e=>sf('quantity',parseInt(e.target.value)||0)}/></div>
                <div><label className="form-label">Unit *</label>
                  <select className="form-input" style={{ appearance:'auto' }} value={form.unit} onChange={e=>sf('unit',e.target.value)}>
                    {['pcs','liters','kg','meters','boxes','sets'].map(u=><option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row" style={{ marginBottom:14 }}>
                <div><label className="form-label">Min Qty</label><input className="form-input" type="number" value={form.minQuantity} onChange={e=>sf('minQuantity',parseInt(e.target.value)||0)}/></div>
                <div><label className="form-label">Price (RWF)</label><input className="form-input" type="text" value={form.unitPrice} onChange={e=>sf('unitPrice',parseInt(e.target.value)||0)}/></div>
              </div>
              <div className="form-row">
                <div><label className="form-label">Supplier</label><input className="form-input" value={form.supplier} onChange={e=>sf('supplier',e.target.value)} placeholder="Supplier name"/></div>
                <div><label className="form-label">Location</label><input className="form-input" value={form.location} onChange={e=>sf('location',e.target.value)} placeholder="e.g. Shelf A-3"/></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>{ setShowAdd(false); setEditing(null) }}>Cancel</button>
              <button className="btn btn-success" onClick={handleSave}>{editing?'Save Changes':'Add Item'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ─── STAFF ────────────────────────────────────────────────────────────────────
function StaffPage() {
  const [staff, setStaff] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null)
  const [addForm, setAddForm] = useState({ name:'', email:'', password:'', role:'mechanic' })
  const [editForm, setEditForm] = useState({ name:'', email:'', newPassword:'', role:'mechanic' })
  const [addError, setAddError] = useState('')
  const [editError, setEditError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ fetchStaff() },[])
  const fetchStaff = async () => { try { const r=await api.get('/auth/users'); setStaff(r.data) } catch { setStaff([]) } }

  const handleCreate = async () => {
    if (!addForm.name||!addForm.email||!addForm.password) { setAddError('All fields required'); return }
    setLoading(true); setAddError('')
    try {
      await api.post('/auth/register', addForm)
      setAddForm({name:'',email:'',password:'',role:'mechanic'})
      setShowAddModal(false); fetchStaff()
    } catch { setAddError('Failed. Email may already exist.') }
    setLoading(false)
  }

  const openEdit = (s) => {
    setEditingStaff(s)
    setEditForm({ name: s.name, email: s.email, newPassword: '', role: s.role })
    setEditError('')
    setShowEditModal(true)
  }

  const handleEdit = async () => {
    if (!editForm.name || !editForm.email) { setEditError('Name and email are required'); return }
    setLoading(true); setEditError('')
    try {
      const payload = { name: editForm.name, email: editForm.email, role: editForm.role }
      if (editForm.newPassword.trim()) payload.password = editForm.newPassword.trim()
      await api.put(`/auth/users/${editingStaff.id}`, payload)
      setShowEditModal(false); fetchStaff()
    } catch { setEditError('Failed to update. Try again.') }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this staff member?')) return
    try { await api.delete(`/auth/users/${id}`); fetchStaff() } catch { alert('Failed') }
  }

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Staff Management</div><div className="page-sub">Manage team accounts and credentials</div></div>
        <button className="btn btn-success" onClick={()=>setShowAddModal(true)}>+ Add Staff</button>
      </div>
      <div className="page-content">
        <div className="card">
          <div className="card-header"><div className="card-title">Team Members</div><span style={{ fontSize:12, color:'var(--text2)', fontWeight:600 }}>{staff.length} members</span></div>
          <table className="table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
            <tbody>{staff.map(s=>{ const rc=ROLE_CONFIG[s.role]; return (
              <tr key={s.id}>
                <td style={{ fontWeight:600 }}>{s.name}</td>
                <td style={{ color:'var(--text2)', fontFamily:'DM Mono,monospace', fontSize:13 }}>{s.email}</td>
                <td><span style={{ display:'inline-flex', alignItems:'center', padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:700, background:rc?.bg, color:rc?.color }}>{rc?.label}</span></td>
                <td>
                  <div style={{ display:'flex', gap:6 }}>
                    <button className="btn btn-ghost" style={{ padding:'6px 12px', fontSize:12 }} onClick={()=>openEdit(s)}>✏️ Edit</button>
                    <button className="btn btn-danger" style={{ padding:'6px 12px', fontSize:12 }} onClick={()=>handleDelete(s.id)}>Remove</button>
                  </div>
                </td>
              </tr>
            )})}</tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowAddModal(false)}>
          <div className="modal">
            <div className="modal-header"><div className="modal-title">Add Staff Member</div><X onClick={()=>setShowAddModal(false)}/></div>
            <div className="modal-body">
              {addError && <div className="error-msg">{addError}</div>}
              <div className="form-row" style={{ marginBottom:14 }}>
                <div><label className="form-label">Full Name</label><input className="form-input" value={addForm.name} onChange={e=>setAddForm(f=>({...f,name:e.target.value}))}/></div>
                <div><label className="form-label">Role</label>
                  <select className="form-input" style={{ appearance:'auto' }} value={addForm.role} onChange={e=>setAddForm(f=>({...f,role:e.target.value}))}>
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

      {showEditModal && editingStaff && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowEditModal(false)}>
          <div className="modal">
            <div className="modal-header"><div className="modal-title">Edit Staff Member</div><X onClick={()=>setShowEditModal(false)}/></div>
            <div className="modal-body">
              {editError && <div className="error-msg">{editError}</div>}
              <div style={{ background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 16px', marginBottom:20, display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:40, height:40, borderRadius:'50%', background:ROLE_CONFIG[editingStaff.role]?.color||'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:16, flexShrink:0 }}>
                  {editingStaff.name?.split(' ').map(n=>n[0]).join('')}
                </div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700 }}>{editingStaff.name}</div>
                  <div style={{ fontSize:12, color:'var(--text2)' }}>Editing account details</div>
                </div>
              </div>
              <div className="form-row" style={{ marginBottom:14 }}>
                <div><label className="form-label">Full Name</label><input className="form-input" value={editForm.name} onChange={e=>setEditForm(f=>({...f,name:e.target.value}))}/></div>
                <div><label className="form-label">Role</label>
                  <select className="form-input" style={{ appearance:'auto' }} value={editForm.role} onChange={e=>setEditForm(f=>({...f,role:e.target.value}))}>
                    <option value="mechanic">Mechanic</option><option value="supervisor">Supervisor</option><option value="manager">Manager</option>
                  </select>
                </div>
              </div>
              <div className="form-group"><label className="form-label">Email (Username)</label><input className="form-input" type="email" value={editForm.email} onChange={e=>setEditForm(f=>({...f,email:e.target.value}))}/></div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input className="form-input" type="password" placeholder="Leave blank to keep current password" value={editForm.newPassword} onChange={e=>setEditForm(f=>({...f,newPassword:e.target.value}))}/>
                <div style={{ fontSize:11, color:'var(--text3)', marginTop:5 }}>🔒 Only fill this in if you want to change the password</div>
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

// ─── VEHICLE MODAL ────────────────────────────────────────────────────────────
function VehicleModal({ vehicle, onSave, onClose }) {
  const empty = { plate:'', make:'', model:'', year:new Date().getFullYear(), color:'', vin:'', type:'Sedan', ownerName:'', ownerPhone:'', ownerEmail:'', ownerCompany:'', status:'Ready', mileage:0, driverName:'', driverPhone:'', driverLicense:'' }
  const [form, setForm] = useState(vehicle||empty)
  const [fleet, setFleet] = useState([])
  const [selectedFleetId, setSelectedFleetId] = useState('')
  const s = (k,v) => setForm(f=>({...f,[k]:v}))

  useEffect(() => {
    if (!vehicle) {
      api.get('/fleet').then(r => setFleet(Array.isArray(r.data) ? r.data : r.data?.content || [])).catch(()=>{})
    }
  }, [])

  const handleFleetSelect = (id) => {
    setSelectedFleetId(id)
    if (!id) { setForm(empty); return }
    const fv = fleet.find(f => String(f.id) === String(id))
    if (fv) {
      setForm(f => ({
        ...f,
        plate: fv.plate || '',
        make: fv.make || '',
        model: fv.model || '',
        year: fv.year || new Date().getFullYear(),
        color: fv.color || '',
        type: fv.type || 'Sedan',
        mileage: fv.mileage || 0,
        vin: fv.vin || '',
        driverName: fv.driverName || '',
        driverPhone: fv.driverPhone || '',
        driverLicense: fv.driverLicense || '',
      }))
    }
  }

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{ maxHeight:'90vh', overflowY:'auto', maxWidth:560 }}>
        <div className="modal-header"><div className="modal-title">{vehicle?'Edit Vehicle':'Register New Vehicle'}</div><X onClick={onClose}/></div>
        <div className="modal-body">
          {!vehicle && fleet.length > 0 && (
            <div className="form-group" style={{ marginBottom:20 }}>
              <label className="form-label" style={{ color:'var(--blue)' }}>Pre-fill from Fleet Vehicle (optional)</label>
              <select className="form-input" style={{ appearance:'auto', borderColor: selectedFleetId ? 'var(--blue)' : 'var(--border)', background: selectedFleetId ? 'rgba(37,99,235,0.04)' : 'var(--surface2)' }}
                value={selectedFleetId} onChange={e => handleFleetSelect(e.target.value)}>
                <option value="">— Type manually / Register new vehicle —</option>
                {fleet.map(v => <option key={v.id} value={v.id}>{v.plate} — {v.make} {v.model} ({v.year})</option>)}
              </select>
              {selectedFleetId && <div style={{ fontSize:11, color:'var(--blue)', marginTop:5, fontWeight:600 }}>Pre-filled from fleet — you can still edit any field below</div>}
            </div>
          )}
          <div style={{ fontSize:11, fontWeight:800, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:14, paddingBottom:8, borderBottom:'1px solid var(--border)' }}>Vehicle Details</div>
          <div className="form-row" style={{ marginBottom:14 }}>
            <div><label className="form-label">Plate *</label><input className="form-input" value={form.plate} onChange={e=>s('plate',e.target.value.toUpperCase())} placeholder="KCA 123A"/></div>
            <div><label className="form-label">Status *</label><select className="form-input" style={{ appearance:'auto' }} value={form.status} onChange={e=>s('status',e.target.value)}>{['Ready','In_Service','Awaiting_Parts','Completed'].map(x=><option key={x}>{x}</option>)}</select></div>
          </div>
          <div className="form-row" style={{ marginBottom:14 }}>
            <div><label className="form-label">Make *</label><input className="form-input" value={form.make} onChange={e=>s('make',e.target.value)} placeholder="Toyota"/></div>
            <div><label className="form-label">Model *</label><input className="form-input" value={form.model} onChange={e=>s('model',e.target.value)} placeholder="Hilux"/></div>
          </div>
          <div className="form-row" style={{ marginBottom:14 }}>
            <div><label className="form-label">Year *</label><input className="form-input" type="number" value={form.year} onChange={e=>s('year',e.target.value)}/></div>
            <div><label className="form-label">Color *</label><input className="form-input" value={form.color} onChange={e=>s('color',e.target.value)} placeholder="White"/></div>
          </div>
          <div className="form-row" style={{ marginBottom:14 }}>
            <div><label className="form-label">Type *</label><select className="form-input" style={{ appearance:'auto' }} value={form.type} onChange={e=>s('type',e.target.value)}>{['Sedan','SUV','Pickup Truck','Van','Minibus','Truck','Motorcycle'].map(t=><option key={t}>{t}</option>)}</select></div>
            <div><label className="form-label">Mileage (km) *</label><input className="form-input" type="number" value={form.mileage} onChange={e=>s('mileage',e.target.value)}/></div>
          </div>
          <div style={{ fontSize:11, fontWeight:800, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.08em', margin:'20px 0 14px', paddingBottom:8, borderBottom:'1px solid var(--border)' }}>Owner Information</div>
          <div className="form-row" style={{ marginBottom:14 }}>
            <div><label className="form-label">Owner Name *</label><input className="form-input" value={form.ownerName} onChange={e=>s('ownerName',e.target.value)} placeholder="Full name"/></div>
            <div><label className="form-label">Phone *</label><input className="form-input" value={form.ownerPhone} onChange={e=>s('ownerPhone',e.target.value)} placeholder="+250 788 000 000"/></div>
          </div>
          <div className="form-row">
            <div><label className="form-label">Email *</label><input className="form-input" value={form.ownerEmail} onChange={e=>s('ownerEmail',e.target.value)}/></div>
            <div><label className="form-label">Company *</label><input className="form-input" value={form.ownerCompany} onChange={e=>s('ownerCompany',e.target.value)}/></div>
          </div>
          <div style={{ fontSize:11, fontWeight:800, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.08em', margin:'20px 0 14px', paddingBottom:8, borderBottom:'1px solid var(--border)' }}>Driver Information</div>
          <div className="form-row" style={{ marginBottom:14 }}>
            <div><label className="form-label">Driver Name *</label><input className="form-input" value={form.driverName} onChange={e=>s('driverName',e.target.value)} placeholder="Full name"/></div>
            <div><label className="form-label">Driver Phone *</label><input className="form-input" value={form.driverPhone} onChange={e=>s('driverPhone',e.target.value)} placeholder="+250 788 000 000"/></div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-success" onClick={()=>{
            const missing = []
            if (!form.plate) missing.push('Plate')
            if (!form.make) missing.push('Make')
            if (!form.model) missing.push('Model')
            if (!form.color) missing.push('Color')
            if (!form.mileage) missing.push('Mileage')
            if (!form.ownerName) missing.push('Owner Name')
            if (!form.ownerPhone) missing.push('Owner Phone')
            if (!form.ownerEmail) missing.push('Owner Email')
            if (!form.ownerCompany) missing.push('Company')
            if (!form.driverName) missing.push('Driver Name')
            if (!form.driverPhone) missing.push('Driver Phone')
            if (missing.length > 0) { alert('Required fields missing:\n• ' + missing.join('\n• ')); return }
            onSave(form)
          }}>{vehicle?'Save Changes':'Register Vehicle'}</button>
        </div>
      </div>
    </div>
  )
}

// ─── SERVICE MODAL ────────────────────────────────────────────────────────────
function ServiceModal({ onSave, onClose, currentUser }) {
  const [form, setForm] = useState({ date:new Date().toISOString().split('T')[0], type:'Oil Change', description:'', cost:'', mechanic:currentUser.name, parts:'' })
  const s = (k,v) => setForm(f=>({...f,[k]:v}))
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-header"><div className="modal-title">Log Service / Repair</div><X onClick={onClose}/></div>
        <div className="modal-body">
          <div className="form-row" style={{ marginBottom:14 }}>
            <div><label className="form-label">Service Type</label><select className="form-input" style={{ appearance:'auto' }} value={form.type} onChange={e=>s('type',e.target.value)}>{['Oil Change','Brake Service','Engine Repair','Transmission','Tire Service','Electrical','Body Work','Engine Diagnostic','Suspension','Other'].map(t=><option key={t}>{t}</option>)}</select></div>
            <div><label className="form-label">Date</label><input className="form-input" type="date" value={form.date} onChange={e=>s('date',e.target.value)}/></div>
          </div>
          <div className="form-group"><label className="form-label">Description *</label><textarea className="form-input" rows={3} value={form.description} onChange={e=>s('description',e.target.value)} placeholder="Describe the work done..." style={{ resize:'vertical' }}/></div>
          <div className="form-row" style={{ marginBottom:14 }}>
            <div><label className="form-label">Cost (RWF)</label><input className="form-input" type="text" value={form.cost} onChange={e=>s('cost',e.target.value)}/></div>
            <div><label className="form-label">Mechanic</label><input className="form-input" value={form.mechanic} onChange={e=>s('mechanic',e.target.value)}/></div>
          </div>
          <div className="form-group"><label className="form-label">Parts Used (comma separated)</label><input className="form-input" value={form.parts} onChange={e=>s('parts',e.target.value)} placeholder="Oil Filter, Brake Pads x2..."/></div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-blue" onClick={()=>{ if (!form.description){alert('Description required');return} onSave({...form,cost:parseInt(form.cost)||0,parts:form.parts?form.parts.split(',').map(p=>p.trim()).filter(Boolean):[]}) }}>Log Service</button>
        </div>
      </div>
    </div>
  )
}

// ─── FLEET MODAL ──────────────────────────────────────────────────────────────
function FleetModal({ vehicle, onSave, onClose }) {
  const empty = { plate:'', make:'', model:'', cardNumber:'', year:new Date().getFullYear(), color:'', vin:'', type:'Sedan', mileage:0, driverName:'', driverPhone:'', driverLicense:'', insuranceCompany:'', insuranceNumber:'', insuranceExpiry:'', inspectionExpiry:'', status:'Active' }
  const [form, setForm] = useState(vehicle||empty)
  const s = (k,v) => setForm(f=>({...f,[k]:v}))
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{ maxHeight:'90vh', overflowY:'auto', maxWidth:580 }}>
        <div className="modal-header"><div className="modal-title">{vehicle?'Edit Fleet Vehicle':'Add Fleet Vehicle'}</div><X onClick={onClose}/></div>
        <div className="modal-body">
          <div style={{ fontSize:11, fontWeight:800, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:14, paddingBottom:8, borderBottom:'1px solid var(--border)' }}>Vehicle Details</div>
          <div className="form-row" style={{ marginBottom:14 }}>
            <div><label className="form-label">Plate *</label><input className="form-input" value={form.plate} onChange={e=>s('plate',e.target.value.toUpperCase())} placeholder="RAA 001A"/></div>
            <div><label className="form-label">Status *</label><select className="form-input" style={{ appearance:'auto' }} value={form.status} onChange={e=>s('status',e.target.value)}>{['Active','In_Maintenance','Out_of_Service'].map(x=><option key={x}>{x}</option>)}</select></div>
          </div>
          <div className="form-row" style={{ marginBottom:14 }}>
            <div><label className="form-label">Make *</label><input className="form-input" value={form.make} onChange={e=>s('make',e.target.value)}/></div>
            <div><label className="form-label">Model *</label><input className="form-input" value={form.model} onChange={e=>s('model',e.target.value)}/></div>
          </div>
          <div className="form-row" style={{ marginBottom:14 }}>
            <div><label className="form-label">Card Number *</label><input className="form-input" value={form.cardNumber} onChange={e=>s('cardNumber',e.target.value.toUpperCase())} style={{ fontFamily:'DM Mono,monospace' }}/></div>
            <div><label className="form-label">Company Department *</label><select className="form-input" style={{ appearance:'auto' }} value={form.companyDepartment} onChange={e=>s('companyDepartment',e.target.value)}>{['--Please Select--','Blue_Band','Colgate','OXI','Nestle','Indomie'].map(x=><option key={x}>{x}</option>)}</select></div>
          </div>
          <div className="form-row" style={{ marginBottom:14 }}>
            <div><label className="form-label">Year *</label><input className="form-input" type="number" value={form.year} onChange={e=>s('year',e.target.value)}/></div>
            <div><label className="form-label">Color *</label><input className="form-input" value={form.color} onChange={e=>s('color',e.target.value)}/></div>
          </div>
          <div className="form-row" style={{ marginBottom:14 }}>
            <div><label className="form-label">Type *</label><select className="form-input" style={{ appearance:'auto' }} value={form.type} onChange={e=>s('type',e.target.value)}>{['Sedan','SUV','Pickup Truck','Van','Minibus','Truck','Motorcycle'].map(t=><option key={t}>{t}</option>)}</select></div>
            <div><label className="form-label">Mileage (km) *</label><input className="form-input" type="number" value={form.mileage} onChange={e=>s('mileage',e.target.value)}/></div>
          </div>
          <div style={{ fontSize:11, fontWeight:800, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.08em', margin:'20px 0 14px', paddingBottom:8, borderBottom:'1px solid var(--border)' }}>Assigned Driver</div>
          <div className="form-row" style={{ marginBottom:14 }}>
            <div><label className="form-label">Driver Name *</label><input className="form-input" value={form.driverName} onChange={e=>s('driverName',e.target.value)}/></div>
            <div><label className="form-label">Driver Phone *</label><input className="form-input" value={form.driverPhone} onChange={e=>s('driverPhone',e.target.value)}/></div>
          </div>
          <div className="form-group"><label className="form-label">License Identification *</label><input className="form-input" value={form.driverLicense} onChange={e=>s('driverLicense',e.target.value)}/></div>
          <div style={{ fontSize:11, fontWeight:800, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.08em', margin:'20px 0 14px', paddingBottom:8, borderBottom:'1px solid var(--border)' }}>Insurance & Documents</div>
          <div className="form-row" style={{ marginBottom:14 }}>
            <div><label className="form-label">Insurance Company *</label><input className="form-input" value={form.insuranceCompany} onChange={e=>s('insuranceCompany',e.target.value)}/></div>
            <div><label className="form-label">Insurance Number *</label><input className="form-input" value={form.insuranceNumber} onChange={e=>s('insuranceNumber',e.target.value)}/></div>
          </div>
          <div className="form-row" style={{ marginBottom:14 }}>
            <div><label className="form-label">Insurance Expiry *</label><input className="form-input" type="date" value={form.insuranceExpiry} onChange={e=>s('insuranceExpiry',e.target.value)}/></div>
          </div>
          <div className="form-row">
            <div><label className="form-label">Inspection Issued Date *</label><input className="form-input" type="date" value={form.inspectionIssuedDate} onChange={e=>s('inspectionIssuedDate',e.target.value)}/></div>
            <div><label className="form-label">Inspection Expiry Date *</label><input className="form-input" type="date" value={form.inspectionExpiry} onChange={e=>s('inspectionExpiry',e.target.value)}/></div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-blue" onClick={()=>{
            const missing = []
            if (!form.plate) missing.push('Plate')
            if (!form.make) missing.push('Make')
            if (!form.model) missing.push('Model')
            if (!form.color) missing.push('Color')
            if (!form.mileage) missing.push('Mileage')
            if (!form.driverName) missing.push('Driver Name')
            if (!form.driverPhone) missing.push('Driver Phone')
            if (!form.insuranceCompany) missing.push('Insurance Company')
            if (!form.insuranceNumber) missing.push('Insurance Number')
            if (!form.insuranceExpiry) missing.push('Insurance Expiry')
            if (!form.inspectionExpiry) missing.push('Inspection Expiry')
            if (missing.length > 0) { alert('Required fields missing:\n• ' + missing.join('\n• ')); return }
            onSave(form)
          }}>{vehicle?'Save Changes':'Add Vehicle'}</button>
        </div>
      </div>
    </div>
  )
}

// ─── VEHICLE DETAIL ───────────────────────────────────────────────────────────
function VehicleDetail({ vehicle, user, onBack, onUpdate }) {
  const [showService, setShowService] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [history, setHistory] = useState([])
  const ss = STATUS_STYLE[vehicle.status]||STATUS_STYLE['Ready']
  const canEdit = user.role==='manager'||user.role==='supervisor'
  const totalSpend = history.reduce((s,h)=>s+(h.cost||0),0)
  useEffect(() => {
    api.get(`/vehicles/${vehicle.id}/history`).then(r => setHistory(Array.isArray(r.data) ? r.data : []))
  }, [vehicle.id])
  const addService = async (entry) => {
    try { await api.post(`/vehicles/${vehicle.id}/history`,entry); const r=await api.get(`/vehicles/${vehicle.id}`); const h=await api.get(`/vehicles/${vehicle.id}/history`); onUpdate({...r.data, serviceHistory: h.data}); setShowService(false) }
    catch { alert('Failed to log service') }
  }
  const saveEdit = async (data) => {
    try { const r=await api.put(`/vehicles/${vehicle.id}`,data); onUpdate(r.data); setShowEdit(false) } catch { alert('Failed to update') }
  }
  const deleteVehicle = async () => {
    if(!window.confirm('Are you sure you want to delete this vehicle?')) return
    try { await api.delete(`/vehicles/${vehicle.id}`); onBack() } catch { alert('Failed to delete vehicle') }
  }
  return (
    <>
      <div className="page-header">
        <div>
          <button onClick={onBack} style={{ background:'none', border:'none', color:'var(--text2)', cursor:'pointer', fontFamily:'Nunito,sans-serif', fontSize:14, marginBottom:12, padding:0, fontWeight:600 }}>← Back to Vehicles</button>
          <div className="page-title">{vehicle.make} {vehicle.model}</div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:8 }}>
            <span style={{ fontFamily:'DM Mono,monospace', color:'var(--blue)', fontSize:15, fontWeight:700 }}>{vehicle.plate}</span>
            <span style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:12, fontWeight:700, borderRadius:20, padding:'4px 10px', background:ss.bg, color:ss.color }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:ss.dot, display:'inline-block' }}/>{vehicle.status?.replace('_',' ')}
            </span>
          </div>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          {canEdit&&<button className="btn btn-ghost" onClick={()=>setShowEdit(true)}>Edit</button>}
          {canEdit&&<button style={{ backgroundColor:'var(--red)', color:'white', border:'none', padding:'8px 16px', borderRadius:'8px', cursor:'pointer', fontFamily:'Nunito,sans-serif', fontWeight:700, fontSize:14 }} onClick={deleteVehicle}>Delete</button>}
          <button className="btn btn-blue" onClick={()=>setShowService(true)}>+ Log Service</button>
        </div>
      </div>
      <div className="page-content">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
          {[['Total Services',history.length,'All time'],['Total Spend',totalSpend.toLocaleString(),'RWF'],['Mileage',Number(vehicle.mileage||0).toLocaleString(),'km'],['Year',vehicle.year,vehicle.color]].map(([l,v,s])=>(
            <div key={l} className="card" style={{ padding:'18px 20px' }}>
              <div style={{ fontSize:12, color:'var(--text2)', marginBottom:8, fontWeight:600 }}>{l}</div>
              <div style={{ fontFamily:'Nunito,sans-serif', fontSize:24, fontWeight:800, color:'var(--text)' }}>{v}</div>
              <div style={{ fontSize:12, color:'var(--text3)', marginTop:4 }}>{s}</div>
            </div>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
          <div className="card">
            <div className="card-header"><div className="card-title">Vehicle Information</div></div>
            <div style={{ padding:20 }}>
              {[['Make',vehicle.make],['Model',vehicle.model],['Year',vehicle.year],['Color',vehicle.color],['Type',vehicle.type],['Plate',vehicle.plate],['VIN',vehicle.vin||'—'],['Mileage',`${Number(vehicle.mileage||0).toLocaleString()} km`]].map(([k,v])=>(
                <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                  <span style={{ fontSize:13, color:'var(--text2)', fontWeight:600 }}>{k}</span><span style={{ fontSize:13, fontWeight:600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">Owner Information</div></div>
            <div style={{ padding:20 }}>
              {[['Name',vehicle.ownerName],['Phone',vehicle.ownerPhone||'—'],['Email',vehicle.ownerEmail||'—'],['Company',vehicle.ownerCompany||'—']].map(([k,v])=>(
                <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                  <span style={{ fontSize:13, color:'var(--text2)', fontWeight:600 }}>{k}</span><span style={{ fontSize:13, fontWeight:600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Service & Repair History</div><span style={{ fontSize:12, color:'var(--text2)', fontWeight:600 }}>{history.length} records</span></div>
          {history.length===0 ? <div style={{ padding:48, textAlign:'center', color:'var(--text3)' }}><div style={{ fontSize:36, marginBottom:12 }}>📋</div><div>No service records yet</div></div>
            : [...history].reverse().map(h=>(
              <div key={h.id} style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)', display:'flex', gap:16 }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--surface2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>🔧</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:700, marginBottom:3 }}>{h.type}</div>
                  <div style={{ fontSize:13, color:'var(--text2)', marginBottom:6 }}>{h.description}</div>
                  {h.parts?.length>0&&<div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>{h.parts.map((p,i)=><span key={i} style={{ fontSize:11, background:'var(--surface2)', color:'var(--text3)', borderRadius:4, padding:'2px 8px' }}>{p}</span>)}</div>}
                  <div style={{ fontSize:12, color:'var(--text3)', marginTop:6 }}>by {h.mechanic}</div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ fontFamily:'DM Mono,monospace', fontSize:14, color:'var(--green)', fontWeight:700 }}>{(h.cost||0).toLocaleString()} RWF</div>
                  <div style={{ fontSize:11, color:'var(--text3)', marginTop:3 }}>{h.date}</div>
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

// ─── VEHICLES PAGE ────────────────────────────────────────────────────────────
function VehiclesPage({ user }) {
  const [tab, setTab] = useState('garage')
  const [vehicles, setVehicles] = useState([])
  const [fleet, setFleet] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [showAddFleet, setShowAddFleet] = useState(false)
  const [editFleet, setEditFleet] = useState(null)
  const [loading, setLoading] = useState(true)
  const canAdd = user.role==='manager'||user.role==='supervisor'

  useEffect(()=>{ fetchVehicles(); fetchFleet() },[])
  const fetchVehicles = async () => { try { const r=await api.get('/vehicles'); setVehicles(Array.isArray(r.data) ? r.data : r.data?.content || []) } catch { alert('Failed to load vehicles') } setLoading(false) }
  const fetchFleet = async () => { try { const r=await api.get('/fleet'); setFleet(Array.isArray(r.data) ? r.data : r.data?.content || []) } catch(e){console.error(e)} }
  const addVehicle = async (data) => { try { await api.post('/vehicles',data); fetchVehicles(); setShowAdd(false) } catch { alert('Failed') } }
  const addFleetVehicle = async (data) => { try { if (editFleet) await api.put(`/fleet/${editFleet.id}`,data); else await api.post('/fleet',data); fetchFleet(); setShowAddFleet(false); setEditFleet(null) } catch { alert('Failed') } }
  const updateVehicle = (u) => { setVehicles(p=>p.map(v=>v.id===u.id?u:v)); setSelected(u) }

  const filtered = (vehicles||[]).filter(v => {
    const q=search.toLowerCase()
    return (filter==='All'||v.status===filter)&&(!q||v.plate?.toLowerCase().includes(q)||v.make?.toLowerCase().includes(q)||v.model?.toLowerCase().includes(q)||v.ownerName?.toLowerCase().includes(q))
  })

  if (selected) return <VehicleDetail vehicle={selected} user={user} onBack={()=>setSelected(null)} onUpdate={updateVehicle}/>

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Vehicles</div><div className="page-sub">{tab==='garage'?`${vehicles.length} garage vehicles`:`${fleet.length} fleet vehicles`}</div></div>
        <div style={{ display:'flex', gap:10 }}>
          {tab==='garage'&&<button className="btn btn-success" onClick={()=>setShowAdd(true)}>+ Register Vehicle</button>}
          {canAdd&&tab==='fleet'&&<button className="btn btn-blue" onClick={()=>{ setEditFleet(null); setShowAddFleet(true) }}>+ Add Fleet Vehicle</button>}
        </div>
      </div>
      <div className="page-content">
        <div style={{ display:'flex', gap:4, marginBottom:20, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, padding:4, width:'fit-content' }}>
          {[['garage','🚗','Garage'],['fleet','🚛','Fleet']].map(([key,icon,label])=>(
            <button key={key} className="tab-btn" onClick={()=>setTab(key)} style={{ background:tab===key?'var(--blue)':'transparent', color:tab===key?'#fff':'var(--text2)' }}>{icon} {label}</button>
          ))}
        </div>
        {tab==='garage'&&(
          <>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
              {Object.entries(STATUS_STYLE).map(([status,ss])=>(
                <div key={status} className="card" style={{ padding:'16px 20px', cursor:'pointer', borderColor:filter===status?ss.dot:undefined }} onClick={()=>setFilter(filter===status?'All':status)}>
                  <div style={{ fontSize:12, color:'var(--text2)', marginBottom:6, fontWeight:600 }}>{status.replace('_',' ')}</div>
                  <div style={{ fontFamily:'Nunito,sans-serif', fontSize:26, fontWeight:800, color:ss.dot }}>{vehicles.filter(v=>v.status===status).length}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:10, marginBottom:16 }}>
              <input style={{ flex:1, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, padding:'10px 14px', color:'var(--text)', fontFamily:'Nunito,sans-serif', fontSize:14, outline:'none' }} placeholder="Search plate, make, model, owner..." value={search} onChange={e=>setSearch(e.target.value)}/>
              <select style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, padding:'10px 14px', color:'var(--text)', fontFamily:'Nunito,sans-serif', fontSize:14, outline:'none' }} value={filter} onChange={e=>setFilter(e.target.value)}>
                <option value="All">All Status</option>{Object.keys(STATUS_STYLE).map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            {loading?<div style={{ textAlign:'center', padding:48, color:'var(--text3)' }}>Loading...</div>:
              filtered.length===0?<div className="card" style={{ padding:48, textAlign:'center', color:'var(--text3)' }}><div style={{ fontSize:40, marginBottom:12 }}>🚗</div><div>No vehicles found</div></div>:(
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16 }}>
                {filtered.map(v=>{ const ss=STATUS_STYLE[v.status]||STATUS_STYLE['Ready']; return (
                  <div key={v.id} onClick={()=>setSelected(v)} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:20, cursor:'pointer', transition:'all 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}
                    onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--blue)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.1)' }} onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontFamily:'DM Mono,monospace', fontSize:18, color:'var(--blue)', marginBottom:4, fontWeight:700 }}>{v.plate}</div>
                    <div style={{ fontFamily:'Nunito,sans-serif', fontSize:16, fontWeight:800, marginBottom:10 }}>{v.make} {v.model}</div>
                    <div style={{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap' }}>{[v.year,v.type,v.color].filter(Boolean).map((m,i)=><span key={i} style={{ fontSize:12, color:'var(--text2)', background:'var(--surface2)', borderRadius:6, padding:'3px 8px', fontWeight:600 }}>{m}</span>)}</div>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                      <span style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:12, fontWeight:700, borderRadius:20, padding:'4px 10px', background:ss.bg, color:ss.color }}><span style={{ width:6, height:6, borderRadius:'50%', background:ss.dot, display:'inline-block' }}/>{v.status?.replace('_',' ')}</span>
                      <span style={{ fontSize:12, color:'var(--text3)', fontWeight:600 }}>{(v.serviceHistory||[]).length} services</span>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, paddingTop:12, borderTop:'1px solid var(--border)' }}>
                      <div style={{ width:28, height:28, background:'var(--blue)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#fff' }}>{v.ownerName?.[0]}</div>
                      <div><div style={{ fontSize:13, fontWeight:600 }}>{v.ownerName}</div>{v.ownerCompany&&<div style={{ fontSize:11, color:'var(--text2)' }}>{v.ownerCompany}</div>}</div>
                    </div>
                  </div>
                )})}
              </div>
            )}
          </>
        )}
        {tab==='fleet'&&(
          fleet.length===0?<div className="card" style={{ padding:48, textAlign:'center', color:'var(--text3)' }}><div style={{ fontSize:40, marginBottom:12 }}>🚛</div><div>No fleet vehicles yet</div></div>:(
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16 }}>
            {fleet.map(v=>{ const ss=FLEET_STATUS[v.status]||FLEET_STATUS['Active']; return (
              <div key={v.id} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:20, transition:'all 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--blue)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.1)' }} onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <div><div style={{ fontFamily:'DM Mono,monospace', fontSize:16, color:'var(--blue)', marginBottom:3, fontWeight:700 }}>{v.plate}</div><div style={{ fontFamily:'Nunito,sans-serif', fontSize:15, fontWeight:800 }}>{v.make} {v.model}</div></div>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:700, borderRadius:20, padding:'3px 8px', background:ss.bg, color:ss.color }}><span style={{ width:5, height:5, borderRadius:'50%', background:ss.dot, display:'inline-block' }}/>{v.status?.replace('_',' ')}</span>
                </div>
                <div style={{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap' }}>{[v.year,v.type,v.color].filter(Boolean).map((m,i)=><span key={i} style={{ fontSize:11, color:'var(--text2)', background:'var(--surface2)', borderRadius:6, padding:'2px 8px', fontWeight:600 }}>{m}</span>)}</div>
                {v.driverName&&<div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 0', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)', margin:'10px 0' }}><span style={{ fontSize:16 }}>👤</span><div><div style={{ fontSize:13, fontWeight:600 }}>{v.driverName}</div><div style={{ fontSize:11, color:'var(--text2)' }}>{v.driverPhone}</div></div></div>}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:10 }}>
                  <div style={{ background:'var(--surface2)', borderRadius:8, padding:'8px 10px' }}><div style={{ fontSize:10, color:'var(--text3)', marginBottom:2, fontWeight:700 }}>MILEAGE</div><div style={{ fontSize:13, fontWeight:700 }}>{Number(v.mileage||0).toLocaleString()} km</div></div>
                  <div style={{ background:'var(--surface2)', borderRadius:8, padding:'8px 10px' }}><div style={{ fontSize:10, color:'var(--text3)', marginBottom:2, fontWeight:700 }}>INS. EXPIRY</div><div style={{ fontSize:13, fontWeight:700 }}>{v.insuranceExpiry||'—'}</div></div>
                </div>
                <div style={{ marginTop:10, display:'flex', justifyContent:'flex-end', gap:8 }}>
                  <button className="btn btn-ghost" style={{ padding:'6px 14px', fontSize:12 }} onClick={e=>{ e.stopPropagation(); setEditFleet(v); setShowAddFleet(true) }}>Edit</button>
                  <button className="btn btn-danger" style={{ padding:'6px 14px', fontSize:12 }} onClick={async e=>{ e.stopPropagation(); if (!window.confirm('Delete this fleet vehicle?')) return; try { await api.delete(`/fleet/${v.id}`); fetchFleet() } catch { alert('Failed to delete') } }}>Delete</button>
                </div>
              </div>
            )})}
          </div>
          )
        )}
      </div>
      {showAdd&&<VehicleModal onSave={addVehicle} onClose={()=>setShowAdd(false)}/>}
      {showAddFleet&&<FleetModal vehicle={editFleet} onSave={addFleetVehicle} onClose={()=>{ setShowAddFleet(false); setEditFleet(null) }}/>}
    </>
  )
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [alertCount, setAlertCount] = useState(0)
  useEffect(()=>{
    const s=localStorage.getItem('user')
    if(s){ const u=JSON.parse(s); setUser(u); if(u.role!=='manager') setActiveTab('alerts') }
  },[])
  const handleLogin = (u) => { setUser(u); setActiveTab(u.role==='manager'?'dashboard':'alerts') }
  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); setActiveTab('dashboard') }
  return (
    <>
      <style>{styles}</style>
      {!user?<LoginPage onLogin={handleLogin}/>:(
        <div className="app">
          <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} alertCount={alertCount}/>
          <div className="main">
            {activeTab==='dashboard'&&user.role==='manager'&&<DashboardPage onAlertsChange={setAlertCount}/>}
            {activeTab==='alerts'&&(user.role==='supervisor'||user.role==='mechanic')&&<AlertsDashboard onAlertsChange={setAlertCount}/>}
            {activeTab==='vehicles'&&<VehiclesPage user={user}/>}
            {activeTab==='fuel'&&<FuelLogsPage user={user}/>}
            {activeTab==='inventory'&&<InventoryPage user={user}/>}
            {activeTab==='staff'&&user.role==='manager'&&<StaffPage/>}
            {activeTab==='expenses'&&user.role==='manager'&&<ExpensesPage/>}
            {activeTab==='reports'&&user.role==='manager'&&<ReportsPage/>}
          </div>
        </div>
      )}
    </>
  )
}