
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
let addLastName;
let addEmail;
let addDepartmentID;

let departments = {};
let locations = {};
let departmentEmployees = [];
let locationDepartments = [];

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

	departmentEmployees = [];
	locationDepartments = [];

	$.ajax({
	  url: 'php/getAll.php',
	  type: 'GET',
	  dataType: "json",
	  
	  success: function(result) {

		$('#tableData').empty();
	  
		//console.log(result.data);
		databaseInfo = result.data;
		console.log(databaseInfo);
	  
	  for (let n = 0; n < databaseInfo.length; n ++){
		$('#tableData').append(`
		<tr>
		<td class="name">${databaseInfo[n].firstName + ' ' + databaseInfo[n].lastName}</td>
		<td class="email">${databaseInfo[n].email}</td>
		<td class="department">${databaseInfo[n].department}</td>
		<td class="location">${databaseInfo[n].location}</td>
		<td class="actions">
			<a href="#editEmployeeModal" class="editButton" data-toggle="modal"><i class="material-icons" id='editButton${databaseInfo[n].id}' data-toggle="tooltip" title="Edit">&#xE254;</i></a>
			<a href="#deleteEmployeeModal" class="deleteButton" data-toggle="modal"><i class="material-icons" id='deleteButton${databaseInfo[n].id}' data-toggle="tooltip" title="Delete">&#xE872;</i></a>
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

	//getting department info (embedded):
	
	$.ajax({
		url: "php/getAllDepartments.php",
		type: 'GET',
		dataType: 'json',
	
		success: function(result) {
	
		//console.log(JSON.stringify(result));
		  
		if (result.status.name == "ok") {

			departments = {};
			$('#tableDatab').empty();

			departmentDatabaseInfo = result.data;
			  
			departmentDatabaseInfo.sort(function(a, b) {
				const nameA = a.name.toUpperCase(); // ignore upper and lowercase
				const nameB = b.name.toUpperCase(); // ignore upper and lowercase
				if (nameA < nameB) {
				  return -1;
				}
				if (nameA > nameB) {
				  return 1;
				}
				return 0;
			  });
			  
			  console.log(departmentDatabaseInfo);
		
			function employeeNumbers (n) {
				let num = 0;
			for (x=0; x < databaseInfo.length; x++)
			{if (databaseInfo[x].departmentID == departmentDatabaseInfo[n]['id']){
					num ++;}
				}
				
				let obj = {};
				obj[departmentDatabaseInfo[n]['id']] = num;
				departmentEmployees.push(obj)
				return num;}

				function departmentNumbers(n){
					let num =0;
						for (x=0;x<departmentDatabaseInfo.length;x++){
					if (locationDatabaseInfo[n].id == departmentDatabaseInfo[x].locationID){
						num ++;}
					} 

					let obj = {};
					obj[departmentDatabaseInfo[n]['locationID']] = num;
					locationDepartments.push(obj)
					return num;}
					

			for (let n = 0; n < departmentDatabaseInfo.length; n ++){
				
		$('#tableDatab').append(`
		<tr>
		<td class="departmentb" id="departmentb${n}"value="${departmentDatabaseInfo[n].id}">${departmentDatabaseInfo[n].name}</td>
		<td class="employeesb">${
			employeeNumbers (n)
		}</td>
		<td class="locationb" id="locationb${n}"></td>
		<td class="actions">
			<a href="#editDepartmentModal" class="editButtonb" data-toggle="modal"><i class="material-icons" id='editButtonb${n}' data-toggle="tooltip" title="Edit">&#xE254;</i></a>
			<a href="#deleteDepartmentModal" class="deleteButtonb" data-toggle="modal"><i class="material-icons" id='deleteButtonb${n}' data-toggle="tooltip" title="Delete">&#xE872;</i></a>
		</td>
		</tr>
		`);

		}

		// running a function for the department delete button & modal with deleteButtonb class: 

		deleteButtons = document.querySelectorAll('.deleteButtonb');

		deleteButtons.forEach(deleteButtonb => {
		deleteButtonb.addEventListener('click', event => {

		let depID = event.target.id	
		depID = depID.replace('deleteButton', 'department');
		
		depID = $('#' + depID).attr('value');
		console.log(depID)
		deleteDepartmentEntry(depID);
		})})

		// function for the edit button & modal with the editButtonb class: 

		editButtons = document.querySelectorAll('.editButtonb');

		editButtons.forEach(editButtonb => {
		editButtonb.addEventListener('click', event => {
			let depID = event.target.id	
			depID = depID.replace('editButton', 'department');
		
			depID = $('#' + depID).attr('value');
			
			editDepartmentEntry(depID);
		})})

			//populating drop downs (personnel/employee forms): 

			departmentDatabaseInfo.forEach(item => {
			  departments[item.id] = item.name;
			});
		
			// trying to alphabetise the forms selects
			// const departmentArray = Object.entries(departments).sort(([a, valueA], [b, valueB]) => valueA.localeCompare(valueB));

			$('#addFormDepartmentID, #editFormDepartmentID').empty();
			
			$('#addFormDepartmentID').html(`<option value="" disabled selected>Choose Department</option>`);
			
			for (const key in departments) {
				$('#addFormDepartmentID, #editFormDepartmentID').append(`<option value="${key}">${key}</option>`);
			  }		

			  $('#addFormDepartment, #editFormDepartment, #searchEmployeeDepartment, #searchDepDepartment').empty();
			  $('#addFormDepartment').html(`<option value="" disabled selected>Select</option>`);
			  $('#searchEmployeeDepartment, #searchDepDepartment').html(`<option value="" disabled selected>Select</option>`);

			  for (const key in departments) {
				  $('#addFormDepartment, #editFormDepartment, #searchEmployeeDepartment, #searchDepDepartment').append(`<option value="${departments[key]}">${departments[key]}</option>`);
				}		


	// Getting location info (embedded)

	$.ajax({
		url: "php/getAllLocations.php",
		type: 'GET',
		dataType: 'json',
	
		success: function(result) {
	
		//console.log(JSON.stringify(result));
		  
		if (result.status.name == "ok") {

			$('#tableDatac').empty();

			locationDatabaseInfo = result.data;

			locationDatabaseInfo.sort(function(a, b) {
				const nameA = a.name.toUpperCase(); // ignore upper and lowercase
				const nameB = b.name.toUpperCase(); // ignore upper and lowercase
				if (nameA < nameB) {
				  return -1;
				}
				if (nameA > nameB) {
				  return 1;
				}
				return 0;
			  });

			console.log(locationDatabaseInfo)

			for (let n = 0; n < locationDatabaseInfo.length; n ++){
				$('#tableDatac').append(`
				<tr>
				<td class="locationc" id="${locationDatabaseInfo[n].id}">${locationDatabaseInfo[n].name}</td>
				<td class="locationc"> ${departmentNumbers(n)} </td>
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

				deleteLocation(event.target.parentNode.parentNode.parentNode.querySelector('.locationc').id);
				})})
		
				// function for the edit location & modal with the editButtonc class: 
		
				editButtons = document.querySelectorAll('.editButtonc');
		
				editButtons.forEach(editButtonc => {
				editButtonc.addEventListener('click', event => {
				
				editLocationEntry(event.target.parentNode.parentNode.parentNode.querySelector('.locationc').id);
				})})

			//populating drop downs (personnel/employee forms): 
			
			result.data.forEach(item => {
			  locations[item.id] = item.name;
			});

			  $('#addFormLocation, #editFormLocation, #addDepLocation, #searchEmployeeLocation, #addDepLocationID, #editDepartmentLocation, #editDepartmentLocationID, #searchDepLocation, #searchDepEmployees, #searchLocDepartments, #searchLocLocation' ).empty();
			  $('#addFormLocation').html(`<option value="" disabled selected>Choose Department</option>`);
			  $('#addDepLocation, #editDepartmentLocation, #searchDepLocation, #searchLocLocation, #searchDepEmployees, #searchLocDepartments, #searchEmployeeLocation').html(`<option value="" disabled selected>Select</option>`);
			  $('#addDepLocationID, #editDepartmentLocationID').html(`<option value="" disabled selected>Choose Location</option>`);
  
			  for (const key in locations) {
				  $('#addFormLocation, #searchEmployeeLocation, #editFormLocation, #addDepLocation, #editDepartmentLocation').append(`<option value="${locations[key]}">${locations[key]}</option>`);
				}
				
				for (const key in locations) {
					$('#searchDepLocation, #searchLocLocation').append(`<option value="${key}">${locations[key]}</option>`);
				  }

				for (const key in locations) {
					$('#addDepLocationID, #editDepartmentLocationID').append(`<option value="${key}">${key}</option>`);
				  }		

					// populating the number of employees dropdown in the department search: 
					let uniqueValues = Array.from(new Set(departmentEmployees.map(obj => Object.values(obj)[0])));
					let sortedValues = uniqueValues.sort((a, b) => a - b);
					$.each(sortedValues, function(index, value) {
					$('#searchDepEmployees').append(`<option value="${value}">${value}</option>`);
					});

					// populating the number of departments dropdown in the location search: 
					let uniqueValuesb = Array.from(new Set(locationDepartments.map(obj => Object.values(obj)[0])));
					let sortedValuesb = uniqueValuesb.sort((a, b) => a - b);
					$.each(sortedValuesb, function(index, value) {
					$('#searchLocDepartments').append(`<option value="${value}">${value}</option>`);
					});

				  console.log(locations);
				  for (let n = 0; n < departmentDatabaseInfo.length; n ++){
					
						$(`#locationb${n}`).text(locations[departmentDatabaseInfo[n].locationID]);
				 }

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

// this function is for the employee delete buttons & modal with deleteButton class: 

function deleteEntry(id){
	let thisdatabase;
	editID = id.replace(/[^0-9]/g, '');
	for (d=0;d<databaseInfo.length;d++)
	{if (databaseInfo[d]['id']==editID){
		thisdatabase = databaseInfo[d];
	}}

	$("#lastReview").html(
		`<ul>${thisdatabase.firstName} ${thisdatabase.lastName}</ul>
		<ul>${thisdatabase.email}</ul>
		<ul>${thisdatabase.department}</ul>
		<ul>${thisdatabase.location}</ul>
		`
	)
	$("#finalDelete").click(function() {

		$('#alertModalc').modal('show');
		$("#deleteEmployeeModal").modal('hide');
		$("#alertModalContentc").empty();
		$("#alertModalContentc").append(`<p>Are you sure you want to delete ${thisdatabase.firstName} ${thisdatabase.lastName}?</p>`)
		$("#cancelCommitc").click(()=>{$("#deleteEmployeeModal").modal('show');})
		$("#alertModalConfirmc").click(()=>{
		
	$.ajax({
		url: "php/deleteEmployee.php",
		type: 'POST',
		dataType: 'json',
		data: {
			id: thisdatabase.id
		},
		success: function(result) {
	
		//console.log(JSON.stringify(result));
		  
		if (result.status.name == "ok") {
			
			getTableData();
			$("#alertModalc").modal('hide');
			
	  }},
		error: function(jqXHR, textStatus, errorThrown) {
		  console.log(jqXHR);
		}
	  })
	})
	})
};

//this function takes in the department ID and provides a last review before submitting the correct data:

function editDepartmentEntry(id){

	let dep 
	for (d=0; d<departmentDatabaseInfo.length; d++)
	{if (departmentDatabaseInfo[d].id == id) {
		dep = departmentDatabaseInfo[d]}}
	$('#editDepartmentDepartment').val(dep.name);
	$('#editDepartmentLocation').val(locations[dep.locationID]);
	$('#editDepartmentLocationID').val(dep.locationID);

		$('#editDepartmentSave').click(function() {
			$('#alertModale').modal('show');
			$("#editDepartmentModal").modal('hide');
			$("#alertModalContente").empty();
			$("#alertModalContente").append(`<p>Are you sure you want to replace:
			<ul>${dep.name}</ul>
			<ul>${locations[dep.locationID]}</ul>
			with
			<ul>${$('#editDepartmentDepartment').val()}</ul>
			<ul>${$('#editDepartmentLocation').val()}</ul>
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
			locationID: $('#editDepartmentLocationID').val(),
		},
		success: function(result) {
	
		//console.log(JSON.stringify(result));
		  
		if (result.status.name == "ok") {
		  
			$("#alertModale").modal('hide');
			
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
	let department;
for (let d=0; d<departmentDatabaseInfo.length; d++){
	if (departmentDatabaseInfo[d].id == id){ department = departmentDatabaseInfo[d];}}
	$("#finalDepartmentDelete").show();
	$("#depWarning").show();
	$("#depQuestion").show();
	$("#lastDepartmentReview").html(
		`<p>${department.name}<p>`
	)

	let num = 0;
	for (x=0; x < databaseInfo.length; x++)
	{if (databaseInfo[x].departmentID == department.id){
			num ++;}}

	if (!num == 0) {
		$("#lastDepartmentReview").html(
			`<p>${department.name} has ${num} employees, unable to remove a department that is in use.<p>`);
		$("#finalDepartmentDelete").hide();
		$("#depWarning").hide();
		$("#depQuestion").hide();
	} else {

	$("#finalDepartmentDelete").click(function() {

		$('#alertModalb').modal('show');
		$("#deleteDepartmentModal").modal('hide');
		$("#alertModalContentb").empty();
		$("#alertModalContentb").append(`<p>Are you sure you want to delete ${department.name}?</p>`)
		$("#cancelCommitb").click(()=>{$("#deleteDepartmentModal").modal('show');})

		$("#alertModalConfirmb").click(()=>{
		
	$.ajax({
		url: "php/deleteDepartmentByID.php",
		type: 'POST',
		dataType: 'json',
		data: {
			id: department.id
		},
		success: function(result) {
	
		//console.log(JSON.stringify(result));
		  
		if (result.status.name == "ok") {
		  
			$("#alertModalb").modal('hide');
			
			getTableData();
			
	  }},
		error: function(jqXHR, textStatus, errorThrown) {
		  console.log(jqXHR);
		}
	  })
	})
	})
	}

};

function deleteLocation (locationID) {
	let location;
for (let l=0; l<locationDatabaseInfo.length; l++){
	if (locationDatabaseInfo[l].id == locationID){ location = locationDatabaseInfo[l];}}
		
	$("#finalLocationDelete").show();
	$("#locWarning").show();
	$("#locQuestion").show();
	$("#lastLocationReview").html(
		`<p>${location.name}<p>`
	)

	let num =0;
	for (x=0;x<departmentDatabaseInfo.length;x++){
	if (locationID == departmentDatabaseInfo[x].locationID){
		num ++;}
	} 

	if (!num == 0) {
		$("#lastLocationReview").html(
			`<p>${location.name} has ${num} departments, unable to remove a location that is in use.<p>`);
		$("#finalLocationDelete").hide();
		$("#locWarning").hide();
		$("#locQuestion").hide();
	} else {
		
		$("#finalLocationDelete").click(function() {

		$('#alertModalf').modal('show');
		$("#deleteLocationModal").modal('hide');
		$("#alertModalContentf").empty();
		$("#alertModalContentf").append(`<p>Are you sure you want to delete ${location.name}?</p>`)
		$("#cancelCommitf").click(()=>{$("#deleteLocationModal").modal('show');})

		$("#alertModalConfirmf").click(()=>{
		
	$.ajax({
		url: "php/deleteLocationByID.php",
		type: 'POST',
		dataType: 'json',
		data: {
			id: locationID
		},
		success: function(result) {
	
		console.log(JSON.stringify(result));
		  
		if (result.status.name == "ok") {
		  
			$("#alertModalf").modal('hide');
			
			getTableData();
			
	  }},
		error: function(jqXHR, textStatus, errorThrown) {
		  console.log(jqXHR);
		}
	  })
	})
	})
	}}

//this function takes in the department ID and provides a last review before submitting the correct data:

function editLocationEntry(locationID){

	let location 
	for (l=0; l<locationDatabaseInfo.length; l++)
	{if (locationDatabaseInfo[l].id == locationID) {
		location = locationDatabaseInfo[l]}}

	$('#editLocationLocation').val(location.name);

		$('#editLocationSave').click(function() {
			$('#alertModalg').modal('show');
			$("#editLocationModal").modal('hide');
			$("#alertModalContentg").empty();
			$("#alertModalContentg").append(`<p>Are you sure you want to replace:
			<ul>${location.name}</ul>
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

function editEntry(id){
	let thisdatabase;
	editID = id.replace(/[^0-9]/g, '');
	for (d=0;d<databaseInfo.length;d++)
	{if (databaseInfo[d]['id']==editID){
		thisdatabase = databaseInfo[d];
	}}

	$('#editFormFirstName').val(thisdatabase.firstName);
	$('#editFormLastName').val(thisdatabase.lastName);
	$('#editFormEmail').val(thisdatabase.email);
	$('#editFormDepartment').val(thisdatabase.department);

	for (let key in departments) {
		if (departments[key] == $('#editFormDepartment').val()) {
		  $('#editFormDepartmentID').val(key);
		}}
  
		for (x=0; x<departmentDatabaseInfo.length; x++){
		  
		  if (departmentDatabaseInfo[x].id == $('#editFormDepartmentID').val()){
			  $('#editFormLocation').val(locations[departmentDatabaseInfo[x].locationID]);}
		  
		}


		$('#editEmployeeSave').click(function() {

			$('#alertModald').modal('show');
			$("#editEmployeeModal").modal('hide');
			$("#alertModalContentd").empty();
			$("#alertModalContentd").append(`<p>Are you sure you want to replace:
			<ul>${thisdatabase.firstName + ' ' + thisdatabase.lastName}</ul>
			<ul>${thisdatabase.email}</ul>
			<ul>${thisdatabase.department}</ul>
			with
			<ul>${$('#editFormFirstName').val() + ' ' + $('#editFormLastName').val()}</ul>
			<ul>${$('#editFormEmail').val()}</ul>
			<ul>${$('#editFormDepartment').val()}</ul>
			</p>`)
			
			$("#cancelCommitd").click(()=>{$("#editEmployeeModal").modal('show');})
	
			$("#alertModalConfirmd").click(()=>{
	$.ajax({
		url: "php/updateEmployee.php",
		type: 'POST',
		dataType: 'json',
		data: {
			firstName: $('#editFormFirstName').val(),
			lastName: $('#editFormLastName').val(),
			email: $('#editFormEmail').val(),
			departmentID: $('#editFormDepartmentID').val(),
			id: editID
			
		},
		success: function(result) {
	
		//console.log(JSON.stringify(result));
		  
		if (result.status.name == "ok") {
		  
			$("#alertModald").modal('hide');
			
			getTableData();
			
			
	  }},
		error: function(jqXHR, textStatus, errorThrown) {
		  console.log(jqXHR);
		}
	  })

	  $("#editEmployeeModal").modal('hide');

	})
	
	})
}
;

//closed dropdown options in the add new employee modal:

$(document).ready(()=>{
	
//managing the modal form auto selections (duplication here could be replaced with a function): 

	$('#addFormDepartment').change( 
		
		() => {
			let departments ={};
			departmentDatabaseInfo.forEach(item => {
				departments[item.id] = item.name;
			  });
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
		let departments ={};
			departmentDatabaseInfo.forEach(item => {
				departments[item.id] = item.name;
			  });
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

		$('#editDepartmentLocation').change( () => {
		
			for (let key in locations) {
			  if (locations[key] == $('#editDepartmentLocation').val()) {
				$('#editDepartmentLocationID').val(key);
			  }}
			})

})

//on submitting a completed form in the add employee modal to update the database: 

$(function (){
	$('#addEmployeeSubmit').click(
		
		function() {
			
			$('#alertModal').modal('show');
		$("#addEmployeeModal").modal('hide');
		$("#alertModalContent").empty();
		$("#alertModalContent").append(`<p>Are you sure you want to add:</p>
		<ul>${$('#addFormFirstName').val()} ${$('#addFormLastName').val()}</ul>
		<ul>${$('#addFormEmail').val()}</ul>
		<ul>${$('#addFormDepartment').val()}</ul>
		<ul>${$('#addFormLocation').val()}</ul>
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
					departmentID: $('#addFormDepartmentID').val()
				},
				success: function(result) {

					//console.log(JSON.stringify(result));
				  
				if (result.status.name == "ok") {
				  
					$("#alertModal").modal('hide');
					$('#addFormFirstName').val('');
					$('#addFormLastName').val('');
					$('#addFormEmail').val('');
					
					getTableData();		

			  }},
				error: function(jqXHR, textStatus, errorThrown) {
				  console.log(jqXHR);
				}
			  })
			
			  this.reset();
			  
			  $("#addEmployeeModal").modal('hide');
		
			})
			}
		
		
		)})

//on submitting a completed form in the add department modal to update the database: 

		$(function (){
			$('#addDepartmentSubmit').click(
				function() {
		$('#alertModalh').modal('show');
		$("#addDepartmentModal").modal('hide');
		$("#alertModalContenth").empty();
		$("#alertModalContenth").append(`<p>Are you sure you want to add:</p>
		<ul>${$('#addDepDepartment').val()}</ul>
		<ul>${$('#addDepLocation').val()}</ul>
		`)
		$("#cancelCommith").click(()=>{$("#addDepartmentModal").modal('show');})

		$("#alertModalConfirmh").click(()=>{

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
							$("#alertModalh").modal('hide');
							$('#addDepDepartment').val('');
							
							getTableData();		
		
					  }},
						error: function(jqXHR, textStatus, errorThrown) {
						  console.log(jqXHR);
						}
					  })
					  this.reset();
					  $("#addDepartmentModal").modal('hide');

					})
				})})

//on submitting a completed form in the add location modal to update the database: 

$(function (){
	$('#addLocationSubmit').click(
		function() {
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
					
					getTableData();		

			  }},
				error: function(jqXHR, textStatus, errorThrown) {
				  console.log(jqXHR);
				}
			  })
			  this.reset();
			  $("#addLocationtModal").modal('hide');

			})
		})})

//nav tab setup

$(document).ready(function(){
	$('#addLocation').hide();
	$('#addDepartment').hide();
	$('#searchLocation').hide();
	$('#searchDepartment').hide();
	$('#locationTable').hide();
	$('#departmentTable').hide();

	$('#locationTab').click(
		()=>{
			getTableData()
			$('#addLocation').show();
			$('#addEmployee').hide();
			$('#addDepartment').hide();
			$('#searchEmployee').hide();
			$('#searchLocation').show();
			$('#searchDepartment').hide();
			$('#locationTable').show();
			$('#personnelTable').hide();
			$('#departmentTable').hide();
		}
	);

	$('#departmentTab').click(
		()=>{
			getTableData()
			$('#addLocation').hide();
			$('#addEmployee').hide();
			$('#addDepartment').show();
			$('#searchEmployee').hide();
			$('#searchLocation').hide();
			$('#searchDepartment').show();
			$('#locationTable').hide();
			$('#personnelTable').hide();
			$('#departmentTable').show();
		}
	);

	$('#personnelTab').click(
		()=>{
			getTableData()
			$('#addLocation').hide();
			$('#addEmployee').show();
			$('#addDepartment').hide();
			$('#searchEmployee').show();
			$('#searchLocation').hide();
			$('#searchDepartment').hide();
			$('#locationTable').hide();
			$('#personnelTable').show();
			$('#departmentTable').hide();
		}
	);
})

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

					console.log(JSON.stringify(result));
				  
				if (result.status.name == "ok") {
						

			  }},
				error: function(jqXHR, textStatus, errorThrown) {
				  console.log(jqXHR);
				}
			  })
			  
		// $('#tableData').empty();
		// for (let n = 0; n < searchDatabaseInfo.length; n ++){
		// 	$('#tableData').append(`
		// 	<tr>
		// 	<td class="name">${searchDatabaseInfo[n].firstName + ' ' + searchDatabaseInfo[n].lastName}</td>
		// 	<td class="email">${searchDatabaseInfo[n].email}</td>
		// 	<td class="department">${searchDatabaseInfo[n].department}</td>
		// 	<td class="location">${searchDatabaseInfo[n].location}</td>
		// 	<td class="actions">
		// 		<a href="#editEmployeeModal" class="editButton" data-toggle="modal"><i class="material-icons" id='editButton${searchDatabaseInfo[n].id}' data-toggle="tooltip" title="Edit">&#xE254;</i></a>
		// 		<a href="#deleteEmployeeModal" class="deleteButton" data-toggle="modal"><i class="material-icons" id='deleteButton${searchDatabaseInfo[n].id}' data-toggle="tooltip" title="Delete">&#xE872;</i></a>
		// 	</td>
		// 	</tr>
		// 	`);
		// 	}
	
		// 	// running a function for the employee delete button & modal with deleteButton class: 
	
		// 	deleteButtons = document.querySelectorAll('.deleteButton');
	
		// 	deleteButtons.forEach(deleteButton => {
		// 	deleteButton.addEventListener('click', event => {
		// 	deleteEntry(event.target.id);
		// 	})})
	
		// 	// function for the edit button & modal with the editButton class: 
	
		// 	editButtons = document.querySelectorAll('.editButton');
	
		// 	editButtons.forEach(editButton => {
		// 	editButton.addEventListener('click', event => {
		// 	editEntry(event.target.id);
		// 	})})
		
		// $('#searchEmployeeModal').modal('hide');
		// $('#searchEmployeeFirstName').val('')
		// $('#searchEmployeeLastName').val('')
		// $('#searchEmployeeEmail').val('')
		// $('#searchEmployeeDepartment').val('')
		// $('#searchEmployeeLocation').val('')
		})})

//search department

		$(function (){
			$('#searchDepartmentSubmit').click(
				
				function() {
				let searchDepartmentDatabaseInfo = [];
				{

				for (s=0; s<departmentDatabaseInfo.length; s++)
				{
					let num = 0;
					for (x=0; x < databaseInfo.length; x++)
					{if (databaseInfo[x].departmentID == departmentDatabaseInfo[s]['id']){
					num ++;}}
					
					if ($('#searchDepEmployees').val() == num && departmentDatabaseInfo[s]['name'].includes($('#searchDepDepartment').val()) && departmentDatabaseInfo[s]['locationID'].includes($('#searchDepLocation').val()))
					{searchDepartmentDatabaseInfo.push(departmentDatabaseInfo[s])}

					else if ($('#searchDepEmployees').val() == num && departmentDatabaseInfo[s]['name'].includes($('#searchDepDepartment').val()) )
					{searchDepartmentDatabaseInfo.push(departmentDatabaseInfo[s])}

					else if (!$('#searchDepEmployees').val() &&
						departmentDatabaseInfo[s]['name'].includes($('#searchDepDepartment').val()) && departmentDatabaseInfo[s]['locationID'].includes($('#searchDepLocation').val()))
					{searchDepartmentDatabaseInfo.push(departmentDatabaseInfo[s])}

					else if ($('#searchDepEmployees').val() == num && departmentDatabaseInfo[s]['locationID'].includes($('#searchDepLocation').val()))
					{searchDepartmentDatabaseInfo.push(departmentDatabaseInfo[s])}

					else if (!$('#searchDepEmployees').val() && departmentDatabaseInfo[s]['name'].includes($('#searchDepDepartment').val()) )
					{searchDepartmentDatabaseInfo.push(departmentDatabaseInfo[s])}

					else if (!$('#searchDepEmployees').val() && departmentDatabaseInfo[s]['locationID'].includes($('#searchDepLocation').val()) )
					{searchDepartmentDatabaseInfo.push(departmentDatabaseInfo[s])}

					else if ($('#searchDepEmployees').val() == num)
					{searchDepartmentDatabaseInfo.push(departmentDatabaseInfo[s])}
				}
				
				console.log(searchDepartmentDatabaseInfo)

				$('#tableDatab').empty();
				for (let n = 0; n < searchDepartmentDatabaseInfo.length; n ++){

					function searchDepEmployee (n){
					for (const obj of departmentEmployees) {
  					if (searchDepartmentDatabaseInfo[n].id in obj) {
   					return obj[searchDepartmentDatabaseInfo[n].id];}}}

					   let loca = locationDatabaseInfo.find(location => location.id === searchDepartmentDatabaseInfo[n].locationID);

					$('#tableDatab').append(`
					<tr>
					<td class="departmentb" id="departmentb${n}"value="${searchDepartmentDatabaseInfo[n].id}">${searchDepartmentDatabaseInfo[n].name}</td>
					<td class="employeesb">${
						searchDepEmployee (n)
					}</td>
					<td class="locationb" id="locationb${n}"
					"value="${loca.id}">${loca.name}
					</td>
					<td class="actions">
						<a href="#editDepartmentModal" class="editButtonb" data-toggle="modal"><i class="material-icons" id='editButtonb${searchDepartmentDatabaseInfo[n].id}' data-toggle="tooltip" title="Edit">&#xE254;</i></a>
						<a href="#deleteDepartmentModal" class="deleteButtonb" data-toggle="modal"><i class="material-icons" id='deleteButtonb${searchDepartmentDatabaseInfo[n].id}' data-toggle="tooltip" title="Delete">&#xE872;</i></a>
					</td>
					</tr>
					`);
					
					}
			
					// running a function for the department delete button & modal with deleteButtonb class: 

		deleteButtons = document.querySelectorAll('.deleteButtonb');

		deleteButtons.forEach(deleteButtonb => {
		deleteButtonb.addEventListener('click', event => {

		let depID = event.target.id	
		
		depID = depID.replace(/[^0-9]/g, '');
		
		deleteDepartmentEntry(depID);
		})})

		// function for the edit button & modal with the editButtonb class: 

		editButtons = document.querySelectorAll('.editButtonb');

		editButtons.forEach(editButtonb => {
		editButtonb.addEventListener('click', event => {
			let depID = event.target.id	
			depID = depID.replace(/[^0-9]/g, '');
			
			editDepartmentEntry(depID);
		})})
				}
				$('#searchDepartmentModal').modal('hide');
				$('#searchDepDepartment').val('')
				$('#searchDepLocation').val('')
				$('#searchDepEmployees').val('')
				})})

//search location

$(function (){
	$('#searchLocationSubmit').click(
		
		function() {
		let searchLocationDatabaseInfo = [];
		{

		for (s=0; s<locationDatabaseInfo.length; s++)
		{
			let num = 0;
			for (x=0; x < departmentDatabaseInfo.length; x++)
			{if (departmentDatabaseInfo[x].locationID == locationDatabaseInfo[s]['id']){
			num ++;}}
			
			if ($('#searchLocDepartments').val() == num && locationDatabaseInfo[s]['id'].includes($('#searchLocLocation').val()))
			{searchLocationDatabaseInfo.push(locationDatabaseInfo[s])}

			else if (!$('#searchLocDepartments').val() && locationDatabaseInfo[s]['id'].includes($('#searchLocLocation').val()))
			{searchLocationDatabaseInfo.push(locationDatabaseInfo[s])}

			else if ($('#searchLocDepartments').val() == num && !$('#searchLocLocation').val())
			{searchLocationDatabaseInfo.push(locationDatabaseInfo[s])}
		}
		
		console.log(searchLocationDatabaseInfo);

		$('#tableDatac').empty();

		function countLocDepartment (n){
			let num =0;
				for (x=0;x<departmentDatabaseInfo.length;x++){
			if (searchLocationDatabaseInfo[n].id == departmentDatabaseInfo[x].locationID){
				num ++;}
			}return num;}

		for (let n = 0; n < searchLocationDatabaseInfo.length; n ++){

			$('#tableDatac').append(`
			<tr>
			<td class="locationc" id="departmentb${n}"value="${searchLocationDatabaseInfo[n].id}">${searchLocationDatabaseInfo[n].name}</td>
			<td class="departmentsc">${
				countLocDepartment (n)
			}</td>
			<td class="actions">
				<a href="#editLocationModal" class="editButtonb" data-toggle="modal"><i class="material-icons" id='editButtonb${searchLocationDatabaseInfo[n].id}' data-toggle="tooltip" title="Edit">&#xE254;</i></a>
				<a href="#deleteLocationModal" class="deleteButtonb" data-toggle="modal"><i class="material-icons" id='deleteButtonb${searchLocationDatabaseInfo[n].id}' data-toggle="tooltip" title="Delete">&#xE872;</i></a>
			</td>
			</tr>
			`);
			
			}
	
			// running a function for the department delete button & modal with deleteButtonb class: 

deleteButtons = document.querySelectorAll('.deleteButtonb');

deleteButtons.forEach(deleteButtonb => {
deleteButtonb.addEventListener('click', event => {

let depID = event.target.id	

depID = depID.replace(/[^0-9]/g, '');

deleteLocation(depID);
})})

// function for the edit button & modal with the editButtonb class: 

editButtons = document.querySelectorAll('.editButtonb');

editButtons.forEach(editButtonb => {
editButtonb.addEventListener('click', event => {
	let depID = event.target.id	
	depID = depID.replace(/[^0-9]/g, '');
	
	editLocationEntry(depID);
})})
		}
		$('#searchLocationModal').modal('hide');
		$('#searchLocLocation').val('')
		$('#searchLocDepartments').val('')
		})})

$(function () {
	$('#addFormDepartmentID').hide()
	$('#editFormDepartmentID').hide()
	$('#addDepLocationID').hide()
	$('#editDepartmentLocationID').hide()
})