import express from 'express';
let router = express.Router();
import authServices from './auth.services.js';

router.post('/register', async (req, res, next) => {
    let { username, email, password } = req.body;
    try {
        let newUser = await authServices.register(username, email, password);
        res.status(201).json({
            data: { username: newUser.username, email: newUser.email },
            message: 'Registration success'
        });
    } catch (error) {
        console.error('Registration error:', error.message);
        res.status(400).json({ error: error.message });
    }
});

router.post('/login', async (req, res, next) => {
    let { username, password } = req.body;
    try {
        let { user, token } = await authServices.login(username, password);
        res.status(200).json({
            data: { username: user.username, role: user.role, token },
            message: 'Login success!'
        });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(400).json({ error: error.message });
    }
});

export default router;
