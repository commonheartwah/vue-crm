<template lang="html">
	<section>
		<el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
		    <el-form :inline='true' :model='filters'>
				<el-form-item>
					<el-select v-model="filters.user_id" style="width: 240px;" placeholder="请输入用户昵称或手机号查询" filterable clearable remote :remote-method="selUserRemoteMethod" :loading='selUserLoading' @change="init">
						<el-option v-for="item in selUserOptions" :key="item.id" :label="item.name + '----' + item.mobile" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.plan_id" style="width: 240px;" placeholder="请输入计划名称查询" filterable clearable remote :remote-method="selPlanRemoteMethod" :loading='selPlanLoading' @change="init">
						<el-option v-for="item in selPlanOptions" :key="item.id" :label="'(' + item.id + ')' + item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-date-picker v-model="filters.date_range" type="daterange" placeholder="选择日期范围"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type='primary' @click='init'>查询</el-button>
					<el-button type='primary' @click='importFormVisible = true'>导入csv文件</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type='primary' @click='handleExport'>导出</el-button>
				</el-form-item>
		    </el-form>
		</el-col>
		<el-table border :data="datalist" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop='entity.id' label='ID' width='80' sortable align='center'></el-table-column>
			<el-table-column prop='entity.userName' label='用户名' min-width="200" align='center' show-overflow-tooltip></el-table-column>
			<el-table-column prop='entity.mobile' label='手机号' width='130' align='center'></el-table-column>
			<el-table-column prop='entity.planName' label='计划名称' min-width="200" align='center' show-overflow-tooltip></el-table-column>
			<el-table-column prop='entity.wxId' label='微信号' width='150' align='center' show-overflow-tooltip></el-table-column>
			<el-table-column prop='entity.equipNum' label='设备名称' width='100' align='center' show-overflow-tooltip></el-table-column>
			<el-table-column prop='entity.addState' label='添加结果' width='100' align='center' :formatter='formatAddState'></el-table-column>
			<el-table-column prop='entity.searchState' label='搜索结果' width='100' align='center' :formatter='formatSearchState'></el-table-column>
			<el-table-column label="操作" width="100" align="center" fixed="right">
				<template scope="scope">
                    <el-button-group>
                        <el-button type="warning" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                    </el-button-group>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页条 -->
        <el-col :span='24' class='toolbar'>
            <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size="page_size" :total="totalCount" style='float: right'></el-pagination>
        </el-col>

		<el-dialog title='导入csv' v-model='importFormVisible' :close-on-click-modal='false'>
			<el-form :model='importForm' label-width='10px' ref='importForm'>
				<el-form-item>
					<el-upload
						class="upload-demo"
						ref="upload"
						action="/op/class/user/wx/csv"
						name="bin"
						:on-change="handleChange"
						:file-list="fileList"
						:auto-upload="false"
						:on-success="handleSuccess"
					>
						<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
						<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
						<div slot="tip" class="el-upload__tip">只支持单个文件上传 且只能上传csv文件</div>
					</el-upload>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!-- 隐藏的form表单 接收服务器发来的excel文件 用form表单的post进行请求 浏览器会自动下载 别的方式暂时不可以 -->
		<section>
			<form method="post" ref="oForm"></form>
		</section>
	</section>
</template>

<script>
import util from '../../common/js/util'
import {
	getAppuserList,
	getPlanList,
	delClassUserWxList,
	getClassUserWxList
} from '../../api/api'
export default {
	data() {
		return {
			filters: {
				user_id: '',
				plan_id: '',
				date_range: ''
			},
			selUserLoading: false,
			selUserOptions: [],
			selPlanLoading: false,
			selPlanOptions: [],

			datalist: [],
			listLoading: false,

			page_size: 20,
			totalCount: 0,
			page_index: 1,

			/*
                导入excel界面
             */
            importFormVisible: false,
            importForm: {},
			fileList: [],
		}
	},
	methods: {
		init() {
			let params = {
				page_size: this.page_size,
				page_index: this.page_index,
				user_id: this.filters.user_id,
				plan_id: this.filters.plan_id,
				start_time: this.filters.date_range[0] ? this.filters.date_range[0].getTime() : '',
				end_time: this.filters.date_range[1] ? this.filters.date_range[1].getTime() : '',
			}
			this.datalist = [];
			this.listLoading = true;
			getClassUserWxList(params)
				.then((res) => {
					if (res.data.success) {
						this.datalist = res.data.data.items;
						this.totalCount = res.data.data.totalCount;
					} else {
						this.$notify.error(res.data.msg);
					}
					this.listLoading = false;
				})
				.catch(error => {
					this._catch(error);
					this.listLoading = false;
				});
		},
		// 分页
		handleCurrentChange(val) {
			this.page_index = val;
			this.init();
		},
		handleDel(index, row){
			this.$confirm("确认删除吗?", "提示", {}).then(() => {
				let para = {
					ids: row.entity.id
				}
				delClassUserWxList(para).then(res => {
						if (res.data.success) {
							this.$notify({
								title: "成功",
								type: "success",
								message: "操作成功"
							});
							this.init();
						} else {
							this.$notify({
								title: "错误",
								type: "error",
								message: res.data.msg
							});
						}
					})
					.catch(error => {
						this._catch(error);
					});
			})
        },
		//on-change 对应的函数 文件状态改变的时候触发
        handleChange(file, fileList){
			let reg = /\.(?:csv)$/i;
			console.log(file);
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
                    message: '只支持类型为csv的文件上传',
                    type: 'error'
                });
				fileList.length = 0;
			}
			// if (file.raw.type !== 'text/csv') {
			// 	this.$notify({
            //         title: '错误',
            //         message: '只支持类型为csv的文件上传',
            //         type: 'error'
            //     });
			// 	fileList.length = 0;
			// }
        },
		submitUpload() {
            if (this.$refs.upload.uploadFiles[0]) {
                this.$refs.upload.submit();
            }else{
                this.$notify({
                    title: '错误',
                    message: '请选择excel文件',
                    type: 'error'
                });
            }
        },
		handleSuccess(response, file, fileList){
            if (response.success) {
                this.$notify({
                    title: '成功',
                    message: '操作成功,请等待处理...',
                    type: 'success'
                });
                this.$refs['importForm'].resetFields();
                this.$refs['upload'].uploadFiles.length = 0;
                this.importFormVisible = false;
                // 2s后加载列表
                let self = this;
                this.totalCount = 0;
                setTimeout(function(){
					self.init();
                }, 2000)
            }else{
                this.$notify({
                    title: '错误',
                    message: response.msg,
                    type: 'error'
                })
            }
        },
		handleExport() {
			let params = "?page_index=" + this.page_index + '&page_size=' + this.page_size + "&user_id=" + this.filters.user_id + "&plan_id=" + this.filters.plan_id
						 + "&start_time=" + (this.filters.date_range[0] ? this.filters.date_range[0].getTime() : '') + "&end_time=" + (this.filters.date_range[1] ? this.filters.date_range[1].getTime() : '');
			// 借用隐藏的form表单提交数据 请求到excel进行下载
			this.$refs['oForm'].action = "/op/class/user/wx/exportCsv" + params;
			this.$refs['oForm'].methods = 'post';
			this.$refs['oForm'].submit();
		},
		formatAddState(row, column) {
			let property = column.property.split('.');
            let stat = row[property[0]][property[1]];
			switch (stat) {
				case 0:
					return '准备添加'
					break;
				case 1:
					return '添加成功'
					break;
				case 2:
					return '添加失败'
					break;
				default:
					return '未知';
			}
		},
		formatSearchState(row, column) {
			let property = column.property.split('.');
            let stat = row[property[0]][property[1]];
			switch (stat) {
				case 0:
					return '准备搜索'
					break;
				case 1:
					return '搜索成功'
					break;
				case 2:
					return '搜索失败'
					break;
				default:
					return '未知';
			}
		},
		selUserRemoteMethod(query) {
			if (query !== "") {
				this.selUserLoading = true;
				let parameter = {};
				if (/^1[3456789]\d{9}$/.test(query)) {
					parameter["mobile"] = query
				} else {
					parameter["username"] = query
				}
				getAppuserList(parameter).then(res => {
						if (res.data.success && res.data.data.items) {
							this.selUserOptions = res.data.data.items.map(item => {
								let tempObj = {
									id: item.id,
									name: item.name,
									mobile: item.mobile || "未绑定"
								};
								return tempObj;
							});
						}
						this.selUserLoading = false;
					})
					.catch(error => {
						this._catch(error);
					});
			} else {
				this.selUserOptions = [];
			}
		},
		selPlanRemoteMethod(query) {
			if (query !== "") {
				this.selPlanLoading = true;
				let parameter = {};
				parameter["plan_name"] = query
				getPlanList(parameter).then(res => {
						if (res.data.success && res.data.data.items) {
							this.selPlanOptions = res.data.data.items.map(item => {
								let tempObj = {
									id: item.entity.id,
									name: item.entity.name,
								};
								return tempObj;
							});
						}
						this.selPlanLoading = false;
					})
					.catch(error => {
						this._catch(error);
					});
			} else {
				this.selPlanOptions = [];
			}
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
		}
	},
	mounted() {
		this.init()
	}
}
</script>

<style lang="css">

</style>
