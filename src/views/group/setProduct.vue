<template>
  <div class="root">
    <el-form title="基础设置" style="max-width: 500px" ref="form" :model="form" label-width="120px">
      <el-form-item label="拼团价:">
        <el-input style="width: 200px; margin-right: 12px;" v-model="form.price"></el-input>
      </el-form-item>
      <el-form-item label="成团人数:">
        <el-input style="width: 200px; margin-right: 12px;" v-model="form.number" />
        <span>人</span>
      </el-form-item>
      <el-form-item label="成团时限:">
        <el-input style="width: 200px; margin-right: 12px;" v-model="form.time_limit" />
        <span>小时</span>
      </el-form-item>
      <el-form-item label="限制会员等级:">
        <el-select v-model="form.level_limit" placeholder="请选择活动区域">
          <el-option label="不限" :value="0"></el-option>
          <el-option v-for="(item, index) in grade_list" :key="index" :label="item" :value="index"></el-option>
        </el-select>
        <span style="margin-left:8px">及以上</span>
      </el-form-item>
      <el-form-item label="限制会员类型:">
        <el-radio-group v-model="form.type">
          <div style="margin-top: 15px;margin-bottom: 14px">
            <el-radio :label="1">不限（全民参与）</el-radio>
          </div>
          <div style="margin-bottom: 14px">
            <el-radio :label="2">老带新（仅新用户可参团）</el-radio>
          </div>
          <div style="margin-bottom: 14px">
            <el-radio :label="3">新用户专享（仅新用户开团、参团）</el-radio>
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="每人限购:">
        <el-input style="width: 200px; margin-right: 12px;" v-model="form.limit_num"></el-input>份
      </el-form-item>
      <el-form-item label="是否可推广团:">
        <el-radio-group v-model="form.is_popularize">
          <el-radio :label="1">是</el-radio>
          <div style="display: inline-block; width: 100px; margin-right: 120px">
            <el-input
              :disabled="form.is_popularize == 0"
              v-model="form.popularize_num"
              style="width: 140px"
              type="text"
              append="个"
            >
              <template slot="append">个</template>
            </el-input>
          </div>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="分享图:">
        <img :src="form.share_image" alt srcset />
      </el-form-item>
      <el-form-item label="所属代理商:">
        <el-select :disabled=" !!form.id" v-model="form.agent_id" placeholder="请选择活动区域">
          <el-option
            v-for="item in agent_map"
            :label="item.name"
            :key="item.agent_id"
            :value="item.agent_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button style="width: 120px; height: 50px;" @click="commit" type="primary">提交</el-button>
        <el-button style="width: 120px; height: 50px;" @click="$router.back(-1)" type="warning">返回</el-button>
      </el-form-item>
    </el-form>
    <CommoditySpecification
      v-if="temp"
      ref="Template"
      :control="true"
      :templateData="templateData"
      :isShow="false"
      :entrance="3"
    />
  </div>
</template>

<script>
import { setProduct, commitSetProduct } from "@/api/group";
import { pickerOptions, parseTime } from "@/utils/index";
import CommoditySpecification from "@/components/CommoditySpecification";
export default {
  components: { CommoditySpecification },
  data() {
    return {
      form: {
        price: "", // 拼团价
        number: "", // 成团人数
        id: "", // 商品id
        time_limit: "", // 成团时限
        level_limit: "", // 会员等级限制
        type: "", // 限制会员类型
        limit_num: "", // 限制购买数量
        is_popularize: "", // 是否推广团
        popularize_num: "", // 允许推广团个数
        agent_id: "" // 代理商id
      },
      agent_map: [], // 代理商列表
      grade_list: [], // 等级列表
      templateData: {},
      temp: false
    };
  },
  created() {
    this.form.id = this.$route.query.id;
    this.getData();
  },
  methods: {
    getData() {
      setProduct(this.form)
        .then(res => {
          if (res.code == 1) {
            this.form = res.data.product;
            this.agent_map = res.agent_map;
            this.action = res.action;
            this.grade_list = res.data.grade_list;
            this.templateData = res.data.temp_data;
            if (Array.isArray(res.data.temp_data)) this.temp = false;
            else this.temp = true;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(res => {
          this.$message.error(res);
        });
    },
    commit() {
      if (!Array.isArray(this.templateData)) {
        const ss = this.$refs.Template.commit();
        Object.assign(this.form, { group_price_data: ss.group_price_data });
      }
      commitSetProduct(this.form)
        .then(res => {
          if (res.code == 1) {
            console.log(res);
            this.$message.success(res.msg);
            setTimeout(() => {
              this.$router.back(-1);
            }, 600);
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(res => {
          this.$message.error("提交出错, 请检查网络或者联系管理员");
        });
    }
  }
};
</script>


<style lang="scss" scoped>
.root {
  padding: 40px;
}
</style>