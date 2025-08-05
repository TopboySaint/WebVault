import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('webVault');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded.user); // Access the user data from the token
        console.log(decoded.user);
      } catch (error) {
        console.error("Invalid token:", error);
        // Redirect to login if token is invalid
      }
    }
  }, [])




  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex flex-col">
      <header className="bg-white shadow-lg py-6 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-extrabold text-blue-700 tracking-wide">WebVault</span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition">Logout</button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">

          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-t-4 border-blue-700">
            <h2 className="text-xl font-bold text-blue-700 mb-2">
              Hello, {user ? `${user.firstName} ${user.lastName}` : "User"}
            </h2>
            <p className="text-gray-600 mb-4">
              Account Number: <span className="font-semibold text-blue-700">
                {user ? user.accountNumber || "Loading..." : "Loading..."}
              </span>
            </p>

              <div className="text-center border p-5 w-32 rounded-lg">
                <span className="block text-lg font-bold text-blue-700">₦500,000</span>
                <span className="text-xs text-gray-500">Balance</span>
              </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-t-4 border-blue-700">
            <h2 className="text-lg font-bold text-blue-700 mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-4 w-full">
              <button className="bg-blue-700 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition">Send Money</button>
              <button className="bg-blue-100 text-blue-700 py-2 rounded-lg font-semibold hover:bg-blue-200 transition">Invest</button>
              <button className="bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition">View Statements</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col border-t-4 border-blue-700">
            <h2 className="text-lg font-bold text-blue-700 mb-4">Notifications</h2>
            <ul className="space-y-3">
              <li className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm">Your account was credited with ₦100,000</li>
              <li className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm">Investment matured: ₦20,000</li>
              <li className="bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm">Monthly statement is ready</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-blue-700">
          <h2 className="text-lg font-bold text-blue-700 mb-6">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-blue-50 text-blue-700">
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">Description</th>
                  <th className="py-2 px-4 text-left">Amount</th>
                  <th className="py-2 px-4 text-left">Type</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-4">Aug 1, 2025</td>
                  <td className="py-2 px-4">Salary Credit</td>
                  <td className="py-2 px-4 text-green-600">₦100,000</td>
                  <td className="py-2 px-4">Credit</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">Jul 28, 2025</td>
                  <td className="py-2 px-4">Investment Return</td>
                  <td className="py-2 px-4 text-green-600">₦20,000</td>
                  <td className="py-2 px-4">Credit</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">Jul 25, 2025</td>
                  <td className="py-2 px-4">Transfer to Jane</td>
                  <td className="py-2 px-4 text-red-600">₦10,000</td>
                  <td className="py-2 px-4">Debit</td>
                </tr>
                <tr>
                  <td className="py-2 px-4">Jul 20, 2025</td>
                  <td className="py-2 px-4">ATM Withdrawal</td>
                  <td className="py-2 px-4 text-red-600">₦5,000</td>
                  <td className="py-2 px-4">Debit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="bg-white py-6 mt-10 shadow-inner text-center text-gray-500 text-sm">
        &copy; 2025 WebVault. All rights reserved.
      </footer>
    </div>
  );
}

export default Dashboard
