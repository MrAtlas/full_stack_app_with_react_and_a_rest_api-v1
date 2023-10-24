import { useContext, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { apiHelper } from '../utils/apiHelper';


const UserSignUp = () => {
    const [showValidationErrors, setShowValidationErrors] = useState(false);
    const { actions } = useContext(UserContext);
    const navigate = useNavigate()

    // State
    const firstName = useRef(null);
    const lastName = useRef(null);
    const emailAddress = useRef(null);
    const password = useRef(null)


    // event handlers
    const handleSubmit = async (event) => {
        event.preventDefault();

        const user = {
            firstName: firstName.current.value,
            lastName: lastName.current.value,
            emailAddress: emailAddress.current.value,
            password: password.current.value
        }

        if (firstName.current.value === "" || lastName.current.value === "" || emailAddress.current.value === "" || password.current.value === "") {
            // Display validation errors
            setShowValidationErrors(true);
            return;
        }

        try {
            const response = await apiHelper("/users", "POST", user);
            if (response.status === 201) {
                const credentials = {
                    username: user.emailAddress,
                    password: user.password
                };
                await actions.signIn(credentials);
                navigate("/")
                console.log(`${user.firstName} is successfully signed up and authenticated`)
            } else if (response.status === 400) {
                const data = await response.json();
                console.log(data)
            } else {
                throw new Error();
            }
        } catch (error) {
            console.log(error);
            //navigate("/error")
        }
    }

    const handleCancel = (event) => {
        event.preventDefault();
        navigate("/")
    }

    return (
        <div className='form--centered'>
            <h2>Sign Up</h2>
            {showValidationErrors && (
                <div className="validation--errors">
                    <h3>Validation Errors</h3>
                    <ul>
                        <li>Please provide a value for "First Name"</li>
                        <li>Please provide a value for "Last Name"</li>
                        <li>Please provide a value for "Email"</li>
                        <li>Please provide a value for "Password"</li>
                    </ul>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <label htmlFor='firstName'>First Name</label>
                <input id='firstName' name='firstName' type='text' placeholder='first name' ref={firstName} />
                <label htmlFor='lastName'>Last Name</label>
                <input id='lastName' name='lastName' type='text' placeholder='last name' ref={lastName} />
                <label htmlFor='emailAddress'>Email Address</label>
                <input id='emailAddress' name='emailAddress' type='email' placeholder='email' ref={emailAddress} />
                <label htmlFor='password'>Password</label>
                <input id='password' name='password' type='password' placeholder='password' ref={password} />
                <button className='button' type='submit'>
                    Sign Up
                </button>
                <button className='button button-secondary' type='button' onClick={handleCancel}>
                    Cancel
                </button>
            </form>
            <p>
                Already have a user account? Click here to <Link to='/signin'>sign in</Link>!
            </p>
        </div>
    )
}

export default UserSignUp