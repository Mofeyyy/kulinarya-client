// Imported Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ----------------------------------------------------------------------------------

const TableAvatar = ({ avatarUrl, avatarFallback }) => {
  return (
    <Avatar className="group-hover:border-primary border-2">
      <AvatarImage src={avatarUrl} alt="Profile Picture" />

      <AvatarFallback>{avatarFallback}</AvatarFallback>
    </Avatar>
  );
};

export default TableAvatar;
