'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function HomePage() {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [commands, setCommands] = useState('');

  const [errors, setErrors] = useState({
    username: '',
    token: '',
    owner: '',
    repo: '',
  });

  const handleExecute = () => {
    const newErrors: typeof errors = {
      username: '',
      token: '',
      owner: '',
      repo: '',
    };

    if (!username) newErrors.username = 'Username is required.';
    if (!token) newErrors.token = 'Token is required.';
    if (!owner) newErrors.owner = 'Owner is required.';
    if (!repo) newErrors.repo = 'Repository is required.';

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== '');
    if (hasErrors) {
      setCommands('');
      return;
    }

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
      <div className={styles.formBox}>
        <h2>Git Code Generator</h2>
        <div className={styles.form}>
          <label>Username:</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && (
            <p className={styles.error}>{errors.username}</p>
          )}

          <label>Token:</label>
          <input value={token} onChange={(e) => setToken(e.target.value)} />
          {errors.token && <p className={styles.error}>{errors.token}</p>}

          <label>Owner:</label>
          <input value={owner} onChange={(e) => setOwner(e.target.value)} />
          {errors.owner && <p className={styles.error}>{errors.owner}</p>}

          <label>Repository:</label>
          <input value={repo} onChange={(e) => setRepo(e.target.value)} />
          {errors.repo && <p className={styles.error}>{errors.repo}</p>}

          <button onClick={handleExecute}>Execute</button>
        </div>
      </div>

      {commands && <pre className={styles.commands}>{commands}</pre>}
    </div>
  );
}
