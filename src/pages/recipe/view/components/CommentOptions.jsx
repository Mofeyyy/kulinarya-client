import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ----------------------------------------------------------------

const CommentOptions = ({ isOptionOpen, setIsOptionOpen, menuItems }) => {
  return (
    <DropdownMenu open={isOptionOpen} onOpenChange={setIsOptionOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="hover:bg-background hover:text-primary flex items-center justify-center border-0 !p-0 transition-colors focus-visible:ring-0"
        >
          <MoreVertical className="size-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {menuItems.map(({ icon: Icon, label, action }) => (
          <DropdownMenuItem
            key={label}
            onClick={action}
            className="group notification-options cursor-pointer"
          >
            <Icon className="group-hover:text-primary size-5 transition-colors" />
            <span className="group-hover:text-primary transition-colors">{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CommentOptions;
