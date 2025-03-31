import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useParams } from "react-router-dom";
import { trackPostView } from "@/config/postViewApi";
import { useEffect, useState, useRef, useCallback } from "react";
import usePageStore from "@/hooks/stores/usePageStore";
import useFetchReactions from "@/hooks/queries/useFetchReactions";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import useFetchRecipe from "@/hooks/queries/useFetchRecipe";
import { Button } from "@/components/ui/button";
import useConfirmDialog from "@/components/useConfirmDialog";
import {
  MessageCircleMore,
  Smile,
  SmilePlus,
  Play,
  Download,
  SendHorizontal,
  MoreVertical,
} from "lucide-react";
import useImageModalStore from "@/hooks/stores/useImageModalStore";
import useToggleReaction from "@/hooks/mutations/useToggleReaction";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useRecipeStore from "@/hooks/stores/useRecipeStore";
import RecipeOptions from "./components/RecipeOptions";
import useAuthStore from "@/hooks/stores/useAuthStore";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { splitParagraphs } from "@/utils/textUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ScreenLoader from "@/components/ScreenLoader";
import useCommentMutations from "@/hooks/mutations/useCommentMutations";
import useFetchComments from "@/hooks/queries/useFetchComments";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const reactions = [
  { value: "heart", reaction: "❤️" },
  { value: "drool", reaction: "🤤" },
  { value: "neutral", reaction: "😐" },
];

// ----------------------------------------------------------------
// TODO: If there is no updatedAt, use createdAt
// TODO: Seperate other components if there is time
// TODO: Add Fallback Image When Loading Error

const ViewRecipe = () => {
  const { recipeId } = useParams();
  const { setPage, setSubPage } = usePageStore();
  const { recipe, setRecipe, clearRecipe } = useRecipeStore();
  const { data: recipeData, isLoading, error } = useFetchRecipe(recipeId);

  useEffect(() => {
    document.title = "View | Kulinarya";
    setPage({ href: "/recipes", name: "Recipes" });
    setSubPage({
      href: `/recipes/${recipeId}`,
      name: recipe?.title || "Recipe View",
    });

    if (recipeData) {
      setRecipe(recipeData);
    }

    return () => {
      console.log("Clearing recipe...");
      clearRecipe();
    };
  }, [recipeId, recipeData]);

  useEffect(() => {
    if (recipeId) {
      trackPostView(recipeId); // ✅ Track view when the page loads
    }
  }, [recipeId]);

  useEffect(() => {
    console.log("Updated Recipe State:", recipe);
  }, [recipe]);

  if (isLoading || !recipe) return <ScreenLoader />;
  // TODO: Create a custom error component for this things
  if (error) return <p>Error loading recipe</p>;

  const { videoUrl } = recipe;

  return (
    <section className="flex w-full flex-col gap-10 px-5 py-20 min-[400px]:px-10 min-[500px]:px-16 sm:px-12 md:px-16 lg:px-24 xl:px-40">
      <CustomBreadCrumb />

      {/* Main Content */}
      <div className="flex flex-col gap-10 lg:flex-row">
        {/* Left Side */}
        <div className="flex flex-col gap-8 lg:flex-1">
          <RecipeImages />
          <RecipeTitleSection />
          <RecipeDescription />

          <CommentsPreviewSection />
        </div>

        {/* Right Side */}
        <div className="flex flex-col items-center gap-32 lg:w-[35%] 2xl:w-[30%]">
          <div className="flex w-full flex-col gap-3 overflow-hidden rounded-lg border shadow-lg">
            {videoUrl && <VideoPlayer src={videoUrl} />}
            <RecipeTabs />
          </div>

          <OwnerProfileCard />
        </div>
      </div>
    </section>
  );
};

// ! Custom Components ---------------------------------------------

const ReactionsDialog = () => {
  const { recipe } = useRecipeStore();
  const [open, setOpen] = useState(false);
  const { _id: recipeId } = recipe;

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFetchReactions(recipeId, open);

  const observer = useRef();

  const lastReactorRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="hover:text-primary flex cursor-pointer items-center gap-2 border-l px-4 py-2 text-sm transition-colors">
          <Smile className="size-5" />
          <p>
            View <span className="hidden sm:inline">Reactions</span>
          </p>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg px-2 sm:px-6">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl font-semibold">Reactions</DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto p-2">
          {isLoading && <p>Loading reactions...</p>}
          {error && <p className="text-destructive-foreground">Failed to load reactions.</p>}

          {data?.pages?.length > 0 ? (
            data.pages.map((page, pageIndex) => (
              <div key={pageIndex} className="mb-4 flex flex-col gap-4">
                {page.reactions.map((reaction, index) => {
                  if (pageIndex === data.pages.length - 1 && index === page.reactions.length - 1) {
                    return (
                      <div ref={lastReactorRef} key={reaction._id}>
                        <ReactionItem reaction={reaction} />
                      </div>
                    );
                  }
                  return <ReactionItem key={reaction._id} reaction={reaction} />;
                })}
              </div>
            ))
          ) : (
            <p>No reactions yet.</p>
          )}
          {isFetchingNextPage && <p>Loading more reactions...</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ReactionItem = ({ reaction }) => {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-2">
      {/* Profile Picture */}
      <Avatar
        onClick={() => alert("Coming Soon")}
        className="cursor-pointer transition-transform hover:scale-125"
      >
        <AvatarImage src={reaction.byUser.profilePictureUrl} />
        <AvatarFallback>
          {reaction.byUser.firstName[0]}
          {reaction.byUser.lastName[0]}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span
            onClick={() => alert("Coming Soon")}
            className="hover:text-primary cursor-pointer font-semibold transition-colors"
          >
            {reaction.byUser.firstName} {reaction.byUser.lastName}
          </span>
          <span className="text-muted-foreground text-xs">
            • {dayjs(reaction.createdAt).fromNow()}
          </span>
        </div>
      </div>

      <span className="text-2xl">
        {reactions.find((r) => r.value === reaction.reaction)?.reaction}
      </span>
    </div>
  );
};

const CommentsPreviewSection = () => {
  const { isLoggedIn } = useAuthStore();
  const { recipe } = useRecipeStore();
  const { commentsPreview } = recipe;

  return (
    <>
      <div className="flex flex-col gap-2">
        <CommentsAndReactionButtons />

        {isLoggedIn && <CommentTextArea />}
      </div>

      <Comments comments={commentsPreview} />
    </>
  );
};

const CommentsDialog = () => {
  const { recipe } = useRecipeStore();
  const [open, setOpen] = useState(false);
  const { _id: recipeId } = recipe;

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFetchComments(recipeId, open);

  const observer = useRef();

  const lastCommentRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="hover:text-primary flex cursor-pointer items-center gap-2 border-l px-4 py-2 text-sm transition-colors">
          <MessageCircleMore className="size-5" />
          <p>
            View <span className="hidden sm:inline">Comments</span>
          </p>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg px-2 sm:px-6">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl font-semibold">Comments</DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto p-2">
          {isLoading && <p>Loading comments...</p>}
          {error && <p className="text-destructive-foreground">Failed to load comments.</p>}

          {data?.pages?.length > 0 ? (
            data.pages.map((page, pageIndex) => (
              <div key={pageIndex} className="mb-6 flex flex-col gap-6">
                {page.comments.map((comment, index) => {
                  if (pageIndex === data.pages.length - 1 && index === page.comments.length - 1) {
                    return (
                      <div ref={lastCommentRef} key={comment._id}>
                        <Comments comments={[comment]} />
                      </div>
                    );
                  }
                  return <Comments key={comment._id} comments={[comment]} />;
                })}
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
          {isFetchingNextPage && <p>Loading more comments...</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CommentItem = ({ comment }) => {
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.content);
  const { userDetails, isLoggedIn } = useAuthStore();
  const { updateCommentMutation, deleteCommentMutation } = useCommentMutations(comment.fromPost);
  const { openDialog, ConfirmDialog } = useConfirmDialog();

  const handleEdit = () => {
    setIsEditing(true);
    setIsOptionOpen(false);
  };

  const handleSave = () => {
    if (editedComment.trim() && editedComment !== comment.content) {
      updateCommentMutation.mutate({
        commentId: comment._id,
        content: editedComment,
      });
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const isConfirmed = await openDialog("Are you sure you want to delete this comment?");
    if (isConfirmed) {
      deleteCommentMutation.mutate(comment._id);
    }
  };

  return (
    <div className="flex max-w-xl items-start gap-3">
      {/* Profile Picture */}
      <Avatar
        onClick={() => alert("Coming Soon")}
        className="cursor-pointer transition-transform hover:scale-125"
      >
        <AvatarImage src={comment.byUser.profilePictureUrl} />
        <AvatarFallback>
          {comment.byUser.firstName[0]}
          {comment.byUser.lastName[0]}
        </AvatarFallback>
      </Avatar>

      {/* Comment Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span
            onClick={() => alert("Coming Soon")}
            className="hover:text-primary cursor-pointer font-semibold transition-colors"
          >
            {comment.byUser.firstName} {comment.byUser.lastName}
          </span>
          <span className="text-muted-foreground text-xs">
            • {dayjs(comment.createdAt).fromNow()}
          </span>
        </div>

        {isEditing ? (
          <CommentTextArea
            type="edit"
            value={editedComment}
            onChange={setEditedComment}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <p className="text-muted-foreground text-sm">{comment.content}</p>
        )}
      </div>

      {/* Options Menu (Only for comment owner) */}
      {isLoggedIn && comment.byUser._id === userDetails?._id && (
        <Popover open={isOptionOpen} onOpenChange={setIsOptionOpen}>
          <PopoverTrigger asChild>
            <button className="hover:text-primary cursor-pointer transition-colors">
              <MoreVertical className="size-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-28 overflow-hidden p-0">
            <Button
              variant="ghost"
              className="w-full justify-center rounded-none"
              onClick={handleEdit}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              className="text-destructive-foreground w-full justify-center rounded-none"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </PopoverContent>
        </Popover>
      )}
      {ConfirmDialog}
    </div>
  );
};

const Comments = ({ comments }) => {
  return (
    <div className="flex flex-col gap-6">
      {comments.map((comment) => (
        <CommentItem key={comment._id} comment={comment} />
      ))}
    </div>
  );
};

const CommentTextArea = ({ type = "add", value = "", onChange, onSave, onCancel }) => {
  const [comment, setComment] = useState(value);
  const { recipe } = useRecipeStore();
  const { _id: recipeId } = recipe;

  const { addCommentMutation } = useCommentMutations(recipeId);

  const handleAddComment = () => {
    if (comment.trim()) {
      addCommentMutation.mutate(comment);
      setComment("");
    }
  };

  return (
    <div className="relative w-full max-w-xl">
      <Textarea
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
          if (onChange) onChange(e.target.value); // Call onChange for edit mode
        }}
        placeholder="Type your comment..."
        className="pr-12"
      />

      {type === "add" ? (
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-2 bottom-2 p-2"
          onClick={handleAddComment}
        >
          <SendHorizontal className="text-muted-foreground size-5" />
        </Button>
      ) : (
        <div className="mt-2 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onSave(comment)}>Save</Button>
        </div>
      )}
    </div>
  );
};

const RecipeTabs = () => {
  const [activeTab, setActiveTab] = useState("ingredients");
  const { recipe } = useRecipeStore();
  const { ingredients, procedure } = recipe;

  return (
    <Card className="bg-background text-foreground w-full overflow-hidden rounded-t-none rounded-b-lg border-0 p-0 pt-2">
      {/* Tabs */}
      <div className="flex border-b">
        {[
          { id: "ingredients", label: "Ingredients" },
          { id: "procedure", label: "Procedure" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`cursor-pointer border-b-3 px-5 py-1 font-bold transition-opacity hover:opacity-80 ${
              activeTab === tab.id ? "border-primary" : "border-background"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <CardContent className="text-sm">
        {activeTab === "ingredients" ? (
          <ul className="list-disc space-y-2 px-5">
            {ingredients.map(({ _id, quantity, unit, name }) => (
              <li key={_id}>
                {quantity} {unit} {name}
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-2">
            {procedure.map(({ _id, stepNumber, content }) => (
              <li key={_id}>
                <strong>Step {stepNumber}:</strong> {content}
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <div className="flex items-center border-t p-5">
        <Button onClick={() => alert("Coming Soon")}>
          <Download className="size-5" />
          Download
        </Button>
      </div>
    </Card>
  );
};

const VideoPlayer = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlay = () => {
    videoRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-t-lg">
      {/* Video with Blur */}
      <video
        ref={videoRef}
        src={src}
        className={`h-auto w-full rounded-t-lg transition ${
          !isPlaying ? "blur-xs brightness-50" : "blur-0 brightness-100"
        }`}
        controls={isPlaying}
      />

      {/* Play Button */}
      {!isPlaying && (
        <button
          onClick={handlePlay}
          className="group absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-black/10"
        >
          <Play className="group-hover:text-primary size-20 text-white transition-colors" />
        </button>
      )}
    </div>
  );
};

const RecipeImages = () => {
  const { openImageModal } = useImageModalStore();
  const { recipe } = useRecipeStore();
  const { mainPictureUrl, additionalPicturesUrls } = recipe;

  const handleImageClick = (url) => {
    openImageModal(url);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Main Image */}
      <img
        src={mainPictureUrl}
        alt="Main Recipe"
        className="h-[400px] w-full cursor-zoom-in rounded-lg object-cover shadow-lg transition will-change-[transform,opacity] hover:opacity-80 sm:h-[600px] md:h-[700px] lg:h-[600px] 2xl:h-[700px]"
        onClick={() => handleImageClick(mainPictureUrl)}
        loading="lazy"
      />

      {/* Additional Images */}
      <div className="grid grid-cols-5 gap-2">
        {additionalPicturesUrls.map((url, index) => (
          <div
            key={index}
            className="aspect-square h-16 w-full overflow-hidden rounded-lg shadow-lg min-[500px]:h-20 sm:h-24 md:h-28 lg:h-32"
          >
            <img
              src={url}
              alt={`Additional ${index + 1}`}
              className="h-full w-full cursor-zoom-in object-cover transition will-change-[transform,opacity] hover:opacity-80"
              onClick={() => handleImageClick(url)}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const CommentsAndReactionButtons = () => {
  const { isLoggedIn } = useAuthStore();
  const { recipe } = useRecipeStore();
  const { totalComments, totalReactions } = recipe;

  const handleReaction = (reaction) => {
    console.log("User reacted with:", reaction);
  };

  return (
    <div className="flex max-w-fit flex-col justify-center gap-2 sm:flex-row">
      <div className="flex max-w-fit items-center overflow-hidden rounded-lg border">
        {isLoggedIn && <AddReactionButton onReact={handleReaction} />}
        <CommentsDialog />
        <ReactionsDialog />
      </div>

      <div className="flex justify-center gap-3">
        <p className="text-muted-foreground flex items-center gap-1 text-xs">
          {`${totalReactions} ${totalReactions === 1 ? "Reaction" : "Reactions"}`}
        </p>

        <p className="text-muted-foreground flex items-center gap-1 text-xs">
          {`${totalComments} ${totalComments === 1 ? "Comment" : "Comments"}`}
        </p>
      </div>
    </div>
  );
};

const AddReactionButton = () => {
  const { recipe } = useRecipeStore();
  const { _id: recipeId, userReaction } = recipe;
  const existingReaction = userReaction?.reaction;
  const [selectedReaction, setSelectedReaction] = useState(existingReaction || null);
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: toggleReaction } = useToggleReaction(recipeId);

  const handleReactionClick = (reactionValue) => {
    setSelectedReaction((prev) => (prev === reactionValue ? null : reactionValue));
    toggleReaction(reactionValue);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={`w-auto max-w-fit cursor-pointer px-4 py-2 text-sm ${
            selectedReaction
              ? "transition-transform hover:scale-125"
              : "hover:text-primary transition-colors"
          }`}
        >
          {selectedReaction ? (
            <span className="text-lg transition-transform">
              {reactions.find((r) => r.value === selectedReaction)?.reaction}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <SmilePlus className="size-5" />
              <span>React</span>
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="flex gap-4 p-2">
        {reactions.map(({ value, reaction }) => (
          <button
            key={value}
            className="cursor-pointer text-2xl transition-transform hover:scale-125"
            onClick={() => handleReactionClick(value)}
          >
            {reaction}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
};

const RecipeTitleSection = () => {
  const { userDetails, isLoggedIn } = useAuthStore();
  const { recipe } = useRecipeStore();
  const { title, byUser, _id: recipeId } = recipe;
  const { firstName, lastName } = byUser;
  const ownerName = `${firstName} ${lastName}`;
  const navigateTo = useNavigate();

  return (
    <div className="flex justify-between gap-3">
      <div className="flex flex-col gap-1">
        <p className="text-primary text-2xl font-bold min-[400px]:text-3xl sm:text-5xl lg:max-xl:text-4xl">
          {title}
        </p>
        <p className="text-sm">
          By{" "}
          <span
            className="hover:text-primary cursor-pointer transition"
            onClick={() => alert("Coming Soon")}
          >
            {ownerName}
          </span>
        </p>
      </div>

      {isLoggedIn && byUser._id === userDetails?._id && <RecipeOptions recipeId={recipeId} />}
    </div>
  );
};

const RecipeDescription = () => {
  const { recipe } = useRecipeStore();
  const { description } = recipe;

  const MAX_LENGTH = 300;
  const [isExpanded, setIsExpanded] = useState(false);
  const formattedDescription = splitParagraphs(description);

  // If already short
  const fullText = formattedDescription.join("\n");
  if (fullText.length <= MAX_LENGTH) {
    return (
      <div className="text-muted-foreground text-justify text-sm leading-loose">
        <ParagraphList paragraphs={formattedDescription} />
      </div>
    );
  }

  let charCount = 0;
  let truncatedText = [];

  for (let para of formattedDescription) {
    if (charCount + para.length > MAX_LENGTH) {
      const remaining = MAX_LENGTH - charCount;
      truncatedText.push(para.slice(0, remaining) + "...");
      break;
    }

    truncatedText.push(para);
    charCount += para.length;
  }

  return (
    <div className="text-muted-foreground flex flex-col text-justify text-sm leading-loose">
      <ParagraphList paragraphs={isExpanded ? formattedDescription : truncatedText} />
      <Button onClick={() => setIsExpanded(!isExpanded)} className="mt-8 self-start">
        {isExpanded ? "Show Less" : "Show More"}
      </Button>
    </div>
  );
};

const ParagraphList = ({ paragraphs, className }) => {
  return paragraphs.map((paragraph, index, arr) => (
    <p key={index} className={cn(index === arr.length - 1 ? "" : "mb-5", className)}>
      {paragraph}
    </p>
  ));
};

const OwnerProfileCard = () => {
  const { recipe } = useRecipeStore();
  const owner = recipe.byUser;
  const { profilePictureUrl, bio, firstName, lastName } = owner;
  const ownerName = `${firstName} ${lastName}`;
  const MAX_BIO_LENGTH = 200;

  const truncatedBio = bio.length > MAX_BIO_LENGTH ? bio.slice(0, MAX_BIO_LENGTH) + "..." : bio;
  const navigate = useNavigate();

  return (
    <div className="bg-background text-foreground flex max-w-xl flex-col items-center rounded-lg border px-10 pb-10 shadow-lg">
      <img
        src={profilePictureUrl}
        alt="ownerPic"
        className="border-primary aspect-square size-32 -translate-y-1/2 rounded-full border-3 object-cover sm:size-40 lg:max-xl:size-36"
      />

      <div className="-mt-14 flex flex-col items-center gap-3 min-[400px]:-mt-10 sm:-mt-16 sm:gap-8 lg:max-xl:-mt-12 lg:max-xl:gap-5">
        <p className="text-xl font-bold sm:text-3xl lg:max-xl:text-xl xl:max-2xl:text-2xl">
          {ownerName}
        </p>
        <p className="text-center text-sm leading-loose">{truncatedBio}</p>

        <Button className="w-full" onClick={() => navigate(`/profile/${recipe?.byUser?._id}`)}>
          View Profile
        </Button>
      </div>
    </div>
  );
};
export default ViewRecipe;
