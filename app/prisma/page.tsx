'use client';

import { useEffect, useState } from 'react';

type CommandLog = {
  id: string;
  username?: string;
  owner?: string;
  repo?: string;
  command: string;
  status: string;
  output?: string;
  createdAt: string;
};

export default function PrismaSequelizePage() {
  const [orm, setOrm] = useState<'prisma' | 'sequelize'>('prisma');
  const [username, setUsername] = useState('');
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [command, setCommand] = useState('git config --global user.name "demo"');
  const [logs, setLogs] = useState<CommandLog[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadLogs() {
    const res = await fetch('/api/command-logs', { cache: 'no-store' });
    const data = await res.json();
    setLogs(data);
  }

  useEffect(() => { loadLogs(); }, []);

  async function execute() {
    setLoading(true);
    try {
      await fetch('/api/command-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username, owner, repo, command,
          status: 'OK',
          output: `Saved via ${orm.toUpperCase()}`
        })
      });
      await loadLogs();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Prisma / Sequelize</h1>

      {/* Toggle */}
      <div className="flex gap-3 items-center">
        <button
          onClick={() => setOrm('prisma')}
          className={`px-3 py-1 rounded ${orm === 'prisma' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Prisma
        </button>
        <button
          onClick={() => setOrm('sequelize')}
          className={`px-3 py-1 rounded ${orm === 'sequelize' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Sequelize
        </button>
      </div>

      {/* Inputs */}
      <div className="grid gap-3">
        <input
          placeholder="Username"
          className="border p-2 rounded"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          placeholder="Owner"
          className="border p-2 rounded"
          value={owner}
          onChange={e => setOwner(e.target.value)}
        />
        <input
          placeholder="Repository"
          className="border p-2 rounded"
          value={repo}
          onChange={e => setRepo(e.target.value)}
        />
        <textarea
          placeholder="Command"
          className="border p-2 rounded"
          value={command}
          onChange={e => setCommand(e.target.value)}
        />
      </div>

      <button
        onClick={execute}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Executing…' : 'Execute & Save'}
      </button>

      {/* Logs */}
      <div>
        <h2 className="font-semibold text-lg mt-6 mb-2">Saved Logs</h2>
        {logs.length === 0 ? (
          <p className="text-gray-500">No logs yet.</p>
        ) : (
          logs.map(log => (
            <div key={log.id} className="border rounded p-3 mb-2">
              <div className="text-sm text-gray-600">
                {new Date(log.createdAt).toLocaleString()}
              </div>
              <div className="font-mono break-all">{log.command}</div>
              <div className="text-xs">
                status: {log.status} • user: {log.username ?? '-'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
