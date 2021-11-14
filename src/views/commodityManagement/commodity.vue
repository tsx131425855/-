<!-- tsx商品管理 -->
<template>
  <div class="package">
    <div class="hide">
      <el-button
        type="primary"
        @click="addMerchandise()"
        v-if="Jurisdiction.add == 1"
        >新增</el-button
      >
      <el-button
        type="danger"
        @click="loopdelete(1)"
        v-if="Jurisdiction.loop_delete == 1"
        >删除</el-button
      >
      <el-button
        type="warning"
        @click="loopshow('down')"
        v-if="Jurisdiction.loop_show == 1"
        >下架</el-button
      >
      <el-button
        type="warning"
        @click="loopshow('up')"
        v-if="Jurisdiction.loop_show == 1"
        >上架</el-button
      >
      <el-button
        type="info"
        @click="productcopys(1)"
        v-if="Jurisdiction.copy == 1"
        >复制</el-button
      >
      <el-button
        @click="loopcycle(1, null, 'yes')"
        v-if="Jurisdiction.loop_cycle == 1"
        >循环</el-button
      >
      <el-button
        @click="loopcycle(1, null, 'no')"
        v-if="Jurisdiction.loop_cycle == 1"
        >不循环</el-button
      >
      <el-input
        v-model="keyword"
        class="input"
        prefix-icon="el-icon-search"
        placeholder="商品名称/id"
      />
      <el-button
        type="success"
        class
        @click="(page = 1), getDatalist()"
        icon="el-icon-search"
        >查询</el-button
      >
      <el-button type="info" @click="screen = !screen">
        筛选
        <i class="el-icon-arrow-down" />
      </el-button>
      <el-button
        v-if="Jurisdiction.export == 1"
        type="success"
        icon="el-icon-printer"
        @click="exporte"
        >导出</el-button
      >
    </div>
    <div v-show="screen" style="margin-bottom: 20px">
      <el-row style="margin-bottom: 10px">
        <el-col :span="4.5">
          <span>所属代理</span>
          <el-select
            v-model="agent_id"
            class="maright"
            placeholder="请选择"
            @change="getlistmsg"
          >
            <el-option
              v-for="item in agent"
              :key="item.agent_id"
              :label="item.name"
              :value="item.agent_id"
            />
          </el-select>
        </el-col>
        <el-col :span="4.5">
          <span>是否推荐</span>
          <el-select
            v-model="is_recommend"
            class="maright"
            placeholder="请选择"
          >
            <el-option
              v-for="item in choice.recommend"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-col>
        <el-col :span="4.5">
          <span>所属分类</span>
          <el-select v-model="cate_id" class="maright" placeholder="请选择">
            <el-option
              v-for="item in choice.category"
              :key="item.product_category_id"
              :label="item.cate_name"
              :value="item.product_category_id"
            />
          </el-select>
        </el-col>
        <el-col :span="4.5">
          <span>商品状态</span>
          <el-select v-model="is_show" class="maright" placeholder="请选择">
            <el-option
              v-for="item in choice.show"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-col>
        <el-col :span="4.5">
          <span>配送方式</span>
          <el-select
            v-model="dispatching_type"
            class="maright"
            placeholder="请选择"
          >
            <el-option
              v-for="item in choice.dispatching_type"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-col>
        <el-col :span="4.5">
          <span>是否循环</span>
          <el-select v-model="cycle_type" class="maright" placeholder="请选择">
            <el-option
              v-for="item in choice.cycle_type"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-col>
        <el-col :span="4.5">
          <span>供应商</span>
          <el-select v-model="supplier_id" class="maright" placeholder="请选择">
            <el-option
              v-for="item in choice.supplier"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4.5">
          <span>蜜豆抵扣</span>
          <el-select v-model="is_midou" class="maright" placeholder="请选择">
            <el-option
              v-for="item in choice.is_midou_list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-col>
      </el-row>
    </div>
    <!-- 列表 -->

    <el-table
      v-loading="loading"
      :data="datalist"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @sort-change="sort"
    >
      <el-table-column fixed type="selection" width="55" prop="product_id" />
      <el-table-column
        prop="product_id"
        label="ID"
        sortable="custom"
        width="80"
      />
      <el-table-column prop="product_name" label="商品名称" />
      <el-table-column prop="cate_name" label="商品分类" />
      <el-table-column prop="agent_name" label="所属代理商" />
      <el-table-column
        prop="product_price"
        label="商品价格"
        sortable="custom"
      />
      <el-table-column
        prop="add_time"
        label="添加时间"
        width="110"
        align="center"
        sortable="custom"
      />
      <el-table-column
        prop="product_start_time"
        label="开始时间"
        width="90"
        align="center"
      />
      <el-table-column
        prop="product_end_time"
        label="结束时间"
        width="90"
        align="center"
      />
      <el-table-column prop="product_stock" label="商品库存" width="100" />
      <el-table-column
        prop="dispatching_type_name"
        label="配送方式"
        align="center"
        width="100"
      />
      <el-table-column prop="supplier_name" label="供应商" />
      <el-table-column prop="cycle_type" label="循环" width="80" fixed="right">
        <template slot-scope="scope">
          <div
            @click="loopcycle(2, scope, 'bath')"
            style="display: flex; justify-content: center; cursor: pointer"
          >
            <i
              class="el-icon-error"
              style="color: red"
              v-if="scope.row.cycle_type == 2"
            ></i>
            <i class="el-icon-success" style="color: green" v-else></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="is_recommend"
        label="推荐"
        width="80"
        fixed="right"
      >
        <template slot-scope="scope">
          <div
            @click="looprecommend(2, scope)"
            style="display: flex; justify-content: center; cursor: pointer"
          >
            <i
              class="el-icon-error"
              style="color: red"
              v-if="scope.row.is_recommend == 0"
            />
            <i class="el-icon-success" style="color: green" v-else />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="butler_realname"
        label="排序"
        sortable="custom"
        fixed="right"
        width="80"
      >
        <template slot-scope="scope">
          <div>
            <el-input
              v-model="scope.row.product_sort"
              @blur="changesort(scope)"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="is_show_name"
        label="上/下架"
        width="80"
        align="center"
      />
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            :disabled="scope.row.is_show == 1 ? false : true"
            effect="dark"
            content="编辑商品请先下架"
            placement="top-start"
          >
            <el-button
              v-if="Jurisdiction.edit == 1 && scope.row.is_show != 1"
              type="text"
              size="small"
              :disabled="scope.row.is_show == 1 ? true : false"
              @click="getEdit(scope.row, 1)"
              >编辑</el-button
            >
            <el-button
              v-if="Jurisdiction.edit == 1 && scope.row.is_show == 1"
              type="text"
              size="small"
              style="color: #ccc"
              >编辑</el-button
            >
          </el-tooltip>
          <el-button
            v-if="Jurisdiction.loop_delete == 1"
            type="text"
            size="small"
            style="margin: 0"
            @click="loopdelete(2, scope.row)"
            >删除</el-button
          >
          <el-button
            type="text"
            size="small"
            style="margin: 0"
            @click="getEdit(scope.row, 2)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="block">
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 30, 40, 50]"
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
          <el-button size="small" @click="dialogVisible = false"
            >关闭</el-button
          >
          <el-button size="small" @click="conmit" v-show="!prohibit"
            >保存</el-button
          >
        </el-col>
        <el-col :span="6">
          <span>是否上下架</span>
          <el-radio-group v-model="form.is_show" :disabled="prohibit">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-col>

        <el-col :span="6">
          <span>是否仅限蜜豆抵扣</span>
          <el-radio-group v-model="form.is_midou" :disabled="prohibit">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
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
          <span>新用户专享</span>
          <el-radio-group v-model="form.is_new_special" :disabled="prohibit">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-col>
      </div>
      <!-- tab -->
      <div class="maxtab">
        <div
          class="tabtype"
          :class="tab == 1 ? 'tabbott' : ''"
          @click="tabTouch($event, 1)"
        >
          基础信息
          <div></div>
        </div>
        <!-- <div class="tabtype" :class="tab==2?'tabbott':''">
          商品规格
          <div></div>
        </div>
        <div class="tabtype" :class="tab==3?'tabbott':''">
          佣金配置
          <div></div>
        </div>-->
        <div
          class="tabtype"
          :class="tab == 2 ? 'tabbott' : ''"
          @click="tabTouch($event, 2)"
        >
          商品价格
          <div></div>
        </div>
        <div
          class="tabtype"
          :class="tab == 4 ? 'tabbott' : ''"
          @click="tabTouch($event, 4)"
        >
          商品描述
          <div></div>
        </div>
        <div
          class="tabtype"
          :class="tab == 5 ? 'tabbott' : ''"
          @click="tabTouch($event, 5)"
        >
          分享设置
          <div></div>
        </div>
        <div
          class="tabtype"
          :class="tab == 6 ? 'tabbott' : ''"
          @click="tabTouch($event, 6)"
        >
          猜你喜欢
          <div></div>
        </div>
      </div>
      <!-- 表单输入 -->
      <div class="fromSlide" id="from" ref="Box" @scroll="orderScroll">
        <!-- 基础信息 -->
        <el-form
          ref="form"
          :model="form"
          :disabled="prohibit"
          :rules="rules"
          label-width="80px"
          label-position="top"
        >
          <div class="fromContent" id="basics">
            <p class="tabtype">基础信息</p>
            <el-row>
              <el-col :span="5">
                <el-form-item label="商品分类" prop="cateid">
                  <el-select
                    v-model="form.cate_id"
                    class="maright"
                    placeholder="请选择"
                  >
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
                    :disabled="daili"
                    @change="getproductmsg"
                  >
                    <el-option
                      v-for="item in agent"
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
                    placeholder="单行输入"
                    controls-position="right"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="7">
                <el-form-item label="商品主标题" prop="product_name">
                  <el-input
                    placeholder="单行输入"
                    v-model="form.product_name"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="副标题" prop="product_sub_name">
                  <el-input
                    placeholder="单行输入"
                    v-model="form.product_sub_name"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="5">
                <el-form-item label="所属乡镇">
                  <!-- <el-input placeholder="请输入" class="frominput" v-model="form.town_code"></el-input> -->
                  <el-select
                    v-model="form.town_code"
                    class="maright"
                    placeholder="请选择"
                  >
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

              <el-col :span="5">
                <el-form-item label="商品来自">
                  <el-input
                    placeholder="最多10字"
                    v-model="form.product_from"
                  ></el-input>
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
                <el-radio :label="1" style="margin-bottom: 20px; width: 100%">
                  <span style="width: 100px; display: inline-block">物流</span>
                  <span>运费</span>
                  <el-input-number
                    v-model="form.product_postage"
                    controls-position="right"
                    placeholder="0元为包邮"
                    class="frominput"
                  />
                  <span style="margin-left: 20px">下单成功后</span>
                  <el-input-number
                    v-model="form.after_order_delivery"
                    controls-position="right"
                    placeholder="0元为包邮"
                    class="frominput"
                  />
                  <span style="margin-left: 10px">天发货</span>
                  <span style="margin-left: 80px">下单成功后发货提示</span>
                  <el-input
                    v-model="form.delivery_tip"
                    placeholder="0元为包邮"
                    class="frominput"
                  />
                </el-radio>
                <el-radio :label="2">
                  <span style="width: 100px; display: inline-block"
                    >门店自提</span
                  >
                  <span>商品截单后</span>
                  <el-input-number
                    v-model="form.delivery_day"
                    placeholder
                    class="frominput"
                    controls-position="right"
                  />
                  <span>天发货</span>
                </el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="虚拟销量">
              <!-- <el-radio-group v-model="form.vir_sale_type"> -->
              <el-radio
                :label="0"
                :value="0"
                style="margin-bottom: 20px; width: 100%"
              >
                <span style="width: 100px; display: inline-block"
                  >固定销量</span
                >
                <el-input-number
                  v-model="form.product_sales"
                  placeholder="销售量"
                  class="frominput"
                  controls-position="right"
                />
                <span style="color: red; font-size: 12px"
                  >设置的销量后商品前端销售量=固定小时+实际销售</span
                >
              </el-radio>
              <div v-if="!prohibit">
                <!-- <el-radio :label="1" v-model="form.vir_sale_type"> -->
                <span @click="radiochange">
                  <span v-if="form.vir_sale_type == 1" class="zhong">
                    <span class="xiaoquan" />
                  </span>
                  <span v-else class="si">
                    <span class="xiaoquan" />
                  </span>
                  <span style="width: 100px; display: inline-block"
                    >实时增加</span
                  >
                </span>
                <span>每</span>
                <el-input-number
                  v-model="form.sales_apart_time"
                  placeholder
                  controls-position="right"
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
                <span style="color: red; font-size: 12px"
                  >实时增加虚拟销量将会按设置好的数值自动增加</span
                >
                <!-- </el-radio> -->
              </div>
              <el-radio v-else v-model="form.vir_sale_type" :label="1">
                <span style="width: 100px; display: inline-block"
                  >实时增加</span
                >
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
                <span style="color: red; font-size: 12px"
                  >实时增加虚拟销量将会按设置好的数值自动增加</span
                >
              </el-radio>
              <!-- </el-radio-group> -->
            </el-form-item>
            <el-form-item label="货号">
              <el-input
                placeholder="单行输入"
                v-model="form.product_sn"
                style="width: 300px"
              ></el-input>
            </el-form-item>

            <el-row :gutter="20">
              <el-col :span="7">
                <el-form-item label="标签">
                  <el-input
                    placeholder="单行输入"
                    v-model="form.product_tag"
                    style="width: 300px"
                  ></el-input>
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
                <el-form-item label="库存数量">
                  <!-- <el-input-number
                    v-model="form.product_stock"
                    @input="kucun"
                    controls-position="right"
                    placeholder="单行输入"
                  />-->
                  <el-input-number
                    v-model="form.product_stock"
                    controls-position="right"
                    placeholder="单行输入"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="每组个数">
                  <el-input-number
                    v-model="form.group_size"
                    controls-position="right"
                  />
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
              <el-switch
                v-model="form.is_system"
                active-color="#13ce66"
                inactive-color="#ccc"
              />
            </p>
            <p style="color: red">
              1、修改规格前请确认该商品是否正在参加拼团或者秒杀活动
            </p>
            <p style="color: red">
              2、如果该商品存在上述情况，此时修改规格可能会影响该商品的拼团价或者秒杀价
            </p>
            <div class="guigeyanzi" v-if="form.is_system">
              <el-button type="primary" size="small" @click="addTemplate"
                >添加规格模板</el-button
              >
              <el-form-item label>
                <el-select
                  v-model="form.Choicetemp_id"
                  style="margin-left: 20px"
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
                v-if="form.is_system && dialogVisible"
                :agentMap="agent"
                :elsec="prohibit ? 3 : addedit"
                ref="Template"
                :templateData="templateData"
                :isShow="false"
                :agentId="form.agent_id"
              />
            </div>
          </div>

          <!-- 商品描述 -->
          <div class="fromContent" id="describe">
            <p style="color: red">
              1、手动修改了图片扩展名，点击保存时会提示网络错误
            </p>
            <p style="color: red">
              2、使用截图功能获取的图片，点击保存时会提示网络错误
            </p>
            <p style="color: red">
              3、如果发现这个现象可用微信将这张图片，发送至好友或者文件传输助手在发一次
            </p>
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
                :disabled="prohibit"
                :maxlimit="1"
                :index="9"
                @Removeimg="RemoveimgArray"
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
                :disabled="prohibit"
                :maxlimit="1"
                :index="1"
                @Removeimg="RemoveimgArray"
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
                  :disabled="prohibit"
                  :maxlimit="10"
                  :multiple="true"
                  :index="2"
                  @Removeimg="RemoveimgArray"
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
                  :disabled="prohibit"
                  :maxlimit="20"
                  :index="3"
                  :multiple="true"
                  @Removeimg="RemoveimgArray"
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
                :disabled="prohibit"
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
                  placeholder="单行输入"
                  style="width: 300px"
                />
              </el-checkbox>
            </el-form-item>
            <el-form-item label="负责人">
              <el-checkbox v-model="form.village_retail_status">
                <el-input-number
                  v-model="form.cm_rate_village"
                  :disabled="!form.village_retail_status"
                  controls-position="right"
                  placeholder="单行输入"
                  style="width: 300px"
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
                  placeholder="单行输入"
                  style="width: 300px"
                />
              </el-checkbox>
            </el-form-item>
          </div>
          <!-- 分享设置 -->
          <div class="fromContent" id="share">
            <p class="tabtype">分享设置</p>
            <div>
              <el-radio-group v-model="form.share_status">
                <el-radio :label="0" style="width: 100%; margin-bottom: 10px"
                  >固定设置:分享链接图片为商品列表展示图
                  标题为商品主标题</el-radio
                >
                <el-radio :label="1">
                  <span>自定义设置</span>
                  <div>
                    <span>分享文案</span>
                    <el-input v-model="form.share_words" maxlength="30" />
                    <span style="color: red; font-size: 12px">限30个字</span>
                  </div>
                  <p>分享图片 不能超过2MB; 限一张</p>
                </el-radio>
              </el-radio-group>
              <div style="display: flex">
                <Upimg
                  :exporteurl="exporteurl"
                  :fileList="share"
                  fileName="image"
                  :showList="true"
                  :fileHeaders="headers"
                  :disabled="prohibit"
                  :maxlimit="1"
                  :index="4"
                  @Removeimg="RemoveimgArray"
                  @Successimg="SuccessimgArray"
                />
                <Upimg
                  v-if="shareShow.length > 0"
                  style="margin-left: 20px"
                  :exporteurl="exporteurl"
                  :file-list="shareShow"
                  file-name="image"
                  :show-list="true"
                  :file-headers="headers"
                  :disabled="true"
                  :maxlimit="1"
                  :index="4"
                  @Removeimg="RemoveimgArray"
                />
              </div>
            </div>
          </div>

          <!-- 猜你喜欢 -->
          <div class="fromContent" id="youLike">
            <p class="tabtype">猜你喜欢</p>
            <SelectedCommodity
              ref="selectedproduct"
              :agent_id="form.agent_id"
              :product_list="product_list"
            />
          </div>
        </el-form>
      </div>
    </el-dialog>
    <PublicDialog
      v-if="closeShowView"
      :isShowVisible="closeShowView"
      tsxTitle="商品库新增"
      tsxWidth="80%"
      @handleClose="handleClose"
    >
      <div slot="forms">
        <div class="hide">
          <span>筛选：</span>
          <span>分类</span>
          <el-select
            v-model="cate"
            size="small"
            class="gaosizuobian"
            placeholder="筛选"
          >
            <el-option
              v-for="item in cate_map"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
          <span class="gaosizuobian">配送方式</span>
          <el-select
            v-model="shipping"
            size="small"
            class="gaosizuobian"
            placeholder="筛选"
          >
            <el-option
              v-for="item in shipping_map"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
          <span class="gaosizuobian">关键词</span>
          <el-input
            v-model="keywords"
            size="small"
            class="input gaosizuobian"
            prefix-icon="el-icon-search"
            placeholder="商品主标题/副标题"
          />
          <el-button type="success" size="small" @click="(pages = 1), library()"
            >查询</el-button
          >
          <el-button
            type="info"
            size="small"
            @click="(shipping = ''), (keywords = ''), (cate = 0)"
            >重置</el-button
          >
        </div>

        <template>
          <el-table
            :data="librarylist"
            border
            style="width: 100%"
            @selection-change="libraryChange"
          >
            <el-table-column
              fixed
              type="selection"
              width="55"
              prop="product_id"
            />
            <el-table-column prop="product_name" label="商品主标题" />
            <el-table-column prop="product_sub_name" label="商品副标题" />
            <el-table-column prop="pub_cate_name" label="分类" />
            <el-table-column prop="product_ot_price" label="市场价" />
            <el-table-column prop="dispatching_type" label="配送方式" />
          </el-table>
        </template>

        <div class="block">
          <el-pagination
            :current-page="pages"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="limits"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totals"
            @size-change="SizeChange"
            @current-change="CurrentChange"
          />
        </div>
        <div class="hide" style="margin-top: 10px">
          <span>* 代理商</span>
          <el-select
            v-model="form.agent_id"
            size="small"
            @change="getproductmsg"
            class="gaosizuobian"
            placeholder="筛选"
          >
            <el-option
              v-for="item in agent"
              :key="item.agent_id"
              :label="item.name"
              :value="item.agent_id"
            />
          </el-select>
          <span class="gaosizuobian">* 本地分类</span>
          <el-select
            v-model="ibraryclass"
            size="small"
            class="gaosizuobian"
            placeholder="筛选"
          >
            <el-option
              v-for="item in category_list"
              :key="item.product_category_id"
              :label="item.cate_name"
              :value="item.product_category_id"
            />
          </el-select>
          <el-button
            type="success"
            size="small"
            class="gaosizuobian"
            @click="addlibrary()"
            >添加</el-button
          >
          <el-button type="info" size="small" @click="closeibrary()"
            >取消</el-button
          >
        </div>
      </div>
    </PublicDialog>
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { exporteurl, turnDate, exportFile, CopyObject } from "@/utils/user";
import { trim } from "@/utils/validate";
import { upimg, upVideo } from "@/api/user";
import Upimg from "@/components/Upimg";
import UpVideo from "@/components/UpVideo";
import CommoditySpecification from "@/components/CommoditySpecification";
import SelectedCommodity from "@/components/SelectedCommodity";
import {
  productmsg,
  addcommodity,
  productlists,
  loop_cycle,
  loop_recommend,
  loop_show,
  change_sort,
  productcopy,
  loop_delete,
  listmsg,
  edit_product_info,
  productedit,
  productExport,
  templateAdd,
  getpubliclist,
  addpublicproduct,
} from "@/api/commodity";
import { templateInfo } from "@/api/commodity";
import PublicDialog from "@/components/PublicDialog";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {
    Upimg,
    UpVideo,
    CommoditySpecification,
    PublicDialog,
    SelectedCommodity,
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
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      keyword: "",
      datalist: [],
      multipleSelection: [],
      Video: [],
      loading: false,
      derive: "",
      screen: false,
      agent: [],
      exporteurl: exporteurl + upimg,
      exporteurlVideo: exporteurl + upVideo,
      headers: {
        token: localStorage.getItem("Token"),
        enctype: "multipart/form-data",
      },
      Jurisdiction: {},
      agent_id: "",
      dialogVisible: false,
      specifications: [], //  添加规格
      form: {
        agent_id: JSON.parse(localStorage.getItem("user")).agent_id,
        cate_id: 0, // 分类id
        product_sort: "1", // 商品排序
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
        is_system: false, // 模板使用
        is_midou: 0,
      },
      options: [],
      tab: 1,
      rules: {
        cateid: [{ required: true, trigger: "change", validator: cateid }],
        product_name: [
          { required: true, trigger: "blur", validator: product_name },
        ],
        product_sub_name: [
          { required: true, trigger: "blur", validator: product_sub_name },
        ],
        tiem: [{ required: true, trigger: "change", validator: tiem }],
        supplier_id: [
          { required: true, trigger: "change", validator: supplier_id },
        ],
        supplier_price: [
          { required: true, trigger: "blur", validator: supplier_price },
        ],
        product_price: [
          { required: true, trigger: "blur", validator: product_price },
        ],
        product_stock: [
          { required: true, trigger: "blur", validator: product_stock },
        ],
        product_ot_price: [
          { required: true, trigger: "blur", validator: product_ot_price },
        ],
      },
      prohibit: false, //  禁止修改
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
      is_recommend: "", // 是否推荐（0：未推荐，1：推荐）
      cate_id: 0, // 分类id
      is_show: "", // 是否上下架 2未下架，1为上架
      dispatching_type: "", // 配送方式 1 物流配送 2 门店自提
      cycle_type: "", // 是否循环上下架 2:否 1：是
      supplier_id: 0, // 供应商id
      sort_type: "asc", // 排序方式 升序：asc 降序：desc 默认降序
      sort_name: "", // 排序类型 商品id=>product_id 商品排序=>product_sort 默认product_sort
      choice: {},
      addedit: 1,
      shareShow: [],
      daili: true,
      template_list: [],
      templateData: {},
      closeShowView: false,
      keywords: "",
      shipping: "",
      cate: "",
      pages: 1,
      limits: 10,
      librarylist: [],
      totals: 0,
      librarySelection: [],
      ibraryclass: "",
      status: "",
      product_ids: [], // 猜你喜欢
      product: false,
      product_list: [],
      is_midou: "",
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
      let arr = [];
      val.map((res) => {
        arr.push(res.product_id);
      });
      this.multipleSelection = arr;
    },
    handleClose() {
      this.closeShowView = false;
    },
    libraryChange(val) {
      /** 商品库选中 */
      let arr = [];
      val.map((res) => {
        arr.push(res.product_id);
      });
      this.librarySelection = arr;
    },
    CurrentChange(val) {
      // 页数
      this.pages = val;
      console.log(`当前页: ${val}`);
      this.library();
    },
    SizeChange(val) {
      this.limits = val;
      console.log(`每页 ${val} 条`);
      this.pages = 1;
      this.library();
    },
    closeibrary() {
      this.$confirm("内容未保存是否确认关闭", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          this.closeShowView = false;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消关闭",
          });
        });
    },
    open() {
      /** 设置模板 */
      this.$prompt("添加规格模板", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          this.$message({
            type: "success",
            message: value,
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    RemoveimgArray(val) {
      console.log(val);
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
        case 9:
          this.product_rectangle_imagelist = val.imgArray;
          break;
      }
    },
    SuccessVideo(val) {
      console.log(val);
      this.Video = val;
    },
    RemoveVideo() {
      this.Video = [];
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
          sun = this.$el.querySelector("#youLike").offsetTop;
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
        town_code: "", // 所属乡镇
        village_rake_back_status: false,
        partner_retail_status: false,
        village_retail_status: false,
        is_system: false, // 模板使用
        Choicetemp_id: "",
        product_from: "", // 商品来自
        is_midou: 0,
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
      this.librarySelection = [];
      this.ibraryclass = "";
      this.status = "";
      this.keywords = "";
      this.shipping = "";
      this.cate = "";
      this.cate_map = [];
      this.shipping_map = [];
      this.product_list = [];
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
    fensiradio(val) {
      console.log(val);
    },
    template(val) {
      /** 选择模板 */
      console.log(val);
      templateInfo({
        temp_id: val == "" ? 0 : val,
        agent_id: this.form.agent_id,
      }).then((res) => {
        if (res.code == 1) {
          this.templateData = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    conmit() {
      // 提交
      let that = this;
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(that.form);
          if (that.form.product_start_time instanceof Date) {
            that.form.product_start_time = turnDate(
              that.form.product_start_time,
              3
            );
          }
          if (that.form.product_end_time instanceof Date) {
            that.form.product_end_time = turnDate(
              that.form.product_end_time,
              3
            );
          }
          if (that.product_image.length > 0) {
            that.form.product_image = that.product_image[0].imgPath;
          } else that.form.product_image = "";
          if (that.babyMap.length > 0) {
            that.form.detail_img_list = JSON.stringify(that.babyMap);
          } else that.form.detail_img_list = "";
          if (that.share.length > 0) {
            that.form.shape_imgs = this.share[0].imgPath;
          } else that.form.shape_imgs = "";
          if (that.product_rectangle_imagelist.length > 0) {
            that.form.product_rectangle_image = this.product_rectangle_imagelist[0].imgPath;
          } else that.form.product_rectangle_image = "";
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
          if (that.form.template_default_data) {
            delete that.form.template_default_data;
          }
          if (that.Video.length > 0) {
            that.form.video_url = that.Video[0].video_path;
            that.form.video_cover_img = that.Video[0].video_cover_img;
          } else {
            that.form.video_url = "";
            that.form.video_cover_img = "";
          }
          if (this.product_list.length > 0) {
            if (that.$refs.selectedproduct.product_list.length > 0) {
              that.form.guess_like = that.$refs.selectedproduct.product_list.flatMap(
                (i) => [i.product_id]
              );
            } else that.form.guess_like = [];
          } else {
            that.form.guess_like = [];
          }

          if (that.addedit == 1) {
            that.getAddcommodity(that.form);
          } else {
            that.editData(that.form);
          }
        }
      });
    },
    loopshow(val) {
      /** 上下架 */
      let that = this;
      if (this.multipleSelection.length > 0) {
        let data = {
          product_id_str: this.multipleSelection.toString(),
          type: val,
        };
        return new Promise((resolve, reject) => {
          loop_show(data).then((res) => {
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
      } else {
        that.$message.error("请先选择");
      }
    },
    changesort(val) {
      /** 修改排序 */
      console.log(val.row);
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
    loopcycle(val, tsx, type) {
      /** 循环 */
      let that = this,
        data;
      if (val == 1) {
        if (this.multipleSelection.length > 0) {
          data = {
            product_id_str: this.multipleSelection.toString(),
            type,
          };
        } else {
          that.$message.error("请先选择");
          return;
        }
      } else if (val == 2) {
        data = { product_id_str: tsx.row.product_id, type };
      }
      return new Promise((resolve, reject) => {
        loop_cycle(data).then((res) => {
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
    productcopys(val, tsx) {
      /** 批量复制商品 */
      let that = this;
      let data;
      if (val == 1) {
        if (this.multipleSelection.length == 1) {
          data = {
            product_id_str: this.multipleSelection.toString(),
          };
        } else {
          that.$message.error("请先选择一条");
          return;
        }
      } else if (val == 2) {
        data = { product_id_str: tsx.row.product_id };
      }
      return new Promise((resolve, reject) => {
        productcopy(data).then((res) => {
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
    },
    looprecommend(val, tsx) {
      /** 推荐 */
      let that = this;
      let data;
      if (val == 1) {
        if (this.multipleSelection.length > 0) {
          data = {
            product_id_str: this.multipleSelection.toString(),
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
      let data;
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (val == 1) {
            if (this.multipleSelection.length > 0) {
              data = {
                product_id_str: this.multipleSelection.toString(),
              };
            } else {
              that.$message.error("请先选择");
              return;
            }
          } else if (val == 2) {
            data = { product_id_str: tsx.product_id };
          }
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
      } else if (val.prop == "product_price") {
        this.sort_name = "product_price";
      } else if (val.prop == "add_time") {
        this.sort_name = "add_time";
      }
      this.page == 1;
      this.getDatalist();
    },

    getEdit(val, tsx) {
      /** 获取修改信息 */
      const that = this;
      this.daili = true;
      return new Promise((resolve, reject) => {
        edit_product_info({ product_id: val.product_id }).then((res) => {
          if (res.code == 1) {
            that.form = res.data;
            that.form.product_id = val.product_id;
            that.form.agent_id = res.data.agent_id;
            that.form.product_start_time = new Date(
              res.data.product_start_time
            ); // 	开始时间
            that.form.product_end_time = new Date(res.data.product_end_time); //	结束时间
            that.form.partner_retail_status =
              res.data.partner_retail_status == 1 ? true : false;
            that.form.village_retail_status =
              res.data.village_retail_status == 1 ? true : false;
            that.form.village_rake_back_status =
              res.data.village_rake_back_status == 1 ? true : false;
            that.form.is_system = res.data.is_system == 1 ? true : false;
            if (Array.isArray(res.data.template_default_data)) {
              that.templateData = {}; // 模板数据
            } else {
              that.templateData = res.data.template_default_data; // 模板数据
            }
            that.form = CopyObject(that.form);
            this.product_list = res.data.product_guess_data;
            const babyMap = [];
            const describe = [];
            const share = [];
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

            if (res.data.product_rectangle_image) {
              that.product_rectangle_imagelist = [
                {
                  imgPath:
                    res.data.product_rectangle_image.product_rectangle_image,
                  name: "",
                  url:
                    res.data.product_rectangle_image
                      .product_rectangle_image_url,
                },
              ];
            } else {
              that.product_rectangle_imagelist = [];
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
            if (res.data.video_url) {
              that.Video = [
                {
                  name: "",
                  video_path: res.data.video_url.video_url,
                  video_url: res.data.video_url.video_url_detail,
                  video_cover_img: res.data.video_cover_img.video_cover_img,
                  url: res.data.video_cover_img.video_cover_img_url,
                },
              ];
            }

            that.babyMap = babyMap;
            that.describe = describe;
            that.share = share;
            that.dialogVisible = true;
            if (tsx == 2) that.prohibit = true;
            else that.prohibit = false;
            that.addedit = 2;
            that.getproductmsg("modify");
          } else {
            that.$message.error(res.msg);
          }
        });
        resolve();
      }).catch((error) => {
        console.log(error);
      });
    },
    getAddcommodity(val) {
      /** 添加商品 */
      let that = this;
      return new Promise((resolve, reject) => {
        addcommodity(val).then((res) => {
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
            message: "取消输入",
          });
        });
    },
    addMerchandise() {
      // 打开添加
      this.Initialization();
      this.getproductmsg();
      this.$confirm("", "新增商品", {
        confirmButtonText: "自定义新增",
        cancelButtonText: "商品库新增",
        type: "warning",
        center: true,
        showClose: true,
        closeOnClickModal: true,
        distinguishCancelAndClose: true,
      })
        .then(() => {
          /** 新增普通商品 */
          this.addedit = 1;
          this.daili = false;
          this.prohibit = false;
          this.dialogVisible = true;
        })
        .catch((action) => {
          /** 新增商品库 */
          // console.log(action);
          if (action == "cancel") {
            this.pages = 1;
            this.library();
            this.closeShowView = true;
          }
        });
    },
    library() {
      /** 商品库列表 */
      const data = {
        keyword: this.keywords,
        shipping: this.shipping,
        cate_id: this.cate,
        page: this.pages,
        limit: this.limits,
      };
      getpubliclist(data).then((res) => {
        if (res.code == 1) {
          this.librarylist = res.data.list;
          this.totals = res.data.total;
          this.cate_map = res.data.cate_map;
          this.shipping_map = res.data.shipping_map;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    addlibrary() {
      const data = {
        product_ids: this.librarySelection,
        agent_id: this.form.agent_id,
        cate_id: this.ibraryclass,
      };
      addpublicproduct(data).then((res) => {
        if (res.code == 1) {
          this.$message.success(res.msg);
          this.closeShowView = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    editData(val) {
      let that = this;
      return new Promise((resolve, reject) => {
        productedit(val).then((res) => {
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
    getproductmsg(modify) {
      /** 新增打开 */
      let that = this;
      return new Promise((resolve, reject) => {
        productmsg({
          agent_id: this.form.agent_id,
        }).then((res) => {
          this.loading = false;
          if (res.code == 1) {
            if (modify != "modify") {
              that.form.cate_id = 0;
              that.form.supplier_id = 0;
              that.form.town_code = "";
              that.form.Choicetemp_id = "";
            }
            that.category_list = res.data.category_list;
            that.self_addres_list = res.data.self_addres_list;
            that.supplier_list = res.data.supplier_list;
            that.village_list = res.data.village_list;
            that.template_list = res.data.template_list;
          } else {
            that.$message.error(res.msg);
          }
          resolve(res);
        });
      }).catch((error) => {
        console.log(error);
      });
    },
    getlistmsg() {
      /** 商品列表页筛选接口 */
      let that = this;
      return new Promise((resolve, reject) => {
        listmsg({
          agent_id:
            that.agent_id || JSON.parse(localStorage.getItem("user")).agent_id,
        }).then((res) => {
          this.loading = false;
          if (res.code == 1) {
            that.is_recommend = ""; // 是否推荐（0：未推荐，1：推荐）
            that.cate_id = 0; // 分类id
            that.is_show = ""; // 是否上下架 2未下架，1为上架
            that.dispatching_type = ""; // 配送方式 1 物流配送 2 门店自提
            that.cycle_type = ""; // 是否循环上下架 2:否 1：是
            that.supplier_id = 0; // 供应商id
            that.choice = {
              agent: res.data.agent_list,
              category: res.data.category_list,
              cycle_type: res.data.cycle_type_list,
              dispatching_type: res.data.dispatching_type_list,
              recommend: res.data.recommend_list,
              supplier: res.data.supplier_list,
              show: res.data.show_list,
              is_midou_list: res.data.is_midou_list,
            };
          } else {
            that.$message.error(res.msg);
          }
        });
        resolve();
      }).catch((error) => {
        console.log(error);
      });
    },
    exporte() {
      /** 导出 */
      const url = `${exporteurl}${productExport}?keyword=${trim(
        this.keyword
      )}&agent_id=${this.agent_id}&cate_id=${this.cate_id}&dispatching_type=${
        this.dispatching_type
      }&is_show=${this.is_show}&cycle_type=${this.cycle_type}&supplier_id=${
        this.supplier_id
      }&sort_type=${this.sort_type}&is_midou=${this.is_midou}&sort_name=${
        this.sort_name
      }&is_recommend=${this.is_recommend}&token=${localStorage.getItem(
        "Token"
      )}`;
      exportFile(url);
    },
    getDatalist() {
      const data = {
        keyword: trim(this.keyword),
        agent_id: this.agent_id,
        limit: this.limit,
        cate_id: this.cate_id,
        dispatching_type: this.dispatching_type,
        is_show: this.is_show,
        cycle_type: this.cycle_type,
        supplier_id: this.supplier_id,
        sort_type: this.sort_type,
        sort_name: this.sort_name,
        is_recommend: this.is_recommend,
        page: this.page,
        is_midou: this.is_midou,
      };
      this.loading = true;
      let that = this;
      return new Promise((resolve, reject) => {
        productlists(data).then((res) => {
          this.loading = false;
          if (res.code == 1) {
            if (res.action) {
              res.action.map((val) => {
                switch (val.tag) {
                  case "add":
                    if (val.display == 1) {
                      that.Jurisdiction.add = 1;
                    }
                    break;
                  case "loop_delete":
                    if (val.display == 1) {
                      that.Jurisdiction.loop_delete = 1;
                    }
                    break;
                  case "edit":
                    if (val.display == 1) {
                      that.Jurisdiction.edit = 1;
                    }
                    break;
                  case "copy":
                    if (val.display == 1) {
                      that.Jurisdiction.copy = 1;
                    }
                    break;
                  case "loop_show":
                    if (val.display == 1) {
                      that.Jurisdiction.loop_show = 1;
                    }
                    break;
                  case "loop_cycle":
                    if (val.display == 1) {
                      that.Jurisdiction.loop_cycle = 1;
                    }
                    break;
                  case "loop_recommend":
                    if (val.display == 1) {
                      that.Jurisdiction.loop_recommend = 1;
                    }
                    break;
                  case "change_sort":
                    if (val.display == 1) {
                      that.Jurisdiction.change_sort = 1;
                    }
                    break;
                  case "export":
                    if (val.display == 1) {
                      that.Jurisdiction.export = 1;
                    }
                    break;
                  default:
                    break;
                }
              });
              res.action.map((val) => {
                if (val.tag == "orderexport" && val.display == 1) {
                  that.derive = 1;
                }
              });
            }
            if (res.agent_map) {
              that.agent = res.agent_map;
            }
            that.datalist = res.data.list;
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
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getDatalist();
    this.getlistmsg();
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
.package .hide .input {
  margin-left: 20px;
  width: 200px;
}
.package .maright {
  margin-right: 20px;
  width: 120px;
  height: 30px;
  line-height: 30px;
}
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
<style scoped>
.el-input__inner {
  height: 30px;
  line-height: 30px;
}
.el-input__icon {
  line-height: 30px;
}
.el-button {
  padding: 10px 20px;
}
.el-form-item__label {
  line-height: 1;
}
</style>
