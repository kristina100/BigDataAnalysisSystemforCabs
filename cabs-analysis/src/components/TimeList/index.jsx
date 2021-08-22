import React, { Component } from 'react'
import { Select } from 'antd';
import PubSub from 'pubsub-js';
<<<<<<< HEAD
const { Option } = Select;

function handleChange(value) {
  PubSub.publish('timeUti',value.value);
}

export default class index extends Component {
   
   
    render() {
        return (
        <Select
            labelInValue
            defaultValue={{ value: '清晨' }}
            style={{ width: 80 }}
            onChange={handleChange}
          >
            <Option value="0">清晨</Option>
            <Option value="1">上午</Option>
            <Option value="2">下午</Option>
            <Option value="3">夜晚</Option>
          </Select>
          
        )
    }
=======
import './index.css'
const { Option } = Select;

function handleChange(value) {
  PubSub.publish('timeUti', value.value);
}

export default class index extends Component {


  render() {
    return (
      <Select
        labelInValue
        defaultValue={{ value: '清晨' }}
        style={{ width: 80 }}
        onChange={handleChange}
        id="timelist"
      >
        <Option value="0">清晨</Option>
        <Option value="1">上午</Option>
        <Option value="2">下午</Option>
        <Option value="3">夜晚</Option>
      </Select>

    )
  }
>>>>>>> 909892b1b180361ac26c62fe532772ff25415da9
}
