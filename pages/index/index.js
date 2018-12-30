// pages/index/index.js

import Path from '../../utils/Path.js'
import ajax from '../../utils/netRequestUtil.js'
import util from '../../utils/util.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultImage:"../../images/weixiutouxiang.png",
    mailList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.openLoading();
    this.getMailList();
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
    this.onLoad();
    wx.stopPullDownRefresh();
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
  getMailList: function(){
    ajax.netRequest({
      url: Path.getMailList,
      method: "GET",
      success: res => {
        util.hideLoading();
        console.log(res);
        this.setData({
          mailList: res.data,
        });
      },
      fail: res => {
        util.hideLoading();
        console.log(res.data.state);
        util.showErrorModal(res.data.stateInfo);
      }
    })
  },
  phone:function(e){
    console.log(e);
    if(e.currentTarget.dataset.phone){
      wx.makePhoneCall({
        phoneNumber: e.target.dataset.phone // 仅为示例，并非真实的电话号码
      })
    }
  }
})