<template lang="html">
	<section>
      <!-- 按钮  过滤  工具条-->
		<el-col  class='toolbar' style='padding-bottom: 0px;'>
    		<el-form :inline = "true" v-model='filter'>
    		    <el-form-item>
                  	<el-input  placeholder='请输入集训营 ID' icon="circle-cross" :on-icon-click="handleIconClick_clearCampId" v-model="filter.campID"></el-input>
              	</el-form-item>
             	<el-form-item>
                  	<el-input  placeholder='请输入集训营名称' icon="circle-cross" v-model="filter.campName" :on-icon-click="handleIconClick_clearCampName"></el-input>
              	</el-form-item>
    			<el-form-item>
    				<el-select  placeholder="链接是否有效" v-model="filter.isValue" clearable>
    			        <el-option v-for="item in urlIsValue" :key="item.value" :label="item.label" :value="item.value">
    			   	    </el-option>
    			    </el-select>
               </el-form-item>
              	<el-form-item>
                    <el-button type='primary' @click="queryCamp">查询</el-button>
                </el-form-item>
              	<el-form-item>
                    <el-button type='primary' @click="handleAddCamp">新增</el-button>
                </el-form-item>
            </el-form>
	    </el-col>

        <!-- 表格 -->
		<el-table :data="campList" border style="width: 100%" :default-sort = "{prop: 'date'}" v-loading="campListLoading">
			<el-table-column prop="entity.id" label="ID" sortable width="100" align="center"></el-table-column>
				<el-table-column prop="entity.name" label="集训营名称" align="center"></el-table-column>
				<el-table-column prop="entity.courseName" label="关联课程名称" align="center"></el-table-column>
				<el-table-column prop="entity.courseId" label="关联课程Id" align="center" width="110"></el-table-column>
				<el-table-column prop="entity.start_time" label="开始时间" sortable align="center"></el-table-column>
				<el-table-column prop="entity.end_time" label="结束时间" sortable align="center"></el-table-column>
				<el-table-column prop="entity.isValue" label="是否有效" align="center" width="100"></el-table-column>
				<el-table-column label="操作" fixed="right" width='250'>
		     		<template scope="scope">
	                    <el-button-group>
							<el-button type="success" size="small" @click="handleEdit(scope.row, scope.$index)">编辑</el-button>
                            <el-button type="primary" size="small" @click="iconConf(scope.row, scope.$index)">关卡图标配置</el-button>
							<el-button type="info" size="small" @click="link_created(scope.row)">生成链接</el-button>
                        </el-button-group>
					</template>
		    </el-table-column>
  		</el-table>

		<!-- 分页 -->
	    <el-col class='toolbar'>
	    	<el-pagination style='float: right' @current-change="handleCurrentChange" :current-page.sync="campListPage" :page-size="20" layout="total, prev, pager, next" :total="campTotalNum">
      		</el-pagination>
	    </el-col>

		<!-- 新增页面 -->
		<el-dialog title='新增' :visible.sync="addFormVisible" :close-on-click-modal='false'>
	        <el-form :model='trainCamp' label-width='100px' :rules="campRule" ref="trainCamp">
			    <el-form-item label='集训营名称' prop="campName">
					<el-input v-model='trainCamp.campName' auto-complete='off'></el-input>
			    </el-form-item>
                <el-form-item label='集训营年龄段' prop="stage">
					<el-radio class="radio" v-model="trainCamp.stage" :label='1'>樱桃</el-radio>
                    <el-radio class="radio" v-model="trainCamp.stage" :label='2'>草莓</el-radio>
					<el-radio class="radio" v-model="trainCamp.stage" :label='3'>苹果</el-radio>
                    <el-radio class="radio" v-model="trainCamp.stage" :label='0'>不区分</el-radio>
	            </el-form-item>
	        	<el-form-item label='选择课程' prop="courseName">
					<el-input v-model='trainCamp.courseName' auto-complete='off' @focus="chooseCourse"></el-input>
	            </el-form-item>
	            <el-form-item label='开始时间' prop="startDate">
					<el-date-picker v-model="trainCamp.startDate" type="datetime" placeholder="选择链接生效时间"></el-date-picker>
	            </el-form-item>
				<el-form-item label='结束时间' prop="endDate">
					<el-date-picker v-model="trainCamp.endDate" type="datetime" placeholder="选择链接截止时间"></el-date-picker>
	            </el-form-item>
                <el-form-item label='正式课开始天数' prop="startDay">
                    <el-input v-model='trainCamp.startDay' auto-complete='off'></el-input>
                </el-form-item>
				<el-form-item label='预热课区间' prop="preLessonStart">
	                <el-input v-model='trainCamp.preLessonStart' auto-complete='off' style="width:50px!important;"></el-input>
					<span>---</span>
					<el-input v-model='trainCamp.preLessonEnd' auto-complete='off' style="width:50px!important;"></el-input>
	            </el-form-item>
				<el-form-item label='集训营是否有效' prop="isValue">
					<el-radio class="radio" v-model="trainCamp.isValue" label='1'>有效</el-radio>
					<el-radio class="radio" v-model="trainCamp.isValue" label='0'>无效</el-radio>
	            </el-form-item>
	            <el-form-item label='是否需要登陆' prop="needLogin">
					<el-radio class="radio" v-model="trainCamp.needLogin" label="1" value="1">需要登陆</el-radio>
					<el-radio class="radio" v-model="trainCamp.needLogin" label="2" value="2">不需要登陆</el-radio>
	            </el-form-item>
				<el-form-item label='登陆课区间'>
					<el-input v-model='trainCamp.loginLessonStart' auto-complete='off' style="width:50px!important;" :disabled='true?trainCamp.needLogin==2:false'></el-input>
					<span>---</span>
					<el-input v-model='trainCamp.loginLessonEnd' auto-complete='off' style="width:50px!important;"  :disabled='true?trainCamp.needLogin==2:false'></el-input>
	            </el-form-item>
	        </el-form>
	        <div slot="footer" class="dialog-footer">
	            <el-button @click.native="addFormVisible = false">取消</el-button>
	            <el-button type="primary" @click.native="addTrainCamp">提交</el-button>
	        </div>
	    </el-dialog>

		<!-- 编辑页面 -->
		<el-dialog title='编辑' :visible.sync="dialogEditFormVisible" :close-on-click-modal='false'>
	        <el-form :model='editCamp' label-width='100px' :rules="campRule" ref="editCamp">
				<el-form-item label='集训营名称' prop="campName">
					<el-input v-model='editCamp.campName' auto-complete='off'></el-input>
				</el-form-item>
                <el-form-item label='集训营年龄段' prop="stage">
					<el-radio class="radio" v-model="editCamp.stage" :label='1'>樱桃</el-radio>
                    <el-radio class="radio" v-model="editCamp.stage" :label='2'>草莓</el-radio>
					<el-radio class="radio" v-model="editCamp.stage" :label='3'>苹果</el-radio>
                    <el-radio class="radio" v-model="editCamp.stage" :label='0'>不区分</el-radio>
	            </el-form-item>
				<el-form-item label='选择课程' prop="course">
					<el-input v-model='editCamp.courseName' auto-complete='off' @focus="chooseCourse"></el-input>
                </el-form-item>
				<el-form-item label='开始时间' prop="startDate">
					<el-date-picker v-model="editCamp.startDate" type="datetime" placeholder="选择链接截止时间"></el-date-picker>
                </el-form-item>
				<el-form-item label='结束时间' prop="endDate">
					<el-date-picker v-model="editCamp.endDate" type="datetime" placeholder="选择链接截止时间"></el-date-picker>
                </el-form-item>
                <el-form-item label='正式课开始天数' prop="startDay">
                    <el-input v-model='editCamp.startDay' auto-complete='off'></el-input>
                </el-form-item>
				<el-form-item label='预热课区间' prop="preLessonStart">
	                <el-input v-model='editCamp.preLessonStart' auto-complete='off' style="width:50px!important;"></el-input>
					<span>---</span>
					<el-input v-model='editCamp.preLessonEnd' auto-complete='off' style="width:50px!important;"></el-input>
                </el-form-item>
				<el-form-item label='是否有效' prop="isValue">
					<el-radio class="radio" v-model="editCamp.isValue" label='1'>有效</el-radio>
					<el-radio class="radio" v-model="editCamp.isValue" label='0'>无效</el-radio>
				</el-form-item>
                <el-form-item label='是否登陆' prop="needLogin">
					<el-radio class="radio" v-model="editCamp.needLogin" label="1" value="1">需要登陆</el-radio>
					<el-radio class="radio" v-model="editCamp.needLogin" label="2" value="2">不需要登陆</el-radio>
                </el-form-item>
				<el-form-item label='登陆课区间'>
					<el-input v-model='editCamp.loginLessonStart' auto-complete='off' style="width:50px!important;" :disabled='true?editCamp.needLogin==2:false'></el-input>
					<span>---</span>
					<el-input v-model='editCamp.loginLessonEnd' auto-complete='off' style="width:50px!important;"  :disabled='true?editCamp.needLogin==2:false'></el-input>
                </el-form-item>
	    	</el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="dialogEditFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="updateCamp">保存修改</el-button>
            </div>
	    </el-dialog>

			<!-- 选择课程页面 -->
		<el-dialog title='选择课程' v-model='chooseCoursePage' :close-on-click-modal='false'>
			<el-table :data="courseData.list" border style="width: 100%" v-loading="courseListLoading">
				<el-table-column prop="entity.id" label="课程ID" align="center">
				</el-table-column>
				<el-table-column prop="entity.name" label="课程名称" align="center">
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template scope="scope">
	                    <el-button-group>
							<el-button type="success" size="small" @click="addCourse(scope.$index)" v-if="addFormVisible">添加课程</el-button>
							<el-button type="success" size="small" @click="editCourse(scope.$index)" v-if="dialogEditFormVisible">修改课程</el-button>
					    </el-button-group>
					</template>
				</el-table-column>
			</el-table>
			<el-col class='toolbar'>
			 	<el-pagination style='float: right' @current-change="handleCurrentCourseChange" :current-page.sync="courseData.page" :page-size="courseData.limit" :page-count="courseData.totalPage" layout="total, prev, pager, next" :total="courseData.campTotalNum">
				</el-pagination>
	        </el-col>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="chooseCoursePage = false">关闭</el-button>
            </div>
        </el-dialog>

		<!-- iconConf配置弹窗 -->
		<el-dialog title='选择课程' v-model='iconConfForm' :close-on-click-modal='false'>
			<el-form label-width='80px' :model="iconConfData">
				<el-form-item :label='value' v-for="(key, value) in iconConfData" :key='value'>
					<!-- <el-input v-model='iconConfData[value]'></el-input> -->
                    <el-button type="primary" icon="search" class="preview-icon-btn" @click='previewIcon(value)'></el-button>
                    <UploadMethods :oProp="0" :oVal="value" :oTags="'图标'" :oClearForm="iconConfForm" v-on:child-say='assignVal($event, value)' class='upload-icon'></UploadMethods>
                    <i class="el-icon-circle-check" style="color:#13CE66;" v-if='iconConfData[value]'></i>
                </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="iconConfForm = false">取 消</el-button>
				<el-button type="primary" @click="iconConfSubmit">确 定</el-button>
			</div>
        </el-dialog>

		<!-- 生成链接页面 -->
		<el-dialog title='生成链接' :visible.sync="linkCreateFormVisible" :close-on-click-modal='false'  size="large">
			<el-table :data="linkDataList" border style="width: 100%" :default-sort="{prop:'entity.id'}" v-loading="lessonListLoading" :key='linkDataList.index'>
				<el-table-column prop="lessonId" label="课节ID"  align="center" width='80' fixed="left">
				</el-table-column>
				<el-table-column prop="lessonName" label="课节名称" align="center">
				</el-table-column>
				<el-table-column label="课程链接" align="center" style="position:relative;" width='170'>
					<template scope="scope">
						<el-icon name="document"  style="position:absolute;right:5px;bottom:5px;" v-if="scope.row.linkCourseUrl" v-clipboard:copy="linkDataList[scope.$index].linkCourseUrl"></el-icon>
						<span style="margin-left: 10px;">{{ scope.row.linkCourseUrl }}</span>
					</template>
				</el-table-column>
				<el-table-column label="地图目录链接" align="center" style="position:relative;" width='170'>
					<template scope="scope">
						<el-icon name="document"  style="position:absolute;right:5px;bottom:5px;" v-if="scope.row.linkCourseMapUrl" v-clipboard:copy="linkDataList[scope.$index].linkCourseMapUrl"></el-icon>
						<span style="margin-left: 10px;">{{ scope.row.linkCourseMapUrl }}</span>
					</template>
				</el-table-column>
                <el-table-column prop="entity.linkLessonUrl" label="新版课程链接" align="center" width='170'>
					<template scope="scope">
						<el-icon name="document"  style="position:absolute;right:5px;bottom:5px;" v-if="scope.row.linkCourseNewMapUrl" v-clipboard:copy="linkDataList[scope.$index].linkCourseNewMapUrl"></el-icon>
						<span style="margin-left: 10px;">{{ scope.row.linkCourseNewMapUrl }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="entity.linkLessonUrl" label="课节链接" align="center" width='170'>
					<template scope="scope">
						<el-icon name="document"  style="position:absolute;right:5px;bottom:5px;" v-if="scope.row.linkLessonUrl" v-clipboard:copy="linkDataList[scope.$index].linkLessonUrl"></el-icon>
						<span style="margin-left: 10px;">{{ scope.row.linkLessonUrl }}</span>
					</template>
				</el-table-column>
                <el-table-column prop="entity.linkLessonUrl" label="新版课节链接" align="center" width='170'>
					<template scope="scope">
						<el-icon name="document"  style="position:absolute;right:5px;bottom:5px;" v-if="scope.row.linkBriefLessonUrl" v-clipboard:copy="linkDataList[scope.$index].linkBriefLessonUrl"></el-icon>
						<span style="margin-left: 10px;">{{ scope.row.linkBriefLessonUrl }}</span>
					</template>
				</el-table-column>
				<el-table-column  label="链接失效时间" align="center" width="260">
					<template scope="scope">
						<el-date-picker v-model="scope.row.defaultExpireTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="280" fixed="right" align="center">
					<template scope="scope">
		                <el-button-group>
							<!-- clipboard剪切板操作 -->
							<el-button type="success" size="small" @click="linkCourseCreated(0, scope.$index, scope.row, 0)">课程链接</el-button>
                        	<el-button type="info" size="small" @click="linkCourseCreated(0, scope.$index, scope.row, 1)">地图链接</el-button>
                            <el-button type="danger" size="small" @click="linkCourseCreated(0, scope.$index, scope.row, 2)">新版课程链接</el-button>
                            <el-button type="primary" size="small" @click="linkCourseCreated(1, scope.$index, scope.row, 0)">课节链接</el-button>
							<el-button type="info" size="small" @click="linkCourseCreated(2, scope.$index, scope.row, 0)">新版课节链接</el-button>
                            <el-button type="warning" size="small" @click="editWiki(scope.$index, scope.row)">编辑文案</el-button>
		                </el-button-group>
					</template>
                </el-table-column>
			</el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="linkCreateFormVisible = false">关闭</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="iconPreviewIsShow" :close-on-click-modal='false'>
            <img :src="iconSrc" alt="">
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="iconPreviewIsShow = false">关闭</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
//接口引用
import {
	getCourseList,
	addTrainCamp,
	getLessonListByCourse,
	getTrainCampList,
	updateTrainCamp,
	generateLink,
	updateTrainCampIconConf,
	transformShortUrl
} from '../../api/api'
import Vue from 'vue'
import util from '../../common/js/util'
import UploadMethods from '../../components/word-sentence-library/uploadMethods.vue'

export default {
	data() {
		return {
			//集训营列表分页数据初始化
			campTotalNum: 0,
			campListPage: 1,
			/*
				弹窗显示状态
			*/
			//新增弹窗显示状态初始化
			addFormVisible: false,
			//编辑弹窗显示状态初始化
			dialogEditFormVisible: false,
			//生成链接弹窗显示状态初始化
			linkCreateFormVisible: false,
			//选择课程弹窗显示状态初始化
			chooseCoursePage: false,
			//加载状态初始化
			courseListLoading: false,
			lessonListLoading: false,
			campListLoading: false,
			/*
				数据初始化
			*/
			//可供挑选的课程数据初始化
			courseData: {},
			// 筛选条件数据
			filter: {
				campID: '',
				campName: '',
				isValue: ''
			},
			//  集训营列表数据初始化
			campList: [],
			// 新增集训营数据初始化
			trainCamp: {
				campName: '',
				startDate: new Date(),
				endDate: '',
				courseName: '',
				courseId: '',
				needLogin: '2',
				preLessonStart: '',
				preLessonEnd: '',
				loginLessonStart: '',
				loginLessonEnd: '',
				isValue: '1',
				stage: 0,
				startDay: 0
			},
			//编辑页面数据初始化
			editCamp: {},
			// 相关数据校验
			campRule: {
				campName: [{
					required: true,
					message: '请输入集训营名称',
					trigger: 'blur'
				}, ],
				startDate: [{
					type: 'date',
					required: true,
					message: '请选择日期',
					trigger: 'change'
				}, ],
				endDate: [{
					type: 'date',
					required: true,
					message: '请选择日期',
					trigger: 'change'
				}, ],
				courseName: [{
					required: true,
					message: '请选择课程',
					trigger: 'change'
				}, ],
			},
			//链接有无效配置
			urlIsValue: [{
					label: '有效',
					value: '1'
				},
				{
					label: '无效',
					value: '0'
				},
			],
			//链接列表数据初始化
			linkDataList: [],
			//集训营关联链接列表数据初始化
			linkCampId: '',
			course_id: '',
			linkCampStart: '',
			//地图关卡图标配置弹窗配置
			iconConfForm: false,
			iconConfData: {},
			iconConfId: '',
			iconSrc: '',
			iconPreviewIsShow: false
		}
	},
	components: {
		UploadMethods
	},
	methods: {

		/*
			点击搜索输入框图标删除操作
		*/

		handleIconClick_clearCampId() {
			this.filter.campID = '';
		},
		handleIconClick_clearCampName() {
			this.filter.campName = '';
		},
		/*
				查询操作
		*/
		queryCamp() {
			this.initTrainCampList()
		},
		/*
			初始化集训营列表
		*/
		initTrainCampList(page) {
			this.campListLoading = true;
			let para = {
				id: this.filter.campID,
				name: this.filter.campName,
				page_index: page,
				status: this.filter.isValue
			};
			getTrainCampList(para).then(res => {
					if (res.data.success) {
						let campListData = res.data.data.items
						this.campTotalNum = res.data.data.totalCount
						if (campListData && campListData.length) {
							campListData.map((item, index) => {
								item.entity.start_time = util.formatDate.format(new Date(item.entity.startTime), 'yyyy/MM/dd');
								item.entity.end_time = util.formatDate.format(new Date(item.entity.endTime), 'yyyy/MM/dd');
								item.entity.isValue = item.entity.stat == 1 ? '有效' : '无效';
							})
							this.campList = campListData
						}
					} else {
						this.$message.error(res.data.msg || '未知错误，请联系管理员');
					}
					this.campListLoading = false;
				})
				.catch(error => {
					if (error.response) {
						this.$notify({
							title: error.response.status,
							message: '网络请求错误',
							type: 'error'
						})
					} else if (error.request) {
						this.$notify({
							title: error.request,
							message: '网络请求错误',
							type: 'error'
						})
					} else {
						this.$notify({
							title: '错误',
							message: error.message,
							type: 'error'
						})
					}
					this.campListLoading = false;
				})
		},
		/*
			集训营列表分页操作
		*/
		handleCurrentChange(val) {
			this.initTrainCampList(val);
		},
		/*
			课程列表分页操作
		*/
		handleCurrentCourseChange(val) {
			this.loadCourseList(val);
		},
		/*
				点击新增集训营操作
		*/
		handleAddCamp() {
			this.addFormVisible = true;
			this.trainCamp = {
				campName: '',
				startDate: new Date(),
				endDate: '',
				courseName: '',
				courseId: '',
				preLessonStart: '',
				preLessonEnd: '',
				needLogin: '2',
				isValue: '1',
				loginLessonStart: '',
				loginLessonEnd: '',
				stage: 0,
				startDay: 0,
			}
		},
		/*
				选择课程操作
		*/
		chooseCourse() {
			this.chooseCoursePage = true;
			this.courseData.page = 1;
			this.loadCourseList(1)
		},
		/*
				请求课程列表接口调用
		*/
		loadCourseList(curPage) {
			this.courseListLoading = true;
			/*
					筛选出符合标准的课程
					单项推广课／仅限h5观看／免费／有效
			*/
			let para = {
				page_index: curPage,
				page_size: 10,
				type: 2,
				sub_type: 8,
				status: 1,
				fee: 1,
				view_type: 1
			};
			getCourseList(para).then(res => {
					if (res.data.success) {
						let data = res.data.data
						this.courseData.totalNum = data.totalCount;
						this.courseData.totalPage = data.totalPage;
						this.courseData.list = data.items;
						this.courseData.limit = data.limit;
					} else {
						this.$notify({
							title: '错误',
							message: res.data.msg,
							type: 'error'
						})
					}
					this.courseListLoading = false;
				})
				.catch((error) => {
					if (error.response) {
						this.$notify({
							title: error.response.status,
							message: '网络请求错误',
							type: 'error'
						})
					} else if (error.request) {
						this.$notify({
							title: error.request,
							message: '网络请求错误',
							type: 'error'
						})
					} else {
						this.$notify({
							title: '错误',
							message: error.message,
							type: 'error'
						})
					}
					this.courseListLoading = false;
				})
		},
		/*
			   添加课程操作
		*/
		addCourse(index) {
			this.trainCamp.courseName = this.courseData.list[index].entity.name;
			this.trainCamp.courseId = this.courseData.list[index].entity.id;
			this.chooseCoursePage = false;
		},
		/*
				修改课程选择操作
		*/
		editCourse(index) {
			this.editCamp.courseName = this.courseData.list[index].entity.name;
			this.editCamp.courseId = this.courseData.list[index].entity.id;
			this.chooseCoursePage = false;
		},
		/*
		/*
			新增集训营接口调用
		*/
		addTrainCamp() {
			this.$refs.trainCamp.validate((valid) => {
				if (valid) {
					if (true) {
						this.$confirm("确认新增集训营课程吗吗？", '提示', {}).then(() => {
							let para = Object.assign({}, this.trainCamp);

							//转化para里面的参数
							para['name'] = para['campName'];
							para['course_id'] = para['courseId'];
							para['start_day'] = para['startDay'];
							para['start_time'] = new Date(para['startDate']).getTime();
							para['end_time'] = new Date(para['endDate']).getTime();
							if (para['preLessonStart'] && para['preLessonEnd']) {
								para['preheat_count_range'] = para['preLessonStart'] + ',' + para['preLessonEnd'];
							} else {
								para['preheat_count_range'] = '0,0'
							}
							para['status'] = Number([para['isValue']]);
							if (para['needLogin'] === '2') {
								para['login_index_range'] = '0,0'
							} else {
								para['login_index_range'] = para['loginLessonStart'] + ',' + para['loginLessonEnd'];
							}

							delete para['campName'];
							delete para['startDate'];
							delete para['endDate'];
							delete para['courseName'];
							delete para['courseId'];
							delete para['preLessonStart'];
							delete para['preLessonEnd'];
							delete para['needLogin'];
							delete para['isValue'];
							delete para['loginLessonStart'];
							delete para['loginLessonEnd'];
							delete para['startDay'];

							addTrainCamp(para)
								.then(res => {
									if (res.data.success) {
										this.$notify({
											title: '添加成功',
											message: '集训营添加成功',
											type: 'success'
										});
										this.initTrainCampList(1);
										this.campListPage = 1;
										this.addFormVisible = false;
									} else {
										this.$message.error(res.data.msg || '未知错误，请联系管理员');
									}
								})
								.catch(error => {
									if (error.response) {
										this.$notify({
											title: error.response.status,
											message: '网络请求错误',
											type: 'error'
										})
									} else if (error.request) {
										this.$notify({
											title: error.request,
											message: '网络请求错误',
											type: 'error'
										})
									} else {
										this.$notify({
											title: '错误',
											message: error.message,
											type: 'error'
										})
									}
								})
							this.addFormVisible = false;
						});
					}
				}
			});
		},
		/*
				编辑集训营操作
		*/
		handleEdit(data, index) {
			this.dialogEditFormVisible = true;
			let dataEntity = data.entity;
			let dataConf = data.conf;
			this.editCamp = {
				campId: dataEntity.id,
				stage: dataConf.stage ? dataConf.stage : 0,
				campName: dataEntity.name,
				startDate: new Date(dataEntity.startTime),
				endDate: new Date(dataEntity.endTime),
				courseName: dataEntity.courseName,
				courseId: dataEntity.courseId,
				isValue: dataEntity.stat + '',
				preLessonStart: dataConf.preheatCountRange.start == 0 ? '' : dataConf.preheatCountRange.start,
				preLessonEnd: dataConf.preheatCountRange.end == 0 ? '' : dataConf.preheatCountRange.end,
				needLogin: dataConf.loginCountRange.start == 0 && dataConf.loginCountRange.end == 0 ? '2' : '1',
				loginLessonStart: dataConf.loginCountRange.start == 0 && dataConf.loginCountRange.end == 0 ? '' : dataConf.loginCountRange.start,
				loginLessonEnd: dataConf.loginCountRange.start == 0 && dataConf.loginCountRange.end == 0 ? '' : dataConf.loginCountRange.end,
				startDay: dataConf.officialStartDay ? dataConf.officialStartDay : 0
			}
		},
		/*
				更新集训营接口调用
		*/
		updateCamp() {
			this.$refs.editCamp.validate(valid => {
				if (valid) {
					if (true) {
						let para = {
							id: this.editCamp.campId,
							name: this.editCamp.campName,
							course_id: this.editCamp.courseId,
							start_time: new Date(this.editCamp.startDate).getTime(),
							end_time: new Date(this.editCamp.endDate).getTime(),
							status: Number(this.editCamp.isValue),
							stage: this.editCamp.stage,
							start_day: this.editCamp.startDay
						};
						if (this.editCamp.preLessonStart && this.editCamp.preLessonEnd) {
							para['preheat_count_range'] = this.editCamp.preLessonStart + ',' + this.editCamp.preLessonEnd;
						} else {
							para['preheat_count_range'] = '0,0'
						}
						if (this.editCamp.needLogin == 2) {
							para['login_index_range'] = '0,0';
						} else {
							para['login_index_range'] = this.editCamp.loginLessonStart + ',' + this.editCamp.loginLessonEnd;
						};
						updateTrainCamp(para).then(res => {
								if (res.data.success) {
									this.$notify({
										title: '修改成功',
										message: '修改集训营信息成功',
										type: 'success'
									});
									this.initTrainCampList(1);
									this.campListPage = 1;
									this.dialogEditFormVisible = false;
								} else {
									this.$message.error(res.data.msg || '未知错误，请联系管理员');
								}
							})
							.catch(error => {
								this.dialogEditFormVisible = false;
								if (error.response) {
									this.$notify({
										title: error.response.status,
										message: '网络请求错误',
										type: 'error'
									})
								} else if (error.request) {
									this.$notify({
										title: error.request,
										message: '网络请求错误',
										type: 'error'
									})
								} else {
									this.$notify({
										title: '错误',
										message: error.message,
										type: 'error'
									})
								}
							})
					};
				};
			});
		},
		/*
				关卡图标配置
		*/
		iconConf(item) {
			this.iconConfData = {};
			this.iconConfForm = true;
			let lessonNumber = item.entity.lessonNumber;
			this.iconConfId = item.entity.id;
			if (item.conf.tollGateImgs && item.conf.tollGateImgs.length) {
				for (var i = 0; i < lessonNumber; i++) {
					var lesson_index = 'lesson_' + (i + 1);
					Vue.set(this.iconConfData, lesson_index, item.conf.tollGateImgs[i])
				}
			} else {
				for (var i = 0; i < lessonNumber; i++) {
					var lesson_index = 'lesson_' + (i + 1);
					Vue.set(this.iconConfData, lesson_index, '')
				}
			}

		},
		/**
		 *      从本地or素材库选择图标
		 */
		assignVal(val, value) {
			this.$set(this.iconConfData, value, val.url)
		},
		/**
		 * 预览
		 */
		previewIcon(value) {
			if (this.iconConfData[value] != '') {
				this.iconSrc = this.iconConfData[value];
				this.iconPreviewIsShow = true;
			} else {
				this.iconSrc = ''
				this.$notify({
					title: '预览失败',
					message: '没有配置相应的资源',
					type: 'error'
				})
			}

		},
		/*
				配置图标数据提交
		*/
		iconConfSubmit() {
			let iconArr = [];
			for (let prop in this.iconConfData) {
				iconArr.push(this.iconConfData[prop]);
			};
			let para = {
				id: this.iconConfId,
				image_urls: iconArr.join(',')
			}
			updateTrainCampIconConf(para).then(res => {
					if (res.data.success) {
						this.$notify({
							title: '配置成功',
							message: '配置成功',
							type: 'success'
						});
						this.initTrainCampList(1);
					} else {
						this.$notify({
							title: '错误',
							message: res.data.msg,
							type: 'error'
						})
					}
					this.iconConfForm = false;
				})
				.catch(error => {
					if (error.response) {
						this.$notify({
							title: error.response.status,
							message: '网络请求错误',
							type: 'error'
						})
					} else if (error.request) {
						this.$notify({
							title: error.request,
							message: '网络请求错误',
							type: 'error'
						})
					} else {
						this.$notify({
							title: '错误',
							message: error.message,
							type: 'error'
						})
					}
					this.iconConfForm = false;
				})
		},
		/*
			  生成链接表格打开
		*/
		link_created(item) {
			this.linkCreateFormVisible = true;
			this.lessonListLoading = true;
			this.course_id = item.entity.courseId;
			this.linkCampId = item.entity.id;
			this.linkCampStart = new Date(item.entity.start_time).getTime();
			let para = {
				course_id: this.course_id,
			}
			getLessonListByCourse(para).then((res) => {
				if (res.data.success) {
					this.linkDataList = [];
					if (res.data.data && res.data.data.length) {
						let units = res.data.data;
						units.map((items, index) => {
							if (items.unitLessonList && items.unitLessonList.length) {
								items.unitLessonList.map((item, _index) => {
									this.linkDataList.push(item)
								})
							}
						})
						this.linkDataList.map((item, index) => {
							Vue.set(item, "defaultExpireTime", this.linkCampStart + 86400000 * (Number(index) + 1) + 36000000);
						})
					}
				} else {
					this.$notify({
						title: '错误',
						message: res.data.msg,
						type: 'error'
					})
				}
				this.lessonListLoading = false;
			}).catch((error) => {
				if (error.response) {
					this.$notify({
						title: error.response.status,
						message: '网络请求错误',
						type: 'error'
					})
				} else if (error.request) {
					this.$notify({
						title: error.request,
						message: '网络请求错误',
						type: 'error'
					})
				} else {
					this.$notify({
						title: '错误',
						message: error.message,
						type: 'error'
					})
				}
			})
			this.lessonListLoading = false;
		},
		/**
		 * [linkCourseCreated 生成课程／课节链接操作]
		 * @param  {[type]} type  [0 课程 1 1.0课节  2  2.0课节]
		 * @param  {[type]} index [description]
		 * @param  {[type]} item  [description]
		 * @param  {[type]} flag  [0 折叠目录形式无地图  1 不带2.0地图页  2 带2.0地图页]
		 * @return {[type]}       [description]
		 */
		linkCourseCreated(type, index, item, flag) {
			let para = {
				camp_id: this.linkCampId,
				type: type,
				course_id: this.course_id,
				lesson_id: item.lessonId,
				expire_time: new Date(item.defaultExpireTime).getTime(),
				day: Number(index) + 1,
				flag: flag
			}
			generateLink(para).then(res => {
					if (res.data.success) {
						let paraShortUrl = {
							url: res.data.data.linkUrl
						}
						transformShortUrl(paraShortUrl).then(data => {
							if (data.data.success) {
								if (para.type == 0) {
									if (para.flag == 0) {
										Vue.set(this.linkDataList[index], "linkCourseUrl", data.data.data);
									} else if (para.flag == 1) {
										Vue.set(this.linkDataList[index], "linkCourseMapUrl", data.data.data);
									} else {
										Vue.set(this.linkDataList[index], "linkCourseNewMapUrl", data.data.data);
									}
								} else if (para.type == 1) {
									Vue.set(this.linkDataList[index], "linkLessonUrl", data.data.data);
								} else if (para.type == 2) {
									Vue.set(this.linkDataList[index], "linkBriefLessonUrl", data.data.data);
								}
								this.$notify({
									title: '成功',
									message: '生成链接成功',
									type: 'success'
								})
							} else {
								this.$notify({
									title: '错误',
									message: res.data.msg,
									type: 'error'
								})
							}
						}).catch(error => {
							if (error.response) {
								this.$notify({
									title: error.response.status,
									message: '网络请求错误',
									type: 'error'
								})
							} else if (error.request) {
								this.$notify({
									title: error.request,
									message: '网络请求错误',
									type: 'error'
								})
							} else {
								this.$notify({
									title: '错误',
									message: error.message,
									type: 'error'
								})
							}
						})

					} else {
						this.$notify({
							title: '错误',
							message: res.data.msg,
							type: 'error'
						})
					}
				})
				.catch(error => {
					if (error.response) {
						this.$notify({
							title: error.response.status,
							message: '网络请求错误',
							type: 'error'
						})
					} else if (error.request) {
						this.$notify({
							title: error.request,
							message: '网络请求错误',
							type: 'error'
						})
					} else {
						this.$notify({
							title: '错误',
							message: error.message,
							type: 'error'
						})
					}
				})
		},
		/**
		 * [editWiki 编辑文案]
		 * @param  {[type]} index [当前选项的索引]
		 * @param  {[type]} row   [当前选项的数据]
		 * @return {[type]}       [description]
		 */
		editWiki(index, row) {
			this.$router.push({
				path: '/pro_train_wiki_page',
				query: {
					camp_id: this.linkCampId,
					course_id: this.course_id,
					lesson_id: row.lessonId,
					day: Number(index) + 1,
				}
			})
		}
	},
	mounted() {
		this.initTrainCampList(1);
	}
}
</script>

<style lang="less" scope>
.col-bg {
    height: 50px;
    background-color: #f2f2f2;
    margin-top: 5px;
    .col_distance {
        margin-top: 10px;
    }
}
.upload-icon {
    width: 500px;
    margin-left: 20px;
    float: left;
}
.preview-icon-btn {
    float: left;
}
.icon-preview {
    position: absolute;
    left: 0;
    top: 0;
}
</style>
