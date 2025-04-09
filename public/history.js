import { auth, db } from "./firebase-config.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔐 User Auth Check
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    try {
        const historyTable = document.getElementById("history-table");
        const historyRef = collection(db, "users", user.uid, "bottleHistory");
        const snapshot = await getDocs(historyRef);

        const entries = [];

        snapshot.forEach(doc => {
            const data = doc.data();
            const count = data.count || 0;
            const timestamp = data.timestamp || null;

            let fullDateTime = "N/A";
            if (timestamp) {
                const dateObj = new Date(timestamp);
                fullDateTime = dateObj.toLocaleString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                });
            }

            entries.push({ time: fullDateTime, count });
        });

        // Sort by timestamp (newest first)
        entries.sort((a, b) => new Date(b.time) - new Date(a.time));

        // Populate table
        entries.forEach(entry => {
            const row = document.createElement("tr");

            const timeCell = document.createElement("td");
            timeCell.textContent = entry.time;

            const countCell = document.createElement("td");
            countCell.textContent = entry.count;

            row.appendChild(timeCell);
            row.appendChild(countCell);

            historyTable.appendChild(row);
        });
    } catch (error) {
        console.error("Failed to fetch history:", error);
    }
});

// 🔌 Logout logic
document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logout");

    if (logoutButton) {
        logoutButton.addEventListener("click", async (event) => {
            event.preventDefault();

            try {
                await signOut(auth);
                alert("Logged out successfully!");
                sessionStorage.setItem("sessionExpired", "true");
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = "index.html";

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
