/**
 * 字符串工具类
 * https://github.com/crazycodeboy
 * @flow
 */
export default class StringUtil {
  /*
  * 去掉字符串左右空格、换行
  */
  static trim( text ){
    if (typeof(text) == "string")  {
      return text.replace(/^\s*|\s*$/g, "");
    }
    else{
      return text;
    }
  }
}
