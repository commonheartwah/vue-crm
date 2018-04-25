<template lang='html'>

    <section>
        <!-- 按钮  过滤  工具条-->
        <el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>

            <el-form :inline=true :model='filters'>

                <el-form-item>
                    <el-input v-model='filters.id' placeholder='ID' icon="circle-cross" :on-icon-click="handleIconClick_clearId" @keydown.native.prevent.enter='loadBackMemberList'></el-input>
                </el-form-item>

                <el-form-item>
                    <el-input v-model='filters.name' placeholder='用户名' icon="circle-cross" :on-icon-click="handleIconClick_clearName" @keydown.native.prevent.enter='loadBackMemberList'></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type='primary' @click='loadBackMemberList'>查询</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button type='primary' @click='handleAdd'>新增</el-button>
                </el-form-item>

            </el-form>

        </el-col>

        <!-- 列表 -->
        <el-table :data='users' highlight-current-row v-loading='listLoading' style='width: 100%;' border>

            <el-table-column prop='id' label='ID' width='75' align='center' sortable></el-table-column>

            <el-table-column prop='name' label='用户名' width='140' align='center' show-overflow-tooltip></el-table-column>

            <el-table-column prop='displayName' label='显示名称' width='140' align='center' show-overflow-tooltip></el-table-column>

            <el-table-column prop='phone' label='电话' width='140' align='center' show-overflow-tooltip></el-table-column>

            <el-table-column prop='email' label='邮箱' align='center' show-overflow-tooltip></el-table-column>

            <el-table-column prop='stat' label='状态' width='70' :formatter='formatStat' align='center'></el-table-column>

            <el-table-column prop='createTime' label='创建时间' width='168' :formatter='formatCreateTime' align='center'></el-table-column>

            <el-table-column label='操作' width="230" align='center'>
                <template scope='scope'>
                    <el-button-group>
                        <el-button size='small' type='success' @click='handleEdit(scope.$index, scope.row)'>编辑</el-button>
                        <el-button size='small' type='info' @click='handleDetails(scope.$index, scope.row)'>用户角色</el-button>
                    </el-button-group>
                </template>

            </el-table-column>

        </el-table>

        <!-- 分页 -->
        <el-col :span='24' class='toolbar'>
            <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size=limit :total=totalCount style='float: right'></el-pagination>
        </el-col>

        <!-- 新增界面 -->
        <el-dialog title='新增' v-model='addFormVisible' :close-on-click-modal='false'>

            <el-form :model='addForm' label-width='100px' :rules='addFormRules' ref='addForm'>

                <el-form-item label='用户名' prop='username'>
                    <el-input v-model='addForm.username'></el-input>
                </el-form-item>

                <el-form-item label='密码' prop='password'>
                    <el-input v-model='addForm.password'></el-input>
                </el-form-item>

                <el-form-item label='显示名称' prop='display_name'>
                    <el-input v-model='addForm.display_name'></el-input>
                </el-form-item>

                <el-form-item label='电话' prop='phone'>
                    <el-input v-model='addForm.phone'></el-input>
                </el-form-item>

                <el-form-item label='邮件' prop='email'>
                    <el-input v-model='addForm.email'></el-input>
                </el-form-item>

                <el-form-item label="状态" prop='status'>
					<el-radio-group v-model="addForm.status">
						<el-radio class="radio" :label="1">有效</el-radio>
						<el-radio class="radio" :label="0">无效</el-radio>
					</el-radio-group>
				</el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>

        </el-dialog>

        <!-- 编辑界面 -->
        <el-dialog title='编辑' v-model='editFormVisible' :close-on-click-modal='false'>

            <el-form :model='editForm' label-width='100px' :rules='editFormRules' ref='editForm'>

                <el-form-item label='用户名' prop='name'>
                    <el-input v-model='editForm.name' auto-complete='off'></el-input>
                </el-form-item>

                <el-form-item label='密码' prop='password'>
                    <el-input v-model='editForm.password' auto-complete='off'></el-input>
                </el-form-item>

                <el-form-item label='邮件' prop='email'>
                    <el-input v-model='editForm.email' auto-complete='off'></el-input>
                </el-form-item>

                <el-form-item label='电话' prop='phone'>
                    <el-input v-model='editForm.phone' auto-complete='off'></el-input>
                </el-form-item>

                <el-form-item label='显示名称' prop='displayName'>
                    <el-input v-model='editForm.displayName' auto-complete='off'></el-input>
                </el-form-item>

                <el-form-item label="状态" prop='stat'>
                    <el-radio-group v-model="editForm.stat">
                        <el-radio class="radio" :label="1">有效</el-radio>
                        <el-radio class="radio" :label="0">无效</el-radio>
                    </el-radio-group>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>

        </el-dialog>

        <!-- 角色管理界面 -->
        <el-dialog title='请选择用户角色' v-model='detailsFormVisible' :close-on-click-modal='false' >

            <el-form :model='detailsForm' ref='detailsForm'>

                <el-form-item prop="accountRoles">
                    <el-checkbox-group v-model="detailsForm.accountRoles">
                        <el-row>
                            <el-col :span="6" v-for="item in allRoles" :key="item">
                                <el-checkbox :label="item"></el-checkbox>
                            </el-col>
                        </el-row>
                    </el-checkbox-group>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="detailsFormVisible=false">取消</el-button>
                <el-button type="primary" @click.native="detailsSubmit" :loading="detailsLoading">提交</el-button>
            </div>

        </el-dialog>
    </section>

</template>

<script>
// 引入工具包
import util from '../../common/js/util'
// 引入axios
import {
    getBackMemberListPage,
    editUser,
    addUser,
    requestCurrentRoles,
    updateRoles
} from '../../api/api';

export default {

    data(){
        return {
            // 加载默认false
            listLoading: false,
            // 过滤
            filters: {
                name: '',
                id: '',
            },
            users: [
                // 假数据
                // {
                //     'id': 1,
                //     'name': '10086',
                //     'email': 'chengjinrui@babyfs.cn',
                //     'phone': '18435137159',
                //     'displayName': '宝宝玩英语',
                //     'createTime': 20170430,
                //     'stat': 0,
                // },
            ],
            // 数据总量
            totalCount: 1,
            // 当前页码
            page: 1,
            // 分页每页显示多少数据
            limit: 1,

            // 新增界面
            addFormVisible: false, //新增界面是否显示

            addLoading: false, //新增界面是否显示加载

            addFormRules: { //新增界面表单规则
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                display_name: [
                    { required: true, message: '请输入显示名称', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮件', trigger: 'blur' }
                ],
                status: [
                    { required: true, message: '请选择状态' }
                ]
            },

            addForm: { //新增界面表单数据类型
                // username: '',
                // password: '',
                // email: '',
                // phone: '',
                // display_name: '',
                // createTime: 0,
                // status: 1
            },

            // 编辑界面
            editFormVisible: false, //编辑界面是否显示

            editLoading: false, //编辑界面是否显示加载

            editFormRules: {//编辑界面表单规则
                name: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                displayName: [
                    { required: true, message: '请输入显示名称', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮件', trigger: 'blur' }
                ],
                stat: [
                    { required: true, message: '请选择状态',  }
                ],
            },

            editForm: {
                // id: 0,
                // name: '',
                // password: '',
                // email: '',
                // phone: '',
                // displayName: '',
                // createTime: 0,
                // stat: 1
            },

            // 详情页面
            // allRoles: ['管理员','开发部门','技术部门','运维部门','运营部门'], //全部角色信息
            allRoles: [],
            allRolesMap: {},
            detailsFormVisible: false, //详情界面是否显示
            detailsLoading: false,
            detailsForm: {
                id: '',
                accountRoles: [], //用户当前的角色信息
            },
            checkAll: false,
            // isIndeterminate: true,
        }
    },
    methods: {
        // 显示列表(stat 数字转换状态)
        formatStat(row, column){
            return row.stat == 1 ? '有效' : row.stat == 0 ? '无效' : '未知';
        },
        // 显示列表(createTime 转换)
        formatCreateTime(row, column){
            return util.formatDate.format(new Date(row.createTime), 'yyyy/MM/dd   hh:mm:ss');
        },
        // 点击input后面的icon 清除内容
        handleIconClick_clearId(){
            this.filters.id = '';
        },
        handleIconClick_clearName(){
            this.filters.name = '';
        },
        // 分页
        handleCurrentChange(val){
            this.page = val;
            this.loadBackMemberList();
        },
        // 新增页面
        handleAdd(){
            this.addFormVisible = true;
            this.addForm = {
                username: '',
                password: '',
                email: '',
                phone: '',
                display_name: '',
                createTime: 0,
                status: 1
            }
        },
        // 新增页面提交
        addSubmit(){
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.addLoading = true;
                        let para = Object.assign({}, this.addForm);
                        addUser(para).then((res) => {
                            this.addLoading = false;
                            if (res.data.success) {
                                this.$notify({
                                    title: '成功',
									message: '提交成功',
									type: 'success'
								});
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.loadBackMemberList();
                            }else{
                                this.$notify({
                                    title: '错误',
                                    message: res.data.msg,
                                    type: 'error'
                                })
                            }
                        });
                    });
                }
            });
        },
        // 改(编辑界面)
        handleEdit(index, row){
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
        },
        // 编辑页面提交
        editSubmit(){
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗?', '提示', {}).then(() => {
                        this.editLoading = true;
                        let para = Object.assign({}, this.editForm);
                        // 将para中的某些属性替换
                        para['display_name'] = para['displayName'];
                        para['username'] = para['name'];
                        para['status'] = para['stat'];
                        delete para['displayName'];
                        delete para['name'];
                        delete para['stat'];
                        editUser(para).then((res) => {
                            this.editLoading = false;
                            if (res.data.success) {
                                this.$notify({
                                    title: '成功',
									message: '编辑成功',
									type: 'success'
								});
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.loadBackMemberList();
                            }else{
                                this.$notify({
                                    title: '错误',
                                    message: res.data.msg,
                                    type: 'error'
                                })
                            }
                        })
                    })
                }
            })
        },
        // 角色管理详情页面
        handleDetails(index, row){
            this.detailsFormVisible = true;
            this.allRoles = [];
            this.detailsForm.accountRoles = [];
            this.allRolesMap = {};
            this.detailsForm['id'] = row['id'];
            let para = {};
            para['id'] = row['id'];
            requestCurrentRoles(para).then((res) => {
                if (res.data.success) {
                    let allRoles = res.data.data.allRoles;
                    allRoles.forEach((item) => {
                        this.allRoles.push(item.name);
                        this.allRolesMap[item.id] = item.name;
                    })
                    let accountRoles = res.data.data.accountRoles;
                    for(let key in accountRoles){
                        if (accountRoles[key]) {
                            this.detailsForm.accountRoles.push(this.allRolesMap[key]);
                        }
                    }
                }else{
                    this.$notify({
                        title: '错误',
                        message: res.data.msg + '请联系管理员',
                        type: 'error'
                    })
                }
            })
        },
        // 角色管理详情页面提交
        detailsSubmit(){
            this.$refs.detailsForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗?', '提示', {}).then(() => {
                        this.detailsLoading = true;
                        let para = Object.assign({}, this.detailsForm);
                        para['roleids'] = '';
                        this.detailsForm.accountRoles.forEach((item) => {
                            for(let key in this.allRolesMap){
                                if (item == this.allRolesMap[key]) {
                                    para['roleids'] += (key +',');
                                }
                            }
                        })
                        delete para['accountRoles'];
                        updateRoles(para).then((res) => {
                            this.detailsLoading = false;
                            if (res.data.success) {
                                this.$notify({
                                    title: '成功',
									message: '更新成功',
									type: 'success'
								});
                                this.$refs['detailsForm'].resetFields();
                                this.detailsFormVisible = false;
                                this.loadBackMemberList();
                            }else{
                                this.$notify({
                                    title: '错误',
                                    message: res.data.msg,
                                    type: 'error'
                                })
                            }
                        })
                    })
                }
            })
        },

        //加载后台用户列表
        loadBackMemberList(){
            let para = {
                page_index: this.page,
                id: this.filters.id,
                name: this.filters.name
            };
            this.listLoading = true;
            getBackMemberListPage(para)
                .then((res) => {
                    if (res.data.success) {
                        this.totalCount = res.data.data.totalCount;
                        this.limit = res.data.data.limit;
                        this.users = res.data.data.items;
                    }else {
                        this.users = [];
                        this.$notify({
                            title: '错误',
                            message: res.data.msg,
                            type: 'error'
                        })
                    }
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
            }
    },
    mounted(){
        this.loadBackMemberList();
    }
}
</script>

<style lang='less' scoped>
</style>
