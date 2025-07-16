// index.js
// 设置支持的商家邀请码
const INVITE_CODES = ['coffee2024', '1511'];

Page({
  data: {
    showTip: false,
    powerList: [
      {
        title: '云托管',
        tip: '不限语言的全托管容器服务',
        showItem: false,
        item: [
          {
            type: 'cloudbaserun',
            title: '云托管调用',
          },
        ],
      },
      {
        title: '云函数',
        tip: '安全、免鉴权运行业务代码',
        showItem: false,
        item: [
          {
            type: 'getOpenId',
            title: '获取OpenId',
          },
          {
            type: 'getMiniProgramCode',
            title: '生成小程序码',
          },
        ],
      },
      {
        title: '数据库',
        tip: '安全稳定的文档型数据库',
        showItem: false,
        item: [
          {
            type: 'createCollection',
            title: '创建集合',
          },
          {
            type: 'selectRecord',
            title: '增删改查记录',
          },
          // {
          //   title: '聚合操作',
          //   page: 'sumRecord',
          // },
        ],
      },
      {
        title: '云存储',
        tip: '自带CDN加速文件存储',
        showItem: false,
        item: [
          {
            type: 'uploadFile',
            title: '上传文件',
          },
        ],
      },
      // {
      //   type: 'singleTemplate',
      //   title: '云模板',
      //   tip: '基于页面模板，快速配置、搭建小程序页面',
      //   tag: 'new',
      // },
      // {
      //   type: 'cloudBackend',
      //   title: '云后台',
      //   tip: '开箱即用的小程序后台管理系统',
      // },
      {
        title: '拓展能力-AI',
        tip: '云开发 AI 拓展能力',
        showItem: false,
        item: [
          {
            type: 'model-guide',
            title: '大模型对话指引'
          },
        ],
      },
    ],
    haveCreateCollection: false,
    title: "",
    content: "",
    loading: true,
    shopList: [],
    errorMsg: '',
    showInviteModal: false,
    inviteCodeInput: '',
    inviteError: ''
  },
  onLoad() {
    this.initDefaultShopIfNeeded();
    this.loadShops();
  },
  // 初始化默认店铺和美食
  initDefaultShopIfNeeded() {
    const shops = wx.getStorageSync('shopList');
    if (!shops || !Array.isArray(shops) || shops.length === 0) {
      const defaultShop = {
        id: '1',
        name: '美食广场',
        desc: '各类美食任你选',
        foods: [
          { name: '红烧肉', img: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=400', desc: '肥而不腻，入口即化。' },
          { name: '宫保鸡丁', img: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&w=400', desc: '酸甜微辣，经典川菜。' },
          { name: '麻辣香锅', img: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=400', desc: '麻辣鲜香，食材丰富。' },
          { name: '鱼香肉丝', img: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&w=400', desc: '咸甜适口，色香味俱全。' },
          { name: '水煮牛肉', img: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=400', desc: '麻辣鲜香，牛肉滑嫩。' }
        ]
      };
      wx.setStorageSync('shopList', [defaultShop]);
    }
  },
  loadShops() {
    // 读取本地存储的店铺数据
    const shops = wx.getStorageSync('shopList') || [];
    setTimeout(() => {
      this.setData({ shopList: shops, loading: false });
      // 注释掉自动跳转逻辑，首页停留在角色选择页
      // wx.redirectTo({ url: '/pages/shoplist/index' });
    }, 300);
  },
  handleShopRoute() {
    const { shopList } = this.data;
    if (!shopList || shopList.length === 0) {
      this.setData({ errorMsg: '暂无可用店铺，请稍后再试。' });
      return;
    }
    if (shopList.length === 1) {
      // 只有一家店铺，自动进入转盘页
      wx.redirectTo({
        url: `/pages/turntable/index?shopId=${shopList[0].id}`
      });
    } else {
      // 多家店铺，进入店铺选择页
      wx.redirectTo({
        url: '/pages/shoplist/index'
      });
    }
  },
  onClickPowerInfo(e) {
    const app = getApp()
    if(!app.globalData.env) {
      wx.showModal({
        title: '提示',
        content: '请在 `miniprogram/app.js` 中正确配置 `env` 参数'
      })
      return 
    }
    console.log("click e", e)
    const index = e.currentTarget.dataset.index;
    const powerList = this.data.powerList;
    const selectedItem = powerList[index];
    console.log("selectedItem", selectedItem)
    if (selectedItem.link) {
      wx.navigateTo({
        url: `../web/index?url=${selectedItem.link}&title=${selectedItem.title}`,
      });
    } else if (selectedItem.type) {
      console.log("selectedItem", selectedItem)
      wx.navigateTo({
        url: `/pages/example/index?envId=${this.data.selectedEnv?.envId}&type=${selectedItem.type}`,
      });
    } else if (selectedItem.page) {
      wx.navigateTo({
        url: `/pages/${selectedItem.page}/index`,
      });
    } else if (
      selectedItem.title === '数据库' &&
      !this.data.haveCreateCollection
    ) {
      this.onClickDatabase(powerList,selectedItem);
    } else {
      selectedItem.showItem = !selectedItem.showItem;
      this.setData({
        powerList,
      });
    }
  },

  jumpPage(e) {
    const { type, page } = e.currentTarget.dataset;
    console.log("jump page", type, page)
    if (type) {
      wx.navigateTo({
        url: `/pages/example/index?envId=${this.data.selectedEnv?.envId}&type=${type}`,
      });
    } else {
      wx.navigateTo({
        url: `/pages/${page}/index?envId=${this.data.selectedEnv?.envId}`,
      });
    }
  },

  onClickDatabase(powerList,selectedItem) {
    wx.showLoading({
      title: '',
    });
    wx.cloud
      .callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'createCollection',
        },
      })
      .then((resp) => {
        if (resp.result.success) {
          this.setData({
            haveCreateCollection: true,
          });
        }
        selectedItem.showItem = !selectedItem.showItem;
        this.setData({
          powerList,
        });
        wx.hideLoading();
      })
      .catch((e) => {
        wx.hideLoading();
        const { errCode, errMsg } = e
        if (errMsg.includes('Environment not found')) {
          this.setData({
            showTip: true,
            title: "云开发环境未找到",
            content: "如果已经开通云开发，请检查环境ID与 `miniprogram/app.js` 中的 `env` 参数是否一致。"
          });
          return
        }
        if (errMsg.includes('FunctionName parameter could not be found')) {
          this.setData({
            showTip: true,
            title: "请上传云函数",
            content: "在'cloudfunctions/quickstartFunctions'目录右键，选择【上传并部署-云端安装依赖】，等待云函数上传完成后重试。"
          });
          return
        }
      });
  },
  onUserEnter() {
    wx.redirectTo({ url: '/pages/shoplist/index' });
  },
  onMerchantEnter() {
    this.setData({ showInviteModal: true, inviteCodeInput: '', inviteError: '' });
  },
  onInviteInput(e) {
    this.setData({ inviteCodeInput: e.detail.value, inviteError: '' });
  },
  onInviteCancel() {
    this.setData({ showInviteModal: false, inviteCodeInput: '', inviteError: '' });
  },
  onInviteOk() {
    const code = this.data.inviteCodeInput.trim();
    if (INVITE_CODES.includes(code)) {
      this.setData({ showInviteModal: false, inviteCodeInput: '', inviteError: '' });
      wx.redirectTo({ url: '/pages/shoplist/index' });
    } else {
      this.setData({ inviteError: '邀请码错误，请重试' });
    }
  },
});
