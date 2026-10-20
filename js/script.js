// 모바일 메뉴
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open);
});
nav.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
});

// 스크롤 시 나타나기 + 팀 막대 + 숫자 카운트
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('.section .container > *, .stats-grid').forEach((el) => el.classList.add('reveal'));

function countUp(el) {
  const target = Number(el.dataset.count);
  const pre = el.dataset.prefix || '';
  const suf = el.dataset.suffix || '';
  if (reduceMotion) return;
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min((now - start) / 1000, 1);
    el.textContent = pre + Math.round(target * t).toLocaleString('ko-KR') + suf;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const max = 11;
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add('is-visible');
    el.querySelectorAll('[data-count]').forEach(countUp);
    if (el.id === 'team-bars') {
      el.querySelectorAll('li').forEach((li) => {
        li.querySelector('i').style.width = (li.dataset.n / max) * 100 + '%';
      });
    }
    io.unobserve(el);
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// 현재 섹션 메뉴 강조
const links = [...nav.querySelectorAll('a')];
const spy = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      links.forEach((a) => a.classList.toggle('is-active', a.hash === '#' + entry.target.id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));
