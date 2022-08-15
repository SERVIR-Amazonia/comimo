import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "./PageLayout";

import Button from "./Button";
import Select from "./Select";

export default function NICFIControl({ extraParams, setParams, nicfiLayers }) {
  const [selectedTime, setTime] = useState("");
  const [selectedBand, setBand] = useState("");
  const {
    localeText: { layers },
  } = useContext(MainContext);

  useEffect(() => {
    if (extraParams.NICFI) {
      setTime(extraParams.NICFI.dataLayer || selectedTime);
      setBand(extraParams.NICFI.band || selectedBand);
    }
  }, [extraParams]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Select
        id="time"
        label={layers.selectTime}
        onChange={(e) => setTime(e.target.value)}
        options={nicfiLayers.map((time) => ({
          value: time,
          label: time.slice(34, time.length - 7),
        }))}
        value={selectedTime}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label style={{ margin: "0rem" }}>{layers.selectBand}</label>
        <div style={{ display: "flex" }}>
          <div>
            <input
              checked={selectedBand === "rgb"}
              id="visible"
              onChange={() => setBand("rgb")}
              type="radio"
              style={{ cursor: "pointer" }}
            />
            <label htmlFor="visible" style={{ cursor: "pointer", margin: 0 }}>
              {layers.visible}
            </label>
          </div>
          <div style={{ paddingLeft: "1rem" }}>
            <input
              checked={selectedBand === "cir"}
              id="infrared"
              onChange={() => setBand("cir")}
              type="radio"
              style={{ cursor: "pointer" }}
            />
            <label htmlFor="infrared" style={{ cursor: "pointer", margin: 0 }}>
              {layers.infrared}
            </label>
          </div>
        </div>
      </div>
      <Button style={{ marginTop: "0.5rem" }}>
        onClick=
        {() =>
          setParams("NICFI", {
            dataLayer: selectedTime,
            band: selectedBand,
          })
        }
        >{layers.updateNICFI}
      </Button>
    </div>
  );
}
