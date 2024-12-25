const express = require('express');
const {users, userById, signup, editUser, deleteUser,login } = require('../controller/userController');
const { tokenRequire } = require('../middleware/tokenDecrypt');
const { sign } = require('jsonwebtoken');
const { adminCheck } = require('../middleware/adminCheck');

const router = express.Router();

router.get('/users',users);
router.get('/user/:name',userById);
router.put('/user/:name',tokenRequire,editUser);
router.delete('/user/:name',tokenRequire,adminCheck,deleteUser);
router.post('/register',signup);
router.post('/login',login);

module.exports = router;    