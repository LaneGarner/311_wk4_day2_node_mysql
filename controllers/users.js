const mysql = require('mysql')
const pool = require('../sql/connection')
const { handleSQLError } = require('../sql/error')

exports.getAllUsers = (req, res) => {
  // SELECT ALL USERS
  pool.query("SELECT * FROM users JOIN usersAddress ON users.id = usersAddress.user_id JOIN usersContact ON users.id = usersContact.user_id;", (err, rows) => {
    if (err) return handleSQLError(res, err)
    return res.json(rows);
  })
}

exports.getUserById = (req, res) => {
  // SELECT USERS WHERE ID = <REQ PARAMS ID>
  const id = req.params.id;
  let sql = "SELECT ?? FROM ?? WHERE ?? = ?"
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, ['*', "users", "id", id])

  pool.query(sql, (err, rows) => {
    if (err) return handleSQLError(res, err)
    return res.json(rows);
  })
}
exports.createUser = (req, res) => {
  let newUser = req.body
  let firstName = newUser.first_name
  let lastName = newUser.last_name
  // INSERT INTO USERS FIRST AND LAST NAME 
  let sql = "INSERT INTO ?? (??, ??) VALUES (?, ?)"
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, ['users', 'first_name', 'last_name', `${firstName}`, `${lastName}`])

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.json({ newId: results.insertId });
  })
}

exports.updateUserById = (req, res) => {
  // UPDATE USERS AND SET FIRST AND LAST NAME WHERE ID = <REQ PARAMS ID>
  const id = parseInt(req.params.id)
  const firstName = req.body.first_name
  const lastName = req.body.last_name

  let sql = "UPDATE ?? SET ?? = ?, ?? = ? WHERE ?? = ?"
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, ['users', 'first_name', firstName, 'last_name', lastName, 'id', id])

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.status(204).json();
  })
}

exports.deleteUserByFirstName = (req, res) => {
  // DELETE FROM USERS WHERE FIRST NAME = <REQ PARAMS FIRST_NAME>
  const firstName = req.params.first_name

  let sql = "DELETE FROM ?? WHERE ?? = ?"
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, ['users', 'first_name', firstName])

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.json({ message: `Deleted ${results.affectedRows} user(s)` });
  })
}

// module.exports = {
//   getAllUsers,
//   getUserById,
//   createUser,
//   updateUserById,
//   deleteUserByFirstName
// }