import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, FlatList, StyleSheet, Modal, KeyboardAvoidingView, Picker, Dimensions, Alert, ActivityIndicator } from "react-native";
import UserAvatar from 'react-native-user-avatar';
import Tooltip from 'rn-tooltip';
import { Button, FAB, Portal, Provider, Dialog } from 'react-native-paper';
import { exportToExcel } from 'react-json-to-excel';
import { Divider, Searchbar } from "react-native-paper";
import { Table, TableWrapper, Row } from 'react-native-table-component';
import Notify from "./Alerts/Alert";
import resultTemp from "./Alerts/employeeJSON";

const { width, height } = Dimensions.get('window');
const getPercentageWidth = (percentage, dimension) => {
	return (percentage / 100) * dimension;
};

function isNumberWithLength(inputString, requiredLength) {
	return /^\d+$/.test(inputString) && inputString.length === requiredLength;
}
const isDesktop = width >= 768;
const Employee = () => {

	// Mobile View

	const ExpandableListItem = ({ item, index }) => {
		const [expanded, setExpanded] = useState(false);
		const toggleExpand = () => {
			setExpanded(!expanded);
		};

		const truncatedDesignation = item.designation.name.length > 20
			? item.designation.name.slice(0, 20) + '...'
			: item.designation.name;

		const details = [
			{ label: 'Reporting Manager', value: item.reportingManager ? `${item.reportingManager.first_name} ${item.reportingManager.last_name}` : 'N.A' },
			{ label: 'Designation', value: truncatedDesignation },
			{ label: 'Vendor', value: item.vendor.name },
			{ label: 'Team', value: item.SubTeam.Team.name },
			{ label: 'Sub Team', value: item.SubTeam.name },
			{ label: 'Location', value: item.job_location },
			{ label: 'Work Mode', value: item.work_mode },
			{ label: 'Job Level', value: item.job_level },
			{ label: 'Cost Center', value: item.cost_center.cost_center },
			{ label: 'Employee Id', value: item.employee_id },
			{ label: 'Gender', value: item.gender },
			{ label: 'Functional Head', value: item.functional_head.name },
		];


		return (
			<View style={styles.itemContainer}>
				<TouchableOpacity
					onPress={toggleExpand}
					style={styles.itemTouchable}>
					<Text style={styles.nameText}>{item.first_name} {item.last_name}</Text>
					<Text style={styles.location}>{item.employeement_type}</Text>
					<Text style={styles.work}>{item.employee_id}</Text>
					<UserAvatar size={40} name={item.first_name} {...item.last_name}  // Initials of employee
						style={{ height: 55, width: 50, position: 'absolute', borderRadius: 5, marginTop: 4, marginRight: 4 }} />
					<MaterialCommunityIcons name='pencil' size={20} onPress={() => { editEmployee(index) }}
						style={{ position: "absolute", marginLeft: getPercentageWidth(85, width), marginTop: 28 }} />
				</TouchableOpacity>

				{expanded && (

					// Putting title and their values in different rows

					<View style={styles.detailColumn}>
						{details.map((detail, index) => (
							<View key={index} style={styles.detailColumn}>
								<Text style={styles.detailLabel}>{detail.label}:</Text>
								{detail.label === 'Designation' ? (
									<Tooltip
										height={80}
										width={130}
										popover={<Text>{item.designation.name}</Text>}
										containerStyle={styles.tooltipContainer}
									>
										<Text style={styles.detailValue}>{truncatedDesignation}</Text>
									</Tooltip>
								) : (
									<Text style={styles.detailValue}>{detail.value}</Text>

								)}
							</View>
						))}
					</View>
				)}
			</View>
		);
	};


	// Flatlist for mobile view (expandable list)
	const ExpandableList = ({ Data }) => {
		return (
			<FlatList
				data={Data}
				keyExtractor={(item) => item.id}
				renderItem={({ item, index }) =>
					<ExpandableListItem item={item} index={index} />
				}
			/>
		);
	};

	// Desktop View
	const DesktopView = ({ Data }) => {

		const headers = [
			'First Name', 'Last Name', 'Employment Type', 'Employee ID',
			'Designation', 'Reporting Manager', 'Functional Head', 'Vendor', 'Team', 'Sub Team',
			'Location', 'Work Mode', 'Job Level', 'Cost Center',
			, 'Gender', ''
		];

		const [selectedTeam, setSelectedTeam] = useState('');
		const [selectedSubTeam, setSelectedSubTeam] = useState('');
		const [selectedGender, setSelectedGender] = useState('');
		const [selectedLocation, setSelectedLocation] = useState('');
		const [filteredSubTeamsName, setFilteredSubTeamsName] = useState([]);
		const [selectedHead, setSelectedHead] = useState('');


		const filterByChecks = (teamName, gender, subTeamName, location, funHead) => {
			//whole data without filter
			filterHome = [...Data]
			// filtering data as needed
			if (teamName !== "") {
				filterHome = filterHome.filter(item => item.SubTeam.Team.name === teamName);
			} if (gender !== "") {
				filterHome = filterHome.filter(item => item.gender === gender);
			}
			if (subTeamName !== "") {
				filterHome = filterHome.filter(item => item.SubTeam.name === subTeamName);
			} if (location !== "") {
				filterHome = filterHome.filter(item => item.job_location === location);
			} if (funHead !== "") {
				filterHome = filterHome.filter(item => item.functional_head.name === funHead);
			}
			return filterHome;
		}

		useEffect(() => {
			if (selectedTeam !== "") {
				const subTeams = Data.filter(item => item.SubTeam.Team.name === selectedTeam)
					.map(item => item.SubTeam.name);
				setFilteredSubTeamsName([...new Set(subTeams)]);
			} else {
				setFilteredSubTeamsName([]);
			}
		}, [selectedTeam, Data]);

		const clearFilters = () => {
			setSelectedTeam('');
			setSelectedSubTeam('');
			setSelectedGender('');
			setSelectedLocation('');
			setSelectedHead('');
		};

		const tableData = filterByChecks(selectedTeam, selectedGender, selectedSubTeam, selectedLocation, selectedHead).map((item) => ([
			item.first_name,
			item.last_name,
			item.employeement_type,
			item.employee_id,
			item.designation.name,
			item.reportingManager ? `${item.reportingManager.first_name} ${item.reportingManager.last_name}` : 'N.A',
			item.functional_head.name,
			item.vendor.name,
			item.SubTeam.Team.name,
			item.SubTeam.name,
			item.job_location,
			item.work_mode,
			item.job_level,
			item.cost_center.cost_center,
			item.gender,
			null
		]));

		useEffect(() => {
			setTimeout(() => {
				setLoading(false);
			}, 1000);
		}, []);

		if (loading) {
			return (
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<ActivityIndicator size="large" color="#0000ff" />
				</View>
			);
		}


		return (
			<ScrollView showsVerticalScrollIndicator={true} >
				<ScrollView horizontal={false} showsHorizontalScrollIndicator={false}>
					<View style={styles.containerDesk}>
						<View style={{ flexDirection: "row", width: getPercentageWidth(96, width) }}>
							<Picker
								selectedValue={selectedTeam}
								onValueChange={(itemValue) => {
									setSelectedTeam(itemValue)
									setSelectedSubTeam('')
								}}
								style={styles.deskpickerFilter}
							>
								<Picker.Item label="Choose Team" value="" />
								{teams.map((team, index) => (
									<Picker.Item key={index} label={team} value={team} />
								))}
							</Picker>

							<Picker
								selectedValue={selectedGender}
								onValueChange={(itemValue) => setSelectedGender(itemValue)}
								style={styles.deskpickerFilter}
							>
								<Picker.Item label="Choose Gender" value="" />
								{genders.map((gender, index) => (
									<Picker.Item key={index} label={gender} value={gender} />
								))}
							</Picker>


							<Picker
								selectedValue={selectedSubTeam}
								onValueChange={(itemValue) => {
									setSelectedSubTeam(itemValue)
									// setSelectedGender('')
								}}
								style={styles.deskpickerFilter}
								enabled={filteredSubTeamsName.length > 0}
							>
								<Picker.Item label="Choose Sub Team" value="" />
								{filteredSubTeamsName.map((subTeam, index) => (
									<Picker.Item key={index} label={subTeam} value={subTeam} />
								))}
							</Picker>

							<Picker
								selectedValue={selectedLocation}
								onValueChange={(itemValue) => {
									setSelectedLocation(itemValue)
									// setSelectedGender('')
								}}
								style={styles.deskpickerFilter}
							>
								<Picker.Item label="Choose Location" value="" />
								{locations.map((location, index) => (
									<Picker.Item key={index} label={location} value={location} />
								))}
							</Picker>

							<Picker
								selectedValue={selectedHead}
								onValueChange={(itemValue) => {
									setSelectedHead(itemValue)
									// setSelectedGender('')
								}}
								style={styles.deskpickerFilter}
							>
								<Picker.Item label="Choose Functional Head" value="" />
								{head.map((head, index) => (
									<Picker.Item key={index} label={head} value={head} />
								))}
							</Picker>

							<TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
								<Text style={styles.clearButtonText}>Clear Filters</Text>
							</TouchableOpacity>
						</View>

						<Table borderStyle={{ borderColor: 'white' }}>
							<Row data={headers} style={styles.head} textStyle={styles.text1} />
							{
								tableData.map((rowData, index) => (
									<View key={index}>
										<TableWrapper key={index} style={styles.rowWrapper}>
											{rowData.map((cellData, cellIndex) => (
												<View key={cellIndex} style={styles.cell}>
													{cellIndex === 4 ? (
														<Tooltip popover={<Text>{cellData}</Text>}>
															<Text style={styles.text}>{cellData}</Text>
														</Tooltip>
													) : cellIndex === 15 ? (
														<Button icon="pencil" textColor="white" buttonColor="#086A96" mode="elevated" compact="true" onPress={() => editEmployee(index)} />
													) : (
														<Text style={styles.text}>{cellData}</Text>
													)}
												</View>
											))}
										</TableWrapper>
										<Divider style={{ marginHorizontal: 2 }} />
									</View>
								))
							}
						</Table>
					</View>
				</ScrollView>
			</ScrollView>
		);
	};
	const [loading, setLoading] = useState(true);
	const [Data, setData] = useState([]);
	const [index, setIndex] = useState([]);
	const [genders, setGenders] = useState([]);
	const [filteredSubTeams, setFilteredSubTeams] = useState([]);
	const [locations, setLocations] = useState([]);
	const [teams, setTeams] = useState([]);
	const [subTeams, setSubTeams] = useState([]);
	const [empTypes, setEmpTypes] = useState([]);
	const [modes, setModes] = useState([]);
	const [vendors, setVendors] = useState([]);
	const [head, setHead] = useState([]);
	const [levels, setLevels] = useState([]);
	const [costs, setCosts] = useState([]);
	const [repMan, setRepMan] = useState([]);
	const [designation, setDesignation] = useState([]);
	const [searchText, setSearchText] = useState('');
	const [visible, setVisible] = React.useState(false);
	const hideDialog = () => setVisible(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [newEmployee, setNewEmployee] = useState({ 			//setting employee for picker in form
		employee_id: '',
		first_name: '',
		last_name: '',
		employeement_type: '',
		designation: '',
		reporting_manager: '',
		functional_head: '',
		vendor: '',
		team: '',
		sub_team: '',
		location: '',
		work_mode: '',
		job_level: '',
		cost_center: '',
		gender: '',

	});



	// Finding uuid for each team, vendor etc to store data accordingly
	const findVendorUUIDByName = (name) => {
		const ans = Data.find(emp => emp.vendor.name === name);
		return ans ? ans.vendor.id : null;
	};

	const findTeamUUIDByName = (name) => {
		const ans = Data.find(emp => emp.SubTeam.Team.name === name);
		return ans ? ans.SubTeam.Team.id : null;
	};

	const findSubTeamUUIDByName = (name) => {
		const ans = Data.find(emp => emp.SubTeam.name === name);
		return ans ? ans.SubTeam.id : null;
	};

	const findDesignationUUIDByName = (name) => {
		const ans = Data.find(emp => emp.designation.name === name);
		return ans ? ans.designation.id : null;
	};

	const findCostCenterUUIDByName = (name) => {
		const ans = Data.find(emp => emp.cost_center.cost_center === name);
		return ans ? ans.cost_center.id : null;
	};

	const findFunctionalHeadUUIDByName = (name) => {
		const ans = Data.find(emp => emp.functional_head.name === name);
		return ans ? ans.functional_head.id : null;
	};

	const findReportingManUUIDByName = (name) => {

		const ans = Data.find(emp => `${emp.first_name} ${emp.last_name}` === name);
		return ans ? ans.id : null;
	};

	// Add employee function

	const handleAddEmployee = () => {

		let employeeDel = newEmployee;

		if (isNumberWithLength(!newEmployee.employee_id, 7)) {
			setNotifyText("Employee ID must be a 7 digits number");
			setNotifyVisible(true);

			setModalVisible(true);
			return;
		}

		const emp_vendor = findVendorUUIDByName(employeeDel.vendor);
		const emp_team = findTeamUUIDByName(employeeDel.team);
		const emp_SubTeam = findSubTeamUUIDByName(employeeDel.sub_team);
		const emp_designation = findDesignationUUIDByName(employeeDel.designation);
		const emp_CostCenter = findCostCenterUUIDByName(employeeDel.cost_center);
		const emp_FunctionalHead = findFunctionalHeadUUIDByName(employeeDel.functional_head);

		let emp_reportingMan = null;
		if (employeeDel.reporting_manager) {
			emp_reportingMan = findReportingManUUIDByName(employeeDel.reporting_manager);
		}

		const url = 'http://SAJAL-GARG:3001/boston/data/add/employee';
		const data = {
			"BSC_employee_Id": `${employeeDel.employee_id}`,
			"first_name": `${employeeDel.first_name}`,
			"last_name": `${employeeDel.last_name}`,
			"employee_type": `${employeeDel.employeement_type}`,
			"Reporting_manager_id": `${emp_reportingMan}`,
			"functional_head_id": `${emp_FunctionalHead}`,
			"Designation_id": `${emp_designation}`,
			"Vendor_id": `${emp_vendor}`,
			"Team_id": `${emp_team}`,
			"SubTeam_id": `${emp_SubTeam}`,
			"CostCenter_id": `${emp_CostCenter}`,
			"job_Location": `${employeeDel.location}`,
			"WorkMode": `${employeeDel.work_mode}`,
			"JobLevel": `${employeeDel.job_level}`,
			"Gender": `${employeeDel.gender}`
		};

		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then(response => response.json())
			.then(data => {
				if (data.message === "Internal server error") {
					setNotifyText("Employee ID already exist");
					setNotifyVisible(true);
					setModalVisible(true);
					setEditMode(false);
					return;
				}
				else {
					setNotifyText(data.message);
					setNotifyVisible(true);
				}

			})
			.catch(error => {
				console.error('Error:', error);
				alert('Error', 'Failed to add employee data');
			});


		setNewEmployee({
			employee_id: '',
			first_name: '',
			last_name: '',
			employeement_type: '',
			designation: '',
			reporting_manager: '',
			functional_head: '',
			vendor: '',
			team: '',
			sub_team: '',
			location: '',
			work_mode: '',
			job_level: '',
			cost_center: '',
			gender: '',
		});
		setModalVisible(false);
		setEditMode(false);
	};

	const [notifyVisible, setNotifyVisible] = useState(false);
	const [notifyText, setNotifyText] = useState('');

	const handleEditEmployee = (update) => {

		if (!isNumberWithLength(newEmployee.employee_id, 7)) {
			setNotifyText("Employee ID must be a 7 digits number");
			setNotifyVisible(true);
			setModalVisible(true);
			return;
		}

		const edited_vendor = findVendorUUIDByName(update.vendor);
		const edited_team = findTeamUUIDByName(update.team);
		const edited_SubTeam = findSubTeamUUIDByName(update.sub_team);
		const edited_designation = findDesignationUUIDByName(update.designation);
		const edited_CostCenter = findCostCenterUUIDByName(update.cost_center);
		const edited_FunctionalHead = findFunctionalHeadUUIDByName(update.functional_head);

		let edited_reportingMan = null;
		if (update.reporting_manager) {
			edited_reportingMan = findReportingManUUIDByName(update.reporting_manager);
		}

		const url = `http://SAJAL-GARG:3001/boston/data/edit/employee/${filteredData[index].employee_id}`;
		const data = {
			"BSC_employee_Id": `${update.employee_id}`,
			"first_name": `${update.first_name}`,
			"last_name": `${update.last_name}`,
			"employee_type": `${update.employeement_type}`,
			"Reporting_manager_id": `${edited_reportingMan}`,
			"functional_head_id": `${edited_FunctionalHead}`,
			"Designation_id": `${edited_designation}`,
			"Vendor_id": `${edited_vendor}`,
			"Team_id": `${edited_team}`,
			"SubTeam_id": `${edited_SubTeam}`,
			"CostCenter_id": `${edited_CostCenter}`,
			"job_Location": `${update.location}`,
			"WorkMode": `${update.work_mode}`,
			"JobLevel": `${update.job_level}`,
			"Gender": `${update.gender}`
		};

		fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then(response => response.json())
			.then(data => {
				if (data.message === "Internal server error") {
					setNotifyText("Employee ID already exist");
					setNotifyVisible(true);
					editEmployee(index);
					return;
				}
				else {
					setNotifyText(data.message);
					setNotifyVisible(true);
				}

				Alert.alert('Success', 'Employee data added successfully');
			})
			.catch(error => {
				console.error('Error:', error);
				setNotifyText("Failed to add employee data");
				setNotifyVisible(true);
			});


		setNewEmployee({
			employee_id: '',
			first_name: '',
			last_name: '',
			employeement_type: '',
			designation: '',
			reporting_manager: '',
			functional_head: '',
			vendor: '',
			team: '',
			sub_team: '',
			location: '',
			work_mode: '',
			job_level: '',
			cost_center: '',
			gender: '',
		});
		setModalVisible(false);
		setEditMode(false);

	};

	const [confirmationVisible, setConfirmationVisible] = useState(false);
	const [confirmationText, setConfirmationText] = useState('');

	const NotDeleted = () => {
		setNotifyText("Employee is not deleted");
		setNotifyVisible(true);
		setConfirmationVisible(false);
		setModalVisible(true);
		setEditMode(true);
	}

	const Confirmation = () => {

		return (
			<Portal>
				<Dialog visible={confirmationVisible} onDismiss={() => setConfirmationVisible(false)} style={{
					width: isDesktop ? (getPercentageWidth(30, width)) : (getPercentageWidth(90, width)),
					justifyContent: 'center', marginHorizontal: isDesktop ? (getPercentageWidth(37, width)) : (getPercentageWidth(5, width))
				}}>
					<Dialog.ScrollArea>
						<ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
							<Text>{confirmationText}</Text>
						</ScrollView>
					</Dialog.ScrollArea>
					<Dialog.Actions>
						<Button onPress={() => NotDeleted()}>Cancel</Button>
						<Button onPress={() => handleDeleteEmployee(newEmployee)}>Ok</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		);
	};

	const handleDeleteEmployee = (update) => {

		setConfirmationVisible(false);
		setEditMode(false);
		setModalVisible(false);

		const url = `http://SAJAL-GARG:3001/boston/data/delete/employee/${update.employee_id}`;
		fetch(url, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
		})
			.then(response => response.json())
			.then(data => {
				setNotifyText(data.message);
				setNotifyVisible(true);
				Alert.alert('Success', 'Employee data added successfully');
			})
			.catch(error => {
				console.error('Error:', error);
				setNotifyText(error.message);
				setNotifyVisible(true);
			});

	};

	const transformXLData = (data) => {
		return data.map(item => {
			return {
				first_name: item.first_name,
				last_name: item.last_name,
				employee_id: item.employee_id,
				employeement_type: item.employeement_type,
				gender: item.gender,
				work_mode: item.work_mode,
				job_location: item.job_location,
				job_level: item.job_level,
				designation_name: item.designation.name,
				cost_center: item.cost_center.cost_center,
				vendor_name: item.vendor.name,
				subteam_name: item.SubTeam.name,
				team_name: item.SubTeam.Team.name,
				functional_head: item.functional_head.name,
				reportingManager: item.reportingManager ? (`${item.reportingManager.first_name} ${item.reportingManager.last_name}`) : ("N.A"),
				
			};
		});
	};
	const displayingStaticData = () => {

		const employees = resultTemp.rows;

		getApiDataOperation(employees);

		
	}

    const getApiDataOperation = (employees) =>{
		const uniqueDesignation = [...new Set(employees.map(emp => emp.designation.name))];
		const uniqueGenders = [...new Set(employees.map(emp => emp.gender))];
		const uniqueEmpTypes = [...new Set(employees.map(emp => emp.employeement_type))];
		const uniqueCostCenters = [...new Set(employees.map(emp => emp.cost_center.cost_center))];
		const uniqueJobLevels = [...new Set(employees.map(emp => emp.job_level))];
		const uniqueWorkModes = [...new Set(employees.map(emp => emp.work_mode))];
		const uniqueLocations = [...new Set(employees.map(emp => emp.job_location))];
		const uniqueTeams = [...new Set(employees.map(emp => emp.SubTeam.Team.name))];
		const uniqueSubTeams = [...new Set(employees.map(emp => emp.SubTeam.name))];
		const uniqueVendors = [...new Set(employees.map(emp => emp.vendor.name))];
		const uniqueRepMan = [...new Set(
			employees
				.filter(emp => {
					const level = emp.job_level.substring(0, 1);
					const number = parseInt(emp.job_level.substring(1));
					return (level === 'P' && number > 4) || (level === 'M' && number >= 1);
				})
				.map(emp => `${emp.first_name} ${emp.last_name}`)
		)];

		setDesignation(uniqueDesignation);
		setData(employees);
		setGenders(uniqueGenders);
		setEmpTypes(uniqueEmpTypes);
		setCosts(uniqueCostCenters);
		setLevels(uniqueJobLevels);
		setLocations(uniqueLocations);
		setModes(uniqueWorkModes);
		setRepMan(uniqueRepMan);
		setTeams(uniqueTeams);
		setSubTeams(uniqueSubTeams);
		setVendors(uniqueVendors);
	}

	const getApiData = async () => {
		try {
			const response = await fetch('http://SAJAL-GARG:3001/boston/data/employees');
			const result = await response.json();
			const employees = result.rows;
			getApiDataOperation(employees);

		} catch (error) {
			console.log(error);
			setNotifyText("server is not available displaying static data");
			setNotifyVisible(true);
			displayingStaticData();
			setLoading(false);
		}
	};

	useEffect(() => {
		getApiData();
	}, []);

	useEffect(() => {
		if (newEmployee.team) {
			const filteredSubs = Data
				.filter(emp => emp.SubTeam.Team.name === newEmployee.team)
				.map(emp => emp.SubTeam.name);
			setFilteredSubTeams([...new Set(filteredSubs)]);
		} else {
			setFilteredSubTeams([]);
		}
	}, [newEmployee.team, Data]);



	const [editMode, setEditMode] = useState(false);

	const editEmployee = (index) => {
		setIndex(index)
		const employee = filteredData[index];
		setNewEmployee({
			employee_id: employee.employee_id,
			first_name: employee.first_name,
			last_name: employee.last_name,
			employeement_type: employee.employeement_type,
			designation: employee.designation.name,
			reporting_manager: employee.reportingManager ? `${employee.reportingManager.first_name} ${employee.reportingManager.last_name}` : 'N.A.',
			functional_head: employee.functional_head.name,
			vendor: employee.vendor.name,
			team: employee.SubTeam.Team.name,
			sub_team: employee.SubTeam.name,
			location: employee.job_location,
			work_mode: employee.work_mode,
			job_level: employee.job_level,
			cost_center: employee.cost_center.cost_center,
			gender: employee.gender,
		});
		setModalVisible(true);
		setEditMode(true);
	};

	const SaveEmployee = () => {
		if (editMode) {
			handleEditEmployee(newEmployee);
		} else {
			handleAddEmployee();
		}


	};



	const DeleteEmployee = () => {
		if (editMode) {
			setConfirmationText("Are you sure you want to remove this employee");
			setConfirmationVisible(true);
		} else {
			handleAddEmployee();
		}
	};

	const onClose = () => {
		setModalVisible(false);
		setEditMode(false)
		setNewEmployee({
			employee_id: '',
			first_name: '',
			last_name: '',
			employeement_type: '',
			designation: '',
			reporting_manager: '',
			functional_head: '',
			vendor: '',
			team: '',
			sub_team: '',
			location: '',
			work_mode: '',
			job_level: '',
			cost_center: '',
			gender: '',
		});
	};

	const [open, setOpen] = useState(false);

	const handlePlusBoxPress = () => {
		setModalVisible(true);
	};

	const excel = () => {
		const transformedXlData = transformXLData(filteredData);
		exportToExcel(transformedXlData, "Excel file");
	}
	const handleFileExcelPress = () => {
		excel();
	};

	const bool = !newEmployee.cost_center || !newEmployee.designation || !newEmployee.employee_id || !newEmployee.employeement_type
		|| !newEmployee.first_name || !newEmployee.gender || !newEmployee.job_level || !newEmployee.last_name || !newEmployee.sub_team
		|| !newEmployee.team || !newEmployee.vendor || !newEmployee.work_mode || !newEmployee.location || !newEmployee.reporting_manager || !newEmployee.functional_head;

	const filterDebug = () => {
		setSearchText;
	}

	const filteredData = Array.isArray(Data) ? Data.filter((item) => `${item.first_name} ${item.last_name}
	 ${item.employeement_type} ${item.vendor.name}${item.SubTeam.Team.name}${item.SubTeam.name}
	 ${item.job_location}${item.work_mode}
	 ${item.cost_center.cost_center}`.toLowerCase().includes(searchText.toLowerCase())) : [];

	return (
		<Provider>
			<Notify visible={notifyVisible} text={notifyText} hideDialog={() => setNotifyVisible(false)} width={width} />
			<Confirmation />

			<KeyboardAvoidingView style={isDesktop ? styles.container : styles.container1}>

				<Searchbar style={styles.searchBar}
					value={searchText}
					iconColor="black"
					inputStyle={styles.searchBarInput}
					onChangeText={setSearchText}
					placeholder="Search with any filter"
				/>

				{isDesktop ? (
					<DesktopView Data={filteredData} />
				) : (
					<ExpandableList Data={filteredData} />
				)}

				<View style={{ position: 'absolute', bottom: 10, right: getPercentageWidth(6, width) }}>
					<Provider>
						<Portal>
							<FAB.Group      // TODO (Rendering of page)
								open={open}
								visible
								icon={open ? 'minus' : 'plus'}
								color="white"
								style={{ backgroundColor: "black" }}
								actions={[
									{
										icon: 'plus-box',
										onPress: handlePlusBoxPress,
										style: { backgroundColor: "#086A96" },
										color: "white",
									},
									{
										icon: 'file-excel',
										onPress: handleFileExcelPress,
										style: { backgroundColor: "#086A96" },
										color: "white",
									},

								]}
								onStateChange={({ open }) => setOpen(open)}

								fabStyle={{ backgroundColor: "#086A96" }}
							/>
						</Portal>
					</Provider>
				</View>

				<Modal
					animationType="slide"
					transparent={false}
					visible={modalVisible}
					onRequestClose={() => setModalVisible(false)}	>
					<Provider >
						<Notify visible={notifyVisible} text={notifyText} hideDialog={() => setNotifyVisible(false)} width={width} />
						<Confirmation />
						<ScrollView style={isDesktop ? styles.layout : styles.layout3}>

							<Text style={styles.modalText}>{editMode ? "Edit Employee Details" : "Add Employee Details"}</Text>


							<View style={isDesktop ? styles.inputRow : styles.layout1}>
								<View style={styles.inputContainer}>
									<Text style={isDesktop ? styles.deskuser : styles.user}>Employee Id</Text>
									<TextInput
										style={isDesktop ? styles.deskinput : styles.input}
										placeholder="Enter Employee Id"
										value={newEmployee.employee_id}
										onChangeText={(text) => setNewEmployee({ ...newEmployee, employee_id: text })}
									/>
								</View>

								<View style={styles.inputContainer}>
									<Text style={isDesktop ? styles.deskuser : styles.user}>First Name</Text>
									<TextInput
										style={isDesktop ? styles.deskinput : styles.input}
										placeholder="Enter First Name"
										value={newEmployee.first_name}
										onChangeText={(text) => setNewEmployee({ ...newEmployee, first_name: text })}
									/>
								</View>

								<View style={styles.inputContainer}>
									<Text style={isDesktop ? styles.deskuser : styles.user}>Last Name</Text>
									<TextInput
										style={isDesktop ? styles.deskinput : styles.input}
										placeholder="Enter Last Name"
										value={newEmployee.last_name}
										onChangeText={(text) => setNewEmployee({ ...newEmployee, last_name: text })}
									/>
								</View>

								<View style={styles.inputContainer}>
									<Text style={isDesktop ? styles.deskuser : styles.user}>Location</Text>
									<View>
										<Picker
											selectedValue={newEmployee.location}
											style={isDesktop ? styles.deskpicker : styles.picker}
											onValueChange={(text) => setNewEmployee({ ...newEmployee, location: text })}
										>
											<Picker.Item label="Choose Location" value="" />
											{locations.map((location, index) => (
												<Picker.Item key={index} label={location} value={location} />
											))}
										</Picker>
									</View>
								</View>
							</View>

							<View style={isDesktop ? styles.inputRow : styles.layout1}>

								<View style={styles.inputContainer}>
									<Text style={isDesktop ? styles.deskuser : styles.user}>Employeement Type</Text>
									<View>
										<Picker
											selectedValue={newEmployee.employeement_type}
											style={isDesktop ? styles.deskpicker : styles.picker}
											onValueChange={(text) => {
												if (text === 'FTE') {
													// Set employeement_type to FTE and vendor to BSC
													setNewEmployee({ ...newEmployee, employeement_type: 'FTE', vendor: 'BSC', designation: '' });
												} else if (text === 'Intern') {
													// Set employeement_type to Intern, vendor to BSC, and designation to Trainee
													setNewEmployee({ ...newEmployee, employeement_type: 'Intern', vendor: 'BSC', designation: 'Trainee' });
												} else if (text === "Contract") {
													setNewEmployee({ ...newEmployee, employeement_type: text, vendor: '', designation: 'Engineer II,' });

												}
											}}
										>
											<Picker.Item label="Choose Employeement Type" value="" />
											{empTypes.map((emp, index) => (
												<Picker.Item key={index} label={emp} value={emp} />
											))}
										</Picker>
									</View>
								</View>
								<View style={styles.inputContainer}>
									<Text style={isDesktop ? styles.deskuser : styles.user}>Work Mode</Text>
									<View>
										<Picker
											selectedValue={newEmployee.work_mode}
											style={isDesktop ? styles.deskpicker : styles.picker}
											onValueChange={(text) => setNewEmployee({ ...newEmployee, work_mode: text })}
										>
											<Picker.Item label="Choose Work Mode" value="" />
											{modes.map((mode, index) => (
												<Picker.Item key={index} label={mode} value={mode} />
											))}
										</Picker>
									</View>
								</View>
								<View style={styles.inputContainer}>
									<Text style={isDesktop ? styles.deskuser : styles.user}>Gender</Text>
									<View>
										<Picker
											selectedValue={newEmployee.gender}
											style={isDesktop ? styles.deskpicker : styles.picker}
											onValueChange={(text) => setNewEmployee({ ...newEmployee, gender: text })}
										>
											<Picker.Item label="Choose Gender" value="" />
											{genders.map((gender, index) => (
												<Picker.Item key={index} label={gender} value={gender} />
											))}
										</Picker>
									</View>
								</View>

								<View style={styles.inputContainer}>
									<Text style={isDesktop ? styles.deskuser : styles.user}>Designation</Text>
									<View>
										<Picker
											selectedValue={newEmployee.designation}
											enabled={newEmployee.employeement_type !== "Intern" && newEmployee.employeement_type !== "Contract"}
											style={isDesktop ? styles.deskpicker : styles.picker}
											onValueChange={(text) => {
												if (newEmployee.employeement_type !== 'Intern' && newEmployee.employeement_type !== "Contract") {
													setNewEmployee({ ...newEmployee, designation: text });
												}
											}}
										>
											<Picker.Item label="Choose Designation" value="" />
											{designation.map((designation, index) => (
												<Picker.Item key={index} label={designation} value={designation} />
											))}
										</Picker>
									</View>
								</View>
							</View>

							<View style={isDesktop ? styles.inputRow : styles.layout1}>
								<View style={styles.inputContainer}>
									<Text style={isDesktop ? styles.deskuser : styles.user}>Vendor</Text>
									<View>
										<Picker
											selectedValue={newEmployee.vendor}
											enabled={newEmployee.employeement_type !== 'FTE' && newEmployee.employeement_type !== 'Intern'}
											style={isDesktop ? styles.deskpicker : styles.picker}

											onValueChange={(text) => {

												if (newEmployee.employeement_type !== 'FTE' && newEmployee.employeement_type !== 'Intern') {

													if (text === 'BSC') {
														setNewEmployee({ ...newEmployee, vendor: "BSC", employeement_type: "FTE" });
													}
													else
														setNewEmployee({ ...newEmployee, vendor: text, });
												}
											}} >


											<Picker.Item label="Choose Vendor" value="" />

											{vendors.map((vendor, index) => (
												<Picker.Item key={index} label={vendor} value={vendor} />
											))}
										</Picker>
									</View>
								</View>

								<View style={styles.inputContainer}>
									<Text style={isDesktop ? styles.deskuser : styles.user}>Team</Text>
									<View>
										<Picker
											selectedValue={newEmployee.team}
											style={isDesktop ? styles.deskpicker : styles.picker}
											onValueChange={(text) => {
												setNewEmployee({ ...newEmployee, team: text, sub_team: '' });
											}}
										>
											<Picker.Item label="Choose Team" value="" />
											{teams.map((team, index) => (
												<Picker.Item key={index} label={team} value={team} />
											))}
										</Picker>
									</View>
								</View>


								<View style={styles.inputContainer}>
									<Text style={isDesktop ? styles.deskuser : styles.user}>Sub Team</Text>
									<View>
										<Picker
											selectedValue={newEmployee.sub_team}
											style={isDesktop ? styles.deskpicker : styles.picker}
											onValueChange={(text) => setNewEmployee({ ...newEmployee, sub_team: text })}
										>
											<Picker.Item label="Choose Sub Team" value="" />
											{(newEmployee.team ? filteredSubTeams : subTeams).map((sub, index) => (
												<Picker.Item key={index} label={sub} value={sub} />
											))}
										</Picker>
									</View>
								</View>

								<View style={styles.inputContainer}>
									<Text style={isDesktop ? styles.deskuser : styles.user}>Cost Center</Text>
									<View>
										<Picker
											selectedValue={newEmployee.cost_center}
											style={isDesktop ? styles.deskpicker : styles.picker}
											onValueChange={(text) => setNewEmployee({ ...newEmployee, cost_center: text })}
										>
											<Picker.Item label="Choose Cost Center" value="" />
											{costs.map((cost, index) => (
												<Picker.Item key={index} label={cost} value={cost} />
											))}
										</Picker>
									</View>
								</View>
							</View>
							<View style={isDesktop ? styles.inputRow1 : styles.layout2}>
								<View style={styles.inputContainer}>
									<Text style={isDesktop ? styles.deskuser : styles.user}>Job Level</Text>
									<View>
										<Picker
											selectedValue={newEmployee.job_level}
											style={isDesktop ? styles.deskpicker : styles.picker}
											onValueChange={(text) => setNewEmployee({ ...newEmployee, job_level: text })}
										>
											<Picker.Item label="Choose Job Level" value="" />
											{levels.map((lev, index) => (
												<Picker.Item key={index} label={lev} value={lev} />
											))}
										</Picker>
									</View>
								</View>

								<View style={styles.inputContainer}>
									<Text style={isDesktop ? styles.deskuser : styles.user}>Reporting Manager</Text>
									<View>
										<Picker
											selectedValue={newEmployee.reporting_manager}
											style={isDesktop ? styles.deskpicker : styles.picker}
											onValueChange={(text) => setNewEmployee({ ...newEmployee, reporting_manager: text })}
										>
											<Picker.Item label="Choose Reporting Manager" value="" />
											{repMan.map((man, index) => (
												<Picker.Item key={index} label={man} value={man} />
											))}
										</Picker>
									</View>
								</View>

								<View style={styles.inputContainer}>
									<Text style={isDesktop ? styles.deskuser : styles.user}>Functional Head</Text>
									<View>
										<Picker
											selectedValue={newEmployee.functional_head}
											style={isDesktop ? styles.deskpicker : styles.picker}
											onValueChange={(text) => setNewEmployee({ ...newEmployee, functional_head: text })}
										>
											<Picker.Item label="Choose Functional Head" value="" />
											{head.map((head, index) => (
												<Picker.Item key={index} label={head} value={head} />
											))}
										</Picker>
									</View>
								</View>


							</View>

							<View style={isDesktop ? styles.dekbuttoncontainer : styles.buttonContainer}>
								<View style={(bool) ? (isDesktop ? styles.deskbuttonwrapperDisable : styles.buttonWrapperDisable) : (isDesktop ? styles.deskbuttonwrapper : styles.buttonWrapper)}>
									<TouchableOpacity style={isDesktop ? styles.deskbutton : styles.button} onPress={SaveEmployee}
										disabled={bool}>

										<Text style={isDesktop ? styles.deskbuttonText : styles.buttonText}>{editMode ? "Save" : "Add"}</Text>

									</TouchableOpacity>
								</View>

								<View style={{ height: 10, width: 25 }} />
								<View style={isDesktop ? styles.deskbuttonwrapper : styles.buttonWrapper}>
									<TouchableOpacity style={isDesktop ? styles.deskbutton : styles.button} onPress={onClose}>
										<Text style={isDesktop ? styles.deskbuttonText : styles.buttonText}>Cancel</Text>
									</TouchableOpacity>
								</View>
							</View>

							<View style={isDesktop ? (styles.DeleteButton) : (styles.DeleteButtonMobile)} >
								<View style={editMode ? (isDesktop ? styles.deskbuttonwrapperDelete : styles.buttonWrapper) : (styles.hidden)}>

									<TouchableOpacity style={editMode ? (isDesktop ? styles.deskbutton : styles.button) : (styles.hidden)} onPress={DeleteEmployee}>
										<Text style={{
											color: 'black', fontSize: 22, fontWeight: "bold", alignSelf: "center", textAlign: "center",
											width: getPercentageWidth(50, width), justifyContent: "center", marginTop: 7
										}}>{editMode ? "Delete" : null}</Text>
									</TouchableOpacity>
								</View>
							</View>

						</ScrollView>
					</Provider>

				</Modal>


			</KeyboardAvoidingView>

		</Provider>

	);
};

const styles = StyleSheet.create({
	DeleteButton: {
		// backgroundColor:'red',

		marginTop: getPercentageWidth(5, height),
		justifyContent: 'center',
		alignItems: 'center'

	},
	DeleteButtonMobile: {
		marginLeft: -10,
		// backgroundColor:'red',
		marginTop: getPercentageWidth(0, height),
		marginBottom: 10,
		justifyContent: 'center',
		alignItems: 'center'
	},
	clearButton: {
		backgroundColor: '#086A96',
		borderRadius: 5,
		height: 25,
		marginBottom: 20,
		paddingHorizontal: 10,
		borderRadius: 5,
		marginLeft: getPercentageWidth(1, width),
		borderWidth: 1,
		width: getPercentageWidth(8, width)

	},
	clearButtonText: {
		color: 'white',
		fontWeight: 'bold',
	},
	hidden: {
		width: 0,
		height: 0
	},
	container: {
		flex: 1,
		backgroundColor: "#f9f9f9",
		padding: 10,
		position: "relative"
	},
	container1: {
		backgroundColor: "off-white",
		flex: 1,
		width: getPercentageWidth(98, width),
		marginTop: getPercentageWidth(1, height),
		marginHorizontal: getPercentageWidth(1, width)
	},

	inputContainer: {
		flex: 1,
		marginRight: 10,
		// backgroundColor:"black"
	},
	inputRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 10,
		// borderWidth:2
	},

	inputRow1: {
		flexDirection: 'row',
		marginBottom: 10,
		width: getPercentageWidth(75, width),
		// backgroundColor:"blue"

	},
	layout: {
		backgroundColor: '#f9f9f9',
		flex: 1,
		alignContent: "flex-start",

	},
	layout3: {
		backgroundColor: '#f9f9f9',
		flex: 1,
		alignContent: "flex-start",
	},
	layout1: {
		backgroundColor: 'white',
		flex: 1,
		alignContent: "flex-start",
		marginLeft: 10,
	},
	layout2: {
		backgroundColor: 'white',
		alignContent: "flex-start",
		marginLeft: 10,
	},

	containerDesk: {
		flex: 1,
		padding: 10,
		backgroundColor: '#f9f9f9',
		position: "relative",
		width: getPercentageWidth(98.5, width)

	},

	head: {
		height: 50,
		borderRadius: 10,
		backgroundColor: '#021E48',
		width: getPercentageWidth(96.5, width),
		borderColor: "white"
	},

	text: {
		textAlign: 'center',
		fontWeight: 'bold',
		color: "black",
		fontFamily: "Roboto Light",
		fontSize: 11
	},

	text1: {
		textAlign: 'center',
		fontWeight: 'bold',
		color: "white",
		fontFamily: "Roboto",
		fontSize: 13
	},


	rowWrapper: {
		flexDirection: 'row',
		backgroundColor: 'white',
		width: getPercentageWidth(96.5, width)
	},

	cell: {
		flex: 1,
		padding: 10,
		borderRightWidth: 1,
		borderColor: 'white',
		color: "black"
	},

	icon: {
		position: 'absolute',
		bottom: 10,
		right: getPercentageWidth(15, width),
	},
	// deskicon:{
	// 	position: 'absolute', 
	// 	bottom: 10,
	// 	right: getPercentageWidth(6,width),
	// },
	// deskicon1:{
	// 		position: 'absolute', 
	// 	bottom: 70,
	// 	right: getPercentageWidth(6,width),
	// },
	user: {
		fontSize: 14,
		fontWeight: "bold",
		marginBottom: 3
	},

	deskuser: {
		fontSize: 12,
		fontWeight: "bold",
		marginBottom: 6,
		marginLeft: getPercentageWidth(1, width)
	},
	itemContainer: {
		marginBottom: 1,
		marginTop: 10,
		padding: 5,
		backgroundColor: "white",
		borderRadius: 10,
		elevation: 10,
		shadowOffset: 1,
		shadowRadius: 5
	},
	itemTouchable: {
		borderRadius: 10,
		overflow: "hidden",
	},
	tooltipContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: 10, // Adjust margin as needed
	},
	nameText: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
		paddingLeft: 60,
	},
	searchBarContainer: {
		width: '100%',
		marginBottom: 1,
	},
	searchBarInput: {
		fontSize: 16, paddingBottom: 15, color: "black"
	},
	searchBar: {
		backgroundColor: "white",
		borderWidth: 1,
		elevation: 5,
		height: 40,
		borderRadius: 10

	},
	location: {
		fontSize: 14,
		color: "#333",
		fontWeight: "bold",
		paddingLeft: 60,
		marginTop: 5,
	},
	work: {
		fontSize: 14,
		color: "#333",
		fontWeight: "bold",
		paddingLeft: 60,
		marginTop: 5,
	},
	modalText: {
		marginBottom: 15,
		marginTop: 5,
		textAlign: 'center',
		fontSize: 18,
		fontWeight: "bold",
		alignSelf: "center"
	},

	input: {
		height: 40,
		color: "gray",
		fontSize: 15,
		borderColor: 'gray',
		backgroundColor: "white",
		borderWidth: 1,
		marginBottom: 20,
		marginTop: 0,
		paddingHorizontal: 10,
		borderRadius: 5,
		width: getPercentageWidth(92, width),
		marginHorizontal: getPercentageWidth(0.5, width)
	},
	deskinput: {
		height: 35,
		color: "gray",
		fontSize: 12,
		borderColor: 'gray',
		backgroundColor: "white",
		borderWidth: 1,
		marginBottom: 20,
		marginTop: 0,
		paddingHorizontal: 5,
		marginLeft: getPercentageWidth(1, width),
		borderRadius: 5,
		width: getPercentageWidth(20, width)
	},
	picker: {
		height: 40,
		color: "gray",
		marginBottom: 20,
		paddingHorizontal: 10,
		borderRadius: 5,
		backgroundColor: "white",
		borderWidth: 1,
		width: getPercentageWidth(92, width),
		marginHorizontal: getPercentageWidth(0.5, width)
	},
	deskpicker: {
		height: 35,
		fontSize: 12,
		color: "gray",
		marginBottom: 20,
		paddingHorizontal: 10,
		borderRadius: 5,
		marginLeft: getPercentageWidth(1, width),
		backgroundColor: "white",
		borderWidth: 1,
		width: getPercentageWidth(20, width)
	},
	deskpickerFilter: {
		height: 25,
		fontSize: 12,
		color: "black",
		marginBottom: 20,
		paddingHorizontal: 10,
		borderRadius: 5,
		marginLeft: getPercentageWidth(1, width),
		backgroundColor: "white",
		borderWidth: 1,
		width: getPercentageWidth(10, width)
	},
	editButton: {
		backgroundColor: "grey",
		alignItems: "center",
	},
	button: {
		height: 35,
		alignItems: 'center',
		borderRadius: 5,
		marginBottom: 20,
		width: getPercentageWidth(35, width)
	},
	deskbutton: {
		height: 45,
		// justifyContent: 'center',
		// alignItems: 'center',
		alignSelf: "center",
		borderRadius: 15,
		marginBottom: 5,
	},
	buttonContainer: {
		flexDirection: 'row',
		marginBottom: 10,
		width: getPercentageWidth(90, width),
		justifyContent: 'center',
		alignContent: "center",
		marginHorizontal: getPercentageWidth(3, width)
	},
	dekbuttoncontainer: {
		flexDirection: 'row',
		// width: getPercentageWidth(70,width),
		justifyContent: 'center',
		alignContent: "center",
		borderRadius: 15,
		// backgroundColor:"red"
	},
	buttonText: {
		color: 'white',
		fontSize: 20,
		fontWeight: "bold",
		alignItems: "center",
		marginHorizontal: getPercentageWidth(3, width),
		marginVertical: getPercentageWidth(2, height)
		// alignSelf:"center",
		// alignContent:"center"

	},
	deskbuttonText: {
		color: 'white',
		fontSize: 22,
		fontWeight: "bold",
		alignSelf: "center",
		textAlign: "center",
		width: getPercentageWidth(50, width),
		justifyContent: "center",
		marginTop: 7
	},
	buttonWrapper: {
		borderRadius: 5,
		overflow: 'hidden',
		backgroundColor: "#086A96",
		// backgroundColor:"blue"
	},
	buttonWrapperDisable: {
		borderRadius: 5,
		overflow: 'hidden',
		backgroundColor: "grey",
		// backgroundColor:"blue"
	},
	deskbuttonwrapper: {
		borderRadius: 5,
		overflow: 'hidden',
		width: getPercentageWidth(12, width),
		// justifyContent:"space-evenly",
		// alignContent:"space-evenly",
		// alignItems:"flex-end",
		backgroundColor: "#086A96"
	},
	deskbuttonwrapperDelete: {
		borderRadius: 5,
		overflow: 'hidden',
		width: getPercentageWidth(12, width),
		// justifyContent:"space-evenly",
		// alignContent:"space-evenly",
		// alignItems:"flex-end",
		backgroundColor: "#086A96"
	},
	deskbuttonwrapperDisable: {
		borderRadius: 5,
		overflow: 'hidden',
		width: getPercentageWidth(12, width),
		// justifyContent:"space-evenly",
		// alignContent:"space-evenly",
		// alignItems:"flex-end",
		backgroundColor: "grey"
	},
	headerContainer: {
		flexDirection: "row",
		padding: 10,
		borderWidth: 1,
		width: getPercentageWidth(98, width),
		borderRadius: 10,
		borderColor: "white",
		backgroundColor: "#2C3E50",
		marginBottom: 5,
		// marginLeft:-25,
		marginTop: 10,
		elevation: 5
	},
	headerText: {
		flex: 1,
		fontWeight: "bold",
		color: "white",
		textAlign: 'center',
		fontSize: 12,
		fontFamily: "Roboto"
	},
	rowContainer: {

		flexDirection: "row",
		padding: 10,
		width: getPercentageWidth(98, width),
		borderWidth: 1,
		borderRadius: 10,
		borderColor: "white",
		backgroundColor: "#ffffff",
		marginBottom: 5,
		marginTop: 1,
		marginLeft: getPercentageWidth(1, width)
		// marginLeft:-25
	},
	cellText: {
		flex: 1,
		textAlign: 'left',
		fontFamily: "Roboto Light",
		fontWeight: "bold",
		fontSize: 10.5
	},
	desktopContentDesign: {
		flexDirection: 'column',
	},
	detailColumn: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		marginBottom: 1,
		marginTop: 5
	},
	detailLabel: {
		fontWeight: "bold",
		marginTop: -5,
		marginBottom: 2,
		alignItems: "center"
	},
	detailValue: {
		padding: 0,
		marginTop: -20,
		fontSize: 14,
		fontWeight: "bold",
		color: "grey",
		alignItems: "center",
		left: 150,
		position: "relative"
	},
});

export default Employee;
