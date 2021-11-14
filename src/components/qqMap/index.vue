<!-- tsx -->
<template>
  <div class>
    <div>
      <el-button @click="poenMap()">标注坐标</el-button>
      <span>经度:</span>
      <el-input v-model="centers.lng" class="frominput" disabled size="small" />
      <span>纬度:</span>
      <el-input v-model="centers.lat" class="frominput" disabled size="small" />
    </div>

    <el-dialog
      title="地图"
      :visible.sync="mapVisible"
      width="800px"
      :before-close="MapClose"
      :modal="false"
    >
      <div class="map">
        <el-input
          v-model="addressKeyword"
          placeholder="请输入地址来直接查找相关位置"
          clearable
          style="margin-bottom:20px"
        >
          <el-button slot="append" icon="el-icon-search" @click="getAddressKeyword" />
        </el-input>
        <div id="container" style="width:100%; height:300px" />
      </div>

      <!-- <div id="container" style="width:100%; height:300px"></div> -->
    </el-dialog>
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import maps from "qqmap";
export default {
  // import引入的组件需要注入到对象中才能使用
  props: {
    localization: String,
    centers: Object,
    address: { type: Number, default: 1 }
  },
  components: {},
  data() {
    // 这里存放数据
    return {
      mapVisible: false,
      map: null,
      getAddress: null,
      getAddCode: null,
      addressKeyword: "",
      shopInfo: {},
      marker: null,
      markersArray: []
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
    poenMap() {
      /** 输入查找经纬度 */
      /** 详细地址 */
      if (this.default == 1) {
        if (this.localization && this.localization.length > 0) {
          this.mapVisible = true;
          this.addressKeyword = this.localization;
          this.init();
        }
      } else {
        this.mapVisible = true;
        this.addressKeyword = "";
        this.init();
      }
    },
    MapClose(done) {
      /** 关闭地图 */
      if (this.markersArray) {
        this.markersArray = [];
      }
      done();
    },
    // 初始化地图
    init() {
      const that = this;

      maps.init("OBYBZ-S5PWD-KL44T-HZN3V-Z7MEV-O7BDM", () => {
        const myLatlng = new qq.maps.LatLng(this.centers.lat, this.centers.lng);
        const myOptions = {
          zoom: 16,
          center: myLatlng,
          mapTypeId: qq.maps.MapTypeId.ROADMAP
        };
        that.map = new qq.maps.Map(
          document.querySelector("#container"),
          myOptions
        );
        // 获取点击后的地址
        qq.maps.event.addListener(that.map, "click", function(event) {
          // 获取点击后的地图坐标
          that.shopInfo.lng = event.latLng.getLng();
          that.shopInfo.lat = event.latLng.getLat();
          that.getAddressCode();
          that.addMarker(event.latLng);
        });

        // 调用地址显示地图位置并设置地址
        that.addMarker(myLatlng);
        that.getAddress = new qq.maps.Geocoder({
          complete: function(result) {
            that.map.setCenter(result.detail.location);
            that.shopInfo.lng = result.detail.location.lng;
            that.shopInfo.lat = result.detail.location.lat;
            that.addMarker(result.detail.location);
          }
        });
        // 通过坐标来显示地图地址
        that.getAddCode = new qq.maps.Geocoder({
          complete: function(result) {
            that.addressKeyword = result.detail.address;
          }
        });

        that.getAddressKeyword();
      });
    },
    // 通过地址获得位置
    getAddressKeyword() {
      // 通过getLocation();方法获取位置信息值
      this.getAddress.getLocation(this.addressKeyword);
      //   调用自带的接口;
    },
    // 通过坐标获得地址
    getAddressCode() {
      const lat = parseFloat(this.shopInfo.lat);
      const lng = parseFloat(this.shopInfo.lng);
      const latLng = new qq.maps.LatLng(lat, lng);
      // 调用获取位置方法
      this.getAddCode.getAddress(latLng);
      this.$emit("lonlat", { lat, lng });
    },
    // 添加标记
    addMarker(location) {
      this.deleteOverlays();
      const marker = new qq.maps.Marker({
        position: location,
        map: this.map
      });
      this.markersArray.push(marker);
    },
    // 删除覆盖物
    deleteOverlays() {
      if (this.markersArray) {
        for (const i in this.markersArray) {
          this.markersArray[i].setMap(null);
        }
        this.markersArray.length = 0;
      }
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    // this.init();
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
.frominput {
  width: 150px;
}
</style>
