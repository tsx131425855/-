<template>
  <div class="root">
    <div class="agent">
      <!-- <el-switch  v-model="isAll" active-text="同步"></el-switch> -->
      <el-select v-model="agent_id" placeholder="请选择" @change="changSite">
        <el-option v-for="item in agent" :key="item.key" :label="item.val" :value="item.key"></el-option>
      </el-select>
      <span class="laberImp">注意: 在切换地区时请确认当前配置是否保存 (切换后会放弃未保存的设置)</span>
    </div>

    <!-- icon配置 start -->
    <div class="module iconList">
      <div class="title">
        <div class="module-title-name">第一板块: 顶部Icon(不限个数)</div>

        <div class="module-title-main"></div>

        <div class="module-isShow-btn">
          <el-switch
            style="margin: 0 20px;"
            v-show="iconModule.id"
            v-model="iconModule.is_show"
            @change="val => checkShow(iconModule.id, val)"
            :active-value="1"
            :inactive-value="0"
            active-text="显示"
            inactive-text="不显示"
          ></el-switch>
          <el-button size="medium" @click="checkIconType" type="success">保存设置</el-button>
        </div>
      </div>
      <div class="module-main">
        <div>
          <div class="laber">
            <el-radio v-model="iconModule.icon_type" :label="1">
              <b>自定义</b>
            </el-radio>ICON
            <span>可拖动排序(自动刷新)</span>
            <el-button size="medium" @click="addNewIcon" icon="el-icon-plus" type="primary">添加</el-button>
          </div>
          <vuedraggable class="wrapper" @change="changeSort" v-model="iconModule.icon_data">
            <transition-group>
              <div class="iconItem" v-for=" item in iconModule.icon_data" :key="item.id">
                <img :src="item.icon" :alt="item.name" />
                <div>
                  <div>{{ item.name}}</div>
                  <div>
                    <el-button @click="editIcon(item.id)" plain type="primary">编辑</el-button>
                    <el-button @click="deleteIcon(item.id)" plain type="warning">删除</el-button>
                  </div>
                </div>
              </div>
            </transition-group>
          </vuedraggable>
        </div>
        <div style="margin-top: 40px;">
          <el-radio v-model="iconModule.icon_type" :label="0">
            <b>展示加盟乡镇</b>
          </el-radio>
          <span style="font-size: 14px;color:#6e6b6b;">选择该项将自动在首页展示当前加盟乡镇， 用户可查看乡镇当地的商品</span>
          <Upimg
            :disabled="iconModule.icon_type != 0"
            style="margin: 20px;"
            :exporteurl="exporteurl"
            :fileList="iconModuleImage"
            fileName="image"
            :showList="true"
            :fileHeaders="headers"
            :maxlimit="1"
            :index="3"
            @Successimg="SuccessimgArray"
          ></Upimg>
        </div>
      </div>
    </div>

    <!-- 第一板块 icon添加/修改弹窗 -->
    <el-dialog title="icon管理" top="50px" :before-close="resetIconMask" :visible.sync="showAddIcon">
      <div class="add-icon-mask">
        <div class="add-icon-title">
          <el-button size="medium" @click="saveIcon" type="primary">保存</el-button>
          <el-button size="medium" @click="resetIconMask" type="info">取消</el-button>
        </div>
        <div class="add-icon-form">
          <el-form ref="form" :model="addIcon" label-width="80px">
            <el-form-item style="width: 300px" label="标题">
              <el-input placeholder="标题名称 (至多四个字)" maxlength="4" v-model="addIcon.name"></el-input>
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
                    @Successimg="SuccessimgArray"
                  ></Upimg>
                </div>
                <div>
                  <div style="font-size:14px; color:#606266; font-weight: 700">
                    背景图
                    <span
                      style="font-size:14px; color: #9b9797; font-weight: 400;margin-left: 10px"
                    >限一张, jpg,png模式; 大小200px*200px</span>
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

            <el-form-item label-width="200px" label="板块背景色(配合背景图设置):">
              <el-color-picker style="width: 60px; " v-model="addIcon.bg_color" show-alpha></el-color-picker>
              <div
                :style="'background-color:'+ (addIcon.bg_color || '#f5f5f5')"
                class="show-color"
              >显示内容</div>
            </el-form-item>

            <el-form-item label="特殊资源">
              <el-radio-group v-model="addIcon.jump_type">
                <div class="radio-item">
                  <el-radio label="1">小程序指定页面</el-radio>
                  <el-select v-model="addIcon.appoint_type" placeholder="请选择跳转页面">
                    <el-option label="未指定" value="0"></el-option>
                    <el-option
                      v-for="item in addIcon.appoint_type_map"
                      :key="item.key"
                      :label="item.val"
                      :value="item.key"
                    ></el-option>
                  </el-select>
                </div>
                <div class="radio-item">
                  <el-radio label="2">小程序指定商品</el-radio>
                  <el-input
                    :disabled="addIcon.jump_type != 2"
                    v-model="icon_extra.product_id"
                    style="width:250px"
                    placeholder="请输入指定商品Id"
                  ></el-input>
                </div>
                <div class="radio-item">
                  <el-radio label="3">小程序指定商家</el-radio>
                  <el-input
                    :disabled="addIcon.jump_type != 3"
                    v-model="icon_extra.store_id"
                    style="width:250px"
                    placeholder="请输入指定商家Id"
                  ></el-input>
                </div>
                <div class="radio-item">
                  <el-radio label="4">小程序指定楼盘</el-radio>
                  <el-input
                    :disabled="addIcon.jump_type != 4"
                    v-model="icon_extra.house_id"
                    style="width:250px"
                    placeholder="请输入指定楼盘Id"
                  ></el-input>
                </div>
                <div class="radio-item">
                  <el-radio label="6">自定义链接</el-radio>
                  <el-input
                    :disabled="addIcon.jump_type != 6"
                    v-model="addIcon.url"
                    style="width:300px"
                    placeholder="请输入小程序链接地址"
                  ></el-input>
                </div>
                <div class="radio-item">
                  <el-radio label="5">选定商品</el-radio>
                  <div class="add-icon-productList">
                    <div>
                      <el-button @click="onAddProduct(1)" icon="el-icon-plus" type="primary">添加</el-button>
                      <el-button
                        icon="el-icon-close"
                        @click="addIcon.product_data = addIcon.product_data.filter(item => !addIcon.multipleSelection.some(i => i.product_id === item.product_id))"
                        type="warning"
                      >删除</el-button>
                    </div>
                    <el-table
                      v-loading="addIcon.loading"
                      :data="addIcon.product_data"
                      border
                      @selection-change="val => { this.addIcon.multipleSelection = val; }"
                      style="width: 100%"
                      fit
                    >
                      <el-table-column fixed type="selection" width="55"></el-table-column>

                      <el-table-column fixed align="center" prop="product_id" label="商品Id" />
                      <el-table-column width="200" align="center" prop="product_name" label="商品名称" />
                      <el-table-column align="center" prop="product_price" label="价值（销售价）" />
                      <el-table-column align="center" prop="product_stock" label="库存" />
                      <el-table-column min-width="200" align="center" label="排序">
                        <template slot-scope="scope">
                          <el-button
                            size="mini"
                            type="primary"
                            icon="el-icon-arrow-up"
                            circle
                            @click="handleChangeIndex('up' ,scope.$index, 1)"
                          ></el-button>
                          <el-button
                            size="mini"
                            type="primary"
                            icon="el-icon-arrow-down"
                            circle
                            @click="handleChangeIndex('down' ,scope.$index, 1)"
                          ></el-button>
                          <el-button
                            size="mini"
                            type="success"
                            @click="handleGoTop(addIcon.product_data,scope.$index, 1)"
                          >置顶</el-button>
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

    <!-- 第二板块 实体店家(外卖商家推荐) -->
    <div class="module">
      <div class="title">
        <div class="module-title-name">第二板块: 实体店家</div>

        <div class="module-title-main">
          <el-form ref="form" :model="entityStore" label-width="80px" :inline="true">
            <el-form-item style="width: 300px" label="板块名称:">
              <el-input placeholder="板块名称" maxlength="6" v-model="entityStore.name"></el-input>
            </el-form-item>
            <el-form-item style="width: 300px" label="副标题:">
              <el-input placeholder="副标题" maxlength="6" v-model="entityStore.sub_title"></el-input>
            </el-form-item>
          </el-form>
        </div>

        <div class="module-isShow-btn">
          <el-switch
            style="margin: 0 20px;"
            v-show="entityStore.id"
            v-model="entityStore.is_show"
            @change="val => checkShow(entityStore.id, val)"
            :active-value="1"
            :inactive-value="0"
            active-text="显示"
            inactive-text="不显示"
          ></el-switch>
          <el-button
            @click="entityStoreCommit"
            type="success"
            size="medium"
            style="margin-left:10px;"
          >保存设置</el-button>
        </div>
      </div>
      <div class="module-main">
        <div style="margin: 30px 0" class="laberImp">( 注:推荐的商家根据用户的配送范围在首页进行优先显示 )</div>
        <div>
          <div style="margin-bottom:15px;">
            <el-button
              @click=" store_mask.show = true ;getStoreList()"
              icon="el-icon-plus"
              type="primary"
            >添加</el-button>
            <el-button
              @click="entityStore.dataList = entityStore.dataList.filter(item => !entityStore.multipleSelection.some(i => i.store_id === item.store_id))"
              icon="el-icon-close"
              type="warning"
            >删除</el-button>
          </div>
          <el-table
            :data="entityStore.dataList"
            border
            @selection-change="val => { this.entityStore.multipleSelection = val; }"
            style="width: 100%"
            fit
          >
            <el-table-column fixed type="selection" width="55"></el-table-column>

            <el-table-column fixed align="center" prop="store_id" label="商家Id" />
            <el-table-column min-width="200" align="center" prop="store_name" label="商家名称" />
            <el-table-column align="center" width="160" label="开始时间">
              <template slot-scope="scope">
                <div
                  :style=" scope.row.start_time || 'color: #ccc'"
                >{{ scope.row.start_time || '未设置规则' }}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width="160" label="结束时间">
              <template slot-scope="scope">
                <div
                  :style=" scope.row.end_time || 'color: #ccc'"
                >{{ scope.row.end_time || '未设置规则' }}</div>
              </template>
            </el-table-column>
            <el-table-column min-width="200" align="center" label="排序">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-arrow-up"
                  circle
                  @click="handleChangeIndex('up' ,scope.$index, 2)"
                ></el-button>
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-arrow-down"
                  circle
                  @click="handleChangeIndex('down' ,scope.$index, 2)"
                ></el-button>
                <el-button
                  size="mini"
                  type="success"
                  @click="handleGoTop(entityStore.dataList,scope.$index, 2)"
                >置顶</el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="addRule(scope.$index)"
                  size="mini"
                  :type="  scope.row.end_time? 'primary': 'success'"
                >{{ scope.row.end_time ? '修改规则' : '新增规则' }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- 第三板块 左边-->
    <div class="module">
      <div class="title">
        <div class="module-title-name">第三板块: 左侧推荐</div>

        <div class="module-title-main">
          <el-form ref="form" :model="left" label-width="80px" :inline="true">
            <el-form-item style="width: 300px" label="板块名称:">
              <el-input placeholder="板块名称" maxlength="6" v-model="left.name"></el-input>
            </el-form-item>
          </el-form>
        </div>

        <div class="module-isShow-btn">
          <el-switch
            v-show="left.id"
            style="margin: 0 20px;"
            v-model="left.is_show"
            @change="val => checkShow(left.id, val)"
            :active-value="1"
            :inactive-value="0"
            active-text="显示"
            inactive-text="不显示"
          ></el-switch>
          <el-button size="medium" @click="commitleft" type="success">保存设置</el-button>
        </div>
      </div>
      <div class="module-main">
        <div style="margin:30px 0 15px;   display: inline-block;min-width: 450px">
          <div>
            展示图片
            <span class="laberImp">图片规格 250*150</span>
          </div>
          <Upimg
            style="margin:15px"
            :exporteurl="exporteurl"
            :fileList="leftImage"
            fileName="image"
            :showList="true"
            :fileHeaders="headers"
            :maxlimit="1"
            :index="4"
            @Successimg="SuccessimgArray"
          ></Upimg>
        </div>
        <div style="margin:30px 0 15px;   display: inline-block;min-width: 450px">
          <div>
            背景图片
            <!-- <span class="laberImp">图片规格 340*200</span> -->
          </div>
          <Upimg
            style="margin:15px"
            :exporteurl="exporteurl"
            :fileList="leftListImage"
            fileName="image"
            :showList="true"
            :fileHeaders="headers"
            :maxlimit="1"
            :index="5"
            @Successimg="SuccessimgArray"
          ></Upimg>
        </div>
        <div style="margin-bottom: 30px;">
          <span style=" margin-right:30px;">页面背景色:</span>
          <el-color-picker
            style="width: 60px; vertical-align: middle"
            v-model="left.list_color"
            show-alpha
          ></el-color-picker>
          <div :style="'background-color:'+ (left.list_color || '#f5f5f5')" class="show-color">显示内容</div>
        </div>
        <div style="margin:15px 0;">
          <el-button @click="onAddProduct(3)" icon="el-icon-plus" type="primary">添加商品</el-button>
          <el-button
            icon="el-icon-close"
            @click="left.dataList = left.dataList.filter(item => !left.multipleSelection.some(i => i.product_id === item.product_id))"
            type="warning"
          >删除</el-button>
        </div>

        <!-- 商品列表增添 -->
        <el-table
          :data="left.dataList"
          max-height="600"
          border
          fit
          @selection-change="val => { this.left.multipleSelection = val; }"
        >
          <!-- <el-table-column fixed type="selection" width="55"></el-table-column> -->
          <el-table-column fixed type="selection" align="center" width="55" />

          <el-table-column align="center" prop="product_id" label="商品ID" />
          <el-table-column align="center" min-width="200px" prop="product_name" label="商品名称" />
          <el-table-column align="center" prop="product_price" label="销售价" />
          <el-table-column align="center" prop="product_stock" label="库存量" />
          <el-table-column min-width="200" align="center" label="排序">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-arrow-up"
                circle
                @click="handleChangeIndex('up' ,scope.$index, 3)"
              ></el-button>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-arrow-down"
                circle
                @click="handleChangeIndex('down' ,scope.$index, 3)"
              ></el-button>
              <el-button
                size="mini"
                type="success"
                @click="handleGoTop(left.dataList,scope.$index, 3)"
              >置顶</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 第四板块 右边-->
    <div class="module">
      <div class="title">
        <div class="module-title-name">第三板块: 右侧推荐</div>

        <div class="module-title-main">
          <el-form ref="form" :model="right" label-width="80px" :inline="true">
            <el-form-item style="width: 300px" label="板块名称:">
              <el-input placeholder="板块名称" maxlength="6" v-model="right.name"></el-input>
            </el-form-item>
          </el-form>
        </div>

        <div class="module-isShow-btn">
          <el-switch
            style="margin: 0 20px;"
            v-model="right.is_show"
            v-show="right.id"
            @change="val => checkShow(right.id, val)"
            :active-value="1"
            :inactive-value="0"
            active-text="显示"
            inactive-text="不显示"
          ></el-switch>
          <el-button size="medium" @click="commitRight" type="success">保存设置</el-button>
        </div>
      </div>
      <div class="module-main">
        <div style="margin:30px 0 15px;   display: inline-block;min-width: 450px">
          <div>
            展示图片
            <span class="laberImp">图片规格 250*150</span>
          </div>
          <Upimg
            style="margin:15px"
            :exporteurl="exporteurl"
            :fileList="rightImage"
            fileName="image"
            :showList="true"
            :fileHeaders="headers"
            :maxlimit="1"
            :index="6"
            @Successimg="SuccessimgArray"
          ></Upimg>
        </div>
        <div style="margin:30px 0 15px;   display: inline-block;min-width: 450px">
          <div>
            背景图片
            <!-- <span class="laberImp">图片规格 340*200</span> -->
          </div>
          <Upimg
            style="margin:15px"
            :exporteurl="exporteurl"
            :fileList="rightListImage"
            fileName="image"
            :showList="true"
            :fileHeaders="headers"
            :maxlimit="1"
            :index="7"
            @Successimg="SuccessimgArray"
          ></Upimg>
        </div>
        <div style="margin-bottom: 30px;">
          <span style=" margin-right:30px;">页面背景色:</span>
          <el-color-picker
            style="width: 60px; vertical-align: middle"
            v-model="right.list_color"
            show-alpha
          ></el-color-picker>
          <div :style="'background-color:'+ (right.list_color || '#f5f5f5')" class="show-color">显示内容</div>
        </div>
        <div style="margin:15px 0;">
          <el-button @click="onAddProduct(4)" icon="el-icon-plus" type="primary">添加商品</el-button>
          <el-button
            icon="el-icon-close"
            @click="right.dataList = right.dataList.filter(item => !right.multipleSelection.some(i => i.product_id === item.product_id))"
            type="warning"
          >删除</el-button>
        </div>

        <!-- 商品列表增添 -->
        <el-table
          :data="right.dataList"
          max-height="600"
          border
          fit
          @selection-change="val => { this.right.multipleSelection = val; }"
        >
          <!-- <el-table-column fixed type="selection" width="55"></el-table-column> -->
          <el-table-column fixed type="selection" align="center" width="55" />

          <el-table-column align="center" prop="product_id" label="商品ID" />
          <el-table-column align="center" min-width="200px" prop="product_name" label="商品名称" />
          <el-table-column align="center" prop="product_price" label="销售价" />
          <el-table-column align="center" prop="product_stock" label="库存量" />
          <el-table-column align="center" label="排序">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-arrow-up"
                circle
                @click="handleChangeIndex('up' ,scope.$index, 4)"
              ></el-button>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-arrow-down"
                circle
                @click="handleChangeIndex('down' ,scope.$index, 4)"
              ></el-button>
              <el-button
                size="mini"
                type="success"
                @click="handleGoTop(right.dataList,scope.$index, 4)"
              >置顶</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 第五板块 扶农特产-->
    <div class="module">
      <div class="title">
        <div class="module-title-name">第四板块:</div>

        <div class="module-title-main">
          <el-form ref="form" :model="four_module" label-width="80px" :inline="true">
            <el-form-item style="width: 300px" label="板块名称:">
              <el-input placeholder="板块名称" maxlength="6" v-model="four_module.name"></el-input>
            </el-form-item>
            <el-form-item style="width: 300px" label="板块名称:">
              <el-input placeholder="板块名称" maxlength="6" v-model="four_module.sub_title"></el-input>
            </el-form-item>
          </el-form>
        </div>

        <div class="module-isShow-btn">
          <el-switch
            style="margin: 0 20px;"
            v-model="four_module.is_show"
            @change="val => checkShow(four_module.id, val)"
            :active-value="1"
            v-show="four_module.id"
            :inactive-value="0"
            active-text="显示"
            inactive-text="不显示"
          ></el-switch>
          <el-button size="medium" @click="commitFourModule" type="success">保存设置</el-button>
        </div>
      </div>
      <div class="module-main">
        <div style="margin:30px 0 15px;   display: inline-block;min-width: 450px">
          <div>
            列表图片
            <span class="laberImp">图片规格 340*200</span>
          </div>
          <Upimg
            style="margin:15px"
            :exporteurl="exporteurl"
            :fileList="fourModuleImage"
            fileName="image"
            :showList="true"
            :fileHeaders="headers"
            :maxlimit="1"
            :index="8"
            @Successimg="SuccessimgArray"
          ></Upimg>
        </div>

        <div style="margin:15px 0;">
          <el-button @click="onAddProduct(5)" icon="el-icon-plus" type="primary">添加商品</el-button>
          <el-button
            icon="el-icon-close"
            @click="four_module.dataList = four_module.dataList.filter(item => !four_module.multipleSelection.some(i => i.product_id === item.product_id))"
            type="warning"
          >删除</el-button>
        </div>

        <!-- 商品列表增添 -->
        <el-table
          :data="four_module.dataList"
          max-height="600"
          border
          fit
          @selection-change="val => { this.four_module.multipleSelection = val; }"
        >
          <!-- <el-table-column fixed type="selection" width="55"></el-table-column> -->
          <el-table-column fixed type="selection" align="center" width="55" />

          <el-table-column align="center" prop="product_id" label="商品ID" />
          <el-table-column align="center" min-width="200px" prop="product_name" label="商品名称" />
          <el-table-column align="center" prop="product_price" label="销售价" />
          <el-table-column align="center" prop="product_stock" label="库存量" />
          <el-table-column min-width="200" align="center" label="排序">
            <template  slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-arrow-up"
                circle
                @click="handleChangeIndex('up' ,scope.$index, 5)"
              ></el-button>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-arrow-down"
                circle
                @click="handleChangeIndex('down' ,scope.$index, 5)"
              ></el-button>
              <el-button
                size="mini"
                type="success"
                @click="handleGoTop(four_module.dataList,scope.$index, 5)"
              >置顶</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 第五板块 扶农特产-->
    <div class="module">
      <div class="title">
        <div class="module-title-name">第五板块: 底部推荐商品</div>

        <div class="module-title-main"></div>

        <div class="module-isShow-btn">
          <el-switch
            style="margin: 0 20px;"
            v-model="recommend.is_show"
            v-show="recommend.id"
            @change="val => checkShow(recommend.id, val)"
            :active-value="1"
            :inactive-value="0"
            active-text="显示"
            inactive-text="不显示"
          ></el-switch>
          <el-button size="medium" @click="commitRecommend" type="success">保存设置</el-button>
        </div>
      </div>
      <div class="module-main">
        <div style="margin:30px 0 15px;   display: inline-block;min-width: 450px">
          <div>
            列表图片
            <span class="laberImp">模块图片 340*200</span>
          </div>
          <Upimg
            style="margin:15px"
            :exporteurl="exporteurl"
            :fileList="recommendImage"
            fileName="image"
            :showList="true"
            :fileHeaders="headers"
            :maxlimit="1"
            :index="9"
            @Successimg="SuccessimgArray"
          ></Upimg>
        </div>

        <div style="margin:15px 0;">
          <el-button @click="onAddProduct(6)" icon="el-icon-plus" type="primary">添加商品</el-button>
          <el-button
            icon="el-icon-close"
            @click="recommend.dataList = recommend.dataList.filter(item => !recommend.multipleSelection.some(i => i.product_id === item.product_id))"
            type="warning"
          >删除</el-button>
        </div>

        <!-- 商品列表增添 -->
        <el-table
          :data="recommend.dataList"
          max-height="600"
          border
          fit
          @selection-change="val => { this.recommend.multipleSelection = val; }"
        >
          <!-- <el-table-column fixed type="selection" width="55"></el-table-column> -->
          <el-table-column fixed type="selection" align="center" width="55" />

          <el-table-column align="center" prop="product_id" label="商品ID" />
          <el-table-column align="center" min-width="200px" prop="product_name" label="商品名称" />
          <el-table-column align="center" prop="product_price" label="销售价" />
          <el-table-column align="center" prop="product_stock" label="库存量" />
          <el-table-column min-width="200" align="center" label="排序">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-arrow-up"
                circle
                @click="handleChangeIndex('up' ,scope.$index, 6)"
              ></el-button>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-arrow-down"
                circle
                @click="handleChangeIndex('down' ,scope.$index, 6)"
              ></el-button>
              <el-button
                size="mini"
                type="success"
                @click="handleGoTop(recommend.dataList,scope.$index, 6)"
              >置顶</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 添加 商品 弹窗 共有 -->
    <el-dialog
      center
      title="添加商品"
      :visible.sync="product_mask.show"
      top="50px"
      class="mask"
      :close-on-click-modal="false"
      :before-close="cancelMask"
    >
      <el-form :inline="true" label-width="100px" @submit.native.prevent>
        <el-form-item>
          <el-input
            style="width: 300px"
            v-model="product_mask.keyword"
            placeholder="商品ID/商品分类/商品名/代理商"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="product_mask.page=1; getAddProduct()">查询</el-button>
          <el-button type="success" @click="confirmMask">确定</el-button>
          <el-button type="info" @click="cancelMask">取消</el-button>
        </el-form-item>
      </el-form>

      <!-- 商品列表增添 -->
      <el-table
        v-loading="product_mask.loading"
        :data="product_mask.table"
        max-height="600"
        border
        fit
        @selection-change="val => { this.product_mask.multipleSelection = val; }"
      >
        <!-- <el-table-column fixed type="selection" width="55"></el-table-column> -->
        <el-table-column fixed type="selection" align="center" width="55" />

        <el-table-column align="center" prop="product_id" label="商品ID" />
        <el-table-column align="center" min-width="200px" prop="product_name" label="商品名称" />
        <el-table-column align="center" prop="product_price" label="销售价" />
        <el-table-column align="center" prop="product_stock" label="库存量" />
      </el-table>

      <div class="block" style="margin: 20px 0;">
        <el-pagination
          :current-page="product_mask.page"
          :page-sizes="[10, 20, 30, 40,50]"
          :page-size="product_mask.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="product_mask.total"
          @size-change="val => { product_mask.limit = val; product_mask.page = 1; getAddProduct() }"
          @current-change="val => { product_mask.page = val; getAddProduct();}"
        />
      </div>
    </el-dialog>

    <!-- 添加 商家 弹窗 第二板块所用 -->
    <el-dialog
      center
      title="添加商家"
      :visible.sync="store_mask.show"
      top="50px"
      class="mask"
      :close-on-click-modal="false"
      :before-close="canceStorelMask"
    >
      <el-form :inline="true" label-width="100px" @submit.native.prevent>
        <el-form-item label="商家分类">
          <el-select v-model="store_mask.category_id" placeholder="请选择">
            <el-option
              v-for="item in store_mask.category"
              :key="item.key"
              :label="item.val"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input style="width: 300px" v-model="store_mask.name" placeholder="商家ID/商家名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="store_mask.page=1; getStoreList()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="confirmStoreMask">确定</el-button>
          <el-button type="info" @click="canceStorelMask">取消</el-button>
        </el-form-item>
      </el-form>

      <!-- 商家列表增添 -->
      <el-table
        v-loading="store_mask.loading"
        :data="store_mask.store_list"
        max-height="600"
        border
        fit
        @selection-change="val => { this.store_mask.multipleSelection = val; }"
      >
        <!-- <el-table-column fixed type="selection" width="55"></el-table-column> -->
        <el-table-column fixed type="selection" align="center" width="55" />

        <el-table-column align="center" prop="store_id" label="商家ID" />
        <el-table-column align="center" min-width="200px" prop="store_name" label="商家名称" />
        <el-table-column align="center" prop="category_name" label="商家分类" />
        <el-table-column align="center" prop="disable" label="商家状态" />
        <el-table-column align="center" prop="service_percent" label="抽成" />
        <el-table-column align="center" prop="address" label="所属地区" />
      </el-table>

      <div class="block" style="margin: 20px 0;">
        <el-pagination
          :current-page="store_mask.page"
          :page-sizes="[10, 20, 30, 40,50]"
          :page-size="store_mask.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="store_mask.count"
          @size-change="val => { store_mask.limit = val; store_mask.page = 1; getStoreList() }"
          @current-change="val => { store_mask.page = val; getStoreList();}"
        />
      </div>
    </el-dialog>

    <!-- 添加 商家 弹窗 第二板块所用 -->
    <el-dialog
      center
      title="配置规则"
      :visible.sync="rule_mask.show"
      class="mask"
      :close-on-click-modal="false"
      :before-close="cancelRule"
    >
      <div style="text-align:center">
        <el-date-picker
          v-model="rule_mask.timeout"
          size="medium"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <div style="margin: 15px auto">
          <el-button @click="confirmRule" size="medium" type="primary">确认</el-button>
          <el-button @click="cancelRule" size="medium" type="info">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import vuedraggable from "vuedraggable";
import { exporteurl, arrRoofPlacement } from "@/utils/user";
import { upimg } from "@/api/user";
import Upimg from "@/components/Upimg";
import { parseTime } from "@/utils/index";
import {
  getAgent, // -- 获取代理商数据
  getCitySet, // 获取我的城市页所有板块初始设置
  deleteIcon, // 删除icon
  getEditIcon, // 修改icon
  editIconCommit, // commit 修改icon
  getAddIcon, // -- 添加icon
  addIconCommit, // commit 添加icon
  getAddProduct, // 获取添加商品
  changeSort, // icon板块拖拽排序
  checkShow, // 切换是否显示板块
  getStoreList, // 获取外卖商家列表
  entityStoreCommit, // 好店推荐(第二板块)保存配置
  checkIconType, // 切换icon_type
  commitleft, // 提交左侧模块
  commitRight, // 提交右侧模块
  commitFourModule, // 第四模块的提交
  commitRecommend // 提交底部推荐商品
} from "@/api/indexPageSet/indexVillageSet";

export default {
  components: { vuedraggable, Upimg },
  props: {},
  data() {
    return {
      exporteurl: exporteurl + upimg, // 图片上传公共地址
      headers: {
        // 图片上传携带的头
        token: localStorage.getItem("Token"),
        enctype: "multipart/form-data"
      },
      agent_id: "",
      agent: [],
      isAll: false, // 是否多个代理区域一并设置
      multipleSelection: [],
      // icon配置数据
      iconModule: {
        icon_type: 0,

        icon_data: [] // icon 列表 其余数据 由接口补充
      },
      showAddIcon: false, // 是否显示添加ICON弹窗
      icon_extra: {
        // 弹窗中的额外自定义数据 -- 别问这是啥, 后台一个自动控制三个input,后面接手的记得去锤产品和后台
        product_id: "", // 商品Id
        store_id: "", // 商家Id
        house_id: "" // 楼盘Id
      },

      addIcon: {
        // icon 添加/修改弹窗
        name: "",
        icon: "", // icon图标CDN地址
        bg_img: "", // icon背景图片CDN地址
        icon_url: "", //icon图标地址
        bg_img_url: "", // 背景图片地址
        product_data: [], // 商品
        store: "", // 商家
        houses: "", // 楼盘
        bg_color: "", // 背景色
        dataList: [], // 商品列表
        multipleSelection: [], // 选中的商品.
        jump_type: "", // 跳转方式
        appoint_type: "", // 跳转页面地址Key
        appoint_type_map: {}, // 指定页面, 跳转地址
        url: "" // 自定义链接
      },

      entityStore: {
        // 好店推荐
        module_id: "", //板块id
        name: "", // 板块名称
        sub_title: "", // 板块副标题
        is_show: 0, // 是否显示
        dataList: [], // 需要展示的列表数据
        multipleSelection: [] // 选中的商品.
      },

      // 左侧模块
      left: {
        id: "",
        name: "",
        dataList: [],
        multipleSelection: [],
        list_color: ""
      },
      // 右侧模块
      right: {
        id: "",
        name: "",
        dataList: [],
        multipleSelection: [],
        list_color: ""
      },
      four_module: {
        id: "",
        name: "",
        dataList: [],
        multipleSelection: []
      },
      recommend: {
        id: "",
        name: "",
        dataList: [],
        multipleSelection: []
      },
      store_mask: {
        // 添加商家弹窗
        haveList: [], // 已有列表
        store_list: [], // 商家列表
        loading: false,
        name: "", // 搜索的商家索引
        category: [], // 分类列表
        category_id: "", // 分类Id
        limit: parseInt(localStorage.getItem("limit")) || 10,
        page: 1, // 页码
        multipleSelection: [], // 选中文本
        total: 0, // 总数
        show: false
      },
      product_mask: {
        // 添加商品列表弹窗
        moduleId: "",
        show: false, // 是否显示
        table: [], // 弹窗中的表格数据
        keyword: "", // 搜索关键字
        multipleSelection: [], // 选中文本
        total: 0, // 总数
        page: 1, // 页码
        product_id: [], // 已有的商品列表
        limit: parseInt(localStorage.getItem("limit")) || 10,
        loading: false // 是否显示loading
      },
      rule_mask: {
        //  添加/修改规则 针对于模块二的推荐商家的规则时间
        show: false,
        index: "",
        timeout: []
      }
    };
  },
  // updated() {

  // },

  created() {
    this.getAgent().then(res => {
      this.getData();
    });
  },

  methods: {
    // 获取当前用户的代理身份 ( 所有接口都必须基于此接口返回参数进行操作 )
    getAgent() {
      // 返回一个axios封装的函数, 此页所有其他接口与此函数的then方法中进行操作
      return getAgent().then(res => {
        if (res.code == 1) {
          // 获取当前用户名下所有的代理区域
          this.agent = res.data.agent;

          console.log(res.data);
          // 默认选中第一个
          this.agent_id = res.data.agent[0] ? res.data.agent[0].key : "";
        } else {
          this.$message.error("获取身份错误! error: " + res.msg);
        }
      });
    },

    // 获取我的城市所有板块的数据
    getData() {
      getCitySet({
        agent_id: this.agent_id
      }).then(res => {
        if (res.code == 1) {
          // console.log(res)
          // 进行对应板块数据填充 区分
          // console.log("!!!", res.data.config_data);
          for (let k in res.data.config_data) {
            let item = res.data.config_data[k];
            switch (item.module_id) {
              case 1: // 当前属于第一icon板块， 填充数据
                item.icon_data = res.data.icon_data;
                this.iconModule = item;
                break;
              case 2: // 当前属于第一板块好店推荐,  填充数据
                item.dataList = res.data.waimai_store_data;
                this.entityStore = item;
                break;
              case 3:
                item.dataList = res.data.tj_product_data_3;
                this.left = item;
                break;
              case 4:
                item.dataList = res.data.tj_product_data_4;
                this.right = item;
                break;
              case 5:
                item.dataList = res.data.tj_product_data_5;
                this.four_module = item;
                break;
              case 6:
                item.dataList = res.data.tj_product_data_6;
                this.recommend = item;
                break;
              default:
                console.log("前后端moudle_id配置出现冲突, 严重问题警告");
                console.log(item.module_id);
            }
          }

          // // 获取iconModule的icon列表数据
          // this.iconModule.icon_data = res.data.icon_data;
        } else {
          this.$message.error("获取配置信息失败! error: " + res.msg);
        }
      });
    },
    // 切换代理区域 重置数据
    changSite(e) {
      console.log(e);
      // 重置数据
      Object.assign(this.$data, this.$options.data());

      // 重新获取页面数据
      this.getAgent().then(res => {
        this.agent_id = e;
        this.getData();
      });
    },
    /**
     * 切换板块是否显示
     * @param {Int} id   板块主键ID
     * @param {Int} is_show 是否显示 1：显示   0：不显示
     */
    checkShow(id, is_show) {
      checkShow({
        id,
        is_show
      })
        .then(res => {
          if (res.code == 1) {
            this.$message.success("切换成功");
          } else {
            this.$message.error("操作失败, error:" + res.msg);
          }
        })
        .catch(res => {
          this.$message.error("连接服务器出现异常， 操作失败");
        });
    },

    /**
     * 切换排序
     * @param {String} type 互换位置方向
     * @param {Number} index  互换位置的index
     * @param {String} arr  互换位置的板块
     */
    changeIndex(type = "up", index, arr) {
      // 获取一个需要排序的数组的复制品
      let newArr = [...arr];

      if (type === "up") {
        // 与上一位互换位置
        if (index != 0) {
          [newArr[index], newArr[index - 1]] = [
            newArr[index - 1],
            newArr[index]
          ];
        } else {
          this.$message.warning("已经是第一了，没法再向上了");
        }
      } else {
        // 当选中和下一位互换位置时
        if (index != newArr.length - 1) {
          [newArr[index], newArr[index + 1]] = [
            newArr[index + 1],
            newArr[index]
          ];
        } else {
          this.$message.warning("已经是最后了， 没法再向下了");
        }
      }
      // 将互换位置的数组进行重新赋值
      return newArr;
    },

    /**
     * 切换排序控制
     * @param {String} type 互换位置方向
     * @param {Number} index  互换位置的index
     * @param {Number} id   互换位置的板块Id :
     */
    handleChangeIndex(type, index, id) {
      /*  Id:  1: addIcon.product_data
              2:
      */
      switch (id) {
        case 1:
          // 进行添加/修改Icon弹窗中的列表排序
          this.addIcon.product_data = this.changeIndex(
            type,
            index,
            this.addIcon.product_data
          );
          break;
        case 2:
          this.entityStore.dataList = this.changeIndex(
            type,
            index,
            this.entityStore.dataList
          );
          break;
        case 3:
          this.left.dataList = this.changeIndex(
            type,
            index,
            this.left.dataList
          );
        case 4:
          this.right.dataList = this.changeIndex(
            type,
            index,
            this.right.dataList
          );
          break;
        case 5:
          this.four_module.dataList = this.changeIndex(
            type,
            index,
            this.four_module.dataList
          );
          break;
        case 6:
          this.recommend.dataList = this.changeIndex(
            type,
            index,
            this.recommend.dataList
          );
          break;
        default:
          this.$message.error("前端逻辑错误! 请打死那个后台");
      }
    },

    /**
     * 一键置顶
     */
    handleGoTop(modal, index, id) {
      switch (id) {
        case 1:
          this.addIcon.product_data = arrRoofPlacement(modal, index);
          break;
        case 2:
          this.entityStore.dataList = arrRoofPlacement(modal, index);
          break;
        case 3:
          this.left.dataList = arrRoofPlacement(modal, index);
          break;
        case 4:
          this.right.dataList = arrRoofPlacement(modal, index);
          break;
        case 5:
          this.four_module.dataList = arrRoofPlacement(modal, index);
          break;
        case 6:
          this.recommend.dataList = arrRoofPlacement(modal, index);
          break;
      }
    },

    /**
     * 添加商品列表
     * @param {Number} moduleId 板块Id
     */
    onAddProduct(moduleId) {
      this.product_mask.moduleId = moduleId;
      this.product_mask.show = true;
      switch (moduleId) {
        case 1: // 第一板块的添加商品 -- (添加/修改icon的弹窗中)
          this.product_mask.product_id = this.addIcon.product_data.map(
            item => item.product_id
          );
          break;
        case 3: // 第四板块的添加商品
          this.product_mask.product_id = this.left.dataList.map(
            item => item.product_id
          );
          break;
        case 4: // 第四板块的添加商品
          this.product_mask.product_id = this.right.dataList.map(
            item => item.product_id
          );
          break;
        case 5: // 第五板块的添加商品
          this.product_mask.product_id = this.four_module.dataList.map(
            item => item.product_id
          );
          break;
        case 6: // 第六板块的添加商品
          this.product_mask.product_id = this.recommend.dataList.map(
            item => item.product_id
          );
          break;
        default:
          break;
      }

      this.getAddProduct();
    },

    // 确认提交
    confirmMask() {
      if (this.product_mask.moduleId == 1) {
        // 如果这个是板块一的添加/修改icon的弹窗中的商品列表, 即进行拼接操作
        console.log(this.addIcon);
        this.addIcon.product_data = this.addIcon.product_data.concat(
          this.product_mask.multipleSelection
        );
      } else if (this.product_mask.moduleId == 3) {
        this.left.dataList = this.left.dataList.concat(
          this.product_mask.multipleSelection
        );
      } else if (this.product_mask.moduleId == 4) {
        this.right.dataList = this.right.dataList.concat(
          this.product_mask.multipleSelection
        );
      } else if (this.product_mask.moduleId == 5) {
        this.four_module.dataList = this.four_module.dataList.concat(
          this.product_mask.multipleSelection
        );
      } else if (this.product_mask.moduleId == 6) {
        this.recommend.dataList = this.recommend.dataList.concat(
          this.product_mask.multipleSelection
        );
      }

      // 进行数据操作完毕后撤销弹窗
      this.cancelMask();
    },

    // 撤销弹窗
    cancelMask() {
      // 进行数据重置
      this.product_mask = {
        moduleId: "",
        show: false, // 是否显示
        table: [], // 弹窗中的表格数据
        keyword: "", // 搜索关键字
        multipleSelection: [], // 选中文本
        total: 0, // 总数
        page: 1, // 页码
        product_id: [], // 已有的商品列表
        limit: parseInt(localStorage.getItem("limit")) || 10,
        loading: false // 是否显示loading
      };
    },

    // 获取添加的商品列表
    getAddProduct() {
      this.product_mask.loading = true;
      getAddProduct({
        type: 2,
        agent_id: this.agent_id,
        module: this.product_mask.moduleId,
        page: this.product_mask.page,
        limit: this.product_mask.limit,
        icon_id: this.addIcon.icon_id || "",
        product_id_arr: this.product_mask.product_id,
        keyword: this.product_mask.keyword
      }).then(res => {
        if (res.code == 1) {
          this.product_mask.loading = false;
          this.product_mask.table = res.data.product_data;
          this.product_mask.total = res.data.count;
        } else {
          this.$message.warning("获取商品数据错误! error:" + res.msg);
        }
      });
    },

    // 图片上传成功
    SuccessimgArray(e) {
      try {
        if (e.index == 1) {
          this.addIcon.icon = e.imgArray[0] ? e.imgArray[0].imgPath : "";
          this.addIcon.icon_url = e.imgArray[0] ? e.imgArray[0].url : "";
        } else if (e.index == 2) {
          this.addIcon.bg_img = e.imgArray[0] ? e.imgArray[0].imgPath : "";
          this.addIcon.bg_img_url = e.imgArray[0] ? e.imgArray[0].url : "";
        } else if (e.index == 3) {
          this.iconModule.list_image = e.imgArray[0]
            ? e.imgArray[0].imgPath
            : "";
          this.iconModule.list_image_url = e.imgArray[0]
            ? e.imgArray[0].url
            : "";
        } else if (e.index == 4) {
          this.left.image = e.imgArray[0] ? e.imgArray[0].imgPath : "";
          this.left.image_url = e.imgArray[0] ? e.imgArray[0].url : "";
        } else if (e.index == 5) {
          this.left.list_image = e.imgArray[0] ? e.imgArray[0].imgPath : "";
          this.left.list_image_url = e.imgArray[0] ? e.imgArray[0].url : "";
        } else if (e.index == 6) {
          this.right.image = e.imgArray[0] ? e.imgArray[0].imgPath : "";
          this.right.image_url = e.imgArray[0] ? e.imgArray[0].url : "";
        } else if (e.index == 7) {
          this.right.list_image = e.imgArray[0] ? e.imgArray[0].imgPath : "";
          this.right.list_image_url = e.imgArray[0] ? e.imgArray[0].url : "";
        } else if (e.index == 8) {
          this.four_module.image = e.imgArray[0] ? e.imgArray[0].imgPath : "";
          this.four_module.image_url = e.imgArray[0] ? e.imgArray[0].url : "";
        } else if (e.index == 9) {
          this.recommend.image = e.imgArray[0] ? e.imgArray[0].imgPath : "";
          this.recommend.image_url = e.imgArray[0] ? e.imgArray[0].url : "";
        }
        // 使用解构语法， 取出第一个image地址
        // this["module" + e.index].image = e.imgArray[0] ? e.imgArray[0].url : "";
        // this["module" + e.index].images_url = e.imgArray[0]
        // ? e.imgArray[0].imgPath
        // : "";
      } catch (error) {
        console.log("上传图片出现错误！", error);
      }
    },

    /* icon板块控制 start */

    // 切换Icon_type属性
    checkIconType(e) {
      checkIconType({
        agent_id: this.agent_id,
        id: this.iconModule.id,
        icon_type: this.iconModule.icon_type,
        list_image: this.iconModule.list_image
      }).then(res => {
        if (res.code == 1) {
          this.$message.success("切换成功");
          this.getData();
        } else {
          this.$message.error("切换失败! erro:" + res.msg);
        }
      });
    },

    // 删除icon
    deleteIcon(id = "") {
      deleteIcon({
        id
      }).then(res => {
        if (res.code == 1) {
          this.$message.success(res.msg);
          this.showAddIcon = false;
          this.getData(); // 删除后重新获取页面所有接口（当前页只有一个获取页面总数据接口）
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 修改icon
    editIcon(id = "") {
      getEditIcon({ id, agent_id: this.agent_id }).then(res => {
        if (res.code == 1) {
          this.showAddIcon = true;
          let data = res.data.icon_data;
          data.appoint_type_map = res.data.appoint_type_map;
          data.product_data = res.data.product;
          this.addIcon = data;

          // 为后台的一个字段控制三个input买单的代码
          switch (this.addIcon.jump_type) {
            case "2":
              this.icon_extra.product_id = this.addIcon.value_id;
              break;
            case "3":
              this.icon_extra.store_id = this.addIcon.value_id;
              break;
            case "4":
              this.icon_extra.house_id = this.addIcon.value_id;
              break;
            default:
              break;
          }
        } else {
          this.$message.error("获取icon参数错误! error:" + res.msg);
        }
      });
    },

    // 添加icon
    addNewIcon() {
      // 获取添加icon弹出的下拉参数（虽然我也觉得这个没必要重新请求）
      getAddIcon({
        agent_id: this.agent_id
      }).then(res => {
        if (res.code == 1) {
          this.addIcon.appoint_type_map = res.data.appoint_type_map;
          this.showAddIcon = true;
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 拖拽排序操作
    changeSort() {
      // 当用户在icon中进行拖拽重新排序时

      // 设置一个防抖阀， 只进行最后一次设置的操作
      this.throttle && clearTimeout(this.throttle);
      this.throttle = setTimeout(() => {
        changeSort({
          type: 2,
          id: this.iconModule.id,
          icon_id: this.iconModule.icon_data.map(item => item.id)
        })
          .then(res => {
            if (res.code === 1) {
              this.$message.success("排序更新完成");
            } else {
              this.$message.error("排序错误" + res.msg);
            }
          })
          .catch(error => {
            this.$message.warning("连接服务器出现问题， error!");
          });
      }, 2000);
    },

    // 保存icon弹窗的配置
    saveIcon() {
      let value_id;
      switch (this.addIcon.jump_type) {
        case "2":
          value_id = this.icon_extra.product_id;
          break;
        case "3":
          value_id = this.icon_extra.store_id;
          break;
        case "4":
          value_id = this.icon_extra.house_id;
          break;
        default:
          value_id = "";
          break;
      }

      let product_id = this.addIcon.product_data.map(item => item.product_id);
      if (this.addIcon.id) {
        // 如果板块中有此数据, 则为修改Icon

        // 修改icon的提交
        editIconCommit({
          id: this.addIcon.id,
          name: this.addIcon.name,
          icon: this.addIcon.icon,
          bg_img: this.addIcon.bg_img,
          jump_type: this.addIcon.jump_type,
          appoint_type: this.addIcon.appoint_type,
          product_id: product_id.length === 0 ? "" : product_id,
          value_id,
          bg_color: this.addIcon.bg_color,
          url: this.addIcon.url || ""
        }).then(res => {
          if (res.code == 1) {
            this.$message.success("更新成功");

            this.getData();
            // 重置弹窗参数
            this.resetIconMask();
          } else {
            this.$message.warning("更新错误! error: " + res.msg);
          }
        });
      } else {
        // 如果弹窗内没有id， 说明这是一个添加icon的操作
        addIconCommit({
          agent_id: this.agent_id,
          icon: this.addIcon.icon,
          name: this.addIcon.name,
          bg_img: this.addIcon.bg_img,
          jump_type: this.addIcon.jump_type,
          appoint_type: this.addIcon.appoint_type,
          product_id: product_id.length === 0 ? "" : product_id,
          value_id,
          bg_color: this.addIcon.bg_color,
          url: this.addIcon.url || ""
        }).then(res => {
          if (res.code == 1) {
            this.$message.success("添加成功");

            this.getData();
            // 重置弹窗参数
            this.resetIconMask();
          } else {
            this.$message.warning("提交错误! error: " + res.msg);
          }
        });
      }
    },

    // 重置弹窗参数
    resetIconMask() {
      this.showAddIcon = false;
      this.addIcon = {
        // icon 添加/修改弹窗
        name: "",
        icon: "", // icon图标CDN地址
        bg_img: "", // icon背景图片CDN地址
        icon_url: "", //icon图标地址
        bg_img_url: "", // 背景图片地址
        product: "", // 商品
        store: "", // 商家
        houses: "", // 楼盘
        bg_color: "", // 背景色
        product_data: [], // 商品列表
        appoint_type: "",
        jump_type: "",
        multipleSelection: [], // 选中的商品
        appoint_type_map: {}, // 指定页面, 跳转地址
        url: ""
      };
      this.icon_extra = {
        // 弹窗中的额外自定义数据 -- 别问这是啥, 后台一个id字段控制三个input,后面接手的记得去锤产品和后台
        product_id: "", // 商品Id
        store_id: "", // 商家Id
        house_id: "" // 楼盘Id
      };
    },
    /* icon板块控制 end */

    /* 外卖商家(好店推荐部分) start */
    // 获取此代理区域下的外卖商家
    getStoreList() {
      this.store_mask.loading = true;
      let store_id = this.entityStore.dataList.map(item => item.store_id);
      getStoreList({
        type: 2,
        name: this.store_mask.name,
        page: this.store_mask.page,
        category_id: this.store_mask.category_id,
        limit: this.store_mask.limit,
        store_id: store_id.length === 0 ? "" : store_id,
        agent_id: this.agent_id
      }).then(res => {
        if (res.code == 1) {
          this.store_mask.loading = false;
          this.store_mask.store_list = res.data.list;
          this.store_mask.category = res.data.category_info;
          this.store_mask.count = res.data.count;
        }
      });
    },

    // 确认添加商家
    confirmStoreMask() {
      this.entityStore.dataList = this.entityStore.dataList.concat(
        this.store_mask.multipleSelection
      );
      this.canceStorelMask();
    },

    // 关闭弹窗, 重置弹窗数据
    canceStorelMask() {
      this.store_mask = {
        // 添加商家弹窗
        haveList: [], // 已有列表
        store_list: [], // 商家列表
        loading: false,
        name: "", // 搜索的商家索引
        category: [], // 分类列表
        category_id: "", // 分类Id
        limit: parseInt(localStorage.getItem("limit")) || 10,
        page: 1, // 页码
        multipleSelection: [], // 选中文本
        total: 0, // 总数
        show: false
      };
    },

    // 实体店提交修改按钮
    entityStoreCommit() {
      entityStoreCommit({
        agent_id: this.agent_id,
        name: this.entityStore.name,
        sub_title: this.entityStore.sub_title,
        store_data:
          this.entityStore.dataList.length === 0
            ? ""
            : this.entityStore.dataList,
        id: this.entityStore.id
      })
        .then(res => {
          if (res.code == 1) {
            this.$message.success("配置保存成功");
            this.getData();
          } else {
            this.$message.error("保存失败! error: " + res.msg);
          }
        })
        .catch(res => {
          this.$$message.error("连接服务器时出现异常");
        });
    },

    // 添加规则
    addRule(index) {
      this.rule_mask.index = index;
      this.rule_mask.show = true;
      this.rule_mask.timeout = [
        this.entityStore.dataList[index].start_time,
        this.entityStore.dataList[index].end_time
      ];
    },

    // 确认提交规则
    confirmRule() {
      let index = this.rule_mask.index;

      /**
       * 开发日志 -- 小利 debugger
       * 由于vue的渲染机制不能深入到层次过深, 直接在原dom上修改会不刷新dom. 所以我们这里使用一个新的数组来刷新dom
       */
      let dataList = [...this.entityStore.dataList];

      // 进行es6的解构赋值+  dataList[index].start_time

      let start_time, end_time;
      [start_time, end_time] = this.rule_mask.timeout || [];
      dataList[index].start_time = parseTime(start_time);
      dataList[index].end_time = parseTime(end_time);

      this.entityStore.dataList = dataList;

      this.cancelRule();
    },

    // 取消更新规则 (重置弹窗)
    cancelRule() {
      this.rule_mask = {
        show: false,
        index: "",
        timeout: []
      };
    },

    /* 外卖商家(好店推荐部分) end */

    commitleft() {
      let product_id = this.left.dataList.map(item => item.product_id);
      commitleft({
        agent_id: this.agent_id,
        name: this.left.name,
        sub_title: this.left.sub_title,
        product_id: product_id.length === 0 ? "" : product_id,
        id: this.left.id,
        image: this.left.image,
        list_image: this.left.list_image,
        list_color: this.left.list_color
      })
        .then(res => {
          if (res.code == 1) {
            this.$message.success("保存成功");
            this.getData();
          } else {
            this.$message.error("保存失败! error: " + res.msg);
          }
        })
        .catch(error => {
          this.$message.error("连接服务器出现异常");
        });
    },
    commitRight() {
      let product_id = this.right.dataList.map(item => item.product_id);
      commitRight({
        agent_id: this.agent_id,
        name: this.right.name,
        sub_title: this.right.sub_title,
        product_id: product_id.length === 0 ? "" : product_id,
        id: this.right.id,
        image: this.right.image,
        list_image: this.right.list_image,
        list_color: this.right.list_color
      })
        .then(res => {
          if (res.code == 1) {
            this.$message.success("保存成功");
            this.getData();
          } else {
            this.$message.error("保存失败! error: " + res.msg);
          }
        })
        .catch(error => {
          this.$message.error("连接服务器出现异常");
        });
    },

    // 第四模块提交
    commitFourModule() {
      let product_id = this.four_module.dataList.map(item => item.product_id);
      commitFourModule({
        agent_id: this.agent_id,
        name: this.four_module.name,
        sub_title: this.four_module.sub_title,
        product_id: product_id.length === 0 ? "" : product_id,
        id: this.four_module.id,
        image: this.four_module.image,
        image_url: this.four_module.image_url
      })
        .then(res => {
          if (res.code == 1) {
            this.$message.success("配置成功");
            this.getData();
          } else {
            this.$message.error("配置出错 error： " + res.msg);
          }
        })
        .catch(res => {
          this.$message.error("连接服务器出现异常!");
        });
    },
    // 提交底部推荐商品
    commitRecommend() {
      let product_id = this.recommend.dataList.map(item => item.product_id);
      commitRecommend({
        agent_id: this.agent_id,
        name: this.recommend.name,
        sub_title: this.recommend.sub_title,
        product_id: product_id.length === 0 ? "" : product_id,
        id: this.recommend.id,
        image: this.recommend.image,
        image_url: this.recommend.image_url
      })
        .then(res => {
          if (res.code == 1) {
            this.$message.success("配置成功");
            this.getData();
          } else {
            this.$message.error("配置出错 error： " + res.msg);
          }
        })
        .catch(res => {
          this.$message.error("连接服务器出现异常!");
        });
    }
  },
  computed: {
    // 添加/修改icon弹窗中的icon图标
    iconImage() {
      let arr = [];
      if (this.addIcon.icon && this.addIcon.icon_url) {
        arr.push({
          name: "",
          imgPath: this.addIcon.icon,
          url: this.addIcon.icon_url
        });
      }

      return arr;
    },
    // 添加/修改icon弹窗中的icon背景广告大图
    iconBgImage() {
      let arr = [];
      if (this.addIcon.bg_img && this.addIcon.bg_img_url) {
        arr.push({
          name: "",
          imgPath: this.addIcon.bg_img,
          url: this.addIcon.bg_img_url
        });
      }

      return arr;
    },
    iconModuleImage() {
      let arr = [];
      if (this.iconModule.list_image && this.iconModule.list_image_url) {
        arr.push({
          name: "",
          imgPath: this.iconModule.list_image,
          url: this.iconModule.list_image_url
        });
      }

      return arr;
    },
    leftImage() {
      let arr = [];
      if (this.left.image && this.left.image_url) {
        arr.push({
          name: "",
          imgPath: this.left.image,
          url: this.left.image_url
        });
      }
      return arr;
    },
    leftListImage() {
      let arr = [];
      if (this.left.list_image && this.left.list_image_url) {
        arr.push({
          name: "",
          imgPath: this.left.list_image,
          url: this.left.list_image_url
        });
      }
      return arr;
    },
    rightImage() {
      let arr = [];
      if (this.right.image && this.right.image_url) {
        arr.push({
          name: "",
          imgPath: this.right.image,
          url: this.right.image_url
        });
      }
      return arr;
    },
    rightListImage() {
      let arr = [];
      if (this.right.list_image && this.right.list_image_url) {
        arr.push({
          name: "",
          imgPath: this.right.list_image,
          url: this.right.list_image_url
        });
      }
      return arr;
    },
    fourModuleImage() {
      let arr = [];
      if (this.four_module.image && this.four_module.image_url) {
        arr.push({
          name: "",
          imgPath: this.four_module.image,
          url: this.four_module.image_url
        });
      }
      return arr;
    },
    recommendImage() {
      let arr = [];
      if (this.recommend.image && this.recommend.image_url) {
        arr.push({
          name: "",
          imgPath: this.recommend.image,
          url: this.recommend.image_url
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
.show-color {
  display: inline-block;
  width: 100px;
  height: 50px;
  color: #fff;
  font-size: 14px;
  text-align: center;
  line-break: 50px;
  vertical-align: middle;
  line-height: 50px;
}
.activity {
  display: flex;
  justify-content: space-around;
  padding: 30px;
}
</style>