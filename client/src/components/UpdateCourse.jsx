import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../context/UserContext';
import { useNavigate, useParams } from 'react-router-dom';
import { apiHelper } from '../utils/apiHelper';


const UpdateCourse = () => {
    const [courseTitle, setCourseTitle] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [estimatedTime, setEstimatedTime] = useState('');
    const [materialsNeeded, setMaterialsNeeded] = useState('');
    const { authUser } = useContext(UserContext);
    const [showValidationErrors, setShowValidationErrors] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        apiHelper(`/courses/${id}`, 'GET')
            .then(response => response.json())
            .then(data => {
                setCourseTitle(data.title);
                setCourseDescription(data.description);
                setEstimatedTime(data.estimatedTime);
                setMaterialsNeeded(data.materialsNeeded);
                // Check course ownership and user authentication here
                if (!authUser) {
                    navigate('/signin');
                } else if (authUser.id !== data.userId) {
                    navigate('/forbidden');
                }
            })
            .catch(error => console.error('Error fetching course details:', error));
    }, [id, authUser, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

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
            const response = await apiHelper(`/courses/${id}`, 'PUT', course, {
                username: authUser.emailAddress,
                password: authUser.password,
            });

            if (response.status === 204) {
                navigate(`/courses/${id}`);
            } else if (response.status === 500) {
                navigate(`error`);
            } else {
                const responseData = await response.json();
                console.error('Error updating course. Response status:', response.status);
                console.error('Response data:', responseData);
                navigate(`notfound`);
            }
        } catch (error) {
            console.error('Error updating course:', error);
        }

    };


    return (
        <div className='wrap'>
            <h2>Update Course</h2>
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
                <div className='main--flex'>
                    <div>
                        <label htmlFor='courseTitle'>Course Title</label>
                        <input id='courseTitle' name='courseTitle' type='text' value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} />
                        <p>By Joe Smith</p>
                        <label htmlFor='courseDescription'>Course Description</label>
                        <textarea id='courseDescription' name='courseDescription' value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor='estimatedTime'>Estimated Time</label>
                        <input id='estimatedTime' name='estimatedTime' type='text' value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} />
                        <label htmlFor='materialsNeeded'>Materials Needed</label>
                        <textarea id='materialsNeeded' name='materialsNeeded' value={materialsNeeded} onChange={(e) => setMaterialsNeeded(e.target.value)} />
                    </div>
                </div>
                <button className='button' type='submit'>
                    Update Course
                </button>
                <button className='button button-secondary' onClick={() => navigate(`/courses/${id}`)}>
                    Cancel
                </button>
            </form>
        </div>
    )
}

export default UpdateCourse