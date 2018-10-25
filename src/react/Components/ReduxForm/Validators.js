import EmailValidator from "email-validator";
import { isValidPhonenumber } from "../../Helpers/PhoneLib";

export const required = value => (value ? undefined : "Required 2");
export const validEmail = value => (isEmail(value) ? undefined : "Invalid email given");
export const validPhoneNumber = value => (isPhoneNumber(value) ? undefined : "Invalid phone number given");
export const validContact = value =>
    isEmail(value) || isPhoneNumber(value) ? undefined : "Invalid phone number or email given";

/**
 * Helper functions, do not use directly as validator for redux-forms!
 * Redux-forms expect an error string OR undefined
 */
export const isEmail = value => EmailValidator.validate(value);
export const isPhoneNumber = value => isValidPhonenumber(value);
export const maxLength = max => value => (value && value.length > max ? false : true);
export const minLength = min => value => (value && value.length < min ? false : true);
export const minValue = min => value => (value && value < min ? false : true);
export const maxValue = max => value => (value && value > max ? false : true);
