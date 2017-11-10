/**
 * 目前的弹出层相关UI显示，都是基于layer前端插件；
 * 此封装的意义在于：对调用者透明化依赖的具体插件，同时也便于后期进行扩展或替换第三方依赖，不影响界面的调用
 *
 * @param $ jQuery选择器
 *
 * @author 	Tony.Wang
 * @date	2016/10/18
 */
(function($) {

	// 确认框
	alert = function(content,name) {

		layer.alert(content, {icon: 0});
	}

	// 成功提示框
	success = function(content) {
		layer.alert(content, {icon: 1});
	}

	// 错误提示框
	error = function(content) {
		layer.alert(content, {icon: 2});
	}

	// 确认框
	confirm = function(content, successCallback, cannelCallback) {
		layer.confirm(content, {
			  btn: ['确认','取消'] //按钮
			}, function(){
				if(typeof(successCallback) == 'function') {
					successCallback.call();
				}
//				 layer.msg('以解除绑定', {icon: 1});
			}, function(){

				if(typeof(cannelCallback) == 'function') {
					cannelCallback.call();
				}

//			  layer.msg('也可以这样', {
//			    time: 20000, //20s后自动关闭
//			    btn: ['明白了', '知道了']
//			  });
			});
	}

	// 信息提示框
	message = function(content) {
		layer.msg(content);
	}

	// 提示
	tip = function(content,id,opts) {

		if(opts) {
			layer.tips(content, '#'+id, opts);
		}else{
			layer.tips(content, '#'+id);
		}

	}

	// 对话框，用于打开新的弹出页面，为了代码可维护性，目前都采用新页面加载
	dialog = function(opts) {

		var defaults = {
				content:'',
				title:'',
				type:2,
				width:'800px',
				height:'90%',
				shadeClose:true,
				scroll:true
		}


		var opts = $.extend(true,{},defaults, opts);

		var scroll = 'yes';
		if(opts.scroll == false) {
			scroll = 'no';
		}

		layer.open({
			  type: opts.type,
			  title: opts.title,
			  shadeClose: opts.shadeClose,
			  shade: 0.3,
			  area: [opts.width, opts.height],
			  content: [opts.content,scroll]
			});
	}

	// 关闭父弹出层
	closeParent = function() {
		var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
		parent.layer.close(index);
	}

	closeAll = function(){
		layer.closeAll();
	}

})(jQuery);