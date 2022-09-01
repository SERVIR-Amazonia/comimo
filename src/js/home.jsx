import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useAtom, useAtomValue, atom } from "jotai";
import styled from "@emotion/styled";

import DownloadPanel from "./home/DownloadPanel";
import FilterPanel from "./home/FilterPanel";
import FooterBar from "./components/FooterBar";
import IconTextButton from "./components/IconTextButton";
import IconButton from "./components/IconButton";
import {
  MainContext,
  PageLayout,
  mapboxTokenAtom,
  mapquestKeyAtom,
  versionDeployedAtom,
} from "./components/PageLayout";
import LayersPanel from "./home/LayersPanel";
import ReportMinesPanel from "./home/ReportMinesPanel";
import StatsPanel from "./home/StatsPanel";
import SubscribePanel from "./home/SubscribePanel";
import ValidatePanel from "./home/ValidatePanel";

import HomeMap, { homeMapAtom, mapPopupAtom } from "./home/HomeMap";
import { availableLayers, URLS } from "./constants";
import { jsonRequest } from "./utils";

export const selectedDatesAtom = atom({});
export const updateStateMap = (setter, prevVal, newVal) => setter({ ...prevVal, ...newVal });
export const visiblePanelAtom = atom(null);
export const showModalAtom = atom(null);
export const extraMapParamsAtom = atom({
  NICFI: {
    dataLayer: null,
    band: "rgb",
  },
});
export const featureNamesAtom = atom({});

export const processModal = (callBack, setShowModal) =>
  new Promise(() => {
    setShowModal(true);
    callBack().finally(() => setShowModal(false));
  });

function HomeContents() {
  const [visiblePanel, setVisiblePanel] = useAtom(visiblePanelAtom);
  const [selectedDates, setSelectedDates] = useAtom(selectedDatesAtom);
  const [homeMapPoupup, setHomeMapPoupup] = useAtom(mapPopupAtom);
  const [homeMap, setHomeMap] = useAtom(homeMapAtom);
  const [extraMapParams, setExtraMapParams] = useAtom(extraMapParamsAtom);
  const [featureNames, setFeatureNames] = useAtom(featureNamesAtom);
  const mapquestKey = useAtomValue(mapquestKeyAtom);
  const mapboxToken = useAtomValue(mapboxTokenAtom);
  const versionDeployed = useAtomValue(versionDeployedAtom);

  const [subscribedList, setSubscribedList] = useState([]);
  const [imageDates, setImageDates] = useState({});
  const [nicfiLayers, setNicfiLayers] = useState([]);

  const {
    localeText,
    localeText: { home },
    username,
    setShowInfo,
  } = useContext(MainContext);

  // Effects

  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.keyCode === 27) {
        if (homeMapPoupup) {
          homeMapPoupup.remove();
          setHomeMapPoupup(null);
        }
        setVisiblePanel(null);
      }
    };
    window.addEventListener("keydown", handleEscapeKey);

    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [homeMapPoupup, visiblePanel]);

  useEffect(() => {
    const getImageDates = async () => {
      const result = await jsonRequest(URLS.IMG_DATES);
      const initialDates = Object.keys(result).reduce(
        (acc, cur) => ({ ...acc, [cur]: result[cur][0] }),
        {}
      );

      setImageDates(result);
      setSelectedDates(initialDates);
    };

    getImageDates().catch(console.error);
  }, []);

  const togglePanel = (panelKey) => {
    setVisiblePanel(panelKey === visiblePanel ? null : panelKey);
  };

  const selectDates = (newDates) => setSelectedDates({ ...selectedDates, ...newDates });

  const setParams = (param, value) => {
    setExtraMapParams({
      ...extraMapParams,
      [param]: value,
    });
  };

  useEffect(() => {
    const getNICFIDates = async () => {
      const dates = await jsonRequest(URLS.NICFI_DATES);
      setNicfiLayers(dates);
      setParams("NICFI", { ...extraMapParams.NICFI, dataLayer: dates[0] });
    };

    getNICFIDates().catch(console.error);
  }, [selectedDates]);

  useEffect(() => {
    const getFeatureNames = async () => {
      const features = await jsonRequest(URLS.FEATURE_NAMES);
      setFeatureNames(features);
    };

    getFeatureNames().catch(console.error);
  }, []);

  return (
    <>
      <HomeMap />
      <div id="bottom-bar">
        <FooterBar>
          <Buttons>
            {/* Layers */}
            <BarItem>
              <IconTextButton
                active={visiblePanel === "layers"}
                hasBackground={true}
                icon="layer"
                onClick={() => togglePanel("layers")}
                text={home?.layersTitle}
              />
              <LayersPanel active={visiblePanel === "layers"} nicfiLayers={nicfiLayers} />
            </BarItem>

            {/* Subscribe */}
            <BarItem>
              <IconTextButton
                active={visiblePanel === "subscribe"}
                hasBackground={true}
                icon="envelope"
                onClick={() => togglePanel("subscribe")}
                text={home?.subscribeTitle}
              />
              <SubscribePanel
                active={visiblePanel === "subscribe"}
                featureNames={featureNames}
                mapquestKey={mapquestKey}
                subscribedList={subscribedList}
                setSubscribedList={setSubscribedList}
              />
            </BarItem>

            {/* Validation */}
            <BarItem>
              <IconTextButton
                active={visiblePanel === "validate"}
                hasBackground={true}
                icon="check"
                onClick={() => togglePanel("validate")}
                text={home?.validationsTitle}
              />
              <ValidatePanel
                active={visiblePanel === "validate"}
                featureNames={featureNames}
                selectedDates={selectedDates}
                subscribedList={subscribedList}
              />
            </BarItem>
            {/* "Advanced Controls" */}
            {username && (
              <>
                {/* Filter */}
                <BarItem>
                  <IconTextButton
                    active={visiblePanel === "filter"}
                    hasBackground={true}
                    icon="filter"
                    onClick={() => togglePanel("filter")}
                    text={home?.filterTitle}
                  />
                  <FilterPanel
                    active={visiblePanel === "filter"}
                    imageDates={imageDates}
                    selectDates={selectDates}
                    selectedDates={selectedDates}
                  />
                </BarItem>

                {/* Report Mines */}
                <BarItem>
                  <IconTextButton
                    active={visiblePanel === "report"}
                    hasBackground={true}
                    icon="mine"
                    onClick={() => togglePanel("report")}
                    text={home?.reportMinesTitle}
                  />
                  <ReportMinesPanel active={visiblePanel === "report"} />
                </BarItem>

                {/* Download Data */}
                <BarItem>
                  <IconTextButton
                    active={visiblePanel === "download"}
                    hasBackground={true}
                    icon="download"
                    onClick={() => togglePanel("download")}
                    text={home?.downloadTitle}
                  />
                  <DownloadPanel
                    active={visiblePanel === "download"}
                    featureNames={featureNames}
                    mapquestKey={mapquestKey}
                    selectedDates={selectedDates}
                  />
                </BarItem>

                {/* Statistics */}
                <BarItem>
                  <IconTextButton
                    active={visiblePanel === "stats"}
                    hasBackground={true}
                    icon="stats"
                    onClick={() => togglePanel("stats")}
                    text={home?.statisticsTitle}
                  />
                  <StatsPanel
                    active={visiblePanel === "stats"}
                    selectedDate={selectedDates?.cMines}
                    subscribedList={subscribedList}
                  />
                </BarItem>
              </>
            )}
          </Buttons>
          <Logo>
            {/* TODO: move this top bar (menu admin) */}
            {/* {true && (
              <IconButton
                extraStyle={{ marginRight: "10px" }}
                icon="admin"
                onClick={() => window.location.assign("/admin")}
                // tooltip={localeText.home?.admin}
              />
            )} */}
            <IconButton
              // extraStyle={{ marginRight: "10px" }}
              icon="info"
              onClick={() => setShowInfo(true)}
            />
            <LogoImg
              alt="app-logo"
              onClick={() => window.location.assign("/")}
              src="/img/app-logo.png"
            />
            <LogoGitVersion
              href={`https://github.com/sig-gis/comimo/tags/${versionDeployed}`}
              target="/blank"
            >
              {versionDeployed && `Version: ${versionDeployed}`}
            </LogoGitVersion>
          </Logo>
        </FooterBar>
      </div>
    </>
  );
}

export function pageInit(args) {
  ReactDOM.render(
    <PageLayout
      role={args.role}
      userLang={args.userLang}
      username={args.username}
      mapboxToken={args.mapboxToken}
      mapquestKey={args.mapquestKey}
      versionDeployed={args.versionDeployed}
      showSearch={true}
    >
      <HomeContents />
    </PageLayout>,
    document.getElementById("main-container")
  );
}

const Buttons = styled.div`
  display: flex;
  flex: 3;
  justify-content: space-around;
`;

const Logo = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: space-around;
  padding: 5px 0;
`;

const LogoImg = styled.img`
  cursor: pointer;
  height: 22px;
  padding-right: 15px;
  width: 67px;
`;

const LogoGitVersion = styled.a`
  color: var(--white);
  cursor: pointer;
  font-size: 12px;
  letter-spacing: 0px;
  text-align: left;
  text-decoration: none;
`;

const Hidable = styled.div`
  display: ${({ active }) => !active && "none"};
`;

const BarItem = styled.div``;