<template lang="html">
    <section>

        <!-- 按钮  过滤  工具条-->
        <el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
            <el-form :inline=true :model='filters'>

                <el-form-item>
                    <el-input v-model='filters.id' placeholder='ID' icon="circle-cross" :on-icon-click="handleIconClick_clearId" @keydown.native.prevent.enter='loadList'></el-input>
                </el-form-item>

                <el-form-item>
                    <el-input v-model='filters.name' placeholder='群组名称' icon="circle-cross" :on-icon-click="handleIconClick_clearName" @keydown.native.prevent.enter='loadList'></el-input>
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
        <el-table :data="users" highlight-current-row v-loading="listLoading" style="width: 100%;" border>

            <el-table-column type="expand">
                <template scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">

                        <el-form-item label="群组 ID">
                            <span>{{ props.row.entity.id }}</span>
                        </el-form-item>

                        <el-form-item label="群组名称">
                            <span>{{ props.row.entity.name }}</span>
                        </el-form-item>

                        <el-form-item label="计划 ID">
                            <span>{{ props.row.entity.planId }}</span>
                        </el-form-item>

                        <el-form-item label="计划名称">
                            <span>{{ $route.query.plan_name }}</span>
                        </el-form-item>

                        <!-- <el-form-item label="创建时间">
                            <span>{{ props.row.entity.ct | formatTime }}</span>
                        </el-form-item> -->

                        <el-form-item label="更新时间">
                            <span>{{ props.row.entity.ut | formatTime }}</span>
                        </el-form-item>

                        <el-form-item label="群组描述">
                            <span>{{ props.row.entity.description }}</span>
                        </el-form-item>

                        <el-form-item label="班级二维码">
                            <div class="expandWxCode">
                              <div v-if="props.row.parsed.wxCodeUrl">
                                <span v-if="(props.row.parsed.urlExpireDate - newDate) > 0">
                                  <img class="Code" :src="props.row.parsed.wxCodeUrl" alt="班级二维码">
                                  <p class="date">有效期：<b :style="(props.row.parsed.urlExpireDate - newDate) <= 1 ? 'color: red' : 'color: #000' ">{{ props.row.parsed.urlExpireDate |  formatUrlExpireData }}</b> 天</p>
                                </span>
                                <span v-else>二维码已失效</span>
                              </div>
                              <div v-else>暂未上传二维码</div>
                            </div>
                        </el-form-item>

                        <el-form-item label="备注信息">
                            <span>{{ props.row.entity.remark }}</span>
                        </el-form-item>



                    </el-form>
                </template>
            </el-table-column>

            <el-table-column prop="entity.id" label="ID" width="75" sortable align='center'></el-table-column>

            <el-table-column prop="parsed.regionName" label="群组区域" v-if="$route.query.brvbar_type === '1'"></el-table-column>

			<el-table-column prop="entity.name" label="群组名称"></el-table-column>

			<el-table-column prop="entity.description" label="群组描述" show-overflow-tooltip></el-table-column>

			<el-table-column prop="entity.stat" label="状态" :formatter='formatStat' width='70'></el-table-column>

			<el-table-column label="操作" width="290" align="center">
				<template scope="scope">
                    <el-button-group>
                        <el-button type="success" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="info" size="small" @click="enterInGroupMemberList(scope.$index, scope.row)">成员详情</el-button>
                        <!-- <el-button type="warning" size="small" @click="sendMessage(scope.$index, scope.row)">发送消息</el-button> -->
                        <el-button type="warning" size="small" @click="openClass(scope.$index, scope.row)">创建班级</el-button>
                        <el-button v-if="isAddingToGroup" type="success" size="small" @click="handleAddToGroup(scope.$index, scope.row)">添加确认</el-button>
                    </el-button-group>
				</template>
			</el-table-column>

		</el-table>

        <!-- 新增界面 -->
        <el-dialog title='新增' v-model='addFormVisible' :close-on-click-modal='false'>

            <el-form :model='addForm' label-width='100px' :rules='addFormRules' ref='addForm'>

                <el-form-item label='班级名称' prop='group_name'>
                    <el-input v-model='addForm.group_name'></el-input>
                </el-form-item>

                <el-form-item label='群组描述' prop='group_desc'>
                    <el-input type="textarea" v-model='addForm.group_desc'></el-input>
                </el-form-item>

                <el-form-item label='备注信息' prop='remark'>
                    <el-input type="textarea" v-model='addForm.remark'></el-input>
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

                <el-form-item label='班级区域' v-if="editForm.regionName && $route.query.brvbar_type">
                    <el-input v-model='editForm.regionName' auto-complete='off' :disabled="true"></el-input>
                </el-form-item>

                <el-form-item label='班级名称' prop='name'>
                    <el-input v-model='editForm.name' auto-complete='off'></el-input>
                </el-form-item>

                <el-form-item label='班级描述' prop='description'>
                    <el-input type="textarea" v-model='editForm.description' auto-complete='off'></el-input>
                </el-form-item>

                <el-form-item label='备注信息' prop='remark'>
                    <el-input type="textarea" v-model='editForm.remark' auto-complete='off'></el-input>
                </el-form-item>

                <el-form-item label="状态" prop='stat'>
                    <el-radio-group v-model="editForm.stat">
                        <el-radio class="radio" :label="1">有效</el-radio>
                        <el-radio class="radio" :label="0">无效</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label='上传二维码' prop='remark'>
                    <el-upload
                        class="upload-demo"
                        ref='upload'
                        name="bin"
                        action="/op/material/upload_image"
                        :on-success="handleSuccess"
                        :on-progress="handleProgress"
                        :show-file-list="false"
                    >
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>

                <el-form-item label='二维码'>
                  <div class="wxCodeUrl" v-loading.body="wxCodeUrlLoading"><img :src="editForm.wx_code_url" alt=""></div>
                </el-form-item>

                <el-form-item label='入群期限'>
                  <el-date-picker
                    v-model="editForm.enterRange"
                    type="daterange"
                    placeholder="选择日期范围">
                  </el-date-picker>
                </el-form-item>

                <el-form-item label='小秘书微信' prop='wx_id'>
                    <el-input v-model='editForm.wx_id' auto-complete='off'></el-input>
                </el-form-item>

                <!-- 选择班长 -->
                <el-form-item label="选择班委">
                  <el-select v-model="checkedMemberFlag" placeholder="请选择" style="width:110px;">
                    <el-option key="1" label="选择班长" value="1"></el-option>
                    <el-option key="2" label="选择学委" value="2"></el-option>
                  </el-select>
                  <el-select v-model="checkedMonitors" placeholder="请输入学员用户名或手机号" style="margin:0 15px 10px 0;width:300px;" filterable clearable remote :remote-method="selectMembersMethod" :loading='selectMembersLoading'>
      						    <el-option
      						      v-for="item in Members"
      						      :key="item"
      						      :label="'（' + item.id + '）' + item.name + ' --> ' +  item.mobile"
      						      :value="item">
      						    </el-option>
      						</el-select>
                  <el-button type="primary" icon='plus' :plain="true" @click="addMonitorOrCommittee"></el-button>
    	  		    </el-form-item>

                <!-- 已选班长 -->
                <el-form-item label="已选班长">
                  <div v-if="editForm.monitor_ids && editForm.monitor_ids.length">
                    <el-tag
                      v-for="(monitor, index) in editForm.monitor_ids"
                      :key="monitor.id"
                      :closable="true"
                      :hit="true"
                      type='primary'
                      style="margin-right:10px;"
                      @close="handleClose(editForm.monitor_ids, index)"
                      >
                    {{ monitor.name }}({{ monitor.mobile }})
                    </el-tag>
                  </div>

                  <div v-else>
                    当前班级未选班长
                  </div>
    	  		    </el-form-item>

                <!-- 已选学委 -->
                <el-form-item label="已选学委">
                  <div v-if="editForm.committee_ids && editForm.committee_ids.length">
                    <el-tag
                      v-for="(committee, index) in editForm.committee_ids"
                      :key="committee.id"
                      :closable="true"
                      :hit="true"
                      style="margin-right:10px;"
                      type="warning"
                      @close="handleClose(editForm.committee_ids, index)"
                      >
                    {{ committee.name }}({{ committee.mobile }})
                    </el-tag>
                  </div>

                  <div v-else>
                    当前班级未选班委
                  </div>
    	  		    </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>

        </el-dialog>

        <!-- 分页条 批量删除 -->
        <el-col :span='24' class='toolbar'>
            <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size=limit :total=totalCount style='float: right'></el-pagination>
        </el-col>

    </section>
</template>

<script>
// 引入axios实例
import {
	getGroupsListForPlan,
	addGroupForPlan,
	editGroupForPlan,
	getMembersListForGroup,
	getMemberForGroup,
	geUsersById,
	batchAddMembersForGroup,
	sendTmplateMsg,
	openClass,
	getAppuserList
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
			page: 1,
			limit: 1,
			/*
			    list
			 */
			users: [
				// {
				//     id: '1',
				//     name: '小王',
				//     stat: 0,
				// },
			],
			listLoading: false,
			/*
			    新增群组
			 */
			addFormVisible: false, //新增界面是否显示
			addLoading: false, //新增界面是否显示加载
			addFormRules: { //新增界面表单规则
				group_name: [{
					required: true,
					message: '请输入群组名称',
					trigger: 'blur'
				}],
				group_desc: [{
					required: true,
					message: '请输入群组描述',
					trigger: 'blur'
				}],
				remark: [{
					required: false,
					message: '请输入备注信息',
					trigger: 'blur'
				}],
				status: [{
					required: true,
					message: '请选择状态'
				}]
			},
			addForm: { //新增界面表单数据类型
				group_name: '',
				group_desc: '',
				remark: '',
				status: 1
			},
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
				wx_id: [{
					required: true,
					message: '请输入小秘书微信号',
					trigger: 'blur'
				}],
			},
			editForm: {
				// id: 0,
				// name: '',
				// remark: '',
				// stat: 1
			},
			// 上传二维码
			wxCodeUrlLoading: false,
			// 选择班长与学委
			checkedMemberFlag: '1', // 判断是选择 班长还是选择学委
			Members: [], // 班级成员列表
			checkedMonitors: '', // 选择的班长
			checkedCommittees: '', // 选择的学委
			selectMembersLoading: false,

			newDate: Number(util.formatDate.format(new Date(), "yyyyMMdd"))
		}
	},
	filters: {
		// 列表 formatTime 转换具体时间
		formatTime(date) {
			if (date == 0) {
				return '未更新'
			} else {
				return util.formatDate.format(new Date(date), 'yyyy/MM/dd   hh:mm:ss');
			}
		},
		formatUrlExpireData(row) {
			let newDate = Number(util.formatDate.format(new Date(), "yyyyMMdd"))
			return row - newDate
		}
	},
	methods: {
		catchFunc(error) {
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
		},
		//ToolBar
		// 点击input后面的icon 清除内容
		handleIconClick_clearId() {
			this.filters.id = '';
		},
		handleIconClick_clearName() {
			this.filters.name = '';
		},
		loadList() {
			let para = {
				plan_id: this.$route.query.plan_id,
				page_index: this.page,
				id: this.filters.id,
				group_name: this.filters.name
			};
			this.listLoading = true;
			getGroupsListForPlan(para).then((res) => {
				if (res.data.success) {
					this.totalCount = res.data.data.totalCount;
					this.limit = res.data.data.limit;
					this.users = res.data.data.items;
				} else {
					this.users = [];
				}
				this.listLoading = false;
			});
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
		// 显示群组详情
		enterInGroupMemberList(index, row) {
			this.$router.push({
				path: '/planMembersList',
				query: {
					group_id: row.entity.id,
                    brvbar_type: this.$route.query.brvbar_type
				}
			})
		},
		sendMessage(index, row) {
			this.$confirm('此操作将发送模板消息给当前群组下所有成员, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				})
				.then(() => {

					sendTmplateMsg({
							group_id: row.entity.id
						})
						.then((res) => {
							this.$message({
								type: 'success',
								message: '发送成功!'
							});
						}).catch((error) => {
							this.catchFunc(error)
						});
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消发送'
					});
				});


		},
		openClass(index, row) {
			this.$confirm('此操作将创建班级, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				})
				.then(() => {

					openClass({
							group_id: row.entity.id
						})
						.then((res) => {
							this.$message({
								type: 'success',
								message: '发送成功!'
							});
						}).catch((error) => {
							this.catchFunc(error)
						});
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消发送'
					});
				});
		},
		// 新增页面
		//显示新增界面
		handleAdd() {
			this.addFormVisible = true;
			this.addForm = {
				group_name: '',
				group_desc: '',
				remark: '',
				status: 1
			}
		},
		//新增提交
		addSubmit() {
			this.$refs.addForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {
						type: 'warning'
					}).then(() => {
						this.addLoading = true;
						let para = Object.assign({}, this.addForm);
						para['plan_id'] = this.$route.query.plan_id;
						addGroupForPlan(para).then((res) => {
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
									title: '失败',
									message: res.data.msg,
									type: 'error'
								})
							}
						}).catch(() => {
							this.$message({
								type: 'info',
								message: '取消输入'
							});
						});
					});
				}
			});
		},
		// 显示编辑界面
		handleEdit(index, row) {
			this.editFormVisible = true;
			this.editForm = Object.assign({}, row.entity);
			this.$set(this.editForm, 'wx_code_url', row.parsed.wxCodeUrl)
			this.$set(this.editForm, 'wx_id', row.parsed.wxId)
			this.$set(this.editForm, 'enterRange', [])
			this.$set(this.editForm.enterRange, 0, row.parsed.startTime ? new Date(row.parsed.startTime) : '')
			this.$set(this.editForm.enterRange, 1, row.parsed.endTime ? new Date(row.parsed.endTime) : '')

			this.$set(this.editForm, 'regionName', row.parsed.regionName)
			// 加载班长与班委
			let monitorIds = row.parsed.monitorIds ? row.parsed.monitorIds.toString() : '',
				committeeIds = row.parsed.committeeIds ? row.parsed.committeeIds.toString() : ''
			// 判断是否有班长。若不为空则加载用户
			if (row.parsed.monitorIds && row.parsed.monitorIds.length) {
				geUsersById({
						user_ids: monitorIds
					})
					.then((res) => {
						if (res.data.success) {
							this.$set(this.editForm, 'monitor_ids', res.data.data.map((item) => {
								return {
									id: item.id,
									name: item.name,
									mobile: item.mobile
								}
							}))
						} else {
							this.$notify.error(res.data.msg);
						}
					})
					.catch((error) => {
						this.catchFunc(error)
					})
			}
			// 判断是否有学委。若不为空则加载用户
			if (row.parsed.committeeIds && row.parsed.committeeIds.length) {
				geUsersById({
						user_ids: committeeIds
					})
					.then((res) => {
						if (res.data.success) {
							this.$set(this.editForm, 'committee_ids', res.data.data.map((item) => {
								return {
									id: item.id,
									name: item.name,
									mobile: item.mobile
								}
							}))
						} else {
							this.$notify.error(res.data.msg);
						}
					})
					.catch((error) => {
						this.catchFunc(error)
					})
			}
		},
		// 二维码图片的上传 ——> 成功
		handleSuccess(response, file) {
			if (response.success) {
				this.$set(this.editForm, 'wx_code_url', response.data)
			} else {
				this.$notify({
					title: '错误',
					message: response.msg,
					type: 'error'
				})
			}
			this.wxCodeUrlLoading = false
		},
		// 二维码图片的上传 ——> 上传中 加载按钮
		handleProgress() {
			this.wxCodeUrlLoading = true
		},
		selectMembersMethod(query) {
			if (this.checkedMemberFlag == 2) {
				if (query !== '') {
					let temp = Number(query);
					let parameter = {
						group_id: this.editForm.id
					};
					if (temp) {
						parameter['phone'] = temp
					} else {
						parameter['name'] = query
					};
					this.selectMembersLoading = true;
					getMemberForGroup(parameter).then((res) => {
							if (res.data.success) {
								this.Members = res.data.data.map((item) => {
									let tempObj = {
										id: item.id,
										name: item.name,
										mobile: item.mobile
									}
									return tempObj
								});
							} else {
								// this.$notify.error(res.data.msg);
							}
							this.selectMembersLoading = false;
						})
						.catch((error) => {
							this.catchFunc(error)
						})
				} else {
					this.Members = [];
				}
			} else if (this.checkedMemberFlag == 1) {
				if (query !== '') {
					let temp = Number(query);
					let parameter = {
						group_id: this.editForm.id
					};
					if (temp) {
						parameter['mobile'] = temp
					} else {
						parameter['username'] = query
					};
					this.selectMembersLoading = true;
					getAppuserList(parameter).then((res) => {
							if (res.data.success) {
								this.Members = res.data.data.items.map((item) => {
									let tempObj = {
										id: item.id,
										name: item.name,
										mobile: item.mobile
									}
									return tempObj
								});
							} else {
								// this.$notify.error(res.data.msg);
							}
							this.selectMembersLoading = false;
						})
						.catch((error) => {
							this.catchFunc(error)
						})
				} else {
					this.Members = [];
				}
			}

		},
		/*
		  添加班长或学委
		*/
		addMonitorOrCommittee() {
			let flag = true
			if (!this.checkedMonitors) {
				this.$message({
					title: '错误',
					message: '请查看是否有错误选项或重复项',
					type: 'error'
				})
				return
			}
			if (this.editForm.monitor_ids && this.editForm.monitor_ids.length) {
				this.editForm.monitor_ids.forEach((item) => {
					if (item.id == this.checkedMonitors.id) {
						flag = false
					}
				})
			} else {
				this.$set(this.editForm, 'monitor_ids', [])
			}
			if (this.editForm.committee_ids && this.editForm.committee_ids.length) {
				this.editForm.committee_ids.forEach((item) => {
					if (item.id == this.checkedMonitors.id) {
						flag = false
					}
				})
			} else {
				this.$set(this.editForm, 'committee_ids', [])
			}
			if (this.checkedMemberFlag == 1 && flag) {
				this.editForm.monitor_ids.push(this.checkedMonitors)
			} else if (this.checkedMemberFlag == 2 && flag) {
				this.editForm.committee_ids.push(this.checkedMonitors)
			} else {
				this.$message({
					title: '错误',
					message: '请查看是否有错误选项或重复项',
					type: 'error'
				})
			}
		},
		/*
		  删除 已添加的班委
		*/
		handleClose(total, index) {
			total.splice(index, 1);
		},
		/*
		   编辑页面提交
		*/
		editSubmit() {
			this.$refs.editForm.validate((valid) => {
				if (valid) {
					// 判断有效期是否为空
					if (this.editForm.enterRange === undefined || this.editForm.enterRange[0] === null || this.editForm.enterRange[1] === null) {
						this.$notify({
							title: '错误',
							message: '有效期不能为空',
							type: 'error'
						})
						return false;
					}
					this.$confirm('确认提交吗?', '提示', {}).then(() => {
						this.editLoading = true;
						let monitor_ids = '',
							committee_ids = ''
						if (this.editForm.monitor_ids && this.editForm.monitor_ids.length) {
							monitor_ids = this.editForm.monitor_ids.map(item => item.id).toString();
						}
						if (this.editForm.committee_ids && this.editForm.committee_ids.length) {
							committee_ids = this.editForm.committee_ids.map(item => item.id).toString();
						}
						let para = Object.assign({}, this.editForm);

						// 将para中的某些属性替换
						para['plan_id'] = para['planId'];
						para['group_id'] = para['id'];
						para['group_name'] = para['name'];
						para['group_desc'] = para['description'];
						para['status'] = para['stat'];
						para['monitor_ids'] = monitor_ids
						para['committee_ids'] = committee_ids
						para['start_time'] = Date.parse(this.editForm.enterRange[0])
						para['end_time'] = Date.parse(this.editForm.enterRange[1])

						delete para['planId'];
						delete para['id'];
						delete para['name'];
						delete para['description'];
						delete para['stat'];
						delete para['enterRange'];

						editGroupForPlan(para).then((res) => {
							this.editLoading = false;
							if (res.data.success) {
								this.$notify({
									title: '成功',
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.loadList();
							} else {
								this.$notify({
									title: '失败',
									message: res.data.msg,
									type: 'error'
								})
							}
						})
					}).catch(() => {});
				}
			})
		},
		// 添加群组确认
		handleAddToGroup(index, row) {
			let para = Object.assign({}, this.$route.query);
			para['group_id'] = row.entity.id;
			var plan_id = this.$route.query.plan_id;
			batchAddMembersForGroup(para).then((res) => {
				if (res.data.success) {
					this.$notify({
						title: '成功',
						type: 'success',
						message: '添加成功'
					});
					// 保证回退不再显示之前的各种跳转  可能还有优化的空间
					this.$router.replace({
						path: '/planGroupsList',
						query: plan_id
					})
				} else {
					this.$notify({
						title: '失败',
						message: res.data.msg,
						type: 'error'
					})
				}
			})
		}
	},
	computed: {
		isAddingToGroup() {
			if (this.$route.query['user_ids']) {
				return true;
			} else {
				return false;
			}
		}
	},
	mounted() {
		this.loadList();
	}
}
</script>

<style lang="less">
.wxCodeUrl {
    width: 100px;
    img {
        width: 100%;
    }
}
.expandWxCode {
    .Code {
        width: 70px;
        float: left;
    }
    .date {
        float: left;
        height: 70px;
        line-height: 70px;
        margin-left: 20px;
    }
}
</style>
