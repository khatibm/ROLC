'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getToken, removeToken } from '@/lib/auth';
import styles from './admin.module.css';

const navItems = [
  { href: '/admin', label: 'لوحة التحكم', icon: '🏠' },
  { href: '/admin/news', label: 'الأخبار', icon: '📰' },
  { href: '/admin/events', label: 'الفعاليات', icon: '📅' },
  { href: '/admin/branches', label: 'الفروع', icon: '🌿' },
  { href: '/admin/persons', label: 'الأشخاص', icon: '👤' },
  { href: '/admin/relationships', label: 'العلاقات', icon: '🔗' },
  { href: '/admin/tickets', label: 'التذاكر', icon: '📬' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) router.replace('/auth/login');
    else setReady(true);
  }, []);

  if (!ready) return null;

  const logout = () => {
    removeToken();
    router.push('/auth/login');
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <span style={{ fontSize: 32 }}>🌳</span>
          <div>
            <div className={styles.sidebarTitle}>ديوان تميم</div>
            <div className={styles.sidebarSubtitle}>لوحة الإدارة</div>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <button className={styles.logoutBtn} onClick={logout}>
          🚪 تسجيل الخروج
        </button>
      </aside>

      {/* Main content */}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
