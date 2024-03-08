import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "@/services/auth/useAuth";
import { backendApi } from "@/services/ApiMappings";
import { ILoginData } from "@/types/User";

const Login: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const Auth = useAuth();

  const handleLogin = async (formValue: ILoginData) => {
    const { username, password } = formValue;
    setMessage("");
    setLoading(true);
    try {
      const response = await backendApi.login(username, password);
      console.table(response.data);

      Auth.userLogin(response.data.accessToken, response.data.refreshToken);
      setLoading(false);
      navigate("/");
      setMessage(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const formSchema = z
    .object({
      username: z.string().max(15, {
        message: "Usernames are not longer than 15 characters",
      }),
      password: z.string().max(24, {
        message: "Passwords are not longer than 24 characters",
      }),
    })
    .required();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="container h-1/3">
        <div className="flex h-1/2 items-center justify-center text-4xl">
          <Link to={"/"}>
            <span className="font-bold hover:text-muted-foreground">
              <span className="font-serif font-semibold">F</span>iction
              <span className="font-serif font-semibold">f</span>ood
            </span>
          </Link>
        </div>
      </div>
      <div className="container">
        <div className="container">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleLogin)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
                    </FormControl>
                    <FormMessage autoCorrect="false" />
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
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage autoCorrect="false" />
                  </FormItem>
                )}
              />
              <div className="w-full flex justify-center">
                <div>
                  <div>
                    <Button
                      className="w-32 md:24 border-2"
                      type="submit"
                      disabled={
                        form.control._defaultValues.username ===
                          form.getValues().username ||
                        form.control._defaultValues.password ===
                          form.getValues().password
                      }
                    >
                      Login
                    </Button>
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
          <div className="container pt-4 flex h-14 items-center justify-center font-bold">
            <Link to={"/register"}>
              <span className="hover:text-slate-400">
                Don't have an account yet? Click here to register!
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
