import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
config();

import bcrypt from 'bcrypt'
const saltRounds = 10

  const app = express();
  app.use(cors({
      origin: ["http://localhost:5173"],
      methods: ["POST", "GET", "DELETE", "PUT"],
      credentials: true,
  }));

  app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      next();
  });

  // Declarations For the Server
  app.use(bodyParser.json())
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(session({
      secret: 'secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
          secure: false,
          maxAge: 1000* 60 * 60 * 24
      }
  }))

  //Database Connection via the .env file
  const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return;
    }
    console.log('Connected to MySQL database');
  });

  //Getting  the Login Page into /
  app.get('/', (req, res) => {
      if(req.session.username) {
          res.json({valid: true, username: req.session.username})
      } else {
          res.json({valid: false})
      }
  })

  //Getting the logout function
  app.get('/logout', (req, res) => {
      req.session.destroy((err) => {
          if (err) {
              console.log(err);
              res.json({success: false});
          } else {
              res.clearCookie('connect.sid');
              res.json({success: true});
          }
      });
  });

  //Dashboard Function to display the bookings
  app.get('/dashboard', (req, res) => {
      const sql = "SELECT * FROM bookings";
      db.query(sql, (err, data) => {
          if(err) return res.json({Message: "Error in Server"})
          return res.json(data);
      })

  });

  //Signup Function
  app.post('/signup', (req, res) => {

      const name = req.body.name;
      const username = req.body.username
      const password = req.body.password

      bcrypt.hash(password, saltRounds, (err, hash) => {

        if(err) {
          console.log(err);
        }

        const sql = "INSERT INTO users (`fullname` , `username`, `password`) VALUES (?, ? ,?)";

        db.query(sql, [name, username, hash], (err, result) => {
          if(err) return res.json({Message: "Error in Node"})
          return res.json(result);
      })

      })
      // const values = [
      //     req.body.name,
      //     req.body.username,
      //     req.body.password 
      // ]


  })

  //Login Function
  app.post('/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password

      const sql = "SELECT * FROM users WHERE username = ?;";

      db.query(sql, username, (err, result) => {
          if(err) return res.json({Message: "Error inside Server"})
          if(result.length > 0) {
            bcrypt.compare(password, result[0].password, (error, response) => {
              if(response) {
                req.session.username = result[0].fullname;
                return res.json({Login: true})
              } else {
                return res.json({Login: false})
              }
            })
          } else {
              return res.json({Login: false})
          }
      })
  })

  //Delete Booking Function
  app.delete('/dashboard/booking_remove/:id', (req, res) => {
      const sql = "DELETE FROM bookings WHERE id = ?";
      const id = req.params.id;
    
      db.query(sql, [id], (err, data) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Error deleting booking" });
        }
        return res.json(data);
    });
  });

  //Create Booking Function
  app.post('/dashboard/bookings/new', (req, res) => {
    const { fullname, atcposition, date, starttime, endtime } = req.body;
  
    // Validate inputs
    if (!fullname || !atcposition || !date || !starttime || !endtime) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    const getVidSql = "SELECT username FROM users WHERE fullname = ?";
  
    // Query the database to get the VID from the users table
    db.query(getVidSql, [fullname], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error getting VID from users table" });
      }
  
      if (!result || result.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const vid = result[0].username; // Get the VID from the result
  
      const countBookingsSql = "SELECT COUNT(*) AS count FROM bookings WHERE vid = ?";
      const countBookingValues = [vid];
  
      // Query the database to count the number of bookings made by the user with the given VID
      db.query(countBookingsSql, countBookingValues, (err, countResult) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error counting bookings" });
        }
  
        const bookingCount = countResult[0].count; // Get the count from the result
  
        if (bookingCount >= 3) {
          return res.status(400).json({ message: "You have already made 3 bookings" });
        }
  
        const checkBookingsSql = "SELECT COUNT(*) AS count FROM bookings WHERE atcposition = ? AND date = ? AND ((time_start BETWEEN ? AND ?) OR (time_end BETWEEN ? AND ?))";
        const checkBookingValues = [        atcposition,        date,        starttime,        endtime,        starttime,        endtime      ];
  
        // Query the database to count the number of bookings made for the same position and time range
        db.query(checkBookingsSql, checkBookingValues, (err, checkResult) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error checking bookings" });
          }
  
          const bookingOverlapCount = checkResult[0].count; // Get the count from the result
  
          if (bookingOverlapCount > 0) {
            return res.status(400).json({ message: "Someone has already booked this position at this time" });
          }
  
          const insertBookingSql = "INSERT INTO bookings (`fullname`, `vid`, `atcposition`, `date`, `time_start`, `time_end`) VALUES (?, ?, ?, ?, ?, ?)";
          const bookingValues = [          fullname,          vid,          atcposition,          date,          starttime,          endtime        ];
  
          // Insert the booking with the VID into the bookings table
          db.query(insertBookingSql, bookingValues, (err, data) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "Error inserting booking" });
            }
            return res.json(data);
          });
        });
      });
    });
  });
  
  
//Updating the Booking
app.put('/dashboard/bookings/update/:id', (req, res) => {
    const sql = "UPDATE bookings SET atcposition = ?, date = ?, time_start = ?, time_end = ? WHERE id = ?";
    const values = [
      req.body.atcposition,
      req.body.date,
      req.body.starttime,
      req.body.endtime
    ]
    const id = req.params.id;
    db.query(sql, [...values, id], (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Error updating booking" });
      }
      return res.json(data);
    });
  })
  
app.listen(8081, () => {
    console.log("Connected to Server")
});
