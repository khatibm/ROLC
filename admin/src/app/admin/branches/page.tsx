'use client';

import { useState, useEffect } from 'react';
import { branchesApi } from '@/lib/api';
import styles from '../admin.module.css';

interface Branch { id: string; nameAr: string; parentBranchId?: string; children?: Branch[]; }

export default function BranchesPage() {
  const [items, setItems] = useState<Branch[]>([]);
  const [allBranches, setAllBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ nameAr: '', parentBranchId: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [tree, flat] = await Promise.all([branchesApi.getAll(), branchesApi.getAll()]);
      setItems(tree || []);
      const flatList: Branch[] = [];
      const flatten = (bs: Branch[]) => bs.forEach(b => { flatList.push(b); if (b.children) flatten(b.children); });
      flatten(flat || []);
      setAllBranches(flatList);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ nameAr: '', parentBranchId: '' }); setShowModal(true); };
  const openEdit = async (id: string) => {
    const item = await branchesApi.getById(id);
    setForm({ nameAr: item.nameAr, parentBranchId: item.parentBranchId || '' });
    setEditing(id);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { nameAr: form.nameAr, parentBranchId: form.parentBranchId || undefined };
      if (editing) await branchesApi.update(editing, payload);
      else await branchesApi.create(payload);
      setShowModal(false);
      await load();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('حذف الفرع؟')) return;
    await branchesApi.remove(id);
    await load();
  };

  const RenderBranch = ({ branch, depth = 0 }: { branch: Branch; depth?: number }) => (
    <div>
      <tr key={branch.id}>
        <td style={{ paddingRight: 16 + depth * 24 }}>
          <span style={{ marginLeft: 6 }}>{depth === 0 ? '🌳' : depth === 1 ? '🌿' : '🍃'}</span>
          <span style={{ fontWeight: depth === 0 ? 700 : 500 }}>{branch.nameAr}</span>
        </td>
        <td style={{ color: '#757575', fontSize: 13 }}>{depth > 0 ? allBranches.find(b => b.id === branch.parentBranchId)?.nameAr : '—'}</td>
        <td>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-outline btn-sm" onClick={() => openEdit(branch.id)}>تعديل</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(branch.id)}>حذف</button>
          </div>
        </td>
      </tr>
      {branch.children?.map(child => <RenderBranch key={child.id} branch={child} depth={depth + 1} />)}
    </div>
  );

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>🌿 الفروع</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ إضافة فرع</button>
      </div>

      <div className={styles.tableWrapper}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#757575' }}>جارٍ التحميل...</div>
        ) : (
          <table>
            <thead><tr><th>اسم الفرع</th><th>الفرع الأب</th><th>الإجراءات</th></tr></thead>
            <tbody>
              {items.map(b => <RenderBranch key={b.id} branch={b} />)}
              {items.length === 0 && <tr><td colSpan={3} style={{ textAlign: 'center', padding: 40, color: '#757575' }}>لا توجد فروع</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className={styles.overlay} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{editing ? 'تعديل الفرع' : 'إضافة فرع'}</h2>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group"><label>اسم الفرع *</label><input value={form.nameAr} onChange={e => setForm({...form,nameAr:e.target.value})} required /></div>
              <div className="form-group">
                <label>الفرع الأب</label>
                <select value={form.parentBranchId} onChange={e => setForm({...form,parentBranchId:e.target.value})}>
                  <option value="">— بدون أب (جذر) —</option>
                  {allBranches.filter(b => b.id !== editing).map(b => (
                    <option key={b.id} value={b.id}>{b.nameAr}</option>
                  ))}
                </select>
              </div>
              <div style={{ display:'flex',gap:8,justifyContent:'flex-end' }}>
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
