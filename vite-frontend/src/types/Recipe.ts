export interface IRecipePreviewData {
  id: number | null;
  title: string;
  summary: string;
  categories: string[];
  rating: number;
  author: string;
  datePublished: string;
  imageId: number;
}
export interface IRecipeData {
  id: number | null;
  title: string;
  summary: string;
  content: string;
  recipeIngredients: IRecipeIngredientData[];
  categories: string[];
  rating: number;
  author: string;
  authorImageId: number;
  datePublished: string;
  imageId: number;
}
export interface IPostRecipeData {
  title: string;
  summary: string;
  content: string;
  recipeIngredients: IRecipeIngredientData[];
  categories: string[];
  isPublished: boolean;
}
export interface IRecipeIngredientData {
  ingredient: string;
  quantity: string;
  unit: string;
}
export interface IRecipeList {
  recipes: IRecipePreviewData[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}
export interface IRecipePreviewProps {
  recipeList: IRecipeList;
}
export interface IRecipeListState extends IRecipeList {
  currentPage: number;
}

export const initialRecipeListState: IRecipeListState = {
  recipes: [],
  currentPage: 1,
  totalItems: 0,
  totalPages: 0,
};
