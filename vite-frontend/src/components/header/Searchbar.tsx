import { useState, useEffect } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { backendApi } from "@/services/ApiMappings";
import { IRecipeList, initialRecipeListState } from "@/types/Recipe";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useToast } from "../ui/use-toast";
import { useGoToRecipe } from "@/services/recipe/RecipeHelper";
import { AxiosError } from "axios";
const Searchbar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [recipeList, setRecipeList] = useState<IRecipeList>(
    initialRecipeListState
  );
  const page = 0;
  const amountOfRecipes = 3;
  const viewOwnRecipes = false;
  const { toast } = useToast();

  const goToRecipe = useGoToRecipe();
  const fetchRecipes = async (
    page: number,
    amountOfRecipes: number,
    viewOwnRecipes: boolean,
    searchTerm: string
  ): Promise<void> => {
    try {
      const response = await backendApi.getAllRecipes(
        page,
        amountOfRecipes,
        viewOwnRecipes,
        searchTerm
      );
      if (response && response.data) {
        setRecipeList(response.data);
        console.log(response.data);
      }
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

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    if (event.target.value.length < 2) return;
    fetchRecipes(page, amountOfRecipes, viewOwnRecipes, event.target.value);
  };
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
        if (!open) setSearchTerm("");
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => {
              fetchRecipes(page, amountOfRecipes, viewOwnRecipes, searchTerm);
            }}
            className="inline-flex items-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
          >
            <span className="hidden lg:inline-flex">Search recipes...</span>
            <span className="inline-flex lg:hidden">Search...</span>
            <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[825px]">
          <Command onChange={handleSearch}>
            <CommandInput
              value={searchTerm}
              placeholder="Type a command or search..."
            />
            <CommandList>
              <ul className="flex flex-col items-center">
                {recipeList.recipes.map((recipe) => (
                  <li
                    className="h-auto w-11/12 flex rounded-lg border border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:bg-gray-100 lg:dark:bg-zinc-800/30 mt-2 cursor-pointer  hover:-translate-x-2 transition-transform duration-300 ease-in-out"
                    key={recipe.id}
                    onClick={() => goToRecipe(recipe.id)}
                  >
                    <div className="p-2 flex w-1/2 max-h-[180px]">
                      <img
                        className="w-full max-h-[180px] object-contain rounded-lg"
                        src={
                          import.meta.env.VITE_HTTPS_BACKEND +
                          `/images/${recipe.imageId}`
                        }
                        alt={recipe.title}
                      />
                    </div>
                    <div className="w-1/2">
                      <div>
                        <span className="flex text-lg font-semibold justify-around items-center rounded-t-lg border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit border lg:bg-gray-100 lg:dark:bg-zinc-800/30">
                          {recipe.title}{" "}
                          <span className="text-sm font-normal">
                            {" "}
                            Rating: {recipe.rating} ★
                          </span>
                        </span>
                      </div>
                      <div className="flex justify-end flex-wrap">
                        {recipe.categories.map((category, index) => (
                          <div
                            className="border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:border lg:bg-gray-100 lg:dark:bg-zinc-800/30 rounded-lg p-1 m-1 text-sm whitespace-nowrap"
                            key={index}
                          >
                            <span>{category}</span>
                          </div>
                        ))}
                      </div>

                      <div className="p-1 border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:border lg:bg-gray-100 lg:dark:bg-zinc-800/30 text-sm">
                        Posted: {recipe.datePublished.slice(0, 10)}
                      </div>

                      <div className="rounded-b-lg p-1 border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:border lg:bg-gray-100 lg:dark:bg-zinc-800/30 text-sm">
                        Written by {recipe.author}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <CommandSeparator />
              <Label>Ingredients</Label>
              <ul>
                <li>Profile</li>
                <li>Billing</li>
                <li>Settings</li>
              </ul>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Searchbar;
