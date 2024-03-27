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

async function get_all_employees() {
    // add try catch
    const employees = await data_base.raw("select * from company")
    employees.rows = employees.rows.map(e => {
        e.address = e.address.trimEnd();
        return e;
    })

    return {
        status: "success",
        data: employees.rows
    }
}

async function get_employee_by_id(id) {
    const employees = await data_base.raw(`select * from company where id = ${id}`)
    employees.rows = employees.rows.map(e => {
        e.address = e.address.trimEnd();
        return e;
    })
    return {
        status: "success",
        data: employees.rows[0]
    }    
}

async function insert_employee(new_employee) {
    try {
        delete new_employee.id
        console.log(new_employee);
        const result_ids = await data_base('company').insert(new_employee).returning('id');
        console.log(result_ids[0]);

        const id = result_ids[0].id // the new id
        return { status: "success", 
                 data: { id, ...new_employee }  }
        // url: `/api/employees/${id}`
    }
    catch (e) {
        return {
            status: "error",
            internal: false,
            error: e.message.replaceAll("\"", "'")
        }
    }
}

async function update_employee(id, updated_employee) {
    // add try-catch
    // can fail due to duplication
    const result = await data_base.raw(`UPDATE company set name=?,age=?,address=?,salary=? where id=?`,
        [updated_employee.name, updated_employee.age, updated_employee.address ? updated_employee.address : '', updated_employee.salary, id])
    return {
        status: "success",
        data: result.rowCount
    }    
}

async function patch_employee(id, updated_employee) {
    // add try-catch to figure out if there was
    // a unique constrain error, if so the user should get error-400
    const query_arr = []
    for (let key in updated_employee) {
        query_arr.push(`${key}='${updated_employee[key]}'`)
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

async function delete_employee(id) {
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

