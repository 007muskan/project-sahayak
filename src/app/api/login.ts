// pages/api/login.js
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid password" });
      }

      // Create a JWT token
      const token = sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "Error logging in" });
    }

  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
