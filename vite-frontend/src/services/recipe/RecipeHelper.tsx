import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export const useGoToRecipe = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const goToRecipe = (id: number | null) => {
    if (id !== null) {
      try {
        navigate(`/recipes/${id}`);
      } catch (error) {
        toast({
          description: "Recipe not found",
        });
      }
    }
  };

  return goToRecipe;
};
