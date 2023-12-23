import {  Link, NavigateFunction, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
    
import { Button } from "@/components/ui/button"
import {
      Form,
      FormControl,
      FormField,
      FormItem,
      FormLabel,
      FormMessage,
    } from "@/components/ui/form"
     import { Input } from "@/components/ui/input"
import { login } from "@/services/auth/auth.service"; 
import { useState } from "react";
import { useAuth } from "@/services/auth/auth-context";

const Login: React.FC= () => {
  const navigate: NavigateFunction = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const { setToken } = useAuth();
  const handleLogin = (formValue: { username: string; password: string }) => {
    const { username, password } = formValue;
    
    setMessage("");
    setLoading(true);

    login(username, password).then(
      (response) => {
        setToken(response.accessToken)
        navigate("/");
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage);
      }
    );
  };

  const formSchema = z.object({
    username: z.string().max(24, {
      message: "Not more than 24 characters allowed.",
    }),
    password: z.string().max(24, {
      message: "Not more than 24 characters allowed.",
    }),
  }).required();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: ""
    },
  })

  return (
    <div className="container place-self-center">
      <div className="container">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormMessage
                  autoCorrect="false" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage
                  autoCorrect="false"
                   />
                </FormItem>
              )}
            />
            <div className="w-full flex justify-center">
              <div>
            <div>
            <Button className="w-32 md:24 border-2" type="submit">Submit</Button>
              {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                </div>
                {message && (
              <div className="form-group text-center text-red-700">
                  {message}
                </div>
             
            )}
            </div>
            </div>
          </form>
        </Form>
        <div className='container pt-4 flex h-14 items-center justify-center font-bold'>
          <Link to={"/register"}>
            <span className="hover:text-slate-400">Don't have an account yet? Click here to register!</span>
          </Link>
        </div>
        </div>
        </div>
  );
}
export default Login