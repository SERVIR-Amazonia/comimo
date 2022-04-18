import React from "react";

import Button from "../components/Button";
import ToolPanel from "../components/ToolPanel";

import {MainContext} from "../components/PageLayout";
import {URLS} from "../constants";
import {jsonRequest} from "../utils";

export default class ReportMinesPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      latLonText: "",
      reportedLatLon: null,
      reportingMine: false
    };
  }

  /// API Calls ///

  submitMine = () => {
    const {selectedLatLon} = this.props;
    const {localeText: {report}} = this.context;
    const [lat, lon] = selectedLatLon;
    if (lat && lon) {
      this.setState({reportingMine: true});
      jsonRequest(URLS.REPORT_MINE, {lat, lon})
        .then(result => {
          if (result === "") {
            this.setState({reportedLatLon: selectedLatLon});
            alert(report.created);
          } else if (result === "Exists") {
            alert(report.existing);
          } else if (result === "Outside") {
            alert(report.outside);
          } else {
            alert(report.error);
          }
        })
        .catch(error => console.error(error))
        .finally(() => this.setState({reportingMine: false}));
    } else {
      alert("You must select a location to continue.");
    }
  };

  /// Helper functions ///

  processLatLng = () => {
    const {latLonText} = this.state;
    const {fitMap, addPopup} = this.props;
    const pair = latLonText.split(",");
    const [lat, lon] = pair
      .map(a => parseFloat(a))
      .slice(0, 2);
    if (lat && lon) {
      // TODO, these probably dont need to be three functions
      addPopup(lat, lon);
      fitMap("point", [lon, lat]);
    }
  };

  render() {
    const {latLonText, reportingMine, reportedLatLon} = this.state;
    const {selectedLatLon} = this.props;
    const {localeText: {report}} = this.context;

    const reported = reportedLatLon === selectedLatLon;
    return (
      <ToolPanel title={report.title}>
        {report.subTitle}
        <label>{report.coordLabel}</label>
        <div className="d-flex">
          <input
            className="w-100"
            onChange={e => this.setState({latLonText: e.target.value})}
            onKeyUp={e => { if (e.key === "Enter") this.processLatLng(); }}
            value={latLonText}
          />
          <Button onClick={this.processLatLng}>
            {report.goButton}
          </Button>
        </div>
        <h3 className="mt-3">{report.selectedLocation}</h3>
        {selectedLatLon
          ? (
            <>
              <div className="d-flex flex-column">
                <span><b>{report.latitude}:</b> {selectedLatLon[0]}</span>
                <span><b>{report.longitude}:</b> {selectedLatLon[1]}</span>
              </div>

              <div style={{display: "flex", width: "100%", justifyContent: "flex-end"}}>
                <Button
                  disabled={reportingMine || reported}
                  onClick={this.submitMine}
                >
                  {reported ? report.reported : report.submit}
                </Button>
              </div>
            </>
          ) : (
            <span style={{fontStyle: "italic"}}>{report.noLocation}</span>
          )}
      </ToolPanel>
    );
  }
}
ReportMinesPanel.contextType = MainContext;
