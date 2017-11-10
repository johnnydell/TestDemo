$(function () {
    var typeList = [{id: 1, name: "需求"},
        {id: 2, name: "设计"},
        {id: 3, name: "人事"},
        {id: 4, name: "行政"},
        {id: 5, name: "财务"},
        {id: 6, name: "后台开发"},
        {id: 7, name: "前端"},
        {id: 8, name: "ui"}], i = 9;

    $.get('../../partials/dutyTable.html', function (data) {
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