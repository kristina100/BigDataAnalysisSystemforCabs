import React from 'react';
import { Table } from 'antd';
import reqwest from 'reqwest';
import './index.css'

const columns = [
    {
        title: '车牌号',
        dataIndex: 'plate_no',
        // sorter: true,
        // render: name => `${name.first} ${name.last}`,
        width: '20%',
    },
    {
        title: '起点',
        dataIndex: 'company_id',
        // filters: [
        //     { text: 'Male', value: 'male' },
        //     { text: 'Female', value: 'female' },
        // ],
        width: '20%',
    },
    {
        title: '终点',
        dataIndex: 'location',
    }
    ,
    {
        title: '时间',
        dataIndex: 'error',
    }, {
        title: `全部异常`,
        dataIndex: 'load_mile',
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
    };

    componentDidMount() {
        let flagDown = 0;  // 1 向下  0 向上
        // 增加下拉列表到dom中
        let theadTr = document.querySelector('.ant-table-thead').querySelector('tr');
        let Inform = document.createElement('ul');
        Inform.className = 'wrongInform noHover'
        theadTr.appendChild(Inform);
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

        for (let i = 0; i < 5; ++i) {
            let li = document.createElement('li');
            Inform.appendChild(li);
            li.innerHTML = `异常${i}`;
        }
        const { pagination } = this.state;
        this.fetch({ pagination });  // 初次进入页面，默认处在第一页，页面数据10条，然后发起请求
    }

    handleTableChange = (pagination) => {
        // 检测到了底部页码改变，就要根据当前状态发出请求
        this.fetch({
            pagination
        });
    };

    fetch = (params = {}) => {
        this.setState({ loading: true });  // 设置当前处在加载状态
        // 根据表格组件检测到的当前所处页面以及页面数据量，发起对应的页面以及页面数据量的请求
        let { current } = params.pagination;
        let { pageSize } = params.pagination;
        reqwest({
            // url: `http://39.98.41.126:31103/findErrorTaxis/${current}/${pageSize}`,
            method: 'get'
        }).then(data => {
            // 收到数据就更改state，react根据state里的数据重新渲染表格数据
            console.log(data);
            this.setState({
                loading: false,
                data: data.list,
                pagination: {
                    ...params.pagination,
                    total: data.total // 数据总条数，根据这个数据来分页
                },
            });
        });
    };


    render() {
        const { data, pagination, loading } = this.state;

        // rowKey 回调的第一个参数是每一条数据，可以用数据的id来作为唯一的key值
        return (
            <Table className="w place"
                columns={columns}
                rowKey={record => record.id}
                dataSource={data}
                pagination={pagination}
                loading={loading}
                onChange={this.handleTableChange}
            />
        );

    }
}

