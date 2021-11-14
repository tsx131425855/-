<!-- tsx 户型管理  -->
<template>
  <div class="package">
    <div class="hide backtsx">
      <el-button type="primary" size="small" @click="isshowhide(1)">添加户型</el-button>
      <!-- <el-button type="primary" size="small" @click="isshowhide(0)">隐藏</el-button> -->
      <span class="gaosizuobian">所属代理</span>
      <el-select v-model="agent_id" size="small" class="gaosizuobian" placeholder="请选择">
        <el-option
          v-for="item in agent"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>

      <el-input
        v-model="keyword"
        size="small"
        class="input gaosizuobian"
        prefix-icon="el-icon-search"
        placeholder="楼盘名称"
      />
      <el-button
        type="success"
        size="small"
        class
        @click="page=1,getDatalist()"
        icon="el-icon-search"
      >查询</el-button>
    </div>
    <!-- 列表 -->
    <template>
      <el-table v-loading="loading" :data="datalist" border style="width: 100%">
        <el-table-column prop="property_name" label="户型图">
          <template slot-scope="scope">
            <img :src="scope.row.img_url" alt style="width:50px;height:50px" />
          </template>
        </el-table-column>
        <el-table-column prop="property_name" label="楼盘" />
        <el-table-column prop="name" label="户型名称" />
        <el-table-column prop="room" label="室" />
        <el-table-column prop="hall" label="厅" />
        <el-table-column prop="bathroom" label="卫" />
        <el-table-column prop="area" label="面积/平" />
        <el-table-column prop="add_time" label="录入时间" />
        <el-table-column prop="agent_name" label="所属代理商" />
        <el-table-column prop="visible_text" label="状态" />
        <el-table-column prop="is_show_text" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editdata(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="deletedata(scope.row)">删除</el-button>
          </template>
        </el-table-column>
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

    <PublicDialog
      v-if="closeShowView"
      :isShowVisible="closeShowView"
      tsxTitle="添加户型"
      tsxWidth="1000px"
      @handleClose="handleClose"
    >
      <el-form slot="forms" ref="property" :model="property" label-width="110px">
        <el-form-item label="户型名称">
          <el-input v-model="property.name" placeholder="户型名称" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="户型">
          <el-input v-model="property.room" style="width:200px"></el-input>
          <span>室</span>
          <el-input v-model="property.hall" style="width:200px"></el-input>
          <span>厅</span>
          <el-input v-model="property.bathroom" style="width:200px"></el-input>
          <span>卫</span>
        </el-form-item>
        <el-form-item label="面积">
          <el-input v-model="property.area" style="width:200px"></el-input>
          <span>平</span>
        </el-form-item>
        <el-form-item label="楼盘">
          <el-select
            v-model="property.property_id"
            size="small"
            style="width:300px"
            placeholder="请选择"
          >
            <el-option
              v-for="item in property_map"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="代理商">
          <el-select v-model="property.agent_id" size="small" style="width:300px" placeholder="请选择">
            <el-option
              v-for="item in agent"
              :key="item.agent_id"
              :label="item.name"
              :value="item.agent_id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="vr链接1">
          <el-input v-model="property.vr_name1" placeholder="风格" style="width:200px"></el-input>
          <el-input v-model="property.vr_link1" placeholder="vr链接" style="width:200px"></el-input>
          <Upimg
            style="margin-top:20px"
            :exporteurl="exporteurl"
            :fileList="imgarr1"
            fileName="image"
            :showList="true"
            :fileHeaders="headers"
            :maxlimit="1"
            :index="1"
            @Removeimg="SuccessimgArray"
            @Successimg="SuccessimgArray"
          />
        </el-form-item>
        <el-form-item label="vr链接2">
          <el-input v-model="property.vr_name2" placeholder="风格" style="width:200px"></el-input>
          <el-input v-model="property.vr_link2" placeholder="vr链接" style="width:200px"></el-input>
          <Upimg
            style="margin-top:20px"
            :exporteurl="exporteurl"
            :fileList="imgarr2"
            fileName="image"
            :showList="true"
            :fileHeaders="headers"
            :maxlimit="1"
            :index="2"
            @Removeimg="SuccessimgArray"
            @Successimg="SuccessimgArray"
          />
        </el-form-item>
        <el-form-item label="显示">
          <el-radio-group v-model="property.visible">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="图片">
          <div>
            <p>(一张)</p>
            <Upimg
              :exporteurl="exporteurl"
              :fileList="imgarr3"
              fileName="image"
              :showList="true"
              :fileHeaders="headers"
              :maxlimit="1"
              :index="3"
              @Removeimg="SuccessimgArray"
              @Successimg="SuccessimgArray"
            />
          </div>
        </el-form-item>

        <el-button type="primary" size="medium" style="margin-left: 80px;" @click="onSubmit">提交</el-button>
      </el-form>
    </PublicDialog>
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { layoutlists, layoutadd, layoutedit, layoutdel } from "@/api/sales";
import { MessageBoxs } from "@/utils/elementEncapsulation";
import PublicDialog from "@/components/PublicDialog";
import { exporteurl } from "@/utils/user";
import Upimg from "@/components/Upimg";
import { upimg } from "@/api/user";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { PublicDialog, Upimg },
  data() {
    // 这里存放数据
    return {
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      keyword: "",
      agent: [],
      agent_id: "0",
      loading: false,
      datalist: [],
      exporteurl: exporteurl + upimg,
      headers: {
        token: localStorage.getItem("Token"),
        enctype: "multipart/form-data",
      },
      closeShowView: false,
      property_map: [],
      property: { visible: "1" },
      imgarr1: [],
      imgarr2: [],
      imgarr3: [],
      addedit: 1,
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
        arr.push(res.agent_id);
      });
      this.multipleSelection = arr;
    },
    handleClose() {
      this.closeShowView = false;
    },
    isshowhide(is_show) {
      this.addedit = 1;
      (this.imgarr1 = []),
        (this.imgarr2 = []),
        (this.imgarr3 = []),
        (this.property = { visible: "1" }),
        (this.closeShowView = true);
    },
    editdata(row) {
      this.addedit = 2;
      this.property = row;
      this.property.agent_id = this.property.agent_id.toString();
      this.property.visible = this.property.visible.toString();
      if (row.img) {
        this.imgarr3 = [{ imgPath: row.img, name: "", url: row.img_url }];
      }
      if (row.vr_img1) {
        this.imgarr1 = [
          { imgPath: row.vr_img1, name: "", url: row.vr_img2_url },
        ];
      }
      if (row.vr_img2) {
        this.imgarr2 = [
          { imgPath: row.vr_img2, name: "", url: row.vr_img2_url },
        ];
      }
      this.closeShowView = true;
    },
    SuccessimgArray(val) {
      switch (val.index) {
        case 1:
          this.imgarr1 = val.imgArray;
          break;
        case 2:
          this.imgarr2 = val.imgArray;
          break;
        case 3:
          this.imgarr3 = val.imgArray;
          break;
      }
    },
    deletedata(row) {
      MessageBoxs({
        that: this,
        message: "是否确认删除？ ",
      }).then((res) => {
        if (res == true) {
          layoutdel({ id: row.id }).then((res) => {
            if (res.code == 1) {
              this.page = 1;
              this.getDatalist();
              this.$message.success(res.msg);
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    onSubmit() {
      let data = this.property;
      data["vr_img1"] = this.imgarr1.length > 0 ? this.imgarr1[0].imgPath : "";
      data["vr_img2"] = this.imgarr2.length > 0 ? this.imgarr2[0].imgPath : "";
      data["img"] = this.imgarr3.length > 0 ? this.imgarr3[0].imgPath : "";
      if (this.addedit == 1) {
        layoutadd(data).then((res) => {
          if (res.code == 1) {
            this.page = 1;
            this.getDatalist();
            this.closeShowView = false;
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        layoutedit(data).then((res) => {
          if (res.code == 1) {
            this.page = 1;
            this.getDatalist();
            this.closeShowView = false;
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },
    getDatalist() {
      const that = this;
      const data = {
        agent_id: this.agent_id,
        keyword: this.keyword,
        page: this.page,
        limit: this.limit,
      };
      return new Promise((resolve, reject) => {
        layoutlists(data).then((res) => {
          if (res.code == 1) {
            that.datalist = res.data.list;
            that.total = res.data.total;
            that.agent = res.agent_map;
            that.property_map = res.data.property_map;
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
</style>
