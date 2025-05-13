// pages/api/signup.ts
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

// Initialize Prisma client
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only accept POST requests
  if (req.method === "POST") {
    // Destructure body
    const { name, email, password } = req.body;

    // Check if any required fields are missing
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Create new user in the database
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      // Return success response with the user data
      return res.status(200).json({ message: "User created successfully", user });
    } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({ error: "Error creating user" });
    }
  } else {
    // Handle unsupported methods
    res.status(405).json({ error: "Method not allowed" });
  }
}
