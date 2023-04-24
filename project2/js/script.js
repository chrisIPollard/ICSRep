
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