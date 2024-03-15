import { backendApi } from "@/services/ApiMappings";
import { IChangePasswordData } from "@/types/User";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const ChangePassword = () => {
  const navigate: NavigateFunction = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleChangePassword = async (formValue: IChangePasswordData) => {
    const { currentPassword, newPassword, confirmationPassword } = formValue;
    setMessage("");
    setLoading(true);
    try {
      const response = await backendApi.changePassword(
        currentPassword,
        newPassword,
        confirmationPassword
      );
      setLoading(false);
      navigate("/");
      setMessage(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const formSchema = z
    .object({
      currentPassword: z.string().max(24, {
        message: "Passwords are not longer than 15 characters",
      }),
      newPassword: z.string().max(24, {
        message: "Passwords are not longer than 24 characters",
      }),
      confirmationPassword: z.string().max(24, {
        message: "Passwords are not longer than 24 characters",
      }),
    })
    .required();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmationPassword: "",
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
              onSubmit={form.handleSubmit(handleChangePassword)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="current password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage autoCorrect="false" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
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
              <FormField
                control={form.control}
                name="confirmationPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm new password</FormLabel>
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
                        form.control._defaultValues.currentPassword ===
                          form.getValues().currentPassword ||
                        form.control._defaultValues.newPassword ===
                          form.getValues().newPassword ||
                        form.control._defaultValues.confirmationPassword ===
                          form.getValues().confirmationPassword
                      }
                    >
                      Change password
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
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
