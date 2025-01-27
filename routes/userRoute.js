const express = require('express');
const {users, userById, signup, editUser, deleteUser,login } = require('../controller/userController');
const { jwtCheck } = require('../middleware/jwtCheck');
const { csrfProtect } = require('../middleware/csrfProtect');



const router = express.Router();

router.get('/users',users);
router.get('/user/:name',userById);
router.put('/user/:name',csrfProtect,jwtCheck,editUser); //cross-site request forgrey
router.delete('/user/:name',csrfProtect,jwtCheck,deleteUser);
router.post('/register',signup);
router.post('/login',login);

module.exports = router;    