'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <span className={styles.studentId}>Student No: 21950303</span>
      </div>

      <nav className={styles.center}>
        <Link href="/themes">Themes</Link>
        <Link href="/docker">Docker</Link>
        <Link href="/prisma">Prisma/Sequelize</Link>
        <Link href="/tests">Tests</Link>
        <Link href="/about">About</Link>
      </nav>

      <div className={styles.right}>
        <button className={styles.hamburger} onClick={() => setIsOpen(!isOpen)}>
          <span className={isOpen ? styles.bar1Open : styles.bar}></span>
          <span className={isOpen ? styles.bar2Open : styles.bar}></span>
          <span className={isOpen ? styles.bar3Open : styles.bar}></span>
        </button>

        {isOpen && (
          <div className={styles.dropdown}>
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
          </div>
        )}
      </div>
    </header>
  );
}
