import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";

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
import { useDropzone } from "react-dropzone";

const MAX_FILE_SIZE: number = 5000000;
const ACCEPTED_IMAGE_TYPES: string[] = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const Register: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [successful, setSuccessful] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [imageSelected, setImageSelected] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
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
      avatar: z
        .any()
        .refine((file) => file.size <= MAX_FILE_SIZE, {
          message: "Image must be less than 5MB",
        })
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
          message: "Unsupported file type",
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
      avatar: {},
    },
  });

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      form.setValue("avatar", file);
      const fileUrl = URL.createObjectURL(file);
      setImageUrl(fileUrl);
      setImageSelected(true);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
    },
    multiple: false,
  });

  const handleRegister = async () => {
    setMessage("");
    setLoading(true);
    const formData = new FormData();
    const { role, nickname, username, email, password } = form.getValues();
    const registerData = { role, nickname, username, email, password };
    formData.append("register", JSON.stringify(registerData));
    if (form.getValues().avatar) {
      formData.append("avatar", form.getValues().avatar);
    }
    try {
      const response = await backendApi.register(formData);

      Auth.userLogin(response.data.accessToken, response.data.refreshToken);
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
    <div className="w-full h-full flex flex-col">
      <div className="container h-1/4 pt-3">
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
              <div
                {...getRootProps()}
                style={{
                  border: "2px dashed #ddd",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the image here...</p>
                ) : (
                  <p>
                    Drag 'n' drop an image here, or click to select an image
                  </p>
                )}
              </div>
              {imageSelected ? (
                imageUrl && (
                  <div className="w-1/2">
                    <img
                      className="w-1/2 aspect-square object-contain"
                      src={imageUrl}
                      alt=""
                    />
                  </div>
                )
              ) : (
                <div></div>
              )}
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
