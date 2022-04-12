export const THEME = {
  disabled: {
    background: "#ddd",
    color: "#999"
  },
  primary: {
    background: "#f0ad4e",
    color: "#eee"
  },
  mina: {
    background: "red",
    color: "#eee"
  },
  noMina: {
    background: "green",
    color: "#eee"
  },
  map: {
    boundary: "yellow",
    unanswered: "blue"
  }
};

export const URLS = {
  ADD_SUBS: "add-subscription",
  AREA_STATS: "get-stats-by-region",
  AREA_TOTAL_STATS: "get-stat-totals",
  CLOSE_PROJ: "close-project",
  DEL_SUBS: "remove-subscription",
  DATA_DATES: "get-data-dates",
  CREATE_PROJ: "create-project",
  FEATURE_NAMES: "get-feature-names",
  GET_IMAGE_URL: "get-image-url",
  GET_DL_URL: "get-download-url",
  GET_INFO: "get-info",
  IMG_DATES: "get-image-names",
  NICFI_DATES: "get-nicfi-dates",
  MAPQUEST: "https://open.mapquestapi.com/geocoding/v1/address",
  PROJ_DATA: "get-project-by-id",
  PROJ_PLOTS: "get-project-plots",
  PREDICTIONS: "download-predictions",
  REPORT_MINE: "report-mine",
  SAVE_ANSWER: "save-user-answer",
  USER_MINES: "download-user-mines",
  USER_SUBS: "user-subscriptions",
  USER_PROJ: "user-projects"
};

export const availableLayers = [
  "cMines",
  "nMines",
  "pMines",
  "municipalBounds",
  "legalMines",
  "otherAuthorizations",
  "tierrasDeCom",
  "resguardos",
  "protectedAreas",
  "NICFI"
];

export const startVisible = [
  "cMines",
  "NICFI"
];

export const attributions = {
  "NICFI": "<a target=\"_top\" rel=\"noopener\" href=\"https://www.planet.com/nicfi/\">Imagery ©2021 Planet Labs Inc</a>. <a target=\"_top\" rel=\"noopener\" href=\"https://assets.planet.com/docs/Planet_ParticipantLicenseAgreement_NICFI.pdf\">All use subject to the Participant License Agreement</a>"
};
