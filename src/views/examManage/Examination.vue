<template lang="html">
  <div class="examination">
    <!-- 头部查询筛选 -->
    <el-col  class='toolbar' style='padding-bottom: 0px;'>
        <el-form :inline = "true" v-model='filter'>
            <el-form-item>
                <el-input  placeholder='请输入试卷 ID' icon="circle-cross" :on-icon-click="handleIconClick_clearId" v-model="filter.id"></el-input>
            </el-form-item>

            <el-form-item>
                <el-input  placeholder='请输入试卷名称' icon="circle-cross" v-model="filter.name" :on-icon-click="handleIconClick_clearName"></el-input>
            </el-form-item>

            <el-form-item>
              <el-select  placeholder="等级" v-model="filter.level" clearable>
                 <el-option v-for="item in examRange" :key="item.value" :label="item.label" :value="item.value">
                 </el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-select  placeholder="类型" v-model="filter.type" clearable>
                 <el-option v-for="item in examType" :key="item.value" :label="item.label" :value="item.value">
                 </el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-select  placeholder="是否有效" v-model="filter.status" clearable>
                 <el-option v-for="item in isValue" :key="item.value" :label="item.label" :value="item.value">
                 </el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type='primary' @click="queryExam">查询</el-button>
            </el-form-item>

            <el-form-item>
                <el-button type='primary' @click="addExam">新增</el-button>
            </el-form-item>
        </el-form>
    </el-col>

    <!-- 试卷列表展示 -->
    <el-table :data="examList" border style="width: 100%" v-loading="examListLoading" >
        <el-table-column type="expand">
            <template scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="封面图片">
                  <img :src="props.row.conf.image&&props.row.conf.image.coverUrl&&props.row.conf.image.covelUrl !== 'undefined'?props.row.conf.image.coverUrl:'../../static/images/defaultPicInElementVideo.jpg'" alt="" style="width:100px;height:100px;">
                </el-form-item>
                <el-form-item label="试卷ID">
                  <span>{{ props.row.entity.id }}</span>
                </el-form-item>
                <el-form-item label="试卷类型">
                  <span>{{ props.row.entity.types }}</span>
                </el-form-item>
                <el-form-item label="试卷名称">
                  <span>{{ props.row.entity.name }}</span>
                </el-form-item>
                <el-form-item label="试卷等级">
                  <span>{{ props.row.entity.levels }}</span>
                </el-form-item>
                <el-form-item label="英文名称">
                  <span>{{ props.row.entity.enName }}</span>
                </el-form-item>
                <el-form-item label="试卷标签">
                  <span>{{ props.row.entity.tags }}</span>
                </el-form-item>
                <el-form-item label="试卷描述">
                  <span>{{ props.row.entity.description }}</span>
                </el-form-item>
                <el-form-item label="试卷标记">
                  <span>{{ props.row.entity.remark }}</span>
                </el-form-item>
              </el-form>
            </template>
        </el-table-column>
        <el-table-column prop="entity.id" label="ID" sortable width="100" align="center"></el-table-column>
        <el-table-column prop="entity.name" label="试卷名称" align="center"></el-table-column>
        <el-table-column prop="entity.types" label="试卷类型" align="center"></el-table-column>
        <el-table-column prop="entity.levels" label="试卷等级" align="center"></el-table-column>
        <el-table-column prop="entity.status" label="试卷状态" align="center"></el-table-column>

        <el-table-column label="操作">
            <template scope="scope">
                <el-button-group>
                  <el-button type="success" size="small" @click="updateExam(scope.row, scope.$index)">编辑</el-button>
                    <el-button type="info" size="small" @click="examQuestions(scope.row, scope.$index)">关联题库</el-button>
                </el-button-group>
            </template>
        </el-table-column>
    </el-table>

    <!-- 试卷列表分页 -->
    <el-col class='toolbar'>
      <el-pagination style='float: right' @current-change="handleCurrentChange" :current-page.sync="examListPage" :page-size="20" layout="total, prev, pager, next" :total="totalCount">
      </el-pagination>
    </el-col>

    <!-- 新增试卷弹窗 -->
    <el-dialog title='新增试卷' :visible.sync="addFormVisible" :close-on-click-modal='false'>
        <el-form :model='examInfo' label-width='100px' ref="examInfo" :rules="addExamRuler">
					  <el-form-item label='试卷名称' prop="name">
							  <el-input v-model='examInfo.name' auto-complete='off'></el-input>
					  </el-form-item>
            <el-form-item label='试卷英文名称' prop="en_name">
							  <el-input v-model='examInfo.en_name' auto-complete='off'></el-input>
					  </el-form-item>
            <el-form-item label='试卷类型' prop="type">
              <el-select v-model="examInfo.type" placeholder="请选择">
                <el-option v-for="item in examType" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
					  </el-form-item>
            <el-form-item label='试卷等级' prop="level">
              <el-select v-model="examInfo.level" placeholder="请选择">
                <el-option v-for="item in examRange" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
					  </el-form-item>
            <el-form-item label='试卷标签' prop="tags">
							  <el-input v-model='examInfo.tags' auto-complete='off'></el-input>
					  </el-form-item>
            <el-form-item label='试卷描述' prop="description">
              <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="examInfo.description">
              </el-input>
					  </el-form-item>
            <el-form-item label='试卷备注' prop="remark">
              <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="examInfo.remark">
              </el-input>
					  </el-form-item>
            <el-form-item label='试卷封面' prop="cover_url">
               <el-input v-model='examInfo.cover_url' auto-complete='off'></el-input>
            </el-form-item>
            <el-form-item label='是否有效' prop="status">
								<el-radio class="radio" v-model="examInfo.status" label='1'>有效</el-radio>
							  <el-radio class="radio" v-model="examInfo.status" label='0'>无效</el-radio>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="addFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="addExamination">提交</el-button>
        </div>
    </el-dialog>

    <!-- 编辑试卷弹窗 -->
    <el-dialog title='编辑试卷' :visible.sync="editFormVisible" :close-on-click-modal='false'>
        <el-form :model='editExamInfo' label-width='100px' ref="editExamInfo" :rules="addExamRuler">
					  <el-form-item label='试卷名称' prop="name">
							  <el-input v-model='editExamInfo.name' auto-complete='off'></el-input>
					  </el-form-item>
            <el-form-item label='试卷英文名称' prop="en_name">
							  <el-input v-model='editExamInfo.en_name' auto-complete='off'></el-input>
					  </el-form-item>
            <el-form-item label='试卷类型' prop="type">
              <el-select v-model="editExamInfo.type" placeholder="请选择">
                <el-option v-for="item in examType" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
					  </el-form-item>
            <el-form-item label='试卷等级' prop="level">
              <el-select v-model="editExamInfo.level" placeholder="请选择">
                <el-option v-for="item in examRange" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
					  </el-form-item>
            <el-form-item label='试卷标签' prop="tags">
							  <el-input v-model='editExamInfo.tags' auto-complete='off'></el-input>
					  </el-form-item>
            <el-form-item label='试卷描述' prop="description">
              <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="editExamInfo.description">
              </el-input>
					  </el-form-item>
            <el-form-item label='试卷备注' prop="remark">
              <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="editExamInfo.remark">
              </el-input>
					  </el-form-item>
            <el-form-item label='试卷封面' prop="cover_url">
               <el-input v-model='editExamInfo.cover_url' auto-complete='off'></el-input>
            </el-form-item>
            <el-form-item label='是否有效' prop="status">
								<el-radio class="radio" v-model="editExamInfo.status" label='1'>有效</el-radio>
							  <el-radio class="radio" v-model="editExamInfo.status" label='0'>无效</el-radio>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="editFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="editExamination">提交</el-button>
        </div>
    </el-dialog>
    <!-- 关联题库链接 -->
    <el-dialog title='绑定题库' :visible.sync="examQuestionsFormVisible" :close-on-click-modal='false'>
      <el-form label-width="100px">
        <!-- 我是搜索框框 -->
        <el-form-item label="搜素题库">
          <el-select v-model="questionId" placeholder="请输入课程关键词或ID" style="width:300px;" filterable clearable remote :remote-method="searchQuestionFunc">
            <el-option
              v-for="item in questionOptions"
              :key="item.entity.id"
              :label="'（' + item.entity.id + '）' + item.entity.title"
              :value="JSON.stringify(item)">
            </el-option>
          </el-select>
          <el-button type="primary" icon="plus" @click='addQuestionToExam'></el-button>
         </el-form-item>
        <el-form-item label="展示配置">
          <div v-if='examConfInfo.addQuestionIds&&examConfInfo.addQuestionIds.length'>
              <draggable draggable :list="examConfInfo.addQuestionIds">
                <section v-for='(item, index) in examConfInfo.addQuestionIds' :key='index' style="display:flex;justify-content:space-between;align-items:center;">
              <span>
                {{ item.entity.id }} : {{ item.entity.title }}
              </span>
              <i class="el-icon-close" @click="deleteItemInQuestions(index)"></i>
            </section>
              </draggable>
          </div>
          <div v-else>
            当前列表为空
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="examQuestionsFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddQuestionExam" :plain="true">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getExamList,
  addExam,
  updateExam,
  getQuestionList,
  addQuestionExam,
} from '../../api/api'
import draggable from 'vuedraggable'

export default {
  components:{
    draggable
  },
  data() {
    return {
      //查询筛选数据初始化
      filter:{
        name: '',
        id:'',
        type:'',
        level: '',
        tags: '',
        status: ''
      },
      //试卷列表数据初始化
      examList:[],
      //列表页初始化
      examListPage: 1,
      questionOptions:[],
      questionId:'',
      addQuestionIds: [],
      //弹窗显示初始化
      addFormVisible: false,
      editFormVisible: false,
      examQuestionsFormVisible: false,
      examListLoading: false,
      //试卷总数量
      totalCount: 0,
      //总页数
      totalPage: 0,
      //初始化试卷内容数据
      examInfo: {
        name: '',
        en_name: '',
        type: '',
        level: '',
        tags: '',
        description: '',
        remark: '',
        status: '1',
        cover_url:'',
      },
      examConfInfo: {
        addQuestionIds: [],
        id: ''
      },
      editExamInfo: {
        id: '',
        name: '',
        en_name: '',
        type: '',
        level: '',
        tags: '',
        description: '',
        remark: '',
        status: '',
        cover_url: '',
      },
      //数据类型初始化
      examType: [
        {
          label: '课节测试',
          value: 1
        },
        {
          label: '课程测试',
          value: 2
        }
      ],
      examRange: [
        {
          label: '初级',
          value: 1
        },
        {
          label: '中级',
          value: 2
        },
        {
          label: '高级',
          value: 3
        }
      ],
      isValue: [
        {
					label:'有效',
					value:'1'
				},
				{
					label:'无效',
					value:'0'
				},
      ],
      //  表单的验证规则
      addExamRuler:{
        name:[
          { required: true, message: '请输入试卷名称', trigger: 'blur' }
        ],
        type:[
          { type:'number', required: true, message: '请输入试卷类型', trigger: 'change' }
        ],
        level:[
          { type:'number', required: true, message: '请输入试卷等级', trigger: 'change' }
        ],
        tags:[
          { required: true, message: '请输入试卷标签', trigger: 'blur' }
        ],
      }
    }
  },
  methods : {
    /*
         清空输入框操作
    */
    handleIconClick_clearId() {
      this.filter.id = '';
    },
    handleIconClick_clearName() {
      this.filter.name = '';
    },
    /*
        点击查询按钮操作
    */
    queryExam() {
      this.loadListData();
    },
    /*
        分页操作
    */
    handleCurrentChange(page) {
      this.loadListData(page);
    },
    /*
        点击新增按钮操作
    */
    addExam() {
      this.addFormVisible = true;
      this.examInfo = {
        name: '',
        en_name: '',
        type: '',
        level: '',
        tags: '',
        description: '',
        remark: '',
        status: '1',
        cover_url:''
      }
    },
    //新增试卷接口调用
    addExamination() {
      this.$refs.examInfo.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.examInfo);
          let self = this;
          addExam(para).then(res => {
            if(res.data.success) {
              this.$notify({
                title: '添加成功',
                message: '新增试卷信息成功',
                type: 'success'
              });
            }else{
              this.$message.error(res.data.msg || '未知错误，请联系管理员');
            }
            this.loadListData(1);
            this.examListPage = 1;
            this.addFormVisible = false;
          })
          .catch(err => {
            self.errorFunction(err);
            this.addFormVisible = false;
          })
        };
      });
    },
    /*
        点击编辑按钮
    */
    updateExam(item, index) {
      this.editFormVisible = true;
      this.editExamInfo.id = item.entity.id;
      this.editExamInfo.name = item.entity.name;
      this.editExamInfo.en_name = item.entity.enName;
      this.editExamInfo.type = item.entity.type;
      this.editExamInfo.level = item.entity.level;
      this.editExamInfo.tags = item.entity.tags;
      this.editExamInfo.description = item.entity.description;
      this.editExamInfo.remark = item.entity.remark;
      this.editExamInfo.status = String(item.entity.stat);
      if (item.conf.image&&item.conf.image.coverUrl) {
        this.editExamInfo.cover_url = item.conf.image.coverUrl;
      }else{
          this.editExamInfo.cover_url = ''
      }
    },
    /*
        更新试卷接口调用
    */
    editExamination() {
      this.$refs.editExamInfo.validate(valid => {
        if (valid) {
          this.$confirm('是否确认修改?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let para = Object.assign({}, this.editExamInfo);
            para.status = Number(para.status)
            let self = this;
            updateExam(para).then(res => {
                if(res.data.success) {
                  this.$notify({
      							title: '修改成功',
      							message: '修改试卷信息成功',
      							type: 'success'
      						});
                }else {
                  this.$message.error(res.data.msg || '未知错误，请联系管理员');
                }
                this.loadListData(1);
                this.examListPage = 1;
                this.editFormVisible = false;
            })
            .catch(error => {
              self.errorFunction(error);
              this.editFormVisible = false;
            })
          }).catch(() => {
            this.editFormVisible = false;
          });

        }
      })
    },
    /*
        关联题库按钮点击
    */
    examQuestions(item) {
      this.examQuestionsFormVisible = true;
      if (item.conf.questionList) {
        this.examConfInfo.addQuestionIds = item.conf.questionList
      } else {
        this.examConfInfo.addQuestionIds = []
      }
      this.examConfInfo.id = item.entity.id
    },
    /*
        请求question列表数据
    */
    searchQuestionFunc(query) {
      let temp = Number(query);
      let parameter = {};
      if (temp) {
        parameter = {
            id: temp,
        };
      }else {
        parameter = {
          name: query,
        };
      };
      getQuestionList(parameter).then(res => {
        if (res.data.success) {
          if (res.data.data.items && res.data.data.items.length) {
            this.questionOptions =res.data.data.items.map((item) => {
              let tempObj = {
                entity:{
                  id: item.entity.id,
                  title: item.entity.title,
                }
              }
              return tempObj
            });
          }
        } else {
          this.$message.error(res.data.msg || '未知错误，请联系管理员');
        }
      })
    },
    /*
        添加题目到展示列表
    */
    addQuestionToExam() {
      if (this.questionId !== '') {
        if (this.examConfInfo.addQuestionIds&&this.examConfInfo.addQuestionIds.length) {
            for (var i = 0; i < this.examConfInfo.addQuestionIds.length; i++) {
                if (this.examConfInfo.addQuestionIds[i].entity.id == JSON.parse(this.questionId).entity.id) {
                    this.$message.error('抱歉，此选项已存在。请重新选择');
                    return;
                }
            }
        }
        this.examConfInfo.addQuestionIds.push(JSON.parse(this.questionId));
        this.questionId = ''
        this.questionOptions = [];
        } else {
              this.$message.error('抱歉，选项为空无法添加');
        }
    },
    /*
        从展示列表中删除题目数据
    */
    deleteItemInQuestions(index) {
      this.$delete(this.examConfInfo.addQuestionIds, index);
    },
    /*
        提交加入exam中question的值
    */
    submitAddQuestionExam() {
        let questionId_arr = [];
        this.examConfInfo.addQuestionIds.map(item => {
          questionId_arr.push(item.entity.id)
        })
        let para = {
          examination_id: this.examConfInfo.id,
          question_ids: questionId_arr.join(',')
        }
        addQuestionExam(para).then(res => {
            if(res.data.success) {
              this.$notify({
                title: '关联成功',
                message: '关联题目成功',
                type: 'success'
              });
            } else {
              this.$message.error(res.data.msg || '未知错误，请联系管理员');
            };
            this.questionId = '';
            this.loadListData(1);
            this.examListPage = 1;
            this.examQuestionsFormVisible = false;
        })
        .catch(err => {
            this.errorFunction(err);
            this.questionId = '';
            this.examQuestionsFormVisible = false;
        })
    },
    /*
        试卷列表数据接口请求
    */
    loadListData(firstPage) {
      this.examListLoading = true;
      let para = {
        page_index: firstPage || this.examListPage,
        page_size: 20,
        name: this.filter.name,
        id: this.filter.id,
        type: this.filter.type,
        level: this.filter.level,
        tags: this.filter.tags,
        status: this.filter.status?Number(this.filter.status):this.filter.status
      };
      getExamList(para).then(res => {
        if(res.data.success) {
          let examList = res.data.data.items;
          if( examList&&examList.length ) {
              examList.map((item, index) => {
                item.entity.types = item.entity.type == 1? "课节测试" : "课程测试";
                item.entity.status = item.entity.stat == 1? "有效" : "无效";
                switch(item.entity.level){
                  case 1: item.entity.levels = '初级';break;
                  case 2: item.entity.levels = '中级';break;
                  case 3: item.entity.levels = '高级';break;
                }
              })
          }
          this.examList = examList;
          this.totalCount = res.data.data.totalCount;
          this.totalPage = res.data.data.totalPage;
        }else{
          this.$message.error(res.data.msg || '未知错误，请联系管理员');
        }
        this.examListLoading = false;
      })
      .catch(err => {
        this.examListLoading = false;
        this.errorFunction(err);
      })
    },
    //errorFunction
    errorFunction(error) {
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
    },
  },
  mounted() {
    this.loadListData(1)
  }
}
</script>

<style lang="less" scope>
</style>
