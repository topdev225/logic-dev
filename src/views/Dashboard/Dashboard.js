import React from 'react';
import WritePermissionOptions from './WritePermissionOptions'
import DashboardTabsContainer from './DashboardTabsContainer'
import {useSelector, useDispatch} from 'react-redux'
import allActions from '../../redux/actions'



export default function Dashboard(props) {

    const fetchedDashboardData = useSelector(state => state.fetchedDashboardData)
    const aChangeHasBeenMade = useSelector(state => state.aChangeHasBeenMade)

    const dispatch = useDispatch()

    const [currentLayoutInstance, setCurrentLayoutInstance] = React.useState(null);
    const [currentlySelectedDashboardName, setCurrentlySelectedDashboardName] = React.useState(null);
    const [thereIsData, setThereIsData] = React.useState(null);
    const [tabValue, setTabValue] = React.useState(0);
    const [allChartData, setAllChartData] = React.useState(null)
    const [dashboardCanRender, setDashboardCanRender] = React.useState(false)

    const [startDate, setStartDate] = React.useState(new Date(new Date().setHours(0,0,0)))
    const [endDate, setEndDate] = React.useState(new Date())

    function setDate(dateType, date){
      if(dateType === 'startDate'){
        setStartDate(date)
      } else if(dateType === 'endDate'){
        setEndDate(date)
      }
    }

    const setFetchedDashboardData = React.useRef(null);






    //Used in step 2 and renderGraphsForCurrentlySelectedDashboard
    async function handleGraphDataFetchUsingSelectedOptions(devices, services, onload){

      let fetchedData = []
      for(let i=0; i<devices.devices.length; i++){
        for(let index=0; index<services.services.length; index++){
          await fetch(`${process.env.REACT_APP_FETCH_URL}`,{
            headers: {
              function: 'wizardservices',
              devicename: devices.devices[i].deviceName,
              servicename: services.services[index],
              organization: devices.devices[i].orgName,
              timezome: Intl.DateTimeFormat().resolvedOptions().timeZone,
              enddate: endDate.toString(),
              startdate: startDate.toString()
            }
          })
          .then((res) => {
            return res.json()})
          .then((json) => {
            fetchedData.push(json)
          })
        }
      }
      let filterNullValuesOutOfData = fetchedData.filter(obj => obj['data'])

      dispatch(allActions.dashboardActions.populateData(filterNullValuesOutOfData))
      if(onload){
        return { data: filterNullValuesOutOfData }
      }
    }





    //Used in step 3 and renderGraphsForCurrentlySelectedDashboard
    //Place objects for all unique services in selectedServicesInUse array
    //This for loop finds first object with matching service from selectedServices array
    //The reason only one is needed is for the subsequent seriesOptions object which will contain all series that belong to each service
    function selectedServicesInUse(services, fetchedWizardData){
      let selectedServicesInUseArr = []
      for(let i=0; i<services.services.length; i++){
        if(fetchedWizardData.data.find(obj => obj.info.displayName === services.services[i])){
          selectedServicesInUseArr.push(fetchedWizardData.data.find(obj => obj.info.displayName === services.services[i]))
        }
      }
      return selectedServicesInUseArr
    }






    //Used in step 3 and renderGraphsForCurrentlySelectedDashboard
    //Determine all series names that belong to each service and add to seriesOptions object
    function seriesOptions(services, data){
      let seriesOptions = {}
      let selectedServicesInUseResult = selectedServicesInUse(services, data)
      for(let selectedServicesIndex=0; selectedServicesIndex<selectedServicesInUseResult.length; selectedServicesIndex++){
        let seriesNames = []
        for(let seriesIndex=0; seriesIndex<selectedServicesInUseResult[selectedServicesIndex].data.length; seriesIndex++){
          let target = selectedServicesInUseResult[selectedServicesIndex].data[seriesIndex].target
          let sliceLastPeriod = target.slice(0, target.lastIndexOf('.'))
          let seriesName = sliceLastPeriod.slice(sliceLastPeriod.lastIndexOf('.')+1)
          seriesNames.push(seriesName)
        }
        seriesOptions[selectedServicesInUseResult[selectedServicesIndex].info.displayName] = seriesNames
      }
      return seriesOptions
    }






    //Used in step 5 and renderGraphsForCurrentlySelectedDashboard
    //combine series strings from selectedSeries object into one array to use for filtering unused series out of fetchedWizardData
    function combinedSelectedSeries(series){
      let combinedSelectedSeriesArr = []
      for(let i=0; i<Object.keys(series).length; i++){
        for(let index=0; index<series[Object.keys(series)[i]].length; index++){
          combinedSelectedSeriesArr.push(series[Object.keys(series)[i]][index])
        }
      }
      return combinedSelectedSeriesArr
    }






    //Used in step 5 and renderGraphsForCurrentlySelectedDashboard
    //compare the series names in the data objects to those which have been populated in the combinedSelectedSeries array
    //and filter unused series items out of fetchedWizardData object
    //then use color json to add color key to each series
    //then add graphOptions to returned json
    function fetchedWizardDataCopy(series, fetchedWizardData, colorJSON, graphOptions){
      let fetchedWizardDataCopyObj = JSON.parse(JSON.stringify(fetchedWizardData))
      for(let dataObjectIndex=0; dataObjectIndex<fetchedWizardData.data.length; dataObjectIndex++){
        let selectedSeriesAfterFilter = []
        for(let seriesOptionsIndex=0; seriesOptionsIndex<fetchedWizardData.data[dataObjectIndex].data.length; seriesOptionsIndex++){
          let seriesOption = fetchedWizardData.data[dataObjectIndex].data[seriesOptionsIndex].target
          let sliceLastPeriod = seriesOption.slice(0, seriesOption.lastIndexOf('.'))
          let seriesName = sliceLastPeriod.slice(sliceLastPeriod.lastIndexOf('.')+1)
            if(combinedSelectedSeries(series).includes(seriesName)){
              selectedSeriesAfterFilter.push(fetchedWizardData.data[dataObjectIndex].data[seriesOptionsIndex])
            }
        }
        fetchedWizardDataCopyObj.data[dataObjectIndex].data = selectedSeriesAfterFilter
      }
      for(let serviceObjects=0; serviceObjects<fetchedWizardDataCopyObj.data.length; serviceObjects++){
        for(let seriesObjects=0; seriesObjects<fetchedWizardDataCopyObj.data[serviceObjects].data.length; seriesObjects++){
          let seriesColors = colorJSON[fetchedWizardDataCopyObj.data[serviceObjects].info.displayName]
          let target = fetchedWizardDataCopyObj.data[serviceObjects].data[seriesObjects].target
          let sliceLastPeriodFromTarget = target.slice(0, target.lastIndexOf('.'))
          let seriesNameFromSlice = sliceLastPeriodFromTarget.slice(sliceLastPeriodFromTarget.lastIndexOf('.')+1)
          fetchedWizardDataCopyObj.data[serviceObjects].data[seriesObjects]['color'] = seriesColors[seriesNameFromSlice]
        }
      }
      fetchedWizardDataCopyObj['graphOptions'] = graphOptions
      return fetchedWizardDataCopyObj
    }









    function handleSetFetchedDashboards(dashboardsArray, dashboardIndex){
      if(!!dashboardsArray.length){
        dispatch(allActions.dashboardActions.originallyFetchedDashboardData(dashboardsArray))
        dispatch(allActions.dashboardActions.modifiableDashboardData(dashboardsArray))
        let chartDataArray = JSON.parse(dashboardsArray[dashboardIndex].dashboard_json).chart_data
        setAllChartData(chartDataArray)
        renderGraphsForCurrentlySelectedDashboard(chartDataArray)
      } else {
        setAllChartData(dashboardsArray)
        setDashboardCanRender(true)
      }
    }







    async function renderGraphsForCurrentlySelectedDashboard(chartDataArr){
      let arrayOfAllChartData = []
      for(let i=0; i<chartDataArr.length; i++){
        let devices = chartDataArr[i].devices
        let services = chartDataArr[i].services
        let series = chartDataArr[i].series
        let name = chartDataArr[i].name
        let colors = chartDataArr[i].colors
        let getFetchedWizardData = await handleGraphDataFetchUsingSelectedOptions(devices, services, true)
        await selectedServicesInUse(services, getFetchedWizardData)
        await seriesOptions(services, getFetchedWizardData)
        await combinedSelectedSeries(series)
        let newData = await fetchedWizardDataCopy(series, getFetchedWizardData, colors)
        newData["name"] = name
        arrayOfAllChartData.push(newData)
      }
      //set state with fetched data from currently selected dashboard
      await setAllChartData(arrayOfAllChartData)
      setDashboardCanRender(true)
    }




    //Functions for users with write permissions that are necessary to be at this level

    const [dialogueOpenState, setDialogueOpenState] = React.useState(false);
    const handleDialogueOpen = () => {
      setDialogueOpenState(true);
    };

    const handleDialogueClose = () => {
      setDialogueOpenState(false);
    };

    function setOptionsInWizardOnClickOfEditButton(icon, dashboardData, tabIndex){
      let panelTitle = icon.parentElement.parentElement.firstElementChild.firstElementChild.title
      let currentDashboardObject = dashboardData[tabIndex]
      let parsedDashboard = JSON.parse(currentDashboardObject.dashboard_json)
      let currentPanelObject = parsedDashboard.chart_data.find(json => json.name === panelTitle)
      let currentPanelIndex = parsedDashboard.chart_data.indexOf(currentPanelObject)
      dispatch(allActions.dashboardActions.panelIsBeingEdited(true, currentPanelIndex))
      dispatch(allActions.dashboardActions.addAllOrganizations(currentPanelObject.organizations.organizations))
      dispatch(allActions.dashboardActions.addAllDevices(currentPanelObject.devices.devices))
      dispatch(allActions.dashboardActions.toggleServices(true))
      dispatch(allActions.dashboardActions.addAllServices(currentPanelObject.services.services))
      dispatch(allActions.dashboardActions.addAllSeries(currentPanelObject.series))
      dispatch(allActions.dashboardActions.namePanel(currentPanelObject.name))
      dispatch(allActions.dashboardActions.restoreSeriesColors(currentPanelObject.colors))
      handleGraphDataFetchUsingSelectedOptions(currentPanelObject.devices, currentPanelObject.services)
      handleDialogueOpen()
    }




    return (

      <div>

          <WritePermissionOptions
            organizationdisplaynames={props.organizationdisplaynames}
            organizations={props.organizations}
            clusteraccessjoined={props.clusteraccessjoined}
            handlegraphdatafetchusingselectedoptions={handleGraphDataFetchUsingSelectedOptions}
            selectedservicesinuse={selectedServicesInUse}
            seriesoptions={seriesOptions}
            combinedselectedseries={combinedSelectedSeries}
            fetchedwizarddata={fetchedWizardDataCopy}
            setthereisdata={setThereIsData}
            selecteddashboard={currentlySelectedDashboardName}
            tabvalue={tabValue}
            thereisdata={thereIsData}
            currentlayout={currentLayoutInstance}
            fetcheddashboarddata={fetchedDashboardData}
            achangehasbeenmade={aChangeHasBeenMade}
            startdate={startDate}
            enddate={endDate}
            setdate={setDate}
            open={dialogueOpenState}
            handleopen={handleDialogueOpen}
            handleclose={handleDialogueClose}
            setchartdata={setAllChartData}
            getchartdata={renderGraphsForCurrentlySelectedDashboard}
          />


          { props.useremail &&

              <DashboardTabsContainer
                setcurrentlayoutinstance={setCurrentLayoutInstance}
                useremail={props.useremail}
                setdashboardname={setCurrentlySelectedDashboardName}
                currentlyselecteddashboardname={currentlySelectedDashboardName}
                tabvalue={tabValue}
                settabvalue={setTabValue}
                handlesetfetcheddashboards={handleSetFetchedDashboards}
                currentlayout={currentLayoutInstance}
                thereisdata={thereIsData}
                allchartdata={allChartData}
                setfetcheddashboarddata={setFetchedDashboardData}
                dashboardcanrender={dashboardCanRender}
                setdashboardcanrender={setDashboardCanRender}
                setoptionsinwizardonclickofeditbutton={setOptionsInWizardOnClickOfEditButton}
                dashboarddata={fetchedDashboardData.modifiableDashboardData}
              />

          }

      </div>

    );

}
