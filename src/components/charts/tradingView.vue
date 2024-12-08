<script setup>
import { onMounted, ref, onUnmounted,reactive , defineExpose} from 'vue';
import { widget } from './../../../public/charting_library';
import Datafeed from './../../datafeeds/binance_datafeed.js';
import axios from './../../axios';
import { ElLoading, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter();

var subscribe_status = false;
//取消订阅
const unsubscribe_event = (time) => {
	subscribe_status = false;
}

//订阅事件
const subscribe_event = (time) => {
	subscribe_status = true;
}

//修改水平射线持仓方向表单逻辑 START
const horizontal_ray_form_visible = ref(false);
const horizontal_ray_form_label_with = '100px';
const horizontal_ray_form = reactive({
	id: '',
	longOrShortType: 0,//做多或做空 水平射线使用 0：空 1：多
	shapeId: '',
})

const show_horizontal_ray_form = (id,longOrShortType,shapeId) => {
	horizontal_ray_form.id = id;
	horizontal_ray_form.longOrShortType = longOrShortType;
	horizontal_ray_form.shapeId = shapeId;
	horizontal_ray_form_visible.value = true;
}

Datafeed.init_show_horizontal_ray_form_func(show_horizontal_ray_form);

const save_horizontal_ray_form = () => {
	axios.post('/shape/updateLongOrShortType',{
		id: horizontal_ray_form.id,
		longOrShortType: horizontal_ray_form.longOrShortType
	}).then(function(result){
		if(result.code == 1){
            ElMessage.error({message: result.message, offset: (window.innerHeight / 2)});
		} else if(result.code == 0){
			//图纸实例
			var iLineDataSourceApi = Datafeed.getWidget().activeChart().getShapeById(horizontal_ray_form.shapeId);
			var linecolor_pro;
			if(horizontal_ray_form.longOrShortType == 1) {
				linecolor_pro = { linecolor : "rgb(0, 128, 0)" };
			} else {
				linecolor_pro = { linecolor : "rgb(255, 0, 0)" };
			}

			iLineDataSourceApi.setProperties(linecolor_pro,true);

			ElMessage.success({message: result.message, offset: (window.innerHeight / 2)});
			horizontal_ray_form_visible.value = false;
		}
	}).catch(function(err){
		console.error(err);
		ElMessage.error({message: err, offset: (window.innerHeight / 2) - 50});
		subscribe_event();
	})
}

//修改水平射线持仓方向表单逻辑 END

//订阅绘图事件回调函数
var subscribe_drawing_func_call = (event) => {
	//console.log(subscribe_status);
	//console.log(`drawing type as :${event.value}`);
}
var subscribe_drawing_event_func_call = (id, type) => {
	//console.log(subscribe_status);
	axios.get('/user/userInfo').then(function(result){
		if(!(result && result.username)){
			router.push('/login')
		}
	}).catch(function(e){
		router.push('/login');
	})
	//console.log(`id:${id}, type:${type}`);

	if(type == 'create' && subscribe_status){
		Datafeed.saveShapeInfo(id);
	} else if(type == 'remove' && subscribe_status){
		Datafeed.removeShapeInfo(id);
	} else if((type == 'properties_changed' || type == 'points_changed') && subscribe_status){
		Datafeed.changeShapeInfo(id);
	}
}


Datafeed.init_subscribe_event_func(subscribe_event,unsubscribe_event);

const props = defineProps({
	symbol: {
		default: 'BTCUSDT',
		type: String,
	},
	interval: {
		default: '60',
		type: String,
	},
	/*datafeedUrl: {
		default: 'https://demo_feed.tradingview.com',
		type: String,
	},*/
	libraryPath: {
		default: window.location.pathname + '/charting_library/',
		type: String,
	},
	chartsStorageUrl: {
		default: 'https://saveload.tradingview.com',
		type: String,
	},
	chartsStorageApiVersion: {
		default: '1.1',
		type: String,
	},
	clientId: {
		default: 'tradingview.com',
		type: String,
	},
	userId: {
		default: 'public_user_id',
		type: String,
	},
	fullscreen: {
		default: false,
		type: Boolean,
	},
	autosize: {
		default: true,
		type: Boolean,
	},
	studiesOverrides: {
		type: Object,
		default: {
			//"volume.volume.color.0": "#FF0000", // 下跌成交量颜色
			//"volume.volume.color.1": "#1aff24", // 上涨成交量颜色
			//"volume.volume.transparency": 0,   // 成交量透明度
			//"volume.volume ma.color": "#0000FF", // 成交量均线颜色
			//"volume.volume ma.transparency": 30, // 成交量均线透明度
			"volume.show_as_panel": true,        // 将成交量显示在单独的面板
			//"mainSeriesProperties.candleStyle.transparency": 0,
		}
	},
	time_frames: {
		type: Array,
		default: [
			{ text: "1d", resolution: "15", description: "1day", title: "1D"},
			{ text: "1w", resolution: "240", description: "7day", title: "1W"},
			{ text: "30d", resolution: "240", description: "30day", title: "1M"},
			{ text: "365y", resolution: "1d", description: "All", title: "All" },
		]
	}
});

const chartContainer = ref();
let chartWidget;

onMounted(() => {
	const widgetOptions = {
		theme: "Dark",
		symbol: props.symbol,
		datafeed: Datafeed, //new UDFCompatibleDatafeed(props.datafeedUrl),
		interval: props.interval,
		container: chartContainer.value,
		library_path: props.libraryPath,
		volume: true,
		locale: 'en',
		//locale: getLanguageFromURL() || 'en',
		//disabled_features: ['use_localstorage_for_settings'],
		//enabled_features: ['study_templates'],
		//charts_storage_url: props.chartsStorageUrl,
		//charts_storage_api_version: props.chartsStorageApiVersion,
		//client_id: props.clientId,
		//user_id: props.userId,
		fullscreen: props.fullscreen,
		autosize: props.autosize,
		time_frames: props.time_frames,
		timezone: "Asia/Shanghai",
		studies_overrides: props.studiesOverrides,
	};

	Datafeed.initPairsInfo(function(cfg){
		var global_symbol = cfg.symbol;
		var global_interval = cfg.inerval;
		//console.log(cfg);
		if(cfg){
			widgetOptions.symbol = global_symbol;
			widgetOptions.interval = global_interval;
		}

		var loading = ElLoading.service({
			lock: true,
			text: 'Loading',
			background: 'rgba(0, 0, 0, 0.7)',
		})

		chartWidget = new widget(widgetOptions);

		chartWidget.onChartReady(() => {
			//console.log('on chart ready.')
			/*
			chartWidget.chart().getSeries().setChartStyleProperties(1, {
				
				upColor: '#1aff24',
				borderUpColor: '#1aff24',
				wickUpColor: '#1aff24',
				downColor: '#FF0000',
				borderDownColor: '#FF0000',
				wickDownColor: '#FF0000',
				transparency: 0,
			});*/

			var chart = chartWidget.activeChart();
			chart.getAllStudies().forEach(study => {
				//console.log(study.name)
				if (study.name === 'Volume') {
					chart.removeEntity(study.id);
				}
			});

			chart.createStudy('Volume', false, true);

			if(loading) {
				loading.close();
			}
			//console.log(chartWidget)
			Datafeed.initChartWidget(chartWidget);

			//在图表添加绘图时触发的事件
			chartWidget.subscribe('drawing', subscribe_drawing_func_call);

			//创建、修改、删除绘图时触发的事件
			chartWidget.subscribe('drawing_event', subscribe_drawing_event_func_call);

			//变更交易对
			chart.onSymbolChanged().subscribe(null, () => {
				//console.log('The symbol is changed');
				subscribe_status = false;
				//console.log(chart.interval());
				global_symbol = chart.symbol();
				Datafeed.saveConfig(global_symbol,global_interval);
			});
			//变更时间级别
			chart.onIntervalChanged().subscribe(null, (interval, timeframeObj) =>{
				//console.log('The Interval is changed');
				//console.log(chart.symbol());
				// 获取当前时间级别
				//console.log(Datafeed.inervalData()[interval]);
				subscribe_status = false;
				global_interval = interval;
				Datafeed.saveConfig(global_symbol,global_interval);
			})
		});
	});

});

//显示所有画线信息 start
const shape_table_data = reactive({
	data: [],
	startIndex: 0,
	currentPage: 1,
	limit: 10,
	symbol: '',
	totalCount: 0,
	pageCount: 0,
})
const shape_table_visible = ref(false);

const queryShape = () => {
	//shape_table_data.data = [];
	axios.get("/shape/query?symbol=" +  shape_table_data.symbol + 
	"&startIndex=" + shape_table_data.startIndex + "&limit=" + shape_table_data.limit).then(function(result){
		shape_table_data.data = result.list;
		shape_table_data.startIndex = result.page.startIndex;
		shape_table_data.pageCount = result.page.pageCount;
		shape_table_data.currentPage = result.page.currentPage;
		shape_table_data.totalCount = result.page.totalCount;
		shape_table_data.limit = result.page.limit;
		shape_table_visible.value = true;
	}).catch(function(err){
		ElMessage.error({message: err.message, offset: (window.innerHeight / 2) - 50});
	});
}

const showAllShape = ()=> {
	queryShape();
}

const currentChange = ()=>{
	shape_table_data.startIndex = shape_table_data.currentPage * shape_table_data.limit - shape_table_data.limit;
	queryShape();
}

const searchShape = () => {
	shape_table_data.startIndex = 0;
	queryShape();
}

const showSymbol = (symbol) => {
	if(chartWidget) {
		chartWidget.activeChart().setSymbol(symbol)
	}
}

//显示所有画线信息 end

defineExpose({
	showAllShape
})

onUnmounted(() => {
	if (chartWidget) {
		chartWidget.remove();
		chartWidget = null;
	}
});
</script>

<template>
	<div class="TVChartContainer" ref="chartContainer" />
	<!--修改水平射线持仓方向表单 START-->
	<el-dialog v-model="horizontal_ray_form_visible" title="选择持仓方向" width="300">
		<el-form :model="horizontal_ray_form">
			<el-form-item label="持仓方向" :label-width="horizontal_ray_form_label_with">
				<el-radio-group v-model="horizontal_ray_form.longOrShortType" size="small">
                    <el-radio-button label="开多" :value="1" />
                    <el-radio-button label="开空" :value="0"/>
                </el-radio-group>
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<!--<el-button @click="horizontal_ray_form_visible = false">关闭</el-button>-->
				<el-button type="primary" @click="save_horizontal_ray_form">
				确认
				</el-button>
			</div>
		</template>
	</el-dialog>
	<!--修改水平射线持仓方向表单 END-->
	<!-- 画线信息列表START -->
	<el-dialog v-model="shape_table_visible" title="绘图管理">
		<div>
			<el-input
				v-model="shape_table_data.symbol"
				style="width: 240px"
				placeholder="请输入要查询的交易对"
				@keyup.enter="searchShape"
			>
			<template #prefix>
				<el-icon class="el-input__icon"><search /></el-icon>
			</template>
			</el-input>
		</div>
		<el-table :data="shape_table_data.data" stripe  style="width: 100%" empty-text="无数据">
			<el-table-column type="selection" width="50" />
			<el-table-column label="交易对">
				<template #default="scope">{{ scope.row.symbol }}</template>
			</el-table-column>
			<el-table-column label="类型">
				<template #default="scope">{{ scope.row.shapeTypeMemo }}</template>
			</el-table-column>
			<el-table-column label="创建时间">
				<template #default="scope">{{ scope.row.formatCreateTime }}</template>
			</el-table-column>
			<el-table-column label="修改时间">
				<template #default="scope">{{ scope.row.formatUpdateTime }}</template>
			</el-table-column>
			<el-table-column label="操作" width="100">
				<template #default="scope">
					<el-icon class="handStyle" @click="showSymbol(scope.row.symbol)"><View /></el-icon>
				</template>
			</el-table-column>
		</el-table>
		<div>&nbsp;</div>
		<div>
			<el-pagination
				v-model:current-page="shape_table_data.currentPage"
				v-model:page-size="shape_table_data.limit"
				:page-sizes="[5,10,15,20]"
				:size="shape_table_data.limit"
				:disabled="false"
				:background="true"
				layout="total, sizes, prev, pager, next, jumper"
				:total="shape_table_data.totalCount"
				@size-change="queryShape"
				@current-change="currentChange"
			>
			</el-pagination>
		</div>
		<template #footer>
			<div class="dialog-footer">
				<!--<el-button @click="horizontal_ray_form_visible = false">关闭</el-button>-->
				<el-button type="primary" @click="shape_table_visible = false">
				关闭
				</el-button>
			</div>
		</template>
	</el-dialog>
	<!-- 画线信息列表END -->
</template>

<style scoped>
.TVChartContainer {
	height: calc(100vh - 63px);
}
.handStyle{
    cursor: pointer
}
</style>
