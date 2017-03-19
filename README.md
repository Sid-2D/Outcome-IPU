# Outcome for IPU

A single page [web app](https://outcome-ipu.herokuapp.com) that provides results to IP University students in a tabular form and also displays the class list of the student. All it needs is the student's Roll Number and it fetches all the results available in the database.

### Features
1. Results of all CSE and ECE students starting from 2014 Batch, some results are also available for 2013 batch.
2. Mobile friendly, using Bootstrap v4.
3. Chrome add to home screen feature and theme color for Chrome on Android.

### Stack
##### 1. Backend
	- Node.js for parsing.
	- Express for serving files.
	- MongoDB for storing data. 

##### 2. Frontend
	- Bootstrap.
	- Vanilla Javascript.

*The parsers support parsing of any IPU Result of any Course but due to lack of storage provided by the free server, I have currently limited the results to B.Tech CSE and ECE only.  
*Works best on Chrome and Firefox.  
