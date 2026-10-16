require('dotenv').config()
const express = require('express');
const sequelize = require('./models/index').sequelize;
const { rateLimit } = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15*60 * 1000,
    limit: 200,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: 'Слишком много запросов',
    statusCode: 429
});

const adminRouter = require('./routes/adminRouter');
const authRouter = require('./routes/authRouter');
const gradeRouter = require('./routes/gradeRouter');
const scheduleRouter = require('./routes/scheduleRouter');
const studentRouter = require('./routes/studentRouter');
const teacherRouter = require('./routes/teacherRouter');
const subjectRouter = require('./routes/subjectRouter');
const classRouter = require('./routes/classRouter');
const classroomRouter = require('./routes/classroomRouter');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/admin', adminRouter);
app.use('/api/auth', limiter,  authRouter);
app.use('/api/grades', gradeRouter);
app.use('/api', scheduleRouter);
app.use('/api', studentRouter);
app.use('/api', teacherRouter);
app.use('/api', subjectRouter);
app.use('/api', classRouter);
app.use('/api', classroomRouter);

app.use((req, res) => res.status(404).json({ message: 'Not found' }));
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: 'error'});
})

async function start() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true, hooks: false, constraints: false });
        await sequelize.sync({ alter: true });
        const server = app.listen(process.env.PORT, async function() {
            console.log('Server running on port', process.env.PORT || 5012);
        });
        server.on('error', err => { console.error(err); process.exit(1); });
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}

start();