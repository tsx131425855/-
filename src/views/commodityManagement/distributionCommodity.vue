<!-- tsx 分销商品 -->
<template>
  <div class="package">
    <div class="hide">
      <el-button type="primary" @click="addDistribution()">分销</el-button>
      <span style="margin-left: 10px;">所属代理商：</span>
      <el-select
        v-if="agent.length>0"
        v-model="agent_id"
        style="margin-right: 10px;"
        placeholder="请选择"
        @change="classification"
      >
        <el-option
          v-for="item in agent"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>
      <span style="margin-left: 10px;">本地分类</span>
      <el-select v-model="local_cate_id" style="margin-left: 10px;" class placeholder="请选择">
        <el-option
          v-for="item in local_category_list"
          :key="item.product_category_id"
          :label="item.cate_name"
          :value="item.product_category_id"
        />
      </el-select>
      <span style="margin-left: 10px;">商品分类</span>
      <el-select v-model="cate_id" style="margin-left: 10px;" class placeholder="请选择">
        <el-option
          v-for="item in category_list"
          :key="item.product_category_id"
          :label="item.cate_name"
          :value="item.product_category_id"
        />
      </el-select>
      <el-input
        v-model="keyword"
        class="input"
        style="margin-left: 10px;"
        prefix-icon="el-icon-search"
        placeholder="商品名称/id"
      />
      <el-button type="success" class icon="el-icon-search" @click="page=1,getDatalist()">查询</el-button>
    </div>

    <template>
      <el-table
        v-loading="loading"
        :data="datalist"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" width="55" />
        <el-table-column prop="product_id" label="ID" />
        <el-table-column prop="product_name" label="商品名称" />
        <el-table-column prop="cate_name" label="商品分类" />
        <el-table-column prop="product_price" label="商品价格" />
        <el-table-column prop="product_stock" label="商品库存" />
        <el-table-column prop="dispatching_type_name" label="配送方式" />
        <el-table-column prop="product_local_category_name" label="本地分类" />
        <el-table-column prop="status_text" label="分销状态" />
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <!-- <el-button size="small" @click="Orderexporte(3,scope.row)">查看</el-button> -->
            <el-button
              size="small"
              v-if="scope.row.status==1"
              @click="checkRetail('cancel',scope.row.product_id)"
            >取消分销</el-button>
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

    <el-dialog
      :title="'平台商品分销'"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" label-width="120px">
        <!-- <el-form-item label="代理商">
          <el-select v-model="form.agent_id" placeholder="请选择代理商">
            <el-option
              v-for="item in agent"
              :key="item.agent_id"
              :label="item.name"
              :value="item.agent_id"
            />
          </el-select>
        </el-form-item>-->

        <el-form-item label="请选择本地分类">
          <el-select v-model="form.local_cate_id" class="maright" placeholder="请选择代理商">
            <el-option
              v-for="item in local_category_list"
              :key="item.product_category_id"
              :label="item.cate_name"
              :value="item.product_category_id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="加盟提成">
          <el-checkbox v-model="form.partner_retail_status">
            <span>合伙人提成</span>
            <el-input-number
              v-model="form.cm_rate_partner"
              :disabled="!form.partner_retail_status"
              controls-position="right"
              class="input"
              style="width:100px"
              placeholder="最多"
            />%
          </el-checkbox>
          <el-checkbox v-model="form.village_retail_status">
            负责人提成
            <el-input-number
              v-model="form.cm_rate_village"
              :disabled="!form.village_retail_status"
              controls-position="right"
              class="input"
              style="width:100px"
              placeholder="最多"
            />%
          </el-checkbox>
        </el-form-item>

        <el-form-item label="粉丝返佣">
          <!-- <span>村级返佣</span> -->
          <el-checkbox v-model="form.village_rake_back_status">
            <el-input-number
              v-model="form.cm_rate_fans"
              controls-position="right"
              :disabled="!form.village_rake_back_status"
              class="input"
              style="width:100px"
              placeholder
            />%
          </el-checkbox>
        </el-form-item>

        <template>
          <el-table :data="multipleSelection" border style="width: 100%">
            <el-table-column prop="product_id" label="ID" />
            <el-table-column prop="product_name" label="商品名称" />
            <el-table-column prop="cate_name" label="商品分类" />
            <el-table-column prop="product_price" label="商品价格" />
            <el-table-column prop="product_stock" label="商品库存" />
            <el-table-column prop="dispatching_type_name" label="配送方式" />
            <el-table-column prop="product_local_category_name" label="本地分类" />
            <el-table-column prop="status_text" label="分销状态" />
          </el-table>
        </template>
        <div class="block">
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { categorys, product_retaillists, check_retail } from "@/api/commodity";
import CommoditySpecification from "@/components/CommoditySpecification";
import { MessageBoxs } from "@/utils/elementEncapsulation";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { CommoditySpecification },
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
      agent_id: "",
      agent: [],
      cate_id: "",
      local_cate_id: "",
      sort_type: "",
      sort_name: "asc",
      dialogVisible: false,
      category_list: [],
      local_category_list: [],
      form: {},
      templateData: {}
    };
  },
  // 过滤器
  filters: {},
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    // "$store.state.app.agentMap": function() {
    //   //你需要执行的代码
    //   let agent = this.$store.state.app.agentMap;
    //   agent.shift();
    //   this.agent = agent;
    //   this.agent_id = agent[0].agent_id;
    //   this.getDatalist();
    // }
  },
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
      let arr = [];
      val.map(res => {
        arr.push(res);
      });
      this.multipleSelection = arr;
    },
    handleClose(done) {
      done();
    },
    addDistribution() {
      if (this.multipleSelection.length > 0) {
        this.form = {
          cm_rate_partner: 0,
          cm_rate_village: 0,
          cm_rate_fans: 0,
          local_cate_id: "",
          partner_retail_status: false,
          village_retail_status: false,
          village_rake_back_status: false
        };
        this.dialogVisible = true;
      } else {
        this.$message.success("请选择需要分销的商品");
      }
    },
    onSubmit() {
      if (
        this.form.cm_rate_partner.toString().length > 0 &&
        this.form.cm_rate_village.toString().length > 0 &&
        this.form.cm_rate_fans.toString().length > 0
      ) {
        if (this.form.local_cate_id.toString().length > 0) {
          this.checkRetail("add");
        } else {
          this.$message.error("请选择商品类型");
        }
      } else {
        this.$message.error("请输入值");
        return;
      }
    },
    checkRetail(val, row) {
      const that = this;
      let data = {};
      if (val == "add") {
        const product_id = [];
        this.multipleSelection.map(res => {
          product_id.push(res.product_id);
        });
        data = {
          type: val,
          product_id: product_id.toString(),
          local_cate_id: this.form.local_cate_id,
          cm_rate_partner: this.form.partner_retail_status
            ? this.form.cm_rate_partner
            : (this.form.cm_rate_partner = ""),
          cm_rate_village: this.form.village_retail_status
            ? this.form.cm_rate_village
            : (this.form.cm_rate_village = ""),
          cm_rate_fans: this.form.village_rake_back_status
            ? this.form.cm_rate_fans
            : (this.form.cm_rate_fans = ""),
          partner_retail_status: this.form.partner_retail_status,
          village_retail_status: this.form.village_retail_status,
          village_rake_back_status: this.form.village_rake_back_status,
          agent_id: this.agent_id
        };
      } else {
        data = {
          type: val,
          product_id: row,
          cm_rate_partner: this.form.partner_retail_status
            ? this.form.cm_rate_partner
            : (this.form.cm_rate_partner = ""),
          cm_rate_village: this.form.village_retail_status
            ? this.form.cm_rate_village
            : (this.form.cm_rate_village = ""),
          cm_rate_fans: this.form.village_rake_back_status
            ? this.form.cm_rate_fans
            : (this.form.cm_rate_fans = ""),
          partner_retail_status: this.form.partner_retail_status,
          village_retail_status: this.form.village_retail_status,
          village_rake_back_status: this.form.village_rake_back_status,
          agent_id: this.agent_id
        };
      }

      MessageBoxs({
        that: this,
        message: `是否确认${val == "add" ? "添加" : "取消"}？ `
      }).then(res => {
        if (res == true) {
          check_retail(data).then(res => {
            console.log(res);
            if (res.code == 1) {
              that.page = 1;
              that.getDatalist();
              that.$message.success(res.msg);
              that.dialogVisible = false;
            } else if (res.code == 2) {
              that.$message.error(res.msg);
            } else {
              that.$message.error(res.msg);
            }
          });
        }
      });
    },
    classification() {
      this.local_cate_id = "";
      const that = this;
      categorys({ agent_id: this.agent_id }).then(res => {
        if (res.code == 1) {
          that.category_list = res.data.category_list;
          that.local_category_list = res.data.local_category_list;
        } else {
          that.$message.error(res.msg);
        }
      });
    },
    getDatalist() {
      const that = this;
      const data = {
        keyword: this.keyword,
        cate_id: this.cate_id,
        local_cate_id: this.local_cate_id,
        sort_type: this.sort_type,
        sort_name: this.sort_name,
        agent_id: this.agent_id,
        page: this.page,
        limit: this.limit
      };
      return new Promise((resolve, reject) => {
        product_retaillists(data).then(res => {
          console.log(res);
          if (res.code == 1) {
            if (res.action) {
              res.action.map(val => {
                switch (val.tag) {
                  case "centerexport":
                    if (val.display == 1) {
                      that.agencyCenter.centerexport = 1;
                    }
                    break;
                  case "orderexport":
                    if (val.display == 1) {
                      that.agencyCenter.orderexport = 1;
                    }
                    break;
                  default:
                    break;
                }
              });
            }
            that.datalist = res.data.list;
            that.total = res.data.total;
            that.summary = res.data.summary;
            that.levellist = res.data.level;
            that.date_typelist = res.data.date_type;
            console.log(that.levellist);
          } else if (res.code == 2) {
            that.$message.error(res.msg);
          } else {
            that.$message.error(res.msg);
          }
        });
        // resolve();
      }).catch(error => {
        console.log(error);
      });
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    let agent = this.$store.state.app.agentMap;
    if (agent.length > 0) {
      agent.shift();
      this.agent = agent;
      this.agent_id = agent[0].agent_id;
      this.getDatalist();
    }
    this.classification();
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
</style>
