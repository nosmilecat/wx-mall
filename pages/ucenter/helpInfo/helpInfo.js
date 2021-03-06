var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp()
    // pages/ucenter/help/help.js
Page({
    data: {
        helpIssueInfo: []
    },
    getHelpList(id) {
        let that = this;
        util.request(api.HelpIssueInfo, { id }).then(function(res) {
            if (res.code === 200) {
                that.setData({
                    helpIssueInfo: res.result
                })
            }
        });
    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        this.getHelpList(options.id)

    },
    onReady: function() {
        // 页面渲染完成
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