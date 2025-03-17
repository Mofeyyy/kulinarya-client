import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import HeaderContents from "./HeaderContents";

// --------------------------------------------------------------------

const HeaderDrawer = () => {
  return (
    <Drawer>
      <DrawerTrigger className="sm:hidden">
        <Menu className="size-12 text-background hover:opacity-80 transition cursor-pointer" />
      </DrawerTrigger>
      <DrawerContent className="bg-primary border-none sm:hidden">
        <DrawerHeader>
          <DrawerTitle />
          <DrawerDescription />
        </DrawerHeader>

        <div className="flex flex-col justify-between items-center gap-5">
          <HeaderContents />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default HeaderDrawer;
