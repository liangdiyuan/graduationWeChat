// pages/mine/mine.js
import util from "../../utils/util";

//获取应用实例
// const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRepairman: false,
    isLogin: false,
    userName: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync('userType') )
    this.setData({
      isLogin: wx.getStorageSync('userId') != "" ? true : false,
      isRepairman: wx.getStorageSync('userType') == "2" ? true : false,
      userName: wx.getStorageSync('userInfo').name || "",
    })
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

  login: function(){
    if(this.data.isLogin === false){
      util.openLoading("微信授权登录中")
      let that = this;
      util.login().then( data => {
        that.setData({
          isLogin: true,
          isRepairman: data.user.user_type == "2" ? true : false,
          userName: data.user.repairman.name,
        });
        util.hideLoading();
      }).catch(res => {
        util.hideLoading();
        console.log(res)
        if(res.data.state == 401){
          util.loginErrorModel();
        }
      });
    }else{
      wx.navigateTo({
        url: '../infoRead/infoRead'
      });
    }
  },
  open: function () {
    wx.showActionSheet({
      itemList: ['电话客服', '在线客服'],
      success: function (res) {
        if (!res.cancel) {
          console.log(res.tapIndex)
        }
      }
    });
  }
})