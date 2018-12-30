const V_MOBILE = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
const V_SEARCH = /[a-zA-Z0-9\u4e00-\u9fa5]{1,5}$/;

const formValidatUtil = {
  Mobile: value => {
    return V_MOBILE.test(value);
  },
  search: value => {
    return V_SEARCH.test(value);
  }
}

export default formValidatUtil

