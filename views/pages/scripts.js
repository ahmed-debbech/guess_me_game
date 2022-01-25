function checkChangeCheckbox(){
    alert("serg");
    var ch = document.getElementById("hide");
    ch.addEventListener('change' , () => {
        alert(this.checked);
    })
}
checkChangeCheckbox();