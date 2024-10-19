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
            <ChartsPage :data="data"></ChartsPage>
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>

    import dayjs from 'dayjs';
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


    //以下是交易对select选项逻辑代码
    // select code start=============================================
    
    const states = [
        'BTCUSDT',
        'ETHUSDT',
        'BNBUSDT',
        'ZECUSDT',
        'DOGEUSDT'
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
    }
    
    // select code end=============================================
    onMounted(() => {
        // coin select code.
        list.value = states.map((item) => {
            return { value: `${item}`, label: `${item}` }
        });

        coinChange(value.value);
    })

    
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
        height: calc(100vh - 92px);
    }
</style>