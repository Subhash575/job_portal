import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }
    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }
    req.id = decode.userId;
    req.role = decode.role;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Authentication failed. Please login again.",
      success: false,
    });
  }
};
// Use after isAuthenticated. Tokens issued before this change have no role, so those users must log in again.
export const isRecruiter = (req, res, next) =>
  req.role === "recruiter"
    ? next()
    : res.status(403).json({
        message: "Only recruiters can do this.",
        success: false,
      });

// Allows at most `max` requests per IP in each `windowMs`, then answers 429. Use it on login/register so passwords can't be guessed all day.
// shortcut: the counts live in this server's memory, so they reset on restart and are not shared between servers; use a shared store (e.g. Redis) if you run more than one instance.
export const limitAttempts = (max = 10, windowMs = 15 * 60 * 1000) => {
  const hits = new Map();
  setInterval(() => {
    const now = Date.now();
    for (const [ip, h] of hits) if (h.reset <= now) hits.delete(ip);
  }, windowMs).unref();
  return (req, res, next) => {
    const now = Date.now();
    let h = hits.get(req.ip);
    if (!h || h.reset <= now) hits.set(req.ip, (h = { count: 0, reset: now + windowMs }));
    if (++h.count > max) {
      res.set("Retry-After", String(Math.ceil((h.reset - now) / 1000)));
      return res.status(429).json({
        message: "Too many attempts. Please try again later.",
        success: false,
      });
    }
    next();
  };
};

export default isAuthenticated;
