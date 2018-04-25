<template lang="html">
	<div id='box'>
    	<div class='left'>
    		<el-card >
    			<div slot="header">
    				<span style="line-height: 36px;font-weight:600;font-size:18px;">Lesson列表</span>
    			</div>
				<div class="searchData">
					<el-input placeholder="按ID或标题在当前课程搜索" icon="search" v-model="searchDataInThisCourse" :on-icon-click="searchInThisCourse" @keydown.native.enter="searchInThisCourse"></el-input>
					<el-input placeholder="按ID或标题在全部课程搜索" icon="search" v-model="searchDataInOtherCourse" :on-icon-click="searchInOtherCourse" @keydown.native.enter="searchInOtherCourse"></el-input>
    			</div>
				<section :loading="lessonListInWarehouseLoading">
					<div v-for="(project, index) in left" :key="index" :name='index' class="lessonCardInUnit">
						<i class="leftName">[{{ project.id }}] : {{ project.internalName }}</i>
						<el-button-group>
							<el-button type='info' icon="plus" size="small" @click.native='addObj(project)'></el-button>
						</el-button-group>
					</div>
	    			<div v-if="!(left.length)" class="reminderInfo">当前列表为空</div>
				</section>
    		</el-card>
    	</div>
    	<div class='right'>
    		<el-card >
    			<div slot="header" class="clearfix" style="position:relative;">
    				<span style="line-height: 36px;font-weight:600;font-size:18px;width:80%;display:inline-block;">{{ AddLessonToUnitData.UnitName }}</span>
    				<el-button  type="primary" @click='handleSubmitUnit'>提交</el-button>
    			</div>
    			<draggable draggable :list="right">
					<div v-for="(project, index) in right" :key="index" :name='index' class="lessonCardInUnit">
						<i class="leftName">[{{ project.id }}] : {{ project.internalName }}</i>
						<el-button-group>
							<el-button type='danger' icon="minus" size="small" @click.native='delObj(project)'></el-button>
						</el-button-group>
					</div>
    			</draggable>
    			<div v-if="!(right.length)" class="reminderInfo">当前列表为空</div>
    		</el-card>
    	</div>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import {
	getLessonList,
	getBlocksByLesson
} from '../../api/api';

export default {
	props: ['AddLessonToUnitData'],
	components: {
		draggable
	},
	data() {
		return {
			activeNamesLeft: [],
			activeNamesRight: [],
			left: [],
			right: [],
			searchDataInThisCourse:'',
			searchDataInThisCourse:'',
			searchDataInOtherCourse:'',
			searchDataInOtherCourse:'',
			lessonListInWarehouseLoading: false,   // lesson 仓库 加载动画
		}
	},
	methods: {
		// 左边折叠面板打开后
		collapseChangeLeft(value){
			if (value.length) {
				if (this.left[value[value.length-1]].blockInfo.InfoDevelop) {
					this.left[value[value.length-1]].blockInfo.InfoDevelop = false;
					let params = {
						lesson_id:this.left[value[value.length-1]].id
					};
					getBlocksByLesson(params).then((res) => {
						if (res.data.data) {
							res.data.data.forEach((item, index) => {
								this.$set(this.left[value[value.length-1]].blockInfo.InfoMessage, index, item);
							});
						};
					});
				};
			};
		},
		// 右边折叠面板打开后
		collapseChangeRight(value){
			if (value.length) {
				if (this.right[value[value.length-1]].blockInfo.InfoDevelop) {
					this.right[value[value.length-1]].blockInfo.InfoDevelop = false;
					let params = {
						lesson_id:this.right[value[value.length-1]].id
					};
					getBlocksByLesson(params).then((res) => {
						if (res.data.data) {
							res.data.data.forEach((item, index) => {
								this.$set(this.right[value[value.length-1]].blockInfo.InfoMessage, index, item);
							});
						};
					});
				};
			};
		},
		// 从左边添加到右边
		addObj(obj) {
			this.activeNamesLeft = [];
			this.activeNamesRight = [];
			this.right.push(obj)
			var self = this;
			this.left.forEach(function(item, index) {
				if (obj == item) {
					self.left.splice(index, 1);
				};
			})
			event.stopPropagation();
		},
		// 删除 右边项目
		delObj(obj) {
			this.left.push(obj)
			var self = this;
			this.right.forEach(function(item, index) {
				if (obj == item) {
					self.right.splice(index, 1)
				}
			})
			this.activeNamesLeft = [];
			this.activeNamesRight = [];
			event.stopPropagation();
		},
		// 提交 按钮的监听
		handleSubmitUnit() {
			this.activeNamesLeft = [];
			this.activeNamesRight = [];
			let LessonIds = '';
			this.right.forEach((item) => {
				LessonIds += item.id + ',';
			})
			let params = {
				unit_id: this.AddLessonToUnitData.UnitId,
				lesson_ids: LessonIds
			}
			this.$emit('submitUnit', params)
		},
		searchInThisCourse(){
			if (this.searchDataInThisCourse) {
				this.left = [];
				this.AddLessonToUnitData.left.forEach((item) => {
					if(this.searchDataInThisCourse == item.entity.id) {
						let tempObj = item.entity;
						tempObj['blockInfo'] = {};
						tempObj['blockInfo']['InfoDevelop'] = true;
						tempObj['blockInfo']['InfoMessage'] = [];
						this.left.push(tempObj)
					}
				})
			}else {
				this.left = [];
				this.AddLessonToUnitData.left.forEach((item) => {
					let tempObj = item.entity;
					tempObj['blockInfo'] = {};
					tempObj['blockInfo']['InfoDevelop'] = true;
					tempObj['blockInfo']['InfoMessage'] = [];
					this.left.push(tempObj)
				})
			}
		},
		searchInThisCourse(){
			if (this.searchDataInThisCourse) {
				let temp = Number(this.searchDataInThisCourse);
				this.left = [];
				if (temp) {
					this.AddLessonToUnitData.left.forEach((item) => {
						if(this.searchDataInThisCourse == item.entity.id) {
							let tempObj = item.entity;
							tempObj['blockInfo'] = {};
							tempObj['blockInfo']['InfoDevelop'] = true;
							tempObj['blockInfo']['InfoMessage'] = [];
							this.left.push(tempObj)
						}
					})
				}else {
					this.AddLessonToUnitData.left.forEach((item) => {
						if(this.searchDataInThisCourse == item.entity.name) {
							let tempObj = item.entity;
							tempObj['blockInfo'] = {};
							tempObj['blockInfo']['InfoDevelop'] = true;
							tempObj['blockInfo']['InfoMessage'] = [];
							this.left.push(tempObj)
						}
					})
				};
			}else {
				this.left = [];
				this.AddLessonToUnitData.left.forEach((item) => {
					let tempObj = item.entity;
					tempObj['blockInfo'] = {};
					tempObj['blockInfo']['InfoDevelop'] = true;
					tempObj['blockInfo']['InfoMessage'] = [];
					this.left.push(tempObj)
				})
			};
			event.stopPropagation();
		},
		searchInOtherCourse(){
			this.lessonListInWarehouseLoading = true;
			let temp = Number(this.searchDataInOtherCourse);
			let parameter = {};
			if (temp) {
				parameter = {
					id: temp,
				};
			}else {
				parameter = {
					name: this.searchDataInOtherCourse,
				};
			};
			getLessonList(parameter).then((res) => {
				if (res.data.data.items) {
					this.left = [];
					res.data.data.items.forEach((item) => {
						let tempObj = item.entity;
						tempObj['blockInfo'] = {};
						tempObj['blockInfo']['InfoDevelop'] = true;
						tempObj['blockInfo']['InfoMessage'] = [];
						this.left.push(tempObj)
					})
				};
				this.lessonListInWarehouseLoading = false;
			});
			event.stopPropagation();
		},
		loadData(){
			this.left = []
			if (this.AddLessonToUnitData.left) {
				this.AddLessonToUnitData.left.forEach((item, index) => {
					let tempObj = item.entity;
					this.$set(this.left, index, tempObj)
					this.$set(this.left[index], 'blockInfo', {
						InfoDevelop: true,
						InfoMessage: []
					})
				})
			}　　　
			this.right = [];
			if (this.AddLessonToUnitData.used) {
				this.AddLessonToUnitData.used.forEach((item, index) => {
					let tempObj = item.entity;
					this.$set(this.right, index, tempObj)
					this.$set(this.right[index], 'blockInfo', {
						InfoDevelop: true,
						InfoMessage: []
					})
				})
			};
		}
	},
	mounted(){
		this.loadData()
	},
	// 监听 父组件传来的数据。如果有变化就开始给当前组件赋值。
	watch: {
		AddLessonToUnitData: {
			handler(curVal, oldVal) {
				this.left = []
				if (this.AddLessonToUnitData.left) {
					this.AddLessonToUnitData.left.forEach((item, index) => {
						let tempObj = item.entity;
						tempObj['blockInfo'] = {};
						tempObj['blockInfo']['InfoDevelop'] = true;
						tempObj['blockInfo']['InfoMessage'] = [];
						this.left.push(tempObj);
					})
				}　　　
				this.right = [];
				if (this.AddLessonToUnitData.used) {
					this.AddLessonToUnitData.used.forEach((item) => {
						let tempObj = item.entity;
						tempObj['blockInfo'] = {};
						tempObj['blockInfo']['InfoDevelop'] = true;
						tempObj['blockInfo']['InfoMessage'] = [];
						this.right.push(tempObj)
					})
				};　　　
			},
			deep: true
		},
		blockInfo: {
			deep: true
		},
	}
}
</script>

<style lang="less" scoped>
#box {
	margin: 0;
    display: flex;
    justify-content: space-around;
    .left,
    .right {
    	.lessonCardInUnit{
			border: 1px solid #d1dbe5;
            border-radius: 4px;
			padding: 10px 10px 10px 20px;
			font-style: normal;
			display: flex;
	        justify-content: space-between;
	        align-items: center;
			margin: 3px 0;
			.leftName {
	            width: 70%;
	            font-style: normal;
	        }
    	}
    	.searchData{
    		margin-bottom: 10px;
			display: flex;
			justify-content: space-between;
			.el-input{
				width: 49%;
			}
    	}
        position: relative;
        width: 45%;
        .el-card {
            padding: 10px;
			height: 500px;
			overflow-y: scroll;
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
            }
        }
        .reminderInfo {
            text-align: center;
            padding: 18px 0;
        }
    }
    // .el-collapse-item__header {
    //     display: flex;
    //     justify-content: space-between;
    //     align-items: center;
    //     padding: 0 20px;
    //     .leftName {
    //         width: 70%;
    //         font-style: normal;
    //     }
    // }
}
</style>
