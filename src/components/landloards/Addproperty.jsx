 
// "use client";

// import React, { useState } from "react";
// import { Input, Radio, Button, Upload, message, Select, Space, DatePicker } from "antd";
// import { InboxOutlined } from "@ant-design/icons";
// import { useRouter } from "next/navigation";
// import states from "@/components/statesData";
// import { useAddPropertyMutation } from "@/redux/fetures/property/addProperty";
// import toast, { Toaster } from "react-hot-toast";

// const { Dragger } = Upload;
// const { Option } = Select;

// const Addproperty = () => {
//   const router = useRouter();
//   const [selectedState, setSelectedState] = useState(null);
//   const [selectedSubState, setSelectedSubState] = useState(null);
//   const [openSubState, setOpenSubState] = useState(false);
//   const [fileList, setFileList] = useState([]);
//   const [date, setDate] = useState('')

//   const [addProperty, { isLoading }] = useAddPropertyMutation();
// const [errors, setErrors] = useState({});
//   const [form, setForm] = useState({
//     propertyType: "sell",
//     houseName: "",
//     place: "",
//     price: "",
//     type: "",
//     rooms: "",
//     baths: "",
//     city: "",
//     textArea: "",
  
//   });

//   const handleStateChange = (value) => {
//     setSelectedState(value);
//     setSelectedSubState(null);
//     setOpenSubState(true);
//   };

//   const handleSubStateChange = (value) => {
//     setSelectedSubState(value);
//     setOpenSubState(false);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (name, value) => {
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const uploadProps = {
//     name: 'images',
//     multiple: true,
//     fileList: fileList,
//     beforeUpload: (file) => {
//       // Check file type
//       const isImage = file.type.startsWith('image/');
//       if (!isImage) {
//         message.error('You can only upload image files!');
//         return Upload.LIST_IGNORE;
//       }
      
//       // Check file size (5MB limit)
//       const isLt5M = file.size / 1024 / 1024 < 5;
//       if (!isLt5M) {
//         message.error('Image must be smaller than 5MB!');
//         return Upload.LIST_IGNORE;
//       }

//       return false; // Prevent auto upload
//     },
//     onChange: (info) => {
//       if (info.fileList.length > 5) {
//         message.error('You can only upload a maximum of 5 images');
//         return;
//       }
//       setFileList(info.fileList);
//     },
//     onRemove: (file) => {
//       const index = fileList.indexOf(file);
//       const newFileList = fileList.slice();
//       newFileList.splice(index, 1);
//       setFileList(newFileList);
//     },
//   };

//   const validateForm = () => {
//     const requiredFields = [
//       'houseName',
//       'place',
//       'price',
//       'type',
//       'rooms',
//       'baths',
//       'city',
//       'textArea',
      
//     ];

//     for (const field of requiredFields) {
//       if (!form[field]) {
//         message.error(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
//         return false;
//       }
//     }

//     if (!selectedState || !selectedSubState) {
//       message.error('Please select both state and local government');
//       return false;
//     }

//     if (fileList.length === 0) {
//       message.error('Please upload at least one image');
//       return false;
//     }

//     return true;
//   };


   



//   const handleSubmit = async () => {
//     if (!validateForm()) {
//       return;
//     }

//     const formData = new FormData();
    
//     // Append form fields
//     Object.keys(form).forEach(key => {
//       formData.append(key, form[key]);
//     });
    
//     // Append location data
//     formData.append('date', date)
//     formData.append("state", selectedState);
//     formData.append("subState", selectedSubState);

//     // Append images
//     fileList.forEach((file) => {
//       formData.append('images', file.originFileObj);
//     });

//     try {
//       const response = await addProperty(formData).unwrap();
      
//       if (response?.code === 201) {
//         toast.success(response.message);
//         setTimeout(() => {
//           router.push('/myproperty');
//         }, 1000);
//       }
//     } catch (error) {
//       console.error("Error submitting property:", error);
//       toast.error(error.data?.message || "Failed to submit property");
//     }
//   };

//   const onChange = (date, dateString) => {
//     console.log(date, dateString);
//     setDate(dateString)
//   };

//   return (
//     <div className="md:container w-[95%] mx-auto my-12">
//       <Toaster />
//       <h1 className="text-center text-3xl font-bold text-green-600 mb-8">
//         Add Property
//       </h1>
  

//       <div className="max-w-4xl mx-auto bg-white p-8 border rounded-lg shadow-lg">
//         {/* Post Type */}
//         <div className="mb-6">
//           <p className="text-gray-700">Create Property:</p>
//           <Radio.Group
//             onChange={(e) =>
//               setForm((prev) => ({ ...prev, propertyType: e.target.value }))
//             }
//             value={form.propertyType}
//           >
//             <Radio value="sell">For Sell</Radio>
//             <Radio value="rent">For Rent</Radio>
//           </Radio.Group>
//         </div>

//         {/* File Upload */}
//         <div className="mb-6">
//           <p className="text-gray-700 mb-2">Upload Images (Max 5)</p>
//           <Dragger {...uploadProps}>
//             <p className="ant-upload-drag-icon">
//               <InboxOutlined />
//             </p>
//             <p className="ant-upload-text">
//               Click or drag files to this area to upload
//             </p>
//             <p className="ant-upload-hint">
//               Support for image files only. Maximum 5 images.
//             </p>
//           </Dragger>
//           <p className="text-sm text-gray-500 mt-2">
//             {fileList.length}/5 images uploaded
//           </p>
//         </div>

//         {/* House Details */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//           <div>
//             <p className="text-gray-700 mb-2">Sort Description</p>
//             <Input
//               name="houseName"
//               value={form.houseName}
//               placeholder="3 Bedrooms house for rent"
//               onChange={handleChange}
//             />
//           </div>
//           <div>
//             <p className="text-gray-700 mb-2">Address</p>
//             <Input
//               name="place"
//               value={form.place}
//               placeholder="Address"
//               onChange={handleChange}
//             />
//           </div>
//         </div>

//         {/* State & Local Government */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//           <div>
//             <p className="text-gray-700 mb-2">Select State</p>
//             <Select
//               className="w-full"
//               placeholder="Select a state"
//               value={selectedState}
//               onChange={handleStateChange}
//             >
//               {Object.keys(states).map((state) => (
//                 <Option key={state} value={state}>
//                   {state}
//                 </Option>
//               ))}
//             </Select>
//           </div>

//           <div>
//             <p className="text-gray-700 mb-2">Select Local Government</p>
//             <Select
//               className="w-full"
//               placeholder="Select a local government"
//               value={selectedSubState}
//               onChange={handleSubStateChange}
//               open={openSubState}
//               disabled={!selectedState}
//             >
//               {selectedState && states[selectedState]?.map((subState) => (
//                 <Option key={subState} value={subState}>
//                   {subState}
//                 </Option>
//               ))}
//             </Select>
//           </div>
//         </div>

//         {/* Price & Property Type */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//           <div>
//             <p className="text-gray-700 mb-2">Price</p>
//             <Input
//               name="price"
//               value={form.price}
//               placeholder="Price"
//               onChange={handleChange}
//               type="number"
//             />
//           </div>

//           <div>
//             <p className="text-gray-700 mb-2">Property Type</p>
//             <Select
//               className="w-full"
//               placeholder="Select property type"
//               value={form.type}
//               onChange={(value) => handleSelectChange("type", value)}
//             >
//               <Option value="duplex">Duplex</Option>
//               <Option value="bungalow">Bungalow</Option>
//               <Option value="studio">Studio</Option>
//               <Option value="flat">Flat</Option>
//               <Option value="self-con">Self-con</Option>
//               <Option value="warehouse">Warehouse</Option>
//               <Option value="other">Other</Option>
//             </Select>
//           </div>
//         </div>

//         {/* Rooms & Baths */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//           <div>
//             <p className="text-gray-700 mb-2">Number of Rooms</p>
//             <Input
//               name="rooms"
//               value={form.rooms}
//               placeholder="Number of Rooms"
//               onChange={handleChange}
//               type="number"
//             />
//           </div>
//           <div>
//             <p className="text-gray-700 mb-2">Number of Baths</p>
//             <Input
//               name="baths"
//               value={form.baths}
//               placeholder="Number of Baths"
//               onChange={handleChange}
//               type="number"
//             />
//           </div>
//         </div>

//         {/* City & Date */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//           <div>
//             <p className="text-gray-700 mb-2">City</p>
//             <Input
//               name="city"
//               value={form.city}
//               placeholder="City"
//               rules={[{ required: true, message: 'City is required' }]}
//               onChange={handleChange}
//             />
//           </div>
//           <div>
//             <p className="text-gray-700 mb-2">Available Date for Property</p>
//             <Space direction="vertical">
//         <DatePicker onChange={onChange} />
     
//   </Space>
//           </div>
//         </div>

//         {/* Description */}
//         <div className="mb-6">
//           <p className="text-gray-700 mb-2">Any Other Info</p>
//           <Input.TextArea
//             name="textArea"
//             value={form.textArea}
//             placeholder="Description of the property"
//             onChange={handleChange}
//             rows={4}
//           />
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-between">
//           <Button
//             onClick={() => router.push('/myproperty')}
//             className="bg-gray-800 text-white px-6 py-2 rounded-lg"
//           >
//             Back
//           </Button>
//           <Button
//             type="primary"
//             className="bg-green-600 text-white px-6 py-2 rounded-lg"
//             onClick={handleSubmit}
//             loading={isLoading}
//             disabled={isLoading}
//           >
//             {isLoading ? 'Submitting...' : 'Submit'}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Addproperty;
 

  
"use client";

import React, { useState } from "react";
import { Input, Radio, Button, Upload, message, Select, Space, DatePicker } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import states from "@/components/statesData";
import { useAddPropertyMutation } from "@/redux/fetures/property/addProperty";
import toast, { Toaster } from "react-hot-toast";

const { Dragger } = Upload;
const { Option } = Select;

const Addproperty = () => {
  const router = useRouter();
  const [selectedState, setSelectedState] = useState(null);
  const [selectedSubState, setSelectedSubState] = useState(null);
  const [openSubState, setOpenSubState] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [date, setDate] = useState('');

  const [addProperty, { isLoading }] = useAddPropertyMutation();
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    propertyType: "sell",
    houseName: "",
    place: "",
    price: "",
    type: "",
    rooms: "",
    baths: "",
    city: "",
    textArea: "",
  });

  const handleStateChange = (value) => {
    setSelectedState(value);
    setSelectedSubState(null);
    setOpenSubState(true);
  };

  const handleSubStateChange = (value) => {
    setSelectedSubState(value);
    setOpenSubState(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const uploadProps = {
    name: 'images',
    multiple: true,
    fileList: fileList,
    beforeUpload: (file) => {
      // Check file type
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return Upload.LIST_IGNORE;
      }

      // Check file size (5MB limit)
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Image must be smaller than 5MB!');
        return Upload.LIST_IGNORE;
      }

      return false; // Prevent auto upload
    },
    onChange: (info) => {
      if (info.fileList.length > 5) {
        message.error('You can only upload a maximum of 5 images');
        return;
      }
      setFileList(info.fileList);
    },
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
  };

  const validateForm = () => {
    let formErrors = {};
    const requiredFields = [
      'houseName',
      'place',
      'price',
      'type',
      'rooms',
      'baths',
      'city',
      'textArea',
    ];

    // Check for empty fields
    requiredFields.forEach((field) => {
      if (!form[field]) {
        formErrors[field] = `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`;
      }
    });

    // Validate price: ensure it's a number and greater than 0
    if (isNaN(form.price) || form.price <= 0) {
      formErrors.price = 'Please input a valid price';
    }

    // Validate rooms and baths: ensure they are numbers and greater than 0
    if (isNaN(form.rooms) || form.rooms <= 0) {
      formErrors.rooms = 'Please input a valid number of rooms';
    }
    if (isNaN(form.baths) || form.baths <= 0) {
      formErrors.baths = 'Please input a valid number of baths';
    }
   

    // Validate date: ensure it's selected
    if (!date) {
      formErrors.date = 'Please select an available date for the property';
    }
    if (!date) {
      formErrors.textArea = 'Please add other info';
    }

    // Validate state and sub-state selection
    if (!selectedState || !selectedSubState) {
      formErrors.location = 'Please select both state and local government';
    }

    // Validate image upload: ensure at least one image is uploaded
    if (fileList.length === 0) {
      formErrors.images = 'Please upload at least one image';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    
    // Append form fields
    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });
    
    // Append location data
    formData.append('date', date);
    formData.append("state", selectedState);
    formData.append("subState", selectedSubState);

    // Append images
    fileList.forEach((file) => {
      formData.append('images', file.originFileObj);
    });

    try {
      const response = await addProperty(formData).unwrap();
      
      if (response?.code === 201) {
        toast.success(response.message);
        setTimeout(() => {
          router.push('/myproperty');
        }, 1000);
      }
    } catch (error) {
      console.error("Error submitting property:", error);
      toast.error(error.data?.message || "Failed to submit property");
    }
  };

  const onChange = (date, dateString) => {
    console.log(date, dateString);
    setDate(dateString);
  };

  return (
    <div className="md:container w-[95%] mx-auto my-12">
      <Toaster />
      <h1 className="text-center text-3xl font-bold text-green-600 mb-8">
        Add Property
      </h1>
  

      <div className="max-w-4xl mx-auto bg-white p-8 border rounded-lg shadow-lg">
        {/* Post Type */}
        <div className="mb-6">
          <p className="text-gray-700">Create Property:</p>
          <Radio.Group
            onChange={(e) =>
              setForm((prev) => ({ ...prev, propertyType: e.target.value }))
            }
            value={form.propertyType}
          >
            <Radio value="sell">For Sell</Radio>
            <Radio value="rent">For Rent</Radio>
          </Radio.Group>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <p className="text-gray-700 mb-2">Upload Images (Max 5)</p>
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag files to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for image files only. Maximum 5 images.
            </p>
          </Dragger>
          {errors.images && <p className="text-red-500">{errors.images}</p>}
          <p className="text-sm text-gray-500 mt-2">
            {fileList.length}/5 images uploaded
          </p>
        </div>

        {/* House Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-700 mb-2">Sort Description</p>
            <Input
              name="houseName"
              value={form.houseName}
              placeholder="3 Bedrooms house for rent"
              onChange={handleChange}
            />
            {errors.houseName && <p className="text-red-500">{errors.houseName}</p>}
          </div>
          <div>
            <p className="text-gray-700 mb-2">Address</p>
            <Input
              name="place"
              value={form.place}
              placeholder="Address"
              onChange={handleChange}
            />
            {errors.place && <p className="text-red-500">{errors.place}</p>}
          </div>
        </div>

        {/* State & Local Government */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-700 mb-2">Select State</p>
            <Select
              className="w-full"
              placeholder="Select a state"
              value={selectedState}
              onChange={handleStateChange}
            >
              {Object.keys(states).map((state) => (
                <Option key={state} value={state}>
                  {state}
                </Option>
              ))}
            </Select>
            {errors.location && <p className="text-red-500">{errors.location}</p>}
          </div>

          <div>
            <p className="text-gray-700 mb-2">Select Local Government</p>
            <Select
              className="w-full"
              placeholder="Select a local government"
              value={selectedSubState}
              onChange={handleSubStateChange}
              open={openSubState}
              disabled={!selectedState}
            >
              {selectedState && states[selectedState]?.map((subState) => (
                <Option key={subState} value={subState}>
                  {subState}
                </Option>
              ))}
            </Select>
            {errors.location && <p className="text-red-500">{errors.location}</p>}
          </div>
        </div>

        {/* Price & Property Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-700 mb-2">Price</p>
            <Input
              name="price"
              value={form.price}
              placeholder="Price"
              onChange={handleChange}
              type="number"
            />
            {errors.price && <p className="text-red-500">{errors.price}</p>}
          </div>

          <div>
            <p className="text-gray-700 mb-2">Property Type</p>
            <Select
              className="w-full"
              placeholder="Select property type"
              value={form.type}
              onChange={(value) => handleSelectChange("type", value)}
            >
              <Option value="duplex">Duplex</Option>
              <Option value="bungalow">Bungalow</Option>
              <Option value="studio">Studio</Option>
              <Option value="flat">Flat</Option>
              <Option value="self-con">Self-con</Option>
              <Option value="warehouse">Warehouse</Option>
              <Option value="other">Other</Option>
            </Select>
          </div>
        </div>

        {/* Rooms & Baths */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-700 mb-2">Number of Rooms</p>
            <Input
              name="rooms"
              value={form.rooms}
              placeholder="Number of Rooms"
              onChange={handleChange}
              type="number"
            />
            {errors.rooms && <p className="text-red-500">{errors.rooms}</p>}
          </div>
          <div>
            <p className="text-gray-700 mb-2">Number of Baths</p>
            <Input
              name="baths"
              value={form.baths}
              placeholder="Number of Baths"
              onChange={handleChange}
              type="number"
            />
            {errors.baths && <p className="text-red-500">{errors.baths}</p>}
          </div>
        </div>

        {/* City & Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-700 mb-2">City</p>
            <Input
              name="city"
              value={form.city}
              placeholder="City"
              onChange={handleChange}
            />
            {errors.city && <p className="text-red-500">{errors.city}</p>}
          </div>
          <div>
            <p className="text-gray-700 mb-2">Available Date for Property</p>
            <Space direction="vertical">
              <DatePicker onChange={onChange} />
            </Space>
            {errors.date && <p className="text-red-500">{errors.date}</p>}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-gray-700 mb-2">Any Other Info</p>
          <Input.TextArea
            name="textArea"
            value={form.textArea}
            placeholder="Description of the property"
            onChange={handleChange}
            rows={4}
          />
          {errors.textArea && <p className="text-red-500">{errors.textArea}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button
            onClick={() => router.push('/myproperty')}
            className="bg-gray-800 text-white px-6 py-2 rounded-lg"
          >
            Back
          </Button>
          <Button
            type="primary"
            className="bg-green-600 text-white px-6 py-2 rounded-lg"
            onClick={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Addproperty;
