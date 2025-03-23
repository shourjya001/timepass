function populateSearchOptions(stype, resultData) {
    alert("1");

    var codriaCode = document.getElementById("codria_code");
    if (codriaCode) {
        codriaCode.value = "";
    }

    alert("2");

    var selectCode = document.createElement("SELECT");
    alert("3");

    selectCode.id = "select" + stype + "_code";
    alert("4");

    selectCode.onchange = function () {
        selectdropdown(stype, 'code');
    };

    alert("5");

    var selectName = document.createElement("SELECT");
    alert("6");

    selectName.id = "select" + stype + "_name";
    alert("7");

    selectName.onchange = function () {
        selectdropdown(stype, 'name');
    };

    alert("8");

    // Replace existing elements
    var txtCode = document.getElementById("txt" + stype + "_code");
    var txtName = document.getElementById("txt" + stype + "_name");

    alert("9");

    if (txtCode && txtName) {
        alert("10");
        var sgrReset = document.all; // IE5 uses `document.all` instead of `document.querySelectorAll`
        
        txtCode.parentElement.replaceChild(selectCode, txtCode);
        alert("11");
        txtName.parentElement.replaceChild(selectName, txtName);
        alert("12");

        for (var i = 0; i < sgrReset.length; i++) {
            if (sgrReset[i].className === "sgr_reset") {
                sgrReset[i].style.display = "block";
            }
        }
    }

    // Populate options
    for (var index = 0; index < resultData.length; index++) {
        var item = resultData[index];

        var optionCode = document.createElement("OPTION");
        var optionName = document.createElement("OPTION");

        optionCode.value = item.id;
        optionCode.innerText = item.id;
        
        optionName.value = item.id;
        optionName.innerText = item.name || item.id;

        selectCode.options.add(optionCode);
        alert(optionCode.value);
        selectName.options.add(optionName);
    }

    // Handle element placement based on stype
    var appendtotype = (stype === 'sgr') ? 'subgroupname_id' : 'legroupname_id';
    var appendtotype2 = (stype === 'sgr') ? 'subgroupname_code' : 'legroupname_code';

    var appendToElement = document.getElementById(appendtotype);
    var appendToElement2 = document.getElementById(appendtotype2);

    if (appendToElement) {
        alert("Appending selectName");
        appendToElement.innerHTML = ""; // Clear existing content

        var fragment = document.createDocumentFragment();
        fragment.appendChild(selectName);
        appendToElement.appendChild(fragment);
    }

    if (appendToElement2) {
        alert("Appending selectCode");
        appendToElement2.innerHTML = ""; // Clear existing content

        var fragment2 = document.createDocumentFragment();
        fragment2.appendChild(selectCode);
        appendToElement2.appendChild(fragment2);
    }
}