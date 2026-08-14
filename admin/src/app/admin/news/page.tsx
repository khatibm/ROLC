'use client';

import { useState, useEffect } from 'react';
import { newsApi } from '@/lib/api';
import styles from '../admin.module.css';

interface NewsItem {
  id: string;
  titleAr: string;
  category: string;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
}

interface FormData {
  titleAr: string;
  contentAr: string;
  category: string;
  coverImageUrl: string;
  publishedAt: string;
  isPublished: boolean;
}

const EMPTY_FORM: FormData = {
  titleAr: '', contentAr: '', category: 'عام',
  coverImageUrl: '', publishedAt: '', isPublished: true,
};

export default function NewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await newsApi.getAll({ limit: 50 });
      setItems(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true); setError(''); };

  const openEdit = async (id: string) => {
    const item = await newsApi.getById(id);
    setForm({
      titleAr: item.titleAr, contentAr: item.contentAr, category: item.category,
      coverImageUrl: item.coverImageUrl || '',
      publishedAt: item.publishedAt ? item.publishedAt.slice(0, 16) : '',
      isPublished: item.isPublished,
    });
    setEditing(id);
    setShowModal(true);
    setError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titleAr || !form.contentAr) { setError('العنوان والمحتوى مطلوبان'); return; }
    setSaving(true);
    try {
      if (editing) await newsApi.update(editing, form);
      else await newsApi.create(form);
      setShowModal(false);
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    await newsApi.remove(id);
    await load();
  };

  const f = (iso: string) => new Date(iso).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>📰 الأخبار</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ إضافة خبر</button>
      </div>

      <div className={styles.tableWrapper}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#757575' }}>جارٍ التحميل...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>العنوان</th>
                <th>التصنيف</th>
                <th>الحالة</th>
                <th>تاريخ النشر</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600, maxWidth: 300 }}>{item.titleAr}</td>
                  <td><span className="badge badge-published">{item.category}</span></td>
                  <td>
                    <span className={`badge ${item.isPublished ? 'badge-published' : 'badge-draft'}`}>
                      {item.isPublished ? 'منشور' : 'مسودة'}
                    </span>
                  </td>
                  <td style={{ color: '#757575', fontSize: 13 }}>{f(item.publishedAt)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(item.id)}>تعديل</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: '#757575' }}>لا توجد أخبار</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{editing ? 'تعديل الخبر' : 'إضافة خبر جديد'}</h2>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>العنوان *</label>
                <input value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} placeholder="عنوان الخبر" required />
              </div>
              <div className="form-group">
                <label>المحتوى *</label>
                <textarea rows={8} value={form.contentAr} onChange={(e) => setForm({ ...form, contentAr: e.target.value })} placeholder="محتوى الخبر..." required />
              </div>
              <div className={styles.formRow}>
                <div className="form-group">
                  <label>التصنيف</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {['عام', 'أخبار', 'مبادرات', 'تعليم', 'اجتماعي', 'رياضة'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>تاريخ النشر</label>
                  <input type="datetime-local" value={form.publishedAt} onChange={(e) => setForm({ ...form, publishedAt: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>رابط الصورة الرئيسية</label>
                <input value={form.coverImageUrl} onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })} placeholder="https://..." />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" id="published" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} style={{ width: 18, height: 18 }} />
                <label htmlFor="published" style={{ margin: 0 }}>نشر الخبر فوراً</label>
              </div>
              {error && <p className="error-msg" style={{ marginBottom: 12 }}>{error}</p>}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>إلغاء</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'جارٍ الحفظ...' : 'حفظ'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
