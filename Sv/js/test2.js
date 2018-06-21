'use strict'

function info(obj, msg) {
    var info = '';
    for (var key in obj) {
        info += key + ' ';
    }
    console.log(info + '---' + msg)
}

/* 建立模型 */
Sv.model('component', function () {
    this.component = {
        ss: function () {
            console.log('ss')
        }
    }
    this.observe={};
    this.action = function () {
        var arr=[];
        var vdom = Sv.vdom(this.tpl);
        $.each(vdom.querySelectorAll('*'), function (key, i) {
            var tdata = key.childNodes[0].nodeValue.replace(/\{\{|\}\}/g, '');
            key.setAttribute('tdata', tdata);
        });
        var html = Sv.tplEngine(vdom.innerHTML, this.data);
        //处理dom
        document.querySelector(this.scope).innerHTML = html;
        var dom = document.querySelector(this.scope).querySelectorAll('*');
        $.each(dom, function (key, i,self) {
            var tdata = key.tdata = key.getAttribute('tdata');
            key.removeAttribute('tdata');
            arr.push([tdata,key]);
            if (!this.observe.hasOwnProperty(key)) {
                this.observe[tdata] =[];
            }
        }.bind(this));
        //映射对象
        $.each(arr,function(key,i,arr){
            this.observe[key[0]].push(key[1])
        }.bind(this))
        
        //test
        // var dd=document.querySelector(this.scope).querySelectorAll('*');
        // [].slice.call(dd).forEach(function (key,i,self) {
        //     console.log(key.tdata)
        // }) 
           
        //vm
        var observe=this.observe;
        Sv.observe(this.data,this.data,null,setter);
        function setter(val,key){
            $.each(observe[key],function(key,i,arr){
                key.innerHTML=val
            })
        };
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

$.load(function(){
    window.tpl = new Sv.component({
        scope: '#dss',
        extend: ['test'],
        data:{
            k: '<script2>',
            s:'0.000'
        },
        tplUrl:'',
        tpl: '<div>{{k}}<div>{{k}}</div></div><div>{{k}}</div><div>{{s}}</div>',
        run: function () {
            info(this, '!this is a "run" function 137')
            // console.log(this.tpl)
            if (this.test.tt() == 'tt') {
                console.log('调用成功')
            }
            console.log(this)
            this.data.k='12'
            this.data.ss='ss'
        },
    });

    //测试一： this指向模型，与模型配置 //this 与模型this保持一致
    tpl.controller(function () {
        info(this, '!this is a "tpl.controller" function ')
    })
    if (tpl.tpl) {
        info(tpl, '!this is a "tpl obj" function ')
    }

});




//在浏览器console 内输入  tpl.data.k='45646466' 可测试数据绑定效果

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



// $.load(function(){
//     tpl.data.k = 'k===+++++'
//     console.log(tpl)
// })


//TODO
//tplUrl    ==+


console.log($.getJSON)
