<template>
  <div class="w-100 d-flex justify-content-center">
    <div class="d-flex flex-column">
      <div class="mt-3">
        <label for="customRange1" class="form-label">Move to change frame - Min:1, Max:{{totalSlices}}, Current:{{currentSliceIndex}}</label>
        <input
          type="range"
          class="form-range"
          id="customRange1"
          min="1"
          :max="totalSlices"
          v-model="currentSliceIndex"
          @input="loadDicomImage()"
        >
      </div>
      <div ref="dicomImageRef" class="dicom-image" style="width: 600px; height: 600px; border: 1px solid black;"></div>
    </div>
  </div>
</template>

<script>
import * as cornerstone from "cornerstone-core";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as dicomParser from "dicom-parser";
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";

export default {
  name: "DicomViewer",
  setup() {
    // Referencia na DOM element, v ktorom bude vykreslený DICOM obrázok
    const dicomImageRef = ref(null);
    // Prístup k vuex storu pre získavanie zmien o aktívnom DICOM obrázku
    const store = useStore();

    // Premenná pre označenie či je cornerstone.js načítaný do div elementu
    var loaded = false;

    // Pomocné premenné pre sledovanie frameov
    const currentSliceIndex = ref(1);
    const totalSlices = ref(1);

    // Prostriedok pre zabezpečenie reaktivity pre sledovanie zmien nad activeDicom premennou vo vuex store
    const activeDicomPath = computed(() => store.state.activeDicom.path);

    // Konfigurácia cornerstoneWADOImageLoader
    const initializeCornerstone = () => {
      cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
      cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
      cornerstoneWADOImageLoader.configure({
        maxWebWorkers: 4,
        startWebWorkersOnDemand: true,
        webWorkerTaskPaths: [],
        taskConfiguration: {
          decodeTask: {
            initializeCodecsOnStartup: true,
            strict: true,
          },
        },
      })
    };

    // Asynchrónna funkcia pre načítanie DICOM obrázka
    const loadDicomImage = async (path = activeDicomPath.value) => {
      try {
        // Vytvorenie identifikátora obrázka pomocou URI a načítanie obrázka do cache
        const imageId = `wadouri:${path}?frame=${currentSliceIndex.value}`;
        const image = await cornerstone.loadAndCacheImage(imageId);

        // Ukladanie počtu frameov do premennej
        if (image.data.string('x00280008')) {
          totalSlices.value = image.data.string('x00280008') - 1;
        } else {
          totalSlices.value = 1;
        }

        // Zobrazenie načítaného obrázka v DICOM elemente
        cornerstone.displayImage(dicomImageRef.value, image);

        // Optimalizácia viewportu pre zobrazenie celého DICOM obrázku do elementu
        const viewport = cornerstone.getDefaultViewportForImage(dicomImageRef.value, image);
        viewport.scale = Math.min(
          dicomImageRef.value.clientWidth / image.width,
          dicomImageRef.value.clientHeight / image.height
        );
        cornerstone.setViewport(dicomImageRef.value, viewport);
      } catch (error) {
        // Zaznamenanie chyby pri načítavaní DICOM obrázka
        console.error("Error loading DICOM image:", error);
      }
    };

    // Sledovanie zmeny cesty k DICOM súboru, resetovanie indexu frameu
    watch(
      activeDicomPath,
      (newPath) => {
        if (loaded && newPath) {
          currentSliceIndex.value = 1;
          loadDicomImage(newPath);
        }
      },
      { immediate: true }
    );

    // Keď je komponent vložený do DOM, zavolá sa initializeCornerstone() a načíta defaultný DICOM obrázok
    onMounted(() => {
      initializeCornerstone();
      if (dicomImageRef.value) {
        loaded = true;
        // Nalinkovanie comberstone.js knižnice na div element v DOM
        cornerstone.enable(dicomImageRef.value);
        // Načítanie obrázka podľa defaultnej cesty
        loadDicomImage(activeDicomPath.value);
      }
    });

    return {
      dicomImageRef,
      totalSlices,
      currentSliceIndex,
      loadDicomImage
    };
  }
};
</script>
