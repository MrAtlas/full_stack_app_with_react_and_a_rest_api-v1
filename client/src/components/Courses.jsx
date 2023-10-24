import React, { useState, useEffect } from 'react';
import { apiHelper } from '../utils/apiHelper';
import { Link } from 'react-router-dom';

const Courses = () => {
    const [courses, setCourses] = useState([]);

    // Use useEffect to fetch the list of courses when the component mounts
    useEffect(() => {
        apiHelper('/courses', 'GET')
            .then(response => response.json())
            .then(data => setCourses(data))
            .catch(error => console.error('Error fetching courses:', error));
    }, []);

    return (
        <main>
            <div className="wrap main--grid">
                {/* Map through the list of courses and display each as a link */}
                {courses.map(course => (
                    <Link key={course.id} className="course--module course--link" to={`courses/${course.id}`}>
                        <h2 className="course--label">Course</h2>
                        <h3 className="course--title">{course.title}</h3>
                    </Link>
                ))}

                {/* Create a link to add a new course */}
                <Link className="course--module course--add--module" to='courses/create'>
                    <span className="course--add--title">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                            viewBox="0 0 13 13" className="add"><polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon></svg>
                        New Course
                    </span>
                </Link>
            </div>
        </main>
    );
}

export default Courses;
