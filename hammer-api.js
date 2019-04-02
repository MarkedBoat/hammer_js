/**
 * 代请求方法
 * @param param 参数列表
 * @param loadedFun 网络请求完成之后的函数
 * @param netErrorFun 网络请求失败的触发方法
 */
function requestMethod(param, loadedFun, netErrorFun) {
    var fd = new FormData();
    for (var k in param)
        fd.append(k, param[k]);
    ajax(
        {
            url: '/settle/requestMethod',
            form: fd,
            success: function (data) {
                if (typeof  loadedFun == 'function') {
                    loadedFun(data);
                } else {
                    console.log(data);
                }
            },
            type: 'json',
            error: function (data) {
                alert('请求网络失败失败，请重试');
                if (typeof  netErrorFun == 'function') netErrorFun(data);
            }
        }
    );
}

/**
 * 代请求方法
 * @param param 参数列表
 * @param loadedFun 网络请求完成之后的函数
 * @param netErrorFun 网络请求失败的触发方法
 */
function postApi(param, loadedFun, netErrorFun) {
    var fd = new FormData();

    fd.append('param',JSON.stringify(param));
    ajax(
        {
            url: '/admin/api/postApi',
            form: fd,
            success: function (data) {
                if(data && data.data && data.isSuc){
                    if (typeof  loadedFun == 'function') {
                        loadedFun(data.data);
                    } else {
                        console.log(data.data);
                    }
                }else{
                    if (typeof  netErrorFun == 'function') netErrorFun(data);
                }

            },
            type: 'json',
            error: function (data) {
                alert('请求网络失败失败，请重试');
                if (typeof  netErrorFun == 'function') netErrorFun(data);
            }
        }
    );
}