(function () {
  var form = document.querySelector('.contact-form[data-web3forms]');
  if (!form) return;

  var btn = form.querySelector('[data-submit-btn]');
  var status = form.querySelector('[data-form-status]');
  var originalText = btn.textContent;

  function setStatus(msg, type) {
    status.textContent = msg;
    status.className = 'contact-form__status contact-form__status--' + type;
  }

  function clearErrors() {
    var errors = form.querySelectorAll('.field__error');
    for (var i = 0; i < errors.length; i++) { errors[i].textContent = ''; }
    var fields = form.querySelectorAll('.field--error');
    for (var j = 0; j < fields.length; j++) { fields[j].classList.remove('field--error'); }
  }

  function showFieldError(fieldId, msg) {
    var input = document.getElementById(fieldId);
    var err = form.querySelector('[data-error-for="' + fieldId + '"]');
    if (err) err.textContent = msg;
    if (input) input.closest('.field').classList.add('field--error');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();
    btn.disabled = true;
    btn.textContent = 'Invio in corso…';
    setStatus('', '');

    var data = new FormData(form);
    fetch(form.action, {
      method: 'POST',
      body: data
    })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        btn.disabled = false;
        btn.textContent = originalText;
        if (json.success) {
          setStatus('Grazie! Ti risponderemo entro 24 ore lavorative.', 'success');
          form.reset();
        } else {
          var msg = json.message || 'Si è verificato un errore. Riprova o scrivici via LinkedIn.';
          setStatus(msg, 'error');
          if (json.errors) {
            for (var field in json.errors) {
              showFieldError('cf-' + field, json.errors[field]);
            }
          }
        }
      })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = originalText;
        setStatus('Errore di rete. Verifica la connessione e riprova.', 'error');
      });
  });
})();