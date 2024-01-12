const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyToken = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      const reqToken = req.headers.authorization.split(" ")[1];

      // verify token
      const userToken = jwt.verify(reqToken, process.env.JWT_SECRET);
      if (userToken) {
        const user = await User.findOne({ token: reqToken });  
        if(user){
          req.user = user;
          next();
        }else{
          res.status(401).json({message: "Unauthorized"});
        }
      }
    }else{
      res.status(401).json({message: "Unauthorized"});
    }
  } catch (error) {
    res.status(401).json({message: "Unauthorized"});
  }
};

module.exports = {
  verifyToken,
};
