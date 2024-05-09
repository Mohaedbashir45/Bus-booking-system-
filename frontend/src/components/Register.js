import React from 'react';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';

const Register = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    onSubmit: (values) => {
      console.log(values);
    }
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow rounded-md">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
        Welcome to Basi Go
      </h1>
      <p className="text-gray-600 text-center mb-6">
        Embark on your next adventure with ease – book your bus tickets seamlessly with us!
      </p>
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Register
        </h1>
        <form onSubmit={formik.handleSubmit}>
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
            Already have an account? <Link to="/login" className="text-yellow-500 hover:text-yellow-600">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;