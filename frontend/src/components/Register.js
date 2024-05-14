import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';

const Register = () => {
  const [userType, setUserType] = useState('customer');

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async (values) => {
      try {
        const response = await axios.post('/register', {
          name: values.name,
          email: values.email,
          password: values.password,
          userType: userType,
        });
        console.log(response.data.message);
        // Handle successful registration (e.g., show a success message, redirect to login page)
        if (response.data.success) {
          alert(response.data.message);
          // Redirect to login page or perform any other action
        } else {
          alert('Registration failed. Please try again.');
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred during registration. Please try again.');
      }
    },
  });

  return (
    <div>
      <Navbar />
      <div className="flex flex-col min-h-screen">
        <div className="bg-red-500 py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome to Basi Go
            </h1>
            <p className="text-white text-lg">
              Embark on your next adventure with ease – book your bus tickets
              seamlessly with us!
            </p>
          </div>
        </div>
        <div className="flex-grow bg-gray-100">
          <div className="flex justify-center items-center py-16">
            <div className="w-full max-w-md p-6 bg-white shadow rounded-md">
              <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
                Register
              </h1>
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-4">
                  <label className="block mb-2 font-semibold text-gray-700">
                    User Type
                  </label>
                  <div className="flex items-center">
                    <div className="flex items-center mr-4">
                      <input
                        type="radio"
                        id="customer"
                        name="userType"
                        value="customer"
                        checked={userType === 'customer'}
                        onChange={() => setUserType('customer')}
                        className="form-radio text-yellow-400 mr-2"
                      />
                      <label htmlFor="customer" className="text-gray-700">
                        Customer
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="admin"
                        name="userType"
                        value="admin"
                        checked={userType === 'admin'}
                        onChange={() => setUserType('admin')}
                        className="form-radio text-yellow-400 mr-2"
                      />
                      <label htmlFor="admin" className="text-gray-700">
                        Driver
                      </label>
                    </div>
                  </div>
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Name"
                  className="w-full mb-2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full mb-2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-full mb-2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  onChange={formik.handleChange}
                  value={formik.values.confirmPassword}
                />
                <button
                  type="submit"
                  className="w-full py-2 mb-2 bg-yellow-400 text-white font-semibold rounded hover:bg-yellow-500 transition-colors"
                >
                  Register
                </button>
                <p className="text-center text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-yellow-500 hover:text-yellow-600"
                  >
                    Login
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;