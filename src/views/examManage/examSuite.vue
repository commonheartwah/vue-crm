<template lang="html">
  <section>
    <!-- 头部搜索 -->
    <el-col class='toolbar' style='padding-bottom: 0px;'>
        <el-form :inline = "true" v-model='filter'>
            <el-form-item>
                <el-input  placeholder='请输入题库ID' icon="circle-cross" :on-icon-click="handleIconClick_clearId" v-model="filter.id"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input  placeholder='请输入课程ID' icon="circle-cross" v-model="filter.course_id" :on-icon-click="handleIconClick_clearCourseID"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input  placeholder='请输入名称' icon="circle-cross" v-model="filter.name" :on-icon-click="handleIconClick_clearName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-select  placeholder="状态" v-model="filter.status" clearable>
                   <el-option v-for="item in isValue" :key="item.value" :label="item.label" :value="item.value">
                   </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' @click="queryExamSuite">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' @click="handleAddExamSuite">新增</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' @click="quickStart">地图初始化</el-button>
            </el-form-item>
        </el-form>
    </el-col>
    <!-- 试卷套餐的数据展示 -->
    <el-table :data="examSuiteList" border style="width: 100%" v-loading="examSuiteListLoading">
        <el-table-column prop="entity.id" label="ID" sortable width="100" align="center"></el-table-column>
        <el-table-column prop="entity.name" label="试卷套餐名称" align="center"></el-table-column>
        <el-table-column prop="entity.courseId" label="关联课程ID" align="center"></el-table-column>
        <el-table-column prop="entity.courseName" label="关联课程名称" align="center"></el-table-column>
        <el-table-column prop="entity.status" label="状态" align="center"></el-table-column>
        <el-table-column label="操作">
            <template scope="scope">
                <el-button-group>
                    <el-button type="success" size="small" @click="handleEditExamSuite(scope.row, scope.$index)">编辑</el-button>
                    <el-button type="info" size="small" @click="handleLessonExamSuite(scope.row)">试卷关联</el-button>
                </el-button-group>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-col class='toolbar'>
      <el-pagination style='float: right' @current-change="handleCurrentChange" :current-page.sync="examSuitePage" :page-size="20" layout="total, prev, pager, next" :total="totalCount">
      </el-pagination>
    </el-col>
    <!-- 新增弹窗 -->
    <el-dialog title='新增试卷套餐' :visible.sync="addFormVisible" :close-on-click-modal='false'>
        <el-form :model='examSuite' label-width='100px' ref="examInfo" :rules="examSuiteRules">
            <el-form-item label='套餐名称' prop="name">
                <el-input v-model='examSuite.name' auto-complete='off'></el-input>
            </el-form-item>
            <el-form-item label='关联课程' prop="course_id">
              <el-select v-model="examSuite.course_id" placeholder="请输入课程关键词或ID" style="width:300px;" filterable clearable remote :remote-method="searchCourseFunc">
                <el-option
                  v-for="item in courseOptions"
                  :key="item.id"
                  :label="'（' + item.id + '）' + item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='地图模版Id' prop="map_tem_ins_id">
              <el-select v-model="examSuite.map_tem_ins_id" placeholder="请输入地图模版ID" style="width:300px;" filterable clearable remote :remote-method="searchMapFunc">
                <el-option
                  v-for="item in mapUrlOptions"
                  :key="item.id"
                  :label="'（' + item.id + '）' + item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='是否有效' prop="status">
                <el-radio class="radio" v-model="examSuite.status" label='1'>有效</el-radio>
                <el-radio class="radio" v-model="examSuite.status" label='0'>无效</el-radio>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="addFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="addExamSuite">提交</el-button>
        </div>
    </el-dialog>
    <!-- 编辑弹窗 -->
    <el-dialog title='修改试卷套餐' :visible.sync="editFormVisible" :close-on-click-modal='false'>
        <el-form :model='editExamSuite' label-width='100px' ref="editExamSuite" :rules='examSuiteRules'>
            <el-form-item label='套餐名称' prop="name">
                <el-input v-model='editExamSuite.name' auto-complete='off'></el-input>
            </el-form-item>
            <el-form-item label='关联课程' prop="course_id">
              <el-select v-model="editExamSuite.course_id" placeholder="请输入课程关键词或ID" style="width:300px;" filterable clearable remote :remote-method="searchCourseFunc">
                <el-option
                  v-for="item in courseOptions"
                  :key="item.id"
                  :label="'（' + item.id + '）' + item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='地图模版Id' prop="map_tem_ins_id">
              <el-select v-model="editExamSuite.map_tem_ins_id" placeholder="请输入课程关键词或ID" style="width:300px;" filterable clearable remote :remote-method="searchMapFunc">
                <el-option
                  v-for="item in mapUrlOptions"
                  :key="item.id"
                  :label="'（' + item.id + '）' + item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='是否有效' prop="status">
                <el-radio class="radio" v-model="editExamSuite.status" label='1'>有效</el-radio>
                <el-radio class="radio" v-model="editExamSuite.status" label='0'>无效</el-radio>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="editFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="updateExamSuite">提交</el-button>
        </div>
    </el-dialog>
    <!-- 关联试卷列表弹窗 -->
    <el-dialog title='绑定试卷' :visible.sync="examFormVisible" :close-on-click-modal='false'>
      <el-form label-width="100px">
        <!-- 我是搜索框框 -->
        <el-form-item label="搜素试卷">
          <el-select v-model="examInfoObj" placeholder="请输入试卷关键词或ID" style="width:300px;" filterable clearable remote :remote-method="searchExamFunc">
            <el-option
              v-for="item in examOptions"
              :key="item.id"
              :label="'（' + item.id + '）' + item.name"
              :value="JSON.stringify(item)">
            </el-option>
          </el-select>
          <el-button type="primary" icon="plus" @click='addExamToExamSuiteCard'></el-button>
         </el-form-item>
        <el-form-item label="展示配置">
          <div v-if='examSuiteInfo.examOptions&&examSuiteInfo.examOptions.length'>
              <draggable draggable :list="examSuiteInfo.examOptions">
                <section v-for='(item, index) in examSuiteInfo.examOptions' :key='index' style="display:flex;justify-content:space-between;align-items:center;">
              <span>
                {{ item.id }} : {{ item.name }}
              </span>
              <i class="el-icon-close" @click="deleteItemInQuestions(index)"></i>
            </section>
              </draggable>
          </div>
          <div v-else>
            当前列表为空
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="examFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitExamToSuite" :plain="true">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 地图试卷初始化弹窗 -->
    <el-dialog title='地图试卷初始化' :visible.sync="mapFormVisible" :close-on-click-modal='false'>
        <!-- 地图的表单 -->
        <el-form :model='mapForm' label-width='100px' :label-position="'left'" ref="mapForm" :rules="mapFormRules" class="map-form">
            <el-form-item label='名称' prop="name">
                <el-input v-model='mapForm.name' auto-complete='off' placeholder="请输入要创建的试卷集名称" @keydown.native.prevent.enter></el-input>
            </el-form-item>
            <el-form-item label='关卡数' prop="num">
                <el-radio-group v-model="mapForm.num" @change="changeMapPass()">
                    <el-radio-button :label="3">3关</el-radio-button>
                    <el-radio-button :label="4">4关</el-radio-button>
                    <el-radio-button :label="5">5关</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label='关卡详情'>
                <div v-for="(item, index) in mapForm.num">
                    <el-button type="danger" class="pass-name" @click="configPass(index)">{{ mapForm.name + ' 关卡' + (index + 1) }}</el-button>
                    <div class="subject" v-if="mapForm.pass && mapForm.pass[index] && mapForm.pass[index].length">
                        <div v-for="(tempIns, tempInsIndex) in mapForm.pass[index]" class="pass-container">
                            <el-button icon="circle-close" type="info" @click="passModify(index, tempInsIndex)">{{ tempIns.name }}</el-button>
                        </div>
                    </div>
                </div>
            </el-form-item>
        </el-form>
        <!-- 模板实例 -->
        <div>
            <!-- 模板实例的分页 -->
            <el-col :span="24" class="toolbar" style="padding: 10px;">
                <el-select v-model="currentPass" clearable placeholder="请选择关卡" style="width: 120px;margin-right: 10px;" :disabled="!mapForm.num" @change='configPass'>
                    <el-option
                        v-for="(item, index) in mapForm.num"
                        :key="index"
                        :label="' 关卡' + (index + 1)"
                        :value="index"
                        >
                    </el-option>
                </el-select>
                <el-button type="warning" @click="batchReset" :disabled="this.sels.length===0">重置</el-button>
                <el-button type="info" @click="batchAdd" :disabled="this.sels.length===0">添加</el-button>
            </el-col>
            <!-- 模板实例的表格 -->
            <el-table border :data="tempIns" @selection-change="selsChange" class="temp-ins-table">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="entity.id" label="模板实例 ID" sortable align='center'></el-table-column>
                <el-table-column prop="entity.templateId" label="模板 ID" sortable align='center'></el-table-column>
                <el-table-column prop="entity.name" label="模板实例名称" width='350' show-overflow-tooltip align='center'></el-table-column>
            </el-table>
            <el-col :span="24" class="toolbar" style="padding: 10px">
                <el-pagination @click="123" @current-change="handleCurrentChangeMap" :current-page.sync="current_page_map" :page-size="page_size_map" layout="prev, pager, next, jumper" :total="total_map" style="float: right;"></el-pagination>
            </el-col>
        </div>
        <!-- 弹窗操作按钮 -->
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="mapFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="mapFormSubmit">提交</el-button>
        </div>
    </el-dialog>
  </section>
</template>

<script>
import {
	getExamSuiteList,
	getCourseList,
	addExaminationSuite,
	updateExaminationSuite,
	getLessonList,
	getExamList,
	addExamToSuite,
	getTemplateList,
	getTempInsList,
	initMapExamSuit
} from '../../api/api'
import Vue from 'vue'
import draggable from 'vuedraggable'
export default {
	components: {
		draggable
	},
	data() {
		return {
			//
			activeName: '',
			//查询数据初始化
			filter: {
				id: '',
				course_id: '',
				name: '',
				status: ''
			},
			isValue: [{
					label: '有效',
					value: '1'
				},
				{
					label: '无效',
					value: '0'
				},
			],
			//分页数据
			examSuitePage: 1,
			totalCount: 0,
			//表单验证
			examSuiteRules: {
				name: [{
					required: true,
					message: '请输入试卷名称',
					trigger: 'blur'
				}],
				map_tem_ins_id: [{
					type: 'number',
					required: true,
					message: '请输入试卷标签',
					trigger: 'blur'
				}],
			},
			//试卷套餐列表数据初始化
			examSuiteList: [],
			//弹窗显示状态数据初始化
			addFormVisible: false,
			editFormVisible: false,
			lessonExamFormVisible: false,
			examFormVisible: false,
			examSuiteListLoading: false,
			//试卷套餐数据初始化
			examSuite: {
				name: '',
				course_id: '',
				map_tem_ins_id: '',
				status: '1'
			},
			//修改试卷套餐数据初始化
			editExamSuite: {
				id: '',
				name: '',
				course_id: '',
				map_tem_ins_id: '',
				status: ''
			},
			courseOptions: [],
			//课节的评测套餐
			lessonExamInfo: {
				id: '',
				lesson_id: '',
				exam_ids: ''
			},
			//试卷列表数据初始化
			//试卷列表数据初始化
			lessonList: [],
			//请求地图列表数据初始化
			mapUrlOptions: [],
			mapUrlId: '',
			//绑定试卷列表数据初始化
			examId: '',
			examOptions: [],
			examInfoObj: '',
			examSuiteInfo: {
				examOptions: [],
				id: ''
			},
			// 地图快捷入口相关
			mapFormVisible: false,
			mapForm: {
				name: '',
				num: ''
			},
			mapFormRules: {
				name: [{
					required: true,
					message: '请输入试卷集名称',
					trigger: 'blur'
				}],
				num: [{
					required: true,
					message: '请输入试卷集名称',
					trigger: 'blur'
				}],
			},
			tempIns: [],
			tempInsVisible: false,
			// 多选
			sels: [],
			// 当前需要批量添加模板实例的关卡的下标
			currentPass: '',
			// 分页
			current_page_map: 1,
			page_size_map: 10,
			total_map: 0
		}
	},
	methods: {
		/*
		 *  清除筛选数据
		 */
		handleIconClick_clearId() {
			this.filter.id = '';
		},
		handleIconClick_clearCourseID() {
			this.filter.course_id = '';
		},
		handleIconClick_clearName() {
			this.filter.name = '';
		},
		/*
		    查询数据操作
		*/
		queryExamSuite() {
			this.loadExamSuiteList();
		},
		/*
		    分页操作
		*/
		handleCurrentChange(page) {
			this.loadExamSuiteList(page);
		},
		/*
		    新增handleAddExamSuite操作
		*/
		handleAddExamSuite() {
			this.addFormVisible = true;
			this.examSuite.name = '';
			this.examSuite.course_id = '';
			this.examSuite.map_tem_ins_id = '';
			this.examSuite.status = '1';
		},
		/*
		    获取map模版实例的接口调用
		*/
		searchMapFunc(query) {
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
			getTemplateList(parameter).then(res => {
				if (res.data.success) {
					if (res.data.data.items && res.data.data.items.length) {
						this.mapUrlOptions = res.data.data.items.map(item => {
							let tempObj = {
								id: item.entity.id,
								name: item.entity.name
							}
							return tempObj
						})
					}
				}
			})
		},
		/*
		    新增提交AddExamSuite
		*/
		addExamSuite() {
			this.$refs.examInfo.validate(valid => {
				if (valid) {
					let para = Object.assign({}, this.examSuite);
					para['status'] = Number(para['status']);
					addExaminationSuite(para).then(res => {
							if (res.data.success) {
								this.$notify({
									title: '新增成功',
									message: '新增试卷套餐成功',
									type: 'success'
								});
							} else {
								this.$message.error(res.data.msg || '未知错误，请联系管理员');
							}
							this.loadExamSuiteList(1);
							this.addFormVisible = false;
						})
						.catch(err => {
							this.addFormVisible = false;
							this.errorFunction(err)
						})
				}
			})
		},
		/*
		    编辑examSuite操作
		*/
		handleEditExamSuite(item, index) {
			this.editFormVisible = true;
			this.editExamSuite.id = item.entity.id;
			this.editExamSuite.name = item.entity.name;
			this.editExamSuite.course_id = item.entity.courseId;
			this.editExamSuite.map_tem_ins_id = item.conf.mapTemplateInstanceId;
			this.editExamSuite.status = item.entity.stat + '';
		},
		/*
		    调用编辑试卷套餐接口
		*/
		updateExamSuite() {
			this.$refs.editExamSuite.validate(valid => {
				if (valid) {
					this.$confirm('是否确认修改?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let para = Object.assign({}, this.editExamSuite);
						para['status'] = Number(para['status'])
						updateExaminationSuite(para).then(res => {
								if (res.data.success) {
									this.$notify({
										title: '修改成功',
										message: '修改试卷套餐成功',
										type: 'success'
									});
								} else {
									this.$notify({
										title: '错误',
										message: res.data.msg || '未知错误，请联系管理员',
										type: 'error'
									});
								}
								this.loadExamSuiteList();
								this.editFormVisible = false;
							})
							.catch(err => {
								this.addFormVisible = false;
								this.errorFunction(err)
							})
					}).catch(() => {
						this.editFormVisible = false;
					});

				}
			});
		},
		/*
		    请求数据接口调用
		*/
		loadExamSuiteList(page) {
			this.examSuiteListLoading = true;
			let para = {
				page_index: page,
				page_size: 20,
				id: this.filter.id,
				course_id: this.filter.course_id,
				name: this.filter.name,
				status: this.filter.status ? Number(this.filter.status) : ''
			}
			getExamSuiteList(para).then(res => {
					if (res.data.success) {
						this.examSuiteList = res.data.data.items;
						this.totalCount = res.data.data.totalCount;
						this.examSuitePage = res.data.data.page;
						if (this.examSuiteList && this.examSuiteList.length) {
							this.examSuiteList.map(item => {
								item.entity.status = item.entity.stat == 1 ? '有效' : '无效'
							})
						}
					} else {
						this.$message.error(res.data.msg || '未知错误，请联系管理员');
					}
					this.examSuiteListLoading = false;
				})
				.catch(error => {
					this.errorFunction(error);
					this.examSuiteListLoading = false;
				})
		},
		/*
		    选择关联课程接口列表
		*/
		searchCourseFunc(query) {
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
			getCourseList(parameter).then(res => {
				if (res.data.success) {
					if (res.data.data.items && res.data.data.items.length) {
						this.courseOptions = res.data.data.items.map((item) => {
							let tempObj = {
								id: item.entity.id,
								name: item.entity.name,
							}
							return tempObj
						});
					}
				}
			})
		},
		/*
		    课节关联试卷套餐列表
		*/
		handleLessonExamSuite(items) {
			this.examFormVisible = true;
			this.examSuiteInfo.id = items.entity.id
			if (items.conf.examList && items.conf.examList.length) {
				this.examSuiteInfo.examOptions = items.conf.examList.map(item => {
					let itemObj = {
						id: item.entity.id,
						name: item.entity.name
					}
					return itemObj

				})
				// this.examSuiteInfo.examOptions = items.conf.examList
			} else {
				this.examSuiteInfo.examOptions = []
			}
		},
		/*
		    调用试卷列表数据
		*/
		searchExamFunc(query) {
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
			getExamList(parameter).then(res => {
				if (res.data.success) {
					if (res.data.data.items && res.data.data.items.length) {
						this.examOptions = res.data.data.items.map((item) => {
							let tempObj = {
								id: item.entity.id,
								name: item.entity.name,
							}
							return tempObj
						});
					}
				}
			})
		},
		/*
		    试卷集关联试卷
		*/
		addExamToExamSuiteCard() {
			if (this.examInfoObj != '') {
				if (this.examSuiteInfo.examOptions && this.examSuiteInfo.examOptions.length) {
					for (var i = 0; i < this.examSuiteInfo.examOptions.length; i++) {
						if (this.examSuiteInfo.examOptions[i].id == JSON.parse(this.examInfoObj).id) {
							this.$message.error('抱歉，此选项已存在。请重新选择');
							return;
						}
					}
				}
				this.examSuiteInfo.examOptions.push(JSON.parse(this.examInfoObj));
				this.examInfoObj = ''
				this.examOptions = [];
			} else {
				this.$message.error('抱歉，选项为空无法添加');
			}
		},

		/*
		    提交exam集合到examsuite里
		*/
		submitExamToSuite() {
			let exam_arr = [];
			this.examSuiteInfo.examOptions.map(item => {
				exam_arr.push(item.id)
			});
			let para = {
				id: this.examSuiteInfo.id,
				exam_ids: exam_arr.join(',')
			};
			addExamToSuite(para).then(res => {
					if (res.data.success) {
						this.$notify({
							title: '关联成功',
							message: '关联课程成功',
							type: 'success'
						});
					} else {
						this.$message.error(res.data.msg || '未知错误，请联系管理员');
					}
					this.examFormVisible = false;
					this.loadExamSuiteList(1);
				})
				.catch(err => {
					this.examFormVisible = false;
					this.errorFunction(err)
				})
		},
		/*
		    从试卷card里面删除exam
		*/
		deleteItemInQuestions(index) {
			this.$delete(this.examSuiteInfo.examOptions, index);
		},
		//errorFunction
		errorFunction(error) {
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
		},
		/*
		    做作业地图快捷初始化
		 */
		quickStart() {
			this.mapFormVisible = true
			let para = {
				page_size: this.page_size_map,
				page_index: this.current_page_map
			}
			this.loadTempInsList(para)
		},
		/*
		    加载模板实例列表
		 */
		loadTempInsList(para) {
			getTempInsList(para)
				.then((res) => {
					if (res.data.success) {
						this.tempIns = res.data.data.items
						this.total_map = res.data.data.totalCount
					} else {
						this.$message.error(res.data.msg || '未知错误，请联系管理员');
					}
				})
				.catch(error => {
					this.errorFunction(error);
				})
		},
		/*
		    初始化地图试卷集弹框中的模板实例分页请求
		 */
		handleCurrentChangeMap(val) {
			this.current_page_map = val
			this.loadTempInsList({
				page_size: this.page_size_map,
				page_index: this.current_page_map
			})
		},
		/*
		    多选
		 */
		selsChange(sels) {
			this.$set(this, 'sels', sels)
		},
		/*
		    批量添加到当前关卡
		 */
		batchAdd() {
			if (this.currentPass === '') {
				this.$message.error('请先选择关卡');
				return false
			}
			let arr = []
			this.sels.map(item => {
				let temp = {
					id: item.entity.id,
					name: item.entity.name
				}
				arr.push(temp)
			})
			this.$set(this.mapForm.pass, this.currentPass, arr)
			console.log(this.mapForm);
			this.batchReset()
		},
		/*
		    批量重置
		 */
		batchReset() {
			let para = {
				page_size: this.page_size_map,
				page_index: this.current_page_map
			}
			this.loadTempInsList(para)
		},
		/*
		    配置当前关卡
		 */
		configPass(vals) {
			this.currentPass = vals
		},
		/*
		    修改当前关卡
		 */
		passModify(index, tempInsIndex) {
			console.log(index);
			console.log(tempInsIndex);
			console.log(this.mapForm.pass[index]);
			this.mapForm.pass[index].splice(tempInsIndex, 1)
		},
		/*
            改变单选框的时候 要相应的改变mapForm里面的数据结构
		 */
		changeMapPass() {
			this.$set(this.mapForm, 'pass', {})
			for (let i = 0; i < this.mapForm.num; i++) {
				this.$set(this.mapForm.pass, i, {})
			}
		},
		/*
		    地图快捷入口提交
		 */
		mapFormSubmit() {
			let para = {
				name: this.mapForm.name,
				status: 1
			}

			let array = []
			for (let i = 0; i < this.mapForm.num; i++) {
				let temp = {}
				temp[this.mapForm.name + ' 关卡' + (i + 1)] = this.mapForm.pass[i]
				array.push(temp)
			}
			para['init_template'] = JSON.stringify(array)

			console.log(para);

			// 如果是本地或者测试 地图实例的id为2 否则为95
			if (window.location.host == 'op.babyfs.cn') {
                para['map_tem_ins_id'] = 95
			} else {
                para['map_tem_ins_id'] = 2
			}
            console.log(window.location.host);
			initMapExamSuit(para)
				.then(res => {
					console.log(res);
					if (res.data.success) {
						this.$notify({
							type: 'success',
							title: '成功',
							message: '初始化成功'
						})
						this.$set(this, 'mapForm', {
							name: '',
							num: ''
						})
						this.mapFormVisible = false
						this.loadExamSuiteList()
					} else {
						this.$notify({
							title: '错误',
							message: res.data.msg || '未知错误，请联系管理员',
							type: 'error'
						});
					}
				})
				.catch(error => {
					this.errorFunction(error);
				})
		}
	},
	mounted() {
		this.loadExamSuiteList();
	}
}
</script>

<style lang="less" scope>
.lessonList {
    line-height: 40px;
    font-size: 16px;
    p {
        span {
            &:first-of-type {
                margin-right: 20px;
                display: inline-block;
                width: 30px;
            }
            &:nth-of-type(2) {
                display: inline-block;
                width: 160px;
                margin-right: 50px;
            }
        }
    }
}
.temp-ins-table {
    margin-bottom: 30px;
}
.pass-container {
    display: inline-block;
    margin: 0 10px 5px 0;
}
.pass-name {
    margin: 10px 0;
}
.subject {
    margin: 15px 0;
}
</style>
