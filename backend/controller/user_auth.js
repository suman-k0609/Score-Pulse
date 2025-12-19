const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;


const register = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        if (!userName || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            userName,
            email,
            password: hashedPassword
        });

        const savedUser = await user.save();
        console.log('✅ User registered:', savedUser.email); 

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1w' });
        
        res.status(201).json({
            message: "User registered successfully",
            token,
            userId: user._id,
            userName: user.userName,
            email: user.email
        });
    } catch (err) {
        console.log('❌ Registration error:', err.message);
        res.status(500).json({ error: "User registration failed" });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1w" });
        console.log('✅ User logged in:', user.email);

        res.json({ 
            message: "Login successful", 
            token, 
            userId: user._id,
            userName: user.userName,
            email: user.email
        });
    } catch (err) {
        console.log('❌ Login error:', err.message);
        res.status(500).json({ error: "Login failed" });
    }
};

module.exports = { register, login };