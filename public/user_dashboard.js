import { auth, db } from "./firebase-config.js"; 
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, updateDoc, setDoc, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const userNameSpan = document.getElementById("user-name");
const totalBottlesSpan = document.getElementById("total-bottles");

let currentUserId = null;
let userBottleCount = 0;

function getTodayDateString() {
    const today = new Date();
    return today.toISOString().split("T")[0];
}

async function refreshFirestoreBottleCount() {
    if (!currentUserId) return;
    try {
        const userRef = doc(db, "users", currentUserId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const data = userSnap.data();
            userBottleCount = data.totalBottlesInserted || 0;
            totalBottlesSpan.textContent = userBottleCount;
        }
    } catch (error) {
        console.error("Failed to refresh Firestore bottle count:", error);
    }
}

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    currentUserId = user.uid;

    try {
        const userRef = doc(db, "users", currentUserId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            userNameSpan.textContent = userData.name || "User";

            if (userData.totalBottlesInserted === undefined) {
                await updateDoc(userRef, { totalBottlesInserted: 0 });
                userBottleCount = 0;
            } else {
                userBottleCount = userData.totalBottlesInserted;
            }

            totalBottlesSpan.textContent = userBottleCount;

            // 🔁 Listen to Realtime DB objectCount
            const rtdb = getDatabase();
            const objectCountRef = ref(rtdb, "objectCount");

            onValue(objectCountRef, async (snapshot) => {
                const globalCount = snapshot.val();
                if (globalCount === null) return;

                const previousCount = parseInt(localStorage.getItem("prevGlobalObjectCount")) || 0;
                const delta = globalCount - previousCount;

                if (delta > 0) {
                    userBottleCount += delta;
                    totalBottlesSpan.textContent = userBottleCount;

                    try {
                        const userDocRef = doc(db, "users", currentUserId);
                        await updateDoc(userDocRef, {
                            totalBottlesInserted: userBottleCount,
                        });

                        const today = getTodayDateString();
                        const historyRef = doc(db, "users", currentUserId, "bottleHistory", today);
                        const historySnap = await getDoc(historyRef);

                        if (historySnap.exists()) {
                            await updateDoc(historyRef, {
                                count: increment(delta),
                                timestamp: new Date().toISOString(), // ✅ Optional, for latest timestamp
                            });
                        } else {
                            await setDoc(historyRef, {
                                count: delta,
                                timestamp: new Date().toISOString(), // ✅ Add this line
                            });
                            
                        }
                    } catch (error) {
                        console.error("Failed to update Firestore:", error);
                    }

                    localStorage.setItem("prevGlobalObjectCount", globalCount);
                }
            });

            // 🛠 Initialize prevGlobalObjectCount on first run
            if (!localStorage.getItem("prevGlobalObjectCount")) {
                const rtdb = getDatabase();
                const objectCountRef = ref(rtdb, "objectCount");
                onValue(objectCountRef, (snapshot) => {
                    const initialCount = snapshot.val();
                    if (initialCount !== null) {
                        localStorage.setItem("prevGlobalObjectCount", initialCount);
                    }
                }, { onlyOnce: true });
            }

            // 🔁 Periodically refresh Firestore count to reduce delay (every 5 seconds)
            setInterval(refreshFirestoreBottleCount, 5000);

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
