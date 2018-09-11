<template>
  <div class='chatSession'>
    <leftbar></leftbar>
    <mainBox></mainBox>
    <rightbar></rightbar>
  </div>
</template>

<script>
  import leftbar from './leftbar/leftbar'
  import mainBox from './mainBox/mainBox'
  import rightbar from './rightbar/rightbar'
  export default {
    components: {
      'leftbar': leftbar,
      'mainBox': mainBox,
      'rightbar': rightbar
    },
    data () {
      return {
      }
    },
    created () {
      // 融云初始化
      RongIMClient.init("ik1qhw09iptvp")
      // 连接服务器
      let ryToken = this.$store.state.token.ryToken
      RongIMClient.connect(ryToken, {
        onSuccess: function (userId) {
          console.log("Login successfully." + userId);
        },
        onTokenIncorrect: function () {
          console.log('token无效');
        },
        onError: function (errorCode) {
          var info = '';
          switch (errorCode) {
            case RongIMLib.ErrorCode.TIMEOUT:
              info = '超时';
              break;
            case RongIMLib.ErrorCode.UNKNOWN_ERROR:
              info = '未知错误';
              break;
            case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
              info = '不可接受的协议版本';
              break;
            case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
              info = 'appkey不正确';
              break;
            case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
              info = '服务器不可用';
              break;
          }
          console.log(errorCode);
        }
      })
      // 设置监听
      RongIMClient.setConnectionStatusListener({
        onChanged: function (status) {
          switch (status) {
            //链接成功
            case RongIMLib.ConnectionStatus.CONNECTED:
              console.log('链接成功');
              break;
              //正在链接
            case RongIMLib.ConnectionStatus.CONNECTING:
              console.log('正在链接');
              break;
              //重新链接
            case RongIMLib.ConnectionStatus.DISCONNECTED:
              console.log('断开连接');
              break;
              //其他设备登陆
            case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
              console.log('其他设备登陆');
              setTimeout(function () {
                window.location.href = "http://211.149.244.171:8081";
              }, 1000)
              break;
              //网络不可用
            case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
              console.log('网络不可用');
              break;
          }
        }
      })
    }
  }
</script>

<style scoped lang="stylus">
  .chatSession
    position absolute
    top 20px
    left 100px
    height 86vh
    width 66vw
    display flex
    user-select none
    overflow hidden
</style>
