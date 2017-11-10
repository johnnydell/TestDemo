/**
 * Created by Administrator on 2017/11/1.
 */
function saveBtn() {
    var qj = $("#qujian").val();
    var bxsq = [{"id": '0', "name": ""}], num = 0;
console.log(qj)
    if (qj == "1"){
        $.get("../../partials/informationHave.html", function (data) {
            var ractive1 = new Ractive({
                el: "#addqujian1",
                template: data,
                oncomplete: function () {
                    $(".yincang").hide();
                    ractive1.set("bxsq", bxsq);
                }
            });

            ractive1.on("addBXList", function () {
                num++;
                bxsq.push({"id": num, "name": ""})
                ractive1.set("bxsq", bxsq);
                $(UE.getEditor('editor' + num));
            });

            ractive1.on("delCCList", function (e) {
                bxsq.splice(e.node.dataset.id, 1);
                ractive1.set("bxsq", bxsq);
            });

        });

    }else{
        $.get("../../partials/information.html", function (data) {
            var ractive2 = new Ractive({
                el: "#addqujian1",
                template: data,
                oncomplete: function () {
                    $(".yincang").hide();
                    ractive2.set("bxsq", bxsq);
                }
            });

            ractive2.on("addBXList", function () {
                num++;
                bxsq.push({"id": num, "name": ""})
                ractive2.set("bxsq", bxsq);
                $(UE.getEditor('editor' + num));
            });

            ractive2.on("delCCList", function (e) {
                bxsq.splice(e.node.dataset.id, 1);
                ractive2.set("bxsq", bxsq);
            });
        });
    }

};
$('#modifyBtn').click(function(){
    $('.editBox').show() && $('.viewBox').hide();
})
$('#saveBtn').click(function(){
    $('.editBox').hide() && $('.viewBox').show();
});

"use strict";

$(".icon-delete").on("click", function () {
    $(this).parent().hide();
});

//添加指标项
$.get("../../partials/informationHave.html", function (data) {
    var bxsq = [{"id": '0', "name": ""}], num = 0;

    var ractive = new Ractive({
        el: "#bxlist",
        template: data,
        oncomplete: function () {
            ractive.set("bxsq", bxsq);
            $(UE.getEditor('editor0'));
        }
    });

    ractive.on("addBXList", function () {
        num++;
        bxsq.push({"id": num, "name": ""})
        ractive.set("bxsq", bxsq);
        $(UE.getEditor('editor' + num));
    });

    ractive.on("delCCList", function (e) {
        bxsq.splice(e.node.dataset.id, 1);
        ractive.set("bxsq", bxsq);
    });
});