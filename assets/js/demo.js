/*
 * Recursos comuns dos fluxos de demonstração (sem backend):
 * - Demo.toast(mensagem): aviso rápido no rodapé da tela.
 * - Formulários com data-demo-form: validação com mensagens em português embaixo de cada campo.
 *   Se o formulário for válido, dispara o evento "demo:valid" no <form>; se ninguém tratar
 *   (event.preventDefault()), fecha o modal e mostra o texto de data-success.
 * - Ao abrir um modal (botões com data-modal), os formulários dele voltam ao estado inicial.
 *
 * Atributos extras de validação:
 *   data-match="#id"     o valor precisa ser igual ao do campo #id (ex.: confirmar senha)
 *   data-differs="#id"   o valor precisa ser diferente do campo #id (ex.: nova senha)
 *   data-message-*       mensagem própria para um erro (ex.: data-message-pattern, data-message-min)
 */
(function () {
  'use strict';

  var region = null;

  function toast(message) {
    if (!region) {
      region = document.createElement('div');
      region.className = 'toast-region';
      region.setAttribute('role', 'status');
      region.setAttribute('aria-live', 'polite');
      document.body.appendChild(region);
    }
    var el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    region.appendChild(el);
    setTimeout(function () {
      el.classList.add('is-leaving');
      setTimeout(function () { el.remove(); }, 300);
    }, 4500);
  }

  function messageFor(input) {
    var v = input.validity;
    var own = function (key) { return input.getAttribute('data-message-' + key); };
    if (v.customError) return input.validationMessage;
    if (v.valueMissing) return own('required') || (input.tagName === 'SELECT' ? 'Escolha uma opção.' : 'Preencha este campo.');
    if (v.badInput) return own('bad') || 'Informe um valor válido.';
    if (v.typeMismatch) return input.type === 'email' ? 'Informe um e-mail válido, como nome@exemplo.com.' : 'Valor inválido.';
    if (v.tooShort) return own('length') || ('Use pelo menos ' + input.minLength + ' caracteres.');
    if (v.patternMismatch) return own('pattern') || 'Formato inválido.';
    if (v.rangeUnderflow) return own('min') || ('O valor mínimo é ' + input.min + '.');
    if (v.rangeOverflow) return own('max') || ('O valor máximo é ' + input.max + '.');
    if (v.stepMismatch) return own('step') || 'Use no máximo duas casas decimais.';
    return 'Valor inválido.';
  }

  function errorElement(input, create) {
    var field = input.closest('.field') || input;
    var next = field.nextElementSibling;
    if (next && next.classList.contains('field-error')) return next;
    if (!create) return null;
    var el = document.createElement('p');
    el.className = 'field-error';
    el.id = (input.id || ('campo-' + Math.random().toString(36).slice(2))) + '-erro';
    field.insertAdjacentElement('afterend', el);
    return el;
  }

  function setError(input, message) {
    var field = input.closest('.field');
    var el = errorElement(input, !!message);
    if (field) field.classList.toggle('field--invalid', !!message);
    if (message) {
      el.textContent = message;
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', el.id);
    } else {
      if (el) el.remove();
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
    }
  }

  // Valor em reais no formato brasileiro: "1500", "1500,5", "1.500,00"
  var MONEY = /^(\d{1,3}(\.\d{3})+|\d+)(,\d{1,2})?$/;

  function parseMoney(text) {
    var clean = String(text).replace(/R\$\s*/i, '').trim();
    if (!MONEY.test(clean)) return NaN;
    return parseFloat(clean.replace(/\./g, '').replace(',', '.'));
  }

  function formatMoney(value) {
    return 'R$ ' + value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function checkField(input) {
    var form = input.form;
    input.setCustomValidity('');
    var match = input.getAttribute('data-match');
    var differs = input.getAttribute('data-differs');
    if (input.hasAttribute('data-money') && input.value.trim()) {
      var amount = parseMoney(input.value);
      var min = parseFloat(input.getAttribute('data-money-min') || '0.01');
      if (isNaN(amount)) {
        input.setCustomValidity(input.getAttribute('data-message-pattern') || 'Use apenas números, como 1.500,00.');
      } else if (amount < min) {
        input.setCustomValidity(input.getAttribute('data-message-min') || ('O valor mínimo é ' + formatMoney(min) + '.'));
      }
    }
    // minlength do navegador só vale para texto digitado; aqui vale também para texto já preenchido
    var minLength = input.minLength > 0 ? input.minLength : 0;
    if (!input.validationMessage && minLength && input.value.length && input.value.trim().length < minLength) {
      input.setCustomValidity(input.getAttribute('data-message-length') || ('Use pelo menos ' + minLength + ' caracteres.'));
    }
    if (input.validationMessage) {
      // erro já definido acima (valor em reais ou tamanho mínimo)
    } else if (match && input.value && form && input.value !== form.querySelector(match).value) {
      input.setCustomValidity(input.getAttribute('data-message-match') || 'Os valores não conferem.');
    } else if (differs && input.value && form && input.value === form.querySelector(differs).value) {
      input.setCustomValidity(input.getAttribute('data-message-differs') || 'Use um valor diferente.');
    }
    var ok = input.checkValidity();
    setError(input, ok ? '' : messageFor(input));
    return ok;
  }

  function fields(form) {
    return Array.prototype.slice.call(form.querySelectorAll('input, select, textarea')).filter(function (el) {
      return el.type !== 'hidden' && !el.disabled && !el.closest('[hidden]');
    });
  }

  function validate(form) {
    var firstInvalid = null;
    fields(form).forEach(function (input) {
      if (!checkField(input) && !firstInvalid) firstInvalid = input;
    });
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  function resetForm(form) {
    form.reset();
    fields(form).forEach(function (input) { setError(input, ''); });
  }

  function resetDialog(dialog) {
    dialog.querySelectorAll('form[data-demo-form]').forEach(resetForm);
  }

  // Formulários de demonstração
  document.querySelectorAll('form[data-demo-form]').forEach(function (form) {
    form.noValidate = true;

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!validate(form)) return;
      var go = form.dispatchEvent(new CustomEvent('demo:valid', { cancelable: true }));
      if (!go) return;
      var dialog = form.closest('dialog');
      if (dialog && dialog.open) dialog.close();
      if (form.getAttribute('data-success')) toast(form.getAttribute('data-success'));
    });

    // Depois do primeiro erro num campo, revalida enquanto a pessoa digita
    form.addEventListener('input', function (event) {
      var input = event.target;
      if (input.getAttribute('aria-invalid') === 'true') checkField(input);
      // campos que dependem deste (ex.: confirmar senha) também são revalidados
      fields(form).forEach(function (other) {
        var ref = other.getAttribute('data-match') || other.getAttribute('data-differs');
        if (ref && form.querySelector(ref) === input && other.getAttribute('aria-invalid') === 'true') checkField(other);
      });
    });
  });

  // Ao abrir um modal pelo botão, o formulário começa limpo
  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-modal]');
    if (!trigger) return;
    var dialog = document.getElementById(trigger.getAttribute('data-modal'));
    if (dialog) resetDialog(dialog);
  });

  function open(dialog) {
    resetDialog(dialog);
    dialog.showModal();
    var auto = dialog.querySelector('[autofocus]');
    if (auto && !auto.closest('[hidden]')) auto.focus();
  }

  window.Demo = {
    toast: toast, validate: validate, resetForm: resetForm, open: open,
    parseMoney: parseMoney, formatMoney: formatMoney
  };
})();
