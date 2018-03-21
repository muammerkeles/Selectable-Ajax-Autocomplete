# Selectable-Ajax-Autocomplete
Selectable Ajax Autocomplete Input.

   ```html
<input type="text" id="inp1" />
   ```
     
       
  ```javascript
$(function(){
    $("#inp1").selser({  
      placeholder: "Select",  
      searchHolder: "Search",  
      multipleSelect: false,  
      singleSelect: true,  
      minChar: 1,  
      delay: 1000,  
      ajaxParams: {  
            url: "https://api.github.com/users/hadley/orgs",  
            keyname: "",  
            dataType: "json",  
            responsefields: ["login", "id", "url", "repos_url"],  
            responseKey:"",  
            displayfields: ["login"],  
            displaykeyname: "login",  
            inputAttributes: ["login", "id", "url"],  
      }  
    });  
});
  ``` 
   
   Live Demo  
    http://www.muammerkeles.com/selser.html  



 > Note
 > if need use a **key**, example search city with  **cityname** like below,
 > url      :   **https://blabla.com/city/**  
 > keyname  :    **cityname**  
   
 

