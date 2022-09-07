import React, { useState, Suspense } from "react";
import ReactDOM from "react-dom";
import styled from "@emotion/styled";
import { ThemeProvider } from "@emotion/react";

import AccountForm from "./components/AccountForm";
import Button from "./components/Button";
import LanguageSelector from "./components/LanguageSelector";
import LoadingModal from "./components/LoadingModal";
import Modal from "./components/Modal";
import Select from "./components/Select";
import TextInput from "./components/TextInput";

import { processModal, showModalAtom } from "./home";

import { PageLayout } from "./components/PageLayout";
import { jsonRequest } from "./utils";
import { THEME } from "./constants";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { useTranslation } from "react-i18next";

const PageContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

function UserAccount() {
  const [showModal, setShowModal] = useAtom(showModalAtom);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [institution, setInstitution] = useState("");
  const [sector, setSector] = useState("academic");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [defaultLang, setDefaultLang] = useState("en");
  const [messageBox, setMessageBox] = useState(null);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    getUserInformation();
  }, []);

  const showAlert = (messageBox) => setMessageBox(messageBox);

  const verifyInputs = () => {
    return [
      fullName.length === 0 && users.errorNameReq,
      institution.length === 0 && users.errorInstitutionReq,
    ].filter((e) => e);
  };

  const getUserInformation = () => {
    processModal(async () => {
      const data = await jsonRequest("/user-information").catch(console.error);
      if (data.username) {
        setDefaultLang(data.defaultLang);
        setUsername(data.username);
        setEmail(data.email);
        setUsername(data.username);
        setFullName(data.fullName);
        setInstitution(data.institution);
        setSector(data.sector);
      } else {
        console.error("userNotFound");
        alert(t("users.userNotFound"));
      }
    }, setShowModal);
  };

  const updateUser = async () => {
    const errors = verifyInputs();
    if (errors.length > 0) {
      alert(errors.map((e) => " - " + e).join("\n"));
    } else {
      processModal(async () => {
        const resp = await jsonRequest("/update-account", {
          defaultLang,
          fullName,
          institution,
          sector,
        }).catch(console.error);

        if (resp === "") {
          i18n.changeLanguage(defaultLang, (err, t) => {
            if (err) return console.log("something went wrong loading", err);
          });

          showAlert({
            body: t("users.successUpdate"),
            closeText: t("users.close"),
            title: t("users.updateTitle"),
          });
        } else {
          console.error(resp);
          showAlert({
            body: t("users.errorUpdating"),
            closeText: t("users.close"),
            title: t("users.error"),
          });
        }
      }, setShowModal);
    }
  };
  return (
    <ThemeProvider theme={THEME}>
      <PageContainer>
        {showModal && <LoadingModal message={t("users.modalMessage")} />}
        {/* TODO: Make submitFn optional for AccountForm and TitledForm */}
        <AccountForm header={t("users.userAccountTitle")} submitFn={() => { }}>
          <div style={{ display: "flex", marginBottom: "0.5rem" }}>
            <label style={{ marginRight: "1rem" }}>{t("users.language")}</label>
            <LanguageSelector
              selectedLanguage={defaultLang}
              selectLanguage={(newLnag) => {
                setDefaultLang(newLnag);
                i18n.changeLanguage(newLnag, () => { });
              }}
            />
          </div>
          <TextInput
            disabled={false}
            id="username"
            label={t("users.username")}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={`Enter ${(t("users.username") || "").toLowerCase()}`}
            type={"text"}
            value={username}
          />

          <TextInput
            disabled={false}
            id="email"
            label={t("users.email")}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={`Enter ${(t("users.email") || "").toLowerCase()}`}
            type={"email"}
            value={email}
          />

          <TextInput
            disabled={false}
            id="fullName"
            label={t("users.fullName")}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={`Enter ${(t("users.fullName") || "").toLowerCase()}`}
            type={"text"}
            value={fullName}
          />

          <TextInput
            disabled={false}
            id="institution"
            label={t("users.institution")}
            onChange={(e) => setInstitution(e.target.value)}
            placeholder={`Enter ${(t("users.institution") || "").toLowerCase()}`}
            type={"text"}
            value={institution}
          />

          <Select
            id="sector"
            label={t("users.sector")}
            onChange={(e) => setSector(e.target.value)}
            options={[
              { value: "academic", label: t("users.academic") },
              { value: "government", label: t("users.government") },
              { value: "ngo", label: t("users.ngo") },
            ]}
            value={sector}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "red" }}>{t("users.allRequired")}</span>
            <div style={{ display: "flex", marginTop: "0.5rem" }}>
              <Button
                onClick={() => {
                  showAlert({
                    body: t("users.logOutBody"),
                    closeText: t("users.cancel"),
                    confirmText: t("users.confirmText"),
                    onConfirm: () => window.location.assign("/logout"),
                    title: t("users.logout"),
                  });
                }}
                extraStyle={{ marginRight: "0.5rem" }}
              >
                {t("users.logout")}
              </Button>
              <Button
                onClick={() => {
                  showAlert({
                    body: t("users.updateBody"),
                    closeText: t("users.cancel"),
                    confirmText: t("users.confirmText"),
                    onConfirm: () => updateUser(),
                    title: t("users.userAccountTitle"),
                  });
                }}
              >
                {t("users.save")}
              </Button>
            </div>
          </div>
        </AccountForm>
        {messageBox && (
          <Modal {...messageBox} onClose={() => setMessageBox(null)}>
            <p>{messageBox.body}</p>
          </Modal>
        )}
      </PageContainer>
    </ThemeProvider>
  );
}

export function pageInit(args) {
  ReactDOM.render(
    <Suspense fallback="">
      <PageLayout
        role={args.role}
        username={args.username}
        mapboxToken={args.mapboxToken}
        mapquestKey={args.mapquestKey}
        versionDeployed={args.versionDeployed}
        showSearch={true}
      >
        <UserAccount />
      </PageLayout>
    </Suspense>,
    document.getElementById("main-container")
  );
}
