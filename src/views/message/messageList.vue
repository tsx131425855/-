<template>
  <!-- 运营活动列表 -->
  <div class="root">
    <div style=" display: flex;justify-content: space-between;margin-bottom: 20px;">
      <div>
        <el-button
          icon="el-icon-plus"
          size="medium"
          type="primary"
          @click="message_mask.show = true"
        >新建</el-button>
        <!-- <el-button icon="el-icon-edit" size="medium" type="warning" @click="page=1;getData(); ">修改</el-button> -->
        <el-button icon="el-icon-delete" size="medium" type="info" @click="deleteMessage ">删除</el-button>
      </div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="消息内容:">
          <el-input placeholder="请输入消息内容" v-model="keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            size="medium"
            icon="el-icon-search"
            type="success"
            @click="page=1;getData(); "
          >查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <template>
      <el-table
        v-loading="loading"
        :data="dataList"
        border
        stripe
        max-height="70vh"
        fit
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed align="center" type="selection" width="55"></el-table-column>
        <el-table-column align="center" prop="create_time" label="操作">
          <template slot-scope="scope">
            <span @click="openMessageMask(scope.row.msg_id)" class="routeLike">查看</span>
          </template>
        </el-table-column>
        <!-- <el-table-column fixed align="center" prop="service_id" label="售后ID" /> -->
        <el-table-column align="center" prop="msg_title" min-width="200" label="通知标题" />
        <el-table-column align="center" label="发送对象">
          <template slot-scope="scope">
            <span>{{ scope.row.msg_toobject === 1 ? '全体用户' : (scope.row.msg_toobject === 2 ? '超级会员' : '商家')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="发送端">
          <template slot-scope="scope">
            <span>{{ scope.row.to_client_type === 1 ? '用户端' : (scope.row.msg_toobject === 2 ? '管家端' : '商家端')}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" sortable min-width="160" prop="create_time" label="创建时间" />
        <el-table-column align="center" sortable min-width="160" prop="msg_totime" label="发送时间" />
        <el-table-column align="center" label="启用状态">
          <template slot-scope="scope">
            <span>{{ scope.row.send_status === 1 ? '等待发送' : '已发送' }}</span>
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

    <!-- 添加商品 -->
    <el-dialog
      center
      :title="message_mask.msg_id ? '修改通知消息' : '添加通知消息'"
      :visible.sync="message_mask.show"
      top="50px"
      class="mask"
      :close-on-click-modal="false"
      :before-close="closeMessageMask"
    >
      <div
        style="display:flex; justify-content:flex-end; padding-bottom: 10px; margin-bottom: 20px; border-bottom: 1px solid #f5f5f5"
      >
        <el-button size="medium" @click="saveMessage" type="success">保存</el-button>
        <el-button size="medium" @click="closeMessageMask" type="info">关闭</el-button>
      </div>
      <div class="dialog">
        <el-form @submit.native.prevent>
          <el-form-item label="消息类型: ">
            <span>系统通知</span>
          </el-form-item>
          <el-form-item label="代理地区: ">
            <el-select v-model="message_mask.agent_id" placeholder="请选择">
              <el-option
                v-for="item in message_mask.agent_list"
                :key="item.agent_id"
                :label="item.name"
                :value="item.agent_id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="通知标题: ">
            <el-input style="width: 300px" v-model="message_mask.msg_title" placeholder="请输入通知标题"></el-input>
          </el-form-item>
          <el-form-item label="发送时间: ">
            <el-date-picker v-model="message_mask.msg_totime" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="消息内容: ">
            <el-input
              style="width: 400px"
              maxlength="300"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入消息内容"
              v-model="message_mask.msg_remark"
            ></el-input>
          </el-form-item>
          <el-form-item label="通知主图: (非必填)">
            <div style="width: 100%; color:#8e8e8e;font-weight: 600">(图片尺寸: 630*360)</div>
            <Upimg
              style="margin:10px 0 20px 70px;"
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
          <el-form-item label="首页播报:">
            <el-radio-group style="margin-top:10px;" v-model="message_mask.home_show">
              <div class="radio-item">
                <el-radio :label="1">否</el-radio>
              </div>
              <div class="radio-item">
                <el-radio :label="2">是</el-radio>
                <div>播放时长</div>
                <el-input
                  style="width:160px;margin: 0 10px; "
                  placeholder="请输入"
                  v-model="message_mask.home_hour"
                >
                  <template slot="append">小时</template>
                </el-input>
                <div>(以发送时间播报开始时间)</div>
              </div>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="消息跳转:">
            <el-radio-group v-model="message_mask.msg_url_type">
              <div class="radio-item">
                <el-radio :label="1">指定商品</el-radio>
                <el-input
                  :disabled="message_mask.msg_url_type != 1"
                  v-model="message_mask.product_id"
                  style="width:250px"
                  placeholder="请输入指定商品Id"
                ></el-input>
              </div>
              <div class="radio-item">
                <el-radio :label="2">指定商家</el-radio>
                <el-input
                  :disabled="message_mask.msg_url_type != 2"
                  v-model="message_mask.store_id"
                  style="width:250px"
                  placeholder="请输入指定商家Id"
                ></el-input>
              </div>
              <div class="radio-item">
                <el-radio :label="3">指定楼盘</el-radio>
                <el-input
                  :disabled="message_mask.msg_url_type != 3"
                  v-model="message_mask.house_id"
                  style="width:250px"
                  placeholder="请输入指定楼盘Id"
                ></el-input>
              </div>
              <div class="radio-item">
                <el-radio :label="4">自定义跳转链接</el-radio>
                <el-input
                  :disabled="message_mask.msg_url_type != 4"
                  v-model="message_mask.url"
                  style="width:400px"
                  placeholder="请输入链接地址"
                ></el-input>
              </div>
              <div class="radio-item">
                <el-radio :label="5">无跳转</el-radio>
              </div>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="发送对象:">
            <el-radio-group v-model="message_mask.msg_toobject">
              <el-radio :label="1">全体用户</el-radio>
              <el-radio :label="2">超级会员</el-radio>
              <el-radio :label="3">商家</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="发送端至:">
            <el-radio-group v-model="message_mask.to_client_type">
              <el-radio :label="1">用户端</el-radio>
              <el-radio :label="2">管家端</el-radio>
              <el-radio :label="3">商家端</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addMessage,
  getMessageInfo,
  commitMessage,
  getMessage,
  deleteMessage
} from "@/api/message";
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
      loading: false,
      message_mask: {
        msg_id: "",
        show: false, // 是否显示
        agent_id: "", // 代理地区id
        agent_list: [], // 代理地区列表
        msg_title: "", // 消息标题
        msg_totime: "", // 发送时间
        msg_remark: "", // 消息内容
        msg_image: "", // 消息主图cdn路径
        msg_image_url: "", // 消息主图全路径
        msg_url: "", // 跳转地址
        msg_url_type: "", // 跳转类型
        product_id: "", // 跳转商品id
        store_id: "", // 跳转商家id
        house_id: "", // 跳转楼盘id
        url: "", // 自定义跳转地址
        home_show: 1,
        home_hour: "",
        to_client_type: 1,
        msg_toobject: 1 // 发送对象
      }
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

    /**
     * 获取数据
     */
    getData() {
      this.loading = true;
      getMessage({
        // status: this.status,
        page: this.page,
        limit: this.limit,
        keyword: this.keyword,
        start_date:
          this.timeOut && this.timeOut[0] ? parseTime(this.timeOut[0]) : "",
        end_date:
          this.timeOut && this.timeOut[1] ? parseTime(this.timeOut[1]) : ""
      })
        .then(res => {
          if (res.code == 1) {
            this.action = res.action;
            this.status_map = res.data.status_map;
            this.dataList = res.data.list;
            this.total = res.data.total;
            this.loading = false;
            this.message_mask.agent_list = res.data.agent_list;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message.error("连接服务器出现异常");
        });
    },

    /**
     * 删除消息
     */
    deleteMessage() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请先选中需要删除的通知消息");
        return;
      }
      this.$confirm("此操作将删除选中的通知消息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(res => {
        deleteMessage({
          msg_ids: this.multipleSelection.map(item => item.msg_id)
        }).then(res => {
          if (res.code === 1) {
            this.$message.success("删除成功!");
            this.getData();
          } else {
            this.$message.error("删除失败! error:" + res.msg);
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

    /**
     * 打开消息通知详情弹窗
     * @param {Number} id 消息通知Id
     */
    openMessageMask(id) {
      getMessageInfo({
        msg_id: id
      }).then(res => {
        if (res.code === 1) {
          let data = res.data;
          data.show = true;

          switch (data.msg_url_type) {
            case 1:
              data.product_id = data.msg_url;
              break;
            case 2:
              data.store_id = data.msg_url;
              break;
            case 3:
              data.house_id = data.msg_url;
              break;
            case 4:
              data.url = data.msg_url;
              break;
            case 5:
              data.msg_url = "";
              break;
            default:
              data.msg_url = "";
              break;
          }
          data.msg_totime = data.msg_totime * 1000;
          Object.assign(this.message_mask, data);
        } else {
          this.$message.error("获取消息详情出错! error:" + res.msg);
        }
      });
    },

    // 图片上传成功
    SuccessimgArray(e) {
      try {
        this.message_mask.msg_image_url = e.imgArray[0]
          ? e.imgArray[0].url
          : "";
        this.message_mask.msg_image = e.imgArray[0]
          ? e.imgArray[0].imgPath
          : "";
      } catch (error) {
        console.log("上传图片出现错误！", error);
      }
    },

    /**
     * 保存修改/添加的消息详情
     */
    saveMessage() {
      /**
       * 获取弹窗中所有的设置参数(不改动字段, 保持和后台传输的统一)
       * 并去掉agent_list. 保证代理商数据的安全简洁性
       */
      let data = {};
      Object.assign(data, this.message_mask);
      data.agent_list = "";
      data.msg_totime = parseTime(data.msg_totime);
      /*
        product_id: "", // 跳转商品id
        store_id: "", // 跳转商家id
        house_id: "", // 跳转楼盘id
        url: "", // 自定义跳转地址
      */

      switch (data.msg_url_type) {
        case 1:
          data.msg_url = data.product_id;
          break;
        case 2:
          data.msg_url = data.store_id;
          break;
        case 3:
          data.msg_url = data.house_id;
          break;
        case 4:
          data.msg_url = data.url;
          break;
        case 5:
          data.msg_url = "";
          break;
        default:
          data.msg_url = "";
          break;
      }

      /**
       * 如果数据中msg_id存在, 即说明此为编辑操作, 反之新增操作
       */
      if (data.msg_id) {
        commitMessage(data).then(res => {
          if (res.code === 1) {
            this.$message.success("保存成功!");
            this.closeMessageMask();
            this.getData();
          } else {
            this.$message.error("保存失败! erro:" + res.msg);
          }
        });
      } else {
        addMessage(data).then(res => {
          if (res.code === 1) {
            this.$message.success("保存成功!");
            this.closeMessageMask();
            this.getData();
          } else {
            this.$message.error("保存失败! erro:" + res.msg);
          }
        });
      }
    },
    /**
     * 关闭消息通知详情弹窗并且重置弹窗数据
     */
    closeMessageMask() {
      this.message_mask = {
        msg_id: "",
        show: false, // 是否显示
        agent_id: "", // 代理地区id
        msg_title: "", // 消息标题
        msg_totime: "", // 发送时间
        agent_list: this.message_mask.agent_list, // 代理商列表不变
        msg_remark: "", // 消息内容
        msg_image: "", // 消息主图cdn路径
        msg_image_url: "", // 消息主图全路径
        msg_url: "", // 跳转地址
        msg_url_type: "", // 跳转类型
        product_id: "", // 跳转商品id
        store_id: "", // 跳转商家id
        house_id: "", // 跳转楼盘id
        url: "", // 自定义跳转地址
        home_show: 1,
        msg_toobject: 1, // 发送对象
        to_client_type: 1
      };
    },

    // 重置筛选条件
    reset() {
      this.agent_id = "";
      this.keyword = "";
      this.status = "";
      this.timeOut = [];
      this.getData();
    }
  },
  computed: {
    imgArr() {
      let arr = [];
      if (this.message_mask.msg_image_url && this.message_mask.msg_image) {
        arr.push({
          name: "",
          imgPath: this.message_mask.msg_image,
          url: this.message_mask.msg_image_url
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
  box-sizing: border-box;
}
.block {
  margin-top: 20px;
}
.handle {
  margin-bottom: 40px;
}

.routeLike {
  color: dodgerblue;
  margin: 5px 10px;
  &:hover {
    color: burlywood;
    cursor: pointer;
  }
}
.dialog {
  max-height: 68vh;
  overflow-y: scroll;
}
.radio-item {
  margin: 20px 0;
  font-size: 14px;
  display: flex;
  align-items: center;
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