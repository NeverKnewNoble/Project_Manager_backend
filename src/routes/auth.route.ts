import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { User } from "../models/User";
export const authRouter = Router();



import { sessions } from '../middleware/auth';

//! Register endpoint: creates a user with hashed password
authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    console.log("📥 Incoming body:", req.body); // Debug log

    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "name, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, passwordHash });
    // Confirm persisted state using exists/findById
    const exists = await User.exists({ _id: (user as any)._id });
    console.log("✅ Saved user id:", user.id, "exists:", Boolean(exists));

    return res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email },
      message: "User registered successfully",
    });
  } catch (err: any) {
    console.error("❌ Registration error:", err); // Debug log
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
});

//! Login endpoint: validates credentials and creates session
authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid email or password" });

    // Generate session ID
    const sessionId = randomBytes(32).toString('hex');
    
    // Store session
    sessions.set(sessionId, {
      userId: user.id,
      email: user.email,
      name: user.name,
      createdAt: new Date()
    });

    // Set session cookie
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    return res.status(200).json({
      message: "Logged in successfully",
      user: { id: user.id, name: user.name, email: user.email },
      sessionId: sessionId
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

//! Signout endpoint: clears session
authRouter.post("/signout", async (req: Request, res: Response) => {
  try {
    const sessionId = req.cookies?.sessionId;
    
    if (!sessionId) {
      return res.status(400).json({ message: "No session found" });
    }

    if (!sessions.has(sessionId)) {
      return res.status(404).json({ message: "Session not found or already expired" });
    }

    // Remove session from store
    sessions.delete(sessionId);

    // Clear session cookie
    res.clearCookie('sessionId');

    return res.status(200).json({ message: "Signed out successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});
