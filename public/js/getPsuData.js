const finYearSelect = document.getElementById('finYearSelect');

if (finYearSelect) {
document.getElementById('finYearSelect').addEventListener('change', async function() {
    const dmdNo = document.getElementById('dmdNo').value;
    const psuName = document.getElementById('psuName').value;
    const finYr = this.value;
    console.log(`/psu/yearwise?dmdNo=${dmdNo}&psuName=${psuName}&finYr=${finYr}`);
    if (!finYr) return;
    // Fetch yearwise data
    const yearwiseRes = await fetch(`/psu/yearwise?dmdNo=${dmdNo}&psuName=${psuName}&finYr=${finYr}`);
    const yearwiseData = (await yearwiseRes.json()).YearWiseData;
    let yearwiseId = yearwiseData && yearwiseData.id;

    renderGrid('yearwiseGrid', yearwiseData, 'Yearwise Data');

    // Fetch balance sheet
    let balanceSheetData = null;
    let incomeSheetData = null;
    let govtRelData = null;
    if (yearwiseId) {
        const bsRes = await fetch(`/psu/balance-sheet?psu_mstr_id=${yearwiseId}`);
        
    balanceSheetData = (await bsRes.json()).balanceSheetData;
    //console.log(balanceSheetData);
    renderGrid('balanceSheetGrid', balanceSheetData, 'Balance Sheet');

    // Fetch Income Statement from correct endpoint
    const incRes = await fetch(`/psu/income-statement?psu_mstr_id=${yearwiseId}`);
    incomeSheetData = (await incRes.json()).IncomeSheetData;
    console.log(incomeSheetData);
    renderGrid('incomeSheetGrid', incomeSheetData, 'Income Statement');

        const govtRes = await fetch(`/psu/govt-rel?psu_mstr_id=${yearwiseId}`);
        govtRelData = (await govtRes.json()).govtRelData;
        renderGrid('govtRelGrid', govtRelData, 'Govt. Relationship');
    } else {
        renderGrid('balanceSheetGrid', null, 'Balance Sheet');
        renderGrid('incomeSheetGrid', null, 'Income Statement');
        renderGrid('govtRelGrid', null, 'Govt. Relationship');
    }
});
}
function renderGrid(gridId, data, title) {
    const grid = document.getElementById(gridId);
    if (!data) {
        grid.innerHTML = `<div class='psu-grid-section'><button class='psu-grid-toggle btn btn-sm btn-outline-primary mb-2'>${title} ▼</button><div class='psu-grid-content'><div class='alert alert-warning'>No data found.</div></div></div>`;
        addPsuGridStyle();
        return;
    }
    let html = `<div class='psu-grid-section'><button class='psu-grid-toggle btn btn-sm btn-outline-primary mb-2'>${title} ▼</button><div class='psu-grid-content'><table class='table table-bordered table-striped table-hover psu-grid-table'><tbody>`;
    let i = 0;
    for (const key in data) {
        console.log(key, data[key]);
        if (key === 'id') continue; // Skip id  fields
        html += `<tr class='${i % 2 === 0 ? "psu-row-even" : "psu-row-odd"}'><th class='psu-grid-key'>${key}</th><td class='psu-grid-value'>${data[key]}</td></tr>`;
        i++;
    }
    html += '</tbody></table></div></div>';
    grid.innerHTML = html;
    // Collapsible grid section
    const toggleBtn = grid.querySelector('.psu-grid-toggle');
    const contentDiv = grid.querySelector('.psu-grid-content');
    toggleBtn.addEventListener('click', function() {
        if (contentDiv.style.display === 'none') {
            contentDiv.style.display = '';
            toggleBtn.innerHTML = `${title} ▼`;
        } else {
            contentDiv.style.display = 'none';
            toggleBtn.innerHTML = `${title} ▲`;
        }
    });
    addPsuGridStyle();
}

function addPsuGridStyle() {
    if (document.getElementById('psuGridStyle')) return;
    const psuGridStyle = document.createElement('style');
    psuGridStyle.id = 'psuGridStyle';
    psuGridStyle.innerHTML = `
.psu-grid-section { margin-bottom: 2rem; border-radius: 8px; box-shadow: 0 2px 12px rgba(30,58,138,0.08); background: #fff; padding: 1rem; }
.psu-grid-toggle { font-weight: 600; letter-spacing: 1px; border-radius: 6px; }
.psu-grid-table { width: 100%; border-radius: 8px; overflow: hidden; }
.psu-row-even { background: #f8fafc; }
.psu-row-odd { background: #e0e7ef; }
.psu-grid-key { width: 40%; background: #1e3a8a; color: #fff; font-weight: 500; letter-spacing: 0.5px; }
.psu-grid-value { width: 60%; color: #222; font-weight: 400; }
.psu-grid-table tr:hover { background: #ffe6cc !important; transition: background 0.2s; }
@media (max-width: 768px) { .psu-grid-table th, .psu-grid-table td { font-size: 0.95rem; padding: 0.5rem; } }
`;
    document.head.appendChild(psuGridStyle);
}
document.addEventListener("DOMContentLoaded", function () {
document.getElementById('generateReportBtn').addEventListener('click', async function () {
    const finYr = document.getElementById('SelectFinYear').value;
    const dmdNo = document.getElementById('SelectDmdNo').value;
    const psuId = document.getElementById('SelectPsu').value;

   // if (!finYr) return;

    const res = await fetch(`/psu/report?finYr=${finYr}&dmdNo=${dmdNo}&psuId=${psuId}`);
    const data = await res.json();
    console.log(data);
    renderReport(data);


    document.getElementById('downloadBtns').classList.remove('d-none');
});
});

document.getElementById('profileDataForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const csrfToken =
      this.querySelector(
        'input[name="_csrf"]'
      ).value;

const payload = {
       _csrf: csrfToken,
      txtAuthorizedShareCap:
        document.getElementById('txtAuthorizedShareCap').value,

      txtSubscribedShareCap:
        document.getElementById('txtSubscribedShareCap').value,

      txtPaidupShareCap:
        document.getElementById('txtPaidupShareCap').value,

      selFinYr:
        document.getElementById('SelectFinYear').value,

      selDmdNo:
        document.getElementById('SelectDmdNo').value,
    psuId:
        document.getElementById('SelectPsu').value
    };

     const res = await fetch('/admin/save-profile-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    const result = await res.json();
    console.log(result);
        if (result.success) {   
        alert('Profile data saved successfully!');
        this.reset();
        document.getElementById('profileDataDiv').innerHTML = '';
    } else {
        alert('Failed to save profile data. Please try again.');
    }
});
 document.getElementById('addProfileData').addEventListener('click', async function () {
    let modal = new bootstrap.Modal(document.getElementById('profileDataModal'));
    modal.show();
}
);
/**
 * Renders a dynamic, reusable HTML table from an array of objects.
 * 
 * @param {Array<Object>} data - The dataset to render.
 * @param {Array<Object>} columns - Configuration for the columns.
 * @param {string} targetId - The ID of the container element.
 * @param {Object} [options] - Optional configurations.
 * @param {string} [options.tableClass="table table-bordered mt-3"] - CSS classes for the table.
 * @param {string} [options.theadClass="table-dark"] - CSS classes for the table header.
 * @param {string} [options.emptyMessage="No data found for the selected criteria."] - Message to show when data is empty.
 * @param {string} [options.emptyClass="alert alert-warning mt-3"] - CSS classes for the empty message container.
 */
function renderDynamicTable(data, columns, targetId, options = {}) {
    const container = document.getElementById(targetId);
    if (!container) {
        console.error(`Target container with ID "${targetId}" not found.`);
        return;
    }

    // Default configuration options
    const defaults = {
        tableClass: 'table table-bordered mt-3',
        theadClass: 'table-dark',
        emptyMessage: 'No data found for the selected criteria.',
        emptyClass: 'alert alert-warning mt-3'
    };
    const settings = { ...defaults, ...options };

    // Handle empty or missing data
    if (!data || data.length === 0) {
        container.innerHTML = `<div class="${settings.emptyClass}">${settings.emptyMessage}</div>`;
        return;
    }

    // Build Table Header
    let html = `<table class="${settings.tableClass}">
        <thead class="${settings.theadClass}">
            <tr>
                <th>Sl.No</th>`;
    
    columns.forEach(col => {
        const styleAttr = col.width ? ` style="width: ${col.width};"` : '';
        html += `<th${styleAttr}>${col.header}</th>`;
    });
    
    html += `</tr>
        </thead>
        <tbody>`;

    // Build Table Body
    data.forEach((row, i) => {
        html += `<tr>
            <td>${i + 1}</td>`;
        
        columns.forEach(col => {
            let cellValue = '';
            
            if (typeof col.render === 'function') {
                // If a custom render function is provided, use it
                cellValue = col.render(row, i);
            } else if (col.key) {
                // Otherwise, get the value directly by key
                const val = row[col.key];
                cellValue = (val !== undefined && val !== null) ? val : '';
            }
            
            html += `<td>${cellValue}</td>`;
        });
        
        html += `</tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}

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
        </tr>`;
    });

    html += `</tbody></table>`;

    document.getElementById('reportDiv').innerHTML = html;
}

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



