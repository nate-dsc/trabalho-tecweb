/*
 * Paginação simples no cliente.
 *
 * Lista:  <div id="minha-lista" data-paginate data-page-size="6"> ...itens... </div>
 * Barra:  <nav class="pagination" data-pagination-for="minha-lista" data-label="inquilinos">
 *           <p class="pagination__results"></p>
 *           <div class="pagination__controls"></div>
 *         </nav>
 *
 * Todos os itens ficam no HTML; o script só esconde os que não são da página atual.
 * Sem JavaScript, a lista aparece inteira. Ao trocar de página, os itens novos surgem com um fade
 * curto em sequência (desligado com "reduzir movimento").
 */
(function () {
  'use strict';

  var CHEVRON_LEFT = 'assets/icons/chevron-left.svg';
  var CHEVRON_RIGHT = 'assets/icons/chevron-right.svg';

  function iconButton(src, label) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pagination__btn';
    btn.setAttribute('aria-label', label);
    var img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.width = 16;
    img.height = 16;
    btn.appendChild(img);
    return btn;
  }

  function setup(nav) {
    var list = document.getElementById(nav.getAttribute('data-pagination-for'));
    if (!list) return;

    var items = Array.prototype.slice.call(list.children);
    var pageSize = parseInt(list.getAttribute('data-page-size'), 10) || 10;
    var label = nav.getAttribute('data-label') || 'itens';
    var totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    var results = nav.querySelector('.pagination__results');
    var controls = nav.querySelector('.pagination__controls');
    var current = 1;

    var prev = iconButton(CHEVRON_LEFT, 'Página anterior');
    var next = iconButton(CHEVRON_RIGHT, 'Próxima página');
    var pageButtons = [];

    controls.innerHTML = '';
    controls.appendChild(prev);
    for (var i = 1; i <= totalPages; i++) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pagination__btn';
      btn.textContent = String(i);
      btn.setAttribute('aria-label', 'Página ' + i);
      btn.dataset.page = String(i);
      pageButtons.push(btn);
      controls.appendChild(btn);
    }
    controls.appendChild(next);

    function render(page, animate) {
      current = Math.min(Math.max(page, 1), totalPages);
      var first = (current - 1) * pageSize;
      var last = Math.min(first + pageSize, items.length);

      items.forEach(function (item, index) {
        item.hidden = index < first || index >= last;
      });

      if (animate && list.animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        items.slice(first, last).forEach(function (item, index) {
          item.animate(
            { opacity: [0, 1], transform: ['translateY(6px)', 'none'] },
            { duration: 200, delay: index * 25, easing: 'cubic-bezier(0.2, 0, 0, 1)', fill: 'backwards' }
          );
        });
      }

      pageButtons.forEach(function (btn, index) {
        var isCurrent = index + 1 === current;
        btn.classList.toggle('is-current', isCurrent);
        if (isCurrent) btn.setAttribute('aria-current', 'page');
        else btn.removeAttribute('aria-current');
      });

      prev.disabled = current === 1;
      next.disabled = current === totalPages;
      results.textContent = 'Mostrando ' + (first + 1) + '-' + last + ' de ' + items.length + ' ' + label;
    }

    controls.addEventListener('click', function (event) {
      var btn = event.target.closest('button');
      if (!btn || btn.disabled) return;
      var before = current;
      if (btn === prev) render(current - 1, true);
      else if (btn === next) render(current + 1, true);
      else if (btn.dataset.page && parseInt(btn.dataset.page, 10) !== before) render(parseInt(btn.dataset.page, 10), true);
    });

    render(1);
  }

  document.querySelectorAll('[data-pagination-for]').forEach(setup);
})();
