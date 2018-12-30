import ajax from "../../utils/netRequestUtil";
import Path from "../../utils/Path.js";
import method from "../../utils/methodUtil";
import formValidatUtil from "../../utils/formValidatUtil";
import util from "../../utils/util";

Page({
  data: {
    popular:[
      "上门洗车",
      "空调安装",
      "空调维修",
      "空调清洗",
      "马桶疏通",
      "拉车",
      "搬家",
      "开锁",],
    inputShowed: false,
    inputVal: "",
    resData:[],
    showTisp: false,
  },
  onLoad: function () {
    console.log(this.data.resData.length)
    util.openLoading();
  },
  onShow: function () {
    util.hideLoading();
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  showResult: function(data){
    if(data.length > 0){
      this.setData({
        resData: data,
      });
    }else{
      this.setData({
        resData: data,
        showTisp: true,
      });
    }
  },
  getClick: function(e){
    let id = e.target.dataset.id,
        value = this.data.popular[id];
    console.log(value);

    if(!value){
      return;
    }
    this.showInput();
    this.setData({
      inputVal: value
    })
    this.search(value);
   
  },
  search: function(value){
    util.openLoading();
    ajax.netRequest({
      url: Path.skillSarch + "?skill_name=" + value,
      method: "GET",
      success: res => {
        util.hideLoading();
        this.showResult(res.data);
      },
      fail: res => {
        util.hideLoading();
        util.tips(res.data.stateInfo);
        console.log(res);
      }
    });
  },
  inputTyping: method.debounce(function (e) {
    let searchValue = e.detail.value.replace(/\s+/g,"");
    if(formValidatUtil.search(searchValue) && this.data.inputVal != searchValue){
      this.setData({
        inputVal: searchValue,
        showTisp: false,
      });
      this.search(searchValue);
    }
  },1000)
})
