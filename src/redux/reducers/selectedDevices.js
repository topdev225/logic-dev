const selectedDevices = (state = {devices: []}, action) => {
  switch(action.type){
    case "ADD_DEVICE":
      return {
        ...state,
        devices: [...state.devices, action.payload]
      }
    case "REMOVE_DEVICE":
      return {
        ...state,
        devices: state.devices.filter(device => device.displayName !== action.payload)
      }
    case "ADD_ALL_DEVICES":
      return {
        ...state,
        devices: action.payload
      }
    case "RESET_DEVICES":
      return {
        ...state,
        devices: []
      }
    default:
      return state
  }
}

export default selectedDevices
