 Beta version needs testing with more results.  

  Instructions:-  
  1. Place a valid PDF file in the pdf folder (name shouldn't contain spaces).  
  2. Install XPDF and set pdftotext in your PC path.  
  3. Run mongodb in background (Database- 'Result', Collections- 'Student' and 'Subject')  
  4. Run the parser with `node Result-Parser.js pdf\(pdf-name).pdf`  
  5. If parsing was successsful you will see the results in FinalLists folder as well as mongodb.  
  6. Some Syntax Errors may come but they are part of XPDF and can be ignored.  