// Imported  Libraries
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Imported Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Imported Custom Components
import CustomInputField from "../recipe/form/components/CustomInputField";
import CustomTextAreaField from "../recipe/form/components/CustomTextAreaField";
import useConfirmDialog from "@/components/useConfirmDialog";

// Imported Stores
import useAuthStore from "@/hooks/stores/useAuthStore";
import useUnsavedChangesStore from "@/hooks/stores/useUnsavedChangesStore";

// Imported Queries
import useFetchUserData from "@/hooks/queries/useFetchUserData";

// Imported Mutations
import useUserInfoMutation from "@/hooks/mutations/useUserInfoMutation";
import userChangePassword from "@/hooks/mutations/useChangePassword";

// Imported Icons
import { Loader2 } from "lucide-react";

// ----------------------- Schema to move ------------------------------------

const personalInfoSchema = z.object({
  firstName: z.string().trim().min(2, "First name is required"),
  middleName: z.string().trim().optional(),
  lastName: z.string().trim().min(2, "Last name is required"),
  email: z.string().trim().toLowerCase().email("Invalid email address").min(1, "Email is required"),
  bio: z
    .string()
    .max(500, "Bio must be at most 500 characters")
    .trim()
    .refine((val) => val.length === 0 || val.trim().length > 0, {
      message: "Bio cannot be empty or just spaces",
    })
    .optional(),
});

const profilePictureSchema = z.object({
  profilePictureUrl: z.union([z.string().url(), z.instanceof(File), z.literal("")]).nullable(),
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(100)
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match",
  });

// ----------------------------------------------------------------

const ProfileEditPage = () => {
  const userDetails = useAuthStore((state) => state.userDetails);

  const { data: user, isLoading, error } = useFetchUserData(userDetails?._id);

  const tabItems = [
    { value: "info", title: "Personal Info", component: <PersonalInfoTab user={user} /> },
    {
      value: "picture",
      title: "Update Profile Picture",
      component: <UpdateProfilePictureTab user={user} />,
    },
    { value: "password", title: "Change Password", component: <ChangePasswordTab user={user} /> },
    // { value: "delete", title: "Delete Account", component: <DeleteAccountTab /> },
  ];

  // For Debugging
  useEffect(() => {
    console.log("User Data:", user);
  }, [user]);

  if (isLoading) return <MiniLoader />;
  if (!user || error)
    return <p className="text-destructive text-center font-medium">Error fetching user data</p>;

  return (
    <section className="flex h-full w-full items-center justify-center">
      <Card className="bg-background max-w-3xl gap-5">
        <CardHeader>
          <CardTitle className="text-primary">Edit Profile Settings</CardTitle>
          <CardDescription>
            Manage your personal info, password, or delete your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="!text-foreground">
          <Tabs defaultValue="info" className="w-full gap-8">
            <TabsList className="bg-background grid h-fit w-full gap-2 rounded-none sm:grid-cols-3">
              {tabItems.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="bg-background data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-primary cursor-pointer rounded-none border-b-4 transition-opacity hover:opacity-80"
                >
                  {tab.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabItems.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                {tab.component}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
};

// * Working
const PersonalInfoTab = ({ user }) => {
  const setHasUnsavedChanges = useUnsavedChangesStore((state) => state.setHasUnsavedChanges);
  const { openDialog, ConfirmDialog } = useConfirmDialog();
  const navigateTo = useNavigate();

  const { mutateAsync: updateUserInfo, isPending: isUpdating } = useUserInfoMutation();

  const form = useForm({
    defaultValues: {
      firstName: user.firstName || "",
      middleName: user.middleName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      bio: user.bio || "",
    },
    resolver: zodResolver(personalInfoSchema),
  });

  const {
    handleSubmit,
    control,
    isSubmitting,
    formState: { dirtyFields },
  } = form;

  const onSubmit = async (data) => {
    console.log("Personal Info Data:", data);

    const confirm = await openDialog("Are you sure you want to update your personal info?");

    if (!confirm) return;

    try {
      await toast.promise(
        updateUserInfo({ userId: user._id, userData: data }),
        {
          loading: "Saving changes...",
          success: "Saved successfully!",
        },
        {
          duration: 5000,
        },
      );
      setHasUnsavedChanges(false);

      // Delay to ensure states are updated before navigate
      setTimeout(() => navigateTo(`/profile/${user._id}`), 0);
    } catch (error) {
      console.error("Error updating user info:", error);
      toast.error(error.message, {
        duration: 5000,
      });
    }
  };

  // Monitor for unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(Object.keys(dirtyFields).length > 0);
  }, [dirtyFields]);
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center gap-5">
        <div className="grid w-full max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
          <CustomInputField
            control={control}
            name="firstName"
            formLabel="First Name"
            inputPlaceholder="First Name"
            isDisabled={isUpdating || isSubmitting}
          />

          <CustomInputField
            control={control}
            name="middleName"
            formLabel="Middle Name"
            inputPlaceholder="Middle Name"
            isDisabled={isUpdating || isSubmitting}
          />

          <CustomInputField
            control={control}
            name="lastName"
            formLabel="Last Name"
            inputPlaceholder="Last Name"
            isDisabled={isUpdating || isSubmitting}
          />

          <CustomInputField
            control={control}
            name="email"
            formLabel="Email"
            inputPlaceholder="Email"
            type="email"
            isDisabled={true}
          />
        </div>

        <div className="w-full max-w-3xl">
          <CustomTextAreaField
            control={control}
            name="bio"
            formLabel="Bio"
            textAreaPlaceholder="Tell us about yourself..."
            isDisabled={isUpdating || isSubmitting}
          />
        </div>

        <Button type="submit" className="self-end">
          {isUpdating || isSubmitting ? <Loader2 className="animate-spin" /> : <p>Save Changes</p>}
        </Button>
      </form>

      {ConfirmDialog}
    </Form>
  );
};

const UpdateProfilePictureTab = ({ user }) => {
  const setHasUnsavedChanges = useUnsavedChangesStore((state) => state.setHasUnsavedChanges);
  const { openDialog, ConfirmDialog } = useConfirmDialog();
  const [previewUrl, setPreviewUrl] = useState(user.profilePictureUrl || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigateTo = useNavigate();

  const form = useForm({
    defaultValues: {
      profilePictureUrl: user.profilePictureUrl || "",
    },
    resolver: zodResolver(profilePictureSchema),
  });

  const { mutateAsync: updateProfilePicture, isPending } = useUserInfoMutation();

  const onSubmit = async () => {
    const confirm = await openDialog("Are you sure you want to update your profile picture?");
    if (!confirm || !selectedFile) return;

    console.log("Selected File:", selectedFile);

    try {
      await toast.promise(
        updateProfilePicture({ userId: user._id, userData: { profilePictureUrl: selectedFile } }),
        {
          loading: "Updating profile picture...",
          success: "Profile picture updated successfully!",
        },
        {
          duration: 5000,
        },
      );
      setHasUnsavedChanges(false);

      // Delay to ensure states are updated before navigate
      setTimeout(() => navigateTo(`/profile/${user._id}`), 0);
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error(error.message, {
        duration: 5000,
      });
    }
  };

  // Monitor for unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(Object.keys(form.formState.dirtyFields).length > 0);
  }, [form.formState.dirtyFields]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center gap-5">
        <FormField
          control={form.control}
          name="profilePictureUrl"
          render={() => (
            <FormItem>
              <FormControl>
                <div className="flex flex-col items-center gap-2">
                  <Avatar className={`size-40 border-4 ${selectedFile && "border-primary"}`}>
                    <AvatarImage src={previewUrl || ""} alt="Profile" />
                    <AvatarFallback className="text-xl font-semibold">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>

                  <Input
                    type="file"
                    accept="image/*"
                    id="file-upload"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFile(file);
                        setPreviewUrl(URL.createObjectURL(file));
                      }
                    }}
                  />
                  <label
                    htmlFor="file-upload"
                    className="text-primary cursor-pointer text-sm hover:underline"
                  >
                    Upload New Picture
                  </label>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="self-end" disabled={isPending || !selectedFile}>
          {isPending ? "Saving..." : "Save Picture"}
        </Button>

        {ConfirmDialog}
      </form>
    </Form>
  );
};

const ChangePasswordTab = ({ user }) => {
  const { openDialog, ConfirmDialog } = useConfirmDialog();
  const setHasUnsavedChanges = useUnsavedChangesStore((state) => state.setHasUnsavedChanges);
  const navigateTo = useNavigate();

  console.log("User Data:", user);

  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    resolver: zodResolver(changePasswordSchema),
  });

  const { mutateAsync: updatePassword, isPending } = userChangePassword();

  const onSubmit = async (values) => {
    const confirm = await openDialog("Are you sure you want to change your password?");
    if (!confirm) return;

    try {
      await toast.promise(
        updatePassword({
          userId: user._id,
          passwordData: {
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
          },
        }),
        {
          loading: "Updating password...",
          success: "Password updated successfully!",
        },
        { duration: 5000 },
      );

      setHasUnsavedChanges(false);
      setTimeout(() => navigateTo(`/profile/${user._id}`), 0);
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error(error.message || "Something went wrong", { duration: 5000 });
    }
  };

  return (
    <Form {...form}>
      <div className="flex justify-center">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full max-w-sm flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Current Password" type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="New Password" type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Confirm New Password" type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="self-end" disabled={isPending}>
            {isPending ? "Updating..." : "Update Password"}
          </Button>

          {ConfirmDialog}
        </form>
      </div>
    </Form>
  );
};

const DeleteAccountTab = () => {
  return (
    <div className="mt-4 space-y-4">
      <p className="text-sm text-red-600">
        Warning: Deleting your account is irreversible. Your data will be lost.
      </p>
      <Input placeholder="Enter password to confirm" type="password" />
      <Button variant="destructive">Delete My Account</Button>
    </div>
  );
};

const MiniLoader = () => (
  <div className="flex items-center justify-center">
    <Loader2 className="animate-spin" />
  </div>
);

export default ProfileEditPage;
