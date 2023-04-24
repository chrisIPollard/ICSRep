
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
		<td>
			<span class="custom-checkbox">
				<input type="checkbox" id="checkbox${n}" name="options[]" value="1">
					<label for="checkbox${n}"></label>
			</span>
		</td>
		<td>${data[n].firstName + ' ' + data[n].lastName}</td>
		<td>${data[n].email}</td>
		<td>${data[n].department}</td>
		<td>${data[n].location}</td>
		<td>
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