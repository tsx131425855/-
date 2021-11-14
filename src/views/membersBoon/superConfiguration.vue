<!-- tsx 超级会员权益配置 -->
<template>
  <div class="package">
    <div class="dachun">
      <div class="shangchun">
        <div>通用设置</div>
        <div>
          <el-button @click="saveChanges(1)">修改</el-button>
        </div>
      </div>
      <div class="xiacheng">
        <el-form :model="general_setting_map" label-width="160px">
          <el-form-item label="单笔订单蜜豆使用上线">
            <el-input
              v-model="general_setting_map.order_midou_limit"
              class="input"
            ></el-input>
          </el-form-item>
          <el-form-item label="每日返蜜豆">
            <el-input
              v-model="general_setting_map.day_give_midou_limit"
              class="input"
            ></el-input>
          </el-form-item>
          <el-form-item label="普通会员：消费1元=">
            <el-input
              v-model="general_setting_map.normal_user_midou"
              class="input"
            ></el-input
            >蜜豆
          </el-form-item>
          <el-form-item label="超级会员：消费1元=">
            <el-input
              v-model="general_setting_map.vip_user_midou"
              class="input"
            ></el-input
            >蜜豆
          </el-form-item>
          <el-form-item label="优惠数据">
            <el-radio-group v-model="general_setting_map.coupon_type">
              <el-radio :label="1">平台超级会员优惠券（领券）</el-radio>
              <el-radio :label="2">各区县超级会员优惠券（领券）</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="开通优惠">
            <el-switch
              v-model="general_setting_map.open_coupon"
              active-text="按月付费"
              >1.单笔消费满100元只需4.9元即可开通1元超级会员
              2.单笔消费满300元即可开通3个月超级会员
              3.月累计消费1000元可免费赠送12个月超级会员
            </el-switch>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="dachun">
      <div class="shangchun">
        <div>会员日权益</div>
        <div>
          <el-button @click="saveChanges(2)">保存</el-button>
        </div>
      </div>
      <div class="xiacheng">
        <div style="margin-bottom: 20px">
          <span>权益介绍：每周</span>
          <el-select
            v-model="super_right_map.market_week"
            class="maright"
            placeholder="请选择"
          >
            <el-option
              v-for="item in vip_map"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            /> </el-select
          >会员赶集日
        </div>
        <div>
          <span>单笔每消费：</span>
          <el-input
            v-model="super_right_map.consumption_money"
            style="width: 200px"
          ></el-input
          >元
          <span style="maright-left: 20px">额外赠送（普通会员）</span>
          <el-input
            v-model="super_right_map.normal_user_give_midou"
            style="width: 200px"
          ></el-input
          >蜜豆
          <span style="maright-left: 20px">额外赠送（超级会员）</span>
          <el-input
            v-model="super_right_map.vip_user_give_midou"
            style="width: 200px"
          ></el-input
          >蜜豆
        </div>
        <div>
          <p>会员日宣传封面</p>
          <Upimg
            :exporteurl="exporteurl"
            :fileList="vipimg"
            fileName="image"
            :showList="true"
            :fileHeaders="headers"
            :maxlimit="1"
            :index="1"
            @Removeimg="SuccessimgArray"
            @Successimg="SuccessimgArray"
          />
        </div>
      </div>
    </div>

    <div class="dachun">
      <div class="shangchun">
        <div>免费试用</div>
        <div>
          <el-button @click="saveChanges(3)">保存</el-button>
        </div>
      </div>
      <div class="xiacheng">
        <div style="margin-bottom: 10px">
          <el-button type="primary" @click="addDataList(1)">新增</el-button>
          <el-button type="danger" @click="deleteList(1)">删除</el-button>
        </div>

        <el-table
          :data="vip_free_product_map"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            fixed
            type="selection"
            width="55"
            prop="product_id"
          />
          <el-table-column prop="product_id" label="商品id" />
          <el-table-column prop="product_name" label="商品名称" />
          <el-table-column prop="product_price" label="价格（销售价）" />
          <el-table-column prop="product_stock" label="试用数" />
          <el-table-column prop="time" label="终止时间" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-arrow-up"
                circle
                @click="move(1, 2, scope.$index)"
              ></el-button>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-arrow-down"
                circle
                @click="move(1, 1, scope.$index)"
              ></el-button>
              <el-button
                size="mini"
                type="success"
                @click="move(1, 3, scope.$index)"
                >置顶</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="dachun">
      <div class="shangchun">
        <div>赠品</div>
        <div>
          <el-button @click="saveChanges(4)">保存</el-button>
        </div>
      </div>
      <div class="xiacheng">
        <div style="margin-bottom: 10px">
          <el-button type="primary" @click="addDataList(2)">新增</el-button>
          <el-button type="danger" @click="deleteList(2)">删除</el-button>
        </div>
        <el-table
          :data="vip_give_product_map"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            fixed
            type="selection"
            width="55"
            prop="product_id"
          />
          <el-table-column prop="product_id" label="商品id" />
          <el-table-column prop="product_name" label="商品名称" />
          <el-table-column prop="product_price" label="价格（销售价）" />
          <el-table-column prop="product_stock" label="试用数" />
          <el-table-column prop="time" label="终止时间" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-arrow-up"
                circle
                @click="move(2, 2, scope.$index)"
              ></el-button>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-arrow-down"
                circle
                @click="move(2, 1, scope.$index)"
              ></el-button>
              <el-button
                size="mini"
                type="success"
                @click="move(2, 3, scope.$index)"
                >置顶</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <PublicDialog
      v-if="dialogVisible"
      :is-show-visible="dialogVisible"
      :tsx-title="'添加商品'"
      tsx-width="1200px"
      @handleClose="handleClose"
    >
      <div slot="forms">
        <div style="margin-bottom: 20px">
          <el-input
            v-model="keyword"
            class="input"
            style="margin-left: 10px"
            prefix-icon="el-icon-search"
            placeholder="商品ID/商品分类/商品名/代理商"
          />
          <el-button type="primary" @click="getProduct">查询</el-button>
          <el-button type="success" @click="addDeleteList">确定</el-button>
          <el-button type="info" @click="handleClose">取消</el-button>
        </div>

        <el-table
          :data="datalist"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column fixed type="selection" width="55" />
          <el-table-column prop="product_name" label="商品名称" />
          <el-table-column prop="product_price" label="商品价格" />
          <el-table-column prop="product_stock" label="商品库存" />
          <el-table-column prop="dispatching_type_name" label="配送方式" />
          <el-table-column prop="add_time" label="创建时间" />
        </el-table>
        <div class="block">
          <el-pagination
            :current-page="page"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </PublicDialog>
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { upimg } from "@/api/user";
import Upimg from "@/components/Upimg";
import PublicDialog from "@/components/PublicDialog";
import {
  super_config,
  super_configadd3,
  product_list,
  super_configadd2,
  super_configadd1,
  super_configdel,
} from "@/api/membersBoon";
import {
  exporteurl,
  turnDate,
  arrDisplacement,
  arrRoofPlacement,
} from "@/utils/user";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { PublicDialog, Upimg },
  data() {
    // 这里存放数据
    return {
      exporteurl: exporteurl + upimg,
      headers: {
        token: localStorage.getItem("Token"),
        enctype: "multipart/form-data",
      },
      vipimg: [],
      dialogVisible: false,
      general_setting_map: {},
      super_right_map: {},
      vip_free_product_map: [], // 试用
      vip_give_product_map: [], // 赠品
      vip_map: [],
      multipleSelection: [],
      datalist: [],
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      keyword: "",
      product_id_arr: [],
      type: "",
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
    handleCurrentChange(val) {
      // 页数
      this.page = val;
      this.getProduct();
    },
    handleSizeChange(val) {
      this.limit = val;
      localStorage.setItem("limit", val);
      this.page = 1;
      this.getProduct();
    },
    handleClose() {
      this.dialogVisible = false;
      this.multipleSelection = [];
    },
    SuccessimgArray(val) {
      this.vipimg = val.imgArray;
    },
    addDataList(val) {
      if (val == 1)
        this.product_id_arr = this.vip_free_product_map.flatMap((x) => [
          x.product_id,
        ]);
      else
        this.product_id_arr = this.vip_give_product_map.flatMap((x) => [
          x.product_id,
        ]);
      this.type = val;
      this.getProduct();
      this.multipleSelection = [];
    },
    move(moduleId, val, index) {
      /** 上下移动 */
      switch (moduleId) {
        case 1:
          if (val == 3) {
            this.vip_free_product_map = arrRoofPlacement(
              this.vip_free_product_map,
              index
            );
          } else {
            this.vip_free_product_map = arrDisplacement(
              val,
              this.vip_free_product_map,
              index
            );
          }
          break;
        case 2:
          if (val == 3) {
            this.vip_give_product_map = arrRoofPlacement(
              this.vip_give_product_map,
              index
            );
          } else {
            this.vip_give_product_map = arrDisplacement(
              val,
              this.vip_give_product_map,
              index
            );
          }
          break;
      }
    },
    handleSelectionChange(val) {
      /** 选中 */
      const arr = [];
      val.map((res) => {
        arr.push(res);
      });
      this.multipleSelection = arr;
    },
    deleteList(val) {
      if (this.multipleSelection.length > 0) {
        super_configdel({
          type: val,
          value: this.multipleSelection.flatMap((x) => [x.product_id]),
        }).then((res) => {
          if (res.code == 1) {
            this.getdata();
            this.$message({ message: res.msg, type: "success" });
          } else {
            this.$message({ message: res.msg, type: "error" });
          }
        });
      } else {
        this.$message({ message: "请选择一条", type: "error" });
      }
    },
    addDeleteList() {
      if (this.multipleSelection.length > 0) {
        if (this.type == 1) {
          this.vip_free_product_map = this.vip_free_product_map.concat(
            this.multipleSelection
          );
        } else {
          this.vip_give_product_map = this.vip_give_product_map.concat(
            this.multipleSelection
          );
        }
        this.dialogVisible = false;
        this.multipleSelection = [];
        //   super_configadd3({
        //     type: this.type,
        //     value: this.multipleSelection,
        //   }).then((res) => {
        //     if (res.code == 1) {
        //       this.getdata();
        //       this.dialogVisible = false;
        //       this.multipleSelection = [];
        //       this.$message({ message: res.msg, type: "success" });
        //     } else {
        //       this.$message({ message: res.msg, type: "error" });
        //     }
        //   });
      } else {
        this.$message({ message: "请选择一条", type: "error" });
      }
    },
    getProduct() {
      const data = {
        keyword: this.keyword,
        product_id_arr: this.product_id_arr,
        type: this.type,
        page: this.page,
        limit: this.limit,
      };
      product_list(data).then((res) => {
        if (res.code == 1) {
          this.dialogVisible = true;
          this.total = res.data.total;
          this.datalist = res.data.list;
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      });
    },
    saveChanges(val) {
      switch (val) {
        case 1:
          this.general_setting_map.open_coupon =
            this.general_setting_map.open_coupon == true ? 1 : 2;
          super_configadd1(this.general_setting_map).then((res) => {
            if (res.code == 1) {
              this.getdata();
              this.$message({ message: res.msg, type: "success" });
            } else {
              this.$message({ message: res.msg, type: "error" });
            }
          });
          break;
        case 2:
          if (this.vipimg.length > 0) {
            this.super_right_map.market_image = this.vipimg[0].imgPath;
          } else this.super_right_map.market_image = "";
          super_configadd2(this.super_right_map).then((res) => {
            if (res.code == 1) {
              this.getdata();
              this.$message({ message: res.msg, type: "success" });
            } else {
              this.$message({ message: res.msg, type: "error" });
            }
          });
          break;
        case 3:
          super_configadd3({
            type: 1,
            value: this.vip_free_product_map.flatMap((x) => [x.product_id]),
          }).then((res) => {
            if (res.code == 1) {
              this.getdata();
              this.$message({ message: res.msg, type: "success" });
            } else {
              this.$message({ message: res.msg, type: "error" });
            }
          });
          break;
        case 4:
          super_configadd3({
            type: 2,
            value: (this.product_id_arr = this.vip_give_product_map.flatMap(
              (x) => [x.product_id]
            )),
          }).then((res) => {
            if (res.code == 1) {
              this.getdata();
              this.$message({ message: res.msg, type: "success" });
            } else {
              this.$message({ message: res.msg, type: "error" });
            }
          });
          break;
      }
    },
    getdata() {
      super_config({}).then((res) => {
        if (res.code == 1) {
          this.general_setting_map = res.data.general_setting_map;
          this.super_right_map = res.data.super_right_map;
          this.vip_give_product_map = res.data.vip_give_product_map;
          this.vip_free_product_map = res.data.vip_free_product_map;
          this.vip_map = res.data.vip_map;
          this.vipimg = [];
          if (res.data.super_right_map.market_image_url.length > 0) {
            this.vipimg = [
              {
                name: "",
                url: res.data.super_right_map.market_image_url,
                imgPath: res.data.super_right_map.market_image,
              },
            ];
          }
          this.general_setting_map.open_coupon =
            this.general_setting_map.open_coupon == 1 ? true : false;
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      });
    },
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getdata();
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  ctivated() {}, // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>

<style lang='scss' scoped>
// @import url(); 引入公共css类
@import "src/styles/hide.scss";
.dachun {
  width: 100%;
  background-color: rgb(235, 235, 235);
  border-radius: 10px;
  border: 1px solid rgb(200, 200, 200);
  margin-bottom: 20px;
}
.shangchun {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgb(200, 200, 200);
  :first-child {
    margin-left: 30px;
  }
  :last-child {
    margin-right: 30px;
  }
}
.xiacheng {
  padding: 10px 20px;
}
</style>
