// pages/repairmanInfo/repairmanInfo.js
import ajax from "../../utils/netRequestUtil";
import Path from "../../utils/Path.js";
import util from "../../utils/util";


Page({

  /**
   * 页面的初始数据
   */
  data: {
    RepairmanInfo:[],
    defaultImage:"../../images/weixiutouxiang.png",
    id:"",
    upper: {
      type: 0,
      name: "添加"
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.openLoading();
    let id = options.id,
        flag = options.flag;
    this.getRepairmanInfo(id, flag);
    if(flag){
      this.setData({
        ['upper.type']: 1,
        ['upper.name']: "删除",
      })
    }
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
  getRepairmanInfo: function(id, flag){

    ajax.netRequest({
      url: Path.getRepairmanInfo,
      data: id,
      method: "POST",
      success: res => {
        util.hideLoading();
        let id =  flag || res.data.id;
        this.setData({
          id: id,
          RepairmanInfo: res.data,
        })
      },
      fail: res => {
        util.hideLoading();
        console.log(res);
      }
    });

  },
  lower:function(e){
    console.log(e);
    let phone = e.currentTarget.dataset.phone;
    if(phone){
      wx.makePhoneCall({
        phoneNumber: phone // 仅为示例，并非真实的电话号码
      })
    }
  },
  upper: function(e){
    console.log(e);
    let id = e.currentTarget.dataset.id;
    if(this.data.upper.type === 1){
      this.removeMailList(id);
    }else {
      this.addToMailList(id);
    }
  },
  addToMailList: function(id){
    if(id > 0){
      ajax.netRequest({
        url: Path.addToMailList,
        data: {repairman_id: id},
        method: "POST",
        success: res => {
          util.hideLoading();
          util.success();
        },
        fail: res => {
          util.hideLoading();
          console.log(res)
          util.tips(res.data.stateInfo);
        }
      });
    }
  },
  removeMailList: function(id){
    if(id > 0){
      ajax.netRequest({
        url: Path.alterMailList,
        data: {id: id},
        method: "POST",
        success: res => {
          util.hideLoading();
          util.success();
          wx.switchTab({
            url: "../index/index"
          })   
        },
        fail: res => {
          util.hideLoading();
          console.log(res)
          util.tips(res.data.stateInfo);
        }
      });
    }
  }
})