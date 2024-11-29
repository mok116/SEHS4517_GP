a. STEP of deploy the project

1. put whole folder into C:\xampp\htdocs
e.g. C:\xampp\htdocs\SEHS4517_GP
2. open XAMPP, start Apache & MySQL
3. open browser, access http://localhost/phpmyadmin/
4. click "Import/匯入" on the top menu bar
5. upload the sql file "C:\xampp\htdocs\SEHS4517_GP\mysql\127_0_0_1.sql"
6. update DB config file: class\Database.php
7. install Node.js on your PC
8. open cmd, run below command 
npm install express
npm install ejs
npm install cors
9. cd C:\xampp\htdocs\SEHS4517_GP
10. run "node server.js"
11. open browser, access http://localhost/SEHS4517_GP/

---------------------------------------------------------------------------------------------------

b. File Structure

1. action - the path when form submit
2. class  - PHP OOP coding to connect DB, create, update, select query
3. public/css    - external css files for web pages
4. public/images - web pages images files
5. public/js     - external js files for web pages, mainly jQuery + Ajax
6. mysql  - mysql query statement file
7. views  - Node.js EJS template files

c. index.html = 1st page
d. register.html = 2nd page
e. login.html = 3rd page
f. reservation.html = 4th page
g. server.js = Node.js 5th page