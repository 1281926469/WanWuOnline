const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceList: [],
    beginpos: 0,
    chargeArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.platformCharge();
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
  platformCharge() {
    const that = this
    const url = 'https://litin.gmiot.net/1/carol-pay'
    let params = {
      method: 'renewDevList',
      beginpos: this.data.beginpos,
      pagesize: 100,
      access_token: app.globalData.accessToken,
      access_type: 'inner'
    }
    wx.request({
      url: url,
      data: params,
      success: function (res) {
        if (res.data.errcode === 0) {         
          let arr = that.data.deviceList.concat(res.data.data);
          that.setData({
            deviceList: arr
          })
          if (res.data.data.length == 100) {
            that.setData({
              beginpos: that.data.beginpos+100
            })
            that.platformCharge();
          }
        } else {
          wx.showToast({
            title: '获取充值信息失败',
            icon: 'none'
          })
        }
      }
    })
  },
  radioChange (e) {
    console.log(e)
  },
  initPayment(e) {
    let obj = e.currentTarget.dataset;
    const that = this
    const url = 'https://litin.gmiot.net/1/carol-pay'
    let data = {
      method: 'renewOrder',
      imei: obj.imei,
      fee_type: 6, // 6 代表万物在线小程序
      amount: obj.amount,
      pay_plat: 1,
      pay_manner: 2,
      access_token: app.globalData.accessToken,
      uid: obj.uid,
      access_type: 'inner',
      open_id: app.globalData.openId
    }
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        if (res.data.errcode == 0) {
          that.checkPayment(res.data.data)
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
        wx.showToast({
          title: '充值成功',
          icon: 'none'
        })
        that.platformCharge();
      },
      fail(res) {
        console.log('失败')
        console.log(res)
      }
    })
  }
})