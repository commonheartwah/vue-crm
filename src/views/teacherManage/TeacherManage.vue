<template lang="html">
	<section>
		<Toolbar :placeHolder="['请输入教师名字','请输入教师性别']" :addItemTitle='addItemTitle' v-on:emitHandleSeek='onHandleSeek' v-on:emitHandleAdd='emitHandleAdd'></Toolbar>
		<FormList :formData='formdata' :formTitle='formTitle' :editItemForm='editItemTitle' style="width:100%;" v-on:submitEdit='submitEdit' v-on:uploadHeaderPic='uploadHeaderPic'  v-loading="loading" element-loading-text="努力加载中"></FormList>
		<el-col :span='24' class='toolbar'>
            <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='20' :total='total' style='float: right'></el-pagination>
        </el-col>

		<el-dialog title="上传头像" :visible.sync="uploadHeaderPicVisible">
			<el-upload
				drag
				class="upload-demo"
				ref="upload"
				action="/op/material/upload_image"
				name="bin"
				list-type="picture"
				:on-change="handleChange"
				:before-upload="beforeAvatarUpload"
				:file-list="fileList"
				:on-success="handleSuccess">
				<i class="el-icon-upload"></i>
  				<div class="el-upload__text">将文件拖到此处，或<em>点击选取文件</em></div>
				<div slot="tip" class="el-upload__tip">只支持单个文件上传 且只能上传jpg/png文件</div>
			</el-upload>
		</el-dialog>
	</section>
</template>

<script>
import FormList from '../../components/formList'
import Toolbar from '../../components/toolbar'

import {
	addNewTeacher,
	updateTeacher,
	getTeacherList
} from '../../api/api';

export default {
	components: {
		FormList,
		Toolbar
	},
	data() {
		return {
			// 列表 是否显示判断表
			formTitle: {
				id: {
					label: 'ID',
					width: '73'
				},
				name: {
					label: '姓名',
					width: '100'
				},
				description: {
					label: '描述',
					width: ''
				},
				gender: {
					label: '性别',
					width: '65'
				},
				age: {
					label: '年龄',
					width: '65'
				},
				expand:{
					label: '面板'
				},
				button:{
					edit:{
						label:'编辑'
					},
					uploadHeader:{
						label:'上传头像'
					},
					width: '150'
				}
			},
			// 添加表单里 是否显示判断表
			addItemTitle: {
				formHeader:{
					label: '新增老师'
				},
				name: {
					label: '名称',
					width: ''
				},
				description: {
					label: '描述',
					width: ''
				},
				gender: {
					label: '性别',
					width: ''
				},
				age: {
					label: '年龄',
					width: ''
				},
				input:{
					id:{
						label: 'id'
					},
                    name:{
                        label: 'name'
                    }
                },
				button:{
					seek:{
						label:'查询'
					},
					add:{
						label:'新增'
					}
				}
			},
			// 编辑表单里 是否显示判断表
			editItemTitle: {
				formHeader:{
					label: '编辑老师信息'
				},
				name: {
					label: '名称',
					width: ''
				},
				description: {
					label: '描述',
					width: ''
				},
				gender: {
					label: '性别',
					width: ''
				},
				age: {
					label: '年龄',
					width: ''
				},
			},
			formdata: [],
			total: 0,
			uploadHeaderPicVisible: false,
			// 上传头像 相关
			fileList: [],
			editTeacherObj: {},
			loading: true,
		};
	},
	methods: {
		// 加载 Teacher 列表
		initTeachersList(obj) {
			let parameter = {
				age: obj.age,
				name: obj.name,
				gender: obj.gender,
				page_index: obj.page_index,
			};
			// 调用 加载列表的接口
			getTeacherList(parameter)
				.then((res) => {
					if (res.data.success) {
						if (res.data.data.items) {
							this.formdata = res.data.data.items;
						}
						this.total = res.data.data.totalCount;
					}else{
						this.$notify.error(res.data.msg);
					}
					this.loading = false;
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
					this.loading = false;
				});
		},
		// 查询 按钮的监听
			// 传入 写入的 性别 或者 name 。并调用 Teacher 列表接口方法
		onHandleSeek(obj){
			let gender = '';
			if (obj.name == '男') {
				gender = 1;
			};
			if (obj.name == '女') {
				gender = 2;
			};
			let params = {
				gender: gender,
				name: obj.id
			};
			this.initTeachersList(params);
		},
		// 新增页面 确定 的监听
		emitHandleAdd(obj) {
			let parameter = {
				name: obj.name,
				description: obj.description,
				gender: obj.gender,
				age: obj.age
			};
			addNewTeacher(parameter).then((res) => {
				if (res.data.success) {
					this.initTeachersList('');
					this.$notify({
						title: '成功',
						message: '添加成功',
						type: 'success',
						offset: 45
					});
				} else {
					this.$notify({
						title: '失败',
						message: res.data.msg,
						type: 'error',
						offset: 45
					});
				};
			});
		},
		// 分页
		handleCurrentChange(val) {
			this.loading = true;
			let parameter = {
				page_index: val,
			};
			this.initTeachersList(parameter);
		},
		// 提交 Teacher 改变
		submitEdit(obj, itemFlag) {
			// 1 是编辑 教师。
			if (itemFlag === 1) {
				this.editTeacher(obj); // 编辑教师 的方法
			};
		},
		// 编辑 教师 的接口调用
		editTeacher(obj){
			let parameter = {
				id: obj.id,
				name: obj.name,
				description: obj.description,
				gender: obj.gender,
				age: obj.age,
				pic: obj.icon,
			};
			updateTeacher(parameter).then((res) => {
				if (res.data.success) {
					this.initTeachersList('');
					this.uploadHeaderPicVisible = false;
					this.$notify({
						title: '成功',
						message: '修改成功',
						type: 'success',
						offset: 45
					});
				} else {
					this.$notify({
						title: '失败',
						message: res.data.msg,
						type: 'error',
						offset: 45
					});
				};
			});
		},
		// 上传头像 窗口的触发函数
		uploadHeaderPic(obj){
			this.uploadHeaderPicVisible = true;
			this.editTeacherObj = JSON.parse(JSON.stringify(obj));
		},
		//on-change 对应的函数 文件状态改变的时候触发
		handleChange(file, fileList){
            if (fileList.length>1) {
                fileList.length = 1;
                this.$message.error('只支持单个文件上传');
            };
        },
		beforeAvatarUpload(file) {
	        const isJPG = file.type === 'image/jpeg';
	        const isLt2M = file.size / 1024 / 1024 < 2;

	        if (!isJPG) {
	          this.$message.error('上传头像图片只能是 JPG 格式!');
	        }
	        if (!isLt2M) {
	          this.$message.error('上传头像图片大小不能超过 2MB!');
	        }
	        return isJPG && isLt2M;
		},
		submitUpload() {
            this.$refs.picForm.validate((valid)=> {
                let tempObj = {
                    name: this.picForm.name,
                    tags: this.picForm.dynamicTags.join(','),
                };
                Object.assign(this.$refs.upload.data, tempObj);// 发送请求附带参数的补充
                this.$refs.upload.submit();
            });
        },
		// 成功之后的返回
		handleSuccess(response, file, fileList){
            if (response.success) {
				this.editTeacherObj['icon'] = response.data;
				this.editTeacher(this.editTeacherObj);
            }else{
                this.$message.error(response.msg);
            }
			fileList.length = 0;
        },
	},
	created() {
		this.initTeachersList('');
	}
}
</script>

<style lang="css">
</style>
