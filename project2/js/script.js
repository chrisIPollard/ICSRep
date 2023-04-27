
//global variables:
let databaseInfo;

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
	  
	  console.log(result);
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
  }

// 2) running the function on startup:
$(getTableData()); 

// making a function for the delete button & modal with deleteButton class: 

function deleteEntry(id){
	place = id.replace(/[^0-9]/g, '');

	$("#finalDelete").click(function() {
			
	$.ajax({
		url: "php/deleteEmployee.php",
		type: 'POST',
		dataType: 'json',
		data: {
			email: databaseInfo[place].email
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
	$('#addFormDepartment').change( () => {
		var val = $('#addFormDepartment').val();
		if (val == 'Accounting') {
			$('#addFormLocation').val('Rome');
			$('#addFormDepartmentID').val('5');
		}
		else if (val == 'Business Development') {
			$('#addFormLocation').val('Paris');
			$('#addFormDepartmentID').val('3');
		}
		else if (val == 'Engineering') {
			$('#addFormLocation').val('Rome');
			$('#addFormDepartmentID').val('5');
		}
		else if (val == 'Human Resources') {
			$('#addFormLocation').val('London');
			$('#addFormDepartmentID').val('1');
		}
		else if (val == 'Legal') {
			$('#addFormLocation').val('London');
			$('#addFormDepartmentID').val('1');
		}
		else if (val == 'Marketing') {
			$('#addFormLocation').val('New York');
			$('#addFormDepartmentID').val('2');
		}
		else if (val == 'Product Management') {
			$('#addFormLocation').val('Paris');
			$('#addFormDepartmentID').val('3');
		}
		else if (val == 'Research and Development') {
			$('#addFormLocation').val('Paris');
			$('#addFormDepartmentID').val('3');
		}
		else if (val == 'Sales') {
			$('#addFormLocation').val('New York');
			$('#addFormDepartmentID').val('2');
		}
		else if (val == 'Services') {
			$('#addFormLocation').val('London');
			$('#addFormDepartmentID').val('1');
		}
		else if (val == 'Support') {
			$('#addFormLocation').val('Munich');
			$('#addFormDepartmentID').val('4');
		}
		else if (val == 'Training') {
			$('#addFormLocation').val('Munich');
			$('#addFormDepartmentID').val('4');
		}
	}
	)
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




  
  
  
  
  
  
  
