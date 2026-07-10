const addBtn = document.getElementById('addProfileData');
const editBtn = document.getElementById('editProfileDataBtn');
const profileModal = document.getElementById('profileDataModal');
const profileForm = document.getElementById('profileDataForm');
const previewTitle = document.getElementById('previewModalLabel');
const submitBtn = document.getElementById('profileSubmitBtn');

function setProfileModalMode(mode) {
  if (!previewTitle || !submitBtn) return;
  if (mode === 'edit') {
    previewTitle.textContent = 'Edit PSU Profile Data';
    submitBtn.textContent = 'Update';
  } else {
    previewTitle.textContent = 'Add PSU Profile Data';
    submitBtn.textContent = 'Submit';
  }
}

function populateProfileFormValuesFromPage() {
  if (!profileForm) return;
  const formElements = profileForm.elements;

  formElements['Auth_Share_Capital'].value = document.getElementById('authorizedShareCapValue')?.textContent.trim() || '';
  formElements['Sub_Share_Capital'].value = document.getElementById('subscribedShareCapValue')?.textContent.trim() || '';
  formElements['Paid_Share_Capital'].value = document.getElementById('paidupShareCapValue')?.textContent.trim() || '';
  formElements['Govt_Contri_Amt'].value = document.getElementById('govtContributionAmtValue')?.textContent.trim() || '';
  formElements['Govt_Contri_Percent'].value = document.getElementById('govtContributionPercentValue')?.textContent.trim() || '';
}

async function deleteExistingRocDocument() {
  const profileId = document.getElementById('profileId')?.value;
  const deleteBtn = document.getElementById('deleteRocDocumentBtn');

  if (!profileId || !deleteBtn) return;

  const confirmed = window.confirm('Delete the existing ROC document?');
  if (!confirmed) return;

  try {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';
    const response = await fetch('/psu/delete-roc-document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({ profile_id: profileId, _csrf: csrfToken })
    });
    const result = await response.json();

    if (result.success) {
      const container = document.getElementById('rocDocumentActions');
      if (container) {
        container.remove();
      }
      const uploadContainer = document.getElementById('rocUploadContainer');
      if (uploadContainer) {
        uploadContainer.style.display = 'block';
      }
      const fileInput = document.getElementById('roc_document');
      if (fileInput) {
        fileInput.value = '';
      }
    } else {
      alert(result.message || 'Unable to delete ROC document.');
    }
  } catch (error) {
    console.error('Error deleting ROC document:', error);
    alert('Unable to delete ROC document.');
  }
}

async function populateExistingShareholders(profileId) {
  const container = document.getElementById('shareholdersContainer');
  if (!container || !profileId) {
    ensureMinimumShareholderField();
    return;
  }

  try {
    const response = await fetch(`/psu/get-shareholders/${profileId}`);
    const data = await response.json();

    if (data.success && data.shareholders && data.shareholders.length > 0) {
      container.innerHTML = '';
      data.shareholders.forEach((shareholder) => {
        const newRow = document.createElement('div');
        newRow.className = 'shareholder-input-row row align-items-center mb-2';
        newRow.innerHTML = `
          <div class="col-md-2">
            <input type="text" class="form-control shareholder-slno text-dark" value="1" readonly>
          </div>
          <div class="col-md-6">
            <input type="text" class="form-control" name="shareholders[]" placeholder="Name of the Share Holder" value="${shareholder.shareholder_name || ''}">
          </div>
          <div class="col-md-3">
            <input type="number" class="form-control" name="shareholder_percent[]" placeholder="Share %" min="0" max="100" step="0.01" value="${shareholder.shareholder_percent ?? ''}">
          </div>
          <div class="col-md-1">
            <button type="button" class="btn btn-danger btn-sm remove-shareholder-btn">✕</button>
          </div>`;
        container.appendChild(newRow);
        newRow.querySelector('.remove-shareholder-btn').addEventListener('click', function() {
          newRow.remove();
          updateSerialNumbers();
        });
      });
      updateSerialNumbers();
    } else {
      ensureMinimumShareholderField();
    }
  } catch (error) {
    console.error('Error fetching shareholders:', error);
    ensureMinimumShareholderField();
  }
}

async function openProfileModal(mode = 'add') {
  setProfileModalMode(mode);

  if (profileForm) {
    if (mode === 'edit') {
      populateProfileFormValuesFromPage();
    } else {
      profileForm.reset();
      const hiddenProfileId = document.getElementById('profileId');
      if (hiddenProfileId) {
        hiddenProfileId.value = hiddenProfileId.defaultValue || '';
      }
    }
  }

  const profileId = document.getElementById('profileId')?.value;
  if (mode === 'edit') {
    await populateExistingShareholders(profileId);
  } else {
    ensureMinimumShareholderField();
  }

  $(profileModal).modal('show');
}

if(addBtn){
  addBtn.addEventListener('click', async function(e) {
    e.preventDefault();
    await openProfileModal('add');
  });
}

if(editBtn){
  editBtn.addEventListener('click', async function(e) {
    e.preventDefault();
    await openProfileModal('edit');
  });
}

document.addEventListener('click', function (event) {
  if (event.target && event.target.id === 'deleteRocDocumentBtn') {
    event.preventDefault();
    deleteExistingRocDocument();
  }
});

// Helper function to ensure there's at least one shareholder input field
function ensureMinimumShareholderField() {
  const container = document.getElementById('shareholdersContainer');
  const existingInputs = container.querySelectorAll('input[name="shareholders[]"]');
  if (existingInputs.length === 0) {
    const newRow = document.createElement('div');
    newRow.className = 'shareholder-input-row d-flex align-items-center mb-2';
    newRow.innerHTML = '<input type="text" class="form-control" name="shareholders[]" placeholder="Name of the Share Holder" value=""><button type="button" class="btn btn-danger btn-sm ml-2 remove-shareholder-btn" title="Remove">✕</button>';
    container.appendChild(newRow);
    
    // Add remove handler
    newRow.querySelector('.remove-shareholder-btn').addEventListener('click', function() {
      container.removeChild(newRow);
    });
  }
}

// --- Shareholder Fields Management ---
document.addEventListener('DOMContentLoaded', function () {

    const container = document.getElementById('shareholdersContainer');
    const addBtn = document.getElementById('addShareholderBtn');

    function updateSerialNumbers() {
        document.querySelectorAll('.shareholder-slno').forEach((input, index) => {
            input.value = index + 1;
        });
    }

    addBtn.addEventListener('click', function () {

        const row = document.createElement('div');
        row.className = 'shareholder-input-row row align-items-center mb-2';

        row.innerHTML = `
            <div class="col-md-2">
                <input type="text" class="form-control shareholder-slno" readonly>
            </div>
            <div class="col-md-6">
                <input type="text" class="form-control"
                    name="shareholders[]"
                    placeholder="Name of the Share Holder">
            </div>
            <div class="col-md-3">
                <input type="number" class="form-control"
                    name="shareholder_percent[]"
                    placeholder="Share %"
                    min="0" max="100" step="0.01">
            </div>
            <div class="col-md-1">
                <button type="button"
                    class="btn btn-danger btn-sm remove-shareholder-btn">
                    ✕
                </button>
            </div>
        `;

        container.appendChild(row);

        row.querySelector('.remove-shareholder-btn').addEventListener('click', function () {
            row.remove();
            updateSerialNumbers();
        });

        updateSerialNumbers();
    });

    document.querySelectorAll('.remove-shareholder-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            this.closest('.shareholder-input-row').remove();
            updateSerialNumbers();
        });
    });

    updateSerialNumbers();


  // Remove shareholder button handlers
  document.querySelectorAll('.remove-shareholder-btn').forEach(function(button) {
    button.addEventListener('click', function() {
      var row = this.closest('.shareholder-input-row');
      if (row) row.remove();
    });
  });
});

    function calculateGovtContributionPercent() {
        let govtContribution = parseFloat(
            document.getElementById('txtGovtContribution').value.replace(/,/g, '')
        ) || 0;

        let paidUpShareCapital = parseFloat(
            document.getElementById('txtPaidupShareCap').value.replace(/,/g, '')
        ) || 0;

        let percentField = document.getElementById('txtGovtContributionPercent');

        if (paidUpShareCapital > 0) {
            let percent = (govtContribution / paidUpShareCapital) * 100;
            percentField.value = percent.toFixed(2);
        } else {
            percentField.value = '';
        }
    }

    document.getElementById('txtGovtContribution')
        .addEventListener('keyup', calculateGovtContributionPercent);

    document.getElementById('txtPaidupShareCap')
        .addEventListener('keyup', calculateGovtContributionPercent);

document.getElementById('profileDataForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Collect all shareholders from multiple inputs
    const shareholderInputs = form.querySelectorAll('input[name="shareholders[]"]');
    const shareholders = Array.from(shareholderInputs)
      .map(input => input.value.trim())
      .filter(value => value !== '');
    
    console.log(data);
    console.log('Shareholders:', shareholders);
    
    // Client-side validation
    let isValid = true;
    const errors = [];

    if (!data.dmd_no || isNaN(data.dmd_no)) {
        isValid = false;
        errors.push('DMD No is required and must be a number.');
    }
    if (!data.psu_id || isNaN(data.psu_id)) {
        isValid = false;
        errors.push('PSU ID is required and must be a number.');
    }
    if (!data.Auth_Share_Capital ) {
        isValid = false;
        errors.push('Authorized Share Capital is required.');
    }
    if (!data.Sub_Share_Capital ) {
        isValid = false;
        errors.push('Subscribed Share Capital is required.');
    }
    if (!data.Paid_Share_Capital) {
        isValid = false;
        errors.push('Paid Share Capital is required.');
    }
    if (!data.Govt_Contri_Amt ) {
        isValid = false;
        errors.push('Govt Contribution Amount is required.');
    }
    if (!data.Govt_Contri_Percent) {
        isValid = false;
        errors.push('Govt Contribution Percent is required.');
    }
    if (shareholders.length === 0) {
        isValid = false;
        errors.push('At least one Share Holder name is required.');
    }

    if (!isValid) {
        alert(errors.join('\n'));
        return;
    }

    try {
        const csrfToken = data._csrf;
        
        // Add shareholders array to formData
        formData.delete('shareholders[]');
        shareholders.forEach((shareholder, index) => {
          formData.append('shareholders[]', shareholder);
        });
        
        const response = await fetch('/psu/psu-profile', {
            method: 'POST',
            headers: {
                'X-CSRF-Token': csrfToken // Pass security token in the header safely
            },
            body: formData // Send the FormData object directly to support file uploads
        });

        // Parse the JSON data from the response stream
        const responseData = await response.json();
        console.log('Server Response:', responseData);
        // Fetch doesn't throw on 4xx/5xx status codes, so we check response.ok manually
        if (!response.ok) {
            // Throwing a custom error object to catch it in the catch block below
            const errorObj = new Error('Server Error');
           
            errorObj.responseData = responseData; 
            throw errorObj;
        }

        if (responseData.success) {
           // alert(responseData.message);
            $('#profileDataModal').modal('hide');
            form.reset();
            // Optionally reload page or update UI
          //  location.reload();
        }
    } catch (error) {
        console.log(error);
        
        // Extracting server-side validation error messages safely from fetch's result
        const errorMsg = error.responseData?.errors?.[0]?.msg || 'An error occurred while saving profile data.';
        console.error('Error saving profile data:', errorMsg);
        alert('Error: ' + errorMsg);
    }
});

const sendBtn = document.getElementById('sendApprovalBtn');
if(sendBtn){
document.getElementById('sendApprovalBtn').addEventListener('click', async function () {

    const psuprofile_id = this.dataset.id;
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

    try {
        const response = await fetch('/psu/profile-approval', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': csrfToken
            },
            body: JSON.stringify({
                psuprofile_id
            })
        });

        const result = await response.json();

        if(result.success){
            alert('Sent for approval successfully');
            location.reload();
        }

    } catch (err) {
        console.error(err);
    }
});
}

