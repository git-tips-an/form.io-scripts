(function () {
  console.log('[Form.io Custom] Bootstrap modal PDF script loaded22');

  function showPdfInContainer(data) {
    console.log('[Form.io Custom] Showing PDF with data:', data);

    const container = document.getElementById('pdfPreviewContainer');
    if (!container) {
      console.warn('[Form.io Custom] #pdfPreviewContainer not found!');
      return;
    }

    container.innerHTML = ''; // Clear old content

    Formio.createForm(container, 'https://tmewfqfbvfqyixx.form.io/ssa263', {
      readOnly: true
    }).then(pdfForm => {
      pdfForm.submission = {
        data: {
          claimantName: data.claimantName || ''
          // Add other fields here as needed
        }
      };
    });
  }

  function openModal() {
    const modal = document.getElementById('exampleModal');
    modal.classList.add('show');
    modal.style.display = 'block';
    modal.setAttribute('aria-modal', 'true');
    modal.removeAttribute('aria-hidden');
    document.body.classList.add('modal-open');

    // Add backdrop manually
    if (!document.querySelector('.modal-backdrop')) {
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
    }
  }

  function closeModal() {
    const modal = document.getElementById('exampleModal');
    modal.classList.remove('show');
    modal.style.display = 'none';
    modal.removeAttribute('aria-modal');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();
  }

  function bindTriggerButton(mainForm) {
    const triggerBtn = document.querySelector('.trigger-preview');
    const closeBtn = document.getElementById('closePdfModal');

    if (!triggerBtn) {
      console.log('[Form.io Custom] Button not found. Retrying...');
      return setTimeout(() => bindTriggerButton(mainForm), 500);
    }

    if (!triggerBtn.dataset.bound) {
      triggerBtn.addEventListener('click', () => {
        const formData = {
          claimantName: mainForm._data?.claimantName ||
            document.querySelector('[name="data[claimantName]"]')?.value || ''
        };

        console.log('[Form.io Custom] Button clicked. Using data:', formData);
        openModal();
        showPdfInContainer(formData);
      });

      triggerBtn.dataset.bound = 'true';
      console.log('[Form.io Custom] Preview button bound!');
    }

    if (closeBtn && !closeBtn.dataset.bound) {
      closeBtn.addEventListener('click', () => {
        console.log('[Form.io Custom] Closing modal');
        closeModal();
      });
      closeBtn.dataset.bound = 'true';
    }
  }

  function waitUntilReady() {
    if (typeof Formio === 'undefined' || !Formio.forms) {
      console.log('[Form.io Custom] Waiting for Formio...');
      return setTimeout(waitUntilReady, 500);
    }

    const formInstances = Object.values(Formio.forms || {});
    const mainForm = formInstances.find(f => f._form?.name === '263Web') || formInstances[0];

    if (!mainForm || !mainForm._form) {
      console.log('[Form.io Custom] Main form not yet available. Retrying...');
      return setTimeout(waitUntilReady, 500);
    }

    console.log('[Form.io Custom] Main form found:', mainForm);
    bindTriggerButton(mainForm);
  }

  waitUntilReady();
})();
