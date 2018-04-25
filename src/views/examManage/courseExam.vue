<template lang="html">
  <section>
    <!-- 头部搜索 -->
    <el-col class='toolbar' style='padding-bottom: 0px;'>
        <el-form :inline = "true" v-model='filter'>
            <el-form-item>
                <el-input  placeholder='请输入ID' icon="circle-cross" :on-icon-click="handleIconClick_clearId" v-model="filter.id"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input  placeholder='请输入课程ID' icon="circle-cross" v-model="filter.course_id" :on-icon-click="handleIconClick_clearCourseID"></el-input>
            </el-form-item>
            <el-form-item>
                <el-select  placeholder="状态" v-model="filter.status" clearable>
                   <el-option v-for="item in isValue" :key="item.value" :label="item.label" :value="item.value">
                   </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' @click="queryExamSuite">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' @click="handleAddCourseExamSuite">新增</el-button>
            </el-form-item>
        </el-form>
    </el-col>
    <!--  数据展示表格 -->
    <el-table :data="courseExamSuiteList" border style="width: 100%" v-loading="listLoading">
        <el-table-column prop="entity.id" label="ID" sortable width="100" align="center"></el-table-column>
        <el-table-column prop="entity.courseName" label="关联课程名称" align="center"></el-table-column>
        <el-table-column prop="entity.courseId" label="关联课程ID" align="center"></el-table-column>
        <el-table-column prop="entity.status" label="状态" align="center"></el-table-column>
        <el-table-column label="操作">
            <template scope="scope">
                <el-button-group>
                    <el-button type="success" size="small" @click="handleEditCourseExamSuite(scope.row, scope.$index)">编辑</el-button>
                    <el-button type="info" size="small" @click="handleLessonExamSuite(scope.row, scope.$index)">关联试卷集</el-button>
                </el-button-group>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-col class='toolbar'>
      <el-pagination style='float: right' @current-change="handleCurrentChange" :current-page.sync="courseExamPage" :page-size="20" layout="total, prev, pager, next" :total="totalCount">
      </el-pagination>
    </el-col>
    <!-- 新增弹窗 -->
    <el-dialog title='新增试卷套餐' :visible.sync="addFormVisible" :close-on-click-modal='false'>
        <el-form :model='courseExamSuite' label-width='100px' ref="courseExamSuite" :rules='courseExamSuiteRules'>
            <el-form-item label='关联课程' prop='course_id'>
              <el-select v-model="courseExamSuite.course_id" placeholder="请输入课程关键词或ID" style="width:300px;" filterable clearable remote :remote-method="searchCourseFunc">
                <el-option
                  v-for="item in courseOptions"
                  :key="item.id"
                  :label="'（' + item.id + '）' + item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='是否有效' prop="status">
                <el-radio class="radio" v-model="courseExamSuite.status" label='1'>有效</el-radio>
                <el-radio class="radio" v-model="courseExamSuite.status" label='0'>无效</el-radio>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="addFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="addCourseExamSuite">提交</el-button>
        </div>
    </el-dialog>
    <!-- 编辑页面 -->
    <el-dialog title='新增试卷套餐' :visible.sync="editFormVisible" :close-on-click-modal='false'>
        <el-form :model='editCourseExamSuite' label-width='100px' ref="examInfo">
            <el-form-item label='是否有效' prop="status">
                <el-radio class="radio" v-model="editCourseExamSuite.status" label='1'>有效</el-radio>
                <el-radio class="radio" v-model="editCourseExamSuite.status" label='0'>无效</el-radio>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="addFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="updateCourseExamSuite">提交</el-button>
        </div>
    </el-dialog>
    <!-- 关联课节 -->
    <el-dialog title='课节关联' :visible.sync="lessonExamFormVisible" :close-on-click-modal='false'>
        <el-collapse v-model='activeName' accordion  v-loading="lessonListLoading">
          <el-collapse-item :title="unit.unitName" :key='unit.unitId' :value="unit.unitId" v-for='(unit, index) in unitList' :name='index' key='index'>
                <el-table :data="unit.unitLessonList" border style="width: 100%"  key='unit.id'>
                   <el-table-column prop="lessonId" label="课节ID"  align="center" width='90'>
                   </el-table-column>
                   <el-table-column prop="lessonName" label="课节名称" align="center">
                   </el-table-column>
                   <el-table-column label="关联试卷" align="center" width='210'>
                     <template scope="scope">
                       <el-select v-model="scope.row.examSuiteId" placeholder="请输入关键词或ID"  filterable clearable remote :remote-method="searchExamFunc">
                         <el-option
                           v-for="item in examOptions"
                           :key="item.id"
                           :label="'（' + item.id + '）' + item.name"
                           :value="item.id">
                         </el-option>
                       </el-select>
                     </template>
                   </el-table-column>
                   <el-table-column label="操作">
                       <template scope="scope">
                         <el-button-group>
                             <el-button type="success" size="small" @click="handleExamSuiteLesson(scope.row)">确定关联</el-button>
                             <el-button type="success" size="small" @click="delExamSuiteLesson(scope.row, scope.$index)">取消关联</el-button>
                         </el-button-group>
                       </template>
                   </el-table-column>
                </el-table>
          </el-collapse-item>
        </el-collapse>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click.native="lessonExamFormVisible = false">关闭</el-button>
        </div>
    </el-dialog>
  </section>
</template>

<script>
import {
  getCourseList,
  getExamSuiteList,
  getCourseSuiteList,
  addCourseSuite,
  updateCourseSuite,
  getlessonListByCourseId,
  addLessonExamSuite,
  delLessonExamSuite
} from '../../api/api'
import Vue from 'vue'
export default {
  data() {
    return {
      //  查询数据初始化
      filter: {
        id: '',
        course_id: '',
        status: ''
      },
      // 状态下拉框数据初始化
      isValue:[
				{
					label:'有效',
					value:'1'
				},
				{
					label:'无效',
					value:'0'
				},
		  ],
      //表单验证
      courseExamSuiteRules:{
        exam_suite_id:[
          { type:'number', required: true, message: '请输入试卷类型', trigger: 'change' }
        ],
        course_id:[
          { type:'number', required: true, message: '请输入试卷标签', trigger: 'blur' }
        ],
      },
      //分页数据
      totalCount:0,
      courseExamPage:1,
      //弹窗显示状态
      addFormVisible: false,
      editFormVisible: false,
      lessonExamFormVisible: false,
      activeName: '',
      lessonListLoading: false,
      listLoading: false,
      //课程关联试卷套餐数据初始化
      courseExamSuite:{
        course_id: '',
        status: '1'
      },
      editCourseExamSuite:{
        id:'',
        status: '1'
      },
      courseOptions:[],
      examSuiteOptions:[],
      courseExamSuiteList:[],
      //课程列表数据初始化
      unitList: [],
      examOptions:[],
    }
  },
  methods: {
    /*
        清空输入框操作
    */
    handleIconClick_clearId() {
      this.filter.id = '';
    },
    handleIconClick_clearCourseID() {
      this.filter.course_id = '';
    },
    /*
        查询操作
    */
    queryExamSuite() {
      this.loadCourseExamList()
    },
    /*
        分页操作
    */
    handleCurrentChange(page) {
      this.loadCourseExamList(page);
    },
    /*
        关联课程与试卷套餐列表数据加载
    */
    loadCourseExamList(page) {
      this.listLoading = true;
      let para = {
        page_index: page,
        page_size: 20,
        id: this.filter.id,
        course_id : this.filter.course_id,
        status:this.filter.status? Number(this.filter.status):'',
      }
      getCourseSuiteList(para).then(res => {
        if(res.data.success) {
          this.courseExamSuiteList = res.data.data.items;
          this.totalCount = res.data.data.totalCount;
          this.courseExamPage = res.data.data.page;
          if(this.courseExamSuiteList && this.courseExamSuiteList.length) {
            this.courseExamSuiteList.map(item => {
              item.entity.status = item.entity.stat === 1? '有效':'无效'
            })
          }
        }else{
          this.$message.error(res.data.msg || '未知错误，请联系管理员');
        }
        this.listLoading = false;
      })
      .catch(err => {
        this.errorFunction(err)
        this.listLoading = false;
      })
    },
    /*
        添加操作
    */
    handleAddCourseExamSuite() {
      this.addFormVisible = true;
      this.courseExamSuite = {
        course_id: '',
        status: '1'
      }
    },
    /*
        提交新增操作
    */
    addCourseExamSuite(){
      this.$refs.courseExamSuite.validate(valid => {
        if(valid) {
          let para = Object.assign({}, this.courseExamSuite);
          para['status'] = Number(para['status']);
          addCourseSuite(para).then(res => {
            if(res.data.success) {
              this.$notify({
                title: '新增成功',
                message: '新增信息成功',
                type: 'success'
              });
            }else{
              this.$message.error(res.data.msg || '未知错误，请联系管理员');
            }
              this.loadCourseExamList(1);
              this.addFormVisible = false;
          })
          .catch(err => {
            this.addFormVisible = false;
            this.errorFunction(err)
          })
        }
      })
    },
    /*
        编辑操作
    */
    handleEditCourseExamSuite(item) {
      this.editFormVisible = true;
      this.editCourseExamSuite.id = item.entity.id;
      this.editCourseExamSuite.course_id = item.entity.courseId;
      this.editCourseExamSuite.status = item.entity.stat+'';
    },
    /*
        编辑提交操作
    */
    updateCourseExamSuite() {
        let para = Object.assign({}, this.editCourseExamSuite);
        para['status'] = Number(para['status']);
        updateCourseSuite(para).then(res => {
          if(res.data.success) {
            this.$notify({
              title: '修改成功',
              message: '修改信息成功',
              type: 'success'
            });
          }else{
            this.$message.error(res.data.msg || '未知错误，请联系管理员');
          }
            this.loadCourseExamList(1);
            this.editFormVisible = false;
        })
        .catch(err => {
          this.errorFunction(err)
          this.editFormVisible = false;
        })
    },
    /*
        查询lesson列表
    */
    handleLessonExamSuite(item) {
      this.lessonExamFormVisible = true
      this.lessonListLoading = true;
      this.unitList = [];
      let para = {
        id: item.entity.id
      }
      getlessonListByCourseId(para).then(res => {
          if(res.data.success) {
            this.unitList = res.data.data;
            if(this.unitList && this.unitList.length) {
              this.unitList.map(items => {
                if(items.unitLessonList && items.unitLessonList.length) {
                  items.unitLessonList.map(prop => {
                    if(prop.examSuiteList&&prop.examSuiteList.length) {
                        prop.examSuiteList.map(examSuiteItem => {
                          Vue.set(prop, 'examSuiteId', examSuiteItem.entity.id)
                        })
                    } else{
                      Vue.set(prop, 'examSuiteId', '')
                    }
                    Vue.set(prop, 'id', item.entity.id)
                  })
                }
              })
            }
          } else {
            this.$message.error(res.data.msg || '未知错误，请联系管理员');
          }
          this.lessonListLoading = false;
      })
      .catch(err => {
        this.errorFunction(err)
        this.lessonListLoading = false;
      })
    },
    /*
        查询试题套餐操作
    */
    searchExamSuiteFunc(query) {
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
      getExamSuiteList(parameter).then(res => {
        if (res.data.success) {
          if (res.data.data.items && res.data.data.items.length) {
            this.examSuiteOptions =res.data.data.items.map((item) => {
              let tempObj = {
                id: item.entity.id,
                name: item.entity.name,
              }
              return tempObj
            });
          }
        }
      })
    },
    /*
        查询课程列表操作
    */
    searchCourseFunc(query) {
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
      getCourseList(parameter).then(res => {
        if (res.data.success) {
          if (res.data.data.items && res.data.data.items.length) {
            this.courseOptions =res.data.data.items.map((item) => {
              let tempObj = {
                id: item.entity.id,
                name: item.entity.name,
              }
              return tempObj
            });
          }
        }
      })
    },
    /*
        课节关联examSuite列表
    */
    searchExamFunc(query) {
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
      getExamSuiteList(parameter).then(res => {
        if (res.data.success) {
          if (res.data.data.items && res.data.data.items.length) {
            this.examOptions = res.data.data.items.map((item) => {
              let tempObj = {
                id: item.entity.id,
                name: item.entity.name,
              }
              return tempObj
            });
          }
        }
      })
    },
    /*
        关联lesson和examSuite操作
    */
    handleExamSuiteLesson(item) {
        let para = {
          id: item.id,
          exam_suite_ids: item.examSuiteId,
          lesson_id: item.lessonId
        }
        if (para.exam_suite_ids) {
          addLessonExamSuite(para).then(res => {
            if (res.data.success) {
              this.$notify({
                title: '关联成功',
                message: '关联成功',
                type: 'success'
              });
            } else{
              this.$message.error(res.data.msg || '未知错误，请联系管理员');
            }
          })
          .catch(err => {
            this.errorFunction(err)
          })
        } else {
          this.$notify({
            title: '关联失败',
            message: '试卷集不能为空',
            type: 'error'
          });
        }
    },
    /*
        取消关联
    */
    delExamSuiteLesson(item) {
      let para = {
        id: item.id,
        lesson_id: item.lessonId
      }
        delLessonExamSuite(para).then(res => {
          if (res.data.success) {
            this.$notify({
              title: '取消关联',
              message: '取消关联成功',
              type: 'success'
            });
            item.examSuiteId =''
          } else{
            this.$message.error(res.data.msg || '未知错误，请联系管理员');
          }
        })
        .catch(err => {
          this.errorFunction(err)
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
    }
  },
  mounted() {
    this.loadCourseExamList()
  }
}
</script>

<style lang="css">
</style>
