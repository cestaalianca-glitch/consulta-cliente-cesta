// Modo offline da Consulta de Cliente (20/10/2026). A versão antiga (Netlify) tinha; a do GitHub Pages perdeu,
// e sem internet a página só abria por sorte (cache do navegador). Guarda a página, o login e a biblioteca do
// Supabase no aparelho. Os DADOS dos clientes ficam no IndexedDB (ver index.html), não aqui.
// Página e arquivos: tenta a internet primeiro (pega versão nova), cai pra cópia se não tiver sinal.
// Biblioteca do Supabase (CDN): cópia primeiro. Chamadas ao banco/login (supabase.co): nunca guardadas.
const VERSAO = 'consulta-v2';
const ARQUIVOS = ['./', './index.html', './config.js', './login-gate.js', './manifest-consulta.json', './icon-192.png', './icon-512.png'];
const CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSAO).then((c) => c.addAll([...ARQUIVOS, CDN])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSAO).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.href.startsWith(CDN)) {
    e.respondWith(caches.match(CDN).then((r) => r || fetch(req).then((resp) => { const copia = resp.clone(); caches.open(VERSAO).then((c) => c.put(CDN, copia)); return resp; })));
    return;
  }
  if (url.origin !== self.location.origin || !url.pathname.startsWith(new URL('./', self.registration.scope).pathname)) return;
  e.respondWith(
    fetch(req).then((resp) => {
      if (resp.ok) { const copia = resp.clone(); caches.open(VERSAO).then((c) => c.put(req, copia)); }
      return resp;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match('./index.html')))
  );
});
