import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div>
            <h1>SORRY :(</h1>
            <h3>Page NOT Found</h3>
            <Link to="/">Go Back to Safety</Link>
        </div>
    )
}

export default NotFound