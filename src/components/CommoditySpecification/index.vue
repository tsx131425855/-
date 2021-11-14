<!-- tsx 规格模板 -->
<template>
  <div>
    <div>
      <div style="margin: 10px 0;">
        <el-select v-show="isShow"
                   v-model="agent_id"
                   :disabled="elsec==1?false:true"
                   class="maright"
                   placeholder="请选择代理商">
          <el-option v-for="item in agentMap"
                     :key="item.agent_id"
                     :label="item.name"
                     :value="item.agent_id" />
        </el-select>
        <span v-show="isShow">规格模板名称:</span>
        <el-input v-show="isShow"
                  v-model="temp_name"
                  class="input"
                  placeholder="单行输入" />
      </div>
      <!-- <div class="tilet">
        <p>规格信息</p>
      </div>-->
      <div v-if="!control"
           class="guigeshur">
        <div class="guigemosi">
          <div v-for="(item,index) in title"
               :key="index">
            <el-input v-model="item['value'+index]"
                      placeholder="规格名称"
                      style="width: 200px;"
                      @blur="blurtile($event,index)" />
            <i class="el-icon-circle-close"
               style="    margin-right: 4px;"
               @click="rushuzho($event,index)" />
          </div>
        </div>
        <el-button @click="open">添加规格</el-button>
        <el-button @click="addRule">添加列表数据</el-button>
      </div>
      <div style="display: flex;justify-content: flex-start;overflow-x: auto;">
        <!-- 模板数据 -->
        <el-form :disabled="control?control:elsec==3?true:false">
          <template v-if="template_title.length>0">
            <el-table :data="template_title"
                      border
                      :header-cell-style="{height: '40px'}"
                      :row-style="{height: '50px'}"
                      :style="title.length>3?'width:801px;overflow: hidden;max-width: 801px;':title.length>2?'width:601px;overflow: hidden;max-width: 601px;':title.length>1?'width:401px;overflow: hidden;max-width: 401px;':'width:201px;overflow: hidden;max-width: 201px;'">
              <el-table-column v-if="template_title.length>0&&title.length>0"
                               width="200"
                               :label="title[0]['value0']">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.Specifications0"
                            placeholder="规格属性" />
                </template>
              </el-table-column>

              <el-table-column v-if="template_title.length>0&&title.length>1"
                               width="200"
                               :label="title[1]['value1']">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.Specifications1"
                            placeholder="规格属性" />
                </template>
              </el-table-column>

              <el-table-column v-if="template_title.length>0&&title.length>2"
                               width="200"
                               :label="title[2]['value2']">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.Specifications2"
                            placeholder="规格属性" />
                </template>
              </el-table-column>
              <el-table-column v-if="template_title.length>0&&title.length>3"
                               width="200"
                               :label="title[3]['value3']">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.Specifications3"
                            placeholder="规格属性" />
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-form>
        <!-- 拼团数据 -->
        <el-form v-if="entrance==3">
          <template>
            <el-table :data="template_assemble"
                      border
                      :header-cell-style="{height: '40px'}"
                      :row-style="{height: '50px'}"
                      style="width:120px;overflow: hidden;max-width:120px;">
              <el-table-column width="119"
                               label="拼团价格">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.price"
                            placeholder="拼团价格" />
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-form>
        <!-- 秒杀数据 -->
        <el-form v-if="entrance==4">
          <template>
            <el-table :data="template_rule"
                      border
                      :header-cell-style="{height: '40px'}"
                      :row-style="{height: '50px'}"
                      style="width:241px;overflow: hidden;max-width:241px;">
              <el-table-column width="120"
                               label="秒杀价格">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.attr_seckill_price"
                            placeholder="秒杀价格" />
                </template>
              </el-table-column>
              <el-table-column width="120"
                               label="秒杀数量">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.attr_seckill_num"
                            placeholder="秒杀数量" />
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-form>
        <!-- 列表价格数据 -->
        <el-form :disabled="control?control:elsec==3?true:false">
          <template>
            <el-table :data="template_list"
                      :header-cell-style="{height: '40px'}"
                      :row-style="{height: '50px'}"
                      border
                      style="width: 100%">
              <el-table-column label="商品价格"
                               width="120">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.product_price" />
                </template>
              </el-table-column>
              <el-table-column v-if="templateData.store_id0==0"
                               label="采购价"
                               width="120">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.purch_price" />
                </template>
              </el-table-column>
              <el-table-column label="市场价"
                               width="120">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.market_price" />
                </template>
              </el-table-column>
              <el-table-column label="库存"
                               width="120">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.product_stock" />
                </template>
              </el-table-column>
              <el-table-column v-if="store_id!=0"
                               label="打包费"
                               width="120">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.product_pack" />
                </template>
              </el-table-column>
              <el-table-column v-if="store_id==0"
                               label="每组份数"
                               width="120">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.group_number" />
                </template>
              </el-table-column>
              <!-- <el-table-column label="金币抵扣限制" width="120">
              <template slot-scope="scope">
                <el-input v-model="scope.row.gold_limit" />
              </template>
              </el-table-column>-->
              <el-table-column v-if="store_id==0"
                               label="蜜豆抵扣"
                               width="120">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.midou_money" />
                </template>
              </el-table-column>
              <el-table-column v-if="store_id==0"
                               label="单用户限购"
                               width="120">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.user_quota" />
                </template>
              </el-table-column>
              <el-table-column v-if="store_id==0"
                               label="当天购买限制"
                               width="120">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.day_quota" />
                </template>
              </el-table-column>
              <el-table-column v-if="store_id==0"
                               label="单笔购买限制"
                               width="120">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.single_quota" />
                </template>
              </el-table-column>
              <el-table-column v-if="store_id==0"
                               label="规格图"
                               width="120"
                               align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.attr_image_url.length>0&&scope.row.attr_image.length>0"
                       style="display: flex;align-items: center;justify-content: center;">
                    <img :src="scope.row.attr_image_url"
                         style="width:30px;height:30px;"
                         srcset
                         @click="updowon(scope)">
                    <i class="el-icon-error"
                       @click="clickimg(scope)" />
                  </div>

                  <div v-else
                       @click="dianjiimg(scope)">
                    <el-upload class="upload-demo"
                               :action="exporteurl"
                               :limit="1"
                               :before-upload="beforeupload"
                               :on-success="addgoodsSuccess"
                               :headers="headers"
                               :show-file-list="false"
                               name="image">
                      <el-button size="small"
                                 type="primary">点击上传</el-button>
                    </el-upload>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作"
                               width="300"
                               align="center">
                <template slot-scope="scope">
                  <el-button type="danger"
                             icon="el-icon-circle-close"
                             @click="Templatedelete(scope)">删除</el-button>
                  <el-button type="success"
                             icon="el-icon-upload2"
                             @click="placement(scope)">置顶</el-button>
                  <el-button @click="setDefault(scope)">{{ scope.row.is_default==0?'非默认':'默认' }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-form>
      </div>
    </div>
    <EnlargeImg :dialog-image-url="ImageUrl"
                :tsxview="imgviews"
                @Close="imgviews=!imgviews" />
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { exporteurl, CopyObject, arrRoofPlacement } from '@/utils/user';
import { check_attr_repeat, check_attr_value_repeat } from '@/api/commodity';
import { upimg } from '@/api/user';
import EnlargeImg from '@/components/EnlargeImg';
import { compressAccurately } from 'image-conversion';
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { EnlargeImg },
  props: {
    agentMap: {
      type: Array,
      default: () => {
        return [];
      }
    },
    elsec: {
      type: Number,
      default: 1
    },
    templateData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    agentId: {
      type: String,
      default: JSON.parse(localStorage.getItem('user')).agent_id
    },
    isShow: {
      type: Boolean,
      default: true
    },
    control: {
      /** 表格输入禁止 */
      type: Boolean,
      default: false
    },
    entrance: {
      /** 入口点 1模板  2普通商品 3拼团 4 秒杀 */
      type: Number,
      default: 1
    },
    storeId: {
      /** 判断是不是 */
      type: String,
      default: '0'
    }
  },
  data () {
    // 这里存放数据
    return {
      template_title: [],
      template_list: [
        {
          product_price: '',
          purch_price: '',
          market_price: '',
          product_stock: '',
          gold_limit: '',
          user_quota: '',
          day_quota: '',
          single_quota: '',
          attr_image: '',
          attr_image_url: '',
          is_default: 1,
          midou_money: '',
          group_number: '',
          product_pack: '',
          sku_id: 0
        }
      ],
      title: [],
      template_assemble: [] /** 拼团 */,
      template_rule: [] /** 秒杀 */,
      imgindex: 0,
      addtitle: {},
      temp_name: '',
      headers: {
        token: localStorage.getItem('Token'),
        enctype: 'multipart/form-data'
      },
      exporteurl: exporteurl + upimg,
      agent_id: JSON.parse(localStorage.getItem('user')).agent_id,
      titleIndex: 0,
      ImageUrl: '',
      imgviews: false,
      rising: 0
    };
  },
  // 过滤器
  filters: {},
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    templateData (val) {
      if (val) {
        if (this.templateData.temp_name) {
          this.temp_name = this.templateData.temp_name;
        }
        if (Array.isArray(this.templateData.title)) {
          this.title = this.templateData.title;
        }
        if (Array.isArray(this.templateData.template_title)) {
          this.template_title = this.templateData.template_title;
        } else this.template_title = [];
        if (this.templateData.agent_id) {
          this.agent_id = this.templateData.agent_id.toString();
        }
        if (
          this.entrance == 3 &&
          this.templateData.group_price_data &&
          Array.isArray(this.templateData.group_price_data)
        ) {
          /** 拼团 */
          if (
            this.templateData.group_price_data.length !=
            this.templateData.template_title.length
          ) {
            const obj = { price: '', sku_id: 0 };
            this.template_assemble = this.templateData.group_price_data;
            for (
              let index = this.templateData.group_price_data.length;
              index < this.templateData.template_title.length;
              index++
            ) {
              this.template_assemble.push(obj);
            }
          } else {
            this.template_assemble = this.templateData.group_price_data;
          }
        }
        if (
          this.entrance == 4 &&
          this.templateData.seckill_data &&
          Array.isArray(this.templateData.seckill_data)
        ) {
          /** 秒杀 */
          if (
            this.templateData.seckill_data.length !=
            this.templateData.template_title.length
          ) {
            const obj = { attr_seckill_price: '', attr_seckill_num: '', id: 0 };
            this.template_rule = this.templateData.seckill_data;
            for (
              let index = this.templateData.seckill_data.length;
              index < this.templateData.template_title.length;
              index++
            ) {
              this.template_rule.push(obj);
            }
          } else {
            this.template_rule = this.templateData.seckill_data;
          }
        }
        if (!Array.isArray(this.templateData.template_list)) {
          /** 既然逗不对了 那就重置data */
          Object.assign(this.$data, this.$options.data());
        } else this.template_list = this.templateData.template_list;
      }
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    // if (this.elsec != 1) {
    if (this.templateData && JSON.stringify(this.templateData).length > 2) {
      this.temp_name = this.templateData.temp_name;
      this.agent_id = this.templateData.agent_id.toString();
      this.title = this.templateData.title;
      this.template_list = this.templateData.template_list;
      this.template_title = this.templateData.template_title;
      this.template_assemble = this.templateData.group_price_data;
      this.template_rule = this.templateData.seckill_data;
    }
    // }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () { },
  beforeCreate () { }, // 生命周期 - 创建之前
  beforeMount () { }, // 生命周期 - 挂载之前
  beforeUpdate () { }, // 生命周期 - 更新之前
  updated () { }, // 生命周期 - 更新之后
  beforeDestroy () { }, // 生命周期 - 销毁之前
  destroyed () { },
  // 方法集合
  methods: {
    rushuzho (e, index) {
      if (this.elsec != 3) {
        this.$confirm('此操作将删除规格, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const arr = [];
            this.template_title.map(res => {
              delete res['value' + index];
              delete res['Specifications' + index];
              delete res['attr_id' + index];
              delete res['attr_value_id' + index];
              arr.push(res);
            });
            const array = [];
            /**  删除关键点 */
            for (let index = 0; index < arr.length; index++) {
              const date = Object.keys(arr[index]);
              if (date.indexOf('sku_id') != -1) {
                const indexs = date.indexOf('sku_id');
                date.splice(indexs, 1);
              }
              const obj = {};
              for (let i = 0; i < date.length / 4; i++) {
                switch (i) {
                  case 0:
                    obj['value' + i] = arr[index][date[0]];
                    obj['Specifications' + i] = arr[index][date[1]];
                    obj['attr_id' + i] = arr[index][date[2]];
                    obj['attr_value_id' + i] = arr[index][date[3]];
                    break;
                  case 1:
                    obj['value' + i] = arr[index][date[4]];
                    obj['Specifications' + i] = arr[index][date[5]];
                    obj['attr_id' + i] = arr[index][date[6]];
                    obj['attr_value_id' + i] = arr[index][date[7]];
                    break;
                  case 2:
                    obj['value' + i] = arr[index][date[8]];
                    obj['Specifications' + i] = arr[index][date[9]];
                    obj['attr_id' + i] = arr[index][date[10]];
                    obj['attr_value_id' + i] = arr[index][date[11]];
                    break;
                  case 3:
                    obj['value' + i] = arr[index][date[12]];
                    obj['Specifications' + i] = arr[index][date[13]];
                    obj['attr_id' + i] = arr[index][date[14]];
                    obj['attr_value_id' + i] = arr[index][date[15]];
                    break;
                }
                if (i + 1 == date.length / 4) {
                  Object.assign(obj, { sku_id: arr[index]['sku_id'] });
                  array.push(obj);
                }
              }
            }
            this.title.splice(index, 1);
            const titlearr = [];
            for (let index = 0; index < this.title.length; index++) {
              const titledate = Object.keys(this.title[index]);
              const titleobj = {};
              titleobj['value' + index] = this.title[index][titledate[0]];
              titleobj['Specifications' + index] = this.title[index][
                titledate[1]
              ];
              titleobj['attr_id'] = this.title[index][titledate[2]];
              titleobj['attr_value_id'] = this.title[index][titledate[3]];
              titlearr.push(titleobj);
            }
            this.title = titlearr;
            this.template_title = array;
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
      }

      // this.template_title.splice(index, 1);
    },
    blurtile (val, index) {
      // 规格标题
      const inputVal = val.target.value;
      const arr = [];
      this.template_title.map(res => {
        res['value' + index] = inputVal;
        arr.push(res);
      });
      this.addtitle['value' + index] = inputVal;
      this.template_title = arr;
    },
    template_titleVal () {
      // 新增规格
      const tmpCourse = {};
      tmpCourse['value' + this.title.length] = '';
      tmpCourse['Specifications' + this.title.length] = '';
      tmpCourse['attr_id' + this.title.length] = '0';
      tmpCourse['attr_value_id' + this.title.length] = '0';
      // Object.assign(this.addtitle, tmpCourse);
      // this.addtitle = CopyObject(this.addtitle);
      return tmpCourse;
    },
    titleVal () {
      // 新增规格标题
      const tmpCourse = {};
      tmpCourse['value' + this.title.length] = '';
      tmpCourse['Specifications' + this.title.length] = '';
      tmpCourse['attr_id'] = '0';
      tmpCourse['attr_value_id'] = '0';
      return tmpCourse;
    },
    Templatedelete (scope) {
      /** 删除 */
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (this.template_list.length > 1) {
            this.template_list.splice(scope.$index, 1);
            this.template_title.splice(scope.$index, 1);
          } else {
            this.$message.error('亲，最后一条了请不要删除');
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    clickimg (scope) {
      /** 删除规格图 */
      this.template_list[scope.$index].attr_image_url = '';
      this.template_list[scope.$index].attr_image = '';
    },
    placement (scope) {
      /** 置顶 */
      this.template_list = arrRoofPlacement(this.template_list, scope.$index);
      this.template_title = arrRoofPlacement(this.template_title, scope.$index);
    },

    updowon (scope) {
      this.ImageUrl = scope.row.attr_image_url;
      this.imgviews = true;
    },
    setDefault (scope) {
      /** 设置默认 */
      const arr = [];
      if (scope.row.is_default != 1) {
        this.template_list.map(res => {
          res.is_default = 0;
          arr.push(res);
        });
        arr[scope.$index].is_default = 1;
        this.template_list = arr;
      }
    },
    open () {
      const arr = [];
      const that = this;
      if (this.title.length == 0) {
        // this.template_title.push(this.template_titleVal());
        this.title.push(this.titleVal());
        this.addtemplate_title();
      } else if (this.title.length > 0 && this.title.length < 4) {
        check_attr_repeat({ title: that.title }).then(res => {
          that.rising = this.rising + 1;
          if (res.code == 1) {
            const obj = that.template_titleVal();
            const objtitle = that.titleVal();
            that.template_title.map(res => {
              Object.assign(res, obj);
              arr.push(CopyObject(res));
            });
            if (that.template_list.length > that.template_title.length) {
              that.addtemplate_title();
            }
            that.template_title = arr;
            that.title.push(objtitle);
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        this.$message('只能添加四条规格');
      }
    },
    addtemplate_title () {
      for (let index = 0; index < 99; index++) {
        if (this.template_list.length == this.template_title.length) {
          break;
        } else {
          if (this.title.length > 0) {
            this.addtitle = {};
            for (let index = 0; index < this.title.length; index++) {
              const tmpCourse = {};
              tmpCourse['value' + index] = this.title[index]['value' + index];
              tmpCourse['Specifications' + index] = '';
              tmpCourse['attr_id' + index] = '0';
              tmpCourse['attr_value_id' + index] = '0';
              tmpCourse['sku_id'] = '0';
              Object.assign(this.addtitle, tmpCourse);
              this.addtitle = CopyObject(this.addtitle);
            }
          }
          this.template_title.push({ ...this.addtitle });
        }
      }
    },
    addRule () {
      /** 每次添加 那列表的最后一条 */
      const obj = {
        product_price: this.template_list[this.template_list.length - 1]
          .product_price,
        purch_price: this.template_list[this.template_list.length - 1]
          .purch_price,
        market_price: this.template_list[this.template_list.length - 1]
          .market_price,
        product_stock: this.template_list[this.template_list.length - 1]
          .product_stock,
        gold_limit: this.template_list[this.template_list.length - 1]
          .gold_limit,
        midou_money: this.template_list[this.template_list.length - 1]
          .midou_money,
        user_quota: this.template_list[this.template_list.length - 1]
          .user_quota,
        day_quota: this.template_list[this.template_list.length - 1].day_quota,
        single_quota: this.template_list[this.template_list.length - 1]
          .single_quota,
        group_number: this.template_list[this.template_list.length - 1]
          .group_number,
        product_pack: this.template_list[this.template_list.length - 1]
          .product_pack,
        attr_image: '',
        attr_image_url: '',
        is_default: 0,
        sku_id: 0
      };

      check_attr_value_repeat({
        title: this.title,
        template_title: this.template_title
      }).then(res => {
        if (res.code == 1) {
          this.template_list.push(obj);
          if (this.title.length > 0) {
            this.addtemplate_title();
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    dianjiimg (scope) {
      this.imgindex = scope.$index;
    },
    beforeupload (file) {
      /** 上传文件前 */
      /** 是否大于2M  是否是  ipg/png */
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      if (isJPG || isPNG) {
        /** 这里是ok的 */
      } else {
        this.$message.error('上传头像图片只能是 JPG或png 格式!');
        return false;
      }
      return new Promise((resolve, reject) => {
        const _URL = window.URL || window.webkitURL;
        const isLt2M = file.size / 1024 / 1024 > 2; // 判定图片大小是否小于2MB
        // 这里需要计算出图片的长宽
        const img = new Image();
        img.onload = function () {
          file.width = img.width; // 获取到width放在了file属性上
          file.height = img.height; // 获取到height放在了file属性上
          if (isLt2M) {
            compressAccurately(file, {
              size: 2048
            }).then(res => {
              resolve(res);
            });
          } else resolve(file);
        }; // 需要把图片赋值
        img.src = _URL.createObjectURL(file);
      });
    },
    addgoodsSuccess (res, file, filelist, row) {
      if (res.code == 1) {
        res.data;
        this.template_list[this.imgindex].attr_image = res.data.img_path;
        this.template_list[this.imgindex].attr_image_url = res.data.img_url;
      } else {
        this.$message.error(res.mag);
      }
    },
    commit () {
      const aa = [];
      for (let index = 0; index < 99; index++) {
        const obj = {};
        if (this.template_list.length > index) {
          Object.assign(
            obj,
            this.template_title[index],
            this.template_list[index]
          );
          aa.push(obj);
        } else break;
      }
      // const [aa, bb, cc, dd] = [];
      const data = {
        template_title: this.template_title,
        template_list: this.template_list,
        title: this.title,
        temp_name: this.temp_name,
        agent_id: this.agent_id,
        group_price_data: this.template_assemble,
        seckill_data: this.template_rule,
        wholeLine: aa
      };

      // this.$emit("Preservation", data);
      return data;
    }
  }, // 生命周期 - 销毁完成
  ctivated () { } // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>

<style lang='scss' scoped>
// @import url(); 引入公共css类
@import "src/styles/hide.scss";
.guigeshur {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .guigemosi {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    > div {
      width: 200px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
  }
}
.el-table .cell {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  white-space: normal;
  word-break: break-all;
  line-height: 1;
}
</style>
