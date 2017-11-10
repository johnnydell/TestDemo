$(function () {
    $.get('/gnnt/html/global/partials/header.html', function (data) {
        var ractive = new Ractive({
            el: "#Layout",
            template: data,
            oncomplete: function () {
                var pathArr = location.pathname.split('/');
                var navUl = pathArr[2];
                var navLi = pathArr[4];
                ractive.set(navUl, 'block');
                ractive.set(navLi, 'on');

                $(".sd-nav .sd-nav-item>a").click(function () {
                    $(this).addClass('current')   //给当前元素添加"current"样式
                        .find('i').addClass('down')   //小箭头向下样式
                        .parent().next().slideDown('slow')  //下一个元素显示
                        .parent().siblings().children('a').removeClass('current')//父元素的兄弟元素的子元素去除"current"样式
                        .find('i').removeClass('down').parent().next().slideUp('slow');//隐藏
                    return false;
                });
            }
        });
    });
});
