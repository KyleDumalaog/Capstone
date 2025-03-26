import { auth, signOut } from "./firebase-auth.js";
import { db } from "./firebase-config.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
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

async function checkUserAuthenticated() {
    const { data: user, error } = await supabase.auth.getUser();

    if (error || !user) {
        console.log("User not authenticated. Redirecting...");
        if (window.location.pathname !== "/index.html") {
            window.location.href = "index.html";
        }
    }
}

async function updateUserRole(userId, newRole) {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            role: newRole
        });

        console.log(`User ${userId} is now a ${newRole}!`);
        alert(`User updated to ${newRole}`);
    } catch (error) {
        console.error("Error updating user role:", error);
    }
}

// Example: Promote a user to admin
// updateUserRole("UID_12345", "admin");
