<template lang="html">
	<section>
		<el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
		  <el-form :inline='true' :model='filters'>
				<el-form-item>
					<el-select v-model="filters.type" placeholder="请选择类型">
				    <el-option
				      v-for="item in applyTypeOptions"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
			  </el-form-item>
				<el-form-item>
					<el-select v-model="filters.status" placeholder="请选择状态" @change="changeApplyStatus">
				    <el-option
				      v-for="item in applyStatusOptions3"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
			  </el-form-item>
			  <el-form-item>
				  <el-input v-model='filters.user_id' placeholder='请输入用户 ID'  @keydown.enter.native.prevent @change="handleSeek" icon="circle-cross" :on-icon-click="handleIconClickAuthorId"></el-input>
			  </el-form-item>
				<el-form-item>
				  <el-input v-model='filters.username' placeholder='请输入用户名'  @keydown.enter.native.prevent @change="handleSeek" icon="circle-cross" :on-icon-click="handleIconClickUserName"></el-input>
			  </el-form-item>
				<el-form-item>
				  <el-input v-model='filters.phone' placeholder='请输入手机号'  @keydown.enter.native.prevent @change="handleSeek" icon="circle-cross" :on-icon-click="handleIconClickPhone"></el-input>
			  </el-form-item>
			  <el-form-item>
				  <el-button type='primary' @click='handleSeek'>查询</el-button>
			  </el-form-item>
		  </el-form>
		</el-col>

		<el-table :data="formData" border stripe>
			<!-- <el-table-column type="expand" fixed>
				<template scope="scope">

        </template>
			</el-table-column> -->
			<el-table-column prop='entity.id' label='ID' width='75' sortable align='center'></el-table-column>
			<el-table-column prop='entity.type' label='申请类型' width='100' align='center' :formatter='formatApplyType'></el-table-column>
			<el-table-column prop='entity.stat' label='申请状态' width='120' align='center' :formatter='formatApplyStat'></el-table-column>
			<el-table-column prop='entity.userEntity.name' label='用户昵称' width='160' align='center'></el-table-column>
			<el-table-column prop='entity.userEntity.gender' label='用户性别' width='100' align='center' :formatter='formatUserGender'></el-table-column>
			<el-table-column prop='entity.userEntity.type' label='用户类型' width='100' align='center' :formatter='formatUserType'></el-table-column>
			<el-table-column prop='parsed.channel' label='用户来源' width='100' align='center' :formatter='formatChannel'></el-table-column>
			<el-table-column prop='entity.hasClassCourse' label='是否购买精品课' width='100' align='center' :formatter='formatHasClassCourse'></el-table-column>
			<el-table-column prop='entity.userEntity.mobile' label='手机号码' width='125' align='center'></el-table-column>
			<el-table-column prop='entity.userEntity.birthday' label='用户生日' width='100' align='center'></el-table-column>
			<el-table-column prop='entity.userEntity.stat' label='用户状态' width='100' align='center' :formatter='formatUserStat'></el-table-column>
			<el-table-column prop='entity.userEntity.internal' label='内部用户' width='100' align='center' :formatter='formatUserInternal'></el-table-column>
			<el-table-column prop='entity.userEntity.signature' label='用户签名' min-width='240' align='center'></el-table-column>
			<el-table-column fixed="right" label='操作' width='70' align='center'>
				<template scope="scope">
	        <el-button type="text" size="small" @click="applyAuditFunc(scope.$index, scope.row)">审核</el-button>
		    </template>
			</el-table-column>
		</el-table>
		<el-col :span='24' class='toolbar'>
      <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='filters.page_size' :total='filters.total' style='float: right'></el-pagination>
    </el-col>

		<el-dialog
		  title=""
		  :visible.sync="dialogApplyAudit"
			>
			<el-form label-width="120px" :model="applyAuditEntity" :rules="applyAuditRules" ref="editItem">
				<el-form-item label="姓名：" v-if="applyAuditEntity.parsed && applyAuditEntity.parsed.name">
					<p>{{ applyAuditEntity.parsed.name }}</p>
				</el-form-item>

				<el-form-item label="性别：" v-if="applyAuditEntity.parsed && applyAuditEntity.parsed.sex !== ''">
					<p>{{ applyAuditEntity.parsed.sex | formatSex }}</p>
				</el-form-item>

				<el-form-item label="电话：" v-if="applyAuditEntity.parsed && applyAuditEntity.parsed.phone">
					<p>{{ applyAuditEntity.parsed.phone }}</p>
				</el-form-item>

				<el-form-item label="工作状态：" v-if="applyAuditEntity.parsed && applyAuditEntity.parsed.motherTypeName">
					<p>{{ applyAuditEntity.parsed.motherTypeName }}</p>
				</el-form-item>

				<el-form-item label="工作时长" v-if="applyAuditEntity.parsed && applyAuditEntity.parsed.timeThan">
					<p>{{ applyAuditEntity.parsed.timeThan }}</p>
				</el-form-item>

				<el-form-item label="修改状态：" >
					<el-radio-group v-model="applyAuditEntity.status">
						<el-radio-button :label="statu.value" v-for="(statu, index) in applyStatusOptions" :key="index">{{ statu.label }}</el-radio-button>
				  </el-radio-group>
				</el-form-item>

				<el-form-item label="分站号：" v-if="applyAuditEntity.status == 3 || applyAuditEntity.status == 4" prop="station_number">
					<el-input style="width:330px;" v-model='applyAuditEntity.station_number' placeholder='请输入用户分站号' icon="circle-cross" :on-icon-click="handleIconClickStation"></el-input>
				</el-form-item>

				<!-- <el-form-item label="批次：" v-if="applyAuditEntity.status == 3" prop="batch">
					<el-input style="width:330px;" v-model='applyAuditEntity.batch' placeholder='请输入用户批次' icon="circle-cross" :on-icon-click="handleIconClickBatch"></el-input>
				</el-form-item> -->

				<el-form-item label="未通过原因：" v-if="applyAuditEntity.status == 2" prop="extra">
					<el-input style="width:330px;" v-model='applyAuditEntity.extra' placeholder='请输入未通过原因' icon="circle-cross" :on-icon-click="handleIconClickExtra"></el-input>
				</el-form-item>

				<el-form-item label="入职时间：" v-if="applyAuditEntity.status == 3 || applyAuditEntity.status == 4">
					<el-date-picker
			      v-model="join_date"
			      type="date"
			      placeholder="选择日期"
						format="yyyy-MM-dd">
			    </el-date-picker>
				</el-form-item>
			</el-form>

		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogApplyAudit = false">取 消</el-button>
		    <el-button type="primary" @click="submitApplyAuditFunc">确 定</el-button>
		  </span>
		</el-dialog>
	</section>
</template>

<script>
import {
	submitApplyAudit,
	getApplyList,
	geUsersById
} from "../../api/api";
import util from "../../common/js/util";
export default {
	filters: {
		formatSex(sex) {
			switch (sex) {
				case 1:
					return "男";
					break;
				case 0:
					return "女";
					break;
				default:
					return "未知";
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
				type: "0",
				status: 0,
				user_id: "",
				uesrname: "",
				phone: ""
			},
			applyTypeOptions: [{
				value: "0",
				label: "推广人申请"
			}],
			applyStatusOptions: [{
					value: 1,
					label: "审核中"
				},
				{
					value: 2,
					label: "审核未通过"
				},
				{
					value: 4,
					label: "培训中"
				},
				{
					value: 5,
					label: "考核中"
				},
				{
					value: 6,
					label: "待定"
				},
				{
					value: 3,
					label: "审核通过"
				},
			],
			applyStatusOptions2: [{
					value: 1,
					label: "审核中"
				},
				{
					value: 2,
					label: "审核未通过"
				},
				{
					value: 4,
					label: "培训中"
				},
				{
					value: 5,
					label: "考核中"
				},
				{
					value: 6,
					label: "待定"
				},
			],
			applyStatusOptions3: [{
					value: 0,
					label: "等待审核"
				},
				{
					value: 1,
					label: "审核中"
				},
				{
					value: 2,
					label: "审核未通过"
				},
				{
					value: 3,
					label: "审核通过"
				},
				{
					value: 4,
					label: "培训中"
				},
				{
					value: 5,
					label: "考核中"
				},
				{
					value: 6,
					label: "待定"
				},
			],
			// 审核弹窗
			dialogApplyAudit: false,
			applyAuditEntity: {
				id: "",
				status: "",
				station_number: "",
				batch: "",
				extra: "",
				parsed: {
					name: "",
					phone: "",
					sex: "",
					motherTypeName: "",
					timeThan: ""
				}
			},
			join_date: new Date(),
			applyAuditRules: {
				station_number: [{
					required: true,
					message: "请输入分站号",
					trigger: "blur"
				}],
				// batch: [{
				// 	required: true,
				// 	message: '请输入批次',
				// 	trigger: 'blur'
				// }],
				extra: [{
					required: true,
					message: "请输入未通过原因",
					trigger: "blur"
				}]
			},
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 8.64e7;
				}
			},
			loading: true
		};
	},
	methods: {
		loadData() {
			this.loading = true;
			let params = {
				page_index: this.filters.page_index,
				page_size: this.filters.page_size,
				type: this.filters.type,
				status: this.filters.status,
				user_id: this.filters.user_id,
				username: this.filters.username,
				phone: this.filters.phone
			};
			getApplyList(params)
				.then(res => {
					if (res.data.success) {
						this.filters.total = res.data.data.totalCount;
						this.formData = res.data.data.items ? res.data.data.items : [];
					} else {
						this.$notify.error(res.data.msg);
					}
				})
				.catch(error => {
					this.catchFunc(error);
				});
		},
		// 查找方法
		handleSeek() {
			this.loadData();
		},
		// 点击错号按钮
		handleIconClickAuthorId() {
			this.filters.user_id = "";
			this.handleSeek();
		},
		handleIconClickUserName() {
			this.filters.username = "";
			this.handleSeek();
		},
		handleIconClickPhone() {
			this.filters.phone = "";
			this.handleSeek();
		},
		handleIconClickExtra() {
			this.applyAuditEntity.extra = "";
		},
		handleIconClickBatch() {
			this.applyAuditEntity.batch = "";
		},
		handleIconClickStation() {
			this.applyAuditEntity.station_number = "";
		},
		changeApplyStatus(value) {
			this.loadData();
		},
		// 分页
		handleCurrentChange(val) {
			this.listLoading = true;
			this.filters.page_index = val;
			this.loadData();
		},
		// 点开 审核
		applyAuditFunc(index, row) {
			this.dialogApplyAudit = true;
			this.applyAuditEntity = {
				id: row.entity.id,
				status: row.entity.stat,
				hasClassCourse: row.entity.hasClassCourse,
				parsed: row.parsed
			};
			console.log(this.applyAuditEntity);
		},
		// 提交审核
		submitApplyAuditFunc() {
			this.$refs["editItem"].validate(valid => {
				let params = {
					id: this.applyAuditEntity.id,
					status: this.applyAuditEntity.status,
					station_number: this.applyAuditEntity.station_number,
					batch: this.applyAuditEntity.batch,
					extra: this.applyAuditEntity.extra,
					join_date: Date.parse(this.join_date)
				};
				submitApplyAudit(params)
					.then(res => {
						if (res.data.success) {
							this.$notify({
								title: "成功",
								message: "审核成功",
								type: "success",
								duration: 1500
							});
							this.dialogApplyAudit = false;
							this.loadData();
						} else {
							this.$notify.error(res.data.msg);
						}
					})
					.catch(error => {
						this.catchFunc();
					});
			});
		},
		// 取消审核
		handleClose(done) {
			this.$confirm("确认关闭？")
				.then(_ => {
					done();
				})
				.catch(_ => {});
		},
		// 格式化数据
		formatApplyType(row) {
			switch (row.entity.type) {
				case 0:
					return "推广人";
					break;
				default:
					return "未知";
			}
		},
		formatApplyStat(row) {
			switch (row.entity.stat) {
				case 0:
					return "等待审核";
					break;
				case 1:
					return "审核中";
					break;
				case 2:
					return "审核未通过";
					break;
				case 3:
					return "审核通过";
					break;
				case 4:
					return "培训中";
					break;
				case 5:
					return "考核中";
					break;
				case 6:
					return "待定";
					break;
				default:
					return "状态未知";
			}
		},
		formatUserGender(row) {
			switch (row.entity.userEntity.gender) {
				case 0:
					return "未知";
					break;
				case 1:
					return "男";
					break;
				case 2:
					return "女";
					break;
				default:
					return "未知";
			}
		},
		formatUserType(row) {
			switch (row.entity.userEntity.type) {
				case 0:
					return "普通用户";
					break;
				case 1:
					return "官方";
					break;
				case 2:
					return "合作个人";
					break;
				case 3:
					return "合作媒体";
					break;
				case 4:
					return "转载媒体";
					break;
				default:
					return "未知";
			}
		},
		formatChannel(row) {
			if (row.parsed) {
				switch (row.parsed.channel) {
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
					default:
						return '未知';
				}
			} else {
				return '未知';
			}
		},
		formatHasClassCourse(row) {
			switch (row.entity.hasClassCourse) {
				case '0':
					return '未购买';
					break;
				case '1':
					return '已购买';
					break;
				default:
					return '未知'

			}
		},
		formatUserStat(row) {
			switch (row.entity.userEntity.stat) {
				case 0:
					return "有效";
					break;
				case 1:
					return "禁言";
					break;
				case 2:
					return "冻结";
					break;
				default:
					return "未知";
			}
		},
		formatUserInternal(row) {
			switch (row.entity.userEntity.internal) {
				case 0:
					return "否";
					break;
				case 1:
					return "是";
					break;
				default:
			}
		},
		catchFunc(error) {
			if (error.response) {
				this.$notify({
					title: error.response.status,
					message: "网络请求错误",
					type: "error"
				});
			} else if (error.request) {
				this.$notify({
					title: error.request,
					message: "网络请求错误",
					type: "error"
				});
			} else {
				this.$notify({
					title: "错误",
					message: error.message,
					type: "error"
				});
			}
			this.loading = false;
		}
	},
	mounted() {
		this.loadData();
	}
};
</script>

<style lang="css">

</style>
