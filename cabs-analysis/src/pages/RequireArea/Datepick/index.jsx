import React, { Component } from 'react'
import moment from 'moment';
import { DatePicker, Space } from 'antd';
import PubSub from 'pubsub-js'
import 'antd/dist/antd.css';

  function disabledDate(current) {
    return current<moment('2017-02-01') || current > moment('2017-02-27')
  }
  

export default class Datepick extends Component {

  state = ({
    clean:false
  })

  componentDidMount(){
    this.token = PubSub.subscribe('cleanValue', (_, flag) => {
      this.setState({clean:flag})
      this.setState({clean:false})

    })
  }

    check = (date,dateString) => {
        PubSub.publish('flowDate',{flowDate:dateString})
        // console.log(dateString);
    }

    cleanValue = () => {
      if(this.state.clean){
        return null
      }else{
        return 
      }
    }

    render() {
        return (
                <Space direction="vertical">
                    <DatePicker
                     onChange={this.check} format="YYYY-MM-DD"
                     disabledDate={disabledDate}            
                    //  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                     defaultPickerValue={moment("2017-02-01")}
                    //  defaultValue={moment("2017-02-01")}
<<<<<<< HEAD
                    value={this.cleanValue()}
=======
                    // value={this.cleanValue()}
>>>>>>> 909892b1b180361ac26c62fe532772ff25415da9
                    />
                </Space>

        )
    }
}
