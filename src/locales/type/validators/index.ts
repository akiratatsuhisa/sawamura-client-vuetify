export type LocaleValidators = {
  /**
   * @param {string} label
   */
  required: string;
  /**
   * @param {string} label
   * @param {number} min
   */
  minLength: string;
  /**
   * @param {string} label
   * @param {number} max
   */
  maxLength: string;
  email: string;
  /**
   * @param {string} firstField
   * @param {string} secondField
   */
  sameAs: string;
  /**
   * @param {string} label
   */
  regex: string;
  /**
   * @param {string} label
   */
  username: string;
  /**
   * @param {string} label
   */
  password: string;
};
