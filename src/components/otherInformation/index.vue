<!-- tsx 基础信息 -->
<template>
  <div>
    <el-form-item label="邮政编码">
      <el-input
        v-model="form.post_code"
        maxlength="6"
        show-word-limit
        class="input"
        placeholder="单行输入"
        size="small"
      />
    </el-form-item>
    <el-form-item label="联系地址">
      <el-input v-model="form.address" class="input" placeholder="单行输入" size="small" />
    </el-form-item>
    <el-form-item label="客服电话">
      <el-input v-model="form.mobile" class="input" placeholder="单行输入" size="small" />
    </el-form-item>
    <el-form-item label="合同时间">
      <el-date-picker type="datetime" v-model="form.contract_start_time" placeholder="选择日期时间"></el-date-picker>
      <el-date-picker type="datetime" v-model="form.contract_end_time" placeholder="选择日期时间"></el-date-picker>
    </el-form-item>
    <el-form-item label="合同文件">
      <UpFile
        style="width:300px;"
        :exporteurl="uploadfile"
        :fileList="contract_file"
        fileName="file"
        :showList="true"
        :fileHeaders="headers"
        :disabled="prohibit"
        :maxlimit="10"
        :index="1"
        @Removefile="RemoveFile"
        @Successfile="SuccessFile"
      ></UpFile>
    </el-form-item>
    <el-form-item label="代理商类型" prop="resource">
      <el-radio-group v-model="form.group_type">
        <el-radio :label="0">企业</el-radio>
        <el-radio :label="1">个人</el-radio>
      </el-radio-group>
    </el-form-item>

    <div v-if="form.group_type==0">
      <el-form-item label="企业名称">
        <el-input v-model="form.company_name" class="input" placeholder="单行输入" size="small" />
      </el-form-item>
      <el-form-item label="企业注册号">
        <el-input
          v-model="form.company_register_number"
          class="input"
          placeholder="单行输入"
          size="small"
        />
      </el-form-item>
      <el-form-item label="税务号">
        <el-input
          v-model="form.company_taxation_number"
          class="input"
          placeholder="单行输入"
          size="small"
        />
      </el-form-item>
      <el-form-item label="开户行">
        <el-select v-model="form.bank_id" placeholder="请选择">
          <el-option
            v-for="item in bankList"
            :key="item.id"
            :label="item.bank_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="开户账号">
        <el-input
          v-model="form.bank_number"
          maxlength="20"
          show-word-limit
          class="input"
          placeholder="单行输入"
          size="small"
        />
      </el-form-item>
      <el-form-item label="所在分行">
        <el-input v-model="form.bank_branch_name" class="input" placeholder="单行输入" size="small" />
      </el-form-item>
    </div>

    <div v-if="form.group_type==1">
      <el-form-item label="姓名">
        <el-input v-model="form.user_name" class="input" placeholder="单行输入" size="small" />
      </el-form-item>
      <el-form-item label="身份证号码">
        <el-input v-model="form.card_number" class="input" placeholder="单行输入" size="small" />
      </el-form-item>
      <el-form-item label="收款账户银行">
        <el-select v-model="form.person_bank_name" placeholder="请选择">
          <el-option
            v-for="item in bankList"
            :key="item.id"
            :label="item.bank_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="收款账号分行">
        <el-input
          v-model="form.person_bank_branch_name"
          class="input"
          placeholder="单行输入"
          size="small"
        />
      </el-form-item>
      <el-form-item label="收款账号">
        <el-input v-model="form.person_bank_number" class="input" placeholder="单行输入" size="small" />
      </el-form-item>
    </div>

    <div class="bothSides" v-if="form.group_type==0">
      <div>
        <p>营业执照（1张，jpg，png，2m以内）</p>
        <Upimg
          :exporteurl="exporteurl"
          :fileList="business_license_image"
          fileName="image"
          :showList="true"
          :fileHeaders="headers"
          :disabled="prohibit"
          :maxlimit="1"
          :index="1"
          @Removeimg="RemoveimgArray"
          @Successimg="SuccessimgArray"
        ></Upimg>
      </div>
      <div>
        <p>银行开户许可证（1张，jpg，png，2m以内）</p>
        <div>
          <Upimg
            :exporteurl="exporteurl"
            :fileList="bank_allow_image"
            fileName="image"
            :showList="true"
            :fileHeaders="headers"
            :disabled="prohibit"
            :maxlimit="1"
            :multiple="true"
            :index="2"
            @Removeimg="RemoveimgArray"
            @Successimg="SuccessimgArray"
          ></Upimg>
        </div>
      </div>
      <div>
        <p>税务登记证（1张，jpg，png，2m以内）</p>
        <div>
          <Upimg
            :exporteurl="exporteurl"
            :fileList="company_taxation_image"
            fileName="image"
            :showList="true"
            :fileHeaders="headers"
            :disabled="prohibit"
            :maxlimit="1"
            :index="3"
            :multiple="true"
            @Removeimg="RemoveimgArray"
            @Successimg="SuccessimgArray"
          ></Upimg>
        </div>
      </div>
    </div>
    <div class="bothSides" v-if="form.group_type==1">
      <div>
        <p>身份证正面（1张，jpg，png，2m以内）</p>
        <Upimg
          :exporteurl="exporteurl"
          :fileList="card_front_image"
          fileName="image"
          :showList="true"
          :fileHeaders="headers"
          :disabled="prohibit"
          :maxlimit="1"
          :index="4"
          @Removeimg="RemoveimgArray"
          @Successimg="SuccessimgArray"
        ></Upimg>
      </div>
      <div>
        <p>身份证反面（1张，jpg，png，2m以内）</p>
        <div>
          <Upimg
            :exporteurl="exporteurl"
            :fileList="card_back_image"
            fileName="image"
            :showList="true"
            :fileHeaders="headers"
            :disabled="prohibit"
            :maxlimit="1"
            :multiple="true"
            :index="5"
            @Removeimg="RemoveimgArray"
            @Successimg="SuccessimgArray"
          ></Upimg>
        </div>
      </div>
      <div>
        <p>手持身份证照片（1张，jpg，png，2m以内）</p>
        <div>
          <Upimg
            :exporteurl="exporteurl"
            :fileList="user_hold_card_image"
            fileName="image"
            :showList="true"
            :fileHeaders="headers"
            :disabled="prohibit"
            :maxlimit="1"
            :index="6"
            :multiple="true"
            @Removeimg="RemoveimgArray"
            @Successimg="SuccessimgArray"
          ></Upimg>
        </div>
      </div>
      <div>
        <p>银行卡照片（1张，jpg，png，2m以内）</p>
        <div>
          <Upimg
            :exporteurl="exporteurl"
            :fileList="bank_card_image"
            fileName="image"
            :showList="true"
            :fileHeaders="headers"
            :disabled="prohibit"
            :maxlimit="1"
            :index="7"
            :multiple="true"
            @Removeimg="RemoveimgArray"
            @Successimg="SuccessimgArray"
          ></Upimg>
        </div>
      </div>
    </div>
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import Upimg from "@/components/Upimg";
import UpFile from "@/components/UpFile";
import { exporteurl, turnDate } from "@/utils/user";
import { upimg, upfile } from "@/api/user";
import { agentBaseInfo } from "@/api/agent";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { Upimg, UpFile },
  props: {
    // bankList: {
    //   type: Array,
    //   default: []
    // },
    newEditor: {
      type: Number // 1 新增  2  修改
    },
    editOther: {
      type: Object
    }
  },
  data() {
    // 这里存放数据
    return {
      form: { group_type: 0 },
      action: [],
      exporteurl: exporteurl + upimg,
      uploadfile: exporteurl + upfile,
      headers: {
        token: localStorage.getItem("Token"),
        enctype: "multipart/form-data"
      },
      bank_card_image: [], // 银行卡照片图片
      user_hold_card_image: [], // 手持身份证图片
      card_back_image: [], // 身份证反面图片
      card_front_image: [], // 身份证正面图片
      company_taxation_image: [], // 税务登记证图片
      bank_allow_image: [], // 银行开业许可证图片
      business_license_image: [], // 营业执照图片
      contract_file: [], // 合同文件
      prohibit: false,
      bankList: []
    };
  },
  // 过滤器
  filters: {},
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    newEditor: {
      deep: true,
      handler(val) {
        if (val == 1) this.Initialization();
        else this.Other();
      }
    },
    editOther: {
      deep: true,
      handler(val) {
        // if (val != this.editOther) {
        //   console.log("数据不一样");
        //   this.Other();
        // }
      }
    }
  },
  // 方法集合
  methods: {
    Initialization() {
      this.form = { group_type: 0, post_code: "" };
      this.bank_card_image = []; // 银行卡照片图片
      this.user_hold_card_image = []; // 手持身份证图片
      this.card_back_image = []; // 身份证反面图片
      this.card_front_image = []; // 身份证正面图片
      this.company_taxation_image = []; // 税务登记证图片
      this.bank_allow_image = []; // 银行开业许可证图片
      this.business_license_image = []; // 营业执照图片
      this.contract_file = []; // 合同文件
    },
    Other() {
      this.form = this.editOther;
      console.log("修改++++", this.form);
      if (
        this.editOther.bank_card_image &&
        this.editOther.bank_card_image.length > 0
      ) {
        // 银行卡照片图片
        this.bank_card_image = [
          {
            name: "",
            imgPath: this.editOther.bank_card_image,
            url: this.editOther.bank_card_image_url
          }
        ];
      } else this.bank_card_image = [];
      this.form.bank_card_image = this.editOther.bank_card_image;
      if (
        this.editOther.user_hold_card_image &&
        this.editOther.user_hold_card_image.length > 0
      ) {
        // 手持身份证图片
        this.user_hold_card_image = [
          {
            name: "",
            imgPath: this.editOther.user_hold_card_image,
            url: this.editOther.user_hold_card_image_url
          }
        ];
        this.form.user_hold_card_image = this.editOther.user_hold_card_image;
      } else this.user_hold_card_image = [];

      if (
        this.editOther.card_back_image &&
        this.editOther.card_back_image.length > 0
      ) {
        // 身份证反面图片
        this.card_back_image = [
          {
            name: "",
            imgPath: this.editOther.card_back_image,
            url: this.editOther.card_back_image_url
          }
        ];
        this.form.card_back_image = this.editOther.card_back_image;
      } else this.card_back_image = [];

      if (
        this.editOther.card_front_image &&
        this.editOther.card_front_image.length > 0
      ) {
        // 身份证正面图片
        this.card_front_image = [
          {
            name: "",
            imgPath: this.editOther.card_front_image,
            url: this.editOther.card_front_image_url
          }
        ];
        this.form.card_front_image = this.editOther.card_front_image;
      } else this.card_front_image = [];

      if (
        this.editOther.company_taxation_image &&
        this.editOther.company_taxation_image.length > 0
      ) {
        // 税务登记证图片
        this.company_taxation_image = [
          {
            name: "",
            imgPath: this.editOther.company_taxation_image,
            url: this.editOther.company_taxation_image_url
          }
        ];
        this.form.company_taxation_image = this.editOther.company_taxation_image;
      } else this.company_taxation_image = [];

      if (
        this.editOther.bank_allow_image &&
        this.editOther.bank_allow_image.length > 0
      ) {
        // 银行开业许可证图片
        this.bank_allow_image = [
          {
            name: "",
            imgPath: this.editOther.bank_allow_image,
            url: this.editOther.bank_allow_image_url
          }
        ];
        this.form.bank_allow_image = this.editOther.bank_allow_image;
      } else this.bank_allow_image = [];

      if (
        this.editOther.business_license_image &&
        this.editOther.business_license_image.length > 0
      ) {
        //  营业执照图片
        this.business_license_image = [
          {
            name: "",
            imgPath: this.editOther.business_license_image,
            url: this.editOther.business_license_image_url
          }
        ];
        this.form.business_license_image = this.editOther.business_license_image;
      } else this.business_license_image = [];
      if (
        this.editOther.contract_file &&
        this.editOther.contract_file.length > 0
      ) {
        this.contract_file = JSON.parse(this.editOther.contract_file); // 合同文件
      } else {
        this.contract_file = [];
      }
      if (this.form.contract_start_time == "0") {
        this.form.contract_start_time = "";
      }
      if (this.form.contract_end_time == "0") {
        this.form.contract_end_time = "";
      }
    },
    RemoveFile(val) {
      console.log(val);
      this.form.contract_file = JSON.stringify(val.fileArray);
    },
    SuccessFile(val) {
      console.log(val);
      this.form.contract_file = JSON.stringify(val.fileArray);
    },
    RemoveimgArray(val) {
      console.log("删除", val);
    },
    SuccessimgArray(val) {
      console.log("成功复制");
      console.log(val);
      switch (val.index) {
        case 1:
          this.form.business_license_image =
            val.imgArray.length > 0 ? val.imgArray[0].imgPath : "";
          this.business_license_image =
            val.imgArray.length > 0 ? val.imgArray : [];
          break;
        case 2:
          this.form.bank_allow_image =
            val.imgArray.length > 0 ? val.imgArray[0].imgPath : "";
          this.bank_allow_image = val.imgArray.length > 0 ? val.imgArray : [];
          break;
        case 3:
          this.form.company_taxation_image =
            val.imgArray.length > 0 ? val.imgArray[0].imgPath : "";
          this.company_taxation_image =
            val.imgArray.length > 0 ? val.imgArray : [];
          break;
        case 4:
          this.form.card_front_image =
            val.imgArray.length > 0 ? val.imgArray[0].imgPath : "";
          this.card_front_image = val.imgArray.length > 0 ? val.imgArray : [];
          break;
        case 5:
          this.form.card_back_image =
            val.imgArray.length > 0 ? val.imgArray[0].imgPath : "";
          this.card_back_image = val.imgArray.length > 0 ? val.imgArray : [];
          break;
        case 6:
          this.form.user_hold_card_image =
            val.imgArray.length > 0 ? val.imgArray[0].imgPath : "";
          this.user_hold_card_image =
            val.imgArray.length > 0 ? val.imgArray : [];
          break;
        case 7:
          this.form.bank_card_image =
            val.imgArray.length > 0 ? val.imgArray[0].imgPath : "";
          this.bank_card_image = val.imgArray.length > 0 ? val.imgArray : [];
          break;
      }
    },
    getagentBaseInfo() {
      const that = this;
      return new Promise((resolve, reject) => {
        agentBaseInfo({}).then(res => {
          if (res.code == 1) {
            that.bankList = res.data.bank_list;
          } else {
            that.$message.error(res.msg);
          }
        });
        resolve();
      }).catch(error => {
        console.log(error);
      });
    },
    commitbasic() {
      if (this.form.contract_start_time) {
        if (this.form.contract_start_time instanceof Date) {
          this.form.contract_start_time = turnDate(
            this.form.contract_start_time,
            21
          );
        }
      } else {
        this.form.contract_start_time = "";
      }
      if (this.form.contract_end_time) {
        if (this.form.contract_end_time instanceof Date) {
          this.form.contract_end_time = turnDate(
            this.form.contract_end_time,
            21
          );
        }
      } else {
        this.form.contract_end_time = "";
      }
      return this.form;
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getagentBaseInfo();
    if (this.newEditor == 1) this.Initialization();
    else this.Other();
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
