<!-- tsx基础设置 -->
<template>
  <div class="package">
    <div class="hide backtsx" style="flex-direction: column;">
      <div class="bothSides" style="width:100%">
        <span>平台抽成设置</span>
        <el-button
          type="primary"
          @click="(one = !one), one ? edit('type_one') : ''"
        >{{ one ? "编辑" : "保存" }}</el-button>
      </div>
      <div>
        <span>商品订单</span>
        <el-input-number
          size="mini"
          :min="0"
          :disabled="one"
          :max="100"
          v-model="product_order_scale"
        ></el-input-number>%
        <span style="margin-left: 30px;">外卖订单</span>
        <el-input-number
          size="mini"
          :min="0"
          :disabled="one"
          :max="100"
          v-model="waimai_order_scale"
        ></el-input-number>%
      </div>
      <div class="colorfontsiz">平台抽成更新后的订单按最新的抽成数据计算</div>
    </div>
    <div class="hide backtsx" style="flex-direction: column;">
      <div class="bothSides" style="width:100%">
        <span>外卖订单提成设置</span>
        <el-button
          type="primary"
          @click="(two = !two), two ? edit('type_two') : ''"
        >{{ two ? "编辑" : "保存" }}</el-button>
      </div>
      <div>
        <span>区县代理商</span>
        <el-input-number
          size="mini"
          :min="0"
          :max="100"
          :disabled="two"
          v-model="waimai_order_agent_scale"
        ></el-input-number>%
      </div>
      <div class="colorfontsiz">平台抽成更新后的订单按最新的抽成数据计算</div>
    </div>
    <div class="hide backtsx" style="flex-direction: column;">
      <div class="bothSides" style="width:100%">
        <span>平台商品订单提成</span>
        <el-button type="primary" @click="(three = !three), three ? edit('type_three') : ''">编辑</el-button>
      </div>
      <div>
        <span>区县代理商</span>
        <el-input-number
          size="mini"
          :min="0"
          :max="100"
          :disabled="three"
          v-model="product_order_agent_scale"
        ></el-input-number>%
      </div>
      <div class="colorfontsiz">平台抽成更新后的订单按最新的抽成数据计算</div>
    </div>
    <div class="hide backtsx" style="flex-direction: column;">
      <p>操作日志</p>
      <OperationLog :type="1" />
    </div>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { agentBase } from "@/api/agent";
import OperationLog from "@/components/OperationLog";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { OperationLog },
  data() {
    // 这里存放数据
    return {
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      keyword: "",
      datalist: [],
      multipleSelection: [],
      loading: false,
      agent: [],
      agent_id: "0",
      product_order_scale: "",
      waimai_order_scale: "",
      waimai_order_agent_scale: "",
      product_order_agent_scale: "",
      one: true,
      two: true,
      three: true
    };
  },
  // 过滤器
  filters: {},
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    edit(val) {
      let data = {};
      switch (val) {
        case "type_one":
          data = JSON.stringify({
            product_order_scale: this.product_order_scale,
            waimai_order_scale: this.waimai_order_scale
          });
          break;
        case "type_two":
          data = JSON.stringify({
            waimai_order_agent_scale: this.waimai_order_agent_scale
          });
          break;
        case "type_three":
          data = JSON.stringify({
            product_order_agent_scale: this.product_order_agent_scale
          });
          break;
      }
      this.getData(val, data);
    },
    getData(type, log_info, val) {
      const that = this;
      const data = {
        type,
        log_info
      };
      return new Promise((resolve, reject) => {
        agentBase(data).then(res => {
          this.loading = false;
          if (res.code == 1) {
            if (val != 1) {
              that.$message.success(res.msg);
              this.getData("type_four", "", 1);
            }
            that.product_order_scale = res.data.product_order_scale;
            that.waimai_order_scale = res.data.waimai_order_scale;
            that.waimai_order_agent_scale = res.data.waimai_order_agent_scale;
            that.product_order_agent_scale = res.data.product_order_agent_scale;
          } else {
            that.$message.error(res.msg);
          }
        });
        resolve();
      }).catch(error => {
        console.log(error);
      });
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getData("type_four", "", 1);
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  ctivated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>

<style lang="scss" scoped>
// @import url(); 引入公共css类
@import "src/styles/hide.scss";
</style>
