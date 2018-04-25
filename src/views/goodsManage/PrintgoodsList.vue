<template lang="html">

    <div class="printGoodsPage" v-loading="listLoading" element-loading-text="努力加载中...">

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
                        <el-button type='primary' @click='handleExport'>导出excel</el-button>
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

    			<el-table-column prop="entity.sn" label="串号" align="center"></el-table-column>

                <el-table-column prop="entity.password" label="串号密码" align="center"></el-table-column>

                <el-table-column prop="entity.batch" label="批次" width="65" align="center"></el-table-column>

                <el-table-column prop="entity.status" label="状态" :formatter='formatStat' width='70'></el-table-column>

                <el-table-column prop="entity.addTime" label="批次时间" :formatter='formatAddTime' align="center" width="140"></el-table-column>

                <el-table-column prop="entity.ct" label="创建时间" :formatter='formatCreateTime' align="center" width="140"></el-table-column>

                <el-table-column label='操作' v-if="isFromGoodsList" align="center">
                    <template scope='scope'>
                        <el-button size='small' type="success" @click='sureToAdd(scope.$index, scope.row)'>确认添加</el-button>
                    </template>
                </el-table-column>

    		</el-table>

            <!-- 分页条 -->
            <el-col :span='24' class='toolbar'>
                <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size=limit :total=totalCount style='float: right'></el-pagination>
            </el-col>

            <!-- 新增界面 -->
            <el-dialog title='新增' v-model='addFormVisible' :close-on-click-modal='false'>
                <el-form :model='addForm' label-width='100px' :rules='addFormRules' ref='addForm'>

                    <el-form-item label='批次' prop='batch'>
                        <el-input v-model='addForm.batch' style="width: 100px"></el-input>
                    </el-form-item>

                    <el-form-item label='数量' prop='number' >
                        <el-input v-model='addForm.number' style="width: 100px"></el-input>
                    </el-form-item>

                    <el-form-item label='前缀' prop='sn_prefix' >
                        <el-input v-model='addForm.sn_prefix' style="width: 100px"></el-input>
                    </el-form-item>

                    <el-form-item label='长度' prop='sn_length' >
                        <el-input v-model='addForm.sn_length' style="width: 100px"></el-input>
                    </el-form-item>

                    <el-form-item label="选择sku" prop='sku_id'>
                        <section class="checkedCodeConf">

                            <el-select v-model="selectSpu" placeholder="请输入Spu关键词或ID" filterable clearable remote :remote-method="selectSpuRemoteMethod" @change='checkedSpuInCode' :loading='selectSpuLoading'>
                                <el-option
                                    v-for="item in SpuOptions"
                                    :key="item.id"
                                    :label="'（' + item.id + '）' + item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>

                            <el-select v-model="addForm.sku_id" placeholder="请选择Sku" style="margin:0 15px 10px 0" :loading='selectSkuLoading'>
                                <el-option
                                    v-for="item in SkuOptions"
                                    :key="item.id"
                                    :label="'（' + item.id + '）' + item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>

                        </section>
                    </el-form-item>

                    <el-form-item label="时间" required>
                        <el-col :span="11">
                            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.add_time" style="width: 100%;"></el-date-picker>
                        </el-col>
                    </el-form-item>

                    <el-form-item label="状态" prop='status'>
    					<el-radio-group v-model="addForm.status">
    						<el-radio class="radio" :label="1">有效</el-radio>
    						<el-radio class="radio" :label="0">无效</el-radio>
    					</el-radio-group>
    				</el-form-item>

                    <el-form-item label='备注信息' prop='remark'>
                        <el-input type="textarea" v-model='addForm.remark'></el-input>
                    </el-form-item>

                </el-form>

                <div slot="footer" class="dialog-footer">
    				<el-button @click.native="addFormVisible=false">取消</el-button>
    				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
    			</div>
            </el-dialog>

            <!-- 编辑界面 -->
            <el-dialog title='编辑' v-model='exportFormVisible' :close-on-click-modal='false'>
                <el-form :model='exportForm' label-width='100px' :rules='exportFormRules' ref='exportForm'>

                    <el-form-item label='批次' prop='batch'>
                        <el-input v-model='exportForm.batch' style="width: 220px"></el-input>
                    </el-form-item>

                    <el-form-item label="批次时间" required>
                        <el-col :span="9">
                            <el-date-picker type="date" placeholder="选择日期" v-model="exportForm.add_time" style="width: 100%;"></el-date-picker>
                        </el-col>
                    </el-form-item>

                </el-form>

                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="exportFormVisible=false">取消</el-button>
                    <el-button type="primary" @click.native="exportSubmit" :loading="editLoading">提交</el-button>
                </div>
            </el-dialog>

            <!-- 隐藏的form表单 接收服务器发来的excel文件 用form表单的post进行请求 浏览器会自动下载 别的方式暂时不可以 -->
            <section>
                <form method="post" ref="oForm"></form>
            </section>

        </section>

    </div>

</template>

<script>
// 引入axios
import {
    getPrintgoodsList,
    addPrintgoods,
    exportPrintgoodsExcel,
    addGoods,

    // 获取spu列表
    getSpuList,
    // 获取sku列表
    getSkuList
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
                sn: '',
                sku_id: '',
                batch: '',
                add_time: ''
            },
            /*
                pagination
                数据总量
                当前页码
                分页每页显示多少数据
             */
            totalCount: 0,
            page: 1,
            limit: 1,
            /*
                list
             */
            oData: [],
            listLoading: false,
            // 新增界面
            addFormVisible: false, //新增界面是否显示

            addLoading: false, //新增界面是否显示加载

            addFormRules: { //新增界面表单规则
                number: [
                    { required: true, message: '请输入卡号数量', trigger: 'blur' }
                ],
                sn_prefix: [
                    { required: true, message: '请输入卡号前缀', trigger: 'blur' }
                ],
                sn_length: [
                    { required: true, message: '请输入卡号长度', trigger: 'blur' }
                ],
                sku_id: [
                    { type: 'number', required: true, message: '请输入SKU ID', trigger: 'blur' }
                ],
                add_time: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ],
                batch: [
                    { required: true, message: '请输入批次', trigger: 'blur' }
                ],
                status: [
                    { required: true }
                ],
                remark: [
                    { required: false, message: '请输入备注信息', trigger: 'blur' }
                ]
            },
            //新增界面表单数据类型
            addForm: {
                // number: '',
                // sn_prefix: '',
                // sn_length: 10,
                // sku_id: '',
                // add_time: '',
                // batch: '',
                // remark: '',
                // status: 1
            },

            // 选择框 -> Spu
			SpuOptions: [],
			selectSpu: '',
			selectSpuLoading: false,

			// 选择框 -> Sku
			SkuOptions: [],
			// selectSku: '',
			selectSkuLoading: false,


            // 编辑界面
            exportFormVisible: false, //编辑界面是否显示

            editLoading: false, //编辑界面是否显示加载

            exportFormRules: {//编辑界面表单规则
                batch: [
                    { required: true, message: '请输入批次', trigger: 'blur' }
                ],
                add_time: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ]
            },

            exportForm: {
                // add_time: '',
                // batch: '',
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
    computed:{
        isFromGoodsList(){
            return this.$route.query.flag?true:false;
        }
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
            getPrintgoodsList(para)
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
            this.addFormVisible = true;
            this.addForm = {
                number: '',
                sn_prefix: '',
                sn_length: 0,
                sku_id: '',
                add_time: '',
                batch: '',
                remark: '',
                status: 1
            }
        },
        // 新增页面  搜索 Spu 列表
        selectSpuRemoteMethod(query){
            if (query !== '') {
                this.selectSpuLoading = true;
                let temp = Number(query);
                let parameter = {};
                if (temp) {
                    parameter = {
                        id: temp,
                        type: 1
                    };
                }else {
                    parameter = {
                        name: query,
                        type: 1
                    };
                };
                // 调用 加载列表的接口
                getSpuList(parameter).then((res) => {
                    if (res.data.success) {
                        this.SpuOptions = res.data.data.items.map((item) => {
                            let tempObj = {
                                id: item.entity.id,
                                name: item.entity.name,
                            }
                            return tempObj
                        });
                    }else{
                        this.$notify({
                            title: '错误',
                            message: res.data.msg,
                            type: 'error'
                        })
                    }
                    this.selectSpuLoading = false;
                });
            } else {
                this.SpuOptions = [];
            }
        },
        // 选择Spu 之后 加载Sku列表
		checkedSpuInCode(value){
			if (value !== '') {
				this.selectSkuLoading = true;
				let parameter = {
					spu_id: value,
                    type: 0
				};
				// 调用 加载列表的接口
				getSkuList(parameter).then((res) => {
					if (res.data.success) {
						this.SkuOptions = res.data.data.items.map((item) => {
							let tempObj = {
								id: item.entity.id,
								name: item.entity.name,
								courseEntities: item.courseEntities
							}
							return tempObj
						});
					}else{
                        this.$notify({
                            title: '错误',
                            message: res.data.msg,
                            type: 'error'
                        })
					}
					this.selectSkuLoading = false;
				});
			}else {
				this.selsctSpu = '';
				this.SpuOptions = [];
				this.selectSku = '';
				this.SkuOptions = [];
			}
		},
        // 新增页面提交
        addSubmit(){
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.addLoading = true;
                        let para = Object.assign({}, this.addForm);
                        para['add_time'] = util.formatDate.format(para['add_time'], 'yyyy-MM-dd');
                        addPrintgoods(para).then((res) => {
                            if (res.data.success) {
                                this.$notify({
                                    title: '成功',
                                    message: res.data.data,
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.addLoading = false;

                                this.listLoading = true;
                                let self = this;
                                this.totalCount = 0;
                                setTimeout(function(){
                                    self.loadList();
                                }, 25000)

                            }else{
                                this.$notify({
                                    title: '错误',
                                    message: res.data.msg,
                                    type: 'error'
                                });
                                this.addLoading = false;
                            }
                        });
                    });
                }
            });
        },
        // 出厂卡片的确认增加 只有在页面从出厂卡片跳转过来才能进行确认增加
        sureToAdd(index, row){
            let para = { sn: row.entity.sn }
            addGoods(para).then((res) => {
                if (res.data.success) {
                    this.$notify({
                        title: '成功',
                        message: '添加出厂卡片成功',
                        type: 'success'
                    });
                }else{
                    this.$notify({
                        title: '错误',
                        message: res.data.msg,
                        type: 'error'
                    });
                }
            })
        },
    // 导出excel
        handleExport(){
            this.exportFormVisible = true;
            // 把对象的值插入
            this.exportForm = {
                batch: '',
                add_time: '',
            }
        },
        // 导出excel页面提交
        exportSubmit(){
            this.$refs.exportForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗?', '提示', {}).then(() => {
                        this.editLoading = true;
                        let para = Object.assign({}, this.exportForm);
                        para['add_time'] = util.formatDate.format(para['add_time'], 'yyyy-MM-dd');
                        exportPrintgoodsExcel(para).then((res) => {
                            this.editLoading = false;
                            if (res.data) {
                                this.$notify({
                                    title: '成功',
                                    message: '导出成功',
                                    type: 'success'
                                });
                                // 借用隐藏的form表单提交数据 请求到excel进行下载
                                this.$refs['oForm'].action = "/op/printgoods/export?batch="+ para['batch'] + "&add_time=" + para['add_time'];
                                this.$refs['oForm'].methods = 'post';
                                this.$refs['oForm'].submit();
                                // 成功之后重置exportForm表单数据
                                this.$refs['exportForm'].resetFields();
                                this.exportFormVisible = false;
                            }else {
                                this.$notify({
                                    title: '错误',
                                    message: '出错',
                                    type: 'error'
                                });
                            }
                        })
                    })
                }
            })
        }
    },
    mounted(){
        this.loadList();
    }
}
</script>

<style lang="less">

</style>
