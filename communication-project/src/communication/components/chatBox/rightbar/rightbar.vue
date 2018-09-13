<template>
  <div class="tools">
    <div class="tHeader">
      <div :class="{activeBG:(quickItems==1)?true:false}" @click='quickItems="1"'>快速回复</div>
      <div class='userDetail' :class="{activeBG:(quickItems==2)?true:false}" @click='getUserInfo()'>用户详情</div>
    </div>
    <div class='resBody' v-if='quickItems==1'>
      <div class="quickRes">
        <span :class="{activeBG2:(resItems==1)?true:false}"  @click='resItems="1"'>个人快捷语</span>
        <span :class="{activeBG2:(resItems==2)?true:false}"  @click='getCQR'>公共快捷语</span>
      </div>
      <div class='personRes' v-if='resItems==1'>
        <div class="resEdit" contenteditable="true"></div>
        <div class="addRes" @click="addQR()">添加快捷语</div>
        <ul class="quickResItems" @click="sendQuickMsg" @mousedown="deletQR">
          <li v-for='selfQ in selfQR' :key='selfQ.createTime' :id='selfQ.shortcutPhraseId'>{{selfQ.content}}</li>
        </ul>
      </div>
      <div class='commonRes' v-if='resItems==2'>
        <ul class="quickResItems" @click="sendQuickMsg" style='margin-top:20px'>
          <li v-for='commonQ in commonQR' :key='commonQ.createTime'>{{commonQ.content}}</li> 
        </ul>
      </div>
    </div>
    <div class="userInfo" v-if='quickItems==2'>
      <img :src="target.icon" alt="无法显示">
      <p>昵称：{{target.name}}</p>
      <p>微信ID：{{target.id}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        quickItems: '1',
        resItems: '1',
        selfQR: [],
        userId: '',
        commonQR: []
      }
    },
    computed: {
      token () {
        return this.$store.state.token
      },
      target () {
        return this.$store.state.target
      }
    },
    methods: {
      getCQR () {
        this.resItems = '2'
        this.$http.get('http://192.168.1.202:8140/api/v1/shortcutPhrase/parentList?parentUserId='+this.$store.state.token.parentUserId).then(res=>{
          console.log('公共快捷语 from rightbar',res)
          this.commonQR = res.body.data.list
        })
      },
      getUserInfo () {
        this.quickItems="2"
        this.$http.get('http://192.168.1.202:8140/api/v1/user/child/getAgentInfo?wxId='+this.$store.state.targetWxId).then(res=>{
          console.log('当前用户信息 from rightbar',res)
        })
      },
      deletQR: function (e) {
        if (e.button === 2) {
          if(window.confirm('确定删除？')){
            this.$http.post(`http://192.168.1.202:8140/api/v1/shortcutPhrase/delete?ryUserId=${this.userId}&shortcutPhraseId=${e.target.getAttribute('id')}`).then((res)=>{
              console.log('删除快捷语成功 from rightbar',res)
              document.querySelector('.quickResItems').removeChild(e.target)
            })
          }
        }
      },
      addQR: function () {
        var text = document.querySelector('.resEdit').innerText
        if (text == "") {
          alert('请输入内容')
        } else {
          document.querySelector('.resEdit').innerText = ""
          this.$http.get(`http://192.168.1.202:8140/api/v1/shortcutPhrase/insertShortcut?content=${text}&kfRyUserId=${this.userId}`).then((res)=>{
            console.log('添加快捷语成功 from rightbar',res)
            this.$http.get('http://192.168.1.202:8140/api/v1/shortcutPhrase/list?kfRyUserId='+this.userId).then(res=>{
              console.log('快捷语 from rightbar',res)
              this.selfQR = res.body.data.list
            })
          })
        }
      },
      sendQuickMsg: function (e) {
        if (e.target.nodeName == 'LI') {
          var text = e.target.innerText
          document.querySelector('.sendBox').innerText += text
        }
      }
    },
    created () {
      // 融云初始化
      RongIMClient.init("ik1qhw09iptvp")
      // 连接服务器
      let _this = this
      RongIMClient.connect(_this.token.ryToken, {
        onSuccess: function (userId) {
          _this.userId = userId
          console.log("Login successfully." + userId);
          _this.$http.get('http://192.168.1.202:8140/api/v1/shortcutPhrase/list?kfRyUserId='+userId).then(res=>{
            console.log('快捷语 from rightbar',res)
            _this.selfQR = res.body.data.list
          })
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
  .activeBG 
    background rgba(77,149,250,0.4)
  .activeBG2
    background #ddd
  
  .tools 
    position relative
    width 300px
    height 100%
    border-left 1px solid #ddd
    background white
    .tHeader
      position relative
      height 40px
      display flex
      justify-content space-around
      align-items center
      div
        position relative
        padding 10px
        flex 1
        text-align center
        &:hover
          background rgba(77,149,250,0.4)
          border-bottom 2px #4d95fa solid
    .resBody
      position relative
      .quickRes
        position relative
        display flex
        justify-content space-around
        border-bottom 1px solid #ddd
        span
          position relative
          width 40%
          margin-top 14px
          padding 10px 0
          font-size 12px
          text-align center
          &:hover
            background #ddd
      .personRes
        .resEdit
          position relative
          height 80px
          width 240px
          margin 10px auto
          padding 10px
          border 1px solid black
        .addRes
          position relative
          margin-left 200px 
          padding 6px
          display inline-block
          border-radius 10px 
          background rgba(77,149,250,0.8)
          color white
          font-size 14px
          font-weight bold
      .quickResItems
        position relative
        width 300px
        height 500px
        padding 0
        margin 0
        overflow auto
        list-style none
        li  
          position relative
          margin 10px
          padding 10px
          border-radius 10px 
          background rgba(77,149,250,0.4)
    .userInfo
      position relative
      text-align center
      img
        position relative
        width 100px
        height 100px
        margin 20px 0 0 0
        border-radius 200px

</style>
