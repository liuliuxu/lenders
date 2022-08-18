import { login, logout, getMenuList } from '@/api/user'
import { getToken, setToken, removeToken,removeUserInfo, getUserInfo, setUserInfo } from '@/utils/auth'
import { resetRouter,asyncRoutes,constantRoutes } from '@/router'
import Layout from '@/layout'

const getDefaultState = () => {
  return {
    token: getToken(),
    ID: '',
	  avatar:'',
    userInfo: getUserInfo(),
    permissionRoutes: [],
    addRoutes: []
  }
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USERINFO: (state, userInfo) => {
    console.error(userInfo);
    state.userInfo = userInfo;
  },
  SET_ROUTES: (state, routes) => {
	state.addRoutes = routes;
	state.permissionRoutes = constantRoutes.concat(routes).concat(asyncRoutes)
  }
};

// 生成菜单
export function generaMenu(routes, data, parent) {
  if (!data || !data.length) {
    return routes;
  }
  data.forEach(item => {
    let menu;
    let viewpath = parent;
    if (item.sysMenuLists) {
      menu = {
        path: '/'+item.menucode,
		ID:item.ID,
        component: Layout,
        children: [],
        redirect: `/${item.menucode}/${item.sysMenuLists[0].menucode}`,
        meta: { title: item.menuname, icon: item.icon, titleCn: item.menuname_Ch, titleEn: item.menuname }
      }
    } else {
      menu = {
        path: '/'+item.menucode,
		ID:item.ID,
        component: loadView(viewpath, item.menucode),
        name: item.menuname,
        meta: { title: item.menuname, titleCn: item.menuname_Ch, titleEn: item.menuname }
      }
    }
    if (item.sysMenuLists) {
      generaMenu(menu.children, item.sysMenuLists, item.menucode)
    }
    routes.push(menu)
  });
  return routes;
}

export const loadView = (parent, path) => { // 路由懒加载
  if (path === 'S2ZDDLB') {
    path = 'CSZDDLB';
  }
  if (path === 'S2DDLB') {
    path = 'CSDDLB';
  }
  if (path === 'M1ZDDLB') {
    path = 'CSZDDLB';
  }
  if (path === 'M1DDLB') {
    path = 'CSDDLB';
  }
  if (path === 'S2YJBB') {
    path = 'S1YJBB';
  }
  return (resolve) => require([`@/views/${parent}/${path}/index`], resolve)
  // return () => import(`@/views${parent}/${path}/index`)
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ UserName: username.trim(), UserPsw: password }).then(response => {
        const  data  = response;
        commit('SET_TOKEN', data.Token);
        commit('SET_USERINFO', data);
        setToken(data.Token);
		setUserInfo(data);
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  GetMenuList({ commit, state }) {
    return new Promise((resolve, reject) => {
	  const loadMenuData = [];
	  // todo
      // SET_USERINFO

      let data = state.userInfo.MenuLists;
      if (!data || !data.length) {
        reject('No Menu');
      }
      data = Object.assign(loadMenuData, data);
      let routes = [];
      routes = generaMenu(routes, loadMenuData);
      // console.log(routes);
      commit('SET_ROUTES', routes);
      resolve(routes);
      // getMenuList({"Id":state.userInfo.ID,"token":state.token}).then(response => {
      //   let data = response.sysMenuList
		// Object.assign(loadMenuData, data)
		// let routes=[]
		// generaMenu(routes, loadMenuData)
		// console.log(routes)
		// commit('SET_ROUTES', routes)
      //   resolve(routes)
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken(); // must remove  token  first
        resetRouter();
        commit('RESET_STATE');
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken(); // must remove  token  first
	  removeUserInfo();
      commit('RESET_STATE');
      resolve()
    })
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
