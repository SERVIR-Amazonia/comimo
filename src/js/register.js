import React from "react";
import ReactDOM from "react-dom";
import EmailValidator from "email-validator";

import LoadingModal from "./components/LoadingModal";
import LanguageSelector from "./components/LanguageSelector";

import {getCookie, getLanguage, validatePassword} from "./utils";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      fullName: "",
      institution: "",
      sector: "academic",
      password: "",
      passwordConfirmation: "",
      localeText: {},
      defaultLang: "en",
      showModal: false
    };
  }

  componentDidMount() {
    const lang = getLanguage(["en", "es"]);
    this.setState({defaultLang: lang});
    this.getLocalText(lang);
  }

  /// State Update ///

  processModal = callBack => new Promise(() => Promise.resolve(
    this.setState(
      {showModal: true},
      () => callBack().finally(() => this.setState({showModal: false}))
    )
  ));

  selectLanguage = newLang => {
    this.setState({defaultLang: newLang});
    this.getLocalText(newLang);
  };

  /// API Calls ///

  getLocalText = lang => {
    fetch(
    `/static/locale/${lang}.json`,
    {headers: {"Cache-Control": "no-cache", "Pragma": "no-cache", "Accept": "application/json"}}
    )
      .then(response => (response.ok ? response.json() : Promise.reject(response)))
      .then(data => this.setState({localeText: data.users}))
      .catch(err => console.error(err));
  };

    verifyInputs = () => {
      const {username, email, fullName, institution, password, passwordConfirmation, localeText} = this.state;
      return [
        username.length < 6 && localeText.errorUsernameLen,
        !EmailValidator.validate(email) && localeText.errorInvalidEmail,
        fullName.length === 0 && localeText.errorNameReq,
        institution.length === 0 && localeText.errorInstitutionReq,
        !validatePassword(password) && localeText.errorPassword,
        password !== passwordConfirmation && localeText.errorPassMatch
      ].filter(e => e);
    };

    registerUser = () => {
      const errors = this.verifyInputs();
      if (errors.length > 0) {
        alert(errors.map(e => " - " + e).join("\n"));
      } else {
        this.processModal(() =>
          fetch("/register/",
                {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken")
                  },
                  body: JSON.stringify({
                    defaultLang: this.state.defaultLang,
                    username: this.state.username,
                    email: this.state.email,
                    fullName: this.state.fullName,
                    institution: this.state.institution,
                    sector: this.state.sector,
                    password: this.state.password
                  })
                })
            .then(response => Promise.all([response.ok, response.text()]))
            .then(data => {
              if (data[0] && data[1] === "") {
                alert(this.state.localeText.registered);
                window.location = "/";
              } else {
                console.log(data[1]);
                alert(this.state.localeText[data[1]] || this.state.localeText.errorCreating);
              }
            })
            .catch(err => console.log(err)));
      }
    };

    /// Render Functions ///

    renderField = (label, type, stateKey) => (
      <div className="d-flex flex-column">
        <label htmlFor={stateKey}>{label}</label>
        <input
          className="p-2"
          id={stateKey}
          onChange={e => this.setState({[stateKey]: e.target.value})}
          onKeyPress={e => {
            if (e.key === "Enter") this.registerUser();
          }}
          placeholder={`Enter ${(label || "").toLowerCase()}`}
          type={type}
          value={this.state[stateKey]}
        />
      </div>
    );

    renderSelect = (label, options, stateKey) => (
      <div className="d-flex flex-column">
        <label htmlFor={stateKey}>{label}</label>
        <select
          className="p-2"
          id={stateKey}
          onChange={e => this.setState({[stateKey]: e.target.value})}
          value={this.state[stateKey]}
        >
          {options.map(({key, optLabel}) => (
            <option key={key} value={key}>{optLabel}</option>
          ))}
        </select>
      </div>
    );

    render() {
      const {localeText, defaultLang} = this.state;
      return (
        <div
          className="d-flex justify-content-center"
          style={{paddingTop: "2rem"}}
        >
          {this.state.showModal && <LoadingModal message={localeText.modalMessage}/>}
          <div className="card">
            <div className="card-header">{localeText.registerTitle}</div>
            <div className="card-body">
              <div className="d-flex">
                <label className="mr-3">{localeText.language}</label>
                <LanguageSelector
                  selectedLanguage={defaultLang}
                  selectLanguage={this.selectLanguage}
                />
              </div>
              {this.renderField(localeText.username, "text", "username")}
              {this.renderField(localeText.email, "email", "email")}
              {this.renderField(localeText.fullName, "text", "fullName")}
              {this.renderField(localeText.institution, "text", "institution")}
              {this.renderSelect(
                localeText.sector,
                [
                  {key: "academic", optLabel: localeText.academic},
                  {key: "government", optLabel: localeText.government},
                  {key: "ngo", optLabel: localeText.ngo}
                ],
                "sector"
              )}
              {this.renderField(localeText.password, "password", "password")}
              {this.renderField(localeText.confirm, "password", "passwordConfirmation")}
              <div className="d-flex justify-content-between align-items-center">
                <span style={{color: "red"}}>{localeText.allRequired}</span>
                <button
                  className="btn orange-btn mt-3"
                  onClick={this.registerUser}
                  type="button"
                >
                  {localeText.register}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
}

export function pageInit(args) {
  ReactDOM.render(<Register/>, document.getElementById("main-container"));
}
