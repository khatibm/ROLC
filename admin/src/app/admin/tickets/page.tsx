'use client';

import { useState, useEffect } from 'react';
import { ticketsApi } from '@/lib/api';
import styles from '../admin.module.css';

interface Ticket { id: string; type: string; title: string; status: string; contactPhone?: string; createdAt: string; }

const STATUS_LABELS: Record<string, string> = { NEW: 'جديد', IN_REVIEW: 'قيد المراجعة', CLOSED: 'مغلق' };
const TYPE_LABELS: Record<string, string> = { SUGGESTION: 'اقتراح', COMPLAINT: 'شكوى' };

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [noteInput, setNoteInput] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await ticketsApi.getAll({ status: statusFilter || undefined, limit: 50 });
      setTickets(res.data || []);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [statusFilter]);

  const openTicket = async (id: string) => {
    const t = await ticketsApi.getById(id);
    setSelected(t);
    setNoteInput(t.adminNote || '');
  };

  const updateStatus = async (id: string, status: string) => {
    await ticketsApi.updateStatus(id, { status, adminNote: noteInput });
    setSelected(null);
    await load();
  };

  const f = (iso: string) => new Date(iso).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>📬 المقترحات والشكاوى</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 160 }}>
            <option value="">جميع الحالات</option>
            <option value="NEW">جديد</option>
            <option value="IN_REVIEW">قيد المراجعة</option>
            <option value="CLOSED">مغلق</option>
          </select>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#757575' }}>جارٍ التحميل...</div>
        ) : (
          <table>
            <thead><tr><th>العنوان</th><th>النوع</th><th>الحالة</th><th>تاريخ الإرسال</th><th>الإجراءات</th></tr></thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 600 }}>{t.title}</td>
                  <td><span className="badge badge-in_review">{TYPE_LABELS[t.type] || t.type}</span></td>
                  <td>
                    <span className={`badge badge-${t.status.toLowerCase()}`}>{STATUS_LABELS[t.status] || t.status}</span>
                  </td>
                  <td style={{ color: '#757575', fontSize: 13 }}>{f(t.createdAt)}</td>
                  <td><button className="btn btn-outline btn-sm" onClick={() => openTicket(t.id)}>عرض التفاصيل</button></td>
                </tr>
              ))}
              {tickets.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: '#757575' }}>لا توجد تذاكر</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      {/* Ticket detail modal */}
      {selected && (
        <div className={styles.overlay} onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>تفاصيل التذكرة</h2>
              <button className={styles.closeBtn} onClick={() => setSelected(null)}>✕</button>
            </div>

            <div style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className={`badge badge-${selected.status.toLowerCase()}`}>{STATUS_LABELS[selected.status]}</span>
                <span className="badge badge-in_review">{TYPE_LABELS[selected.type]}</span>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{selected.title}</div>
                <div style={{ color: '#424242', lineHeight: 1.7 }}>{selected.message}</div>
              </div>
              {selected.contactPhone && <div style={{ color: '#757575', fontSize: 13 }}>📞 {selected.contactPhone}</div>}
              {selected.contactEmail && <div style={{ color: '#757575', fontSize: 13 }}>📧 {selected.contactEmail}</div>}
              {selected.attachmentUrl && (
                <a href={`${process.env.NEXT_PUBLIC_API_URL}${selected.attachmentUrl}`} target="_blank" style={{ color: '#1B5E20' }}>
                  📎 عرض المرفق
                </a>
              )}
            </div>

            <div className="form-group">
              <label>ملاحظة المسؤول</label>
              <textarea rows={3} value={noteInput} onChange={e => setNoteInput(e.target.value)} placeholder="اكتب ملاحظتك هنا..." />
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {selected.status !== 'IN_REVIEW' && (
                <button className="btn btn-gold" onClick={() => updateStatus(selected.id, 'IN_REVIEW')}>قيد المراجعة</button>
              )}
              {selected.status !== 'CLOSED' && (
                <button className="btn btn-primary" onClick={() => updateStatus(selected.id, 'CLOSED')}>إغلاق التذكرة</button>
              )}
              {selected.status !== 'NEW' && (
                <button className="btn btn-outline" onClick={() => updateStatus(selected.id, 'NEW')}>إعادة لجديد</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
