   import { useMutation, useQueryClient } from "@tanstack/react-query";
   import toast from "react-hot-toast";

   
 const userFollow=()=>{
    const query=useQueryClient()
   const {mutate,isPending}=useMutation({
    mutationFn:async (user)=>{

      try{
       const res=await fetch(`https://tiwiter-done-1.onrender.com/user/folow/${user}`,{
        method:"POST",
      
        credentials:"include",
       })
       const data=await res.json();
       
        if(!res.ok) throw new Error("something is wrong");
      
       return data;
      }catch(err){
        throw err;
      }
    },
  onSuccess:(data,variable)=>{
    const val=variable;
   
    query.invalidateQueries({queryKey:["suggest"]})
    query.setQueryData(["followInclud"],(old)=>{
      
     if( old.includes(val)){
     return old.filter(item => item !== val);
     }else{
      return [...old,val]
     }
    })
  },
  onError:(err)=>{
    console.log(err)
    toast.error("faild to follow")
  }
   })
   return {mutate,isPending};
}

export default userFollow;