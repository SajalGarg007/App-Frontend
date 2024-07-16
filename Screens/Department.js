// import React from 'react';
import React, { useRef } from 'react';

import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
    ScrollView,
    SafeAreaView,
    FlatList,
    SectionList,
    StatusBar,
    Modal,
    Button
} from 'react-native';
import { Divider, Searchbar } from "react-native-paper";
import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import DivisionData from './Alerts/employeeByDivision';

const { width, height } = Dimensions.get('window');

const getPercentageWidth = (percentage, dimension) => {
    return (percentage / 100) * dimension;
};

const isDesktop = width >= 768;

const Department = () => {
    const [searchText, setSearchText] = useState('');
    const headers = [
        'First Name', 'Last Name', 'Employment Type', 'Employee ID',
        'Designation', 'Reporting Manager', 'Vendor',
        'Location', 'Work Mode', 'Job Level', 'Cost Center',
        , 'Gender'
    ];
    const DesktopView = ({ Data }) => {
        console.log("Department desktop view data");
        console.log(Data);


        const tableData = [
            Data.first_name,
            Data.last_name,
            Data.employeement_type,
            Data.employee_id,
            Data.designation.name,
            Data.reportingManager ? `${Data.reportingManager.first_name} ${Data.reportingManager.last_name}` : 'N.A',
            Data.vendor.name,
            // Data.SubTeam.Team.name,
            // Data.SubTeam.name,
            Data.job_location,
            Data.work_mode,
            Data.job_level,
            Data.cost_center.cost_center,
            Data.gender,
            // Data.SubTeam.Team.active
        ];
        

        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                <ScrollView horizontal={true}>
                    <View style={styles.containerDex}>
                        <Table borderStyle={{ borderColor: 'white' }}>
                            <View style={styles.containerDesktop}>
                                {tableData.map((item, index) => (
                                    <View key={index} style={styles.itemContainer}>
                                        <Text style={styles.itemTextNewDex}>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        </Table>
                    </View>
                </ScrollView>
            </ScrollView>
        );
    };


    const ExpandableListItem = ({ item }) => {
        const [expanded, setExpanded] = useState(false);

        const toggleExpand = () => {
            setExpanded(!expanded);
        };

        //item.designation.name.length > 20
        const truncatedDesignation = false
            ? item.designation.name.slice(0, 30) + '...'
            : item.designation.name;
        const details = [
            { label: 'Reporting Manager', value: item.reportingManager ? `${item.reportingManager.first_name} ${item.reportingManager.last_name}` : 'N.A' },
            { label: 'Designation', value: truncatedDesignation },
            { label: 'Vendor', value: item.vendor.name },
            { label: 'Location', value: item.job_location },
            { label: 'Work Mode', value: item.work_mode },
            { label: 'Job Level', value: item.job_level },
            { label: 'Cost Center', value: item.cost_center.cost_center },
            { label: 'Employee Id', value: item.employee_id },
            { label: 'Gender', value: item.gender },
        ];

        return (
            <View style={styles.ExpContainer}>
                <View style={(expanded ? (styles.ExpandedListItemExpanded) : (styles.ExpandedListItem))} >
                    <TouchableOpacity
                        onPress={toggleExpand}
                        style={expanded ? (styles.PhoneItemTouchableExpanded) : (styles.PhoneItemTouchable)}>
                        <Text style={expanded ? (styles.itemNameExpanded) : (styles.itemname)}>{item.first_name} {item.last_name} </Text>

                    </TouchableOpacity>
                    {expanded && (
                        <View style={isDesktop ? (styles.detailColumnUpDex) : (styles.detailColumnUp)}>
                            {details.map((detail, index) => (
                                <View key={index} style={isDesktop ? (styles.detailColumnDex) : (styles.detailColumn)}>
                                    <Text style={isDesktop ? (styles.detailLabelDex) : (styles.detailLabel)}>{detail.label}:<Text style={isDesktop ? (styles.detailValueDex) : (styles.detailValue)}>{detail.value}</Text></Text>

                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </View>

        );
    };

    const [Data, setData] = useState([]);

    const getApiData = async () => {
        try {
            const response = await fetch('http://SAJAL-GARG:3001/boston/data/employee/division');
            const result = await response.json();
            console.log(JSON.stringify(result));
            setData((result));
        } catch (error) {
            setData(DivisionData);
            console.log(error);
        }
    };

    useEffect(() => {
        getApiData();
    }, []);

    const transformData = (data) => {
        if (!data || !data.rows) {
            console.log('Data is missing or malformed');
            return [];
        }

        return data.rows.flatMap(team =>
            team.subTeams.flatMap(subTeam =>
                subTeam.Employee.length === 0
                    ? []
                    : [{
                        title: {
                            teamName: team.name,
                            subTeamName: subTeam.name,
                            employeeCount: subTeam.Employee.length
                        },
                        data: subTeam.Employee.map(employee => ({
                            ...employee,
                            subTeamName: subTeam.name,
                            teamName: team.name
                        }))
                    }]
            )
        );
    };


    const data = transformData(Data);

    console.log('Initial Data:', Data);
    console.log('Transformed Data:', data);

    const [expandedSections, setExpandedSections] = useState({});
    const [iconName, setIconName] = useState('arrow-down');
    const [headerRendered, setHeaderRendered] = useState(false);

    const toggleSection = (title) => {
        const key = title.teamName + title.subTeamName;
        setExpandedSections((prevState) => ({
            ...prevState,
            [key]: !prevState[key]
        }));
    };


    const renderSectionHeader = ({ section }) => {
        const key = section.title.teamName + section.title.subTeamName;
        return (
            <TouchableOpacity onPress={() => toggleSection(section.title)} >
                <View style={isDesktop ? (styles.sectionHeaderDesktop) : (styles.sectionHeader)}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.sectionHeaderText, { color: 'black' }]}>{section.title.teamName}</Text>
                        <Text style={[styles.sectionHeaderText2, { color: 'grey' }]}>{` - ${section.title.subTeamName}`}</Text>
                        <Text style={[styles.sectionHeaderText2, { color: '#50406d' }]}>{` (${section.title.employeeCount})`}</Text>
                        
                    </View>

                    <View style={expandedSections[key] ? (styles.sectionHeaderEmployee) : (null)}>
                        {isDesktop ? (expandedSections[key] ? <Row data={headers} style={styles.head} textStyle={styles.HeaderRowText} /> : null) : (null)}
                    </View>
                    <MaterialCommunityIcons
                            name={expandedSections[key] ? 'arrow-up' : 'arrow-down'}
                            size={17}
                            color="black"
                            style={isDesktop?(styles.iconDex):(styles.icon)}
                        />

                </View>
            </TouchableOpacity>
        );
    };

    const headerRenderedRef = useRef(false);

    const renderItem = ({ item, section }) => {

        if (!expandedSections[section.title.teamName + section.title.subTeamName]) {
            return null;
        }
        return (
            <View style={styles.ExpListContainer}>

                {isDesktop ? (<DesktopView Data={item} />) : (<ExpandableListItem item={item} />)}
            </View>
        );

    };
    const ExpandableList = ({ data }) => {
        return (

            <SectionList
                sections={data}
                keyExtractor={(item) => item.employee_id}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                initialNumToRender={500}
                stickySectionHeadersEnabled={isDesktop?(false):(true)}
            />
        );
    };

    return (

        <View style={isDesktop ? (styles.containerDeskExpandable) : (styles.container)}>
            <ExpandableList data={data} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerDeskExpandable: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerDesktop: {
        flexDirection:"row",
        padding: 10,
        width: getPercentageWidth(96, width),
        borderBottomWidth:1,
        borderColor:"black",
    },
    sectionHeaderEmployee: {
        marginTop: 10,
        left: 0
    },
    sectionHeader: {
        flexDirection: 'row',
        marginHorizontal: 12,
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 5,
        marginTop: 5,
        borderRadius: 12,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5

    },
    sectionHeaderDesktop: {
        width: getPercentageWidth(97, width),
        flexDirection: 'column',
        marginHorizontal: 12,
        justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 5,
        marginTop: 5,
        
    },
    ExpandedListItem: {
        padding: 10,
        borderBottomWidth: 1,
        width: getPercentageWidth(85, width),
        backgroundColor: 'white',
        borderRadius: 5,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    ExpandedListItemExpanded: {
        padding: 10,
        width: getPercentageWidth(88, width),
        borderBottomWidth: 2,
        backgroundColor: 'white',
        borderRadius: 5,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    PhoneItemTouchableExpanded: {
        borderWidth: 2,
        backgroundColor: '#F0F8FF',
        borderRadius: 10,
        overflow: "hidden",
    },
    searchBarInput: {
        fontSize: 16,paddingBottom:15
   },
   searchBar: {
    backgroundColor:"white",
    borderWidth:1,
    elevation:5,
    height:40,
    borderRadius:10

},
    PhoneItemTouchable: {
        borderRadius: 10,
        overflow: "hidden",
    },
    iconDex: {
        position: 'absolute',
        justifyContent: 'center',
        right: 3,
    },
    icon: {
        position: 'absolute',
        justifyContent: 'center',
        right: 7,
        top:10
    },
    sectionHeaderText: {
        justifyContent: 'space-between',
        textAlign: 'center',

        fontSize: 14,
        fontWeight: 'bold'
    },
    sectionHeaderText2: {
        justifyContent: 'space-between',
        textAlign: 'center',
        fontSize: 13,
        fontWeight: 'bold'
    },
    ExpContainer: {

        justifyContent: 'center',
        alignItems: 'center'

    },
    iconContainer: {
        position: "absolute",
        alignContent: "flex-end"
    },
    searchBarContainer: {
        width: '100%',
        marginBottom: 1,
    },
    itemContainer: {
        marginBottom: 1,
        backgroundColor: "white",
        borderRadius: 10,
        elevation: 10,
        shadowOffset: 1,
        shadowRadius: 5
    },

    itemname: {
        fontSize: 13,
        fontWeight: "bold",
        color: "#323",
        justifyContent: 'center',
        textAlign: "center"
    },

    itemNameExpanded: {
        padding: 4,
        fontSize: 14,
        fontWeight: "bold",
        color: "#433",
        justifyContent: 'center',
        textAlign: "center"
    },

    detailColumnDex: {
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        paddingBottom: 30,
        paddingHorizontal: 12,
        marginTop: 5,

    },
    detailColumn: {
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        marginBottom: 1,
        marginTop: 5
    },
    detailColumnUpDex: {
        flexDirection: 'row',
        justifyContent: 'center',
        textAlign: 'center',
        marginBottom: 1,
        margin: 5
    },
    detailColumnUp: {
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        marginBottom: 1,
        marginTop: 5
    },
    detailLabel: {
        fontSize: 14,
        fontWeight: "bold",
        marginTop: -5,
        marginBottom: 2
    },
    detailLabelDex: {
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 14,
        fontWeight: "bold",
        marginTop: -5,
        marginBottom: 2
    },
    detailValue: {
        padding: 0,
        fontSize: 13,
        fontWeight: "bold",
        color: "grey",
        position: "absolute",
        left: 150,
    },
    detailValueDex: {
        borderColor: 'red',
        padding: 0,
        marginTop: 20,
        paddingHorizontal: -10,
        fontSize: 12,
        fontWeight: "bold",
        color: "grey",
        position: "absolute",
        left: 2,
    },
    ExpListContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth:2
    },
    containerDex: {
        flex: 1,
        backgroundColor: "white",
        position: "relative"
    },
    head: {
        height: 50,
        backgroundColor: '#2C3E50',
        width: getPercentageWidth(94.5, width),
        borderColor: "white"
    },
    itemTextNewDex: {
      
        width:getPercentageWidth(7.9, width),
        textAlign:'center',
        fontSize: 12,
    },
    HeaderRowText: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: "white",
        fontFamily: "Roboto",
        fontSize: 12
    },
});

export default Department;