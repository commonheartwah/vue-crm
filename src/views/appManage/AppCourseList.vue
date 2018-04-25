<template lang='html'>

    <section>
        <!-- 按钮  过滤  工具条-->
        <el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>

            <el-form :inline=true :model='filters' style="float: left">

                <el-form-item>
                    <el-input v-model='filters.course_id' placeholder='课程 ID' icon="circle-cross" :on-icon-click="handleIconClick_clearCourseId" @keydown.native.prevent.enter='loadList'></el-input>
                </el-form-item>

                <el-form-item>
                    <el-input v-model='filters.name' placeholder='课程名称' icon="circle-cross" :on-icon-click="handleIconClick_clearName" @keydown.native.prevent.enter='loadList' disabled></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type='primary' @click='loadList'>查询</el-button>
                </el-form-item>

                <el-form-item>
                    <el-dropdown split-button type="primary" @command="handleCommand">
                        开通新课
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="1">开通体系课</el-dropdown-item>
                            <el-dropdown-item command="2">开通单项课</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-form-item>

            </el-form>

            <div style="float: right; margin: 5px 20px 0 0;">
                <el-button type='text' >{{ this.$route.query.user_name }}</el-button>
                <el-badge :value="totalNumber" class="alreadyClass">
                    <el-button type='text'>当页已开通课程</el-button>
                </el-badge>
            </div>

        </el-col>

        <!-- 列表 -->
        <el-table :data='course' highlight-current-row v-loading='listLoading' style='width: 100%;' border>

            <el-table-column type="expand">
                <template scope="props">
                    <el-form label-position="left" inline class="demo-table-expand" label-width='120px'>

                        <el-form-item label="开课 ID">
                            <span>{{ props.row.entity.id }}</span>
                        </el-form-item>

                        <el-form-item label="是否开课">
                            <span>{{ props.row.entity.stat | formatStatDetail }}</span>
                        </el-form-item>

                        <el-form-item label="计划 ID" v-if="props.row.planEntity">
                            <span>{{ props.row.entity.planId }}</span>
                        </el-form-item>

                        <el-form-item label="计划名称" v-if="props.row.planEntity">
                            <span>{{ props.row.planEntity.name }}</span>
                        </el-form-item>

                        <el-form-item label="课程 ID">
                            <span>{{ props.row.courseEntity.id }}</span>
                        </el-form-item>

                        <el-form-item label="课节数量">
                            <span>{{ props.row.courseEntity.lessonNumber }}</span>
                        </el-form-item>

                        <el-form-item label="课程名称">
                            <span>{{ props.row.courseEntity.name }}</span>
                        </el-form-item>

                        <el-form-item label="课程显示状态">
                            <span>{{ props.row.courseEntity.display | formatDisplayDetail }}</span>
                        </el-form-item>

                        <el-form-item label="开课日期">
                            <!-- 体系课走上面 -->
                            <span v-if="props.row.planEntity">{{ props.row.planEntity.startTime | formatTimeDetail }}</span>
                            <!-- 单项课走下面 -->
                            <span v-if="!props.row.planEntity">{{ props.row.entity.startTime | formatTimeDetail }}</span>
                        </el-form-item>

                        <el-form-item label="截止日期" >
                            <span v-if="props.row.planEntity">{{ props.row.planEntity.endTime | formatTimeDetail }}</span>
                            <span v-if="!props.row.planEntity">{{ props.row.entity.endTime | formatTimeDetail }}</span>
                        </el-form-item>

                        <el-form-item label="课程类型">
                            <span>{{ props.row | formatSubtypeDetail }}</span>
                        </el-form-item>

                        <el-form-item label="售卖类型">
                            <span>{{ props.row.courseEntity.fee | formatFeeDetail }}</span>
                        </el-form-item>

                        <el-form-item label="开课创建时间">
                            <span>{{ props.row.entity.ct | formatTimeDetail }}</span>
                        </el-form-item>

                        <el-form-item label="开课更新时间">
                            <span>{{ props.row.entity.ut | formatTimeDetail }}</span>
                        </el-form-item>

                    </el-form>
                </template>
            </el-table-column>

            <!-- <el-table-column prop='entity.id' label='ID' width='95' sortable align='center'></el-table-column> -->

            <el-table-column prop='courseEntity.name' label='课程名称' align='center' show-overflow-tooltip></el-table-column>

            <el-table-column prop='courseEntity.subType' label='课程类型' align='center' :formatter='formatSubtype' show-overflow-tooltip></el-table-column>

            <el-table-column label='开课时间' width='138' align='center' :formatter='formatStartTime'></el-table-column>

            <el-table-column label='失效时间' width='138' align='center' :formatter='formatEndTime'></el-table-column>

            <el-table-column
                prop="entity.stat"
                label="开课标签"
                width="120"
                :filters="[{ 'text': '已开课', value: 1 }, { 'text': '已关课', value: 0 }]"
                :filter-method="filterTagForStat"
                filter-placement="bottom-end"
                align="center"
            >
                <template scope="scope">
                    <el-tag
                        :type="scope.row.entity.stat === 1 ? 'success' : 'danger'"
                        close-transition
                    >
                        {{ scope.row.entity.stat | formatStatDetail}}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column
                prop="courseEntity.display"
                label="APP显示状态"
                width="150"
                :filters="[{ 'text': '显示', value: 1 }, { 'text': '不显示', value: 0 }]"
                :filter-method="filterTagForDisplay"
                filter-placement="bottom-end"
                align="center"
            >
                <template scope="scope">
                    <el-tag
                        :type="scope.row.courseEntity.display === 1 ? 'success' : 'danger'"
                        close-transition
                    >
                        {{ scope.row.courseEntity.display | formatDisplayDetail}}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column label='操作' align='center' width='220'>
                <template scope='scope'>
                    <el-button size='small' type='success' @click='handleUpdate(scope.$index, scope.row)'>更新课程</el-button>
                    <el-button size='small' type='info' @click='handleDet(scope.$index, scope.row)'>操作记录</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页条 -->
        <el-col :span='24' class='toolbar'>
            <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size=limit :total='totalCount' style='float: right'></el-pagination>
        </el-col>

        <!-- 给app用户开课的时候更新课程 -->
        <el-dialog title='更新课程' v-model='dateFormVisible' :close-on-click-modal='false'>
            <el-form :model='dateForm' label-width='100px' ref="dateForm">

                <el-form-item label='有效期选择' v-show="this.judgeFlag">
                    <el-date-picker v-model="validPeriod" type="daterange" placeholder="选择日期范围"></el-date-picker>
                </el-form-item>

                <el-form-item label="状态">
					          <el-radio-group v-model="dateForm.status">
						            <el-radio class="radio" :label="1">开课</el-radio>
					            	<el-radio class="radio" :label="0">关课</el-radio>
                    </el-radio-group>
				        </el-form-item>
                <el-form-item label="用户类型" required>
                    <el-radio-group v-model="dateForm.record_user_type">
                        <el-radio class="radio" :label="0">订单用户</el-radio>
                        <el-radio class="radio" :label="1">班长</el-radio>
                        <el-radio class="radio" :label="2">大班长</el-radio>
                        <el-radio class="radio" :label="3">班主任</el-radio>
                        <el-radio class="radio" :label="4">推广人</el-radio>
                        <el-radio class="radio" :label="5">内部员工</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="开课原因" required v-show="dateForm.status ==1">
                    <el-radio-group v-model="dateForm.record_reason_type" v-for="(reason,index) in reasonOpen">
                        <el-radio class="radio" :label="index" style="width: 100px">{{reason.name}}</el-radio>
                        <!--<el-radio class="radio" :label="1">测试</el-radio>-->
                        <!--<el-radio class="radio" :label="2">有赞购买</el-radio>-->
                        <!--<el-radio class="radio" :label="3">激活</el-radio>-->
                        <!--<el-radio class="radio" :label="4">变更手机号</el-radio>-->
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="关课原因" required v-show="dateForm.status ==0">
                    <el-radio-group v-model="dateForm.record_reason_type" v-for="(reason,index) in reasonClose">
                        <el-radio class="radio" :label="index" style="width: 100px">{{reason.name}}</el-radio>
                        <!--<el-radio class="radio" :label="1">辞职</el-radio>-->
                        <!--<el-radio class="radio" :label="2">转其他岗位</el-radio>-->
                        <!--<el-radio class="radio" :label="3">考核不通过</el-radio>-->
                        <!--<el-radio class="radio" :label="4">变更手机号</el-radio>-->
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="记录备注" prop="name">
                    <el-input v-model="dateForm.record_remark"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
				<el-button @click.native="dateFormVisible=false">取消</el-button>
				<el-button type="primary" @click.native="dateSubmit" :loading="dateLoading">提交</el-button>
			</div>
        </el-dialog>

        <!-- 操作记录查询-->
        <el-dialog title="操作记录" v-model="dateDetVisible" style="width: 100%" :close-on-click-modal='false'>
          <el-table :data="dataDet" style="width: 100%" label-width='100px' border>
            <el-table-column prop="operator_id" label="操作人">
            </el-table-column>
            <el-table-column prop="action" label="所进行的操作">
            </el-table-column>
            <el-table-column prop="reason" label="操作原因">
            </el-table-column>
            <el-table-column prop="userType" label="用户身份">
            </el-table-column>
            <el-table-column prop="orderNumber" label="订单号">
            </el-table-column>
            <el-table-column prop="remark" label="备注">
            </el-table-column>
            <el-table-column prop="ct" label="操作时间">
            </el-table-column>
          </el-table>
        </el-dialog>


    </section>

</template>

<script>
// 引入工具包
import util from '../../common/js/util'
// 引入axios
import {
	getAppCourseList,
	updateAppCourse,
	operationRecord,
	getPublicKvList
} from '../../api/api';

export default {

	data() {
		return {
			listLoading: false, // 加载默认false
			// 过滤器
			filters: {
				name: '',
				course_id: ''
			},
			// course 数据
			course: [
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
			// 选择有效期
			dateFormVisible: false, //新增界面是否显示
			dateLoading: false, //新增界面是否显示加载
			dateDetVisible: false,
			dateForm: {
				status: 0,
				record_user_type: 0,
				record_reason_type: 0,
				record_remark: ''
			}, //新增界面表单数据类型
			// 有效期选择 数组中[0]开始时间[1]结束时间
			validPeriod: [],
			// 已开通的课程数量
			totalNumber: 0,
			// 判断是体系课还是单项课
			judgeFlag: false,
			// 操作记录
			dataDet: [],
			//用户身份
			userType: [],
			//开课原因
			reasonOpen: [],
			//关课原因
			reasonClose: []
		}
	},
	filters: {
		formatFeeDetail(fee) {
			return fee == 1 ? '免费' : fee == 2 ? '收费' : '限时收费';
		},
		formatSubtypeDetail(row) {
			let result = '';
			let base = '';
			if (row.courseEntity.type == 1) {
				base = '体系课';
				switch (row.courseEntity.subType) {
					case 1:
						result = '精品课';
						break;
					case 2:
						result = '发音课';
						break;
					case 3:
						result = '体验课';
						break;
				}
			} else if (row.courseEntity.type == 2) {
				base = '单项课';
				switch (row.courseEntity.subType) {
					case 1:
						result = '词汇课';
						break;
					case 2:
						result = '儿歌课';
						break;
					case 3:
						result = '绘本课';
						break;
					case 4:
						result = '自然拼读';
						break;
					case 5:
						result = '故事课';
						break;
					case 6:
						result = '家庭游戏课';
						break;
					case 7:
						result = '科普主题课';
						break;
					case 8:
						result = '推广课';
						break;
					case 9:
						result = '教学卡';
						break;
					case 10:
						result = '音乐课';
						break;
				}
			}
			return base + ' > ' + result;
		},
		formatTimeDetail(date) {
			return date ? util.formatDate.format(new Date(date), 'yyyy/MM/dd   hh:mm:ss') : '未更新';
		},
		formatStatDetail(stat) {
			return stat == 1 ? '已开课' : stat == 0 ? '已关课' : '未知';
		},
		formatDisplayDetail(display) {
			return display == 1 ? '显示' : display == 0 ? '不显示' : '未知';
		}
	},
	methods: {
		// 显示列表(startTime 转换)
		formatStartTime(row, column) {
			switch (row.courseEntity.type) {
				case 1:
					return row.planEntity.startTime ? util.formatDate.format(new Date(row.planEntity.startTime), 'yyyy/MM/dd') : '未更新';
					break;
				case 2:
					return row.entity.startTime ? util.formatDate.format(new Date(row.entity.startTime), 'yyyy/MM/dd') : '未更新';
					break;
			}
		},
		// 显示列表(endTime 转换)
		formatEndTime(row, column) {
			switch (row.courseEntity.type) {
				case 1:
					return row.planEntity.endTime ? util.formatDate.format(new Date(row.planEntity.endTime), 'yyyy/MM/dd') : '未更新';
					break;
				case 2:
					return row.entity.endTime ? util.formatDate.format(new Date(row.entity.endTime), 'yyyy/MM/dd') : '未更新';
					break;
			}
		},
		// 显示列表(subtype 数字转换类型)
		formatSubtype(row, column) {
			let result = '';
			let base = '';
			if (row.courseEntity.type == 1) {
				base = '体系课';
				switch (row.courseEntity.subType) {
					case 1:
						result = '精品课';
						break;
					case 2:
						result = '发音课';
						break;
					case 3:
						result = '体验课';
						break;
				}
			} else if (row.courseEntity.type == 2) {
				base = '单项课';
				switch (row.courseEntity.subType) {
					case 1:
						result = '词汇课';
						break;
					case 2:
						result = '儿歌课';
						break;
					case 3:
						result = '绘本课';
						break;
					case 4:
						result = '自然拼读';
						break;
					case 5:
						result = '故事课';
						break;
					case 6:
						result = '家庭游戏课';
						break;
					case 7:
						result = '科普主题课';
						break;
					case 8:
						result = '推广课';
						break;
					case 9:
						result = '教学卡';
						break;
					case 10:
						result = '音乐课';
						break;
				}
			}
			return base + ' > ' + result;
		},
		// 显示列表(display 数字转换类型)
		formatDisplay(row, column) {
			return row.courseEntity.display == 1 ? '显示' : row.courseEntity.display == 0 ? '不显示' : '未知';
		},
		// 列表标签显示开关课的状态
		filterTagForStat(value, row) {
			return row.entity.stat === value;
		},
		// 列表标签显示APP显示状态
		filterTagForDisplay(value, row) {
			return row.courseEntity.display === value;
		},
		// 点击input后面的icon 清除内容
		handleIconClick_clearCourseId() {
			this.filters.course_id = '';
		},
		handleIconClick_clearName() {
			this.filters.name = '';
		},
		// 分页
		handleCurrentChange(val) {
			this.page = val;
			this.loadList();
		},
		// 下拉菜单选择新增课程
		handleCommand(command) {
			if (command == '1') {
				this.$router.push({
					path: '/planList',
					query: {
						user_id: this.$route.query.user_id
					}
				})
			} else if (command == '2') {
				this.$router.push({
					path: '/CourseList',
					query: {
						user_id: this.$route.query.user_id
					}
				})
			}
		},
		// 来自APPCourse的跳转 确认开通课程
		handleUpdate(index, row) {
			this.dateFormVisible = true;
			this.initType();
			this.dateForm = {
				status: row.entity.stat ? 0 : 1,
				id: row.entity.id,
				course_id: row.entity.courseId,
				plan_id: row.entity.planId,
				user_id: row.entity.userId,
				record_user_type: 0,
				record_reason_type: 0
			}
			if (row.planEntity) {
				this.judgeFlag = false;
			} else {
				this.judgeFlag = true;
			}
		},
		//更新课程提交
		dateSubmit() {
			this.$refs.dateForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {
							type: 'warning'
						})
						.then(() => {
							this.dateLoading = true;

							let para = Object.assign({}, this.dateForm);

							// 判断有效期是否为空
							try {
								// 有效期不为空
								para['start_time'] = util.formatDate.format(this.validPeriod[0], 'yyyy-MM-dd');
								para['end_time'] = util.formatDate.format(this.validPeriod[1], 'yyyy-MM-dd');
							} catch (e) {
								// 有效期为空
								para['start_time'] = para['end_time'] = 0;
							} finally {

							}
							updateAppCourse(para).then((res) => {
								if (res.data.success) {
									this.$notify({
										title: '成功',
										message: '操作成功',
										type: 'success'
									});
									this.dateFormVisible = false;
									this.dateLoading = false;
									this.loadList();
								} else {
									this.$notify({
										title: '错误',
										message: res.data.msg,
										type: 'error'
									})
									this.dateLoading = false;
								}
								this.validPeriod = [];
							})
						})
						.catch(() => {
							this.$notify({
								title: '提示',
								message: '取消提交',
								type: 'info'
							})
						});
				}
			})
		},
		// 操作记录查询
		handleDet(index, row) {
			this.dataDet = [];
			this.dateDetVisible = true;
			//获取开课原因
			this.initType();

			let para = {
				user_id: row.entity.userId,
				target_id: row.entity.courseId,
				biz_scene: 'user_course'
			}
			operationRecord(para).then((res) => {
				if (res.data.success) {
					var resData = res.data.data.items;
					console.log(resData);
					//开课原因
					var reasonOpen = this.reasonOpen.map(item => {
						return item.name;
					});
					//关课原因
					var reasonClose = this.reasonClose.map(item => {
						return item.name;
					});
					//转入原因
					var reasonTransIn = this.reasonTrans_in.map(item => {
						return item.name;
					});
					//转出原因
					var reasonTransOut = this.reasonTrans_out.map(item => {
						return item.name;
					});
					//用户身份
					var userType = ['订单用户', '班长', '大班长', '班主任', '推广人', '内部员工', '激活卡用户']

					for (var i = 0; i < resData.length; i++) {
						var reason = ''
						switch (resData[i].entity.action) {
							case 'open':
								reason = reasonOpen[resData[i].reason.reasonType];
								break;
							case 'close':
								reason = reasonClose[resData[i].reason.reasonType];
								break;
							case 'trans_in':
								reason = reasonTransIn[resData[i].reason.reasonType];
								break;
							case 'trans_out':
								reason = reasonTransOut[resData[i].reason.reasonType];
								break;
						}
						this.dataDet.push({
							operator_id: resData[i].entity.operatorId,
							ct: util.formatDate.format(new Date(resData[i].entity.ct), 'yyyy/MM/dd hh:mm:ss'),
							action: resData[i].entity.action,
							//reason: resData[i].entity.action == 'open' ? reasonOpen[resData[i].reason.reasonType] : reasonClose[resData[i].reason.reasonType],
							reason: reason,
							userType: userType[resData[i].conf.recordUserType],
							orderNumber: resData[i].conf.userCourseOrder ? resData[i].conf.userCourseOrder.orderNumber : '',
							remark: resData[i].entity.remark
						})
					}
				} else {
					this.$notify({
						title: '错误',
						message: res.data.msg,
						type: 'error'
					})
				}
			})

		},
		//初始化请求开课关课原因获取type类型
		initType() {
			getPublicKvList({
				name: '_sys.operation.record'
			}).then(res => {
				if (res.data.success) {
					let arr = JSON.parse(res.data.data.content).data.user_course;
					this.reasonClose = arr.action.close.reason;
					this.reasonOpen = arr.action.open.reason;
					this.reasonTrans_in = arr.action.trans_in.reason;
					this.reasonTrans_out = arr.action.trans_out.reason
				} else {
					this.$notify({
						title: "错误",
						type: "error",
						message: res.data.msg
					});
				}
			})
		},
		//加载后台用户列表
		loadList(flag) {
			// 初始化course为数组
			this.course = [];
			// 初始化已开通课程总数为零
			this.totalNumber = 0;
			let para = {
				user_id: this.$route.query.user_id,
				page_index: this.page,
				name: this.filters.name,
				course_id: this.filters.course_id,
				page_size: 40
			};
			this.listLoading = true;
			getAppCourseList(para)
				.then((res) => {
					if (res.data.success) {
						this.totalCount = res.data.data.totalCount;
						this.limit = res.data.data.limit;
						// 确保请求到的数据中没有null
						res.data.data.items.forEach((tempObj) => {
							if (tempObj != null) {
								this.course.push(tempObj)
								if (tempObj.entity.stat) {
									this.totalNumber++;
								}
							}
						})
					} else {
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
					} else if (error.request) {
						this.$notify({
							title: error.request,
							message: '网络请求错误',
							type: 'error'
						})
					} else {
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
	mounted() {
		this.loadList();

	}
}
</script>

<style lang='less' scoped>
</style>
