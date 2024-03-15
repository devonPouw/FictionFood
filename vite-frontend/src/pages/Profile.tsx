import Footer from "@/components/footer/Footer";
import NavBar from "@/components/header/NavBar";
import { Skeleton } from "@/components/ui/skeleton";
import { backendApi } from "@/services/ApiMappings";
import { IProfileData } from "@/types/User";
import { useEffect, useState } from "react";

const Profile = () => {
  const [profile, setProfile] = useState<IProfileData>();

  const fetchUserProfile = async () => {
    try {
      const response = await backendApi.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUserProfile();
  }, []);
  return (
    <div>
      <NavBar />
      {!profile ? (
        <Skeleton />
      ) : (
        <div className="container">
          <img
            className="w-1/2 h-fit object-contain rounded-lg"
            src={
              import.meta.env.VITE_HTTPS_BACKEND + `/images/${profile.avatarId}`
            }
            alt={profile?.nickname || "Your Avatar"}
          ></img>
          <div>{profile.nickname}</div>
          <div>{profile.email}</div>
          <div>{profile.role.toLowerCase()}</div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Profile;
