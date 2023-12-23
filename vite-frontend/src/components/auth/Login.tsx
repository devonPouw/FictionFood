import { useAuth } from '@/services/auth/auth-context';
import { parseJwt } from '@/services/auth/auth.service';
import { Link } from 'react-router-dom'

const Login:React.FC = () => {
    const { token } = useAuth();
    const data = parseJwt(token)
    console.log(data)
    return(
       <>
        {!token ? (
        <div>
        <Link to={"/login"}>
            <span>Login</span>
          </Link>
          </div> ) : (
          <div>
          <Link to={"/profile"}>
              <span>{data.sub}</span>
            </Link>
            </div>
    )}
    </>)
}
export default Login