<template lang="html">
    <section>
        <el-row>
            <el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
                <el-form :inline='true' :model='filters'>
                    <el-form-item>
                        <el-input v-model="filters.id" placeholder="请输入id" clearable icon="circle-cross" :on-icon-click="handleIconClick_clearId"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="filters.noticeName" placeholder="请输入消息名称" clearable icon="circle-cross" :on-icon-click="handleIconClick_clearNoticeName"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="filters.opUserDisplayName" placeholder="请输入班主任名称" clearable icon="circle-cross" :on-icon-click="handleIconClick_clearOpUser"></el-input>
                    </el-form-item>
                    <!-- <el-form-item>
                        <el-input v-model="filters.noticeTitle" placeholder="请输入推送标题" clearable icon="circle-cross" :on-icon-click="handleIconClick_clearNoticeTitle"></el-input>
                    </el-form-item> -->
                    <el-form-item>
                        <el-select v-model="filters.validateState" placeholder="请选择" @change='loadData' clearable>
                            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item>
                        <el-select v-model="groupFilters.planId" placeholder="请输入计划名称或者id" filterable remote :remote-method="selectPlanRemoteMethod" :loading='selectPlanLoading' style="width:250px;" @change='chooseGroup'>
                            <el-option v-for="item in planOptions" :key="item.id" :label="'（' + item.id + '）' + item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item>
                        <el-button type='primary' @click='loadData'>查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-dropdown split-button type="primary" @command="handleAddForm">
                            新增消息
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="1">自定义消息</el-dropdown-item>
                                <el-dropdown-item command="2">外链消息</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <!-- 消息列表 -->
        <el-table border :data="allData" highlight-current-row v-loading="initLoading" style="width: 100%;">
            <el-table-column prop="entity.id" label="ID" width="80" align='center'></el-table-column>
            <el-table-column prop="entity.name" label="名称" align='center'></el-table-column>
            <el-table-column prop="entity.backendUserName" label="班主任" align='center'></el-table-column>
            <el-table-column prop="entity.pushTitle" label="push标题" align='center'></el-table-column>
            <el-table-column prop="entity.validateState" label="审核状态" align='center' :formatter='validateStatus'></el-table-column>
            <el-table-column prop="entity.ct" label="创建时间" align='center' :formatter='timeFormat'></el-table-column>
            <el-table-column prop="entity.ut" label="更新时间" align='center' :formatter='timeFormat'></el-table-column>
            <!-- <el-table-column prop="entity.stat" label="状态" align='center' :formatter='formatStatus'></el-table-column> -->
            <el-table-column label="操作" width="280" align="left">
				<template scope="scope">
                    <el-button type='success' @click="handleDetail(scope.row)" size='small'>详情</el-button>
                    <el-button type='info' @click="sendMsg(scope.row)" size='small' v-if='scope.row.entity.validateState == 3'>发送</el-button>
                    <el-button type='warning' @click="upVaildate(scope.row)" size='small' v-if='scope.row.entity.validateState == 0 || scope.row.entity.validateState == 2'>提审</el-button>
                    <el-button type='warning' @click="upVaildate(scope.row)" size='small' v-if='scope.row.entity.validateState == 1'>撤审</el-button>
                    <el-button type='danger' @click="vaildateMsg(scope.row)" size='small' v-if='scope.row.entity.validateState == 1'>审核</el-button>
				</template>
			</el-table-column>
        </el-table>
        <!-- 发送消息弹窗 -->
        <el-dialog title='发送消息' :visible.sync="sendFormVisible" :close-on-click-modal='false'>
            <el-form :model='sendMsgObj' label-width='100px' ref="sendMsgObj" :rules='sendMsgObjRules'>
                <el-form-item label='选择用户' prop="groupTeacherId">
                    <el-select v-model="sendMsgObj.groupObj" placeholder="请选择" clearable @change='clearGroupStatus'>
                        <el-option v-for="item in appUserList" :key="item.groupTeacherId" :label="item.userName + '(' +  item.mobile + ')' " :value="JSON.stringify(item)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label='选定班级' prop='rangeType'>
                    <el-radio-group v-model="sendMsgObj.rangeType">
                        <el-radio :label="0">全部范围</el-radio>
                        <el-radio :label="1">指定范围</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label='选择群组' prop="groupIds" v-if='sendMsgObj.groupTeacherId && sendMsgObj.rangeType == 1'>
					<el-input v-model='sendMsgObj.groupIds' auto-complete='off' @focus="chooseGroup" style="width:200px">
                    </el-input>
                    <template>
                        <el-button type="info" size='small' @click.native="showGroupIds" v-if='this.sendMsgObj.groupIds'>显示已选群组</el-button>
                    </template>
	            </el-form-item>
                <el-form-item label='发送类型' prop='noticeType'>
                    <el-radio-group v-model="sendMsgObj.noticeType">
                        <el-radio :label="0">立即</el-radio>
                        <el-radio :label="1">定时</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label='发送时间' prop='sendTime' v-if='sendMsgObj.noticeType == 1'>
                    <el-date-picker v-model="sendMsgObj.sendTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="sendFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="confirmSendMsg">发送</el-button>
            </div>
        </el-dialog>
        <!-- 审核 -->
        <el-dialog title='审核' :visible.sync="vaildateDialog" :close-on-click-modal='false'>
            <el-radio-group v-model="vaildateStatus">
                <el-radio :label="3">审核通过</el-radio>
                <el-radio :label="2">审核不通过</el-radio>
            </el-radio-group>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="vaildateDialog = false">取消</el-button>
                <el-button type="primary" @click.native="submitVaildateMsg">审核</el-button>
            </div>
        </el-dialog>
        <!-- 选择群组弹窗 -->
        <el-dialog title='选择群组' v-model='groupChooseFrom' :close-on-click-modal='false' size='large'>
            <el-row>
                <el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
                    <el-form :inline='true' :model='groupFilters'>
                        <el-form-item>
                            <el-input v-model="groupFilters.groupName" placeholder="请输入班级名称" clearable></el-input>
                        </el-form-item>
                        <el-form-item>
            				<el-select v-model="groupFilters.planId" placeholder="请输入计划名称或者id" filterable remote :remote-method="selectPlanRemoteMethod" :loading='selectPlanLoading' style="width:250px;" @change='chooseGroup'>
            					<el-option v-for="item in planOptions" :key="item.id" :label="'（' + item.id + '）' + item.name" :value="item.id">
            					</el-option>
            				</el-select>
            			</el-form-item>
                        <el-form-item>
                            <el-button type='primary' @click='chooseGroup'>查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <!-- 群组数据 -->
            <el-table :data="groupList" border style="width: 100%" v-loading="groupListLoading"  @selection-change="handleSelectionChange"  height="800">
                <el-table-column type="selection" width="55" :selectable='selectable'></el-table-column>
                <el-table-column prop="id" label="班级ID" align="center" :formatter='returnVal' width="100">
				</el-table-column>
                <el-table-column prop="name" label="班级名称" align="center" :formatter='returnVal'>
				</el-table-column>
                <el-table-column prop="planName" label="计划名称" align="center" :formatter='returnVal'>
				</el-table-column>
                <el-table-column prop="startTime" label="计划开始时间" align="center" :formatter='timeFormatType'>
				</el-table-column>
                <el-table-column prop="endTime" label="计划结束时间" align="center" :formatter='timeFormatType'>
				</el-table-column>
			</el-table>
			<el-col class='toolbar'>
			 	<el-pagination style='float: right' @current-change="handleCurrentGroupChange" :current-page.sync="groupPageIndex" :page-size="20"  layout="total, prev, pager, next" :total="groupListLength">
				</el-pagination>
	        </el-col>
            <div slot="footer" class="dialog-footer">
                <el-button type="info" @click.native="addGroups">批量添加</el-button>
                <el-button type="primary" @click.native="groupChooseFrom = false">关闭</el-button>
            </div>
        </el-dialog>
        <!-- 展示群组 -->
        <el-dialog title='选择群组' v-model='groupShowDialog' :close-on-click-modal='false' size='large'>
            <el-table :data="choosedGroupList" border style="width: 100%"  height="800">
                <el-table-column prop="id" label="班级ID" align="center"  width="120">
				</el-table-column>
                <el-table-column prop="name" label="班级名称" align="center">
				</el-table-column>
                <el-table-column prop="planName" label="计划名称" align="center">
				</el-table-column>
                <el-table-column prop="startTime" label="计划开始时间" align="center" :formatter='timeFormatShow'>
				</el-table-column>
                <el-table-column prop="endTime" label="计划结束时间" align="center" :formatter='timeFormatShow'>
				</el-table-column>
                <el-table-column label="操作" width="280" align="left">
    				<template scope="scope">
                        <el-button type='success' @click="handleDeleteGroup(scope.row, scope.index)" size='small'>删除</el-button>
    				</template>
    			</el-table-column>
			</el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="groupShowDialog = false">关闭</el-button>
            </div>
        </el-dialog>
        <!-- 分页 -->
        <el-col class='toolbar'>
          <el-pagination style='float: right' @current-change="handleCurrentChange" :current-page.sync="page_index" :page-size="20" layout="total, prev, pager, next" :total="totalCount">
          </el-pagination>
        </el-col>
    </section>
</template>

<script>
import {
	getGroupNoticeList,
	batchSendGroupMsg,
	groupNoticeValidate,
	groupNoticeSubmitValidate,
	getTeacherGroupList,
	getAppByop,
	getPlanList
} from '../../api/api'
export default {
	data() {
		return {
			allData: [],
			filters: {
				noticeName: '',
				noticeTitle: '',
				id: '',
				validateState: '',
				opUserDisplayName: ''
			},
			initLoading: true,
			statusOptions: [{
					value: 0,
					label: '未提审'
				},
				{
					value: 1,
					label: '审核中'
				},
				{
					value: 2,
					label: '审核失败'
				},
				{
					value: 3,
					label: '审核成功'
				},
			],
			page_index: 1,
			totalCount: 0,
			sendFormVisible: false,
			sendMsgObj: {
				groupIds: '',
				groupNoticeId: '',
				groupTeacherId: '',
				rangeType: 0,
				groupObj: '',
				noticeType: 0,
				sendTime: '',
			},
			msgPriorityOptions: [{
					value: 'High',
					label: '高'
				},
				{
					value: 'Normal',
					label: '正常'
				},
				{
					value: 'Low',
					label: '低'
				},
				{
					value: 'Lowest',
					label: '最低'
				},
			],
			groupChooseFrom: false,
			groupShowDialog: false,
			selectPlanLoading: false,
			sendMsgObjRules: {
				groupTeacherId: [{
					required: true,
					type: 'number',
					message: '请选择用户',
					trigger: 'change'
				}]
			},
			groupList: [],
			groupListLoading: true,
			vaildateDialog: false,
			vaildateStatus: 3,
			msgId: '',
			appUserList: [],
			app_user_id: '',
			groupIdArr: [],
			groupPageIndex: 1,
			groupListLength: 0,
			groupArr: [],
			choosedGroupList: [],
			groupFilters: {
				groupName: '',
				planId: ''
			},
			planOptions: [],
			tempGroupArr: []
		}
	},
	methods: {
		// 清空筛选条件
		handleIconClick_clearId() {
			this.filters.id = ''
			this.loadData();
		},
		handleIconClick_clearNoticeName() {
			this.filters.noticeName = ''
			this.loadData();
		},
		handleIconClick_clearNoticeTitle() {
			this.filters.noticeTitle = ''
			this.loadData();
		},
		handleIconClick_clearOpUser() {
			this.filters.opUserDisplayName = ''
			this.loadData();
		},
		//  加载消息数据列表
		loadData() {
			let para = {
				page_index: this.page_index,
				page_size: 20,
				notice_name: this.filters.noticeName,
				push_title: this.filters.noticeTitle,
				id: this.filters.id,
				validate_state: this.filters.validateState,
				op_user_display_name: this.filters.opUserDisplayName
			}
			getGroupNoticeList(para).then(res => {
					if (res.data.success) {
						this.allData = res.data.data.items;
						this.totalCount = res.data.data.totalCount;
					} else {
						this.$notify({
							title: "错误",
							message: res.data.msg,
							type: "error"
						});
					}
					this.initLoading = false;
				})
				.catch(error => {
					this._catch(error)
				})
		},
		// 新增消息模版弹窗
		handleAddForm(val) {

			if (val == 1) {
				this.$router.push({
					path: '/MsgConfig',
					query: {
						type: 'userDefine'
					}
				})
			} else if (val == 2) {
				this.$router.push({
					path: '/MsgConfig',
					query: {
						type: 'linkType'
					}
				})
			}
		},
		handleDetail(item) {
			this.$router.push({
				path: '/MsgConfig',
				query: {
					msgId: item.entity.id
				}
			})
		},
		// 发送消息
		sendMsg(item) {
			this.sendFormVisible = true;
			this.sendMsgObj = {
				groupIds: '',
				groupNoticeId: item.entity.id,
				groupTeacherId: '',
				appUserId: '',
				groupObj: '',
				rangeType: 0,
				noticeType: 0,
				sendTime: ''
			}
			this.tempGroupArr = [];
			this.groupArr = [];
			getAppByop().then(res => {
					if (res.data.success) {
						if (res.data.data.length > 0) {
							this.appUserList = res.data.data.map(item => {
								var tempObj = {
									appUserId: item.entity.appUserId,
									mobile: item.entity.mobile,
									userName: item.entity.userName,
									groupTeacherId: item.entity.id,
								}
								return tempObj
							})
						} else {
							this.appUserList = []
						}
					} else {
						this.$notify({
							title: "错误",
							message: res.data.msg,
							type: "error"
						});
					}
				})
				.catch(error => {
					this._catch(error);
				})
		},

		// 提审
		upVaildate(item) {
			let para = {
				id: item.entity.id,
				validate_state: item.entity.validateState == 0 ? item.entity.validateState + 1 : item.entity.validateState - 1
			}
			groupNoticeSubmitValidate(para).then(res => {
					if (res.data.success) {
						if (item.entity.validateState == 0) {
							this.$notify({
								title: "成功",
								message: '提审成功',
								type: "success"
							});
						} else {
							this.$notify({
								title: "成功",
								message: '撤审成功',
								type: "success"
							});
						}
						this.loadData();
					} else {
						this.$notify({
							title: "错误",
							message: res.data.msg,
							type: "error"
						});
					}
				})
				.catch(error => {
					this._catch(error)
				})
		},
		// 审核
		vaildateMsg(item) {
			this.vaildateDialog = true;
			this.msgId = item.entity.id;
		},
		// 确认审核
		submitVaildateMsg() {
			let para = {
				id: this.msgId,
				validate_state: this.vaildateStatus
			}
			groupNoticeValidate(para).then(res => {
					if (res.data.success) {
						this.$notify({
							title: "成功",
							message: '提审状态修改成功',
							type: "success"
						});
						this.loadData();
						this.vaildateDialog = false;
					} else {
						this.$notify({
							title: "错误",
							message: res.data.msg,
							type: "error"
						});
					}
				})
				.catch(error => {
					this._catch(error)
				})
		},
		// 选择用户变化后清空筛选值
		clearGroupStatus() {
			if (this.sendMsgObj.groupObj) {
				this.sendMsgObj.appUserId = JSON.parse(this.sendMsgObj.groupObj).appUserId;
				this.sendMsgObj.groupTeacherId = JSON.parse(this.sendMsgObj.groupObj).groupTeacherId;
			}
			this.sendMsgObj.groupIds = ''
			this.groupIdArr = []
			this.groupFilters = {
				planId: '',
				groupName: '',
			}
		},
		// 选择班级列表
		chooseGroup() {
			// this.groupIdArr = []
			this.groupChooseFrom = true;
			let para = {
				group_teacher_id: this.sendMsgObj.groupTeacherId,
				plan_id: this.groupFilters.planId,
				group_name: this.groupFilters.groupName,
				page_index: this.groupPageIndex,
				page_size: 20
			}
			getTeacherGroupList(para).then(res => {
					if (res.data.success) {
						this.groupListLoading = false;
						this.groupList = res.data.data.items
						this.groupListLength = res.data.data.totalCount
						if (this.groupList && this.groupList.length > 0) {
							this.groupList.map(item => {
								let tempObj;
								tempObj = {
									id: item.entity.id,
									name: item.entity.name,
									startTime: item.entity.startTime,
									endTime: item.entity.endTime,
									planName: item.entity.planName
								}
								return tempObj
							})
						}
					} else {
						this.$notify({
							title: "错误",
							message: res.data.msg,
							type: "error"
						});
					}
				})
				.catch(error => {
					this._catch(error)
				})
		},
		// 选择班级
		handleSelectionChange(val) {
			this.tempGroupArr = val;
		},
		// 显示已选择的班级id
		showGroupIds() {
			this.groupShowDialog = true;
			this.choosedGroupList = this.groupArr.map(item => {
				let tempObj;
				tempObj = {
					id: item.entity.id,
					name: item.entity.name,
					startTime: item.entity.startTime,
					endTime: item.entity.endTime,
					planName: item.entity.planName
				}
				return tempObj
			})
		},
		// 添加群组
		addGroups() {
			console.log(this.tempGroupArr)
			if (this.tempGroupArr && this.tempGroupArr.length > 0) {
				this.tempGroupArr.map(item => {
					if (this.groupIdArr && this.groupIdArr.length > 0) {
						if (this.groupIdArr.indexOf(item.entity.id) <= -1) {
							this.groupIdArr.push(item.entity.id)
							this.groupArr.push(item);
						}
					} else {
						this.groupIdArr.push(item.entity.id)
						this.groupArr.push(item);
					}
				})
			}
			this.sendMsgObj.groupIds = this.groupIdArr.join(',')
			this.$notify({
				title: "添加成功",
				message: '如需再添加请继续',
				type: "success"
			});
		},
		// 已选置灰
		selectable(row, index) {
			if (this.groupIdArr.indexOf(row.entity.id) > -1) {
				return false
			} else {
				return true
			}
		},
		// 删除已选的class
		handleDeleteGroup(item, _index) {
			this.choosedGroupList.splice(_index, 1)
			if (this.groupIdArr.length > 0) {
				this.groupIdArr.map((prop, index) => {
					if (item.id == prop) {
						this.groupIdArr.splice(index, 1)
						this.groupArr.splice(index, 1)
					}
				})
			}
			this.sendMsgObj.groupIds = this.groupIdArr.join(',')
		},
		// 选择计划id
		selectPlanRemoteMethod(query) {
			let parameter = {
				plan_name: '',
				id: ''
			}
			let isChinese = /^[\u4e00-\u9fa5]*$/.test(query)
			if (query) {
				if (isChinese) {
					parameter = {
						plan_name: query,
					};
				} else {
					parameter = {
						id: query
					}
				}
			}
			getPlanList(parameter).then(res => {
					if (res.data.success) {
						if (res.data.data.items) {
							this.planOptions = res.data.data.items.map(item => {
								let tempObj = {
									id: item.entity.id,
									name: item.entity.name
								}
								return tempObj
							})
						}
					} else {
						this.$notify({
							title: "错误",
							message: res.data.msg,
							type: "error"
						});
					}
				})
				.catch(error => {
					this._catch(error)
				})
		},
		handleCurrentGroupChange(page) {
			this.groupPageIndex = page
			this.chooseGroup()
		},
		// 发送消息
		confirmSendMsg() {
			this.$confirm('是否确认发送?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$refs.sendMsgObj.validate(valid => {
						if (valid) {
							let para = {
								app_user_id: this.sendMsgObj.appUserId,
								group_ids: this.sendMsgObj.groupIds,
								group_notice_id: this.sendMsgObj.groupNoticeId,
								range_type: this.sendMsgObj.rangeType,
								notice_type: this.sendMsgObj.noticeType,
								send_time: this.sendMsgObj.noticeType == 1 ? new Date(this.sendMsgObj.sendTime).getTime() : ''
								// msg_priority: this.sendMsgObj.msgPriority
							}
							batchSendGroupMsg(para).then(res => {
									if (res.data.success) {
										this.$notify({
											title: "成功",
											message: '发送成功',
											type: "success"
										});
										this.sendFormVisible = false;
									} else {
										this.$notify({
											title: "错误",
											message: res.data.msg,
											type: "error"
										});
									}
								})
								.catch(error => {
									this._catch(error)
								})
						}
					})
				})
				.catch(error => {
					this.$notify({
						title: "取消",
						message: '取消发送',
						type: "error"
					});
				})
		},

		// 分页相关
		handleCurrentChange(page) {
			this.page_index = page;
			this.loadData();
		},
		// 时间转化
		timeFormat(row, col) {

			let property = col.property.split('.')
			let dateVal = row[property[0]][property[1]]

			let Y, M, D, h, m, s;
			if (dateVal != 0) {
				var date = new Date(dateVal)
				Y = date.getFullYear() + '-';
				M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
				D = this.addZeroFunc(date.getDate()) + ' ';
				h = date.getHours() + ':';
				m = this.addZeroFunc(date.getMinutes()) + ':';
				s = this.addZeroFunc(date.getSeconds());
				return Y + M + D + h + m + s;
			} else {
				return '/'
			}
		},
		timeFormatShow(row, col) {
			let property = col.property
			let dateVal = row[property]
			let Y, M, D, h, m, s;
			if (dateVal != 0) {
				var date = new Date(dateVal)
				Y = date.getFullYear() + '-';
				M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
				D = this.addZeroFunc(date.getDate()) + ' ';
				h = date.getHours() + ':';
				m = this.addZeroFunc(date.getMinutes()) + ':';
				s = this.addZeroFunc(date.getSeconds());
				return Y + M + D + h + m + s;
			} else {
				return '/'
			}
		},
		timeFormatType(row, col) {
			let property = col.property
			let dateVal = row['entity'][property]
			let Y, M, D, h, m, s;
			if (dateVal != 0) {
				var date = new Date(dateVal)
				Y = date.getFullYear() + '-';
				M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
				D = this.addZeroFunc(date.getDate()) + ' ';
				h = date.getHours() + ':';
				m = this.addZeroFunc(date.getMinutes()) + ':';
				s = this.addZeroFunc(date.getSeconds());
				return Y + M + D + h + m + s;
			} else {
				return '/'
			}
		},
		returnVal(row, col) {
			let property = col.property
			let val = row['entity'][property]
			return val
		},
		addZeroFunc(val) {
			return val < 10 ? '0' + val : val
		},
		validateStatus(row, col, val) {
			let property = col.property.split('.')
			let dateVal = row[property[0]][property[1]]
			return dateVal == 0 ? '未提审' : (dateVal == 1 ? '审核中' : (dateVal == 2 ? '审核未通过' : '审核通过'))
		},
		formatStatus(row, col, val) {
			let property = col.property.split('.')
			let dateVal = row[property[0]][property[1]]
			return dateVal == 0 ? '无效' : '有效'
		},
		_catch(error) {
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
	},
	mounted() {
		this.loadData();
	}
}
</script>

<style lang="css">
</style>
