/**
 * tsx  常用正则
 */

/**
 * @param {string}
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/* 手机号码  */
export function isvalidUsername(str) {
  const valid_map = /^[0-9]{11}$/;
  return valid_map.test(str);
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(textval);
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/* 大小写字母*/
export function validateAlphabets(str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}

/* 验证数字  */
export function validateSum(str) {
  const valid_map = /^[0-9]+$/;
  return valid_map.test(str);
}
// 判断输入内容是否为空
export function isNull(str) {
  if (str == null || str.length == 0) {
    return true; // 请将“文本框”改成你需要验证的属性名称!
  }
  return false;
}

// 去掉字符串两端的空格
export function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

// 去除字符串中间空格
export function CTim(str) {
  return str.replace(/\s/g, "");
}

// 判断日期类型是否为YYYY-MM-DD格式的类型
export function isDate(str) {
  if (str != null && str.length != 0) {
    var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
    var r = str.match(reg);
    if (r != null) {
      return true;
    }
  }
  return false;
}

// 判断日期类型是否为YYYY-MM-DD hh:mm:ss格式的类型
export function isDateTime(str) {
  if (str != null && str.length != 0) {
    const reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
    const r = str.match(reg);
    if (r != null) {
      return true;
    }
  }
  return false;
}

// 判断日期类型是否为hh:mm:ss格式的类型
export function isTime(str) {
  if (str != null && str.length != 0) {
    const reg = /^((20|21|22|23|[0-1]\d)\:[0-5][0-9])(\:[0-5][0-9])?$/;
    if (reg.test(str)) {
      return true; // 请将“日期”改成你需要验证的属性名称!
    }
  }
  return false;
}

// 判断输入的字符是否为英文字母
export function isLetter(str) {
  if (str != null && str.length != 0) {
    const reg = /^[a-zA-Z]+$/;
    if (reg.test(str)) {
      return true; // 请将“英文字母类型”改成你需要验证的属性名称!
    }
  }
  return false;
}

// 判断输入的字符是否为整数
export function isInteger(str) {
  if (str != null && str.length != 0) {
    const reg = /^[-+]?\d*$/;
    if (reg.test(str)) {
      return true; // 请将“整数类型”要换成你要验证的那个属性名称！
    }
  }
  return false;
}

// 是否正整数
export function isPositiveNum(str) {
  if (str != null && str.length != 0) {
    const reg = /^\d+$/;
    if (reg.test(str)) {
      return true; // 请将“整数类型”要换成你要验证的那个属性名称！
    }
  }
  return false;
}

// 判断输入的字符是否为双精度
export function isDouble(str) {
  if (str != null && str.length != 0) {
    const reg = /^[-\+]?\d+(\.\d+)?$/;
    if (reg.test(str)) {
      return true; // 请将“双精度类型”要换成你要验证的那个属性名称！
    }
  }
  return false;
}

// 判断输入的字符是否为:a-z,A-Z,0-9
export function isString(str) {
  if (str != null && str.length != 0) {
    const reg = /^[a-zA-Z0-9_]+$/;
    if (str.length > 5 && str.length < 18) {
      if (reg.test(str)) {
        return true;
      }
    }
  }
  return false;
}
// 判断输入的字符是否为:a-z,0-9  不含大写字母
export function isStringto(str) {
  if (str != null && str.length != 0) {
    const reg = /^[a-z0-9_]+$/;
    if (reg.test(str)) {
      return true;
    }
  }
  return false;
}

// 判断输入的字符是否为中文
export function isChinese(str) {
  if (str != null && str.length != 0) {
    const reg = /^[\u0391-\uFFE5]+$/;
    if (reg.test(str)) {
      return true;
    }
  }
  return false;
}

// 判断输入的EMAIL格式是否正确
export function isEmail(str) {
  if (str != null && str.length != 0) {
    const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (reg.test(str)) {
      return true;
    }
  }
  return false;
}

// 判断URL是否正确
export function isURL(str) {
  if (str != null && str.length != 0) {
    const strRegex =
      "^((https|http|ftp|rtsp|mms)?://)" +
      "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" + // ftp的user@
      "(([0-9]{1,3}.){3}[0-9]{1,3}" + // IP形式的URL- 199.194.52.184
      "|" + // 允许IP和DOMAIN（域名）
      "([0-9a-z_!~*'()-]+.)*" + // 域名- www.
      "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]." + // 二级域名
      "[a-z]{2,6})" + // first level domain- .com or .museum
      "(:[0-9]{1,4})?" + // 端口- :80
      "((/?)|" + // a slash isn't required if there is no file name
      "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    const re = new RegExp(strRegex);
    // re.test()
    if (re.test(str)) {
      return true;
    }
  }
  return false;
}

// 身份證
export function identity(str) {
  const sfz = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  return sfz.test(str);
}

// 验证是否为手机号码号码，1开头，长度为11位
export function isMobile(str) {
  if (str != null && str.length != 0) {
    const reg = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
    if (reg.test(str)) {
      return true;
    }
  }
  return false;
}

// 判断字符由字母和数字、下划线、点号组成。且开头的只能是下划线和字母
export function isUserName(str) {
  if (str != null && str.length != 0) {
    const reg = /^([a-zA-z_]{1})([\w]*)$/g;

    if (reg.test(str)) {
      return true;
    }
  }
  return false;
}
// 六位数的验证码登录
export function verification(str) {
  if (str != null && str.length != 0) {
    const reg = /^[0-9]{6}$/;
    if (reg.test(str)) {
      return true;
    }
  }
  return false;
}
