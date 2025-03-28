(function () {
  console.log('[Form.io Custom] Script started.');

  function bindPreviewEvent() {
    const formInstances = Object.values(Formio.forms || {});
    const mainForm = formInstances.find(f => f._data?.claimantName !== undefined);

    if (!mainForm) {
      console.log('[Form.io Custom] Correct form not found yet. Retrying...');
      return setTimeout(bindPreviewEvent, 500);
    }

    console.log('[Form.io Custom] Found correct form instance:', mainForm);
    console.log('[Form.io Custom] Current form data:', mainForm._data);

    // Fallback manual trigger using button class
    setTimeout(() => {
      const btn = document.querySelector('.trigger-preview');
      if (btn) {
        btn.addEventListener('click', () => {
          console.log('[Form.io Custom] Manual fallback: button click');
          Formio.events.emit('previewPDF');
        });
      } else {
        console.warn('[Form.io Custom] Preview button not found for fallback');
      }
    }, 1000);

    if (!window._pdfPreviewBound) {
      Formio.events.on('previewPDF', () => {
        console.log('[Form.io Custom] previewPDF event triggered.');

        const data = mainForm._data || {};
        console.log('[Form.io Custom] Using data:', data);

        const modal = document.createElement('div');
        modal.id = 'dynamicModal';
        modal.style.cssText = `
          position:fixed;
          top:0; left:0;
          width:100vw;
          height:100vh;
          background-color:rgba(0,0,0,0.6);
          z-index:9999;
          display:flex;
          align-items:center;
          justify-content:center;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
          background:white;
          width:80%;
          height:90%;
          padding:20px;
          border-radius:10px;
          overflow:auto;
          position:relative;
          box-shadow: 0 0 20px rgba(0,0,0,0.3);
        `;

        const closeBtn = document.createElement('button');
        closeBtn.innerText = 'Close';
        closeBtn.style.cssText = `
          position:absolute;
          top:10px;
          right:10px;
          padding:8px 12px;
          background:#f44336;
          color:white;
          border:none;
          border-radius:5px;
          cursor:pointer;
        `;
        closeBtn.onclick = () => modal.remove();

        content.appendChild(closeBtn);
        modal.appendChild(content);
        document.body.appendChild(modal);

        Formio.createForm(content, 'https://tmewfqfbvfqyixx.form.io/ssa263', {
          readOnly: true
        }).then(pdfForm => {
          pdfForm.submission = {
            data: {
              claimantName: data.claimantName
              // Add more fields here as needed (e.g., ssn: data.ssn)
            }
          };
        });
      });

      window._pdfPreviewBound = true;
      console.log('[Form.io Custom] previewPDF event bound.');
    }
  }

  function waitUntilReady() {
    if (typeof Formio === 'undefined' || !Formio.forms) {
      console.log('[Form.io Custom] Waiting for Formio...');
      return setTimeout(waitUntilReady, 500);
    }

    bindPreviewEvent();
  }

  waitUntilReady();
})();
