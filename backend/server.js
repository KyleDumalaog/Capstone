import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import admin from "firebase-admin";
import fs from "fs";

const serviceAccount = JSON.parse(fs.readFileSync("./serviceAccountKey.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/delete-user", async (req, res) => {
    const { uid } = req.body;
    console.log("🧹 Attempting to delete UID:", uid);
  
    try {
      await admin.auth().deleteUser(uid);
      console.log("✅ Deleted from Auth:", uid);
  
      await admin.firestore().doc(`users/${uid}`).delete();
      console.log("🗑️ Deleted from Firestore:", uid);
  
      res.send({ message: "User deleted successfully!" });
    } catch (error) {
      console.error("❌ Delete Error:", error);
      res.status(500).send({ error: error.message });
    }
  });
  

app.listen(3000, () => {
  console.log("🚀 Admin API running at http://localhost:3000");
});
