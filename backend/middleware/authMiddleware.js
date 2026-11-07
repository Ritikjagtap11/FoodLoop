import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // console.log("Authorization header:", req.headers.authorization);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
        message: "Unauthorized"
    });
}

    const token = authHeader.split(" ")[1];

    if(!token){
        return res.status(401).send({message:"Unauthorized"});
    }

    try {
         const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
    } catch (error) {
        console.log(error);
        return res.status(401).send({message:"Unauthorized"});
    }
};