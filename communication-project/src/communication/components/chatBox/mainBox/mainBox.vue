<template>
  <div class="mainBox">
    <div class="chatInfo">
      <div class="chat">当前会话： &nbsp;{{deviceName}}--<span id='chattingF'>{{target.name}}</span></div>
      <div>备注:</div>
      <div class="addMore" @click="addHistory">加载历史消息</div>          
    </div>
    <div class="bigImg" @click='clearImg()'></div>
    <div class="sended" @click="changeSize" @scroll="showAddBtn"></div>
    <div class="send">
      <div class="sendOthers">
        <div class="emoji" @click="showEmoji=!showEmoji">
          <div class="emojiBox" v-if='showEmoji' @click='pickEmoji'>
            <!-- 添加上背景图片的网上地址，就可以实现表情的传输 -->
            <span class='emojiImg' v-for='X in 129' :key='X' :style="{backgroundPositionX:(-X+1)*24+'px'}" style='display:inline-block;width:24px;height:24px;background-size:cover' contenteditable="false"></span>
          </div>
        </div>
        <img src="./img.png" alt="#">
        <input type="file" class="upFile" name="file" @change="addFile()"> 
        <div class="redPocket" @mouseenter='visible' @mouseleave='invisible' @click='showModel = true '>
          <img src="./redPocket.png" alt="#">
          <p v-show='see' class="money">发红包</p>
          <!-- 红包弹框开始 -->
          <div v-if='showModel' class="copy_show">
          <div class="first_inpput">
          <div class="left" >金额</div>
          <div class="right">
          <input v-model='money' placeholder="0.00" />
          <div style="float:right;width:18px;height:38px;line-height:38px;">元</div>
          </div>
          </div>
          <textarea cols="34" rows="3" placeholder="恭喜发财，大吉大利"></textarea>
          <div class="money_show">￥{{money}}</div>
          <button v-bind:class="money>0 ? 'redqueren':'queren' " @click='sendMoney'>塞 钱</button>
          <div style="color:grey;margin-top:130px;width:300px;height:30px;text-align:center;font-size:12px;">未领取的红包，将于24小时后发起退款</div>
          </div>
          <!-- 红包弹框结束 -->
        </div>
      </div>
      <div class="sendBox" contenteditable="true" @keydown="sendByBoard"></div>
      <button class="sending" @click="sendMsg()">发送</button>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        showEmoji: false,
        isShow: 0,
        see:false,
        showModel:false,
        money:''
      }
    },
    computed: {
      deviceName () {
        return this.$store.state.deviceName
      },
      deviceId () {
        return this.$store.state.deviceWxId
      },
      target () {
        return this.$store.state.target
      },
      newMsg () {
        return this.$store.state.newMsg
      }
    },
    watch: {
      target:'chatMsg',
      deviceId: 'clearChat'
    },
    methods: {
      clearChat () {
        document.querySelector('.sended').innerHTML = ''
        this.target.name = ''
      },
      pickEmoji (e) {
        let emoji = e.target.cloneNode(true)
        document.querySelector('.sendBox').appendChild(emoji)
      },
      chatMsg () {
        document.querySelector('.sended').innerHTML = '' // 清空发送框
        document.querySelector('.addMore').innerText = '加载历史消息' // 显示可加载历史消息
        this.addHistory().then(()=>{document.querySelector('.sended').scrollTop = document.querySelector('.sended').scrollHeight}) // 获取历史消息后拉到底部
      },
      //鼠标悬停红包图片，有提示性文字，发红包
      visible:function(){
        this.see=true;
      },
      invisible:function(){
        this.see=false;
      },
      showAddBtn: function () {
        this.showEmoji = false
        if (document.querySelector('.sended').scrollTop === 0) {
          document.querySelector('.addMore').style.right = '100px'
        } else {
          document.querySelector('.addMore').style.right = '-100px'
        }
      },
      rightMsg(msg,time,type=0){
        let node = `<div style="display:flex;direction:rtl;margin-top:20px">
                      <img src='' alt="" width="40px" height="40px" style='border-radius:20px;margin-left:-20px'>
                      <span>
                        <div style="color:#888;font-size:14px;direction:rtl">${time}</div>
                        <div style="display:inline-block;direction:ltr;max-width:240px;word-wrap:break-word;padding:6px 12px;background:#9eea6a;border-radius:8px">${msg}</div>
                      </span>
                    </div>`
        if (type == 0) {
          document.querySelector('.sended').innerHTML = node + document.querySelector('.sended').innerHTML
        } else if (type == 1) {
          document.querySelector('.sended').innerHTML = document.querySelector('.sended').innerHTML + node
        }
      },
      leftMsg (msg,time) {
        let node = `<div style="display:flex;margin-top:20px;align-items:center">
                      <img src=${this.target.icon} alt="#" width="40px" height="40px" style='border-radius:20px;margin-right:20px'>
                      <span>
                        <div style="color:#888;font-size:14px">${time}</div>
                        <div style="display:inline-block;max-width:240px;word-wrap:break-word;padding:6px 12px;background:#9eea6a;border-radius:8px">${msg}</div>
                      </span>
                    </div>`
        document.querySelector('.sended').innerHTML = node +  document.querySelector('.sended').innerHTML
      },
      addHistory: function (x) {
        return new Promise((suc,rej)=>{
          this.$http.get('http://192.168.1.223:8090/wechat/v1/history?ryTargetId='+this.target.id).then((res)=>{
            console.log('历史消息 from mainBox',res)     
            for(let i=0;i<res.body.data.content.length;i++){
              let data = res.body.data.content[i]
              if (data.roleType == 2) {
                this.leftMsg(data.messageContent,data.rySendTimeStr)
                suc()
              } else {
                this.rightMsg(data.messageContent,data.rySendTimeStr)
                suc()
              }
            }
          })
        }) 
      },  
      addFile: function () {
            var excelFile = document.querySelector('.upFile').files[0];
            if (excelFile) {
                var FR = new FileReader();
                FR.addEventListener("load", function (e) {
                    //    img.attr('src',e.target.result);
                    var img64 = e.target.result;
                    var img64Html = '<img src=" ' + img64 + ' " style="width:140px" class="file">';
                    var msgStr = document.querySelector('.sendBox').innerHTML;
                    // 加入当前选中的图片
                    var msgCont = msgStr + img64Html + "&nbsp;";
                    // 插入到文本框中
                    document.querySelector('.sendBox').innerHTML += msgCont;
                });
                FR.readAsDataURL(excelFile);
            }
      },
      clearImg () {
        document.querySelector('.bigImg').innerHTML  = ''
      },
      changeSize: function (e) {
        if (e.target.classList.value === "file"){
          let a = e.target.cloneNode(true)
          a.style.width = '700px'
          document.querySelector('.bigImg').appendChild(a)
        }
      },
      formatDateTime: function (inputTime) {
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
        return (m + '-' + d + ' ' + h + ':' + minute)
      },
      sendMsg: function () {
        console.log(this.target)
        if (document.querySelector('.sendBox').innerHTML === '') { 
          return alert("内容不能为空")
        } else if ( !this.target.id ) {
          return alert('请选择聊天对象')
        }
        let time = this.formatDateTime((new Date()))
        let sendedMsg = document.querySelector('.sendBox').innerHTML
        let data = JSON.stringify({
          fromDeviceWxId: this.deviceId,
          messageContent: sendedMsg,
          ryTargetId: this.target.id
        })
        console.log('发送消息成功',data)
        this.$http.post('http://192.168.1.223:8090/api/v1/webMessage/',data).then(()=>{
          console.log('发送消息成功',data)
        })
        this.rightMsg(sendedMsg,time,1)
        document.querySelector('.sended').scrollTop = document.querySelector('.sended').scrollHeight
        setTimeout(() => {
          document.querySelector('.sendBox').innerHTML = ''
        }); 
      },
      sendByBoard: function (e) {
        if(13 == e.keyCode && (e.shiftKey || e.ctrlKey)) {
        } else if (e.keyCode === 13) {
          this.sendMsg()
          setTimeout(()=>{
            document.querySelector('.sendBox').innerHTML = ''
          })
        }
      }
    },
    mounted () {
      // 消息监听器
      let _this = this
      RongIMClient.setOnReceiveMessageListener({
        // 接收到的消息
        onReceived: function (message) {
          console.log(message);
          // 判断消息类型
          switch (message.messageType) {
            case RongIMClient.MessageType.TextMessage:
              let content = message.content.content; //消息内容
              let newMsg = JSON.parse(message.content.extra)
              let time = newMsg.rySendTime
              if(_this.newMsg.ryTargetId == _this.target.id){
                if(_this.newMsg.roleType == 2){
                  _this.rightMsg(content,time) 
                  document.querySelector('.sended').scrollTop = document.querySelector('.sended').scrollHeight
                } else {
                  _this.leftMsg(content,time) 
                  document.querySelector('.sended').scrollTop = document.querySelector('.sended').scrollHeight
                }
              } else {
                _this.$store.commit('getNewMsg',newMsg)
              }   
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
    }
  }
</script>

<style lang="stylus">
  
  .emojiImg
    background-image url(./emojis-hd.png)

  .mainBox
    position relative
    width calc(100% - 540px)
    height 100%
    background white
    .chatInfo
      position relative
      width 100%
      height 40px
      display flex
      border-bottom 1px #ddd solid
      font-size 14px
      color #888
      overflow hidden
      div
        position relative
        height 20px
        margin 0 10px
        padding 10px 0
        text-align center
      .addMore
        position absolute
        right 100px
        width 90px
        transition 1s
    .sended
      height calc(100% - 250px)
      padding 0 16px 10px 16px
      overflow auto
      p
        margin 0
        display inline-block
    .bigImg
      position absolute
      z-index 10000
      right 30px
      top -40px
      height 100%
      overflow auto
    .send
      position relative
      height 200px
      .sendOthers
        position relative
        height 36px
        display flex
        border-top 1px #ddd solid
        .emoji
          position relative
          width 30px
          height 30px
          transform scale(0.9)
          margin 2px 6px
          background: url('./emoji.png')
          .emojiBox
            position absolute 
            top -160px
            left 10px 
            width 260px
            height 150px
            background white
            border 1px solid #ddd
            overflow auto
        img
          position relative
          width 26px
          padding 5px 10px
        .upFile
          position absolute
          left 50px 
          width 40px
          height 40px 
          opacity 0
          font-size 0
      .sendBox
        position relative
        width calc(100% - 40px)
        height 114px
        margin 6px 0
        padding 0 20px
        border none
        overflow auto
        line-height 2.2em
        &:focus
          outline none
        p
          display inline-block
          margin 0
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

    /* 红包弹框 */
    .copy_show{
    width: 300px;
    height: 400px;
    background: rgb(220, 220, 220);
    border-radius: 4px;
    margin-top: 100px;
    margin-left: 40px;
    z-index: 9999;
    position: fixed;
    top: 180px;
    }
    /* 红包文字提示样式 */
    .money{
    font-size: 12px;
    color: grey;
    position: relative;
    left:20px;
    top: -20px;
    }
    /* 红包 */
    .first_inpput{
    width: 260px;
    height: 40px;
    background: white;
    border-radius: 4px;
    margin-left: 20px;
    color: black;
    margin-top: 30px;
    font-size: 13px;
    }
    .left{
    width: 40px;
    height: 40px;
    padding-left: 10px;
    float: left;
    line-height: 40px;
    }
    .right{
    width:120px;
    height: 40px;
    float: right;
    line-height: 40px;
    padding-right: 10px;
    }
    .right input{
    float:left;
    width:100px;
    height:38px;
    border:none;
    outline:none;
    background:white;
    line-height:38px;
    text-align:right;
    font-size:14px;
    }
    .copy_show textarea{
    border: none;
    border-radius: 4px;
    margin-left: 20px;
    margin-top: 30px;
    }
    .money_show{
    width:300px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    margin-top: 20px;
    font-size: 18px;
    }
    .redqueren{
    width: 200px;
    height: 30px;
    border-radius: 4px;
    color: white;
    margin-left: 50px;
    border: none;
    background: rgb(178, 34, 34);
    }
    .queren{
    width: 200px;
    height: 30px;
    border-radius: 4px;
    color: white;
    margin-left: 50px;
    border: none;
    background: rgb(231, 161, 161);
    }
</style>
