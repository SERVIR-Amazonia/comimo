import React, { useState, useContext } from "react";
import styled from "@emotion/styled";
import { useAtom } from "jotai";

import Button from "../components/Button";
import Search from "../components/Search";
import Select from "../components/Select";
import ToolCard from "../components/ToolCard";

import LoadingModal from "../components/LoadingModal";
import { MainContext } from "../components/PageLayout";
import { URLS } from "../constants";
import { jsonRequest } from "../utils";

import { processModal, showModalAtom } from "../../../src/js/home";
import { homeMapAtom, selectedRegionAtom } from "./HomeMap";

const Title = styled.h2`
  border-bottom: 1px solid gray;
  font-weight: bold;
  padding: 0.5rem;
`;

export default function DownloadPanel({ active, featureNames, mapquestKey, selectedDates }) {
  const [showModal, setShowModal] = useAtom(showModalAtom);
  const [selectedRegion, setSelectedRegion] = useAtom(selectedRegionAtom);
  const [homeMap, setMap] = useAtom(homeMapAtom);

  const [clipOption, setClipOption] = useState(1);
  const [downloadURL, setDownloadURL] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [mineType, setMineType] = useState("cMines");

  const {
    localeText: { download, validate },
  } = useContext(MainContext);

  const getDownloadUrl = () => {
    const region = clipOption === 1 ? "all" : selectedRegion;

    processModal(
      () =>
        jsonRequest(URLS.GET_DL_URL, {
          region,
          dataLayer: selectedDates[mineType],
        })
          .then((resp) => {
            setDownloadURL([region, selectedDates[mineType], resp]);
          })
          .catch((err) => {
            console.error(err);
          }),
      setShowModal
    );
  };

  return (
    <ToolCard title={download?.title} active={active}>
      {showModal && <LoadingModal message="Getting URL" />}

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>{`${validate?.typeLabel}:`}</label>
        <Select
          id="selectMineType"
          onChange={(e) => setMineType(e.target.value)}
          options={["pMines", "nMines", "cMines"].map((k) => ({
            value: k,
            label: validate?.[k],
          }))}
          value={mineType}
        />
        <div style={{ marginTop: ".25rem" }}>
          <input
            checked={clipOption === 1}
            name="downloadRegion"
            onChange={() => setClipOption(1)}
            type="radio"
          />
          <span>{download?.allRadio}</span>
        </div>
        {/* TODO: disabled-group is not defined yet */}
        <div className={selectedRegion ? "" : "disabled-group"} style={{ marginTop: ".25rem" }}>
          <input
            checked={clipOption === 2}
            name="downloadRegion"
            onChange={() => setClipOption(2)}
            type="radio"
          />
          <span>{download?.selectedRadio}</span>
        </div>
        <div>
          <Title>{download?.selectMuni}</Title>
          <Search
            isPanel={false}
            featureNames={featureNames}
            map={homeMap}
            mapquestKey={mapquestKey}
            setSelectedRegion={setSelectedRegion}
          ></Search>
        </div>
        {/* TODO download text is too large for button sometimes, either truncate it or wrap the text */}
        {selectedDates && (
          <Button
            onClick={getDownloadUrl}
            extraStyle={{ marginTop: "0.25rem" }}
            isDisabled={fetching}
          >{`${download?.getUrl} ${selectedDates?.[mineType]}`}</Button>
        )}
        {fetching ? (
          <p>{`${download?.fetching}...`}</p>
        ) : (
          downloadURL && (
            <p>
              <span>
                <a href={downloadURL[2]}>
                  {`${download.clickHere}` +
                    ` ${
                      downloadURL[0] === "all"
                        ? download?.completeData
                        : download?.munData + downloadURL[0]
                    }` +
                    ` ${download?.prep}` +
                    ` ${downloadURL[1]}.`}
                </a>
              </span>
            </p>
          )
        )}
      </div>
    </ToolCard>
  );
}