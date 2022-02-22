# **ECOVIA INVENTORY MANAGEMENT**

**ASSUMED DB STRUCTURE**
- Ecovian Collections
  - _id (ObjectId) : unique id of the user
  - username (String) : username of the ecovian
  - password (String) : password of the ecovian
  - createdAt (Date)  : timestamp at which the account was created 
  - updatedAt (Date)  : timestamp at which the account was updated
- Bag Collections
  - uuid (String) : unique id of each new bag inserted
  - size(Number) : size of the bag
  - weight(Number) : weight of the bag
  - flapColour(String) : flap colour of the bag
  - inventoryId(String) : id of the inventory in which the bag is present
  - area(Number) : the area of the above inventory in which the bag is present, ready(1), repair(2), damage(3)
- Inventory: Collections
  - _id(ObjectId) : unique id of the inventory
  - ecovianId(String) : id of the ecovian under which the inventory is purviewed
  - damage (Number) : count of the number of bags present in the damage area
  - repair (Number) : count of the number of bags present in the repair area
  - ready (Number) : count of the number of bags present in the ready area
  - name (String) : name of the inventory
  - address (String) : address of the inventory

<br>

**SUMMARY / ASSUMPTIONS**
- The ecovian can use the signup API to establish a new account by providing the needed information. The inputted password is not saved in the database immediately. The password hash is created with the <b>bycrypt.js npm package</b>. In the database, the username and hashed password are kept.
- By providing the username and password to the login API, the ecovian may log in. The validity of these input credentials is tested. We produce a JSON web token with the <b>jsonwebtoken</b> npm package if the credentials are correct. Futher this token will be used to determine if the user is authenticated or not.
- Using the createInventory API After logging in and supplying the required information, an ecovian can create one or more new inventories. The ecovian will only look at this inventory. Only the ecovian's authorised inventory allows them to participate in any activities.
- Using the passInventory API, an ecovian can pass the control of any of his inventories to another ecovian.
- An ecovian can retrieve the specifics of each of his inventory using the getInventories API, such as the name, address, and number of bags present in each of the three zones (ready, repair, damage).
- ecovian can access more information on any of his inventories by using the inventoryDetails API. This will include information such as name, location, and the number of bags in each of the three zones (ready, repair, and damage), damageBags(array of bags documents present in the damage region), repairBags(array of bag documents present in the repair region), readyBags(array of bag documents present in the ready region).
- The ecovian can use the addBags API to add one or more bags to any of his inventories at the same time. <b>A unique version 4 uuid is generated using uuid.js npm package</b>. The ecovian must indicate where the bag should be placed in the inventory (i.e in ready, in damage or in repair).
- Following the processing of the bags, the ecovian can use the moveBags API to move one or more bags to other regions within the inventory.
- Using deleteBags API, the ecovian can delete only those bags which were present in the ready area and have been shipped.
- The ecovian can only delete those bags that were in the ready area and were shipped using the deleteBags API.

<br>

**NPM PAKAGES USED**
- <b>bcrypt.js :</b> to create a hash for the inputted password.
- <b>jwtwebtoken.js :</b> to generate a json web token upon successfull login
- <b>uuid.js :</b> to generate a uuid4 (version 4 uuid) using uuidv4()
- <b>mongoose.js :</b> to simply the communication with the mongoDB database
- <b>express.js :</b> useful for creating the APIs for the app
- <b>nodemon.js :</b> automatically restarts the node application when file changes in the directory are detected

<br>

**STEPS TO INSTALL THE PROJECT**
- Clone the project
- Open the terminal with the root folder /ecovia-inventory-management>
- Type the command: npm install

This will install all the npm packages necessary to run this app

<br>

**FOLDER STRUCTURE**
- constants /
  - backendConfig.js - contains the database related configurations
- controllers /
  - bagsController.js - contains addBags, moveBags and deleteBags controllers
  - ecovianController.js - contains sigin, signup, isAuthenticated controllers
  - inventoryController.js - contains createInventory, passInventory, getInventories, inventoryDetails controllers
- models /
  - bagsModel.js - contains bagSchema and bagModel
  - ecovianModel.js - contains ecovianSchema and ecovianModel
  - inventoryModel.js - contains inventorySchema and inventoryModel 
- routes /
  - index.js - contains the routes for for various functions 
- services /
  - mongoConnection.js - establishes connection b/w the app and mongoDB server
- util /
  - authentication.js - contains functions to generate JWT token and verify tokens.
- test-api.http - contains all the details of api testing
<br>

**APIS**

##### signup
- ###### api:
  POST http://localhost:4000/signup
- ###### request body:
  {
      "username": "Mohit",
      "password": "Suri"
  }
- ###### usage:
  This api is to create a new ecovian account

##### signin
- ###### api:
  POST http://localhost:4000/signin
- ###### request body:
  {
      "username": "Mohit",
      "password": "Suri"
  }
- ###### usage:
  This api is to login a ecovian


##### create inventory
- ###### api:
  POST http://localhost:4000/createinventory
- ###### headers:
  token: VALID_JWT_TOKEN
- ###### request body:
  {
      "name": "Hello Store",
      "address": "xyz colony"
  }
- ###### usage:
  Whenever a ecovian logs into his account, he can use this api to create new inventory


##### pass the inventory to some other ecovian
- ###### api:
  POST http://localhost:4000/passinventory
- ###### headers:
  token: VALID_JWT_TOKEN
- ###### request body:
  {
      "inventoryId": "62137be0db2e88e32e29a1b5",
      "toEcovianId": "62136c872bba244cc54502bd"
  }
- ###### usage:
  An ecovian use this api to pass the inventory with the given inventoryId to some other ecovian with a given ecovianId



##### add bags
- ###### api:
  POST http://localhost:4000/addbags
- ###### headers:
  token: VALID_JWT_TOKEN
- ###### request body:
  {
      "inventoryId": "62137be0db2e88e32e29a1b5",
      "area": 2,
      "bags": [
          {
              "size": 150,
              "weight": 50,
              "flapColour": "Hello"
          },
          {
              "size": 150,
              "weight": 70,
              "flapColour": "World"
          },
      ]
  }
- ###### usage:
  We can pass the data of multiple bags that is to be added in a given inventory.



##### move bags
- ###### api:
  POST http://localhost:4000/movebags
- ###### headers:
  token: VALID_JWT_TOKEN
- ###### request body:
  {
      "inventoryId": "62137be0db2e88e32e29a1b5",
      "area": 3,
      "bagIds": ["09bb7d73-3684-4626-91bc-dcbec2c90eea", "5fd75134-44ae-415e-b47c-e09466252c21"]
  }
- ###### usage:
  We can pass the data of multiple bags that is to be moved from one area to some given area within the inventory.



##### delete bags
- ###### api:
  POST http://localhost:4000/deletebags
- ###### headers:
  token: VALID_JWT_TOKEN
- ###### request body:
  {
      "inventoryId": "62137be0db2e88e32e29a1b5",
      "bagIds": ["402fdade-d766-46af-9999-b84789fa199c", "09bb7d73-3684-4626-91bc-dcbec2c90eea"]
  }
- ###### usage:
  We can delete the bags which were present in the ready area and shipped


##### get inventories
- ###### api:
GET http://localhost:4000/getinventories
- ###### headers:
  token: VALID_JWT_TOKEN
- ###### usage:
  This give the brief overview of all the inventories purviewed by a ecovian


##### get inventory details
- ###### api:
  POST http://localhost:4000/inventorydetails
- ###### headers:
  token: VALID_JWT_TOKEN
- ###### request body:
  {
      "inventoryId": "62137be0db2e88e32e29a1b5"
  }
- ###### usage:
  This give all the details of given inventory, i.e the count of no. of bags present in each area, the details of the bags present in each area etc.




