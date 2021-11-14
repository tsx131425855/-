<!-- tsx 楼盘管理 -->
<template>
  <div class="package">
    <el-form ref="from" :model="from" label-width="110px">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item title="基本信息" name="1">
          <el-row>
            <el-col :span="5">
              <el-form-item label="名称">
                <el-input v-model="from.property_name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="参考均价(售价)">
                <div style="display: flex;justify-content: space-between;">
                  <el-input v-model="from.property_price" style="width: 200px;"></el-input>
                  <el-select
                    v-model="from.property_price_unit"
                    size="small"
                    class="gaosizuobian"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in property_price_unit_map"
                      :key="item.key"
                      :label="item.value"
                      :value="item.key"
                    />
                  </el-select>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="建面">
                <el-input v-model="from.property_area"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="楼盘位置">
                <el-select
                  v-model="from.property_province_code"
                  @change="provinceCity(1)"
                  placeholder="请选择省"
                >
                  <el-option
                    v-for="(item,index) in province"
                    :key="item+index"
                    :label="item"
                    :value="index"
                  />
                </el-select>
                <el-select
                  v-model="from.property_city_code"
                  @change="provinceCity(2)"
                  placeholder="请选择市"
                >
                  <el-option
                    v-for="(item,index) in city"
                    :key="item+index"
                    :label="item"
                    :value="index"
                  />
                </el-select>
                <el-select v-model="from.property_district_code" placeholder="请选择区">
                  <el-option
                    v-for="(item,index) in area"
                    :key="item+index"
                    :label="item"
                    :value="index"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="18">
              <el-form-item style="margin-left:0">
                <el-col :span="5">
                  <el-input v-model="from.property_address" placeholder="详细地址"></el-input>
                </el-col>
                <el-col :span="12">
                  <qqMap :default="2" :centers="centers" @lonlat="Degrees" />
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="售楼部电话">
                <el-input v-model="from.property_phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="售楼部经理">
                <el-input v-model="from.property_director"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="经理电话">
                <el-input v-model="from.property_director_phone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="开盘时间">
            <el-col :span="6">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="from.property_sell_time"
                style="width:300px"
              ></el-date-picker>
            </el-col>
          </el-form-item>

          <el-form-item label="开盘显示时间">
            <el-col :span="6">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="from.property_dis_sell_time"
                style="width:300px"
              ></el-date-picker>
            </el-col>
          </el-form-item>

          <el-form-item label="楼盘标签">
            <el-col :span="6">
              <el-select
                v-model="from.property_tag"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请选择"
              >
                <el-option
                  v-for="item in property_tag_map"
                  :key="item.key"
                  :label="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <el-form-item label="楼盘状态">
            <el-radio-group v-model="from.property_status">
              <el-radio
                v-for="(item) in property_status_map"
                :key="item.key"
                :label="item.key"
              >{{item.value}}</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="认筹金额">
            <el-input v-model="from.property_deposit" style="width: 300px;"></el-input>
            <span>元</span>
          </el-form-item>

          <el-form-item label="认筹协议">
            <el-input
              v-model="from.property_deposit_protocol"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              style="width: 300px;"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>

          <el-form-item label="可认筹次数">
            <el-input-number v-model="from.property_limit_num" controls-position="right"></el-input-number>
          </el-form-item>

          <el-form-item label="代理商区域">
            <el-select v-model="from.agent_id" size="small" class placeholder="请选择">
              <el-option
                v-for="item in agent_map"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
        </el-collapse-item>

        <el-collapse-item title="楼盘详情" name="2">
          <el-row>
            <el-col :span="6">
              <el-form-item label="交房时间">
                <el-date-picker type="date" placeholder="选择日期" v-model="from.property_due_time"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="交房时间页面显示">
                <el-date-picker type="date" placeholder="选择日期" v-model="from.property_dis_due_time"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="装修状况">
            <el-radio-group v-model="from.property_decoration">
              <el-radio
                v-for="(item) in property_decoration_map"
                :key="item.key"
                :label="item.key"
              >{{item.value}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="物业类型">
            <el-checkbox-group v-model="from.property_type">
              <el-checkbox
                v-for="(item,index) in property_type_map"
                :key="index"
                :label="item.key"
                name="type"
              >{{item.value}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="建筑类型">
            <el-radio-group v-model="from.property_building_type">
              <el-radio
                v-for="(item,index) in property_building_type_map"
                :key="index"
                :label="item.key"
              >{{item.value}}</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-row>
            <el-col :span="6">
              <el-form-item label="绿化率">
                <el-input v-model="from.property_green" style="width:200px"></el-input>
                <span>%</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="物业费">
                <el-input v-model="from.property_service_fee" style="width:200px"></el-input>
                <span>元/平</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="楼层状况">
                <el-input v-model="from.property_distribution"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="开发商">
            <el-select
              v-model="from.property_developer_id"
              size="small"
              style="width:300px"
              placeholder="请选择"
            >
              <el-option
                v-for="item in property_developer_map"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
            <el-button type="primary" @click="adddeveloperdata">添加</el-button>
          </el-form-item>

          <el-row>
            <el-col :span="6">
              <el-form-item label="停车位">
                <el-input v-model="from.property_parking"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="容积率">
                <el-input v-model="from.property_capacity"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- <el-form-item label="物业公司">
          <el-select v-model="agent_id" size="small" class="gaosizuobian" placeholder="请选择">
            <el-option
              v-for="item in agent"
              :key="item.agent_id"
              :label="item.name"
              :value="item.agent_id"
            />
          </el-select>
          <el-button type="primary">添加</el-button>
          </el-form-item>-->

          <el-row>
            <el-col :span="6">
              <el-form-item label="产权年限">
                <el-select
                  v-model="from.property_life"
                  size="small"
                  style="width:300px"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in property_life_map"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="占地面积">
                <el-input v-model="from.property_cover" style="width:200px"></el-input>
                <span>平</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="建筑面积">
                <el-input v-model="from.property_acreage" style="width:200px"></el-input>
                <span>平</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="楼栋数">
                <el-input v-model="from.property_building_num" style="width:200px"></el-input>
                <span>栋</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="项目介绍">
            <el-input v-model="from.property_description" type="textarea" style="width:300px"></el-input>
          </el-form-item>
        </el-collapse-item>

        <el-collapse-item title="楼盘相册" name="3">
          <div style="margin-left: 100px;">
            <div>
              <p>列表展示图(一张)</p>
              <Upimg
                :exporteurl="exporteurl"
                :fileList="property_img"
                fileName="image"
                :showList="true"
                :fileHeaders="headers"
                :maxlimit="1"
                :index="1"
                @Removeimg="RemoveimgArray"
                @Successimg="SuccessimgArray"
              />
            </div>
            <div>
              <p>详情页主图(支持上传多张)</p>
              <Upimg
                :exporteurl="exporteurl"
                :fileList="property_img_detail"
                fileName="image"
                :showList="true"
                :fileHeaders="headers"
                :maxlimit="5"
                :index="2"
                @Removeimg="RemoveimgArray"
                @Successimg="SuccessimgArray"
              />
            </div>
            <div>
              <p>效果图(支持上传多张)</p>
              <div>
                <Upimg
                  :exporteurl="exporteurl"
                  :fileList="property_img_effect"
                  fileName="image"
                  :showList="false"
                  :fileHeaders="headers"
                  :maxlimit="10"
                  :multiple="true"
                  :index="3"
                  @Removeimg="RemoveimgArray"
                  @Successimg="SuccessimgArray"
                />
              </div>
            </div>

            <el-table
              v-show="property_img_effect_description.length>0"
              :data="property_img_effect_description"
              border
              style="width: 100%;margin-top: 20px;"
            >
              <el-table-column prop="is_show_text" label="照片">
                <template slot-scope="scope">
                  <img :src="scope.row.url" alt srcset style="width: 80px; height: 80px;" />
                </template>
              </el-table-column>
              <el-table-column prop="is_show_text" label="描述">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.text" style="width:300px"></el-input>
                </template>
              </el-table-column>

              <el-table-column prop="is_show_text" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="deletedata(scope.row,1)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <div>
              <p>实景图(支持上传多张)</p>
              <div>
                <Upimg
                  :exporteurl="exporteurl"
                  :fileList="property_img_scene"
                  fileName="image"
                  :showList="false"
                  :fileHeaders="headers"
                  :maxlimit="20"
                  :index="4"
                  :multiple="true"
                  @Removeimg="RemoveimgArray"
                  @Successimg="SuccessimgArray"
                />
              </div>
            </div>

            <el-table
              v-show="property_img_scene_description.length>0"
              :data="property_img_scene_description"
              border
              style="width: 100%;margin-top: 20px;"
            >
              <el-table-column prop="is_show_text" label="照片">
                <template slot-scope="scope">
                  <img :src="scope.row.url" alt srcset style="width: 80px; height: 80px;" />
                </template>
              </el-table-column>
              <el-table-column prop="is_show_text" label="描述">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.text" style="width:300px"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="is_show_text" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="deletedata(scope,2)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <div>
              <p>楼栋图(支持上传多张)</p>
              <div>
                <Upimg
                  :exporteurl="exporteurl"
                  :fileList="property_img_building"
                  fileName="image"
                  :showList="false"
                  :fileHeaders="headers"
                  :maxlimit="20"
                  :index="5"
                  :multiple="true"
                  @Removeimg="RemoveimgArray"
                  @Successimg="SuccessimgArray"
                />
              </div>
            </div>

            <el-table
              v-show="property_img_building_description.length>0"
              :data="property_img_building_description"
              border
              style="width: 100%;margin-top: 20px;"
            >
              <el-table-column prop="is_show_text" label="照片">
                <template slot-scope="scope">
                  <img :src="scope.row.url" alt srcset style="width: 80px; height: 80px;" />
                </template>
              </el-table-column>
              <el-table-column prop="is_show_text" label="描述">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.text" style="width:300px"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="is_show_text" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="deletedata(scope,3)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
      </el-collapse>
      <el-button type="primary" size="medium" @click="onSubmit">提交</el-button>
    </el-form>

    <PublicDialog
      v-if="closeShowView"
      :isShowVisible="closeShowView"
      tsxTitle="新增物业公司"
      tsxWidth="50%"
      @handleClose="handleClose"
    >
      <el-form slot="forms" ref="property" :model="property" label-width="110px">
        <el-form-item label="物业公司名称">
          <el-input v-model="property.developer_name"></el-input>
        </el-form-item>
        <el-form-item label="物业公司介绍">
          <el-input v-model="property.developer_description" type="textarea"></el-input>
        </el-form-item>
        <el-button type="primary" size="medium" @click="adddeveloper">提交</el-button>
      </el-form>
    </PublicDialog>
  </div>
</template>

<script >
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import qqMap from "@/components/qqMap";
import {
  propertyadd,
  base_map,
  propertyinfo,
  propertyedit,
  adddeveloper,
} from "@/api/sales";
import Upimg from "@/components/Upimg";
import {
  exporteurl,
  turnDate,
  exportFile,
  arrayObjectDuplication,
  CopyObject,
} from "@/utils/user";
import { upimg, Province } from "@/api/user";
import PublicDialog from "@/components/PublicDialog";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { qqMap, PublicDialog, Upimg },
  data() {
    // 这里存放数据
    return {
      activeNames: ["1", "2", "3"],
      exporteurl: exporteurl + upimg,
      headers: {
        token: localStorage.getItem("Token"),
        enctype: "multipart/form-data",
      },
      from: {
        property_city_code: "",
        district_code: "",
        property_type: ["1"],
        property_price_unit: "1",
        property_address: "",
        property_decoration: "1",
        property_building_type: "1",
      },
      property: {},
      closeShowView: false,
      centers: { lng: 0, lat: 0 },
      details: {},
      property_price_unit_map: [], //	售价单位数组
      property_status_map: [], //	楼盘状态数组
      property_decoration_map: [], //	装修状况数组
      property_type_map: [], //	物业类型数组
      property_building_type_map: [], //	建筑类型数组
      property_life_map: [], //	产权年限数组
      agent_map: [], //	代理商区域数组
      property_developer_map: [], //	开发商数组
      property_tag_map: [], //	标签数组
      province: [],
      city: [],
      area: [],
      babyMap: [],
      property_img: [],
      property_img_detail: [],
      property_img_effect: [],
      property_img_effect_description: [],
      property_img_scene: [],
      property_img_scene_description: [],
      property_img_building: [],
      property_img_building_description: [],
      row: {},
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
    handleChange(val) {
      console.log(val);
    },
    Degrees(type) {
      /** 点击获取经纬度 */
      // this.from.latitude = type.point.lat;
      // this.from.longitude = type.point.lng;
      console.log(type);
      this.from.property_latitude = type.lat;
      this.from.property_longitude = type.lng;
      this.centers = type;
      this.mapVisible = false;
    },
    handleClose() {
      this.closeShowView = false;
    },
    RemoveimgArray(val) {
      console.log(val);
      switch (val.index) {
        case 1:
          break;
      }
    },
    SuccessimgArray(val) {
      console.log("成功复制");
      switch (val.index) {
        case 1:
          this.property_img = val.imgArray;
          break;
        case 2:
          this.property_img_detail = val.imgArray;
          break;
        case 3:
          this.property_img_effect = val.imgArray;
          this.property_img_effect_description = arrayObjectDuplication(
            this.property_img_effect_description,
            this.property_img_effect
          );
          break;
        case 4:
          this.property_img_scene = val.imgArray;
          this.property_img_scene_description = arrayObjectDuplication(
            this.property_img_scene_description,
            this.property_img_scene
          );
          break;
        case 5:
          this.property_img_building = val.imgArray;
          this.property_img_building_description = arrayObjectDuplication(
            this.property_img_building_description,
            this.property_img_building
          );
          break;
      }
    },
    provinceCity(val, where) {
      /** 省市区 */
      if (val == 1) {
        where = this.from.property_province_code;
      } else if (val == 2) {
        where = this.from.property_city_code;
      }
      Province({ where }).then((res) => {
        if (res.code == 1) {
          switch (val) {
            case 0:
              this.province = res.data;
              break;
            case 1:
              this.city = res.data;
              break;
            case 2:
              this.area = res.data;
              break;
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    deletedata(row, val) {
      switch (val) {
        case 1:
          if (this.property_img_effect.length > 1) {
            this.property_img_effect.splice(row.$index, 1);
          } else {
            this.property_img_effect = [];
          }
          if (this.property_img_effect_description.length > 1) {
            this.property_img_effect_description.splice(row.$index, 1);
          } else this.property_img_effect_description = [];
          break;
        case 2:
          if (this.property_img_scene.length > 1) {
            this.property_img_scene.splice(row.$index, 1);
          } else this.property_img_scene = [];
          if (this.property_img_scene_description.length > 1) {
            this.property_img_scene_description.splice(row.$index, 1);
          } else this.property_img_scene_description = [];
          break;
        case 3:
          if (this.property_img_building.length > 1) {
            this.property_img_building.splice(row.$index, 1);
          } else this.property_img_building = [];

          if (this.property_img_building_description.length > 1) {
            this.property_img_building_description.splice(row.$index, 1);
          } else this.property_img_building_description = [];
          break;
      }
    },
    adddeveloperdata() {
      this.property = {};
      this.closeShowView = true;
    },
    addtab(val) {
      /** 标签 */
      console.log(val);
      this.property_tag_map.map((res) => {
        if (val.includes(res.value)) {
        }
      });
    },
    adddeveloper() {
      adddeveloper(this.property).then((res) => {
        if (res.code == 1) {
          this.configurationData();
          this.closeShowView = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getinfo() {
      propertyinfo({ property_id: this.row.property_id }).then((res) => {
        if (res.code == 1) {
          this.from = res.data;
          this.property_img = [
            {
              imgPath: res.data.property_img,
              url: res.data.property_img_url,
              name: "",
            },
          ];

          this.centers = {
            lng: res.data.property_longitude,
            lat: res.data.property_latitude,
          };

          if (res.data.property_province_code) {
            this.provinceCity(1, res.data.property_province_code);
          }
          if (res.data.property_city_code) {
            this.provinceCity(2, res.data.property_city_code);
          }
          this.from.property_province_code =
            res.data.property_province_code.toString() == "0"
              ? ""
              : res.data.property_province_code.toString();
          this.from.property_city_code =
            res.data.property_city_code.toString() == "0"
              ? ""
              : res.data.property_city_code.toString();
          this.from.property_district_code =
            res.data.property_district_code.toString() == "0"
              ? ""
              : res.data.property_district_code.toString();
          this.property_img_detail = res.data.img_map.img_detail;
          this.property_img_effect = res.data.img_map.img_effect;
          this.property_img_effect_description = CopyObject(
            res.data.img_map.img_effect
          );
          this.property_img_scene = res.data.img_map.img_scene;
          this.property_img_scene_description = CopyObject(
            res.data.img_map.img_scene
          );
          this.property_img_building = res.data.img_map.img_building;
          this.property_img_building_description = CopyObject(
            res.data.img_map.img_building
          );
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    onSubmit() {
      const data = this.from;
      data.property_sell_time = turnDate(data.property_sell_time, 1);
      data.property_dis_sell_time = turnDate(data.property_dis_sell_time, 1);
      data.property_due_time = turnDate(data.property_due_time, 1);
      data.property_dis_due_time = turnDate(data.property_dis_due_time, 1);
      let obj = {
        property_img_effect_description:
          this.property_img_effect_description.length > 0
            ? this.property_img_effect_description.flatMap((x) => [x.text])
            : [],
        property_img_scene_description:
          this.property_img_scene_description.length > 0
            ? this.property_img_scene_description.flatMap((x) => [x.text])
            : [],
        property_img_building_description:
          this.property_img_building_description.length > 0
            ? this.property_img_building_description.flatMap((x) => [x.text])
            : [],
        property_img:
          this.property_img.length > 0 ? this.property_img[0].imgPath : "",
        property_img_detail:
          this.property_img_detail.length > 0
            ? this.property_img_detail.flatMap((x) => [x.imgPath])
            : [],
        property_img_effect:
          this.property_img_effect.length > 0
            ? this.property_img_effect.flatMap((x) => [x.imgPath])
            : [],
        property_img_scene:
          this.property_img_scene.length > 0
            ? this.property_img_scene.flatMap((x) => [x.imgPath])
            : [],
        property_img_building:
          this.property_img_building.length > 0
            ? this.property_img_building.flatMap((x) => [x.imgPath])
            : [],
      };
      Object.assign(data, obj);
      if (this.addedit == 1) {
        propertyadd(data).then((res) => {
          if (res.code == 1) {
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        propertyedit(data).then((res) => {
          if (res.code == 1) {
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },
    configurationData() {
      base_map({}).then((res) => {
        if (res.code == 1) {
          (this.property_price_unit_map = res.data.property_price_unit_map), //	售价单位数组
            (this.property_status_map = res.data.property_status_map), //	楼盘状态数组
            (this.property_decoration_map = res.data.property_decoration_map), //	装修状况数组
            (this.property_type_map = res.data.property_type_map), //	物业类型数组
            (this.property_building_type_map =
              res.data.property_building_type_map), //	建筑类型数组
            (this.property_life_map = res.data.property_life_map), //	产权年限数组
            (this.agent_map = res.data.agent_map), //	代理商区域数组
            (this.property_developer_map = res.data.property_developer_map), //	开发商数组
            (this.property_tag_map = res.data.property_tag_map); //	标签数组
          this.from.property_status = this.property_status_map[0].key;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.configurationData();
    this.provinceCity(0, "");
    if (this.$route.query && this.$route.query.edit) {
      console.log(this.$route.query);
      this.row = this.$route.query.row;
      this.addedit = this.$route.query.edit;
      this.getinfo();
    }
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
