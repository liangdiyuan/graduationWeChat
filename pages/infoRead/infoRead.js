// pages/infoRead/infoRead.js
import ajax from "../../utils/netRequestUtil.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    tail:"未实名认证",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if(wx.getStorageSync('realNameFlag') === "1"){
      this.setData({
        tail: "已实名认证",
      })
    }else if(wx.getStorageSync('realNameFlag') === "0"){
      this.setData({
        tail: "审核中",
      })
    }
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
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
  alterInfo: function(){
    wx.navigateTo({
       url: '../infoWrite/infoWrite?id=' + this.data.userInfo.id
    })
  }
})