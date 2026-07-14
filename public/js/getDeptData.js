document.addEventListener("DOMContentLoaded", function () {

  const cards = document.querySelectorAll(".card-click");

  cards.forEach(card => {
    card.addEventListener("click", function () {
      
      const type = this.getAttribute("data-type");

      document.getElementById("pendingTable").style.display = "none";
      document.getElementById("approvedTable").style.display = "none";
      document.getElementById("rejectedTable").style.display = "none";

      document.getElementById(type + "Table").style.display = "block";
    });
  });

   // APPROVE BUTTON
  document.querySelectorAll(".approve-btn").forEach(btn => {
    btn.addEventListener("click", function () {
    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute('content');
      const id = this.dataset.id;
    const page = window.location.pathname.split('/').pop();
//console.log(page);
      if (confirm("Are you sure you want to approve this record?")) {

        fetch(`/${page}/approve/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken
          }
        })
        .then(res => res.json())
        .then(data => {
          alert("Approved successfully");
          location.reload();
        });

      }
    });
  });


  // REJECT BUTTON
  document.querySelectorAll(".reject-btn").forEach(btn => {
    btn.addEventListener("click", function () {

      const id = this.dataset.id;
      const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute('content');
      const message = prompt("Enter rejection reason:");

      if (message && message.trim() !== "") {

        fetch(`/dept/reject/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken
          },
          body: JSON.stringify({ reason: message })
        })
        .then(res => res.json())
        .then(data => {
          alert("Rejected successfully");
          location.reload();
        });

      } else {
        alert("Rejection reason is required.");
      }

    });
  });


document.addEventListener("click", async function (e) {

  if (e.target.classList.contains("view-btn")) { 

    const id = e.target.dataset.id;
    const modalElement = document.getElementById("dynamicViewModal");
    const modalContent = document.getElementById("modalContent");

    if (!modalElement) return;

    const modal = new bootstrap.Modal(modalElement);

    modalContent.innerHTML = "Loading...";

    try {
      const response = await fetch(`/dept/year-details/${id}`);
      const html = await response.text();

      modalContent.innerHTML = html;
      modal.show();

    } catch (err) {
      modalContent.innerHTML = "Error loading data";
      modal.show();
    }
  }
});

document.querySelectorAll('.approveBtn').forEach(btn => {

    btn.addEventListener('click', function () {

        const profileId = this.dataset.id;

        Swal.fire({
            title: 'Approve PSU Profile?',
            text: 'This profile will move to the next approval stage.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Approve',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#198754'
        }).then((result) => {

            if(result.isConfirmed){

                approveProfile(profileId);

            }

        });

    });

});

document.querySelectorAll('.rejectBtn').forEach(btn => {

    btn.addEventListener('click', function () {

        const profileId = this.dataset.id;

        Swal.fire({
            title: 'Reject PSU Profile',
            input: 'textarea',
            inputLabel: 'Rejection Remarks',
            inputPlaceholder: 'Enter rejection remarks...',
            inputAttributes: {
                'aria-label': 'Enter rejection remarks'
            },
            showCancelButton: true,
            confirmButtonText: 'Reject',
            confirmButtonColor: '#dc3545',

            preConfirm: (remarks) => {

                if (!remarks) {

                    Swal.showValidationMessage(
                        'Remarks are required'
                    );

                }

                return remarks;

            }

        }).then((result) => {

            if(result.isConfirmed){

                rejectProfile(profileId,result.value);

            }

        });

    });

});

function approveProfile(profileId)
{
    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute('content');
    fetch('/dept/approve-profile', {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken
        },

        body: JSON.stringify({
            profileId
        })

    })
    .then(res => res.json())
    .then(data => {

        Swal.fire({
            icon: 'success',
            title: 'Approved',
            text: data.message
        }).then(() => {

            location.reload();

        });

    });
}

function rejectProfile(profileId, remarks)
{
    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute('content');
    fetch('/dept/reject-profile', {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken
        },

        body: JSON.stringify({
            profileId,
            remarks
        })

    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
        Swal.fire({
            icon: 'success',
            title: 'Rejected',
            text: data.message
        }).then(() => {

            //location.reload();

        });

    });
}

document.addEventListener('click', function (e) {
   // Find the closest element with the 'edit-field' class going upwards
    const button = e.target.closest('.edit-field');

    // If the click wasn't inside or on an edit button, ignore it
    if (!button) {
        return;
    }
   
    
   console.log(button)
    const table = button.dataset.table;
    const recordId = button.dataset.id;
    const psuMstrId = button.dataset.psumstrid;
    const field = button.dataset.field;
    const value = button.dataset.value;
    const fieldLabel = button.dataset.label;
console.log(psuMstrId)
    document.getElementById('tableName').value = table;
    document.getElementById('recordId').value = recordId;
    document.getElementById('fieldName').value = field;
    document.getElementById('psuMstrId').value = psuMstrId;
    document.getElementById('fieldLabel').innerText = fieldLabel;
    document.getElementById('newValue').value = value;

    $('#editModal').modal('show');
});

document.addEventListener('click', async function (e) {

    if (!e.target.matches('#btnSaveChange')) {
        return;
    }
  
    const payload = {
        table: document.getElementById('tableName').value,
        recordId: document.getElementById('recordId').value,
        field: document.getElementById('fieldName').value,
        psuMstrId: document.getElementById('psuMstrId').value,
        value: document.getElementById('newValue').value
    };

    try {
const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
        const response = await fetch('/dept/update-field', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': csrfToken
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.success) {

            alert('Updated Successfully');

            $('#editModal').modal('hide');

            location.reload();
        }

    } catch (error) {
        console.error(error);
        alert('Failed to update');
    }

});

});
