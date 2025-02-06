

import React from 'react';
import { Typography, Divider } from 'antd';
import Header from '../customComponent/Header';
 

 

const FullAboute = () => {
  return (
    <div className="bg-white p-6 max-w-4xl mx-auto mt-12 shadow-md rounded-lg">
      <Header size="extraLarge" className="text-green-700 mt-5 text-center mb-12">
         About us
      </Header>
      <p>
        At <strong>Pawed</strong>, your privacy is a top priority. This Privacy Policy describes how we collect, use, disclose, and safeguard your personal information when you use our website pawedapp.com. By accessing our website, you agree to the terms outlined in this policy.
      </p>

   

    
      <p>
        We gather the following types of information to provide you with seamless services:
      </p>
      <ul className="list-disc ml-6">
        <li><strong>Personal Information:</strong> This includes any information that identifies you, such as:
          <ul className="list-disc ml-6">
            <li>Full name</li>
            <li>Email address</li>
            <li>Payment details for secure transactions</li>
            <li>Social media IDs (if applicable)</li>
          </ul>
        </li>
        <li><strong>Non-Personal Information:</strong> This includes:
          <ul className="list-disc ml-6">
            <li>Technical details automatically collected when you interact with our website, such as browser type and operating system.</li>
            <li>Device type and usage patterns</li>
          </ul>
        </li>
      </ul>

   
    
      <p>
        The data we collect is used for the following purposes:
      </p>
      <ul className="list-disc ml-6">
        <li>Account registration and management</li>
        <li>Improving the website functionality</li>
        <li>Responding to customer service requests</li>
        <li>Facilitating secure payments</li>
        <li>Complying with legal requirements</li>
      </ul>

     

       
      <p>
        We take the following precautions to safeguard your data:
      </p>
      <ul className="list-disc ml-6">
        <li>Regularly updating our security measures</li>
        <li>Encouraging users to use strong passwords</li>
      </ul>

   

      <h1>Your Rights</h1>
      <p>
        You can manage your data preferences via account settings. Contact us if you have further privacy concerns.
      </p>
    </div>
  );
};

export default FullAboute;
