ctx.prototype._forEachKey = function(obj, callback) {
    var keys = Object.keys(obj), i, key;
    for (i = 0; i < keys.length; i++) {
        key = keys[i];
        callback.call(this, key, obj[key]);
    }
};

ctx.prototype.__applyStyleState = function(styleState) {
    this._forEachKey(styleState, function(key, value) {
        this[key] = value;
    });
};

ctx.prototype.__setDefaultStyles = function() {
    this._forEachKey(STYLES, function(key, styleObj) {
        this[key] = styleObj.canvas;
    });
};

ctx.prototype.__getStyleState = function() {
    var styleState = {};
    this._forEachKey(STYLES, function(key) {
        styleState[key] = this[key];
    });
    return styleState;
};