

export  const allowRoles = (...roles)=>{
    return(req,res,next)=>{
        if(!req.user){
            return res.status(401).send({message:"Unauthorized"});
        }
        if(roles.includes(req.user.role)){
            next();
        }else{
            res.status(403).json({
                message:"Access denied. You are not authorized to perform this action."
            });
        }
    }
}