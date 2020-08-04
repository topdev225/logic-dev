const graphOptions = (state = {
  options: []
}, action) => {
  switch(action.type){
    case "SET_GRAPH_OPTIONS":
      return {
        ...state,
        options: action.payload
      }
    default:
      return state
  }
}

export default graphOptions
