<template lang="html">
    <section>

        <!-- 按钮  过滤  工具条-->
        <el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
            <el-form :inline=true :model='filters'>

                <el-form-item>
                    <el-input v-model='filters.id' placeholder='计划 ID' icon="circle-cross" :on-icon-click="handleIconClick_clearId" @keydown.native.prevent.enter='loadList'></el-input>
                </el-form-item>

                <el-form-item>
                    <el-input v-model='filters.course_id' placeholder='课程 ID' icon="circle-cross" :on-icon-click="handleIconClick_clearCourseId" @keydown.native.prevent.enter='loadList'></el-input>
                </el-form-item>

                <el-form-item>
                    <el-input v-model='filters.name' placeholder='计划名称' icon="circle-cross" :on-icon-click="handleIconClick_clearName" @keydown.native.prevent.enter='loadList'></el-input>
                </el-form-item>

                <el-form-item>
                    <el-date-picker
                        v-model="filters.start_time"
                        type="date"
                        placeholder="开课时间"
                        @keydown.native.prevent.enter='loadList'
                    >
                    </el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-date-picker
                        v-model="filters.end_time"
                        type="date"
                        placeholder="失效时间"
                        @keydown.native.prevent.enter='loadList'
                    >
                    </el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-button type='primary' @click='loadList'>查询</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button type='primary' @click='handleAdd'>新增</el-button>
                </el-form-item>

            </el-form>
        </el-col>

        <!-- 列表 -->
        <el-table border :data="plans" highlight-current-row v-loading="listLoading" style="width: 100%;">

            <el-table-column type="expand">
                <template scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">

                        <el-form-item label="计划 ID">
                            <span>{{ props.row.entity.id }}</span>
                        </el-form-item>

                        <el-form-item label="课程 ID">
                            <span>{{ props.row.entity.courseId }}</span>
                        </el-form-item>

                        <el-form-item label="计划名称">
                            <span>{{ props.row.entity.name }}</span>
                        </el-form-item>

                        <el-form-item label="课程名称">
                            <span>{{ props.row.courseEntity.name }}</span>
                        </el-form-item>

                        <el-form-item label="课节数量">
                            <span>{{ props.row.courseEntity.lessonNumber }}</span>
                        </el-form-item>

                        <el-form-item label="课程类型">
                            <span>{{ props.row | formatSubtypeDetail }}</span>
                        </el-form-item>

                        <el-form-item label="开课日期">
                            <span>{{ props.row.entity.startTime | formatTimeDetail }}</span>
                        </el-form-item>

                        <el-form-item label="有效期类型">
                            <span>{{ props.row.conf.usePlanTime | formatValidity }}</span>
                        </el-form-item>

                        <el-form-item label="失效日期">
                            <span>{{ props.row.entity.endTime | formatTimeDetail }}</span>
                        </el-form-item>

                        <el-form-item label="创建时间">
                            <span>{{ props.row.entity.ct | formatTimeDetail }}</span>
                        </el-form-item>

                        <el-form-item label="更新时间">
                            <span>{{ props.row.entity.ut | formatTimeDetail }}</span>
                        </el-form-item>

                        <el-form-item label="计划描述" style="width:100%">
                            <span>{{ props.row.entity.description }}</span>
                        </el-form-item>

                        <el-form-item label="备注信息" style="width:100%">
                            <span>{{ props.row.entity.remark }}</span>
                        </el-form-item>

                    </el-form>
                </template>
            </el-table-column>

            <el-table-column prop="entity.id" label="ID" width="75" sortable align='center'></el-table-column>

			<el-table-column prop="entity.name" label="计划名称" show-overflow-tooltip align='center' width="500"></el-table-column>

            <!-- 实际业务需求 不显示下面两行 -->
			<!-- <el-table-column prop="entity.description" label="计划描述" show-overflow-tooltip align='center'></el-table-column>

            <el-table-column prop="courseEntity.name" label="对应课程名称" show-overflow-tooltip align='center'></el-table-column> -->

            <el-table-column prop='courseEntity.subType' label='课程类型' show-overflow-tooltip align='center' :formatter='formatSubtype'></el-table-column>

			<el-table-column prop="entity.stat" label="状态" :formatter='formatStat' width='70'></el-table-column>

            <!-- 默认的plan列表显示下面的操作按钮组 -->
			<el-table-column label="操作" align="center" width='420' v-if="!isFromAppCourse">
				<template scope="scope">
                    <el-button-group v-if="!isFromAppCourse">
                        <el-button type="success" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="info" size="small" @click="enterInPlanMembers(scope.$index, scope.row)">成员详情</el-button>
                        <el-button type="primary" size="small" @click="enterInPlanGroups(scope.$index, scope.row)">群组详情</el-button>
                        <el-button type="warning" size="small" @click="enterInPresentUnit(scope.$index, scope.row)">赠课相关</el-button>
                        <el-button type="danger" size="small" @click="enterInCalendar(scope.$index, scope.row)">课程日历</el-button>
                        <el-button type="success" size="small" :disabled="scope.row.brvbarType === '0'" @click="handleDivide(scope.$index, scope.row)">按域分班</el-button>
                    </el-button-group>
				</template>
			</el-table-column>

            <!-- 如果是来自appCourse的跳转 显示下面的确认开课 按钮 -->
            <el-table-column label="操作" align="center" width='100' v-if="isFromAppCourse">
				<template scope="scope">
                    <el-button type="success" size="small" @click="handleUpdate(scope.$index, scope.row)">确认开课</el-button>
				</template>
			</el-table-column>
		</el-table>

        <!-- 新增界面 -->
        <el-dialog title='新增' v-model='addFormVisible' :close-on-click-modal='false'>
            <el-form :model='addForm' label-width='100px' :rules='addFormRules' ref='addForm'>

                <el-form-item label='计划名称' prop='plan_name'>
                    <el-input v-model='addForm.plan_name'></el-input>
                </el-form-item>

                <el-form-item label='计划描述' prop='plan_desc'>
                    <el-input type="textarea" v-model='addForm.plan_desc'></el-input>
                </el-form-item>

                <el-form-item label='课程 ID'>
                    <el-select v-model="selectCourse" style="width: 100%;" placeholder="请输入课程名称或ID查询" filterable clearable remote :remote-method="selectCourseRemoteMethod" :loading='selectCourseLoading'>
        				<el-option
                            v-for="item in selectCourseOptions"
                            :key="item.id"
                            :label="'（' + item.id + '）' + item.name"
                            :value="item.id"
                        >
        				</el-option>
        			</el-select>
                </el-form-item>

                <el-form-item label='有效期选择'>
                    <el-date-picker v-model="validPeriod" type="daterange" placeholder="选择日期范围"></el-date-picker>
                </el-form-item>

                <el-form-item label='备注信息' prop='remark'>
                    <el-input type="textarea" v-model='addForm.remark'></el-input>
                </el-form-item>

                <el-form-item label="有效期" prop='use_plan_time'>
					<el-radio-group v-model="addForm.use_plan_time">
						<el-radio class="radio" :label="0">用户有效期</el-radio>
						<el-radio class="radio" :label="1">计划有效期</el-radio>
					</el-radio-group>
				</el-form-item>

                <el-form-item label="状态" prop='status'>
					<el-radio-group v-model="addForm.status">
						<el-radio class="radio" :label="1">有效</el-radio>
						<el-radio class="radio" :label="0">无效</el-radio>
					</el-radio-group>
				</el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
        </el-dialog>

        <!-- 编辑界面 -->
        <el-dialog title='编辑' v-model='editFormVisible' :close-on-click-modal='false'>
            <el-form :model='editForm' label-width='100px' :rules='editFormRules' ref='editForm'>

                <el-form-item label='计划名称' prop='name'>
                    <el-input v-model='editForm.name' auto-complete='off'></el-input>
                </el-form-item>

                <el-form-item label='计划描述' prop='description'>
                    <el-input v-model='editForm.description' auto-complete='off'></el-input>
                </el-form-item>

                <el-form-item label='课程ID' prop='courseId'>
                    <el-input v-model='editForm.courseId' auto-complete='off' disabled></el-input>
                </el-form-item>

                <el-form-item label="有效期类型" prop='use_plan_time'>
					<el-radio-group v-model="editForm.use_plan_time">
						<el-radio class="radio" :label="0">用户有效期</el-radio>
						<el-radio class="radio" :label="1">计划有效期</el-radio>
					</el-radio-group>
				</el-form-item>

                <el-form-item label='有效期选择'>
                    <el-date-picker v-model="validPeriod" type="daterange" placeholder="选择日期范围"></el-date-picker>
                </el-form-item>

                <el-form-item label='备注信息' prop='remark'>
                    <el-input v-model='editForm.remark' auto-complete='off'></el-input>
                </el-form-item>

                <el-form-item label="状态" prop='stat'>
                    <el-radio-group v-model="editForm.stat">
                        <el-radio class="radio" :label="1">有效</el-radio>
                        <el-radio class="radio" :label="0">无效</el-radio>
                    </el-radio-group>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!-- 分页条 -->
        <el-col :span='24' class='toolbar'>
            <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size=limit :total=totalCount style='float: right' :current-page.sync="page"></el-pagination>
        </el-col>

        <!-- 给app用户开课的时候更新课程 -->
        <el-dialog title='更新课程' v-model='dateFormVisible' :close-on-click-modal='false'>
        <el-form :model='dateForm' label-width='100px' ref="dateForm">

          <el-form-item label="用户类型" required>
            <el-radio-group v-model="dateForm.record_user_type">
              <el-radio class="radio" :label="0">订单用户</el-radio>
              <el-radio class="radio" :label="1">班长</el-radio>
              <el-radio class="radio" :label="2">大班长</el-radio>
              <el-radio class="radio" :label="3">班主任</el-radio>
              <el-radio class="radio" :label="4">推广人</el-radio>
              <el-radio class="radio" :label="5">内部员工</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="开课原因" required>
            <el-radio-group v-model="dateForm.record_reason_type" v-for="(reason,index) in reasonOpen">
              <el-radio class="radio" :label="index" style="width: 100px">{{reason.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="记录备注" prop="name">
            <el-input v-model="dateForm.record_remark"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click.native="dateFormVisible=false">取消</el-button>
          <el-button type="primary" @click.native="dateSubmit" :loading="dateLoading">提交</el-button>
        </div>
      </el-dialog>
    </section>
</template>

<script>
// axios实例
import {
	// plan的api
	getPlanList,
	addPlan,
	editPlan,
	// 给用户开课的api
	addAppCourse,
	// 获取课程列表
	getCourseList,
    divideGroupForPlan,
  //开课原因
  getPublicKvList
} from '../../api/api'
// util工具包
import util from '../../common/js/util'

export default {
	data() {
		return {
			/*
			    filter
			 */
			filters: {
				id: '',
				name: '',
				course_id: '',
				start_time: '',
				end_time: ''
			},
			/*
			    sels 列表选中列
			 */
			sels: [], //列表选中列
			/*
			    pagination
			    数据总量
			    当前页码
			    分页每页显示多少数据
			 */
			totalCount: 1,
			// page: 1,
			limit: 1,
			/*
			    list
			 */
			plans: [
				// {
				//     id: '1',
				//     name: '五月份招募计划',
				//     description: '五月份招募计划',
				//     remark: 'everybody',
				//     stat: 0,
				//     createTime: 1495421953,
				//     updateTime: 1495421953,
				// },
			],
			listLoading: false,
			/*
			    新增计划
			 */
			addFormVisible: false, //新增界面是否显示
			addLoading: false, //新增界面是否显示加载
			addFormRules: { //新增界面表单规则
				plan_name: [{
					required: true,
					message: '请输入计划名称',
					trigger: 'blur'
				}],
				plan_desc: [{
					required: true,
					message: '请输入计划描述',
					trigger: 'blur'
				}],
				course_id: [{
					required: true,
					message: '请输入课程ID'
				}],
				remark: [{
					required: false,
					message: '请输入备注信息',
					trigger: 'blur'
				}],
				status: [{
					required: true,
					message: '请选择状态'
				}],
                use_plan_time: [{
					required: true,
					message: '请选择有效期类型'
				}]
			},
			addForm: { //新增界面表单数据类型
				plan_name: '',
				plan_desc: '',
				course_id: '',
				remark: '',
				status: 1,
                use_plan_time: 1
			},
			// 新增计划 获取课程
			selectCourse: '',
			selectCourseOptions: [],
			selectCourseLoading: false,
			/*
			    编辑计划
			*/
			editFormVisible: false, //编辑界面是否显示
			editLoading: false, //编辑界面是否显示加载
			editFormRules: { //编辑界面表单规则
				name: [{
					required: true,
					message: '请输入计划名称',
					trigger: 'blur'
				}],
				description: [{
					required: true,
					message: '请输入计划描述',
					trigger: 'blur'
				}],
				courseId: [{
					required: true,
					message: '请输入课程ID',
					trigger: 'blur'
				}],
				remark: [{
					required: false,
					message: '请输入手机号',
					trigger: 'blur'
				}],
				stat: [{
					required: true,
					message: '请选择状态'
				}],
                use_plan_time: [{
					required: true,
					message: '请选择有效期类型'
				}]
			},
			editForm: {
				// id: 0,
				// name: '',
				// remark: '',
				// stat: 1
			},
			// 有效期选择 数组中[0]开始时间[1]结束时间
			validPeriod: [],
      // 选择有效期
      dateFormVisible: false, //新增界面是否显示
      dateLoading: false, //新增界面是否显示加载
      dateForm: {
        status: 0,
        record_user_type:0,
        record_reason_type:0
      }, //新增界面表单数据类型
      //开课原因
      reasonOpen:[]
		}
	},
	filters: {
		// 列表 formatTimeDetail 转换具体时间
		formatTimeDetail(date) {
			if (date == 0 || !date) {
				return '未更新'
			} else {
				return util.formatDate.format(new Date(date), 'yyyy/MM/dd   hh:mm:ss');
			}
		},
		formatSubtypeDetail(row) {
			let result = '';
			let base = '';
			if (row.courseEntity.type == 1) {
				base = '体系课';
				switch (row.courseEntity.subType) {
				case 1:
					result = '精品课';
					break;
				case 2:
					result = '发音课';
					break;
				case 3:
					result = '体验课';
					break;
                case 4:
					result = '自然拼读课';
					break;
				}
			} else if (row.courseEntity.type == 2) {
				base = '单项课';
				switch (row.courseEntity.subType) {
				case 1:
					result = '词汇课';
					break;
				case 2:
					result = '儿歌课';
					break;
				case 3:
					result = '绘本课';
					break;
				case 4:
					result = '自然拼读';
					break;
				case 5:
					result = '故事课';
					break;
				case 6:
					result = '家庭游戏课';
					break;
				case 7:
					result = '科普主题课';
					break;
				case 8:
					result = '推广课';
					break;
				case 9:
					result = '教学卡';
					break;
				}
			}
			return base + ' > ' + result;
		},
        formatValidity(val){
            return val ? '计划有效期' : '用户有效期'
        }
	},
	computed: {
		isFromAppCourse() {
			return this.$route.query.user_id ? true : false;
		}
	},
	methods: {
		//ToolBar
		// 点击input后面的icon 清除内容
		handleIconClick_clearId() {
			this.filters.id = '';
		},
		handleIconClick_clearCourseId() {
			this.filters.course_id = '';
		},
		handleIconClick_clearName() {
			this.filters.name = '';
		},
		// 分页
		handleCurrentChange(val) {
			this.page = val;
			this.loadList();
		},
		//List
		// 列表显示
		// stat 数字转换状态
		formatStat(row, column) {
			return row.entity.stat == 1 ? '有效' : row.entity.stat == 0 ? '无效' : '未知';
		},
		// 显示列表(subtype 数字转换类型)
		formatSubtype(row, column) {
			let result = '';
			let base = '';
			if (row.courseEntity.type == 1) {
				base = '体系课';
				switch (row.courseEntity.subType) {
				case 1:
					result = '精品课';
					break;
				case 2:
					result = '发音课';
					break;
				case 3:
					result = '体验课';
					break;
                case 4:
					result = '自然拼读课';
					break;
				}
			} else if (row.courseEntity.type == 2) {
				base = '单项课';
				switch (row.courseEntity.subType) {
				case 1:
					result = '词汇课';
					break;
				case 2:
					result = '儿歌课';
					break;
				case 3:
					result = '绘本课';
					break;
				case 4:
					result = '自然拼读';
					break;
				case 5:
					result = '故事课';
					break;
				case 6:
					result = '家庭游戏课';
					break;
				case 7:
					result = '科普主题课';
					break;
				case 8:
					result = '推广课';
					break;
				case 9:
					result = '教学卡';
					break;
				}
			}
			return base + ' > ' + result;
		},
		// 操作功能
		//显示计划成员列表
		enterInPlanMembers(index, row) {
			this.$router.push({
				path: '/planMembersList',
				query: {
					plan_id: row.entity.id,
                    page_index: this.page,
                    brvbar_type: row.brvbarType,
                    class: '1'
				}
			});
		},
		//显示计划群组列表
		enterInPlanGroups(index, row) {
			this.$router.push({
				path: '/planGroupsList',
				query: {
					plan_id: row.entity.id,
					plan_name: row.entity.name,
                    page_index: this.page,
                    brvbar_type: row.brvbarType
				}
			});
		},
		// 课表详情页
		enterInCalendar(index, row) {
			if (row.entity.startTime && row.entity.endTime) {
				this.$router.push({
					path: '/planCalendar',
					query: {
						plan_id: row.entity.id
					}
				});
			} else {
				this.$notify({
					title: '警告',
					message: '当前计划的有效期为空,请先更新',
					type: 'warning'
				})
			}
		},
		// 赠课详情页
		enterInPresentUnit(index, row) {
			this.$router.push({
				path: '/planPresentUnit',
				query: {
					plan_id: row.entity.id
				}
			});
		},
		// 新增页面
		//显示新增界面
		handleAdd() {
			this.addFormVisible = true;
			this.addForm = {
				plan_name: '',
				plan_desc: '',
				remark: '',
				status: 1,
                use_plan_time: 0
			}
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
					}
					this.selectCourseLoading = false;
				});
			} else {
				this.selectCourseOptions = [];
			}
		},
		//新增提交
		addSubmit() {
			this.$refs.addForm.validate((valid) => {
				if (valid) {

					// 判断有效期是否为空
					if (this.validPeriod === undefined || this.validPeriod[0] === null || this.validPeriod[1] === null) {
						this.$notify({
							title: '错误',
							message: '有效期不能为空',
							type: 'error'
						})
						return false;
					}

					this.$confirm('确认提交吗？', '提示', {
							type: 'warning'
						})
						.then(() => {
							// this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							try {
								para['start_time'] = util.formatDate.format(this.validPeriod[0], 'yyyy-MM-dd');
								para['end_time'] = util.formatDate.format(this.validPeriod[1], 'yyyy-MM-dd');
							} catch (e) {
								console.log(e);
							} finally {

							}
							para['course_id'] = this.selectCourse;
							addPlan(para).then((res) => {
								this.addLoading = false;
								if (res.data.success) {
									this.$notify({
										title: '成功',
										message: '提交成功',
										type: 'success'
									});
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.loadList();
								} else {
									this.$notify({
										title: '错误',
										message: res.data.msg,
										type: 'error'
									})
								}
								this.validPeriod = [];
							});
						})

				}
			});
		},
		// 显示编辑界面
		handleEdit(index, row) {
			this.editFormVisible = true;
			// 把对象的值插入
			this.editForm = Object.assign({}, row.entity);
			this.editForm['courseId'] += "";
            this.$set(this.editForm, 'use_plan_time', row.conf.usePlanTime)
			if (row.entity.startTime && row.entity.endTime) {
				this.validPeriod = [];
				this.validPeriod.push(new Date(row.entity.startTime));
				this.validPeriod.push(new Date(row.entity.endTime));
			}
		},
    // 分班
    handleDivide(index, row){
            console.log(row.entity.id);
            this.$confirm('确认提交吗?', '提示', {})
                .then( () => {
                    divideGroupForPlan({ plan_id: row.entity.id })
                        .then(res => {
                            console.log(res);
                            if (res.data.success) {
                                this.$notify({
        							title: '成功',
        							message: '提交成功',
        							type: 'success'
        						})
                            }else{
                                this.$notify({
                                    title: '错误',
                                    message: res.data.msg,
                                    type: 'error'
                                })
                            }
                        })
                        .catch(e => {
                            console.log(e);
                        })
                })

        },
		// 编辑页面提交
		editSubmit() {
			this.$refs.editForm.validate((valid) => {
				if (valid) {
					// 判断有效期是否为空
					if (this.validPeriod === undefined || this.validPeriod[0] === null || this.validPeriod[1] === null) {
						this.$notify({
							title: '错误',
							message: '有效期不能为空',
							type: 'error'
						})
						return false;
					}

					this.$confirm('确认提交吗?', '提示', {}).then(() => {
						this.editLoading = true;
						let para = Object.assign({}, this.editForm);
						// 将para中的某些属性替换
						para['plan_id'] = para['id'];
						para['plan_name'] = para['name'];
						para['plan_desc'] = para['description'];
						para['status'] = para['stat'];
						para['course_id'] = para['courseId'];
						//将validPeriod里面的时间带到para里面
						para['start_time'] = util.formatDate.format(this.validPeriod[0], 'yyyy-MM-dd');
						para['end_time'] = util.formatDate.format(this.validPeriod[1], 'yyyy-MM-dd');

						delete para['id'];
						delete para['name'];
						delete para['description'];
						delete para['stat'];
						delete para['courseId'];
						editPlan(para).then((res) => {
							if (res.data.success) {
								this.$notify({
									title: '成功',
									message: '编辑成功',
									type: 'success'
								});
								this.editFormVisible = false;
								this.loadList();
							} else {
								this.$notify({
									title: '错误',
									message: res.data.msg,
									type: 'error'
								})
							}
							this.editLoading = false;
							this.validPeriod = [];
						})
					}).catch(() => {

					});
				}
			})
		},
		// 确认开课
    dateSubmit() {
      this.$refs.dateForm.validate((valid) => {
        if(valid){
          this.$confirm('确认提交吗？', '提示', { type: 'warning' })
            .then(()=>{
              this.dateLoading = true;
              let para = Object.assign({}, this.dateForm);

              // 判断有效期是否为空
              try {
                // 有效期不为空
                para['start_time'] = util.formatDate.format(this.validPeriod[0], 'yyyy-MM-dd');
                para['end_time'] = util.formatDate.format(this.validPeriod[1], 'yyyy-MM-dd');
              } catch (e) {
                // 有效期为空
                para['start_time'] = para['end_time'] = 0;
              } finally {

              }
              console.log(para);
              addAppCourse(para).then((res) => {
                if (res.data.success) {
                  this.$notify({
                    title: '成功',
                    message: '开课成功',
                    type: 'success'
                  });
                  this.dateFormVisible = false;
                  this.dateLoading = false;
                  this.loadList();
                } else {
                  this.$notify({
                    title: '错误',
                    message: res.data.msg,
                    type: 'error'
                  })
                  this.dateLoading = false;
                }
              })
            })
        }
      })
			// let para = {
			// 	course_id: row.entity.courseId,
			// 	plan_id: row.entity.id,
			// 	status: 1,
			// 	user_id: this.$route.query.user_id,
			// }
		},
    //确认开课前出现弹窗
    handleUpdate(index, row){
      this.dateFormVisible = true;
      //获取开课原因
      this.initType();
      this.dateForm = {
        status:1,
        course_id: row.entity.courseId,
        plan_id: row.entity.id,
        user_id: this.$route.query.user_id,
        record_user_type:0,
        record_reason_type:0
      }
    },
    //初始化请求开课关课原因获取type类型
    initType(){
      getPublicKvList({
        name:'_sys.operation.record'
      }).then(res =>{
        if (res.data.success) {
          let arr = JSON.parse(res.data.data.content).data.user_course;
          this.reasonOpen = arr.action.open.reason;
        } else {
          this.$notify({
            title: "错误",
            type: "error",
            message: res.data.msg
          });
        }
      })
    },
		// 加载数据
		loadList() {
			let para = {
				page_index: this.page,
				id: this.filters.id,
				course_id: this.filters.course_id,
				plan_name: this.filters.name,
			};
			this.filters.start_time ? para['start_time'] = util.formatDate.format(this.filters.start_time, 'yyyy-MM-dd') : '';
			this.filters.end_time ? para['end_time'] = util.formatDate.format(this.filters.end_time, 'yyyy-MM-dd') : '';
			this.listLoading = true;
			getPlanList(para)
				.then((res) => {
					if (res.data.success) {
						this.totalCount = res.data.data.totalCount;
						this.limit = res.data.data.limit;
						this.plans = res.data.data.items;
                        this.page = res.data.data.page
					} else {
						this.$notify({
							title: '错误',
							message: res.data.msg,
							type: 'error'
						})
					}
					this.listLoading = false;
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
					this.listLoading = false;
				})
		},
	},
	created() {
        if (this.$route.query.page_index) {
            this.page = parseInt(this.$route.query.page_index)
        }else{
            this.page = 1
        }
		this.loadList();
	}
}
</script>

<style lang="less">
.demo-table-expand {
    font-size: 0;
}

.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}

.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}
</style>
