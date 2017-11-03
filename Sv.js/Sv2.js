/*========================================================*//*
author: skygst
Emile:  1104995493@qq.com
version:1.0
*//*========================================================*/
"use strict";
try {window.attachEvent('onload',function () {
	if(!window.addEventListener){
		document.write(
			'你的浏览器过于陈旧，请升级浏览器!<br/> IE8以上版本或现代浏览器可显示内容 <br/>'+
			'IE:&nbsp;<a href="https://support.microsoft.com/zh-cn/help/17621/internet-explorer-downloads">点击升级</a><br/>'+
			'firefox:&nbsp;<a href="https://www.mozilla.org/zh-CN/firefox/new/">点击升级</a><br/>'+
			'360:&nbsp;<a href="http://se.360.cn/">点击升级</a>'
		)}return
	});
}catch(error){}
;(function(window,document){
	window.Sv_global={
		tplCache:{},
		tplCompileCache:{},
		tplModelName:'template',
		tplsyntax:/^if|^else|^for|^in|^break|^continue|^do|^while|^switch|^case/,
	};
	window.Sv=function(){
		return new Sv.vRun(arguments[0]);
	};
	Sv.vRun=function (el,newData,modelName){
		if(!el||el.charAt()!='#'){return}else{var _this=this};	
		window.addEventListener('load',function (){Sv.analysis_v(_this,el,newData,modelName)},false);
	};
	Sv.vRun.prototype=Sv.prototype;
	Sv.fnExtend=function(source){
		for(var name in source){
	        this.prototype[name]= source[name]; 
	    }	
	};
	Sv.Extend=function(source){
		for(var name in source){
	        Sv[name]= source[name]; 
	    }	
	};

	/*实例化后可在指令中调用其它指令函数 Sv.v.on2()*/
	Sv.v=new Sv();
	Sv.point=function(_this){
		var _thisEl=_this[0],_thisData=_this[1],_thisMel=document.querySelector(_this[2]);
		if(typeof _this[0]=='object'&&_this!='undefined'){
			return new function() {
				this.el=_thisEl.el[0];/*指令所在元素*/
				this.tpl=_thisEl.el[0].svtplNode;
				this.item=_thisEl.el[1]-1;/*指令所在元素下标*/
				this.mel=_thisMel;
				this.v_arg=[];
				this.data={};
				for (var i in _thisEl.v_arguments) {
					this.v_arg[i]=_thisEl.v_arguments[i]
				}	
				for(var i in _thisData){this.data[i]=_thisData[i]}		
			}				
		}else{return _this}		
	};
	Function.prototype.bind = function() {
		var fn = this,args = Array.prototype.slice.call(arguments),object = args.shift();
		return function() {
			return fn.apply(object, args.concat(Array.prototype.slice.call(arguments)));
		}
	};
	Sv.loadcss=function (str){
		var x = document.getElementsByTagName('head')[0]; 
		if(x.getElementsByTagName('style')[0]){
			var style=x.getElementsByTagName('style')[0];
			style.innerHTML+=str;	
		}else{
			var s = document.createElement('style');
			s.type="text/css";
			s.innerHTML=str; 
			x.appendChild(s);
		}	
	};
	Sv.loadcss('tpl{display:none;}')
})(window,document);
/*指令方法扩展*/
Sv.fnExtend({
	trim : function(arg) {
		arg[0].innerText.replace(/^\s|\r|\n/,'').replace(/\s|\r|\n$/,'');
	},

	//on:function(arg){
	//	console.log(arg)
	//},
	one:function(){
		var c=Sv.point(arguments)
		if(c.el){
			c.el.style.color='green'
		}
	},
})

Sv.Extend({
	loadjs:function (src) { 
		var x = document.getElementsByTagName('head')[0]; 
		if(src instanceof Array){
			for (var i = 0; i <src.length; i++) {
				var s = document.createElement('script'); 
				s.type = 'text/javascript'; 
				s.async = true; 
				s.defer = true;/* ie9-异步 */
				s.src = src[i]; 
				x.appendChild(s); 
			}
		}
	},
	each:function(obj,fn) {
		if(typeof obj.length=='number'){
			var fnReturn;
			for (var i = 0; i < obj.length; i++)fn.call(obj,i);
		}else if(obj instanceof Object){
			for (var key in obj)fn.call(obj, key);
		}
	},
	trys:function(fn){
		try {fn()} catch (error) {}
	},
	/*v='on(click,li);noe()'解析指令并执行对应函数*/
	analysis_v:function (_this,el,newData,modelName){
		if(/\s/.test(el)){
			var El=document.getElementById(el.match(/[^#].+(?=\s)/)[0]);
			if(!El){console.error('error:el:'+el);return}
			var childrenEl=document.querySelectorAll(el);
		}else{
			var El=document.getElementById(el.slice(1));
			if(!El){console.error('error:el:'+el);return}
			var childrenEl=El.querySelectorAll('*');
		}
		_this.v={};	/*指令集合*/
		/*获取指令*//* 重置模板模块时父元素指令重复修复 */
		if(newData&&El.hasAttribute('v')){
			_this.v[0]=El.attributes.v.value;_this[0]=El;	
		}					
		for (var i = 1; i <childrenEl.length+1; i++) {
			if(childrenEl[i-1].hasAttribute('v')){	    		
				_this.v[i]=childrenEl[i-1].attributes.v.value;
				_this[i]=childrenEl[i-1];/*将有命令的元素复制到对象上*/
			}	
		};
		/* 筛选模板指令 */
		if (newData&&Sv_global.tplModelName==modelName) {
			for (var key in _this.v)
			if (!Sv_global.tplsyntax.test(_this.v[key])&&!/tpl|~/.test(_this.v[key]))delete  _this.v[key];	
		}
		Sv.each(_this.v,function(i){
			var vv=_this.v[i].split(';');
			Sv.each(vv,function(k){
				var fn=vv[k].match(/.*(?=\()|\S.*|~/)[0];
				var fnA=vv[k].match(/\((.+)\)/);
				fnA ? fnA=fnA[1].split(',') : fnA=[];
				if(_this[fn]){
					fnA={el:[_this[i],i],v_arguments:fnA}
					if(_this.des) {
						var bindMergeNewParams=_this[fn].bind(_this,fnA);
						bindMergeNewParams(newData,el)
					}else{
						_this[fn].call(_this,fnA)
					}
				}
			})
		});
	},
	escape:function(str){
		return String(str).replace(/&(?!\w+;)/g,'$amp;').replace(/</g,'&lt;')
		.replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;')
		.replace(/\\/g, "").replace(/''/g,'');
	},
	tplEngine:function(tpl,data,cacheName,boole) {
		var complied=function(str){
			var tpl=str.replace(/\{\{\}\}|[\r\t\n]/g,'').replace(/\{\{([\s\S]+?)\}\}/g, function(match,value){
				return "' + escape(" + value + ")+ '" 
			}).replace(/<%([\s\S]+?)%>/g, function(match,value){
				return "';\n" + value + "\ntpl+='";
			}).replace(/[\s]{5}/g,'').replace(/(tpl\+=\'\';)/g,'')
			tpl="tpl='"+ tpl +"';";
			tpl='var tpl="";\nwith(obj||{}){\n' + tpl + '}\nreturn tpl;';
			return new Function('obj','escape',tpl);
		};	
		var Engine=function(tpl,data,cacheName,boole){	
			if (boole) {
				var tplcomplied=complied(tpl);
				return tplcomplied(data,Sv.escape);
			}
			/* 编译后缓存 */
			if(cacheName&&!Sv_global.tplCompileCache[cacheName]){
				Sv_global.tplCompileCache[cacheName]=complied(tpl);
			}	
			return Sv_global.tplCompileCache[cacheName](data,Sv.escape);
		}
		return Engine(tpl,data,cacheName,boole)
	},
	initModule:function(M,fn,modelName){
		this.des='Module';
		this.el=M.el;
		this.data={};
		this.setData;
		fn.call(this);
		for(var name in M.data)this.data[name]=M.data[name];
		var zObj=Object.create(fn);
		for(var i in zObj)typeof zObj[i]=='function' ? zObj[i].call(this) : false; 
		Object.defineProperty(this, "setData", {
			set : function (val) {
				for(var name in val)
				this.data[name]=val[name]
				this.tpl(this.data,false)
			}
		});
		if(M.run){M.run.call(this)};
		Sv.vRun.call(this,M.el,this.data,modelName);
	},
	Model:function(modelName,fn){	
		Sv[modelName]=function (M){Sv.initModule.call(this,M,fn,modelName)};
	},
	define:function(modelName,fn){
		Sv[modelName]=fn;
	},
});
/* 建立模块 */
// Sv.define('mustache22',function() {
// 	console.log(this)
// 	this.name='22mustache';
// 	console.log(arguments)
// 	console.log('1212')
// })		
// new Sv.mustache22({el:'ddd'})	
/* 建立模型 */
Sv.Model('template',function() {
	this.des='template模型';
	this.style='';
	this.tpl=function() { 
		var start=new Date().getTime();/* 测试 */
		var c,len,tf,ajax,flagNodes,reset,html='',el=this.el;
		if (arguments.length==2) {
			reset=arguments[1];
			arguments[0].ajax.length ? ajax=arguments[0].ajax[0] : ajax=arguments[0].ajax;
		}else{
			c=Sv.point(arguments);
			c.data.ajax.length ? ajax=c.data.ajax[0] : ajax=c.data.ajax;	
		}	
		/* 代码片段截取node */	
		var compileFlag=document.createDocumentFragment();
		var compileDiv=document.createElement('div');
		compileFlag.appendChild(compileDiv);
		compileFlag.querySelector('div').innerHTML=document.querySelector(el).innerHTML;
		if (reset||!Sv_global.tplCache[el]) {
			flagNodes=Sv_global.tplCache[el]=compileFlag.querySelector('div').querySelectorAll('*');
		}else{flagNodes=Sv_global.tplCache[el];}
		Sv.each(flagNodes,function(i){
			if (flagNodes[i].nodeName.toLowerCase()!='tpl')
				flagNodes[i].setAttribute('svtplNode',i);	
		});
		Sv.each(this.v,function(key){
			if (Sv_global.tplsyntax.test(this[key])) {
				html+='<%'+this[key]+'{%>'+flagNodes[key-1].innerHTML+'<%}%>';	
			}else if(key>0&&/~/.test(this[key])){/* 命令~ 仅编译 */
					len=flagNodes[key-1].querySelectorAll('*').length
				if (len>0) {
					html+=flagNodes[key-1].innerHTML
				}else{
					var tf=flagNodes[key-1].parentNode.nodeName.toLowerCase()=='tpl';
					flagNodes[key-1].removeAttribute('v');
					tf ? true : html+=flagNodes[key-1].outerHTML	
				}	
			}
		});
		/* 编译之后加入文档片段 */
		compileFlag.querySelector('div').innerHTML=Sv.tplEngine(html,ajax,el);
		/* 从文档片段里面取出节点 */
		var newFlag=compileFlag.querySelector('div').querySelectorAll('*')
		Sv.each(newFlag,function(i){
			this[i].svtplNode=this[i].getAttribute('svtplNode');
			this[i].removeAttribute('svtplNode')
		});
		document.querySelector(el).innerHTML='';
		document.querySelector(el).appendChild(compileFlag.querySelector('div'));
		/* 重置模型元素 */
		this.resetModel(el);
		var end=new Date().getTime();/* 测试 */
		document.querySelector('#time').innerHTML=end-start;/* 测试 */
	};
	this.resetModel=function(el){
		var F=new Object;
		Object.defineProperty(F, "setData", {
			set : function (val) {this.tpl(val,false)}/* false 判断是否执行缓存内容 */
		});
		Sv.each(this,function(key){
			if (Number(key)) {delete this[key]}
			F[key]=this[key]
		});
		Sv.analysis_v(F,el)/* 加入第三个参数将无限循环 */
	};
	this.view=function(el,data){	
		var newHtml=Sv.tplEngine(Sv_global.tplCache[this.el][el.svtplNode].innerHTML,data,null,true);
		el.innerHTML=newHtml;
	}
})


// new Sv.template({
// 	el: '#dss',
// 	data: {
// 		tel : '1325979196',
// 		idCard : '610528199110024870',
// 		ajax:[{
// 			user:"name",
// 			name:"join",
// 			jj:{s:"kk",ss:"gg"}	,
// 			val:true,
// 			vl:true,
// 			tl:false,
// 		}]
// 	},
// 	run:function () { 
// 		var json2=[{user:"name",
// 			name:"join",
// 			jj:{s:"k00000k",ss:"gg000.0..0"},
// 			val:true,
// 			vl:true,
// 			tl:false,
// 		}]
// 		this.bind=function(){
// 			var c=Sv.point(arguments)
// 			var _this=this
// 			c.el.style.color='green'
// 			c.el.addEventListener('click',function(){
// 				_this.view(this,json3)
// 			})
// 		};
// 		var json3={jj:{s:"5555555k",ss:"444444"}}
// 		this.on=function(){
// 			var c=Sv.point(arguments);
// 			var _this=this;
// 			c.el.addEventListener('click',function(){
// 				_this.setData={ajax:json2}
// 			})
// 		};
// 		this.onee=function(){
// 			var c=Sv.point(arguments)
// 			c.el.style.color='red'
// 		};

// 	}
// })

new Sv.template({
	el: '#dsss',
	data: {
		tel : '1325979196',
		idCard : '610528199110024870',
		ajax:[{
			user:"name",
			name:"join",
			jj:{s:"kk",ss:"gg"}	,
			val:true,
			vl:true,
			tl:false,
		}]
	},
	run:function () { 
		var _this=this;
		var json2=[{
			user:"name",
			name:"join",
			jj:{s:"k0sssssssk",ss:"gg000.0..0"},
			val:true,
			vl:true,
			tl:false,
		}]
		var json3={jj:{s:"5sssssk",ss:"ssssssss"}}

		this.on=function(){
			var c=Sv.point(arguments);
			c.el.addEventListener('click',function(){
				_this.setData={ajax:json2}
			})
		};
		this.onee=function(){
			var c=Sv.point(arguments)
			c.el.style.color='red'
		};
		this.bind=function(){
			var c=Sv.point(arguments)
			c.el.style.color='green'
			c.el.addEventListener('click',function(){
				_this.view(this,json3)
			})	
		};
		this.bi=function () {  
			var c=Sv.point(arguments)
			c.el.style.color='green';
			c.el.addEventListener('click',function(){
				_this.view(this,json3)
			})	
		}
	}
})
// var jk=new Sv('#ddd');










// new Sv.template({el: '#dss'})
// Sv.Model('fromModule_v',function() {
// 	this.des='验证模型';
// 	//var kss=new Sv.template
// 	// console.log(this)
// 	// Sv.template.call(this)/* 继承模板 */
	

// 	this.on=function(){
// 		var c=Sv.point(arguments)
// 		// console.log(c)
// 		if(c.el){
// 			c.el.style.color='green'
// 			// console.log(c.data)
// 		}			 
// 	}
	
// 	this.verify=function() {
		
// 		return arguments[0]
// 	};
// 	this.isTel=function() {
// 		return /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/.test(arguments[0])
// 	};
// })


// new Sv.fromModule_v({
// 	el: '#ddd',
// 	data: {
// 		tel : '1325979196',
// 		idCard : '610528199110024870',
// 		password:''
// 	},
// 	run : function(){
//   		// this.setData({
//         // 	tel: 132.156,
// 		// })
// 		//console.log(this.data)
// 	  	if(this.isTel(this.data.tel)===true){
// 		 //	//console.log('Phone验证成功')
// 	  }
// 	}
// })







