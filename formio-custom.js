(function () {
  console.log('[Form.io Custom] Bootstrap 4 PDF Preview script started1.');

  function showPdfInContainer(data) {
    console.log('[Form.io Custom] Loading PDF form with data:', data);

    const container = document.getElementById('pdfPreviewContainer');
    if (!container) {
      console.warn('[Form.io Custom] PDF container not found!');
      return;
    }

    container.innerHTML = ''; // Clear previous content

    Formio.createForm(container, 'https://tmewfqfbvfqyixx.form.io/ssa263', {
      readOnly: true
    }).then(pdfForm => {
      console.log('[Form.io Custom] PDF form loaded. Setting submission...');
      pdfForm.submission = {
        data: {
          claimantName: data.claimantName || '',
          // Add other fields here if needed (e.g., ssn: data.ssn)
        }
      };
    });
  }

  function tryBind() {
    const formInstances = Object.values(Formio.forms || {});
    const mainForm = formInstances.find(f => f._form?.name === '263Web');

    if (!mainForm) {
      console.log('[Form.io Custom] Main form not found yet. Retrying...');
      return setTimeout(tryBind, 500);
    }

    const triggerBtn = document.querySelector('.trigger-preview');
    if (!triggerBtn) {
      console.log('[Form.io Custom] Preview button not found. Retrying...');
      return setTimeout(tryBind, 500);
    }

    if (!triggerBtn.dataset.bound) {
      triggerBtn.addEventListener('click', () => {
        const formData = mainForm._data || {};
        console.log('[Form.io Custom] Button clicked. Form data:', formData);

        // Open Bootstrap 4 modal (via data attributes or manually)
        $('#exampleModal').modal('show');

        // Load and populate PDF form
        showPdfInContainer(formData);
      });

      triggerBtn.dataset.bound = 'true';
      console.log('[Form.io Custom] Preview button successfully bound!');
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
