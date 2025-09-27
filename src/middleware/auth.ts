import { Request, Response, NextFunction } from 'express';

// Simple in-memory session store (should match the one in auth.route.ts)
const sessions = new Map<string, { userId: string; email: string; name: string; createdAt: Date }>();

// Authentication middleware to verify session
export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get session ID from cookie
    const sessionId = req.cookies?.sessionId;
    
    if (!sessionId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Check if session exists
    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(401).json({ error: "Invalid or expired session" });
    }

    // Attach user info to request object
    req.user = {
      id: session.userId
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Authentication failed" });
  }
};

// Export sessions map so it can be used in auth routes
export { sessions };
