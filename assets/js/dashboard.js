/*
 * Dashboard: busca rápida e registro de novo aluguel (demonstração, sem backend).
 */
(function () {
  'use strict';

  /* ---------- Novo aluguel ---------- */
  var newForm = document.getElementById('form-novo-aluguel');
  if (newForm) {
    newForm.addEventListener('demo:valid', function (event) {
      event.preventDefault();
      var place = document.getElementById('aluguel-imovel').value;
      var tenant = document.getElementById('aluguel-inquilino').value;
      var rent = Demo.formatMoney(Demo.parseMoney(document.getElementById('aluguel-valor').value));
      var start = document.getElementById('aluguel-inicio').value.split('-').reverse().join('/');
      var day = document.getElementById('aluguel-dia').value;
      newForm.closest('dialog').close();
      Demo.toast('Aluguel registrado: ' + place + ' para ' + tenant + ', ' + rent + ' por mês, a partir de ' +
        start + ', vencendo no dia ' + day + '. Nesta demonstração ele não fica salvo.');
    });
  }

  /* ---------- Busca ---------- */
  var form = document.getElementById('busca');
  var input = document.getElementById('busca-input');
  var panel = document.getElementById('busca-resultados');
  if (!form || !input || !panel) return;

  var DOC = 'assets/docs/';
  var INDEX = [
    { title: 'Prédio A', sub: 'Imóvel · Rua dos Bobos, número 0 – Centro, Sobral', href: 'imoveis.html' },

    { title: 'Alexey H.M.S.', sub: 'Inquilino · Prédio A, apartamento 1508 · Atrasado', href: 'inquilinos.html' },
    { title: 'Gabriel Gabé', sub: 'Inquilino · Av. Champs-Élysées, 71 · Pendente', href: 'inquilinos.html' },
    { title: 'Joi de Armas', sub: 'Inquilino · Megaprédio H7, apartamento 7223 · Pendente', href: 'inquilinos.html' },
    { title: 'S.M.H. Yexela', sub: 'Inquilino · Prédio A, apartamento 1507 · Pago', href: 'inquilinos.html' },
    { title: 'Carlos Mendes', sub: 'Inquilino · Rua das Flores, 12 · Pago', href: 'inquilinos.html' },
    { title: 'Ana Souza', sub: 'Inquilino · Rua do Sol, 88 · Pago', href: 'inquilinos.html' },
    { title: 'Marina Lopes', sub: 'Inquilino · Av. Beira-Mar, 1500, apartamento 902 · Pago', href: 'inquilinos.html' },
    { title: 'Rafael Nunes', sub: 'Inquilino · Rua Padre Ibiapina, 310 · Pago', href: 'inquilinos.html' },

    { title: 'Contrato de aluguel – apto 1508', sub: 'Documento · Prédio A · 27/05/2026', href: DOC + 'contrato_alexey.pdf', pdf: true },
    { title: 'Depósito do caução', sub: 'Documento · Av. Champs-Élysées, 71 · 27/05/2026', href: DOC + 'comprovante_caucao.pdf', pdf: true },
    { title: 'Laudo de vistoria – apto 1508', sub: 'Documento · Prédio A · 26/05/2026', href: DOC + 'vistoria_1508.pdf', pdf: true },
    { title: 'Contrato de aluguel', sub: 'Documento · Av. Champs-Élysées, 71 · 22/05/2026', href: DOC + 'contrato_gabriel.pdf', pdf: true },
    { title: 'Contrato de aluguel – apto 1507', sub: 'Documento · Prédio A · 02/03/2026', href: DOC + 'contrato_yexela.pdf', pdf: true },
    { title: 'Contrato de aluguel', sub: 'Documento · Megaprédio H7, apartamento 7223 · 15/01/2026', href: DOC + 'contrato_joi.pdf', pdf: true },
    { title: 'Laudo de vistoria', sub: 'Documento · Megaprédio H7, apartamento 7223 · 14/01/2026', href: DOC + 'vistoria_7223.pdf', pdf: true },
    { title: 'Convenção do condomínio', sub: 'Documento · Prédio A · 10/01/2026', href: DOC + 'convencao_predio_a.pdf', pdf: true },

    { title: 'Imóveis', sub: 'Página · prédios, apartamentos e contas', href: 'imoveis.html' },
    { title: 'Inquilinos', sub: 'Página · contatos, aluguéis e pagamentos', href: 'inquilinos.html' },
    { title: 'Financeiro', sub: 'Página · receitas, despesas e transações', href: 'financeiro.html' },
    { title: 'Documentos', sub: 'Página · contratos, vistorias e comprovantes', href: 'documentos.html' },
    { title: 'Ajuda', sub: 'Página · perguntas frequentes', href: 'ajuda.html' },
    { title: 'Configurações', sub: 'Página · perfil, notificações e segurança', href: 'configuracoes.html' }
  ];

  function normalize(text) {
    return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  }

  function search(query) {
    var words = normalize(query).split(/\s+/).filter(Boolean);
    return INDEX.filter(function (item) {
      var haystack = normalize(item.title + ' ' + item.sub);
      return words.every(function (w) { return haystack.indexOf(w) !== -1; });
    }).slice(0, 8);
  }

  function message(text) {
    panel.innerHTML = '';
    var p = document.createElement('p');
    p.className = 'search-results__empty';
    p.textContent = text;
    panel.appendChild(p);
    show();
  }

  function show() {
    panel.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }

  function hide() {
    panel.hidden = true;
    input.setAttribute('aria-expanded', 'false');
  }

  function render(submitted) {
    var query = input.value.trim();
    if (normalize(query).length < 2) {
      if (submitted) message('Digite pelo menos 2 letras para pesquisar.');
      else hide();
      return [];
    }
    var results = search(query);
    if (!results.length) {
      message('Nenhum resultado para “' + query + '”. Tente o nome de um inquilino, imóvel ou documento.');
      return results;
    }
    panel.innerHTML = '';
    results.forEach(function (item) {
      var a = document.createElement('a');
      a.href = item.href;
      if (item.pdf) { a.target = '_blank'; a.rel = 'noopener'; }
      var title = document.createElement('span');
      title.textContent = item.title;
      var sub = document.createElement('small');
      sub.textContent = item.sub + (item.pdf ? ' · abre o PDF' : '');
      a.appendChild(title);
      a.appendChild(sub);
      panel.appendChild(a);
    });
    show();
    return results;
  }

  input.addEventListener('input', function () { render(false); });
  input.addEventListener('focus', function () { if (input.value.trim()) render(false); });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var results = render(true);
    if (results.length) panel.querySelector('a').click();
  });

  form.addEventListener('keydown', function (event) {
    var links = Array.prototype.slice.call(panel.querySelectorAll('a'));
    var index = links.indexOf(document.activeElement);
    if (event.key === 'Escape') {
      hide();
      input.focus();
    } else if (event.key === 'ArrowDown' && links.length) {
      event.preventDefault();
      links[Math.min(index + 1, links.length - 1)].focus();
    } else if (event.key === 'ArrowUp' && links.length) {
      event.preventDefault();
      if (index <= 0) input.focus(); else links[index - 1].focus();
    }
  });

  document.addEventListener('click', function (event) {
    if (!form.contains(event.target)) hide();
  });
})();
