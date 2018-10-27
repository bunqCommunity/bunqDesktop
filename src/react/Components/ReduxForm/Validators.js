import EmailValidator from "email-validator";
import { isValidPhonenumber } from "../../Helpers/PhoneLib";

const t = window.t;

export const required = value => (value ? undefined : t("Required"));
export const maxLength = max => value =>
    value && value.length > max ? `${t("Maximum allowed length is")} ${max}` : undefined;
export const minLength = min => value =>
    value && value.length < min ? `${t("Minimum required length is")} ${min}` : undefined;
export const minValue = min => value =>
    value && value < min ? `${t("Only a minimum value of")} ${min} ${t("is allowed")}` : undefined;
export const maxValue = max => value =>
    value && value > max ? `${t("Only a maximum value of")} ${max} ${t("is allowed")}` : undefined;

export const validEmail = value => (isEmail(value) ? undefined : t("Invalid email given"));
export const validPhoneNumber = value => (isPhoneNumber(value) ? undefined : t("Invalid phone number given"));
export const validContact = value =>
    isEmail(value) || isPhoneNumber(value) ? undefined : t("Invalid phone number or email given");

/**
 * Helper functions, do not use directly as validator for redux-forms!
 * Redux-forms expect an error string OR undefined
 */
export const isEmail = value => EmailValidator.validate(value);
export const isPhoneNumber = value => isValidPhonenumber(value);
