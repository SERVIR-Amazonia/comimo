import React from "react";
import ReactDOM from "react-dom";

import AccountForm from "./components/AccountForm";
import Button from "./components/Button";

import {getLanguage, jsonRequest} from "./utils";

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
    jsonRequest(`/locale/${getLanguage(["en", "es"])}.json`, null, "GET")
      .then(data => this.setState({localeText: data.users}))
      .catch(error => console.error(error));
  }

  requestLogin = () => {
    const {username, password} = this.state;
    jsonRequest("/login", {username, password})
      .then(data => {
        if (data === "") {
          window.location = "/";
        } else {
          console.error(data);
          alert(this.state.localeText[data] || this.state.localeText.errorCreating);
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
      <AccountForm
        header={localeText.loginTitle}
        onSubmit={e => {
          e.preventDefault();
          this.requestLogin();
        }}
      >
        {this.renderField(localeText.username, "text", "username")}
        {this.renderField(localeText.password, "password", "password")}
        <div className="d-flex justify-content-between align-items-center">
          <a href="/password-forgot">{localeText.forgot}</a>
          <Button
            className="mt-3"
            onClick={this.requestLogin}
          >
            {localeText.login}
          </Button>
        </div>
        <div className="d-flex flex-column align-items-center">
          <h3 className="">{localeText.newUser}</h3>
          <div className="">
            <div >
              <Button
                name="register"
                onClick={() => { window.location = "/register"; }}
              >
                {localeText.register}
              </Button>
            </div>
          </div>
        </div>
      </AccountForm>
    );
  }
}

export function pageInit(args) {
  ReactDOM.render(<Login/>, document.getElementById("main-container"));
}
