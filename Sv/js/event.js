var Event = {
    addEvent: function(element,type,callback){
        if(element.addEventListener){
            element.addEventListener(type,callback,false);
        }else if(element.attachEvent){
            element.attachEvent('on' + type,callback);
        }
    },
    removeEvent: function(element,type,callback){
        if(element.removeEventListener){
            element.removeEventListener(type,callback,false);
        }else{
            element.detachEvent('on' + type, callback);
        }
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
    }
}