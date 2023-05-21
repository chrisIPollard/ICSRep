
//global variables:
let activeTab;
let addModalID;
let searchModalID;
let databaseInfo;
let departmentDatabaseInfo;
let locationDatabaseInfo;
let locationIDCount
let departmentIDCount
let searchEmployeeResult
let editButtons;
let editID;
let deleteID;
let deleteDepartment;
let deleteEmployeeID;
let delLocation;
let editDepartment;
let editLocation;
let locations = {};
let departmentEmployees = [''];
let locationDepartments = [''];
let getEmployeeByID;

//populating table:

//1) Defining a function: 
function getTableData(){

	$.ajax({
	  url: 'php/getAll.php',
	  type: 'GET',
	  dataType: "json",
	  
	  success: function(result) {
	  
		//console.log(result.data);
		databaseInfo = result.data;
		console.log(databaseInfo);
	  
	  populatePersonnelTab(databaseInfo);

	//getting department info (embedded):
	
	$.ajax({
		url: "php/getAllDepartments.php",
		type: 'GET',
		dataType: 'json',
	
		success: function(result) {
	
		//console.log(JSON.stringify(result));
		  
		if (result.status.name == "ok") {

			departmentDatabaseInfo = result.data;
			console.log(departmentDatabaseInfo);

			populateDepartmentTab(departmentDatabaseInfo);

			//populating drop downs (personnel/employee forms): 

			  $('#addFormDepartment, #editFormDepartment, #searchEmployeeDepartment, #searchDepDepartment').empty();
			  
			  $('#addFormDepartment').html(`<option value="" disabled selected>Select</option>`);
			  $('#searchEmployeeDepartment, #searchDepDepartment').html(`<option value="" disabled selected>Select</option>`);

			  for (const department of departmentDatabaseInfo) {
				$('#addFormDepartment, #editFormDepartment, #searchEmployeeDepartment, #searchDepDepartment')
				  .append(`<option value="${department.id}">${department.name}</option>`);
			  }

	// Getting location info (embedded)

	$.ajax({
		url: "php/getAllLocations.php",
		type: 'GET',
		dataType: 'json',
	
		success: function(result) {
	
		//console.log(JSON.stringify(result));
		  
		if (result.status.name == "ok") {
			locationDatabaseInfo = result.data;
			console.log(locationDatabaseInfo)

			populateLocationTab(locationDatabaseInfo);

			//populating drop downs (personnel/employee forms): 
			
			result.data.forEach(item => {
			  locations[item.id] = item.name;
			});

			  $('#addDepLocation, #searchEmployeeLocation, #editDepartmentLocation, #searchDepLocation, #searchDepEmployees, #searchLocDepartments, #searchLocLocation' ).empty();
			
			  $('#addDepLocation, #editDepartmentLocation, #searchDepLocation, #searchLocLocation, #searchDepEmployees, #searchLocDepartments, #searchEmployeeLocation').html(`<option value="" disabled selected>Select</option>`);
  
			  for (const location of locationDatabaseInfo) {
				$('#searchEmployeeLocation, #addDepLocation, #editDepartmentLocation, #searchDepLocation, #searchLocLocation')
				  .append(`<option value="${location.id}">${location.name}</option>`);
			  }
				 
				  for (let n = 0; n < departmentDatabaseInfo.length; n ++){
						$(`#locationb${n}`).text(locations[departmentDatabaseInfo[n].locationID]);
				 }
				 $('#pre-load').addClass("fadeOut");

	  }},
		error: function(jqXHR, textStatus, errorThrown) {
		  console.log(jqXHR);
		}
	  })

	  }},
		error: function(jqXHR, textStatus, errorThrown) {
		  console.log(jqXHR);
		}
	  })
	},
   
	error: function(jqXHR, textStatus, errorThrown) {
	  console.log(jqXHR);
	}
  })
  }

// 2) running the function on startup:
$(getTableData()); 
$('#pre-load').removeClass("fadeOut");
// this function is for the employee delete buttons & modal with deleteButton class: 



//this function takes in the department ID and provides a last review before submitting the correct data:

function editDepartmentEntry(id){

	$.ajax({
		url: "php/getDepartmentByID.php",
		type: 'POST',
		dataType: 'json',
		data: {
			id: id
			
		},
		success: function(result) {
	
		//console.log(JSON.stringify(result));
		  
		if (result.status.name == "ok") {
		
		editDepartment = result.data;
		
		$('#editDepartmentDepartment').val(editDepartment[0]['name'])	
		$('#editDepartmentLocation').val(editDepartment[0]['locationID'])	
			
	  }},
		error: function(jqXHR, textStatus, errorThrown) {
		  console.log(jqXHR);
		}
	  })

		$('#editDepartmentSave').click(function() {
			$('#alertModale').modal('show');
			$("#editDepartmentModal").modal('hide');
			$("#alertModalContente").empty();
			$("#alertModalContente").append(`<p>Are you sure you want to replace:
			<ul>${editDepartment[0]['name']}</ul>
			<ul>${locations[editDepartment[0]['locationID']]}</ul>
			with
			<ul>${$('#editDepartmentDepartment').val()}</ul>
			<ul>${$('#editDepartmentLocation option:selected').text()}</ul>
			</p>`)
			
			$("#cancelCommite").click(()=>{$("#editDepartmentModal").modal('show');})
	
			$("#alertModalConfirme").click(()=>{

	$.ajax({
		url: "php/updateDepartment.php",
		type: 'POST',
		dataType: 'json',
		data: {
			id: id,
			name: $('#editDepartmentDepartment').val(),
			locationID: $('#editDepartmentLocation').val(),
		},
		success: function(result) {
	
		//console.log(JSON.stringify(result));
		  
		if (result.status.name == "ok") {
		  
			$("#alertModale").modal('hide');
			$('#lertModalConfirme').off();
			getTableData();
			
			
	  }},
		error: function(jqXHR, textStatus, errorThrown) {
		  console.log(jqXHR);
		}
	  })

	  $("#editDepartmentModal").modal('hide');

	})
	
	})
}

function deleteDepartmentEntry(id){
	
	$.ajax({
		url: "php/getDepartmentByID.php",
		type: 'POST',
		dataType: 'json',
		data: {
			id: id
		},
		success: function(result) {

		//console.log(JSON.stringify(result));
		  
		if (result.status.name == "ok") {
		  
			deleteDepartment = result.data;
			$("#lastDepartmentReview").html(`${deleteDepartment[0]['name']}`);

	  $("#finalDepartmentDelete").click(function() {

		$("#deleteDepartmentModal").modal('hide');

		$.ajax({
			url: "php/countDepartment.php",
			type: 'POST',
			dataType: 'json',
			data: {
				id: id
			},
			success: function(result) {

				//console.log(JSON.stringify(result));
			  
			if (result.status.name == "ok") {
			  
				if (result.data[0]['COUNT(departmentID)'] == 0){
					$.ajax({
						url: "php/deleteDepartmentByID.php",
						type: 'POST',
						dataType: 'json',
						data: {
							id: id
						},
						success: function(result) {
					
						//console.log(JSON.stringify(result));
						  
						if (result.status.name == "ok") {
							getTableData();
							$("#alertModalb").modal('hide');
							$('#finalDepartmentDelete').off();
							
					  }},
						error: function(jqXHR, textStatus, errorThrown) {
						  console.log(jqXHR);
						}
					  })
					
				}
				else {
					$("#deleteDepartmentModal").modal('hide');
					$("#alertModalb").modal('show');
					$("#alertModalContentb").html(`${deleteDepartment[0]['name']} has ${result.data[0]["COUNT(departmentID)"]} employees and therefore cannot be deleted.`);
				}
				
		  }},
			error: function(jqXHR, textStatus, errorThrown) {
			  console.log(jqXHR);
			}
		  })
	
	})
}},
error: function(jqXHR, textStatus, errorThrown) {
  console.log(jqXHR);
}
})
};

function deleteLocation (locationID) {
	$.ajax({
		url: "php/getLocationByID.php",
		type: 'POST',
		dataType: 'json',
		data: {
			id: locationID
		},
		success: function(result) {
	
		//console.log(JSON.stringify(result));
		  
		if (result.status.name == "ok") {
		  
			delLocation = result.data;
			$("#lastLocationReview").html(`${delLocation[0]['name']}`);
			
			$("#finalLocationDelete").click(function() {
				
				$.ajax({
					url: "php/countLocation.php",
					type: 'POST',
					dataType: 'json',
					data: {
						id: locationID
					},
					success: function(result) {
					  
						//console.log(JSON.stringify(result));

					if (result.status.name == "ok") {
					  
						if (result.data[0]['COUNT(locationID)'] == 0){
							$.ajax({
								url: "php/deleteLocationByID.php",
								type: 'POST',
								dataType: 'json',
								data: {
									id: locationID
								},
								success: function(result) {
							
								//console.log(JSON.stringify(result));
								  
								if (result.status.name == "ok") {
									$('#finallocationDelete').off();
									$("#deleteLocationModal").modal('hide');
									$("#alertModalf").modal('hide');
									getTableData();
									
							  }},
								error: function(jqXHR, textStatus, errorThrown) {
								  console.log(jqXHR);
								}
							  })
							
						}
						else {
							$("#deleteLocationModal").modal('hide');
							$("#alertModalf").modal('show');
							$("#alertModalContentf").html(`${delLocation[0]['name']} has ${result.data[0]['COUNT(locationID)']} departments and therefore cannot be deleted.`);
						}
						
				  }},
					error: function(jqXHR, textStatus, errorThrown) {
					  console.log(jqXHR);
					}
				  })
			
			})
	  }},
		error: function(jqXHR, textStatus, errorThrown) {
		  console.log(jqXHR);
		}
	  })
};

//this function takes in the department ID and provides a last review before submitting the correct data:

function editLocationEntry(locationID){

	$.ajax({
		url: "php/getLocationByID.php",
		type: 'POST',
		dataType: 'json',
		data: {
			id: locationID
			
		},
		success: function(result) {
	
		//console.log(JSON.stringify(result));
		  
		if (result.status.name == "ok") {
		
		editLocation = result.data;
		
		$('#editLocationLocation').val(editLocation[0]['name'])	
			
	  }},
		error: function(jqXHR, textStatus, errorThrown) {
		  console.log(jqXHR);
		}
	  })

		$('#editLocationSave').click(function() {
			$('#alertModalg').modal('show');
			$("#editLocationModal").modal('hide');
			$("#alertModalContentg").empty();
			$("#alertModalContentg").append(`<p>Are you sure you want to replace:
			<ul>${editLocation[0]['name']}</ul>
			with
			<ul>${$('#editLocationLocation').val()}</ul>
			</p>`)
			
			$("#cancelCommitg").click(()=>{$("#editLocationModal").modal('show');})
	
			$("#alertModalConfirmg").click(()=>{
				
	$.ajax({
		url: "php/updateLocation.php",
		type: 'POST',
		dataType: 'json',
		data: {
			id: locationID,
			name: $('#editLocationLocation').val()
		},
		success: function(result) {
	
		//console.log(JSON.stringify(result));
		  
		if (result.status.name == "ok") {
		  
			$("#alertModalg").modal('hide');
			$('#alertModalConfirmg').off();
			getTableData();
			
	  }},
		error: function(jqXHR, textStatus, errorThrown) {
		  console.log(jqXHR);
		}
	  })

	  $("#editDepartmentModal").modal('hide');

	})
	
	})
}

// this function is for the employee edit buttons & modal with editButton class: 

$('#editEmployeeModal').on('show.bs.modal', function (e) {
	
	
    $.ajax({
      url: "php/getEmployeeByID.php",
      type: 'POST',
      dataType: 'json',
      data: {
        id: $(e.relatedTarget).attr('data-id')
      },
      success: function (result) {
            
      //console.log(JSON.stringify(result));
		  
		if (result.status.name == "ok") {
        
        $('#employeeID').val(result.data[0].id);
        
        $('#editFormFirstName').val(result.data[0].firstName);
        $('#editFormLastName').val(result.data[0].lastName);
        $('#editFormJobTitle').val(result.data[0].jobTitle);
		$('#editFormEmail').val(result.data[0].email);
        $('#editFormDepartment').val(result.data[0].departmentID);
        
      } else {

        $('#exampleModal .modal-title').replaceWith("Error retrieving data");

      } 

    },
    error: function (jqXHR, textStatus, errorThrown) {
      $('#exampleModal .modal-title').replaceWith("Error retrieving data");
    }
  });
})

$('#editEmployeeFormSubmit').on("submit", function(e) {
  
  e.preventDefault();
  
  $.ajax({
	url: "php/updateEmployee.php",
	type: 'POST',
	dataType: 'json',
	data: {
		firstName: $('#editFormFirstName').val(),
		lastName: $('#editFormLastName').val(),
		jobTitle: $('#editFormJobTitle').val(),
		email: $('#editFormEmail').val(),
		departmentID: $('#editFormDepartment').val(),
		id: $('#employeeID').val()
		
	},
	success: function(result) {

	//console.log(JSON.stringify(result));
	  
	if (result.status.name == "ok") {
	  
		$('#editEmployeeModal').modal('hide')
		getTableData();
			
  }},
	error: function(jqXHR, textStatus, errorThrown) {
	  console.log(jqXHR);
	}
  })
  
  
})

$('#exampleModal').on('shown.bs.modal', function () {
  
  $('##editEmployeeModal').focus();
  
});

$('#editEmployeeModal').on('hidden.bs.modal', function () {

	//anything to rest on hiding goes here
  
});

//functions for the delete employee modal: 

$('#deleteEmployeeModal').on('show.bs.modal', function (e) {

		$.ajax({
			url: "php/getEmployeeByID.php",
			type: 'POST',
			dataType: 'json',
			data: {
				id: $(e.relatedTarget).attr('data-id')
			},
			success: function(result) {
		
			//console.log(JSON.stringify(result));
			  
			if (result.status.name == "ok") {
	
		$('#employeeID').val(result.data[0].id);
        $('#DeleteEmployeeName').html(' ' + result.data[0].firstName + ' ' + result.data[0].lastName);
				
		  }},
			error: function(jqXHR, textStatus, errorThrown) {
			  console.log(jqXHR);
			}
		  })
		  
		  $('#deleteEmployeeFormSubmit').on("submit", function(e) {
  
			e.preventDefault();
			
			
		$.ajax({
			url: "php/deleteEmployee.php",
			type: 'POST',
			dataType: 'json',
			data: {
				id: $('#employeeID').val()
			},
			success: function(result) {
		
			//console.log(JSON.stringify(result));
			  
			if (result.status.name == "ok") {
				
				$('#dleteEmployeeModal').modal('hide')
				getTableData();
				
		  }},
			error: function(jqXHR, textStatus, errorThrown) {
			  console.log(jqXHR);
			}
		  })
		})
		})


//on submitting a completed form in the add employee modal to update the database: 

	$('#addEmployeeSubmit').click(
		
		function() {
			
			$('#alertModal').modal('show');
		$("#addEmployeeModal").modal('hide');
		$("#alertModalContent").empty();
		$("#alertModalContent").append(`<p>Are you sure you want to add:</p>
		<ul>${$('#addFormFirstName').val()} ${$('#addFormLastName').val()}</ul>
		<ul>${$('#addFormEmail').val()}</ul>
		<ul>${$('#addFormDepartment option:selected').text()}</ul>
		`)
		$("#cancelCommit").click(()=>{$("#addEmployeeModal").modal('show');})

		$("#alertModalConfirm").click(()=>{

			$.ajax({
				url: "php/insertEmployee.php",
				type: 'POST',
				dataType: 'json',
				data: {
					firstName: $('#addFormFirstName').val(),
					lastName: $('#addFormLastName').val(),
					email: $('#addFormEmail').val(),
					departmentID: $('#addFormDepartment').val()
				},
				success: function(result) {

					//console.log(JSON.stringify(result));
				  
				if (result.status.name == "ok") {
				  
					$("#alertModal").modal('hide');
					$('#addFormFirstName').val('');
					$('#addFormLastName').val('');
					$('#addFormEmail').val('');
					$("#alertModalConfirm").off();
					getTableData();		

			  }},
				error: function(jqXHR, textStatus, errorThrown) {
				  console.log(jqXHR);
				}
			  })
			  
			  $("#addEmployeeModal").modal('hide');
		
			})
			}
		
		
		)

//on submitting a completed form in the add department modal to update the database: 

		
	$('#addDepartmentSubmit').click(function() {

		$('#alertModalh').modal('show');
		$("#addDepartmentModal").modal('hide');
		$("#alertModalContenth").empty();
		$("#alertModalContenth").append(`<p>Are you sure you want to add:</p>
		<ul>${$('#addDepDepartment').val()}</ul>
		`)
		$("#cancelCommith").click(()=>{$("#addDepartmentModal").modal('show');})

		$("#alertModalConfirmh").click(()=>{
			$("#alertModalh").modal('hide');
					$.ajax({
						url: "php/insertDepartment.php",
						type: 'POST',
						dataType: 'json',
						data: {
							name: $('#addDepDepartment').val(),
							locationID: $('#addDepLocation').val()
						},
						success: function(result) {

							//console.log(JSON.stringify(result));
						  
						if (result.status.name == "ok") {
							
							$("#alertModalConfirmh").off();
							$('#addDepDepartment').val('');
							getTableData();		
		
					  }},
						error: function(jqXHR, textStatus, errorThrown) {
						  console.log(jqXHR);
						}
					  })
					  $("#addDepartmentModal").modal('hide');

					})
				})

//on submitting a completed form in the add location modal to update the database: 


	$('#addLocationSubmit').click(function() {

		$('#alertModali').modal('show');
		$("#addLocationModal").modal('hide');
		$("#alertModalContenti").empty();
		$("#alertModalContenti").append(`<p>Are you sure you want to add:</p>
		<ul>${$('#addLocLocation').val()}</ul>
		`)
		$("#cancelCommiti").click(()=>{$("#addLocationModal").modal('show');})

		$("#alertModalConfirmi").click(()=>{

			$.ajax({
				url: "php/insertLocation.php",
				type: 'POST',
				dataType: 'json',
				data: {
					name: $('#addLocLocation').val()
				},
				success: function(result) {

					//console.log(JSON.stringify(result));
				  
				if (result.status.name == "ok") {
					$("#alertModali").modal('hide');
					$('#addLocLocation').val('');
					$("#alertModalConfirmi").off();
					getTableData();		

			  }},
				error: function(jqXHR, textStatus, errorThrown) {
				  console.log(jqXHR);
				}
			  })
			  
			  $("#addLocationtModal").modal('hide');

			})
		})

//nav tab setup

$(document).ready(function(){
	$('#locationTable').hide();
	$('#departmentTable').hide();
	
	searchModalID = 'searchEmployeeModal';
	$('#searchAll').attr('data-bs-target', '#' + searchModalID);

	$('#locationTab').click(
		()=>{
			getTableData()
			$('#locationTable').show();
			$('#personnelTable').hide();
			$('#departmentTable').hide();
			searchModalID = 'searchlocationModal';
			$('#searchAll').attr('data-bs-target', '#' + searchModalID);
		}
	);

	$('#departmentTab').click(
		()=>{
			getTableData()
			$('#locationTable').hide();
			$('#personnelTable').hide();
			$('#departmentTable').show();
			searchModalID = 'searchDepartmentModal';
			$('#searchAll').attr('data-bs-target', '#' + searchModalID);
		}
	);

	$('#personnelTab').click(
		()=>{
			getTableData()
			$('#locationTable').hide();
			$('#personnelTable').show();
			$('#departmentTable').hide();
			searchModalID = 'searchEmployeeModal';
			$('#searchAll').attr('data-bs-target', '#' + searchModalID);
		}
	);

	//addModalID = activeTab.attr('data-addModal-id');
	


})

// Tab population functions:

function populatePersonnelTab(info){
$('#tableData').empty();
for (let n = 0; n < info.length; n ++){
	$('#tableData').append(`
	<tr>
	<td class="name">${info[n].lastName + ', ' + info[n].firstName}</td>
	<td class="email">${info[n].email}</td>
	<td class="department">${info[n].department}</td>
	<td class="location">${info[n].location}</td>
	<td class="actions">

		<a href="" class="editButton" data-bs-toggle="modal" data-bs-target="#editEmployeeModal" data-id='${info[n].id}'><i class="material-icons" title="Edit">&#xE254;</i></a>

		<a href="" class="deleteButton" data-bs-toggle="modal" data-bs-target="#deleteEmployeeModal" data-id='${info[n].id}' ><i class="material-icons" title="Delete">&#xE872;</i></a>
	</td>
	</tr>
	`);
	}}

	function populateDepartmentTab (info) 
	{$('#tableDatab').empty();
			
  for (let n = 0; n < info.length; n ++){
	  
$('#tableDatab').append(`
<tr>
<td class="departmentb" id="departmentb${n}"value="${info[n].id}">${info[n].name}</td>
<td class="locationb" id="locationb${n}"></td>
<td class="actions">

<a href="" class="editButton" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id='${info[n].id}'><i class="material-icons" title="Edit" >&#xE254;</i></a>

<a href="" class="deleteButton" data-toggle="modal" data-bs-target="#deleteDepartmentModal" data-id='${info[n].id}' ><i class="material-icons" title="Delete" >&#xE872;</i></a>

</td>
</tr>
`);

}}

function populateLocationTab(info) {
	$('#tableDatac').empty();
			
			for (let n = 0; n < info.length; n ++){
				
				$('#tableDatac').append(`
				<tr>
				<td class="locationc" id="${info[n].id}">${info[n].name}</td>
				<td class="actions">
				<a href="" class="editButton" data-bs-toggle="modal" data-bs-target="#editLocationModal" id='${info[n].id}'><i class="material-icons" title="Edit">&#xE254;</i></a>

				<a href="" class="deleteButton" data-toggle="modal" data-bs-target="#deleteLocationModal" id='${info[n].id}' ><i class="material-icons" title="Delete">&#xE872;</i></a>
				</td>
				</tr>
				`);
				}
		
				// running a function for the location delete button & modal with deleteButtonc class: 

				deleteButtons = document.querySelectorAll('.deleteButtonc');
		
				deleteButtons.forEach(deleteButtonc => {
				deleteButtonc.addEventListener('click', event => {

				let locID = event.target.id;	

				deleteLocation(locID);
				})})
		
				// function for the edit location & modal with the editButtonc class: 
		
				editButtons = document.querySelectorAll('.editButtonc');
		
				editButtons.forEach(editButtonc => {
				editButtonc.addEventListener('click', event => {
				
				let locID = event.target.id;	

				editLocationEntry(locID);
				})})
}

//search functions: 

//search employee:
$(function (){
	$('#searchEmployeeSubmit').click(
		
		function searchEmployees() {

			$.ajax({
				url: "php/searchEmployee.php",
				type: 'POST',
				dataType: 'json',
				data: {
					firstName: $('#searchEmployeeFirstName').val(),
					lastName: $('#searchEmployeeLastName').val()
				},
				success: function(result) {

					//console.log(JSON.stringify(result));
				  
				if (result.status.name == "ok") {
						
					searchEmployeeResult = result.data;
					populatePersonnelTab(searchEmployeeResult)
			  }},
				error: function(jqXHR, textStatus, errorThrown) {
				  console.log(jqXHR);
				}
			  })
			  
			  	$('#searchEmployeeModal').modal('hide');
				$('#searchEmployeeFirstName').val('');
				$('#searchEmployeeLastName').val('');
		
		})})

//search department

		$(function (){

			$('#searchDepartmentSubmit').click(
				
				function() {
					
					$.ajax({
						url: "php/searchDepartment.php",
						type: 'POST',
						dataType: 'json',
						data: {
							department: $('#searchDepDepartment option:selected').text()
						},
						success: function(result) {
		
							//console.log(JSON.stringify(result));
						  
						if (result.status.name == "ok") {

							searchDepartmentResult = result.data;
							populateDepartmentTab (searchDepartmentResult);
							$(`#locationb0`).text(locations[searchDepartmentResult[0].locationID]);
		
					  }},
						error: function(jqXHR, textStatus, errorThrown) {
						  console.log(jqXHR);
						}
					})
					$('#searchDepartmentModal').modal('hide');
					$('#searchDepDepartment').val('');
			  
			  })})

//search location

$(function (){
	$('#searchLocationSubmit').click(
		
		function() {
			
			$.ajax({
				url: "php/searchLocation.php",
				type: 'POST',
				dataType: 'json',
				data: {
					location: $('#searchLocLocation option:selected').text()
				},
				success: function(result) {

					//console.log(JSON.stringify(result));
				  
				if (result.status.name == "ok") {

					searchLocationResult = result.data;
					populateLocationTab (searchLocationResult);

			  }},
				error: function(jqXHR, textStatus, errorThrown) {
				  console.log(jqXHR);
				}
			})
			$('#searchLocationModal').modal('hide');
			$('#searchLocLocation').val('');
	  
	  })})