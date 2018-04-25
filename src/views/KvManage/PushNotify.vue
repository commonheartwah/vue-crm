<template lang="html">
    <section class="screenEdit" style="width: 500px;" v-loading="listLoading">
        <el-form :model='editForm' label-width='100px' :rules='editFormRules' ref='editForm'>
            <el-form-item label='内容类型' prop='type'>
				<el-select v-model="editForm.type" placeholder="请选择内容类型">
			        <el-option label="文本消息" value="1"></el-option>
					<el-option label="H5页" value="2"></el-option>
			        <el-option label="App Page" value="3"></el-option>
			    </el-select>
			</el-form-item>
            <el-form-item label='用户类型' prop='push_target'>
				<el-select v-model="editForm.push_target" placeholder="请选择用户类型">
			        <el-option label="所有App用户" value="1"></el-option>
					<el-option label="指定的用户ID" value="2"></el-option>
			    </el-select>
            </el-form-item>
            <el-form-item label='平台类型' prop='platform_type'>
				<el-select v-model="editForm.platform_type" placeholder="请选择用户类型">
                    <el-option label="所有平台" value="0"></el-option>
			        <el-option label="iOS" value="1"></el-option>
					<el-option label="Android" value="2"></el-option>
			    </el-select>
            </el-form-item>
            <el-form-item label="推送内容" prop='content'>
                <el-input type="textarea" v-model="editForm.content"></el-input>
			</el-form-item>
            <el-form-item label='推送参数' prop='params'>
                <el-input type="textarea" v-model='editForm.params' style="width: 400px;"></el-input>
            </el-form-item>
            <el-form-item label='推送URL' prop='editForm'>
                <el-input v-model='editForm.url' style="width: 400px;" placeholder="指向右方小按钮可查看url输入提示">
                    <template slot="append">
                        <el-tooltip placement="right" effect='light'>
                            <div slot="content">
                                <p style='font-size:14px;margin:15px 0;'>参考样式：</p>
                                <img src="../../../static/images/UrlReminder.png" style='width:500px' alt="">
                            </div>
                            <i class="fa fa-info fa-lg"></i>
                        </el-tooltip>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label='用户 IDS' prop='user_ids' v-if="editForm.push_target == '2'">
                <el-input type="textarea" v-model='editForm.user_ids' style="width: 400px;" placeholder='请填写用户id,多个用英文逗号分隔'></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="float: right" v-if="!listLoading">
            <el-button @click="resetForm('editForm')">重置</el-button>
            <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
        </div>
    </section>
</template>

<script>
// 引入axios实例
import {
	pushNotify
} from '../../api/api'

export default {
	data() {
		return {
			listLoading: false,
			/*
			    编辑
			*/
			editLoading: false, //编辑界面是否显示加载
			editFormRules: { //编辑界面表单规则
				type: [{
					required: true,
					message: '请选择内容类型',
					trigger: 'blur'
				}],
				push_target: [{
					required: true,
					message: '请选择用户类型',
					trigger: 'blur'
				}],
				platform_type: [{
					required: true,
					message: '请选择用户类型',
					trigger: 'blur'
				}],
				content: [{
					required: true,
					message: '请填写推送内容',
					trigger: 'blur'
				}],
			},
			editForm: {
				type: '1',
				push_target: '1',
				platform_type: '0',
				content: '',
				params: '',
				url: '',
				user_ids: '',
			},
		}
	},
	methods: {
		// 编辑页面提交
		editSubmit() {
			if (this.editForm.push_target == 2) {
				if (this.editForm.user_ids == '') {
					this.$message({
						message: '用户id不能为空',
						type: 'warning'
					});
					return;
				}
			}
			this.$refs.editForm.validate((valid) => {
				if (valid) {
					// 做校验 id不能出现非数字
					let arr = this.editForm.user_ids.split(',');
					for (let i = 0; i < arr.length; i++) {
						let Num = Number(arr[i])
						if (!Number.isInteger(Num)) {
							this.$message.error(arr[i] + ' -> 不合法id,请重新输入');
							// 校验失败 跳出
							return false;
						}
					};
					this.$confirm('确认提交吗?', '提示', {}).then(() => {
						this.editLoading = true;
						pushNotify(this.editForm).then((res) => {
							if (res.data.success) {
								this.$notify({
									message: '推送成功',
									type: 'success'
								});
								this.editForm = {
									type: '1',
									push_target: '1',
									platform_type: '0',
									content: '',
									params: '',
									url: '',
									user_ids: '',
								};
								this.editLoading = false;
							} else {
								this.$notify.error(res.data.msg);
							}
						})
					}).catch(() => {
						this.$message.error('取消操作');
					});
				}
			})
		},
		resetForm(formName) {
			this.editForm = {
				type: '1',
				push_target: '1',
				platform_type: '0',
				content: '',
				params: '',
				url: '',
				user_ids: '',
			};
		}
	}
}
</script>

<style lang="less" scoped>
.screenEdit {
    margin-top: 20px;
}
</style>
