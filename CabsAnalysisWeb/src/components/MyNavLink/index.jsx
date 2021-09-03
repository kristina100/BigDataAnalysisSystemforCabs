import React from 'react'
import { NavLink } from 'react-router-dom'

function MyNavLink(props) {
	return (
		<NavLink activeClassName="onActive" className="noActive" {...props} />
	)
}
export default MyNavLink;