var MetaData = (function(){
	var __PROTOTYPE__ = {
		//装载元数据
		"load" : function(metaData){
			metaData = metaData||{};
			for(var tab in metaData){
				if(this[tab]){
					this[tab].load = true;//打开渲染按钮
					this[tab].data = metaData[tab];
				}
			}
			this.driver();
		},
		"changeQuerys" : function(form){
			var arr = $(form).serializeArray();
			var f;
			for(var i=0;i<arr.length;i++){
				f = arr[i];
				this.querys[f.name] = f.value;
			}
			return this.querys;
		},
		//驱动所有load为true的模块的render方法
		"driver" : function(){
			for(var module in this){
				var m = this[module];
				if(m.load){
					m.beforeRender&&m.beforeRender(this);//渲染模块之前回调
					m.render&&m.render(this);//渲染模块
					m.afterRender&&m.afterRender(this);//渲染模块之后回调
					m.load = false;//关闭渲染按钮
				}
			}
		}
	};
	return $.extend({
		//查询条件
		"querys":{
			"querys.billAmt":null,
			"querys.discountRate":null,
			"querys.latestAccountDateFrom":null,
			"querys.latestAccountDateTo":null,
			"querys.acceptBank":null,
			"querys.acceptBankType":null,
			"pageNo":null,
			"pageSize":null,
			"totalPage":null
		},//查询条件模块
		"detail":{
			"load":false,//开关，如果load为true，就调用该模块渲染方法
			"data":null,
			"render":function(metaData){
				$.each(this.data,function(key,val){
					var $obj = $("#"+key);
					$obj.text(Utils.numberFormat($obj,val));
				});
			}
		},//详细数据模块
		"invest":{
			"load":false,
			"data":null,
			"renderPie":function(metaData){
				// 基于准备好的dom，初始化echarts实例
				var pie1 = document.getElementById('tab1-pie1');
				var pie1Detail = $(pie1).next();
		        var myChart = echarts.init(pie1);
		        var legend = [],series = [];
				for(var prop in this.data.pie1){
					legend.push(prop);
					series.push({value:this.data.pie1[prop], name:prop});
					pie1Detail.append('<dl><dt>'+prop+'</dt><dd class="number" data-format-type="amount">'+this.data.pie1[prop]+'</dd><dd class="unit">元</dd></dl>');
				}
				Utils.numberFormat();
		        option = {
		        	title : {
		        		text:"可投票据概览（万）"
		        	},
				    tooltip: {
				        trigger: 'item',
				        formatter: "{a} <br/>{b}: {c} ({d}%)"
				    },
				    toolbox: {
				    	feature: {
				    		restore: {
								show: true,
								title: '还原'
							}
				    	}
				    },
				    legend: {
				        orient: 'vertical',
				        x: 'right',
				        y: 'bottom',
				        data:legend
				    },
				    series: [
				        {
				            name:'访问来源',
				            type:'pie',
				            radius: ['50%', '70%'],
				            avoidLabelOverlap: false,
				            label: {
				                normal: {
				                    show: false,
				                    position: 'center'
				                },
				                emphasis: {
				                    show: true,
				                    textStyle: {
				                        fontSize: '30',
				                        fontWeight: 'bold'
				                    }
				                }
				            },
				            labelLine: {
				                normal: {
				                    show: false
				                }
				            },
				            data:series
				        }
				    ]
				};
		        // 使用刚指定的配置项和数据显示图表。
		        myChart.setOption(option);
			},
			"renderLine":function(metaData,month,data){
				// 基于准备好的dom，初始化echarts实例
				var line = document.getElementById('tab1-line');
				$(line).show().prev().hide();
		        var myChart = echarts.init(line);
		        var axis = [],series = [];
				for(var prop in data){
					axis.push(prop);
					series.push({value:data[prop], name:prop});
				}
		        var option = {
				  title : {
				    text: month+"现金流量 （万）",
				    subtext: '日期/单位：（万）',
				  },
				    tooltip : {
				        trigger: 'item'
				    },
				    calculable : true,
				    xAxis : [
				        {
				            type : 'category',
				            boundaryGap : false,
				            data : axis
				        }
				    ],
				    yAxis : [
				        {
				            type : 'value',
				            axisLabel : {
				                formatter: '{value}'
				            }
				        }
				    ],
				    toolbox: {
        	        show : true,
        	        feature : {
        	            restore : {show: true},
        	        }
        	    },
				    series : [
				        {
				            name:'最低资金',
				            type:'line',
				            data:series
				        }
				    ]
				};
		        // 使用刚指定的配置项和数据显示图表。
		        myChart.setOption(option);
			},
			"renderBar":function(metaData){
				// 基于准备好的dom，初始化echarts实例
				var bar = document.getElementById('tab1-bar');
				var barDetail = $(bar).next().next();
		        var myChart = echarts.init(bar);
		        var _this = this;
		        myChart.on('click', function (params) {
		        	$.getJSON("/data/line.json",{month:params.name},function(data){
		        		_this.renderLine(metaData,params.name,data);
		        	});
				});
		  		var legend = [],series = [];
		  		for(var prop in this.data.bar){
					legend.push(prop);
					series.push({value:this.data.bar[prop], name:prop});
					barDetail.append('<dl><dt>'+prop+'</dt><dd class="number" data-format-type="amount">'+this.data.bar[prop]+'</dd><dd class="unit">元</dd></dl>');
				}
				Utils.numberFormat();
	            var option = {
	        	    title : {
	        	        text: "现金流量（万）",
	        	    },
	        	    tooltip : {
	        	        trigger: 'item'
	        	    },
	        	    toolbox: {
	        	        show : true,
	        	        feature : {
	        	            restore : {show: true},
	        	        }
	        	    },
	        	    calculable : false,
	        	    xAxis : [
	        	        {
	        	            type : 'category',
	        	            data : legend
	        	        }
	        	    ],
	        	    yAxis : [
	        	        {
	        	            type : 'value'
	        	        }
	        	    ],
	        	    series : [{
	    	            name:"现金流量",
	    	            type:'bar',
	    	            itemStyle: {
		                    normal: {
		　　　　　　　　　　　　　　//好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
		                        color: function(params) {
		                            // build a color map as your need.
		                            var colorList = ['#fbdf7f','#f3a43b','#60c0dd','#e2454e','#c6e579','#9bca63','#99ccff','#9966ff','#cc33cc','#ff7f50'];
		                            return colorList[params.dataIndex]
		                        }
		                    }
		                },
	    	            data:series
	    	        }]
	        	};
		        // 使用刚指定的配置项和数据显示图表。
		        myChart.setOption(option);
			},
			"beforeRender":function(){
				$("#tab1-pie1").next().empty();
				$("#tab1-line").next().empty();
			},
			"render":function(metaData){
				this.renderPie(metaData);
				this.renderBar(metaData);
			}
		},//当前可投模块
		"flow":{
			"load":false,
			"data":null,
			"render":function(metaData){
				console.log("flow===="+this);
			}
		},//当前现金模块
		"overview":{
			"load":false,
			"data":null,
			"render":function(metaData){
				console.log("overview===="+this);
			}
		},//已选票据模块
		"forecast":{
			"load":false,
			"data":null,
			"render":function(metaData){
				console.log("forecast===="+this);
			}
		},//投后现金模块
		"list":{
			"load":false,
			"data":null,
			"target":$("#billList tbody"),
			"lazy":$(".lazy-load"),
			"beforeRender":function(metaData){
				var data = this.data;
				metaData.querys.pageNo=data.pageNo;
				metaData.querys.pageSize=data.pageSize;
				metaData.querys.totalPage=data.totalPage;
				if(data.pageNo<data.totalPage){
					this.lazy.text("点击记载更多票据明细").prop("disabled",false);
				}else{
					this.lazy.text("已全部加载完毕").prop("disabled",true);
				}
				//show loading
			},
			"render":function(metaData){
				this.target.empty();
				this.data.result = this.data.result||[];
				var row,$row;
				(this.data.result.length == 0)&&this.lazy.hide();
				for(var i=0;i<this.data.result.length;i++){
					row = this.data.result[i];
					$row = $("<tr>"+
								        "<td><span data-stopPropagation class=\"ico inp-check\" id=\"r"+row.id+"\"></span><input type=\"checkbox\" style=\"display:none\" value=\""+row.id+"\"></td>"+
								        //"<td><a href=\"" + ROOT +  "/invest/billInfo?id=" + row.productInfoId + "\" target=\"_blank\">"+row.billNo+"</a></td>"+
								        "<td>"+row.billNo+"</td>" +
								        "<td>"+row.acceptBankName+"</td>"+
								        "<td><span data-format-type='rate'>"+row.discountRate+"</span>%</td>"+
								        "<td><span data-format-type='amount'>"+row.faceAmt+"</span>元</td>"+
								        "<td><span data-format-type='amount'>"+row.subscriptionAmt+"</span>元</td>"+
								        "<td>"+row.remainDeadline+"天</td>"+
								        "<td>"+new Date(row.accountDate).toLocaleDateString()+"</td>"+
									   "</tr>");
					$row.find("td:first span").data("meta",row);//*
					this.target.append($row);
				}
			},
			"afterRender":function(){
				//hide loading
				Utils.numberFormat();
			}
		}//列表数据模块);
	},__PROTOTYPE__);
})();