const knex = require('knex')
const config = require('config')

const data_base = knex({
    client: 'pg',
    connection: {
        host: config.db_connection.host,
        user: config.db_connection.user,
        password: config.db_connection.password,
        database: config.db_connection.database
    }
})

async function create_table() {
    try {
        const result = await data_base.raw(`CREATE TABLE if not exists students (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            age INT,
            email VARCHAR(255) NOT NULL,
            city VARCHAR(255),
            UNIQUE(name),
            UNIQUE(email)
        );`)
        console.log('create finished successfully');
    }
    catch (e) {
        console.log('create failed');
        console.log(e.message);
    }
}

async function insert_students5() {
    try {
        `INSERT INTO students (name, age, email, city) VALUES ('Arya Stark', 18, 'arya.stark@example.com', 'Winterfell');
    INSERT INTO students (name, age, email, city) VALUES ('Jon Snow', 20, 'jon.snow@example.com', 'The Wall');
    INSERT INTO students (name, age, email, city) VALUES ('Daenerys Targaryen', 22, 'daenerys.targaryen@example.com', 'Dragonstone');
    INSERT INTO students (name, age, email, city) VALUES ('Tyrion Lannister', 24, 'tyrion.lannister@example.com', 'King’s Landing');
    INSERT INTO students (name, age, email, city) VALUES ('Sansa Stark', 19, 'sansa.stark@example.com', 'Winterfell');`
            .replaceAll('\n    ', '')
            .split(';')
            .filter(query => query)
            .forEach(async query => { await data_base.raw(query + ';') })
    }
    catch (e) {
        console.log('insert 5 failed');
        console.log(e.message);
    }

}

async function get_all_students() {
    // add try catch
    const students = await data_base.raw("select * from students")
    console.log(students.rows.map(s => `[${s.id}] ${s.name}`));
    return {
        status: "success",
        data: students.rows
    }
}

async function get_student_by_id(id) {
    const students = await data_base.raw(`select * from students where id = ${id}`)
    console.log(`By id = [${students.rows[0].id}] ${students.rows[0].name}`);
    console.log(students.rows[0]);
    return {
        status: "success",
        data: students.rows[0]
    }
}

async function insert_student(new_student) {
    try {
        delete new_student.id
        const result_ids = await data_base('students').insert(new_student).returning('id');
        console.log(result_ids[0]);

        const id = result_ids[0].id // the new id
        return {
            status: "success",
            data: { id, ...new_student }
        }
        // url: `/api/students/${id}`
        console.log('insert successed!');
    }
    catch (e) {
        console.log('insert failed!');
        return {
            status: "error",
            internal: false,
            error: e.message.replaceAll("\"", "'")
        }
    }
}

async function update_student(id, updated_student) {
    // add try-catch
    // can fail due to duplication
    const result = await data_base.raw(`UPDATE students set name=?,age=?,email=?,city=? where id=?`,
        [updated_student.name ? updated_student.name : '', 
         updated_student.age ? updated_student.age : 0,
         updated_student.email ? updated_student.email : '',
         updated_student.city ? updated_student.city : '',
        id])
    console.log('updated succeeded for id ' + id);
    return {
        status: "success",
        data: result.rowCount
    }
}

async function patch_student(id, updated_student) {
    // add try-catch to figure out if there was
    // a unique constrain error, if so the user should get error-400
    const query_arr = []
    for (let key in updated_student) {
        query_arr.push(`${key}='${updated_student[key]}'`)
    }

    if (query_arr.length > 0) {
        // check how many employess updated?
        const query = `UPDATE students set ${query_arr.join(', ')} where id=${id}`
        const result = await data_base.raw(query)
        return {
            status: "success",
            data: result.rowCount
        }
    }
    return {
        status: "success",
        data: query_arr.length
    }
}

async function delete_student(id) {
    const result = await data_base.raw(`DELETE from students where id=${id}`)
    console.log(result.rowCount);
    return {
        status: "success",
        data: result.rowCount
    }
}

async function delete_table() {
    // delete table
    // try catch in case table does not exist
    await data_base.raw(`DROP table students`)
    return {
        status: "success"
    }
}

//create_table()
//insert_students5()
//get_all_students()
//get_student_by_id(1)

//const new_student = {name: 'Sansa Stark!', age: 19, email: 'sansa.starkk@example.com', city: 'Winterfell'}
//insert_student(new_student)

// const updated_student = {name: 'Sansa Stark!!', age: 19, email: 'sansa.starkk@example.com', city: 'Winterfell'}
// update_student(101, updated_student)

//const patched_student = {name: 'Sansa Stark$', age: 20 }
//patch_student(101, patched_student)

//delete_student(5)

//delete_table()

module.exports = {
    get_all_students, get_student_by_id, insert_student,
    update_student, patch_student, delete_student, delete_table,
    create_table, insert_students5
}