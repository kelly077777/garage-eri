import { useState, useEffect } from 'react'
import api from './api/client'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0f0f11; --surface: #18181c; --surface2: #222228; --surface3: #2a2a32;
    --border: #2e2e38; --text: #f0f0f4; --text2: #9090a8; --text3: #5a5a70;
    --accent: #f59e0b; --accent2: #fbbf24; --blue: #3b82f6; --green: #10b981; --red: #ef4444;
  }
  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; min-height: 100vh; }
  .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg); position: relative; overflow: hidden; }
  .login-bg { position: absolute; inset: 0; background: radial-gradient(ellipse at 20% 50%, rgba(245,158,11,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.06) 0%, transparent 50%); }
  .login-grid { position: absolute; inset: 0; background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 40px 40px; opacity: 0.3; }
  .login-card { position: relative; width: 420px; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 48px; animation: slideUp 0.5s ease; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  .form-label { display: block; font-size: 12px; font-weight: 600; color: var(--text2); letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 8px; }
  .form-input { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 12px 14px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color 0.2s; }
  .form-input:focus { border-color: var(--accent); }
  .form-input::placeholder { color: var(--text3); }
  .btn-primary { background: var(--accent); color: #000; width: 100%; padding: 14px; font-size: 15px; font-weight: 600; border: none; border-radius: 8px; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
  .btn-primary:hover { background: var(--accent2); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  .error-msg { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); border-radius: 8px; padding: 10px 14px; color: #fca5a5; font-size: 13px; margin-bottom: 16px; }
  .app { display: flex; min-height: 100vh; }
  .sidebar { width: 240px; background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; flex-shrink: 0; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; font-size: 14px; color: var(--text2); cursor: pointer; transition: all 0.15s; font-weight: 500; border: none; background: none; width: 100%; text-align: left; }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: rgba(245,158,11,0.12); color: var(--accent); }
  .main { flex: 1; overflow-y: auto; }
  .page-header { padding: 28px 32px 0; display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
  .page-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
  .page-sub { color: var(--text2); font-size: 14px; margin-top: 4px; }
  .page-content { padding: 0 32px 32px; }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
  .card-header { padding: 18px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .card-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; }
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 18px; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s; }
  .btn-success { background: var(--green); color: #fff; } .btn-success:hover { background: #059669; }
  .btn-blue { background: var(--blue); color: #fff; } .btn-blue:hover { background: #2563eb; }
  .btn-accent { background: var(--accent); color: #000; } .btn-accent:hover { background: var(--accent2); }
  .btn-ghost { background: transparent; color: var(--text2); border: 1px solid var(--border); } .btn-ghost:hover { background: var(--surface2); color: var(--text); }
  .btn-danger { background: rgba(239,68,68,0.1); color: var(--red); border: 1px solid rgba(239,68,68,0.2); }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; width: 100%; max-width: 480px; animation: slideUp 0.2s ease; }
  .modal-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .modal-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; }
  .modal-body { padding: 24px; }
  .modal-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; gap: 10px; justify-content: flex-end; }
  .table { width: 100%; border-collapse: collapse; }
  .table th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid var(--border); }
  .table td { padding: 14px 16px; font-size: 14px; border-bottom: 1px solid var(--border); }
  .table tr:last-child td { border: none; }
  .table tr:hover td { background: var(--surface2); }
  .form-group { margin-bottom: 16px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
  .tab-btn { display: flex; align-items: center; gap: 8px; padding: 8px 18px; border-radius: 8px; border: none; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
`

const ROLE_CONFIG = {
  manager: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Manager' },
  supervisor: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', label: 'Supervisor' },
  mechanic: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Mechanic' },
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
    } catch { setError('Invalid email or password.') }
    setLoading(false)
  }
  return (
    <div className="login-wrap">
      <div className="login-bg" /><div className="login-grid" />
      <div className="login-card">
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:32 }}>
          <div style={{ width:44, height:44, background:'#f59e0b', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>🔧</div>
          <div style={{ fontFamily:'Syne,sans-serif', fontSize:20, fontWeight:800 }}>ERI-<span style={{ color:'#f59e0b' }}>RWANDA</span></div>
        </div>
        <div style={{ fontFamily:'Syne,sans-serif', fontSize:26, fontWeight:700, marginBottom:6 }}>Welcome back</div>
        <div style={{ color:'#9090a8', fontSize:14, marginBottom:28 }}>Sign in to your garage management portal</div>
        {error && <div className="error-msg">{error}</div>}
        <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="you@garage.com" value={email} onChange={e => { setEmail(e.target.value); setError('') }} /></div>
        <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e => { setPassword(e.target.value); setError('') }} onKeyDown={e => e.key === 'Enter' && handleLogin()} /></div>
        <button className="btn-primary" onClick={handleLogin} disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
      </div>
    </div>
  )
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ user, activeTab, setActiveTab, onLogout }) {
  const rc = ROLE_CONFIG[user.role]
  const initials = user.name.split(' ').map(n => n[0]).join('')
  const N = (key, icon, label) => (
    <button key={key} className={`nav-item ${activeTab === key ? 'active' : ''}`} onClick={() => setActiveTab(key)}>
      <span>{icon}</span> {label}
    </button>
  )
  return (
    <div className="sidebar">
      <div style={{ padding:'24px 20px 20px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:36, height:36, background:'#f59e0b', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🔧</div>
        <div style={{ fontFamily:'Syne,sans-serif', fontSize:16, fontWeight:800 }}>ERI-<span style={{ color:'#f59e0b' }}>RWANDA</span></div>
      </div>
      <nav style={{ flex:1, padding:'16px 10px', display:'flex', flexDirection:'column', gap:2 }}>
        <div style={{ padding:'8px 12px 6px', fontSize:10, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Main</div>
        {N('dashboard','📊','Dashboard')}
        {N('vehicles','🚗','Vehicles')}
        {user.role === 'manager' && N('fuel','⛽','Fuel Logs')}
        {N('inventory','📦','Inventory')}
        {user.role === 'manager' && N('staff','👥','Staff')}
      </nav>
      <div style={{ padding:16, borderTop:'1px solid var(--border)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:10, background:'var(--surface2)', borderRadius:10, marginBottom:10 }}>
          <div style={{ width:34, height:34, borderRadius:'50%', background:rc.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:13, color:'#000' }}>{initials}</div>
          <div><div style={{ fontSize:13, fontWeight:600 }}>{user.name}</div><div style={{ fontSize:11, color:'var(--text2)' }}>{rc.label}</div></div>
        </div>
        <button onClick={onLogout} style={{ width:'100%', background:'transparent', border:'1px solid var(--border)', color:'var(--text2)', borderRadius:8, padding:8, fontSize:13, cursor:'pointer', fontFamily:'DM Sans,sans-serif' }}>Sign Out →</button>
      </div>
    </div>
  )
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardPage() {
  const [d, setD] = useState({ vehicles:[], fleet:[], fuel:[], inventory:[], staff:[] })
  useEffect(() => {
    Promise.all([api.get('/vehicles'), api.get('/fleet'), api.get('/fleet/fuel/all'), api.get('/inventory'), api.get('/auth/users')])
      .then(([v,f,fuel,inv,s]) => setD({ vehicles: Array.isArray(v.data) ? v.data : v.data?.content || [], fleet: Array.isArray(f.data) ? f.data : f.data?.content || [], fuel: Array.isArray(fuel.data) ? fuel.data : fuel.data?.content || [],
         inventory: Array.isArray(inv.data) ? inv.data : inv.data?.content || [],
         staff: Array.isArray(s.data) ? s.data : s.data?.content || [] }))
      .catch(e => console.error(e))}, [])

  const totalFuelCost = (d.fuel||[]).reduce((s,f) => s+(f.totalCost||0), 0)
  const totalServiceCost = 0
  const lowStock = (d.inventory||[]).filter(i => i.status==='Low_Stock'||i.status==='Out_of_Stock')

  const stats = [
    { label:'Garage Vehicles', value:d.vehicles.length, sub:`${d.vehicles.filter(v=>v.status==='In_Service').length} in service`, icon:'🚗', color:'#f59e0b' },
    { label:'Fleet Vehicles', value:d.fleet.length, sub:`${d.fleet.filter(f=>f.status==='Active').length} active`, icon:'🚛', color:'#3b82f6' },
    { label:'Fuel Consumption', value:totalFuelCost.toLocaleString()+' RWF', sub:'All time', icon:'⛽', color:'#10b981' },
    { label:'Service Expenses', value:totalServiceCost.toLocaleString()+' RWF', sub:'All time', icon:'🔧', color:'#8b5cf6' },
    { label:'Staff Members', value:d.staff.length, sub:`${d.staff.filter(s=>s.role==='mechanic').length} mechanics`, icon:'👥', color:'#ec4899' },
    { label:'Inventory Items', value:d.inventory.length, sub:`${lowStock.length} low/out of stock`, icon:'📦', color:lowStock.length>0?'#ef4444':'#10b981' },
  ]

  return (
    <>
      <div className="page-header"><div><div className="page-title">Dashboard</div><div className="page-sub">Overview of your garage operations</div></div></div>
      <div className="page-content">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24 }}>
          {stats.map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <div style={{ fontSize:13, color:'var(--text2)', marginBottom:8 }}>{s.label}</div>
                  <div style={{ fontFamily:'Syne,sans-serif', fontSize:26, fontWeight:800, color:s.color }}>{s.value}</div>
                  <div style={{ fontSize:12, color:'var(--text3)', marginTop:4 }}>{s.sub}</div>
                </div>
                <div style={{ fontSize:28 }}>{s.icon}</div>
              </div>
            </div>
          ))}
        </div>
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
                      <span style={{ fontSize:13, color:'var(--text2)' }}>{status.replace('_',' ')}</span>
                      <span style={{ fontSize:13, fontWeight:600 }}>{count}</span>
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
            <div className="card-header"><div className="card-title">Stock Alerts</div><span style={{ fontSize:12, color:lowStock.length>0?'#ef4444':'var(--text2)' }}>{lowStock.length} items need attention</span></div>
            {lowStock.length===0 ? (
              <div style={{ padding:32, textAlign:'center', color:'var(--text3)' }}><div style={{ fontSize:28, marginBottom:8 }}>✅</div><div>All items well stocked</div></div>
            ) : (
              <div style={{ maxHeight:220, overflowY:'auto' }}>
                {lowStock.map(item => (
                  <div key={item.id} style={{ padding:'12px 20px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div><div style={{ fontSize:13, fontWeight:500 }}>{item.name}</div><div style={{ fontSize:11, color:'var(--text3)' }}>{item.category}</div></div>
                    <span style={{ fontSize:11, fontWeight:600, borderRadius:20, padding:'3px 8px', background:INV_STATUS[item.status]?.bg, color:INV_STATUS[item.status]?.color }}>{item.quantity} {item.unit} left</span>
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
                    <td style={{ fontFamily:'DM Mono,monospace', color:'#3b82f6', fontSize:13 }}>{f.fleetVehicle?.plate||'—'}</td>
                    <td style={{ color:'var(--text2)' }}>{f.date}</td>
                    <td>{f.liters}L</td>
                    <td style={{ fontFamily:'DM Mono,monospace', color:'#f59e0b' }}>{(f.totalCost||0).toLocaleString()} RWF</td>
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

// ─── FUEL LOGS ────────────────────────────────────────────────────────────────
function FuelLogsPage({ user }) {
  const [logs, setLogs] = useState([])
  const [fleet, setFleet] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [filterVehicle, setFilterVehicle] = useState('all')
  const [reportType, setReportType] = useState('range') // 'range' or 'month'
  const [reportFrom, setReportFrom] = useState(new Date().toISOString().split('T')[0])
  const [reportTo, setReportTo] = useState(new Date().toISOString().split('T')[0])
  const [reportMonth, setReportMonth] = useState(new Date().toISOString().slice(0,7))
  const [form, setForm] = useState({ fleetVehicleId:'', date:new Date().toISOString().split('T')[0], liters:'', costPerLiter:'', totalCost:'', mileageAtFill:'', filledBy:user.name, station:'' })
  const sf = (k,v) => setForm(f=>({...f,[k]:v}))

  useEffect(() => { fetchData() }, [])
  const fetchData = async () => {
    try {
      const [l,f] = await Promise.all([api.get('/fleet/fuel/all'), api.get('/fleet')])
      setLogs(l.data); setFleet(f.data)
      if (f.data.length>0) setForm(fr=>({...fr, fleetVehicleId:f.data[0].id}))
    } catch(e) { console.error(e) }
  }

  const handleAdd = async () => {
    if (!form.fleetVehicleId||!form.liters||!form.date) { alert('Vehicle, date and liters required'); return }
    try {
      await api.post(`/fleet/${form.fleetVehicleId}/fuel`, { ...form, liters:parseFloat(form.liters), costPerLiter:parseInt(form.costPerLiter)||0, totalCost:parseInt(form.totalCost)||0, mileageAtFill:parseInt(form.mileageAtFill)||0 })
      fetchData(); setShowAdd(false)
    } catch { alert('Failed to log fuel') }
  }

  const filtered = filterVehicle==='all' ? logs : logs.filter(l=>l.fleetVehicle?.id===parseInt(filterVehicle))
  const totalL = filtered.reduce((s,l)=>s+(l.liters||0),0)
  const totalC = filtered.reduce((s,l)=>s+(l.totalCost||0),0)

  const getReportData = () => {
    return logs.filter(l => {
      const d = l.date
      if (reportType==='range') return d >= reportFrom && d <= reportTo
      if (reportType==='month') return d && d.slice(0,7)===reportMonth
      return true
    })
  }

  const exportExcel = () => {
    const data = getReportData()
    if (data.length===0) { alert('No data for selected period'); return }
    const period = reportType==='range' ? `${reportFrom} to ${reportTo}` : reportMonth
    const totalLiters = data.reduce((s,l)=>s+(l.liters||0),0)
    const totalCost = data.reduce((s,l)=>s+(l.totalCost||0),0)
    const rows = [
      ['ERI-RWANDA - Fuel Consumption Report'],
      [`Period: ${period}`],
      [`Generated: ${new Date().toLocaleDateString()}`],
      [],
      ['Vehicle','Date','Liters (L)','Cost/L (RWF)','Total Cost (RWF)','Mileage (km)','Station','Filled By'],
      ...data.map(l=>[
        l.fleetVehicle?.plate||'—',
        l.date,
        l.liters,
        l.costPerLiter||0,
        l.totalCost||0,
        l.mileageAtFill||0,
        l.station||'—',
        l.filledBy||'—'
      ]),
      [],
      ['TOTALS','',totalLiters.toFixed(1),'',totalCost,'','','']
    ]
    const csv = rows.map(r=>r.map(c=>`"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type:'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `fuel-report-${period}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const exportPDF = () => {
    const data = getReportData()
    if (data.length===0) { alert('No data for selected period'); return }
    const period = reportType==='range' ? `${reportFrom} to ${reportTo}` : reportMonth
    const totalLiters = data.reduce((s,l)=>s+(l.liters||0),0)
    const totalCost = data.reduce((s,l)=>s+(l.totalCost||0),0)
    const rows = data.map(l=>`
      <tr>
        <td>${l.fleetVehicle?.plate||'—'}</td>
        <td>${l.date}</td>
        <td>${l.liters}L</td>
        <td>${l.costPerLiter||0} RWF</td>
        <td>${(l.totalCost||0).toLocaleString()} RWF</td>
        <td>${l.mileageAtFill?l.mileageAtFill.toLocaleString()+' km':'—'}</td>
        <td>${l.station||'—'}</td>
        <td>${l.filledBy||'—'}</td>
      </tr>`).join('')
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Fuel Report</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 30px; color: #111; }
      h1 { font-size: 22px; margin-bottom: 4px; }
      p { color: #555; font-size: 13px; margin: 2px 0; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
      th { background: #f59e0b; color: #000; padding: 8px; text-align: left; }
      td { padding: 7px 8px; border-bottom: 1px solid #eee; }
      tr:nth-child(even) td { background: #fafafa; }
      .totals td { font-weight: bold; background: #fff8e1; border-top: 2px solid #f59e0b; }
      .footer { margin-top: 20px; font-size: 11px; color: #888; }
    </style></head><body>
    <h1>⛽ ERI-RWANDA Fuel Consumption Report</h1>
    <p>Period: ${period}</p>
    <p>Generated: ${new Date().toLocaleDateString()}</p>
    <p>Total Entries: ${data.length}</p>
    <table>
      <thead><tr><th>Vehicle</th><th>Date</th><th>Liters</th><th>Cost/L</th><th>Total Cost</th><th>Mileage</th><th>Station</th><th>Filled By</th></tr></thead>
      <tbody>${rows}
      <tr class="totals"><td>TOTAL</td><td></td><td>${totalLiters.toFixed(1)}L</td><td></td><td>${totalCost.toLocaleString()} RWF</td><td></td><td></td><td></td></tr>
      </tbody>
    </table>
    <div class="footer">ERI-RWANDA Garage Management System</div>
    </body></html>`
    const w = window.open('','_blank')
    w.document.write(html)
    w.document.close()
    w.print()
  }

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">⛽ Fuel Logs</div><div className="page-sub">Track fuel consumption for fleet vehicles</div></div>
        <div style={{ display:'flex', gap:10 }}>
          {user.role==='manager' && <button className="btn btn-ghost" onClick={()=>setShowReport(true)}>📊 Generate Report</button>}
          <button className="btn btn-accent" onClick={()=>setShowAdd(true)}>+ Log Fuel Fill</button>
        </div>
      </div>
      <div className="page-content">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:20 }}>
          {[['Total Fills',filtered.length,'Log entries','#3b82f6'],['Total Liters',totalL.toFixed(1)+'L','Consumed','#10b981'],['Total Cost',totalC.toLocaleString()+' RWF','Expenditure','#f59e0b']].map(([l,v,s,c])=>(
            <div key={l} className="stat-card"><div style={{ fontSize:13, color:'var(--text2)', marginBottom:8 }}>{l}</div><div style={{ fontFamily:'Syne,sans-serif', fontSize:24, fontWeight:800, color:c }}>{v}</div><div style={{ fontSize:12, color:'var(--text3)', marginTop:4 }}>{s}</div></div>
          ))}
        </div>
        <div style={{ marginBottom:16 }}>
          <select className="form-input" style={{ maxWidth:260, appearance:'auto' }} value={filterVehicle} onChange={e=>setFilterVehicle(e.target.value)}>
            <option value="all">All Fleet Vehicles</option>
            {fleet.map(v=><option key={v.id} value={v.id}>{v.plate} — {v.make} {v.model}</option>)}
          </select>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Fuel History</div><span style={{ fontSize:12, color:'var(--text2)' }}>{filtered.length} entries</span></div>
          {filtered.length===0 ? <div style={{ padding:48, textAlign:'center', color:'var(--text3)' }}><div style={{ fontSize:36, marginBottom:12 }}>⛽</div><div>No fuel logs yet</div></div> : (
            <table className="table">
              <thead><tr><th>Vehicle</th><th>Date</th><th>Liters</th><th>Cost/L</th><th>Total</th><th>Mileage</th><th>Station</th><th>By</th></tr></thead>
              <tbody>
                {[...filtered].reverse().map(l=>(
                  <tr key={l.id}>
                    <td style={{ fontFamily:'DM Mono,monospace', color:'#3b82f6', fontSize:13 }}>{l.fleetVehicle?.plate||'—'}</td>
                    <td style={{ color:'var(--text2)' }}>{l.date}</td>
                    <td style={{ fontWeight:600 }}>{l.liters}L</td>
                    <td style={{ color:'var(--text2)' }}>{l.costPerLiter?`${l.costPerLiter} RWF`:'—'}</td>
                    <td style={{ fontFamily:'DM Mono,monospace', color:'#f59e0b' }}>{(l.totalCost||0).toLocaleString()} RWF</td>
                    <td style={{ color:'var(--text2)' }}>{l.mileageAtFill?`${l.mileageAtFill.toLocaleString()} km`:'—'}</td>
                    <td style={{ color:'var(--text2)' }}>{l.station||'—'}</td>
                    <td style={{ color:'var(--text2)' }}>{l.filledBy||'—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showReport && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowReport(false)}>
          <div className="modal" style={{ maxWidth:480 }}>
            <div className="modal-header"><div className="modal-title">📊 Generate Fuel Report</div><X onClick={()=>setShowReport(false)}/></div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Report Type</label>
                <select className="form-input" style={{ appearance:'auto' }} value={reportType} onChange={e=>setReportType(e.target.value)}>
                  <option value="range">Date Range</option>
                  <option value="month">By Month</option>
                </select>
              </div>
              {reportType==='range' ? (
                <div className="form-row" style={{ marginBottom:14 }}>
                  <div><label className="form-label">From Date</label><input className="form-input" type="date" value={reportFrom} onChange={e=>setReportFrom(e.target.value)}/></div>
                  <div><label className="form-label">To Date</label><input className="form-input" type="date" value={reportTo} onChange={e=>setReportTo(e.target.value)}/></div>
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Select Month</label>
                  <input className="form-input" type="month" value={reportMonth} onChange={e=>setReportMonth(e.target.value)}/>
                </div>
              )}
              <div style={{ background:'var(--surface2)', borderRadius:8, padding:12, fontSize:13, color:'var(--text2)', marginTop:8 }}>
                <strong style={{ color:'var(--text)' }}>{getReportData().length}</strong> entries found for selected period
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setShowReport(false)}>Cancel</button>
              <button className="btn btn-blue" onClick={exportExcel}>📥 Export Excel</button>
              <button className="btn btn-accent" onClick={exportPDF}>📄 Export PDF</button>
            </div>
          </div>
        </div>
      )}

      {showAdd && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowAdd(false)}>
          <div className="modal" style={{ maxWidth:520 }}>
            <div className="modal-header"><div className="modal-title">Log Fuel Fill</div><X onClick={()=>setShowAdd(false)}/></div>
            <div className="modal-body">
              <div className="form-group"><label className="form-label">Fleet Vehicle *</label>
                <select className="form-input" style={{ appearance:'auto' }} value={form.fleetVehicleId} onChange={e=>sf('fleetVehicleId',e.target.value)}>
                  {fleet.map(v=><option key={v.id} value={v.id}>{v.plate} — {v.make} {v.model}</option>)}
                </select>
              </div>
              <div className="form-row" style={{ marginBottom:14 }}>
                <div><label className="form-label">Date *</label><input className="form-input" type="date" value={form.date} onChange={e=>sf('date',e.target.value)}/></div>
                <div><label className="form-label">Liters *</label><input className="form-input" type="number" placeholder="45.5" value={form.liters} onChange={e=>sf('liters',e.target.value)}/></div>
              </div>
              <div className="form-row" style={{ marginBottom:14 }}>
                <div><label className="form-label">Cost per Liter (RWF)</label><input className="form-input" type="number" placeholder="1250" value={form.costPerLiter} onChange={e=>sf('costPerLiter',e.target.value)}/></div>
                <div><label className="form-label">Total Cost (RWF)</label><input className="form-input" type="number" placeholder="56250" value={form.totalCost} onChange={e=>sf('totalCost',e.target.value)}/></div>
              </div>
              <div className="form-row" style={{ marginBottom:14 }}>
                <div><label className="form-label">Mileage at Fill (km)</label><input className="form-input" type="number" placeholder="Odometer" value={form.mileageAtFill} onChange={e=>sf('mileageAtFill',e.target.value)}/></div>
                <div><label className="form-label">Station</label><input className="form-input" placeholder="Station name" value={form.station} onChange={e=>sf('station',e.target.value)}/></div>
              </div>
              <div className="form-group"><label className="form-label">Filled By</label><input className="form-input" value={form.filledBy} onChange={e=>sf('filledBy',e.target.value)}/></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setShowAdd(false)}>Cancel</button>
              <button className="btn btn-accent" onClick={handleAdd}>Log Fill</button>
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
        <div><div className="page-title">📦 Inventory </div><div className="page-sub">Parts, tools and consumables *</div></div>
        {canEdit && <button className="btn btn-success" onClick={()=>{ setForm(empty); setEditing(null); setShowAdd(true) }}>+ Add Item</button>}
      </div>
      <div className="page-content">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
          {[['Total',items.length,'#3b82f6'],['In Stock',items.filter(i=>i.status==='In_Stock').length,'#10b981'],['Low Stock',items.filter(i=>i.status==='Low_Stock').length,'#f59e0b'],['Out of Stock',items.filter(i=>i.status==='Out_of_Stock').length,'#ef4444']].map(([l,v,c])=>(
            <div key={l} className="stat-card" style={{ padding:'16px 18px' }}><div style={{ fontSize:12, color:'var(--text2)', marginBottom:6 }}>{l}</div><div style={{ fontFamily:'Syne,sans-serif', fontSize:26, fontWeight:800, color:c }}>{v}</div></div>
          ))}
        </div>
        <div style={{ display:'flex', gap:10, marginBottom:16 }}>
          <input className="form-input" style={{ flex:1 }} placeholder="Search items..." value={search} onChange={e=>setSearch(e.target.value)}/>
          <div style={{ display:'flex', gap:4, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, padding:4 }}>
            {['ALL','PART','TOOL','CONSUMABLE'].map(c=>(
              <button key={c} className="tab-btn" onClick={()=>setCatFilter(c)}
                style={{ background:catFilter===c?'var(--accent)':'transparent', color:catFilter===c?'#000':'var(--text2)', padding:'6px 14px' }}>{c}</button>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Stock List</div><span style={{ fontSize:12, color:'var(--text2)' }}>{filtered.length} items</span></div>
          {filtered.length===0 ? <div style={{ padding:48, textAlign:'center', color:'var(--text3)' }}><div style={{ fontSize:36, marginBottom:12 }}>📦</div><div>No items found</div></div> : (
            <table className="table">
              <thead><tr><th>Item</th><th>Category </th><th>Qty</th><th>Unit Price</th><th>Location</th><th>Status</th>{canEdit&&<th>Actions</th>}</tr></thead>
              <tbody>
                {filtered.map(item=>{
                  const st=INV_STATUS[item.status]||INV_STATUS['In_Stock']
                  return (
                    <tr key={item.id}>
                      <td><div style={{ fontWeight:500 }}>{item.name}</div>{item.supplier&&<div style={{ fontSize:11, color:'var(--text3)' }}>{item.supplier}</div>}</td>
                      <td><span style={{ fontSize:11, background:'var(--surface2)', color:'var(--text2)', borderRadius:6, padding:'3px 8px' }}>{item.category}</span></td>
                      <td style={{ fontFamily:'DM Mono,monospace' }}>{item.quantity} {item.unit}</td>
                      <td style={{ fontFamily:'DM Mono,monospace', color:'#f59e0b' }}>{(item.unitPrice||0).toLocaleString()} RWF</td>
                      <td style={{ color:'var(--text2)', fontSize:13 }}>{item.location||'—'}</td>
                      <td><span style={{ fontSize:11, fontWeight:600, borderRadius:20, padding:'3px 10px', background:st.bg, color:st.color }}>{item.status?.replace('_',' ')}</span></td>
                      {canEdit&&<td><div style={{ display:'flex', gap:6 }}>
                        <button className="btn btn-ghost" style={{ padding:'5px 10px', fontSize:12 }} onClick={()=>{ setForm({...item}); setEditing(item); setShowAdd(true) }}>Edit</button>
                        <button className="btn btn-danger" style={{ padding:'5px 10px', fontSize:12 }} onClick={()=>handleDelete(item.id)}>Del</button>
                      </div></td>}
                    </tr>
                  )
                })}
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
              <div className="form-group"><label className="form-label">Description *</label><input className="form-input" value={form.description} onChange={e=>sf('description',e.target.value)} placeholder="Optional"/></div>
              <div className="form-row" style={{ marginBottom:14 }}>
                <div><label className="form-label">Quantity *</label><input className="form-input" type="text" value={form.quantity} onChange={e=>sf('quantity',parseInt(e.target.value)||0)}/></div>
                <div><label className="form-label">Unit *</label>
                  <select className="form-input" style={{ appearance:'auto' }} value={form.unit} onChange={e=>sf('unit',e.target.value)}>
                    {['pcs','liters','kg','meters','boxes','sets'].map(u=><option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row" style={{ marginBottom:14 }}>
                <div><label className="form-label">Min Qty (alert threshold) *</label><input className="form-input" type="number" value={form.minQuantity} onChange={e=>sf('minQuantity',parseInt(e.target.value)||0)}/></div>
                <div><label className="form-label">Price (RWF) *</label><input className="form-input" type="text" value={form.unitPrice} onChange={e=>sf('unitPrice',parseInt(e.target.value)||0)}/></div>
              </div>
              <div className="form-row">
                <div><label className="form-label">Supplier *</label><input className="form-input" value={form.supplier} onChange={e=>sf('supplier',e.target.value)} placeholder="Supplier name"/></div>
                <div><label className="form-label">Location *</label><input className="form-input" value={form.location} onChange={e=>sf('location',e.target.value)} placeholder="e.g. Shelf A-3"/></div>
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
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'mechanic' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  useEffect(()=>{ fetchStaff() },[])
  const fetchStaff = async () => { try { const r=await api.get('/auth/users'); setStaff(r.data) } catch { setStaff([]) } }
  const handleCreate = async () => {
    if (!form.name||!form.email||!form.password) { setError('All fields required'); return }
    setLoading(true); setError('')
    try { await api.post('/auth/register',form); setForm({name:'',email:'',password:'',role:'mechanic'}); setShowModal(false); fetchStaff() }
    catch { setError('Failed. Email may already exist.') }
    setLoading(false)
  }
  const handleDelete = async (id) => { if (!window.confirm('Delete?')) return; try { await api.delete(`/auth/users/${id}`); fetchStaff() } catch { alert('Failed') } }
  return (
    <>
      <div className="page-header"><div><div className="page-title">Staff Management</div><div className="page-sub">Manage team accounts</div></div><button className="btn btn-success" onClick={()=>setShowModal(true)}>+ Add Staff</button></div>
      <div className="page-content">
        <div className="card">
          <div className="card-header"><div className="card-title">Team Members</div><span style={{ fontSize:12, color:'var(--text2)' }}>{staff.length} members</span></div>
          <table className="table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
            <tbody>{staff.map(s=>{ const rc=ROLE_CONFIG[s.role]; return (
              <tr key={s.id}>
                <td style={{ fontWeight:500 }}>{s.name}</td>
                <td style={{ color:'var(--text2)', fontFamily:'DM Mono,monospace', fontSize:13 }}>{s.email}</td>
                <td><span style={{ display:'inline-flex', alignItems:'center', padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:600, background:rc?.bg, color:rc?.color }}>{rc?.label}</span></td>
                <td><button className="btn btn-danger" style={{ padding:'6px 12px', fontSize:12 }} onClick={()=>handleDelete(s.id)}>Remove</button></td>
              </tr>
            )})}</tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal">
            <div className="modal-header"><div className="modal-title">Add Staff</div><X onClick={()=>setShowModal(false)}/></div>
            <div className="modal-body">
              {error&&<div className="error-msg">{error}</div>}
              <div className="form-row" style={{ marginBottom:14 }}>
                <div><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
                <div><label className="form-label">Role</label><select className="form-input" style={{ appearance:'auto' }} value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}><option value="mechanic">Mechanic</option><option value="supervisor">Supervisor</option><option value="manager">Manager</option></select></div>
              </div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/></div>
              <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))}/></div>
            </div>
            <div className="modal-footer"><button className="btn btn-ghost" onClick={()=>setShowModal(false)}>Cancel</button><button className="btn btn-success" onClick={handleCreate} disabled={loading}>{loading?'Creating...':'Create'}</button></div>
          </div>
        </div>
      )}
    </>
  )
}

// ─── VEHICLE MODAL ────────────────────────────────────────────────────────────
function VehicleModal({ vehicle, onSave, onClose }) {
  const empty = { plate:'', make:'', model:'', year:new Date().getFullYear(), color:'', vin:'', type:'Sedan', ownerName:'', ownerPhone:'', ownerEmail:'', ownerCompany:'', status:'Ready', mileage:0 }
  const [form, setForm] = useState(vehicle||empty)
  const s = (k,v) => setForm(f=>({...f,[k]:v}))
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{ maxHeight:'90vh', overflowY:'auto', maxWidth:560 }}>
        <div className="modal-header"><div className="modal-title">{vehicle?'Edit Vehicle':'Register New Vehicle'}</div><X onClick={onClose}/></div>
        <div className="modal-body">
          <div style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:14, paddingBottom:8, borderBottom:'1px solid var(--border)' }}>Vehicle Details</div>
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
          <div className="form-group"><label className="form-label">VIN</label><input className="form-input" value={form.vin} onChange={e=>s('vin',e.target.value.toUpperCase())} style={{ fontFamily:'DM Mono,monospace' }}/></div>
          <div style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.08em', margin:'20px 0 14px', paddingBottom:8, borderBottom:'1px solid var(--border)' }}>Owner Information</div>
          <div className="form-row" style={{ marginBottom:14 }}>
            <div><label className="form-label">Owner Name *</label><input className="form-input" value={form.ownerName} onChange={e=>s('ownerName',e.target.value)} placeholder="Full name"/></div>
            <div><label className="form-label">Phone *</label><input className="form-input" value={form.ownerPhone} onChange={e=>s('ownerPhone',e.target.value)} placeholder="+250 788 000 000"/></div>
          </div>
          <div className="form-row">
            <div><label className="form-label">Email *</label><input className="form-input" value={form.ownerEmail} onChange={e=>s('ownerEmail',e.target.value)}/></div>
            <div><label className="form-label">Company *</label><input className="form-input" value={form.ownerCompany} onChange={e=>s('ownerCompany',e.target.value)}/></div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-success" onClick={()=>{ if (!form.plate||!form.make||!form.model||!form.ownerName){alert('Plate, Make, Model, Owner required');return} onSave(form) }}>{vehicle?'Save Changes':'Register Vehicle'}</button>
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
  const empty = { plate:'', make:'', model:'',cardNumber:'', year:new Date().getFullYear(), color:'', vin:'', type:'Sedan', mileage:0, driverName:'', driverPhone:'', driverLicense:'', insuranceCompany:'', insuranceNumber:'', insuranceExpiry:'', inspectionExpiry:'', status:'Active' }
  const [form, setForm] = useState(vehicle||empty)
  const s = (k,v) => setForm(f=>({...f,[k]:v}))
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{ maxHeight:'90vh', overflowY:'auto', maxWidth:580 }}>
        <div className="modal-header"><div className="modal-title">{vehicle?'Edit Fleet Vehicle':'Add Fleet Vehicle'}</div><X onClick={onClose}/></div>
        <div className="modal-body">
          <div style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:14, paddingBottom:8, borderBottom:'1px solid var(--border)' }}>Vehicle Details</div>
          <div className="form-row" style={{ marginBottom:14 }}>
            <div><label className="form-label">Plate *</label><input className="form-input" value={form.plate} onChange={e=>s('plate',e.target.value.toUpperCase())} placeholder="RAA 001A"/></div>
            <div><label className="form-label">Status *</label><select className="form-input" style={{ appearance:'auto' }} value={form.status} onChange={e=>s('status',e.target.value)}>{[,'Active','In_Maintenance','Out_of_Service'].map(x=><option key={x}>{x}</option>)}</select></div>
          </div>
          <div className="form-row" style={{ marginBottom:14 }}>
            <div><label className="form-label">Make *</label><input className="form-input" value={form.make} onChange={e=>s('make',e.target.value)}/></div>
            <div><label className="form-label">Model *</label><input className="form-input" value={form.model} onChange={e=>s('model',e.target.value)}/></div>
          </div>
          <div className="form-row" style={{ marginBottom:14 }}>
            <div><label className="form-label">Card Number *</label><input className="form-input" value={form.cardNumber} onChange={e=>s('cardNumber',e.target.value.toUpperCase())} style={{ fontFamily:'DM Mono,monospace' }}/></div>
            <div><label className="form-label">Company Departments *</label><select className="form-input" style={{ appearance:'auto' }} value={form.companyDepartment} onChange={e=>s('companyDepartment',e.target.value)}>{['--Please Select--','Blue_Band','Colgate', 'OXI', 'Nestle', 'Indomie'].map(x=><option key={x}>{x}</option>)}</select></div>
          </div> 
          <div className="form-row" style={{ marginBottom:14 }}>
            <div><label className="form-label">Year *</label><input className="form-input" type="number" value={form.year} onChange={e=>s('year',e.target.value)}/></div>
            <div><label className="form-label">Color *</label><input className="form-input" value={form.color} onChange={e=>s('color',e.target.value)}/></div>
          </div>
          <div className="form-row" style={{ marginBottom:14 }}>
            <div><label className="form-label">Type *</label><select className="form-input" style={{ appearance:'auto' }} value={form.type} onChange={e=>s('type',e.target.value)}>{['Sedan','SUV','Pickup Truck','Van','Minibus','Truck','Motorcycle'].map(t=><option key={t}>{t}</option>)}</select></div>
            <div><label className="form-label">Mileage (km) *</label><input className="form-input" type="number" value={form.mileage} onChange={e=>s('mileage',e.target.value)}/></div>
          </div>
          <div style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.08em', margin:'20px 0 14px', paddingBottom:8, borderBottom:'1px solid var(--border)' }}>Assigned Driver</div>
          <div className="form-row" style={{ marginBottom:14 }}>
            <div><label className="form-label">Driver Name *</label><input className="form-input" value={form.driverName} onChange={e=>s('driverName',e.target.value)}/></div>
            <div><label className="form-label">Driver Phone *</label><input className="form-input" value={form.driverPhone} onChange={e=>s('driverPhone',e.target.value)}/></div>
          </div>
          <div className="form-group"><label className="form-label">License Identification *</label><input className="form-input" value={form.driverLicense} onChange={e=>s('driverLicense',e.target.value)}/></div>
          <div style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.08em', margin:'20px 0 14px', paddingBottom:8, borderBottom:'1px solid var(--border)' }}>Insurance & Documents</div>
          <div className="form-row" style={{ marginBottom:14 }}>
            <div><label className="form-label">Insurance Company *</label><input className="form-input" value={form.insuranceCompany} onChange={e=>s('insuranceCompany',e.target.value)}/></div>
            <div><label className="form-label">Insurance Number *</label><input className="form-input" value={form.insuranceNumber} onChange={e=>s('insuranceNumber',e.target.value)}/></div>
          </div>
          <div className="form-row">
            <div><label className="form-label">Insurance Expiry *</label><input className="form-input" type="date" value={form.insuranceExpiry} onChange={e=>s('insuranceExpiry',e.target.value)}/></div>
            <div><label className="form-label">Inspection Expiry *</label><input className="form-input" type="date" value={form.inspectionExpiry} onChange={e=>s('inspectionExpiry',e.target.value)}/></div>
          </div> 
          <div className="form-row">
            <div><label className="form-label">Inspection Issued Date: *</label><input className="form-input" type="date" value={form.inspectionIssuedDate} onChange={e=>s('inspectionIssuedDate',e.target.value)}/></div>
            <div><label className="form-label">Inspection Expiry Date: *</label><input className="form-input" type="date" value={form.inspectionExpiry} onChange={e=>s('inspectionExpiry',e.target.value)}/></div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-blue" onClick={()=>{ if (!form.plate||!form.make||!form.model||!form.driverName||!form.driverPhone||!form.insuranceCompany||!form.insuranceNumber||!form.insuranceExpiry){alert('Required fields missing');return} onSave(form) }}>{vehicle?'Save Changes':'Add Vehicle'}</button>
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
  
  const totalSpend = (history).reduce((s,h)=>s+(h.cost||0),0)
 
useEffect(() => {
  api.get(`/vehicles/${vehicle.id}/history`)
    .then(r => setHistory(Array.isArray(r.data) ? r.data : []))
}, [vehicle.id])
  const addService = async (entry) => {
   try { await api.post(`/vehicles/${vehicle.id}/history`,entry); const r=await api.get(`/vehicles/${vehicle.id}`); const h=await api.get(`/vehicles/${vehicle.id}/history`); onUpdate({...r.data, serviceHistory: h.data}); setShowService(false) }
    catch { alert('Failed to log service') }
  }
  const saveEdit = async (data) => {
    try { const r=await api.put(`/vehicles/${vehicle.id}`,data); onUpdate(r.data); setShowEdit(false) }
    catch { alert('Failed to update') }
  }
  return (
    <>
      <div className="page-header">
        <div>
          <button onClick={onBack} style={{ background:'none', border:'none', color:'var(--text2)', cursor:'pointer', fontFamily:'DM Sans,sans-serif', fontSize:14, marginBottom:12, padding:0 }}>← Back to Vehicles</button>
          <div className="page-title">🚗 {vehicle.make} {vehicle.model}</div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:8 }}>
            <span style={{ fontFamily:'DM Mono,monospace', color:'#f59e0b', fontSize:15 }}>{vehicle.plate}</span>
            <span style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:12, fontWeight:600, borderRadius:20, padding:'4px 10px', background:ss.bg, color:ss.color }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:ss.dot, display:'inline-block' }}/>{vehicle.status?.replace('_',' ')}
            </span>
          </div>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          {canEdit&&<button className="btn btn-ghost" onClick={()=>setShowEdit(true)}>Edit</button>}
          <button className="btn btn-blue" onClick={()=>setShowService(true)}>+ Log Service</button>
        </div>
      </div>
      <div className="page-content">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
          {[['Total Services',(history).length,'All time'],['Total Spend',totalSpend.toLocaleString(),'RWF'],['Mileage',Number(vehicle.mileage||0).toLocaleString(),'km'],['Year',vehicle.year,vehicle.color]].map(([l,v,s])=>(
            <div key={l} className="card" style={{ padding:'18px 20px' }}>
              <div style={{ fontSize:12, color:'var(--text2)', marginBottom:8 }}>{l}</div>
              <div style={{ fontFamily:'Syne,sans-serif', fontSize:24, fontWeight:800 }}>{v}</div>
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
                  <span style={{ fontSize:13, color:'var(--text2)' }}>{k}</span><span style={{ fontSize:13, fontWeight:500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">Owner Information</div></div>
            <div style={{ padding:20 }}>
              {[['Name',vehicle.ownerName],['Phone',vehicle.ownerPhone||'—'],['Email',vehicle.ownerEmail||'—'],['Company',vehicle.ownerCompany||'—']].map(([k,v])=>(
                <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                  <span style={{ fontSize:13, color:'var(--text2)' }}>{k}</span><span style={{ fontSize:13, fontWeight:500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Service & Repair History</div><span style={{ fontSize:12, color:'var(--text2)' }}>{history.length} records</span></div>
          {history.length===0 ? <div style={{ padding:48, textAlign:'center', color:'var(--text3)' }}><div style={{ fontSize:36, marginBottom:12 }}>📋</div><div>No service records yet</div></div>
            : [...history].reverse().map(h=>(
              <div key={h.id} style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)', display:'flex', gap:16 }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--surface2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>🔧</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:600, marginBottom:3 }}>{h.type}</div>
                  <div style={{ fontSize:13, color:'var(--text2)', marginBottom:6 }}>{h.description}</div>
                  {h.parts?.length>0&&<div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>{h.parts.map((p,i)=><span key={i} style={{ fontSize:11, background:'var(--surface2)', color:'var(--text3)', borderRadius:4, padding:'2px 8px' }}>{p}</span>)}</div>}
                  <div style={{ fontSize:12, color:'var(--text3)', marginTop:6 }}>by {h.mechanic}</div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ fontFamily:'DM Mono,monospace', fontSize:14, color:'var(--accent)' }}>{(h.cost||0).toLocaleString()} RWF</div>
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
  const [loading, setLoading] = useState(true)
  const canAdd = user.role==='manager'||user.role==='supervisor'

  useEffect(()=>{ fetchVehicles(); fetchFleet() },[])
  const fetchVehicles = async () => { try { const r=await api.get('/vehicles'); setVehicles(Array.isArray(r.data) ? r.data : r.data?.content || []) } catch { alert('Failed to load vehicles') } setLoading(false) }
  const fetchFleet = async () => { try { const r=await api.get('/fleet'); setFleet(Array.isArray(r.data) ? r.data : r.data?.content || []) } catch(e){console.error(e)} }
  const addVehicle = async (data) => { try { await api.post('/vehicles',data); fetchVehicles(); setShowAdd(false) } catch { alert('Failed') } }
  const addFleetVehicle = async (data) => { try { await api.post('/fleet',data); fetchFleet(); setShowAddFleet(false) } catch { alert('Failed') } }
  const updateVehicle = (u) => { setVehicles(p=>p.map(v=>v.id===u.id?u:v)); setSelected(u) }

  const filtered =( vehicles  || []).filter(v => {
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
          {canAdd&&tab==='fleet'&&<button className="btn btn-blue" onClick={()=>setShowAddFleet(true)}>+ Add Fleet Vehicle</button>}
        </div>
      </div>
      <div className="page-content">
        <div style={{ display:'flex', gap:4, marginBottom:20, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, padding:4, width:'fit-content' }}>
          {[['garage','🚗','Garage'],['fleet','🚛','Fleet']].map(([key,icon,label])=>(
            <button key={key} className="tab-btn" onClick={()=>setTab(key)} style={{ background:tab===key?'var(--accent)':'transparent', color:tab===key?'#000':'var(--text2)' }}>{icon} {label}</button>
          ))}
        </div>

        {tab==='garage'&&(
          <>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
              {Object.entries(STATUS_STYLE).map(([status,ss])=>(
                <div key={status} className="card" style={{ padding:'16px 20px', cursor:'pointer', borderColor:filter===status?ss.dot:undefined }} onClick={()=>setFilter(filter===status?'All':status)}>
                  <div style={{ fontSize:12, color:'var(--text2)', marginBottom:6 }}>{status.replace('_',' ')}</div>
                  <div style={{ fontFamily:'Syne,sans-serif', fontSize:26, fontWeight:800, color:ss.dot }}>{vehicles.filter(v=>v.status===status).length}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:10, marginBottom:16 }}>
              <input style={{ flex:1, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, padding:'10px 14px', color:'var(--text)', fontFamily:'DM Sans,sans-serif', fontSize:14, outline:'none' }} placeholder="Search plate, make, model, owner..." value={search} onChange={e=>setSearch(e.target.value)}/>
              <select style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, padding:'10px 14px', color:'var(--text)', fontFamily:'DM Sans,sans-serif', fontSize:14, outline:'none' }} value={filter} onChange={e=>setFilter(e.target.value)}>
                <option value="All">All Status</option>{Object.keys(STATUS_STYLE).map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            {loading?<div style={{ textAlign:'center', padding:48, color:'var(--text3)' }}>Loading...</div>:
              filtered.length===0?<div className="card" style={{ padding:48, textAlign:'center', color:'var(--text3)' }}><div style={{ fontSize:40, marginBottom:12 }}>🚗</div><div>No vehicles found</div></div>:(
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16 }}>
                {filtered.map(v=>{ const ss=STATUS_STYLE[v.status]||STATUS_STYLE['Ready']; return (
                  <div key={v.id} onClick={()=>setSelected(v)} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:20, cursor:'pointer', transition:'all 0.2s' }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor='#f59e0b'} onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                    <div style={{ fontFamily:'DM Mono,monospace', fontSize:18, color:'#f59e0b', marginBottom:4 }}>{v.plate}</div>
                    <div style={{ fontFamily:'Syne,sans-serif', fontSize:16, fontWeight:700, marginBottom:10 }}>{v.make} {v.model}</div>
                    <div style={{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap' }}>{[v.year,v.type,v.color].filter(Boolean).map((m,i)=><span key={i} style={{ fontSize:12, color:'var(--text2)', background:'var(--surface2)', borderRadius:6, padding:'3px 8px' }}>{m}</span>)}</div>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                      <span style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:12, fontWeight:600, borderRadius:20, padding:'4px 10px', background:ss.bg, color:ss.color }}><span style={{ width:6, height:6, borderRadius:'50%', background:ss.dot, display:'inline-block' }}/>{v.status?.replace('_',' ')}</span>
                      <span style={{ fontSize:12, color:'var(--text3)' }}>{(v.serviceHistory||[]).length} services</span>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, paddingTop:12, borderTop:'1px solid var(--border)' }}>
                      <div style={{ width:28, height:28, background:'var(--surface3)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'var(--text2)' }}>{v.ownerName?.[0]}</div>
                      <div><div style={{ fontSize:13, fontWeight:500 }}>{v.ownerName}</div>{v.ownerCompany&&<div style={{ fontSize:11, color:'var(--text2)' }}>{v.ownerCompany}</div>}</div>
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
              <div key={v.id} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:20, transition:'all 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.borderColor='#3b82f6'} onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <div><div style={{ fontFamily:'DM Mono,monospace', fontSize:16, color:'#3b82f6', marginBottom:3 }}>{v.plate}</div><div style={{ fontFamily:'Syne,sans-serif', fontSize:15, fontWeight:700 }}>{v.make} {v.model}</div></div>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, borderRadius:20, padding:'3px 8px', background:ss.bg, color:ss.color }}><span style={{ width:5, height:5, borderRadius:'50%', background:ss.dot, display:'inline-block' }}/>{v.status?.replace('_',' ')}</span>
                </div>
                <div style={{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap' }}>{[v.year,v.type,v.color].filter(Boolean).map((m,i)=><span key={i} style={{ fontSize:11, color:'var(--text2)', background:'var(--surface2)', borderRadius:6, padding:'2px 8px' }}>{m}</span>)}</div>
                {v.driverName&&<div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 0', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)', margin:'10px 0' }}><span style={{ fontSize:16 }}>👤</span><div><div style={{ fontSize:13, fontWeight:500 }}>{v.driverName}</div><div style={{ fontSize:11, color:'var(--text2)' }}>{v.driverPhone}</div></div></div>}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:10 }}>
                  <div style={{ background:'var(--surface2)', borderRadius:8, padding:'8px 10px' }}><div style={{ fontSize:10, color:'var(--text3)', marginBottom:2 }}>MILEAGE</div><div style={{ fontSize:13, fontWeight:600 }}>{Number(v.mileage||0).toLocaleString()} km</div></div>
                  <div style={{ background:'var(--surface2)', borderRadius:8, padding:'8px 10px' }}><div style={{ fontSize:10, color:'var(--text3)', marginBottom:2 }}>INS. EXPIRY</div><div style={{ fontSize:13, fontWeight:600 }}>{v.insuranceExpiry||'—'}</div></div>
                </div>
              </div>
            )})}
          </div>
          )
        )}
      </div>
      {showAdd&&<VehicleModal onSave={addVehicle} onClose={()=>setShowAdd(false)}/>}
      {showAddFleet&&<FleetModal onSave={addFleetVehicle} onClose={()=>setShowAddFleet(false)}/>}
    </>
  )
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  useEffect(()=>{ const s=localStorage.getItem('user'); if(s) setUser(JSON.parse(s)) },[])
  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null) }
  return (
    <>
      <style>{styles}</style>
      {!user?<LoginPage onLogin={setUser}/>:(
        <div className="app">
          <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}/>
          <div className="main">
            {activeTab==='dashboard'&&<DashboardPage/>}
            {activeTab==='vehicles'&&<VehiclesPage user={user}/>}
            {activeTab==='fuel'&&<FuelLogsPage user={user}/>}
            {activeTab==='inventory'&&<InventoryPage user={user}/>}
            {activeTab==='staff'&&user.role==='manager'&&<StaffPage/>}
          </div>
        </div>
      )}
    </>
  )
}  
