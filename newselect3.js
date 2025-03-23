document.getElementById("selectc3").onchange = function() {
    var selectC3 = document.getElementById("selectc3");
    var selectC2 = document.getElementById("selectc2");
    var selectSgr = document.getElementById("selectsgr_code");

    var mapstr2 = selectC3.options[selectC3.selectedIndex].value;
    var subgroupmapstr2 = selectC2.options.length > 0 ? selectC2.options[selectC2.selectedIndex].value : "";

    if (mapstr2 !== "" && subgroupmapstr2 !== "None") {
        var xhr = new ActiveXObject("Microsoft.XMLHTTP");

        xhr.open("POST", "dbe_cfl_user_accessTransferSave.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        var codria = "";
        var codriaElements = document.getElementsByName("codria");
        for (var i = 0; i < codriaElements.length; i++) {
            if (codriaElements[i].checked) {
                codria = codriaElements[i].value;
                break;
            }
        }

        var postData = "searchType=fetchUsersdetails"
            + "&usergroup=" + encodeURIComponent(mapstr2)
            + "&name=" + encodeURIComponent(subgroupmapstr2)
            + "&codria=" + encodeURIComponent(codria)
            + "&sub_group_code=" + encodeURIComponent(selectSgr.options[selectSgr.selectedIndex].value);

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = eval("(" + xhr.responseText + ")");

                while (selectC2.options.length > 0) {
                    selectC2.remove(0);
                }

                if (response.usergroupsdata.length > 0) { 
                    for (var i = 0; i < response.usergroupsdata.length; i++) {
                        var usr = response.usergroupsdata[i];
                        var newOption = document.createElement("option");
                        newOption.setAttribute("data-username", usr.USERNAME);
                        newOption.value = usr.USERNAME;
                        newOption.text = usr.NAME;
                        selectC2.appendChild(newOption);
                    }
                } else {
                    // If no data is received, add a default message instead of a blank option
                    var noDataOption = document.createElement("option");
                    noDataOption.value = "";
                    noDataOption.text = "No options available";
                    selectC2.appendChild(noDataOption);
                }
            }
        };

        xhr.send(postData);
    }
};