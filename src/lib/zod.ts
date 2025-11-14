import { type Ref } from "vue";
import * as z from "zod";

export const validateForm = <T>(schema: z.ZodSchema<T>, formErrors: Ref<any>, formData: Ref<T>) => {
  try {
    const result = schema.safeParse(formData.value);
    if (!result.success) {
      formErrors.value = z.treeifyError(result.error);
      throw formErrors.value;
    }
    return true;
  } catch (error) {
    return false;
  }
};
