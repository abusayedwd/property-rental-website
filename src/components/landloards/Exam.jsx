import React, { useState } from "react";
import { Select, Button } from "antd";
import "antd/dist/reset.css"; // Ant Design styles
import states from '@/components/statesData'
const { Option } = Select;

const Exam = () => {
  const [selectedState, setSelectedState] = useState(null);
  const [selectedSubState, setSelectedSubState] = useState(null);
  const [openSubState, setOpenSubState] = useState(false); // Controls local government dropdown visibility
  
  const handleStateChange = (value) => {
    setSelectedState(value);
    setSelectedSubState(null); // Reset local government selection
    setOpenSubState(true); // Automatically open local government dropdown
  };

  const handleSubStateChange = (value) => {
    setSelectedSubState(value);
    setOpenSubState(false); // Close dropdown after selection
  };

  const handleButtonClick = () => {
    console.log("Selected State:", selectedState);
    console.log("Selected Local Government:", selectedSubState);
  };

  return (
    <div className="flex flex-col items-center mt-10">
      {/* State Dropdown (Always Visible) */}
      <label className="text-lg font-semibold mb-2">State</label>
      <Select
        className="w-72"
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

      {/* Local Government Dropdown (Opens Automatically) */}
      <label className="text-lg font-semibold mt-4 mb-2">Local Government</label>
      <Select
        className="w-72"
        placeholder="Select a local government"
        value={selectedSubState}
        onChange={handleSubStateChange}
        open={openSubState} // Auto open when state is selected
        onDropdownVisibleChange={setOpenSubState} // Keeps dropdown open until a selection is made
        disabled={!selectedState} // Disable if no state is selected
      >
        {(selectedState ? states[selectedState] : []).map((subState) => (
          <Option key={subState} value={subState}>
            {subState}
          </Option>
        ))}
      </Select>

      {/* Button to Get Console Log */}
      <Button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleButtonClick}
        disabled={!selectedState || !selectedSubState} // Disable until both are selected
      >
        Get Selected Values
      </Button>
    </div>
  );
};

export default Exam;
