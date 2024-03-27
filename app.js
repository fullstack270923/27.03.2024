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

async function insert_5() {
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
/*

async function get_all_students() {
    // add try catch
    const students = await data_base.raw("select * from students")
    students.rows = students.rows.map(e => {
        e.address = e.address.trimEnd();
        return e;
    })

    return {
        status: "success",
        data: students.rows
    }
}

async function get_student_by_id(id) {
    const students = await data_base.raw(`select * from student where id = ${id}`)
    students.rows = students.rows.map(e => {
        e.address = e.address.trimEnd();
        return e;
    })
    return {
        status: "success",
        data: students.rows[0]
    }    
}

async function insert_student(new_student) {
    try {
        delete new_student.id
        console.log(new_student);
        const result_ids = await data_base('company').insert(new_student).returning('id');
        console.log(result_ids[0]);

        const id = result_ids[0].id // the new id
        return { status: "success", 
                 data: { id, ...new_student }  }
        // url: `/api/students/${id}`
    }
    catch (e) {
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
    const result = await data_base.raw(`UPDATE company set name=?,age=?,address=?,salary=? where id=?`,
        [updated_student.name, updated_student.age, updated_student.address ? updated_student.address : '', updated_student.salary, id])
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
        const query = `UPDATE company set ${query_arr.join(', ')} where id=${id}`
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
    const result = await data_base.raw(`DELETE from company where id=${id}`)
    console.log(result);
    return {
        status: "success",
        data: result.rowCount
    }  
}

async function delete_table() {
    // delete table
    // try catch in case table does not exist
    await data_base.raw(`DROP table company`)
    return {
        status: "success"
    }      
}
*/

create_table()
//insert_5()

