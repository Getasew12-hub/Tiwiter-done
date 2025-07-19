export const Getme=async(req,res,next)=>{
   
      if(req.isAuthenticated()){
      
            next();
      }else{
          res.status(401).json({
              message:"you are not authenticated"
          });
      }

    
}