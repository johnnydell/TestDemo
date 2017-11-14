(function($){
	var drawEvent = new SdEvent();
	
	drawEvent.on('paint',function(me,property) {
		
		drawEvent.fire('draw',me,property);
		
		drawEvent.fire('init',me,property);
		
		drawEvent.fire('bindEvent',me,property);
	});
	drawEvent.on('toolbar',function(me,property){
		
		if(!$('.canvas-toolbar').size()) {
			var toolbar = document.createElement('div');
			toolbar.className='canvas-toolbar';
			
			var toolTitle = document.createElement('div');
			toolTitle.className='tool-title';
			toolTitle.innerHTML='画图工具箱';
			toolbar.appendChild(toolTitle);
			
			var tools = document.createElement('ul');
			
			if(sdutil.isArray(property.jsaps)){
				// 构建清空教师按钮
				populateToolMenu(tools,{
					name:'清空学科组成员',
					iconClass:'iconfont icon-icontupianchicun',
					title:'清空当前机房学科组成员安排',
					className:'emptyJsap'
				});
				
				// 构建批量添加教师按钮
				/*populateToolMenu(tools,{
					name:'批量添加',
					iconClass:'iconfont icon-icontupianchicun',
					title:'批量安排教师至机位',
					className:'batchJsap'
				});*/
				
			}else{
				// 构建画板设置按钮
				populateToolMenu(tools,{
					name:' 画布',
					iconClass:'iconfont icon-icontupianchicun',
					title:'调整画布大小',
					className:'resize'
				});
				
				// 构建清空画板按钮
				populateToolMenu(tools,{
					name:' 清空',
					iconClass:'iconfont icon-icontupianchicun',
					title:'清空当前画板',
					className:'empty'
				});
				
				// 构建讲台设置按钮
				populateToolMenu(tools,{
					name:' 讲台',
					iconClass:'iconfont icon-weibiaoti1',
					title:'设置讲台位置',
					className:'setJt'
				});
			
				// 构建机位设置按钮
				populateToolMenu(tools,{
					name:' 机位',
					iconClass:'iconfont icon-weibiaoti2',
					title:'设置机器位置',
					className:'setJw'
				});
			}
			
			
			
			toolbar.appendChild(tools);
			
			me[0].appendChild(toolbar);
		}
		
		function populateToolMenu(menuContainer,menu){
			var toolMenu = document.createElement('li');
			toolMenu.className=menu.className;
			toolMenu.title=menu.title;
			
			var toolIcon = document.createElement('span');
			toolIcon.className = menu.iconClass;
			toolMenu.appendChild(toolIcon);
			var toolLabel = document.createElement('span');
			toolLabel.className = 'label';
			toolLabel.innerHTML = menu.name;
			toolMenu.appendChild(toolLabel);
			
			menuContainer.appendChild(toolMenu);
		}
		
		var resizeWindow = document.createElement('div');
		resizeWindow.className='resize-window';
		
		var contents = '<div><input type="number" max="99" id="resize-row" class="sdui-input" style="width:35px;height:22px;line-height:22px;" value="'+property.rows+'" maxlength="2"> 行  &nbsp;x&nbsp; <input type="number" max="99" id="resize-col" class="sdui-input" style="width:35px;height:22px;line-height:22px;" value="'+property.cols+'" maxlength="2"> 列 </div>';
		var btns = '<div><a href="javascript:void(0)" class="sdui-btn  sdui-btn-hover-warm sdui-btn-mini resize-ok">确定</a><a href="javascript:void(0)" class="sdui-btn sdui-btn-hover-warm sdui-btn-mini resize-cancel">取消</a></div>';
		
		$(resizeWindow).append(contents);
		$(resizeWindow).append(btns);
		
		$(resizeWindow).hide();
		
		me[0].appendChild(resizeWindow);
		
		
		$('.canvas-toolbar').css({
			position:'absolute', 
			left: $(me).offset().left,
			"z-index": 500,
			top: $(me).offset().top 
		});
		
		$('.resize-window').css({
			position:'absolute', 
			left: $(me).offset().left,
			"z-index": new Date().getTime()+10,
			top: $(me).offset().top+$('.canvas-toolbar').height(),
			width:130
		});
		
		$('.canvas-toolbar li').click(function(){
			$(this).siblings().removeClass('active');
			$(this).addClass('active');
			var tmptoolbar=$(me).children('div.canvas-toolbar');
			
			if($(this).hasClass('resize')) {
				$(me).data('action','resize');
				
				$(resizeWindow).slideDown(function(){
					var top = Math.min(tmptoolbar.position().top,$(me).position().top+10+$(me).height()-tmptoolbar.height()-$('.resize-window').height()-40);
					
					drawEvent.fire('initToolbarPosition',me,property,tmptoolbar.position().left,top);
				});
			}else if($(this).hasClass('setJt')) {
				$(me).data('action','setJt');
			}else if($(this).hasClass('setJw')) {
				$(me).data('action','setJw');
			}else if($(this).hasClass('empty')){
				$(me).data('action','empty');
				
				confirm('确定要清空当前画板吗？',function(){
					property.seats = [];
					drawEvent.fire('paint',me,property);
				});
			}else if($(this).hasClass('emptyJsap')) {
				$(me).data('action','emptyJsap');
				confirm('确定要清空当前已安排的学科组成员吗？',function(){
					property.jsaps = [];
					drawEvent.fire('paint',me,property);
					sdutil.isFunction(property.deleteFunc)&&property.deleteFunc.call('',property.jsaps);
				});
			}else if($(this).hasClass('batchJsap')) {
				$(me).data('action','batchJsap');
				
				// 设置批量安排图标之类...
				
			}
		});
		
		
		$('.resize-window .resize-cancel').click(function(){
			$(resizeWindow).slideUp();
		});
		
		$('.resize-window .resize-ok').click(function(){
			
			property.rows=Math.max($('#resize-row').val(),property.maxrow);
			property.cols=Math.max($('#resize-col').val(),property.maxcol);
			//$(me).data('toolbarposition',''); // 手动调整画布大小，清空当前工具箱位置
			if($('#resize-row').val()<property.maxrow || $('#resize-col').val()<property.maxcol) {
				message("画布已调整为最佳！");
			}
			drawEvent.fire('paint',me,property);
		});
		
		// 设置当前工具样式
		$('.canvas-toolbar li').removeClass('active');
		$('.canvas-toolbar li.'+$(me).data('action')).addClass('active');
		
	});
	
	drawEvent.on('initToolbarPosition',function(me,property,left,top){
		var tmptoolbar=$(me).children('div.canvas-toolbar');
		tmptoolbar.css({
				left:left+'px',
				top:top+'px'
			});
			
		$(me).data('toolbarposition',{left:left,top:top});
			
		$('.resize-window').css({
			left:left+'px',
			top:top+tmptoolbar.height()
		});
		
	});
	
	
	drawEvent.on('draw',function(me,property){
		if(!property.rows && !property.cols) {
			message('初始化座位失败，请确认座位行列');
			return;
		}
		var seatWidth=80+10+2,seatHeight=70+10+2;
		
		$(me).empty() && $(me).removeClass('jf-canvas').addClass('jf-canvas');
		
		var top = document.createElement('div');
		top.className='top';
		var title = document.createElement('div');
		title.className = 'title';
		title.title = property.title;
		title.innerHTML = property.title;
		var smallTitle = document.createElement('div');
		smallTitle.className = 'small-title';
		smallTitle.innerHTML = property.smallTitle;
		
		top.appendChild(title);
		top.appendChild(smallTitle);
		me[0].appendChild(top);
		
		for(var row=1;row<=property.rows;row++) {
			var rowcontainer = document.createElement('div');
			rowcontainer.className = 'jf-seats';
			
			for(var col=1;col<=property.cols;col++) {
			
				var seat = document.createElement('div');
				seat.className = 'seat';
				if(property.isEditable){
					seat.className = 'seat seat-edit';
				}
				
				seat['setAttribute']('position',row+','+col);
				
				var seatMark = document.createElement('div');
				seatMark.className = 'icon iconfont';
				
				seat.appendChild(seatMark);
				
				var computer = document.createElement('div');
				computer.className='name';
				
				var seq = document.createElement('div');
				seq.className = 'seq';
				
				seat.appendChild(seq);
				seat.appendChild(computer);
				
				
				rowcontainer.appendChild(seat);
			}
			
			me[0].appendChild(rowcontainer);
		}
		
//		$(me).css({'width':property.cols*seatWidth+5+'px','height':property.rows*(seatHeight)+$(me).children('.top').height()+5+'px'})
		$(me).css({'width':property.cols*seatWidth+5+'px'});
		
		
		property.isEditable && drawEvent.fire('toolbar',me,property);
	});
	
	drawEvent.on('init',function(me,property){
		var seats=property.seats,jsaps=property.jsaps;
		
		$(me).find('div.seat').removeClass('seat-selected');
		
		if(sdutil.isArray(seats)) {
			property.maxrow=0;property.maxcol=0;
			for(var i=0;i<seats.length;i++) {
				var rc = seats[i].jwzb.split(',');
				property.maxrow = Math.max(rc[0],property.maxrow);
				property.maxcol = Math.max(rc[1],property.maxcol);
				
				$(me).find('div[position="'+seats[i].jwzb+'"]').find('.seq').text(seats[i].jwbh);
				$(me).find('div[position="'+seats[i].jwzb+'"]').attr('jwbh',seats[i].jwbh);
				$(me).find('div[position="'+seats[i].jwzb+'"]').attr('jwtype',seats[i].jwlx);
				
				// 设置机位或讲台图标
				if(seats[i].jwlx=='1') {
					$(me).find('div[position="'+seats[i].jwzb+'"]').find('div.icon').removeClass('icon-weibiaoti1').addClass('icon-weibiaoti2');
				} else if(seats[i].jwlx=='0'){
					$(me).find('div[position="'+seats[i].jwzb+'"]').find('div.icon').removeClass('icon-weibiaoti2').addClass('icon-weibiaoti1');
				}
				
				$(me).find('div[position="'+seats[i].jwzb+'"]').addClass('seat-selected');
				$(me).find('div[position="'+seats[i].jwzb+'"]').children().show();
				
				var deleteIcon = '<i class="iconfont icon-btn icon-shanchu delete" style="color:red;" title="删除"></i>';
				$(me).find('div[position="'+seats[i].jwzb+'"]').append(deleteIcon);
				
				var addIcon = '<i class="iconfont icon-btn icon-llalbumshopselectorcreate add" style="color:green;" title="添加"></i>';
				$(me).find('div[position="'+seats[i].jwzb+'"]').append(addIcon);
			}
		}
		
		if(sdutil.isArray(jsaps)) {
			for(var i=0;i<jsaps.length;i++) {
				$(me).find('div[jwbh="'+jsaps[i].jwh+'"]').find('.name').text(jsaps[i].jsmc);
				$(me).find('div[jwbh="'+jsaps[i].jwh+'"]').attr('js-index',i);
				
				// 给机位添加颜色
				$(me).find('div[jwbh="'+jsaps[i].jwh+'"]').find('.icon').css('color',jsaps[i].ys);
			}
		}
		
		sdutil.isFunction(property.seatsCallback) && property.seatsCallback.call(this, seats,{rows:property.rows,cols:property.cols});
		
		sdutil.isFunction(property.jsapCallback) && property.jsapCallback.call(this, jsaps);
		
	});
	
	drawEvent.on('bindEvent',function(me,property){
		
		// 绑定选择事件，需要监控mousedown，mousemove, mouseup
		drawEvent.fire('bindMultiSelectionEvent',me,property);
		
		
		$(me).find('div.seat-edit').hover(function(){
			var jsindex=$(this).attr('js-index');
			
			if(sdutil.isArray(property.jsaps)) {
				if(jsindex) {
					$(this).find('i.delete').show();
				}else{
					if($(this).attr('jwtype')=='1'){
						$(this).find('i.add').show();
					}
				}
			}else{
				$(this).find('i.delete').show();
			}
			
		},function(){
			var jsindex=$(this).attr('js-index');
			if(sdutil.isArray(property.jsaps)) {
				if(jsindex) {
					$(this).find('i.delete').hide();
				}else{
					$(this).find('i.add').hide();
				}
			}else{
				$(this).find('i.delete').hide();
			}
		});
		
		$(me).find('.delete').click(function(e){
			
			var c_seat = $(this).parents('div.seat'),jsindex=c_seat.attr('js-index');
			
			if(sdutil.isArray(property.jsaps)) {
				if(jsindex) {
					confirm('确定要删除当前机位的学科组成员吗？',function(){
						property.jsaps.del(jsindex);
						drawEvent.fire('paint',me,property);
						sdutil.isFunction(property.deleteFunc)&&property.deleteFunc.call('',property.jsaps);
					});
				}
			}else{
				if(c_seat.attr('jwtype')=='1') {
					confirm('删除当前机位，后续机位编号会自动重新分配，确定删除当前机位吗？',function(){
						drawEvent.fire('removeSeat',me,property,c_seat);
					});
				}else{
					drawEvent.fire('removeSeat',me,property,c_seat);
				}
			}
			
			e.stopPropagation();
		});
		
		$(me).find('.add').click(function(e){
			
			var c_seat = $(this).parents('div.seat'),jwindex=c_seat.attr('jwbh');
			
			sdutil.isFunction(property.addUser) && property.addUser.call(this,jwindex);
			
			e.stopPropagation();
		});
	});
	
	drawEvent.on('selectSeat',function(me,property,seat){
		if($(seat).hasClass('seat')) {
			
			settingSeat(me,property,seat);
				
			drawEvent.fire('paint',me,property);
		}
		
	});
	
	drawEvent.on('removeSeat',function(me,property,seat){
		
		var jwbh=$(seat).attr('jwbh'),position=$(seat).attr('position'),jwtype=$(seat).attr('jwtype'),seats=property.seats;
		
		var pendingRemoveIndex=-1;
		
		for(var i=0; i<seats.length; i++) {
			if(seats[i].jwzb==position) {
				pendingRemoveIndex = i;
				break;
			}
		}
		
		if(jwtype=='1') {
			for(var i=0; i<seats.length; i++) {
				if(seats[i].jwlx=='1'&&seats[i].jwbh>jwbh) {
					seats[i].jwbh = seats[i].jwbh-1;
				}
			}
		}
		
		
		seats.del(pendingRemoveIndex);
		
		drawEvent.fire('paint',me,property);
	});
	
	drawEvent.on('renderSelectSeat',function(me,property){
		var selectedSeats=property.selectedSeats;
		
		$('div.seat').removeClass('seat-selected');
		
		if(sdutil.isArray(selectedSeats)) {
			for(var i=0;i<selectedSeats.length;i++) {
				if(selectedSeats[i].jwh) {
					$(me).find('div[jwbh="'+selectedSeats[i].jwh+'"]').addClass('seat-selected');
				}
			}
		}
	});
	
	drawEvent.on('unSelectSeat',function(me,property,seat){
		if($(seat).hasClass('seat')) {
			if($(seat).attr('jwbh') && !$(seat).attr('js-index')){
				var jsap = {};
				jsap.jwh = $(seat).attr('jwbh');
				property.selectedSeats.remove(jsap);
				drawEvent.fire('renderSelectSeat',me,property);
			}
		}
	});
	
	drawEvent.on('bindMultiSelectionEvent',function(me,property){
		
		// 由于 工具条的移动与选择作为移动需要监控全局document的鼠标事件，故需将两个写在一起
		var startX,startY,toolmousedown=false,left,top,tmptoolbar=$(me).children('div.canvas-toolbar');
		var deamonTool = document.createElement('div');
		deamonTool.className='deamonTool';
		$(me).find('div.tool-title').mousedown(function(event){
			
			var event = window.event||event;
			toolmousedown=true;
			startX = (event.clientX);
			startY = (event.clientY);
			
			$(deamonTool).css({
				width:tmptoolbar.width()+'px',
				height:tmptoolbar.height()+'px'
			});
			
			me[0].appendChild(deamonTool);
			
			$(deamonTool).css({
				left:tmptoolbar.position().left+'px',
				top:tmptoolbar.position().top+'px'
			});
			
			return false;
		});
		
		document.onmousemove = function(event){
			var event = window.event||event,startX2 = (event.clientX),startY2 = (event.clientY);
			if(toolmousedown) {
				var event = window.event||event,startX2 = (event.clientX),startY2 = (event.clientY);
				left = Math.max(tmptoolbar.position().left+(startX2-startX),$(me).position().left+10);
				left = Math.min(left,$(me).position().left+10+$(me).width()-tmptoolbar.width());
				
				top = Math.max(tmptoolbar.position().top+(startY2-startY),$(me).position().top+10);
				top = Math.min(top,$(me).position().top+10+$(me).height()-tmptoolbar.height());
				
				$(deamonTool).css({
					left:left+'px',
					top:top+'px'
				});
			}
			
			return false;
 		}
 		
		
		$(me).find('div.tool-title').mouseup(function(){
			mousedown = false;
 		});
		
		if($(me).data('toolbarposition')){
			drawEvent.fire('initToolbarPosition',me,property,$(me).data('toolbarposition').left,$(me).data('toolbarposition').top);
		}
		
		
		$(me).find('.selectionarea').remove();
		
		var selectionarea = document.createElement('div'),origLeft=0,origTop=0;
		selectionarea.className = 'selectionarea';
		selectionarea.style.zIndex = new Date().getTime();
		me[0].appendChild(selectionarea);
		
		if(!property.isTextSelectable) document.onselectstart = function () { return false; }
		
		var onseatmousedown=false,onseatmouseup=false,tmpSelectSeats=[];
		
		$(me).find('div.seat').mousedown(function(){
			if(property.isEditable){
				
				onseatmousedown=true;
				
				if(!$(this).attr('jwbh') && tmpSelectSeats.indexOf(this)==-1) {
					tmpSelectSeats.push(this);
				}else{
					tmpSelectSeats.remove(this);
				}
				
				
				$(me).find('*.seat-edit').removeClass('seat-selecting');
				$(this).addClass('seat-selecting');
			}
			return false;
		});
		
		$(me).find('div.seat').mousemove(function(){
			if(property.isEditable){
				if(onseatmousedown) {
					if(!$(this).attr('jwbh') && tmpSelectSeats.indexOf(this)==-1) {
						tmpSelectSeats.push(this);
						$(this).addClass('seat-selecting');
					}
				}
			}
			return false;
 		});
 		
		document.onmouseup = function(event){
			onseatmousedown = false;
			onseatmouseup=false;
			tmpSelectSeats=[];
			$(me).find('*').removeClass('seat-selecting');
			
			if(toolmousedown) {
				var event = window.event||event,startX2 = (event.clientX),startY2 = (event.clientY);
				left = Math.max(tmptoolbar.position().left+(startX2-startX),$(me).position().left+10);
				left = Math.min(left,$(me).position().left+10+$(me).width()-tmptoolbar.width());
				
				top = Math.max(tmptoolbar.position().top+(startY2-startY),$(me).position().top+10);
				
				if($('.resize-window').is(':visible')){
					top = Math.min(top,$(me).position().top+10+$(me).height()-tmptoolbar.height()-$('.resize-window').height()-40);
				}else{
					top = Math.min(top,$(me).position().top+10+$(me).height()-tmptoolbar.height());
				}
				
				drawEvent.fire('initToolbarPosition',me,property,left,top);
			}
			toolmousedown=false;
			$('div.deamonTool').remove();
			
			return false;
		}
		
		$(me).find('div.seat').mouseup(function(event){
			if(property.isEditable){
				onseatmouseup = true;
	 			
	 			for(var i=0;i<tmpSelectSeats.length;i++) {
	 				settingSeat(me,property,tmpSelectSeats[i]);
	 			}
	 			
	 			tmpSelectSeats.length && drawEvent.fire('paint',me,property);
	 			
	 			
	 			$(me).find('*').removeClass('seat-selecting');
			}
			
			return false;
 		});
		
		function settingSeat(me,property,seat){
			var action,seats=property.seats;
			if(action = $(me).data('action')){
				
				switch(action){
					case 'setJt':
						
						for(var i=0;i<property.seats.length;i++) {
							if(property.seats[i].jwlx=='0') {
								message('讲台只能设置一个！');
								return;
							}
						}
						
						var jw={}
						jw.jwlx='0';
						jw.jwbh='讲台';
						jw.jwzb=$(seat).attr('position');
						
						seats.push(jw);
						
						break;
					case 'setJw':
						
						if(!$(seat).attr('jwbh')) {
							var jw={}
							jw.jwlx='1';
							
							jw.jwbh=$(me).find('div.seat[jwtype="0"]').size() ? seats.length : seats.length+1;
							jw.jwzb=$(seat).attr('position');
							
							seats.push(jw);
						}
						break;
				}
				
			}
		}
		
	});
	
	
	$.fn.jwCanvas = function(opts) {
		var me=this;
		
		var defaults={
				rows:10,
				cols:10,
				seats:[],
				jsaps:null,
				isEditable:false, // 机位画板 是否可编辑，true：可编辑，false：不可编辑
				isTextSelectable:false, // 画板中文字是否可选择，默认不可选择
				click:function(seat){
					
				},
				seatsCallback:function(seats,cvs) {
					
				},
				jsapCallback:function(jsaps) {
					// console.log(jsaps);
				},
				addUser: function(jw){
					
				}
		}
		// 已选择的座位
		defaults.selectedSeats = [];
		
		var property = $.extend(true,{},defaults, opts);
		
		drawEvent.fire('paint',me,property);
	}
	
	
})(jQuery);