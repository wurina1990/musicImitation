(function(){
	
	//清除事件的默认行为
	
	document.addEventListener("touchstart",function(ev){
		ev.preventDefault();
	});
	
	
	//rem适配方案
	(function(){
		var width = document.documentElement.clientWidth/16;
		var styleNode = document.createElement("style");
		styleNode.innerHTML="html{font-size:"+width+"px!important}"
		document.head.appendChild(styleNode);
	})();
	
	

					
	//选项卡
	tab();
	function tab(){
		var wraps = document.querySelectorAll(".tab_wrap");
		var navs = document.querySelectorAll(".tab_nav");
		
		//实现高可复用
		var translateX = navs[0].offsetWidth;
		for(var i=0;i<wraps.length;i++){
			move(wraps[i],navs[i]);
		}
		
		function move(wrap,nav){
			//开启3d硬件加速
			css(wrap,"translateZ",0.01);
			
			css(wrap,"translateX",-translateX);
			
			//实现防抖动滑屏
			var startX =0;
			var startY =0;
			var elementX =0;
			var elementY =0;
			//判断用户首次上来滑动的方向
			//判断滑动的方向
			var isX = true;
			var isFirst = true;
			
			var isloading = false;
			//抽象小绿的位置
			var now = 0;
			
			var smallGreen = nav.querySelector("span");
			css(smallGreen,"translateZ",0.01);
			var aNodes = nav.querySelectorAll("a");
			var loading = wrap.querySelectorAll(".tab_loading");
			wrap.addEventListener("touchstart",function(ev){
				
				if(isloading){
					return;
				}
				wrap.style.transition="none";
				var touch = ev.changedTouches[0];
				startX = touch.clientX;
				startY = touch.clientY;
				elementX = css(wrap,"translateX");
				elementY = css(wrap,"translateY");
				
				isX=true;
				isFirst=true;
			})
			
			wrap.addEventListener("touchmove",function(ev){
				
				if(isloading){
					return;
				}
				//开关
				if(!isX){
					return;
				}
				var touch = ev.changedTouches[0];
				var nowX = touch.clientX;
				var nowY = touch.clientY;
				var disX = nowX -startX;
				var disY = nowY -startY;
				
				//解决抖动问题
				if(isFirst){
					isFirst=false;
					if(Math.abs(disY)>Math.abs(disX)){
						isX=false;
					}
				}
				css(wrap,"translateX",elementX + disX);
				
				
				if(Math.abs(disX) >= translateX/2){
					end(disX);
				}
			})
			
			wrap.addEventListener("touchend",function(ev){
			
				if(isloading){
					return;
				}
				wrap.style.transition="1s";
				var touch = ev.changedTouches[0];
				var nowX = touch.clientX;
				var disX = nowX -startX;
				if(Math.abs(disX) < translateX/2){
					css(wrap,"translateX",-translateX);
				}
			})
			
			//过半滑屏
			function end(disX){
				
				isloading=true;
				wrap.style.transition="0.5s";
				//dir为1的时候代表向右滑，dir为-1代表向左滑
				var dir = Math.abs(disX)/disX;
				var target = dir>0?0:-2*translateX;
				now -=dir;
				if(now>aNodes.length-1){
					now = 0;
				}else if(now<0){
					now = aNodes.length-1;
				}
				console.log(now);
				
				css(wrap,"translateX",target);
				wrap.addEventListener("transitionend",transitionend);
				wrap.addEventListener("webkitTransitionEnd",transitionend);
			}
			
			
			
			function transitionend(){
				
				var left = aNodes[now].offsetLeft;
				smallGreen.style.transition="2s";
				css(smallGreen,"translateX",left);
				
				for(var i=0;i<loading.length;i++){
					loading[i].style.opacity="1";
				}
				wrap.removeEventListener("transitionend",transitionend);
				wrap.removeEventListener("webkitTransitionEnd",transitionend);
				
				
				setTimeout(function(){
					
					wrap.style.transition="none";
					for(var i=0;i<loading.length;i++){
						loading[i].style.opacity="0";
					}
					css(wrap,"translateX",-translateX);
					isloading=false;
				},1000);
			}
		}
	}
	
	//无缝滑屏
	
	carouselFigure();
	function carouselFigure(){

		var cssNode = document.createElement("style");
		var wrap = document.querySelector("#pic_wrap");
		var list = document.querySelector("#pic_list");
		css(list,"translateZ",0.01);
		list.innerHTML +=list.innerHTML;
		var liNodes = document.querySelectorAll("#pic_list li");
		var navs = document.querySelectorAll("#pic_nav span");
		
		var cssText = "#pic_list{width: "+(liNodes.length)+"00%;}";
			cssText += "#pic_list li{width:"+1/(liNodes.length)*100+"%;}";
			cssText += "#pic_wrap{height:"+liNodes[0].offsetHeight+"px;}";
		cssNode.innerHTML+=cssText;
		document.head.appendChild(cssNode);
		
//				var startX =0;
//				var startY =0;
		var startPoint={};
		var elementX =0;
		var elementY =0;
		var now =0;
		var clear=0;
		
		//判断用户首次上来滑动的方向
		//判断滑动的方向
		var isX = true;
		var isFirst = true;
		wrap.addEventListener("touchstart",function(ev){
			clearInterval(clear);
			
			list.style.transition="none";
			
			if(now==0){
				now = navs.length;
			}else if(now==liNodes.length-1){
				now = navs.length-1;
			}
			css(list,"translateX",-now*wrap.offsetWidth);				
			
			var touch = ev.changedTouches[0];

			startPoint = {clientX:touch.clientX,clientY:touch.clientY};
			elementX = css(list,"translateX");
			elementY = css(list,"translateY");
			
			isX=true;
			isFirst=true;
		})
		wrap.addEventListener("touchmove",function(ev){
			//开关
			if(!isX){
				return;
			}
			var touch = ev.changedTouches[0];
//					var nowX = touch.clientX;
//					var nowY = touch.clientY;
//					var nowPoint = touch;
			var nowPoint = {clientX:touch.clientX,clientY:touch.clientY};
//					var disX = nowX -startX;
//					var disY = nowY -startY;
			var disX = nowPoint.clientX -startPoint.clientX;//0
			var disY = nowPoint.clientY -startPoint.clientY;//0
			
//					解决抖动问题
			if(isFirst){
				isFirst=false;
				if(Math.abs(disY)>Math.abs(disX)){
					isX=false;
				}
			}
			
			css(list,"translateX",elementX + disX);
			
		})
		
		wrap.addEventListener("touchend",function(){
			
		
			now =Math.round(-css(list,"translateX")/wrap.offsetWidth);
			if(now<0){
				now=0;
			}else if(now>liNodes.length-1){
				now=liNodes.length-1
			}
			autoMove();
			auto();
		})
		
		auto();
		function auto(){
			clear=setInterval(function(){
				
				if(now>=liNodes.length-1){
					list.style.transition="none";
					now = navs.length-1;
					css(list,"translateX",-now*wrap.offsetWidth);
				}
				
				setTimeout(function(){
					now++;
					autoMove()
				},20)
				
			},1000)
		}
		
		function autoMove(){
			list.style.transition="0.5s";
			css(list,"translateX",-now*wrap.offsetWidth);
			
			for(var i=0;i<navs.length;i++){
				navs[i].className="";
			}
			navs[now%navs.length].className = "pic_active";
		}
	}
	
	
	//自定义滑屏&&滚动条
	definedBySelf();
	function definedBySelf(){
	
		var head = document.querySelector("#header");
		head.addEventListener("touchstart",function(ev){
			ev.stopPropagation();
		})
		head.addEventListener("touchmove",function(ev){
			ev.stopPropagation();
		})
		head.addEventListener("touchend",function(ev){
			ev.stopPropagation();
		})
		
		var search = document.querySelector("#search");
		
		var scrollBar = document.querySelector(".scrollBar");
		var wrap = document.querySelector(".wrap");
		var content = document.querySelector("#content");
		var scale = wrap.clientHeight/content.offsetHeight;
		scrollBar.style.height = wrap.clientHeight*scale+"px";
		
		var callBack={};
		callBack.start=function(){
		
			console.log("start");
			
			scrollBar.style.opacity="1";
		}
		callBack.move=function(){
			
			console.log("move");
			var top = -css(content,"translateY")*scale;
			css(scrollBar,"translateY",top);
			
			if(top>5){
				search.style.display="none";
			}else{
				search.style.display="block";
			}
			
		}
		callBack.end=function(){
	
			console.log("end");
			scrollBar.style.opacity="0";
		}
		drag(wrap,1,callBack);
		
		//搜索按钮的行为
		var searchBtn = document.querySelector("#searchBtn");
		searchBtn.addEventListener("touchstart",function(){
			var top = -css(content,"translateY")*scale;
		
			if(search.style.display=="block"){
				if(top>5){
					search.style.display="none";
				}
			}else{
				search.style.display="block";
			}
		})
	}
	
	
	//导航的点击变色
	changeColor ();
	function changeColor(){
		var list = document.querySelector("#nav_list");
		var lis =document.querySelectorAll("#nav_list a");
		list.addEventListener("touchmove",function(){
			if(!this.move){
				this.move=true;
			}
		})
		list.addEventListener("touchend",function(ev){
			var touch = ev.changedTouches[0];
			if(!this.move){
				for(var i=0;i<lis.length;i++){
					lis[i].className="";
				}
				touch.target.className="nav_active";
			}
			this.move=false;
		})
	}
	
	//导航拖拽
	dargNav()
	function dargNav(){
		var wrap = document.querySelector("#nav_wrap");
		var list = document.querySelector("#nav_list");
		css(list,"translateZ",0.01);
		var minX = wrap.clientWidth - list.offsetWidth;
		
		var startX = 0;
		var elementX = 0;
		//橡皮筋系数
		var ratio = 1;
		
		

		var lastPoint =0;
		var lastTime = 0;
		var timeV = 1;
		var pointV =0;
		wrap.addEventListener("touchstart",function(ev){

			pointV =0;
			timeV = 1;
			list.style.transition="none";
			
			var touch = ev.changedTouches[0];
			startX = touch.clientX;
			elementX = css(list,"translateX");
			
			lastPoint = startX;
			lastTime = new Date().getTime();
			
		})
		
		wrap.addEventListener("touchmove",function(ev){
			var touch = ev.changedTouches[0];
			var nowX = touch.clientX;
			var dis = nowX - startX;
			var translateX=elementX+dis;

			if(translateX>0){
				//移动距离越大，距离的增幅越小
				ratio = document.documentElement.clientWidth/((document.documentElement.clientWidth+translateX)*1.8);
				translateX=translateX*ratio;
			}else if(translateX<minX){
				//右边的留白（正值）
				var over = minX - translateX;
				ratio = document.documentElement.clientWidth/((document.documentElement.clientWidth+over)*1.8);
				translateX=minX-(over*ratio);
			}
			
			var nowTime = new Date().getTime();
			var nowPoint = nowX;
			pointV = nowPoint - lastPoint;
			timeV = nowTime - lastTime;
			lastPoint = nowPoint;
			lastTime = nowTime;
			
			css(list,"translateX",translateX);
		})
		
		wrap.addEventListener("touchend",function(){
			var speed = pointV/timeV;
			var addX = speed*200;
			var target= css(list,"translateX")+addX;
			var bessel ="";
			var time =0;
			time = Math.abs(speed)*0.3;
			time =time<0.3?0.3:time;
			
			if(target>0){
				target=0;
				bessel="cubic-bezier(.65,1.49,.63,1.54)";
			}else if(target<minX){
				target = minX;
				bessel="cubic-bezier(.65,1.49,.63,1.54)";
			}
			
			
			list.style.transition=time+"s "+bessel;
			css(list,"translateX",target);
		})
	}
	
	//输入框的获焦，失焦事件
	getFocus();
	function getFocus(){
		var textNode = document.querySelector("#search input[type='text']");
		textNode.addEventListener("touchstart",function(ev){
			this.focus();
			ev.stopPropagation();
		})
		document.addEventListener("touchstart",function(){
			textNode.blur();
		})
	}
	
	//系统菜单切换
	CMFCMenuBar();
	function CMFCMenuBar(){
		var menuBtn = document.querySelector("#menuBtn");
		var list =document.querySelector("#list");
		
		menuBtn.addEventListener("touchstart",function(ev){
			if(this.className == "menuBtnClos"){
				this.className = "menuBtnOpen";
				list.style.display="block";
			}else if(this.className == "menuBtnOpen"){
				this.className = "menuBtnClos";
				list.style.display="none";
			}
			
			ev.stopPropagation();
		})
		
		
		document.addEventListener("touchstart",function(){
			if(menuBtn.className == "menuBtnOpen"){
				menuBtn.className = "menuBtnClos";
				list.style.display="none";
			}
		})
		
		//避免事件点透
		list.addEventListener("touchstart",function(ev){
			ev.stopPropagation();
		})
	}
	
})()
