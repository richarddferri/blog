

 $(document).on('page:load',function(){
 	console.log("country_state_form.js");
	 	// if($('#state') && $('#country'))
	 	// {
	 		console.log("state and country found.");
			$('#state').bfhstates({country:'US', state: 'NY' , blank: false});	
	   		$('#country').bfhcountries({country:'US', state:'NY', blank:false});
	    
	 	// }	
	 	// else
	 	// {
	 	// 	console.log("state and country NOT found.");
	 	// } 
    

    });
    