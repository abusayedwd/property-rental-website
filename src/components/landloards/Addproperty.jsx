"use client";
import React from "react";
import ListingForm from "./ListingForm";
import { useAddPropertyMutation } from "@/redux/fetures/property/addProperty";

const Addproperty = () => {
  const [addProperty, { isLoading }] = useAddPropertyMutation();
  return <ListingForm mode="add" onSubmit={(formData) => addProperty(formData).unwrap()} submitting={isLoading} />;
};

export default Addproperty;
