import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// -------------------------------------------------------------

const CustomTextAreaField = ({ control, name, formLabel, textAreaPlaceholder, isDisabled }) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{formLabel}</FormLabel>
          <FormControl>
            <Textarea placeholder={textAreaPlaceholder} {...field} disabled={isDisabled} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomTextAreaField;
