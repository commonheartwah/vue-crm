<template lang="html">
	<section>
		<Toolbar :placeHolder="['请输入课节ID','请输入课节名称']" :addItemTitle='addItemTitle' v-on:emitHandleSeek='onHandleSeek'></Toolbar>
		<FormList :formData='formdata' :formTitle='formTitle' :editItemForm='editItemTitle' style="width:100%;" v-on:submitEdit='submitEdit' v-loading="loading" element-loading-text="努力加载中" v-on:makeSureAddToGivenUnit='makeSureAddToGivenUnit' v-on:returnSels='returnSels' @copyLessonToCourse='copyLessonToCourse'></FormList>
		<el-col :span='24' class='toolbar'>
			<el-button type='success' @click='batchAddToGivenUnit' v-if="this.$route.query.plan_id" :disabled="this.selsArr.length===0">批量添加</el-button>
			<el-button type='success' @click='batchCopyLesson' :disabled="this.selsArr.length===0" v-if="!this.$route.query.plan_id">批量复制</el-button>
            <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='20' :total='total' style='float: right'></el-pagination>
        </el-col>
		<el-dialog title="选择课程" :visible.sync="copyLessonSelectCourseFlag" size="tiny">
			<el-select v-model="selectCourse" style="width:300px;" placeholder="请输入课程名称或ID查询" filterable clearable remote :remote-method="selectCourseRemoteMethod" :loading='selectCourseLoading'>
				<el-option
				  v-for="item in selectCourseOptions"
				  :key="item.id"
				  :label="'（' + item.id + '）' + item.name"
				  :value="item.id">
				</el-option>
			</el-select>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="copyLessonSelectCourseFlag = false">取 消</el-button>
		        <el-button type="primary" @click="submitCopyLessonToCourse">确 定</el-button>
		    </span>
		</el-dialog>
		<el-dialog title="新增赠课单元" :visible.sync="addUnitForGiving" size="tiny">
			<el-form ref="addUnitForGivingData" :model="addUnitForGivingData" :rules="addUnitForGivingRule" label-width='110px'>
				<el-form-item label="单元名称" prop="name">
					<el-input v-model="addUnitForGivingData.name"></el-input>
				</el-form-item>
				<el-form-item label="封面图片地址" prop="cover_image">
					<el-input v-model="addUnitForGivingData.cover_image"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addUnitForGiving=false">取消</el-button>
				<el-button type="primary" @click.native="updateUnitForPlanSubmit">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
import FormList from '../../components/formList'
import Toolbar from '../../components/toolbar'

import {
	getLessonList,
	editLessonInfo,
	getCourseList,
	copyLessonApi,
	// 获取制定ID的计划
	getPlanById,
	// 更新该计划下的赠课信息
	updateUnitForPlan
} from '../../api/api';

export default {
	components: {
		FormList,
		Toolbar
	},
	data() {
		return {
			formTitle: {
				id: {
					label: 'ID',
					width: '73'
				},
				name: {
					label: '课节名称',
					width: ''
				},
				display: {
					label: '是否显示',
					width: '100'
				},
				stat: {
					label: '状态',
					width: '70'
				},
				lessonType: {
					label: '类型',
					width: '80'
				},
				// ver: {
				// 	label: '版本',
				// 	width: '70'
				// },
				ct: {
					label: '创建时间',
					width: '190'
				},
				ut: {
					label: '更新时间',
					width: '190'
				},
				selection: {
					label: '复选框',
					width: '55'
				},
				button: {
					details: {
						label: '详情'
					},
					edit: {
						label: '编辑'
					},
					copyLesson: {
						label: '复制'
					},
					width: '180px'
				}
			},
			formdata: [],
			total: 0,
			pageIndex: 1,
			seekCourseId: '',
			seekLessonId: '',
			seekName: '',
			loading: true,
			// 添加表单里 是否显示判断表
			addItemTitle: {
				formHeader: {
					label: '新增课节'
				},
				input: {
					id: {
						label: 'id'
					},
					name: {
						label: 'name'
					},
					courseId: {
						label: 'courseId'
					},
					// courseName: {
					// 	lable: 'courseName'
					// }
				},
				button: {
					seek: {
						label: '查询'
					},
				}
			},
			// 编辑表单里 是否显示判断表
			editItemTitle: {
				formHeader: {
					label: '编辑课节'
				},
				name: {
					label: '课节标题',
					width: ''
				},
				internalName: {
					label: '内部名称',
					width: ''
				},
				customType: {
					label: '课节类型',
					width: '',
					customOption: [ // 课程能选择的类型
						{
							value: '0',
							label: '主课'
						},
						{
							value: '1',
							label: '赠课'
						},
						{
							value: '2',
							label: '复习课'
						}
					],
				},
				lesson_poster_url: {
					label: '封面图片',
					width: '',
				},
				description: {
					label: '课节描述',
					width: '',
					role: true
				},
				summary_content: {
					label: '摘要内容',
					width: '',
				},
				summary_url: {
					label: '摘要url',
					width: '',
				},
				selectTeacherInLesson: {
					label: '选择老师',
					width: ''
				},
				display: {
					label: '是否显示',
					width: ''
				},
				stat: {
					label: '课节状态',
					width: ''
				},
			},
			selsArr: [],
			// 复制课程相关
			selectCourse: '',
			selectCourseOptions: [],
			selectCourseLoading: false,
			copyLessonSelectCourseFlag: false,
			//配置赠课单元相关配置信息弹窗
			addUnitForGiving: false,
			addUnitForGivingData: {
				name: '',
				cover_image: ''
			},
			unitConfList: [],
			addType: 0,
			addUnitForGivingRule: {
				name: [{
					required: true,
					message: '请输入单元名称',
					trigger: 'blur'
				}],
				cover_image: [{
					required: true,
					message: '请输入图片地址',
					trigger: 'blur'
				}]
			}
		};
	},
	methods: {
		initLessonsList(obj) {
			let parameter = {
				id: this.seekLessonId,
				name: this.seekName,
				course_id: this.seekCourseId,
				page_index: this.pageIndex
			};
			getLessonList(parameter)
				.then((res) => {
					if (res.data.success) {
						this.formdata = []
						if (res.data.data.items) {
							res.data.data.items.forEach((item) => {
								item.entity['parsed'] = item.parsed;
								this.formdata.push(item.entity);
							});
						};
						if (res.data.data.totalCount) {
							this.total = res.data.data.totalCount;
						} else {
							this.total = 0;
						};
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
				});
		},
		onHandleSeek(obj) {
			this.seekCourseId = obj.courseId;
			this.seekLessonId = obj.id;
			this.seekName = obj.name;
			this.initLessonsList(obj);
		},
		// 分页
		handleCurrentChange(val) {
			this.loading = true;
			this.pageIndex = val;
			this.initLessonsList('');
		},
		// 提交 lesson 改变
		submitEdit(obj) {
			let parameter = {
				course_id: obj.courseId,
				id: obj.id,
				name: obj.name,
				internal_name: obj.internalName,
				status: obj.stat,
				type: obj.customType[0],
				display: obj.display,
				description: obj.description,
				teacher_ids: obj.teacherids,
				exam_suite_id: obj.parsed.examSuiteId ? obj.parsed.examSuiteId : 0,
				material_id: obj.parsed.materialId ? obj.parsed.materialId : '',
				summary_content: obj.summary_content,
				summary_url: obj.summary_url,
				lesson_poster_url: obj.lesson_poster_url
			};
			editLessonInfo(parameter).then((res) => {
				if (res.data.success) {
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
				this.initLessonsList('');
			})
		},
		// 接收来自子组件传来的 lesson的信息 由父组件确认加入赠课单元
		makeSureAddToGivenUnit(index, row) {
			this.addType = 0;
			// let unitConf = [];
			this.addUnitForGivingData.id = row.id;
			let para = {
				plan_id: this.$route.query.plan_id
			};
			getPlanById(para).then((res) => {
				if (res.data.success) {
					if (res.data.data.data.conf.planUnits) {
						// 数据初始化
						this.unitConfList = res.data.data.data.conf.planUnits;
					};
					// 判断属于新添单元还是新添课节
					if (!this.$route.query.name) {
						this.addUnitForGiving = true;
					} else {
						// 单元下新添加课节
						this.unitConfList.forEach((item) => {
							if (item.name == this.$route.query.name) {
								if (item.lessonIds.length == 0) {
									item.lessonIds.push(row.id);
								} else {
									item.lessonIds.push(row.id);
								}
							}
						})
						this.updateUnitConf(this.unitConfList);
					};
				};
			});
		},
		// 更新赠课单元信息操作
		updateUnitForPlanSubmit(type) {
			this.$refs.addUnitForGivingData.validate((valid) => {
				if (valid) {
					if (!this.$route.query.name) {
						if (this.addType == 0) {
							this.unitConfList.push({
								name: this.addUnitForGivingData.name,
								cover_image: this.addUnitForGivingData.cover_image,
								lessonIds: this.addUnitForGivingData.id
							})
						} else {
							var ids = this.selsArr.map(item => item.id).toString();
							this.unitConfList.push({
								name: this.addUnitForGivingData.name,
								cover_image: this.addUnitForGivingData.cover_image,
								lessonIds: ids.split(',')
							})
						}
						this.updateUnitConf(this.unitConfList)
					}
				}
			})
		},
		// 更新赠课信息的操作
		updateUnitConf(unitConf) {
			// 更新赠课信息
			let para = {
				plan_id: this.$route.query.plan_id,
				values: JSON.stringify(unitConf)
			};
			updateUnitForPlan(para).then((res) => {
				if (res.data.success) {
					this.$notify({
						title: '成功',
						message: '操作成功',
						type: 'success'
					});
					this.addUnitForGiving = false;
					this.addUnitForGivingData = {};
					this.unitConfList = [];
					this.$router.go(-1);
				} else {
					this.$message({
						message: res.data.msg,
						type: 'error'
					});
					this.addUnitForGiving = false;
				};
			});
		},
		returnSels(sels) {
			// sels.forEach((item) => {
			// 	this.selsArr.push(item);
			// });
			this.selsArr = sels;
		},
		batchCopyLesson() {
			this.copyLessonSelectCourseFlag = true;
		},
		copyLessonToCourse(index, row) {
			this.selsArr[0] = row;
			this.copyLessonSelectCourseFlag = true;
		},
		selectCourseRemoteMethod(query) {
			if (query !== '') {
				this.selectCourseLoading = true;
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
						this.selectCourseOptions = res.data.data.items.map((item) => {
							let tempObj = {
								id: item.entity.id,
								name: item.entity.name,
							}
							return tempObj
						});
					} else {
						this.$message.error(res.data.msg || '未知错误，请联系管理员');
					};
					this.selectCourseLoading = false;
				});
			} else {
				this.selectCourseOptions = [];
			};
		},
		submitCopyLessonToCourse() {
			this.copyLessonSelectCourseFlag = false;
			let parameter = {
				course_id: this.selectCourse,
				lesson_ids: ''
			};
			this.selsArr.forEach((item) => {
				parameter['lesson_ids'] += item.id + ','
			});
			copyLessonApi(parameter).then((res) => {
				if (res.data.success) {
					this.courseId = this.selectCourse;
					this.$notify({
						title: '成功',
						message: '复制成功',
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
				this.initLessonsList('');
			});
		},
		batchAddToGivenUnit() {
			var ids = this.selsArr.map(item => item.id).toString();
			this.addType = 1;
			// let unitConf = [];
			let para = {
				plan_id: this.$route.query.plan_id
			};
			getPlanById(para).then((res) => {
				if (res.data.success) {
					if (res.data.data.data.conf.planUnits) {
						// 数据初始化
						this.unitConfList = res.data.data.data.conf.planUnits;
					};
					// 判断属于新添单元还是新添课节
					if (!this.$route.query.name) {
						this.addUnitForGiving = true
					} else {
						// 单元下新添加课节
						this.unitConfList.forEach((item) => {
							if (item.name == this.$route.query.name) {
								if (item.lessonIds.length == 0) {
									item.lessonIds = ids.split(',');
								} else {
									item.lessonIds = (item.lessonIds.join(',') + ',' + ids).split(',');
								};
							};
						});
						this.updateUnitConf(this.unitConfList);
					};
				};
			});
		}
	},
	created() {
		this.initLessonsList('');
		// 判断是否是来自 赠课详情的页面
		if (this.$route.query.plan_id) {
			this.$set(this.formTitle, 'button', {
				details: {
					label: '详情'
				},
				addToUnit: {
					label: '确认添加'
				},
				width: '150px'
			});
		};
	},
	watch: {
		copyLessonSelectCourseFlag: {
			handler(newVal, oldVal) {
				if (!newVal) {
					this.selectCourse = '';
					this.selectCourseOptions = [];
					this.selectCourseLoading = false;
				}
			},
			deep: true
		}
	}
}
</script>

<style lang="css">
</style>
