import Footer from "@/components/footer/Footer";
import NavBar from "@/components/header/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { backendApi } from "@/services/ApiMappings";
import {
  IChangeEmailData,
  IChangeNicknameData,
  IProfileData,
} from "@/types/User";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";

const Profile = () => {
  const [profile, setProfile] = useState<IProfileData>();
  // const [loading, setLoading] = useState(true);
  const [editNickname, setEditNickname] = useState(false);
  const [nickname, setNickname] = useState("");
  const [editEmail, setEditEmail] = useState(false);
  const [email, setEmail] = useState("");
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
  const handleEdit = async (param: string, value: string) => {
    try {
      let response;
      if (param === "nickname") {
        const nicknameRequest: IChangeNicknameData = {
          newNickname: value,
          currentNickname: profile?.nickname || "",
        };
        response = await backendApi.changeNickname(nicknameRequest);
        setNickname("");
        setEditNickname(false);
      } else if (param === "email") {
        const emailRequest: IChangeEmailData = {
          newEmail: value,
          currentEmail: profile?.email || "",
        };
        response = await backendApi.changeEmail(emailRequest);
        setEmail("");
        setEditEmail(false);
      } else return;
      toast({
        description: response.data,
      });
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
  }, [editEmail, editNickname]);
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
            <div className="font-semibold flex justify-around">
              Nickname: <span className="font-normal">{profile.nickname}</span>{" "}
              {editNickname ? (
                <Input
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                />
              ) : (
                <div></div>
              )}
              {editNickname ? (
                <Button onClick={() => handleEdit("nickname", nickname)}>
                  Save
                </Button>
              ) : (
                <div></div>
              )}
              <Button onClick={() => setEditNickname(!editNickname)}>
                <FaRegEdit />
              </Button>{" "}
            </div>
            <div className="font-semibold flex justify-around">
              Email: <span className="font-normal">{profile.email}</span>
              {editEmail ? (
                <Input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              ) : (
                <div></div>
              )}
              {editEmail ? (
                <Button onClick={() => handleEdit("email", email)}>Save</Button>
              ) : (
                <div></div>
              )}
              <Button onClick={() => setEditEmail(!editEmail)}>
                {!editEmail ? <FaRegEdit /> : "Cancel"}
              </Button>
            </div>
            <div className="">
              Role: <span> {profile.role.toLowerCase()}</span>
            </div>
          </div>
          <div className="mt-2">
            <Button>
              <FaRegEdit />
            </Button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Profile;
