'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function HomePage() {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [commands, setCommands] = useState('');

  const handleExecute = () => {
    const generatedCommands = `
git clone https://${username}:${token}@github.com/${owner}/${repo}.git
cd ${repo}
git checkout -b update-readme
echo "##This is the System" >> README.md
echo "Successfully connected!" >> README.md
git add README.md
git commit -m "Update README.md: Add new section"
git push origin update-readme
gh pr create --title "Update README.md" --body "Added a new section to the README"
    `;
    setCommands(generatedCommands.trim());
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <label>Username:</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />

        <label>Token:</label>
        <input value={token} onChange={(e) => setToken(e.target.value)} />

        <label>Owner:</label>
        <input value={owner} onChange={(e) => setOwner(e.target.value)} />

        <label>Repository:</label>
        <input value={repo} onChange={(e) => setRepo(e.target.value)} />

        <button onClick={handleExecute}>Execute</button>
      </div>

      {commands && (
        <pre className={styles.commands}>
          {commands}
        </pre>
      )}
    </div>
  );
}
