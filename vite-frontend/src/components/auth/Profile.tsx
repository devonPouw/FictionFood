import { getCurrentUser } from "@/services/auth/auth.service";

const Profile: React.FC = () => {
  const currentUser = getCurrentUser();

  console.log(currentUser)
  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{currentUser.username}</strong> Profile
        </h3>
      </header>
      <p>
        <strong>Token:</strong> {currentUser.accessToken.substring(0, 20)} ...{" "}
        {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
      </p>
      <p>
        <strong>Email:</strong> {currentUser.email}
      </p>
      <strong>Authorities:</strong>
      <span>
        {currentUser.role}
      </span>
    </div>
  );
};

export default Profile;