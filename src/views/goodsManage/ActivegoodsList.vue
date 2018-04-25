<template lang="html">
    <section>
        <!-- 按钮  过滤  工具条-->
        <el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
            <el-form :inline=true :model='filters'>

                <el-form-item>
                    <el-input v-model='filters.id' placeholder='激活卡片 ID' icon="circle-cross" :on-icon-click="handleIconClick_clearId" @keydown.native.prevent.enter='loadList'></el-input>
                </el-form-item>

                <el-form-item>
                    <el-input v-model='filters.sn' placeholder='SN串号' icon="circle-cross" :on-icon-click="handleIconClick_clearSn" @keydown.native.prevent.enter='loadList'></el-input>
                </el-form-item>

                <el-form-item>
                    <el-input v-model='filters.sku_id' placeholder='SKU ID' icon="circle-cross" :on-icon-click="handleIconClick_clearSku_id" @keydown.native.prevent.enter='loadList'></el-input>
                </el-form-item>

                <el-form-item>
                    <el-input v-model='filters.user_id' placeholder='用户 ID' icon="circle-cross" :on-icon-click="handleIconClick_clearUser_id" @keydown.native.prevent.enter='loadList'></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type='primary' @click='loadList'>查询</el-button>
                </el-form-item>

                <!-- <el-form-item>
                    <el-button type='primary' @click='handleAdd'>新增</el-button>
                </el-form-item> -->
            </el-form>
        </el-col>

        <!-- 列表 -->
        <el-table border :data="oData" highlight-current-row v-loading="listLoading" style="width: 100%;">

            <el-table-column type="expand">
                <template scope="props">
                    <el-form label-position="left" inline class="demo-table-expand" label-width="100px">

                        <el-form-item label="卡片 ID">
                            <span>{{ props.row.entity.id }}</span>
                        </el-form-item>

                        <el-form-item label="用户 ID">
                            <span>{{ props.row.userEntity.id }}</span>
                        </el-form-item>

                        <el-form-item label="用户手机">
                            <span>{{ props.row.userEntity.mobile }}</span>
                        </el-form-item>

                        <el-form-item label="用户名">
                            <span>{{ props.row.userEntity.name }}</span>
                        </el-form-item>

                        <el-form-item label="SKU ID">
                            <span>{{ props.row.entity.skuId }}</span>
                        </el-form-item>

                        <el-form-item label="SKU名称">
                            <span>{{ props.row.skuEntity.name }}</span>
                        </el-form-item>

                        <el-form-item label="串号">
                            <span>{{ props.row.entity.sn }}</span>
                        </el-form-item>

                        <el-form-item label="激活日期">
                            <span>{{ props.row.entity.activeTime | formatTimeForFilter }}</span>
                        </el-form-item>

                        <el-form-item label="创建时间">
                            <span>{{ props.row.entity.ct | formatTimeForFilter }}</span>
                        </el-form-item>

                        <el-form-item label="更新时间">
                            <span>{{ props.row.entity.ut | formatTimeForFilter }}</span>
                        </el-form-item>

                        <el-form-item label="对应课程名称" style="width: 100%">
                            <span v-for="item in props.row.courseEntities" key="item">{{ item.name + ','}}</span>
                        </el-form-item>

                    </el-form>
                </template>
            </el-table-column>

            <el-table-column prop="entity.id" label="ID" width="85" sortable align='center'></el-table-column>

            <el-table-column prop="entity.sn" label="串号" width="200" align="center"></el-table-column>

            <el-table-column prop="skuEntity.name" label="SKU名称" align="center" show-overflow-tooltip></el-table-column>

            <el-table-column prop="userEntity.name" label="激活用户" align="center" show-overflow-tooltip></el-table-column>

            <el-table-column prop="userEntity.mobile" label="激活手机号" width="150" align="center"></el-table-column>

            <el-table-column prop="entity.activeTime" label="激活时间" :formatter='formatActiveTime' align="center"></el-table-column>

			<el-table-column prop="entity.stat" label="状态" :formatter='formatStat' width='70'></el-table-column>

		</el-table>

        <!-- 新增界面 -->
        <el-dialog title='新增' v-model='addFormVisible' :close-on-click-modal='false'>

            <el-form :model='addForm' label-width='100px' :rules='addFormRules' ref='addForm'>

                <el-form-item label='sn串号' prop='sn'>
                    <el-input v-model='addForm.sn'></el-input>
                </el-form-item>

                <el-form-item label='用户id' prop='user_id' >
                    <el-input v-model='addForm.user_id'></el-input>
                </el-form-item>

                <el-form-item label='密码' prop='password'>
                    <el-input v-model='addForm.password'></el-input>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>

        </el-dialog>

        <!-- 分页条 -->
        <el-col :span='24' class='toolbar'>
            <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size=limit :total=totalCount style='float: right'></el-pagination>
        </el-col>

    </section>
</template>

<script>
// 引入axios
import {
    getActivegoodsList,
    addActivegoods
} from '../../api/api'
// 引入工具类
import util from '../../common/js/util'

export default {
    data(){
        return {
            /*
                filter
             */
            filters: {
                id: '',
                sn: '',
                sku_id: '',
                user_id: ''
            },
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
                list 列表
             */
            oData: [],
            listLoading: false,
            /*
                add 新增
            */
            addFormVisible: false, //新增界面是否显示

            addLoading: false, //新增界面是否显示加载

            addFormRules: { //新增界面表单规则
                sn: [
                    { required: true, message: '请输入sn串号', trigger: 'blur' }
                ],
                user_id: [
                    { required: true, message: '请输入用户ID', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            },
            //新增界面表单数据类型
            addForm: {
                // sn: '',
                // user_id: '',
                // password: '',
            },
        }
    },
    filters:{
        // 列表 formatTimeForFilter 转换具体时间
        formatTimeForFilter(date){
            if (date == 0 || !date) {
                return '未更新'
            }else{
                return util.formatDate.format(new Date(date), 'yyyy/MM/dd');
            }
        },
    },
    methods: {
//ToolBar
        // 点击input后面的icon 清除内容
        handleIconClick_clearId(){
            this.filters.id = '';
        },
        handleIconClick_clearSn(){
            this.filters.sn = '';
        },
        handleIconClick_clearSku_id(){
            this.filters.sku_id = '';
        },
        handleIconClick_clearUser_id(){
            this.filters.user_id = '';
        },
        // 加载数据
        loadList(){
            let para = {
                page_index: this.page,
                id: this.filters.id,
                sn: this.filters.sn,
                sku_id: this.filters.sku_id,
                user_id: this.filters.user_id
            };
            this.listLoading = true;
            getActivegoodsList(para)

                .then((res) => {
                    if (res.data.success) {
                        this.totalCount = res.data.data.totalCount;
                        this.limit = res.data.data.limit;
                        this.oData = res.data.data.items;
                    }else{
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
        },
// 分页
        handleCurrentChange(val){
            this.page = val;
            this.loadList();
        },

//List
    // 列表显示
        // stat 转换状态
        formatStat(row, column){
            return row.entity.stat == 1 ? '有效' : row.entity.stat == 0 ? '无效' : '未知';
        },
        // 时间格式化
        formatCreateTime(row, column){
            return util.formatDate.format(new Date(row.entity.ct), 'yyyy/MM/dd');
        },
        formatUpdateTime(row, column){
            return row.entity.ut ? util.formatDate.format(new Date(row.entity.ut), 'yyyy/MM/dd') : '未更新';
        },
        formatActiveTime(row, column){
            return util.formatDate.format(new Date(row.entity.activeTime), 'yyyy/MM/dd hh:mm:ss');
        },
    // 新增
        // 新增页面
        handleAdd(){
            this.addFormVisible = true;
            this.addForm = {
                sn: '',
                user_id: '',
                password: '',
            }
        },
        // 新增页面提交
        addSubmit(){
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.addLoading = true;
                        let para = Object.assign({}, this.addForm);
                        addActivegoods(para).then((res) => {
                            if (res.data.success) {
                                this.$notify({
                                    title: '成功',
                                    message: '新增成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.addLoading = false;
                                this.loadList();
                            }else{
                                this.addLoading = false;
                                this.$notify.error({
                                    title: '错误',
                                    message: res.data.msg
                                });
                            }
                        });
                    });
                }
            });
        },
    },
    mounted(){
        this.loadList();
    }
}
</script>

<style lang="less">
</style>
