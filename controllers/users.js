const mysql = require('mysql')
const pool = require('../sql/connection')
const { handleSQLError } = require('../sql/error')

exports.getAllUsers = (req, res) => {
  pool.query("SELECT * FROM users JOIN usersAddress ON users.id = usersAddress.user_id JOIN usersContact ON users.id = usersContact.user_id ORDER BY users.id;", (err, rows) => {
    if (err) return handleSQLError(res, err)
    return res.json(rows);
  })
}

exports.getUserById = (req, res) => {
  const id = req.params.id;

  let sql = `
    SELECT ?? 
    FROM ?? 
    WHERE ?? = ?`

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
  let sql = `
    INSERT INTO ?? (??, ??) 
    VALUES (?, ?)`

  sql = mysql.format(sql, ['users', 'first_name', 'last_name', `${firstName}`, `${lastName}`])

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.json({ newId: results.insertId });
  })
}

exports.updateUserById = (req, res) => {
  const id = parseInt(req.params.id)
  const firstName = req.body.first_name
  const lastName = req.body.last_name

  let sql = `
    UPDATE ?? 
    SET ?? = ?, ?? = ? 
    WHERE ?? = ?`
  
  sql = mysql.format(sql, ['users', 'first_name', firstName, 'last_name', lastName, 'id', id])

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.status(204).json();
  })
}

exports.deleteUserByFirstName = (req, res) => {
  const firstName = req.params.first_name

  let sql = `
    DELETE 
    FROM ?? 
    WHERE ?? = ?`
    
  sql = mysql.format(sql, ['users', 'first_name', firstName])

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.json({ message: `Deleted ${results.affectedRows} user(s)` });
  })
}