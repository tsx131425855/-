<!-- tsx -->
<template>
  <div class>
    <div class="addhide">
      <el-col :span="6">
        <el-button size="small" @click="closeShow">关闭</el-button>
        <el-button v-show="addedit==3?false:true" size="small" @click="conmit">保存</el-button>
      </el-col>
      <el-col :span="6">
        <span>是否上下架</span>
        <el-radio-group v-model="form.is_show" :disabled="addedit==3?true:false">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="2">否</el-radio>
        </el-radio-group>
      </el-col>
      <el-col :span="6">
        <span>是否推荐</span>
        <el-radio-group v-model="form.is_recommend" :disabled="addedit==3?true:false">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-col>
      <el-col :span="6">
        <span>新用户专享</span>
        <el-radio-group v-model="form.is_new_special" :disabled="addedit==3?true:false">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="2">否</el-radio>
        </el-radio-group>
      </el-col>
    </div>
    <!-- tab -->
    <div class="maxtab">
      <div class="tabtype" :class="tab==1?'tabbott':''" @click="tabTouch($event,1)">
        基础信息
        <div></div>
      </div>
      <div class="tabtype" :class="tab==2?'tabbott':''" @click="tabTouch($event,2)">
        商品价格
        <div></div>
      </div>
      <div class="tabtype" :class="tab==2?'tabbott':''">
        商品规格
        <div></div>
      </div>
      <div class="tabtype" :class="tab==4?'tabbott':''" @click="tabTouch($event,4)">
        商品描述
        <div></div>
      </div>
      <div class="tabtype" :class="tab==3?'tabbott':''">
        分佣设置
        <div></div>
      </div>
      <div class="tabtype" :class="tab==5?'tabbott':''" @click="tabTouch($event,5)">
        分享设置
        <div></div>
      </div>
    </div>
    <!-- 表单输入 -->
    <div class="fromSlide" id="from" ref="Box" @scroll="orderScroll">
      <!-- 基础信息 -->
      <el-form
        ref="form"
        :model="form"
        :disabled="addedit==3?true:false"
        :rules="rules"
        label-width="80px"
        label-position="top"
      >
        <div class="fromContent" id="basics">
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
              <el-form-item label="所属代理商" :required="true">
                <el-select
                  v-model="form.agent_id"
                  class="maright"
                  placeholder="请选择"
                  :disabled="addedit==1?false:true"
                  @change="getproductmsg"
                >
                  <el-option
                    v-for="item in fromAgentlist"
                    :key="item.agent_id"
                    :label="item.name"
                    :value="item.agent_id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="排序">
                <el-input-number
                  v-model="form.product_sort"
                  :min="0"
                  placeholder="单行输入"
                  controls-position="right"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="7">
              <el-form-item label="商品主标题" prop="product_name">
                <el-input placeholder="单行输入" v-model="form.product_name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="副标题" prop="product_sub_name">
                <el-input placeholder="单行输入" v-model="form.product_sub_name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="5">
              <el-form-item label="所属乡镇">
                <!-- <el-input placeholder="请输入" class="frominput" v-model="form.town_code"></el-input> -->
                <el-select v-model="form.town_code" class="maright" placeholder="请选择">
                  <el-option
                    v-for="item in village_list"
                    :key="item.street_code"
                    :label="item.street_name"
                    :value="item.street_code"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="开始时间-结束时间" prop="tiem">
                <el-date-picker
                  type="datetime"
                  v-model="form.product_start_time"
                  placeholder="选择日期时间"
                />
                <el-date-picker
                  type="datetime"
                  v-model="form.product_end_time"
                  placeholder="选择日期时间"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="是否循环上/下架" :required="true">
            <el-radio-group v-model="form.cycle_type">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="配送方式">
            <el-radio-group v-model="form.dispatching_type" :required="true">
              <el-radio :label="1" style="margin-bottom: 20px;width:100%">
                <span style="width:100px;display: inline-block;">物流</span>
                <span>运费</span>
                <el-input-number
                  v-model="form.product_postage"
                  :min="0"
                  controls-position="right"
                  placeholder="0元为包邮"
                  class="frominput"
                />
                <span style="margin-left: 20px;">下单成功后</span>
                <el-input-number
                  v-model="form.after_order_delivery"
                  :min="0"
                  controls-position="right"
                  placeholder="0元为包邮"
                  class="frominput"
                />
                <span style="margin-left: 10px;">天发货</span>
                <span style="margin-left: 80px;">下单成功后发货提示</span>
                <el-input v-model="form.delivery_tip	" placeholder="0元为包邮" class="frominput" />
              </el-radio>
              <el-radio :label="2">
                <span style="width:100px;display: inline-block;">门店自提</span>
                <span>商品截单后</span>
                <el-input-number
                  v-model="form.delivery_day"
                  :min="0"
                  placeholder
                  class="frominput"
                  controls-position="right"
                />
                <span>天发货</span>
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="虚拟销量">
            <el-radio :label="0" :value="0" style="margin-bottom: 20px;width:100%">
              <span style="width:100px;display: inline-block;">固定销量</span>
              <el-input-number
                v-model="form.product_sales"
                :min="0"
                placeholder="销售量"
                class="frominput"
                controls-position="right"
              />
              <span style="color: red;font-size: 12px;">设置的销量后商品前端销售量=固定小时+实际销售</span>
            </el-radio>
            <div v-if="addedit==3?true:false">
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
                :min="0"
                placeholder
                controls-position="right"
                class="frominput"
              />
              <span>小时</span>
              <span>&nbsp; 实时增加</span>
              <el-input-number
                v-model="form.sales_apart_add"
                :min="0"
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
                :min="0"
                controls-position="right"
                placeholder
                class="frominput"
              />
              <span>小时</span>
              <span>&nbsp; 实时增加</span>
              <el-input-number
                v-model="form.sales_apart_add"
                :min="0"
                controls-position="right"
                placeholder
                class="frominput"
              />
              <span style="color: red;font-size: 12px;">实时增加虚拟销量将会按设置好的数值自动增加</span>
            </el-radio>
          </el-form-item>
          <el-form-item label="货号">
            <el-input placeholder="单行输入" v-model="form.product_sn" style="width:300px"></el-input>
          </el-form-item>

          <el-row :gutter="20">
            <el-col :span="7">
              <el-form-item label="标签">
                <el-input placeholder="单行输入" v-model="form.product_tag" style="width:300px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="标签色">
                <el-color-picker v-model="form.colour_code"></el-color-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="7">
              <el-form-item label="供应商">
                <el-select placeholder="请选择" v-model="form.supplier_id">
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
                <el-input-number
                  v-model="form.supplier_price"
                  :min="0"
                  controls-position="right"
                  placeholder="单行输入"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!-- 商品价格 -->
        <div class="fromContent" id="Price">
          <p class="tabtype">商品价格</p>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="商品价格" prop="product_price">
                <el-input-number
                  v-model="form.product_price"
                  :min="0"
                  controls-position="right"
                  placeholder="单行输入"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="市场价格" prop="product_ot_price">
                <el-input-number
                  v-model="form.product_ot_price"
                  :min="0"
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
                  :min="0"
                  @input="kucun"
                  controls-position="right"
                  placeholder="单行输入"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="每组个数">
                <el-input-number v-model="form.group_size" :min="0" controls-position="right" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="单用户限购">
                <el-input-number
                  v-model="form.product_limit_num"
                  :min="0"
                  controls-position="right"
                  placeholder="不设置为不限"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="当天限购">
                <el-input-number
                  v-model="form.days_xg_num"
                  :min="0"
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
              :elsec="addedit"
              ref="Template"
              :templateData="templateData"
              :isShow="false"
            />
          </div>
        </div>

        <!-- 商品描述 -->
        <div class="fromContent" id="describe">
          <p style="color:red">1、手动修改了图片扩展名，点击保存时会提示网络错误</p>
          <p style="color:red">2、使用截图功能获取的图片，点击保存时会提示网络错误</p>
          <p style="color:red">3、如果发现这个现象可用微信将这张图片，发送至好友或者文件传输助手在发一次</p>
          <p class="tabtype">
            商品描述
            <span style>小不能超过2MB;限一张</span>
          </p>
          <div>
            <p>商品矩形图</p>
            <Upimg
              :exporteurl="exporteurl"
              :fileList="product_rectangle_imagelist"
              fileName="image"
              :showList="true"
              :fileHeaders="headers"
              :disabled="addedit==3?true:false"
              :maxlimit="1"
              :index="9"
              @Successimg="SuccessimgArray"
            />
          </div>
          <div>
            <p>列表展示图</p>
            <Upimg
              :exporteurl="exporteurl"
              :fileList="product_image"
              fileName="image"
              :showList="true"
              :fileHeaders="headers"
              :disabled="addedit==3?true:false"
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
                :fileList="babyMap"
                fileName="image"
                :showList="true"
                :fileHeaders="headers"
                :disabled="addedit==3?true:false"
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
                :fileList="describe"
                fileName="image"
                :showList="true"
                :fileHeaders="headers"
                :disabled="addedit==3?true:false"
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
              :disabled="addedit==3?true:false"
              :maxlimit="1"
              :index="8"
              @Successfile="SuccessVideo"
              @RemoveVideo="RemoveVideo"
            />
          </div>
        </div>
        <!-- 分佣设置 -->
        <div class="fromContent" id="commission">
          <p class="tabtype">分佣设置</p>
          <el-form-item label="合伙人">
            <el-checkbox v-model="form.partner_retail_status">
              <el-input-number
                v-model="form.cm_rate_partner"
                :disabled="!form.partner_retail_status"
                controls-position="right"
                :min="0"
                placeholder="单行输入"
                style="width: 300px;"
              />
            </el-checkbox>
          </el-form-item>
          <el-form-item label="负责人">
            <el-checkbox v-model="form.village_retail_status">
              <el-input-number
                v-model="form.cm_rate_village"
                :disabled="!form.village_retail_status"
                controls-position="right"
                :min="0"
                placeholder="单行输入"
                style="width: 300px;"
              />
            </el-checkbox>
          </el-form-item>
        </div>

        <!-- 粉丝佣金 -->
        <div class="fromContent" id="commission">
          <p class="tabtype">粉丝佣金</p>
          <el-form-item label>
            <el-checkbox v-model="form.village_rake_back_status">
              <el-input-number
                v-model="form.cm_rate_fans"
                controls-position="right"
                :disabled="!form.village_rake_back_status"
                :min="0"
                placeholder="单行输入"
                style="width: 300px;"
              />
            </el-checkbox>
          </el-form-item>
        </div>
        <!-- 分享设置 -->
        <div class="fromContent" id="share">
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
                :fileList="share"
                fileName="image"
                :showList="true"
                :fileHeaders="headers"
                :disabled="addedit==3?true:false"
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
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { templateInfo } from "@/api/commodity";
import { exporteurl, turnDate, exportFile, CopyObject } from "@/utils/user";
import { upimg, upVideo } from "@/api/user";
import Upimg from "@/components/Upimg";
import UpVideo from "@/components/UpVideo";
import CommoditySpecification from "@/components/CommoditySpecification";
import { productmsg, templateAdd } from "@/api/commodity";
export default {
  components: { Upimg, UpVideo, CommoditySpecification },
  // import引入的组件需要注入到对象中才能使用
  props: {
    showAddress: {
      /** 1全部展示 */
      type: Number,
      default: 1
    },
    agent: {
      type: Array,
      default: () => {
        return [];
      }
    },

    addedit: {
      /** 1新增  2编辑  3查看 */
      type: Number,
      default: 1
    },
    info: {
      type: Object,
      default: () => {
        return {};
      }
    },
    other: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
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
      Video: [] /** 视频上传成功 */,
      exporteurl: exporteurl + upimg /** 上传图片的路径 */,
      exporteurlVideo: exporteurl + upVideo /** 视频上传路径 */,
      headers: {
        token: localStorage.getItem("Token"),
        enctype: "multipart/form-data"
      } /** 规定的请求头 */,
      specifications: [], //  添加规格
      dialogVisible: true /** 规格 */,
      form: {} /** 表单数据 */,
      tab: 1 /** tab 切换数据 */,
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
      product_image: [],
      babyMap: [],
      describe: [],
      share: [],
      fromAgentlist: [],
      category_list: [],
      self_addres_list: [],
      village_list: [],
      supplier_list: [],
      product_rectangle_imagelist: [],
      shareShow: [],
      template_list: [],
      templateData: {}
    };
  },
  // 过滤器
  filters: {},
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    info(val) {
      if (JSON.stringify(val) != "{}") {
        this.form = val;
      }
    },
    other(val) {}
  },
  // 方法集合
  methods: {
    closeShow() {
      /** 关闭 */
      this.$emit("colse");
    },
    conmit() {
      /** 提交 */
      this.$emit("getinfo", { formdata: this.form });
    },
    tabTouch(e, val) {
      /** 点击滑动 */
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
      /** 滑块滑动标题改变 */
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
        product_sort: "1", //
        product_name: "", // 商品名称
        product_sub_name: "", //	商品副标题
        product_price: "", // 商品价格
        product_ot_price: "", // 市场价
        product_start_time: "", // 	开始时间
        product_end_time: "", //	结束时间
        cycle_type: 1, // 是否循环上下架 2:否 1：是
        dispatching_type: 2, // 配送方式 1 物流配送 2 门店自提
        product_postage: "", // 物流运费
        after_order_delivery: "", // 物流下单成功后几天发货天数
        delivery_tip: "", // 物流下单成功后发货提示
        delivery_day: "1", // 门店自提下单后提示几天发货
        product_sales: "", // 固定销量
        sales_apart_time: "1", // 实时增加 每几小时
        sales_apart_add: "10", // 实时增加 增加几个
        product_sn: "", // 货号
        product_tag: "", // 商品标签id 多个用逗号隔开
        supplier_id: 0, // 供应商id
        supplier_name: "", // 供应商名称
        supplier_price: "", // 采购价
        product_coin: "", // 金币限制抵扣
        product_stock: "", // 库存
        group_size: "1", // 每组个数
        product_limit_num: "", // 单用户限购
        days_xg_num: "", // 当天限购
        is_benefit: 1, // 是否使用优惠券 0:否 1：是
        product_image: "", // 	列表展示图
        detail_img_list: "", // 宝贝图片 (多图中间用逗号隔开)
        detail_specifics_list: "", // 描述
        share_status: 0, // 分享设置 0：固定设置 1：自定义设置
        share_words: "", // 分享文案 最多30字
        shape_imgs: "", // 分享展示图
        is_show: 1, // 是否上下架 2未下架，1为上架
        is_recommend: 0, // 是否推荐（0：未推荐，1：推荐）
        is_new_special: 2, // 是否为新用户专享（0：否，1：是）
        is_super_special: 0, // 是否可为超级会员专享 0：否 1：是
        vir_sale_type: 1, //  虚拟销量类型 0：固定销量 1：实时增加
        cm_rate_partner: "", // 合伙人分佣比必
        cm_rate_village: "", // 负责人分佣比
        town_code: 0, // 所属乡镇
        village_rake_back_status: false,
        partner_retail_status: false,
        village_retail_status: false,
        is_system: false, // 模板使用
        Choicetemp_id: ""
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
      this.product_rectangle_imagelist = [];
    },
    getproductmsg(modify) {
      /** 获取数据内容 */
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
              that.form.town_code = 0;
              that.form.Choicetemp_id = "";
            }
            that.fromAgentlist = res.data.agent_list;
            that.category_list = res.data.category_list;
            that.self_addres_list = res.data.self_addres_list;
            that.supplier_list = res.data.supplier_list;
            that.village_list = res.data.village_list;
            that.template_list = res.data.template_list;
          } else {
            that.$message.error(res.msg);
          }
        });
        resolve();
      }).catch(error => {
        console.log(error);
      });
    },
    radiochange() {
      /** 实时增加切换改变 */
      this.form.vir_sale_type == 1
        ? (this.form.vir_sale_type = 0)
        : (this.form.vir_sale_type = 1);
    },
    kucun(val) {
      /** 再没有填写用户限购的时候  库存数量就等于是限购数量 */
      if (this.form.product_limit_num && this.form.product_limit_num == 0) {
        this.form.product_limit_num = val;
      }
      if (this.form.days_xg_num && this.form.days_xg_num == 0) {
        this.form.days_xg_num = val;
      }
    },
    template(val) {
      /** 选择模板 */
      console.log(val);
      templateInfo({ temp_id: val == "" ? 0 : val }).then(res => {
        if (res.code == 1) {
          this.templateData = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    addTemplate() {
      /** 新增到模板列表里 */
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
    SuccessimgArray(val) {
      /** 上传图片成功 */
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
        case 9:
          this.product_rectangle_imagelist = val.imgArray;
          break;
      }
    },
    SuccessVideo(val) {
      /** 上传视频成功 */
      this.Video = val;
    },
    RemoveVideo() {
      /** 清空视频 */
      this.Video = [];
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    if (JSON.stringify(this.info) != "{}") {
      this.form = this.info;
      this.form.product_start_time = new Date(this.info.product_start_time); // 	开始时间
      this.form.product_end_time = new Date(this.info.product_end_time); //	结束时间
      this.form.partner_retail_status =
        this.info.partner_retail_status == 1 ? true : false;
      this.form.village_retail_status =
        this.info.village_retail_status == 1 ? true : false;
      this.form.village_rake_back_status =
        this.info.village_rake_back_status == 1 ? true : false;
      this.form.is_system = this.info.is_system == 1 ? true : false;

      if (Array.isArray(this.info.template_default_data)) {
        this.templateData = {}; // 模板数据
      } else {
        this.templateData = this.info.template_default_data; // 模板数据
      }
      this.form = CopyObject(this.form);
      const babyMap = [];
      const describe = [];
      const share = [];
      if (this.info.detail_img.detail_img.length > 0) {
        this.info.detail_img.detail_img.map(i => {
          babyMap.push({
            name: "",
            imgPath: i.img_default,
            url: i.img_url
          });
        });
      }
      if (this.info.product_image) {
        this.product_image = [
          {
            imgPath: this.info.product_image.product_image,
            name: "",
            url: this.info.product_image.product_image_url
          }
        ];
      } else {
        this.product_image = [];
      }

      if (this.info.product_rectangle_image) {
        this.product_rectangle_imagelist = [
          {
            imgPath: this.info.product_rectangle_image.product_rectangle_image,
            name: "",
            url: this.info.product_rectangle_image.product_rectangle_image_url
          }
        ];
      } else {
        this.product_rectangle_imagelist = [];
      }

      if (this.info.detail_img.detail_specifics.length > 0) {
        if (this.info.detail_img.detail_specifics[0].list.length > 0) {
          this.info.detail_img.detail_specifics[0].list.map(i => {
            describe.push({
              name: "",
              imgPath: i.content,
              url: i.content_url
            });
          });
        }
      }
      if (this.info.shape_img) {
        share.push({
          name: "",
          url: this.info.shape_img[0].shape_img_url,
          imgPath: this.info.shape_img[0].shape_img
        });
        this.shareShow = [
          {
            name: "",
            url: this.info.shape_img[1].shape_img_url,
            imgPath: this.info.shape_img[1].shape_img
          }
        ];
      }
      if (this.info.video_url) {
        this.Video = [
          {
            name: "",
            video_path: this.info.video_url.video_url,
            video_url: this.info.video_url.video_url_detail,
            video_cover_img: this.info.video_cover_img.video_cover_img,
            url: this.info.video_cover_img.video_cover_img_url
          }
        ];
      }
    }
    if (JSON.stringify(this.other) != "{}") {
      this.fromAgentlist = this.other.agent_list;
      this.category_list = this.other.category_list;
      this.self_addres_list = this.other.self_addres_list;
      this.supplier_list = this.other.supplier_list;
      this.village_list = this.other.village_list;
      this.template_list = this.other.template_list;
    }
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
