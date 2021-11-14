<template>
  <!-- 运营活动详情 -->
  <div class="root">
    <div class="topChange">
      <el-button @click="$router.back(-1)" v-show="type === 1" size="medium" type="primary">关闭</el-button>
      <el-button @click="changeType(2)" v-show="type === 1" size="medium" type="warning">编辑</el-button>
      <el-button
        @click="commit"
        v-show="type === 2"
        size="medium"
        type="success"
      >{{ id ? '保存修改' : '添加活动' }}</el-button>
      <el-button @click="$router.back(-1)" v-show="type === 2" size="medium" type="info">取消</el-button>
    </div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <div>
        <el-form label-width="100px" class="demo-form-inline" @submit.native.prevent>
          <el-form-item label="活动名称:">
            <el-input
              :readonly="type === 1"
              style="width: 200px"
              v-model="name"
              placeholder="请输入活动名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="代理商:">
            <el-select :disabled="type === 1" v-model="agent_id" placeholder="请选择">
              <el-option
                :label="item.name"
                v-for="(item, index) in agent_map"
                :key="index"
                :value="item.agent_id"
              ></el-option>
            </el-select>
            <span v-show="agent_id_self === '1'" class="laber">(提示：切换代理商进行保存操作，将导致该活动绑定商品以及优惠券被清空！)</span>
          </el-form-item>
          <el-form-item label="活动时间:">
            <el-date-picker
              :readonly="type === 1"
              v-model="timeOut"
              style="width: 450px"
              align="center"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="顶部图片:">
            <Upimg
              :disabled="type === 1"
              :exporteurl="exporteurl"
              :fileList="imgArr"
              fileName="image"
              :showList="true"
              :fileHeaders="headers"
              :maxlimit="1"
              :index="1"
              @Successimg="SuccessimgArray"
            ></Upimg>
          </el-form-item>

          <el-form-item label="活动规则:">
            <el-input
              :readonly="type === 1"
              style="width: 400px"
              v-model="rule"
              type="textarea"
              :autosize="{ minRows: 2,}"
              placeholder="请输入活动规则"
            ></el-input>
          </el-form-item>
          <el-form-item label="页面背景色:">
            <!-- <el-input style="width: 120px" v-model="name" placeholder="请输入背景色"></el-input> -->
            <el-color-picker show-alpha :disabled="type === 1" v-model="bg_color"></el-color-picker>
            <div
              @click="$message.warning('如需修改背景色请在左侧进行操作\t(若选择器呈灰色时即查看模式; 不能操作)')"
              :style="'background-color:'+ (bg_color || '#f5f5f5')"
              class="show-color"
            >内容示例</div>
          </el-form-item>
          <el-form-item label="商品布局:">
            <el-radio v-show=" !(type === 1 && layout !== 1) " v-model="layout" :label="1">双排</el-radio>
            <el-radio v-show=" !(type === 1 && layout !== 2) " v-model="layout" :label="2">单排</el-radio>
          </el-form-item>
          <el-form-item label="分享设置:">
            <el-radio-group style="margin-top: 10px;" v-model="share_type">
              <div class="radio-item">
                <el-radio
                  :disabled="type === 1 && share_type != 1"
                  :label="1"
                >固定分享（标题为活动标题，图片为活动顶部图）</el-radio>
              </div>
              <div class="radio-item">
                <el-radio :disabled="type === 1 && share_type != 2" :label="2">自定义分享</el-radio>
                <div style="margin: 15px 30px 20px;">
                  分享文案 (限20字): &nbsp;&nbsp;
                  <el-input
                    :disabled="share_type != 2 || type === 1"
                    v-model="share_title"
                    style="width:300px"
                    maxlength="20"
                    placeholder="请输入分享文案"
                  ></el-input>
                </div>
                <div style="margin: 15px 30px;">分享图片:&nbsp;&nbsp;</div>
                <Upimg
                  style="margin-left:30px;"
                  :disabled="type === 1 || share_type != 2"
                  :exporteurl="exporteurl"
                  :fileList="shareImg"
                  fileName="image"
                  :showList="true"
                  :fileHeaders="headers"
                  :maxlimit="1"
                  :index="2"
                  @Successimg="SuccessimgArray"
                ></Upimg>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 优惠券列表  (如果在添加活动(没有活动id)就不显示,  以及查看状态且没有任何数据也不显示) -->
    <el-card v-show=" !(type === 1 && coupon.list.length === 0) && !!id" class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size:20px;">优惠券</span>
        <!-- 只有在编辑模式下才会显示操作按钮 -->
        <div v-show="type === 2 && id" style="float: right;">
          <el-button
            size="medium"
            @click="coupon_mask.show = true; coupon_mask.agent_id = agent_id; getCouponMaskList();"
            type="success"
          >添加</el-button>
          <el-button size="medium" @click="deleteCoupon" type="warning">删除</el-button>
          <el-button size="medium" @click="emptyCoupon" type="info">清空列表</el-button>
        </div>
      </div>
      <div>
        <template>
          <el-table
            v-loading="coupon.loading"
            :data="coupon.list"
            border
            stripe
            max-height="520"
            fit
            @selection-change="val => { this.coupon.multipleSelection = val; }"
          >
            <el-table-column fixed align="center" type="selection" width="55"></el-table-column>

            <!-- <el-table-column fixed align="center" prop="service_id" label="售后ID" /> -->
            <el-table-column fixed align="center" prop="coupon_batch_number" label="批次码" />
            <el-table-column fixed align="center" prop="coupon_type" label="优惠券类型" />

            <el-table-column align="center" min-width="200" prop="coupon_name" label="优惠券名称" />
            <el-table-column align="center" prop="coupon_where" label="优惠条件" />
            <el-table-column align="center" prop="coupon_money" label="折扣金额" />
            <el-table-column align="center" prop="coupon_discount_type" label="折扣类型" />
            <el-table-column align="center" label="排序">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-arrow-up"
                  circle
                  @click="handleChangeIndex(1 ,1, scope.row.id)"
                ></el-button>
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-arrow-down"
                  circle
                  @click="handleChangeIndex(2 ,1, scope.row.id)"
                ></el-button>
              </template>
            </el-table-column>
            <!-- <el-table-column align="center" prop="create_time" label="二级代理商抽成"></el-table-column> -->
            <!-- <el-table-column align="center" prop="create_time" label="三级代理商抽成"></el-table-column>-->
          </el-table>
        </template>
        <div class="block">
          <el-pagination
            :current-page="coupon.page"
            :page-sizes="[10, 20, 30, 40,50]"
            :page-size="coupon.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="coupon.total"
            @size-change="handleCouponSizeChange"
            @current-change="handleCouponCurrentChange"
          />
        </div>
      </div>
    </el-card>

    <!-- 商品列表  (如果在添加活动(没有活动id)就不显示,  以及查看状态且没有任何数据也不显示) -->
    <el-card v-show="!!id && !(type === 1 && product.list.length === 0)" class="box-card">
      <div slot="header" class="clearfix">
        <div style="font-size:20px; display: inline-block">
          活动商品
          <span v-show="agent_id_self === '1'" class="laber">(添加平台商品至活动，请先在代理区域添加平台商品至分销中心。)</span>
        </div>

        <!-- 只有在编辑模式下才会显示操作按钮 -->
        <div v-show="type === 2 && id" style="float: right;">
          <el-button
            size="medium"
            @click="product_mask.show = true; product_mask.agent_id = agent_id; getProductMaskList();"
            type="success"
          >添加</el-button>
          <el-button size="medium" @click="deleteProduct" type="warning">删除</el-button>
          <el-button size="medium" @click="emptyProduct" type="info">清空列表</el-button>
        </div>
      </div>
      <div>
        <template>
          <el-table
            v-loading="product.loading"
            :data="product.list"
            border
            stripe
            max-height="520"
            fit
            @selection-change="val => { this.product.multipleSelection = val; }"
          >
            <el-table-column fixed align="center" type="selection" width="55"></el-table-column>

            <!-- <el-table-column fixed align="center" prop="service_id" label="售后ID" /> -->
            <el-table-column fixed align="center" prop="product_id" width="60" label="商品id" />
            <el-table-column fixed align="center" prop="product_name" min-width="200" label="商品名称" />

            <el-table-column align="center" prop="product_price" label="商品价格" />
            <el-table-column align="center" prop="product_type" label="商品属性" />
            <el-table-column align="center" prop="product_stock" label="商品库存" />
            <el-table-column align="center" prop="agent_name" label="所属代理商" />
            <el-table-column align="center" label="排序">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-arrow-up"
                  circle
                  @click="handleChangeIndex(1 ,2, scope.row.id)"
                ></el-button>
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-arrow-down"
                  circle
                  @click="handleChangeIndex(2 ,2, scope.row.id)"
                ></el-button>
              </template>
            </el-table-column>
            <!-- <el-table-column align="center" prop="create_time" label="二级代理商抽成"></el-table-column> -->
            <!-- <el-table-column align="center" prop="create_time" label="三级代理商抽成"></el-table-column>-->
          </el-table>
        </template>
        <div class="block">
          <el-pagination
            :current-page="product.page"
            :page-sizes="[10, 20, 30, 40,50]"
            :page-size="product.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="product.total"
            @size-change="handleProductSizeChange"
            @current-change="handleProductCurrentChange"
          />
        </div>
      </div>
    </el-card>

    <!-- 添加优惠券 -->
    <el-dialog
      center
      title="添加优惠券"
      :visible.sync="coupon_mask.show"
      top="50px"
      class="mask"
      :close-on-click-modal="false"
      :before-close="closeCouponMask"
    >
      <div
        style="display:flex;   justify-content:flex-end; padding-bottom: 10px; margin-bottom: 20px; border-bottom: 1px solid #f5f5f5"
      >
        <el-button @click="addCoupon" type="success">添加</el-button>
        <el-button @click="closeCouponMask" type="info">关闭</el-button>
      </div>
      <el-form :inline="true" @submit.native.prevent>
        <el-form-item label="代理商">
          <el-select @change="changeAgnet(1)" v-model="coupon_mask.agent_id" placeholder="请选择">
            <el-option
              v-for="item in coupon_mask.agent_map"
              :key="item.agent_id"
              :label="item.name"
              :value="item.agent_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优惠券类型">
          <el-select v-model="coupon_mask.coupon_type" placeholder="请选择">
            <el-option
              v-for="(item, index) in coupon_mask.coupon_type_map"
              :key="index"
              :label="item"
              :value="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input style="width: 300px" v-model="coupon_mask.keyword" placeholder="批次码/优惠券名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="coupon_mask.page=1; getCouponMaskList() ">查询</el-button>
          <el-button type="warning" @click="resetCouponMask">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 优惠券列表增添 -->
      <el-table
        v-loading="coupon_mask.loading"
        :data="coupon_mask.list"
        max-height="600"
        border
        fit
        @selection-change="val => { this.coupon_mask.multipleSelection = val; }"
      >
        <!-- <el-table-column fixed type="selection" width="55"></el-table-column> -->
        <el-table-column fixed type="selection" align="center" width="55" />

        <el-table-column align="center" prop="coupon_batch_number" label="批次码" />
        <el-table-column align="center" prop="coupon_type" label="优惠券类型" />
        <el-table-column align="center" min-width="200px" fixed prop="coupon_name" label="优惠券名称" />
        <el-table-column align="center" prop="coupon_where" label="优惠条件" />
        <el-table-column sortable align="center" prop="coupon_money" label="折扣金额" />
        <el-table-column align="center" prop="coupon_discount_type" label="折扣类型" />
        <el-table-column align="center" prop="status" label="状态" />
      </el-table>

      <div class="block" style="margin: 20px 0;">
        <el-pagination
          :current-page="coupon_mask.page"
          :page-sizes="[10, 20, 30, 40,50]"
          :page-size="coupon_mask.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="coupon_mask.total"
          @size-change="val => { coupon_mask.limit = val; coupon_mask.page = 1; getCouponMaskList()  }"
          @current-change="val => { coupon_mask.page = val; getCouponMaskList();}"
        />
      </div>
    </el-dialog>

    <!-- 添加商品 -->
    <el-dialog
      center
      title="添加商品"
      :visible.sync="product_mask.show"
      top="50px"
      class="mask"
      :close-on-click-modal="false"
      :before-close="closeProductMask"
    >
      <div
        style="display:flex;   justify-content:flex-end; padding-bottom: 10px; margin-bottom: 20px; border-bottom: 1px solid #f5f5f5"
      >
        <el-button size="medium" @click="addProduct" type="success">添加</el-button>
        <el-button size="medium" @click="closeProductMask" type="info">关闭</el-button>
      </div>
      <el-form :inline="true" @submit.native.prevent>
        <el-form-item label="代理商">
          <el-select @change="changeAgnet(2)" v-model="product_mask.agent_id" placeholder="请选择">
            <el-option
              v-for="item in product_mask.agent_map"
              :key="item.agent_id"
              :label="item.name"
              :value="item.agent_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品属性">
          <el-select v-model="product_mask.product_type" placeholder="请选择">
            <el-option
              v-for="(item, index) in product_mask.product_type_map"
              :key="index"
              :label="item"
              :value="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select v-model="product_mask.product_cate" placeholder="请选择">
            <el-option
              v-for="item in product_mask.product_cate_map"
              :key="item.product_category_id"
              :label="item.cate_name"
              :value="item.product_category_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input style="width: 300px" v-model="product_mask.keyword" placeholder="商品id/名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="product_mask.page=1; getProductMaskList()">查询</el-button>
          <el-button type="warning" @click="resetProductMask">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 商品列表增添 -->
      <el-table
        v-loading="product_mask.loading"
        :data="product_mask.dataList"
        max-height="500"
        border
        fit
        @selection-change="val => { this.product_mask.multipleSelection = val; }"
      >
        <!-- <el-table-column fixed type="selection" width="55"></el-table-column> -->
        <el-table-column fixed type="selection" align="center" width="55" />

        <el-table-column align="center" prop="product_id" label="商品id" />
        <el-table-column align="center" min-width="200px" prop="product_name" label="商品名称" />
        <el-table-column align="center" prop="product_price" label="商品价格" />
        <el-table-column align="center" prop="product_stock" label="商品库存" />
        <el-table-column align="center" prop="is_show" label="是否上下架" />
        <el-table-column align="center" prop="product_type" label="商品属性" />
      </el-table>

      <div class="block" style="margin: 20px 0;">
        <el-pagination
          :current-page="product_mask.page"
          :page-sizes="[10, 20, 30, 40,50]"
          :page-size="product_mask.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="product_mask.total"
          @size-change="val => { product_mask.limit = val; product_mask.page = 1; getProductMaskList()  }"
          @current-change="val => { product_mask.page = val; getProductMaskList();}"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAddActivity, // 获取活动详情
  CommitAddActivity, // 添加活动提交
  commitEditActivity, // 修改活动(提交)
  getEditActivity, // 修改活动(查看)
  searchCoupon, // 查询优惠券(弹窗接口)
  addCoupon, // 添加小程序
  getCouponList, // 优惠券列表
  deleteCoupon, // 删除优惠券
  clearAllCoupon, // 清空优惠券
  searchProduct, // 查询商品弹窗中的商品列表
  deleteProduct, // 删除商品
  getProductList, // 商品列表
  addProduct, // 添加商品
  clearAllProduct, // 清空商品
  couponSort, //优惠券排序
  productSort //商品排序
} from "@/api/run_activity";
import { exporteurl } from "@/utils/user";
import { upimg } from "@/api/user";
import Upimg from "@/components/Upimg";
import { pickerOptions, parseTime } from "@/utils/index";
export default {
  components: { Upimg },
  data() {
    return {
      exporteurl: exporteurl + upimg, // 图片上传公共地址
      headers: {
        // 图片上传携带的头
        token: localStorage.getItem("Token"),
        enctype: "multipart/form-data"
      },
      id: "", // 活动Id
      agent_id_self: "", // 当前用户身份
      type: 1, // 当前页面状态:  1: 查看,  2: 修改.
      name: "", // 活动名称
      timeOut: [], // 活动时间
      bg_color: "", // 活动页背景色
      rule: "", // 活动规则
      layout: 1, // 布局:  1: 双排,  2: 单排
      agent_map: [], // 代理商列表
      agent_id: "", // 代理商id
      top_img: "", // 顶图cdn路径
      top_img_url: "", // 顶图全路径
      share_type: "", // 分享类型 1: 固定分享  2: 自定义分享
      share_img: "", // 分享图片cdn路径
      share_img_url: "", // 分享图片全路径
      share_title: "", // 分享内容

      coupon: {
        // 优惠券
        list: [], // 优惠券列表
        loading: false, // loading状态
        limit: parseInt(localStorage.getItem("limit")) || 10,
        page: 1, // 页码
        multipleSelection: [], // 选中文本
        total: 0 // 总数
      },
      product: {
        // 商品
        list: [], // 商品列表
        loading: false, // loading状态
        limit: parseInt(localStorage.getItem("limit")) || 10,
        page: 1, // 页码
        multipleSelection: [], // 选中文本
        total: 0 // 总数
      },

      // 添加优惠券弹窗
      coupon_mask: {
        show: false,
        list: [],
        loading: false, // loading状态
        limit: parseInt(localStorage.getItem("limit")) || 10,
        page: 1, // 页码
        multipleSelection: [], // 选中文本
        total: 0, // 总数,
        agent_map: [],
        agent_id: "",
        coupon_type: "",
        coupon_type_map: [],
        keyword: ""
      },

      // 添加商品弹窗
      product_mask: {
        show: false,
        dataList: [],
        loading: false, // loading状态
        limit: parseInt(localStorage.getItem("limit")) || 10,
        page: 1, // 页码
        multipleSelection: [], // 选中文本
        total: 0, // 总数,
        agent_map: [],
        agent_id: "",
        product_type: "", // 商品属性
        product_type_map: [], // 商品属性列表
        product_cate: "", // 分类
        product_cate_map: [], // 分类列表

        keyword: ""
      }
    };
  },
  created() {
    this.type = (this.$route.query.type || 1) * 1;
    this.id = this.$route.query.id;
    this.agent_id_self = JSON.parse(localStorage.getItem("user")).agent_id;
    this.getData();
  },
  methods: {
    /**
     * 切换页面编辑状态
     * @param {String} type 切换的type值  1: 查看,   2: 修改
     */
    changeType(type) {
      if (type === this.type) {
        this.$message.error("type设置出现错误!");
        return;
      }
      this.type = type;
    },

    /**
     * 提交修改配置
     */
    commit() {
      if (this.id) {
        // 修改活动提交
        commitEditActivity({
          id: this.id,
          agent_id: this.agent_id,
          name: this.name,
          rule: this.rule,
          layout: this.layout,
          top_img: this.top_img,
          bg_color: this.bg_color,
          share_type: this.share_type,
          share_title: this.share_title,
          share_img: this.share_img,
          share_img_url: this.share_img_url,
          start_time:
            this.timeOut && this.timeOut[0] ? parseTime(this.timeOut[0]) : "",
          end_time:
            this.timeOut && this.timeOut[1] ? parseTime(this.timeOut[1]) : ""
        }).then(res => {
          if (res.code === 1) {
            this.$message.success("提交成功!");

            this.type = 1;

            this.coupon.page = 1;
            this.product.page = 1;
            this.getProductList();
            this.getCouponList();
          } else {
            this.$message.error("提交失败! error:" + res.msg);
          }
        });
      } else {
        // 提交活动提交
        CommitAddActivity({
          agent_id: this.agent_id,
          name: this.name,
          rule: this.rule,
          layout: this.layout,
          top_img: this.top_img,
          bg_color: this.bg_color,
          share_type: this.share_type,
          share_title: this.share_title,
          share_img: this.share_img,
          share_img_url: this.share_img_url,
          start_time:
            this.timeOut && this.timeOut[0] ? parseTime(this.timeOut[0]) : "",
          end_time:
            this.timeOut && this.timeOut[1] ? parseTime(this.timeOut[1]) : ""
        }).then(res => {
          if (res.code === 1) {
            this.$message.success("提交成功!");
            this.$router.replace("/runActivity");
          } else {
            this.$message.error("提交失败! error:" + res.msg);
          }
        });
      }
    },

    getData() {
      // 如果页面中携带了id, 则为修改活动, 反之为添加活动
      if (this.id) {
        getEditActivity({ id: this.id }).then(res => {
          if (res.code === 1) {
            let data = res.data;
            this.timeOut = [
              data.event_info.start_time * 1000,
              data.event_info.end_time * 1000
            ];
            this.name = data.event_info.name;
            this.top_img = data.event_info.top_img;
            this.top_img_url = data.event_info.top_img_url;

            this.bg_color = data.event_info.bg_color;
            this.layout = data.event_info.layout;
            this.rule = data.event_info.rule;
            this.share_type = data.event_info.share_type;
            this.share_title = data.event_info.share_title;
            this.share_img = data.event_info.share_img;
            this.share_img_url = data.event_info.share_img_url;
            this.agent_id = data.event_info.agent_id + "";
            this.agent_map = data.agent_map;

            // 当主体数据获取完毕时, 则进行获取优惠券数据
            this.getProductList();
            this.getCouponList();
          } else {
            this.$message.error("获取活动详情失败! error:" + res.msg);
          }
        });
      } else {
        getAddActivity().then(res => {
          if (res.code === 1) {
            this.agent_map = res.data.agent_map;
          } else {
            this.$message.error("获取详情失败! error:" + res.msg);
          }
        });
      }
    },

    /**
     * 优惠券 每页limit变化
     * @param {Number} val limit值
     */
    handleCouponSizeChange(val) {
      this.coupon.limit = val;
      this.coupon.page = 1;
      this.getCouponList();
    },

    /**
     * 优惠券 分页切换
     */
    handleCouponCurrentChange(val) {
      this.coupon.page = val;
      this.getCouponList();
    },

    /**
     * 从弹窗中添加优惠至列表
     */
    addCoupon() {
      if (this.coupon_mask.multipleSelection.length === 0) {
        this.$message.warning("请先选中需要添加的优惠券!");
        return;
      }
      addCoupon({
        event_id: this.id,
        coupon_ids: this.coupon_mask.multipleSelection.map(
          item => item.coupon_id
        )
      }).then(res => {
        if (res.code === 1) {
          this.$message.success("添加优惠券成功!");
          this.getCouponList();
          this.closeCouponMask();
        } else {
          this.$message.error("添加优惠券失败! error: " + res.msg);
        }
      });
    },

    /**
     * 删除优惠劵
     */
    deleteCoupon() {
      if (this.coupon.multipleSelection.length === 0) {
        this.$message.warning("请先选中需要删除的优惠券!");
        return;
      }
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          deleteCoupon({
            ids: this.coupon.multipleSelection.map(item => item.id)
          }).then(res => {
            if (res.code === 1) {
              this.$message.success("删除成功!");
              this.getCouponList();
            } else {
              this.$message.error("删除出错! error: " + res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    /**
     * 关闭优惠券弹窗并且初始化数据
     */
    closeCouponMask() {
      this.coupon_mask = {
        show: false,
        dataList: [],
        loading: false, // loading状态
        limit: parseInt(localStorage.getItem("limit")) || 10,
        page: 1, // 页码
        multipleSelection: [], // 选中文本
        total: 0, // 总数,
        agent_map: [],
        agent_id: "",
        coupon_type: "",
        coupon_type_map: [],
        keyword: ""
      };
    },

    /**
     * 获取优惠券列表数据(分页使用)
     */
    getCouponList() {
      this.coupon.loading = true;
      getCouponList({
        event_id: this.id,
        page: this.coupon.page,
        limit: this.coupon.limit
      }).then(res => {
        if (res.code === 1) {
          this.coupon.loading = false;
          this.coupon.list = res.data.list;
          this.coupon.total = res.data.total;
        } else {
          this.$message.error("获取优惠券出错! error: " + res.msg);
        }
      });
    },

    /**
     * 获取优惠券弹窗列表数据
     */
    getCouponMaskList() {
      this.coupon_mask.loading = true;

      searchCoupon({
        event_id: this.id,
        keyword: this.coupon_mask.keyword,
        agent_id: this.coupon_mask.agent_id || this.agent_id,
        coupon_type: this.coupon_mask.coupon_type,
        page: this.coupon_mask.page,
        limit: this.coupon_mask.limit
      }).then(res => {
        if (res.code === 1) {
          this.coupon_mask.coupon_type_map = res.data.coupon_type;
          this.coupon_mask.agent_map = res.data.agent_map;
          this.coupon_mask.list = res.data.list;
          this.coupon_mask.total = res.data.total;
          this.coupon_mask.loading = false;
        } else {
          this.$message.error("获取优惠券数据出错! error: " + res.msg);
        }
      });
    },

    /**
     * 重置优惠券弹窗搜索条件
     */
    resetCouponMask() {
      this.coupon_mask.page = 1; // 页码
      this.coupon_mask.agent_id = this.agent_id;
      this.coupon_mask.coupon_type = "";
      this.coupon_mask.keyword = "";

      this.getCouponMaskList();
    },

    /**
     * 清空优惠券列表
     */
    emptyCoupon() {
      if (this.coupon.list.length === 0) {
        this.$message.warning("当前没有优惠券！");
        return;
      }
      this.$confirm("此操作将直接清空优惠券列表且无法撤回, 是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          clearAllCoupon({
            event_id: this.id
          }).then(res => {
            if (res.code === 1) {
              this.$message.success("清空成功!");
              this.getCouponList();
            } else {
              this.$message.error("清空失败! error: " + res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    /**
     * 修改代理商
     * @param {Number} id 版块id 1: 优惠券   2: 商品
     */
    changeAgnet(id) {
      if (id === 1) {
        // 切换代理商是切换其筛选的下拉
        this.coupon_mask.coupon_type = "";
        searchCoupon({
          event_id: this.id,
          keyword: this.coupon_mask.keyword,
          agent_id: this.coupon_mask.agent_id || this.agent_id,
          coupon_type: this.coupon_mask.coupon_type,
          page: this.coupon_mask.page,
          limit: this.coupon_mask.limit
        }).then(res => {
          if (res.code === 1) {
            this.coupon_mask.coupon_type_map = res.data.coupon_type;
          }
        });
      } else {
        this.product_mask.product_cate = "";
        this.product_mask.product_type = "";
        searchProduct({
          event_id: this.id,
          keyword: this.product_mask.keyword,
          agent_id: this.product_mask.agent_id || this.agent_id,
          product_type: this.product_mask.product_type,
          product_cate: this.product_mask.product_cate,
          page: this.product_mask.page,
          limit: this.product_mask.limit
        }).then(res => {
          if (res.code === 1) {
            this.product_mask.product_cate_map = res.data.product_cate_map;
            this.product_mask.product_type_map = res.data.product_type_map;
          }
        });
      }
    },

    /**
     * 商品列表 每页limit变化
     * @param {Number} val limit值
     */
    handleProductSizeChange(val) {
      this.product.limit = val;
      this.product.page = 1;
      this.getProductList();
    },

    /**
     * 商品列表 分页切换
     */
    handleProductCurrentChange(val) {
      this.product.page = val;
      this.getProductList();
    },

    /**
     * 获取商品列表数据(分页使用)
     */
    getProductList() {
      this.product.loading = true;
      getProductList({
        event_id: this.id,
        page: this.product.page,
        limit: this.product.limit
      }).then(res => {
        if (res.code === 1) {
          this.product.loading = false;
          this.product.list = res.data.list;
          this.product.total = res.data.total;
        } else {
          this.$message.error("获取失败! error: " + res.msg);
        }
      });
    },

    /**
     * 获取添加商品弹窗中的列表数据
     */
    getProductMaskList() {
      this.product_mask.loading = true;
      searchProduct({
        event_id: this.id,
        keyword: this.product_mask.keyword,
        agent_id: this.product_mask.agent_id || this.agent_id,
        product_type: this.product_mask.product_type,
        product_cate: this.product_mask.product_cate,
        page: this.product_mask.page,
        limit: this.product_mask.limit
      }).then(res => {
        if (res.code === 1) {
          this.product_mask.loading = false;
          this.product_mask.dataList = res.data.list;
          this.product_mask.total = res.data.total;
          this.product_mask.product_cate_map = res.data.product_cate_map;
          this.product_mask.agent_map = res.data.agent_map;
          this.product_mask.product_type_map = res.data.product_type_map;
        }
      });
    },

    /**
     * 添加商品列表
     */
    addProduct() {
      if (this.product_mask.multipleSelection.length === 0) {
        this.$message.warning("请先选中需要添加的商品!");
        return;
      }

      addProduct({
        event_id: this.id,
        product_ids: this.product_mask.multipleSelection.map(
          item => item.product_id
        )
      }).then(res => {
        if (res.code === 1) {
          this.$message.success("添加成功");
          this.closeProductMask();
          this.product.page = 1;
          this.getProductList();
        } else {
          this.$message.error("添加失败! error: " + res.msg);
        }
      });
    },

    /**
     * 关闭商品弹窗并且初始化数据
     */
    closeProductMask() {
      this.product_mask = {
        show: false,
        dataList: [],
        loading: false, // loading状态
        limit: parseInt(localStorage.getItem("limit")) || 10,
        page: 1, // 页码
        multipleSelection: [], // 选中文本
        total: 0, // 总数,
        agent_map: [],
        agent_id: "",
        product_type: "", // 商品属性
        product_type_map: [], // 商品属性列表
        product_cate: "", // 分类
        product_cate_map: [], // 分类列表

        keyword: ""
      };
    },

    /**
     * 重置添加商品弹窗的筛选条件
     */
    resetProductMask() {
      // 重置筛选条件, 且回到第一页
      this.product_maskpage = 1; // 页码
      this.product_mask.multipleSelection = []; // 选中文本
      this.product_mask.agent_id = this.agent_id;
      this.product_mask.product_type = ""; // 商品属性
      this.product_mask.product_cate = ""; // 分类
      this.product_mask.keyword = "";

      // 请求商品弹窗列表
      this.getProductMaskList();
    },

    /**
     * 删除商品
     */
    deleteProduct() {
      if (this.product.multipleSelection.length === 0) {
        this.$message.warning("请先选中需要删除的商品!");
        return;
      }
      this.$confirm("确认删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          deleteProduct({
            ids: this.product.multipleSelection.map(item => item.id)
          }).then(res => {
            if (res.code === 1) {
              this.$message.success("删除成功!");
              this.getProductList();
            } else {
              this.$message.error("删除出错! error: " + res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    /**
     * 清空商品列表
     */
    emptyProduct() {
      if (this.product.list.length === 0) {
        this.$message.warning("当前没有商品！");
        return;
      }
      this.$confirm("此操作将直接清空商品列表且无法撤回, 是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          clearAllProduct({
            event_id: this.id
          }).then(res => {
            if (res.code === 1) {
              this.$message.success("清空成功!");
              this.getProductList();
            } else {
              this.$message.error("清空失败! error: " + res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    /**
     * 切换排序控制
     * @param {String} type 互换位置方向 1:上,  2: 下
     * @param {Number} moduleId 需要操作的模块 1:优惠券  2:商品
     * @param {Number} id   互换位置的Id :
     */
    handleChangeIndex(type, moduleId, id) {
      // 当前为查看状态不能进行排序操作
      if (this.type !== 2) {
        this.$message.warning("如需进行操作请先点击页面顶端的修改按钮");
        return;
      }

      // 当前为添加活动且没有活动id
      if (!this.id) {
        this.$message.warning(
          "前端逻辑出现严重错误, // 您可能正在添加活动时(未注册活动id)直接添加优惠券"
        );
        return;
      }

      if (moduleId === 1) {
        couponSort({
          event_id: this.id,
          type: type,
          id: id
        }).then(res => {
          if (res.code === 1) {
            this.$message.success("操作成功");
            this.getCouponList();
          } else {
            this.$message.error("操作失败");
          }
        });
      } else {
        productSort({
          event_id: this.id,
          type: type,
          id: id
        }).then(res => {
          if (res.code === 1) {
            this.$message.success("操作成功");
            this.getProductList();
          } else {
            this.$message.error("操作失败");
          }
        });
      }
    },

    // 图片上传成功
    SuccessimgArray(e) {
      try {
        if (e.index == 1) {
          this.top_img = e.imgArray[0] ? e.imgArray[0].imgPath : "";
          this.top_img_url = e.imgArray[0] ? e.imgArray[0].url : "";
        } else if (e.index == 2) {
          this.share_img = e.imgArray[0] ? e.imgArray[0].imgPath : "";
          this.share_img_url = e.imgArray[0] ? e.imgArray[0].url : "";
        }
      } catch (error) {
        console.log("上传图片出现错误！", error);
      }
    }
  },
  computed: {
    // 添加/修改icon弹窗中的icon背景广告大图
    imgArr() {
      let arr = [];
      if (this.top_img && this.top_img_url) {
        arr.push({
          name: "",
          imgPath: this.top_img,
          url: this.top_img_url
        });
      }

      return arr;
    },
    // 添加/修改icon弹窗中的icon背景广告大图

    shareImg() {
      let arr = [];
      if (this.share_img && this.share_img_url) {
        arr.push({
          name: "",
          imgPath: this.share_img,
          url: this.share_img_url
        });
      }

      return arr;
    }
  }
};
</script>

<style lang="scss" scoped>
.root {
  padding: 40px;
  background-color: #f5f5f5;
  min-height: 90vh;
  .laber {
    font-size: 13px;
    color: #6b5e5e;
    margin-left: 20px;
  }
  .topChange {
    margin-bottom: 40px;
  }
}
.box-card {
  background-color: #fff;
  margin-bottom: 40px;
}
.show-color {
  display: inline-block;
  width: 100px;
  height: 50px;
  color: #fff;
  font-size: 14px;
  text-align: center;
  line-break: 50px;
  vertical-align: middle;
  line-height: 50px;
  margin-left: 15px;
  margin-top: -5px;
  cursor: pointer;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.block {
  margin-top: 20px;
}
.radio-item {
  margin: 20px 0;
  font-size: 14px;
  &:first-child {
    margin-top: 0px;
  }
  .add-icon-productList {
    padding-left: 20px;
    width: 700px;
    > div {
      margin: 20px 0;
    }
  }
}
</style>