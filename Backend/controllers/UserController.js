const User = require('../models/UserModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    const { username, email, password, isAdmin } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'Email already exists' })
        }

        const newUser = new User({
            username,
            email,
            password,
            isAdmin
        })

        // encrypt password
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);

        await newUser.save();
       

        const payload = {
            user: {
                id: newUser.id
            }
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({
            msg: 'User created successfully',
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
            }
        })


    } catch (error) {
        console.log(error.message);
        res.status(500).send('server error')
    }
}

// login 

exports.login=async(req,res)=>{
    const {email,password}=req.body;

    try {
    //    // Check for admin credentials
    //    if (email === 'admin@gmail.com' && password === 'admin') {
    //     return res.status(200).json({ msg: 'Admin Login' });
    // }

    // Check for regular user credentials
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        return res.status(400).json({ msg: 'Invalid Email' });
    }

    // verify password
        const isMatch=await bcrypt.compare(password,existingUser.password)
        if(!isMatch){
            return res.status(400).json({msg:'Invalid Password'})
        }

        // Check if the user is an admin
        const isAdmin = existingUser.isAdmin;

        const payload={user:{id:existingUser.id ,isAdmin}}
        const token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1h'})
        console.log(token)
        res.status(200).json({
            token,
            user:{
                id:existingUser.id,
                username:existingUser.username,
                isAdmin:isAdmin,
                email:existingUser.email,
                password:existingUser.password
            }
        })
    } catch (error) {
        console.log(error.msg)
        res.status(500).json({msg:'server error'})

        
    }
}

exports.verify=async(req,res)=>{
    res.json({
        msg:'user verified',
        isAuthenticated:true,
        user:req.user
    })
}

// get all users
exports.allUser=async(req,res)=>{
    try {
        const users=await User.find();
        res.json(users)
        console.log(users)
    } catch (error) {
        console.log("error fetching users");
        res.status(500).json({msg:"users not found"})
    }
}

// update user

exports.updateUser = async (req, res) => {
    const id = req.params.id;
    console.log(`Received update request for user ${id}`);
  
    if (!id) {
      return res.status(400).json({ msg: 'Missing user ID' });
    }
  
    const { username, email } = req.body;
    console.log(`Received updated values: username=${username}, email=${email}`);
  
    try {
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      user.username = username || user.username;
      user.email = email || user.email;
  
      await user.save();
      console.log('User updated successfully');
      res.json(user.toJSON());
    } catch (error) {
      console.error(`Error updating user: ${error.message}`);
      res.status(500).json({ msg: 'Error updating user' });
    }
  };
