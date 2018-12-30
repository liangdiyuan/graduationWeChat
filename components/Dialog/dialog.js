// components/Dialog/dialog.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    list:{
      type: Array,
      value: [],
    },
    title:{
      type: String,
      value: "",
    },
    showdialog:{
      type:Boolean,
      value: false,
    },

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
    radioChange(e){
      console.log(e.detail.value);
      this.triggerEvent("change", e.detail)
    }
  }
})
