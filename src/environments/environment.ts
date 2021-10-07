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
    updateRole: BASE_URL + '/updateRole'
  },
  userRoles: {
    admin: "ADM",
    consultor: "CON",
    rsis: "RSI",
    rseg: "RSEG"
  },
  baseurl: 'http://localhost:3000'
};
