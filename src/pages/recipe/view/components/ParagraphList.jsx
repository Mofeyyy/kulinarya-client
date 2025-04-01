import { cn } from "@/lib/utils";

// ----------------------------------------------------------------

const ParagraphList = ({ paragraphs, className }) => {
  return paragraphs.map((paragraph, index, arr) => (
    <p key={index} className={cn(index === arr.length - 1 ? "" : "mb-5", className)}>
      {paragraph}
    </p>
  ));
};

export default ParagraphList;
