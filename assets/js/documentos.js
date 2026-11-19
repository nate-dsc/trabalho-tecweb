/*
 * Página Documentos: busca na lista e alternância entre lista e grade.
 * Durante a busca, "Recentes" some e "Todos os documentos" fica no topo da página.
 */
(function () {
  'use strict';

  var list = document.getElementById('doc-list');
  var search = document.getElementById('docs-search');
  var empty = document.getElementById('docs-empty');
  var toggles = document.querySelectorAll('.view-toggle__btn');
  var page = document.getElementById('docs-page');
  var all = document.querySelector('.docs-all');
  var header = document.querySelector('.page-title--sticky');
  if (!list || !search) return;

  var groups = Array.prototype.slice.call(list.querySelectorAll('.doc-group'));

  // Compara sem diferenciar maiúsculas nem acentos ("caucao" encontra "Caução").
  function normalize(text) {
    return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  }

  function applySearch() {
    var query = normalize(search.value);
    var anyVisible = false;

    groups.forEach(function (group) {
      var title = normalize(group.querySelector('.doc-group__title').textContent);
      var rows = group.querySelectorAll('.doc-row');
      var groupMatches = query !== '' && title.indexOf(query) !== -1;
      var visibleRows = 0;

      rows.forEach(function (row) {
        var match = !query || groupMatches || normalize(row.textContent).indexOf(query) !== -1;
        row.hidden = !match;
        if (match) visibleRows++;
      });

      group.hidden = visibleRows === 0;
      if (visibleRows > 0) anyVisible = true;
    });

    empty.hidden = anyVisible;
    setSearching(query !== '');
  }

  function setSearching(on) {
    if (!page || page.classList.contains('is-searching') === on) return;
    page.classList.toggle('is-searching', on);
    if (on) {
      window.scrollTo(0, 0);
    } else {
      // "Recentes" volta acima: rola até "Todos os documentos" para a busca continuar à vista
      var offset = header ? header.getBoundingClientRect().height : 0;
      window.scrollTo(0, all.getBoundingClientRect().top + window.pageYOffset - offset);
    }
  }

  function setView(view) {
    list.classList.toggle('doc-list--grid', view === 'grid');
    toggles.forEach(function (btn) {
      var active = btn.getAttribute('data-view') === view;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    try { localStorage.setItem('docs-view', view); } catch (e) { /* sem armazenamento: ignora */ }
  }

  search.addEventListener('input', applySearch);
  toggles.forEach(function (btn) {
    btn.addEventListener('click', function () { setView(btn.getAttribute('data-view')); });
  });

  var saved = null;
  try { saved = localStorage.getItem('docs-view'); } catch (e) { /* ignora */ }
  if (saved === 'grid' || saved === 'list') setView(saved);
})();
