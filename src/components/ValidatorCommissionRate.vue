<script setup lang="ts">
import ApexCharts from 'vue3-apexcharts';
import { computed, type PropType } from 'vue';
import { useFormatter } from '@/stores';
import type { CommissionRate } from '@/types';

const props = defineProps({
    commission: { type: Object as PropType<CommissionRate> },
});

let rate = computed(
    () => Number(props.commission?.commission_rates.rate || 0) * 100
);
let change = computed(
    () => Number(props.commission?.commission_rates.max_change_rate || 0) * 100
);
let max = computed(
    () => Number(props.commission?.commission_rates.max_rate || 1) * 100
);

const left = rate;
const right = computed(() => max.value - rate.value);

const s1 = computed(() =>
    left.value > change.value ? left.value - change.value : 0
);
const s2 = computed(() =>
    left.value > change.value ? change.value : left.value
);
const s3 = 2;
const s4 = computed(() =>
    right.value > change.value ? change.value : right.value
);
const s5 = computed(() =>
    right.value > change.value ? right.value - change.value : 0
);

const series = computed(() => [s1.value, s2.value, s3, s4.value, s5.value]);

const format = useFormatter();

const chartConfig = computed(() => {

    const secondaryText = `hsl(var(--bc))`;
    const primaryText = `white`;

    return {
        chart: {
            width: '200px',
            sparkline: { enabled: false },
        },
        // rgba(109,120,141,0.2)'
        colors: ['rgba(255,255,255,0.1)', 'rgba(231, 91, 31, 0.2)', 'rgba(231, 91, 31, 1)', 'rgba(231, 91, 31, 0.2)', 'rgba(255,255,255,0.1)'],
        legend: { show: false },
        tooltip: { enabled: false },
        dataLabels: { enabled: false },
        stroke: {
            width: 3,
            lineCap: 'round',
            colors: ['rgba(255, 255, 255, 0.1)'],
        },
        labels: [
            'Available',
            'Daily Change',
            'Commission Rate',
            'Daily Change',
            'Available',
        ],
        states: {
            hover: {
                filter: { type: 'none' },
            },
            active: {
                filter: { type: 'none' },
            },
        },
        plotOptions: {
            pie: {
                endAngle: 130,
                startAngle: -130,
                customScale: 0.9,
                donut: {
                    size: '83%',
                    labels: {
                        show: true,
                        name: {
                            offsetY: 25,
                            fontSize: '1rem',
                            color: secondaryText,
                        },
                        value: {
                            offsetY: -15,
                            fontWeight: 500,
                            fontSize: '2.125rem',
                            formatter: (value: unknown) => `${rate.value.toFixed(1)}%`,
                            color: primaryText,
                        },
                        total: {
                            show: true,
                            label: 'Commission Rate',
                            fontSize: '1rem',
                            color: secondaryText,
                            formatter: () => `${rate.value.toFixed(1)}%`,
                        },
                    },
                },
            },
        },
        responsive: [
            {
                breakpoint: 1709,
                options: {
                    chart: { height: 237 },
                },
            },
        ],
    };
});
</script>

<template>
    <div class="bg-white-10 rounded shadow p-4">
        <div class="text-lg text-main font-semibold mb-1">Commission Rate</div>
        <div class="text-sm text-gray-3">
            {{ `Updated at ${format.toDay(props.commission?.update_time, 'short')}` }}
        </div>
        <div class="w-80 m-auto">
            <ApexCharts type="donut" :options="chartConfig" :series="series" />
        </div>
        <div>
            <div class="flex items-center justify-center flex-wrap gap-x-3">
                <div class="flex items-center gap-x-2">
                    <div class="bg-primary w-[6px] h-[6px] rounded-full"></div>
                    <span class="text-caption text-main">Rate:{{ rate.toFixed(0) }}%</span>
                </div>
                <div class="flex items-center gap-x-2">
                    <div class="bg-primary-20 w-[6px] h-[6px] rounded-full opacity-60"></div>
                    <span class="text-caption text-main">24h: ±{{ change }}%</span>
                </div>
                <div class="flex items-center gap-x-2">
                    <div class="bg-white-10 w-[6px] h-[6px] rounded-full"></div>
                    <span class="text-caption text-main">Max:{{ max }}%</span>
                </div>
            </div>
        </div>
    </div>
</template>
