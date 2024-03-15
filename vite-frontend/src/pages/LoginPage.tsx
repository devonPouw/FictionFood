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
import { useToast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";

const Login: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const Auth = useAuth();

  const handleLogin = async (formValue: ILoginData) => {
    const { username, password } = formValue;
    setLoading(true);

    try {
      const response = await backendApi.login(username, password);
      setLoading(false);
      toast({
        description: "Successfully logged in!",
      });
      Auth.userLogin(response.data.accessToken, response.data.refreshToken);
      navigate("/");
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
