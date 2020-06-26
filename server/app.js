const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const formidable = require('formidable')
const moment = require('moment')
const compression = require('compression')
const https = require('https')
const db = require('./util/db')
const utils = require('./util')
const callProc = require('./util').callProc
const manage = require('./routes/manage');


app.use(compression())
app.use(cors())
app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
app.use(express.static(__dirname + '/'))
// const port = 8090;

const port = 8090;
app.use('/manage',manage);

app.get('/UserList', async function (req, res) {
	let sql = `CALL PROC_USER_LIST`

	callProc(sql, {}, res, (r) => {
		res.status(200).json({code: 200, data: r})
	})
})

app.listen(port, () => console.log(`> Running on localhost:${port}`))

module.exports = app;
