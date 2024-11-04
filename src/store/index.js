import { createStore } from 'vuex'

export default createStore({
  state: {
    activeDicom: {
      name: "DEMO 0002",
      path: "dicoms/0002.DCM"
    },
    dicomPaths: [
      {
        name: "DEMO 0002",
        path: "dicoms/0002.DCM"
      },
      {
        name: "DEMO 0003",
        path: "dicoms/0003.DCM"
      },
      {
        name: "DEMO 0004",
        path: "dicoms/0004.DCM"
      },
      {
        name: "DEMO 0009",
        path: "dicoms/0009.DCM"
      },
      {
        name: "DEMO 0012",
        path: "dicoms/0012.DCM"
      },
      {
        name: "DEMO 0020",
        path: "dicoms/0020.DCM"
      },
    ]
  },
  getters: {
    getActiveDicom: (state) => {
      return state.activeDicom;
    },
    getDicomPaths: (state) => {
      return state.dicomPaths;
    }
  },
  mutations: {
    setActiveDicom: (state, dicom) => {
      state.activeDicom = dicom;
    }
  },
})
