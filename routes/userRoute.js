const express = require('express');
const {users, userById, signup, editUser, deleteUser,login } = require('../controller/userController');
const { tokenDecrypt } = require('../middleware/tokenDecrypt');
const { csrfProtect } = require('../middleware/csrfProtect');



const router = express.Router();

router.get('/users',users);
router.get('/user/:name',userById);
router.put('/user/:name',csrfProtect,tokenDecrypt,editUser);
router.delete('/user/:name',csrfProtect,tokenDecrypt,deleteUser);
router.post('/register',signup);
router.post('/login',login);

module.exports = router;    