/* =====================================================
   SITE ROMÂNTICO — script.js
   =====================================================
   Organizado em módulos independentes:
   1. CONFIG         — Configurações centrais
   2. CONTADOR       — Contador de tempo juntos
   3. CORAÇÕES       — Partículas animadas no hero
   4. SCROLL REVEAL  — Animação de entrada ao rolar
   5. LIGHTBOX       — Modal da galeria
   6. TIMELINE       — Geração dos cards da timeline
   7. INIT           — Inicialização de tudo
   ===================================================== */

const CONFIG = {
  dataInicio: new Date(2023, 1, 2, 20, 30, 0),
  nome1: "Marina",
  nome2: "Adriel",
  eventos: [
    { data: "2 fev 2023", emoji: "💘", titulo: "Primeira vez que te vi", descricao: "Foi na sala de aula e por mais que não fosse um ambiente muito agradável, conhecer você foi a melhor coisa que me ocorreu" },
    { data: "30 nov 2023", emoji: "💘", titulo: "Primeira mensagem", descricao: "Primeira vez que te mandei alguma coisa, e você me respondeu me chamando aquele vídeo \"pov:não vai ter ano que vem\"" },
    { data: "5 mar 2024", emoji: "💘", titulo: "Primeira conversa", descricao: "Não é bem a primeira conversa longa que a gente teve, mas foi a primeira vez ficamos horas e horas conversando algo que hoje é rotina" },
    { data: "5 dez 2024", emoji: "💘", titulo: "Primeira andada", descricao: "Não foi a nossa primeira caminhada(seu irmão tava junto), mas eu gosto de guardar esse dia como o início delas" },
    { data: "8 set 2025", emoji: "💘", titulo: "Então a gente combina é?", descricao: "Primeira vez que você deu em cima de mim desecadeando assim o que seria só o começo de tudo" },
    { data: "Hoje", emoji: "💘", titulo: "Nossa história continua...", descricao: "Aguarde as próximas surpresas!" }
  ]
};

function iniciarContador() {
  const elDias = document.getElementById("contador-dias");
  if (!elDias) return;

  const elHoras = document.getElementById("contador-horas");
  const elMinutos = document.getElementById("contador-minutos");
  const elSegundos = document.getElementById("contador-segundos");

  const atualizar = () => {
    const diferenca = Date.now() - CONFIG.dataInicio;
    const totalSegundos = Math.floor(diferenca / 1000);
    const totalMinutos = Math.floor(totalSegundos / 60);
    const totalHoras = Math.floor(totalMinutos / 60);
    const dias = Math.floor(totalHoras / 24);
    elDias.textContent = String(dias);
    elHoras.textContent = String(totalHoras % 24).padStart(2, "0");
    elMinutos.textContent = String(totalMinutos % 60).padStart(2, "0");
    elSegundos.textContent = String(totalSegundos % 60).padStart(2, "0");
  };

  atualizar();
  setInterval(atualizar, 1000);
}

function iniciarCoracoes() {
  const canvas = document.getElementById("canvas-coracoes");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const ajustarTamanho = () => {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  };

  ajustarTamanho();
  window.addEventListener("resize", ajustarTamanho);

  const particulas = [];
  const MAX_PARTICULAS = window.innerWidth < 480 ? 14 : 28;

  const criarParticula = () => ({
    x: Math.random() * canvas.width,
    y: canvas.height + Math.random() * 50,
    tamanho: Math.random() * 14 + 8,
    velocidade: Math.random() * 0.8 + 0.3,
    opacidade: Math.random() * 0.5 + 0.2,
    oscilacao: Math.random() * Math.PI * 2,
    velocOscil: (Math.random() - 0.5) * 0.04
  });

  for (let i = 0; i < MAX_PARTICULAS; i++) {
    const p = criarParticula();
    p.y = Math.random() * canvas.height;
    particulas.push(p);
  }

  const desenharCoracao = (x, y, tamanho, opacidade) => {
    const s = tamanho / 10;
    ctx.save();
    ctx.globalAlpha = opacidade;
    ctx.fillStyle = "rgb(238, 26, 26)";
    ctx.beginPath();
    ctx.moveTo(x, y + s * 3);
    ctx.bezierCurveTo(x, y + s, x - s * 5, y, x - s * 5, y + s * 3);
    ctx.bezierCurveTo(x - s * 5, y + s * 6, x, y + s * 8, x, y + s * 10);
    ctx.bezierCurveTo(x, y + s * 8, x + s * 5, y + s * 6, x + s * 5, y + s * 3);
    ctx.bezierCurveTo(x + s * 5, y, x, y + s, x, y + s * 3);
    ctx.fill();
    ctx.restore();
  };

  const animar = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particulas.forEach((p, i) => {
      p.y -= p.velocidade;
      p.oscilacao += p.velocOscil;
      const xAtual = p.x + Math.sin(p.oscilacao) * 20;
      desenharCoracao(xAtual, p.y, p.tamanho, p.opacidade);
      if (p.y < -30) particulas[i] = criarParticula();
    });
    requestAnimationFrame(animar);
  };

  animar();
}

function iniciarScrollReveal() {
  const elementos = document.querySelectorAll(".revelar");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visivel");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  elementos.forEach(el => observer.observe(el));
}

function iniciarLightbox() {
  const lightbox = document.getElementById("lightbox");
  const imgLightbox = document.getElementById("lightbox-img");
  const btnFechar = document.getElementById("lightbox-fechar");
  if (!lightbox) return;

  const fechar = () => {
    lightbox.classList.remove("ativo");
    document.body.style.overflow = "";
    imgLightbox.src = "";
  };

  const abrir = (src, alt = "Foto") => {
    imgLightbox.src = src;
    imgLightbox.alt = alt;
    lightbox.classList.add("ativo");
    document.body.style.overflow = "hidden";
  };

  document.querySelectorAll(".galeria-item[data-src]").forEach(item => {
    item.addEventListener("click", () => abrir(item.dataset.src, item.dataset.alt));
  });
  btnFechar.addEventListener("click", fechar);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) fechar(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") fechar(); });
}

function gerarTimeline() {
  const wrapper = document.getElementById("timeline-wrapper");
  if (!wrapper) return;
  wrapper.innerHTML = CONFIG.eventos.map(evento => `
    <div class="timeline-item revelar">
      <div class="timeline-ponto" aria-hidden="true">${evento.emoji}</div>
      <div class="timeline-card">
        <span class="timeline-data">${evento.data}</span>
        <h3 class="timeline-evento">${evento.titulo}</h3>
        <p class="timeline-desc">${evento.descricao}</p>
      </div>
    </div>
  `).join("");
}

function iniciarNavLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(link.hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  document.querySelector(".hero-seta")?.addEventListener("click", () => {
    document.getElementById("contador")?.scrollIntoView({ behavior: "smooth" });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  gerarTimeline();
  iniciarContador();
  iniciarCoracoes();
  iniciarScrollReveal();
  iniciarLightbox();
  iniciarNavLinks();
});
