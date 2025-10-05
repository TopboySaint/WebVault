import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import api from '../api/axios';

const Signup = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      phone: Yup.string().matches(/^[0-9]{10,15}$/, 'Enter a valid phone number').required('Phone number is required'),
      password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
      confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm your password')
    }),
    onSubmit: async values => {
      setServerError("");
      setIsCreatingAccount(true);
      try {
        const res = await api.post('/signup', values);
        if (res.status === 201) {
          navigate('/signin');
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setServerError(err.response.data.message);
        } else {
          setServerError("Can't perform this action right now");
        }
        console.log(err);
      } finally {
        setIsCreatingAccount(false);
      }
    }
  });



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-10 border border-blue-100 mx-4">
        <h2 className="text-4xl font-extrabold text-blue-800 mb-8 text-center tracking-wide drop-shadow-lg" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
          Open Your WebVault Bank Account
        </h2>
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          {serverError && (
            <div className="text-red-600 text-base mb-4 text-center font-semibold bg-red-50 border border-red-200 rounded-lg py-2 px-4">
              {serverError}
            </div>
          )}
          <div>
            <label className="block text-gray-700 mb-2 font-medium" htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Enter your first name"
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.firstName && formik.errors.firstName ? (
              <div className="text-red-500 text-xs mt-1">{formik.errors.firstName}</div>
            ) : null}
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-medium" htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Enter your last name"
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.lastName && formik.errors.lastName ? (
              <div className="text-red-500 text-xs mt-1">{formik.errors.lastName}</div>
            ) : null}
          </div>
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
              <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
            ) : null}
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-medium" htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.phone && formik.errors.phone ? (
              <div className="text-red-500 text-xs mt-1">{formik.errors.phone}</div>
            ) : null}
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-medium" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a password"
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
            ) : null}
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-medium" htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Re-enter your password"
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</div>
            ) : null}
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-700 text-white text-lg font-bold rounded-lg hover:bg-blue-800 transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={isCreatingAccount}
          >
            {isCreatingAccount ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : (
              'Open Account'
            )}
          </button>
        </form>
        <p className="mt-8 text-xs text-gray-500 text-center">By opening an account, you agree to WebVault's <span className='underline'>Terms & Conditions</span> and <span className='underline'>Privacy Policy</span>.</p>
        <p className="mt-4 text-sm text-gray-700 text-center">
          Already have an account?{' '}
          <Link to="/signin" className="text-blue-700 underline font-semibold hover:text-blue-900 transition">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;