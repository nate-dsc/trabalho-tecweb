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
