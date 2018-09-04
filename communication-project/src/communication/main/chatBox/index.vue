<template>
  <div class="chatBox">
    <div class="sideBar">
      <input type="text" placeholder="搜索">
      <img src="./search.png" alt="#">
      <div class="sortPeople">
        <div class="allP">全部</div>
        <div class="starP">星标</div>
        <div class="blackP">黑名单</div>
      </div>
      <ul id="userList">
        <li class="users" :targetid="targetId">
          <img :src="targetId_pic" alt="#">
          <span contenteditable >{{targetId_name}}</span>
        </li>
      </ul>
    </div>
    <div class="mainBox">
      <div class="selectItems">
        <div class="chat">聊天</div>
        <div class="moreInfo">用户信息</div>
        <div class="history">历史消息</div>
      </div>
      <div class="sended">
      </div>
      <div class="send">
        <div class="sendOthers">
          <div class="emoji"><img src="./emoji.png" alt="#"></div>
          <div class="img"><img src="./img.png" alt="#"></div>
          <div class="redPocket"><img src="./redPocket.png" alt="#"></div>
          <div class="quickRes"><img src="./quickRes.png" alt="#"></div>
        </div>
        <p class="sendBox" contenteditable="true"></p>
        <button class="sending">发送</button>
      </div>
    </div>  
  </div>
</template>

<script>
  export default {
    components: {
    },
    data () {
      return {
        targetId: '654321',
        targetId_pic: 'http://wx.qlogo.cn/mmhead/ver_1/nR8IeiazUxoPTW5oKRicSibaWaMa1oLls3dwh5xwtcwCB2KmlG2icibjFt5jib4IyplJTyiaSf2RN9joVng0ndeKgCrGw/0',
        targetId_name: '新用户1',
        time60: 0
      }
    },
    methods: {
      
    },
    created () {
      // 初始化
      RongIMClient.init("ik1qhw09iptvp")
      var token = 'jhwJXPzUc3dYNcGYA3/Ln1s+RtyXWZeOCCTDdGq30ViljekO8KHmFEKVC4U36oUpVewqpwb4b0T1v/rJ5Wq0lg=='
      // 连接服务器
      RongIMClient.connect(token, {
        onSuccess: function (userId) {
          this.targetId = userId
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
              getConversationList();
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
      // 消息监听器
      RongIMClient.setOnReceiveMessageListener({
        // 接收到的消息
        onReceived: function (message) {
          console.log(message);
          // 判断消息类型
          switch (message.messageType) {
            case RongIMClient.MessageType.TextMessage:
              var time = formatDateTime(message.receivedTime)
              if (this.time60 == 60) {
                clearTimeout(timer)
                var node = `<div style="padding-left:4px"><img src=${message.content.user.portrait} alt="#" width="40px" height="40px"><span style="display:inline-block;width:150px;word-wrap:break-word;vertical-align:text-top">${message.content.content}</span></div>`
                } else {
                var node = `<p style="margin:0;text-align:center">${time}</p><div style="padding-left:4px"><img src=${message.content.user.portrait} alt="#" width="40px" height="40px"><span style="display:inline-block;width:150px;word-wrap:break-word;vertical-align:text-top">${message.content.content}</span></div>`
                this.time60 = 60
                var timer = setTimeout(function(){this.time60 = 0},60000)
              }
              document.querySelector('.sended').innerHTML += node
              document.querySelector('.sended').scrollTop = document.querySelector('.sended').scrollHeight
              break;
            case RongIMClient.MessageType.ImageMessage:
              // do something...
              break;
            case RongIMClient.MessageType.DiscussionNotificationMessage:
              // do something...
              break;
            case RongIMClient.MessageType.LocationMessage:
              // do something...
              break;
            case RongIMClient.MessageType.RichContentMessage:
              // do something...
              break;
            case RongIMClient.MessageType.DiscussionNotificationMessage:
              // do something...
              break;
            case RongIMClient.MessageType.InformationNotificationMessage:
              // do something...
              break;
            case RongIMClient.MessageType.ContactNotificationMessage:
              // do something...
              break;
            case RongIMClient.MessageType.ProfileNotificationMessage:
              // do something...
              break;
            case RongIMClient.MessageType.CommandNotificationMessage:
              // do something...
              break;
            case RongIMClient.MessageType.CommandMessage:
              // do something...
              break;
            case RongIMClient.MessageType.UnknownMessage:
              // do something...
              break;
            default:
              // 自定义消息
              // do something...
          }
        }
      })
      //获取会话列表
      function getConversationList() {
        var conversationTypes = null; //具体格式设置需要补充
        var limit = null; //获取会话的数量，不传或传null为全部，暂不支持分页
        RongIMClient.getInstance().getConversationList({
          onSuccess: function (list) {
            list.sort(function (a, b) {
              return a.sentTime > b.sentTime;
            });
            console.log(list)
          },
          onError: function (error) {
            console.log('获取失败')
          }
        }, conversationTypes, limit);
      }
      // 时间转换
      function formatDateTime (inputTime) {
        var date = new Date(inputTime);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return (y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .chatBox 
    position absolute
    left 14vw
    top 50px
    height 80vh
    width 60vw
    max-width 1000px
    background white
    border-radius 30px

    .sideBar 
      position: absolute;
      width: 200px;
      height: 100%;
      border-right: 1px #ddd solid
      overflow auto
      input 
        display block
        height 28px
        margin 20px auto 30px auto
        padding-left 10px
        border none
        border-radius 10px
        background #d6e6fc
        &:focus
            outline none
      >img 
        position absolute
        top 22px
        left 158px
        width 24px
      .sortPeople 
        display flex
        width 100%
        justify-content: space-around
        font-size 14px
        div
          width 50px
          text-align center
          border-bottom: 2px solid white
          &:hover 
            border-bottom: 2px solid #4d95fa
      #userList
        padding 0
        list-style none
        height 100px
        .users
          display flex
          justify-content center
          align-items center
          img 
            height 24px
            width 24px
            margin-right 18px

    .mainBox
      position absolute
      top 0
      left 200px
      width calc(100% - 200px)
      height 100%
      .selectItems
        width 100%
        height 40px
        display flex
        border-bottom 1px #ddd solid
        overflow hidden
        div
          width 100px
          height 20px
          padding 10px 0
          text-align center
      .sended
        height calc(100% - 220px)
        overflow auto
        padding-bottom 10px
      .send
        height 170px
        .sendOthers
          height 36px
          display flex
          border-top 1px #ddd solid
          img
            width 26px
            padding 5px 10px
        .sendBox
          width calc(100% - 40px)
          height 114px
          padding 0 20px
          margin 6px 0
          border none
          &:focus
            outline none
        .sending
          position absolute
          right 10px
          bottom 10px
          height 30px
          width 60px
          border none
          border-radius 40px
          background #4d95fa
          color white
          font-weight bold
          &:focus
            outline none
</style>
