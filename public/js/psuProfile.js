const addBtn = document.getElementById('addProfileData');
if(addBtn){
  document.getElementById('addProfileData').addEventListener('click', function() {
    // Open the modal
    $('#profileDataModal').modal('show');
});
}


document.getElementById('profileDataForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
    
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
    if (!data.NameOf_Share_Holder) {
        isValid = false;
        errors.push('Name of Share Holder is required.');
    }

    if (!isValid) {
        alert(errors.join('\n'));
        return;
    }

    try {
        const csrfToken = data._csrf;
        
        // Use the original formData object to preserve File objects
        // We don't need to delete _csrf from 'data' because we are sending 'formData'
        
        const response = await fetch('/psu/psu-profile', {
            method: 'POST',
            headers: {
                'X-CSRF-Token': csrfToken // Pass security token in the header safely
            },
            body: formData // Send the FormData object directly to support file uploads
        });

        // Parse the JSON data from the response stream
        const responseData = await response.json();

        // Fetch doesn't throw on 4xx/5xx status codes, so we check response.ok manually
        if (!response.ok) {
            // Throwing a custom error object to catch it in the catch block below
            const errorObj = new Error('Server Error');
            errorObj.responseData = responseData; 
            throw errorObj;
        }

        if (responseData.success) {
            alert(responseData.message);
            $('#profileDataModal').modal('hide');
            form.reset();
            // Optionally reload page or update UI
            location.reload();
        }
    } catch (error) {
        console.error(error);
        
        // Extracting server-side validation error messages safely from fetch's result
        const errorMsg = error.responseData?.errors?.[0]?.msg || 'An error occurred while saving profile data.';
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

