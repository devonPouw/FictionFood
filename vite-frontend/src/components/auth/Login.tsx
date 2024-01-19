import { useAuth } from '@/services/auth/auth-context';
import { logout, parseJwt } from '@/services/auth/auth.service';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Login:React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const { token } = useAuth();
    const data = parseJwt(token)
    
    const handleLogout = () => {
      if(token)
      logout(token).then(() => {
        try{
        localStorage.removeItem("token");
        navigate("/")
        }
        catch{
          throw Error;
        }
      })
    }

    return(
       <>
    {token ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
      <Avatar>
      <AvatarImage className='hover:cursor-pointer' src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>{data.sub.substring(0, 1)}</AvatarFallback>
    </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{data.sub}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={ () => navigate("/profile")}>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Change password
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>My recipes</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Finished</DropdownMenuItem>
                <DropdownMenuItem>Editing...</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Create new</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>API</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>) : (<div>
        <Link to={"/login"}>
        <div className='container inline-flex items-center justify-center whitespace-nowrap rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground py-2 px-0 font-bold'>
            <span className='px-3'>Login</span>
            </div>
          </Link>
          </div>)}
    </>)
}
export default Login
