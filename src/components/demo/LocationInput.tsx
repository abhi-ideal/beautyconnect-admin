import React, { useEffect, useState } from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import { usePathname, useRouter, } from "next/navigation";
import { Spinner } from "../ui/spinner";
import { Button } from "@/components/ui/button";

const LocationInput = (props: any) => {
  const { value, setValue, isInput, }: any = props
  const [locationError, setLocationError]: any = useState(false)
  const [localLocation, setLocalLocation]: any = useState({ ...value });
  const [isLoading, setIsLoading] = useState(false);
  const [autocomplete, setAutocomplete] = useState<any>(null);
  const path = usePathname();
  const router = useRouter()
  useEffect(() => {
    if (path == "/location") {
      getCurrentLocation()
    }
  }, [path == "/location"]);

  const mapKey= ""; //process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY;
  const currentLocation=""; // NEXT_PUBLIC_GOOGLE_CURRENT_LOCATION
  const getCurrentLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const res: any = await axios.get(`${currentLocation}?latlng=${position.coords.latitude},${position.coords.longitude}&key=${mapKey}`);
          let address_components: any = res?.data?.results[0];
          address_components.latitude = position?.coords?.latitude;
          address_components.longitude = position?.coords?.longitude;
          fillAddress(address_components)
          setIsLoading(false);
        },
        (error) => {
          setIsLoading(false);
          console.log(error);
          confirm("Location access is Blocked. Change your location settings in browser or select location manually");
        }
      );
    }
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${mapKey}`,
    libraries: ["places"]
  });

  const onLoad = (autocomplete: any) => {
    setAutocomplete(autocomplete);
  };


  const fillAddress = (place: any) => {
    let toggle = false;
    place?.address_components?.map((el: any) => {
      if (el?.types?.includes("country")) {
        place.country = el?.long_name;

      } else if (el?.types?.includes("administrative_area_level_1")) {
        place.state = el?.long_name;

      } else if (el?.types?.includes("locality")) {
        place.city = el?.short_name;
        toggle = true;
      }

      if (!toggle) {
        place.street = (place?.street ? place?.street : "") + el?.short_name + ", ";
      }
    });
    setLocalLocation({
      location: place?.formatted_address,
      latitude: place?.latitude,
      longitude: place?.longitude,
      city: place?.city,
      state: place?.state,
      street: place?.street,
      country: place?.country
    })
  }
  const onPlaceChanged = () => {
    if (autocomplete != null) {
      const place = autocomplete?.getPlace();
      place.latitude = place?.geometry?.location?.lat();
      place.longitude = place?.geometry?.location?.lng();

      fillAddress(place);
    };
  }

  const updateLocation = async () => {
    if (isLoading ) {
      return;
    }
    if (!localLocation?.longitude || !localLocation?.state) {
      setLocationError(true)
    } else {
      setValue(localLocation);
      if (props?.type === "business") {
        setLocationError(false)
        props?.onHide()
      } else {
        const address: any = [
          {
            coordinates: {
              type: "Point",
              coordinates: [
                localLocation?.longitude,
                localLocation?.latitude
              ]
            },
            street: localLocation?.street,
            city: localLocation?.city,
            state: localLocation?.state,
            country: localLocation?.country
          }
        ];
        const payload = {
          address: address
        };
      }
    }
  };

  if (isInput) {
    return (
      <>
        {
          isLoaded ? (
            <Autocomplete
              className="form-control"
              fields={
                [
                  "formatted_address",
                  "place_id",
                  "geometry",
                  "name",
                  "address_components"
                ]}
              onLoad={onLoad}
              onPlaceChanged={onPlaceChanged} >
              <input
                name="location"
                className="border-0 w-100"
                style={{ outline: 'none' }}
                value={localLocation?.location}
                onKeyDown={e => { e.key === 'Enter' && e.preventDefault() }}
                onChange={(e: any) => {
                  setLocalLocation({
                    location: e.target.value
                  })
                }
                }
              />
            </Autocomplete >
          ) : (
            ""
          )
        }
      </>
    )
  }

  return (
    <>

      <div >
        <div id="scrollableDiv">
          <div >

            <div className="form-group mb-4">
              <div className="input-group">

                {isLoaded ? (
                  <Autocomplete
                    className="form-control icon icon-location-rounded py-0"
                    fields={[
                      "formatted_address",
                      "place_id",
                      "geometry",
                      "name",
                      "address_components"
                    ]}
                    onLoad={onLoad}
                    onPlaceChanged={onPlaceChanged}>
                    <input
                      id="mapInputId"
                      placeholder="Enter your location."
                      name="location"
                      className="border border-1 p-2 rounded w-full"
                      value={localLocation?.location}
                      onChange={(e: any) => {
                        setLocalLocation({
                          location: e.target.value
                        })
                      }
                      }
                    />
                  </Autocomplete>
                ) : (
                  ""
                )}
              </div>
              {(!localLocation?.longitude && locationError) && <p style={{ color: 'red' }}>Location is required</p>}
              {(localLocation?.longitude && locationError && !localLocation?.state) && <p style={{ color: 'red' }}>Please select valid location, State and country both are required</p>}
            </div>
                <div className="flex -mx-2">
                <div className="w-1/2 px-2">
                <Button
              type="button"
              className="w-full"
              disabled={isLoading }
              onClick={getCurrentLocation}>
              {isLoading ? (
                <Spinner size="small" />
              ) : (
                <>
                Use My Current Location
                </>
              )}
            </Button>
                </div>
            <div className="w-1/2 px-2">
            <Button
              type="button"
              className="w-full"
              onClick={updateLocation}
            >
              { isLoading ? <Spinner size="small" /> : "Save button"}
            </Button>
            </div>
                </div>

          </div>
        </div>
      </div>
    </>
  );

}
export default LocationInput;
