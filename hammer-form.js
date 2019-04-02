var hammerForms = {};
function hammerForm(data, dataName) {
    console.log(data);
    var form = new Emt('form');

    hammerForms[data.targetId] = form;
    form.echo = function (opts) {
        for (var l1key in data.extFilter) {
            if (typeof data.extFilter[l1key] == 'object') {
                for (var l2key in data.extFilter[l1key]) {
                    // console.log(data.modelName+'[extFilter]['+l1key+']['+l2key+']',document.getElementsByName(data.modelName+'[extFilter]['+l1key+']['+l2key+']'));
                    if (document.getElementsByName(data.modelName + '[extFilter][' + l1key + '][' + l2key + ']').length === 1) document.getElementsByName(data.modelName + '[extFilter][' + l1key + '][' + l2key + ']')[0].value = data.extFilter[l1key][l2key];
                }
            } else {
                var inputs = document.getElementsByName(data.modelName + '[extFilter][' + l1key + ']');
                if (inputs.length === 1 && inputs[0].type !== 'checkbox' && inputs[0].type !== 'radio') {
                    document.getElementsByName(data.modelName + '[extFilter][' + l1key + ']')[0].value = data.extFilter[l1key];
                } else {
                    for (var x in inputs) {
                        if (inputs[x].value == data.extFilter[l1key]) {
                            inputs[x].checked = true;
                        }
                    }
                }
            }
        }

        if (kl.id(data.targetId + '_ext_filter')) form.addNode(kl.id(data.targetId + '_ext_filter'));

        form.data = data;
        opts.targetEmt.appendChild(form);//要添加的位置
        var dataCfg = typeof opts.data == 'object' ? opts.data : {}; //页面的js配置
        var searchBtn = (new Emt('input')).setPros({type: 'button', value: '搜索'});
        searchBtn.addEventListener('click', function () {
            form.post();
        });
        var ctrlDiv = new Emt('div').addNodes([searchBtn]);
        form.addNode(ctrlDiv);
        //  (data.targetId) ? kl.id(data.targetId).appendChild(form) : document.body.appendChild(form);
        form.addNode(new Emt('input').setPros({type: 'hidden', name: data.sortVar, value: data.sortValue}), 'sortVar');
        var table = new Emt('table').setPros({className: 'divTable table table-striped table-bordered table-condensed'});
        form.addNode(table, 'table');
        /**
         * 设置 header
         * @type {HTMLElement}
         */
        var trHeader = table.insertRow();
        trHeader.setAttribute('tr_type', 'header');
        form.header = trHeader;
        data.headers.forEach(function (header, index) {
            var td = trHeader.insertCell();
            var button = new Emt('strong').setPros({
                className: 'btn btn-default',
                textContent: typeof dataCfg[header.keyName] == 'object' && dataCfg[header.keyName].header ? dataCfg[header.keyName].header : header.headerName.toString()
            }).setStyle({padding: '0px'});

            //var span = new Emt('span').setPros({className: 'glyphicon '});
            //span.classList.add('caret');
            //button.addNode(span);
            if (header.sort.search('.desc') === -1) {
                button.textContent = button.textContent + '↓';
            } else {
                button.textContent = button.textContent + '↑';
            }
            button.addEventListener('click', function () {
                form.sortVar.value = header.sort;
                console.log(header.sort);
                form.post();
            });
            td.appendChild(button);

            td.setAttribute('column_name', header.keyName);
            td.columnName = header.keyName;
        });
        /**
         * 设置过滤
         * @type {HTMLElement}
         */
        var trFilter = table.insertRow();
        trFilter.setAttribute('tr_type', 'filter');
        form.filter = trFilter;
        var keyNames = [];
        data.headers.forEach(function (header, index) {
            var tdFilter = trFilter.insertCell();
            if (header.hasFilter) {
                if (header.filterArray.length) {
                    var select = new Emt('select');
                    select.setPros({name: header.filterName});
                    select.add(new Option('不限制', '#'));
                    header.filterArray.forEach(function (ele) {
                        select.add(new Option(ele.v, ele.k))
                    });
                    tdFilter.appendChild(select);
                    select.value = header.default === false ? '#' : header.default;
                } else {
                    var input = new Emt('input');
                    input.setPros({type: 'text', name: header.filterName});
                    tdFilter.appendChild(input);
                    if (header.default) input.value = header.default;
                }
            }
            keyNames.push(header.keyName ? header.keyName : '');
            tdFilter.setAttribute('column_name', header.keyName);
            tdFilter.columnName = header.keyName;
            // td.textContent = header.headerName.toString();
        });
        /**
         * 渲染数据主体
         */

        data.rows.forEach(function (row, index) {
            var tr = table.insertRow();
            row.data.forEach(function (ele, index) {
                var td = tr.insertCell();
                var columnName = keyNames[index];
                td.setAttribute('column_name', columnName);
                td.columnName = columnName;
                if (typeof dataCfg[columnName] == 'object' && typeof dataCfg[columnName].fun == 'function') {
                    dataCfg[columnName].fun(row.__data, td)
                } else {
                    td.innerHTML = ele;
                }
            });
        });
        form.addNodes([new Emt('input').setPros({
            type: 'hidden',
            value: data.page.current,
            name: data.page.varName,
            eleName: 'pageNo'
        })]);
        form.jumpPage = function (pageNo) {
            form.pageNo.value = pageNo;
            form.post();

        };
        form.post = function () {
            var selects = form.getElementsByTagName('select');
            for (var i = 0; i < selects.length; i++) {
                var select = selects[i];
                if (select.value === '#') select.name = '';
            }
            form.submit();
        };
        /**
         * 增加分页表
         */
        var pageUl = new Emt('ul').setPros({className: 'pagination'});
        for (var i = data.page.start; i <= data.page.end; i++) {
            if (i > data.page.current + 5)break;
            var mark = (data.page.current + 1 == i ? '-' : '').toString();
            pageUl.addNode(new Emt('li').addNode(new Emt('a').setPros({
                href: '#',
                pageNum: i,
                textContent: mark + i.toString() + mark,
                onclick: function () {
                    form.jumpPage(this.pageNum);
                }
            })));
        }
        var pagesDiv = new Emt('div').setPros({className: 'pagination yiiPager'});
        pagesDiv.addNode(pageUl);
        pagesDiv.addNode(function (input) {
            input.addEventListener('change', function () {
                form.jumpPage(this.value);
            });
            return input;
        }(new Emt('input').setPros({type: 'text'})));
        form.addNode(pagesDiv);

        form.addEventListener('keyup', function () {
            var event = event || window.event;
            if (event.keyCode == 13) form.post();
        });


    };


    /**
     * 设置样式
     */
    if (!document.getElementById('hammer-form-css')) {
        var style = new Emt('style').setPros({id: 'hammer-form-css'});
        var str = '';
        str += '.divTable tr td * { max-width: 90%;}';
        str += ' button.desc .caret {        border-bottom: 4px solid #000000;        border-top: none;     }';
        str += ' button.asc .caret {            position: absolute;        right: 5px; top: 7px; }';
        document.body.appendChild(style.setPros({innerHTML: str}));

    }

    form.addColsManger = function (div_manger) {
        var cols_cfg_name = 'cols_cfg' + document.location.pathname.toString().split('/').join('_');
        console.log(cols_cfg_name);
        var cols_cfg = {};
        try {
            cols_cfg = JSON.parse(localStorage[cols_cfg_name]);
        } catch (e) {
        }
        var div = new Emt('div').setPros({className: 'cols_cfg_style_div'});
        var style = new Emt('style').setPros({id: 'cols_cfg_style'});
        style.innerHTML = '' +
            '.cols_cfg_style_div{display:block;float:left;width:100%} ' +
            '.col_cfg_div{display:block;float:left;padding:5px;} ' +
            '.col_cfg_div>input[type="checkbox"]{display:none;} ' +
            '.col_cfg_div label{font-weight: 100;background: #000;color: #FFF;} ' +
            '.col_cfg_div>input[type="checkbox"]:checked + label {background: #FFF;color: #000;}';
        form.data.headers.forEach(function (col, index) {
            var div2 = new Emt('div').setPros({className: 'col_cfg_div'});
            var val = false;
            if (cols_cfg[col.keyName] && cols_cfg[col.keyName] === true) {
                var str = 'td[column_name="' + col.keyName + '"]{display: none;}';
                style.innerHTML += str + "\n";
                val = true;
            } else {

            }
            var input = new Emt('input').setPros({
                type: 'checkbox',
                checked: val,
                id: 'cfg_cb_' + index,
                keyName: col.keyName
            });

            input.addEventListener('change', function () {
                var keyName = this.keyName;
                var str = 'td[column_name="' + keyName + '"]{display: none;}';
                if (this.checked) {
                    if (style.innerHTML.indexOf(str) === -1)
                        style.innerHTML += str + "\n";
                    cols_cfg[keyName] = true;
                } else {
                    style.innerHTML = style.innerHTML.replace(str, '');
                    cols_cfg[keyName] = false;
                }
                localStorage.setItem(cols_cfg_name, JSON.stringify(cols_cfg));
            });
            var label = new Emt('label').setPros({textContent: col.headerName}).setAttrs({'for': input.id});
            div2.addNodes([input, label]);
            div.addNode(div2);

        });
        div_manger.appendChild(div);
        document.body.appendChild(style);
    }


}