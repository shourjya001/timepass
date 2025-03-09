function commonsearch(searchType, searchString, searchParam, stype, check) {
    // Show loading
    document.getElementById("loading_wrap").style.display = 'block';
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "dbe_cfl_user_accessTransfersave.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var resultData = JSON.parse(xhr.responseText);
                
                if (resultData) {
                    if (check == 0) {
                        populateSearchOptions(stype, resultData);
                    }
                    
                    if (stype == 'sgr') {
                        commonsearch('fetchLEBasedonSGR', resultData[0]['id'], searchParam, 'le', 0);
                    } 
                    else if (stype == 'le') {
                        if (document.getElementById("selectsgr_code").value != '' && 
                            document.getElementById("selectle_code").value != '') {
                            
                            // Call the modified checkForCreditFiles function with both CF and LE types
                            // First check for credit files (CF)
                            checkForCreditFiles(
                                document.getElementById("selectsgr_code").value, 
                                document.getElementById("selectle_code").value, 
                                'CF'
                            );
                            
                            // Then check for LE details
                            // Add appropriate codstatus parameter - using default 25
                            checkForCreditFiles(
                                document.getElementById("selectsgr_code").value, 
                                document.getElementById("selectle_code").value, 
                                'LE',
                                '25'
                            );
                        } 
                        else if (document.getElementById("txtsgr_code").value != '') {
                            commonsearch(
                                'fetchLegalEntityBasedonID', 
                                document.getElementById("txtsgr_code").value, 
                                searchParam, 
                                'le', 
                                0
                            );
                        }
                    } 
                    else {
                        if (check == 0) {
                            populateSearchOptions('sgr', resultData);
                        }
                    }
                } 
                else {
                    if (check == 0) {
                        populateSearchOptions(stype, resultData);
                    } 
                    else if (stype == 'le') {
                        commonsearch('fetchLEBasedonLE', resultData[0]['id'], searchParam, 'SGR', 0);
                    }
                    
                    if (stype == 'le') {
                        if (check == 1) {
                            document.getElementById("codria_span").innerHTML = '';
                            alert("No references are available for this LE.");
                        } 
                        else {
                            emptydropdown(stype);
                        }
                    } 
                    else if (stype == 'sgr') {
                        var rtype = 'le';
                        emptydropdown(stype);
                        emptydropdown(rtype);
                    }
                }
            } 
            else {
                alert("AJAX request failed with status: " + xhr.status);
            }
            
            // Hide loading
            document.getElementById("loading_wrap").style.display = 'none';
        }
    };
    
    xhr.send("searchType=" + encodeURIComponent(searchType) + 
             "&searchString=" + encodeURIComponent(searchString));
}
