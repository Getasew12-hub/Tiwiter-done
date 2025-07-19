export const  Auth=async()=>{
    try{
     const res=await fetch("https://tiwiter-done-1.onrender.com/auth/authUser",{
      credentials:"include",

     })


     const data=await res.json();
       if (data.error) return null;
     if(!res.ok) throw new Error(data.error);
  
  
     return data;
    }catch(err){
  throw new Error(err.message);
    }
  }

export const FeachPost=async()=>{
    try{
    const respo=await fetch(url,{
      credentials:"include"
    });
    const responsejson=await respo.json();
    if(!respo.ok) throw new Error (data.error);
    return responsejson;
    }catch(err){
      console.log(err.message);
      throw err;
    }
  }

  export const Follow= async () => {
      try {
        const res = await fetch("https://tiwiter-done-1.onrender.com/post/followId", {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "something is wrong");
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    }