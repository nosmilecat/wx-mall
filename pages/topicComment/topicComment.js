var app = getApp();
var util = require('../../utils/util.js');

var api = require('../../config/api.js');

Page({
    data: {
        comments: [],
        allCommentList: [],
        picCommentList: [],
        typeId: 0,
        valueId: 0,
        showType: 0,
        allCount: 0,
        hasPicCount: 0,
        allPage: 1,
        picPage: 1,
        size: 20
    },
    getCommentCount: function() {
        let that = this;
        util.request(api.CommentCount, { valueId: that.data.valueId, typeId: that.data.typeId }).then(function(res) {
            if (res.code === 200) {

                that.setData({
                    allCount: res.result.allCount,
                    hasPicCount: res.result.hasPicCount
                });
            }
        });
    },
    getCommentList: function() {
        let that = this;
        util.request(api.CommentList, {
            valueId: that.data.valueId,
            typeId: that.data.typeId,
            size: that.data.size,
            page: (that.data.showType == 0 ? that.data.allPage : that.data.picPage),
            showType: that.data.showType
        }).then(function(res) {
            if (res.code === 200) {

                if (that.data.showType == 0) {
                    that.setData({
                        allCommentList: that.data.allCommentList.concat(res.result.data),
                        allPage: res.result.currentPage,
                        comments: that.data.allCommentList.concat(res.result.data)
                    });
                } else {
                    that.setData({
                        picCommentList: that.data.picCommentList.concat(res.result.data),
                        picPage: res.result.currentPage,
                        comments: that.data.picCommentList.concat(res.result.data)
                    });
                }
            }
        });
    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        this.setData({
            typeId: options.typeId,
            valueId: options.valueId
        });
        this.getCommentCount();
        this.getCommentList();
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

    },
    switchTab: function() {
        this.setData({
            showType: this.data.showType == 1 ? 0 : 1
        });

        this.getCommentList();
    },
    onReachBottom: function() {
        if (this.data.showType == 0) {

            if (this.data.allCount / this.data.size < this.data.allPage) {
                return false;
            }

            this.setData({
                'allPage': this.data.allPage + 1
            });
        } else {
            if (this.data.hasPicCount / this.data.size < this.data.picPage) {
                return false;
            }

            this.setData({
                'picPage': this.data.picPage + 1
            });
        }



        this.getCommentList();
    }
})