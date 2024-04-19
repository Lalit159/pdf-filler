const express = require("express");
const multer = require("multer");
const bodyParser = require('body-parser');
const cors = require("cors");
const { PDFDocument } = require("pdf-lib");
const {readFile, writeFile} = require('fs/promises')
const { read } = require("fs");



function splitIntoLabelAndType(dynamicArray) {
  return dynamicArray.map(item => {
    // Split the string by space
    const words = item.split(' ');

    // Extract the last two words as type
    const type = words.slice(-2).join(' ');

    const label = words.slice(0, -2).join(' ');

    return { label, type };
  });
}

const app = express();
// Enable CORS for all routes
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));


const upload = multer({ storage: multer.memoryStorage() });
let form;
let fieldNames;
let fields;
let pdfDoc;

app.post("/upload", upload.single("myFile"), async (req, res) => {
    try {
      const pdfBuffer = req.file.buffer; // Access the uploaded file buffer
      
      pdfDoc = await PDFDocument.load(pdfBuffer);// Load the PDF document

      // Extract form fields (assuming they exist in the PDF)
      form = pdfDoc.getForm();
      fieldNames = form.getFields();
      fieldNames = fieldNames.map(f=>f.getName())
      
      fields = splitIntoLabelAndType(fieldNames)
      // console.log(fieldNames)

      res.json(fields)
    } catch (err) {
      console.error("Error extracting fields:", err);
      res.status(500).json({ message: "Failed to extract fields!" });
    }
  }
);

// console.log("fields upar", fields)

app.post("/submit-form", async (req, res) => {
  try{
    const formData = req.body;
    // console.log("fields niche", fields)
    // console.log(formData);
    for(const field of fields){
      const label = field.label;
      const type = field.type;
      if(type==='Text Box' || type==='Formatted Field'){
      form.getTextField(label + " " + type).setText(formData.label);
      }
      else if(type==='Combo Box'){
      form.getDropdown(label + " " + type).select(formData.label);
      }
      else if(type==='List Box'){
      form.getOptionList(label + " " + type).select(formData.label);
      }
      else if(type==='Check Box'){
      form.getCheckBox(label + " " + type).check(formData.label);

      }
    }
    console.log("Success, ab bas pdf ko deploy krde aur link share karde")


    // const pdfBytes = await pdfDoc.save()

    // await writeFile(output, pdfBytes)
    


  }
  catch(err){
    console.log(err);
    res.status(500).json({message: "Failed to edit PDF"});
  }
})




  


app.listen(3000, () => console.log("Server listening on port 3000"));







