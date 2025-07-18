import { Marker } from "react-map-gl/maplibre";

export default function BinStatusMarker() {
  return (
    <Marker longitude={121.075782} latitude={14.577887} anchor="bottom">
      <div className="mb-12">this is the marker</div>
    </Marker>
  );
}
