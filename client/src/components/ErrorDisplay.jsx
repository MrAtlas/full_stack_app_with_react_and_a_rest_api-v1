import React from 'react'

const ErrorsDisplay = ({ errors }) => {
    let errorsDisplay = null;

    if (errors.length) {
        errorsDisplay = (
            <div className="wrap">
                <h2>Error</h2>
                <p>Sorry! We just encountered an unexpected error.</p>
            </div>
        )
    }
    return errorsDisplay;
}

export default ErrorsDisplay