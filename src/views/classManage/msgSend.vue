<template lang="html">
    <section>
        <el-row>
            <el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
                <el-form :inline='true' :model='filters'>
                    <el-form-item>
                        <el-input v-model="filters.op_user_display_name" placeholder="请输入班主任" clearable icon="circle-cross" :on-icon-click="handleIconClick_clearOpUser"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker v-model="filters.timeRange" type="datetimerange" placeholder="选择时间范围" @change='loadData'></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="filters.sendStat" placeholder="请选择发送状态" @change='loadData' clearable>
                            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type='primary' @click='loadData'>查询</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <!-- 数据表格 -->
        <el-table border :data="allData" highlight-current-row v-loading="initLoading" style="width: 100%;">
            <el-table-column prop="entity.id" label="ID" width="80" align='center'></el-table-column>
            <el-table-column prop="entity.groupNoticeId" label="消息Id" align='center' width="100"></el-table-column>
            <el-table-column prop="entity.groupNoticeName" label="消息名称"  align='center'></el-table-column>
            <el-table-column prop="entity.backendUserName" label="班主任"  align='center'></el-table-column>
            <el-table-column prop="entity.pushStat" label="是否push"  align='center' :formatter='formatPushStat'></el-table-column>
            <el-table-column prop="entity.sendStat" label="发送状态" align='center' :formatter='formatSendStat'></el-table-column>
            <el-table-column prop="entity.rangeType" label="发送班级" align='center' :formatter='formatStatus'></el-table-column>
            <el-table-column prop="entity.sendTime" label="发送时间" align='center' :formatter='timeFormat'></el-table-column>
            <el-table-column label="操作" width="230" align="center">
				<template scope="scope">
                    <el-button type='success' @click="handleDetail(scope.row)" size='small'>详情</el-button>
                    <el-button type='info' @click="showChooseGroup(scope.row)" size='small'>选中班级</el-button>
				</template>
			</el-table-column>
        </el-table>
        <!-- 展示群组 -->
        <el-dialog title='选择群组' v-model='groupShowDialog' :close-on-click-modal='false' size='large'>
            <el-table :data="choosedGroupList" border style="width: 100%"  height="800">
                <el-table-column prop="id" label="班级ID" align="center"  width="120">
				</el-table-column>
                <el-table-column prop="name" label="班级名称" align="center">
				</el-table-column>
                <el-table-column prop="name" label="计划名称" align="center">
				</el-table-column>
                <el-table-column prop="startTime" label="计划开始时间" align="center" :formatter='timeFormatShow'>
				</el-table-column>
                <el-table-column prop="endTime" label="计划结束时间" align="center" :formatter='timeFormatShow'>
				</el-table-column>
			</el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="groupShowDialog = false">关闭</el-button>
            </div>
        </el-dialog>
        <!-- 分页相关 -->
        <el-col class='toolbar'>
            <el-pagination style='float: right' @current-change="handleCurrentChange" :current-page.sync="page_index" :page-size="20" layout="total, prev, pager, next" :total="totalCount">
            </el-pagination>
        </el-col>
    </section>
</template>

<script>
import {
	getNoticeRecordList,
	batchSendGroupMsg,
	getGroupNoticeList,
	getTeacherGroupList
} from '../../api/api'
export default {
	data() {
		return {
			filters: {
				timeRange: '',
				notice_name: '',
				sendStat: '',
				op_user_display_name: ''
			},
			sendFormVisible: false,
			sendMsgObjRules: {},
			sendMsgObj: {
				groupNoticeId: '',
				msgPriority: '',
				groupIds: ''
			},
			groupNoticeOptions: [],
			groupChooseFrom: false,
			groupListLoading: true,
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
			groupList: [],
			groupIdArr: [],
			allData: [],
			initLoading: false,
			page_index: 1,
			totalCount: 0,
			groupShowDialog: false,
			choosedGroupList: [],
			statusOptions: [{
					value: 0,
					label: '未发送'
				},
				{
					value: 1,
					label: '发送中'
				},
				{
					value: 2,
					label: '发送成功'
				},
				{
					value: 3,
					label: '发送失败'
				},
				{
					value: 4,
					label: '取消发送'
				}
			],
		}
	},
	methods: {
		// 清空筛选条件
		handleIconClick_clearOpUser() {
			this.filters.op_user_display_name = '';
			this.loadData()
		},
		loadData() {
			let para = {
				page_index: this.page_index,
				page_size: 20,
				notice_name: this.filters.notice_name,
				start_time: new Date(this.filters.timeRange[0]).getTime(),
				end_time: new Date(this.filters.timeRange[1]).getTime(),
				op_user_display_name: this.filters.op_user_display_name,
				send_stat: this.filters.sendStat
			};
			getNoticeRecordList(para).then(res => {
					if (res.data.success) {
						this.allData = res.data.data.items;
						this.initLoading = false;
						this.totalCount = res.data.data.totalCount
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
		// 跳转到消息详情页
		handleDetail(item) {
			this.$router.push({
				path: '/MsgConfig',
				query: {
					msgId: item.entity.groupNoticeId,
					haveSend: 1,
				}
			})
		},
		// 格式化时间
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
		// 格式化操作状态
		formatSendStat(row, col) {
			let property = col.property.split('.')
			let dateVal = row[property[0]][property[1]]

			switch (dateVal) {
				case 0:
					return '未发送'
					break;
				case 1:
					return '发送中'
					break;
				case 2:
					return '发送成功'
					break;
				case 3:
					return '发送失败'
					break;
				case 4:
					return '取消'
					break;
				default:
			}
		},
		// 格式化push状态
		formatPushStat(row, col) {
			let property = col.property.split('.')
			let dateVal = row[property[0]][property[1]]
			return dateVal == 0 ? '非push消息' : 'push消息'
		},
		// 格式化发送范围
		formatStatus(row, col, val) {
			let property = col.property.split('.')
			let dateVal = row[property[0]][property[1]]
			switch (dateVal) {
				case 0:
					return '全部班级'
					break;
				case 1:
					return '指定班级'
					break;
				default:
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
		// 补零
		addZeroFunc(val) {
			return val < 10 ? '0' + val : val
		},
		// 展示已选中班级
		showChooseGroup(item) {
			this.groupShowDialog = true;
			this.choosedGroupList = item.conf.groupList.map(prop => {
				let tempObj = {
					id: prop.entity.id,
					name: prop.entity.name,
				}
				if (prop.entity.plan && prop.entity.plan.entity) {
					tempObj.planName = prop.entity.plan.entity.name;
					tempObj.startTime = prop.entity.plan.entity.startTime;
					tempObj.endTime = prop.entity.plan.entity.endTime;
				}
				return tempObj
			})
		},
		// 分页相关
		handleCurrentChange(page) {
			this.page_index = page;
			this.loadData();
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
		this.loadData()
	}
}
</script>

<style lang="less" scoped>
</style>
