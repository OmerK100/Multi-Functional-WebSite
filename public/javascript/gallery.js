var counter = 0;
fetch("http://localhost:4000/photos") // Fetch client's photos from the server
  .then(res => 
    
   
    res.blob()
  ).then(blob =>{
    var zip = new JSZip();
    zip.loadAsync(blob).then(function (zip) {
      var size = Object.keys(zip.files).length;
      Object.keys(zip.files).forEach(function(filename){

        zip.files[filename].async("blob").then(function(fileData) {
          var f = new File([fileData], filename);

          const div1 = document.createElement("div");
          div1.classList.add("image");
          
          const img = document.createElement("img");
          img.src = URL.createObjectURL(f);
          img.classList.add("image__img");

          const div2 = document.createElement("div");
          div2.classList.add("image__overlay");

          const div3 = document.createElement("div");
          div3.classList.add("image__title");

          const button_delete = document.createElement("button");
          button_delete.textContent = "Delete";
          button_delete.value = filename;

          button_delete.addEventListener("click", (event) => {
            //var num = parseInt(event.target.value);

            var name = event.target.value;
            console.log(name);
            
            fetch("http://localhost:4000/delete-image", {method: "delete", headers: {'Content-Type': 'application/json'}, body: JSON.stringify({name: name})}).then(res => res)
            .then(data => {
              //console.log(data);
              window.location.href = data.url;
            });
          })
          //div3.classList.add("image__title");

          //const button_favorite = document.createElement("button");
          //div3.classList.add("image__title");

          //img.setAttribute("style", "width: 200px");
          document.getElementById("main-div").appendChild(div1);
          document.getElementsByClassName("image")[counter].appendChild(img);
          document.getElementsByClassName("image")[counter].appendChild(div2);
          document.getElementsByClassName("image__overlay")[counter].appendChild(button_delete);
          if (counter === size - 1) {
            document.getElementById("main-div").style.display = "block";
            document.getElementsByClassName("container")[0].style.display = "none";
          }
          //document.getElementsByClassName("image__overlay")[counter].appendChild(button_favorite);

          counter++;
        });
        

        
      });
    
    });
    
  });



  // cant load as renderig legth, missing correct "content length" header attribute

 /* var a = 0;

  const options = {
    responseType: "blob",
    onDownloadProgress: function(progressEvent) {
      const percentComplete = Math.floor((progressEvent.loaded / 864635) * 100);
      console.log(percentComplete + "%");
    }
  }


  axios.get("http://localhost:4000/photos", options)
    .then(res => {
console.log(res.data.size)
      var zip = new JSZip();
    zip.loadAsync(res.data).then(function (zip) {
      Object.keys(zip.files).forEach(function(filename){

        zip.files[filename].async("blob").then(function(fileData) {
          var f = new File([fileData], filename);

          const div1 = document.createElement("div");
          div1.classList.add("image");
          
          const img = document.createElement("img");
          img.src = URL.createObjectURL(f);
          img.classList.add("image__img");

          const div2 = document.createElement("div");
          div2.classList.add("image__overlay");

          const div3 = document.createElement("div");
          div3.classList.add("image__title");

          const button_delete = document.createElement("button");
          button_delete.textContent = "Delete";
          button_delete.value = filename;

          button_delete.addEventListener("click", (event) => {
            //var num = parseInt(event.target.value);

            var name = event.target.value;
            console.log(name);
            
            fetch("http://localhost:4000/delete-image", {method: "delete", headers: {'Content-Type': 'application/json'}, body: JSON.stringify({name: name})}).then(res => res)
            .then(data => {
              //console.log(data);
              window.location.href = data.url;
            });
          })
          //div3.classList.add("image__title");

          //const button_favorite = document.createElement("button");
          //div3.classList.add("image__title");

          //img.setAttribute("style", "width: 200px");
          document.getElementsByTagName("body")[0].appendChild(div1);
          document.getElementsByClassName("image")[counter].appendChild(img);
          document.getElementsByClassName("image")[counter].appendChild(div2);
          document.getElementsByClassName("image__overlay")[counter].appendChild(button_delete);
          //document.getElementsByClassName("image__overlay")[counter].appendChild(button_favorite);

          counter++;
        });
        

        
      });
    
    });
      //console.log(res);
      //a = res.data.size;
    })      */

  

  var submit = document.getElementById("submit");
  var upload = document.getElementById("upload");

  /*submit.addEventListener("click", () => {
    if (upload.files.length !== 0) {
      const img = document.getElementById("show");
      img.src = URL.createObjectURL(upload.files[0]);
      img.setAttribute("style", "width: 200px");
    }
  });*/

  upload.addEventListener("change", () => {
    if (upload.files.length != 0) {
      const img = document.getElementById("show");
      img.src = URL.createObjectURL(upload.files[0]);
      img.setAttribute("style", "width: 200px");
    }
  });