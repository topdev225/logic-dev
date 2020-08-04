const populatedServices = (state = {services: []}, action) => {
  switch(action.type){
    case "POPULATE_SERVICE":
      return {
        ...state,
        services: action.payload
      }
    case "REFRESH_SERVICES":
      return {
        ...state,
        services: []
      }
    default:
      return state
  }
}

export default populatedServices
