const LOGIN_RULE_SET = {
  minLen: 1,
  regexGroup: {
    only: {regex: /^[\da-zA-Z_\-]+$/, desc: 'only latin, digits and the following special characters: _-'},
  }
};

const PASSWD_RULE_SET = {
  minLen: 8,
  regexGroup: {
    only: {regex: /^[\da-zA-Z@!_\-]+$/, desc: 'only latin, digits and the following special characters: @!#$%^&*()<>_-'},
    atLeast: {
      lowerLatin: {regex: /[a-z]+/, desc: 'at least one latin character in lower case'},
      upperLatin: {regex: /[A-Z]+/, desc: 'at least one latin character in upper case'},
      digit: {regex: /\d+/, desc: 'at least one digit'},
      specialChar: {regex: /[@!_\-]+/, desc: 'at least one special character'},
    }
  }
};

function commonValidator(attrVal = '', attrName = '', ruleSet = {}) {
  const {minLen, regexGroup} = ruleSet;

  let errors = [];
  if(attrVal.length < minLen)
    errors.push(`${attrName} length must be equal to or greater than ${minLen}`)

  if(!regexGroup.only.regex.test(attrVal)) {
    errors.push(`${attrName} must contain ${regexGroup.only.desc}`)
    return errors;
  }

  if('atLeast' in regexGroup) {
    errors = Object.values(regexGroup.atLeast).reduce((acc, {regex, desc}) => {
      console.log(regex, desc, regex.test(attrVal));
      if(regex.test(attrVal))
        return acc;
      else
        return [...acc, `${attrName} must contain ${desc}`];

    }, errors);

  }
  
  return errors;
}

function loginValidator(login) {
  return commonValidator(login, 'login', LOGIN_RULE_SET);
}

function passwdValidator(passwd) {
  return commonValidator(passwd, 'password', PASSWD_RULE_SET);
}

export {
  loginValidator,
  passwdValidator,
};
