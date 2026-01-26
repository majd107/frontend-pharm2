document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("token");
    const queryParams = new URLSearchParams(window.location.search);
    const pharmacyId = queryParams.get("id");

    try {
        const response = await fetch(`https://backendpharm-production.up.railway.app/api/admin/details_pharmacy/${pharmacyId}`, {
            headers: {
                "Authorization": "Bearer " + token,
                "Accept": "application/json"
            }
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        const pharm = data.data;

        document.getElementById("pharm-name").innerText = pharm.name || "N/A";
        document.getElementById("pharm-location").innerText = pharm.location || "N/A";
        document.getElementById("pharm-profit").innerText = pharm.total_prof || 0;
        document.getElementById("pharm-sales").innerText = pharm.quantity_sales || 0;
        document.getElementById("pharm-number").innerText = pharm.number_of_medicines || 0;
        document.getElementById("pharm-capital").innerText = pharm.capital || 0;
        document.getElementById("pharm-sales-stock").innerText = pharm.quantity_sales || 0;

        const table = document.querySelector(".bills table");
        table.querySelectorAll("tr:not(:first-child)").forEach(row => row.remove());

        if (pharm.bills && pharm.bills.length > 0) {
            pharm.bills.forEach(bill => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td><input type="checkbox" class="bill-checkbox" data-id="${bill.id}"></td>
                    <td>${bill.code}</td>
                    <td>${bill.number_of_drugs}</td>
                    <td>${bill.total_price}</td>
                    <td><button class="download-btn" data-id="${bill.id}">Download</button></td>
                `;
                table.appendChild(row);
            });
        } else {
            const row = document.createElement("tr");
            row.innerHTML = `<td colspan="5" style="text-align:center;">No bills available</td>`;
            table.appendChild(row);
        }

        document.querySelectorAll(".download-btn").forEach(btn => {
            btn.addEventListener("click", () => fetchBillDetailsAndPrint(btn.dataset.id));
        });

    } catch (err) {
        console.error(err);
        alert("Error connecting to server");
    }

    try {
        const res = await fetch(`https://backendpharm-production.up.railway.app/api/admin/pharmacyProfit/${pharmacyId}`, {
            headers: {
                "Authorization": "Bearer " + token,
                "Accept": "application/json"
            }
        });
        const data = await res.json();

        const ctx = document.getElementById('profitChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'profit',
                    data: data.profits,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'profit' }
                    },
                    x: {
                        title: { display: true, text: 'month' }
                    }
                }
            }
        });
    } catch (err) {
        console.error(err);
    }

    document.getElementById("downloadAllBtn").addEventListener("click", printSelectedBills);
});

const token = localStorage.getItem("token");

function fetchBillDetailsAndPrint(billId) {
    fetch("https://backendpharm-production.up.railway.app/api/admin/getinfobill", {
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
                printBillPDF(data.bills[0]);
            } else {
                alert("Bill details not found.");
            }
        })
        .catch(err => console.error("Error fetching bill details:", err));
}

function printSelectedBills() {
    const selectedCheckboxes = document.querySelectorAll(".bill-checkbox:checked");

    if (selectedCheckboxes.length === 0) {
        alert("Please select at least one bill.");
        return;
    }

    const bills_id = Array.from(selectedCheckboxes).map(cb => cb.dataset.id);

    fetch("https://backendpharm-production.up.railway.app/api/admin/getinfobill", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ bills_id })
    })
        .then(res => res.json())
        .then(data => {
            if (data.bills && data.bills.length > 0) {
                data.bills.forEach(bill => printBillPDF(bill));
            } else {
                alert("No bill details found.");
            }
        })
        .catch(err => console.error("Error fetching selected bills:", err));
}

function printBillPDF(bill) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Bill Details", 10, 20);

    doc.setFontSize(12);
    doc.text(`Code: ${bill.code}`, 10, 40);
    doc.text(`Total Price: ${bill.total_price}`, 10, 50);
    doc.text(`Number of Drugs: ${bill.number_of_drugs}`, 10, 60);
    doc.text(`Pharmacy Name: ${bill.name_of_pharmacy || "N/A"}`, 10, 70);
    doc.text(`Drug Name: ${bill.name_of_drug || "N/A"}`, 10, 80);

    doc.save(`bill-${bill.code}.pdf`);
}
