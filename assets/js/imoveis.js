/*
 * Imóveis: "Ver detalhes" das contas mensais, com lembrete para contas em atraso (demonstração).
 */
(function () {
  'use strict';

  // Inquilino responsável por cada apartamento (mesmos dados da página Inquilinos)
  var TENANTS = {
    'Apartamento 1507': { name: 'S.M.H. Yexela', phone: '(85) 99645-2071', due: 10 },
    'Apartamento 1508': { name: 'Alexey H.M.S.', phone: '(85) 99123-4567', due: 10 }
  };

  var dialog = document.getElementById('modal-conta');
  if (!dialog) return;
  var $ = function (id) { return document.getElementById(id); };
  var form = $('form-lembrete');
  var current = null;

  document.querySelectorAll('[data-bill-details]').forEach(function (button) {
    button.addEventListener('click', function () {
      var card = button.closest('.bill');
      var month = card.querySelector('.bill__header h4').textContent.trim();
      var apt = card.querySelector('.bill__header p').textContent.trim();
      var total = card.querySelector('.bill__total strong').textContent.trim();
      var late = !!card.querySelector('.status-badge--late');
      var tenant = TENANTS[apt];
      current = tenant;

      $('modal-conta-title').textContent = 'Contas de ' + month.charAt(0).toLowerCase() + month.slice(1);
      $('conta-resumo').textContent = apt + ' · Inquilino: ' + tenant.name + ' · Vencimento: dia ' + tenant.due;
      $('conta-itens').innerHTML = card.querySelector('.bill__list').innerHTML;
      $('conta-total').textContent = total;
      var status = $('conta-status');
      status.className = 'status-badge ' + (late ? 'status-badge--late' : 'status-badge--paid');
      status.textContent = late ? 'Atrasado' : 'Pago';

      form.hidden = !late;
      $('conta-rodape-pago').hidden = late;
      if (late) {
        var first = tenant.name.split(' ')[0];
        $('lembrete-mensagem').defaultValue = 'Olá, ' + first + '! As contas de ' + month.toLowerCase() + ' do ' +
          apt.toLowerCase() + ' (' + total + ') venceram no dia ' + tenant.due + ' e ainda estão em aberto. ' +
          'Por favor, regularize o pagamento. Obrigado!';
        $('lembrete-para').textContent = tenant.name + ' · ' + tenant.phone;
      }
      Demo.open(dialog);
    });
  });

  form.addEventListener('demo:valid', function (event) {
    event.preventDefault();
    dialog.close();
    Demo.toast('Lembrete enviado para ' + current.name + ' (' + current.phone + '). ' +
      'Nesta demonstração nenhuma mensagem é enviada de fato.');
  });
})();
