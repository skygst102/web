(function (window, o, factory) {
    function $(selector, context, index) {
        return new $.prototype.init(selector, context, index);
    };
    $.prototype.init = function (selector, context, index) {
        this.index = index;
        this.context = context || document;
        if (selector && selector.nodeType) {
            this[0] = selector;
            this.length = 1;
            return this;
        } else if (/^#|^./.test(selector)) {
            this.selector = selector
            $.nodeList = this.context.querySelectorAll(selector);
            this.length = $.nodeList.length;
            for (var i = 0; i < this.length; i++) {
                this[i] = $.nodeList[i];
            }
        } else {
            return this;
        }
    };
    $.fn = $.prototype.init.prototype = {};
    $.extend = function (source) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                $.fn[key] = source[key];
            }
        }
    };
    window[o] = $;
    factory($);
})(this, '$', function ($) {
    $.extend({
        eq: function (i) {
            return $(this[i], this.selector, i)
        },
        filter: function (e) {
            return $(e, this[0], 0)
        }
    })
});