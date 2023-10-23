import React from 'react';

//component for unexpected errors when a 500 internal server error occours 
const UnhandledError = () => {

    return (
        <div className="wrap">
            <h1>Error</h1>
            <h3>We just encountered an unexpected error!</h3>
        </div>
    )
}

export default UnhandledError;