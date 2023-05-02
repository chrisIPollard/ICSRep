
//global variables:
let databaseInfo;
let departmentDatabaseInfo;
let locationDatabaseInfo;

let editButtons;
let editEmail;
let editDepartment;
let editLocation;
let editID;

let deleteButtons;
let place;

let addFirstName;
let addSurname;
let addEmail;
let addDepartmentID;

let departments = {};
let locations = {};

$(document).ready(function(){
	// Activate tooltip
	$('[data-toggle="tooltip"]').tooltip();
	
	// Select/Deselect checkboxes
	var checkbox = $('table tbody input[type="checkbox"]');
	$("#selectAll").click(function(){
		if(this.checked){
			checkbox.each(function(){
				this.checked = true;                        
			});
		} else{
			checkbox.each(function(){
				this.checked = false;                        
			});
		} 
	});
	checkbox.click(function(){
		if(!this.checked){
			$("#selectAll").prop("checked", false);
		}
	});
});

//populating table:

//1) Defining a function: 
function getTableData(){
	
	$('#tableData').empty();
	$('#tableDatab').empty();

	$.ajax({
	  url: 'php/getAll.php',
	  type: 'GET',
	  dataType: "json",
	  
	  success: function(result) {
	  
		//console.log(result.data);
		databaseInfo = result.data;
	  
	  for (let n = 0; n < databaseInfo.length; n ++){
		$('#tableData').append(`
		<tr>
		<td class="name">${databaseInfo[n].firstName + ' ' + databaseInfo[n].lastName}</td>
		<td class="email">${databaseInfo[n].email}</td>
		<td class="department">${databaseInfo[n].department}</td>
		<td class="location">${databaseInfo[n].location}</td>
		<td class="actions">
			<a href="#editEmployeeModal" class="editButton" data-toggle="modal"><i class="material-icons" id='editButton${n}' data-toggle="tooltip" title="Edit">&#xE254;</i></a>
			<a href="#deleteEmployeeModal" class="deleteButton" data-toggle="modal"><i class="material-icons" id='deleteButton${n}' data-toggle="tooltip" title="Delete">&#xE872;</i></a>
		</td>
		</tr>
		`);
		}

		// running a function for the employee delete button & modal with deleteButton class: 

		deleteButtons = document.querySelectorAll('.deleteButton');

		deleteButtons.forEach(deleteButton => {
		deleteButton.addEventListener('click', event => {
		deleteEntry(event.target.id);
		})})

		// function for the edit button & modal with the editButton class: 

		editButtons = document.querySelectorAll('.editButton');

		editButtons.forEach(editButton => {
		editButton.addEventListener('click', event => {
		editEntry(event.target.id);
		})})

	  },
   
	  error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR);
	  }
	}); 

	//getting department info:

	$.ajax({
		url: "php/getAllDepartments.php",
		type: 'GET',
		dataType: 'json',
	
		success: function(result) {
	
		//console.log(JSON.stringify(result));
		  
		if (result.status.name == "ok") {

			departmentDatabaseInfo = result.data;
			console.log(departmentDatabaseInfo);

			for (let n = 0; n < departmentDatabaseInfo.length; n ++){
		$('#tableDatab').append(`
		<tr>
		<td class="departmentb">${departmentDatabaseInfo[n].name}</td>
		<td class="actions">
			<a href="#editDepartmentModal" class="editButtonb" data-toggle="modal"><i class="material-icons" id='editButtonb${n}' data-toggle="tooltip" title="Edit">&#xE254;</i></a>
			<a href="#deleteEmployeeModal" class="deleteButtonb" data-toggle="modal"><i class="material-icons" id='deleteButtonb${n}' data-toggle="tooltip" title="Delete">&#xE872;</i></a>
		</td>
		</tr>
		`);
		}

		// running a function for the department delete button & modal with deleteButtonb class: 

		deleteButtons = document.querySelectorAll('.deleteButtonb');

		deleteButtons.forEach(deleteButtonb => {
		deleteButtonb.addEventListener('click', event => {
		// deleteEntry(event.target.id);
		})})

		// function for the edit button & modal with the editButtonb class: 

		editButtons = document.querySelectorAll('.editButtonb');

		editButtons.forEach(editButtonb => {
		editButtonb.addEventListener('click', event => {
		// editEntry(event.target.id);
		})})

			//populating drop downs (personnel/employee forms): 

			result.data.forEach(item => {
			  departments[item.id] = item.name;
			});
		
			$('#addFormDepartmentID, #editFormDepartmentID').empty();
			$('#addFormDepartmentID').html(`<option value="" disabled selected>Choose Department</option>`);
			

			
			for (const key in departments) {
				$('#addFormDepartmentID, #editFormDepartmentID').append(`<option value="${key}">${key}</option>`);
			  }		

			  $('#addFormDepartment, #editFormDepartment').empty();
			  $('#addFormDepartment').html(`<option value="" disabled selected>Select</option>`);

			  for (const key in departments) {
				  $('#addFormDepartment, #editFormDepartment').append(`<option value="${departments[key]}">${departments[key]}</option>`);
				}		

	  }},
		error: function(jqXHR, textStatus, errorThrown) {
		  console.log(jqXHR);
		}
	  })

	  //getting location info:

	$.ajax({
		url: "php/getAllLocations.php",
		type: 'GET',
		dataType: 'json',
	
		success: function(result) {
	
		//console.log(JSON.stringify(result));
		  
		if (result.status.name == "ok") {

			locationDatabaseInfo = result.data;

			for (let n = 0; n < locationDatabaseInfo.length; n ++){
				$('#tableDatac').append(`
				<tr>
				<td class="locationc">${locationDatabaseInfo[n].name}</td>
				<td class="actions">
					<a href="#editLocationModal" class="editButtonc" data-toggle="modal"><i class="material-icons" id='editButtonc${n}' data-toggle="tooltip" title="Edit">&#xE254;</i></a>
					<a href="#deleteLocationModal" class="deleteButtonc" data-toggle="modal"><i class="material-icons" id='deleteButtonc${n}' data-toggle="tooltip" title="Delete">&#xE872;</i></a>
				</td>
				</tr>
				`);
				}
		
				// running a function for the location delete button & modal with deleteButtonc class: 
		
				deleteButtons = document.querySelectorAll('.deleteButtonc');
		
				deleteButtons.forEach(deleteButtonc => {
				deleteButtonc.addEventListener('click', event => {
				// deleteEntry(event.target.id);
				})})
		
				// function for the edit button & modal with the editButtonb class: 
		
				editButtons = document.querySelectorAll('.editButtonc');
		
				editButtons.forEach(editButtonc => {
				editButtonc.addEventListener('click', event => {
				// editEntry(event.target.id);
				})})

			//populating drop downs (personnel/employee forms): 
			
			result.data.forEach(item => {
			  locations[item.id] = item.name;
			});

			  $('#addFormLocation, #editFormLocation, #addDepLocation, #addDepLocationID').empty();
			  $('#addFormLocation').html(`<option value="" disabled selected>Choose Department</option>`);
			  $('#addDepLocationID').html(`<option value="" disabled selected>Choose Location</option>`);
  
			  for (const key in locations) {
				  $('#addFormLocation, #editFormLocation, #addDepLocation').append(`<option value="${locations[key]}">${locations[key]}</option>`);
				}		

				for (const key in locations) {
					$('#addDepLocationID').append(`<option value="${key}">${key}</option>`);
				  }		

	  }},
		error: function(jqXHR, textStatus, errorThrown) {
		  console.log(jqXHR);
		}
	  })

  }

// 2) running the function on startup:
$(getTableData()); 

// this function is for the employee delete buttons & modal with deleteButton class: 

function deleteEntry(id){
	place = id.replace(/[^0-9]/g, '');
	
	$("#lastReview").html(
		`<ul>${databaseInfo[place].firstName} ${databaseInfo[place].lastName}</ul>
		<ul>${databaseInfo[place].email}</ul>
		<ul>${databaseInfo[place].department}</ul>
		<ul>${databaseInfo[place].location}</ul>
		`
	)
	$("#finalDelete").click(function() {

		$('#alertModal').modal('show');
		$("#deleteEmployeeModal").modal('hide');
		$("#alertModalContent").empty();
		$("#alertModalContent").append(`<p>Are you sure you want to delete ${databaseInfo[place].firstName} ${databaseInfo[place].lastName}?</p>`)
		$("#cancelCommit").click(()=>{$("#deleteEmployeeModal").modal('show');})
		$("#alertModalConfirm").click(()=>{
		
	$.ajax({
		url: "php/deleteEmployee.php",
		type: 'POST',
		dataType: 'json',
		data: {
			id: databaseInfo[place].id
		},
		success: function(result) {
	
		//console.log(JSON.stringify(result));
		  
		if (result.status.name == "ok") {
		  
			getTableData();
			$("#alertModal").modal('hide');
			
	  }},
		error: function(jqXHR, textStatus, errorThrown) {
		  console.log(jqXHR);
		}
	  })
	})
	  
		
	})
	
};

// this function is for the employee edit buttons & modal with editButton class: 

function editEntry(id){
	place = id.replace(/[^0-9]/g, '');
	editID = databaseInfo[place].id;

	$('#editFormFirstName').val(databaseInfo[place].firstName);
	$('#editFormSurname').val(databaseInfo[place].lastName);
	$('#editFormEmail').val(databaseInfo[place].email);
	$('#editFormDepartment').val(databaseInfo[place].department);

	for (let key in departments) {
		if (departments[key] == $('#editFormDepartment').val()) {
		  $('#editFormDepartmentID').val(key);
		}}
  
		for (x=0; x<departmentDatabaseInfo.length; x++){
		  
		  if (departmentDatabaseInfo[x].id == $('#editFormDepartmentID').val()){
			  $('#editFormLocation').val(locations[departmentDatabaseInfo[x].locationID]);}
		  
		}


		$('#editFormSubmit').submit(function() {
			
console.log($('#editFormFirstName').val() +
$('#editFormSurname').val() +
$('#editFormEmail').val() +
$('#editFormDepartmentID').val() +
 editID)

	$.ajax({
		url: "php/updateEmployee.php",
		type: 'POST',
		dataType: 'json',
		data: {
			firstName: $('#editFormFirstName').val(),
			surname: $('#editFormSurname').val(),
			email: $('#editFormEmail').val(),
			departmentID: $('#editFormDepartmentID').val(),
			id: editID
			
		},
		success: function(result) {
	
		//console.log(JSON.stringify(result));
		  
		if (result.status.name == "ok") {
		  
			getTableData();
			
	  }},
		error: function(jqXHR, textStatus, errorThrown) {
		  console.log(jqXHR);
		}
	  })

	  $("#deleteEmployeeModal").modal('hide');
	})
}
;

//closed dropdown options in the add new employee modal:

$(document).ready(()=>{
	
//managing the modal form auto selections (duplication here could be replaced with a function): 

	$('#addFormDepartment').change( 
		
		() => {
		
		for (let key in departments) {
		  if (departments[key] == $('#addFormDepartment').val()) {
			$('#addFormDepartmentID').val(key);
		  }}

		  for (x=0; x<departmentDatabaseInfo.length; x++){
			
			if (departmentDatabaseInfo[x].id == $('#addFormDepartmentID').val()){
				$('#addFormLocation').val(locations[departmentDatabaseInfo[x].locationID]);}
			
		  }
})

$('#editFormDepartment').change( () => {
		
	for (let key in departments) {
	  if (departments[key] == $('#editFormDepartment').val()) {
		$('#editFormDepartmentID').val(key);
	  }}

	  for (x=0; x<departmentDatabaseInfo.length; x++){
		
		if (departmentDatabaseInfo[x].id == $('#editFormDepartmentID').val()){
			$('#editFormLocation').val(locations[departmentDatabaseInfo[x].locationID]);}
	  }
	})

	$('#addDepLocation').change( () => {
		
		for (let key in locations) {
		  if (locations[key] == $('#addDepLocation').val()) {
			$('#addDepLocationID').val(key);
		  }}
		})

	//console.log(locations);
	// $('#addDepLocation').change( () => {
		
	// 	for (let key in departments) {
	// 	  if (departments[key] == $('#editFormDepartment').val()) {
	// 		$('#editFormDepartmentID').val(key);
	// 	  }}
	
	// 	  for (x=0; x<departmentDatabaseInfo.length; x++){
			
	// 		if (departmentDatabaseInfo[x].id == $('#editFormDepartmentID').val()){
	// 			$('#editFormLocation').val(locations[departmentDatabaseInfo[x].locationID]);}
	// 	  }
	// 	})

})

//on submitting a completed form in the add employee modal to update the database: 

$(function (){
	$('#addFormSubmit').submit(

		function(event) {
			event.preventDefault();

			$.ajax({
				url: "php/insertEmployee.php",
				type: 'POST',
				dataType: 'json',
				data: {
					firstName: $('#addFormFirstName').val(),
					surname: $('#addFormSurname').val(),
					email: $('#addFormEmail').val(),
					departmentID: $('#addFormDepartmentID').val()
				},
				success: function(result) {

					//console.log(JSON.stringify(result));
				  
				if (result.status.name == "ok") {
				  
					getTableData();		

			  }},
				error: function(jqXHR, textStatus, errorThrown) {
				  console.log(jqXHR);
				}
			  })
			  this.reset();
			  $("#addEmployeeModal").modal('hide');
		})})

//on submitting a completed form in the add department modal to update the database: 

		$(function (){
			$('#addDepFormSubmit').submit(
				
				function(event) {
					
					event.preventDefault();
					console.log($('#addDepLocationID').val());
					$.ajax({
						url: "php/insertDepartment.php",
						type: 'POST',
						dataType: 'json',
						data: {
							name: $('#addDepDepartment').val(),
							locationID: $('#addDepLocationID').val()
						},
						success: function(result) {

							console.log(JSON.stringify(result));
						  
						if (result.status.name == "ok") {
						  
							getTableData();		
		
					  }},
						error: function(jqXHR, textStatus, errorThrown) {
						  console.log(jqXHR);
						}
					  })
					  this.reset();
					  $("#addDepartmentModal").modal('hide');
				})})

//nav tab setup

$(document).ready(function(){
	$('#addLocation').hide();
	$('#addDepartment').hide();
	$('#locationTable').hide();
	$('#departmentTable').hide();

	$('#locationTab').click(
		()=>{
			$('#addLocation').show();
			$('#addEmployee').hide();
			$('#addDepartment').hide();
			$('#locationTable').show();
			$('#personnelTable').hide();
			$('#departmentTable').hide();
		}
	);

	$('#departmentTab').click(
		()=>{
			$('#addLocation').hide();
			$('#addEmployee').hide();
			$('#addDepartment').show();
			$('#locationTable').hide();
			$('#personnelTable').hide();
			$('#departmentTable').show();
		}
	);

	$('#personnelTab').click(
		()=>{
			$('#addLocation').hide();
			$('#addEmployee').show();
			$('#addDepartment').hide();
			$('#locationTable').hide();
			$('#personnelTable').show();
			$('#departmentTable').hide();
		}
	);
})


