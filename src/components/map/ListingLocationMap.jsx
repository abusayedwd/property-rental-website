"use client";
import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { TILE_URL, TILE_ATTRIBUTION, pinIcon } from "./leafletBase";

// Read-only map with the listing's pin
const ListingLocationMap = ({ lat, lng, height = 320 }) => (
  <MapContainer center={[lat, lng]} zoom={15} scrollWheelZoom={false} style={{ height, width: "100%" }} className="z-0">
    <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
    <Marker position={[lat, lng]} icon={pinIcon} />
  </MapContainer>
);

export default ListingLocationMap;
