// --- Step 2: Balance Sheet --- 
document.addEventListener('DOMContentLoaded', function () {
  var form2 = document.getElementById('psuFormBalanceSheet');
  if (!form2) return;
  form2.addEventListener('submit', function (e) {
    e.preventDefault();
    var errorDiv = document.getElementById('psuFormBalanceSheetErrors');
    var successDiv = document.getElementById('psuFormBalanceSheetSuccess');
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    var hasError = false;
    function setFieldError(id, msg) {
      var errDiv = document.getElementById('error_' + id);
      if (errDiv) {
        errDiv.textContent = msg;
        errDiv.style.display = 'block';
      }
      if (form2[id]) form2[id].classList.add('is-invalid');
      hasError = true;
    }
    function isEmpty(id) { return !form2[id].value.trim(); }
    function isNumber(id) { return /^\d+(\.\d+)?$/.test(form2[id].value.trim()); }
    var fieldIds = ['tot_asset', 'tot_curr_asset', 'tot_liabilities', 'tot_curr_liabilities', 'tot_longterm_debt', 'tot_equity', 'inventory', 'acc_receivable', 'acc_payble'];
    fieldIds.forEach(function (id) { if (isEmpty(id) || !isNumber(id)) setFieldError(id, 'Required and must be a number.'); });
    if (hasError) return;
    let formData = new FormData(form2);
  
    let isUpdate = formData.get('balanceSheetId');
    let url = isUpdate ? '/psu/balance-sheet-update' : '/psu/balance-sheet';
    fetch(url, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } })
      .then(res => res.json())
      .then(data => {
        if (data.errors) errorDiv.innerHTML = data.errors.map(e => e.msg).join('<br>');
        else if (data.success) successDiv.innerHTML = data.message;
      })
      .catch(() => { errorDiv.innerHTML = 'Error submitting Balance Sheet.'; });
  });
});
let modal = new bootstrap.Modal(document.getElementById('previewModal'));
// Attach handlers for review/edit and send-for-approval
document.addEventListener('DOMContentLoaded', function () {
  // Edit section buttons
  document.querySelectorAll('.btn-edit-section').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
    
      modal.hide();
   
      var step = parseInt(this.getAttribute('data-step'), 10) || 1;
      if (window.gotoStep) window.gotoStep(step);
      // Scroll to top of form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Send for approval
  var sendBtn = document.getElementById('btnSendForApproval');
  
  if (sendBtn) {
    sendBtn.addEventListener('click', function () {
      const csrfToken = document.querySelector('[name="csrf-token"]').getAttribute("content");
      var psu_mstr_id = document.getElementById('psu_mstr_id') ? document.getElementById('psu_mstr_id').value : null;
      if (!psu_mstr_id) return alert('Please save the form first.');
      fetch('/psu/send-for-approval', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json','CSRF-Token': csrfToken },
        body: JSON.stringify({ psu_mstr_id: psu_mstr_id })
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data && data.success) {
            alert(data.message || 'Sent for approval');
            location.reload();
          } else {
            alert((data && data.message) || 'Failed to send for approval');
          }
        })
        .catch(function () { alert('Error sending for approval.'); });
    });
  }
});

// --- Step 3: Income Statement ---
document.addEventListener('DOMContentLoaded', function () {
  var form3 = document.getElementById('psuFormIncomeStatement');
  if (!form3) return;
  form3.addEventListener('submit', function (e) {
    e.preventDefault();
    var errorDiv = document.getElementById('psuFormIncomeStatementErrors');
    var successDiv = document.getElementById('psuFormIncomeStatementSuccess');
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    var hasError = false;
    function setFieldError(id, msg) {
      var errDiv = document.getElementById('error_' + id);
      if (errDiv) {
        errDiv.textContent = msg;
        errDiv.style.display = 'block';
      }
      if (form3[id]) form3[id].classList.add('is-invalid');
      hasError = true;
    }
    function isEmpty(id) { return !form3[id].value.trim(); }
    function isNumber(id) { return /^\d+(\.\d+)?$/.test(form3[id].value.trim()); }
    var fieldIds = ['tot_revenue', 'cost_ofgoods_sold', 'operating_expenses', 'tot_expenses', 'ebitda', 'depreciation', 'ebit_operating', 'int_expenses', 'tax_expenses', 'any_other_expenses', 'net_income'];
    fieldIds.forEach(function (id) { if (isEmpty(id) || !isNumber(id)) setFieldError(id, 'Required and must be a number.'); });
    if (hasError) return;
    var formData = new FormData(form3);
    var isUpdate = formData.get('incomeSheetId');
    var url = isUpdate ? '/psu/income-statement-update' : '/psu/income-statement';
    fetch(url, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } })
      .then(res => res.json())
      .then(data => {
        if (data.errors) errorDiv.innerHTML = data.errors.map(e => e.msg).join('<br>');
        else if (data.success) successDiv.innerHTML = data.message;
      })
      .catch(() => { errorDiv.innerHTML = 'Error submitting Income Statement.'; });
  });
});

// --- Step 4: Govt. Relationship ---
document.addEventListener('DOMContentLoaded', function () {
  var form4 = document.getElementById('psuFormGovtRel');
  if (!form4) return;
  form4.addEventListener('submit', function (e) {
    e.preventDefault();
    var errorDiv = document.getElementById('psuFormGovtRelErrors');
    var successDiv = document.getElementById('psuFormGovtRelSuccess');
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    var hasError = false;
    function setFieldError(id, msg) {
      var errDiv = document.getElementById('error_' + id);
      if (errDiv) {
        errDiv.textContent = msg;
        errDiv.style.display = 'block';
      }
      if (form4[id]) form4[id].classList.add('is-invalid');
      hasError = true;
    }
    function isEmpty(id) { return !form4[id].value.trim(); }
    function isNumber(id) { return /^\d+(\.\d+)?$/.test(form4[id].value.trim()); }
    var fieldIds = ['direct_bud_subsidies', 'tax_and_state_dues'];
    fieldIds.forEach(function (id) { if (isEmpty(id) || !isNumber(id)) setFieldError(id, 'Required and must be a number.'); });
    if (hasError) return;
    var formData = new FormData(form4);
    var isUpdate = formData.get('govtRelId');
    var url = isUpdate ? '/psu/govt-rel-update' : '/psu/govt-rel';
    fetch(url, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } })
      .then(res => res.json())
      .then(data => {
        if (data.errors) errorDiv.innerHTML = data.errors.map(e => e.msg).join('<br>');
        else if (data.success) successDiv.innerHTML = data.message;
      })
      .catch(() => { errorDiv.innerHTML = 'Error submitting Govt. Relationship.'; });
  });
});
// PSU Year Wise Data Form Validation and AJAX Submit
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('psuFormYearWiseData');
  console.log('Submitting form1:');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    // Clear all field errors

    var fieldIds = [
      'txtNameofPSU',
      'txtAuthorizedShareCap',
      'txtSubShareCap',
      'txtPaidUpShareCap',
      'txtGovtContribution',
      'txtNameofShareHolders',
      'txtProfitLoss',
      'txtPAT',
      'txtDividendPayable',
      'txtDividendpaid'
    ];
    fieldIds.forEach(function (id) {
      var errDiv = document.getElementById('error_' + id);
      if (errDiv) {
        errDiv.textContent = '';
        errDiv.style.display = 'none';
      }
      if (form[id]) form[id].classList.remove('is-invalid');
    });
    var errorDiv = document.getElementById('psuFormYearWiseDataErrors');
    var successDiv = document.getElementById('psuFormYearWiseDataSuccess');
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    // Client-side validation
    var hasError = false;
    function setFieldError(id, msg) {
      var errDiv = document.getElementById('error_' + id);
      if (errDiv) {
        errDiv.textContent = msg;
        errDiv.style.display = 'block';
      }
      if (form[id]) form[id].classList.add('is-invalid');
      hasError = true;
    }
    function isEmpty(id) {
      return !form[id].value.trim();
    }
    function isNumber(id) {
      return /^\d+(\.\d+)?$/.test(form[id].value.trim());
    }
    if (isEmpty('txtNameofPSU')) setFieldError('txtNameofPSU', 'Name of the PSU is required.');
    if (isEmpty('txtAuthorizedShareCap') || !isNumber('txtAuthorizedShareCap')) setFieldError('txtAuthorizedShareCap', 'Authorized Share Capital must be a number.');
    if (isEmpty('txtSubShareCap') || !isNumber('txtSubShareCap')) setFieldError('txtSubShareCap', 'Subscribed Share Capital must be a number.');
    if (isEmpty('txtPaidUpShareCap') || !isNumber('txtPaidUpShareCap')) setFieldError('txtPaidUpShareCap', 'Paid-up Share Capital must be a number.');
    if (isEmpty('txtGovtContribution') || !isNumber('txtGovtContribution')) setFieldError('txtGovtContribution', 'Govt. Contribution must be a number.');
    if (isEmpty('txtNameofShareHolders')) setFieldError('txtNameofShareHolders', 'Name of the Share Holders is required.');
    if (isEmpty('txtProfitLoss') || !isNumber('txtProfitLoss')) setFieldError('txtProfitLoss', 'Profit & Loss must be a number.');
    if (isEmpty('txtPAT') || !isNumber('txtPAT')) setFieldError('txtPAT', 'Profit After Tax (PAT) must be a number.');
    if (isEmpty('txtDividendPayable') || !isNumber('txtDividendPayable')) setFieldError('txtDividendPayable', 'Dividend Payable must be a number.');
    if (isEmpty('txtDividendpaid') || !isNumber('txtDividendpaid')) setFieldError('txtDividendpaid', 'Dividend Paid must be a number.');
    if (hasError) return;
    // AJAX submit
    var formData = new FormData(document.getElementById('psuFormYearWiseData'));
    var isUpdate = formData.get('yearWiseId');
    var url = isUpdate ? '/psu/year-wise-data-update' : '/psu/year-wise-data';
    fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log('Server response:', data);
        if (data.errors) {
          // Show server-side errors per field if possible
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
        }
      })
      .catch(() => {
        errorDiv.innerHTML = 'An error occurred while submitting the form.';
        errorDiv.style.display = 'block';
      });
  });

  document.querySelectorAll(".delete-btn").forEach(button => {
     const csrfToken = document.querySelector('[name="csrf-token"]').getAttribute("content");
     
        button.addEventListener("click", function () {
            const id = this.getAttribute("data-id");

            if (confirm("Are you sure you want to delete this file?")) {

                fetch('/psu/delete-challan-file', {
                    method: 'POST',
                     credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        'CSRF-Token': csrfToken
                    },
                    body: JSON.stringify({ id: id })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        location.reload();
                    }
                });

            }
        });
    });
  // --- Step 2: Balance Sheet ---
  var form2 = document.getElementById('psuFormBalanceSheet');
  if (form2) {
    form2.addEventListener('submit', function (e) {
      e.preventDefault();
      // Clear errors
      var fieldIds = [
        'txtTotalAssets', 'txtCurrentAssets', 'txtTotLiabilities', 'txtTotCurrLiabilities', 'txtTotalLongTermDebt', 'txtTotalequity', 'txtInvetory', 'txtAccountsReceivable', 'txtAccountsPayable'
      ];
      fieldIds.forEach(function (id) {
        var field = form2.querySelector('#' + id);
        if (field) field.classList.remove('is-invalid');
      });
      // Validation
      var hasError = false;
      function isNum(id) { return /^\d+(\.\d+)?$/.test(form2.querySelector('#' + id).value.trim()); }
      function isEmp(id) { return !form2.querySelector('#' + id).value.trim(); }
      if (isEmp('txtTotalAssets') || !isNum('txtTotalAssets')) { form2.querySelector('#txtTotalAssets').classList.add('is-invalid'); hasError = true; }
      if (isEmp('txtCurrentAssets') || !isNum('txtCurrentAssets')) { form2.querySelector('#txtCurrentAssets').classList.add('is-invalid'); hasError = true; }
      if (isEmp('txtTotLiabilities') || !isNum('txtTotLiabilities')) { form2.querySelector('#txtTotLiabilities').classList.add('is-invalid'); hasError = true; }
      if (isEmp('txtTotCurrLiabilities') || !isNum('txtTotCurrLiabilities')) { form2.querySelector('#txtTotCurrLiabilities').classList.add('is-invalid'); hasError = true; }
      if (isEmp('txtTotalLongTermDebt') || !isNum('txtTotalLongTermDebt')) { form2.querySelector('#txtTotalLongTermDebt').classList.add('is-invalid'); hasError = true; }
      if (isEmp('txtTotalequity') || !isNum('txtTotalequity')) { form2.querySelector('#txtTotalequity').classList.add('is-invalid'); hasError = true; }
      if (isEmp('txtInvetory') || !isNum('txtInvetory')) { form2.querySelector('#txtInvetory').classList.add('is-invalid'); hasError = true; }
      if (isEmp('txtAccountsReceivable') || !isNum('txtAccountsReceivable')) { form2.querySelector('#txtAccountsReceivable').classList.add('is-invalid'); hasError = true; }
      if (isEmp('txtAccountsPayable') || !isNum('txtAccountsPayable')) { form2.querySelector('#txtAccountsPayable').classList.add('is-invalid'); hasError = true; }
      if (hasError) return;
      // AJAX
      var formData = new FormData(form2);
      var isUpdate = form2.querySelector('#balanceSheetId');
      console.log(isUpdate);
      var url = isUpdate ? '/psu/balance-sheet-update' : '/psu/balance-sheet';
      fetch(url, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } })
        .then(res => res.json())
        .then(data => { if (data.success) alert(data.message); })
        .catch(() => { alert('Error submitting Balance Sheet'); });
    });
  }

  // --- Step 3: Income Statement ---
  var form3 = document.getElementById('psuFormIncomeStatement');
  if (form3) {
    form3.addEventListener('submit', function (e) {
      e.preventDefault();
      var fieldIds = [
        'txtTotRevenue', 'txtCostofGoodsSold', 'txtOprexpenses', 'txtTotalExpenses', 'txtEbitda', 'txtDepAmor', 'txtEbit', 'txtIntExpenses', 'txtTaxExpenses', 'txtAnyExpenses', 'txtNetIncome'
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
      fetch(url, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } })
        .then(res => res.json())
        .then(data => { if (data.success) alert(data.message); })
        .catch(() => { alert('Error submitting Income Statement'); });
    });
  }

  // --- Step 4: Govt. Relationship ---
  var form4 = document.getElementById('psuFormGovtRel');
  if (form4) {
    form4.addEventListener('submit', function (e) {
      e.preventDefault();
      var fieldIds = ['txtDirBudgetSub', 'txtTaxAndStateDues'];
      fieldIds.forEach(function (id) {
        var field = form4.querySelector('#' + id);
        if (field) field.classList.remove('is-invalid');
      });
      var hasError = false;
      function isNum(id) { return /^\d+(\.\d+)?$/.test(form4.querySelector('#' + id).value.trim()); }
      function isEmp(id) { return !form4.querySelector('#' + id).value.trim(); }
      if (isEmp('txtDirBudgetSub') || !isNum('txtDirBudgetSub')) { form4.querySelector('#txtDirBudgetSub').classList.add('is-invalid'); hasError = true; }
      if (isEmp('txtTaxAndStateDues') || !isNum('txtTaxAndStateDues')) { form4.querySelector('#txtTaxAndStateDues').classList.add('is-invalid'); hasError = true; }
      if (hasError) return;
      var formData = new FormData(form4);
      var isUpdate = form4.querySelector('#govtRelId');
      var url = isUpdate ? '/psu/govt-rel-update' : '/psu/govt-rel';
      fetch(url, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } })
        .then(res => res.json())
        .then(data => { if (data.success) alert(data.message); })
        .catch(() => { alert('Error submitting Govt. Relationship'); });
    });
  }
});

// PSU View Data Page Script

(function () {
  let currentStep = 1;
  const totalSteps = 5;
  function showStep(step) {
    for (let i = 1; i <= totalSteps; i++) {
      document.getElementById('step-content-' + i).style.display = (i === step) ? 'block' : 'none';
      const indicator = document.getElementById('step-indicator-' + i);
      indicator.classList.remove('active', 'completed');
      if (i < step) indicator.classList.add('completed');
      else if (i === step) indicator.classList.add('active');
    }
  }
  // expose a helper to navigate steps from other scripts/buttons
  window.gotoStep = function (step) {
    if (typeof step !== 'number') return;
    currentStep = step;
    showStep(step);
  };
  showStep(currentStep);
  document.getElementById('nextStep1').onclick = function () {
    console.log('Next Step 1 clicked');
    // TODO: AJAX save for step 1, then:
    showStep(++currentStep);
  };
  document.getElementById('nextStep2').onclick = function () {
    // TODO: AJAX save for step 2, then:
    showStep(++currentStep);
  };
  document.getElementById('nextStep3').onclick = function () {
    // TODO: AJAX save for step 3, then:
    showStep(++currentStep);
  };
  document.getElementById('nextStep4').onclick = function () {
    // TODO: AJAX save for step 4, then:
    showStep(++currentStep);
  };

  document.getElementById('prevStep2').onclick = function () { showStep(--currentStep); };
  document.getElementById('prevStep3').onclick = function () { showStep(--currentStep); };
  document.getElementById('prevStep4').onclick = function () { showStep(--currentStep); };
  document.getElementById('prevStep5').onclick = function () { showStep(--currentStep); };
})();

// --- Step 5: Annual Report Upload ---
document.addEventListener('DOMContentLoaded', function () {
  var form5 = document.getElementById('psuFormAnnualReportUpload');
  if (!form5) return;
  
  form5.addEventListener('submit', function (e) {
    e.preventDefault();
    
    var errorDiv = document.getElementById('psuFormUploadErrors');
    var successDiv = document.getElementById('psuFormUploadSuccess');
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    
    // Get file input
    var fileInput = document.getElementById('txtAnnualReport');
    
    // Validation
    if (!fileInput.files || !fileInput.files[0]) {
      errorDiv.innerHTML = 'Please select a PDF file to upload.';
      errorDiv.style.display = 'block';
      return;
    }
    
    var file = fileInput.files[0];
    
    // Validate file type
    if (file.type !== 'application/pdf') {
      errorDiv.innerHTML = 'Only PDF files are allowed.';
      errorDiv.style.display = 'block';
      return;
    }
    
    // Validate file size (max 5MB)
    var MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      errorDiv.innerHTML = 'File size should not exceed 5MB.';
      errorDiv.style.display = 'block';
      return;
    }
    
    // Submit form
    var formData = new FormData(form5);
    var isUpdate = formData.get('annualReportId');
    var url = isUpdate ? '/psu/annual-report-update' : '/psu/annual-report';
    
    fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          successDiv.innerHTML = data.message;
          successDiv.style.display = 'block';
          // Clear file input after successful upload
          setTimeout(() => {
            location.reload();
          }, 3000);
          fileInput.value = '';
        } else {
          errorDiv.innerHTML = data.message || 'Error uploading Annual Report.';
          errorDiv.style.display = 'block';
        }
      })
      .catch(err => {
        console.error('Error:', err);
        errorDiv.innerHTML = 'Error submitting Annual Report. Please try again.';
        errorDiv.style.display = 'block';
      });
  });
});

// show modal on click previewStep5 button 
 document.getElementById('previewStep5').addEventListener('click', function () {
  console.log('Preview Step 5 clicked');
   
   modal.show();
  });

// close modal on click close button
document.querySelectorAll('.close').forEach(function (btn) {
    btn.addEventListener('click', function () {
      let modal = document.getElementById('previewModal');
      if (modal) {
        modal.style.display = 'none';
      }
    });
  });
document.querySelectorAll(".delete-annual-report-btn").forEach(button => {
     const csrfToken = document.querySelector('[name="csrf-token"]').getAttribute("content");
     
        button.addEventListener("click", function () {
            const id = this.getAttribute("data-id");

            if (confirm("Are you sure you want to delete this file?")) {

                fetch('/psu/annual-report-delete', {
                    method: 'POST',
                     credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        'CSRF-Token': csrfToken
                    },
                    body: JSON.stringify({ id: id })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        location.reload();
                    }
                });

            }
        });
    });




// public/js/common.js
// public/js/common.js
// document.addEventListener("DOMContentLoaded", function () {

// ---------- Tab Component ----------
//   (function initTabs() {
//     const tablinks = document.querySelectorAll(".tab-link");
//     const tabcontent = document.querySelectorAll(".tab-content");

//     if (tablinks.length === 0 || tabcontent.length === 0) return;

//     function openTab(tabName, clickedBtn) {
//       tabcontent.forEach(content => (content.style.display = "none"));
//       tablinks.forEach(btn => btn.classList.remove("active"));
//       document.getElementById(tabName).style.display = "block";
//       clickedBtn.classList.add("active");
//     }

//     tablinks.forEach(btn => {
//       btn.addEventListener("click", function () {
//         const tabName = this.getAttribute("data-tab");
//         openTab(tabName, this);
//       });
//     });

//     // Show first tab by default
//     openTab(tablinks[0].getAttribute("data-tab"), tablinks[0]);
//   })();

//   // ---------- Sidebar Toggle ----------
//   (function initSidebar() {
//     const sidebarToggle = document.querySelector(".sidebar-toggle");
//     const sidebar = document.querySelector(".sidebar");

//     if (!sidebarToggle || !sidebar) return;

//     sidebarToggle.addEventListener("click", function () {
//       sidebar.classList.toggle("collapsed");
//     });
//   })();

//   // ---------- Example: Dropdowns ----------
//   (function initDropdowns() {
//     const dropdowns = document.querySelectorAll(".dropdown-toggle");

//     if (dropdowns.length === 0) return;

//     dropdowns.forEach(dropdown => {
//       dropdown.addEventListener("click", function () {
//         const menu = this.nextElementSibling;
//         if (menu) {
//           menu.classList.toggle("show");
//         }
//       });
//     });
//   })();

// });


