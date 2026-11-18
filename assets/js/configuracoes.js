/*
 * Página Configurações: lembra o estado dos interruptores de notificação neste navegador.
 * Sem armazenamento disponível, os interruptores continuam funcionando, só não são lembrados.
 */
(function () {
  'use strict';

  var KEY = 'config-notificacoes';
  var saved = {};

  try { saved = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { saved = {}; }

  document.querySelectorAll('.switch').forEach(function (input) {
    if (typeof saved[input.id] === 'boolean') input.checked = saved[input.id];

    input.addEventListener('change', function () {
      saved[input.id] = input.checked;
      try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) { /* ignora */ }
    });
  });
})();

/*
 * Autenticação em dois fatores (demonstração): ativa com qualquer código de 6 dígitos
 * e desativa com confirmação. O estado fica salvo neste navegador.
 * "Alterar senha" usa só a validação comum de demo.js (data-success).
 */
(function () {
  'use strict';

  var KEY = 'config-2fa';
  var button = document.getElementById('btn-2fa');
  var dialog = document.getElementById('modal-2fa');
  var form = document.getElementById('form-2fa');
  if (!button || !dialog || !form) return;

  var active = false;
  try { active = localStorage.getItem(KEY) === 'on'; } catch (e) { active = false; }

  function render() {
    button.textContent = active ? 'Desativar autenticação em dois fatores' : 'Autenticação em dois fatores';
    dialog.querySelectorAll('[data-2fa]').forEach(function (el) {
      el.hidden = el.getAttribute('data-2fa') !== (active ? 'ativa' : 'inativa');
    });
  }

  button.addEventListener('click', render);

  form.addEventListener('demo:valid', function (event) {
    event.preventDefault();
    active = !active;
    try { localStorage.setItem(KEY, active ? 'on' : 'off'); } catch (e) { /* ignora */ }
    dialog.close();
    render();
    Demo.toast(active
      ? 'Autenticação em dois fatores ativada para a sua conta.'
      : 'Autenticação em dois fatores desativada.');
  });

  render();
})();
