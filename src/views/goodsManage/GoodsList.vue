<template lang="html">
    <div class="goodsPage" v-loading="listLoading" element-loading-text="努力加载中...">
        <section>
            <!-- 按钮  过滤  工具条-->
            <el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
                <el-form :inline=true :model='filters'>

                    <el-form-item>
                        <el-input v-model='filters.sn' placeholder='SN串号' icon="circle-cross" :on-icon-click="handleIconClick_clearSn" @keydown.native.prevent.enter='loadList'></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-input v-model='filters.sku_id' placeholder='SKU ID' icon="circle-cross" :on-icon-click="handleIconClick_clearSku_id" @keydown.native.prevent.enter='loadList'></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-input v-model='filters.batch' placeholder='批次' icon="circle-cross" :on-icon-click="handleIconClick_clearBatch" @keydown.native.prevent.enter='loadList'></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-form-item>
                            <el-date-picker
                                v-model="filters.add_time"
                                type="date"
                                placeholder="批次时间"
                                @keydown.native.prevent.enter='loadList'
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-form-item>

                    <el-form-item>
                        <el-button type='primary' @click='loadList'>查询</el-button>
                    </el-form-item>

                    <el-form-item>
                        <el-button type='primary' @click='handleAdd'>新增</el-button>
                    </el-form-item>

                    <el-form-item>
                        <el-button type='primary' @click='handleImport'>导入excel</el-button>
                    </el-form-item>

                </el-form>
            </el-col>

            <!-- 列表 -->
            <el-table border :data="oData" highlight-current-row style="width: 100%;">

                <el-table-column type="expand">
                    <template scope="props">
                        <el-form label-position="left" inline class="demo-table-expand" label-width="100px">

                            <el-form-item label="卡片 ID" style="width: 100%">
                                <span>{{ props.row.entity.id }}</span>
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

                            <el-form-item label="串号密码">
                                <span>{{ props.row.entity.password }}</span>
                            </el-form-item>

                            <el-form-item label="批次">
                                <span>{{ props.row.entity.batch }}</span>
                            </el-form-item>

                            <el-form-item label="批次日期">
                                <span>{{ props.row.entity.addTime | formatTimeForFilter }}</span>
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

                            <el-form-item label="备注信息" style="width: 100%">
                                <span>{{ props.row.conf.remark }}</span>
                            </el-form-item>

                        </el-form>
                    </template>
                </el-table-column>

                <el-table-column prop="entity.id" label="ID" width="95" sortable align='center'></el-table-column>

    			<el-table-column prop="entity.sn" label="串号" width="220" align="center"></el-table-column>

                <el-table-column prop="entity.password" label="串号密码" width="140" align="center"></el-table-column>

                <el-table-column prop="entity.batch" label="批次" width="65" align="center"></el-table-column>

                <el-table-column prop="entity.addTime" label="批次时间" :formatter='formatAddTime' align="center"></el-table-column>

                <el-table-column prop="entity.ct" label="创建时间" :formatter='formatCreateTime' align="center"></el-table-column>

                <el-table-column prop="entity.ut" label="更新时间" :formatter='formatUpdateTime' align="center"></el-table-column>

    			<el-table-column prop="entity.status" label="状态" :formatter='formatStat' width='70'></el-table-column>

                <el-table-column label='操作' align="center" width='70'>
                    <template scope='scope'>
                        <el-button size='small' type='success' @click='handleEdit(scope.$index, scope.row)'>编辑</el-button>
                    </template>
                </el-table-column>

    		</el-table>

            <!-- 编辑界面 -->
            <el-dialog title='编辑' v-model='editFormVisible' :close-on-click-modal='false'>
                <el-form :model='editForm' label-width='100px' :rules='editFormRules' ref='editForm'>

                    <el-form-item label="状态" prop='status'>
    					<el-radio-group v-model="editForm.status">
    						<el-radio class="radio" :label="1">有效</el-radio>
    						<el-radio class="radio" :label="0">无效</el-radio>
    					</el-radio-group>
    				</el-form-item>

                    <el-form-item label="备注信息" prop='remark' >
                        <el-input type="textarea" v-model='editForm.remark'></el-input>
                    </el-form-item>

                </el-form>

                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="editFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
                </div>
            </el-dialog>

            <!-- 导入excel界面 -->
            <el-dialog title='导入excel' v-model='importFormVisible' :close-on-click-modal='false'>
                <el-form :model='importForm' label-width='10px' ref='importForm'>
                    <el-form-item>
                        <el-upload
                            class="upload-demo"
                            ref="upload"
                            action="/op/goods/import"
                            name="excelFile"
                            list-type="importture"
                            :on-change="handleChange"
                            :file-list="fileList"
                            :auto-upload="false"
                            :on-success="handleSuccess"
                        >
                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                            <div slot="tip" class="el-upload__tip">只支持单个文件上传 且只能上传excel文件</div>
                        </el-upload>
                    </el-form-item>
                </el-form>
            </el-dialog>

            <!-- 分页条 -->
            <el-col :span='24' class='toolbar'>
                <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size=limit :total=totalCount style='float: right'></el-pagination>
            </el-col>
        </section>
    </div>
</template>

<script>
// 引入axios
import {
    getGoodsList,
    updateGoods
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
                batch: ''
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
                list
             */
            oData: [],
            listLoading: false,
            /*
                编辑
             */
            editFormVisible: false, //编辑界面是否显示

            editLoading: false, //编辑界面是否显示加载

            editFormRules: {//编辑界面表单规则
                batch: [
                    { required: true, message: '请输入批次', trigger: 'blur' }
                ],
                status: [
                    { required: true }
                ],
                add_time: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ]
            },

            editForm: {
                // id: '',
                // status: '1',
                // remark: ''
            },
            /*
                导入excel界面
             */
            importFormVisible: false,
            importForm: {},
            // 空对象 绑定到上传的data上
            kongObj: {},
            // tags 标签
            inputVisible: false,
            inputValue: '',
            fileList: [],
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
        handleIconClick_clearSn(){
            this.filters.sn = '';
        },
        handleIconClick_clearSku_id(){
            this.filters.sku_id = '';
        },
        handleIconClick_clearBatch(){
            this.filters.batch = '';
        },
        // 加载数据
        loadList(){
            // 初始化this.oData为空数组
            this.oData = [];

            let para = {
                page_index: this.page,
                sn: this.filters.sn,
                sku_id: this.filters.sku_id,
                batch: this.filters.batch,
                add_time: this.filters.add_time
            };
            this.filters.add_time ? para['add_time'] = util.formatDate.format(this.filters.add_time, 'yyyy-MM-dd') : '';
            this.listLoading = true;
            getGoodsList(para)
                .then((res) => {
                    if (res.data.success) {
                        this.totalCount = res.data.data.totalCount;
                        this.limit = res.data.data.limit;
                        res.data.data.items.forEach((item) => {
                            if (item) {
                                this.oData.push(item);
                            }
                        })
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
        // stat 数字转换状态
        formatStat(row, column){
            return row.entity.stat == 1 ? '有效' : row.entity.stat == 0 ? '无效' : '未知';
        },
        // list 列表内部要进行时间转化 不能用过滤器的方法 所以再写一个
        formatAddTime(row, column){
            return row.entity.addTime ? util.formatDate.format(new Date(row.entity.addTime), 'yyyy/MM/dd') : '未设置';
        },
        formatCreateTime(row, column){
            return row.entity.ct ? util.formatDate.format(new Date(row.entity.ct), 'yyyy/MM/dd') : '未设置';
        },
        formatUpdateTime(row, column){
            return row.entity.ut ? util.formatDate.format(new Date(row.entity.ut), 'yyyy/MM/dd') : '未更新';
        },
    // 新增
        // 新增页面
        handleAdd(){
            this.$router.push({ path: '/printgoodsList', query: { flag: true } });
        },
    // 编辑
        handleEdit(index, row){
            this.editFormVisible = true;
            // 把对象的值插入
            this.editForm = {
                id: row.entity.id,
                status: row.entity.stat,
                remark: row.conf.remark
            }
        },
        // 编辑页面提交
        editSubmit(){
            this.$confirm('确认提交吗?', '提示', {})
                .then(() => {
                    this.editLoading = true;
                    let para = Object.assign({}, this.editForm);

                    updateGoods(para).then((res) => {

                        this.editLoading = false;
                        if (res.data.success) {
                            this.$notify({
                                title: '成功',
    							message: '编辑成功',
    							type: 'success'
    						});
                            this.$refs['editForm'].resetFields();
                            this.editFormVisible = false;
                            this.loadList();
                        }else{
                            this.$notify({
                                title: '错误',
                                message: res.data.msg,
                                type: 'error'
                            });
                        }
                    })
                })
                .catch(() => {
                    this.$notify({
                        title: '提示',
                        message: '取消操作',
                        type: 'info'
                    })
                })
        },
    // 编辑
        handleImport(index, row){
            this.importFormVisible = true;
        },
        //on-change 对应的函数 文件状态改变的时候触发
        handleChange(file, fileList){
            if (fileList.length>1) {
                fileList.length = 1;
                this.$notify({
                    title: '错误',
                    message: '只支持单个文件上传',
                    type: 'error'
                });
            }
        },
        submitUpload() {
            if (this.$refs.upload.uploadFiles[0]) {
                this.$refs.upload.submit();
            }else{
                this.$notify({
                    title: '错误',
                    message: '请选择excel文件',
                    type: 'error'
                });
            }
        },
        handleSuccess(response, file, fileList){
            if (response.success) {
                this.$notify({
                    title: '成功',
                    message: '操作成功,请等待处理...',
                    type: 'success'
                });
                this.$refs['importForm'].resetFields();
                this.$refs['upload'].uploadFiles.length = 0;
                this.importFormVisible = false;
                // 25s后加载列表
                let self = this;
                this.totalCount = 0;
                this.listLoading = true;
                setTimeout(function(){
                    self.loadList();
                }, 25000)

            }else{
                this.$notify({
                    title: '错误',
                    message: response.msg,
                    type: 'error'
                })
            }
        },

    },
    mounted(){
        this.loadList();
    }
}
</script>

<style lang="less">

</style>
