"use client";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { DHAKA, TILE_URL, TILE_ATTRIBUTION, pinIcon } from "./leafletBase";

const ClickToPlace = ({ onPick }) => {
  useMapEvents({ click: (e) => onPick({ lat: e.latlng.lat, lng: e.latlng.lng }) });
  return null;
};

const FlyTo = ({ target }) => {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], target.zoom || 16, { duration: 0.8 });
  }, [target, map]);
  return null;
};

/**
 * Landlord picks the property's spot: click the map or drag the pin.
 * value: { lat, lng } | null, onChange(value)
 */
const LocationPickerMap = ({ value, onChange, flyTarget, height = 320 }) => {
  const [center] = useState(value ? [value.lat, value.lng] : DHAKA);
  const round = (n) => Math.round(n * 1e6) / 1e6;
  const pick = ({ lat, lng }) => onChange({ lat: round(lat), lng: round(lng) });

  return (
    <MapContainer center={center} zoom={value ? 16 : 12} scrollWheelZoom={false} style={{ height, width: "100%" }} className="z-0">
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
      <ClickToPlace onPick={pick} />
      <FlyTo target={flyTarget} />
      {value && (
        <Marker
          position={[value.lat, value.lng]}
          icon={pinIcon}
          draggable
          eventHandlers={{ dragend: (e) => pick(e.target.getLatLng()) }}
        />
      )}
    </MapContainer>
  );
};

export default LocationPickerMap;
