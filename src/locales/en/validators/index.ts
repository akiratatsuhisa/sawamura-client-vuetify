import { LocaleValidators } from '@/locales/type/validators';

export const validators: LocaleValidators = {
  required: '{label} field is required',
  minLength: '{label} must be at least {min} characters',
  maxLength: '{label} must not exceed {max} characters',
  email: 'Invalid mail address format',
  sameAs: '{firstField} must match {secondField}',
  regex: 'Please enter a valid {label} format',
  username:
    'The {label} must start with an alphabet character and can only contain alphanumeric characters, underscores, and hyphens',
  password:
    "The {label} must be contain at least one upper case letter, one lower case letter, one digit, and one special character ({'@'} $ ! % * # ? &)",
};
