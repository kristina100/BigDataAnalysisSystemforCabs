import React, { Component } from 'react'



export default class BasicMap extends Component {
	componentDidMount(){
		let container = document.getElementsByClassName('map-ct')[0];
		var map = new window.AMap.Map(container, {
		center: [113.26929,23.135137],
		zoom:12,
		mapStyle: 'amap://styles/whitesmoke'
	});
	}
	render() {
		return (
			<div className="map-ct" style={{width:'100%'}}></div>
		)
	}
}
