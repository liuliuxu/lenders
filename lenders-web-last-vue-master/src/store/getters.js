const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  device: state => state.app.device,
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  addRoutes: state => state.user.addRoutes,
  permissionRoutes: state => state.user.permissionRoutes,
  avatar: state => state.user.avatar,
  name: state => state.user.name
};
export default getters;
