import { auth, db } from "./firebase-config.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, updateDoc, setDoc, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const userNameSpan = document.getElementById("user-name");
const totalBottlesSpan = document.getElementById("total-bottles");
const currentStationSpan = document.getElementById("current-station");
const chargingTimeSpan = document.getElementById("charging-time");

let currentUserId = null;
let userBottleCount = 0;
let currentStation = null;

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

            // Listen to Station assignment from RTDB
            const rtdb = getDatabase();
            const station1Ref = ref(rtdb, `stations/1`);
            const station2Ref = ref(rtdb, `stations/2`);
            const station3Ref = ref(rtdb, `stations/3`);

            // Check which station the user is assigned to
            onValue(station1Ref, (snapshot) => {
                const stationData = snapshot.val();
                if (stationData && stationData.userID === currentUserId) {
                    currentStation = "Station 1";
                    currentStationSpan.textContent = currentStation;
                    console.log("Assigned to Station 1");

                    // Fetch timeLeft for this station
                    const chargingTimeRef = ref(rtdb, `stations/1/timeLeft`);
                    onValue(chargingTimeRef, (snapshot) => {
                        const chargingTimeLeft = snapshot.val();
                        if (chargingTimeLeft !== null) {
                            const minutes = Math.floor(chargingTimeLeft / 60);
                            const seconds = chargingTimeLeft % 60;
                            chargingTimeSpan.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                        }
                    });
                }
            });

            onValue(station2Ref, (snapshot) => {
                const stationData = snapshot.val();
                if (stationData && stationData.userID === currentUserId) {
                    currentStation = "Station 2";
                    currentStationSpan.textContent = currentStation;
                    console.log("Assigned to Station 2");

                    // Fetch timeLeft for this station
                    const chargingTimeRef = ref(rtdb, `stations/2/timeLeft`);
                    onValue(chargingTimeRef, (snapshot) => {
                        const chargingTimeLeft = snapshot.val();
                        if (chargingTimeLeft !== null) {
                            const minutes = Math.floor(chargingTimeLeft / 60);
                            const seconds = chargingTimeLeft % 60;
                            chargingTimeSpan.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                        }
                    });
                }
            });

            onValue(station3Ref, (snapshot) => {
                const stationData = snapshot.val();
                if (stationData && stationData.userID === currentUserId) {
                    currentStation = "Station 3";
                    currentStationSpan.textContent = currentStation;
                    console.log("Assigned to Station 3");

                    // Fetch timeLeft for this station
                    const chargingTimeRef = ref(rtdb, `stations/3/timeLeft`);
                    onValue(chargingTimeRef, (snapshot) => {
                        const chargingTimeLeft = snapshot.val();
                        if (chargingTimeLeft !== null) {
                            const minutes = Math.floor(chargingTimeLeft / 60);
                            const seconds = chargingTimeLeft % 60;
                            chargingTimeSpan.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                        }
                    });
                }
            });

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
