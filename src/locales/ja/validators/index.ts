import { LocaleValidators } from '@/locales/type/validators';

export const validators: LocaleValidators = {
  required: '{label}の入力は必須です',
  minLength: '{label}は{min}文字以上で入力してください',
  maxLength: '{label}は{max}文字以内で入力してください',
  email: 'メールアドレスの形式で入力してください',
  sameAs: '{firstField}と{secondField}は一致する必要があります',
  regex: '有効な{label}の形式で入力してください',
};
