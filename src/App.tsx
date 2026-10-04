import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUp, Check, CircleHelp, LogOut, MessageCircle, MoreHorizontal, Paperclip, Search, Send, Smile, Sparkles, Wifi, X } from 'lucide-react';
import type { Socket } from 'socket.io-client';
import { getContacts, getCurrentUser, getMessages, login } from './lib/api';
import { createSocket } from './lib/socket';
import type { Message, User } from './types';

type Presence = Record<string, boolean>;

const demoEmail = 'maya@relayroom.dev';
const demoPassword = 'relay123';

function initials(name: string) {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2);
}

function formatTime(isoDate: string) {
  return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date(isoDate));
}

function formatDay(isoDate: string) {
  return new Intl.DateTimeFormat('en', { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date(isoDate));
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('relay-token') || '');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<User[]>([]);
  const [activeContactId, setActiveContactId] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [presence, setPresence] = useState<Presence>({});
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isMobileContactsOpen, setIsMobileContactsOpen] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const activeContactIdRef = useRef(activeContactId);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    activeContactIdRef.current = activeContactId;
  }, [activeContactId]);

  const activeContact = contacts.find((contact) => contact.id === activeContactId) || null;
  const filteredContacts = useMemo(() => contacts.filter((contact) => contact.name.toLowerCase().includes(search.toLowerCase()) || contact.role.toLowerCase().includes(search.toLowerCase())), [contacts, search]);

  useEffect(() => {
    if (!token) return;
    let mounted = true;
    Promise.all([getCurrentUser(token), getContacts(token)]).then(([{ user }, { contacts: loadedContacts }]) => {
      if (!mounted) return;
      setCurrentUser(user);
      setContacts(loadedContacts);
      setPresence(Object.fromEntries(loadedContacts.map((contact) => [contact.id, Boolean(contact.online)])));
      setActiveContactId((current) => (loadedContacts.some((c) => c.id === current) ? current : loadedContacts[0]?.id || ''));
    }).catch(() => {
      localStorage.removeItem('relay-token');
      setToken('');
    });
    return () => { mounted = false; };
  }, [token]);

  useEffect(() => {
    if (!token || !currentUser) return;
    const socket = createSocket(token);
    socketRef.current = socket;

    socket.on('message:new', (message: Message) => {
      const activeId = activeContactIdRef.current;
      if (activeId && message.roomId === [currentUser.id, activeId].sort().join('__')) {
        setMessages((existing) => {
          if (existing.some((m) => m.id === message.id)) return existing;
          return [...existing, message];
        });
      }
    });

    socket.on('presence:update', ({ userId, online }: { userId: string; online: boolean }) => {
      setPresence((existing) => ({ ...existing, [userId]: online }));
    });

    socket.on('user:typing', ({ userId, name, isTyping }: { userId: string; name: string; isTyping: boolean }) => {
      const activeId = activeContactIdRef.current;
      setTypingUser(isTyping && userId === activeId ? name : null);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, currentUser]);

  useEffect(() => {
    if (!token || !currentUser || !activeContactId) return;
    setTypingUser(null);
    setIsLoadingMessages(true);
    getMessages(token, activeContactId)
      .then(({ messages: loadedMessages }) => setMessages(loadedMessages))
      .finally(() => setIsLoadingMessages(false));
    socketRef.current?.emit('room:join', { contactId: activeContactId });
  }, [token, currentUser, activeContactId]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typingUser]);

  function handleLogin(email: string, password: string) {
    setIsLoggingIn(true);
    setLoginError('');
    login(email, password).then(({ token: newToken, user }) => {
      localStorage.setItem('relay-token', newToken);
      setToken(newToken);
      setCurrentUser(user);
    }).catch((error: Error) => setLoginError(error.message)).finally(() => setIsLoggingIn(false));
  }

  function sendMessage() {
    const body = draft.trim();
    if (!body || !activeContact) return;
    socketRef.current?.emit('message:send', { contactId: activeContact.id, body });
    setDraft('');
    socketRef.current?.emit('user:typing', { contactId: activeContact.id, isTyping: false });
  }

  function handleDraftChange(value: string) {
    setDraft(value);
    if (!activeContact) return;
    socketRef.current?.emit('user:typing', { contactId: activeContact.id, isTyping: value.length > 0 });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => socketRef.current?.emit('user:typing', { contactId: activeContact.id, isTyping: false }), 1200);
  }

  function logout() {
    localStorage.removeItem('relay-token');
    setToken('');
    setCurrentUser(null);
    setMessages([]);
  }

  if (!token || !currentUser) return <LoginScreen isLoggingIn={isLoggingIn} error={loginError} onLogin={handleLogin} />;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${isMobileContactsOpen ? 'sidebar--mobile-open' : ''}`}>
        <div className="brand-row">
          <div className="brand-mark"><MessageCircle size={19} fill="currentColor" /></div>
          <span className="brand-name">relay<span>room</span></span>
          <button className="icon-button sidebar-close" onClick={() => setIsMobileContactsOpen(false)} aria-label="Close contacts"><X size={18} /></button>
        </div>
        <div className="workspace-switcher"><div className="workspace-avatar">R</div><div><strong>Relay workspace</strong><span>Product crew</span></div><MoreHorizontal size={17} /></div>
        <div className="sidebar-heading"><span>Messages</span><button className="icon-button" aria-label="Start a new message"><Sparkles size={16} /></button></div>
        <label className="search-field"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search people" /></label>
        <div className="contact-list">
          <div className="section-label">Team · {contacts.length}</div>
          {filteredContacts.map((contact) => (
            <button key={contact.id} className={`contact-row ${activeContactId === contact.id ? 'contact-row--active' : ''}`} onClick={() => { setActiveContactId(contact.id); setIsMobileContactsOpen(false); }}>
              <span className="avatar" style={{ backgroundColor: contact.color }}>{initials(contact.name)}<i className={presence[contact.id] ? 'status-dot status-dot--online' : 'status-dot'} /></span>
              <span className="contact-copy"><strong>{contact.name}</strong><small>{contact.role}</small></span>
              {presence[contact.id] && <span className="online-label">online</span>}
            </button>
          ))}
        </div>
        <div className="sidebar-footer"><div className="account-row"><span className="avatar avatar--self">{initials(currentUser.name)}</span><span><strong>{currentUser.name}</strong><small>Available</small></span><button className="icon-button" onClick={logout} aria-label="Log out"><LogOut size={16} /></button></div><div className="secure-note"><Wifi size={14} /> End-to-end workspace encryption</div></div>
      </aside>

      <main className="chat-panel">
        <header className="chat-header">
          <button className="icon-button mobile-menu" onClick={() => setIsMobileContactsOpen(true)} aria-label="Open contacts"><ArrowUp size={18} /></button>
          {activeContact && <><span className="avatar" style={{ backgroundColor: activeContact.color }}>{initials(activeContact.name)}<i className={presence[activeContact.id] ? 'status-dot status-dot--online' : 'status-dot'} /></span><div className="chat-title"><h1>{activeContact.name}</h1><span><i className={presence[activeContact.id] ? 'inline-status inline-status--online' : 'inline-status'} />{presence[activeContact.id] ? 'Online now' : 'Offline'} · {activeContact.role}</span></div></>}
          <div className="header-actions"><button className="header-tool"><CircleHelp size={17} /> Help</button><button className="icon-button" aria-label="More conversation options"><MoreHorizontal size={19} /></button></div>
        </header>
        <div className="conversation">
          <div className="conversation-intro"><span className="intro-line" /><span>Today</span><span className="intro-line" /></div>
          <div className="message-list">
            {isLoadingMessages ? <div className="empty-state">Loading conversation...</div> : messages.length === 0 ? <div className="empty-state"><div className="empty-icon"><MessageCircle size={24} /></div><h2>Start a fresh thread</h2><p>Send a note to {activeContact?.name.split(' ')[0]} and it will appear here instantly.</p></div> : messages.map((message) => {
              const isMine = message.senderId === currentUser.id;
              return <div className={`message-group ${isMine ? 'message-group--mine' : ''}`} key={message.id}><span className="message-avatar" style={{ backgroundColor: isMine ? '#102a43' : activeContact?.color }}>{initials(message.senderName)}</span><div className="message-content"><div className="message-meta"><strong>{isMine ? 'You' : message.senderName}</strong><time>{formatTime(message.createdAt)}</time></div><div className="message-bubble">{message.body}</div></div></div>;
            })}
            {typingUser && <div className="typing-row"><span className="typing-dots"><i /><i /><i /></span><span>{typingUser} is typing</span></div>}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="composer-wrap"><div className="composer"><textarea value={draft} onChange={(event) => handleDraftChange(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendMessage(); } }} placeholder={`Message ${activeContact?.name.split(' ')[0] || 'someone'}...`} rows={1} /><div className="composer-actions"><div><button className="icon-button" aria-label="Attach a file"><Paperclip size={18} /></button><button className="icon-button" aria-label="Add emoji"><Smile size={18} /></button></div><button className="send-button" disabled={!draft.trim()} onClick={sendMessage}><Send size={16} /> Send</button></div></div><div className="composer-hint">Press <kbd>Enter</kbd> to send <span>•</span> <kbd>Shift + Enter</kbd> for a new line</div></div>
      </main>
      <aside className="details-panel"><div className="details-top"><span>Conversation</span><button className="icon-button"><MoreHorizontal size={18} /></button></div>{activeContact && <><div className="profile-block"><div className="profile-avatar" style={{ backgroundColor: activeContact.color }}>{initials(activeContact.name)}</div><h2>{activeContact.name}</h2><p>{activeContact.role}</p><span className={presence[activeContact.id] ? 'profile-status profile-status--online' : 'profile-status'}><i />{presence[activeContact.id] ? 'Active now' : 'Offline'}</span></div><div className="detail-divider" /><div className="detail-section"><span className="detail-label">Shared space</span><div className="shared-card"><div className="shared-icon"><MessageCircle size={17} /></div><div><strong>Product crew</strong><small>4 members</small></div></div></div><div className="detail-section"><span className="detail-label">About</span><p className="about-copy">A focused space for quick decisions, thoughtful feedback, and keeping the work moving.</p></div></>}</aside>
    </div>
  );
}

function LoginScreen({ onLogin, isLoggingIn, error }: { onLogin: (email: string, password: string) => void; isLoggingIn: boolean; error: string }) {
  const [email, setEmail] = useState(demoEmail);
  const [password, setPassword] = useState(demoPassword);
  return <div className="login-page"><div className="login-art"><div className="art-grid" /><div className="art-copy"><div className="brand-row"><div className="brand-mark"><MessageCircle size={19} fill="currentColor" /></div><span className="brand-name">relay<span>room</span></span></div><div><p className="eyebrow">REAL-TIME, WITHOUT THE NOISE</p><h1>Make room for better conversations.</h1><p className="art-description">A calm, focused place for teams to think out loud and move work forward together.</p></div><div className="art-caption"><span className="caption-dot" /> Your workspace is live <span>↗</span></div></div><div className="art-sticker"><span>LIVE</span><strong>NOW</strong></div></div><div className="login-form-wrap"><div className="login-form"><div className="mobile-brand"><div className="brand-mark"><MessageCircle size={19} fill="currentColor" /></div><span className="brand-name">relay<span>room</span></span></div><p className="eyebrow">WELCOME BACK</p><h2>Sign in to your workspace</h2><p className="form-lede">Pick up the thread where you left it.</p><form onSubmit={(event) => { event.preventDefault(); onLogin(email, password); }}><label>Email address<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" /></label><label>Password<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" /></label>{error && <div className="form-error">{error}</div>}<button className="login-button" disabled={isLoggingIn}>{isLoggingIn ? 'Connecting...' : 'Enter workspace'} <ArrowUp size={17} /></button></form><div className="demo-note"><Sparkles size={16} /><span><strong>Demo workspace</strong><small>maya@relayroom.dev · relay123</small></span></div></div><footer>Relay Room · Built for clear thinking</footer></div></div>;
}

export default App;
