/*
 * Página Login.
 * - Entrar: sem validação, aceita qualquer coisa e vai para o Dashboard.
 * - Esqueceu a senha: o modal só simula o envio do link (nada é enviado).
 */
(function () {
  'use strict';

  var loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();
      window.location.href = 'index.html';
    });
  }

  var dialog = document.getElementById('modal-senha');
  var forgotForm = document.getElementById('forgot-form');
  if (!dialog || !forgotForm) return;

  function showStep(step) {
    dialog.querySelectorAll('[data-step]').forEach(function (el) {
      el.hidden = el.getAttribute('data-step') !== step;
    });
  }

  forgotForm.addEventListener('submit', function (event) {
    // O navegador já checou se o e-mail tem formato válido (required + type="email").
    event.preventDefault();
    showStep('done');
    var back = dialog.querySelector('[data-step="done"] [data-close]');
    if (back) back.focus();
  });

  // Cada vez que o modal abre, começa do formulário limpo.
  document.querySelectorAll('[data-modal="modal-senha"]').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      forgotForm.reset();
      showStep('form');
      var email = document.getElementById('forgot-email');
      if (email) email.focus();
    });
  });
})();
