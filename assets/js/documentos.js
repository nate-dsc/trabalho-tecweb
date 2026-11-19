/*
 * Página Documentos: busca na lista e alternância entre lista e grade.
 * Durante a busca, "Recentes" some e "Todos os documentos" fica no topo da página.
 * Animações curtas (desligadas com "reduzir movimento"): a seção sobe ao começar a busca,
 * os documentos que reaparecem no filtro surgem com fade e a troca lista/grade faz um fade.
 */
(function () {
  'use strict';

  var list = document.getElementById('doc-list');
  var search = document.getElementById('docs-search');
  var empty = document.getElementById('docs-empty');
  var toggles = document.querySelectorAll('.view-toggle__btn');
  var page = document.getElementById('docs-page');
  var all = document.querySelector('.docs-all');
  var recent = document.querySelector('.docs-recent');
  var header = document.querySelector('.page-title--sticky');
  if (!list || !search) return;

  var groups = Array.prototype.slice.call(list.querySelectorAll('.doc-group'));
  var EASING = 'cubic-bezier(0.2, 0, 0, 1)';

  function motion() {
    return !!document.body.animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function fadeIn(el, distance, duration) {
    el.animate(
      { opacity: [0, 1], transform: ['translateY(' + distance + 'px)', 'none'] },
      { duration: duration, easing: EASING }
    );
  }

  // Compara sem diferenciar maiúsculas nem acentos ("caucao" encontra "Caução").
  function normalize(text) {
    return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  }

  function applySearch() {
    var query = normalize(search.value);
    var anyVisible = false;
    var appeared = [];

    groups.forEach(function (group) {
      var title = normalize(group.querySelector('.doc-group__title').textContent);
      var rows = group.querySelectorAll('.doc-row');
      var groupMatches = query !== '' && title.indexOf(query) !== -1;
      var visibleRows = 0;
      var groupWasHidden = group.hidden;

      rows.forEach(function (row) {
        var match = !query || groupMatches || normalize(row.textContent).indexOf(query) !== -1;
        if (match && row.hidden && !groupWasHidden) appeared.push(row);
        row.hidden = !match;
        if (match) visibleRows++;
      });

      group.hidden = visibleRows === 0;
      if (groupWasHidden && !group.hidden) appeared.push(group);
      if (visibleRows > 0) anyVisible = true;
    });

    if (empty.hidden && !anyVisible) appeared.push(empty);
    empty.hidden = anyVisible;
    setSearching(query !== '');
    if (motion()) appeared.forEach(function (el) { fadeIn(el, 4, 180); });
  }

  function setSearching(on) {
    if (!page || page.classList.contains('is-searching') === on) return;
    var before = all.getBoundingClientRect().top;
    page.classList.toggle('is-searching', on);
    if (on) {
      window.scrollTo(0, 0);
      // "Todos os documentos" sobe até o topo: anima a partir de onde estava (no máximo 160px)
      if (motion()) {
        var shift = Math.max(0, Math.min(before - all.getBoundingClientRect().top, 160));
        if (shift) fadeIn(all, shift, 260);
      }
    } else {
      // "Recentes" volta acima: rola até "Todos os documentos" para a busca continuar à vista
      var offset = header ? header.getBoundingClientRect().height + (parseFloat(getComputedStyle(header).top) || 0) : 0;
      window.scrollTo(0, all.getBoundingClientRect().top + window.pageYOffset - offset);
      if (recent && motion()) fadeIn(recent, -8, 260);
    }
  }

  function setView(view, animate) {
    var changed = list.classList.contains('doc-list--grid') !== (view === 'grid');
    list.classList.toggle('doc-list--grid', view === 'grid');
    toggles.forEach(function (btn) {
      var active = btn.getAttribute('data-view') === view;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    if (animate && changed && motion()) fadeIn(list, 6, 200);
    try { localStorage.setItem('docs-view', view); } catch (e) { /* sem armazenamento: ignora */ }
  }

  search.addEventListener('input', applySearch);
  toggles.forEach(function (btn) {
    btn.addEventListener('click', function () { setView(btn.getAttribute('data-view'), true); });
  });

  var saved = null;
  try { saved = localStorage.getItem('docs-view'); } catch (e) { /* ignora */ }
  if (saved === 'grid' || saved === 'list') setView(saved, false);
})();
