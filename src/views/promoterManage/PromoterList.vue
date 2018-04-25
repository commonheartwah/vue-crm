<template lang="html">
	<section>
		<el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
		    <el-form :inline='true' :model='filters'>
				<el-form-item>
				    <el-input style="width: 160px" v-model='filters.phone' placeholder='请输入手机号'  @keydown.enter.native.prevent @change="handleSeek" icon="circle-cross" :on-icon-click="handleIconClickPhone"></el-input>
			    </el-form-item>
				<el-form-item>
				    <el-input v-model='filters.station_number' style="width: 100px;" placeholder='分站号'  @keydown.enter.native.prevent @change="handleSeek" icon="circle-cross" :on-icon-click="handleIconClickStationNum"></el-input>
			    </el-form-item>


				<el-form-item>
					<el-select v-model="filters.date_range_id" style="width: 260px;" placeholder="请输入批次名称查询" filterable clearable remote :remote-method="selDateRangeRemoteMethod" :loading='selDateRangeLoading' @change="handleSeek">
						<el-option v-for="item in selDateRangeOptions" :key="item.id" :label="item.name + '【 ' + item.startTime + ' - ' + item.endTime + ' 】'" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item   >
					<el-select v-model="filters.status" placeholder="状态" @change="changePrompterStatus"  style="width: 80px">
						<el-option
						  v-for="item in promoterStatusOptions"
						  :key="item.value"
						  :label="item.label"
						  :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.flag" placeholder="分组状态" @change="handleSeek" style="width: 120px">
						<el-option label="全部" value=""></el-option>
						<el-option label="未分组" :value="1"></el-option>
						<el-option label="已分组" :value="2"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item>
					<el-select v-model="filters.group_type" placeholder="团队" @change="changeGroupType" style="width: 80px">
						<el-option label="小组" :value="1"></el-option>
						<el-option label="小队" :value="2"></el-option>
				  	</el-select>
			  	</el-form-item>

				<el-form-item>
					<el-select v-model="filters.rank_id" style="width: 220px;" :placeholder="filters.group_type | formatPlace" filterable clearable remote :remote-method="organizationRemoteMethod" :loading='organizationLoading' @change='handleSeek'>
						<el-option v-for="item in organizationOptions" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item>
					<el-select v-model="filters.url" placeholder="二维码是否上传" @change="handleSeek" style="width: 150px">
						<el-option label="请选择" value=""></el-option>
						<el-option label="未上传" :value="2"></el-option>
						<el-option label="已上传" :value="1"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item>
					<el-select v-model="filters.check_stat" placeholder="二维码校验状态" @change="handleSeek" style="width: 150px">
						<el-option label="请选择" value=""></el-option>
						<el-option label="未校验" :value="0"></el-option>
						<el-option label="校验通过" :value="1"></el-option>
						<el-option label="未通过" :value="2"></el-option>
					</el-select>
				</el-form-item>

			    <el-form-item>
				    <el-button type='primary' @click='handleSeek'>查询</el-button>
			    </el-form-item>
				<el-form-item>
					<el-button type='primary' @click='handleExport'>导出excel</el-button>
				</el-form-item>
		    </el-form>
		</el-col>

		<el-table :data="formData" border stripe @selection-change="handleSelectionChange" ref="multipleTable">
			<el-table-column type="selection" width="55" :selectable="selectable" fixed="left"></el-table-column>
			<el-table-column type="expand" fixed="left">
	      <template scope="props" >
	        <el-form label-position="left" inline class="demo-table-expand" label-width="100px" style="margin-left:100px;">
	          <el-form-item label="姓名">
	            <span>{{ props.row.promoter.name }}</span>
	          </el-form-item>
						<el-form-item label="常用联系方式">
	            <span>{{ props.row.promoter.mobile }}</span>
	          </el-form-item>
						<el-form-item label="分站号">
	            <span>{{ props.row.promoter.stationNumber }}</span>
	          </el-form-item>
	          <el-form-item label="批次">
	            <span>{{ props.row.promoter.batch }}</span>
	          </el-form-item>
	          <el-form-item label="工作状态">
	            <span>{{ props.row.promoter.motherTypeName }}</span>
	          </el-form-item>
						<el-form-item label="所在地区">
	            <span>{{ props.row.promoter.fullAreaName }}</span>
	          </el-form-item>
						<el-form-item label="开户行">
	            <span>{{ props.row.promoter.bankSubbranch }}</span>
	          </el-form-item>
						<el-form-item label="工行卡号">
	            <span>{{ props.row.promoter.bankId }}</span>
	          </el-form-item>
						<el-form-item label="详细地址" style="width:100%;">
	            <span>{{ props.row.promoter.address }}</span>
	          </el-form-item>
	        </el-form>
	      </template>
	    </el-table-column>
			<el-table-column prop='promoter.id' label='ID' width='100' sortable align='center'></el-table-column>
			<el-table-column prop='promoter.stat' label='推广人状态' width='130' align='center' :formatter='formatPromoterStat'></el-table-column>
			<el-table-column label='二维码' width='80' align='center'>
				<template scope="scope">
		        	<el-button type="text" size="small" @click="viewQRcode(scope.$index, scope.row)">点击查看</el-button>
			    </template>
			</el-table-column>
			<el-table-column prop='userWithInfo.user.name' label='用户昵称' width='160' align='center'></el-table-column>
			<el-table-column prop='promoter.stationNumber' label='分站号' width='105' align='center'></el-table-column>
			<el-table-column prop='promoter.promoterType' label='推广人类型' width='105' align='center' :formatter='formatPromoterType'></el-table-column>
			<el-table-column prop='userWithInfo.user.gender' label='用户性别' width='100' align='center' :formatter='formatUserGender'></el-table-column>
			<el-table-column prop='userWithInfo.user.type' label='用户类型' width='100' align='center' :formatter='formatUserType'></el-table-column>
			<el-table-column prop='promoter.channel' label='用户来源' width='100' align='center' :formatter='formatChannel'></el-table-column>
			<el-table-column prop='userWithInfo.user.mobile' label='手机号码' width='125' align='center'></el-table-column>
			<el-table-column prop='promoter.familyName' label='家族名称' width='125' align='center'></el-table-column>
			<el-table-column prop='promoter.leaderType' label='推广人级别' width='120' align='center' :formatter='formatLeaderType'></el-table-column>
			<el-table-column prop='promoter.positionName' label='推广人身份' width='120' align='center'></el-table-column>
			<el-table-column label='推荐人' width='140' align='center' show-overflow-tooltip>
				<template scope="scope">
					<el-tooltip  placement="top" effect="light" v-if="scope.row.promoter.inviteUid">
						<div slot="content" style="font-size:14px;">
							<p>推荐人 ID：{{ scope.row.promoter.inviteUid }}</p>
							<p>推荐人手机：{{ scope.row.promoter.inviteMobile }}</p>
							<p>推荐人分站号：{{ scope.row.promoter.inviteStationNumber }}</p>
						</div>
						<span style="color: #41b336;font-size:14px;">{{ scope.row.promoter.inviteName }}</span>
					</el-tooltip>
					<span v-else style="font-size:14px;">无推荐人</span>
				</template>
			</el-table-column>
			<el-table-column label='群组' width='140' align='center' show-overflow-tooltip>
				<template scope="scope">
					<span style="color: #41b336;font-size:12px;">{{ scope.row.promoter.groupName | formatGroupName }}</span>
		    </template>
			</el-table-column>
			<el-table-column prop='userWithInfo.user.stat' label='用户状态' width='100' align='center' :formatter='formatUserStat'></el-table-column>
			<el-table-column prop='userWithInfo.user.internal' label='内部用户' width='100' align='center' :formatter='formatUserInternal'></el-table-column>
			<el-table-column fixed="right" label='操作' width='170' align='center'>
				<template scope="scope">
					<el-button type="text" size="small" @click="batchoneAdd(scope.$index, scope.row, formData[scope.$index])" :disabled="scope.row.promoter.groupId!=0">进入小组</el-button>
					<el-button type="text" size="small" @click="editRecommendFunc(scope.$index, scope.row)">修改推荐人</el-button>
					<el-button type="text" size="small" @click="promoterAuditFunc(scope.$index, scope.row)" style="color:#ff4949;">修改信息</el-button>
			    <el-button type="text" size="small" @click="wechatQrCodeManage(scope.$index, scope.row)" style="color:#ff4949;">微信二维码</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-col :span='24' class='toolbar'>
			<el-button type="info" @click="batchAdd" :disabled="this.multipleTable.length===0">添加到群组</el-button>
			<el-button type="warning" @click="batchAndPosition = true">按批次修改身份</el-button>
			<el-button type="success" @click="disposalDaterangeidFunc">整理推广人批次等级ID</el-button>
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.multipleTable.length===0">批量删除</el-button> -->
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
		<!-- 修改状态弹出层 -->
		<el-dialog title="" :visible.sync="dialogPromoterAudit" >
			<el-form label-width="120px" :model="promoterAuditEntity">
				<el-form-item label="修改状态：">
					<el-radio-group v-model="promoterAuditEntity.status">
						<el-radio-button :label="statu.value" v-for="(statu, index) in promoterStatusOptions" :key="index">{{ statu.label }}</el-radio-button>
				  </el-radio-group>
				</el-form-item>

				<el-form-item label="批次：" v-if="promoterAuditEntity.status == 1">
					<el-input disabled style="width:330px;" v-model='promoterAuditEntity.batch'></el-input>
				</el-form-item>

				<!-- <el-form-item label="批次：" v-if="promoterAuditEntity.status == 1">
					<el-select disabled v-model="promoterAuditEntity.date_range_id" style="width: 350px;" placeholder="请输入批次名称查询" filterable clearable remote :remote-method="selDateRangeRemoteMethod" :loading='selDateRangeLoading' @change="handleSeek">
						<el-option v-for="item in selDateRangeOptions" :key="item.id" :label="item.name + '【 ' + item.startTime + ' - ' + item.endTime + ' 】'" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item> -->

				<el-form-item label="推广人身份：" v-if="promoterAuditEntity.status == 1">
					<el-radio-group v-model="promoterAuditEntity.position">
						<el-radio-button :label="pos.value" v-for="(pos, index) in positionOptions" :key="index">{{ pos.label }}</el-radio-button>
				  </el-radio-group>
				</el-form-item>
				<el-form-item label="推广人类型：" v-if="promoterAuditEntity.status == 1">
					<el-select v-model="promoterAuditEntity.promoter_type" placeholder="推广人类型" style="width: 120px">
						<el-option label="兼职" :value="0"></el-option>
						<el-option label="全职" :value="1"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="入职日期：" v-if="promoterAuditEntity.status == 1">
					<el-date-picker
			      v-model="join_date"
			      type="date"
			      placeholder="选择日期"
						format="yyyy-MM-dd">
			    </el-date-picker>
				</el-form-item>

				<el-form-item label="离职日期：" v-if="promoterAuditEntity.status == 0">
					<el-date-picker
			      v-model="leave_date"
			      type="date"
			      placeholder="选择日期"
						format="yyyy-MM-dd">
			    </el-date-picker>
				</el-form-item>

				<el-form-item label="离职原因：" v-if="promoterAuditEntity.status == 0">
					<el-select v-model="promoterAuditEntity.leave_type">
						<el-option v-for="item in leaveTypeOptions" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item v-if="promoterAuditEntity.status == 2" label='选择招生期'>
					<el-select v-model="promoterAuditEntity.vacation_number" style="width: 260px;" placeholder="请输入招生期名称查询" filterable clearable remote :remote-method="selEnrollRangeRemoteMethod" :loading='selEnrollRangeLoading'>
						<el-option v-for="item in selEnrollRangeOptions" :key="item.id" :label="item.name + '【 ' + item.startTime + ' - ' + item.endTime + ' 】'" :value="item.number">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="补充原因：" v-if="promoterAuditEntity.status == 0">
					<el-input style="width:430px;" v-model='promoterAuditEntity.leave_reason' placeholder='请输入用户离职原因' icon="circle-cross" :on-icon-click="handleIconClickLeaveReason"></el-input>
				</el-form-item>

				<el-form-item label="分站号：" v-if="promoterAuditEntity.status == 1">
					<el-input style="width:330px;" v-model='promoterAuditEntity.station_number' placeholder='请输入用户分站号' icon="circle-cross" :on-icon-click="handleIconClickStation"></el-input>
				</el-form-item>

				<el-form-item label="渠道：" v-if="promoterAuditEntity.status == 1">
					<el-select v-model="promoterAuditEntity.channel_id">
						<el-option v-for="item in channelOptions" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>

			</el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogPromoterAudit = false">取 消</el-button>
		    <el-button type="primary" @click="submitPromoterUpdateFunc">确 定</el-button>
		  </span>
		</el-dialog>
		<!-- 选择群组 -->
		<el-dialog title="选择群组" :visible.sync="selectGroupFlag" size="tiny">
			<el-select v-model="selectGroup" style="width:300px;" placeholder="请输入群组名称或空格查询" filterable clearable remote :remote-method="selectGroupRemoteMethod" :loading='selectGroupLoading'>
				<el-option
				  v-for="item in selectGroupOptions"
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
		<!-- 修改推荐人 -->
		<el-dialog title="修改推荐人" :visible.sync="dialogEditRecommend" size="tiny">
			<el-form label-width="120px">
				<el-form-item label="选择推荐人：">
					<el-select v-model="editRecommend.station_number" style="width: 100%;" placeholder="请输入分站号或ID查询" filterable clearable remote :remote-method="selInviteRemoteMethod" :loading='selInviteLoading'>
						<el-option v-for="item in selInviteOptions" :key="item" :label="'（' + item.station_number + '）' + item.name + '----' + item.mobile" :value="item.station_number">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="dialogEditRecommend = false">取 消</el-button>
		        <el-button type="primary" @click="submitEditRecommend">确 定</el-button>
		    </span>
		</el-dialog>
		<!-- 按批次修改身份 -->
		<el-dialog title="修改身份" :visible.sync="batchAndPosition" size="tiny">
			<el-form label-width="120px">
				<el-form-item label="推广人批次：">
					<el-select v-model="selBatch" style="width: 100%;" placeholder="请输入日期段名称查询" filterable clearable remote :remote-method="selBatchRemoteMethod" :loading='selBatchLoading'>
						<el-option v-for="item in selBatchOptions" :key="item" :label="'（' + item.id + '）' + item.name + '【 ' + item.startTime + ' - ' + item.endTime + ' 】'" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="推广人身份：">
					<el-radio-group v-model="update_position">
						<el-radio-button :label="pos.value" v-for="(pos, index) in positionOptions" :key="index">{{ pos.label }}</el-radio-button>
				  </el-radio-group>
				</el-form-item>
			</el-form>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="batchAndPosition = false">取 消</el-button>
		        <el-button type="primary" @click="submitUpdatePosition">确 定</el-button>
		    </span>
		</el-dialog>
		<!-- 管理推广人个人微信账号二维码 -->
		<el-dialog title="推广人个人微信账号二维码" :visible.sync="wechatQrCodeFlag">
			<el-form :model='wechatQrCodeManageEntity' label-width='120px'>
				<el-form-item label="验证审核">
		          <el-select v-model="wechatQrCodeManageEntity.check_stat" :disabled="!(wechatQrCodeManageEntity.qrCodeUrl || wechatQrCodeManageEntity.url)">
		            <el-option label="等待审核" :value="0"></el-option>
					<el-option label="审核通过" :value="1"></el-option>
		            <el-option label="审核未通过" :value="2"></el-option>
		          </el-select>
		        </el-form-item>
				<el-form-item label="推广人上传">
					<img :src="wechatQrCodeManageEntity.qrCodeUrl" alt="" style="width:200px" v-if="wechatQrCodeManageEntity.qrCodeUrl">
					<p v-else>推广人未上传二维码</p>
				</el-form-item>
				<el-form-item label="二维码图片">
					<el-upload
			          class="upload-demo"
			          ref='uploadPoster'
			          name="bin"
			          action="/op/material/upload_image"
			          :multiple='false'
			          :on-success="handlePosterSuccess"
					  :file-list="fileList"
					  :on-change="handleChange"
			        >
			          <el-button size="small" type="primary">选择文件</el-button>
			        </el-upload>
				</el-form-item>
				<el-form-item label="后台上传" v-if="wechatQrCodeManageEntity.url">
					<img :src="wechatQrCodeManageEntity.url" alt="" style="width:200px">
				</el-form-item>
			</el-form>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="wechatQrCodeFlag = false">取 消</el-button>
		        <el-button type="primary" @click="submitWechatQrCode">确 定</el-button>
		    </span>
		</el-dialog>

		<!-- 隐藏的form表单 接收服务器发来的excel文件 用form表单的post进行请求 浏览器会自动下载 别的方式暂时不可以 -->
    	<section>
    		<form method="post" ref="oForm"></form>
    	</section>
	</section>
</template>

<script>
import {
	submitPromoterUpdate,
	getPromoterList,
	getPromoterGroupList,
	addMemberForProGroup,
	getDateRangeList,
	updatePosition,
	updatePrivilege,
	disposalDaterangeid,
	getPromoterTeamList
} from '../../api/api'
import util from '../../common/js/util'
export default {
	data() {
		return {
			formData: [],
			filters: {
				page_index: 1,
				page_size: 20,
				total: 0,
				status: '',
				rank_id: '',
				date_range_id: '',
				group_type: '',
				flag: '',
				url: '',
				check_stat: ''
			},
			promoterStatusOptions: [{
					value: '1',
					label: '在职'
				},
				{
					value: '2',
					label: '请假'
				},
				{
					value: '0',
					label: '离职'
				},
			],
			selDateRangeLoading: false,
			selDateRangeOptions: [],
			selEnrollRangeLoading: false,
			selEnrollRangeOptions: [],
			// 审核弹窗
			dialogPromoterAudit: false,
			promoterAuditEntity: {
				id: '',
				status: '',
				batch: '',
				position: '',
				station_number: '',
				leave_reason: '',
				promoterAuditEntity: 0
			},
			organizationOptions: [],
			organizationLoading: false,
			editRecommend: {
				user_id: '',
				station_number: '',
			},
			// 查看二维码相关
			dialogQRcode: false,
			qrCode: {
				qrCodeURL: '',
				qrCodeImgURL: ''
			},
			wechatQrCodeFlag: false,
			wechatQrCodeManageEntity: {
				id: '',
				url: '',
				check_stat: '0'
			},
			listLoading: true,
			// 控制单个添加到群组禁止状态
			multipleFlag: true,
			// 批量添加到群组
			multipleTable: [],
			promoterIds: '',
			// 选择群组相关
			selectGroup: '',
			selectGroupOptions: [],
			selectGroupLoading: false,
			selectGroupFlag: false,

			join_date: '',
			leave_date: '',
			positionOptions: [{
					value: '0',
					label: '见习推广人'
				},
				{
					value: '1',
					label: '新推广人'
				}, {
					value: '2',
					label: '老推广人'
				}
			],
			// 按照批次修改身份弹框控制
			batchAndPosition: false,
			// 选择批次
			selBatch: "",
			selBatchLoading: false,
			selBatchOptions: [],

			// 选择身份
			update_position: '',
			// 修改推荐人
			dialogEditRecommend: false,
			selInvite: '',
			selInviteLoading: false,
			selInviteOptions: [],

			channelOptions: [{
					value: 0,
					label: '未知'
				}, {
					value: 1,
					label: '微信公众号'
				}, {
					value: 2,
					label: 'M站'
				}, {
					value: 3,
					label: '安卓'
				}, {
					value: 4,
					label: 'IOS'
				}, {
					value: 5,
					label: '推广人推荐'
				}, {
					value: 6,
					label: '总部'
				}, {
					value: 7,
					label: '小队'
				}],
			leaveTypeOptions:[
				{
					value: 0,
					label: '主动申请'
				},{
					value: 1,
					label: '辞退'
				},{
					value: 2,
					label: '失联'
				}
			],
			fileList: [] // 二维码上传图片列表
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
		},
		loadData() {
			this.listLoading = true
			let params = {
				page_index: this.filters.page_index,
				page_size: this.filters.page_size,
				status: this.filters.status,
				phone: this.filters.phone,
				station_number: this.filters.station_number,
				pro_gp_id: this.filters.pro_gp_id,
				pro_tm_id: this.filters.pro_tm_id,
				date_range_id: this.filters.date_range_id,
				url: this.filters.url,
				check_stat: this.filters.check_stat,
				flag: this.filters.flag
			}
			if (this.filters.group_type === 1) {
				params['pro_gp_id'] = this.filters.rank_id
			} else if (this.filters.group_type === 2) {
				params['pro_tm_id'] = this.filters.rank_id
			} else {
				params['pro_gp_id'] = '';
				params['pro_tm_id'] = '';
			}
			getPromoterList(params)
				.then((res) => {
					if (res.data.success) {
						this.formData = res.data.data.items ? res.data.data.items : []
						this.filters.total = res.data.data.totalCount
					} else {
						this.$notify.error(res.data.msg);
					}
					this.listLoading = false
				})
				.catch((error) => {
					this.catchFunc(error)
				})
		},
		changeGroupType(value) {
			this.filters.rank_id = '';
		},
		// 查找方法
		handleSeek() {
			this.loadData();
		},
		// 点击错号按钮
		handleIconClickAuthorId() {
			this.filters.user_id = '';
		},
		handleIconClickUserName() {
			this.filters.username = '';
			this.handleSeek();
		},
		handleIconClickPhone() {
			this.filters.phone = '';
			this.handleSeek();
		},
		handleIconClickStationNum() {
			this.filters.station_number = '';
			this.handleSeek();
		},
		handleIconClickBatch() {
			this.promoterAuditEntity.batch = '';
		},
		handleIconClickStation() {
			this.promoterAuditEntity.station_number = '';
		},
		handleIconClickLeaveReason() {
			this.promoterAuditEntity.leave_reason = '';
		},
		changePrompterStatus() {
			this.loadData()
		},
		// 分页
		handleCurrentChange(val) {
			this.listLoading = true;
			this.filters.page_index = val;
			this.loadData();
		},
		// 点开 修改
		promoterAuditFunc(index, row) {
			this.dialogPromoterAudit = true
			this.promoterAuditEntity = {
				id: row.promoter.id,
				status: row.promoter.stat,
				batch: row.promoter.batch?row.promoter.batch:'无',
				position: row.promoter.position,
				station_number: row.promoter.stationNumber,
				leave_reason: row.promoter.leaveReason,
				channel_id: row.promoter.channel,
				promoter_type: row.promoter.promoterType,
			}
			this.$set(this.promoterAuditEntity, 'date_range_id', row.promoter.dateRangeId ? row.promoter.dateRangeId : '')
			if (row.promoter.stat == 0) {
				this.$set(this.promoterAuditEntity, 'leave_type', (row.parsed.leaveType || row.parsed.leaveType == 0) ? row.parsed.leaveType : '');
				this.$set(this.promoterAuditEntity, 'leave_reason', row.parsed.leaveReason ? row.parsed.leaveReason: '');
			} else {
				this.$set(this.promoterAuditEntity, 'leave_type', '');
			}
			if (row.promoter.stat == 2) {
				this.$set(this.promoterAuditEntity, 'vacation_number', row.parsed.number);
				this.selEnrollRangeRemoteMethod(row.parsed.number);
			}
			this.join_date = row.promoter.joinDate ? new Date(row.promoter.joinDate) : '';
			this.leave_date = row.promoter.leaveDate ? new Date(row.promoter.leaveDate) : '';
			this.selDateRangeRemoteMethod(' ')
		},
		editRecommendFunc(index, row) {
			this.dialogEditRecommend = true
			this.editRecommend = {
				user_id: row.promoter.id,
				station_number: row.promoter.inviteStationNumber,
			}
		},
		wechatQrCodeManage(index, row) {
			this.wechatQrCodeFlag = true;
			this.wechatQrCodeManageEntity['promoter_type'] = row.promoter.promoterType;
			this.wechatQrCodeManageEntity['id'] = row.promoter.id;
			this.wechatQrCodeManageEntity['status'] = row.promoter.stat;
			this.wechatQrCodeManageEntity['date_range_id'] = row.promoter.dateRangeId || '';
			this.wechatQrCodeManageEntity['position'] = row.promoter.position;
			this.wechatQrCodeManageEntity['join_date'] = row.promoter.joinDate || '';
			this.wechatQrCodeManageEntity['leave_date'] = row.promoter.leaveDate || '';
			this.wechatQrCodeManageEntity['leave_reason'] = row.parsed.leaveReason || '';
			this.wechatQrCodeManageEntity['station_number'] = row.promoter.stationNumber || '';
			this.wechatQrCodeManageEntity['invite_uid'] = row.promoter.inviteUid;
			this.wechatQrCodeManageEntity['channel_id'] = row.promoter.channel || '';
			this.wechatQrCodeManageEntity['vacation_number'] = row.parsed.number || '';
			this.wechatQrCodeManageEntity['leave_type'] = row.parsed.leaveType || '';
			this.wechatQrCodeManageEntity['qrCodeUrl'] = row.parsed.qrCodeUrl || '';
			this.wechatQrCodeManageEntity['url'] = row.parsed.newCodeUrl || '';
			this.wechatQrCodeManageEntity['check_stat'] = (row.parsed.hasCheck || row.parsed.hasCheck == 0) ? row.parsed.hasCheck : '' ;
		},
		handleChange(file, fileList){
			let reg = /\.png|jpg|jpeg|gif$/i;
            if (fileList.length>1) {
                fileList.length = 1;
                this.$notify({
                    title: '错误',
                    message: '只支持单个文件上传',
                    type: 'error'
                });
				return
            }
			if (!reg.test(file.raw.name)) {
				this.$notify({
                    title: '错误',
                    message: '只支持图片文件上传',
                    type: 'error'
                });
				fileList.length = 0;
			}

        },
		/**
		 * [handlePosterSuccess op上传二维码图片成功]
		 * @param  {[type]} response [description]
		 * @param  {[type]} file     [description]
		 * @return {[type]}          [description]
		 */
		handlePosterSuccess(response, file) {
			if (response.success) {
				this.wechatQrCodeManageEntity.url = response.data;
				this.wechatQrCodeManageEntity.check_stat = 1;
				this.fileList = []
			} else {
				this.$notify({
					title: '错误',
					message: response.msg,
					type: 'error'
				})
			}
		},
		// 二维码查看
		viewQRcode(index, row) {
			this.qrCode = {
				qrCodeURL: row.promoter.qrCodeURL,
				qrCodeImgURL: row.promoter.qrCodeImgURL,
			}
			this.dialogQRcode = true
		},
		// 提交状态修改
		submitPromoterUpdateFunc() {
			let params = {
				user_id: this.promoterAuditEntity.id,
				status: this.promoterAuditEntity.status,
				position: this.promoterAuditEntity.position,
				station_number: this.promoterAuditEntity.station_number,
				leave_reason: this.promoterAuditEntity.leave_reason,
				join_date: this.join_date ? Date.parse(this.join_date) : '',
				leave_date: this.leave_date ? Date.parse(this.leave_date) : '',
				channel_id: this.promoterAuditEntity.channel_id,
				date_range_id: this.promoterAuditEntity.date_range_id,
				promoter_type: this.promoterAuditEntity.promoter_type
			};
			if (this.promoterAuditEntity.status == 0) {
				if (!this.leave_date) {
					this.$message({
						title: '失败',
						message: '请选择离职日期',
						type: 'error',
					})
					return;
				}
				if (this.promoterAuditEntity.leave_type != null) {
					params['leave_type'] = this.promoterAuditEntity.leave_type
				} else {
					this.$message({
						title: '失败',
						message: '请选择离职原因',
						type: 'error',
					})
					return;
				}
			} else {
				params['leave_type'] = -1
			};
			if (this.promoterAuditEntity.status == 1) {
				if (!this.join_date) {
					this.$message({
						title: '失败',
						message: '请选择入职日期',
						type: 'error',
					})
					return;
				}
			};
			if (this.promoterAuditEntity.status == 2) {
				if (this.promoterAuditEntity.vacation_number != null) {
					params['vacation_number'] = this.promoterAuditEntity.vacation_number
				} else {
					this.$message({
						title: '失败',
						message: '请选择请假的招生期',
						type: 'error',
					})
					return;
				};
			};
			submitPromoterUpdate(params)
				.then((res) => {
					if (res.data.success) {
						this.$notify({
							title: '成功',
							message: '修改成功',
							type: 'success',
							duration: 1500
						});
						this.dialogPromoterAudit = false;
						this.loadData();
					} else {
						this.$notify.error(res.data.msg);
					}
				})
				.catch((error) => {
					this.catchFunc(error)
				})
		},
		disposalDaterangeidFunc() {
			disposalDaterangeid()
				.then(res => {
					if (res.data.success) {
						this.$message({
							title: '成功',
							message: '整理成功',
							type: 'success',
						})
					} else {
						this.$notify({
							title: '成功',
							message: res.data.msg,
							type: 'error',
							duration: 3000
						})
					}
				})
				.catch(err => {
					this.catchFunc(err)
				})
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
		// 批量添加到群组中
		batchAdd() {
			this.promoterIds = this.multipleTable.map(item => item.promoter.id).toString();
			this.selectGroupFlag = true
		},
		// 单个添加到群组中
		batchoneAdd(index, row, rows) {
			if (rows) {
				if (row.promoter.groupId === 0) {
					this.promoterIds = row.promoter.id.toString();
				}
				this.$refs.multipleTable.toggleRowSelection(row);
				this.selectGroupFlag = true
			} else {
				this.$refs.multipleTable.clearSelection();
				this.selectGroupFlag = false
			}
			// console.log(this.selectable());
		},
		organizationRemoteMethod(query) {
			let searchApi;
			switch (this.filters.group_type) {
				case 1:
					searchApi = getPromoterGroupList
					break;
				case 2:
					searchApi = getPromoterTeamList
					break;
				default:
					this.$message.warning('请先选择团队类型');
					return;
			}
			if (query !== "") {
				this.organizationLoading = true;
				let parameter = {
					name: query
				};
				searchApi(parameter).then(res => {
					if (res.data.success && res.data.data.items) {
						this.organizationOptions = res.data.data.items.map(item => {
							let tempObj = {
								id: item.id,
								name: item.name,
							};
							return tempObj;
						});
					}
					this.organizationLoading = false;
				})
				.catch(error => {
					this.catchFunc(error);
				});
			} else {
				this.organizationOptions = [];
			}
		},
		selectGroupRemoteMethod(query) {
			if (query !== '') {
				this.selectGroupLoading = true;
				// let temp = Number(query);
				let parameter = {
					name: query
				};
				// if (temp) {
				// 	parameter['id'] = temp
				// } else {
				// 	parameter['name'] = query
				// };
				// 调用 加载列表的接口
				getPromoterGroupList(parameter).then((res) => {
						if (res.data.success) {
							this.selectGroupOptions = res.data.data.items.map((item) => {
								let tempObj = {
									id: item.id,
									name: item.name,
								}
								return tempObj
							});
						} else {
							this.$message.error(res.data.msg || '未知错误，请联系管理员');
						};
						this.selectGroupLoading = false;
					})
					.catch((error) => {
						this.catchFunc(error)
					})
			} else {
				this.selectGroupOptions = [];
			};
		},
		submitAddMemberToGroup() {
			let params = {
				promoter_group_id: this.selectGroup,
				promoter_id: this.promoterIds
			}
			addMemberForProGroup(params)
				.then((res) => {
					if (res.data.success) {
						this.selectGroupFlag = false
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
		selectable(row, index) {
			if (row.promoter.groupId === 0) {
				return true
			} else {
				return false
			}
		},
		handleExport() {
			let params = "?status=" + (this.filters.status?this.filters.status:'') + '&phone=' + (this.filters.phone?this.filters.phone:'') + "&station_number=" + (this.filters.station_number?this.filters.station_number:'')
			+ "&date_range_id=" + (this.filters.date_range_id?this.filters.date_range_id:'') + "&flag=" + (this.filters.flag?this.filters.flag:'') + "&url=" + (this.filters.url?this.filters.url:'') + "&check_stat=" + (this.filters.check_stat?this.filters.check_stat:'');
			if (this.filters.group_type === 1) {
				params += "&pro_gp_id=" + this.filters.rank_id
			} else if (this.filters.group_type === 2) {
				params += "&pro_tm_id=" + this.filters.rank_id
			} else {};
			console.log(params);
			// 借用隐藏的form表单提交数据 请求到excel进行下载
			this.$refs['oForm'].action = "/op/promoter/export" + params;
			this.$refs['oForm'].methods = 'post';
			this.$refs['oForm'].submit();
		},
		formatPromoterStat(row) {
			console.log();
			switch (row.promoter.stat) {
				case 0:
					return '已经离职'
					break;
				case 1:
					return '当前在职'
					break;
				case 2:
					return  row.parsed.number + '期请假'
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
		formatChannel(row) {
			switch (row.promoter.channel) {
				case 0:
					return '未知';
					break;
				case 1:
					return '微信公众号';
					break;
				case 2:
					return 'webapp';
					break;
				case 3:
					return '安卓 APP';
					break;
				case 4:
					return 'iOS APP';
					break;
				case 5:
					return '推广人推荐';
					break;
				case 6:
					return '总部';
					break;
				case 7:
					return '小队';
					break;
				default:
					return '未知';
			}
		},
		formatLeaderType(row, column) {
			let property = column.property.split('.')
			let type = row[property[0]][property[1]]
			switch (type) {
				case 0:
					return '推广人'
					break;
				case 1:
					return '组长'
					break;
				case 2:
					return '队长'
					break;
				case 3:
					return '组长、队长'
					break;
				default:

			}
		},
		formatPromoterType(row, column) {
			let property = column.property.split('.')
			let type = row[property[0]][property[1]]
			switch (type) {
				case 0:
					return '兼职'
					break;
				case 1:
					return '全职'
					break;
				default:
					return '未知';
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
		},
		changePosition() {
			console.log(1);
		},
		/**
		 * [selBatchRemoteMethod 查找推广人批次的方法]
		 * @param  {[type]} query [批次名字]
		 */
		selBatchRemoteMethod(query) {
			if (query !== "") {
				this.selBatchLoading = true;
				let parameter = {
					name: query,
					type: 1
				};
				getDateRangeList(parameter).then(res => {
						if (res.data.success && res.data.data.items) {
							this.selBatchOptions = res.data.data.items.map(item => {
								let tempObj = {
									id: item.entity.id,
									name: item.entity.name,
									startTime: util.formatDate.format(new Date(item.entity.startTime), 'yyyy/MM/dd'),
									endTime: util.formatDate.format(new Date(item.entity.endTime), 'yyyy/MM/dd'),
								};
								return tempObj;
							});
						}
						this.selBatchLoading = false;
					})
					.catch(error => {
						this.catchFunc(error);
					});
			} else {
				this.selBatchOptions = [];
			}
		},
		/**
		 * [selDateRangeRemoteMethod 查找推广人批次的方法]
		 * @param  {[type]} query [批次名字]
		 */
		selDateRangeRemoteMethod(query) {
			if (query !== "") {
				this.selDateRangeLoading = true;
				let parameter = {
					name: query,
					type: 1
				};
				getDateRangeList(parameter).then(res => {
					if (res.data.success && res.data.data.items) {
						this.selDateRangeOptions = res.data.data.items.map(item => {
							let tempObj = {
								id: item.entity.id,
								name: item.entity.name,
								startTime: util.formatDate.format(new Date(item.entity.startTime), 'yyyy/MM/dd'),
								endTime: util.formatDate.format(new Date(item.entity.endTime), 'yyyy/MM/dd'),
								time: [item.entity.startTime, item.entity.endTime]
							};
							return tempObj;
						});
					}
					this.selDateRangeLoading = false;
				})
				.catch(error => {
					this.catchFunc(error);
				});
			} else {
				this.selDateRangeOptions = [];
			}
		},
		selEnrollRangeRemoteMethod(query) {
			if (query !== "") {
				this.selEnrollRangeLoading = true;
				let temp = Number(query);
				let parameter = {
					type: 2
				};
				if (temp) {
					parameter['number'] = temp
				} else {
					parameter['name'] = query
				};
				getDateRangeList(parameter).then(res => {
					if (res.data.success && res.data.data.items) {
						this.selEnrollRangeOptions = res.data.data.items.map(item => {
							let tempObj = {
								id: item.entity.id,
								name: item.entity.name,
								startTime: util.formatDate.format(new Date(item.entity.startTime), 'yyyy/MM/dd'),
								endTime: util.formatDate.format(new Date(item.entity.endTime), 'yyyy/MM/dd'),
								time: [item.entity.startTime, item.entity.endTime],
								number: item.entity.number
							};
							return tempObj;
						});
					}
					this.selEnrollRangeLoading = false;
				})
				.catch(error => {
					this.catchFunc(error);
				});
			} else {
				this.selEnrollRangeOptions = [];
			}
		},
		selInviteRemoteMethod(query) {
			if (query !== "") {
				this.selInviteLoading = true;
				let temp = Number(query);
				let parameter = {};
				if (temp) {
					if (temp.toString().length === 11 && /^1[3456789]\d{9}$/.test(temp)) {
						parameter["phone"] = temp
					} else {
						parameter["station_number"] = temp
					}
				}
				getPromoterList(parameter).then(res => {
					if (res.data.success && res.data.data.items) {
						this.selInviteOptions = res.data.data.items.map(item => {
							let tempObj = {
								station_number: item.promoter.stationNumber?item.promoter.stationNumber:'',
								name: item.userWithInfo.user.name,
								mobile: item.userWithInfo.user.mobile
							};
							return tempObj;
						});
					}
					this.selInviteLoading = false;
				})
				.catch(error => {
					this.catchFunc(error);
				});
			} else {
				this.selInviteOptions = [];
			}
		},
		/**
		 * [submitUpdatePosition 提交修改推广人身份]
		 */
		submitUpdatePosition() {
			if (this.selBatch === '') {
				this.$message.error('请选择推广人批次');
				return;
			}
			if (this.update_position === '') {
				this.$message.error('请选择推广人身份');
				return;
			}
			let params = {
				date_range_id: this.selBatch,
				position: this.update_position
			};
			updatePosition(params)
				.then(res => {
					if (res.data.success) {
						this.batchAndPosition = false
						this.$message({
							type: 'success',
							message: '修改成功'
						})
						this.selBatch = '';
						this.update_position = '';
					} else {
						this.$notify({
							title: error.response.status,
							message: res.data.msg || '未知错误，请联系管理员',
							type: 'error'
						})
					}
				})
				.catch(error => {
					this.catchFunc(error);
				});
		},
		/**
		 * [submitWechatQrCode 提交微信个人二维码相关]
		 * @return {[type]} [description]
		 */
		submitWechatQrCode() {
			console.log(this.wechatQrCodeManageEntity);
			let params = {
				user_id: this.wechatQrCodeManageEntity.id,
				status: this.wechatQrCodeManageEntity.status,
				date_range_id: this.wechatQrCodeManageEntity.date_range_id,
				position: this.wechatQrCodeManageEntity.position,
				join_date: this.wechatQrCodeManageEntity.join_date,
				leave_date: this.wechatQrCodeManageEntity.leave_date,
				leave_reason: this.wechatQrCodeManageEntity.leave_reason,
				station_number: this.wechatQrCodeManageEntity.station_number,
				invite_uid: this.wechatQrCodeManageEntity.invite_uid,
				channel_id: this.wechatQrCodeManageEntity.channel_id,
				vacation_number: this.wechatQrCodeManageEntity.vacation_number,
				leave_type: this.wechatQrCodeManageEntity.leave_type,
				check_stat: this.wechatQrCodeManageEntity.check_stat,
				url: this.wechatQrCodeManageEntity.url,
				promoter_type: this.wechatQrCodeManageEntity.promoter_type
			}
			submitPromoterUpdate(params)
				.then((res) => {
					if (res.data.success) {
						this.$notify({
							title: '成功',
							message: '修改成功',
							type: 'success',
							duration: 1500
						})
						this.wechatQrCodeFlag = false
						this.loadData()
					} else {
						this.$notify.error(res.data.msg);
					}
				})
				.catch((error) => {
					this.catchFunc(error)
				})
		},
		/**
		 * [submitEditRecommend 提交修改推广人的推荐人]
		 * @return {[type]} [description]
		 */
		submitEditRecommend() {
			if (this.editRecommend.station_number  === '' || this.editRecommend.station_number  === undefined || this.editRecommend.station_number  === null) {
				this.$message.error('请选择一个推广人作为推荐人');
				return;
			}
			updatePrivilege(this.editRecommend)
				.then(res => {
					if (res.data.success) {
						this.$message({
							type: 'success',
							message: '修改成功'
						})
						this.dialogEditRecommend = false
						this.editRecommend.station_number = '';
						this.loadData();
					} else {
						this.$notify({
							title: error.response.status,
							message: res.data.msg || '未知错误，请联系管理员',
							type: 'error'
						})
					}
				})
				.catch(error => {
					this.catchFunc(error);
				});
		}
	},
	mounted() {
		this.loadData()
	},
	filters: {
		formatPlace(type) {
			switch (type) {
				case 1:
					return '请填写小组名称搜索'
					break;
				case 2:
					return '请填写小队名称搜索'
					break;
				default:
					return '请先选择团队类型';
			}
		},
		formatGroupName(name) {
			return name ? name : '未添加到小组'
		},
		formatPromoterStat(row) {
			switch (row) {
				case 0:
					return '已经离职'
					break;
				case 1:
					return '当前在职'
					break;
				case 2:
					return  '请假'
					break;
				default:
					return '状态未知'
			}
		},
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
.el-button + .el-button {
		margin-left: 0!important;
}
</style>
