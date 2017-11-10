/**
 * Created by lupn on 2017/11/1.
 */
$(function () {
    var typeList = [{id: 1, name: "开发人员考评"},
        {id: 2, name: "前端人员考评"},
        {id: 3, name: "ui人员考评"},
        {id: 4, name: "销售人员考评"},
        {id: 5, name: "管理人员考评"},
        {id: 6, name: "财务人员考评"},
        {id: 7, name: "行政人员考评"},
        {id: 8, name: "人事人员考评"}], i = 9;

    $.get('../../partials/typeTable.html', function (data) {
        var ractive = new Ractive({
            el: ".sdoa-form",
            template: data,
            oncomplete: function () {
                ractive.set("typeList", typeList)
            }
        });

        //添加考评类型
        ractive.on("addType", function (e) {
            i++;
            typeList.unshift({id: i, name: "", ifNew: true})
        });

        //保存考评类型
        ractive.on("saveType", function (e, key) {
            typeList[key].ifNew = false;
            ractive.set("typeList", typeList);
        });

        //修改考评类型
        ractive.on("editType", function (e, key) {
            typeList[key].ifNew = true;
            ractive.set("typeList", typeList)
        });
    })
});