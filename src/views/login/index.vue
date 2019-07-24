<template>
  <div>
    <div id="particles"><canvas class="particles-js-canvas-el" width="1747" height="1000" style="width: 100%; height: 100%;"></canvas></div>
    <el-card class="login-form-layout">
      <el-form autoComplete="on"
               :model="loginForm"
               :rules="loginRules"
               ref="loginForm"
               label-position="left">
        <div style="text-align: center">
        </div>
        <h2 class="login-title color-main">爱博互娱后台</h2>
        <el-form-item prop="username">
          <el-input name="username"
                    type="text"
                    v-model="loginForm.username"
                    autoComplete="on"
                    placeholder="请输入用户名">
          <span slot="prefix">
            <svg-icon icon-class="user" class="color-main"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password"
                    :type="pwdType"
                    @keyup.enter.native="handleLogin"
                    v-model="loginForm.password"
                    autoComplete="on"
                    placeholder="请输入密码">
          <span slot="prefix">
            <svg-icon icon-class="password" class="color-main"></svg-icon>
          </span>
            <span slot="suffix" @click="showPwd">
            <svg-icon icon-class="eye" class="color-main"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input name="code"
                    type="text"
                    v-if="showCode"
                    style="width: 170px; margin-right: 10px"
                    @keyup.enter.native="handleLogin"
                    v-model="loginForm.code"
                    placeholder="清输入短信验证码">
          <span slot="prefix">
            <svg-icon icon-class="message" class="color-main"></svg-icon>
          </span>
          </el-input>
          <span v-if="showCode">
            <el-button v-if="!isSendCode" disabled style="width: 120px">{{countDown}} s</el-button>
            <el-button type="primary" v-if="isSendCode"  style="width: 120px" @click="handleSendPhoneCode">发送验证码</el-button>
          </span>
          
        </el-form-item>
        <el-form-item>
          <el-button style="width: 100%" type="primary" :loading="loading" @click.native.prevent="handleLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  

  </div>
</template>

<script>
  import {isvalidUsername} from '@/utils/validate';
  import {setSupport,getSupport,SupportUrl} from '@/utils/support';
  import login_center_bg from '@/assets/images/login_center_bg.png';
  import {sendPhoneCode} from '@/api/common/sendPhoneCode';
  import store from '@/store'
  import { Message, MessageBox } from 'element-ui'

  export default {
    name: 'login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (value.length > 18 || value.length < 3) {
          callback(new Error('请输入正确的用户名'))
        } else {
          callback()
        }
      };
      const validatePass = (rule, value, callback) => {
        if (value.length < 3) {
          callback(new Error('密码不能小于3位'))
        } else {
          callback()
        }
      };
      return {
        loginForm: {
          username: '',
          password: '',
          code: '',
        },
        loginRules: {
          username: [{required: true, trigger: 'blur', validator: validateUsername}],
          password: [{required: true, trigger: 'blur', validator: validatePass}]
        },
        loading: false,
        pwdType: 'password',
        login_center_bg,
        dialogVisible:false,
        showCode: false,
        countDown:120,
        isSendCode: false,
        timer: null,
      }
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            this.$store.dispatch('Login', this.loginForm).then(isCheckPhone => {
              if (isCheckPhone == false) {
                this.loginRules.code = [{required: true, trigger: 'blur'}]
                this.showCode = true
                this.loading = false

                //短信校验定时器
                this.timer = setInterval(() => {
                  if (this.countDown > 0 && this.countDown <= 120) {
                    this.countDown--;
                  } else {
                    this.isSendCode = true;
                    clearInterval(this.timer);  // 清除定时器
                    this.countDown = 120;
                    this.timer = null;
                  }
                }, 1000)
                return false
              }
              this.loading = false;
              this.$router.push({path: '/'})
            }).catch(() => {
              this.loading = false
            })
          } else {
            return false
          }
        })
      },
      dialogConfirm(){
        this.dialogVisible =false;
        setSupport(true);
        window.location.href=SupportUrl;
      },
      dialogCancel(){
        this.dialogVisible = false;
        setSupport(false);
      },
      handleSendPhoneCode() {
        if (this.isSendCode == true) {
          sendPhoneCode({username: this.loginForm.username}).then(response => {
            if (response.errorCode == '200') {
                this.isSendCode = false
                //短信校验定时器
                this.timer = setInterval(() => {
                  if (this.countDown > 0 && this.countDown <= 120) {
                    this.countDown--;
                  } else {
                    this.isSendCode = true;
                    clearInterval(this.timer);  // 清除定时器
                    this.countDown = 120
                    this.timer = null;
                  }
                }, 1000)
            }
          })
        }
      }
    },
      mounted: function () {
      particlesJS('particles',

          {
              "particles": {
                  "number": {
                      "value": 70,
                      "density": {
                          "enable": true,
                          "value_area": 800
                      }
                  },
                  "color": {
                      "value": "#bddcf0"
                  },
                  "shape": {
                      "type": "circle",
                  },
                  "opacity": {
                      "value": 0.8,
                      "random": true,
                      "anim": {
                          "enable": false,
                          "speed":2,
                          "opacity_min": 0.1,
                          "sync": false
                      }
                  },
                  "size": {
                      "value": 10,
                      "random": true,
                      "anim": {
                          "enable": true,
                          "speed": 0.5,
                          "size_min": 0.3,
                          "sync": false
                      }
                  },
                  "line_linked": {
                      "enable": true,
                      "distance": 150,
                      "color": "#3cabff",
                      "opacity": 0.3,
                      "width": 1
                  },
              },
              "interactivity": {
                  "detect_on": "canvas",
                  "events": {
                      "onhover": {
                          "enable": true,
                          "mode": "grab"
                      },
                      "onclick" : {
                          "enable" : false
                      },
                      "resize": true
                  },
                  "modes": {
                      "grab": {
                          "distance": 200,
                          "line_linked": {
                              "opacity": 0.8
                          }
                      },
                      "bubble": {
                          "distance": 400,
                          "size": 40,
                          "duration": 2,
                          "opacity": 8,
                          "speed": 3
                      },
                      "repulse": {
                          "distance": 200
                      },
                      "push": {
                          "particles_nb": 4
                      },
                      "remove": {
                          "particles_nb": 2
                      }
                  }
              },
              "retina_detect": true
          }
      );
  }
  }
</script>

<style scoped>
  .login-form-layout {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    width: 360px;
    margin: 140px auto;
    border-top: 10px solid #409EFF;
  }

  .login-title {
    text-align: center;
  }

  .login-center-layout {
    background: #409EFF;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    margin-top: 200px;
  }
  #particles{
      position: absolute;
      width: 100%;
      height: 100%;
      /*background-repeat: no-repeat;*/
      /*background-size: cover;*/
      /*background-position: 50% 50%;*/
  }
</style>
