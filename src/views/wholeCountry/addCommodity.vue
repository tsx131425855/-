<!-- tsx 全国商品 -->
<template>
  <div class="package">
    <div class="hide">
      <el-button type="primary" icon="el-icon-circle-plus" @click="addMerchandise">新增</el-button>
      <el-button type="success" icon="el-icon-edit" @click="getEdit(1)">编辑</el-button>
      <el-button type="success" icon="el-icon-edit" @click="getEdit(2)">查看</el-button>
      <el-button type="warning" @click="loopshow('up')">上架</el-button>
      <el-button type="warning" @click="loopshow('down')">下架</el-button>
      <el-button type="danger" icon="el-icon-circle-close" @click="loopdelete(1)">删除</el-button>
      <span style=" margin-left: 10px;">地区</span>
      <el-select v-model="national_area_id" placeholder="请选择">
        <el-option
          v-for="item in national_area_list"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
      <span style=" margin-left: 10px;">上下架</span>
      <el-select v-model="is_show" placeholder="请选择">
        <el-option v-for="item in show_list" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <span style=" margin-left: 10px;">推荐</span>
      <el-select v-model="is_recommend" placeholder="请选择">
        <el-option
          v-for="item in recommend_list"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-input
        v-model="keyword"
        style="margin-left: 10px;width:200px"
        prefix-icon="el-icon-search"
        placeholder="商品id，商品名称"
      />
      <el-button
        type="success"
        style=" margin-left: 10px;"
        icon="el-icon-search"
        @click="page=1,getDatalist()"
      >查询</el-button>
      <el-button type="success" @click="exporte()">导出</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="datalist"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @sort-change="sort"
    >
      <el-table-column fixed type="selection" width="55" prop="product_id" />
      <el-table-column prop="product_id" label="ID" width="80" />
      <el-table-column prop="product_name" label="商品名称" />
      <el-table-column prop="national_area_name" label="地区" />
      <el-table-column prop="product_price" label="商品价格" sortable="custom" />
      <el-table-column prop="product_start_time" label="开始时间" width="90" align="center" />
      <el-table-column prop="product_end_time" label="结束时间" width="90" align="center" />
      <el-table-column prop="product_stock" label="商品库存" width="100" />
      <el-table-column prop="supplier_name" label="所属供应商" />
      <el-table-column prop="butler_realname" label="排序" sortable="custom" fixed="right" width="80">
        <template slot-scope="scope">
          <div>
            <el-input v-model="scope.row.product_sort" @blur=" changesort( scope)" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="is_show_name" label="状态" width="80" align="center" />
      <el-table-column prop="add_time" label="创建时间" width="150" align="center" sortable="custom" />
      <el-table-column prop="is_recommend" label="推荐" width="80" fixed="right">
        <template slot-scope="scope">
          <div
            @click="looprecommend(2,scope)"
            style="display: flex;justify-content: center;cursor:pointer;"
          >
            <i class="el-icon-error" style="color:red" v-if="scope.row.is_recommend==0" />
            <i class="el-icon-success" style="color:green" v-else />
          </div>
        </template>
      </el-table-column>
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
        <el-col :span="6">
          <span>是否推荐</span>
          <el-radio-group v-model="form.is_recommend" :disabled="prohibit">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="6">
          <span>是否上下架</span>
          <el-radio-group v-model="form.is_show" :disabled="prohibit">
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
          label-width="80px"
          label-position="top"
        >
          <div id="basics" class="fromContent">
            <p class="tabtype">基础信息</p>
            <el-row>
              <el-col :span="5">
                <el-form-item label="地区">
                  <el-select v-model="form.national_area_id" class="maright" placeholder="请选择">
                    <el-option
                      v-for="item in national_area_list"
                      :key="item.key"
                      :label="item.value"
                      :value="item.key"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="来自哪里">
                  <el-input placeholder="请输入" class v-model="form.product_from"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="7">
                <el-form-item label="商品主标题">
                  <el-input v-model="form.product_name" placeholder="单行输入" />
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="副标题">
                  <el-input v-model="form.product_sub_name" placeholder="单行输入" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="开始时间-结束时间">
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
                <el-form-item label="商品价格">
                  <el-input-number
                    v-model="form.product_price"
                    controls-position="right"
                    placeholder="单行输入"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="市场价格">
                  <el-input-number
                    v-model="form.product_ot_price"
                    controls-position="right"
                    placeholder="单行输入"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="是否可使用优惠券">
                  <el-radio-group v-model="form.is_benefit">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="是否可为超级会员专享">
                  <el-radio-group v-model="form.is_super_special">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="库存数量">
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
                  @change="templates"
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
            <div>
              <p>视频上传</p>
              <UpVideo
                :exporteurl="exporteurlVideo"
                :fileList="Video"
                fileName="video"
                :showList="true"
                :fileHeaders="headers"
                :maxlimit="1"
                :index="8"
                @Successfile="SuccessVideo"
                @RemoveVideo="RemoveVideo"
              />
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
import { upimg, upVideo } from "@/api/user";
import { exporteurl, turnDate, exportFile } from "@/utils/user";
import Upimg from "@/components/Upimg";
import UpVideo from "@/components/UpVideo";
import { templateInfo } from "@/api/commodity";
import {
  addNational,
  editNational,
  national_msg,
  national_lists,
  national_list_msg,
  national_product_info,
  natioal_export,
} from "@/api/wholeCountry";
import CommoditySpecification from "@/components/CommoditySpecification";
import {
  loop_recommend,
  loop_show,
  change_sort,
  loop_delete,
} from "@/api/commodity";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { Upimg, CommoditySpecification, UpVideo },
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
      exporteurl: exporteurl + upimg,
      exporteurlVideo: exporteurl + upVideo,
      headers: {
        token: localStorage.getItem("Token"),
        enctype: "multipart/form-data",
      },
      Video: [],
      dialogVisible: false,
      tab: 1,
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
      form: {},
      sort_type: "desc",
      sort_name: "", // 排序类型 商品id=>product_id 商品排序=>product_sort 默认product_sort
      template_list: [],
      templateData: {},
      national_area_list: [],
      recommend_list: [],
      show_list: [],
      is_recommend: "",
      national_area_id: "",
      is_show: "",
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
      val.map((res) => {
        arr.push(res);
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
    SuccessVideo(val) {
      this.Video = val;
    },
    RemoveVideo() {
      this.Video = [];
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
        cate_id: 0, // 分类id
        cycle_type: 2,
        dispatching_type: 1, // 配送方式 1 物流配送 2 门店自提
        delivery_day: "1", // 门店自提下单后提示几天发货
        sales_apart_time: "1", // 实时增加 每几小时
        sales_apart_add: "10", // 实时增加 增加几个
        supplier_id: "", // 供应商id
        group_size: "1", // 每组个数
        is_benefit: 1, // 是否使用优惠券 0:否 1：是
        share_status: 0, // 分享设置 0：固定设置 1：自定义设置
        is_new_special: 2, // 是否为新用户专享（0：否，1：是）
        is_super_special: 0, // 是否可为超级会员专享 0：否 1：是
        vir_sale_type: 1, //  虚拟销量类型 0：固定销量 1：实时增加
        is_system: false, // 模板使用
        is_show: 1, // 是否推荐（0：未推荐，1：推荐）
        is_recommend: 0, // 是否为新用户专享（0：否，1：是）
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
      this.Video = [];
    },
    radiochange() {
      this.form.vir_sale_type == 1
        ? (this.form.vir_sale_type = 0)
        : (this.form.vir_sale_type = 1);
    },
    addMerchandise() {
      // 打开添加
      this.addedit = 1;
      this.daili = false;
      this.Initialization();
      this.getproductmsg();
      this.prohibit = false;
    },
    loopshow(val) {
      /** 上下架 */
      let that = this;
      if (this.multipleSelection.length > 0) {
        let data = {
          product_id_str: this.multipleSelection
            .flatMap((x) => [x.product_id])
            .toString(),
          type: val,
        };
        return new Promise((resolve, reject) => {
          loop_show(data).then((res) => {
            that.loading = false;
            if (res.code == 1) {
              that.$message.success(res.msg);
              that.getDatalist();
            } else {
              that.$message.error(res.msg);
            }
          });
          resolve(res);
        }).catch((error) => {
          console.log(error);
        });
      } else {
        that.$message.error("请先选择");
      }
    },
    changesort(val) {
      /** 修改排序 */
      let that = this;
      let data = {
        product_id: val.row.product_id,
        product_sort: val.row.product_sort,
      };
      return new Promise((resolve, reject) => {
        change_sort(data).then((res) => {
          this.loading = false;
          if (res.code == 1) {
            that.$message.success(res.msg);
            that.getDatalist();
          } else {
            that.$message.error(res.msg);
          }
        });
        resolve(res);
      }).catch((error) => {
        console.log(error);
      });
    },
    looprecommend(val, tsx) {
      /** 推荐 */
      let that = this;
      let data;
      if (val == 1) {
        if (this.multipleSelection.length > 0) {
          data = {
            product_id_str: this.multipleSelection
              .flatMap((x) => [x.product_id])
              .toString(),
          };
        } else {
          that.$message.error("请先选择");
          return;
        }
      } else if (val == 2) {
        data = { product_id_str: tsx.row.product_id };
      }
      return new Promise((resolve, reject) => {
        loop_recommend(data).then((res) => {
          this.loading = false;
          if (res.code == 1) {
            that.$message.success(res.msg);
            that.getDatalist();
          } else {
            that.$message.error(res.msg);
          }
        });
        resolve();
      }).catch((error) => {
        console.log(error);
      });
    },
    loopdelete(val, tsx) {
      /** 批量删除 */
      const that = this;
      if (this.multipleSelection.length == 0) {
        return that.$message.error("请先选择");
      }
      let data = {
        product_id_str: this.multipleSelection
          .flatMap((x) => [x.product_id])
          .toString(),
      };
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return new Promise((resolve, reject) => {
            loop_delete(data).then((res) => {
              that.loading = false;
              if (res.code == 1) {
                that.$message.success(res.msg);
                that.getDatalist();
              } else {
                that.$message.error(res.msg);
              }
            });
            resolve();
          }).catch((error) => {
            console.log(error);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    getproductmsg(modify) {
      /** 新增打开 */
      const that = this;
      return new Promise((resolve, reject) => {
        national_msg({}).then((res) => {
          if (res.code == 1) {
            if (modify != "modify") {
              that.form.supplier_id = "";
            }
            that.fromAgentlist = res.data.agent_list;
            that.category_list = res.data.category_list;
            that.self_addres_list = res.data.self_addres_list;
            that.supplier_list = res.data.supplier_list;
            that.template_list = res.data.template_list;
            that.national_area_list = res.data.national_area_list;
            that.dialogVisible = true;
          } else {
            that.$message.error(res.msg);
          }
        });
        resolve();
      }).catch((error) => {
        console.log(error);
      });
    },
    templates(val) {
      /** 选择模板 */
      let agent_id;
      this.template_list.map((x) => {
        if (x.temp_id === val) {
          agent_id = x.agent_id;
        }
      });
      templateInfo({
        temp_id: val == "" ? 0 : val,
        agent_id: agent_id,
      }).then((res) => {
        if (res.code == 1) {
          this.templateData = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    conmit() {
      const that = this;
      this.$refs.form.validate((valid) => {
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
          if (that.Video.length > 0) {
            that.form.video_url = that.Video[0].video_path;
            that.form.video_cover_img = that.Video[0].video_cover_img;
          } else {
            that.form.video_url = "";
            that.form.video_cover_img = "";
          }
          const detail = [{ title: "", list: [] }];
          if (that.describe.length > 0) {
            that.describe.map((res) => {
              detail[0].list.push({
                type: "img",
                content: res.imgPath,
                img_description: "",
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
        addNational(val).then((res) => {
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
      }).catch((error) => {
        console.log(error);
      });
    },
    editData(val) {
      const that = this;
      return new Promise((resolve, reject) => {
        editNational(val).then((res) => {
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
      }).catch((error) => {
        console.log(error);
      });
    },
    addTemplate() {
      const that = this;
      this.$prompt("请输入模板名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          console.log(value);
          const data = that.$refs.Template.commit();
          data.temp_name = value;
          templateAdd(data).then((res) => {
            if (res.code == 1) {
              that.getproductmsg();
              that.form.Choicetemp_id = res.data.temp_id;
              that.$message.success(res.msg);
            } else {
              that.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    getEdit(val, tsx) {
      /** 获取修改信息 */
      const that = this;
      this.daili = true;
      if (this.multipleSelection.length == 1) {
        if (val == 1 && this.multipleSelection[0].is_show == 1) {
          that.$message.error("请先下架商品");
          return;
        }
        national_product_info({
          product_id: this.multipleSelection[0].product_id,
        }).then((res) => {
          if (res.code == 1) {
            that.form = res.data;
            that.form.product_id = this.multipleSelection[0].product_id;
            that.form.product_start_time = new Date(
              res.data.product_start_time
            ); // 	开始时间
            that.form.product_end_time = new Date(res.data.product_end_time); //	结束时间
            if (res.data.is_system) {
              that.form.is_system = res.data.is_system == 1 ? true : false;
              // that.form.Choicetemp_id = res.data.temp_id;
            } else that.form.is_system = false;
            if (Array.isArray(res.data.template_default_data)) {
              that.templateData = {}; // 模板数据
            } else {
              that.templateData = res.data.template_default_data; // 模板数据
            }
            // const babyMap = [];
            // const describe = [];
            // const share = [];
            const [babyMap, describe, share] = [[], [], []];
            if (res.data.detail_img.detail_img.length > 0) {
              res.data.detail_img.detail_img.map((i) => {
                babyMap.push({
                  name: "",
                  imgPath: i.img_default,
                  url: i.img_url,
                });
              });
            }
            if (res.data.product_image) {
              that.product_image = [
                {
                  imgPath: res.data.product_image.product_image,
                  name: "",
                  url: res.data.product_image.product_image_url,
                },
              ];
            } else {
              that.product_image = [];
            }
            if (res.data.detail_img.detail_specifics.length > 0) {
              if (res.data.detail_img.detail_specifics[0].list.length > 0) {
                res.data.detail_img.detail_specifics[0].list.map((i) => {
                  describe.push({
                    name: "",
                    imgPath: i.content,
                    url: i.content_url,
                  });
                });
              }
            }
            if (res.data.shape_img) {
              share.push({
                name: "",
                url: res.data.shape_img[0].shape_img_url,
                imgPath: res.data.shape_img[0].shape_img,
              });
              that.shareShow = [
                {
                  name: "",
                  url: res.data.shape_img[1].shape_img_url,
                  imgPath: res.data.shape_img[1].shape_img,
                },
              ];
            }
            if (res.data.video_url && res.data.video_url.length > 0) {
              that.Video = [
                {
                  name: "",
                  video_path: res.data.video_url.video_url,
                  video_url: res.data.video_url.video_url_detail,
                  video_cover_img: res.data.video_cover_img.video_cover_img,
                  url: res.data.video_cover_img_url,
                },
              ];
            } else that.Video = [];

            (that.babyMap = babyMap),
              (that.describe = describe),
              (that.share = share),
              (that.dialogVisible = true);
            if (val == 2) that.prohibit = true;
            else that.prohibit = false;
            that.addedit = 2;
            that.getproductmsg("modify");
          } else {
            that.$message.error(res.msg);
          }
        });
      } else {
        that.$message.error("请先选择一条");
      }
    },
    exporte() {
      /** 导出 */

      const url = `${exporteurl}${natioal_export}?is_recommend=${
        this.is_recommend
      }&national_area_id=${this.national_area_id}&is_show=${
        this.is_show
      }&keyword=${this.keyword}&token=${localStorage.getItem("Token")}`;
      exportFile(url);
    },
    getDatalist() {
      const data = {
        keyword: this.keyword,
        limit: this.limit,
        is_recommend: this.is_recommend,
        national_area_id: this.national_area_id,
        is_show: this.is_show,
        sort_type: this.sort_type,
        sort_name: this.sort_name,
        page: this.page,
      };
      this.loading = true;
      const that = this;
      return new Promise((resolve, reject) => {
        national_lists(data).then((res) => {
          this.loading = false;
          if (res.code == 1) {
            if (res.agent_map) {
              that.agent = res.agent_map;
            }
            that.datalist = res.data.list;
            that.national_area_list = res.data.national_area_list;
            that.show_list = res.data.show_list;
            that.recommend_list = res.data.recommend_list;
            that.total = res.data.total;
          } else if (res.code === 2) {
            that.$message.error(res.msg);
          } else {
            that.$message.error(res.msg);
          }
        });
        resolve();
      }).catch((error) => {
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
      if (val.prop == "product_price") {
        this.sort_name = "product_price";
      } else if (val.prop == "add_time") {
        this.sort_name = "add_time";
      } else if (val.prop == "product_sort") {
        this.sort_name = "product_sort";
      }
      this.page == 1;
      this.getDatalist();
    },
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
  ctivated() {}, // 如果页面有keep-alive缓存功能，这个函数会触发
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
.zhong {
  border-color: #409eff;
  background: #409eff;
  border: 1px solid #dcdfe6;
  border-radius: 100%;
  width: 16px;
  height: 16px;
  cursor: pointer;
  box-sizing: border-box;
  position: relative;
  display: inline-block;
  white-space: nowrap;
  cursor: pointer;
  outline: 0;
  line-height: 1;
  vertical-align: middle;
}
.si {
  border: 1px solid #dcdfe6;
  border-radius: 100%;
  width: 16px;
  height: 16px;
  background-color: #fff;
  cursor: pointer;
  position: relative;
  display: inline-block;
  box-sizing: border-box;
}
.xiaoquan {
  transform: translate(-50%, -50%) scale(1);
  width: 4px;
  height: 4px;
  border-radius: 100%;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
}
</style>
