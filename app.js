
import util from './utils/util.js';
App({
  onLaunch: function () {
    // wx.clearStorage();
    util.openLoading();
    util.getLocationInfo().then(res => {
      console.log(res);
      wx.setStorageSync('locationInfo', res.address_component);
    }).catch(res => {
      console.log(res);
    });
  }
})