<template lang="html">
	<section>
		<el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
	  	  <el-form :inline='true' :model='filters'>
			  <el-form-item  v-if='addItemTitle.input.courseId'>
	  			  <el-input v-model='filters.courseId' placeholder='请输入课程ID' @keydown.enter.native.prevent @change="handleSeek" icon="circle-cross" :on-icon-click="handleIconClickCourseId"></el-input>
	  		  </el-form-item>
			  <el-form-item  v-if='addItemTitle.input.courseName'>
	  			  <el-input v-model='filters.courseName' placeholder='请输入课程名字' @keydown.enter.native.prevent @change="handleSeek" disabled icon="circle-cross" :on-icon-click="handleIconClickCourseName"></el-input>
	  		  </el-form-item>
	  		  <el-form-item  v-if='addItemTitle.input.id'>
	  			  <el-input v-model='filters.id' :placeholder='firstPlaceholder' @keydown.enter.native.prevent @change="handleSeek" icon="circle-cross" :on-icon-click="handleIconClickId"></el-input>
	  		  </el-form-item>
	  		  <el-form-item   v-if='addItemTitle.input.name'>
	  			  <el-input v-model='filters.name' :placeholder='secondPlaceholder'  @keydown.enter.native.prevent @change="handleSeek" icon="circle-cross" :on-icon-click="handleIconClickName"></el-input>
	  		  </el-form-item>
			  <!-- 选择类型 -->
			  <el-form-item v-if='addItemTitle.merchandiseType'>
				  <el-cascader :options="addItemTitle.merchandiseType.merchandiseOption" v-model="filters.merchandiseType"></el-cascader>
			  </el-form-item>
			  <!-- 选择课程类型 -->
			  <el-form-item v-if='addItemTitle.input.courseType'>
				  <el-cascader :options="courseOptions" change-on-select clearable v-model="filters.courseType" placeholder="请选择课程类型">></el-cascader>
			  </el-form-item>
			  <!-- 选择课程售卖类型 -->
			  <el-form-item v-if='addItemTitle.input.feeType'>
				  <el-cascader :options="options" clearable v-model="filters.feeType" placeholder="请选择课程售卖类型">></el-cascader>
			  </el-form-item>
	  		  <el-form-item v-if='addItemTitle.button.seek'>
	  			  <el-button type='primary' @click='handleSeek'>查询</el-button>
	  		  </el-form-item>
	  		  <el-form-item  v-if='addItemTitle.button.add'>
	  			  <el-button type='primary' @click='handleAdd'>新增</el-button>
	  		  </el-form-item>
	  	  </el-form>
	    </el-col>

		<!-- 新增界面 -->
        <el-dialog :title='addItemTitle.formHeader.label' v-model='addFormVisible' :close-on-click-modal='false'>
			<el-form :model="addItem" :rules="addItemRules" ref="addItem">
				<!-- 名称 -->
	  		    <el-form-item :label="addItemTitle.name.label" :label-width="formLabelWidth" prop="name" v-if='addItemTitle.name'>
	  		        <el-input v-model="addItem.name"  auto-complete="off" @keydown.enter.native.prevent></el-input>
	  		    </el-form-item>
				<!-- 课程类型 -->
				<el-form-item :label="addItemTitle.type.label" :label-width="formLabelWidth" prop="type" v-if='addItemTitle.type'>
					<el-cascader expand-trigger="hover" :options="courseOptions" v-model="addItem.type" @change='changeCourseType'></el-cascader>
	  		    </el-form-item>
				<!-- 观看类型 -->
				<el-form-item :label="addItemTitle.viewType.label" :label-width="formLabelWidth" prop="viewType" v-if='addItemTitle.viewType'>
					<el-cascader expand-trigger="hover" :options="addItemTitle.viewType.options" v-model="addItem.viewType"></el-cascader>
	  		    </el-form-item>
                <!-- 课程版本 -->
				<el-form-item :label="addItemTitle.course_version.label" :label-width="formLabelWidth" prop="course_version" v-if='addItemTitle.course_version'>
					<el-cascader expand-trigger="hover" :options="addItemTitle.course_version.options" v-model="addItem.course_version"></el-cascader>
	  		    </el-form-item>
				<!-- 课程新类型 -->
				<el-form-item :label="addItemTitle.course_levels.label" :label-width="formLabelWidth" prop="course_levels" v-if='addItemTitle.course_levels'>
					<el-select v-model="addItem.course_levels" placeholder="请选择" multiple style="width:500px;">
				      <el-option
				        v-for="item in addItemTitle.course_levels.options"
				        :key="item.value"
				        :label="item.label"
				        :value="item.value">
				      </el-option>
				    </el-select>
	  		    </el-form-item>
				<!-- 课表类型 -->
				<el-form-item :label="addItemTitle.choose_schedule_type.label" :label-width="formLabelWidth" v-if='addItemTitle.choose_schedule_type'>
					<el-select v-model="addItem.choose_schedule_type" placeholder="请选择" style="width:500px;">
				      <el-option
				        v-for="item in addItemTitle.choose_schedule_type.options"
				        :key="item.value"
				        :label="item.label"
				        :value="item.value">
				      </el-option>
				    </el-select>
	  		    </el-form-item>
				<!-- image_url -->
				<el-form-item :label="addItemTitle.image_url.label" :label-width="formLabelWidth" v-if='addItemTitle.image_url'>
				    <el-input v-model="addItem.image_url"  auto-complete="off" @keydown.enter.native.prevent placeholder='请输入图片地址'></el-input>
	  		    </el-form-item>
				<!-- 内部名称 -->
                <el-form-item :label="addItemTitle.internalName.label" :label-width="formLabelWidth"  v-if='addItemTitle.internalName'>
	  		        <el-input v-model="addItem.internalName"  auto-complete="off" @keydown.enter.native.prevent></el-input>
	  		    </el-form-item>
				<!-- 课程数量 -->
                <el-form-item :label="addItemTitle.lessonNumber.label" :label-width="formLabelWidth" prop="lessonNumber"  v-if='addItemTitle.lessonNumber'>
	  		        <el-input v-model.number="addItem.lessonNumber"  auto-complete="off" @keydown.enter.native.prevent></el-input>
	  		    </el-form-item>
				<!-- 商品类型 -->
				<el-form-item :label="addItemTitle.merchandiseType.label" :label-width="formLabelWidth" prop="merchandiseType" v-if='addItemTitle.merchandiseType'>
					<el-cascader expand-trigger="hover" :options="addItemTitle.merchandiseType.merchandiseOption" v-model="addItem.merchandiseType"></el-cascader>
	  		    </el-form-item>
				<!-- 建一个公共的类型 -->
				<el-form-item :label="addItemTitle.customType.label" :label-width="formLabelWidth" prop="customType" v-if='addItemTitle.customType'>
					<el-cascader expand-trigger="hover" :options="addItemTitle.customType.customOption" v-model="addItem.customType"></el-cascader>
	  		    </el-form-item>
				<!-- Sku类型 -->
				<el-form-item :label="addItemTitle.SkuType.label" :label-width="formLabelWidth" prop="SkuType" v-if='addItemTitle.SkuType'>
					<el-cascader expand-trigger="hover" :options="addItemTitle.SkuType.SkuOption" v-model="addItem.SkuType"  @change="handleChangeSkuType"></el-cascader>
	  		    </el-form-item>
				<!-- 价格 -->
				<el-form-item :label="addItemTitle.price.label" :label-width="formLabelWidth" prop="price" v-if='addItemTitle.price'>
	  		        <el-input v-model.number="addItem.price"  auto-complete="off" @keydown.enter.native.prevent><template slot="append">元</template></el-input>
	  		    </el-form-item>
				<!-- 绑定发音课 -->
				<el-collapse-transition>
					<el-form-item label="选择课程" :label-width="formLabelWidth" v-if='searchSundCourseFlag'>
						<el-select v-model="addItem.sound_id" placeholder="请输入课程关键词" style="width:240px;" filterable clearable remote :remote-method="searchSundCourseFunc" :loading='searchSundCourseLoading'>
							<el-option
							  v-for="item in sundCourseOptions"
							  :key="item.id"
							  :label="'（' + item.id + '）' + item.name"
							  :value="item.id">
							</el-option>
						</el-select>
						<span style="margin:0 0 0 10px;">发音课课程id：{{ addItem.sound_id || '选择后自动显示' }}</span>
		  		    </el-form-item>
				</el-collapse-transition>
				<!-- 有效期限 -->
				<el-form-item :label="addItemTitle.days.label" :label-width="formLabelWidth" prop="days" v-if='SkuCardDaysFlag'>
	  		        <el-input v-model.number="addItem.days"  auto-complete="off" @keydown.enter.native.prevent><template slot="append">天</template></el-input>
	  		    </el-form-item>
				<!-- 截止日期 -->
				<el-form-item :label="addItemTitle.endTime.label" :label-width="formLabelWidth" prop="endTime" v-if='SkuCardDaysFlag' size="large">
					<el-date-picker
				        v-model="addItem.endTime"
				        type="date"
				        placeholder="选择激活截止日期"
				        :picker-options="endTimePickerOptions">
				    </el-date-picker>
	  		    </el-form-item>
				<!-- 状态 -->
				<el-form-item :label="addItemTitle.stat.label" :label-width="formLabelWidth" v-if='addItemTitle.stat'>
					<el-tooltip content="是否有效" placement="top">
				      <el-switch v-model="addItem.stat" on-color="#13ce66" off-color="#ff4949" on-value="1" off-value="0" on-text='是' off-text='否'>
				      </el-switch>
				    </el-tooltip>
	  		    </el-form-item>
				<!-- 售卖类型 -->
				<el-form-item :label="addItemTitle.fee.label" :label-width="formLabelWidth" prop="fee" v-if='addItemTitle.fee'>
					<el-select v-model="addItem.fee" placeholder="请选择">
				      <el-option
				        v-for="item in options"
				        :key="item.value"
				        :label="item.label"
				        :value="item.value">
				      </el-option>
				    </el-select>
	  		    </el-form-item>
				<!-- 显示 -->
				<el-form-item :label="addItemTitle.display.label" :label-width="formLabelWidth" v-if='addItemTitle.display'>
					<el-radio class="radio" v-model="addItem.display" label="1">是</el-radio>
    				<el-radio class="radio" v-model="addItem.display" label="0">否</el-radio>
	  		    </el-form-item>
				<!-- 标题 -->
	  		    <el-form-item :label="addItemTitle.title.label" :label-width="formLabelWidth" v-if='addItemTitle.title'>
	  		        <el-input v-model="addItem.title"  auto-complete="off"  @keydown.enter.native.prevent></el-input>
	  		    </el-form-item>
				<!-- 副标题 -->
	  		    <el-form-item :label="addItemTitle.subTitle.label" :label-width="formLabelWidth" v-if='addItemTitle.subTitle'>
	  		        <el-input v-model="addItem.subTitle"  auto-complete="off" @keydown.enter.native.prevent></el-input>
	  		    </el-form-item>
				<!-- 年龄 -->
	  		    <el-form-item :label="addItemTitle.age.label" :label-width="formLabelWidth" v-if='addItemTitle.age'>
	  		        <el-input v-model="addItem.age"  auto-complete="off" @keydown.enter.native.prevent><template slot="append">岁</template></el-input>
	  		    </el-form-item>
				<!-- Code -->
				<el-form-item :label="addItemTitle.Code.label" :label-width="formLabelWidth"  prop="code"  v-if='addItemTitle.Code'>
				    <el-input v-model="addItem.code"  auto-complete="off" @keydown.enter.native.prevent></el-input>
	  		    </el-form-item>
				<!-- 描述 -->
                <el-form-item :label="addItemTitle.description.label" :label-width="formLabelWidth" v-if='addItemTitle.description'>
				    <el-input type="textarea" v-model="addItem.description" @keydown.enter.native.prevent></el-input>
	  		    </el-form-item>
                <!-- 性别 -->
                <el-form-item :label="addItemTitle.gender.label" :label-width="formLabelWidth" v-if='addItemTitle.gender'>
					<el-radio class="radio" v-model="addItem.gender" label="1">男</el-radio>
					<el-radio class="radio" v-model="addItem.gender" label="2">女</el-radio>
    				<el-radio class="radio" v-model="addItem.gender" label="0">保密</el-radio>
	  		    </el-form-item>
				<!-- SKU关联课程与集合关联普通 -->
				<el-form-item :label="goodsListTransfer ? '选择课程' : '选择 Sku'" :label-width="formLabelWidth" v-if='goodsListTransfer || SkuListTransfer'>
					<el-select v-model="searchGoods" :placeholder="goodsListTransfer ? '请输入课程关键词或ID' : '请输入商品关键词或ID'" style="width:300px;" filterable clearable remote :remote-method="searchGoodsOrSkuFunc" :loading='selectGoodsLoading'>
						<el-option
						  v-for="item in GoodsOptions"
						  :key="item"
						  :label="'（' + item.id + '）' + item.name"
						  :value="item">
						</el-option>
					</el-select>
					<el-button type="primary" icon="plus" @click='addGoodsToCard'></el-button>
	  		    </el-form-item>
				<el-form-item label="展示配置" :label-width="formLabelWidth" v-if='goodsListTransfer || SkuListTransfer'>
					<div v-if='addGoods.length'>
						<section v-for='(item, index) in addGoods' :key='index' style="display:flex;justify-content:space-between;align-items:center;">
                            <span>
								{{ item.id }} : {{ item.name }}
							</span>
							<i class="el-icon-close" @click="deleteItemInGoods(index)"></i>
						</section>
					</div>
					<div v-else>
						当前列表为空
					</div>
	  		    </el-form-item>
				<!-- 选择老师 -->
                <el-form-item :label="addItemTitle.selectTeacher.label" :label-width="formLabelWidth" v-if='addItemTitle.selectTeacher' v-loading='teacherLoading'>
					<el-checkbox-group v-model="checkedTeachers"  style="width:80%;overflow:hidden" v-if='Teachers.length'>
						<el-checkbox v-for="(teacher, index) in Teachers" :label="teacher.id" :key="index" style="margin:0 15px 0 0">{{ teacher.name }}</el-checkbox>
					</el-checkbox-group>
					<el-button type="text" v-else @click="loadTeacherListForAdd">加载失败，请点击刷新</el-button>
	  		    </el-form-item>
				<!-- 选择channel -->
                <el-form-item :label="addItemTitle.channel.label" prop="checkedChannels" :label-width="formLabelWidth" v-if='addItemTitle.channel' v-loading='channelLoading'>
					<el-radio-group v-model="checkedChannels" v-if='Channels.length' >
				        <el-radio v-for="(channel, index) in Channels" :label="channel.id" :key="index"  style="margin:10px 15px 0 0">{{ channel.name }}</el-radio>
				    </el-radio-group>
					<el-button type="text" v-else @click="loadChannlListForAdd">加载失败，请点击刷新</el-button>
	  		    </el-form-item>
				<!-- 展示配置 -->
                <el-form-item label="已选配置" :label-width="formLabelWidth" v-if='ChannelCodeSkuConfInfo.length' >
					<el-row>
					  <el-col :span="8"><p class="channelCodeConfItem">Sku</p></el-col>
					  <el-col :span="8"><p class="channelCodeConfItem">course</p></el-col>
					  <el-col :span="8"><p class="channelCodeConfItem">planOrTime</p></el-col>
					</el-row>
					<section v-for='(item, itemIndex) in ChannelCodeSkuConfInfo' :key='itemIndex' class="ChannelCodeItem">
						<div class="skuPortion">
							<span>【{{ item.skuId }}】{{ item.skuName }} : </span>
						</div>
						<div class="CPPortion">
							<section v-for='(tempObj, tempObjIndex) in item.cpIds' :key='tempObjIndex'>
								<el-tooltip class="item" effect="light" :content="tempObj.courseName" placement="top">
									<span class="ChannelCodeShow">[{{ tempObj.courseId }}] : {{ tempObj.courseName }}</span>
							    </el-tooltip>
								<el-tooltip  v-if="tempObj.planName" class="item" effect="light" :content="tempObj.planName" placement="top">
									<span class="ChannelCodeShow">[{{ tempObj.planId }}] : {{ tempObj.planName }}</span>
							    </el-tooltip>
								<span class="ChannelCodeShow" v-else>{{ tempObj.startTime | formatStartEndTime }} - {{ tempObj.endTime | formatStartEndTime }}</span>
								<i class="el-icon-close" @click='deleteChannelCodeItem(item, tempObjIndex, itemIndex)'></i>
							</section>
						</div>
					</section>
	  		    </el-form-item>
				<!-- 配置ChannelCode -->
                <el-form-item :label="addItemTitle.ChannelCodeSkuConf.label" :label-width="formLabelWidth" v-if='addItemTitle.ChannelCodeSkuConf'>
					<!-- <i class="el-icon-arrow-left"></i> -->
					<section class="checkedCodeConf">
						<el-select v-model="selectSpu" placeholder="请输入Spu关键词或ID" style="margin:0 15px 10px 0" filterable clearable remote :remote-method="selectSpuRemoteMethod" @change='checkedSpuInCode' :loading='selectSpuLoading'>
						    <el-option
						      v-for="item in SpuOptions"
						      :key="item.id"
						      :label="'（' + item.id + '）' + item.name"
						      :value="item.id">
						    </el-option>
						</el-select>
						<el-select v-model="selectSku" placeholder="请选择Sku" style="margin:0 15px 10px 0" :loading='selectSkuLoading' @change='checkedSkuInCode'>
						    <el-option
						      v-for="item in SkuOptions"
						      :key="item.id"
						      :label="'（' + item.id + '）' + item.name"
						      :value="item">
						    </el-option>
						</el-select>
						<el-select v-model="selectCourse" placeholder="请选择Course" style="margin:0 15px 10px 0" :loading='selectCourseLoading' @change='checkedCourseInCode'>
						    <el-option
						      v-for="item in CourseInSkuOptions"
						      :key="item.id"
						      :label="'（' + item.id + '）' + item.name"
						      :value="item">
						    </el-option>
						</el-select>
						<el-select v-if="selectCourse.type == 1" v-model="selectPlan" placeholder="请输入Plan关键词或ID" style="margin:0 15px 10px 0" filterable clearable remote :remote-method="selectPlanRemoteMethod" :loading='selectPlanLoading'>
						    <el-option
						      v-for="item in PlanOptions"
						      :key="item.id"
						      :label="'（' + item.id + '）' + item.name"
						      :value="item">
						    </el-option>
						</el-select>
						<el-date-picker
						      v-model="channelValidityTime"
						      type="daterange"
						      placeholder="选择日期范围"
							  style="margin:0 15px 10px 0"
							  v-if="selectCourse.type == 2"
							  @change="selecCodeTime">
					    </el-date-picker>
						<el-button type="primary" icon='check' :plain="true" @click='affirmChannelCodeSkuConfInfo'></el-button>
					</section>
					<!-- <i class="el-icon-arrow-right"></i> -->
	  		    </el-form-item>
  		  </el-form>
  		  <div slot="footer" class="dialog-footer">
  		    <el-button @click="addFormVisible = false">取 消</el-button>
  		    <el-button type="primary" @click="addFormConfirm('addItem')" :plain="true">确 定</el-button>
  		  </div>
        </el-dialog>
	</section>
</template>
<script>
import {
	getSkuList,
	getCourseList,
	getTeacherList,
	getChannelList,
	getSpuList,
	getPlanList
} from '../api/api';
// util工具包
import util from '../common/js/util.js'

export default {
	props: ['placeHolder', 'addItemTitle', 'newSkuAbout'],
	data() {
		return {
			// ChannelCode相关
			ChannelCodeSkuConfInfo: [],
			// 选择框 -> Spu
			SpuOptions: [],
			selectSpu: '',
			selectSpuLoading: false,

			// 选择框 -> Sku
			SkuOptions: [],
			selectSku: '',
			selectSkuLoading: false,

			// 选择框 -> Course
			CourseInSkuOptions: [],
			selectCourse: '',
			selectCourseLoading: false,

			// 选择框 -> Plan
			PlanOptions: [],
			selectPlan: '',
			selectPlanLoading: false,

			// 选择框 -> 有效期限
			channelValidityTime: '',
			startTime: 0,
			endTime: 0,

			// 添加老师相关
			checkedTeachers: [],
			Teachers: [],

			// 添加渠道相关
			checkedChannels: 0,
			Channels: [],

			// 穿梭框 相关的数据
			addGoods: [], // 添加到右边绑定的数据

			searchGoods: '',
			selectGoodsLoading: false,
			GoodsOptions: [],

			// 绑定发音课
			sundCourseOptions: [],
			searchSundCourseFlag: false,
			searchSundCourseLoading: false,

			firstPlaceholder: this.placeHolder[0] ? this.placeHolder[0] : '请输入ID',
			secondPlaceholder: this.placeHolder[1] ? this.placeHolder[1] : '请输入标题',
			addFormVisible: false, //新增界面是否显示
			addItem: {},
			goodsListTransfer: false,
			SkuListTransfer: false,
			SkuCardDaysFlag: false,
			addGoods: [],
			formLabelWidth: '100px', //新增页面的宽度
			formLabelPriceWidth: '30px',
			addItemRules: {
				//新增页面的表单验证
				name: [{
						required: true,
						message: '请输入模块名称',
						trigger: 'blur'
					},
					{
						min: 1,
						max: 64,
						message: '长度在 1 到 64 个字符',
						trigger: 'blur'
					}
				],
				type: [{
					required: true,
					type: 'array',
					message: '请选择模块类型',
					trigger: 'change'
				}],
				viewType: [{
					required: true,
					type: 'array',
					message: '请选择查看类型',
					trigger: 'change'
				}],
				course_version: [{
					required: true,
					type: 'array',
					message: '请选择课程版本',
					trigger: 'change'
				}],
				merchandiseType: [{
					required: true,
					type: 'array',
					message: '请选择模块类型',
					trigger: 'change'
				}],
				customType: [{
					required: true,
					type: 'array',
					message: '请选择模块类型',
					trigger: 'change'
				}],
				SkuType: [{
					required: true,
					type: 'array',
					message: '请选择模块类型',
					trigger: 'change'
				}],
				lessonNumber: [{
						required: true,
						message: '数量不能为空'
					},
					{
						type: 'number',
						message: '数量必须为数字值'
					}
				],
				price: [{
					required: false,
					type: 'number',
					message: '价格必须为数字值',
					trigger: 'blur'
				}],
				code: [{
						required: true,
						message: '请输入Code码',
						trigger: 'blur'
					},
					{
						min: 10,
						max: 10,
						message: '长度为 10 个字符',
						trigger: 'blur'
					}
				],
				days: [{
					required: true,
					type: 'number',
					message: '请填写有效期限',
					trigger: 'blur'
				}],
				endTime: [{
					required: true,
					type: 'object',
					message: '请输入模块名称',
					trigger: 'blur'
				}]
			},
			filters: {
				id: '',
				name: '',
				courseId: '',
				courseName: '',
				merchandiseType: ['0'],
				courseType: [],
				feeType: [],
			},
			selectNameOrId: '0',
			endTimePickerOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 8.64e7;
				}
			},
			options: [ // 课程能选择的类型
				{
					value: '1',
					label: '免费'
				},
				{
					value: '2',
					label: '收费'
				},
				{
					value: '3',
					label: '限时免费'
				}
			],
			courseOptions: [ // 课程能选择的类型
				{
					value: '1',
					label: '体系课',
					children: [{
							value: '1',
							label: '精品课',
						},
						{
							value: '2',
							label: '发音课',
						},
						{
							value: '3',
							label: '体验课',
						},
						{
							value: '4',
							label: '自然拼读课',
						},
						{
							value: '5',
							label: '线上练习册',
						}
					]
				},
				{
					value: '2',
					label: '单项课',
					children: [{
							value: '1',
							label: '词汇课',
						}, {
							value: '2',
							label: '儿歌课',
						}, {
							value: '3',
							label: '绘本课',
						}, {
							value: '4',
							label: '拼读课',
						}, {
							value: '5',
							label: '故事课',
						}, {
							value: '6',
							label: '家庭游戏课',
						}, {
							value: '7',
							label: '科普主题课',
						}, {
							value: '8',
							label: '推广课',
						}, {
							value: '9',
							label: '教学卡',
						},
						{
							value: '10',
							label: '音乐课',
						}
					]
				}
			],
			// merchandiseOption: this.addItemTitle.merchandiseType.merchandiseOption,
			items: {},
			searchGoodsOrSku: '', // 搜索 Sku下 普通下的 课程列表 和 集合下的 sku列表
			teacherLoading: true,
			channelLoading: true
		}
	},
	methods: {
		// 新增页面
		handleAdd() {
			this.addItem = {
					name: '',
					type: [],
					image_url: '',
					internalName: '',
					lessonNumber: 0,
					merchandiseType: [],
					customType: [],
					SkuType: [],
					price: 0,
					sound_id: '',
					days: '',
					endTime: '',
					stat: '1',
					fee: '',
					display: '1',
					title: '',
					subTitle: '',
					age: '',
					code: '',
					description: '',
					gender: '1',
					viewType: ['0'],
					course_levels: [],
					choose_schedule_type: 0,
					course_version: ['0']
				},
				this.addFormVisible = true;
			if (this.addItemTitle.selectTeacher) {
				this.loadTeacherListForAdd();
			};
			if (this.addItemTitle.channel) {
				this.loadChannlListForAdd();
			};
			if (this.addItemTitle.merchandiseType) {
				this.addItem.merchandiseType[0] = this.addItemTitle.merchandiseType.merchandiseDefaultValue;
			}
		},

		// 调用 加载列表的接口
		loadTeacherListForAdd() {
			this.teacherLoading = true;
			getTeacherList('').then((res) => {
				if (res.data.success) {
					if (res.data.data.items) {
						this.Teachers = res.data.data.items;
					};
				} else {
					this.$notify.error(res.data.msg);
				};
				this.teacherLoading = false;
			});
		},
		loadChannlListForAdd() {
			this.channelLoading = true;
			getChannelList('').then((res) => {
				if (res.data.success) {
					if (res.data.data.items) {
						this.Channels = res.data.data.items;
					}
				} else {
					this.$notify.error(res.data.msg);
				}
				this.channelLoading = false;
			})
		},
		handleSeek() {
			this.$emit('emitHandleSeek', this.filters);
		},
		handleIconClickCourseId() {
			this.filters.courseId = '';
			this.handleSeek();
		},
		handleIconClickCourseName(obj) {
			this.filters.courseName = '';
			this.handleSeek();
		},
		handleIconClickId(obj) {
			this.filters.id = '';
			this.handleSeek();
		},
		handleIconClickName(obj) {
			this.filters.name = '';
			this.handleSeek();
		},
		changeCourseType(value) {
			if (value[0] == '1' && value[1] == '1') {
				this.searchSundCourseFlag = true;
			} else {
				this.searchSundCourseFlag = false;
			}
		},
		searchSundCourseFunc(query) {
			if (query !== '') {
				let temp = Number(query);
				let parameter = {};
				if (temp) {
					parameter = {
						id: temp,
						type: 1,
						sub_type: 2,
					};
				} else {
					parameter = {
						name: query,
						type: 1,
						sub_type: 2,
					};
				};
				this.searchSundCourseLoading = true;
				// 调用 加载列表的接口
				getCourseList(parameter).then((res) => {
					if (res.data.success) {
						this.sundCourseOptions = res.data.data.items.map((item) => {
							let tempObj = {
								id: item.entity.id,
								name: item.entity.name,
							}
							return tempObj
						});
					} else {
						this.$notify.error(res.data.msg);
					}
					this.searchSundCourseLoading = false;
				});
			} else {
				this.sundCourseOptions = [];
			}
		},
		addFormConfirm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					if (this.goodsListTransfer || this.SkuListTransfer) {
						this.addItem['goodsList'] = this.addGoods;
					};
					if (this.addItemTitle.selectTeacher) {
						this.addItem['teacherids'] = '';
						this.checkedTeachers.forEach((item) => {
							this.addItem['teacherids'] += item + ',';
						})
					};
					if (this.addItemTitle.channel) {
						this.addItem['channel_id'] = this.checkedChannels;
					};
					if (this.addItemTitle.ChannelCodeSkuConf) {
						this.addItem['channelCodeSkuConf'] = this.ChannelCodeSkuConfInfo
					};
					if (this.SkuCardDaysFlag) {
						try {
							this.addItem.endTime = util.formatDate.format(this.addItem.endTime, 'yyyy-MM-dd');
						} catch (e) {
							console.log(e);
						} finally {

						};
					}
					this.$emit('emitHandleAdd', this.addItem);
					this.addFormVisible = false;
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		handleChangeSkuType(value) {
			if (this.addItemTitle.days && value[0] == '0') {
				this.SkuCardDaysFlag = true;
			} else {
				this.SkuCardDaysFlag = false;
			}
			let initGoodsList = () => {
				this.goodsListTransfer = true
			}
			this.SkuListTransfer = false;
			if (this.addItemTitle.bindingCourse) {
				this.goodsListTransfer = false;
				value[0] == 0 ? initGoodsList() : this.SkuListTransfer = true;
				return;
			}
			value[0] == 0 ? '' : this.SkuListTransfer = true;
		},
		searchGoodsOrSkuFunc(query) {
			if (query !== '') {
				this.selectCourseLoading = true;
				if (this.goodsListTransfer) {
					let temp = Number(query);
					let parameter = {};
					if (temp) {
						parameter = {
							id: temp,
						};
					} else {
						parameter = {
							name: query,
						};
					};
					// 调用 加载列表的接口
					getCourseList(parameter).then((res) => {
						if (res.data.success) {
							if (res.data.data.items) {
								this.GoodsOptions = res.data.data.items.map((item) => {
									let tempObj = {
										id: item.entity.id,
										name: item.entity.name
									};
									return tempObj;
								});
							} else {
								this.$notify.error(res.data.msg);
							};
							this.selectCourseLoading = true;
						} else {
							this.GoodsOptions = [];
						};
					});
					return
				}
				if (this.SkuListTransfer) {
					let temp = Number(query);
					let parameter = {};
					if (temp) {
						parameter = {
							spu_id: this.addItemTitle.bindingSuite.spu_id,
							type: 0,
							id: temp,
						};
					} else {
						parameter = {
							spu_id: this.addItemTitle.bindingSuite.spu_id,
							name: query,
							type: 0,
						};
					};
					getSkuList(parameter).then((res) => {
						if (res.data.success) {
							if (res.data.data.items) {
								this.GoodsOptions = res.data.data.items.map((item) => {
									let tempObj = {
										id: item.entity.id,
										name: item.entity.name
									};
									return tempObj;
								});
							} else {
								this.$notify.error(res.data.msg);
							};
							this.selectCourseLoading = true;
						} else {
							this.GoodsOptions = [];
						};
					});
					return
				}
			};
		},
		addGoodsToCard() {
			if (this.searchGoods !== '') {
				if (this.addGoods.length) {
					for (var i = 0; i < this.addGoods.length; i++) {
						if (this.addGoods[i].id == this.searchGoods.id) {
							this.$message.error('抱歉，此选项已存在。请重新选择');
							return;
						}
					}
				}
				this.addGoods.push(this.searchGoods);
				this.searchGoods = '';
				this.GoodsOptions = [];
			} else {
				this.$message.error('抱歉，选项为空无法添加');
			}
		},
		deleteItemInGoods(index) {
			this.$delete(this.addGoods, index);
		},
		loadData() {
			// 如果价格存在。判断 是否 为必填项。是则 添加 rule
			if (this.addItemTitle.price) {
				if (this.addItemTitle.price.rule) {
					this.addItemRules['price'] = [{
						required: true,
						type: 'number',
						message: '请填写价格',
						trigger: 'blur'
					}];
				}
			};
		},
		// 搜索 Spu 列表
		selectSpuRemoteMethod(query) {
			if (query !== '') {
				this.selectSpuLoading = true;
				let temp = Number(query);
				let parameter = {};
				if (temp) {
					parameter = {
						id: temp,
						type: 0
					};
				} else {
					parameter = {
						name: query,
						type: 0
					};
				};
				// 调用 加载列表的接口
				getSpuList(parameter).then((res) => {
					if (res.data.success) {
						this.SpuOptions = res.data.data.items.map((item) => {
							let tempObj = {
								id: item.entity.id,
								name: item.entity.name,
							}
							return tempObj
						});
					} else {
						this.$notify.error(res.data.msg);
					}
					this.selectSpuLoading = false;
				});
			} else {
				this.SpuOptions = [];
			}
		},
		// 选择Spu 之后 加载Sku列表
		checkedSpuInCode(value) {
			if (value !== '') {
				this.selectSkuLoading = true;
				let parameter = {
					spu_id: value,
					type: 0
				};
				// 调用 加载列表的接口
				getSkuList(parameter).then((res) => {
					if (res.data.success) {
						this.SkuOptions = res.data.data.items.map((item) => {
							let tempObj = {
								id: item.entity.id,
								name: item.entity.name,
								courseEntities: item.courseEntities
							}
							return tempObj
						});
					} else {
						this.$notify.error(res.data.msg);
					}
					this.selectSkuLoading = false;
				});
			} else {
				this.selsctSpu = '';
				this.SpuOptions = [];
				this.selectSku = '';
				this.SkuOptions = [];
				this.selectCourse = '';
				this.CourseInSkuOptions = [];
				this.selectPlan = '';
				this.PlanOptions = [];
			}
		},
		// 选择Sku之后加载Course列表
		checkedSkuInCode(value) {
			this.CourseInSkuOptions = [];
			if (value !== '') {
				this.CourseInSkuOptions
				value.courseEntities.forEach((item, index) => {
					if (item) {
						this.$set(this.CourseInSkuOptions, index, item)
					}
				});
			} else {
				this.selectCourse = '';
				this.CourseInSkuOptions = [];
			}
		},
		// 选择课程之后 自动将当前课程对应的计划加载
		checkedCourseInCode(value) {
			this.selectPlan = []
			if (value && value !== '') {
				let params = {
					course_id: value.id
				}
				getPlanList(params).then((res) => {
					if (res.data.success) {
						this.PlanOptions = res.data.data.items.map((item) => {
							let tempObj = {
								id: item.entity.id,
								name: item.entity.name,
							}
							return tempObj
						});
					} else {
						this.$notify.error(res.data.msg);
					}
					this.selectPlanLoading = false;
				});
			}
		},
		// 按照 name或ID 查询 Plan
		selectPlanRemoteMethod(query) {
			if (query !== '') {
				this.selectPlanLoading = true;
				let temp = Number(query);
				let parameter = {};
				if (temp) {
					parameter = {
						id: temp,
					};
				} else {
					parameter = {
						plan_name: query,
					};
				};
				getPlanList(parameter).then((res) => {
					if (res.data.success) {
						this.PlanOptions = [];
						this.PlanOptions = res.data.data.items.map((item) => {
							let tempObj = {
								id: item.entity.id,
								name: item.entity.name,
							}
							return tempObj
						});
					} else {
						this.$notify.error(res.data.msg);
					}
					this.selectPlanLoading = false;
				});
			} else {
				this.PlanOptions = [];
			}
		},
		selecCodeTime(value) {
			this.startTime = util.formatDate.parse(value.substring(0, 10), 'yyyy-MM-dd').getTime();
			this.endTime = util.formatDate.parse(value.substring(13, 23), 'yyyy-MM-dd').getTime();
		},
		// 点击对号之后添加channelCode item 的方法
		affirmChannelCodeSkuConfInfo() {
			/*
				判断如果 sku_id 存在于 之前添加的conf里。则不单独创建 sku 组合。不存在得单独存在（for 第一次）
				如果存在 则进入 skuEntity 下的 CPEntity 寻找是否存在 同 id 的course。不存在则新建。存在则 判断 plan 是否一样。不一样则新建。一样则抛出异常。
			*/
			if (!(this.selectSku && this.selectCourse && (this.selectPlan || this.channelValidityTime))) {
				this.$message.error('无法添加空选项');
				return;
			}
			let conf = this.ChannelCodeSkuConfInfo;
			for (let i = 0; i < conf.length; i++) {
				let item = conf[i].cpIds;
				for (let j = 0; j < item.length; j++) {
					if (this.selectCourse.id == item[j].courseId) {
						this.$message.error('该课程已经存在');
						return
					};
					if (this.selectPlan.id !== null && this.selectPlan.id !== undefined && this.selectPlan.id !== '') {
						if (this.selectPlan.id == item[j].planId) {
							this.$message.error('该计划已经存在');
							return
						}
					}
				};
				if (this.selectSku.id == conf[i].skuId) {
					let tempObj = {
						courseId: this.selectCourse.id,
						courseName: this.selectCourse.name,
						planId: this.selectPlan.id,
						planName: this.selectPlan.name,
						startTime: this.startTime,
						endTime: this.endTime,
					};
					item.push(tempObj);
					this.selectCourse = '';
					this.selectPlan = '';
					this.PlanOptions = [];
					return;
				};
			};
			let entity = {
				skuId: this.selectSku.id,
				skuName: this.selectSku.name,
				cpIds: [{
					courseId: this.selectCourse.id,
					courseName: this.selectCourse.name,
					planId: this.selectPlan.id,
					planName: this.selectPlan.name,
					startTime: this.startTime,
					endTime: this.endTime,
				}]
			}
			this.ChannelCodeSkuConfInfo.push(entity);
			this.selectCourse = '';
			this.selectPlan = '';
			this.PlanOptions = [];
			this.channelValidityTime = '';
			this.startTime = '';
			this.endTime = '';
		},
		// 点击 channelCode item后面的删除 按钮的方法
		deleteChannelCodeItem(item, codeIndex, confIndex) {
			this.$delete(item.cpIds, codeIndex);
			if (!item.cpIds.length) {
				this.$delete(this.ChannelCodeSkuConfInfo, confIndex);
			};
		},
	},
	filters: {
		formatStartEndTime(row) {
			let time = new Date(row)
			return util.formatDate.format(time, 'yyyy-MM-dd')
		}
	},
	watch: {
		addItemTitle: {
			handler(newVal, oldVal) {
				if (newVal.merchandiseType) {
					this.merchandiseOption = newVal.merchandiseType.merchandiseOption;
					this.filters.merchandiseType[0] = newVal.merchandiseType.merchandiseDefaultValue;
				}
			},
			deep: true
		},
		addFormVisible: {
			handler(newVal, oldVal) {
				if (!newVal) {
					this.goodsListTransfer = false;
					this.SkuListTransfer = false;
					this.searchGoods = []; // 绑定课程 的列表
					this.addGoods = []; // 添加到右边绑定的数据
					this.searchGoodsOrSku = ''; // 搜索商品 绑定数据清空
					this.checkedTeachers = []; // 选择老师 绑定数据清空
					this.checkedChannels = []; // 选择channel 绑定数据清空
					// 选择channelCodeConf部分数据清空
					this.selectSpu = '';
					this.SpuOptions = [];
					this.selectSku = '';
					this.SkuOptions = [];
					this.selectCourse = '';
					this.CourseInSkuOptions = [];
					this.selectPlan = '';
					this.PlanOptions = [];
					this.ChannelCodeSkuConfInfo = [];
					this.channelValidityTime = '';
					this.startTime = '';
					this.endTime = '';
					// 绑定发音课相关数据清空
					this.searchSundCourseFlag = false;
					this.sundCourseOptions = [];
				}
			},
			deep: true
		}
	},
	mounted() {
		this.loadData();
	}
}
</script>

<style lang="less">
.ChannelCodeItem {
    // display: flex;
    // justify-content: space-around;
    border-bottom: 1px solid #666;
    .ChannelCodeShow {
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        // text-align: center;
    }
    .skuPortion {
        // span{
        // 	width: 150px;
        // }
    }
    .CPPortion {
        padding: 0 0 0 20px;

        section {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            span {
                width: 250px;
            }
        }
    }
    .ChannelCodeArrows {
        // display: inline-block;
        // width: 20px;
        // vertical-align: middle;
    }
}
.channelCodeConfItem {
    text-align: center;
    border: 1px solid #d1dbe5;
    border-radius: 4px;
    box-shadow: 0 0 3px #666;
    margin: 0 5px;
    background: #e5e9f2;
}
</style>
