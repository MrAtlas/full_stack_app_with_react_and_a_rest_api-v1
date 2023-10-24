import React, { useContext, useState } from 'react';
import UserContext from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { apiHelper } from '../utils/apiHelper';

const CreateCourse = () => {
    const { authUser } = useContext(UserContext);
    const [courseTitle, setCourseTitle] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [estimatedTime, setEstimatedTime] = useState('');
    const [materialsNeeded, setMaterialsNeeded] = useState('');
    const [showValidationErrors, setShowValidationErrors] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check if the user is authenticated
        if (!authUser) {
            navigate('/signin');
            return;
        }

        // Check if the "Title" and "Description" fields are empty
        if (!courseTitle || !courseDescription) {
            // Display validation errors
            setShowValidationErrors(true);
            return;
        }

        // Create a course object with the form input values
        const course = {
            title: courseTitle,
            description: courseDescription,
            estimatedTime,
            materialsNeeded,
            userId: authUser.id
        };

        try {
            const response = await apiHelper('/courses', 'POST', course, {
                username: authUser.emailAddress,
                password: authUser.password,
            });

            if (response.status === 201) {
                navigate(`/`);
            } else {
                return response.json().then((error) => console.error(error));
            }
        } catch (error) {
            console.error('Error creating course:', error);
        }
    };

    return (
        <div className="wrap">
            <h2>Create Course</h2>
            {showValidationErrors && (
                <div className="validation--errors">
                    <h3>Validation Errors</h3>
                    <ul>
                        <li>Please provide a value for "Title"</li>
                        <li>Please provide a value for "Description"</li>
                    </ul>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="main--flex">
                    <div>
                        <label htmlFor="courseTitle">Course Title</label>
                        <input id="courseTitle" name="courseTitle" type="text" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} />

                        <p>By {authUser.firstName} {authUser.lastName}</p>

                        <label htmlFor="courseDescription">Course Description</label>
                        <textarea id="courseDescription" name="courseDescription" value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)}></textarea>
                    </div>
                    <div>
                        <label htmlFor="estimatedTime">Estimated Time</label>
                        <input id="estimatedTime" name="estimatedTime" type="text" value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} />

                        <label htmlFor="materialsNeeded">Materials Needed</label>
                        <textarea id="materialsNeeded" name="materialsNeeded" value={materialsNeeded} onChange={(e) => setMaterialsNeeded(e.target.value)}></textarea>
                    </div>
                </div>
                <button className="button" type="submit">Create Course</button>
                <button className="button button-secondary" onClick={() => navigate('/')}>Cancel</button>
            </form>
        </div>
    );
};

export default CreateCourse;
