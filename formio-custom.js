(function () {
  console.log('[Form.io Custom] Script started.');

  function bindPreviewEvent() {
    const formInstances = Object.values(Formio.forms || {});
    if (formInstances.length === 0) {
      console.log('[Form.io Custom] No form instances found. Retrying...');
      return setTimeout(bindPreviewEvent, 500);
    }

    const mainForm = formInstances[0];
    console.log('[Form.io Custom] Found form instance:', mainForm);

    // Bind the previewPDF event ONCE
    if (!window._pdfPreviewBound) {
      Formio.events.on('previewPDF', () => {
        console.log('[Form.io Custom] previewPDF event triggered.');

        const data = mainForm.submission.data || {};
        console.log('[Form.io Custom] Submission data:', data);

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
            }
          };
        });
      });

      window._pdfPreviewBound = true;
      console.log('[Form.io Custom] previewPDF event bound.');
    }
  }

  // Wait for DOM and Formio to be ready
  function waitUntilReady() {
    if (typeof Formio === 'undefined' || !Formio.forms) {
      console.log('[Form.io Custom] Waiting for Formio...');
      return setTimeout(waitUntilReady, 500);
    }

    bindPreviewEvent();
  }

  waitUntilReady();
})();
