/*
 * Navbar do celular (telas abaixo de 450px): o botão "Menu" abre e fecha a lista de páginas.
 * Fecha ao escolher um item, com Esc, ao tocar fora ou ao voltar para uma tela maior.
 * Nas telas maiores o botão fica escondido (CSS) e a barra lateral funciona normalmente.
 */
(function () {
  'use strict';

  var sidebar = document.querySelector('.sidebar');
  var button = document.querySelector('.nav-toggle');
  var menu = document.getElementById('menu-principal');
  if (!sidebar || !button || !menu) return;

  var mobile = window.matchMedia('(max-width: 449px)');

  function setOpen(open) {
    sidebar.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
  }

  button.addEventListener('click', function () {
    var open = !sidebar.classList.contains('is-open');
    setOpen(open);
    if (open) {
      var current = menu.querySelector('[aria-current="page"]') || menu.querySelector('a');
      if (current) current.focus();
    }
  });

  menu.addEventListener('click', function (event) {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && sidebar.classList.contains('is-open')) {
      setOpen(false);
      button.focus();
    }
  });

  document.addEventListener('click', function (event) {
    if (sidebar.classList.contains('is-open') && !sidebar.contains(event.target)) setOpen(false);
  });

  var onChange = function () { if (!mobile.matches) setOpen(false); };
  if (mobile.addEventListener) mobile.addEventListener('change', onChange);
  else if (mobile.addListener) mobile.addListener(onChange);
})();
