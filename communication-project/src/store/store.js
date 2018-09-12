import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    session: 'chatBox',
    deviceName: '',
    deviceWxId: '',
    targetWxName: '',
    targetWxId: '',
    targetWxIcon: '',
    newMsg: ''
  },
  mutations: {
    setToken (state,token) {
      state.token = token
    }, // communication/components/navbar
    changeSession (state,session) {
      state.session = session
    }, // communication/components/navbar
    changeDevice (state,device) {
      state.deviceName = device.name
      state.deviceWxId = device.id
    }, // communication/components/navbar
    changeTarget (state,target) {
      state.targetWxName = target.name
      state.targetWxId = target.id
      state.targetWxIcon = target.icon
    }, // communication/components/leftbar
    addUser (state,user) {
      state.wxUsers.unshift(user)
    }, // communication/components/leftbar
    getNewMsg (state,data) {
      state.newMsg = data
    } // communication/components/mainBox
  } 
})