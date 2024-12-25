const {connectMysql} = require('../dataModel');
const { verifySaltHash } = require('../services/passwordEncrypt');
const { createToken } = require('../services/๋jsonwebtoken');


exports.users = async (req, res) => {
  try{
    const db = await connectMysql();
    const [results] = await db.query('SELECT id,name,role FROM users')
    .catch(err => {
      return res.status(500).json({ message: 'Internal server error' });
    });
    res.json(results[0]);
  }catch(error){
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.userById = async (req, res) => {
  try{
    const db = await connectMysql();
    const [results] = await db.query('SELECT id,name,role FROM users WHERE name = ?', [req.params.name])
    .catch(err => {
      return res.status(500).json({ message: 'Internal server error' });
    });
    if(results.length === 0){
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(results)[0];
  }catch(error){
    return res.status(500).json({ message: 'Internal server error' });
  }
}

exports.editUser = async (req, res) => {
  try{
    const db = await connectMysql();
    const targetName = req.params.name;
    const tokenRole = req.user.role;
    const tokenName = req.user.name;
    const tokenEmail = req.user.email;
    let { name, email, password } = req.body;
    if(tokenRole !== 'admin' && tokenName !== targetName){
      return res.status(403).json({ message: 'Forbidden' });
    }
    if(!name){
      name = targetName;
    }
    if(!email){
      email = tokenEmail; ;
    }
    if(!password){
      password = '';
    }
    const [checkEmail] = await db.execute('SELECT * FROM users WHERE email = ? AND name != ?', [email, targetName])
    .catch(err => {
      return res.status(500).json({ message: 'Internal server error' });
    });
    if(checkEmail.length > 0){
      return res.status(400).json({ message: 'Email already exists' });
    }
    const [checkName] = await db.execute('SELECT * FROM users WHERE name = ? AND name != ?', [name, targetName])
    .catch(err => {
      return res.status(500).json({ message: 'Internal server error' });
    });
    if(checkName.length > 0){
      return res.status(400).json({ message: 'Name already exists' });
    }
    if(password){
      const {salt, hashpassword} = creatSaltHash(password);
      await db.execute('UPDATE users SET name = ?, email = ?, hashpassword = ?, salt = ? WHERE name = ?', [name, email, hashpassword, salt, targetName])
      .catch(err => {
        return res.status(500).json({ message: 'Internal server error' });
      });
    }
    else{
      await db.execute('UPDATE users SET name = ?, email = ? WHERE name = ?', [name, email, targetName])
      .catch(err => {
        return res.status(500).json({ message: 'Internal server error' });
      });
    }
    return res.json({ message: 'Edit user successfully' });
  }catch(error){
    return res.status(500).json({ message: 'Internal server error' });
  }
}

exports.deleteUser = async (req, res) => {
  try{
    const db = await connectMysql();
    const targetName = req.params.name;
    const tokenRole = req.user.role;
    if(tokenRole !== 'admin'){
      return res.status(403).json({ message: 'Forbidden' });
    }
    await db.execute('DELETE FROM users WHERE name = ?', [targetName])
    .catch(err => {
      return res.status(500).json({ message: 'Internal server error' });
    });
    return res.json({ message: 'Delete user successfully' });
  }catch(error){
    return res.status(500).json({ message: 'Internal server error' });
  }
}

exports.signup = async (req, res) => {
  try{
    const db = await connectMysql();
    const { name, email, password } = req.body;
    if(!name || !email || !password){
      return res.status(400).json({ message: 'Invalid input' });
    }
    const [checkEmail] = await db.execute('SELECT * FROM users WHERE email = ?', [email])
    .catch(err => {
      return res.status(500).json({ message: 'Internal server error' });
    });
    if(results.length > 0){
      return res.status(400).json({ message: 'Email already exists' });
    }
    const [checkName] = await db.execute('SELECT * FROM users WHERE name = ?', [name])
    .catch(err => {
      return res.status(500).json({ message: 'Internal server error' });
    });
    if(results.length > 0){
      return res.status(400).json({ message: 'Name already exists' });
    }
    const {salt, hashpassword} = creatSaltHash(password);
    await db.execute('INSERT INTO users (name, email, hashpassword, salt, role) VALUES (?, ?, ?, ?, ?)', [name, email, hashpassword, salt, 'user'])
    .catch(err => {
      return res.status(500).json({ message: 'Internal server error' });
    });
    return res.status(201).json({ message: 'Signup successfully' });
  }catch(error){
    return res.status(500).json({ message: 'Internal server error' });
  }
}

exports.login = async (req, res) => {
  try{
    const db = await connectMysql();
    const { email, password } = req.body;
    if(!email || !password){
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const [results] = await db.execute('SELECT * FROM users WHERE email = ?', [email])
    .catch(err => {
      return res.status(500).json({ message: 'Internal server error' });
    });
    if(results.length === 0){
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const {id, name, role} = results[0]; 
    if(verifySaltHash(password, results[0].salt, results[0].hashpassword)){ 
      const token = createToken({ id, name, role });
      return res.json({ token });
    }else{
      return res.status(400).json({ message: 'Invalid email or password' });
    }
  }
  catch(error){
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}