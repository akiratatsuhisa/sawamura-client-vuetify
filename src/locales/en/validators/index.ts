import { LocaleValidators } from '@/locales/type/validators';

export const validators: LocaleValidators = {
  required: '{label} field is required',
  minLength: '{label} must be at least {min} characters',
  maxLength: '{label} must not exceed {max} characters',
  email: 'Invalid mail address format',
  sameAs: '{firstField} and {secondField} must match',
  regex: 'Please enter a valid {label} format',
};
