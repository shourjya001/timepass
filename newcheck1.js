// Alternative - modify the existing checkForCreditFiles to handle LE details
function checkForCreditFiles(codspm, codle, type, codstatus) {
    if (codspm === undefined) codspm = '';
    if (codle === undefined) codle = '';
    if (type === undefined) type = 'CF'; // Default type is CF, new option is 'LE'
    if (codstatus === undefined) codstatus = '25';
    
    // Create XHR object for old IE
    var xhr;
    try {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    } catch(e) {
        try {
            xhr = new ActiveXObject("Msxml2.XMLHTTP");
        } catch(e) {
            try {
                xhr = new XMLHttpRequest();
            } catch(e) {
                alert('Cannot create an XMLHTTP instance');
                return false;
            }
        }
    }
    
    // Select appropriate endpoint based on type
    var endpoint = (type === 'LE') ? 'dbe_le_user_access.php' : 'dbe_cf_user_accessTransfersave.php';
    
    xhr.open('POST', endpoint, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    var response = JSON.parse(xhr.responseText);
                    
                    // Determine which class/span to use based on type
                    var elementClass = (type === 'LE') ? 'namespm_class' : 'codria_class';
                    var spanId = (type === 'LE') ? 'namespm_span' : 'codria_span';
                    var radioName = (type === 'LE') ? 'namespm' : 'codria';
                    var valueField = (type === 'LE') ? 'CODSPM' : 'codria';
                    var labelField = (type === 'LE') ? 'NAMESPM' : 'codria';
                    var noDataMsg = (type === 'LE') ? 'No LE details available!' : 'No credit files available..!';
                    
                    // Handle 'None' response
                    if (response.id === 'None') {
                        // Hide elements with appropriate class
                        var elements = document.getElementsByTagName("*");
                        for (var i=0; i < elements.length; i++) {
                            if (elements[i].className === elementClass) {
                                elements[i].style.display = 'none';
                            }
                        }
                        alert(noDataMsg);
                        return;
                    }
                    
                    // Get the container span
                    var containerSpan = document.getElementById(spanId);
                    // Clear existing content using older method
                    while (containerSpan.firstChild) {
                        containerSpan.removeChild(containerSpan.firstChild);
                    }
                    
                    // Create radio buttons using old IE compatible methods
                    var radioHtml = '';
                    for (var i=0; i < response.length; i++) {
                        var item = response[i];
                        radioHtml += '<input type="radio" id="' + radioName + '" name="' + radioName + '" style="display:inline;padding-right:5px;width:20%"' +
                            'id="' + radioName + '_' + item[valueField] + '"' +
                            'value="' + item[valueField] + '">' +
                            '<label for="' + radioName + '_' + item[valueField] + '">' +
                            item[labelField] + '</label>';
                    }
                    
                    // Insert the HTML using IE5 compatible method
                    containerSpan.insertAdjacentHTML ? 
                        containerSpan.insertAdjacentHTML('beforeEnd', radioHtml) : 
                        containerSpan.innerHTML = radioHtml;
                    
                    // Show elements with appropriate class
                    var elements = document.getElementsByTagName("*");
                    for (var i=0; i < elements.length; i++) {
                        if (elements[i].className === elementClass) {
                            elements[i].style.display = 'block';
                        }
                    }
                } catch(e) {
                    alert('Error processing response: ' + e.message);
                }
            } else {
                alert("An error occurred: " + (xhr.statusText || 'Unknown error'));
            }
        }
    };
    
    var searchType = (type === 'LE') ? 'fetchLE' : '';
    var data = 'searchType=' + searchType + 
               '&codspm=' + encodeURIComponent(codspm) + 
               '&codle=' + encodeURIComponent(codle);
               
    // Add codstatus parameter for LE type
    if (type === 'LE') {
        data += '&codstatus=' + encodeURIComponent(codstatus);
    }
    
    xhr.send(data);
}
