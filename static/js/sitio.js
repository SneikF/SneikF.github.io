/* Tema claro/oscuro, menú flotante y visor de imágenes. Sin dependencias. */
/* =====================================================================
   sitio.js: todo lo que se mueve en el blog (Guía §15).
   Partes (busca el título con Ctrl+F):
     Tema            → botón ☾/☀            (partials/nav.html)
     Idioma          → botón ES/EN conserva la altura de la página (partials/nav.html)
     Menú flotante   → botón ☰               (partials/menu-flotante.html)
     Secuencias      → fila circular ‹ ›     (fotos/single.html, Guía §6)
     Microcuentos    → hoja regada           (microcuentos/list.html, Guía §4)
     Visor           → foto en grande        (partials/visor.html, Guía §6 «El visor»)
   La apariencia de todo esto está en style.css; aquí solo está el comportamiento.
   Las líneas que empiezan con // y los bloques entre barra-asterisco son comentarios.
   ===================================================================== */
// Todo va dentro de una función que se ejecuta sola, para no chocar con otros scripts.
(function () {
  var raiz = document.documentElement;

  /* ---------- Tema ----------
     Guarda «claro» u «oscuro» en el atributo data-tema de <html>; style.css cambia los
     colores según ese atributo. La elección se recuerda en localStorage (en el navegador
     de cada visitante) y head.html la aplica antes de pintar la página. */
  document.querySelectorAll('.boton-tema').forEach(function (boton) {
    boton.addEventListener('click', function () {
      // Si nunca se eligió, el tema actual es el del sistema operativo
      var actual = raiz.dataset.tema || (matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro');
      var nuevo = actual === 'oscuro' ? 'claro' : 'oscuro';
      raiz.dataset.tema = nuevo;
      try { localStorage.setItem('tema', nuevo); } catch (e) {}
    });
  });

  /* ---------- Idioma: cambiar sin volver al inicio ----------
     El botón ES/EN lleva a la misma página en el otro idioma. Antes de irse se guarda qué
     tan abajo estabas (como proporción: 0 = arriba, 1 = al final) y la página nueva se abre
     a esa misma altura. Además, al acercar el mouse al botón, la otra versión se carga en
     segundo plano para que el cambio sea casi instantáneo. */
  var CLAVE_IDIOMA = 'posicionIdioma';
  document.querySelectorAll('a.idioma').forEach(function (a) {
    var precargada = false;
    function precargar() {
      if (precargada) return;
      precargada = true;
      var l = document.createElement('link');
      l.rel = 'prefetch'; l.href = a.href;
      document.head.appendChild(l);
    }
    a.addEventListener('mouseenter', precargar);
    a.addEventListener('focus', precargar);
    a.addEventListener('touchstart', precargar, { passive: true });
    a.addEventListener('click', function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      try {
        sessionStorage.setItem(CLAVE_IDIOMA, JSON.stringify({ p: max > 0 ? window.scrollY / max : 0, t: Date.now() }));
      } catch (e) {}
    });
  });
  (function restaurarPosicion() {
    var g = null;
    try { g = JSON.parse(sessionStorage.getItem(CLAVE_IDIOMA) || 'null'); sessionStorage.removeItem(CLAVE_IDIOMA); } catch (e) {}
    if (!g || Date.now() - g.t > 10000) { raiz.classList.remove('cambiando-idioma'); return; }
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    function ir() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, Math.round(g.p * Math.max(0, max)));
    }
    ir();
    raiz.classList.remove('cambiando-idioma');
    window.addEventListener('load', ir);   /* de nuevo cuando terminan de cargar las fotos */
  })();

  /* ---------- Menú flotante (aparece al bajar) ----------
     Cuando bajas más que la altura de la barra superior, el body recibe la clase
     «desplazado» y style.css muestra el botón ☰. */
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
    // Un clic fuera del panel lo cierra
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
    // Cuánto se corre la fila en un paso: la distancia entre una foto y la siguiente (en px)
    function paso() {
      var f = pista.children;
      return f.length > 1 ? f[1].offsetLeft - f[0].offsetLeft : 0;
    }
    // Hace un cambio de golpe, sin la transición de 0.5 s definida en style.css
    function sinAnimacion(fn) {
      pista.style.transition = 'none';
      fn();
      void pista.offsetWidth;          /* aplica el cambio antes de volver a animar */
      pista.style.transition = '';
    }
    // dir = 1 (botón ›) o -1 (botón ‹). «ocupado» evita clics dobles durante la animación.
    // Los 500 ms deben coincidir con  transition: transform 0.5s  de .secuencia-pista.
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

  /* ---------- Microcuentos regados ----------
     Reparte los microcuentos por la hoja sin filas: cada uno con un ancho y una posición
     horizontal al azar, y empezando un poco más abajo que el anterior (el orden se
     conserva: el más reciente queda al final). Nunca se tapan entre sí.
     El azar es «fijo»: depende del lugar de cada microcuento, así que la hoja se ve igual
     cada vez que se abre, hasta que agregas uno nuevo. Para que cambie en cada visita,
     cambia la función azar por:  function azar() { return Math.random(); }
     Rangos (en rem; 1rem = 16 px):
       ANCHO_MIN, ANCHO_MAX  → ancho de cada microcuento
       BAJA_MIN, BAJA_MAX    → cuánto más abajo empieza cada uno que el anterior
       MARGEN                → espacio libre mínimo alrededor de cada uno  */
  var ANCHO_MIN = 11, ANCHO_MAX = 21, BAJA_MIN = 3, BAJA_MAX = 13, MARGEN = 2;
  function azar(n) { var x = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); }  /* 0 a 1 */
  document.querySelectorAll('.microcuentos-hoja').forEach(function (hoja) {
    var piezas = Array.prototype.slice.call(hoja.querySelectorAll('.microcuento'));
    if (!piezas.length) return;
    hoja.classList.add('regada');
    function regar() {
      var rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      var ancho = hoja.clientWidth, m = MARGEN * rem;
      var puestas = [];   /* rectángulos ya ocupados */
      var fondo = 0, yAnterior = 0;
      function choca(x, y, w, h) {
        return puestas.some(function (c) {
          return x < c.x + c.w + m && x + w + m > c.x && y < c.y + c.h + m && y + h + m > c.y;
        });
      }
      piezas.forEach(function (p, i) {
        var w = Math.min(ancho, (ANCHO_MIN + azar(i * 7 + 1) * (ANCHO_MAX - ANCHO_MIN)) * rem);
        p.style.width = w + 'px';
        var h = p.offsetHeight;
        /* altura de partida: un poco más abajo que el anterior */
        var y = i === 0 ? azar(3) * 3 * rem
                        : yAnterior + (BAJA_MIN + azar(i * 7 + 2) * (BAJA_MAX - BAJA_MIN)) * rem;
        /* prueba hasta 16 lugares al azar en esa altura; si todos chocan, baja un poco y repite */
        var x = 0, k = 0, libre = false;
        while (!libre) {
          for (var intento = 0; intento < 16 && !libre; intento++, k++) {
            x = azar(i * 131 + k + 5) * Math.max(0, ancho - w);
            libre = !choca(x, y, w, h);
          }
          if (!libre) y += 1.5 * rem;
        }
        p.style.left = x + 'px';
        p.style.top = y + 'px';
        puestas.push({ x: x, y: y, w: w, h: h });
        yAnterior = y;
        fondo = Math.max(fondo, y + h);
      });
      hoja.style.height = (fondo + 4 * rem) + 'px';
    }
    regar();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(regar);   /* cuando llega la letra */
    window.addEventListener('load', regar);     /* cuando cargan las imágenes */
    /* las imágenes cargan al acercarse (loading="lazy"): al llegar cada una cambia el alto
       de su microcuento, así que se vuelve a regar */
    hoja.querySelectorAll('img').forEach(function (img) {
      if (!img.complete) img.addEventListener('load', regar);
    });
    window.addEventListener('resize', regar);   /* si cambia el ancho de la ventana */
  });

  /* ---------- Visor de imágenes ----------
     Toda imagen dentro de un enlace con clase «ampliable» abre el visor al hacer clic.
     El visor muestra la versión grande (el href del enlace). */
  var visor = document.getElementById('visor');
  if (!visor) return;
  var lienzo = visor.querySelector('.visor-lienzo');
  var foto = lienzo.querySelector('.visor-principal');
  var vecinoIzq = lienzo.querySelector('.visor-vecino-izq');
  var vecinoDer = lienzo.querySelector('.visor-vecino-der');
  var descargar = visor.querySelector('.visor-descargar');   /* «Descargar» de la barra de abajo */
  var textoVisor = visor.querySelector('.visor-texto');      /* texto de la foto, debajo de ella */
  var grupo = [];   /* imágenes entre las que se navega (toda la página o una secuencia) */
  var enlaces = Array.prototype.slice.call(document.querySelectorAll('a.ampliable'));
  var indice = -1;
  var ultimoFoco = null;

  // Abre (o cambia) la foto del visor. a = el enlace de la foto; conZoom = abrir ya acercada.
  // Si la foto es de una secuencia, se navega solo entre las fotos de esa secuencia.
  function abrir(a, conZoom) {
    var sec = a.closest('.secuencia');
    grupo = sec ? Array.prototype.slice.call(sec.querySelectorAll('a.ampliable')) : enlaces;
    indice = grupo.indexOf(a);
    var img = a.querySelector('img');
    foto.src = a.href;
    if (descargar) descargar.href = a.href;   /* descarga la foto abierta (con firma) */
    foto.alt = img ? img.alt : a.textContent.trim();
    /* Si la foto tiene su texto debajo (secuencia de una foto), se muestra también en el visor */
    var pie = a.closest('figure') && a.closest('figure').querySelector('.diapositiva-texto');
    if (textoVisor) {
      textoVisor.innerHTML = pie ? pie.innerHTML : '';
      textoVisor.hidden = !(pie && pie.textContent.trim());
      visor.classList.toggle('con-texto', !textoVisor.hidden);
    }
    visor.classList.toggle('ampliado', !!conZoom);
    visor.classList.toggle('una-sola', grupo.length < 2);
    /* En una secuencia se ven también la foto anterior y la siguiente, a los lados.
       En la secuencia de una foto (clase «una») solo se ve la foto abierta. */
    var conVecinos = !!sec && !sec.classList.contains('una');
    visor.classList.toggle('modo-secuencia', conVecinos);
    if (conVecinos) {
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
  // Pone una foto lateral (anterior o siguiente) o la esconde si no hay
  function ponerVecino(el, a) {
    if (a) { el.src = a.querySelector('img') ? a.querySelector('img').src : a.href; el.style.visibility = 'visible'; }
    else { el.removeAttribute('src'); el.style.visibility = 'hidden'; }
  }
  // Cierra el visor y devuelve el foco a donde estaba
  function cerrar() {
    if (document.fullscreenElement) document.exitFullscreen();
    visor.hidden = true;
    visor.classList.remove('ampliado');
    foto.removeAttribute('src');
    visor.classList.remove('modo-secuencia');
    document.body.style.overflow = '';
    if (ultimoFoco) ultimoFoco.focus();
  }
  // Acerca o aleja. Acercada, la foto mide al menos 160vw (style.css: .visor.ampliado)
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
  // Entra o sale de pantalla completa (tecla f)
  function pantallaCompleta() {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (visor.requestFullscreen) visor.requestFullscreen();
  }
  // paso = 1 siguiente, -1 anterior. El % hace que después de la última vuelva la primera.
  function mover(paso) {
    if (grupo.length < 2) return;
    abrir(grupo[(indice + paso + grupo.length) % grupo.length], false);   /* da la vuelta */
  }

  enlaces.forEach(function (a, i) {
    a.addEventListener('click', function (e) { e.preventDefault(); abrir(a, false); });
  });

  // Un solo «oyente» para todos los clics dentro del visor: mira en qué se hizo clic.
  // Los botones se reconocen por su data-accion (definido en partials/visor.html).
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

  // Atajos de teclado (solo con el visor abierto). Para agregar uno, copia una línea
  // else if y cambia la tecla (e.key) y la acción.
  document.addEventListener('keydown', function (e) {
    if (visor.hidden) return;
    if (e.key === 'Escape' && !document.fullscreenElement) cerrar();
    else if (e.key === 'ArrowRight') mover(1);
    else if (e.key === 'ArrowLeft') mover(-1);
    else if (e.key === '+' || e.key === '=' || e.key === '-') alternarZoom();
    else if (e.key === 'f') pantallaCompleta();
  });
})();
