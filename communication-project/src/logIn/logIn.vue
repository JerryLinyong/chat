<template>
  <div>
    <div class="login-bg">
      <form class="g-main layui-form">
        <h2 ><img src="./icon_eco.png" alt="" >登录</h2>
        <p class="tishi_red" v-show='errorinfo'>请输入用户名或密码</p>
        <div class="login-item">
          <span>账号</span>
          <input type="text" placeholder="请输入eco账号" name="username" id="username" v-model='username'>
        </div>
        <div class="login-item">
          <span>密码</span>
          <input type="password" name="password" id="password" laceholder="请输入密码" v-model='password'>
        </div>
        <div class="login-btn login-item" @click="logIn()">
          登录
        </div>
        <div class="register login-item">
          还没有账号?
          <a href="/register">立即注册</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
    import {Toast,Loading} from "vue-ydui/dist/lib.rem/dialog/index";
  export default {
    components: {
    },
    data () {
      return {
          username:'',
          password:'',
          errorinfo:false,
      }
    },
    methods: {
        setCookie (cname,cvalue,exdays){
            var d = new Date();
            d.setTime(d.getTime()+(exdays*24*60*60*1000));
            var expires = "expires="+d.toGMTString();
            document.cookie = cname + "=" + cvalue + "; " + expires;
        },
        logIn: function () {
            //如果没有输入用户名和密码，提示
             if(this.username =='' || this.password == ''){
               this.errorinfo=true;
             }else{
                 /*
                 输入用户名和密码，1,不存在该用户  2，密码错误
                 */
                 let data={'username':this.username,'password':this.password};
                 this.$http.post('http://192.168.1.223:8090/api/v1/user/device/loginAdmin',data).then(function(res){
                 console.log(res)
                if(res.body.status == 0){
                    this.errorinfo=false;     
                    function getCookie (cname) {
                        var name = cname + "=";
                        var ca = document.cookie.split(';');
                        for (var i=0; i<ca.length; i++) {
                        var c = ca[i].trim();
                        if (c.indexOf(name)==0) return c.substring(name.length,c.length);
                        }
                        return "";
                    }   
                    this.$options.methods.setCookie.bind(this)('kfRyUserId',res.body.data.kfRyUserId,7)
                    this.$options.methods.setCookie.bind(this)('ryToken',res.body.data.ryToken,7)
                    this.$options.methods.setCookie.bind(this)('parentUserId',res.body.data.parentUserId,7)
                    if (res.body.data.masterFlag === 1) {                      
                        Toast({
                            mes: '登陆成功',
                            timeout: 500,
                            icon: 'success',
                            callback: () => {
                                this.$router.push('/communication')
                            }
                        })
                    }else if (res.body.data.masterFlag === 0) {}      
                }else{
                    Toast({
                        mes: '不存在该用户或密码错误',
                        timeout: 1000,
                        icon: 'error',
                        callback: () => {
                            this.$router.push('/')
                        }
                    });
                    this.errorinfo=false;
                    this.username='';
                    this.password='';
                }
               })
             }
            
         }
    }
  }
</script>

<style scoped>
 .tishi_red{
    color: red;
    width: 400px;
    margin: auto;
    text-align: center;
    font-size: 12px;
}
.login-bg {
    padding-top: 80px;
}
.g-main h2 img {
    margin: 24px 20px -15px 0;
}
.g-main {
    width: 46%;
    margin: 0 auto;
    background: #fff;
    box-shadow: 2px 3px 15px #cfcfcf9c;
    border-radius: 5px;
    min-width: 580px;
    padding: 40px 0;
}
.g-main h2 {
    font-size: 30px;
    line-height: 100px;
    color: #77b0ff;
    text-align: center;
    letter-spacing: 10px;
}
.g-main .login-item {
    position: relative;
    width: 400px;
    height: 48px;
    margin: 30px auto 20px auto;
}
.g-main .login-item span,
.g-main .login-item .lab {
    font-size: 14px;
    line-height: 27px;
    color: #333;
    padding: 0 20px;
    position: absolute;
    top: 0;
    left: 1px;
    z-index: 2;
}
.g-main .login-item input {
    width: 398px;
    padding: 5px 5px 5px 66px;
    border-bottom: 1px solid #ddd;
    position: absolute;
    top: 0;
    left: 1px;
    z-index: 1;
    font-size: 14px;
}
.g-main .login-item .pws {
    padding: 5px 5px 5px 86px;
}
.g-main .login-item .yzm {
    width: 246px;
}
.g-main .login-btn,
.g-main .send-btn {
    font-size: 18px;
    color: #fff;
    letter-spacing: 6px;
    text-align: center;
    background: #4da5f3;
    border: none;
    line-height: 50px;
    border-radius: 5px;
}
.g-main .login-btn:hover {
    opacity: 0.8;
}
.g-main .send-btn {
    width: 140px;
    position: absolute;
    right: 0;
    font-size: 14px;
    height: 48px;
}
.g-main .register {
    font-size: 12px;
    text-align: center;
}
.g-main .register a {
    color: #4da5f3;
}
.g-main .container {
    width: 400px;
    margin: 0 auto;
    margin-bottom: 20px;
}

.g-main .container #msg {
    width: 100%;
    line-height: 40px;
    font-size: 14px;
    text-align: center;
}

.g-main .container a:link,
.g-main .container a:visited,
.g-main .container a:hover,
.g-main .container a:active {
    margin-left: 100px;
    color: #0366D6;
}
html{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;-webkit-tap-highlight-color: transparent; }
html,body{-webkit-user-select:none;user-select:none;}
html,body,div,object,iframe,applet,object,h1,h2,h3,h4,h5,h6,p,blockquote,pre,address,dl,dt,dd,ol,ul,li,input,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,figcaption,footer,header,menu,nav,output,ruby,section,summary,time,mark,audio,video,progress{margin:0;padding:0;border:0;vertical-align:baseline}
body{
	font-family: "Helvetica Neue", Helvetica, STHeiTi, sans-serif;
}
a{text-decoration:none;-webkit-touch-callout:none;background-color:transparent}
a:active,a:hover{outline:0}
li{list-style:none}
article,aside,details,figcaption,figure,footer,header,main,menu,nav,section,summary{display:block}
audio,canvas,progress,video{display:inline-block}
audio:not([controls]){display:none;height:0}
[hidden],template{display:none}

abbr[title]{border-bottom:1px dotted}
b,strong{font-weight:bold}
dfn{font-style:italic}
h1{font-size:2em;margin:.67em 0}
small{font-size:80%}
sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}
sup{top:-0.5em}
sub{bottom:-0.25em}
img{border:0;-webkit-touch-callout:none;}
svg:not(:root){overflow:hidden}
figure{margin:1em 40px}
hr{-moz-box-sizing:content-box;box-sizing:content-box;height:0}
pre{overflow:auto}
code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}
a,button,input,optgroup,select,textarea{-webkit-tap-highlight-color:rgba(0,0,0,0);}
button,input,optgroup,select,textarea{color:inherit;font:inherit;margin:0;-webkit-appearance:none;outline:none;line-height:normal}
button{overflow:visible}
button,select{text-transform:none}
button,html input[type="button"],input[type="reset"],input[type="submit"]{-webkit-appearance:button;cursor:pointer}
button[disabled],html input[disabled]{cursor:default}
button::-moz-focus-inner,input::-moz-focus-inner{border:0;padding:0}
input{line-height:normal}
input[type="checkbox"],input[type="radio"]{box-sizing:border-box;padding:0}
input[type="number"]::-webkit-inner-spin-button,input[type="number"]::-webkit-outer-spin-button{height:auto}
input[type="search"]{-webkit-appearance:textfield;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;box-sizing:content-box}
input[type="search"]::-webkit-search-cancel-button,input[type="search"]::-webkit-search-decoration{-webkit-appearance:none}
fieldset{border:1px solid silver;margin:0 2px;padding:.35em .625em .75em}
legend{border:0;padding:0}
textarea{overflow:auto}
optgroup{font-weight:bold}
table{border-collapse:collapse;border-spacing:0}
td,th{padding:0}

/*  根据使用习惯，对normalize上进行补充 */


h1, h2, h3 {
    line-height: 2;
    font-weight: normal;
}

 /* icon */
i {
    font-style: normal;
}

 /* 所有元素为border-box */
* {
    box-sizing: border-box;
}

/* 常用功能css */
.f-cb:after,.f-cbli li:after{display:block;clear:both;visibility:hidden;height:0;overflow:hidden;content:".";}
.f-cb,.f-cbli li{zoom:1;}
.f-ib{display:inline-block;*display:inline;*zoom:1;}
.f-dn{display:none;}
.f-db{display:block;}
.f-fl{float:left;}
.f-fr{float:right;}
.f-pr{position:relative;}
.f-prz{position:relative;zoom:1;}
.f-oh{overflow:hidden;}
.f-ff0{font-family:arial,\5b8b\4f53;}
.f-ff1{font-family:"Microsoft YaHei",\5fae\8f6f\96c5\9ed1,arial,\5b8b\4f53;}
.f-fs1{font-size:12px;}
.f-fs2{font-size:14px;}
.f-fwn{font-weight:normal;}
.f-fwb{font-weight:bold;}
.f-tal{text-align:left;}
.f-tac{text-align:center;}
.f-tar{text-align:right;}
.f-taj{text-align:justify;text-justify:inter-ideograph;}
.f-vam,.f-vama *{vertical-align:middle;}
.f-wsn{word-wrap:normal;white-space:nowrap;}
.f-pre{overflow:hidden;text-align:left;white-space:pre-wrap;word-wrap:break-word;word-break:break-all;}
.f-wwb{white-space:normal;word-wrap:break-word;word-break:break-all;}
.f-ti{overflow:hidden;text-indent:-30000px;}
.f-ti2{text-indent:2em;}
.f-lhn{line-height:normal;}
.f-tdu,.f-tdu:hover{text-decoration:underline;}
.f-tdn,.f-tdn:hover{text-decoration:none;}
.f-toe{overflow:hidden;word-wrap:normal;white-space:nowrap;text-overflow:ellipsis;}
.f-csp{cursor:pointer;}
.f-csd{cursor:default;}
.f-csh{cursor:help;}
.f-csm{cursor:move;}
.f-usn{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none;}
/*文本溢出隐藏--结尾省略号--功能*/
.f-toh{text-overflow: ellipsis;overflow: hidden;white-space:nowrap;}
</style>
