<template lang='html'>
    <section>
        <!-- 列表 -->
        <el-table :data='formData' v-loading='listLoading' style='width: 100%;' border stripe tooltip-effect='light' @selection-change="handleSelectionChange">
            <el-table-column type="expand" v-if="formTitle.expand">
                <template scope="scope" >
                    <figure class="formExpand">
                        <img :src="scope.row.icon" class="image" v-if='scope.row.icon'>
                        <img src="../../static/images/defaultPicInElementVideo.jpg" class="image" v-else >
                        <figcaption>
                            <p><span>性别：</span>{{ scope.row.gender | formatGender}}</p>
                            <p><span>年龄：</span>{{ scope.row.age }}</p>
                            <p><span>描述：</span>{{ scope.row.description }}</p>
                        </figcaption>
                    </figure>
                </template>
            </el-table-column>
            <el-table-column type="expand" v-if="formTitle.merchandisExpand">
                <template scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="商品名称">
                            <span>{{ props.row.name }}</span>
                        </el-form-item>
                        <el-form-item label="商品 ID">
                            <span>{{ props.row.id }}</span>
                        </el-form-item>
                        <el-form-item label="创建时间">
                            <span>{{ props.row.ct | formatTime}}</span>
                        </el-form-item>
                        <el-form-item label="更新时间">
                            <span>{{ props.row.ut | formatTime}}</span>
                        </el-form-item>
                        <el-form-item label="商品描述" style="width: 100%;">
                            <span>{{ props.row.description }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column type="expand" v-if="formTitle.customExpand">
                <template scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item :label="formTitle.customExpand.name.label"  v-if="formTitle.customExpand.name">
                            <span>{{ props.row.name }}</span>
                        </el-form-item>
                        <el-form-item :label="formTitle.customExpand.id.label"  v-if="formTitle.customExpand.id">
                            <span>{{ props.row.id }}</span>
                        </el-form-item>
                        <el-form-item :label="formTitle.customExpand.ct.label"  v-if="formTitle.customExpand.ct">
                            <span>{{ props.row.ct | formatTime}}</span>
                        </el-form-item>
                        <el-form-item :label="formTitle.customExpand.ut.label" v-if="formTitle.customExpand.ut">
                            <span>{{ props.row.ut | formatTime}}</span>
                        </el-form-item>
                        <el-form-item :label="formTitle.customExpand.type.label" v-if="formTitle.customExpand.type">
                            <span>{{ props.row.type | formatType(formTitle)}}</span>
                        </el-form-item>
                        <el-form-item :label="formTitle.customExpand.ver.label" v-if="formTitle.customExpand.ver">
                            <span>{{ props.row.ver }}</span>
                        </el-form-item>
                        <el-form-item :label="formTitle.customExpand.description.label" v-if="formTitle.customExpand.description" style="width:100%;">
                            <span>{{ props.row.description }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column type="expand" v-if="formTitle.CourseExpand">
                <template scope="scope" >
                    <figure class="formExpand">
                        <img :src="scope.row.conf.image.iconUrl" class="CourseImage" v-if='scope.row.conf && scope.row.conf.image && scope.row.conf.image.iconUrl'>
                        <img src="../../static/images/defaultPicInElementVideo.jpg" class="CourseImage" v-else >
                        <figcaption>
                            <p><span>课程编辑：</span><el-button size='small' @click='handleEdit(scope.$index, scope.row)' v-if="formTitle.CourseExpand.edit" style="color:#000"  icon="edit">{{ formTitle.CourseExpand.edit.label }}</el-button></p>
                            <p><span>课程名称：</span>{{ scope.row.name }}</p>
                            <p><span>内部名称：</span>{{ scope.row.internalName }}</p>
                            <p><span>课程类型：</span>{{ scope.row | formatCourseType }}</p>
                            <p><span>观看类型：</span>{{ scope.row | formatCourseViewType }}</p>
                            <p v-if="scope.row.type==1 && scope.row.subType==1"><span>绑定课程：</span>发音课id -> {{ scope.row.conf.soundId || '当前未绑定'}}</p>
                            <p><span>课节数量：</span>{{ scope.row.lessonNumber }}</p>
                            <p><span>是否显示：</span>{{ scope.row.display | formatDisplay}}</p>
                            <p><span>课程状态：</span>{{ scope.row.stat | formatStat}}</p>
                            <p><span>课程价格：</span>{{ scope.row.price | formatPrice}}</p>
                            <p><span>拥有单元：</span>{{ scope.row.conf | formatUnitNum }}</p>
                            <p><span>创建时间：</span>{{ scope.row.ct | formatTime }}</p>
                            <p><span>更新时间：</span>{{ scope.row.ut | formatTime }}</p>
                            <p><span>课程描述：</span>{{ scope.row.description || '当前课程未添加描述'}}</p>
                        </figcaption>
                    </figure>
                </template>
            </el-table-column>
            <el-table-column type="selection" :width="formTitle.selection.width" v-if="formTitle.selection"></el-table-column>
            <el-table-column prop='id' :label='formTitle.id.label' :width='formTitle.id.width' v-if="formTitle.id" sortable align='center'></el-table-column>
            <el-table-column prop='name' :label='formTitle.name.label' :width='formTitle.name.width' v-if="formTitle.name" show-overflow-tooltip align='center'></el-table-column>
            <el-table-column prop='internalName' :label='formTitle.internalName.label' :width='formTitle.internalName.width' v-if="formTitle.internalName" show-overflow-tooltip align='center'></el-table-column>
            <el-table-column prop='content.name' :label='formTitle.contentName.label' :width='formTitle.contentName.width' v-if="formTitle.contentName" show-overflow-tooltip></el-table-column>
            <el-table-column :label='formTitle.courseType.label' :width='formTitle.courseType.width' v-if="formTitle.courseType" align='center' show-overflow-tooltip :formatter='formatCourseType'></el-table-column>
            <el-table-column prop='display' :label='formTitle.display.label' :width='formTitle.display.width' v-if="formTitle.display" align='center' :formatter='formatDisplay'></el-table-column>
            <el-table-column prop='stat' :label='formTitle.stat.label' :width='formTitle.stat.width' v-if="formTitle.stat" align='center' :formatter='formatStat'></el-table-column>
            <el-table-column prop='description' :label='formTitle.description.label' :width='formTitle.description.width' v-if="formTitle.description" show-overflow-tooltip></el-table-column>
            <el-table-column prop='code' :label='formTitle.code.label' :width='formTitle.code.width' v-if="formTitle.code" align='center'></el-table-column>
            <el-table-column prop='gender' :label='formTitle.gender.label' :width='formTitle.gender.width' v-if="formTitle.gender" :formatter='formatGender' align='center'></el-table-column>
            <el-table-column prop='age' :label='formTitle.age.label' :width='formTitle.age.width' v-if="formTitle.age" align='center'></el-table-column>
            <el-table-column prop='price' :label='formTitle.price.label' :width='formTitle.price.width' v-if="formTitle.price" align='center' :formatter='formatPrice' show-overflow-tooltip></el-table-column>
            <el-table-column prop='price' :label='formTitle.SkuPrice.label' :width='formTitle.SkuPrice.width' v-if="formTitle.SkuPrice" align='center' :formatter='formatSkuPrice' show-overflow-tooltip></el-table-column>
            <el-table-column prop='type' :label='formTitle.type.label' :width='formTitle.type.width' v-if="formTitle.type" align='center' :formatter='formatType'></el-table-column>
            <el-table-column prop='type' :label='formTitle.lessonType.label' :width='formTitle.lessonType.width' v-if="formTitle.lessonType" align='center' :formatter='formatLessonType'></el-table-column>
			<el-table-column prop='subType' :label='formTitle.merchandiseType.label' :width='formTitle.merchandiseType.width' v-if="formTitle.merchandiseType" :formatter='formatMerchandiseType' align='center'></el-table-column>
            <el-table-column prop='ver' :label='formTitle.ver.label' :width='formTitle.ver.width' v-if="formTitle.ver" align='center'></el-table-column>
            <el-table-column prop='unitId' :label='formTitle.unitId.label' :width='formTitle.unitId.width' v-if="formTitle.unitId" align='center'></el-table-column>
            <el-table-column prop='ct' :label='formTitle.ct.label' :width='formTitle.ct.width' v-if="formTitle.ct" :formatter='formatCreateTime' align='center'></el-table-column>
			<el-table-column prop='ut' :label='formTitle.ut.label' :width='formTitle.ut.width' v-if="formTitle.ut" :formatter='formatUpdateTime' align='center'></el-table-column>
            <el-table-column label='操作' :width='formTitle.button.width' v-if="formTitle.button" align='center'>
                <template scope='scope'>
                    <!-- 给用户开课 -->
                    <el-button size='small' type='success' @click='addUserCourse(scope.$index, scope.row)' v-if="formTitle.button.addUserCourse">{{ formTitle.button.addUserCourse.label }}</el-button>
                    <el-button-group v-else>
                        <!-- 编辑 -->
                        <el-button size='small' type='success' @click='handleEdit(scope.$index, scope.row)' v-if="formTitle.button.edit">{{ formTitle.button.edit.label }}</el-button>
                        <!-- 新增课节 -->
                        <el-button size='small' type='info' @click='handleAddLesson(scope.$index, scope.row)' v-if="formTitle.button.addLesson">{{ formTitle.button.addLesson.label }}</el-button>
                        <!-- 课程详情 -->
                        <el-button size='small' type='info' @click='handleDetails(scope.$index, scope.row)' v-if="formTitle.button.details">{{ formTitle.button.details.label }}</el-button>
                        <!-- 配置单元 -->
                        <el-button size='small' type='warning' @click='handleRelevanceUnit(scope.$index, scope.row)' v-if="formTitle.button.relevanceUnit">{{ formTitle.button.relevanceUnit.label }}</el-button>
                        <!-- 关联音乐课件 -->
                        <el-button size='small' type='danger' @click='handleBindMusicLesson(scope.$index, scope.row)' v-if="formTitle.button.bindMusicLesson">{{ formTitle.button.bindMusicLesson.label }}</el-button>
                        <!-- 上传头像 -->
                        <el-button size='small' type='info' @click='uploadHeader(scope.$index, scope.row)' v-if="formTitle.button.uploadHeader">{{ formTitle.button.uploadHeader.label }}</el-button>
                        <!-- 商品详情 -->
                        <el-button size='small' type='info' @click='merchandiseDetails(scope.$index, scope.row)' v-if="formTitle.button.merchandiseDetails">{{ formTitle.button.merchandiseDetails.label }}</el-button>
                        <!-- 绑定课程 -->
                        <el-button size='small' type='danger' @click='bindingCourse(scope.$index, scope.row)' v-if="formTitle.button.bindingCourse">{{ formTitle.button.bindingCourse.label }}</el-button>
                        <!-- 添加课程到赠课单元 -->
                        <el-button size='small' type='success' @click='addToGivenUnit(scope.$index, scope.row)' v-if="formTitle.button.addToUnit">{{ formTitle.button.addToUnit.label }}</el-button>
                        <!-- 复制课程 -->
                        <el-button size='small' type='warning' @click='copyLesson(scope.$index, scope.row)' v-if="formTitle.button.copyLesson">{{ formTitle.button.copyLesson.label }}</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :title="dialogFlag ? editItemTitle.formHeader.label : editItemForm.formHeader.label" v-model='editFormVisible' :close-on-click-modal='false' >
			<el-form :model="editItem" :rules="editItemRules" ref="editItem" >
                <!-- 名称 -->
                <el-form-item :label="editItemTitle.name.label" :label-width="formLabelWidth" prop="name" v-if='editItemTitle.name'>
	  		        <el-input v-model="editItem.name"  auto-complete="off" @keydown.enter.native.prevent></el-input>
	  		    </el-form-item>
                <!-- 内部名称 -->
                <el-form-item :label="editItemTitle.internalName.label" :label-width="formLabelWidth" prop="internalName" v-if='editItemTitle.internalName'>
	  		        <el-input v-model="editItem.internalName"  auto-complete="off" @keydown.enter.native.prevent></el-input>
	  		    </el-form-item>
                <!-- 观看类型 -->
				<el-form-item :label="editItemTitle.viewType.label" :label-width="formLabelWidth" prop="courseViewType" v-if='editItemTitle.viewType'>
					<el-cascader expand-trigger="hover" :options="editItemTitle.viewType.options" v-model="editItem.courseViewType"></el-cascader>
	  		    </el-form-item>
                <!-- 课程版本 -->
				<el-form-item :label="editItemTitle.course_version.label" :label-width="formLabelWidth" prop="cv" v-if='editItemTitle.course_version'>
					<el-cascader expand-trigger="hover" :options="editItemTitle.course_version.options" v-model="editItem.cv"></el-cascader>
	  		    </el-form-item>
                <!-- 课程新类型 -->
                <el-form-item :label="editItemTitle.course_levels.label" :label-width="formLabelWidth" v-if='editItemTitle.course_levels'>
                    <el-select v-model="editItem.course_levels" placeholder="请选择" multiple style="width:500px;">
                      <el-option
                        v-for="item in editItemTitle.course_levels.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
                <!-- 课表类型 -->
                <el-form-item :label="editItemTitle.choose_schedule_type.label" :label-width="formLabelWidth" v-if='editItemTitle.choose_schedule_type'>
                    <el-select v-model="editItem.choose_schedule_type" placeholder="请选择" style="width:500px;">
                      <el-option
                        v-for="item in editItemTitle.choose_schedule_type.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
                <!-- image_url -->
				<el-form-item :label="editItemTitle.image_url.label" :label-width="formLabelWidth" v-if='editItemTitle.image_url'>
				    <el-input v-model="editItem.image_url"  auto-complete="off" @keydown.enter.native.prevent placeholder='请输入图片地址'></el-input>
	  		    </el-form-item>
                <!-- 类型 -->
				<el-form-item :label="editItemTitle.type.label" :label-width="formLabelWidth" prop="type" v-if='editItemTitle.type'>
					<el-select v-model="editItem.type" placeholder="请选择">
				        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
				        </el-option>
				    </el-select>
	  		    </el-form-item>
                <!-- 子类型 -->
				<el-form-item :label="editItemTitle.subType.label" :label-width="formLabelWidth" prop="subType" v-if='editItemTitle.subType'>
					<el-select v-model="editItem.subType" placeholder="请选择">
				        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
				    </el-select>
	  		    </el-form-item>
                <!-- 建一个公共的类型 -->
				<el-form-item :label="editItemTitle.customType.label" :label-width="formLabelWidth" prop="customType" v-if='editItemTitle.customType'>
					<el-cascader expand-trigger="hover" :options="editItemTitle.customType.customOption" v-model="editItem.customType"></el-cascader>
	  		    </el-form-item>
                <!-- 课程数量 -->
                <el-form-item :label="editItemTitle.lessonNumber.label" :label-width="formLabelWidth" v-if='editItemTitle.lessonNumber'>
	  		        <el-input v-model="editItem.lessonNumber"  auto-complete="off" @keydown.enter.native.prevent></el-input>
	  		    </el-form-item>
                <!-- 价格 -->
				<el-form-item :label="editItemTitle.price.label" :label-width="formLabelWidth" prop="price" v-if='editItemTitle.price'>
	  		      <el-input v-model="editItem.price"  auto-complete="off" @keydown.enter.native.prevent><template slot="append">元</template></el-input>
	  		    </el-form-item>
                <!-- 绑定发音课 -->
				<el-form-item label="选择课程" :label-width="formLabelWidth" v-if='searchSundCourseFlag'>
					<el-select v-model="editItem.sound_id" placeholder="请输入课程关键词" style="width:240px;" filterable remote :remote-method="searchSundCourseFunc" :loading='searchSundCourseLoading'>
						<el-option
						  v-for="item in sundCourseOptions"
						  :key="item.id"
						  :label="'（' + item.id + '）' + item.name"
						  :value="item.id">
						</el-option>
					</el-select>
					<span style="margin:0 0 0 10px;">发音课课程id：{{ editItem.sound_id || '选择后自动显示' }}</span>
	  		    </el-form-item>
                <!-- 有效期限 -->
				<el-form-item :label="editItemTitle.days.label" :label-width="formLabelWidth" prop="days" v-if='SkuCardDaysFlag'>
	  		        <el-input v-model.number="editItem.days"  auto-complete="off" @keydown.enter.native.prevent><template slot="append">天</template></el-input>
	  		    </el-form-item>
                <!-- 截止日期 -->
				<el-form-item :label="editItemTitle.endTime.label" :label-width="formLabelWidth" prop="endTime" v-if='SkuCardDaysFlag'>
                    <el-date-picker
				        v-model="editItem.endTime"
                        format="yyyy-MM-dd"
				        type="date"
				        placeholder="选择激活截止日期"
				        :picker-options="endTimePickerOptions">
				    </el-date-picker>
	  		    </el-form-item>
                <!-- 状态 -->
				<el-form-item :label="editItemTitle.stat.label" :label-width="formLabelWidth" v-if='editItemTitle.stat'>
					<el-tooltip content="是否有效" placement="top">
				      <el-switch v-model="editItem.stat" on-color="#13ce66" off-color="#ff4949" on-value="1" off-value="0" on-text='是' off-text='否'>
				      </el-switch>
				    </el-tooltip>
	  		    </el-form-item>
                <!-- 售卖类型 -->
				<el-form-item :label="editItemTitle.fee.label" :label-width="formLabelWidth" prop="fee" v-if='editItemTitle.fee'>
					<el-select v-model="editItem.fee" placeholder="请选择">
				      <el-option
				        v-for="item in options"
				        :key="item.value"
				        :label="item.label"
				        :value="item.value">
				      </el-option>
				    </el-select>
	  		    </el-form-item>
                <!-- 显示 -->
				<el-form-item :label="editItemTitle.display.label" :label-width="formLabelWidth" v-if='editItemTitle.display'>
					<el-radio v-model="editItem.display" label="1">是</el-radio>
    				<el-radio v-model="editItem.display" label="0">否</el-radio>
	  		    </el-form-item>
                <!-- Code -->
				<el-form-item :label="editItemTitle.Code.label" :label-width="formLabelWidth"  prop="code"  v-if='editItemTitle.Code'>
                    <div v-show="changeCode">
                        <span style="margin-right:20px;">{{ editItem.code }}</span>
                        <el-button @click="amendCode" size='mini'>修改</el-button>
                    </div>
                    <div v-show="!changeCode">
                        <el-input v-model="editItem.code"  auto-complete="off" @keydown.enter.native.prevent style="width:30%;margin-right:20px;"></el-input>
                        <el-button @click="changeCode = true" size='mini'>取消</el-button>
                    </div>
	  		    </el-form-item>
                <!-- 年龄 -->
	  		    <el-form-item :label="editItemTitle.age.label" :label-width="formLabelWidth" v-if='editItemTitle.age'>
	  		      <el-input v-model="editItem.age"  auto-complete="off" @keydown.enter.native.prevent><template slot="append">岁</template></el-input>
	  		    </el-form-item>
                <!-- 预览图片 -->
				<div class="preview-container" v-show='editItem.lesson_poster_url'>
					<div>
						<img :src="editItem.lesson_poster_url" alt="">
					</div>
				</div>
                <!-- 封面图 -->
                <el-form-item :label="editItemTitle.lesson_poster_url.label" :label-width="formLabelWidth" prop="lesson_poster_url" v-if='editItemTitle.lesson_poster_url' style="position:relative;">
                    <!-- <el-button type="primary" @click="previewMedia(editItem.lesson_poster_url)" style="float:left;">预览</el-button> -->
                    <uploadMethods :oProp="0" :oVal="'lesson_poster_url'" v-on:child-say='assignVal' class="review-upload" :oClearForm='editFormVisible'></uploadMethods>
	  		    </el-form-item>
				<!-- 描述 -->
                <el-form-item :label="editItemTitle.description.label" :label-width="formLabelWidth" v-if='editItemTitle.description' prop="description">
				    <el-input type="textarea" v-model="editItem.description"></el-input>
	  		    </el-form-item>
                <!-- 摘要内容 -->
                <el-form-item :label="editItemTitle.summary_content.label" :label-width="formLabelWidth" v-if='editItemTitle.summary_content' prop="summary_content">
				    <el-input type="textarea" v-model="editItem.summary_content"></el-input>
	  		    </el-form-item>
                <!-- 摘要url -->
                <el-form-item :label="editItemTitle.summary_url.label" :label-width="formLabelWidth" v-if='editItemTitle.summary_url' prop="summary_url">
				    <el-input type="text" v-model="editItem.summary_url"></el-input>
	  		    </el-form-item>
                <!-- 性别 -->
                <el-form-item :label="editItemTitle.gender.label" :label-width="formLabelWidth" v-if='editItemTitle.gender'>
					<el-radio v-model="editItem.gender" label="1">男</el-radio>
					<el-radio v-model="editItem.gender" label="2">女</el-radio>
    				<el-radio v-model="editItem.gender" label="0">保密</el-radio>
	  		    </el-form-item>
                <!-- 标题 -->
	  		    <el-form-item :label="editItemTitle.title.label" :label-width="formLabelWidth" v-if='editItemTitle.title'>
	  		        <el-input v-model="editItem.content.title"  auto-complete="off" @keydown.enter.native.prevent></el-input>
	  		    </el-form-item>
				<!-- 副标题 -->
	  		    <el-form-item :label="editItemTitle.subTitle.label" :label-width="formLabelWidth" v-if='editItemTitle.subTitle'>
	  		        <el-input v-model="editItem.content.subTitle"  auto-complete="off" @keydown.enter.native.prevent></el-input>
	  		    </el-form-item>
            	<!-- SKU关联课程与集合关联普通 -->
                <el-form-item :label="goodsListTransfer ? '选择课程' : '选择 Sku'" :label-width="formLabelWidth" v-if='goodsListTransfer || SkuListTransfer'>
					<el-select v-model="searchGoods" :placeholder="goodsListTransfer ? '请输入课程关键词或ID' : '请输入商品关键词或ID'" style="width:300px;" filterable clearable remote :remote-method="searchGoodsOrSkuFunc" :loading='selectGoodsLoading'>
						<el-option
						  v-for="item in GoodsOptions"
						  :key="item"
						  :label="'（' + item.id + '）' + item.name"
						  :value="item">
						</el-option>
					</el-select>
					<el-button type="primary" icon="plus" @click='addGoodsToCard'></el-button>
	  		    </el-form-item>
				<el-form-item label="展示配置" :label-width="formLabelWidth" v-if='goodsListTransfer || SkuListTransfer'>
					<div v-if='addGoods.length'>
						<section v-for='(item, index) in addGoods' :key='index' style="display:flex;justify-content:space-between;align-items:center;">
                            <span>
								{{ item.id }} : {{ item.name }}
							</span>
							<i class="el-icon-close" @click="deleteItemInGoods(index)"></i>
						</section>
					</div>
					<div v-else>
						当前列表为空
					</div>
	  		    </el-form-item>
                <!-- 课程选择老师 -->
                <el-form-item :label="editItemTitle.selectTeacher.label" :label-width="formLabelWidth" v-if='editItemTitle.selectTeacher'>
					<el-checkbox-group v-model="checkedTeachers" style="width:80%;overflow:hidden" v-if='Teachers.length' >
					    <el-checkbox v-for="(teacher, index) in Teachers" :label="teacher.id" :key="index" style="margin:0 15px 0 0">{{ teacher.name }}</el-checkbox>
					</el-checkbox-group>
	  		    </el-form-item>
                <!-- 选择channel -->
                <el-form-item :label="editItemTitle.channel.label" prop="checkedChannels" :label-width="formLabelWidth" v-if='editItemTitle.channel'>
					<el-radio-group v-model="checkedChannels">
				        <el-radio v-for="(channel, index) in Channels" :label="channel.id" :key="index"  style="margin:10px 15px 0 0">{{ channel.name }}</el-radio>
				    </el-radio-group>
	  		    </el-form-item>
                <!-- 课程选择老师 -->
                <el-form-item :label="editItemTitle.selectTeacherInLesson.label" :label-width="formLabelWidth" v-if='editItemTitle.selectTeacherInLesson'>
                    <el-radio-group v-model="checkedTeachersInLesson" style="width:80%;overflow:hidden" v-if='Teachers.length'>
                        <el-radio v-for="(teacher, index) in Teachers" :label="teacher.id" :key="index" style="margin:5px 15px 5px 0">{{ teacher.name }}</el-radio>
                    </el-radio-group>
                    <div v-else> 当前课程无老师 </div>
	  		    </el-form-item>
                <!-- 展示配置 -->
                <el-form-item label="已选配置" :label-width="formLabelWidth" v-if='ChannelCodeSkuConfInfo.length' >
                    <el-row>
					  <el-col :span="8"><p class="channelCodeConfItem">Sku</p></el-col>
					  <el-col :span="8"><p class="channelCodeConfItem">course</p></el-col>
					  <el-col :span="8"><p class="channelCodeConfItem">planOrTime</p></el-col>
					</el-row>
					<section v-for='(item, itemIndex) in ChannelCodeSkuConfInfo' :key='itemIndex' class="ChannelCodeItem">
						<div class="skuPortion">
                            <span>【{{ item.skuId }}】{{ item.skuName }} : </span>
						</div>
						<div class="CPPortion">
							<section v-for='(tempObj, tempObjIndex) in item.cpIds' :key='tempObjIndex'>
								<el-tooltip class="item" effect="light" :content="tempObj.courseName" placement="top">
									<span class="ChannelCodeShow">[{{ tempObj.courseId }}] : {{ tempObj.courseName }}</span>
							    </el-tooltip>
								<el-tooltip class="item" effect="light" v-if="tempObj.planName" :content="tempObj.planName" placement="top">
									<span class="ChannelCodeShow" >[{{ tempObj.planId }}] : {{ tempObj.planName  }}</span>
							    </el-tooltip>
                                <span class="ChannelCodeShow" v-else>{{ tempObj.startTime | formatStartEndTime }} - {{ tempObj.endTime | formatStartEndTime }}</span>
								<i class="el-icon-close" @click='deleteChannelCodeItem(item, tempObjIndex, itemIndex)'></i>
							</section>
						</div>
					</section>
	  		    </el-form-item>
				<!-- 配置ChannelCode -->
                <el-form-item :label="editItemTitle.ChannelCodeSkuConf.label" :label-width="formLabelWidth" v-if='editItemTitle.ChannelCodeSkuConf'>
					<!-- <i class="el-icon-arrow-left"></i> -->
					<section class="checkedCodeConf">
						<el-select v-model="selectSpu" placeholder="请输入Spu关键词或ID " style="margin:0 15px 10px 0" filterable clearable remote :remote-method="selectSpuRemoteMethod" @change='checkedSpuInCode' :loading='selectSpuLoading'>
						    <el-option
						      v-for="item in SpuOptions"
						      :key="item.id"
						      :label="'（' + item.id + '）' + item.name"
						      :value="item.id">
						    </el-option>
						</el-select>
						<el-select v-model="selectSku" placeholder="请选择Sku" style="margin:0 15px 10px 0" :loading='selectSkuLoading' @change='checkedSkuInCode'>
						    <el-option
						      v-for="item in SkuOptions"
						      :key="item.id"
						      :label="'（' + item.id + '）' + item.name"
						      :value="item">
						    </el-option>
						</el-select>
						<el-select v-model="selectCourse" placeholder="请选择Course" style="margin:0 15px 10px 0" :loading='selectCourseLoading' @change='checkedCourseInCode'>
						    <el-option
						      v-for="item in CourseInSkuOptions"
						      :key="item.id"
						      :label="'（' + item.id + '）' + item.name"
						      :value="item">
						    </el-option>
						</el-select>
						<el-select v-if="selectCourse.type == 1" v-model="selectPlan" placeholder="请输入Plan关键词或ID" style="margin:0 15px 10px 0" filterable clearable remote :remote-method="selectPlanRemoteMethod" :loading='selectPlanLoading'>
						    <el-option
						      v-for="item in PlanOptions"
						      :key="item.id"
						      :label="'（' + item.id + '）' + item.name"
						      :value="item">
						    </el-option>
						</el-select>
                        <el-date-picker
                              v-model="channelValidityTime"
                              type="daterange"
                              placeholder="选择日期范围"
                              style="margin:0 15px 10px 0"
                              v-if="selectCourse.type == 2"
                              @change="selecCodeTime">
                        </el-date-picker>
                        <el-button type="primary" icon='check' :plain="true" @click='affirmChannelCodeSkuConfInfo'></el-button>
					</section>
					<!-- <i class="el-icon-arrow-right"></i> -->
	  		    </el-form-item>
  		  </el-form>
  		  <div slot="footer" class="dialog-footer">
  		    <el-button @click="editFormVisible = false">取 消</el-button>
  		    <el-button type="primary" @click="editFormConfirm('editItem')" :plain="true">确 定</el-button>
  		  </div>
        </el-dialog>

        <!-- 给app用户开课的时候更新课程 -->
        <el-dialog title='更新课程' v-model='dateFormVisible' :close-on-click-modal='false'>
            <el-form :model='dateForm' label-width='100px'>
                <el-form-item label='有效期选择'>
                    <el-date-picker v-model="validPeriod" type="daterange" placeholder="选择日期范围"></el-date-picker>
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
              <el-form-item label="开课原因" required>
                <el-radio-group v-model="dateForm.record_reason_type" v-for="(reason,index) in reasonOpen">
                  <el-radio class="radio" :label="index" style="width: 100px">{{reason.name}}</el-radio>
                </el-radio-group>
              </el-form-item>
                <el-form-item label="记录备注" prop="name">
                    <el-input v-model="dateForm.record_remark"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
				<el-button @click.native="dateFormVisible=false">取消</el-button>
				<el-button type="primary" @click.native="dataSubmit" :loading="dataLoading">提交</el-button>
			</div>
        </el-dialog>

        <!-- 音乐课件 -->
        <el-dialog title='关联音乐课件' v-model='musicBindVisible' :close-on-click-modal='false'>
            <el-form label-width="100px">
              <!-- 我是搜索框框 -->
              <el-form-item label="搜索课件">
                <el-select v-model="musicLessonObj" placeholder="请输入音乐课id" style="width:300px;" filterable clearable remote :remote-method="searchMusicLesson">
                    <el-option
                        v-for="item in musicLessons"
                        :key="item.entity.id"
                        :label="'（' + item.entity.id + '）' + item.entity.name"
                        :value="JSON.stringify(item)">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="plus" @click='addMusicLessonToCourse'></el-button>
               </el-form-item>
              <el-form-item label="展示关联课件">
                <div v-if='courseBindMusicLesson && courseBindMusicLesson.length'>
                    <draggable draggable :list="courseBindMusicLesson">
                      <section v-for='(item, index) in courseBindMusicLesson' :key='index' style="display:flex;justify-content:space-between;align-items:center;">
                    <span>
                      {{ item.entity.id }} : {{ item.entity.name }}
                    </span>
                    <i class="el-icon-close" @click="delMusicFormCourse(index)"></i>
                  </section>
                    </draggable>
                </div>
                <div v-else>
                  当前列表为空
                </div>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="musicBindVisible = false">取 消</el-button>
              <el-button type="primary" @click="updateBindMusicLesson" :plain="true">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 图片预览 -->
        <el-dialog :visible.sync="postUrlPreviewIsShow" :close-on-click-modal='false'>
            <img :src="editItem.lesson_poster_url" alt="" style="width:300px;height:300px;">
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="postUrlPreviewIsShow = false">关闭</el-button>
            </div>
        </el-dialog>
    </section>
</template>



<script>
import util from '../common/js/util'
import draggable from 'vuedraggable'
import uploadMethods from './word-sentence-library/uploadMethods'

import {
	getSkuList,
	getCourseList,
	getTeacherList,
	getTeacherListInCourse,
	getChannelList,
	getSpuList,
	getPlanList,
	// 确认开通app用户课程
	addAppCourse,


	// 绑定音乐课件
	bindMusicLesson,
	getMusicLesson,
	// 获取所有课程列表
	getLessonList,

	//获取开课关课原因
	getPublicKvList

} from '../api/api';

export default {
	props: ['formData', 'formTitle', 'editItemForm', 'newSkuAbout'],
	components: {
		draggable,
		uploadMethods
	},
	data() {
		return {
			editFormVisible: false, // 编辑界面是否显示
			formLabelWidth: '100px', // 编辑编辑页面的宽度
			listLoading: false,
			filters: {
				name: ''
			},
			// 新增 编辑 板块的显示判断
			editItemTitle: '',
			//编辑板块的判断
			dialogFlag: false,

			dialogItemFlag: 1,
			//列表选中项
			editItem: {},
			editItemRules: {
				//新增页面的表单验证
				name: [{
						required: true,
						message: '请输入名称',
						trigger: 'blur'
					},
					// {
					// 	min: 1,
					// 	max: 64,
					// 	message: '长度在 1 到 64 个字符',
					// 	trigger: 'blur'
					// }
				],
				internalName: [{
						required: true,
						message: '请输入内部名称',
						trigger: 'blur'
					},
					{
						min: 1,
						max: 64,
						message: '长度在 1 到 64 个字符',
						trigger: 'blur'
					}
				],
				type: [{
					required: true,
					message: '请选择模块类型',
					trigger: 'change'
				}],
				courseViewType: [{
					required: true,
					type: 'array',
					message: '请选择观看类型',
					trigger: 'change'
				}],
				cv: [{
					required: true,
					message: '请选择课程版本',
					trigger: 'change',
					type: 'array'
				}],
				customType: [{
					required: true,
					type: 'array',
					message: '请选择模块类型',
					trigger: 'change'
				}],
				fee: [{
					required: true,
					message: '请选择售卖类型',
					trigger: 'change'
				}],
				days: [{
					required: true,
					type: 'number',
					message: '请选择有效期限',
					trigger: 'blur'
				}],
				endTime: [{
					required: true,
					type: 'object',
					message: '请选择截止期限',
					trigger: 'blur'
				}],
				code: [{
						required: true,
						message: '请输入Code码',
						trigger: 'blur'
					},
					{
						min: 10,
						max: 10,
						message: '长度为 10 个字符',
						trigger: 'blur'
					}
				],
			},
			endTimePickerOptions: {
				shortcuts: [{
					text: '今天',
					onClick(picker) {
						picker.$emit('pick', new Date());
					}
				}]
			},
			options: [ // 课程能选择的类型
				{
					value: '1',
					label: '免费'
				},
				{
					value: '2',
					label: '收费'
				},
				{
					value: '3',
					label: '限时免费'
				}
			],
			// 是否修改的判断依据
			changeCode: true,
			// 以下为 穿梭框 相关的数据
			searchGoods: '',
			selectGoodsLoading: false,
			GoodsOptions: [],
			addGoods: [], // 添加到右边绑定的数据
			goodsListTransfer: false, // 绑定课程是否显示的判定
			SkuListTransfer: false, // 绑定Sku是否显示的判定
			SkuCardDaysFlag: false,
			// 绑定发音课
			sundCourseOptions: [],
			searchSundCourseFlag: false,
			searchSundCourseLoading: false,

			// 选择老师
			checkedTeachers: [],
			Teachers: [],
			// 给 lesson 添加老师
			checkedTeachersInLesson: '',

			// 添加渠道相关
			checkedChannels: 0,
			Channels: [],

			// ChannelCode相关
			ChannelCodeSkuConfShow: false,
			ChannelCodeSkuConfInfo: [],
			// 选择框 -> Spu
			SpuOptions: [],
			selectSpu: '',
			selectSpuLoading: false,

			// 选择框 -> Sku
			SkuOptions: [],
			selectSku: '',
			selectSkuLoading: false,

			// 选择框 -> Course
			CourseInSkuOptions: [],
			selectCourse: '',
			selectCourseLoading: false,

			// 选择框 -> Plan
			PlanOptions: [],
			selectPlan: '',
			selectPlanLoading: false,

			// 选择框 -> 有效期限
			channelValidityTime: '',
			startTime: 0,
			endTime: 0,

			// 选择有效期
			dateFormVisible: false, //新增界面是否显示
			dataLoading: false, //新增界面是否显示加载
			dateForm: {}, //新增界面表单数据类型
			// 有效期选择 数组中[0]开始时间[1]结束时间
			validPeriod: [],


			// 音乐课相关
			musicLessons: [],
			musicBindVisible: false,
			musicLessonObj: '',
			courseBindMusicLesson: [],
			musicBindCourseId: '',
			//开课原因
			reasonOpen: [],
			postUrlPreviewIsShow: false,
		}
	},
	methods: {
		// 改(编辑界面)
		handleEdit(index, row) {
			this.editItem = JSON.parse(JSON.stringify(row)); // 进行一个简单的拷贝
			this.editItem['display'] += '';
			this.editItem['type'] += '';
			this.editItem['stat'] += '';
			this.editItem['fee'] += '';
			this.editItem['gender'] += '';
			this.editItem['courseViewType'] = [];
			this.editItem['cv'] = [];
			this.$set(this.editItem, 'course_levels', this.editItem.level ? this.editItem.level.split(',') : []);
			if (this.editItem.conf) {
				this.$set(this.editItem, 'choose_schedule_type', this.editItem.conf.chooseScheduleType ? this.editItem.conf.chooseScheduleType : 0);
			}
			if (row.conf && row.conf.courseViewType !== null && row.conf.courseViewType !== undefined) {
				this.editItem['courseViewType'][0] = row.conf.courseViewType + ''
			}
			if (row.conf && row.conf.cv !== null && row.conf.cv !== undefined) {
				this.editItem['cv'][0] = row.conf.cv + ''
			}
			if (row.summary) {
				this.editItem['summary_content'] = row.summary.content;
				this.editItem['summary_url'] = row.summary.url;
			}
			if (row.parsed) {
				this.$set(this.editItem, 'lesson_poster_url', row.parsed.lessonPosterUrl)
				// this.editItem['lesson_poster_url'] = row.parsed.lessonPosterUrl
			}
			this.editItemTitle = this.editItemForm // 编辑的时候 判断为父组件传值
			this.editItem.sound_id = ''
			this.dialogFlag = false;
			this.dialogItemFlag = 1;
			this.editFormVisible = true;
			if (this.editItemTitle.searchSundCourse && row.type == '1' && row.subType == 1) {
				this.searchSundCourseFlag = true;
				this.editItem.sound_id = row.conf.soundId;
			} else {
				this.searchSundCourseFlag = false;
			}

			if (this.formTitle.relevance) {
				if (this.formTitle.relevance.type == 'Sku') {
					if (row.type == 0) {
						if (this.formTitle.relevance.name == 'Course') {
							this.goodsListTransfer = true;
						};
					}
					if (row.type == 1) {
						this.SkuListTransfer = true;
					}
				}
			};
			if (this.editItemTitle.days) {
				if (row.type == '0') {
					this.SkuCardDaysFlag = true;
					this.editItem['days'] = row.conf.days;
					this.$set(this.editItem, 'endTime', row.conf.endTime ? util.formatDate.format(new Date(row.conf.endTime), "yyyy-MM-dd") : "")
				} else {
					this.SkuCardDaysFlag = false;
				}
			};
			if (this.editItemTitle.selectTeacher) {
				// 调用 加载列表的接口
				getTeacherList('').then((res) => {
					if (res.data.success) {
						if (res.data.data.items) {
							this.Teachers = res.data.data.items;
							if (row.conf) {
								if (row.conf.teacherIds) {
									this.checkedTeachers = row.conf.teacherIds //将 已选择的老师 打钩 确认
								}
							}
						}
					} else {
						this.$notify.error(res.data.msg);
					}
				});
			};
			if (this.editItemTitle.selectTeacherInLesson) {
				this.editItem['customType'] = [];
				this.editItem['customType'][0] = row.type + '';
				this.$set(this.editItemRules, "description", [{
					required: true,
					message: '请输入课节描述',
					trigger: 'blur'
				}]);
				// 调用 加载列表的接口
				let parameter = {
					course_id: row.courseId
				}
				// 调用 加载列表的接口
				getTeacherListInCourse(parameter).then((res) => {
					this.Teachers = [];
					res.data.data.forEach((item) => {
						this.Teachers.push(item.entity);
					});
					if (row.parsed.teachers) {
						this.checkedTeachersInLesson = row.parsed.teachers[0].id
					}
				});
			};
			if (this.editItemTitle.image_url) {
				if (row.conf) {
					if (row.conf.image) {
						this.editItem.image_url = row.conf.image.iconUrl;
					}
				}
			};
			if (this.formTitle.SkuPrice) {
				let price = '';
				price = Number(row.price / 100).toFixed(2);
				this.editItem.price = price;
			};
			if (this.editItemTitle.channel) {
				// 调用 加载列表的接口
				getChannelList('').then((res) => {
					if (res.data.success) {
						if (res.data.data.items) {
							this.Channels = res.data.data.items;
							this.checkedChannels = row.channelId;
						}
					} else {
						this.$notify.error(res.data.msg);
					}
				});
			};
			if (this.editItemTitle.ChannelCodeSkuConf && row.conf) {
				this.ChannelCodeSkuConfInfo = row.conf.channelCodeSkuConfs;
			};
			if (this.editItemTitle.internalName && this.editItemTitle.internalName.rule) {
				this.editItemRules.internalName = this.editItemTitle.internalName.rule
			};
			if (this.goodsListTransfer) {
				this.addGoods = row.courseEntities;
			};
			if (this.SkuListTransfer) {
				this.addGoods = row.skuEntities.map((item) => {
					let tempObj = {
						id: item.id,
						name: item.name,
					}
					return tempObj
				})
			};
		},
		searchSundCourseFunc(query) {
			if (query !== '') {
				let temp = Number(query);
				let parameter = {};
				if (temp) {
					parameter = {
						id: temp,
						type: 1,
						sub_type: 2,
					};
				} else {
					parameter = {
						name: query,
						type: 1,
						sub_type: 2,
					};
				};
				this.searchSundCourseLoading = true;
				getCourseList(parameter).then((res) => {
					if (res.data.success) {
						this.sundCourseOptions = res.data.data.items.map((item) => {
							let tempObj = {
								id: item.entity.id,
								name: item.entity.name,
							}
							return tempObj
						});
					} else {
						this.$notify.error(res.data.msg);
					}
					this.searchSundCourseLoading = false;
				});
			} else {
				this.sundCourseOptions = [];
			}
		},
		// 配置单元的跳转
		handleRelevanceUnit(index, row) {
			this.$router.push({
				name: '配置单元',
				params: {
					courseId: row.id
				}
			})
		},
		/**
		 * 过渡使用
		 */
		// 配置课程的音乐课
		handleBindMusicLesson(index, item) {
			this.musicLessonObj = '';
			this.musicBindVisible = true;
			this.musicBindCourseId = ''
			this.musicBindCourseId = item.id;
			let para = {
				course_id: item.id
			}
			getMusicLesson(para).then(res => {
					if (res.data.success) {
						this.courseBindMusicLesson = res.data.data;
					} else {
						this.$notify({
							title: '失败',
							message: res.data.msg,
							type: 'error'
						})
					}
				})
				.catch(err => {
					this._catch(err)
				})
		},
		// 上传图片
		assignVal(val) {
			this.$set(this.editItem, 'lesson_poster_url', val.url)
		},
		// 预览图片
		previewMedia(val) {
			if (val != '') {
				this.postUrlPreviewIsShow = true;
			} else {
				this.editItem.lesson_poster_url = ''
				this.$notify({
					title: '预览失败',
					message: '没有配置相应的图片',
					type: 'error'
				})
			}
		},
		// 新增课节
		handleAddLesson(index, row) {
			this.editItemTitle = {
				formHeader: {
					label: '新增课节'
				},
				name: {
					label: '课节标题',
					width: ''
				},
				lesson_poster_url: {
					label: '课节封面',
					width: ''
				},
				internalName: {
					label: '内部名称',
					width: ''
				},
				customType: {
					label: '课节类型',
					width: '',
					customOption: [ // 课程能选择的类型
						{
							value: '0',
							label: '主课'
						},
						{
							value: '1',
							label: '赠课'
						},
						{
							value: '2',
							label: '复习课'
						}
					],
				},
				description: {
					label: '课节描述',
					width: ''
				},
				summary_content: {
					label: '摘要内容',
					width: ''
				},
				summary_url: {
					label: '摘要url',
					width: ''
				},
				selectTeacherInLesson: {
					label: '选择老师',
					width: ''
				},
				display: {
					label: '是否显示',
					width: ''
				},
				stat: {
					label: '课节状态',
					width: ''
				}
			};
			this.$set(this.editItemRules, "description", [{
				required: true,
				message: '请输入课节描述',
				trigger: 'blur'
			}]);
			this.$set(this.editItemRules, "internalName", [{
					required: true,
					message: '请输入内部名称',
					trigger: 'blur'
				},
				{
					min: 1,
					max: 100,
					message: '长度在 3 到 20 个字符',
					trigger: 'blur'
				}
			])
			this.dialogFlag = true; // 判断为新增
			this.dialogItemFlag = 3;
			this.editItem = {
				course_id: row.id,
				name: '',
				stat: '1',
				display: '1',
				customType: ['0'],
				internalName: '',
				description: '',
				teacherids: '',
				summary_content: '',
				summary_url: '',
				lesson_poster_url: ''
			} // 清空 表单
			if (row.conf) {
				if (this.editItemTitle.selectTeacherInLesson) {
					if (row.conf.teacherIds) {
						let parameter = {
							course_id: row.id
						}
						// 调用 加载列表的接口
						getTeacherListInCourse(parameter).then((res) => {
							this.Teachers = [];
							res.data.data.forEach((item) => {
								this.Teachers.push(item.entity);
							})
						});
					}
				}
			}
			this.editFormVisible = true; // 显示 弹窗
		},
		// 上传头像
		uploadHeader(index, row) {
			this.$emit('uploadHeaderPic', row)
		},
		// 详情页面 的跳转
		handleDetails(index, row) {
			this.$router.push({
				name: '课节详情',
				params: {
					lessonId: row.id
				}
			})
		},
		// 商品详情
		merchandiseDetails(index, row) {
			this.$emit('emitMerchandiseDetails', row)
		},
		// 绑定数据
		bindingCourse(index, row) {
			this.$emit('emitBindingCourse', row)
		},
		// 编辑页面的 确定键 的监听
		editFormConfirm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					if (this.goodsListTransfer || this.SkuListTransfer) {
						this.editItem['goodsList'] = this.addGoods;
					}
					if (this.editItemTitle.selectTeacher) {
						this.editItem['teacherids'] = '';
						this.checkedTeachers.forEach((item) => {
							this.editItem['teacherids'] += item + ',';
						})
					}
					if (this.editItemTitle.selectTeacherInLesson) {
						this.editItem['teacherids'] = this.checkedTeachersInLesson;
					}
					if (this.editItemTitle.ChannelCodeSkuConf) {
						this.editItem['channelCodeSkuConf'] = this.ChannelCodeSkuConfInfo;
					}
					if (this.editItemTitle.channel) {
						this.editItem['channelId'] = this.checkedChannels;
					}
					if (this.SkuCardDaysFlag) {
						try {
							this.editItem.endTime = util.formatDate.format(this.editItem.endTime, 'yyyy-MM-dd');
						} catch (e) {
							console.log(e);
						} finally {

						};
					}
					this.$emit('submitEdit', this[formName], this.dialogItemFlag);
					this.editFormVisible = false;
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		// 穿梭框 搜索框的搜索方法
		searchGoodsOrSkuFunc(query) {
			if (query !== '') {
				this.selectCourseLoading = true;
				if (this.goodsListTransfer) {
					let temp = Number(query);
					let parameter = {};
					if (temp) {
						parameter = {
							id: temp,
						};
					} else {
						parameter = {
							name: query,
						};
					};
					// 调用 加载列表的接口
					getCourseList(parameter).then((res) => {
						if (res.data.success) {
							if (res.data.data.items) {
								this.GoodsOptions = res.data.data.items.map((item) => {
									let tempObj = {
										id: item.entity.id,
										name: item.entity.name
									};
									return tempObj;
								});
							} else {
								this.$notify.error(res.data.msg);
							};
							this.selectCourseLoading = true;
						} else {
							this.GoodsOptions = [];
						};
					});
					return
				}
				if (this.SkuListTransfer) {
					let temp = Number(query);
					let parameter = {};
					if (temp) {
						parameter = {
							spu_id: this.editItemTitle.bindingSuite.spu_id,
							type: 0,
							id: temp,
						};
					} else {
						parameter = {
							spu_id: this.editItemTitle.bindingSuite.spu_id,
							name: query,
							type: 0,
						};
					};
					getSkuList(parameter).then((res) => {
						if (res.data.success) {
							if (res.data.data.items) {
								this.GoodsOptions = res.data.data.items.map((item) => {
									let tempObj = {
										id: item.entity.id,
										name: item.entity.name
									};
									return tempObj;
								});
							} else {
								this.$notify.error(res.data.msg);
							};
							this.selectCourseLoading = true;
						} else {
							this.GoodsOptions = [];
						};
					});
					return
				}
			};
		},
		addGoodsToCard() {
			if (this.searchGoods !== '') {
				if (this.addGoods.length) {
					for (var i = 0; i < this.addGoods.length; i++) {
						if (this.addGoods[i].id == this.searchGoods.id) {
							this.$message.error('抱歉，此选项已存在。请重新选择');
							return;
						}
					}
				}
				this.addGoods.push(this.searchGoods);
				this.searchGoods = '';
				this.GoodsOptions = [];
			} else {
				this.$message.error('抱歉，选项为空无法添加');
			}
		},
		deleteItemInGoods(index) {
			this.$delete(this.addGoods, index);
		},
		// addToGivenUnit
		addToGivenUnit(row, index) {
			this.$emit('makeSureAddToGivenUnit', row, index)
		},
		// 复制课程
		copyLesson(index, row) {
			this.$emit('copyLessonToCourse', index, row)
		},
		handleSelectionChange(sels) {
			this.$emit('returnSels', sels)
		},
		// 来自APPCourse的跳转 确认开通课程
		addUserCourse(index, row) {
			this.dateFormVisible = true;
			//获取开课原因
			this.initType();
			this.dateForm = {
				course_id: row.id,
				status: 1,
				user_id: this.$route.query.user_id,
				record_user_type: 0,
				record_reason_type: 0,
				record_remark: ''
			}
		},
		// 修改 Code 确认
		amendCode() {
			this.$confirm('此项为重要信息，是否确认修改？', '提示', {
					type: 'warning'
				})
				.then(() => {
					this.changeCode = false;
				})
				.catch(() => {
					this.$message({
						title: '提示',
						message: '取消操作',
						type: 'info'
					})
				})
		},
		// 提交
		dataSubmit() {
			// 判断有效期是否为空
			if (this.validPeriod === undefined || this.validPeriod[0] === null || this.validPeriod[1] === null) {
				this.$notify({
					title: '错误',
					message: '有效期不能为空',
					type: 'error'
				})
				return false;
			}
			this.$confirm('确认提交吗？', '提示', {
					type: 'warning'
				})
				.then(() => {
					this.addLoading = true;
					let para = {
						course_id: this.dateForm['course_id'],
						user_id: this.formTitle.button.addUserCourse.user_id,
						status: 1,
						record_reason_type: this.dateForm.record_reason_type,
						record_user_type: this.dateForm.record_user_type,
						record_remark: this.dateForm.record_remark
					};
					try {
						para['start_time'] = util.formatDate.format(this.validPeriod[0], 'yyyy-MM-dd');
						para['end_time'] = util.formatDate.format(this.validPeriod[1], 'yyyy-MM-dd');
					} catch (e) {
						console.log(e);
					} finally {

					}
					addAppCourse(para).then((res) => {
						if (res.data.success) {
							this.$notify({
								title: '成功',
								message: '开课成功',
								type: 'success',
								duration: '1000'
							});
							this.dateFormVisible = false;
						} else {
							this.$notify({
								title: '错误',
								message: res.data.msg,
								type: 'error'
							})
						}
						this.addLoading = false;
						this.validPeriod = [];
					})
				})
		},

		// channelCode 相关的方法
		// 搜索 Spu 列表
		selectSpuRemoteMethod(query) {
			if (query !== '') {
				this.selectSpuLoading = true;
				let temp = Number(query);
				let parameter = {};
				if (temp) {
					parameter = {
						id: temp,
						type: 0
					};
				} else {
					parameter = {
						name: query,
						type: 0
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
					} else {
						this.$notify.error(res.data.msg);
					}
					this.selectSpuLoading = false;
				});
			} else {
				this.SpuOptions = [];
			}
		},
		// 选择Spu 之后 加载Sku列表
		checkedSpuInCode(value) {
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
					} else {
						this.$notify.error(res.data.msg);
					}
					this.selectSkuLoading = false;
				});
			} else {
				this.selsctSpu = '';
				this.SpuOptions = [];
				this.selectSku = '';
				this.SkuOptions = [];
				this.selectCourse = '';
				this.CourseInSkuOptions = [];
				this.selectPlan = '';
				this.PlanOptions = [];
			}
		},
		// 选择Sku之后加载Course列表
		checkedSkuInCode(value) {
			if (value !== '') {
				this.CourseInSkuOptions
				value.courseEntities.forEach((item, index) => {
					if (item) {
						this.$set(this.CourseInSkuOptions, index, item)
					}
				});
			} else {
				this.selectCourse = '';
				this.CourseInSkuOptions = [];
			}
		},
		checkedCourseInCode(value) {
			this.selectPlan = []
			if (value && value !== '') {
				let params = {
					course_id: value.id
				}
				getPlanList(params).then((res) => {
					if (res.data.success) {
						this.PlanOptions = res.data.data.items.map((item) => {
							let tempObj = {
								id: item.entity.id,
								name: item.entity.name,
							}
							return tempObj
						});
					} else {
						this.$notify.error(res.data.msg);
					}
					this.selectPlanLoading = false;
				});
			}
		},
		// 按照 name 或ID 查询 Plan
		selectPlanRemoteMethod(query) {
			if (query !== '') {
				this.selectPlanLoading = true;
				let temp = Number(query);
				let parameter = {};
				if (temp) {
					parameter = {
						id: temp,
					};
				} else {
					parameter = {
						plan_name: query,
					};
				};
				// 调用 加载列表的接口
				getPlanList(parameter).then((res) => {
					if (res.data.success) {
						this.PlanOptions = res.data.data.items.map((item) => {
							let tempObj = {
								id: item.entity.id,
								name: item.entity.name,
							}
							return tempObj
						});
					} else {
						this.$notify.error(res.data.msg);
					}
					this.selectPlanLoading = false;
				});
			} else {
				this.PlanOptions = [];
			}
		},
		selecCodeTime(value) {
			this.startTime = util.formatDate.parse(value.substring(0, 10), 'yyyy-MM-dd').getTime();
			this.endTime = util.formatDate.parse(value.substring(13, 23), 'yyyy-MM-dd').getTime();
		},
		// 点击对号之后添加channelCode item 的方法
		affirmChannelCodeSkuConfInfo() {
			/*
				判断如果 sku_id 存在于 之前添加的conf里。则不单独创建 sku 组合。不存在得单独存在（for 第一次）
				如果存在 则进入 skuEntity 下的 CPEntity 寻找是否存在 同 id 的course。不存在则新建。存在则 判断 plan 是否一样。不一样则新建。一样则抛出异常。
			*/
			if (!(this.selectSku && this.selectCourse && (this.selectPlan || this.channelValidityTime))) {
				this.$message.error('有空白选项，无法添加');
				return;
			}
			let conf = this.ChannelCodeSkuConfInfo;
			for (let i = 0; i < conf.length; i++) {
				let item = conf[i].cpIds;
				for (let j = 0; j < item.length; j++) {
					if (this.selectCourse.id == item[j].courseId) {
						this.$message.error('该课程已经存在');
						return
					};
					if (this.selectPlan.id !== null && this.selectPlan.id !== undefined && this.selectPlan.id !== '') {
						if (this.selectPlan.id == item[j].planId) {
							this.$message.error('该计划已经存在');
							return
						}
					}
				};
				if (this.selectSku.id == conf[i].skuId) {
					let tempObj = {
						courseId: this.selectCourse.id,
						courseName: this.selectCourse.name,
						planId: this.selectPlan.id,
						planName: this.selectPlan.name,
						startTime: this.startTime,
						endTime: this.endTime,
					};
					item.push(tempObj);
					this.selectCourse = '';
					this.selectPlan = '';
					this.PlanOptions = [];
					return;
				};
			};
			let entity = {
				skuId: this.selectSku.id,
				skuName: this.selectSku.name,
				cpIds: [{
					courseId: this.selectCourse.id,
					courseName: this.selectCourse.name,
					planId: this.selectPlan.id,
					planName: this.selectPlan.name,
					startTime: this.startTime,
					endTime: this.endTime,
				}]
			}
			this.ChannelCodeSkuConfInfo.push(entity);
			this.selectCourse = '';
			this.selectPlan = '';
			this.PlanOptions = [];
			this.channelValidityTime = '';
			this.startTime = '';
			this.endTime = '';
		},
		// 点击 channelCode item后面的删除 按钮的方法
		deleteChannelCodeItem(item, codeIndex, confIndex) {
			this.$delete(item.cpIds, codeIndex);
			if (!item.cpIds.length) {
				this.$delete(this.ChannelCodeSkuConfInfo, confIndex);
			};
		},
		// 格式化内容
		// 修改时间
		formatCreateTime(row) {
			if (row.ct === 0) {
				return '/'
			}
			return util.formatDate.format(new Date(row.ct), 'yyyy/MM/dd   hh:mm:ss');
		},
		formatUpdateTime(row) {
			if (row.ut === 0) {
				return '/'
			}
			return util.formatDate.format(new Date(row.ut), 'yyyy/MM/dd   hh:mm:ss');
		},
		// 性别 格式化内容
		formatGender(row) {
			switch (row.gender) {
				case 1:
					return '男';
					break;
				case 2:
					return '女';
					break;
				default:
					return '保密';
			}
		},
		// spu 类型 格式化内容
		formatMerchandiseType(row) {
			return row.type == 0 ? 'Course' : 'Card'
		},
		// 价格 格式化内容
		formatPrice(value) {
			var html, _val;
			value = Number(value).toFixed(2);
			if (value == 0) {
				value = 0;
				return html = "￥<span>0</span>";
			} else if (value.split('.')[1].substring(1) == 0) {
				value = Number(value).toFixed(1);
			}
			_val = value.split('.');
			return html = '￥<span>' + _val[0] + '</span><em>.' + _val[1] + '</em>';
		},
		formatSkuPrice(row) {
			// return row.price
			return Number(row.price / 100).toFixed(2);
		},
		formatType(row) {
			// 如果绑定集合存在。修改 类型的 显示内容
			if (this.editItemForm.bindingSuite) {
				return row.type == '1' ? '集合' : '普通'
			};
			if (this.formTitle.customExpand && this.formTitle.customExpand.type && this.formTitle.customExpand.type.label == "渠道类型") {
				return row.type == '1' ? '线下' : '线上'
			};
			return row.type
		},
		formatLessonType(row) {
			switch (row.type) {
				case 0:
					return '主课';
					break;
				case 1:
					return '赠课';
					break;
				case 2:
					return '复习课';
					break;
				case '0':
					return '主课';
					break;
				case '1':
					return '赠课';
					break;
				case '2':
					return '复习课';
					break;
				default:
					return '未知';
			}
		},
		formatCourseType(row) {
			let result = '';
			let base = '';
			if (row.type == 1) {
				base = '体系课';
				switch (row.subType) {
					case 1:
						result = '精品课';
						break;
					case 2:
						result = '发音课';
						break;
					case 3:
						result = '体验课';
						break;
					case 4:
						result = '自然拼读课';
						break;
					case 5:
						result = '线上练习册';
						break;
				}
			} else if (row.type == 2) {
				base = '单项课';
				switch (row.subType) {
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
			return base + ' -> ' + result;
		},
		// 格式化 显示
		formatDisplay(row) {
			return row.display == '0' ? '否' : '是'
		},
		// 格式化 状态
		formatStat(row) {
			return row.stat == '0' ? '无效' : '有效'
		},


		/**
		 * 音乐课过渡相关
		 */
		// 查询课节列表
		searchMusicLesson(query) {
			let temp = Number(query);
			let parameter = {};
			if (temp) {
				parameter = {
					id: temp,
				};
			} else {
				parameter = {
					name: query,
				};
			};
			getLessonList(parameter).then(res => {
					if (res.data.success) {
						this.musicLessons = res.data.data.items;
					} else {
						this.$notify({
							title: '失败',
							message: res.data.msg,
							type: 'error'
						})
					}
				})
				.catch(err => {
					this._catch(err);
				})
		},
		// 绑定lesson to course
		addMusicLessonToCourse() {
			if (this.musicLessonObj != '') {
				this.courseBindMusicLesson.push(JSON.parse(this.musicLessonObj));
				this.musicLessonObj = '';
			}
		},
		// 删除lesson from course
		delMusicFormCourse(index) {
			this.courseBindMusicLesson.splice(index, 1);
		},
		updateBindMusicLesson() {
			let lessonIdArr = [];
			if (this.courseBindMusicLesson) {
				this.courseBindMusicLesson.map((item, index) => {
					lessonIdArr.push(item.entity.id)
				})
			}
			let para = {
				course_id: this.musicBindCourseId,
				lesson_ids: lessonIdArr.join(',')
			}
			bindMusicLesson(para).then(res => {
					if (res.data.success) {
						this.$notify({
							title: '成功',
							message: '更新绑定成功',
							type: 'success'
						})
					} else {
						this.$notify({
							title: '失败',
							message: res.data.msg,
							type: 'error'
						})
					}
					this.musicBindVisible = false;
				})
				.catch(err => {
					this._catch(err)
				})
		},
		_catch(error) {
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
					} else {
						this.$notify({
							title: "错误",
							type: "error",
							message: res.data.msg
						});
					}
				})
				.catch(err => {
					this._catch(err)
				})
		},
	},

	filters: {
		// 关于时间转换的俩东西
		formatTime(date) {
			if (date === undefined) {
				return
			}
			if (date === 0) {
				return '/'
			}
			return util.formatDate.format(new Date(date), 'yyyy/MM/dd   hh:mm:ss');
		},
		formatDisplay(row) {
			return row == '0' ? '否' : '是'
		},
		// 格式化 状态
		formatStat(row) {
			return row == '1' ? '有效' : '无效'
		},
		formatType(row, formTitle) {
			// 如果绑定集合存在。修改 类型的 显示内容
			if (formTitle.customExpand && formTitle.customExpand.type && formTitle.customExpand.type.label == "渠道类型") {
				return row.type == '1' ? '线下' : '线上'
			};
			return row.type;
		},
		formatGender(row) {
			switch (row) {
				case 1:
					return '男';
					break;
				case 2:
					return '女';
					break;
				default:
					return '保密';
			}
		},
		formatPrice(value) {
			return value.toFixed(2)
		},
		formatCourseType(row) {
			let result = '';
			let base = '';
			if (row.type == 1) {
				base = '体系课';
				switch (row.subType) {
					case 1:
						result = '精品课';
						break;
					case 2:
						result = '发音课';
						break;
					case 3:
						result = '体验课';
						break;
					case 4:
						result = '自然拼读课';
					case 5:
						result = '线上练习册';
						break;
				}
			} else if (row.type == 2) {
				base = '单项课';
				switch (row.subType) {
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
						result = '拼读课';
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
			return base + ' -> ' + result;
		},
		formatCourseViewType(row) {
			switch (row.conf.courseViewType) {
				case 0:
					return '仅限APP查看';
					break;
				case 1:
					return '仅限H5查看';
					break;
				case 2:
					return '无限制';
					break;
				default:
					return '';
			}
		},
		formatUnitNum(row) {
			if ((!row) || !row.unitIds || !row.unitIds.length) {
				return '当前课程无单元'
			}
			return row.unitIds.length + '个'
		},
		formatStartEndTime(row) {
			let time = new Date(Number(row))
			return util.formatDate.format(time, 'yyyy-MM-dd')
		}
	},
	watch: {
		editFormVisible: {
			handler(newVal, oldVal) {
				if (!newVal) {
					this.goodsListTransfer = false;
					this.SkuListTransfer = false;
					this.searchGoods = []; // 绑定课程 的列表
					this.addGoods = [];
					this.searchGoodsOrSku = ''; // 搜索商品 绑定数据清空
					this.checkedTeachers = []; // 选择老师 绑定数据清空
					this.Teachers = [];
					this.checkedChannels = ''; // 选择channel 绑定数据清空
					this.Channels = [];
					// 选择channelCodeConf部分数据清空
					this.selectSpu = '';
					this.SpuOptions = [];
					this.selectSku = '';
					this.SkuOptions = [];
					this.selectCourse = '';
					this.CourseInSkuOptions = [];
					this.selectPlan = '';
					this.PlanOptions = [];
					this.channelValidityTime = '';
					this.startTime = '';
					this.endTime = '';
					// 绑定发音课相关数据清空
					this.searchSundCourseFlag = false;
					this.sundCourseOptions = [];
					this.$delete(this.editItemRules, "description");
					this.$delete(this.editItemRules, "internalName");
					// 是否修改 Code
					this.changeCode = true;
				}
			},
			deep: true
		},
		editItemRules: {
			handler() {

			},
			deep: true
		},
		ChannelCodeSkuConfInfo: {
			handler(newVal, oldVal) {
				if (newVal || newVal.length) {
					this.ChannelCodeSkuConfShow = true;
				} else {
					this.ChannelCodeSkuConfShow = false;
				}
			},
			deep: true
		},
		selectCourseLoading: {
			handler(newVal, oldVal) {
				if (!newVal) {
					this.GoodsOptions = [];
				}
			}
		}
	}
}
</script>

<style lang="less" scoped>
.formTitle {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 40px;
}

.formExpand {
    display: flex;
    justify-content: space-between;
}

.formExpand .image {
    width: 200px;
    height: 200px;
    border: 1px solid #d1dbe5;
    border-radius: 4px;
    padding: 10px;
    box-shadow: 0 0 3px #666;
}

.formExpand .CourseImage {
    width: 240px;
    height: 300px;
    border: 1px solid #d1dbe5;
    border-radius: 4px;
    padding: 10px;
    box-shadow: 0 0 3px #666;
}

.formExpand figcaption {
    margin-right: 0;
    margin-bottom: 0;
    width: 70%;
}

.formExpand figcaption p {
    width: 60%;
    margin-top: 5px;
}

.formExpand figcaption p span {
    width: 90px;
    color: #99a9bf;
}

.demo-table-expand {
    font-size: 0;
}

.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}

.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}

.channelCodeConfItem {
    text-align: center;
    border: 1px solid #d1dbe5;
    border-radius: 4px;
    box-shadow: 0 0 3px #666;
    margin: 0 5px;
    background: #e5e9f2;
}

.review-upload {
    display: inline-block;
    width: 500px;
    margin-left: 20px;
    float: left;
}

.ChannelCodeItem {}

.preview-container {
    position: absolute;
    left: 340px;
    top: 250px;
    width: 180px;
    height: 100px;
    overflow: hidden;
    // border: 1px solid #ccc;
    div {
        text-align: center;
        img {
            width: 160px;
            display: inline-block;
            height: 90px;
        }
        span {
            display: inline-block;
            width: 100%;
            text-align: center;
            height: 30px;
            line-height: 30px;
        }
    }
}
</style>
