/*========================================================*//*
author: skygst
Emile:  1104995493@qq.com
update: 2017年8月2日
notes：
1.指令名称定义，d_开头的为dom操作， u_ 开头的为ui操作， 无前缀的为普通方法。
2.命令方法扩展中还可以应用其它库
3.指令 v：<li v='on(click,li)；on2(click,li)'>1111</li>(一个指令中可存在多个指令，用分号隔开；on与on2都是指令函数名称；括号里面的为指令函数参数，多个参数用 '，'隔开)
4.命令扩展方法中存在一个默认参数，此参数返回一个数组，例：[li, "6", "2"]
  数组第一个值是指令所在元素的定位，后面的值为指令函数参数
5.var s=new Sv.point(arg);在指令中实例化此对象，可对arg参数进行便捷操作；（在指令函数中实例化后自动执行指令中的回调函数）
console.log(s.el);指令所在元素 ； 可用其它库进行包装 例如：$（s.el）将转化为jq对象
console.log(s.item)； 指令所在元素下标
console.log(s.callback)；指令的回调函数
Sv.fn.on2()//在指令中调用其它指令函数
用法：给父元素添加id属性然后实例化：var jk=new Sv('#ddd') 实例化后自动执行指令；意义：将父元素包裹下的子元素，实例化为一个对象，每个子元素都可以认为是此对象的一个属性；
打印实例化后的 jk 会发现有很多属性，还可以对此进行进一步的操作；


*//*========================================================*/
;(function(window){
	window.Sv=function(){
		return new Sv.vRun(arguments[0]);
	};
	var fn=Sv.prototype;
	Sv.vRun=function (el){
		if(!el||el.charAt()!='#'){return}else{var _this=this,childrenEl,El;}
		function fn(){	
			if(/\s/.test(el)){
				El=document.getElementById(el.match(/[^#].+(?=\s)/)[0]);
				if(!El){console.error('error:el:id');return}
				childrenEl=document.querySelectorAll(el);
			}else{
				El=document.getElementById(el.slice(1));
				if(!El){console.error('error:el:id');return}
				childrenEl=El.getElementsByTagName('*');
			};
			_this.v={};	/*指令集合*/
			/*获取指令并提出指令*/		
	    	for (var i = 0; i <childrenEl.length; i++) {
	    		if(childrenEl[i].hasAttribute('v')){		    		
		    		_this.v[i]=childrenEl[i].attributes.v.value;
		    		_this[i]=childrenEl[i];/*将有命令的元素复制到对象上*/
	    		}	
	    	}; 
	    	if(El.hasAttribute('v')){		    		
	    		_this.v[-1]=El.attributes.v.value;
	    		_this[-1]=El;
	    		
    		}	
    			
			analysis_v(_this.v);			
		};
		/*执行*/
		try{
			window.addEventListener('load',fn,false)
		}catch(err){
			window.attachEvent('onload',fn)
		};	
		/*v='on(click,li)'//解析指令并执行对应函数*/
	    function analysis_v (v){
			/*指令是否存在*/
			function has_v(fn,fnA,el){
				if(_this[fn]){
					fnA.unshift(el);
					_this[fn].call(_this[fn],fnA);
				}
			};
			for(i in v) {
				var vv=v[i].split(';');
				for(k in vv){
					var fn=vv[k].match(/\S.+(?=\()|\S.+/)[0];
					var fnA=vv[k].match(/\((.+)\)/);
					fnA ? fnA=fnA[1].split(',') : fnA=[];
					if(childrenEl[i]){
						has_v(fn,fnA,[childrenEl[i],i])
					}else{has_v(fn,fnA,[El,-1]);}	
				}
			}
	    };	
	};
	Sv.vRun.prototype=fn;
	Sv.fnExtend=function(source){
		for(var name in source){
	        this.prototype[name]= source[name]; 
	    }	
	};
	Sv.Extend=function(source){
		for(var name in source){
	        this[name]= source[name]; 
	    }	
	};


	console.log(Sv());
	/*实例化后可在指令中调用其它指令函数 Sv.fn.on2()*/
	Sv.v=new Sv();
	Sv.point=function(arg){
		this.el=arg[0][0];/*指令所在元素*/
		this.item=arg[0][1];/*指令所在元素下标*/
	};
})(window);

/*指令方法扩展*/
Sv.fnExtend({
	trim : function(arg) {
		arg[0].innerText.replace(/^\s|\r|\n/,'').replace(/\s|\r|\n$/,'');
	},

	//on:function(arg){
	//	console.log(arg)
	
	//	//var s=new Sv.point(arg);
	//	//console.log(s)
	//	//console.log(s.el)
		
		
	//},
	one:function(arg){
		console.log(arg)
		//var s=new Sv.point(arg);
		//console.log(s)
		//console.log(s.el)
		
		
	},



})

//var jk=new Sv('#ddd li');
//var jd=new Sv('#ddd');
initModule=function(){
	this.data={};
	for(name in arguments[0].data){
   		this.data[name]=arguments[0].data[name];
	}
	this.el=arguments[0].el;
	Sv.vRun.call(this,this.el);
	this.setData=function(setData) {
		for(name in setData){
	   		this.data[name]=setData[name];
   		}		
   	};
   	arguments[1].call(this);
   	if(arguments[0].run){arguments[0].run.call(this)} 
}
initialize=function () {
	return initModule.apply(arguments[0],[arguments[1],arguments[2]]);
}
fromModule_v=function (M,El){
	initialize(this,M,function() {
		this.des='表单验证模型';

		this.on=function(arg){
	 		console.log(arg)
	 		console.log('on'); 
		}
		
		this.verify=function() {
			return arguments[0]
		};
		this.isTel=function() {
			return /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/.test(arguments[0])
		};
		this.isPassword=function(){
			/*密码只能为6-20个字母、数字、下划线、点*/
			return /^(\w){6,20}|[.]$/.test(arguments[0])
		};
		this.isName=function(){
			/*名称不能为空或含有空格*/
			return /^\S+$/.test(arguments[0])
		};
		this.isEmile=function() {
			return /^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/.test(arguments[0])
		};
	   	this.isPhone=function(){
		   	return /^1[3|4|5|8][0-9]\d{4,8}$/.test(arguments[0])
	   	};
	   	this.isIdcard=function(){
		   	return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(arguments[0])
	   	};
	});
		
   		 	   	
}


new fromModule_v({
	el: '#ddd',
	data: {
		phone : '1325979196',
		idCard : '610528199110024870',
		password:''
	},
	run : function(){
		//重置data对象
		//this.setData({
  //      	phone: '111',
  //      	idCard: 'setidcard'
  //      })
 // console.log(this);
		//console.log(this.data.idCard);//setData生效
		//console.log(this.data.phone);
		
		
	  	if(this.isName(this.data.password)===true){
		 	//console.log('Phone验证成功')
	  }
	}
})


