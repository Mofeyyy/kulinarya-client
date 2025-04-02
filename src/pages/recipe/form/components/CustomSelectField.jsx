import { Label } from "@/components/ui/label";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// -------------------------------------------------------------

const CustomSelectField = ({
  control,
  name,
  formLabel,
  Component,
  className,
  hasErrorMessage = true,
  isDisabled = false,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          {formLabel && (
            <Label
              htmlFor={field.name}
              data-error={!!fieldState.error}
              className="data-[error=true]:text-destructive-foreground text-foreground"
            >
              {formLabel}
            </Label>
          )}
          <FormControl>
            <Component
              field={field}
              error={fieldState.error}
              className={className}
              isDisabled={isDisabled}
            />
          </FormControl>
          {hasErrorMessage && <FormMessage />}
        </FormItem>
      )}
    />
  );
};

export default CustomSelectField;
