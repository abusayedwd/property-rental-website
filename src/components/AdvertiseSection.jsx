
import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useGetContactQuery } from '@/redux/fetures/information/contact';

const AdvertiseSection = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  // Email comes from the contact details set in the admin dashboard
  const { data: contact } = useGetContactQuery();
  const emailAddress = contact?.data?.attributes?.[0]?.email || "";
  
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
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-6 rounded-3xl bg-navy p-8 shadow-xl md:flex-row md:items-center md:justify-between md:p-12">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Advertise with us</p>
          <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">Put your business in front of home seekers</h2>
          <p className="mt-3 text-white/70">Place your banner on our home page and reach people actively looking for a new home.</p>
        </div>
        {/* <p className="mb-4">Send us a banner of 1200 x 400.</p>
        <p className="mb-4">Price:$ 50,000 per month.</p>
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
          size="large"
          className="!h-12 shrink-0 !rounded-full !border-none !bg-primary !px-6 !font-semibold hover:!bg-primaryDark"
        >
          See advertising details
        </Button>
      </div>

      {/* Full Details Modal */}
      <Modal
        title="Full Advertisement Details"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null} // No footer buttons
        centered
        width={720}
        styles={{ body: { maxHeight: '75vh', overflowY: 'auto' } }}
      >
        <div className="p-1 sm:p-4">
          <h2 className="text-2xl font-semibold mb-4">Looking to promote your brand or business? We’ve got you covered!</h2>
          <p className="mb-4">Reach a highly engaged audience by placing your banner on our front page. Here are all the details you need:</p>
          
          <h3 className="text-lg font-semibold">What We Offer:</h3>
          <ul className="list-disc ml-8 mb-4">
            <li><strong>Banner Size:</strong> 320 x 100 pixels</li>
            <li><strong>Placement:</strong> Front page for maximum visibility</li>
            <li><strong>Duration:</strong> 30 days of impactful exposure</li>
            <li><strong>Cost:</strong> $100,000 per 30 days</li>
          </ul>

          <h3 className="text-lg font-semibold">How to Advertise:</h3>
          <ol className="list-decimal ml-8 mb-4">
            <li>Design a 320 x 100-pixel banner.</li>
            <li>Send your banner to us at <a href={`mailto:${emailAddress}`} className="underline text-primary">{emailAddress}</a></li>
            <li>We’ll review your banner and get in touch to finalize the process.</li>
          </ol>

          <h3 className="text-lg font-semibold">Terms and Conditions:</h3>
          <ul className="list-disc ml-8 mb-4">
            <li>Banners must not exceed 300KB in size.</li>
            <li>Price is $100,000 for 30 days of exposure on the front page.</li>
            <li>The banner will be displayed for the agreed duration and location.</li>
          </ul>

          <p className="font-semibold mt-6">Let's work together to spotlight your brand in front of the audience it deserves!</p>

          {/* Button to trigger email action */}
          <Button
            type="primary"
            icon={<MailOutlined />}
            onClick={handleEmailClick} // Opens Gmail in a new tab
            className="mt-4 bg-primary hover:bg-primaryDark text-white"
          >
            Send Your Banner
          </Button>
        </div>
      </Modal>
    </section>
  );
};

export default AdvertiseSection;
