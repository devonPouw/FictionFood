import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";

import { IRegisterData } from "@/types/User";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { backendApi } from "@/services/ApiMappings";
import { useAuth } from "@/services/auth/useAuth";

const Register: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [successful, setSuccessful] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const Auth = useAuth();

  const formSchema = z
    .object({
      role: z.string(),
      nickname: z.string().min(3).max(15, {
        message: "Must be between 3 and 15 characters long",
      }),
      username: z.string().min(3).max(15, {
        message: "Must be between 3 and 15 characters long",
      }),
      email: z.string().email({
        message: "Invalid email address",
      }),
      password: z.string().min(8).max(24, {
        message: "Must be between 8 and 24 characters long",
      }),
    })
    .required();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "CHEF",
      nickname: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const handleRegister = async (formValue: IRegisterData) => {
    const { role, nickname, username, email, password } = formValue;
    setMessage("");
    setLoading(true);
    try {
      const response = await backendApi.register(
        role,
        nickname,
        username,
        email,
        password
      );
      const { accessToken } = response.data;

      Auth.userLogin(accessToken);
      setSuccessful(true);
      navigate("/");
      window.location.reload();
      setMessage(response.data.message);
    } catch (error) {
      setLoading(false);

      setSuccessful(false);
      console.log(error);
    }
  };
  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="container h-1/4">
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
        <Form {...form}>
          {!successful && (
            <form
              onSubmit={form.handleSubmit(handleRegister)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nickname</FormLabel>
                    <FormControl>
                      <Input placeholder="nickname" {...field} />
                    </FormControl>
                    <FormMessage autoCorrect="false" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="given@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        placeholder="password"
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
                        form.control._defaultValues.nickname ===
                          form.getValues().nickname ||
                        form.control._defaultValues.email ===
                          form.getValues().email ||
                        form.control._defaultValues.username ===
                          form.getValues().username ||
                        form.control._defaultValues.password ===
                          form.getValues().password
                      }
                    >
                      Register
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
          )}
        </Form>
      </div>
    </div>
  );
};

export default Register;
