import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from 'react';
import api from '../api/axios';

const Signin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Get the intended destination from location state, default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

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
      setIsSigningIn(true);
      try {
        const res = await api.post('/signin', values);
        if (res.status === 200) {
          localStorage.setItem('webVault',res.data.token)
          navigate(from, { replace: true });
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setServerError(err.response.data.message);
        } else {
          setServerError("Incorrect email or password");
        }
        console.log(err);
      } finally {
        setIsSigningIn(false);
      }
    },
  });

  // console.log(formik.values);
  // console.log(formik.errors);
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 px-4 py-6 sm:p-6">
      <div className="w-full max-w-md sm:max-w-lg bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-6 sm:p-10 border border-blue-100 mx-auto">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-blue-800 mb-6 sm:mb-8 text-center tracking-tight sm:tracking-wide drop-shadow-lg" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
          Sign In to WebVault
        </h2>
        <form className="space-y-5 sm:space-y-6" onSubmit={formik.handleSubmit}>
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
            className="w-full py-3 bg-blue-700 text-white text-lg font-bold rounded-lg hover:bg-blue-800 transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={isSigningIn}
          >
            {isSigningIn ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        <p className="mt-6 sm:mt-8 text-[10px] sm:text-xs text-gray-500 text-center">Forgot your password? <span className='underline cursor-pointer'>Reset it</span></p>
        <p className="mt-4 text-xs sm:text-sm text-gray-700 text-center">
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
