import { Dropdown, Menu } from 'antd';
import MyNavLink from '../MyNavLink'
import './index.css'
import React from 'react';

const App = () => (
    <Dropdown overlay={<Menu>
        <Menu.Item> <a target="_blank" rel="noopener noreferrer" href="http://qgailab.com/awdp/#/">
            AWDP
        </a></Menu.Item>
        <Menu.Item><a target="_blank" rel="noopener noreferrer" href="http://qgailab.com/mapping/">
            知识图谱
        </a></Menu.Item>
        <Menu.Item><a target="_blank" rel="noopener noreferrer" href="http://qgailab.com/algorithmVisualization/#/alexe">
            算法可视化
        </a></Menu.Item>
    </Menu>} placement="bottomCenter" arrow>
        <div style={{ width: '130px', height: '50px' }}>
            <div style={{ cursor: 'pointer' }} className='noActive'>算法支撑平台</div>
        </div>
    </Dropdown>
);

export default App;