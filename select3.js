document.getElementById("selectc3").onchange = function() {
    var selectC3 = document.getElementById("selectc3");
    var selectC2 = document.getElementById("selectc2");
    var selectSgr = document.getElementById("selectsgr_code");

    var mapstr2 = selectC3.options[selectC3.selectedIndex].value;
    var subgroupmapstr2 = selectC2.options[selectC2.selectedIndex].value;

    if (mapstr2 !== "" && subgroupmapstr2 !== "None") {
        var xhr = new ActiveXObject("Microsoft.XMLHTTP"); // Use ActiveXObject for IE5 AJAX

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
                var response = eval("(" + xhr.responseText + ")"); // IE5 does not support JSON.parse

                while (selectC2.options.length > 0) { // Clear previous options
                    selectC2.remove(0);
                }

                var defaultOption = document.createElement("option");
                defaultOption.value = "";
                selectC2.appendChild(defaultOption);

                for (var i = 0; i < response.usergroupsdata.length; i++) {
                    var usr = response.usergroupsdata[i];
                    var newOption = document.createElement("option");
                    newOption.setAttribute("data-username", usr.USERNAME);
                    newOption.value = usr.USERNAME;
                    newOption.text = usr.NAME;
                    selectC2.appendChild(newOption);
                }
            }
        };

        xhr.send(postData);
    }
};