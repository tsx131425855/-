<template>
  <div class="root">
    <!-- 第一模块 -->
    <div class="module">
      <div class="titile">
        <div>
          <span>权益一：&nbsp;&nbsp;&nbsp;&nbsp;权益名称：</span>
          <div>
            <el-input :disabled="!edit.show1" v-model="module1.name"></el-input>
          </div>
          <span class="title-laber"></span>
        </div>
        <el-button
          class="open_btn"
          @click="edit.show1 = true"
          v-show="!edit.show1"
          type="warning"
          icon="el-icon-edit"
        >修改</el-button>
        <el-button
          v-show="edit.show1"
          @click="commit(1)"
          width="300"
          type="success"
          icon="el-icon-check"
        >保存</el-button>
      </div>
      <div class="main one">
        <div>图片：</div>
        <Upimg
          :exporteurl="exporteurl"
          :fileList="imgObeject1"
          fileName="image"
          :showList="true"
          :fileHeaders="headers"
          :disabled="!edit.show1"
          :maxlimit="1"
          :index="1"
          @Successimg="SuccessimgArray"
        ></Upimg>
        <div>
          <el-button
            :disabled="!edit.show1"
            @click="openMask(1)"
            icon="el-icon-plus"
            type="success"
          >新增</el-button>
          <el-button
            :disabled="!edit.show1"
            @click="clearList(1)"
            icon="el-icon-close"
            type="warning"
          >删除</el-button>
        </div>
        <el-table
          v-loading="loading"
          :data="module1.p_info"
          border
          @selection-change="val => { this.module1.multipleSelection = val; }"
          style="width: 100%"
          fit
        >
          <el-table-column fixed type="selection" width="55"></el-table-column>

          <el-table-column fixed align="center" prop="product_id" label="商品Id" />
          <el-table-column align="center" prop="product_name" label="商品名称" />
          <el-table-column align="center" prop="product_price" label="价值（销售价）" />
          <el-table-column align="center" prop="product_stock" label="库存" />
        </el-table>
      </div>
    </div>

    <!-- 第二模块 -->
    <div class="module">
      <div class="titile">
        <div>
          <span>权益二：&nbsp;&nbsp;&nbsp;&nbsp;权益名称：</span>
          <div>
            <el-input placeholder="权益名称" :disabled="!edit.show2" v-model="module2.name"></el-input>
          </div>

          <span class="title-laber">（备注： 已过期优惠券不显示在次列表）</span>
        </div>
        <el-button
          v-show="!edit.show2"
          @click="edit.show2 = true"
          width="300"
          type="warning"
          icon="el-icon-edit"
        >修改</el-button>
        <el-button
          v-show="edit.show2"
          @click="commit(2)"
          width="300"
          type="success"
          icon="el-icon-check"
        >保存</el-button>
      </div>
      <div class="main two">
        <div class="ticket">
          <div>优惠券</div>
          <div class="ticket-list">
            <div v-for="(item, index) in module2.coupon" :key="item.id" class="ticket-item">
              <div class="close">
                <el-button
                  :disabled="!edit.show2"
                  type="danger"
                  icon="el-icon-close "
                  size="mini"
                  circle
                  @click="deteleCoupon(index)"
                ></el-button>
              </div>
              <div class="show_text">{{ item.coupon_name }}</div>
              <div class="show_text">{{ item.coupon_sub_name }}</div>
            </div>
            <div @click="openAddGroup(!edit.show2)" class="ticket-item add-item">
              <i class="el-icon-plus add"></i>
            </div>
          </div>
        </div>
        <!-- <div class="ticket">
          <div>商家红包</div>
          <div class="ticket-list">
            <div v-for="item in module2.red_packet" :key="item.id" class="ticket-item">
              <div class="close">
                <el-button
                  :disabled="!edit.show2"
                  type="danger"
                  icon="el-icon-close "
                  size="mini"
                  circle
                ></el-button>
              </div>
              <div>{{ item.name }}</div>
              <div>{{ item.sub_name }}</div>
            </div>
            <div class="ticket-item add-item">
              <i class="el-icon-plus add"></i>
            </div>
          </div>
        </div>-->
      </div>
    </div>

    <!-- 第三模块 -->
    <div class="module">
      <div class="titile">
        <div>
          <span>权益三：&nbsp;&nbsp;&nbsp;&nbsp;权益名称：</span>
          <div>
            <el-input :disabled="!edit.show3" v-model="module3.name" placeholder="必须输入权益名称"></el-input>
          </div>
          <span class="title-laber">（备注：商品设置为不显示的情况，如被添加为免费试用商品，则在免费试用区为显示状态）</span>
        </div>
        <el-button
          v-show="!edit.show3"
          @click="edit.show3 = true"
          width="300"
          type="warning"
          icon="el-icon-edit"
        >修改</el-button>
        <el-button
          v-show="edit.show3"
          @click="commit(3)"
          width="300"
          type="success"
          icon="el-icon-check"
        >保存</el-button>
      </div>
      <div class="main three">
        <div>
          <el-button
            :disabled="!edit.show3"
            @click="openMask(3)"
            icon="el-icon-plus"
            type="success"
          >新增</el-button>
          <el-button
            :disabled="!edit.show3"
            @click="clearList(3)"
            icon="el-icon-close"
            type="warning"
          >删除</el-button>
        </div>
        <el-table
          v-loading="loading"
          :data="module3.free_product_list"
          border
          style="width: 100%"
          fit
          @selection-change="val => { this.module3.multipleSelection = val; }"
        >
          <el-table-column fixed align="center" type="selection" width="55"></el-table-column>

          <el-table-column fixed align="center" prop="product_id" label="商品Id" />
          <el-table-column align="center" prop="product_name" label="商品名称" />
          <el-table-column align="center" prop="product_price" label="价值（销售价）" />
          <el-table-column align="center" prop="product_stock" label="试用数（库存）" />
          <el-table-column align="center" width="360" label="起止时间">
            <template slot-scope="scope">
              <div>{{ scope.row.product_start_time + ' 至 ' + scope.row.product_end_time }}</div>
            </template>
          </el-table-column>
          <el-table-column width="190" align="center" label="排序">
            <template slot-scope="scope">
              <el-button
                :disabled="!edit.show3"
                size="mini"
                type="primary"
                icon="el-icon-arrow-up"
                circle
                @click="indexChange1('up' ,scope.$index)"
              ></el-button>
              <el-button
                :disabled="!edit.show3"
                size="mini"
                type="primary"
                icon="el-icon-arrow-down"
                circle
                @click="indexChange1('down' ,scope.$index)"
              ></el-button>
              <el-button
                :disabled="!edit.show3"
                size="mini"
                type="success"
                @click="handleGoTop(module3.free_product_list,scope.$index, 1)"
              >置顶</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <div class="block">
          <el-pagination
            :current-page="module3.page"
            :page-sizes="[10, 20, 30, 40,50]"
            :page-size="module3.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="module3.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>-->
        <div class="rule rule-title">
          <div class="laber">规则标题：</div>

          <div>
            <el-input :disabled="!edit.show3" v-model="module3.title" type="text" />
          </div>
        </div>
        <div class="rule rule-main">
          <div class="laber">规则内容：</div>

          <el-input
            :disabled="!edit.show3"
            v-model="module3.content"
            style="width: 500px;"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
          ></el-input>
        </div>
      </div>
    </div>

    <!-- 第四模块 -->
    <div class="module">
      <div class="titile">
        <div>
          <span>权益四：&nbsp;&nbsp;&nbsp;&nbsp;权益名称：</span>
          <div>
            <el-input :disabled="!edit.show4" v-model="module4.name" placeholder="新品试用"></el-input>
          </div>
          <span class="title-laber"></span>
        </div>
        <el-button
          v-show="!edit.show4"
          @click="edit.show4 = true"
          width="300"
          type="warning"
          icon="el-icon-edit"
        >修改</el-button>
        <el-button
          v-show="edit.show4"
          @click="commit(4)"
          width="300"
          type="success"
          icon="el-icon-check"
        >保存</el-button>
      </div>
      <div class="main four">
        <el-form :inline="true">
          <!-- <el-form-item label-width="80px" label="状态:">
        <el-select v-model="status" placeholder="请选择">
          <el-option label="全部" value="-1"></el-option>
          <el-option :label="item" v-for="(item, index) in status_map" :key="index" :value="index"></el-option>
        </el-select>
          </el-form-item>-->
          <el-form-item label-width="50px" label="每周">
            <el-select :disabled="!edit.show4" v-model="module4.week" placeholder="请选择">
              <el-option
                :label="item"
                v-for="(item, index) in ['一','二','三','四','五','六','日']"
                :key="index"
                :value="index + 1"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 360px" label-width="100px" label="单笔消费满">
            <el-input :disabled="!edit.show4" v-model="module4.money" placeholder>
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item style="width: 550px" label-width="140px" label="额外赠送(普通会员)">
            <el-input
              :disabled="!edit.show4"
              style="width: 200px"
              v-model="module4.midou"
              placeholder
            >
              <template slot="append">蜜豆</template>
            </el-input>
          </el-form-item>
          <el-form-item style="width: 620px" label-width="140px" label="额外赠送(超级会员)">
            <el-input
              :disabled="!edit.show4"
              style="width: 200px"
              v-model="module4.vip_midou"
              placeholder
            >
              <template slot="append">蜜豆</template>
            </el-input>
            <span>（备注： 每个赶集日单用户仅限参与一次）</span>
          </el-form-item>
          <!-- <el-form-item>
        <el-button type="success" @click="onSubmit">导出</el-button>
          </el-form-item>-->
        </el-form>
        <div>
          <div>
            图片 &nbsp;&nbsp;&nbsp;&nbsp;
            <span class="laber">限一张； 只支持.jpg png格式</span>
          </div>
          <Upimg
            :exporteurl="exporteurl"
            :fileList="imgObeject4"
            fileName="image"
            :showList="true"
            :fileHeaders="headers"
            :disabled="!edit.show4"
            :maxlimit="1"
            :index="4"
            @Successimg="SuccessimgArray"
          ></Upimg>
        </div>
      </div>
    </div>

    <!-- 第五模块 -->
    <div class="module">
      <div class="titile">
        <div>
          <span>权益五：&nbsp;&nbsp;&nbsp;&nbsp;权益名称：</span>
          <div>
            <el-input :disabled="!edit.show5" v-model="module5.name" placeholder="新品试用"></el-input>
          </div>
          <span class="title-laber"></span>
        </div>
        <el-button
          width="300"
          @click="edit.show5 = 5"
          v-show="!edit.show5"
          type="warning"
          icon="el-icon-edit"
        >修改</el-button>
        <el-button
          v-show="edit.show5"
          @click="commit(5)"
          width="300"
          type="success"
          icon="el-icon-check"
        >保存</el-button>
      </div>
      <div class="main four">
        <el-form :inline="true">
          <el-form-item style="width: 550px" label-width="160px" label="普通会员： 消费一元 =">
            <el-input
              :disabled="!edit.show5"
              style="width: 200px"
              v-model="module5.midou1"
              placeholder
            >
              <template slot="append">蜜豆</template>
            </el-input>
            <span>（100蜜豆在商城可抵1元）</span>
          </el-form-item>
          <el-form-item style="width: 650px" label-width="200px" label="超级会员：   消费一元 =">
            <el-input
              :disabled="!edit.show5"
              style="width: 200px"
              v-model="module5.midou2"
              placeholder
            >
              <template slot="append">蜜豆</template>
            </el-input>
            <span>（100蜜豆在商城可抵1元）</span>
          </el-form-item>
          <!-- <el-form-item>
        <el-button type="success" @click="onSubmit">导出</el-button>
          </el-form-item>-->
        </el-form>
        <div>
          <div>
            图片 &nbsp;&nbsp;&nbsp;&nbsp;
            <span class="laber">限一张； 只支持.jpg png格式</span>
          </div>
          <Upimg
            :exporteurl="exporteurl"
            :fileList="imgObeject5"
            fileName="image"
            :showList="true"
            :fileHeaders="headers"
            :disabled="!edit.show5"
            :maxlimit="1"
            :index="5"
            @Successimg="SuccessimgArray"
          ></Upimg>
        </div>
      </div>
    </div>

    <!-- 第六模块 -->
    <div class="module">
      <div class="titile">
        <div>
          <span>权益六：&nbsp;&nbsp;&nbsp;&nbsp;权益名称：</span>
          <div>
            <el-input :disabled="!edit.show6" v-model="module6.name" placeholder="新品试用"></el-input>
          </div>
          <span class="title-laber"></span>
        </div>
        <el-button
          width="300"
          v-show="!edit.show6"
          @click="edit.show6 = true"
          type="warning"
          icon="el-icon-edit"
        >修改</el-button>
        <el-button
          v-show="edit.show6"
          @click="commit(6)"
          width="300"
          type="success"
          icon="el-icon-check"
        >保存</el-button>
      </div>
      <div class="main six">
        <div style="margin-bottom: 20px">
          <el-button
            :disabled="!edit.show6"
            @click="openMask(6)"
            icon="el-icon-plus"
            type="success"
          >新增</el-button>
          <el-button
            :disabled="!edit.show6"
            @click="clearList(6)"
            icon="el-icon-close"
            type="warning"
          >删除</el-button>
        </div>
        <el-table
          v-loading="loading"
          :data="module6.vip_product_list"
          border
          style="width: 100%"
          fit
          @selection-change="val => { this.module6.multipleSelection = val; }"
        >
          <el-table-column fixed align="center" type="selection" width="55"></el-table-column>

          <el-table-column fixed align="center" prop="product_id" label="商品Id" />
          <el-table-column align="center" prop="product_name" label="商品名称" />
          <el-table-column align="center" prop="product_price" label="售价" />
          <el-table-column align="center" prop="product_stock" label="库存" />
          <el-table-column width="190" align="center" label="排序">
            <template slot-scope="scope">
              <el-button
                :disabled="!edit.show6"
                size="mini"
                type="primary"
                icon="el-icon-arrow-up"
                circle
                @click="indexChange2('up' ,scope.$index)"
              ></el-button>
              <el-button
                :disabled="!edit.show6"
                size="mini"
                type="primary"
                icon="el-icon-arrow-down"
                circle
                @click="indexChange2('down' ,scope.$index)"
              ></el-button>
              <el-button
                :disabled="!edit.show6"
                size="mini"
                type="success"
                @click="handleGoTop(module6.vip_product_list,scope.$index, 2)"
              >置顶</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="module">
      <div class="titile">
        <div>蜜豆限额设置</div>
        <el-button
          v-show="!edit.show7"
          @click="edit.show7 = 7"
          width="300"
          type="warning"
          icon="el-icon-edit"
        >修改</el-button>
        <el-button
          v-show="edit.show7"
          @click="commit(7)"
          width="300"
          type="success"
          icon="el-icon-check"
        >保存</el-button>
      </div>
      <div class="main">
        <el-form style="margin-top:20px" @submit.native.prevent>
          <el-form-item label="单笔订单蜜豆使用上限">
            <el-input v-model="module7.order_midou_limit" style="width:300px;"></el-input>
          </el-form-item>
          <el-form-item label="每日蜜豆限额">
            <el-input v-model="module7.day_midou_limit" style="width:300px; "></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- <div class="module">
      <div class="titile">
        <div>虚拟开通数量</div>
        <el-button width="300" type="warning" icon="el-icon-edit">修改</el-button>
      </div>
      <div class="main edit">
        <el-radio-group size="medium" v-model="radio">
          <div class="radio_box">
            <el-radio :label="3">固定销量</el-radio>
            <el-input placeholder="销售量" style="width: 200px" />
            <span class="laber">设置的销量后 前端开通数量 = 固定数量 + 实际开通数量</span>
          </div>
          <div class="radio_box">
            <el-radio :label="6">实时增加</el-radio>
            <span>每&nbsp;&nbsp;</span>
            <el-input style="width: 120px;" />
            <span style="margin-right: 30px">&nbsp;&nbsp;小时</span>
            <span>实时增加&nbsp;&nbsp;</span>
            <el-input style="width: 200px" />
            <span class="laber">实时增加 虚拟开通数量将会按设置好的数值自动增加</span>
          </div>
        </el-radio-group>
      </div>
    </div>-->
    <el-dialog
      center
      title="添加优惠券"
      :visible.sync="addCoupon.show"
      top="50px"
      :before-close="cancelGroup"
      class="mask"
      :close-on-click-modal="false"
    >
      <el-button style="margin-bottom: 20px;" type="success" @click="confirmGroup">确定</el-button>
      <el-button style="margin-bottom: 20px;" type="info" @click="cancelGroup">取消</el-button>
      <el-table
        style="margin-bottom: 20px;"
        v-loading="addCoupon.loading"
        :data="addCoupon.table"
        max-height="600"
        border
        fit
        @selection-change="val => { this.addCoupon.multipleSelection = val; }"
      >
        <!-- <el-table-column fixed type="selection" width="55"></el-table-column> -->
        <el-table-column fixed type="selection" align="center" width="55" />

        <el-table-column align="center" prop="coupon_batch_number" label="批次码" />
        <el-table-column align="center" prop="coupon_id" label="优惠券ID" />
        <el-table-column align="center" prop="coupon_discount_type" min-width="110" label="折扣类型" />
        <el-table-column align="center" prop="coupon_where" label="优惠条件" />
        <el-table-column align="center" prop="coupon_name" label="优惠券名称" />
        <el-table-column align="center" prop="coupon_money" label="抵扣金额" />
        <el-table-column align="center" prop="coupon_status" label="状态" />
        <el-table-column align="center" prop="coupon_type" label="优惠券类型" />
        <el-table-column width="160" align="center" prop="send_start_time" label="开始时间" />
        <el-table-column width="160" align="center" prop="send_end_time" label="结束时间" />
      </el-table>
      <div class="block">
        <el-pagination
          :current-page="addCoupon.page"
          :page-sizes="[10, 20, 30, 40,50]"
          :page-size="addCoupon.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="addCoupon.total"
          @size-change=" val => { addCoupon.limit = val; addCoupon.page = 1; getGroup() } "
          @current-change="val => { addCoupon.page = val; getGroup();}"
        />
      </div>
    </el-dialog>

    <el-dialog
      center
      title="添加商品"
      :visible.sync="mask.show"
      top="50px"
      :before-close="cancelMask"
      class="mask"
      :close-on-click-modal="false"
    >
      <el-form :inline="true" label-width="100px">
        <el-form-item>
          <el-input style="width: 300px" v-model="mask.keyword" placeholder="商品ID/商品分类/商品名/代理商"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="mask.page=1; getTable()">查询</el-button>
          <el-button type="success" @click="confirmMask">确定</el-button>
          <el-button type="info" @click="cancelMask">取消</el-button>
        </el-form-item>
      </el-form>

      <!-- 商品列表增添 -->
      <el-table
        v-loading="mask.loading"
        :data="mask.table"
        max-height="600"
        border
        fit
        @selection-change="val => { this.mask.multipleSelection = val; }"
      >
        <!-- <el-table-column fixed type="selection" width="55"></el-table-column> -->
        <el-table-column fixed type="selection" align="center" width="55" />

        <el-table-column align="center" prop="product_id" label="商品ID" />
        <el-table-column align="center" prop="product_name" min-width="110" label="商品标题" />
        <el-table-column align="center" prop="cate_name" label="商品分类" />
        <el-table-column align="center" prop="product_price" label="商品价格" />
        <el-table-column align="center" width="160" prop="add_time" label="创建时间" />
        <el-table-column align="center" prop="product_stock" label="库存" />
        <el-table-column align="center" prop="is_recommend" label="是否推荐	" />
        <el-table-column align="center" prop="is_show" label="状态" />
        <el-table-column align="center" prop="name" label="代理商" />

        <!-- <el-table-column align="center" prop="create_time" label="一级代理商抽成"></el-table-column> -->
        <!-- <el-table-column align="center" prop="create_time" label="二级代理商抽成"></el-table-column> -->
        <!-- <el-table-column align="center" prop="create_time" label="三级代理商抽成"></el-table-column>-->
      </el-table>

      <div class="block">
        <el-pagination
          :current-page="mask.page"
          :page-sizes="[10, 20, 30, 40,50]"
          :page-size="mask.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="mask.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { exporteurl, arrRoofPlacement } from "@/utils/user";
import { upimg } from "@/api/user";
import {
  getSetBenefit,
  getProductList,
  saveSet,
  getGroup
} from "@/api/membersBoon";
import Upimg from "@/components/Upimg";
export default {
  data() {
    return {
      exporteurl: exporteurl + upimg, // 图片上传公共地址
      headers: {
        // 图片上传携带的头
        token: localStorage.getItem("Token"),
        enctype: "multipart/form-data"
      },
      loading: "", // 表格的loading状态

      // 当前各模块的编辑状态
      edit: {
        show1: false, // 模块1
        show2: false, // 模块2
        show3: false, // 模块3
        show4: false, // 模块4
        show5: false, // 模块5
        show6: false, // 模块6
        show7: false // 模块6
      },
      module1: {
        // 权益一
        name: "", // 权益名称
        image: "", // 权益图
        images_url: "", // 缩略图
        open: false, // 当前编辑状态
        p_info: [] // 商家红包
      },
      module2: {
        // 权益二
        name: "", // 权益名称
        coupon: [], // 优惠券列表
        open: false, // 当前编辑状态
        red_packet: [] // 商家红包
      },
      module3: {
        // 权益三
        name: "", // 权益名称
        open: false, // 当前编辑状态
        free_product_list: [],
        title: "", // 规则标题
        content: "", // 规则内容
        limit: parseInt(localStorage.getItem("limit")) || 10,
        total: 0,
        page: 1
      },
      module4: {
        // 权益四
        name: "", // 权益名称
        open: false, // 当前编辑状态
        image: "", // 图片
        images_url: "", // 缩略图
        week: "", // 每周几
        money: "", // 单笔消费
        midou: "", // 单笔赠送  (普通会员)
        vip_midou: "" // 单笔赠送 (超级会员)
      },
      module5: {
        // 权益五
        name: "", // 权益名称
        open: false, // 当前编辑状态
        image: "", // 图片
        images_url: "" // 缩略图
      },
      module6: {
        // 权益六
        name: "", // 权益名称
        open: false, // 当前编辑状态
        vip_product_list: [] // 缩略图
      },

      module7: {
        // 权益六
        order_midou_limit: "", // 订单蜜豆上限
        day_midou_limit: "" // 每日蜜豆上限
      },
      // 添加商品弹窗
      mask: {
        num: "",
        show: false, // 是否显示
        table: [], // 弹窗中的表格数据
        keyword: "", // 搜索关键字
        multipleSelection: [], // 选中文本
        total: 0, // 总数
        page: 1, // 页码
        product_id: [], // 已有的商品列表
        limit: parseInt(localStorage.getItem("limit")) || 10,
        loading: false // 是否显示loading
      },

      // 添加优惠券的弹窗
      addCoupon: {
        show: false, // 是否显示
        table: [], // 优惠券列表数据
        multipleSelection: [], // 选中文本
        limit: parseInt(localStorage.getItem("limit")) || 10,
        loading: false, // 是否显示loading
        total: 0, // 总数
        page: 1 // 页码
      }
    };
  },
  components: { Upimg },
  created() {
    this.getData();
  },
  methods: {
    deteleCoupon(index) {
      // 删除优惠券
      this.module2.coupon.splice(index, 1);
    },
    // 模块三的排序互换
    indexChange1(type = "up", index) {
      let arr = [...this.module3.free_product_list];
      if (type === "up") {
        // 当选中和上一位互换位置时
        if (index != 0) {
          // 利用es6的解构语法为
          [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
        } else {
          this.$message.warning("已经是第一了，没法再向上了");
        }
      } else {
        // 当选中和下一位互换位置时
        if (index != arr.length - 1) {
          [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
        } else {
          this.$message.warning("已经是最后了， 没法再向下了");
        }
      }
      this.module3.free_product_list = arr;
    },

    // 模块五的排序互换
    indexChange2(type = "up", index) {
      let arr = [...this.module6.vip_product_list];
      if (type === "up") {
        // 当选中和上一位互换位置时
        if (index != 0) {
          // 利用es6的解构语法为
          [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
        } else {
          this.$message.warning("已经是第一了，没法再向上了");
        }
      } else {
        // 当选中和下一位互换位置时
        if (index != arr.length - 1) {
          [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
        } else {
          this.$message.warning("已经是最后了， 没法再向下了");
        }
      }
      this.module6.vip_product_list = arr;
    },

    /**
     * 一键置顶
     */
    handleGoTop(modal, index, id) {
      switch (id) {
        case 1:
          this.module3.free_product_list = arrRoofPlacement(modal, index);
          break;
        case 2:
          this.module6.vip_product_list = arrRoofPlacement(modal, index);
          break;
      }
    },
    // 提交
    commit(num) {
      switch (num) {
        case 1:
          this.commitModule1(num);
          break;
        case 2:
          this.commitModule2(num);
          break;
        case 3:
          this.commitModule3(num);
          break;
        case 4:
          this.commitModule4(num);
          break;
        case 5:
          this.commitModule5(num);
          break;
        case 6:
          this.commitModule6(num);
          break;
        case 7:
          this.commitModule7(num);
          break;
      }
    },

    // 模块一的提交
    commitModule1(num) {
      saveSet({
        index: num,
        image: this.module1.image,
        product_id: this.module1.p_info[0]
          ? this.module1.p_info[0].product_id
          : "",
        images_url: this.module1.images_url,
        name: this.module1.name
      }).then(res => {
        if (res.code == 1) {
          this.$message.success(res.msg);
          this.edit.show1 = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 模块二的提交
    commitModule2(num) {
      saveSet({
        index: num,
        coupon_id: this.module2.coupon.map(item => item.coupon_id),
        images_url: this.module2.red_packet.map(item => item.red_packet_id),
        name: this.module2.name
      }).then(res => {
        if (res.code == 1) {
          this.$message.success(res.msg);
          this.edit.show2 = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 模块三的提交
    commitModule3(num) {
      saveSet({
        index: num,
        product_id: this.module3.free_product_list.map(item => item.product_id),
        title: this.module3.title,
        content: this.module3.content,
        name: this.module3.name
      }).then(res => {
        if (res.code == 1) {
          this.$message.success(res.msg);
          this.edit.show3 = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 模块四的提交
    commitModule4(num) {
      let data = Object.assign({ index: num }, this.module4);
      saveSet(data).then(res => {
        if (res.code == 1) {
          this.$message.success(res.msg);
          this.edit.show4 = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 模块五的提交
    commitModule5(num) {
      let data = Object.assign({ index: num }, this.module5);
      saveSet(data).then(res => {
        if (res.code == 1) {
          this.$message.success(res.msg);
          this.edit.show5 = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 模块六的提交
    commitModule6(num) {
      saveSet({
        index: num,
        product_id: this.module6.vip_product_list.map(item => item.product_id),
        name: this.module6.name
      }).then(res => {
        if (res.code == 1) {
          this.$message.success(res.msg);
          this.edit.show6 = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 模块七的提交
    commitModule7(num) {
      saveSet({
        index: num,
        name: "midou",
        order_midou_limit: this.module7.order_midou_limit,
        day_midou_limit: this.module7.day_midou_limit
      }).then(res => {
        if (res.code == 1) {
          this.$message.success(res.msg);
          this.edit.show7 = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 获取页面数据
    getData() {
      getSetBenefit()
        .then(res => {
          if (res.code == 1) {
            this.module1 = res.data.info[1];
            this.module2 = res.data.info[2];
            this.module3 = res.data.info[3];
            this.module4 = res.data.info[4];
            this.module5 = res.data.info[5];
            this.module6 = res.data.info[6];
            this.module7 = res.data.info[7];
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(res => {
          console.log("error", res);
        });
    },
    clearList(num) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        if (num == 1) {
          this.module1.p_info = this.module1.p_info.filter(
            item =>
              !this.module1.multipleSelection.some(
                i => i.product_id === item.product_id
              )
          );
        } else if (num == 3) {
          this.module3.free_product_list = this.module3.free_product_list.filter(
            item =>
              !this.module3.multipleSelection.some(
                i => i.product_id === item.product_id
              )
          );
        } else {
          this.module6.vip_product_list = this.module6.vip_product_list.filter(
            item =>
              !this.module6.multipleSelection.some(
                i => i.product_id === item.product_id
              )
          );
        }
      });
    },

    // 打开添加优惠券弹窗
    openAddGroup(bool) {
      if (bool) {
        this.$message.warning("请先打开编辑状态");
        return;
      }
      this.addCoupon.show = true;
      this.getGroup();
    },

    // 获取需要添加的优惠券列表
    getGroup() {
      this.addCoupon.loading = true;
      getGroup({
        page: this.addCoupon.page,
        limit: this.addCoupon.limit,
        agent_id: 1
      }).then(res => {
        if (res.code == 1) {
          this.addCoupon.loading = false;
          this.addCoupon.table = res.data.list;
          this.addCoupon.total = res.data.count;
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 取消添加优惠劵
    cancelGroup() {
      this.$confirm("是否放弃添加?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.addCoupon = {
          show: false, // 是否显示
          table: [], // 优惠券列表数据
          multipleSelection: [], // 选中文本
          limit: parseInt(localStorage.getItem("limit")) || 10,
          loading: false, // 是否显示loading
          total: 0, // 总数
          page: 1 // 页码
        };
      });
    },

    // 确认添加优惠劵
    confirmGroup() {
      this.module2.coupon = this.module2.coupon.concat(
        this.addCoupon.multipleSelection
      );
      this.addCoupon = {
        show: false, // 是否显示
        table: [], // 优惠券列表数据
        multipleSelection: [], // 选中文本
        limit: parseInt(localStorage.getItem("limit")) || 10,
        loading: false, // 是否显示loading
        total: 0, // 总数
        page: 1 // 页码
      };
    },

    //
    handleSizeChange(val) {
      this.mask.limit = val;
      console.log(`每页 ${val} 条`);
      this.mask.page = 1;
      this.getTable();
    },

    // 页码改版
    handleCurrentChange(val) {
      // 页数
      this.mask.page = val;
      console.log(`当前页: ${val}`);
      this.getTable();
    },

    // 打开弹窗
    openMask(num) {
      if (num == 1) {
        if (this.module1.p_info.length != 0) {
          this.$message.warning("此处只允许添加一件商品");
          return;
        }
        this.mask.product_id = this.module1.p_info.map(item => item.product_id);
      } else if (num === 3) {
        this.mask.product_id = this.module3.free_product_list.map(
          item => item.product_id
        );
      } else if (num === 6) {
        this.mask.product_id = this.module6.vip_product_list.map(
          item => item.product_id
        );
      }
      this.mask.show = true;
      this.mask.num = num;
      this.getTable();
    },

    // 确认提交
    confirmMask() {
      // 确认提交

      if (this.mask.num == 1) {
        let arr;
        arr = this.module1.p_info.concat(this.mask.multipleSelection);
        if (arr.length > 1) {
          this.$message.warning("此权益只能选择一个商品");
          return;
        }
        this.module1.p_info = arr;
      } else if (this.mask.num == 3) {
        this.module3.free_product_list = this.module3.free_product_list.concat(
          this.mask.multipleSelection
        );
      } else if (this.mask.num == 6) {
        this.module6.vip_product_list = this.module6.vip_product_list.concat(
          this.mask.multipleSelection
        );
      }

      this.mask = {
        show: false, // 是否显示
        table: [], // 弹窗中的表格数据
        keyword: "", // 搜索关键字
        num: "",
        multipleSelection: [], // 选中文本
        product_id: [],
        total: 0, // 总数
        page: 1, // 页码
        loading: false // 是否显示loading
      };
    },

    // 关闭弹窗
    cancelMask() {
      this.$confirm("是否放弃添加?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.mask = {
          show: false, // 是否显示
          num: "",
          table: [], // 弹窗中的表格数据
          keyword: "", // 搜索关键字
          multipleSelection: [], // 选中文本
          product_id: [],
          total: 0, // 总数
          page: 1, // 页码
          loading: false // 是否显示loading
        };
      });
    },

    getTable() {
      this.mask.loading = true;
      getProductList({
        agent_id: 1,
        keyword: this.mask.keyword,
        page: this.mask.page,
        limit: this.mask.limit,
        product_id: this.mask.product_id
      }).then(res => {
        if (res.code == 1) {
          this.mask.loading = false;
          this.mask.total = res.data.count;
          this.mask.table = res.data.list;
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    SuccessimgArray(e) {
      try {
        // 使用解构语法， 取出第一个image地址
        this["module" + e.index].image = e.imgArray[0] ? e.imgArray[0].url : "";
        this["module" + e.index].images_url = e.imgArray[0]
          ? e.imgArray[0].imgPath
          : "";
      } catch (error) {
        console.log("上传图片出现错误！", error);
      }
    }
  },
  computed: {
    imgObeject1() {
      let arr;
      if (this.module1.images_url && this.module1.image) {
        arr = [
          {
            name: "",
            imgPath: this.module1.images_url,
            url: this.module1.image
          }
        ];
      } else {
        arr = [];
      }
      return arr;
    },
    imgObeject4() {
      let arr;
      if (this.module4.images_url && this.module4.image) {
        arr = [
          {
            name: "",
            imgPath: this.module4.images_url,
            url: this.module4.image
          }
        ];
      } else {
        arr = [];
      }
      return arr;
    },
    imgObeject5() {
      let arr;
      console.log(this.module5);
      if (this.module5.images_url && this.module5.image) {
        arr = [
          {
            name: "",
            imgPath: this.module5.images_url,
            url: this.module5.image
          }
        ];
      } else {
        arr = [];
      }
      return arr;
    }
  }
};
</script>

<style lang="scss" scoped>
.root {
  padding: 40px;
  .module {
    padding: 40px;
    background-color: #f5f5f5;
    border-radius: 30px;
    border: 1px solid rgb(150, 147, 147);
    margin-bottom: 40px;
    position: relative;
    overflow: hidden;
    .titile {
      border-bottom: 2px solid #eee;
      padding: 20px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: bold;
      font-size: 18px;
      el-button {
        position: relative;
        z-index: 30;
      }
      div {
        display: flex;
        align-items: center;
        .title-laber {
          color: rgb(133, 133, 128);
          font-size: 14px;
          margin-right: 20px;
        }
        div {
          width: 300px;
          margin: 0 20px 0 5px;
        }
      }
    }
  }
}
.one {
  > div {
    margin: 15px auto;
  }
}
.two {
  .show_text {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .ticket {
    margin: 20px 0 50px;
    > div {
      margin: 8px auto;
    }
    .ticket-list {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      .ticket-item {
        position: relative;
        width: 120px;
        height: 80px;
        background-color: #fff;
        line-height: 30px;
        padding: 10px;
        box-sizing: border-box;
        border: 1px dashed rgb(206, 200, 200);
        font-size: 14px;
        margin-right: 40px;
        &:hover {
          background-color: #b9b4b4;

          color: #fff;
        }
        .close {
          position: absolute !important;
          right: 0;
          top: 0;
          transform: translate(50%, -50%);
          font-size: 20px;
        }
        .add {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .add-item {
        width: 80px;
        height: 80px;
      }
    }
  }
}
.three {
  > div {
    margin: 20px auto;
  }
  .rule {
    display: flex;
    .laber {
      width: 150px;
      line-height: 40px;
    }
  }
  .rule-title {
    padding-top: 20px;
    border-top: 1px solid #8b8585;
  }
}
.four {
  padding-top: 40px;
  > div {
    padding: 20px 0;
    border-top: 1px solid #8b8585;
    > div {
      margin-bottom: 20px;
    }
    .laber {
      color: rgb(133, 133, 128);
      font-size: 14px;
    }
  }
}
.six {
  padding-top: 40px;
}
.edit {
  div {
    margin: 12px auto 30px;
  }
  .radio_box {
    span {
      font-size: 16px;
    }
    .laber {
      font-size: 14px;
      color: rgb(241, 93, 93);
      margin-left: 30px;
    }
  }
}
</style>