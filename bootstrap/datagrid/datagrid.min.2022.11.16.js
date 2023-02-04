/**
 *
 * @param input_opt  {
 * csrf:'string',
 * title:'title',
 * }
 * @returns {{hide: hide, show: show}}
 */
let hammerBootstarpDatagrid = function (input_opt) {
    let dataGrid = {
        __doc: {
            ele: '将网格 填到哪个地方',
            title: '网格标题',
            requestDataFun: 'fun,里面根据 本handle提供的信息 进行请求 指定数据  ，参数:  1.事件(filter变动事件/点击跳页/点击排序/点击goto按钮)，   2.{filter_data:{},page:{},sort:{}  } 3:回调函数，这个由本handle提供的 dataGrid.api.reloadDataRows，实现代码负责回调，用于更新数据',
            initSearchCondtion: '预设查询条件',
        },
        set: {
            dstDivElement: false,
            requestDataRowsFunction: false,
        },
        api: {
            funs: [],
            // reloadDataRows: false,
            //  requestData: false,
            //getRequestParam: false,jquery.js
        },
        ele: {
            inputMap: {}
        },
        param: {
            attr: {},
            page: {
                index: 1,
                size: 20,
            },
            sort: {id: 'desc'}
        },
        inputParam: {
            attr: {},
            page: {
                index: 1,
                size: 20,
            },
            sort: {id: 'desc'}
        },
        column: {
            keys: [],
            renderFunMap: {},
            handle: {map: {}, list: [], unInitList: []},
            sortButton: {map: {}, list: []}
        },
        dataTrs: []
    };
    for (var k in dataGrid.__doc) {
        if (typeof input_opt[k] !== 'undefined') {
            dataGrid[k] = input_opt[k];
        }
    }


    //tableTpart
    dataGrid.ele.Table = new Emt('table', 'class="table table-bordered table-striped table-hover"');
    dataGrid.ele.THead = dataGrid.ele.Table.createTHead();
    dataGrid.ele.TBody = dataGrid.ele.Table.createTBody();
    dataGrid.ele.TFoot = dataGrid.ele.Table.createTFoot();
    dataGrid.ele.TCaption = dataGrid.ele.Table.createCaption();

    let sortKey_hideInput = new Emt('input').setPros({type: 'hidden'});
    let sortType_hideInput = new Emt('input').setPros({type: 'hidden'});
    let pageIndex_hideInput = new Emt('input').setPros({type: 'hidden', value: 1});
    let pageSize_hideInput = new Emt('input').setPros({type: 'hidden', value: dataGrid.page_size || 20});

    dataGrid.ele.submitBtn = new Emt('button').setPros({className: 'btn btn-default', textContent: '=>'});


    dataGrid.addTr = function (tableTpart, rowAttrs) {
        let new_tr = tableTpart.insertRow();
        new_tr.apiHandle = {
            td: {map: {}, list: []}
        };
        if (typeof rowAttrs === 'object') {
            for (var attrKey in rowAttrs) {
                new_tr[attrKey] = rowAttrs[attrKey];
            }
        }
        new_tr.addTd = function (cellIndexKey, cellAttrs) {
            let new_td = new_tr.insertCell();
            new_tr.apiHandle.td.list.push(new_td);
            if (typeof cellIndexKey === 'string') {
                new_tr.apiHandle.td.map[cellIndexKey] = new_td;
            }
            if (typeof cellAttrs === 'object') {
                for (var attr in cellAttrs) {
                    new_td[attr] = cellAttrs[attr];
                }
            }
            new_td.addNodes = function (nodes) {
                nodes.forEach((td_node) => {
                    new_td.appendChild(td_node);
                });
                return new_td;
            };

            return new_td;
        }
        return new_tr;
    }


    dataGrid.topTr = dataGrid.addTr(dataGrid.ele.THead);
    dataGrid.titleTr = dataGrid.addTr(dataGrid.ele.THead);
    dataGrid.filterTr = dataGrid.addTr(dataGrid.ele.THead);
    dataGrid.footTr = dataGrid.addTr(dataGrid.ele.TFoot);


    if (dataGrid.initSearchCondtion && dataGrid.initSearchCondtion.sort && dataGrid.initSearchCondtion.sort.key && dataGrid.initSearchCondtion.sort.type) {
        sortKey_hideInput.value = dataGrid.initSearchCondtion.sort.key;
        sortType_hideInput.value = dataGrid.initSearchCondtion.sort.type;
    }

    if (dataGrid.initSearchCondtion && dataGrid.initSearchCondtion.page && dataGrid.initSearchCondtion.page.size && dataGrid.initSearchCondtion.page.index) {
        pageIndex_hideInput.value = dataGrid.initSearchCondtion.page.index;
        pageSize_hideInput.value = dataGrid.initSearchCondtion.page.size;
    }


    dataGrid.topTr.addTd('goto_submit').addNodes([
        dataGrid.ele.submitBtn,
        sortKey_hideInput,
        sortType_hideInput,
    ]);

    dataGrid.footTr.addTd('page').addNodes([
        pageIndex_hideInput,
        pageSize_hideInput
    ]);


    dataGrid.filter_eles = {keys: [], ele_map: {}, btns: []};

    /**
     * 设置目标目标元素,在哪个地方插入data grid主体
     * @param dstDivElement
     */
    dataGrid.api.setDstDivElement = (dstDivElement) => {
        dataGrid.set.dstDivElement = dstDivElement;
        return dataGrid;
    }
    /**
     * 设置 获取数据函数   参数: event_type  requestParam  reloadDataRowsFunction
     *
     * @param fun
     */
    dataGrid.api.setRequestDataRowsFunction = (fun) => {
        dataGrid.set.requestDataRowsFunction = fun;
        return dataGrid;
    }

    /**
     * 执行/展示  datagrid
     */
    dataGrid.api.run = () => {
        dataGrid.column.handle.unInitList.forEach((columnHandle) => {
            columnHandle.initColumn();
        })
        dataGrid.set.dstDivElement.appendChild(new Emt('div', 'class="table-responsive" ').addNodes([dataGrid.ele.Table]));
        return dataGrid;
    }

    /**
     * 对外开放 ，获取 页面参数
     * @returns {{filter: {}, sort: {type, key: *}, page: {size, index}}}
     */
    dataGrid.api.getRequestParam = () => {
        let requestParam = {
            sort: {key: sortKey_hideInput.value, type: sortType_hideInput.value},
            page: {size: pageSize_hideInput.value, index: pageIndex_hideInput.value},
            filter: {}
        };
        dataGrid.column.keys.forEach(function (column_key) {
            let tmp_val = dataGrid.column.handle.map[column_key].getFilterInputValue();
            if (tmp_val === undefined || tmp_val === '#') return false;
            requestParam.filter[column_key] = tmp_val;
        });
        console.log('datagrid.getRequestParam', requestParam);

        return requestParam;
    }
    dataGrid.api.requestData = function (event_type) {
        console.log('event_type', event_type);
        dataGrid.set.requestDataRowsFunction(event_type, dataGrid);
    }

    dataGrid.api.gotPage = function () {
        dataGrid.api.requestData('page');
    }
    dataGrid.resortFun = function (btn_ele) {
        dataGrid.api.requestData('sort');
    }
    dataGrid.filterChange = function (btn_ele) {
        dataGrid.api.requestData('filter');
    }

    dataGrid.ele.submitBtn.addEventListener('click', function () {
        dataGrid.api.requestData('goto');
    })


    /**
     * filterInputElement/filter_ele 必须是本类创建的，不然有些东西怕是监听不到，但是有些列的filter是没必要的，填string 也可以是的
     * -- filterInputPlacehoderString 占位符
     * title/label 就是 column中文名
     * column_name/column_key 行数据的 列 字段, 用来存放操作按钮的列，也得起个名字
     * isSortable/is_sortable true:可怕徐
     * cellRenderFunction/data_cell_function(td_cell,row_data) 针对数据行的，操作行还有其他东西进行填充，但是数据行就得调相应得方法了，必须接受 单元格(cell) 和 行数据(row_data)作为参数
     */
    dataGrid.api.preCreateColumn = function (columnKey) {
        let columnHandle = {
            columnKey: columnKey,
            isSortable: false,
            headerText: false,
            columnInfo: false,
            freeFilterInput: false,//独立自定义的 过滤输入, free 优先级 高于 fixed, free存在的情况下 fixed 为 readonly
            fixedFilterInput: false,//固定的 过滤输入
            fixedFilterInputConfig: {
                inputType: 'text',
                valueItems: [],
            },
            renderFun: () => {
                alert('renderFunction 未初始化:' + columnKey);
            },
            hasRenderFunction: false,
            sortButton: false,
        };
        columnHandle.setHeaderText = (text) => {
            columnHandle.headerText = text;
            return columnHandle;
        };
        columnHandle.setSortable = (isSortable) => {
            columnHandle.isSortable = isSortable;
            return columnHandle;
        };
        columnHandle.setColumnInfo = (columnInfo) => {
            columnHandle.columnInfo = columnInfo;
            return columnHandle;
        };

        columnHandle.setFreeFilterInput = (freeFilterInput) => {
            columnHandle.freeFilterInput = freeFilterInput;
            return columnHandle;
        };
        columnHandle.setFixedFilterInputConfig = (fixedFilterInputConfig) => {
            // columnHandle.fixedFilterInput.inputType = fixedFilterInputConfig.inputType || 'text';
            if (fixedFilterInputConfig.valueItems.length === 0) {
                columnHandle.fixedFilterInput = new Emt('input', 'type="text"');
            } else {
                columnHandle.fixedFilterInput = new Emt('select');
                columnHandle.fixedFilterInput.add(new Option('不选', '#'));
                fixedFilterInputConfig.valueItems.forEach((item) => {
                    columnHandle.fixedFilterInput.add(new Option(item.text, item.val));
                })
            }
            columnHandle.fixedFilterInput.valueItems = fixedFilterInputConfig.valueItems || [];

            return columnHandle;
        };


        columnHandle.setRenderFunction = (fun) => {
            columnHandle.renderFun = fun;
            columnHandle.hasRenderFunction = true;
            return columnHandle;
        };

        columnHandle.getFilterInputValue = () => {
           // console.log(columnHandle, columnHandle.freeFilterInput, columnHandle.fixedFilterInput);
            if (columnHandle.freeFilterInput === false) {
                if (columnHandle.fixedFilterInput === false) {
                    return undefined;
                } else {
                    return columnHandle.fixedFilterInput.value;
                }
            } else {
                return columnHandle.freeFilterInput.apiHandle.getVal();
            }
        };

        columnHandle.initColumn = () => {
            if (columnHandle.isInited === undefined) {
                columnHandle.isInited = true;
            } else {
                throw  '已经初始化了';
            }
            if (dataGrid.column.keys.indexOf(columnHandle.columnKey) !== -1) {
                throw  'columnKey 已经初始化了:' + columnHandle.columnKey;
            }

            //排序按钮
            if (columnHandle.isSortable === true) {
                columnHandle.sortButton = dataGrid.createSortButton(columnHandle.headerText, columnHandle.columnKey);
                dataGrid.column.sortButton.list.push(columnHandle.sortButton);
                dataGrid.column.sortButton.map[columnHandle.columnKey] = columnHandle.sortButton;
            } else {
                columnHandle.sortButton = new Emt('span', 'class="btn-default btn-xs"', columnHandle.headerText);
            }
            if (columnHandle.columnInfo && columnHandle.columnInfo.remark) {
                columnHandle.sortButton.setAttribute("title", columnHandle.columnInfo.remark);
            }
            dataGrid.titleTr.addTd(columnHandle.columnKey).addNodes([columnHandle.sortButton]);


            //双 过滤 输入
            if (0) {
                if (columnHandle.fixedFilterInput === false) {
                    dataGrid.filterTr.addTd(columnHandle.columnKey).textContent = columnHandle.filterInputPlacehoderString || '';
                } else {
                    columnHandle.fixedFilterInput.classList.add('col-md-12');

                    dataGrid.filterTr.addTd(columnHandle.columnKey).addNodes([columnHandle.fixedFilterInput]);
                    if (columnHandle.freeFilterInput === false) {
                        columnHandle.fixedFilterInput.addEventListener('change', function () {
                            dataGrid.api.requestData('filter');
                        })
                    } else {
                        columnHandle.fixedFilterInput.readOnly = true;
                    }
                }
                if (columnHandle.freeFilterInput !== false) {
                    columnHandle.freeFilterInput.addEventListener('change', function () {
                        if (columnHandle.fixedFilterInput !== false) {
                            columnHandle.fixedFilterInput.value = columnHandle.freeFilterInput.getVal();
                        }
                        dataGrid.api.requestData('filter');
                    });
                }
            }
            if (columnHandle.fixedFilterInput === false) {
                dataGrid.filterTr.addTd(columnHandle.columnKey).textContent = columnHandle.filterInputPlacehoderString || '';
            } else {
                columnHandle.fixedFilterInput.classList.add('col-md-12');
                dataGrid.filterTr.addTd(columnHandle.columnKey).addNodes([columnHandle.fixedFilterInput]);
                columnHandle.fixedFilterInput.addEventListener('change', function () {
                    if (columnHandle.freeFilterInput !== false) {
                        columnHandle.freeFilterInput.apiHandle.setChangedVal(columnHandle.fixedFilterInput.value);
                    }
                    dataGrid.api.requestData('filter');
                })
            }
            if (columnHandle.freeFilterInput !== false) {
                columnHandle.freeFilterInput.addEventListener('change', function () {
                    console.log('columnHandle.freeFilterInput');
                    if (columnHandle.fixedFilterInput !== false) {
                        columnHandle.fixedFilterInput.value = columnHandle.freeFilterInput.apiHandle.getVal();
                    }
                    dataGrid.api.requestData('filter');
                });
            }


            //渲染cell/单元格 方法

            if (columnHandle.hasRenderFunction) {
                dataGrid.column.renderFunMap[columnHandle.columnKey] = columnHandle.renderFun;
            } else {
                dataGrid.column.renderFunMap[columnHandle.columnKey] = false;
            }

            //预置搜索条件
            if (dataGrid.initSearchCondtion && dataGrid.initSearchCondtion.attrs && dataGrid.initSearchCondtion.attrs[columnHandle.columnKey] !== undefined && dataGrid.initSearchCondtion.attrs[columnHandle.columnKey].length > 0) {
                if (columnHandle.freeFilterInput !== false) {
                    columnHandle.freeFilterInput.setVal(dataGrid.initSearchCondtion.attrs[columnHandle.columnKey]);
                }
                if (columnHandle.fixedFilterInput !== false) {
                    columnHandle.fixedFilterInput.value = dataGrid.initSearchCondtion.attrs[columnHandle.columnKey];
                }
            }


            dataGrid.column.handle.list.push(columnHandle);
            dataGrid.column.handle.map[columnHandle.columnKey] = columnHandle;
            dataGrid.column.keys.push(columnHandle.columnKey);
            return columnHandle;

        }
        dataGrid.column.handle.unInitList.push(columnHandle);
        return columnHandle;
    };

    dataGrid.createSortButton = (buttonText, columnDataKey) => {
        let sortButton = new Emt('BUTTON', 'type="button" class="btn-default btn-xs hide_btn_sort"', buttonText);
        sortButton.addNodes([
            new Emt('SPAN', 'class="glyphicon glyphicon-arrow-up btn_sort_asc"', ''),
            new Emt('SPAN', 'class="glyphicon glyphicon-arrow-down btn_sort_desc"', '')
        ]);
        sortButton.columnKey = columnDataKey;
        sortButton.sortType = false;

        sortButton.setSort = function (type) {
            if (type === 'asc') {
                sortButton.sortType = 'asc';
                sortButton.classList.remove('hide_btn_sort_asc');
                sortButton.classList.add('hide_btn_sort_desc');
                sortButton.classList.remove('hide_btn_sort');
            } else if (type === 'desc') {
                sortButton.sortType = 'desc';
                sortButton.classList.add('hide_btn_sort_asc');
                sortButton.classList.remove('hide_btn_sort_desc');
                sortButton.classList.remove('hide_btn_sort');
            } else {
                sortButton.sortType = false;
                sortButton.classList.remove('hide_btn_sort_asc');
                sortButton.classList.remove('hide_btn_sort_desc');
                sortButton.classList.add('hide_btn_sort');
            }

        }


        sortButton.addEventListener('click', function () {
            dataGrid.column.sortButton.list.forEach(function (tmp_btn) {
                if (tmp_btn.columnKey !== sortButton.columnKey) {
                    tmp_btn.setSort(false);
                }
            });
            if (sortButton.sortType === 'asc') {
                sortButton.setSort('desc');
            } else {
                sortButton.setSort('asc');
            }
            sortKey_hideInput.value = sortButton.columnKey;
            sortType_hideInput.value = sortButton.sortType;
            dataGrid.resortFun(this);
        });


        return sortButton;
    }
    dataGrid.addDataRow = function (rowData) {
        let dataTr = dataGrid.addTr(dataGrid.ele.TBody);
        dataGrid.dataTrs.push(dataTr);
        dataTr.rowData = rowData;

        dataGrid.column.keys.forEach(function (columnKey) {
            let data_cell = dataTr.addTd(columnKey);
            if (typeof rowData[columnKey] === 'undefined') {
                if (typeof dataGrid.column.renderFunMap[columnKey] !== 'function') {
                    throw columnKey + ',row_data没有这个字段，也没有设置处理function';
                }
                dataGrid.column.renderFunMap[columnKey](data_cell, rowData);
            } else {
                if (typeof dataGrid.column.renderFunMap[columnKey] === 'function') {
                    dataGrid.column.renderFunMap[columnKey](data_cell, rowData);
                } else {
                    data_cell.innerText = rowData[columnKey] === null ? '' : rowData[columnKey].toString();
                }
            }
        })
    }
    dataGrid.clearDataRows = function () {
        let max = dataGrid.dataTrs.length;
        for (let i = 0; i < max; i++) {
            //console.log(dataGrid.dataTrs.length);
            dataGrid.dataTrs[i].remove();
        }
        dataGrid.dataTrs = [];
    }
    dataGrid.pageInfo = {};
    dataGrid.createPager = function (cnt) {
        dataGrid.pageInfo.all_total = cnt;
        if (typeof dataGrid.pageInfo.root_ele === "undefined") {

            dataGrid.pageInfo.goto_start = new Emt('a').setPros({href: '#', textContent: '<<', goto: 1});
            dataGrid.pageInfo.goto_end = new Emt('a').setPros({href: '#', textContent: '>>', goto: 'end'});
            dataGrid.pageInfo.goto_pre = new Emt('a').setPros({href: '#', textContent: '<', goto: 'pre'});
            dataGrid.pageInfo.goto_next = new Emt('a').setPros({href: '#', textContent: '>', goto: 'next'});

            dataGrid.pageInfo.root_ele = new Emt('ul').setPros({className: 'pagination'}).addNodes([
                new Emt('li').addNodes([
                    dataGrid.pageInfo.goto_start,
                    dataGrid.pageInfo.goto_pre
                ])
            ]);

            for (let i = 0; i < 5; i++) {
                dataGrid.pageInfo['goto_' + i.toString()] = new Emt('a').setPros({href: '#', textContent: '#', goto: i});
                dataGrid.pageInfo.root_ele.addNodes([
                    new Emt('li').addNodes([
                        dataGrid.pageInfo['goto_' + i.toString()]
                    ])
                ]);
            }

            dataGrid.pageInfo.root_ele.addNodes([new Emt('li').addNodes([
                dataGrid.pageInfo.goto_next,
                dataGrid.pageInfo.goto_end
            ])]);
            dataGrid.footTr.apiHandle.td.map.page.addNodes([dataGrid.pageInfo.root_ele]);
            ['start', 'end', 'pre', 'next', 0, 1, 2, 3, 4].forEach(function (ele_name) {
                dataGrid.pageInfo['goto_' + ele_name.toString()].addEventListener('click', function () {
                    console.log('goto', ele_name.toString(), this.goto);
                    pageIndex_hideInput.value = this.goto;
                    dataGrid.api.gotPage();
                })
            });
        }

        dataGrid.pageInfo.curr_index = parseInt(pageIndex_hideInput.value);
        dataGrid.pageInfo.page_size = parseInt(pageSize_hideInput.value);
        dataGrid.pageInfo.page_total = Math.ceil(parseInt(cnt) / dataGrid.pageInfo.page_size);

        let min = dataGrid.pageInfo.curr_index - 2;
        let max = dataGrid.pageInfo.curr_index + 2;
        console.log('curr_index', dataGrid.pageInfo.curr_index, 'page_size', dataGrid.pageInfo.page_size, 'page_total:', dataGrid.pageInfo.page_total, 'cnt', cnt, min, max);
        if (min < 1) {
            diff = 0 - min + 1;
            min = 1;
            max = max + 2;
        }
        console.log(min, max, dataGrid.pageInfo);

        let j = 0;
        for (let i = min; i <= max; i++) {
            console.log(i, j);
            if (dataGrid.pageInfo['goto_' + j.toString()]) {
                dataGrid.pageInfo['goto_' + j.toString()].setPros({textContent: i.toString(), goto: i});
                j = j + 1;
            }
        }
        dataGrid.pageInfo.goto_end.goto = dataGrid.pageInfo.page_total;
        dataGrid.pageInfo.goto_next.goto = dataGrid.pageInfo.curr_index + 2;
        dataGrid.pageInfo.goto_pre.goto = dataGrid.pageInfo.curr_index - 2;

        ['start', 'end', 'pre', 'next', 0, 1, 2, 3, 4].forEach(function (ele_name) {
            let a_ele = dataGrid.pageInfo['goto_' + ele_name.toString()];
            a_ele.classList.remove('hide');
            a_ele.parentElement.classList.remove('active');
            if (a_ele.goto < 1) {
                a_ele.goto = 1;
            } else if (a_ele.goto > dataGrid.pageInfo.page_total) {
                a_ele.goto = dataGrid.pageInfo.page_total;
                if (typeof ele_name === 'number') {
                    a_ele.classList.add('hide');
                }
            }
            if (typeof ele_name === 'number' && a_ele.goto === dataGrid.pageInfo.curr_index) {
                a_ele.parentElement.classList.add('active');
            }
        });


    }
    /**
     * 重新载入数据
     * @param row_datas
     */
    dataGrid.api.reloadDataRows = function (data) {
        dataGrid.clearDataRows();
        data.dataRows.forEach(function (row_data) {
            dataGrid.addDataRow(row_data);
        });
        dataGrid.topTr.apiHandle.td.map.goto_submit.setAttribute('colspan', dataGrid.column.keys.length);
        dataGrid.footTr.apiHandle.td.map.page.setAttribute('colspan', dataGrid.column.keys.length);
        dataGrid.createPager(data.rowsTotal);
    }

    return dataGrid;

};

