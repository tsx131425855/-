<template>
  <div class="root">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="状态">
        <el-select v-model="status" placeholder="请选择">
          <el-option
            :label="item.val"
            v-for="(item, index) in status_map"
            :key="index"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="广告名称:">
        <el-input placeholder="请输入广告名称" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="page=1;getData(); ">查询</el-button>
        <el-button type="success" @click="addAdv">添加广告</el-button>
      </el-form-item>
    </el-form>
    <template>
      <el-table
        v-loading="loading"
        :data="dataList"
        border
        height="65vh"
        fit
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column fixed type="selection" width="55"></el-table-column> -->
        <!-- <el-table-column fixed type="selection" align="center" width="55" /> -->

        <!-- <el-table-column fixed align="center" prop="service_id" label="售后ID" /> -->
        <el-table-column fixed align="center" prop="adv_position" width="160" label="广告位置" />
        <el-table-column min-width="140px" align="center" prop="adv_type" label="所属类型" />
        <el-table-column align="center" width="200" prop="adv_name" label="广告名称" />
        <el-table-column align="center" width="100" prop="adv_skip" label="链接" />
        <el-table-column align="center" prop="advskip_id" label="商品ID	" />
        <el-table-column align="center" prop="adv_skip_case" label="案例ID" />
        <el-table-column align="center" min-width="140px" prop="coupon_code_stauts" label="图片">
          <template slot-scope="scope">
            <img
              style="width: 100px; height:70px"
              :src="scope.row.adv_img_url || scope.row.adv_img"
              alt
            />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="adv_content" label="内容" />
        <el-table-column align="center" prop="adv_url_level" label="跳转等级" />
        <el-table-column align="center" sortable width="160" prop="start_time" label="开始时间" />
        <el-table-column align="center" width="160" prop="end_time" label="结束时间" />
        <el-table-column align="center" prop="adv_status" label="状态" />
        <el-table-column align="center" prop="agent_name" label="所属代理商" />
        <el-table-column align="center" width="160" prop="create_time" label="操作">
          <template slot-scope="scope">
            <div>
              <el-button type="primary" @click="editAdv(scope.row.adv_id)">编辑</el-button>
              <el-button type="warning" @click="deleteAdv(scope.row.adv_id)">删除</el-button>
            </div>
          </template>
        </el-table-column>
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

    <!-- 广告设置弹窗 -->
    <el-dialog
      center
      title="广告设置"
      :visible.sync="adv_mask.show"
      top="50px"
      class="mask"
      :close-on-click-modal="false"
      :before-close="closeAdv"
    >
      <div style="padding-bottom:15px; padding-right:60px;text-align:right">
        <el-button size="medium" type="success" @click="commitAdv">提交</el-button>
        <el-button size="medium" type="info" @click="closeAdv">取消</el-button>
      </div>
      <div class="mask-main">
        <el-form label-width="150px">
          <el-form-item label="广告位置：">
            <el-select v-model="adv_mask.adv_position" placeholder="请选择">
              <el-option
                v-for="item in adv_mask.adv_position_map"
                :key="item.key"
                :label="item.val"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="所选类型：">
            <el-select v-model="adv_mask.adv_type" placeholder="请选择">
              <el-option
                v-for="item in adv_mask.adv_type_map"
                :key="item.key"
                :label="item.val"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="跳转类型：">
            <el-select v-model="adv_mask.adv_pos_type" placeholder="请选择">
              <el-option
                v-for="item in adv_mask.adv_pos_type_map"
                :key="item.key"
                :label="item.val"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item required label="广告名称：">
            <el-input placeholder="请输入广告名称" v-model="adv_mask.adv_name" style="width:200px"></el-input>
          </el-form-item>
          <el-form-item label="广告内容：">
            <el-input placeholder="请输入广告内容" v-model="adv_mask.adv_content" style="width:400px"></el-input>
          </el-form-item>
          <el-form-item label="url跳转等级：">
            <el-input
              placeholder="请输入"
              maxlength="1"
              type="number"
              v-model="adv_mask.adv_url_level"
              style="width:100px"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属代理商：">
            <el-select @change="getProduct" v-model="adv_mask.agent_id" placeholder="请选择">
              <el-option
                v-for="item in adv_mask.agent_map"
                :key="item.key"
                :label="item.val"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="列表展示图(1张)：">
            <Upimg
              :exporteurl="exporteurl"
              :fileList="advImage"
              fileName="image"
              :showList="true"
              :fileHeaders="headers"
              :maxlimit="1"
              :index="1"
              @Successimg="SuccessimgArray"
            ></Upimg>
          </el-form-item>
          <el-form-item label="开始时间：">
            <el-date-picker v-model="adv_mask.start_time" type="datetime" placeholder="选择开始时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间：">
            <el-date-picker v-model="adv_mask.end_time" type="datetime" placeholder="选择结束时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="跳转链接">
            <div>链接(跳转商品链接或案例链接)：</div>

            <el-input v-model="adv_mask.adv_skip" style="width: 300px"></el-input>

            <!-- <div style="margin-top:20px">商品ID(商品案例二选一)：</div>

            <el-select v-model="adv_mask.adv_skip_id" placeholder="请先选择代理区域">
              <el-option
                v-for="item in adv_mask.product"
                :key="item.key"
                :label="item.val"
                :value="item.key"
              ></el-option>
            </el-select>

            <div style="margin-top:20px">案例ID(商品案例二选一)</div>

            <el-select v-model="adv_mask.adv_skip_case" placeholder="请先选择代理区域">
              <el-option
                v-for="item in adv_mask.decoration"
                :key="item.key"
                :label="item.val"
                :value="item.key"
              ></el-option>
            </el-select>-->
          </el-form-item>
          <el-form-item label="状态：">
            <el-radio-group v-model="adv_mask.adv_status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="2">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAdv, // 获取广告
  addAdv, // 添加广告
  getAdvProduct, // 根据代理商获取商品/案例
  commitAdv, // 提交修改
  deleteAdv, // 删除广告
  editAdv
} from "@/api/advertising";
import { pickerOptions, parseTime } from "@/utils/index";
import { exporteurl } from "@/utils/user";
import { upimg } from "@/api/user";
import Upimg from "@/components/Upimg";
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
      action: [],
      multipleSelection: [],
      coupon_id: "",
      keyword: "",
      status: "",
      status_map: [],
      dataList: [], // 数据
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      loading: false,
      adv_mask: {
        show: false, // 是否显示
        adv_position: "", //	广告位置
        start_time: "", //	开始时间
        end_time: "", // -- 结束时间
        adv_img: "", // -- 广告图
        adv_skip: "", // -- 广告跳转连接
        adv_skip_id: "", // -商品ID
        adv_status: 1, // 1:启用2：禁用
        adv_name: "", // 广告名称
        adv_content: "", // 广告内容
        adv_type: "", // 1:Banner图 2：广告
        agent_id: "", // 代理商ID
        adv_pos_type: "", //	跳转类型
        adv_url_level: "", //	url跳转等级
        adv_skip_case: "", // 案例ID
        adv_id: "", //	广告主键ID 修改时候必填
        adv_position_map: [], //广告位置列表
        adv_type_map: [], // 广告类型列表
        adv_pos_type_map: [], // 跳转类型列表
        agent_map: [], // 代理商列表
        product: [], // 商品列表
        decoration: [] // 案例列表
      }
    };
  },
  created() {
    this.coupon_id = this.$route.query.coupon_id;
    console.log(this.coupon_id);
    this.getData();
  },
  methods: {
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

    /**
     * 获取数据
     */
    getData() {
      this.loading = true;
      getAdv({
        status: this.status,
        page: this.page,
        limit: this.limit,
        keyword: this.keyword
      })
        .then(res => {
          if (res.code == 1) {
            this.action = res.action;
            this.status_map = res.data.status_map;
            this.dataList = res.data.list;
            this.total = res.data.count;
            this.loading = false;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message.error("连接服务器出现异常");
        });
    },

    /**
     * 导出表格
     */
    exportExcel() {
      let exportUrl = exportcouponDetail({
        coupon_id: this.coupon_id,
        coupon_code_number: this.keyword,
        coupon_code_stauts: this.status
      });
      window.open(exportUrl);
    },

    // 添加广告
    addAdv() {
      this.adv_mask.show = true;
      addAdv()
        .then(res => {
          if (res.code === 1) {
            this.adv_mask.show = true;
            Object.assign(this.adv_mask, res.data);
          } else {
            this.$message.warning("连接出错" + res.msg);
          }
        })
        .catch(err => {
          this.$messae.error("连接服务器出错");
        });
    },

    /**
     * 修改广告
     * @param {String/Number} id  广告Id
     */
    editAdv(id) {
      editAdv({
        adv_id: id
      })
        .then(res => {
          if (res.code === 1) {
            this.adv_mask.show = true;
            Object.assign(this.adv_mask, res.data[0]);
          } else {
            this.$message.error("获取广告详情出错! error: " + res.msg);
          }
        })
        .catch(res => {
          this.$message.error("连接服务器出现异常");
        });
    },

    // 根据代理商Id获取商品/案例数据
    getProduct() {
    //   if (!this.adv_mask.agent_id) {
    //     this.$message.warning("未检测到代理区域, 请重试");
    //     return;
    //   }

    //   this.adv_mask.product = this.adv_mask.decoration = [];

    //   getAdvProduct({
    //     agent_id: this.adv_mask.agent_id
    //   }).then(res => {
    //     if (res.code === 1) {
    //       this.adv_mask.product = res.data.product;
    //       this.adv_mask.decoration = res.data.decoration;
    //     } else {
    //       this.$message.error(res.msg);
    //     }
    //   });
    },
    commitAdv() {
      let data = Object.assign({}, this.adv_mask) ;
      data.agent_map = '';
      data.adv_position_map = '';
      data.adv_pos_type_map = '';
      data.adv_type_map = '';
      data.start_time = parseTime(data.start_time || '');
      data.end_time = parseTime(data.end_time || '');
      commitAdv(data)
        .then(res => {
          if (res.code === 1) {
            this.$message.success("操作成功");
            this.getData();
            this.closeAdv();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(error => {
          this.$message.error("连接服务器错误");
        });
    },
    /**
     * 删除广告
     * @param {String/Number} id 广告Id
     */
    deleteAdv(id) {
      deleteAdv({
        adv_id: id
      }).then(res => {
        if (res.code === 1) {
          this.$message.success("删除成功");
          this.getData();
        } else {
          this.$message.error("删除失败" + res.msg);
        }
      });
    },
    // 关闭广告弹窗
    closeAdv() {
      this.adv_mask = {
        show: false, // 是否显示
        adv_position: "", //	广告位置
        start_time: "", //	开始时间
        end_time: "", // -- 结束时间
        adv_img: "", // -- 广告图
        adv_skip: "", // -- 广告跳转连接
        adv_skip_id: "", // -商品ID
        adv_status: 1, // 1:启用2：禁用
        adv_name: "", // 广告名称
        adv_content: "", // 广告内容
        adv_type: "", // 1:Banner图 2：广告
        agent_id: "", // 代理商ID
        adv_pos_type: "", //	跳转类型
        adv_url_level: "", //	url跳转等级
        adv_skip_case: "", // 案例ID
        adv_id: "", //	广告主键ID 修改时候必填
        adv_position_map: [], //广告位置列表
        adv_type_map: [], // 广告类型列表
        adv_pos_type_map: [], // 跳转类型列表
        agent_map: [], // 代理商列表
      
        product: [], // 商品列表
        decoration: [] // 案例列表
      };
    },
    // 图片上传成功
    SuccessimgArray(e) {
      try {
        this.adv_mask.adv_img = e.imgArray[0] ? e.imgArray[0].imgPath : "";
        this.adv_mask.adv_img_url = e.imgArray[0] ? e.imgArray[0].url : "";
      } catch (error) {
        console.log("上传图片出现错误！", error);
      }
    }
  },
  computed: {
    advImage() {
      let arr = [];
      if (this.adv_mask.adv_img && this.adv_mask.adv_img_url) {
        arr.push({
          name: "",
          imgPath: this.adv_mask.adv_img,
          url: this.adv_mask.adv_img_url
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
}
.block {
  margin-top: 20px;
}
.handle {
  margin-bottom: 40px;
}

.mask-main {
  max-height: 65vh;
  overflow-y: scroll;
}
</style>