import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

export const createUser = async (username, phoneNumber, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const [result] = await pool.execute(
    'INSERT INTO users (username, phoneNumber, password) VALUES (?, ?, ?)',
    [username, phoneNumber, hashedPassword]
  );
  
  return {
    id: result.insertId,
    username,
    phoneNumber,
    createdAt: new Date()
  };
};

export const findUserByPhone = async (phoneNumber) => {
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE phoneNumber = ?',
    [phoneNumber]
  );
  
  return rows.length > 0 ? rows[0] : null;
};

export const findUserById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT id, username, phoneNumber, createdAt FROM users WHERE id = ?',
    [id]
  );
  
  return rows.length > 0 ? rows[0] : null;
};

export const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

