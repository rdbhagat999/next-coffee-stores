import { useContext, useState } from "react";
import { ACTION_TYPES, StoreContext } from "../store/store-context";

const useTrackLocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState("");
  // const [latLong, setLatLong] = useState("");
  const [isFindingLocation, setIsFindingLocation] = useState(false);

  const { dispatch } = useContext(StoreContext);

  const success = (position: GeolocationPosition) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    setLocationErrorMsg("");
    // setLatLong(`${latitude},${longitude}`);
    dispatch({ type: ACTION_TYPES.SET_LAT_LONG, payload: `${latitude},${longitude}` });
    setIsFindingLocation(false);
    setLocationErrorMsg("");
  };

  const error = () => {
    setLocationErrorMsg("Unable to retrieve your location");
    setIsFindingLocation(false);
  };

  const handleTrackLocation = () => {
    setIsFindingLocation(true);
    if (!navigator.geolocation) {
      setLocationErrorMsg("Geolocation is not supported by your browser");
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return {
    // latLong,
    handleTrackLocation,
    locationErrorMsg,
    isFindingLocation,
  };
};

export default useTrackLocation;
