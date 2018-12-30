
import WxValidate from '../../utils/WxValidate.js'
import Path from '../../utils/Path.js'
import ajax from '../../utils/netRequestUtil.js'
import formValidatUtil from '../../utils/formValidatUtil.js'
import method from '../../utils/methodUtil.js'
import util from '../../utils/util.js';

// const app = getApp();

// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //true时隐藏验证码弹窗
    hiddenmodalput: true,
    //true时不能获取短信验证码。防止频繁获取短信验证码
    prohibit: false,
    defaultUserType: 1,
    accounts:[
      "维修师傅",
      "普通用户",
    ],
    seconds: 60,//60秒，用于提示用户
    tips:'点击图片可切换验证码',
    image:'',
    kaptcha: Path.kaptcha,
    code:'',
    phone:'',
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.openLoading();
    this.setData({
      defaultUserType: options.userType || 1,
    })
    this.initValidate();
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    util.hideLoading();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getPhone: method.debounce(function (e) {
    this.setData({
      phone: e.detail.value
    })
  },300),
  getKaptcha(){
    let that = this;
    ajax.netRequest({
      url: that.data.kaptcha + "?t=" + new Date().getTime(),
      method:"GET",
      success: res => {
        let image = "data:image/png;base64," + res.imageBase64;
        that.setData({
          image: image
        })
      },
      fail: res => {
        console.log(res.data)
      }
    });
  },
  switchCode(){
    this.getKaptcha();
  },
  //点击按钮痰喘指定的hiddenmodalput弹出框  
  modalinput: function () {
    let msg = "手机号码不合法";
    if (formValidatUtil.Mobile(this.data.phone) && !this.data.prohibit){
      this.getKaptcha();
      this.setData({
        code: '',
        hiddenmodalput: !this.data.hiddenmodalput
      });
      return;
    }
    if (this.data.prohibit){
      msg = "验证码已发送，不能频繁获取验证码";
    }

    this.showModal({
      msg: msg
    });
   
  },
  //取消按钮  
  cancel: function () {
    this.setData({
      hiddenmodalput: true,
      tips: '点击图片可切换验证码',
      code: '',
    });
  },
  //确认  
  confirm: function (e) {
    let that = this;
    ajax.netRequest({
      url: Path.smsCode,
      method: "POST",
      data: {
        code: that.data.code,
        phoneNum: that.data.phone
      },
      success: res => {
        console.log(res);

        that.setData({
          prohibit:true,
          hiddenmodalput: true
        })
        setTimeout(function(){
          that.setData({
            prohibit:false,
          })
        },60000);
        that.getKaptcha();
      },
      fail: res => {
        console.log(res);
        util.tips(res.data.stateInfo);
      }
    });
  },
  getUserType(e){
    this.setData({
      defaultUserType: e.detail.value
    });
  },
  getVerificationCode: method.debounce(function(e){
    this.setData({
      code: e.detail.value
    });
  },400),
  //短信验证报错弹窗 
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },
  initValidate() {
    const rules = {
      userType: {
        required: true,
      },
      phone: {
        required: true,
        tel: true
      },
      messageCode:{
        required: true,
        minlength: 6,
      }
    }
    const messages = {
      userType:{
        required: '请选择用户类型',
      },

      phone: {
        required: '请填写手机号',
        tel: '请填写正确的手机号'
      },

      messageCode:{
        required: '请填写短信验证码',
        minlength: '输入的短信验证码不正确',
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  // 调用验证方法，传入参数 e 是 form 表单组件中的数据
  submitForm(e) {
    var params = e.detail.value
    console.log(params)
    // 传入表单数据，调用验证方法
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0];
      this.showModal(error);
      return false;
    }else{
      params.userType = params.userType === "0" ? "2" : "1";
      let user = {
          userType: params.userType,
          userNumber: this.data.phone
        },
        smsCode = params.messageCode;
      this.register(user, smsCode).then(data => {
        console.log(data.user_type == "1")
        if(data.user_type == "1"){
          wx.navigateBack({
            delta: 1
          })
          return;
        }
        if(data.user_type == "2"){
          wx.navigateTo({
            url: '../infoWrite/infoWrite'
          })
          return;
        }
      }).catch(res => {
        this.showModal({msg: res.data.stateInfo});
      });
    }
  },
  register: function(user, smsCode){
    return new Promise(function(resolve, reject){
      wx.login({
        success: res => {
          let data =  {code: res.code, user: user, sms_code: smsCode}
          ajax.netRequest({
            url: Path.register,
            data: data,
            method: "POST",
            success: data => {
              wx.setStorageSync('token', data.user.key);
              wx.setStorageSync('userId', data.user.id);
              wx.setStorageSync('userInfo',data.user);
              wx.setStorageSync('realNameFlag',data.user.real_name_flag);
              wx.setStorageSync('userInfo',data.user.repairman);
              resolve(data.user);
            },
            fail: res => {
              console.log(res);
              reject(res);
            }
          });
        }
      });
    });
  }
})