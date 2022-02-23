import React from "react";
import ReactDOM from "react-dom";

import {getLanguage, sendRequest} from "./utils";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      localeText: {}
    };
  }

  componentDidMount() {
    sendRequest(`/locale/${getLanguage(["en", "es"])}.json`, null, "GET")
      .then(data => this.setState({localeText: data.users}))
      .catch(error => console.error(error));
  }

  requestLogin = () => {
    const {username, password} = this.state;
    sendRequest("/login", {username, password})
      .then(data => {
        if (data[0] && data[1] === "") {
          window.location = "/";
        } else {
          console.error(data[1]);
          alert(this.state.localeText[data[1]] || data[1] || this.state.localeText.errorCreating);
        }
      })
      .catch(err => console.error(err));
  };

  renderField = (label, type, stateKey) => (
    <div className="d-flex flex-column">
      <label htmlFor={stateKey}>{label}</label>
      <input
        className="p-2"
        id={stateKey}
        onChange={e => this.setState({[stateKey]: e.target.value})}
        onKeyPress={e => {
          if (e.key === "Enter") this.requestLogin();
        }}
        placeholder={`Enter ${(label || "").toLowerCase()}`}
        type={type}
        value={this.state[stateKey]}
      />
    </div>
  );

  render() {
    const {localeText} = this.state;
    return (
      <div
        className="d-flex justify-content-center"
        style={{paddingTop: "20vh"}}
      >
        <div className="card">
          <div className="card-header">{localeText.loginTitle}</div>
          <div className="card-body">
            {this.renderField(localeText.username, "text", "username")}
            {this.renderField(localeText.password, "password", "password")}
            <div className="d-flex justify-content-between align-items-center">
              <a href="/password-forgot">{localeText.forgot}</a>
              <button
                className="btn orange-btn mt-3"
                onClick={this.requestLogin}
                type="button"
              >
                {localeText.login}
              </button>
            </div>
            <div className="d-flex flex-column align-items-center">
              <h3 className="">{localeText.newUser}</h3>
              <div className="">
                <div >
                  <button
                    className="btn orange-btn"
                    name="register"
                    onClick={() => { window.location = "/register"; }}
                    type="button"
                  >
                    {localeText.register}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export function pageInit(args) {
  ReactDOM.render(<Login/>, document.getElementById("main-container"));
}
