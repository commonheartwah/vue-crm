<template lang="html">
  <div class="examination">
    <!-- 头部查询筛选 -->
    <el-col  class='toolbar' style='padding-bottom: 0px;'>
        <el-form :inline = "true" v-model='filter'>
            <el-form-item>
                <el-input  placeholder='ID' icon="circle-cross" :on-icon-click="handleIconClick_clearId" v-model="filter.id"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input  placeholder='请输入群组ID' icon="circle-cross" :on-icon-click="handleIconClick_clearGrooupId" v-model="filter.im_group_id"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input  placeholder='群组名称' icon="circle-cross" v-model="filter.name" :on-icon-click="handleIconClick_clearName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' @click="queryExam">查询</el-button>
            </el-form-item>
            <!-- <el-form-item>
                <el-button type='primary' @click="addExam">新增</el-button>
            </el-form-item> -->
        </el-form>
    </el-col>

    <!-- 列表展示 -->
    <el-table :data="examList" border style="width: 100%" v-loading="examListLoading" >
      <el-table-column type="expand">
          <template scope="props" >
            <figure class="formExpand">
                <img :src="props.row.entity.faceUrl" class="CourseImage">
                <figcaption>
                  <p><span class='box1'>班级名称:</span>{{ props.row.entity.name }}</p>             
                  <p><span class='box1'>班级状态:</span>{{ props.row.entity.status}}</p>
                  <!-- <p><span>班长:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>  {{ props.row.entity.ban}}</p> -->
                  <p><span class='box1'>班主任id:</span>{{ props.row.entity.ownerAccount }}</p>
                  <p><span class='box1'>班主任名称:</span>{{ props.row.entity.teacherName }}</p>
                  <p><span class='box1'>班主任电话:</span>{{ props.row.entity.teacherMobile }}</p>
                  
                  <ul v-if='props.row.entity.monitorInfo!=null'  v-for="item in props.row.entity.monitorInfo" >
                    <li >
                      <p><span class='box3'>班长名称:</span>{{item.monitorName}}</p>
                      <p><span class='box3'>班长电话:</span>{{item.monitorMobile}}</p>
                    </li>
                  </ul>
                  <ul v-if='props.row.entity.monitorInfo==null'>
                    <li >
                      <p><span class='box3'>班长名称:</span></p>
                      <p><span class='box3'>班长电话:</span></p>
                    </li>
                  </ul>

                  <p><span class='box1'>开课时间:</span>{{ props.row.entity.planStartTime | formatTime}}</p>
                  <p><span class='box1'>结束时间:</span>{{ props.row.entity.planEndTime | formatTime}}</p>
                  <p><span class='box1'>招募计划id:</span>{{ props.row.entity.planId}}</p>
                  <p><span class='box1'>招募计划名称:</span>{{ props.row.entity.planName}}</p>
                  <p><span class='box1'>班级人数:</span>{{ props.row.entity.memberNum}}人</p>
                  <p><span class='box1'>班级公告:</span>{{ props.row.entity.notification }}</p>
                  <p><span class='box1'>班级简介:</span>{{ props.row.entity.introduction }}</p>                  
                </figcaption>
            </figure>
          </template>
			</el-table-column>
        </el-table-column>
        <el-table-column prop="entity.id" label="ID" sortable width="100" align="center"></el-table-column>
        <el-table-column prop="entity.groupId" label="群组ID" sortable  align="center"></el-table-column>
        <el-table-column prop="entity.name" label="群组名称" align="center"></el-table-column>
        <el-table-column prop="entity.introduction" label="群组描述" align="center"></el-table-column>
        <el-table-column prop="entity.status" label="状态" align="center"></el-table-column>

        <el-table-column label="操作">
            <template scope="scope">
                <el-button-group>
                  <el-button type="success" size="small" @click="updateExam1(scope.row, scope.$index)">编辑</el-button>
                    <el-button type="info" size="small" @click="examQuestions(scope.$index, scope.row)">成员详情</el-button>
                    <!-- <el-button type="warning" size="small" @click="examQuestions(scope.row, scope.$index)">发送消息</el-button> -->
                </el-button-group>
            </template>
        </el-table-column>
    </el-table>

    <!-- 列表分页 -->
    <el-col class='toolbar'>
      <el-pagination style='float: right' @current-change="handleCurrentChange" :current-page.sync="examListPage" :page-size="20" layout="total, prev, pager, next" :total="totalCount">
      </el-pagination>
    </el-col>

    <!-- 新增弹窗 -->
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

    <!-- 编辑弹窗 -->
    <el-dialog title='编辑' :visible.sync="editFormVisible" :close-on-click-modal='false'>
        <el-form :model='editExamInfo' label-width='100px' ref="editExamInfo" :rules="addExamRuler">
					  <el-form-item label='班级头像' prop="im_face_url" v-model='editExamInfo.im_face_url'>
                  <img :src='this.imgUrl' class="CourseImageEdit" v-if='this.imgUrl' >
                  <img :src='this.IMG' class="CourseImageEdit" v-else>       
					  </el-form-item>
            <el-form-item>
							       <el-upload  
                      class="upload-demo "
                      ref='upload'
                      drag
                      name="bin"
                      action="/op/material/upload_image"
                      :multiple='true'
                      :on-success="handleSuccess"         
                  >
                      <i class="el-icon-upload"></i>
                      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  </el-upload>
					  </el-form-item>
            <el-form-item label='班级群名称' prop="im_group_name">
							  <el-input v-model='editExamInfo.im_group_name' ></el-input>
					  </el-form-item>
            <!-- <el-form-item label='班级群ID' prop="im_group_id">
							  <el-input v-model='editExamInfo.im_group_id' ></el-input>
					  </el-form-item> -->
            <el-form-item label='班级群简介'>
              <el-input type="textarea" v-model='editExamInfo.im_introduction' auto-complete='off'></el-input>
					  </el-form-item>
            <el-form-item label='班级群公告' prop="im_notification">
							  <el-input type="textarea" v-model='editExamInfo.im_notification' auto-complete='off' placeholder='请输入少于100个汉字的班级公告' maxlength='100'></el-input>
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
  imGroupUpdate,
  getClassGroupsInfo,
  getClassGroupList,
  getExamList,
  addExam,
  updateExam,
  getQuestionList,
  addQuestionExam
} from "../../api/api";
import draggable from "vuedraggable";
import util from "../../common/js/util";

export default {
  components: {
    draggable
  },
  data() {
    return {
      //查询筛选数据初始化
      filter: {
        name: "",
        id: "",
        type: "",
        description: "",
        status: "",
        im_group_id: ""
      },
      imgUrl: "",
      data: [],
      ITEM: "",
      INDEX: "",
      IMG: "",
      //在线班级列表数据初始化
      examList: [],
      //在线班级列表详细数据初始化
      examListInfo: [],
      //列表页初始化
      examListPage: 1,
      questionOptions: [],
      questionId: "",
      addQuestionIds: [],
      //弹窗显示初始化
      addFormVisible: false,
      editFormVisible: false,
      examQuestionsFormVisible: false,
      examListLoading: false,
      //总数量
      totalCount: 0,
      //总页数
      totalPage: 0,
      //初始化试卷内容数据
      examInfo: {
        name: "",
        en_name: "",
        type: "",
        description: "",
        remark: "",
        status: "1"
      },
      examConfInfo: {
        addQuestionIds: [],
        id: ""
      },
      editExamInfo: {
        id: "",
        im_group_id: "",
        im_group_name: "",
        im_face_url: "",
        im_introduction: "",
        im_notification: ""
      },
      //数据类型初始化
      examType: [
        {
          label: "课节测试",
          value: 1
        },
        {
          label: "课程测试",
          value: 2
        }
      ],
      examRange: [
        {
          label: "初级",
          value: 1
        },
        {
          label: "中级",
          value: 2
        },
        {
          label: "高级",
          value: 3
        }
      ],
      isValue: [
        {
          label: "有效",
          value: "1"
        },
        {
          label: "无效",
          value: "0"
        }
      ],

      //  表单的验证规则
      addExamRuler: {
        // id: [{ required: true, message: "请输入id", trigger: "blur" }],
        // im_group_id:[{ required: true, message: '请输入班级群id', trigger: 'blur' }],
        im_group_name: [
          { required: true, message: "请输入群名称", trigger: "blur" }
        ],
        im_face_url: [
          { required: true, message: "请上传班级头像", trigger: "blur" }
        ],
        im_notification: [
          { required: true, message: "请输入班级群公告字数少于100个汉字", trigger: "blur" }
        ]
      }
    };
  },
  filters: {
    // 关于时间转换的俩东西
    formatTime(date) {
      if (date === undefined) {
        return;
      }
      if (date === 0) {
        return "/";
      }
      return util.formatDate.format(new Date(date), "yyyy/MM/dd   hh:mm:ss");
    }
  },
  methods: {
    // upload(file, fileList) {
    //   console.log(this.$refs);
    //   this.$refs.editExamInfo.validateField(valid => {
    //     if (valid) {
    //       // console.log('vue 图片上传钩子函数')
    //     }
    //   });
    // },
    handleSuccess(response, file) {
      if (response.success) {
        // this.$refs.xxx.clearValidate();
        let obj = {
          url: response.data,
          name: file.name
        };
        this.data.push(obj);
        this.imgUrl = this.data[this.data.length - 1].url;
        this.updateExam1(this.ITEM, this.INDEX);
      } else {
        this.$notify({
          title: "错误",
          message: response.msg,
          type: "error"
        });
      }
    },
    handleIconClick_clearGrooupId() {
      this.filter.im_group_id = "";
    },
    /*
         清空输入框操作
    */
    handleIconClick_clearId() {
      this.filter.id = "";
    },
    handleIconClick_clearName() {
      this.filter.name = "";
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
        name: "",
        en_name: "",
        type: "",
        description: "",
        status: "1"
      };
    },
    //新增试卷接口调用
    addExamination() {
      this.$refs.examInfo.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.examInfo);
          let self = this;
          addExam(para)
            .then(res => {
              if (res.data.success) {
                this.$notify({
                  title: "添加成功",
                  message: "新增试卷信息成功",
                  type: "success"
                });
              } else {
                this.$message.error(res.data.msg || "未知错误，请联系管理员");
              }
              this.loadListData(1);
              this.examListPage = 1;
              this.addFormVisible = false;
            })
            .catch(err => {
              self.errorFunction(err);
              this.addFormVisible = false;
            });
        }
      });
    },
    /*
        点击编辑按钮
    */
    updateExam1(item, index) {
      this.ITEM = item;
      this.INDEX = index;
      this.editFormVisible = true;
      this.editExamInfo.id = item.entity.id;
      this.editExamInfo.im_group_name = item.entity.name;
      this.editExamInfo.im_group_id = item.entity.groupId;
      this.editExamInfo.im_introduction = item.entity.introduction;
      this.editExamInfo.im_notification = item.entity.notification;
      this.IMG = item.entity.faceUrl;
      if (this.imgUrl) {
        this.editExamInfo.im_face_url = this.imgUrl;
      } else {
        this.editExamInfo.im_face_url = this.IMG;
      }
    },
    /*
        更新试卷接口调用
    */
    editExamination() {
      if (this.imgUrl) {
        this.editExamInfo.im_face_url = this.imgUrl;
      } else {
        this.editExamInfo.im_face_url = this.IMG;
      }
      this.$refs.editExamInfo.validate(valid => {
        if (valid) {
          this.$confirm("是否确认修改?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              let para = Object.assign({}, this.editExamInfo);
              // para.status = Number(para.status);
              let self = this;
              imGroupUpdate(para)
                .then(res => {
                  if (res.data.success) {
                    this.$notify({
                      title: "修改成功",
                      message: "修改信息成功",
                      type: "success"
                    });
                    this.imgUrl = "";
                  } else {
                    this.$message.error(
                      res.data.msg || "未知错误，请联系管理员"
                    );
                  }
                  this.loadListData(1);
                  this.examListPage = 1;
                  this.editFormVisible = false;
                })
                .catch(error => {
                  self.errorFunction(error);
                  this.editFormVisible = false;
                });
            })
            .catch(() => {
              this.editFormVisible = false;
            });
        }
      });
    },
    /*
        成员详情按钮点击
    */
    examQuestions(index, row) {
      this.$router.push({
        path: "/GroupList",
        query: {
          from: "group",
          promoter_group_id: row.entity.groupId
        }
      });
    },
    /*
        请求question列表数据
    */
    searchQuestionFunc(query) {
      let temp = Number(query);
      let parameter = {};
      if (temp) {
        parameter = {
          id: temp
        };
      } else {
        parameter = {
          name: query
        };
      }
      getQuestionList(parameter).then(res => {
        if (res.data.success) {
          if (res.data.data.items && res.data.data.items.length) {
            this.questionOptions = res.data.data.items.map(item => {
              let tempObj = {
                entity: {
                  id: item.entity.id,
                  title: item.entity.title
                }
              };
              return tempObj;
            });
          }
        } else {
          this.$message.error(res.data.msg || "未知错误，请联系管理员");
        }
      });
    },
    /*
        添加题目到展示列表
    */
    addQuestionToExam() {
      if (this.questionId !== "") {
        if (
          this.examConfInfo.addQuestionIds &&
          this.examConfInfo.addQuestionIds.length
        ) {
          for (var i = 0; i < this.examConfInfo.addQuestionIds.length; i++) {
            if (
              this.examConfInfo.addQuestionIds[i].entity.id ==
              JSON.parse(this.questionId).entity.id
            ) {
              this.$message.error("抱歉，此选项已存在。请重新选择");
              return;
            }
          }
        }
        this.examConfInfo.addQuestionIds.push(JSON.parse(this.questionId));
        this.questionId = "";
        this.questionOptions = [];
      } else {
        this.$message.error("抱歉，选项为空无法添加");
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
        questionId_arr.push(item.entity.id);
      });
      let para = {
        examination_id: this.examConfInfo.id,
        question_ids: questionId_arr.join(",")
      };
      addQuestionExam(para)
        .then(res => {
          if (res.data.success) {
            this.$notify({
              title: "关联成功",
              message: "关联题目成功",
              type: "success"
            });
          } else {
            this.$message.error(res.data.msg || "未知错误，请联系管理员");
          }
          this.questionId = "";
          this.loadListData(1);
          this.examListPage = 1;
          this.examQuestionsFormVisible = false;
        })
        .catch(err => {
          this.errorFunction(err);
          this.questionId = "";
          this.examQuestionsFormVisible = false;
        });
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
        im_group_id: this.filter.im_group_id
      };
      getClassGroupList(para)
        .then(res => {
          if (res.data.success) {
            let examList = res.data.data.items;
            if (examList && examList.length) {
              examList.map((item, index) => {
                item.entity.status = item.entity.stat == 1 ? "有效" : "无效";
              });
            }
            this.examList = examList;
            this.totalCount = res.data.data.totalCount;
            this.totalPage = res.data.data.totalPage;
          } else {
            this.$message.error(res.data.msg || "未知错误，请联系管理员");
          }
          this.examListLoading = false;
        })
        .catch(err => {
          this.examListLoading = false;
          this.errorFunction(err);
        });
    },
    //errorFunction
    errorFunction(error) {
      if (error.response) {
        this.$notify({
          title: error.response.status,
          message: "网络请求错误",
          type: "error"
        });
      } else if (error.request) {
        this.$notify({
          title: error.request,
          message: "网络请求错误",
          type: "error"
        });
      } else {
        this.$notify({
          title: "错误",
          message: error.message,
          type: "error"
        });
      }
    }
  },
  mounted() {
    this.loadListData(1);
  }
};
</script>

<style lang="less" scope>
.formExpand {
  width: 800px;
  display: flex;
  justify-content: space-around;
}
.formExpand figcaption {
  float: right;
  width: 340px;
  line-height: 25px;
}
.formExpand .CourseImage {
  width: 200px;
  height: 200px;
  margin-top: 50px;
  border: 1px solid #d1dbe5;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 0 3px #666;
  margin-right: 50px;
}
.CourseImageEdit {
  width: 100px;
  height: 100px;
  // margin-top: 50px;
  border: 1px solid #d1dbe5;
  border-radius: 50px;
  padding: 10px;
  // box-shadow: 0 0 3px #666;
  margin-right: 50px;
}
.box1 {
  display: inline-block;
  width: 100px;
}
.box3 {
  display: inline-block;
  width: 100px;
}
</style>
