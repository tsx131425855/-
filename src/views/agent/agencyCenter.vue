<!-- tsx代理商中心 -->
<template>
  <div class="package">
    <div class="hide backtsx">
      <el-button
        type="primary"
        v-if="agencyCenter.add==1"
        @click="addVisible"
        size="small"
        icon="el-icon-circle-plus"
      >新增</el-button>
      <el-button
        type="warning"
        v-if="agencyCenter.edit==1"
        @click="See(1)"
        size="small"
        icon="el-icon-edit-outline"
      >修改</el-button>
      <el-button
        type="danger"
        v-if="agencyCenter.check==1"
        @click="getagentcheck(5)"
        size="small"
        icon="el-icon-circle-close"
      >禁用</el-button>
      <el-button
        type="info"
        v-if="agencyCenter.check==1"
        @click="getagentcheck(0)"
        size="small"
        icon="el-icon-warning"
      >停用</el-button>
      <el-button
        v-if="agencyCenter.check==1"
        type="warning"
        @click="getagentcheck(1)"
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
      <el-select v-model="status" size="small" class="gaosizuobian" placeholder="请选择">
        <el-option v-for="item in status_list" :key="item.key" :label="item.val" :value="item.key" />
      </el-select>
      <el-input
        v-model="keyword"
        size="small"
        class="input gaosizuobian"
        prefix-icon="el-icon-search"
        placeholder="代理商id/名称/代理区域"
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
        <el-table-column prop="agent_id" label="代理商ID" />
        <el-table-column prop="name" label="代理商名称" />
        <el-table-column prop="agent_tel" label="登录账号" />
        <el-table-column prop="contract_end_time" label="合同到期时间" />
        <el-table-column prop="create_time" label="创建时间" width="90" align="center" />
        <el-table-column prop="status_text" label="状态" />
        <el-table-column prop="agent_area" label="代理区/县" />
        <el-table-column prop="partner_count" label="下属合伙人（个）" />
        <el-table-column prop="store_count" label="下属商家（个）" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              v-if="agencyCenter.info==1"
              @click="See(2,scope.row)"
            >查看</el-button>
            <el-button
              type="text"
              size="small"
              v-if="agencyCenter.jumpagent==1"
              @click="qifei(scope.row)"
            >前往代理商后台</el-button>
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
      :before-close="handleClose"
    >
      <div class="addhide">
        <el-col :span="6">
          <el-button size="small" @click="dialogVisible=false;mapshow = false;">关闭</el-button>
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
        <div class="tabtype" :class="tab==2?'tabbott':''" @click="tabTouch($event,2)">
          权限设置
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
      <div
        class="fromSlide"
        :style="fullscreen?'height: auto;':''"
        id="from"
        ref="Box"
        @scroll="orderScroll"
      >
        <!-- 基础信息 -->
        <el-form ref="form" :model="form" :disabled="prohibit" :rules="rules" label-width="100px">
          <div class="fromContent" id="basics">
            <p class="tabtype">基础信息</p>
            <el-row>
              <el-col :span="5">
                <el-form-item label="代理商名称" :required="true">
                  <el-input :disabled="Grade" placeholder="单行输入" v-model="form.name" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="状态" :required="true">
                  <el-radio-group v-model="form.status" :disabled="Grade">
                    <el-radio :label="1">开启</el-radio>
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
                <el-form-item label="账号" :required="true">
                  <el-input
                    :disabled="Grade"
                    placeholder="单行输入"
                    v-model="form.agent_tel"
                    size="small"
                    maxlength="11"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20" style="margin-bottom: 20px;">
              <el-col :span="4.5">
                <span class="gaosizuobian" style="width:100px">平台抽成</span>
                <span>商品订单</span>
                <el-input
                  class="frominput"
                  disabled
                  v-model="agent_base_info.product_order_scale"
                  placeholder="单行输入"
                  size="small"
                />%
              </el-col>
              <el-col :span="4">
                <span>外卖订单</span>
                <el-input
                  class="frominput"
                  disabled
                  v-model="agent_base_info.waimai_order_scale"
                  placeholder="单行输入"
                  size="small"
                />%
              </el-col>
            </el-row>

            <el-row :gutter="20" style="    margin-bottom: 20px;">
              <el-col :span="4.5">
                <span class="gaosizuobian" style="width:100px">代理商提成</span>
                <span>外卖订单</span>
                <el-input
                  class="frominput"
                  disabled
                  v-model="agent_base_info.waimai_order_agent_scale"
                  placeholder="单行输入"
                  size="small"
                />%
              </el-col>
              <!-- <el-col :span="4">
                <span>平台商品订单</span>
                <el-input
                  class="frominput"
                  disabled
                  v-model="agent_base_info.waimai_order_agent_scale"
                  placeholder="单行输入"
                  size="small"
                />%
              </el-col>-->
            </el-row>
            <el-form-item label="代理区域" :required="true">
              <el-select
                v-model="form.province_code"
                :disabled="Grade"
                @change="provinceCode"
                placeholder="请选择省"
              >
                <el-option
                  v-for="item in province"
                  :key="item.area_code"
                  :label="item.area_name"
                  :value="item.area_code"
                />
              </el-select>
              <el-select
                v-model="form.city_code"
                v-if="city.length>0"
                @change="cityCode"
                :disabled="Grade"
                placeholder="请选择市"
              >
                <el-option
                  v-for="item in city"
                  :key="item.area_code"
                  :label="item.area_name"
                  :value="item.area_code"
                />
              </el-select>

              <el-select
                v-model="form.area_code"
                @change="areaCode"
                v-if="area.length>0"
                placeholder="请选择区"
                :disabled="Grade"
              >
                <el-option
                  v-for="item in area"
                  :key="item.area_code"
                  :label="item.area_name"
                  :value="item.area_code"
                  :disabled="item.status"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="代理区域经纬度" :required="true" :disabled="Grade">
              <BaiduMap
                :localization="localization"
                :centers="center"
                @lonlat="getlonlat"
                v-if="mapshow"
              />
            </el-form-item>
          </div>

          <!-- 权限设置 -->
          <div class="fromContent" id="Price">
            <p class="tabtype">权限设置</p>
            <div class="bothSides" style="justify-content: flex-start;">
              <div class="fromContent">
                <p>广告-是否需审核</p>
                <el-radio-group v-model="form.advert_status">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </div>
              <div class="fromContent" style="margin-left: 30px;">
                <p>消息-是否需审核</p>
                <el-radio-group v-model="form.msg_status">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </div>
            </div>
          </div>

          <!-- 其他信息 -->
          <div class="fromContent" id="describe">
            <p class="tabtype">其他信息</p>
            <otherInformation
              v-if="dialogVisible"
              ref="basic"
              :newEditor="newEditor"
              :editOther="editOther"
            />
          </div>
          <!-- 操作日志 -->
          <div class="fromContent" id="share" v-if="newEditor==2">
            <p class="tabtype">操作日志</p>
            <OperationLog :type="2" :foreign_id="foreign_id" v-if="dialogVisible" />
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
import BaiduMap from "@/components/Baidu_Map";
import { exporteurl, CopyObject, exportFile } from "@/utils/user";
import { upimg } from "@/api/user";
import otherInformation from "@/components/otherInformation";
import {
  agentBaseInfo,
  agentAddress,
  agentAdd,
  agentEdit,
  agentlists,
  agentCheck,
  agentInfo,
  jumpagent
} from "@/api/agent";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { OperationLog, otherInformation, BaiduMap },
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
      fullscreen: false, // 弹框全屏
      form: {
        advert_status: 0,
        msg_status: 0,
        status: 1
      },
      center: { lng: 0, lat: 0 },
      rules: {},
      province: [], // 省
      city: [], // 市
      area: [], // 区
      township: [],
      agent_base_info: {}, // 提成
      bank_list: [], // 银行
      newEditor: 1, // 1 新增  2  修改
      status: 2,
      sort_type: "desc",
      sort_name: "create_time",
      agencyCenter: {},
      status_list: [
        { key: 0, val: "停用" },
        { key: 1, val: "启用" },
        { key: 5, val: "禁用" },
        { key: 2, val: "全部" }
      ],
      editOther: {},
      foreign_id: null,
      Grade: false,
      role: "",
      localization: "",
      mapshow: false
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
        arr.push(res);
      });
      this.multipleSelection = arr;
    },
    handleClose(done) {
      this.mapshow = false;
      done();
    },
    addVisible() {
      /** 新增 */
      if (this.$refs.basic) {
        this.$refs["basic"].Initialization();
      }
      this.dialogVisible = true;
      this.prohibit = false;
      this.Grade = false;
      this.getAddress("");
      this.newEditor = 1;
      this.form = {
        area_code: "",
        city_code: "",
        province_code: "",
        advert_status: 0,
        msg_status: 0,
        status: 1
      };
      this.city = []; // 市
      this.area = []; // 区
      this.foreign_id = "";
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
      if (scrollTop < 376 && scrollTop > 0) {
        this.tab = 1;
      } else if (scrollTop > 376 && scrollTop < 573) {
        this.tab = 2;
      } else if (scrollTop > 573 && scrollTop < 1400) {
        this.tab = 4;
      } else if (scrollTop > 1400) {
        this.tab = 5;
      }
    },
    qifei(val) {
      const data = {
        phone: val.agent_tel,
        role: 1
      };
      jumpagent(data).then(res => {
        if (res.code == 1) {
          // ${res.data.jump_target}
          const url = `${res.data.jump_target}/tongshuangxiong?token=${res.data.jump_token}&origin=${res.data.jump_target}`;
          console.log(url);
          exportFile(url);
          // location.href = url;
        } else if (res.code == 2) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    provinceCode(val) {
      /** 省 */
      this.city = []; // 市
      this.area = []; // 区
      this.form.area_code = ""; // 区
      this.form.city_code = ""; // 市

      this.getAddress(val);
    },
    cityCode(val) {
      /** shi */
      this.area = []; // 区
      this.form.area_code = ""; // 区
      this.getAddress(val);
    },
    areaCode(val) {
      /** 区 */
      this.form.town_detail = "";
      this.township = [];
      // this.getAddress(val);
      let ss = "";
      if (
        this.form.province_code.length > 0 &&
        this.form.city_code.length > 0 &&
        this.form.area_code.length > 0
      ) {
        this.province.map(res => {
          if (res.area_code == this.form.province_code) ss = ss + res.area_name;
        });
        this.city.map(res => {
          if (res.area_code == this.form.city_code) ss = ss + res.area_name;
        });
        this.area.map(res => {
          if (res.area_code == this.form.area_code) ss = ss + res.area_name;
        });
        this.localization = ss;
        this.mapshow = true;
      }
    },
    getlonlat(val) {
      console.log(val);
      Object.assign(this.form, val);
      this.form = CopyObject(this.form);
    },
    countryCode(val) {
      console.log(val);
    },
    getAddress(where) {
      /** 查看 */
      const that = this;
      const data = { where };
      return new Promise((resolve, reject) => {
        agentAddress(data).then(res => {
          if (res.code == 1) {
            switch (res.data.level) {
              case 1:
                that.province = res.data.list;
                break;
              case 2:
                that.city = res.data.list;
                break;
              case 3:
                that.area = res.data.list;
                break;
              case 4:
                that.township = res.data.list;
                break;
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
    getagentcheck(val) {
      const that = this;
      if (this.multipleSelection.length != 1) {
        this.$message.error("请选择一条");
        return;
      }

      let ss = "";
      switch (val) {
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
        case 1:
          ss = "启用";
          break;
        case 5:
          ss = "禁用";
          break;
        case 0:
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
            agentCheck({
              agent_id: this.multipleSelection[0].agent_id,
              status: val
            }).then(res => {
              if (res.code == 1) {
                that.$message.success(res.msg);
                that.getDatalist();
              } else {
                that.$message.error(res.msg);
              }
            });
            resolve();
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
    getagentBaseInfo() {
      const that = this;
      return new Promise((resolve, reject) => {
        agentBaseInfo({}).then(res => {
          if (res.code == 1) {
            if (res.data.agent_base_info != null) {
              that.agent_base_info = res.data.agent_base_info;
            }
            that.bank_list = res.data.bank_list;
          } else {
            that.$message.error(res.msg);
          }
        });
        resolve();
      }).catch(error => {
        console.log(error);
      });
    },
    See(val, row) {
      /** 修改查看 */
      const that = this;
      let agent_id;
      if (val == 1) {
        if (this.multipleSelection.length != 1) {
          this.$message.error("请选择一条");
          return;
        }
        if (this.multipleSelection[0].status == 0) {
          this.$message.error("此用户已停用不能编辑");
          return;
        }
        agent_id = this.multipleSelection[0].agent_id;
      } else agent_id = row.agent_id;
      this.foreign_id = agent_id;
      this.prohibit = val == 1 ? false : true;
      this.newEditor = 2;

      if (this.role == 1) this.Grade = true;
      return new Promise((resolve, reject) => {
        agentInfo({ agent_id }).then(res => {
          console.log(res);
          if (res.code == 1) {
            that.editOther = res.data;
            that.form = res.data;

            // that.form.province_code = res.data.province_code + "";
            // that.form.area_code = res.data.area_code + "";
            // that.form.city_code = res.data.city_code + "";
            that.getAddress();
            that.getAddress(res.data.province_code);
            that.getAddress(res.data.city_code);
            console.log(that.form);
            that.center = { lng: res.data.lng, lat: res.data.lat };
            that.mapshow = true;
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
      /** 修改代理商 */
      const that = this;
      return new Promise((resolve, reject) => {
        agentEdit(basic).then(res => {
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
      /** 添加代理商 */
      const that = this;
      return new Promise((resolve, reject) => {
        agentAdd(basic).then(res => {
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
        sort_type: this.sort_type,
        sort_name: this.sort_name,
        agent_id: this.agent_id,
        page: this.page,
        limit: this.limit
      };
      return new Promise((resolve, reject) => {
        agentlists(data).then(res => {
          console.log(res);
          if (res.code == 1) {
            if (res.action) {
              res.action.map(val => {
                switch (val.tag) {
                  case "add":
                    if (val.display == 1) {
                      that.agencyCenter.add = 1;
                    }
                    break;
                  case "check":
                    if (val.display == 1) {
                      that.agencyCenter.check = 1;
                    }
                    break;
                  case "edit":
                    if (val.display == 1) {
                      that.agencyCenter.edit = 1;
                    }
                    break;
                  case "info":
                    if (val.display == 1) {
                      that.agencyCenter.info = 1;
                    }
                    break;
                  case "jumpagent":
                    if (val.display == 1) {
                      that.agencyCenter.jumpagent = 1;
                    }
                    break;
                }
              });
            }
            if (res.agent_map) {
              that.agent = res.agent_map;
            }
            that.datalist = res.data.list;
            that.total = res.data.total;
            that.role = res.role;
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
    this.getagentBaseInfo();
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
