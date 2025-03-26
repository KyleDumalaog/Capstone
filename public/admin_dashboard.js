import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Redirect to login if not authenticated
        window.location.href = "index.html";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logout");

    if (logoutButton) {
        logoutButton.addEventListener("click", async (event) => {
            event.preventDefault(); // Prevent default link behavior

            try {
                await signOut(auth);
                alert("Logged out successfully!");

                // ✅ Store session expired message flag
                sessionStorage.setItem("sessionExpired", "true");

                // ✅ Clear user data
                localStorage.clear();
                sessionStorage.clear();

                // ✅ Redirect to login page
                window.location.href = "index.html";

                // ✅ Prevent user from going back
                setTimeout(() => {
                    window.history.pushState(null, "", window.location.href);
                }, 100);
            } catch (error) {
                console.error("Logout Error:", error.message);
                alert("Failed to log out. Try again!");
            }
        });
    } else {
        console.error("Logout button not found.");
    }
});

document.addEventListener('DOMContentLoaded', () => {
    checkUserAuthenticated(); // Ensure user is authenticated before running any script
});

// admin_dashboard.js (Admin Controls)
document.getElementById('update-status')?.addEventListener('click', function() {
    console.log('Updating machine status');
    // Update machine status in Supabase
});