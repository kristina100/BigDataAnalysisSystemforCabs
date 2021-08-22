import React, { Component } from 'react'
import moment from 'moment';
import { DatePicker, Space } from 'antd';
import PubSub from 'pubsub-js'
import 'antd/dist/antd.css';

  function disabledDate(current) {
    return current<moment('2017-02-01') || current > moment('2017-02-28')
  }

export default class Datepick extends Component {

    check = (date,dateString) => {
        PubSub.publish('pathDate',{pathDate:dateString})
        // console.log(dateString);
    }

    render() {
        return (
<<<<<<< HEAD
                <Space direction="vertical">
=======
                <Space direction="vertical" id="datePick">
>>>>>>> 909892b1b180361ac26c62fe532772ff25415da9
                    <DatePicker
                     onChange={this.check} format="YYYY-MM-DD"
                     disabledDate={disabledDate}            
                    //  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                     defaultPickerValue={moment("2017-02-01")}
                    //  defaultValue={moment("2017-02-01")}
                    />
                </Space>

        )
    }
}
