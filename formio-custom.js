(function () {
  console.log('[Form.io Custom] Bootstrap modal script started.');

  function showPdfInModal(data) {
    console.log('[Form.io Custom] Showing modal with data:', data);

    const container = document.getElementById('pdfPreviewContainer');
    if (!container) {
      console.warn('[Form.io Custom] Container not found!');
      return;
    }

    container.innerHTML = ''; // clear previous PDF
    const modalEl = document.getElementById('pdfPreviewModal');
    if (!modalEl) {
      console.warn('[Form.io Custom] Modal not found!');
      return;
    }

    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    Formio.createForm(container, 'https://tmewfqfbvfqyixx.form.io/ssa263', {
      readOnly: true
    }).then(pdfForm => {
      pdfForm.submission = {
        data: {
          claimantName: data.claimantName || '',
          // Add more fields as needed
          // ssn: data.ssn || '',
          // phone: data.phone || ''
        }
      };
    });
  }

  function tryBind() {
    const formInstances = Object.values(Formio.forms || {});
    const mainForm = formInstances.find(f => f._data?.claimantName !== undefined);

    if (!mainForm) {
      console.log('[Form.io Custom] Form not ready. Retrying...');
      return setTimeout(tryBind, 500);
    }

    console.log('[Form.io Custom] Found form:', mainForm);

    const button = document.querySelector('.trigger-preview');
    if (!button) {
      console.log('[Form.io Custom] Button not ready. Retrying...');
      return setTimeout(tryBind, 500);
    }

    if (!button.dataset.bound) {
      button.addEventListener('click', () => {
        console.log('[Form.io Custom] Preview button clicked!');
        const data = mainForm._data || {};
        showPdfInModal(data);
      });

      button.dataset.bound = 'true';
      console.log('[Form.io Custom] Preview button bound!');
    }
  }

  function waitUntilReady() {
    if (typeof Formio === 'undefined' || !Formio.forms) {
      console.log('[Form.io Custom] Waiting for Formio...');
      return setTimeout(waitUntilReady, 500);
    }
    tryBind();
  }

  waitUntilReady();
})();
