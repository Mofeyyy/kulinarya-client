// Imported  Libraries
import { cn } from "@/lib/utils";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

// Imported Components
import {
  SidebarMenuSubItem,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Imported Icons
import { ChevronRight } from "lucide-react";

// --------------------------------------------------------------

const SidebarCollapsibleItem = ({ title, Icon, subItems }) => {
  const [open, setOpen] = useState(true);

  const location = useLocation();

  // check if any subItem is currently active
  const isAnySubItemActive = subItems.some((sub) => location.pathname.startsWith(sub.url));

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            className={cn(
              "flex w-full cursor-pointer items-center justify-between gap-2 rounded-none px-5 py-8 transition-colors",
              isAnySubItemActive && "text-primary",
            )}
          >
            <div className="flex items-center gap-2">
              <Icon className="size-8" />
              <span>{title}</span>
            </div>

            <ChevronRight
              className={cn("transition-transform duration-200", open && "rotate-90", "size-8")}
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            open ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <SidebarMenuSub className="border-muted ml-8 w-full border-l-2 pl-0">
            {subItems.map((sub) => (
              <SidebarMenuSubItem key={sub.title}>
                <NavLink
                  to={sub.url}
                  className={({ isActive }) =>
                    `hover:bg-accent hover:text-primary flex items-center gap-2 px-5 py-3 transition-colors ${isActive && "text-primary"}`
                  }
                >
                  <sub.Icon className="size-8" />
                  <span>{sub.title}</span>
                </NavLink>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

export default SidebarCollapsibleItem;
