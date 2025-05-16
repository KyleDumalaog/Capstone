// main.js

const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json());

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RECHARGE BOTTLE API DOCUMENTATION',
      version: '1.0.0',
      description: `API for Bottle App with role-based access (User, Admin, Super Admin), including authentication, dashboard,
      bottle tracking, rewards, and administrative controls.`,
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
    tags: [
      { name: 'Authentication' },
      { name: 'User Dashboard' },
      { name: 'Admin' },
      { name: 'Super Admin' },
    ],
  },
  apis: ['./main.js'], // This file will contain the swagger comments below
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login user
 *     description: >
 *       Login user with email and password. Role (user, admin, superadmin) determines post-login page.
 *       Superadmins are predefined.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful login with role
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
app.post('/auth/login', (req, res) => {
  // Implement login logic here
  res.status(200).json({ message: 'Login successful', role: 'user/admin/superadmin' });
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register user
 *     description: >
 *       Register a user with role set to 'user'. Email verification is required before login.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       '201':
 *         description: User registered
 *       '500':
 *         description: Server error
 */
app.post('/auth/register', (req, res) => {
  // Implement registration logic here
  res.status(201).json({ message: 'User registered' });
});

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     tags: [Authentication]
 *     summary: Reset password
 *     description: Send reset link to user’s email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       '200':
 *         description: Reset email sent
 *       '500':
 *         description: Server error
 */
app.post('/auth/reset-password', (req, res) => {
  // Implement reset password logic here
  res.status(200).json({ message: 'Reset password email sent' });
});

/**
 * @swagger
 * /user/dashboard:
 *   get:
 *     tags: [User Dashboard]
 *     summary: Get dashboard data
 *     description: >
 *       Returns user's bottle count, earned points, selected station status, machine status,
 *       and available slots (3 max). Slot becomes 'in use' when station is chosen.
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Dashboard data returned
 */
app.get('/user/dashboard', (req, res) => {
  // Implement dashboard retrieval here
  res.status(200).json({
    chargingTimeLeft: '30 minutes',
    totalBottlesInserted: 10,
    pointsEarned: 50,
    selectedStation: 'Station 1',
    machineStatus: 'Active',
    availableSlots: ['slot1', 'slot2'],
  });
});

/**
 * @swagger
 * /user/select-station:
 *   post:
 *     tags: [User Dashboard]
 *     summary: Select station and slot
 *     description: Marks selected machine slot as 'in use' by the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, stationId, slotId]
 *             properties:
 *               userId:
 *                 type: string
 *               stationId:
 *                 type: string
 *               slotId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Station selected, slot marked in use
 *       '500':
 *         description: Server error
 */
app.post('/user/select-station', (req, res) => {
  // Implement station and slot selection logic
  res.status(200).json({ message: 'Station and slot selected' });
});

/**
 * @swagger
 * /user/insert-bottle:
 *   post:
 *     tags: [User Dashboard]
 *     summary: Insert bottle
 *     description: Bottle insert must be done via button after station is selected.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, slotId]
 *             properties:
 *               userId:
 *                 type: string
 *               slotId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Bottle inserted
 *       '500':
 *         description: Server error
 */
app.post('/user/insert-bottle', (req, res) => {
  // Implement bottle insertion logic here
  res.status(200).json({ message: 'Bottle inserted' });
});

/**
 * @swagger
 * /user/bottle-history:
 *   get:
 *     tags: [User Dashboard]
 *     summary: View bottle history
 *     description: Returns timestamped list of inserted bottles by the user.
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Bottle history returned
 */
app.get('/user/bottle-history', (req, res) => {
  // Implement retrieval of bottle history here
  res.status(200).json([{ bottleCount: 5, timestamp: '2025-05-16T10:00:00Z' }]);
});

/**
 * @swagger
 * /user/reward-points:
 *   get:
 *     tags: [User Dashboard]
 *     summary: View rewards and points
 *     description: >
 *       Returns user's total points and available redeemable rewards.
 *       Points are reset every month.
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Points and reward list returned
 */
app.get('/user/reward-points', (req, res) => {
  // Implement retrieval of points and rewards here
  res.status(200).json({
    points: 75,
    rewards: [{ rewardId: 'r1', description: 'Add 15 mins charging for 5 pts' }],
  });
});

/**
 * @swagger
 * /user/redeem-reward:
 *   post:
 *     tags: [User Dashboard]
 *     summary: Redeem a reward
 *     description: >
 *       Redeems a reward using points (e.g., 15 mins charging for 5 pts).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, rewardId]
 *             properties:
 *               userId:
 *                 type: string
 *               rewardId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Reward redeemed
 *       '400':
 *         description: Not enough points
 */
app.post('/user/redeem-reward', (req, res) => {
  // Implement redeem reward logic here
  res.status(200).json({ message: 'Reward redeemed' });
});

/**
 * @swagger
 * /user/leaderboard:
 *   get:
 *     tags: [User Dashboard]
 *     summary: Get weekly top contributors leaderboard
 *     description: >
 *       Returns the top 10 users based on bottles inserted this week.
 *       Resets weekly. Bonus points are awarded to those in the top 10.
 *     responses:
 *       '200':
 *         description: Leaderboard data returned
 */
app.get('/user/leaderboard', (req, res) => {
  // Example static leaderboard
  const leaderboard = [
    { username: 'Alice', bottles: 45, bonusPoints: 20 },
    { username: 'Bob', bottles: 39, bonusPoints: 20 },
    { username: 'Carol', bottles: 37, bonusPoints: 20 },
    { username: 'David', bottles: 33, bonusPoints: 20 },
    { username: 'Eve', bottles: 30, bonusPoints: 20 },
    { username: 'Frank', bottles: 28, bonusPoints: 20 },
    { username: 'Grace', bottles: 26, bonusPoints: 20 },
    { username: 'Heidi', bottles: 25, bonusPoints: 20 },
    { username: 'Ivan', bottles: 24, bonusPoints: 20 },
    { username: 'Judy', bottles: 22, bonusPoints: 20 }
  ];

  res.status(200).json({
    week: 'May 12–18',
    leaderboard,
    note: 'Top 10 contributors earn 20 bonus points. Resets every Monday.',
  });
});

/**
 * @swagger
 * /admin/total-bottles:
 *   get:
 *     tags: [Admin]
 *     summary: Get total bottles inserted by all users
 *     description: Triggers bin full alert if count exceeds threshold (e.g. 100 bottles).
 *     responses:
 *       '200':
 *         description: Total bottles count returned
 */
app.get('/admin/total-bottles', (req, res) => {
  // Implement total bottles count retrieval here
  res.status(200).json({ totalBottles: 150, binFullAlert: true });
});

/**
 * @swagger
 * /admin/reset-bottle-count:
 *   post:
 *     tags: [Admin]
 *     summary: Reset total bottles count
 *     description: Resets bottle count after bin is emptied.
 *     responses:
 *       '200':
 *         description: Count reset
 */
app.post('/admin/reset-bottle-count', (req, res) => {
  // Implement bottle count reset logic here
  res.status(200).json({ message: 'Bottle count reset' });
});

/**
 * @swagger
 * /admin/set-machine-status:
 *   post:
 *     tags: [Admin]
 *     summary: Set machine status
 *     description: Status (Active / Maintenance) reflected in user dashboard in real time.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Active, Maintenance]
 *     responses:
 *       '200':
 *         description: Status updated
 */
app.post('/admin/set-machine-status', (req, res) => {
  // Implement status update here
  res.status(200).json({ message: `Machine status set to ${req.body.status}` });
});

/**
 * @swagger
 * /admin/slots-status:
 *   get:
 *     tags: [Admin]
 *     summary: Get machine slot status
 *     description: Realtime status of all machine slots.
 *     responses:
 *       '200':
 *         description: Slot info returned
 */
app.get('/admin/slots-status', (req, res) => {
  // Implement retrieval of slot status here
  res.status(200).json({ slots: [{ id: 'slot1', status: 'available' }, { id: 'slot2', status: 'in use' }] });
});

/**
 * @swagger
 * /super-admin/add-user:
 *   post:
 *     tags: [Super Admin]
 *     summary: Add new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, username, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '201':
 *         description: User created
 */
app.post('/super-admin/add-user', (req, res) => {
  // Implement add user logic here
  res.status(201).json({ message: 'User added' });
});

/**
 * @swagger
 * /super-admin/edit-user:
 *   put:
 *     tags: [Super Admin]
 *     summary: Edit user details
 *     description: Edit username, verification status, or user role (user/admin only).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               verified:
 *                 type: boolean
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       '200':
 *         description: User updated
 */
app.put('/super-admin/edit-user', (req, res) => {
  // Implement edit user logic here
  res.status(200).json({ message: 'User updated' });
});

/**
 * @swagger
 * /super-admin/delete-user:
 *   delete:
 *     tags: [Super Admin]
 *     summary: Delete user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       '200':
 *         description: User deleted
 */
app.delete('/super-admin/delete-user', (req, res) => {
  // Implement delete user logic here
  res.status(200).json({ message: 'User deleted' });
});

module.exports = app;
