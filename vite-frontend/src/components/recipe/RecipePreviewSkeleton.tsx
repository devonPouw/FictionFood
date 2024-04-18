import { Skeleton } from "../ui/skeleton";

const RecipePreviewSkeleton = () => {
  return (
    <div className="border rounded-lg">
      <Skeleton className="h-[50px] w-[300px] m-1" />
      <Skeleton className="h-[150px] w-[300px] m-1" />
      <Skeleton className="h-[50px] w-[300px] m-1" />
      <Skeleton className="h-[50px] w-[300px] m-1" />
      <Skeleton className="h-[50px] w-[300px] m-1" />
    </div>
  );
};

export default RecipePreviewSkeleton;
