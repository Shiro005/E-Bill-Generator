import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/20/solid';
import { saveAs } from 'file-saver';
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
    const adminNumber = '8668722207';
    const verificationNumber = Math.floor(100 + Math.random() * 900);
    const message = `Hello ${data.name}, your transaction details...`;
    // const whatsappUrl = `https://api.whatsapp.com/send?phone=91${data.mobile}&text=${encodeURIComponent(message)}`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=91${data.mobile}&text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 flex flex-col items-center justify-center p-6">
      <nav className="w-full bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-blue-700">Shop Name X WebReich</h1>
        </div>
      </nav>

      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl mt-8 animate-fade-in">
        {/* <h2 className="text-3xl font-bold mb-6 text-center">WebReich E-Bill</h2> */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Mobile No.:</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Amount:</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Product Name:</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Generate Bill & Send on WhatsApp
          </button>
        </form>

        {allUsers.length > 0 && (
          <button
            onClick={() => navigate('/data-saved')}
            className="mt-6 w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
          >
            View Saved Data
          </button>
        )}
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
        className="mb-4 w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
      >
        Download Data
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allUsers.map((user, index) => (
          <div key={index} className="bg-white p-4 shadow-md rounded-md">
            <p className="font-semibold">Name: {user.name}</p>
            <p>Mobile: {user.mobile}</p>
            <p>Amount: {user.amount}</p>
            <p>Product: {user.productName}</p>
            <p>Date: {new Date(user.date).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
