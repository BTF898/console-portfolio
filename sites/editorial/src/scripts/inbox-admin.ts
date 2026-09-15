// Minimal admin client: the token lives in sessionStorage and is sent as a
// Bearer header. The server middleware is the real gate.
const TOKEN_KEY = 'atelier-admin-token';

const login = document.getElementById('inbox-login');
const panel = document.getElementById('inbox-panel');
const list = document.getElementById('inbox-list');
const count = document.getElementById('inbox-count');
const tokenInput = document.getElementById('token') as HTMLInputElement | null;
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');

type Message = {
  id: number;
  name: string;
  email: string;
  message: string;
  read: number;
  created_at: string;
};

let token = sessionStorage.getItem(TOKEN_KEY) ?? '';

async function api(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(path, {
    ...init,
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
      ...(init.headers ?? {}),
    },
  });
}

function showLogin() {
  if (login) login.hidden = false;
  if (panel) panel.hidden = true;
}

function showPanel() {
  if (login) login.hidden = true;
  if (panel) panel.hidden = false;
}

function render(messages: Message[]) {
  if (!list) return;
  list.innerHTML = '';
  for (const m of messages) {
    const li = document.createElement('li');
    li.className = `msg${m.read ? '' : ' unread'}`;
    li.innerHTML = `
      <div class="msg-head">
        <span class="who"></span>
        <span class="when"></span>
      </div>
      <div class="msg-body"></div>
      <div class="msg-actions">
        <button data-act="read"></button>
        <button data-act="delete">Delete</button>
      </div>`;
    li.querySelector('.who')!.textContent = `${m.name} · ${m.email}`;
    li.querySelector('.when')!.textContent = new Date(m.created_at).toLocaleString();
    li.querySelector('.msg-body')!.textContent = m.message;
    const readBtn = li.querySelector<HTMLButtonElement>('[data-act="read"]')!;
    readBtn.textContent = m.read ? 'Mark unread' : 'Mark read';
    readBtn.addEventListener('click', async () => {
      await api(`/api/inbox/${m.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ read: !m.read }),
      });
      load();
    });
    li.querySelector('[data-act="delete"]')!.addEventListener('click', async () => {
      await api(`/api/inbox/${m.id}`, { method: 'DELETE' });
      load();
    });
    list.append(li);
  }
}

async function load() {
  try {
    const res = await api('/api/inbox');
    if (res.status === 401 || res.status === 503) {
      sessionStorage.removeItem(TOKEN_KEY);
      token = '';
      showLogin();
      return;
    }
    const out = (await res.json()) as { count: number; messages: Message[] };
    if (count) count.textContent = `${out.count} message${out.count === 1 ? '' : 's'}`;
    render(out.messages);
    showPanel();
  } catch {
    showLogin();
  }
}

loginBtn?.addEventListener('click', () => {
  token = (tokenInput?.value ?? '').trim();
  if (!token) return;
  sessionStorage.setItem(TOKEN_KEY, token);
  load();
});

tokenInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') loginBtn?.click();
});

logoutBtn?.addEventListener('click', () => {
  sessionStorage.removeItem(TOKEN_KEY);
  token = '';
  showLogin();
});

if (token) {
  load();
} else {
  showLogin();
}
