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

      if (confirm("Are you sure you want to approve this record?")) {

        fetch(`/dept/approve/${id}`, {
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

});
