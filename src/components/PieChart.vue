<template>
  <Pie :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import type { PropType } from 'vue'
import type { ChartData, ChartOptions } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

// Define props using defineProps
const props = defineProps({
  chartData: {
    type: Object as PropType<ChartData>,
    required: true
  },
  chartOptions: {
    type: Object as PropType<ChartOptions>,
    required: false,
    responsive: true,
    maintainAspectRatio: false,
    default: () => ({})
  }
})
</script>
