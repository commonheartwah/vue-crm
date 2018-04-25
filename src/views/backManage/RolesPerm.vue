<template lang="html">
	<el-tabs type="border-card" class="elTabs">
		<el-card v-for='(perms, permsIndex) in permsGroup' :key='permsIndex' class="cardPieces">
			<span slot="header"><el-checkbox  v-model="perms.checkAll" @change="permsGroupCheck(perms)"></el-checkbox> {{ perms.name }}</span>
			<el-row v-for='(perClass, classIndex) in perms.permsClass' :key='classIndex'>
				<el-col :span='6'  class="permsContent">{{ perClass.name }}：</el-col>
				<el-row>
					<el-col :span='2' class="permsContent">
						<el-checkbox v-model="perClass.checkAllInclass" @change="handleCheckAllChange($event, perClass, perms)">全选</el-checkbox>
					</el-col>
					</el-checkbox-group>
					<el-checkbox-group v-model="perClass.checkedControls" @change="handleCheckedPermsChange(perms, perClass)">
						<el-col :span='2' v-for="(item, index) in controls" :key='index'>
							<el-checkbox :label="item" class="permsContent">{{ item }}</el-checkbox>
						</el-col>
					</el-checkbox-group>
				</el-row>
			</el-row>
		</el-card>
        <el-button type="primary" class="submitButton" @click.native="rolePermsSubmit">提交按钮</el-button>
	</el-tabs>
</template>

<script>
const control = ['查询', '修改', '增加', '删除'];

import util from '../../common/js/util' //工具

import {
	getPermsById,
	updatePermsById
} from '../../api/api';

export default {
	data() {
		return {
			permsGroup: [],
			controls:control
		};
	},
	methods: {
		// 顶部 总全选改变时的方法。
        permsGroupCheck(obj){
			// 点击哪个总全选， obj 为当前目录下所有的 选择内容。
			obj.permsClass.forEach((item) => {     // 循环 每个 permsClass 让 所有的子全选状态跟 总全选状态保持一致。并将所有需要选择的内容添加到绑定的数组内。
				item.checkAllInclass = event.target.checked;
				item.checkedControls =  event.target.checked ? control : [];
			})
        },
		// 子全选 改变时 的方法 。改变的时候 让 在子元素绑定的数组内填入所有 选择项或者删除所有选择项 并监听 总全选的状态
		handleCheckAllChange(event, perClass, perms) {
			perClass.checkedControls = event.target.checked ? control : [];
			this.emitCheckChange(perms)
		},
		// 所有子元素（仅限于一个对象内） 改变时 的方法 。改变的时候监听 绑定数组的长度，如果与总长度一致，则为全选。 并监听 总全选的状态
		handleCheckedPermsChange(perms, perClass) {
			let checkedCount = perClass.checkedControls.length;
			perClass.checkAllInclass = checkedCount === this.controls.length;
			this.emitCheckChange(perms)
		},
		// 监听 总全选的方法。
			// 将当前的总对象 传入，然后查看所有子全选的 状态，所有状态为真则总全选为真，其中一个为假则为假
		emitCheckChange(perms){
			let checkArray = [];
			perms.permsClass.forEach((item) => {
				checkArray.push(item.checkAllInclass);
			})
			let judgeChecked = function(){
				for (var i = 0; i < checkArray.length; i++) {
					if(!checkArray[i]){
						return false;
					}
				}
				return true
			}
			perms.checkAll = judgeChecked()
		},
		// 加载 选择项。并进行一个ID与真实 选项名称的转换。
		initChecked(obj){
			let mock = obj;
			for (var variable in mock) {
				mock[variable].split('').forEach((item) => {
					this.permsGroup.forEach((tempElement) => {
						tempElement.permsClass.forEach((element) => {
							if (element['id'] == variable) {
								switch (item) {
									case 'R': element['checkedControls'].push('查询'); break;
									case 'U': element['checkedControls'].push('修改'); break;
									case 'I': element['checkedControls'].push('增加'); break;
									case 'D': element['checkedControls'].push('删除'); break;
								}
							}
							// 如果element下的 绑定数组 长度为4 则为全选.所以给 全选按钮绑定的数据为true.并调用 监听 总全选的方法.将当前的最大对象导入
							if (element.checkedControls.length === 4) {
								element.checkAllInclass = true;
								this.emitCheckChange(tempElement)
							}
						})
					})

				})
			}
		},
		loadData(){
			let para = {};
			para['role_id'] = this.$route.query.role_id;
			getPermsById(para).then((res) => {
                    this.permsGroup = [];
                    res.data.data['allPerms'].forEach((item, index) => {
                        let tempObj = {};
                        tempObj['name'] = item['first'];
                        tempObj['permsClass'] = item['second'];
                        tempObj['checkAll'] = false;
                        this.permsGroup.push(tempObj);
                    });
					this.permsGroup.forEach((item) => {
						item['permsClass'].forEach((tempElement) => {
							this.$set(tempElement, 'checkAllInclass', false)
							this.$set(tempElement, 'checkedControls', [])
						})
					})
					this.initChecked(res.data.data['rolePerms']);
			})
		},
        rolePermsSubmit(){
			let para = {
				'role_id': this.$route.query.role_id,
			}
			para['permission_ids'] = []; //空数组
            this.permsGroup.forEach(( item ) => {
                item['permsClass'].forEach(( tempElement ) => {
                    if (tempElement.checkedControls.length) {
    					para['op_'+tempElement.id] = util.formatPerms.formatPermsToLetter(tempElement.checkedControls).join(',');//组合'op_r.ma.mm'
    					para['permission_ids'].push(tempElement.id); //推角色管理这些id值
    				}
                })
            })

			para['permission_ids'] = para['permission_ids'].join(',');

			updatePermsById(para).then((res) => { // 发送请求
				if (res.data.success) {
					this.$notify({
						title: '成功',
						message: '提交成功',
						type: 'success'
					});
                    // 返回上一个页面
                    this.$router.back();
				}else{
					this.$notify({
						title: '错误',
						message: res.data.msg,
						type: 'error'
					});
				}
			})
		}
	},
	mounted() {
		this.loadData()
	}
}

</script>

<style lang="less" scoped>
.permsContent {
    margin: 10px 0;
}
body{
	.elTabs{
		.cardPieces{
			margin: 20px 0;
			padding: 0 100px;
			&:first-child{
				margin: 0;
			}
		}
		.submitButton{
			float: right;
			margin-right: 100px;
		}
	}
}
</style>
