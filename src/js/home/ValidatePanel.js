import React from "react";
import {MainContext} from "./context";

import LoginMessage from "./LoginMessage";
import SvgIcon from "../components/SvgIcon";

export default class ValidatePanel extends React.Component {
  constructor(props) {
    super(props);

    this.URLS = {
      PROJS: "user-projects",
      CLPROJ: "close-project",
      CRTPROJ: "create-project"
    };

    this.state = {
      projects: [],
      projectName: "",
      creatingProject: false,
      errorMsg: false,
      regionType: 1,
      customRegions: [],
      mineType: "pMines"
    };
  }

  componentDidMount() {
    const {username} = this.context;
    if (username) {
      this.getProjects();
    }
  }

  getProjects = () => {
    fetch(this.URLS.PROJS, {method: "POST"})
      .then(response => (response.ok ? response.json() : Promise.reject(response)))
      .then(res => { this.setState({projects: res || []}); })
      .catch(err => console.error(err));
  };

  checkProjectErrors = (dataLayer, selected, projectName, projects, type, validate) => {
    const errors = [
      !dataLayer && validate.errorDate,
      selected.length === 0 && (type === 1 ? validate.errorNoSubscribe : validate.errorNoRegion),
      !projectName && validate.errorNoName,
      projects.find(pr => pr[4] === projectName) && validate.errorDubName
    ].filter(e => e);
    return errors.length === 0 || this.setState({errorMsg: errors.join("\n\n")});
  };

  createProject = dataLayer => {
    const {customRegions, projectName, projects, regionType} = this.state;
    const {subscribedList, localeText: {validate}} = this.context;

    this.setState({creatingProject: true, errorMsg: false});
    const selectedArr = regionType === 1 ? subscribedList : customRegions.map(x => "mun_" + x);
    const regions = selectedArr
      .map(r => {
        const es = r.split("_");
        return es[2] + ", " + es[1];
      })
      .join(";");
    const question = validate.confirmQuestion
      .replace("{%date}", dataLayer)
      .replace("{%name}", projectName)
      .replace("{%region}", regions);

    if (this.checkProjectErrors(dataLayer, selectedArr, projectName, projects, regionType, validate)
          && confirm(question)) {
      fetch(this.URLS.CRTPROJ,
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                dataLayer,
                name: projectName,
                regions: selectedArr
              })
            })
        .then(response => (response.ok ? response.json() : Promise.reject(response)))
        .then(res => {
          if (res.action !== "Error") {
            this.getProjects();
            this.setState({
              creatingProject: false,
              errorMsg: ""
            });
          } else {
            this.setState({creatingProject: false, errorMsg: res.message});
          }
        })
        .catch(err => {
          console.error(err);
          this.setState({
            creatingProject: false,
            errorMsg: validate.errorUnknown
          });
        });
    } else {
      this.setState({creatingProject: false});
    }
  };

  closeProject = projectId => {
    const {localeText: {validate}} = this.context;
    if (confirm(validate.closeConfirm)) {
      fetch(this.URLS.CLPROJ,
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              },
              body: JSON.stringify({projectId})
            })
        .then(response => (response.ok ? response.json() : Promise.reject(response)))
        .then(res => {
          if (res === "") {
            this.getProjects();
          } else {
            // TODO pass back meaningful errors
            this.setState({errorMsg: validate.errorClose});
          }
        })
        .catch(err => { console.error(err); });
    }
  };

  renderProject = ({dataLayer, createdDate, id, name, regions}) => {
    const {localeText: {validate}} = this.context;
    return (
      <tr key={id}>
        <td style={{width: "calc(100% - 30px)"}}>
          <div style={{display: "flex", flexDirection: "column"}}>
            <label>{name}</label>
            <small>{`${validate.predictionLabel}: ${dataLayer}`}</small>
            <small>{`${validate.createdLabel}: ${createdDate}`}</small>
            <small>{`${validate.regionsLabel}:`}
              <ul>
                {regions
                  .map(x => x.split("_"))
                  .map(x => <li>{`${x[2]}, ${x[1]}`}</li>)}
              </ul>
            </small>
          </div>
        </td>
        <td style={{verticalAlign: "top"}}>
          <button
            className="del-btn green-btn p-0"
            onClick={() => this.closeProject(id)}
            style={{height: "1.75rem", width: "1.75rem"}}
            title={"Close " + name}
            type="button"
          >
            <SvgIcon extraStyle={{margin: "0px .3rem .1rem"}} icon="check" size="1.25rem"/>
          </button>
        </td>
      </tr>
    );
  };

  customSelect = val => {
    const {customRegions} = this.state;
    const newRegions = customRegions.includes(val)
      ? customRegions.filter(r => r !== val)
      : [...customRegions, val];
    this.setState({
      customRegions: newRegions
    });
  };

  renderCustomRegions = () => {
    const {customRegions} = this.state;
    const {featureNames, localeText: {validate}} = this.context;
    const states = Object.keys(featureNames).sort();
    return states.length === 0
      ? <option key="0" disabled>{`${validate.loading}...`}</option>
      : (
        <select
          id="selectProjRegions"
          multiple
          onChange={() => null} // This is to squash the react warning
          size="8"
          style={{width: "100%", float: "left", marginBottom: "10px"}}
          value={customRegions}
        >
          {states.map(state => (
            <optgroup key={state} label={state}>
              {Object.keys(featureNames[state]).sort().map(mun => {
                const combined = state + "_" + mun;
                return (
                  <option
                    key={mun}
                    onClick={() => this.customSelect(combined)}
                    value={combined}
                  >
                    {mun}
                  </option>
                );
              })}
            </optgroup>
          ))}
        </select>
      );
  };

  render() {
    const {isHidden} = this.props;
    const {projects, projectName, regionType, creatingProject, errorMsg, mineType} = this.state;
    const {selectedDates, username, localeText: {validate}} = this.context;
    return (
      <div className={"popup-container validate-panel " + (isHidden ? "see-through" : "")}>
        <h3>{validate.title.toUpperCase()}</h3>
        <span>{validate.subtitle}</span>
        {username
          ? (
            <div style={{display: "flex", flexDirection: "column"}}>
              {projects.length === 0
                ? <span>{validate.noProjects}</span>
                : (
                  <table style={{width: "100%", textAlign: "left"}}>
                    <thead>
                      <tr>
                        <th style={{width: "calc(100% - 50px)"}}>{validate.name}</th>
                        <th>{}</th>
                      </tr>
                    </thead>
                    <tbody>{projects.map(p => this.renderProject(p))}</tbody>
                  </table>
                )}
              <h3 style={{marginBottom: 0}}>{`${validate.createProject}:`}</h3>
              <label>{`${validate.projectName}:`}</label>
              <input
                id="projectName"
                length="2"
                onChange={e => this.setState({projectName: e.target.value})}
                style={{width: "100%"}}
                value={projectName}
              />
              <label>{`${validate.typeLabel}:`}</label>
              <select
                onChange={e => this.setState({mineType: e.target.value})}
                style={{width: "100%"}}
                value={mineType}
              >
                {["pMines", "nMines", "cMines"].map(m =>
                  <option key={m} value={m}>{validate[m]}</option>)}
              </select>
              <label>{`${validate.projectRegion}:`}</label>
              <span style={{marginTop: ".25rem"}}>
                <input
                  checked={regionType === 1}
                  name="projectRegion"
                  onChange={() => this.setState({regionType: 1})}
                  type="radio"
                />
                {validate.subscribedRadio}
              </span>
              <span style={{marginTop: ".25rem"}}>
                <input
                  checked={regionType === 2}
                  name="projectRegion"
                  onChange={() => this.setState({regionType: 2})}
                  type="radio"
                  value={2}
                />
                {validate.customRadio}
              </span>
              {regionType === 2 && this.renderCustomRegions()}
              <button
                className="map-upd-btn"
                disabled={creatingProject}
                onClick={() => this.createProject(selectedDates[mineType] || "demo")}
                style={{marginTop: ".25rem"}}
                type="button"
              >
                {`${validate.createButton} ${selectedDates[mineType]}`}
              </button>
              <p>{errorMsg}</p>
            </div>
          ) : (
            <LoginMessage actionText={validate.loginAction}/>
          )}
      </div>
    );
  }
}
ValidatePanel.contextType = MainContext;
