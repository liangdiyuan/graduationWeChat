// components/Button/buttons.js
Component({

  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    showupper: {
      type: Boolean,
      value: true,
    },
    showlower: {
      type: Boolean,
      value: true,
    },
    upper:{
      type: String,
      value: "上一页",
    },
    lower:{
      type: String,
      value: "下一页",
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    _upper: function () {
      this.triggerEvent("upper")
    },
    _lower: function () {
      this.triggerEvent("lower")
    }
  }
})
