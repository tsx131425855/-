<template>
  <div class="root">
    <div class="filter">
      <!-- <div class="handleBtn">
        <el-button type="info" icon="el-icon-download">下载</el-button>
        <el-button type="success" icon="el-icon-view">显示</el-button>
        <el-button type="warning" icon="el-icon-warning">不显示</el-button>
      </div>-->
      <div class="condition">
        <el-form :inline="true" label-width="100px" @submit.native.prevent>
          <el-form-item label="状态：">
            <el-select disabled v-model="status" placeholder="暂未开放此搜索功能">
              <el-option
                v-for="item in statu_map"
                :label="item.value"
                :value="item.key"
                :key="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="直播标题：">
            <el-input v-model="title" disabled placeholder="暂未开放此搜索功能"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="medium" type="primary" @click="getData" icon="el-icon-search">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <template>
      <el-table
        v-loading="loading"
        :data="dataList"
        border
        stripe
        fit
        @selection-change="val => { this.multipleSelection = val; }"
      >
        <el-table-column fixed align="center" type="selection" width="55"></el-table-column>

        <!-- <el-table-column fixed align="center" prop="service_id" label="售后ID" /> -->
        <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
        <el-table-column align="center" prop="roomid" label="编号">
          <template>{{ room_id }}</template>
        </el-table-column>
        <el-table-column align="center" min-width="200" prop="name" label="直播房间名">
          <template>{{ name }}</template>
        </el-table-column>

        <el-table-column
          align="center"
          sortable
          min-width="160"
          prop="create_time"
          label="(实际)开始时间"
        />
        <el-table-column
          align="center"
          sortable
          min-width="160"
          prop="expire_time"
          label="(实际)结束时间"
        />
        <el-table-column align="center" min-width="200" prop="anchor_name" label="主播昵称">
          <template>{{ anchor_name }}</template>
        </el-table-column>
        <!-- <el-table-column align="center" prop="coupon_money" label="主播微信账号" /> -->
        <el-table-column align="center" label="下载">
          <template slot-scope="scope">
            <a
              target="_blank"
              @click="goDow(scope.row.media_url)"
              :download="name + '·' + anchor_name + scope.$index + '.mp4'"
              :href="  replaceUrl(scope.row.media_url)"
            >查看</a>
            <!-- <a
              target="_blank"
              @click="goDow(scope.row.media_url)"
            >查看</a>-->
          </template>
        </el-table-column>

        <!-- <el-table-column align="center" prop="create_time" label="二级代理商抽成"></el-table-column> -->
        <!-- <el-table-column align="center" prop="create_time" label="三级代理商抽成"></el-table-column>-->
      </el-table>
    </template>
    <!-- <div class="block">
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 30, 40,50]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>-->
  </div>
</template>

<script>
import { getRePlay } from "@/api/livePlay";
export default {
  data() {
    return {
      name: "", // 房间名
      anchor_name: "", // 主播名
      dataList: [],
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      loading: false,
      multipleSelection: [],
      statu_map: [], // 状态列表
      status: "", // 状态
      title: "" // 直播标题
    };
  },
  created() {
    this.room_id = this.$route.query.room_id || "";
    this.name = this.$route.query.name || "";
    this.anchor_name = this.$route.query.anchor_name || "";
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      getRePlay({ limit: 100, room_id: this.room_id }).then(res => {
          this.loading = false;
        if (res.code == 1) {
          this.dataList = res.data.live_replay;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    /**
     * 剔除url中的。
     */
    replaceUrl(url) {
      url.replace(/\./, "mg");
      return url;
    },
    goDow(media_url) {
      // window.location.href =  media_url;
      let video = document.createElement("video");
      video.src = media_url;
      console.dir(video);
      // video.dispatchEvent('progress');
      // video.progress();
    }
  },
  filters: {
    /**
     * 直播状态code转文本
     */
    statusCodeToText(code) {
      if (!code) return "无";
      switch (code) {
        case 101:
          return "直播中";
        case 102:
          return "未开始";
        case 103:
          return "已结束";
        case 104:
          return "禁播";
        case 105:
          return "暂停中";
        case 106:
          return "异常";
        case 107:
          return "过期";
        default:
          return "未知";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.root {
  padding: 40px;
  .filter {
    display: flex;
    justify-content: space-between;
    // justify-content: flex-end;
  }
}
.goReplay {
  color: rgb(46, 168, 121);
  &:hover {
    color: darkgoldenrod;
  }
}
</style>