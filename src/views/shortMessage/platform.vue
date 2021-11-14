<!-- tsx 短信平台 -->
<template>
  <div class="package">
    <div class="hide backtsx">
      <el-input
        v-model="keyword"
        class="input"
        style="margin-left: 10px;"
        prefix-icon="el-icon-search"
        placeholder="短信编导/内容/操作人"
      />
      <el-button type="success" icon="el-icon-search" @click="search">查询</el-button>
    </div>
    <div class="feiwu">
      <el-button type="primary" @click="sendOut">发送短信</el-button>
      <el-button type="warning" @click="see">查看</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="datalist"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column fixed type="selection" width="55" />
      <el-table-column prop="phone" label="操作人" />
      <el-table-column prop="role_name" label="账号类型" />
      <el-table-column prop="sms_code" label="发送编号" />
      <el-table-column prop="send_content" label="发送内容" />
      <el-table-column prop="create_time" label="发送时间" />
      <!-- <el-table-column prop="status_text" label="发送状态" /> -->
      <el-table-column prop="success_count" label="成功提交数" />
      <el-table-column prop="fail_count" label="无效号码数" />
      <el-table-column prop="black_count" label="黑名单数" />
    </el-table>

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
      :is-show-visible="dialogVisible"
      :tsx-title="addEdit==1?'发送短信':'查看'"
      tsx-width="1000px"
      @handleClose="handleClose"
    >
      <div slot="forms">
        <el-form v-show="addEdit==1" ref="form" :model="form" label-width="80px">
          <el-form-item label="发送时间">
            <el-col :span="6">
              <el-date-picker
                v-model="form.send_time"
                type="datetime"
                placeholder="Enler Date"
                style="width: 100%;"
              />
            </el-col>
          </el-form-item>

          <el-form-item label="选择模板">
            <el-select
              v-model="form.tpl_id"
              class="maright legf"
              placeholder="请选择"
              @change="gettemplateid"
            >
              <el-option
                v-for="item in sendOutData.message_template_data"
                :key="item.tpl_id"
                :label="item.msg_title"
                :value="item.tpl_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发送内容">
            <el-input v-model="form.desc" type="textarea" disabled :maxlength="500" />
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input v-model="form.phone" type="textarea" placeholder="手机号码可以用英文,隔开" />
          </el-form-item>
          <el-form-item label="活动性质">
            <el-checkbox-group v-model="form.identity_type">
              <el-checkbox
                v-for="(item,index) in sendOutData.identity_map_data"
                :key="index"
                :label="item.key"
                name="type"
              >{{ item.value }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button @click="onSubmit">提交</el-button>
            <el-button @click="handleClose">取消</el-button>
          </el-form-item>
        </el-form>

        <div v-show="addEdit==3" class="getboss">
          <div class="gettype">
            <div>
              <el-col :span="6">
                <span>操作人：{{ showdata.phone }}</span>
              </el-col>
              <el-col :span="7">
                <span>所属物业公司：{{ showdata.property_name }}</span>
              </el-col>
              <el-col :span="6">
                <span>发送时间：{{ showdata.create_time }}</span>
              </el-col>
              <el-col :span="6">
                <!-- <span>发送状态：{{ showdata.phone }}</span> -->
              </el-col>
            </div>
            <div>发送编号：{{ showdata.sms_code }}</div>
          </div>
          <div class="gettype">
            <div>
              <el-col :span="6">
                <span>成功提交条数：{{ showdata.success_count }}</span>
              </el-col>
              <el-col :span="7">
                <span>无效号码数{{ showdata.fail_count }}</span>
              </el-col>
              <el-col :span="6">
                <span>黑名单数{{ showdata.black_count }}</span>
              </el-col>
            </div>
          </div>
          <div class="getconnit">
            <p>发送内容</p>
            <div>{{ showdata.send_content }}</div>
          </div>
          <el-button style="margin-left:50px;margin-top:20px" @click="handleClose">关闭</el-button>
        </div>
      </div>
    </PublicDialog>
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
// import headControl from "@/components/headControl";
import PublicDialog from "@/components/PublicDialog";
import {
  assetlists,
  assetinfo,
  assetmsg_info,
  assetsend_sms
} from "@/api/shortMessage";
import { turnDate } from "@/utils/user";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { PublicDialog },
  // 过滤器
  filters: {},
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
      dialogVisible: false,
      form: { identity_type: [] },
      addEdit: 1,
      showdata: {},
      sendOutData: {}
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
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
  destroyed() {},
  // 方法集合
  methods: {
    handleCurrentChange(val) {
      // 页数
      this.page = val;
      this.getDatalist();
    },
    handleSizeChange(val) {
      this.limit = val;
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
    handleClose() {
      this.dialogVisible = false;
    },
    gettemplateid(val) {
      this.sendOutData.message_template_data.map(i => {
        if (i.tpl_id == val) this.form.desc = i.tpl_content;
      });
    },
    sendOut() {
      assetmsg_info({}).then(res => {
        if (res.code == 1) {
          this.sendOutData = res.data;
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      });
      this.addEdit = 1;
      this.dialogVisible = true;
    },
    search(val) {
      this.keyword = val.keyword;
      this.page = 1;
      this.getDatalist();
    },
    see() {
      if (this.multipleSelection.length == 1) {
        this.addEdit = 3;
        this.dialogVisible = true;
        assetinfo({
          log_id: this.multipleSelection[0].log_id
        }).then(res => {
          if (res.code == 1) {
            this.showdata = res.data;
          } else {
            this.$message({ message: res.msg, type: "error" });
          }
        });
      }
    },
    onSubmit() {
      const data = {
        send_time: turnDate(this.form.send_time, 3),
        tpl_id: this.form.tpl_id,
        phone: this.form.phone ? this.form.phone.split(",") : [],
        identity_type: this.form.identity_type
      };
      assetsend_sms(data).then(res => {
        if (res.code == 1) {
          this.dialogVisible = false;
          this.form = {
            identity_type: [],
            phone: "",
            tpl_id: ""
          };
          this.page = 1;
          this.getDatalist();
          this.$message({ message: res.msg, type: "success" });
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      });
    },
    getDatalist() {
      assetlists({
        keyword: this.keyword,
        page: this.page,
        limit: this.limit
      }).then(res => {
        if (res.code == 1) {
          this.datalist = res.data.list;
          this.total = res.data.total;
          this.status_map = res.data.status_map;
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      });
    }
  }, // 生命周期 - 销毁完成
  ctivated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>

<style lang='scss' scoped>
// @import url(); 引入公共css类
@import "src/styles/hide.scss";
.feiwu {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  margin-bottom: 20px;
}
.gettype {
  height: 80px;
  width: 90%;
  margin: 0 auto;
  border-bottom: 1px solid #cccccc;
  justify-content: space-around;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-self: start;
}
.getboss {
  width: 100%;
  border-top: 1px solid #cccccc;
}
.getconnit {
  width: 90%;
  margin: 0 auto;
}
</style>
