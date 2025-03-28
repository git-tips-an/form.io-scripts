(function () {
  console.log('[Form.io Custom] Bootstrap 4 modal script started.');

  function showPdfInContainer(data) {
    console.log('[Form.io Custom] Loading PDF with data:', data);

    const container = document.getElementById('pdfPreviewContainer');
    if (!container) {
      console.warn('[Form.io Custom] PDF container not found!');
      return;
    }

    container.innerHTML = ''; // Clear previous form

    Formio.createForm(container, 'https://tmewfqfbvfqyixx.form.io/ssa263', {
      readOnly: true
    }).then(pdfForm => {
      pdfForm.submission = {
        data: {
          claimantName: data.claimantName || ''
        }
      };
    });
  }

  function tryBind() {
    const formInstances = Object.values(Formio.forms || {});
    const mainForm = formInstances.find(f => f._data?.claimantName !== undefined);

    if (!mainForm) {
      console.log('[Form.io Custom] Main form not ready. Retrying...');
      return setTimeout(tryBind, 500);
    }

    const triggerBtn = document.querySelector('.trigger-preview');
    if (!triggerBtn) {
      console.log('[Form.io Custom] Button not found. Retrying...');
      return setTimeout(tryBind, 500);
    }

    if (!triggerBtn.dataset.bound) {
      triggerBtn.addEventListener('click', () => {
        console.log('[Form.io Custom] Button clicked!');
        showPdfInContainer(mainForm._data || {});
      });

      triggerBtn.dataset.bound = 'true';
      console.log('[Form.io Custom] Preview button bound!');
    }
  }

  function waitForFormio() {
    if (typeof Formio === 'undefined' || !Formio.forms) {
      console.log('[Form.io Custom] Waiting for Formio...');
      return setTimeout(waitForFormio, 500);
    }
    tryBind();
  }

  waitForFormio();
})();
