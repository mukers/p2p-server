$(function(){
    $("#mainForm")
    	.bootstrapValidator()
    	.on("success",function(){
    		$.getJSON("/data/data2.json",MetaData.changeQuerys(this),function(data){
                MetaData.load(data);
            });
    	});
    $.getJSON("/data/data1.json",function(obj){
        MetaData.load(obj);//通过加载数据让metaData驱动程序工作
    });
    //所有承兑人类型tab页中的多选按钮（不包括全选）
    var $checks = $(".form-horizontal .check-group .btn-check");
    //承兑人类型tab页中的全选按钮
    var $checkAll = $(".form-horizontal .ico-check.chk-all").on("click",function(){
        var checked = $(this).toggleClass("checked").hasClass("checked");
        if(checked){
           $checks.not(".checked").trigger("click");
        }else{
            $checks.filter(".checked").trigger("click");
        }
    });
    $(".btn-check").on("click",function(){
        var $check = $(this);
        var checked = $check.toggleClass("checked").hasClass("checked");
        var checkedLength = $check.next().prop("checked",checked).parents(".check-group").find(".btn-check.checked").length;
        if(checkedLength===$checks.length){
            $checkAll.addClass("checked");
        }else{
            $checkAll.removeClass("checked");
        }
    });
    $("#billList tbody").on("click","tr",function(){
        $(this).find("td:first span").toggleClass("checked");
        var totalBillAmt=0,
            totalBillCnt=0,
            totalDueYield=0,
            totalInvestmentAmt=0,
            weightedAverageYield=0;
        $.each($(this).parent().find("td span.checked"),function(){
            var meta = $(this).data("meta");
            totalBillAmt+=meta.subscriptionAmt;
            totalBillCnt++;
            totalBillAmt+=meta.yearlyRate;
            totalInvestmentAmt+=meta.faceAmt;
            weightedAverageYield+=meta.discountRate;
        });
        totalBillAmt /= totalBillCnt;
        weightedAverageYield /= totalBillCnt;
        MetaData.load({
            detail:{
              "totalBillAmt": totalBillAmt||0,
              "totalBillCnt": totalBillCnt||0,
              "totalDueYield": totalDueYield||0,
              "totalInvestmentAmt": totalInvestmentAmt||0,
              "weightedAverageYield": weightedAverageYield||0
            }
        });
    });
});