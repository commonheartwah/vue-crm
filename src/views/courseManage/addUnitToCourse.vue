<template lang="html">
	<div id='box'  v-loading="loading">
    	<div class='left'>
    		<el-card >
    			<div slot="header">
    				<span style="line-height: 36px;font-weight:600;font-size:18px;">单元列表</span>
					<el-button style="position:absolute;top:20px;right:30px" type="primary" @click='handleAddUnit' icon='plus'>新增单元</el-button>
    			</div>
				<el-collapse  @change='collapseChangeLeft' v-model="activeNamesLeft">
					<el-collapse-item v-for='(item, index) in left' :key='index' :name='index'>
					  <template slot="title">
							<el-tooltip :content="'[Unit] :  ' + item.name  + '( ' + item.conf.subname + ' )' +'  ->  ' + item.id" placement="top" effect="light"  v-if="item.tooltip">
								<span style="width:300px;overflow: hidden;height:44px;"><i class="leftName">[Unit] : {{ item.name }}<span v-if='item.conf.subname'>( {{item.conf.subname}} )</span> -> {{ item.id }}</i></span>
							</el-tooltip>
							<span style="width:300px;overflow: hidden;height:44px;" v-else><i class="leftName">[Unit] : {{ item.name }} <span v-if='item.conf.subname'>( {{item.conf.subname}} )</span>  -> {{ item.id }}</i></span>
							<el-button-group>
								<el-button size='small' type='info' @click='handleRelevanceLesson(item)'>关联课节</el-button>
								<el-button type="info" icon="edit" size="small" @click.native='editObj(item)' ></el-button>
								<el-button type="success" icon="plus" size="small" @click.native='addObj(item)' ></el-button>
							</el-button-group>
					  </template>
						<div style="margin:0 0 8px 0;">
							<p v-show='item.lessonInfo.InfoMessage.length === 0' style="margin: 10px 0 0 35px;">当前列表为空</p>
							<p v-for='(temp, index) in item.lessonInfo.InfoMessage' :key='index' style="margin:10px 0 0 0;">
								<span  class="lessonDetails">
									<router-link :to="'/lessonDetails/' + temp.entity.id">
										<i class="el-icon-star-on" style="margin: 0 10px 0 35px;"></i>[{{ temp.entity.id }}] : {{ temp.entity.internalName }}
									</router-link>
								</span>
							</p>
						</div>
					</el-collapse-item>
				</el-collapse>
    			<div v-if="!(left.length)" class="reminderInfo">当前列表为空</div>
    		</el-card>
    	</div>
    	<div class='right'>
    		<el-card >
    			<div slot="header" class="clearfix">
    				<span style="line-height: 36px;font-weight:600;font-size:18px;width:80%;display:inline-block;">课程 ：{{ CourseName }}</span>
    				<el-button style="position:absolute;top:20px;right:30px" type="primary" @click='handleSubmitCourse' icon='check' :disabled="SubmitCourseDisabled">提交课程</el-button>
    			</div>
    			<draggable draggable :list="right">
					<el-collapse  @change='collapseChangeRight' v-model="activeNamesRight" v-for="(project, index) in right" :key="index">
						<el-collapse-item :name='index'>
						  <template slot="title">
								<el-tooltip :content="'[Unit] :  ' + project.name  + '( ' + project.conf.subname + ' )' +  '  ->  ' + project.id" placement="top" effect="light" v-if="project.tooltip">
								    <span style="width:300px;overflow: hidden;height:44px;"><i class="leftName">[Unit] : {{ project.name }} <span v-if='project.conf.subname'>( {{project.conf.subname}} )</span>  -> {{ project.id }}</i></span>
								</el-tooltip>
								<span style="width:300px;overflow: hidden;height:44px;" v-else><i class="leftName">[Unit] : {{ project.name }} <span v-if='project.conf.subname'>( {{project.conf.subname}} )</span>  -> {{ project.id }}</i></span>
								<el-button-group>
									<el-button size='small' type='info' @click='handleRelevanceLesson(project)'>关联课节</el-button>
									<el-button type="info" icon="edit" size="small" @click.native='editObj(project)' ></el-button>
									<el-button type='danger' icon="minus" size="small" @click.native='delObj(project)'></el-button>
								</el-button-group>
						  </template>
							<div style="margin:0 0 8px 0;">
								<p v-show='project.lessonInfo.InfoMessage.length === 0' style="margin: 10px 0 0 35px;">当前列表为空</p>
								<p v-for='(temp, index) in project.lessonInfo.InfoMessage' :key='index' style="margin:10px 0 0 0;">
									<span  class="lessonDetails">
										<router-link :to="'/lessonDetails/' + temp.entity.id">
											<i class="el-icon-star-on" style="margin: 0 10px 0 35px;"></i>[{{ temp.entity.id }}] : {{ temp.entity.internalName }}
										</router-link>
									</span>
								</p>
							</div>
						</el-collapse-item>
					</el-collapse>
    			</draggable>
    			<div v-if="!(right.length)" class="reminderInfo">当前列表为空</div>
    		</el-card>
    	</div>
		<el-dialog :title="dialogFlag ? '新增单元' : '编辑单元'" v-model='editFormVisible' :close-on-click-modal='false'>
			<el-form :model="editItem" :rules="editItemRules" ref="editItem">
	      	<el-form-item label="标题" :label-width="formLabelWidth" prop="name">
		  	    	<el-input v-model="editItem.name"  auto-complete="off" @keydown.enter.native.prevent></el-input>
		  		</el-form-item>
					<el-form-item label="副标题" :label-width="formLabelWidth" prop="sub_title">
		  	    	<el-input v-model="editItem.sub_title"  auto-complete="off" @keydown.enter.native.prevent></el-input>
		  		</el-form-item>
					<el-form-item label="图标" :label-width="formLabelWidth">
					    <el-input v-model="editItem.image_url"  auto-complete="off" @keydown.enter.native.prevent placeholder='请输入图片地址'></el-input>
		  		</el-form-item>
				<el-form-item label="状态" :label-width="formLabelWidth" prop="stat">
					<el-tooltip content="是否有效" placement="top">
					    <el-switch v-model="editItem.stat" on-color="#13ce66" off-color="#ff4949" on-value="1" off-value="0" on-text='是' off-text='否'>
					    </el-switch>
					</el-tooltip>
		  		</el-form-item>
				<el-form-item label="显示" :label-width="formLabelWidth" prop="display">
					<el-radio class="radio" v-model="editItem.display" label="1">是</el-radio>
	    			<el-radio class="radio" v-model="editItem.display" label="0">否</el-radio>
		  		</el-form-item>
	  </el-form>
	  		<div slot="footer" class="dialog-footer">
		  		<el-button @click="editFormVisible = false">取 消</el-button>
		  		<el-button type="primary" @click="emitFormConfirmAffirm('editItem')" :plain="true">确 定</el-button>
	  		</div>
	    </el-dialog>
		<div class="RelevanceUnit">
			<el-dialog title="关联课节" v-model='RelevanceUnitVisible' :close-on-click-modal='false' >
				<AddLessonToUnit :AddLessonToUnitData='AddLessonToUnitData' v-on:submitUnit='submitUnitConf'></AddLessonToUnit>
			</el-dialog>
		</div>
    </div>
</template>

<script>
import {
	editUnitInfo,
	updateUnitToCourse,
	initUnitAndCourse,
	initLessonInfo,
	initLessonAndUnit,
	updateLessonToUnit,
	getCourseList,
	addUnitToList
} from '../../api/api';
import draggable from 'vuedraggable'
import AddLessonToUnit from './addLessonToUnit'
export default {
	components: {
		draggable,
		AddLessonToUnit
	},
	data() {
		return {
			CourseName: '',
			activeNamesLeft: [],
			activeNamesRight: [],
			left: [],
			right: [],
			SubmitCourseDisabled: true,
			editFormVisible: false,
			RelevanceUnitVisible: false,
			formLabelWidth: '100px',
			editItem: '',
			editItemRules: {
				//新增页面的表单验证
				name: [{
						required: true,
						message: '请输入模块名称',
						trigger: 'blur'
					},
					{
						min: 1,
						max: 100,
						message: '长度在 3 到 20 个字符',
						trigger: 'blur'
					}
				],
				stat: [{
					required: true,
					message: '请选择模块类型',
					trigger: 'change'
				}],
				display: [{
					required: true,
					message: '请选择模块类型',
					trigger: 'change'
				}],
			},
			AddLessonToUnitData:'', // 添加 lesson 到 unit 的窗口里的数据
			loading: true,
			// 判断新增 或者 编辑
			dialogFlag: false,
		}
	},
	methods: {
		// 点击 编辑按钮
		editObj(obj) {
			obj['display'] += '';
			obj['stat'] += '';
			this.editFormVisible = true;
			this.editItem = obj;
			this.editItem.sub_title = obj.conf.subname;
			if (obj.conf) {
				if (obj.conf.image) {
					this.editItem['image_url'] = obj.conf.image.iconUrl;
				}
			}
			this.dialogFlag = false;
			event.stopPropagation();
		},
		// 左边折叠面板打开后
		collapseChangeLeft(value){
			if (value.length) {
				if (this.left[value[value.length-1]].lessonInfo.InfoDevelop) {
					this.left[value[value.length-1]].lessonInfo.InfoDevelop = false;
					let params = {
						unit_id:this.left[value[value.length-1]].id
					};
					initLessonInfo(params).then((res) => {
						if (res.data.data) {
							this.left[value[value.length-1]].lessonInfo.InfoMessage = res.data.data;
						};
					});
				};
			};
		},
		// 右侧折叠面板打开
		collapseChangeRight(value){
			if (value.length) {
				if (this.right[value[value.length-1]].lessonInfo.InfoDevelop) {
					this.right[value[value.length-1]].lessonInfo.InfoDevelop = false;
					let params = {
						unit_id:this.right[value[value.length-1]].id
					};
					initLessonInfo(params).then((res) => {
						if (res.data.data) {
							this.right[value[value.length-1]].lessonInfo.InfoMessage = res.data.data;
						};
					});
				};
			};
		},
		// 从左边添加到右边
		addObj(obj) {
			this.right.push(obj)
			var self = this;
			this.left.forEach(function(item, index) {
				if (obj == item) {
					self.left.splice(index, 1)
				};
			});
			this.activeNamesLeft = [];
			this.activeNamesRight = [];
			event.stopPropagation();
		},
		// 删除 右边项目
		delObj(obj) {
			this.left.push(obj)
			var self = this;
			this.right.forEach(function(item, index) {
				if (obj == item) {
					self.right.splice(index, 1)
				};
			});
			this.activeNamesLeft = [];
			this.activeNamesRight = [];
			event.stopPropagation();
		},
		// 加载数据
		loadData() {
			this.activeNamesLeft = [];
			this.activeNamesRight = [];
			let params = {
				course_id: this.$route.params.courseId,
			};
			// 加载两边的数据
			initUnitAndCourse(params).then((res) => {
				if (res.data.success) {
					if (res.data.data.left) {
						this.left = []
						res.data.data.left.forEach((item) => {
							let tempObj = item.entity;
							tempObj['conf'] = item.conf
							tempObj['lessonInfo'] = {};
							tempObj['lessonInfo']['InfoDevelop'] = true;
							tempObj['lessonInfo']['InfoMessage'] = [];
							let str = JSON.parse(JSON.stringify(item.entity.name))
							str = str.replace(/[\u4e00-\u9fa5]/g, "aa");
							if (str.length > 35) {
								tempObj['tooltip'] = true
							}
							this.left.push(tempObj)
						});
					}
					if (res.data.data.used) {
						this.right = [];
						res.data.data.used.forEach((item) => {
							let tempObj = item.entity;
							tempObj['conf'] = item.conf
							tempObj['lessonInfo'] = {};
							tempObj['lessonInfo']['InfoDevelop'] = true;
							tempObj['lessonInfo']['InfoMessage'] = [];
							let str = JSON.parse(JSON.stringify(item.entity.name))
							str = str.replace(/[\u4e00-\u9fa5]/g, "aa");
							if (str.length > 35) {
								tempObj['tooltip'] = true
							}
							this.right.push(tempObj)
						});
					};
					this.SubmitCourseDisabled = false;
				};
			});
			let parameter = {
				id: this.$route.params.courseId,
			};
			// 加载 课程相关
			getCourseList(parameter).then((res) => {
				if (res.data.success) {
					this.CourseName = res.data.data.items[0].entity.name;
					this.loading = false;
				};
			});
		},
		handleAddUnit () {
			this.dialogFlag = true;
			this.editFormVisible = true;
			this.editItem = {
				name: '',
				stat: '1',
				display: '1',
				sub_title: '',
				// image_url: ''
			};
		},
		// 编辑页面的 确定键 的监听
		emitFormConfirmAffirm(){
			this.dialogFlag ? this.addUnitSubmitFunc('editItem') : this.editFormConfirm('editItem');
		},
		addUnitSubmitFunc(formName){
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.editFormVisible = false;
					this.loading = true;
					let params = {
						course_id: this.$route.params.courseId,
						name: this.editItem.name,
						sub_title: this.editItem.sub_title,
						display: this.editItem.display,
						status: this.editItem.stat,
						image_url: this.editItem.image_url
					};
					addUnitToList(params).then((res) => {
						if (res.data.success) {
							this.loadData()
							this.$notify({
								title: '成功',
								message: '新增成功',
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
						}
					})
				} else {
					console.log('error submit!!');
					this.loading = false;
					return false;
				};
			});
		},
		editFormConfirm(formName){
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.editFormVisible = false;
					this.loading = true;
					let params = {
						id: this.editItem.id,
						name: this.editItem.name,
						display: this.editItem.display,
						status: this.editItem.stat,
						sub_title: this.editItem.sub_title,
						image_url: this.editItem.image_url
					};
					editUnitInfo(params).then((res) => {
						if (res.data.success) {
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
						this.loadData()
					})
				} else {
					console.log('error submit!!');
					this.loading = false;
					return false;
				};
			});
		},
		// 打开 关联lesson 的窗口
		handleRelevanceLesson(obj) {
			this.RelevanceUnitVisible = true;
			let params = {
				unit_id: obj.id,
			};
			// 加载窗口里的数据
			initLessonAndUnit(params).then((res) => {
				if (res.data.data) {
					this.AddLessonToUnitData = res.data.data;
					this.AddLessonToUnitData['UnitId'] = obj.id;
					this.AddLessonToUnitData['UnitName'] = obj.name;
				}
			});
			event.stopPropagation();
		},
		// 提交 Course 列表。
		handleSubmitCourse(){
			this.loading = true;
			let UnitIds = '';
			this.right.forEach((item) => {
				UnitIds += item.id + ',';
			});
			let params = {
				course_id: this.$route.params.courseId,
				unit_ids: UnitIds
			};
			updateUnitToCourse(params).then((res) => {
				if (res.data.success) {
					this.loadData()
					this.$notify({
						title: '成功',
						message: '更新成功',
						type: 'success',
						offset: 45
					});
				}else {
					this.$notify({
						title: '失败',
						message: res.data.msg,
						type: 'error',
						offset: 45
					});
				};
				this.loading = false;
				this.loadData();
			});
		},
		submitUnitConf(obj){
			this.RelevanceUnitVisible = false;
			this.loading = true;
			updateLessonToUnit(obj).then((res) => {
				if (res.data.success) {
					this.$notify({
						title: '成功',
						message: '操作成功',
						type: 'success',
						offset: 45
					});
				}else {
					this.$notify({
						title: '失败',
						message: res.data.msg,
						type: 'error',
						offset: 45
					});
				}
				this.loadData();
			});
		}
	},
	// 监听窗口打开的状态，如果未打开，则内容为空。
	watch: {
		RelevanceUnitVisible: {
			handler(newVal, oldVal) {　　　　　　　　　
				if (!newVal) {
					this.AddLessonToUnitData = '';
				}
			},
			deep: true
		},
	},
	mounted() {
		this.loadData();
	},
	updated() {

	}
}
</script>

<style lang="less">
#box {
	margin: 20px 0 0 0;
    display: flex;
    justify-content: space-around;
    .left,
    .right {
        position: relative;
        width: 45%;
        .el-card__body {
            padding: 10px;
        }
        .box-card {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: 1px solid #d1dbe5;
            border-radius: 4px;
            padding: 10px;
            .textItem {
                text-indent: 2em;
				color: #666;
            }
        }
        .reminderInfo {
            text-align: center;
            padding: 18px 0;
        }
		.lessonDetails{
			a{
				text-decoration: none;
			};
			a:link{
				color: #666;
			}
			a:visited{
				color: #666;
			}
			a:hover{
				color: #666;
				text-decoration: underline;
			}
			a:active{
				color: #666;
			}
		}
    }
    .el-collapse-item__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        .leftName {
            width: 60%;
            font-style: normal;
        }
    }
	.RelevanceUnit{
		.el-dialog{
			height: 600px;
			width: 1100px;
		}
	}

}
</style>
