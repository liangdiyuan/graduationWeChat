import util from "./util";

const Server = "http://192.168.99.151:8082";

function netRequest(req) {
  let contentType = req.contentType || "application/json; charset=utf-8",
      method = req.method || "GET",
      sessionId = wx.getStorageSync('session_id'), //本地取存储的sessionID
      token = wx.getStorageSync('token'),
      header = null,
      url = encodeURI(Server + req.url),
      data = req.data !== null && typeof req.data == "object" ? JSON.stringify(req.data) : req.data;

  header = {
    'Authorization':  token,
    'content-type': contentType,
    'Cookie': sessionId,
  }
  console.log(url);
  wx.request({
    url: url,
    method: req.method,
    data: data,
    header: header,
    success: res => {
      if (res.header["Set-Cookie"]) {
        //如果本地没有就说明第一次请求 把返回的session id 存入本地
        let cookie = res.header["Set-Cookie"];
        wx.setStorageSync('session_id', cookie)
      }

      if(res.data.state == 401){
        util.hideLoading();
        util.showLoginModel().then( res => {
          this.netRequest(req);
        }).catch(() => {
          wx.navigateBack();
        });
        return;
      }

      (res['statusCode'] === 200 && res.data.success) ? req.success(res.data) : req.fail(res)
    },
    fail: res =>{
      req.fail(res);
    }
  })
}



function uploadFile(req){

  let sessionId = wx.getStorageSync('session_id'), //本地取存储的sessionID
      token = wx.getStorageSync('token'),
      url = encodeURI(Server + req.url),
      header = null;

  if (sessionId){
    header = {
      'Authorization': token,
      'content-type': "multipart/form-data",
      'Cookie': sessionId,
    }

    wx.uploadFile({
      url: url,
      filePath: req.filePath,
      name: req.name,
      formData: req.formData,
      header: header,
      success: res => {
        let data = JSON.parse(res.data);
        if(data.state == 401){
          wx.hideToast();
          util.hideLoading();
          util.showLoginModel().then( res => {
            this.uploadFile(req);
          }).catch(() => {
            wx.navigateBack();
          });
          return;
        }

        (res['statusCode'] === 200 && data.success) ? req.success(data) : req.fail(res);
      },
      fail: req.fail

    });
  }

  return false;
}

export default {netRequest, uploadFile}