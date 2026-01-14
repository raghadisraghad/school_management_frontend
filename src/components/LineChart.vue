<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js'
import type { PropType } from 'vue'
import type { ChartData, ChartOptions } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

const props = defineProps({
  chartData: {
    type: Object as PropType<ChartData>,
    required: true
  },
  chartOptions: {
    type: Object as PropType<ChartOptions>,
    responsive: true,
    maintainAspectRatio: false,
    required: false,
    default: () => ({})
  }
})
</script>
