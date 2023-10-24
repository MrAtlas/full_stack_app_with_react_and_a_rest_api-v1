import React from 'react';
import { Route, Routes } from "react-router-dom";

//components
import Header from './components/Header';
import CourseDetail from './components/CourseDetail';
import Courses from './components/Courses';
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';
import UserSignIn from './components/UserSignIn';
import UserSignOut from './components/UserSignOut';
import UserSignUp from './components/UserSignUp';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './components/NotFound';
import Forbidden from './components/Forbidden';
import UnhandledError from './components/UnhandledError';

function App() {

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path='/' element={<Courses />} />
        <Route path='courses/:id' element={<CourseDetail />} />
        <Route path='signin' element={<UserSignIn />} />
        <Route path='signout' element={<UserSignOut />} />
        <Route path='signup' element={<UserSignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path='courses/create' element={<CreateCourse />} />
          <Route path='courses/:id/update' element={<UpdateCourse />} />
        </Route>
        <Route path='notfound' element={<NotFound />} />
        <Route path="forbidden" element={<Forbidden />} />
        <Route path="error" element={<UnhandledError />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
