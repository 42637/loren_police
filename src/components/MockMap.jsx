import RealMap from './RealMap';

export default function MockMap({ 
  markers = [], 
  lat,
  lng,
  locationName,
  height = "260px" 
}) {
  return (
    <RealMap 
      markers={markers} 
      lat={lat}
      lng={lng}
      locationName={locationName}
      height={height} 
    />
  );
}
