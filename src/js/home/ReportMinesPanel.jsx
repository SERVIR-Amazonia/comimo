import React, { useEffect, useState } from "react";
import { useAtom, useAtomValue } from "jotai";

import Button from "../components/Button";
import ToolCard from "../components/ToolCard";
import TextInput from "../components/TextInput";
import Modal from "../components/Modal";
import ReportPopupContent from "./ReportPopupContent";
import InfoPopupContent from "./InfoPopupContent";

import { homeMapAtom, mapPopupAtom } from "./HomeMap";
import { visiblePanelAtom, selectedDatesAtom } from "../home";
import { URLS } from "../constants";
import { toPrecision, jsonRequest } from "../utils";
import { addPopup, fitMap, selectedLatLngAtom } from "./HomeMap";
import { useTranslation } from "react-i18next";

export default function ReportMinesPanel({ active }) {
  const [mapPopup, setMapPopup] = useAtom(mapPopupAtom);
  const [visiblePanel, _setVisiblePanel] = useAtom(visiblePanelAtom);
  const [selectedDates, _setSelectedDates] = useAtom(selectedDatesAtom);
  const homeMap = useAtomValue(homeMapAtom);
  const [selectedLatLng, setSelectedLatLng] = useAtom(selectedLatLngAtom);

  const [latLngText, setLatLngText] = useState("");
  const [messageBox, setMessageBox] = useState(null);
  const [reportedLatLng, setReportedLatLng] = useState(null);
  const [reportingMine, setReportingMine] = useState(false);

  const reported = reportedLatLng === selectedLatLng;

  const { t } = useTranslation();

  const showAlert = ({ body, closeText, confirmText, onConfirm, title }) =>
    setMessageBox({
      body,
      closeText,
      confirmText,
      onConfirm,
      title,
    });

  /// API Calls ///

  const submitMine = () => {
    if (selectedLatLng) {
      const [lat, lng] = selectedLatLng;
      setReportingMine(true);
      jsonRequest(URLS.REPORT_MINE, { lat, lng })
        .then((result) => {
          if (result === "") {
            setReportedLatLng(selectedLatLng);
            showAlert({
              body: t("report.created"),
              closeText: t("report.understand"),
              title: t("report.createdTitle"),
            });
          } else if (result === "Exists") {
            showAlert({
              body: t("report.existing"),
              closeText: t("report.understand"),
              title: t("report.existingTitle"),
            });
          } else if (result === "Outside") {
            showAlert({
              body: t("report.outside"),
              closeText: t("report.understand"),
              title: t("report.outsideTitle"),
            });
          } else {
            showAlert({
              body: t("report.error"),
              closeText: t("report.understand"),
              title: t("report.errorTitle"),
            });
          }
        })
        .catch((error) => console.error(error))
        .finally(() => setReportingMine(false));
    } else {
      alert("You must select a location to continue.");
    }
  };

  /// Helper functions ///
  const processLatLng = () => {
    const pair = latLngText.split(",");
    const [lat, lng] = pair.map((a) => parseFloat(a)).slice(0, 2);
    if (lat && lng) {
      // TODO, these probably dont need to be three functions
      setSelectedLatLng([lat, lng]);
      setMapPopup(addPopup(homeMap, { lat, lng }, mapPopup, visiblePanel, selectedDates));
      // Note the coords here must be in the order of [lng, lat]
      fitMap(homeMap, "point", [lng, lat], t);
    }
  };

  return (
    <ToolCard title={t("report.title")} active={active}>
      {t("report.subTitle")}
      <TextInput
        style={{ marginTop: "3rem" }}
        id="inputCoords"
        label={t("report.coordLabel")}
        onChange={(e) => setLatLngText(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === "Enter") processLatLng();
        }}
        render={() => <Button onClick={processLatLng}>{t("report.goButton")}</Button>}
        value={latLngText}
      />
      <h3 style={{ marginTop: "1rem" }}>{t("report.selectedLocation")}</h3>
      {selectedLatLng ? (
        <>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>
              <b>{t("report.latitude")}:</b> {toPrecision(selectedLatLng[0], 4)}
            </span>
            <span>
              <b>{t("report.longitude")}:</b> {toPrecision(selectedLatLng[1], 4)}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "flex-end",
            }}
          >
            <Button
              onClick={() =>
                showAlert({
                  body: t("report.areYouSure"),
                  closeText: t("report.cancel"),
                  confirmText: t("report.imSure"),
                  onConfirm: () => submitMine(),
                  title: t("report.submit"),
                })
              }
              isDisabled={reportingMine || reported}
            >
              {reported ? t("report.reported") : t("report.submit")}
            </Button>
          </div>
        </>
      ) : (
        <span style={{ fontStyle: "italic" }}>{t("report.noLocation")}</span>
      )}
      {messageBox && (
        <Modal {...messageBox} onClose={() => setMessageBox(null)}>
          <p>{messageBox.body}</p>
        </Modal>
      )}
    </ToolCard>
  );
}
