// pages/api/signup.js
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      return res.status(200).json({ message: "User created successfully", user });
    } catch (error) {
       console.error("Signup error:", error);
      return res.status(500).json({ error: "Error creating user" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
