// pages/playback/playback.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mapHeight: "300px",
    beginTime: '',
    endTime: '',
    needMoreData: false,
    currentDate: '0000-00-00',
    currentTime: '00:00:00',
    curretSpeed: 0,
    currentLatitude: 0,
    currentLongitude: 0,
    totalDistance: 0,
    totalDistanceFixed: 0.00,
    sliderValue: 0,
    image: 'pause',
    timer: 0,
    runTime: '',
    totalTime: '',
    playIndex: 0,
    playData: [],
    timer1: '',
    timer2: '',
    fragmentArr: [],
    
    markers: [{
      id: 0,
      latitude: 22.111111,
      longitude: 113.957654,
      iconPath: '../images/marker.png',
      width: 30,
      height: 30,
      anchor:{x:.5, y:.5}
    }],
    polyline: [{
        points: [],
        color: "#22262DFF",
        width: 4,
        dottedLine: false
    }],
    imei: 0,
    frequency: 500,
    currentWholeData: [],
    marker: {
     
    },
    wholeIndex: 0,
    lastPoint: '',
    startPoint: '',
    newStartTime: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: app.globalData.appTheme.theme_color.color_whole
    })
    this.setData({
      beginTime: options.startDate,
      endTime: options.endDate,
      imei: options.imei,
      min: options.startDate,
      max:options.endDate,
      totalTime: this.getTotalTime( options.endDate,options.startDate )
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          mapHeight: (res.windowHeight - 100) + "px"
 
        })
        that.sendRequest1(that.data.beginTime, that.data.endTime)
      }
    })
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
    if (this.data.timer1) {
      clearTimeout(this.data.timer1);
    }
    if (this.data.timer2) {
      clearTimeout(this.data.timer2);
    }
    wx.redirectTo({
      url: './../monitor/monitor'
    })
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
    return {
      title: '数化万物 智在融合',
      path: 'pages/authorize/authorize',
      imageUrl: '../images/forward.jpg'
    }
  },
  slider3change(e) {
    
  },
  markerVisible () {
    const that = this
    let map = wx.createMapContext('playback')
    map.getRegion({
      success: function(res) {
        let location = {
          longitude: that.data.markers[0].longitude,
          latitude: that.data.markers[0].latitude
        }
        let moveMap = res.southwest.longitude > location.longitude || res.southwest.latitude > location.latitude || res.northeast.longitude < location.longitude || res.northeast.latitude < location.latitude
        if (moveMap) {
          that.setData({
            currentLongitude: location.longitude,
            currentLatitude: location.latitude
          })
        }
      }
    })
  },
  getDistance(locationA, locationB) {
    let EARTH_RADIUS = 6378137
    let PI = Math.PI
    function getRad(d) {
      return d * PI / 180.0;
    }
    let radLatA = getRad(locationA.latitude);
    let radLatB = getRad(locationB.latitude);
    let a = radLatA - radLatB;
    let b = getRad(locationA.longitude) - getRad(locationB.longitude);
    let distance = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLatA) * Math.cos(radLatB) * Math.pow(Math.sin(b / 2), 2)));
    distance = distance * EARTH_RADIUS;
    distance = Math.round(distance * 10000) / 10000.0;
    return distance
  },
  getRunTime (beginPoint, endPoint) {
    let runTime = '';
    let timeGap = endPoint.gps_time - beginPoint.gps_time
    let hour = parseInt(timeGap / 3600)
    let minute = parseInt((timeGap % 3600) / 60)
    let second = timeGap % 60
    hour = hour >= 10 ? hour: '0' + hour
    minute = minute >= 10 ? minute : '0' + minute
    second = second >= 10 ? second: '0' + second
    runTime = hour + ':' + minute + ':' + second
    this.setData({
      runTime: runTime
    })
  },
  getTotalTime (endTime, beginTime) {
    // 1534349247 1534376833
    let totalTime = '';
    let timeGap = endTime - beginTime
    let hour = parseInt(timeGap / 3600)
    let minute = parseInt((timeGap % 3600) / 60)
    let second = timeGap % 60
    hour = hour >= 10 ? hour: '0' + hour
    minute = minute >= 10 ? minute : '0' + minute
    second = second >= 10 ? second: '0' + second
    totalTime = hour + ':' + minute + ':' + second
    return totalTime
  },
  getDate (timestamp) {
    let fullTimestamp = timestamp * 1000
    let year = new Date(fullTimestamp).getFullYear();
    let month = new Date(fullTimestamp).getMonth() + 1;
    let day = new Date(fullTimestamp).getDate()
    month = month >= 10 ? month : '0' + month
    day = day >= 10 ? day: '0' + day
    return year + '-' + month + '-' + day
  },
  getTime(timestamp) {
    let fullTimestamp = timestamp * 1000
    let hour = new Date(fullTimestamp).getHours();
    let minute = new Date(fullTimestamp).getMinutes();
    let second = new Date(fullTimestamp).getSeconds()
    minute = minute >=10 ? minute : '0' + minute
    second = second >=10 ? second : '0' + second
    return hour + ':' + minute + ':' + second
  },
  playAndPause () {
    if (this.data.image == 'pause') {
      this.setData({
        image: 'play'
      })
      if (this.data.timer1) {
        clearTimeout(this.data.timer1);
      }
      if (this.data.timer2) {
        clearTimeout(this.data.timer2);
      }
    } else {
      this.setData({
        image: 'pause'
      })
      if (this.data.timer1) {
        this.getFragmentData();
      }
      if (this.data.timer2) {
        this.moveMarker(this.data.fragmentArr, this.data.frequency, this.data.playIndex);
      }
    }
  },
  sendRequest1(beginTime, endTime) {
    const that = this
    wx.request({
      url: 'https://litin.gmiot.net/1/devices/history',
      data: {
        begin_time: beginTime,
        end_time: endTime,
        account: app.globalData.account,
        map_type: 'AMAP',
        access_type: 'inner',
        limit: 1000,
        access_token: app.globalData.accessToken,
        imei: this.data.imei,
        method: "getHistoryGpsLocation",
        appver: 1.0

      },
      success: function (res) {
        if (res.data.errcode === 0) {
          if (res.data.data.pos.length > 0) {
            let data = res.data.data;
            let needMoreData = (data.resEndTime - data.pos[data.pos.length - 1].gps_time) > 10
            that.setData({
              currentWholeData: data.pos,
              needMoreData: needMoreData,
              newStartTime: data.resEndTime,
              wholeIndex: 0        
            });
            that.getFragmentData();
          } else {
            wx.getLocation({
              type: 'gcj02',
              success: function (res) {
                that.setData({
                  currentLatitude: res.latitude,
                  currentLongitude: res.longitude,
                  sliderValue: endTime
                })
                wx.showToast({
                  title: '没有回放数据',
                  icon: 'none',
                  duration: 2000,
                  success: function (res) {
                    
                  }
                })
              }
            })
          }
        }
      }
    })
  },
  getFragmentData () {
    let {currentWholeData, wholeIndex,needMoreData } = this.data;
    let count = this.data.wholeIndex;
    let arr = [currentWholeData[count]];
    if ((currentWholeData.length - 1) === wholeIndex) {
      if (needMoreData) {
        this.sendRequest1(this.data.newStartTime, this.data.endTime);
      }
      return  
    }
    for (let i = (count+1); i < currentWholeData.length; i++) {
        if ((currentWholeData[i].gps_time - arr[0].gps_time) < 10) {
          arr.push(currentWholeData[i]);
        } else {
          this.setData({
            wholeIndex: i,
            fragmentArr: arr
          });
          break;
        }
    }
    this.moveMarker(arr, this.data.frequency / arr.length, 0);
  },
  moveMarker (points, frequency, count) {
    const that = this;
    let item = points[count]; 
    let {totalDistance, polyline} = this.data;
    let locationB = {
        longitude: item.lng,
        latitude: item.lat,
        gpsTime: item.gps_time
    }
    if (!that.data.startPoint) {
      that.data.startPoint = item;
    }
    if (this.data.lastPoint) {
      let locationA = {
        longitude: that.data.lastPoint.lng,
        latitude: that.data.lastPoint.lat,
        gpsTime: that.data.lastPoint.gps_time
      }
      let distance = that.getDistance(locationB, locationA) / 1000;
      totalDistance = totalDistance + distance;
      that.getRunTime(that.data.startPoint, item);
    }
    polyline[0].points.push(locationB);

    this.setData({
      totalDistance: totalDistance,
      totalDistanceFixed: totalDistance.toFixed(2),
      lastPoint: item,
      startPoint: that.data.startPoint,
      polyline: polyline,
      sliderValue: item.gps_time,
      currentDate: that.getDate(item.gps_time),
        currentTime: that.getTime(item.gps_time),
      "markers[0].latitude": item.lat,
      "markers[0].longitude": item.lng,
      "markers[0].rotate": item.course,
      curretSpeed: item.speed

    })


    that.markerVisible();
    if (count == (points.length -1)) {
      let timer1 = setTimeout(() => {
        this.getFragmentData();
      }, frequency)
      this.setData({
        timer1,
        timer2: ''
      })
    } else {
      let newCount = count + 1
      let timer2 = setTimeout(() => {
        this.moveMarker(points, frequency, newCount);
      }, frequency)
      this.setData({
        timer1: '',
        timer2,
        playIndex: newCount
      })
    }
  }
})