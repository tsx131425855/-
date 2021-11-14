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
        </div>
      </div>
      <div class="module-main">
        <div class="laber">
          ICON
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
            <el-form-item style="width: 300px" label="标题" @submit.native.prevent>
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
                    <el-option label="未指定" :value="0"></el-option>
                    <el-option
                      v-for="item in addIcon.appoint_type_map"
                      :key="item.key"
                      :label="item.val"
                      :value="item.key + ''"
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
                      <el-table-column min-width="180" align="center" label="排序">
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

    <!-- 第二板块 好店推荐(外卖商家推荐) -->
    <div class="module">
      <div class="title">
        <div class="module-title-name">第二板块: 好店推荐</div>

        <div class="module-title-main">
          <el-form
            ref="form"
            :model="goodStore"
            label-width="80px"
            :inline="true"
            @submit.native.prevent
          >
            <el-form-item style="width: 300px" label="板块名称:">
              <el-input placeholder="板块名称" maxlength="8" v-model="goodStore.name"></el-input>
            </el-form-item>
            <el-form-item style="width: 300px" label="副标题:">
              <el-input placeholder="副标题" maxlength="8" v-model="goodStore.sub_title"></el-input>
            </el-form-item>
            <el-form-item label="显示个数:">
              <el-input placeholder="显示个数" type="number" v-model="goodStore.count"></el-input>
            </el-form-item>
          </el-form>
        </div>

        <div class="module-isShow-btn">
          <el-switch
            style="margin: 0 20px;"
            v-show="goodStore.id"
            v-model="goodStore.is_show"
            @change="val => checkShow(goodStore.id, val)"
            :active-value="1"
            :inactive-value="0"
            active-text="显示"
            inactive-text="不显示"
          ></el-switch>
          <el-button
            @click="goodStoreCommit"
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
              @click="goodStore.dataList = goodStore.dataList.filter(item => !goodStore.multipleSelection.some(i => i.store_id === item.store_id))"
              icon="el-icon-close"
              type="warning"
            >删除</el-button>
          </div>
          <el-table
            :data="goodStore.dataList"
            border
            @selection-change="val => { this.goodStore.multipleSelection = val; }"
            style="width: 100%"
            fit
          >
            <el-table-column fixed type="selection" width="55"></el-table-column>

            <el-table-column fixed align="center" prop="store_id" label="商家Id" />
            <el-table-column width="200" align="center" prop="store_name" label="商家名称" />
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
            <el-table-column min-width="180" align="center" label="排序">
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
                  @click="handleGoTop(goodStore.dataList,scope.$index, 2)"
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

    <!-- 第三板块 限时活动((左: 秒杀; 右: 拼团) -->
    <div class="module">
      <div class="title">
        <div class="module-title-name">第三板块: 限时活动(左: 秒杀; 右: 拼团)</div>

        <div class="module-title-main">
          <el-form
            ref="form"
            :model="goodStore"
            label-width="80px"
            :inline="true"
            @submit.native.prevent
          >
            <el-form-item style="width: 300px" label="板块名称:">
              <el-input placeholder="板块名称" maxlength="8" v-model="mustRob.name"></el-input>
            </el-form-item>
            <el-form-item style="width: 300px" label="副标题:">
              <el-input placeholder="副标题" maxlength="8" v-model="mustRob.sub_title"></el-input>
            </el-form-item>
          </el-form>
        </div>

        <div class="module-isShow-btn">
          <el-button size="medium" type="success" @click="commitRob">保存设置</el-button>
        </div>
      </div>
      <div class="module-main">
        <div class="activity">
          <div>
            <el-form ref="form" :model="goodStore" label-width="80px" @submit.native.prevent>
              <el-form-item style="width: 300px" label="左侧-秒杀:">
                <el-switch
                  v-model="hot.is_show"
                  :active-value="1"
                  :inactive-value="0"
                  active-text="显示"
                  inactive-text="不显示"
                  @change="val => checkShow(hot.id, val)"
                ></el-switch>
              </el-form-item>
              <el-form-item style="width: 300px" label="板块名称:">
                <el-input placeholder="板块名称" maxlength="8" v-model="hot.name"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div>
            <el-form ref="form" :model="goodStore" label-width="80px">
              <el-form-item style="width: 300px" label="右侧-拼团:">
                <el-switch
                  v-model="group.is_show"
                  :active-value="1"
                  :inactive-value="0"
                  active-text="显示"
                  inactive-text="不显示"
                  @change="val => checkShow(group.id, val)"
                ></el-switch>
              </el-form-item>
              <el-form-item style="width: 300px" label="板块名称:">
                <el-input placeholder="板块名称" maxlength="8" v-model="group.name"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>

    <!-- 第四板块 会员特卖 -->
    <div class="module">
      <div class="title">
        <div class="module-title-name">第四板块: 会员模块</div>

        <div class="module-title-main">
          <el-form
            ref="form"
            :model="member"
            label-width="80px"
            :inline="true"
            @submit.native.prevent
          >
            <el-form-item style="width: 300px" label="板块名称:">
              <el-input placeholder="板块名称" maxlength="8" v-model="member.name"></el-input>
            </el-form-item>
            <el-form-item style="width: 300px" label="副标题:">
              <el-input placeholder="副标题" maxlength="8" v-model="member.sub_title"></el-input>
            </el-form-item>
          </el-form>
        </div>

        <div class="module-isShow-btn">
          <el-switch
            style="margin: 0 20px;"
            v-model="member.is_show"
            v-show="member.id"
            @change="val => checkShow(member.id, val)"
            :active-value="1"
            :inactive-value="0"
            active-text="显示"
            inactive-text="不显示"
          ></el-switch>
          <el-button size="medium" @click="commitMember" type="success">保存设置</el-button>
        </div>
      </div>
      <div class="module-main">
        <div class="laberImp" style="margin: 30px 0">( 注: 会员特卖商品仅超级会员可购买 )</div>

        <div style="margin-bottom:15px;">
          <el-button @click="onAddProduct(4)" icon="el-icon-plus" type="primary">添加商品</el-button>
          <el-button
            icon="el-icon-close"
            @click="member.dataList = member.dataList.filter(item => !member.multipleSelection.some(i => i.product_id === item.product_id))"
            type="warning"
          >删除</el-button>
        </div>

        <!-- 商品列表增添 -->
        <el-table
          :data="member.dataList"
          max-height="600"
          border
          fit
          @selection-change="val => { this.member.multipleSelection = val; }"
        >
          <!-- <el-table-column fixed type="selection" width="55"></el-table-column> -->
          <el-table-column fixed type="selection" align="center" width="55" />

          <el-table-column align="center" prop="product_id" label="商品ID" />
          <el-table-column align="center" min-width="200px" prop="product_name" label="商品名称" />
          <el-table-column align="center" prop="product_price" label="销售价" />
          <el-table-column align="center" prop="product_stock" label="库存量" />
          <el-table-column min-width="180" align="center" label="排序">
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
                @click="handleGoTop(member.dataList ,scope.$index, 4)"
              >置顶</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 第五板块 精选推荐-->
    <div class="module">
      <div class="title">
        <div class="module-title-name">第五板块: 精选推荐</div>
        <div class="module-title-main" />
        <div class="module-isShow-btn">
          <el-switch
            v-show="selected_id"
            v-model="selected_is_show"
            style="margin: 0 20px;"
            :active-value="1"
            :inactive-value="0"
            active-text="显示"
            inactive-text="不显示"
            @change="val => selectedshow(selected_id, val)"
          />
          <el-button size="medium" type="success" @click="addmodular">保存设置</el-button>
        </div>
      </div>
      <div class="module-main">
        <div style="margin: 30px 0">
          <el-button type="primary" @click="Showselected(1)">新增</el-button>
          <el-button type="warning" @click="selecteddel">删除</el-button>
        </div>
        <el-table
          :data="selecteddatalist"
          max-height="600"
          border
          fit
          @selection-change="handleSelectionChange"
        >
          <el-table-column fixed type="selection" align="center" width="55" />
          <el-table-column align="center" prop="name" label="名称" />
          <el-table-column min-width="200" align="center" label="图片">
            <template slot-scope="scope">
              <img :src="scope.row.cate_image_url" style="width: 170px; height: 100px;" alt="图片" />
            </template>
          </el-table-column>
          <el-table-column align="center" prop="count" label="商品数量" />
          <el-table-column min-width="200" align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" @click="Showselected(2,scope.row.selected_id)">编辑</el-button>
              <el-button
                :type="scope.row.is_show == 0 ? 'info' : 'success'"
                @click="cateselectedshow(scope.row)"
              >{{ scope.row.is_show == 0 ? '不显示' : '显示' }}</el-button>
            </template>
          </el-table-column>
          <el-table-column min-width="200" align="center" label="排序">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-arrow-up"
                circle
                @click="move('2' ,scope.$index, 1)"
              />
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-arrow-down"
                circle
                @click="move('1' ,scope.$index, 1)"
              />
              <el-button
                size="mini"
                type="success"
                @click="handleGoTop(selecteddatalist,scope.$index, 8)"
              >置顶</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 第六板块 底部推荐商品-->
    <div class="module">
      <div class="title">
        <div class="module-title-name">第六板块: 底部推荐商品</div>

        <div class="module-title-main"></div>

        <div class="module-isShow-btn">
          <el-switch
            style="margin: 0 20px;"
            v-show="recommend.id"
            v-model="recommend.is_show"
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
        <div style="margin: 30px 0">
          <el-button icon="el-icon-edit" @click="onProductCate()" type="primary">新增分类</el-button>
          <el-button icon="el-icon-delete" @click="deleteRecommendCate" type="warning">删除分类</el-button>
        </div>
        <el-table
          :data="recommend.dataList"
          max-height="600"
          border
          fit
          @selection-change="val => { this.recommend.multipleSelection = val; }"
        >
          <!-- <el-table-column fixed type="selection" width="55"></el-table-column> -->
          <el-table-column fixed type="selection" align="center" width="55" />
          <el-table-column align="center" prop="name" label="分类" />
          <!-- <el-table-column align="center" min-width="200px" prop="product_name" label="分离" /> -->

          <el-table-column min-width="200" align="center" label="分类顶图">
            <template slot-scope="scope">
              <img :src="scope.row.image_url" style="width: 170px; height: 100px;" alt="分类顶图" />
            </template>
          </el-table-column>

          <el-table-column align="center" prop="product_count" label="推荐商品总数" />
          <el-table-column min-width="200" align="center" label="操作">
            <template slot-scope="scope">
              <el-button @click="onProductCate(scope.row.id)" type="primary">编辑</el-button>
              <el-button
                @click="changeShowRecommend( scope.row.id, scope.row.is_show === 1 ? 2 : 1)"
                :type="scope.row.is_show == 1 ? 'info' : 'success'"
              >{{ scope.row.is_show == 1 ? '不显示' : '显示' }}</el-button>
            </template>
          </el-table-column>
          <el-table-column min-width="200" align="center" label="排序">
            <template slot-scope="scope">
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
                @click="handleGoTop(recommend.dataList,scope.$index, 5)"
              >置顶</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 第五模块 新增/编辑分类 -->
    <el-dialog
      center
      title="新增/编辑 分类"
      :visible.sync="recommend_mask.show"
      top="50px"
      class="mask"
      :close-on-click-modal="false"
      :before-close="resetRecommendMask"
    >
      <el-row style="margin-bottom: 30px;">
        <el-button @click="resetRecommendMask" type="info">关闭</el-button>
        <el-button @click="commitRecommendDetail" type="success">保存</el-button>
      </el-row>
      <div style="max-height: 60vh; overflow-y:scroll;">
        <el-form label-width="100" @submit.native.prevent>
          <el-form-item label="选择分类:">
            <el-select
              v-model="recommend_mask.product_cate_id"
              @change="recommend_mask.product = []"
            >
              <el-option
                v-for="(item, index) in recommend_mask.cate_info"
                :key="index"
                :label="item"
                :value="index"
              ></el-option>
            </el-select>
            <span class="laberImp">( 提示: 切换分类时会同时清空此分类下的商品; )</span>
          </el-form-item>
          <el-form-item label="排列方式">
            <el-radio-group v-model="recommend_mask.layout">
              <el-radio :label="1">单排</el-radio>
              <el-radio :label="2">双排</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div style="margin:30px 0 15px;">
          模块图片
          <span class="laberImp">图片规格 340*200</span>
        </div>
        <Upimg
          :exporteurl="exporteurl"
          :fileList="recommendImage"
          fileName="image"
          :showList="true"
          :fileHeaders="headers"
          :maxlimit="1"
          :index="3"
          @Successimg="SuccessimgArray"
        ></Upimg>
        <div style="margin:15px 0;">
          <el-button
            :disabled="!recommend_mask.product_cate_id"
            @click="onAddProduct(5)"
            icon="el-icon-plus"
            type="primary"
          >添加商品</el-button>
          <el-button
            icon="el-icon-close"
            @click="recommend_mask.product = recommend_mask.product.filter(item => !recommend_mask.multipleSelection.some(i => i.product_id === item.product_id))"
            type="warning"
          >删除</el-button>
          <span class="laberImp">( 提示: 添加推荐商品时必须请先选择其商品所属的分类; )</span>
        </div>

        <!-- 商品列表增添 -->
        <el-table
          v-loading="recommend_mask.loading"
          :data="recommend_mask.product"
          max-height="600"
          border
          fit
          @selection-change="val => { this.recommend_mask.multipleSelection = val; }"
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
                @click="handleGoTop(recommend_mask.product,scope.$index, 6)"
              >置顶</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

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
          <el-input style="width: 300px" v-model="product_mask.keyword" placeholder="商品ID/商品名"></el-input>
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
      title="添加外卖商家"
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

    <!-- 新增修改子模块 -->
    <PublicDialog
      v-if="ShowVisible"
      tsxTitle="子模块管理"
      :isShowVisible="ShowVisible"
      tsxWidth="1200px"
      @handleClose="handleClose"
    >
      <div slot="forms" style="width:100%">
        <el-row style="margin-bottom: 30px;">
          <el-button type="info" @click="handleClose">关闭</el-button>
          <el-button type="success" @click="selectedcommodity">保存</el-button>
        </el-row>
        <div>
          <el-form label-width="100" @submit.native.prevent>
            <el-form-item label="名称:">
              <el-input
                v-model="selected.name"
                style="width: 300px"
                maxlength="10"
                placeholder="0/10"
              />
            </el-form-item>
            <el-form-item label="排列方式">
              <el-radio-group value="2">
                <el-radio label="2">双排</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
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
            :index="4"
            @Successimg="SuccessimgArray"
          />
          <div style="margin-top:15px ;">
            <el-form label-width="100" @submit.native.prevent>
              <el-form-item label="跳转链接">
                <el-radio-group v-model="selected.jump_type">
                  <el-radio :label="0">生成商品列表</el-radio>
                  <el-radio :label="1">
                    <span>自定义</span>
                    <el-input
                      v-model="selected.jump_url"
                      style="width: 300px"
                      maxlength="10"
                      placeholder="商品链接，或案例链接"
                    />
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
          <div style="margin:15px 0;">
            <el-button type="primary" @click="addproduct">添加商品</el-button>
            <el-button type="warning" @click="recommenddetele">删除</el-button>
          </div>

          <!-- 商品列表增添 -->
          <el-table
            :data="selected.product_list"
            style="width: 100%"
            max-height="200"
            @selection-change="selectCommodity"
          >
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
                  @click="move('2' ,scope.$index, 2)"
                ></el-button>
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-arrow-down"
                  circle
                  @click="move('1' ,scope.$index, 2)"
                ></el-button>
                <el-button
                  size="mini"
                  type="success"
                  @click="handleGoTop(selected.product_list,scope.$index, 7)"
                >置顶</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </PublicDialog>

    <AddCommodity
      v-if="product"
      :product_ids="product_ids"
      :channel="1"
      :agent="agent_id+''"
      @shut="setProduct"
      @Selection="SelectionProduct"
    />
  </div>
</template>

<script>
import vuedraggable from "vuedraggable";
import { exporteurl, arrRoofPlacement, arrDisplacement } from "@/utils/user";
import { upimg } from "@/api/user";
import Upimg from "@/components/Upimg";
import { parseTime } from "@/utils/index";
import { Tips } from "@/utils/elementEncapsulation";
import PublicDialog from "@/components/PublicDialog";
import AddCommodity from "@/components/AddCommodity";
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
  goodStoreCommit, // 好店推荐(第二板块)保存配置
  commitRob, // 推荐第三板块设置
  commitMember, // 保存第四板块会员权益商品配置
  commitRecommend, // 保持底部推荐商品配置
  getRecommendDetail, // 获取底部推荐商品分类详情
  commitRecommendDetail, // 提交新增推荐商品分类详情
  getEditRecommendDetail, // 获取编辑底部推荐商品分类详情
  commitEditRecommendDetail, // 提交推荐分类修改详情
  changeShowRecommend, // 切换推荐分类是否显示
  deleteRecommendCate, // 删除商品分类
  selectedadd8, // 添加精选推荐
  selected_list,
  selected_info,
  selectededit8,
  selected_show,
  selected_del,
  cate_selected_show,
  add_modular,
} from "@/api/indexPageSet/indexCitySet";

export default {
  components: { vuedraggable, Upimg, PublicDialog, AddCommodity },
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
      agent_id: "",
      agent: [],
      isAll: false, // 是否多个代理区域一并设置
      multipleSelection: [],
      // icon配置数据
      iconModule: {
        icon_data: [], // icon 列表 其余数据 由接口补充
      },
      showAddIcon: false, // 是否显示添加ICON弹窗
      icon_extra: {
        // 弹窗中的额外自定义数据 -- 别问这是啥, 后台一个自动控制三个input,后面接手的记得去锤产品和后台
        product_id: "", // 商品Id
        store_id: "", // 商家Id
        house_id: "", // 楼盘Id
      },
      product_ids: [],
      selecteddatalist: [],
      selectedSelection: [],
      selectionCommodity: [],
      product: false,
      selected_is_show: "1",
      selected_id: "",
      imglist: [],
      selected: {
        // 精选
        name: "",
        image: "",
        image_url: "",
        jump_type: 0,
        jump_url: "",
        product_list: [],
      },
      adddete: 1,
      addIcon: {
        // icon 添加/修改弹窗
        name: "",
        icon: "", // icon图标CDN地址
        bg_img: "", // icon背景图片CDN地址
        icon_url: "", // icon图标地址
        bg_img_url: "", // 背景图片地址
        product: "", // 商品
        store: "", // 商家
        houses: "", // 楼盘
        bg_color: "", // 背景色
        product_data: [], // 商品列表
        multipleSelection: [], // 选中的商品.
        jump_type: "", // 跳转方式
        appoint_type: "", // 跳转页面地址Key
        appoint_type_map: {}, // 指定页面, 跳转地址
        url: "", // 自定义跳转地址
      },

      goodStore: {
        // 好店推荐
        count: "",
        module_id: "", //板块id
        name: "", // 板块名称
        sub_title: "", // 板块副标题
        is_show: 0, // 是否显示
        dataList: [], // 需要展示的列表数据
        multipleSelection: [], // 选中的商品.
      },

      mustRob: {
        // 每日必抢
        id: "",
        name: "",
        sub_title: "",
      },

      hot: {
        // 秒杀爆款
        id: "",
        is_show: 0,
        name: "",
      },

      group: {
        // 拼团
        id: "",
        is_show: 0,
        name: "",
      },

      member: {
        // 会员模块
        name: "",
        multipleSelection: [], // 选中的商品.
        sub_title: "",
        id: "",
        dataList: [], // 表格数据
      },

      // 底部推荐分类
      recommend: {
        id: "",
        is_show: 0,
        name: "",
        dataList: [],
        multipleSelection: [],
      },
      recommend_mask: {
        // 底部推荐商品弹窗
        image: "",
        image_url: "",
        multipleSelection: [], // 选中的商品.
        product_cate_id: "", // 分类id
        cate_info: [], // 分类列表
        product: [], // 表格数据
        layout: 1, // 单/双行布局
        show: false, // 是否显示
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
        show: false,
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
        loading: false, // 是否显示loading
      },
      rule_mask: {
        //  添加/修改规则 针对于模块二的推荐商家的规则时间
        show: false,
        index: "",
        timeout: [],
      },
    };
  },
  created() {
    this.getAgent().then((res) => {
      this.getData();
      this.selectedlist();
    });
  },
  updated() {
    console.log("进行一次页面重绘");
  },
  methods: {
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
        const arr = [];
        val.map((tsx) => {
          Object.assign(tsx, { seckill_data: [] });
          arr.push(tsx);
        });
        this.selected.product_list.push.apply(this.selected.product_list, arr);
      }
      this.product = false;
    },
    selectedcommodity() {
      Object.assign(this.selected, { agent_id: this.agent_id });
      if (this.adddete == 1) {
        selectedadd8(this.selected).then((res) => {
          if (res.code == 1) {
            this.ShowVisible = false;
            this.selectedlist();
            this.getData();
          } else Tips({ that: this, type: "error", message: res.msg });
        });
      } else {
        selectededit8(this.selected).then((res) => {
          if (res.code == 1) {
            this.ShowVisible = false;
            this.selectedlist();
            this.getData();
          } else Tips({ that: this, type: "error", message: res.msg });
        });
      }
    },
    selectedlist() {
      selected_list({ agent_id: this.agent_id }).then((res) => {
        if (res.code == 1) {
          this.selecteddatalist = res.data.data;
          this.selected_is_show = res.data.is_show;
          this.selected_id = res.data.id;
        } else Tips({ that: this, type: "error", message: res.msg });
      });
    },
    Showselected(tsx, val) {
      /** 新增编辑 */
      this.selected = {
        // 精选
        name: "",
        image: "",
        image_url: "",
        jump_type: 0,
        jump_url: "",
        product_list: [],
      };
      this.imglist = [];
      this.adddete = tsx;
      if (tsx != 1) {
        this.selectedinfo(val);
      }
      this.ShowVisible = true;
    },
    handleClose() {
      this.ShowVisible = false;
    },
    handleSelectionChange(val) {
      /** 选中 */
      const arr = [];
      val.map((res) => {
        arr.push(res.selected_id);
      });
      this.selectedSelection = arr;
    },
    selectCommodity(val) {
      const arr = [];
      val.map((res) => {
        arr.push(res);
      });
      this.selectionCommodity = arr;
    },
    recommenddetele() {
      if (this.selectionCommodity.length > 0) {
        for (const i in this.selectionCommodity) {
          for (const key in this.selected.product_list) {
            if (
              this.selectionCommodity[i].product_id ===
              this.selected.product_list[key].product_id
            ) {
              this.selected.product_list.splice(key, 1);
            }
          }
        }
      } else {
        this.$message.error("请先选中需要删除的商品");
      }
    },
    selectedinfo(selected_id) {
      /** 查看精选推荐详情 */
      selected_info({ agent_id: this.agent_id, selected_id }).then((res) => {
        if (res.code == 1) {
          this.selected = res.data;
          this.imglist = [
            { name: "", imgPath: res.data.image, url: res.data.image_url },
          ];
        } else Tips({ that: this, type: "error", message: res.msg });
      });
    },
    move(val, index, tsx) {
      /** 上下移动 */
      if (tsx == 1) {
        this.selecteddatalist = arrDisplacement(
          val,
          this.selecteddatalist,
          index
        );
      } else {
        this.selected.product_list = arrDisplacement(
          val,
          this.selected.product_list,
          index
        );
      }
    },
    selectedshow(id, val) {
      // 是否显示精选推荐模块
      selected_show({ id, is_show: val }).then((res) => {
        if (res.code == 1) {
          this.getData();
          this.selectedlist();
          Tips({ that: this, type: "success", message: res.msg });
        } else Tips({ that: this, type: "error", message: res.msg });
      });
    },
    selecteddel() {
      // 删除精选推荐模块
      if (this.selectedSelection.length > 0) {
        selected_del({
          selected_id_str: this.selectedSelection.toString(),
        }).then((res) => {
          if (res.code == 1) {
            this.getData();
            this.selectedlist();
            Tips({ that: this, type: "success", message: res.msg });
          } else Tips({ that: this, type: "error", message: res.msg });
        });
      } else Tips({ that: this, type: "error", message: "请选择一条" });
    },
    cateselectedshow(row) {
      //  是否显示精选推荐列表中模块
      cate_selected_show({
        id: row.selected_id,
        is_show: row.is_show == 1 ? 0 : 1,
      }).then((res) => {
        if (res.code == 1) {
          this.getData();
          this.selectedlist();
          Tips({ that: this, type: "success", message: res.msg });
        } else Tips({ that: this, type: "error", message: res.msg });
      });
    },
    addmodular() {
      //  保存精选推荐模块
      const selected_id_str = [];
      this.selecteddatalist.map((res) => {
        selected_id_str.push(res.selected_id);
      });
      add_modular({ selected_id_str: selected_id_str.toString() }).then(
        (res) => {
          if (res.code == 1) {
            this.getData();
            this.selectedlist();
            Tips({ that: this, type: "success", message: res.msg });
          } else Tips({ that: this, type: "error", message: res.msg });
        }
      );
    },
    /** 精选结束 */
    // 获取当前用户的代理身份 ( 所有接口都必须基于此接口返回参数进行操作 )
    getAgent() {
      // 返回一个axios封装的函数, 此页所有其他接口与此函数的then方法中进行操作
      return getAgent().then((res) => {
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
        agent_id: this.agent_id,
      }).then((res) => {
        if (res.code == 1) {
          // console.log(res)
          // 进行对应板块数据填充 区分
          console.log("!!!", res.data.config_data);
          for (let k in res.data.config_data) {
            let item = res.data.config_data[k];
            switch (item.module_id) {
              case 1: // 当前属于第一icon板块， 填充数据
                item.icon_data = res.data.icon_data;
                this.iconModule = item;
                break;
              case 2: // 当前属于第一板块好店推荐,  填充数据
                item.dataList = res.data.waimai_store_data;
                this.goodStore = item;
                break;
              case 3:
                this.mustRob = item;
                break;
              case 4:
                this.hot = item;
                break;
              case 5:
                this.group = item;
                break;
              case 6:
                item.dataList = res.data.tj_product_data_5;
                this.member = item;
                break;
              case 7:
                item.dataList = res.data.tj_product_data_6;
                this.recommend = item;
                break;
              default:
                console.log("前后端moudle_id配置出现冲突, 严重问题警告");
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
      this.getAgent().then((res) => {
        this.agent_id = e;
        this.getData();
        this.selectedlist();
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
        is_show,
      })
        .then((res) => {
          if (res.code == 1) {
            this.$message.success("切换成功");
          } else {
            this.$message.error("操作失败, error:" + res.msg);
          }
        })
        .catch((res) => {
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
            newArr[index],
          ];
        } else {
          this.$message.warning("已经是第一了，没法再向上了");
        }
      } else {
        // 当选中和下一位互换位置时
        if (index != newArr.length - 1) {
          [newArr[index], newArr[index + 1]] = [
            newArr[index + 1],
            newArr[index],
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
     * @param {Number} index  互换位置的index []
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
          this.goodStore.dataList = this.changeIndex(
            type,
            index,
            this.goodStore.dataList
          );
          break;
        case 4:
          this.member.dataList = this.changeIndex(
            type,
            index,
            this.member.dataList
          );
          break;
        case 5:
          this.recommend.dataList = this.changeIndex(
            type,
            index,
            this.recommend.dataList
          );
          break;
        case 6:
          this.recommend_mask.product = this.changeIndex(
            type,
            index,
            this.recommend_mask.product
          );
          break;
        default:
          this.$message.error("前端逻辑错误! 请打死那个后台");
      }

      // console.log(this.$data["goodStore.dataList"]);
      // this.handleChangeIndexDemo('goodStore.dataList', 2, 'up');
    },

    /**
     *  优化版demo
     */

    // handleChangeIndexDemo(moduleName = "", index, type) {
    //   let moduleArr;
    //   moduleName.split('.').forEach(item => {
    //     moduleArr = moduleArr ? moduleArr[item] : this.$data[item] ;
    //   });
    //   console.log(moduleArr)
    // },

    /**
     * 一键置顶
     */
    handleGoTop(modal, index, id) {
      switch (id) {
        case 1:
          this.addIcon.product_data = arrRoofPlacement(modal, index);
          break;
        case 2:
          this.goodStore.dataList = arrRoofPlacement(modal, index);
          break;
        case 4:
          this.member.dataList = arrRoofPlacement(modal, index);
          break;
        case 5:
          this.recommend.dataList = arrRoofPlacement(modal, index);
          break;
        case 6:
          this.recommend_mask.product = arrRoofPlacement(modal, index);
          break;
        case 7:
          this.selected.product_list = arrRoofPlacement(modal, index);
          break;
        case 8:
          this.selecteddatalist = arrRoofPlacement(modal, index);
          break;
        default:
          this.$message.error("前端逻辑错误! 请打死那个后台");
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
            (item) => item.product_id
          );
          break;
        case 4: // 第四板块的添加商品
          this.product_mask.product_id = this.member.dataList.map(
            (item) => item.product_id
          );
          break;
        case 5: // 第五板块的添加商品
          this.product_mask.product_id = this.recommend_mask.product.map(
            (item) => item.product_id
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
      } else if (this.product_mask.moduleId == 4) {
        this.member.dataList = this.member.dataList.concat(
          this.product_mask.multipleSelection
        );
      } else if (this.product_mask.moduleId == 5) {
        this.recommend_mask.product = this.recommend_mask.product.concat(
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
        loading: false, // 是否显示loading
      };
    },

    // 获取添加的商品列表
    getAddProduct() {
      this.product_mask.loading = true;
      getAddProduct({
        agent_id: this.agent_id || "",
        module: this.product_mask.moduleId || "",
        page: this.product_mask.page || "",
        limit: this.product_mask.limit || "",
        icon_id: this.addIcon.icon_id || "",
        product_id_arr: this.product_mask.product_id || "",
        keyword: this.product_mask.keyword,
        product_cate_id: this.recommend_mask.product_cate_id || "",
        type: 1,
      }).then((res) => {
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

    // 删除icon
    deleteIcon(id = "") {
      deleteIcon({
        id,
      }).then((res) => {
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
      getEditIcon({ id, agent_id: this.agent_id }).then((res) => {
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
        agent_id: this.agent_id || "",
      }).then((res) => {
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
          id: this.iconModule.id || "",
          icon_id: this.iconModule.icon_data.map((item) => item.id) || "",
        })
          .then((res) => {
            if (res.code === 1) {
              this.$message.success("排序更新完成");
            } else {
              this.$message.error("排序错误" + res.msg);
            }
          })
          .catch((error) => {
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

      let list = this.addIcon.product_data.map((item) => item.product_id);
      if (this.addIcon.id) {
        // 如果板块中有此数据, 则为修改Icon

        // 修改icon的提交
        editIconCommit({
          id: this.addIcon.id || "",
          name: this.addIcon.name || "",
          icon: this.addIcon.icon || "",
          bg_img: this.addIcon.bg_img || "",
          jump_type: this.addIcon.jump_type || "",
          appoint_type: this.addIcon.appoint_type || "",
          product_id: list.length === 0 ? "" : list,
          value_id,
          url: this.addIcon.url || "",
          bg_color: this.addIcon.bg_color || "",
        }).then((res) => {
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
          product_id: list.length === 0 ? "" : list,
          value_id,
          bg_color: this.addIcon.bg_color,
          url: this.addIcon.url || "",
        }).then((res) => {
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
        url: "",
      };
      this.icon_extra = {
        // 弹窗中的额外自定义数据 -- 别问这是啥, 后台一个id字段控制三个input,后面接手的记得去锤产品和后台
        product_id: "", // 商品Id
        store_id: "", // 商家Id
        house_id: "", // 楼盘Id
      };
    },
    /* icon板块控制 end */

    /* 外卖商家(好店推荐部分) start */
    // 获取此代理区域下的外卖商家
    getStoreList() {
      this.store_mask.loading = true;
      let store_id = this.goodStore.dataList.map((item) => item.store_id);
      getStoreList({
        name: this.store_mask.name,
        page: this.store_mask.page,
        category_id: this.store_mask.category_id || 0,
        limit: this.store_mask.limit,
        store_id: store_id.length === 0 ? "" : store_id,
        agent_id: this.agent_id,
      }).then((res) => {
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
      this.goodStore.dataList = this.goodStore.dataList.concat(
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
        show: false,
      };
    },

    // 好店推荐提交修改按钮
    goodStoreCommit() {
      let store_data = this.goodStore.dataList;
      goodStoreCommit({
        agent_id: this.agent_id,
        name: this.goodStore.name,
        sub_title: this.goodStore.sub_title,
        store_data: store_data.length === 0 ? "" : store_data,
        id: this.goodStore.id,
        count: this.goodStore.count,
      })
        .then((res) => {
          if (res.code == 1) {
            this.$message.success("配置保存成功");
            this.getData();
          } else {
            this.$message.error("保存失败! error: " + res.msg);
          }
        })
        .catch((res) => {
          this.$$message.error("连接服务器时出现异常");
        });
    },

    // 添加规则
    addRule(index) {
      let obj = {
        index,
        show: true,
        timeout: [
          this.goodStore.dataList[index].start_time,
          this.goodStore.dataList[index].end_time,
        ],
      };

      Object.assign(this.rule_mask, obj);
    },

    // 确认提交规则
    confirmRule() {
      let index = this.rule_mask.index;
      /**
       * 开发日志 -- 小利 debugger
       * 由于vue的渲染机制不能深入到层次过深, 直接在原dom上修改会不刷新dom. 所以我们这里使用一个新的对象来刷新
       */
      let dataList = [...this.goodStore.dataList];
      // 进行es6的解构赋值+  dataList[index].start_time
      let start_time, end_time;
      [start_time, end_time] = this.rule_mask.timeout || [];
      dataList[index].start_time = parseTime(start_time);
      dataList[index].end_time = parseTime(end_time);

      // 进行重新赋值
      this.goodStore.dataList = dataList;
      this.cancelRule();
    },

    // 取消更新规则 (重置弹窗)
    cancelRule() {
      this.rule_mask = {
        show: false,
        index: "",
        timeout: [],
      };
    },

    /* 外卖商家(好店推荐部分) end */

    // 打开推荐商品弹窗
    onProductCate(id = "") {
      this.recommend_mask.show = true;
      this.recommend_mask.id = id;
      this.getRecommendDetail();
    },
    changeShowRecommend(id, is_show = 1) {
      changeShowRecommend({
        id,
        is_show,
      }).then((res) => {
        if (res.code === 1) {
          this.$message.success("切换成功!");
          this.getData();
        } else {
          this.$message.error("切换失败! error: " + res.msg);
        }
      });
    },
    // 删除推荐分类商品
    deleteRecommendCate() {
      let idArr = this.recommend.multipleSelection || [];
      if (idArr.length === 0) {
        this.$message.warning("请先选中需要删除的分类");
        return;
      }
      deleteRecommendCate({
        id: idArr.map((item) => item.id),
      }).then((res) => {
        if (res.code === 1) {
          this.$message.success("删除成功");
          this.getData();
        } else {
          this.$message.error("删除失败! error:" + res.msg);
        }
      });
    },
    /**
     * 获取推荐分类详情
     */
    getRecommendDetail() {
      if (!this.recommend_mask.id) {
        // 没有传入id. 即说明此为添加分类操作
        getRecommendDetail({
          agent_id: this.agent_id,
        }).then((res) => {
          if (res.code === 1) {
            this.recommend_mask.cate_info = res.data;
          } else {
            this.$message.warning(res.msg);
          }
        });
      } else {
        this.recommend_mask.loading = true;
        getEditRecommendDetail({
          id: this.recommend_mask.id,
        }).then((res) => {
          this.recommend_mask.loading = false;
          if (res.code === 1) {
            res.data.show = true;
            this.recommend_mask = res.data;
          } else {
            this.$message.warning(res.msg);
          }
        });
      }
    },

    /**
     * 提交商品分类详情
     */
    commitRecommendDetail() {
      if (!this.recommend_mask.id) {
        // 如果没有分类id, 则此提交为新增提交
        commitRecommendDetail({
          product_cate_id: this.recommend_mask.product_cate_id || "",
          image: this.recommend_mask.image || "",
          name:
            this.recommend_mask.cate_info[
              this.recommend_mask.product_cate_id
            ] || "",
          layout: this.recommend_mask.layout || "",
          product_id: this.recommend_mask.product.map(
            (item) => item.product_id
          ),
          agent_id: this.agent_id,
          layout: this.recommend_mask.layout,
        }).then((res) => {
          if (res.code === 1) {
            // 提交商品详情后关闭并重置弹窗
            this.resetRecommendMask();
            this.getData();
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        commitEditRecommendDetail({
          product_cate_id: this.recommend_mask.product_cate_id || "",
          image: this.recommend_mask.image || "",
          name:
            this.recommend_mask.cate_info[
              this.recommend_mask.product_cate_id
            ] || "",
          layout: this.recommend_mask.layout || "",
          product_id: this.recommend_mask.product.map(
            (item) => item.product_id
          ),
          agent_id: this.agent_id,
          id: this.recommend_mask.id,
          layout: this.recommend_mask.layout,
        }).then((res) => {
          if (res.code === 1) {
            // 提交商品详情后关闭并重置弹窗
            this.resetRecommendMask();
            this.getData();
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },

    /**
     * 关闭并重置弹窗中的数据
     */
    resetRecommendMask() {
      this.recommend_mask = {
        // 底部推荐商品弹窗
        image: "",
        image_url: "",
        multipleSelection: [], // 选中的商品.
        product_cate_id: "", // 分类id
        cate_info: [], // 分类列表
        product: [], // 表格数据
        layout: 1, // 单/双行布局
        show: false, // 是否显示
        loading: false,
      };
    },

    // 提交每日必抢配置
    commitRob() {
      commitRob({
        agent_id: this.agent_id,
        name: this.mustRob.name,
        sub_title: this.mustRob.sub_title,
        seckill_name: this.hot.name,
        assemble_name: this.group.name,
      })
        .then((res) => {
          if (res.code === 1) {
            this.$message.success("保存成功");
            this.getData();
          } else {
            this.$message.error("保存失败! error:" + res.msg);
          }
        })
        .catch((error) => {
          this.$message.error("连接服务器出现异常");
        });
    },

    // 提交会员特卖商品配置
    commitMember() {
      let product_id = this.member.dataList.map((item) => item.product_id);
      commitMember({
        agent_id: this.agent_id,
        name: this.member.name,
        sub_title: this.member.sub_title,
        product_id: product_id.length === 0 ? "" : product_id,
        id: this.member.id,
      })
        .then((res) => {
          if (res.code == 1) {
            this.$message.success("配置成功");
            this.getData();
          } else {
            this.$message.error("配置出错! error: " + res.msg);
          }
        })
        .catch((error) => {
          this.$message.error("连接服务器出现异常!");
        });
    },

    // 提交底部推荐商品
    commitRecommend() {
      console.log(this.recommend);
      let idArr = this.recommend.dataList.map((item) => item.id);
      commitRecommend({
        agent_id: this.agent_id,
        id: idArr.length === 0 ? "" : idArr,
      })
        .then((res) => {
          if (res.code == 1) {
            this.$message.success("配置成功");
            this.getData();
          } else {
            this.$message.error("配置出错 error： " + res.msg);
          }
        })
        .catch((res) => {
          this.$message.error("连接服务器出现异常!");
        });
    },
  },
  computed: {
    // 添加/修改icon弹窗中的icon图标
    iconImage() {
      let arr = [];
      if (this.addIcon.icon && this.addIcon.icon_url) {
        arr.push({
          name: "",
          imgPath: this.addIcon.icon,
          url: this.addIcon.icon_url,
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
          url: this.addIcon.bg_img_url,
        });
      }

      return arr;
    },
    recommendImage() {
      let arr = [];
      if (this.recommend_mask.image && this.recommend_mask.image_url) {
        arr.push({
          name: "",
          imgPath: this.recommend_mask.image,
          url: this.recommend_mask.image_url,
        });
      }

      return arr;
    },
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