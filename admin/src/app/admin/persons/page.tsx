'use client';

import { useState, useEffect } from 'react';
import { personsApi, branchesApi } from '@/lib/api';
import styles from '../admin.module.css';

interface Person { id: string; fullNameAr: string; gender: string; city?: string; branch?: { nameAr: string }; isPublic: boolean; }
interface Branch { id: string; nameAr: string; children?: Branch[]; }

const EMPTY: any = { fullNameAr: '', gender: 'M', birthDate: '', deathDate: '', branchId: '', city: '', bio: '', photoUrl: '', isPublic: true };

const flattenBranches = (branches: Branch[]): Branch[] => {
  const result: Branch[] = [];
  const visit = (bs: Branch[]) => bs.forEach(b => { result.push(b); if (b.children) visit(b.children); });
  visit(branches);
  return result;
};

export default function PersonsPage() {
  const [items, setItems] = useState<Person[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [persRes, brRes] = await Promise.all([personsApi.getAll({ q: search || undefined, limit: 50 }), branchesApi.getAll()]);
      setItems(persRes.data || []);
      setBranches(flattenBranches(brRes || []));
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [search]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };

  const openEdit = async (id: string) => {
    const item = await personsApi.getById(id);
    setForm({
      fullNameAr: item.fullNameAr, gender: item.gender,
      birthDate: item.birthDate ? item.birthDate.slice(0,10) : '',
      deathDate: item.deathDate ? item.deathDate.slice(0,10) : '',
      branchId: item.branchId || '', city: item.city || '',
      bio: item.bio || '', photoUrl: item.photoUrl || '', isPublic: item.isPublic,
    });
    setEditing(id);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, branchId: form.branchId || undefined, birthDate: form.birthDate || undefined, deathDate: form.deathDate || undefined };
      if (editing) await personsApi.update(editing, payload);
      else await personsApi.create(payload);
      setShowModal(false);
      await load();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('حذف الشخص؟')) return;
    await personsApi.remove(id);
    await load();
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>👤 الأشخاص</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <input style={{ width: 240 }} placeholder="بحث بالاسم..." value={search} onChange={e => setSearch(e.target.value)} />
          <button className="btn btn-primary" onClick={openCreate}>+ إضافة شخص</button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#757575' }}>جارٍ التحميل...</div>
        ) : (
          <table>
            <thead><tr><th>الاسم</th><th>الجنس</th><th>الفرع</th><th>المدينة</th><th>الحالة</th><th>الإجراءات</th></tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600 }}><span style={{ marginLeft: 8 }}>{item.gender === 'M' ? '👨' : '👩'}</span>{item.fullNameAr}</td>
                  <td>{item.gender === 'M' ? 'ذكر' : 'أنثى'}</td>
                  <td style={{ color: '#757575', fontSize: 13 }}>{item.branch?.nameAr || '—'}</td>
                  <td style={{ color: '#757575', fontSize: 13 }}>{item.city || '—'}</td>
                  <td><span className={`badge ${item.isPublic ? 'badge-published' : 'badge-draft'}`}>{item.isPublic ? 'عام' : 'خاص'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(item.id)}>تعديل</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#757575' }}>لا توجد نتائج</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className={styles.overlay} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{editing ? 'تعديل الشخص' : 'إضافة شخص'}</h2>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className={styles.formRow}>
                <div className="form-group"><label>الاسم الكامل *</label><input value={form.fullNameAr} onChange={e=>setForm({...form,fullNameAr:e.target.value})} required /></div>
                <div className="form-group"><label>الجنس *</label>
                  <select value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}>
                    <option value="M">ذكر</option><option value="F">أنثى</option>
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className="form-group"><label>تاريخ الميلاد</label><input type="date" value={form.birthDate} onChange={e=>setForm({...form,birthDate:e.target.value})} /></div>
                <div className="form-group"><label>تاريخ الوفاة</label><input type="date" value={form.deathDate} onChange={e=>setForm({...form,deathDate:e.target.value})} /></div>
              </div>
              <div className={styles.formRow}>
                <div className="form-group"><label>الفرع</label>
                  <select value={form.branchId} onChange={e=>setForm({...form,branchId:e.target.value})}>
                    <option value="">— بدون فرع —</option>
                    {branches.map(b=><option key={b.id} value={b.id}>{b.nameAr}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>المدينة</label><input value={form.city} onChange={e=>setForm({...form,city:e.target.value})} /></div>
              </div>
              <div className="form-group"><label>نبذة</label><textarea rows={3} value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} /></div>
              <div className="form-group"><label>رابط الصورة</label><input value={form.photoUrl} onChange={e=>setForm({...form,photoUrl:e.target.value})} /></div>
              <div className="form-group" style={{display:'flex',alignItems:'center',gap:8}}>
                <input type="checkbox" id="pub2" checked={form.isPublic} onChange={e=>setForm({...form,isPublic:e.target.checked})} style={{width:18,height:18}} />
                <label htmlFor="pub2" style={{margin:0}}>ظاهر للعموم</label>
              </div>
              <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
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
