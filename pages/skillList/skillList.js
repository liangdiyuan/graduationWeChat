import util from "../../utils/util.js";
import ajax from "../../utils/netRequestUtil.js"
import Path from "../../utils/Path.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
    selectionValue:[],
    checkboxItems:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    util.openLoading();
    let skillCategoryList = wx.getStorageSync("skillCategoryList");
    this.getSkillList(skillCategoryList);
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
  lower(){
    if(this.data.selectionValue.length > 0){

      wx.setStorageSync("skillList", this.data.checkboxItems);

      wx.navigateTo({
        url: '../serviceFlag/serviceFlag'
      })
      return;
    }

    util.tips("请选择技能");
   
  },
  upper(){
    wx.navigateBack();
  },
  getSkillList(parameter){
    let that = this;
     ajax.netRequest({
      url: Path.skillList,
      data: parameter,
      method: "POST",
      success: res => {
        this.setData({
          checkboxItems: res.data
        })
        util.hideLoading();
      },
      fail: res => {
        console.log(res);
        util.hideLoading();
        util.fail(function(){
          that.getSkillList();
        });
      }
    })
  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    var checkboxItems = this.data.checkboxItems, 
        values = e.detail.value;

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
      selectionValue: values,
      checkboxItems: checkboxItems,
    });
  },

})