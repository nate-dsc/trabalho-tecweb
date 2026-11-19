/*
 * Títulos de seção fixos abaixo do header principal (página Imóveis).
 *
 * - Mede onde termina o header fixo (altura + distância do topo, que no celular inclui a
 *   navbar) e guarda em --sticky-offset, para o título da seção parar exatamente embaixo dele.
 * - Marca com .is-stuck o título que está preso no topo, para desenhar uma linha embaixo dele.
 *
 * O "ficar preso" em si é CSS (position: sticky); sem JavaScript continua funcionando,
 * só usando a altura padrão do CSS e sem a linha.
 */
(function () {
  'use strict';

  var header = document.querySelector('.page-title--sticky');
  var titles = Array.prototype.slice.call(document.querySelectorAll('.property__title--sticky'));
  if (!header || !titles.length) return;

  var root = document.documentElement;
  var offset = 0;
  var scheduled = false;

  function measure() {
    // No celular o header fica preso abaixo da navbar: soma a distância dele até o topo
    offset = header.getBoundingClientRect().height + (parseFloat(getComputedStyle(header).top) || 0);
    root.style.setProperty('--sticky-offset', offset + 'px');
    update();
  }

  function update() {
    scheduled = false;
    titles.forEach(function (title) {
      var top = title.getBoundingClientRect().top;
      var section = title.parentElement.getBoundingClientRect();
      // Preso: chegou na linha do header e a seção dele ainda está passando por ali.
      var stuck = top <= offset + 1 && section.top < offset && section.bottom > offset;
      title.classList.toggle('is-stuck', stuck);
    });
  }

  function onScroll() {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(update);
    }
  }

  if ('ResizeObserver' in window) {
    new ResizeObserver(measure).observe(header);
  }
  // a distância do topo muda ao cruzar 450px (com e sem navbar), sem mudar a altura do header
  window.addEventListener('resize', measure);
  window.addEventListener('scroll', onScroll, { passive: true });
  measure();
})();
