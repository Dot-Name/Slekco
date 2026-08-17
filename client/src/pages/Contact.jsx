import { useState } from 'react';
import { sendMessage } from '../api/contact';
import { rules, validate } from '../utils/validation';
import Field from '../components/ui/Field';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';

const schema = {
  name: [rules.required('Name'), rules.minLength(2, 'Name')],
  email: [rules.required('Email'), rules.email()],
  message: [rules.required('Message'), rules.minLength(10, 'Message')],
};

const SUBJECTS = ['General', 'Order status', 'Returns and refunds', 'Selling on Slekco', 'Report a problem'];

const channels = [
  { icon: 'mail', label: 'Email', value: 'support@slekco.com', note: 'Replies within one business day' },
  { icon: 'phone', label: 'Phone', value: '1800 200 4400', note: 'Mon–Sat, 9am–7pm IST' },
  { icon: 'pin', label: 'Head office', value: 'Sector 44, Gurugram', note: 'Haryana 122003, India' },
];

export default function Contact() {
  const [values, setValues] = useState({ name: '', email: '', subject: 'General', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const set = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    if (status.state !== 'idle') setStatus({ state: 'idle', message: '' });
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(values, schema);
    setErrors(found);
    if (Object.keys(found).length) {
      document.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    setStatus({ state: 'sending', message: '' });
    try {
      const res = await sendMessage(values);
      setStatus({ state: 'sent', message: res.message });
      setValues({ name: '', email: '', subject: 'General', message: '' });
    } catch (err) {
      setErrors(err.errors || {});
      setStatus({ state: 'error', message: err.message });
    }
  };

  return (
    <div className="shell py-10 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div>
          <p className="eyebrow">Help centre</p>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] lg:text-5xl">
            Talk to a person,
            <br />
            not a ticket queue.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft">
            Order questions, returns, or an idea for something we should stock — send it across and a
            human on the Slekco team will read it.
          </p>

          <ul className="mt-9 space-y-3">
            {channels.map((c) => (
              <li key={c.label} className="flex items-start gap-3.5 rounded-2xl border border-line bg-surface p-4">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-canvas">
                  <Icon name={c.icon} size={18} />
                </span>
                <div>
                  <p className="font-mono text-2xs uppercase tracking-[0.12em] text-ink-mute">{c.label}</p>
                  <p className="mt-0.5 font-semibold">{c.value}</p>
                  <p className="text-xs text-ink-mute">{c.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={submit} noValidate className="rounded-2xl border border-line bg-surface p-5 sm:p-7 lg:p-8">
          <h2 className="font-display text-xl font-bold tracking-[-0.02em]">Send a message</h2>
          <p className="mt-1 text-sm text-ink-mute">All fields except the subject are required.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Your name" value={values.name} onChange={set('name')} error={errors.name} autoComplete="name" placeholder="Ananya Rao" />
            <Field label="Email" type="email" value={values.email} onChange={set('email')} error={errors.email} autoComplete="email" placeholder="you@example.com" />
            <Field className="sm:col-span-2" as="select" label="Subject" value={values.subject} onChange={set('subject')}>
              {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </Field>
            <Field
              className="sm:col-span-2"
              as="textarea"
              label="Message"
              value={values.message}
              onChange={set('message')}
              error={errors.message}
              hint={`${values.message.trim().length}/10 characters minimum`}
              placeholder="Tell us what you need — order number helps if you have one."
            />
          </div>

          {status.state === 'sent' && (
            <p role="status" className="mt-5 flex items-start gap-2 rounded-xl bg-success/10 px-4 py-3 text-sm text-success">
              <Icon name="check" size={16} className="mt-0.5 shrink-0" /> {status.message}
            </p>
          )}
          {status.state === 'error' && (
            <p role="alert" className="mt-5 flex items-start gap-2 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
              <Icon name="alert" size={16} className="mt-0.5 shrink-0" /> {status.message}
            </p>
          )}

          <Button type="submit" size="lg" full className="mt-6" disabled={status.state === 'sending'}>
            {status.state === 'sending' ? 'Sending…' : 'Send message'}
          </Button>
        </form>
      </div>
    </div>
  );
}
