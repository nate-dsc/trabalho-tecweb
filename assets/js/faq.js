/*
 * Ajuda: perguntas frequentes (<details>) abrem e fecham com uma animação curta de altura e
 * opacidade. Sem JavaScript, ou com "reduzir movimento" ligado, abrem na hora, como o padrão.
 */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var DURATION = 220;
  var EASING = 'cubic-bezier(0.2, 0, 0, 1)';

  document.querySelectorAll('.faq__item').forEach(function (item) {
    var summary = item.querySelector('summary');
    var answer = item.querySelector('.faq__answer');
    if (!summary || !answer || !item.animate) return;

    var running = null;
    var wantOpen = item.open; // estado para onde a animação está indo

    summary.addEventListener('click', function (event) {
      if (reduce.matches) return;
      event.preventDefault();

      var start = item.offsetHeight; // altura atual, mesmo no meio de uma animação
      if (running) running.cancel();
      wantOpen = !wantOpen;

      // altura final: com a resposta (abre já para medir) ou só a pergunta + a linha de baixo
      item.open = true;
      var end = wantOpen ? item.offsetHeight : summary.offsetHeight + (item.offsetHeight - item.clientHeight);

      item.style.overflow = 'hidden';
      var anim = item.animate({ height: [start + 'px', end + 'px'] }, { duration: DURATION, easing: EASING });
      answer.animate(
        wantOpen
          ? { opacity: [0, 1], transform: ['translateY(-4px)', 'none'] }
          : { opacity: [1, 0], transform: ['none', 'translateY(-4px)'] },
        { duration: DURATION, easing: EASING }
      );
      running = anim;

      anim.onfinish = function () {
        running = null;
        item.open = wantOpen;
        item.style.overflow = '';
      };
    });
  });
})();
