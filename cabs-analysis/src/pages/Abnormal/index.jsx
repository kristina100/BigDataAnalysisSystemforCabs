import React from 'react';
import { Table } from 'antd';
import reqwest from 'reqwest';
import { message } from 'antd'
import './index.css'
import axios from 'axios';

const columns = [
    {
        title: '车牌号',
        dataIndex: 'plateNo',
        // sorter: true,
        // render: name => `${name.first} ${name.last}`,
        width: '20%',
    },
    {
        title: '起点',
        dataIndex: 'onLocation',
        // filters: [
        //     { text: 'Male', value: 'male' },
        //     { text: 'Female', value: 'female' },
        // ],
        width: '20%',
    },
    {
        title: '终点',
        dataIndex: 'offLocation',
    }
    ,
    {
        title: '时间',
        dataIndex: 'errorDate',
    }, {
        title: `全部异常类型`,
        dataIndex: 'error',
    }
];


export default class Abnormal extends React.Component {
    state = {
        data: [],
        pagination: {
            current: 1,
            pageSize: 10,
        },
        loading: false,
        keyWords: '全部异常'
    };

    componentDidMount() {
        let { pagination } = this.state;
        let that = this; // 记录this的指向
        // 设置下拉盒子
        let flagDown = 0;  // 1 向下  0 向上
        // 增加下拉列表到dom中
        let theadTr = document.querySelector('.ant-table-thead').querySelector('tr');


        let Inform = document.createElement('ul');
        Inform.className = 'wrongInform noHover'
        theadTr.appendChild(Inform)
        // 给伪元素添加点击事件,并且修改伪元素的content
        let downTd = theadTr.children[4];

        downTd.setAttribute('data-down', '');

        downTd.addEventListener('click', function () {
            if (flagDown == 1) {  // 改为向上箭头
                flagDown = 0;  // 1 向下  0 向上
                downTd.setAttribute('data-down', '');
                Inform.className = 'wrongInform noHover'
            } else if (flagDown == 0) { // 改为向下箭头
                flagDown = 1;
                downTd.setAttribute('data-down', '');
                Inform.className = 'wrongInform hover'
            }
        })

        axios.get(`http://39.98.41.126:31100/getErrorType`).then(
            response => {
                // 根据请求类别接口生成li
                for (let i = 0; i < response.data.length; ++i) {
                    let li = document.createElement('li');
                    li.innerHTML = response.data[i];
                    Inform.appendChild(li);
                }

                let li = document.createElement('li');
                li.innerHTML = `全部异常`;
                Inform.insertBefore(li, Inform.children[0]);

                // 添加点击事件
                for (let i = 0; i < Inform.children.length; ++i) {
                    Inform.children[i].addEventListener('click', function () {
                        // 自动变为向上，并且隐藏盒子
                        flagDown = 0;  // 1 向下  0 向上
                        downTd.setAttribute('data-down', '');
                        Inform.className = 'wrongInform noHover'
                        let keyWords;
                        if (i == 0) {
                            keyWords = '';
                            downTd.innerHTML = '全部异常'
                        } else {
                            keyWords = this.innerHTML;
                            downTd.innerHTML = this.innerHTML;
                        }
                        that.fetch({ keyWords, pagination })
                    })
                }
            }
        )


        this.fetch({ pagination });  // 初次进入页面，默认处在第一页，页面数据10条，然后发起请求
    }

    toRealTime = (date) => {
        date = new Date(parseInt(date));
        let Y = date.getFullYear() + '-';
        let M = ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-';
        let D = date.getDate();
        return Y + M + D;
    }

    handleTableChange = (pagination) => {
        this.setState({
            pagination
        })
        // 检测到了底部页码改变，就要根据当前状态发出请求
        this.fetch({
            pagination,
            keyWords: this.state.keyWords
        });
    };

    fetch = (params = {}) => {
        this.setState({ loading: true });  // 设置当前处在加载状态
        // 根据表格组件检测到的当前所处页面以及页面数据量，发起对应的页面以及页面数据量的请求
        let { current } = params.pagination;
        let { pageSize } = params.pagination;
        let { keyWords } = params;
        let myUrl = keyWords ? `http://39.98.41.126:31100/findErrorTaxis/${current}/${pageSize}/${keyWords}` : `http://39.98.41.126:31100/findErrorTaxis/${current}/${pageSize}/`

        reqwest({
            url: myUrl,
            method: 'get'
        }).then(data => {
            if(data.list){
                data.list.map((item) => {
                    item.errorDate = this.toRealTime(Number(item.errorDate));
                })
                // 收到数据就更改state，react根据state里的数据重新渲染表格数据
                this.setState({
                    loading: false,
                    data: data.list,
                    pagination: {
                        ...params.pagination,
                        total: data.total // 数据总条数，根据这个数据来分页
                    },
                    keyWords: keyWords
                });
            }else{
                message.warning({content:'服务器或网络出现问题，加载失败！',duration:2});  
            }
        });
    };
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        }
    }
    render() {
        const { data, pagination, loading } = this.state;
        // rowKey 回调的第一个参数是每一条数据，可以用数据的id来作为唯一的key值
        return (
            <div id="abnormal-box">
                <Table className="place w"
                    columns={columns}
                    rowKey={record => record.id}
                    dataSource={data}
                    pagination={pagination}
                    loading={loading}
                    onChange={this.handleTableChange}
                />
            </div>
        );

    }
}

