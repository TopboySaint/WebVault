import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios"
import { useState } from 'react';

const Signin = () => {
  const navigate = useNavigate();
  const url = "http://localhost:8080/signin";
  const [serverError, setServerError] = useState("");

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    }),
    onSubmit: async values => {
      setServerError("");
      try {
        const res = await axios.post(url, values);
        if (res.status === 200) {
          localStorage.setItem('webVault',res.data.token)
          navigate('/dashboard');
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setServerError(err.response.data.message);
        } else {
          setServerError("Incorrect email or password");
        }
        console.log(err);
      }
    },
  });

  // console.log(formik.values);
  // console.log(formik.errors);
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-10 border border-blue-100 mx-4">
        <h2 className="text-4xl font-extrabold text-blue-800 mb-8 text-center tracking-wide drop-shadow-lg" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
          Sign In to WebVault
        </h2>
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          {serverError && (
            <div className="text-red-600 text-base mb-4 text-center font-semibold bg-red-50 border border-red-200 rounded-lg py-2 px-4">
              {serverError}
            </div>
          )}
          <div>
            <label className="block text-gray-700 mb-2 font-medium" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-base mt-1">{formik.errors.email}</div>
            ) : null}
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-medium" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-base mt-1">{formik.errors.password}</div>
            ) : null}
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-700 text-white text-lg font-bold rounded-lg hover:bg-blue-800 transition shadow-md"
          >
            Sign In
          </button>
        </form>
        <p className="mt-8 text-xs text-gray-500 text-center">Forgot your password? <span className='underline cursor-pointer'>Reset it</span></p>
        <p className="mt-4 text-sm text-gray-700 text-center">
          You don't have an account yet?{' '}
          <Link to="/signup" className="text-blue-700 underline font-semibold hover:text-blue-900 transition">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
