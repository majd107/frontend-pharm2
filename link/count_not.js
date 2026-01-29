document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    const counterSpan = document.querySelector(".not");

    if (!counterSpan) return;

    try {
        const res = await fetch("http://majd.shooubadvance.com/api/pharmacy/count_notification", {
            headers: {
                "Authorization": "Bearer " + token,
                "Accept": "application/json"
            }
        });

        const data = await res.json();

        const count = data.data;

        counterSpan.textContent = count;

        if (count == 0) {
            counterSpan.style.display = "none";
        } else {
            counterSpan.style.display = "inline-block";
        }

    } catch (err) {
        console.error("Error loading notification count:", err);
    }
});
