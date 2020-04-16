var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();
Page({
    data: {
        brandList: [],
        current: 1,
        size: 10,
        total: 1
    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        this.getBrandList();
    },
    getBrandList: function() {
        wx.showLoading({
            title: '加载中...',
        });
        let that = this;
        util.request(api.BrandList, { current: that.data.current, size: that.data.size }).then(function(res) {
            if (res.code === 200) {
                that.setData({
                    brandList: that.data.brandList.concat(res.result.rows),
                    total: res.result.total
                });
            }
            wx.hideLoading();
        });
    },
    onReachBottom() {
        if (this.data.total / this.data.size > this.data.current) {
            this.setData({
                current: this.data.current + 1
            });
        } else {
            return false;
        }

        this.getBrandList();
    },
    onReady: function() {

    },
    onShow: function() {
        // 页面显示

    },
    onHide: function() {
        // 页面隐藏

    },
    onUnload: function() {
        // 页面关闭

    }
})