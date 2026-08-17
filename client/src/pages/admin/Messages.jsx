import { useState } from 'react';
import { fetchMessages, markMessageRead } from '../../api/admin';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

import AdminHeader from '../../components/admin/AdminHeader';
import Icon from '../../components/ui/Icon';
import StateMessage from '../../components/ui/StateMessage';

export default function AdminMessages() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [version, setVersion] = useState(0);
  const { data, loading, error, retry } = useApi((o) => fetchMessages(token, o), [token, version]);

  const markRead = async (m) => {
    try {
      await markMessageRead(m._id, token);
      setVersion((v) => v + 1);
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  return (
    <>
      <AdminHeader eyebrow="Support" title="Messages" description="Everything submitted through the contact form on the storefront." />

      {error ? (
        <StateMessage icon="alert" title="Messages did not load" body={error.message} actionLabel="Try again" onAction={retry} />
      ) : loading ? (
        <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
      ) : data.items.length === 0 ? (
        <StateMessage icon="mail" title="No messages yet" body="Support requests from the contact form land here." />
      ) : (
        <ul className="space-y-2">
          {data.items.map((m) => (
            <li key={m._id} className={`rounded-2xl border p-4 ${m.isRead ? 'border-line bg-surface' : 'border-ink bg-surface'}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    {!m.isRead && <span className="h-2 w-2 rounded-full bg-brand-500" aria-label="Unread" />}
                    {m.name}
                    <span className="font-mono text-2xs uppercase tracking-[0.1em] text-ink-mute">{m.subject}</span>
                  </p>
                  <a href={`mailto:${m.email}`} className="text-xs text-ink-mute underline-offset-4 hover:text-ink hover:underline">{m.email}</a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-2xs text-ink-mute">
                    {new Date(m.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  {!m.isRead && (
                    <button onClick={() => markRead(m)} className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs transition-colors hover:border-ink">
                      <Icon name="check" size={14} /> Mark read
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-soft">{m.message}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
