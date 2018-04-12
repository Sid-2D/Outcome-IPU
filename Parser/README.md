Code that powers the parsing of pdf files.

Insrtuctions:-
1. Place a valid PDF file in the Upload folder (name shouldn't contain spaces).
2. Install XPDF and set pdftotext in your PC path.
3. Run mongodb in background.
4. Run the parser with `node Result-Parser.js Upload\(pdf-name).pdf`
5. If parsing was successsful you will see the results in FinalLists folder as well as mongodb.
6. For ranks and aggregates you can run the aggregation frameworks present in HelperScripts.