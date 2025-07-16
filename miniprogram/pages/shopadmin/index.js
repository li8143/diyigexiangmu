Page({
  data: {
    shop: {}
  },
  onLoad(options) {
    const shops = wx.getStorageSync('shopList') || [];
    let shop = shops[0] || {};
    if (options.shopId) {
      shop = shops.find(s => s.id === options.shopId) || shop;
    }
    this.setData({ shop });
    this.shopId = options.shopId || shop.id; // 记录当前编辑的shopId
  },
  onChooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({ 'shop.img': res.tempFilePaths[0] });
      }
    });
  },
  onInputName(e) {
    this.setData({ 'shop.name': e.detail.value });
  },
  onInputDesc(e) {
    this.setData({ 'shop.desc': e.detail.value });
  },
  onInputAddress(e) {
    this.setData({ 'shop.address': e.detail.value });
  },
  onInputTime(e) {
    this.setData({ 'shop.time': e.detail.value });
  },
  onSaveShop() {
    let shops = wx.getStorageSync('shopList') || [];
    const idx = shops.findIndex(s => s.id === this.shopId);
    if (idx !== -1) {
      shops[idx] = this.data.shop;
      wx.setStorageSync('shopList', shops);
      wx.showToast({ title: '保存成功', icon: 'success' });
      setTimeout(() => {
        wx.navigateBack({ delta: 1 });
      }, 600);
    }
  }
});