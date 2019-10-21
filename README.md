# 项目使用说明
本项目是深圳市谷米万物科技有限公司自主研发的万物在线小程序源码采用BSD许可协议。任何企业和个人都可以下载、或者修改后使用。项目基于微信开发，为使其能工作, 需要将修改project.config.json 中的下面两行:
    
    "appid": "XXXXXXXXXXXXXXXXXXX",   
    "projectname": "%E4%B8%87%E7%89%A9%E5%9C%A8%E7%BA%BF",

这两行为微信中对应的appid及小程序名称，需要在[微信小程序公众平台](https://mp.weixin.qq.com/cgi-bin/wx)注册，(注:"%E4%B8%87%E7%89%A9%E5%9C%A8%E7%BA%BF" 是"万物在线" 的url编码, 如果使用了自已的名称, 请找一个在线转码工具转码, 比如http://tool.chinaz.com/Tools/urlencode.aspx)。  
申请到appid以后请把appid和appsecrect发送给我司在后台配置方可正常使用。

服务器域名：  
https://litapi.gmiot.net  
https://litapi.gpsoo.net  
https://litin.gmiot.net  
https://litin.gpsoo.net  
https://weixin.gmiot.net  
https://weixin.gpsoo.net  

downloadFile合法域名：  
https://s3.gpsoo.net

业务域名：  
https://bussem.gpsoo.net  

[后台接口文档](http://www.gpsoo.net/open/v1.0/dataApi.html)  


    
由于微信的限制
1. 申请到appid以后请联系我司在后台配置，配置完成后，谷米会针对每个appid提供一个字符串，在loginByWechat与getWxOpenId两个接口请求数据时，需将提供的字符串添加到source参数里面，方可正常使用登录与扫码等功能。
2. 如果微信使用了源码扫描, 不允许布署两套代码相同的小程序, 请自行修改，修改过程中请遵循BSD协议:  
    a. 保留LICENSE文件及其中的版权信息。    
    b. 在小程序入口处注明："**本程序由谷米万物科技有限公司提供技术支持**"  

# 联系方式 #

咨询：13163728602

咨询：18038091443

咨询：0755-86638229

QQ：800014700
    


