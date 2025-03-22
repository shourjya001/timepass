xhr.open("POST", "dbe_cfl_user_accessTransferSave.php", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send(searchParam);

xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      var resultData = JSON.parse(xhr.responseText);
      if (resultData) {
        if (check === 0) populateSearchOptions(stype, resultData);
        
        if (stype === 'sgr') {
          commonsearch('fetchLEBasedonSGR', resultData[0]['id'], searchParam, 'le', 0);
        } else if (stype === 'le') {
          if (document.getElementById("selectsgr_code").value !== '' && 
              document.getElementById("selectle_code").value !== '') {
            checkForCreditFiles(document.getElementById("selectsgr_code").value,
                               document.getElementById("selectle_code").value);
          } else if (document.getElementById("txtsgr_code").value !== '') {
            commonsearch('fetchLegalEntityBasedonID',
                        document.getElementById("txtsgr_code").value, searchParam, 'le', 0);
          } else {
            if (check === 0) {
              populateSearchOptions('sgr', resultData);
            }
          }
        }
      }
      // document.getElementById("loading_wrap").style.display = 'none';
    }
  }
};
