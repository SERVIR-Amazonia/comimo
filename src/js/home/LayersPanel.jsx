import React, { useEffect, useState } from "react";
import { useAtom, useAtomValue } from "jotai";

import NICFIControl from "../components/NICFIControl";
import ToolCard from "../components/ToolCard";

// import i18n from "../i18n";
import { extraMapParamsAtom } from "../home";
import { startVisible, availableLayers } from "../constants";
import { homeMapAtom } from "./HomeMap";
import { useTranslation } from "react-i18next";

export default function LayersPanel({ nicfiLayers, active }) {
  const [visible, setVisible] = useState(null);
  const [extraMapParams, setExtraMapParams] = useAtom(extraMapParamsAtom);
  const [opacity, setOpacity] = useState(null);
  const homeMap = useAtomValue(homeMapAtom);

  const { t, i18n } = useTranslation();

  const setParams = (param, value) => {
    setExtraMapParams({
      ...extraMapParams,
      [param]: value,
    });
  };

  useEffect(() => {
    setVisible(
      availableLayers.reduce(
        (acc, cur) => ({ ...acc, [cur]: startVisible.includes(cur) || false }),
        {}
      )
    );

    setOpacity(availableLayers.reduce((acc, cur) => ({ ...acc, [cur]: 100 }), {}));
  }, []);

  const setLayerVisible = (name, layerVisible) => {
    homeMap.setLayoutProperty(name, "visibility", layerVisible ? "visible" : "none");
    setVisible({ ...visible, [name]: layerVisible });
  };

  const setLayerOpacity = (name, newOpacity) => {
    homeMap.setPaintProperty(name, "raster-opacity", newOpacity / 100);
    setOpacity({ ...opacity, [name]: newOpacity });
  };

  const renderControl = (name) => {
    const layerVisible = visible[name];
    return (
      <div
        key={name}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <div>
          <input
            checked={layerVisible}
            id={"label-" + name}
            onChange={() => setLayerVisible(name, !layerVisible)}
            type="checkbox"
            style={{ cursor: "pointer" }}
          />
          <label htmlFor={"label-" + name} style={{ cursor: "pointer", margin: "0 0 3px 0" }}>
            {t(`layers.${name}`)}
          </label>
        </div>
        <input
          max="100"
          min="0"
          onChange={(e) => setLayerOpacity(name, parseInt(e.target.value))}
          style={{ padding: "0rem", margin: "0rem", cursor: "pointer", width: "40%" }}
          type="range"
          value={opacity[name]}
        />
      </div>
    );
  };

  const renderHeading = () => (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0rem" }}>
        <label style={{ fontWeight: "bold", margin: "0 .25rem 0 0" }}>
          {t("layers.nameLabel")}
        </label>
        <label style={{ fontWeight: "bold", margin: "0 .25rem", width: "40%" }}>
          {t("layers.opacityLabel")}
        </label>
      </div>
      <hr style={{ marginBottom: "0.5rem" }}></hr>
    </>
  );

  const renderNICFISection = () => (
    <>
      <label style={{ fontWeight: "bold", margin: "0 .25rem 0 0" }}>
        {t("layers.satelliteTitle")}
      </label>
      <hr style={{ marginBottom: "0.5rem" }}></hr>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {renderControl("NICFI")}
        <NICFIControl
          extraParams={extraMapParams}
          nicfiLayers={nicfiLayers}
          setParams={setParams}
        />
      </div>
    </>
  );

  return (
    <ToolCard title={t("layers.title")} active={active}>
      {renderHeading()}
      {opacity &&
        visible &&
        availableLayers.map((layerName) => (layerName === "NICFI" ? "" : renderControl(layerName)))}
      <br></br>
      {opacity && visible && renderNICFISection()}
    </ToolCard>
  );
}
