$(function(){
	var $header = $("header");
	var $menu = $header.find(".menubar");
	$("#sw").sectionWrapper({
		showSerial:true
	}).on("beforeWheel",function(event,ops){

		$header.addClass("hide");
		$(".section-2").removeClass("action");

	}).on("afterWheel",function(event,ops){

		var index = ops.after;
		if(index==0){
			$menu.removeClass("black").addClass("white");
		}else{
			$menu.removeClass("white").addClass("black");
		}
		if(index==1){
			ops.afterDOM.addClass("action");
		}
		$header.removeClass("hide");

	});
	// var $sectionWrap = $(".section-wrap");
	// var $header = $("header");
	// var $menu = $header.find(".menubar");
	// var index = 0,last = $sectionWrap.find("li.section").length-1;
	// var lock = true;
	// function onBeforeWheel(index){
	// 	console.log(index);
	// 	$header.addClass("hide");
	// 	$(".section-2").removeClass("action");
	// }
	// function onAfterWheel(index){
	// 	if(index==0){
	// 		$menu.removeClass("black").addClass("white");
	// 	}else{
	// 		$menu.removeClass("white").addClass("black");
	// 	}
	// 	if(index==1){
	// 		$(".section-2").addClass("action");
	// 	}
	// 	$header.removeClass("hide");
	// }
	// $(document.body).on("mousewheel",function(e){
	// 	if(lock){
	// 		lock = false;
	// 		var dir = e.originalEvent.deltaY<0;
	// 		var beforeIndex = index;
	// 		dir?index--:index++;
	// 		index = Math.min(index,last);
	// 		index = Math.max(index,0);
	// 		if(beforeIndex==index){
	// 			lock = true;
	// 			return;
	// 		}
	// 		onBeforeWheel(beforeIndex);
	// 		$sectionWrap.css({
	// 			"transform": "translateY(-"+index+"00%)",
	// 			"-moz-transform": "translateY(-"+index+"00%)",
	// 			"-webkit-transform": "translateY(-"+index+"00%)",
	// 			"-o-transform": "translateY(-"+index+"00%)"
	// 		});
	// 		setTimeout(function(){
	// 			lock = true;
	// 			onAfterWheel(index);
	// 		},1000);
	// 	}
	// });
});