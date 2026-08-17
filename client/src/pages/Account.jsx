import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { rules, validate } from '../utils/validation';
import Field from '../components/ui/Field';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';

const schemas = {
  signin: { email: [rules.required('Email'), rules.email()], password: [rules.required('Password')] },
  register: {
    name: [rules.required('Name'), rules.minLength(2, 'Name')],
    email: [rules.required('Email'), rules.email()],
    password: [rules.required('Password'), rules.minLength(6, 'Password')],
  },
};

export default function Account() {
  const { user, signIn, register, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [mode, setMode] = useState('signin');
  const [values, setValues] = useState({ name: '', email: '', password: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [failure, setFailure] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    setFailure('');
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(values, schemas[mode]);
    setErrors(found);
    if (Object.keys(found).length) return;

    setBusy(true);
    setFailure('');
    try {
      const u = mode === 'signin'
        ? await signIn({ email: values.email, password: values.password })
        : await register(values);
      toast(mode === 'signin' ? `Signed in as ${u.name}` : `Welcome to Slekco, ${u.name.split(' ')[0]}`);
      navigate(u.role === 'admin' ? '/admin' : '/shop');
    } catch (err) {
      setFailure(err.message);
      setErrors(err.errors || {});
    } finally {
      setBusy(false);
    }
  };

  if (user) {
    return (
      <div className="shell py-16 lg:py-24">
        <div className="mx-auto max-w-md rounded-2xl border border-line bg-surface p-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-canvas">
            <Icon name="user" size={24} />
          </span>
          <h1 className="mt-5 font-display text-2xl font-extrabold tracking-[-0.02em]">{user.name}</h1>
          <p className="mt-1 text-sm text-ink-mute">{user.email}</p>
          <p className="mt-1 font-mono text-2xs uppercase tracking-[0.12em] text-ink-mute">{user.role}</p>
          <div className="mt-7 flex flex-col gap-3">
            {user.role === 'admin' && <Button to="/admin" full><Icon name="shield" size={17} /> Open admin console</Button>}
            <Button to="/shop" variant={user.role === 'admin' ? 'outline' : 'primary'} full>Continue shopping</Button>
            <Button variant="outline" full onClick={() => { signOut(); toast('Signed out'); }}>Sign out</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shell py-12 lg:py-20">
      <div className="mx-auto max-w-md">
        <p className="eyebrow text-center">Slekco account</p>
        <h1 className="mt-3 text-center font-display text-3xl font-extrabold tracking-[-0.03em]">
          {mode === 'signin' ? 'Welcome back' : 'Create an account'}
        </h1>
        <p className="mt-2 text-center text-sm text-ink-soft">
          One account covers every brand and category on the marketplace.
        </p>

        <div className="mt-7 grid grid-cols-2 gap-1 rounded-full border border-line bg-surface p-1">
          {[
            { key: 'signin', label: 'Sign in' },
            { key: 'register', label: 'Register' },
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => { setMode(t.key); setErrors({}); setFailure(''); }}
              className={`h-9 rounded-full text-sm font-medium transition-colors ${
                mode === t.key ? 'bg-ink text-white' : 'text-ink-soft hover:bg-canvas'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={submit} noValidate className="mt-5 rounded-2xl border border-line bg-surface p-6">
          <div className="grid gap-4">
            {mode === 'register' && (
              <Field label="Full name" value={values.name} onChange={set('name')} error={errors.name} autoComplete="name" />
            )}
            <Field label="Email" type="email" value={values.email} onChange={set('email')} error={errors.email} autoComplete="email" />
            <Field
              label="Password" type="password" value={values.password} onChange={set('password')}
              error={errors.password}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              hint={mode === 'register' ? 'At least 6 characters.' : undefined}
            />
            {mode === 'register' && (
              <Field label="Phone (optional)" value={values.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" inputMode="tel" />
            )}
          </div>

          {failure && (
            <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl bg-danger/10 px-3.5 py-3 text-sm text-danger">
              <Icon name="alert" size={16} className="mt-0.5 shrink-0" /> {failure}
            </p>
          )}

          <Button type="submit" size="lg" full className="mt-5" disabled={busy}>
            {busy ? 'Working…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </Button>

          {mode === 'signin' && (
            <p className="mt-4 rounded-xl bg-canvas px-3.5 py-3 text-center text-xs text-ink-mute">
              Demo login — <span className="font-mono">admin@slekco.com</span> / <span className="font-mono">admin123</span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
