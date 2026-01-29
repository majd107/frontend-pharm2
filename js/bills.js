const token = localStorage.getItem("token");

function loadBills() {
    fetch("http://majd.shooubadvance.com/api/pharmacy/getinfo", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "Accept": "application/json"
        }
    })
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById("bills-body");
            tbody.innerHTML = "";

            if (!data.bills || data.bills.length === 0) {
                tbody.innerHTML = `<tr><td colspan="5">No bills found</td></tr>`;
                return;
            }

            data.bills.forEach(bill => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                <td><input type="checkbox" class="bill-checkbox" data-id="${bill.id}"></td>
                <td>${bill.code}</td>
                <td>${bill.number_of_drugs}</td>
                <td>${bill.total_price}</td>
                <td><button class="print-btn" data-id="${bill.id}" type="button">Print</button></td>
            `;
                tbody.appendChild(tr);
            });

            bindPrintButtons();

            const downloadBtn = document.getElementById("download_all");
            if (downloadBtn) {
                downloadBtn.onclick = printSelectedBills;
            }
        })
        .catch(err => console.error("Error fetching bills:", err));
}

function bindPrintButtons() {
    document.querySelectorAll(".print-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const billId = btn.dataset.id;
            fetchBillDetailsAndPrint(billId);
        });
    });
}

function fetchBillDetailsAndPrint(billId) {
    fetch("http://majd.shooubadvance.com/api/pharmacy/getinfobill", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ bills_id: [billId] })
    })
        .then(res => res.json())
        .then(data => {
            if (data.bills && data.bills.length > 0) {
                createPDF([data.bills[0]], `bill-${data.bills[0].code}.pdf`);
            } else {
                alert("Bill details not found.");
            }
        })
        .catch(err => console.error("Error fetching bill details:", err));
}

function printSelectedBills() {
    const selectedCheckboxes = document.querySelectorAll(".bill-checkbox:checked");
    console.log("Selected checkboxes:", selectedCheckboxes.length);

    if (selectedCheckboxes.length === 0) {
        alert("Please select at least one bill.");
        return;
    }

    const bills_id = Array.from(selectedCheckboxes).map(cb => cb.dataset.id);
    console.log("Bills IDs to fetch:", bills_id);
    alert(`Selected IDs: ${bills_id.join(", ")}`); 

    fetch("http://majd.shooubadvance.com/api/admin/getinfobill", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ bills_id })
    })
        .then(res => res.json())
        .then(data => {
            if (!data.bills || data.bills.length === 0) {
                alert("No bill details found.");
                return;
            }

            createPDF(data.bills, "selected-bills.pdf");
        })
        .catch(err => console.error("Error fetching selected bills:", err));
}

function createPDF(bills, filename) {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    bills.forEach((bill, index) => {
        if (index > 0) doc.addPage();
        drawBillOnPDF(doc, bill);
    });

    doc.save(filename);
}

function drawBillOnPDF(doc, bill) {
    doc.setFontSize(16);
    doc.text("Bill Details", 10, 20);

    doc.setFontSize(12);
    doc.text(`Code: ${bill.code}`, 10, 40);
    doc.text(`Total Price: ${bill.total_price}`, 10, 50);
    doc.text(`Number of Drugs: ${bill.number_of_drugs}`, 10, 60);
    doc.text(`Pharmacy Name: ${bill.name_of_pharmacy || "N/A"}`, 10, 70);
    doc.text(`Drug Name: ${bill.name_of_drug || "N/A"}`, 10, 80);
}

document.addEventListener("DOMContentLoaded", loadBills);
