
<template>
  <div v-if="datalist" class="package">
    <div v-if="role!=2&&role!=3">
      <el-select
        v-if="agent.length>0"
        v-model="agent_id"
        class="maright"
        placeholder="请选择"
        @change="agentSele"
      >
        <el-option
          v-for="item in agent"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>
      <div class="hide">
        <ul class="titele">
          <li>
            <span class="tile">{{ datalist.user_month_total }}</span>
            <span>本月新增会员数</span>
          </li>
          <li>
            <span class="tile">{{ datalist.order_month_total }}</span>
            <span>本月订单总数</span>
          </li>
          <li>
            <span class="tile">{{ datalist.order_month_amount }}</span>
            <span>本月订单总额</span>
          </li>
          <li>
            <span class="tile">{{ datalist.tk_order_month_total }}</span>
            <span>本月退款订单数</span>
          </li>
          <li>
            <span class="tile">{{ datalist.tk_order_month_amount }}</span>
            <span>本月退款总额</span>
          </li>
        </ul>
      </div>
      <div class="sorts hide" style="justify-content: space-around;">
        <div v-for="(item,index) in datalist.list" :key="index" class="maxPackage">
          <div class="upper">
            <div class="Capitulum">
              <span>{{ item.group_five_name }}</span>
              <span
                v-if="item.group_five>0"
                class="bai"
              >({{ item.group_five==0?'':item.group_five }})</span>
            </div>
          </div>
          <div class="gezi">
            <div>
              <span class="tuchu">{{ item.group_one }}</span>
              <span>{{ item.group_one_name }}</span>
              <!-- <span v-if="item.is_show_num==1">{{item.group_one}}/{{item.group_five}}</span> -->
            </div>
            <div class="upRight">
              <span class="tuchu">{{ item.group_two }}</span>
              <span>{{ item.group_two_name }}</span>
              <!-- <span v-if="item.is_show_num==1">{{item.group_two}}/{{item.group_five}}</span> -->
            </div>

            <!-- <div v-if="item.group_four_name.length>0" class="teshu"> -->
            <div class="bottLfet">
              <span class="tuchu">{{ item.group_three }}</span>
              <span>{{ item.group_three_name }}</span>
              <span v-if="item.is_show_num==1">{{ item.group_three }}/{{ item.group_five }}</span>
            </div>
            <div v-if="item.group_four_name.length>0" class="bott">
              <span class="tuchu">{{ item.group_four }}</span>
              <span>{{ item.group_four_name }}</span>
              <!-- <span v-if="item.is_show_num==1">{{item.group_four}}/{{item.group_five}}</span> -->
            </div>
            <!-- </div> -->

            <!-- <div v-else class="teshu">
            <div class="yige">
              <span class="tuchu">{{item.group_three}}</span>
              <span>{{item.group_three_name}}</span>
              <span>{{item.group_three}}/{{item.group_five}}</span>
            </div>
            </div>-->
          </div>
        </div>
      </div>
    </div>
    <div v-else class="hide">
      <!-- <el-select
        v-if="agent.length>0"
        v-model="agent_id"
        class="maright"
        @change="agentSele"
        placeholder="请选择"
      >
        <el-option
          v-for="item in agent"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        />
      </el-select>-->
      <ul class="titele" v-for="(item,index) in datalist.list" :key="index">
        <li>
          <span class="tile">{{ item.group_one }}</span>
          <span>{{ item.group_one_name }}</span>
        </li>
        <li>
          <span class="tile">{{ item.group_two }}</span>
          <span>{{ item.group_two_name }}</span>
        </li>
        <li>
          <span class="tile">{{ item.group_three }}</span>
          <span>{{ item.group_three_name }}</span>
        </li>
        <li>
          <span class="tile">{{ item.group_four }}</span>
          <span>{{ item.group_four_name }}</span>
        </li>
        <li>
          <span class="tile">{{ item.group_five }}</span>
          <span>{{ item.group_five_name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { consoleList } from "@/api/user";
import { mapGetters } from "vuex";
import { openDB, newdb } from "@/utils/indexdb";
import qqMap from "@/components/qqMap";
export default {
  name: "Dashboard",
  components: { qqMap },
  data() {
    // 这里存放数据
    return {
      options: [
        { key: "1", val: "有效粉丝" },
        { key: "2", val: "失效粉丝" }
      ],
      limit: parseInt(localStorage.getItem("limit")) || 10,
      total: 0,
      page: 1,
      keyword: "",
      datalist: "",
      status: "1",
      agent: [],
      agent_id:
        JSON.parse(localStorage.getItem("user")).agent_id == 1
          ? ""
          : JSON.parse(localStorage.getItem("user")).agent_id,
      multipleSelection: [],
      role: ""
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"])
  },
  created() {
    this.getData();
    openDB("tsx", 1);
    newdb();
  },
  methods: {
    agentSele() {
      this.getData();
    },
    getData() {
      const data = { agent_id: this.agent_id };
      const that = this;
      return new Promise((resolve, reject) => {
        consoleList(data).then(res => {
          console.log(res);
          if (res.code == 1) {
            that.datalist = res.data;
            if (res.agent_map) {
              that.agent = res.agent_map;
            }
            that.role = res.role;
          } else if (res.code === 2) {
            that.$message.error(res.msg);
          } else {
            that.datalist = null;
            that.$message.error(res.msg);
          }
        });
        resolve();
      }).catch(error => {
        console.log(error);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/styles/hide.scss";
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.titele {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: #ffffff;
  border-radius: 16px;
  height: 130px;
  li {
    width: 20%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
    font-size: 24px;
    color: rgba(102, 102, 102, 1);
    // border-right: 1px solid #cccccc;
    .tile {
      font-size: 36px;
      font-weight: bold;
      color: rgba(0, 0, 0, 1);
    }
    &:last-child {
      border: none;
    }
  }
  li:hover {
    background-color: rgb(105, 156, 206);
  }
}
.sorts {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: center;
  .maxPackage {
    width: 380px;
    height: 268px;
    border: 1px solid #cccccc;
    margin-bottom: 40px;
    border-radius: 16px;
    background-color: #ffffff;
    .upper {
      width: 100%;
      height: 50px;
      // position: relative;
      // background-color: rgb(105, 156, 206);
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      .Capitulum {
        // position: absolute;
        // left: 50%;
        // top: -25px;
        // margin-left: -50px;
        // border-radius: 50%;
        width: 90%;
        height: 50px;
        border-bottom: 1px solid rgba(240, 242, 245, 1);
        display: flex;
        // flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        // background-color: rgb(105, 156, 206);
        // border: 3px solid #ffffff;
        span {
          // text-align: center;
          font-size: 18px;
          color: rgba(102, 102, 102, 1);
        }
        .bai {
          // color: #ffffff;
          // font-size: 22px;
        }
      }
    }
    .gezi {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      height: 200px;

      span {
      }
      .tuchu {
        font-size: 24px;
        font-weight: bold;
        color: rgba(0, 0, 0, 1);
      }
      > div {
        width: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100px;
      }
      .teshu {
        width: 100%;

        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        > div {
          height: 100px;
          width: 49.8%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .yige {
          // border-top: 1px solid #cccccc;
          // width: 100%;
        }
      }
      .bottLfet {
        // border-top: 1px solid #cccccc;
        // border-right: 1px solid #cccccc;
      }
      .upRight {
        // border-left: 1px solid #cccccc;
      }
      .bott {
        // border-top: 1px solid #cccccc;
      }
    }
  }
}
</style>
