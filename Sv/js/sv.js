/**
 * author skygst
 * 
 */
'use strict'
;(function (window, o, factory) {
    function $(selector, context, index) {
        return new $.prototype.init(selector, context, index);
    };
    $.prototype.init = function (selector, context, index) {
        this.index = index||null;
        this.context = context || document;
        if (selector && selector.nodeType) {
            this[0] = selector;
            this.length = 1;
            return this;
        } else if (/^#|^./.test(selector)) {
            this.selector = selector||null;
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
    $.fnExtend = function (source) {
        for (var key in source) {
            if (!$.fn.hasOwnProperty(key)) {
                $.fn[key] = source[key];
            }else{
                throw '$.fnExtend ('+key+') already exist'
            }
        }
    };
    $.extend = function (source) {
        for (var key in source) {
            if (!$.hasOwnProperty(key)) {
                $[key] = source[key];
            }else{
                throw '$.extend ('+key+') already exist'
            }
        }
    };
    window[o] = $;
    factory($);
})(this, '$', function ($) {
    
//    function domReady(type,fn) {
//         if (document.readyState == "complete") {
//             fn()
//         };
//    }

    function addEvent(element,type,selector,callback){
        var targetEl=document.querySelector(selector);
        function fn(event) {
            if (selector) {
                var event = event || window.event;
                var target = event.target || event.srcElement;
                if(target==targetEl) callback();
            }else{
                callback();
            }
        }
        if(element.addEventListener){
            if (type=='DOMContentLoaded') {
                if (document.readyState == "complete") {
                    element.addEventListener(type,function(event){fn(event)},false)
                }
            }else{
                element.addEventListener(type,function(event){ fn(event) },false);
            }
            
        }else{
            if (type=='DOMContentLoaded') {
                if (document.readyState == "complete") {
                    var type='onreadystatechange';
                    element.attachEvent(type,function(event){fn(event)});
                }
            }else{
                var type='on' + type;
                element.attachEvent(type,function(event){fn(event)});
            }
            
        }
    }
    
    function removeEvent(element,type,callback){
        if(element.removeEventListener){
            if (type=='DOMContentLoaded') {
                if (document.readyState == "complete") {
                    element.removeEventListener(type,callback,false);
                }
            }else{
                element.removeEventListener(type,callback,false);
            }
        }else{
            if (type=='DOMContentLoaded') {
                if (document.readyState == "complete") {
                    var type='onreadytstatechange';
                    element.detachEvent(type, callback);
                };
            }else{
                var type='on' + type;
                element.detachEvent(type, callback);
            }
            
        }
    };

    $.extend({
        ready:function (callback) {
            addEvent('document','DOMContentLoaded',null,callback)
        },
        getEvent: function(event){
            return event || window.event;
        },
        getTarget: function(event){
            return event.target || event.srcElement;
        },
        stopPropagation: function(event){
            if(event.stopPropagation){
                event.stopPropagation();
            }else{
                event.cancelBubble = true;
            }
        },
        preventDefault: function(event){
            if(event.prevenDefault){
                event.preventDefault();
            }else{
                event.returnValue = false;
            }
        },
    });
    $.fnExtend({
        eq: function (i) {
            return $(this[i], this.selector, i)
        },
        filter: function (e) {
            return $(e, this[0], 0)
        },
    });
    $.fnExtend({
        addEvent: function(element,type,callback){
            addEvent(element,type,callback);
            return this;
        },
        removeEvent: function(element,type,callback){
            removeEvent(element,type,callback);
            return this;
        },
        
        on : function(events, selector, data, callback, one){
            var events=events.split(/\s/);
            if (typeof selector=='function') {
                for (var key in events) {
                    addEvent(this[0],events[key],null,selector)
                }
            }else{
                for (var key in events) {
                    addEvent(this[0],events[key],selector,data)
                }
            }
            // if (typeof data=='function') {
                
            // }
            return this;
        },
        
    });
});

var Sv = {
    tplEngine: function (tpl, data) {
        var escape = function (html) {
            return String(html).replace(/&(?!\w+;)/g, '$amp;').replace(/</g, '&lt;')
                .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
                .replace(/\\/g, "").replace(/''/g, '');
        }
        var complied = function (str) {
            var tpl = str.replace(/\{\{\}\}|[\r\t\n]/g, '')
                .replace(/\{\{([\s\S]+?)\}\}/g, function (match, value) {
                    return "' + escape(" + value + ")+ '"
                }).replace(/<%([\s\S]+?)%>/g, function (match, value) {
                    return "';\n" + value + "\ntpl+='";
                }).replace(/(tpl\+=\'\';)/g, '')
            tpl = "tpl='" + tpl + "';";
            tpl = 'var tpl="";\nwith(obj||{}){\n' + tpl + '\n}\nreturn tpl;';
            return new Function('obj', 'escape', tpl);
        };
        var Engine = function (tpl, data) {
            var tpl = complied(tpl)
            return tpl(data, escape);
        }
        return Engine(tpl, data)
    },
    initModule: function (arg, modelFn, modelName) {
        if (arg) {
            var obj={
                tpl: arg.tpl,
                data: arg.data,
                scope: typeof arg === 'string' ? arg : arg.scope, //new Sv.template('#dss')
            }
            if (arg.extend&&arg.extend[0]){
                obj[arg.extend[0]]=Sv[arg.extend[0]+'Extend'];
            }
            
            modelFn.prototype = obj;
            var model_o = new modelFn();
            //将配置赋值到根对象
            for (var key in arg) {
                if (key != 'controller') this[key] = arg[key]
            }
        };

         
        //执行实例对象controller函数
        this.controller = function (fn) {
            fn ? fn.call(model_o) : null;
        }
        //实例化模型后使函数this 指向模型//执行配置函数
        arg ? arg.run ? arg.run.call(model_o) : null : null;

    },
    model: function (modelName, modelFn) {
        Sv[modelName+'Extend']=new modelFn()[modelName];
        Sv[modelName] = function (arg) {
            Sv.initModule.call(this, arg, modelFn, modelName)
        };
    }
};








