export default class Helper {
    static hashCode(str) { // java String#hashCode
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }

    static generatePastelColors(str) {
        var redScope = (Math.round((Helper.hashCode(str[0]) / 100) * 1) * 127);
        var r = (redScope + 110).toString(16);
        var greenScope = Math.round((Helper.hashCode(str[1]) / 100) *127);
        var g = (greenScope + 110).toString(16);
        var blueScope = Math.round(((Helper.hashCode(str.substring(0, 2)) / 10000) * 2) *127);
        var b = (blueScope + 127).toString(16);
        return '#' + r + g + b;
    };
}