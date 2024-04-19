function validateFileInput(fileInput) {
  const file = fileInput.files[0];
  if (!file) {
    return "Please select a file to upload.";
  }

  if (!file.type.match("application/pdf")) {
    return "Only PDF files are allowed.";
  }

  return null; 
}

function createFormField(fieldData) {
  const { type = "text", name, placeholder } = fieldData;
  const inputElement = document.createElement("input");
  inputElement.type = type;
  inputElement.name = name;
  if (placeholder) {
    inputElement.placeholder = placeholder;
  }
  return inputElement;
}




function buildDynamicForm(formData, onSubmit) { 
  const newForm = document.createElement("form");
  newForm.id = "dynamicForm";
  newForm.action = "http://localhost:3000/submit-form"; 
  newForm.method = "post";

  for (const field in formData) {
    if (formData.hasOwnProperty(field)) {
      const label = document.createElement("label");
      label.textContent = formData[field].label;
      newForm.appendChild(label);

      const inputElement = createFormField(formData[field]);
      if (inputElement) {
        newForm.appendChild(document.createTextNode(" "));
        newForm.appendChild(inputElement);
        newForm.appendChild(document.createElement("br")); // Add a break
      }
    }
  }

  if (onSubmit) {
    newForm.addEventListener("submit", onSubmit);
  }
  return newForm;
}


async function handleFormSubmit(event) {
  event.preventDefault();

  const newForm = event.target; 
  const formData = new FormData(newForm);

  
  const response = await fetch("/http://localhost:3000/submit-form", { 
    method: "POST",
    body: formData,
  });

  // Handle the response from the server (success or error)
  if (response.ok) {
    // return true;
    console.log("Form data submitted successfully!");
      } else {
    // return false;
    console.error("Error submitting form data:", await response.text());
    
  }
}

const form = document.getElementById("uploadForm");
const message = document.getElementById("message");
const submitButton = document.getElementById("submitDetails");

form.addEventListener("submit", async function(ev) {
  ev.preventDefault();

  const validationError = validateFileInput(document.getElementById("fileInput"));
  if (validationError) {
    message.textContent = validationError;
    return;
  }

  const response = await fetch("http://localhost:3000/upload", {
    method: "POST",
    body: new FormData(form),
  });

  if (response.ok) {
    const data = await response.json();
    if (data) {
      const formContainer = document.getElementById("form-container");
      formContainer.innerHTML = ""; // Clear any existing form

      const newForm = buildDynamicForm(data, handleFormSubmit); 
      formContainer.appendChild(newForm);
    } else {
      console.warn("No form fields found in response data.");
    }
  }
});


submitButton.addEventListener("click", function () {
  
  const dynamicForm = document.getElementById("dynamicForm"); 
  if (dynamicForm) {
    dynamicForm.submit(); 
  } else {
    console.warn("Dynamic form not found. Submit the upload form instead")
  }
});


