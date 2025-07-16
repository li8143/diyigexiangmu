Page({
  data: {
    shop: {}
  },
  onLoad(options) {
    this.shopId = options.shopId;
    this.refreshShop();
  },
  onShow() {
    this.refreshShop();
  },
  refreshShop() {
    const shopList = wx.getStorageSync('shopList') || [];
    const shop = shopList.find(s => s.id === this.shopId) || shopList[0] || {};
    this.setData({ shop });
  },
  onEditShop() {
    wx.navigateTo({
      url: `/pages/shopadmin/index?shopId=${this.shopId || this.data.shop.id || ''}`
    });
  },
  onGoHome() {
    wx.reLaunch({ url: '/pages/index/index' });
  }
}); 