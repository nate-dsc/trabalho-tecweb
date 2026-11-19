/*
 * Inquilinos: cadastro de novo inquilino e "Ver detalhes →" com os dados do inquilino e registro de
 * pagamento (demonstração, sem backend).
 */
(function () {
  'use strict';

  /* ---------- Novo inquilino ---------- */
  var newForm = document.getElementById('form-novo-inquilino');
  if (newForm) {
    newForm.addEventListener('demo:valid', function (event) {
      event.preventDefault();
      var name = document.getElementById('inquilino-nome').value.trim();
      var phone = document.getElementById('inquilino-telefone').value.trim();
      var place = document.getElementById('inquilino-imovel').value;
      newForm.closest('dialog').close();
      Demo.toast('Inquilino cadastrado: ' + name + ', telefone ' + phone + (place ? ', em ' + place : '') +
        '. Nesta demonstração ele não fica salvo.');
    });
  }

  /* ---------- Detalhes e pagamento ---------- */
  var dialog = document.getElementById('modal-inquilino');
  if (!dialog) return;
  var $ = function (id) { return document.getElementById(id); };
  var form = $('form-pagamento');
  var card = null;

  document.querySelectorAll('[data-tenant-details]').forEach(function (button) {
    button.addEventListener('click', function () {
      card = button.closest('.tenant-card');
      var name = card.querySelector('h2').textContent.trim();
      var phone = card.querySelector('.tenant-card__phone').textContent.trim();
      var rent = card.querySelector('.tenant-card__row--rent strong').textContent.trim();
      var due = card.querySelectorAll('.tenant-card__row strong')[1].textContent.trim();
      var tag = card.querySelector('.chip');
      var paid = tag.classList.contains('chip--paid');

      $('modal-inquilino-title').textContent = name;
      $('det-avatar').textContent = card.querySelector('.avatar').textContent.trim();
      $('det-imovel').textContent = card.querySelector('.tenant-card__info p').textContent.trim();
      var tel = $('det-telefone');
      tel.textContent = phone;
      tel.href = 'tel:+55' + phone.replace(/\D/g, '');
      $('det-aluguel').textContent = rent;
      $('det-vencimento').textContent = due;
      var status = $('det-status');
      status.className = tag.className;
      status.textContent = tag.textContent;

      $('det-pago').hidden = !paid;
      $('det-rodape-pago').hidden = !paid;
      form.hidden = paid;
      if (!paid) {
        var value = $('pagamento-valor');
        var amount = Demo.parseMoney(rent);
        value.defaultValue = rent.replace(/R\$\s*/, '');
        value.setAttribute('data-money-min', String(amount));
        value.setAttribute('data-message-min', 'O valor precisa cobrir o aluguel de ' + rent + '.');
      }
      Demo.open(dialog);
    });
  });

  form.addEventListener('demo:valid', function (event) {
    event.preventDefault();
    var name = card.querySelector('h2').textContent.trim();
    var amount = Demo.formatMoney(Demo.parseMoney($('pagamento-valor').value));
    var date = $('pagamento-data').value.split('-').reverse().join('/');
    var tag = card.querySelector('.chip');
    dialog.close();
    // o status muda depois que o modal começa a sair, com um pulso, para a mudança ser vista no card
    setTimeout(function () {
      tag.className = 'chip chip--paid';
      tag.textContent = 'Pago';
      if (tag.animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        tag.animate(
          [{ transform: 'scale(1)' }, { transform: 'scale(1.18)', offset: 0.4 }, { transform: 'scale(1)' }],
          { duration: 420, easing: 'ease-out' }
        );
      }
    }, 150);
    Demo.toast('Pagamento de ' + amount + ' de ' + name + ' registrado em ' + date +
      '. Nesta demonstração ele não fica salvo.');
  });
})();
