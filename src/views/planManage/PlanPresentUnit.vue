<template lang="html">
    <div class="wrapper">
        <el-card class="box-card UnitMain">

            <div slot="header" class="clearfix">

                <span style="line-height: 36px;font-size: 20px" class="planName">{{ planName }}</span>
                <el-button-group style="float: right">
                    <el-button type="info" size="small" icon="plus" @click="addUnit()"></el-button>
                    <el-button type="success" size="small" icon="check" @click="storeUnit()"></el-button>
                </el-button-group>

            </div>

            <section class="unitDetail" v-loading="unitLoading" v-if="unitConf">

                <draggable draggable :list="value">
                    <el-collapse v-for="(item, index) in value" :key="item">
                        <el-collapse-item style="position: relative">
                            <!-- title 表示Unit -->
                            <template slot="title">
                              <el-input v-model="item.name" auto-complete="off" style="position:absolute; top: 4px; width: 200px;" ></el-input>
                                <div style="position:absolute; top: 6px; left: 400px; height: 30px; line-height: 30px;">
                                    <el-tooltip :content="'赠课单元是否显示'" placement="top">
                                        <el-switch
                                            v-model="item.hide"
                                            on-color="#13ce66"
                                            off-color="#ff4949"
                                            on-value="0"
                                            off-value="1"
                                        >
                                        </el-switch>
                                    </el-tooltip>
                                </div>
                                <el-button-group style="float: right; margin: 10px 35px 0 0;">
                                    <el-button type="info" size="small" icon="plus" @click="addNewLessonId(item.name, item, index)"></el-button>
                                    <el-button type="info" size="small" icon="edit" @click="modifiyCoverImage(item.name, item, index)"></el-button>
                                    <el-button type="danger" size="small" icon="delete" @click="removeThisUnit(item.name)"></el-button>
                                </el-button-group>
                            </template>

                            <!-- card里面的每项表示LessonId -->
                            <el-card class="box-card lessonDetail" v-if="item.lessons.length">
                                <draggable draggable :list="item.lessons">
                                    <div v-for="(lesson, index) in item.lessons" :key="lesson.id" class="text item lessonContent">
                                        <section>
                                            <span>{{ 'ID: ' + lesson.id }}</span>
                                            <span>{{ 'NAME: ' + lesson.name }}</span>
                                        </section>
                                        <el-button-group>
                                            <el-button type="info" size="small" icon="information" @click="enterInLessonDetailPage(lesson.id)"></el-button>
                                            <el-button type="danger" size="small" icon="delete" @click="removeThisLesson(item.name, index)"></el-button>
                                        </el-button-group>
                                    </div>
                                </draggable>
                            </el-card>
                        </el-collapse-item>
                    </el-collapse>
                </draggable>

            </section>

            <section class="unitExist" v-loading="unitLoading" v-if='!unitConf'>
                <h4 class="text">当前计划下没有赠课配置</h4>
            </section>

        </el-card>

        <!-- 新增Unit页面 -->
        <el-dialog title='新增赠课' v-model='addFormVisible' :close-on-click-modal='false'>
            <el-form :model='addForm' label-width='120px' :rules='addFormRules' ref='addForm'>

                <el-form-item label='单元名称' prop='name' v-if="manualOp">
                    <el-input v-model='addForm.name' placeholder="输入单元名称" :disabled='addForm.from'></el-input>
                </el-form-item>

                <el-form-item label='课节 ID' prop='lessonIds' v-if="manualOp">
                    <el-input v-model='addForm.lessonIds' placeholder="输入课节id并以逗号分隔"></el-input>
                </el-form-item>

                <el-form-item label='单元封面' prop='cover_image' v-if="manualOp">
                    <el-input v-model='addForm.cover_image' placeholder="输入赠课单元的封面图地址"></el-input>
                </el-form-item>

                <el-form-item label="选择方式" required>
                    <el-dropdown split-button type="primary" @command="handleCommand">
                        选择方式
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="manual">手动添加</el-dropdown-item>
                            <el-dropdown-item command="listChoose">去列表选择</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :disabled="submitFlag" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <!-- 修改封面图片地址弹窗 -->
        <el-dialog title='修改图片地址' v-model='modifiyCoverImageForm' :close-on-click-modal='false'>
            <el-form :model='updateData' label-width='120px' :rules='addFormRules' ref='addForm'>
                <el-form-item label='图片地址' prop='name'>
                    <el-input v-model='updateData.cover_image' placeholder="输入赠课单元的封面图地址"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="modifiyCoverImageForm = false">取消</el-button>
                <el-button type="primary" @click.native="modifiyCoverImageSubmit">提交</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
// 引入axios实例
import {
  getPlanById,
  updateUnitForPlan
} from '../../api/api'
// 引入 draggable
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  data() {
    return {
      planName: '',
      value: [
        // {
        //     name: 'Jerry Unit',
        //     lessonIds: [1,2,3,4,5]
        // }
      ],
      useValue: '',
      unitLoading: false, //unit配置加载
      unitConf: false, //是否存在unit配置
      // 新增界面
      addFormVisible: false, //新增界面是否显示

      addLoading: false, //新增界面是否显示加载

      addFormRules: { //新增界面表单规则
        name: [{
          required: true,
          message: '请输入单元名称',
          trigger: 'blur',
          type: 'string'
        }],
        lessonIds: [{
          required: true,
          message: '请输入课节ID',
          trigger: 'blur'
        }],
        cover_image: [{
          required: true,
          message: '请输入正确图片地址',
          trigger: 'blur',
        }]
      },

      addForm: { //新增界面表单数据类型
        name: '',
        lessonIds: '',
        cover_image: ''
      },
      // 默认false 不显示手动输入ID输入框
      manualOp: false,
      // 添加单元时候 只有选择添加方式后 提交按钮才是可用的
      submitFlag: true,
      modifiyCoverImageForm: false,
      updateData: {
        cover_image:'',
        hide: '',
        lessons: '',
        name:''
      }
    }
  },
  methods: {
    // 加载数据
    loadList() {
      this.unitLoading = true;
      let para = {
        plan_id: this.$route.query.plan_id
      }
      getPlanById(para).then((res) => {
        if (res.data.success) {
          this.planName = res.data.data.data.entity.name;

          if (res.data.data.data.planUnitWithLessonsList && res.data.data.data.planUnitWithLessonsList.length > 0) {
            // 数据初始化
            this.value = res.data.data.data.planUnitWithLessonsList.map(item => {
              item.hide = item.hide + '';
              return item;
            });
            this.useValue = res.data.data.data.conf.planUnits;
            this.unitConf = true;
          } else {
            // 初始化为空
            this.value = [];
            this.useValue = [];
            this.unitConf = false;
          }
          if(res.data.data.data.conf.planUnits && res.data.data.data.conf.planUnits.length) {
              res.data.data.data.conf.planUnits.map((item, index) => {
                this.value[index].coverImage = item.coverImage?item.coverImage:'';
              })
          }

        } else {
          this.$notify({
            title: '错误',
            message: res.data.msg,
            type: 'error',
          })
        }

        this.unitLoading = false;
      })

    },
    //
    // 下拉菜单选择触发事件
    handleCommand(command) {
      if (command == 'manual') {
        this.manualOp = true;
        this.submitFlag = false;
      } else if (command == 'listChoose') {
        this.manualOp = false;
        this.submitFlag = true;
        // 进行listChoose
        this.$confirm('确保在跳转前保存配置', '提示', {
            confirmButtonText: '跳转',
            cancelButtonText: '取消',
          })
          .then(() => {
            this.$router.push({
              path: '/LessonList',
              query: {
                plan_id: this.$route.query.plan_id,
                name: this.addForm.name
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
      }
    },
    // 添加新的单元
    addUnit() {

      // 显示添加页面
      this.addFormVisible = true;
      this.addForm = {
        name: '',
        lessonIds: '',
        cover_image: ''
      }

    },
    // 新增提交
    addSubmit() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {

          // 做校验 id不能出现非数字
          let arr = this.addForm.lessonIds.split(',');
          for (let i = 0; i < arr.length; i++) {
            let Num = Number(arr[i])
            if (!Number.isInteger(Num)) {
              this.$nofity({
                title: '错误',
                message: arr[i] + '是不合法id,请重新输入',
                type: 'error'
              })
              // 校验失败 跳出
              return false;
            }
          }

          // 保证操作前进行的拖拽顺序改变
          this.checkOrder();

          this.$confirm('请确认提交吗？', '提示', {})
            .then(() => {

              this.addLoading = true;

              // 新增单元 this.addForm.from
              if (!this.addForm.from) {

                if (this.useValue.length > 0) {
                  for (let i = 0; i < this.useValue.length; i++) {
                    if (this.addForm.name == this.useValue[i].name) {
                      this.$notify({
                        title: '错误',
                        message: '赠课名称存在请重新填写',
                        type: 'error'
                      })
                      this.addForm.name = '';
                      this.addLoading = false;
                      // 校验失败 跳出
                      return false;
                    }
                  }
                }

                let newUnit = {
                  name: this.addForm.name,
                  lessonIds: this.addForm.lessonIds.split(','),
                  cover_image: this.addForm.cover_image
                }
                this.useValue.push(newUnit);

                // 发送更新
                this.update(this.useValue);
              } else {
                // 单元下新增lesson
                this.useValue.forEach((item, index) => {
                  this.useValue[this.addForm.index].cover_image = this.addForm.cover_image;
                  if (item.name == this.addForm.from) {
                    if (item.lessonIds.length == 0) {
                      item.lessonIds = this.addForm.lessonIds.split(',')
                    } else {
                      item.lessonIds = (item.lessonIds.join(',') + ',' + this.addForm.lessonIds).split(',');
                    }
                  }
                })
                // 发送更新
                this.update(this.useValue);
              }
            });
        }
      });
    },
    // 删除已有的某个unit
    removeThisUnit(name) {

      // 阻挡原先的事件
      event.stopPropagation();

      // 保证操作前进行的拖拽顺序改变
      this.checkOrder();

      this.$confirm('确认要删除该赠课单元吗?', '提示', {})
        .then(() => {
          this.useValue.forEach((item, index) => {
            if (item.name == name) {
              this.useValue.splice(index, 1);
            }
          })

          // 发送更新
          this.update(this.useValue);

        })
        .catch(() => {
          this.$notify({
            title: '提示',
            type: 'info',
            message: '取消删除'
          })
        })
    },
    // 对当前Unit编辑 LESSON => 增删
    // 新增LESSON
    addNewLessonId(unitName, item, index) {
      // 阻挡原先的事件
      event.stopPropagation();
      // 显示添加页面
      if (this.$refs['addForm']) {
        this.$refs['addForm'].resetFields();
      }
      this.addFormVisible = true;
      this.manualOp = false;
      this.addForm = {
        name: unitName,
        lessonIds: '',
        from: unitName,
        cover_image: item.coverImage,
        index: index
      }
    },
    enterInLessonDetailPage(lessonId) {
      this.$router.push('/lessonDetails/' + lessonId);
    },
    // 删除个LESSON
    removeThisLesson(name, position) {
      // 保证操作前进行的拖拽顺序改变
      this.checkOrder();

      this.$confirm('确认要删除该课节吗?', '提示', {})
        .then(() => {
          this.useValue.forEach((item, index) => {
            if (item.name == name) {
              item.lessonIds.splice(position, 1);
            }
          })
          // 发送更新
          this.update(this.useValue);
        })
        .catch(() => {
          this.$notify({
            title: '提示',
            type: 'info',
            message: '取消删除'
          })
        })
    },
    // 对该plan下的赠课配置进行保存 尤指修改顺序后
    storeUnit() {
      // 保证操作前进行的拖拽顺序改变
      this.checkOrder();
      // 发送更新
      this.update(this.useValue);
    },
    // 保证操作前进行的拖拽顺序改变
    checkOrder() {
      this.useValue.forEach((item) => {
        item.lessonIds = [];
      })
      this.value.forEach((item, index) => {
        item.lessons.forEach((tempObj) => {
          this.useValue[index].name = this.value[index].name;
          this.useValue[index].hide = this.value[index].hide;
          this.useValue[index].lessonIds.push(tempObj.id);
          this.useValue[index].coverImage = this.value[index].coverImage;
        })
      })
    },
    // 发送更新
    update(arr) {
      let para = {
        plan_id: this.$route.query.plan_id,
        values: JSON.stringify(arr)
      }
      updateUnitForPlan(para).then((res) => {
        if (res.data.success) {
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success'
          })
          this.modifiyCoverImageForm = false;
          this.addFormVisible = false;
          try {
            this.$refs['addForm'].resetFields();
          } catch (e) {

          } finally {

          }
          this.loadList();
        } else {
          this.$notify({
            title: '错误',
            message: res.data.msg,
            type: 'error'
          })
          this.loadList();
        }
        this.addLoading = false;
        this.manualOp = false;
      })
    },
    //修改封面图片
    modifiyCoverImage(name, item, index) {
        event.stopPropagation();
        this.checkOrder();
        this.modifiyCoverImageForm = true;
        let lessonIds = [];
        if(item.lessons && item.lessons.length) {
          item.lessons.map(prop => {
            lessonIds.push(prop.id)
          })
        }

        this.updateData= {
          name: name,
          lessonIds: lessonIds.join(','),
          cover_image: item.coverImage,
          index: index
        }
    },
    modifiyCoverImageSubmit() {
      this.useValue.map(item => {
        this.useValue[this.updateData.index].cover_image = this.updateData.cover_image;
      })
      this.update(this.useValue);
    }
  },
  mounted() {
    this.loadList();
  },
  watch: {
    addFormVisible: {
      handler(newValue, oldValue) {
        if (!newValue) {
          this.manualOp = false;
          this.submitFlag = true;
        }
      }
    }
  }

}
</script>

<style lang="less" scoped>
.wrapper {
    display: flex;
    justify-content: center;
    .UnitMain {
        width: 60%;
        .planName {
            width: 100%;
            font-weight: bold;
        }
        .unitDetail {
            width: 100%;
            .lessonDetail {
                .text {
                    font-size: 16px;
                    .item {
                        padding: 18px 0;
                        margin: 50px 0;
                    }
                }
                .lessonContent {
                    border-bottom: 1px solid #000;
                    display: flex;
                    justify-content: space-between;
                    section {
                        width: 80%;
                        display: flex;
                        justify-content: space-between;
                        span {
                            display: inline-block;
                            line-height: 36px;
                            &:first-child {
                                width: 30%;
                            }
                            &:last-child {
                                width: 70%;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                overflow: hidden;
                            }
                        }
                    }
                    .el-button-group {
                        margin-top: 4px;
                    }
                }
                .clearfix:after,
                .clearfix:before {
                    display: table;
                    content: "";
                }
                .clearfix:after {
                    clear: both;
                }
            }
        }
        .unitExist {
            display: flex;
            justify-content: center;
            .text {
                font-weight: normal;
            }
        }
    }
}
</style>
