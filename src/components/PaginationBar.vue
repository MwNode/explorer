<script lang="ts" setup>
import { computed, ref } from 'vue';

const props = defineProps({
    total: { type: String },
    limit: { type: Number },
    callback: { type: Function, required: true },
});
const current = ref(1)
const showSize = 3
const pages = computed(() => {
    const pages: { color: string, page: number }[] = []
    const total = Number(props.total || 0)
    if (total > 0 && props.limit && total > props.limit) {
        let page = 0
        while (true) {
            if (page * props.limit >= total) break
            page += 1
            if (total / props.limit > 10 && page > showSize && page < (total / props.limit - showSize + 1)) {
                if (!(page >= current.value - 1 && page <= current.value + 1)) {
                    continue
                }
            }
            pages.push({
                color: page === current.value ? 'primary' : '',
                page: page,
            })
        }
    }
    return pages
})

function gotoPage(pageNum: number) {
    current.value = pageNum
    props.callback(pageNum)
}

</script>
<template v-if="total && limit">
    <div class="py-5 bg-white-5 text-center rounded-bl-[20px] rounded-br-[20px] pagination">
        <div class="btn-group">
            <button v-for="{ page, color } in pages" :key="page"
                class="btn rounded-none bg-white-10 hover:!bg-white-30 !text-white border-none" :class="{
                    '!bg-primary hover:!bg-primary-90': color === 'primary',
                }" @click="gotoPage(page)">
                {{ page }}
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.pagination {
    .btn {
        &:first-child {
            border-radius: 12px 0 0 12px !important;
        }
        &:last-child {
            border-radius: 0 12px 12px 0 !important;
        }
    }
}

</style>