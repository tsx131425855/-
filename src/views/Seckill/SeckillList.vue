<!-- tsx 秒杀活动 -->
<template>
  <div class="package">
    <div class="hide">
      <el-button
        v-if="Seckill.add_rule==1"
        @click="addseckil()"
        size="small"
        icon="el-icon-circle-plus"
        type="primary"
      >新增</el-button>
      <!-- <el-button @click="delData(1)">删除</el-button> -->
      <el-button v-if="Seckill.change_show==1" type="warning" @click="showHide(0)">上架</el-button>
      <el-button
        v-if="Seckill.change_show==1"
        type="warning"
        class="maright"
        @click="showHide(1)"
      >下架</el-button>
      <el-select v-model="agent_id" size="small" class="gaosizuobian" placeholder="请选择代理商">
        <el-option
          v-for="item in agent"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>
      <el-select v-model="status" size="small" class="gaosizuobian" placeholder="筛选">
        <el-option v-for="item in statusarr" :key="item.key" :label="item.val" :value="item.key" />
      </el-select>
      <span class="gaosizuobian">活动名称:</span>
      <el-input
        v-model="keyword"
        size="small"
        class="input gaosizuobian"
        prefix-icon="el-icon-search"
        placeholder="商品名称/订单编号/手机号"
      />
      <el-button type="success" size="small" @click="page=1,getDatalist()" icon="el-icon-search">查询</el-button>
    </div>

    <!-- 列表 -->
    <template>
      <el-table
        v-loading="loading"
        :data="datalist"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" width="55" prop="product_category_id" />
        <el-table-column prop="name" label="活动名称" />
        <el-table-column prop="start_time" label="活动开始时间" />
        <el-table-column prop="end_time" label="活动结束时间" />
        <el-table-column prop="show_text" label="是否上下架" />
        <el-table-column prop="status_text" label="状态" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="Seckill.edit_rule==1"
              type="text"
              size="small"
              @click="editSeckill(scope.row,1),elsec=2"
            >编辑</el-button>
            <el-button
              v-if="Seckill.lists==1"
              type="text"
              size="small"
              @click="editSeckill(scope.row,2),elsec=2"
            >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="block">
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 30, 40,50]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <PublicDialog
      v-if="dialogVisible"
      :isShowVisible="dialogVisible"
      :tsxTitle="elsec==1?'新增':'编辑'"
      tsxWidth="1400px"
      @handleClose="handleClose"
    >
      <div slot="forms">
        <div class="tilet">
          <p>基础设置</p>
          <el-button type="primary" v-if="!prohibit" @click="Preservation()">保存</el-button>
        </div>

        <el-form ref="form" :model="form" :disabled="prohibit" label-width="80px">
          <el-form-item label="代理商:">
            <el-select
              v-model="form.agent_id"
              :disabled="elsec==1?false:true"
              class="maright"
              placeholder="请选择代理商"
              @change="deitdatalist"
            >
              <el-option
                v-for="item in agent"
                :key="item.agent_id"
                :label="item.name"
                :value="item.agent_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="活动名称:">
            <el-input v-model="form.name" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="活动时间:">
            <el-date-picker v-model="form.start_time" type="datetime" placeholder="选择日期时间"></el-date-picker>
            <span style="width:30px;text-align: center;">至</span>
            <el-date-picker v-model="form.end_time" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="活动规则:">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              v-model="form.seckill_rule"
              placeholder
            />
          </el-form-item>

          <div class="tilet">
            <p>商品设置</p>
          </div>

          <div style="margin-bottom: 20px;">
            <el-button type="primary" icon="el-icon-plus" @click="addproduct()">添加商品</el-button>
            <el-button type="danger" icon="el-icon-circle-close" @click="deleteproduct()">删除</el-button>
          </div>
          <div>
            <el-table
              :data="selectionCommodity"
              border
              style="width: 100%"
              max-height="250"
              @selection-change="SelectionChange"
            >
              <el-table-column type="selection" width="60" />
              <el-table-column prop="product_id" label="商品ID" width="100" />
              <el-table-column prop="product_name" label="商品名称" />
              <el-table-column prop="product_price" label="销售价" />
              <el-table-column prop="seckill_price" label="秒杀价" width="80" />
              <el-table-column prop="seckill_num" label="秒杀商品数量" />
              <el-table-column label="排序" width="100">
                <template slot-scope="scope">
                  <i
                    class="el-icon-caret-bottom"
                    style="color:red;font-size: 18px;"
                    @click="sort(scope,1)"
                  />
                  <i
                    class="el-icon-caret-top"
                    style="color:green;font-size: 18px;"
                    @click="sort(scope,2)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="230">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-plus" @click="rule(scope)">添加规则</el-button>
                  <el-button type="success" icon="el-icon-upload2" @click="placement(scope)">置顶</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="product_remark" label="备注" />
            </el-table>
          </div>
        </el-form>
      </div>
    </PublicDialog>

    <PublicDialog
      v-if="dialogFormVisible"
      :isShowVisible="dialogFormVisible"
      tsxTitle="规格"
      tsxWidth="1000px"
      @handleClose="handleClosemin"
    >
      <el-form slot="forms" :model="configure" label-width="120px">
        <el-form-item label="秒杀价">
          <el-input-number
            v-model="configure.seckill_price"
            controls-position="right"
            class="input"
            autocomplete="off"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="参与秒杀的数量">
          <el-input-number
            v-model="configure.seckill_num"
            controls-position="right"
            class="input"
            :min="1"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="每人限制购买">
          <el-input-number
            v-model="configure.single_limit"
            controls-position="right"
            class="input"
            autocomplete="off"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="限制会员等级">
          <el-radio-group v-model="configure.user_grade">
            <el-radio :label="0">不限</el-radio>
            <el-radio :label="1">仅超级会员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="限制用户类型">
          <el-radio-group v-model="configure.user_type">
            <el-radio :label="0">不限（全民参与）</el-radio>
            <el-radio :label="1">仅新用户</el-radio>
          </el-radio-group>
        </el-form-item>

        <CommoditySpecification
          v-if="is_show"
          ref="Template"
          :agentMap="agent"
          :elsec="1"
          :templateData="templateData"
          :isShow="false"
          :entrance="4"
          :store_id="store_id"
          :control="true"
        />

        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="cimmut">确 定</el-button>
        </div>
      </el-form>
    </PublicDialog>
    <AddCommodity
      v-if="product"
      :product_ids="product_ids"
      :agent="form.agent_id"
      :channel="0"
      @shut="setProduct"
      @Selection="SelectionProduct"
    />
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import AddCommodity from "@/components/AddCommodity";
import {
  turnDate,
  CopyObject,
  arrDisplacement,
  arrRoofPlacement
} from "@/utils/user";
import PublicDialog from "@/components/PublicDialog";
// import axios from "axios";
import {
  add_rule,
  spike_product_list,
  spike_info,
  spike_edit_rule,
  add_product_rule,
  change_show,
  seckill_product_info
} from "@/api/Spike";
import CommoditySpecification from "@/components/CommoditySpecification";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { AddCommodity, PublicDialog, CommoditySpecification },
  data() {
    // 这里存放数据
    return {
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      keyword: "",
      datalist: [],
      agent_id: JSON.parse(localStorage.getItem("user")).agent_id,
      multipleSelection: [],
      loading: false,
      dialogVisible: false,
      agent_map: [],
      status: 0,
      statusarr: [
        { key: 0, val: "全部" },
        { key: 1, val: "已开始" },
        { key: 2, val: "待开始" },
        { key: 3, val: "结束" }
      ],
      elsec: 1,
      agent: [],
      product: false,
      product_ids: [],
      selectionCommodity: [],
      setProductList: [],
      form: { agent_id: JSON.parse(localStorage.getItem("user")).agent_id },
      prohibit: false,
      dialogFormVisible: false,
      configure: {},
      index: null,
      product_id: "",
      shazi: true,
      Seckill: {},
      Selection: [],
      templateData: {},
      is_show: false,
      store_id: "0"
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
      console.log(`当前页: ${val}`);
      this.getDatalist();
    },
    handleSizeChange(val) {
      this.limit = val;
      console.log(`每页 ${val} 条`);
      localStorage.setItem("limit", val);
      this.page = 1;
      this.getDatalist();
    },
    handleSelectionChange(val) {
      /** 选中 */
      const arr = [];
      val.map(res => {
        arr.push(res.seckill_id);
      });
      this.multipleSelection = arr;
    },
    SelectionChange(val) {
      /** 选中 */
      const arr = [];
      val.map(res => {
        arr.push(res);
      });
      this.Selection = arr;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    handleClosemin() {
      this.dialogFormVisible = false;
    },
    deitdatalist() {
      this.selectionCommodity = [];
    },
    showHide(val) {
      const that = this;
      if (this.multipleSelection.length == 0) {
        this.$message("请选择活动");
        return;
      }
      change_show({
        seckill_id_data: this.multipleSelection.toString(),
        is_show: val
      }).then(res => {
        if (res.code == 1) {
          that.getDatalist();
          that.$message.success(res.msg);
        } else {
          that.$message.error(res.msg);
        }
      });
    },
    rule(scope) {
      this.dialogFormVisible = true;
      this.index = scope.$index;
      this.product_id = scope.row.product_id;
      this.configure = this.selectionCommodity[scope.$index];
      if (this.configure.hasOwnProperty("single_limit")) {
        // Object.assign(this.configure, { index: this.index });
        // console.log(this.configure);
        // this.$set(this.configure, "user_grade", this.configure.user_grade);
      } else {
        this.configure = {
          user_grade: 0,
          user_type: 0,
          seckill_price: this.selectionCommodity[scope.$index].product_price,
          seckill_num: this.selectionCommodity[scope.$index].product_stock,
          store_id: this.selectionCommodity[scope.$index].store_id,
          single_limit: 1
        };
      }
      this.ruleData(
        scope.row.product_id,
        scope.row.agent_id,
        scope.row.store_id
      );
    },
    ruleData(product_id, agent_id, store_id) {
      const that = this;
      const data = {
        product_id,
        agent_id,
        store_id,
        type: this.elsec
      };
      seckill_product_info(data).then(res => {
        if (res.code == 1) {
          if (Array.isArray(res.data.attr_template_data)) {
            that.templateData = [];
            that.is_show = false;
          } else {
            that.templateData = res.data.attr_template_data;
            that.store_id = res.data.store_id;
            that.is_show = true;
          }
          // that.configure["single_limit"] = res.data.single_limit;
        } else {
          that.$message.error(res.msg);
        }
      });
    },

    cimmut() {
      /** 确定 */
      const that = this;
      let ss = "";
      const data = this.configure;
      data["product_id"] = this.product_id;
      if (!Array.isArray(this.templateData)) {
        ss = this.$refs.Template.commit();
        Object.assign(data, { seckill_data: ss.seckill_data });
      }
      add_product_rule(data).then(res => {
        if (res.code == 1) {
          if (!Array.isArray(this.templateData)) {
            ss = this.$refs.Template.commit();
            Object.assign(that.selectionCommodity[that.index], {
              seckill_data: ss.seckill_data
            });
          }
          that.selectionCommodity[that.index] = Object.assign(
            that.selectionCommodity[that.index],
            data
          );
          that.selectionCommodity = CopyObject(that.selectionCommodity);
          that.dialogFormVisible = false;
        } else {
          that.$message.error(res.msg);
        }
      });
    },
    addproduct() {
      const product_ids = [];
      if (this.selectionCommodity.length > 0) {
        for (const key in this.selectionCommodity) {
          product_ids.push(this.selectionCommodity[key].product_id);
        }
      }
      this.product_ids = product_ids;
      this.product = true;
    },
    deleteproduct() {
      if (this.Selection.length > 0) {
        for (const i in this.Selection) {
          for (const key in this.selectionCommodity) {
            if (
              this.Selection[i].product_id ===
              this.selectionCommodity[key].product_id
            ) {
              this.selectionCommodity.splice(key, 1);
            }
          }
        }
      } else {
        this.$message.error("请先选中需要删除的商品");
      }
    },
    placement(scope) {
      this.selectionCommodity = arrRoofPlacement(
        this.selectionCommodity,
        scope.$index
      );
    },
    sort(row, val) {
      // 数组上下移动
      this.selectionCommodity = arrDisplacement(
        val,
        this.selectionCommodity,
        row.$index
      );
    },
    setProduct() {
      this.product = false;
      this.product_ids = [];
    },
    SelectionProduct(val) {
      if (val && val.length > 0) {
        const arr = [];
        val.map(tsx => {
          Object.assign(tsx, { seckill_data: [] });
          arr.push(tsx);
        });
        this.selectionCommodity.push.apply(this.selectionCommodity, arr);
      }
      this.product = false;
    },
    addseckil() {
      this.dialogVisible = true;
      this.elsec = 1;
      this.form = {
        agent_id: JSON.parse(localStorage.getItem("user")).agent_id
      };
      this.selectionCommodity = [];
      this.prohibit = false;
    },
    editSeckill(row, val) {
      const that = this;
      spike_info({ seckill_id: row.seckill_id }).then(res => {
        if (res.code == 1) {
          that.form = res.data.seckill_config;
          that.selectionCommodity = res.data.seckill_product;
          that.dialogVisible = true;
        } else {
          that.$message.error(res.msg);
        }
      });
      if (val == 1) this.prohibit = false;
      else this.prohibit = true;
    },
    Preservation() {
      // 提交
      const that = this;
      if (this.form.start_time instanceof Date) {
        this.form.start_time = turnDate(this.form.start_time, 21);
      }
      if (this.form.end_time instanceof Date) {
        this.form.end_time = turnDate(this.form.end_time, 21);
      }
      const product_ids = [];
      if (this.selectionCommodity.length > 0) {
        for (const key in this.selectionCommodity) {
          product_ids.push(this.selectionCommodity[key].product_id);
        }
      } else {
        that.$message.success("请选择商品");
        return;
      }
      this.form.product_ids = product_ids.toString();
      this.form.product_rule = this.selectionCommodity;
      if (this.shazi) {
        this.shazi = false;
        if (this.elsec == 1) {
          add_rule(this.form).then(res => {
            if (res.code == 1) {
              that.$message.success(res.msg);
              that.dialogVisible = false;
              that.page = 1;
              that.getDatalist();
            } else {
              that.$message.error(res.msg);
            }
            setTimeout(() => {
              this.shazi = true;
            }, 1000);
          });
        } else {
          spike_edit_rule(this.form).then(res => {
            if (res.code == 1) {
              that.$message.success(res.msg);
              that.dialogVisible = false;
              that.page = 1;
              that.getDatalist();
            } else {
              that.$message.error(res.msg);
            }
            setTimeout(() => {
              this.shazi = true;
            }, 1000);
          });
        }
      }
    },
    getDatalist() {
      const data = {
        keyword: this.keyword,
        status: this.status,
        page: this.page,
        limit: this.limit,
        agent_id: this.agent_id
      };
      const that = this;
      spike_product_list(data).then(res => {
        if (res.code == 1) {
          if (res.action) {
            res.action.map(val => {
              switch (val.tag) {
                case "add_rule":
                  if (val.display == 1) {
                    that.Seckill.add_rule = 1;
                  }
                  break;
                case "edit_rule":
                  if (val.display == 1) {
                    that.Seckill.edit_rule = 1;
                  }
                  break;
                case "change_show":
                  if (val.display == 1) {
                    that.Seckill.change_show = 1;
                  }
                  break;
                case "lists":
                  if (val.display == 1) {
                    that.Seckill.lists = 1;
                  }
                  break;
                default:
                  break;
              }
            });
          }
          that.datalist = res.data.list;
          that.total = res.data.total;
          that.agent = res.agent_map;
          that.agent_map = res.data.agent_map;
        } else {
          that.$message.error(res.msg);
        }
      });
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getDatalist();

    // var mysql = require("mysql");
    // var connection = mysql.createConnection({
    //   host: "47.111.10.47",
    //   user: "root",
    //   port: 3306,
    //   password: "jiunidu@2020!",
    //   database: "remote"
    // });
    // connection.connect(); // 建立连接
    // var sql =
    //   "select table_name from information_schema.tables where table_schema='csdb' and table_type='base table';";
    // connection.query(sql, function(err, result) {
    //   if (err) {
    //     console.log(err.message);
    //     return;
    //   }
    //   console.log("获取的数据如下：");
    //   console.log(result);
    // });
    // connection.end();
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
.paiban {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
  align-items: flex-start;
  span {
    width: 100px;
    display: inline-block;
    height: 30px;
    line-height: 30px;
  }
}
.tilet {
  display: flex;
  justify-content: space-between;
  height: 40px;
  border-bottom: 1px solid #cccccc;
  margin-bottom: 20px;
  p {
    width: 200px;
    height: 40px;
    // font-weight: bold;
    font-size: 20px;
    background-color: #cccccc;
    opacity: 0.6;
    margin: 0;
    line-height: 40px;
    text-align: center;
  }
}
</style>
<style>
.el-dialog__body {
  padding: 10px 20px;
}
</style>
