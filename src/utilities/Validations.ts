export const validations = {
  emailRegExp:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  phoneRegExp:
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
  numberRegExp: /^[0-9]+$/,
  amountRegExp: /(\d{1,5}|\d{0,5}\.\d{1,2})/,
};

export const validationMessages = {
  required: '* Required',
  mobileNoInValid: 'Enter a valid mobile number',
  mobileNoMax: 'Mobile number is too long',
  mobileNoMin: 'Mobile number is too short',
  emailInValid: 'Enter a valid Email',
  numberInvalid: 'Should contain only numbers',
  descriptionMin: 'Description must contain atleast 6 character'
};
