import util from './../../utils/util.js';
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    off:true,
    timer:null,
     currentPosition:0, //当前的时间
      duration : 0,
      s:0, //秒
      m: 0,  //分
      eleWidth:0,
      //红色盒子移动的距离 =  当前的时间 / 总时长 * 100
      curM:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app)
    var that=this;
    //把数数存到data里面
    var data = app.globalData.playlist;
    this.setData({
      musiclist: data,//歌曲的所有数据
      imgurl: 'http://y.gtimg.cn/music/photo_new/T002R150x150M000' + data.albummid + '.jpg'
    })
    wx.playBackgroundAudio({
      dataUrl: 'http://ws.stream.qqmusic.qq.com/C100' + data.songmid + '.m4a?fromtag=38'
    })

    this.musicStatus(); //播放的状态

    //歌词
    util.get_lyric(function(data){
      //过滤
      var re=/[^\u4e00-\u9fa5]/g; //找到中文

      var text= data.replace(re,"<br>"); 

      var text1 = text.replace(/<br>\s*(<br>\s*)+/g,'  '); //把多个br变成一个br

      var text2=text1.replace(/<br>+/g," ").split("  ");  //转化成数组

      that.setData({
        lyc:text2
      })
    });
  },
  musicStatus:function(){
    var that=this;
    //获取音乐播放的状态
    this.data.timer=setInterval(function(){
      wx.getBackgroundAudioPlayerState({
          success: function(res) {
            var m=Math.floor(res.duration / 60);
            var curM=Math.floor(res.currentPosition / 60);

            console.log(Math.floor(res.duration % 60))
            that.setData({
              currentPosition:Math.floor(res.currentPosition), //当前的时间
              duration : Math.floor(res.duration),
              s: Math.floor(res.duration % 60), //秒
              m: m,  //分
              eleWidth:res.currentPosition /  res.duration * 100,
              //红色盒子移动的距离 =  当前的时间 / 总时长 * 100
              curM:curM
            })
          }
      })
    },1000)
  },
  //播放音乐
  playmusic:function(){
    var off = !this.data.off;
    var data = app.globalData.playlist;
    //console.log(off)
    this.setData({
      off: off
    })

    if(off){ //播放
      wx.playBackgroundAudio({
        dataUrl: 'http://ws.stream.qqmusic.qq.com/C100' + data.songmid + '.m4a?fromtag=38'
      })

      this.musicStatus();
    }
    else{
      wx.pauseBackgroundAudio();
      clearInterval(this.data.timer);
    }
  },
  //前进后退
  ctrplaymusic:function(ev){ //手指移动事件
    //移动的距离
    var eleWidth= ev.touches["0"].clientX - ev.target.offsetLeft;

    //屏幕的宽度
    var screenX = wx.getSystemInfoSync().screenWidth

    //bar(蓝色)的宽度 
    var barWidth = screenX - ev.target.offsetLeft * 2;

    if(eleWidth >=barWidth ){
      eleWidth=100;
    }

    this.setData({
      eleWidth:eleWidth / barWidth * 100,   //红色盒子移动的距离
      endX:eleWidth / barWidth *  this.data.duration
    })
    //console.log(111)

  },
  moveEnd:function(){
    //前进后退
    var that=this;
    wx.seekBackgroundAudio({
      position: that.data.endX, //这个是 秒
      success:function(){
        console.log(1)
      }
    })
  }
})