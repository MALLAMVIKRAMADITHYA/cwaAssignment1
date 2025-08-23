'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // On component mount, check if a saved tab exists in cookies and redirect
  useEffect(() => {
    const savedTab = Cookies.get('activeTab');
    if (savedTab && savedTab !== pathname) {
      router.push(savedTab);
    }
  }, []);

  // Function to set cookie and close hamburger menu (optional)
  const handleLinkClick = (path: string) => {
    Cookies.set('activeTab', path);
    setIsOpen(false);
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <span className={styles.studentId}>Student No: 21950303</span>
      </div>

      <nav className={styles.center}>
        <Link href="/themes" onClick={() => handleLinkClick('/themes')}>
          Themes
        </Link>
        <Link href="/docker" onClick={() => handleLinkClick('/docker')}>
          Docker
        </Link>
        <Link href="/prisma" onClick={() => handleLinkClick('/prisma')}>
          Prisma/Sequelize
        </Link>
        <Link href="/tests" onClick={() => handleLinkClick('/tests')}>
          Tests
        </Link>
        <Link href="/about" onClick={() => handleLinkClick('/about')}>
          About
        </Link>
      </nav>

      <div className={styles.right}>
        <button
          className={styles.hamburger}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span className={isOpen ? styles.bar1Open : styles.bar}></span>
          <span className={isOpen ? styles.bar2Open : styles.bar}></span>
          <span className={isOpen ? styles.bar3Open : styles.bar}></span>
        </button>

        {isOpen && (
          <div className={styles.dropdown}>
            <Link href="/" onClick={() => handleLinkClick('/')}>
              Home
            </Link>
            <Link href="/about" onClick={() => handleLinkClick('/about')}>
              About
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
