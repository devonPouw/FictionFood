import { IUser } from "./User"

export interface IRecipeData {
    id: number | null,
    title: string,
    summary: string,
    content: string,
    recipeIngredients: IRecipeIngredientData[],
    categories: ICategoryData[],
    isPublished: boolean,
    rating: number,
    author: IUser,
    datePublished: string
    image: IImageData
}
export interface IRecipeIngredientData {
    id: number | null,
    name: string,
    ingredient: string,
    quantity: number,
    unit: string
}
export interface IRecipeList {
    recipes: IRecipeData[],
    currentPage: number,
    totalItems: number,
    totalPages: number
}
export interface ICategoryData {
    id: number | null,
    name: string
}
export interface IImageData{
    id: number | null,
    name: string,
    type: string,
    imageData: number[]
}