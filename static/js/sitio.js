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

  /* ---------- Secuencias: fila circular de fotos con botones ‹ › ----------
     No tiene fin: después de la última vuelve la primera. Se logra moviendo la foto
     que sale por un lado al otro extremo de la fila. */
  document.querySelectorAll('.secuencia').forEach(function (sec) {
    var pista = sec.querySelector('.secuencia-pista');
    var botones = sec.querySelectorAll('.secuencia-boton');
    var ocupado = false;
    sec.classList.add('activa');
    function paso() {
      var f = pista.children;
      return f.length > 1 ? f[1].offsetLeft - f[0].offsetLeft : 0;
    }
    function sinAnimacion(fn) {
      pista.style.transition = 'none';
      fn();
      void pista.offsetWidth;          /* aplica el cambio antes de volver a animar */
      pista.style.transition = '';
    }
    function avanzar(dir) {
      if (ocupado || pista.children.length < 2) return;
      ocupado = true;
      var d = paso();
      if (dir > 0) {
        /* la primera foto sale por la izquierda y pasa al final */
        pista.style.transform = 'translateX(' + (-d) + 'px)';
        setTimeout(function () {
          sinAnimacion(function () {
            pista.appendChild(pista.firstElementChild);
            pista.style.transform = 'translateX(0)';
          });
          ocupado = false;
        }, 500);
      } else {
        /* la última foto pasa al principio y entra por la izquierda */
        sinAnimacion(function () {
          pista.insertBefore(pista.lastElementChild, pista.firstElementChild);
          pista.style.transform = 'translateX(' + (-d) + 'px)';
        });
        pista.style.transform = 'translateX(0)';
        setTimeout(function () { ocupado = false; }, 500);
      }
    }
    botones.forEach(function (b) {
      b.addEventListener('click', function () { avanzar(Number(b.dataset.paso)); });
    });
  });

  /* ---------- Visor de imágenes ---------- */
  var visor = document.getElementById('visor');
  if (!visor) return;
  var lienzo = visor.querySelector('.visor-lienzo');
  var foto = lienzo.querySelector('.visor-principal');
  var vecinoIzq = lienzo.querySelector('.visor-vecino-izq');
  var vecinoDer = lienzo.querySelector('.visor-vecino-der');
  var grupo = [];   /* imágenes entre las que se navega (toda la página o una secuencia) */
  var enlaces = Array.prototype.slice.call(document.querySelectorAll('a.ampliable'));
  var indice = -1;
  var ultimoFoco = null;

  function abrir(a, conZoom) {
    var sec = a.closest('.secuencia');
    grupo = sec ? Array.prototype.slice.call(sec.querySelectorAll('a.ampliable')) : enlaces;
    indice = grupo.indexOf(a);
    var img = a.querySelector('img');
    foto.src = a.href;
    foto.alt = img ? img.alt : a.textContent.trim();
    visor.classList.toggle('ampliado', !!conZoom);
    visor.classList.toggle('una-sola', grupo.length < 2);
    /* En una secuencia se ven también la foto anterior y la siguiente, a los lados */
    visor.classList.toggle('modo-secuencia', !!sec);
    if (sec) {
      var n = grupo.length;
      ponerVecino(vecinoIzq, n > 1 ? grupo[(indice - 1 + n) % n] : null);
      ponerVecino(vecinoDer, n > 2 ? grupo[(indice + 1) % n] : null);
    }
    if (visor.hidden) {
      ultimoFoco = document.activeElement;
      visor.hidden = false;
      document.body.style.overflow = 'hidden';
      visor.querySelector('[data-accion="cerrar"]').focus();
    }
  }
  function ponerVecino(el, a) {
    if (a) { el.src = a.querySelector('img') ? a.querySelector('img').src : a.href; el.style.visibility = 'visible'; }
    else { el.removeAttribute('src'); el.style.visibility = 'hidden'; }
  }
  function cerrar() {
    if (document.fullscreenElement) document.exitFullscreen();
    visor.hidden = true;
    visor.classList.remove('ampliado');
    foto.removeAttribute('src');
    visor.classList.remove('modo-secuencia');
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
    if (grupo.length < 2) return;
    abrir(grupo[(indice + paso + grupo.length) % grupo.length], false);   /* da la vuelta */
  }

  enlaces.forEach(function (a, i) {
    a.addEventListener('click', function (e) { e.preventDefault(); abrir(a, false); });
  });
  /* «Ampliar» abre la lámina ya acercada */
  document.querySelectorAll('a[data-zoom]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var figura = a.closest('figure');
      var objetivo = figura && figura.querySelector('a.ampliable');
      if (objetivo) abrir(objetivo, true);
    });
  });

  visor.addEventListener('click', function (e) {
    var boton = e.target.closest('[data-accion]');
    if (boton) {
      var accion = boton.dataset.accion;
      if (accion === 'cerrar') cerrar();
      else if (accion === 'zoom') alternarZoom();
      else if (accion === 'pantalla') pantallaCompleta();
      else if (accion === 'anterior') mover(-1);
      else if (accion === 'siguiente') mover(1);
    } else if (e.target === foto) {
      alternarZoom(e);
    } else if (e.target.classList.contains('visor-vecino')) {
      mover(Number(e.target.dataset.paso));   /* clic en una foto de los lados */
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
