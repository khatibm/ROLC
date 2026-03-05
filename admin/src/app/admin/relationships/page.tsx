'use client';

import { useState, useEffect } from 'react';
import { relsApi, personsApi } from '@/lib/api';
import styles from '../admin.module.css';

interface Rel { id: string; relationType: string; status: string; person: { id: string; fullNameAr: string }; relatedPerson: { id: string; fullNameAr: string }; }
interface Person { id: string; fullNameAr: string; }

const REL_TYPES: Record<string, string> = { FATHER: 'أب', MOTHER: 'أم', SPOUSE: 'زوج/زوجة' };
const STATUS_MAP: Record<string, string> = { CONFIRMED: 'مؤكد', PENDING: 'معلق', REJECTED: 'مرفوض' };

export default function RelationshipsPage() {
  const [rels, setRels] = useState<Rel[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ personId: '', relatedPersonId: '', relationType: 'FATHER' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [relRes, persRes] = await Promise.all([relsApi.getAll(), personsApi.getAll({ limit: 200 })]);
      setRels(relRes || []);
      setPersons(persRes.data || []);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await relsApi.create(form);
      setShowModal(false);
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally { setSaving(false); }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    await relsApi.updateStatus(id, { status });
    await load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('حذف العلاقة؟')) return;
    await relsApi.remove(id);
    await load();
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>🔗 العلاقات</h1>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setError(''); }}>+ إضافة علاقة</button>
      </div>

      <div className={styles.tableWrapper}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#757575' }}>جارٍ التحميل...</div>
        ) : (
          <table>
            <thead><tr><th>الشخص</th><th>نوع العلاقة</th><th>الشخص المرتبط</th><th>الحالة</th><th>الإجراءات</th></tr></thead>
            <tbody>
              {rels.map(rel => (
                <tr key={rel.id}>
                  <td style={{ fontWeight: 600 }}>{rel.person?.fullNameAr}</td>
                  <td><span className="badge badge-published">{REL_TYPES[rel.relationType] || rel.relationType}</span></td>
                  <td style={{ fontWeight: 600 }}>{rel.relatedPerson?.fullNameAr}</td>
                  <td>
                    <select value={rel.status} onChange={e => handleStatusUpdate(rel.id, e.target.value)} style={{ width: 100, padding: '4px 8px' }}>
                      {['CONFIRMED','PENDING','REJECTED'].map(s => <option key={s} value={s}>{STATUS_MAP[s]}</option>)}
                    </select>
                  </td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(rel.id)}>حذف</button></td>
                </tr>
              ))}
              {rels.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: '#757575' }}>لا توجد علاقات</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className={styles.overlay} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>إضافة علاقة جديدة</h2>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>الشخص *</label>
                <select value={form.personId} onChange={e => setForm({...form,personId:e.target.value})} required>
                  <option value="">اختر الشخص...</option>
                  {persons.map(p => <option key={p.id} value={p.id}>{p.fullNameAr}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>نوع العلاقة *</label>
                <select value={form.relationType} onChange={e => setForm({...form,relationType:e.target.value})}>
                  <option value="FATHER">أب (father of)</option>
                  <option value="MOTHER">أم (mother of)</option>
                  <option value="SPOUSE">زوج/زوجة</option>
                </select>
              </div>
              <div className="form-group">
                <label>الشخص المرتبط *</label>
                <select value={form.relatedPersonId} onChange={e => setForm({...form,relatedPersonId:e.target.value})} required>
                  <option value="">اختر الشخص المرتبط...</option>
                  {persons.filter(p => p.id !== form.personId).map(p => <option key={p.id} value={p.id}>{p.fullNameAr}</option>)}
                </select>
              </div>
              <p style={{ fontSize: 12, color: '#757575', marginBottom: 12 }}>
                مثال: "سعد" — FATHER — "عبدالله" يعني أن عبدالله هو والد سعد
              </p>
              {error && <p className="error-msg" style={{ marginBottom: 12 }}>{error}</p>}
              <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>إلغاء</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'جارٍ الحفظ...':'حفظ'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
