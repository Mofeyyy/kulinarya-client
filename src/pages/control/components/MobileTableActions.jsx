// Imported Icons
import { Ellipsis } from "lucide-react";

// Imported Components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ----------------------------------------------------------------------------------

const MobileTableActions = ({ actions, hasPendingMutation }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="bg-background hover:bg-background hover:text-primary !p-2 transition-colors"
        >
          <Ellipsis className="size-10" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {actions.map(({ label, Icon, onClick }, index) => (
          <DropdownMenuItem
            key={index}
            onClick={onClick}
            className="cursor-pointer font-medium"
            disabled={hasPendingMutation}
          >
            <Icon className="size-5" />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MobileTableActions;
