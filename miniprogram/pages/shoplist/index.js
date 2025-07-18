Page({
  data: {
    shopList: []
  },
  onLoad() {
    this.loadShops();
  },
  onShow() {
    this.loadShops();
  },
  loadShops() {
    const shops = wx.getStorageSync('shopList') || [];
    // 为每个店铺分配一个随机色
    const colorList = [
      '#8D6E63', '#B2DFDB', '#FFD54F', '#A8CABA', '#90CAF9', '#FFB300', '#4CAF50', '#E57373', '#BA68C8', '#F06292'
    ];
    const imgList = [
      'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=400',
      'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&w=400',
      'https://images.pexels.com/photos/2092903/pexels-photo-2092903.jpeg?auto=compress&w=400',
      'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&w=400',
      'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=400'
    ];
    const addrList = [
      '市中心路88号', '阳光广场B1', '湖畔街12号', '文艺路66号', 'CBD咖啡城3F'
    ];
    const timeList = [
      '08:00-20:00', '09:00-22:00', '10:00-18:00', '07:30-19:30', '11:00-23:00'
    ];
    shops.forEach((shop, idx) => {
      shop._color = colorList[idx % colorList.length];
      // 自动生成logo（首字母大写）
      if (!shop.logo) {
        shop.logo = shop.name ? shop.name[0].toUpperCase() : '店';
      }
      // 自动生成标签
      if (!shop.tags) {
        const tagList = [['咖啡','甜品'], ['下午茶','饮品'], ['蛋糕','饼干'], ['茶饮','休闲']];
        shop.tags = tagList[idx % tagList.length];
      }
      if (!shop.img) {
        shop.img = imgList[idx % imgList.length];
      }
      if (!shop.address) {
        shop.address = addrList[idx % addrList.length];
      }
      if (!shop.time) {
        shop.time = timeList[idx % timeList.length];
      }
    });
    this.setData({ shopList: shops });
  },
  onSelectShop(e) {
    const shopId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/turntable/index?shopId=${shopId}`
    });
  },
  onEditShop(e) {
    const shopId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/shopadmin/index?shopId=${shopId}`
    });
  },
  onAddTestShop() {
    let shops = wx.getStorageSync('shopList') || [];
    const newId = (shops.length + 1).toString();
    shops.push({
      id: newId,
      name: `测试店铺${newId}`,
      desc: '这是一个用于测试的店铺',
      foods: []
    });
    wx.setStorageSync('shopList', shops);
    this.loadShops();
  }
});