<template>
  <div class="root">
    <div class="agent">
      <!-- <el-switch  v-model="isAll" active-text="同步"></el-switch> -->
      <el-select v-model="agent_id" placeholder="请选择" @change="getData">
        <el-option
          v-for="item in agent"
          :key="item.agent_id"
          :label="item.name"
          :value="item.agent_id"
        ></el-option>
      </el-select>
      <!-- <span class="laberImp">注意: 在切换地区时请确认当前配置是否保存 (切换后会放弃未保存的设置)</span> -->
    </div>

    <!-- icon配置 start -->
    <div class="module iconList">
      <div class="title">
        <div class="module-title-name">第一板块: 顶部Icon(不限个数)</div>
      </div>
      <div class="module-main">
        <div class="laber">
          ICON
          <span>可拖动排序(自动刷新)</span>
          <el-button
            size="medium"
            @click="clicktemp(1)"
            icon="el-icon-plus"
            type="primary"
            >添加</el-button
          >
        </div>
        <vuedraggable
          class="wrapper"
          @change="changeSort"
          v-model="module_map.module_1_map"
        >
          <transition-group>
            <div
              class="iconItem"
              v-for="item in module_map.module_1_map"
              :key="item.config_id"
            >
              <img :src="item.image_url" :alt="item.name" />
              <div>
                <div>{{ item.name }}</div>
                <div>
                  <el-button
                    @click="editdata(1, item.config_id)"
                    plain
                    type="primary"
                    >编辑</el-button
                  >
                  <el-button
                    @click="selecteddel(1, item.config_id)"
                    plain
                    type="warning"
                    >删除</el-button
                  >
                </div>
              </div>
            </div>
          </transition-group>
        </vuedraggable>
      </div>
    </div>

    <!-- 第一板块 icon添加/修改弹窗 -->
    <el-dialog
      title="icon管理"
      top="50px"
      :before-close="handleClose"
      :visible.sync="showAddIcon"
    >
      <div class="add-icon-mask">
        <div class="add-icon-title">
          <el-button size="medium" @click="saveIcon(1)" type="primary"
            >保存</el-button
          >
          <el-button size="medium" @click="handleClose" type="info"
            >取消</el-button
          >
        </div>
        <div class="add-icon-form">
          <el-form ref="form" :model="addIcon" label-width="80px">
            <el-form-item style="width: 300px" label="标题">
              <el-input
                placeholder="标题名称 (至多五个字)"
                maxlength="5"
                v-model="addIcon.name"
              ></el-input>
            </el-form-item>
            <el-form-item style="width: 300px" label="icon图片">
              <div class="img-update">
                <div>
                  <div>
                    icon图标
                    <span>限一张, jpg,png模式; 大小200px*200px</span>
                  </div>
                  <Upimg
                    :exporteurl="exporteurl"
                    :fileList="iconImage"
                    fileName="image"
                    :showList="true"
                    :fileHeaders="headers"
                    :maxlimit="1"
                    :index="1"
                    @Removeimg="SuccessimgArray"
                    @Successimg="SuccessimgArray"
                  ></Upimg>
                </div>
                <div>
                  <div
                    style="font-size: 14px; color: #606266; font-weight: 700"
                  >
                    背景图
                    <span
                      style="
                        font-size: 14px;
                        color: #9b9797;
                        font-weight: 400;
                        margin-left: 10px;
                      "
                      >限一张, jpg,png模式; 大小200px*200px</span
                    >
                  </div>
                  <Upimg
                    :exporteurl="exporteurl"
                    :fileList="iconBgImage"
                    fileName="image"
                    :showList="true"
                    :fileHeaders="headers"
                    :maxlimit="1"
                    :index="2"
                    @Successimg="SuccessimgArray"
                  ></Upimg>
                </div>
              </div>
            </el-form-item>

            <el-form-item
              label-width="200px"
              label="板块背景色(配合背景图设置):"
            >
              <el-color-picker
                style="width: 60px"
                v-model="addIcon.bg_color"
                show-alpha
              ></el-color-picker>
              <div
                :style="'background-color:' + (addIcon.bg_color || '#f5f5f5')"
                class="show-color"
              >
                显示内容
              </div>
            </el-form-item>

            <el-form-item label="特殊资源">
              <el-radio-group v-model="addIcon.jump_type" @change="changeradio">
                <el-radio label="1">小程序指定页面</el-radio>
                <el-select
                  v-if="addIcon.jump_type == 1"
                  v-model="addIcon.appoint_type"
                  placeholder="请选择跳转页面"
                  @change="onInput"
                >
                  <el-option
                    v-for="item in appoint_type_map"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                  ></el-option>
                </el-select>
                <div class="radio-item">
                  <el-radio label="2">小程序指定商品</el-radio>
                  <el-input
                    v-if="addIcon.jump_type == 2"
                    v-model="addIcon.appoint_type"
                    style="width: 250px"
                    placeholder="请输入指定商品Id"
                    @input="onInput()"
                  ></el-input>
                </div>
                <div class="radio-item">
                  <el-radio label="3">小程序指定商家</el-radio>
                  <el-input
                    v-if="addIcon.jump_type == 3"
                    v-model="addIcon.appoint_type"
                    style="width: 250px"
                    placeholder="请输入指定商家Id"
                    @input="onInput()"
                  ></el-input>
                </div>
                <div class="radio-item">
                  <el-radio label="4">小程序指定楼盘</el-radio>
                  <el-input
                    v-if="addIcon.jump_type == 4"
                    v-model="addIcon.appoint_type"
                    style="width: 250px"
                    placeholder="请输入指定楼盘Id"
                    @input="onInput()"
                  ></el-input>
                </div>
                <div class="radio-item">
                  <el-radio label="5">自定义链接</el-radio>
                  <el-input
                    v-if="addIcon.jump_type == 5"
                    v-model="addIcon.appoint_type"
                    style="width: 300px"
                    placeholder="请输入小程序链接地址"
                    @input="onInput()"
                  ></el-input>
                </div>
                <div class="radio-item">
                  <el-radio label="6">选定商品</el-radio>
                  <div
                    class="add-icon-productList"
                    v-show="addIcon.jump_type == 6"
                  >
                    <div>
                      <el-button
                        @click="onAddProduct(1)"
                        icon="el-icon-plus"
                        type="primary"
                        >添加</el-button
                      >
                      <el-button
                        icon="el-icon-close"
                        type="warning"
                        @click="recommenddetele(3)"
                        >删除</el-button
                      >
                    </div>
                    <el-table
                      :data="addIcon.product_data"
                      border
                      @selection-change="
                        (val) => {
                          this.addIcon.multipleSelection = val;
                        }
                      "
                      style="width: 100%"
                      fit
                    >
                      <el-table-column
                        fixed
                        type="selection"
                        width="55"
                      ></el-table-column>
                      <el-table-column
                        fixed
                        align="center"
                        prop="product_id"
                        label="商品Id"
                      />
                      <el-table-column
                        width="200"
                        align="center"
                        prop="product_name"
                        label="商品名称"
                      />
                      <el-table-column
                        align="center"
                        prop="product_price"
                        label="价值（销售价）"
                      />
                      <el-table-column
                        align="center"
                        prop="product_stock"
                        label="库存"
                      />
                      <el-table-column
                        min-width="180"
                        align="center"
                        label="排序"
                      >
                        <template slot-scope="scope">
                          <el-button
                            size="mini"
                            type="primary"
                            icon="el-icon-arrow-up"
                            circle
                            @click="move(1, 2, scope.$index)"
                          ></el-button>
                          <el-button
                            size="mini"
                            type="primary"
                            icon="el-icon-arrow-down"
                            circle
                            @click="move(1, 1, scope.$index)"
                          ></el-button>
                          <el-button
                            size="mini"
                            type="success"
                            @click="move(1, 3, scope.$index)"
                            >置顶</el-button
                          >
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>

    <!-- 今日爆款 -->
    <div class="module">
      <div class="title" style="margin-bottom: 30px">
        <div class="module-title-name">今日爆款</div>
        <div class="module-isShow-btn">
          <el-button size="medium" type="success" @click="saveIcon(2, 1)"
            >保存设置</el-button
          >
        </div>
      </div>
      <div class="module-main">
        <div>
          <div style="margin-bottom: 15px">
            <el-button
              @click="onAddProduct(2)"
              icon="el-icon-plus"
              type="primary"
              >添加</el-button
            >
            <el-button
              icon="el-icon-close"
              type="warning"
              @click="recommenddetele(4)"
              >删除</el-button
            >
          </div>
          <el-table
            :data="module_map.module_2_map"
            border
            @selection-change="
              (val) => {
                this.module_map.module_2_map.multipleSelection = val;
              }
            "
            style="width: 100%"
            fit
          >
            <el-table-column
              fixed
              type="selection"
              width="55"
            ></el-table-column>
            <el-table-column
              fixed
              align="center"
              prop="product_id"
              label="商品Id"
            />
            <el-table-column
              width="200"
              align="center"
              prop="product_name"
              label="商品名称"
            />
            <el-table-column
              align="center"
              prop="product_price"
              label="价值（销售价）"
            />
            <el-table-column align="center" prop="product_stock" label="库存" />
            <el-table-column min-width="180" align="center" label="排序">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-arrow-up"
                  circle
                  @click="move(2, 2, scope.$index)"
                ></el-button>
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-arrow-down"
                  circle
                  @click="move(2, 1, scope.$index)"
                ></el-button>
                <el-button
                  size="mini"
                  type="success"
                  @click="move(2, 3, scope.$index)"
                  >置顶</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- 秒杀拼团 -->
    <div class="module">
      <div class="title">
        <div class="module-title-name">秒杀拼团</div>
      </div>
      <div class="module-main">
        <div class="activity">
          <div>
            <el-form ref="form" label-width="80px">
              <el-form-item style="width: 300px" label="左侧-秒杀:">
                <el-switch
                  v-if="module_map.module_3_map"
                  v-model="module_map.module_3_map[0].is_show"
                  :active-value="1"
                  :inactive-value="0"
                  active-text="显示"
                  inactive-text="不显示"
                  @change="saveIcon(3)"
                ></el-switch>
              </el-form-item>
            </el-form>
          </div>
          <div>
            <el-form ref="form" label-width="80px">
              <el-form-item style="width: 300px" label="右侧-拼团:">
                <el-switch
                  v-if="module_map.module_4_map"
                  v-model="module_map.module_4_map[0].is_show"
                  :active-value="1"
                  :inactive-value="0"
                  active-text="显示"
                  inactive-text="不显示"
                  @change="saveIcon(4)"
                ></el-switch>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>

    <!-- 新品上市 -->
    <div class="module">
      <div class="title" style="margin-bottom: 30px">
        <div class="module-title-name">新品上市</div>
        <div class="module-isShow-btn">
          <el-button size="medium" @click="saveIcon(5, 1)" type="success"
            >保存设置</el-button
          >
        </div>
      </div>
      <div class="module-main">
        <div style="margin-bottom: 15px">
          <el-button @click="onAddProduct(5)" icon="el-icon-plus" type="primary"
            >添加商品</el-button
          >
          <el-button
            icon="el-icon-close"
            type="warning"
            @click="recommenddetele(5)"
            >删除</el-button
          >
        </div>
        <el-table
          :data="module_map.module_5_map"
          max-height="600"
          border
          fit
          @selection-change="
            (val) => {
              this.module_map.module_5_map.multipleSelection = val;
            }
          "
        >
          <el-table-column fixed type="selection" align="center" width="55" />
          <el-table-column align="center" prop="product_id" label="商品ID" />
          <el-table-column
            align="center"
            min-width="200px"
            prop="product_name"
            label="商品名称"
          />
          <el-table-column align="center" prop="product_price" label="销售价" />
          <el-table-column align="center" prop="product_stock" label="库存量" />
          <el-table-column min-width="180" align="center" label="排序">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-arrow-up"
                circle
                @click="move(5, 2, scope.$index)"
              ></el-button>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-arrow-down"
                circle
                @click="move(5, 1, scope.$index)"
              ></el-button>
              <el-button
                size="mini"
                type="success"
                @click="move(5, 3, scope.$index)"
                >置顶</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 套餐食谱-->
    <div class="module">
      <div class="title">
        <div class="module-title-name">套餐食谱</div>
        <el-button
          size="medium"
          type="success"
          @click="sortYouMother(module_map.module_6_map)"
          >保存设置</el-button
        >
      </div>
      <div class="module-main">
        <div style="margin: 30px 0">
          <el-button type="primary" @click="Showselected(6, 1)">添加</el-button>
          <el-button type="success" @click="editdata(6)">编辑</el-button>
          <el-button type="warning" @click="selecteddel(6)">删除</el-button>
        </div>
        <el-table
          :data="module_map.module_6_map"
          max-height="600"
          border
          fit
          @selection-change="
            (val) => {
              this.module_map.module_6_map.multipleSelection = val;
            }
          "
        >
          <el-table-column fixed type="selection" align="center" width="55" />
          <el-table-column align="center" prop="food_name" label="食谱名称" />
          <el-table-column align="center" prop="count" label="套餐商品数量" />
          <el-table-column align="center" prop="original_price" label="原价" />
          <el-table-column align="center" prop="meal_price" label="套餐价格" />
          <el-table-column min-width="200" align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                :type="scope.row.is_show == 0 ? 'info' : 'success'"
                @click="cateselectedshow(scope.row)"
                >{{ scope.row.is_show == 0 ? "不显示" : "显示" }}</el-button
              >
            </template>
          </el-table-column>
          <el-table-column min-width="200" align="center" label="排序">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                @click="move(6, 3, scope.$index)"
                >置顶</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 全国特产 -->
    <!-- <div class="module">
      <div class="title" style="margin-bottom: 30px">
        <div class="module-title-name">全国特产</div>
        <div class="module-isShow-btn">
          <el-button size="medium" @click="saveIcon(7, 1)" type="success"
            >保存设置</el-button
          >
        </div>
      </div>
      <div class="module-main">
        <div style="margin-bottom: 15px">
          <el-button @click="onAddProduct(7)" icon="el-icon-plus" type="primary"
            >添加商品</el-button
          >
          <el-button
            icon="el-icon-close"
            type="warning"
            @click="recommenddetele(7)"
            >删除</el-button
          >
        </div>

        <el-table
          :data="module_map.module_7_map"
          max-height="600"
          border
          fit
          @selection-change="
            (val) => {
              this.module_map.module_7_map.multipleSelection = val;
            }
          "
        >
          <el-table-column fixed type="selection" align="center" width="55" />
          <el-table-column align="center" prop="product_id" label="商品ID" />
          <el-table-column
            align="center"
            min-width="200px"
            prop="product_name"
            label="商品名称"
          />
          <el-table-column align="center" prop="product_price" label="销售价" />
          <el-table-column align="center" prop="product_stock" label="库存量" />
          <el-table-column min-width="180" align="center" label="排序">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-arrow-up"
                circle
                @click="move(7, 2, scope.$index)"
              ></el-button>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-arrow-down"
                circle
                @click="move(7, 1, scope.$index)"
              ></el-button>
              <el-button
                size="mini"
                type="success"
                @click="move(7, 3, scope.$index)"
                >置顶</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div> -->

    <!-- 会员专享 -->
    <div class="module">
      <div class="title">
        <div class="module-title-name">会员专享</div>
        <div class="module-isShow-btn">
          <el-button
            @click="saveIcon(8, 1)"
            type="success"
            size="medium"
            style="margin-left: 10px"
            >保存设置</el-button
          >
        </div>
      </div>
      <div class="module-main">
        <div style="margin: 30px 0" class="laberImp">
          ( 注:会员特卖商品仅超级会员购买 )
        </div>
        <div>
          <div style="margin-bottom: 15px">
            <el-button
              @click="onAddProduct(8)"
              icon="el-icon-plus"
              type="primary"
              >添加商品</el-button
            >
            <el-button
              icon="el-icon-close"
              type="warning"
              @click="recommenddetele(8)"
              >删除</el-button
            >
          </div>
          <el-table
            :data="module_map.module_8_map"
            border
            @selection-change="
              (val) => {
                this.module_map.module_8_map.multipleSelection = val;
              }
            "
            style="width: 100%"
            fit
          >
            <el-table-column
              fixed
              type="selection"
              width="55"
            ></el-table-column>

            <el-table-column align="center" prop="product_id" label="商品ID" />
            <el-table-column
              align="center"
              min-width="200px"
              prop="product_name"
              label="商品名称"
            />
            <el-table-column
              align="center"
              prop="product_price"
              label="销售价"
            />
            <el-table-column
              align="center"
              prop="product_stock"
              label="库存量"
            />
            <el-table-column min-width="180" align="center" label="排序">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-arrow-up"
                  circle
                  @click="move(8, 2, scope.$index)"
                ></el-button>
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-arrow-down"
                  circle
                  @click="move(8, 1, scope.$index)"
                ></el-button>
                <el-button
                  size="mini"
                  type="success"
                  @click="move(8, 3, scope.$index)"
                  >置顶</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- 商家专卖 -->
    <div class="module">
      <div class="title">
        <div class="module-title-name">商家专卖</div>
        <div class="module-isShow-btn">
          <el-button
            @click="saveIcon(9, 1)"
            type="success"
            size="medium"
            style="margin-left: 10px"
            >保存设置</el-button
          >
        </div>
      </div>
      <div class="module-main">
        <div style="margin: 30px 0" class="laberImp">
          ( 注:推荐的商家根据用户配送 )
        </div>
        <div>
          <div style="margin-bottom: 15px">
            <el-button
              @click="onAddProduct(9)"
              icon="el-icon-plus"
              type="primary"
              >添加商品</el-button
            >
            <el-button
              icon="el-icon-close"
              type="warning"
              @click="recommenddetele(9)"
              >删除</el-button
            >
          </div>
          <el-table
            :data="module_map.module_9_map"
            border
            @selection-change="
              (val) => {
                this.module_map.module_9_map.multipleSelection = val;
              }
            "
            style="width: 100%"
            fit
          >
            <el-table-column
              fixed
              type="selection"
              width="55"
            ></el-table-column>
            <el-table-column fixed align="center" prop="id" label="商家Id" />
            <el-table-column
              width="200"
              align="center"
              prop="store_name"
              label="商家名称"
            />
            <el-table-column
              align="center"
              prop="store_start_time"
              label="开始时间"
            />
            <el-table-column
              align="center"
              prop="store_end_time"
              label="结束时间"
            />
            <el-table-column min-width="180" align="center" label="排序">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-arrow-up"
                  circle
                  @click="move(9, 2, scope.$index)"
                ></el-button>
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-arrow-down"
                  circle
                  @click="move(9, 1, scope.$index)"
                ></el-button>
                <el-button
                  size="mini"
                  type="success"
                  @click="move(9, 3, scope.$index)"
                  >置顶</el-button
                >
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="ggoy(scope)"
                  size="mini"
                  :type="scope.row.end_time ? 'primary' : 'success'"
                  >{{ scope.row.end_time ? "修改规则" : "新增规则" }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- 原产地直供-->
    <div class="module">
      <div class="title">
        <div class="module-title-name">原产地直供</div>
        <div class="module-title-main" />
        <div class="module-isShow-btn">
          <el-button
            size="medium"
            type="success"
            @click="sortYouMother(module_map.module_10_map)"
            >保存设置</el-button
          >
        </div>
      </div>
      <div class="module-main">
        <div style="margin: 30px 0">
          <el-button type="primary" @click="Showselected(10, 1)"
            >新增</el-button
          >
          <el-button type="warning" @click="selecteddel(10)">删除</el-button>
        </div>
        <el-table
          :data="module_map.module_10_map"
          max-height="600"
          border
          fit
          @selection-change="
            (val) => {
              this.module_map.module_10_map.multipleSelection = val;
            }
          "
        >
          <el-table-column fixed type="selection" align="center" width="55" />
          <el-table-column align="center" prop="name" label="名称" />
          <el-table-column min-width="200" align="center" label="图片">
            <template slot-scope="scope">
              <img
                :src="scope.row.image_url"
                style="width: 100px; height: 100px"
                alt="图片"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" prop="count" label="商品数量" />
          <el-table-column min-width="200" align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                @click="editdata(10, scope.row.config_id)"
                >编辑</el-button
              >
              <el-button
                :type="scope.row.is_show == 0 ? 'info' : 'success'"
                @click="cateselectedshow(scope.row)"
                >{{ scope.row.is_show == 0 ? "不显示" : "显示" }}</el-button
              >
            </template>
          </el-table-column>
          <el-table-column min-width="200" align="center" label="排序">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-arrow-up"
                circle
                @click="move(10, 2, scope.$index)"
              ></el-button>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-arrow-down"
                circle
                @click="move(10, 1, scope.$index)"
              ></el-button>
              <el-button
                size="mini"
                type="success"
                @click="move(10, 3, scope.$index)"
                >置顶</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 集市商超-->
    <div class="module">
      <div class="title">
        <div class="module-title-name">集市商超</div>
        <div class="module-title-main" />
        <div class="module-isShow-btn">
          <el-button
            size="medium"
            type="success"
            @click="sortYouMother(module_map.module_11_map)"
            >保存设置</el-button
          >
        </div>
      </div>
      <div class="module-main">
        <div style="margin: 30px 0">
          <el-button type="primary" @click="Showselected(11, 1)"
            >新增</el-button
          >
          <el-button type="warning" @click="selecteddel(11)">删除</el-button>
        </div>
        <el-table
          :data="module_map.module_11_map"
          max-height="600"
          border
          fit
          @selection-change="
            (val) => {
              this.module_map.module_11_map.multipleSelection = val;
            }
          "
        >
          <el-table-column fixed type="selection" align="center" width="55" />
          <el-table-column align="center" prop="name" label="名称" />
          <el-table-column min-width="200" align="center" label="图片">
            <template slot-scope="scope">
              <img
                :src="scope.row.image_url"
                style="width: 100px; height: 100px"
                alt="图片"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" prop="count" label="商品数量" />
          <el-table-column min-width="200" align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                @click="editdata(11, scope.row.config_id)"
                >编辑</el-button
              >
              <el-button
                :type="scope.row.is_show == 0 ? 'info' : 'success'"
                @click="cateselectedshow(scope.row)"
                >{{ scope.row.is_show == 0 ? "不显示" : "显示" }}</el-button
              >
            </template>
          </el-table-column>
          <el-table-column min-width="200" align="center" label="排序">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-arrow-up"
                circle
                @click="move(11, 2, scope.$index)"
              ></el-button>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-arrow-down"
                circle
                @click="move(11, 1, scope.$index)"
              ></el-button>
              <el-button
                size="mini"
                type="success"
                @click="move(11, 3, scope.$index)"
                >置顶</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 套餐食谱模块 -->
    <PublicDialog
      v-if="ShowVisible"
      tsxTitle="添加食谱"
      :isShowVisible="ShowVisible"
      tsxWidth="1200px"
      @handleClose="handleClose"
    >
      <div slot="forms" style="width: 100%">
        <el-row style="margin-bottom: 30px">
          <el-button type="info" @click="handleClose">关闭</el-button>
          <el-button type="success" @click="saveIcon(moduleId)">保存</el-button>
        </el-row>
        <div>
          <el-form label-width="100">
            <el-form-item label="食谱名称:">
              <el-input
                v-model="selected.food_name"
                style="width: 300px"
                maxlength="10"
                placeholder="最多10字"
              />
            </el-form-item>
            <el-form-item label="套餐价格:">
              <el-input
                v-model="selected.meal_price"
                style="width: 300px"
                maxlength="10"
                placeholder="请输入"
              />
              <span>原价</span>
              <span style="color: red">￥{{ count }}</span>
            </el-form-item>
          </el-form>
          <div style="margin: 30px 0 15px">
            模块图片
            <span class="laberImp">图片规格 340*200</span>
          </div>
          <Upimg
            :exporteurl="exporteurl"
            :fileList="imglist"
            fileName="image"
            :showList="true"
            :fileHeaders="headers"
            :maxlimit="1"
            :index="4"
            @Successimg="SuccessimgArray"
          />
          <div>
            <p>视频上传</p>
            <UpVideo
              :exporteurl="exporteurlVideo"
              :fileList="Video"
              fileName="video"
              :showList="true"
              :fileHeaders="headers"
              :maxlimit="1"
              :index="8"
              @Successfile="SuccessVideo"
              @RemoveVideo="RemoveVideo"
            />
          </div>
          <div style="margin: 15px 0">
            <el-button type="primary" @click="onAddProduct(6)"
              >添加商品</el-button
            >
            <el-button type="warning" @click="recommenddetele(1)"
              >删除</el-button
            >
          </div>

          <!-- 商品列表增添 -->
          <el-table
            :data="selected.product_list"
            style="width: 100%"
            max-height="200"
            @selection-change="
              (val) => {
                this.selected.multipleSelection = val;
              }
            "
          >
            <el-table-column fixed type="selection" align="center" width="55" />
            <el-table-column align="center" prop="product_id" label="商品ID" />
            <el-table-column
              align="center"
              min-width="200px"
              prop="product_name"
              label="商品名称"
            />
            <el-table-column
              align="center"
              prop="product_price"
              label="销售价"
            />
            <el-table-column
              align="center"
              prop="product_stock"
              label="库存量"
            />
            <el-table-column min-width="200" align="center" label="排序">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-arrow-up"
                  circle
                  @click="move(12, 2, scope.$index)"
                ></el-button>
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-arrow-down"
                  circle
                  @click="move(12, 1, scope.$index)"
                ></el-button>
                <el-button
                  size="mini"
                  type="success"
                  @click="move(12, 3, scope.$index)"
                  >置顶</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </PublicDialog>

    <!-- 新增修改子模块 -->
    <PublicDialog
      v-if="ShowVisibles"
      :tsxTitle="moduleId == 11 ? '集市商超' : '原产地直供'"
      :isShowVisible="ShowVisibles"
      tsxWidth="1200px"
      @handleClose="handleClose"
    >
      <div slot="forms" style="width: 100%">
        <el-row style="margin-bottom: 30px">
          <el-button type="info" @click="handleClose">关闭</el-button>
          <el-button type="success" @click="saveIcon(moduleId)">保存</el-button>
        </el-row>
        <div>
          <el-form label-width="100">
            <el-form-item label="名称:">
              <el-input
                v-model="garbage.name"
                style="width: 300px"
                maxlength="10"
                placeholder="0/10"
              />
            </el-form-item>
            <el-form-item label="排列方式">
              <el-radio-group value="2">
                <el-radio label="2">单排</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="模块图片">
              <Upimg
                :exporteurl="exporteurl"
                :fileList="imglist"
                fileName="image"
                :showList="true"
                :fileHeaders="headers"
                :maxlimit="1"
                :index="5"
                @Successimg="SuccessimgArray"
              />
            </el-form-item>
            <el-form-item label="背景图片">
              <Upimg
                :exporteurl="exporteurl"
                :fileList="bg_imglist"
                fileName="image"
                :showList="true"
                :fileHeaders="headers"
                :maxlimit="1"
                :index="6"
                @Successimg="SuccessimgArray"
              />
            </el-form-item>

            <el-form-item label="背景色">
              <el-color-picker
                style="width: 60px"
                v-model="garbage.bg_color"
                show-alpha
              ></el-color-picker>
              <!-- <div
                :style="'background-color:'+ (garbage.bg_color || '#f5f5f5')"
                class="show-color"
                style="width: 60px; "
              >显示内容</div>-->
            </el-form-item>
          </el-form>

          <!-- <div style="margin:30px 0 15px;">
            背景图片
            <span class="laberImp">图片规格 340*200</span>
          </div>
          <Upimg
            :exporteurl="exporteurl"
            :fileList="bg_imglist"
            fileName="image"
            :showList="true"
            :fileHeaders="headers"
            :maxlimit="1"
            :index="6"
            @Successimg="SuccessimgArray"
          />

          <div style="margin:30px 0 15px;">
            模块图片
            <span class="laberImp">图片规格 340*200</span>
          </div>
          <Upimg
            :exporteurl="exporteurl"
            :fileList="imglist"
            fileName="image"
            :showList="true"
            :fileHeaders="headers"
            :maxlimit="1"
            :index="5"
            @Successimg="SuccessimgArray"
          />-->
          <div style="margin-top: 15px">
            <el-form label-width="100" @submit.native.prevent>
              <el-form-item label="跳转链接">
                <el-radio-group v-model="garbage.jump_type" @change="onInput">
                  <el-radio label="0">生成商品列表</el-radio>
                  <el-radio label="1">
                    <span>指定分类</span>
                    <el-select v-model="garbage.jump_url" placeholder="请选择">
                      <el-option
                        v-for="item in classdata"
                        :key="item.key"
                        :label="item.value"
                        :value="item.key"
                      ></el-option>
                    </el-select>
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
          <div style="margin: 15px 0">
            <el-button type="primary" @click="onAddProduct(moduleId)"
              >添加商品</el-button
            >
            <el-button type="warning" @click="recommenddetele(2)"
              >删除</el-button
            >
          </div>

          <!-- 商品列表增添 -->
          <el-table
            :data="garbage.product_list"
            style="width: 100%"
            max-height="200"
            @selection-change="
              (val) => {
                this.garbage.multipleSelection = val;
              }
            "
          >
            <el-table-column fixed type="selection" align="center" width="55" />
            <el-table-column align="center" prop="product_id" label="商品ID" />
            <el-table-column
              align="center"
              min-width="200px"
              prop="product_name"
              label="商品名称"
            />
            <el-table-column
              align="center"
              prop="product_price"
              label="销售价"
            />
            <el-table-column
              align="center"
              prop="product_stock"
              label="库存量"
            />
            <el-table-column min-width="200" align="center" label="排序">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-arrow-up"
                  circle
                  @click="move(13, 2, scope.$index)"
                ></el-button>
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-arrow-down"
                  circle
                  @click="move(13, 1, scope.$index)"
                ></el-button>
                <el-button
                  size="mini"
                  type="success"
                  @click="move(13, 3, scope.$index)"
                  >置顶</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </PublicDialog>

    <product
      v-if="product_show"
      :module_id="moduleId"
      :product_ids="product_ids"
      :agent="agent_id"
      @Selection="SelectionProduct"
      @shut="product_show = false"
    />

    <PublicDialog
      v-if="timeshow"
      tsxTitle="配置规则"
      :isShowVisible="timeshow"
      tsxWidth="600px"
      @handleClose="handleClose"
    >
      <div slot="forms" style="width: 100%">
        <el-date-picker
          v-model="time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <span slot="footer" class="dialog-footer">
          <el-button @click="timeshow = false">取 消</el-button>
          <el-button type="primary" @click="addRule()">确 定</el-button>
        </span>
      </div>
    </PublicDialog>
  </div>
</template>

<script>
import vuedraggable from "vuedraggable";
import {
  exporteurl,
  arrRoofPlacement,
  arrDisplacement,
  conversiontime,
} from "@/utils/user";
import { upimg, upVideo } from "@/api/user";
import Upimg from "@/components/Upimg";
import { parseTime } from "@/utils/index";
import { Tips } from "@/utils/elementEncapsulation";
import PublicDialog from "@/components/PublicDialog";
import AddCommodity from "@/components/AddCommodity";
import product from "@/components/product";
import {
  base_map,
  indexpage2add1,
  indexpage2edit1,
  indexpage2info1,
  indexpage2lists,
  indexpage2add_store_time,
  indexpage2del,
  indexpage2sort,
  indexpage2check_show,
} from "@/api/indexPageSet/newIndex";
import UpVideo from "@/components/UpVideo";
export default {
  components: {
    vuedraggable,
    Upimg,
    PublicDialog,
    AddCommodity,
    product,
    UpVideo,
  },
  props: {},
  data() {
    return {
      ShowVisible: false,
      exporteurl: exporteurl + upimg, // 图片上传公共地址
      headers: {
        // 图片上传携带的头
        token: localStorage.getItem("Token"),
        enctype: "multipart/form-data",
      },
      exporteurlVideo: exporteurl + upVideo,
      agent_id: JSON.parse(localStorage.getItem("user")).agent_id,
      agent: [],
      isAll: false, // 是否多个代理区域一并设置
      multipleSelection: [],
      // icon配置数据
      iconModule: {
        icon_data: [], // icon 列表 其余数据 由接口补充
      },
      showAddIcon: false, // 是否显示添加ICON弹窗
      product_ids: [],
      selecteddatalist: [],
      selectionCommodity: [],
      product: false,
      selected_is_show: "1",
      selected_id: "",
      Video: [],
      imglist: [],
      adddete: 1,
      addIcon: {
        // icon 添加/修改弹窗
        name: "",
        icon: "", // icon图标CDN地址
        bg_img: "", // icon背景图片CDN地址
        bg_img_url: "", // 背景图片地址
        bg_color: "", // 背景色
        product_data: [], // 商品列表
        multipleSelection: [], // 选中的商品.
        jump_type: "6", // 跳转方式
        appoint_type: "", // 跳转页面地址Key
      },
      appoint_type_map: [], // 指定页面, 跳转地址
      hotMoney: {
        product_data: [], // 商品列表
        multipleSelection: [], // 选中的商品.
      },
      product_show: false,
      moduleId: 0,
      iconImage: [],
      iconBgImage: [],
      jump_type_map: [],
      module_map: [],
      selected: {},
      ShowVisibles: false,
      garbage: {},
      time: [],
      timeshow: false,
      shabia: "",
      count: 0,
      classdata: [],
      bg_imglist: [],
    };
  },
  methods: {
    changeradio(e) {
      if (e == 1) this.addIcon.appoint_type = this.addIcon.value;
      else this.addIcon.appoint_type = "";
    },
    onInput() {
      this.$forceUpdate();
    },
    /** 精选模块 */
    addproduct() {
      const product_ids = [];
      if (this.selected.product_list.length > 0) {
        for (const key in this.selected.product_list) {
          product_ids.push(this.selected.product_list[key].product_id);
        }
      }
      this.product_ids = product_ids;
      this.product = true;
    },
    setProduct() {
      this.product = false;
      this.product_ids = [];
    },
    SelectionProduct(val) {
      if (val && val.length > 0) {
        switch (this.moduleId) {
          case 1:
            this.addIcon.product_data = this.addIcon.product_data.concat(val);
            break;
          case 2:
            this.module_map.module_2_map = this.module_map.module_2_map.concat(
              val
            );
            break;
          case 5:
            this.module_map.module_5_map = this.module_map.module_5_map.concat(
              val
            );
            break;
          case 6:
            if (this.selected.product_list.length + val.length < 7) {
              this.selected.product_list = this.selected.product_list.concat(
                val
              );
              this.count = this.selected.product_list.flatMap((x) => [
                x.product_price,
              ]);
              this.count = eval(this.count.join("+"));
            } else {
              this.$message.error("最多选择六件商品");
            }
            break;
          case 7:
            this.module_map.module_7_map = this.module_map.module_7_map.concat(
              val
            );
            break;
          case 8:
            this.module_map.module_8_map = this.module_map.module_8_map.concat(
              val
            );
            break;
          case 9:
            this.module_map.module_9_map = this.module_map.module_9_map.concat(
              val
            );
            break;
          case 10:
            this.garbage.product_list = this.garbage.product_list.concat(val);
            break;
          case 11:
            this.garbage.product_list = this.garbage.product_list.concat(val);
            break;
          default:
            break;
        }
      }
      this.product_show = false;
    },

    Showselected(moduleId, tsx, val) {
      /** 新增编辑 */
      this.selected = {
        // 精选
        food_name: "",
        meal_price: "",
        image: "",
        image_url: "",
        product_list: [],
      };
      this.garbage = {
        name: "",
        image: "",
        image_url: "",
        jump_type: "0",
        jump_url: "",
        product_list: [],
      };
      this.bg_imglist = [];
      this.imglist = [];
      this.moduleId = moduleId;
      this.adddete = tsx;
      this.Video = [];
      // if (tsx != 1) {
      //   this.editdata(val);
      // }
      if (moduleId == 6) {
        this.ShowVisible = true;
      } else {
        this.ShowVisibles = true;
      }
      this.configuration();
    },
    handleClose() {
      this.ShowVisible = false;
      this.product_show = false;
      this.showAddIcon = false;
      this.ShowVisibles = false;
      this.timeshow = false;
    },
    selectCommodity(val) {
      const arr = [];
      val.map((res) => {
        arr.push(res);
      });
      this.selectionCommodity = arr;
    },
    SuccessVideo(val) {
      console.log(val);
      this.Video = val;
    },
    RemoveVideo() {
      this.Video = [];
    },
    /** 子模块删除 */
    recommenddetele(val) {
      if (val == 1) {
        if (this.selected.multipleSelection.length > 0) {
          for (const i in this.selected.product_list) {
            for (const key in this.selected.multipleSelection) {
              if (
                this.selected.product_list[i].product_id ===
                this.selected.multipleSelection[key].product_id
              ) {
                this.selected.product_list.splice(i, 1);
              }
            }
            this.count = this.selected.product_list.flatMap((x) => [
              x.product_price,
            ]);
            this.count = eval(this.count.join("+"));
          }
        } else {
          this.$message.error("请先选中需要删除的商品");
        }
      } else if (val == 2) {
        if (this.garbage.multipleSelection.length > 0) {
          for (const i in this.garbage.product_list) {
            for (const key in this.garbage.multipleSelection) {
              if (
                this.garbage.product_list[i].product_id ===
                this.garbage.multipleSelection[key].product_id
              ) {
                this.garbage.product_list.splice(i, 1);
              }
            }
          }
        } else {
          this.$message.error("请先选中需要删除的商品");
        }
      } else if (val == 3) {
        if (this.addIcon.multipleSelection.length > 0) {
          for (const i in this.addIcon.product_data) {
            for (const key in this.addIcon.multipleSelection) {
              if (
                this.addIcon.product_data[i].product_id ===
                this.addIcon.multipleSelection[key].product_id
              ) {
                this.addIcon.product_data.splice(i, 1);
              }
            }
          }
        } else {
          this.$message.error("请先选中需要删除的商品");
        }
      } else if (val == 4) {
        if (this.module_map.module_2_map.multipleSelection.length > 0) {
          for (const i in this.module_map.module_2_map) {
            for (const key in this.module_map.module_2_map.multipleSelection) {
              if (
                this.module_map.module_2_map[i].product_id ===
                this.module_map.module_2_map.multipleSelection[key].product_id
              ) {
                this.module_map.module_2_map.splice(i, 1);
              }
            }
          }
        } else {
          this.$message.error("请先选中需要删除的商品");
        }
      } else if (val == 5) {
        if (this.module_map.module_5_map.multipleSelection.length > 0) {
          for (const i in this.module_map.module_5_map) {
            for (const key in this.module_map.module_5_map.multipleSelection) {
              if (
                this.module_map.module_5_map[i].product_id ===
                this.module_map.module_5_map.multipleSelection[key].product_id
              ) {
                this.module_map.module_5_map.splice(i, 1);
              }
            }
          }
        } else {
          this.$message.error("请先选中需要删除的商品");
        }
      } else if (val == 7) {
        if (this.module_map.module_7_map.multipleSelection.length > 0) {
          for (const i in this.module_map.module_7_map) {
            for (const key in this.module_map.module_7_map.multipleSelection) {
              if (
                this.module_map.module_7_map[i].product_id ===
                this.module_map.module_7_map.multipleSelection[key].product_id
              ) {
                this.module_map.module_7_map.splice(i, 1);
              }
            }
          }
        } else {
          this.$message.error("请先选中需要删除的商品");
        }
      } else if (val == 8) {
        if (this.module_map.module_8_map.multipleSelection.length > 0) {
          for (const i in this.module_map.module_8_map) {
            for (const key in this.module_map.module_8_map.multipleSelection) {
              if (
                this.module_map.module_8_map[i].product_id ===
                this.module_map.module_8_map.multipleSelection[key].product_id
              ) {
                this.module_map.module_8_map.splice(i, 1);
              }
            }
          }
        } else {
          this.$message.error("请先选中需要删除的商品");
        }
      } else if (val == 9) {
        if (this.module_map.module_9_map.multipleSelection.length > 0) {
          for (const i in this.module_map.module_9_map) {
            for (const key in this.module_map.module_9_map.multipleSelection) {
              if (
                this.module_map.module_9_map[i].id ===
                this.module_map.module_9_map.multipleSelection[key].id
              ) {
                this.module_map.module_9_map.splice(i, 1);
              }
            }
          }
        } else {
          this.$message.error("请先选中需要删除的商品");
        }
      }
    },
    move(moduleId, val, index, tsx) {
      /** 上下移动 */
      switch (moduleId) {
        case 1:
          if (val == 3) {
            this.addIcon.product_data = arrRoofPlacement(
              this.addIcon.product_data,
              index
            );
          } else {
            this.addIcon.product_data = arrDisplacement(
              val,
              this.addIcon.product_data,
              index
            );
          }
          break;
        case 2:
          if (val == 3) {
            this.module_map.module_2_map = arrRoofPlacement(
              this.module_map.module_2_map,
              index
            );
          } else {
            this.module_map.module_2_map = arrDisplacement(
              val,
              this.module_map.module_2_map,
              index
            );
          }
          break;
        case 5:
          if (val == 3) {
            this.module_map.module_5_map = arrRoofPlacement(
              this.module_map.module_5_map,
              index
            );
          } else {
            this.module_map.module_5_map = arrDisplacement(
              val,
              this.module_map.module_5_map,
              index
            );
          }
          break;
        case 6:
          if (val == 3) {
            this.module_map.module_6_map = arrRoofPlacement(
              this.module_map.module_6_map,
              index
            );
          } else {
            this.module_map.module_6_map = arrDisplacement(
              val,
              this.module_map.module_6_map,
              index
            );
          }
          break;
        case 7:
          if (val == 3) {
            this.module_map.module_7_map = arrRoofPlacement(
              this.module_map.module_7_map,
              index
            );
          } else {
            this.module_map.module_7_map = arrDisplacement(
              val,
              this.module_map.module_7_map,
              index
            );
          }
          break;
        case 8:
          if (val == 3) {
            this.module_map.module_8_map = arrRoofPlacement(
              this.module_map.module_8_map,
              index
            );
          } else {
            this.module_map.module_8_map = arrDisplacement(
              val,
              this.module_map.module_8_map,
              index
            );
          }
          break;
        case 9:
          if (val == 3) {
            this.module_map.module_9_map = arrRoofPlacement(
              this.module_map.module_9_map,
              index
            );
          } else {
            this.module_map.module_9_map = arrDisplacement(
              val,
              this.module_map.module_9_map,
              index
            );
          }
          break;
        case 10:
          if (val == 3) {
            this.module_map.module_10_map = arrRoofPlacement(
              this.module_map.module_10_map,
              index
            );
          } else {
            this.module_map.module_10_map = arrDisplacement(
              val,
              this.module_map.module_10_map,
              index
            );
          }
          break;
        case 11:
          if (val == 3) {
            this.module_map.module_11_map = arrRoofPlacement(
              this.module_map.module_11_map,
              index
            );
          } else {
            this.module_map.module_11_map = arrDisplacement(
              val,
              this.module_map.module_11_map,
              index
            );
          }
          break;

        case 12:
          if (val == 3) {
            this.selected.product_list = arrRoofPlacement(
              this.selected.product_list,
              index
            );
          } else {
            this.selected.product_list = arrDisplacement(
              val,
              this.selected.product_list,
              index
            );
          }
          break;
        case 13:
          if (val == 3) {
            this.garbage.product_list = arrRoofPlacement(
              this.garbage.product_list,
              index
            );
          } else {
            this.garbage.product_list = arrDisplacement(
              val,
              this.garbage.product_list,
              index
            );
          }
          break;
        default:
          break;
      }
    },
    selecteddel(moduleId, config_id) {
      // 接口 删除
      let data = {};
      switch (moduleId) {
        case 1:
          data = {
            module_id: moduleId,
            config_id,
            value: [config_id],
          };
          break;
        case 2:
          data = {
            module_id: moduleId,
            config_id: this.module_map.module_2_map.multipleSelection[0]
              .config_id,
            value: this.module_map.module_2_map.multipleSelection.flatMap(
              (x) => [x.product_id]
            ),
          };
          break;
        case 5:
          data = {
            module_id: moduleId,
            config_id: this.module_map.module_5_map.multipleSelection[0]
              .config_id,
            value: this.module_map.module_5_map.multipleSelection.flatMap(
              (x) => [x.product_id]
            ),
          };
          break;
        case 6:
          data = {
            module_id: moduleId,
            config_id: this.module_map.module_6_map.multipleSelection[0]
              .config_id,
            value: this.module_map.module_6_map.multipleSelection.flatMap(
              (x) => [x.config_id]
            ),
          };
          break;
        case 7:
          data = {
            module_id: moduleId,
            config_id: this.module_map.module_7_map.multipleSelection[0]
              .config_id,
            value: this.module_map.module_7_map.multipleSelection.flatMap(
              (x) => [x.product_id]
            ),
          };
          break;
        case 8:
          data = {
            module_id: moduleId,
            config_id: this.module_map.module_8_map.multipleSelection[0]
              .config_id,
            value: this.module_map.module_8_map.multipleSelection.flatMap(
              (x) => [x.product_id]
            ),
          };
          break;
        case 9:
          data = {
            module_id: moduleId,
            config_id: this.module_map.module_9_map.multipleSelection[0]
              .config_id,
            value: this.module_map.module_9_map.multipleSelection.flatMap(
              (x) => [x.config_id]
            ),
          };
          break;
        case 10:
          data = {
            module_id: moduleId,
            config_id: this.module_map.module_10_map.multipleSelection[0]
              .config_id,
            value: this.module_map.module_10_map.multipleSelection.flatMap(
              (x) => [x.config_id]
            ),
          };
          break;
        case 11:
          data = {
            module_id: moduleId,
            config_id: this.module_map.module_11_map.multipleSelection[0]
              .config_id,
            value: this.module_map.module_11_map.multipleSelection.flatMap(
              (x) => [x.config_id]
            ),
          };
          break;
        default:
          break;
      }
      indexpage2del(data).then((res) => {
        if (res.code == 1) {
          this.getData();
          Tips({ that: this, type: "success", message: res.msg });
        } else Tips({ that: this, type: "error", message: res.msg });
      });
    },

    cateselectedshow(row) {
      //  是否显示精选推荐列表中模块
      indexpage2check_show({
        config_id: row.config_id,
        is_show: row.is_show == 1 ? 0 : 1,
      }).then((res) => {
        if (res.code == 1) {
          this.getData();
          Tips({ that: this, type: "success", message: res.msg });
        } else Tips({ that: this, type: "error", message: res.msg });
      });
    },

    /** 排序保存 */
    sortYouMother(config_id) {
      indexpage2sort({
        config_id: config_id.flatMap((x) => [x.config_id]),
      }).then((res) => {
        if (res.code == 1) {
          this.getData();
          Tips({ that: this, type: "success", message: res.msg });
        } else Tips({ that: this, type: "error", message: res.msg });
      });
    },

    /**
     * 添加商品列表
     * @param {Number} moduleId 板块Id
     */
    onAddProduct(moduleId) {
      switch (moduleId) {
        case 1: // 第一板块的添加商品 -- (添加/修改icon的弹窗中)
          this.product_ids = this.addIcon.product_data.flatMap((x) => [
            x.product_id,
          ]);
          break;
        case 2: // 爆款
          this.product_ids = this.module_map.module_2_map.flatMap((x) => [
            x.product_id,
          ]);
          break;
        case 5: // 新品上市
          this.product_ids = this.module_map.module_5_map.flatMap((x) => [
            x.product_id,
          ]);
          break;
        case 6: // 套餐食谱
          this.product_ids = this.selected.product_list.flatMap((x) => [
            x.product_id,
          ]);
          break;
        case 7: // 套餐食谱
          this.product_ids = this.module_map.module_7_map.flatMap((x) => [
            x.product_id,
          ]);
          break;
        case 8: // 套餐食谱
          this.product_ids = this.module_map.module_8_map.flatMap((x) => [
            x.product_id,
          ]);
          break;
        case 9: // 商家专卖
          this.product_ids = this.module_map.module_9_map.flatMap((x) => [
            x.id,
          ]);
          break;
        default:
          break;
      }
      this.moduleId = moduleId;
      this.product_show = true;
    },

    // 图片上传成功
    SuccessimgArray(e) {
      try {
        if (e.index == 1) {
          this.addIcon.image = e.imgArray[0] ? e.imgArray[0].imgPath : "";
          this.addIcon.image_url = e.imgArray[0] ? e.imgArray[0].url : "";
          this.iconImage = e.imgArray;
        } else if (e.index == 2) {
          this.addIcon.bg_img = e.imgArray[0] ? e.imgArray[0].imgPath : "";
          this.addIcon.bg_img_url = e.imgArray[0] ? e.imgArray[0].url : "";
          this.iconBgImage = e.imgArray;
        } else if (e.index == 3) {
          this.recommend_mask.image = e.imgArray[0]
            ? e.imgArray[0].imgPath
            : "";
          this.recommend_mask.image_url = e.imgArray[0]
            ? e.imgArray[0].url
            : "";
        } else if (e.index == 4) {
          this.selected.image = e.imgArray[0] ? e.imgArray[0].imgPath : "";
          this.selected.image_url = e.imgArray[0] ? e.imgArray[0].url : "";
          this.imglist = e.imgArray;
        } else if (e.index == 5) {
          this.garbage.image = e.imgArray[0] ? e.imgArray[0].imgPath : "";
          this.garbage.image_url = e.imgArray[0] ? e.imgArray[0].url : "";
          this.imglist = e.imgArray;
        } else if (e.index == 6) {
          this.garbage.bg_image = e.imgArray[0] ? e.imgArray[0].imgPath : "";
          this.garbage.bg_image_url = e.imgArray[0] ? e.imgArray[0].url : "";
          this.bg_imglist = e.imgArray;
        }
      } catch (error) {
        console.log("上传图片出现错误！", error);
      }
    },

    // 修改
    editdata(moduleId, config_id) {
      this.moduleId = moduleId;

      if (moduleId == 6) {
        if (
          this.module_map.module_6_map.multipleSelection &&
          this.module_map.module_6_map.multipleSelection.length == 1
        ) {
          config_id = this.module_map.module_6_map.multipleSelection[0]
            .config_id;
        } else {
          return this.$message.error("请选择一条");
        }
      }
      const data = {
        config_id,
        module_id: moduleId,
        agent_id: this.agent_id,
      };
      this.adddete = 2;
      indexpage2info1(data).then((res) => {
        if (res.code == 1) {
          switch (moduleId) {
            case 1:
              this.addIcon = res.data;
              this.addIcon.jump_type = this.addIcon.jump_type + "";
              if (this.addIcon.jump_type == 6) {
                this.addIcon.product_data = res.data.value;
                this.addIcon.appoint_type = "";
              } else {
                this.addIcon.appoint_type = res.data.value;
                this.addIcon.product_data = [];
              }
              if (res.data.bg_image && res.data.bg_image.length > 0) {
                this.iconBgImage = [
                  {
                    name: "",
                    imgPath: res.data.bg_image,
                    url: res.data.bg_image_url,
                  },
                ];
              } else this.iconBgImage = [];
              this.iconImage = [
                {
                  name: "",
                  imgPath: res.data.image,
                  url: res.data.image_url,
                },
              ];
              this.showAddIcon = true;
              this.configuration();
              break;
            case 6:
              this.selected = res.data;
              this.selected.product_list = res.data.value;
              this.imglist = [
                {
                  name: "",
                  imgPath: res.data.food_image,
                  url: res.data.food_image_url,
                },
              ];
              if (res.data.food_video_url) {
                this.Video = [
                  {
                    name: "",
                    video_path: res.data.food_video_url,
                    video_url: res.data.food_video_url,
                    video_cover_img: res.data.food_video_image_url,
                    url: res.data.food_video_image_url,
                  },
                ];
              } else this.Video = [];
              this.count = res.data.original_price;
              this.ShowVisible = true;
              this.configuration();
              break;
            case 10:
              this.garbage = res.data;
              if (res.data.bg_image.length > 0) {
                this.bg_imglist = [
                  {
                    name: "",
                    imgPath: res.data.bg_image,
                    url: res.data.bg_image_url,
                  },
                ];
              } else this.bg_imglist = [];

              this.imglist = [
                {
                  name: "",
                  imgPath: res.data.image,
                  url: res.data.image_url,
                },
              ];
              this.garbage.jump_type = res.data.jump_url_type + "";

              if (res.data.jump_url_type == 1) {
                this.garbage.jump_url = res.data.category_id;
              }
              this.garbage.product_list = res.data.value;
              this.ShowVisibles = true;
              this.garbage.jump_url;
              this.configuration();
              break;
            case 11:
              this.garbage = res.data;
              if (res.data.jump_url_type == 1) {
                this.garbage.jump_url = res.data.category_id;
              }
              if (res.data.bg_image.length > 0) {
                this.bg_imglist = [
                  {
                    name: "",
                    imgPath: res.data.bg_image,
                    url: res.data.bg_image_url,
                  },
                ];
              } else this.bg_imglist = [];
              this.garbage.product_list = res.data.value;
              this.imglist = [
                {
                  name: "",
                  imgPath: res.data.image,
                  url: res.data.image_url,
                },
              ];
              this.garbage.jump_type = res.data.jump_url_type + "";
              this.ShowVisibles = true;
              this.configuration();
              break;
            default:
              break;
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 添加icon
    clicktemp(val) {
      // 获取添加icon弹出的下拉参数（虽然我也觉得这个没必要重新请求）
      this.moduleId = val;
      this.showAddIcon = true;
      this.configuration();
      this.adddete = 1;
      this.iconBgImage = [];
      this.iconImage = [];
      this.addIcon = { jump_type: "6", appoint_type: "", product_data: [] };
    },

    // 拖拽排序操作
    changeSort() {
      // 当用户在icon中进行拖拽重新排序时
      // 设置一个防抖阀， 只进行最后一次设置的操作
      this.sortYouMother(this.module_map.module_1_map);
    },
    ggoy(row) {
      this.timeshow = true;
      this.shabia = row;
      this.time = [
        this.shabia.row.store_start_time,
        this.shabia.row.store_end_time,
      ];
    },
    addRule() {
      let tiem = conversiontime(this.time, 3);
      this.module_map.module_9_map[this.shabia.$index].store_start_time =
        tiem.start_time;
      this.module_map.module_9_map[this.shabia.$index].store_end_time =
        tiem.end_time;
      this.timeshow = false;
      Tips({ that: this, type: "success", message: "设置成功" });
      // indexpage2add_store_time({
      //   config_id: this.shabia.config_id || 0,
      //   store_start_time: tiem.start_time,
      //   store_end_time: tiem.end_time,
      // }).then((res) => {
      //   if (res.code == 1) {
      //     this.getData();
      //
      //     Tips({ that: this, type: "success", message: res.msg });
      //   } else Tips({ that: this, type: "error", message: res.msg });
      // });
    },

    // 保存icon弹窗的配置
    saveIcon(val, adddete) {
      let data = {};
      let value = [];
      if (adddete && adddete == 1) this.adddete = 1;
      if (val == 1) {
        if (this.addIcon.jump_type == 1) {
          this.appoint_type_map.map((res) => {
            if (res.key == this.addIcon.appoint_type) {
              // value.push({ appoint_type: res.key, url: res.url });
              value = { appoint_type: res.key, url: res.url };
            }
          });
        } else if (this.addIcon.jump_type == 6) {
          value = this.addIcon.product_data.flatMap((x) => [x.product_id]);
        } else {
          value = this.addIcon.appoint_type;
        }

        data = {
          module_id: this.moduleId,
          agent_id: this.agent_id,
          name: this.addIcon.name,
          bg_image: this.addIcon.bg_img,
          jump_type: this.addIcon.jump_type,
          value,
          image: this.addIcon.image,
          bg_color: this.addIcon.bg_color,
        };
        if (this.addIcon.config_id) {
          Object.assign(data, { config_id: this.addIcon.config_id });
        }
      } else if (val == 2 || val == 5 || val == 7 || val == 8 || val == 9) {
        let value = [];
        switch (val) {
          case 2:
            value = this.module_map.module_2_map.flatMap((x) => [x.product_id]);
            break;
          case 5:
            value = this.module_map.module_5_map.flatMap((x) => [x.product_id]);
            break;
          case 7:
            value = this.module_map.module_7_map.flatMap((x) => [x.product_id]);
            break;
          case 8:
            value = this.module_map.module_8_map.flatMap((x) => [x.product_id]);
            break;
          case 9:
            value = this.module_map.module_9_map;
            break;
          default:
            break;
        }
        this.moduleId = val;
        data = {
          module_id: this.moduleId,
          agent_id: this.agent_id,
          value,
        };
      } else if (val == 3 || val == 4) {
        this.moduleId = val;
        data = {
          module_id: this.moduleId,
          agent_id: this.agent_id,
          value:
            val == 3
              ? this.module_map.module_3_map[0].is_show
              : this.module_map.module_4_map[0].is_show,
        };
      } else if (val == 6) {
        this.moduleId = val;
        let [food_video_image, food_video_url] = ["", ""];
        if (this.Video.length > 0) {
          food_video_url = this.Video[0].video_path;
          food_video_image = this.Video[0].video_cover_img;
        } else {
          food_video_url = "";
          food_video_image = "";
        }
        data = {
          module_id: this.moduleId,
          agent_id: this.agent_id,
          food_name: this.selected.food_name,
          meal_price: this.selected.meal_price,
          food_image: this.selected.image,
          food_video_url,
          food_video_image,
          value: this.selected.product_list.flatMap((x) => [
            { product_id: x.product_id, product_price: x.product_price },
          ]),
        };
        if (this.selected.config_id) {
          Object.assign(data, { config_id: this.selected.config_id });
        }
      } else if (val == 10 || val == 11) {
        this.moduleId = val;
        data = {
          module_id: this.moduleId,
          agent_id: this.agent_id,
          name: this.garbage.name,
          image: this.garbage.image,
          jump_url_type: this.garbage.jump_type,
          bg_color: this.garbage.bg_color,
          bg_image: this.garbage.bg_image,
          value:
            this.garbage.product_list.length > 0
              ? this.garbage.product_list.flatMap((x) => [x.product_id])
              : [],
          category_id: this.garbage.jump_type == 1 ? this.garbage.jump_url : "",
        };
        Object.assign(data, { config_id: this.garbage.config_id });
      }
      if (this.adddete == 1) {
        indexpage2add1(data).then((res) => {
          if (res.code == 1) {
            this.$message.success(res.msg);
            this.iconBgImage = [];
            this.iconImage = [];
            this.getData();
            this.addIcon = { jump_type: 1, appoint_type: "", product_data: [] };
            this.ShowVisible = false;
            this.product_show = false;
            this.showAddIcon = false;
            this.ShowVisibles = false;
          } else {
            this.$message.warning(res.msg);
          }
        });
      } else {
        indexpage2edit1(data).then((res) => {
          if (res.code == 1) {
            this.$message.success(res.msg);
            this.iconBgImage = [];
            this.iconImage = [];
            this.getData();
            this.addIcon = { jump_type: 1, appoint_type: "", product_data: [] };
            this.ShowVisible = false;
            this.product_show = false;
            this.showAddIcon = false;
            this.ShowVisibles = false;
          } else {
            this.$message.warning(res.msg);
          }
        });
      }
    },
    /* icon板块控制 end */

    /** 新增/编辑 新首页配置基础信息 */
    configuration() {
      base_map({
        module_id: this.moduleId,
        agent_id: this.agent_id,
      }).then((res) => {
        if (res.code == 1) {
          switch (this.moduleId) {
            case 1:
              this.appoint_type_map = res.data.appoint_type_map;
              break;
            case 10:
              this.classdata = res.data;
              break;
            case 11:
              this.classdata = res.data;
              break;
            default:
              break;
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getData() {
      indexpage2lists({
        agent_id: this.agent_id,
      }).then((res) => {
        if (res.code == 1) {
          this.agent = res.agent_map;
          this.module_map = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
  created() {
    this.getData();
  },
};
</script>

<style lang="scss" scoped>
.root {
  padding: 40px;
  .laberImp {
    font-size: 14px;
    color: red;
    margin-left: 15px;
  }
  .module {
    padding: 30px;
    margin: 20px auto;
    background-color: #f5f5f5;
    .title {
      border-bottom: 1px solid rgb(146, 141, 141);
      padding-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .module-title-name {
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: bold;
      }
      .module-title-main {
        margin-bottom: -18px;
      }
    }
  }
}
.iconList {
  .laber {
    font-size: 18px;
    line-height: 50px;
    margin: 20px 0;
    span {
      margin: 0 10px;
      font-size: 14px;
      color: rgb(110, 107, 107);
    }
  }
  .iconItem {
    background-color: #fff;
    // width: 300px;
    padding: 10px;
    padding-bottom: 0;
    display: inline-block;
    margin: 10px;

    img {
      width: 80px;
      height: 80px;
      border-radius: 6px;
      background-color: rgb(109, 101, 101);
      margin-right: 10px;
      line-height: 80px;
      color: rgb(100, 98, 98);
      text-align: center;
      font-size: 14px;
      flex-shrink: 0;
      float: left;
    }
    > div {
      float: left;

      > div {
        margin: 15px auto;
        max-width: 130px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
}
.add-icon-mask {
  .add-icon-title {
    margin: 0 -20px 20px;
    padding-bottom: 20px;
    padding-right: 50px;
    border-bottom: 1px solid rgb(216, 210, 210);
    display: flex;
    justify-content: flex-end;
  }
  .add-icon-form {
    max-height: 60vh;
    overflow-y: scroll;
  }
  .img-update {
    width: 700px;
    display: flex;
    justify-content: space-between;
    > div {
      width: 350px;
      font-size: 14px;
      color: #9b9797;
      > div {
        display: flex;
      }
    }
  }
  .show-color {
    display: inline-block;
    width: 100px;
    height: 50px;
    color: #fff;
    font-size: 14px;
    text-align: center;
    line-break: 50px;
    vertical-align: middle;
  }
  .radio-item {
    margin: 25px 0;
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
}
.activity {
  display: flex;
  justify-content: space-around;
  padding: 30px;
}
</style>