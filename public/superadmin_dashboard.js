import { auth, db } from "./firebase-config.js";
import { 
    collection, getDocs, getDoc, doc, updateDoc, deleteDoc, addDoc, setDoc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { 
    signOut, onAuthStateChanged, createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", async () => {
    const usersTable = document.getElementById("users-table");
    const editModal = document.getElementById("edit-modal");
    const closeModal = document.querySelector(".close");
    const saveUserBtn = document.getElementById("save-user-btn");
    const logoutButton = document.getElementById("logout");
    const closeAddUserModalBtn = document.querySelector(".close-add-user");
    const addUserModal = document.getElementById("addUserModal");

    if (closeAddUserModalBtn) {
        closeAddUserModalBtn.addEventListener("click", () => {
            addUserModal.style.display = "none";
        });
    } else {
        console.error("Close button not found!");
    }

    const refreshButton = document.getElementById("refresh-users-btn");

    document.getElementById("new-user-name").value = "";
    document.getElementById("new-user-email").value = "";
    document.getElementById("new-user-password").value = "";
    document.getElementById("new-user-role").value = "user";

    let currentEditingUserId = null;

    async function loadUsers() {
        console.log("🔄 Reloading user list...");
        usersTable.innerHTML = "";
        const querySnapshot = await getDocs(collection(db, "users"));

        querySnapshot.forEach((userDoc) => {
            const user = userDoc.data();
            const userId = userDoc.id;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${userId}</td>
                <td>${user.name || "-"}</td>
                <td>${user.email}</td>
                <td>${user.role || "user"}</td>
                <td>${user.verified ? "Yes" : "No"}</td>
                <td>
                    <button class="edit-user" data-id="${userId}">Edit</button>
                    <button class="delete-user" data-id="${userId}">Delete</button>
                </td>
            `;
            usersTable.appendChild(row);
        });

        attachEventListeners();
    }

    function attachEventListeners() {
        document.querySelectorAll(".edit-user").forEach(button => {
            button.addEventListener("click", async (event) => {
                currentEditingUserId = event.target.dataset.id;
                await openEditModal(currentEditingUserId);
            });
        });

        document.querySelectorAll(".delete-user").forEach(button => {
            button.addEventListener("click", async (event) => {
                const userId = event.target.dataset.id;

                if (confirm("Are you sure you want to delete this user?")) {
                    try {
                        console.log("🛑 Sending UID to backend for deletion:", userId); // ✅ Debug log

                        const response = await fetch("http://localhost:3000/delete-user", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ uid: userId })
                        });

                        const data = await response.json();
                        console.log("🧾 Response from server:", data); // ✅ Debug log

                        if (response.ok) {
                            alert("✅ User deleted successfully!");
                            loadUsers(); // Refresh table
                        } else {
                            alert("❌ Failed to delete: " + data.error);
                        }
                    } catch (err) {
                        console.error("❌ Delete error:", err);
                        alert("An error occurred while deleting user.");
                    }
                }
            });
        });
    }

    async function openEditModal(userId) {
        const userDoc = await getDoc(doc(db, "users", userId));
        
        if (userDoc.exists()) {
            const user = userDoc.data();
            document.getElementById("edit-name").value = user.name || "";
            document.getElementById("edit-role").value = user.role || "user";
            document.getElementById("edit-verified").checked = user.verified || false;
            editModal.style.display = "block";
        } else {
            alert("User not found.");
        }
    }

    saveUserBtn.addEventListener("click", async () => {
        if (!currentEditingUserId) return;

        const updatedData = {
            name: document.getElementById("edit-name").value,
            role: document.getElementById("edit-role").value,
            verified: document.getElementById("edit-verified").checked,
        };

        await updateDoc(doc(db, "users", currentEditingUserId), updatedData);
        editModal.style.display = "none";
        loadUsers();
    });

    closeModal.addEventListener("click", () => {
        editModal.style.display = "none";
    });

    document.getElementById("add-user-btn").addEventListener("click", async () => {
        const name = document.getElementById("new-user-name").value;
        const email = document.getElementById("new-user-email").value;
        const password = document.getElementById("new-user-password").value;
        const role = document.getElementById("new-user-role").value;

        if (!name || !email || !password) {
            alert("All fields are required!");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;

            await setDoc(doc(db, "users", userId), {
                name,
                email,
                role,
                verified: false,
                createdAt: serverTimestamp()
            });

            alert("User added successfully!");
            closeAddUserModal();
            document.getElementById("addUserForm").reset();
        } catch (error) {
            console.error("Error adding user:", error.message);
            alert(error.message);
        }
    });

    onAuthStateChanged(auth, (user) => {
        if (!user) {
            console.log("User not logged in! Redirecting...");
            window.location.href = "index.html";
        }
    });

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

    loadUsers();

    if (refreshButton) {
        refreshButton.addEventListener("click", () => {
            console.log("🔄 Refresh button clicked! Reloading users...");
            loadUsers();
        });
    } else {
        console.error("⚠ Refresh button not found in HTML!");
    }

    document.querySelector(".btn-primary").addEventListener("click", () => {
        console.log("Opening Add User Modal...");
        addUserModal.style.display = "flex";
    });

    if (closeAddUserModalBtn) {
        closeAddUserModalBtn.addEventListener("click", () => {
            console.log("Close button clicked!");
            closeAddUserModal();
        });
    } else {
        console.error("Close button for Add User modal not found!");
    }

    window.addEventListener("click", (event) => {
        if (event.target === addUserModal) {
            console.log("Clicked outside modal, closing...");
            closeAddUserModal();
        }
    });

    function closeAddUserModal() {
        console.log("Closing Add User Modal...");
        addUserModal.style.display = "none";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".more-btn").forEach((btn) => {
        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            let menu = this.nextElementSibling;
            menu.style.display = menu.style.display === "block" ? "none" : "block";
        });
    });

    document.addEventListener("click", () => {
        document.querySelectorAll(".actions-menu").forEach((menu) => {
            menu.style.display = "none";
        });
    });
});

window.onload = function () {
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.go(1);
    };

    if (sessionStorage.getItem("sessionExpired")) {
        sessionStorage.removeItem("sessionExpired");
        window.location.href = "index.html";
    }
};
