import { NavigateFunction, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react";

import IUser from "@/types/User";
import { register } from "@/services/auth/auth.service";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const Register: React.FC = () => {
    const navigate: NavigateFunction = useNavigate();

  const [successful, setSuccessful] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const formSchema = z.object({
    role: z.string(),
    nickname: z.string().min(3, {
        message: "Must be 3 or more characters long"
    }).max(15, {
        message: "Must be 15 or fewer characters long",
      }),
    username: z.string().max(15, {
      message: "Must be 15 or fewer characters long",
    }),
    email: z.string().email({
         message: "Invalid email address" 
        }),
    password: z.string().min(8, {
        message: "Must be 8 or more characters long"
    })
    .max(24, {
      message: "Not more than 24 characters allowed.",
    }),
  }).required();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        role: "CHEF",
        nickname: "",
        username: "",
        email: "",
        password: "",
    },
  })

const handleRegister = (formValue: IUser) => {
    const {role, nickname, username, email,  password } = formValue;

    register(role, nickname, username, email, password).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
        navigate("/login");
        window.location.reload();
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setSuccessful(false);
      }
    );
  };
  return( 
    <div>
        <Form {...form}>
        {!successful && (
          <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-8">
          <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nickname</FormLabel>
                  <FormControl>
                    <Input placeholder="nickname" {...field} />
                  </FormControl>
                  <FormMessage
                  autoCorrect="false" />
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
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage
                  autoCorrect="false"
                   />
                </FormItem>
              )}
            />
            <div>
            <Button type="submit">Submit</Button>
                </div>
                {message && (
              <div className="form-group">
                <div  className={
                    successful ? "alert alert-success" : "alert alert-danger"} role="alert">
                  {message}
                </div>
              </div>
            )}
          </form>
        )}
        </Form>
        </div>
  )
}

export default Register