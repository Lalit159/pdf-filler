const form = document.getElementById("uploadForm");
const message = document.getElementById("message");

let newForm;

form.addEventListener("submit", uploadFile);

async function uploadFile(ev) {
  ev.preventDefault();

  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    message.textContent = "Please select a file to upload.";
    return;
  }

  // Check if file type is PDF
  if (!file.type.match("application/pdf")) {
    message.textContent = "Only PDF files are allowed.";
    return;
  }

  const formData = new FormData();
  // console.log(file);
  formData.append("myFile", file);


  // Replace with your server-side script URL
  const response = await fetch("http://localhost:3000/upload", {
    method: "POST",
    body: formData,
  });


  if (response.ok) {
    const data = await response.json(); // parsing response in the JSON form
    if (data) {

      // console.log(data)
      const formContainer = document.getElementById("form-container");
      formContainer.innerHTML = ""; // Clear any existing form

      const newForm = document.createElement("form");
      newForm.id = "dynamicForm";
      newForm.action = '/submit-form.php';  // URL where the form data will be submitted
      newForm.method = 'post';            // HTTP method (post or get)

      for (const field in data) {
        if (data.hasOwnProperty(field)) { // ISKO DEKHNA PADEGA
          const label = document.createElement("label");
          label.textContent = `${data[field].label}`; // languages me language1, 2, 3 kyu jaa rha?? (in check box)
          newForm.appendChild(label); // IG FORM ME DAALENGE
      
          let inputElement;
          switch (
            data[field].type.toLowerCase() // Handle type case-insensitively
          ) {
            case "text box": 
              inputElement = document.createElement("input");
              inputElement.type = "text";
              inputElement.name = data[field].label;
              inputElement.id = data[field].label;
              break;
      
            case "combo box":
              inputElement = document.createElement("select"); 
              inputElement.name = data[field].label;
              inputElement.id = data[field].label;
      
              for (const option of ["Option 1", "Option 2", "Option 3"]) { // OPTIONS EXTRACT KAR SKTE KYA?
                const optionElement = document.createElement("option");
                optionElement.textContent = option;
                optionElement.value = option;
                inputElement.appendChild(optionElement);
              }
              break;
      
            case "list box": // OPTIONS KAISE EXTRACT KARE??
              inputElement = document.createElement("select");
              inputElement.name = data[field].label;
              inputElement.id = data[field].label;

              // Assuming data[field].options is an array of options
              for (const option of ["Option 1", "Option 2", "Option 3"]) {
                const optionElement = document.createElement("option");
                optionElement.textContent = option;
                optionElement.value = option;
                inputElement.appendChild(optionElement);
              }
              break;
      
            case "formatted field": // default value extract kar skte kya?
              inputElement = document.createElement("input");
              inputElement.type = "text"; 
              inputElement.name = data[field].label;
              inputElement.id = data[field].label;
              break;
      
            case "check box": 
              inputElement = document.createElement("input");
              inputElement.type = "checkbox";
              inputElement.name = data[field].label;
              inputElement.id = data[field].label;
              break;
      
            default:
              console.warn("Unsupported field type:", data[field].type);
          }
      
          if (inputElement) {
            newForm.appendChild(document.createTextNode(' '));
            newForm.appendChild(inputElement);
            newForm.appendChild(document.createElement("br")); // Add a break
          }
        }
      }
      // console.log("type", typeof(newForm));
      formContainer.appendChild(newForm);
    } else {
      console.warn("No form fields found in response data.");
    }


  }
}



// newForm = document.getElementById('dynamicForm'); // Replace with the actual ID you used
// console.log("Type", typeof(newForm))

// const submitButton = document.getElementById('submitDetails');
//     submitButton.addEventListener('click', async (ev) => {
//       ev.preventDefault(); // Prevent default form submission behavior
  
//       // if(!newForm){
//       //     console.log("Form undefined")
//       // }
//       console.log("Type", typeof(newForm))
//       // Collect form data (replace with your preferred method)
//       const formData = new FormData(newForm); // Efficient way to handle form data
  
//       // try{
//       //     const response = await fetch("http://localhost:3000/submit-form", {
//       //         method: 'POST',
//       //         body: formData
//       //     });
  
//       //     if (!response.ok) {
//       //         throw new Error(`HTTP error! status: ${response.status}`);
//       //     }
  
  
//       // }
//       // catch(err){
//       //     console.log(err);
//       // }
  
//   });






