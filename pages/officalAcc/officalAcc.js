const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
  wxLogin () {
    const that = this;
    wx.login({
      success: function (loginInfo) {
        wx.request({
          url: 'https://litin.gmiot.net/1/auth/access_token',
          data: {
            method: 'loginByWechat',
            wxcode: loginInfo.code,
            access_type: 'inner',
            source: ''  // 使用开源代码的用户，需要向谷米提供小程序appid申请对应source字符串验证
          },
          success: function (res) {
            if (res.data.errcode === 0) {
              app.globalData.account = res.data.data.account
              app.globalData.accessToken = res.data.data.access_token
              that.getWxOpenid();
            } else {
              wx.showModal({
                title: '登陆失败',
                content: res.data.errcode + '登陆失败,请检查您的网络设置，稍后重试'
              })
            }
          },
          fail: function (err) {
            wx.showModal({
              title: '登陆失败' + '(' + err + ')',
              content: '登陆失败,请检查您的网络设置，稍后重试'
            })
          }
        })
      },
      fail: function (err) {
        wx.showModal({
          title: '登陆微信失败' + '(' + err + ')',
          content: '登陆失败,请检查您的网络设置，稍后重试'
        })
      }
    })    
  },
  getWxOpenid () {
    const that = this;
    wx.login({
      success: function (login) {
        wx.request({
          url: 'https://litin.gmiot.net/1/auth/access_token',
          data: {
            method: 'getWxOpenid',
            wxcode: login.code,
            access_token: app.globalData.accessToken,
            source: ""  // 使用开源代码的用户，需要向谷米提供小程序appid申请对应source字符串验证
          },
          success: function (res) {
            if (res.data.errcode == 0) {
              app.globalData.openId = res.data.data.openid;
              that.bindAcc();
            } 
          }
        })
      }
    })
  },
  bindAcc () {
    wx.request({
      url: 'https://litin.gmiot.net/GetDataService?method=sendSubscribeWOALinkToMp&openid=' + app.globalData.openId + "&access_token=" + app.globalData.accessToken,
      success: function (res) {
        if (res.data.errcode != 0) {
          wx.showToast({
            title: '请重新点击',
            icon: 'none',
            duration: 1500
          })
        } else {
        }
      }
    })
  }
})