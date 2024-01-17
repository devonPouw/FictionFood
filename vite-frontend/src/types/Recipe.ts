
export interface IRecipeData {
    id: number | null,
    title: string,
    summary: string,
    categories: string[],
    rating: number,
    author: string,
    datePublished: string
    image: number[]
}
export interface IPostRecipeData {
    id: number | null,
    title: string,
    summary: string,
    content: string,
    recipeIngredients: IRecipeIngredientData[],
    categories: string[],
    isPublished: boolean,
    rating: number,
    author: string,
    datePublished: string
    image: number[]
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
export interface IImageData{
    id: number | null,
    name: string,
    type: string,
    imageData: number[]
}