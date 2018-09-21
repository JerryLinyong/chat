<template>
  <div class="tools">
    <div class="tHeader">
      <div :class="{activeBG:(quickItems==1)?true:false}" @click='quickItems="1"'>快速回复</div>
      <div class='userDetail' :class="{activeBG:(quickItems==2)?true:false}" @click='getUserInfo()'>用户详情</div>
    </div>
    <div class='resBody' v-show='quickItems==1'>
      <div class="quickRes">
        <span :class="{activeBG2:(resItems==1)?true:false}"  @click='resItems="1"'>个人快捷语</span>
        <span :class="{activeBG2:(resItems==2)?true:false}"  @click='getCQR'>公共快捷语</span>
      </div>
      <div class='personRes' v-show='resItems==1'>
        <!-- <div class="resEdit" contenteditable="true"></div> -->
        <div id="editor" style="text-align:left;margin:10px 0"></div>
        <div class="addRes" @click="addQR()">添加快捷语</div> 
        <ul class="quickResItems" v-on:click="sendQuickMsg" @mousedown="deletQR">
          <li v-for='selfQ in selfQR' :key='selfQ.createTime' :id='selfQ.shortcutPhraseId' v-html='selfQ.content'></li>
        </ul>
      </div>
      <div class='commonRes' v-if='resItems==2'>
        <ul class="quickResItems" @click="sendQuickMsg" style='margin-top:20px'>
          <li v-for='commonQ in commonQR' :key='commonQ.createTime' v-html='commonQ.content'></li> 
        </ul>
      </div>
    </div>
    <div class="userInfo" v-if  ='quickItems==2'>
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
        this.$http.get('http://192.168.1.223:8090/api/v1/shortcutPhrase/parentList?parentUserId='+this.$store.state.token.parentUserId).then(res=>{
          console.log('公共快捷语 from rightbar',res)
          this.commonQR = res.body.data.list
        })
      },
      getUserInfo () {
        this.quickItems="2"
        this.$http.get('http://192.168.1.223:8090/api/v1/user/child/getAgentInfo?wxId='+this.$store.state.targetWxId).then(res=>{
          console.log('当前用户信息 from rightbar',res)
        })
      },
      deletQR: function (e) {
        if (e.button === 2) {
          if(window.confirm('确定删除？')){
            this.$http.post(`http://192.168.1.223:8090/api/v1/shortcutPhrase/delete?ryUserId=${this.userId}&shortcutPhraseId=${e.target.parentNode.getAttribute('id')}`).then((res)=>{
              console.log('删除快捷语成功 from rightbar',res)
              document.querySelector('.quickResItems').removeChild(e.target.parentNode)
            })
          }
        }
      },
      addQR: function () {
        var text = document.querySelector('.w-e-text').innerHTML
        if (!text.match(/^<p>/)) {
          text = `<p>${text}</p>`
        } 
        if (text === "") {
          alert('请输入内容')
        } else {
          document.querySelector('.w-e-text').innerHTML = ""
          this.$http.get(`http://192.168.1.223:8090/api/v1/shortcutPhrase/insertShortcut?content=${text}&kfRyUserId=${this.userId}`).then((res)=>{
            console.log('添加快捷语成功 from rightbar',res)
            this.$http.get('http://192.168.1.223:8090/api/v1/shortcutPhrase/list?kfRyUserId='+this.userId).then(res=>{
              console.log('快捷语 from rightbar',res)
              this.selfQR = res.body.data.list
            })
          })
        }
      },
      sendQuickMsg: function (e) {
        console.log(e.target)
        if (e.target.nodeName === 'P') {
          var text = e.target.innerHTML
          document.querySelector('.sendBox').innerHTML += `<p>${text}</p>`
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
          _this.$http.get('http://192.168.1.223:8090/api/v1/shortcutPhrase/list?kfRyUserId='+userId).then(res=>{
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
    },
    mounted () {
      var E = require('wangeditor')  // 使用 npm 安装
      // 创建编辑器
      var editor = new E('#editor')
      editor.customConfig.menus = [
        'emoticon',  // 表情
        'image',  // 插入图片
      ]
      var c = [{
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/7a/shenshou_thumb.gif",
        value : "[草泥马]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/60/horse2_thumb.gif",
        value : "[神马]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/bc/fuyun_thumb.gif",
        value : "[浮云]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c9/geili_thumb.gif",
        value : "[给力]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f2/wg_thumb.gif",
        value : "[围观]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/70/vw_thumb.gif",
        value : "[威武]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6e/panda_thumb.gif",
        value : "[熊猫]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/81/rabbit_thumb.gif",
        value : "[兔子]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/bc/otm_thumb.gif",
        value : "[奥特曼]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/15/j_thumb.gif",
        value : "[囧]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/89/hufen_thumb.gif",
        value : "[互粉]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c4/liwu_thumb.gif",
        value : "[礼物]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/ac/smilea_thumb.gif",
        value : "[呵呵]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/0b/tootha_thumb.gif",
        value : "[嘻嘻]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6a/laugh.gif",
        value : "[哈哈]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/14/tza_thumb.gif",
        value : "[可爱]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/af/kl_thumb.gif",
        value : "[可怜]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/a0/kbsa_thumb.gif",
        value : "[挖鼻屎]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f4/cj_thumb.gif",
        value : "[吃惊]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6e/shamea_thumb.gif",
        value : "[害羞]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c3/zy_thumb.gif",
        value : "[挤眼]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/29/bz_thumb.gif",
        value : "[闭嘴]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/71/bs2_thumb.gif",
        value : "[鄙视]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6d/lovea_thumb.gif",
        value : "[爱你]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/9d/sada_thumb.gif",
        value : "[泪]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/19/heia_thumb.gif",
        value : "[偷笑]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/8f/qq_thumb.gif",
        value : "[亲亲]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/b6/sb_thumb.gif",
        value : "[生病]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/58/mb_thumb.gif",
        value : "[太开心]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/17/ldln_thumb.gif",
        value : "[懒得理你]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/98/yhh_thumb.gif",
        value : "[右哼哼]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6d/zhh_thumb.gif",
        value : "[左哼哼]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/a6/x_thumb.gif",
        value : "[嘘]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/af/cry.gif",
        value : "[衰]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/73/wq_thumb.gif",
        value : "[委屈]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/9e/t_thumb.gif",
        value : "[吐]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f3/k_thumb.gif",
        value : "[打哈欠]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/27/bba_thumb.gif",
        value : "[抱抱]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/7c/angrya_thumb.gif",
        value : "[怒]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/5c/yw_thumb.gif",
        value : "[疑问]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/a5/cza_thumb.gif",
        value : "[馋嘴]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/70/88_thumb.gif",
        value : "[拜拜]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/e9/sk_thumb.gif",
        value : "[思考]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/24/sweata_thumb.gif",
        value : "[汗]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/7f/sleepya_thumb.gif",
        value : "[困]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6b/sleepa_thumb.gif",
        value : "[睡觉]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/90/money_thumb.gif",
        value : "[钱]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/0c/sw_thumb.gif",
        value : "[失望]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/40/cool_thumb.gif",
        value : "[酷]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/8c/hsa_thumb.gif",
        value : "[花心]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/49/hatea_thumb.gif",
        value : "[哼]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/36/gza_thumb.gif",
        value : "[鼓掌]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d9/dizzya_thumb.gif",
        value : "[晕]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/1a/bs_thumb.gif",
        value : "[悲伤]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/62/crazya_thumb.gif",
        value : "[抓狂]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/91/h_thumb.gif",
        value : "[黑线]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6d/yx_thumb.gif",
        value : "[阴险]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/89/nm_thumb.gif",
        value : "[怒骂]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/40/hearta_thumb.gif",
        value : "[心]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/ea/unheart.gif",
        value : "[伤心]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/58/pig.gif",
        value : "[猪头]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d6/ok_thumb.gif",
        value : "[ok]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d9/ye_thumb.gif",
        value : "[耶]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d8/good_thumb.gif",
        value : "[good]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c7/no_thumb.gif",
        value : "[不要]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d0/z2_thumb.gif",
        value : "[赞]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/40/come_thumb.gif",
        value : "[来]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d8/sad_thumb.gif",
        value : "[弱]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/91/lazu_thumb.gif",
        value : "[蜡烛]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6a/cake.gif",
        value : "[蛋糕]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d3/clock_thumb.gif",
        value : "[钟]"
    }, {
        icon : "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/1b/m_thumb.gif",
        value : "[话筒]"
    }
];
      let cc = c.map(i=>{
        let img = {}
        img.src = i.icon
        img.alt = i.value
        return img
      })
      editor.customConfig.emotions = [
        {
          // tab 的标题
          title: '默认',
          // type -> 'emoji' / 'image'
          type: 'image',
          // content -> 数组
          content: cc
      }
    ]

      editor.customConfig.uploadImgShowBase64 = true
      editor.create()
      document.querySelector('.w-e-text-container').style.height = '100px'
    }
  }
</script>

<style lang="stylus">
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
          overflow hidden
          margin 10px
          border-radius 10px 
          background rgba(77,149,250,0.4)
          p
            padding 10px
            margin 0
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
