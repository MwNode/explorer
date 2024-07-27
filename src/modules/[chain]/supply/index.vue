<script lang="ts" setup>
import { computed, ref } from '@vue/reactivity';
import { useBaseStore, useBlockchain, useFormatter } from '@/stores';
import { PageRequest, type AuthAccount, type Pagination, type Coin } from '@/types';
import { onMounted } from 'vue';
import PaginationBar from '@/components/PaginationBar.vue';
const props = defineProps(['chain']);

const format = useFormatter();
const chainStore = useBlockchain()

const list = ref([] as Coin[])

function showType(v: string) {
    return v.replace("/cosmos.auth.v1beta1.", "")
}

const pageRequest = ref(new PageRequest())
const pageResponse = ref({} as Pagination)

onMounted(() => {
  pageload(1)
});

function pageload(p: number) {
  pageRequest.value.setPage(p)
  chainStore.rpc.getBankSupply(pageRequest.value).then(x => {
    list.value = x.supply
    pageResponse.value = x.pagination
  });
}

</script>
<template>
    <div class="bg-white-10 rounded">
        <div class="overflow-auto rounded-t-[20px]">
          <table class="table table-compact text-white">
            <thead class="bg-white-10 text-white">
                <tr>
                    <th>Token</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
              <tr v-for="item in list" class="hover">
                <td>{{ item.denom  }}</td>
                <td>{{ item.amount  }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <PaginationBar :limit="pageRequest.limit" :total="pageResponse.total" :callback="pageload" />
    </div>
</template>

<route>
    {
      meta: {
        i18n: 'supply',
        order: 17
      }
    }
  </route>
