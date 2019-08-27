$.views.settings.allowCode(true);
$.views.converters("getResponseModelName", function (val) {
  return getResponseModelName(val);
});

var tempBody = $.templates('#temp_body');
var tempBodyResponseModel = $.templates('#temp_body_response_model');

//获取context path
var contextPath = getContextPath();

function getContextPath() {
  var pathName = document.location.pathname;
  var index = pathName.substr(1).indexOf("/");
  var result = pathName.substr(0, index + 1);
  return result;
}

$(function () {
  $.ajax({
    url: "v2/api-docs",
// 	        url : "http://petstore.swagger.io/v2/swagger.json",


        dataType : "json",
        type : "get",
        async : false,
        success : function(data) {
            //layui init
            layui.use([ 'layer','jquery', 'element' ], function() {
	            var $ = layui.jquery, layer = layui.layer, element = layui.element;
	        });
            var jsonData = eval(data);
            var colId = "name"
            var asc = function(x,y)
            {
                return (x[colId] > y[colId]) ? 1 : -1
            }
            jsonData.tags.sort(asc)
            $("#title").html(jsonData.info.title);
            $("body").html($("#template").render(jsonData));
            
            $("[name='a_path']").click(function(){
	            var path = $(this).attr("path");
	            var method = $(this).attr("method");
	            var operationId = $(this).attr("operationId");
	            $.each(jsonData.paths[path],function(i,d){
	              if(d.operationId == operationId){

                      d.path = path;
                      d.method = method;
                      //组装成单个参数集合的模型
                      var tempObjArr=[];
                      if(d.parameters !=null) {
                        $.each(d.parameters, function (index, item) {
                          if (typeof (item.schema) != 'undefined'
                              && typeof (item.schema.$ref) != 'undefined') {
                            if (item['schema']['$ref'].indexOf("#/def") > -1) { //代表为对象形式
                              var modelName = getResponseModelName(
                                  item['schema']["$ref"]);
                              requestParames = jsonData.definitions[modelName].properties;
                              requiredArr = jsonData.definitions[modelName].required;
                              for (param in requestParames) {
                                var tempObj = {};
                                tempObj.name = param;
                                if ($.inArray(param, requiredArr) >= 0) { //判断是否必须的参数
                                  tempObj.required = true
                                }
                                tempObj.description = requestParames[param].description
                                tempObj.type = requestParames[param].type
                                tempObjArr.push(tempObj);
                              }

                            }
                          }

                        })
                      }
                      if(tempObjArr.length>0){
                          d.parameters=tempObjArr;
                      }

      $("[name='a_path']").click(function () {
        var path = $(this).attr("path");
        var method = $(this).attr("method");
        var operationId = $(this).attr("operationId");
        $.each(jsonData.paths[path], function (i, d) {
          if (d.operationId == operationId) {

            d.path = path;
            d.method = method;
            //组装成单个参数集合的模型
            var tempObjArr = [];
            if (d.parameters != null) {
              $.each(d.parameters, function (index, item) {
                if (typeof (item.schema) != 'undefined'
                    && typeof (item.schema.$ref) != 'undefined') {
                  if (item['schema']['$ref'].indexOf("#/def") > -1) { //代表为对象形式
                    var modelName = getResponseModelName(
                        item['schema']["$ref"]);
                    requestParames = jsonData.definitions[modelName].properties;
                    requiredArr = jsonData.definitions[modelName].required;
                    for (param in requestParames) {
                      var tempObj = {};
                      tempObj.name = param;
                      if ($.inArray(param, requiredArr) >= 0) { //判断是否必须的参数
                        tempObj.required = true
                      }
                      tempObj.description = requestParames[param].description
                      tempObj.type = requestParames[param].type
                      tempObjArr.push(tempObj);
                    }

                  }
                }

              })
            }
            if (tempObjArr.length > 0) {
              d.parameters = tempObjArr;
            }

            $("#path-body").html(tempBody.render(d));
            var modelName = getResponseModelName(
                d.responses["200"]["schema"]["$ref"]);
            var childDataHtml = "";
            if (modelName) {
              if (typeof (jsonData.definitions[modelName].properties.data.$ref)
                  != 'undefined') {
                //某个参数有子对象
                var objName = getResponseModelName(
                    jsonData.definitions[modelName].properties.data.$ref)
                var obj = jsonData.definitions[objName];
                childDataHtml = tempBodyResponseModel.render(obj);
                jsonData.definitions[modelName].properties.data.type = "子对象"
              }

              $("#path-body-response-model").html(tempBodyResponseModel.render(
                  jsonData.definitions[modelName]));
              $("#path-child-body-response-model").html(childDataHtml);

            }
          }
        });
      });

      //提交测试按钮
      $("[name='btn_submit']").click(function () {
        var operationId = $(this).attr("operationId");
        var parameterJson = {};
        $("input[operationId='" + operationId + "']").each(
            function (index, domEle) {
              var k = $(domEle).attr("name");
              var v = $(domEle).val();
              parameterJson.push({k: v});
            });
      });
    }
  });

});

function getResponseModelName(val) {
  if (!val) {
    return null;
  }
  return val.substring(val.lastIndexOf("/") + 1, val.length);
}

//测试按钮，获取数据
function getData(operationId) {
  var path = contextPath + $("[m_operationId='" + operationId + "']").attr(
      "path");
  //path 参数
  $("[p_operationId='" + operationId + "'][in='path']").each(
      function (index, domEle) {
        var k = $(domEle).attr("name");
        var v = $(domEle).val();
        if (v) {
          path = path.replace("{" + k + "}", v);
        }
      });

  //header参数
  var headerJson = {};
  $("[p_operationId='" + operationId + "'][in='header']").each(
      function (index, domEle) {
        var k = $(domEle).attr("name");
        var v = $(domEle).val();
        if (v) {
          headerJson[k] = v;
        }
      });

  //请求方式
  var parameterType = $("#content_type_" + operationId).val();

  //query 参数
  var parameterJson = {};
  if ("form" == parameterType) {
    $("[p_operationId='" + operationId + "'][in='query']").each(
        function (index, domEle) {
          var k = $(domEle).attr("name");
          var v = $(domEle).val();
          if (v) {
            parameterJson[k] = v;
          }
        });
  } else if ("json" == parameterType) {
    var str = $("#text_tp_" + operationId).val();
    try {
      parameterJson = JSON.parse(str);
    } catch (error) {
      layer.msg("" + error, {icon: 5});
      return false;
    }
  }

  //发送请求
  $.ajax({
    type: $("[m_operationId='" + operationId + "']").attr("method"),
    url: path,
    headers: headerJson,
    data: parameterJson,
    dataType: 'json',
    success: function (data) {
      var options = {
        withQuotes: true
      };
      $("#json-response").jsonViewer(data, options);
    }
  });
}

//请求类型
function changeParameterType(el) {
  var operationId = $(el).attr("operationId");
  var type = $(el).attr("type");
  $("#content_type_" + operationId).val(type);
  $(el).addClass("layui-btn-normal").removeClass("layui-btn-primary");
  if ("form" == type) {
    $("#text_tp_" + operationId).hide();
    $("#table_tp_" + operationId).show();
    $("#pt_json_" + operationId).addClass("layui-btn-primary").removeClass(
        "layui-btn-normal");
  } else if ("json" == type) {
    $("#text_tp_" + operationId).show();
    $("#table_tp_" + operationId).hide();
    $("#pt_form_" + operationId).addClass("layui-btn-primary").removeClass(
        "layui-btn-normal");
  }
}
