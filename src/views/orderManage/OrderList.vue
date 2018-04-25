<template lang="html">
    <div id="KvList">
        <!-- 按钮  过滤  工具条-->
        <el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
            <el-form :inline=true :model='filters'>
                <el-form-item>
                    <el-input v-model='filters.out_trade_no' placeholder='订单号' icon="circle-cross" :on-icon-click="handleIconClick_outTradeNo" @keydown.native.prevent.enter='loadList'></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model='filters.user_id' placeholder='用户ID' icon="circle-cross" :on-icon-click="handleIconClick_clearOid" @keydown.native.prevent.enter='loadList'></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type='primary' @click='loadList'>查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!-- 列表 -->
        <el-table border :data="orders" highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column type="expand">
                <template scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <!-- <el-form-item label="商品 ID">
                            <span>{{ props.row.oid }}</span>
                        </el-form-item>
                        <el-form-item label="商品名称">
                            <span>{{ props.row.channelTradeId }}</span>
                        </el-form-item> -->

                        <el-form-item label="订单号">
                            <span>{{ props.row.outTradeNo }}</span>
                        </el-form-item>

                        <el-form-item label="交易编号">
                            <span>{{ props.row.tradeId }}</span>
                        </el-form-item>

                        <el-form-item label="订单总价/元">
                            <span>{{ props.row.totalMoney }}</span>
                        </el-form-item>

                        <el-form-item label="实付款/元">
                            <span>{{ props.row.actualMoney | formatPaymentDetail }}</span>
                        </el-form-item>

                        <el-form-item label="付款时间">
                            <span>{{ props.row.ct | formatTime }}</span>
                        </el-form-item>

                        <el-form-item label="创建时间">
                            <span>{{ props.row.ct | formatTime }}</span>
                        </el-form-item>

                        <el-form-item label="更新时间">
                            <span>{{ props.row.ut | formatTime }}</span>
                        </el-form-item>

                        <el-form-item label="用户 ID">
                            <span>{{ props.row.userId }}</span>
                        </el-form-item>

                        <el-form-item label="用户电话">
                            <span>{{ props.row.mobile | formatMobileDetail }}</span>
                        </el-form-item>

                        <el-form-item label="订单状态" style="width: 100%">
                            <span>{{ props.row.stat | formatStatDetail }}</span>
                        </el-form-item>

                    </el-form>
                </template>
            </el-table-column>

            <el-table-column prop="id" label="ID" width="75" sortable align='center'></el-table-column>

            <el-table-column prop="outTradeNo" label="订单号" align='center' show-overflow-tooltip></el-table-column>

            <el-table-column prop="tradeId" label="交易编号" align='center' show-overflow-tooltip></el-table-column>

            <el-table-column prop="totalMoney" label="订单总金额" width="100" align='center' :formatter='formatPayment' show-overflow-tooltip></el-table-column>

			       <el-table-column prop="actualMoney" label="实付款/元" :formatter='formatPayment' width="100" align="center" show-overflow-tooltip></el-table-column>

            <el-table-column prop="ct" label="付款时间" :formatter='formatPayTime' width="190" align='center' show-overflow-tooltip></el-table-column>

            <el-table-column prop="mobile" label="用户电话" width="125" align='center' :formatter='formatMobile'></el-table-column>

            <el-table-column prop="stat" label="订单状态" :formatter='formatStat' align="center" width="180" show-overflow-tooltip></el-table-column>

		</el-table>
        <!-- 分页条 -->
        <el-col :span='24' class='toolbar'>
            <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size=limit :total=totalCount style='float: right'></el-pagination>
        </el-col>
    </div>
</template>

<script>
// 引入axios实例
import {
	getOrderList,
	addKvConf,
	editKvConf
} from '../../api/api'
// util工具包
import util from '../../common/js/util'

export default {
	data() {
		return {
			/*
			    filter
			 */
			filters: {
				user_id: '',
				out_trade_no: '',
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
			orders: [],
			listLoading: false,
		}
	},
	filters: {
		// 列表 formatTime 转换具体时间
		formatTime(date) {
			if (date == 0) {
				return '未更新'
			} else {
				return util.formatDate.format(new Date(date), 'yyyy/MM/dd   hh:mm:ss');
			}
		},
		formatPaymentDetail(actualMoney) {
			return Number(actualMoney) / 100;
		},
		formatStatDetail(stat) {
			switch (stat) {
				case 0:
					return '未创建支付交易';
					break;
				case 1:
					return '等待买家付款';
					break;
				case 2:
					return '等待支付确认';
					break;
				case 3:
					return '等待成团,即: 买家已付款，等待成团';
					break;
				case 4:
					return '等待卖家发货, 即: 买家已付款';
					break;
				case 5:
					return '等待买家确认收货, 即: 卖家已发货';
					break;
				case 6:
					return '买家已签收';
					break;
				case 7:
					return '卖家或买家主动关闭交易';
					break;
				case 8:
					return '付款以后用户退款成功，交易自动关闭';
					break;
			}
		},
		formatMobileDetail(mobile) {
			return mobile ? mobile : '未登记';
		}
	},
	methods: {
		//ToolBar
		// 点击input后面的icon 清除内容
		handleIconClick_clearOid() {
			this.filters.user_id = '';
			this.loadList();
		},
		handleIconClick_outTradeNo() {
			this.filters.out_trade_no = '';
			this.loadList();
		},
		loadList() {
			let para = {
				page_index: this.page,
				user_id: this.filters.user_id,
				out_trade_no: this.filters.out_trade_no
				// o_id: this.filters.oid,
				// channel_trade_id: this.filters.channelTradeId,
				// mobile: this.filters.mobile
			};
			this.listLoading = true;
			getOrderList(para)
				.then((res) => {
					console.log(res)
					if (res.data.success) {
						this.totalCount = res.data.data.totalCount;
						this.limit = res.data.data.limit;
						this.orders = res.data.data.items;
					} else {
						this.$notify({
							title: '错误',
							message: res.data.msg,
							type: 'error'
						})
						this.orders = [];
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
		},
		// 分页
		handleCurrentChange(val) {
			this.page = val;
			this.loadList();
		},
		//List
		// 列表显示
		// stat 数字转换状态
		formatStat(row, column) {
			switch (row.stat) {
				case 0:
					return '未创建支付交易';
					break;
				case 1:
					return '等待买家付款';
					break;
				case 2:
					return '等待支付确认';
					break;
				case 3:
					return '买家已付款';
					break;
				case 4:
					return '等待卖家发货';
					break;
				case 5:
					return '等待买家确认收货';
					break;
				case 6:
					return '买家已签收';
					break;
				case 7:
					return '卖家或买家主动关闭交易';
					break;
				case 8:
					return '用户退款成功';
					break;
			}
		},
		formatMobile(row, column) {
			return row.mobile ? row.mobile : '未登记';
		},
		formatPayment(row, column) {
			return Number(row.actualMoney) / 100;
		},
		// payTime 转换
		formatPayTime(row, column) {
			return util.formatDate.format(new Date(row.ct), 'yyyy/MM/dd   hh:mm:ss');
		},
	},
	mounted() {
		this.loadList();
	}
}
</script>

<style lang="less" scoped>

</style>
