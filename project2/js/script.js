
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

			  $('#addFormDepartment, #editFormDepartment, #searchDepDepartment').empty();
			  
			  $('#addFormDepartment').html(`<option value="" disabled selected>Select</option>`);

			  $('#searchDepDepartment').html(`<option value="" disabled selected>Select</option>`);

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

// 2) running data function on startup:

$(getTableData()); 

// for the removal of the pre loader: 
$('#pre-load').removeClass("fadeOut");


// delete department dependency check: 
function deleteDepDependency(id) {
	
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
		  
			if (result.data[0]['departmentCount'] == 0){
				
				$("#DeleteDepartmentName").text(result.data[0].departmentName);
				$("#deletedepartmentID").val(id);
				$('#deleteDepartmentModal').modal("show");

			}
			else {
				$("#cantDeleteDeptName").text(result.data[0].departmentName);
				$("#pc").text(result.data[0].departmentCount);
				$('#cantDeleteDepartmentModal').modal("show");  
			}
			
	  }},
		error: function(jqXHR, textStatus, errorThrown) {
		  console.log(jqXHR);
		}
	  })	
}
$('#deleteDepartmentModal').on("submit", function (e) {

	e.preventDefault();
		
	$.ajax({
		url: "php/deleteDepartmentByID.php",
		type: 'POST',
		dataType: 'json',
		data: {
			id: $("#deletedepartmentID").val()
		},
		success: function(result) {
	
		//console.log(JSON.stringify(result));
		  
		if (result.status.name == "ok") {
			
			$('#deleteDepartmentModal').modal('hide')
			getTableData();
			
	  }},
		error: function(jqXHR, textStatus, errorThrown) {
		  console.log(jqXHR);
		}
	  })
	})

// delete location dependency check: 
function deleteLocDependency(id) {
	
	$.ajax({
		url: "php/countLocation.php",
		type: 'POST',
		dataType: 'json',
		data: {
			id: id
		},
		success: function(result) {

			//console.log(JSON.stringify(result));
		  
		if (result.status.name == "ok") {
		  
			if (result.data[0]['locationCount'] == 0){
				
				$("#DeleteLocationName").text(result.data[0].locationName);
				$("#deleteLocationID").val(id);
				$('#deleteLocationModal').modal("show");

			}
			else {
				$("#cantDeleteLocName").text(result.data[0].locationName);
				$("#lc").text(result.data[0].locationCount);
				$('#cantDeleteLocationModal').modal("show");  
			}
			
	  }},
		error: function(jqXHR, textStatus, errorThrown) {
		  console.log(jqXHR);
		}
	  })	
}
$('#deleteLocationModal').on("submit", function (e) {

	e.preventDefault();
		
	$.ajax({
		url: "php/deleteLocationByID.php",
		type: 'POST',
		dataType: 'json',
		data: {
			id: $("#deleteLocationID").val()
		},
		success: function(result) {
	
		//console.log(JSON.stringify(result));
		  
		if (result.status.name == "ok") {
			
			$('#deleteLocationModal').modal('hide')
			getTableData();
			
	  }},
		error: function(jqXHR, textStatus, errorThrown) {
		  console.log(jqXHR);
		}
	  })
	})

// this function is for the location edit buttons & modal with editButton class: 

$('#editLocationModal').on('show.bs.modal', function (e) {
	
    $.ajax({
      url: "php/getLocationByID.php",
      type: 'POST',
      dataType: 'json',
      data: {
        id: $(e.relatedTarget).attr('data-id')
      },
      success: function (result) {
		  
		if (result.status.name == "ok") {
        
			$('#editLocationID').val($(e.relatedTarget).attr('data-id'))	
			$('#editLocationLocation').val(result.data[0]['name'])	
        
      } else {

        $('#editLocationModal.modal-title').replaceWith("Error retrieving data");

      } 

    },
    error: function (jqXHR, textStatus, errorThrown) {
      $('#editLocationModal.modal-title').replaceWith("Error retrieving data");
    }
  });
})

$('#editLocationSubmit').on("submit", function(e) {
  
  e.preventDefault();
  
  $.ajax({
	url: "php/updateLocation.php",
	type: 'POST',
	dataType: 'json',
	data: {

		id: $('#editLocationID').val(),
		name: $('#editLocationLocation').val(),
		
	},
	success: function(result) {

	//console.log(JSON.stringify(result));
	  
	if (result.status.name == "ok") {
	  
		$('#editLocationModal').modal('hide')
		getTableData();
			
  }},
	error: function(jqXHR, textStatus, errorThrown) {
	  console.log(jqXHR);
	}
  })
   
})

$('#editLocationModal').on('shown.bs.modal', function () {
  
  $('#editLocationLocation').focus();
  
});

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

        $('#editEmployeeModal.modal-title').replaceWith("Error retrieving data");

      } 

    },
    error: function (jqXHR, textStatus, errorThrown) {
      $('#editEmployeeModal.modal-title').replaceWith("Error retrieving data");
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

$('#editEmployeeModal').on('shown.bs.modal', function () {
  
  $('#editFormFirstName').focus();
  
});

// this function is for the department edit buttons & modal with editButton class: 

$('#editDepartmentModal').on('show.bs.modal', function (e) {
	
    $.ajax({
      url: "php/getDepartmentByID.php",
      type: 'POST',
      dataType: 'json',
      data: {
        id: $(e.relatedTarget).attr('data-id')
      },
      success: function (result) {
            
      //console.log(JSON.stringify(result));
		  
		if (result.status.name == "ok") {
        
			$('#departmentID').val($(e.relatedTarget).attr('data-id'))	
			$('#editDepartmentDepartment').val(result.data[0]['name'])	
			$('#editDepartmentLocation').val(result.data[0]['locationID'])	
        
      } else {

        $('#editDepartmentModal.modal-title').replaceWith("Error retrieving data");

      } 

    },
    error: function (jqXHR, textStatus, errorThrown) {
      $('#editDepartmentModal.modal-title').replaceWith("Error retrieving data");
    }
  });
})

$('#editDepartmentSubmit').on("submit", function(e) {
  
  e.preventDefault();
  
  $.ajax({
	url: "php/updateDepartment.php",
	type: 'POST',
	dataType: 'json',
	data: {

		id: $('#departmentID').val(),
		name: $('#editDepartmentDepartment').val(),
		locationID: $('#editDepartmentLocation').val(),
		
	},
	success: function(result) {

	//console.log(JSON.stringify(result));
	  
	if (result.status.name == "ok") {
	  
		$('#editDepartmentModal').modal('hide')
		getTableData();
			
  }},
	error: function(jqXHR, textStatus, errorThrown) {
	  console.log(jqXHR);
	}
  })
   
})

$('#editDepartmentModal').on('shown.bs.modal', function () {
  
  $('#editDepartmentDepartment').focus();
  
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
				
				$('#deleteEmployeeModal').modal('hide')
				getTableData();
				
		  }},
			error: function(jqXHR, textStatus, errorThrown) {
			  console.log(jqXHR);
			}
		  })
		})
		})


//on submitting a completed form in the add employee modal to update the database: 

$('#addEmployeeModal').on("submit", function(e) {
  
	e.preventDefault();
	
	$.ajax({
		url: "php/insertEmployee.php",
		type: 'POST',
		dataType: 'json',
		data: {
			firstName: $('#addEmployeeFirstName').val(),
			lastName: $('#addEmployeeLastName').val(),
			email: $('#addEmployeeEmail').val(),
			departmentID: $('#addFormDepartment').val()
		},
		success: function(result) {

			//console.log(JSON.stringify(result));
		  
		if (result.status.name == "ok") {
		  
			$("#addEmployeeModal").modal('hide');
			getTableData();		

	  }},
		error: function(jqXHR, textStatus, errorThrown) {
		  console.log(jqXHR);
		}
	  })
	
	
  })
  
  $('#addEmployeeModal').on('shown.bs.modal', function () {
	
	$('#addEmployeeFirstName').focus();
	
  });
  
  $('#addEmployeeModal').on('hidden.bs.modal', function () {
  
	  $('#addEmployeeFormSubmit')[0].reset();
	
  });

//on submitting a completed form in the add department modal to update the database: 

$('#addDepartmentModal').on("submit", function(e) {
  
	e.preventDefault();
	
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
			
			getTableData();	
			$('#addDepartmentModal').modal('hide');	

	  }},
		error: function(jqXHR, textStatus, errorThrown) {
		  console.log(jqXHR);
		}
	  })
	
	
  })
  
  $('#addDepartmentModal').on('shown.bs.modal', function () {
	
	$('#addDepDepartment').focus();
	
  });
  
  $('#addDepartmentModal').on('hidden.bs.modal', function () {
  
	  $('#addDepartmentSubmit')[0].reset();
	
  });

//on submitting a completed form in the add location modal to update the database: 

$('#addLocationModal').on("submit", function(e) {
  
	e.preventDefault();
	
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

			$('#addLocationModal').modal('hide');
			getTableData();		

	  }},
		error: function(jqXHR, textStatus, errorThrown) {
		  console.log(jqXHR);
		}
	  })
	
	
  })
  
  $('#addLocationModal').on('shown.bs.modal', function () {
	
	$('#addLocLocation').focus();
	
  });
  
  $('#addLocationModal').on('hidden.bs.modal', function () {
  
	  $('#addLocationSubmit')[0].reset();
	
  });

//nav tab setup

$(document).ready(function(){
	$('#locationTable').hide();
	$('#departmentTable').hide();
	
	searchModalID = 'searchEmployeeModal';
	$('#searchAll').attr('data-bs-target', '#' + searchModalID);
	addModalID = 'addEmployeeModal';
	$('#addAll').attr('data-bs-target', '#' + addModalID);

	$('#locationTab').click(
		()=>{
			getTableData()
			$('#locationTable').show();
			$('#personnelTable').hide();
			$('#departmentTable').hide();
			searchModalID = 'searchLocationModal';
			$('#searchAll').attr('data-bs-target', '#' + searchModalID);
			addModalID = 'addLocationModal';
			$('#addAll').attr('data-bs-target', '#' + addModalID);
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
			addModalID = 'addDepartmentModal';
			$('#addAll').attr('data-bs-target', '#' + addModalID);
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
			addModalID = 'addEmployeeModal';
			$('#addAll').attr('data-bs-target', '#' + addModalID);
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

<a href="#" class="deleteDepartmentButton" onclick="deleteDepDependency(${info[n].id})" data-id='${info[n].id}' ><i class="material-icons" title="Delete" >&#xE872;</i></a>

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
				<a href="" class="editButton" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id='${info[n].id}'><i class="material-icons" title="Edit">&#xE254;</i></a>

				<a href="#" class="deleteLocationButton" onclick="deleteLocDependency(${info[n].id})" data-id='${info[n].id}' ><i class="material-icons" title="Delete" >&#xE872;</i></a>
				</td>
				</tr>
				`);
				}}

//search functions: 

//search employee:

$('#searchEmployeeModal').on("submit", function(e) {
  
  e.preventDefault();
  
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
		populatePersonnelTab(searchEmployeeResult);
		$('#searchEmployeeModal').modal('hide');
  }},
	error: function(jqXHR, textStatus, errorThrown) {
	  console.log(jqXHR);
	}
  })
  
  
})

$('#searchEmployeeModal').on('shown.bs.modal', function () {
  
  $('#editEmployeeFirstName').focus();
  
});

$('#searchEmployeeModal').on('hidden.bs.modal', function () {

	$('#searchEmployeeSubmit')[0].reset();
  
});

//search department

$('#searchDepartmentModal').on("submit", function(e) {
  
  e.preventDefault();
  
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
		$('#searchDepartmentModal').modal('hide');
  }},
	error: function(jqXHR, textStatus, errorThrown) {
	  console.log(jqXHR);
	}
  })
  
})

$('#searchDepartmentModal').on('shown.bs.modal', function () {
  
  $('#searchDepDepartment').focus();
  
});

$('#searchDepartmentModal').on('hidden.bs.modal', function () {

	$('#searchDepartmentSubmit')[0].reset();
  
});

//search location

$('#searchLocationModal').on("submit", function(e) {
  
	e.preventDefault();
	
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
		  $('#searchLocationModal').modal('hide');
	}},
	  error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR);
	  }
	})
	
  })
  
  $('#searchLocationModal').on('shown.bs.modal', function () {
	
	$('#searchLocLocation').focus();
	
  });
  
  $('#searchLocationModal').on('hidden.bs.modal', function () {
  
	  $('#searchLocationSubmit')[0].reset();
	
  });
