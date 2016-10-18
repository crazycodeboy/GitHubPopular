

export default class Utils {
    static objectIsValueEqual(object1, object2) {
        for (var _key in object1) {
            if (object1._key !== object2._key)return false;
        }
        return true;
    }
    /**
     * 检查该Item是否被收藏
     * **/
    static checkFavorite(item,items) {
        for (var i = 0, len = items.length; i < len; i++) {
            if (item.id.toString() === items[i]) {
                return true;
            }
        }
        return false;
    }
}