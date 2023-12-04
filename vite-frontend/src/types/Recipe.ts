export default interface IRecipeData {
    id?: number | null,
    title: string,
    content: string,
    published: boolean,
    rating: number,
    author: string
}