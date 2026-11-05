const fechaLimite = new Date("2026-11-27T23:59:59").getTime();
const dias = document.getElementById("dias");
const horas = document.getElementById("horas");
const minutos = document.getElementById("minutos");
const segundos = document.getElementById("segundos");
const mensaje = document.getElementById("mensaje");

const pad = (n) => String(n).padStart(2, "0");

function actualizar() {
  const distancia = fechaLimite - Date.now();

  if (distancia <= 0) {
    clearInterval(intervalo);
    dias.textContent = horas.textContent = minutos.textContent = segundos.textContent = "00";
    mensaje.textContent = "¡Tiempo expirado!";
    return;
  }

  dias.textContent = pad(Math.floor(distancia / (1000 * 60 * 60 * 24)));
  horas.textContent = pad(Math.floor((distancia / (1000 * 60 * 60)) % 24));
  minutos.textContent = pad(Math.floor((distancia / (1000 * 60)) % 60));
  segundos.textContent = pad(Math.floor((distancia / 1000) % 60));
}

const intervalo = setInterval(actualizar, 1000);
actualizar();

document.querySelectorAll(".color img, .lb-fig img").forEach((img) => {
  img.addEventListener("error", () => img.remove());
});

const pista = document.querySelector(".pista");
const prev = document.querySelector(".carrusel__nav--prev");
const next = document.querySelector(".carrusel__nav--next");

function visibles() {
  const n = parseFloat(getComputedStyle(document.querySelector(".carrusel")).getPropertyValue("--visibles"));
  return Math.max(1, Math.floor(n) || 1);
}

function paso() {
  const tarjeta = pista.querySelector(".tarjeta");
  if (!tarjeta) return pista.clientWidth;
  const estilo = getComputedStyle(pista);
  const gap = parseFloat(estilo.columnGap || estilo.gap) || 0;
  return tarjeta.getBoundingClientRect().width + gap;
}

function sincronizar() {
  const max = pista.scrollWidth - pista.clientWidth - 2;
  prev.disabled = pista.scrollLeft <= 2;
  next.disabled = pista.scrollLeft >= max;
}

prev.addEventListener("click", () => {
  pista.scrollBy({ left: -paso() * visibles(), behavior: "smooth" });
});

next.addEventListener("click", () => {
  pista.scrollBy({ left: paso() * visibles(), behavior: "smooth" });
});

document.querySelectorAll(".nav__list a").forEach((enlace) => {
  enlace.addEventListener("click", () => {
    document.getElementById("menu-toggle").checked = false;
  });
});

pista.addEventListener("scroll", sincronizar, { passive: true });
window.addEventListener("resize", sincronizar);
sincronizar();

document.querySelectorAll(".lb-flecha").forEach((boton) => {
  boton.addEventListener("click", () => {
    const destinoId = boton.getAttribute("popovertarget");
    setTimeout(() => {
      const destino = document.getElementById(destinoId);
      document.querySelectorAll(".lightbox").forEach((caja) => {
        if (caja !== destino && caja.matches(":popover-open")) caja.hidePopover();
      });
      if (destino && !destino.matches(":popover-open")) destino.showPopover();
    }, 0);
  });
});
