Formio.events.on('previewPDF', () => {
  const data = Formio.forms['263Web'].submission.data;

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
