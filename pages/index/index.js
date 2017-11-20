import util from './../../utils/util.js';
var app=getApp(); //获取一个app实例

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav:["推荐","排行榜","搜索"],
    imgPath: ["images/icon-music.png"],
    curNum:0,
    searchstort: [],  //搜索记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app)
    var that = this;
    

     //获取搜索记录
    wx.getStorage({
      key: 'task',
      success: function (res) {
       //console.log(res)
       that.setData({
         searchstort:res.data
       })
      }
    })

    
    //推荐
    util.get_index_data(function(res){
      var data=res.data.data; //取到首页数据
      that.setData({
        indexdata:data
      })
    })

    //排行榜
    util.get_toplist(function(res){
      //console.log(res)
      let data = res.data.topList;
      that.setData({
        topList: data
      })
    })

    //热门搜索
    util.get_hot_key(function(res){
      that.setData({
        searchHotKey:res
      })
    })
    console.log(this)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  //导航条
  tabnav:function(ev){
    let index= ev.currentTarget.dataset.navindex
    this.setData({
      curNum:index
    })
  },
  getsearchVal:function(ev){
    this.setData({
      serchVal: ev.detail.value
    })
  },
  searchSubmit:function(){ //搜索点击完成触发
    //console.log(1)
    //调用搜索接口
    var that=this;
    var value = this.data.serchVal;
    util.get_search_result(value,1,function(res){
      //console.log(res)
      that.setData({
        searchList:res.data.song.list  //搜索结果
      })
    })
    
    //搜索记录
    var arr=this.data.searchstort;
    arr.push(value)
    wx.setStorage({
      key: "task",
      data: arr
    })
  },
  //获取焦点显示 搜索记录
  getfoucus:function(){
    this.setData({
      foucus:true
    })
  },
  //删除 搜索记录
  clolseStore:function(ev){
    //1.删除  this.data.searchstort  第几个
    //2. 存到 storeage里面
    //3.更新 搜索记录
    var that=this;
    var id = ev.currentTarget.dataset.storeid;
    this.data.searchstort.splice(id, 1);

    wx.setStorage({
      key: "task",
      data: this.data.searchstort,
    })

    that.setData({
      searchstort: this.data.searchstort
    })
    
    
  },
  //找开播放页面
  openPlaysong:function(ev){
    //1.获取id
    var id = ev.currentTarget.dataset.playid;
    //2.把当前的 存到app里面
    app.globalData.playlist = this.data.searchList[id]
    wx.navigateTo({
      url: '/pages/playsong/playsong'
    })
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
    
  }
})