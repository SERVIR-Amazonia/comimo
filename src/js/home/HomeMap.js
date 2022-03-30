import React from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import styled from "styled-components";

import LngLatHud from "../components/LngLatHud";
import InfoPopupContent from "./InfoPopupContent";
import ReportPopupContent from "./ReportPopupContent";

import {mapboxToken} from "../appConfig";
import {MainContext, URLS, availableLayers, startVisible} from "./constants";
import {toPrecision, jsonRequest} from "../utils";

const MapBoxWrapper = styled.div`
  .mapboxgl-popup-close-button {
    font-size: 1.25rem;
    padding: 0 3px 8px 8px;
    line-height: 1.25rem;
  }
  .mapboxgl-popup-content {
    padding-top: 14px;
  }
  .mapboxgl-ctrl-logo {
    margin: 0px 54px !important
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
      font-size: .75rem;
    }
    .mapboxgl-ctrl-attrib {
      display: none;
    }
    .mapboxgl-ctrl-logo {
      margin: 0 0 78px 4px !important;
    }
  }
`;

export default class HomeMap extends React.Component {
  // set up class flags so each component update doesn't do redundant JS tasks
  constructor(props) {
    super(props);

    this.state = {
      thePopup: null
    };
  }

  /// Lifecycle Functions ///

  componentDidMount() {
    this.initMap();
  }

  componentDidUpdate(prevProps, _prevState) {
    if (this.props.theMap && prevProps.myHeight !== this.props.myHeight) {
      setTimeout(() => this.props.theMap.resize(), 50);
    }

    if (this.state.thePopup && prevProps.reportPopup && !this.props.reportPopup) {
      this.state.thePopup.remove();
    }
  }

  /// API Calls ///

  setLayerUrl = (layer, url, firstTime = false) => {
    if (layer && url) {
      const {theMap} = this.props;
      const style = theMap.getStyle();
      const layers = style.layers;
      const layerIdx = layers.findIndex(l => l.id === layer);
      const thisLayer = layers[layerIdx];
      const {layout: {visibility}} = thisLayer;
      style.sources[layer].tiles = [url];
      style.layers[layerIdx] = {
        ...thisLayer,
        layout: {visibility: firstTime && startVisible.includes(layer) ? "visible" : visibility}
      };
      theMap.setStyle(style);
    } else {
      console.error("Error loading layer: ", layer, url);
    }
  };

  getGEELayers = list => {
    list.forEach(layer =>
      jsonRequest(URLS.GEE_LAYER, {name: layer})
        .then(url => this.setLayerUrl(layer, url, true))
        .catch(error => console.error(error)));
  };

  updateEELayers = (firstTime = false) => {
    const eeLayers = ["nMines", "pMines", "cMines"];
    const {selectedDates} = this.props;
    eeLayers.forEach(eeLayer => {
      jsonRequest(URLS.SINGLE_IMAGE, {id: selectedDates[eeLayer], type: eeLayer})
        .then(url => this.setLayerUrl(eeLayer, url, firstTime))
        .catch(error => console.error(error));
    });
  };

  /// Mapbox TODO move to separate component

  initMap = () => {
    mapboxgl.accessToken = mapboxToken;
    const theMap = new mapboxgl.Map({
      container: "mapbox",
      style: "mapbox://styles/mapbox/satellite-streets-v9",
      center: [-73.5609339, 4.6371205],
      zoom: 5
    });
    this.props.setMap(theMap);

    theMap.on("load", () => {
      theMap.addControl(new mapboxgl.NavigationControl({showCompass: false}));

      this.addLayerSources([...availableLayers].reverse());
      // This is not safe, the updates could be called before the options are returned
      this.getGEELayers(availableLayers.slice(3));
      this.updateEELayers(true);

      theMap.on("mousemove", e => {
        const lat = toPrecision(e.lngLat.lat, 4);
        const lng = toPrecision(e.lngLat.lng, 4);
        this.setState({coords: {lat, lng}});
      });
      theMap.on("click", e => {
        const {lng, lat} = e.lngLat;
        this.addPopup(lat, lng);
      });
    });
  };

  addPopup = (lat, lon) => {
    const {thePopup} = this.state;
    const {theMap, selectedDates, reportPopup, setLatLon} = this.props;
    const {localeText: {home}, localeText} = this.context;

    // Remove old popup
    if (thePopup) thePopup.remove();

    const divId = Date.now();
    const popup = new mapboxgl.Popup()
      .setLngLat([lon, lat])
      .setHTML(`<div id="${divId}"></div>`)
      .addTo(theMap);
    this.setState({thePopup: popup});

    setLatLon([lat, lon]);

    if (reportPopup) {
      ReactDOM.render(
        <ReportPopupContent
          lat={lat}
          localeText={localeText}
          lon={lon}
        />, document.getElementById(divId)
      );
    } else {
      const visibleLayers = availableLayers.map(l => this.isLayerVisible(l) && l).filter(l => l);
      ReactDOM.render(
        <InfoPopupContent
          lat={lat}
          localeText={home}
          lon={lon}
          selectedDates={selectedDates}
          visibleLayers={visibleLayers}
        />, document.getElementById(divId)
      );
    }
  };

  isLayerVisible = layer => this.props.theMap.getLayer(layer).visibility === "visible";

  // Adds layers initially with no styling, URL is updated later.  This is to guarantee z order in mapbox
  addLayerSources = list => {
    const {theMap} = this.props;

    list.forEach(name => {
      theMap.addSource(name, {type: "raster", tiles: [], tileSize: 256, vis: {palette: []}});
      theMap.addLayer({
        id: name,
        type: "raster",
        source: name,
        minzoom: 0,
        maxzoom: 22,
        layout: {visibility: "none"}
      });
    });
  };

  render() {
    const {coords} = this.state;
    return (
      <>
        <MapBoxWrapper
          id="mapbox"
          style={{
            height: "100%",
            width: "100%",
            margin: 0,
            padding: 0,
            position: "relative"
          }}
        />
        {coords && <LngLatHud coords={coords}/>}
      </>
    );
  }
}
HomeMap.contextType = MainContext;
