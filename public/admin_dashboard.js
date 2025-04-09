import { auth } from "./firebase-config.js"; 
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    addDoc,
    Timestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ✅ Firebase Config (required to initialize app)
const firebaseConfig = {
    apiKey: "AIzaSyAT97uL0B3d3jF2ZIDVQnfxgWWYhfDO-QE",
    authDomain: "recharge-ba143.firebaseapp.com",
    projectId: "recharge-ba143",
    // other config keys if needed
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // ✅ THIS was missing!

// ✅ Protect Route
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "index.html";
    }
});

// ✅ Logout Handler
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

// ✅ Get Start/End of Today
function getTodayRange() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(start);
    end.setDate(start.getDate() + 1);
    return {
        start: Timestamp.fromDate(start),
        end: Timestamp.fromDate(end)
    };
}

// ✅ Fetch Bottles Inserted Today
async function fetchTodayBottleCount() {
    const { start, end } = getTodayRange();
    const bottlesRef = collection(db, "bottles");
    const q = query(bottlesRef, where("timestamp", ">=", start), where("timestamp", "<", end));

    try {
        const snapshot = await getDocs(q);
        const count = snapshot.size;

        const bottleDisplay = document.querySelector(".bottles-content h1");
        if (bottleDisplay) {
            bottleDisplay.innerHTML = `${count} <span>total</span>`;
        }

        const statusDiv = document.querySelector(".status-button");
        if (statusDiv) {
            if (count >= 100) {
                statusDiv.textContent = "Full";
                statusDiv.classList.add("full");
            } else {
                statusDiv.textContent = "Available";
                statusDiv.classList.remove("full");
            }
        }

        const dateSpan = document.querySelector(".bottles .date");
        if (dateSpan) {
            const today = new Date();
            const options = { month: 'long', day: 'numeric', year: 'numeric' };
            dateSpan.textContent = "As of " + today.toLocaleDateString(undefined, options);
        }
    } catch (err) {
        console.error("Error fetching bottles:", err);
    }
}

// ✅ OPTIONAL: Log Bottle Insertion (Call this when bottle is inserted)
async function logBottleInsertion(station = "Station 1") {
    try {
        await addDoc(collection(db, "bottles"), {
            timestamp: Timestamp.now(),
            station: station
        });
        console.log("Bottle logged!");
        fetchTodayBottleCount(); // Update dashboard immediately
    } catch (error) {
        console.error("Error logging bottle:", error);
    }
}

// ✅ Run on Load
document.addEventListener("DOMContentLoaded", () => {
    fetchTodayBottleCount();
    // logBottleInsertion("Station 1");
});

// Placeholder for status update
document.getElementById('update-status')?.addEventListener('click', function () {
    console.log('Updating machine status');
});
