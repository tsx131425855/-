<template>
  <div class="root">
    <el-form :inline="true" label-width="90px" :model="formInline" class="demo-form-inline">
      <el-form-item label="商品名称:">
        <el-input v-model="formInline.product_name" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item label="订单号:">
        <el-input v-model="formInline.order_sn" placeholder="请输入订单号"></el-input>
      </el-form-item>
      <el-form-item label="下单账号:">
        <el-input v-model="formInline.phone" placeholder="请输入下单账号"></el-input>
      </el-form-item>

      <el-form-item label-width="80px" label="配送方式">
        <el-select
          @change="() => { this.formInline.selftSite = []}"
          v-model="formInline.delivery"
          placeholder="请选择"
        >
          <el-option
            :label="item"
            v-for="(item, index) in formInline.deliveryList"
            :key="item"
            :value="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="80px" label="配送时间">
        <el-select
          @change="() => { this.formInline.selftSite = []}"
          v-model="formInline.delivery_date"
          placeholder="请选择"
        >
          <el-option
            :label="item.text"
            v-for="(item) in formInline.delivery_date_map"
            :key="item.key"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="80px" label="订单类型">
        <el-select v-model="formInline.order_type" placeholder="请选择">
          <el-option
            :label="item.type_name"
            v-for="(item) in formInline.order_map"
            :key="item.type_id"
            :value="item.type_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label-width="80px" label="配送时间">
        <el-select v-model="formInline.delivery_time" placeholder="请选择">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>-->

      <el-form-item label-width="80px" label="下单时间">
        <el-date-picker
          v-model="formInline.orderTime"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label-width="80px" label="自提点">
        <el-select
          :disabled="formInline.delivery == 0"
          v-model="formInline.selftSite"
          multiple
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in formInline.selftSite_list"
            :key="item + index"
            :value="index"
            :label="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="80px" label="代理商">
        <el-select v-model="formInline.agent" placeholder="请选择">
          <el-option
            :label="item.name"
            v-for="item in formInline.agentList"
            :key="item.name"
            :value="item.agent_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="page=1;getData()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="success"
          :disabled="formInline.delivery === 0"
          @click="exportExcel(1)"
        >导出自提订单</el-button>
        <el-button
          type="success"
          :disabled="formInline.delivery === 1"
          @click="exportExcel(0)"
        >导出物流订单</el-button>
      </el-form-item>
    </el-form>
    <div class="handle">
      <el-button type="info" @click="returnPending">待处理</el-button>
      <el-button type="warning" @click="outstock">出库/发货</el-button>
      <!-- <el-button type="success" @click="onSubmit">导出自提订单</el-button> -->
    </div>
    <template>
      <el-table
        v-loading="loading"
        :data="dataList"
        border
        style="width: 100%"
        fit
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column fixed type="selection" width="55"></el-table-column> -->
        <el-table-column fixed type="selection" align="center" width="55" />

        <!-- <el-table-column fixed label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="editClick(scope.row)">查看</el-button>
          </template>
        </el-table-column>-->

        <el-table-column fixed width="190" align="center" label="订单编号">
          <template slot-scope="scope">
            <router-link
              class="routeLike"
              :to="{ path: `/order_detail?order_id=${scope.row.order_id}`}"
            >{{ scope.row.order_sn }}</router-link>
          </template>
        </el-table-column>
        <el-table-column fixed width="150" align="center" prop="user.user_tel" label="下单账号" />
        <el-table-column align="center" width="80" prop="self_text" label="配送方式" />
        <el-table-column align="center" prop="address.address" min-width="150" label="收货信息/门店地址" />
        <el-table-column align="center" min-width="200" label="商品名称">
          <template slot-scope="scope">
            <div class="scope">
              <div
                class="scopeItem"
                v-for="(item, index) in scope.row.product"
                :key="index + item.product_name"
              >{{ item.product_name }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="160" label="配送时间">
          <template slot-scope="scope">
            <div class="scope">
              <div
                class="scopeItem"
                v-for="(item, index) in scope.row.product"
                :key="index + item.product_name"
              >{{ item.exdelivery_time }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" width="160" prop="create_time" label="下单时间" />

        <el-table-column align="center" width="120" prop="agent_name" label="代理商" />

        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <div
              style="display: flex; justify-content: center;align-items: center;flex-wrap: wrap;"
            >
              <el-button
                size="mini"
                type="primary"
                @click="outstock( { order_id:scope.row.order_id, self: scope.row.self  } )"
              >出库</el-button>
              <el-button size="mini" type="warning" @click="returnPending(scope.row.order_id)">待处理</el-button>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" prop="create_time" label="一级代理商抽成"></el-table-column> -->
        <!-- <el-table-column align="center" prop="create_time" label="二级代理商抽成"></el-table-column> -->
        <!-- <el-table-column align="center" prop="create_time" label="三级代理商抽成"></el-table-column>-->
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

    <el-dialog top="50px" width="1050px" title="订单出库" @close="closeMask" :visible.sync="mask.show">
      <div style="margin-bottom: 12px; padding-bottom: 15px; border-bottom: 2px solid #eee">
        <el-button @click="closeMask">关 闭</el-button>
        <el-button type="primary" @click="commitStock">提 交</el-button>
        <el-button type="success" @click="checkAll">全选/取消选中</el-button>
      </div>

      <!-- 自提商品 -->
      <div
        style="max-height: 600px; overflow-y: scroll; padding-right: 20px;"
        v-if="mask.type === 1"
      >
        <div class="item" v-for="(item, index) in mask.dataList" :key="index">
          <div class="maskItem">
            <span>订单编号:</span>
            {{ item.order_sn }}
          </div>
          <div class="maskItem">
            <span>提货人:</span>
            {{ item.address.name }}
          </div>
          <div class="maskItem">
            <span>联系电话:</span>
            {{ item.address.phone }}
          </div>
          <div class="maskItem">
            <span>自提点:</span>
            {{item.address.self_name}}
          </div>
          <el-table
            :data="item.product"
            border
            fit
            @selection-change="val => {mask.selected[index] = val}"
            :ref="`tableMask1${index}`"
          >
            <el-table-column fixed type="selection" align="center" width="55" />
            <el-table-column align="center" label="商品信息">
              <template slot-scope="scope">
                <div>{{ scope.row.product_name + ' *'+ scope.row.number }}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="product_attr_value_name_string" label="规格信息" />
          </el-table>
        </div>
      </div>

      <!-- 物流商品 -->
      <div
        style="max-height: 600px; overflow-y: scroll; padding-right: 20px;"
        v-if="mask.type === 0"
      >
        <div v-if="mask.dataList.length !== 1">
          <div class="mask_input">
            <span>快递公司</span>
            <el-select style="widht: 200px" v-model="mask.selectCon" placeholder="请选择快递">
              <el-option
                :label="item.name"
                v-for="item in mask.con"
                :key="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <span style="margin-left: 30px;">快递单号</span>
            <el-input placeholder="请输入快递单号" v-model="mask.delivery_sn" style="width: 300px;" />
          </div>
          <el-table
            :data="mask.dataList"
            border
            fit
            @selection-change="val =>  {mask.selected[0] = val}"
            :ref="`tableMask20`"
          >
            <el-table-column align="center" label="商品信息">
              <template slot-scope="scope">
                <div class="scope">
                  <div
                    class="scopeItem"
                    v-for="(item, index) in scope.row.product"
                    :key="index + item.product_name"
                  >{{ item.product_name }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="address.name" label="收货人" />
            <el-table-column align="center" label="规格信息">
              <template slot-scope="scope">
                <div class="scope">
                  <div
                    class="scopeItem"
                    v-for="(item, index) in scope.row.product"
                    :key="index + item.product_name"
                  >{{ item.product_attr_value_name_string }}</div>
                </div>
              </template>
            </el-table-column>

            <el-table-column align="center" prop="address.phone" label="联系电话" />
          </el-table>
        </div>

        <div v-if="mask.dataList.length === 1">
          <div class="item" v-for="(item, index) in mask.dataList" :key="index">
            <!-- 当订单为精确订单, 给用户更多选择权 -->
            <div class="maskItem">
              <span>订单编号:</span>
              {{ item.order_sn }}
            </div>
            <div class="maskItem">
              <span>收货人:</span>
              {{ item.address.name }}
            </div>
            <div class="maskItem">
              <span>联系电话:</span>
              {{ item.address.phone }}
            </div>
            <div class="mask_input">
              <span>快递公司</span>
              <el-select style="widht: 200px" v-model="mask.selectCon" placeholder="请选择快递">
                <el-option
                  :label="item.name"
                  v-for="item in mask.con"
                  :key="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <span style="margin-left: 30px;">快递单号</span>
              <el-input placeholder="请输入快递单号" v-model="mask.delivery_sn" style="width: 300px;" />
            </div>
            <el-table
              :data="item.product"
              border
              fit
              @selection-change="val => {mask.selected[index] = val}"
              :ref="`tableMask3${index}`"
            >
              <el-table-column fixed type="selection" align="center" width="55" />
              <el-table-column align="center" prop="product_name" label="商品信息" />
              <el-table-column align="center" prop="product_attr_value_name_string" label="规格信息" />
              <el-table-column align="center" prop="number" label="数量" width="70" />
              <el-table-column align="center" prop="delivery_num" label="已发数量" width="80" />

              <el-table-column align="center" label="发货数量" width="140">
                <template slot-scope="scope">
                  <el-input
                    label="发货数量:"
                    v-model="mask.delivery_num[scope.row.order_pid]"
                    placeholder="输入发货数量"
                  ></el-input>
                </template>
              </el-table-column>
            </el-table>

            <!-- 当此订单有多个共同出库时, 默认全部选中发货 -->
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { pickerOptions, parseTime } from "@/utils/index";
import {
  outPut_list,
  exportOutPut,
  outstock,
  commitCutstock,
  returnPending
} from "@/api/order";
import { type } from "os";
export default {
  data() {
    return {
      pickerOptions: {
        shortcuts: pickerOptions
      },
      dataList: [],
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      loading: false,
      multipleSelection: [],
      // 搜索条件
      formInline: {
        order_sn: "", // 订单编号

        delivery: "", // 配送方式
        deliveryList: [], // 方式列表
        delivery_time: "", // 商品类型
        delivery_time_list: [], // 类型列表
        order_map: [], // 订单类型列表
        order_type: "", //订单类型
        selftSite: "", // 自提点
        selftSite_list: [], // 自提列表
        phone: "", // 手机号码
        orderTime: [], // 下单时间
        agent: "", // 代理商
        agentList: [], // 代理商列表
        delivery_date_map: [], // 配送时间列表
        delivery_date: "" // 配送时间
      },
      mask: {
        show: false,
        type: "",
        selected: [], // 选中列表
        dataList: [], // 数据列表
        con: [], // 条件列表
        selectCon: "", // 所选的条件列表
        delivery_sn: "", // 快递单号
        delivery_num: {
          // 物流 - 发货数量  =>  order_pid: num
        }
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    onSubmit() {
      console.log("sumber");
    },
    /**
     * 转为待处理
     */
    returnPending(id) {
      this.$message.error("目前暂无此功能");
      return;
      let data = {
        order_ids: ""
      };
      if (typeof id == "number") {
        // 单个待处理
        data.order_ids = [id];
      } else {
        // 多个订单转为待处理
        data.order_ids = this.multipleSelection.map(item => item.order_id);
      }
      // returnPending(data)
      //   .then(res => {
      //     if (res.code == 1) {
      //       this.$message.success(res.msg);
      //       setTimeout(() => {
      //         this.getData();
      //       }, 600);
      //     } else {
      //       this.$message.error(res.msg);
      //     }
      //   })
      //   .catch(res => {
      //     console.log(res);

      //   });
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
    maskSelected(val, index) {
      console.log(val, index);
      // this.;
      console.log(this.mask.selected);
    },

    closeMask() {
      this.mask = {
        show: false,
        type: "",
        selected: [], // 选中列表
        dataList: [], // 数据列表
        con: [], // 条件列表
        selectCon: "", // 所选的条件列表
        delivery_sn: "", // 快递单号
        delivery_num: {
          // 物流 - 发货数量  =>  product_pid: num
        }
      };
    },
    /**
     * 选择弹窗中所有商品
     */
    checkAll() {
      let multipleData = [];

      let isAll = true;

      // 取出当前选中的所有商品
      this.mask.selected.forEach(item => {
        item.forEach(i => {
          if (i) {
            isAll = false;
          }
        });
      });

      this.mask.dataList.forEach((item, index) => {
        multipleData[index] = item.product;

        // console.log(this.$refs)
        // console.log(this.$refs.tableMask[index]);
        this.$nextTick(() => {
          // item.product.forEach(productItem => {
          setTimeout(() => {
            try {
              this.$refs[`tableMask1${index}`] &&
                this.$refs[`tableMask1${index}`][0].clearSelection(true);
              this.$refs[`tableMask20`] &&
                this.$refs[`tableMask20`].clearSelection(true);
              this.$refs[`tableMask3${index}`] &&
                this.$refs[`tableMask3${index}`][0].clearSelection(true);
            } catch (error) {
              console.error("清除筛选状态出错==>", error);
              console.log(
                "当前进行操作内容 ==> ",
                this.$refs[`tableMask3${index}`],
                this.$refs[`tableMask20`],
                this.$refs[`tableMask3${index}`]
              );
            }

            if (isAll) {
              try {
                this.$refs[`tableMask1${index}`] &&
                  this.$refs[`tableMask1${index}`][0].toggleAllSelection(true);
                this.$refs[`tableMask20`] &&
                  this.$refs[`tableMask20`].toggleAllSelection(true);
                this.$refs[`tableMask3${index}`] &&
                  this.$refs[`tableMask3${index}`][0].toggleAllSelection(true);
              } catch (error) {
                console.error("进行全选操作失败 ==>", error);
                console.log(
                  "当前进行操作内容 ==> ",
                  this.$refs[`tableMask3${index}`],
                  this.$refs[`tableMask20`],
                  this.$refs[`tableMask3${index}`]
                );
              }
            }

            // this.$refs.tableMask[1].toggleAllSelection();
          }, 100);

          // });
        });
        // console.log(this.$refs[`tableMask${index}`][0].toggleRowSelection)
        //  this.$refs[`tableMask${index}`][0].toggleRowSelection(productItem);
      });

      //  this.mask.selected = multipleData;
      //  console.log( this.$refs.tableMask)
    },

    // 选中商品出库, 打开弹窗
    outstock({ order_id, self }) {
      let order_ids = order_id
        ? [order_id]
        : this.multipleSelection.map(item => item.order_id);
      let selfType;

      if (self !== undefined) {
        selfType = self;
      } else {
        if (this.multipleSelection.length == 0) {
          this.$message.warning("请选择订单再进行操作");
          return;
        }
        let temp = this.multipleSelection[0].self;
        if (this.multipleSelection.some(item => item.self !== temp)) {
          this.$message.error("不允许自提订单与物流订单同时进行操作!!!");
          return;
        } else {
          selfType = temp;
        }
      }

      outstock({
        order_ids,
        self: selfType,
        product_name: this.formInline.product_name
      }).then(res => {
        if (res.code == 1) {
          this.mask.dataList = res.data.list;
          this.mask.con = res.data.express_map;
          this.mask.show = true;
          this.mask.type = selfType;
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 提交出库商品
    commitStock() {
      /**
       * 开发记: 此接口对应四种传参格式 => type
       *  1: 单个发货,   2: 多个发货   3: 自提单个出库   4: 自提多个出库
       *  目前自提出库全部使用批量出库, 物流分单个和批量分开处理
       *  这里如果要改会是一个坑
       *  留: magicSli
       */

      let data;

      let order_pid_list = [];
      let order_ids = [];
      // 取出当前选中的所有商品
      this.mask.selected.forEach(item => {
        item.forEach(i => {
          // 获取所有选中的pid 和 order_id
          order_pid_list.push(i); // 获取所有的选中商品
          order_ids.push(i.order_id); // 获取所有需要出库的订单(若选择了出库, 但是没勾选商品的视为放弃出库)

          // 对order_id进行去重处理
          order_ids = [...new Set(order_ids)];
        });
      });

      console.log("order_id  ==> ", order_ids);
      console.log("order_pid ( order_id + '_' + order_pid ) ==> ", order_ids);

      if (this.mask.type == 1) {
        // 自提订单
        if (order_pid_list.length === 0 || order_ids.length === 0) {
          this.$message.warning("请先选择需要进行操作的订单/商品");
          return;
        }
        data = {
          order_ids: order_ids,
          order_pid: order_pid_list.map(item => item.order_id + '_' + item.order_pid), // 获取所有选中商品的order_pid
          type: 4,
          self: this.mask.type
        };
      } else {
        // 物流订单

        if (!this.mask.selectCon || !this.mask.delivery_sn) {
          this.$message.error("必须填写完整的快递信息");
          return;
        }

        if (this.mask.dataList.length === 1) {
          // 单个订单详细发货

          let delivery_num = {};
          for (let k in this.mask.delivery_num) {
            if (order_pid_list.some(item => item.order_pid == k)) {
              delivery_num[k] = this.mask.delivery_num[k];
            }
          }

          data = {
            order_id: this.mask.dataList[0].order_id, // 订单编号
            order_ids: [this.mask.dataList[0].order_id], // 后台瞎几把要传的数据, 没多大意义
            product_ids: order_pid_list.map(item => item.product_id), // 需要发货的商品id数组
            delivery_num: delivery_num, // 发货数量 [ product_id:  数量 ]
            express_id: this.mask.selectCon, // 快递公司Id
            express_number: this.mask.delivery_sn, // 快递编号
            type: 1, // 1: 单个发货,   2: 多个发货   3: 自提单个出库   4: 自提多个出库
            self: this.mask.type // 0: 物流,  1:自提
          };
        } else {
          // 多个订单批量发货

          data = {
            order_ids: this.mask.dataList.map(item => item.order_id), // 物流批量出库, 直接将所有待操作的订单进行处理(这里没得操作空间)
            express_id: this.mask.selectCon, // 快递公司Id
            express_number: this.mask.delivery_sn, // 快递编号
            type: 2, // 1: 单个发货,   2: 多个发货   3: 自提单个出库   4: 自提多个出库
            self: this.mask.type // 0: 物流,  1:自提
          };
        }
      }

      commitCutstock(data).then(res => {
        if (res.code == 1) {
          this.$message.success("出库成功!!!");

          setTimeout(() => {
            // 重置mask数据
            this.mask = {
              show: false,
              type: "",
              selected: [], // 选中列表
              dataList: [], // 数据列表
              con: [], // 条件列表
              selectCon: "", // 所选的条件列表
              delivery_sn: "", // 快递单号
              delivery_num: {
                // 物流 - 发货数量  =>  product_pid: num
              }
            };
            this.getData();
          }, 600);
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 获取数据
    getData() {
      this.loading = true;
      const DATA = {
        product_name: this.formInline.product_name,
        order_sn: this.formInline.order_sn,
        self: this.formInline.delivery,
        user_tel: this.formInline.phone,
        agent_id: this.formInline.agent,
        self_point: this.formInline.selftSite,
        order_type: this.formInline.order_type,
        page: this.page,
        delivery_date: this.formInline.delivery_date,
        limit: this.limit,
        start_date:
          this.formInline.orderTime && this.formInline.orderTime[0]
            ? parseTime(this.formInline.orderTime[0])
            : "",
        end_date:
          this.formInline.orderTime && this.formInline.orderTime[1]
            ? parseTime(this.formInline.orderTime[1])
            : ""
      };

      outPut_list(DATA).then(res => {
        this.loading = false;
        if (res.code == 1) {
          this.formInline.agentList = res.agent_map;
          this.action = res.action;
          this.formInline.deliveryList = res.data.self_map;
          this.dataList = res.data.list;
          this.total = res.data.count;
          this.formInline.selftSite_list = res.data.address_map;
          this.formInline.order_map = res.data.order_map;
          this.formInline.delivery_date_map = res.data.delivery_date;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    /**
     * 导出表格
     * @param {self} Number 导出订单类型（0：物流订单导出 1：自提订单导出）
     */
    exportExcel(self) {
      const that = this;
      this.$confirm("请确认筛选条件是否符合", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "开始导出!"
          });

          const data = {
            self,
            product_name: this.formInline.product_name || "",
            order_sn: this.formInline.order_sn || "",
            user_tel: this.formInline.phone || "",
            agent_id: this.formInline.agent || "",
            self_point: this.formInline.selftSite || [],
            order_type: this.formInline.order_type,
            order_id:this.multipleSelection.map(item => item.order_id),
            delivery_date: this.formInline.delivery_date,
            start_date:
              this.formInline.orderTime && this.formInline.orderTime[0]
                ? parseTime(this.formInline.orderTime[0])
                : "",
            end_date:
              this.formInline.orderTime && this.formInline.orderTime[1]
                ? parseTime(this.formInline.orderTime[1])
                : ""
          };
          //开启新下载窗口
          window.open(exportOutPut(data));
        })
        .catch(res => {
          this.$message.error("导出出现故障,请联系管理员");
          console.log(res);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.root {
  padding: 40px;
}
.block {
  margin-top: 20px;
}
.handle {
  margin-bottom: 20px;
}
.scope {
  height: 100%;
  display: flex;
  flex-direction: column;

  .scopeItem {
    box-sizing: border-box;
    min-height: 35px;
    padding: 12px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    position: relative;

    &::after {
      position: absolute;
      content: "";
      width: 100%;
      bottom: 0;
      left: 0;
      height: 1px;
      background-color: #ebeef5;
    }
    &:first-child {
      padding-top: 0;
    }
    &:last-child {
      padding-bottom: 0;
      &::after {
        display: none;
      }
    }
  }
}
.item {
  margin: 10px 0;

  padding: 10px 0;
  .maskItem {
    margin-top: 16px;
    margin-bottom: 16px;
  }
}
.mask_input {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 20px;
  span {
    width: 100px;
    text-align: right;
    padding-right: 12px;
  }
}
.routeLike {
  color: cornflowerblue;
}
</style>