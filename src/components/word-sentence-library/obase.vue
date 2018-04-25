<template>
<div id="root">
	<!-- 过滤查询 -->
	<el-row>
		<el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
			<el-form :inline='true' :model='filters'>
				<el-form-item>
					<el-input v-model='filters.id' placeholder='ID' icon="circle-cross" :on-icon-click="handleIconClick_clearID" @keydown.native.prevent.enter='init' @change='init'></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model='filters.english' placeholder='英文' icon="circle-cross" :on-icon-click="handleIconClick_clearEnglishName" @keydown.native.prevent.enter='init' @change='init'></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model='filters.chinese' placeholder='中文' icon="circle-cross" :on-icon-click="handleIconClick_clearChineseName" @keydown.native.prevent.enter='init' @change='init'></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model='filters.tags' placeholder='模板标签' icon="circle-cross" :on-icon-click="handleIconClick_clearTag" @keydown.native.prevent.enter='init' @change='init'></el-input>
				</el-form-item>
				<el-form-item>
					<el-cascader :options="type" expand-trigger="hover" placeholder='类型' @change="handleFilters_typeChange"></el-cascader>
				</el-form-item>
				<el-form-item v-if="isWord || isPhrase">
					<el-cascader :options="natureType" placeholder='基于词性的类型' change-on-select @change="handleFilters_natureTypeChange"></el-cascader>
				</el-form-item>
				<el-form-item>
					<el-button type='primary' @click='init'>查询</el-button>
				</el-form-item>
				<el-form-item v-if="isWord">
					<el-button type='primary' @click='batchQuery'>批量查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type='primary' @click='handleAdd'>新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>
	</el-row>

	<!-- 列表 -->
	<el-table border :data="allData" highlight-current-row v-loading="initLoading" style="width: 100%;">
		<el-table-column type="expand">
			<template scope="props" class="tb-manypic">
          <div class="tb-expand-show-container">
            <div class="tb-expand-show-subContainer">
              <div class="tb-expand-show" v-if="!isSentencePattern && props.row.entity.imgUrl">
                <el-card :body-style="{ padding: '0px' }">
                  <div class="tb-img-container">
                    <img :src="props.row.entity.imgUrl">
                  </div>
                  <div style="padding: 10px 5px;display:flex;justify-content: space-between;">
                    <span class="title">{{ '类型图' }}</span>
                    <span>
                      <el-button style="margin: -3px 0 0 0;" type="text" size='small' @click.native="editMedia(props.row.entity, 'imgUrl', '0')">修改</el-button>
                    </span>
                  </div>
                </el-card>
              </div>
              <div class="tb-expand-show" v-if="!isSentencePattern && props.row.entity.bigImgUrl">
                <el-card :body-style="{ padding: '0px' }">
                  <div class="tb-img-container">
                    <img :src="props.row.entity.bigImgUrl">
                  </div>
                  <div style="padding: 10px 5px;display:flex;justify-content: space-between;">
                    <span class="title">{{ '大图或动图' }}</span>
                    <span>
                      <el-button style="margin: -3px 0 0 0;" type="text" size='small' @click.native="editMedia(props.row.entity, 'bigImgUrl', '0')">修改</el-button>
                    </span>
                  </div>
                </el-card>
              </div>
              <div class="tb-expand-show" v-if="props.row.entity.voiceId">
                <el-card :body-style="{ padding: '0px' }">
                  <div class="tb-img-container" @click="previewMedia(0, props.row.entity.voiceId)">
                    <img :src="props.row.entity.voiceImg">
                  </div>
                  <div style="padding: 10px 5px;display:flex;justify-content: space-between;">
                    <span class="title">{{ '(标准)发音音频' }}</span>
                    <span>
                      <el-button style="margin: -3px 0 0 0;" type="text" size='small' @click.native="editMedia(props.row.entity, 'voiceImg', 'voiceId', '2')">修改</el-button>
                    </span>
                  </div>
                </el-card>
              </div>
              <div class="tb-expand-show" v-if="props.row.entity.voiceSlowlyId">
                <el-card :body-style="{ padding: '0px' }">
                  <div class="tb-img-container" @click="previewMedia(0, props.row.entity.voiceId)">
                    <img :src="props.row.entity.voiceSlowlyImg">
                  </div>
                  <div style="padding: 10px 5px;display:flex;justify-content: space-between;">
                    <span class="title">{{ '(慢速)发音音频' }}</span>
                    <span>
                      <el-button style="margin: -3px 0 0 0;" type="text" size='small' @click.native="editMedia(props.row.entity, 'voiceSlowlyImg', 'voiceSlowlyId', '2')">修改</el-button>
                    </span>
                  </div>
                </el-card>
              </div>
              <div class="tb-expand-show" v-if="props.row.entity.mouthShapeId">
                <el-card :body-style="{ padding: '0px' }">
                  <div class="tb-img-container" @click="previewMedia(0, props.row.entity.mouthShapeId)">
                    <img :src="props.row.entity.mouthShapeImg">
                  </div>
                  <div style="padding: 10px 5px;display:flex;justify-content: space-between;">
                    <span class="title">{{ '(标准)口型示范视频' }}</span>
                    <span>
                      <el-button style="margin: -3px 0 0 0;" type="text" size='small' @click.native="editMedia(props.row.entity, 'mouthShapeImg', 'mouthShapeId', '1')">修改</el-button>
                    </span>
                  </div>
                </el-card>
              </div>
              <div class="tb-expand-show" v-if="props.row.entity.mouthShapeSlowlyId">
                <el-card :body-style="{ padding: '0px' }">
                  <div class="tb-img-container" @click="previewMedia(0, props.row.entity.mouthShapeSlowlyId)">
                    <img :src="props.row.entity.mouthShapeSlowlyImg">
                  </div>
                  <div style="padding: 10px 5px;display:flex;justify-content: space-between;">
                    <span class="title">{{ '(慢速)口型示范视频' }}</span>
                    <span>
                      <el-button style="margin: -3px 0 0 0;" type="text" size='small' @click.native="editMedia(props.row.entity, 'mouthShapeSlowlyImg', 'mouthShapeSlowlyId', '1')">修改</el-button>
                    </span>
                  </div>
                </el-card>
              </div>
              <div class="tb-expand-show" v-if="props.row.entity.voiceExplainId">
                <el-card :body-style="{ padding: '0px' }">
                  <div class="tb-img-container" @click="previewMedia(0, props.row.entity.voiceExplainId)">
                    <img :src="props.row.entity.voiceExplainImg">
                  </div>
                  <div style="padding: 10px 5px;display:flex;justify-content: space-between;">
                    <span class="title">{{ '发音讲解视频' }}</span>
                    <span>
                      <el-button style="margin: -3px 0 0 0;" type="text" size='small' @click.native="editMedia(props.row.entity, 'voiceExplainImg', 'voiceExplainId', '1')">修改</el-button>
                    </span>
                  </div>
                </el-card>
              </div>
            </div>
          </div>
        </template>
		</el-table-column>
		<el-table-column prop="entity.id" label="ID" width="105" sortable align='center'></el-table-column>
		<el-table-column prop="entity.english" label="英文" align='center' show-overflow-tooltip></el-table-column>
		<el-table-column prop="entity.chinese" label="中文" align='center' show-overflow-tooltip></el-table-column>
		<el-table-column prop="entity.phonogram" label="音标" align='center' v-if="isWord || isPhrase" show-overflow-tooltip></el-table-column>
		<el-table-column prop="entity.usages" label="用法" align='center' v-if="!isSentence" show-overflow-tooltip></el-table-column>
		<el-table-column prop="entity.tags" label="标签" align='center' show-overflow-tooltip></el-table-column>
		<el-table-column prop="entity.type" label="类型" width="105" :formatter='formatType' align="center" show-overflow-tooltip></el-table-column>
		<el-table-column prop="entity.natrueType" label="词性类型" :formatter='formatNatureType' align="center" v-if="isWord || isPhrase" show-overflow-tooltip></el-table-column>
		<el-table-column prop="entity.stat" label="状态" :formatter='formatStat' width="105" align="center"></el-table-column>
		<el-table-column label="操作" align="center" width="150">
			<template scope="scope">
          <el-button-group>
            <el-button type="success" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          </el-button-group>
        </template>
		</el-table-column>
	</el-table>

	<!-- 新增及编辑表单 -->
	<el-dialog title='' v-model='formVisible' :close-on-click-modal='false' size="small">
		<el-form :model='form' :rules='formRules' label-width='120px' ref="form" label-position="right">
			<el-form-item label='ID' v-show="form.id">
				<el-input v-model='form.id' style="width: 100px;" disabled="disabled"></el-input>
			</el-form-item>
			<el-form-item label="类型">
				<el-cascader :options="type" placeholder='类型' change-on-select @change="handleForm_typeChange" v-model="defaultType"></el-cascader>
			</el-form-item>
			<el-form-item label="词性类型" v-if="isWord || isPhrase">
				<el-cascader :options="natureType" placeholder='基于词性的类型' change-on-select @change="handleForm_natureTypeChange" v-model="defaultNatureType"></el-cascader>
			</el-form-item>
			<el-form-item label="状态" prop='stat'>
				<el-radio-group v-model="form.stat">
					<el-radio class="radio" :label="'1'">有效</el-radio>
					<el-radio class="radio" :label="'0'">无效</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label='英文' prop='english'>
				<el-input v-model='form.english'></el-input>
			</el-form-item>
			<el-form-item label='中文' prop='chinese'>
				<el-input v-model='form.chinese'></el-input>
			</el-form-item>
			<el-form-item label='音标' prop='phonogram' v-if="isWord || isPhrase">
				<el-input v-model='form.phonogram'></el-input>
			</el-form-item>
			<el-form-item label='用法' v-if="!isSentence">
				<el-input v-model='form.usages'></el-input>
			</el-form-item>
			<el-form-item label='标签' prop='dynamicTags'>
				<div>
					<el-tag :key="tag" v-for="tag in form.dynamicTags" :closable="true" :close-transition="false" @close="handleClose(tag)" type="success" style="margin:0 5px 0 0">{{tag}}</el-tag>
					<el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="mini" style="width: 100px;" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" @keydown.enter.native.prevent></el-input>
					<el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
				</div>
			</el-form-item>
			<el-form-item label="预览" v-show="form.imgUrl || form.bigImgUrl || form.voiceId || form.voiceSlowlyId || form.mouthShapeId">
				<div class="preview-container">
					<div v-show="!isSentencePattern && form.imgUrl">
						<img :src="form.imgUrl" alt="">
						<span>类型图片</span>
					</div>
					<!-- <div v-show="!isSentencePattern && form.bigImgUrl">
						<img :src="form.bigImgUrl" alt="">
						<span>大图或者动图</span>
					</div> -->
					<div v-show="form.voiceId" class="conclude-media">
						<img :src="form.voiceImg" alt="" @click="previewMedia(0, form.voiceId)">
						<span>发音(标准)</span>
					</div>
					<div v-show="form.voiceSlowlyId" class="conclude-media">
						<img :src="form.voiceSlowlyImg" alt="" @click="previewMedia(0, form.voiceSlowlyId)">
						<span>发音(慢速)</span>
					</div>
					<div v-show="form.mouthShapeId" class="conclude-media">
						<img :src="form.mouthShapeImg" alt="" @click="previewMedia(0, form.mouthShapeId)">
						<span>口型示范(标准)</span>
					</div>
					<!-- <div v-show="form.mouthShapeSlowlyImg" class="conclude-media">
						<img :src="form.mouthShapeSlowlyImg" alt="" @click="previewMedia(0, form.mouthShapeSlowlyId)">
						<span>口型示范(慢速)</span>
					</div> -->
					<!-- <div v-show="form.voiceExplainImg" class="conclude-media">
						<img :src="form.voiceExplainImg" alt="" @click="previewMedia(0, form.voiceExplainId)">
						<span>发音讲解</span>
					</div> -->
				</div>
			</el-form-item>
			<el-form-item label="类型图片" v-if="!isSentencePattern">
				<UploadMethods :oAcType="0" v-on:child-say-upfinish="childUploadFinish" :oProp="0" :oVal="'imgUrl'" :oTags="'词句库'" :oClearForm="formVisible" v-on:child-say='assignVal'></UploadMethods>
			</el-form-item>
			<!-- <el-form-item label="大图或者动图" v-if="!isSentencePattern">
				<UploadMethods :oAcType="0" v-on:child-say-upfinish="childUploadFinish" :oProp="0" :oVal="'bigImgUrl'" :oTags="'词句库'" :oClearForm="formVisible" v-on:child-say='assignVal'></UploadMethods>
			</el-form-item> -->
			<el-form-item label="发音图片(标准)">
				<UploadMethods :oAcType="0" v-on:child-say-upfinish="childUploadFinish" :oProp="0" :oVal="'voiceImg'" :oTags="'词句库'" :oClearForm="formVisible" v-on:child-say='assignVal'></UploadMethods>
			</el-form-item>
			<el-form-item label="发音音频(标准)">
				<UploadMethods :oAcType="0" v-on:child-say-upfinish="childUploadFinish" :oProp="2" :oVal="'voiceId'" :oTags="'词句库'" :oClearForm="formVisible" v-on:child-say='assignVal'></UploadMethods>
			</el-form-item>
			<!-- <el-form-item label="发音图片(慢速)">
				<UploadMethods :oAcType="0" v-on:child-say-upfinish="childUploadFinish" :oProp="0" :oVal="'voiceSlowlyImg'" :oTags="'词句库'" :oClearForm="formVisible" v-on:child-say='assignVal'></UploadMethods>
			</el-form-item> -->
			<el-form-item label="发音音频(慢速)">
				<UploadMethods :oAcType="0" v-on:child-say-upfinish="childUploadFinish" :oProp="2" :oVal="'voiceSlowlyId'" :oTags="'词句库'" :oClearForm="formVisible" v-on:child-say='assignVal'></UploadMethods>
			</el-form-item>
			<!-- <el-form-item label="口型封面(标准)">
				<UploadMethods :oAcType="0" v-on:child-say-upfinish="childUploadFinish" :oProp="0" :oVal="'mouthShapeImg'" :oTags="'词句库'" :oClearForm="formVisible" v-on:child-say='assignVal'></UploadMethods>
			</el-form-item> -->
			<el-form-item label="口型视频(标准)">
				<UploadMethods :oAcType="0" v-on:child-say-upfinish="childUploadFinish" :oProp="1" :oVal="'mouthShapeId'" :oTags="'词句库'" :oClearForm="formVisible" v-on:child-say='assignVal'></UploadMethods>
			</el-form-item>
			<!-- <el-form-item label="口型封面(慢速)">
				<UploadMethods :oAcType="0" v-on:child-say-upfinish="childUploadFinish" :oProp="0" :oVal="'mouthShapeSlowlyImg'" :oTags="'词句库'" :oClearForm="formVisible" v-on:child-say='assignVal'></UploadMethods>
			</el-form-item>
			<el-form-item label="口型视频(慢速)">
				<UploadMethods :oAcType="0" v-on:child-say-upfinish="childUploadFinish" :oProp="1" :oVal="'mouthShapeSlowlyId'" :oTags="'词句库'" :oClearForm="formVisible" v-on:child-say='assignVal'></UploadMethods>
			</el-form-item>
			<el-form-item label="发音讲解封面">
				<UploadMethods :oAcType="0" v-on:child-say-upfinish="childUploadFinish" :oProp="0" :oVal="'voiceExplainImg'" :oTags="'词句库'" :oClearForm="formVisible" v-on:child-say='assignVal'></UploadMethods>
			</el-form-item>
			<el-form-item label="发音讲解视频">
				<UploadMethods :oAcType="0" v-on:child-say-upfinish="childUploadFinish" :oProp="1" :oVal="'voiceExplainId'" :oTags="'词句库'" :oClearForm="formVisible" v-on:child-say='assignVal'></UploadMethods>
			</el-form-item> -->
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button type="warning" @click.native="handleCopy" v-show="batchFlag">Copy</el-button>
			<el-button @click.native="formVisible = false">取消</el-button>
			<el-button type="primary" @click.native="handleSubmit" :loading="formLoading" :disabled="formSubState">提交</el-button>
		</div>
	</el-dialog>

	<!-- table中的音视频修改及预览 -->
	<el-dialog title='' v-model='emFormVisible' :close-on-click-modal='false' size="small">
		<el-form :model='emForm' :rules='emFormRules' label-width='50px' ref="form" label-position="right">
			<el-form-item label="预览" v-if="emForm[emForm.img_key]">
				<div class="preview-container preview-container-em">
					<div>
						<img :src="emForm[emForm.img_key].url" alt="" @click="previewMedia(1, emForm[emForm.av_key])">
						<span>{{ emForm.img_key }}</span>
					</div>
				</div>
			</el-form-item>
			<!-- 上传 -->
			<el-form-item label="图片">
				<UploadMethods :oAcType="0" v-on:child-say-upfinish="childUploadFinish" :oProp="0" :oVal="emForm.img_key" :oTags="'词句库'" :oClearEmForm="emFormVisible" v-on:child-say='emAssignVal'></UploadMethods>
			</el-form-item>
			<el-form-item label="视频" v-if="emForm.av_type=='1'">
				<UploadMethods :oAcType="0" v-on:child-say-upfinish="childUploadFinish" :oProp="emForm.av_type" :oVal="emForm.av_key" :oTags="'词句库'" :oClearEmForm="emFormVisible" v-on:child-say='emAssignVal'></UploadMethods>
			</el-form-item>
			<el-form-item label="音频" v-if="emForm.av_type=='2'">
				<UploadMethods :oAcType="0" v-on:child-say-upfinish="childUploadFinish" :oProp="emForm.av_type" :oVal="emForm.av_key" :oTags="'词句库'" :oClearEmForm="emFormVisible" v-on:child-say='emAssignVal'></UploadMethods>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click.native="emFormVisible = false">取消</el-button>
			<el-button type="primary" @click.native="handleEmSubmit" :loading="emFormLoading" :disabled="formSubState">确认修改提交</el-button>
		</div>
	</el-dialog>

	<!-- 关于批量查询 -->
	<el-dialog title='批量查询' v-model='batchFormVisible' :close-on-click-modal='false'>
		<el-form :model='batchForm' :rules='batchFormRules' ref='batchForm'>
			<el-form-item label='输入单词'>
				<el-input type="textarea" :autosize="{ minRows: 3 }" v-model='batchForm.inputData' placeholder="输入格式为who,took,cookie(多个以英文逗号或者空格分隔)" spellcheck="false" @change="batchQuerySubmit()"></el-input>
			</el-form-item>
			<el-form-item label='未存在' v-show="batchForm.absentData && batchForm.absentData.length">
				<el-button icon="plus" type="primary" @click="batchAdd()">批量创建</el-button>
			</el-form-item>
			<el-form-item v-show="batchForm.absentData && batchForm.absentData.length">
				<div class="" style="border: 1px solid rgb(191, 215, 217);border-radius: 4px;padding: 0 0 5px 0;">
					<el-button v-for="(item, index) in batchForm.absentData" :key="index" icon="plus" type="primary" @click="batchAdd(item,index)" style="margin: 10px 5px 5px 10px;">{{ item }}</el-button>
				</div>
			</el-form-item>
			<el-form-item label='存在' v-show="batchForm.queriedData && batchForm.queriedData.length">
			</el-form-item>
			<el-form-item v-show="batchForm.queriedData && batchForm.queriedData.length">
				<div class="" style="border: 1px solid rgb(191, 215, 217);border-radius: 4px;padding: 0 0 5px 0;">
					<el-button v-for="(item, index) in batchForm.queriedData" :key="index" icon="search" type="primary" style="margin: 10px 5px 5px 10px;" @click="previewWord(item.entity.id)">{{ item.entity.english }}</el-button>
				</div>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click.native="batchFormVisible = false">取消</el-button>
			<el-button type="primary" @click.native="batchReset">重置</el-button>
			<el-button type="primary" @click.native="batchQuerySubmit" :loading="batchFormLoading">提交</el-button>
		</div>
	</el-dialog>

	<!--批量新增中文-->
	<el-dialog title='批量新增中文' v-model='addChiness' :close-on-click-modal='false' size="small">
		<el-form label-width="80px" :model='batchForm' :rules='batchFormRules' ref='batchForm'>
			<div v-if="haveMoreChiness&&batchChinessForm.length">
				<div v-for="(item, index) in batchChinessForm" :key="index">
					<el-form-item label='英文：'>{{item.english}}</el-form-item>
					<el-form-item label='中文：'>
						<el-input type="text" :autosize="{ minRows: 3 }" placeholder="请输入对应中文" spellcheck="false" v-model="item.chinese"></el-input>
					</el-form-item>
				</div>
			</div>
			<div v-else="haveMoreChiness">
				<el-form-item label='英文：'>{{batchChinessForm[0].english}}</el-form-item>
				<el-form-item label='中文：'>
					<el-input type="text" :autosize="{ minRows: 3 }" placeholder="请输入对应中文" spellcheck="false" v-model="batchChinessForm[0].chinese"></el-input>
				</el-form-item>
			</div>
			<el-form-item>
				<el-button type="primary" @click="submitAddChinese">插入</el-button>
				<el-button @click.native="addChiness = false">取消</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>

	<!-- 媒体播放预览 -->
	<div class="preview-audio-container" v-show="previewAudioVisible">
		<div class="mask" @click="stopPreviewAudio"></div>
		<!-- <span class="close audio-close">X</span> -->
		<audio controls ref="oAudio"></audio>
	</div>
	<div class="preview-video-container" v-show="previewVideoVisible">
		<div class="mask" @click="stopPreviewVideo"></div>
		<!-- <span class="close" @click="stopPreviewVideo">X</span> -->
		<video controls ref="oVideo"></video>
	</div>

	<!-- 分页条 -->
	<el-col :span='24' class='toolbar'>
		<el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size=page_size :total=totalCount style='float: right'></el-pagination>
	</el-col>
</div>
</template>

<script>
import UploadMethods from "./uploadMethods";
import {
	getMaterialsList,
	getDownloadUrl,
	getPhraseList,
	getPhraseById,
	addPhrase,
	updatePhrase,
	getSentenceList,
	getSentenceById,
	addSentence,
	updateSentence,
	getSentencePatternList,
	addSentencePattern,
	updateSentencePattern,
	getWordList,
	addWord,
	updateWord,
	getPublicKvList,
	batchQuery,
	batchAddWord
} from "../../api/api";
export default {
	name: "Base",
	components: {
		UploadMethods
	},
	props: ["TYPE"],
	data() {
		return {
			filters: {
				id: "",
				english: "",
				chinese: "",
				tags: "",
				type: "",
				subType: ""
			},
			// 是否是单词类型
			isWord: false,
			isPhrase: false,
			isSentence: false,
			isSentencePattern: false,

			// 全部的类型包括子类型
			type: [],
			defaultType: ["0", "0"],
			// 全部的基于词性的类型
			natureType: [],
			defaultNatureType: ["0"],

			// 表格数据源
			allData: [
				// {
				//   entity: {
				//     id: 1,
				//     english: "apple",
				//     chinese: "苹果",
				//     phonogram: "['æp(ə)l]",
				//     usages: "用法",
				//     tags: "水果,富含维生素C,富含维生素C,富含维生素C",
				//     stat: "1",
				//     type: 1,
				//     subType: 1,
				//     natureType: 1,
				//     // 类型图片链接
				//     imgUrl:
				//       "http://live.babyfs.cn/web/H5/xl/template/2017/10/DJS/images/nurse.png",
				//     // 大图或动图链接
				//     bigImgUrl:
				//       "http://live.babyfs.cn/web/H5/xl/template/2017/10/DJS/images/firefighter.png",
				//     // 发音音频图片链接
				//     voiceImg:
				//       "http://live.babyfs.cn/web/H5/xl/template/2017/10/DJS/images/police.png",
				//     // 发音音频素材id
				//     voiceId: "10002677",
				//     // 口型示范视屏的封面图链接
				//     mouthShapeImg:
				//       "http://live.babyfs.cn/web/H5/xl/template/2017/10/DJS/images/teacher.png",
				//     mouthShapeId: "8893535",
				//     // 口型示范视屏慢速的封面图链接
				//     mouthShapeSlowlyImg:
				//       "http://live.babyfs.cn/web/H5/xl/template/2017/10/DJS/images/teacher.png",
				//     mouthShapeSlowlyId: "10003082",
				//     // 发音讲解视频的封面图
				//     voiceExplainImg:
				//       "http://i.s.babyfs.cn/28dfdbcd7f9825f7d6a122c5e9d24599bd795cdb.jpg",
				//     voiceExplainId: "8893536"
				//   }
				// }
			],

			/**
			 * @description 表单加载状态
			 * true   加载
			 * false  不加载
			 */
			initLoading: false,

			/**
			 * @description 表单 新增
			 * @description form 表单数据
			 * @description formRules 表单规则
			 * @description formVisible 是否显示表单
			 * @description formLoading 表单提交按钮的loading状态
			 */
			formVisible: false,
			formLoading: false,
			form: {
				english: "",
				chinese: "",
				phonogram: "",
				dynamicTags: [],
				stat: "1",
				type: "",
				subType: "",
				natureType: "",
				imgUrl: "",
				bigImgUrl: "",
				voiceImg: "",
				voiceId: "",
				mouthShapeImg: "",
				mouthShapeId: "",
				mouthShapeSlowlyImg: "",
				mouthShapeSlowlyId: "",
				voiceExplainImg: "",
				voiceExplainId: ""
			},
			formRules: {
				english: [{
					required: true,
					message: "英文为必填项",
					trigger: "blur"
				}],
				chinese: [{
					required: true,
					message: "中文为必填项",
					trigger: "blur"
				}],
				phonogram: [{
					required: true,
					message: "音标为必填项",
					trigger: "blur"
				}],
				status: [{
					required: true
				}]
			},

			formSubState: false,
			formSubStateObj: {},

			// tags 标签
			inputVisible: false,
			inputValue: "",

			// 预览媒体播放
			previewVideoVisible: false,
			previewAudioVisible: false,
			// 预览媒体默认是 视频
			isVideo: true,

			// 分页
			totalCount: 1,
			page_index: 1,
			page_size: 20,

			// 获取列表的方法
			getListFun: "",
			addFun: "",
			updateFun: "",

			// 单一修改某个素材
			emFormVisible: false,
			emFormLoading: false,
			emForm: {},
			emFormRules: {},

			// 批量查询
			batchFormVisible: false,
			batchFormLoading: false,
			batchForm: {
				inputData: '',
				queriedData: '',
				absentData: ''
			},
			batchFormRules: {},
			batchFlag: false,
			batchTemData: '',

			//添加中文
			copyOff: false,
			addChiness: false,
			haveMoreChiness: false,
			batchChinessForm: [{
				chinese: '',
				english: ''
			}]
		};
	},
	methods: {
		/**
		 * @function handleIconClick_clearID   清除ID
		 * @function handleIconClick_clearEnglishName 清除英文名称
		 * @function handleIconClick_clearChineseName 清除中文名称
		 * @function handleIconClick_clearTag  清除标签
		 * @function handleFilters_typeChange  类型级联菜单变化
		 * @function handleFilters_natureTypeChange  基于词性类型级联菜单变化
		 */
		handleIconClick_clearID() {
			this.filters.id = "";
		},
		handleIconClick_clearEnglishName() {
			this.filters.english = "";
		},
		handleIconClick_clearChineseName() {
			this.filters.chinese = "";
		},
		handleIconClick_clearTag() {
			this.filters.tags = "";
		},
		handleFilters_typeChange(val) {
			this.filters.type = val[0];
			this.filters.subType = val[1];
			this.init();
		},
		handleFilters_natureTypeChange(val) {
			this.filters.natureType = val[0];
			this.init();
		},
		/***@function 分页 */
		handleCurrentChange(val) {
			this.page_index = val;
			this.init();
		},
		/**
		 * @function handleForm_typeChange  类型级联菜单变化
		 * @function handleForm_natureTypeChange  基于词性类型级联菜单变化
		 */
		handleForm_typeChange(val) {
			this.form.type = val[0];
			this.form.subType = val[1];
		},
		handleForm_natureTypeChange(val) {
			this.form.natureType = val[0];
		},

		/**
		 * @function 加载列表数据
		 * @description 两个参数主要针对批量查询单词后的预览 正常的加载表单不需要这两个参数
		 * @param b_id 单词的id
		 */
		init(b_id, f) {
			let para = {};
			if (f) {
				para = {
					id: b_id
				}
				this.getListFun(para).then(res => {
					if (res.data.success) {
						this.handleEdit('', res.data.data.items[0])
					} else {
						this.$notify({
							title: "错误",
							type: "error",
							message: res.data.msg
						});
					}
				});
			} else {
				this.initLoading = true;
				para = {
					id: this.filters.id,
					english: this.filters.english,
					chinese: this.filters.chinese,
					tags: this.filters.tags,
					type: this.filters.type,
					sub_type: this.filters.subType,
					nature_type: this.filters.natureType,
					page_index: this.page_index,
					page_size: this.page_size
				}
				this.getListFun(para).then(res => {
					this.allData = [];
					if (res.data.success) {
						// this.allData = res.data.data.items;
						this.$set(this, 'allData', res.data.data.items)
						this.totalCount = res.data.data.totalCount
						this.initLoading = false;
					} else {
						this.$notify({
							title: "错误",
							type: "error",
							message: res.data.msg
						});
					}
				});
			}
		},

		/**
		 * @function 显示批量查询表单
		 */
		batchQuery() {
			this.batchFormVisible = true
		},

		/**
		 * @function 批量查询
		 */
		batchQuerySubmit() {
			let temp = this.batchForm.inputData
			let para = {
				values: this.ReplaceSeperator(temp)
			}
			batchQuery(para).then((res) => {
				let qResponse = res.data.data
				let arr1 = qResponse.absentEnglishes
				let arr2 = Object.keys(qResponse.queriedWords)
				let arr3 = []
				for (let i = 0; i < arr2.length; i++) {
					for (let j = 0; j < qResponse.queriedWords[arr2[i]].length; j++) {
						arr3.push(qResponse.queriedWords[arr2[i]][j])
					}
				}
				this.batchForm.absentData = arr1
				this.batchForm.queriedData = arr3
			})
		},

		/**
		 * @function 批量查询后的添加单词都走这个接口
		 * @param arg 存在时表示单个单词的英文值 否则就是批量创建单词
		 * @param fid 表示批量创建元数据的或者copy的时候把索引值传入
		 */
		batchAdd(arg, fid) {
			this.addChiness = true
			if (!arg) {
				//多个单词
				this.haveMoreChiness = true;
				this.batchChinessForm = this.batchForm.absentData.map((item) => {
					return {
						english: item,
						chinese: '',
					}
				})
			} else {
				//单个单词
				this.haveMoreChiness = false;
				this.batchChinessForm = [{
					english: arg,
					chinese: '',
					id: fid
				}];
			}
		},

		/**
		 * @function 点击提交的逻辑
		 */
		submitAddChinese() {
			let para = {
				values: []
			}

			//判断是否有中文，如果有就提交，没有不提交
			for (let i = 0; i < this.batchChinessForm.length; i++) {
				if (String.trim(this.batchChinessForm[i].chinese)) {
					para.values.push(this.batchChinessForm[i]);
				}
			}
			//判断是否输入了数据
			if (para.values.length == 0) {
				this.addChiness = false;
				return
			} else {
				this.$confirm('确认创建吗?', '提示', {
						type: 'warning'
					})
					.then(() => {
						batchAddWord({
							values: JSON.stringify(para.values)
						}).then((res) => {
							if (res.data.success) {
								//copy的时候
								if (this.copyOff) {
									console.log('copy');
									let arr = this.batchForm.queriedData;
									for (let i = 0; i < arr.length; i++) {
										if (arr[i].entity.id == this.batchChinessForm[0].id) {
											//存在的删掉
											this.batchForm.queriedData.splice(i, 1);
										}
									}
								} else {
									//单个创建多个创建 未存在的删掉 存在的添加
									if (this.batchChinessForm.length == 1) {
										//单个单词
										console.log('单个单词添加');
										this.batchForm.absentData.splice(this.batchChinessForm[0].id, 1);
									} else {
										//多个单词
										for (let i = 0; i < this.batchChinessForm.length; i++) {
											if (String.trim(this.batchChinessForm[i].chinese)) {
												for (let j = 0; j < this.batchForm.absentData.length; j++) {
													if (this.batchChinessForm[i].english == this.batchForm.absentData[j]) {
														this.batchForm.absentData.splice(j, 1);
													}
												}
											}
										}
									}
								}
								// this.init()
								let self = this
								this.initLoading = true;
								// 数据库创建需要时间 timeout做个等待
								setTimeout(function () {
									self.init()
								}, 500);
								// this.batchForm.absentData = []
								this.formVisible = false
								this.addChiness = false
							} else {
								this.$notify({
									title: '错误',
									type: "error",
									message: res.data.msg
								})
							}
						})
					})
			}
		},

		/**
		 * @function 批量查询表单重置
		 */
		batchReset() {
			this.batchForm = {
				inputData: '',
				queriedData: [],
				absentData: []
			}
		},
		/**
		 * @func 替换空格为,
		 */
		ReplaceSeperator(mobiles) {
			var i;
			var result = "";
			var c;
			for (i = 0; i < mobiles.length; i++) {
				c = mobiles.substr(i, 1);
				if (c == "," || c == "，")
					result = result + ",";
				else if (c != " ")
					result = result + c;
			}
			return result;
		},

		/**
		 * @function 预览单词
		 */
		previewWord(b_id) {
			this.batchFlag = true
			this.init(b_id, true)
		},
		/**
		 * @function 复制单个单词
		 */
		handleCopy() {
			this.copyOff = true;
			this.batchAdd(this.form.english, this.form.id)
		},
		/***
		 * @function formatStat 根据状态(数值)转换为状态(文字)
		 * @function formatType 根据类型(数值)转换为类型(文字)
		 * @function formatNatureType 根据基于词性的类型(数值)转换为基于词性的类型(文字)
		 */
		formatStat(row, column) {
			return row.entity.stat == 1 ? "有效" : row.entity.stat == 0 ? "无效" : "未知";
		},
		formatType(row, column) {
			if (this.isWord) {
				let str1 = String(row.entity.type);
				let str2 = String(row.entity.subType);
				let typeStr, subTypeStr;
				for (let i = 0; i < this.type.length; i++) {
					if (this.type[i].value == str1) {
						typeStr = this.type[i].label;
						for (let j = 0; j < this.type[i].children.length; j++) {
							if (this.type[i].children[j].value == str2) {
								subTypeStr = this.type[i].children[j].label;
								return typeStr + " / " + subTypeStr;
							}
						}
					}
				}
			} else {
				let str = String(row.entity.type);
				for (let i = 0; i < this.type.length; i++) {
					if (this.type[i].value == str) {
						return this.type[i].label;
					}
				}
			}
		},
		formatNatureType(row, column) {
			let str = String(row.entity.natureType);
			for (let i = 0; i < this.natureType.length; i++) {
				if (this.natureType[i].value == str) {
					return this.natureType[i].label;
				}
			}
		},

		/**
		 * @function handleAdd   新增
		 * @function handleEdit  编辑
		 * @function handleSubmit  提交
		 */
		handleAdd() {
			this.form = {
				english: "",
				chinese: "",
				phonogram: "",
				dynamicTags: [],
				stat: "1",
				type: "0",
				subType: "0",
				natureType: "0",
				imgUrl: "",
				bigImgUrl: "",
				voiceImg: "",
				voiceId: "",
				voiceSlowlyImg: "",
				voiceSlowlyId: "",
				mouthShapeImg: "",
				mouthShapeId: "",
				mouthShapeSlowlyImg: "",
				mouthShapeSlowlyId: "",
				voiceExplainImg: "",
				voiceExplainId: ""
			};
			// 级联默认值
			if (this.isWord || this.isPhrase) {
				this.defaultNatureType = ["0"];
			}
			if (this.isWord) {
				this.defaultType = ["0", "0"];
			} else {
				this.defaultType = ["0"];
			}
			this.isSentence ? "" : (this.form["usages"] = "");
			this.formVisible = true;
		},
		handleEdit(index, row) {
			this.form = Object.assign({}, row.entity);
			this.form["stat"] = String(this.form.stat);
			if (this.form["tags"]) {
				this.$set(this.form, "dynamicTags", this.form["tags"].split(","));
			} else {
				this.form["dynamicTags"] = [];
			}
			// 级联默认值
			this.defaultType = [String(this.form.type), String(this.form.subType)];
			this.defaultNatureType = [String(this.form.natureType)];

			this.formVisible = true;
		},
		handleSubmit() {
			/***
			 * @description 通过this.form.id 来判断是新增还是编辑
			 */
			let editF;
			let para = {
				english: this.form.english,
				chinese: this.form.chinese,
				phonogram: this.form.phonogram,
				usages: this.form.usages,
				tags: this.form.dynamicTags.join(","),
				status: this.form.stat,
				type: this.form.type,
				sub_type: this.form.subType,
				nature_type: this.form.natureType,
				img_url: this.form.imgUrl,
				big_img_url: this.form.bigImgUrl,
				voice_img: this.form.voiceImg,
				voice_id: this.form.voiceId,
				voice_slowly_img: this.form.voiceSlowlyImg,
				voice_slowly_id: this.form.voiceSlowlyId,
				mouth_shape_img: this.form.mouthShapeImg,
				mouth_shape_id: this.form.mouthShapeId,
				mouth_shape_slowly_img: this.form.mouthShapeSlowlyImg,
				mouth_shape_slowly_id: this.form.mouthShapeSlowlyId,
				voice_explain_img: this.form.voiceExplainImg,
				voice_explain_id: this.form.voiceExplainId
			};

			this.form.id >= 0 ? (para["id"] = this.form.id) : "";

			editF = this.form.id >= 0 ? this.updateFun : this.addFun;

			this.$refs.form.validate(valid => {
				if (valid) {
					this.$confirm("确认提交吗?", "提示", {}).then(() => {
						if ((para["img_url"] == "") && !this.isSentencePattern) {
							this.$notify({
								title: "警告",
								type: "warning",
								message: "类型图片不能为空"
							});
							return false;
						}

						if (para["voice_id"] == "") {
							this.$notify({
								title: "警告",
								type: "warning",
								message: "发音音频(标准)不能为空"
							});
							return false;
						}

						if (para["mouth_shape_id"] == "" && !this.isSentencePattern) {
							this.$notify({
								title: "警告",
								type: "warning",
								message: "口型示范(标准)素材不能为空"
							});
							return false;
						}

						editF(para).then(res => {
							if (res.data.success) {
								this.$notify({
									title: "成功",
									type: "success",
									message: "操作成功"
								});
								this.formVisible = false;
								let self = this;
								this.initLoading = true;
								setTimeout(function () {
									self.init();
								}, 1000);
							} else {
								this.$notify({
									title: "错误",
									type: "error",
									message: res.data.msg
								});
							}
						});
					});
				}
			});
		},
		/*
		  标签相关的函数
		 */
		handleClose(tag) {
			this.form.dynamicTags.splice(this.form.dynamicTags.indexOf(tag), 1);
		},
		showInput() {
			this.inputVisible = true;
			this.$nextTick(_ => {
				this.$refs.saveTagInput.$refs.input.focus();
			});
		},
		handleInputConfirm() {
			let inputValue = this.inputValue;
			if (inputValue) {
				this.form.dynamicTags.push(inputValue);
			}
			this.inputVisible = false;
			this.inputValue = "";
		},

		/***
		 * @description 与组件的交互
		 * @function 接收子组件的值并给form表单赋值
		 */
		assignVal(val) {
			val.oProp == 0 ?
				this.$set(this.form, val.oVal, val.url) :
				this.$set(this.form, val.oVal, val.id);
		},

		/**
		 * @description 与组件的交互
		 * @function 接收子组件的值并给emForm表单赋值
		 */
		emAssignVal(val) {
			this.$set(this.emForm, val.oVal, val);
		},

		/**
		 * @description 与组件的交互
		 * @function 接收子组件的值并给form表单的按钮disabled赋值
		 */
		childUploadFinish(key, val) {
			if (val == 'remove' && this.formSubStateObj[key] == false) {
				delete this.formSubStateObj[key]
			} else {
				this.formSubStateObj[key] = val
			}
			// console.log(this.formSubStateObj);
			if (this.formSubStateObj) {
				let count = 0
				for (let tkey in this.formSubStateObj) {
					count++
					if (!this.formSubStateObj[tkey]) {
						this.formSubState = true
						break
					}
					this.formSubState = false
				}
				if (count == 0) {
					this.formSubState = true
				}
			}
		},

		/***
		 * @function 预览媒体播放
		 * @augments flag (0表示form编辑时候的预览 1表示后一个参数传的是一个对象 key为id value为id的值)
		 */
		previewMedia(flag, temp) {
			let id;
			if (flag == 1) {
				if (!temp) {
					this.$notify({
						title: "警告",
						message: "未配置音视频",
						type: "warning"
					});
					return false;
				} else {
					id = temp.id;
				}
			} else {
				id = temp;
			}
			if (id) {
				getMaterialsList({
					id: id
				}).then(res => {
					if (res.data.success) {
						let mp4Reg = /\.mp4$/;
						let mp3Reg = /\.mp3$/;
						let responseEntity = res.data.data.items[0].entity;
						getDownloadUrl({
							id: id
						}).then(res => {
							if (res.data.success) {
								if (mp4Reg.test(responseEntity.url)) {
									this.previewVideoVisible = true;
									this.previewAudioVisible = false;
									this.$refs.oAudio.pause();
									this.$refs.oVideo.src = res.data.data.url;
									this.$refs.oVideo.play();
								}
								if (mp3Reg.test(responseEntity.url)) {
									this.previewAudioVisible = true;
									this.previewVideoVisible = false;
									this.$refs.oVideo.pause();
									this.$refs.oAudio.src = res.data.data.url;
									this.$refs.oAudio.play();
								}
							} else {
								this.$notify({
									title: "错误",
									message: res.data.msg,
									type: "error"
								});
							}
						});
					} else {
						this.$notify({
							title: "错误",
							message: res.data.msg,
							type: "error"
						});
					}
				});
			} else {
				this.$notify({
					title: "警告",
					message: "未配置音视频",
					type: "warning"
				});
			}
		},

		/***
		 * @function stopPreviewVideo停止预览播放视频
		 * @function stopPreviewAudio停止预览播放音频
		 */
		stopPreviewVideo() {
			this.previewVideoVisible = !this.previewVideoVisible;
			this.$refs.oVideo.pause();
		},
		stopPreviewAudio() {
			this.previewAudioVisible = !this.previewAudioVisible;
			this.$refs.oAudio.pause();
		},

		/***
		 * @function 单一修改某个素材
		 * @description 单一修改 但是还是调用update接口 需要把该id下的原先的数据都带上 this.emForm的赋值
		 */
		editMedia(obj, imgStr, avStr, type) {
			// console.log(obj);
			this.emFormVisible = true;
			this.emForm = {
				id: obj.id,
				english: obj.english,
				chinese: obj.chinese,
				phonogram: obj.phonogram,
				usages: obj.usages,
				tags: obj.tags,
				status: obj.stat,
				type: obj.type,
				sub_type: obj.subType,
				nature_type: obj.natureType,
				img_url: obj.imgUrl,
				big_img_url: obj.bigImgUrl,
				voice_img: obj.voiceImg,
				voice_id: obj.voiceId,
				voice_slowly_img: obj.voiceSlowlyImg,
				voice_slowly_id: obj.voiceSlowlyId,
				mouth_shape_img: obj.mouthShapeImg,
				mouth_shape_id: obj.mouthShapeId,
				mouth_shape_slowly_img: obj.mouthShapeSlowlyImg,
				mouth_shape_slowly_id: obj.mouthShapeSlowlyId,
				voice_explain_img: obj.voiceExplainImg,
				voice_explain_id: obj.voiceExplainId,

				av_type: type,
				img_key: imgStr,
				av_key: avStr
			};

			// 以对象的形式保存下来 原因是在组件得到信息后把对应图片和音视频素材的id及url信息都返回来
			this.$set(this.emForm, imgStr, {
				url: obj[imgStr]
			});
			this.$set(this.emForm, avStr, {
				id: obj[avStr]
			});
		},

		/***
		 * @function em表单提交
		 */
		handleEmSubmit() {
			let img_key = "";
			let av_key = "";
			let para = Object.assign({}, this.emForm);
			switch (this.emForm.img_key) {
			case "imgUrl":
				img_key = "img_url";
				break;
			case "bigImgUrl":
				img_key = "big_img_url";
				break;
			case "voiceImg":
				img_key = "voice_img";
				break;
			case "voiceSlowlyImg":
				img_key = "voice_slowly_img";
				break;
			case "mouthShapeImg":
				img_key = "mouth_shape_img";
				break;
			case "mouthShapeSlowlyImg":
				img_key = "mouth_shape_slowly_img";
				break;
			case "voiceExplainImg":
				img_key = "voice_explain_img";
				break;
			}
			switch (this.emForm.av_key) {
			case "voiceId":
				av_key = "voice_id";
				break;
			case "voiceSlowlyId":
				av_key = "voice_slowly_id";
				break;
			case "mouthShapeId":
				av_key = "mouth_shape_id";
				break;
			case "mouthShapeImg":
				av_key = "mouth_shape_id";
				break;
			case "mouthShapeSlowlyId":
				av_key = "mouth_shape_slowly_id";
				break;
			case "voiceExplainId":
				av_key = "voice_explain_id";
				break;
			}
			para[img_key] = this.emForm[this.emForm.img_key].url;
			para[av_key] = this.emForm[this.emForm.av_key].id;
			this.$confirm("确认提交吗?", "提示", {}).then(() => {
				this.updateFun(para).then(res => {
					if (res.data.success) {
						this.$notify({
							title: "成功",
							type: "success",
							message: "操作成功"
						});
						this.emFormVisible = false;
						let self = this;
						this.initLoading = true;
						setTimeout(function () {
							self.init();
						}, 1000);
					} else {
						this.$notify({
							title: "错误",
							type: "error",
							message: res.data.msg
						});
					}
				});
			});
		}
	},
	watch: {
		/**
		 * @description 表单关闭的时候要暂停video和audio的播放
		 */
		formVisible: {
			handler(newV, oldV) {
				if (!newV) {
					// 音视频暂停
					this.$refs.oVideo.pause();
					this.$refs.oAudio.pause();
					this.previewAudioVisible = false;
					// 表单关闭的时候重置batchFlag的状态为false
					this.batchFlag = false
				}
			}
		}
	},
	mounted() {
		/**
		 * @function 初始化获取type类型
		 */
		let self = this;
		let initType = function (key) {
			getPublicKvList({
				name: key
			}).then(res => {
				if (res.data.success) {
					let res_data = JSON.parse(res.data.data.content);
					let res_natureTypes = res_data.natureTypes;
					let res_types = res_data.types;
					if (res_natureTypes) {
						for (var i = 0; i < res_natureTypes.length; i++) {
							self.natureType.push({
								value: String(res_natureTypes[i].index),
								label: res_natureTypes[i].name
							});
						}
					}
					if (res_types) {
						for (var i = 0; i < res_types.length; i++) {
							self.type.push({
								value: String(res_types[i].index),
								label: res_types[i].name
							});
							if (res_types[i].subTypes && res_types[i].subTypes.length) {
								self.type[i]["children"] = [];
								for (var j = 0; j < res_types[i].subTypes.length; j++) {
									self.type[i].children.push({
										value: String(res_types[i].subTypes[j].index),
										label: res_types[i].subTypes[j].name
									});
								}
							}
						}
						// console.log(self.type);
					}
				} else {
					self.$notify({
						title: "获取KVconf类型错误",
						type: "error",
						message: res.data.msg
					});
				}
			});
		};

		switch (this.TYPE) {
		case 0:
			this.isWord = true;
			this.getListFun = getWordList;
			this.addFun = addWord;
			this.updateFun = updateWord;
			initType("_sys.expressions_word");
			break;
		case 1:
			this.isPhrase = true;
			this.getListFun = getPhraseList;
			this.addFun = addPhrase;
			this.updateFun = updatePhrase;
			initType("_sys.expressions_phrase");
			break;
		case 2:
			this.isSentence = true;
			this.getListFun = getSentenceList;
			this.addFun = addSentence;
			this.updateFun = updateSentence;
			initType("_sys.expressions_sentence");
			break;
		case 3:
			this.isSentencePattern = true;
			this.getListFun = getSentencePatternList;
			this.addFun = addSentencePattern;
			this.updateFun = updateSentencePattern;
			initType("_sys.expressions_sentence_pattern");
			break;
		}
		this.init();
	}
};
</script>

<style lang="less" scoped>
.tb-manypic {
    width: 100%;
    overflow-x: scroll;
}
.tb-expand-show-container {
    width: 100%;
    height: 200px;
    overflow-x: scroll;
    .tb-expand-show-subContainer {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .tb-expand-show {
            width: 140px;
            height: 100%;
            margin: 0 20px;
            .tb-img-container {
                width: 100%;
                height: 100%;
                img {
                    width: 140px;
                    height: 140px;
                    cursor: pointer;
                }
            }
        }
    }
}

.title {
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-size: 13px;
}

.mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
}

.preview-container {
    width: 100%;
    height: 200px;
    border: 1px solid #ccc;
    overflow-x: scroll;
    display: flex;
    align-items: center;
    div {
        text-align: center;
        margin: 0 10px;
        img {
            width: 140px;
            display: inline-block;
            height: 140px;
            border: 1px dashed #ccc;
        }
        span {
            display: inline-block;
            width: 100%;
            text-align: center;
            height: 30px;
            line-height: 30px;
            // border: 1px solid green;
        }
    }
}

.preview-container-em {
    width: 200px;
    img {
        cursor: pointer;
    }
}

.preview-audio-container {
    width: 600px;
    height: 600px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -300px;
    margin-top: -300px;
    z-index: 9999;
    audio {
        width: 100%;
    }
}
.preview-video-container {
    width: 600px;
    height: 600px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -300px;
    margin-top: -300px;
    z-index: 9999;
    video {
        width: 100%;
    }
}

.close {
    width: 20px;
    text-align: center;
    height: 20px;
    line-height: 20px;
    border-radius: 50%;
    background: #ccc;
    color: #000;
    font-size: 16px;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 999;
    cursor: pointer;
}
.conclude-media {
    cursor: pointer;
}
</style>
