document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch("https://backendpharm-production.up.railway.app/api/pharmacy/notification", {
            headers: {
                "Authorization": "Bearer " + token,
                "Accept": "application/json"
            }
        });

        const data = await res.json();

        const container = document.querySelector(".messages");
        container.innerHTML = "";

        if (data.data && data.data.length > 0) {
            data.data.forEach(notification => {

                const div = document.createElement("div");
                div.classList.add("message");

                // إذا الإشعار غير مقروء → ضيف كلاس unread
                if (!notification.is_read) {
                    div.classList.add("unread");
                }

                div.innerHTML = `<p>${notification.message}</p>`;
                container.appendChild(div);
            });
        } else {
            container.innerHTML = `<div class="message"><p>No notifications available</p></div>`;
        }

    } catch (err) {
        console.error("Error fetching notifications:", err);
    }
});
document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("token");
    const readAllBtn = document.getElementById("readAllBtn");

    if (readAllBtn) {
        readAllBtn.addEventListener("click", async () => {
            try {
                await fetch("https://backendpharm-production.up.railway.app/api/pharmacy/notification_read", {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + token,
                        "Accept": "application/json"
                    }
                });

                const messages = document.querySelectorAll(".message");

                messages.forEach(msg => {
                    msg.classList.remove("unread");
                });

            } catch (error) {
                console.error("Error reading notifications:", error);
            }
        });
    }

});
