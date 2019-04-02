function getId(id) {
    return document.getElementById(id);
}
var KL = function () {
    var self = this;
    self.isset = function (arg) {
        return typeof arg === 'undefined' ? false : true;
    }
    self.id = function (id) {
        return document.getElementById(id);
    }
    return self;
}
var kl = new KL();
var Emt = function (tagName) {
    var tmp = document.createElement(tagName);
    Elmt.call(tmp);
    //t.prototype=new Elmt();
    return tmp;
}
var Elmt = function (tag) {
    // Elmt.prototype=new Emt(tag);
    var self = this;
    self.setStyle = function (configs) {
        for (var attr in configs)
            self.style[attr] = configs[attr];
        return self;
    };
    self.setPros = function (configs) {
        for (var attr in configs)
            self[attr] = configs[attr];
        return self;
    };
    self.setAttrs = function (configs, isAddPrototype) {
        for (var attr in configs)
            self.setAttribute(attr, configs[attr]);
        if (isAddPrototype)for (var attr in configs)
            self[attr] = configs[attr];
        return self;
    };
    self.setEventListener = function (event, fn) {
        self.addEventListener(event, fn);
        return self;
    }
    self.addNode = function () {
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] !== 'string') {
                self.appendChild(arguments[i]);
                arguments[i].boss = self;
                arguments[i].parent = self;
                if (typeof  arguments[i + 1] === 'string') {
                    if (arguments[i + 1]) self[arguments[i + 1]] = arguments[i];
                }
            }
        }
        return self;
    };
    self.addNodes = function (nodes) {
        for (var i in nodes) {
            var node = nodes[i];
            if(typeof node==='string'){
                self.innerHTML+=node;
            }else{
                nodes.boss = self;
                self.appendChild(node);
                (node.eleParent || self)[node.eleName || i] = node;
            }

        }
        return self;
    };
    return self;
};

function ajaxPost(url, data, successCall, type, failCall) {
    console.log('post data');
    var request = new XMLHttpRequest();
    var failCall_ = failCall || function (e) {
            console.log(e);
        };
    request.addEventListener("load", function () {
        if (request.status == 200) {
            try {
                var result = type == 'json' ? JSON.parse(request.responseText) : request.responseText;
                successCall(result);
            } catch (e) {
                failCall_('请求成功，但读取失败' + e.message + "\n" + request.responseText);
            }
        } else {
            failCall_(request.status + ':' + request.statusText);
        }
    }, false);
    request.addEventListener("error", function () {
        console.log('出错了');
    }, false);
    request.addEventListener("abort", function () {
        console.log('中断了');
    }, false);

    //request.onreadystatechange = requestCallback;
    request.open("POST", url, true);
    request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    //request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    if (data.toString().indexOf('FormData') !== -1) {
        request.send(data);
    } else {
        var fromData = new FormData();
        for (var k in data) {
            fromData.append(k, data[k]);
        }
        request.send(fromData);
    }

}
function getCookie(cookie_name) {
    var cks = document.cookie.split(';');
    for (var i = 0; i < cks.length; i++) {
        if (cks[i].search(cookie_name) !== -1) {
            return decodeURIComponent(cks[i].replace(cookie_name + '=', ''));
        }
    }
}
function setCookie(name, val, day, domain) {
    var date = new Date();
    date.setTime(date.getTime() + day * 24 * 3600 * 1000);
    var time_out = date.toGMTString();
    //console.log(time_out, val);
    document.cookie = name + '=' + encodeURIComponent(val) + ';expires=' + time_out + ';path=/;domain=' + domain;
}
function ajax(opts) {
    var request = new XMLHttpRequest();
    request.addEventListener("load", function () {
        if (request.status == 200) {
            var result = opts.type == 'json' ? JSON.parse(request.responseText) : request.responseText;
            opts.success(result);
        } else {
            if (opts.error) {
                opts.error(request.status + ':' + request.statusText);
            }
        }
    }, false);
    request.addEventListener("error", function () {
        console.log('出错了');
    }, false);
    request.addEventListener("abort", function () {
        console.log('中断了');
    }, false);

    //request.onreadystatechange = requestCallback;
    request.open((opts.method || "POST"), opts.url, true);
    if (opts.isAjax !== false) request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    //request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    if (opts.form) {
        request.send(opts.form);
    } else {
        var fromData = new FormData();
        for (var k in opts.data) {
            fromData.append(k, opts.data[k]);
        }
        request.send(fromData);
    }

}
function domLoaded(fn) {
    document.addEventListener('DOMContentLoaded', function () {
        console.log('ready 1');
        fn();
    });
}