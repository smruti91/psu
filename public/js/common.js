// Helper: Show edit button after successful save
function showEditButton(containerId) {
    var container = document.getElementById(containerId);
    if (container) container.style.display = 'block';
}
function hideMsgDivs(errorDiv, successDiv) {
  if (errorDiv) errorDiv.style.display = 'none';
  if (successDiv) successDiv.style.display = 'none';
}
// Helper: Hide form button after successful save
function hideFormButton(form, selector) {
    var btn = form.querySelector(selector);
    if (btn) btn.style.display = 'none';
}
const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
// --- Step 1: Year Wise Data ---
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('psuFormYearWiseData');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var fieldIds = [
      'txtNameofPSU', 'txtAuthorizedShareCap', 'txtSubShareCap', 'txtPaidUpShareCap',
      'txtGovtContribution', 'txtNameofShareHolders'
    ];
    
    fieldIds.forEach(function (id) {
      var errDiv = document.getElementById('error_' + id);
      if (errDiv) { errDiv.textContent = ''; errDiv.style.display = 'none'; }
      if (form[id]) form[id].classList.remove('is-invalid');
    });

    var errorDiv = document.getElementById('psuFormYearWiseDataErrors');
    var successDiv = document.getElementById('psuFormYearWiseDataSuccess');
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    var hasError = false;
    function setFieldError(id, msg) {
      var errDiv = document.getElementById('error_' + id);
      if (errDiv) { errDiv.textContent = msg; errDiv.style.display = 'block'; }
      if (form[id]) form[id].classList.add('is-invalid');
      hasError = true;
    }
    function isEmpty(id) { return !form[id].value.trim(); }
    function isNumber(id) { return /^\d+(\.\d+)?$/.test(form[id].value.trim()); }

    if (isEmpty('txtNameofPSU')) setFieldError('txtNameofPSU', 'Name of the PSU is required.');
    if (isEmpty('txtAuthorizedShareCap') || !isNumber('txtAuthorizedShareCap')) setFieldError('txtAuthorizedShareCap', 'Authorized Share Capital must be a number.');
    if (isEmpty('txtSubShareCap') || !isNumber('txtSubShareCap')) setFieldError('txtSubShareCap', 'Subscribed Share Capital must be a number.');
    if (isEmpty('txtPaidUpShareCap') || !isNumber('txtPaidUpShareCap')) setFieldError('txtPaidUpShareCap', 'Paid-up Share Capital must be a number.');
    if (isEmpty('txtGovtContribution') || !isNumber('txtGovtContribution')) setFieldError('txtGovtContribution', 'Govt. Contribution must be a number.');
    if (isEmpty('txtNameofShareHolders')) setFieldError('txtNameofShareHolders', 'Name of the Share Holders is required.');
    
    if (hasError) return;

    var formData = new FormData(form);
    var isUpdate = formData.get('yearWiseId');
    var url = isUpdate ? '/psu/year-wise-data-update' : '/psu/year-wise-data';
    console.log('Submitting form to URL:', url, 'with data:', Object.fromEntries(formData.entries()));
    console.log(url);
    fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'same-origin',
      headers: { 'Accept': 'application/json',  'CSRF-Token': csrfToken }
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      console.log('Response from server:', data);
      if (data.errors) {
        data.errors.forEach(function (err) {
          if (err.param && document.getElementById('error_' + err.param)) {
            var field = form[err.param];
            var errDiv = document.getElementById('error_' + err.param);
            errDiv.textContent = err.msg;
            errDiv.style.display = 'block';
            if (field) field.classList.add('is-invalid');
          }
        });
        
        
      } else if (data.success) {
        successDiv.innerHTML = data.message;
        successDiv.style.display = 'block';
        Swal.fire({
        title: "Success!",
        text: data.message,
        icon: "success"
      });
        hideFormButton(form, '.btn-save-step1, .btn-update-step1');
        var nextBtn = document.getElementById('nextStep1');
        if (nextBtn) nextBtn.style.display = 'inline-block';
        showEditButton('editButtonContainerStep1');
        setTimeout(function() { hideMsgDivs(errorDiv, successDiv); }, 5000);
        if (data.id) {
          // Update all hidden psu_mstr_id fields using name attribute (avoid duplicate id issues)
          var psuInputs = document.querySelectorAll('input[name="psu_mstr_id"]');
          console.log('Updating ' + psuInputs.length + ' psu_mstr_id inputs with value: ' + data.id);
          psuInputs.forEach(function(el) {
            el.value = data.id;
            console.log('Updated input:', el.id || el.name, '=', el.value);
          });
          var ywId = document.getElementById('yearWiseId');
          if (ywId) ywId.value = data.id;
        }
      }
    })
    .catch(function() {
      errorDiv.innerHTML = 'An error occurred while submitting the form.';
      errorDiv.style.display = 'block';
    });
  });

  // Edit button for Step 1
  var editBtn1 = document.getElementById('btnEditStep1');
  if (editBtn1) {
    editBtn1.addEventListener('click', function() {
      var btn = form.querySelector('.btn-save-step1, .btn-update-step1');
      if (btn) btn.style.display = 'inline-block';
      this.style.display = 'none';
    });
  }

  // Delete existing file (single file delete)
  document.querySelectorAll('.delete-btn').forEach(function(button) {
    button.addEventListener('click', function() {
      var csrfToken = document.querySelector('[name="csrf-token"]')?.getAttribute('content');
      var id = this.getAttribute('data-id');
      if (confirm('Are you sure you want to delete this file?')) {
        fetch('/psu/delete-challan-file', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json', 'CSRF-Token': csrfToken },
          body: JSON.stringify({ id: id })
        })
        .then(function(res) { return res.json(); })
        .then(function(data) { if (data.success) location.reload(); });
      }
    });
  });

  // Delete file from list (new handler)
  document.querySelectorAll('.delete-file-btn').forEach(function(button) {
    button.addEventListener('click', function() {
      var csrfToken = document.querySelector('[name="csrf-token"]')?.getAttribute('content');
      var id = this.getAttribute('data-id');
      var fileIndex = this.getAttribute('data-file-index');
      if (confirm('Are you sure you want to delete this file?')) {
        fetch('/psu/delete-challan-file', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json', 'CSRF-Token': csrfToken },
          body: JSON.stringify({ id: id, fileIndex: fileIndex })
        })
        .then(function(res) { return res.json(); })
        .then(function(data) { if (data.success) location.reload(); });
      }
    });
  });

  // Add more file inputs
  var addFileBtn = document.getElementById('addChallanFileBtn');
  if (addFileBtn) {
    addFileBtn.addEventListener('click', function() {
      var container = document.getElementById('challanFilesContainer');
      var newRow = document.createElement('div');
      newRow.className = 'file-input-row d-flex align-items-center mb-2';
      newRow.innerHTML = '<input type="file" class="form-control" name="chaln_recipt" accept=".pdf"><button type="button" class="btn btn-danger btn-sm ml-2 remove-file-btn" title="Remove">✕</button>';
      container.appendChild(newRow);

      // Add remove handler to new button
      newRow.querySelector('.remove-file-btn').addEventListener('click', function() {
        container.removeChild(newRow);
      });
    });
  }

  // Remove file input handlers
  document.querySelectorAll('.remove-file-btn').forEach(function(button) {
    button.addEventListener('click', function() {
      var row = this.closest('.file-input-row');
      if (row) row.remove();
    });
  });
});

// --- Step 2: Balance Sheet ---
document.addEventListener('DOMContentLoaded', function () {
  var form2 = document.getElementById('psuFormBalanceSheet');
  
  if (!form2) return;
  form2.addEventListener('submit', function (e) {
    e.preventDefault();
    console.log('Balance Sheet form:', form2);
    var fieldIds = [
      'txtTotalAssets', 'txtCurrentAssets', 'txtTotLiabilities', 'txtTotCurrLiabilities',
      'txtTotalLongTermDebt', 'txtTotalequity', 'txtInvetory', 'txtAccountsReceivable', 'txtAccountsPayable'
    ];
    fieldIds.forEach(function (id) {
      var field = form2.querySelector('#' + id);
      if (field) field.classList.remove('is-invalid');
    });
    var hasError = false;
    function isNum(id) { return /^\d+(\.\d+)?$/.test(form2.querySelector('#' + id).value.trim()); }
    function isEmp(id) { return !form2.querySelector('#' + id).value.trim(); }
    fieldIds.forEach(function (id) {
      if (isEmp(id) || !isNum(id)) { form2.querySelector('#' + id).classList.add('is-invalid'); hasError = true; }
    });
    if (hasError) return;

    var formData = new FormData(form2);
    var isUpdate = form2.querySelector('#balanceSheetId');
    var url = isUpdate ? '/psu/balance-sheet-update' : '/psu/balance-sheet';
    var successDiv = document.getElementById('psuFormBalanceSheetSuccess');
    var errorDiv = document.getElementById('psuFormBalanceSheetErrors');
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    fetch(url, { method: 'POST', body: formData, credentials: 'same-origin', headers: { 'Accept': 'application/json' } })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data.success) {
          successDiv.innerHTML = data.message;
          successDiv.style.display = 'block';
          Swal.fire({
            title: "Success!",
            text: data.message,
            icon: "success"
          });
          hideFormButton(form2, '#submitStep3, #updateStep3');
          var nextBtn = document.getElementById('nextStep2');
          if (nextBtn) nextBtn.style.display = 'inline-block';
          showEditButton('editButtonContainerStep2');
        } else if (data.errors) {
          errorDiv.innerHTML = data.errors.map(function(e) { return e.msg; }).join('<br>');
          errorDiv.style.display = 'block';
        } else if (data.message) {
          errorDiv.innerHTML = data.message;
          errorDiv.style.display = 'block';
        }
        setTimeout(function() { hideMsgDivs(errorDiv, successDiv); }, 5000);
      })
      .catch(function(err) {
        console.error('Error:', err);
        errorDiv.innerHTML = 'Network error. Please check your connection.';
        errorDiv.style.display = 'block';
      });
  });

  var editBtn2 = document.getElementById('btnEditStep2');
  if (editBtn2) {
    editBtn2.addEventListener('click', function() {
      var btn = form2.querySelector('#submitStep2, #updateStep2');
      if (btn) { btn.style.display = 'inline-block'; btn.disabled = false; }
      this.style.display = 'none';
    });
  }
});

// --- Step 3: Income Statement ---
document.addEventListener('DOMContentLoaded', function () {
  var form3 = document.getElementById('psuFormIncomeStatement');
  if (!form3) return;
  form3.addEventListener('submit', function (e) {
    e.preventDefault();
    var fieldIds = [
      'txtTotRevenue', 'txtCostofGoodsSold', 'txtOprexpenses', 'txtTotalExpenses',
      'txtEbitda', 'txtDepAmor', 'txtEbit', 'txtIntExpenses', 'txtTaxExpenses',
      'txtAnyExpenses', 'txtNetIncome'
    ];
    fieldIds.forEach(function (id) {
      var field = form3.querySelector('#' + id);
      if (field) field.classList.remove('is-invalid');
    });
    var hasError = false;
    function isNum(id) { return /^\d+(\.\d+)?$/.test(form3.querySelector('#' + id).value.trim()); }
    function isEmp(id) { return !form3.querySelector('#' + id).value.trim(); }
    fieldIds.forEach(function (id) { if (isEmp(id) || !isNum(id)) { form3.querySelector('#' + id).classList.add('is-invalid'); hasError = true; } });
    if (hasError) return;

    var formData = new FormData(form3);
    var isUpdate = form3.querySelector('#incomeSheetId');
    var url = isUpdate ? '/psu/income-statement-update' : '/psu/income-statement';
    var successDiv = document.getElementById('psuFormIncomeStatementSuccess');
    var errorDiv = document.getElementById('psuFormIncomeStatementErrors');
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    fetch(url, { method: 'POST', body: formData, credentials: 'same-origin', headers: { 'Accept': 'application/json' } })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data.success) {
          successDiv.innerHTML = data.message;
          successDiv.style.display = 'block';
          Swal.fire({
            title: "Success!",
            text: data.message,
            icon: "success"
          });
          hideFormButton(form3, '#submitStep2, #updateStep2');
          var nextBtn = document.getElementById('nextStep3');
          if (nextBtn) nextBtn.style.display = 'inline-block';
          showEditButton('editButtonContainerStep3');
        } else if (data.errors) {
          errorDiv.innerHTML = data.errors.map(function(e) { return e.msg; }).join('<br>');
          errorDiv.style.display = 'block';
        } else if (data.message) {
          errorDiv.innerHTML = data.message;
          errorDiv.style.display = 'block';
        }
        setTimeout(function() { hideMsgDivs(errorDiv, successDiv); }, 5000);
      })
      .catch(function(err) {
        console.error('Error:', err);
        errorDiv.innerHTML = 'Network error. Please check your connection.';
        errorDiv.style.display = 'block';
      });
  });

  var editBtn3 = document.getElementById('btnEditStep3');
  if (editBtn3) {
    editBtn3.addEventListener('click', function() {
      var btn = form3.querySelector('#submitStep3, #updateStep3');
      if (btn) { btn.style.display = 'inline-block'; btn.disabled = false; }
      this.style.display = 'none';
    });
  }
});

// --- Step 4: Profit & Loss ---
document.addEventListener('DOMContentLoaded', function () {
  var formPL = document.getElementById('psuFormProfitLoss');
  if (!formPL) return;
  formPL.addEventListener('submit', function (e) {
    e.preventDefault();
    var fieldIds = ['txtProfitLossAmount', 'txtPAT', 'txtDividendPayable', 'txtDividendpaid'];
    fieldIds.forEach(function (id) {
      var field = formPL.querySelector('#' + id);
      if (field) field.classList.remove('is-invalid');
    });
    var hasError = false;
    function isNum(id) { return /^\d+(\.\d+)?$/.test(formPL.querySelector('#' + id).value.trim()); }
    function isEmp(id) { return !formPL.querySelector('#' + id).value.trim(); }
    fieldIds.forEach(function (id) { if (isEmp(id) || !isNum(id)) { formPL.querySelector('#' + id).classList.add('is-invalid'); hasError = true; } });
    if (hasError) return;

    var formData = new FormData(formPL);
    
    // Check if record exists for this psu_mstr_id to decide URL
    // Since we don't have a specific ID for P&L in the form yet, we'll use a generic submit route
    // that handles Upsert (Insert or Update) in the controller.
    var url = '/psu/profit-loss'; 
    
    var successDiv = document.getElementById('psuFormProfitLossSuccess');
    var errorDiv = document.getElementById('psuFormProfitLossErrors');
    if (successDiv) successDiv.style.display = 'none';
    if (errorDiv) errorDiv.style.display = 'none';

    fetch(url, { method: 'POST', body: formData, credentials: 'same-origin', headers: { 'Accept': 'application/json', 'CSRF-Token': csrfToken } })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        console.log(data);
        if (data.success) {
          if (successDiv) {
            successDiv.innerHTML = data.message;
            successDiv.style.display = 'block';
            Swal.fire({
            title: "Success!",
            text: data.message,
            icon: "success"
          });
          }
          // Logic to show next step or edit button
           hideFormButton(formPL, '.btn-save-step4, .btn-update-step4');
          var nextBtn = document.getElementById('nextStep4'); // Adjust based on your stepper
          if (nextBtn) nextBtn.style.display = 'inline-block';

           showEditButton('editButtonContainerStep4');
        } else if (data.errors) {
          if (errorDiv) {
            errorDiv.innerHTML = data.errors.map(function(e) { return e.msg; }).join('<br>');
            errorDiv.style.display = 'block';
          }
        }
        setTimeout(function() { hideMsgDivs(errorDiv, successDiv); }, 5000);
      })
      .catch(function(err) {
        console.error('Error:', err);
        if (errorDiv) {
          errorDiv.innerHTML = 'Network error. Please check your connection.';
          errorDiv.style.display = 'block';
        }
      });
  });
});
// --- Step 5: Govt. Relationship ---
document.addEventListener('DOMContentLoaded', function () {
  var form5 = document.getElementById('psuFormGovtRel');
  if (!form5) return;
  form5.addEventListener('submit', function (e) {
    e.preventDefault();
    var fieldIds = ['txtDirBudgetSub', 'txtTaxAndStateDues'];
    fieldIds.forEach(function (id) {
      var field = form5.querySelector('#' + id);
      if (field) field.classList.remove('is-invalid');
    });
    var hasError = false;
    function isNum(id) { return /^\d+(\.\d+)?$/.test(form5.querySelector('#' + id).value.trim()); }
    function isEmp(id) { return !form5.querySelector('#' + id).value.trim(); }
    fieldIds.forEach(function (id) { if (isEmp(id) || !isNum(id)) { form5.querySelector('#' + id).classList.add('is-invalid'); hasError = true; } });
    if (hasError) return;

    var formData = new FormData(form5);
    var isUpdate = form5.querySelector('#govtRelId');
    var url = isUpdate ? '/psu/govt-rel-update' : '/psu/govt-rel';
    var successDiv = document.getElementById('psuFormGovtRelSuccess');
    var errorDiv = document.getElementById('psuFormGovtRelErrors');
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    fetch(url, { method: 'POST', body: formData, credentials: 'same-origin', headers: { 'Accept': 'application/json' } })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data.success) {
          successDiv.innerHTML = data.message;
          successDiv.style.display = 'block';
          Swal.fire({
            title: "Success!",
            text: data.message,
            icon: "success"
          });
          hideFormButton(form5, '#submitStep5, #updateStep5');
          var nextBtn = document.getElementById('nextStep4');
          if (nextBtn) nextBtn.style.display = 'inline-block';
          showEditButton('editButtonContainerStep5');
        } else if (data.errors) {
          errorDiv.innerHTML = data.errors.map(function(e) { return e.msg; }).join('<br>');
          errorDiv.style.display = 'block';
        } else if (data.message) {
          errorDiv.innerHTML = data.message;
          errorDiv.style.display = 'block';
        }
        setTimeout(function() { hideMsgDivs(errorDiv, successDiv); }, 5000);
      })
      .catch(function(err) {
        console.error('Error:', err);
        errorDiv.innerHTML = 'Network error. Please check your connection.';
        errorDiv.style.display = 'block';
      });
  });

  var editBtn4 = document.getElementById('btnEditStep4');
  if (editBtn4) {
    editBtn4.addEventListener('click', function() {
      var btn = form5.querySelector('#submitStep4, #updateStep4');
      if (btn) { btn.style.display = 'inline-block'; btn.disabled = false; }
      this.style.display = 'none';
    });
  }
});
// --- Step 6: Annual Report Upload ---
document.addEventListener('DOMContentLoaded', function () {
  var form6 = document.getElementById('psuFormAnnualReportUpload');
  if (!form6) return;

  form6.addEventListener('submit', function (e) {
    e.preventDefault();
    var errorDiv = document.getElementById('psuFormUploadErrors');
    var successDiv = document.getElementById('psuFormUploadSuccess');
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    var fileInput = document.getElementById('txtAnnualReport');
    if (!fileInput.files || !fileInput.files[0]) {
      errorDiv.innerHTML = 'Please select a PDF file to upload.';
      errorDiv.style.display = 'block';
      return;
    }
    var file = fileInput.files[0];
    if (file.type !== 'application/pdf') {
      errorDiv.innerHTML = 'Only PDF files are allowed.';
      errorDiv.style.display = 'block';
      return;
    }
    var MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      errorDiv.innerHTML = 'File size should not exceed 5MB.';
      errorDiv.style.display = 'block';
      return;
    }

    var formData = new FormData(form6);
    var isUpdate = formData.get('annualReportId');
    var url = isUpdate ? '/psu/annual-report-update' : '/psu/annual-report';

    fetch(url, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data.success) {
          successDiv.innerHTML = data.message;
          successDiv.style.display = 'block';
          Swal.fire({
            title: "Success!",
            text: data.message,
            icon: "success"
          });
          var submitBtn = form6.querySelector('#submitStep6');
          if (submitBtn) submitBtn.style.display = 'none';

           localStorage.setItem('activeStep', '6');

          location.reload();
        } else {
          errorDiv.innerHTML = data.message || 'Error uploading Annual Report.';
          errorDiv.style.display = 'block';
        }

        setTimeout(function() { hideMsgDivs(errorDiv, successDiv); }, 5000);
      })
      .catch(function(err) {
        console.error('Error:', err);
        errorDiv.innerHTML = 'Error submitting Annual Report. Please try again.';
        errorDiv.style.display = 'block';
      });
  });

  document.addEventListener('DOMContentLoaded', function () {

    const activeStep = localStorage.getItem('activeStep');

    if (activeStep === '6') {

        document.querySelectorAll('.step-content').forEach(step => {
            step.style.display = 'none';
        });

        document.getElementById('step-content-6').style.display = 'block';

        // Optional: activate step indicator/tab
        document.querySelectorAll('.step-item').forEach(item => {
            item.classList.remove('active');
        });

        const step6Indicator = document.querySelector('[data-step="6"]');
        if (step6Indicator) {
            step6Indicator.classList.add('active');
        }

        localStorage.removeItem('activeStep');
    }
});

  // Delete annual report
  document.querySelectorAll('.delete-annual-report-btn').forEach(function(button) {
    button.addEventListener('click', function() {
      var csrfToken = document.querySelector('[name="csrf-token"]')?.getAttribute('content');
      var id = this.getAttribute('data-id');
      if (confirm('Are you sure you want to delete this file?')) {
        fetch('/psu/annual-report-delete', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json', 'CSRF-Token': csrfToken },
          body: JSON.stringify({ id: id })
        })
        .then(function(res) { return res.json(); })
        .then(function(data) { if (data.success) location.reload(); });
      }
    });
  });
});

// --- Preview Modal and Send for Approval ---
document.addEventListener('DOMContentLoaded', function () {
  // Preview modal
  document.getElementById('previewStep6')?.addEventListener('click', function () {
    var modal = new bootstrap.Modal(document.getElementById('previewModal'));
    modal.show();
  });

  // Modal close buttons
  document.querySelectorAll('.close').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var modal = document.getElementById('previewModal');
      if (modal) { modal.style.display = 'none'; }
    });
  });

  // Edit section from preview
  document.querySelectorAll('.btn-edit-section').forEach(function(btn) { 
    //console.log(bootstrap);
    btn.addEventListener('click', function() {
      var step = parseInt(this.getAttribute('data-step'), 10) || 1;
        const modal = document.getElementById('previewModal');

    modal.classList.remove('show');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');

    document.querySelectorAll('.modal-backdrop')
      .forEach(el => el.remove());
      if (window.gotoStep) window.gotoStep(`${step}`-1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
   
  const txtPat = document.getElementById('txtPAT');
  if(txtPat){
    txtPat.addEventListener('input', function () {

        const pat = parseFloat(this.value) || 0;
        const dividend = (pat * 30) / 100;

        document.getElementById('txtDividendPayable').value = dividend.toFixed(2);

    });
  }

document.addEventListener('DOMContentLoaded', function () {

    const txtPAT = document.getElementById('txtPAT');
    const txtDividendPayable = document.getElementById('txtDividendPayable');

    function calculateDividend() {
        let pat = parseFloat(txtPAT.value) || 0;

        let dividend = (pat * 30) / 100;

        txtDividendPayable.value = dividend.toFixed(2);
    }

    txtPAT.addEventListener('input', calculateDividend);

    // Calculate on page load if PAT already has a value
    calculateDividend();
});
  // Send for approval handler
  function handleSendForApproval() {
    var csrfToken = document.querySelector('[name="csrf-token"]')?.getAttribute('content');
    var psu_mstr_id = document.getElementById('psu_mstr_id')?.value;
    if (!psu_mstr_id) return alert('Please save the form first.');
    fetch('/psu/send-for-approval', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'CSRF-Token': csrfToken },
      body: JSON.stringify({ psu_mstr_id: psu_mstr_id })
    })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data && data.success) {
          alert(data.message || 'Sent for approval');
          location.reload();
        } else {
          alert((data && data.message) || 'Failed to send for approval');
        }
      })
      .catch(function() { alert('Error sending for approval.'); });
  }

  var sendBtn = document.getElementById('btnSendForApproval');
  var modalSendBtn = document.getElementById('modalSendForApproval');
  if (sendBtn) sendBtn.addEventListener('click', handleSendForApproval);
  if (modalSendBtn) modalSendBtn.addEventListener('click', handleSendForApproval);
});

document.addEventListener("click", async function (e) {

  if (e.target.classList.contains("view-transation")) {

    const id = e.target.dataset.id;
    const modalElement = document.getElementById("dynamicViewModal");
    const modalContent = document.getElementById("modalContent");

    if (!modalElement) return;

    const modal = new bootstrap.Modal(modalElement);

    modalContent.innerHTML = "Loading...";

    try {
      const response = await fetch(`/dept/transaction-history/${id}`);
      const html = await response.text();

      modalContent.innerHTML = html;
      modal.show();

    } catch (err) {
      modalContent.innerHTML = "Error loading data";
      modal.show();
    }
  }
});

// --- Step Navigation (IIFE to avoid global conflicts) ---
(function () {
  var currentStep = 1;
  var totalSteps = 6;

  function showStep(step) {

    for (var i = 1; i <= totalSteps; i++) {
      var content = document.getElementById('step-content-' + i);
      if (content) content.style.display = (i === step) ? 'block' : 'none';
      var indicator = document.getElementById('step-indicator-' + i);
      if (indicator) {
        indicator.classList.remove('active', 'completed');
        if (i < step) indicator.classList.add('completed');
        else if (i === step) indicator.classList.add('active');
      }
    }
    currentStep = step;
  }

  window.gotoStep = function (step) {
    if (typeof step !== 'number') return;
    showStep(step);
  };

  showStep(currentStep);

  document.getElementById('nextStep1')?.addEventListener('click', function() { showStep(++currentStep); });
  document.getElementById('nextStep2')?.addEventListener('click', function() { showStep(++currentStep); });
  document.getElementById('nextStep3')?.addEventListener('click', function() { showStep(++currentStep); });
  document.getElementById('nextStep4')?.addEventListener('click', function() { showStep(++currentStep); });
  document.getElementById('nextStep5')?.addEventListener('click', function() { showStep(++currentStep); });

  document.getElementById('prevStep2')?.addEventListener('click', function() { showStep(--currentStep); });
  document.getElementById('prevStep3')?.addEventListener('click', function() { showStep(--currentStep); });
  document.getElementById('prevStep4')?.addEventListener('click', function() { showStep(--currentStep); });
  document.getElementById('prevStep5')?.addEventListener('click', function() { showStep(--currentStep); });
  document.getElementById('prevStep6')?.addEventListener('click', function() { showStep(--currentStep); });
})();