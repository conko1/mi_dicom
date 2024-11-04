<template>
  <div class="container-fluid">
    <div class="row" style="height: 100vh">
      <side-bar/>

      <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 class="h2">DICOM Displayed - {{ activeDicom.name }}</h1>
        </div>
        <dicom-viewer/>
      </main>
    </div>
  </div>
</template>

<script>
import SideBar from "@/components/SideBar.vue";
import {useStore} from "vuex";
import {computed} from "vue";
import DicomViewer from "@/components/DicomViewer.vue";

export default {
  components: {DicomViewer, SideBar},
  setup() {
    const store = useStore();

    const activeDicom = computed(() => store.getters.getActiveDicom);

    return {
      activeDicom
    }
  }
}
</script>