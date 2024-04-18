import { useEffect, useState } from "react";
import NavBar from "../header/NavBar";
import RecipePreview from "./RecipePreview";
import Footer from "../footer/Footer";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { backendApi } from "@/services/ApiMappings";
import { IRecipeListState, initialRecipeListState } from "@/types/Recipe";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { AxiosError } from "axios";
import { useToast } from "../ui/use-toast";

export default function RecipeList() {
  const [recipeList, setRecipeList] = useState<IRecipeListState>(
    initialRecipeListState
  );
  const [amountOfRecipes, setAmountOfRecipes] = useState("6");
  const [search, setSearch] = useState("");
  const [viewOwnRecipes, setViewOwnRecipes] = useState(false);
  const { toast } = useToast();
  const fetchRecipes = async (
    page: number,
    amountOfRecipes: number,
    viewOwnRecipes: boolean,
    search: string
  ): Promise<void> => {
    try {
      const response = await backendApi.getAllRecipes(
        page - 1,
        amountOfRecipes,
        viewOwnRecipes,
        search
      );
      if (response && response.data) {
        setRecipeList({
          ...response.data,
          currentPage: page,
        });
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

  useEffect(() => {
    fetchRecipes(
      recipeList.currentPage,
      Number(amountOfRecipes),
      viewOwnRecipes,
      search
    );
  }, [viewOwnRecipes, amountOfRecipes]);

  const renderPageNumbers = (
    currentPage: number,
    totalPages: number,
    onPageChange: (page: number) => void
  ): JSX.Element[] => {
    const pageNumbers: JSX.Element[] = [];
    const visiblePages = 3;

    let startPage: number, endPage: number;

    if (totalPages <= visiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      // More than visiblePages+1 total pages so calculate start and end pages
      const pagesBeforeCurrentPage = Math.floor(visiblePages / 2);
      const pagesAfterCurrentPage = Math.ceil(visiblePages / 2) - 1;
      if (currentPage <= pagesBeforeCurrentPage) {
        startPage = 1;
        endPage = visiblePages;
      } else if (currentPage + pagesAfterCurrentPage >= totalPages) {
        startPage = totalPages - visiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - pagesBeforeCurrentPage;
        endPage = currentPage + pagesAfterCurrentPage;
      }
    }

    // Always show the first page if not currently in the range
    if (startPage > 1) {
      pageNumbers.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            isActive={currentPage === 1}
            onClick={(e) => {
              e.preventDefault();
              onPageChange(1);
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Add ellipsis if there are pages between first page and current page range
      if (startPage > 2) {
        pageNumbers.push(<PaginationEllipsis key="start-ellipsis" />);
      }
    }

    // Show the current range of page numbers
    for (let number = startPage; number <= endPage; number++) {
      pageNumbers.push(
        <PaginationItem key={number}>
          <PaginationLink
            href="#"
            isActive={number === currentPage}
            onClick={(e) => {
              e.preventDefault();
              onPageChange(number);
            }}
          >
            {number}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Always show the last page if not currently in the range
    if (endPage < totalPages) {
      // Add ellipsis if there are pages between current page range and last page
      if (endPage < totalPages - 1) {
        pageNumbers.push(<PaginationEllipsis key="end-ellipsis" />);
      }

      pageNumbers.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            isActive={currentPage === totalPages}
            onClick={(e) => {
              e.preventDefault();
              onPageChange(totalPages);
            }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pageNumbers;
  };

  const handleSearchOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      fetchRecipes(1, Number(amountOfRecipes), viewOwnRecipes, search);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="w-full h-52 flex justify-center">
        <div className="w-1/4 flex flex-col bg-gradient-to-b from-gray-300 to-gray-200 m-5 border rounded-lg dark:from-gray-700 dark:to-gray-800">
          <div className="flex m-2 items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <BsFillInfoSquareFill className="mr-2 h-5 w-5" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Searching for recipes can be done by title, author or
                    ingredient
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Input
              placeholder="Search for recipes"
              type="text"
              autoCorrect="false"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => handleSearchOnEnter(e)}
            />
            <Button
              className="ml-1"
              onClick={() => {
                fetchRecipes(
                  1,
                  Number(amountOfRecipes),
                  viewOwnRecipes,
                  search
                );
              }}
            >
              Search
            </Button>
          </div>
          <div className="flex items-center justify-between m-2">
            <div className="flex items-center space-x-1">
              <Checkbox
                id="viewOwnRecipes"
                checked={viewOwnRecipes}
                onCheckedChange={() =>
                  setViewOwnRecipes(viewOwnRecipes ? false : true)
                }
              />
              <Label htmlFor="viewOwnRecipes">View Own Recipes</Label>
            </div>
            <Label>
              <Select
                defaultValue="6"
                onValueChange={(value) => setAmountOfRecipes(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Amount of recipes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Amount of recipes</SelectLabel>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                    <SelectItem value="48">48</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Label>
          </div>
        </div>
      </div>
      {recipeList.totalItems !== 0 ? (
        <RecipePreview recipeList={recipeList} />
      ) : (
        <div className="w-full h-screen flex items-center justify-center">
          <div className="h-1/2">No recipes found that include "{search}"</div>
        </div>
      )}
      <Pagination className="p-4">
        <PaginationContent>
          {recipeList.currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  fetchRecipes(
                    recipeList.currentPage - 1,
                    Number(amountOfRecipes),
                    viewOwnRecipes,
                    search
                  );
                }}
              />
            </PaginationItem>
          )}
          {renderPageNumbers(
            recipeList.currentPage,
            recipeList.totalPages,
            (page) =>
              fetchRecipes(
                page,
                Number(amountOfRecipes),
                viewOwnRecipes,
                search
              )
          ).map((pageNumber) => pageNumber)}
          {recipeList.currentPage < recipeList.totalPages && (
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  fetchRecipes(
                    recipeList.currentPage + 1,
                    Number(amountOfRecipes),
                    viewOwnRecipes,
                    search
                  );
                }}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
      <Footer />
    </div>
  );
}
