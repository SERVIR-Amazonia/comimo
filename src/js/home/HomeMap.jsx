import React, { useContext, useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import styled from "@emotion/styled";
import { atom, useAtom, useSetAtom, useAtomValue } from "jotai";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

import LatLngHud from "../components/LatLngHud";
import ReportPopupContent from "./ReportPopupContent";
import InfoPopupContent from "./InfoPopupContent";
import { localeTextAtom, MainContext, mapboxTokenAtom } from "../components/PageLayout";

import { extraMapParamsAtom, selectedDatesAtom, visiblePanelAtom } from "../home";

import { toPrecision, jsonRequest } from "../utils";
import { URLS, availableLayers, startVisible, attributions } from "../constants";

const isEmptyMap = (m) => Object.keys(m).length === 0;

export const mapPopupAtom = atom(null);
export const selectedLatLngAtom = atom([]);
export const homeMapAtom = atom(null);
export const selectedRegionAtom = atom(null);

export const addPopup = (map, { lat, lng }, mapPopup, visiblePanel, selectedDates, localeText) => {
  // Remove old popup
  if (mapPopup) mapPopup.remove();

  const divId = Date.now();
  const popup = new mapboxgl.Popup()
    .setLngLat([lng, lat])
    .setHTML(`<div id="${divId}"></div>`)
    .addTo(map);

  // TODO: visiblePanel may not be needed when switching to Footer
  // TODO: update to use refs to clear the build warning...
  if (visiblePanel === "report") {
    ReactDOM.render(
      <ReportPopupContent lat={lat} localeText={localeText} lon={lng} />,
      document.getElementById(divId)
    );
  } else {
    ReactDOM.render(
      <InfoPopupContent
        map={map}
        lng={lng}
        lat={lat}
        selectedDates={selectedDates}
        // localeText={localeText}
      />,
      document.getElementById(divId)
    );
  }
  return popup;
};

const setLayerUrl = (map, layer, url) => {
  if (layer && url && url !== "") {
    const style = map.getStyle();
    const layers = style.layers;
    const layerIdx = layers.findIndex((l) => l.id === layer);
    const thisLayer = layers[layerIdx];

    if (thisLayer) {
      const {
        layout: { visibility },
      } = thisLayer;
      const noUrl = style.sources[layer].tiles.length === 0;
      style.sources[layer].tiles = [url];
      style.layers[layerIdx] = {
        ...thisLayer,
        layout: { visibility: noUrl && startVisible.includes(layer) ? "visible" : visibility },
      };
      map.setStyle(style);
    }
  } else {
    console.error("Error loading layer: ", layer, url);
  }
};

const getLayerUrl = (map, list, selectedDates, extraMapParams) => {
  list.forEach((layer) => {
    jsonRequest(URLS.GET_IMAGE_URL, { dataLayer: selectedDates[layer], type: layer })
      .then((url) => {
        // As written the URL provided must already include ? and one param so &nextParam works.
        const params = extraMapParams[layer];
        const fullUrl =
          params == null
            ? url
            : url +
              Object.entries(params)
                .map(([k, v]) => `&${k}=${v}`)
                .join("");
        setLayerUrl(map, layer, fullUrl);
      })
      .catch((error) => console.error(error));
  });
};

export const fitMap = (map, type, coords, homeLocale) => {
  if (type === "point") {
    try {
      // center takes coords in the order of [lng, lat]
      map.flyTo({ center: coords, essential: true });
    } catch (err) {
      console.error(homeLocale?.errorCoordinates);
    }
  } else if (type === "bbox") {
    try {
      map.fitBounds(coords);
    } catch (error) {
      console.error(homeLocale?.errorBounds);
    }
  }
};

export default function HomeMap({}) {
  const [mouseCoords, setMouseCoords] = useState(null);
  const [mapPopup, setMapPopup] = useAtom(mapPopupAtom);
  const [visiblePanel, setVisiblePanel] = useAtom(visiblePanelAtom);
  const [extraMapParams, setExtraMapParams] = useAtom(extraMapParamsAtom);
  const [selectedLatLng, setSelectedLatLng] = useAtom(selectedLatLngAtom);
  const [selectedDates, setSelectedDates] = useAtom(selectedDatesAtom);
  const localeText = useAtomValue(localeTextAtom);
  const [homeMap, setHomeMap] = useAtom(homeMapAtom);
  const mapboxToken = useAtomValue(mapboxTokenAtom);

  const mapContainer = useRef(null);
  const [lng, setLng] = useState(-73.5609339);
  const [lat, setLat] = useState(4.6371205);
  const [zoom, setZoom] = useState(5);

  const addHomeMapPopup = (coords) =>
    addPopup(homeMap, coords, mapPopup, visiblePanel, selectedDates, localeText);

  // Effects
  useEffect(() => {
    if (!homeMap && mapboxToken !== "") {
      mapboxgl.accessToken = mapboxToken;
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/satellite-streets-v9",
        center: [lng, lat],
        zoom: zoom,
      });

      map.on("load", () => {
        addLayerSources(map, [...availableLayers].reverse());
      });

      setHomeMap(map);
    }

    if (!isEmptyMap(selectedDates)) {
      homeMap.resize();

      // Add layers first in the

      homeMap.addControl(new mapboxgl.NavigationControl({ showCompass: false }));
      homeMap.on("mousemove", (e) => {
        const lat = toPrecision(e.lngLat.lat, 4);
        const lng = toPrecision(e.lngLat.lng, 4);
        setMouseCoords({ lat, lng });
      });
      //   homeMap.on("click", (e) => {
      //     const { lat, lng } = e.lngLat;
      //     setSelectedLatLng([lat, lng]);

      //     setMapPopup(
      //       addPopup(homeMap, { lat, lng }, mapPopup, visiblePanel, selectedDates, localeText)
      //     );
      //   });
      // }
    }
  }, [selectedDates, mapboxToken]);

  useEffect(() => {
    if (homeMap && !isEmptyMap(localeText)) {
      homeMap.on("click", (e) => {
        const { lat, lng } = e.lngLat;
        setSelectedLatLng([lat, lng]);

        setMapPopup(addHomeMapPopup({ lat, lng }));
      });
    }
  }, [selectedDates]);

  useEffect(() => {
    if (homeMap && selectedDates) {
      getLayerUrl(homeMap, availableLayers.slice(3), selectedDates, extraMapParams);
    }
  }, [selectedDates]);

  useEffect(() => {
    if (homeMap && !isEmptyMap(selectedDates)) {
      Object.keys(selectedDates).length > 0 &&
        getLayerUrl(homeMap, Object.keys(selectedDates), selectedDates, extraMapParams);
    }
  }, [selectedDates]);

  useEffect(() => {
    if (homeMap && !isEmptyMap(selectedDates)) {
      Object.keys(extraMapParams).length > 0 &&
        getLayerUrl(homeMap, Object.keys(extraMapParams), selectedDates, extraMapParams);
    }
  }, [extraMapParams, selectedDates]);

  // useEffect(() => {
  //   map && setTimeout(() => map.resize(), 50);
  // }, [myHeight]);

  // Adds layers initially with no styling, URL is updated later.  This is to guarantee z order in mapbox
  const addLayerSources = (map, list) => {
    list.forEach((name) => {
      map.addSource(name, {
        type: "raster",
        tiles: [],
        tileSize: 256,
        vis: { palette: [] },
        ...(attributions[name] && { attribution: attributions[name] }),
      });
      // console.log("adding layer name", name);
      map.addLayer({
        id: name,
        type: "raster",
        source: name,
        minzoom: 0,
        maxzoom: 22,
        layout: { visibility: "none" },
      });
    });
  };

  return (
    <>
      <MapBoxWrapper ref={mapContainer} id="mapbox" />
      {mouseCoords && <LatLngHud mouseCoords={mouseCoords} />}
    </>
  );
}

const MapBoxWrapper = styled.div`
  height: 100%;
  margin: 0;
  padding: 0;
  position: "relative";
  width: 100%;

  .mapboxgl-popup-close-button {
    font-size: 1.75rem;
    padding: 3px 3px 8px 8px;
    line-height: 1.25rem;
  }
  .mapboxgl-popup-content {
    padding-top: 14px;
  }
  .mapboxgl-ctrl-logo {
    margin: 0px 54px !important;
  }

  @media only screen and (orientation: portrait) {
    .mapboxgl-ctrl-bottom-right {
      height: 100%;
      width: 100%;
    }
    .mapboxgl-ctrl-top-right {
      top: 50px;
    }
    .mapboxgl-popup-content {
      font-size: 0.75rem;
    }
    .mapboxgl-ctrl-attrib {
      display: none;
    }
    .mapboxgl-ctrl-logo {
      margin: 0 0 78px 4px !important;
    }
  }
`;