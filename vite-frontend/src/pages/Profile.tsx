import Footer from "@/components/footer/Footer";
import NavBar from "@/components/header/NavBar";
import { Button } from "@/components/ui/button";
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
        <div className="container flex">
          <div className="mx-5">
            <img
              className="w-1/2 h-auto object-contain rounded-lg"
              src={
                import.meta.env.VITE_HTTPS_BACKEND +
                `/images/${profile.avatarId}`
              }
              alt={profile?.nickname || "Your Avatar"}
            />
            <div className="font-semibold">
              Nickname: <span className="font-normal">{profile.nickname}</span>
            </div>
            <div className="">
              Email: <span>{profile.email}</span>
            </div>
            <div className="">
              Role: <span> {profile.role.toLowerCase()}</span>
            </div>
          </div>
          <div className="mt-2">
            <Button>Edit profile</Button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Profile;
