// Imported Components
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";

// Imported Icons
import {
  ChefHat,
  Salad,
  LayoutDashboard,
  CircleCheck,
  Ellipsis,
  CircleX,
  Sparkles,
} from "lucide-react";

// Imported Custom Components
import Logo from "@/components/Logo";
import SidebarCollapsibleItem from "@/components/control/SidebarCollapsibleItem";
import SidebarSimpleItem from "@/components/control/SidebarSimpleItem";

// Contants
const items = [
  {
    title: "Dashboard",
    url: "/control/dashboard",
    Icon: LayoutDashboard,
  },
  {
    title: "Recipes",
    url: "#",
    Icon: Salad,
    subItems: [
      { title: "Pending", url: "/control/pending-recipes", Icon: Ellipsis },
      { title: "Approved", url: "/control/approved-recipes", Icon: CircleCheck },
      { title: "Rejected", url: "/control/rejected-recipes", Icon: CircleX },
      { title: "Featured", url: "/control/feature-recipes", Icon: Sparkles },
    ],
  },
  {
    title: "Users",
    url: "/control/users",
    Icon: ChefHat,
  },
];

// --------------------------------------------------------------

const ControlSidebar = () => {
  return (
    <Sidebar className="border-2">
      <SidebarContent className="bg-background no-scrollbar">
        <SidebarHeader className="flex items-center justify-center border-b p-10">
          <Logo className="size-40" />
        </SidebarHeader>

        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) =>
                item.subItems ? (
                  <SidebarCollapsibleItem
                    key={item.title}
                    title={item.title}
                    Icon={item.Icon}
                    subItems={item.subItems}
                  />
                ) : (
                  <SidebarSimpleItem
                    key={item.title}
                    title={item.title}
                    url={item.url}
                    Icon={item.Icon}
                  />
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default ControlSidebar;
