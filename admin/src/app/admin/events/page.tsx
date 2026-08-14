'use client';

import { useState, useEffect } from 'react';
import { eventsApi } from '@/lib/api';
import styles from '../admin.module.css';

interface EventItem { id: string; titleAr: string; city: string; startAt: string; endAt: string; isPublished: boolean; }

const EMPTY: any = {
  titleAr: '', descriptionAr: '', startAt: '', endAt: '',
  city: '', locationText: '', mapUrl: '', contactName: '', contactPhone: '', isPublished: true,
};

export default function EventsPage() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try { const res = await eventsApi.getAll({ limit: 50 }); setItems(res.data || []); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };

  const openEdit = async (id: string) => {
    const item = await eventsApi.getById(id);
    setForm({ ...item, startAt: item.startAt?.slice(0,16), endAt: item.endAt?.slice(0,16) });
    setEditing(id);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await eventsApi.update(editing, form);
      else await eventsApi.create(form);
      setShowModal(false);
      await load();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('حذف الفعالية؟')) return;
    await eventsApi.remove(id);
    await load();
  };

  const f = (iso: string) => new Date(iso).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>📅 الفعاليات</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ إضافة فعالية</button>
      </div>

      <div className={styles.tableWrapper}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#757575' }}>جارٍ التحميل...</div>
        ) : (
          <table>
            <thead>
              <tr><th>العنوان</th><th>المدينة</th><th>تاريخ البداية</th><th>الحالة</th><th>الإجراءات</th></tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600 }}>{item.titleAr}</td>
                  <td>{item.city || '—'}</td>
                  <td style={{ color: '#757575', fontSize: 13 }}>{f(item.startAt)}</td>
                  <td><span className={`badge ${item.isPublished ? 'badge-published' : 'badge-draft'}`}>{item.isPublished ? 'منشور' : 'مسودة'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(item.id)}>تعديل</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: '#757575' }}>لا توجد فعاليات</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{editing ? 'تعديل الفعالية' : 'إضافة فعالية'}</h2>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group"><label>العنوان *</label><input value={form.titleAr} onChange={e => setForm({...form,titleAr:e.target.value})} required /></div>
              <div className="form-group"><label>الوصف *</label><textarea rows={4} value={form.descriptionAr} onChange={e => setForm({...form,descriptionAr:e.target.value})} required /></div>
              <div className={styles.formRow}>
                <div className="form-group"><label>تاريخ البداية *</label><input type="datetime-local" value={form.startAt} onChange={e => setForm({...form,startAt:e.target.value})} required /></div>
                <div className="form-group"><label>تاريخ النهاية *</label><input type="datetime-local" value={form.endAt} onChange={e => setForm({...form,endAt:e.target.value})} required /></div>
              </div>
              <div className={styles.formRow}>
                <div className="form-group"><label>المدينة</label><input value={form.city} onChange={e => setForm({...form,city:e.target.value})} /></div>
                <div className="form-group"><label>موقع الفعالية</label><input value={form.locationText} onChange={e => setForm({...form,locationText:e.target.value})} /></div>
              </div>
              <div className={styles.formRow}>
                <div className="form-group"><label>اسم التواصل</label><input value={form.contactName} onChange={e => setForm({...form,contactName:e.target.value})} /></div>
                <div className="form-group"><label>هاتف التواصل</label><input value={form.contactPhone} onChange={e => setForm({...form,contactPhone:e.target.value})} /></div>
              </div>
              <div className="form-group"><label>رابط الخريطة</label><input value={form.mapUrl} onChange={e => setForm({...form,mapUrl:e.target.value})} /></div>
              <div className="form-group" style={{display:'flex',alignItems:'center',gap:8}}>
                <input type="checkbox" id="pub" checked={form.isPublished} onChange={e => setForm({...form,isPublished:e.target.checked})} style={{width:18,height:18}} />
                <label htmlFor="pub" style={{margin:0}}>نشر الفعالية فوراً</label>
              </div>
              <div style={{ display:'flex',gap:8,justifyContent:'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={()=>setShowModal(false)}>إلغاء</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'جارٍ الحفظ...':'حفظ'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
