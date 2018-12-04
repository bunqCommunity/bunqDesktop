import EmailValidator from "email-validator";
import { isValidPhonenumber } from "../../Functions/PhoneLib";

const t = window.t;

const requiredText = t("Required");
const maxAllowedLength = t("Maximum allowed length is");
const minimumAllowedLength = t("Minimum required length is");
const isAllowed = t("is allowed");
const onlyMinimumValue = t("Only a minimum value of");
const onlyMaximumValue = t("Only a maximum value of");
const defaultItemTypeText = t("item");
const atleastText = t("Atleast");
const hasToBeSelected = t("has to be selected");
const invalidEmail = t("Invalid email given");
const invalidPhoneNumber = t("Invalid phone number given");
const invalidPhoneNumberOrEmail = t("Invalid phone number or email given");

export const required = value => (value ? undefined : requiredText);
export const maxLength = max => value => (value && value.length > max ? `${maxAllowedLength} ${max}` : undefined);
export const minLength = min => value => (value && value.length < min ? `${minimumAllowedLength} ${min}` : undefined);
export const minValue = min => value => (value && value < min ? `${onlyMinimumValue} ${min} ${isAllowed}` : undefined);
export const maxValue = max => value => (value && value > max ? `${onlyMaximumValue} ${max} ${isAllowed}` : undefined);
export const minArrayLength = (min, type = defaultItemTypeText) => value =>
    value && value.length < min ? `${atleastText} ${min} ${type} ${hasToBeSelected}` : undefined;

export const validEmail = value => (isEmail(value) ? undefined : invalidEmail);
export const validPhoneNumber = value => (isPhoneNumber(value) ? undefined : invalidPhoneNumber);
export const validContact = value => (isEmail(value) || isPhoneNumber(value) ? undefined : invalidPhoneNumberOrEmail);

/**
 * Helper functions, do not use directly as validator for redux-forms!
 * Redux-forms expect an error string OR undefined
 */
export const isEmail = value => EmailValidator.validate(value);
export const isPhoneNumber = value => isValidPhonenumber(value);
