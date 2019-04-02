var hammerShowImgTimes = 0;
/**
 *
 * @param fileElmt  文件元素
 * @param imgElmt   图片元素
 * @param callbackShow  文件读取后的处理回调方法
 * @param callbackUpload  上传完成之后 的处理回调方法
 * @param cdnSpace  cdn空间  rrphoto imgbftv之类的
 * @param opts 参数 maxWidth 最大宽  maxHeight最大高   minWidth&maxHeight最小 stdWith&stdHeight 必须正准 extLimits限制类型
 */
function hammerShowImg(fileElmt, imgElmt, callbackShow, callbackUpload, cdnSpace, opts) {
    hammerShowImgTimes++;
    var tmp_img = fileElmt.files[0];
    console.log(tmp_img);
    //if (tmp_img.type == "image/webp") {
    if (tmp_img.type.indexOf('image') !== -1) {
        var fileType = tmp_img.type;
        var fileTypeExt = tmp_img.type.replace('image/', '');
        var fr = new FileReader();
        fr.file = tmp_img;
        fr.onload = function (evt) {
            var img = new Image();
            img.onload = function () {
                var canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                if (opts) {
                    var result = hammerImgCdnCondition(opts, img);
                    if (result !== false) {
                        alert(result);
                        return false;
                    }
                }
                var ctx = canvas.getContext('2d');
                ctx.fillStyle = "#000000";
                ctx.drawImage(img, 0, 0);
                //console.log(tmp_img,evt.target.file,"\n");
                //addCell(canvas.toDataURL('image/jpeg'), evt.target.file);
                if (typeof callbackShow === 'function') callbackShow(canvas.toDataURL('image/webp'), evt.target.file);
                imgElmt.src = canvas.toDataURL(fileType);
                imgElmt.file = evt.target.file;
                if (typeof callbackUpload === 'function') __upload(imgElmt, hammerShowImgTimes, callbackUpload, cdnSpace, fileTypeExt);
            }
            img.src = evt.target.result;
        }
        fr.readAsDataURL(tmp_img);
    } else {
        alert(tmp_img.name + '格式不对');
    }


    function __upload(img, index, callbackUpload, cdnSpace, extType) {
        img.upSta = false;
        img.style.opacity = '0.2';
        var data = new FormData();
        data.append('type', cdnSpace || 'imgbftv');
        data.append('index', index);
        data.append('ext', extType || 'jpg');
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function () {
            console.log(xhr);
            var data = JSON.parse(xhr.responseText);
            if (data.url && data.api) {
                var fd = new FormData();
                fd.append('policy', data.post.policy);
                fd.append('signature', data.post.signature);
                fd.append("file", img.file);
                var xhrUpyun = new XMLHttpRequest();
                xhrUpyun.addEventListener("load", function () {
                    console.log(xhrUpyun);
                    var dataUpyun = JSON.parse(xhrUpyun.responseText);
                    console.log(dataUpyun, data);
                    if (dataUpyun.message && dataUpyun.message == 'ok') {
                        console.log(data);
                        img.src = data.url;
                        img.style.opacity = '1';
                        img.upSta = true;
                        callbackUpload(data);
                    }
                }, false);
                xhrUpyun.addEventListener("error", function () {
                    console.log(img, '出错了');
                }, false);
                xhrUpyun.addEventListener("abort", function () {
                    console.log(img, '中断了');
                }, false);

                xhrUpyun.open("POST", data.api);
                xhrUpyun.send(fd);
            }

        }, false);
        xhr.open("POST", "http://vo.fengmi.tv/admin/tool/getYpyunHash");
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.send(data);

    }
}

function hammerImgCdn(opts) {
    hammerShowImgTimes++;
    console.log(opts);
    var tmp_img = opts.fileElmt.files[0];
    if (tmp_img.type.indexOf('image') !== -1) {
        var fileType = tmp_img.type;
        var fileTypeExt = tmp_img.type.replace('image/', '');
        var fr = new FileReader();
        fr.file = tmp_img;
        fr.onload = function (evt) {
            var img = new Image();
            img.onload = function () {
                var canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                var result = hammerImgCdnCondition(opts, img);
                if (result !== false) {
                    if (typeof opts.errorFn === 'function') {
                        opts.errorFn(result)
                    } else {
                        alert(result);
                    }
                    return false;
                }
                var ctx = canvas.getContext('2d');
                ctx.fillStyle = "#000000";
                ctx.drawImage(img, 0, 0);
                if (opts.imgElmt) {
                    opts.imgElmt.src = canvas.toDataURL(fileType);
                    opts.imgElmt.file = evt.target.file;
                }
                if (typeof opts.sucFn === 'function') opts.sucFn();
                if (typeof opts.showFn === 'function') opts.showFn(canvas.toDataURL(fileType), evt.target.file);
                if (typeof opts.uploadFn === 'function') hammerImgCdnUpload({
                    img: opts.imgElmt,
                    file: evt.target.file,
                    index: hammerShowImgTimes,
                    uploadFn: opts.uploadFn,
                    uploadingFn: opts.uploadingFn || '',
                    errorFn: opts.errorFn || '',
                    abortFn: opts.abortFn || '',
                    cdnSpace: opts.cdnSpace || '',
                    extType: fileTypeExt
                });
            }
            img.src = evt.target.result;
        }
        fr.readAsDataURL(tmp_img);
    } else {
        alert(tmp_img.name + '格式不对');
    }
}


function hammerImgCdnUpload(opts) {
    if (opts.img) {
        opts.img.upSta = false;
        opts.img.style.opacity = '0.2';
    }

    var data = new FormData();
    data.append('type', opts.cdnSpace || 'imgbftv');
    data.append('index', opts.index || 0);
    data.append('ext', opts.extType || 'jpg');
    ajax({
        url: 'http://vo.fengmi.tv/admin/tool/getYpyunHash', form: data, success: function (data) {
            //var data = JSON.parse(xhr.responseText);
            if (data.url && data.api) {
                var fd = new FormData();
                fd.append('policy', data.post.policy);
                fd.append('signature', data.post.signature);
                fd.append("file", opts.file);
                var xhrUpyun = new XMLHttpRequest();
                xhrUpyun.addEventListener("load", function () {
                    console.log(xhrUpyun);
                    var dataUpyun = JSON.parse(xhrUpyun.responseText);
                    console.log(dataUpyun, data);
                    if (dataUpyun.message && dataUpyun.message == 'ok') {
                        console.log(data);
                        if (opts.img) {
                            opts.img.src = data.url;
                            opts.img.style.opacity = '1';
                            opts.img.upSta = true;
                        }
                        if (opts.uploadFn)
                            opts.uploadFn(data);
                    }
                }, false);

                xhrUpyun.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        typeof opts.uploadingFn === 'function' ? opts.uploadingFn(evt.loaded, evt.total) : console.log('进度:', evt.loaded, evt.total);
                    }
                }, false);
                xhrUpyun.addEventListener("error", (typeof opts.errorFn === 'function' ) ? opts.uploadingFn(evt) : function () {
                    console.log(img, '出错了');
                }, false);
                xhrUpyun.addEventListener("abort", (typeof opts.abortFn === 'function' ) ? opts.uploadingFn(evt) : function () {
                    console.log(img, '中断了');
                }, false);
                console.log(data.api);
                xhrUpyun.open("POST", data.api);
                xhrUpyun.send(fd);
            }
        },
        type: 'json'
    });
}


function hammerImgCdnCondition(opts, img) {
    var msgs = [];
    if (opts.maxWidth && img.width > opts.maxWidth) msgs.push('超过最大尺寸宽:' + img.width + '>' + opts.maxWidth);
    if (opts.maxHeight && img.height > opts.maxHeight) msgs.push('超过最大尺寸高:' + img.height + '>' + opts.maxHeight);

    if (opts.minWidth && img.width < opts.minWidth) msgs.push('不到最小尺寸宽:' + img.width + '<' + opts.minWidth);
    if (opts.minHeight && img.height < opts.minHeight) msgs.push('不到最小尺寸高:' + img.height + '<' + opts.minHeight);

    if (opts.stdWidth && img.width != opts.stdWidth) msgs.push('宽尺寸不符合:' + img.width + '!=' + opts.stdWidth);
    if (opts.stdHeight && img.height != opts.stdHeight) msgs.push('高尺寸不符合:' + img.height + '!=' + opts.stdHeight);

    return msgs.length ? msgs.join(';') : false;
}



var HammerUploader = function (initOpts) {
    var self = this;
    self.index = 0;
    self.initTimes = 0;
    self.opts = initOpts || {};
    self.upload = function (opts) {
        var cdnSpace = opts.cdnSpace || self.opts.cdnSpace;
        var data = new FormData();
        if (typeof  cdnSpace === 'string') {
            data.append('type', cdnSpace);
        } else {
            if (typeof opts.errorFun === 'function') opts.errorFun('没有设置cdn'); else throw "没有设置cdn";
        }
        if (typeof  (opts.extType || self.opts.extType) === 'string') {
            data.append('ext', (opts.extType || self.opts.extType));
        } else {
            var fileType = opts.file.type.toString().split('/');
            if (fileType.length !== 2)throw '文件格式异常' + file.type.toString();
            data.append('ext', fileType[1]);
        }
        data.append('index', self.index);
        self.index++;
        ajax({
            url: 'http://vo.fengmi.tv/admin/tool/getYpyunHash',
            form: data,
            success: function (data) {
                if (data.url && data.api) {
                    var fd = new FormData();
                    fd.append('policy', data.post.policy);
                    fd.append('signature', data.post.signature);
                    fd.append("file", opts.file);
                    var xhrUpyun = new XMLHttpRequest();
                    xhrUpyun.addEventListener("load", function () {
                        var dataUpyun = JSON.parse(xhrUpyun.responseText);
                        if (dataUpyun.message && dataUpyun.message == 'ok') {
                            opts.uploadFun(data);
                        } else {
                            if (typeof opts.errorFun === 'function') opts.errorFun('上传失败'); else throw "上传失败";
                        }
                    }, false);
                    xhrUpyun.upload.addEventListener("progress", function (evt) {
                        if (evt.lengthComputable) {
                            typeof opts.uploadingFun === 'function' ? opts.uploadingFun(evt.loaded, evt.total) : console.log('进度:', evt.loaded, evt.total);
                        }
                    }, false);
                    xhrUpyun.addEventListener("error", function (evt) {
                        (typeof opts.errorFun === 'function' ) ? opts.errorFun(evt) : console.log('出错了');
                    }, false);
                    xhrUpyun.addEventListener("abort", function (evt) {
                        console.log(img, '中断了');
                        (typeof opts.abortFun === 'function' ) ? opts.abortFun(evt) : console.log('中断了');
                    }, false);
                    console.log(data.api);
                    xhrUpyun.open("POST", data.api);
                    xhrUpyun.send(fd);
                } else {
                    if (typeof opts.errorFun === 'function') opts.errorFun('获取cdn信息失败'); else throw "获取cdn信息失败";
                }
            },
            type: 'json'
        });
    };

};