import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// -------------------------------------------------------------

const CustomInputField = ({
  control,
  type,
  name,
  formLabel,
  inputPlaceholder,
  className,
  hasErrorMessage = true,
  isDisabled = false,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {formLabel && <FormLabel>{formLabel}</FormLabel>}
          <FormControl>
            <Input type={type} placeholder={inputPlaceholder} disabled={isDisabled} {...field} />
          </FormControl>
          {hasErrorMessage && <FormMessage />}
        </FormItem>
      )}
    />
  );
};

export default CustomInputField;
