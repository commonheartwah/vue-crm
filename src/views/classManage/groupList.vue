<template lang="html">
    <section>
        <!-- 按钮  过滤  工具条-->
        <!-- <el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
            <el-form :inline=true :model='filters'>
                <el-form-item>
                    <el-input v-model='filters.id' placeholder='ID' icon="circle-cross" :on-icon-click="handleIconClick_clearId" @keydown.native.prevent.enter='loadList' disabled></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model='filters.name' placeholder='用户名称' icon="circle-cross" :on-icon-click="handleIconClick_clearName" @keydown.native.prevent.enter='loadList' disabled></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type='primary' @click='loadList'>查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type='primary' v-if="isMemListForPlan" @click='handleAdd'>新增</el-button>
                </el-form-item>
            </el-form>
        </el-col> -->

        <!-- 列表 -->
        <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" border>

            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <el-table-column prop="entity.id" label="ID" sortable width="100" align="center"></el-table-column>
            <el-table-column prop="entity.imGroupId" label="群组ID" align="center"></el-table-column>
            <el-table-column prop="entity.nameCard" label="昵称" align="center"></el-table-column>
            <el-table-column prop="entity.appUserId" label="app用户id" align="center"></el-table-column>
            <el-table-column prop="entity.stat" label="状态" align="center"></el-table-column>
            <el-table-column prop="entity.ct" label="创建时间" align="center" :formatter='formatTime'></el-table-column>
            <el-table-column prop="entity.ut" label="更新时间" align="center" :formatter='formatTime'></el-table-column>

			<!-- <el-table-column label="操作" width="230" align="center">
				<template scope="scope">
                    <el-button-group>
                        <el-button type="info" size="small" v-if="isMemListForPlan" @click="addToGroup(scope.$index, scope.row)">添加到群组</el-button>
                        <el-button type='danger' size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                    </el-button-group>
				</template>
			</el-table-column> -->
		</el-table>

        <!-- 分页条 批量删除 -->
        <el-col :span='24' class='toolbar'>
            <!-- <el-button type="info" v-if="isMemListForPlan" @click="batchAdd" :disabled="this.sels.length===0">批量添加到群组</el-button> -->
            <!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
            <!-- <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='limit' :total='totalCount' style='float: right'>

            </el-pagination> -->
            <el-pagination style='float: right' @current-change="handleCurrentChange"  :page-size="20" layout="total, prev, pager, next" :total="totalCount">
      </el-pagination>
        </el-col>

    </section>
</template>

<script>
// axios
import {
  getClassGroupsInfo,
  addMemberForPlan,
  removeMemberForPlan,
  batchRemoveMembersForPlan,

  // getClassGroupsInfo,
  addMemberForGroup,
  removeMemberForGroup,
  batchRemoveMembersForGroup
} from "../../api/api";
// 引入工具包
import util from "../../common/js/util";

export default {
  data() {
    return {
      filters: {
        page_index: 1,
        page_size: 20,
        total: 0,
        type: "0",
        state: "",
        name: "",
        id: "",
        ct: "",
        ut: ""
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
      users: [],
      listLoading: false,
      // 基础参数(para)
      basePara: {},
      // check是对计划下成员操作还是对群组下的成员操作
      checkFrom: {}
    };
  },
  methods: {
    //ToolBar
    // 点击icon 清除内容
    handleIconClick_clearId() {
      this.filters.id = "";
    },
    handleIconClick_clearName() {
      this.filters.name = "";
    },
    handleAdd() {
      // 来接收addMemberForPlan or addMemberForGroup
      let addMember;

      this.$prompt("请输入用户id", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          let para = {
            user_ids: value
          };
          para = Object.assign(para, this.basePara);

          this.checkFromPlanOrGroup.addMember(para).then(res => {
            if (res.data.success) {
              this.$notify({
                title: "成功",
                type: "success",
                message: "添加成功"
              });
              this.loadList();
            } else {
              this.$notify({
                title: "错误",
                type: "error",
                message: res.data.msg
              });
            }
          });
        })
        .catch(() => {
          this.$notify({
            title: "提示",
            type: "info",
            message: "取消输入"
          });
        });
    },
    // 分页
    handleCurrentChange(val) {
      this.page = val;
      this.loadList();
    },
    //List
    // 列表显示
    // 操作功能
    // 删除单个用户
    handleDel(index, row) {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let para = {
            user_id: row.entity.id
          };
          
          para = Object.assign(para, this.basePara);

          this.checkFromPlanOrGroup.removeMember(para).then(res => {
            this.listLoading = false;
            if (res.data.success) {
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success"
              });
              this.loadList();
            } else {
              this.$notify({
                title: "错误",
                message: res.data.msg,
                type: "error"
              });
            }
          });
        })
        .catch(() => {});
    },
    // 批量选中
    selsChange(sels) {
      this.sels = sels;
    },
    //批量删除
    batchRemove() {
      let user_ids = this.sels.map(item => item.id).toString();
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let para = {
            user_ids: user_ids
          };
          para = Object.assign(para, this.basePara);
          this.checkFromPlanOrGroup.batchRemoveMembers(para).then(res => {
            this.listLoading = false;
            if (res.data.success) {
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success"
              });
              this.loadList();
            } else {
              this.$notify({
                title: "错误",
                message: res.data.msg,
                type: "error"
              });
            }
          });
        })
        .catch(() => {});
    },
    checkFromPlanOrGroup() {
      this.basePara = parseInt(this.$route.query.promoter_group_id);
      // console.log(this.basePara);
      // 判断是对计划下的成员 or 群组下的成员进行操作
      this.checkFromPlanOrGroup = {
        getMembersList: getClassGroupsInfo,
        addMember: addMemberForPlan,
        removeMember: removeMemberForPlan,
        batchRemoveMembers: batchRemoveMembersForPlan
      };
    },
    loadList() {
      // 定义参数 para
      let para = {
        page_index: this.page,
        page_size: 20,
        im_group_id: this.$route.query.promoter_group_id
      };
      // console.log(para);
      this.listLoading = true;

      this.checkFromPlanOrGroup.getMembersList(para).then(res => {
        this.listLoading = false;
        if (res.data.success) {
          this.totalCount = res.data.data.totalCount;
          this.limit = res.data.data.limit;
          this.users = res.data.data.items;
          // console.log(this.totalCount)
          this.users.map((item, index) => {
            item.entity.stat = item.entity.stat == 1 ? "有效" : "无效";
          });
        } else {
          // this.users = [];
        }
        this.listLoading = false;
      });
    },
     formatTime(row, column) {
      let property = column.property.split('.')
      let time = row[property[0]][property[1]]
			if (time === 0) {
				return '/'
			}
			return util.formatDate.format(new Date(time), 'yyyy/MM/dd');
		}
  },
 
  computed: {
    isMemListForPlan() {
      return true;
    }
  },
  mounted() {
    this.checkFromPlanOrGroup();
    this.loadList();
  }
};
</script>

<style lang="less">

</style>
