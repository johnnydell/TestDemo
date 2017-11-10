"use strict";
/**
 *
 * 自定义tab组件，用于渲染tab页面显示
 *
 */
(function($) {
    var click_event = 'click';
    var enter_event = 'mouseenter';

    $.fn.Tab = function(opts) {
        var _this = this;
        var isInit = false;	// 表示是否初始化
        var callbackXHistory = []; // 此数组用于防止执行历史，表明对应回调是否已经执行过

        var defaults = {
            type:1, // 1：点击切换，2：滑过切换，3：自动切换
            duration:200, // duration只有在type=2/type=3时有效，其他情况无需设置
            tabMenuClass:'tab-menu',	// tab菜单默认的样式
            tabMenuActiveClass:'active',	// tab当前菜单默认样式
            tabContentClass:'tab-content',	// tab内容默认样式
            callbacks:[],	// 回调函数数组，对应每个tab显示时的回调函数，数组顺序与tab顺序一致
            callOnce:true	// 回调函数是否调用1次， 如果每次展示时都触发，则将此项置为false
        }

        var opts = $.extend(true,{},defaults, opts);

        // 初始化tab显示
        initTabShow();

        var menu_event = click_event;

        switch(opts.type) {
            case 1:
                menu_event = click_event;
                break;
            case 2:
                menu_event = enter_event;
                break;
            case 3:
                break;
        }

        if(opts.type == 3) { //自动播放

            var intertime = setInterval(autoSwitchTab,opts.duration);

            $(_this).hover(function(){
                clearInterval(intertime);
            },function(){
                intertime = setInterval(autoSwitchTab,opts.duration);
            });

        }else{ // 其他类型的切换方式
            $(_this).find('.'+opts.tabMenuClass).children().bind(menu_event,function(e){
                // tab菜单点击，切换菜单样式
                if (menu_event == click_event) {
                    switchTab($(this));
                } else if (menu_event == enter_event){
                    var hoverTime = setTimeout(switchTabWrap($(this)),opts.duration);

                    $(this).mouseout(function(){
                        clearTimeout(hoverTime);
                    });
                }
            });
        }

        /**
         * 初始化tab的显示
         */
        function initTabShow(){

            var currentMenu = null;

            if($(_this).find('.'+opts.tabMenuClass).children('.'+opts.tabMenuActiveClass).length==0){
                currentMenu = $(_this).find('.'+opts.tabMenuClass).children().eq(0);

            }else{
                currentMenu = $(_this).find('.'+opts.tabMenuClass).children('.'+opts.tabMenuActiveClass).eq(0);
            }

            isInit = true;

            switchTab(currentMenu);
        }

        /**
         * 自动切换tab菜单
         */
        function autoSwitchTab() {

            // 切换菜单
            var currentActiveMenu = $(_this).find('.'+opts.tabMenuClass).children('.'+opts.tabMenuActiveClass);
            var toShowMenu = currentActiveMenu.next();

            if(toShowMenu.length==0) {
                toShowMenu = $(_this).find('.'+opts.tabMenuClass).children().first();
            }

            // 切换content
            switchTab(toShowMenu);
        }


        /**
         * 此包装函数，用于setTimeout调用
         */
        function switchTabWrap(currentMenu) {

            return function(){
                switchTab(currentMenu);
            }
        }

        /**
         *  切换tab
         */
        function switchTab(currentMenu) {
            // 如果切换的选项还是当前的激活选项，则不应该做任何操作

            if(!currentMenu.hasClass('disabled')) {
                if($(_this).find('.'+opts.tabMenuClass).children('.'+opts.tabMenuActiveClass).index() != currentMenu.index() || isInit == true) {

                    isInit = false;

                    currentMenu.siblings().removeClass(opts.tabMenuActiveClass);
                    currentMenu.addClass(opts.tabMenuActiveClass);


                    currentMenu.parent().parent().find('.'+opts.tabContentClass).eq(0).children().hide();
                    currentMenu.parent().parent().find('.'+opts.tabContentClass).children().eq(currentMenu.index()).show();



                    // 执行各自回调函数
                    if($.isFunction(opts.callbacks[currentMenu.index()])) {

                        if(opts.callOnce != true || callbackXHistory[currentMenu.index()] != true) {
                            opts.callbacks[currentMenu.index()].call();		// 调用对应tab回调函数
                            callbackXHistory[currentMenu.index()] = true;	// 标记回调函数执行历史
                        }

                    }

                }
            }
        }
    }
})(jQuery)
