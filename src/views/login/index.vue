<template>
  <div class="login-container">
    <Fluttering v-if="Brave" />
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">{{title}}</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          v-model="loginForm.username"
          name="username"
          type="text"
          autocomplete="on"
          placeholder="请输入手机号码"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          v-model="loginForm.password"
          name="password"
          type="text"
          autocomplete="on"
          clearable
          placeholder="请输入验证码"
          @keyup.enter.native="handleLogin"
        />
        <el-button type="primary" style="width:120px" @click="VerificationCode">{{ verification }}</el-button>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
        id="tsx"
      >登录</el-button>
      <div class="tips">
        <span style="margin-right:20px;">
          推荐使用
          <a style="color:#a9d5fb " target="_Blank" href="https://www.google.cn/chrome/">谷歌</a> 、
          <a style="color:#a9d5fb " target="_Blank" href="https://www.firefox.com.cn/">火狐</a> 浏览器以获得最佳使用体验
        </span>
      </div>
    </el-form>
    <div class="ssdown">
      Copyright © 2020-2018 蜂乐购,All Rights Reserved
      <a
        href="http://beian.miit.gov.cn/"
        target="_blank"
        title="湘ICP备18007261号"
      >湘ICP备18007261号</a>
      <a href="http://beian.miit.gov.cn/" target="_blank" title="湘B2-20190013">ICP证：湘B2-20190013</a>
      <a
        target="_blank"
        href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=43019002001041"
        style="display: inline-block; text-decoration: none; height: 20px; line-height: 20px;"
      >
        <img src="../../../public/cop.png" alt width="20px" height="20px" style="float: left;" />
        <span style="float: left; height: 20px; margin: 0px 0px 0px 5px;">湘公网安备 43019002001041号</span>
      </a>
    </div>
  </div>
</template>

<script>
import { isvalidUsername } from "@/utils/validate";
import { verification, login } from "@/api/user";
import defaultSettings from "@/settings";
import { urlTesting } from "@/utils/user";
import Fluttering from "@/components/Fluttering";
export default {
  name: "Login",
  components: { Fluttering },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error("账号输入错误"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("请输入六位数验证码"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: defaultSettings.username, // 18607921775
        password: defaultSettings.password // 8794099
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      redirect: undefined,
      passwordType: "password",
      loading: false,
      showDialog: false,
      verification: "获取验证码",
      sun: 60,
      title: "",
      Brave: Date.parse(new Date()) > 1607742720 ? false : true
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          const obj = {
            phone: this.loginForm.username,
            code: this.loginForm.password
          };
          login(obj)
            .then(res => {
              if (res.code == 1) {
                localStorage.setItem("user", JSON.stringify(res.data));
                this.$router.push({ path: this.redirect || "/" });
              } else {
                this.$message.error(res.msg);
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    VerificationCode() {
      if (this.loginForm.username.length == 11) {
        if (this.sun == 60) {
          verification(this.loginForm.username).then(res => {
            console.log(res);
            if (res.code == 0) {
              this.$message.error(res.msg);
            } else if (res.code == 1) {
              var intl = setInterval(() => {
                if (this.sun > 0) {
                  this.sun = this.sun - 1;
                  this.verification = this.sun + "秒";
                } else {
                  this.sun = 60;
                  this.verification = "获取验证码";
                  clearInterval(intl);
                }
              }, 1000);
            }
          });
        } else {
          this.$message({ message: "按了也没用", type: "warning" });
        }
      } else {
        this.$message.error("请正确的输入手机号");
      }
    }
  },
  created() {
    this.title = urlTesting(defaultSettings.urlTesting).title;
  }
};
</script>

<style rel='stylesheet/scss' lang="scss" >
/* 修复input 背景不协调 和光标变色 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
.ssdown {
  width: 100%;
  text-align: center;
  position: fixed;
  bottom: 20px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.bige {
  animation: icon-bounce 1s infinite;
  -webkit-animation: icon-bounce 1s infinite;
  -moz-animation: icon-bounce 0.5s infinite;
  animation-iteration-count: 3;
  // 以为吧这个动画注释了就好了嘛？你怕是想多了
}
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;

  .login-form {
    // position: absolute;
    // left: 0;
    // right: 0;
    max-width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;

    // -webkit-animation: box 2s infinite
    //  -webkit-animation-iteration-count:3
  }
  @-webkit-keyframes box {
    0% {
      top: 10px;
      left: 10px;
      // transform: rotate(10deg)
    }
    10% {
      bottom: -10px;
      right: 10px;
      // transform: rotate(20deg)
    }
    20% {
      // border-radius: 2px /*从20%的地方才开始变形*/
      // transform: rotate(30deg)
      // left: 50px
      top: 10px;
      left: 10px;
    }
    25% {
      // border-radius: 2px /*从20%的地方才开始变形*/
      // transform: rotate(30deg)
      bottom: -10px;
      right: 10px;
      // transform:translate3d(20,20,20)
    }
    30% {
      top: 10px;
      left: 10px;
      // border-bottom-right-radius:25px
      //  transform: rotate(40deg)
    }
    40% {
      bottom: -10px;
      right: 10px;
      // border-bottom-right-radius:25px
      //  transform: rotate(50deg)
    }
    50% {
      top: 10px;
      left: 10px;
      // left: 50px
      // border-bottom-right-radius:25px
      //  transform: rotate(60deg)
    }
    60% {
      bottom: -10px;
      right: 10px;
      //  bottom: 50px
      // border-bottom-right-radius:25px
      //  transform: rotate(70deg)
    }
    70% {
      top: 10px;
      left: 10px;
      // border-bottom-right-radius:25px
      //  transform: rotate(80deg)
    }
    75% {
      bottom: -10px;
      right: 10px;
      //  right: 50px
      // border-bottom-right-radius:25px
      //  transform: rotate(80deg)
    }
    80% {
      top: 10px;
      left: 10px;
      // transform: rotate(180deg)
      // border-radius:2px  /*到80%的地方恢复原状*/
    }
    90% {
      bottom: -10px;
      right: 10px;
      // top: 80px
      // border-bottom-right-radius:25px
      //  transform: rotate(180deg)
    }
    100% {
      top: 0px;
      right: 0px;
      //  transform: rotate(0deg)
    }
  }
  @keyframes icon-bounce {
    0%,
    100% {
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    25% {
      -moz-transform: rotate(15deg);
      -ms-transform: rotate(15deg);
      -webkit-transform: rotate(15deg);
      transform: rotate(15deg);
    }

    50% {
      -moz-transform: rotate(-15deg);
      -ms-transform: rotate(-15deg);
      -webkit-transform: rotate(-15deg);
      transform: rotate(-15deg);
    }

    75% {
      -moz-transform: rotate(5deg);
      -ms-transform: rotate(5deg);
      -webkit-transform: rotate(5deg);
      transform: rotate(5deg);
    }

    85% {
      -moz-transform: rotate(-5deg);
      -ms-transform: rotate(-5deg);
      -webkit-transform: rotate(-5deg);
      transform: rotate(-5deg);
    }
  }
  @-webkit-keyframes icon-bounce {
    0%,
    75%,
    100% {
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    80% {
      -moz-transform: rotate(15deg);
      -ms-transform: rotate(15deg);
      -webkit-transform: rotate(15deg);
      transform: rotate(15deg);
    }

    85% {
      -moz-transform: rotate(-15deg);
      -ms-transform: rotate(-15deg);
      -webkit-transform: rotate(-15deg);
      transform: rotate(-15deg);
    }

    90% {
      -moz-transform: rotate(5deg);
      -ms-transform: rotate(5deg);
      -webkit-transform: rotate(5deg);
      transform: rotate(5deg);
    }

    95% {
      -moz-transform: rotate(-5deg);
      -ms-transform: rotate(-5deg);
      -webkit-transform: rotate(-5deg);
      transform: rotate(-5deg);
    }
  }
  @-moz-keyframes icon-bounce {
    0%,
    100% {
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    25% {
      -moz-transform: rotate(15deg);
      -ms-transform: rotate(15deg);
      -webkit-transform: rotate(15deg);
      transform: rotate(15deg);
    }

    50% {
      -moz-transform: rotate(-15deg);
      -ms-transform: rotate(-15deg);
      -webkit-transform: rotate(-15deg);
      transform: rotate(-15deg);
    }

    75% {
      -moz-transform: rotate(5deg);
      -ms-transform: rotate(5deg);
      -webkit-transform: rotate(5deg);
      transform: rotate(5deg);
    }

    85% {
      -moz-transform: rotate(-5deg);
      -ms-transform: rotate(-5deg);
      -webkit-transform: rotate(-5deg);
      transform: rotate(-5deg);
    }
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>
<style >
.login-container .el-input {
  width: 280px;
}
</style>
