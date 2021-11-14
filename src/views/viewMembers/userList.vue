<!-- tsx用户列表 -->
<template>
  <div class="package">
    <div class="hide">
      <el-select
        v-if="agent.length>0"
        v-model="agent_id"
        style="margin-bottom: 0px;"
        class="maright"
        placeholder="请选择"
      >
        <el-option
          v-for="item in agent"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>
      <span>时间：</span>
      <el-select v-model="date_type" style="margin-bottom: 0px;" class="maright" placeholder="请选择">
        <el-option
          v-for="item in date_typemap"
          :key="item.key"
          :label="item.val"
          :value="item.key"
        />
      </el-select>
      <el-date-picker
        v-model="span"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      ></el-date-picker>
      <el-input
        v-model="keyword"
        class="input"
        prefix-icon="el-icon-search"
        placeholder="会员昵称/会员手机号"
        @change="inputentry"
      />
      <el-button type="success" class @click="page=1,getDatalist()">查询</el-button>
      <el-button type="primary" class @click="addUser()">新增</el-button>
      <el-button type="warning" @click="editUser()">编辑</el-button>
      <el-button v-if="derive==1" plain class @click="exporte">导出</el-button>
    </div>
    <template>
      <el-table
        v-loading="loading"
        :data="datalist"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          fixed
          type="selection"
          row-key="property_id"
          width="55"
          prop="property_id"
        />
        <el-table-column prop="user_id" label="用户id" width="70">
          <template slot-scope="scope">
            <router-link
              class="jump"
              :to="{ path: '/fansDetails' , name:'fansDetails', params: { userId: scope.row.user_id}}"
            >{{ scope.row.user_id }}</router-link>
          </template>
        </el-table-column>
        <el-table-column prop="user_nickname" label="会员昵称" />
        <el-table-column prop="user_realname" label="真实姓名" width="120" />
        <el-table-column prop="user_tel" label="会员手机号" width="150" />
        <el-table-column prop="user_credit" label="会员积分" />
        <el-table-column prop="user_create_time" label="注册时间" width="90" />
        <el-table-column prop="user_lasttime" label="上次登录" width="90" />
        <el-table-column prop="user_login_num" label="登录次数" />
        <el-table-column prop="user_gold" label="金币" />
        <el-table-column prop="user_midou" label="蜜豆" />
        <el-table-column prop="user_balance" label="钱包余额" />
        <el-table-column prop="butler_realname" label="所属管家 —姓名" />
        <el-table-column prop="butler_user_tel" label="所属管家 —手机" />
        <el-table-column prop="identity_name" label="会员身份">
          <template slot-scope="scope">
            <pre>{{ scope.row.identity_name | identity }}</pre>
          </template>
        </el-table-column>
        <el-table-column prop="grade_name" label="会员等级" />
        <el-table-column prop="property_name" label="所属管家 —楼盘" />
        <el-table-column prop="user_yesno_name" label="启用状态" />
        <el-table-column prop="count" label="订单数">
          <template slot-scope="scope">
            <router-link
              class="jump"
              :to="{ path: '/userOrderList' , name:'userOrderList', params: { userId: scope.row.user_id}}"
            >{{ scope.row.count }}</router-link>
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
    <!-- 弹框 -->
    <PublicDialog
      v-if="dialogVisible"
      :tsx-title="addedit==1?'添加用户信息':'修改用户信息'"
      :is-show-visible="dialogVisible"
      :center="true"
      @handleClose="handleClose"
    >
      <div slot="forms">
        <el-form ref="form" :model="form" label-width="150px">
          <el-form-item label="代理商">
            <el-select v-model="form.agent_id" class="maright input" placeholder="代理商">
              <el-option
                v-for="item in agent"
                :key="item.agent_id"
                :label="item.name"
                :value="item.agent_id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="身份">
            <el-select
              v-model="form.identity_id"
              multiple
              class="maright input"
              placeholder="请选择身份"
            >
              <el-option
                v-for="item in identity"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="手机号码" prop="name">
            <el-input v-model="form.user_tel" maxlength="11" class="input" />
          </el-form-item>

          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.user_nickname" class="input" />
          </el-form-item>

          <el-form-item label="蜜豆" prop="name">
            <el-input v-model="form.user_midou" :disabled="role==0?false:true" class="input" />
          </el-form-item>

          <el-form-item label="是否开通超级会员">
            <el-radio-group v-model="form.supper_vip">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="状态">
            <el-radio-group v-model="form.status">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="2">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div style="display: flex;justify-content: center;">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="commit">确 定</el-button>
        </div>
      </div>
    </PublicDialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
/* eslint-disable no-alert */
/* eslint-disable */
import { turnDate, exporteurl, exportFile } from "@/utils/user";
import { userList, useradd, useredit } from "@/api/userAdministration";
import PublicDialog from "@/components/PublicDialog";
import { pickerOptions, parseTime } from "@/utils/index";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { PublicDialog },
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
      derive: "",
      agent: [],
      agent_id:
        JSON.parse(localStorage.getItem("user")).agent_id == 1
          ? ""
          : JSON.parse(localStorage.getItem("user")).agent_id,
      form: {},
      dialogVisible: false,
      identity: [],
      addedit: 1,
      role: "",
      date_type: "1",
      date_typemap: [
        { key: "1", val: "登录时间" },
        { key: "2", val: "注册时间" }
      ],
      pickerOptions: {
        shortcuts: pickerOptions
      },
      span: []
    };
  },
  // 过滤器
  filters: {
    identity(val) {
      return val.map(res => res.value).join("\n");
    }
  },
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
    inputentry(e) {
      // 搜索 输入
      this.keyword = e;
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
    },
    commit() {
      console.log(this.form);
      if (this.addedit == 1) {
        useradd(this.form).then(res => {
          this.loading = false;
          if (res.code == 1) {
            this.$message.success(res.msg);
            this.dialogVisible = false;
            this.page = 1;
            this.getDatalist();
          } else if (res.code === 2) {
            this.$message.error(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        useredit(this.form).then(res => {
          this.loading = false;
          if (res.code == 1) {
            this.$message.success(res.msg);
            this.dialogVisible = false;
            this.page = 1;
            this.getDatalist();
          } else if (res.code === 2) {
            this.$message.error(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },
    editUser() {
      if (this.multipleSelection.length != 1) {
        this.$message.error("只能选择一条");
        return "傻逼";
      }
      this.dialogVisible = true;
      // console.log(this.multipleSelection);
      this.form = this.multipleSelection[0];
      this.addedit = 2;
    },
    addUser() {
      this.form = {
        agent_id: JSON.parse(localStorage.getItem("user")).agent_id,
        supper_vip: 0,
        status: 2,
        identity_id: []
      };
      this.addedit = 1;
      this.dialogVisible = true;
    },
    exporte() {
      /** 导出 */
      let start_date = "";
      let stop_date = "";
      if (Array.isArray(this.span)) {
        if (this.span && this.span != null && this.span[0] instanceof Date) {
          start_date = turnDate(this.span[0], 3);
        } else start_date = this.span[0];
        if (this.span && this.span != null && this.span[1] instanceof Date) {
          stop_date = turnDate(this.span[1], 3);
        } else stop_date = this.span[1];
      }
      let url = `${exporteurl}/user/index/userexport?keyword=${
        this.keyword
      }&agent_id=${this.agent_id}&date_type=${
        this.date_type
      }&start_date=${start_date}&stop_date=${stop_date}&token=${localStorage.getItem(
        "Token"
      )}`;
      exportFile(url);
    },
    getDatalist() {
      let start_date = "";
      let stop_date = "";
      if (Array.isArray(this.span)) {
        if (this.span && this.span != null && this.span[0] instanceof Date) {
          start_date = turnDate(this.span[0], 3);
        } else start_date = this.span[0];
        if (this.span && this.span != null && this.span[1] instanceof Date) {
          stop_date = turnDate(this.span[1], 3);
        } else stop_date = this.span[1];
      }

      const data = {
        page: this.page,
        keyword: this.keyword,
        agent_id: this.agent_id,
        limit: this.limit,
        date_type: this.date_type,
        start_date,
        stop_date
      };
      this.loading = true;
      const that = this;
      return new Promise((resolve, reject) => {
        userList(data).then(res => {
          this.loading = false;
          if (res.code == 1) {
            that.total = res.data.list.total;
            that.datalist = res.data.list.list;
            if (res.action) {
              res.action.map(val => {
                if (val.tag == "userexport" && val.display == 1) {
                  that.derive = 1;
                }
              });
            }
            if (res.agent_map) {
              that.agent = res.agent_map;
            }
            that.identity = res.data.ident_map;
            that.role = res.role;
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
  activated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
@import "src/styles/hide.scss";
</style>