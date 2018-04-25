<template lang="html">
  <div class="examination">
    <!-- 头部查询筛选 -->
    <el-col  class='toolbar' style='padding-bottom: 0px;'>
        <el-form :inline = "true" v-model='filter'>
            <el-form-item>
                <!-- <el-input  placeholder='请输入后台用户ID---op登录名' icon="circle-cross" :on-icon-click="handleIconClick_clearId" v-model="filter.op_user_id"></el-input> -->
                <el-select v-model="filter.op_user_id" style="width: 260px;" placeholder="请输入op拼音名称查询" filterable clearable remote :remote-method="loadOpList" >
                  <el-option  v-for="item in opUserList" :key="item.id" :label="item.id " :value="item.id">
                  <span style="float: left">{{ item.id }}</span>
                  <span style="float: left">{{ item.displayName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                </el-option>
					    </el-select>
            </el-form-item>
            <el-form-item>
                <!-- <el-input  placeholder='请输入app用户ID---手机号' icon="circle-cross" :on-icon-click="handleIconClick_clearappid" v-model="filter.app_user_id"></el-input> -->
                 <el-select v-model="filter.app_user_id" style="width: 260px;" placeholder="请输入app用户手机号查询" filterable clearable remote :remote-method="loadAppListData" >
                <el-option v-for="item in appUserList" :key="item.id" :label="item.id " :value="item.id">
                  <span style="float: left">{{ item.mobile }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                </el-option>
					    </el-select> 
            </el-form-item>       
            <el-form-item>
                <el-select  placeholder="状态" v-model="filter.stat" clearable>
                     <el-option v-for="item in isValue" :key="item.value" :label="item.label" :value="item.value" >
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

    <!-- 列表展示 -->
    <el-table :data="examList" border style="width: 100%" v-loading="examListLoading" >
      <el-table-column type="expand">
          <template scope="props" >
            <h3>管理班级详情:</h3>
            <figure class="">
                <figcaption>
                  <p v-for='item in props.row.conf.groupList'>
                    <span><span class='classFont'>班级id:&nbsp;&nbsp;</span><span class="classId">{{ item.groupId }}</span></span>
                    <span><span class='classFont'>班级名称:</span><span class="className">{{ item.groupName }}</span></span>
                    <span><span class='classFont'>开始时间:</span><span class="classTime">{{ item.startTime  | formatTime}}</span></span>
                    <span><span class='classFont'>结束时间:</span><span class="classTime">{{ item.endTime  | formatTime}}</span></span>
                  </p>
                </figcaption>
            </figure>
          </template>
			</el-table-column>
        <el-table-column prop="entity.backendUserDisplayName" label="op登录名"  align="center"></el-table-column>
        <el-table-column prop="entity.userName" label="app昵称"  align="center"></el-table-column>
        <el-table-column prop="entity.userMobile" label="手机号"  align="center"></el-table-column>
        <el-table-column prop="entity.stat" label="状态" align="center"></el-table-column>
        <el-table-column prop="entity.ct" label="创建时间" align="center" :formatter='formatTime'></el-table-column>

        <el-table-column label="操作" align="center">
            <template scope="scope">
                <el-button-group>
                  <el-button type="success" size="small" @click="updateExam(scope.row, scope.$index)">编辑</el-button>
                    <el-button type="info" size="small" @click="examQuestions(scope.$index, scope.row)">详情</el-button>
                </el-button-group>
            </template>
        </el-table-column>
    </el-table>

    <!-- 列表分页 -->
    <el-col class='toolbar'>
      <el-pagination style='float: right' @current-change="handleCurrentChange" :current-page.sync="examListPage" :page-size="20" layout="total, prev, pager, next" :total="totalCount">
      </el-pagination>
    </el-col>

    <!-- 新增编辑弹窗 -->
    <el-dialog title='添加' :visible.sync="addFormVisible" :close-on-click-modal='false' :before-close="handleClose">
        <el-form :model='examInfo1' label-width='100px' ref="examInfo1" :rules="addExamRuler">
					  <el-form-item label='分配班级' prop="group_ids">
							  <el-input v-model='examInfo1.group_ids' auto-complete='off'></el-input>
                <el-button type="primary" style='margin-top:20px;' @click.native="addClassId" >选择班级或输入班级id号，并以逗号分割</el-button>
					  </el-form-item>
            <el-form-item label='后台用户id' prop="op_user_id">
                <el-select v-model="examInfo1.op_user_id" style="width: 260px;" placeholder="请输入后台用户拼音名称查询" filterable clearable remote :remote-method="loadOpList" >
                  <el-option  v-for="item in opUserList" :key="item.id" :label="item.id " :value="item.id">
                  <span style="float: left">{{ item.id }}</span>
                  <span style="float: left">{{ item.displayName }}</span>                  
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                </el-option>
					    </el-select>
					  </el-form-item>
            <el-form-item label='app用户ID' prop="app_user_id">
                <el-select v-model="examInfo1.app_user_id" style="width: 260px;" placeholder="请输入app用户手机号查询" filterable clearable remote :remote-method="loadAppListData" >
                <el-option v-for="item in appUserList" :key="item.id" :label="item.id " :value="item.id">
                  <span style="float: left">{{ item.mobile }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                </el-option>
					    </el-select> 
					  </el-form-item>

            
            <el-form-item label='描述' prop="description">
              <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="examInfo1.description">
              </el-input>
					  </el-form-item>
            <!-- <el-form-item label='状态' prop="status">
								<el-radio class="radio" v-model="examInfo1.status" label='1'>在职</el-radio>
							  <el-radio class="radio" v-model="examInfo1.status" label='0'>离职</el-radio>
            </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close">取消</el-button>
            <el-button type="primary" @click.native="addExamination">提交</el-button>
        </div>
    </el-dialog>

    <!-- 编辑弹窗 -->
    <el-dialog title='编辑' :visible.sync="editFormVisible" :close-on-click-modal='false' :before-close="handleClose1">
      
        <el-form :model='editExamInfo' label-width='100px' ref="editExamInfo" :rules="addExamRuler">
            <!-- <el-form-item label='id' prop="id">
							<el-input v-model='editExamInfo.id' auto-complete='off'></el-input>
					  </el-form-item> -->
            <el-form-item label='后台用户id' prop="op_user_id">
              <el-select v-model="editExamInfo.op_user_id" style="width: 260px;" placeholder="请输入后台用户拼音名称查询" filterable clearable remote :remote-method="loadOpList" >
                <el-option v-for="item in opUserList" :key="item.id" :label="item.id " :value="item.id">
                  <span style="float: left">{{ item.id }}</span>
                  <span style="float: left">{{ item.displayName }}</span>                  
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                </el-option>
					    </el-select>
					  </el-form-item>
            <el-form-item label='app用户id' prop="app_user_id">
              <el-select v-model="editExamInfo.app_user_id" style="width: 260px;" placeholder="请输入app用户手机号查询" filterable clearable remote :remote-method="loadAppListData" >
                <el-option v-for="item in appUserList" :key="item.id" :label="item.id " :value="item.id">
                  <span style="float: left">{{ item.mobile }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                </el-option>
					    </el-select>            
					  </el-form-item>
            <el-form-item label='分配用户id' prop="">
              <el-select v-model="editExamInfo.assign_app_user_id" style="width: 260px;" placeholder="请输入app用户手机号查询" filterable clearable remote :remote-method="loadAppListData1" >
                <el-option v-for="item in appUserList1" :key="item.id" :label="item.id " :value="item.id">
                  <span style="float: left">{{ item.mobile }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                </el-option>
					    </el-select>            
					  </el-form-item>
            <el-form-item label='注意'>
              <span>编辑修改班级id时，如部分班级分配别人请在分配用户id中选择，如添加班级时，分配用户id可忽略</span>                
					  </el-form-item>
            <el-form-item label='关联班级' prop="">
              <el-input v-model='editExamInfo.group_ids' auto-complete='off'></el-input>
              <el-button type="primary" style='margin-top:20px;' @click.native="addClassId1" >选择班级或输入班级id号，并以逗号分割</el-button>              
					  </el-form-item>
            <el-form-item label='描述'>
							<el-input type="textarea" v-model='editExamInfo.description' auto-complete='off'></el-input>
					  </el-form-item>
            <el-form-item label='所管理班级id'>
              <el-input type="textarea" v-model='this.groupClassData'></el-input>                
					  </el-form-item>
            <el-form-item label='状态' prop="">
                <el-radio class="radio" v-model="editExamInfo.status" label='1'>在职</el-radio>
					      <el-radio class="radio" v-model="editExamInfo.status" label='0'>离职</el-radio>
					  </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close1">取消</el-button>
            <el-button type="primary" @click.native="editExamination">提交</el-button>
        </div>
    </el-dialog>

    <el-dialog title='班级列表页添加' :visible.sync="classListVisible" :close-on-click-modal='false' :before-close="handleCloseSum">
      <!-- 头部查询筛选 -->
      <el-col  class='toolbar' style='padding-bottom: 0px;'>
          <el-form :inline = "true" v-model='filter'>
              <el-form-item>
                  <el-input  placeholder='请输入ID' icon="circle-cross" :on-icon-click="handleIconClick_clearId1" v-model="filter.id"></el-input>
              </el-form-item>
              <el-form-item>
                  <el-input  placeholder='请输入名称' icon="circle-cross" :on-icon-click="handleIconClick_clearName1" v-model="filter.group_name"></el-input>
              </el-form-item>
              <el-form-item>
                  <el-button type='primary' @click="queryExam1">查询</el-button>
              </el-form-item>
              <el-form-item>
                  <el-button type='primary' @click="toggleSelection(selsList)">查看当页已经选择的班级</el-button>
              </el-form-item>
              <el-form-item>
                  <p>查看当页已经选择的班级,只可继续添加，之前选择的班级如果想要删除点击确定后到班级输入框修改</p>
              </el-form-item>
          </el-form>
      </el-col>

      <!-- 列表展示 -->
      <el-table ref="multipleTable" :data="examList1" border style="width: 100%" v-loading="examListLoading" @selection-change="selsChange" border >
        
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="entity.id" label="班级id"   width="200"></el-table-column>
        <el-table-column prop="entity.name" label="班级名称"  width="200"></el-table-column>
        <el-table-column prop="entity.description" label="班级描述"  width="200"></el-table-column>
      </el-table>

      <!-- 列表分页 -->
      <el-col class='toolbar'>
        <el-pagination style='float: right' @current-change="handleCurrentChange1" :current-page.sync="examListPage1" :page-size="10" layout="total, prev, pager, next" :total="totalCount1" >
        </el-pagination>
      </el-col>
       <el-button type='primary' @click="batchAdd" :disabled="this.sels.length===0">确定</el-button>
      <el-button type='primary' @click="quxiaoAdd">取消</el-button>
    </el-dialog>

    <el-dialog title='班级列表页编辑' :visible.sync="classListVisible1" :close-on-click-modal='false' :before-close="handleCloseSum1">
      <!-- 头部查询筛选 -->
      <el-col  class='toolbar' style='padding-bottom: 0px;'>
          <el-form :inline = "true" v-model='filter'>
              <el-form-item>
                  <el-input  placeholder='请输入ID' icon="circle-cross" :on-icon-click="handleIconClick_clearId1" v-model="filter.id"></el-input>
              </el-form-item>
              <el-form-item>
                  <el-input  placeholder='请输入名称' icon="circle-cross" :on-icon-click="handleIconClick_clearName1" v-model="filter.group_name"></el-input>
              </el-form-item>
              <el-form-item>
                  <el-button type='primary' @click="queryExam1">查询</el-button>
              </el-form-item>
              <el-form-item>
                  <el-button type='primary' @click="toggleSelection1(selsList1)">查看当页已经选择的班级</el-button>
              </el-form-item>
              <el-form-item>
                  <p>查看当页已经选择的班级,只可继续添加，之前选择的班级如果想要删除点击确定后到班级输入框修改</p>
              </el-form-item>
          </el-form>
      </el-col>

      <!-- 列表展示 -->
      <el-table ref="multipleTable1" :data="examList1" border style="width: 100%" v-loading="examListLoading" @selection-change="selsChange1" border>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="entity.id" label="班级id"   width="200"></el-table-column>
        <el-table-column prop="entity.name" label="班级名称"  width="200"></el-table-column>
        <el-table-column prop="entity.description" label="班级描述"  width="200"></el-table-column>
      </el-table>

      <!-- 列表分页 -->
      <el-col class='toolbar'>
        <el-pagination style='float: right' @current-change="handleCurrentChange1" :current-page.sync="examListPage1" :page-size="10" layout="total, prev, pager, next" :total="totalCount1" >
        </el-pagination>
      </el-col>
       <el-button type='primary' @click="batchAdd1" :disabled="this.sels1.length===0">确定</el-button>
      <el-button type='primary' @click="quxiaoAdd1">取消</el-button>
    </el-dialog>
  </div>
</template>

<script>
import {
  getByOpUserId,
  getAppuserList,
  getGroupsListForPlan,
  getGroupTeacherList,
  groupTeacherAdd,
  groupTeacherUpdate,
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
        id: "",
        group_name: "",
        op_user_id: "",
        stat: "",
        createTime: "",
        classId: "",
        app_user_id: "",
        phone: ""
      },
      //在线班级列表数据初始化
      examList: [],
      examList1: [],
      sels: [],
      arrGroup: [],
      arrGroup1: [],
      arr: [],
      result: [],
      result1: [],
      result2: [],
      result3: [],
      appUserList: [],
      appUserList1: [],
      opUserList: [],
      groupClassData: "",
      sels1: [],
      itemsObj: "",
      itemsIndex: "",
      //在线班级列表详细数据初始化
      examListInfo: [],
      //列表页初始化
      examListPage: 1,
      arrSum: [],
      examListPage1: 1,
      questionOptions: [],
      questionId: "",
      addQuestionIds: [],
      //弹窗显示初始化
      addFormVisible: false,
      editFormVisible: false,
      examQuestionsFormVisible: false,
      examListLoading: false,
      classListVisible: false,
      classListVisible1: false,
      //总数量
      totalCount: 0,
      selsList: [],
      selsList1: [],
      totalCount1: 0,
      //总页数
      totalPage: 0,
      totalPage1: 0,
      classAddIds: "",
      classAddIds1: "",
      //初始化试卷内容数据
      examInfo: {
        op_user_id: "",
        app_user_id: "",
        group_ids: this.classAddIds1,
        description: "",
        status: ""
      },
      examInfo1: {
        op_user_id: "",
        app_user_id: "",
        group_ids: this.classAddIds,
        description: "",
        status: ""
      },
      examConfInfo: {
        addQuestionIds: [],
        id: ""
      },
      editExamInfo: {
        id: "",
        op_user_id: "",
        app_user_id: "",
        group_ids: "",
        description: "",
        status: "1",
        assign_group_teacher_id: ""
      },
      isValue: [
        {
          label: "在职",
          value: "1"
        },
        {
          label: "离职",
          value: "0"
        }
      ],
      //  表单的验证规则
      addExamRuler: {
        id: [{ required: true, message: "请输入id", trigger: "blur" }],
        op_user_id: [
          {
            type: "Number",
            required: true,
            message: "请输入后台用户id",
            trigger: "blur"
          }
        ],
        app_user_id: [
          {
            type: "Number",
            required: true,
            message: "请输入app用户ID",
            trigger: "blur"
          }
        ],
        group_ids: [{ required: true, message: "请选择班级", trigger: "blur" }]
        // status:[{ required: true, message: '请选择状态', trigger: 'change'}]
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
    handleCloseSum() {
      this.selsList = [];
      this.classListVisible=false
    },
    handleCloseSum1() {
      this.selsList1 = [];
      this.classListVisible1=false
      
    },
    close() {
      this.addFormVisible = false;
      this.classAddIds = "";
      this.result = [];
      this.arrGroup = [];
      this.selsList1 = [];
    },
    close1() {
      this.editFormVisible = false;
      this.classAddIds1 = "";
      this.result = "";
      this.selsList1 = [];
    },
    handleClose() {
      this.addFormVisible = false;
      this.classAddIds = "";
      this.result = [];
      this.arrGroup = [];
      this.selsList = [];
      this.selsList1 = [];
      // this.sels.length = 0;
    },
    handleClose1() {
      this.editFormVisible = false;
      this.classAddIds1 = "";
      // this.result1 = "";
      this.selsList1 = [];
    },
    /*
         清空输入框操作
    */
    handleIconClick_clearId() {
      this.filter.op_user_id = "";
    },
    handleIconClick_clearappid() {
      this.filter.app_user_id = "";
    },
    handleIconClick_clearId1() {
      this.filter.id = "";
    },
    handleIconClick_clearName1() {
      this.filter.group_name = "";
    },
    quxiaoAdd() {
      this.classListVisible = false;
      this.selsList = [];
    },
    quxiaoAdd1() {
      this.classListVisible1 = false;
      this.selsList1 = [];
      this.arrSum = [];
      // console.log(this.selsList1)
    },
    /*
        点击查询按钮操作
    */
    queryExam() {
      this.loadListData();
    },
    queryExam1() {
      this.loadClassListData();
    },
    /*
        分页操作
    */
    handleCurrentChange(page) {
      this.loadListData(page);
    },
    handleCurrentChange1(page) {
      this.loadClassListData(page);
    },
    /*
        点击新增按钮操作
    */
    addExam() {
      this.addFormVisible = true;
      this.examInfo1 = {
        op_user_id: "",
        app_user_id: "",
        group_ids: this.classAddIds,
        description: "",
        status: "1"
      };
    },
    //新增接口调用
    addExamination() {
      // console.log(this.examInfo1)
      // this.$refs.examInfo1.validate(valid => {
      if (1) {
        let para = this.examInfo1;
        let self = this;
        groupTeacherAdd(para)
          .then(res => {
            if (res.data.success) {
              this.classAddIds = "";
              this.$notify({
                title: "添加成功",
                message: "新增班主任信息成功",
                type: "success"
              });
              this.classAddIds = null;
              this.classAddIds1 = null;
              this.arrGroup = null;
              this.result = null;
              this.selsList = [];
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
      // });
    },
    addClassId() {
      this.classListVisible = true;
      this.loadClassListData(1);
      this.selsList = [];
      this.selsList1 = [];
    },
    addClassId1() {
      this.classListVisible1 = true;
      this.loadClassListData(1);
      this.selsList = [];
      this.selsList1 = [];
    },
    /*
        点击编辑按钮
    */
    updateExam(item, index) {
      // console.log(this.selsList1);
      this.selsList1 = [];
      if (item.conf.groupList) {
        let groupList = item.conf.groupList;
        let arr = [];
        for (let i = 0; i < groupList.length; i++) {
          arr.push(groupList[i].groupId);
        }
        this.groupClassData = arr.toString();
        this.itemsObj = item;
        this.itemsIndex = index;
        this.editFormVisible = true;
        this.editExamInfo.id = item.entity.id;
        this.editExamInfo.op_user_id = item.entity.opUserId;
        this.editExamInfo.app_user_id = item.entity.appUserId;
        this.editExamInfo.group_ids = this.classAddIds1;
        this.editExamInfo.description = item.entity.description;
        this.editExamInfo.status = item.entity.stat == "在职" ? "1" : "0";
      } else {
        this.groupClassData = "";
        this.itemsObj = item;
        this.itemsIndex = index;
        this.editFormVisible = true;
        this.editExamInfo.id = item.entity.id;
        this.editExamInfo.op_user_id = item.entity.opUserId;
        this.editExamInfo.app_user_id = item.entity.appUserId;
        this.editExamInfo.group_ids = this.classAddIds1;
        this.editExamInfo.description = item.entity.description;
        this.editExamInfo.status = item.entity.stat == "在职" ? "1" : "0";
      }
    },
    /*
        更新接口调用
    */
    editExamination() {
      // this.$refs.editExamInfo.validate(valid => {
      if (1) {
        this.$confirm("是否确认修改?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let para = this.editExamInfo;
            // console.log(this.examConfInfo)
            para.status = Number(para.status);
            let self = this;
            groupTeacherUpdate(para)
              .then(res => {
                if (res.data.success) {
                  this.classAddIds1 = "";
                  this.$notify({
                    title: "修改成功",
                    message: "修改信息成功",
                    type: "success"
                  });
                  this.classAddIds = null;
                  this.classAddIds1 = null;
                  this.arrGroup1 = null;
                  this.result1 = null;
                  this.selsList = [];
                  this.selsList1 = [];
                } else {
                  this.$message.error(res.data.msg || "未知错误，请联系管理员");
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
      } else {
        // alert("请选择状态")
      }
      // });
    },
    /*
        成员详情按钮点击
    */
    examQuestions(index, row) {
      this.$router.push({
        path: "/DetailHeadMaster",
        query: {
          from: "group",
          promoter_group_id: row.entity.id
        }
      });
    },
    /*
        在线班级列表数据接口请求
    */
    loadListData(firstPage) {
      let para = {
        page_index: firstPage || this.examListPage,
        page_size: 20,
        op_user_id: this.filter.op_user_id,
        app_user_id: this.filter.app_user_id,
        status: this.filter.stat
        // ct: this.filter.ct
      };
      this.filter.createTime
        ? (para["createTime"] = util.formatDate.format(
            this.filter.createTime,
            "yyyy-MM-dd"
          ))
        : "";
      this.examListLoading = true;
      getGroupTeacherList(para)
        .then(res => {
          if (res.data.success) {
            let examList = res.data.data.items;
            if (examList && examList.length) {
              examList.map((item, index) => {
                item.entity.stat = item.entity.stat == 1 ? "在职" : "离职";
              });
            }
            this.arr = examList;
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

    // 群组列表
    loadClassListData(firstPage) {
      let para = {
        page_index: firstPage || this.examListPage1,
        page_size: 10,
        group_teacher_id: 0,
        id: this.filter.id,
        group_name: this.filter.group_name
      };
      getGroupsListForPlan(para)
        .then(res => {
          if (res.data.success) {
            let examList = res.data.data.items;
            this.examList1 = examList;
            this.arr = examList;
            this.totalCount1 = res.data.data.totalCount;
            this.totalPage1 = res.data.data.totalPage;
            // this.toggleSelection(this.selsList)
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
    toggleSelection(rows) {
      let sum = this.examList1;
      let litter = rows;
      if (rows) {
        rows.forEach(row => {
          for (var i = 0; i < sum.length; i++) {
            if (sum[i].entity.id == row.entity.id) {
              this.$refs.multipleTable.toggleRowSelection(this.examList1[i]);
            }
          }
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    toggleSelection1(rows) {
      let sum = this.examList1;
      let litter = rows;
      if (rows) {
        rows.forEach(row => {
          for (var i = 0; i < sum.length; i++) {
            if (sum[i].entity.id == row.entity.id) {
              this.$refs.multipleTable1.toggleRowSelection(this.examList1[i]);
            }
          }
        });
      } else {
        this.$refs.multipleTable1.clearSelection();
      }
    },
    // 添加批量选中
    selsChange(sels) {
      let arrList = [];
      for (var i = 0; i < sels.length; i++) {
        arrList.push(sels[i]);
      }
      for (var i = 0; i < arrList.length; i++) {
        if (this.selsList.indexOf(arrList[i]) == -1) {
          this.selsList.push(arrList[i]);
        }
      }
      // console.log(this.selsList)
      if (this.result.length != 0) {
        this.arrGroup = [];
        // this.result = [];
        for (var i = 0; i < sels.length; i++) {
          this.arrGroup.push(sels[i].entity.id);
        }
        this.sels = sels;
        for (var i = 0; i < this.arrGroup.length; i++) {
          if (this.result.indexOf(this.arrGroup[i]) == -1) {
            this.result.push(this.arrGroup[i]);
          }
        }
      } else {
        for (var i = 0; i < sels.length; i++) {
          this.arrGroup.push(sels[i].entity.id);
        }
        this.sels = sels;
        for (var i = 0; i < this.arrGroup.length; i++) {
          if (this.result.indexOf(this.arrGroup[i]) == -1) {
            this.result.push(this.arrGroup[i]);
          }
        }
      }
    },
    // 编辑批量选中
    selsChange1(sels1) {
      let arr = [];
      for (var i = 0; i < sels1.length; i++) {
        this.arrSum.push(sels1[i]);
      }
      for (var i = 0; i < this.arrSum.length; i++) {
        if (this.selsList1.indexOf(this.arrSum[i]) == -1) {
          this.selsList1.push(this.arrSum[i]);
        }
      }
      if (this.result1 && this.arrGroup1 && this.selsList1.length > 1) {
        // console.log("result1存在");
        for (var i = 0; i < sels1.length; i++) {
          this.arrGroup1.push(sels1[i].entity.id);
        }
        this.sels1 = sels1;

        for (var i = 0; i < this.arrGroup1.length; i++) {
          if (this.result1.indexOf(this.arrGroup1[i]) == -1) {
            this.result1.push(this.arrGroup1[i]);
          }
        }
      } else {
        this.result1 = [];
        this.arrGroup1 = [];
        for (var i = 0; i < sels1.length; i++) {
          this.arrGroup1.push(sels1[i].entity.id);
        }
        this.sels1 = sels1;

        for (var i = 0; i < this.arrGroup1.length; i++) {
          if (this.result1.indexOf(this.arrGroup1[i]) == -1) {
            this.result1.push(this.arrGroup1[i]);
          }
        }
      }
    },
    batchAdd() {
      this.result3 = [];
      for (var i = 0; i < this.result.length; i++) {
        if (this.result3.indexOf(this.result[i]) == -1) {
          this.result3.push(this.result[i]);
        }
      }
      let class_ids = this.result3.toString();
      this.classAddIds = class_ids;
      if (class_ids) {
        this.classListVisible = false;
        this.addExam();
      }
      this.selsList = [];
    },
    batchAdd1() {
      // console.log(this.result1);
      this.result2 = [];
      this.editFormVisible1 = false;
      let newData = this.groupClassData.split(",");
      for (var i = 0; i < newData.length; i++) {
        this.result1.push(newData[i]);
      }
      for (var i = 0; i < this.result1.length; i++) {
        if (this.result2.indexOf(this.result1[i]) == -1) {
          this.result2.push(this.result1[i]);
        }
      }
      this.classAddIds1 = this.result2.toString();
      if (this.result2) {
        // this.classAddIds1=null
        this.classListVisible1 = false;
        this.updateExam(this.itemsObj, this.itemsIndex);
        // this.classAddIds1 = "";
        this.selsList1 = [];
      }
      this.selsList1 = [];
    },
    formatTime(row, column) {
      let property = column.property.split(".");
      let time = row[property[0]][property[1]];
      if (time === 0) {
        return "/";
      }
      return util.formatDate.format(new Date(time), "yyyy/MM/dd");
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
    },
    // 加载app用户列表
    loadAppListData(para1) {
      let params = {
        mobile: para1
      };
      getAppuserList(params)
        .then(res => {
          if (res.data.success) {
            // this.filters.total = res.data.data.totalCount;
            // this.formData = res.data.data.items ? res.data.data.items : [];
            this.appUserList = res.data.data.items;
            // console.log(res.data)
            // console.log(this.appUserList)
          } else {
            this.$notify.error(res.data.msg);
          }
        })
        .catch(error => {
          this.catchFunc(error);
        });
    },
    loadAppListData1(para1) {
      let params = {
        mobile: para1
      };
      getAppuserList(params)
        .then(res => {
          if (res.data.success) {
            // this.filters.total = res.data.data.totalCount;
            // this.formData = res.data.data.items ? res.data.data.items : [];
            this.appUserList1 = res.data.data.items;
            // console.log(this.appUserList1)
          } else {
            this.$notify.error(res.data.msg);
          }
        })
        .catch(error => {
          this.catchFunc(error);
        });
    },
    //加载op后台用户列表
    loadOpList(para1) {
      let para = {
        name: para1
      };
      getByOpUserId(para)
        .then(res => {
          if (res.data.success) {
            // this.totalCount = res.data.data.totalCount;
            // this.limit = res.data.data.limit;
            this.opUserList = res.data.data.items;
          } else {
            this.users = [];
            this.$notify({
              title: "错误",
              message: res.data.msg,
              type: "error"
            });
          }
          this.listLoading = false;
        })
        .catch(error => {
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
        });
    },
    changeDateRangeId(value) {
      // console.log(value)
    }
  },
  mounted() {
    this.loadListData(1);
  }
};
</script>

<style lang="less" scope>
.classFont {
  font-weight: 700;
  display: inline-block;
  margin: 0 20px;
}
.classId {
  display: inline-block;
  width: 50px;
}
.className {
  display: inline-block;
  width: 150px;
}
.classTime {
  display: inline-block;
  width: 150px;
}
</style>
