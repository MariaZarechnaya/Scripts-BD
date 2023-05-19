const { remove } = require('electron-json-storage');
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname,'data.json');
const data = fs.readFileSync(file);
// const data = fs.readFileSync('data.json');
const myObject= JSON.parse(data);
// console.log(myObject)




const inputAddName = document.querySelector('.header__form-input-name');
const inputAddScript = document.querySelector('.header__form-input-descript');
const addButton = document.querySelector('.header__form-button');
const list = document.querySelector('.content__list-list');
const addFormBlock = document.querySelector('.header__form__add-block');

const createNewLi = (title, body) =>{
    let newLi = document.createElement('li')
    newLi.classList.add('content__list-li')
    newLi.innerHTML = `<h3  class="content__list-li-title">${title}</h3>
    <span  class="content__list-li-script">${body}</span> 
    <button class="content__delete-btn" type="button" name = "delete"></button>
    <button class="content__edit-btn" type="button" name = "edit"></button>
    `
    list.append(newLi)

}

const renderItems = (arrayData) =>{
    for (let i = 0; i < arrayData.length; i++){
    createNewLi (arrayData[i].name, arrayData[i].script.replace(/\n/g, '<br>'))
    }
}
document.addEventListener('DOMContentLoaded', renderItems (myObject))


//добавление нового пункта

let nameItem = '';
// let nameItem;
let scriptItem;

// очистка поля ввода 
const clearBtn = document.querySelector('.header__form-button-clear')
clearBtn.addEventListener('click',() =>{
    inputAddName.value = '';
    inputAddScript.value = '';
    nameItem = '';
    scriptItem = null;
})


// заполните поле 
let warning = document.createElement('div');
let fillInputs = (str) =>{              
    warning.classList.add('text-warning');
    warning.innerHTML = ` <p>${str}</p>`
    addFormBlock.after(warning)
    setTimeout(delFillInputs, 2000)
}
let delFillInputs = () =>{
    warning.remove()
}

// значения поля ввода
inputAddName.addEventListener('change' ,() =>{
    nameItem = inputAddName.value.trim();
    // console.log(nameItem)
    return nameItem
})

inputAddScript.addEventListener('change' ,() =>{
    scriptItem = inputAddScript.value.trim();
    // console.log(scriptItem)
    return scriptItem
})


// новый пункт
let createNewItem = (arg1, arg2) => {          
if (nameItem && scriptItem ||scriptItem ){
    let collection = {
        "name": nameItem,
        "script":scriptItem,
        };
    myObject.push(collection)
    createNewLi (arg1, arg2) 
    const newItem = JSON.stringify(myObject, null, " ");
    fs.writeFile('data.json', newItem, err => {
    // error checking
    if(err) throw err;
    console.log("New data added");
        });
    } 
// else if (!nameItem || !scriptItem){
//     fillInputs('Элемент пуст')
//         }
        
 }
 
// такой элемент существует

const match = (name, script) =>{
let s = myObject.find((el) =>{
    if(el.script == script ){
        return true
    } 
})
console.log(s)
console.log(myObject)
return s;
}
// событие клика по кнопке добавления
addButton.addEventListener('click', () =>{              
    console.log(myObject)
    if(match(nameItem, scriptItem)){
        fillInputs('Такой скрипт уже существует')
        return;
    } else if(!scriptItem){
        fillInputs('Элемент пуст')
        return
    }
     else{
        createNewItem (nameItem, scriptItem.replace(/\n/g, '<br>'))
       
    }
    // createNewItem (nameItem, scriptItem)
    
})

// удаление
const container = document.querySelector('.content');
container.addEventListener('click', (event) =>{
    if (!event.target.matches('.content__delete-btn')){
        return
        }
    let item = event.target
    item.parentElement.remove() 

    let body = item.previousElementSibling.textContent
    let title = item.parentElement.firstElementChild.textContent
    
    
    myObject.forEach((elem, i) =>{
        console.log(body)
        console.log(elem.script)
    if (title === elem.name && body == elem.script.replace(/\n/g, '')){
        console.log('match')
        myObject.splice(i,1) 
        }
        })
        console.log(myObject)
            const delItem = JSON.stringify(myObject, null, " ");
                // console.log(delItem)
            fs.writeFile('data.json', delItem, err => {
            // error checking
            if(err) throw err;
            console.log(delItem);
            });

})

// поиск по названию
const searchInput = document.querySelector('.header__form-search-input');
const item = document.getElementsByTagName('h3');
// const searchBtn = document.querySelector('.header__form-search-button');

searchInput.addEventListener('input', () =>{
   let text= searchInput.value;
    // console.log(text)
    // console.log(item)
    Array.from(item).forEach((elem) =>{
        if(elem.innerText.search(text) == -1){
            elem.parentElement.classList.add('none')
        } else if( elem.innerText.search(text) == 1 ){
            elem.parentElement.classList.remove('none')
        } else {
            elem.parentElement.classList.remove('none')
        }

    })
})

// смена id
let idBtn = document.querySelector ('.header__form-chang-button');
let inputChangeId = document.querySelector ('.header__form-change-input');
let enterId;

inputChangeId.addEventListener('change',() =>{
enterId = inputChangeId.value.trim();
// console.log(enterId)
})

idBtn.addEventListener('click', () =>{
    console.log('клик')
    if(!enterId) {
        return
    }
     myObject.forEach((item) =>{

        if(!item.script.includes('yaCounter')){
            return
        }
        let r =  item.script.indexOf('yaCounter') + 9;   // получение подстроки номера id и перезапись номера на введеное значение 
        
        let dot = item.script.indexOf('.', r)
        console.log(dot)
        let id = item.script.slice(r, dot)
        console.log(id)
        let f = item.script.replace(id, enterId)
        item.script = f;
        console.log(item.script)
     })  

     console.log(myObject)
    // console.log(changeIdObj)


     let rem = document.querySelectorAll('li');    //удаление старых li и рендеринг с новым id
     rem.forEach((el) =>{ el.remove() })
     renderItems (myObject)

     const changeId = JSON.stringify(myObject, null, " ");    // запись в json
     console.log(changeId)
 fs.writeFile('data.json', changeId, err => {
 // error checking
 if(err) throw err;
 });
     
})


//редактировать

container.addEventListener('click', (event) =>{

let target = event.target;

if(!target.matches('.content__edit-btn')){
    return;
}  

     let title = target.parentElement.firstElementChild;
    title.setAttribute('contenteditable', 'true');
    title.classList.add('editable')
    let body = title.nextElementSibling;
    body.setAttribute('contenteditable', 'true');
    body.classList.add ('editable')
})

// заголовки
let old;
let newText;
let existBody;

container.addEventListener('focusin', (e) =>{
    if(!e.target.matches('.content__list-li-title')){
     return
    }
    e.target.addEventListener('keydown' ,(e) =>{
        if(e.key == 'Enter'){
         e.target.removeAttribute('contenteditable')
         e.target.nextElementSibling.removeAttribute('contenteditable')
         e.target.nextElementSibling.classList.remove ('editable')
         e.target.classList.remove ('editable')
        }
         })
     old = e.target.textContent
    console.log(old)
    existBody = e.target.nextElementSibling.innerHTML.replace(/<br>/g, '\n')
    console.log(existBody)

})

container.addEventListener('focusout', (e) =>{
    e.target.removeAttribute('contenteditable')
    e.target.classList.remove ('editable')
       if(!e.target.matches('.content__list-li-title')){
        return
       }
        newText = e.target.textContent
       console.log(newText)

       if(old == newText){
        console.log('изменений не было')
        return
       } 

        myObject.forEach((item) =>{
         if(item.name == old&& item.script == existBody){
                item.name = newText;
                return item
            }
        })
        console.log(myObject)
            const changeItem = JSON.stringify(myObject, null, " ");
                // console.log(changeItem)
             fs.writeFile('data.json', changeItem, err => {
            // error checking
            if(err) throw err;
             });
})

// скрипты
let oldScript;
let newScript;

container.addEventListener('focusin', (e) =>{
    if(!e.target.matches('.content__list-li-script')){
        // e.target.removeAttribute('contenteditable')
     return
    }
    e.target.addEventListener('keydown' ,(e) =>{
           if(e.key == 'Enter'){
            e.target.removeAttribute('contenteditable')
            e.target.classList.remove ('editable')
            e.target.parentElement.firstElementChild.removeAttribute('contenteditable')
            e.target.parentElement.firstElementChild.classList.remove ('editable')
           }
            })

    // oldScript = e.target.textContent
    oldScript = e.target.innerHTML.replace(/<br>/g, '\n')
     console.log(oldScript)
    oldScript = oldScript.replace(/&nbsp;/g, '')
    // console.log(oldScript)

})

container.addEventListener('focusout', (e) =>{
    e.target.removeAttribute('contenteditable')
    e.target.classList.remove ('editable')

       if(!e.target.matches('.content__list-li-script')){
        return
       }
    newScript = e.target.innerHTML.replace(/<br>/g, '\n')
    newScript = newScript.replace(/&nbsp;/g, '')
    
    newScript.replace(/&nbsp/, '')
       

       if(oldScript == newScript){
        console.log('изменений нет')
        return
       } 
       console.log(newScript)
       console.log('изменения')
        myObject.forEach((item) =>{
       
         if(item.script == oldScript){
            console.log('редактирование элемента')
                item.script = newScript;
                console.log(item.script)
                // return item
            }
        })
        console.log(myObject)
            const changeItem = JSON.stringify(myObject, null, " ");
                // console.log(changeItem)
             fs.writeFile('data.json', changeItem, err => {
            // error checking
            if(err) throw err;
             });


})

