<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import type { PropType } from 'vue'
import type { ChartData, ChartOptions } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

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
