$(function(){
	$("#frmRegist")
	.bootstrapValidator({
	}).on("error",function(event,$errFiles){
		// alert("验证有错误");
		return false;
	}).on("success",function(event){
		this.submit();
		return false;
	});;//开启某表单的验证功能
	var $btnMobileValidCode = $("#btnMobileValidCode");
	$("[name='registerParam.mobilePhone']").on('keyup',function(){
		$btnMobileValidCode.prop("disabled",!$(this).parents(".input-group").hasClass("has-success"));
	});
	var second = 60;
	$btnMobileValidCode.on("click",function(){
		var $this = $(this);
		$this.prop("disabled",true).text("请"+second+"秒后重新获取");
		var interval = window.setInterval(function(){
			$this.text("请"+(--second)+"秒后重新获取");
			if(second==0){
				window.clearInterval(interval);
				$this.prop("disabled",false).text("获取验证码");
				second = 5;
			}
		},1000);
	});
});