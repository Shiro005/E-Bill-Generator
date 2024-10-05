import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { FaTrash } from 'react-icons/fa';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (username, password) => {
    if (username === 'shriyash' && password === '123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <Router>
      <Routes>
        {!isAuthenticated ? (
          <Route path="/" element={<LoginForm onLogin={handleLogin} />} />
        ) : (
          <>
            <Route path="/" element={<MainForm />} />
            <Route path="/data-saved" element={<DataSaved />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

function LoginForm({ onLogin }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(credentials.username, credentials.password);
  };

  return (
    <div className="min-h-screen bg-dark-green flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            className="w-full p-2 mb-4 border"
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            className="w-full p-2 mb-4 border"
            required
          />
        </div>
        <button type="submit" className="w-full bg-dark-green text-white p-2">
          Login
        </button>
      </form>
    </div>
  );
}

function MainForm() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    plantCategory: ''
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
      Thank you for connecting with us at Nisarg Plants Nursery! 🌿

      Your plant category: ${data.plantCategory}

      Your product is valid until 7 November 2024. 🌱
    `;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=91${data.mobile}&text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      <nav className="w-full bg-dark-green p-4">
        <h1 className="text-3xl font-bold text-white">Nisarg Plants Nursery</h1>
      </nav>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-xl mt-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Order Your Plants!</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600">Plant Category:</label>
            <input
              type="text"
              name="plantCategory"
              value={formData.plantCategory}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-dark-green text-white py-2 px-4 rounded-md"
          >
            Generate Bill & Send on WhatsApp
          </button>
        </form>

        {allUsers.length > 0 && (
          <button
            onClick={() => navigate('/data-saved')}
            className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-md"
          >
            View Saved Data
          </button>
        )}
        <p className="text-center mt-6 text-gray-600">Your product is valid up to 7 November 2024.</p>
      </div>

      <footer className="w-full mt-8 bg-dark-green p-4 text-center text-white">
        © 2024 Nisarg Plants Nursery
      </footer>
    </div>
  );
}

function DataSaved() {
  const [allUsers, setAllUsers] = useState(JSON.parse(localStorage.getItem('users')) || []);
  const [filteredUsers, setFilteredUsers] = useState(allUsers);
  const [filter, setFilter] = useState('');

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    const filtered = allUsers.filter(user =>
      user.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
      user.plantCategory.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleDelete = (index) => {
    const updatedUsers = allUsers.filter((_, i) => i !== index);
    setAllUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleDeleteAll = () => {
    setAllUsers([]);
    localStorage.setItem('users', JSON.stringify([]));
  };

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(filteredUsers.map(user => ({
      Name: user.name,
      Mobile: user.mobile,
      PlantCategory: user.plantCategory,
      Date: new Date(user.date).toLocaleString()
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, 'users_data.xlsx');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Saved User Data</h2>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Filter by name or plant category"
          value={filter}
          onChange={handleFilterChange}
          className="px-4 py-2 border rounded-md"
        />
        <button
          onClick={handleDownload}
          className="bg-green-600 text-white py-2 px-4 rounded-md"
        >
          Download Data
        </button>
        <button
          onClick={handleDeleteAll}
          className="bg-red-600 text-white py-2 px-4 rounded-md"
        >
          Delete All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user, index) => (
          <div key={index} className="bg-white p-4 shadow-md rounded-lg relative">
            <FaTrash
              onClick={() => handleDelete(index)}
              className="absolute top-2 right-2 text-red-600 cursor-pointer"
            />
            <p className="text-lg font-semibold text-gray-700">Name: {user.name}</p>
            <p className="text-gray-600">Mobile: {user.mobile}</p>
            <p className="text-gray-600">Plant Category: {user.plantCategory}</p>
            <p className="text-gray-600">Date: {new Date(user.date
            <p className="text-gray-600">Date: {new Date(user.date).toLocaleString()}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => window.history.back()}
        className="mt-8 bg-gray-600 text-white py-2 px-4 rounded-md"
      >
        Back to Form
      </button>
    </div>
  );
}

export default App;
