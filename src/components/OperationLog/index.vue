
<!-- tsx -->
<template>
  <div class="jianimab">
    <!-- <div v-for="(item,index) in log" :key="index">
      <div class="gunyuan">
        <span>{{item.name}}</span>
        <span>{{item.tiem}}</span>
      </div>
      <p style="padding: 0 20px;">{{item.content}}</p>
    </div>-->
    <el-collapse accordion>
      <el-collapse-item :name="index" v-for="(item,index) in log" :key="index">
        <template slot="title" style="height: auto;">
          <div style="width: 100%;height: auto;line-height: 1.5;">
            <div class="mamaju">
              <span>{{item.admin_user_name}}</span>
              <span>{{item.create_time}}</span>
            </div>
            <div>{{item.log_info}}</div>
          </div>
        </template>
        <div class="mamaju" v-if="item.type=='update'">
          <div style="width:45%">
            <p>修改之前数据</p>
            <p style="width:100%;word-wrap: break-word;word-break: normal;">{{item.log_before }}</p>
            <!-- <p v-if="item.log_before.name">
              <span>代理商名称:</span>
              {{item.log_before.name}}
            </p>
            <p v-if="item.log_before.status">
              <span>状态:</span>
              {{item.log_before.status}}
            </p>
            <p v-if="item.log_before.agent_tel">
              <span>账号:</span>
              {{item.log_before.agent_tel}}
            </p>
            <p v-if="item.log_before.advert_status">
              <span>广告-是否需审核:</span>
              {{item.log_before.advert_status}}
            </p>
            <p v-if="item.log_before.msg_status">
              <span>消息-是否需审核:</span>
              {{item.log_before.msg_status}}
            </p>
            <p v-if="item.log_before.post_code">
              <span>邮政编码:</span>
              {{item.log_before.post_code}}
            </p>
            <p v-if="item.log_before.address">
              <span>联系地址:</span>
              {{item.log_before.address}}
            </p>
            <p v-if="item.log_before.mobile">
              <span>客服电话:</span>
              {{item.log_before.mobile}}
            </p>
            <p v-if="item.log_before.contract_start_time&&item.log_before.contract_end_time">
              <span>合同时间:</span>
              {{item.log_before.contract_start_time}}
              {{item.log_before.contract_end_time}}
            </p>
            <p v-if="item.log_before.contract_file">
              <span>合同文件:</span>
              {{item.log_before.contract_file}}
            </p>
            <p v-if="item.log_before.contract_file">
              <span>代理商类型:</span>
              {{item.log_before.group_type}}
            </p>
            <p v-if="item.log_before.company_name">
              <span>企业名称:</span>
              {{item.log_before.company_name}}
            </p>
            <p v-if="item.log_before.company_register_number">
              <span>企业注册号:</span>
              {{item.log_before.company_register_number}}
            </p>
            <p v-if="item.log_before.company_taxation_number">
              <span>税务号:</span>
              {{item.log_before.company_taxation_number}}
            </p>
            <p v-if="item.log_before.bank_id">
              <span>开户行:</span>
              {{item.log_before.bank_id}}
            </p>
            <p v-if="item.log_before.bank_branch_name">
              <span>所在分行:</span>
              {{item.log_before.bank_branch_name}}
            </p>
            <p v-if="item.log_before.user_name">
              <span>姓名:</span>
              {{item.log_before.user_name}}
            </p>
            <p v-if="item.log_before.card_number">
              <span>身份证号码:</span>
              {{item.log_before.card_number}}
            </p>
            <p v-if="item.log_before.person_bank_name">
              <span>收款账户银行:</span>
              {{item.log_before.person_bank_name}}
            </p>
            <p v-if="item.log_before.person_bank_branch_name">
              <span>收款账号分行:</span>
              {{item.log_before.person_bank_branch_name}}
            </p>
            <p v-if="item.log_before.person_bank_number">
              <span>收款账号:</span>
              {{item.log_before.person_bank_number}}
            </p>
            <p v-if="item.log_before.business_license_image">
              <span>收款账号:</span>
              <a :href="item.log_before.business_license_image"></a>
            </p>
            <p v-if="item.log_before.business_license_image">
              <span>营业执照:</span>
              <a :href="item.log_before.business_license_image"></a>
            </p>
            <p v-if="item.log_before.bank_allow_image">
              <span>银行开户许可证:</span>
              <a :href="item.log_before.bank_allow_image"></a>
            </p>
            <p v-if="item.log_before.company_taxation_image">
              <span>税务登记证:</span>
              <a :href="item.log_before.company_taxation_image"></a>
            </p>
            <p v-if="item.log_before.card_front_image">
              <span>身份证正面:</span>
              <a :href="item.log_before.card_front_image"></a>
            </p>
            <p v-if="item.log_before.card_back_image">
              <span>身份证反面:</span>
              <a :href="item.log_before.card_back_image"></a>
            </p>
            <p v-if="item.log_before.user_hold_card_image">
              <span>手持身份证照片:</span>
              <a :href="item.log_before.user_hold_card_image"></a>
            </p>
            <p v-if="item.log_before.bank_card_image">
              <span>银行卡照片:</span>
              <a :href="item.log_before.bank_card_image"></a>
            </p>-->
          </div>

          <div style="width:45%">
            <p>修改之后数据</p>
            <span style="width:100%;word-wrap: break-word;word-break: normal;">{{item.log_after}}</span>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
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
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';

import { daily } from "@/api/agent";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    type: {
      type: Number
    },
    foreign_id: {
      type: Number,
      default: 0
    }
  },
  data() {
    // 这里存放数据
    return {
      log: [],
      page: 1,
      limit: 10,
      total: 0
    };
  },
  // 过滤器
  filters: {
    unicode(val) {
      return val;
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
      this.getData();
    },
    handleSizeChange(val) {
      this.limit = val;
      console.log(`每页 ${val} 条`);
      localStorage.setItem("limit", val);
      this.page = 1;
      this.getData();
    },
    getData() {
      /** 查看 */
      const that = this;
      const data = {
        foreign_id: this.foreign_id,
        type: this.type,
        page: this.page,
        limit: this.limit
      };
      return new Promise((resolve, reject) => {
        daily(data).then(res => {
          if (res.code == 1) {
            that.total = res.data.total;
            that.log = res.data.list;
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
    this.getData();
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
.jianimab {
  border: 1px solid rgb(193, 193, 193);
  background-color: rgb(255, 255, 255);
  width: 100%;
}
.gunyuan {
  display: flex;
  align-content: center;
  justify-content: space-between;
  border-top: 1px solid rgb(193, 193, 193);
  border-bottom: 1px solid rgb(193, 193, 193);
  padding: 0 20px;
  height: 30px;
  line-height: 1;
  span {
    line-height: 2;
  }
}
.jianimab > div:first-child .gunyuan {
  border-top: none;
}
.mamaju {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
}
</style>
