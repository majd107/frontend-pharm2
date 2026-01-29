
document.getElementById("btn_change_password")
    .addEventListener("click", async function () {

        alert("Button clicked ");

        const currentPassword = document.getElementById("company_current_password").value;
        const newPassword = document.getElementById("company_password").value;
        const confirmPassword = document.getElementById("company_confirm_password").value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            alert("Please fill all password fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const res = await fetch("http://majd.shooubadvance.com/api/admin/changepassword", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + window.token,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword,
                new_password_confirmation: confirmPassword
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message);
            return;
        }

        alert("Password changed successfully ");
    });
