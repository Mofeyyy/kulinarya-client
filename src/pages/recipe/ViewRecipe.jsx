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
import useAuthStore from "@/hooks/stores/useAuthStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { splitParagraphs } from "@/utils/textUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ScreenLoader from "@/components/ScreenLoader";
import useCommentMutations from "@/hooks/mutations/useCommentMutations";
import useFetchComments from "@/hooks/queries/useFetchComments";
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
  const { data: fetchedData, isLoading, error } = useFetchRecipe(recipeId);

  useEffect(() => {
    document.title = "View | Kulinarya";
    setPage({ href: "/recipes", name: "Recipes" });
    setSubPage({
      href: `/recipes/${recipeId}`,
      name: recipe?.title || "Recipe View",
    });

    if (fetchedData?.recipe) {
      setRecipe(fetchedData.recipe);
    }

    return () => {
      console.log("Clearing recipe...");
      clearRecipe();
    };
  }, [recipeId, fetchedData?.recipe]);

  useEffect(() => {
    console.log("Updated Recipe State:", recipe);
  }, [recipe]);

  if (isLoading || !recipe) return <ScreenLoader />;
  // TODO: Create a custom error component for this things
  if (error) return <p>Error loading recipe</p>;

  const { videoUrl } = recipe;

  return (
    <section className="w-full px-5 min-[400px]:px-10 min-[500px]:px-16 sm:px-12 md:px-16 lg:px-24 xl:px-40 py-20 flex flex-col gap-10">
      <CustomBreadCrumb />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-10 ">
        {/* Left Side */}
        <div className="lg:flex-1 flex flex-col gap-8">
          <RecipeImages />
          <RecipeTitleSection />
          <RecipeDescription />

          <CommentsPreviewSection />
        </div>

        {/* Right Side */}
        <div className="lg:w-[35%] 2xl:w-[30%] flex flex-col items-center gap-32">
          <div className="w-full flex flex-col border rounded-lg gap-3 shadow-lg overflow-hidden">
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

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFetchReactions(recipeId, open);

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
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 py-2 px-4 cursor-pointer hover:text-primary transition-colors border-l text-sm">
          <Smile className="size-5" />
          <p>
            View <span className="hidden sm:inline">Reactions</span>
          </p>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg px-2 sm:px-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary">
            Reactions
          </DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto p-2">
          {isLoading && <p>Loading reactions...</p>}
          {error && (
            <p className="text-destructive-foreground">
              Failed to load reactions.
            </p>
          )}

          {data?.pages?.length > 0 ? (
            data.pages.map((page, pageIndex) => (
              <div key={pageIndex} className="flex flex-col gap-4 mb-4">
                {page.reactions.map((reaction, index) => {
                  if (
                    pageIndex === data.pages.length - 1 &&
                    index === page.reactions.length - 1
                  ) {
                    return (
                      <div ref={lastReactorRef} key={reaction._id}>
                        <ReactionItem reaction={reaction} />
                      </div>
                    );
                  }
                  return (
                    <ReactionItem key={reaction._id} reaction={reaction} />
                  );
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
    <div className="flex items-center gap-3 p-2 border rounded-lg">
      {/* Profile Picture */}
      <Avatar
        onClick={() => alert("Coming Soon")}
        className="cursor-pointer hover:scale-125 transition-transform"
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
            className="font-semibold cursor-pointer hover:text-primary transition-colors"
          >
            {reaction.byUser.firstName} {reaction.byUser.lastName}
          </span>
          <span className="text-xs text-muted-foreground">
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

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFetchComments(recipeId, open);

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
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 py-2 px-4 cursor-pointer hover:text-primary transition-colors border-l text-sm">
          <MessageCircleMore className="size-5" />
          <p>
            View <span className="hidden sm:inline">Comments</span>
          </p>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg px-2 sm:px-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary">
            Comments
          </DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto p-2">
          {isLoading && <p>Loading comments...</p>}
          {error && (
            <p className="text-destructive-foreground">
              Failed to load comments.
            </p>
          )}

          {data?.pages?.length > 0 ? (
            data.pages.map((page, pageIndex) => (
              <div key={pageIndex} className="flex flex-col gap-6 mb-6">
                {page.comments.map((comment, index) => {
                  if (
                    pageIndex === data.pages.length - 1 &&
                    index === page.comments.length - 1
                  ) {
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
  const { updateCommentMutation, deleteCommentMutation } = useCommentMutations(
    comment.fromPost
  );
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
    const isConfirmed = await openDialog(
      "Are you sure you want to delete this comment?"
    );
    if (isConfirmed) {
      deleteCommentMutation.mutate(comment._id);
    }
  };

  return (
    <div className="flex gap-3 items-start max-w-xl">
      {/* Profile Picture */}
      <Avatar
        onClick={() => alert("Coming Soon")}
        className="cursor-pointer hover:scale-125 transition-transform"
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
            className="font-semibold cursor-pointer hover:text-primary transition-colors"
          >
            {comment.byUser.firstName} {comment.byUser.lastName}
          </span>
          <span className="text-xs text-muted-foreground">
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
          <p className="text-sm text-muted-foreground">{comment.content}</p>
        )}
      </div>

      {/* Options Menu (Only for comment owner) */}
      {isLoggedIn && comment.byUser._id === userDetails?._id && (
        <Popover open={isOptionOpen} onOpenChange={setIsOptionOpen}>
          <PopoverTrigger asChild>
            <button className="hover:text-primary transition-colors cursor-pointer">
              <MoreVertical className="size-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-28 p-0 overflow-hidden">
            <Button
              variant="ghost"
              className="w-full justify-center rounded-none"
              onClick={handleEdit}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-center text-destructive-foreground rounded-none"
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

const CommentTextArea = ({
  type = "add",
  value = "",
  onChange,
  onSave,
  onCancel,
}) => {
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
          className="absolute bottom-2 right-2 p-2"
          onClick={handleAddComment}
        >
          <SendHorizontal className="size-5 text-muted-foreground" />
        </Button>
      ) : (
        <div className="flex justify-end gap-2 mt-2">
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
    <Card className="w-full p-0 pt-2 overflow-hidden rounded-b-lg rounded-t-none bg-background border-0 text-foreground">
      {/* Tabs */}
      <div className="flex border-b">
        {[
          { id: "ingredients", label: "Ingredients" },
          { id: "procedure", label: "Procedure" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`py-1 px-5 cursor-pointer hover:opacity-80 transition-opacity font-bold border-b-3 ${
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
          <ul className="list-disc px-5 space-y-2">
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

      <div className="border-t flex items-center p-5">
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
    <div className="relative w-full rounded-t-lg overflow-hidden">
      {/* Video with Blur */}
      <video
        ref={videoRef}
        src={src}
        className={`w-full h-auto rounded-t-lg transition ${
          !isPlaying ? "blur-xs brightness-50" : "blur-0 brightness-100"
        }`}
        controls={isPlaying}
      />

      {/* Play Button */}
      {!isPlaying && (
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg group cursor-pointer"
        >
          <Play className="size-20 text-white transition-colors group-hover:text-primary" />
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
        className="w-full h-[400px] sm:h-[600px] md:h-[700px] lg:h-[600px] 2xl:h-[700px] object-cover rounded-lg shadow-lg cursor-zoom-in transition hover:opacity-80 will-change-[transform,opacity]"
        onClick={() => handleImageClick(mainPictureUrl)}
        loading="lazy"
      />

      {/* Additional Images */}
      <div className="grid grid-cols-5 gap-2">
        {additionalPicturesUrls.map((url, index) => (
          <div
            key={index}
            className="w-full h-16 min-[500px]:h-20 sm:h-24 md:h-28 lg:h-32 overflow-hidden shadow-lg rounded-lg aspect-square"
          >
            <img
              src={url}
              alt={`Additional ${index + 1}`}
              className="w-full h-full object-cover cursor-zoom-in transition hover:opacity-80 will-change-[transform,opacity]"
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
    <div className="flex flex-col sm:flex-row gap-2 justify-center max-w-fit">
      <div className="flex items-center border rounded-lg max-w-fit overflow-hidden">
        {isLoggedIn && <AddReactionButton onReact={handleReaction} />}
        <CommentsDialog />
        <ReactionsDialog />
      </div>

      <div className="flex gap-3 justify-center">
        <p className="text-muted-foreground text-xs flex gap-1 items-center">
          {`${totalReactions} ${
            totalReactions === 1 ? "Reaction" : "Reactions"
          }`}
        </p>

        <p className="text-muted-foreground text-xs flex gap-1 items-center">
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
  const [selectedReaction, setSelectedReaction] = useState(
    existingReaction || null
  );
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: toggleReaction } = useToggleReaction(recipeId);

  const handleReactionClick = (reactionValue) => {
    setSelectedReaction((prev) =>
      prev === reactionValue ? null : reactionValue
    );
    toggleReaction(reactionValue);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={`py-2 px-4 cursor-pointer w-auto max-w-fit text-sm ${
            selectedReaction
              ? "transition-transform hover:scale-125"
              : "transition-colors hover:text-primary"
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
            className="text-2xl transition-transform hover:scale-125 cursor-pointer"
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
  const { recipe } = useRecipeStore();
  const { title, byUser } = recipe;
  const { firstName, lastName } = byUser;
  const ownerName = `${firstName} ${lastName}`;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <p className="text-2xl min-[400px]:text-3xl sm:text-5xl lg:max-xl:text-4xl font-bold text-primary">
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
      <div className="text-sm leading-loose text-justify text-muted-foreground">
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
    <div className="text-sm leading-loose text-justify text-muted-foreground flex flex-col ">
      <ParagraphList
        paragraphs={isExpanded ? formattedDescription : truncatedText}
      />
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-8 self-start"
      >
        {isExpanded ? "Show Less" : "Show More"}
      </Button>
    </div>
  );
};

const ParagraphList = ({ paragraphs, className }) => {
  return paragraphs.map((paragraph, index, arr) => (
    <p
      key={index}
      className={cn(index === arr.length - 1 ? "" : "mb-5", className)}
    >
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

  const truncatedBio =
    bio.length > MAX_BIO_LENGTH ? bio.slice(0, MAX_BIO_LENGTH) + "..." : bio;

  return (
    <div className="max-w-xl pb-10 px-10 rounded-lg bg-background text-foreground flex flex-col items-center border shadow-lg">
      <img
        src={profilePictureUrl}
        alt="ownerPic"
        className="size-32 sm:size-40 lg:max-xl:size-36 -translate-y-1/2 rounded-full border-3 border-primary object-cover aspect-square"
      />

      <div className="flex flex-col items-center gap-3 sm:gap-8 lg:max-xl:gap-5 -mt-14 min-[400px]:-mt-10 sm:-mt-16 lg:max-xl:-mt-12">
        <p className="font-bold text-xl sm:text-3xl lg:max-xl:text-xl xl:max-2xl:text-2xl">
          {ownerName}
        </p>
        <p className="text-sm leading-loose text-center">{truncatedBio}</p>

        <Button className="w-full" onClick={() => alert("Coming Soon")}>
          View Profile
        </Button>
      </div>
    </div>
  );
};
export default ViewRecipe;
