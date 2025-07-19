import React, { useRef } from "react";
import "./profile.css";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import EditIcon from "@mui/icons-material/Edit";
import LinkIcon from "@mui/icons-material/Link";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Editprofile from "./editprofile";
import { Outlet, NavLink, useParams, Await } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import userFollow from "../../controller/homemiddle/hooks/userfollow";
import SmallLoading from "../../controller/skeleton/amllLoading";
import { Auth } from "../../controller/queryFn/queryFn";
import { Follow } from "../../controller/queryFn/queryFn";

function profilePage() {
  const query=useQueryClient()
  const banner = useRef();
  const bannerimg = useRef();
  const userprofile = useRef();
  const profileRead = useRef();
  const UpdateButton = useRef();
  const [bannerState, setBanner] = useState(null);
  const [read, setRead] = useState(false);
  const [peofileupdate, setupdateprofile] = useState("");
  const [state, setState] = useState("");
  const { data: userfollowget, isLoading: comming } = useQuery({
    queryKey: ["followInclud"],
    queryFn:Follow,
});
  const { data: auth, isLoading: Loading } = useQuery({ queryKey: ["auth"] ,queryFn:Auth,retry:false});

  const router = () => {
    switch (state) {
      case "post":
        return "http://localhost:5000/user/userpost";
      case "like":
        return "http://localhost:5000/user/like";
      default:
        return "http://localhost:5000/user/userpost";
    }
  };
const {data:vals,isLoading:loding}= useQuery({
  queryKey:['fetchPost'],
  queryFn:async()=>{
    try{
    const respo=await fetch("http://localhost:5000/post/all",{
      credentials:"include"
    });
    const responsejson=await respo.json();
    if(!respo.ok) throw new Error (data.error);
    return responsejson;
    }catch(err){
      console.log(err.message);
      throw err;
    }
  },
  retry:false,
  
})


  const url = router();
  const { user } = useParams();

  const {
    data: profile,
    isLoading: proLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["peofile"],
    queryFn: async () => {
      try {
        const res = await fetch(`http://localhost:5000/user/profile/${user}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "something is wrong");
        return data;
      } catch (err) {
        throw new Error(err.message);
      }
    },
    retry: false,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ profileimage, coverimage }) => {
      try {
        const res = await fetch("http://localhost:5000/user/updateImg", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ profileimage, coverimage }),
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "something is wrong");
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("sussefully update");
      
      UpdateButton.current.setAttribute("hidden", "true");
      query.invalidateQueries({queryKey:["auth"]})
    },
    onError: () => {
      toast.error("faild to update");
    },
    retry: false,
  });
  const { data, isLoading, refetch: refresh, risRefetching: refishing } = useQuery({
    queryKey: ["userpost", state],
    queryFn: async () => {
      try {
        const res = await fetch(`${url}/${user}`, {
          credentials: "include",
        });
        const resdata = await res.json();
        if (!res.ok) throw new Error(resdata.error);
        return resdata;
      } catch (err) {
        throw new Error(err.message);
      }
    },
    enabled: !!state,
    retry: false,
  });
  useEffect(() => {
    refresh();
  }, [state, user]);
  useEffect(() => {
    setState("post");
    setRead(false);
    refetch();
  }, [user]);
  const { mutate: folowUnfolow, isPending: folloPro } = userFollow();

  function Banner(e) {
    const file = e.target.files[0];

    if (file) {
      const render = new FileReader();
      render.readAsDataURL(file);

      render.onload = (e) => {
        UpdateButton.current.removeAttribute("hidden");
        bannerimg.current.src = e.target.result;
        setBanner(e.target.result);
      };
    }
  }
  function Edit(e) {
    e.stopPropagation();
    const edit = document.querySelector(".editprofile-container");
    edit.style.visibility = "visible";
  }

  function ProfileImg(e) {
    const file = e.target.files[0];
    if (file) {
      const reander = new FileReader();
      reander.readAsDataURL(file);
      reander.onload = async (e) => {
        UpdateButton.current.removeAttribute("hidden");
        setupdateprofile(e.target.result);
        setRead(true);
      };
    }
  }

  function SendUpdate() {
    const profileimage = peofileupdate;
    const coverimage = bannerState;
    mutate({ profileimage, coverimage });
  }

  if (proLoading || isRefetching || isLoading || Loading || comming)
    return <div>Loading...</div>;

  const userpro = {
    user: data,
  };
 
  return (
    <div className="profile-container">
      <div className="numPostBack">
        <KeyboardBackspaceIcon
          onClick={() => window.history.back()}
          style={{ cursor: "pointer" }}
        />
        <div className="username">
          <p>{profile[0].fullname}</p>
          <p>{profile[4].post.length} Posts</p>
        </div>
      </div>

      <div className="userprofileimg">
        <div className="image">
          {profile[1].coverimg ? (
            <img src={profile[1].coverimg} alt="" ref={bannerimg} />
          ) : (
            <img  alt="" ref={bannerimg} />
          )}

          {profile[1].profileimg || read ? (
            read ? (
              <img
                src={peofileupdate}
                alt=""
                ref={profileRead}
                onClick={() => {
                  auth.id == profile[0].id && userprofile.current.click();
                }}
              />
            ) : (
              <img
                src={profile[1].profileimg}
                alt=""
                ref={profileRead}
                onClick={() => {
                  auth.id == profile[0].id && userprofile.current.click();
                }}
              />
            )
          ) : (
            <div
              className="profileReplace"
              onClick={() => {
                auth.id == profile[0].id && userprofile.current.click();
              }}
            >
              {profile[0].fullname.slice(0, 1)}
            </div>
          )}

          {auth.id == profile[0].id && (
            <EditIcon className="icon" onClick={() => banner.current.click()} />
          )}
          <input
            type="file"
            hidden
            name="banner"
            id="banner"
            accept="image/*"
            ref={banner}
            onChange={Banner}
          />
          <input
            type="file"
            name="profileimg"
            hidden
            id="profileimg"
            accept="image/*"
            ref={userprofile}
            onChange={ProfileImg}
          />
        </div>
        {auth.id == profile[0].id ? (
          <div>
            <button
              style={{
                background: "dodgerblue",
                color: "white",
                borderColor: "transparent",
              }}
              onClick={SendUpdate}
              hidden
              ref={UpdateButton}
            >
              {isPending ? <SmallLoading /> : "Update"}
            </button>{" "}
            <button onClick={Edit}>Edit Profile</button>
          </div>
        ) : (
          <div className="followUnfolow">
            {!userfollowget.includes(profile[0].id) ? (
              <button onClick={() => folowUnfolow(profile[0].id)}>
                {folloPro ? "Loading..." : "Follow"}
              </button>
            ) : (
              <button onClick={() => folowUnfolow(profile[0].id)}>
                {folloPro ? "Loading..." : "Unfollow"}
              </button>
            )}
          </div>
        )}
      </div>
      <div className="userdetail">
        <p className="name">{profile[0].fullname} </p>
        <p className="username">{profile[0].username}</p>
        <p className="bio">{profile[1].bio}</p>
        <div className="linkJoin">
          <p className="link">
            <LinkIcon style={{ color: "gray" }} />
            {profile[1].link}
          </p>
          <p className="join">
            {" "}
            <CalendarMonthIcon />
            Joined April 2014
          </p>
        </div>
        <div className="follow">
          <p>
            {" "}
            <span>{profile[2].following.length}</span> Following{" "}
          </p>
          <p>
            <span>{profile[3].follows.length}</span> Followers
          </p>
        </div>
      </div>

      <Editprofile />
      <div className="user-post">
        <div className="postLikes">
          <NavLink to={"."} end onClick={() => setState("post")}>
            {" "}
            <p> Posts</p>
          </NavLink>
          <NavLink to="likes" onClick={() => setState("like")}>
            {" "}
            <p>Likes</p>
          </NavLink>
        </div>
        <Outlet context={userpro} />
      </div>
    </div>
  );
}

export default profilePage;
