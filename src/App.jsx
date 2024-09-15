import React, { useState, useEffect } from 'react';
// import { TrashIcon } from '@heroicons/TrashIcon'; 
import { TrashIcon } from '@heroicons/react/16/solid';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    shopName: '',
    deposit: '',
    productName: ''
  });

  const [allUsers, setAllUsers] = useState(
    JSON.parse(localStorage.getItem('users')) || []
  );

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(allUsers));
  }, [allUsers]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUsers = [...allUsers, formData];
    setAllUsers(updatedUsers);
    sendWhatsAppMessage(formData);
  };

  const handleDelete = (index) => {
    const updatedUsers = allUsers.filter((_, i) => i !== index);
    setAllUsers(updatedUsers);
  };

  const sendWhatsAppMessage = (data) => {
    // Admin number (your number to send the message from)
    const adminNumber = '8668722207';

    // Message to be sent
    const verificationNumber = Math.floor(100 + Math.random() * 900); // Generates a unique 3-digit number

    const message = `*Elevate Your Business – Innovate, Accelerate, Dominate!*

Hello *${data.name}*, 

🎉 We are thrilled to have you on board! Here's a summary of your transaction with us:

📱 *Mobile Number*: ${data.mobile}
🏬 *Shop Name*: ${data.shopName}
💵 *Deposit Amount*: ₹${data.deposit}
🛒 *Product*: ${data.productName}

Your unique verification code is: *${verificationNumber}*

At *WebReich IT Solutions*, we strive to offer top-notch services tailored for you. Whether it’s web development, digital solutions, or cutting-edge IT support, we’ve got you covered!

📢 *About Us:*
We are a community-driven IT solutions provider, empowering businesses with the latest tech solutions and strategies. Our mission is to deliver excellence through innovation, helping clients unlock new growth opportunities in the digital landscape.

🔔 *Contact Us Anytime:*
📞 *Phone*: +91-8668722207
✉️ *Email*: webreichcommunity@gmail.com

Stay connected for exciting offers and services!
🌐 Visit us: https://webreich.vercel.app/

Thank you for trusting us with your business. We look forward to helping you succeed! 🤝

Best regards,  
*WebReich IT Solutions Team*
_“Empowering the Future with Technology”_`;



    // WhatsApp API URL
    const whatsappUrl = `https://api.whatsapp.com/send?phone=91${data.mobile}&text=${encodeURIComponent(
      message
    )}`;

    // Redirect to WhatsApp with the pre-filled message
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-xl">
        <h2 className="text-3xl font-bold mb-6 text-center">WebReich E-Bill</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Shop Name:</label>
            <input
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Deposit Amount:</label>
            <input
              type="number"
              name="deposit"
              value={formData.deposit}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">History</h3>
            <div className="space-y-4">
              {allUsers.map((user, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-sm"
                >
                  <div>
                    <p className="text-gray-800 font-medium">Name: {user.name}</p>
                    <p className="text-gray-600 text-sm">Mobile: {user.mobile}</p>
                    <p className="text-gray-600 text-sm">Shop: {user.shopName}</p>
                    <p className="text-gray-600 text-sm">Deposit: {user.deposit}</p>
                    <p className="text-gray-600 text-sm">Product: {user.productName}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <TrashIcon className="w-6 h-6" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
