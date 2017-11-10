/**
 * Created by Administrator on 2017/10/27.
 */

//弹框
$(function () {
    $(".close1").click(function () {
        $(".popup").hide();
    });
    $(".openPopup").click(function () {
        $(".popup").show();
    });

    //保存操作
    $(".saveBtn").click(function () {
        $(".searchBox input").prop("disabled", true);
        $(".searchBox select").prop("disabled", true);
        $(".sdui-text-danger").hide();
        $(".editBtn,.wrapper").show();
        $(".saveBtn").hide();
        $(".addAge").css("visibility", "hidden");
    });

    //修改操作
    $(".editBtn").click(function () {
        $(".searchBox input").prop("disabled", false);
        $(".searchBox select").prop("disabled", false);
        $(".sdui-text-danger").show();
        $(".saveBtn").show();
        $(".addAge").css("visibility", "inherit");
        $(".editBtn").hide();
    });

    $("#chooseDu").change(function () {
        var chooseVal = $(this).val();

        if (chooseVal == "1") {
            $(".monthCH").show();
            $(".quarterCH").hide();
        } else if (chooseVal == "2") {
            $(".monthCH").hide();
            $(".quarterCH").show();
        } else {
            $(".monthCH").hide();
            $(".quarterCH").hide();
        }
    })
});

//展开显示隐藏
var flag = true
$(function () {
    $(".click-show").click(function () {
        if (flag) {
            $(".kpr").css('height', 'auto') && $(this).html('<i class="iconfont sd-arrowUp sdui-txt-blue" title="收起"></i>');
            flag = !flag
        } else {
            $(".kpr").css('height', '40px') && $(this).html('<i class="iconfont sd-arrowDown sdui-txt-blue" title="展开"></i>');
            flag = !flag
        }
    })
});

/*添加通讯录人员*/
$(".addPersonnel").click(function () {
    $(".popuptxl").show();
    $.get("../../partials/txl.html", function (data) {
        var ractive = new Ractive({
            el: ".popuptxl",
            template: data,
            oncomplete: function () {

            }
        });
        ractive.on("close", function () {
            $(".popuptxl").hide().html("");
        });
    });
});
