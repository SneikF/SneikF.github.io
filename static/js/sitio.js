/* Tema claro/oscuro, menú flotante y visor de imágenes. Sin dependencias. */
(function () {
  var raiz = document.documentElement;

  /* ---------- Tema ---------- */
  document.querySelectorAll('.boton-tema').forEach(function (boton) {
    boton.addEventListener('click', function () {
      var actual = raiz.dataset.tema || (matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro');
      var nuevo = actual === 'oscuro' ? 'claro' : 'oscuro';
      raiz.dataset.tema = nuevo;
      try { localStorage.setItem('tema', nuevo); } catch (e) {}
    });
  });

  /* ---------- Menú flotante (aparece al bajar) ---------- */
  var cabecera = document.querySelector('header.sitio');
  var botonMenu = document.querySelector('.menu-boton');
  var panel = document.getElementById('menu-flotante');

  function alDesplazar() {
    var abajo = window.scrollY > (cabecera ? cabecera.offsetHeight : 0);
    document.body.classList.toggle('desplazado', abajo);
    if (!abajo) cerrarMenu();
  }
  function cerrarMenu() {
    if (!panel) return;
    panel.hidden = true;
    botonMenu.setAttribute('aria-expanded', 'false');
  }
  if (botonMenu && panel) {
    botonMenu.addEventListener('click', function () {
      var abrir = panel.hidden;
      panel.hidden = !abrir;
      botonMenu.setAttribute('aria-expanded', String(abrir));
    });
    document.addEventListener('click', function (e) {
      if (!panel.hidden && !panel.contains(e.target) && !botonMenu.contains(e.target)) cerrarMenu();
    });
    window.addEventListener('scroll', alDesplazar, { passive: true });
    alDesplazar();
  }

  /* ---------- Visor de imágenes ---------- */
  var visor = document.getElementById('visor');
  if (!visor) return;
  var lienzo = visor.querySelector('.visor-lienzo');
  var foto = lienzo.querySelector('img');
  var enlaces = Array.prototype.slice.call(document.querySelectorAll('a.ampliable'));
  var indice = -1;
  var ultimoFoco = null;

  function abrir(i, conZoom) {
    indice = i;
    var a = enlaces[i];
    var img = a.querySelector('img');
    foto.src = a.href;
    foto.alt = img ? img.alt : '';
    visor.classList.toggle('ampliado', !!conZoom);
    ultimoFoco = document.activeElement;
    visor.hidden = false;
    document.body.style.overflow = 'hidden';
    visor.querySelector('[data-accion="cerrar"]').focus();
  }
  function cerrar() {
    if (document.fullscreenElement) document.exitFullscreen();
    visor.hidden = true;
    visor.classList.remove('ampliado');
    foto.removeAttribute('src');
    document.body.style.overflow = '';
    if (ultimoFoco) ultimoFoco.focus();
  }
  function alternarZoom(evento) {
    var ampliar = !visor.classList.contains('ampliado');
    /* Punto donde se hizo clic, en proporción, para acercar ahí mismo */
    var px = 0.5, py = 0.5;
    if (evento && evento.target === foto) {
      var r = foto.getBoundingClientRect();
      px = (evento.clientX - r.left) / r.width;
      py = (evento.clientY - r.top) / r.height;
    }
    visor.classList.toggle('ampliado', ampliar);
    if (ampliar) {
      lienzo.scrollLeft = foto.offsetWidth * px - lienzo.clientWidth / 2;
      lienzo.scrollTop = foto.offsetHeight * py - lienzo.clientHeight / 2;
    }
  }
  function pantallaCompleta() {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (visor.requestFullscreen) visor.requestFullscreen();
  }
  function mover(paso) {
    if (enlaces.length < 2) return;
    abrir((indice + paso + enlaces.length) % enlaces.length, false);
  }

  enlaces.forEach(function (a, i) {
    a.addEventListener('click', function (e) { e.preventDefault(); abrir(i, false); });
  });
  /* «Ampliar» abre la lámina ya acercada */
  document.querySelectorAll('a[data-zoom]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var figura = a.closest('figure');
      var i = enlaces.indexOf(figura && figura.querySelector('a.ampliable'));
      if (i >= 0) abrir(i, true);
    });
  });

  visor.addEventListener('click', function (e) {
    var boton = e.target.closest('[data-accion]');
    if (boton) {
      var accion = boton.dataset.accion;
      if (accion === 'cerrar') cerrar();
      else if (accion === 'zoom') alternarZoom();
      else if (accion === 'pantalla') pantallaCompleta();
    } else if (e.target === foto) {
      alternarZoom(e);
    } else if (e.target === lienzo) {
      cerrar();               /* clic en el fondo oscuro */
    }
  });

  document.addEventListener('keydown', function (e) {
    if (visor.hidden) return;
    if (e.key === 'Escape' && !document.fullscreenElement) cerrar();
    else if (e.key === 'ArrowRight') mover(1);
    else if (e.key === 'ArrowLeft') mover(-1);
    else if (e.key === '+' || e.key === '=' || e.key === '-') alternarZoom();
    else if (e.key === 'f') pantallaCompleta();
  });
})();
