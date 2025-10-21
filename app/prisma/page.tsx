'use client';

import { useEffect, useMemo, useState } from 'react';

type CommandLog = {
  id: string;
  createdAt: string;
  orm?: string;
  command: string;
  result?: string;
};

export default function PrismaSequelizeScaffold() {
  const [orm, setOrm] = useState<'prisma'|'sequelize'>('prisma');

  // GitHub inputs
  const [token, setToken]   = useState('');
  const [owner, setOwner]   = useState('');
  const [repo,  setRepo]    = useState('');
  const [branch,setBranch]  = useState('main');

  const [statusMsg, setStatusMsg] = useState<string>('');
  const [busy, setBusy] = useState(false);
  const [logs, setLogs] = useState<CommandLog[]>([]);

  const canExecute = useMemo(
    () => !!token && !!owner && !!repo,
    [token, owner, repo]
  );

  async function loadLogs() {
    const r = await fetch('/api/command-logs', { cache: 'no-store' });
    const data = await r.json();
    setLogs(data);
  }
  useEffect(() => { loadLogs(); }, []);

  async function execute() {
    setBusy(true);
    setStatusMsg('');
    try {
      const res = await fetch('/api/orm/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orm,
          tables: [
            { name: "CommandLog", columns: [
              { name: "username", type: "string" },
              { name: "owner",    type: "string" },
              { name: "repo",     type: "string" },
              { name: "command",  type: "string", required: true },
              { name: "status",   type: "string" },
            ] }
          ],
          github: {
            token, owner, repo, branch,
            commitMessage: `feat(${orm}): scaffold schema + files`
          },
          userInput: {
            username: owner,
            owner, repo,
            command: "execute"
          }
        })
      });

      const raw = await res.text();
      let data: any;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error(`Server did not return JSON (status ${res.status}). Body: ${raw.slice(0,300)}`);
      }
      if (!res.ok) throw new Error(data?.error || `Failed (status ${res.status})`);

      setStatusMsg(`Added row using ${orm}. Committed: ${data.filesCommitted?.length ?? 0} file(s).`);
      if (data.commitHtmlUrl) window.open(data.commitHtmlUrl, '_blank');
      await loadLogs();
    } catch (e:any) {
      setStatusMsg(`Error: ${e.message}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="prisma-wrap">
      <h1 className="prisma-title">Sequelize / Prisma Scaffold</h1>
      <p className="prisma-subtitle">Select which ORM you want to generate, then press Execute.</p>

      {/* Execute Card */}
      <div className="card" style={{marginBottom: 26}}>
        <div className="radio-group">
          <span className="badge">Choose ORM</span>
          <label>
            <input type="radio" checked={orm==='prisma'} onChange={()=>setOrm('prisma')} />
            Prisma
          </label>
          <label>
            <input type="radio" checked={orm==='sequelize'} onChange={()=>setOrm('sequelize')} />
            Sequelize
          </label>
        </div>

        {/* GitHub Inputs */}
        <div className="row" style={{marginTop: 10}}>
          <input className="input" placeholder="GitHub Token" value={token} onChange={e=>setToken(e.target.value)} />
          <input className="input" placeholder="Owner" value={owner} onChange={e=>setOwner(e.target.value)} />
          <input className="input" placeholder="Repo" value={repo} onChange={e=>setRepo(e.target.value)} />
          <input className="input" placeholder="Branch (main)" value={branch} onChange={e=>setBranch(e.target.value)} />
        </div>

        <div className="row" style={{justifyContent:'flex-end', marginTop: 14}}>
          <button className="btn btn-primary" disabled={busy || !canExecute} onClick={execute}>
            {busy ? 'Working…' : 'Execute'}
          </button>
        </div>

        {statusMsg && (
          <div className={`status ${statusMsg.startsWith('Error') ? 'err' : 'ok'}`}>
            {statusMsg}
          </div>
        )}
      </div>

      {/* Logs */}
      <h2 style={{fontSize: 28, fontWeight: 700, margin: '14px 0'}}>Command Logs</h2>
      <div className="card" style={{padding:0}}>
        <table className="table">
          <thead>
            <tr>
              <th style={{width:'28%'}}>Time</th>
              <th style={{width:'14%'}}>ORM</th>
              <th>Command</th>
              <th style={{width:'12%'}}>Result</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && (
              <tr><td colSpan={4} style={{textAlign:'center', padding:'18px', color:'#64748b'}}>No logs yet</td></tr>
            )}
            {logs.map(l=>(
              <tr key={l.id}>
                <td>{new Date(l.createdAt).toLocaleString()}</td>
                <td>{l.orm ?? '-'}</td>
                <td style={{wordBreak:'break-word'}}>{l.command}</td>
                <td><span className="badge" style={{borderColor: l.result==='ok' ? '#bbf7d0' : '#fecaca', background: l.result==='ok' ? '#ecfdf5' : '#fef2f2', color: l.result==='ok' ? '#166534' : '#991b1b'}}>{l.result ?? '-'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
