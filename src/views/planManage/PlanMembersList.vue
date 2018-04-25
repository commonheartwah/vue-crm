<template lang="html">
    <section>

        <!-- 按钮  过滤  工具条-->
        <el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
            <el-form :inline=true :model='filters'>

                <el-form-item>
                    <el-input v-model='filters.id' placeholder='ID' icon="circle-cross" :on-icon-click="handleIconClick_clearId" @keydown.native.prevent.enter='loadList' disabled></el-input>
                </el-form-item>

                <el-form-item>
                    <el-input v-model='filters.name' placeholder='用户名称' icon="circle-cross" :on-icon-click="handleIconClick_clearName" @keydown.native.prevent.enter='loadList' disabled></el-input>
                </el-form-item>

                <el-form-item>
                    <el-input v-model='filters.province' placeholder='省' icon="circle-cross" :on-icon-click="handleIconClick_clearProvince" @keydown.native.prevent.enter='loadList' v-if="flag"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-input v-model='filters.city' placeholder='市' icon="circle-cross" :on-icon-click="handleIconClick_clearCity" @keydown.native.prevent.enter='loadList' v-if="flag"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type='primary' @click='loadList'>查询</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button type='primary' v-if="isMemListForPlan" @click='handleAdd'>新增</el-button>
                </el-form-item>

            </el-form>
        </el-col>

        <!-- 列表 -->
        <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" border>

            <el-table-column type="selection" width="55"></el-table-column>

            <el-table-column prop="id" label="ID" width="100" sortable align='center'></el-table-column>

			<el-table-column prop="name" label="用户名" align='center' show-overflow-tooltip></el-table-column>

            <el-table-column prop="province" label="省" align='center' show-overflow-tooltip v-if="$route.query.brvbar_type === '1'"></el-table-column>

            <el-table-column prop="city" label="市" align='center' show-overflow-tooltip v-if="$route.query.brvbar_type === '1'"></el-table-column>

            <el-table-column prop="mobile" label="用户手机" align='center' show-overflow-tooltip></el-table-column>

			<el-table-column prop="stat" label="状态" width='70' :formatter='formatStat'></el-table-column>

            <el-table-column prop='ct' label='创建时间' width='200' align='center' :formatter='formatCreateTime'></el-table-column>

            <el-table-column prop='ut' label='更新时间' width='200' align='center' :formatter='formatUpdateTime'></el-table-column>

			<el-table-column label="操作" width="230" align="center">
				<template scope="scope">
                    <el-button-group>
                        <el-button type="info" size="small" v-if="isMemListForPlan" @click="addToGroup(scope.$index, scope.row)">添加到群组</el-button>
                        <el-button type='danger' size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                    </el-button-group>
				</template>
			</el-table-column>
		</el-table>

        <!-- 分页条 批量删除 -->
        <el-col :span='24' class='toolbar'>
            <el-button type="info" v-if="isMemListForPlan" @click="batchAdd" :disabled="this.sels.length===0">批量添加到群组</el-button>
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size=limit :total=totalCount style='float: right'></el-pagination>
        </el-col>

    </section>
</template>

<script>
// axios
import {
    getMembersListForPlan,
    addMemberForPlan,
    removeMemberForPlan,
    batchRemoveMembersForPlan,

    getMembersListForGroup,
    addMemberForGroup,
    removeMemberForGroup,
    batchRemoveMembersForGroup
} from '../../api/api'
// 引入工具包
import util from '../../common/js/util'

export default {
    data(){
        return {
            /*
                filter
             */
            filters: {
                id: '',
                name: '',
                province: '',
                city: ''
            },
            /*
                sels 列表选中列
             */
            sels: [],
            /*
                pagination
                数据总量
                当前页码
                分页每页显示多少数据
             */
            totalCount: 1,
            page: 1,
            limit: 1,
            /*
                list
             */
            users: [
                // {
                //     id: '1',
                //     name: '小王',
                //     stat: 0,
                // },
            ],
            listLoading: false,
            // 基础参数(para)
            basePara: {},
            // check是对计划下成员操作还是对群组下的成员操作
            checkFrom: {}
        }
    },
    methods: {
//ToolBar
        // 点击icon 清除内容
        handleIconClick_clearId(){
            this.filters.id = '';
        },
        handleIconClick_clearName(){
            this.filters.name = '';
        },
        handleIconClick_clearProvince(){
            this.filters.province = '';
        },
        handleIconClick_clearCity(){
            this.filters.city = '';
        },
        handleAdd(){
            // 来接收addMemberForPlan or addMemberForGroup
            let addMember;

            this.$prompt('请输入用户id', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                let para = {
                    user_ids: value
                }
                para = Object.assign(para, this.basePara);

                this.checkFromPlanOrGroup.addMember(para).then((res) => {
                    if (res.data.success) {
                        this.$notify({
                            title: '成功',
                            type: 'success',
                            message: '添加成功'
                        });
                        this.loadList();
                    }else{
                        this.$notify({
                            title: '错误',
                            type: 'error',
                            message: res.data.msg
                        })
                    }
                })

            }).catch(() => {
                this.$notify({
                    title: '提示',
                    type: 'info',
                    message: '取消输入'
                });
            });
        },
// 分页
        handleCurrentChange(val){
            this.page = val;
            this.loadList();
        },
//List
    // 列表显示
        // stat 数字转换状态
        formatStat(row, column){
            switch (row.stat) {
                case -1: return '不限'; break;
                case 0: return '有效'; break;
                case 1: return '禁言'; break;
                case 2: return '冻结'; break;
            }
        },
        // 显示列表(createTime 转换)
        formatCreateTime(row, column){
            return util.formatDate.format(new Date(row.ct), 'yyyy/MM/dd   hh:mm:ss');
        },
        // 显示列表(createTime 转换)
        formatUpdateTime(row, column){
            return row.ut ? util.formatDate.format(new Date(row.ut), 'yyyy/MM/dd   hh:mm:ss') : '暂未更新';
        },
    // 操作功能
        // 删除单个用户
        handleDel(index, row){
            this.$confirm('确认删除选中记录吗？', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                let para = {
                    user_id: row.id
                }
                para = Object.assign(para, this.basePara);

                this.checkFromPlanOrGroup.removeMember(para).then((res) => {
                    this.listLoading = false;
                    if (res.data.success) {
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success'
                        });
                        this.loadList();
                    }else{
                        this.$notify({
                            title: '错误',
                            message: res.data.msg,
                            type: 'error'
                        })
                    }
                });
            }).catch(() => {

            });
        },
    // 批量选中
        selsChange(sels) {
            this.sels = sels;
        },
        //批量删除
        batchRemove() {
            let user_ids = this.sels.map(item => item.id).toString();
            this.$confirm('确认删除选中记录吗？', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                let para = {
                    user_ids: user_ids
                }
                para = Object.assign(para, this.basePara);
                this.checkFromPlanOrGroup.batchRemoveMembers(para).then((res) => {
                    this.listLoading = false;
                    if (res.data.success) {
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success'
                        });
                        this.loadList();
                    }else{
                        this.$notify({
                            title: '错误',
                            message: res.data.msg,
                            type: 'error'
                        })
                    }
                });
            }).catch(() => {

            });
        },
        // 添加到群组中
        addToGroup(index, row){
            this.$router.push(
                {
                    path: '/planGroupsList',
                    query: {
                        user_ids: row.id,
                        plan_id: this.$route.query.plan_id
                    }
                }
            );
        },
        // 批量添加到群组中
        batchAdd(){
            let user_ids = this.sels.map(item => item.id).toString();
            this.$router.push(
                {
                    path: '/planGroupsList',
                    query: {
                        user_ids: user_ids,
                        plan_id: this.$route.query.plan_id
                    }
                }
            );
        },
        checkFromPlanOrGroup(){
            // 初始化basePara的值
            this.basePara = Object.assign({}, this.$route.query);
            // 判断是对计划下的成员 or 群组下的成员进行操作
            if (this.basePara['plan_id']) {
                this.checkFromPlanOrGroup = {
                    getMembersList: getMembersListForPlan,
                    addMember: addMemberForPlan,
                    removeMember: removeMemberForPlan,
                    batchRemoveMembers: batchRemoveMembersForPlan,
                }
            }else{
                this.checkFromPlanOrGroup = {
                    getMembersList: getMembersListForGroup,
                    addMember: addMemberForGroup,
                    removeMember: removeMemberForGroup,
                    batchRemoveMembers: batchRemoveMembersForGroup,
                }
            }
        },
        loadList(){
            // 定义参数 para
            let para = {
                id: this.filters.id,
                name: this.filters.name,
                province: this.filters.province,
                city: this.filters.city
            };
            para = Object.assign(para, this.basePara);
            para['page_index'] = this.page
            this.listLoading = true;

            this.checkFromPlanOrGroup.getMembersList(para).then((res) => {
                this.listLoading = false;
                if (res.data.success) {
                    this.totalCount = res.data.data.totalCount;
                    this.limit = res.data.data.limit;
                    this.users = res.data.data.items;
                }else{
                    this.users = [];
                }
                this.listLoading = false;
            });
        },
    },
    computed: {
        isMemListForPlan(){
            if (this.basePara['plan_id']){
                return true;
            }else if (this.basePara['group_id']) {
                return false;
            }
        },
        flag(){
            if (this.$route.query.brvbar_type === '1' && this.$route.query.class === '1') {
                return true;
            } else {
                return false;
            }
        }
    },
    mounted(){
        this.checkFromPlanOrGroup();
        this.loadList();
    }
}
</script>

<style lang="less">
</style>
