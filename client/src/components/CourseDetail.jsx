import React, { useState, useEffect, useContext } from 'react';
import { apiHelper } from '../utils/apiHelper';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import UserContext from '../context/UserContext';

const CourseDetail = () => {
    const [course, setCourse] = useState({});
    const { id } = useParams();
    const { authUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        apiHelper(`/courses/${id}`, 'GET')
            .then(response => response.json())
            .then(data => setCourse(data))
            .catch(error => console.error('Error fetching course details:', error));
    }, [id]);

    const handleDelete = async (event) => {
        // Check if the user is authenticated
        if (!authUser) {
            navigate('/signin');
            return;
        }

        try {
            const response = await apiHelper(`/courses/${id}`, 'DELETE', null, {
                username: authUser.emailAddress,
                password: authUser.password,
            });

            if (response.status === 204) {
                navigate(`/`);
            } else if (response.status === 500) {
                navigate(`error`);
            } else {
                navigate(`notfound`);
                return response.json().then((error) => console.error(error))

            }
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    const isAuthorized = authUser && authUser.id === course.userId;

    return (
        <main>
            <div className="actions--bar">
                <div className="wrap">
                    {isAuthorized && (
                        <>
                            <Link className="button" to={`/courses/${course.id}/update`}>Update Course</Link>
                            <button className="button" onClick={handleDelete}>Delete Course</button>
                        </>
                    )}
                    <Link className="button button-secondary" to='/'>Return to List</Link>
                </div>
            </div>

            <div className="wrap">
                <h2>Course Detail</h2>
                <form>
                    <div className="main--flex">
                        <div>
                            <h3 className="course--detail--title">Course</h3>
                            <h4 className="course--name">{course.title}</h4>
                            <p>{course.description}</p>
                        </div>
                        <div>
                            <h3 className="course--detail--title">Estimated Time</h3>
                            <p>{course.estimatedTime}</p>

                            <h3 className="course--detail--title">Materials Needed</h3>
                            <ul className="course--detail--list">
                                <ReactMarkdown>
                                    {course.materialsNeeded}
                                </ReactMarkdown>
                            </ul>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    )
}

export default CourseDetail;
