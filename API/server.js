const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { PDFDocument } = require("pdf-lib");
const { read } = require("fs");

function splitIntoLabelAndType(dynamicArray) {
  return dynamicArray.map(item => {
    // Split the string by space
    const words = item.split(' ');

    // Extract the last two words as type
    const type = words.slice(-2).join(' ');

    // The label is the rest of the words except the last two joined by space
    const label = words.slice(0, -2).join(' ');

    return { label, type };
  });
}

const app = express();
// Enable CORS for all routes
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("myFile"), async (req, res) => {
    try {
      const pdfBuffer = req.file.buffer; // Access the uploaded file buffer
      
      const pdfDoc = await PDFDocument.load(pdfBuffer);// Load the PDF document

      // Extract form fields (assuming they exist in the PDF)
      const form = pdfDoc.getForm();
      let fieldNames = form.getFields();
      fieldNames = fieldNames.map(f=>f.getName())
      
      fieldNames = splitIntoLabelAndType(fieldNames)
      // console.log(fieldNames)

      res.json(fieldNames)


      // Iterate through form fields (modify to extract specific fields if needed)
      // for (const [name, field] of form.getFields()) {
      //   formFields.push({ name, type: field.constructor.name }); // Get field type based on constructor
      // }

      // res.json({ formFields }); // Send extracted form fields as JSON response
    } catch (err) {
      console.error("Error extracting fields:", err);
      res.status(500).json({ message: "Failed to extract fields!" });
    }
  }
);


app.post("submit-form", async (req, res) => {
  try{
    const formData = req.body;

    // console.log(formData)

    const pdfDoc = await PDFDocument.load(pdfBuffer);// Load the PDF document
    // Extract form fields from the original PDF (optional)
    const form = pdfDoc.getForm();
    const originalFields = form ? form.getFields().map(f => f.getName()) : [];

    // Get form field names and values from submitted data
    const updatedFields = Object.entries(formData).map(([fieldName, value]) => ({
      name: fieldName,
      value,
    }));

    // Check if submitted field names match existing ones (optional)
    const validFields = updatedFields.filter(field => originalFields.includes(field.name));

    // Edit form fields in the PDF
    const pages = pdfDoc.getPages();
    for (const page of pages) {
      const annotations = page.getAnnotations();
      for (const annotation of annotations) {
        if (annotation.constructor.name === 'PdfFormField') {
          const fieldName = annotation.getFieldName();
          const matchingField = validFields.find(f => f.name === fieldName);
          if (matchingField) {
            annotation.setValue(matchingField.value);
          }
        }
      }
    }

    // Save the modified PDF document
    const pdfBytes = await pdfDoc.save();

    // Send the modified PDF as a response (content type set to application/pdf)
    res.writeHead(200, { 'Content-Type': 'application/pdf' });
    res.end(pdfBytes, 'binary');

  }
  catch(err){
    console.log(err);
    res.status(500).json({message: "Failed to edit PDF"});
  }
})

  


app.listen(3000, () => console.log("Server listening on port 3000"));
