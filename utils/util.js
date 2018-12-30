import QQmap from "./qqmap-wx-jssdk.min.js";
import Path from "./Path.js";
import ajax from "./netRequestUtil.js"
// import ajax from './netRequestUtil.js'

const getLocationInfo = function(){
  return new Promise(function(resolve, reject){
    let qqmapsdk = new QQmap({
        key:"LCEBZ-NDEKU-PELVJ-BSCIM-HRQYS-SPFQJ"
    });
    //1、获取当前位置坐标
    wx.getLocation({
      type:'wgs84',
      success: res =>{
        var latitude1 = res.latitude
        var longitude1 = res.longitude
        qqmapsdk.reverseGeocoder({
            location:{
              latitude: latitude1,
              longitude: longitude1
            },
            success:function(res){
              resolve(res.result);
            },
            fail:function(res){
              reject(res);
            }
        });
      },fail: res => {
        reject(res);
      }
    });
  });
}


const openLoading = function (title) {
  wx.showLoading({
    title: title || '加载中',
    mask: true,
  });
}

const hideLoading = function () {
  wx.hideLoading();
}

const success = function(){
  wx.showToast({
    title: '成功',
    icon: 'success',
    duration: 2000
  })
}


const tips = function(title){
  wx.showToast({
    title: title || "网络异常",
    icon: 'none',
    duration: 2000
  })
}


const fail = function(tips){
  return new Promise(function(resolve){
    wx.showModal({
      content: tips || '网络异常，请重试',
      showCancel: false,
      success(res) {
        resolve(res);
      }
    });
  });
}

const showErrorModal = function(tips){
  wx.showModal({
    content: tips || "网络异常，请重试",
    showCancel: false,
    success: res => {
      if(res.confirm){
        wx.navigateBack({
          delta: 1
        })
      }
    }
  });
}

const loginErrorModel = function(){
  wx.showModal({
    title: '登录失败',
    content: '该微信号未注册我们的小程序，请注册再试',
    showCancel: true,//是否显示取消按钮
    cancelText:"取消",//默认是“取消”
    cancelColor:'#BDBDBD',//取消文字的颜色
    confirmText:"注册",//默认是“确定”
    success: function (res) {
       if (res.confirm) {
        wx.navigateTo({
          url: '../register/register'
        })
       }
    }
 })
}
const showLoginModel =  function(){
  return new Promise((resolve, reject) => {
    wx.showModal({
      content: "账号未登录，是否微信授权登录",
      confirmText:"授权登录",//默认是“确定”
      success: res => {
        if(res.confirm){
          this.login().then( res => {
            resolve(res);
          });
        }else{
          reject();
        }
      }
    });
  });
}

const login = function(){
  this.openLoading("登录中");
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        ajax.netRequest({
          url: Path.login,
          data: res.code,
          method: "POST",
          success: data => {
            wx.setStorageSync('token', data.user.key);
            wx.setStorageSync('userId', data.user.id);
            wx.setStorageSync('userType', data.user.user_type);
            wx.setStorageSync('realNameFlag',data.user.real_name_flag);
            wx.setStorageSync('userInfo',data.user.repairman);
            this.hideLoading();
            resolve(data);
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


export default {
  getLocationInfo: getLocationInfo,
  openLoading: openLoading,
  hideLoading: hideLoading,
  success: success,
  showErrorModal: showErrorModal,
  fail: fail,
  tips: tips,
  login: login,
  showLoginModel: showLoginModel,
  loginErrorModel: loginErrorModel,
}


