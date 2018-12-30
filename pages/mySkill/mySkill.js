// pages/mySkill/mySkill.js
import ajax from '../../utils/netRequestUtil.js';
import Path from "../../utils/Path.js";
import util from "../../utils/util.js";

let is = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    skillList:[],
    hiddenmodalput: true,
    // tips:"修改",
    checkboxItems:[
      {name:"提供上门服务", id: "0"},
      {name:"上架", id: "1"}
    ],
    skillId: "",
    isAlter: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.openLoading();
    this.getMySkill();
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
    if(is){
      this.onLoad();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    is = true;
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
  getMySkill:function(){

    ajax.netRequest({
      url: Path.getRepairmanSkill,
      method:"GET",
      success: res => {
        console.log(res);
        this.setData({
          skillList: res.data
        })
        util.hideLoading();
      },
      fail: res => {
        util.hideLoading();
        util.showErrorModal(res.data.stateInfo);
        
      }
    });
  },
  alterSkill:function(e){
    let index = e.target.dataset.index;
    if(index === ""){
      return;
    }

    let skill = this.data.skillList[index];

    //skill.service_flag == 0表示不上门服务
    //skill.service_flag == 1表示上门服务
    //skill.flag == 0表示下架
    //skill.flag == 1表示上架
    let serviceFlag = skill.service_flag === "1" ? true : false,
        flag = skill.flag === "1" ? true : false;
    
    this.setData({
      hiddenmodalput:false,
      ["checkboxItems[0].checked"]: serviceFlag,
      ["checkboxItems[1].checked"]: flag,
      skillId: skill.id,
    });
  },
  cancel: function(e){
    this.setData({
      isAlter: false,
      hiddenmodalput:true,
    });
  },
  getSubmitData:function(){

    let alterValue = {
      id: this.data.skillId,
      service_flag: "0",
      flag: "0",
    }

    //获取提交数据
    for(let Item of this.data.checkboxItems){
      console.log(Item.checked)
      if(Item.checked){
        console.log(Item.id )
        if(Item.id === "0"){
          alterValue.service_flag = "1"
        }else if(Item.id === "1"){
          alterValue.flag = "1";
        }
      }
    }

    return alterValue;
  },
  confirm:function(e){

    //判断内容是否修改过，修改过才发请求
    if(!this.data.isAlter){
      return;
    }

    let data = this.getSubmitData();

    ajax.netRequest({
      url: Path.alterRepairmanSkill,
      data: data,
      method:"POST",
      success: res => {
        console.log(res);
        this.setData({
          skillList: res.data,
          hiddenmodalput: true,
          isAlter: false,
        });
      },
      fail: res => {
        console.log(res);
      }
    });
  },
  addSkill:function(){
    wx.navigateTo({
      url: '../skillCategoryList/skillCategoryList'
    })
  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);

    var checkboxItems = this.data.checkboxItems, values = e.detail.value;
    for (let Item of checkboxItems) {
      Item.checked = false;
      for (let id of values) {
          if(Item.id === id){
            Item.checked = true;
            break;
          }
      }
    }
    this.setData({
      isAlter: true,
      checkboxItems: checkboxItems,
    });
  },
})