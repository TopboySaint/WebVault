import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [showSendMoney, setShowSendMoney] = useState(false);
  const [sendAccount, setSendAccount] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [sendSuccess, setSendSuccess] = useState("");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user && user.accountNumber) {
      axios
        .get(`http://localhost:8080/notifications/${user.accountNumber}`)
        .then((res) => setNotifications(res.data))
        .catch(() => setNotifications([]));
    }
  }, [user]);

  const formatBalance = (balance) => {
    return balance?.toLocaleString() || "0";
  };

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("webVault");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // console.log(decoded.user);
        setUser(decoded.user);
      } catch (error) {
        console.error("Invalid token:", error);
        navigate("/signin");
      }
    }
  }, [navigate]);

  const logout = () => {
    const confirmation = confirm('Are you sure you want to logout?')
    if(confirmation){
      localStorage.removeItem("webVault");
      navigate("/signin");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex flex-col">
      <header className="bg-white shadow-lg py-6 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-extrabold text-blue-700 tracking-wide">
            WebVault
          </span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
            Dashboard
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-t-4 border-blue-700">
            <h2 className="text-xl font-bold text-blue-700 mb-2">
              Hello, {user ? `${user.firstName} ${user.lastName}` : "User"}
            </h2>
            <p className="text-gray-600 mb-4">
              Account Number:{" "}
              <span className="font-semibold text-blue-700">
                {user ? user.accountNumber || "Loading..." : "Loading..."}
              </span>
            </p>

            <div className="text-center border p-5 w-32 rounded-lg">
              <span className="block text-lg font-bold text-blue-700">
                {" "}
                ₦{user ? formatBalance(user.balance) : "Loading..."}
              </span>
              <span className="text-xs text-gray-500">Balance</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-t-4 border-blue-700">
            <h2 className="text-lg font-bold text-blue-700 mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-col gap-4 w-full">
              <button
                className="bg-blue-700 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition"
                onClick={() => setShowSendMoney(true)}
              >
                Send Money
              </button>

              {showSendMoney && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border-t-4 border-blue-700 relative animate-fadeIn">
                    <button
                      className="absolute top-3 right-3 text-gray-400 hover:text-blue-700 text-2xl font-bold focus:outline-none"
                      onClick={() => {
                        setShowSendMoney(false);
                        setSendAccount("");
                        setSendAmount("");
                        setSendError("");
                        setSendSuccess("");
                      }}
                      aria-label="Close"
                    >
                      &times;
                    </button>
                    <h3 className="text-xl font-bold text-blue-700 mb-4 text-center">
                      Send Money
                    </h3>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setSendError("");
                        setSendSuccess("");
                        if (!sendAccount || !sendAmount) {
                          setSendError("Please fill in all fields.");
                          return;
                        }
                        if (isNaN(sendAmount) || Number(sendAmount) <= 0) {
                          setSendError("Enter a valid amount.");
                          return;
                        }
                        if (!user || !user.accountNumber) {
                          setSendError("User account not loaded.");
                          return;
                        }
                        setSending(true);
                        try {
                          const res = await axios.post(
                            "http://localhost:8080/transfer",
                            {
                              senderAccountNumber: user.accountNumber,
                              recipientAccountNumber: sendAccount,
                              amount: sendAmount,
                            }
                          );
                          setSendSuccess(
                            res.data.message || "Transfer successful!"
                          );
                          setUser((prev) => ({
                            ...prev,
                            balance: res.data.senderBalance,
                          }));
                          setSendAccount("");
                          setSendAmount("");
                        } catch (err) {
                          if (
                            err.response &&
                            err.response.data &&
                            err.response.data.message
                          ) {
                            setSendError(err.response.data.message);
                          } else {
                            setSendError("Network error. Please try again.");
                          }
                        } finally {
                          setSending(false);
                        }
                      }}
                      className="flex flex-col gap-4"
                    >
                      <label className="text-sm font-semibold text-gray-700">
                        Account Number
                      </label>
                      <input
                        type="text"
                        className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter account number"
                        value={sendAccount}
                        onChange={(e) => setSendAccount(e.target.value)}
                        maxLength={12}
                        required
                      />
                      <label className="text-sm font-semibold text-gray-700">
                        Amount (₦)
                      </label>
                      <input
                        type="number"
                        className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter amount"
                        value={sendAmount}
                        onChange={(e) => setSendAmount(e.target.value)}
                        min={1}
                        required
                      />
                      {sendError && (
                        <div className="text-red-600 text-sm text-center">
                          {sendError}
                        </div>
                      )}
                      {sendSuccess && (
                        <div className="text-green-600 text-sm text-center">
                          {sendSuccess}
                        </div>
                      )}
                      <button
                        type="submit"
                        className="bg-blue-700 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition mt-2 disabled:opacity-60"
                        disabled={sending}
                      >
                        {sending ? "Transferring..." : "Transfer"}
                      </button>
                    </form>
                  </div>
                </div>
              )}
              <button className="bg-blue-100 text-blue-700 py-2 rounded-lg font-semibold hover:bg-blue-200 transition">
                Invest
              </button>
              <button className="bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition">
                View Statements
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col border-t-4 border-blue-700">
            <h2 className="text-lg font-bold text-blue-700 mb-4">
              Notifications
            </h2>
            <ul className="space-y-3">
              {notifications.length === 0 && <li>No notifications yet.</li>}
              {notifications.map((notification, i) => (
                <li
                  key={i}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    notification.type === "credit"
                      ? "bg-green-50 text-green-700"
                      : notification.type === "debit"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-gray-50 text-gray-700"
                  }`}
                >
                  {notification.message}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-blue-700">
          <h2 className="text-lg font-bold text-blue-700 mb-6">
            Recent Transactions
          </h2>
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
};

export default Dashboard;
