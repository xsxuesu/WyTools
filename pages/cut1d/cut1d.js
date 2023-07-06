// pages/cut1d/cut1d.js
import cax from '../../components/cax/index';
import {
  stock1DbyLen,
  stock1DByWeight
} from "../../api/apis";

Page({
  data: {
    backTopTheme: 'round',
    backTopText: '顶部',
    orderLinesData: {
      columns: [{
          key: 'product_name',
          title: '货物名称',
          width: 500
        },
        {
          key: 'measureunit_label',
          title: '计量单位'
        },
        {
          key: 'qty',
          title: '运输数量'
        },
        {
          key: 'pallet_qty',
          title: '托盘数'
        },
        {
          key: 'box_qty',
          title: '箱数'
        },
        {
          key: 'weight',
          title: '总重量'
        },
        {
          key: 'volume',
          title: '总体积'
        },
        {
          key: 'rate_weight',
          title: '计费重量'
        },
        {
          key: 'rate_volume',
          title: '计费体积'
        },
        {
          key: 'cargo_value',
          title: '总货值'
        },
        {
          key: 'heavyorbulky_label',
          title: '重抛货'
        },
        {
          key: 'currency_name',
          title: '币种'
        }
      ],
      data: []
    },
    mode_data: {
      childs: [{
        width: "",
        quantity: "",
        weight: ""
      }, ],
      parents: [{
        width: "",
        quantity: "",
        weight: ""
      }],
      result: null,
      childs_for_select: null,
    },
    cutWidth: 0,
    side: 0,
    percent: 99
  },
  parentAdd(e) {
    this.data.mode_data.parents.push({
      width: "",
      quantity: "",
      weight: ""
    });
    this.setData({
      "mode_data.parents": this.data.mode_data.parents
    })
  },
  onToTop(e) {
    console.log('backToTop', e);
  },
  parentReduce(e) {
    console.log(e);
    if (this.data.mode_data.parents.length > 1) {
      const index = this.data.mode_data.parents.length - 1;
      this.data.mode_data.parents.splice(index, 1);
      this.setData({
        "mode_data.parents": this.data.mode_data.parents
      })
    }

  },
  childAdd(e) {
    this.data.mode_data.childs.push({
      width: "",
      quantity: "",
      weight: ""
    });
    this.setData({
      "mode_data.childs": this.data.mode_data.childs
    })
  },
  childReduce(e) {
    if (this.data.mode_data.childs.length > 1) {
      const index = this.data.mode_data.childs.length - 1;
      this.data.mode_data.childs.splice(index, 1);
      this.setData({
        "mode_data.childs": this.data.mode_data.childs
      })
    }

  },
  handleInputChange(e) {
    // 取出实时的变量值
    let value = e.detail.value;
    let fieldName = e.target.dataset.fieldName;
    this.setData({
      [`${fieldName}`]: value
    });
  },

  calcuStockByLen(e) {
    console.log(e);
    let prepareData = this.prepareDataToSend1DForRule();
    stock1DbyLen(prepareData).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    });
  },

  calcuStockByWeight(e) {
    console.log(e);
    let prepareData = this.prepareDataToSend1DForWeight();
    stock1DByWeight(prepareData).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    });
  },
  prepareDataToSend1DForRule() {
    let newChilds = [];
    this.data.mode_data.childs.forEach((child) => {
      if (isNaN(parseInt(parseFloat(child.width))) == true) {
        wx.showToast({
          title: "分条数据有误",
          mask: true,
          icon: "error"
        });
        return
      }
      newChilds.push({
        "width": parseInt(parseFloat(child.width) * 1000)
      });
    });

    let newParents = [];
    this.data.mode_data.parents.forEach((parent) => {
      if (isNaN(parseInt(parseFloat(parent.width))) == true) {
        wx.showToast({
          title: "母卷数据有误",
          mask: true,
          icon: "error"
        });
        return
      }

      let worst_weight = Math.round((parseFloat(this.data.side) / parseFloat(parent.width)) * (parseFloat(parent.weight) * 1000));
      newParents.push({
        "quantity": parseInt(parent.quantity),
        "width": parseInt(parseFloat(parent.width) * 1000),
        "weight": parseInt(parseFloat(parent.weight) * 1000 - worst_weight)
      });
    });

    return {
      child_rolls: newChilds,
      parent_rolls: newParents,
      side: parseInt(parseFloat(this.data.cutWidth) * 1000),
      out_side: parseInt(parseFloat(this.data.side) * 1000),
      seed: Math.round(Math.random() * 10),
      percent: this.data.percent,
    };
  },
  prepareDataToSend1DForWeight: function () {
    let newChilds = [];
    this.data.mode_data.childs.forEach((child) => {
      newChilds.push({
        "quantity": parseInt(child.quantity),
        "width": parseInt(parseFloat(child.width) * 1000)
      });
    });

    let newParents = [];
    this.data.mode_data.parents.forEach((parent) => {
      let worst_weight = Math.round((parseFloat(this.data.side) / parseFloat(parent.width)) * (parseFloat(parent.weight) * 1000));
      newParents.push({
        "quantity": parseInt(parent.quantity),
        "width": parseFloat(parent.width) * 1000,
        "weight": parseInt(parseFloat(parent.weight) * 1000 - worst_weight)
      });
    });

    return {
      child_rolls: newChilds,
      parent_rolls: newParents,
      side: parseInt(parseFloat(this.data.cutWidth) * 1000),
      out_side: parseInt(parseFloat(this.data.side) * 1000),
      seed: Math.round(Math.random() * 10)
    };
  },
  methods: {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log(cax);
    // const info = wx.getSystemInfoSync()
    // const stage = new cax.Stage(info.windowWidth, 50, 'myCanvas', this)
    // const graphics = new cax.Graphics();
    // graphics
    //     .beginPath()
    //     .arc(0, 0, 10, 0, Math.PI * 2)
    //     .closePath()
    //     .fillStyle('#333333')
    //     .fill()
    //     .strokeStyle('black')
    //     .stroke();
    // graphics.x = 0;
    // graphics.y = 0;
    // stage.add(graphics)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    const query = wx.createSelectorQuery()
    query.select('#myCanvas')
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')

        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)

        ctx.fillRect(0, 0, 100, 100)
      })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})