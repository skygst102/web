
function info(obj,msg) {
    var info='';
    for (var key in obj) {
           info+=key+' ';
    }
    console.log(info+'---'+msg)
}

/* 建立模型 */ //函数执行两次，Sv.model（）内被实例化，  Sv.initModel() 内被实例化  使用!this.scope过滤
Sv.model('component', function () {
    if (!this.scope) {
        return
    }
    this.component = {
        ss: function () {
            console.log('ss')
        }
    }
    console.log('执行一次')
    $.ready(function() {
        var html = Sv.tplEngine(this.tpl, this.data);
        document.querySelector(this.scope).innerHTML = html;
    })
});
/* 建立模型 */
Sv.model('test', function () {
    this.test = {
        tt: function () {
            return 'tt'
            console.log('tt')
        }
    }
    //无配置函数的this
    console.log(this)
})



var tpl = new Sv.component({
    scope: '#dss',
    extend: ['test'],
    data: {
        k: '<script>'
    },
    tpl: '<div>{{k}}</div>',
    run: function () {
        info(this, '!this is a "run" function 137')
        // console.log(this.tpl)
        if (this.test.tt()=='tt') {
            console.log('调用成功')
        }
       
    },
})

var tpl2 = new Sv.component({
    scope: '#ds',
    //extend: [],
    data: {
        k: '<script>'
    },
    tpl: '<div>{{k}}</div>',
    run: function () {
       
        //   console.log(this.tpl)
    },
})

//测试一： this指向模型，与模型配置 //this 与模型this保持一致
tpl.controller(function () {
    info(this, '!this is a "tpl.controller" function 157')
})
if (tpl.tpl) {
    info(tpl, '!this is a "tpl obj" function 159')
}