const setDataDisplayType = (displayType) => {
  return {
    type: "SET_DATA_DISPLAY_TYPE",
    payload: displayType
  }
}




const addOrganization = (displayName, orgName) => {
  return {
    type: "ADD_ORGANIZATION",
    payload: {displayName: displayName, orgName: orgName}
  }
}
const removeOrganization = (displayName) => {
  return {
    type: "REMOVE_ORGANIZATION",
    payload: displayName
  }
}
const resetOrganizations = () => {
  return {
    type: "RESET_ORGANIZATIONS"
  }
}
const addAllOrganizations = (organizations) => {
  return {
    type: "ADD_ALL_ORGANIZATIONS",
    payload: organizations
  }
}




const addDevice = (displayName, deviceName, orgName) => {
  return {
    type: "ADD_DEVICE",
    payload: {displayName: displayName, deviceName: deviceName, orgName: orgName}
  }
}
const removeDevice = (displayName) => {
  return {
    type: "REMOVE_DEVICE",
    payload: displayName
  }
}
const resetDevices = () => {
  return {
    type: "RESET_DEVICES"
  }
}
const addAllDevices = (devices) => {
  return {
    type: "ADD_ALL_DEVICES",
    payload: devices
  }
}




const addService = (serviceName) => {
  return {
    type: "ADD_SERVICE",
    payload: serviceName
  }
}
const removeService = (serviceName) => {
  return {
    type: "REMOVE_SERVICE",
    payload: serviceName
  }
}
const resetServices = () => {
  return {
    type: "RESET_SERVICES"
  }
}
const addAllServices = (services) => {
  return {
    type: "ADD_ALL_SERVICES",
    payload: services
  }
}



const populateService = (serviceArray) => {
  return {
    type: "POPULATE_SERVICE",
    payload: serviceArray
  }
}
const refreshServices = () => {
  return {
    type: "REFRESH_SERVICES"
  }
}




const addSeries = (seriesInfo) => {
  return {
    type: "ADD_SERIES",
    payload: seriesInfo
  }
}
const removeSeries = (seriesInfo) => {
  return {
    type: "REMOVE_SERIES",
    payload: seriesInfo
  }
}
const addServicesToSelectedSeries = (services) => {
  return {
    type: "ADD_SERVICES_TO_SELECTED_SERIES",
    payload: services
  }
}
const resetSeries = () => {
  return {
    type: "RESET_SERIES"
  }
}
const addAllSeries = (series) => {
  return {
    type: "ADD_ALL_SERIES",
    payload: series
  }
}




const toggleServices = (bool) => {
  return {
    type: "TOGGLE_SERVICES",
    payload: bool
  }
}




const populateData = (data) => {
  return {
    type: "POPULATE_DATA",
    payload: data
  }
}
const refreshData = () => {
  return {
    type: "REFRESH_DATA"
  }
}




const namePanel = (text) => {
  return {
    type: "CHANGE_NAME",
    payload: text
  }
}




const originallyFetchedDashboardData = (data) => {
  return {
    type: "SET_ORIGINAL_DATA",
    payload: data,
  }
}
const modifiableDashboardData = (data) => {
  return {
    type: "SET_MODIFIABLE_DATA",
    payload: data,
  }
}


const setCompletedLayoutChange = (bool) => {
  return {
    type: "IS_LAYOUT_CHANGE_FINISHED",
    payload: bool
  }
}




const setIfChangeHasBeenMadeToLayout = (bool) => {
  return {
    type: "A_CHANGE_HAS_BEEN_MADE",
    payload: bool
  }
}




const addServiceToSeriesColors = (service) => {
  return {
    type: "ADD_SERVICE_TO_SERIES_COLORS",
    payload: service
  }
}


const setSeriesColor = (service, series, color) => {
  return {
    type: "SET_SERIES_COLOR",
    payload: {service: service, series: series, color: color}
  }
}


const restoreSeriesColors = (colorsObj) => {
  return {
    type: "RESTORE_SERIES_COLORS",
    payload: colorsObj
  }
}



const setGraphOptions = (newGraphOptions) => {
  return {
    type: "SET_GRAPH_OPTIONS",
    payload: newGraphOptions
  }
}



const panelIsBeingEdited = (bool, num) => {
  return {
    type: "PANEL_IS_BEING_EDITED",
    payload: {value: bool, index: num}
  }
}



const panelEditToggle = (bool) => {
  return {
    type: "PANEL_EDIT_TOGGLE",
    payload: bool
  }
}


const panelIsBeingAdded = (bool) => {
  return {
    type: "PANEL_IS_BEING_ADDED",
    payload: bool
  }
}

const panelIsBeingDeleted = (bool) => {
  return {
    type: "PANEL_IS_BEING_DELETED",
    payload: bool
  }
}



export default {
  setDataDisplayType,
  addOrganization,
  removeOrganization,
  addDevice,
  removeDevice,
  addService,
  removeService,
  addSeries,
  removeSeries,
  addServicesToSelectedSeries,
  populateService,
  refreshServices,
  populateData,
  refreshData,
  toggleServices,
  namePanel,
  originallyFetchedDashboardData,
  modifiableDashboardData,
  setCompletedLayoutChange,
  setIfChangeHasBeenMadeToLayout,
  resetOrganizations,
  resetDevices,
  resetServices,
  resetSeries,
  addAllOrganizations,
  addAllServices,
  addAllDevices,
  addAllSeries,
  addServiceToSeriesColors,
  setSeriesColor,
  setGraphOptions,
  restoreSeriesColors,
  panelIsBeingEdited,
  panelEditToggle,
  panelIsBeingAdded,
  panelIsBeingDeleted
}
