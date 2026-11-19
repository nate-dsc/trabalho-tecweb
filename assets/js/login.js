/*
 * Página Login.
 * - Entrar: sem validação, aceita qualquer coisa e vai para o Dashboard, depois de uma chuva de
 *   moedas e notas (pulada com "reduzir movimento").
 * - Esqueceu a senha: o modal só simula o envio do link (nada é enviado).
 */
(function () {
  'use strict';

  var loginForm = document.getElementById('login-form');
  var entering = false;

  // Chuva de moedas e notas com o mascote no centro; depois abre o Dashboard
  function moneyRain(done) {
    var overlay = document.createElement('div');
    overlay.className = 'money-rain';
    overlay.setAttribute('role', 'status');

    var mascot = document.createElement('img');
    mascot.className = 'money-rain__mascot';
    mascot.src = 'assets/img/logo.png';
    mascot.alt = '';
    var text = document.createElement('p');
    text.className = 'money-rain__text';
    text.textContent = 'Contando seus aluguéis…';
    overlay.appendChild(mascot);
    overlay.appendChild(text);

    for (var i = 0; i < 36; i++) {
      var bill = i % 3 === 0;
      var item = document.createElement('span');
      item.className = 'money-rain__item ' + (bill ? 'money-rain__bill' : 'money-rain__coin');
      item.textContent = bill ? 'R$' : '$';
      item.setAttribute('aria-hidden', 'true');
      item.style.left = (Math.random() * 100) + '%';
      item.style.animationDuration = (0.9 + Math.random() * 0.7).toFixed(2) + 's';
      item.style.animationDelay = (Math.random() * 0.6).toFixed(2) + 's';
      item.style.setProperty('--drift', Math.round(Math.random() * 80 - 40) + 'px');
      item.style.setProperty('--spin', Math.round(Math.random() * 720 - 360) + 'deg');
      overlay.appendChild(item);
    }

    document.body.appendChild(overlay);
    setTimeout(done, 1700);
  }

  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();
      if (entering) return;
      entering = true;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.location.href = 'index.html';
        return;
      }
      try { sessionStorage.setItem('gi-chegada', '1'); } catch (e) { /* sem armazenamento: só não anima a chegada */ }
      moneyRain(function () { window.location.href = 'index.html'; });
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

/*
 * Criar conta (demonstração): valida os campos (demo.js), confirma a criação
 * e preenche o campo Login com o e-mail informado. Nada é salvo.
 */
(function () {
  'use strict';

  var dialog = document.getElementById('modal-cadastro');
  var form = document.getElementById('form-cadastro');
  if (!dialog || !form) return;

  function showStep(step) {
    dialog.querySelectorAll('[data-cadastro]').forEach(function (el) {
      el.hidden = el.getAttribute('data-cadastro') !== step;
    });
  }

  document.querySelectorAll('[data-modal="modal-cadastro"]').forEach(function (trigger) {
    trigger.addEventListener('click', function () { showStep('form'); });
  });

  form.addEventListener('demo:valid', function (event) {
    event.preventDefault();
    var email = document.getElementById('cadastro-email').value.trim();
    document.getElementById('cadastro-email-confirmado').textContent = email;
    showStep('done');
    var back = dialog.querySelector('[data-cadastro="done"] [data-close]');
    if (back) back.focus();
    var login = document.getElementById('login-usuario');
    if (login) login.value = email;
  });
})();
