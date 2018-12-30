import ajax from '../../utils/netRequestUtil.js'
import Path from "../../utils/Path.js"
import util from "../../utils/util.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: Array(2).fill(''),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  chooseImage: function (e) {
    let filePath = "files[0]";
    if (e.currentTarget.id == "back"){
      filePath = "files[1]";
    }

    console.log(e.currentTarget.id);
    var that = this;
    wx.chooseImage({
      count:1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success:  res => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          [filePath]: res.tempFilePaths[0]
        });
      },
      fail: res =>{
        console.log(res);
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  submit:function(){
    let files = this.data.files;
    console.log(files);

    //启动上传等待中...  
    wx.showToast({
      title: '正在上传...',
      icon: 'loading',
      mask: true,
      duration: 10000
    });

    let uploadImgCount = 0;
    for (var i = 0, h = files.length; i < h; i++) {  
      if (files[0] == "" || files[1] == ""){
        
        let content = files[0] == "" ? "请选择上传人像面照片" : "请选择上传国徽面照片";
        
        wx.hideToast();
        util.fail(content);
        return;
      }

      console.log(files[i]);
      ajax.uploadFile({
        url: Path.authentication,
        filePath: files[i],
        name: "file",
        formData: {
          'imgIndex': i
        },
        success: data => {
          uploadImgCount++;
          console.log(data);
          console.log(h);
          //如果是最后一张,则隐藏等待中  
          if (uploadImgCount == h) {
            wx.hideToast();
            util.success();
            wx.navigateBack();
          }
        },
        fail: res => {
          wx.hideToast();
          util.fail('上传图片失败');
        }
      });
    }
  }
})