import React from 'react';
import { useFormik } from 'formik';
import Navbar from './Navbar'; // Import your existing Navbar component

const Login = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: (values) => {
      // Handle login logic here
      console.log(values);
    },
  });

  return (
    <>
      <Navbar />
      <div className="bg-red-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Login</h1>
          <p className="text-white text-lg">Enter your credentials to access your account.</p>
        </div>
      </div>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md">
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-colors duration-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;