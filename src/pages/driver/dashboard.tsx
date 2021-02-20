import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import { gql, useMutation, useSubscription } from "@apollo/client";
import { FULL_ORDER_FRAGMENT } from "../../fragments";
import { cookedOrders } from "../../__generated/cookedOrders";
import { Link, useHistory } from "react-router-dom";
import { takeOrder, takeOrderVariables } from "../../__generated/takeOrder";

const COOKED_ORDERS_SUBSCRIPTION = gql`
  subscription cookedOrders {
    cookedOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const TAKE_ORDER_MUTATION = gql`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`;

interface ICoords {
  lat: number;
  lng: number;
}

interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: any;
}
const Driver: React.FC<IDriverProps> = () => <div className="text-lg">🚖</div>;

export const Dashboard = () => {
  const history = useHistory();
  const onCompleted = (data: takeOrder) => {
    if (data.takeOrder.ok) {
      history.push(`orders/${cookedOrderData?.cookedOrders.id}`);
    }
  };
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lng: 0, lat: 0 });
  const [map, setMap] = useState<google.maps.Map>();
  const { data: cookedOrderData } = useSubscription<cookedOrders>(
    COOKED_ORDERS_SUBSCRIPTION
  );
  const [takeOrderMutation] = useMutation<takeOrder, takeOrderVariables>(
    TAKE_ORDER_MUTATION,
    { onCompleted }
  );

  useEffect(() => {
    if (cookedOrderData?.cookedOrders.id) {
      makeRoute();
    }
  }, [cookedOrderData]);

  // @ts-ignore
  const onSucces = ({ coords: { latitude, longitude } }: Position) => {
    setDriverCoords({ lat: latitude, lng: longitude });
  };
  // @ts-ignore
  const onError = (error: PositionError) => {
    console.log(error);
  };
  useEffect(() => {
    navigator.geolocation.watchPosition(onSucces, onError, {
      enableHighAccuracy: true,
    });
  }, []);
  useEffect(() => {
    if (map) {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
      //   const geocoder = new google.maps.Geocoder();
      //   geocoder.geocode(
      //     {
      //       location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
      //     },
      //     (results, status) => {
      //       console.log(status, results);
      //     }
      //   );
    }
  }, [driverCoords.lat, driverCoords.lng]);
  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
  };
  const triggerMutation = () => {
    if (cookedOrderData?.cookedOrders.id) {
      takeOrderMutation({
        variables: { input: { id: cookedOrderData?.cookedOrders.id } },
      });
    }
  };
  const makeRoute = () => {
    if (map) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);
      directionsService.route(
        {
          origin: {
            location: new google.maps.LatLng(
              driverCoords.lat,
              driverCoords.lng
            ),
          },
          destination: {
            location: new google.maps.LatLng(
              driverCoords.lat + 0.05,
              driverCoords.lng + 0.05
            ),
          },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          directionsRenderer.setDirections(result);
        }
      );
    }
  };
  return (
    <div>
      <div
        className="overflow-hidden"
        style={{ width: window.innerWidth, height: "50vh" }}
      >
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          defaultZoom={16}
          draggable={false}
          resetBoundsOnResize
          defaultCenter={{
            lat: 36.58,
            lng: 125.95,
          }}
          bootstrapURLKeys={{ key: "AIzaSyDERrmnPNGJyjFrN1R-0cNEAk3JwxLW4lc" }}
        >
          {/* <Driver lat={driverCoords.lat} lng={driverCoords.lng} /> */}
        </GoogleMapReact>
      </div>
      <div className="max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg text-xl font-medium px-5 py-8">
        {cookedOrderData?.cookedOrders ? (
          <>
            <h1 className="text-center my-3 text-3xl">New Cooked Order</h1>
            <h4 className="text-center my-3 text-2xl">
              Pick it up soon @ {cookedOrderData?.cookedOrders.restaurant?.name}
            </h4>
            <button
              onClick={() => triggerMutation()}
              className="btn w-full mt-5 block text-center"
            >
              Accept Chanllenge &rarr;
            </button>
          </>
        ) : (
          <h1 className="text-center my-3 text-3xl">No orders yet!</h1>
        )}
      </div>
    </div>
  );
};
