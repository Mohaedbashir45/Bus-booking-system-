import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const Register = () => {
  const [userType, setUserType] = useState('passenger');
  const [registrationMessage, setRegistrationMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async (values) => {

      setIsSubmitting(true);
      try {
        const response = await fetch('http://127.0.0.1:5555/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: values.username,
            email: values.email,
            password: values.password,
            role: userType,
          }),
        });

        if (response.status >= 200 && response.status < 300) {
          setRegistrationMessage('Registration successful. Welcome!');
          resetForm();
        } else {
          setRegistrationMessage('Registration failed. Please try again.');
        }
      } catch (error) {

        console.error(error);
        setRegistrationMessage('An error occurred during registration. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const resetForm = () => {
    formik.resetForm();
    setUserType('passenger');
  };

  useEffect(() => {
    return () => setRegistrationMessage(null);
  }, []);

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
              {registrationMessage && (
                <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">
                  {registrationMessage}
                </div>
              )}
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-4">
                  <label className="block mb-2 font-semibold text-gray-700">
                    User Type
                  </label>
                  <div className="flex items-center">
                    <div className="flex items-center mr-4">
                      <input
                        type="radio"
                        id="passenger"
                        name="userType"
                        value="passenger"
                        checked={userType === 'passenger'}
                        onChange={() => setUserType('passenger')}
                        className="form-radio text-yellow-400 mr-2"
                      />
                      <label htmlFor="passenger" className="text-gray-700">
                        Passenger
                      </label>
                    </div>
                    <div className="flex items-center mr-4">
                      <input
                        type="radio"
                        id="driver"
                        name="userType"
                        value="driver"
                        checked={userType === 'driver'}
                        onChange={() => setUserType('driver')}
                        className="form-radio text-yellow-400 mr-2"
                      />
                      <label htmlFor="driver" className="text-gray-700">
                        Driver
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
                        Admin
                      </label>
                    </div>
                  </div>
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Username"
                  className="w-full mb-2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  onChange={formik.handleChange}
                  value={formik.values.username}
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Registering...' : 'Register'}
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