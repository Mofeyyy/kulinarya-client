import { cn } from "@/lib/utils";
import { Slash } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import usePageStore from "@/hooks/stores/usePageStore";

const CustomBreadCrumb = ({ className }) => {
  const { page, subPage } = usePageStore();

  return (
    <Breadcrumb>
      <BreadcrumbList
        className={cn(
          "text-base font-medium justify-center sm:justify-start",
          className
        )}
      >
        <BreadcrumbItem>
          <BreadcrumbLink href={page.href}>{page.name}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href={subPage.href} className="text-primary">
            {subPage.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CustomBreadCrumb;
