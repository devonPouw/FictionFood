import Footer from "@/components/footer/Footer";
import NavBar from "@/components/header/NavBar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { backendApi } from "@/services/ApiMappings";
import { IProfileData } from "@/types/User";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

const Profile = () => {
  const [profile, setProfile] = useState<IProfileData>();
  const { toast } = useToast();
  const fetchUserProfile = async () => {
    try {
      const response = await backendApi.getProfile();
      setProfile(response.data);
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.data
      ) {
        toast({
          description: error.response.data.message,
        });
      }
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
            className="w-1/2 h-full object-contain rounded-lg aspect-square"
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
