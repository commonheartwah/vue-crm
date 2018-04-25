<template lang="html">
	<section>
		<Toolbar :placeHolder="['请输入课程ID','请输入课程名称']" :addItemTitle='addItemTitle' v-on:emitHandleSeek='onHandleSeek' v-on:emitHandleAdd='emitHandleAdd'></Toolbar>
		<FormList :formData='formdata' :formTitle='formTitle' :editItemForm='editItemTitle' style="width:100%;" v-on:submitEdit='submitEdit'  v-loading="loading" element-loading-text="努力加载中"></FormList>
		<el-col :span='24' class='toolbar'>
            <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='20' :total='total' style='float: right'></el-pagination>
        </el-col>
	</section>
</template>

<script>
import FormList from '../../components/formList'
import Toolbar from '../../components/toolbar'

import {
	getCourseList,
	editCourseInfo,
	addCourseToList,
	addLessonToList,
} from '../../api/api';
var levelsOptions = [{
		value: '1',
		label: 'Level 1'
	},
	{
		value: '2',
		label: 'Level 2'
	},
	{
		value: '3',
		label: 'Level 3'
	},
	{
		value: '4',
		label: 'Level 4'
	},
	{
		value: '5',
		label: 'Level 5'
	},
	{
		value: '6',
		label: 'Level 6'
	},
	{
		value: '7',
		label: 'Level 7'
	},
	{
		value: '8',
		label: 'Level 8'
	},
	{
		value: '9',
		label: 'Level 9'
	},
	{
		value: '10',
		label: 'Level 10'
	},
	{
		value: '11',
		label: 'Level 11'
	},
	{
		value: '12',
		label: 'Level 12'
	}
];
var scheduleOptions = [{
		value: 0,
		label: '请选择'
	},
	{
		value: 1,
		label: '精品课'
	},
	{
		value: 2,
		label: '发音课'
	},
	{
		value: 3,
		label: '体验课'
	},
	{
		value: 4,
		label: '2.0 体系课'
	},
	{
		value: 5,
		label: '2.0 发音课'
	},
	{
		value: 6,
		label: '简单体系课(无复习课)'
	}
]
export default {
	components: {
		FormList,
		Toolbar
	},
	data() {
		return {
			// 列表 是否显示判断表
			formTitle: {
				id: {
					label: 'ID',
					width: '73'
				},
				name: {
					label: '课程名称',
					width: ''
				},
				display: {
					label: '显示',
					width: '75'
				},
				courseType: {
					label: '类型',
					width: '155'
				},
				stat: {
					label: '状态',
					width: '75'
				},
				internalName: {
					label: '内部名称',
					width: ''
				},
				CourseExpand: {
					edit: {
						label: '课程信息编辑'
					}
				},
				button: {
					// edit:{
					// 	label:'编辑'
					// },
					addLesson: {
						label: '添加课节'
					},
					relevanceUnit: {
						label: '配置单元'
					},
					bindMusicLesson: {
						label: '音乐课件'
					},
					width: '265'
				}
			},
			addFormEmpty: false,
			editFormEmpty: false,
			// 添加表单里 是否显示判断表
			addItemTitle: {
				formHeader: {
					label: '新增课程'
				},
				name: {
					label: '课程名称',
					width: ''
				},
				type: {
					label: '课程类型',
					width: ''
				},
				viewType: {
					label: '观看类型',
					width: '',
					options: [{
							value: '0',
							label: '仅限APP查看'
						},
						{
							value: '1',
							label: '仅限H5查看'
						},
						{
							value: '2',
							label: '无限制'
						}
					]
				},
				course_levels: {
					label: '课程等级',
					width: '',
					options: levelsOptions
				},
				choose_schedule_type: {
					label: '课表类型',
					width: '',
					options: scheduleOptions
				},
				course_version: {
					label: '课程版本',
					width: '',
					options: [{
							value: '0',
							label: '1.0'
						},
						{
							value: '1',
							label: '2.0'
						}
					]
				},
				price: {
					label: '课程价格',
					width: ''
				},
				display: {
					label: '是否显示',
					width: ''
				},
				lessonNumber: {
					label: '课节数量'
				},
				description: {
					label: '课程描述'
				},
				internalName: {
					label: '内部名称'
				},
				stat: {
					label: '课程状态',
					width: ''
				},
				image_url: {
					label: '课程图标'
				},
				fee: {
					label: '售卖类型',
					width: ''
				},
				input: {
					id: {
						label: 'id'
					},
					name: {
						label: 'name'
					},
					courseType: {
						lable: 'courseType'
					},
					feeType: {
						label: '售卖类型',
						width: ''
					}
				},
				selectTeacher: {
					label: '选择老师',
				},
				button: {
					seek: {
						label: '查询'
					},
					add: {
						label: '新增'
					}
				}
			},
			// 编辑表单里 是否显示判断表
			editItemTitle: {
				formHeader: {
					label: '编辑课程'
				},
				name: {
					label: '课程名称',
					width: ''
				},
				internalName: {
					label: '内部名称',
					rule: [{
							required: false,
							message: '请输入课程内部名称',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 64,
							message: '长度在 1 到 64 个字符',
							trigger: 'blur'
						}
					],
				},
				viewType: {
					label: '观看类型',
					options: [{
							value: '0',
							label: '仅限APP查看'
						},
						{
							value: '1',
							label: '仅限H5查看'
						},
						{
							value: '2',
							label: '无限制'
						}
					]
				},
				course_version: {
					label: '课程版本',
					options: [{
							value: '0',
							label: '1.0'
						},
						{
							value: '1',
							label: '2.0'
						},
					]
				},
				course_levels: {
					label: '课程等级',
					width: '',
					options: levelsOptions
				},
				choose_schedule_type: {
					label: '课表类型',
					width: '',
					options: scheduleOptions
				},
				image_url: {
					label: '课程图标'
				},
				price: {
					label: '课程价格',
					width: ''
				},
				searchSundCourse: {
					label: '绑定发音课'
				},
				lessonNumber: {
					label: '课节数量'
				},
				description: {
					label: '课程描述'
				},
				display: {
					label: '是否显示',
					width: ''
				},
				stat: {
					label: '课程状态',
					width: ''
				},
				fee: {
					label: '售卖类型',
					width: ''
				},
				selectTeacher: {
					label: '选择老师',
				},
			},
			formdata: [],
			total: 0,
			courseName: '',
			courseType: '',
			courseSubType: '',
			feeType: '',
			page_index: 1,
			loading: true,
		};
	},
	methods: {
		// 加载 Course列表
		initCoursesList() {
			let parameter = {
				id: this.courseId,
				name: this.courseName,
				page_index: this.page_index,
				type: this.courseType,
				sub_type: this.courseSubType,
				fee: this.feeType,
			}
			if (this.$route.query.user_id) {
				parameter['type'] = 2;
				/***
				 * 实际业务需求 开通单项课的时候分页显示数量(page_size)为40
				 */
				parameter['page_size'] = 40
			};
			// 调用 加载列表的接口
			getCourseList(parameter)
				.then((res) => {
					if (res.data.success) {
						if (res.data.data.items) {
							this.formdata = [];
							res.data.data.items.forEach((item) => {
								let tempObj = item.entity;
								if (item.conf) {
									tempObj['conf'] = item.conf;
								};
								this.formdata.push(tempObj);
							});
						};
						this.total = res.data.data.totalCount;
					} else {
						this.$notify.error(res.data.msg);
					};
					this.loading = false;
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
					this.loading = false;
				})
		},
		// 查询 按钮的监听
		// 传入 写入的 ID 或者 name 。并调用 Course 列表接口方法
		onHandleSeek(obj) {
			this.courseId = obj.id;
			this.courseName = obj.name;
			this.courseType = obj.courseType[0];
			this.courseSubType = obj.courseType[1];
			this.feeType = obj.feeType[0];
			this.initCoursesList('');
		},
		// 新增课程 确定 的监听
		emitHandleAdd(obj) {
			this.loading = true;
			let parameter = {
				name: obj.name,
				type: obj.type[0],
				sub_type: obj.type[1],
				price: obj.price,
				display: obj.display,
				status: obj.stat,
				fee: obj.fee,
				teacher_ids: obj.teacherids,
				image_url: obj.image_url,
				lesson_number: obj.lessonNumber,
				description: obj.description,
				internal_name: obj.internalName,
				sound_id: obj.sound_id,
				view_type: obj.viewType[0],
				course_levels: obj.course_levels.toString(),
				choose_schedule_type: obj.choose_schedule_type,
				course_version: obj.course_version[0]
			};
			addCourseToList(parameter)
				.then((res) => {
					if (res.data.success) {
						this.$notify({
							title: '成功',
							message: '添加成功',
							type: 'success',
							offset: 45
						});
						this.addFormEmpty = true;
					} else {
						this.$notify({
							title: '失败',
							message: res.data.msg,
							type: 'error',
							offset: 45
						});
					};
					this.initCoursesList('');
				})
				.catch(() => {
					this.initCoursesList('');
				});
		},
		// 分页
		handleCurrentChange(val) {
			this.loading = true;
			this.page_index = val;
			this.initCoursesList('');
		},
		// 提交 Course 改变
		submitEdit(obj, itemFlag) {
			// 1 是编辑课程。2 是新增单元Unit。3 是新增课节Lesson 。添加单元和课节的时候强制绑定courseId
			switch (itemFlag) {
				case 1:
					this.editCourse(obj);
					break; // 编辑课程 的方法
				case 3:
					this.addLessonFunc(obj);
					break; // 新增课节 的方法
			}
		},
		// 编辑课程 的接口调用
		editCourse(obj) {
			let parameter = {
				id: obj.id,
				name: obj.name,
				type: obj.type,
				sub_type: obj.subType,
				price: obj.price,
				display: obj.display,
				status: obj.stat,
				fee: obj.fee,
				teacher_ids: obj.teacherids,
				image_url: obj.image_url,
				lesson_number: obj.lessonNumber,
				description: obj.description,
				internal_name: obj.internalName,
				sound_id: obj.sound_id,
				view_type: obj.courseViewType[0],
				course_levels: obj.course_levels.toString(),
				choose_schedule_type: obj.choose_schedule_type,
				course_version: obj.cv[0]
			};
			editCourseInfo(parameter)
				.then((res) => {
					if (res.data.success) {
						this.initCoursesList('');
						this.$notify({
							title: '成功',
							message: '操作成功',
							type: 'success',
							offset: 45
						});
					} else {
						this.$notify({
							title: '失败',
							message: res.data.msg,
							type: 'error',
							offset: 45
						});
					};
				})
				.catch(() => {
					this.initCoursesList('');
				});
		},
		// 新增课节 的接口调用
		addLessonFunc(obj) {
			let parameter = {
				course_id: obj.course_id,
				name: obj.name,
				status: obj.stat,
				display: obj.display,
				type: obj.customType[0],
				internal_name: obj.internalName,
				description: obj.description,
				teacher_ids: obj.teacherids,
				summary_content: obj.summary_content,
				summary_url: obj.summary_url,
				lesson_poster_url: obj.lesson_poster_url
			};
			addLessonToList(parameter).then((res) => {
					if (res.data.success) {
						this.$notify({
							title: '成功',
							message: '操作成功',
							type: 'success',
							offset: 45
						});
						this.$router.push({
							name: '课节详情',
							params: {
								lessonId: res.data.data.entity.id
							}
						})
					} else {
						this.$notify({
							title: '失败',
							message: res.data.msg,
							type: 'error',
							offset: 45
						});
					};
					this.initCoursesList('');
				})
				.catch(() => {
					this.initCoursesList('');
				});
		},
		// 判断是否来自appUser页面
		checkIsFromAppuserPage() {
			if (this.$route.query.user_id) {
				this.formTitle.button = {
					addUserCourse: {
						label: '确认开课',
						user_id: this.$route.query.user_id,
					},
					width: '105'
				};
			};
		}
	},
	created() {
		this.initCoursesList('');
		this.checkIsFromAppuserPage();
	}
}
</script>

<style lang="css">
</style>
