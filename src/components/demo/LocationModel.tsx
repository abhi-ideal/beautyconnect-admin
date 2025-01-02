'use client'
import { useEffect, useState } from "react";
import LocationInput from "./LocationInput";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";

const LocationModel = (props: any) => {
  const { type, setLocationData, locationData, onHide, show }: any = props
  const [resetValue, setResetValue]: any = useState(null)
  useEffect(() => {
    setResetValue(locationData)
  }, [])

  return (
      <Dialog open={show} onOpenChange={() => {
        setLocationData(resetValue)
        onHide()
      }}>
      <DialogContent className="sm:max-w-[416px]">
        <DialogHeader>
          <DialogTitle>Location</DialogTitle>
        </DialogHeader>
        <LocationInput value={locationData} setValue={setLocationData} isInput={false} onHide={onHide} type={type} />
      </DialogContent>
      </Dialog>
  );
}

export default LocationModel

