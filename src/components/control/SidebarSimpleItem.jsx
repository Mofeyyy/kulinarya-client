// Imported  Libraries
import { NavLink } from "react-router-dom";

// Imported Components
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

// --------------------------------------------------------------

const SidebarSimpleItem = ({ title, url, Icon }) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <NavLink
          to={url}
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-none px-5 py-8 transition-colors ${isActive && "text-primary"}`
          }
        >
          <Icon className="!size-8" />

          <span>{title}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default SidebarSimpleItem;
