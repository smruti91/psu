document.addEventListener("DOMContentLoaded", function () {
    const reportBtn = document.getElementById('generateReportBtn');
    
    if(reportBtn){
    reportBtn.addEventListener('click', async function () {
        console.log(123);
        const finYr = document.getElementById('SelectFinYear').value; 
        const dmdNo = document.getElementById('SelectDmdNo').value;
        const psuId = document.getElementById('SelectPsu').value;

    // if (!finYr) return;

        const res = await fetch(`/finance/report?finYr=${finYr}&dmdNo=${dmdNo}&psuId=${psuId}`);
        const data = await res.json();
        console.log(data);
        renderReport(data);


        document.getElementById('downloadBtns').classList.remove('d-none');
    });
}
});

document.getElementById('SelectDmdNo').addEventListener('click', async function () {
    const dmdNo = this.value;
    console.log(`Selected DmdNo: ${dmdNo}`);
    if (!dmdNo) return;
    // Fetch PSU names for the depended drop down
    const res = await fetch(`/finance/psu-names?dmdNo=${dmdNo}`);
    const data = await res.json();
    const psuNameSelect = document.getElementById('psuList');
    psuNameSelect.innerHTML = '<option value="">Select PSU Name</option>';
    data.PsuNames.forEach(psu => {
        const option = document.createElement('option');
        option.value = psu.id;
        option.textContent = psu.Psu_Name;
        psuNameSelect.appendChild(option);
    }); 
});

function renderReport(data) {
    if (!data || data.length === 0) {
        document.getElementById('reportDiv').innerHTML = '<div class="alert alert-warning mt-3">No data found for the selected criteria.</div>';
        return;
    }
    let html = `<table class="table table-bordered mt-3">
        <thead class="table-dark">
            <tr>
                <th>Sl.No</th>
                <th style="width: 100px;">PSU Name</th>
                <th>Authorized Capital</th>
                <th>Paid-up Capital</th>
                <th>Govt Contribution</th>
                <th>PAT</th>
                <th>Dividend Paid</th>
                <th>Financial Year</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>`;

    data.forEach((row, i) => {
        html += `<tr>
            <td>${i + 1}</td>
            <td style="width: 100px;">${row.Psu_Name}</td>
            <td>${row.Auth_Share_Capital}</td>
            <td>${row.Paid_Share_Capital}</td>
            <td>${row.Govt_Contri_Amt}</td>
            <td>${row.PAT}</td>
            <td>${row.Dividend_Paid}</td>
            <td>${row.FinYr || ''}</td>
            <td>
             <button class="btn btn-sm btn-primary btn-view view-btn" data-id="${row.id}">
                      View
            </button>
            <button class="btn btn-sm btn-warning view-transation" data-id="${row.id}">
                     Transaction
            </button>
            </td>
        </tr>`;
    });

    html += `</tbody></table>`;

    document.getElementById('reportDiv').innerHTML = html;
}

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

function getParams() {
    const finYr = document.getElementById('SelectFinYear').value;
    const dmdNo = document.getElementById('SelectDmdNo').value;
    const psuId = document.getElementById('SelectPsu').value;

    const params = new URLSearchParams({
      finYr,
      dmdNo,
      psuId
    });

    return params.toString();
  }

  document.getElementById('downloadExcel').onclick = () => {
    window.location.href = `/psu/report/excel?${getParams()}`;
  };

  document.getElementById('downloadPdf').onclick = () => {
    window.location.href = `/psu/report/pdf?${getParams()}`;
  };

  function loadFinancialYears() {

    const from = document.getElementById("fromYear");
    const to = document.getElementById("toYear");

    const currentYear = new Date().getFullYear();

    for(let year = 2020; year <= currentYear; year++){

        from.innerHTML += `<option value="${year}">${year}</option>`;
        to.innerHTML += `<option value="${year}">${year}</option>`;

    }

}

  document.addEventListener('DOMContentLoaded', () => {
     loadFinancialYears();
    const btn = document.getElementById('generateFinReportBtn');

    btn.addEventListener('click', loadFinReport);

});

async function loadFinReport() {
const excelBtn = document.getElementById('exportReportExcelBtn');
    if (excelBtn) {
        excelBtn.classList.remove('d-none');
    }
    try {

        const dmdNo = document.getElementById('SelectDmdNo').value;
        const psuId = document.getElementById('SelectPsu').value;

        const fromYear = document.getElementById("fromYear").value;
        const toYear = document.getElementById("toYear").value;

        const response = await fetch(
        `/finance/finyear-report?dmdNo=${dmdNo}&psuId=${psuId}&fromYear=${fromYear}&toYear=${toYear}`
        );

        const data = await response.json();

        renderFinReport(data);

    } catch (err) {

        console.log(err);

        document.getElementById('reportDiv').innerHTML =
            '<div class="alert alert-danger">Error loading report</div>';
    }
}

function renderFinReport(data) {

    if (!data.length) {

        document.getElementById('reportDiv').innerHTML =
            '<div class="alert alert-warning">No records found.</div>';

        return;
    }

    /*
    ===================================
    Get Unique Financial Years
    ===================================
    */

    const years = [...new Set(data.map(x => x.FinYr))]
        .sort();

    /*
    ===================================
    Group By PSU
    ===================================
    */

    const psuData = {};

    data.forEach(row => {

        if (!psuData[row.psu_id]) {

            psuData[row.psu_id] = {

                psu_name: row.Psu_Name,

                years: {}
            };
        }

        psuData[row.psu_id].years[row.FinYr] = {

            govt: row.Govt_Contri_Amt,
            pat: row.PAT,
            dividend: row.Dividend_Paid,
            dividend_payable: row.Dividend_Payable
        };
    });

    /*
    ===================================
    Header Row 1
    ===================================
    */

    let html = `
    <div class="table-responsive">
    <table id="reportTable" class="table table-bordered table-striped">

        <thead class="table-warning">

            <tr>

                <th rowspan="2"
                    class="align-middle text-center">
                    Sl No
                </th>

                <th rowspan="2"
                    class="align-middle text-center">
                    PSU Name
                </th>
    `;

    years.forEach(year => {

        html += `
            <th colspan="4"
                class="text-center ">
                ${year}
            </th>
        `;
    });

    html += `
            </tr>

            <tr>
    `;

    /*
    ===================================
    Header Row 2
    ===================================
    */

    years.forEach(() => {

        html += `
            <th class="text-center">
                Govt Contribution
            </th>

            <th class="text-center">
                PAT
            </th>

            <th class="text-center">
                Dividend Paid
            </th>
            <th class="text-center">
                Dividend Payable
            </th>   
        `;
    });

    html += `
            </tr>

        </thead>

        <tbody>

       
    `;

    /*
    ===================================
    Data Rows
    ===================================
    */

    let sl = 1;

    Object.values(psuData).forEach(psu => {

        html += `
            <tr>

                <td class="text-center">
                    ${sl++}
                </td>

                <td>
                    ${psu.psu_name}
                </td>
        `;

        years.forEach(year => {

            const row = psu.years[year] || {};

            html += `

                <td class="text-end">
                    ${row.govt ?? ''}
                </td>

                <td class="text-end">
                    ${row.pat ?? ''}
                </td>

                <td class="text-end">
                    ${row.dividend ?? ''}
                </td>
                <td class="text-end">
                    ${row.dividend_payable ?? ''}
                </td>
            `;
        });

        html += `
            </tr>
        `;
    });

    html += `
        </tbody>

    </table>
    </div>
    `;

    document.getElementById('reportDiv').innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {

    console.log('Page Loaded');

    const exportBtn = document.getElementById('exportReportExcelBtn');

    if (exportBtn) {
        exportBtn.addEventListener('click', exportToExcel);
    }

});

function exportToExcel() {
    console.log(43436);
    const table = document.getElementById('reportTable');

    if (!table) {
        alert('Generate report first.');
        return;
    }

    const wb = XLSX.utils.table_to_book(
        table,
        {
            sheet: "PSU Report"
        }
    );

    XLSX.writeFile(
        wb,
        `PSU_Report_${new Date().getTime()}.xlsx`
    );
}
