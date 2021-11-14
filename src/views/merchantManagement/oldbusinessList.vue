<!-- 商家列表tsx -->
<template>
  <div class="package">
    <div class="hide">
      <div>
        <el-select v-if="agent.length>0" v-model="agent_id" class="maright" placeholder="代理商">
          <el-option
            v-for="item in agent"
            :key="item.agent_id"
            :label="item.name"
            :value="item.agent_id"
          />
        </el-select>
        <span>商家类型</span>
        <el-select v-model="address_type" class="maright" placeholder="请选择">
          <el-option v-for="item in options" :key="item.key" :label="item.val" :value="item.key" />
        </el-select>
      </div>
      <div>
        <span>商家名称：</span>
        <el-input v-model="keyword" class="input" prefix-icon="el-icon-search" placeholder="单行输入" />
      </div>
      <el-button type="primary" class @click="addBusiness()">新增</el-button>
      <el-button type="danger" class v-if="del==1" @click="delBusiness()">删除</el-button>
      <el-button type="success" class @click="page=1,getData()">查询</el-button>
      <!-- <el-button plain v-if="derive==1" @click="exporte">导出</el-button> -->
    </div>
    <!-- 表格 -->
    <template>
      <el-table
        v-loading="loading"
        :data="dataList"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" width="55" />
        <el-table-column label="二维码" align="center">
          <template slot-scope="scope">
            <img v-bind:src="scope.row.qr_code" @click="imgenlarge(scope.row.qr_code)" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="name" label="商家名称" />
        <el-table-column align="center" prop="category_name" label="所属分类" />
        <el-table-column align="center" prop="identity.identity_name" label="身份">
          <template slot-scope="scope">
            <pre>{{ scope.row.identity | identity }}</pre>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="identity.identity_percent" label="抽成">
          <template slot-scope="scope">
            <pre>{{ scope.row.identity | percent }}</pre>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="address" label="地址" />
        <el-table-column align="center" prop="agent_name" label="所属地区" />
        <el-table-column align="center" prop="add_time" label="创建时间" width="100" />
        <el-table-column align="center" prop="contract_end_time" label="合同结束时间" width="100" />
        <el-table-column prop="disable" label="状态" />
        <el-table-column prop="recommend" label="是否推荐" />

        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button v-if="edit==1" type="text" size="small" @click="editClick(scope.row)">编辑</el-button>
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
    <el-dialog
      title="店铺管理"
      :visible.sync="dialogVisible"
      width="1000px"
      top="5vh"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="代理商">
          <el-select
            v-model="form.agent_id"
            class="maright input"
            @change="agentdata"
            placeholder="代理商"
            :disabled="disabled"
          >
            <el-option
              v-for="item in is_agent"
              :key="item.key"
              :label="item.val"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否菜单" prop="resource">
          <el-radio-group v-model="form.type" @change="caidan">
            <el-radio :label="'1'" :disabled="disabledtype">线上商家</el-radio>
            <el-radio :label="'2'" :disabled="disabledtype">线下商家</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="店铺名称" prop="name">
          <el-input v-model="form.name" class="input" />
        </el-form-item>
        <el-form-item label="所属分类" prop="classification">
          <el-select v-model="form.category_id" class="input" placeholder="请选择分类">
            <el-option
              v-for="item in category"
              :key="item.user_id"
              :label="item.name"
              :value="item.user_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-autocomplete
            class="inline-input input"
            v-model="form.account "
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            @select="handleSelect"
          >
            <template slot-scope="{ item }" style="display: flex;">
              <div class="name">{{ item.name }}</div>
              <span class="addr">{{ item.user_id }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="服务电话/接单电话">
          <el-input v-model="form.phone" class="input" placeholder="单行输入" />
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="form.manage_name" class="input" placeholder="单行输入" />
        </el-form-item>
        <el-form-item label="负责人电话">
          <el-input v-model="form.manage_mobile" class="input" placeholder="单行输入" />
        </el-form-item>

        <el-form-item label="店铺地址">
          <el-select v-model="form.province_code" @change="provinceCode" placeholder="请选择省">
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
            v-model="form.district_code"
            v-if="area.length>0"
            @change="areaCode"
            placeholder="请选择区"
          >
            <el-option
              v-for="item in area"
              :key="item.area_code"
              :label="item.area_name"
              :value="item.area_code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="form.address" class="input" placeholder="请输入详细地址" />
          <el-button round @click="longitude()">标注经纬度</el-button>
          <el-input v-model="form.latitude" disabled placeholder style="width:120px;" />
          <el-input v-model="form.longitude" disabled placeholder style="width:120px;" />
        </el-form-item>
        <el-form-item label="合同时间">
          <el-date-picker
            v-model="contract"
            class="maright"
            type="daterange"
            format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="startend"
          />
        </el-form-item>

        <el-form-item label="人均消费">
          <el-input v-model="form.per_consume" class="input" placeholder="元" />
        </el-form-item>
        <el-form-item label="消费人数">
          <el-input v-model="form.consume_num" class="input" placeholder="元" />
        </el-form-item>

        <el-form-item label="门店图片">
          <el-upload
            class="upload-demo"
            action
            :file-list="filelist"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :limit="1"
            :on-exceed="handleExceed"
            :on-change="handleChange"
            list-type="picture"
            :auto-upload="false"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="店铺身份" v-if="form.type==2" prop="type">
          <el-checkbox-group v-model="checkList" @change="changeCheckbox()">
            <el-checkbox label="自提点">
              <div style="display: flex;align-items: center;">
                <span>自提点</span>
                <el-form-item label="提成比">
                  <el-input v-model="form.self_percent" class="selectinput" placeholder="%" />
                </el-form-item>
              </div>
            </el-checkbox>

            <el-checkbox label="线下购商家" style="display: flex;align-items: flex-start;">
              <div>
                线下购商家
                <div class="radio">
                  <el-radio v-model="form.lineDownTime" :label="'1'" @change="radioChange">
                    <span>营业时间：</span>
                    <el-time-picker
                      v-model="form.open_time"
                      @change="businessTiem"
                      class="selectinput"
                    ></el-time-picker>
                    <el-time-picker
                      v-model="form.close_time"
                      @change="businessTiem"
                      class="selectinput"
                    ></el-time-picker>
                  </el-radio>
                  <el-radio v-model="form.lineDownTime" :label="'2'" @change="radioChange">24小时</el-radio>
                </div>
                <div style="display: flex;flex-direction: column;" class="tong">
                  <el-radio v-model="form.func" :label="'2'" class="radio" @change="radioChange">
                    优惠买单
                    <el-form-item label="抽成比">
                      <el-input v-model="form.service_percent" class="selectinput" placeholder="%" />
                    </el-form-item>
                  </el-radio>
                  <el-radio v-model="form.func" :label="'1'" @change="radioChange">纯展示</el-radio>
                </div>
              </div>
            </el-checkbox>

            <el-checkbox label="外卖商家">
              <div style="display: flex;align-items: center;">
                <span>外卖商家</span>
                <el-form-item label="抽成比">
                  <el-input v-model="form.take_out_percent	" style="width:200px;" placeholder="%" />
                </el-form-item>
                <el-form-item label="外卖营业时间">
                  <el-time-picker
                    v-model="form.take_out_start_time"
                    @change="businessTiem"
                    class="selectinput"
                  ></el-time-picker>
                  <el-time-picker
                    v-model="form.take_out_end_time"
                    @change="businessTiem"
                    class="selectinput"
                  ></el-time-picker>
                </el-form-item>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="店铺功能" v-if="form.type==1" class="dianpu">
          <el-radio v-model="form.func" :label="'1'">免费预约</el-radio>
          <el-radio v-model="form.func" :label="'2'">
            立即下单
            <div class="shuang">
              <div class="xiong">
                <el-form-item label="单价">
                  <el-input v-model="form.function_fee	" class="user_id" placeholder="元" />
                </el-form-item>
                <el-form-item label="每人限购数量">
                  <el-input v-model="form.limit_num	" class="user_id" placeholder />
                </el-form-item>
              </div>
              <div class="xiong">
                <el-form-item label="抽成比">
                  <el-input v-model="form.service_percent	" class="user_id" placeholder="%" />
                </el-form-item>
                <el-checkbox v-model="form.can_coupon">是否可使用优惠券</el-checkbox>
              </div>
            </div>
          </el-radio>
        </el-form-item>
        <el-form-item label="图文详情">
          <div>
            <el-button type="primary" @click="addimg" plain>添加图片</el-button>
            <el-button type="primary" @click="addtext" plain>添加描述</el-button>
          </div>
          <div v-for="(item ,index) in textimg" :key="index">
            <div style="margin-top: 20px;display: flex;">
              <div @click="upClicjIndex(index)" v-if="item.img==''||item.img" style="line-height:1">
                <el-upload
                  class="avatar-uploader"
                  action
                  :show-file-list="false"
                  :on-preview="handlePreview"
                  :on-remove="textimg"
                  :auto-upload="false"
                  :on-change="handleChangelist"
                  ref="upImg4"
                >
                  <img
                    v-if="item.img_url"
                    :src="item.img_url"
                    class="avatar"
                    style="width:120px;height:120px"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>

              <el-input
                v-if="item.text==''||item.text"
                style="width: 180px;"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="item.text"
              ></el-input>
              <el-button
                type="danger"
                style="margin-left: 20px;"
                @click="dtleimgtext(index)"
                plain
              >删除</el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="是否推荐">
          <el-radio-group v-model="form.recommend">
            <el-radio :label="'1'">是</el-radio>
            <el-radio :label="'0'">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-radio-group v-model="form.visible">
            <el-radio :label="'1'">是</el-radio>
            <el-radio :label="'0'">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.disable">
            <el-radio :label="'0'">启用</el-radio>
            <el-radio :label="'1'">禁用</el-radio>
            <!-- <el-form-item label="禁用原因">
              <el-input v-model="form.disable_reason" class="user_id" placeholder="" />
            </el-form-item>-->
          </el-radio-group>
        </el-form-item>
        <el-form-item label="禁用原因">
          <el-input v-model="form.disable_reason" type="textarea" class="input" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">{{ addoredit }}</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="地图" :visible.sync="mapVisible" width="800px" :before-close="MapClose">
      <baidu-map :center="{lng: 116.403765, lat: 39.914850}" :zoom="19" @click="Degrees">
        <bm-view class="map bm-view"></bm-view>
        <bm-control :offset="{width: '10px', height: '10px'}">
          <bm-auto-complete v-model="localization" :sugStyle="{zIndex: 1}">
            <label>
              关键词：
              <input v-model="localization" />
            </label>
          </bm-auto-complete>
          <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
          <bm-geolocation
            anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
            :showAddressBar="true"
            :autoLocation="true"
          ></bm-geolocation>
          <bm-marker
            :position="{lng: form.longitude, lat: form.latitude}"
            :dragging="true"
            animation="BMAP_ANIMATION_BOUNCE"
          >
            <bm-label
              content
              :labelStyle="{color: 'red', fontSize : '24px'}"
              :offset="{width: -35, height: 30}"
            />
          </bm-marker>
        </bm-control>
        <bm-local-search :keyword="localization" :auto-viewport="true"></bm-local-search>
      </baidu-map>
    </el-dialog>

    <el-dialog title :visible.sync="imgVisible" width="500px" :before-close="imgClose">
      <img
        :src="imgurl"
        alt
        style="width: 120px; height: 120px;margin-left:auto; margin-right:auto;display: block;"
      />
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import {
  businessList,
  businessAjaxQuery,
  businessAdd,
  businessDel,
  businessGetEdit,
  businessPostEdit,
  upimg
} from "@/api/business";
import { exporteurl, turnDate } from "@/utils/user";
import { spawn } from "child_process";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  // 过滤器
  filters: {
    identity(val) {
      if (val && val.identity_name) {
        return val.identity_name.map(res => res).join("\n");
      }
    },
    percent(val) {
      if (val && val.identity_percent) {
        return val.identity_percent.map(res => res).join("\n");
      }
    }
  },
  data() {
    // 检验 表单
    const accountNumber = (rule, value, callback) => {
      console.log(this.form.account);
      if (this.form.account && this.form.account.length > 0) {
        callback();
      } else {
        callback(new Error("请输入账号"));
      }
    };
    const businessName = (rule, value, callback) => {
      if (this.form.name.length > 0) {
        callback();
      } else {
        callback(new Error("请输入店铺名称"));
      }
    };
    const identity = (rule, value, callback) => {
      if (this.form.type == 2) {
        console.log(this.checkList);
        if (this.checkList.length > 0) {
          callback();
        } else {
          callback(new Error("请选择店铺身份"));
        }
      } else {
        callback();
      }
    };
    const classification = (rule, value, callback) => {
      if (this.form.category_id) {
        callback();
      } else {
        callback(new Error("请选择分类"));
      }
    };
    const resource = (rule, value, callback) => {
      callback();
    };
    // 这里存放数据
    return {
      options: [],
      keyword: "",
      dataList: [],
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      address_type: 0,

      loading: false,
      dialogVisible: false,
      fileList: [],
      mapVisible: false,
      addoredit: "立即创建",
      add: "",
      del: "",
      edit: "",
      exporteurl: exporteurl,
      zoom: 3,
      category: [], // 分类
      checkList: [], // 店铺身份
      province: [], // 省
      city: [], // 市
      area: [], // 区
      disabled: false,
      disabledtype: false,
      imgVisible: false,
      form: {
        id: "",
        agent_id: JSON.parse(localStorage.getItem("user")).agent_id,
        type: "2", // 店铺类型 【1=》线上 2=》线下】
        name: "", // 店铺名称
        category_id: "", // 所属分类
        phone: "", // 服务电话
        manage_name: "", // 负责人
        manage_mobile: "", // 负责人电话
        address: "", // 详细地址
        contract_start_time: "", // 合同开始时间
        contract_end_time: "", // 合同结束时间
        time_type: "", // 营业时间1=》选定 2=》全天营业
        open_time: "", // 营业开始时间
        close_time: "", // 营业结束时间
        take_out_start_time: "",
        take_out_end_time: "",
        service_percent: "", // 服务订单抽成比
        coin_limit: "", //金币限制
        take_out: "", // 是否是外卖商家
        recommend: "0", // 是否推荐1=》是 0=>否
        visible: "0", // 是否可见 0=》不可见 1=》可见
        disable: "1", //状态 禁用=》1 启用=》0
        disable_reason: "", // 禁用原因
        take_out_percent: "", // 外卖商家抽成比
        consume_num: "", // 消费人数
        per_consume: "", // 人均消费
        function_fee: "", // 单价
        limit_num: "", //   限购
        can_coupon: false, // 是否可用优惠券1=》可有
        lineDownTime: "2", // 线下营业时长 是全天  还是时段
        latitude: 39.91485, // 纬度
        longitude: 116.403765, // 经度
        account: "", // 账号
        user_id: "",
        img: "", // 门店图片
        func: "",
        province_code: "", // 省
        city_code: "", // 市
        district_code: "", // 区
        town_detail: "",
        self_percent: "", // 自提点 抽成
        specifics_content: [] // 图片描述
      },
      localization: "",
      agent: [],
      agent_id:
        JSON.parse(localStorage.getItem("user")).agent_id == 1
          ? ""
          : JSON.parse(localStorage.getItem("user")).agent_id,
      location: "北京",
      keyword: "",
      contract: [], //  合同时间
      business: "", // 营业时间
      textimg: [], //添加描述图片
      store: "", // 展示图片
      upindex: 0,
      multipleSelection: [] /** 选中 */,
      add: "",
      edit: "",
      del: "",
      imgurl: "" /** 放大图片 */,
      filelist: [],
      ProvinceCity: [],
      is_agent: [],
      rules: {
        account: [
          { required: true, trigger: "blur", validator: accountNumber }
        ],
        name: [{ required: true, trigger: "blur", validator: businessName }],
        classification: [
          { required: true, validator: classification, trigger: "change" }
        ],
        type: [
          {
            type: "array",
            required: true,
            validator: identity,
            trigger: "change"
          }
        ],
        resource: [{ required: true, validator: resource, trigger: "change" }],
        desc: [{ required: true, message: "请填写活动形式", trigger: "input" }]
      }
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
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
  activated() {},
  // 方法集合
  methods: {
    handler({ BMap, map }) {
      //  百度地图
      console.log(BMap, map);
      // this.center.lng = 116.404;
      // this.center.lat = 39.915;
      this.zoom = 15;
    },
    businessTiem(val) {
      /** 营业时间 */
      console.log(val);
      //  this.form.open_time= "" // 营业开始时间
      //   this.form.close_time= "" // 营业结束时间
    },
    querySearch(queryString, cb) {
      //  输入电话号码
      this.Query("user", queryString).then(data => {
        // console.log(data)
        cb(data);
      });
    },
    handleSelect(item) {
      // 点击
      // console.log(item);
      this.form.user_id = item.user_id;
      this.form.account = item.name;
    },
    handleClose(done) {
      /** 大弹框  */
      // 关闭弹框
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done()
      //   })
      //   .catch(_ => {})
      this.disabled = false;
      this.disabledtype = false;
      this.reduction();
      done();
    },
    MapClose(done) {
      done();
    },
    imgenlarge(val) {
      /** 放大 */
      this.imgurl = val;
      this.imgVisible = true;
    },
    imgClose(done) {
      this.imgurl = "";
      this.imgVisible = false;
      done();
    },
    handleCurrentChange(val) {
      // 页数
      this.page = val;
      console.log(`当前页: ${val}`);
      this.getData();
    },
    handleSizeChange(val) {
      this.limit = val;
      console.log(`每页 ${val} 条`);
      this.page = 1;
      this.getData();
    },
    handleSelectionChange(val) {
      /** 选中 */
      console.log(val);
      this.multipleSelection = val;
    },
    handleRemove(file, fileList) {
      /** 文件列表移除文件时的钩子 */
      console.log(file, fileList);
      this.store = "";
      this.fileList = [];
    },

    handleChange(file, fileList) {
      /**  换base64 */
      const isJPG = file.raw.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      const isPNG = file.raw.type === "image/png";
      let isjudge = true;
      if (isJPG || isPNG) {
      } else {
        this.$message.error("上传头像图片只能是 JPG或png 格式!");
        isjudge = false;
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
        return false;
      }
      let reader = new FileReader();
      let obj, base64;
      let that = this;
      reader.onload = () => {
        base64 = reader.result;
        obj = file.name.substring(
          file.name.lastIndexOf(".") + 1,
          file.name.length
        );

        that.uploadbase(base64, obj).then(res => {
          console.log(res);
          that.form.img = res.img_path;
          that.store = res.img_url;
          that.filelist = [res.img_url];
        });
      };
      reader.readAsDataURL(file.raw);

      console.log(obj);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    handlePreview(file) {
      /** 点击文件列表中已上传的文件时的钩子	 */
      console.log(file);
    },
    handleAvatarSuccess(res, file) {
      /** 文件上传成功时的钩子 */
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    dianjituj(index) {
      console.log(index);
    },
    upClicjIndex(index) {
      /** 图文描述第几个 */
      this.upindex = index;
    },
    dtleimgtext(index) {
      let textimg = this.textimg;
      textimg.splice(index);
      this.textimg = textimg;
    },
    handleChangelist(file, fileList, index) {
      const isJPG = file.raw.type === "image/jpeg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      const isPNG = file.raw.type === "image/png";
      let isjudge = true;
      if (isJPG || isPNG) {
      } else {
        this.$message.error("上传头像图片只能是 JPG或png 格式!");
        isjudge = false;
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
        return false;
      }
      let reader = new FileReader();
      let obj, base64;
      let that = this;
      reader.onload = () => {
        base64 = reader.result;
        obj = file.name.substring(
          file.name.lastIndexOf(".") + 1,
          file.name.length
        );
        that.uploadbase(base64, obj).then(res => {
          that.textimg[that.upindex].img_url = res.img_url;
          that.textimg[that.upindex].img = res.img_path;
          console.log(that.textimg);
        });
      };
      reader.readAsDataURL(file.raw);
    },
    beforeAvatarUpload(file) {
      console.log(file);
      /** 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传 */
    },

    provinceCode(val) {
      /** 省 */
      this.city = []; // 市
      this.area = []; // 区
      this.form.district_code = ""; // 区
      this.form.city_code = ""; // 市
      this.form.address = "";
      this.Query("area", this.form.province_code);
    },
    cityCode() {
      /** shi */
      this.form.address = "";
      this.area = []; // 区
      this.form.district_code = ""; // 区
      this.Query("area", this.form.city_code);
    },
    areaCode(val) {
      /** 区 */
      this.form.address = "";
    },
    longitude() {
      /** 详细地址 */
      let ss = "";
      if (
        this.form.province_code.length > 0 &&
        this.form.city_code.length > 0 &&
        this.form.district_code.length > 0
      ) {
        this.province.map(res => {
          if (res.area_code == this.form.province_code) ss = ss + res.area_name;
        });
        this.city.map(res => {
          if (res.area_code == this.form.city_code) ss = ss + res.area_name;
        });
        this.area.map(res => {
          if (res.area_code == this.form.district_code) ss = ss + res.area_name;
        });
        if (this.form.address.length > 0) {
          this.localization = ss + this.form.address;
          this.mapVisible = true;
        } else {
          this.$message({ message: "请先填写详细地址" });
        }
      } else {
        this.$message({ message: "请先选择省市区" });
      }
    },
    caidan(val) {
      /** 菜单 */
      console.log(val);
      if (val == 1) (this.form.lineDownTime = 2), (this.form.func = "1");
      else (this.form.lineDownTime = ""), (this.form.func = "");
      this.form.category_id = "";
      this.form.type = val;
      this.Query("category", this.form.type);
    },
    changeCheckbox(val) {
      if (this.checkList.length > 0) {
        console.log(this.checkList);
        if (this.checkList.indexOf("线下购商家") == -1) {
          (this.form.lineDownTime = 0), (this.form.func = 0);
        } else {
        }
      } else {
        (this.form.lineDownTime = 0), (this.form.func = 0);
      }
    },
    radioChange(val) {
      if (this.checkList.indexOf("线下购商家") == -1)
        this.checkList.push("线下购商家");
    },
    Degrees(type) {
      /** 点击获取经纬度 */
      // console.log(type);
      // console.log(type.point);
      this.form.latitude = type.point.lat;
      this.form.longitude = type.point.lng;
      this.mapVisible = false;
    },
    agentdata(val) {
      this.Query("area", this.form.type);
      this.Query("category", this.form.type);
      this.form.category_id = "";
    },
    delBusiness() {
      /** 删除 */
      if (this.multipleSelection.length == 0) return;
      const arr = [];
      const that = this;
      this.multipleSelection.map(res => {
        arr.push(res.id);
      });
      const data = { id: arr };
      return new Promise((resolve, reject) => {
        businessDel(data).then(res => {
          if (res.code === 1) {
            that.$message({ message: res.msg, type: "success" });
            that.page = 1;
            that.getData();
          } else if (res.code === 2) {
            that.$message.error(res.msg);
          } else {
            that.$message.error(res.msg);
          }
        });
      }).catch(error => {
        console.log(error);
      });
    },
    addimg() {
      /** 添加图片描述 */
      this.textimg.push({ img: "", img_url: "" });
      console.log(this.textimg);
    },
    addtext() {
      /** 添加图片描述 */
      this.textimg.push({ text: "" });
      console.log(this.textimg);
    },
    startend(val) {
      /** 合同日期分解 */
      if (val) {
        this.form.contract_start_time = turnDate(val[0], 1);
        (this.form.contract_end_time = turnDate(val[1])), 1;
      }
    },
    uploadbase(img, ext) {
      const data = { img, ext };
      const that = this;
      console.log(data);
      return new Promise((resolve, reject) => {
        upimg(data).then(res => {
          console.log(res);

          if (res.code == 1) {
            resolve(res.data);
          } else if (res.code == 2) {
            that.$message.error(res.msg);
          } else {
            that.$message.error(res.msg);
          }
        });
        // resolve();
      }).catch(error => {});
    },
    Query(type, value) {
      /** 查看 */
      const that = this;
      const data = { type, value, agent_id: that.form.agent_id };
      return new Promise((resolve, reject) => {
        businessAjaxQuery(data).then(res => {
          // console.log(res);
          if (res.code == 1) {
            if (type == "category") {
              /** 获取分类 */
              that.category = res.data;
            } else if (type == "user") {
              /** 获取用户 */
              return resolve(res.data);
            } else if (type == "area") {
              /** 获取省市区 */
              // if (res.data) {
              //   that.ProvinceCity = res.data.list;
              //   that.form.province_code = res.data.list[0].area_code;
              //   that.form.district_code = res.data.list[1].area_code;
              //   that.form.city_code = res.data.list[2].area_code;
              // }

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
              }
            } else if (type == "agent") {
              that.is_agent = res.data;
              that.Query("category", that.form.type);
              that.Query("area");
            }
          } else if (res.code == 2) {
            that.$message.error(res.msg);
          } else {
            that.$message.error(res.msg);
          }
        });
      });
    },
    addBusiness() {
      /** 添加 */
      this.reduction();
      this.elsec = 1;
      this.addoredit = "立即创建";
      this.dialogVisible = true;
      this.disabled = false;
      this.disabledtype = false;
      this.category = [];
      this.form.category_id = "";
      this.filelist = [];
      // this.Query("category", this.form.type);
      this.Query("agent");
    },
    reduction() {
      /** 初始化 */
      this.form = {
        agent_id: JSON.parse(localStorage.getItem("user")).agent_id,
        type: "2", // 店铺类型 【1=》线上 2=》线下】
        name: "", // 店铺名称
        category_id: "", // 所属分类
        phone: "", // 服务电话
        manage_name: "", // 负责人
        manage_mobile: "", // 负责人电话
        address: "", // 详细地址
        contract_start_time: "", // 合同开始时间
        contract_end_time: "", // 合同结束时间
        time_type: "", // 营业时间1=》选定 2=》全天营业
        open_time: "", // 营业开始时间
        close_time: "", // 营业结束时间
        take_out_start_time: "",
        take_out_end_time: "",
        service_percent: "", // 服务订单抽成比
        coin_limit: "", //金币限制
        take_out: "", // 是否是外卖商家
        recommend: "0", // 是否推荐1=》是 0=>否
        visible: "0", // 是否可见 0=》不可见 1=》可见
        disable: "1", //状态 禁用=》1 启用=》0
        disable_reason: "", // 禁用原因
        take_out_percent: "", // 外卖商家抽成比
        consume_num: "", // 消费人数
        per_consume: "", // 人均消费
        function_fee: "", // 单价
        limit_num: "", //   限购
        can_coupon: false, // 是否可用优惠券1=》可有
        lineDownTime: "2", // 线下营业时长 是全天  还是时段
        latitude: 39.91485, // 纬度
        longitude: 116.403765, // 经度
        account: "", // 账号
        user_id: "",
        img: "", // 门店图片
        func: "",
        province_code: "", // 省
        city_code: "", // 市
        district_code: "", // 区
        town_detail: "", //  乡镇
        specifics_content: [], // 图片描述
        self_percent: ""
      };
      this.checkList = [];
      this.disabled = false;
      this.disabledtype = false;
      this.textimg = [];
      this.store = "";
      this.category = [];
      (this.contract = []), //  合同时间
        (this.business = ""), // 营业时间
        (this.city = []), // 市
        (this.fileList = []),
        (this.area = []); // 区
    },
    commitEdit(data) {
      /** 修改店铺 */
      const that = this;
      return new Promise((resolve, reject) => {
        businessPostEdit(data).then(res => {
          console.log(res);
          that.loading = false;
          that.disabled = false;
          this.disabledtype = false;
          if (res.code == 1) {
            that.$message({ message: res.msg, type: "success" });
            that.dialogVisible = false;
            that.reduction();
            that.elsec = 1;
            that.page = 1;
            that.getData();
          } else if (res.code == 2) {
            that.$message.error(res.msg);
          } else {
            that.$message.error(res.msg);
          }
        });
        resolve();
      }).catch(error => {
        console.log(error);
      });
    },
    commitAdd(data) {
      /** 添加新店铺 */
      const that = this;
      return new Promise((resolve, reject) => {
        businessAdd(data).then(res => {
          console.log(res);
          that.loading = false;
          if (res.code == 1) {
            that.$message({ message: res.msg, type: "success" });
            that.dialogVisible = false;
            that.reduction();
            that.elsec = 1;
            that.page = 1;
            that.getData();
          } else if (res.code == 2) {
            that.$message.error(res.msg);
          } else {
            that.$message.error(res.msg);
          }
        });
        resolve();
      }).catch(error => {
        console.log(error);
      });
    },
    editClick(val) {
      /** 修改编辑 */
      const that = this;
      let data = { id: val.id };
      return new Promise((resolve, reject) => {
        businessGetEdit(data).then(res => {
          console.log(res);
          that.loading = false;
          that.disabled = true;
          that.disabledtype = true;
          if (res.code == 1) {
            that.filelist = [];
            let checkList = [];
            if (res.data.self_point == 1) {
              checkList.push("自提点");
            }
            if (res.data.offline_shops == 1) {
              checkList.push("线下购商家");
            }
            if (res.data.take_out == 1) {
              checkList.push("外卖商家");
              (that.form.take_out_start_time = new Date(
                2019,
                9,
                10,
                res.data.take_out_start_time.substr(0, 2),
                res.data.take_out_start_time.substr(
                  res.data.take_out_start_time.length - 1,
                  res.data.take_out_start_time.length
                )
              )), // 营业开始时间
                (that.form.take_out_end_time = new Date(
                  2019,
                  9,
                  10,
                  res.data.take_out_end_time.substr(0, 2),
                  res.data.take_out_end_time.substr(
                    res.data.take_out_end_time.length - 1,
                    res.data.take_out_end_time.length
                  )
                )); // 营业结束时间
            }
            if (res.data.time_type == 1) {
              (that.form.open_time = new Date(
                2019,
                9,
                10,
                res.data.open_time.substr(0, 2),
                res.data.open_time.substr(
                  res.data.open_time.length - 1,
                  res.data.open_time.length
                )
              )), // 营业开始时间
                (that.form.close_time = new Date(
                  2019,
                  9,
                  10,
                  res.data.close_time.substr(0, 2),
                  res.data.close_time.substr(
                    res.data.close_time.length - 1,
                    res.data.close_time.length
                  )
                )); // 营业结束时间
            }
            that.checkList = checkList;
            that.lineDownTime = res.data.time_type;
            that.contract = [
              res.data.contract_start_time,
              res.data.contract_end_time
            ];

            (that.form.id = res.data.id),
              (that.form.agent_id = res.data.agent_id),
              (that.form.type = res.data.type + ""), // 店铺类型 【1=》线上 2=》线下】
              (that.form.name = res.data.name), // 店铺名称
              (that.form.category_id = res.data.category_id), // 所属分类
              (that.form.phone = res.data.phone), // 服务电话
              (that.form.manage_name = res.data.manage_name), // 负责人
              (that.form.manage_mobile = res.data.manage_mobile), // 负责人电话
              (that.form.address = res.data.address), // 详细地址
              (that.form.contract_start_time =
                res.data.contract_start_time == 0
                  ? res.data.contract_start_time
                  : ""), // 合同开始时间
              (that.form.contract_end_time =
                res.data.contract_end_time == 0
                  ? res.data.contract_end_time
                  : ""), // 合同结束时间
              (that.form.time_type = res.data.time_type + ""), // 营业时间1=》选定 2=》全天营业
              (that.form.service_percent =
                res.data.service_percent > 0 ? res.data.service_percent : ""), // 服务订单抽成比
              (that.form.coin_limit =
                res.data.coin_limit > 0 ? res.data.coin_limit : ""), //金币限制
              (that.form.take_out = res.data.take_out), // 是否是外卖商家
              (that.form.recommend = res.data.recommends + ""), // 是否推荐1=》是 0=>否
              (that.form.visible = res.data.visible + ""), // 是否可见 0=》不可见 1=》可见
              (that.form.disable = res.data.disables + ""), //状态 禁用=》1 启用=》0
              (that.form.disable_reason = res.data.disable_reason), // 禁用原因
              (that.form.take_out_percent =
                parseFloat(res.data.take_out_percent) > 0
                  ? res.data.take_out_percent
                  : ""), // 外卖商家抽成比
              (that.form.consume_num =
                res.data.consume_num > 0 ? res.data.consume_num : ""), // 消费人数
              (that.form.per_consume =
                res.data.per_consume > 0 ? res.data.per_consume : ""), // 人均消费
              (that.form.function_fee =
                res.data.function_fee > 0 ? res.data.function_fee : ""), // 单价
              (that.form.limit_num =
                res.data.limit_num > 0 ? res.data.limit_num : ""), //   限购
              (that.form.can_coupon = res.data.can_coupon == 1 ? true : false), // 是否可用优惠券1=》可有
              (that.form.lineDownTime = res.data.time_type + ""), // 线下营业时长 是全天  还是时段
              (that.form.latitude = res.data.latitude), // 纬度
              (that.form.longitude = res.data.longitude), // 经度
              (that.form.account = res.data.user_name), // 账号
              (that.form.user_id = res.data.user_id),
              (that.form.img = res.data.img), // 门店图片
              (that.form.func = res.data.func + ""), //
              (that.form.province_code =
                res.data.province_code != 0 ? res.data.province_code + "" : ""), // 省
              (that.form.city_code =
                res.data.city_code != 0 ? res.data.city_code + "" : ""), // 市
              (that.form.district_code =
                res.data.district_code != 0 ? res.data.district_code + "" : ""), // 区
              (that.form.town_detail = res.data.town_detail), // 乡镇
              (that.form.specifics_content = res.data.specifics_content); // 图片描述

            that.form.self_percent =
              res.data.self_percent > 0 ? res.data.self_percent : ""; // 自提点
            if (res.data.specifics_content) {
              /** 图文详情  */
              that.textimg = res.data.specifics_content;
            }
            that.store = res.data.img_url; /**  展示图片 真实地址 */
            that.filelist = [
              { name: res.data.img_url, url: res.data.img_url }
            ]; /** 图片截取后的地址 */
            console.log(that.form);
            that.Query("category", that.form.type);
            that.Query("area", that.form.city_code);
            that.Query("area", that.form.province_code);
            that.elsec = 2;
            that.addoredit = "修改完成";
            that.dialogVisible = true;
          } else if (res.code == 2) {
            that.$message.error(res.msg);
          } else {
            that.$message.error(res.msg);
          }
        });
        resolve();
      }).catch(error => {
        console.log(error);
      });
    },
    onSubmit() {
      /** 提交 */
      let that = this;
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log(that.form);
          console.log(that.checkList);
          if (that.type == 2) {
            if (that.checkList.length == 0)
              return that.$message.error("请选择店铺身份");
          }
          that.form.self_point = 0;
          that.form.offline_shops = 0;
          that.form.take_out = 0;
          if (that.form.type == 2) {
            that.checkList.map(res => {
              switch (res) {
                case "自提点":
                  that.form.self_point = 1;
                  break;
                case "线下购商家":
                  that.form.offline_shops = 1;
                  if (that.form.lineDownTime == 2) that.form.time_type = 2;
                  else that.form.time_type = 1;
                  break;
                case "外卖商家":
                  that.form.take_out = 1;
                  break;
              }
            });
          } else {
            if (that.form.lineDownTime == 2) that.form.time_type = 2;
            else that.form.time_type = 1;
          }

          let textimg = [];
          if (that.textimg.length > 0) {
            that.textimg.map(res => {
              if (res.img && res.img != "") {
                textimg.push({ img: res.img, img_url: res.img_url });
              }
              if (res.text && res.text != "") {
                textimg.push({ text: res.text });
              }
            });
          }
          console.log(that.form);
          let data = {
            id: that.form.id,
            agent_id: that.form.agent_id,
            type: that.form.type,
            name: that.form.name,
            category_id: that.form.category_id,
            phone: that.form.phone,
            manage_name: that.form.manage_name,
            manage_mobile: that.form.manage_mobile,
            user_id: that.form.user_id,
            province_code: that.form.province_code,
            city_code: that.form.city_code,
            district_code: that.form.district_code,
            town_detail: that.form.town_detail,
            address: that.form.address,
            latitude: that.form.latitude,
            longitude: that.form.longitude,
            contract_start_time: that.form.contract_start_time,
            contract_end_time: that.form.contract_end_time,
            img: that.form.img,
            self_point: that.form.self_point,
            self_percent:
              parseFloat(that.form.self_percent) > 0
                ? that.form.self_percent
                : "",
            offline_shops: that.form.offline_shops,
            time_type: that.form.time_type,
            open_time:
              that.form.open_time instanceof Date
                ? turnDate(that.form.open_time, "2")
                : that.form.open_time,
            close_time:
              that.form.close_time instanceof Date
                ? turnDate(that.form.close_time, "2")
                : that.form.open_time,
            take_out_end_time:
              that.form.take_out_end_time instanceof Date
                ? turnDate(that.form.take_out_end_time, "2")
                : that.form.take_out_end_time,
            take_out_start_time:
              that.form.take_out_start_time instanceof Date
                ? turnDate(that.form.take_out_start_time, "2")
                : that.form.take_out_start_time,
            func: that.form.func + "",
            service_percent:
              parseFloat(that.form.service_percent) > 0
                ? that.form.service_percent
                : "",
            coin_limit: that.form.coin_limit,
            take_out: that.form.take_out,
            take_out_percent: that.form.take_out_percent,
            img_detail: that.form.img_detail,
            recommend: that.form.recommend,
            visible: that.form.visible,
            disable: that.form.disable,
            disable_reason: that.form.disable_reason,
            consume_num: that.form.consume_num,
            per_consume: that.form.per_consume,
            function_fee:
              that.form.function_fee > 0 ? that.form.function_fee : "",
            limit_num: that.form.limit_num,
            can_coupon: that.form.can_coupon ? "1" : "0",
            specifics_content: textimg
          };
          if (that.elsec == 1) {
            that.commitAdd(data);
          } else {
            that.commitEdit(data);
          }
        }
      });
    },
    getData() {
      const data = {
        name: this.keyword,
        agent_id: this.agent_id,
        limit: this.limit,
        category_id: this.address_type,
        page: this.page
      };
      this.loading = true;
      const that = this;
      return new Promise((resolve, reject) => {
        businessList(data).then(res => {
          this.loading = false;
          if (res.code == 1) {
            if (res.action) {
              res.action.map(val => {
                switch (val.tag) {
                  case "add":
                    if (val.display == 1) {
                      that.add = 1;
                    }
                    break;
                  case "del":
                    if (val.display == 1) {
                      that.del = 1;
                    }
                    break;
                  case "edit":
                    if (val.display == 1) {
                      that.edit = 1;
                    }
                    break;
                  default:
                    break;
                }
              });
            }
            if (res.agent_map) {
              that.agent = res.agent_map;
            }
            // that.Query("category", that.form.type);
            that.Query("area");
            that.dataList = res.data.list;
            that.options = res.data.category_info;
            that.total = res.data.count;
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
  }
};
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
@import "src/styles/hide.scss";
img {
  width: 60px;
  height: 60px;
}
.input {
  width: 300px;
}
.selectinput {
  width: 180px;
}
.bm-view {
  width: 100%;
  height: 300px;
}
.radio {
  display: flex;
  margin-bottom: 20px;
  align-items: center;
}
</style>
<style >
.tong {
  /* margin-bottom: 10px; */
  margin-top: 10px;
}
.tong .el-radio__label {
  display: flex;
  align-items: center;
}
.tong .el-radio {
  display: flex;
  align-items: center;
}
.dianpu .el-form-item__content {
  display: flex;
  flex-direction: column;
}
.dianpu .el-radio {
  margin-top: 12px;
}
.shuang {
  display: flex;
  /* align-items: center; */
  flex-direction: column;
}
.shuang .el-form-item__label {
  width: auto !important;
}
.shuang .el-form-item__content {
  margin-left: 0 !important;
}
.xiong {
  display: flex;
  align-items: center;
  margin-top: 20px;
}
.xiong .el-form-item {
  margin-right: 20px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-textarea__inner {
  height: 180px;
}
</style>
