import { auth, db } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// Get reference to the username span
const userNameSpan = document.getElementById("user-name");

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "index.html"; // Redirect if not logged in
        return;
    }

    // Fetch user data from Firestore
    try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            userNameSpan.textContent = userData.name || "User"; // Display name or default to "User"
        } else {
            console.error("User document not found!");
            userNameSpan.textContent = "Unknown User";
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        userNameSpan.textContent = "Error Loading";
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
