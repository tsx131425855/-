<template>
  <!-- 运营活动列表 -->
  <div class="root">
    <div style="margin-bottom: 30px;">
      <el-button type="success" @click="addActivity" size="medium">新增活动</el-button>
      <el-button type="info" @click="copyActivity" size="medium">复制</el-button>
    </div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="代理商:">
        <el-select v-model="agent_id" placeholder="请选择">
          <el-option
            :label="item.name"
            v-for="(item, index) in agent_map"
            :key="index"
            :value="item.agent_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间:">
        <el-date-picker
          v-model="timeOut"
          style="width: 450px"
          align="center"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="状态:">
        <el-select v-model="status" placeholder="请选择">
          <el-option :label="item" v-for="(item, index) in status_map" :key="index" :value="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="广告Id/名称:">
        <el-input placeholder="请输入id/名称" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="page=1;getData(); ">查询</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <template>
      <el-table
        v-loading="loading"
        :data="dataList"
        border
        stripe
        height="65vh"
        fit
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed align="center" type="selection" width="55"></el-table-column>

        <!-- <el-table-column fixed align="center" prop="service_id" label="售后ID" /> -->
        <el-table-column fixed align="center" prop="id" width="60" label="活动id" />
        <el-table-column fixed align="center" prop="name" min-width="160" label="活动名称" />

        <el-table-column align="center" sortable width="160" prop="start_date" label="开始时间" />
        <el-table-column align="center" sortable width="160" prop="end_date" label="结束时间" />
        <el-table-column align="center" prop="agent_name" label="代理商" />
        <el-table-column align="center" prop="status_text" label="状态" />
        <el-table-column align="center" width="200" prop="create_time" label="操作">
          <template slot-scope="scope">
            <div>
              <router-link
                class="routeLike"
                :to="{ path: `/runActivityDetail?id=${scope.row.id}&type=1`}"
              >查看</router-link>
              <router-link
                class="routeLike"
                :to="{ path: `/runActivityDetail?id=${scope.row.id}&type=2`}"
              >编辑</router-link>

              <span class="routeLike" @click="copyUrl(scope.row.url)">复制链接</span>
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
  </div>
</template>

<script>
import {
  getActivity, // 获取活动列表
  copyActivity
} from "@/api/run_activity";
import { pickerOptions, parseTime } from "@/utils/index";
export default {
  data() {
    return {
      action: [],
      multipleSelection: [],
      agent_id: "", // 代理商id
      agent_map: [], // 代理商列表
      coupon_id: "",
      keyword: "",
      status: "",
      status_map: [],
      timeOut: [], // 时间段数据
      dataList: [], // 数据
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      loading: false
    };
  },
  created() {
    this.getData();
  },
  methods: {
    handleCurrentChange(val) {
      // 页数
      this.page = val;
      // console.log(`当前页: ${val}`);
      this.getData();
    },
    handleSizeChange(val) {
      this.limit = val;
      // console.log(`每页 ${val} 条`);
      this.page = 1;
      this.getData();
    },
    handleSelectionChange(val) {
      /** 选中 */
      // console.log(val);
      this.multipleSelection = val;
    },
    addActivity() {
      this.$router.push(`/runActivityDetail?id=&type=2`);
    },
    /**
     * 获取数据
     */
    getData() {
      this.loading = true;
      getActivity({
        agent_id: this.agent_id,
        status: this.status,
        page: this.page,
        limit: this.limit,
        keyword: this.keyword,
        start_time:
          this.timeOut && this.timeOut[0] ? parseTime(this.timeOut[0]) : "",
        end_time:
          this.timeOut && this.timeOut[1] ? parseTime(this.timeOut[1]) : ""
      })
        .then(res => {
          if (res.code == 1) {
            this.action = res.action;
            this.status_map = res.data.status_map;
            this.agent_map = res.data.agent_map;
            this.dataList = res.data.list;
            this.total = res.data.total;
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
     * 复制活动
     */
    copyActivity() {
      this.$confirm("将复制选中的活动, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        copyActivity({
          event_ids: this.multipleSelection.map(item => item.id)
        }).then(res => {
          if (res.code === 1) {
            this.$message.success(res.msg);
            this.page = 1;
            this.getData();
          } else {
            this.$message.error("复制活动失败! error:" + res.msg);
          }
        });
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

    // 重置筛选条件
    reset() {
      this.agent_id = "";
      this.keyword = "";
      this.status = "";
      this.timeOut = [];
      this.getData();
    },

    /**
     * 复制活动链接
     * @param {String/Number} url 活动链接
     */
    copyUrl(url) {
      this.$copyText(url).then(
        res => {
          // console.log(res);
          this.$message.success("已复制至剪贴板");
        },
        err => {
          this.$message.success("复制失败");
          console.log("复制失败 error:", err);
        }
      );
    }
  },

  computed: {}
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
.routeLike {
  color: dodgerblue;
  margin: 5px 10px;
  &:hover {
    color: burlywood;
    cursor: pointer;
  }
}
</style>