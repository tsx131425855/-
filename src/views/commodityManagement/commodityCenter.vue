<!-- tsx 中心 -->
<template>
  <div class="package">
    <div class="hide">
      <el-button type="primary" v-if="Jurisdiction.add==1" @click="addMerchandise()">新增</el-button>
      <el-button v-if="Jurisdiction.loop_delete==1" type="danger" @click="loopdelete(1)">删除</el-button>
      <el-button type="info" v-if="Jurisdiction.copy_retail = 1" @click="productcopys()">复制</el-button>
      <el-input
        v-model="keyword"
        class="input"
        style="margin-left: 10px;"
        prefix-icon="el-icon-search"
        placeholder="商品名称/id"
      />
      <el-button type="success" class icon="el-icon-search" @click="page=1,getDatalist()">查询</el-button>
    </div>
    <!-- 列表 -->
    <template>
      <el-table
        v-loading="loading"
        :data="datalist"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @sort-change="sort"
      >
        <el-table-column fixed type="selection" width="55" prop="product_id" />
        <el-table-column prop="product_id" label="ID" sortable width="80" />
        <el-table-column prop="product_name" label="商品名称" />
        <el-table-column prop="cate_name" label="商品分类" />
        <el-table-column prop="product_price" label="商品价格" />
        <el-table-column prop="add_time" label="添加时间" width="90" align="center" />
        <el-table-column prop="product_start_time" label="开始时间" width="90" align="center" />
        <el-table-column prop="product_end_time" label="结束时间" width="90" align="center" />
        <el-table-column prop="product_stock" label="商品库存" width="100" />
        <el-table-column prop="dispatching_type_name" label="配送方式" align="center" width="100" />
        <el-table-column prop="supplier_name" label="供应商" />
        <el-table-column prop="is_top" label="置顶" width="80">
          <template slot-scope="scope">
            <div
              style="display: flex;justify-content: center;cursor:pointer;"
              @click="setTop(scope)"
            >
              <i v-if="scope.row.is_top==0" class="el-icon-error" style="color:red" />
              <i v-else class="el-icon-success" style="color:green" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="agent_count" label="分销代理商" sortable width="110" />
        <el-table-column fixed="right" label="操作" width="130">
          <template slot-scope="scope">
            <el-button
              v-if="Jurisdiction.edit_retail==1"
              type="text"
              size="small"
              @click="getEdit(scope.row,1)"
            >编辑</el-button>
            <el-button
              v-if="Jurisdiction.loop_delete==1"
              type="text"
              size="small"
              style="margin: 0;"
              @click="loopdelete(2,scope.row)"
            >删除</el-button>
            <el-button
              v-if="Jurisdiction.edit_retail_info==1"
              type="text"
              size="small"
              style="margin: 0;"
              @click="getEdit(scope.row,2)"
            >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 分页 -->
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
      :fullscreen="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="addhide">
        <el-col :span="6">
          <el-button size="small" @click="dialogVisible=false">关闭</el-button>
          <el-button v-show="!prohibit" size="small" @click="conmit">保存</el-button>
        </el-col>
        <el-col :span="6">
          <span>新用户专享</span>
          <el-radio-group v-model="form.is_new_special" :disabled="prohibit">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-col>
      </div>
      <!-- tab -->
      <div class="maxtab">
        <div class="tabtype" :class="tab==1?'tabbott':''" @click="tabTouch($event,1)">
          基础信息
          <div />
        </div>
        <div class="tabtype" :class="tab==2?'tabbott':''" @click="tabTouch($event,2)">
          商品价格
          <div />
        </div>
        <div class="tabtype" :class="tab==4?'tabbott':''" @click="tabTouch($event,4)">
          商品描述
          <div />
        </div>
        <div class="tabtype" :class="tab==5?'tabbott':''" @click="tabTouch($event,5)">
          分享设置
          <div />
        </div>
      </div>
      <!-- 表单输入 -->
      <div id="from" ref="Box" class="fromSlide" @scroll="orderScroll">
        <!-- 基础信息 -->
        <el-form
          ref="form"
          :model="form"
          :disabled="prohibit"
          :rules="rules"
          label-width="80px"
          label-position="top"
        >
          <div id="basics" class="fromContent">
            <p class="tabtype">基础信息</p>
            <el-row>
              <el-col :span="5">
                <el-form-item label="商品分类" prop="cateid">
                  <el-select v-model="form.cate_id" class="maright" placeholder="请选择">
                    <el-option
                      v-for="item in category_list"
                      :key="item.product_category_id"
                      :label="item.cate_name"
                      :value="item.product_category_id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="代理商提成">
                  <el-input-number
                    v-model="form.cm_rate_agent"
                    controls-position="right"
                    placeholder="单行输入"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="7">
                <el-form-item label="商品主标题" prop="product_name">
                  <el-input v-model="form.product_name" placeholder="单行输入" />
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="副标题" prop="product_sub_name">
                  <el-input v-model="form.product_sub_name" placeholder="单行输入" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="开始时间-结束时间" prop="tiem">
              <el-date-picker
                v-model="form.product_start_time"
                type="datetime"
                placeholder="选择日期时间"
              />
              <el-date-picker v-model="form.product_end_time" type="datetime" placeholder="选择日期时间" />
            </el-form-item>
            <el-form-item label="配送方式">
              <el-radio
                :label="1"
                style="margin-bottom: 20px;width:100%"
                v-model="form.dispatching_type"
              >
                <span style="width:100px;display: inline-block;">物流</span>
                <span>运费</span>
                <el-input-number
                  v-model="form.product_postage"
                  controls-position="right"
                  placeholder="0元为包邮"
                  class="frominput"
                />
                <span style="margin-left: 20px;">下单成功后</span>
                <el-input-number
                  v-model="form.after_order_delivery"
                  controls-position="right"
                  placeholder="0元为包邮"
                  class="frominput"
                />
                <span style="margin-left: 10px;">天发货</span>
                <span style="margin-left: 80px;">下单成功后发货提示</span>
                <el-input v-model="form.delivery_tip" placeholder="0元为包邮" class="frominput" />
              </el-radio>
            </el-form-item>

            <el-form-item label="虚拟销量">
              <el-radio :label="0" :value="0" style="margin-bottom: 20px;width:100%">
                <span style="width:100px;display: inline-block;">固定销量</span>
                <el-input-number
                  v-model="form.product_sales"
                  controls-position="right"
                  placeholder="销售量"
                  class="frominput"
                />
                <span style="color: red;font-size: 12px;">设置的销量后商品前端销售量=固定小时+实际销售</span>
              </el-radio>
              <div v-if="!prohibit">
                <span @click="radiochange">
                  <span v-if="form.vir_sale_type==1" class="zhong">
                    <span class="xiaoquan" />
                  </span>
                  <span v-else class="si">
                    <span class="xiaoquan" />
                  </span>
                  <span style="width:100px;display: inline-block;">实时增加</span>
                </span>
                <span>每</span>
                <el-input-number
                  v-model="form.sales_apart_time"
                  controls-position="right"
                  placeholder
                  class="frominput"
                />
                <span>小时</span>
                <span>&nbsp; 实时增加</span>
                <el-input-number
                  v-model="form.sales_apart_add"
                  controls-position="right"
                  placeholder
                  class="frominput"
                />
                <span style="color: red;font-size: 12px;">实时增加虚拟销量将会按设置好的数值自动增加</span>
              </div>
              <el-radio v-else v-model="form.vir_sale_type" :label="1">
                <span style="width:100px;display: inline-block;">实时增加</span>
                <span>每</span>
                <el-input-number
                  v-model="form.sales_apart_time"
                  controls-position="right"
                  placeholder
                  class="frominput"
                />
                <span>小时</span>
                <span>&nbsp; 实时增加</span>
                <el-input-number
                  v-model="form.sales_apart_add"
                  controls-position="right"
                  placeholder
                  class="frominput"
                />
                <span style="color: red;font-size: 12px;">实时增加虚拟销量将会按设置好的数值自动增加</span>
              </el-radio>
            </el-form-item>
            <el-form-item label="货号">
              <el-input v-model="form.product_sn" placeholder="单行输入" style="width:300px" />
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="标签">
                  <el-input v-model="form.product_tag" placeholder="单行输入" style="width:300px" />
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <div class="block" style="margin-top: 50px;">
                  <el-color-picker v-model="form.colour_code" />
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="7">
                <el-form-item label="供应商">
                  <el-select v-model="form.supplier_id" placeholder="请选择">
                    <el-option
                      v-for="item in supplier_list"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="采购价">
                  <el-input v-model="form.supplier_price" placeholder="单行输入" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!-- 商品价格 -->
          <div id="Price" class="fromContent">
            <p class="tabtype">商品价格</p>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="商品价格" prop="product_price">
                  <el-input-number
                    v-model="form.product_price"
                    controls-position="right"
                    placeholder="单行输入"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="市场价格" prop="product_ot_price">
                  <el-input-number
                    v-model="form.product_ot_price"
                    controls-position="right"
                    placeholder="单行输入"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="是否可使用优惠券" prop="resource">
                  <el-radio-group v-model="form.is_benefit">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="是否可为超级会员专享" prop="name">
                  <el-radio-group v-model="form.is_super_special">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="库存数量" prop="product_stock">
                  <el-input-number
                    v-model="form.product_stock"
                    controls-position="right"
                    placeholder="单行输入"
                   
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="每组个数">
                  <el-input-number v-model="form.group_size" controls-position="right" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="单用户限购">
                  <el-input-number
                    v-model="form.product_limit_num"
                    controls-position="right"
                    placeholder="不设置为不限"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="当天限购">
                  <el-input-number
                    v-model="form.days_xg_num"
                    controls-position="right"
                    placeholder="不设置为不限"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 商品规格 -->
          <div class="fromContent">
            <p class="tabtype">
              商品规格
              <el-switch v-model="form.is_system" active-color="#13ce66" inactive-color="#ccc" />
            </p>
            <div class="guigeyanzi" v-if="form.is_system">
              <el-button type="primary" size="small" @click="addTemplate">添加规格模板</el-button>
              <el-form-item label>
                <el-select
                  v-model="form.Choicetemp_id"
                  style="margin-left: 20px;"
                  @change="template"
                  placeholder="模板选择"
                >
                  <el-option
                    v-for="item in template_list"
                    :key="item.temp_id"
                    :label="item.temp_name"
                    :value="item.temp_id"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div v-if="form.is_system">
              <CommoditySpecification
                v-if="form.is_system&&dialogVisible"
                :agentMap="agent"
                :elsec="prohibit?3:addedit"
                ref="Template"
                :templateData="templateData"
                :isShow="false"
              />
            </div>
          </div>

          <!-- 商品描述 -->
          <div id="describe" class="fromContent">
            <p class="tabtype">
              商品描述
              <span style>小不能超过2MB;限一张</span>
            </p>
            <div>
              <p>列表展示图</p>
              <Upimg
                :exporteurl="exporteurl"
                :file-list="product_image"
                file-name="image"
                :show-list="true"
                :file-headers="headers"
                :disabled="prohibit"
                :maxlimit="1"
                :index="1"
                @Successimg="SuccessimgArray"
              />
            </div>
            <div>
              <p>
                宝贝图片
                <span>不能超过2MB;限10张</span>
              </p>
              <div>
                <Upimg
                  :exporteurl="exporteurl"
                  :file-list="babyMap"
                  file-name="image"
                  :show-list="true"
                  :file-headers="headers"
                  :disabled="prohibit"
                  :maxlimit="10"
                  :multiple="true"
                  :index="2"
                  @Successimg="SuccessimgArray"
                />
              </div>
            </div>
            <div>
              <p>图文描述 不能超过2MB;限制20张</p>
              <div>
                <Upimg
                  :exporteurl="exporteurl"
                  :file-list="describe"
                  file-name="image"
                  :show-list="true"
                  :file-headers="headers"
                  :disabled="prohibit"
                  :maxlimit="20"
                  :index="3"
                  :multiple="true"
                  @Successimg="SuccessimgArray"
                />
              </div>
            </div>
          </div>
          <!-- 分享设置 -->
          <div id="share" class="fromContent">
            <p class="tabtype">分享设置</p>
            <div>
              <el-radio-group v-model="form.share_status">
                <el-radio
                  :label="0"
                  style="width:100%;margin-bottom: 10px;"
                >固定设置:分享链接图片为商品列表展示图 标题为商品主标题</el-radio>
                <el-radio :label="1">
                  <span>自定义设置</span>
                  <div>
                    <span>分享文案</span>
                    <el-input v-model="form.share_words" maxlength="30" />
                    <span style="color: red;font-size: 12px;">限30个字</span>
                  </div>
                  <p>分享图片 不能超过2MB; 限一张</p>
                </el-radio>
              </el-radio-group>
              <div style="display: flex;">
                <Upimg
                  :exporteurl="exporteurl"
                  :file-list="share"
                  file-name="image"
                  :show-list="true"
                  :file-headers="headers"
                  :disabled="prohibit"
                  :maxlimit="1"
                  :index="4"
                  @Successimg="SuccessimgArray"
                />
                <Upimg
                  v-if="shareShow.length>0"
                  style="margin-left: 20px;"
                  :exporteurl="exporteurl"
                  :file-list="shareShow"
                  file-name="image"
                  :show-list="true"
                  :file-headers="headers"
                  :disabled="true"
                  :maxlimit="1"
                  :index="4"
                />
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { exporteurl, turnDate, exportFile } from "@/utils/user";
import { upimg } from "@/api/user";
import Upimg from "@/components/Upimg";
import {
  addProduct,
  retailLists,
  settop,
  deleteRetail,
  copyRetail,
  getRetailInfo,
  editRetail,
  productmsg,
  templateAdd
} from "@/api/commodity";
import { templateInfo } from "@/api/commodity";
import CommoditySpecification from "@/components/CommoditySpecification";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { Upimg, CommoditySpecification },
  // 过滤器
  filters: {},
  data() {
    // 这里存放数据
    const cateid = (rule, value, callback) => {
      if (this.form.cate_id) {
        callback();
      } else {
        callback(new Error("请选择商品类型"));
      }
    };
    const product_name = (rule, value, callback) => {
      if (value) {
        callback();
      } else {
        callback(new Error("请输入主标题"));
      }
    };
    const product_sub_name = (rule, value, callback) => {
      if (value) {
        callback();
      } else {
        callback(new Error("请输入副标题"));
      }
    };
    const tiem = (rule, value, callback) => {
      if (this.form.product_start_time && this.form.product_end_time) {
        callback();
      } else {
        callback(new Error("请选择时间"));
      }
    };
    const supplier_id = (rule, value, callback) => {
      if (this.form.supplier_id) {
        callback();
      } else {
        callback(new Error("请选择供应商"));
      }
    };
    const supplier_price = (rule, value, callback) => {
      if (value) {
        callback();
      } else {
        callback(new Error("请输入采购价"));
      }
    };
    const product_price = (rule, value, callback) => {
      if (value) {
        callback();
      } else {
        callback(new Error("请输入商品价格"));
      }
    };
    const product_ot_price = (rule, value, callback) => {
      if (value) {
        callback();
      } else {
        callback(new Error("请输入市场价格"));
      }
    };
    const product_stock = (rule, value, callback) => {
      if (value) {
        callback();
      } else {
        callback(new Error("请输入库存"));
      }
    };
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
      exporteurl: exporteurl + upimg,
      headers: {
        token: localStorage.getItem("Token"),
        enctype: "multipart/form-data"
      },
      dialogVisible: false,
      tab: 1,
      rules: {
        cateid: [{ required: true, trigger: "change", validator: cateid }],
        product_name: [
          { required: true, trigger: "blur", validator: product_name }
        ],
        product_sub_name: [
          { required: true, trigger: "blur", validator: product_sub_name }
        ],
        tiem: [{ required: true, trigger: "change", validator: tiem }],
        supplier_id: [
          { required: true, trigger: "change", validator: supplier_id }
        ],
        supplier_price: [
          { required: true, trigger: "blur", validator: supplier_price }
        ],
        product_price: [
          { required: true, trigger: "blur", validator: product_price }
        ],
        product_stock: [
          { required: true, trigger: "blur", validator: product_stock }
        ],
        product_ot_price: [
          { required: true, trigger: "blur", validator: product_ot_price }
        ]
      },
      prohibit: false, //  禁止修改
      product_image: [],
      babyMap: [],
      describe: [],
      share: [],
      fromAgentlist: [],
      category_list: [],
      supplier_list: [],
      shareShow: [],
      addedit: 1,
      daili: true,
      Jurisdiction: {},
      form: { agent_id: JSON.parse(localStorage.getItem("user")).agent_id },
      sort_type: "desc",
      sort_name: "", // 排序类型 商品id=>product_id 商品排序=>product_sort 默认product_sort
      template_list: [],
      templateData: {}
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
        arr.push(res.product_id);
      });
      this.multipleSelection = arr;
    },
    SuccessimgArray(val) {
      console.log("成功复制");
      switch (val.index) {
        case 1:
          this.product_image = val.imgArray;
          break;
        case 2:
          this.babyMap = val.imgArray;
          break;
        case 3:
          this.describe = val.imgArray;
          break;
        case 4:
          this.share = val.imgArray;
          break;
      }
    },
    tabTouch(e, val) {
      let sun = 0;
      this.tab = val;
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
    Initialization() {
      /** 初始化 */
      this.form = {
        agent_id: JSON.parse(localStorage.getItem("user")).agent_id,
        cate_id: 0, // 分类id
        cycle_type: 2,
        dispatching_type: 1, // 配送方式 1 物流配送 2 门店自提
        delivery_day: "1", // 门店自提下单后提示几天发货
        sales_apart_time: "1", // 实时增加 每几小时
        sales_apart_add: "10", // 实时增加 增加几个
        supplier_id: 0, // 供应商id
        group_size: "1", // 每组个数
        is_benefit: 1, // 是否使用优惠券 0:否 1：是
        share_status: 0, // 分享设置 0：固定设置 1：自定义设置
        is_new_special: 2, // 是否为新用户专享（0：否，1：是）
        is_super_special: 0, // 是否可为超级会员专享 0：否 1：是
        vir_sale_type: 1, //  虚拟销量类型 0：固定销量 1：实时增加
        is_system: false // 模板使用
      };
      this.templateData = {};
      this.product_image = []; // 	列表展示图
      this.babyMap = []; // 宝贝图片
      this.describe = []; // 描述
      this.share = []; // 分享展示图
      this.fromAgentlist = [];
      this.category_list = [];
      this.self_addres_list = [];
      this.shareShow = [];
      this.supplier_list = [];
    },
    radiochange() {
      this.form.vir_sale_type == 1
        ? (this.form.vir_sale_type = 0)
        : (this.form.vir_sale_type = 1);
    },
    kucun(val) {
      this.form.product_limit_num = val;
      this.form.days_xg_num = val;
    },
    addMerchandise() {
      // 打开添加
      this.addedit = 1;
      this.daili = false;
      this.Initialization();
      this.getproductmsg();
      this.prohibit = false;
    },
    productcopys(val, tsx) {
      /** 批量复制商品 */
      const that = this;
      let data;
      if (this.multipleSelection.length == 1) {
        data = {
          product_id_str: this.multipleSelection.toString()
        };
      } else {
        that.$message.error("请先选择一条");
        return;
      }
      return new Promise((resolve, reject) => {
        copyRetail(data).then(res => {
          that.loading = false;
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
    },
    setTop(tsx) {
      const that = this;
      const data = {
        product_id: tsx.row.product_id,
        is_top: tsx.row.is_top == 0 ? 1 : 0
      };
      return new Promise((resolve, reject) => {
        settop(data).then(res => {
          this.loading = false;
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
    },
    loopdelete(val, tsx) {
      /** 批量删除 */
      const that = this;
      let data;
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (val == 1) {
            if (this.multipleSelection.length > 0) {
              data = {
                product_id_str: this.multipleSelection.toString()
              };
            } else {
              that.$message.error("请先选择");
              return;
            }
          } else if (val == 2) {
            data = { product_id_str: tsx.product_id };
          }
          return new Promise((resolve, reject) => {
            deleteRetail(data).then(res => {
              that.loading = false;
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
    getproductmsg(modify) {
      /** 新增打开 */
      const that = this;
      return new Promise((resolve, reject) => {
        productmsg({
          agent_id: this.form.agent_id
        }).then(res => {
          this.loading = false;
          if (res.code == 1) {
            if (modify != "modify") {
              that.form.cate_id = 0;
              that.form.supplier_id = 0;
            }
            that.fromAgentlist = res.data.agent_list;
            that.category_list = res.data.category_list;
            that.self_addres_list = res.data.self_addres_list;
            that.supplier_list = res.data.supplier_list;
            that.template_list = res.data.template_list;
            that.dialogVisible = true;
          } else {
            that.$message.error(res.msg);
          }
        });
        resolve();
      }).catch(error => {
        console.log(error);
      });
    },
    template(val) {
      /** 选择模板 */
      console.log(val);
      templateInfo({
        temp_id: val == "" ? 0 : val,
        agent_id: this.form.agent_id
      }).then(res => {
        if (res.code == 1) {
          this.templateData = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    conmit() {
      const that = this;
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log(that.form);
          if (that.form.product_start_time instanceof Date) {
            that.form.product_start_time = turnDate(
              that.form.product_start_time,
              21
            );
          }
          if (that.form.product_end_time instanceof Date) {
            that.form.product_end_time = turnDate(
              that.form.product_end_time,
              21
            );
          }
          if (that.product_image.length > 0) {
            that.form.product_image = that.product_image[0].imgPath;
          } else {
            that.form.product_image = "";
          }
          if (that.babyMap.length > 0) {
            that.form.detail_img_list = JSON.stringify(that.babyMap);
          } else {
            that.form.detail_img_list = "";
          }
          if (that.share.length > 0) {
            that.form.shape_imgs = this.share[0].imgPath;
          } else {
            that.form.shape_imgs = "";
          }
          const detail = [{ title: "", list: [] }];
          if (that.describe.length > 0) {
            that.describe.map(res => {
              detail[0].list.push({
                type: "img",
                content: res.imgPath,
                img_description: ""
              });
            });
          }
          that.form.detail_specifics_list = JSON.stringify(detail);
          if (that.form.is_system) {
            const ss = that.$refs.Template.commit();
            delete ss.agent_id;
            Object.assign(that.form, ss);
          }
          if (that.addedit == 1) {
            that.getAddcommodity(that.form);
          } else {
            that.editData(that.form);
          }
        }
      });
    },
    getAddcommodity(val) {
      /** 添加商品 */
      const that = this;
      return new Promise((resolve, reject) => {
        addProduct(val).then(res => {
          this.loading = false;
          if (res.code == 1) {
            that.$message.success(res.msg);
            that.getDatalist();
            that.dialogVisible = false;
          } else {
            that.$message.error(res.msg);
          }
        });
        resolve();
      }).catch(error => {
        console.log(error);
      });
    },
    editData(val) {
      const that = this;
      return new Promise((resolve, reject) => {
        editRetail(val).then(res => {
          this.loading = false;
          if (res.code == 1) {
            that.$message.success(res.msg);
            that.getDatalist();
            that.dialogVisible = false;
          } else {
            that.$message.error(res.msg);
          }
        });
        resolve();
      }).catch(error => {
        console.log(error);
      });
    },
    addTemplate() {
      const that = this;
      this.$prompt("请输入模板名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          console.log(value);
          const data = that.$refs.Template.commit();
          data.temp_name = value;
          templateAdd(data).then(res => {
            if (res.code == 1) {
              // that.getproductmsg();
              // that.form.Choicetemp_id = res.data.temp_id;
              that.$message.success(res.msg);
            } else {
              that.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    getEdit(val, tsx) {
      /** 获取修改信息 */
      const that = this;
      this.daili = true;
      return new Promise((resolve, reject) => {
        getRetailInfo({ product_id: val.product_id }).then(res => {
          if (res.code == 1) {
            that.form = res.data;
            that.form.product_id = val.product_id;
            that.form.agent_id = res.data.agent_id;
            that.form.product_start_time = new Date(
              res.data.product_start_time
            ); // 	开始时间
            that.form.product_end_time = new Date(res.data.product_end_time); //	结束时间
            if (res.data.is_system) {
              that.form.is_system = res.data.is_system == 1 ? true : false;
            } else that.form.is_system = false;

            if (Array.isArray(res.data.template_default_data)) {
              that.templateData = {}; // 模板数据
            } else {
              that.templateData = res.data.template_default_data; // 模板数据
            }
            const babyMap = [];
            const describe = [];
            const share = [];
            if (res.data.detail_img.detail_img.length > 0) {
              res.data.detail_img.detail_img.map(i => {
                babyMap.push({
                  name: "",
                  imgPath: i.img_default,
                  url: i.img_url
                });
              });
            }
            if (res.data.product_image) {
              that.product_image = [
                {
                  imgPath: res.data.product_image.product_image,
                  name: "",
                  url: res.data.product_image.product_image_url
                }
              ];
            } else {
              that.product_image = [];
            }
            if (res.data.detail_img.detail_specifics.length > 0) {
              if (res.data.detail_img.detail_specifics[0].list.length > 0) {
                res.data.detail_img.detail_specifics[0].list.map(i => {
                  describe.push({
                    name: "",
                    imgPath: i.content,
                    url: i.content_url
                  });
                });
              }
            }
            if (res.data.shape_img) {
              share.push({
                name: "",
                url: res.data.shape_img[0].shape_img_url,
                imgPath: res.data.shape_img[0].shape_img
              });
              that.shareShow = [
                {
                  name: "",
                  url: res.data.shape_img[1].shape_img_url,
                  imgPath: res.data.shape_img[1].shape_img
                }
              ];
            }
            (that.babyMap = babyMap),
              (that.describe = describe),
              (that.share = share),
              (that.dialogVisible = true);
            if (tsx == 2) that.prohibit = true;
            else that.prohibit = false;
            that.addedit = 2;
            that.getproductmsg("modify");
          } else {
            that.$message.error(res.msg);
          }
        });
        resolve();
      }).catch(error => {
        console.log(error);
      });
    },
    getDatalist() {
      const data = {
        keyword: this.keyword,
        limit: this.limit,
        cate_id: this.cate_id,
        sort_type: this.sort_type,
        sort_name: this.sort_name,
        page: this.page
      };
      this.loading = true;
      const that = this;
      return new Promise((resolve, reject) => {
        retailLists(data).then(res => {
          this.loading = false;
          if (res.code == 1) {
            if (res.action) {
              res.action.map(val => {
                switch (val.tag) {
                  case "add_retail_product":
                    if (val.display == 1) {
                      that.Jurisdiction.add = 1;
                    }
                    break;
                  case "loop_delete_retail":
                    if (val.display == 1) {
                      that.Jurisdiction.loop_delete = 1;
                    }
                    break;
                  case "copy_retail":
                    if (val.display == 1) {
                      that.Jurisdiction.copy_retail = 1;
                    }
                    break;
                  case "edit_retail_info":
                    if (val.display == 1) {
                      that.Jurisdiction.edit_retail_info = 1;
                    }
                    break;
                  case "edit_retail":
                    if (val.display == 1) {
                      that.Jurisdiction.edit_retail = 1;
                    }
                    break;
                }
              });
              res.action.map(val => {
                if (val.tag == "orderexport" && val.display == 1) {
                  that.derive = 1;
                }
              });
            }
            if (res.agent_map) {
              that.agent = res.agent_map;
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
    },
    sort(val) {
      if (val.order == "ascending") {
        // 上
        this.sort_type = "asc";
      } else if (val.order == "descending") {
        // 下
        this.sort_type = "desc";
      }
      if (val.prop == "product_id") {
        this.sort_name = "product_id";
      } else if (val.prop == "butler_realname") {
        this.sort_name = "product_sort";
      }
      this.page == 1;
      this.getDatalist();
    }
  }, // 生命周期 - 销毁完成
  ctivated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>

<style lang='scss' scoped>
// @import url(); 引入公共css类
@import "src/styles/hide.scss";
.guigeyanzi {
  display: flex;
  align-items: center;
  > div {
    margin: 0;
  }
}
</style>
