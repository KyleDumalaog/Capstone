const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.assignUserRole = functions.auth.user().onCreate((user) => {
  const userEmail = user.email;
  if (userEmail.includes("admin")) {
    return admin.firestore().collection("admins").doc(user.uid).set({
      email: userEmail,
      role: "admin"
    });
  } else {
    return admin.firestore().collection("users").doc(user.uid).set({
      email: userEmail,
      role: "user",
      points: 0,
      bottlesInserted: 0
    });
  }
});
