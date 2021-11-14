<!-- tsx 百度地图 -->
<template>
  <div class>
    <el-button @click="poenMap()">标注坐标</el-button>
    <span>经度:</span>
    <el-input v-model="center.lng" class="frominput" disabled size="small" />
    <span>纬度:</span>
    <el-input v-model="center.lat" class="frominput" disabled size="small" />
    <!-- 地图弹框 -->
    <el-dialog
      title="地图"
      :visible.sync="mapVisible"
      width="800px"
      :before-close="MapClose"
      :modal="false"
    >
      <baidu-map :center="center" :zoom="19" @click="Degrees">
        <bm-view class="map bm-view"></bm-view>
        <bm-control :offset="{width: '10px', height: '10px'}">
          <bm-auto-complete v-model="localization" :sugStyle="{zIndex: 1}">
            <label>
              关键词：
              <input v-model="localization" />
            </label>
          </bm-auto-complete>
          <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
          <bm-geolocation
            anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
            :showAddressBar="true"
            :autoLocation="true"
          ></bm-geolocation>
          <bm-marker :position="center" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
            <bm-label
              content
              :labelStyle="{color: 'red', fontSize : '24px'}"
              :offset="{width: -35, height: 30}"
            />
          </bm-marker>
        </bm-control>
        <bm-local-search :keyword="localization" :auto-viewport="true"></bm-local-search>
      </baidu-map>
    </el-dialog>
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
export default {
  // import引入的组件需要注入到对象中才能使用
  props: { localization: String, centers: Object },
  components: {},
  data() {
    // 这里存放数据
    return {
      mapVisible: false,
      longitude: "116.403765",
      latitude: "39.914850",
      center: this.centers
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
    MapClose(done) {
      /** 关闭地图 */
      done();
    },
    poenMap() {
      /** 输入查找经纬度 */
      /** 详细地址 */
      this.mapVisible = true;
    },
    Degrees(type) {
      /** 点击获取经纬度 */
      // console.log(type.point);
      this.center = type.point;
      this.$emit("lonlat", type.point);
      this.mapVisible = false;
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    console.log(this.centers);
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

<style lang='scss' scoped>
// @import url(); 引入公共css类
@import "src/styles/hide.scss";
.bm-view {
  width: 100%;
  height: 300px;
}
</style>
