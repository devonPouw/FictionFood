import Footer from "../footer/Footer";
import NavBar from "../header/NavBar";

const Profile: React.FC = () => {

  return (
    <div>
      <NavBar />
    <div className="container">
      <header className="jumbotron">
        <h3>
          <span></span> Profile
        </h3>
      </header>
      {/* <p>
        <strong>Token:</strong> {currentUser.accessToken.substring(0, 20)} ...{" "}
        {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
      </p>
      <p>
        <strong>Email:</strong> {currentUser.email}
      </p>
      <strong>Authorities:</strong>
      <span>
        {currentUser.role}
      </span> */}
    </div>
    <Footer />
    </div>
  );
};

export default Profile;