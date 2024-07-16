import React, { useRef } from 'react';
import { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Dimensions, useWindowDimensions, Button, TouchableWithoutFeedback } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { captureRef } from 'react-native-view-shot';
import { BarChart, PieChart } from "react-native-gifted-charts";
import { PDFDownloadLink, Document, Page, Image, StyleSheet as PdfStyles } from '@react-pdf/renderer';
import resultTemp from "./Alerts/employeeJSON";

const { width, height } = Dimensions.get('window');

const getPercentageWidth = (percentage, dimension) => {  // to get the dimensions of window screen
  return (percentage / 100) * dimension;
};

const calculatePercentage = (value, total) => ((value / total) * 100).toFixed(1); // to calculate the percentage of each chart category
const isDesktop = width >= 768;

const Statistics = () => {
  const [locationData, setLocationData] = useState([]);
  const [teamsData, setTeamsData] = useState([]);
  const [teamsTooltipVisible, setTeamsTooltipVisible] = useState(false);
  const [costTooltipVisible, setCostTooltipVisible] = useState(false);
  const [vendorTooltipVisible, setVendorTooltipVisible] = useState(false);
  const [jobTooltipVisible, setJobTooltipVisible] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');
  const [costData, setCostData] = useState([]);
  const [modeData, setModeData] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const [joblevelData, setJoblevelData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [capturedImages, setCapturedImages] = useState({});
  const chartRefs = useRef({});
  
  const getApiDataOperation = (result) =>{
    
    const tempTeams = {};
      result.rows.forEach(employee => {
        const teamName = employee.SubTeam.Team.name;
        const gender = employee.gender;

        if (!tempTeams[teamName]) {
          tempTeams[teamName] = { male: 0, female: 0 };
        }
        if (gender === 'M') {
          tempTeams[teamName].male++;
        } else if (gender === 'F') {
          tempTeams[teamName].female++;
        }
      });

      const TeamsChartData = Object.keys(tempTeams).map(team => ({
        team: team,
        male: tempTeams[team].male,
        female: tempTeams[team].female,
      })).filter(team => team.male > 0 || team.female > 0);
      setTeamsData(TeamsChartData);


      const tempLocation = {};
      result.rows.forEach(employee => {
        if (tempLocation[employee.job_location]) {
          tempLocation[employee.job_location]++;
        } else {
          tempLocation[employee.job_location] = 1;
        }
      });
      const lo = ['blue', 'orange'];
      const LocationChartData = Object.keys(tempLocation).map((location, loc) => ({
        value: tempLocation[location],
        label: location,
        count: tempLocation[location],
        color: lo[loc % lo.length]
      }));

      setLocationData(LocationChartData)


      const tempCost = {};
      result.rows.forEach(employee => {
        if (tempCost[employee.cost_center.cost_center]) {
          tempCost[employee.cost_center.cost_center]++;
        } else {
          tempCost[employee.cost_center.cost_center] = 1;
        }
      });
      const ge = ['orange'];
      const CostChartData = Object.keys(tempCost).map((cost, gen) => ({
        value: tempCost[cost],
        label: cost,
        count: tempCost[cost],
        frontColor: ge[gen % ge.length]
      }));
      CostChartData.sort((a, b) => b.value - a.value)
      setCostData(CostChartData)


      const tempMode = {};
      result.rows.forEach(employee => {
        if (tempMode[employee.work_mode]) {
          tempMode[employee.work_mode]++;
        } else {
          tempMode[employee.work_mode] = 1;
        }
      });
      const colors = ['green', 'orange', 'blue'];
      const ModeChartData = Object.keys(tempMode).map((mode, index) => ({
        value: tempMode[mode],
        label: mode,
        count: tempMode[mode],
        color: colors[index % colors.length]
      }));

      setModeData(ModeChartData)

      const tempGender = {};
      result.rows.forEach(employee => {
        if (tempGender[employee.gender]) {
          tempGender[employee.gender]++;
        } else {
          tempGender[employee.gender] = 1;
        }
      });

      const GenderChartData = Object.keys(tempGender).map((gender, index) => ({
        value: tempGender[gender],
        label: gender,
        count: tempGender[gender],
        color: colors[index % colors.length]
      }))
      setGenderData(GenderChartData)

      const tempVendor = {};
      result.rows.forEach(employee => {
        if (tempVendor[employee.vendor.name]) {
          tempVendor[employee.vendor.name]++;
        }
        else {
          tempVendor[employee.vendor.name] = 1;
        }
      });

      const VendorChartData = Object.keys(tempVendor).map((vendor, gen) => ({
        value: tempVendor[vendor],
        label: vendor,
        count: tempVendor[vendor],
        frontColor: ge[gen % ge.length]
      }));

      VendorChartData.sort((a, b) => b.value - a.value)
      setVendorData(VendorChartData);

      const tempJobLevel = {};
      result.rows.forEach(employee => {
        if (tempJobLevel[employee.job_level]) {
          tempJobLevel[employee.job_level]++;
        }
        else {
          tempJobLevel[employee.job_level] = 1;
        }
      });

      console.log(tempJobLevel)

      const LevelChartData = Object.keys(tempJobLevel).map((level, gen) => ({
        value: tempJobLevel[level],
        label: level,
        count: tempJobLevel[level],
        frontColor: ge[gen % ge.length]
      }));
      LevelChartData.sort((a, b) => b.value - a.value)
      setJoblevelData(LevelChartData);

  }

  const getApiData = async () => {
    try {
      const response = await fetch('http://SAJAL-GARG:3001/boston/data/employees');
      const result = await response.json();
      console.log(result);

      getApiDataOperation(result);

    } catch (error) {
      getApiDataOperation(resultTemp);
      console.log(error);
    }
  };

  useEffect(() => {
    getApiData();
  }, []);

  //total count of each category
  let totalVendorCount = 0;
  for (let i = 0; i < vendorData.length; i++) {
    totalVendorCount += vendorData[i].count;
  }

  let totalJobLevelCount = 0;
  for (let i = 0; i < joblevelData.length; i++) {
    totalJobLevelCount += joblevelData[i].count;
  }

  let totalCostCount = 0;
  for (let i = 0; i < costData.length; i++) {
    totalCostCount += costData[i].count;
  }

  let totalModeCount = 0;
  for (let i = 0; i < modeData.length; i++) {
    totalModeCount += modeData[i].count;
  }

  let totalLocationCount = 0;
  for (let i = 0; i < locationData.length; i++) {
    totalLocationCount += locationData[i].count;
  }

  let totalGenderCount = 0;
  for (let i = 0; i < genderData.length; i++) {
    totalGenderCount += genderData[i].count;
  }

  const groupedChartData = teamsData.flatMap(team => [
    team.male > 0 ? { value: team.male, label: `${team.team} `, frontColor: 'orange' } : null,
    team.female > 0 ? { value: team.female, label: `${team.team}`, frontColor: 'blue' } : null,
  ]).filter(item => item !== null);
  console.log(groupedChartData)

  const captureChart = async (chartName) => {
    try {
      const uri = await captureRef(chartRefs.current[chartName], {
        format: 'png',
        quality: 0.8,
      });
      // console.log(uri);
      setCapturedImages((prev) => ({ ...prev, [chartName]: uri }));
    } catch (error) {
      console.log('Error capturing chart:', error);
    }
  };

  const { width: screenWidth } = useWindowDimensions();

  const handleGeneratePdf = async () => {
    await captureChart('teamStatsChart');
    await captureChart('costDataChart');
    await captureChart('locationChart');
    await captureChart('modeChart');
    await captureChart('vendorChart');
    await captureChart('jobLevelChart');
    await captureChart('genderChart');

    // console.log(capturedImages);
  };

  const handleTeamsBarPress = (label) => {
    setTooltipContent(label);
    setTeamsTooltipVisible(true);
    setCostTooltipVisible(false);
    setVendorTooltipVisible(false);
    setJobTooltipVisible(false)
  };


  const handleCostBarPress = (label) => {
    setTooltipContent(label);
    setCostTooltipVisible(true);
    setTeamsTooltipVisible(false);
    setVendorTooltipVisible(false);
    setJobTooltipVisible(false)
  };

  const handleVendorBarPress = (label) => {
    setTooltipContent(label);
    setVendorTooltipVisible(true);
    setCostTooltipVisible(false);
    setTeamsTooltipVisible(false);
    setJobTooltipVisible(false)
  };

  const handleJobBarPress = (label) => {
    setTooltipContent(label);
    setVendorTooltipVisible(false);
    setCostTooltipVisible(false);
    setTeamsTooltipVisible(false);
    setJobTooltipVisible(true)
  };

  const handleOutsidePress = () => {
    setTeamsTooltipVisible(false);
    setCostTooltipVisible(false);
    setVendorTooltipVisible(false);
    setJobTooltipVisible(false)
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <ScrollView>
        <ScrollView horizontal={false}>
          <SafeAreaView style={styles.container}>
            {isDesktop ? (
              <View style={styles.desktopContainer}>
                {/* // */}
                <View style={styles.row}>
                  <View style={{
                    padding: 20,
                    width: getPercentageWidth(91, width),
                    marginTop: 10,
                    marginBottom: 10,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    backgroundColor: '#fff',
                    marginHorizontal: getPercentageWidth(0.5, width)
                  }} ref={(ref) => (chartRefs.current.teamStatsChart = ref)}>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: 'orange' }} />
                        <Text style={{ color: 'black', fontWeight: 'bold', marginLeft: 5 }}>Male</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: 'blue' }} />
                        <Text style={{ color: 'black', fontWeight: 'bold', marginLeft: 5 }}>Female</Text>
                      </View>
                    </View>

                    <BarChart
                      data={groupedChartData}
                      barWidth={30}
                      width={getPercentageWidth(91, width)}
                      spacing={20}
                      height={300}
                      xAxisThickness={0}
                      yAxisThickness={0}
                      yAxisTextStyle={{ color: 'gray' }}
                      noOfSections={3}
                      initialSpacing={10}
                      showValuesAsTopLabel={true}
                      showFractionalValues={true}
                      onPress={(item) => handleTeamsBarPress(item.label)}
                      renderTooltip={() => teamsTooltipVisible && (
                        <View style={styles.tooltipContainer}>
                          <Text style={styles.tooltipText}>{tooltipContent}</Text>
                        </View>
                      )}
                    />

                    <Text style={styles.categoryHeader}>Teams Wise Gender Diversity</Text>

                  </View>
                </View>


                <View style={styles.row}>
                  {/*  */}
                  <View style={styles.desktopChart} ref={(ref) => (chartRefs.current.vendorChart = ref)}>
                    <BarChart
                      frontColor={'#177AD5'}
                      width={getPercentageWidth(38, width)}
                      barWidth={getPercentageWidth(2.1, width)}
                      data={vendorData}
                      showValuesAsTopLabel={true}
                      onPress={(item) => handleVendorBarPress(item.label)}
                      renderTooltip={() => vendorTooltipVisible && (
                        <View style={styles.tooltipContainer}>
                          <Text style={styles.tooltipText}>{tooltipContent}</Text>
                        </View>
                      )}
                    />
                    <Text style={styles.categoryHeader}>Vendor </Text>

                  </View>
                  {/* ref={(ref) => (chartRefs.current.jobLevelChart = ref)} */}
                  <View style={styles.desktopChart} ref={(ref) => (chartRefs.current.jobLevelChart = ref)}>
                    <BarChart
                      frontColor={'#177AD5'}
                      width={getPercentageWidth(38, width)}
                      barWidth={getPercentageWidth(2.1, width)}
                      data={joblevelData}
                      showValuesAsTopLabel={true}
                      onPress={(item) => handleJobBarPress(item.label)}
                      renderTooltip={() => jobTooltipVisible && (
                        <View style={styles.tooltipContainer}>
                          <Text style={styles.tooltipText}>{tooltipContent}</Text>
                        </View>
                      )}
                    />
                    <Text style={styles.categoryHeader}>Job Level </Text>

                  </View>
                </View>
                <View style={styles.row}>

                  <View style={styles.desktopChart} ref={(ref) => (chartRefs.current.costDataChart = ref)}>
                    <BarChart
                      data={costData}
                      width={getPercentageWidth(38, width)}
                      height={300}
                      barWidth={getPercentageWidth(2.2, width)}
                      spacing={getPercentageWidth(1.5, width)}
                      showLegend
                      showValuesAsTopLabel={true}
                      onPress={(item) => handleCostBarPress(item.label)}
                      renderTooltip={() => costTooltipVisible && (
                        <View style={styles.tooltipContainer}>
                          <Text style={styles.tooltipText}>{tooltipContent}</Text>
                        </View>
                      )}
                    />
                    <Text style={styles.categoryHeader}>Cost Center </Text>

                  </View>

                  <View style={styles.desktopChart} ref={(ref) => (chartRefs.current.genderChart = ref)} >
                    <PieChart
                      data={genderData}
                      width={300}
                      height={300}
                      radius={120}
                      isAnimated
                      animationDuration={500}
                      showValuesAsLabels={true}
                      labelsPosition='outward'
                      showText={true}
                    />
                    <Text style={styles.categoryHeader}>Gender Diversity</Text>
                    {genderData.map((gender, index) => (
                      <Text key={index} style={styles.categoryItem}>{gender.label} : {gender.count} ({calculatePercentage(gender.count, totalGenderCount)}%)</Text>
                    ))}
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.desktopChart} ref={(ref) => (chartRefs.current.locationChart = ref)}>
                    <PieChart
                      data={locationData}
                      width={300}
                      height={300}
                      radius={120}
                      isAnimated
                      animationDuration={500}
                      showValuesAsLabels={true}
                      labelsPosition='outward'
                      showText={true}
                    />
                    <Text style={styles.categoryHeader}>Job-Location </Text>
                    {locationData.map((location, index) => (
                      <Text key={index} style={styles.categoryItem}>{location.label} : {location.count} ({calculatePercentage(location.count, totalLocationCount)}%)</Text>
                    ))}
                  </View>
                  {/* ref={(ref) => (chartRefs.current.teamsChart = ref)} */}
                  <View style={styles.desktopChart} ref={(ref) => (chartRefs.current.modeChart = ref)}>
                    <PieChart
                      data={modeData}
                      width={300}
                      height={300}
                      radius={120}
                      isAnimated
                      animationDuration={500}
                      showValuesAsLabels={true}
                      labelsPosition='outward'
                      showText={true}
                    />
                    <Text style={styles.categoryHeader}>Work Mode </Text>
                    {modeData.map((mode, index) => (
                      <Text key={index} style={styles.categoryItem}>{mode.label} : {mode.count} ({calculatePercentage(mode.count, totalModeCount)}%)</Text>
                    ))}
                  </View>
                </View>
                <View style={{ marginBottom: 5 }}>
                  <Button title="Generate PDF" onPress={handleGeneratePdf} color="#086A96"/>
                  {capturedImages.teamStatsChart && (
                    <PDFDownloadLink
                      document={<PdfDocument images={capturedImages} />}
                      fileName="charts.pdf"
                    >

                      {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
                    </PDFDownloadLink>
                  )}
                </View>
              </View>
            ) : (
              // Mobile view
              <View >
                {/* // */}

                <View style={styles.chart} ref={(ref) => (chartRefs.current.teamStatsChart = ref)}>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                      <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: 'orange' }} />
                      <Text style={{ color: 'black', fontWeight: 'bold', marginLeft: 5 }}>Male</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: 'blue' }} />
                      <Text style={{ color: 'black', fontWeight: 'bold', marginLeft: 5 }}>Female</Text>
                    </View>
                  </View>

                  <BarChart
                    data={groupedChartData}
                    barWidth={15}
                    width={getPercentageWidth(65, width)}
                    spacing={10}
                    height={300}
                    roundedTop
                    xAxisThickness={0}
                    yAxisThickness={0}
                    yAxisTextStyle={{ color: 'gray' }}
                    noOfSections={3}
                    initialSpacing={10}
                    showValuesAsTopLabel={true}
                    showFractionalValues={true}
                    onPress={(item) => handleTeamsBarPress(item.label)}
                    renderTooltip={() => teamsTooltipVisible && (
                      <View style={styles.tooltipContainer}>
                        <Text style={styles.tooltipText}>{tooltipContent}</Text>
                      </View>
                    )}
                  />
                  <Text style={styles.categoryHeader}>Teams Wise Gender Diversity</Text>

                </View>

                <View style={styles.chart} ref={(ref) => (chartRefs.current.costDataChart = ref)}>
                  <BarChart
                    data={costData}
                    width={getPercentageWidth(65, width)}
                    height={300}
                    barWidth={22}
                    spacing={20}
                    showLegend
                    showValuesAsTopLabel={true}
                    onPress={(item) => handleCostBarPress(item.label)}
                    renderTooltip={() => costTooltipVisible && (
                      <View style={styles.tooltipContainerMob}>
                        <Text style={styles.tooltipText}>{tooltipContent}</Text>
                      </View>
                    )}
                  />
                  <Text style={styles.categoryHeader}>Cost Center </Text>

                </View>

                <View style={styles.chart} ref={(ref) => (chartRefs.current.vendorChart = ref)}>
                  <BarChart
                    frontColor={'#177AD5'}
                    barWidth={22}
                    data={vendorData}
                    width={getPercentageWidth(65, width)}
                    onPress={(item) => handleVendorBarPress(item.label)}
                    renderTooltip={() => vendorTooltipVisible && (
                      <View style={styles.tooltipContainerMob}>
                        <Text style={styles.tooltipText}>{tooltipContent}</Text>
                      </View>
                    )}
                  />
                  <Text style={styles.categoryHeader}>Vendor</Text>

                </View>
                {/* ref={(ref) => (chartRefs.current.jobLevelChart = ref)} */}
                <View style={styles.chart} ref={(ref) => (chartRefs.current.jobLevelChart = ref)}>
                  <BarChart
                    frontColor={'#177AD5'}
                    barWidth={22}
                    data={joblevelData}
                    width={getPercentageWidth(65, width)}
                    onPress={(item) => handleJobBarPress(item.label)}
                    renderTooltip={() => jobTooltipVisible && (
                      <View style={styles.tooltipContainerMob}>
                        <Text style={styles.tooltipText}>{tooltipContent}</Text>
                      </View>
                    )}
                  />
                  <Text style={styles.categoryHeader}>Job Level</Text>

                </View>

                {/*  */}

                <View style={styles.chart} ref={(ref) => (chartRefs.current.locationChart = ref)}>
                  <PieChart
                    data={locationData}
                    width={300}
                    height={300}
                    radius={120}
                    isAnimated
                    animationDuration={500}
                    showValuesAsLabels={true}
                    labelsPosition='outward'
                    showText={true}
                  />
                  <Text style={styles.categoryHeader}>Job-Location </Text>
                  {locationData.map((location, index) => (
                    <Text key={index} style={styles.categoryItem}>{location.label} : {location.count} ({calculatePercentage(location.count, totalLocationCount)}%)</Text>
                  ))}
                </View>
                {/* ref={(ref) => (chartRefs.current.teamsChart = ref)} */}
                <View style={styles.chart} ref={(ref) => (chartRefs.current.modeChart = ref)}>
                  <PieChart
                    data={modeData}
                    width={300}
                    height={300}
                    radius={120}
                    isAnimated
                    animationDuration={500}
                    showValuesAsLabels={true}
                    labelsPosition='outward'
                    showText={true}
                  />
                  <Text style={styles.categoryHeader}>Work Mode </Text>
                  {modeData.map((mode, index) => (
                    <Text key={index} style={styles.categoryItem}>{mode.label} : {mode.count} ({calculatePercentage(mode.count, totalModeCount)}%)</Text>
                  ))}
                </View>
                <View style={styles.chart} ref={(ref) => (chartRefs.current.genderChart = ref)}>
                  <PieChart
                    data={genderData}
                    width={300}
                    height={300}
                    radius={120}
                    isAnimated
                    animationDuration={500}
                    showValuesAsLabels={true}
                    labelsPosition='outward'
                    showText={true}
                  />
                  <Text style={styles.categoryHeader}>Gender Diversity</Text>
                  {genderData.map((gender, index) => (
                    <Text key={index} style={styles.categoryItem}>{gender.label} : {gender.count} ({calculatePercentage(gender.count, totalGenderCount)}%)</Text>
                  ))}

                </View>
                <View style={{ marginBottom: 10, width: getPercentageWidth(40, width), alignItems: "center", marginLeft: getPercentageWidth(32, width) }}>
                  <Button title="Generate PDF" onPress={handleGeneratePdf} color="#086A96" />
                  {capturedImages.teamStatsChart && (
                    <PDFDownloadLink
                      document={<PdfDocument images={capturedImages} />}
                      fileName="charts.pdf"
                    >

                      {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
                    </PDFDownloadLink>
                  )}
                </View>
              </View>

            )}
          </SafeAreaView>
        </ScrollView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const PdfDocument = ({ images }) => (
  <Document>
    <Page style={pdfStyles.page1}>
      {images.teamStatsChart && <Image src={images.teamStatsChart} style={isDesktop ? (pdfStyles.imageDex) : (pdfStyles.image3)} />}
      {images.costDataChart && <Image src={images.costDataChart} style={isDesktop ? (pdfStyles.imageDex) : (pdfStyles.image3)} />}
      {images.vendorChart && <Image src={images.vendorChart} style={isDesktop ? (pdfStyles.imageDex) : (pdfStyles.image)} />}
      {images.jobLevelChart && <Image src={images.jobLevelChart} style={isDesktop ? (pdfStyles.imageDex) : (pdfStyles.image)} />}

      {/* {images.teamsChart && <Image src={images.teamsChart} style={pdfStyles.image} />}
      {images.vendorChart && <Image src={images.vendorChart} style={pdfStyles.image} />}
      {images.jobLevelChart && <Image src={images.jobLevelChart} style={pdfStyles.image} />} */}
    </Page>
    <Page style={pdfStyles.page}>
      {/* {images.genderChart && <Image src={images.genderChart} style={pdfStyles.image} />}
      {images.modeChart && <Image src={images.modeChart} style={pdfStyles.image} />}
      {images.locationChart && <Image src={images.locationChart} style={pdfStyles.image} />} */}
      {images.genderChart && <Image src={images.genderChart} style={isDesktop ? (pdfStyles.image2Dex) : (pdfStyles.image2)} />}
      {images.modeChart && <Image src={images.modeChart} style={isDesktop ? (pdfStyles.image2Dex) : (pdfStyles.image2)} />}
      {images.locationChart && <Image src={images.locationChart} style={isDesktop ? (pdfStyles.image2Dex) : (pdfStyles.image2)} />}

    </Page>
  </Document>
);

const pdfStyles = PdfStyles.create({
  page1: {
    marginLeft: 100,
    flexDirection: 'column',
    backgroundColor: '#ffffff'
  },
  page: {
    marginLeft: 67,
    flexDirection: 'column',
    backgroundColor: '#ffffff'
  },
  image: {
    margin: 10,
    width: 370,
    height: 400
  },
  image3: {
    margin: 10,
    width: 370,
    height: 800
  },
  imageDex: {
    margin: 10,
    width: 370,
    height: 400
  },
  image2: {
    margin: 10,
    width: 400,
    height: 400
  },
  image2Dex: {
    margin: 10,
    width: 400,
    height: 250
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    backgroundColor: 'white',
    marginTop: 10,
    width: "100%",
    marginLeft: 40
  },
  tooltipContainer: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 6,
    borderRadius: 4,
    marginBottom: -40

  },
  tooltipText: {
    color: 'white',
  },
  tooltipContainerMob: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 6,
    borderRadius: 4,
    marginBottom: -30
  },
  chart: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: "center",
    alignItems: "center",
    width: getPercentageWidth(85, width),
    marginHorizontal: getPercentageWidth(8, width),
    marginBottom: 10
  },
  categoryList: {
    flex: 1,
    marginLeft: 20,
  },
  categoryHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: "center",
    marginBottom: 10,
    marginTop: 20
  },
  categoryItem: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold"
  },
  teamItem: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
    margin: 15
  },
  desktopChart: {
    padding: 20,
    width: getPercentageWidth(45, width),
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginHorizontal: getPercentageWidth(0.5, width)
  },
  BarChart: {
    padding: 20,
    width: getPercentageWidth(45, width),
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginHorizontal: getPercentageWidth(0.5, width),
  },
  desktopContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginHorizontal: getPercentageWidth(2.5, width)
  },
  categoryDesPie: {
    fontSize: 14,
    marginBottom: 5,
    flex: 1, // each text will take up equal space in the row
    textAlign: "center",
    fontWeight: "bold",
    margin: 10
  },
  textRowContainer: {
    flexDirection: 'row', // arrange children in a row
    flexWrap: 'wrap', // wrap to the next line if the text doesn't fit in one row
    justifyContent: "space-evenly",
    marginBottom: 10 // optional, to add space between texts
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  }
});

export default Statistics;
