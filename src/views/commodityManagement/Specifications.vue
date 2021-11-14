<!-- tsx规格模板 -->
<template>
  <div class="package">
    <div class="hide backtsx">
      <el-select v-model="agent_id" class="maright" placeholder="请选择代理商">
        <el-option
          v-for="item in agent_map"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>
      <el-input v-model="keyword" class="input" prefix-icon="el-icon-search" placeholder="模板名称/id" />
      <el-button type="success" class icon="el-icon-search" @click="page=1,getDatalist()">查询</el-button>
      <el-button
        type="primary"
        size="small"
        @click="elsec=1,dialogVisible=true"
        icon="el-icon-circle-plus"
      >新增</el-button>
      <el-button type="warning" size="small" @click="deiut()" icon="el-icon-edit-outline">修改</el-button>
      <el-button type="danger" size="small" icon="el-icon-circle-close" @click="tempdel">删除</el-button>
    </div>
    <template>
      <el-table
        v-loading="loading"
        :data="datalist"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" width="55" prop="temp_id" />
        <el-table-column prop="temp_id" label="id" />
        <el-table-column prop="temp_name" label="模板名称" />
        <el-table-column prop="product_number" label="关联商品数量" />
        <el-table-column prop="name" label="代理商" />
        <el-table-column prop="create_time" label="创建时间" />
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
      :tsxTitle="elsec==1?'新增商品规格':'编辑商品规格'"
      tsxWidth="1400px"
      @handleClose="handleClose"
    >
      <div slot="forms">
        <div class="addhide">
          <el-col :span="6">
            <el-button size="small" @click="handleClose">关闭</el-button>
            <el-button size="small" @click="Preservation">保存</el-button>
          </el-col>
        </div>
        <CommoditySpecification
          v-if="dialogVisible"
          ref="Template"
          :agentMap="agent_map"
          :templateData="TemplateData"
          :elsec="elsec"
        />
      </div>
    </PublicDialog>
    <AddCommodity
      v-if="product"
      :product_ids="product_ids"
      :agent="addAgent_id"
      @shut="setProduct"
      @Selection="SelectionProduct"
    />
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { exporteurl } from "@/utils/user";
import { upimg } from "@/api/user";
import {
  templatelists,
  templateAdd,
  templateDel,
  templateInfo,
  templateEdit
} from "@/api/commodity";
import PublicDialog from "@/components/PublicDialog";
import AddCommodity from "@/components/AddCommodity";
import CommoditySpecification from "@/components/CommoditySpecification";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { PublicDialog, AddCommodity, CommoditySpecification },
  data() {
    // 这里存放数据
    return {
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      keyword: "",
      datalist: [],
      multipleSelection: [],
      agent_id: "0",
      agent_map: [],
      dialogVisible: false,
      loading: false,
      headers: {
        token: localStorage.getItem("Token"),
        enctype: "multipart/form-data"
      },
      exporteurl: exporteurl + upimg,
      templateTitle: [],
      templatelist: [
        {
          product_price: "",
          purch_price: "",
          market_price: "",
          product_stock: "",
          gold_limit: "",
          user_quota: "",
          day_quota: "",
          single_quota: "",
          attr_image: "",
          attr_image_url: ""
        }
      ],
      title: [],
      imgindex: 0,
      addtitle: {},
      titleIndex: 0,
      elsec: 1,
      product: false,
      selectionCommodity: [],
      product_ids: [],
      templateName: "",
      addAgent_id: "0",
      Template: {},
      TemplateData: {}
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
      let arr = [];
      val.map(res => {
        arr.push(res);
      });
      this.multipleSelection = arr;
    },
    handleClose() {
      this.dialogVisible = false;
      this.TemplateData = {};
    },
    deiut() {
      /** 查看 获取数据 */
      if (this.multipleSelection.length == 1) {
        templateInfo({
          temp_id: this.multipleSelection[0].temp_id,
          agent_id: this.multipleSelection[0].agent_id
        }).then(res => {
          if (res.code == 1) {
            this.elsec = 2;
            this.TemplateData = res.data;
            this.dialogVisible = true;
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        this.$message("请选择一条");
      }
    },
    tempdel() {
      /** 删除 */
      if (this.multipleSelection.length == 1) {
        templateDel({ temp_id: this.multipleSelection[0].temp_id }).then(
          res => {
            console.log(res);
            if (res.code == 1) {
              this.page = 1;
              this.getDatalist();
              this.$message.success(res.msg);
            } else {
              this.$message.error(res.msg);
            }
          }
        );
      } else {
        this.$message("请选择一条");
      }
    },
    setProduct() {
      this.product = false;
      this.product_ids = [];
    },
    SelectionProduct(val) {
      if (val && val.length > 0) {
        this.selectionCommodity.push.apply(this.selectionCommodity, val);
      }
      this.product = false;
    },
    Preservation(val) {
      const ss = this.$refs.Template.commit();
      this.commit(ss);
    },
    commit(data) {
      if (this.elsec == 1) {
        templateAdd(data).then(res => {
          console.log(res);
          if (res.code == 1) {
            this.dialogVisible = false;
            this.$message.success(res.msg);
            this.page = 1;
            this.getDatalist();
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        Object.assign(data, { temp_id: this.TemplateData.temp_id });
        templateEdit(data).then(res => {
          console.log(res);
          if (res.code == 1) {
            this.dialogVisible = false;
            this.$message.success(res.msg);
            this.page = 1;
            this.getDatalist();
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },
    getDatalist() {
      const data = {
        keyword: this.keyword,
        agent_id: this.agent_id,
        limit: this.limit,
        page: this.page
      };
      this.loading = true;
      const that = this;
      return new Promise((resolve, reject) => {
        templatelists(data).then(res => {
          this.loading = false;
          if (res.code == 1) {
            if (res.action) {
              res.action.map(val => {
                switch (val.tag) {
                  case "add":
                    if (val.display == 1) {
                      that.Template.add = 1;
                    }
                    break;
                  case "edit":
                    if (val.display == 1) {
                      that.Template.edit = 1;
                    }
                    break;
                  case "del":
                    if (val.display == 1) {
                      that.Template.del = 1;
                    }
                    break;
                  case "info":
                    if (val.display == 1) {
                      that.Template.info = 1;
                    }
                    break;
                  default:
                    break;
                }
              });
            }
            if (res.agent_map) {
              that.agent_map = res.agent_map;
            }

            that.datalist = res.data.list;
            // that.options = res.data.status_map;
            that.total = res.data.total;
          } else if (res.code === 2) {
            that.$message.error(res.msg);
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
    this.getDatalist();
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
.guigeshur {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .guigemosi {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    > div {
      width: 200px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
  }
}
.tilet {
  display: flex;
  justify-content: space-between;
  height: 40px;
  border-bottom: 1px solid #cccccc;
  margin-bottom: 20px;
  margin-top: 20px;
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
