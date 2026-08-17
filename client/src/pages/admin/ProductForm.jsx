import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, uploadImages } from '../../api/admin';
import { fetchProduct } from '../../api/products';
import { useAuth } from '../../context/AuthContext';
import { useCatalog } from '../../context/CatalogContext';
import { useToast } from '../../context/ToastContext';
import { rules, validate } from '../../utils/validation';

import AdminHeader from '../../components/admin/AdminHeader';
import Field from '../../components/ui/Field';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import ProductImage from '../../components/ui/ProductImage';
import StateMessage from '../../components/ui/StateMessage';
import { discountPercent, formatPrice } from '../../utils/format';

const BLANK = {
  name: '', brand: '', category: '', shortDescription: '', description: '',
  price: '', mrp: '', stock: '', badge: '',
  isFeatured: false, isTrending: false, isActive: true,
  highlights: [''], specs: [{ key: '', value: '' }], images: [], tags: '',
};

const positiveNumber = (label) => (v) =>
  v !== '' && Number(v) >= 0 && !Number.isNaN(Number(v)) ? '' : `${label} must be a number, 0 or more.`;

const schema = {
  name: [rules.required('Product name'), rules.minLength(3, 'Product name')],
  brand: [rules.required('Brand')],
  category: [rules.required('Category')],
  price: [rules.required('Price'), positiveNumber('Price')],
  stock: [rules.required('Stock'), positiveNumber('Stock')],
  shortDescription: [rules.required('Short description'), rules.minLength(10, 'Short description')],
};

function Card({ title, hint, children }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 lg:p-6">
      <h2 className="font-display text-lg font-bold tracking-[-0.02em]">{title}</h2>
      {hint && <p className="mt-1 text-sm text-ink-mute">{hint}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Toggle({ label, hint, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-3.5 transition-colors hover:border-line-strong">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${checked ? 'border-ink bg-ink text-white' : 'border-line-strong'}`}>
        {checked && <Icon name="check" size={13} strokeWidth={2.4} />}
      </span>
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-ink-mute">{hint}</span>
      </span>
    </label>
  );
}

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { token } = useAuth();
  const { categories } = useCatalog();
  const { toast } = useToast();
  const fileRef = useRef(null);

  const [values, setValues] = useState(BLANK);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [failure, setFailure] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    let alive = true;
    fetchProduct(id)
      .then(({ item }) => {
        if (!alive) return;
        setValues({
          ...BLANK,
          ...item,
          category: item.category?._id || item.category || '',
          highlights: item.highlights?.length ? item.highlights : [''],
          specs: item.specs?.length ? item.specs : [{ key: '', value: '' }],
          tags: (item.tags || []).join(', '),
          mrp: item.mrp ?? '',
          badge: item.badge || '',
        });
      })
      .catch((err) => alive && setLoadError(err.message))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [id, isEdit]);

  const set = (field) => (e) => {
    const v = e?.target ? e.target.value : e;
    setValues((prev) => ({ ...prev, [field]: v }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    setFailure('');
  };

  const setListItem = (field, index, value) =>
    setValues((prev) => ({ ...prev, [field]: prev[field].map((x, i) => (i === index ? value : x)) }));

  const addListItem = (field, blank) =>
    setValues((prev) => ({ ...prev, [field]: [...prev[field], blank] }));

  const removeListItem = (field, index) =>
    setValues((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));

  const onFiles = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    setFailure('');
    try {
      const urls = await uploadImages(files, token);
      setValues((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
      toast(`${urls.length} image${urls.length === 1 ? '' : 's'} uploaded`);
    } catch (err) {
      setFailure(err.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const addImageUrl = () => {
    const url = imageUrl.trim();
    if (!url) return;
    setValues((prev) => ({ ...prev, images: [...prev.images, url] }));
    setImageUrl('');
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(values, schema);
    if (!values.images.length) found.images = 'Add at least one image.';
    setErrors(found);
    if (Object.keys(found).length) {
      setFailure('Some fields need attention — they are marked below.');
      document.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    const payload = {
      name: values.name.trim(),
      brand: values.brand.trim(),
      category: values.category,
      shortDescription: values.shortDescription.trim(),
      description: values.description.trim(),
      price: Number(values.price),
      mrp: values.mrp === '' ? undefined : Number(values.mrp),
      stock: Number(values.stock),
      badge: values.badge.trim(),
      images: values.images,
      highlights: values.highlights.map((h) => h.trim()).filter(Boolean),
      specs: values.specs.filter((s) => s.key.trim() && s.value.trim()),
      tags: values.tags.split(',').map((t) => t.trim()).filter(Boolean),
      isFeatured: values.isFeatured,
      isTrending: values.isTrending,
      isActive: values.isActive,
    };

    setSaving(true);
    setFailure('');
    try {
      if (isEdit) {
        await updateProduct(id, payload, token);
        toast(`${payload.name} updated`);
      } else {
        await createProduct(payload, token);
        toast(`${payload.name} is now on the storefront`);
      }
      navigate('/admin/products');
    } catch (err) {
      setFailure(err.message);
      setErrors((prev) => ({ ...prev, ...(err.errors || {}) }));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}</div>;
  }

  if (loadError) {
    return <StateMessage icon="alert" title="That product did not load" body={loadError} actionLabel="Back to products" to="/admin/products" />;
  }

  const off = discountPercent(Number(values.price) || 0, Number(values.mrp) || 0);

  return (
    <form onSubmit={submit} noValidate>
      <AdminHeader
        eyebrow={isEdit ? 'Editing' : 'New listing'}
        title={isEdit ? values.name || 'Edit product' : 'Add a product'}
        description="Saved products are served by the same API the storefront reads, so changes are live immediately."
      >
        <Button type="button" variant="outline" to="/admin/products">Cancel</Button>
        <Button type="submit" disabled={saving || uploading}>
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Publish product'}
        </Button>
      </AdminHeader>

      {failure && (
        <p role="alert" className="mb-4 flex items-start gap-2 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
          <Icon name="alert" size={16} className="mt-0.5 shrink-0" /> {failure}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card title="Basics">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field className="sm:col-span-2" label="Product name" value={values.name} onChange={set('name')} error={errors.name} placeholder="Nova Pro Wireless Headphones" />
              <Field label="Brand" value={values.brand} onChange={set('brand')} error={errors.brand} placeholder="Aurex" />
              <Field as="select" label="Category" value={values.category} onChange={set('category')} error={errors.category}>
                <option value="">Choose a category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </Field>
              <Field
                className="sm:col-span-2" label="Short description" value={values.shortDescription}
                onChange={set('shortDescription')} error={errors.shortDescription}
                hint="One line, shown on cards and under the product title."
                placeholder="Over-ear ANC headphones with 40-hour battery."
              />
              <Field
                className="sm:col-span-2" as="textarea" label="Full description"
                value={values.description} onChange={set('description')}
                hint="Shown on the product page under “About this product”."
              />
            </div>
          </Card>

          <Card title="Images" hint="Upload from your computer, or paste a URL. The first image is the one shown on cards.">
            <div className="flex flex-wrap items-center gap-2">
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={onFiles} className="hidden" id="product-images" />
              <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
                <Icon name="plus" size={16} /> {uploading ? 'Uploading…' : 'Upload images'}
              </Button>
              <span className="font-mono text-2xs uppercase tracking-[0.1em] text-ink-mute">JPG, PNG or WebP · max 5 MB each</span>
            </div>

            <div className="mt-3 flex gap-2">
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                placeholder="…or paste an image URL"
                aria-label="Image URL"
                className="h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-sm focus:border-ink"
              />
              <Button type="button" variant="quiet" onClick={addImageUrl} disabled={!imageUrl.trim()}>Add</Button>
            </div>

            {errors.images && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-danger"><Icon name="alert" size={14} /> {errors.images}</p>
            )}

            {values.images.length > 0 && (
              <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {values.images.map((src, i) => (
                  <li key={src + i} className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-canvas">
                    <ProductImage src={src} alt={`Image ${i + 1}`} className="h-full w-full object-cover" />
                    {i === 0 && (
                      <span className="absolute left-1.5 top-1.5 rounded-full bg-ink px-2 py-0.5 font-mono text-2xs uppercase text-white">Main</span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeListItem('images', i)}
                      aria-label={`Remove image ${i + 1}`}
                      className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-surface/90 text-ink-mute backdrop-blur transition-colors hover:text-danger"
                    >
                      <Icon name="close" size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Highlights" hint="Short bullets shown next to the price on the product page.">
            <div className="space-y-2">
              {values.highlights.map((h, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={h}
                    onChange={(e) => setListItem('highlights', i, e.target.value)}
                    placeholder="40-hour battery, 10-min quick charge"
                    aria-label={`Highlight ${i + 1}`}
                    className="h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-sm focus:border-ink"
                  />
                  <button type="button" onClick={() => removeListItem('highlights', i)} aria-label={`Remove highlight ${i + 1}`} className="shrink-0 rounded-xl px-3 text-ink-mute transition-colors hover:text-danger">
                    <Icon name="trash" size={17} />
                  </button>
                </div>
              ))}
            </div>
            <Button type="button" variant="quiet" size="sm" className="mt-3" onClick={() => addListItem('highlights', '')}>
              <Icon name="plus" size={15} /> Add highlight
            </Button>
          </Card>

          <Card title="Specifications" hint="Key and value pairs, shown as a table on the product page.">
            <div className="space-y-2">
              {values.specs.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={s.key}
                    onChange={(e) => setListItem('specs', i, { ...s, key: e.target.value })}
                    placeholder="Battery life"
                    aria-label={`Specification ${i + 1} name`}
                    className="h-11 w-2/5 rounded-xl border border-line bg-surface px-3.5 text-sm focus:border-ink"
                  />
                  <input
                    value={s.value}
                    onChange={(e) => setListItem('specs', i, { ...s, value: e.target.value })}
                    placeholder="Up to 40 hours"
                    aria-label={`Specification ${i + 1} value`}
                    className="h-11 flex-1 rounded-xl border border-line bg-surface px-3.5 text-sm focus:border-ink"
                  />
                  <button type="button" onClick={() => removeListItem('specs', i)} aria-label={`Remove specification ${i + 1}`} className="shrink-0 rounded-xl px-3 text-ink-mute transition-colors hover:text-danger">
                    <Icon name="trash" size={17} />
                  </button>
                </div>
              ))}
            </div>
            <Button type="button" variant="quiet" size="sm" className="mt-3" onClick={() => addListItem('specs', { key: '', value: '' })}>
              <Icon name="plus" size={15} /> Add specification
            </Button>
          </Card>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <Card title="Pricing and stock">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <Field label="Selling price (₹)" type="number" inputMode="numeric" min="0" value={values.price} onChange={set('price')} error={errors.price} />
              <Field label="MRP (₹)" type="number" inputMode="numeric" min="0" value={values.mrp} onChange={set('mrp')} hint={off > 0 ? `Shows as −${off}% on the card.` : 'Optional — the struck-through price.'} />
              <Field label="Stock" type="number" inputMode="numeric" min="0" value={values.stock} onChange={set('stock')} error={errors.stock} />
              <Field label="Badge" value={values.badge} onChange={set('badge')} hint="Optional, e.g. “Best seller”." />
            </div>
          </Card>

          <Card title="Visibility">
            <div className="space-y-2">
              <Toggle label="Live on storefront" hint="Uncheck to keep it as a draft." checked={values.isActive} onChange={set('isActive')} />
              <Toggle label="Featured" hint="Eligible for the homepage hero." checked={values.isFeatured} onChange={set('isFeatured')} />
              <Toggle label="Trending" hint="Shows in the trending rail." checked={values.isTrending} onChange={set('isTrending')} />
            </div>
            <Field className="mt-4" label="Tags" value={values.tags} onChange={set('tags')} hint="Comma separated — they power search." placeholder="headphones, audio, anc" />
          </Card>

          <Card title="Card preview">
            <div className="overflow-hidden rounded-xl border border-line">
              <div className="relative aspect-[4/5] bg-canvas">
                <ProductImage src={values.images[0]} alt={values.name || 'Preview'} className="h-full w-full object-cover" />
                {off > 0 && <span className="absolute left-2 top-2 rounded-full bg-ink px-2 py-0.5 font-mono text-2xs text-white">−{off}%</span>}
              </div>
              <div className="p-3">
                <p className="font-mono text-2xs uppercase tracking-[0.12em] text-ink-mute">{values.brand || 'Brand'}</p>
                <p className="clamp-2 mt-1 text-sm font-semibold">{values.name || 'Product name'}</p>
                <p className="mt-1 font-display text-lg font-bold">{formatPrice(Number(values.price) || 0)}</p>
              </div>
            </div>
          </Card>

          <Button type="submit" full size="lg" disabled={saving || uploading}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Publish product'}
          </Button>
        </aside>
      </div>
    </form>
  );
}
