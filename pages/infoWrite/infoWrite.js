import util from "../../utils/util.js"
import method from "../../utils/methodUtil.js"
import WxValidate from '../../utils/WxValidate.js'
import ajax from "../../utils/netRequestUtil.js"
import Path from "../../utils/Path.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // userType:"",
    myInfo:{},
    sex: "男",
    sexList: [
      {name:"男", selection: true},
      {name:"女", selection: false},
    ],
    region: ['广东省', '广州市', '海珠区'],
    resume:"",
    streetNumber:"",
    hiddenmodalput: true,
    actionSheetHidden: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.openLoading();
    if(options.id > 0){
      this.getMyInfo().then(data => {

          if(data.length == 0){
            this.getLocationInfo();
            return;
          }

          this.initSexList(data.sex);
          this.setData({
            myInfo: data,
            sex: data.sex,
            ['region[0]']: data.area.province,
            ['region[1]']: data.area.city,
            ['region[2]']: data.area.area_name,
            streetNumber: data.address,
          })
          util.hideLoading();
      }).catch(res => {
        util.hideLoading();
        util.showErrorModal(res.data.stateInfo);
      });
    }else{
      //获取坐标信息
      this.getLocationInfo();
    }

    //表达验证
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
  initSexList: function(sex){
    let sexList = this.data.sexList;
    for(let element of sexList) {
      if(element.name == sex){
        element.selection = true;
        break;
      }
      element.selection = false;
    }

    this.setData({
      sexList: sexList,
    });

  },
  initValidate() {
    const rules = {
      userName: {
        required: true,
      },
      idCardNum: {
        required: true,
        idcard: true
      },
    }
    const messages = {
      userName:{
        required: '请填写用户名',
      },
      idCardNum: {
        required: '请填写身份证号码',
        idcard: '身份证号码不合法',
      }
    }

    this.WxValidate = new WxValidate(rules, messages)
  },
  showModal(error){
    //错误提示
    wx.showModal({
      content: error.msg,
      showCancel: false,
    });
  },
  submitForm(e) {
    var params = e.detail.value
    // 传入表单数据，调用验证方法
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0];
      this.showModal(error);
      return false;
    }else{
      let userInfo = {
        userInfo:{
          repairmanName: params.userName,
          sex:  this.data.sex,
          idCardNum: params.idCardNum,
          address: params.detailedAddr,
          described: this.data.resume,
        },
        area:{
          province: this.data.region[0],
          city: this.data.region[1],
          areaName: this.data.region[2],
        },
       
      }

      // let userInfo = {
      //   userInfo:{
      //     repairmanName: "userName",
      //     sex:  this.data.sex,
      //     idCardNum: "idCardNum",
      //     address: "detailedAddr",
      //     described: this.data.resume,
      //   },
      //   area:{
      //     province: this.data.region[0],
      //     city: this.data.region[1],
      //     areaName: this.data.region[2],
      //   },
       
      // }
      console.log(userInfo);

      ajax.netRequest({
        url: Path.addRepairmanInfo,
        method: "POST",
        data: userInfo,
        success: data =>{
          console.log("-------")
          console.log(data);
          util.success();
          wx.navigateBack();
        },
        fail: res => {
          console.log(this);
          util.showErrorModal(res.data.stateInfo);
        }
        
      });
    }
  },
  getLocationInfo(){
    let that = this;
    util.getLocationInfo().then(function(data){
      let address = data.address_component,
          region = [address.province,address.city,address.district];
      that.setData({
        region: region,
        streetNumber: address.street_number,
      })
    }).catch(function(res){
      console.log(res);
    });
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value,
      streetNumber: ""
    })
  },
  radioChange(e){
    let sex = e.detail.value === "1" ? "女" : "男";
    this.setData({
      sex: sex
    })
  },
  getTextarea: method.throttle(function(e){
    this.setData({
      resume: e.detail.value
    })
  },600),
  getMyInfo: function(){
    return new Promise((resolve, reject) => {
      ajax.netRequest({
        url: Path.getMyInfo,
        method: "GET",
        success: res =>{
          resolve(res.data);
        },
        fail: res => {
          reject(res)
        }
      });
    });
  }
})