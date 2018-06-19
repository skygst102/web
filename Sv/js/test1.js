
function info(obj,msg) {
    var info='';
    for (var key in obj) {
           info+=key+' ';
    }
    console.log(info+'---'+msg)
}
/* 建立模型 */
Sv.model('component', function () {
    this.component = {
        ss: function () {
            console.log('ss')
        }
    }
    this.action=function () {
        var html = Sv.tplEngine(this.tpl, this.data);
        $.ready(function() {
            document.querySelector(this.scope).innerHTML = html;
        }.bind(this))
    }
});
/* 建立模型 */
Sv.model('test', function () {
    this.test = {
        tt: function () {
            return 'tt'
            console.log('tt')
        }
    }
    
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

// var tpl2 = new Sv.component({
//     scope: '#ds',
//     //extend: [],
//     data: {
//         k: '<script2>'
//     },
//     tpl: '<div>{{k}}</div>',
//     run: function () {
       
//         //   console.log(this.tpl)
//     },
// })

//测试一： this指向模型，与模型配置 //this 与模型this保持一致
tpl.controller(function () {
    info(this, '!this is a "tpl.controller" function ')
})
if (tpl.tpl) {
    info(tpl, '!this is a "tpl obj" function ')
}

console.log()
console.log(tpl.data.k='123')