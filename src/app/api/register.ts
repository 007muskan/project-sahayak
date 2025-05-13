import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { openDb } from '../../../utils/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here'; // Make sure this is set in .env

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please fill all fields' });
    }

    const db = await openDb();

    // Check if the user already exists
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    await db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);

    // Create a JWT token
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

    // Respond with the token
    res.status(201).json({ message: 'User created successfully', token });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

export default register;

