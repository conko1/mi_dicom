<template>
  <div class="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
    <div class="offcanvas-md offcanvas-end bg-body-tertiary" tabindex="-1" id="sidebarMenu" aria-labelledby="sidebarMenuLabel">
      <div class="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
        <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase">
          <span>Saved DICOMS</span>
        </h6>
        <ul class="nav flex-column mb-auto">
          <li class="nav-item">
            <div
              v-for="(dicom, index) in allDicoms"
              :key="index"
              @click="setActiveDicom(dicom)"
              class="nav-link d-flex align-items-center gap-2"
              style="cursor: pointer"
            >
              {{ dicom.name }}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {useStore} from "vuex";
import {computed} from "vue";

export default {
  setup() {
    const store = useStore();

    const allDicoms = computed(() => store.getters.getDicomPaths);

    const setActiveDicom = (dicom) => {
      store.commit("setActiveDicom", dicom);
    }

    return {
      allDicoms,
      setActiveDicom
    }
  }
}
</script>

<style scoped>

</style>