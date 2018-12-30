// pages/serviceFlag/serviceFlag.js
import util from "../../utils/util.js";
import ajax from "../../utils/netRequestUtil.js"
import Path from "../../utils/Path.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ServiceFlagList:{},
    checkboxItems:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    util.openLoading();
    this.getServiceFlag(wx.getStorageSync("skillList"));
   
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
  getSubmitData(data){
    let tmpeArray = [];

    data.forEach((element, index) => {

      if(element.checked){
        tmpeArray[index] = {"skill_id": element.id, "service_flag": 1}
      }else{
        tmpeArray[index] = {"skill_id": element.id, "service_flag": 0}
      }
    });
    
    return tmpeArray;
  },
  lower(){
    let data = this.getSubmitData(this.data.checkboxItems);
    wx.setStorageSync("serviceFlagList", this.data.checkboxItems);

    ajax.netRequest({
      url: Path.addRepairmanSkill,
      data: data,
      method: "POST",
      success: res => {
        // wx.switchTab({
        //   url: '../mine/mine'
        // })
        wx.navigateBack({
          delta: 3
        })
      },
      fail: res => {
        util.tips(res.data.stateInfo);
      }
    });
    
  },
  upper(){
    wx.navigateBack();
  },
  getServiceFlag(parameter){
    let tempArray = [];

    for(let Item of parameter){
      if(Item.checked){
        Item.checked = false;
        tempArray.push(Item);
      }
    }

    this.setData({
      checkboxItems: tempArray,
    })
    
    util.hideLoading();
  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);

    var checkboxItems = this.data.checkboxItems, values = e.detail.value;
    for (let Item of checkboxItems) {
      Item.checked = false;
      for (let id of values) {
          if(Item.id == id){
            Item.checked = true;
            break;
          }
      }
    }

    this.setData({
      checkboxItems: checkboxItems
    });
  },
})