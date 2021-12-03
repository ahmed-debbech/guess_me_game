function getpass(text){
    let rfc = "passa";
    document.getElementById("msg").innerHTML="...";
    setTimeout(() => {
        if(text == rfc){
            document.getElementById("msg").innerHTML="sa7it ya rojla <3 !!!";
        }else{
            var stt = "";
            for(var t =0; t<=rfc.length-1; t++){
                if(rfc[t] == text[t]){
                    stt += rfc[t];
                }else{
                    stt += "*";
                }
            }
        document.getElementById("stars").innerHTML=stt;
        document.getElementById("msg").innerHTML="ASDA!!!";
        }
    },1000);

}
function load(){
    let rfc = "passa";
    var st = "";
    for(var i =0; i<=rfc.length-1; i++){
        st += '*';
    }
    document.getElementById("stars").innerHTML=st;
}