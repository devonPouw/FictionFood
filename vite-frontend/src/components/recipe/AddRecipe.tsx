import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import * as z from "zod";
import { backendApi } from "@/services/ApiMappings";
import { useAuth } from "@/services/auth/AuthContext";
import { IRecipeIngredientData } from "@/types/Recipe";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "../ui/select";
import { SelectTrigger, SelectValue } from "@radix-ui/react-select";

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
  recipeIngredients: z.array(
    z.object({
      ingredient: z.string().min(1, { message: "Ingredient is required" }),
      quantity: z.string(),
      unit: z.string(),
    })
  ),
  // .nonempty({ message: "At least one ingredient is required" })
  categories: z.array(z.string()),
  // .nonempty({ message: "At least one category is required" })
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
  const [newIngredient, setNewIngredient] = useState<IRecipeIngredientData>({
    ingredient: "",
    quantity: "",
    unit: "GRAM",
  });
  const [newCategory, setNewCategory] = useState<string>("");
  const { getToken } = useAuth();

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

  const onDrop = (acceptedFiles: File[]) => {
    form.setValue("image", acceptedFiles[0]);
  };

  const addIngredient = () => {
    if (!newIngredient.ingredient.trim()) return;

    const parsedQuantity = parseFloat(newIngredient.quantity);
    const quantity = isNaN(parsedQuantity) ? 0 : parsedQuantity;

    const ingredientList = form.getValues("recipeIngredients");
    form.setValue("recipeIngredients", [
      ...ingredientList,
      { ...newIngredient, quantity: quantity.toString() },
    ]);

    setNewIngredient({ ingredient: "", quantity: "", unit: "GRAM" });
  };

  const removeIngredientAtIndex = (index: number) => {
    const updatedIngredients = form
      .getValues("recipeIngredients")
      .filter((_, i) => i !== index);
    form.setValue("recipeIngredients", updatedIngredients, {
      shouldValidate: true,
    });
  };

  const addCategory = () => {
    if (!newCategory.trim()) return;
    const currentCategories = form.getValues("categories");
    form.setValue("categories", [...currentCategories, newCategory.trim()], {
      shouldValidate: true,
    });

    setNewCategory("");
  };

  const removeCategoryAtIndex = (index: number) => {
    const updatedCategories = form
      .getValues("categories")
      .filter((_, i) => i !== index);
    form.setValue("categories", updatedCategories, {
      shouldValidate: true,
    });
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

  const handlePostRecipe = async () => {
    setMessage("");
    setLoading(true);
    console.log("");
    const token = getToken();
    if (token === null) {
      navigate("/login");
      setLoading(false);
      return;
    }
    const formData = new FormData();
    const {
      title,
      summary,
      content,
      isPublished,
      recipeIngredients,
      categories,
    } = form.getValues();

    const recipeData = {
      title,
      summary,
      content,
      isPublished,
      recipeIngredients,
      categories,
    };

    formData.append("recipe", JSON.stringify(recipeData));
    if (form.getValues().image) {
      formData.append("image", form.getValues().image);
    }
    try {
      const response = await backendApi.postRecipe(formData, token);
      console.log(response);
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
              {form.getValues().categories.map((category, index) => (
                <Button
                  key={index}
                  type="button"
                  onClick={() => {
                    removeCategoryAtIndex(index);
                  }}
                >
                  {category}
                </Button>
              ))}
              <FormField
                control={form.control}
                name="categories"
                render={() => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Category"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage autoCorrect="false" />
                  </FormItem>
                )}
              />
              <Button
                className="justify-self-end"
                type="button"
                onClick={() => addCategory()}
              >
                Add Category
              </Button>
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
              <FormItem>
                {form
                  .getValues()
                  .recipeIngredients.map((recipeIngredient, index) => (
                    <Button
                      type="button"
                      key={index}
                      onClick={() => removeIngredientAtIndex(index)}
                    >
                      {recipeIngredient.ingredient}, {recipeIngredient.quantity}{" "}
                      {recipeIngredient.unit}
                    </Button>
                  ))}
              </FormItem>
              <FormField
                control={form.control}
                name="recipeIngredients"
                render={() => (
                  <FormItem>
                    <FormLabel>Add an ingredient</FormLabel>
                    <FormControl>
                      <div>
                        <Input
                          placeholder="Ingredient"
                          value={newIngredient.ingredient}
                          onChange={(e) =>
                            setNewIngredient({
                              ...newIngredient,
                              ingredient: e.target.value,
                            })
                          }
                        />
                        <div className="flex items-center justify-around">
                          <Input
                            className="w-1/3 min-w-[280px]"
                            type="number"
                            placeholder="Quantity"
                            value={newIngredient.quantity}
                            onChange={(e) =>
                              setNewIngredient({
                                ...newIngredient,
                                quantity: e.target.value,
                              })
                            }
                          />
                          <FormItem className="flex flex-col">
                            <FormLabel className="text-lg">Unit</FormLabel>
                            <Select
                              onValueChange={(value) =>
                                setNewIngredient({
                                  ...newIngredient,
                                  unit: value,
                                })
                              }
                            >
                              <SelectTrigger className="w-full min-w-[280px]">
                                <SelectValue placeholder="Select the matching unit" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Unit</SelectLabel>
                                  {unitEnum.options.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option.toLowerCase()}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormItem>
                          <Button type="button" onClick={() => addIngredient()}>
                            Add Ingredient
                          </Button>
                        </div>
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
