
export interface IRecipeData {
    id: number,
    title: string,
    summary: string,
    categories: string[],
    rating: number,
    author: string,
    datePublished: string,
    imageData: Uint8Array
}
export interface IPostRecipeData {
    title: string;
    summary: string;
    content: string;
    recipeIngredients: IRecipeIngredientData[];
    categories: string[];
    isPublished: boolean;
    image?: File;
  }
export interface IRecipeIngredientData {
    ingredient: string,
    quantity: string,
    unit: string;
}
export interface IRecipeList {
    recipes: IRecipeData[],
    currentPage: number,
    totalItems: number,
    totalPages: number
}