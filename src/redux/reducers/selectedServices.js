const selectedServices = (state = {services: []}, action) => {
  switch(action.type){
    case "ADD_SERVICE":
      return {
        ...state,
        services: [...state.services, action.payload]
      }
    case "REMOVE_SERVICE":
      return {
        ...state,
        services: state.services.filter(services => services !== action.payload)
      }
    case "ADD_ALL_SERVICES":
      return {
        ...state,
        services: action.payload
      }
    case "RESET_SERVICES":
      return {
        ...state,
        services: []
      }
    default:
      return state
  }
}

export default selectedServices
