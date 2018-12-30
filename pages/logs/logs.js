//logs.js
import util from '../../utils/util.js';
import ajax from '../../utils/netRequestUtil.js';
import Path from "../../utils/Path.js";

let tempArray = [];

Page({
  data: {
    defaultImage:"../../images/weixiutouxiang.png",
    RepairmanList:[],
    skillId: "",
    count: 2,
    pageIndex: 1,
    showLoadmore: true,
  },
  onLoad: function (options) {
    util.openLoading();
    tempArray.length = 0;
    console.log(options.skill_id);
    this.setData({
      skillId: options.skill_id,
    });
    this.getRepairmanList(options.skill_id).then(res => {
      let data = res.data || [];
      tempArray.push(...data);
      this.setData({
        RepairmanList: tempArray,
        count: res.count,
      })
    });
  },
  onShow: function () {
    
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  onPullDownRefresh() {
    this.onLoad({skill_id: this.data.skillId});
    wx.stopPullDownRefresh();
    this.setData({
      pageIndex: 1,
    })
  },
    /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(this.data.count +"==" + this.data.pageIndex)
    if(this.data.count > this.data.pageIndex){
      let pageIndex = this.data.pageIndex + 1;
      this.setData({
        showLoadmore: false,
      })
      this.getRepairmanList(this.data.skillId, pageIndex).then(res => {
        let data = res.data || [];
        tempArray.push(...data);
        this.setData({
          RepairmanList: tempArray,
          pageIndex: pageIndex,
          showLoadmore: true,
        })
      });
      return;
    }

    if(!this.data.showLoadmore){
      this.setData({
        showLoadmore: true,
      });
    }
    
  },
  getRepairmanList: function(id, pageIndex){
    return new Promise((resolve, reject) => {
      let locationInfo = wx.getStorageSync('locationInfo');
      let data = {
        skill_id: id, 
        flag: "1", 
        page_index: pageIndex || 1,
        area:{
          province: locationInfo.province,
          city: locationInfo.city,
          areaName: locationInfo.district,
        }
      };
      ajax.netRequest({
        url: Path.getRepairmanList,
        data: data,
        method: "POST",
        success: res => {
          util.hideLoading();
          resolve(res);
        },
        fail: res => {
          util.hideLoading();
          reject(res);
          console.log(res.data.state);
          util.showErrorModal(res.data.stateInfo);
        }
      })

    });
    
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
