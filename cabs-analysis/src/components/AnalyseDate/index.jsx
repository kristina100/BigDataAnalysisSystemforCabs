import { DatePicker, Space } from 'antd';
import moment from 'moment';
import PubSub from 'pubsub-js';
import React, { Component } from 'react'

export default class index extends Component {
    onChange=(_, dateString)=> {
        if(dateString){
            let dateT = dateString.split('-');
            PubSub.publish('dateAna',dateT[1]+'-'+dateT[2])
        }else{
            return;
        }
        
    }
    disabledDate = (current) =>{
        return current<moment('2017-02-01') || current > moment('2017-03-31')
    }
    render() {
        return (
            <Space direction="vertical">
                <DatePicker 
                disabledDate={this.disabledDate}  
                onChange={this.onChange} 
                defaultPickerValue={moment("2017-02-01")}
                defaultValue={moment("2017-02-01")}
                showToday={false}
            />
            </Space>
        )
    }
}
