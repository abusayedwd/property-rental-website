
import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import Header from './customComponent/Header';

const AdvertiseSection = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const emailAddress = "contact@mynexthome.ng";
  
  const handleEmailClick = () => {
    // Open Gmail directly in a new tab
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}`, '_blank');
  };
  
  const showModal = () => {
    setIsModalVisible(true); // Open the modal
  };
  
  const handleCancel = () => {
    setIsModalVisible(false); // Close the modal
  };

  return (
    <section className="p-6 container ">
      <Header size="large" className="text-[#2FC639] mt-5 py-4">Advertise With Us</Header>
      
      {/* Main content button to trigger modal */}
      <div className=" p-6 rounded-lg shadow-md border border-gray-300">
        <h2 className="text-3xl font-bold mb-4">Advertise Your Business</h2>
        
        <p className="mb-4">You can advertise your business on our website.</p>
        {/* <p className="mb-4">Send us a banner of 1200 x 400.</p>
        <p className="mb-4">Price:₦ 50,000 per month.</p>
        <p className="mb-4">
          Send us your banner of not more than 300KB to our email - 
          <a 
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}`}
            target="_blank" // Opens in a new tab
            className="underline text-yellow-300 hover:text-yellow-100"
          >
            {emailAddress}
          </a>
        </p> */}
        {/* Button to open the full details modal */}
        <Button
          type="primary"
          icon={<MailOutlined />}
          onClick={showModal} // Show the modal
          className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white"
        >
          View Full Advertisement Details
        </Button>
      </div>

      {/* Full Details Modal */}
      <Modal
        title="Full Advertisement Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null} // No footer buttons
        centered
        width="80%" // Adjust the width for full-page effect
        bodyStyle={{ height: '80vh', overflowY: 'auto' }} // Allow scrolling if content overflows
      >
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Looking to promote your brand or business? We’ve got you covered!</h2>
          <p className="mb-4">Reach a highly engaged audience by placing your banner on our front page. Here are all the details you need:</p>
          
          <h3 className="text-lg font-semibold">What We Offer:</h3>
          <ul className="list-disc ml-8 mb-4">
            <li><strong>Banner Size:</strong> 320 x 100 pixels</li>
            <li><strong>Placement:</strong> Front page for maximum visibility</li>
            <li><strong>Duration:</strong> 30 days of impactful exposure</li>
            <li><strong>Cost:</strong> ₦100,000 per 30 days</li>
          </ul>

          <h3 className="text-lg font-semibold">How to Advertise:</h3>
          <ol className="list-decimal ml-8 mb-4">
            <li>Design a 320 x 100-pixel banner.</li>
            <li>Send your banner to us at <a href={`mailto:${emailAddress}`} className="underline text-blue-500">{emailAddress}</a></li>
            <li>We’ll review your banner and get in touch to finalize the process.</li>
          </ol>

          <h3 className="text-lg font-semibold">Terms and Conditions:</h3>
          <ul className="list-disc ml-8 mb-4">
            <li>Banners must not exceed 300KB in size.</li>
            <li>Price is ₦100,000 for 30 days of exposure on the front page.</li>
            <li>The banner will be displayed for the agreed duration and location.</li>
          </ul>

          <p className="font-semibold mt-6">Let's work together to spotlight your brand in front of the audience it deserves!</p>

          {/* Button to trigger email action */}
          <Button
            type="primary"
            icon={<MailOutlined />}
            onClick={handleEmailClick} // Opens Gmail in a new tab
            className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            Send Your Banner
          </Button>
        </div>
      </Modal>
    </section>
  );
};

export default AdvertiseSection;
