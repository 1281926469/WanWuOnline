const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.wlcardCharge(0);
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
  wlcardCharge(pageNo) {
    const that = this;
    const url = "https://litin.gmiot.net/GetDataService?method=getExpireWlCardInfo&type=3&eid="+ app.globalData.accessToken.substr(5, 7) +"&pageSize=20&pageNo="+pageNo+"&range=0-0&distribute=4&access_token=" + app.globalData.accessToken;
    wx.request({
      url,
      success: function (res) {
        console.log(res.data.data.records)
        if (res.data.errcode == 0) {
          let records = res.data.data.records;
          that.setData({
            deviceList: that.data.deviceList.concat(records)
          })
          console.log(that.data.deviceList)
          if (records.length == 20) {            
            that.wlcardCharge(pageNo+1)
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  wlcardRecharge () {
    const that = this;
    wx.showModal({
      title: this.data.name,
      content: "物联卡到期时间：" + this.data.wlcard_out_time,
      confirmText: "续费",
      success: function (res) {
        if (res.confirm) {
            that.initWlcardPayment()
        } else if (res.cancel) {

        }
      }
    })
  },
  initWlcardPayment (e) {
    const that = this;
    let msisdn = e.currentTarget.dataset.msisdn;
    const url = "https://litin.gmiot.net/carol-pay";
    wx.request({
      url,
      data: {
        method: 'renewWlcard',
        eid: app.globalData.accessToken.substr(5, 7),
        msisdns: msisdn,
        access_token: app.globalData.accessToken,
        pay_type: "mp",
        open_id: app.globalData.openId
      },
      success: function (res) {
        if (res.data.errcode == 0) {
          let data = res.data.data;
          that.checkPayment(data);
        } else {
          wx.showToast({
              title: '获取充值信息失败',
              icon: 'none'
          })
        }
      }
    })
  },
  checkPayment(obj) {
    const that = this
    wx.requestPayment({
      timeStamp: obj.wx_pay.timestamp,
      nonceStr: obj.wx_pay.noncestr,
      package: obj.wx_pay.package,
      signType: 'MD5',
      paySign: obj.wx_pay.paysign,
      appId: obj.wx_pay.appid,
      success(res) {
        that.wlcardCharge(0);
      },
      fail(res) {
        console.log('失败')
        console.log(res)
      }
    })
  }
})