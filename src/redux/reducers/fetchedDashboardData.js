const fetchedDashboardData = (state = {
  originallyFetchedDashboardData: null,
  modifiableDashboardData: null
}, action) => {
  switch(action.type){
    case "SET_ORIGINAL_DATA":
      return {
        ...state,
        originallyFetchedDashboardData: action.payload
      }
    case "SET_MODIFIABLE_DATA":
      return {
        ...state,
        modifiableDashboardData: action.payload
      }
    default:
      return state
  }
}

export default fetchedDashboardData
