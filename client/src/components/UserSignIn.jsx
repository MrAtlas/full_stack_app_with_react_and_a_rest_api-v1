import React, { useContext, useRef } from 'react';
import UserContext from '../context/UserContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const UserSignIn = () => {
    const { actions } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Refs to store input field values
    const username = useRef(null);
    const password = useRef(null);

    // Event handler for form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Get the "from" location from the state (where the user tried to access before signing in)
        let from = '/';
        if (location.state) {
            from = location.state.from;
        }

        // Create credentials object from input values
        const credentials = {
            username: username.current.value,
            password: password.current.value
        };

        try {
            // Attempt to sign in with the provided credentials
            const user = await actions.signIn(credentials);

            if (user) {
                // If sign-in is successful, navigate to the original location or the default route
                navigate(from);
            }
        } catch (error) {
            console.log(error);
            // Handle errors, e.g., navigate to an error page
            // navigate("/error");
        }
    };

    // Event handler to cancel the sign-in process and go back to the default route
    const handleCancel = (event) => {
        event.preventDefault();
        navigate('/');
    };

    return (
        <div className='form--centered'>
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor='emailAddress'>Email Address</label>
                <input id='emailAddress' name='emailAddress' type='email' placeholder='email' ref={username} />
                <label htmlFor='password'>Password</label>
                <input id='password' name='password' type='password' placeholder='password' ref={password} />
                <button className='button' type='submit'>
                    Sign In
                </button>
                <button className='button button-secondary' type='button' onClick={handleCancel}>
                    Cancel
                </button>
            </form>
            <p>
                Don't have a user account? Click here to <Link to='/signup'>sign up</Link>!
            </p>
        </div>
    );
};

export default UserSignIn;
