<template lang="html">
	<section>
		<el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
		  <el-form :inline='true'>
			  <el-form-item >
					<el-date-picker
			      v-model="timeRange"
			      type="daterange"
						:picker-options="pickerOptions"
			      placeholder="选择日期范围">
			    </el-date-picker>
			  </el-form-item>
			  <el-form-item>
				  <el-button type='primary' @click='handleSeek'>查询</el-button>
			  </el-form-item>
		  </el-form>
		</el-col>

		<el-table :data='formData' v-loading='listLoading' style='width: 100%;' border stripe tooltip-effect='light'>
			<el-table-column prop='id' label='ID' width='75' sortable align='center' fixed></el-table-column>
			<el-table-column prop='content' label='内容'  width='680'></el-table-column>
			<el-table-column prop='contact' label='用户手机' width='130' align='center'></el-table-column>
			<el-table-column prop='platform' label='系统类型' width='100' align='center' :formatter='formatPhone'></el-table-column>
			<el-table-column prop='device' label='手机型号' width='130' align='center'></el-table-column>
			<el-table-column prop='osVersion' label='OS版本' width='100' align='center'></el-table-column>
			<el-table-column prop='appVersion' label='App版本' width='100' align='center'></el-table-column>
			<el-table-column prop='userId' label='用户 ID' width='100' align='center'></el-table-column>
			<el-table-column label='创建时间' width='170' align='center' :formatter='formatDate'></el-table-column>
		</el-table>

		<el-col :span='24' class='toolbar'>
        <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='20' :total='total' style='float: right'></el-pagination>
    </el-col>
	</section>
</template>

<script>
import util from '../../common/js/util'
import { getFeedback } from '../../api/api'
export default {
	data () {
		return {
			timeRange: '',
			// 反馈列表数据
			formData: [],
			listLoading: false,
			// 分页
			page_index: 1,
			total: 0,
			start: '',
			end: '',
			pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
		}
	},
	methods: {
		loadData(){
			let parameter = {
				page_index: this.page_index,
				start: this.start,
				end: this.end
			};
			getFeedback(parameter)
				.then((res) => {
					this.formData = res.data.data.items
					this.total = res.data.data.totalCount;
					this.listLoading = false;
				})
				.catch((error) => {
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
					this.listLoading = false;
				})
		},
		handleSeek () {
			this.start = util.formatDate.format(this.timeRange[0], 'yyyy-MM-dd')
			this.end = util.formatDate.format(this.timeRange[1], 'yyyy-MM-dd')
			this.loadData();
		},
		// 分页
		handleCurrentChange(val) {
			this.listLoading = true;
			this.page_index = val;
			this.loadData();
		},
		// 格式化时间
		formatDate(row) {
			return util.formatDate.format(new Date(row.ct), 'yyyy/MM/dd hh:mm:ss');
		},
		formatPhone (row) {
			switch (row.platform) {
				case 1:
					return 'iOS'
					break;
				case 2:
					return 'Android'
					break;
				default:

			}
		}
	},
	mounted () {
		this.loadData()
	}
}
</script>

<style lang="css">
</style>
