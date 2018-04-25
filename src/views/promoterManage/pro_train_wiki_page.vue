<template>
<div>
	<el-form class="form-container" :model="postForm" ref="postForm" label-width="100px">
		<el-form-item label="集训营名称：">
			<div>{{ postForm.name }}</div>
		</el-form-item>
		<el-form-item label="课节名称：">
			<div>{{ postForm.lesson_name }}</div>
		</el-form-item>
		<el-form-item label="有效时间：">
			<el-date-picker v-model="sectionTime" type="datetimerange" placeholder="选择日期时间：">
			</el-date-picker>
		</el-form-item>
		<el-form-item label="展示时间：">
			<el-date-picker v-model="showTime" type="datetime" placeholder="选择日期时间："></el-date-picker>
		</el-form-item>
		<el-form-item label="课程类型：">
			<el-select v-model="postForm.license_type" placeholder="推广人类型" style="width: 120px">
				<el-option label="兼职" :value="0"></el-option>
				<el-option label="全职" :value="1"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="话术内容：">
			<el-input type="textarea" v-model="postForm.content" style="width: 700px;" :rows="20"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="submitForm">{{ isEdit ? "保存" : "新建" }}</el-button>
			<el-button type="danger" @click="delWiki" v-if="isEdit">删除</el-button>
		</el-form-item>
	</el-form>
</div>
</template>

<script>
import {
	getTrainingWikiList,
	updateTrainingWikiList,
	addTrainingWikiList,
	delTrainingWikiList,
	generateLink,
	transformShortUrl,
	getTrainCampList,
	getLessonList
} from '../../api/api';
import util from '../../common/js/util'

export default {
	data() {
		return {
			postForm: {
				name: '',
				lesson_name: '',
				content: '',
				url: '',
				license_type: 0
			},
			sectionTime: [],
			showTime: '',
			isEdit: false
		}
	},
	created() {
		this.fetchData();
	},
	methods: {
		fetchData() {
			this.initTrainCampName();
			this.initLessonName();
			let parameter = {
				training_id: this.$route.query.camp_id,
				lesson_id: this.$route.query.lesson_id,
			}
			getTrainingWikiList(parameter).then(res => {
				if (res.data.success) {
					if (res.data.data.items && res.data.data.items.length) {
						this.isEdit = true;
						this.postForm.content = res.data.data.items[0].entity.content;
						this.postForm.license_type = res.data.data.items[0].entity.licenseType ? res.data.data.items[0].entity.licenseType : 0;
						this.$set(this.postForm, 'id', res.data.data.items[0].entity.id)
						this.$set(this.sectionTime, 0, new Date(res.data.data.items[0].entity.startTime));
						this.$set(this.sectionTime, 1, new Date(res.data.data.items[0].entity.endTime));
						this.showTime = new Date(res.data.data.items[0].entity.showTime);
					} else {
						this.isEdit = false;
					}
				}
			}).catch((error) => {
				this._catch(error);
			});
		},
		submitForm() {
			if (!this.sectionTime[1]) {
				this.$message({
					message: '请填写有效时间范围',
					type: 'error'
				})
				return;
			}
			if (!this.showTime) {
				this.$message({
					message: '请填写展示时间',
					type: 'error'
				})
				return;
			}
			if (!this.postForm.content) {
				this.$message({
					message: '请填写话术内容',
					type: 'error'
				})
				return;
			}
			this.linkCourseCreated();
		},
		/**
		 * [delWiki 删除wiki]
		 * @return {[type]} [description]
		 */
		delWiki() {
			this.$confirm('此操作将永久删除该话术, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let params = {
					ids: this.postForm.id
				}
				delTrainingWikiList(params)
					.then((res) => {
						if (res.data.success) {
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
							this.$router.go(-1);
						} else {
							this.$notify({
								title: '失败',
								message: res.data.msg,
								type: 'error',
								offset: 45
							});
						}
					})

			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
		},
		/**
		 * [linkCourseCreated 生成课程／课节链接 之后并提交]
		 * @param  {[type]} type  [0 课程 1 1.0课节  2  2.0课节]
		 * @param  {[type]} index [description]
		 * @param  {[type]} item  [description]
		 * @param  {[type]} flag  [0 折叠目录形式无地图  1 不带2.0地图页  2 带2.0地图页]
		 * @return {[type]}       [description]
		 */
		linkCourseCreated(type, index, item, flag) {
			let para = {
				camp_id: this.$route.query.camp_id,
				type: 0,
				course_id: this.$route.query.course_id,
				lesson_id: this.$route.query.lesson_id,
				expire_time: new Date(this.sectionTime[1]).getTime(),
				day: this.$route.query.day,
				flag: 2
			}
			generateLink(para).then(res => {
					if (res.data.success) {
						let paraShortUrl = {
							url: res.data.data.linkUrl
						}
						transformShortUrl(paraShortUrl).then(data => {
							if (data.data.success) {
								this.$confirm('生成的链接为：' + data.data.data + ', 是否继续?', '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									closeOnClickModal: false,
									type: 'info'
								}).then(() => {
									let params = {
										training_id: this.$route.query.camp_id,
										lesson_id: this.$route.query.lesson_id,
										name: this.postForm.name,
										lesson_name: this.postForm.lesson_name,
										start_time: new Date(this.sectionTime[0]).getTime(),
										end_time: new Date(this.sectionTime[1]).getTime(),
										show_time: new Date(this.showTime).getTime(),
										content: this.postForm.content,
										license_type: this.postForm.license_type,
										url: data.data.data,
									}
									if (this.isEdit) {
										params['id'] = this.postForm.id;
										updateTrainingWikiList(params)
											.then((res) => {
												if (res.data.success) {
													this.$notify({
														title: '成功',
														message: '保存集训营话术成功',
														type: 'success',
														duration: 2000
													});
													this.$router.go(-1);
												} else {
													this.$notify({
														title: '失败',
														message: res.data.msg,
														type: 'error',
														offset: 45
													});
												};
											})
											.catch((error) => {
												this._catch(error);
											});
									} else {
										addTrainingWikiList(params)
											.then((res) => {
												if (res.data.success) {
													this.$notify({
														title: '成功',
														message: '保存集训营话术成功',
														type: 'success',
														duration: 2000
													});
													this.$router.go(-1);
												} else {
													this.$notify({
														title: '失败',
														message: res.data.msg,
														type: 'error',
														offset: 45
													});
												};
											})
											.catch((error) => {
												this._catch(error);
											});
									}
								}).catch(error => {
									this.$message({
										type: 'info',
										message: '已取消生成'
									});
								})
							} else {
								this.$notify({
									title: '错误',
									message: res.data.msg,
									type: 'error'
								})
							}
						}).catch(error => {
							this._catch(error)
						})
					} else {
						this.$notify({
							title: '错误',
							message: res.data.msg,
							type: 'error'
						})
					}
				})
				.catch(error => {
					this._catch(error)
				})
		},
		/*
			请求集训营名称
		*/
		initTrainCampName(page) {
			this.campListLoading = true;
			let para = {
				id: this.$route.query.camp_id,
			};
			getTrainCampList(para).then(res => {
					if (res.data.success) {
						this.postForm.name = res.data.data.items[0].entity.name;
					} else {
						this.$message.error(res.data.msg || '未知错误，请联系管理员');
					}
					this.campListLoading = false;
				})
				.catch(error => {
					this._catch(error)
				})
		},
		/*
			请求课节名称
		*/
		initLessonName(obj) {
			let parameter = {
				id: this.$route.query.lesson_id,
			};
			getLessonList(parameter)
				.then((res) => {
					if (res.data.success) {
						this.postForm.lesson_name = res.data.data.items[0].entity.name
					} else {
						this.$notify.error(res.data.msg);
					};
				})
				.catch((error) => {
					this._catch(error)
				});
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
}
</script>
<style lang="less" scoped>
.form-container {
    margin-top: 40px;
}
</style>
