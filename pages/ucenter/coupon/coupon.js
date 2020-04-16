var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');



var app = getApp();

Page({
    data: {
        couponList: null
    },
    onLoad: function(options) {
        this.loadListData()
    },

    loadListData: function() {
        let that = this;

        util.request(api.CouponList).then(function(res) {
            if (res.code === 200) {
                that.setData({
                    couponList: res.result
                });
            }
        });
    },

    onReady: function() {

    },
    onShow: function() {

    },
    onHide: function() {
        // 页面隐藏

    },
    onUnload: function() {
        // 页面关闭
    }
})