<!-- tsx 合伙人 -->
<template>
  <div class="package">
    <div class="hide backtsx">
      <el-button
        type="primary"
        v-if="partner.add==1"
        @click="addVisible"
        size="small"
        icon="el-icon-circle-plus"
      >新增</el-button>
      <el-button
        v-if="partner.edit==1"
        type="danger"
        size="small"
        icon="el-icon-edit-outline"
        @click="See(1)"
      >修改</el-button>
      <el-button
        type="warning"
        v-if="partner.check==1"
        @click="buonEvent(1,'forbidden')"
        size="small"
        icon="el-icon-circle-close"
      >禁用</el-button>
      <el-button
        v-if="partner.check==1"
        type="info"
        @click="buonEvent(1,'stop')"
        size="small"
        icon="el-icon-circle-close"
      >停用</el-button>
      <el-button
        v-if="partner.check==1"
        type="warning"
        @click="buonEvent(1,'start')"
        size="small"
        icon="el-icon-circle-check"
      >启用</el-button>
      <span class="gaosizuobian">所属代理</span>
      <el-select v-model="agent_id" size="small" class="gaosizuobian" placeholder="请选择">
        <el-option
          v-for="item in agent"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>
      <span class="gaosizuobian">状态</span>
      <el-select v-model="status" class="gaosizuobian" size="small" placeholder="请选择">
        <el-option v-for="item in status_list" :key="item.key" :label="item.val" :value="item.key" />
      </el-select>
      <el-input
        v-model="keyword"
        size="small"
        class="input gaosizuobian"
        prefix-icon="el-icon-search"
        placeholder="合伙人id/合伙人名称/区县"
      />
      <el-button
        type="success"
        size="small"
        class
        @click="page=1,getDatalist()"
        icon="el-icon-search"
      >查询</el-button>
    </div>
    <template>
      <el-table
        v-loading="loading"
        :data="datalist"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" width="55" prop="product_category_id" />
        <el-table-column prop="partner_id" label="合伙人id" />
        <el-table-column prop="name" label="合伙人名称" />
        <el-table-column prop="partner_tel" label="登录账号" />
        <el-table-column label="所属区/县">
          <template
            slot-scope="scope"
          >{{scope.row.province_name}}{{scope.row.city_name}}{{scope.row.area_name}}</template>
        </el-table-column>
        <el-table-column prop="street_name" label="代理乡/镇" />
        <el-table-column prop="village_count" label="下属村负责人" />
        <el-table-column prop="status_text" label="状态" />
        <el-table-column prop="is_show" label="禁用原因" />
        <el-table-column prop="create_time" label="创建时间" width="90" align="center" />
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="See(2,scope.row)">查看</el-button>
            <el-button
              type="text"
              v-if="role_id==0&&scope.row.status==2"
              size="small"
              @click="buonEvent(2,'agree',scope.row)"
            >同意</el-button>
            <el-button
              type="text"
              v-if="role_id==0&&scope.row.status==2"
              size="small"
              @click="buonEvent(2,'reject',scope.row)"
            >拒绝</el-button>
            <el-button
              type="text"
              v-if="role_id==1&&scope.row.status==3"
              size="small"
              @click="buonEvent(2,'arraigned',scope.row)"
            >提审</el-button>
            <el-button
              type="text"
              v-if="role_id==1&&(scope.row.status==3||scope.row.status==4)"
              size="small"
              @click="buonEvent(2,'delete',scope.row)"
            >删除</el-button>
            <el-button
              type="text"
              v-if="role_id==1&&scope.row.status==4"
              size="small"
              @click="buonEvent(2,'again_arraigned',scope.row)"
            >重新提审</el-button>
            <el-button
              type="text"
              v-if="role_id==1&&scope.row.status==3"
              size="small"
              @click="buonEvent(2,'withdraw',scope.row)"
            >撤回</el-button>
            <el-button
              type="text"
              v-if="partner.jumppartner==1"
              size="small"
              @click="qifei(scope.row)"
            >前往合伙人后台</el-button>
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
      title
      :visible.sync="dialogVisible"
      width="80%"
      top="5vh"
      :fullscreen="fullscreen"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="addhide">
        <el-col :span="6">
          <el-button size="small" @click="dialogVisible=false">关闭</el-button>
          <el-button size="small" @click="conmit" v-show="!prohibit">保存</el-button>
        </el-col>
        <!-- <el-col :span="6">
          <el-button size="small" @click="fullscreen=!fullscreen">全屏</el-button>
        </el-col>-->
      </div>
      <!-- tab -->
      <div class="maxtab">
        <div class="tabtype" :class="tab==1?'tabbott':''" @click="tabTouch($event,1)">
          基础信息
          <div></div>
        </div>
        <div class="tabtype" :class="tab==4?'tabbott':''" @click="tabTouch($event,4)">
          其他信息
          <div></div>
        </div>
        <div
          class="tabtype"
          v-if="newEditor==2"
          :class="tab==5?'tabbott':''"
          @click="tabTouch($event,5)"
        >
          操作日志
          <div></div>
        </div>
      </div>
      <!-- 表单输入 -->
      <div class="fromSlide" id="from" ref="Box" @scroll="orderScroll">
        <!-- 基础信息 -->
        <el-form ref="form" :model="form" :disabled="prohibit" :rules="rules" label-width="100px">
          <div class="fromContent" id="basics">
            <p class="tabtype">基础信息</p>
            <el-row>
              <el-col :span="5">
                <el-form-item label="合伙人名称" prop="cateid">
                  <el-input placeholder="单行输入" :disabled="Grade" v-model="form.name" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="状态" :required="true">
                  <el-radio-group v-model="form.status" :disabled="Grade">
                    <el-radio :label="1">开启</el-radio>
                    <!-- <el-radio :label="0">停用</el-radio> -->
                    <el-radio :label="5">
                      <span>禁用</span>
                      <el-input
                        placeholder="单行输入"
                        :disabled="Grade"
                        v-model="form.ban_info"
                        size="small"
                      ></el-input>
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="7">
                <el-form-item label="账号" prop="product_name">
                  <el-input
                    :disabled="Grade"
                    placeholder="单行输入"
                    v-model="form.partner_tel"
                    size="small"
                  />合伙人登录后台使用
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="合伙人提成">
              <!-- <span style="color:red">请勿随意修改提成比，修改往从后次月一日生效</span> -->
            </el-form-item>
            <el-row :gutter="20" style="margin-bottom: 20px;">
              <el-col :span="4.5">
                <span class="gaosizuobian" style="width:100px"></span>
                <span>商品订单</span>
                <el-input
                  :disabled="Grade"
                  class="frominput"
                  v-model="form.product_percent"
                  placeholder="单行输入"
                  size="small"
                />%
              </el-col>
              <el-col :span="4">
                <span class="gaosizuobian">外卖订单</span>
                <el-input
                  :disabled="Grade"
                  class="frominput"
                  v-model="form.take_out_percent"
                  placeholder="单行输入"
                  size="small"
                />%
              </el-col>
              <el-col :span="5">
                <span>平台商品订单提成</span>
                <el-input
                  :disabled="Grade"
                  class="frominput"
                  v-model="form.order_percent"
                  placeholder="单行输入"
                  size="small"
                />%
              </el-col>
            </el-row>
            <el-form-item label="代理商">
              <el-select
                v-model="form.agent_id"
                :disabled="Grade"
                size="small"
                class="gaosizuobian"
                placeholder="请选择"
                @change="selectionAgent"
              >
                <el-option
                  v-for="item in Elasticagent"
                  :key="item.key"
                  :label="item.val"
                  :value="item.key"
                  :disabled="item.disabled"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="代理区域">
              <el-select v-model="form.province_code" placeholder="请选择省" disabled>
                <el-option
                  v-for="item in agent_info"
                  :key="item.key"
                  :label="item.val"
                  :value="item.key"
                />
              </el-select>
              <el-select v-model="form.city_code" placeholder="请选择市" disabled>
                <el-option
                  v-for="item in agent_info"
                  :key="item.key"
                  :label="item.val"
                  :value="item.key"
                />
              </el-select>
              <el-select v-model="form.area_code" placeholder="请选择区" disabled>
                <el-option
                  v-for="item in agent_info"
                  :key="item.key"
                  :label="item.val"
                  :value="item.key"
                  :disabled="item.disabled"
                />
              </el-select>
              <el-select v-model="form.street_code" :disabled="Grade" placeholder="请选择县">
                <el-option
                  v-for="item in street"
                  :key="item.area_code"
                  :label="item.area_name"
                  :value="item.area_code"
                  :disabled="!item.status"
                />
              </el-select>
            </el-form-item>
          </div>

          <!-- 权限设置 -->
          <!-- <div class="fromContent" id="Price"></div> -->

          <!-- 其他信息 -->
          <div class="fromContent" id="describe">
            <p class="tabtype">其他信息</p>
            <otherInformation ref="basic" :newEditor="newEditor" :editOther="editOther" r />
          </div>
          <!-- 操作日志 -->
          <div class="fromContent" id="share" v-if="newEditor==2">
            <p class="tabtype">操作日志</p>
            <OperationLog :type="3" :foreign_id="foreign_id" v-if="dialogVisible" />
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import OperationLog from "@/components/OperationLog";
import { exporteurl, exportFile } from "@/utils/user";
import { upimg } from "@/api/user";
import {
  partnerAjax,
  partnerIndex,
  partnerAdd,
  postEdit,
  getEdit,
  getCheck,
  jumpagent
} from "@/api/agent";
import otherInformation from "@/components/otherInformation";

export default {
  // import引入的组件需要注入到对象中才能使用
  components: { OperationLog, otherInformation },
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
      dialogVisible: false,
      exporteurl: exporteurl + upimg,
      tab: 1,
      prohibit: false, //  查看编辑
      Idiot: false, // agent_id 不等于0
      form: { status: 1 },
      rules: {},
      province: [], // 省
      city: [], // 市
      area: [], // 区
      street: [], // 县
      fullscreen: false,
      newEditor: 1,
      editOther: {},
      bankList: {},
      status: "-1",
      status_list: [],
      partner: {},
      Elasticagent: [],
      foreign_id: null,
      agent_info: [],
      add_time_order: "desc", // desc倒序 asc正序
      role_id: "",
      Grade: false
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
    handleClose(done) {
      done();
    },
    tabTouch(e, val) {
      let sun = 0;
      this.tab = val;
      console.log(this.tab);
      switch (val) {
        case 1:
          sun = this.$el.querySelector("#basics").offsetTop;
          break;
        case 2:
          sun = this.$el.querySelector("#Price").offsetTop;
          break;
        case 3:
          sun = this.$el.querySelector("#Price").offsetTop;
          break;
        case 4:
          sun = this.$el.querySelector("#describe").offsetTop;
          break;
        case 5:
          sun = this.$el.querySelector("#share").offsetTop;
          break;
        case 6:
          sun = this.$el.querySelector("#basics").offsetTop;
          break;
        default:
          break;
      }
      document.querySelector("#from").scrollTop = sun - 160;
    },
    orderScroll(e) {
      const scrollTop = this.$el.querySelector("#from").scrollTop;
      if (scrollTop < 1150 && scrollTop > 0) {
        this.tab = 1;
      } else if (scrollTop > 1150 && scrollTop < 1450) {
        this.tab = 2;
      } else if (scrollTop > 1450 && scrollTop < 1950) {
        this.tab = 4;
      } else if (scrollTop > 1950) {
        this.tab = 5;
      }
    },
    addVisible() {
      if (this.$refs.basic) {
        this.$refs["basic"].Initialization();
      }
      this.dialogVisible = true;
      this.prohibit = false;
      this.getAjax("agent");
      this.newEditor = 1;
      this.Grade = false;
      this.form = {
        district_code: "",
        area_code: "",
        city_code: "",
        province_code: "",
        street_code: "",
        status: 1
      };
      this.street = []; // 县
      this.city = []; // 市
      this.area = []; // 区
      this.foreign_id = null;
    },
    qifei(val) {
      const data = {
        phone: val.partner_tel,
        role: 2
      };
      jumpagent(data).then(res => {
        if (res.code == 1) {
          const url = `${res.data.jump_target}/tongshuangxiong?token=${res.data.jump_token}&origin=${res.data.jump_target}`;
          // window.location.href = url;
          exportFile(url);
        } else if (res.code == 2) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getAjax(type, value) {
      const that = this;
      const data = { type, value };
      return new Promise((resolve, reject) => {
        partnerAjax(data).then(res => {
          if (res.code == 1) {
            if (type == "area") {
              that.agent_info = res.data.agent_info;
              that.street = res.data.list;
              that.form.province_code = res.data.agent_info[0].key;
              that.form.city_code = res.data.agent_info[1].key;
              that.form.area_code = res.data.agent_info[2].key;
            } else {
              that.Elasticagent = res.data.list;
              console.log(that.Elasticagent);
            }
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
    },
    selectionAgent(val) {
      console.log(val);
      this.form.street_code = "";
      this.getAjax("area", val);
    },
    // streetcode(val) {
    //   this.form.street_code = val;
    // },
    buonEvent(val, type, row) {
      /** 合伙人buon操作 */
      const that = this;
      let partner_id;
      if (val == 1) {
        if (this.multipleSelection.length != 1) {
          this.$message.error("请选择一条");
          return;
        }
        partner_id = this.multipleSelection[0].partner_id;
      } else partner_id = row.partner_id;
      let ss = "";
      switch (type) {
        case "agree":
          ss = "同意";
          break;
        case "reject":
          ss = "拒绝";
          break;
        case "arraigned":
          ss = "提审";
          break;
        case "again_arraigned":
          ss = "重新提审";
          break;
        case "delete":
          ss = "删除";
          break;
        case "withdraw":
          ss = "撤回";
          break;
        case "start":
          ss = "启用";
          break;
        case "forbidden":
          ss = "禁用";
          break;
        case "stop":
          ss = "停用";
          break;
        default:
          break;
      }

      this.$confirm("此操作" + ss + ", 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return new Promise((resolve, reject) => {
            getCheck({ id: partner_id, type, role_id: this.role_id }).then(
              res => {
                console.log(res);
                if (res.code == 1) {
                  that.$message.success(res.msg);
                  that.getDatalist();
                } else if (res.code == 2) {
                  that.$message.error(res.msg);
                } else {
                  that.$message.error(res.msg);
                }
              }
            );
            // resolve();
          }).catch(error => {
            console.log(error);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    See(val, row) {
      /** 修改查看 */
      const that = this;
      let partner_id;
      if (val == 1) {
        if (this.multipleSelection.length != 1) {
          this.$message.error("请选择一条");
          return;
        }
        if (this.multipleSelection[0].status == 0) {
          this.$message.error("此用户已停用不能编辑");
          return;
        }
        partner_id = this.multipleSelection[0].partner_id;
        this.getAjax("area", this.multipleSelection[0].agent_id);
      } else {
        partner_id = row.partner_id;
        this.getAjax("area", row.agent_id);
      }
      this.foreign_id = partner_id;
      this.prohibit = val == 1 ? false : true;
      this.newEditor = 2;
      if (this.role_id == 2) this.Grade = true;
      return new Promise((resolve, reject) => {
        getEdit({ id: partner_id }).then(res => {
          console.log(res);
          if (res.code == 1) {
            that.editOther = res.data.data;

            that.getAjax("agent");
            that.Idiot = true;
            that.agent_info = res.data.agent_info;

            that.form = res.data.data;
            console.log(that.form);
            that.dialogVisible = true;
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
    },
    setEdit(basic) {
      /** 修改合伙人 */
      const that = this;
      return new Promise((resolve, reject) => {
        postEdit(basic).then(res => {
          console.log(res);
          if (res.code == 1) {
            that.getDatalist();
            that.dialogVisible = false;
            that.$message.success(res.msg);
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
    },
    is_add(basic) {
      /** 添加合伙人 */
      const that = this;
      return new Promise((resolve, reject) => {
        partnerAdd(basic).then(res => {
          console.log(res);
          if (res.code == 1) {
            that.getDatalist();
            that.dialogVisible = false;
            that.$message.success(res.msg);
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
    },
    conmit() {
      /** 提交 */
      const basic = this.$refs["basic"].commitbasic();
      Object.assign(basic, this.form);
      if (this.newEditor == 1) this.is_add(basic);
      else this.setEdit(basic);
    },
    getDatalist() {
      const that = this;
      const data = {
        keyword: this.keyword,
        status: this.status,
        page: this.page,
        limit: this.limit,
        add_time_order: this.add_time_order,
        agent_id: this.agent_id
      };
      return new Promise((resolve, reject) => {
        partnerIndex(data).then(res => {
          console.log(res);
          if (res.code == 1) {
            if (res.action) {
              res.action.map(val => {
                switch (val.tag) {
                  case "add":
                    if (val.display == 1) {
                      that.partner.add = 1;
                    }
                    break;
                  case "check":
                    if (val.display == 1) {
                      that.partner.check = 1;
                    }
                    break;
                  case "edit":
                    if (val.display == 1) {
                      that.partner.edit = 1;
                    }
                    break;
                  case "jumppartner":
                    if (val.display == 1) {
                      that.partner.jumppartner = 1;
                    }
                    break;
                }
              });
            }
            if (res.agent_map) {
              that.agent = res.agent_map;
            }
            that.datalist = res.data.list;
            that.total = res.data.count;
            that.status_list = res.data.status_info;
            that.role_id = res.data.role_id;
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
</style>
