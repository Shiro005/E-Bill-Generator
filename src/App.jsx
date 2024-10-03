import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainForm />} />
        <Route path="/data-saved" element={<DataSaved />} />
      </Routes>
    </Router>
  );
}

function MainForm() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    amount: '',
    productName: ''
  });

  const [allUsers, setAllUsers] = useState(
    JSON.parse(localStorage.getItem('users')) || []
  );

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(allUsers));
  }, [allUsers]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUsers = [...allUsers, { ...formData, date: new Date() }];
    setAllUsers(updatedUsers);
    sendWhatsAppMessage(formData);
  };

  const sendWhatsAppMessage = (data) => {
    const message = `
      Hello ${data.name},
      Thank you for shopping with us! 🎉

      Your transaction details:
      - Product: ${data.productName}
      - Amount: ₹${data.amount}

      We hope to see you again soon! For more updates, follow us on Instagram:
      https://instagram.com/yourstore

      Subscribe to our YouTube channel for new products and offers:
      https://youtube.com/yourstore

      Thanks again!  
      - YourStore Team
    `;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=91${data.mobile}&text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      <nav className="w-full bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-gray-900">YourStore</h1>
        </div>
      </nav>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-xl mt-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Thank You for Shopping!</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600">Mobile No.:</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600">Amount:</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600">Product Name:</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200"
          >
            Generate Bill & Send on WhatsApp
          </button>
        </form>

        {allUsers.length > 0 && (
          <button
            onClick={() => navigate('/data-saved')}
            className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
          >
            View Saved Data
          </button>
        )}
      </div>

      {/* Pricing Section */}
      <div className="w-full max-w-4xl mt-12 bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Our Pricing Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Website Pricing */}
          <div className="p-6 bg-gray-50 border border-gray-300 rounded-lg text-left">
            <h3 className="text-xl font-semibold mb-4 text-indigo-600">Website Development</h3>
            <p className="text-gray-600">₹15,000 One-time</p>
            <ul className="mt-4 text-sm text-gray-500">
              <li>✔️ Custom Design</li>
              <li>✔️ Free SSL & Hosting</li>
              <li>✔️ SEO Optimized</li>
              <li>✔️ Latest Tech Stack</li>
            </ul>
          </div>
          {/* Bulk Messaging */}
          <div className="p-6 bg-gray-50 border border-gray-300 rounded-lg text-left">
            <h3 className="text-xl font-semibold mb-4 text-indigo-600">BulkBlast</h3>
            <p className="text-gray-600">₹1,499 / Month</p>
            <ul className="mt-4 text-sm text-gray-500">
              <li>✔️ Send Bulk WhatsApp Messages</li>
              <li>✔️ Custom Templates</li>
              <li>✔️ No Spam</li>
            </ul>
          </div>
          {/* personal message sender with user data saver  */}
          <div className="p-6 bg-gray-50 border border-gray-300 rounded-lg text-left">
            <h3 className="text-xl font-semibold mb-4 text-indigo-600">DirectConnect</h3>
            <p className="text-gray-600">₹1,499 / Month</p>
            <ul className="mt-4 text-sm text-gray-500">
              <li>✔️ Send personal WhatsApp Messages</li>
              <li>✔️ Send billing message on whatsapp</li>
              <li>✔️ Happy user & share you social media pages details</li>
              <li>✔️ Updates on WhatsApp</li>
            </ul>
          </div>
          {/* Combo Offer */}
          <div className="p-6 bg-gray-50 border border-gray-300 rounded-lg text-left">
            <h3 className="text-xl font-semibold mb-4 text-indigo-600">Combo Offer ConnectFusion</h3>
            <p className="text-gray-600">₹1,999 / Month</p>
            <ul className="mt-4 text-sm text-gray-500">
              <li>✔️ Bulk Messaging + User Data Saver</li>
              <li>✔️ Personal Message Sender</li>
              <li>✔️ Combo Discount</li>
            </ul>
          </div>
        </div>
        <p className="mt-6 text-indigo-600 text-center">
          Get all two products for just ₹1,999 / Month!
        </p>
        <p className="mt-0 text-indigo-600 text-center">
          If you want to make your website then its one-time price is ₹14,999 life-time and maintenance charges is applicable 
        </p>
      </div>
    </div>
  );
}

function DataSaved() {
  const [allUsers] = useState(JSON.parse(localStorage.getItem('users')) || []);

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(allUsers.map(user => ({
      Name: user.name,
      Mobile: user.mobile,
      Amount: user.amount,
      Product: user.productName,
      Date: new Date(user.date).toLocaleString()
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, 'users_data.xlsx');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Saved User Data</h2>
      <button
        onClick={handleDownload}
        className="mb-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
      >
        Download Data
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allUsers.map((user, index) => (
          <div key={index} className="bg-white p-4 shadow-md rounded-lg">
            <p className="text-lg font-semibold text-gray-700">Name: {user.name}</p>
            <p className="text-gray-600">Mobile: {user.mobile}</p>
            <p className="text-gray-600">Amount: ₹{user.amount}</p>
            <p className="text-gray-600">Product: {user.productName}</p>
            <p className="text-gray-600">Date: {new Date(user.date).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
