<template>
    <el-row>
        <el-col :span="2">
            <el-select
            v-model="value"
            filterable
            remote
            reserve-keyword
            placeholder="请输入交易对"
            :remote-method="remoteMethod"
            :loading="loading"
            style="width: 200px"
            @change="coinChange"
        >
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            />
        </el-select>
        
        </el-col>
        <el-col :span="22">
            <el-radio-group @change="changeInterval" v-model="interval" is-button>
                <el-radio-button label="15m" />
                <el-radio-button label="1h" />
                <el-radio-button label="4h" />
                <el-radio-button label="1d" />
            </el-radio-group>
        </el-col>
    </el-row>
    <el-row class="chart-row">
        <el-col :span="24" class="chart-col">
            <ChartsPage ref="chartsPageRef" 
                :data="data" 
                :priceFormatOptions="priceFormatOptions"
                ></ChartsPage>
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>
    //import WebSocket from 'ws';
    import ChartsPage from './charts/lightweightCharts.vue'
    import axios from 'axios';
    import {
        ref,
        onMounted,
    } from 'vue';

    //klines data
    var data = ref([{ time: new Date().getTime() / 1000, open: 75.16, high: 82.84, low: 36.16, close: 45.72 }]);

    //binance klines http url https://fapi.binance.com
    const baseHttpUrl = 'https://fapi.binance.com';
    const baseWebSocketUrl = 'wss://fstream.binance.com';

    //以下是交易对select选项逻辑代码
    // select code start=============================================
    
    const states = [
        'BTCUSDT',
        'ETHUSDT',
        'BNBUSDT',
        'ZECUSDT',
        'DOGEUSDT',
        'SAGAUSDT',
        '1000PEPEUSDT'
    ]

    interface ListItem {
        value: string
        label: string
    }

    const list = ref<ListItem[]>([])
    const options = ref<ListItem[]>([])
    const value = ref('BTCUSDT')
    const loading = ref(false)
    const interval = ref('15m');

    const priceScaleOptions = ref({
        mode: 0,
        alignLabels: true,
        //autoScale: false, // disables auto scaling based on visible content
        /*scaleMargins: {
            top: 0.1,
            bottom: 0.1,
        },*/
        //minDistance: 0.1,
        priceFormatter: (price) => {
            //console.log(price)
            var priceFixed = 2;
            //console.log(p.toString());
            let index = price.toString().indexOf('.');
            if(index > 0){
                priceFixed = price.toString().split('.')[1].length;
                //console.log(priceFixed)
            }
            return price.toFixed(priceFixed); // 保留两位小数; // 四舍五入到最接近的整数
        },
        minimumWidth: 0.1
    });

    const priceFormatOptions = ref({
        localization: {
            priceFormatter: function(p){
                var priceFixed = 2;
                //console.log(p.toString());
                let index = p.toString().indexOf('.');
                if(index > 0){
                    priceFixed = p.toString().split('.')[1].length;
                    //console.log(priceFixed)
                }
                return p.toFixed(priceFixed);
            },
        }
    })

    //当前已订阅的交易对
    var clientArr = [];

    const remoteMethod = (query: string) => {
        if (query) {
            loading.value = true
            setTimeout(() => {
            loading.value = false
            options.value = list.value.filter((item) => {
                return item.label.toLowerCase().includes(query.toLowerCase())
            })
            }, 200)
        } else {
            options.value = []
        }
    }
    const changeInterval = (val) => {
        coinChange(value.value);
    }
    const coinChange = async(val) => {
        if(clientArr.length > 0){
            clientArr.shift().close();
        }
        //console.log(val)
        data.value = [];
        
        var url = baseHttpUrl + "/fapi/v1/continuousKlines?pair=" + val + 
            '&contractType=PERPETUAL&interval=' + interval.value + '&limit=1500';
        var response = await axios.get(url);
        //data.value.push({ time: '2018-12-22', open: 75.16, high: 82.84, low: 36.16, close: 45.72 })
        var newData = [];
        response.data.forEach(function(d,i){
            newData.push({
                time:d[0] / 1000,
                open:Number(d[1]),
                high:Number(d[2]),
                low:Number(d[3]),
                close:Number(d[4])
            });
        })
        data.value = newData;
        //data.value.push({ time: '2018-12-22', open: 75.16, high: 82.84, low: 36.16, close: 45.72 })
        
        //data.value.push({ time: '2018-12-22', open: 75.16, high: 82.84, low: 36.16, close: 45.72 })
        //console.log(data.value)
        subscribeCoin(value.value,interval.value);
    }
    
    // select code end=============================================
    onMounted(() => {
        // coin select code.
        list.value = states.map((item) => {
            return { value: `${item}`, label: `${item}` }
        });

        coinChange(value.value);
    })
    
    var chartsPageRef = ref();

    const subscribeCoin = (pair: string,interval: string) => {

        var socketClient = new WebSocket(baseWebSocketUrl + "/ws/" + pair.toLowerCase() + '_perpetual@continuousKline_' + interval);
        
        socketClient.onopen = () => {
            console.log('WebSocket connection opened,' + socketClient.url);
        };

        socketClient.onmessage = (event) => {
            const kline = JSON.parse(event.data);
            //console.log(kline.ps + ': ' + kline.k);
            var k = kline.k;
            chartsPageRef.value.updateData({
                time: k.t / 1000,
                open: Number(k.o),
                close: Number(k.c),
                high: Number(k.h),
                low: Number(k.l)
            });
            document.title = k.c + ' | ' + value.value + ' U本位永续合约';
        };

        socketClient.onclose = () => {
            console.log('WebSocket connection closed,' + socketClient.url);
        };

        socketClient.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        clientArr.push(socketClient);
    }
</script>

<style scoped>
    /* 使el-row和el-col使用flex布局，并且高度为100% */
    .chart-row {
        display: flex;
        align-items: stretch; /* 确保子元素拉伸以填充容器高度 */
        height: 100%;
    }

    .chart-col {
        display: flex;
        flex-direction: column;
    }
    .lw-chart {
        flex-grow: 1; /* 使图表容器占满剩余的空间 */
        width: 100%;
        height: calc(100vh - 93px);
        background-color: #222;
    }
</style>