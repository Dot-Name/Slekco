import { useState } from 'react';
import { createCategory, updateCategory, deleteCategory } from '../../api/admin';
import { useAuth } from '../../context/AuthContext';
import { useCatalog } from '../../context/CatalogContext';
import { useToast } from '../../context/ToastContext';
import { rules, validate } from '../../utils/validation';

import AdminHeader from '../../components/admin/AdminHeader';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Field from '../../components/ui/Field';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';

const PRESET_ACCENTS = ['#2F4BF0', '#D6246E', '#12876F', '#7A46E0', '#E08700', '#0E8FA8', '#D63A2E', '#14161A'];
const BLANK = { name: '', description: '', image: '', accent: '#2F4BF0', sortOrder: 0, isActive: true };
const schema = { name: [rules.required('Category name'), rules.minLength(2, 'Category name')] };

export default function AdminCategories() {
  const { token } = useAuth();
  const { categories, loading, retry } = useCatalog();
  const { toast } = useToast();

  const [editing, setEditing] = useState(null); // null | 'new' | category object
  const [values, setValues] = useState(BLANK);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [failure, setFailure] = useState('');
  const [pending, setPending] = useState(null);
  const [busy, setBusy] = useState(false);

  const openNew = () => { setEditing('new'); setValues(BLANK); setErrors({}); setFailure(''); };
  const openEdit = (c) => { setEditing(c); setValues({ ...BLANK, ...c }); setErrors({}); setFailure(''); };
  const close = () => setEditing(null);

  const set = (field) => (e) => {
    const v = e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e;
    setValues((prev) => ({ ...prev, [field]: v }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    setFailure('');
  };

  const save = async (e) => {
    e.preventDefault();
    const found = validate(values, schema);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    setFailure('');
    const payload = {
      name: values.name.trim(),
      description: values.description.trim(),
      image: values.image.trim(),
      accent: values.accent,
      sortOrder: Number(values.sortOrder) || 0,
      isActive: values.isActive,
    };

    try {
      if (editing === 'new') {
        await createCategory(payload, token);
        toast(`${payload.name} added`);
      } else {
        await updateCategory(editing._id, payload, token);
        toast(`${payload.name} updated`);
      }
      close();
      retry();
    } catch (err) {
      setFailure(err.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await deleteCategory(pending._id, token);
      toast(`${pending.name} removed`);
      setPending(null);
      retry();
    } catch (err) {
      toast(err.message, 'error');
      setPending(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <AdminHeader
        eyebrow="Catalogue"
        title="Categories"
        description="Each category owns an accent colour that follows it across the whole storefront."
      >
        <Button onClick={openNew}><Icon name="plus" size={17} /> Add category</Button>
      </AdminHeader>

      {editing && (
        <form onSubmit={save} noValidate className="mb-5 rounded-2xl border border-line bg-surface p-5 lg:p-6">
          <h2 className="font-display text-lg font-bold tracking-[-0.02em]">
            {editing === 'new' ? 'New category' : `Edit ${editing.name}`}
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Name" value={values.name} onChange={set('name')} error={errors.name} placeholder="Electronics" />
            <Field label="Sort order" type="number" value={values.sortOrder} onChange={set('sortOrder')} hint="Lower numbers appear first." />
            <Field className="sm:col-span-2" label="Description" value={values.description} onChange={set('description')} placeholder="Audio, phones, laptops and cameras." />
            <Field className="sm:col-span-2" label="Cover image URL" value={values.image} onChange={set('image')} placeholder="https://…" />
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-ink-soft">Accent colour</p>
            <div className="flex flex-wrap items-center gap-2">
              {PRESET_ACCENTS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set('accent')(c)}
                  aria-label={`Use accent ${c}`}
                  aria-pressed={values.accent === c}
                  className={`h-9 w-9 rounded-full border-2 transition-transform ${values.accent === c ? 'scale-110 border-ink' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <input
                type="color"
                value={values.accent}
                onChange={set('accent')}
                aria-label="Custom accent colour"
                className="h-9 w-14 cursor-pointer rounded-lg border border-line bg-surface"
              />
              <span className="font-mono text-2xs uppercase text-ink-mute">{values.accent}</span>
            </div>
          </div>

          {failure && (
            <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl bg-danger/10 px-3.5 py-3 text-sm text-danger">
              <Icon name="alert" size={16} className="mt-0.5 shrink-0" /> {failure}
            </p>
          )}

          <div className="mt-5 flex gap-3">
            <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save category'}</Button>
            <Button type="button" variant="outline" onClick={close}>Cancel</Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <li key={c._id} className="rounded-2xl border border-line bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.accent }} />
                    <h2 className="font-display text-base font-bold tracking-[-0.02em]">{c.name}</h2>
                  </div>
                  <p className="clamp-2 mt-1 text-xs text-ink-mute">{c.description || 'No description yet.'}</p>
                  <p className="mt-2 font-mono text-2xs uppercase tracking-[0.1em] text-ink-mute">
                    {c.productCount} product{c.productCount === 1 ? '' : 's'} · /{c.slug}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => openEdit(c)} aria-label={`Edit ${c.name}`} className="rounded-full p-2 text-ink-mute transition-colors hover:bg-canvas hover:text-ink">
                    <Icon name="filter" size={16} />
                  </button>
                  <button onClick={() => setPending(c)} aria-label={`Delete ${c.name}`} className="rounded-full p-2 text-ink-mute transition-colors hover:bg-canvas hover:text-danger">
                    <Icon name="trash" size={16} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={Boolean(pending)}
        title={`Delete ${pending?.name}?`}
        body="Categories that still have products cannot be deleted — move those products first."
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setPending(null)}
      />
    </>
  );
}
