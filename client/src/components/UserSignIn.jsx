import React, { useState, useContext, useRef } from 'react';
import UserContext from '../context/UserContext'
import { Link, useNavigate, useLocation } from 'react-router-dom';

const UserSignIn = () => {
    const { actions } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();

    //state
    const username = useRef(null);
    const password = useRef(null);
    const [errors, setErrors] = useState([]);

    // Event Handlers
    const handleSubmit = async (event) => {
        event.preventDefault();

        let from = '/';
        if (location.state) {
            from = location.state.from;
        }

        const credentials = {
            username: username.current.value,
            password: password.current.value
        };

        try {
            const user = await actions.signIn(credentials);
            if (user) {
                navigate(from);
            } else {
                setErrors(["Sign-in was unsuccessful"]);
            }
        } catch (error) {
            console.log(error);
            //navigate("/error");
        }
    }

    const handleCancel = (event) => {
        event.preventDefault();
        navigate("/");
    }

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
    )
}

export default UserSignIn