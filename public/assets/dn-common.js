$(function(){
    if($.fn.datetimepicker){
        $(".form-date").datetimepicker({
            language: 'zh-CN',//国际化语言种类
            format: "yyyy-mm-dd",//格式（项目会统一格式）
            weekStart: 1,
            todayBtn: 1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            minView: 2,
            forceParse: 0
        }).on('changeDate', function(ev){
            var $t = $($(ev.target).attr("date-relative"));
            if($t.size()>0){
                $t.datetimepicker('setStartDate', ev.date);
                if(ev.date>$t.datetimepicker('getDate')){
                    $('input',$t).val("");
                }
            }
        });
         // 移除输入框内容按钮
        $(document).on("click", ".glyphicon-remove", function() {
            $(this).parent().prev().val("");
            //$('.form-date').datetimepicker('setStartDate',new Date());
        });
    }
	
    //扩展验证规则
    $.fn.bootstrapValidator&&$.fn.bootstrapValidator.extendRules({
    	//只有银行系统才会有这样的验证规则
    	//必须是小数，正书，1-24之间的两位小数
    	rate : function(){
    		if(!this.val())return true;
    		return /^([\d]+)(\.[\d]{1,2})?$/.test(this.val())
    				&&
    			   Number(this.val())<=24;
    	}
    });
});
//工具
var Utils = {
    //金额格式化工具
    numberFormat : function(o ,s, n) { 
        if(arguments.length>0){
            var type = $(o).data("format-type");
            $(o).removeAttr("data-format-type");
            switch(type){
                case "amount":
                    n = n > 0 && n <= 20 ? n : 2; 
                    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + ""; 
                    var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1]; 
                    t = ""; 
                    for (i = 0; i < l.length; i++) { 
                    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : ""); 
                    } 
                    return t.split("").reverse().join("") + "." + r; 
                case "integer":
                    return parseInt(s);
                case "rate":
                    return (Number(s)*100).toFixed(2);
                case "account":
                    var money = s;
                    if (isNaN(money) || money > Math.pow(10, 12))
                        return "";
                    var cn = "零壹贰叁肆伍陆柒捌玖";
                    var unit = new Array("拾百千", "分角");
                    var unit1 = new Array("万亿", "");
                    var numArray = money.toString().split(".");
                    var start = new Array(numArray[0].length - 1, 2);
                    function toChinese(num, index)
                    {
                        num = num.replace(/\d/g, function($1)
                        {
                            return cn.charAt($1) + unit[index].charAt(start-- % 4 ? start % 4 : -1);
                        });
                        return num;
                    }
                    for (var i = 0; i < numArray.length; i++)
                    {
                        var tmp = "";
                        for (var j = 0; j * 4 < numArray[i].length; j++)
                        {
                            var strIndex = numArray[i].length - (j + 1) * 4;
                            var str = numArray[i].substring(strIndex, strIndex + 4);
                            start = i ? 2 : str.length - 1;
                            var tmp1 = toChinese(str, i);
                            tmp1 = tmp1.replace(/(零.)+/g, "零").replace(/零+$/, "");
                            tmp1 = tmp1.replace(/^壹拾/, "拾");
                            tmp = (tmp1 + unit1[i].charAt(j - 1)) + tmp;
                        }
                        numArray[i] = tmp;
                    }
                    numArray[1] = numArray[1] ? numArray[1] : "";
                    numArray[0] = numArray[0] ? numArray[0] + "元" : (numArray[0], numArray[1] = numArray[1].replace(/^零+/, ""));
                    numArray[0] = numArray[0].match(/亿万/) ? numArray[0].replace("亿万","亿") : numArray[0];
                    numArray[1] = numArray[1].match(/分/) ? numArray[1] : numArray[1] + "整";
                    return numArray[0] + numArray[1];
                default :
                    return s;
            }
        }else{
            $("[data-format-type]").each(function(){
                var $this = $(this);
                $this.text(Utils.numberFormat($this,$this.text(),2));
            });
        }
    }
};