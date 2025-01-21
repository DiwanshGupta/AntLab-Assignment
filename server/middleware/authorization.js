import jwt from "jsonwebtoken";

const authenticateUser =async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ message: "Authorization header missing" });
  }
  console.log("JWT_SECRET during generation:", process.env.JWT_SECRET);

  const token = authHeader.split(" ")[1].replace(/"/g, ""); 
  if (!token) {
    return res.status(403).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);  
    req.user = decoded;  
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};


export default authenticateUser;
