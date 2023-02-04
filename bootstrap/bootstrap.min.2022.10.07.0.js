let hammerYii2Bootstarp = function () {
    let bootstrap_hanndle = {};

    bootstrap_hanndle.getEleRandId = function (prefix) {
        return prefix + '_' + (parseInt(Math.random(1, 2) * 10000000000).toString());
    }
    /**
     *
     * @link https://www.runoob.com/bootstrap/bootstrap-modal-plugin.html  Bootstrap 模态框（Modal）插件
     * @param input_option
     * @returns {{title_ele, body_ele, hide: hide, show: show}}
     */
    bootstrap_hanndle.createModal = function (input_option) {
        let init_config = input_option || {};
        let div_modal = new Emt('div').setAttrsByStr('class="fade modal" role="dialog" tabindex="-1"').setPros({id: bootstrap_hanndle.getEleRandId('modal')});
        if (init_config.easy_close !== true) {
            div_modal.setAttribute("data-backdrop", "static");
        }

        div_modal.apiHandle = {
            ele: {root: div_modal},
            setZindex: function () {
                alert('未初始化');
            },
            setTitleText: function (str) {
                alert('未初始化');
            },
            addBodyChildElements: function (eles) {
                alert('未初始化');
            },
            addFooterChildElements: function (eles) {
                alert('未初始化');
            },
        };
        div_modal.apiHandle.show = function () {
            $('#' + div_modal.id).modal('show');
        };
        div_modal.apiHandle.hide = function () {
            $('#' + div_modal.id).modal('hide');
        };


        let modal_title = new Emt('h4').setPros({textContent: init_config.title || '标题'}).setAttrsByStr('class="modal-title"');
        let modal_body = new Emt('div').setAttrsByStr('class="col-lg-12"');
        let modal_footer = new Emt('div').setAttrsByStr('class="modal-foote"');

        div_modal.addNodes([
            new Emt('div').setAttrsByStr('class="modal-dialog"').addNodes([
                new Emt('div').setAttrsByStr('class="modal-content"').addNodes([
                    //头部
                    new Emt('div').setAttrsByStr('class="modal-header"').addNodes([
                        new Emt('button').setPros({textContent: 'x'}).setAttrsByStr('type="button" class="close" data-dismiss="modal" aria-hidden="true"'),
                        modal_title
                    ]),
                    //主体
                    new Emt('div').setAttrsByStr('class="modal-body"').addNodes([
                        new Emt('div').setAttrsByStr('class="row"').addNodes([
                            modal_body
                        ])
                    ]),
                    modal_footer
                ])
            ])
        ]);

        document.body.append(new Emt('div').addNodes([div_modal]));


        div_modal.apiHandle.ele.title = modal_title;
        div_modal.apiHandle.ele.body = modal_body;
        div_modal.apiHandle.ele.foot = modal_footer;
        div_modal.apiHandle.setZindex = function (zindex_num) {
            div_modal.style.zIndex = zindex_num;
            return div_modal;
        }
        div_modal.apiHandle.setTitleText = function (str) {
            modal_title.textContent = str;
            return div_modal;
        }
        div_modal.apiHandle.addBodyChildElements = function (eles) {
            modal_body.addNodes(eles);
            return div_modal;
        }
        div_modal.apiHandle.addFooterChildElements = function (eles) {
            modal_footer.addNodes(eles);
            return div_modal;
        }

        return div_modal;

    };
    /**
     * @link https://www.runoob.com/bootstrap/bootstrap-panels.html Bootstrap 面板（Panels）

     * @returns {{title_ele, body_ele, root}}
     */
    bootstrap_hanndle.createPanel = function (input_param) {
        let init_config = init_config || {
            title: '面板标题',
            detail: '这是一个基本的面板',
            footer: '面板脚注'
        };
        let title = new Emt('H3').setAttrsByStr('class="panel-title"', init_config.title);
        let body = new Emt('DIV').setAttrsByStr('class="panel-body"', init_config.detail);
        let footer = new Emt('DIV').setAttrsByStr('class="panel-footer"', init_config.footer);
        let root_ele = new Emt('DIV').setAttrsByStr('class="panel panel-primary"', '').addNodes([
            new Emt('DIV').setAttrsByStr('class="panel-heading"', '').addNodes([
                title
            ]),
            body,
            footer
        ]);

        root_ele.apiHandle = {
            ele: {root: root_ele}
        };

        root_ele.apiHandle.ele.title = title;
        root_ele.apiHandle.ele.body = body;
        root_ele.apiHandle.ele.footer = footer;

        root_ele.apiHandle.color = {items: ['primary', 'success', 'info', 'warning', 'danger']};
        //设置不同颜色
        root_ele.apiHandle.color.set = function (color_key) {
            if (color_key !== '') {
                root_ele.classList.add('panel-' + color_key);
            }
            opts.color.items.forEach(function (color) {
                if (color_key !== color) {
                    root_ele.classList.remove('panel-' + color);
                }
            })
            return root_ele;
        };
        return root_ele;
    }


    bootstrap_hanndle.createButton = function (input_param) {
        let init_config = input_param || {};
        let btn_ele = new Emt(init_config.tagName || 'button').setAttrsByStr('class="btn btn-default" ', input_param.text || '按钮文字');
        btn_ele.apiHandle = {
            ele: {root: btn_ele}
        };
        if (init_config.type) {
            btn_ele.setAttribute('type', init_config.type);
        }
        if (init_config.text) {
            btn_ele.textContent = init_config.text;
        }


        btn_ele.apiHandle.color = {items: ['primary', 'success', 'info', 'warning', 'danger', 'link', 'default']};
        btn_ele.apiHandle.size = {items: ['lg', 'sm', 'xs', 'block']};

        //设置不同颜色
        btn_ele.apiHandle.color.set = function (color_key) {
            if (color_key !== '') {
                btn_ele.classList.add('btn-' + color_key);
            }
            btn_ele.classList.add('btn-' + color_key);
            btn_ele.apiHandle.color.items.forEach(function (color) {
                if (color_key !== color) {
                    btn_ele.classList.remove('btn-' + color);
                }
            });
            return btn_ele;
        };
        //设置不同大小
        btn_ele.apiHandle.size.set = function (size_key) {
            if (size_key !== '') {
                btn_ele.classList.add('btn-' + size_key);
            }
            btn_ele.classList.add('btn-' + size_key);
            btn_ele.apiHandle.size.items.forEach(function (size) {
                if (size_key !== size) {
                    btn_ele.classList.remove('btn-' + size_key);
                }
            })
            return btn_ele;
        };
        if (typeof init_config.clickCall === "function") {
            btn_ele.addEventListener('click', function () {
                init_config.clickCall(btn_ele);
            });
        }
        bootstrap_hanndle.__initInputEle(btn_ele, input_param);

        return btn_ele;
    }


    bootstrap_hanndle.createFormInputGroupDiv = function (input_param) {
        let init_config = input_param || {};
        let group_div = new Emt('DIV').setAttrsByStr('class="form-group"', '');
        group_div.apiHandle = {
            ele: {root: group_div}
        };
        // init_config.nameTpl = init_config.name_tpl || '$name_key';
        init_config.text = init_config.text || 'text';
        //   init_config.inputEle = init_config.inputEle || undefined;
        //   init_config.inputEleHandleIndexKey = init_config.inputEleHandleIndexKey || undefined;


        group_div.apiHandle.ele.inputLabel = new Emt('LABEL', 'class="col-sm-2 control-label"', init_config.text);
        group_div.apiHandle.ele.inputDiv = new Emt('DIV', 'class="col-sm-10"');
        group_div.apiHandle.addInputEle = function (inputEle) {
            group_div.apiHandle.ele.inputDiv.addNode(inputEle);
            //console.log('xxxx', inputEle);
            if (inputEle.id) {
                group_div.apiHandle.ele.inputLabel.setAttribute('for', inputEle.id);
            }
            return group_div;
        };
        group_div.apiHandle.setText = (text) => {
            group_div.apiHandle.ele.inputLabel.textContent = text;
            return group_div;
        }
        group_div.addNodes([
            group_div.apiHandle.ele.inputLabel,
            group_div.apiHandle.ele.inputDiv
        ])
        return group_div;
    };

    bootstrap_hanndle.__initInputEle = function (inputEle, input_param) {

        if (input_param.placeholder !== undefined) {
            inputEle.placeholder = input_param.placeholder;
        }

        inputEle.apiHandle.val = {
            init: undefined
        };

        inputEle.apiHandle.getVal = function () {
            return inputEle.value;
        }
        inputEle.apiHandle.__setVal = function (val) {
            inputEle.value = val;
        }

        inputEle.apiHandle.setInitVal = function (val) {
            inputEle.apiHandle.__setVal(val);
            inputEle.apiHandle.val.init = val;
            return inputEle;
        };
        inputEle.apiHandle.getInitVal = function (val) {
            return inputEle.apiHandle.val.init;
        };

        inputEle.apiHandle.rollBackInitVal = function () {
            inputEle.apiHandle.setInitVal(inputEle.apiHandle.val.init);
            return inputEle;
        };


        inputEle.apiHandle.setChangedVal = function (val) {
            inputEle.apiHandle.__setVal(val);
            return inputEle;
        };
        inputEle.apiHandle.acceptValChanged = function () {
            inputEle.apiHandle.val.init = inputEle.getVal();
            return inputEle;
        }

        inputEle.apiHandle.isChange = function () {
            return !(inputEle.apiHandle.getInitVal() === inputEle.apiHandle.getVal());
        }

        inputEle.apiHandle.__setRemoteItems = function (url, post_data) {
            console.log('xxxxxxxxx', url, post_data);
            let tmp_method = 'GET';
            if (post_data) {
                tmp_method = 'POST';
            } else {
                post_data = {};
            }
            kl.ajax({
                url: url,
                data: post_data,
                type: 'json',
                method: tmp_method,
                success: function (tmp_res) {
                    if (tmp_res && typeof tmp_res.forEach === "function") {
                        inputEle.apiHandle.setItems(tmp_res);
                        inputEle.apiHandle.rollBackInitVal();
                    } else {
                        alert('__setRemoteItems 报错了');
                        throw  '远程items 数据错误';
                    }
                },
                error: function (res_save_column) {
                    alert('__setRemoteItems 报错了');
                    throw  '远程items 网络错误';
                }
            })
            return inputEle;
        }
        inputEle.apiHandle.setClickCall = function (fun) {
            inputEle.addEventListener('click', function () {
                fun(this);
            });
        }


    };
    bootstrap_hanndle.createTextInput = function (input_param) {
        let text_input_ele = new Emt('INPUT', 'type="text"').setPros({id: bootstrap_hanndle.getEleRandId('text_input')});

        text_input_ele.apiHandle = {ele: {root: text_input_ele}};
        bootstrap_hanndle.__initInputEle(text_input_ele, input_param);
        return text_input_ele;
    }

    bootstrap_hanndle.createNumberInput = function (input_param) {
        let text_input_ele = new Emt('INPUT', 'type="number"').setPros({id: bootstrap_hanndle.getEleRandId('number_input')});
        if (input_param.placeholder !== undefined) {
            text_input_ele.placeholder = input_param.placeholder;
        }
        text_input_ele.apiHandle = {ele: {root: text_input_ele}};
        bootstrap_hanndle.__initInputEle(text_input_ele, input_param);
        return text_input_ele;
    }

    bootstrap_hanndle.createHideInput = function (input_param) {
        let hidden_input_ele = new Emt('INPUT', 'type="hidden"').setPros({id: bootstrap_hanndle.getEleRandId('hide_input')});
        hidden_input_ele.apiHandle = {ele: {root: hidden_input_ele}};
        bootstrap_hanndle.__initInputEle(hidden_input_ele, input_param);
        return hidden_input_ele;
    }

    bootstrap_hanndle.createTextArea = function (input_param) {
        let textarea_ele = new Emt('textarea', 'rows="6"').setPros({id: bootstrap_hanndle.getEleRandId('textarea_input')});
        textarea_ele.apiHandle = {ele: {root: textarea_ele}};
        bootstrap_hanndle.__initInputEle(textarea_ele, input_param);
        return textarea_ele;
    };

    bootstrap_hanndle.createSelect = function (input_param) {
        let select_input_ele = new Emt('select').setPros({id: bootstrap_hanndle.getEleRandId('select_input')});
        if (input_param && input_param.items && typeof input_param.items.forEach === "function") {
            input_param.items.forEach(function (item) {
                select_input_ele.add(new Option(item.text, item.val));
            });
        }
        select_input_ele.apiHandle = {ele: {root: select_input_ele, options: []}};
        bootstrap_hanndle.__initInputEle(select_input_ele, input_param);
        select_input_ele.apiHandle.addItem = function (text, val) {
            let new_opt = new Option(text, val);
            select_input_ele.apiHandle.ele.options.push(new_opt);
            select_input_ele.add(new_opt);
        }
        select_input_ele.apiHandle.setItems = function (items) {
            select_input_ele.apiHandle.ele.options.forEach((old_opt) => {
                old_opt.remove();
            })
            select_input_ele.apiHandle.items = items;
            select_input_ele.apiHandle.items.forEach(function (item) {
                let new_opt = new Option(item.text, item.val);
                select_input_ele.apiHandle.ele.options.push(new_opt);
                select_input_ele.add(new_opt);
            })
        }

        select_input_ele.apiHandle.setRemoteItems = select_input_ele.apiHandle.__setRemoteItems;

        return select_input_ele;
    }


    bootstrap_hanndle.createMultipleSelect = function (input_param) {
        let select_input_ele = new Emt('select').setAttrs({multiple: 'multiple'}).setPros({id: bootstrap_hanndle.getEleRandId('select_input')});
        if (input_param && input_param.items && typeof input_param.items.forEach === "function") {
            input_param.items.forEach(function (item) {
                select_input_ele.add(new Option(item.text, item.val));
            });
        }
        select_input_ele.apiHandle = {ele: {root: select_input_ele, options: []}};
        bootstrap_hanndle.__initInputEle(select_input_ele, input_param);
        select_input_ele.apiHandle.addItem = function (text, val) {
            let new_opt = new Option(text, val);
            select_input_ele.apiHandle.ele.options.push(new_opt);
            select_input_ele.add(new_opt);
        }
        select_input_ele.apiHandle.setItems = function (items) {
            select_input_ele.apiHandle.ele.options.forEach((old_opt) => {
                old_opt.remove();
            })
            select_input_ele.apiHandle.items = items;
            select_input_ele.apiHandle.items.forEach(function (item) {
                let new_opt = new Option(item.text, item.val);
                select_input_ele.apiHandle.ele.options.push(new_opt);
                select_input_ele.add(new_opt);
            })
            select_input_ele.setAttrs({size: 1});
            return select_input_ele;
        }

        select_input_ele.apiHandle.getVal = function () {
            let vals = [];
            for (let i = 0; i < select_input_ele.options.length; i++) {
                if (select_input_ele.options[i].selected) {
                    vals.push(select_input_ele.options[i].value);
                }
            }
            return vals;
        }

        select_input_ele.apiHandle.__setVal = function (vals) {
            for (let i = 0; i < select_input_ele.options.length; i++) {
                if (vals.indexOf(select_input_ele.options[i].value) === -1) {
                    select_input_ele.options[i].selected = false;
                } else {
                    select_input_ele.options[i].selected = true;
                }
            }
        }

        select_input_ele.addEventListener('focus', function () {
            select_input_ele.setAttrs({size: select_input_ele.apiHandle.items.length});
        });
        select_input_ele.addEventListener('focusout', function () {
            select_input_ele.setAttrs({size: 1});
        });


        select_input_ele.apiHandle.setRemoteItems = select_input_ele.apiHandle.__setRemoteItems;


        return select_input_ele;
    }


    bootstrap_hanndle.createCheckBoxs = function (input_param) {
        let checkboxs_div = new Emt('div', 'class="xxxx"');

        checkboxs_div.apiHandle = {ele: {root: checkboxs_div}, checkboxs: []};

        checkboxs_div.apiHandle.setItems = function (items) {
            checkboxs_div.apiHandle.items = items;
            checkboxs_div.apiHandle.checkboxs = [];
            checkboxs_div.apiHandle.items.forEach(function (item) {
                let check_div = new Emt('div');
                let item_checkbox = new Emt('input', 'type="checkbox"', '', {dataVal: item.val, value: item.val});
                checkboxs_div.addNode(check_div.addNodes([
                    new Emt('label').addNodes([
                        item_checkbox,
                        new Emt('span', '', item.text)
                    ])
                ]));
                checkboxs_div.apiHandle.checkboxs.push(item_checkbox);
            });
        };
        checkboxs_div.apiHandle.setItems(input_param.items);

        checkboxs_div.apiHandle.val = {
            init: undefined
        };
        input_param.keepClass = true;
        bootstrap_hanndle.__initInputEle(checkboxs_div, input_param);

        checkboxs_div.apiHandle.getVal = function () {
            let vals = [];
            checkboxs_div.apiHandle.checkboxs.forEach(function (checkbox) {
                if (checkbox.checked === true) {
                    vals.push(checkbox.dataVal);
                }
            });
            return vals;
        }

        checkboxs_div.apiHandle.__setVal = function (array_val) {
            array_val = typeof array_val === "object" && typeof array_val.forEach === "function" ? array_val : [];
            checkboxs_div.apiHandle.checkboxs.forEach(function (checkbox) {
                console.log(checkbox.dataVal);
                if (array_val.indexOf(checkbox.dataVal) === -1) {
                    checkbox.checked = false;
                } else {
                    checkbox.checked = true;
                }
            });
            return checkboxs_div;
        }

        checkboxs_div.apiHandle.isChange = function () {
            return !(JSON.stringify(checkboxs_div.apiHandle.getInitVal()) === JSON.stringify(checkboxs_div.apiHandle.getVal()));
        }
        checkboxs_div.apiHandle.setRemoteItems = checkboxs_div.apiHandle.__setRemoteItems;

        return checkboxs_div;
    }

    bootstrap_hanndle.createFileInput = function (input_param) {
        let file_input = new Emt('input', 'type="file" ').setPros({id: bootstrap_hanndle.getEleRandId('btn_submit')});
        file_input.apiHandle = {ele: {root: file_input}};
        bootstrap_hanndle.__initInputEle(file_input, input_param);
        if (input_param && input_param.acceptFileTypes && typeof input_param.acceptFileTypes === 'function' && input_param.acceptFileTypes.length) {
            file_input.setAttribute('accept', input_param.acceptFileTypes.join(','));
        }
        //       new Emt('label').setAttrsByStr('class="sr-only" for="' + root_ele.apiHandle[handle_ele_key].id + '"', label),
        return file_input;
    }


    bootstrap_hanndle.createProcessDiv = function (input_param, label, handle_ele_key) {
        let process_inner_div = new Emt('div', ' class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:0%;"');
        let process_outer_div = new Emt('div').setPros({className: 'progress'}).addNodes([
            process_inner_div
        ]);
        process_outer_div.apiHandle = {ele: {root: process_outer_div}};

        process_outer_div.apiHandle.reset = function () {
            process_inner_div.style.width = '0%';
            return process_outer_div;
        }
        process_outer_div.apiHandle.setProcessPerNumber = function (int_num) {
            process_inner_div.style.width = int_num.toString() + '%';
            return process_outer_div;
        }

        return process_outer_div;
    }


    bootstrap_hanndle.preCreate = function () {
        let tmp = {param: {}, onCreate: false};
        tmp.setLabelText = function (labelText) {
            tmp.param.labelText = labelText;
            return tmp;
        }
        tmp.setContentText = function (contentText) {
            tmp.param.contentText = contentText;
            tmp.param.text = contentText;

            return tmp;
        }

        tmp.setPlaceHolder = function (placeHolder) {
            tmp.param.placeHolder = placeHolder;
            return tmp;
        }
        tmp.setNameVar = function (nameVar) {
            tmp.param.nameVar = nameVar;
            return tmp;
        }
        tmp.setIndexKey = function (indexKey) {
            tmp.param.indexKey = indexKey;
            return tmp;
        }
        tmp.setType = function (type) {
            tmp.param.type = type;
            return tmp;
        }
        tmp.setItems = function (items) {
            tmp.param.items = items;
            return tmp;
        }
        tmp.setOnCreate = function (fun) {
            tmp.onCreate = fun;
            return tmp;
        };
        tmp.setClickCall = function (fun) {
            tmp.param.clickCall = fun;
            return tmp;
        }
        tmp.create = function (type) {
            let tmp_ele = false;
            if (type === 'text') {
                tmp_ele = bootstrap_hanndle.createTextInput(tmp.param);
            } else if (type === 'number') {
                tmp_ele = bootstrap_hanndle.createNumberInput(tmp.param);
            } else if (type === 'select') {
                tmp_ele = bootstrap_hanndle.createSelect(tmp.param);
            } else if (type === 'button') {
                tmp_ele = bootstrap_hanndle.createButton(tmp.param);
            } else if (type === 'textarea') {
                tmp_ele = bootstrap_hanndle.createTextArea(tmp.param);
            } else if (type === 'hide') {
                tmp_ele = bootstrap_hanndle.createHideInput(tmp.param);
            } else if (type === 'checkbox_list') {
                tmp_ele = bootstrap_hanndle.createCheckBoxs(tmp.param);
            } else if (type === 'file') {
                tmp_ele = bootstrap_hanndle.createFileInput(tmp.param);
            } else if (type === 'text1') {
                tmp_ele = bootstrap_hanndle.createTextInput(tmp.param);
            }
            if (tmp.onCreate === false) {
                return tmp_ele;
            } else {
                return tmp.onCreate(tmp_ele, tmp.param);
            }
        }

        return tmp;
    }


    bootstrap_hanndle.createForm = function (form_input) {
        let form_ele = new Emt('FORM').setAttrsByStr('class="form-horizontal" role="form"', '').addNodes([]);
        form_ele.initConfig = form_input;
        form_ele.initConfig.dataNameTpl = form_input.dataNameTpl || 'name[$var]';
        form_ele.apiHandle = {
            ele: {
                root: form_ele,
                form: form_ele,
                group: {},//存放group 的
                input: {}
            }
        };


        form_ele.initInputEle = function (input_ele, ele_handle_index_key, input_name_key) {
            if (typeof ele_handle_index_key === 'string') {
                root_ele.apiHandle[ele_handle_index_key] = input_ele;
            }

            if (input_name_key) {
                input_ele.name = init_config.name_tpl.replace('$name_tpl', input_name_key);
            }
            return input_ele;
        }

        /**
         *
         * @param input_ele
         * <br> placeHolder
         * <br> labelText
         * <br> nameVar
         * <br> indexKey
         * @returns {*}
         * @private
         */
        form_ele.apiHandle.__appendGroupInput = function (input_ele, input_param) {
            let group_div = bootstrap_hanndle.createFormInputGroupDiv();
            group_div.apiHandle.addInputEle(input_ele);
            if (!(input_param.keepClass && input_param.keepClass === true)) {
                input_ele.classList.add("form-control");
            }

            if (input_param.placeHolder !== undefined) {
                input_ele.placeholder = input_param.placeHolder;
            }
            if (input_param.labelText) {
                group_div.apiHandle.setText(input_param.labelText);
            }
            if (input_param.nameVar) {
                input_ele.name = form_ele.initConfig.dataNameTpl.replace('$var', input_param.nameVar);
            }
            if (input_param.indexKey) {
                form_ele.apiHandle.ele.group[input_param.indexKey] = group_div;
                form_ele.apiHandle.ele.input[input_param.indexKey] = input_ele;
            }
            form_ele.addNodes([group_div]);
            return form_ele;
        }


        form_ele.apiHandle.addGroupPreCreate = function () {
            //let text_input = bootstrap_hanndle.createTextInput();
            let pre_create = bootstrap_hanndle.preCreate();
            pre_create.setOnCreate(function (input_ele, input_param) {
                return form_ele.apiHandle.__appendGroupInput(input_ele, input_param);
            });
            return pre_create;
        }
        /**
         *
         * @param input_ele
         * <br> placeHolder
         * <br> labelText
         * <br> nameVar
         * <br> indexKey
         * @returns {*}
         * @private
         */
        form_ele.apiHandle.addTextInput = function (input_param) {
            //let text_input = bootstrap_hanndle.createTextInput();
            return form_ele.apiHandle.__appendGroupInput(bootstrap_hanndle.createTextInput(input_param));
        }

        form_ele.apiHandle.addHideInput = function (input_param) {
            return form_ele.apiHandle.__appendGroupInput(bootstrap_hanndle.createHideInput(input_param));
        }

        form_ele.apiHandle.addNumberInput = function (input_param) {
            return form_ele.apiHandle.__appendGroupInput(bootstrap_hanndle.createNumberInput(input_param));
        }
        form_ele.apiHandle.addTextArea = function (input_param) {
            return form_ele.apiHandle.__appendGroupInput(bootstrap_hanndle.createTextArea(input_param));
        }
        form_ele.apiHandle.addSelect = function (input_param) {
            return form_ele.apiHandle.__appendGroupInput(bootstrap_hanndle.createSelect(input_param));
        }

        form_ele.apiHandle.addFileInput = function (input_param) {
            return form_ele.apiHandle.__appendGroupInput(bootstrap_hanndle.createFileInput(input_param));
        }

        form_ele.apiHandle.addCheckboxList = function (input_param) {

            let checkbox_list_div = bootstrap_hanndle.createCheckBoxs(input_param);
            let group_div = bootstrap_hanndle.createFormInputGroupDiv();
            group_div.apiHandle.addInputEle();
            checkbox_list_div.className.add("form-control");
            if (input_param.labelText) {
                group_div.apiHandle.setText(input_param.labelText);
            }
            if (input_param.nameVar) {
                input_ele.name = form_ele.initConfig.nameTpl.replace('$var', input_param.nameVar);
            }
            if (input_param.indexKey) {
                form_ele.apiHandle.ele.group[input_param.indexKey] = group_div;
                form_ele.apiHandle.ele.input[input_param.indexKey] = input_ele;
            }
            form_ele.addNodes([group_div]);
            return form_ele;
        }

        /**
         *
         * @param label
         * @param text
         * @param handle_ele_key
         * @param callback  接受俩参数  1:btn本身 2:form
         * @returns {{root_ele}}
         */
        form_ele.apiHandle.addSubmitButton = function (input_param) {
            let btn = new Emt('BUTTON', 'type="button" class="btn btn-default"  ', text).setPros({id: bootstrap_hanndle.getEleRandId('submit_btn')});
            if (input_param.callback && typeof input_param.callback === 'function') {
                btn.addEventListener('click', function () {
                    callback(this, form_ele);
                });
            }
            return form_ele.apiHandle.__appendGroupInput(btn, input_param);
        }


        return form_ele;
    }


    bootstrap_hanndle.createImg = function (init_configion) {
        let init_config = init_configion || {src: ''};
        let root_ele = new Emt('img').setPros({src: init_config.src || '', id: bootstrap_hanndle.getEleRandId('img')});
        let handle = {
            root_ele: root_ele,
        };
        handle.toggleClassName = function (class_name, type) {
            if (type) {
                if (type === 'add') {
                    root_ele.classList.add(class_name);
                } else {
                    root_ele.classList.remove(class_name);
                }
            } else {
                root_ele.classList.toggle(class_name);
            }
            return handle;
        }
        handle.toggleRounded = function (type) {
            return handle.toggleClassName('img-rounded', type);
        }
        handle.toggleCircle = function (type) {
            return handle.toggleClassName('img-circle', type);
        }
        handle.toggleThumbnail = function (type) {
            return handle.toggleClassName('img-thumbnail', type);
        }
        handle.toggleResponsive = function (type) {
            return handle.toggleClassName('img-responsive', type);
        }
        handle.getRootEle = function () {
            return root_ele;
        }

        root_ele.apiHandle = handle;
        return handle;
    }

    bootstrap_hanndle.createUploadGroupDiv = function (input_param) {
        let init_config = input_param || {
            upload: {
                url: '',
                params: {},
                notifyError: function (error_flag, msg) {
                },
                notifyOk: function () {

                }
            },
            onFileChanged: function (group_div) {

            },
            file: false
        };
        let upload_file_input = new Emt('input', 'type="file" ');
        let upload_process_div = bootstrap_hanndle.createProcessDiv().apiHandle.reset();
        let upload_msg = new Emt('p');

        let group_div = new Emt('div').addNodes([
            upload_file_input,
            upload_process_div,
            upload_msg
        ])
        group_div.apiHandle = {};
        upload_file_input.addEventListener('change', function () {
            console.log(upload_file_input.files[0]);
            group_div.apiHandle.file = upload_file_input.files[0];
            if (typeof init_config.onFileChanged === 'function') {
                init_config.onFileChanged(group_div);
            } else {
                group_div.apiHandle.uploadFile();
            }
        });
        group_div.apiHandle.setSourceFile = function (file) {
            group_div.apiHandle.file = file;
        }
        group_div.apiHandle.uploadFile = function () {
            if (group_div.apiHandle.file === false) {
                alert('错误调用');
                throw '错误调用';
            }
            let fd = new FormData();
            let param_list = [];
            kl.data2list(param_list, init_config.upload.params, 0, '');
            console.log(param_list);
            param_list.forEach((param) => {
                fd.append(param.key, param.val);
            });
            fd.append("file", group_div.apiHandle.file);


            let xhfUpload = new XMLHttpRequest();
            xhfUpload.timeout = (init_config.upload.timeout || 3600) * 1000;
            xhfUpload.addEventListener("load", function () {
                console.log(xhfUpload);

                let uploadRes = JSON.parse(xhfUpload.responseText);
                if (uploadRes.code && uploadRes.code == 'ok') {
                    console.log('文件上传成功', uploadRes);
                    upload_msg.textContent = '文件上传成功';
                    if (typeof init_config.upload.notifyOk === 'function') {
                        init_config.upload.notifyOk(uploadRes);
                    }
                } else {
                    console.log('上传失败', uploadRes);
                    upload_msg.textContent = '上传失败';
                    if (typeof init_config.upload.notifyError === 'function') {
                        init_config.upload.notifyError('upload_error', '上传失败');
                    }
                }
            }, false);


            xhfUpload.upload.addEventListener("progress", function (evt) {
                if (evt.lengthComputable) {
                    let per100number = parseInt(evt.loaded * 100 / evt.total).toString();
                    upload_msg.textContent = '上传进度:' + per100number + '%';
                    upload_process_div.apiHandle.setProcessPerNumber(per100number);
                }
            }, false);


            xhfUpload.addEventListener("error", function () {
                if (typeof init_config.upload.notifyError.notifyError === 'function') {
                    init_config.upload.notifyError.notifyError('error', '出错了');
                }
                upload_msg.textContent = '出错了';
            }, false);
            xhfUpload.addEventListener("abort", function () {
                if (typeof init_config.upload.notifyError.notifyError === 'function') {
                    init_config.upload.notifyError.notifyError('abort', '中断了');
                }
                upload_msg.textContent = '中断了';

            }, false);

            xhfUpload.open("POST", init_config.upload.url);
            xhfUpload.setRequestHeader("X-Requested-With", "XMLHttpRequest");

            xhfUpload.send(fd);
        };
        group_div.apiHandle.addEventOnFileChanged = function (fun) {
            init_config.onFileChanged = fun;
        }
        group_div.apiHandle.addEventUploadError = function (fun) {
            init_config.upload.notifyError = fun;
        }
        group_div.apiHandle.addEventUploadOk = function (fun) {
            init_config.upload.notifyOk = fun;
        }
        return group_div;

    }

    bootstrap_hanndle.createSelect2 = function (opt) {
        let root_ele = new Emt('select').setAttrsByStr('', '').setPros();
        let handle_this = {root_ele: root_ele, is_changed: false, old_val: false};
        handle_this.setMultiple = function (is_yes) {
            if (!is_yes) {
                root_ele.removeAttribute('multiple');
            } else {
                root_ele.setAttribute('multiple', 'multiple');
            }
            return handle_this;
        };

        handle_this.addItem = function (label, val, is_default) {
            let item = new Option(label, val);
            item.is_default = is_default || false;
            root_ele.add(item);
            return handle_this;
        };
        handle_this.addItem('不选择', '#####');
        handle_this.clearItems = function () {
            let len = root_ele.options.length
            if (root_ele.options[0].is_default === true) {
                for (let i = 1; i < len; i++) {
                    root_ele.options[1].remove(i);
                }
            } else {
                for (let i = 0; i < len; i++) {
                    root_ele.options[1].remove(i);
                }
            }
            return handle_this;
        };
        //可以是[string]，也可以是[{label:xx,val:xx}]
        handle_this.reloadDatas = function (list) {
            if (typeof list.forEach === 'function') {
                list.forEach(function (item) {
                    if (typeof item === 'string') {
                        handle_this.addItem(item, item);
                    } else {
                        handle_this.addItem(item.label, item.val);
                    }
                });
            } else {
                for (let tmp_key in list) {
                    handle_this.addItem(list[tmp_key], tmp_key);
                }
            }
            return handle_this;
        };
        if (opt && opt.list) {
            handle_this.reloadDatas(opt.list);
        }

        handle_this.getValue = function () {
            if (root_ele.multiple) {
                let vals = [];
                for (let i = 0; i < root_ele.options.length; i++) {
                    if (!root_ele.options[i].is_default && root_ele.options[i].selected) {
                        vals.push(root_ele.options[i].value);
                    }
                }
                return vals;
            } else {
                return root_ele.value;
            }
        };

        handle_this.loadVal = function (val) {
            if (root_ele.multiple) {
                let vals = (typeof val.forEach === 'function') ? val.map(function (v) {
                    return v.toString();
                }) : [val.toString()];
                for (let i = 0; i < root_ele.options.length; i++) {
                    if (vals.indexOf(root_ele.options[i].value) === -1) {
                        root_ele.options[i].selected = false;
                    } else {
                        root_ele.options[i].selected = true;
                    }
                }
            } else {
                root_ele.value = val;
            }
            return handle_this;
        };
        handle_this.setNewVal = function (val) {
            handle_this.old_val = val;
            handle_this.is_changed = false;
            handle_this.loadVal(val);
            return handle_this;
        }
        handle_this.isOldVal = function () {
            kl.log('select change', handle_this.old_val, handle_this.getValue(), handle_this.old_val === handle_this.getValue());
            return handle_this.old_val === handle_this.getValue();
        }
        handle_this.isValChanged = function () {
            return handle_this.is_changed;
        }
        //这个是给 datagrid filter elements 用的=
        handle_this.getFilterValue = function () {
            return handle_this.getValue();
        }
        root_ele.addEventListener('change', function () {
            kl.log('select change');
            handle_this.is_changed = true;
        })


        for (var i in handle_this) {
            if (typeof handle_this[i] === 'function') {
                handle_this.root_ele[i] = handle_this[i];
            }
        }

        return handle_this;
    };

    bootstrap_hanndle.createYesOrNo = function (opt) {
        let option_name = bootstrap_hanndle.getEleRandId('hammer_input_option');

        let yes_ele = new Emt('INPUT', 'type="radio" value="1" class="hammer_input_option" ', '', {name: option_name});
        let no_ele = new Emt('INPUT', 'type="radio" value="2" class="hammer_input_option"', '', {name: option_name});
        let hide_ele = new Emt('input', 'type="hidden"');
        let root_ele = new Emt('DIV').addNodes([
            hide_ele,
            new Emt('LABEL').addNodes([
                yes_ele, new Emt('span', '', '是')
            ]),
            new Emt('LABEL').addNodes([
                no_ele, new Emt('span', '', '否')
            ])
        ]);
        let handle_this = {root_ele: root_ele, yes_ele: yes_ele, no_ele: no_ele, hide_ele: hide_ele};
        root_ele.is_changed = false;

        let updateSelectedVal = function () {
            if (yes_ele.checked === true) {
                hide_ele.value = yes_ele.value;
            } else if (no_ele.checked === true) {
                hide_ele.value = no_ele.value;
            } else {
                return false;
            }
        }

        yes_ele.addEventListener('change', function () {
            root_ele.is_changed = true;
            updateSelectedVal();
        })
        no_ele.addEventListener('change', function () {
            root_ele.is_changed = true;
            updateSelectedVal();
        })


        //注意， 如果为null的情况  ele.value!==ele.old_val
        handle_this.isValChanged = function () {
            return root_ele.is_changed;
        }
        //注意,这个不准， 如果为null的情况  ele.value!==ele.old_val
        handle_this.isOldVal = function () {
            return root_ele.old_val === hide_ele.value;
        }
        handle_this.getValue = function () {
            return hide_ele.value;
        }

        //可以是[string]，也可以是[{label:xx,val:xx}]
        handle_this.setNewVal = function (sta_val) {
            let tmp_val = parseInt(sta_val);
            if (tmp_val === 1) {
                yes_ele.click();
            } else {
                no_ele.click();
            }

            //root_ele.value = sta_val;
            root_ele.old_val = sta_val;//注意， 如果为null的情况  ele.value!==ele.old_val
            root_ele.is_changed = false;

            return handle_this;
        };
        if (opt && opt.val) {
            handle_this.setNewVal(opt.val);
        }
        handle_this.root_ele.getValue = handle_this.getValue;
        handle_this.root_ele.setNewVal = handle_this.setNewVal;
        handle_this.root_ele.isValChanged = handle_this.isValChanged;
        handle_this.root_ele.isOldVal = handle_this.isOldVal;


        handle_this.getValue = function () {
            return hide_ele.value;
        };
        return handle_this;
    };

    let addStyle = function () {
        if (!kl.id('hammer-bootstarp-style')) {
            document.body.append(
                new Emt('style').setAttrsByStr(
                    'id="hammer-bootstarp-style"',
                    ('    .hide_btn_sort_asc > .btn_sort_asc {\n' +
                        '        display: none;\n' +
                        '    }\n' +
                        '\n' +
                        '    .hide_btn_sort_desc > .btn_sort_desc {\n' +
                        '        display: none;\n' +
                        '    }\n' +
                        '\n' +
                        '    .hide_btn_sort > .btn_sort_asc, .hide_btn_sort > .btn_sort_desc {\n' +
                        '        display: none;\n' +
                        '    }\n' +
                        '\n' +
                        '    .hammer_input_option {\n' +
                        '        display: none;\n' +
                        '    }' +
                        '    input[class="hammer_input_option"] + span {\n' +
                        '        background: #FFF;\n' +
                        '        color: #000;\n' +
                        '    }\n' +
                        '\n' +
                        '    input[class="hammer_input_option"]:checked + span {\n' +
                        '        background: #000;\n' +
                        '        color: #FFF;\n' +
                        '    }'
                    )
                )
            )

        }
    }
    addStyle();

    return bootstrap_hanndle;
}