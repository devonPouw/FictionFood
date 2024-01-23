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
import { useState } from "react";
import { useAuth } from "@/services/auth/AuthContext";
import { backendApi } from "@/services/ApiMappings";

const Login: React.FC= () => {
  const navigate: NavigateFunction = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const Auth = useAuth();
  
  const handleLogin = async (formValue: { username: string; password: string }) => {
    const { username, password } = formValue;
    setMessage("");
    setLoading(true);
    try {
      const response = await backendApi.login(username, password);
      const  accessToken  = response.data.accessToken;
      console.table(response.data)

      Auth.userLogin(accessToken);
      setLoading(false);
      navigate("/");
      setMessage(response.data.message);
    }
      catch (error) {
      console.log(error)
    }
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
    <div className="w-screen h-screen flex">
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
            <Button className="w-32 md:24 border-2" type="submit" disabled={form.control._defaultValues.username === form.getValues().username 
              || form.control._defaultValues.password === form.getValues().password}>Submit</Button>
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
        </div>
  );
}
export default Login