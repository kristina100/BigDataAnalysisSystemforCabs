import React, { Component } from 'react'
import moment from 'moment';
import { DatePicker, Space } from 'antd';
import 'antd/dist/antd.css';
import PubSub from 'pubsub-js';
import './index.css'
export default class Date extends Component {
  range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }
  disabledDate = (current) =>{
  
    return current<moment('2017-02-01') || current > moment('2017-03-01')
  }
  
  onOk = (dates)=>{
    let end = moment(dates).add(30,'m');
    PubSub.publish('date',[moment(dates).format('YYYY-MM-DD HH:mm:ss'),end.format('YYYY-MM-DD HH:mm:ss')])
  }



  render() {
    return (
      <Space direction="vertical" size={12}>
        <DatePicker
          format="YYYY-MM-DD HH:mm:ss"
          disabledDate={this.disabledDate}            
          showNow={false}
          showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
          defaultPickerValue={moment("2017-02-01")}
          defaultValue={moment("2017-02-01")}
          onOk={this.onOk}
        /> 
      </Space>
    )
  }
}
