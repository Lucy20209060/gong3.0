/**
 * ajax封装
 * url 发送请求的地址
 * data 发送到服务器的数据，数组存储，如：{"username": "张三", "password": 123456}
 * succCallback 成功回调函数
 * errorCallback 失败回调函数
 * type 请求方式("POST" 或 "GET")， 默认已经设置为 "POST"
 * dataType 预期服务器返回的数据类型，常用的如：xml、html、json、text
 */

function ajax(url, postData, succCallback, errorCallback, type, dataType){
    var type = type || "post";
    var dataType = dataType || "json";

    $.ajax({
        type: type,
        url: url,
        data: postData,
        dataType: dataType,

        beforeSend: function(){  //此处可以进行拦截验证
                               
        },

        success: function(res){
            if(res.success){
                if(succCallback){
                    succCallback(res);
                }                       
            }else{
                if(errorCallback){
                    errorCallback(res);
                }
            }                   
        },
        error: function(error){
        	
        },
        complete: function(){   //结束后进行的动作
            
        }
    });
}

export default ajax;