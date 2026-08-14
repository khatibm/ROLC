'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import styles from './admin.module.css';

interface Stats {
  news: number;
  events: number;
  persons: number;
  branches: number;
  tickets: { new: number; total: number };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    authApi.dashboard().then(setStats).catch(console.error);
  }, []);

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>لوحة التحكم</h1>
        <span style={{ color: '#757575', fontSize: 14 }}>
          {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {stats && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>📰</span>
            <span className={styles.statValue}>{stats.news}</span>
            <span className={styles.statLabel}>الأخبار</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>📅</span>
            <span className={styles.statValue}>{stats.events}</span>
            <span className={styles.statLabel}>الفعاليات</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>👤</span>
            <span className={styles.statValue}>{stats.persons}</span>
            <span className={styles.statLabel}>الأشخاص</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>🌿</span>
            <span className={styles.statValue}>{stats.branches}</span>
            <span className={styles.statLabel}>الفروع</span>
          </div>
          <div className={styles.statCard} style={{ borderColor: stats.tickets.new > 0 ? '#F57C00' : undefined }}>
            <span className={styles.statIcon}>📬</span>
            <span className={styles.statValue} style={{ color: stats.tickets.new > 0 ? '#F57C00' : undefined }}>
              {stats.tickets.new}
            </span>
            <span className={styles.statLabel}>تذاكر جديدة</span>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {[
          { href: '/admin/news', icon: '📰', label: 'إدارة الأخبار', desc: 'إضافة وتعديل وحذف الأخبار' },
          { href: '/admin/events', icon: '📅', label: 'إدارة الفعاليات', desc: 'إدارة الفعاليات والمناسبات' },
          { href: '/admin/persons', icon: '👤', label: 'إدارة الأشخاص', desc: 'أعضاء شجرة العائلة' },
          { href: '/admin/branches', icon: '🌿', label: 'إدارة الفروع', desc: 'فروع القبيلة وهيكلها' },
          { href: '/admin/relationships', icon: '🔗', label: 'إدارة العلاقات', desc: 'روابط الأسرة في الشجرة' },
          { href: '/admin/tickets', icon: '📬', label: 'المقترحات والشكاوى', desc: 'متابعة تذاكر المواطنين' },
        ].map((item) => (
          <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.1s', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 28 }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: '#757575', marginTop: 4 }}>{item.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
