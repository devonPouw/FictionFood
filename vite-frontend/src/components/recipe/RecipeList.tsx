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
import { IRecipeList } from "@/types/Recipe";

interface IRecipeListState extends IRecipeList {
  currentPage: number;
}

export default function RecipeList() {
  const initialRecipeListState: IRecipeListState = {
    recipes: [],
    currentPage: 1,
    totalItems: 0,
    totalPages: 0,
  };

  const [recipeList, setRecipeList] = useState<IRecipeListState>(
    initialRecipeListState
  );
  const amountOfRecipes = 1;

  const fetchRecipes = async (page: number): Promise<void> => {
    try {
      const response = await backendApi.getAllRecipes(
        page - 1,
        amountOfRecipes
      );
      if (response && response.data) {
        setRecipeList({
          ...response.data,
          currentPage: page,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageChange = (newPage: number): void => {
    fetchRecipes(newPage);
  };

  useEffect(() => {
    fetchRecipes(recipeList.currentPage);
  }, []);

  const renderPageNumbers = (
    currentPage: number,
    totalPages: number,
    onPageChange: (page: number) => void
  ): JSX.Element[] => {
    const pageNumbers: JSX.Element[] = [];
    const visiblePages = 3; // Adjust how many pages you want to show before and after the current page

    let startPage: number, endPage: number;

    if (totalPages <= visiblePages) {
      // Less than visiblePages+1 total pages so show all
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

  return (
    <div>
      <NavBar />
      <RecipePreview recipeList={recipeList} />
      <Pagination>
        <PaginationContent>
          {recipeList.currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(recipeList.currentPage - 1);
                }}
              />
            </PaginationItem>
          )}
          {renderPageNumbers(
            recipeList.currentPage,
            recipeList.totalPages,
            handlePageChange
          ).map((pageNumber) => pageNumber)}
          {recipeList.currentPage < recipeList.totalPages && (
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(recipeList.currentPage + 1);
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
