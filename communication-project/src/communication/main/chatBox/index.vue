<template>
  <div class='chatSession'>
    <div class="bigImg" @click="clearImg"></div>
    <div class="chatBox">
      <div class="sideBar">
        <input type="text" placeholder="搜索">
        <img src="./search.png" alt="#">
        <div class="sortPeople" @click='clearContent()'>
          <div class="allP" @click='sortUsers=1' :class="{activeBG:(sortUsers==1)?true:false}">全部</div>
          <div class="starP" @click='sortUsers=2' :class="{activeBG:(sortUsers==2)?true:false}">星标</div>
          <div class="blackP" @click='sortUsers=3' :class="{activeBG:(sortUsers==3)?true:false}">黑名单</div>
        </div>
        <ul id="userList" @click='startChat' v-if='sortUsers==1'>
          <li class="users" v-for='wxUser in wxUsers' :key='wxUser.wxId' :targetWxName='wxUser.wxName' :targetWxId='wxUser.wxId' :targetWxIcon='wxUser.wxIcon' :class='{activeBG:(targetWxId==wxUser.wxId)?true:false}'>
            <img :src="wxUser.wxIcon" alt="#" :targetWxId='wxUser.wxId' :targetWxIcon='wxUser.wxIcon' :targetWxName='wxUser.wxName'>
            <span :targetWxId='wxUser.wxId' :targetWxIcon='wxUser.wxIcon' :targetWxName='wxUser.wxName'>{{wxUser.wxName}}</span>
            <span class="redDot" v-if='hasMsg'></span>
          </li>
        </ul>
      </div>
      <div class="mainBox">
        <div class="chatInfo">
          <div class="chat">当前会话： &nbsp;{{deviceName}}--{{targetWxName}}</div>
          <div>备注:</div>
          <div class="addMore" @click="addHistory(targetWxId)">加载历史消息</div>
        </div>
        <div class="sended" @click="changeSize" @scroll="showAddBtn">
        </div>
        <div class="send">
          <div class="sendOthers">
            <div class="emoji" @click="showMoreEmoji()">
              <div class="chatbox-tools emjon"><!-- face-box表情盒子 -->
                <div class="chatbox-tools-emoji">                        
                  <div class="chatbox-emoji-panel" id="chatbox-emoji-panel"></div>
                </div>
              </div>
              <img src="./emoji.png" alt="#"></div>
            <input type="file" id="upFile" name="file" @change="addFile()" style="width:40px;height:40px;opacity:0;position:absolute;left:50px;font-size:0;"><img src="./img.png" alt="#">
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
      <div class="tools">
        <div class="tHeader">
          <div :class="{activeBG:(quickItems==1)?true:false}" @click='quickItems="1"'>快速回复</div>
          <div class='userDetail' :class="{activeBG:(quickItems==2)?true:false}" @click='quickItems="2"'>用户详情</div>
        </div>
        <div class='resBody' v-if='quickItems==1'>
          <div class="quickRes">
            <span :class="{activeBG2:(resItems==1)?true:false}"  @click='resItems="1"'>个人快捷语</span><span :class="{activeBG2:(resItems==2)?true:false}"  @click='resItems="2"'>公共快捷语</span>
          </div>
          <div class='personRes' v-if='resItems==1'>
            <div class="resEdit" contenteditable="true"></div>
            <div class="addRes" @click="addQR()">添加快捷语</div>
            <ul class="quickResItems" @click="sendQuickMsg" @mousedown="deletQR">
              <li>我现在在忙，等会回复你！</li> 
              <li>1111111</li> 
              <li>222222</li> 
              <li>3333</li> 
            </ul>
          </div>
          <div class='commonRes' v-if='resItems==2'>
            <ul class="quickResItems" @click="sendQuickMsg" @mousedown="deletQR">
              <li v-for='Phrase in parentShortcutPhrase' :key='Phrase'>{{Phrase.content}}</li> 
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    components: {
    },
    props:['ryToken','wxUsers','wxIcon','wxId','deviceName','parentShortcutPhrase','devices'],
    data () {
      return {
        quickItems: '1',
        resItems: '1',
        isShow: 0,
        targetWxId: '',
        see:false,
        showModel:false,
        money:'',
        targetWxIcon: '',
        targetWxName: '',
        sortUsers: '1',
        hasMsg: 1
      }
    },
    methods: {
      //鼠标悬停红包图片，有提示性文字，发红包
      visible:function(){
        this.see=true;
      },
      invisible:function(){
        this.see=false;
      },
      startChat: function (e) {
        this.hasMsg = 0
        this.targetWxName = e.target.getAttribute('targetWxName')
        document.querySelector('.sended').innerHTML = ''
        this.targetWxId = e.target.getAttribute('targetWxId')
        this.targetWxIcon = e.target.getAttribute('targetWxIcon')
        this.$options.methods.addHistory.bind(this)(this.targetWxId,0,7)
        setTimeout(function () {
          document.querySelector('.sended').scrollTop = document.querySelector('.sended').scrollHeight
        },100)  
      },
      deletQR: function (e) {
        if (e.button === 2) {
          if(window.confirm('确定删除？')){
            document.querySelector('.quickResItems').removeChild(e.target)
          }
        }
      },
      addQR: function () {
        var text = document.querySelector('.resEdit').innerText
        if (text == "") {
          alert('请输入内容')
        } else {
          document.querySelector('.resEdit').innerText = ""
          document.querySelector('.quickResItems').innerHTML += `<li style="margin:10px;padding:10px;border-radius:10px;background:rgba(77,149,250,0.4)">${text}</li>`
        }
      },
      showAddBtn: function () {
        if (document.querySelector('.sended').scrollTop === 0) {
          document.querySelector('.addMore').style.right = '100px'
        } else {
          document.querySelector('.addMore').style.right = '-100px'
        }
      },
      addHistory: function (targetWxId,fromPlace=null,number=7) {
        //单聊,其他会话选择相应的消息类型即可。
        var _this = this
        var conversationtype = RongIMLib.ConversationType.PRIVATE;
        var count = number; // 2 <= count <= 20
        var timestrap = fromPlace; //0, 1483950413013
        RongIMClient.getInstance().getHistoryMessages(conversationtype, targetWxId, timestrap, count, {
          onSuccess: function (list, hasMsg) {
            list.sort(function (a, b) {
                return a.sentTime < b.sentTime;
            });
            console.log(list)
            if (list.length > 0) {
              for (var i = 0; i < list.length; i++) {
                let content = list[i].content.content;
                let sendTime = list[i].sentTime;
                let senderUserId = list[i].senderUserId
                let time = _this.$options.methods.formatDateTime.bind(this)(sendTime)
                if (senderUserId != _this.wxId) {
                  var node = `<div style="display:flex;margin-top:20px;align-items:center"><img src=${_this.targetWxIcon} alt="#" width="40px" height="40px" style='border-radius:20px;margin-right:20px'><span><p style="margin:0;color:#888;font-size:14px">${time}</p><span style="direction:ltr;display:inline-block;max-width:200px;word-wrap:break-word;padding:6px 12px;background:#9eea6a;border-radius:8px">${content}</span></span></div>`
                } else {
                  var node = `<div style="display:flex;direction:rtl;margin-top:20px;align-items:center"><img src=${_this.wxIcon} alt="#" width="40px" height="40px" style='border-radius:20px;margin-left:20px'><span><p style="margin:0;color:#888;font-size:14px">${time}</p><span style="direction:ltr;display:inline-block;max-width:200px;word-wrap:break-word;padding:6px 12px;background:#9eea6a;border-radius:8px">${content}</span></span></div>`
                }
                document.querySelector('.sended').innerHTML = node + document.querySelector('.sended').innerHTML 
              }
            } else {
                alert('没有更多消息')
            }
          },
          onError: function (error) {
            alert("获取历史消息失败");
          }
        })
      },
      clearImg: function (e) {
         if (e.target.classList.value === "file"){
          document.querySelector('.bigImg').removeChild(e.target)
        }
      },
      addFile: function () {
            var excelFile = document.querySelector('#upFile').files[0];
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
      changeSize: function (e) {
        if (e.target.classList.value === "file"){
          var a = e.target.cloneNode(true)
          a.style.width = "760px"
          document.querySelector('.bigImg').appendChild(a)
        }
      },
      sendQuickMsg: function (e) {
        if (e.target.nodeName == 'LI') {
          var text = e.target.innerText
          document.querySelector('.sendBox').innerText += text
        }
      },
      showMoreEmoji: function () {
        var panel = document.querySelector(".chatbox-tools");
        //定义融云API
        var RongIMEmoji = RongIMLib.RongIMEmoji;
        var config = {/*face参数列表*/
          size: 24,
          // url: '//cdn.ronghub.com/emojis-hd.png?replace', // 传入服务器路径        
          url: 'https://rongcloud.github.io/websdk-demo/res/emojis-hd.png?replace', // 传入在线路径
          // url: './emojis-hd.png?replace', // 传入本地路径
          lang: 'zh',
          extension: {
            dataSource: {
              u1F914: {
                zh: '思考',
                en: 'thinking face',
                tag: '🤔',
                position: '0px 0px'
              }
            },
          url: 'https://cdn.ronghub.com/thinking-face.png'
          }
        };

        RongIMEmoji.init(config);
        // appendChild('init: 初始化RongIMEmoji');
        function appendChild(text) {
          var div = document.createElement('span');
          div.innerHTML = '<span contenteditable="true">'+text+'</span>';
          var child = div.childNodes[0];
          msgnew.appendChild(child);
            console.log("添加show条目");
        }

        function getEmojiDetailList() {/*加载表情列表*/
          var shadowDomList = [];
          for (var i = 0; i < RongIMEmoji.list.length; i++) {
            var value = RongIMEmoji.list[i];
            shadowDomList.push(value.node);
          }
          return shadowDomList;
        }

        function bindClickEmoji(emojis) {
          for(var i=0;i<emojis.length;i++){                  
            var emojiHtml = emojis[i];
            panel.appendChild(emojiHtml);
            emojiHtml.onclick = clickEmoji;
          }
        }
        function clickEmoji(event) {/*获取当前表情*/
          var e = event || window.event;
          var imgface = e.target || e.srcElement;
          if (document.all && !document.addEventListener === false) {
          }
          var ij=imgface.getAttribute("name");
          //通过融云远端函数，处理数据生成消息框内容
          var imgval = RongIMEmoji.symbolToHTML(ij);
          // appendChild('显示消息 ' + imgval);
          console.log("face show");
          var msgStr = document.querySelector('.sendBox').innerHTML;
          // 加入当前选中的表情
          msgStr = msgStr + imgval;
          // 插入到文本框中
          document.querySelector('.sendBox').innerHTML = msgStr + '&nbsp;';
          emojiBox.style.display = 'none'           
        }
        var emojiBox =  document.querySelector('.chatbox-tools')
        if (this.isShow === 0 ) {
          emojiBox.style.display = 'block';
          this.isShow = 1
          //加载表情face-list
          var emoji = getEmojiDetailList();/*加载face列表*/
          bindClickEmoji(emoji);/*face列表分配*/
          return false;
        } else {
          emojiBox.style.display = 'none';
          this.isShow = 0
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
        return (y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second)
      },
      sendMsg: function () {
        if (document.querySelector('.sendBox').innerText == '') { return alert("内容不能为空")}
        var myDate = new Date()
        var time = this.$options.methods.formatDateTime(myDate)
        var sendedMsg = document.querySelector('.sendBox').innerHTML
        var msg = new RongIMLib.TextMessage({content:sendedMsg});
        var conversationtype = RongIMLib.ConversationType.PRIVATE; // 单聊,其他会话选择相应的消息类型即可。
        var targetWxId = this.targetWxId ; // 目标 Idvar time = formatDateTime(message.receivedTime)
        // 发送消息
        var _this = this
        RongIMClient.getInstance().sendMessage(conversationtype, targetWxId, msg, {
          onSuccess: function (message) {
            //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
            document.querySelector('.sendBox').innerText = ''
            // 同步到聊天框
            var node = `<div style="display:flex;direction:rtl;margin-top:20px"><img src='' alt="" width="40px" height="40px" style='border-radius:20px;margin-left:-20px'><span><p style="margin:0;color:#888;font-size:14px;direction:ltr">${time}</p><span style="direction:ltr;display:inline-block;max-width:200px;word-wrap:break-word;padding:6px 12px;background:#9eea6a;border-radius:8px">${sendedMsg}</span></span></div>`
            document.querySelector('.sended').innerHTML += node
            document.querySelector('.sended').scrollTop = document.querySelector('.sended').scrollHeight
          },
          onError: function (errorCode,message) {
            var info = '';
            switch (errorCode) {
              case RongIMLib.ErrorCode.TIMEOUT:
                info = '超时';
                break;
              case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                info = '未知错误';
                break;
              case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                info = '在黑名单中，无法向对方发送消息';
                break;
              case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                info = '不在讨论组中';
                break;
              case RongIMLib.ErrorCode.NOT_IN_GROUP:
                info = '不在群组中';
                break;
              case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                info = '不在聊天室中';
                break;
              default :
                info = x;
                break;
            }
            console.log('发送失败:' + info);
          }
        });
      },
      sendByBoard: function (e) {
        if (e.keyCode === 13) {
          this.$options.methods.sendMsg.bind(this)()
        }
      }
    },
    mounted () {
      // 融云初始化
      RongIMClient.init("ik1qhw09iptvp")
      var token = this.ryToken
      // 连接服务器
      RongIMClient.connect(token, {
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
      var getTime = this.$options.methods.formatDateTime.bind(this)
      var _this = this
      RongIMClient.setOnReceiveMessageListener({
        // 接收到的消息
        onReceived: function (message) {
          console.log(message);
          console.log('7777777')
          // 判断消息类型
          switch (message.messageType) {
            case RongIMClient.MessageType.TextMessage:
              var content = message.content.content; //消息内容
              // var targetId_pic = message.content.user.portrait; //发送者头像
              var senderUserId = message.senderUserId //发送者id
              // var nike_name = message.content.user.name; //发送者昵称
              var time = getTime(message.receivedTime)
              if(senderUserId == _this.targetWxId){}
              var node = `<div style="display:flex;margin-top:20px"><img src=${_this.targetWxIcon} alt="#" width="40px" height="40px"><span><p style="margin:0;color:#888;font-size:14px">${time}</p><span style="direction:ltr;display:inline-block;max-width:200px;word-wrap:break-word;padding:6px 12px;background:#9eea6a;border-radius:8px">${content}</span></span></div>`
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
            })
            console.log(list)
          },
          onError: function (error) {
            console.log('获取失败')
          }
        }, conversationTypes, limit);
      }
    }
  }
</script>

<style scoped lang="stylus">
  .redDot 
    position absolute
    top 10px
    left 64px
    width 10px
    height 10px
    border-radius 10px
    background red
  .active
    border-bottom 2px #4d95fa solid
  .activeBG 
    background rgba(77,149,250,0.4)
  .activeBG2
    background #ddd

  .chatSession
    width 100%
    height 100%
    user-select none
    .bigImg
      position absolute
      left 180px
      top 0px
      z-index 10000
      width 700px
    .chatBox 
      position absolute
      left 200px
      top 50px
      height 80vh
      min-height 500px
      width 1120px
      background white
      border-radius 10px
      overflow hidden
      .tools 
        position absolute
        background white
        right 0
        width 300px
        height 100%
        border-left 1px solid #ddd
        .tHeader
          height 40px
          display flex
          justify-content space-around
          align-items center
          div
            padding 10px
            flex 1
            text-align center
            &:hover
              background rgba(77,149,250,0.4)
              border-bottom 2px #4d95fa solid
        .resBody
          .resEdit
            margin 10px auto
            width 240px
            padding 10px
            height 80px
            border 1px solid black
          .addRes
            margin-left 200px 
            display inline-block
            padding 6px
            border-radius 10px 
            background rgba(77,149,250,0.8)
            color white
            font-size 14px
            font-weight bold
          .quickRes
            display flex
            justify-content space-around
            border-bottom 1px solid #ddd
            span
              margin-top 14px
              padding 10px 0
              font-size 12px
              width 40%
              text-align center
              &:hover
                background #ddd
          .quickResItems
            position relative
            padding 0
            margin 0
            width 300px
            height 500px
            overflow auto
            list-style none
            li 
              margin 10px
              padding 10px
              border-radius 10px 
              background rgba(77,149,250,0.4)
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
          font-size 14px
          div
            flex 1
            width 50px
            text-align center
            border-bottom: 2px solid white
            border-radius 6px
            &:hover 
              border-bottom: 2px solid #4d95fa
        #userList
          padding 0
          list-style none
          overflow auto
          .users
            position relative
            display flex
            height 50px
            margin 10px 10px
            border-radius 10px
            align-items center
            overflow hidden
            img 
              height 30px
              width 30px
              border-radius 15px
              margin 0 30px
      .mainBox
        position absolute
        top 0
        left 200px
        width calc(100% - 500px)
        height 100%
        .chatInfo
          position relative
          width 100%
          height 40px
          display flex
          border-bottom 1px #ddd solid
          overflow hidden
          font-size 14px
          color #888
          div
            height 20px
            padding 10px 0
            margin 0 10px
            text-align center
          .addMore
            position absolute
            right 100px
            width 90px
            transition 1s
        .sended
          position relative
          height calc(100% - 250px)
          overflow auto
          padding 0 16px 10px 16px
        .send
          height 170px
          .sendOthers
            position relative
            height 36px
            display flex
            border-top 1px #ddd solid
            .emoji
              .chatbox-tools
                display none
                position absolute 
                background white
                top -160px
                width 260px
                height 150px
                left 10px 
                border 1px solid #ddd
                overflow auto
            img
              width 26px
              padding 5px 10px
          .sendBox
            width calc(100% - 40px)
            height 114px
            padding 0 20px
            margin 6px 0
            border none
            overflow auto
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
    float: left;
    line-height: 40px;
    padding-left: 10px;
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
