import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ScreenLoader from "@/components/ScreenLoader";
import NotFoundPage from "./NotFoundPage";

import useFetchSpecificModerations from "@/hooks/queries/useFetchSpecificModeration";
import useAuthStore from "@/hooks/stores/useAuthStore";

const ModerationPage = () => {
  const { recipeId } = useParams();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const userDetails = useAuthStore((state) => state.userDetails);
  const navigateTo = useNavigate();

  const { data: moderation, isLoading } = useFetchSpecificModerations(recipeId, isLoggedIn);

  useEffect(() => {
    if (!userDetails || !moderation) return;

    if (userDetails._id.toString() !== moderation?.forPost?.byUser.toString()) {
      toast.error("Unauthorized Access", { duration: 5000 });
      navigateTo(-1);
    }
  }, [userDetails, moderation]);

  if (isLoading) return <ScreenLoader />;
  if (!moderation) return <NotFoundPage />;

  const { title } = moderation.forPost;
  const { firstName, lastName } = moderation.moderatedBy;
  const { status, notes } = moderation;

  return (
    <section className="flex h-full w-full items-center justify-center">
      <Card className="bg-background w-full max-w-lg gap-5">
        <CardHeader>
          <CardTitle className="text-primary text-xl font-bold">Moderation Status</CardTitle>
          <CardDescription />
        </CardHeader>

        <CardContent className="text-foreground">
          <div className="flex flex-col gap-3">
            {[
              { label: "Recipe Title", value: title },
              { label: "Moderated By", value: `${firstName} ${lastName}` },
              {
                label: "Status",
                value: status,
                className:
                  status === "approved"
                    ? "text-green-500"
                    : status === "rejected"
                      ? "text-red-500"
                      : "text-yellow-500",
              },
              { label: "Notes", value: notes || "No notes provided" },
            ].map(({ label, value, className }, index) => (
              <div key={index} className="flex items-center gap-2">
                <p className="font-semibold">{label}:</p>
                <p className={className || ""}>{value}</p>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="justify-end gap-2">
          {status === "approved" ? (
            <Button size="sm" onClick={() => navigateTo(`/recipes/${recipeId}`)}>
              View Recipe
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => navigateTo(-1)}>
                Go Back
              </Button>
              <Button size="sm" onClick={() => navigateTo(`/recipes/${recipeId}/edit`)}>
                Edit Recipe
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </section>
  );
};

export default ModerationPage;
