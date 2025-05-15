const express = require('express');
const admin = require('firebase-admin');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json());  // To parse incoming JSON requests

// Initialize Firebase Admin
admin.initializeApp();

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Recharge API Documentation',
      version: '1.0.0',
      description: 'API documentation for Bottle App',
    },
  },
  apis: ['./index.js'], // Path to the API doc
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Serve Swagger UI documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ==========================
// USER AUTHENTICATION (Login, Register, Reset Password)
// ==========================

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User Login
 *     description: User can login with email and password. Role determines the page.
 *     operationId: loginUser
 *     tags:
 *       - User Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successfully logged in.
 *       '401':
 *         description: Invalid credentials.
 *       '500':
 *         description: Internal server error.
 */
app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        res.status(200).send({ message: "Logged in successfully!", role: userRecord.customClaims?.role || "user" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: User Registration
 *     description: User can register with email and password. Role is set to 'user' by default. Email must be verified.
 *     operationId: registerUser
 *     tags:
 *       - User Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Successfully registered.
 *       '500':
 *         description: Internal server error.
 */
app.post("/auth/register", async (req, res) => {
    const { email, password } = req.body;
    try {
        const userRecord = await admin.auth().createUser({
            email,
            password,
            emailVerified: false,  // Email must be verified before login
        });
        const db = admin.firestore();
        await db.collection('users').doc(userRecord.uid).set({
            email,
            role: 'user',
            userId: userRecord.uid,  // Unique user ID auto-generated
            station: null, // For tracking selected station
            totalBottlesInserted: 0, // Initial total inserted bottles for the user
        });
        res.status(201).send({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset Password
 *     description: Send reset password link to user email.
 *     operationId: resetPassword
 *     tags:
 *       - User Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       '200':
 *         description: Password reset email sent.
 *       '500':
 *         description: Internal server error.
 */
app.post("/auth/reset-password", async (req, res) => {
    const { email } = req.body;
    try {
        await admin.auth().generatePasswordResetLink(email);
        res.status(200).send({ message: "Password reset email sent." });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// ==========================
// USER ROUTES
// ==========================

/**
 * @swagger
 * /user/dashboard:
 *   get:
 *     summary: Get User Dashboard Data
 *     description: Retrieves the user dashboard information like charging time left, total bottles inserted, etc.
 *     operationId: getUserDashboard
 *     tags:
 *       - User
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved dashboard data.
 *       '500':
 *         description: Internal server error.
 */
app.get("/user/dashboard", async (req, res) => {
    const userId = req.query.userId;
    const db = admin.firestore();
    try {
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            return res.status(404).send({ error: "User not found." });
        }

        const userData = userDoc.data();
        res.status(200).send({
            chargingTimeLeft: "30 minutes",  // This can be dynamically calculated
            totalBottlesInserted: userData.totalBottlesInserted || 0,
            pointsEarned: userData.pointsEarned || 0,
            machineStatus: "Active",
            stationStatus: userData.station || "Available"
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

/**
 * @swagger
 * /user/bottle-history:
 *   get:
 *     summary: Get User Bottle Insertion History
 *     description: Retrieves the list of bottles inserted by the user along with timestamps.
 *     operationId: getBottleHistory
 *     tags:
 *       - User
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved bottle history.
 *       '500':
 *         description: Internal server error.
 */
app.get("/user/bottle-history", async (req, res) => {
    const userId = req.query.userId;
    const db = admin.firestore();
    try {
        const bottleHistoryRef = db.collection('bottle_history').where('userId', '==', userId);
        const snapshot = await bottleHistoryRef.get();
        if (snapshot.empty) {
            return res.status(404).send({ error: "No bottle history found." });
        }

        let bottleHistory = [];
        snapshot.forEach(doc => {
            bottleHistory.push(doc.data());
        });

        res.status(200).send(bottleHistory);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

/**
 * @swagger
 * /user/reward-points:
 *   get:
 *     summary: Get User's Total Reward Points
 *     description: Retrieves the total reward points earned by the user.
 *     operationId: getUserRewardPoints
 *     tags:
 *       - User
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved user's reward points.
 *       '500':
 *         description: Internal server error.
 */
app.get("/user/reward-points", async (req, res) => {
    const userId = req.query.userId;
    const db = admin.firestore();
    try {
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            return res.status(404).send({ error: "User not found." });
        }

        const userData = userDoc.data();
        res.status(200).send({
            pointsEarned: userData.pointsEarned || 0, // Return the total points earned
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

/**
 * @swagger
 * /user/redeem-reward:
 *   post:
 *     summary: Redeem User Reward
 *     description: Allows the user to redeem a reward using their points.
 *     operationId: redeemReward
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - rewardId
 *             properties:
 *               userId:
 *                 type: string
 *               rewardId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Reward redeemed successfully.
 *       '400':
 *         description: Insufficient points to redeem the reward.
 *       '500':
 *         description: Internal server error.
 */
app.post("/user/redeem-reward", async (req, res) => {
    const { userId, rewardId } = req.body;
    const db = admin.firestore();
    
    try {
        // Retrieve user data
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            return res.status(404).send({ error: "User not found." });
        }

        const userData = userDoc.data();
        const userPoints = userData.pointsEarned || 0;

        // Retrieve reward data
        const rewardRef = db.collection('rewards').doc(rewardId);
        const rewardDoc = await rewardRef.get();
        if (!rewardDoc.exists) {
            return res.status(404).send({ error: "Reward not found." });
        }

        const rewardData = rewardDoc.data();
        const rewardPointsRequired = rewardData.pointsRequired;

        // Check if user has enough points
        if (userPoints < rewardPointsRequired) {
            return res.status(400).send({ error: "Insufficient points to redeem this reward." });
        }

        // Deduct the reward points and add reward to user's history
        await userRef.update({
            pointsEarned: userPoints - rewardPointsRequired
        });

        await userRef.update({
            rewardHistory: admin.firestore.FieldValue.arrayUnion({
                rewardId: rewardDoc.id,
                rewardName: rewardData.rewardName,
                redeemedAt: new Date().toISOString()
            })
        });

        res.status(200).send({ message: `Reward "${rewardData.rewardName}" redeemed successfully!` });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// ==========================
// ADMIN ROUTES
// ==========================

/**
 * @swagger
 * /admin/total-bottles:
 *   get:
 *     summary: Get Total Bottles Inserted by All Users
 *     description: Admin can view total bottles inserted by all users.
 *     operationId: getTotalBottles
 *     tags:
 *       - Admin
 *     responses:
 *       '200':
 *         description: Successfully retrieved total bottles inserted.
 *       '500':
 *         description: Internal server error.
 */
app.get("/admin/total-bottles", async (req, res) => {
    const db = admin.firestore();
    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.get();
        let totalBottles = 0;
        
        snapshot.forEach(doc => {
            const userData = doc.data();
            totalBottles += userData.totalBottlesInserted || 0;
        });

        res.status(200).send({ totalBottles });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

/**
 * @swagger
 * /admin/reset-bottle-count:
 *   post:
 *     summary: Reset Total Bottles Count
 *     description: Admin can reset the total bottles count to 0 after the bottles have been collected.
 *     operationId: resetBottleCount
 *     tags:
 *       - Admin
 *     responses:
 *       '200':
 *         description: Successfully reset the bottle count.
 *       '500':
 *         description: Internal server error.
 */
app.post("/admin/reset-bottle-count", async (req, res) => {
    const db = admin.firestore();
    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.get();
        
        snapshot.forEach(doc => {
            db.collection('users').doc(doc.id).update({
                totalBottlesInserted: 0
            });
        });

        res.status(200).send({ message: "Total bottle count reset to 0." });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// ==========================
// SUPER ADMIN ROUTES
// ==========================

/**
 * @swagger
 * /super-admin/add-user:
 *   post:
 *     summary: Add New User (Super Admin)
 *     description: Super Admin can add a user with email, name, and password.
 *     operationId: addUser
 *     tags:
 *       - Super Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '201':
 *         description: User created successfully.
 *       '500':
 *         description: Internal server error.
 */
app.post("/super-admin/add-user", async (req, res) => {
    const { email, name, password } = req.body;
    try {
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: name,
        });
        
        const db = admin.firestore();
        await db.collection('users').doc(userRecord.uid).set({
            name,
            email,
            role: 'user',  // Default role can be set here
            emailVerified: false,
        });

        res.status(201).send({ message: "User added successfully." });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

/**
 * @swagger
 * /super-admin/edit-user:
 *   put:
 *     summary: Edit User Information (Super Admin)
 *     description: Super Admin can edit user name, email verification, and role.
 *     operationId: editUser
 *     tags:
 *       - Super Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               name:
 *                 type: string
 *               verified:
 *                 type: boolean
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       '200':
 *         description: User updated successfully.
 *       '500':
 *         description: Internal server error.
 */
app.put("/super-admin/edit-user", async (req, res) => {
    const { email, name, verified, role } = req.body;
    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        await admin.auth().updateUser(userRecord.uid, {
            displayName: name,
            emailVerified: verified,
            customClaims: { role }
        });
        
        const db = admin.firestore();
        await db.collection('users').doc(userRecord.uid).update({
            name,
            email,
            role,
            emailVerified: verified,
        });

        res.status(200).send({ message: "User updated successfully." });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

/**
 * @swagger
 * /super-admin/delete-user:
 *   delete:
 *     summary: Delete User (Super Admin)
 *     description: Super Admin can delete a user.
 *     operationId: deleteUser
 *     tags:
 *       - Super Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       '200':
 *         description: User deleted successfully.
 *       '500':
 *         description: Internal server error.
 */
app.delete("/super-admin/delete-user", async (req, res) => {
    const { email } = req.body;
    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        await admin.auth().deleteUser(userRecord.uid);

        const db = admin.firestore();
        await db.collection('users').doc(userRecord.uid).delete();

        res.status(200).send({ message: "User deleted successfully." });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
