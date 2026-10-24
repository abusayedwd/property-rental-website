"use client";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Skeleton } from "antd";
import ListingForm from "./ListingForm";
import { useUpdatePropertyMutation } from "@/redux/fetures/property/editProperty";
import { useGetSinglepropertyQuery } from "@/redux/fetures/property/getPropertyById";

const EditProperty = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetSinglepropertyQuery(id, { skip: !id });
  const [updateProperty, { isLoading: saving }] = useUpdatePropertyMutation();
  const property = data?.data?.attributes;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Skeleton active paragraph={{ rows: 12 }} />
      </div>
    );
  }
  if (!property) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-navy">Listing not found</h1>
        <Link href="/myproperty" className="mt-6 inline-block font-medium text-primaryDark hover:underline">Back to my properties</Link>
      </div>
    );
  }
  return <ListingForm mode="edit" initial={property} onSubmit={(formData) => updateProperty({ formData, id }).unwrap()} submitting={saving} />;
};

export default EditProperty;
