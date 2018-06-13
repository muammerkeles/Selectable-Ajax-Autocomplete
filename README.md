# Selectable-Ajax-Autocomplete
Selectable Ajax Autocomplete Input.

First of all what is difference from Select2 in Ajax-Autocomplete?  
This provides you to use Ajax-Autocomplete like Select element.  

The "Select2" known is useful for particular json-data like below; 
But the plugin support your work above, if you need to "Queryable Select list" for "completely dynamic data-feeds like API"! 

   ```html

<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>  
<script src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>  

<script src="Content/mkselser.js"></script>  
<link href="Content/mkselser.css" rel="stylesheet" />  

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
    http://www.muammerkeles.com/envato/demos/selser/



 > Note  
 > if need use a **key**, example search city with  **cityname** should be like below,  
  ```javascript
  url      :   https://blabla.com/city/    
  keyname  :    cityname    
```
 

