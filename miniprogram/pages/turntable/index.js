Page({
    data: {
      showResult: false,
      resultImg: '',
      resultName: '',
      resultDesc: '',
      foods: [],
      rotating: false,
      dpr: 1,
      shopInfo: null,
      loading: true,
      errorMsg: '',
      canvasSize: 300,
      highlightIndex: -1
    },
    onLoad(options) {
      const sysInfo = wx.getSystemInfoSync();
      const width = Math.min(sysInfo.windowWidth, 420); // 最大420px
      this.setData({ canvasSize: width });
      const shopId = options.shopId;
      this.loadShopData(shopId);
    },
    loadShopData(shopId) {
      const shopList = wx.getStorageSync('shopList') || [];
      const shop = shopList.find(s => s.id === shopId);
      if (!shop) {
        this.setData({ loading: false, errorMsg: '店铺不存在或已下架' });
        return;
      }
      if (!shop.foods || shop.foods.length === 0) {
        this.setData({ loading: false, errorMsg: '该店铺暂无美食，请稍后再试' });
        return;
      }
      this.setData({
        shopInfo: { name: shop.name, desc: shop.desc },
        foods: shop.foods,
        loading: false,
        errorMsg: ''
      });
      this.drawTurntable(0, -1);
    },
    easeOutQuad(t, b, c, d) {
      t /= d;
      return -c * t * (t - 2) + b;
    },
    drawTurntable(rotateDeg = 0, highlightIndex = -1) {
      const foods = this.data.foods;
      if (!foods || !foods.length) return;
      const size = this.data.canvasSize || 300;
      const ctx = wx.createCanvasContext('turntable', this);
      const num = foods.length;
      const angle = 2 * Math.PI / num;
      const colors = ['#FFD700', '#FF6347', '#90EE90', '#87CEFA', '#FFB6C1', '#FFA500', '#40E0D0', '#DDA0DD'];
      const highlightColor = '#FFF176';
      const radius = size / 2 - 20;
      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.rotate((rotateDeg - 90) * Math.PI / 180);
      for (let i = 0; i < num; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, i * angle, (i + 1) * angle);
        ctx.setFillStyle(i === highlightIndex ? highlightColor : colors[i % colors.length]);
        ctx.fill();
        ctx.closePath();
        // 计算文字在扇区中心的坐标
        const textRadius = radius * 0.6;
        const textAngle = i * angle + angle / 2;
        const x = textRadius * Math.cos(textAngle);
        const y = textRadius * Math.sin(textAngle);
        ctx.font = 'bold 16px PingFang SC, Microsoft YaHei, Arial, sans-serif';
        ctx.setFillStyle('#333');
        ctx.setFontSize(14);
        ctx.setTextAlign('center');
        ctx.setTextBaseline('middle');
        ctx.fillText(foods[i].name, x, y);
      }
      ctx.restore();
      // 指针（从圆心出发，顶点在圆盘外沿正上方）
      const pointerWidth = 28;
      const centerX = size / 2;
      const centerY = size / 2;
      const pointerTopY = centerY - radius; // 顶点正好在圆盘外沿
      ctx.beginPath();
      ctx.moveTo(centerX, pointerTopY); // 顶点
      ctx.lineTo(centerX - pointerWidth / 2, centerY); // 左底角
      ctx.lineTo(centerX + pointerWidth / 2, centerY); // 右底角
      ctx.closePath();
      ctx.setFillStyle('#FF0000');
      ctx.fill();
      ctx.draw();
    },
    onDrawTap() {
      if (this.data.rotating || !this.data.foods.length) return;
      this.setData({ rotating: true, highlightIndex: -1 });
      const foods = this.data.foods;
      const num = foods.length;
      const idx = Math.floor(Math.random() * num);
      const anglePer = 360 / num;
      const finalDeg = 360 * 6 + (360 - (idx + 0.5) * anglePer);
      let start = Date.now();
      let duration = 1800;
      let from = 0;
      let to = finalDeg;
      const animate = () => {
        let now = Date.now();
        let elapsed = now - start;
        if (elapsed < duration) {
          let deg = this.easeOutQuad(elapsed, from, to - from, duration);
          this.drawTurntable(deg, -1);
          setTimeout(animate, 16);
        } else {
          this.drawTurntable(to, idx);
          this.setData({
            showResult: true,
            resultImg: foods[idx].img,
            resultName: foods[idx].name,
            resultDesc: foods[idx].desc,
            rotating: false,
            highlightIndex: idx
          });
          // if (wx.vibrateShort) wx.vibrateShort(); // 中奖时震动反馈已注释
        }
      };
      animate();
    },
    onCloseResult() {
      this.setData({ showResult: false, highlightIndex: -1 });
      this.drawTurntable(0, -1);
    }
})