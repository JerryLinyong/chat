<template>
  <div class="tools">
    <div class="tHeader">
      <div :class="{activeBG:(quickItems==1)?true:false}" @click='quickItems="1"'>快速回复</div>
      <div class='userDetail' :class="{activeBG:(quickItems==2)?true:false}" @click='quickItems="2"'>用户详情</div>
    </div>
    <div class='resBody' v-if='quickItems==1'>
      <div class="quickRes">
        <span :class="{activeBG2:(resItems==1)?true:false}"  @click='resItems="1"'>个人快捷语</span>
        <span :class="{activeBG2:(resItems==2)?true:false}"  @click='resItems="2"'>公共快捷语</span>
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
</template>

<script>
  export default {
    data () {
      return {
        quickItems: '1',
        resItems: '1'
      }
    },
    methods: {
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
      sendQuickMsg: function (e) {
        if (e.target.nodeName == 'LI') {
          var text = e.target.innerText
          document.querySelector('.sendBox').innerText += text
        }
      }
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
    background white
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
</style>
