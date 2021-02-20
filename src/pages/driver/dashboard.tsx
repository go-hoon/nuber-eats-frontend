import React from "react";
import GoogleMapReact from "google-map-react";

export const Dashboard = () => {
  return (
    <div>
      <div
        className="overflow-hidden"
        style={{ width: window.innerWidth, height: "95vh" }}
      >
        <GoogleMapReact
          defaultCenter={{ lat: 59.95, lng: 30.33 }}
          defaultZoom={10}
          bootstrapURLKeys={{ key: "AIzaSyB4Ydc93AiTxChTuPKtNyiNuvyH-seE5OA" }}
        >
          <h2>Hello</h2>
        </GoogleMapReact>
      </div>
    </div>
  );
};
