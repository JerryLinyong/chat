import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 聊天项目
    token: {},
    session: 'chatBox',
    deviceName: '',
    wxUsers: [],
    // 聊天项目下的聊天框
    targetWxName: '',
    targetWxId: '',
    targetWxIcon: '',
    newMsg: ''
  },
  mutations: {
    // 聊天项目
    setToken (state,token) {
      state.token = token
    },
    changeSession (state,session) {
      state.session = session
    },
    changeDevice (state,device) {
      state.deviceName = device
    },
    userList (state,users) {
      state.wxUsers = users
    },
    // 聊天项目下的聊天框
    changeTarget (state,target) {
      state.targetWxName = target.name
      state.targetWxId = target.id
      state.targetWxIcon = target.icon
    },
    addUser (state,user) {
      state.wxUsers.unshift(user)
    },
    getNewMsg (state,data) {
      state.newMsg = data
    }
  }
})