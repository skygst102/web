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
        var RegExp=/\{\{([\s\S])\}\}/;
        $.each(vdom.querySelectorAll('*'), function (key, i,self) {
            var nodeval=key.childNodes[0].nodeValue;
            if (RegExp.test(nodeval)) {
                var tdata = nodeval.match(RegExp)[1];
                var svTpl=key.childNodes[0].nodeValue.replace(RegExp,'{$1}');
                key.setAttribute('tdata', tdata);
                key.setAttribute('svTpl', svTpl);
                
            }
        }.bind(this));
    
        var html = Sv.tplEngine(vdom.innerHTML, this.store);
        //处理dom
        document.querySelector(this.scope).innerHTML = html;
        var dom = document.querySelector(this.scope).querySelectorAll('*');
        $.each(dom, function (key, i,self) {
            var tdata=key.getAttribute('tdata');
            var svTpl=key.getAttribute('svTpl');
            if (tdata) {
                key.svTpl = tdata;
                key.tdata = svTpl;
                key.removeAttribute('tdata');
                key.removeAttribute('svTpl');
                arr.push([tdata,key,svTpl]);
                if (!this.observe.hasOwnProperty(key)) {
                    this.observe[tdata] =[];
                }
            }
        }.bind(this));
        console.log(arr)
        //映射对象
        $.each(arr,function(key,i,arr){
            console.log(key)
            this.observe[key[0]].push([key[1],key[2]])
        }.bind(this))
        console.log(this.observe)
        
        //test
        // var dd=document.querySelector(this.scope).querySelectorAll('*');
        // [].slice.call(dd).forEach(function (key,i,self) {
        //     console.log(key.tdata)
        // }) 
           
        //vm
        var observe=this.observe;
        Sv.observe(this.store,this.store,null,setter);
        function setter(val,key){
            $.each(observe[key],function(key,i,arr){
                console.log(key)
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

    var tpl = new Sv.component({
        scope: '#dss',
        extend: ['test'],
        store:{
            k: '<script2>',
            s:'0.000'
        },
        tpl: '<div>120....{{k}}<span>{{k}}12</span><div>0202</div>0.000</div><div>{{k}}</div><div>{{s}}</div>',
        run: function () {
            info(this, '!this is a "run" function 137')
            // console.log(this.tpl)
            if (this.test.tt() == 'tt') {
                console.log('调用成功')
            }
            console.log(this)
            this.store.k='12'
            this.store.ss='ss'
        },
    });

    //测试一： this指向模型，与模型配置 //this 与模型this保持一致
    tpl.controller(function () {
        info(this, '!this is a "tpl.controller" function ')
    })
    if (tpl.tpl) {
        info(tpl, '!this is a "tpl obj" function ')
    }

    
    tpl.store.k='4000'


//在浏览器console 内输入  tpl.store.k='45646466' 可测试数据绑定效果

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
//tplUrl      ==+
//tpl数组     ==+

