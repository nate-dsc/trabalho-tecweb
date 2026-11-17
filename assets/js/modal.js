/*
 * Modais: botões com data-modal="id" abrem o <dialog> com esse id.
 * Fecham com data-close, Esc ou clique fora da caixa.
 */
(function () {
  'use strict';

  document.querySelectorAll('[data-modal]').forEach(function (trigger) {
    var dialog = document.getElementById(trigger.getAttribute('data-modal'));
    if (!dialog || typeof dialog.showModal !== 'function') return;

    trigger.addEventListener('click', function () {
      dialog.showModal();
    });
  });

  document.querySelectorAll('dialog.modal').forEach(function (dialog) {
    // Botões com data-close fecham o modal.
    dialog.addEventListener('click', function (event) {
      if (event.target.closest('[data-close]')) {
        dialog.close();
        return;
      }
      // Clique no fundo escurecido (fora da caixa) também fecha.
      var box = dialog.getBoundingClientRect();
      var outside = event.clientX < box.left || event.clientX > box.right ||
                    event.clientY < box.top || event.clientY > box.bottom;
      if (outside && event.target === dialog) dialog.close();
    });
  });
})();
