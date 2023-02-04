let hammerInput = function (init_config) {
    console.log(init_config.path + '->' + init_config.key + '->' + 'hammerInput', init_config);

    if (init_config === undefined || init_config.inputType === undefined) {
        throw  'input_type_undefined'
    }
    let input_type = init_config.inputType;
    let bi_input = this;
    let input_ele = new Emt('input', 'type="input"');
    bi_input.getVal = function () {
        //console.log('default getVal', input_ele, input_ele.value, init_config);
        return input_ele.value;
    };
    bi_input.setVal = function (db_val) {
        console.log('setVal', db_val);
        input_ele.value = db_val;
    };
    bi_input.addSelectItems = function (list) {
        list.forEach(function (item_info) {
            input_ele.add(new Option(item_info.text, item_info.val));
        })
    };
    if (['bi_number', 'number', 'bi_amount'].indexOf(input_type) > -1) {
        input_ele = new Emt('input', 'type="number"');
        if (input_type === 'bi_number') {
            bi_input.getVal = function () {
                let ar = input_ele.value.split('.');
                let pow = 0;
                if (ar.length === 2) {
                    pow = ar[1].length;
                }
                let number = input_ele.value * Math.pow(10, pow);
                if (number.toString().indexOf('.') > 0) {
                    alert('浮点类型转化结果异常:' + number + ',请尝试补0或者去0');
                    throw '错误值，不能使用';
                }
                return [number, pow];
            };
            bi_input.setVal = function (db_val) {
                console.log('setVal', db_val);
                input_ele.value = db_val[0] / Math.pow(10, Math.abs(db_val[1]));
            };
        } else if (input_type === 'bi_amount') {
            bi_input.getVal = function () {
                let number = input_ele.value * Math.pow(10, 8);
                if (number.toString().indexOf('.') > 0) {
                    alert('浮点类型转化结果异常:' + number + ',请尝试补0或者去0');
                    throw '错误值，不能使用';
                }
                return [number, 8];
            };
            bi_input.setVal = function (db_val) {
                console.log('setVal', db_val);
                input_ele.value = db_val[0] / Math.pow(10, 8);

            };
        } else {
            bi_input.getVal = function () {
                let n = parseInt(input_ele.value);
                return isNaN(n) ? 0 : n;
            };
        }
    } else if (['bi_item', 'select', 'date_unit'].indexOf(input_type) > -1) {
        input_ele = new Emt('select');
        if (input_type === 'bi_item' && window.bi_items) {
            window.bi_items.forEach((bi_item) => {
                input_ele.add(new Option(bi_item.item_name, bi_item.item_flag));
            });
        } else if (input_type === 'date_unit') {
            input_ele.add(new Option('年', 'Y'));
            input_ele.add(new Option('月', 'm'));
            input_ele.add(new Option('日', 'd'));
            input_ele.add(new Option('时', 'H'));
            input_ele.add(new Option('分', 'i'));
            input_ele.add(new Option('秒', 's'));

        } else {
            if (init_config && init_config.vals) {
                bi_input.addSelectItems(init_config.vals);
            }
        }

    } else if (['bool'].indexOf(input_type) > -1) {
        input_ele = new Emt('input', 'type="checkbox"');
        bi_input.getVal = function () {
            return input_ele.checked;
        };
        bi_input.setVal = function (db_val) {
            console.log('setVal', db_val);
            if (typeof db_val === "object") throw  1;
            input_ele.checked = db_val;
        };
    } else if (['textarea'].indexOf(input_type) > -1) {
        input_ele = new Emt('textarea');
        bi_input.getVal = function () {
            return input_ele.value;
        };
    } else {
        input_ele = new Emt('input', 'type="input"');
        bi_input.getVal = function () {
            if (input_ele.type === 'number') {
                let n = parseInt(input_ele.val);
                return isNaN(n) ? 0 : n;
            } else {
                return input_ele.value;
            }
        };
    }

    bi_input.getInputEle = function () {
        return input_ele;
    };
    input_ele.apiHandle = bi_input;
    input_ele.addEventListener('change', function () {
        init_config.onChanged(input_ele);
    });
    return input_ele;
};


let structObject = function (input_param, db_val) {
    console.log(input_param.path + '->' + 'INIT structObject', {input_param: input_param, db_val: db_val});
    let bi_object = this;
    bi_object.attrsDiv = new Emt('div', 'class="bi_row_attrs"');
    bi_object.opt = {
        path: input_param.path + '{}',
        must: input_param.must === undefined ? true : input_param.must,
        attrs: input_param.attrs || [],
        onChanged: function (input_ele) {
            console.log({bi_row: bi_object, object_ele: bi_object.attrsDiv, input_ele: input_ele, input_param: input_param, db_val: db_val});
            console.log('input_ele.getVal', input_ele.apiHandle.getVal());
            input_param.onChanged(bi_object.attrsDiv);
        }
    };

    bi_object.attrsDiv.apiHandle = bi_object;
    bi_object.attrElementList = [];
    bi_object.attrElementMap = {};

    if (typeof bi_object.opt.attrs !== "object" || typeof bi_object.opt.attrs.forEach !== "function" || bi_object.opt.attrs.length === 0) {
        throw  'attrs 不是 数组或者 正常数组';
    }
    console.log(bi_object.opt.path + ': foreach attrs ==>');
    bi_object.opt.attrs.forEach(function (attr_config) {
        attr_config.path = bi_object.opt.path;
        console.log(attr_config.path + ': foreach attrs ===> attr:' + attr_config.key + ' ', {attr_config: attr_config, db_val: db_val});
        let tmp_elementTplConfig = attr_config;
        tmp_elementTplConfig.onChanged = bi_object.opt.onChanged;
        let tmp_ele = new biRow(tmp_elementTplConfig, db_val && db_val[attr_config.key] ? db_val[attr_config.key] : undefined);
        bi_object.attrElementList.push(tmp_ele);
        bi_object.attrsDiv.addNode(tmp_ele);
        bi_object.attrElementMap[attr_config.key] = tmp_ele;
    });

    bi_object.getVal = function () {
        let obj = {};
        bi_object.opt.attrs.forEach(function (attr_config) {
            //console.log({attr_config: attr_config, tmp_ele: bi_object.attrElementMap[attr_config.key].apiHandle});
            obj[attr_config.key] = bi_object.attrElementMap[attr_config.key].apiHandle.getVal();
        });
        return obj;
    };

    bi_object.setVal = function (db_val) {
        bi_object.opt.attrs.forEach(function (attr_config) {
            console.log({attr_config: attr_config, tmp_ele: bi_object.attrElementMap[attr_config.key].apiHandle});
            bi_object.attrElementMap[attr_config.key].apiHandle.setVal(db_val[attr_config.key]);
        });
        return bi_object;
    };
    return bi_object.attrsDiv;
};


let structArray = function (input_param, db_val) {
    console.log(input_param.path + '[]->' + 'INIT　structArray', {input_param: input_param, db_val: db_val});

    let bi_array = this;
    bi_array.elementsDiv = new Emt('div', 'class="bi_row_elements"');
    bi_array.opt = {
        path: input_param.path + '[]',
        must: input_param.must === undefined ? true : input_param.must,
        elementStruct: input_param.elementStruct === undefined ? false : input_param.elementStruct,
        onChanged: function (input_ele) {
            console.log({bi_row: bi_array, array_ele: bi_array.elementsDiv, input_ele: input_ele, input_param: input_param, db_val: db_val});
            console.log('input_ele.getVal', input_ele.apiHandle.getVal());
            input_param.onChanged(bi_array.elementsDiv);
        }
    };
    console.log(input_param.path + '[]->' + 'structArray opt', bi_array);


    bi_array.elementsDiv.apiHandle = bi_array;
    bi_array.arrayElementList = [];
    bi_array.addInputElement = function (bi_input_element) {
        console.log({bi_input_element: bi_input_element});
        let div = new Emt('div', 'class="bi_row_element"');
        let btn = new Emt('input', 'type="checkbox"', '', {checked: true});
        div.addNodes([
            new Emt('label', '', '勾选').addNode(btn),
            bi_input_element
        ]);
        bi_input_element.isOkElement = btn;
        btn.addEventListener('change', function () {
            input_param.onChanged(bi_array.elementsDiv);
        });
        bi_array.arrayElementList.push(bi_input_element);
        bi_array.elementsDiv.addNode(div);
        return div;
    };
    bi_array.addElementEle = function (element_db_val) {
        bi_array.opt.elementStruct.path = bi_array.opt.path + '->[' + bi_array.arrayElementList.length + ']';

        if (bi_array.opt.elementStruct.input_type === 'object') {
            let tmp_config = bi_array.opt.elementStruct;
            tmp_config.inputType = 'object';
            tmp_config.onChanged = bi_array.opt.onChanged;
            console.log(bi_array.opt.path + '->' + 'bi_array.addElementEle: will create structObject ', {config: tmp_config, element_db_val: element_db_val});
            let tmp_bi_object = new structObject(tmp_config, element_db_val);
            bi_array.addInputElement(tmp_bi_object);
            return tmp_bi_object;
        } else if (bi_array.opt.elementStruct.input_type === 'array') {
            let tmp_config = bi_array.opt.elementStruct;
            tmp_config.inputType = 'array';
            tmp_config.onChanged = bi_array.opt.onChanged;
            console.log(bi_array.opt.path + '->' + 'bi_array.addElementEle： will create structArray ', {config: tmp_config, element_db_val: element_db_val});
            let tmp_bi_array = new structArray(tmp_config, element_db_val);
            bi_array.addInputElement(tmp_bi_array);
            return tmp_bi_array;
        } else {
            let tmp_config = bi_array.opt.elementStruct;
            tmp_config.onChanged = bi_array.opt.onChanged;
            tmp_config.inputType = bi_array.opt.elementStruct.input_type;
            console.log(bi_array.opt, tmp_config);
            console.log(bi_array.opt.path + '->' + 'bi_array.addElementEle:  will create hammerInput ', {config: tmp_config, element_db_val: element_db_val});
            let tmp_bi_input = new hammerInput(tmp_config, element_db_val);
            bi_array.addInputElement(tmp_bi_input);
            return tmp_bi_input;
        }
    };
    bi_array.addElementBtn = new Emt('button', 'type="button"', '添加子项');
    bi_array.elementsDiv.addNode(new Emt('div', 'class="bi_row_title"').addNode(bi_array.addElementBtn));
    bi_array.addElementBtn.addEventListener('click', function () {
        bi_array.addElementEle();
        input_param.onChanged(bi_array.elementsDiv);
    });
    if (db_val) {
        console.log(input_param.path + '[]->' + 'db_val.forEach.addElementEle', {bi_array: bi_array, key: bi_array.opt.key, db_val: db_val});
        db_val.forEach(function (element_data) {
            let tmp_bi_input = bi_array.addElementEle(element_data);
            tmp_bi_input.apiHandle.setVal(element_data);
        });
    }


    bi_array.getVal = function () {
        let arr = [];
        bi_array.arrayElementList.forEach(function (arrayElement) {
            if (arrayElement.isOkElement.checked) {
                arr.push(arrayElement.apiHandle.getVal());
            }
        });
        return arr;
    };

    bi_array.setVal = function (db_val) {
        console.log(' bi_array.setVal 不应该被调用', db_val);
        return bi_array;
    };
    return bi_array.elementsDiv;
};

let biRow = function (input_param, db_val) {
    console.log(input_param.path + '->' + input_param.key + '->' + ' INIT biRow', {input_param: input_param, db_val: db_val});
    let bi_row = this;
    let row_ele = new Emt('div', 'class="bi_row"');

    bi_row.opt = {
        path: input_param.path + '->' + input_param.key + '(biRow)',
        key: input_param.key,
        title: input_param.title,
        inputType: input_param.input_type,
        must: input_param.must === undefined ? true : input_param.must,
        vals: input_param.must === undefined ? false : input_param.vals,
        default: input_param.default === undefined ? false : input_param.default,
        subs: input_param.default === undefined ? false : input_param.default,
        elementStruct: input_param.element_struct === undefined ? false : input_param.element_struct,
        attrs: input_param.attrs || [],
        onChanged: function (input_ele) {
            console.log({bi_row: bi_row, row_ele: row_ele, input_ele: input_ele, input_param: input_param, db_val: db_val});
            console.log('input_ele.getVal', input_ele.apiHandle.getVal());
            input_param.onChanged(row_ele);
        }
    };

    let label = new Emt('label', '', bi_row.opt.title);

    bi_row.inputLabelDiv = new Emt('div', 'class="bi_row_label"');
    bi_row.inputDiv = new Emt('div', 'class="bi_row_input"');
    row_ele.addNodes([
        bi_row.inputDiv.addNode(
            bi_row.inputLabelDiv.addNode(
                label
            )
        )
    ]);


    bi_row.labelEle = label;
    bi_row.addElementBtn = false;
    bi_row.arrayElementsDiv = false;
    bi_row.inputEle = false;


    bi_row.arrayElementList = [];//input type 为 array
    bi_row.attrElementList = [];
    bi_row.attrElementMap = {};


    bi_row.setVal = function (db_val) {
        console.log('setVal', db_val);
        alert('set val有毛病,未被覆盖');
        throw  '有毛病';
    };
    bi_row.getVal = function () {
        console.log('setVal', db_val);
        alert('get val有毛病，未被覆盖');
        throw  '有毛病';
    };

    if (bi_row.opt.inputType === 'array') {
        bi_row.opt.array_index = 'root';
        bi_row.inputEle = new structArray(bi_row.opt, db_val);
        bi_row.inputEle.apiHandle.setVal(db_val);
        row_ele.firstElementChild.addNode(bi_row.inputEle);
        bi_row.getVal = function () {
            return bi_row.inputEle.apiHandle.getVal();
        };
        bi_row.setVal = function (val) {
            bi_row.inputEle.apiHandle.setVal(val);
            return bi_row;
        };

    } else if (bi_row.opt.inputType === 'object') {
        bi_row.inputEle = new structObject(bi_row.opt, db_val);
        bi_row.inputEle.apiHandle.setVal(db_val);
        row_ele.firstElementChild.addNode(bi_row.inputEle);
        bi_row.getVal = function () {
            return bi_row.inputEle.apiHandle.getVal();
        };
        bi_row.setVal = function (val) {
            bi_row.inputEle.apiHandle.setVal(val);
            return bi_row;
        };
    } else {
        bi_row.inputEle = new hammerInput(bi_row.opt, db_val);
        if (db_val !== undefined) {
            bi_row.inputEle.apiHandle.setVal(db_val);
        }

        row_ele.firstElementChild.addNode(bi_row.inputEle);
        bi_row.getVal = function () {
            return bi_row.inputEle.apiHandle.getVal();
        };
        bi_row.setVal = function (val) {
            bi_row.inputEle.apiHandle.setVal(val);
            return bi_row;
        };
        bi_row.setVal(bi_row.opt.default);
    }


    row_ele.apiHandle = bi_row;
    return row_ele;

};


let hammerStruct = function (struct_data, db_data, callFunction) {
    let struct_div = new Emt('div', 'class="bi_struct"');
    let struct_json = JSON.stringify(struct_data);
    console.log("\nstruct:\n\n\n" + struct_json + "\n\n\n", struct_data);
    let bi_row = new biRow({
        input_type: 'object',
        title: '根',
        attrs: struct_data.struct,
        key: 'root',
        path: '#',
        onChanged: function (input_ele) {
            console.log('hammerStruct', {input_ele: input_ele});
            let val = input_ele.apiHandle.getVal();
            val.struct_code = struct_data.struct_code;
            console.log('hammerStruct input_ele.getVal', val, console.log(JSON.stringify(val, null, 4)));
            console.log("\nval:\n\n\n" + JSON.stringify(val) + "\n\n\n");
            console.log("\nstruct:\n\n\n" + struct_json + "\n\n\n");
            if (typeof callFunction === "function") {
                callFunction(val);
            }
        }
    }, db_data);
    struct_div.addNode(
        bi_row
    );
    return struct_div;
};