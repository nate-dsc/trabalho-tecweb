/*
 * Listas horizontais sem barra de rolagem: com o mouse parado perto de uma das bordas,
 * a lista desliza naquela direção — mais rápido quanto mais perto da borda — e para no fim.
 * Também marca as bordas que ainda têm conteúdo (.edge-scroll--left / --right) para o CSS
 * esmaecê-las. No toque e no trackpad a rolagem nativa continua funcionando.
 */
(function () {
  'use strict';

  var SELECTOR = '.bills, .tenants, .docs, .property__tenants, .docs-recent__cards';
  var ZONE = 80;          // px a partir de cada borda que ativam o deslize (no máximo 25% da lista)
  var MIN_SPEED = 0.1;    // px por ms no início da zona (100px/s)
  var MAX_SPEED = 0.6;    // px por ms encostado na borda (600px/s, ~10px por quadro)
  var mouse = window.matchMedia('(hover: hover) and (pointer: fine)');

  function setup(list) {
    var speed = 0;
    var frame = 0;
    var last = 0;
    var rest = 0; // fração de pixel acumulada entre quadros

    function maxScroll() { return list.scrollWidth - list.clientWidth; }

    function updateEdges() {
      var max = maxScroll();
      list.classList.toggle('edge-scroll--left', max > 1 && list.scrollLeft > 1);
      list.classList.toggle('edge-scroll--right', max > 1 && list.scrollLeft < max - 1);
    }

    function stop() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      speed = 0;
      last = 0;
      rest = 0;
    }

    function step(now) {
      var dt = last ? Math.min(now - last, 50) : 16;
      last = now;
      rest += speed * dt;
      var whole = rest < 0 ? Math.ceil(rest) : Math.floor(rest);
      if (whole) {
        list.scrollLeft += whole;
        rest -= whole;
      }
      var atEnd = (speed < 0 && list.scrollLeft <= 0) || (speed > 0 && list.scrollLeft >= maxScroll() - 0.5);
      if (atEnd || !speed) { stop(); return; }
      frame = requestAnimationFrame(step);
    }

    list.addEventListener('mousemove', function (event) {
      if (!mouse.matches || maxScroll() <= 1) return;
      var box = list.getBoundingClientRect();
      var zone = Math.min(ZONE, box.width * 0.25);
      var x = event.clientX - box.left;
      var depth = 0;
      if (x < zone) depth = -(1 - x / zone);
      else if (x > box.width - zone) depth = 1 - (box.width - x) / zone;

      if (!depth) { stop(); return; }
      var sign = depth < 0 ? -1 : 1;
      speed = sign * (MIN_SPEED + (MAX_SPEED - MIN_SPEED) * Math.abs(depth));
      if (!frame) frame = requestAnimationFrame(step);
    });

    list.addEventListener('mouseleave', stop);
    list.addEventListener('scroll', updateEdges, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(updateEdges).observe(list);
    else window.addEventListener('resize', updateEdges);
    updateEdges();
  }

  document.querySelectorAll(SELECTOR).forEach(setup);
})();
