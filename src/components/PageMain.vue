<template>
    <el-row>
        <el-col :span="24">
            <el-select
            v-model="value"
            filterable
            remote
            reserve-keyword
            placeholder="请输入交易对"
            :remote-method="remoteMethod"
            :loading="loading"
            style="width: 240px"
        >
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            />
        </el-select>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="24"></el-col>
    </el-row>
</template>
<script lang="ts" setup>
    import { onMounted, ref } from 'vue'

    interface ListItem {
    value: string
    label: string
    }

    const list = ref<ListItem[]>([])
    const options = ref<ListItem[]>([])
    const value = ref<string[]>([])
    const loading = ref(false)
    onMounted(() => {
    list.value = states.map((item) => {
        return { value: `value:${item}`, label: `${item}` }
    })
    })

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

    const states = [
        'BTCUSDT',
        'ETHUSDT',
        'BNBUSDT'
    ]
</script>