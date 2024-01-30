import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import * as z from "zod";
import { backendApi } from "@/services/ApiMappings";
import { useAuth } from "@/services/auth/AuthContext";
import { IPostRecipeData } from "@/types/Recipe";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import NavBar from "../header/NavBar";

const unitEnum = z.enum([
  "KILOGRAM",
  "GRAM",
  "LITRE",
  "CENTILITRE",
  "MILLILITRE",
  "TABLESPOON",
  "TEASPOON",
  "PIECE",
]);
const MAX_FILE_SIZE: number = 5000000;
const ACCEPTED_IMAGE_TYPES: string[] = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title must be under 100 characters" }),
  summary: z
    .string()
    .min(1, { message: "Summary is required" })
    .max(500, { message: "Summary must be under 500 characters" }),
  content: z.string().min(1, { message: "Content is required" }),
  recipeIngredients: z
    .array(
      z.object({
        name: z.string(),
        ingredient: z.string(),
        quantity: z.number(),
        unit: unitEnum,
      })
    )
    .nonempty({ message: "At least one ingredient is required" }),
  categories: z
    .array(z.string())
    .nonempty({ message: "At least one category is required" }),
  isPublished: z.boolean(),
  image: z
    .any()
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "Image must be less than 5MB",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Unsupported file type",
    }),
});

const AddRecipe: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const { getUser } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      summary: "",
      content: "",
      recipeIngredients: [],
      categories: [],
      isPublished: false,
      image: {},
    },
  });

  const {
    fields: recipeIngredientsFields,
    append,
    remove,
  } = useFieldArray({
    name: "recipeIngredients",
    control: form.control,
  });

  const onDrop = (acceptedFiles: File[]) => {
    form.setValue("image", acceptedFiles[0]);
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

  const handlePostRecipe = async (formValue: IPostRecipeData) => {
    const {
      title,
      summary,
      content,
      recipeIngredients,
      categories,
      isPublished,
      image,
    } = formValue;
    setMessage("");
    setLoading(true);
    try {
      const response = await backendApi.postRecipe(
        {
          title,
          summary,
          content,
          recipeIngredients,
          categories,
          isPublished,
          image,
        },
        getUser()
      );

      setLoading(false);
      navigate("/");
      setMessage(response.statusText);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col">
      <NavBar />
      <div className="container">
        <div className="container">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handlePostRecipe)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="title" {...field} />
                    </FormControl>
                    <FormMessage autoCorrect="false" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Input placeholder="summary" {...field} />
                    </FormControl>
                    <FormMessage autoCorrect="false" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="content" {...field} />
                    </FormControl>
                    <FormMessage autoCorrect="false" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="recipeIngredients"
                render={() => (
                  <FormItem>
                    <FormLabel>Add an ingredient</FormLabel>
                    <FormControl>
                      <div>
                        <label>Recipe Ingredients</label>
                        {recipeIngredientsFields.map((item, index) => (
                          <div key={item.id}>
                            <input
                              {...form.register(
                                `recipeIngredients.${index}.name`
                              )}
                              placeholder="Name"
                            />
                            <input
                              {...form.register(
                                `recipeIngredients.${index}.ingredient`
                              )}
                              placeholder="Ingredient"
                            />
                            <input
                              {...form.register(
                                `recipeIngredients.${index}.quantity`
                              )}
                              type="number"
                              placeholder="Quantity"
                            />
                            <select
                              {...form.register(
                                `recipeIngredients.${index}.unit`
                              )}
                            >
                              {unitEnum.options.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                            <button type="button" onClick={() => remove(index)}>
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() =>
                            append({
                              name: "",
                              ingredient: "",
                              quantity: 0,
                              unit: "GRAM",
                            })
                          }
                        >
                          Add Ingredient
                        </button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Submit as published</FormLabel>
                    <FormControl>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
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
              <div className="w-full flex justify-center">
                <div>
                  <div>
                    <Button
                      className="w-32 md:24 border-2"
                      type="submit"
                      disabled={
                        form.control._defaultValues.title ===
                          form.getValues().title ||
                        form.control._defaultValues.summary ===
                          form.getValues().summary
                      }
                    >
                      Submit
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

export default AddRecipe;
