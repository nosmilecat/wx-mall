var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');

var app = getApp();

Page({
    data: {
        checkedGoodsList: [],
        checkedAddress: {},
        checkedCoupon: [],
        couponList: [],
        goodsTotalPrice: 0.00, //商品总价
        freightPrice: 0.00, //快递费
        couponPrice: 0.00, //优惠券的价格
        orderTotalPrice: 0.00, //订单总价
        actualPrice: 0.00, //实际需要支付的总价
        addressId: 0,
        couponId: 0,
        isBuy: false,
        couponDesc: '',
        couponCode: '',
        buyType: ''
    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        if (options.isBuy != null) {
            this.data.isBuy = options.isBuy
        }
        this.data.buyType = this.data.isBuy ? 'buy' : 'cart'
            //每次重新加载界面，清空数据
        app.globalData.userCoupon = 'NO_USE_COUPON'
        app.globalData.courseCouponCode = {}
    },

    getCheckoutInfo: function() {
        let that = this;
        let buyType = this.data.isBuy ? 'buy' : 'cart'
        var url = api.CartCheckout + `?couponId=${that.data.couponId}&type=${buyType}&addressId=${that.data.addressId}`
        util.request(url).then(function(res) {
            if (res.code === 200) {
                that.setData({
                    checkedGoodsList: res.result.checkedGoodsList,
                    checkedAddress: res.result.checkedAddress,
                    actualPrice: res.result.actualPrice,
                    checkedCoupon: res.result.checkedCoupon ? res.result.checkedCoupon : "",
                    couponList: res.result.couponList ? res.result.couponList : "",
                    couponPrice: res.result.couponPrice,
                    freightPrice: res.result.freightPrice,
                    goodsTotalPrice: res.result.goodsTotalPrice,
                    orderTotalPrice: res.result.orderTotalPrice
                });
                //设置默认收获地址
                if (that.data.checkedAddress.id) {
                    let addressId = that.data.checkedAddress.id;
                    if (addressId) {
                        that.setData({ addressId: addressId });
                    }
                } else {
                    wx.showModal({
                        title: '',
                        content: '请添加默认收货地址!',
                        success: function(res) {
                            if (res.confirm) {
                                that.selectAddress();
                            }
                        }
                    })
                }
            }
            wx.hideLoading();
        });
    },
    selectAddress() {
        wx.navigateTo({
            url: '/pages/shopping/address/address',
        })
    },
    addAddress() {
        wx.navigateTo({
            url: '/pages/shopping/addressAdd/addressAdd',
        })
    },
    onReady: function() {
        // 页面渲染完成

    },
    onShow: function() {
        this.getCouponData()
            // 页面显示
        wx.showLoading({
            title: '加载中...',
        })

        try {
            var addressId = wx.getStorageSync('addressId');
            if (addressId) {
                this.setData({
                    'addressId': addressId
                });
            }
        } catch (e) {
            // Do something when catch error
        }

        this.getCheckoutInfo();
    },

    /**
     * 获取优惠券
     */
    getCouponData: function() {
        if (app.globalData.userCoupon == 'USE_COUPON') {
            this.setData({
                couponDesc: app.globalData.courseCouponCode.name,
                couponId: app.globalData.courseCouponCode.user_coupon_id,
            })
        } else if (app.globalData.userCoupon == 'NO_USE_COUPON') {
            this.setData({
                couponDesc: "不使用优惠券",
                couponId: '',
            })
        }
    },

    onHide: function() {
        // 页面隐藏

    },
    onUnload: function() {
        // 页面关闭

    },

    /**
     * 选择可用优惠券
     */
    tapCoupon: function() {
        let that = this

        wx.navigateTo({
            url: '../selCoupon/selCoupon?buyType=' + that.data.buyType,
        })
    },

    submitOrder: function() {
        if (this.data.addressId <= 0) {
            util.showErrorToast('请选择收货地址');
            return false;
        }
        util.request(api.OrderSubmit, { addressId: this.data.addressId, couponId: this.data.couponId, type: this.data.buyType, postscript: '' }, 'POST', 'application/json').then(res => {
            if (res.code === 200) {
                const orderId = res.result.data.orderInfo.id;
                pay.payOrder(parseInt(orderId)).then(res => {
                    wx.redirectTo({
                        url: '/pages/payResult/payResult?status=1&orderId=' + orderId
                    });
                }).catch(res => {
                    wx.redirectTo({
                        url: '/pages/payResult/payResult?status=0&orderId=' + orderId
                    });
                });
            } else {
                util.showErrorToast('下单失败');
            }
        });
    }
})