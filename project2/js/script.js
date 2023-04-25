
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

$(function getTableData(){
  
	$.ajax({
	  url: 'php/getAll.php',
	  type: 'GET',
	  dataType: "json",
	  
	  success: function(result) {
	  
	  console.log(result);
		console.log(result.data);
		let data = result.data;
	  
	  console.log ('array length '+ data.length);
	  for (let n = 0; n < data.length; n ++){
		$('#tableData').append(`
		<tr>
		<td class="name">${data[n].firstName + ' ' + data[n].lastName}</td>
		<td class="email">${data[n].email}</td>
		<td class="department">${data[n].department}</td>
		<td class="location">${data[n].location}</td>
		<td class="actions">
			<a href="#editEmployeeModal" class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
			<a href="#deleteEmployeeModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
		</td>
		</tr>
		`);
		}
	  },
   
	  error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR);
	  }
	}); 
  });  

//dropdown options in the add new employee modal:

$(document).ready(()=>{
	$('#addFormDepartment').change( () => {
		var val = $('#addFormDepartment').val();
		if (val == 'Accounting') {
			$('#addFormLocation').val('Rome');
		}
		else if (val == 'Business Development') {
			$('#addFormLocation').val('Paris');
		}
		else if (val == 'Engineering') {
			$('#addFormLocation').val('Rome');
		}
		else if (val == 'Human Resources') {
			$('#addFormLocation').val('London');
		}
		else if (val == 'Legal') {
			$('#addFormLocation').val('London');
		}
		else if (val == 'Marketing') {
			$('#addFormLocation').val('New York');
		}
		else if (val == 'Product Management') {
			$('#addFormLocation').val('Paris');
		}
		else if (val == 'Research and Development') {
			$('#addFormLocation').val('Paris');
		}
		else if (val == 'Sales') {
			$('#addFormLocation').val('New York');
		}
		else if (val == 'Services') {
			$('#addFormLocation').val('London');
		}
		else if (val == 'Support') {
			$('#addFormLocation').val('Munich');
		}
		else if (val == 'Training') {
			$('#addFormLocation').val('Munich');
		}
	}
	)
})

//on submitting a completed form in the add employee modal: 

	$('#addFormSubmit').submit(
		()=>{
				console.log('submit working');
			// $.ajax({
			// 	url: "php/insertEmployee.php",
			// 	type: 'POST',
			// 	dataType: 'json',
			// 	data: {
			// 		firstName: $('#addFormFirstName').val,
			// 		surname: $('#addFormSurname').val,
			// 		email: $('#addFormEmail').val,
			// 		department: $('#addFormDepartment').val,
			// 		location: $('#addFormLocation').val
			// 	},
			// 	success: function(result) {
			
			// 	  console.log(JSON.stringify(result));
				  
			// 	if (result.status.name == "ok") {
				  
					
			//   }},
			// 	error: function(jqXHR, textStatus, errorThrown) {
			// 	  console.log(jqXHR);
			// 	}
			//   })
		})
