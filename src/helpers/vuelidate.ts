import { ErrorObject } from "@vuelidate/core";
import { unref } from "vue";

export function getErrorMessage(field: { $errors: ErrorObject[] }) {
  const error = field.$errors.at(0);
  return !error ? undefined : unref(error.$message);
}
