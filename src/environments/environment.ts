const BASE_URL = 'http://localhost:3000';
export const environment = {
  production: false,
  backendpoints: {
    getUser: BASE_URL + '/user',
    login: BASE_URL + '/createSession',
    register: BASE_URL + '/createUser',
    updatePass: BASE_URL + '/updatePass',
    deleteUser: BASE_URL + '/deleteUser',
    activateUser: BASE_URL + '/activateUser',
    updateRole: BASE_URL + '/updateRole',
    assetType: BASE_URL + '/assetType',
    asset: BASE_URL + '/asset',
    createAsset: BASE_URL + '/createAsset',
    updateAsset: BASE_URL + '/updateAsset',
    deleteAsset: BASE_URL + '/deleteAsset',
    matrix: BASE_URL + '/matrix',
    incident: BASE_URL + '/incident',
    createIncident: BASE_URL + '/createIncident',
    updateIncident: BASE_URL + '/updateIncident',
    deleteIncident: BASE_URL + '/deleteIncident',
    closeIncident: BASE_URL + '/closeIncident'
  },
  userRoles: {
    admin: "ADM",
    consultor: "CON",
    rsis: "RSI",
    rseg: "RSE"
  },
  baseurl: 'http://localhost:3000'
};
