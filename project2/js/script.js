
//global variables:
let databaseInfo;
let departmentdatabaseInfo;

let editButtons;
let editEmail;
let editDepartment;
let editLocation;

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

	$.ajax({
	  url: 'php/getAll.php',
	  type: 'GET',
	  dataType: "json",
	  
	  success: function(result) {
	  
		console.log(result.data);
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

		// running a function for the delete button & modal with deleteButton class: 

		deleteButtons = document.querySelectorAll('.deleteButton');

		deleteButtons.forEach(deleteButton => {
		deleteButton.addEventListener('click', event => {
		deleteEntry(event.target.id);

		})})

		// function for the edit button & modal with the editButton class: 

		editButtons = document.querySelectorAll('.editButton');

		editButtons.forEach(editButton => {
		editButton.addEventListener('click', event => {
		console.log(event.target.id);

			// 	const row = event.target.parentNode.parentNode.nextElementSibling;
		// editEmail = row.querySelector('.email').textContent;
		// editDepartment = row.querySelector('.department').textContent;
		// editLocation = row.querySelector('.location').textContent;
		// console.log(editEmail, editDepartment, editLocation); 

	});}
	
	
	);

	  },
   
	  error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR);
	  }
	}); 

	//getting department info to populate the automatic drop down options:

	$.ajax({
		url: "php/getAllDepartments.php",
		type: 'GET',
		dataType: 'json',
	
		success: function(result) {
	
		console.log(JSON.stringify(result));
		  
		if (result.status.name == "ok") {

			departmentDatabaseInfo = result.data;
			result.data.forEach(item => {
			  departments[item.id] = item.name;
			});

			$('#addFormDepartmentID').empty();
			$('#addFormDepartmentID').html(`<option value="" disabled selected>Choose Department</option>`);

			console.log(departments);
			for (const key in departments) {
				$('#addFormDepartmentID').append(`<option value="${key}">${key}</option>`);
			  }		

			  $('#addFormDepartment').empty();
			  $('#addFormDepartment').html(`<option value="" disabled selected>Select</option>`);
  
			  console.log(departments);
			  for (const key in departments) {
				  $('#addFormDepartment').append(`<option value="${departments[key]}">${departments[key]}</option>`);
				}		

			console.log(departments);
			

	  }},
		error: function(jqXHR, textStatus, errorThrown) {
		  console.log(jqXHR);
		}
	  })

	  //getting location info to populate the automatic drop down options:

	$.ajax({
		url: "php/getAllLocations.php",
		type: 'GET',
		dataType: 'json',
	
		success: function(result) {
	
		//console.log(JSON.stringify(result));
		  
		if (result.status.name == "ok") {

			result.data.forEach(item => {
			  locations[item.id] = item.name;
			});

			  $('#addFormLocation').empty();
			  $('#addFormLocation').html(`<option value="" disabled selected>Select</option>`);
  
			  for (const key in locations) {
				  $('#addFormLocation').append(`<option value="${locations[key]}">${locations[key]}</option>`);
				}		

			console.log(locations);
			

	  }},
		error: function(jqXHR, textStatus, errorThrown) {
		  console.log(jqXHR);
		}
	  })

  }

// 2) running the function on startup:
$(getTableData()); 

// making a function for the delete button & modal with deleteButton class: 

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
	
//managing the form auto selections: 

	$('#addFormDepartment').change( () => {
		
		for (let key in departments) {
		  if (departments[key] == $('#addFormDepartment').val()) {
			$('#addFormDepartmentID').val(key);
		  }}

		  console.log($('#addFormDepartmentID').val())

		  console.log(departmentDatabaseInfo.length);

		  for (x=0; x<departmentDatabaseInfo.length; x++){
			console.log(departmentDatabaseInfo[x].id);
			console.log(departmentDatabaseInfo[x].locationID);
			if (departmentDatabaseInfo[x].id == $('#addFormDepartmentID').val()){
				$('#addFormLocation').val(locations[departmentDatabaseInfo[x].locationID]);}
			
				
			
		  }
		
	 
			
})

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




  
  
  
  
  
  
  
