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

export default isAuthenticated;
