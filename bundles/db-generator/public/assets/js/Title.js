class Title {
    getInfo(){
        let fields  =   this.getFields();
        let values  =   this.getValues();
        let info    =   {};

        for (let i = 0; i < fields.length; i++){
            info[fields[i]] =   values[i];
        }

        return info;
    }

    getFields(){
        let labels  =   document.querySelectorAll('[class*=label] .txt');
        let len     =   Object.keys(labels).length;
        let fields  =   [];

        for (let i = 0; i < len; i++){
            fields[i] = labels[i].innerText;
        }

        return fields;
    }

    getValues(){
        let texts   =   document.querySelectorAll('[class*=label] +[class*=data]');
        let len     =   Object.keys(texts).length;
        let values  =   [];

        for (let i = 0; i < len; i++){
            values[i] = texts[i].innerText;
        }

        return values;
    }
}