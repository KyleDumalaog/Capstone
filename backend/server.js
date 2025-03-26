const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK (Ensure you have the service account key)
const serviceAccount = require("./serviceAccountKey.json"); // Change path if needed

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cors());
app.use(express.json()); // Enable JSON parsing

// 🔹 DELETE user from Firebase Authentication
app.post("/deleteUser", async (req, res) => {
    const { uid } = req.body;

    if (!uid) {
        return res.status(400).json({ error: "Missing UID" });
    }

    try {
        await admin.auth().deleteUser(uid);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔹 Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
