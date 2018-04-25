<template lang="html">
	<section>
		<el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
		  <el-form :inline='true' :model='filters'>
				<!-- <el-form-item>
					<el-select v-model="filters.status" placeholder="请选择类型" @change="changePrompterStatus">
				    <el-option
				      v-for="item in promoterStatusOptions"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
			  </el-form-item>-->
			  <el-form-item>
				  <el-input style="width: 160px" v-model='filters.station_number' placeholder='请输入用户分站号查询' @change="loadData" icon="circle-cross" :on-icon-click="handleIconClickStationNumber"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.phone" placeholder="请输入手机号" style="width:230px;" filterable clearable remote :remote-method="selectMembersMethod" :loading='selectMembersLoading' @change="loadData">
						<el-option
						  v-for="item in Members"
						  :key="item.id"
						  :label="item.mobile"
						  :value="item.station_number">
						</el-option>
					</el-select>
				</el-form-item>
			  <!-- <el-form-item>
					<el-button type='primary' @click='loadData'>查询</el-button>
			  </el-form-item>  -->
				<el-form-item>
					<el-button type='text' v-if="teamOrGroupFlag">当前组为：{{ groupName }}</el-button>
					<el-button type='text' v-if="!teamOrGroupFlag">当前小队为：{{ teamName }}</el-button>
				</el-form-item>
		  </el-form>
		</el-col>

		<el-table :data="formData" border stripe @selection-change="handleSelectionChange" v-loading="loading" ref="multipleTable">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop='promoter.id' label='ID' width='100' sortable align='center'></el-table-column>
			<el-table-column prop='promoter.stat' label='推广人状态' width='110' align='center' :formatter='formatPromoterStat'></el-table-column>
			<el-table-column label='二维码' width='80' align='center'>
				<template scope="scope">
	        <el-button type="text" size="small" @click="viewQRcode(scope.$index, scope.row)">点击查看</el-button>
		    </template>
			</el-table-column>
			<el-table-column prop='userWithInfo.user.name' label='用户昵称' width='160' align='center'></el-table-column>
			<el-table-column prop='promoter.stationNumber' label='分站号' width='100' align='center'></el-table-column>
			<el-table-column prop='userWithInfo.user.gender' label='用户性别' width='100' align='center' :formatter='formatUserGender'></el-table-column>
			<el-table-column prop='userWithInfo.user.type' label='用户类型' width='100' align='center' :formatter='formatUserType'></el-table-column>
			<el-table-column prop='userWithInfo.user.mobile' label='手机号码' width='125' align='center'></el-table-column>
			<el-table-column prop='userWithInfo.user.birthday' label='用户生日' width='100' align='center'></el-table-column>
			<el-table-column prop='userWithInfo.user.stat' label='用户状态' width='100' align='center' :formatter='formatUserStat'></el-table-column>
			<el-table-column prop='userWithInfo.user.internal' label='内部用户' width='100' align='center' :formatter='formatUserInternal'></el-table-column>
			<el-table-column prop='userWithInfo.user.signature' label='用户签名' min-width='240' align='center'></el-table-column>
			<el-table-column fixed="right" label='操作' width='95' align='center'>
				<template scope="scope">
					<el-button type="text" @click="batchoneAdd(scope.$index, scope.row, formData[scope.$index])" size="small" v-if="teamOrGroupFlag">添加到小队</el-button>
	        <el-button type="text" size="small" @click="delPromoter(scope.$index, scope.row)">删除</el-button>
		    </template>
			</el-table-column>
		</el-table>
		<el-col :span='24' class='toolbar'>
			<el-button type="info" @click="batchAdd" :disabled="this.multipleTable.length===0" v-if="teamOrGroupFlag">添加到小队</el-button>
			<el-button type="danger" @click="batchRemove" :disabled="this.multipleTable.length===0">从当前列表中删除</el-button>
      <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='20' :total='filters.total' style='float: right'></el-pagination>
    </el-col>
		<!-- 二维码 弹出层 -->
		<el-dialog
		  title=""
		  :visible.sync="dialogQRcode"
		  size="tiny"
			>
			<el-card :body-style="{ padding: '0px' }">
				<img class="qrCodeImg" :src="qrCode.qrCodeImgURL" alt="推广人二维码">
				<div class="qrCodeURL">
					<span>{{ qrCode.qrCodeURL }}</span>
				</div>
	    </el-card>
		</el-dialog>
		<!-- 选择群组 -->
		<el-dialog title="选择小队" :visible.sync="selectTeamFlag" size="tiny">
			<el-select v-model="selectTeam" style="width:300px;" placeholder="请输入小队名称或空格查询" filterable clearable remote :remote-method="selectTeamRemoteMethod" :loading='selectTeamLoading'>
				<el-option
				  v-for="item in selectTeamOptions"
				  :key="item.id"
				  :label="'（' + item.id + '）' + item.name"
				  :value="item.id">
				</el-option>
			</el-select>
	    <span slot="footer" class="dialog-footer">
	        <el-button @click="batchoneAdd()">取 消</el-button>
	        <el-button type="primary" @click="submitAddMemberToGroup">确 定</el-button>
	    </span>
		</el-dialog>
	</section>
</template>

<script>
import {
	getPromoterGroupMembersList,
	delMemberForProGroup,
	getPromoterTeamList,
	getPromoterTeamMembersList,
	addMemberForProTeam,
	delMemberForProTeam,
	getPromoterList
} from '../../api/api'
export default {
	computed: {
		teamOrGroupFlag () {
			if (this.$route.query.from == 'group') {
				this.groupName = this.$route.query.name
				return true
			}
			if (this.$route.query.from == 'Team') {
				this.teamName = this.$route.query.name
				return false
			}
		}
	},
	data() {
		return {
			formData: [],
			filters: {
				page_index: 1,
				page_size: 20,
				total: 0,
				type: '0',
				status: '',
				user_id: '',
				phone: ''
			},
			promoterStatusOptions: [{
					value: '1',
					label: '有效'
				},
				{
					value: '0',
					label: '无效'
				},
			],
			// 审核弹窗
			dialogPromoterAudit: false,
			promoterAuditEntity: {
				id: '',
				status: ''
			},
			// 查看二维码相关
			dialogQRcode: false,
			qrCode: {
				qrCodeURL: '',
				qrCodeImgURL: ''
			},
			loading: true,
			// 批量添加到群组
			multipleTable: [],
			promoterIds: '',
			// 选择群组相关
			selectTeam: '',
			selectTeamOptions: [],
			selectTeamLoading: false,
			selectTeamFlag: false,
			groupName: '',
			teamName: '',
			Members: [], // 成员列表
			selectMembersLoading: false,
		}
	},
	methods: {
		catchFunc (error) {
			if (error.response) {
				this.$notify({
					title: error.response.status,
					message: '网络请求错误',
					type: 'error'
				})
			}else if(error.request){
				this.$notify({
					title: error.request,
					message: '网络请求错误',
					type: 'error'
				})
			}else{
				this.$notify({
					title: '错误',
					message: error.message,
					type: 'error'
				})
			}
			this.loading = false;
		},
		loadData() {
			this.loading = true;
			this.formData = [];
			let params, _getData;
			if (this.teamOrGroupFlag) {
				params = {
					page_index: this.filters.page_index,
					page_size: this.filters.page_size,
					promoter_group_id: this.$route.query.promoter_group_id,
					// station_number: this.filters.station_number?this.filters.station_number:this.filters.phone,
					station_number: this.filters.phone,
				}
				_getData = getPromoterGroupMembersList;
			} else {
				params = {
					page_index: this.filters.page_index,
					page_size: this.filters.page_size,
					pro_tm_id: this.$route.query.pro_tm_id,
					station_number: this.filters.phone,
				}
				_getData = getPromoterTeamMembersList
			}
			if (/^\s*$/.test(this.filters.station_number) || !this.filters.station_number) {
				params.station_number = this.filters.phone;
			} else {
				params.station_number = this.filters.station_number;
			}
			_getData(params)
				.then((res) => {
					if (res.data.success) {
						this.formData = res.data.data.items ? res.data.data.items : []
						this.filters.total = res.data.data.totalCount
					} else {
						this.$notify.error(res.data.msg);
					}
					this.loading = false
				})
				.catch((error) => {
					this.catchFunc(error)
				})
		},
		selectMembersMethod(query) {
			let nQuery = query.trim();
			let myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
			if (nQuery !== '' && myreg.test(nQuery)) {
				let temp = Number(query);
				let parameter = {
					// station_number: this.filters.station_number,
					phone: this.filters.phone
				};
				if (temp) {
					parameter['phone'] = temp
				}
				this.selectMembersLoading = true;
				getPromoterList(parameter)
					.then((res) => {
						if (res.data.success) {
							if (res.data.data.items) {
								this.Members = res.data.data.items.map((item) => {
									let tempObj = {
										id: item.userWithInfo.user.id,
										name: item.userWithInfo.user.name,
										mobile: item.userWithInfo.user.mobile,
										station_number: item.promoter.stationNumber
									}
									return tempObj
								});
							}
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
		},
		// 点击错号按钮
		handleIconClickStationNumber() {
			this.filters.station_number = '';
			this.loadData();
		},
		changePrompterStatus() {
			this.loadData()
		},
		// 分页
		handleCurrentChange(val) {
			this.filters.page_index = val;
			this.loadData();
		},
		// 二维码查看
		viewQRcode(index, row) {
			this.qrCode = {
				qrCodeURL: row.promoter.qrCodeURL,
				qrCodeImgURL: row.promoter.qrCodeImgURL,
			}
			this.dialogQRcode = true
		},
		// 取消审核
		handleClose(done) {
			this.$confirm('确认关闭？')
				.then(_ => {
					done();
				})
				.catch(_ => {});
		},
		handleSelectionChange(val) {
			this.multipleTable = val;
		},
		// 单个添加到群组中
		batchoneAdd(index, row, rows) {
			if (rows) {
				this.$refs.multipleTable.toggleRowSelection(row);
				this.selectTeamFlag = true
			} else {
				this.$refs.multipleTable.clearSelection();
				this.selectTeamFlag = false
			}
			this.promoterIds = row.promoter.id;

		},
		// 批量添加到群组中
		batchAdd() {
			this.promoterIds = this.multipleTable.map(item => item.promoter.id).toString();
			this.selectTeamFlag = true
		},
		selectTeamRemoteMethod(query) {
			if (query !== '') {
				this.selectTeamLoading = true;
				let parameter = {
					pro_gp_id: this.$route.query.promoter_group_id,
					name: query
				};
				// 调用 加载列表的接口
				getPromoterTeamList(parameter).then((res) => {
					if (res.data.success) {
						this.selectTeamOptions = res.data.data.items.map((item) => {
							let tempObj = {
								id: item.id,
								name: item.name,
							}
							return tempObj
						});
					} else {
						this.$message.error(res.data.msg || '未知错误，请联系管理员');
					};
					this.selectTeamLoading = false;
				})
				.catch((error) => {
					this.catchFunc(error)
				})
			} else {
				this.selectTeamOptions = [];
			};
		},
		submitAddMemberToGroup() {
			let params = {
				pro_tm_id: this.selectTeam,
				user_ids: this.promoterIds
			}
			addMemberForProTeam(params)
				.then((res) => {
					if (res.data.success) {
						this.selectTeamFlag = false
						this.$notify({
							title: '成功',
							message: '添加成功',
							type: 'success',
							duration: 1500
						})
					} else {
						this.$notify({
							title: '错误',
							message: res.data.msg,
							type: 'error'
						})
					}
					this.loadData()
				})
				.catch((error) => {
					this.catchFunc(error)
				})
		},
		// 执行删除方法
		promoterDelFunc(ids) {
			let deleFunction
			let params
			if (this.teamOrGroupFlag) {
				params = {
					promoter_group_id: this.$route.query.promoter_group_id,
					promoter_id: ids,
				}
				deleFunction = delMemberForProGroup
			} else {
				params = {
					pro_tm_id: this.$route.query.pro_tm_id,
					user_ids: ids,
				}
				deleFunction = delMemberForProTeam
			}
			deleFunction(params).then((res) => {
					if (res.data.success) {
							this.$notify({
									title: '成功',
									message: '删除成功',
									type: 'success',
									duration: 1500
							});
					}else{
							this.$notify({
									title: '错误',
									message: res.data.msg,
									type: 'error'
							})
					}
					this.loadData();
			})
			.catch((error) => {
				this.catchFunc(error)
			})
		},
		// 从当前 群组 或者 小队中删除
		delPromoter(index, row) {
			this.$confirm('确认删除选中记录吗？', '提示', { type: 'warning' })
				.then(() => {
					this.promoterDelFunc(row.promoter.id)
				}).catch(() => {

				});
		},
	  //批量删除
		batchRemove() {
				let user_ids = this.multipleTable.map(item => item.promoter.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
						type: 'warning'
				}).then(() => {
						this.promoterDelFunc(user_ids)
				}).catch(() => {

				});
		},
		formatPromoterStat(row) {
			switch (row.promoter.stat) {
				case 0:
					return '无效'
					break;
				case 1:
					return '有效'
					break;
				default:
					return '状态未知'
			}
		},
		formatUserGender(row) {
			switch (row.userWithInfo.user.type) {
				case 0:
					return '未知'
					break;
				case 1:
					return '男'
					break;
				case 2:
					return '女'
					break;
				default:
					return '未知'
			}
		},
		formatUserType(row) {
			switch (row.userWithInfo.user.type) {
				case 0:
					return '普通用户'
					break;
				case 1:
					return '官方'
					break;
				case 2:
					return '合作个人'
					break;
				case 3:
					return '合作媒体'
					break;
				case 4:
					return '转载媒体'
					break;
				default:
					return '未知'
			}
		},
		formatUserStat(row) {
			switch (row.userWithInfo.user.stat) {
				case 0:
					return '有效'
					break;
				case 1:
					return '禁言'
					break;
				case 2:
					return '冻结'
					break;
				default:
					return '未知'
			}
		},
		formatUserInternal(row) {
			switch (row.userWithInfo.user.internal) {
				case 0:
					return '否'
					break;
				case 1:
					return '是'
					break;
				default:
			}
		}
	},
	mounted() {
		this.loadData()
	}
}
</script>

<style lang="less" scoped>
.qrCodeImg {
    width: 100%;
    display: block;
}
.qrCodeURL {
    font-size: 18px;
    padding: 18px;
    span {
        display: block;
        width: 100%;
        word-wrap: break-word;
    }
}
</style>
