
export function setting(token,field){
    try{
        const settings=null;
        fetch('http://localhost:8000/api/settings', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer '+token,
                'Content-Type' :'multipart/form-data',
            }
            }).then((response) => response.json())
            .then((json) => settings=json.data)
            .catch((error) => console.error(error));
        if(settings.field){
            return settings.field;
        }else{
            return false;
        }
    }catch(e){
        console.log(e);
    }
}

export function makeid(length=16,type=null){
    if(type=="numb"){
            var result = '';
            var characters ='0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
    }
    else{
        var result = '';
        var characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

}

export function hideNumb(e) {
    var numb = e;
    //use slice to remove first 12 elements
    let first12 = numb.slice(4, 12);
    //define what char to use to replace numbers
    let char = '*'
    let repeatedChar = ""
    if (numb.length == 16 || numb.length == 12 || numb.length > 12) {
        repeatedChar = char.repeat(numb.length - 14);
    } else {
        repeatedChar = char.repeat(numb.length - 8);
    }
    // replace numbers with repeated char
    first12 = first12.replace(first12, repeatedChar);
    //concat hidden char with last 4 digits of input
    let hiddenNumbers = numb.slice(0, 4) + first12 + numb.slice(numb.length - 4);
    //return
    return hiddenNumbers;
}